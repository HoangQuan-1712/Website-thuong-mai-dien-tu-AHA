import { Input, Space } from "antd"
import React from "react"
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'

const InputFormRegister = ({
    value,
    handleOnchange,
    password,
    handleOnchangePassword,
    confirmPassword,
    handleOnchangeConfirmPassword
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Input style={{
                width: '100%', padding: '10px 0px', border: 'none',
                fontSize: '14px', color: 'rgb(36, 36, 36)', outline: 'none'
            }}
                placeholder={'abc@gmail.com'}
                value={value}
                onChange={handleOnchange}
            />

            <Space direction="vertical">
                <Input.Password style={{
                    width: '100%', padding: '10px 0px', border: 'none',
                    fontSize: '14px', color: 'rgb(36, 36, 36)', outline: 'none'
                }}
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={handleOnchangePassword}
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
            </Space>
            <Space direction="vertical">
                <Input.Password style={{
                    width: '100%', padding: '10px 0px', border: 'none',
                    fontSize: '14px', color: 'rgb(36, 36, 36)', outline: 'none'
                }}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={handleOnchangeConfirmPassword}
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
            </Space>
        </div>
    )
}

export default InputFormRegister