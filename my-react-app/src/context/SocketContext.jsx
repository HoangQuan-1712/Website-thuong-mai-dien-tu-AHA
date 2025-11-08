import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        // Chỉ kết nối khi user đã đăng nhập
        if (user?.access_token) {
            const socketUrl = (process.env.REACT_APP_API_URL || '').replace(/\/api\/?$/, '');

            console.log('🔌 Đang kết nối Socket.IO...', {
                originalUrl: process.env.REACT_APP_API_URL,
                socketUrl: socketUrl,
                userId: user.id,
                isAdmin: user.isAdmin
            });

            const newSocket = io(socketUrl, {
                auth: {
                    token: user.access_token
                },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            // Lắng nghe sự kiện kết nối
            newSocket.on('connect', () => {
                console.log('✅ Socket.IO connected:', newSocket.id);
            });

            newSocket.on('connect_error', (error) => {
                console.error('❌ Socket connection error:', error.message);
            });

            newSocket.on('disconnect', (reason) => {
                console.log('⚠️ Socket disconnected:', reason);
            });

            // Lắng nghe danh sách user online
            newSocket.on('getOnlineUsers', (users) => {
                console.log('👥 Online users updated:', users.length, 'users');
                setOnlineUsers(users);
            });

            setSocket(newSocket);

            // Cleanup khi unmount hoặc user logout
            return () => {
                console.log('🔌 Closing socket connection');
                newSocket.close();
            };
        } else {
            // Nếu user đăng xuất, đóng socket cũ
            if (socket) {
                console.log('🔌 User logged out, closing socket');
                socket.close();
                setSocket(null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.access_token, user?.id]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};