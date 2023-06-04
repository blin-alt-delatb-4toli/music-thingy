import axios from 'axios';
import { useState, createContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext({
    user: null,
    userActions: null,
});

export class User {
    _username: string;
    _userid: string;
    _id: number;
    _avatarURL: string = "https://i.imgur.com/flZWEsb.png";
    _token: string | undefined;

    constructor(id: number, userid: string, name: string, token: string) {
        this._userid = userid;
        this._id = id;
        this._username = name;
        this._token = token;
    }

    get userid(): string {
        return this._userid;
    }

    get name(): string {
        return this._username;
    }

    set name(value: string) {
        this._username = value;
    }

    get avatar(): string {
        return this._avatarURL;
    }

    set avatar(value: string) {
        this._avatarURL = value;
    }

    get token() : string | undefined {
        return this._token;
    }

    get id() : number {
        return this._id;
    }
}

export function UserState() {
    const getUser = () =>{
        const userString = sessionStorage.getItem('user');
        if (!userString) {
            return null;
        }

        const userData = JSON.parse(userString);
        var user = new User(userData["id"], userData["username"], userData["username"], userData["token"]);

        return user;
    }

    const [user, setUser] = useState(getUser());

    const saveUser = (user, token) => {
        console.assert(typeof token == "string");

        user["token"] = token;
        sessionStorage.setItem('user', JSON.stringify(user));

        setUser(getUser());
    }

    const http = axios.create({
        // baseURL: "balls.itch/api",
        withCredentials: true,
        headers: {
            "Content-type" : "application/json",
            "Accept": "application/json",
            "Authorization" : `Bearer ${user ? user.token : ''}`
        }
    });

    const logout = () => {
        sessionStorage.clear();
        setUser(null);
    }

    const reqLogout = () => {
        http.post('/api/logout', {})
            .then((res)=>{
                console.log("successful logout =>", res);
                logout();
            }, (err)=>{
                console.log("error while logging out!?", err);
            })
    }
    
    // this will run, like, once, probably
    // good to validate session
    useEffect(() => {
        if (!user) return;

        http.get("/api/check", {})
            .then((res) => {
                console.log("Confirmed session valid");
            }, (err) => {
                var resp = err.response;
                if (resp && resp.status == 401) {
                    logout();
                }
            })
    }, []);

    return {
        saveUser,
        user,
        http,
        logout,
        reqLogout
    }
}