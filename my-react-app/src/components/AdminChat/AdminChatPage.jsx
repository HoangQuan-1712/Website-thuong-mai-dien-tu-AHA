import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Input, Button, Avatar, Badge, Tag, Space, Typography, Spin, message, Row, Col } from 'antd';
import { SendOutlined, UserOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useSocket } from '../../context/SocketContext';
import * as AdminChatService from '../../services/AdminChatService';
import './AdminChatPage.css';

const { Text, Title } = Typography;
const { TextArea } = Input;

const AdminChatPage = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageText, setMessageText] = useState('');
    const user = useSelector((state) => state.user);
    const { socket } = useSocket();
    const queryClient = useQueryClient();
    const messagesEndRef = useRef(null);

    // Lấy danh sách conversations
    const { data: conversationsData, isLoading: loadingConversations } = useQuery({
        queryKey: ['adminConversations'],
        queryFn: () => AdminChatService.getAllConversations(user?.access_token),
        enabled: !!user?.access_token,
        refetchInterval: 10000, // Refresh mỗi 10s
    });

    // Lấy messages của conversation được chọn
    const { data: messagesData, isLoading: loadingMessages } = useQuery({
        queryKey: ['adminMessages', selectedConversation?._id],
        queryFn: () => AdminChatService.getConversationMessages(
            selectedConversation._id,
            user?.access_token
        ),
        enabled: !!selectedConversation?._id && !!user?.access_token,
    });

    // Lấy thống kê
    const { data: statsData } = useQuery({
        queryKey: ['adminChatStats'],
        queryFn: () => AdminChatService.getChatStats(user?.access_token),
        enabled: !!user?.access_token,
        refetchInterval: 30000,
    });

    // Mutation để assign conversation
    const assignMutation = useMutation({
        mutationFn: (conversationId) =>
            AdminChatService.assignConversation(conversationId, user?.access_token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminConversations']);
            message.success('Đã nhận xử lý conversation');
        },
        onError: (error) => {
            message.error(error.response?.data?.message || 'Không thể assign conversation');
        }
    });

    // Socket.IO: Lắng nghe tin nhắn mới
    useEffect(() => {
        if (!socket) return;

        // Join vào room admins để nhận thông báo
        socket.emit('joinRoom', 'admins');

        // Lắng nghe tin nhắn mới
        const handleReceiveMessage = (newMessage) => {
            // Cập nhật messages nếu đang xem conversation đó
            if (selectedConversation &&
                newMessage.conversationId === selectedConversation._id) {
                queryClient.setQueryData(
                    ['adminMessages', selectedConversation._id],
                    (oldData) => {
                        const oldMessages = oldData?.data || [];
                        return { ...oldData, data: [...oldMessages, newMessage] };
                    }
                );
            }

            // Refresh danh sách conversations
            queryClient.invalidateQueries(['adminConversations']);
        };

        // Lắng nghe conversation mới chưa assign
        const handleNewUnassigned = ({ conversation, message: msg }) => {
            message.info(`Tin nhắn mới từ ${conversation.participants[0]?.name}`);
            queryClient.invalidateQueries(['adminConversations']);
            queryClient.invalidateQueries(['adminChatStats']);
        };

        // Lắng nghe conversation được assign bởi admin khác
        const handleConversationAssigned = ({ conversationId, adminId }) => {
            if (selectedConversation?._id === conversationId && adminId !== user.id) {
                message.warning('Conversation này đã được admin khác xử lý');
                setSelectedConversation(null);
            }
            queryClient.invalidateQueries(['adminConversations']);
        };

        socket.on('receiveMessage', handleReceiveMessage);
        socket.on('newUnassignedMessage', handleNewUnassigned);
        socket.on('conversationAssigned', handleConversationAssigned);
        socket.on('conversationUpdated', () => {
            queryClient.invalidateQueries(['adminConversations']);
        });

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
            socket.off('newUnassignedMessage', handleNewUnassigned);
            socket.off('conversationAssigned', handleConversationAssigned);
            socket.off('conversationUpdated');
        };
    }, [socket, selectedConversation, queryClient, user.id]);

    // Khi chọn conversation
    const handleSelectConversation = async (conv) => {
        setSelectedConversation(conv);

        // Join vào room của conversation
        if (socket) {
            socket.emit('adminJoinConversation', conv._id);
        }

        // Đánh dấu đã đọc
        if (conv.hasUnreadForAdmin) {
            await AdminChatService.markAsRead(conv._id, user?.access_token);
            queryClient.invalidateQueries(['adminConversations']);
        }
    };

    // Gửi tin nhắn
    const handleSendMessage = () => {
        if (!socket || !messageText.trim() || !selectedConversation) return;

        const messageData = {
            conversationId: selectedConversation._id,
            senderId: user.id,
            text: messageText.trim(),
        };

        socket.emit('sendMessage', messageData);

        // Thêm tin nhắn tạm vào UI
        queryClient.setQueryData(
            ['adminMessages', selectedConversation._id],
            (oldData) => {
                const oldMessages = oldData?.data || [];
                const tempMessage = {
                    ...messageData,
                    _id: Date.now(),
                    sender: { _id: user.id, name: user.name, avatar: user.avatar },
                    createdAt: new Date().toISOString(),
                };
                return { ...oldData, data: [...oldMessages, tempMessage] };
            }
        );

        setMessageText('');
    };

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messagesData]);

    // Lấy customer từ conversation
    const getCustomer = (conv) => {
        return conv.participants?.find(p => p._id !== conv.assignedAdmin?._id);
    };

    const conversations = conversationsData?.data || [];
    const messages = messagesData?.data || [];
    const stats = statsData?.data || {};

    return (
        <div style={{
            padding: '20px',
            height: 'calc(100vh - 100px)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header với stats */}
            <Row gutter={16} style={{ marginBottom: 20, flexShrink: 0 }}>
                <Col span={6}>
                    <Card>
                        <Text type="secondary">Tổng conversations</Text>
                        <Title level={3}>{stats.total || 0}</Title>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Text type="secondary">Chờ xử lý</Text>
                        <Title level={3} style={{ color: '#ff4d4f' }}>
                            {stats.pending || 0}
                        </Title>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Text type="secondary">Đang xử lý</Text>
                        <Title level={3} style={{ color: '#1890ff' }}>
                            {stats.assigned || 0}
                        </Title>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Text type="secondary">Của tôi</Text>
                        <Title level={3} style={{ color: '#52c41a' }}>
                            {stats.myConversations || 0}
                        </Title>
                    </Card>
                </Col>
            </Row>

            {/* Main Chat Interface */}
            <div style={{
                display: 'flex',
                gap: 20,
                flex: 1,
                minHeight: 0,
                overflow: 'hidden'
            }}>
                {/* Danh sách conversations */}
                <Card
                    title="Danh sách hội thoại"
                    style={{
                        width: 350,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0
                    }}
                    bodyStyle={{
                        flex: 1,
                        overflow: 'auto',
                        padding: '12px'
                    }}
                    loading={loadingConversations}
                >
                    <List
                        dataSource={conversations}
                        renderItem={(conv) => {
                            const customer = getCustomer(conv);
                            const isSelected = selectedConversation?._id === conv._id;
                            const isMyConv = conv.assignedAdmin?._id === user.id;

                            return (
                                <List.Item
                                    onClick={() => handleSelectConversation(conv)}
                                    style={{
                                        cursor: 'pointer',
                                        background: isSelected ? '#e6f7ff' : 'transparent',
                                        padding: 12,
                                        borderRadius: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Badge dot={conv.hasUnreadForAdmin}>
                                                <Avatar
                                                    src={customer?.avatar}
                                                    icon={<UserOutlined />}
                                                />
                                            </Badge>
                                        }
                                        title={
                                            <Space>
                                                {customer?.name || 'Unknown User'}
                                                {conv.status === 'pending' && (
                                                    <Tag color="red" icon={<ClockCircleOutlined />}>
                                                        Chờ
                                                    </Tag>
                                                )}
                                                {conv.status === 'assigned' && isMyConv && (
                                                    <Tag color="green" icon={<CheckCircleOutlined />}>
                                                        Của tôi
                                                    </Tag>
                                                )}
                                                {conv.status === 'assigned' && !isMyConv && (
                                                    <Tag color="blue">
                                                        {conv.assignedAdmin?.name}
                                                    </Tag>
                                                )}
                                            </Space>
                                        }
                                        description={
                                            <Text ellipsis style={{ fontSize: 12 }}>
                                                {conv.lastMessage?.text || 'Chưa có tin nhắn'}
                                            </Text>
                                        }
                                    />
                                </List.Item>
                            );
                        }}
                    />
                </Card>

                {/* Khu vực chat */}
                <Card
                    title={
                        selectedConversation ? (
                            <Space>
                                <Avatar
                                    src={getCustomer(selectedConversation)?.avatar}
                                    icon={<UserOutlined />}
                                />
                                <span>{getCustomer(selectedConversation)?.name}</span>
                                {selectedConversation.assignedAdmin?._id !== user.id &&
                                    selectedConversation.status === 'pending' && (
                                        <Button
                                            size="small"
                                            type="primary"
                                            onClick={() => assignMutation.mutate(selectedConversation._id)}
                                        >
                                            Nhận xử lý
                                        </Button>
                                    )}
                            </Space>
                        ) : (
                            'Chọn một hội thoại để bắt đầu'
                        )
                    }
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                        overflow: 'hidden'
                    }}
                    bodyStyle={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 0,
                        overflow: 'hidden',
                        minHeight: 0
                    }}
                >
                    {selectedConversation ? (
                        <>
                            {/* Messages - CHỈ SCROLL KHU VỰC NÀY */}
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                padding: 16,
                                background: '#f5f5f5',
                                minHeight: 0
                            }}>
                                {loadingMessages ? (
                                    <div style={{ textAlign: 'center', padding: 20 }}>
                                        <Spin />
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((msg) => {
                                            const isMe = msg.sender._id === user.id;
                                            return (
                                                <div
                                                    key={msg._id}
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: isMe ? 'flex-end' : 'flex-start',
                                                        marginBottom: 12,
                                                    }}
                                                >
                                                    <div style={{ maxWidth: '70%' }}>
                                                        {!isMe && (
                                                            <Text
                                                                type="secondary"
                                                                style={{
                                                                    fontSize: 12,
                                                                    marginLeft: 8
                                                                }}
                                                            >
                                                                {msg.sender.name}
                                                            </Text>
                                                        )}
                                                        <div
                                                            style={{
                                                                padding: '8px 12px',
                                                                borderRadius: 12,
                                                                background: isMe ? '#1890ff' : '#fff',
                                                                color: isMe ? '#fff' : '#000',
                                                            }}
                                                        >
                                                            {msg.text}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Input */}
                            <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
                                {selectedConversation.assignedAdmin?._id === user.id ||
                                    !selectedConversation.assignedAdmin ? (
                                    <Space.Compact style={{ width: '100%' }}>
                                        <TextArea
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            onPressEnter={(e) => {
                                                if (!e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                            placeholder="Nhập tin nhắn..."
                                            autoSize={{ minRows: 1, maxRows: 4 }}
                                        />
                                        <Button
                                            type="primary"
                                            icon={<SendOutlined />}
                                            onClick={handleSendMessage}
                                        >
                                            Gửi
                                        </Button>
                                    </Space.Compact>
                                ) : (
                                    <Text type="secondary">
                                        Conversation này đang được xử lý bởi {selectedConversation.assignedAdmin?.name}
                                    </Text>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text type="secondary">
                                Chọn một conversation để bắt đầu chat
                            </Text>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default AdminChatPage;