import React, { useState } from 'react';
import axios from 'axios';

export default function Transit(){
  const [flight,setFlight]=useState('');
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState<any>(null);

  async function calc(e:any){
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers: any = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const r = await axios.post('/api/transit/track', { flightNumber: flight }, { headers });
      setResult(r.data);
    } catch (err:any) {
      console.error(err);
      setResult({ error: err.response?.data || 'Request failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Transit & Layover Planner</h2>
      <form onSubmit={calc} className="bg-white p-4 rounded shadow mb-4">
        <input value={flight} onChange={e=>setFlight(e.target.value)} placeholder="Flight Number" className="input mb-2 w-full" />
        <button className="btn btn-primary">Calculate</button>
      </form>
      {loading && (
        <div className="mb-4 text-sm text-gray-600">Loading flight data…</div>
      )}
      {result && (
        <div className="p-4 bg-white rounded shadow">
          {result.error && <div className="text-red-600">Error: {JSON.stringify(result.error)}</div>}
          {result.category && (
            <>
              <div className="font-semibold mb-2">{result.message}</div>
              <div><strong>Flight:</strong> {result.flightNumber}</div>
              <div><strong>Gate:</strong> {result.gate || 'N/A'}</div>
              <div><strong>Status:</strong> {result.status || 'N/A'}</div>
              {loading ? (
                <div className="text-sm text-gray-600">Loading times…</div>
              ) : (
                <>
                  <div><strong>Arrival:</strong> {result.arrivalTime || 'N/A'}</div>
                  <div><strong>Departure:</strong> {result.departureTime || 'N/A'}</div>
                </>
              )}
              {result.layoverHours !== undefined && <div><strong>Layover (hours):</strong> {result.layoverHours}</div>}
              {result.suggestions && (
                <div className="mt-2">
                  <strong>Suggestions:</strong>
                  <ul className="list-disc ml-6">
                    {result.suggestions.map((s:string,i:number)=>(<li key={i}>{s}</li>))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
