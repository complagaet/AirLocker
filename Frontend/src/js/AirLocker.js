import axios from 'axios';
import {getCookie, removeCookie, setCookie} from "./CookieManager.js";

class AirLocker {
    user = null
    lockers
    loggedIn = false
    token = null

    constructor() {
        const cookie = getCookie()

        if (cookie) {
            //removeCookie()
            console.log(cookie)
            this.token = cookie
        } else {
            console.log("Cookie not found")
        }
    }

    logout() {
        console.log("Logout")
        removeCookie()
        this.loggedIn = false
        this.token = null
        this.user = {}
    }

    async login(email, password) {
        return await axios.post(`/api/login`, {
            email: email,
            password: password
        })
            .then(response => {
                console.log(response.data)
                this.token = response.data.token;
                setCookie(response.data.token);
                return true
            })
            .catch(error => {
                console.error('POST error:', error);
                return false
            });
    }

    async register(email, password, username) {
        return await axios.post(`/api/register`, {
            email: email,
            password: password,
            username: username
        })
            .then(response => {
                return true
            })
            .catch(error => {
                console.error('POST error:', error);
                return false
            });
    }

    async getUser() {
        return await axios.get('/api/user', {
            headers: {
                Authorization: `${this.token}`
            }
        })
            .then(response => {
                this.loggedIn = true
                this.user = response.data
                return true
            })
            .catch(error => {
                console.error('GET error:', error);
                return false
            });
    }

    async updateLocker(id, lockerName, isLocked) {
        try {
            const response = await axios.put(`/api/locker/${id}`, {
                lockerName,
                isLocked
            }, {
                headers: {
                    Authorization: `${this.token}`
                }
            });

            this.user = {
                ...this.user,
                lockers: this.user.lockers.map(l =>
                    l._id === id
                        ? {...l, ...response.data}
                        : l
                )
            };

            console.log('Locker updated:', response.data)
            return true;
        } catch (error) {
            console.error('PUT error:', error);
            return false;
        }
    }

    async removeLocker(id) {
        try {
            const response = await axios.delete(`/api/locker/${id}`, {
                headers: {
                    Authorization: `${this.token}`
                }
            });

            this.user = {
                ...this.user,
                lockers: this.user.lockers.filter(l => l._id !== id)
            };

            console.log('Locker removed:', response.data);
            return true;
        } catch (error) {
            console.error('DELETE error:', error);
            return false;
        }
    }


}

export default AirLocker;