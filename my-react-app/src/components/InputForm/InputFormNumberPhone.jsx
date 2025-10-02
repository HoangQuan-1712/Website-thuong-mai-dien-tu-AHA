import { Input } from "antd"
import React, { useState } from "react"


const InputFormNumberPhone = ({ props}) => {
    const [valueInput] = useState('')
    return (
        <div>
            <Input style={{width: '100%', padding: '5px 0px', border: 'none',
                fontSize: '24px', color: 'rgb(36, 36, 36)', outline: 'none'}} 
            placeholder={'Số điện thoại'} valueInput={valueInput} />
        </div>
    )
}

export default InputFormNumberPhone