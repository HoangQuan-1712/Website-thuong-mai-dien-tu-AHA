import React from "react"
import { WrapperContent, WrapperLableText, WrapperTextPrice } from "./style"
import { WrapperTextValue } from "./style"
import { Checkbox } from 'antd';
import { Rate } from 'antd';

const NavbarComponent = () => {
    const onChange = (value) => { }
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => {
                    return <WrapperTextValue>{option}</WrapperTextValue>
                })

            case 'checkbox':
                return (
                    <Checkbox.Group
                        style={{
                            width: '100%', display: 'flex', flexDirection: 'column', gap: '10px'
                        }}
                        onChange={onChange}
                    >
                        {options.map((option) => {
                            return (
                                <Checkbox style={{ marginLeft: 0 }} value={option.value}>{option.lable}</Checkbox>
                            )
                        })}

                        <Checkbox value="B">B</Checkbox>
                    </Checkbox.Group>
                )
            case 'star':
                return (
                    options.map((option) => {
                        return (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Rate style={{ fontSize: '12px' }} disabled defaultValue={option} />
                                <span>{`Từ ${option} sao`}</span>
                            </div>

                        )
                    })
                )

            case 'price':
                return (
                    options.map((option) => {
                        return (
                            <WrapperTextPrice >{option}</WrapperTextPrice>

                        )
                    })
                )
            default:
                return {}
        }
    }
    return (
        <div>
            <WrapperLableText>Danh mục sản phẩm</WrapperLableText>
            <WrapperContent>
                {renderContent('text', ['Thịt, rau củ', 'Bách hóa', 'Nhà cửa'])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('checkbox', [
                    { value: 'a', lable: 'A' },
                    { value: 'b', lable: 'B' },
                ])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('star', [3, 4, 5])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('price', ['Dưới 40000đ', 'Từ 40000đ đến 100000đ', 'Trên 100000đ'])}
            </WrapperContent>
        </div>
    );
}

export default NavbarComponent;