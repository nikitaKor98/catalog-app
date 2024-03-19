import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "../header/Header";
import Home from "../home/Home";
import Footer from "../footer/Footer";
import Modal from "../modals/Modal";
import Catalog from "../mainCatalog/Catalog";
import NavCatalog from "../navCatalog/NavCatalog";
import Product from "../product/Product";
import SignUpForm from "../forms/SignUpForm";
import SignInForm from "../forms/SignInForm";
import { GlobalModalsProvider, MODAL_TYPES } from "../../common/GlobalModalsProvider";

const App = () => {

    const [activNavigation, setActivNavigation] = useState(false);

    return (
        <BrowserRouter>
            <GlobalModalsProvider>
                <Header
                    setActivNavigation={setActivNavigation}
                    activNavigation={activNavigation}
                />
                <Modal type={MODAL_TYPES.SIGNUP} renderForm={(props) => <SignUpForm {...props} />} />
                <Modal type={MODAL_TYPES.SIGNIN} renderForm={(props) => <SignInForm {...props} />} />
            </GlobalModalsProvider>
            {activNavigation && < NavCatalog
                activ={activNavigation}
                setActivNavigation={setActivNavigation} />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:id" element={<Product />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    )
}

export default App;
