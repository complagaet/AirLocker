import {useState, useRef, useEffect, useMemo} from 'react'
import Button from './Button'

import bobatron from "../js/Bobatron.js";

import { HiXCircle, HiInformationCircle } from "react-icons/hi";
import ChangeScreen from "../js/ChangeScreen.js";

import {useAuth} from "../js/AuthContext.jsx";

function WindowHeader(props) {
    return <div className="flex justify-between">
        <h1>{props.title}</h1>
        <HiXCircle className="icon-button" onClick={props.onClick} />
    </div>
}

function Error(props) {
    return <div style={props.style} className="form-error bobatron">
        <div className="leading-5">{props.children}</div>
    </div>
}

function Signup(props) {
    const {register, login, getUser, setLoading} = useAuth();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({ common: "", email: "", username: "", password: "" });

    useEffect(() => {
        bobatron.scanner()
    }, [errors]);

    const checkAndRegister = async () => {
        let errs = { common: "", email: "", username: "", password: "" };
        let passed = true;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errs.email = "Invalid Email";
            passed = false;
        }

        if (username.trim().length < 3) {
            errs.username = "Username is too short";
            passed = false;
        }

        if (password.length < 6) {
            errs.password = "Password must be at least 6 characters";
            passed = false;
        }

        if (passed) {
            setLoading(true)
            props.globalChangeScreen.hide();
            let status = await register(email, password, username);
            if (status) {
                await login(email, password);
                await getUser();
                props.globalChangeScreen.set("App");
            } else {
                props.globalChangeScreen.show();
                errs.common = "Registration Failed";
            }
            setLoading(false)
        } else {
            props.changeScreen.set("signup");
        }

        setTimeout(() => {
            setErrors(errs);
        }, 300);
    }

    return <>
        {errors.common && (
            <Error style={{padding: "10px"}}>
                <div className="flex items-center" style={{gap: "5px"}}>
                    <HiInformationCircle className="icon-button" />
                    <span>{errors.common}</span>
                </div>
                <br></br>
                Try another email or username
            </Error>
        )}
        <input className="bobatron" placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <Error>{errors.email}</Error>}
        <input className="bobatron" placeholder="Username" type="text" onChange={(e) => setUsername(e.target.value)} />
        {errors.username && <Error>{errors.username}</Error>}
        <input className="bobatron" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
        {errors.password && <Error>{errors.password}</Error>}
        <Button children="Register" onClick={checkAndRegister} />
    </>
}


function Login(props) {
    const {user, loading, token, login, getUser, setLoading, register} = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({email: "", password: ""});

    useEffect(() => {
        bobatron.scanner()
    }, [errors])

    const checkAndGo = async () => {
        let errs = {common: "", email: "", password: ""};
        let passed = true;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errs.email = "Invalid Email"
            passed = false;
        }

        if (password.length < 1) {
            errs.password = "Password is too short";
            passed = false;
        }

        if (passed) {
            setLoading(true)
            props.globalChangeScreen.hide()
            let status = await login(email, password)
            if (status) {
                await getUser()
                props.globalChangeScreen.set("App")
            } else {
                props.globalChangeScreen.show()
                errs.common = "Login Failed";
            }
            setLoading(false)
        } else {
            props.changeScreen.set("login")
        }

        setTimeout(() => {
            setErrors(errs)
        }, 300)
    }

    return <>
        {errors.common && (
            <Error style={{padding: "10px"}}>
                <div className="flex items-center" style={{gap: "5px"}}>
                    <HiInformationCircle className="icon-button" />
                    <span>{errors.common}</span>
                </div>
                <br></br>
                Incorrect email or password
            </Error>
        )}
        <input className="bobatron" placeholder="Email" type="email" onChange={(e) => {setEmail(e.target.value)}}/>
        {errors.email && <Error>{errors.email}</Error>}
        <input className="bobatron" placeholder="Password" type="password" onChange={(e) => {setPassword(e.target.value)}}/>
        {errors.password && <Error>{errors.password}</Error>}
        <Button children="Login" onClick={() => {checkAndGo()}}/>
    </>
}

function AuthScreen(props) {
    const ref = useRef(null)

    const globalChangeScreen = props.globalChangeScreen

    const [location, setLocation] = useState("menu")

    const changeScreen = useMemo(() => new ChangeScreen(ref, setLocation), []);

    useEffect(() => {
        console.log(location)
        bobatron.scanner()
    }, [location]);

    return <div
        ref={ref}
        className="window bobatron"
        bt-color="#ffffff"
        style={{
            maxWidth: '400px',
            transitionDuration: '0.3s',
        }}
    >
        {location === "menu" && (
            <>
                <div
                    className="flex justify-center items-center bg-no-repeat bg-center"
                    style={{
                        width: "100%",
                        height: "250px",
                        backgroundImage: "url(/welcome_art.svg)"
                    }}
                >
                    <h1 className="text-4xl text-center semibold leading-11" style={{color: "#132e61"}}>Welcome to AirLocker!</h1>
                </div>
                <Button children="Login" onClick={() => changeScreen.set("login")} />
                <Button children="Sign Up!" onClick={() => changeScreen.set("signup")}/>
            </>
        )}

        {location === "login" && (
            <>
                <WindowHeader title="Login" onClick={() => changeScreen.set("menu")}/>
                <Login changeScreen={changeScreen} globalChangeScreen={globalChangeScreen} />
            </>
        )}

        {location === "signup" && (
            <>
                <WindowHeader title="Sign Up!" onClick={() => changeScreen.set("menu")}/>
                <Signup changeScreen={changeScreen} globalChangeScreen={globalChangeScreen} />
            </>
        )}
    </div>
}

export default AuthScreen