import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
    WrapperContainerProfile, WrapperDropdown,
    WrapperIconUser, WrapperLeftContainerProfile, WrapperList,
    WrapperRightContainerProfile
} from "./style";
import LinkItem from "./components/LinkItem";
import UserProfile from "./UserProfile.jsx";
import Bank from "./Bank.jsx";
import Address from "./Address.jsx";
import ChangePassword from "./ChangePassword.jsx";




const ProfilePage = () => {

    const [openAcc, setOpenAcc] = useState(false);
    return (
        <div style={{
            flex: '1',
            display: 'block',
            unicodeBidi: 'isolate',
            height: '500px'
        }}>
            <div
                style={{
                    transition: "margin-top .3s cubic-bezier(.4,0,.2,1)",
                    WebkitOverflowScrolling: "touch",
                    display: "block",
                    unicodeBidi: "isolate"
                }}
            >
                <WrapperContainerProfile>
                    <WrapperLeftContainerProfile>
                        <div style={{
                            borderBottom: '1px solid #efefef',
                            display: 'flex',
                            padding: '15px 0'
                        }}>
                        </div>
                        <WrapperList>
                            <WrapperDropdown>
                                <div
                                    style={{ cursor: 'pointer', listStyle: 'none', display: 'block', unicodeBidi: 'isolate' }}
                                    onClick={() => setOpenAcc(o => !o)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpenAcc(o => !o)}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '0.9375rem',
                                            color: 'rgba(46, 41, 41, 0.87)',
                                            textDecoration: 'none',
                                            textTransform: 'capitalize',
                                            transition: 'color .1s cubic-bezier(.4,0,.2,1)',
                                            backgroundColor: 'transparent',
                                            cursor: 'pointer',
                                            fontSize: '150%'
                                        }}
                                    >
                                        <WrapperIconUser>
                                            <img
                                                src="https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4"
                                                alt=""
                                                style={{
                                                    height: '120%',
                                                    width: '120%',
                                                    border: 0,
                                                    overflow: 'clip',
                                                    objectFit: 'contain',
                                                }}
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </WrapperIconUser>
                                        <div style={{
                                            lineHeight: '1rem',
                                            display: 'block',
                                            unicodeBidi: 'isolate'
                                        }}>
                                            <span style={{
                                                fontWeight: '700',
                                                marginRight: '.3125rem'
                                            }}>Tài khoản của tôi</span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        overflow: 'hidden',
                                        display: 'block',
                                        unicodeBidi: 'isolate',
                                        maxHeight: openAcc ? 500 : 0,
                                        opacity: openAcc ? 1 : 0,
                                        transition: 'max-height .4s cubic-bezier(.4,0,.2,1), opacity .4s cubic-bezier(.4,0,.2,1)',
                                    }}
                                    aria-hidden={!openAcc}
                                >
                                    <div style={{
                                        display: 'block',
                                        padding: '0 0 .1875rem 2.125rem',
                                        unicodeBidi: 'isolate'
                                    }}>
                                        <LinkItem to="/profile">Hồ sơ</LinkItem>
                                        <LinkItem to="/profile/bank">Ngân hàng</LinkItem>
                                        <LinkItem to="/profile/address">Địa chỉ</LinkItem>
                                        <LinkItem to="/profile/changepassword">Đổi mật khẩu</LinkItem>
                                    </div>
                                </div>
                            </WrapperDropdown>
                        </WrapperList>
                    </WrapperLeftContainerProfile>
                    <WrapperRightContainerProfile>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '100%',
                            position: 'relative',
                            unicodeBidi: 'isolate'
                        }}>
                            <div style={{
                                display: 'contents',
                                unicodeBidi: 'isolate'
                            }}>
                                <div style={{
                                    padding: '0 1.875rem .625rem',
                                    display: 'block',
                                    unicodeBidi: 'isolate'
                                }}>
                                    <Routes>
                                        <Route index element={<UserProfile />} />
                                        <Route path="bank" element={<Bank />} />
                                        <Route path="address" element={<Address />} />
                                        <Route path="changepassword" element={<ChangePassword />} />
                                    </Routes>
                                </div>
                            </div>
                        </div>
                    </WrapperRightContainerProfile>
                </WrapperContainerProfile>
            </div>
        </div >
    );
};

export default ProfilePage;