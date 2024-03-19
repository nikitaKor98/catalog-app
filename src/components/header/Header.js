import { useState } from "react";
import { NavLink } from "react-router-dom";

import Dropdown from "../dropdown/Dropdown";
import { useGlobalModals, MODAL_TYPES } from "../../common/GlobalModalsProvider";

import { Fetch } from "../fetch/Fetch";

import "./header.css"

const Header = ({ setActivNavigation, activNavigation }) => {

    const [showHiddenDropdown, setShowHiddenDropdown] = useState(false);
    const [product, setProduct] = useState([]);
    const [title, setTitle] = useState("");

    const { request } = Fetch();

    const { open } = useGlobalModals();

    const debounceInput = (fn, time) => {
        let timeoutId;

        return function (event) {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                fn(event.target.value);
            }, time);
        }
    }

    const getListProducts = (e) => {

        setShowHiddenDropdown(true);

        request("http://localhost:3001/goods", "POST", JSON.stringify({
            pageSize: 5,
            pageNumber: 1,
            title: e
        })).then(data => {
            setProduct(data.data);
            setTitle(e);
        });
    }

    const dropdown = showHiddenDropdown ? <Dropdown product={product} title={title} /> : null;

    return (
        <div
            onClick={() => {
                setActivNavigation(false);
                document.body.style.overflow = null;
            }}
            className="header">
            <h1 className="header-logo">
                <NavLink
                    style={{ textDecoration: "none", color: "inherit", backgroundColor: "white" }}
                    to="/">
                    <span>Name catalog</span>
                </NavLink>
            </h1>
            <div className="header-nav">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setActivNavigation(!activNavigation);
                        document.body.style.overflow = !activNavigation ? "hidden" : null;
                    }}
                    className="btn">Catalog</button>
            </div>
            <div className="header-find">
                <div className="header-find__input">
                    <input
                        onFocus={(e) => getListProducts(e.target.value)}
                        onChange={debounceInput(getListProducts, 500)}
                        onBlur={() => setTimeout(() => setShowHiddenDropdown(false), 250)}
                        className="input" placeholder="find" />
                    <NavLink
                        style={{ textDecoration: "none", color: "inherit", backgroundColor: "white" }}
                        to={`/catalog/?title=${title}`}>
                        <div className="btn-find">
                            <span style={{ margin: "4px" }}>Find</span>
                        </div>
                    </NavLink>
                </div>
                <div className="header-dropdown">
                    {dropdown}
                </div>
            </div>
            <div className="header-log">
                <button
                    onClick={() => open(MODAL_TYPES.SIGNIN)}
                    className="btn">log in</button>
                <button
                    onClick={() => open(MODAL_TYPES.SIGNUP)}
                    className="btn">sign up</button>
            </div>
        </div>
    )
}

export default Header;