import { Col, Row } from "antd"
import React from "react"
import imageProduct from "../../assets/images/image.webp"
import imageProductSmall from "../../assets/images/imagesmall.webp"
import { WrapperInputNumber, WrapperAddressProduct, WrapperPriceProduct, 
    WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleImageSmall, 
    WrapperStyleNameBrand, WrapperStyleNameProduct, WrapperStyleTextSell, 
    WrapperBtnQualityProduct
} from "./style"
import { WrapperStyleColImage } from "./style"
import { WrapperStyleImage } from "./style"
import { MinusOutlined, PlusOutlined, StarFilled } from '@ant-design/icons';
import ButtonComponent from "../ButtonComponent/ButtonComponent"



const ProductDetailsComponent = () => {
    const onChange = () => {}
    return (
        <Row style={{padding:'16px', background:'rgb(250, 250, 250)', borderRadius: '8px'}}>
            <Col span={10} style={{borderRight: '1px solid #e5e5e5', paddingRight: '8px', marginTop: '1px'}} >
                <WrapperStyleImage src={imageProduct} alt="image product" preview={false}/>
                <Row style={{paddingTop: '10px', justifyContent: 'space-between'}}>
                    <WrapperStyleColImage span={4}>
                    <WrapperStyleImageSmall src={imageProductSmall} alt="image product" preview={false}/>
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                    <WrapperStyleImageSmall src={imageProductSmall} alt="image product" preview={false}/>
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                    <WrapperStyleImageSmall src={imageProductSmall} alt="image product" preview={false}/>
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                    <WrapperStyleImageSmall src={imageProductSmall} alt="image product" preview={false}/>
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                    <WrapperStyleImageSmall src={imageProductSmall} alt="image product" preview={false}/>
                    </WrapperStyleColImage>

                    <WrapperStyleColImage span={4}>
                    <WrapperStyleImageSmall src={imageProductSmall} alt="image product" preview={false}/>
                    </WrapperStyleColImage>
                </Row>
            </Col>
            <Col span={14} style={{paddingLeft: '10px'}}>
                <WrapperStyleNameBrand>Thương hiệu: Vinamilk</WrapperStyleNameBrand>
                <WrapperStyleNameProduct>Sữa ngon bổ rẻ nhiều khoáng chất tốt cho sức khỏe</WrapperStyleNameProduct>
            
            <div >
                <StarFilled style={{ color: '#fadb14', fontSize: '10px' }} />
                <StarFilled style={{ color: '#fadb14', fontSize: '10px' }} />
                <StarFilled style={{ color: '#fadb14', fontSize: '10px' }} />
                <WrapperStyleTextSell>| Đã bán 1000+</WrapperStyleTextSell>
            </div>
            <WrapperPriceProduct>
                <WrapperPriceTextProduct>
                    200.000 đ
                </WrapperPriceTextProduct>
            </WrapperPriceProduct>
            <WrapperAddressProduct>
                <span>Giao đến</span>-
                <span className='address'>Bắc Từ Liêm Hà Nội</span>-
                <span className="chage-address">Đổi địa chỉ</span>
            </WrapperAddressProduct>

            <div style={{padding:'10px 0 ', margin: '10px 0 20px ', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5'}} >
                <div style={{paddingBottom:'5px'}}>Số lượng</div>
                <WrapperQualityProduct>
                    <WrapperBtnQualityProduct>
                        <MinusOutlined style={{color: '#000', fontSize: '15px'}}/>
                    </WrapperBtnQualityProduct>

                    <WrapperInputNumber style={{alignItems: 'center'}} defaultValue={3} onChange={onChange} size="small" />
                    
                    <WrapperBtnQualityProduct>
                        <PlusOutlined  style={{color: '#000', fontSize: "15px"}}/>
                    </WrapperBtnQualityProduct>
                </WrapperQualityProduct>
            </div>

            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <ButtonComponent
                    size={40}
                    styleButton={{
                        backgroundColor: 'rgb(255, 57, 69)',
                        height: '48px',
                        width: '220px',  
                        border: 'none',
                        borderRadius: '4px'
                    }}
                    textButton={'Chọn mua'}
                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                />

<ButtonComponent
                    size={40}
                    styleButton={{
                        backgroundColor: '#fff',
                        height: '48px',
                        width: '220px',  
                        border: '1px solid rgb(13, 92, 182)',
                        borderRadius: '4px'
                    }}
                    textButton={'Mua trước trả sau'}
                    styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
                />
            </div>
            </Col>
        </Row>
    )
}

export default ProductDetailsComponent