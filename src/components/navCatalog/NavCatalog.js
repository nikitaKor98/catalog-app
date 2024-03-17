import { Link } from "react-router-dom";

import "./navCatalog.css";

const NavCatalog = ({ activ, setActivNavigation }) => {
    return (
        <>
            <div
                onClick={() => {
                    setActivNavigation(false);
                    document.body.style.overflow = null;
                }}
                className="backdrop"></div>
            <div style={{ position: "absolute", top: "90px", zIndex: "1001", backgroundColor: "#fff" }}>
                <h1 onClick={() => {
                    setActivNavigation(!activ);
                    document.body.style.overflow = null;
                }}>
                    <Link to="/catalog">
                        <span>ALL</span>
                    </Link>
                </h1>
            </div>
        </>
    )
}

export default NavCatalog;