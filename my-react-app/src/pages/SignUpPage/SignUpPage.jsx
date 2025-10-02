import React from "react"
import { WrapperContainerLeft, WrapperContainerRight } from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"
import imageLogo from "../../assets/images/logo-login.webp"
import imageLogoFb from "../../assets/images/logo-facebook.png"
import imageLogoGg from "../../assets/images/logo-gg.png"
import CloseLogo from "../../assets/images/close.png"
import { Image } from "antd"
import InputFormNumberPhone from "../../components/InputForm/InputFormNumberPhone"
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate } from "react-router-dom"


const SignUnPage = () => {
    const navigate = useNavigate();
    // const handleNavigatePassPhone = () => {
    //     navigate('/pass-for-phone-number');
    // }
    const NavigatorReturn = () => {
        navigate('/sign-in-numberphone');
    }
    const NavigatorClose = () => {
        navigate('/');
    }
    return (
        <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh'
        }}>
            <div style={{ width: '800px', height: '500px', borderRadius: '6px', background: '#fff', display: 'flex', position: 'relative' }}>
                <button style={{
                    position: 'absolute',
                    right: '-8px',
                    top: '-8px',
                    width: '42px',
                    height: '42px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: '10'
                }}>
                    <Image onClick={NavigatorClose} style={{ marginTop: '-26px', marginRight: '-22px' }} src={CloseLogo} alt="logo-close" preview={false} />
                </button>
                <WrapperContainerLeft>
                    <LeftOutlined onClick={NavigatorReturn} style={{ fontSize: '20px', marginBottom: '20px', cursor: 'pointer', paddingBottom: '20px' }} />
                    <h4 style={{ margin: '-19px 0px 10px', fontSize: '24px', fontWeight: '500' }}>Tạo tài khoản</h4>
                    <p style={{ marginTop: '0px', fontSize: '15px' }}>Vui lòng nhập số điện thoại</p>
                    <InputFormNumberPhone />
                    <ButtonComponent
                        //onClick={handleNavigatePassPhone}
                        size={40}
                        styleButton={{
                            backgroundColor: 'rgb(255, 57, 69)',
                            height: '48px',
                            width: '100%',
                            border: 'none',
                            borderRadius: '4px',
                            margin: '26px 0 45px'
                        }}
                        textButton={'Tiếp tục'}
                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    />
                    <p style={{ margin: '14px 120px 15px', position: 'relative', textAlign: 'center', }}>
                        <span style={{
                            fontSize: '15px',
                            color: 'rgb(120, 120, 120)',
                            display: 'inline-block',
                            background: 'rgb(255, 255, 255)',
                            padding: '0px 20px',
                            position: 'relative',
                            zIndex: '2',
                            whiteSpace: 'nowrap'
                        }}>
                            Hoặc tiếp tục bằng
                        </span></p>

                    <ul style={{
                        display: 'flex',
                        flexDirection: 'row',
                        padding: '0px',
                        margin: '0px 0px 10px',
                        listStyle: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        <li>
                            <Image style={{ width: '58px', maxWidth: '100%', boxSizing: 'border-box' }} src={imageLogoFb} preview={false} alt="logo-facebook" />
                        </li>
                        <li>
                            <Image style={{ width: '58px', maxWidth: '100%', boxSizing: 'border-box' }} src={imageLogoGg} preview={false} alt="logo-gg" />
                        </li>
                    </ul>

                    <p style={{
                        fontSize: '12px',
                        color: 'rgb(120, 120, 120)',
                        lineHeight: '16px',
                        textAlign: 'start',
                        margin: '10px 0 0 0'
                    }}>
                        Bằng việc tiếp tục, bạn đã đọc và đồng ý với
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a style={{
                            display: 'inline-block',
                            textDecoration: 'underline',
                            marginLeft: '3px',
                            fontSize: '11px',
                            color: 'rgb(120, 120, 120)'
                        }} href="">
                            điều khoản sử dụng
                        </a> và
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a style={{
                            display: 'inline-block',
                            textDecoration: 'underline',
                            marginLeft: '3px',
                            fontSize: '11px',
                            color: 'rgb(120, 120, 120)'
                        }} href="">
                            Chính sách bảo mật thông tin cá nhân
                        </a> của AHA
                    </p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={imageLogo} alt="logo-login" height='203px' width='203px' preview={false} />
                    <h4 style={{ margin: '0px 0px 5px', color: 'rgb(10, 104, 255)', fontSize: '18px', fontWeight: '500', lineHeight: '24px' }}>
                        Mua sắm tại AHA</h4>
                    <span style={{ fontSize: '14px', color: 'rgb(10, 104, 255)', fontWeight: '400', lineHeight: '20px' }}>
                        Siêu ưu đãi mỗi ngày
                    </span>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SignUnPage;