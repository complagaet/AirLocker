import {useAuth} from "../js/AuthContext.jsx";
import Button from "./Button.jsx";

import { HiOutlineLogout } from "react-icons/hi";

function Header(props) {
    const {user, logout, loading} = useAuth();

    const u = user || {}

    return <header>
        <div className="flex items-center" style={{gap: "10px"}}>
            <img className="header-icon" src="/favicon.svg"/>
            <h1 className="text-2xl">AirLocker</h1>
        </div>
        <div className="flex items-center" style={{gap: "10px", transitionDuration: "0.3s"}}>
            {loading && <h1>LOADING</h1>}
            {u.username}
            {u.email && <HiOutlineLogout className="icon-button" onClick={() => logout()}>logout</HiOutlineLogout>}
        </div>

    </header>
}

export default Header