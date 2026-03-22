import React from 'react'
import {Link} from 'react-router'
import axios from 'axios'
import { useState } from 'react'

const Register = () => {

  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('')
  const [password,setPassword]=useState('')

  async function handleformSubmit(e){

    e.preventDefault()
    setUsername('');
    setPassword("");
    setEmail("");

    axios.post("http://localhost:3000/api/auth/register",{
      username,
      email,
      password
    },{
      withCredentials:true,
    })
    .then(res =>{
      console.log(res.data);
    })
  }




  return (

    <main className="auth-page">
    <div className="auth-split">

      <div className="auth-panel--left">
        <div className="form-container">
          <h1>Create Account</h1>
          <p className="auth-subtext">Join the community. It only takes a moment.</p>
          <form onSubmit={handleformSubmit}>
          <input 
              onInput={(e)=>{setUsername(e.target.value)}}
              type="text"
              name='username' 
              placeholder='Enter username'
              value={username} />

          <input 
              onInput={(e)=>{setEmail(e.target.value)}}
              type="text" 
              name="email" 
              placeholder='Enter email' 
              value={email}/>
  
          <input 
              onInput={(e)=>{setPassword(e.target.value)}}
              type="password" 
              name='password' 
              placeholder='Enter password' 
              value={password}/>
            <button type="submit">Create Account</button>
          </form>
          <p>Already have an account? <Link className="toggleAuthForm" to="/login">Login</Link></p>
        </div>
      </div>

      <div className="auth-panel--right">
        <div className="orb-3" />
        <div className="orb-4" />
        <div className="right-grain" />
        <div className="right-content">
          <div className="right-badge">Free — No credit card needed</div>
          <h2>Your story<br />starts <span>here.</span></h2>
          <p>Create, share, and discover moments that matter — with people who get it.</p>
          <div className="right-pills">
            <span className="pill pill--accent">✦ Sign up free</span>
            <span className="pill">Instant access</span>
            <span className="pill">Cancel anytime</span>
          </div>
        </div>
      </div>

    </div>
  </main>




















    // <main>
    //   <div className="form-container">
    //     <h1>Register</h1>
    //     <form onSubmit={handleformSubmit}>
    //       <input 
    //           onInput={(e)=>{setUsername(e.target.value)}}
    //           type="text"
    //           name='username' 
    //           placeholder='Enter username' />

    //       <input 
    //           onInput={(e)=>{setEmail(e.target.value)}}
    //           type="text" 
    //           name="email" 
    //           placeholder='Enter email' />
  
    //       <input 
    //           onInput={(e)=>{setPassword(e.target.value)}}
    //           type="password" 
    //           name='password' 
    //           placeholder='Enter password' />
            
    //       <button  >Register</button>
    //     </form>
    //     <p>
    //       Already have an accound? <Link className='toggleAuthForm' to="/login">Login</Link>
    //     </p>
    //   </div>
    // </main>
  )
}

export default Register
