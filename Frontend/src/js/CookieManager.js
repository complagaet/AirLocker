import Cookies from "js-cookie";

const cookieName = "AirLocker";

export const getCookie = () => {
    return Cookies.get(cookieName) || null;
};

export const setCookie = (value) => {
    Cookies.set(cookieName, value, { path: "/", expires: 1 / 24 }); // 1 час = 1/24 дня
};

export const removeCookie = () => {
    Cookies.remove(cookieName, { path: "/" });
};
