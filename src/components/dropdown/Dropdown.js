import { Link, NavLink } from "react-router-dom";
import "./dropdown.css"

const Dropdown = ({ product, title }) => {

    const renderDropdown = (arr) => {
        if (!title) return null;

        if (arr.length) {
            return arr.map(item => {
                const { id, title, img_url } = item;
                return (
                    <div
                        key={id}
                        className="dropdown-item">
                        <NavLink
                            to={`/product/${id}`}
                            style={{ display: "flex", alignItems: "center", color: "inherit", textDecoration: "none" }}>
                            <img src={img_url} style={{ width: "60px", height: "40px", marginLeft: "2px", borderRadius: "5px" }} />
                            <h2 className="dropdown-item__name" style={{ margin: "0", marginLeft: "5px" }}>{title}</h2>
                        </NavLink>
                    </div>
                );
            });
        }

        return (
            <div className="dropdown-item not-found">
                <h2 style={{ margin: "0" }}>Could not be found</h2>
            </div>
        );
    }

    const showProduct = renderDropdown(product);

    return (
        <div className="dropdown">
            {showProduct}
        </div>
    )
}

export default Dropdown;