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
    const getToken = () =>{
        const tokenString = sessionStorage.getItem('token') ?? '[]';
        const userToken = JSON.parse(tokenString);
        return userToken;
    }

    const getUser = () =>{
        const userString = sessionStorage.getItem('user');
        if (!userString) {
            return null;
        }

        const user_detail = JSON.parse(userString);
        var user = new User(user_detail["username"], user_detail["username"], user_detail["token"]);
        user.avatar = "??";

        return user;
    }

    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState(getUser());

    const saveToken = (user,token) =>{
        sessionStorage.setItem('token',JSON.stringify(token));
        sessionStorage.setItem('user',JSON.stringify(user));

        setToken(token);
        setUser(getUser());
    }

    const http = axios.create({
        // baseURL: "balls.itch/api",
        headers: {
            "Content-type" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });

    const logout = () => {
        sessionStorage.clear();
        setUser(null);
        setToken(null);
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
        setToken:saveToken,
        token,
        user,
        getToken,
        http,
        logout,
        reqLogout
    }
}