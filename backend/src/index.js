const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { startCronJobs } = require('./utils/cronJobs');
const addressRoutes = require('./routes/AddressRouter');
const locationRoutes = require('./routes/LocationRouter');
const messageRoutes = require('./routes/MessageRouter');
const conversationRoutes = require('./routes/ConversationRouter');
const { Server } = require("socket.io");
const http = require('http');
const jwt = require('jsonwebtoken');
const Message = require('./models/MessageModel');
const Conversation = require('./models/ConversationModel');

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://127.0.0.1:3000'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'token'],
    exposedHeaders: ['set-cookie']
};

// Socket.IO configuration
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true
    }
});

const onlineUsers = new Map(); // Lưu danh sách user online

// Socket.IO JWT Authentication Middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error: Token not provided'));
    }

    // ⚠️ QUAN TRỌNG: Sử dụng đúng tên biến môi trường
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            console.error('❌ Token verification failed:', err.message);
            return next(new Error('Authentication error: Invalid token'));
        }

        console.log('✅ Token verified for user:', user.id, '| isAdmin:', user.isAdmin);
        socket.user = user; // Gắn thông tin user vào socket
        next();
    });
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
    console.log(`✅ User ${socket.user.id} (${socket.user.isAdmin ? 'ADMIN' : 'USER'}) đã kết nối với socket ${socket.id}`);

    // Thêm user vào danh sách online
    onlineUsers.set(socket.user.id, socket.id);

    // Join vào room "admins" nếu là admin
    if (socket.user.isAdmin) {
        socket.join('admins');
        console.log(`👑 Admin ${socket.user.id} đã join room admins`);
    }

    // Gửi danh sách user online cho tất cả client
    io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));

    // Lắng nghe sự kiện "joinRoom"
    socket.on('joinRoom', (conversationId) => {
        socket.join(conversationId);
        console.log(`📥 User ${socket.user.id} đã join room ${conversationId}`);
    });

    // ⚠️ QUAN TRỌNG: Lắng nghe sự kiện "sendMessage"
    socket.on('sendMessage', async (messageData) => {
        console.log('📨 Nhận request gửi tin nhắn:', {
            from: socket.user.id,
            isAdmin: socket.user.isAdmin,
            conversationId: messageData.conversationId,
            text: messageData.text?.substring(0, 50) + '...'
        });

        try {
            // Bước 1: Lưu tin nhắn vào MongoDB
            const newMessage = new Message({
                conversationId: messageData.conversationId,
                sender: socket.user.id, // ⚠️ Dùng socket.user.id thay vì messageData.senderId
                text: messageData.text,
                isRead: false
            });

            const savedMessage = await newMessage.save();
            console.log('💾 Đã lưu tin nhắn vào DB:', savedMessage._id);

            // Populate sender info
            await savedMessage.populate('sender', 'name avatar email');

            // Bước 2: Cập nhật conversation
            const conversation = await Conversation.findById(messageData.conversationId);

            if (!conversation) {
                console.error('❌ Không tìm thấy conversation:', messageData.conversationId);
                socket.emit('messageError', { error: 'Conversation không tồn tại' });
                return;
            }

            // Cập nhật lastMessage
            conversation.lastMessage = {
                text: savedMessage.text,
                sender: savedMessage.sender._id,
                createdAt: savedMessage.createdAt
            };

            // Nếu người gửi là user (không phải admin)
            if (!socket.user.isAdmin) {
                // Nếu conversation chưa có admin assign
                if (!conversation.assignedAdmin) {
                    conversation.hasUnreadForAdmin = true;
                    conversation.status = 'pending';
                    console.log('📢 Tin nhắn mới từ user, chưa có admin assign');
                }
            } else {
                // Nếu admin gửi tin nhắn
                // Tự động assign admin nếu chưa có
                if (!conversation.assignedAdmin) {
                    conversation.assignedAdmin = socket.user.id;
                    conversation.status = 'assigned';
                    console.log('✅ Admin tự động assign conversation:', socket.user.id);
                }
            }

            await conversation.save();

            // Populate conversation để emit
            await conversation.populate('participants', 'name avatar email');
            await conversation.populate('assignedAdmin', 'name avatar');
            await conversation.populate('lastMessage.sender', 'name avatar');

            // Bước 3: Gửi tin nhắn real-time
            // Gửi đến room conversation (cho user và admin đang chat)
            io.to(messageData.conversationId).emit('receiveMessage', savedMessage);
            console.log(`✅ Đã emit 'receiveMessage' đến room ${messageData.conversationId}`);

            // Nếu là tin nhắn từ user và chưa có admin assign
            // Gửi thông báo đến tất cả admin
            if (!socket.user.isAdmin && !conversation.assignedAdmin) {
                io.to('admins').emit('newUnassignedMessage', {
                    conversation: conversation,
                    message: savedMessage
                });
                console.log('📢 Đã emit thông báo đến admin room');
            }

            // Cập nhật conversation list cho tất cả admin
            io.to('admins').emit('conversationUpdated', conversation);
            console.log('🔄 Đã emit conversationUpdated đến admins');

        } catch (error) {
            console.error('❌ Lỗi khi gửi tin nhắn:', error);
            socket.emit('messageError', { error: error.message });
        }
    });

    // Admin join vào conversation để nhận tin nhắn
    socket.on('adminJoinConversation', async (conversationId) => {
        try {
            socket.join(conversationId);
            console.log(`👑 Admin ${socket.user.id} joined conversation ${conversationId}`);

            // Tự động assign admin khi join (nếu chưa có admin)
            const conversation = await Conversation.findById(conversationId);
            if (conversation && !conversation.assignedAdmin) {
                conversation.assignedAdmin = socket.user.id;
                conversation.status = 'assigned';
                conversation.hasUnreadForAdmin = false;
                await conversation.save();

                console.log(`✅ Admin ${socket.user.id} đã được assign vào conversation ${conversationId}`);

                // Notify other admins
                socket.to('admins').emit('conversationAssigned', {
                    conversationId: conversationId,
                    adminId: socket.user.id
                });
            }
        } catch (error) {
            console.error('❌ Error joining conversation:', error);
        }
    });

    // Xử lý khi user ngắt kết nối
    socket.on('disconnect', () => {
        console.log(`❌ User ${socket.user.id} đã ngắt kết nối`);
        onlineUsers.delete(socket.user.id);
        io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
    });
});

// Express middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/address', addressRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);

routes(app);


// MongoDB connection
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('✅ Connected to MongoDB');
        startCronJobs();
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
    });

server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🔌 Socket.IO ready`);
});