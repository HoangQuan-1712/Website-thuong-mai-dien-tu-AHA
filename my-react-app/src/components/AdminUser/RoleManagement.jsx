import React, { useState } from "react";
import { Card, Table, Tag, Button, Modal, Checkbox, Row, Col, Space, Divider, message } from "antd";
import { SafetyCertificateOutlined, EditOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import * as AdminServices from "../../services/AdminServices";

const RoleManagement = () => {
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [customPermissions, setCustomPermissions] = useState({});
    const queryClient = useQueryClient();
    const user = useSelector((state) => state.user);

    // Fetch role templates
    const { data: rolesData, isLoading: rolesLoading } = useQuery({
        queryKey: ['roleTemplates'],
        queryFn: () => AdminServices.getAllRoleTemplates(user?.access_token),
        enabled: !!user?.access_token
    });

    // Fetch all admins to show their roles
    const { data: adminsData, isLoading: adminsLoading } = useQuery({
        queryKey: ['admins'],
        queryFn: () => AdminServices.getAllAdminAccounts(user?.access_token),
        enabled: !!user?.access_token
    });

    // Update permissions mutation
    const updatePermissionsMutation = useMutation({
        mutationFn: ({ userId, permissions }) =>
            AdminServices.updateUserPermissions(userId, permissions, user?.access_token),
        onSuccess: () => {
            message.success('Cập nhật quyền thành công!');
            setIsPermissionModalOpen(false);
            setSelectedUser(null);
            queryClient.invalidateQueries(['admins']);
        },
        onError: () => {
            message.error('Cập nhật quyền thất bại!');
        }
    });

    // Permission categories
    const permissionCategories = {
        'Quản lý Người dùng': [
            { key: 'canViewUsers', label: 'Xem danh sách người dùng' },
            { key: 'canCreateUsers', label: 'Tạo người dùng mới' },
            { key: 'canUpdateUsers', label: 'Cập nhật người dùng' },
            { key: 'canDeleteUsers', label: 'Xóa người dùng' },
        ],
        'Quản lý Sản phẩm': [
            { key: 'canViewProducts', label: 'Xem danh sách sản phẩm' },
            { key: 'canCreateProducts', label: 'Tạo sản phẩm mới' },
            { key: 'canUpdateProducts', label: 'Cập nhật sản phẩm' },
            { key: 'canDeleteProducts', label: 'Xóa sản phẩm' },
        ],
        'Quản lý Đơn hàng': [
            { key: 'canViewOrders', label: 'Xem danh sách đơn hàng' },
            { key: 'canUpdateOrders', label: 'Cập nhật đơn hàng' },
            { key: 'canDeleteOrders', label: 'Xóa đơn hàng' },
        ],
        'Hệ thống': [
            { key: 'canAccessChat', label: 'Truy cập Chat/CSKH' },
            { key: 'canManageAdmins', label: 'Quản lý Admin' },
            { key: 'canManageRoles', label: 'Quản lý Phân quyền' },
        ]
    };

    const getRoleBadge = (role) => {
        const roleConfig = {
            'super_admin': { color: 'red', text: 'Super Admin' },
            'support_staff': { color: 'blue', text: 'Nhân viên Hỗ trợ' },
            'warehouse_staff': { color: 'green', text: 'Nhân viên Kho' },
            'content_staff': { color: 'orange', text: 'Nhân viên Content' }
        };
        const config = roleConfig[role] || { color: 'default', text: role };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const handleEditPermissions = (admin) => {
        setSelectedUser(admin);
        setCustomPermissions(admin.permissions || {});
        setIsPermissionModalOpen(true);
    };

    const handlePermissionChange = (permissionKey, checked) => {
        setCustomPermissions(prev => ({
            ...prev,
            [permissionKey]: checked
        }));
    };

    const handleSavePermissions = () => {
        if (!selectedUser) return;

        updatePermissionsMutation.mutate({
            userId: selectedUser._id,
            permissions: customPermissions
        });
    };

    // Columns for Role Templates table
    const roleColumns = [
        {
            title: 'Vai trò',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text, record) => (
                <Space>
                    <SafetyCertificateOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                    <strong>{text}</strong>
                </Space>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Quyền',
            dataIndex: 'permissions',
            key: 'permissions',
            render: (permissions) => {
                const enabledPermissions = Object.entries(permissions)
                    .filter(([_, value]) => value)
                    .map(([key, _]) => {
                        // Find label
                        for (const category of Object.values(permissionCategories)) {
                            const perm = category.find(p => p.key === key);
                            if (perm) return perm.label;
                        }
                        return key;
                    });

                return (
                    <div>
                        {enabledPermissions.slice(0, 3).map((label, index) => (
                            <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                                {label}
                            </Tag>
                        ))}
                        {enabledPermissions.length > 3 && (
                            <Tag color="default">+{enabledPermissions.length - 3} quyền khác</Tag>
                        )}
                    </div>
                );
            }
        }
    ];

    // Columns for Admin Accounts with Roles
    const adminColumns = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            render: (_, __, index) => index + 1,
            align: 'center'
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            width: 150,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            width: 150,
            render: (role) => getRoleBadge(role)
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isLocked',
            key: 'isLocked',
            width: 120,
            align: 'center',
            render: (isLocked) => isLocked ?
                <Tag color="red">Đã khóa</Tag> :
                <Tag color="green">Hoạt động</Tag>
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => handleEditPermissions(record)}
                >
                    Tùy chỉnh quyền
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h2>Quản lý Phân quyền</h2>

            {/* Role Templates Section */}
            <Card
                title={
                    <Space>
                        <SafetyCertificateOutlined style={{ fontSize: 20 }} />
                        <span>Các vai trò mặc định</span>
                    </Space>
                }
                style={{ marginBottom: 24 }}
            >
                <Table
                    columns={roleColumns}
                    dataSource={rolesData?.data || []}
                    loading={rolesLoading}
                    rowKey="key"
                    pagination={false}
                />
            </Card>

            {/* Admin Accounts with Roles */}
            <Card
                title="Phân quyền cho tài khoản Admin"
                style={{ marginBottom: 24 }}
            >
                <Table
                    columns={adminColumns}
                    dataSource={adminsData?.data || []}
                    loading={adminsLoading}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                        showTotal: (total) => `Tổng ${total} admin`
                    }}
                />
            </Card>

            {/* Custom Permissions Modal */}
            <Modal
                title={`Tùy chỉnh quyền - ${selectedUser?.name}`}
                open={isPermissionModalOpen}
                onOk={handleSavePermissions}
                onCancel={() => {
                    setIsPermissionModalOpen(false);
                    setSelectedUser(null);
                }}
                width={800}
                confirmLoading={updatePermissionsMutation.isLoading}
                okText="Lưu thay đổi"
                cancelText="Hủy"
            >
                {selectedUser && (
                    <div style={{ marginTop: 20 }}>
                        <div style={{ marginBottom: 16 }}>
                            <strong>Vai trò hiện tại:</strong> {getRoleBadge(selectedUser.role)}
                        </div>
                        <Divider />

                        {Object.entries(permissionCategories).map(([category, permissions]) => (
                            <div key={category} style={{ marginBottom: 24 }}>
                                <h4 style={{ color: '#1890ff', marginBottom: 12 }}>
                                    {category}
                                </h4>
                                <Row gutter={[16, 16]}>
                                    {permissions.map(permission => (
                                        <Col span={12} key={permission.key}>
                                            <Checkbox
                                                checked={customPermissions[permission.key] || false}
                                                onChange={(e) => handlePermissionChange(permission.key, e.target.checked)}
                                            >
                                                {permission.label}
                                            </Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        ))}

                        <Divider />
                        <div style={{
                            background: '#fff7e6',
                            border: '1px solid #ffd591',
                            padding: '12px',
                            borderRadius: '4px'
                        }}>
                            <strong>⚠️ Lưu ý:</strong> Thay đổi quyền sẽ ghi đè các quyền mặc định của vai trò.
                            Bạn có thể quay lại vai trò mặc định bằng cách chỉnh sửa vai trò trong "Quản lý Tài khoản Admin".
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default RoleManagement;