import React from 'react'
import { Row, Col } from 'antd'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperTypeProduct, WrapperMenuContainer, ScrollButton, WrapperProducts } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import Slide1 from '../../assets/images/Slide1.webp'
import Slide2 from '../../assets/images/Slide2.webp'
//import Slide3 from '../../assets/images/Slide3.webp'
import Slide4 from '../../assets/images/Slide4.webp'
import Slide5 from '../../assets/images/Slide5.webp'
import Slide6 from '../../assets/images/Slide6.webp'
import Slide7 from '../../assets/images/Slide7.webp'
import Slide8 from '../../assets/images/Slide8.webp'
import Slide9 from '../../assets/images/Slide9.webp'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useRef, useState, useEffect } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'



//import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'

const HomePage = () => {

    const arr = ['Thịt, rau củ', 'Bách hóa', 'Nhà cửa', 'Điện tử', 'Thiết bị số', 'Điện thoại', 'Mẹ và bé', 'Làm đẹp', 'Gia dụng', 'Thời trang nữ', 'Thời trang nam', 'Thời trang trẻ em', 'Giày dép', 'Túi xách', 'Đồng hồ', 'Trang sức'];
    const menuRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);

    const handleScroll = () => {
        if (menuRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = menuRef.current;
            setShowLeftButton(scrollLeft > 0);
            setShowRightButton(scrollLeft + clientWidth < scrollWidth);
        }
    };

    const scrollLeft = () => {
        if (menuRef.current) {
            menuRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (menuRef.current) {
            menuRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        handleScroll(); // Kiểm tra ban đầu
        const ref = menuRef.current;
        if (ref) {
            ref.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (ref) {
                ref.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);
    return (
        <>
            <Row>
                <Col span={24} style={{ padding: '0 130px 0px 130px' }}>
                    <WrapperMenuContainer>
                        {showLeftButton && (
                            <ScrollButton className="left" onClick={scrollLeft}>
                                <LeftOutlined />
                            </ScrollButton>
                        )}
                        <WrapperTypeProduct ref={menuRef}>
                            {arr.map((item) => (
                                <TypeProduct name={item} key={item} />
                            ))}
                        </WrapperTypeProduct>
                        {showRightButton && (
                            <ScrollButton className="right" onClick={scrollRight}>
                                <RightOutlined />
                            </ScrollButton>
                        )}
                    </WrapperMenuContainer>
                </Col>
            </Row>
            <div id="container" style={{
                backgroundColor: '#efefef', padding: '0px 130px 0px 130px', height: '2000px'
            }}>
                <div style={{
                 display: 'flex', width: '100%', maxWidth: 1600, margin: '0  auto', gap: '5px', paddingBottom: '10px'
                }}>
                    <div style={{ flex: 5, maxWidth: '50%' }}>
                        <SliderComponent arrImages={[Slide1, Slide5, Slide6, Slide4]} />
                    </div>
                    <div style={{ flex: 3, maxWidth: '50%' }}>
                        <SliderComponent arrImages={[Slide2]} />
                    </div>
                </div>

                <Row style={{  display: 'flex', maxWidth: '100%', overflowX: 'hidden' }}>
                    <Col span={16} style={{ backgroundColor: 'rgb(255, 255, 255)'}} >col-12</Col>
                    <Col span={8}><SliderComponent arrImages2={[Slide7, Slide8, Slide9]} /></Col>
                </Row>

                <WrapperProducts>
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                </WrapperProducts>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <WrapperButtonMore textButton="Xem thêm" type="outline"
                        styleButton={{
                            border: '1px solid rgb(11, 116, 229)',
                            color: 'rgb(11, 116, 229)',
                            width: '240px', height: '38px',
                            borderRadius: '4px'
                        }}
                        styleTextButton={{
                            fontWeight: '500',
                        }}

                    />
                </div>

            </div >
        </>
    );
};

export default HomePage;

