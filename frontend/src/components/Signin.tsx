import React, { useState } from "react";

export default function Signin({onSignin, onSwitchToSignup}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(){
        const res = await fetch("http://13.51.207.94:3000/signin", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({ 
                email,
                password
            }),
        });

        const data = await res.json();

        if(data.success){
            localStorage.setItem("token",data.data);
            window.location.reload();
            onSignin();
        }
    }

    return(
        <div>
            <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            >
            </input>

            <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            >
            </input>

            <button
                onClick={handleSubmit}
            >
                Signin
            </button>

            <p>
                Don't have an account? <button onClick={onSwitchToSignup}>Sign up</button>
            </p>

        </div>
    )
}