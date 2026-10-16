// V1 rule-based planner. No backend, no AI. localStorage only.
const MATH_TOPICS = [
  {name:"Number Bases",weight:4,keywords:["base","binary","convert"]},
  {name:"Fractions & Decimals",weight:4,keywords:["fraction","decimal","percentage"]},
  {name:"Indices & Logarithms",weight:6,keywords:["indice","log","power","exponent"]},
  {name:"Sets",weight:5,keywords:["set","venn","union","intersection"]},
  {name:"Algebra",weight:10,keywords:["simplify","expression","algebra","factor"]},
  {name:"Linear Equations",weight:7,keywords:["linear","simultaneous","equation"]},
  {name:"Quadratic Equations",weight:9,keywords:["quadratic","x^2","roots"]},
  {name:"Variation",weight:4,keywords:["variation","proportional","direct","inverse"]},
  {name:"Geometry",weight:8,keywords:["angle","triangle","circle","parallel","geometry"]},
  {name:"Mensuration",weight:7,keywords:["area","volume","perimeter","mensuration","cylinder","cone"]},
  {name:"Trigonometry",weight:8,keywords:["sin","cos","tan","trigonometry","bearing"]},
  {name:"Statistics",weight:7,keywords:["mean","median","mode","statistics","data","histogram"]},
  {name:"Probability",weight:6,keywords:["probability","die","coin","chance"]},
  {name:"Matrices",weight:5,keywords:["matrix","matrices","determinant"]},
  {name:"Vectors",weight:5,keywords:["vector","magnitude","direction"]},
];
const ENG_TOPICS = [
  {name:"Grammar",weight:9,keywords:["tense","verb","grammar","sentence"]},
  {name:"Concord",weight:7,keywords:["concord","agreement","subject verb"]},
  {name:"Lexis",weight:8,keywords:["synonym","antonym","vocabulary","lexis","idiom"]},
  {name:"Comprehension",weight:10,keywords:["passage","comprehension","read the"]},
  {name:"Summary",weight:6,keywords:["summary","summarise","precis"]},
  {name:"Oral Forms",weight:6,keywords:["stress","pronunciation","oral","phon"]},
  {name:"Essay Writing",weight:7,keywords:["essay","composition","write on"]},
  {name:"Letter Writing",weight:5,keywords:["letter","formal","informal"]},
  {name:"Figures of Speech",weight:5,keywords:["metaphor","simile","irony","figure"]},
  {name:"Punctuation",weight:4,keywords:["punctuat","comma","apostrophe"]},
];
// Thin representative sample bank: 15 math + 15 english
const BANK = [
  {subject:"Math",topic:"Algebra",year:2022,text:"Simplify 3x + 2(x − 4)."},
  {subject:"Math",topic:"Quadratic Equations",year:2023,text:"Solve x^2 − 5x + 6 = 0."},
  {subject:"Math",topic:"Quadratic Equations",year:2021,text:"Find the roots of 2x^2 + 5x − 3 = 0."},
  {subject:"Math",topic:"Geometry",year:2022,text:"In triangle ABC, angle B = 90°. AB=3, BC=4. Find AC."},
  {subject:"Math",topic:"Trigonometry",year:2023,text:"If sin θ = 0.6, find cos θ (0<θ<90°)."},
  {subject:"Math",topic:"Trigonometry",year:2020,text:"A ladder of 10m makes 60° with ground. How high up the wall?"},
  {subject:"Math",topic:"Statistics",year:2021,text:"Find the mean of 2, 4, 6, 8, 10."},
  {subject:"Math",topic:"Probability",year:2022,text:"A die is tossed. Probability of an even number?"},
  {subject:"Math",topic:"Sets",year:2020,text:"U={1..10}, A={2,4,6}. Find A′ using Venn idea."},
  {subject:"Math",topic:"Mensuration",year:2023,text:"Find the area of a circle radius 7cm (π=22/7)."},
  {subject:"Math",topic:"Linear Equations",year:2021,text:"Solve simultaneously: x+y=7, x−y=3."},
  {subject:"Math",topic:"Indices & Logarithms",year:2022,text:"Simplify 2^3 × 2^4."},
  {subject:"Math",topic:"Number Bases",year:2020,text:"Convert 1011₂ to base 10."},
  {subject:"Math",topic:"Matrices",year:2023,text:"Find determinant of [[2,3],[1,4]]."},
  {subject:"Math",topic:"Variation",year:2021,text:"y varies directly as x. y=10 when x=2. Find y when x=5."},
  {subject:"English",topic:"Grammar",year:2022,text:"Choose the correct tense: She ___ to school yesterday. (go/went/gone)"},
  {subject:"English",topic:"Concord",year:2021,text:"Neither of the boys ___ arrived. (has/have)"},
  {subject:"English",topic:"Lexis",year:2023,text:"Choose the synonym of 'candid'."},
  {subject:"English",topic:"Lexis",year:2020,text:"Choose the antonym of 'scarce'."},
  {subject:"English",topic:"Comprehension",year:2022,text:"Read the passage on honesty. Q: Why did the boy return the money?"},
  {subject:"English",topic:"Comprehension",year:2023,text:"Read the passage on farming. Q: List two benefits mentioned."},
  {subject:"English",topic:"Summary",year:2021,text:"Summarise in one sentence the causes of lateness in the passage."},
  {subject:"English",topic:"Oral Forms",year:2022,text:"Which word has a different stress pattern: teacher, doctor, employ?"},
  {subject:"English",topic:"Essay Writing",year:2023,text:"Write an essay on the importance of discipline (250 words)."},
  {subject:"English",topic:"Letter Writing",year:2020,text:"Write a formal letter to your principal requesting library books."},
  {subject:"English",topic:"Figures of Speech",year:2021,text:"'He is a lion in battle' is an example of ___."},
  {subject:"English",topic:"Punctuation",year:2020,text:"Punctuate: what a beautiful morning it is"},
  {subject:"English",topic:"Grammar",year:2023,text:"Choose correct sentence: (a) He has being... (b) He has been..."},
  {subject:"English",topic:"Grammar",year:2021,text:"Fill in: I have lived here ___ 2015. (since/for)"},
  {subject:"English",topic:"Concord",year:2022,text:"The committee ___ divided. (is/are — choose by context)"},
];

