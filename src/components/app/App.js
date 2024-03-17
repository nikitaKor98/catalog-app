import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "../header/Header";
import Home from "../home/Home";
import Footer from "../footer/Footer";
import Modals from "../modals/Modals";
import Catalog from "../mainCatalog/Catalog";
import NavCatalog from "../navCatalog/NavCatalog";
import Product from "../product/Product";

import *as dataReg from "../../config/registrationFields.json";

const App = () => {

    const [activModal, setActivModal] = useState(false);
    const [activNavigation, setActivNavigation] = useState(false);
    const [valueModal, setValueModal] = useState(null);

    const getField = (num) => {
        let string = "";
        if (num.length > 1) {
            num.forEach(item => {
                string += dataReg.default[num[item]].fields[0];
                item === 0 ? string += " or " : string += "";
            });
        } else {
            string = dataReg.default[num[0]].fields[0];
        }
        string = string[0].toUpperCase() + string.slice(1);

        return string;
    }

    const showHiddenModal = (type, num) => {

        switch (type) {
            case "LOG":
                setActivModal(true);
                setValueModal({
                    type,
                    name: "Login to your account",
                    info: getField(num),
                    action: "Create an account"
                });
                break;
            case "SING":

                setActivModal(true);
                setValueModal({
                    type,
                    name: "Create an account",
                    info: getField(num),
                    action: "Already have an account"
                });
                break;
            case "CLOSE":
                setActivModal(false);
                setValueModal(null);
        }
    }

    return (
        <BrowserRouter>
            {activModal && <Modals
                valueModal={valueModal}
                showHiddenModal={showHiddenModal} />}
            <Header
                showHiddenModal={showHiddenModal}
                setActivNavigation={setActivNavigation}
                activNavigation={activNavigation}
            />
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
