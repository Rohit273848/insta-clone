import React from 'react'
import '../style/form.scss'
import { Link } from 'react-router'
import { useState } from 'react'
import axios from 'axios'

const Login = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleformSubmit(e) {
    e.preventDefault()

    axios.post("http://localhost:3000/api/auth/login", {
      username,
      password
    }, {
      withCredentials: true,
    })
      .then(res => {

        setUsername('');
        setPassword("");
        console.log("loging Successfuly");
      })

  }

  return (
<main className="auth-page">
      <div className="auth-split">

        {/* LEFT — Glass card (existing structure unchanged) */}
        <div className="auth-panel--left">
          <div className="form-container">
            <h1>Welcome Back 👋</h1>
            <p className="auth-subtext">Good to see you again. Sign in below.</p>
            <form onSubmit={handleformSubmit} >
            <input onInput={(e)=>{setUsername(e.target.value)}} type="text" value={username} name="username" placeholder="Enter Username" />
              
            <input onInput={(e)=>{setPassword(e.target.value)}} type="password" value={password} name="password" placeholder="Password" />
              <button type="submit">Sign In</button>
            </form>
            <p>Don't have an account? <Link className="toggleAuthForm" to="/register">Register</Link></p>
          </div>
        </div>

        {/* RIGHT — Gradient cosmos panel */}
        <div className="auth-panel--right">
          <div className="orb-3" />
          <div className="orb-4" />
          <div className="right-grain" />
          <div className="right-content">
            <div className="right-badge">New — v2.0 is live</div>
            <h2>Connect. Create.<br /><span>Inspire.</span></h2>
            <p>Join millions sharing their world — every moment, beautifully told.</p>
            <div className="right-pills">
              <span className="pill pill--accent">✦ Free forever</span>
              <span className="pill">10M+ users</span>
              <span className="pill">No ads</span>
            </div>
          </div>
        </div>

      </div>
    </main>









  )
}

export default Login
