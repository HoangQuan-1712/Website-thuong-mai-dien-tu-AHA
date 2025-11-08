import { axiosJWT } from "./UserServices";

const baseUrl = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "/");
const buildUrl = (path) => `${baseUrl}${String(path).replace(/^\/+/, "")}`;

export const getAllConversations = async (access_token) => {
    const res = await axiosJWT.get(
        buildUrl('conversations'),
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    );
    return res.data;
};

export const getMessages = async (conversationId, access_token) => {
    const res = await axiosJWT.get(
        buildUrl(`messages/${conversationId}`),
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    );
    return res.data;
};

export const findOrCreateSupportChat = async (access_token) => {
    const res = await axiosJWT.post(
        buildUrl('conversations/support'),
        {},
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    );
    return res.data;
};