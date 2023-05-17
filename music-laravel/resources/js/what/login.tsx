import axios from 'axios';
import { useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext({
    user: null,
    userActions: null,
});

class User {
    _username: string;
    _userid: string;
    _avatarURL: string = "https://i.imgur.com/flZWEsb.png";
    _token: string | undefined;

    constructor(userid: string, name: string, token: string) {
        this._userid = userid;
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
}

export function UserState() {
    const getUser = () =>{
        const userString = sessionStorage.getItem('user');
        if (!userString) {
            return null;
        }

        const userData = JSON.parse(userString);
        var user = new User(userData["username"], userData["username"], userData["token"]);

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
        headers: {
            "Content-type" : "application/json",
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
    
    return {
        saveUser,
        user,
        http,
        logout,
        reqLogout
    }
}