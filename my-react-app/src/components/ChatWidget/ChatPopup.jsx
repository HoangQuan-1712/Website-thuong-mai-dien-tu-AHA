import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Spin, Typography } from 'antd';
import { SendOutlined, CloseOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import * as ChatServices from '../../services/ChatServices';
import { useSocket } from '../../context/SocketContext';
import './ChatPopup.css';

const { Title } = Typography;

const ChatPopup = ({ onClose }) => {
    const [text, setText] = useState('');
    const user = useSelector((state) => state.user);
    const { socket } = useSocket();
    const queryClient = useQueryClient();
    const messageEndRef = useRef(null);

    // 1. Tìm hoặc tạo cuộc hội thoại với Support
    const { data: convData, isLoading: isLoadingConv } = useQuery({
        queryKey: ['supportConversation', user?.id],
        queryFn: () => ChatServices.findOrCreateSupportChat(user?.access_token),
        enabled: !!user?.access_token,
    });

    const conversation = convData?.data;
    const conversationId = conversation?._id;

    // 2. Lấy lịch sử tin nhắn
    const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
        queryKey: ['messages', conversationId],
        queryFn: () => ChatServices.getMessages(conversationId, user?.access_token),
        enabled: !!conversationId && !!user?.access_token,
    });

    // 3. Lắng nghe tin nhắn mới (Real-time)
    useEffect(() => {
        if (!socket || !conversationId) return;

        const handleReceiveMessage = (newMessage) => {
            console.log('📩 User nhận tin nhắn mới:', newMessage);

            if (newMessage.conversationId === conversationId) {
                queryClient.setQueryData(['messages', conversationId], (oldData) => {
                    const oldMessages = oldData?.data || [];

                    // Kiểm tra xem tin nhắn đã tồn tại chưa (tránh duplicate)
                    const exists = oldMessages.some(msg => msg._id === newMessage._id);
                    if (exists) {
                        console.log('⚠️ Tin nhắn đã tồn tại, bỏ qua');
                        return oldData;
                    }

                    return { ...oldData, data: [...oldMessages, newMessage] };
                });
            }
        };

        console.log('🔌 User joining room:', conversationId);
        socket.emit('joinRoom', conversationId);
        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, [socket, conversationId, queryClient]);

    // 4. Auto-scroll xuống tin nhắn mới nhất
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messagesData]);

    // 5. Gửi tin nhắn
    const handleSend = () => {
        if (!socket || text.trim() === '' || !conversationId) {
            console.log('❌ Không thể gửi:', { socket: !!socket, text, conversationId });
            return;
        }

        const messageData = {
            conversationId: conversationId,
            senderId: user.id,
            text: text.trim(),
        };

        console.log('📤 User gửi tin nhắn:', messageData);
        socket.emit('sendMessage', messageData);

        // Thêm tin nhắn tạm vào UI
        queryClient.setQueryData(['messages', conversationId], (oldData) => {
            const oldMessages = oldData?.data || [];
            const tempMessage = {
                ...messageData,
                _id: 'temp_' + Date.now(),
                sender: { _id: user.id, name: user.name, avatar: user.avatar },
                createdAt: new Date().toISOString(),
            };
            return { ...oldData, data: [...oldMessages, tempMessage] };
        });

        setText('');
    };

    const isLoading = isLoadingConv || isLoadingMessages;
    const messages = messagesData?.data || [];

    return (
        <div className="chat-popup">
            {/* Header */}
            <div className="chat-popup-header">
                <Title level={5} style={{ margin: 0, color: 'white' }}>
                    Hỗ trợ Trực tuyến
                </Title>
                <Button
                    icon={<CloseOutlined />}
                    type="text"
                    onClick={onClose}
                    style={{ color: 'white' }}
                />
            </div>

            {/* Body - Danh sách tin nhắn - CHỈ SCROLL KHU VỰC NÀY */}
            <div className="chat-popup-body">
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin />
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => {
                            const isMe = msg.sender._id === user.id;
                            return (
                                <div
                                    key={msg._id}
                                    className={`chat-message ${isMe ? 'me' : 'them'}`}
                                >
                                    <span>{msg.text}</span>
                                </div>
                            );
                        })}
                        <div ref={messageEndRef} />
                    </>
                )}
            </div>

            {/* Footer - Input */}
            <div className="chat-popup-footer">
                <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onPressEnter={handleSend}
                    placeholder="Nhập tin nhắn..."
                    disabled={isLoading || !conversationId}
                />
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    disabled={isLoading || !conversationId}
                />
            </div>
        </div>
    );
};

export default ChatPopup;