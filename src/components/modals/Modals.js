import { useState } from "react";

import "./modals.css"

const Modals = (props) => {

    const { type, name, info, action } = props.valueModal;

    const [activ, setActiv] = useState(0);
    const [size, setSize] = useState(25);

    return (
        <>
            <div
                onClick={() => props.showHiddenModal("CLOSE")}
                className="modal-fon"></div>
            <div className="modal-container">
                <div className="modal-form">
                    <h1>{name}</h1>
                    <div className="modalInput-containet">
                        <span className="modal-span" style={{ transform: `translateY(-${activ}%)`, "fontSize": `${size}px` }}>{info}</span>
                        <input
                            onClick={() => {
                                setActiv(50);
                                setSize(15);
                            }}
                            onBlur={(e) => {
                                if (!e.target.value) {
                                    setActiv(0);
                                    setSize(25);
                                }
                            }}
                            className="modal-input" style={{ transform: `translateY(${activ}%)` }} />
                    </div>
                    <div className="modalBtn-container">
                        {info === "Password" || info === "Phone" ? <button
                            className="modalBtn"
                            onClick={() => {
                                if (type === "SING" && info === "Password") {
                                    props.showHiddenModal(type, [1]);
                                } else if (type === "SING") {
                                    props.showHiddenModal(type, [0]);
                                } else if (type === "LOG") {
                                    props.showHiddenModal(type, [0, 1]);
                                }
                            }}
                        >BACK</button> : null}
                        <button
                            onClick={() => {
                                if (type === "SING" && info === "Email") {
                                    props.showHiddenModal(type, [1]);
                                } else {
                                    props.showHiddenModal(type, [2]);
                                }
                            }}
                            className="modalBtn">NEXT</button>
                    </div>
                    <button
                        onClick={() => {
                            console.log(type)
                            if (type === "SING") props.showHiddenModal("LOG", [0, 1]);
                            if (type === "LOG") props.showHiddenModal("SING", [0]);
                        }}
                        className="modalBtn">{action}</button>
                </div>
            </div>
        </>
    );
}

export default Modals;