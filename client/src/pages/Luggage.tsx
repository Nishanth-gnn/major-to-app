import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Luggage(){
  const [category,setCategory]=useState<'domestic'|'international'>('domestic');
  const [steps,setSteps]=useState<any[]>([]);
  const [index,setIndex]=useState(0);

  useEffect(()=>{ fetchSteps() },[category]);
  async function fetchSteps(){
    const r = await axios.get(`/api/luggage/${category}`);
    setSteps(r.data);
    setIndex(0);
  }
  function speak(text: string){
    const s = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(s);
  }
  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Luggage Check-in Guidance</h2>
      <div className="mb-4">
        <select value={category} onChange={e=>setCategory(e.target.value as any)} className="input">
          <option value="domestic">Domestic</option>
          <option value="international">International</option>
        </select>
      </div>
      {steps.length>0 && (
        <div className="bg-white p-4 rounded shadow">
          <div className="mb-2">Step {steps[index].stepNumber}: {steps[index].title}</div>
          <div className="mb-2">{steps[index].description}</div>
          <div className="flex gap-2">
            <button onClick={()=>{ setIndex(i=>Math.max(0,i-1)) }} disabled={index===0} className="btn">Previous</button>
            <button onClick={()=>{ setIndex(i=>Math.min(steps.length-1,i+1)) }} disabled={index===steps.length-1} className="btn btn-primary">Next</button>
            <button onClick={()=>speak(steps[index].voiceText)} className="btn">Play Voice</button>
          </div>
          <div className="mt-3">Progress: {index+1}/{steps.length}</div>
        </div>
      )}
    </div>
  )
}
