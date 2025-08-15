import React from "react"
import { WrapperContainerLeft, WrapperContainerRight} from "./style";
import InputForm from "../../components/InputForm/InputForm"
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"
import imageLogo from "../../assets/images/logo-login.webp"
import CloseLogo from "../../assets/images/close.png"
import { Image } from "antd"
import { LeftOutlined } from '@ant-design/icons'

const SignInPage = () => {
    return (
                <div style={{display: 'flex', alignItems: 'center', 
         justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh'}}>
           <div style={{ width: '800px', height: '445spx', borderRadius: '6px', background: '#fff', display: 'flex', position: 'relative'}}>
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
                 <Image style={{marginTop: '-26px',marginRight: '-22px'}} src={CloseLogo} alt="logo-close" preview={false} />
             </button>
            
            <WrapperContainerLeft>
                <LeftOutlined style={{ fontSize: '20px', marginBottom: '10px', cursor: 'pointer', paddingBottom: '20px' }} />
                <h1 style={{margin: '0px 0px 10px', fontSize: '24px', fontWeight: '500'}}>
                    Đăng nhập bằng email</h1>
                <p style={{margin: '0px', fontSize: '15px', lineHeight: '20px', paddingBottom: '10px'}}>
                    Nhập email và mật khẩu tài khoản AHA</p>
                <InputForm />
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
                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                />
                <p style={{ color: 'rgb(13, 92, 182)', fontSize: '13px', margin: '20px 0px 0px',
                    cursor: 'pointer', display: 'inline-block' }}>
                        Quên mật khẩu?</p>
                <p style={{ color: 'rgb(120, 120, 120)', fontSize: '13px', margin: '10px 0px 0px' }}>
                    Chưa có tài khoản? 
                    <span style={{ color: 'rgb(13, 92, 182)', display: 'inline-block',
                        marginLeft: '5px', cursor: 'pointer'}}>
                        Tạo tài khoản</span></p>
            </WrapperContainerLeft>
            <WrapperContainerRight>
                <Image src={imageLogo} preview={false} alt="logo-login" height='203px' width= '203px'/>
                <h4 style={{margin: '0px 0px 5px', color: 'rgb(10, 104, 255)',fontSize: '18px',fontWeight: '500',lineHeight: '24px'}}>
                    Mua sắm tại AHA</h4>
                <span style={{fontSize: '14px',color: 'rgb(10, 104, 255)',fontWeight: '400',lineHeight: '20px'}}>
                    Siêu ưu đãi mỗi ngày
                </span>
            </WrapperContainerRight>
        </div>
       </div>
    )
}

export default SignInPage;