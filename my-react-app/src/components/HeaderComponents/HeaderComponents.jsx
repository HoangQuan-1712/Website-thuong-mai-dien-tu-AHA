import { Col } from 'antd'
import React from 'react'
import { WrapperHeader, WrapperTextHeader, WrapperAccountHeader, WrapperCartHeader } from './style'
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch'
import { Badge } from 'antd'
import { useNavigate } from 'react-router-dom';


const HeaderComponent = () => {
    const navigate = useNavigate();
    const handleNAvigateLogin = () => {
        navigate('sign-in-numberphone');
    }

    return (
        <div>
            <WrapperHeader gutter={0} align="middle"  >
                <Col span={6}>
                    <WrapperTextHeader>
                        <img src="/logo.png" alt="logo" style={{ height: 40, width: 96, display: 'block', margin: '0 auto', alignItems: 'center' }} />
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

                    <WrapperAccountHeader>
                        <UserOutlined style={{ fontSize: 24, paddingLeft: 20 }} />
                        <div style={{ fontSize: 12, cursor: 'pointer' }} onClick={handleNAvigateLogin}>
                            <span>Đăng ký / Đăng nhập</span>
                            <div>Tài khoản <CaretDownOutlined /></div>
                        </div>

                    </WrapperAccountHeader>

                    <WrapperCartHeader>
                        <Badge count={5} size="small">
                            <ShoppingCartOutlined style={{ fontSize: 24, paddingLeft: 30 }} />
                        </Badge>
                        <span>Giỏ hàng</span>
                    </WrapperCartHeader>

                </Col>
            </WrapperHeader>
        </div>
    );
};

export default HeaderComponent;