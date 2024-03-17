import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { Fetch } from "../fetch/Fetch";
import Content from "../content/Content";
import FiltersCatalog from "../mainFiltresCatalig/FiltersCatalog";

import "./catalog.css"

const Catalog = () => {

    const [leftActive, setLeftActive] = useState(0);
    const [rightActive, setRightActive] = useState(0);
    const [sliderWidth, setSliderWidth] = useState(0);
    const [clickLeftActive, setClickLeftActive] = useState(false);
    const [clickRightActive, setClickRightActive] = useState(false);
    const [productData, setProductData] = useState(null);
    const [productInfo, setProductInfo] = useState(null);
    const [filtersCatalog, setFiltersCatalog] = useState([]);
    const [showHiddenButton, setShowHiddenButton] = useState(true);
    const [filtersCategory, setFiltersCategory] = useState([]);
    const [filterPrice, setFilterPrice] = useState(null);
    const [timeoutId, setTimeoutId] = useState(null);
    const [valueMinPrice, setValueMinPrice] = useState(null);
    const [valueMaxPrice, setValueMaxPrice] = useState(null);
    const [event, setEvent] = useState("");
    const [quantityFilter, setQuantityFilter] = useState(5);

    const sliderRef = useRef(null);
    const sliderWidthRef = useRef(null);

    const { search } = useLocation();
    const query = new URLSearchParams(search);
    let title = query.get("title");

    const { request } = Fetch();

    useEffect(() => {
        title || filtersCategory ? getAllProducts(1, [], title, filtersCategory, filterPrice) : getAllProducts();
    }, [title, filtersCategory]);

    useEffect(() => {
        const width = Math.floor(sliderWidthRef.current.getBoundingClientRect().width - 24);
        setRightActive(width);
        setSliderWidth(width);
    }, []);

    useEffect(() => {
        let price = productInfo ? productInfo.userPrice : [valueMinPrice, valueMaxPrice];

        if (productInfo) {
            if (productInfo.userPrice && productInfo.userPrice[0] >= valueMaxPrice && productInfo.price[1] === valueMaxPrice) {
                price = [valueMaxPrice, valueMaxPrice];
            }
            if (productInfo.userPrice && productInfo.userPrice[1] <= valueMinPrice && productInfo.price[0] === valueMinPrice) {
                price = [valueMinPrice, valueMinPrice];
            }
        }

        getFilters(quantityFilter, "", null, price);
    }, [productInfo, filtersCategory]);

    const getFilters = (num = 5, text = "", type = null, price = null) => {
        request("http://localhost:3001/filters", "POST", JSON.stringify({
            filtersNumber: num,
            text,
            type,
            price
        }))
            .then(data => setFiltersCatalog(data.data));
    }

    const getAllProducts = (num = 1, productData = [], title = null, category = null, price = null) => {
        request("http://localhost:3001/goods", "POST", JSON.stringify({
            pageSize: 6,
            pageNumber: num,
            title,
            category: category,
            price
        })).then(data => {
            setProductData([...productData, ...data.data]);
            setProductInfo(data.pageInfo);
            if (event === "" || event === "updata") {
                setValueMinPrice(data.pageInfo.price[0]);
                setValueMaxPrice(data.pageInfo.price[1]);
                if (!data.pageInfo.userPrice && data.pageInfo.price[0] === data.pageInfo.price[1]) {
                    setLeftActive(0);
                    setRightActive(0);
                } else if (sliderWidth) {
                    setRightActive(sliderWidth);
                }
            }
            if (event === "moveLeft" || event === "moveRight") {
                setEvent("updata");
            }
            data.data.length === 6 ? setShowHiddenButton(true) : setShowHiddenButton(false);
        });
    }

    const debounceFilterPrice = (value, type, time = 1000) => {
        let min = type === "left" ? Number(value) : filterPrice[0];
        let max = type === "right" ? Number(value) : filterPrice[1];

        if (type === "left") {
            min = productInfo.price[0] >= min ? productInfo.price[0] : min;
            min = min >= max ? max : min;
        }
        if (type === "right") {
            max = productInfo.price[1] <= max ? productInfo.price[1] : max;
            max = max <= min ? min : max;
        }

        const price = [min, max];

        clearTimeout(timeoutId);

        setTimeoutId(setTimeout(() => getAllProducts(1, [], title, filtersCategory, price), time));
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
                    price={item.price}
                />
            );
        });
    }

    const renderFilteresAll = (filteres) => {
        return filteres.map(item => {
            return (
                <FiltersCatalog
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    type={item.type}
                    options={item.options}
                    leftActive={leftActive}
                    rightActive={rightActive}
                    sliderWidth={sliderWidth}
                    setClickLeftActive={setClickLeftActive}
                    setClickRightActive={setClickRightActive}
                    setLeftActive={setLeftActive}
                    setRightActive={setRightActive}
                    getFilters={getFilters}
                    setFiltersCategory={setFiltersCategory}
                    filtersCategory={filtersCategory}
                    setFilterPrice={setFilterPrice}
                    debounceFilterPrice={debounceFilterPrice}
                    getAllProducts={getAllProducts}
                    price={productInfo.price}
                    userPrice={productInfo.userPrice}
                    valueMinPrice={valueMinPrice}
                    valueMaxPrice={valueMaxPrice}
                    setValueMinPrice={setValueMinPrice}
                    setValueMaxPrice={setValueMaxPrice}
                    event={event}
                    setEvent={setEvent}
                    setQuantityFilter={setQuantityFilter}
                />
            );
        });
    }

    const contents = productData ? renderContent(productData) : null;
    const filters = filtersCatalog ? renderFilteresAll(filtersCatalog) : null;

    return (
        <div
            ref={sliderRef}
            onMouseMove={(e) => {
                const activ = e.clientX - sliderRef.current.getBoundingClientRect().x - 10;
                if (clickLeftActive) {
                    setLeftActive(activ);
                    if (activ < 0) {
                        setLeftActive(0);
                    } else if (activ > rightActive) {
                        setLeftActive(rightActive);
                    }
                }
                if (clickRightActive) {
                    setRightActive(activ);
                    if (activ > sliderWidth) {
                        setRightActive(sliderWidth);
                    } else if (activ < leftActive) {
                        setRightActive(leftActive);
                    }
                }
            }}
            onMouseUp={() => {
                if (clickLeftActive || clickRightActive) {
                    getAllProducts(1, [], title, filtersCategory, filterPrice);
                    setClickLeftActive(false);
                    setClickRightActive(false);
                }
            }}
            className="main-catalog">
            <div
                ref={sliderWidthRef}
                className="filtres">
                {filters}
            </div>
            <div className="main-contents">
                <div className="contents">
                    {contents}
                </div>
                <button
                    style={{ display: showHiddenButton ? "" : "none" }}
                    className="btn"
                    onClick={() => {
                        const prop = title ? title : null;
                        const price = productInfo.userPrice ? [productInfo.userPrice[0], productInfo.userPrice[1]] : filterPrice;
                        getAllProducts(productInfo.pageNumber + 1, productData, prop, filtersCategory, price);
                    }}
                >show more</button>
            </div>
        </div>
    );
}

export default Catalog;