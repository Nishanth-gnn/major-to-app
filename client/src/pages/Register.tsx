import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const nav = useNavigate();
  async function submit(e: any){
    e.preventDefault();
    const r = await axios.post('/api/auth/register',{ name, email, password });
    localStorage.setItem('token', r.data.token);
    nav('/');
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="p-6 bg-white rounded shadow w-full max-w-md">
        <h2 className="text-2xl mb-4">Register</h2>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="input mb-2" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="input mb-2" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="input mb-2" />
        <button className="btn btn-primary">Register</button>
      </form>
    </div>
  )
}
