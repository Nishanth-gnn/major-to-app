import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ChatPage(){
  const [message,setMessage]=useState('');
  const [history,setHistory]=useState<any[]>([]);
  useEffect(()=>{ fetchHistory() },[]);
  async function fetchHistory(){
    const token = localStorage.getItem('token');
    const r = await axios.get('/api/chat/history', { headers: { Authorization: `Bearer ${token}` } });
    setHistory(r.data);
  }
  async function send(){
    const token = localStorage.getItem('token');
    const r = await axios.post('/api/chat', { message }, { headers: { Authorization: `Bearer ${token}` } });
    setHistory(prev=>[{ message, response: r.data.response, createdAt: new Date().toISOString() }, ...prev]);
    setMessage('');
  }
  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">AI Airport Assistant</h2>
      <div className="mb-4">
        <input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ask about airport..." className="input w-full" />
        <button onClick={send} className="btn btn-primary mt-2">Send</button>
      </div>
      <div>
        {history.map(h=> (
          <div key={h.id || h.createdAt} className="mb-3 bg-white p-3 rounded">
            <div className="font-medium">You: {h.message}</div>
            <div className="text-slate-600">Assistant: {h.response}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
