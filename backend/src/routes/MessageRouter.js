const express = require('express');
const router = express.Router();
const { authChatMiddleware } = require('../middleware/chatMiddleware');
const Message = require('../models/MessageModel');
const Conversation = require('../models/ConversationModel');

// API: Lấy lịch sử tin nhắn của 1 conversation
router.get('/:conversationId', authChatMiddleware, async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;

        console.log(`📨 User ${userId} đang lấy messages từ conversation ${conversationId}`);

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Conversation không tồn tại'
            });
        }

        // Kiểm tra quyền truy cập
        const isParticipant = conversation.participants.some(
            p => p.toString() === userId
        );

        if (!isParticipant && !req.user.isAdmin) {
            return res.status(403).json({
                status: 'ERR',
                message: 'Bạn không có quyền truy cập conversation này'
            });
        }

        const messages = await Message.find({ conversationId: conversationId })
            .populate('sender', 'name avatar email')
            .sort({ createdAt: 'asc' });

        console.log(`✅ Đã lấy ${messages.length} tin nhắn`);

        res.status(200).json({ status: 'OK', data: messages });
    } catch (e) {
        console.error('❌ Lỗi khi lấy tin nhắn:', e);
        res.status(500).json({ status: 'ERR', message: e.message });
    }
});

module.exports = router;