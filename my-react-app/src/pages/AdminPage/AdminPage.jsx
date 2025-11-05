import { Menu } from "antd";
import React, { useState } from "react";
import { getItem } from "../../utils";
import { ProductOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import ListUser from "../../components/AdminUser/ListUser";
import ListAdmin from "../../components/AdminUser/ListAdmin";
import AdminProduct from "../../components/AdminProduct/AdminProduct";

const AdminPage = () => {
    const items = [
        getItem('Quản lý người dùng', 'sub1', <UserOutlined style={{ fontSize: 24, paddingLeft: 20 }} />, [
            getItem('Danh sách người dùng', '1'),
            getItem('Tài khoản Admin ', '2'),
        ]),
        getItem('Quản lý sản phẩm', 'sub2', <ProductOutlined style={{ fontSize: 24, paddingLeft: 20 }} />, [
            getItem('Option 5', '3'),
            getItem('Option 6', '4'),
            getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
        ]),
        getItem('Quản lý đơn hàng', 'sub4', <SettingOutlined />, [
            getItem('Option 9', '9'),
            getItem('Option 10', '10'),
            getItem('Option 11', '11'),
            getItem('Option 12', '12'),
        ]),
    ];
    const rootSubmenuKeys = ['user', 'product'];
    const [openKeys, setOpenKeys] = useState(['user']);
    const [keySelected, setKeySelected] = useState('')

    const RenderPage = (key) => {
        switch (key) {
            case '1':
                return (
                    <ListUser />
                )
            case '2':
                return (
                    <ListAdmin />
                )
            case '3':
                return (
                    <AdminProduct />
                )
            default:
                return <></>
        }
    }

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
        setKeySelected(key)
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
            <div style={{ flex: '1', padding: '15px' }}>
                {RenderPage(keySelected)}
            </div>
        </div>
    )
}

export default AdminPage