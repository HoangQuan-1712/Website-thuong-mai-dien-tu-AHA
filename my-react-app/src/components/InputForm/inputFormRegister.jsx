import { Input, Space } from "antd"
import React, { useState } from "react"
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'

const InputForm = ({ props }) => {
    // const { placeholder = 'Nhập text' } = props
    const [valueInput] = useState('')

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Input style={{
                width: '100%', padding: '10px 0px', border: 'none',
                fontSize: '14px', color: 'rgb(36, 36, 36)', outline: 'none'
            }}
                placeholder={'abc@gmail.com'} value={valueInput} />

            <Space direction="vertical">
                <Input.Password style={{
                    width: '100%', padding: '10px 0px', border: 'none',
                    fontSize: '14px', color: 'rgb(36, 36, 36)', outline: 'none'
                }}
                    placeholder="Mật khẩu"
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
            </Space>
            <Space direction="vertical">
                <Input.Password style={{
                    width: '100%', padding: '10px 0px', border: 'none',
                    fontSize: '14px', color: 'rgb(36, 36, 36)', outline: 'none'
                }}
                    placeholder="Nhập lại mật khẩu"
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
            </Space>
        </div>
    )
}

export default InputForm