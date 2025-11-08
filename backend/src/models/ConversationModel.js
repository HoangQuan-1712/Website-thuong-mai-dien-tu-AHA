const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    ],
    // Admin được assign để xử lý conversation này
    assignedAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    // Trạng thái conversation
    status: {
        type: String,
        enum: ['pending', 'assigned', 'resolved'],
        default: 'pending'
    },
    // Lưu tin nhắn cuối cùng để hiển thị preview
    lastMessage: {
        text: String,
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: Date
    },
    // Đánh dấu conversation chưa đọc (cho admin)
    hasUnreadForAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;