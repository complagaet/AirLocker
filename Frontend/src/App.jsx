import {useEffect, useMemo, useRef, useState} from 'react'
import { useAuth } from './js/AuthContext'

import Header from './components/Header'
import AuthScreen from './components/AuthScreen'
import Lockers from './components/Lockers'
import OverlayLoader from "./components/OverlayLoader.jsx";
import bobatron from "./js/Bobatron";

import './css/style.css'

import ChangeScreen from "./js/ChangeScreen.js";

window.addEventListener("resize", () => {
    bobatron.scanner()
})

function App() {
    const [location, setLocation] = useState("Loading");

    const {user, loading, token, overlayLoader, setOverlayLoader} = useAuth();

    const ref = useRef(null)
    const changeScreen = useMemo(() => new ChangeScreen(ref, setLocation), []);

    useEffect( () => {
        console.log("APP")
        bobatron.scanner()

        if (!loading) {
            if (token) {
                changeScreen.set("App")
            } else {
                changeScreen.set("AuthScreen")
            }
        }
    }, [loading, token]);

    return (
        <>
            <OverlayLoader show={overlayLoader}/>
            <Header />
            <div ref={ref} className={location !== "App" ? "center-container" : ""}>
                {location === "Loading" && <h1>Loading</h1>}
                {location === "AuthScreen" && <AuthScreen globalChangeScreen={changeScreen} />}
                {location === "App" && <Lockers />}
            </div>
        </>
    )
}

export default App
