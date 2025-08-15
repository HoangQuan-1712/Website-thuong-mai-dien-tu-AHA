import { Input, Space } from "antd"
import React, { useState } from "react"

const InputFormForgotPassword = ({ props }) => {
    // const { placeholder = 'Nhập text' } = props
    const [valueInput] = useState('')
    
    return (

            <Space direction="vertical">
                <Input style={{width: '100%', padding: '10px 0px', border: 'none',
                    fontSize: '24px', color: 'rgb(36, 36, 36)', outline: 'none'}}
                    placeholder="Số điện thoại / Email" valueInput={valueInput} 
                />
            </Space>
    )
}

export default InputFormForgotPassword