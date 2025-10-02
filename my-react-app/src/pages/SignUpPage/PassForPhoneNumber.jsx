import React from "react"
import { WrapperContainerLeft, WrapperContainerRight } from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"
import imageLogo from "../../assets/images/logo-login.webp"
import CloseLogo from "../../assets/images/close.png"
import { Image } from "antd"
import { LeftOutlined } from '@ant-design/icons'
import InputFormPassNumberPhone from "../../components/InputForm/InputFormPassNumberPhone";
import { useNavigate } from "react-router-dom";

const PassForPhoneNumber = () => {
    const navigate = useNavigate();
    const NavigatorForgetPass = () => {
        navigate('/forgot-password');
    }
    const NavigatorClose = () => {
        navigate('/');
    }
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.53)',
            height: '100vh'
        }}>
            <div style={{
                width: '800px',
                height: '445px',
                borderRadius: '6px',
                background: '#fff',
                display: 'flex',
                position: 'relative'
            }}>
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
                    <Image onClick={NavigatorClose}
                        style={{
                            marginTop: '-26px',
                            marginRight: '-22px'
                        }}
                        src={CloseLogo}
                        alt="logo-close"
                        preview={false}
                    />
                </button>

                <WrapperContainerLeft>
                    <LeftOutlined
                        style={{
                            fontSize: '20px',
                            marginBottom: '10px',
                            cursor: 'pointer',
                            paddingBottom: '20px'
                        }}
                    />
                    <h1 style={{
                        margin: '0px 0px 10px',
                        fontSize: '24px',
                        fontWeight: '500'
                    }}>
                        Nhập mật khẩu
                    </h1>
                    <p style={{
                        margin: '0px',
                        fontSize: '15px',
                        lineHeight: '20px',
                        paddingBottom: '10px'
                    }}>
                        Vui lòng nhập mật khẩu AHA của số điện thoại
                    </p>
                    <b style={{ fontSize: '16px', color: '#333' }}>0963021884</b>

                    <InputFormPassNumberPhone />

                    <ButtonComponent
                        size={40}
                        styleButton={{
                            backgroundColor: 'rgb(255, 57, 69)',
                            height: '48px',
                            width: '100%',
                            border: 'none',
                            borderRadius: '4px',
                            margin: '26px 0 10px'
                        }}
                        textButton={'Đăng nhập'}
                        styleTextButton={{
                            color: '#fff',
                            fontSize: '15px',
                            fontWeight: '700'
                        }}
                    />

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '20px'
                    }}>
                        <p style={{
                            color: 'rgb(13, 92, 182)',
                            fontSize: '15px',
                            margin: '0px',
                            cursor: 'pointer',
                            display: 'inline-block'
                        }} onClick={NavigatorForgetPass}>
                            Quên mật khẩu?
                        </p>
                        <p style={{
                            color: 'rgb(13, 92, 182)',
                            fontSize: '15px',
                            margin: '0px'
                        }}>
                            Đăng nhập bằng SMS
                        </p>
                    </div>
                </WrapperContainerLeft>

                <WrapperContainerRight>
                    <Image
                        src={imageLogo}
                        preview={false}
                        alt="logo-login"
                        height='203px'
                        width='203px'
                    />
                    <h4 style={{
                        margin: '0px 0px 5px',
                        color: 'rgb(10, 104, 255)',
                        fontSize: '18px',
                        fontWeight: '500',
                        lineHeight: '24px'
                    }}>
                        Mua sắm tại AHA
                    </h4>
                    <span style={{
                        fontSize: '14px',
                        color: 'rgb(10, 104, 255)',
                        fontWeight: '400',
                        lineHeight: '20px'
                    }}>
                        Siêu ưu đãi mỗi ngày
                    </span>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default PassForPhoneNumber;