import React, { useEffect } from "react"
import { WrapperContainerLeft, WrapperContainerRight } from "./style";
import InputForm from "../../components/InputForm/InputForm"
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"
import imageLogo from "../../assets/images/logo-login.webp"
import CloseLogo from "../../assets/images/close.png"
import { Image, message } from "antd"
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate } from "react-router-dom";
//import { useMutation} from '@tanstack/react-query'
import * as UserServices from '../../services/UserServices'
import { UseMutatonHooks } from "../../hooks/UseMutationHooks";
import Loading from "../../components/LoadingComponent/Loading";
//import * as message from '../../components/Message/Message'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from "../../redux/slices/userSlide";


const SignInPage = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const mutation = UseMutatonHooks(
        (data) => UserServices.loginUser(data)
    )
    console.log('mutation', mutation);
    const { data, isPending, isSuccess } = mutation


    useEffect(() => {
        if (isSuccess) {
            navigate('/')
            localStorage.setItem('access_token', JSON.stringify(data?.access_token))
            if (data?.access_token) {
                try {
                    const decoded = jwtDecode(data?.access_token)
                    if (decoded?.id) {
                        handleGetDetailsUser(decoded?.id, data?.access_token)
                    }
                } catch (error) {
                    console.error('Error decoding token:', error)
                }
            }

        }
        if (isSuccess && data?.status === 'ERR') {
            if (data?.message?.includes('khóa') || data?.message?.includes('locked')) {
                message.error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
            } else if (data?.message?.includes('password') || data?.message?.includes('incorrect')) {
                message.error('Email hoặc mật khẩu không đúng!');
            } else if (data?.message?.includes('not defined')) {
                message.error('Tài khoản không tồn tại!');
            } else {
                message.error(data?.message || 'Đăng nhập thất bại!');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, data])


    const handleGetDetailsUser = async (id, token) => {
        try {
            console.log('Fetching user details for ID:', id);
            const res = await UserServices.getDetailsUser(id, token);
            console.log('User details response:', res);

            if (res?.data) {
                // Đảm bảo lưu đầy đủ thông tin user vào Redux
                dispatch(updateUser({
                    ...res.data,
                    _id: res.data._id || id, // Đảm bảo có _id
                    id: res.data._id || id,   // Thêm cả field id
                    access_token: token
                }));

                console.log('User updated in Redux');
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    }

    const handleOnchangeEmail = (e) => {
        console.log(e.target.value);

        setEmail(e.target.value);
    }

    const handleOnchangePassword = (e) => {
        console.log(e.target.value);

        setPassword(e.target.value);
    }

    const handleNavigateSinUp = () => {
        navigate('/sign-up');
    }
    const NavigatorForgetPass = () => {
        navigate('/forgot-password');
    }
    const NavigatorReturn = () => {
        navigate('/sign-in-numberphone');
    }

    const NavigatorClose = () => {
        navigate('/');
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
                    <Image onClick={NavigatorClose} style={{ marginTop: '-26px', marginRight: '-22px' }} src={CloseLogo} alt="logo-close" preview={false} />
                </button>

                <WrapperContainerLeft>
                    <LeftOutlined onClick={NavigatorReturn} style={{ fontSize: '20px', marginBottom: '10px', cursor: 'pointer', paddingBottom: '20px' }} />
                    <h1 style={{ margin: '0px 0px 10px', fontSize: '24px', fontWeight: '500' }}>
                        Đăng nhập bằng email</h1>
                    <p style={{ margin: '0px', fontSize: '15px', lineHeight: '20px', paddingBottom: '10px' }}>
                        Nhập email và mật khẩu tài khoản AHA</p>
                    <InputForm value={email}
                        handleOnchange={handleOnchangeEmail}
                        password={password}
                        handleOnchangePassword={handleOnchangePassword} />
                    {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                    <Loading isLoading={isPending}>
                        <ButtonComponent onClick={handleSignIn}
                            disabled={!email.length || !password.length}
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