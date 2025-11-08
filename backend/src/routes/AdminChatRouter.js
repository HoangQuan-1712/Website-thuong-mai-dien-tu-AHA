const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const Conversation = require('../models/ConversationModel');
const Message = require('../models/MessageModel');

// 1. Lấy danh sách tất cả conversations (cho admin)
router.get('/conversations', authMiddleware, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: { $elemMatch: { $exists: true } }
        })
            .populate('participants', 'name avatar email')
            .populate('assignedAdmin', 'name avatar')
            .populate('lastMessage.sender', 'name avatar')
            .sort({ updatedAt: -1 });

        res.status(200).json({ status: 'OK', data: conversations });
    } catch (e) {
        res.status(500).json({ status: 'ERR', message: e.message });
    }
});

// 2. Assign admin vào conversation (tự động khi admin reply)
router.post('/conversations/:id/assign', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;

        const conversation = await Conversation.findById(id);

        if (!conversation) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Conversation không tồn tại'
            });
        }

        // Nếu đã có admin assign và không phải là admin hiện tại
        if (conversation.assignedAdmin &&
            conversation.assignedAdmin.toString() !== adminId) {
            return res.status(403).json({
                status: 'ERR',
                message: 'Conversation này đã được admin khác xử lý'
            });
        }

        // Assign admin và cập nhật status
        conversation.assignedAdmin = adminId;
        conversation.status = 'assigned';
        conversation.hasUnreadForAdmin = false;
        await conversation.save();

        const updatedConversation = await Conversation.findById(id)
            .populate('participants', 'name avatar email')
            .populate('assignedAdmin', 'name avatar');

        res.status(200).json({
            status: 'OK',
            data: updatedConversation
        });
    } catch (e) {
        res.status(500).json({ status: 'ERR', message: e.message });
    }
});

// 3. Lấy tin nhắn của conversation (cho admin)
router.get('/conversations/:id/messages', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra conversation tồn tại
        const conversation = await Conversation.findById(id);
        if (!conversation) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Conversation không tồn tại'
            });
        }

        const messages = await Message.find({ conversationId: id })
            .populate('sender', 'name avatar')
            .sort({ createdAt: 'asc' });

        res.status(200).json({ status: 'OK', data: messages });
    } catch (e) {
        res.status(500).json({ status: 'ERR', message: e.message });
    }
});

// 4. Đánh dấu conversation đã đọc (cho admin)
router.put('/conversations/:id/read', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        await Conversation.findByIdAndUpdate(id, {
            hasUnreadForAdmin: false
        });

        res.status(200).json({ status: 'OK', message: 'Đã đánh dấu đã đọc' });
    } catch (e) {
        res.status(500).json({ status: 'ERR', message: e.message });
    }
});

// 5. Đóng conversation (resolved)
router.put('/conversations/:id/resolve', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;

        const conversation = await Conversation.findById(id);

        if (!conversation) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Conversation không tồn tại'
            });
        }

        // Chỉ admin được assign mới có quyền đóng
        if (conversation.assignedAdmin &&
            conversation.assignedAdmin.toString() !== adminId) {
            return res.status(403).json({
                status: 'ERR',
                message: 'Chỉ admin được assign mới có thể đóng conversation'
            });
        }

        conversation.status = 'resolved';
        await conversation.save();

        res.status(200).json({ status: 'OK', data: conversation });
    } catch (e) {
        res.status(500).json({ status: 'ERR', message: e.message });
    }
});

// 6. Lấy thống kê cho admin dashboard
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const adminId = req.user.id;

        const [total, pending, assigned, myConversations] = await Promise.all([
            Conversation.countDocuments(),
            Conversation.countDocuments({ status: 'pending' }),
            Conversation.countDocuments({ status: 'assigned' }),
            Conversation.countDocuments({ assignedAdmin: adminId })
        ]);

        res.status(200).json({
            status: 'OK',
            data: {
                total,
                pending,
                assigned,
                myConversations
            }
        });
    } catch (e) {
        res.status(500).json({ status: 'ERR', message: e.message });
    }
});

module.exports = router;

