import React, {useEffect, useState} from 'react';

const PLATFORMS = ['tiktok','instagram','x','tumblr','youtube','snap'];

function SocialCard({name,data, onSave}){
  const [local, setLocal] = useState(data);
  useEffect(()=>setLocal(data),[data]);
  const save = ()=> onSave(name, local);
  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h3 style={{margin:0}}>{name.toUpperCase()}</h3>
          <a href={local.url} target="_blank" rel="noreferrer" className="small">{local.url}</a>
        </div>
        <button className="button" onClick={save}>Save</button>
      </div>

      <div style={{marginTop:10}}>
        <label className="small">Followers</label>
        <input className="input" value={local.followers} onChange={e=>setLocal({...local, followers: parseInt(e.target.value||0)})}/>
      </div>

      <div style={{marginTop:8}}>
        <label className="small">Total Likes</label>
        <input className="input" value={local.likes} onChange={e=>setLocal({...local, likes: parseInt(e.target.value||0)})}/>
      </div>

      <div style={{marginTop:8}}>
        <div className="small">Weekly progress (goal 500)</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:8}}>
          {['weeklyLikes','weeklyComments','weeklyReposts'].map(k=>(
            <div key={k}>
              <div className="small">{k.replace('weekly','')}</div>
              <div className="progress" title={`${local[k]||0}/500`}>
                <i style={{width: `${Math.min(100, (local[k]||0)/5)}%`}}/>
              </div>
              <input className="input" value={local[k]} onChange={e=>setLocal({...local, [k]: parseInt(e.target.value||0)})}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Planner({calendar, setCalendar, onGenerateScripts}){
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  function updateMonth(name, value){
    const c = {...calendar};
    c.months = {...c.months, [name]: value};
    setCalendar(c);
  }

  return (
    <div className="card">
      <h3>Year Planner — Around the World in Your Kitchen</h3>
      <div className="small">Add country and 4 weekly dish names. Scripts auto-generate per platform.</div>
      <div style={{marginTop:12}}>
        <div className="month-grid">
          {months.map(m=>{
            const mdata = calendar.months?.[m] || {country:'',weeks:['','','','']};
            return (
              <div key={m} style={{padding:10, border:'1px dashed #eee', borderRadius:6}}>
                <strong>{m}</strong>
                <div className="small">Country</div>
                <input className="input" value={mdata.country} onChange={e=>updateMonth(m,{...mdata, country:e.target.value})}/>
                <div style={{marginTop:8}} className="small">Weeks (enter dish names)</div>
                {[0,1,2,3].map(i=>(
                  <input key={i} className="input" value={mdata.weeks[i]||''} placeholder={`Week ${i+1}`} onChange={e=>{
                    const weeks = [...(mdata.weeks||['','','',''])]; weeks[i]=e.target.value;
                    updateMonth(m,{...mdata, weeks});
                  }} style={{marginTop:6}}/>
                ))}
                <div style={{marginTop:8}}>
                  <button className="button" onClick={()=>onGenerateScripts(m, mdata)}>Generate Scripts</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Videos({videos, onAddVideo, removeCandidates}) {
  const [v, setV] = useState({title:'',views:0,likes:0,comments:0});
  return (
    <div className="card">
      <h3>Videos</h3>
      <div className="small">Add video metrics (to track & get recommendations)</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 120px',gap:8, marginTop:8}}>
        <input className="input" placeholder="Title" value={v.title} onChange={e=>setV({...v,title:e.target.value})}/>
        <input className="input" placeholder="Views" value={v.views} onChange={e=>setV({...v,views:parseInt(e.target.value||0)})}/>
        <input className="input" placeholder="Likes" value={v.likes} onChange={e=>setV({...v,likes:parseInt(e.target.value||0)})}/>
        <input className="input" placeholder="Comments" value={v.comments} onChange={e=>setV({...v,comments:parseInt(e.target.value||0)})}/>
      </div>
      <div style={{marginTop:8}}>
        <button className="button" onClick={()=>{onAddVideo(v); setV({title:'',views:0,likes:0,comments:0})}}>Add Video</button>
      </div>

      <div style={{marginTop:12}}>
        <h4>All videos</h4>
        {videos.map(x=>(
          <div key={x.id} style={{padding:8, borderBottom:'1px solid #eee'}}><strong>{x.title}</strong> — engagement {x.engagementScore}</div>
        ))}
      </div>

      <div style={{marginTop:12}}>
        <h4>Recommend remove</h4>
        {removeCandidates.length ? removeCandidates.map(r=>(
          <div style={{padding:8,borderBottom:'1px dashed #eee'}} key={r.id}><strong>{r.title}</strong> — score {r.engagementScore}</div>
        )) : <div className="small">No low-engagement videos found</div>}
      </div>
    </div>
  );
}

export default function App(){
  const [state, setState] = useState(null);
  useEffect(()=>fetch('/api/state').then(r=>r.json()).then(setState),[]);
  function saveSocial(network, payload){
    fetch(`/api/socials/${network}`,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)})
      .then(r=>r.json()).then(()=>fetch('/api/state').then(r=>r.json()).then(setState));
  }
  function saveCalendar(cal){
    fetch('/api/calendar',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(cal)})
      .then(()=>fetch('/api/state').then(r=>r.json()).then(setState));
  }
  function generateScripts(monthName, mdata){
    // call backend generator for each platform for Mon/Wed/Fri, for demo we'll just call one by one
    (async ()=>{
      for(const p of PLATFORMS){
        const dish = (mdata.weeks && mdata.weeks[0]) || 'Dish';
        const res = await fetch(`/api/generate/week-scripts?platform=${p}&country=${encodeURIComponent(mdata.country||'')}&dish=${encodeURIComponent(dish)}`);
        const s = await res.json();
        console.log('script',p,s);
      }
      alert('Generated scripts (check console). In production you can show them in UI or save them to calendar.');
    })();
  }

  async function addVideo(v){
    const res = await fetch('/api/videos',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(v)});
    const newV = await res.json();
    setState(s=>({...s, videos:[...s.videos, newV]}));
  }

  async function checkRemovals(){
    const res = await fetch('/api/recommend/remove?threshold=100');
    const rem = await res.json();
    return rem;
  }

  if(!state) return <div className="container">Loading…</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Around the World in Your Kitchen — Social Dashboard</h1>
        <div className="small">Pre-launch social plan & weekly scripts</div>
      </div>

      <div className="card">
        <h2>Socials</h2>
        <div className="social-grid">
          {Object.keys(state.socials).map(k=>{
            return <SocialCard key={k} name={k} data={state.socials[k]} onSave={saveSocial} />;
          })}
        </div>
      </div>

      <Planner calendar={state.calendar} setCalendar={(c)=>{saveCalendar(c); setState(s=>({...s, calendar:c}))}} onGenerateScripts={generateScripts} />

      <Videos videos={state.videos || []} onAddVideo={addVideo} removeCandidates={state.videos?.filter(v=>v.engagementScore < 100) || []} />

      <div style={{marginTop:12}} className="card">
        <h3>Quick actions / notes</h3>
        <div className="small">– Scripts auto-generate for Mon/Wed/Fri per platform via templates. You can later plug an LLM API or connect to real platform posting APIs.</div>
        <div style={{marginTop:8}}>
          <button className="button" onClick={async ()=>{
            const rem = await checkRemovals();
            if(rem.length) alert('Remove candidates: ' + rem.map(r=>r.title).slice(0,5).join(', '));
            else alert('No low-engagement videos found (threshold=100).');
          }}>Run Remove-Recommend</button>
        </div>
      </div>
    </div>
  );
}
