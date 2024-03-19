import { useEffect } from "react";

import { useGlobalModals } from "../../common/GlobalModalsProvider";

import "./modals.css"

const Modal = ({ renderForm, type }) => {

    const { isOpen, close, activeModal } = useGlobalModals();

    useEffect(() => {
        if (activeModal !== null) document.body.style.overflow = "hidden";
        else document.body.style.overflow = null;
    }, [activeModal]);

    return (
        isOpen(type) && <>
            <div
                onClick={close}
                className="modal-fon"></div>
            <div className="modal-container">
                {renderForm()}
            </div>
        </>
    );
}

export default Modal;