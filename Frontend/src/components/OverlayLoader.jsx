import {useEffect, useRef} from "react";

function OverlayLoader(props) {
    const ref = useRef(null);
    const frameRef = useRef(null);

    useEffect(() => {
        console.log(props.show)
        if (props.show) {
            ref.current.style.display = "flex";
            setTimeout(() => {
                frameRef.current.style.scale = "1";
                frameRef.current.style.opacity = "1";
            }, 10)
        } else {
            frameRef.current.style.scale = "1.4";
            frameRef.current.style.opacity = "0";

            setTimeout(() => {
                ref.current.style.display = "none";
            }, 300)
        }
    }, [props.show])

    return <div ref={ref} className="overlay-loader-wrapper" style={{display: "none"}}>
        <div ref={frameRef} className="overlay-loader"></div>
    </div>
}

export default OverlayLoader;