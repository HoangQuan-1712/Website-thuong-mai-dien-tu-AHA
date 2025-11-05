import React, { useState } from "react";
import { WrapperHeader } from "./style";
import { Button, Table, Space, Modal, Form, Input, Select, DatePicker, message, Drawer, Tag, Popconfirm, Switch, Divider } from "antd";
import {
    PlusCircleFilled,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    ShoppingCartOutlined,
    LockOutlined,
    UnlockOutlined,
    KeyOutlined,
    SaveOutlined
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as UserServices from "../../services/UserServices";
import { useSelector } from "react-redux";
import dayjs from 'dayjs';

const ListUser = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
    const [isOrderHistoryDrawerOpen, setIsOrderHistoryDrawerOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [viewingUser, setViewingUser] = useState(null);
    const [accountStatus, setAccountStatus] = useState(null); // Trạng thái khóa/mở
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const user = useSelector((state) => state.user);

    // Fetch all users
    const { data: usersData, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await UserServices.getAllUser(100, 0, user?.access_token);
            return {
                ...res,
                data: res.data?.filter(u => !u.isAdmin) || []
            };
        },
        retry: 2
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (userId) => UserServices.deleteUser(userId, user?.access_token),
        onSuccess: () => {
            message.success('Xóa người dùng thành công!');
            queryClient.invalidateQueries(['users']);
        },
        onError: () => {
            message.error('Xóa người dùng thất bại!');
        }
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => UserServices.updateUser(id, data, user?.access_token),
        onSuccess: () => {
            message.success('Cập nhật thành công!');
            setIsModalOpen(false);
            setEditingUser(null);
            form.resetFields();
            queryClient.invalidateQueries(['users']);
        },
        onError: () => {
            message.error('Cập nhật thất bại!');
        }
    });

    // Update account status mutation
    const updateAccountStatusMutation = useMutation({
        mutationFn: ({ id, data }) => UserServices.updateUser(id, data, user?.access_token),
        onSuccess: () => {
            message.success('Cập nhật trạng thái tài khoản thành công!');
            queryClient.invalidateQueries(['users']);
            // Cập nhật lại viewingUser
            if (viewingUser) {
                setViewingUser({ ...viewingUser, isLocked: accountStatus });
            }
        },
        onError: () => {
            message.error('Cập nhật trạng thái thất bại!');
        }
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data) => UserServices.createUser(data),
        onSuccess: () => {
            message.success('Thêm người dùng thành công!');
            setIsModalOpen(false);
            form.resetFields();
            queryClient.invalidateQueries(['users']);
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || 'Thêm người dùng thất bại!');
        }
    });

    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 20,
            render: (_, __, index) => index + 1,
            align: 'center'
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            key: 'name',
            width: 50,
            render: (name) => name || <Tag color="default">Chưa cập nhật</Tag>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 50,
        },
        // {
        //     title: 'Số điện thoại',
        //     dataIndex: 'phone',
        //     key: 'phone',
        //     width: 100,
        //     render: (phone) => phone || <Tag color="default">Chưa có</Tag>
        // },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            width: 30,
            align: 'center',
            render: (gender) => {
                const genderMap = {
                    'male': <Tag color="blue">Nam</Tag>,
                    'female': <Tag color="pink">Nữ</Tag>,
                    'other': <Tag color="default">Khác</Tag>
                };
                return genderMap[gender] || <Tag color="default">Chưa rõ</Tag>;
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isLocked',
            key: 'isLocked',
            width: 40,
            align: 'center',
            render: (isLocked) => isLocked ?
                <Tag color="red" icon={<LockOutlined />}>Đã khóa</Tag> :
                <Tag color="green" icon={<UnlockOutlined />}>Hoạt động</Tag>
        },
        // {
        //     title: 'Ngày sinh',
        //     key: 'dob',
        //     width: 120,
        //     render: (_, record) => {
        //         if (record.dob?.day && record.dob?.month && record.dob?.year) {
        //             return `${record.dob.day}/${record.dob.month}/${record.dob.year}`;
        //         }
        //         return <Tag color="default">Chưa có</Tag>;
        //     }
        // },
        // {
        //     title: 'Ngày tạo',
        //     dataIndex: 'createdAt',
        //     key: 'createdAt',
        //     width: 150,
        //     render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm')
        // },
        {
            title: 'Thao tác',
            key: 'action',
            width: 60,
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
                    <Popconfirm
                        title="Xóa người dùng"
                        description="Bạn có chắc chắn muốn xóa người dùng này?"
                        onConfirm={() => deleteMutation.mutate(record._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        setEditingUser(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingUser(record);
        form.setFieldsValue({
            name: record.name,
            email: record.email,
            phone: record.phone,
            gender: record.gender,
            dob: record.dob?.day && record.dob?.month && record.dob?.year
                ? dayjs(`${record.dob.year}-${record.dob.month}-${record.dob.day}`)
                : null,
        });
        setIsModalOpen(true);
    };

    const handleViewDetail = (record) => {
        setViewingUser(record);
        setAccountStatus(record.isLocked || false);
        setIsDetailDrawerOpen(true);
    };

    const handleViewOrderHistory = (record) => {
        setViewingUser(record);
        setIsOrderHistoryDrawerOpen(true);
    };

    const handleResetPassword = () => {
        // Placeholder cho tính năng đặt lại mật khẩu
        message.info('Tính năng đặt lại mật khẩu qua email đang được phát triển');
        // TODO: Implement email verification & password reset
    };

    const handleSaveAccountStatus = () => {
        if (!viewingUser) return;

        updateAccountStatusMutation.mutate({
            id: viewingUser._id,
            data: { isLocked: accountStatus }
        });
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            const dob = values.dob ? {
                day: values.dob.date(),
                month: values.dob.month() + 1,
                year: values.dob.year()
            } : null;

            const userData = {
                name: values.name,
                email: values.email,
                phone: values.phone,
                gender: values.gender,
                dob
            };

            if (editingUser) {
                // Update
                updateMutation.mutate({
                    id: editingUser._id,
                    data: userData
                });
            } else {
                // Create - cần password
                if (!values.password || !values.confirmPassword) {
                    message.error('Vui lòng nhập mật khẩu!');
                    return;
                }
                if (values.password !== values.confirmPassword) {
                    message.error('Mật khẩu không khớp!');
                    return;
                }
                createMutation.mutate({
                    ...userData,
                    password: values.password,
                    confirmPassword: values.confirmPassword
                });
            }
        });
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        form.resetFields();
    };

    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>

            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                    type="primary"
                    icon={<PlusCircleFilled />}
                    onClick={handleAdd}
                    size="large"
                >
                    Thêm người dùng mới
                </Button>
                <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
                    Tổng: {usersData?.data?.length || 0} người dùng
                </Tag>
            </div>

            <Table
                columns={columns}
                dataSource={usersData?.data || []}
                loading={isLoading}
                rowKey="_id"
                scroll={{ x: 800 }}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} người dùng`
                }}
            />

            {/* Modal Add/Edit */}
            <Modal
                title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={600}
                confirmLoading={updateMutation.isLoading || createMutation.isLoading}
                okText={editingUser ? "Cập nhật" : "Thêm"}
                cancelText="Hủy"
            >
                <Form
                    form={form}
                    layout="vertical"
                    style={{ marginTop: 20 }}
                >
                    <Form.Item
                        label="Tên người dùng"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input placeholder="Nhập tên người dùng" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input placeholder="Nhập email" disabled={!!editingUser} />
                    </Form.Item>

                    {!editingUser && (
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

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        label="Giới tính"
                        name="gender"
                    >
                        <Select placeholder="Chọn giới tính">
                            <Select.Option value="male">Nam</Select.Option>
                            <Select.Option value="female">Nữ</Select.Option>
                            <Select.Option value="other">Khác</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Ngày sinh"
                        name="dob"
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày sinh"
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Drawer Chi tiết */}
            <Drawer
                title="Chi tiết người dùng"
                placement="right"
                width={500}
                onClose={() => setIsDetailDrawerOpen(false)}
                open={isDetailDrawerOpen}
            >
                {viewingUser && (
                    <div>
                        <div style={{ marginBottom: 24 }}>
                            <h3 style={{ marginBottom: 16, color: '#1890ff' }}>Thông tin cá nhân</h3>
                            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                <div>
                                    <strong>Tên:</strong> {viewingUser.name || 'Chưa cập nhật'}
                                </div>
                                <div>
                                    <strong>Email:</strong> {viewingUser.email}
                                </div>
                                <div>
                                    <strong>Số điện thoại:</strong> {viewingUser.phone || 'Chưa có'}
                                </div>
                                <div>
                                    <strong>Giới tính:</strong> {
                                        viewingUser.gender === 'male' ? 'Nam' :
                                            viewingUser.gender === 'female' ? 'Nữ' : 'Khác'
                                    }
                                </div>
                                <div>
                                    <strong>Ngày sinh:</strong> {
                                        viewingUser.dob?.day && viewingUser.dob?.month && viewingUser.dob?.year
                                            ? `${viewingUser.dob.day}/${viewingUser.dob.month}/${viewingUser.dob.year}`
                                            : 'Chưa có'
                                    }
                                </div>
                                <div>
                                    <strong>Ngày tạo:</strong> {dayjs(viewingUser.createdAt).format('DD/MM/YYYY HH:mm')}
                                </div>
                            </Space>
                        </div>

                        <Divider />

                        <div style={{ marginBottom: 24 }}>
                            <h3 style={{ marginBottom: 16, color: '#1890ff' }}>Quản lý tài khoản</h3>
                            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span><strong>Trạng thái tài khoản:</strong></span>
                                    <Space>
                                        <Switch
                                            checked={!accountStatus}
                                            onChange={(checked) => setAccountStatus(!checked)}
                                            checkedChildren={<UnlockOutlined />}
                                            unCheckedChildren={<LockOutlined />}
                                        />
                                        <span>{accountStatus ? 'Đã khóa' : 'Hoạt động'}</span>
                                    </Space>
                                </div>

                                <Button
                                    icon={<KeyOutlined />}
                                    onClick={handleResetPassword}
                                    block
                                    style={{ marginTop: 8 }}
                                >
                                    Đặt lại mật khẩu
                                </Button>

                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    onClick={handleSaveAccountStatus}
                                    block
                                    loading={updateAccountStatusMutation.isLoading}
                                    style={{ marginTop: 8 }}
                                >
                                    Lưu thay đổi
                                </Button>
                            </Space>
                        </div>

                        <Divider />

                        <Button
                            type="primary"
                            icon={<ShoppingCartOutlined />}
                            onClick={() => handleViewOrderHistory(viewingUser)}
                            block
                        >
                            Xem lịch sử mua hàng
                        </Button>
                    </div>
                )}
            </Drawer>

            {/* Drawer Lịch sử mua hàng */}
            <Drawer
                title={`Lịch sử mua hàng - ${viewingUser?.name || viewingUser?.email}`}
                placement="right"
                width={700}
                onClose={() => setIsOrderHistoryDrawerOpen(false)}
                open={isOrderHistoryDrawerOpen}
            >
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    <ShoppingCartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                    <p>Chức năng lịch sử mua hàng đang được phát triển</p>
                    <p>Sẽ được cập nhật khi có module đơn hàng</p>
                </div>
            </Drawer>
        </div>
    );
};

export default ListUser;