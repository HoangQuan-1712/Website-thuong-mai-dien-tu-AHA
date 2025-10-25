import { Col, Popover } from 'antd'
import React from 'react'
import { WrapperHeader, WrapperTextHeader, WrapperAccountHeader, WrapperCartHeader, WapperContentPopover } from './style'
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch'
import { Badge } from 'antd'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserServices from '../../services/UserServices'
import { resetUser } from "../../redux/slices/userSlide";
import Loading from '../LoadingComponent/Loading';


const HeaderComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);

    const handleNAvigateLogin = () => {
        navigate('sign-in-numberphone');
    }
    const handleProfile = () => {
        navigate('/profile/*');
    }
    const handlePage = () => {
        navigate('/');
    }
    const handleAdmin = () => {
        navigate('/system/admin');
    }

    const user = useSelector(state => state.user)
    const displayName = user?.username || user?.name || user?.email || '';

    const handleLogout = async () => {
        setLoading(true);
        await UserServices.logoutUser();
        dispatch(resetUser());
        setLoading(false);
        localStorage.removeItem('access_token');
        navigate('/');
        window.location.reload(); // Tải lại trang để cập nhật trạng thái đăng xuất

    }

    const content = (
        <div>
            <WapperContentPopover onClick={handleLogout}>Đăng xuất</WapperContentPopover>
            <WapperContentPopover onClick={handleProfile}>Thông tin người dùng</WapperContentPopover>
            {Boolean(user?.isAdmin) && (
                <WapperContentPopover onClick={handleAdmin}>Quản lý hệ thống</WapperContentPopover>
            )}

        </div>
    );



    return (
        <div>
            <WrapperHeader gutter={0} align="middle"  >
                <Col span={6}>
                    <WrapperTextHeader>
                        <img onClick={handlePage} src="/logo.png" alt="logo" style={{ height: 40, width: 96, display: 'block', margin: '0 auto', alignItems: 'center' }} />
                        <span>Tốt & Nhanh</span>
                    </WrapperTextHeader>
                </Col>
                <Col span={12}>
                    <ButtonInputSearch
                        size="large"
                        placeholder="Tìm kiếm sản phẩm"
                        textButton="Tìm kiếm"
                        bordered={false}
                        BackgoundColorInput="#fff"
                        BackgroundColorButton="rgb(13,92,182)"
                    />
                </Col>
                <Col style={{ display: 'flex' }} span={6}>
                    <Loading isLoading={loading}>
                        <WrapperAccountHeader>
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: 20,
                                        border: '2px solid #e0e0e0',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                />
                            ) : (
                                <UserOutlined style={{ fontSize: 24, paddingLeft: 20 }} />
                            )}

                            {user?.name ? (
                                <>
                                    <Popover content={content} trigger="click">
                                        <div style={{ cursor: 'pointer' }}>{displayName}</div>
                                    </Popover>
                                </>

                            ) : (
                                <div style={{ fontSize: 12, cursor: 'pointer' }} onClick={handleNAvigateLogin}>
                                    <span>Đăng ký / Đăng nhập</span>
                                    <div>Tài khoản <CaretDownOutlined /></div>
                                </div>
                            )}
                        </WrapperAccountHeader>

                    </Loading>
                    <WrapperCartHeader>
                        <Badge count={5} size="small">
                            <ShoppingCartOutlined style={{ fontSize: 24, paddingLeft: 30 }} />
                        </Badge>
                        <span>Giỏ hàng</span>
                    </WrapperCartHeader>

                </Col>
            </WrapperHeader>
        </div >
    );
};

export default HeaderComponent;