import React from "react"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Image } from 'antd';

const SliderComponent = ({
    arrImages = [], arrImages2 = []
}) => {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000
    };

    const divStyle1 = {
        height: '230px',
        overflow: 'hidden',
    };

    const divStyle2 = {
        height: '320px',
        overflow: 'hidden',
    };

    return (
        <div >
            {arrImages.length > 0 && (
                <div style={divStyle1}>
                    <Slider {...settings}>
                        {arrImages.map((image) => (
                            <Image
                                src={image}
                                alt="slider1"
                                preview={false}

                            />
                        ))}
                    </Slider>
                </div>
            )}

            {/* Div 2 cho arrImages2 với style khác */}
            {arrImages2.length > 0 && (
                <div style={divStyle2}>
                    <Slider {...settings}>
                        {arrImages2.map((image) => (
                            <Image
                                src={image}
                                alt="slider2"
                                preview={false}

                            />
                        ))}
                    </Slider>
                </div>
            )}
        </div>

    );
}

export default SliderComponent;

