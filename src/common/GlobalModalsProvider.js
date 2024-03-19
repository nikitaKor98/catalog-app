import { createContext, useContext, useState } from "react";

const MODAL_TYPES = {
    SIGNIN: "SIGNIN",
    SIGNUP: "SIGNUP",
}

const GlobalModalsContext = createContext({
    activeModal: null,
    isOpen: () => { },
    open: () => { },
    close: () => { },

});

const GlobalModalsProvider = ({ children }) => {
    const [activeModal, setActiveModal] = useState(null);
    const initialState = {
        activeModal,
        isOpen: (type) => type === activeModal,
        open: (type) => setActiveModal(type),
        close: () => setActiveModal(null)
    }

    return <GlobalModalsContext.Provider value={initialState}> {children} </GlobalModalsContext.Provider>
}

const useGlobalModals = () => useContext(GlobalModalsContext);

export { MODAL_TYPES, GlobalModalsProvider, useGlobalModals }