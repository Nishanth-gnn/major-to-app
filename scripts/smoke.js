(async ()=>{
  const base = 'http://localhost:4000';
  function log(...a){ console.log(...a) }
  try{
    log('Registering test user...')
    let r = await fetch(base+'/api/auth/register', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ name: 'Test User', email: 'test+smoke@example.com', password: 'Password123!' }) });
    const reg = await r.json();
    log('Register response:', reg);
    const token = reg.token || (await (await fetch(base+'/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({ email: 'test+smoke@example.com', password: 'Password123!' }) })).json()).token;
    log('Using token:', token? 'RECEIVED':'MISSING');

    log('\nCalculating transit...')
    const now = new Date();
    const arrival = now.toISOString();
    const departure = new Date(now.getTime()+1000*60*120).toISOString();
    r = await fetch(base+'/api/transit/calculate', { method: 'POST', headers: {'content-type':'application/json','authorization': 'Bearer '+token}, body: JSON.stringify({ flightNumber: 'AB123', arrivalTime: arrival, departureTime: departure }) });
    const transit = await r.json();
    log('Transit result:', transit);

    log('\nFetching luggage (domestic)...')
    r = await fetch(base+'/api/luggage/domestic');
    log('Domestic:', await r.json());

    log('\nFetching luggage (international)...')
    r = await fetch(base+'/api/luggage/international');
    log('International:', await r.json());

    log('\nSending chat message...')
    r = await fetch(base+'/api/chat', { method: 'POST', headers: {'content-type':'application/json','authorization': 'Bearer '+token}, body: JSON.stringify({ message: 'How do I check in my baggage?' }) });
    const chat = await r.json();
    log('Chat response:', chat);
  }catch(e){ console.error('Smoke test error', e) }
})();
