import React, { useState, useEffect } from 'react';
import { Button, Card, Tag, Space, Modal, Form, Input, Select, message, Empty, Spin, Popconfirm } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    HomeOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import * as AddressServices from '../../services/AddressServices';

const Address = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const user = useSelector((state) => state.user);

    // Location states
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    // Helper để convert code → name
    const getLocationName = (code, type) => {
        if (!code) return '';

        if (type === 'province') {
            return provinces.find(p => p.code === code)?.name || code;
        } else if (type === 'district') {
            return districts.find(d => d.code === code)?.name || code;
        } else if (type === 'ward') {
            return wards.find(w => w.code === code)?.name || code;
        }
        return code;
    };

    // Fetch provinces on mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await AddressServices.getAllProvinces();
                setProvinces(res.data || []);
            } catch (error) {
                message.error('Không thể tải danh sách tỉnh/thành');
            }
        };
        fetchProvinces();
    }, []);

    // Fetch addresses
    const { data: addressesData, isLoading } = useQuery({
        queryKey: ['addresses'],
        queryFn: () => AddressServices.getAllAddresses(user?.access_token),
        enabled: !!user?.access_token
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data) => AddressServices.createAddress(data, user?.access_token),
        onSuccess: () => {
            message.success('Thêm địa chỉ thành công!');
            setIsModalOpen(false);
            form.resetFields();
            queryClient.invalidateQueries(['addresses']);
        },
        onError: (error) => {
            console.error('Create error:', error);
            message.error('Thêm địa chỉ thất bại!');
        }
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => AddressServices.updateAddress(id, data, user?.access_token),
        onSuccess: () => {
            message.success('Cập nhật địa chỉ thành công!');
            setIsModalOpen(false);
            setEditingAddress(null);
            form.resetFields();
            queryClient.invalidateQueries(['addresses']);
        },
        onError: () => {
            message.error('Cập nhật địa chỉ thất bại!');
        }
    });

    // Set default mutation
    const setDefaultMutation = useMutation({
        mutationFn: (id) => AddressServices.setDefaultAddress(id, user?.access_token),
        onSuccess: () => {
            message.success('Đã đặt làm địa chỉ mặc định!');
            queryClient.invalidateQueries(['addresses']);
        },
        onError: () => {
            message.error('Đặt địa chỉ mặc định thất bại!');
        }
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => AddressServices.deleteAddress(id, user?.access_token),
        onSuccess: () => {
            message.success('Xóa địa chỉ thành công!');
            queryClient.invalidateQueries(['addresses']);
        },
        onError: () => {
            message.error('Xóa địa chỉ thất bại!');
        }
    });

    // Handle province change
    const handleProvinceChange = async (value) => {
        setSelectedProvince(value);
        setSelectedDistrict(null);
        setDistricts([]);
        setWards([]);
        form.setFieldsValue({ district: undefined, ward: undefined });

        try {
            const res = await AddressServices.getDistrictsByProvince(value);
            setDistricts(res.data || []);
        } catch (error) {
            message.error('Không thể tải danh sách quận/huyện');
        }
    };

    // Handle district change
    const handleDistrictChange = async (value) => {
        setSelectedDistrict(value);
        setWards([]);
        form.setFieldsValue({ ward: undefined });

        try {
            const res = await AddressServices.getWardsByDistrict(value);
            setWards(res.data || []);
        } catch (error) {
            message.error('Không thể tải danh sách phường/xã');
        }
    };

    // Handle add new
    const handleAdd = () => {
        setEditingAddress(null);
        form.resetFields();
        setDistricts([]);
        setWards([]);
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setIsModalOpen(true);
    };

    // Handle edit
    const handleEdit = async (address) => {
        setEditingAddress(address);
        setSelectedProvince(address.province);
        setSelectedDistrict(address.district);

        // Load districts and wards
        if (address.province) {
            try {
                const distRes = await AddressServices.getDistrictsByProvince(address.province);
                setDistricts(distRes.data || []);

                if (address.district) {
                    const wardRes = await AddressServices.getWardsByDistrict(address.district);
                    setWards(wardRes.data || []);
                }
            } catch (error) {
                console.error('Error loading location data:', error);
            }
        }

        form.setFieldsValue({
            fullName: address.fullName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            province: address.province,
            district: address.district,
            ward: address.ward,
            label: address.label
        });

        setIsModalOpen(true);
    };

    // Handle submit - LƯU CODE
    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const addressData = {
                fullName: values.fullName,
                phone: values.phone,
                addressLine1: values.addressLine1,
                addressLine2: values.addressLine2 || '',
                province: values.province,      // Lưu CODE
                district: values.district,      // Lưu CODE
                ward: values.ward,              // Lưu CODE
                label: values.label || 'home',
                isDefault: values.isDefault || false
            };

            if (editingAddress) {
                updateMutation.mutate({
                    id: editingAddress._id,
                    data: addressData
                });
            } else {
                createMutation.mutate(addressData);
            }
        });
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    const addresses = addressesData?.data || [];

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20
            }}>
                <h2 style={{ margin: 0 }}>
                    <EnvironmentOutlined style={{ marginRight: 8 }} />
                    Sổ địa chỉ
                </h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm địa chỉ mới
                </Button>
            </div>

            {addresses.length === 0 ? (
                <Empty description="Chưa có địa chỉ nào" />
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {addresses.map((address) => (
                        <Card
                            key={address._id}
                            style={{
                                border: address.isDefault ? '2px solid #1890ff' : '1px solid #d9d9d9',
                                background: address.isDefault ? '#f0f7ff' : '#fff'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ marginBottom: 8 }}>
                                        <Space>
                                            <strong style={{ fontSize: 16 }}>{address.fullName}</strong>
                                            <span style={{ color: '#666' }}>|</span>
                                            <span>{address.phone}</span>
                                            {address.label === 'home' && <Tag color="blue">Nhà</Tag>}
                                            {address.label === 'office' && <Tag color="green">Văn phòng</Tag>}
                                            {address.label === 'other' && <Tag>Khác</Tag>}
                                            {address.isDefault && (
                                                <Tag color="gold" icon={<CheckCircleOutlined />}>
                                                    Mặc định
                                                </Tag>
                                            )}
                                        </Space>
                                    </div>
                                    <div style={{ color: '#666', marginBottom: 8 }}>
                                        {address.addressLine1}
                                        {address.addressLine2 && `, ${address.addressLine2}`}
                                    </div>
                                    <div style={{ color: '#666' }}>
                                        {[
                                            getLocationName(address.ward, 'ward'),
                                            getLocationName(address.district, 'district'),
                                            getLocationName(address.province, 'province')
                                        ]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </div>
                                </div>
                                <div>
                                    <Space direction="vertical">
                                        <Button
                                            type="text"
                                            icon={<EditOutlined />}
                                            onClick={() => handleEdit(address)}
                                        >
                                            Sửa
                                        </Button>
                                        {!address.isDefault && (
                                            <Button
                                                type="text"
                                                onClick={() => setDefaultMutation.mutate(address._id)}
                                            >
                                                Đặt làm mặc định
                                            </Button>
                                        )}
                                        {!address.isDefault && (
                                            <Popconfirm
                                                title="Xóa địa chỉ"
                                                description="Bạn có chắc muốn xóa địa chỉ này?"
                                                onConfirm={() => deleteMutation.mutate(address._id)}
                                                okText="Xóa"
                                                cancelText="Hủy"
                                            >
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                >
                                                    Xóa
                                                </Button>
                                            </Popconfirm>
                                        )}
                                    </Space>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal Add/Edit */}
            <Modal
                title={editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingAddress(null);
                    form.resetFields();
                }}
                width={700}
                okText={editingAddress ? 'Cập nhật' : 'Thêm'}
                cancelText="Hủy"
                confirmLoading={createMutation.isLoading || updateMutation.isLoading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    style={{ marginTop: 20 }}
                >
                    <Form.Item
                        label="Họ và tên người nhận"
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                        <Input placeholder="Nhập họ và tên" />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        label="Tỉnh/Thành phố"
                        name="province"
                        rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành!' }]}
                    >
                        <Select
                            placeholder="Chọn tỉnh/thành phố"
                            onChange={handleProvinceChange}
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {provinces.map((province) => (
                                <Select.Option key={province.code} value={province.code}>
                                    {province.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Quận/Huyện"
                        name="district"
                        rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}
                    >
                        <Select
                            placeholder="Chọn quận/huyện"
                            onChange={handleDistrictChange}
                            disabled={!selectedProvince}
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {districts.map((district) => (
                                <Select.Option key={district.code} value={district.code}>
                                    {district.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Phường/Xã"
                        name="ward"
                        rules={[{ required: true, message: 'Vui lòng chọn phường/xã!' }]}
                    >
                        <Select
                            placeholder="Chọn phường/xã"
                            disabled={!selectedDistrict}
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {wards.map((ward) => (
                                <Select.Option key={ward.code} value={ward.code}>
                                    {ward.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Số nhà, tên đường"
                        name="addressLine1"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                        <Input placeholder="Ví dụ: 123 Trần Duy Hưng" />
                    </Form.Item>

                    <Form.Item
                        label="Tòa nhà, số tầng,... (Không bắt buộc)"
                        name="addressLine2"
                    >
                        <Input placeholder="Ví dụ: Tòa A, Tầng 3" />
                    </Form.Item>

                    <Form.Item
                        label="Loại địa chỉ"
                        name="label"
                        initialValue="home"
                    >
                        <Select>
                            <Select.Option value="home">
                                <HomeOutlined /> Nhà
                            </Select.Option>
                            <Select.Option value="office">Văn phòng</Select.Option>
                            <Select.Option value="other">Khác</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Address;