function tagText(text){
  const t = text.toLowerCase();
  let best=null,bestScore=0,bestSub="Math";
  const all=[...MATH_TOPICS.map(x=>({...x,sub:"Math"})),...ENG_TOPICS.map(x=>({...x,sub:"English"}))];
  for(const tp of all){
    let s=0; for(const k of tp.keywords){ if(t.includes(k)) s++; }
    if(s>bestScore){bestScore=s;best=tp.name;bestSub=tp.sub;}
  }
  return bestScore>0?{topic:best,subject:bestSub}:null;
}
function questionsFor(subject,topic){
  return BANK.filter(q=>q.subject===subject&&q.topic===topic);
}
function perHourCount(subject){ return subject==="Math"?5:11; } // English: 1 passage + 10 Qs

function buildTopicList(useMath,useEng){
  const list=[];
  if(useMath) MATH_TOPICS.forEach(t=>list.push({subject:"Math",...t}));
  if(useEng) ENG_TOPICS.forEach(t=>list.push({subject:"English",...t}));
  return list;
}
function generatePlan({useMath,useEng,days,hours,customQuestions}){
  const topics=buildTopicList(useMath,useEng);
  if(!topics.length) throw new Error("Pick at least one subject.");
  if(days<1||days>90) throw new Error("Days must be 1–90.");
  const revDays = days>=5?Math.floor(days*0.2):(days>=3?1:0);
  const studyDays = days-revDays;
  // merge or expand topics into studyDays slots (prerequisite order preserved)
  let slots=[];
  if(studyDays>=topics.length){
    slots=topics.map(t=>({topics:[t],deep:false}));
    let extra=studyDays-topics.length;
    const byWeight=[...topics].sort((a,b)=>b.weight-a.weight);
    let i=0;
    while(extra>0){ const t=byWeight[i%byWeight.length]; slots.push({topics:[t],deep:true}); extra--; i++; }
    // keep prereq order for base, deep-practice appended at end of study block
  } else if(studyDays>0){
    slots=Array.from({length:studyDays},()=>({topics:[],deep:false}));
    topics.forEach((t,idx)=>{ slots[Math.floor(idx*studyDays/topics.length)].topics.push(t); });
  }
  const plan=[];
  const qPerHourAvg=5;
  slots.forEach((s,idx)=>{
    let qs=[];
    s.topics.forEach(t=>{ qs=qs.concat(questionsFor(t.subject,t.name)); });
    // trim/fill to hours
    const target=Math.max(2,Math.round(hours*qPerHourAvg));
    if(qs.length>target) qs=qs.slice(0,target);
    const label=s.topics.map(t=>t.name).join(" + ");
    const subj=s.topics.length===1?s.topics[0].subject:(useMath&&useEng?"Mixed":"General");
    plan.push({day:idx+1,kind:"study",subject:subj,title:(s.deep?"Deep practice: ":"")+label,topics:s.topics.map(t=>t.name),questions:qs.length?qs:[{subject:subj,topic:label,year:0,text:"Revise notes on "+label+" + attempt 1 past question."}],hours,done:false});
  });
  for(let r=0;r<revDays;r++){
    const sample=[...BANK].sort(()=>Math.random()-0.5).slice(0,Math.max(3,hours*3));
    plan.push({day:plan.length+1,kind:"revision",subject:"Mixed",title:r===revDays-1?"Final mock":"Revision + mixed drill",topics:["Mixed review"],questions:sample,hours,done:false});
  }
  // custom / untagged → last study day (or last day if no study days)
  if(customQuestions.length){
    const tagged=[],untagged=[];
    customQuestions.forEach(c=>{const m=tagText(c);(m?tagged:untagged).push(c);});
    const targetDay=plan.find(d=>d.kind==="study")?plan.filter(d=>d.kind==="study").pop():plan[plan.length-1];
    if(targetDay){
      tagged.forEach((c,i)=>{const m=tagText(c);targetDay.questions.push({subject:m.subject,topic:m.topic,year:0,text:c});});
      if(untagged.length) {
        // Q17 fallback: untagged bucket on last study day
        untagged.forEach(c=>targetDay.questions.push({subject:"General",topic:"Untagged / General Review",year:0,text:c}));
        if(!targetDay.title.includes("Untagged")) targetDay.title+=" + Untagged / General Review";
      }
    }
  }
  // guarantee exactly N days
  while(plan.length>days) { const a=plan.pop(),b=plan[plan.length-1]; b.questions=b.questions.concat(a.questions); b.title+=" + "+a.title; }
  return plan;
}

