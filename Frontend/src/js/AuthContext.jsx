import {createContext, useContext, useEffect, useRef, useState} from 'react';
import AirLocker from "./AirLocker.js";

const AuthContext = createContext()
const airLocker = new AirLocker();

export function AuthProvider({ children }) {
    const [user, setUser] = useState({})
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    const userPollingIntervalId = useRef(null);

    useEffect(() => {
        const checkToken = async () => {
            if (airLocker.token) {
                await getUser()
            }
            setLoading(false)
        }
        checkToken()

        return () => {
            if (userPollingIntervalId.current) {
                clearInterval(userPollingIntervalId.current);
            }
        };
    }, [])

    const getUser = async () => {
        const fetchUser = async () => {
            const status = await airLocker.getUser()
            if (status) {
                setUser(airLocker.user)
                setToken(airLocker.token)
            }
        }

        await fetchUser()
        if (userPollingIntervalId.current) {
            clearInterval(userPollingIntervalId.current);
        }
        userPollingIntervalId.current = setInterval(fetchUser, 5000);
    }

    const login = async (email, password) => {
        const result = await airLocker.login(email, password)
        if (result) {
            setUser(airLocker.user)
            setToken(result.token)
            return true
        }
        return false
    }

    const register = async (email, password, username) => {
        return await airLocker.register(email, password, username);

    }

    const logout = async () => {
        if (userPollingIntervalId.current) {
            clearInterval(userPollingIntervalId.current);
            userPollingIntervalId.current = null;
        }
        console.log("Logout (context)")
        airLocker.logout()
        setUser(airLocker.user)
        setToken(airLocker.token)
    }

    const updateLocker = async (id, lockerName, isLocked) => {
        await airLocker.updateLocker(id, lockerName, isLocked)
        setUser(airLocker.user)
    }

    const removeLocker = async (id) => {
        await airLocker.removeLocker(id)
        setUser(airLocker.user)
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, setLoading, login, getUser, logout, register, updateLocker, removeLocker }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)