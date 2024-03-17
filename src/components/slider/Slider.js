import { useState, useRef, useEffect } from "react";

import "./slider.css"

const Slider = ({ children, type, widthProduct, widthCard, widthSlides, setWidthIMG, setHeigthIMG, heightSlide }) => {

    const [value, setValue] = useState(0);
    const [active, setActive] = useState(0);
    const [scrol, setScrol] = useState(0);
    const [widthBanner, setWidthBanner] = useState(0);
    const [noneLeft, setNoneLeft] = useState("hidden");
    const [noneRight, setNoneRight] = useState("");

    const widthSlideRef = useRef(null);
    const widthBannerRef = useRef(null);

    useEffect(() => {
        if (widthBannerRef.current) {
            setWidthBanner(widthBannerRef.current.getBoundingClientRect().width);
            setWidthIMG(widthBannerRef.current.getBoundingClientRect().width);
            setHeigthIMG(widthBannerRef.current.getBoundingClientRect().height);
        }
    }, []);

    useEffect(() => {
        if (type === "banner") {
            let num;
            const timeoutId = setTimeout(() => {
                active < 3 ? num = active + 1 : num = 0;
                svipeSlide(num * widthBanner, num);
            }, 3000);
            return () => {
                clearTimeout(timeoutId);
            }
        }
    }, [active, widthBanner]);

    const svipeSlide = (value, e) => {
        setValue(value);
        setActive(Number(e));
    }

    const activScrol = (num) => {
        setScrol(num);
    }

    const btnSlider = (arr) => {
        return arr.map((item, id) => {
            const value = id * widthBanner;
            return (
                <div
                    key={id}
                    id={id}
                    onClick={(e) => {
                        svipeSlide(value, e.target.getAttribute("id"));
                    }}
                    className={`btn-slider ${id === active ? "active" : ""}`}>
                </div>
            )
        });
    }

    const render = Array.isArray(children) ? btnSlider(children) : null;

    switch (type) {
        case "banner":
            return (
                <div
                    ref={widthBannerRef}
                    className="sliders sliders-banner">
                    <div
                        className="slider-conteiner"
                        style={{ width: `${widthBanner * widthSlides}px`, transform: `translateX(${-value}px)` }}>
                        {children}
                    </div>
                    <div className="slider-dots">
                        {render}
                    </div>
                </div>
            )
        case "content":
            return (
                <div
                    ref={widthSlideRef}
                    style={{ height: `${heightSlide}px` }}
                    className="sliders">
                    <div
                        className="slider-conteiner"
                        style={{ width: `${widthProduct * widthCard}px`, transform: `translateX(${-scrol}px)` }}>
                        {children}
                    </div>
                    <div className="scrolBtn">
                        <button
                            onClick={() => {
                                const activ = widthSlideRef.current.getBoundingClientRect().width;
                                if (scrol <= 0 + activ) {
                                    activScrol(0);
                                    setNoneLeft("hidden");
                                } else {
                                    activScrol(scrol - activ);
                                    setNoneRight("show");
                                }
                            }}
                            className={`button_circle ${noneLeft}`}>
                            <div className="left"></div>
                        </button>
                        <button
                            onClick={() => {
                                const activ = widthSlideRef.current.getBoundingClientRect().width;
                                const lastSlide = widthProduct * widthCard - activ;
                                if (scrol >= lastSlide - activ) {
                                    activScrol(lastSlide);
                                    setNoneRight("hidden");
                                } else {
                                    activScrol(scrol + activ);
                                    setNoneLeft("show");
                                }
                            }}
                            className={`button_circle circle_right ${noneRight}`}>
                            <div className="right"></div>
                        </button>
                    </div>
                </div>
            )
    }
}

export default Slider;