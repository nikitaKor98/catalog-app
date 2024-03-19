import { useState, useEffect } from "react";

import Banner from "../banner/Banner";
import Slider from "../slider/Slider";
import Content from "../content/Content";
import Loader from "../loader/Loader";

import { Fetch } from "../fetch/Fetch";

import "./home.css"

const Home = () => {

    const [slides, setSlides] = useState([]);
    const [productPoular, setProductPoular] = useState([]);
    const [productRecom, setProductRecom] = useState([]);
    const [widthCard, setWidthCard] = useState(0);
    const [widthIMG, setWidthIMG] = useState(0);
    const [heigthIMG, setHeigthIMG] = useState(0);
    const [heightSlide, setHeightSlide] = useState(0);
    const [activCircle, setActivCircle] = useState(0);

    const { request, setStage, stage } = Fetch();

    useEffect(() => {
        getProduct(1, setProductPoular);
        getProduct(2, setProductRecom);
        getSlides();
    }, []);

    const getSlides = () => {
        request("http://localhost:3001/slides", "POST")
            .then(data => setSlides(data))
            .then(() => setStage("completed"));
    }

    const getProduct = (num, fn) => {
        request("http://localhost:3001/goods", "POST", JSON.stringify({
            pageSize: 15,
            pageNumber: num
        })).then(data => fn(data.data));
    }

    const renderBanner = (arr) => {
        return arr.map(item => {
            return (
                <Banner
                    key={item.id}
                    img={item.img}
                    id={item.id}
                    width={widthIMG}
                    height={heigthIMG}
                />
            );
        });
    }

    const renderContent = (arr) => {
        return arr.map(item => {
            return (
                <Content
                    key={item.id}
                    id={item.id}
                    name={item.title}
                    description={item.description}
                    img={item.img_url}
                    setWidthCard={setWidthCard}
                    setHeightSlide={setHeightSlide}
                />
            );
        });
    }

    const banners = renderBanner(slides);
    const popular = productPoular ? renderContent(productPoular) : null;
    const recommended = productRecom ? renderContent(productRecom) : null;

    return (
        <div className="home">
            {stage === "waiting" &&
                <div className="loader-container">
                    <Loader />
                </div>}
            {stage === "completed" &&
                <>
                    <Slider
                        type="banner"
                        setWidthIMG={setWidthIMG}
                        setHeigthIMG={setHeigthIMG}
                        widthSlides={slides.length}
                    >
                        {banners}
                    </Slider>
                    <Slider
                        type="content"
                        widthCard={widthCard}
                        heightSlide={heightSlide}
                        widthProduct={productPoular.length}>
                        <a style={{ display: "flex", position: "absolute" }}>Popular goods</a>
                        {popular}
                    </Slider>
                    <Slider
                        type="content"
                        widthCard={widthCard}
                        heightSlide={heightSlide}
                        widthProduct={productRecom.length}>
                        <a style={{ display: "flex", position: "absolute" }}>Recommended Products</a>
                        {recommended}
                    </Slider>
                </>}
        </div>
    )
}

export default Home;