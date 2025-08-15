import React from "react"
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent"
import CardComponent from "../../components/CardComponent/CardComponent"
import {  Row, Pagination } from "antd"
import { WrapperProducts, WrapperNavbar } from "./style"  
const onChange = (pageNumber) => {};

const TypeProductPage = () => {
    return (
        <div style={{ padding: '0 130px 0 130px', background: '#efefef'}}>
        <Row style={{  flexWrap: 'nowrap', paddingTop: '10px', }}>
            <WrapperNavbar span={4} >
                <NavbarComponent />
            </WrapperNavbar>
            <WrapperProducts span={20}>
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
            </WrapperProducts>
            
        </Row>
        <Pagination style={{ alignItems: 'center', justifyContent: 'center',display: 'flex', marginTop: '10px' }}    showQuickJumper defaultCurrent={2} total={500} onChange={onChange} />
        </div>
    )
}

export default TypeProductPage