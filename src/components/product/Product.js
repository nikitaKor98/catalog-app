import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Fetch } from "../fetch/Fetch";

const Product = () => {

    const [productData, setProductData] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        getProductID(id);
    }, [id]);

    const { request } = Fetch();

    const getProductID = (id) => {
        request("http://localhost:3001/goods", "POST", JSON.stringify({
            pageSize: 1,
            pageNumber: 1,
            id
        })).then(data => setProductData(...data.data));
    }

    const { title, description, img_url, price } = productData;

    return (
        <div>
            <img src={img_url}></img>
            <h1>{title}</h1>
            <h2>{description}</h2>
            <h2>price {price}</h2>
        </div>
    )
}

export default Product;