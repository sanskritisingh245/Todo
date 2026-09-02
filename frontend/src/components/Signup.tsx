import React, { useState } from "react";

export default function Signup({onSignup, onSwitchToSignin}){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(){
        const res = await fetch("http://localhost:3000/signup", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({username, email, password}),
        });

        const data = await res.json();

        if(data.success){
            onSignup();
        } else {
            setError(data.error ?? "Something went wrong");
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
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
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
                Signup
            </button>

            {error && <p>{error}</p>}

            <p>
                Already have an account? <button onClick={onSwitchToSignin}>Sign in</button>
            </p>

        </div>
    )
}