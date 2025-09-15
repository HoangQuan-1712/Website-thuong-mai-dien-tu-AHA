import React from "react"
import { WrapperContainerLeft, WrapperContainerRight } from "./style";
import InputFormRegister from "../../components/InputForm/inputFormRegister"
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"
import imageLogo from "../../assets/images/logo-login.webp"
import { Image } from "antd"
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate } from "react-router-dom";
import * as UserServices from '../../services/UserServices'
import { UseMutatonHooks } from "../../hooks/UseMutationHooks";
import Loading from "../../components/LoadingComponent/Loading";


const SignInPage = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const mutation = UseMutatonHooks(
        (data) => UserServices.signupUser(data)
      )
      const { data, isPending } = mutation

    const handleOnchangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleOnchangePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleOnchangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }

    const navigate = useNavigate();
    const NavigatorLogin = () => {
        navigate('/sign-in-numberphone');
    }

    const handleSignUp = () => {
        mutation.mutate({
            email,
            password,
            confirmPassword
        })
        console.log(`sign-up ${email} ${password} ${confirmPassword}`);
        
    }
    return (
        <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh'
        }}>
            <div style={{ width: '800px', height: '445spx', borderRadius: '6px', background: '#fff', display: 'flex', position: 'relative' }}>

                <WrapperContainerLeft>
                    <LeftOutlined style={{ fontSize: '20px', marginBottom: '10px', cursor: 'pointer', paddingBottom: '20px' }} />
                    <h1 style={{ margin: '0px 0px 10px', fontSize: '24px', fontWeight: '500' }}>
                        Xin chào</h1>
                    <p style={{ margin: '0px', fontSize: '15px', lineHeight: '20px', paddingBottom: '10px' }}>
                        Đăng ký và tạo tài khoản</p>
                    <InputFormRegister
                        value={email}
                        handleOnchange={handleOnchangeEmail}
                        password={password}
                        handleOnchangePassword={handleOnchangePassword}
                        confirmPassword={confirmPassword}
                        handleOnchangeConfirmPassword={handleOnchangeConfirmPassword}
                    />
                    <Loading isLoading={isPending}>
                    <ButtonComponent onClick={handleSignUp}
                    disabled={!email.length || !password.length || !confirmPassword.length}
                        size={40}
                        styleButton={{
                            backgroundColor: 'rgb(255, 57, 69)',
                            height: '48px',
                            width: '100%',
                            border: 'none',
                            borderRadius: '4px',
                            margin: '26px 0 10px'
                        }}
                        textButton={'Đăng Ký'}
                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    />
                    {data?.status === 'ERR' && <span style={{color: 'red'}}>{data?.message}</span>}
                    </Loading>
                    <p style={{ color: 'rgb(120, 120, 120)', fontSize: '13px', margin: '10px 0px 0px' }}>
                        Bạn đã có tài khoản
                        <span style={{
                            color: 'rgb(13, 92, 182)', display: 'inline-block',
                            marginLeft: '5px', cursor: 'pointer'
                        }} onClick={NavigatorLogin}>
                            Đăng nhập</span></p>
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