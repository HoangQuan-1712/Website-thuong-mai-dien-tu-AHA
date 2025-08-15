import React from "react"
import { SearchOutlined } from "@ant-design/icons"
import InputComponent from "../InputComponent/InputComponent"
import ButtonComponent from "../ButtonComponent/ButtonComponent"


const ButtonInputSearch = (props) => {
    const { size, placeholder, textButton,
        colorButton = '#fff',
        bordered, BackgoundColorInput = '#fff',
        BackgroundColorButton = 'rgb(13,92, 182)' }
        = props
    return (
        <div style={{ display: 'flex', backgroundColor: "#fff", alignItems: 'center', width: '100%' }}>
            <InputComponent
                size={size}
                placeholder={placeholder}
                bordered={bordered}
                style={{
                    backgroundColor: BackgoundColorInput,
                    flex: '1 1 auto',
                    minWidth: 0,
                    marginRight: '15px'
                }}
            />

            <ButtonComponent
                size={size}
                styleButton={{
                    backgroundColor: BackgroundColorButton,
                    //border: !bordered ? 'none' : undefined,
                    color: '#fff',
                    minWidth: 90,
                    borderRadius: 0
                }}
                icon={<SearchOutlined color={colorButton} style={{ color: '#fff' }} />}
                textButton={textButton}
                styleTextButton={{ color: colorButton }}
            />
        </div>

    )
}

export default ButtonInputSearch