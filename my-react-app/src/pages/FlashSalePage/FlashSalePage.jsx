import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { useQuery } from '@tanstack/react-query';
import * as ProductServices from '../../services/ProductServices';
import CardComponent from '../../components/CardComponent/CardComponent';
import HeroCarousel from '../../components/HeroLikeCarousel/HeroLikeCarousel';
import banner1 from '../../assets/images/banner1.webp';
import banner2 from '../../assets/images/banner2.webp';
import banner3 from '../../assets/images/banner3.webp';
import banner4 from '../../assets/images/banner4.webp';
import styles from './FlashSalePage.module.css';

const FlashSalePage = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    const { isLoading, data: flashSaleData, error } = useQuery({
        queryKey: ['flashSaleAll'],
        queryFn: () => ProductServices.getFlashSaleProducts(100),
        select: (res) => res.data,
        retry: 2,
        refetchInterval: 60000,
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
                seconds: Math.floor((diff / 1000) % 60),
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [flashSaleData]);

    return (
        <main className={styles.page}>
            {/* Hero + Slider */}
            <section className={styles.hero}>
                <div className={styles.sliderRow}>
                    <div className={styles.container}>
                        <HeroCarousel
                            items={[
                                { src: banner1, alt: 'Khuyến mãi 1', href: '/deal-1' },
                                { src: banner2, alt: 'Khuyến mãi 2', href: '/deal-2' },
                                { src: banner3, alt: 'Khuyến mãi 3', href: '/deal-3' },
                                { src: banner4, alt: 'Khuyến mãi 4', href: '/deal-4' },
                            ]}
                            autoPlay={10000} // hoặc false để tắt tự chạy
                        />
                    </div>
                </div>
                <>
                    <section className={styles.content}>
                        {/* Header */}
                        <div className={styles.card}>
                            <div className={styles.headerRow}>
                                <div className={styles.headerLeft}>
                                    <img
                                        className={styles.badge}
                                        src="https://salt.tikicdn.com/ts/upload/f8/77/0b/0923990ed377f50c3796f9e6ce0dddde.png"
                                        alt="Flash Sale"
                                        width="204"
                                        height="32"
                                    />
                                    <div className={styles.timer}>
                                        <span className={styles.pill}>{String(timeLeft.hours).padStart(2, '0')}</span>
                                        <span className={styles.sep}>:</span>
                                        <span className={styles.pill}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                                        <span className={styles.sep}>:</span>
                                        <span className={styles.pill}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                                    </div>
                                </div>
                                <div className={styles.total}>
                                    Tổng: <b className={styles.totalNum}>{flashSaleData?.length || 0}</b> sản phẩm
                                </div>
                            </div>
                        </div>

                        {/* Grid sản phẩm */}
                        {isLoading ? (
                            <div className={`${styles.card} ${styles.center}`}>
                                Đang tải sản phẩm Flash Sale...
                            </div>
                        ) : error ? (
                            <div className={`${styles.card} ${styles.center} ${styles.error}`}>
                                Lỗi: {error.message}
                            </div>
                        ) : !flashSaleData || flashSaleData.length === 0 ? (
                            <div className={`${styles.card} ${styles.center} ${styles.muted}`}>
                                Hiện tại không có sản phẩm Flash Sale nào
                            </div>
                        ) : (
                            <div className={styles.card}>
                                <Row gutter={[16, 16]}>
                                    {flashSaleData.map((product) => (
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
                                                discount={product.flashSaleDiscount}
                                                isFlashSale={true}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}
                    </section>
                </>
            </section>
        </main>
    );
};

export default FlashSalePage;
