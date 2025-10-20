import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as UserServices from '../../services/UserServices'
import { updateUser } from '../../redux/slices/userSlide';
import { WrapperContainerAvatar, WrapperHeaderRightContainerProfile, WrapperrAvatar, WrapperrButton, WrapperrStyleAvatar } from "./style";
import { WrapperButtonMore } from '../HomePage/style';
import { UserOutlined } from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';

const UserProfile = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    // Debug: Kiểm tra user state
    console.log('Redux user state:', user);
    console.log('user._id:', user?._id);
    console.log('user.id:', user?.id);

    // Fallback: Nếu không có userId trong Redux, thử decode từ access_token
    let userId = user?._id || user?.id;

    if (!userId && user?.access_token) {
        try {
            const decoded = jwtDecode(user.access_token);
            userId = decoded?.id;
            console.log('userId từ token:', userId);
        } catch (e) {
            console.error('Error decoding token:', e);
        }
    }

    console.log('Final userId:', userId);

    const [form, setForm] = useState({
        username: '',
        name: '',
        email: '',
        phone: '',
        gender: 'other',
        dob: { day: '', month: '', year: '' },
    });

    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        if (!user) return;
        setForm({
            username: user.username ?? '',
            name: user.name ?? '',
            email: user.email ?? '',
            phone: user.phone ?? '',
            gender: user.gender ?? 'other',
            dob: {
                day: user.dob?.day ?? '',
                month: user.dob?.month ?? '',
                year: user.dob?.year ?? '',
            },
        });
        setAvatar(user.avatar ?? '');
    }, [user]);

    const onChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    // Hàm cập nhật thông tin cá nhân (không bao gồm avatar)
    const handleSubmitProfile = async (e) => {
        e.preventDefault();

        if (!userId) {
            alert('Không tìm thấy ID người dùng!');
            return;
        }

        try {
            const payload = {
                username: form.username || '',
                name: form.name || '',
                phone: form.phone || '',
                gender: form.gender || 'other',
                dob: {
                    day: form.dob?.day || null,
                    month: form.dob?.month || null,
                    year: form.dob?.year || null
                },
            };

            console.log('Updating profile with userId:', userId);
            console.log('Payload:', payload);

            const res = await UserServices.updateUserProfile(
                userId,
                payload,
                user?.access_token
            );

            console.log('Update response:', res);

            if (res?.data?.status === 'OK' && res?.data?.data) {
                dispatch(updateUser({
                    ...res.data.data,
                    access_token: user.access_token,
                    refresh_token: user.refresh_token,
                }));
                alert('Cập nhật hồ sơ thành công!');
            } else {
                alert(res?.data?.message || 'Cập nhật hồ sơ thất bại!');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Cập nhật hồ sơ thất bại: ' + (err.response?.data?.message || err.message));
        }
    };

    // Hàm upload avatar riêng
    const handleAvatarUpload = async (file) => {
        if (!userId) {
            alert('Không tìm thấy ID người dùng!');
            return;
        }

        if (file.size > 1024 * 1024) {
            alert("Dung lượng file vượt quá 1MB!");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (ev) => {
            const base64Avatar = ev.target.result;
            setAvatar(base64Avatar);

            try {
                // Gọi API cập nhật chỉ avatar
                const res = await UserServices.updateUserProfile(
                    userId,
                    { avatar: base64Avatar },
                    user?.access_token
                );

                if (res?.data?.status === 'OK' && res?.data?.data) {
                    dispatch(updateUser({
                        ...res.data.data,
                        access_token: user.access_token,
                        refresh_token: user.refresh_token,
                    }));
                    alert('Cập nhật ảnh đại diện thành công!');
                } else {
                    alert('Cập nhật ảnh đại diện thất bại!');
                }
            } catch (err) {
                console.error('Error uploading avatar:', err);
                alert('Upload ảnh thất bại: ' + (err.response?.data?.message || err.message));
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div style={{ maxWidth: 850 }}>
            <WrapperHeaderRightContainerProfile>
                <h1 style={{
                    color: "#333",
                    fontSize: "2.125rem",
                    fontWeight: 500,
                    lineHeight: "1.5rem",
                    margin: 0,
                    textTransform: "capitalize",
                }}>
                    Hồ sơ của tôi
                </h1>
                <div style={{
                    color: "#555",
                    fontSize: "1.2rem",
                    lineHeight: "1.0625rem",
                    marginTop: ".1875rem",
                }}>
                    Quản lý thông tin hồ sơ để bảo mật tài khoản
                </div>
            </WrapperHeaderRightContainerProfile>

            <div style={{
                paddingTop: "1.875rem",
                display: "flex",
                alignItems: "flex-start",
            }}>
                {/* Form thông tin cá nhân */}
                <form onSubmit={handleSubmitProfile} style={{ flex: '1', paddingRight: '50px' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '160px 1fr',
                        columnGap: '24px',
                        rowGap: '16px',
                        alignItems: 'center',
                        width: '120%',
                        maxWidth: '560px',
                    }}>
                        <label style={{ justifySelf: 'end', color: '#555' }}>Tên đăng nhập</label>
                        <input
                            value={form.username}
                            onChange={e => onChange('username', e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4 }}
                        />

                        <label style={{ justifySelf: 'end', color: '#555' }}>Tên</label>
                        <input
                            value={form.name}
                            onChange={e => onChange('name', e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4 }}
                        />

                        <label style={{ justifySelf: 'end', color: '#555' }}>Email</label>
                        <input
                            value={form.email}
                            disabled
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #eee', borderRadius: 4, background: '#fafafa' }}
                        />

                        <label style={{ justifySelf: 'end', color: '#555' }}>Số điện thoại</label>
                        <input
                            value={form.phone}
                            onChange={e => onChange('phone', e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4 }}
                        />

                        <label style={{ justifySelf: 'end', color: '#555' }}>Giới tính</label>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <label><input type="radio" checked={form.gender === 'male'} onChange={() => onChange('gender', 'male')} /> Nam</label>
                            <label><input type="radio" checked={form.gender === 'female'} onChange={() => onChange('gender', 'female')} /> Nữ</label>
                            <label><input type="radio" checked={form.gender === 'other'} onChange={() => onChange('gender', 'other')} /> Khác</label>
                        </div>

                        <label style={{ justifySelf: 'end', color: '#555' }}>Ngày sinh</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                placeholder="Ngày"
                                value={form.dob.day}
                                onChange={e => onChange('dob', { ...form.dob, day: e.target.value })}
                                style={{ width: 70, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4 }}
                            />
                            <input
                                placeholder="Tháng"
                                value={form.dob.month}
                                onChange={e => onChange('dob', { ...form.dob, month: e.target.value })}
                                style={{ width: 70, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4 }}
                            />
                            <input
                                placeholder="Năm"
                                value={form.dob.year}
                                onChange={e => onChange('dob', { ...form.dob, year: e.target.value })}
                                style={{ width: 90, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4 }}
                            />
                        </div>

                        <div />
                        <WrapperButtonMore
                            textButton="Lưu"
                            type="outline"
                            htmlType="submit"
                            styleButton={{
                                border: '1px solid rgb(11,116,229)',
                                color: 'rgb(11,116,229)',
                                width: 240,
                                height: 38,
                                borderRadius: 4,
                            }}
                            styleTextButton={{ fontWeight: 500 }}
                        />
                    </div>
                </form>

                {/* Phần upload avatar */}
                <WrapperContainerAvatar>
                    <div style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        display: 'flex',
                    }}>
                        <WrapperrAvatar>
                            <WrapperrStyleAvatar>
                                {avatar ? (
                                    <img src={avatar} alt="avatar" style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '50%'
                                    }} />
                                ) : (
                                    <UserOutlined style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        fontSize: "3rem",
                                        color: "#c6c6c6",
                                    }} />
                                )}
                            </WrapperrStyleAvatar>
                        </WrapperrAvatar>

                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            id="avatar-upload"
                            style={{ display: "none" }}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    handleAvatarUpload(file);
                                }
                            }}
                        />

                        <WrapperrButton
                            as="label"
                            htmlFor="avatar-upload"
                            style={{ cursor: "pointer" }}
                        >
                            Chọn ảnh
                        </WrapperrButton>

                        <div style={{ marginTop: '.75rem' }}>
                            <div style={{
                                color: '#999',
                                fontSize: '1.0rem',
                                lineHeight: '1.25rem',
                            }}>
                                Dung lượng file tối đa 1 MB
                            </div>
                            <div style={{
                                color: '#999',
                                fontSize: '1.0rem',
                                lineHeight: '1.25rem',
                            }}>
                                Định dạng: JPEG, PNG
                            </div>
                        </div>
                    </div>
                </WrapperContainerAvatar>
            </div>
        </div>
    );
};

export default UserProfile;