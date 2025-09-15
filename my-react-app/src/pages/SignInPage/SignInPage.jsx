import React from "react"
import { WrapperContainerLeft, WrapperContainerRight } from "./style";
import InputForm from "../../components/InputForm/InputForm"
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"
import imageLogo from "../../assets/images/logo-login.webp"
import CloseLogo from "../../assets/images/close.png"
import { Image } from "antd"
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate } from "react-router-dom";
//import { useMutation} from '@tanstack/react-query'
import * as UserServices from '../../services/UserServices'
import { UseMutatonHooks } from "../../hooks/UseMutationHooks";
import Loading from "../../components/LoadingComponent/Loading";


const SignInPage = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const mutation = UseMutatonHooks(
        (data) => UserServices.loginUser(data)
      )
      console.log('mutation', mutation);
      const { data, isPending } = mutation
      

    const handleOnchangeEmail = (e) => {
        console.log(e.target.value);

        setEmail(e.target.value);
    }

    const handleOnchangePassword = (e) => {
        console.log(e.target.value);

        setPassword(e.target.value);
    }
    
    const navigate = useNavigate();
    const handleNavigateSinUp = () => {
        navigate('/sign-up');
    }
    const NavigatorForgetPass = () => {
        navigate('/forgot-password');
    }
    const NavigatorReturn = () => {
        navigate('/sign-in-numberphone');
    }

    const handleSignIn = () => {
        mutation.mutate({
            email,
            password
        })
        console.log(`'sign-in' ${email} ${password}`);
        
    }
    return (
        <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh'
        }}>
            <div style={{ width: '800px', height: '445spx', borderRadius: '6px', background: '#fff', display: 'flex', position: 'relative' }}>
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
                    <Image style={{ marginTop: '-26px', marginRight: '-22px' }} src={CloseLogo} alt="logo-close" preview={false} />
                </button>

                <WrapperContainerLeft>
                    <LeftOutlined onClick={NavigatorReturn} style={{ fontSize: '20px', marginBottom: '10px', cursor: 'pointer', paddingBottom: '20px' }} />
                    <h1 style={{ margin: '0px 0px 10px', fontSize: '24px', fontWeight: '500' }}>
                        Đăng nhập bằng email</h1>
                    <p style={{ margin: '0px', fontSize: '15px', lineHeight: '20px', paddingBottom: '10px' }}>
                        Nhập email và mật khẩu tài khoản AHA</p>
                    <InputForm  value={email}
                        handleOnchange={handleOnchangeEmail}
                        password={password}
                        handleOnchangePassword={handleOnchangePassword} />
                        {data?.status === 'ERR' && <span style={{color: 'red'}}>{data?.message}</span>}
                    <Loading isLoading={isPending}>
                       <ButtonComponent onClick={handleSignIn}
                    disabled={!email.length || !password.length }
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
                    </Loading>
                    <p style={{
                        color: 'rgb(13, 92, 182)', fontSize: '13px', margin: '20px 0px 0px',
                        cursor: 'pointer', display: 'inline-block'
                    }} onClick={NavigatorForgetPass}>
                        Quên mật khẩu?</p>
                    <p style={{ color: 'rgb(120, 120, 120)', fontSize: '13px', margin: '10px 0px 0px' }}>
                        Chưa có tài khoản?
                        <span style={{
                            color: 'rgb(13, 92, 182)', display: 'inline-block',
                            marginLeft: '5px', cursor: 'pointer'
                        }} onClick={handleNavigateSinUp}>
                            Tạo tài khoản</span></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={imageLogo} preview={false} alt="logo-login" height='203px' width='203px' />
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

export default SignInPage;