import React, { useState } from "react";
import { Button, Table, Space, Modal, Form, Input, Select, message, Tag, Popconfirm, Drawer, Descriptions } from "antd";
import {
    PlusCircleFilled,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    LockOutlined,
    UnlockOutlined,
    KeyOutlined
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import dayjs from 'dayjs';
import * as AdminServices from "../../services/AdminServices";

const ListAdmin = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [viewingAdmin, setViewingAdmin] = useState(null);
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const queryClient = useQueryClient();
    const user = useSelector((state) => state.user);

    // Fetch all admins
    const { data: adminsData, isLoading } = useQuery({
        queryKey: ['admins'],
        queryFn: () => AdminServices.getAllAdminAccounts(user?.access_token),
        enabled: !!user?.access_token
    });

    // Fetch role templates
    const { data: rolesData } = useQuery({
        queryKey: ['roleTemplates'],
        queryFn: () => AdminServices.getAllRoleTemplates(user?.access_token),
        enabled: !!user?.access_token
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data) => AdminServices.createAdminAccount(data, user?.access_token),
        onSuccess: () => {
            message.success('Tạo tài khoản admin thành công!');
            setIsModalOpen(false);
            form.resetFields();
            queryClient.invalidateQueries(['admins']);
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Tạo tài khoản thất bại!');
        }
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => AdminServices.updateAdminAccount(id, data, user?.access_token),
        onSuccess: () => {
            message.success('Cập nhật thành công!');
            setIsModalOpen(false);
            setEditingAdmin(null);
            form.resetFields();
            queryClient.invalidateQueries(['admins']);
        },
        onError: () => {
            message.error('Cập nhật thất bại!');
        }
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => AdminServices.deleteAdminAccount(id, user?.access_token),
        onSuccess: () => {
            message.success('Đã khóa tài khoản admin!');
            queryClient.invalidateQueries(['admins']);
        },
        onError: () => {
            message.error('Thao tác thất bại!');
        }
    });

    // Change password mutation
    const changePasswordMutation = useMutation({
        mutationFn: ({ id, data }) => AdminServices.changeAdminPassword(id, data, user?.access_token),
        onSuccess: () => {
            message.success('Đổi mật khẩu thành công!');
            setIsPasswordModalOpen(false);
            passwordForm.resetFields();
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Đổi mật khẩu thất bại!');
        }
    });

    const getRoleBadge = (role) => {
        const roleConfig = {
            'super_admin': { color: 'red', text: 'Super Admin' },
            'support_staff': { color: 'blue', text: 'Nhân viên HT' },
            'warehouse_staff': { color: 'green', text: 'Nhân viên Kho' },
            'content_staff': { color: 'orange', text: 'Nhân viên Content' }
        };
        const config = roleConfig[role] || { color: 'default', text: role };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const columns = [
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
            width: 120,
            render: (role) => getRoleBadge(role)
        },
        {
            title: 'Mã NV',
            key: 'employeeId',
            width: 120,
            render: (_, record) => record.employeeInfo?.employeeId || '-'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isLocked',
            key: 'isLocked',
            width: 120,
            align: 'center',
            render: (isLocked) => isLocked ?
                <Tag color="red" icon={<LockOutlined />}>Đã khóa</Tag> :
                <Tag color="green" icon={<UnlockOutlined />}>Hoạt động</Tag>
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 250,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleViewDetail(record)}
                    >
                        Xem
                    </Button>
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        icon={<KeyOutlined />}
                        size="small"
                        onClick={() => handleChangePassword(record)}
                    >
                        Đổi MK
                    </Button>
                    {record.role !== 'super_admin' && (
                        <Popconfirm
                            title="Khóa tài khoản admin"
                            description="Bạn có chắc muốn khóa tài khoản này?"
                            onConfirm={() => deleteMutation.mutate(record._id)}
                            okText="Khóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                        >
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                            >
                                Khóa
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        setEditingAdmin(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingAdmin(record);
        form.setFieldsValue({
            name: record.name,
            email: record.email,
            phone: record.phone,
            role: record.role,
            'employeeInfo.employeeId': record.employeeInfo?.employeeId,
            'employeeInfo.department': record.employeeInfo?.department,
            'employeeInfo.notes': record.employeeInfo?.notes
        });
        setIsModalOpen(true);
    };

    const handleViewDetail = (record) => {
        setViewingAdmin(record);
        setIsDetailDrawerOpen(true);
    };

    const handleChangePassword = (record) => {
        setEditingAdmin(record);
        passwordForm.resetFields();
        setIsPasswordModalOpen(true);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            const adminData = {
                name: values.name,
                email: values.email,
                phone: values.phone,
                role: values.role,
                employeeInfo: {
                    employeeId: values['employeeInfo.employeeId'],
                    department: values['employeeInfo.department'],
                    notes: values['employeeInfo.notes']
                }
            };

            if (editingAdmin) {
                updateMutation.mutate({
                    id: editingAdmin._id,
                    data: adminData
                });
            } else {
                if (!values.password || !values.confirmPassword) {
                    message.error('Vui lòng nhập mật khẩu!');
                    return;
                }
                if (values.password !== values.confirmPassword) {
                    message.error('Mật khẩu không khớp!');
                    return;
                }
                createMutation.mutate({
                    ...adminData,
                    password: values.password,
                    confirmPassword: values.confirmPassword
                });
            }
        });
    };

    const handlePasswordModalOk = () => {
        passwordForm.validateFields().then((values) => {
            changePasswordMutation.mutate({
                id: editingAdmin._id,
                data: {
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword
                }
            });
        });
    };

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Quản lý Tài khoản Admin</h2>
                <Button
                    type="primary"
                    icon={<PlusCircleFilled />}
                    onClick={handleAdd}
                    size="large"
                >
                    Thêm Admin mới
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={adminsData?.data || []}
                loading={isLoading}
                rowKey="_id"
                scroll={{ x: 700 }}
                pagination={{
                    pageSize: 10,
                    showTotal: (total) => `Tổng ${total} admin`
                }}
            />

            {/* Modal Add/Edit */}
            <Modal
                title={editingAdmin ? "Chỉnh sửa Admin" : "Thêm Admin mới"}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingAdmin(null);
                    form.resetFields();
                }}
                width={680}
                confirmLoading={createMutation.isLoading || updateMutation.isLoading}
                okText={editingAdmin ? "Cập nhật" : "Thêm"}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
                    <Form.Item
                        label="Tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input placeholder="Nhập tên admin" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input placeholder="Nhập email" disabled={!!editingAdmin} />
                    </Form.Item>

                    {!editingAdmin && (
                        <>
                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                            >
                                <Input.Password placeholder="Nhập mật khẩu" />
                            </Form.Item>

                            <Form.Item
                                label="Xác nhận mật khẩu"
                                name="confirmPassword"
                                rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu không khớp!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="Nhập lại mật khẩu" />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item label="Số điện thoại" name="phone">
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        label="Vai trò"
                        name="role"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                        <Select placeholder="Chọn vai trò">
                            {rolesData?.data?.map(role => (
                                <Select.Option key={role.key} value={role.key}>
                                    {role.name} - {role.description}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Mã nhân viên" name="employeeInfo.employeeId">
                        <Input placeholder="Ví dụ: EMP001" />
                    </Form.Item>

                    <Form.Item label="Phòng ban" name="employeeInfo.department">
                        <Input placeholder="Ví dụ: Phòng CSKH" />
                    </Form.Item>

                    <Form.Item label="Ghi chú" name="employeeInfo.notes">
                        <Input.TextArea rows={3} placeholder="Ghi chú về nhân viên" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Change Password */}
            <Modal
                title="Đổi mật khẩu"
                open={isPasswordModalOpen}
                onOk={handlePasswordModalOk}
                onCancel={() => {
                    setIsPasswordModalOpen(false);
                    passwordForm.resetFields();
                }}
                confirmLoading={changePasswordMutation.isLoading}
                okText="Đổi mật khẩu"
                cancelText="Hủy"
            >
                <Form form={passwordForm} layout="vertical" style={{ marginTop: 20 }}>
                    <Form.Item
                        label="Mật khẩu hiện tại"
                        name="currentPassword"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu hiện tại" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Drawer Chi tiết */}
            <Drawer
                title="Chi tiết Admin"
                placement="right"
                width={500}
                onClose={() => setIsDetailDrawerOpen(false)}
                open={isDetailDrawerOpen}
            >
                {viewingAdmin && (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Tên">{viewingAdmin.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{viewingAdmin.email}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{viewingAdmin.phone || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Vai trò">{getRoleBadge(viewingAdmin.role)}</Descriptions.Item>
                        <Descriptions.Item label="Mã nhân viên">{viewingAdmin.employeeInfo?.employeeId || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Phòng ban">{viewingAdmin.employeeInfo?.department || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">{dayjs(viewingAdmin.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                        <Descriptions.Item label="Ghi chú">{viewingAdmin.employeeInfo?.notes || '-'}</Descriptions.Item>
                    </Descriptions>
                )}
            </Drawer>
        </div>
    );
};

export default ListAdmin;