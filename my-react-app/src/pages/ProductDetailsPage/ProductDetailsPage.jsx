import React from "react"
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent"

const ProductDetailsPage = () => {
    return (
        <div style={{padding: '0px 130px 0px 130px', background: '#efefef', height: '1000px'}}>
            <h5>Trang chủ</h5>

            <div style={{background: '#fff', borderRadius: '8px'}}>
            <ProductDetailsComponent />
            </div>
            
        </div>
    )
}

export default ProductDetailsPage;