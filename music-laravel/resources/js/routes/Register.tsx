import React from 'react';
import { ArrowSmallLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react"
import { redirect, useNavigate } from 'react-router-dom';
import { AuthUser, UserContext } from '../what/login';

export default function RegisterPage() {
    const navigate = useNavigate();
    const {http, setToken} = AuthUser();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();

    const [password, setPassword] = useState({ value: "" });
    const [confirmPwd, setConfirmPwd] = useState({ value: "" });


    var [errors, setErrors] = useState({ });
    errors = errors || {};

    // TODO: is this even necessary
    const pwdInput = React.useRef(null)

    const isPwdOk = () => {
        var ok = true;

        if (document.activeElement == pwdInput.current) {
            errors["password"] = null;
        }

        if (password.length < 8 && password.length > 0) {
            errors["password"] = "Password too short."
            ok = false;
        }

        if (confirmPwd != password && confirmPwd.length >= password.length) {
            errors["confirm"] = "Passwords don't match.";
            ok = false;
        } else {
            errors["confirm"] = null;
        }

        return ok;
    }

    const validate = () => {
        var ok = isPwdOk();
        if (!email) {
            errors["email"] = "The email field is required.";
            ok = false;
        }
    
        if (!username) {
            errors["username"] = "The username field is required.";
            ok = false;
        }

        // this is fucking stupid
        setErrors({...errors});

        return ok;
    }

    isPwdOk();

    const submitForm = (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        http.post('/api/register', { username:username, email:email, password:password })
        .then((res)=>{
            console.log("successful register =>", res);
            if (res.data["token"]) {
                setToken(res.data["user"], res.data["token"]);
                navigate("/");
            }
        }, (err)=>{
            console.log("error", err);

            if(err.response) {
                if (err.response.data.errors) {
                    err.response.data.errors.eels = true;
                    setErrors(err.response.data.errors);
                }
            }
        })
    }

    const renderError = (field) => {
        return (<>{
            errors[field] ? (<>
                <div className="mb-2 flex text-left">
                    <span className="text-red-700 text-sm leading-tight whitespace-pre-line">
                        { errors[field] } 
                    </span>
                </div>
            </>) : null
        }</>)
    }

  return ( <>
    <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
  
            </a>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <div className="text-center">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create an account
                        </h1>
                    </div>

                    <form className="" action="#">
                        <div className="flex h-10 mb-2">
                            <span className="musTextFieldIconHolder">
                            @
                            </span>
                            <input type="text"
                            id="login"
                            onChange={ e => setUsername(e.target.value) }
                            className="musTextFieldEntry"
                            pattern="[a-zA-Z0-9_]+"
                            placeholder="Username"/>
                        </div>

                        { renderError("username") }

                        <div className="flex h-10 mb-2">
                            <span className="musTextFieldIconHolder">
                                <svg fill="currentColor" className="musTextFieldIcon" viewBox="0 0 8 6" ><path d="m0 0h8v6h-8zm.75 .75v4.5h6.5v-4.5zM0 0l4 3 4-3v1l-4 3-4-3z"/></svg>
                            </span>
                            <input type="email"
                            id="email"
                            onChange={ e => setEmail(e.target.value) }
                            className="musTextFieldEntry"
                            placeholder="E-mail"/>
                        </div>
                        { renderError("email") }

                        <div className="flex h-10 mb-2">
                            <span className="musTextFieldIconHolder">
                                <svg fill="currentColor" className="musTextFieldIcon" viewBox="0 0 24 24"><path d="M10 16c0-1.104.896-2 2-2s2 .896 2 2c0 .738-.404 1.376-1 1.723v2.277h-2v-2.277c-.596-.347-1-.985-1-1.723zm11-6v14h-18v-14h3v-4c0-3.313 2.687-6 6-6s6 2.687 6 6v4h3zm-13 0h8v-4c0-2.206-1.795-4-4-4s-4 1.794-4 4v4zm11 2h-14v10h14v-10z"/></svg>
                            </span>

                            <input type="password"
                            id="pwd"
                            ref={pwdInput}
                            onChange={ e => setPassword(e.target.value) }
                            className="musTextFieldEntry"
                            autoComplete="new-password"
                            placeholder="Password"/>
                        </div>
                        { renderError("password") }

                        <div className="flex h-10 mb-2">
                            <span className="musTextFieldIconHolder">
                                **
                            </span>

                            <input type="password"
                            id="confpwd"
                            onChange={ e => setConfirmPwd(e.target.value) }
                            className="musTextFieldEntry"
                            placeholder="Confirm Password"/>
                        </div>
                        { renderError("confirm") }

                        <div className="space-y-4 mt-8">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                                </div>
                                <div className="ml-3 text-sm">
                                <label className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                                </div>
                            </div>
                            <button
                            type="submit"
                            onClick={submitForm}
                            className="musBtnElevated w-full text-sm px-5 py-2.5">
                                Create an account
                            </button>
                            <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
    </> )
}