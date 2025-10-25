import React from 'react'
import { Row, Col } from 'antd'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import {
    WrapperButtonMore, WrapperTypeProduct, WrapperMenuContainer, WrapperProducts,
    WrapperProductContainer, WrapperHeaderProductContainer, WrapperLeftHeaderProductContainer,
    WrapperImageContainer,
    WrapperChildrenImageContainer,
    WrapperContentImageContainer,
    WrapperSlideImageContainer,
    WrapperStyleImageContainer
} from './style'
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
import ArrowButtonComponent from '../../components/ArrowButtonComponent/ArrowButtonComponent';
import image1 from "../../assets/images/image1.webp"
import image2 from "../../assets/images/image2.webp"
import image3 from "../../assets/images/image3.webp"
import image4 from "../../assets/images/image4.webp"
import image5 from "../../assets/images/image5.webp"
import image6 from "../../assets/images/image6.webp"
import image7 from "../../assets/images/image7.webp"
import image8 from "../../assets/images/image8.webp"
import image9 from "../../assets/images/image9.webp"
import image10 from "../../assets/images/image10.webp"
import image11 from "../../assets/images/image11.webp"
import image12 from "../../assets/images/image12.webp"
import image13 from "../../assets/images/image13.webp"
import image14 from "../../assets/images/image14.webp"
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent'
import ChatComponent from '../../components/ChatComponent/ChatComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductServices from '../../services/ProductServices'


//import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'

