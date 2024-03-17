import { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";

import "./content.css"

const Content = ({ id, name, description, img, setWidthCard, setHeightSlide }) => {

    const widthCardRef = useRef();

    useEffect(() => {
        if (setWidthCard) {
            setWidthCard(widthCardRef.current.getBoundingClientRect().width);
            setHeightSlide(widthCardRef.current.getBoundingClientRect().height);
        }
    }, []);

    return (
        <div
            ref={widthCardRef}
            className="conteiner">
            <NavLink
                style={{ textDecoration: "none", color: "inherit" }}
                to={`/product/${id}`}>
                <div key={id} className="conteiner-elem">
                    <h1 title={name} className="conteiner-elem__name">{name}</h1>
                    <img src={img} alt="" style={{ width: "300px", height: "180px" }} />
                    <h2 title={description} className="conteiner-elem__description">{description}</h2>
                </div>
            </NavLink>
        </div>
    )
}

export default Content;