// ---- persistence + UI (browser only) ----
const KEY="bwaiw-plan-v1";
let plan=[];
if(typeof document!=="undefined"){
function save(){localStorage.setItem(KEY,JSON.stringify(plan));}
function load(){try{plan=JSON.parse(localStorage.getItem(KEY))||[]}catch{plan=[]}}
function updateProgress(){
  const done=plan.filter(d=>d.done).length;
  const w=document.getElementById("progressWrap");
  if(!plan.length){w.hidden=true;return;}
  w.hidden=false;
  document.getElementById("progressFill").style.width=(plan.length?done/plan.length*100:0)+"%";
  document.getElementById("progressText").textContent=`${done}/${plan.length} days done`;
}
function render(){
  updateProgress();
  const has=plan.length>0;
  document.getElementById("view-plan").hidden=!has;
  if(!has) return;
  document.getElementById("planN").textContent=plan.length;
  const g=document.getElementById("planGrid"); g.innerHTML="";
  plan.forEach((d,i)=>{
    const div=document.createElement("div"); div.className="day"+(d.done?" done":"");
    const cls=d.kind==="revision"?"rev":(d.subject==="English"?"eng":"");
    div.innerHTML=`<h3><input type="checkbox" data-i="${i}" ${d.done?"checked":""} /> Day ${d.day}: ${d.title}</h3>
      <span class="badge ${cls}">${d.subject}</span><span class="badge">${d.hours}h</span><span class="badge">${d.questions.length} Qs</span>
      <div>${d.questions.slice(0,4).map(q=>`<p class="q">• [${q.topic}] ${q.text}</p>`).join("")}${d.questions.length>4?`<p class="q">… +${d.questions.length-4} more (see Today focus)</p>`:""}</div>`;
    g.appendChild(div);
  });
  g.querySelectorAll("input[type=checkbox]").forEach(cb=>cb.onchange=e=>{
    plan[+e.target.dataset.i].done=e.target.checked; save(); render();
  });
}
function showToday(){
  if(!plan.length) return;
  const idx=plan.findIndex(d=>!d.done);
  const d=idx===-1?plan[plan.length-1]:plan[idx];
  document.getElementById("view-today").hidden=false;
  document.getElementById("todayBody").innerHTML=`<h3>Day ${d.day}: ${d.title} (${d.hours}h)</h3>`+
    d.questions.map(q=>`<p class="q">• [${q.topic}] ${q.text}</p>`).join("")+
    `<button id="btnDone">Mark Day ${d.day} done</button>`;
  document.getElementById("btnDone").onclick=()=>{d.done=true;save();render();showToday();};
  window.scrollTo(0,document.getElementById("view-today").offsetTop);
}
async function fileToText(file){
  if(file.name.endsWith(".txt")) return await file.text();
  if(file.name.endsWith(".pdf")){
    try{
      const buf=await file.arrayBuffer();
      const pdf=await window.pdfjsLib.getDocument({data:buf}).promise;
      let out="";
      for(let p=1;p<=Math.min(pdf.numPages,10);p++){const pg=await pdf.getPage(p);const tc=await pg.getTextContent();out+=tc.items.map(i=>i.str).join(" ")+"\n";}
      return out;
    }catch(e){ alert("PDF read failed — please paste the text instead."); return ""; }
  }
  return "";
}
document.getElementById("btnGenerate").onclick=()=>{
  const useMath=document.getElementById("subMath").checked;
  const useEng=document.getElementById("subEng").checked;
  const days=+document.getElementById("inDays").value;
  const hours=+document.getElementById("inHours").value;
  const paste=document.getElementById("inPaste").value.split("\n").map(s=>s.trim()).filter(Boolean);
  try{
    plan=generatePlan({useMath,useEng,days,hours,customQuestions:paste});
    save(); render(); showToday();
  }catch(e){alert(e.message);}
};
document.getElementById("btnSample").onclick=()=>{
  document.getElementById("inDays").value=7;
  document.getElementById("btnGenerate").click();
};
document.getElementById("inFile").onchange=async e=>{
  const f=e.target.files[0]; if(!f) return;
  const t=await fileToText(f);
  if(t) document.getElementById("inPaste").value+=(document.getElementById("inPaste").value?"\n":"")+t.slice(0,5000);
};
document.getElementById("btnToday").onclick=showToday;
document.getElementById("btnBack").onclick=()=>{document.getElementById("view-today").hidden=true;};
document.getElementById("btnReset").onclick=()=>{if(confirm("Clear plan?")){plan=[];save();render();document.getElementById("view-today").hidden=true;}};
document.getElementById("btnRebalance").onclick=()=>{
  // carryover: keep done as-is, renumber undone sequentially (no regen)
  let n=1; plan.forEach(d=>{if(d.done){} });
  const undone=plan.filter(d=>!d.done);
  const doneCount=plan.length-undone.length;
  undone.forEach((d,i)=>d.day=doneCount+i+1);
  plan.sort((a,b)=>(a.done-b.done)||(a.day-b.day));
  plan.forEach((d,i)=>d.day=i+1);
  save(); render(); alert("Rebalanced: unfinished days pushed forward in order.");
};
if(typeof window!=="undefined"&&window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
load(); render();
} // end browser-only

// export for quick node sanity test
if(typeof module!=="undefined") module.exports={generatePlan,tagText};
