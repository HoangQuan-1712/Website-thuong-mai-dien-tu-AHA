import { Menu } from "antd";
import React, { useState } from "react";
import { getItem } from "../../utils";
import { ProductOutlined, SettingOutlined, UserOutlined, WechatOutlined } from "@ant-design/icons";
import ListUser from "../../components/AdminUser/ListUser";
import ListAdmin from "../../components/AdminUser/ListAdmin";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import RoleManagement from "../../components/AdminUser/RoleManagement";
import AdminChatPage from "../../components/AdminChat/AdminChatPage";
import { usePermissions } from "../../components/WithPermission/withPermission";

const AdminPage = () => {
    const { hasPermission, hasAllPermissions, isLoading } = usePermissions();
    const rootSubmenuKeys = ['sub1', 'sub2', 'sub4', 'sub5'];
    const [openKeys, setOpenKeys] = useState(['sub1']);
    const [keySelected, setKeySelected] = useState('');

    // Tạo menu items dựa trên quyền của user
    const items = [
        // Quản lý người dùng
        getItem(
            'Quản lý người dùng',
            'sub1',
            <UserOutlined style={{ fontSize: 24, paddingLeft: 20 }} />,
            [
                hasPermission('canViewUsers') && getItem('Danh sách người dùng', '1'),
                hasPermission('canManageAdmins') && getItem('Tài khoản Admin', '2'),
                hasPermission('canManageRoles') && getItem('Phân quyền', '3'),
            ].filter(Boolean)
        ),

        // Quản lý sản phẩm
        getItem(
            'Quản lý sản phẩm',
            'sub2',
            <ProductOutlined style={{ fontSize: 24, paddingLeft: 20 }} />,
            [
                hasAllPermissions(['canViewProducts', 'canCreateProducts']) && getItem('Quản lý sản phẩm', '4'),
                hasPermission('canViewProducts') && getItem('Option 5', '5'),
                getItem('Submenu', 'sub3', null, [
                    getItem('Option 7', '7'),
                    getItem('Option 8', '8')
                ]),
            ].filter(Boolean)
        ),

        // Quản lý đơn hàng
        getItem(
            'Quản lý đơn hàng',
            'sub4',
            <SettingOutlined style={{ fontSize: 24, paddingLeft: 20 }} />,
            [
                getItem('Option 9', '9'),
                getItem('Option 10', '10'),
                getItem('Option 11', '11'),
                getItem('Option 12', '12'),
            ]
        ),

        // Chat/CSKH - UPDATED
        getItem(
            'Chat & CSKH',
            'sub5',
            <WechatOutlined style={{ fontSize: 24, paddingLeft: 20 }} />,
            [
                getItem('Quản lý Chat', '13'), // Thêm item này
            ]
        ),
    ].filter(item => {
        if (item?.children && item.children.length === 0) {
            return false;
        }
        return true;
    });

    const RenderPage = (key) => {
        switch (key) {
            case '1':
                return hasPermission('canViewUsers') ? <ListUser /> : null;
            case '2':
                return hasPermission('canManageAdmins') ? <ListAdmin /> : null;
            case '3':
                return hasPermission('canManageRoles') ? <RoleManagement /> : null;
            case '4':
                return hasAllPermissions(['canViewProducts', 'canCreateProducts']) ? <AdminProduct /> : null;
            case '13': // Thêm case mới cho Chat
                return <AdminChatPage />;
            default:
                return <></>;
        }
    };

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    const handleOnClick = ({ item, key, keyPath, domEvent }) => {
        console.log('click', { item, key, keyPath, domEvent });
        setKeySelected(key);
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>Đang tải...</div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex' }}>
            <Menu
                mode="inline"
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                style={{
                    width: 256,
                    boxShadow: '1px 1px 2px #ccc',
                    height: '100vh'
                }}
                items={items}
                onClick={handleOnClick}
            />
            <div style={{ flex: '1', padding: '15px', overflow: 'auto' }}>
                {RenderPage(keySelected)}
            </div>
        </div>
    );
};

export default AdminPage;