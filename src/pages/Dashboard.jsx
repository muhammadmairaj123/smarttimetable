import {useEffect} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {actions} from '../store/store';
import {makeDemo} from '../data/demo';
import {generateTimetable,detectClashes} from '../engine';
import {Link} from 'react-router-dom';
export default function Dashboard(){
 const d=useSelector(s=>s),dispatch=useDispatch();
 useEffect(()=>{const filled=Object.values(d.timetable||{}).flatMap(x=>Object.values(x).flatMap(y=>y)).some(Boolean);if(!filled&&d.teachers.length&&d.classes.length){const r=generateTimetable(d);if(r.ok)dispatch(actions.setTimetable(r.timetable));}},[]);
 const all=Object.values(d.timetable||{}).flatMap(days=>Object.values(days).flatMap(day=>day)).filter(Boolean);
 const today=new Date().toISOString().slice(0,10),day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()];
 const todaysSubs=d.substitutions.filter(x=>x.date===today&&x.status==='accepted');
 const todaysAbs=d.absences.filter(x=>x.date===today);
 const pending=d.substitutions.filter(x=>x.status==='pending');
 const clashes=detectClashes(d.timetable,d.teachers,d.rooms);
 const engagedCount=id=>d.substitutions.filter(x=>x.date===today&&x.substituteId===id&&x.status==='accepted').length;
 const workloads=d.teachers.map(te=>({...te,load:all.filter(x=>x.teacherId===te.id&&x.day===day).length}));
 function loadDemo(){dispatch(actions.replace(makeDemo()));}
 return <><div className="page-heading"><div><div className="eyebrow">STAFF COVER DESK</div><h1>Engage Management</h1><p>Manage teacher leave, assign cover periods fairly, and prevent staff clashes.</p></div><button className="btn" onClick={loadDemo}>↻ Load demo staff & schedule</button></div>
 <div className="absence-hero"><div className="absence-icon">↻</div><div><span className="pill green">DAILY ENGAGE DESK</span><h2>One teacher absent? Arrange cover without clashes.</h2><p>Choose the absent teacher, review affected periods, and accept or auto-assign eligible substitutes. Every assignment is checked against the timetable and daily engage limits.</p><Link to="/absence" className="btn mt-3 inline-flex">＋ Record leave & find engage →</Link></div></div>
 <div className="stats-grid mt-5"><div className="stat-card"><span className="stat-icon teal">♙</span><span className="stat-label">Staff members</span><strong>{d.teachers.length}</strong><small>Dummy names are editable</small></div><div className="stat-card"><span className="stat-icon orange">☾</span><span className="stat-label">Today's absences</span><strong>{todaysAbs.length}</strong><small>Recorded leave entries</small></div><div className="stat-card"><span className="stat-icon blue">↻</span><span className="stat-label">Engages assigned today</span><strong>{todaysSubs.length}</strong><small>Confirmed substitute periods</small></div><div className="stat-card"><span className="stat-icon purple">✓</span><span className="stat-label">Timetable clashes</span><strong className={clashes.length?'text-red-500':''}>{clashes.length}</strong><small>{clashes.length?'Needs attention':'No teacher clashes found'}</small></div></div>
 <div className="content-grid mt-5"><div className="card"><div className="section-title"><div><h2>Today's staff workload</h2><p>{day} · regular periods per teacher</p></div><Link to="/teachers">Edit staff ↗</Link></div><div className="workload-list">{workloads.map(te=><div className="workload-row" key={te.id}><span>{te.name}</span><div className="bar-track"><div className="bar-fill" style={{width:`${Math.min(100,te.load/7*100)}%`}}/></div><b>{te.load}{engagedCount(te.id)?` + ${engagedCount(te.id)}E`:''}</b></div>)}</div><p className="muted mt-3">E = accepted engage today. Normal limit: 1; teachers with 1 regular period may receive up to 2.</p></div>
 <div className="card"><div className="section-title"><div><h2>Quick actions</h2><p>Everyday cover workflow</p></div></div><div className="quick-links"><Link to="/absence"><span>↻</span><div><b>Record teacher leave</b><small>Find affected classes and free substitutes</small></div>→</Link><Link to="/teachers"><span>♙</span><div><b>Manage 20 teachers</b><small>Edit dummy names, subjects and limits</small></div>→</Link><Link to="/timetable"><span>▦</span><div><b>View staff schedule</b><small>Check free periods before assigning cover</small></div>→</Link><Link to="/settings"><span>⇩</span><div><b>Backup / export</b><small>Save your school data locally</small></div>→</Link></div><div className="notice mt-4"><div className="notice-icon">!</div><div><b>Manual confirmation stays in control</b><p>The system will not force an engage when all eligible teachers are busy or at their daily limit.</p></div></div></div></div>
 <div className="footer-note">Engage Management System · Private local data · No backend</div></>;
}
