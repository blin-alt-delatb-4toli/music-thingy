import { Menu } from "@headlessui/react";
import { useState, useContext } from "react"
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../what/login';

export function AuthForms() {
    const navigate = useNavigate();
    const { userActions } = useContext(UserContext);
    const {http, saveUser} = userActions;

    const [login, setLogin] = useState();
    const [password, setPassword] = useState();
    const [errors, setErrors] = useState();
    
    const submitForm = () =>{
        // api call
        http.post('/api/login', {login:login, password:password})
        .then((res)=>{
            console.log("successful login =>", res);
            if (res.data["token"]) {
                saveUser(res.data["user"], res.data["token"]);
                navigate("/");
            }
        }, (err)=>{
            if(err.response) {
                if (err.response.data.errors) {
                    setErrors(err.response.data.errors);
                }
            }
        })
    }

    const renderError = (field) => {
        return (<>{
            (errors && errors[field]) ? (<>
                <div className="flex text-left">
                    <span className="text-red-700 text-sm leading-tight">
                        { errors[field] } 
                    </span>
                </div>
            </>) : null
        }</>)
    }

    return(
        <div className="px-2 text-center" key="auth" as="auth">
            <div className="flex h-8">
                <span className="flex items-center justify-center text-lg w-8 font-bold text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                @
                </span>
                <input type="text"
                id="login"
                onChange={ e => setLogin(e.target.value) }
                className="musTextFieldEntry"
                placeholder="Username or email"/>
            </div>

            { renderError("login") }

            <div className="flex h-8 mt-2">
                <span className="musTextFieldIconHolder">
                    <svg fill="currentColor" className="musTextFieldIcon px-0" viewBox="0 0 24 24"><path d="M10 16c0-1.104.896-2 2-2s2 .896 2 2c0 .738-.404 1.376-1 1.723v2.277h-2v-2.277c-.596-.347-1-.985-1-1.723zm11-6v14h-18v-14h3v-4c0-3.313 2.687-6 6-6s6 2.687 6 6v4h3zm-13 0h8v-4c0-2.206-1.795-4-4-4s-4 1.794-4 4v4zm11 2h-14v10h14v-10z"/></svg>
                </span>

                <input type="password"
                id="pwd"
                onChange={ e => setPassword(e.target.value) }
                className="musTextFieldEntry"
                autoComplete="current-password"
                placeholder="Password"/>
            </div>
            
            { renderError("password") }
            

            <button onClick={submitForm}
            className="musBtnElevated h-8 w-full mt-4 mb-1">
                Login
            </button>
        
            <a href="/register"
            className="link">
                Don't have an account?
            </a>
        </div>
    )
}