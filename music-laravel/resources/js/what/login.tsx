import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

class User {
    _username: string;
    _userid: string;
    _avatarURL: string = "https://i.imgur.com/flZWEsb.png";

    constructor(userid: string, name: string) {
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
}

export default function AuthUser() {
    const navigate = useNavigate();

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
        var user = new User(user_detail["username"], user_detail["username"]);
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

    const logout = () => {
        sessionStorage.clear();
        setUser(null);
        setToken(null);
    }

    const http = axios.create({
        // baseURL: "balls.itch/api",
        headers: {
            "Content-type" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
    return {
        setToken:saveToken,
        token,
        user,
        getToken,
        http,
        logout
    }
}