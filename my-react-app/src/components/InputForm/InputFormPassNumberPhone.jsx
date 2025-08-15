import { Input, Space } from "antd"
import React, { useState } from "react"

const InputFormPassNumberPhone = ({ props }) => {
    // const { placeholder = 'Nhập text' } = props
    const [valueInput] = useState('')
    
    return (

            <Space direction="vertical">
                <Input style={{width: '100%', padding: '10px 0px', border: 'none',
                    fontSize: '14px', color: 'rgb(36, 36, 36)', outline: 'none'}}
                    placeholder="Mật khẩu" valueInput={valueInput} 
                />
            </Space>
    )
}

export default InputFormPassNumberPhone