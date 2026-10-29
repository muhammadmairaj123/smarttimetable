const subjectRows=[['English','#60a5fa'],['Mathematics','#a78bfa'],['Science','#34d399'],['Sindhi','#fb923c'],['Urdu','#f472b6'],['Islamiat','#facc15'],['Social Studies','#22d3ee'],['Drawing','#fda4af'],['Chemistry','#38bdf8'],['Biology','#4ade80'],['Physics','#c084fc'],['MT','#f97316'],['NMT','#fb7185'],['Pakistan Studies','#2dd4bf']];
const teacherRows=[
['Mr. Ali','English'],['Mr. Ahmed','English'],['Mr. Imran','English'],
['Ms. Sana','Mathematics'],['Mr. Bilal','Mathematics'],['Mr. Usman','Mathematics'],
['Ms. Fatima','Science'],['Mr. Shahid','Science'],
['Ms. Ayesha','Sindhi'],['Mr. Danish','Sindhi'],
['Ms. Hina','Urdu'],['Ms. Rabia','Urdu'],
['Mr. Kamran','Islamiat'],['Mr. Faisal','Islamiat'],
['Ms. Nadia','Social Studies'],['Mr. Javed','Social Studies'],
['Ms. Mehwish','Drawing'],['Mr. Salman','Chemistry'],['Ms. Kiran','Biology'],['Mr. Waqas','Physics']
];
const counts=[['English',6],['Mathematics',6],['Science',5],['Sindhi',5],['Urdu',3],['Islamiat',3],['Drawing',1],['Social Studies',4]];
const upperCounts=[['English',6],['Mathematics',6],['Chemistry',5],['Biology',5],['Physics',5],['MT',3],['Islamiat',3]];
const seniorCounts=[['English',6],['Mathematics',6],['Chemistry',5],['Biology',5],['Physics',5],['NMT',3],['Pakistan Studies',3]];
export const makeDemo=()=>{
 const subjects=subjectRows.map(([name,color],i)=>({id:'s'+i,name,color,needsLab:false}));
 const byName=Object.fromEntries(subjects.map(s=>[s.name,s]));
 const teachers=teacherRows.map(([name,subject],i)=>({id:'t'+(i+1),name,subjectIds:[byName[subject].id,...(subject==='Mathematics'?[byName.MT.id,byName.NMT.id]:[]),...(subject==='Social Studies'?[byName['Pakistan Studies'].id]:[])],maxPeriodsPerDay:6,unavailable:[]}));
 const teacherFor=(subject,ci)=>{
  const groups={English:[0,1,2],Mathematics:[3,4,5],Science:[6,7],Sindhi:[8,9],Urdu:[10,11],Islamiat:[12,13],'Social Studies':[14,15],Drawing:[16],Chemistry:[17],Biology:[18],Physics:[19],MT:[5],NMT:[5],'Pakistan Studies':[14]};
  const list=groups[subject]||[];return teachers[list[ci%list.length]??list[0]]?.id;
 };
 const classes=['6','7','8','9','10'].map((grade,ci)=>{const rows=ci<3?counts:ci===3?upperCounts:seniorCounts;const subjectPeriods={},teacherForSubject={};for(const [name,n] of rows){const s=byName[name];subjectPeriods[s.id]=n;teacherForSubject[s.id]=teacherFor(name,ci);}return{id:'c'+grade,name:'Class '+grade,subjectPeriods,teacherForSubject};});
 const rooms=[1,2,3,4,5].map(n=>({id:'r'+n,name:'Room '+n,type:'normal'}));
 const grid={
 'c6':{Mon:['Sindhi','Science','Drawing','Mathematics','Urdu','English','Social Studies'],Tue:['Mathematics','Sindhi','Urdu','Science','English','Social Studies','Islamiat'],Wed:['Islamiat','Social Studies','Mathematics','Sindhi','English','Science','Urdu'],Thu:['English','Sindhi','Science','Mathematics','Islamiat','Social Studies','Sindhi'],Fri:['Mathematics','English','Science','English','Mathematics']},
 'c7':{Mon:['Science','Social Studies','Urdu','Islamiat','Mathematics','Sindhi','English'],Tue:['Urdu','Science','Mathematics','Islamiat','Drawing','Sindhi','English'],Wed:['Social Studies','Science','Mathematics','English','Islamiat','Urdu','Sindhi'],Thu:['Science','Social Studies','Sindhi','English','Mathematics','Mathematics','English'],Fri:['Science','Mathematics','English','Sindhi','Social Studies']},
 'c8':{Mon:['Science','Sindhi','Islamiat','Mathematics','Urdu','Social Studies','English'],Tue:['Sindhi','English','Mathematics','Urdu','Science','Islamiat','Social Studies'],Wed:['English','Sindhi','Social Studies','Science','Mathematics','Drawing','Urdu'],Thu:['English','Sindhi','Science','Mathematics','Social Studies','Islamiat','Science'],Fri:['Mathematics','English','Sindhi','Mathematics','English']},
 'c9':{Mon:['Mathematics','English','Physics','Islamiat','Biology','Chemistry','MT'],Tue:['English','Biology','Physics','Islamiat','Mathematics','Chemistry','MT'],Wed:['Chemistry','MT','English','Biology','Islamiat','Mathematics','Physics'],Thu:['Biology','Mathematics','Physics','English','Chemistry','Physics','Chemistry'],Fri:['Biology','English','Mathematics','Mathematics','English']},
 'c10':{Mon:['Pakistan Studies','English','Mathematics','Chemistry','Biology','NMT','Physics'],Tue:['English','Mathematics','Physics','Pakistan Studies','NMT','Chemistry','Biology'],Wed:['Mathematics','English','Biology','Physics','NMT','Chemistry','Pakistan Studies'],Thu:['Biology','Mathematics','Chemistry','English','Physics','Mathematics','English'],Fri:['Physics','Chemistry','English','Biology','Mathematics']}
 };
 const timetable=Object.fromEntries(classes.map(c=>[c.id,Object.fromEntries(['Mon','Tue','Wed','Thu','Fri'].map(day=>[day,Array(7).fill(null)]))]));
 const dayLoad={},weekLoad={};
 for(const day of ['Mon','Tue','Wed','Thu','Fri']){const limit=day==='Fri'?5:7;for(let p=0;p<limit;p++){const used=new Set();for(const c of classes){const name=grid[c.id][day][p],sub=byName[name];const eligible=teachers.filter(t=>!used.has(t.id)&&(dayLoad[`${t.id}:${day}`]||0)<t.maxPeriodsPerDay);eligible.sort((a,b)=>{const am=a.subjectIds.includes(sub.id)?1:0,bm=b.subjectIds.includes(sub.id)?1:0;return bm-am-(weekLoad[a.id]||0)*0.0001+(weekLoad[b.id]||0)*0.0001;});const teacher=eligible[0];if(!teacher)continue;used.add(teacher.id);dayLoad[`${teacher.id}:${day}`]=(dayLoad[`${teacher.id}:${day}`]||0)+1;weekLoad[teacher.id]=(weekLoad[teacher.id]||0)+1;timetable[c.id][day][p]={subjectId:sub.id,teacherId:teacher.id,roomId:rooms[classes.indexOf(c)].id};}}}
 return {settings:{schoolName:'Sindh Model School',workingDays:['Mon','Tue','Wed','Thu','Fri'],periodsPerDay:7,periodsByDay:{Mon:7,Tue:7,Wed:7,Thu:7,Fri:5},breakAfterPeriod:4},subjects,teachers,classes,rooms,timetable,absences:[],substitutions:[],language:'en',darkMode:false};
};