const HomePage = () => {

    const arr = [
        'Thịt, rau củ', 'Bách hóa', 'Nhà cửa', 'Điện tử', 'Thiết bị số', 'Điện thoại',
        'Mẹ và bé', 'Làm đẹp', 'Gia dụng', 'Thời trang nữ', 'Thời trang nam',
        'Thời trang trẻ em', 'Giày dép', 'Túi xách', 'Đồng hồ', 'Trang sức'
    ];


    const fetchProductAll = async () => {
        try {
            const res = await ProductServices.getAllProduct(100, 0);
            console.log('API response:', res);
            return res;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    const { isLoading, data: products, error } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProductAll,
        select: (res) => {
            console.log('Raw API response:', res);
            // Kiểm tra cấu trúc response
            if (res && res.data) {
                console.log('Products count:', res.data.length);
                console.log('All products:', res.data);
                return res.data;
            }
            return [];
        },
        retry: 3,
        retryDelay: 1000
    });

    // Thêm debug error
    if (error) {
        console.error('Query error:', error);
    }

    /* ===== Menu kéo ngang (giữ logic, chỉ đổi nút) ===== */
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
        if (ref) ref.addEventListener('scroll', handleScroll);
        return () => { if (ref) ref.removeEventListener('scroll', handleScroll); };
    }, []);

    /* ===== Carousel card TRÊN (giữ cơ chế trượt theo "1 trang") ===== */
    const viewportRef = useRef(null);
    const trackRef = useRef(null);
    const [x, setX] = useState(0);
    const GAP = 8; // dùng chung cho cả 2 carousel

    const getStep = () => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!viewport || !track) return 0;
        const first = track.querySelector('[data-card]') || track.children?.[0];
        const cardW = first ? first.getBoundingClientRect().width : viewport.clientWidth;
        const visible = Math.max(1, Math.floor(viewport.clientWidth / (cardW + GAP)));
        return visible * (cardW + GAP);
    };

    const getMinX = () => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!viewport || !track) return 0;
        const maxOverflow = track.scrollWidth - viewport.clientWidth;
        return -Math.max(0, maxOverflow);
    };

    const nextCards = () => setX((prev) => Math.max(prev - getStep(), getMinX()));
    const prevCards = () => setX((prev) => Math.min(prev + getStep(), 0));

    useEffect(() => {
        const onResize = () => setX((curr) => Math.min(0, Math.max(curr, getMinX())));
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    /* ===== Carousel card DƯỚI (bấm mỗi lần đi đúng 1 card) ===== */
    const viewportRef2 = useRef(null);
    const trackRef2 = useRef(null);
    const [x2, setX2] = useState(0);

    const getMinX2 = () => {
        const viewport = viewportRef2.current;
        const track = trackRef2.current;
        if (!viewport || !track) return 0;
        const maxOverflow = track.scrollWidth - viewport.clientWidth;
        return -Math.max(0, maxOverflow);
    };

    // bước = rộng 1 card + gap
    const getCardStep2 = () => {
        const track = trackRef2.current;
        if (!track) return 0;
        const first = track.querySelector('[data-card1]') || track.children?.[0];
        if (!first) return 0;
        const cardW = first.getBoundingClientRect().width;
        return Math.round(cardW + GAP);
    };

    const nextCards2 = () => setX2((prev) => Math.max(prev - getCardStep2(), getMinX2()));
    const prevCards2 = () => setX2((prev) => Math.min(prev + getCardStep2(), 0));

    useEffect(() => {
        const onResize2 = () => setX2((curr) => Math.min(0, Math.max(curr, getMinX2())));
        window.addEventListener('resize', onResize2);
        return () => window.removeEventListener('resize', onResize2);
    }, []);

    const { data: flashSaleData } = useQuery({
        queryKey: ['flashSale'],
        queryFn: () => ProductServices.getFlashSaleProducts(14),
        select: (res) => res.data,
        retry: 2,
        refetchInterval: 60000 // Refresh mỗi 1 phút
    });

    const { data: internationalData } = useQuery({
        queryKey: ['international'],
        queryFn: () => ProductServices.getInternationalProducts(10),
        select: (res) => res.data,
        retry: 2
    });

    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        if (!flashSaleData?.[0]?.flashSaleEndTime) return;

        const timer = setInterval(() => {
            const endTime = new Date(flashSaleData[0].flashSaleEndTime);
            const now = new Date();
            const diff = endTime - now;

            if (diff <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                hours: Math.floor(diff / (1000 * 60 * 60)),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [flashSaleData]);

    return (
        <>
            <Row style={{ padding: '12px' }}>
                <Col span={24} style={{ padding: '0 130px 0px 130px' }}>
                    <WrapperMenuContainer>
                        {showLeftButton && (
                            <ArrowButtonComponent direction="left" onClick={scrollLeft} ariaLabel="Kéo trái" />
                        )}

                        <WrapperTypeProduct ref={menuRef}>
                            {arr.map((item) => (
                                <TypeProduct name={item} key={item} />
                            ))}
                        </WrapperTypeProduct>

                        {showRightButton && (
                            <ArrowButtonComponent direction="right" onClick={scrollRight} ariaLabel="Kéo phải" />
                        )}
                    </WrapperMenuContainer>
                </Col>
            </Row>
            <div id="container" style={{
                backgroundColor: '#efefef', padding: '0px 130px 0px 130px', height: '3000px'
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

                <Row style={{ marginTop: '20px', display: 'flex', maxWidth: '100%', overflowX: 'hidden' }}>
                    <WrapperProductContainer span={16}>
                        <WrapperHeaderProductContainer>
                            <WrapperLeftHeaderProductContainer>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <img
                                        style={{ maxWidth: '100%', borderStyle: 'none' }}
                                        src="https://salt.tikicdn.com/ts/upload/f8/77/0b/0923990ed377f50c3796f9e6ce0dddde.png"
                                        alt="Flash Sale"
                                        width="204"
                                        height="32"
                                    />

                                    {/* Countdown Timer */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '8px',
                                        marginLeft: '16px',
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        color: '#ff424e'
                                    }}>
                                        <div style={{
                                            background: '#000',
                                            color: '#fff',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            minWidth: '40px',
                                            textAlign: 'center'
                                        }}>
                                            {String(timeLeft.hours).padStart(2, '0')}
                                        </div>
                                        <span>:</span>
                                        <div style={{
                                            background: '#000',
                                            color: '#fff',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            minWidth: '40px',
                                            textAlign: 'center'
                                        }}>
                                            {String(timeLeft.minutes).padStart(2, '0')}
                                        </div>
                                        <span>:</span>
                                        <div style={{
                                            background: '#000',
                                            color: '#fff',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            minWidth: '40px',
                                            textAlign: 'center'
                                        }}>
                                            {String(timeLeft.seconds).padStart(2, '0')}
                                        </div>
                                    </div>
                                </div>

                                <a
                                    href="/flash-sale"
                                    style={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        lineHeight: 1.5,
                                        color: 'rgb(10, 104, 255)',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Xem tất cả
                                </a>
                            </WrapperLeftHeaderProductContainer>
                        </WrapperHeaderProductContainer>
                        <div style={{ width: '100%', position: 'relative' }}>
                            <div style={{ overflow: 'hidden' }} ref={viewportRef}>
                                <span
                                    ref={trackRef}
                                    style={{
                                        display: 'inline-flex',
                                        gap: 8,
                                        transform: `translateX(${x}px)`,
                                        transition: 'transform 0.5s ease-in-out',
                                        minWidth: '100%',
                                    }}
                                >
                                    {flashSaleData?.map((product) => (
                                        <div key={product._id} data-card style={{ flex: '0 0 auto' }}>
                                            <CardComponent
                                                {...product}
                                                // Override discount với flashSaleDiscount
                                                discount={product.flashSaleDiscount}
                                                isFlashSale={true}
                                            />
                                        </div>
                                    ))}
                                </span>
                            </div>

                            <ArrowButtonComponent direction="right" onClick={nextCards} ariaLabel="Xem tiếp" />
                            <ArrowButtonComponent direction="left" onClick={prevCards} ariaLabel="Xem trước" />
                        </div>
                    </WrapperProductContainer>

                    <Col span={8}>
                        <SliderComponent arrImages2={[Slide7, Slide8, Slide9]} />
                    </Col>
                </Row>

                <Row style={{ marginTop: '20px', display: 'flex', maxWidth: '100%', overflowX: 'hidden' }}>
                    <WrapperProductContainer span={24}>
                        <WrapperHeaderProductContainer>
                            <WrapperLeftHeaderProductContainer>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <div style={{
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        color: '#333',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        🌍 Hàng ngoại giá tốt
                                    </div>
                                </div>

                                <a
                                    href="/international"
                                    style={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        lineHeight: 1.5,
                                        color: 'rgb(10, 104, 255)',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Xem tất cả
                                </a>
                            </WrapperLeftHeaderProductContainer>
                        </WrapperHeaderProductContainer>

                        {/* International Products Carousel */}
                        <div style={{ width: '100%', position: 'relative' }}>
                            <div style={{ overflow: 'hidden' }} ref={viewportRef2}>
                                <span
                                    ref={trackRef2}
                                    style={{
                                        gap: 8,
                                        transform: `translateX(${x2}px)`,
                                        transition: 'transform 0.5s ease-in-out',
                                        display: 'inline-flex',
                                        minWidth: '100%',
                                    }}
                                >
                                    {internationalData?.map((product) => (
                                        <div key={product._id} data-card1 style={{ flex: '0 0 auto' }}>
                                            <CardComponent
                                                {...product}
                                                isInternational={true}
                                            />
                                        </div>
                                    ))}
                                </span>
                            </div>

                            <ArrowButtonComponent direction="right" onClick={nextCards2} ariaLabel="Xem tiếp" />
                            <ArrowButtonComponent direction="left" onClick={prevCards2} ariaLabel="Xem trước" />
                        </div>
                    </WrapperProductContainer>
                </Row>

                <Row style={{ marginTop: '20px' }}>
                    <Col span={24} style={{
                        display: 'block',
                        unicodeBidi: 'isolate'
                    }}>
                        <WrapperImageContainer>
                            <WrapperChildrenImageContainer>
                                <WrapperContentImageContainer>
                                    <WrapperSlideImageContainer>
                                        <div style={{
                                            display: '-webkit-box',
                                            width: '100%',
                                            unicodeBidi: 'isolate'
                                        }}>
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(7, 1fr)',
                                                    gridTemplateRows: 'repeat(2, 1fr)',
                                                    gridAutoFlow: 'row',
                                                    gap: 12,
                                                    width: '100%',
                                                    unicodeBidi: 'isolate',
                                                }}
                                            >
                                                <WrapperStyleImageContainer>
                                                    <ImageComponent
                                                        href="https://4x.ant.design/components/popover/#header#" src={image1} alt="Tên sản phẩm" />
                                                </WrapperStyleImageContainer>
                                                <WrapperStyleImageContainer>
                                                    <ImageComponent
                                                        href="https://4x.ant.design/components/popover/#header#" src={image2} alt="Tên sản phẩm" />
                                                </WrapperStyleImageContainer>
                                                <WrapperStyleImageContainer>
                                                    <ImageComponent
                                                        href="https://4x.ant.design/components/popover/#header#" src={image3} alt="Tên sản phẩm" />
                                                </WrapperStyleImageContainer>
                                                <WrapperStyleImageContainer>
                                                    <ImageComponent
                                                        href="https://4x.ant.design/components/popover/#header#" src={image4} alt="Tên sản phẩm" />
                                                </WrapperStyleImageContainer>
                                                <WrapperStyleImageContainer>
                                                    <ImageComponent
                                                        href="https://4x.ant.design/components/popover/#header#" src={image5} alt="Tên sản phẩm" />
                                                </WrapperStyleImageContainer>
                                                <WrapperStyleImageContainer>
                                                    <ImageComponent
                                                        href="https://4x.ant.design/components/popover/#header#" src={image6} alt="Tên sản phẩm" />
                                                </WrapperStyleImageContainer>
                                                <WrapperStyleImageContainer>
                                                    <ImageComponent
                                                        href="https://4x.ant.design/components/popover/#header#" src={image7} alt="Tên sản phẩm" />
                                                </WrapperStyleImageContainer>
                                                <WrapperStyleImageContainer>
                                                    <ImageComponent
                                                        href="https://4x.ant.design/components/popover/#header#" src={image8} alt="Tên sản phẩm" />
                                                </WrapperStyleImageContainer>
                                                <WrapperStyleImageContainer>
                                                    <ImageComponent
                                                        href="https://4x.ant.design/components/popover/#header#" src={image9} alt="Tên sản phẩm" />
                                                </WrapperStyleImageContainer>
                                                <WrapperStyleImageContainer>
                                                    <ImageComponent
                                                        href="https://4x.ant.design/components/popover/#header#" src={image10} alt="Tên sản phẩm" />
                                                </WrapperStyleImageContainer>

                                                <WrapperStyleImageContainer>
                                                    <ImageComponent
                                                        href="https://4x.ant.design/components/popover/#header#" src={image11} alt="Tên sản phẩm" />
                                                </WrapperStyleImageContainer>
                                                <WrapperStyleImageContainer>
                                                    <ImageComponent
                                                        href="https://4x.ant.design/components/popover/#header#" src={image12} alt="Tên sản phẩm" />
                                                </WrapperStyleImageContainer>
                                                <WrapperStyleImageContainer>
                                                    <ImageComponent
                                                        href="https://4x.ant.design/components/popover/#header#" src={image13} alt="Tên sản phẩm" />
                                                </WrapperStyleImageContainer>
                                                <WrapperStyleImageContainer>
                                                    <ImageComponent
                                                        href="https://4x.ant.design/components/popover/#header#" src={image14} alt="Tên sản phẩm" />
                                                </WrapperStyleImageContainer>
                                            </div>
                                        </div>
                                    </WrapperSlideImageContainer>
                                </WrapperContentImageContainer>
                            </WrapperChildrenImageContainer>
                        </WrapperImageContainer>

                    </Col >

                </Row >

                <WrapperProducts style={{ marginTop: '20px' }}>
                    {isLoading ? (
                        <div style={{
                            width: '100%',
                            textAlign: 'center',
                            padding: '50px',
                            fontSize: '16px',
                            color: '#666'
                        }}>
                            Đang tải sản phẩm...
                        </div>
                    ) : !products || !Array.isArray(products) || products.length === 0 ? ( // SỬA: Thêm check Array.isArray
                        <div style={{
                            width: '100%',
                            textAlign: 'center',
                            padding: '50px',
                            fontSize: '16px',
                            color: '#999'
                        }}>
                            Không có sản phẩm nào
                        </div>
                    ) : (
                        products.map((product) => (
                            <CardComponent
                                key={product._id || product.id}
                                countInStock={product.countInStock}
                                description={product.description}
                                image={product.image}
                                name={product.name}
                                price={product.price}
                                rating={product.rating}
                                type={product.type}
                                discount={product.discount}
                                selled={product.selled}
                            />
                        ))
                    )}
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
            <FooterComponent />
            <ChatComponent />
        </>
    );
};

export default HomePage;

