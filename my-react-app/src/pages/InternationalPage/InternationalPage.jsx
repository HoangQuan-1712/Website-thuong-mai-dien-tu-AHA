import React from 'react'
import { Row, Col } from 'antd'
import { useQuery } from '@tanstack/react-query'
import * as ProductServices from '../../services/ProductServices'
import CardComponent from '../../components/CardComponent/CardComponent'
import FooterComponent from '../../components/FooterComponent/FooterComponent'
import ChatComponent from '../../components/ChatWidget/ChatWidget'

const InternationalPage = () => {
    const { isLoading, data: internationalData, error } = useQuery({
        queryKey: ['internationalAll'],
        queryFn: () => ProductServices.getInternationalProducts(100),
        select: (res) => res.data,
        retry: 2
    });

    return (
        <>
            <div style={{
                backgroundColor: '#efefef',
                minHeight: '100vh',
                padding: '20px 130px'
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    padding: '24px',
                    marginBottom: '20px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '32px' }}>🌍</span>
                            <h1 style={{
                                fontSize: '28px',
                                fontWeight: 'bold',
                                color: '#333',
                                margin: 0
                            }}>
                                Hàng Ngoại Giá Tốt
                            </h1>
                        </div>

                        <div style={{ fontSize: '16px', color: '#666' }}>
                            Tổng: <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                                {internationalData?.length || 0}
                            </span> sản phẩm
                        </div>
                    </div>

                    <div style={{
                        marginTop: '12px',
                        fontSize: '14px',
                        color: '#666',
                        lineHeight: '1.6'
                    }}>
                        Các sản phẩm nhập khẩu chính hãng, chất lượng cao từ các thương hiệu uy tín trên thế giới.
                        Được đánh giá cao bởi khách hàng với rating từ 4 sao trở lên.
                    </div>
                </div>

                {isLoading ? (
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        padding: '50px',
                        textAlign: 'center',
                        fontSize: '16px',
                        color: '#666'
                    }}>
                        Đang tải sản phẩm quốc tế...
                    </div>
                ) : error ? (
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        padding: '50px',
                        textAlign: 'center',
                        fontSize: '16px',
                        color: '#f5222d'
                    }}>
                        Lỗi: {error.message}
                    </div>
                ) : !internationalData || internationalData.length === 0 ? (
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        padding: '50px',
                        textAlign: 'center',
                        fontSize: '16px',
                        color: '#999'
                    }}>
                        Hiện tại không có sản phẩm nước ngoài nào
                    </div>
                ) : (
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        padding: '20px'
                    }}>
                        <Row gutter={[16, 16]}>
                            {internationalData.map((product) => (
                                <Col
                                    key={product._id}
                                    xs={12}
                                    sm={8}
                                    md={6}
                                    lg={4}
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <CardComponent
                                        {...product}
                                        isInternational={true}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </div>

            <FooterComponent />
            <ChatComponent />
        </>
    );
};

export default InternationalPage;