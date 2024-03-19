import { useState } from "react";

import { useGlobalModals, MODAL_TYPES } from "../../common/GlobalModalsProvider";

import *as dataReg from "../../config/registrationFields.json";

const mapFields = () => {
    return dataReg.default.map(item => ({ name: item[0].toUpperCase() + item.slice(1), value: "" }));
}

const SignUpForm = () => {

    const [activ, setActiv] = useState(0);
    const [size, setSize] = useState(25);
    const [fields, setFields] = useState(mapFields());
    const [step, setStep] = useState(0);

    const { open } = useGlobalModals();

    const renderStep = (field) => {
        return (
            <div className="modalInput-containet">
                <span className="modal-span" style={{ transform: `translateY(-${activ}%)`, "fontSize": `${size}px` }}>{field.name}</span>
                <input
                    value={field.value}
                    onChange={(e) => {
                        const tempFields = [...fields];
                        tempFields[step].value = e.target.value;
                        setFields(tempFields);
                    }}
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
        );
    }

    return (
        <div className="modal-form">
            <h1>Create an account</h1>
            {renderStep(fields[step])}
            <div className="modalBtn-container">
                {step !== 0 && <button
                    className="modalBtn"
                    onClick={() => setStep(step - 1)}
                >BACK</button>}
                {step !== fields.length - 1 ? <button
                    onClick={() => setStep(step + 1)}
                    className="modalBtn">NEXT</button> : <button
                        onClick={() => console.log(fields)}
                        className="modalBtn">SUBMIT</button>}
            </div>
            <button
                onClick={() => open(MODAL_TYPES.SIGNIN)}
                className="modalBtn">Already have an account</button>
        </div>
    );
}

export default SignUpForm;