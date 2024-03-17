import { useState, useEffect, useRef } from "react";

import "./filtersCatalog.css"

const FiltersCatalog = (props) => {

    const {
        id,
        name,
        type,
        options,
        leftActive,
        rightActive,
        sliderWidth,
        setClickLeftActive,
        setClickRightActive,
        setLeftActive,
        setRightActive,
        getFilters,
        setFiltersCategory,
        filtersCategory,
        setFilterPrice,
        debounceFilterPrice,
        price,
        userPrice,
        valueMinPrice,
        valueMaxPrice,
        setValueMinPrice,
        setValueMaxPrice,
        event,
        setEvent,
        setQuantityFilter
    } = props;

    const [showScroll, setShowScroll] = useState("hidden");

    const refType = useRef();

    useEffect(() => {
        if (event === "priceLeft") {
            setUserInput(valueMinPrice, "left");
        }
        if (event === "priceRight") {
            setUserInput(valueMaxPrice, "right");
        }
        if (event === "moveLeft") {
            setValueMinPrice(Math.floor(price[0] + (price[1] - price[0]) * leftActive / sliderWidth));
            setFilterPrice([valueMinPrice, valueMaxPrice]);
        }
        if (event === "moveRight") {
            setValueMaxPrice(Math.floor(price[1] - (price[1] - price[0]) * -(rightActive - sliderWidth) / sliderWidth));
            setFilterPrice([valueMinPrice, valueMaxPrice]);
        }
        if (event === "updata") {
            setValueUserPrice();
        }
    }, [leftActive, rightActive, valueMinPrice, valueMaxPrice, event]);

    const setValueUserPrice = () => {
        if (userPrice) {
            userPrice[0] >= valueMinPrice ? setLeftActive(sliderWidth * (userPrice[0] - price[0]) / (price[1] - price[0])) : setLeftActive(0);
            userPrice[0] >= valueMinPrice ? setValueMinPrice(userPrice[0]) : setValueMinPrice(price[0]);
            userPrice[1] <= valueMaxPrice ? setRightActive(sliderWidth - (sliderWidth * (price[1] - userPrice[1]) / (price[1] - price[0]))) : setRightActive(sliderWidth);
            userPrice[1] <= valueMaxPrice ? setValueMaxPrice(userPrice[1]) : setValueMaxPrice(price[1]);
        }
        if (userPrice && price[0] === price[1]) {
            setLeftActive(0);
            setRightActive(0);
        }
        if (userPrice && userPrice[0] > valueMaxPrice) {
            setLeftActive(sliderWidth);
            setValueMinPrice(price[1]);
        }
        if (userPrice && userPrice[0] < valueMinPrice && userPrice[1] < valueMinPrice) {
            setRightActive(0);
            setValueMinPrice(price[0]);
            setValueMaxPrice(price[0]);
        }
    }

    const setValueFilterPrice = () => {
        const valueMin = price[0] + (price[1] - price[0]) * leftActive / sliderWidth;
        const valueMax = price[1] - (price[1] - price[0]) * -(rightActive - sliderWidth) / sliderWidth;

        const min = valueMinPrice <= price[0] ? price[0] : Math.floor(valueMin);
        const max = valueMaxPrice >= price[1] ? price[1] : Math.floor(valueMax);

        setValueMinPrice(min);
        setValueMaxPrice(max);

        setFilterPrice([min, max]);
    }

    const setUserInput = (input, type) => {
        if (input === 0) {
            if (type === "right") {
                setRightActive(sliderWidth);
                setValueMaxPrice("");
            }
            if (type === "left") {
                setLeftActive(0);
                setValueMinPrice("");
            }
        }
        if (input > 0 && type === "left") {
            setValueMinPrice(input);
            if (input <= price[0]) {
                setLeftActive(0);
            } else if (input >= Math.floor(price[1] - (price[1] - price[0]) * -(rightActive - sliderWidth) / sliderWidth)) {
                setLeftActive(rightActive);
            } else {
                setLeftActive(sliderWidth * (input - price[0]) / (price[1] - price[0]));
            }
        }
        if (input > 0 && type === "right") {
            setValueMaxPrice(input);
            if (input >= price[1]) {
                setRightActive(sliderWidth);
            } else if (input <= price[0] + (price[1] - price[0]) * leftActive / sliderWidth) {
                setRightActive(leftActive);
            } else {
                setRightActive(sliderWidth - (sliderWidth * (price[1] - input) / (price[1] - price[0])));
            }
        }
        debounceFilterPrice(input, type);
    }

    const addFilters = (e) => {
        const value = filtersCategory.some((text) => text === e);

        if (value) {
            setFiltersCategory(filtersCategory.filter(item => item !== e));
        } else {
            setFiltersCategory([...filtersCategory, `${e}`]);
        }
    }

    const renderFilters = (arr, type) => {
        const result = arr.map(item => {
            switch (type) {
                case "or":
                    return (
                        <div
                            onClick={(e) => {
                                addFilters(e.target.getAttribute("name"));
                                setEvent("updata");
                            }}
                            key={item.id}
                            name={item.name}
                            className={`type-filter${!item.quantity && !filtersCategory.some((text) => text === item.name) ? " noHover" : ""}`}>
                            {!item.quantity && !filtersCategory.some((text) => text === item.name) ? <div className="curtain"></div> : null}
                            <span
                                name={item.name}
                                className="checkbox">
                                <span
                                    name={item.name}
                                    className="activCheckbox"
                                    style={{ display: `${filtersCategory.some((text) => text === item.name) ? "block" : "none"}` }}>
                                </span>
                            </span>
                            <span
                                className="filter-name"
                                name={item.name}
                            >{item.name}</span>
                            <span
                                className="counter"
                                name={item.name}
                            >{item.quantity}</span>
                        </div>
                    );
                case "and":
                    return (
                        <div
                            key={item.id}
                            className="range">
                            <input
                                name={item.minPrice}
                                value={valueMinPrice}
                                onFocus={() => setValueFilterPrice()}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setValueMinPrice(Number(value));
                                    setEvent("priceLeft");
                                }}
                                onBlur={() => {
                                    setValueFilterPrice();
                                }}
                                className="input range_input"
                                placeholder={item.minPrice} />
                            <div className="doofis"></div>
                            <input
                                name={item.maxPrice}
                                value={valueMaxPrice}
                                onFocus={() => setValueFilterPrice()}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setValueMaxPrice(Number(value));
                                    setEvent("priceRight");
                                }}
                                onBlur={() => {
                                    setValueFilterPrice();
                                }}
                                className="input range_input"
                                placeholder={item.maxPrice} />
                        </div>);
            }
        });

        if (type === "or") {
            return (
                <div
                    style={{ overflowY: `${showScroll}`, height: "140px", position: "relative" }}>
                    {result}
                </div>
            )
        }
        return result
    }

    const renderSlider = (arr, type) => {
        if (type === "and") {
            return (
                <div className="slider-line">
                    <div className="left-line" style={{ width: `${leftActive}px` }}></div>
                    <div className="center-line"></div>
                    <div className="right-line" style={{ width: `${-rightActive + sliderWidth}px` }}></div>
                    <button
                        onMouseDown={() => {
                            setClickLeftActive(true);
                            setEvent("moveLeft");
                        }}
                        style={{ left: `${leftActive}px` }}
                        className="slider-btn-left">
                        <div className="slider-btn-circle"></div>
                    </button>
                    <button
                        onMouseDown={() => {
                            (userPrice && userPrice[0] < valueMinPrice && userPrice[1] < valueMinPrice) ? setClickRightActive(false) : setClickRightActive(true);
                            setEvent("moveRight")
                        }}
                        style={{ left: `${rightActive}px` }}
                        className="slider-btn-right">
                        <div className="slider-btn-circle"></div>
                    </button>
                </div>
            );
        }
        if (type === "or" && arr.length === 5) {
            return (
                <button
                    onClick={() => {
                        getFilters(0, "", null, [valueMinPrice, valueMaxPrice]);
                        setShowScroll("scroll");
                        showScroll === "scroll" ? setQuantityFilter(5) : setQuantityFilter(0);
                    }}
                >
                    <span>show more...</span>
                </button>
            )
        }
        return null;
    }

    const renderInput = () => {
        return (
            <div className="filter-find__input">
                <input
                    onChange={(e) => {
                        const type = refType.current.getAttribute("type");
                        getFilters(0, e.target.value, type);
                    }}
                    className="input" />
                <div
                    onClick={() => {
                        getFilters(5, "", null, [valueMinPrice, valueMaxPrice]);
                        setShowScroll("hidden");
                    }}
                    className="btn-find">
                    <span>x</span>
                </div>
            </div>
        )
    }

    const filteres = renderFilters(options, type);
    const slider = renderSlider(options, type);
    const input = showScroll === "scroll" ? renderInput() : null;

    return (
        <div className="filter-container"
            ref={refType}
            type={id}
            key={id}>
            <h1 style={{ backgroundColor: "#ccc" }}>{name}</h1>
            {input}
            {filteres}
            {slider}
        </div>
    )
}

export default FiltersCatalog;