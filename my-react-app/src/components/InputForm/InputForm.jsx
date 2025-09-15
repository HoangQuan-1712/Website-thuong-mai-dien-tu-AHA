import { Input, Space } from "antd"
import React, { useState } from "react"
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'

const InputForm = ({ value, handleOnchange, password, handleOnchangePassword }) => {
    const [localPassword, setLocalPassword] = useState("");

    const effectivePassword = password !== undefined ? password : localPassword;
    const effectiveOnChangePassword = handleOnchangePassword !== undefined
        ? handleOnchangePassword
        : (e) => setLocalPassword(e.target.value);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Input style={{
                width: '100%', padding: '10px 0px', border: 'none',
                fontSize: '14px', color: 'rgb(36, 36, 36)', outline: 'none'
            }}
                placeholder={'abc@gmail.com'}
                value={value}
                onChange={handleOnchange} />

            <Space direction="vertical">
                <Input.Password style={{
                    width: '100%', padding: '10px 0px', border: 'none',
                    fontSize: '14px', color: 'rgb(36, 36, 36)', outline: 'none'
                }}
                    placeholder="Mật khẩu"
                    value={effectivePassword}
                    onChange={effectiveOnChangePassword}
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
            </Space>
        </div>
    )
}

export default InputForm