import { axiosJWT } from "./UserServices";

const baseUrl = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "/");
const buildUrl = (path) => `${baseUrl}${String(path).replace(/^\/+/, "")}`;

// Lấy tất cả conversations (cho admin)
export const getAllConversations = async (access_token) => {
    const res = await axiosJWT.get(
        buildUrl('admin/chat/conversations'),
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    );
    return res.data;
};

// Lấy messages của một conversation
export const getConversationMessages = async (conversationId, access_token) => {
    const res = await axiosJWT.get(
        buildUrl(`admin/chat/conversations/${conversationId}/messages`),
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    );
    return res.data;
};

// Assign admin vào conversation
export const assignConversation = async (conversationId, access_token) => {
    const res = await axiosJWT.post(
        buildUrl(`admin/chat/conversations/${conversationId}/assign`),
        {},
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    );
    return res.data;
};

// Đánh dấu conversation đã đọc
export const markAsRead = async (conversationId, access_token) => {
    const res = await axiosJWT.put(
        buildUrl(`admin/chat/conversations/${conversationId}/read`),
        {},
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    );
    return res.data;
};

// Đóng conversation (resolved)
export const resolveConversation = async (conversationId, access_token) => {
    const res = await axiosJWT.put(
        buildUrl(`admin/chat/conversations/${conversationId}/resolve`),
        {},
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    );
    return res.data;
};

// Lấy thống kê
export const getChatStats = async (access_token) => {
    const res = await axiosJWT.get(
        buildUrl('admin/chat/stats'),
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    );
    return res.data;
};