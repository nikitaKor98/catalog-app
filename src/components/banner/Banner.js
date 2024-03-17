import "./banner.css";

const Banner = ({ img, id, width, height }) => {
    return (
        <div
            key={id}
            className="banner">
            <a
                className="img" href="#">
                <h1 style={{ position: "absolute", display: "flex" }}>our partner</h1>
                <img
                    style={{ width: `${width}px`, height: `${height}px` }}
                    src={img}
                    alt="" />
            </a>
        </div>
    )
}

export default Banner;