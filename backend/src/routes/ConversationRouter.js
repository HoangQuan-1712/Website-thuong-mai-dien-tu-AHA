const express = require('express');
const router = express.Router();
const { authChatMiddleware } = require('../middleware/chatMiddleware');
const Conversation = require('../models/ConversationModel');
const User = require('../models/UserModel');

// Lấy tất cả cuộc hội thoại của user
router.get('/', authChatMiddleware, async (req, res) => {
    try {
        console.log(`📋 User ${req.user.id} đang lấy conversations`);

        const conversations = await Conversation.find({ participants: req.user.id })
            .populate('participants', 'name avatar email')
            .populate('assignedAdmin', 'name avatar')
            .populate('lastMessage.sender', 'name avatar')
            .sort({ updatedAt: -1 });

        res.status(200).json({ status: 'OK', data: conversations });
    } catch (e) {
        console.error('❌ Error getting conversations:', e);
        res.status(500).json({ status: 'ERR', message: e.message });
    }
});

// API: Lấy danh sách admin có thể chat
router.get('/admins', authChatMiddleware, async (req, res) => {
    try {
        const admins = await User.find({ isAdmin: true })
            .select('_id name avatar email')
            .limit(10);

        res.status(200).json({
            status: 'OK',
            data: admins,
            total: admins.length
        });
    } catch (e) {
        res.status(500).json({ status: 'ERR', message: e.message });
    }
});

// API: Tạo conversation với admin (support)
router.post('/support', authChatMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { adminId } = req.body;

        console.log(`📞 User ${userId} đang tạo support conversation`);

        let selectedAdminId;

        if (adminId) {
            const admin = await User.findOne({ _id: adminId, isAdmin: true });
            if (!admin) {
                return res.status(404).json({
                    status: 'ERR',
                    message: 'Admin không tồn tại'
                });
            }
            selectedAdminId = adminId;
        } else {
            const admins = await User.find({ isAdmin: true }).select('_id').limit(1);

            if (!admins || admins.length === 0) {
                return res.status(404).json({
                    status: 'ERR',
                    message: 'Không tìm thấy admin trong hệ thống'
                });
            }

            selectedAdminId = admins[0]._id.toString();
        }

        // Kiểm tra conversation đã tồn tại
        let conversation = await Conversation.findOne({
            participants: userId,
            status: { $in: ['pending', 'assigned'] }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [userId, selectedAdminId],
                status: 'pending',
                hasUnreadForAdmin: false
            });
            await conversation.save();
            console.log(`✅ Đã tạo conversation mới: ${conversation._id}`);
        } else {
            console.log(`✅ Tìm thấy conversation: ${conversation._id}`);
        }

        const fullConversation = await Conversation.findById(conversation._id)
            .populate('participants', 'name avatar email')
            .populate('assignedAdmin', 'name avatar');

        res.status(200).json({ status: 'OK', data: fullConversation });

    } catch (e) {
        console.error('❌ Lỗi tạo support chat:', e);
        res.status(500).json({ status: 'ERR', message: e.message });
    }
});

module.exports = router;