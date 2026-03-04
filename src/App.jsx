import { useState, useEffect, useRef, useCallback } from "react";
import { listDocs, createDoc, updateDoc_, deleteDoc_, COLS, loginUser, logoutUser, onAuth, getCurrentUser, inviteUser } from "./firebase";
import {
  LayoutDashboard, FolderKanban, Clock3, TrendingUp, Briefcase, CalendarDays,
  Umbrella, Building2, Users2, UserCheck, Bell, Sun, Moon, ChevronRight,
  ChevronLeft, Plus, X, Check, AlertTriangle, Timer, ExternalLink, Search,
  Play, Send, ThumbsUp, ThumbsDown, Info, CheckCircle2, XCircle, AlarmClock,
  Mail, Phone, MapPin, Filter, Edit2, Crown, Shield, Users, Zap, Target,
  Award, Activity, TrendingDown, FileText, ArrowRight, Cake, Star, Layers,
  CalendarPlus, UserCircle, BarChart3, Hash, ChevronDown, Edit,
  Trash2, Link2, Calendar, KanbanSquare, RefreshCw, User, Eye
} from "lucide-react";

// ── EMAIL via Resend ─────────────────────────────────────────────────────────
// Get free API key at resend.com (3000 emails/month free)
// Add your key below and set the from address to a verified domain/email.
const RESEND_KEY = "re_3U7HF8hq_Kr7K2n26JYhL3dPwjvi9gCsU";
const RESEND_FROM = "ProfitPenny Studio OS <no-reply@profitpenny.in>";

async function sendEmail(to_email, to_name, subject, message){
  if(!to_email) return;
  if(!RESEND_KEY||RESEND_KEY==="YOUR_RESEND_API_KEY"||RESEND_KEY.length<10){
    console.warn("Resend not configured — set RESEND_KEY in App.jsx lines 17-18"); return;
  }
  try{
    await fetch("https://api.resend.com/emails",{
      method:"POST",
      headers:{"Authorization":`Bearer ${RESEND_KEY}`,"Content-Type":"application/json"},
      body:JSON.stringify({
        from: RESEND_FROM,
        to: [to_email],
        subject,
        html: `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#f9f9f7;border-radius:12px;">
          <div style="background:#0A0A0A;padding:16px 24px;border-radius:8px;margin-bottom:24px;display:inline-block;">
            <span style="color:#B5D334;font-weight:800;font-size:16px;letter-spacing:-0.02em;">ProfitPenny</span>
            <span style="color:#888;font-size:12px;margin-left:8px;">Studio OS</span>
          </div>
          <p style="color:#444;font-size:14px;line-height:1.8;">${message.replace(/\n/g,"<br/>")}</p>
          <p style="color:#aaa;font-size:12px;margin-top:32px;border-top:1px solid #e0e0e0;padding-top:12px;">This is an automated notification from ProfitPenny Studio OS. Do not reply to this email.</p>
        </div>`
      })
    });
  } catch(e){ console.warn("Resend email error:",e.message); }
}

// ── STYLES ──────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;}
body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{border-radius:99px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
@keyframes ping{0%{transform:scale(1);opacity:1}75%,100%{transform:scale(2);opacity:0}}
@keyframes timerPulse{0%,100%{opacity:1}50%{opacity:0.6}}
@keyframes toastSlide{from{opacity:0;transform:translateX(110%)}to{opacity:1;transform:translateX(0)}}
@keyframes notifPop{0%{transform:scale(1)}30%{transform:scale(1.5)}100%{transform:scale(1)}}
@keyframes countUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes tutorialIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
.fade-up{animation:fadeUp .36s cubic-bezier(.22,1,.36,1) both;}
.scale-in{animation:scaleIn .28s cubic-bezier(.22,1,.36,1) both;}
.hover-lift{transition:transform .18s ease,box-shadow .18s ease;}
.hover-lift:hover{transform:translateY(-2px);}
.btn-press{transition:transform .1s ease,opacity .1s ease;}
.btn-press:active{transform:scale(0.95);}
.row-hover{transition:background .12s ease;}
.timer-active{animation:timerPulse 1.5s ease-in-out infinite;}
.card-actions{opacity:0!important;}
.hover-lift:hover .card-actions{opacity:1!important;}
/* ── RESPONSIVE ── */
@media(max-width:768px){
  .sidebar-desktop{display:none!important;}
  .mobile-nav{display:flex!important;}
  .main-pad{padding:16px 14px!important;}
  .topbar-title{display:none!important;}
  .modal-w{max-width:100%!important;margin:0!important;border-radius:20px 20px 0 0!important;max-height:92vh!important;overflow-y:auto!important;}
  .modal-wrap{align-items:flex-end!important;padding:0!important;}
  .hide-mobile{display:none!important;}
  .grid-1-mobile{grid-template-columns:1fr!important;}
}
@media(max-width:480px){
  .main-pad{padding:12px 10px!important;}
}
/* ── FUN MICRO-INTERACTIONS ── */
@keyframes wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-4deg)}75%{transform:rotate(4deg)}}
@keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.12)}100%{transform:scale(1)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes bounceIn{0%{transform:scale(0.7);opacity:0}60%{transform:scale(1.08)}80%{transform:scale(0.97)}100%{transform:scale(1);opacity:1}}
.btn-fun{transition:transform .15s cubic-bezier(.34,1.56,.64,1),box-shadow .15s ease,background .15s ease!important;}
.btn-fun:hover{transform:translateY(-2px) scale(1.02)!important;}
.btn-fun:active{transform:scale(0.95)!important;}
.nav-item{transition:all .18s cubic-bezier(.34,1.56,.64,1)!important;}
.nav-item:hover{transform:translateX(3px)!important;}
.notif-badge{animation:bounceIn .4s cubic-bezier(.34,1.56,.64,1)!important;}
.row-hover:hover{background:var(--hover-bg,rgba(181,211,52,0.06))!important;transform:translateX(2px);border-color:rgba(181,211,52,0.2)!important;}
.card-fun{transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s ease!important;}
.card-fun:hover{transform:translateY(-3px) scale(1.005)!important;box-shadow:0 8px 30px rgba(0,0,0,0.12)!important;}
`;

// ── TOKENS ───────────────────────────────────────────────────────────────────
const D = {
  light:{dark:false,
    bg:"#F7F7F5",surface:"#FFFFFF",surfaceAlt:"#F2F2F0",hover:"#EBEBEA",
    border:"#E4E4E1",borderMid:"#D0D0CC",
    text:"#0A0A0A",textMid:"#4A4A48",textMuted:"#8A8A87",
    lime:"#B5D334",limeDeep:"#8DAA1A",limeBg:"#F2F9D0",limeMid:"#D8EC7A",
    green:"#16A34A",greenBg:"#DCFCE7",blue:"#2563EB",blueBg:"#DBEAFE",
    amber:"#D97706",amberBg:"#FEF3C7",red:"#DC2626",redBg:"#FEE2E2",
    purple:"#7C3AED",purpleBg:"#EDE9FE",
    sidebar:"#0A0A0A",sideText:"#C8C8C4",sideActive:"#B5D334",sideHover:"#1A1A1A",
    topbar:"#FFFFFF",shadow:"rgba(0,0,0,0.06)",shadowMd:"rgba(0,0,0,0.14)",
    card:"#FFFFFF",scrollThumb:"#D0D0CC",
  },
  dark:{dark:true,
    bg:"#0C0C0A",surface:"#141412",surfaceAlt:"#1C1C1A",hover:"#222220",
    border:"#2A2A27",borderMid:"#383835",
    text:"#F0F0EC",textMid:"#A8A8A4",textMuted:"#5A5A57",
    lime:"#C8E84A",limeDeep:"#9CB82A",limeBg:"#1A200A",limeMid:"#7A9020",
    green:"#4ADE80",greenBg:"#052E16",blue:"#60A5FA",blueBg:"#0A1628",
    amber:"#FCD34D",amberBg:"#1A1200",red:"#F87171",redBg:"#1C0A0A",
    purple:"#A78BFA",purpleBg:"#150B2A",
    sidebar:"#080806",sideText:"#7A7A76",sideActive:"#C8E84A",sideHover:"#141412",
    topbar:"#141412",shadow:"rgba(0,0,0,0.3)",shadowMd:"rgba(0,0,0,0.5)",
    card:"#141412",scrollThumb:"#2A2A27",
  }
};

// ── EMPTY SHELL (populated from Appwrite on load) ────────────────────────────
const INIT = {
  firstLogin: true,
  company:{ name:"ProfitPenny Design Studio" },
  departments:[],
  users:[],
  clients:[],
  tasks:[],
  leaves:[],
  leaveBalances:{},
  meetings:[],
  timeLogs:[],
  notifications:[],
  onboarding:[],
};

const OB_STEPS = [
  {id:"s1",label:"Google Workspace email created"},{id:"s2",label:"Added to Slack workspace"},
  {id:"s3",label:"Google Drive folder access granted"},{id:"s4",label:"PP App account created"},
  {id:"s5",label:"Introduced to team on Slack"},{id:"s6",label:"NDA and employment contract signed"},
  {id:"s7",label:"Design tools licensed"},{id:"s8",label:"Brand guidelines shared"},
  {id:"s9",label:"Client overview briefing done"},{id:"s10",label:"First task allocated and briefed"},
];

// ── UTILS ────────────────────────────────────────────────────────────────────
const fd  = d=>d?new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short"}):"—";
const fdt = d=>d?new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"—";
const isOverdue = d=>d&&new Date(d)<new Date();
const clamp=(n,lo,hi)=>Math.min(hi,Math.max(lo,n));
const SC = s=>({Completed:"green","In Progress":"blue",Review:"amber",Delayed:"red","Not Started":"muted",Pending:"amber",Approved:"green",Rejected:"red"}[s]||"muted");
const PC = p=>({High:"red",Medium:"amber",Low:"green"}[p]||"muted");
const iStyle=t=>({width:"100%",padding:"9px 13px",background:t.surfaceAlt,border:`1.5px solid ${t.border}`,borderRadius:10,color:t.text,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",transition:"border-color .15s"});

// ── HOOKS ────────────────────────────────────────────────────────────────────
function useToast(){
  const [list,setList]=useState([]);
  const add=useCallback((msg,type="success",dur=3200)=>{
    const id=Date.now()+Math.random();
    setList(p=>[...p,{id,msg,type,out:false}]);
    setTimeout(()=>setList(p=>p.map(t=>t.id===id?{...t,out:true}:t)),dur-350);
    setTimeout(()=>setList(p=>p.filter(t=>t.id!==id)),dur);
  },[]);
  return [list,add];
}
function useCountUp(target,dur=700){
  const [v,setV]=useState(0);
  useEffect(()=>{
    let s,f;const tick=ts=>{if(!s)s=ts;const p=Math.min(1,(ts-s)/dur);setV(Math.round((1-Math.pow(1-p,3))*target));if(p<1)f=requestAnimationFrame(tick);};
    f=requestAnimationFrame(tick);return()=>cancelAnimationFrame(f);
  },[target,dur]);
  return v;
}

// ── ATOMS ────────────────────────────────────────────────────────────────────
function Av({init,size=36,t,online=false}){
  return(
    <div style={{position:"relative",flexShrink:0}}>
      <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${t.lime}33,${t.lime}66)`,border:`1.5px solid ${t.lime}55`,color:t.lime,fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:size*.36,display:"flex",alignItems:"center",justifyContent:"center",letterSpacing:"-0.02em"}}>{init}</div>
      {online&&<div style={{position:"absolute",bottom:1,right:1,width:9,height:9,borderRadius:"50%",background:t.green,border:`2px solid ${t.surface}`}}/>}
    </div>
  );
}
function Badge({label,color="muted",t,small=false}){
  const C={green:{bg:t.greenBg,fg:t.green},blue:{bg:t.blueBg,fg:t.blue},amber:{bg:t.amberBg,fg:t.amber},red:{bg:t.redBg,fg:t.red},purple:{bg:t.purpleBg,fg:t.purple},lime:{bg:t.limeBg,fg:t.limeDeep},muted:{bg:t.surfaceAlt,fg:t.textMuted}}[color]||{bg:t.surfaceAlt,fg:t.textMuted};
  return <span style={{display:"inline-flex",alignItems:"center",padding:small?"2px 8px":"4px 11px",borderRadius:99,fontSize:small?9:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",background:C.bg,color:C.fg,whiteSpace:"nowrap",flexShrink:0,border:`1px solid ${C.fg}22`}}>{label}</span>;
}
function Btn({children,onClick,v="primary",t,style={},disabled=false,size="md",icon}){
  const base={display:"inline-flex",alignItems:"center",gap:6,borderRadius:99,fontFamily:"'DM Sans',sans-serif",fontWeight:700,cursor:disabled?"not-allowed":"pointer",border:"none",transition:"all .18s cubic-bezier(.34,1.56,.64,1)",opacity:disabled?.45:1,padding:size==="sm"?"5px 14px":size==="lg"?"13px 28px":"8px 20px",fontSize:size==="sm"?12:13,letterSpacing:"0.01em"};
  const V={primary:{background:t.text,color:t.bg},lime:{background:t.lime,color:"#0A0A0A"},secondary:{background:t.surfaceAlt,color:t.textMid,border:`1px solid ${t.border}`},ghost:{background:"transparent",color:t.textMuted},danger:{background:t.redBg,color:t.red,border:`1px solid ${t.red}30`},success:{background:t.greenBg,color:t.green,border:`1px solid ${t.green}40`},outline:{background:"transparent",color:t.lime,border:`1.5px solid ${t.lime}`}};
  return <button className="btn-press" onClick={disabled?undefined:onClick} disabled={disabled} style={{...base,...(V[v]||V.secondary),...style}}>{icon&&<span style={{display:"flex"}}>{icon}</span>}{children}</button>;
}
function Card({children,t,style={},lift=false,onClick,pad=20}){
  return <div className={(lift?"hover-lift ":"")+(onClick?"card-fun":"")} onClick={onClick} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:18,padding:pad,cursor:onClick?"pointer":"default",boxShadow:`0 2px 8px ${t.shadow}`,transition:"border-color .15s,box-shadow .18s",...style}}>{children}</div>;
}
function PBar({value,max=100,color="lime",t,h=5,delay=0,showPct=true}){
  const pct=clamp(max>0?Math.round((value/max)*100):0,0,100);
  const clrMap={lime:t.lime,green:t.green,blue:t.blue,amber:t.amber,red:t.red};
  const clr=clrMap[color]||t.lime;
  const [w,setW]=useState(0);
  useEffect(()=>{const id=setTimeout(()=>setW(pct),delay+60);return()=>clearTimeout(id);},[pct,delay]);
  return(
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{flex:1,height:h,background:t.surfaceAlt,borderRadius:h,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${w}%`,background:clr,borderRadius:h,transition:`width .7s cubic-bezier(.22,1,.36,1) ${delay}ms`}}/>
      </div>
      {showPct&&<span style={{fontSize:11,fontWeight:700,color:clr,minWidth:30,textAlign:"right",fontFamily:"'Poppins',sans-serif"}}>{pct}%</span>}
    </div>
  );
}
function Inp({value,onChange,placeholder,type="text",t,style={}}){return <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{...iStyle(t),...style}} onFocus={e=>e.target.style.borderColor=t.lime} onBlur={e=>e.target.style.borderColor=t.border}/>;}
function Sel({value,onChange,children,t}){return <select value={value} onChange={onChange} style={{...iStyle(t),cursor:"pointer"}}>{children}</select>;}
// Smart department selector with inline "+Add New Department" option
function DeptSel({value,onChange,data,setData,t,toast,placeholder="Select dept."}){
  const [adding,setAdding]=useState(false);
  const [newName,setNewName]=useState("");
  const handleChange=e=>{
    if(e.target.value==="__ADD__"){setAdding(true);return;}
    onChange(e.target.value);
  };
  const save=()=>{
    if(!newName.trim())return;
    const id="d"+Date.now();
    if(setData) setData(d=>({...d,departments:[...d.departments,{id,name:newName,color:"#B5D334",managerId:"",hodId:""}]}));
    onChange(id);
    setAdding(false);setNewName("");
    if(toast) toast(`Department "${newName}" created`,"success");
  };
  if(adding) return(
    <div style={{display:"flex",gap:6}}>
      <input autoFocus value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&save()} placeholder="Department name" style={iStyle(t)}/>
      <Btn v="lime" t={t} size="sm" onClick={save}><Check size={12}/></Btn>
      <Btn v="ghost" t={t} size="sm" onClick={()=>setAdding(false)}><X size={12}/></Btn>
    </div>
  );
  return(
    <select value={value} onChange={handleChange} style={{...iStyle(t),cursor:"pointer"}}>
      <option value="">{placeholder}</option>
      {(data?.departments||[]).map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
      <option value="__ADD__">+ Add New Department</option>
    </select>
  );
}
function Tex({value,onChange,placeholder,t,rows=3}){return <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{...iStyle(t),resize:"vertical"}} onFocus={e=>e.target.style.borderColor=t.lime} onBlur={e=>e.target.style.borderColor=t.border}/>;}
function Field({label,children,t}){return <div style={{marginBottom:14}}><label style={{display:"block",fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:t.textMuted,marginBottom:6}}>{label}</label>{children}</div>;}
function Modal({open,onClose,title,children,t,w=560,subtitle}){
  useEffect(()=>{if(open){document.body.style.overflow="hidden";document.body.style.position="fixed";document.body.style.width="100%";}else{document.body.style.overflow="";document.body.style.position="";document.body.style.width="";}return()=>{document.body.style.overflow="";document.body.style.position="";document.body.style.width="";};},[open]);
  if(!open)return null;
  return(
    <div onClick={onClose} className="modal-wrap" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",backdropFilter:"blur(6px)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn .18s ease",overflow:"hidden"}} onWheel={e=>e.stopPropagation()} onTouchMove={e=>e.stopPropagation()}>
      <div onClick={e=>e.stopPropagation()} className="scale-in modal-w" style={{background:t.surface,borderRadius:20,border:`1px solid ${t.border}`,width:"100%",maxWidth:w,maxHeight:"92vh",overflowY:"auto",overflowX:"hidden",overscrollBehavior:"contain",boxShadow:`0 24px 80px ${t.shadowMd}`,padding:28}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${t.border}`}}>
          <div><h3 style={{margin:0,fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:18,color:t.text}}>{title}</h3>{subtitle&&<p style={{margin:"4px 0 0",fontSize:13,color:t.textMuted}}>{subtitle}</p>}</div>
          <button onClick={onClose} style={{background:"none",border:`1px solid ${t.border}`,borderRadius:8,width:32,height:32,cursor:"pointer",color:t.textMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginLeft:12,transition:"all .14s"}} onMouseEnter={e=>{e.currentTarget.style.background=t.surfaceAlt;}} onMouseLeave={e=>{e.currentTarget.style.background="none";}}><X size={15}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}
function SHead({title,sub,action,t}){
  return(
    <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:24,animation:"fadeUp .3s both"}}>
      <div>
        <h2 style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:24,letterSpacing:"-0.02em",color:t.text,margin:0,lineHeight:1.1}}>{title}</h2>
        {sub&&<p style={{fontSize:13,color:t.textMuted,margin:"5px 0 0"}}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}
function StatCard({label,value,sub,color="lime",icon:Icon,t,delay=0,onClick}){
  const clrMap={lime:t.lime,green:t.green,blue:t.blue,amber:t.amber,red:t.red,text:t.text};
  const clr=clrMap[color]||t.lime;
  const n=useCountUp(typeof value==="number"?value:0);
  return(
    <Card t={t} onClick={onClick} style={{animation:`fadeUp .42s cubic-bezier(.22,1,.36,1) ${delay}ms both`,overflow:"hidden",position:"relative",cursor:onClick?"pointer":"default"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:clr,borderRadius:"16px 16px 0 0"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <span style={{fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:t.textMuted}}>{label}</span>
        {Icon&&<div style={{width:30,height:30,borderRadius:8,background:t.surfaceAlt,display:"flex",alignItems:"center",justifyContent:"center",color:clr}}><Icon size={15}/></div>}
      </div>
      <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:40,color:clr,lineHeight:1,letterSpacing:"-0.02em",animation:`countUp .5s ${delay+100}ms both`}}>{typeof value==="number"?n:value}</div>
      {sub&&<div style={{fontSize:12,color:t.textMuted,marginTop:6}}>{sub}</div>}
    </Card>
  );
}
function Toasts({list}){
  const ico={success:<CheckCircle2 size={15}/>,error:<XCircle size={15}/>,info:<Info size={15}/>,warning:<AlertTriangle size={15}/>};
  const clr={success:"#16A34A",error:"#DC2626",info:"#2563EB",warning:"#D97706"};
  return(
    <div style={{position:"fixed",bottom:24,right:24,zIndex:9999,display:"flex",flexDirection:"column",gap:8}}>
      {list.map(t2=>(
        <div key={t2.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 18px",borderRadius:12,maxWidth:320,background:"#0A0A0A",color:"#F0F0EC",fontSize:13,fontWeight:500,boxShadow:"0 8px 32px rgba(0,0,0,.4)",animation:t2.out?"fadeIn .3s reverse forwards":"toastSlide .32s cubic-bezier(.22,1,.36,1) both",borderLeft:`3px solid ${clr[t2.type]||clr.success}`}}>
          <span style={{color:clr[t2.type]||clr.success}}>{ico[t2.type]||ico.success}</span>{t2.msg}
        </div>
      ))}
    </div>
  );
}
function LiveTimer({startedAt,t,active}){
  const [s,setS]=useState(0);
  useEffect(()=>{if(!startedAt||!active)return;const u=()=>setS(Math.floor((Date.now()-new Date(startedAt).getTime())/1000));u();const id=setInterval(u,1000);return()=>clearInterval(id);},[startedAt,active]);
  const fmt=n=>String(n).padStart(2,"0");
  return <span className={active?"timer-active":""} style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:12,color:active?t.lime:t.textMuted,letterSpacing:"0.06em"}}>{fmt(Math.floor(s/3600))}:{fmt(Math.floor((s%3600)/60))}:{fmt(s%60)}</span>;
}
function PPLogo({collapsed}){
  const fg="#FFFFFF",lime="#C8E84A";
  if(collapsed)return <svg viewBox="0 0 40 40" style={{width:32,height:32}} xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="10" fill={lime}/><text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" fill="#0A0A0A" fontFamily="Poppins,sans-serif" fontWeight="800" fontSize="16">PP</text></svg>;
  return(
    <svg viewBox="0 0 627.1 244.1" style={{height:32,width:"auto",maxWidth:200}} xmlns="http://www.w3.org/2000/svg">
      <path fill={fg} d="M44.6,0c22.3,0,40.3,18.1,40.3,40.3s-18,40.4-40.3,40.4h-19.7v31.6H0V0h44.6ZM24.9,55.8h19.9c8.5,0,15.4-6.7,15.4-15.6s-6.9-15.4-15.4-15.4h-19.9v31Z"/>
      <path fill={fg} d="M171.8,74.6l22,37.7h-28.4l-18.6-31.6h-15.6v31.6h-24.9V0h44.6c22.3,0,40.3,18.1,40.3,40.3s-7.9,27-19.4,34.3h0ZM131.2,55.8h19.9c8.5,0,15.4-6.7,15.4-15.6s-6.9-15.4-15.4-15.4h-19.9v31Z"/>
      <path fill={fg} d="M381.7,0c16.8,0,30.6,13.6,30.6,30.6v51c0,17-13.8,30.6-30.6,30.6h-135.9c-17,0-30.6-13.6-30.6-30.6V30.6c0-17,13.6-30.6,30.6-30.6h135.9ZM387.3,30.3c0-3.2-2.4-5.4-5.5-5.4h-136.3c-2.9,0-5.4,2.2-5.4,5.5v51.7c0,3.2,2.6,5.6,5.4,5.6h136.3c3,0,5.5-2.4,5.5-5.6V30.3Z"/>
      <path fill={fg} d="M449.9,24.9v11.4h33v24.5h-33v51.5h-24.9V0h71.5v24.9h-46.7Z"/>
      <path fill={fg} d="M507.1,112.3V0h24.9v112.3h-24.9Z"/>
      <path fill={fg} d="M627.1,0v24.9h-30.2v87.4h-24.7V24.9h-30.2V0h85,0Z"/>
      <path fill={fg} d="M44.6,131.8c22.3,0,40.3,18.1,40.3,40.3s-18,40.4-40.3,40.4h-19.7v31.6H0v-112.3h44.6ZM24.9,187.7h19.9c8.5,0,15.4-6.7,15.4-15.6s-6.9-15.4-15.4-15.4h-19.9v31Z"/>
      <path fill={fg} d="M168.9,219.2v24.9h-71.5v-112.3h67v24.9h-42.2v9.5h33v24.9h-33v28.2h46.7Z"/>
      <path fill={fg} d="M326.4,131.8v112.3h-42.4v-39.8l-60.1-35.4v75.2h-42.4v-112.3h30.1c5.7,0,10.9,1.4,14.8,3.7l57.7,34v-37.7h42.4Z"/>
      <path fill={fg} d="M377.9,131.8v37.7l57.7-34c3.8-2.2,9-3.7,14.8-3.7h30.1v112.3h-42.4v-75.2l-60.1,35.4v39.8h-42.4v-112.3h42.4Z"/>
      <circle fill={lime} cx="275.4" cy="56.1" r="16.3"/>
      <path fill={lime} d="M351.1,57.4c3.2,0,5.9,1.9,7.1,4.6.9,1.9,2.8,3.2,4.9,3.2h0c3.9,0,6.4-4,4.8-7.5-2.9-6.4-9.4-10.9-16.9-10.9s-14,4.5-16.9,10.9c-1.6,3.5,1,7.5,4.8,7.5h0c2.1,0,4-1.3,4.9-3.2,1.2-2.7,4-4.6,7.1-4.6h0Z"/>
      <rect fill={fg} x="593.2" y="209.2" width="34" height="33.9" rx="17" ry="17"/>
      <path fill={fg} d="M610.7,128.9l-27.2,93.3c-3.8,12.5-15.2,20.9-27.7,20.9h-64.6v-25.9h64.5c1.5,0,3.1-1,3.6-2.2.5-.5,1-1.5,1-2.2h-6.3l-25-83.9h26l14.2,49.3h1.5l13.9-49.3h26.2Z"/>
    </svg>
  );
}

// ── TUTORIAL ─────────────────────────────────────────────────────────────────
// ── PER-PAGE TIPS ─────────────────────────────────────────────────────────────
const PAGE_TIPS={
  dashboard:{title:"Dashboard",tip:"This is your mission control. See all active tasks, pending leaves, upcoming deadlines, and team performance at a glance. Click any item to jump straight to it."},
  projects:{title:"Projects",tip:"All tasks live here. Create a task, assign it to a team member, set a deadline, and add asset links. Click 'Start Task' on a task to begin time tracking automatically. The Founder can skip setting a deadline and let the HoD propose one."},
  board:{title:"My Board",tip:"A Kanban view of all tasks grouped by status. Drag cards across columns to update task status instantly. Great for a quick daily standup view."},
  calendar:{title:"Calendar",tip:"See all task deadlines, approved leaves, and company holidays in one place. Toggle between Tasks, Leaves, and Holidays using the filter buttons."},
  timelogs:{title:"Time Logs",tip:"Track how many hours the team spends on each task. Time is auto-logged when you start a task in Projects. You can also add manual log entries here. Each task gets a performance grade once completed."},
  efficiency:{title:"Deadline Efficiency",tip:"See how well the team meets deadlines, broken down by person. Filter by department or client to drill down into performance data."},
  clients:{title:"Clients",tip:"Manage your client relationships. Add POCs (Points of Contact), asset/reference links, and track happiness scores. Each time a deadline is met or missed it automatically affects the score."},
  meetings:{title:"Meetings",tip:"Log client meetings, record minutes of meeting (MoM), and track action items. Each meeting gets a Google Calendar link generated automatically."},
  leaves:{title:"Leaves",tip:"Team members apply for leave here. The HoD gets notified and can approve or reject. Approved leaves are reflected in the Calendar and show a warning when assigning tasks on those days."},
  departments:{title:"Departments",tip:"Set up your company structure. Each department has a Head of Department (HoD) who manages leave approvals, deadline proposals, and extension requests for their team."},
  team:{title:"Team",tip:"Add team members and assign them to departments. Birthday reminders are sent automatically. You can edit or remove members at any time."},
  onboarding:{title:"Onboarding",tip:"Track the onboarding progress of new team members through a step-by-step checklist. Each step can be checked off as completed."},
  notifications:{title:"Notifications",tip:"All approvals, alerts, and reminders land here. Click any notification to jump directly to the action it's referring to. Unread notifications also appear as a badge on the sidebar."},
};

function PageTip({nav,t}){
  const [vis,setVis]=useState(true);
  const tip=PAGE_TIPS[nav];
  if(!tip||!vis)return null;
  return(
    <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"11px 15px",background:t.limeBg,border:`1px solid ${t.lime}30`,borderRadius:12,marginBottom:18,animation:"fadeUp .35s both"}}>
      <div style={{width:30,height:30,borderRadius:9,background:t.lime+"33",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}><Info size={15} color={t.limeDeep}/></div>
      <div style={{flex:1}}>
        <div style={{fontWeight:700,fontSize:13,color:t.text,marginBottom:3}}>{tip.title}</div>
        <div style={{fontSize:12,color:t.textMid,lineHeight:1.65}}>{tip.tip}</div>
      </div>
      <button onClick={()=>setVis(false)} style={{background:"none",border:"none",cursor:"pointer",color:t.textMuted,padding:2,borderRadius:5,display:"flex",flexShrink:0}} title="Dismiss"><X size={13}/></button>
    </div>
  );
}

const TUTORIAL_STEPS = [
  {icon:<Star size={28}/>,title:"Welcome to ProfitPenny Studio OS",body:"Your all-in-one workspace for managing projects, clients, team, and time — built for ProfitPenny. Let's take a quick tour.",color:"lime"},
  {icon:<FolderKanban size={28}/>,title:"Projects",body:"Every client task lives here. Start a task and time logging begins automatically. Request deadline extensions and get HoD approval — all in one place.",color:"blue"},
  {icon:<Building2 size={28}/>,title:"Departments & Team",body:"Set up your company structure — departments, Heads of Department, and team members. Leave and extension approvals are automatically routed to the right HoD.",color:"purple"},
  {icon:<Umbrella size={28}/>,title:"Leaves",body:"Team members apply for leave here. HoD gets an in-app notification and email. Approve, reject, or modify — same for deadline extensions.",color:"amber"},
  {icon:<Bell size={28}/>,title:"Notifications",body:"Every approval request, deadline miss, and birthday reminder lands here. Click any notification to go directly to the relevant action.",color:"red"},
  {icon:<Zap size={28}/>,title:"You're all set!",body:"Your data is live. Go explore — and remember, just describe any change you want and your developer (Claude) will update the app for you.",color:"lime"},
];

function Tutorial({t,onClose}){
  const [step,setStep]=useState(0);
  const s=TUTORIAL_STEPS[step];
  const clrMap={lime:t.lime,blue:t.blue,amber:t.amber,red:t.red,purple:t.purple};
  const clr=clrMap[s.color]||t.lime;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",backdropFilter:"blur(6px)",zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:t.surface,borderRadius:24,width:"100%",maxWidth:480,padding:36,boxShadow:`0 32px 100px ${t.shadowMd}`,animation:"tutorialIn .4s cubic-bezier(.22,1,.36,1) both",border:`1px solid ${t.border}`,textAlign:"center"}}>
        <div style={{width:72,height:72,borderRadius:20,background:clr+"22",border:`2px solid ${clr}40`,display:"flex",alignItems:"center",justifyContent:"center",color:clr,margin:"0 auto 20px"}}>{s.icon}</div>
        <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:20,color:t.text,marginBottom:12,lineHeight:1.2}}>{s.title}</div>
        <div style={{fontSize:14,color:t.textMid,lineHeight:1.7,marginBottom:28}}>{s.body}</div>
        {/* progress dots */}
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:24}}>
          {TUTORIAL_STEPS.map((_,i)=>(
            <div key={i} style={{width:i===step?24:8,height:8,borderRadius:99,background:i===step?clr:t.border,transition:"all .3s ease"}}/>
          ))}
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          {step>0&&<Btn v="secondary" t={t} onClick={()=>setStep(p=>p-1)}>Back</Btn>}
          {step<TUTORIAL_STEPS.length-1
            ?<Btn v="lime" t={t} onClick={()=>setStep(p=>p+1)}>Next <ArrowRight size={14}/></Btn>
            :<Btn v="lime" t={t} onClick={onClose}>Get Started <Zap size={14}/></Btn>}
          {step<TUTORIAL_STEPS.length-1&&<Btn v="ghost" t={t} onClick={onClose}>Skip</Btn>}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGES
// ══════════════════════════════════════════════════════════════════════════════

// ── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({t,data,go}){
  const tasks=data.tasks;
  const total=tasks.length,comp=tasks.filter(x=>x.status==="Completed").length;
  const delayed=tasks.filter(x=>x.status==="Delayed").length;
  const inProg=tasks.filter(x=>x.status==="In Progress").length;
  const pendLeaves=data.leaves.filter(x=>x.status==="Pending").length;
  const today=new Date();
  const upcoming=[...data.meetings].filter(m=>new Date(m.date)>=today).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const cName=id=>data.clients.find(c=>c.id===id)?.name||"—";
  const uName=id=>data.users.find(u=>u.id===id)?.name||"—";
  const uAv=id=>data.users.find(u=>u.id===id)?.av||"??";

  // Birthday check
  const todayStr=`${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  const bdays=data.users.filter(u=>u.dob&&u.dob.slice(5)===todayStr);

  return(
    <div>
      <SHead t={t} title="Studio Dashboard" sub={today.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}/>
      {bdays.length>0&&(
        <div style={{marginBottom:16,padding:"12px 18px",background:t.amberBg,border:`1px solid ${t.amber}40`,borderRadius:14,display:"flex",alignItems:"center",gap:12,animation:"fadeUp .3s both"}}>
          <Cake size={20} color={t.amber}/>
          <span style={{fontSize:13,fontWeight:600,color:t.amber}}>🎂 Birthday today: {bdays.map(u=>u.name).join(", ")} — don't forget to wish them!</span>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:22}}>
        <StatCard label="Total Tasks"   value={total}      icon={FolderKanban} color="text"  t={t} delay={0}   onClick={()=>go("projects")}/>
        <StatCard label="Completed"     value={comp}       icon={CheckCircle2} color="green" t={t} delay={50}  onClick={()=>go("projects")}/>
        <StatCard label="In Progress"   value={inProg}     icon={Activity}     color="blue"  t={t} delay={100} onClick={()=>go("projects")}/>
        <StatCard label="Delayed"       value={delayed}    icon={AlertTriangle}color="red"   t={t} delay={150} onClick={()=>go("projects")}/>
        <StatCard label="Pending Leaves"value={pendLeaves} icon={Umbrella}     color="amber" t={t} delay={200} onClick={()=>go("leaves")}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:16,marginBottom:16}}>
        <Card t={t} style={{animation:"fadeUp .4s .1s both"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:14,color:t.text,margin:0}}>Active Tasks</h3>
            <button onClick={()=>go("projects")} style={{fontSize:12,color:t.lime,background:"none",border:"none",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>View all <ArrowRight size={12}/></button>
          </div>
          {tasks.filter(x=>x.status!=="Completed").slice(0,5).map((task,i)=>(
            <div key={task.id} className="row-hover" onClick={()=>go("projects")} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",background:t.surfaceAlt,borderRadius:10,marginBottom:7,cursor:"pointer",animation:`fadeUp .3s ${i*35}ms both`}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.title}</div>
                <div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{cName(task.cId)} · Due {fd(task.due)}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:10}}>
                {task.status==="In Progress"&&task.startedAt&&<LiveTimer startedAt={task.startedAt} t={t} active/>}
                <Badge label={task.status} color={SC(task.status)} t={t}/>
              </div>
            </div>
          ))}
        </Card>
        <Card t={t} style={{animation:"fadeUp .4s .18s both"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:14,color:t.text,margin:0}}>Client Happiness</h3>
            <button onClick={()=>go("clients")} style={{fontSize:12,color:t.lime,background:"none",border:"none",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>View all <ArrowRight size={12}/></button>
          </div>
          {data.clients.map((c,i)=>(
            <div key={c.id} onClick={()=>go("clients")} style={{marginBottom:14,cursor:"pointer",animation:`fadeUp .3s ${i*55}ms both`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:13,fontWeight:500,color:t.text}}>{c.name.split(" ").slice(0,2).join(" ")}</span>
                <span style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:16,color:c.score>=80?t.green:c.score>=65?t.amber:t.red}}>{c.score}%</span>
              </div>
              <PBar value={c.score} max={100} color={c.score>=80?"green":c.score>=65?"amber":"red"} t={t} delay={i*70}/>
            </div>
          ))}
        </Card>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card t={t} style={{animation:"fadeUp .4s .24s both"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:14,color:t.text,margin:0}}>Upcoming Meetings</h3>
            <button onClick={()=>go("meetings")} style={{fontSize:12,color:t.lime,background:"none",border:"none",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>View all <ArrowRight size={12}/></button>
          </div>
          {upcoming.length===0?<p style={{color:t.textMuted,fontSize:13}}>No upcoming meetings.</p>
            :upcoming.slice(0,3).map((m,i)=>(
              <div key={m.id} onClick={()=>go("meetings")} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"9px 0",borderBottom:i<upcoming.length-1?`1px solid ${t.border}`:"none",cursor:"pointer",animation:`fadeUp .3s ${i*45}ms both`}}>
                <div style={{flexShrink:0,textAlign:"center",width:40}}>
                  <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:22,color:t.lime,lineHeight:1}}>{new Date(m.date).getDate()}</div>
                  <div style={{fontSize:10,fontWeight:600,color:t.textMuted,textTransform:"uppercase"}}>{new Date(m.date).toLocaleDateString("en-IN",{month:"short"})}</div>
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:t.text}}>{cName(m.cId)}</div>
                  <div style={{fontSize:11,color:t.textMuted}}>{m.time} · {m.loc}</div>
                </div>
              </div>
          ))}
        </Card>
        <Card t={t} style={{animation:"fadeUp .4s .3s both"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:14,color:t.text,margin:0}}>Needs Approval</h3>
            <button onClick={()=>go("leaves")} style={{fontSize:12,color:t.lime,background:"none",border:"none",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>Review <ArrowRight size={12}/></button>
          </div>
          {[...data.leaves.filter(l=>l.status==="Pending"),...data.tasks.filter(tk=>tk.extRequest?.status==="Pending")].length===0
            ?<p style={{color:t.textMuted,fontSize:13}}>All clear — nothing pending.</p>
            :data.leaves.filter(l=>l.status==="Pending").map((lv,i)=>{
              const u=data.users.find(u=>u.id===lv.uId);
              return(
                <div key={lv.id} onClick={()=>go("leaves")} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${t.border}`,cursor:"pointer"}}>
                  <Av init={u?.av||"?"} size={30} t={t}/>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{u?.name}</div><div style={{fontSize:11,color:t.textMuted}}>{lv.type} · {fd(lv.from)}–{fd(lv.to)}</div></div>
                  <Badge label="Leave" color="amber" t={t} small/>
                </div>
              );
            })}
        </Card>
      </div>
    </div>
  );
}

// ── HoD DEADLINE PROPOSAL (shown inside task modal to HoD) ───────────────────
function HoDDeadlineProposal({sel,setSel,data,setData,uName,t,toast}){
  const [proposed,setProposed]=useState({due:"",note:""});
  const submit=()=>{
    if(!proposed.due){toast("Enter a proposed date","error");return;}
    const founder=data.users.find(u=>u.role==="Admin"||u.role==="Founder");
    setData(d=>({...d,
      tasks:d.tasks.map(tk=>tk.id===sel.id?{...tk,deadlineProposal:{due:proposed.due,note:proposed.note,status:"Pending"}}:tk),
      notifications:[...d.notifications,{id:"n"+Date.now(),type:"deadline_proposal",title:"📅 Deadline Proposed",body:`HoD proposed ${fd(proposed.due)} for "${sel.title}"`,to:founder?.id||"",from:"hod",ref:sel.id,refType:"task",read:false,at:new Date().toISOString()}]
    }));
    if(founder) sendEmail(founder.email,founder.name,"Deadline Proposed: "+sel.title,`Your HoD has proposed a deadline of ${fd(proposed.due)} for the task "${sel.title}".\n\nNote: ${proposed.note||"None"}\n\nPlease review and approve in the app.`);
    setSel(p=>({...p,deadlineProposal:{due:proposed.due,note:proposed.note,status:"Pending"}}));
    toast("Deadline proposed — Founder notified");
  };
  return(
    <div style={{padding:"13px 15px",background:t.amberBg,borderRadius:12,marginBottom:14,border:`1px solid ${t.amber}30`}}>
      <div style={{fontWeight:700,fontSize:13,color:t.amber,marginBottom:10}}>{sel.deadlineProposal?.status==="Rejected"?"🔄 Propose a new deadline":sel.deadlineProposal?.status==="CounterProposed"?"📅 Founder counter-proposed — enter your response":"📅 Propose a deadline for this task"}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <Field label="Proposed Date *" t={t}><Inp type="date" value={proposed.due} onChange={e=>setProposed(p=>({...p,due:e.target.value}))} t={t}/></Field>
        <Field label="Note to Founder" t={t}><Inp value={proposed.note} onChange={e=>setProposed(p=>({...p,note:e.target.value}))} placeholder="Any context..." t={t}/></Field>
      </div>
      <Btn v="lime" t={t} size="sm" icon={<Send size={11}/>} onClick={submit}>Submit Proposal</Btn>
    </div>
  );
}

// ── STATUS BUTTONS ───────────────────────────────────────────────────────────
const STATUS_CFG_MAP={"In Progress":{activeColor:"#60A5FA",activeBg:"#1D4ED825",activeBorder:"#3B82F6",inactiveColor:"#4A90D9",inactiveBorder:"#3B82F640"},"Review":{activeColor:"#FBB040",activeBg:"#92400E25",activeBorder:"#F59E0B",inactiveColor:"#C8913A",inactiveBorder:"#F59E0B40"},"Completed":{activeColor:"#4ADE80",activeBg:"#14532D25",activeBorder:"#22C55E",inactiveColor:"#3AAD60",inactiveBorder:"#22C55E40"},"Delayed":{activeColor:"#F87171",activeBg:"#7F1D1D25",activeBorder:"#EF4444",inactiveColor:"#C05050",inactiveBorder:"#EF444440"}};
function StatusButtons({sel,updStatus,t}){
  return <>
    {["In Progress","Review","Completed","Delayed"].map(st=>{
      const cfg=STATUS_CFG_MAP[st]||{activeColor:t.lime,activeBg:t.limeBg,activeBorder:t.lime,inactiveColor:t.textMuted,inactiveBorder:t.border};
      const active=sel.status===st;
      return <button key={st} onClick={()=>updStatus(sel.id,st)} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:9,border:`1.5px solid ${active?cfg.activeBorder:cfg.inactiveBorder}`,background:active?cfg.activeBg:t.surfaceAlt,color:active?cfg.activeColor:cfg.inactiveColor,fontSize:12,fontWeight:active?700:500,cursor:"pointer",transition:"all .15s"}}>
        {active&&<Check size={10}/>} {st}
      </button>;
    })}
  </>;
}

// ── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects({t,data,setData,toast,currentUser,pendingTaskId,clearPendingTask}){
  const isFounder=currentUser?.role==="Founder"||currentUser?.role==="Admin";
  const isHoD=currentUser?.role==="HoD"||currentUser?.role==="Head of Department"||currentUser?.role==="Manager";
  const isMember=!isFounder&&!isHoD;
  const [filterStatus,setFilterStatus]=useState("All");
  const [filterClient,setFilterClient]=useState("All");
  const [filterDept,setFilterDept]=useState("All");
  const [filterMember,setFilterMember]=useState("All");
  const [filterDate,setFilterDate]=useState("All");
  const [customDate,setCustomDate]=useState("");
  const [search,setSearch]=useState("");
  const [showAdd,setShowAdd]=useState(false);
  const [sel,setSel]=useState(null);
  const [showExt,setShowExt]=useState(false);
  const [extForm,setExtForm]=useState({reason:"",newDue:""});
  const [counterDate,setCounterDate]=useState("");
  const [form,setForm]=useState({title:"",cId:"",aId:"",deptId:"",priority:"Medium",due:"",dueTime:"09:00",brief:"",drive:"",est:"",assetLinks:[""],noDeadline:false});
  const [dueWarn,setDueWarn]=useState("");
  useEffect(()=>{
    if(pendingTaskId&&data.tasks.length>0){
      const task=data.tasks.find(tk=>tk.id===pendingTaskId);
      if(task){setFilterStatus("All");setFilterClient("All");setFilterDept("All");setFilterMember("All");setFilterDate("All");setSearch("");setSel(task);}
      if(clearPendingTask) clearPendingTask();
    }
  },[pendingTaskId]);
  const [newSubtask,setNewSubtask]=useState({title:"",brief:"",aId:"",due:"",dueTime:"",est:"",deptId:"",drive:"",refLink:""});

  const uName=id=>data.users.find(u=>u.id===id)?.name||"—";
  const cName=id=>data.clients.find(c=>c.id===id)?.name||"—";

  // Auto-select dept when assignee chosen (only if user is in exactly 1 dept)
  const handleAssign=aId=>{
    const user=data.users.find(u=>u.id===aId);
    const userDepts=data.departments.filter(d=>data.users.find(u=>u.id===aId)&&user?.dept===d.id);
    setForm(p=>({...p,aId,deptId:user?.dept||p.deptId}));
  };

  // Warn on Sundays, Saturdays, or if assignee is on approved leave
  const checkDue=date=>{
    if(!date){setDueWarn("");return;}
    const d=new Date(date);
    if(d.getDay()===0){setDueWarn("⚠ Sunday — are you sure?");return;}
    if(d.getDay()===6){setDueWarn("⚠ Saturday — are you sure?");return;}
    if(form.aId){
      const leave=data.leaves.find(l=>l.uId===form.aId&&l.status==="Approved"&&date>=l.from&&date<=l.to);
      if(leave){setDueWarn(`⚠ ${uName(form.aId)} is on leave this day`);return;}
    }
    setDueWarn("");
  };

  const today=new Date().toISOString().split("T")[0];
  const tomorrow=new Date(Date.now()+86400000).toISOString().split("T")[0];

  // Role-based task filtering: members only see their own tasks; HoD sees dept tasks
  const visibleTasks=data.tasks.filter(tk=>{
    if(isFounder) return true;
    if(isHoD) return data.users.find(u=>u.id===tk.aId)?.dept===currentUser?.dept;
    return tk.aId===currentUser?.id; // member sees only their own
  });

  const filtered=visibleTasks.filter(tk=>{
    if(filterStatus!=="All"&&tk.status!==filterStatus)return false;
    if(filterClient!=="All"&&tk.cId!==filterClient)return false;
    if(filterDept!=="All"&&tk.deptId!==filterDept)return false;
    if(filterMember!=="All"&&tk.aId!==filterMember)return false;
    if(filterDate==="today"&&tk.due!==today)return false;
    if(filterDate==="tomorrow"&&tk.due!==tomorrow)return false;
    if(filterDate==="custom"&&customDate&&tk.due!==customDate)return false;
    if(search&&!tk.title.toLowerCase().includes(search.toLowerCase())&&!cName(tk.cId).toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });

  const startTask=id=>{
    setData(d=>{
      const tasks=d.tasks.map(tk=>tk.id===id?{...tk,status:"In Progress",startedAt:tk.startedAt||new Date().toISOString()}:tk);
      const task=tasks.find(tk=>tk.id===id);
      if(task&&task.due){
        const assignee=d.users.find(u=>u.id===task.aId);
        if(assignee?.email){
          const now=Date.now();
          const created=new Date(task.created||now).getTime();
          const deadline=new Date(task.due+(task.dueTime?" "+task.dueTime:"")).getTime();
          const totalMs=deadline-created;
          if(totalMs>0){
            // Email at 80% of deadline elapsed
            const ms80=created+(totalMs*0.8)-now;
            if(ms80>0) setTimeout(()=>{
              sendEmail(assignee.email,assignee.name,"⚠ 80% of your deadline has passed: "+task.title,
                `Hi ${assignee.name},\n\n80% of the time has passed for your task "${task.title}".\n\nDeadline: ${new Date(deadline).toLocaleString("en-IN")}\n\nPlease ensure you're on track. If you need an extension, request it from the app now.\n\n— ProfitPenny Studio OS`);
            },ms80);
            // Email at 90% of deadline elapsed
            const ms90=created+(totalMs*0.9)-now;
            if(ms90>0) setTimeout(()=>{
              sendEmail(assignee.email,assignee.name,"🚨 90% of your deadline has passed: "+task.title,
                `Hi ${assignee.name},\n\n90% of the time has passed for your task "${task.title}".\n\nDeadline: ${new Date(deadline).toLocaleString("en-IN")}\n\nOnly 10% of time remaining! Complete or request an extension immediately.\n\n— ProfitPenny Studio OS`);
            },ms90);
          }
        }
      }
      return {...d,tasks};
    });
    toast("Task started — time tracking active","success");
  };
  const updStatus=(id,s)=>{
    const today=new Date().toISOString().split("T")[0];
    setData(d=>({...d,tasks:d.tasks.map(tk=>{if(tk.id!==id)return tk;const u={...tk,status:s};if(s==="In Progress"&&!tk.startedAt)u.startedAt=new Date().toISOString();if(s==="Completed"&&!tk.completedAt)u.completedAt=today;return u;})}));
    if(sel?.id===id)setSel(p=>({...p,status:s,completedAt:s==="Completed"?(p.completedAt||new Date().toISOString().split("T")[0]):p.completedAt}));
  };

  const addSubtask=()=>{
    if(!newSubtask.title.trim()||!sel)return;
    const st={id:"st"+Date.now(),title:newSubtask.title.trim(),brief:newSubtask.brief,done:false,aId:newSubtask.aId,due:newSubtask.due,dueTime:newSubtask.dueTime,est:parseInt(newSubtask.est)||0,deptId:newSubtask.deptId,drive:newSubtask.drive,refLink:newSubtask.refLink};
    setData(d=>({...d,tasks:d.tasks.map(tsk=>tsk.id===sel.id?{...tsk,subtasks:[...(tsk.subtasks||[]),st]}:tsk)}));
    setSel(p=>({...p,subtasks:[...(p.subtasks||[]),st]}));
    setNewSubtask({title:"",brief:"",aId:"",due:"",dueTime:"",est:"",deptId:"",drive:"",refLink:""});
  };
  const toggleSubtask=(stId)=>{
    setData(d=>({...d,tasks:d.tasks.map(tk=>tk.id===sel.id?{...tk,subtasks:(tk.subtasks||[]).map(sub=>sub.id===stId?{...sub,done:!sub.done}:sub)}:tk)}));
    setSel(p=>({...p,subtasks:(p.subtasks||[]).map(sub=>sub.id===stId?{...sub,done:!sub.done}:sub)}));
  };
  const deleteSubtask=(stId)=>{
    setData(d=>({...d,tasks:d.tasks.map(tk=>tk.id===sel.id?{...tk,subtasks:(tk.subtasks||[]).filter(sub=>sub.id!==stId)}:tk)}));
    setSel(p=>({...p,subtasks:(p.subtasks||[]).filter(sub=>sub.id!==stId)}));
  };
  const approveDeadline=(taskId,due)=>{
    const task=data.tasks.find(tk=>tk.id===taskId);
    const hod=data.departments.find(d=>d.id===task?.deptId);
    const hodUser=data.users.find(u=>u.id===hod?.hodId);
    setData(d=>({...d,tasks:d.tasks.map(tk=>tk.id===taskId?{...tk,due,awaitingDeadline:false,deadlineProposal:{...tk.deadlineProposal,status:"Approved"}}:tk)}));
    setSel(p=>({...p,due,awaitingDeadline:false,deadlineProposal:{...p.deadlineProposal,status:"Approved"}}));
    if(hodUser) setData(d=>({...d,notifications:[...d.notifications,{id:"n"+Date.now(),type:"deadline_approved",title:"Deadline Approved",body:`Your proposed deadline of ${fd(due)} for "${task?.title}" was approved.`,to:hodUser.id,from:currentUser?.id,ref:taskId,refType:"task",read:false,at:new Date().toISOString()}]}));
    toast("Deadline approved — task updated","success");
  };
  const rejectDeadline=(taskId)=>{
    const task=data.tasks.find(tk=>tk.id===taskId);
    const hod=data.departments.find(d=>d.id===task?.deptId);
    const hodUser=data.users.find(u=>u.id===hod?.hodId);
    setData(d=>({...d,tasks:d.tasks.map(tk=>tk.id===taskId?{...tk,deadlineProposal:{...tk.deadlineProposal,status:"Rejected"}}:tk)}));
    setSel(p=>({...p,deadlineProposal:{...p.deadlineProposal,status:"Rejected"}}));
    if(hodUser) setData(d=>({...d,notifications:[...d.notifications,{id:"n"+Date.now(),type:"deadline_rejected",title:"Deadline Rejected",body:`Your deadline proposal for "${task?.title}" was rejected. Please propose again.`,to:hodUser.id,from:currentUser?.id,ref:taskId,refType:"task",read:false,at:new Date().toISOString()}]}));
    toast("Proposal rejected — HoD notified to re-propose","info");
  };
  const counterDeadline=(taskId,counterDue)=>{
    if(!counterDue){toast("Pick a date first","error");return;}
    const task=data.tasks.find(tk=>tk.id===taskId);
    const hod=data.departments.find(d=>d.id===task?.deptId);
    const hodUser=data.users.find(u=>u.id===hod?.hodId);
    setData(d=>({...d,tasks:d.tasks.map(tk=>tk.id===taskId?{...tk,deadlineProposal:{...tk.deadlineProposal,status:"CounterProposed",counterDue}}:tk)}));
    setSel(p=>({...p,deadlineProposal:{...p.deadlineProposal,status:"CounterProposed",counterDue}}));
    if(hodUser){
      setData(d=>({...d,notifications:[...d.notifications,{id:"n"+Date.now(),type:"deadline_counter",title:"Counter-Deadline Proposed",body:`Founder suggested ${fd(counterDue)} for "${task?.title}". Please accept or reject.`,to:hodUser.id,from:currentUser?.id,ref:taskId,refType:"task",read:false,at:new Date().toISOString()}]}));
      sendEmail(hodUser.email,hodUser.name,"Counter-Deadline Proposed: "+task?.title,`Hi ${hodUser.name},

The Founder has counter-proposed a deadline of ${fd(counterDue)} for the task "${task?.title}".

Please open the app to accept or reject.

— ProfitPenny Studio OS`);
    }
    setCounterDate("");
    toast("Counter-proposal sent to HoD","success");
  };
  const submitExt=()=>{
    if(!extForm.reason||!extForm.newDue){toast("Fill all fields","error");return;}
    const hodId=data.departments.find(d=>d.id===data.users.find(u=>u.id===sel?.aId)?.dept)?.hodId||"u2";
    setData(d=>({...d,tasks:d.tasks.map(tk=>tk.id===sel?.id?{...tk,extRequest:{...extForm,status:"Pending"}}:tk),notifications:[...d.notifications,{id:"n"+Date.now(),type:"ext_request",title:"Extension Request",body:`${uName(sel?.aId)} requested extension on "${sel?.title}" → ${fd(extForm.newDue)}`,to:hodId,from:sel?.aId,ref:sel?.id,refType:"task",read:false,at:new Date().toISOString()}]}));
    setShowExt(false);setExtForm({reason:"",newDue:""});
    toast("Extension request sent to HoD + email","info");
  };
  const deleteTask=id=>{
    if(!window.confirm("Delete this task?"))return;
    setData(d=>({...d,tasks:d.tasks.filter(tk=>tk.id!==id)}));
    deleteDoc_(COLS.TASKS,id).catch(()=>{});
    setSel(null);
    toast("Task deleted","info");
  };

  const addTask=()=>{
    if(!form.title||!form.cId||!form.aId){toast("Fill required fields","error");return;}
    const id="t"+Date.now();
    const noDeadline=form.noDeadline||!form.due;
    const newTask={...form,id,status:"Not Started",logged:0,startedAt:null,created:new Date().toISOString().split("T")[0],extRequest:null,est:parseInt(form.est)||0,assetLinks:form.assetLinks.filter(l=>l.trim()),awaitingDeadline:noDeadline,due:form.due||"",comments:[]};
    setData(d=>{
      const assignee=d.users.find(u=>u.id===form.aId);
      const dept=d.departments.find(dep=>dep.id===form.deptId);
      const hod=d.users.find(u=>u.id===dept?.hodId);
      const managers=d.users.filter(u=>u.role==="Manager"||u.role==="Founder"||u.role==="Admin");
      const notifs=[...d.notifications];
      // Notify assignee
      if(assignee&&assignee.id!==currentUser?.id){
        notifs.push({id:"n"+Date.now()+"a",type:"task_assigned",title:"New Task Assigned",body:"New task assigned: "+form.title+". "+(form.due?"Deadline: "+fd(form.due):"Deadline TBD."),to:assignee.id,from:currentUser?.id,ref:id,refType:"task",read:false,at:new Date().toISOString()});
        sendEmail(assignee.email,assignee.name,"New Task: "+form.title,`Hi ${assignee.name},\n\nA new task has been assigned to you.\n\nTask: ${form.title}\nClient: ${d.clients.find(c=>c.id===form.cId)?.name||"—"}\nPriority: ${form.priority}\nDeadline: ${form.due?fd(form.due):"TBD"}\n\n${form.brief?"Brief:\n"+form.brief+"\n\n":""}\nPlease open the app to start working.\n\n— ProfitPenny Studio OS`);
      }
      // Notify HoD (if different from assignee and current user)
      if(hod&&hod.id!==form.aId&&hod.id!==currentUser?.id){
        notifs.push({id:"n"+Date.now()+"h",type:"task_assigned",title:"Task Created in Your Department",body:"New task: "+form.title+" assigned to "+(assignee?.name||"a team member")+". "+(form.due?"Deadline: "+fd(form.due):"Deadline TBD."),to:hod.id,from:currentUser?.id,ref:id,refType:"task",read:false,at:new Date().toISOString()});
        sendEmail(hod.email,hod.name,"Task Created: "+form.title,`Hi ${hod.name},\n\nA new task has been created in your department.\n\nTask: ${form.title}\nAssigned to: ${assignee?.name||"—"}\nPriority: ${form.priority}\nDeadline: ${form.due?fd(form.due):"TBD"}\n\n— ProfitPenny Studio OS`);
      }
      // Notify Managers (if no deadline: also notify for proposal)
      managers.forEach(mgr=>{
        if(mgr.id!==currentUser?.id&&mgr.id!==hod?.id&&mgr.id!==form.aId){
          notifs.push({id:"n"+Date.now()+mgr.id,type:"task_assigned",title:"New Task Created",body:`"${form.title}" assigned to ${assignee?.name||"—"}.`,to:mgr.id,from:currentUser?.id,ref:id,refType:"task",read:false,at:new Date().toISOString()});
        }
      });
      // If no deadline: notify HoD to propose
      if(noDeadline&&hod){
        notifs.push({id:"n"+Date.now()+"d",type:"deadline_request",title:"📅 Deadline Needed",body:`New task "${form.title}" needs a deadline from you. Click to open the task.`,to:hod.id,from:currentUser?.id||"founder",ref:id,refType:"task",read:false,at:new Date().toISOString()});
        sendEmail(hod.email,hod.name,"Action Required: Propose Deadline for \""+form.title+"\"",`Hi ${hod.name},\n\nA new task has been created and requires your deadline proposal.\n\nTask: ${form.title}\nAssigned to: ${assignee?.name||"—"}\nBrief: ${form.brief||"—"}\n\nPlease open the app to propose a deadline.\n\n— ProfitPenny Studio OS`);
        sendEmail(hod.email,hod.name,"Deadline Needed: "+form.title,`A new task has been created and needs your deadline proposal.\n\nTask: ${form.title}\nAssigned to: ${assignee?.name||"—"}\n\nPlease open the app and propose a deadline.`);
      }
      return {...d,tasks:[...d.tasks,newTask],notifications:notifs};
    });
    if(noDeadline) toast("Task created — HoD notified to propose deadline","info");
    else toast("Task created — assignee notified","success");
    setShowAdd(false);
    setForm({title:"",cId:"",aId:"",deptId:"",priority:"Medium",due:"",dueTime:"09:00",brief:"",drive:"",est:"",assetLinks:[""],noDeadline:false});
    setDueWarn("");
  };

  const FBtn=({label,active,onClick})=>(
    <button onClick={onClick} style={{padding:"5px 13px",borderRadius:99,border:`1.5px solid ${active?t.lime:t.border}`,background:active?t.limeBg:"transparent",color:active?t.limeDeep:t.textMuted,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s",whiteSpace:"nowrap"}}>{label}</button>
  );

  // Deadline proposals pending founder approval
  const pendingProposals=data.tasks.filter(tk=>tk.deadlineProposal?.status==="Pending");

  return(
    <div>
      <SHead t={t} title="Projects" sub="All tasks across clients and team"
        action={<Btn t={t} v="lime" onClick={()=>setShowAdd(true)} icon={<Plus size={14}/>}>New Task</Btn>}/>

      {/* HoD deadline proposals awaiting founder approval */}
      {pendingProposals.length>0&&(
        <div style={{background:t.amberBg,border:`1px solid ${t.amber}30`,borderRadius:12,padding:"12px 16px",marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:13,color:t.amber,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><AlarmClock size={14}/>Deadline proposals awaiting your approval</div>
          {pendingProposals.map(tk=>(
            <div key={tk.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",background:t.surface,borderRadius:9,padding:"9px 13px",marginBottom:6}}>
              <div>
                <div style={{fontWeight:600,fontSize:13,color:t.text}}>{tk.title}</div>
                <div style={{fontSize:12,color:t.textMuted}}>HoD proposes <strong style={{color:t.amber}}>{fd(tk.deadlineProposal?.due)}</strong>{tk.deadlineProposal?.note&&` — "${tk.deadlineProposal.note}"`}</div>
              </div>
              <div style={{display:"flex",gap:7}}>
                <Btn v="success" t={t} size="sm" icon={<Check size={12}/>} onClick={()=>{
                  setData(d=>({...d,tasks:d.tasks.map(x=>x.id===tk.id?{...x,due:tk.deadlineProposal.due,awaitingDeadline:false,deadlineProposal:{...x.deadlineProposal,status:"Approved"}}:x)}));
                  toast("Deadline approved");
                }}>Approve</Btn>
                <Btn v="danger" t={t} size="sm" onClick={()=>{
                  setData(d=>({...d,tasks:d.tasks.map(x=>x.id===tk.id?{...x,deadlineProposal:{...x.deadlineProposal,status:"Rejected"}}:x)}));
                  toast("Rejected","info");
                }}>Reject</Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter rows */}
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:11,fontWeight:600,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginRight:4}}>Status</span>
          {["All","Not Started","In Progress","Review","Completed","Delayed"].map(s=><FBtn key={s} label={s} active={filterStatus===s} onClick={()=>setFilterStatus(s)}/>)}
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:11,fontWeight:600,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginRight:4}}>Client</span>
          {["All",...data.clients.map(c=>c.id)].map(id=><FBtn key={id} label={id==="All"?"All":data.clients.find(c=>c.id===id)?.name.split(" ")[0]||id} active={filterClient===id} onClick={()=>setFilterClient(id)}/>)}
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:11,fontWeight:600,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginRight:4}}>Dept</span>
          {["All",...data.departments.map(d=>d.id)].map(id=><FBtn key={id} label={id==="All"?"All":data.departments.find(d=>d.id===id)?.name||id} active={filterDept===id} onClick={()=>setFilterDept(id)}/>)}
          <span style={{fontSize:11,fontWeight:600,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginLeft:8,marginRight:4}}>Member</span>
          {["All",...data.users.filter(u=>u.role!=="Admin").map(u=>u.id)].map(id=><FBtn key={id} label={id==="All"?"All":data.users.find(u=>u.id===id)?.name.split(" ")[0]||id} active={filterMember===id} onClick={()=>setFilterMember(id)}/>)}
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:11,fontWeight:600,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginRight:4}}>Due</span>
          {[["All","All"],["Today","today"],["Tomorrow","tomorrow"],["Pick date","custom"]].map(([l,v])=><FBtn key={v} label={l} active={filterDate===v} onClick={()=>setFilterDate(v)}/>)}
          {filterDate==="custom"&&<input type="date" value={customDate} onChange={e=>setCustomDate(e.target.value)} style={{...iStyle(t),width:160,padding:"5px 10px",fontSize:12}}/>}
          <div style={{flex:1,minWidth:160,maxWidth:260,position:"relative",marginLeft:8}}>
            <Search size={13} style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:t.textMuted,pointerEvents:"none"}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{...iStyle(t),paddingLeft:32,height:33,fontSize:12}}/>
          </div>
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:7}}>
        {filtered.map((task,i)=>{
          const over=task.logged>task.est;
          const overdue=isOverdue(task.due)&&task.status!=="Completed"&&task.due;
          return(
            <div key={task.id} className="row-hover" onClick={()=>setSel(task)}
              style={{background:t.card,border:`1.5px solid ${overdue?t.red+"40":task.extRequest?.status==="Pending"?t.purple+"60":t.border}`,borderRadius:12,padding:"12px 14px",cursor:"pointer",animation:`fadeUp .3s ${i*28}ms both`,boxShadow:`0 1px 3px ${t.shadow}`,transition:"border-color .15s"}}>
              <div style={{display:"grid",gridTemplateColumns:"2.4fr 1.3fr 1fr .9fr .9fr 1fr",gap:10,alignItems:"center"}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:600,color:t.text}}>{task.title}</span>
                    {task.awaitingDeadline&&<span style={{fontSize:9,padding:"2px 7px",background:t.amberBg,color:t.amber,borderRadius:99,fontWeight:700,flexShrink:0}}>AWAITING DEADLINE</span>}
                  </div>
                  <PBar value={task.logged} max={Math.max(task.est,task.logged,1)} color={over?"red":task.logged/task.est>.8?"amber":"lime"} t={t} h={3} showPct={false}/>
                  <div style={{fontSize:10,color:t.textMuted,marginTop:3}}>{task.logged}h / {task.est}h est.</div>
                </div>
                <div style={{fontSize:12,color:t.textMid}}>{cName(task.cId).split(" ").slice(0,2).join(" ")}</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}><Av init={data.users.find(u=>u.id===task.aId)?.av||"?"} size={24} t={t}/><span style={{fontSize:12,color:t.textMid}}>{uName(task.aId).split(" ")[0]}</span></div>
                <Badge label={task.priority} color={PC(task.priority)} t={t} small/>
                <Badge label={task.status}   color={SC(task.status)}   t={t} small/>
                <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:6}}>
                  {task.status==="In Progress"&&task.startedAt
                    ?<LiveTimer startedAt={task.startedAt} t={t} active/>
                    :<span style={{fontSize:11,color:overdue?t.red:task.due?t.textMuted:t.amber,fontWeight:overdue?700:400}}>{overdue&&<AlertTriangle size={10} style={{marginRight:2}}/>}{task.due?fd(task.due):"No date"}</span>}
                  <button onClick={e=>{e.stopPropagation();deleteTask(task.id);}} title="Delete" style={{background:"none",border:"none",cursor:"pointer",color:t.red,opacity:0,padding:"2px",borderRadius:5,transition:"opacity .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0}><Trash2 size={12}/></button>
                </div>
              </div>
              {task.extRequest?.status==="Pending"&&<div style={{marginTop:8,padding:"5px 10px",background:t.purpleBg,borderRadius:8,fontSize:11,color:t.purple,display:"flex",alignItems:"center",gap:6}}><AlarmClock size={12}/> Extension pending → {fd(task.extRequest.newDue)}</div>}
            </div>
          );
        })}
        {filtered.length===0&&<Card t={t}><p style={{color:t.textMuted,textAlign:"center",padding:"20px 0",fontSize:14}}>No tasks match your filters.</p></Card>}
      </div>

      {/* Task Detail Modal */}
      {sel&&(
        <Modal open title={sel.title} onClose={()=>{setSel(null);setShowExt(false);}} t={t} w={600} subtitle={`${cName(sel.cId)} · ${uName(sel.aId)}`}>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            <Badge label={sel.status} color={SC(sel.status)} t={t}/>
            <Badge label={sel.priority} color={PC(sel.priority)} t={t}/>
            {sel.awaitingDeadline&&<Badge label="Awaiting Deadline" color="amber" t={t}/>}
            {sel.status==="In Progress"&&sel.startedAt&&<div style={{display:"flex",alignItems:"center",gap:6,padding:"3px 10px",background:t.limeBg,borderRadius:99,border:`1px solid ${t.lime}40`}}><Timer size={11} color={t.limeDeep}/><LiveTimer startedAt={sel.startedAt} t={t} active/></div>}
          </div>
          <div style={{padding:"13px 15px",background:t.surfaceAlt,borderRadius:12,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:12,fontWeight:600,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Time Budget</span>
              <span style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:15,color:sel.logged>sel.est?t.red:t.green}}>{sel.logged}h / {sel.est}h</span>
            </div>
            <PBar value={sel.logged} max={Math.max(sel.est,sel.logged,1)} color={sel.logged>sel.est?"red":"lime"} t={t}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>
            {[["Deadline",sel.due?(fd(sel.due)+(sel.dueTime?" "+sel.dueTime:"")):"Awaiting"],["Created",fd(sel.created)],["Dept",data.departments.find(d=>d.id===sel.deptId)?.name||"—"]].map(([k,v])=>(
              <div key={k}><div style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:t.textMuted,marginBottom:3}}>{k}</div><div style={{fontSize:14,color:t.text,fontWeight:600}}>{v}</div></div>
            ))}
          </div>
          {sel.brief&&<Field label="Brief" t={t}><p style={{fontSize:13,color:t.textMid,lineHeight:1.7,margin:0}}>{sel.brief}</p></Field>}
          {/* Drive + asset links */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
            {sel.drive&&<a href={sel.drive} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 12px",background:t.blueBg,color:t.blue,borderRadius:10,fontSize:12,fontWeight:600,textDecoration:"none"}}><ExternalLink size={12}/> Drive</a>}
            {(sel.assetLinks||[]).filter(l=>l).map((l,i)=><a key={i} href={l} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 12px",background:t.surfaceAlt,color:t.textMid,borderRadius:10,fontSize:12,fontWeight:600,textDecoration:"none"}}><Link2 size={12}/> Asset {i+1}</a>)}
          </div>
          {/* HoD: propose deadline when awaiting */}
          {(sel.awaitingDeadline||sel.deadlineProposal?.status==="Rejected"||sel.deadlineProposal?.status==="CounterProposed")&&(
            <HoDDeadlineProposal sel={sel} setSel={setSel} data={data} setData={setData} uName={uName} t={t} toast={toast}/>
          )}
          {sel.deadlineProposal&&sel.deadlineProposal.status==="Pending"&&(isFounder?(
            <div style={{padding:"12px 14px",background:t.amberBg,borderRadius:10,marginBottom:14,border:`1px solid ${t.amber}40`}}>
              <div style={{fontSize:12,fontWeight:700,color:t.amber,marginBottom:6}}>📅 HoD proposed deadline: <strong>{fd(sel.deadlineProposal.due)}</strong></div>
              {sel.deadlineProposal.note&&<div style={{fontSize:12,color:t.textMid,marginBottom:8}}>Note: {sel.deadlineProposal.note}</div>}
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                <Btn v="lime" t={t} size="sm" onClick={()=>approveDeadline(sel.id,sel.deadlineProposal.due)}>✓ Approve</Btn>
                <Btn v="danger" t={t} size="sm" onClick={()=>rejectDeadline(sel.id)}>✕ Reject</Btn>
                <div style={{display:"flex",gap:6,alignItems:"center",flex:1,minWidth:200}}>
                  <Inp type="date" value={counterDate} onChange={e=>setCounterDate(e.target.value)} t={t} style={{flex:1}}/>
                  <Btn v="secondary" t={t} size="sm" onClick={()=>counterDeadline(sel.id,counterDate)} disabled={!counterDate}>Counter-propose</Btn>
                </div>
              </div>
            </div>
          ):(
            <div style={{padding:"10px 14px",background:t.amberBg,borderRadius:10,marginBottom:14,fontSize:13,color:t.amber}}>⏳ Deadline proposed ({fd(sel.deadlineProposal.due)}) — awaiting Founder approval</div>
          ))}
          {sel.deadlineProposal&&sel.deadlineProposal.status==="Rejected"&&(
            <div style={{padding:"10px 14px",background:t.redBg,borderRadius:10,marginBottom:14,fontSize:13,color:t.red}}>❌ Deadline proposal rejected — please propose a new date below</div>
          )}
          {sel.deadlineProposal&&sel.deadlineProposal.status==="CounterProposed"&&!isFounder&&(
            <div style={{padding:"12px 14px",background:t.blueBg,borderRadius:10,marginBottom:14,border:`1px solid ${t.blue}40`}}>
              <div style={{fontSize:12,fontWeight:700,color:t.blue,marginBottom:6}}>📅 Founder counter-proposed: <strong>{fd(sel.deadlineProposal.counterDue)}</strong></div>
              <div style={{display:"flex",gap:8}}>
                <Btn v="lime" t={t} size="sm" onClick={()=>approveDeadline(sel.id,sel.deadlineProposal.counterDue)}>✓ Accept</Btn>
                <Btn v="danger" t={t} size="sm" onClick={()=>rejectDeadline(sel.id)}>✕ Reject & Re-propose</Btn>
              </div>
            </div>
          )}
          {sel.extRequest&&(
            <div style={{padding:"12px 14px",borderRadius:12,marginBottom:14,background:sel.extRequest.status==="Pending"?t.purpleBg:sel.extRequest.status==="Approved"?t.greenBg:t.redBg,border:`1px solid ${t.purple}30`}}>
              <div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontWeight:600,fontSize:13,color:t.text}}>Extension Request</div><Badge label={sel.extRequest.status} color={SC(sel.extRequest.status)} t={t} small/></div>
              <div style={{fontSize:12,color:t.textMid,marginTop:4}}>{sel.extRequest.reason}</div>
              <div style={{fontSize:12,color:t.textMuted,marginTop:3}}>New deadline: {fd(sel.extRequest.newDue)}</div>
            </div>
          )}
          <div style={{borderTop:`1px solid ${t.border}`,paddingTop:14}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:t.textMuted,marginBottom:10}}>Update Status</div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {sel.status==="Not Started"&&<Btn v="lime" t={t} size="sm" icon={<Play size={12}/>} onClick={()=>{startTask(sel.id);setSel(p=>({...p,status:"In Progress",startedAt:new Date().toISOString()}));}}>Start Task</Btn>}
              <StatusButtons sel={sel} updStatus={updStatus} t={t}/>
              {sel.status==="Delayed"&&!sel.extRequest&&<Btn v="outline" t={t} size="sm" icon={<AlarmClock size={12}/>} onClick={()=>setShowExt(true)}>Request Extension</Btn>}
            </div>
          </div>
          {showExt&&(
            <div style={{marginTop:14,padding:"14px 16px",background:t.surfaceAlt,borderRadius:12,border:`1px solid ${t.border}`}}>
              <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:14,color:t.text,marginBottom:12}}>Request Deadline Extension</div>
              <Field label="Reason *" t={t}><Tex value={extForm.reason} onChange={e=>setExtForm(p=>({...p,reason:e.target.value}))} placeholder="Why is an extension needed?" t={t} rows={2}/></Field>
              <Field label="New Deadline you are requesting *" t={t}><Inp type="date" value={extForm.newDue} onChange={e=>setExtForm(p=>({...p,newDue:e.target.value}))} t={t}/></Field>
              <div style={{display:"flex",gap:8}}>
                <Btn v="lime" t={t} size="sm" onClick={submitExt} icon={<Send size={11}/>}>Send to HoD</Btn>
                <Btn v="ghost" t={t} size="sm" onClick={()=>setShowExt(false)}>Cancel</Btn>
              </div>
            </div>
          )}
          {/* Sub-tasks */}
          <div style={{borderTop:`1px solid ${t.border}`,paddingTop:14,marginTop:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:700,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.07em"}}>
                Sub-tasks {(sel.subtasks||[]).length>0&&`(${(sel.subtasks||[]).filter(sub=>sub.done).length}/${(sel.subtasks||[]).length})`}
              </div>
              {(sel.subtasks||[]).length>0&&<div style={{fontSize:11,color:t.textMuted}}>{Math.round(((sel.subtasks||[]).filter(sub=>sub.done).length/(sel.subtasks||[]).length)*100)}% done</div>}
            </div>
            {(sel.subtasks||[]).length>0&&<PBar value={(sel.subtasks||[]).filter(sub=>sub.done).length} max={(sel.subtasks||[]).length} color="lime" t={t} h={3} delay={0} showPct={false}/>}
            <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:5}}>
              {(sel.subtasks||[]).map((st,si)=>(
                <div key={st.id||si} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 10px",background:st.done?t.limeBg:t.surfaceAlt,border:`1px solid ${st.done?t.lime+"40":t.border}`,borderRadius:8,transition:"all .15s"}}>
                  <button onClick={()=>toggleSubtask(st.id)} style={{width:16,height:16,borderRadius:4,flexShrink:0,background:st.done?t.lime:"transparent",border:`2px solid ${st.done?t.lime:t.borderMid}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .15s"}}>{st.done&&<Check size={9} color="#0A0A0A" strokeWidth={3}/>}</button>
                  <div style={{flex:1}}>
                    <span style={{fontSize:13,color:st.done?t.limeDeep:t.text,textDecoration:st.done?"line-through":"none",fontWeight:500}}>{st.title}</span>
                    <div style={{display:"flex",gap:10,marginTop:3,flexWrap:"wrap"}}>
                      {st.aId&&<span style={{fontSize:10,color:t.textMuted,display:"flex",alignItems:"center",gap:3}}><User size={9}/>{uName(st.aId)}</span>}
                      {st.deptId&&<span style={{fontSize:10,color:t.textMuted}}>{data.departments.find(dep=>dep.id===st.deptId)?.name}</span>}
                      {st.due&&<span style={{fontSize:10,color:t.textMuted,fontWeight:600}}>{fd(st.due)}{st.dueTime?" · "+st.dueTime:""}</span>}
                      {st.est>0&&<span style={{fontSize:10,color:t.textMuted}}>{st.est}h</span>}
                      {st.drive&&<a href={st.drive} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:t.blue,textDecoration:"none"}}>Drive</a>}
                      {st.refLink&&<a href={st.refLink} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:t.textMuted,textDecoration:"none"}}>Ref</a>}
                    </div>
                    {st.brief&&<div style={{fontSize:11,color:t.textMuted,marginTop:4,lineHeight:1.5,fontStyle:"italic"}}>{st.brief}</div>}
                  </div>
                  <button onClick={()=>deleteSubtask(st.id)} style={{background:"none",border:"none",cursor:"pointer",color:t.red,opacity:0.5,padding:2,display:"flex",alignItems:"center",flexShrink:0}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0.5}><X size={11}/></button>
                </div>
              ))}
            </div>
            <div style={{marginTop:10,padding:"12px 14px",background:t.surfaceAlt,borderRadius:10,border:`1px solid ${t.border}`}}>
              <Inp value={newSubtask.title} onChange={e=>setNewSubtask(p=>({...p,title:e.target.value}))} placeholder="Sub-task name *" t={t}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"8px 0"}}>
                <Field label="Allocated To" t={t}><Sel value={newSubtask.aId} onChange={e=>setNewSubtask(p=>({...p,aId:e.target.value}))} t={t}><option value="">Select member</option>{data.users.filter(u=>u.role!=="Admin").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</Sel></Field>
                <Field label="Department" t={t}><Sel value={newSubtask.deptId} onChange={e=>setNewSubtask(p=>({...p,deptId:e.target.value}))} t={t}><option value="">Select dept</option>{data.departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</Sel></Field>
                <Field label="Deadline" t={t}><div style={{display:"flex",gap:5}}><Inp type="date" value={newSubtask.due} onChange={e=>setNewSubtask(p=>({...p,due:e.target.value}))} t={t}/><Inp type="time" value={newSubtask.dueTime} onChange={e=>setNewSubtask(p=>({...p,dueTime:e.target.value}))} t={t} style={{width:95}}/></div></Field>
                <Field label="Est. Hours" t={t}><Inp type="number" value={newSubtask.est} onChange={e=>setNewSubtask(p=>({...p,est:e.target.value}))} placeholder="e.g. 3" t={t}/></Field>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                <Field label="Drive Link" t={t}><Inp value={newSubtask.drive} onChange={e=>setNewSubtask(p=>({...p,drive:e.target.value}))} placeholder="https://drive.google.com/..." t={t}/></Field>
                <Field label="Reference Link" t={t}><Inp value={newSubtask.refLink} onChange={e=>setNewSubtask(p=>({...p,refLink:e.target.value}))} placeholder="https://..." t={t}/></Field>
              </div>
              <div style={{marginBottom:8}}><label style={{fontSize:10,fontWeight:700,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:4}}>Brief / Notes</label><Tex value={newSubtask.brief} onChange={e=>setNewSubtask(p=>({...p,brief:e.target.value}))} placeholder="Describe what needs to be done..." t={t} rows={2}/></div>
              <Btn v="lime" t={t} size="sm" onClick={addSubtask} icon={<Plus size={11}/>}>Add Sub-task</Btn>
            </div>
          </div>
          <div style={{borderTop:`1px solid ${t.border}`,paddingTop:12,marginTop:8,display:"flex",justifyContent:"flex-end"}}>
            <Btn v="danger" t={t} size="sm" icon={<Trash2 size={12}/>} onClick={()=>deleteTask(sel.id)}>Delete Task</Btn>
          </div>
        </Modal>
      )}
      {/* New Task Modal */}
      <Modal open={showAdd} onClose={()=>{setShowAdd(false);setDueWarn("");}} title="New Task" t={t} w={520}>
        <Field label="Task Title *" t={t}><Inp value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Annual Report Design" t={t}/></Field>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Client *" t={t}><Sel value={form.cId} onChange={e=>setForm(p=>({...p,cId:e.target.value}))} t={t}><option value="">Select</option>{data.clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Sel></Field>
          <Field label="Assign To *" t={t}><Sel value={form.aId} onChange={e=>handleAssign(e.target.value)} t={t}><option value="">Select</option>{data.users.filter(u=>u.role!=="Admin").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</Sel></Field>
          <Field label="Department" t={t}><DeptSel value={form.deptId} onChange={v=>setForm(p=>({...p,deptId:v}))} data={data} setData={setData} t={t} toast={toast}/></Field>
          <Field label="Priority" t={t}><Sel value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))} t={t}>{["High","Medium","Low"].map(x=><option key={x}>{x}</option>)}</Sel></Field>
          <Field label={`Deadline ${form.noDeadline?"(HoD will propose)":""}`} t={t}>
            <Inp type="date" value={form.noDeadline?"":form.due} disabled={form.noDeadline} onChange={e=>{setForm(p=>({...p,due:e.target.value}));checkDue(e.target.value);}} t={t}/>
            {dueWarn&&<div style={{fontSize:11,color:t.amber,marginTop:4,display:"flex",alignItems:"center",gap:4}}><AlertTriangle size={11}/>{dueWarn}</div>}
            <label style={{display:"flex",alignItems:"center",gap:6,marginTop:6,fontSize:12,color:t.textMuted,cursor:"pointer"}}>
              <input type="checkbox" checked={form.noDeadline} onChange={e=>setForm(p=>({...p,noDeadline:e.target.checked,due:e.target.checked?"":p.due}))}/>
              Let HoD propose deadline
            </label>
          </Field>
          <Field label="Time" t={t}><Inp type="time" value={form.dueTime} onChange={e=>setForm(p=>({...p,dueTime:e.target.value}))} t={t}/></Field>
          <Field label="Est. Hours" t={t}><Inp type="number" value={form.est} onChange={e=>setForm(p=>({...p,est:e.target.value}))} placeholder="e.g. 10" t={t}/></Field>
        </div>
        <Field label="Brief" t={t}><Tex value={form.brief} onChange={e=>setForm(p=>({...p,brief:e.target.value}))} placeholder="Scope of work, deliverables..." t={t}/></Field>
        <Field label="Google Drive Link" t={t}><Inp value={form.drive} onChange={e=>setForm(p=>({...p,drive:e.target.value}))} placeholder="https://drive.google.com/..." t={t}/></Field>
        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,fontWeight:600,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Asset / Reference Links</label>
          {form.assetLinks.map((link,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
              <Inp value={link} onChange={e=>{const a=[...form.assetLinks];a[i]=e.target.value;setForm(p=>({...p,assetLinks:a}));}} placeholder={`Reference link ${i+1}`} t={t}/>
              {form.assetLinks.length>1&&<Btn v="ghost" t={t} size="sm" onClick={()=>setForm(p=>({...p,assetLinks:p.assetLinks.filter((_,j)=>j!==i)}))}><X size={12}/></Btn>}
            </div>
          ))}
          <Btn v="ghost" t={t} size="sm" icon={<Plus size={11}/>} onClick={()=>setForm(p=>({...p,assetLinks:[...p.assetLinks,""]}))}>Add link</Btn>
        </div>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:4}}>
          <Btn v="secondary" t={t} onClick={()=>{setShowAdd(false);setDueWarn("");}}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={addTask} icon={<Plus size={13}/>}>Create Task</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ── TIME LOGS ────────────────────────────────────────────────────────────────
function TimeLogs({t,data,setData,toast}){
  const [filterUser,setFilterUser]=useState("all");
  const [filterTask,setFilterTask]=useState("all");
  const [showLog,setShowLog]=useState(false);
  const [lf,setLf]=useState({tId:"",uId:"",date:"",hrs:"",note:""});

  const uName=id=>data.users.find(u=>u.id===id)?.name||"—";
  const tName=id=>data.tasks.find(tk=>tk.id===id)?.title||"—";

  const logs=data.timeLogs.filter(l=>{
    if(filterUser!=="all"&&l.uId!==filterUser)return false;
    if(filterTask!=="all"&&l.tId!==filterTask)return false;
    return true;
  });

  const totalHrs=logs.reduce((s,l)=>s+(l.hrs||0),0);
  const autoHrs=logs.filter(l=>l.auto).reduce((s,l)=>s+(l.hrs||0),0);
  const manualCount=logs.filter(l=>!l.auto).length;

  // Per-member summary
  const perMember=data.users.filter(u=>u.role!=="Admin").map(u=>{
    const uLogs=data.timeLogs.filter(l=>l.uId===u.id);
    const hrs=uLogs.reduce((s,l)=>s+(l.hrs||0),0);
    const activeTasks=data.tasks.filter(tk=>tk.aId===u.id&&tk.status==="In Progress").length;
    return{...u,hrs,activeTasks,logCount:uLogs.length};
  }).sort((a,b)=>b.hrs-a.hrs);

  // Per-task summary with grade
  const taskSummary=data.tasks.filter(tk=>tk.est>0).map(tk=>{
    const grade=()=>{
      if(tk.status!=="Completed"&&tk.status!=="Delayed")return{label:"In Progress",color:"blue"};
      if(tk.logged<tk.est*0.95)return{label:"Before Time",color:"green"};
      if(tk.logged<=tk.est*1.05)return{label:"On Time",color:"lime"};
      return{label:"Overtime",color:"red"};
    };
    const pct=tk.est>0?Math.round((tk.logged/tk.est)*100):0;
    return{...tk,grade:grade(),pct};
  });

  const logTime=()=>{
    if(!lf.tId||!lf.uId||!lf.hrs){toast("Fill all required fields","error");return;}
    const h=parseFloat(lf.hrs);
    if(isNaN(h)||h<=0){toast("Enter valid hours","error");return;}
    setData(d=>({...d,
      timeLogs:[...d.timeLogs,{...lf,id:"tl"+Date.now(),hrs:h,auto:false}],
      tasks:d.tasks.map(tk=>tk.id===lf.tId?{...tk,logged:(tk.logged||0)+h}:tk)
    }));
    setShowLog(false);
    setLf({tId:"",uId:"",date:"",hrs:"",note:""});
    toast("Time logged successfully");
  };

  return(
    <div>
      <SHead t={t} title="Time Logs" sub="Track hours, view performance grades, and monitor who's working on what"
        action={<Btn v="lime" t={t} onClick={()=>setShowLog(true)} icon={<Plus size={14}/>}>Log Time</Btn>}/>

      {/* Top stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:22}}>
        <StatCard label="Total Hours Logged" value={totalHrs} icon={Clock3} color="lime" t={t} delay={0}/>
        <StatCard label="Auto-tracked" value={autoHrs} icon={Zap} color="green" t={t} delay={60}/>
        <StatCard label="Manual Entries" value={manualCount} icon={FileText} color="blue" t={t} delay={120}/>
        <StatCard label="Active Tasks" value={data.tasks.filter(tk=>tk.status==="In Progress").length} icon={Play} color="amber" t={t} delay={180}/>
      </div>

      {/* SECTION 1: Who's Logged What — member breakdown */}
      <Card t={t} style={{marginBottom:16,animation:"fadeUp .4s .05s both"}}>
        <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:15,color:t.text,marginBottom:4}}>Hours by Member</div>
        <div style={{fontSize:12,color:t.textMuted,marginBottom:16}}>How many hours each person has logged in total</div>
        {perMember.length===0&&<p style={{fontSize:13,color:t.textMuted}}>No members yet.</p>}
        {perMember.map((m,i)=>(
          <div key={m.id} style={{marginBottom:16,animation:`fadeUp .3s ${i*40}ms both`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Av init={m.av} size={32} t={t}/>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:t.text}}>{m.name}</div>
                  <div style={{fontSize:11,color:t.textMuted}}>{m.role} · {m.activeTasks} active task{m.activeTasks!==1?"s":""} · {m.logCount} log entr{m.logCount===1?"y":"ies"}</div>
                </div>
              </div>
              <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:22,color:t.lime}}>{m.hrs}<span style={{fontSize:13,fontWeight:500,color:t.textMuted}}> hrs</span></div>
            </div>
            <PBar value={m.hrs} max={Math.max(...perMember.map(x=>x.hrs),1)} color="lime" t={t} h={4} delay={i*45} showPct={false}/>
          </div>
        ))}
      </Card>

      {/* SECTION 2: Task Performance Grades */}
      <Card t={t} style={{marginBottom:16,animation:"fadeUp .4s .1s both"}}>
        <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:15,color:t.text,marginBottom:4}}>Task Time Performance</div>
        <div style={{fontSize:12,color:t.textMuted,marginBottom:16}}>How much time was used vs estimated — graded after completion</div>
        {taskSummary.length===0&&<p style={{fontSize:13,color:t.textMuted}}>No tasks with time estimates yet.</p>}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {taskSummary.map((tk,i)=>(
            <div key={tk.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:12,alignItems:"center",padding:"10px 13px",background:t.surfaceAlt,borderRadius:10,animation:`fadeUp .25s ${i*25}ms both`}}>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:t.text}}>{tk.title}</div>
                <div style={{fontSize:11,color:t.textMuted,marginTop:2}}>Assigned to {uName(tk.aId).split(" ")[0]}</div>
              </div>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:t.text}}>{tk.logged}h <span style={{color:t.textMuted,fontWeight:400}}>/ {tk.est}h est.</span></div>
                <PBar value={tk.logged} max={Math.max(tk.est,tk.logged,1)} color={tk.logged>tk.est?"red":tk.pct>80?"amber":"lime"} t={t} h={3} showPct={false}/>
              </div>
              <Badge label={tk.status} color={SC(tk.status)} t={t} small/>
              <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 9px",borderRadius:99,background:t[tk.grade.color+"Bg"],color:t[tk.grade.color],fontSize:11,fontWeight:700}}>
                {tk.grade.color==="green"&&<CheckCircle2 size={11}/>}
                {tk.grade.color==="lime"&&<Check size={11}/>}
                {tk.grade.color==="red"&&<TrendingDown size={11}/>}
                {tk.grade.color==="blue"&&<Clock3 size={11}/>}
                {tk.grade.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* SECTION 3: Log entries with filters */}
      <Card t={t} style={{animation:"fadeUp .4s .15s both"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:15,color:t.text,marginBottom:2}}>All Log Entries</div>
            <div style={{fontSize:12,color:t.textMuted}}>{logs.length} entr{logs.length===1?"y":"ies"} · {totalHrs}h total shown</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <select value={filterUser} onChange={e=>setFilterUser(e.target.value)} style={{...iStyle(t),width:150,padding:"6px 10px",fontSize:12}}>
              <option value="all">All members</option>
              {data.users.filter(u=>u.role!=="Admin").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <select value={filterTask} onChange={e=>setFilterTask(e.target.value)} style={{...iStyle(t),width:180,padding:"6px 10px",fontSize:12}}>
              <option value="all">All tasks</option>
              {data.tasks.map(tk=><option key={tk.id} value={tk.id}>{tk.title}</option>)}
            </select>
          </div>
        </div>
        {logs.length===0
          ?<div style={{textAlign:"center",padding:"28px 0",color:t.textMuted,fontSize:13}}>No log entries match your filters.</div>
          :<div style={{display:"flex",flexDirection:"column",gap:6}}>
            {[...logs].reverse().map((log,i)=>(
              <div key={log.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 80px 80px 1fr auto",gap:10,alignItems:"center",padding:"10px 13px",background:t.surfaceAlt,borderRadius:10,animation:`fadeUp .22s ${Math.min(i,10)*20}ms both`}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tName(log.tId)}</div>
                  <div style={{fontSize:11,color:t.textMuted,marginTop:1}}>{log.note||"No note"}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <Av init={data.users.find(u=>u.id===log.uId)?.av||"?"} size={22} t={t}/>
                  <span style={{fontSize:12,color:t.textMid}}>{uName(log.uId).split(" ")[0]}</span>
                </div>
                <span style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:18,color:t.lime}}>{log.hrs}<span style={{fontSize:11,color:t.textMuted,fontWeight:400}}>h</span></span>
                <span style={{fontSize:11,color:t.textMuted}}>{log.date?fd(log.date):"—"}</span>
                <span style={{fontSize:11,color:t.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{log.note||""}</span>
                {log.auto
                  ?<span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 7px",background:t.limeBg,borderRadius:99,fontSize:10,color:t.limeDeep,fontWeight:700,flexShrink:0}}><Zap size={9}/>Auto</span>
                  :<span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 7px",background:t.blueBg,borderRadius:99,fontSize:10,color:t.blue,fontWeight:700,flexShrink:0}}><FileText size={9}/>Manual</span>}
              </div>
            ))}
          </div>}
      </Card>

      {/* Log Time Modal */}
      <Modal open={showLog} onClose={()=>setShowLog(false)} title="Log Time" t={t} w={440}>
        <div style={{padding:"10px 13px",background:t.surfaceAlt,borderRadius:10,marginBottom:16,fontSize:12,color:t.textMid,lineHeight:1.6}}>
          Use this to manually record hours worked on a task. Time is also auto-logged when you start a task using the <strong style={{color:t.text}}>Start Task</strong> button in Projects.
        </div>
        <Field label="Task *" t={t}>
          <Sel value={lf.tId} onChange={e=>setLf(p=>({...p,tId:e.target.value}))} t={t}>
            <option value="">Select a task</option>
            {data.tasks.map(tk=><option key={tk.id} value={tk.id}>{tk.title}</option>)}
          </Sel>
        </Field>
        <Field label="Team Member *" t={t}>
          <Sel value={lf.uId} onChange={e=>setLf(p=>({...p,uId:e.target.value}))} t={t}>
            <option value="">Select member</option>
            {data.users.filter(u=>u.role!=="Admin").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
          </Sel>
        </Field>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Date *" t={t}><Inp type="date" value={lf.date} onChange={e=>setLf(p=>({...p,date:e.target.value}))} t={t}/></Field>
          <Field label="Hours Worked *" t={t}><Inp type="number" value={lf.hrs} onChange={e=>setLf(p=>({...p,hrs:e.target.value}))} placeholder="e.g. 3.5" t={t}/></Field>
        </div>
        <Field label="Note (optional)" t={t}><Inp value={lf.note} onChange={e=>setLf(p=>({...p,note:e.target.value}))} placeholder="What did you work on?" t={t}/></Field>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:8}}>
          <Btn v="secondary" t={t} onClick={()=>setShowLog(false)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={logTime} icon={<Clock3 size={13}/>}>Log Time</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ── EFFICIENCY ───────────────────────────────────────────────────────────────
function Efficiency({t,data}){
  const [deptFilter,setDeptFilter]=useState("All");
  const [clientFilter,setClientFilter]=useState("All");
  const tasks=data.tasks.filter(tk=>{
    if(deptFilter!=="All"&&tk.deptId!==deptFilter)return false;
    if(clientFilter!=="All"&&tk.cId!==clientFilter)return false;
    return true;
  });
  const total=tasks.length,delayed=tasks.filter(x=>x.status==="Delayed").length,comp=tasks.filter(x=>x.status==="Completed").length;
  const perf=total>0?Math.round(((total-delayed)/total)*100):100;
  const pp=data.users.filter(u=>u.role!=="Admin").map(u=>{
    const a=tasks.filter(tk=>tk.aId===u.id);
    const late=a.filter(tk=>tk.status==="Delayed").length;
    return{...u,assigned:a.length,done:a.filter(tk=>tk.status==="Completed").length,late,perf:a.length>0?Math.round(((a.length-late)/a.length)*100):100};
  });
  const FBtn=({label,active,onClick})=><button onClick={onClick} style={{padding:"5px 13px",borderRadius:99,border:`1.5px solid ${active?t.lime:t.border}`,background:active?t.limeBg:"transparent",color:active?t.limeDeep:t.textMuted,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s",whiteSpace:"nowrap"}}>{label}</button>;
  return(
    <div>
      <SHead t={t} title="Deadline Efficiency" sub="Performance by department and client"/>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <span style={{fontSize:11,fontWeight:600,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",alignSelf:"center",marginRight:4}}>Dept</span>
        {["All",...data.departments.map(d=>d.id)].map(id=><FBtn key={id} label={id==="All"?"All":data.departments.find(d=>d.id===id)?.name||id} active={deptFilter===id} onClick={()=>setDeptFilter(id)}/>)}
        <span style={{fontSize:11,fontWeight:600,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",alignSelf:"center",marginLeft:8,marginRight:4}}>Client</span>
        {["All",...data.clients.map(c=>c.id)].map(id=><FBtn key={id} label={id==="All"?"All":data.clients.find(c=>c.id===id)?.name.split(" ")[0]||id} active={clientFilter===id} onClick={()=>setClientFilter(id)}/>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:22}}>
        <StatCard label="Tasks"        value={total}  icon={Target}       color="text"  t={t} delay={0}/>
        <StatCard label="On Time"      value={comp}   icon={CheckCircle2} color="green" t={t} delay={50}/>
        <StatCard label="Delayed"      value={delayed}icon={TrendingDown}  color="red"   t={t} delay={100}/>
        <StatCard label="Studio Score" value={`${perf}%`} icon={Award}    color={perf>=80?"lime":perf>=65?"amber":"red"} t={t} delay={150}/>
      </div>
      <Card t={t} style={{animation:"fadeUp .4s .14s both"}}>
        <h3 style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:16,color:t.text,marginBottom:22}}>Individual Performance</h3>
        {pp.map((p,i)=>(
          <div key={p.id} style={{animation:`fadeUp .32s ${i*50}ms both`,marginBottom:i<pp.length-1?22:0}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <Av init={p.av} size={40} t={t}/>
                <div><div style={{fontSize:14,fontWeight:700,color:t.text}}>{p.name}</div><div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{p.assigned} tasks · {p.done} done · {p.late} delayed</div></div>
              </div>
              <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:32,color:p.perf>=80?t.lime:p.perf>=60?t.amber:t.red,lineHeight:1}}>{p.perf}%</div>
            </div>
            <PBar value={p.perf} max={100} color={p.perf>=80?"lime":p.perf>=60?"amber":"red"} t={t} delay={i*70}/>
            {i<pp.length-1&&<div style={{height:1,background:t.border,marginTop:20}}/>}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── CLIENTS ──────────────────────────────────────────────────────────────────
function Clients({t,data,setData,toast,currentUser}){
  const isFounder=currentUser?.role==="Founder"||currentUser?.role==="Admin";
  const isHoD=currentUser?.role==="HoD"||currentUser?.role==="Head of Department"||currentUser?.role==="Manager";
  const [sel,setSel]=useState(null);
  const [pocTab,setPocTab]=useState(false);
  const [showAdd,setShowAdd]=useState(false);
  const [showAddPoc,setShowAddPoc]=useState(false);
  const [showEdit,setShowEdit]=useState(false);
  const [editForm,setEditForm]=useState(null);
  const [form,setForm]=useState({name:"",industry:"",drive:"",preferredComm:"Email",assetLinks:[""],poc:{name:"",designation:"",phone:"",email:""}});
  const [pocForm,setPocForm]=useState({name:"",designation:"",phone:"",email:""});

  const addClient=()=>{
    if(!form.name){toast("Name required","error");return;}
    const pocs=form.poc.name?[{...form.poc,id:"p"+Date.now()}]:[];
    const assetLinks=(form.assetLinks||[]).filter(l=>l.trim());
    setData(d=>({...d,clients:[...d.clients,{...form,id:"c"+Date.now(),score:80,met:0,missed:0,deliverables:[],pocs,assetLinks}]}));
    setShowAdd(false);
    setForm({name:"",industry:"",drive:"",preferredComm:"Email",assetLinks:[""],poc:{name:"",designation:"",phone:"",email:""}});
    toast("Client added");
  };
  const saveEdit=()=>{
    if(!editForm.name){toast("Name required","error");return;}
    setData(d=>({...d,clients:d.clients.map(c=>c.id===editForm.id?{...c,...editForm}:c)}));
    if(sel?.id===editForm.id)setSel(p=>({...p,...editForm}));
    setShowEdit(false);toast("Client updated");
  };
  const deleteClient=(id)=>{
    if(!window.confirm("Delete this client? This cannot be undone."))return;
    setData(d=>({...d,clients:d.clients.filter(c=>c.id!==id)}));
    if(sel?.id===id)setSel(null);
    toast("Client deleted");
  };
  const addPoc=()=>{
    if(!pocForm.name){toast("Name required","error");return;}
    setData(d=>({...d,clients:d.clients.map(c=>c.id===sel?.id?{...c,pocs:[...(c.pocs||[]),{...pocForm,id:"p"+Date.now()}]}:c)}));
    setSel(p=>({...p,pocs:[...(p.pocs||[]),{...pocForm,id:"p"+Date.now()}]}));
    setShowAddPoc(false);setPocForm({name:"",designation:"",phone:"",email:""});toast("POC added");
  };

  return(
    <div>
      <SHead t={t} title="Clients" sub="Manage relationships, contacts, and happiness scores"
        action={<Btn v="lime" t={t} onClick={()=>setShowAdd(true)} icon={<Plus size={14}/>}>New Client</Btn>}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:14}}>
        {data.clients.map((c,i)=>(
          <Card t={t} key={c.id} lift
            style={{cursor:"pointer",animation:`fadeUp .38s ${i*55}ms both`,borderTop:`3px solid ${c.score>=80?t.lime:c.score>=65?t.amber:t.red}`,position:"relative"}}>
            {/* Edit/delete only for Founder/HoD */}
            {(isFounder||isHoD)&&<div style={{position:"absolute",top:10,right:10,display:"flex",gap:4,opacity:0,transition:"opacity .15s"}} className="card-actions">
              <button onClick={e=>{e.stopPropagation();setEditForm({...c});setShowEdit(true);}} style={{width:26,height:26,borderRadius:6,background:t.surfaceAlt,border:`1px solid ${t.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:t.textMuted}} onMouseEnter={e=>e.currentTarget.style.color=t.blue} onMouseLeave={e=>e.currentTarget.style.color=t.textMuted}><Edit2 size={11}/></button>
              {isFounder&&<button onClick={e=>{e.stopPropagation();deleteClient(c.id);}} style={{width:26,height:26,borderRadius:6,background:t.redBg,border:`1px solid ${t.red}30`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:t.red}}><Trash2 size={11}/></button>}
            </div>}
            <div onClick={()=>{setSel(c);setPocTab(false);}} style={{cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div><div style={{fontSize:15,fontWeight:700,color:t.text,fontFamily:"'Poppins',sans-serif"}}>{c.name}</div><div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{c.industry}</div></div>
                {(isFounder||isHoD)&&<div style={{textAlign:"right"}}><div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:26,lineHeight:1,color:c.score>=80?t.lime:c.score>=65?t.amber:t.red}}>{c.score}%</div><div style={{fontSize:9,color:t.textMuted,fontWeight:600,textTransform:"uppercase"}}>happiness</div></div>}
              </div>
              {(isFounder||isHoD)&&<PBar value={c.score} max={100} color={c.score>=80?"lime":c.score>=65?"amber":"red"} t={t} delay={i*70}/>}
              <div style={{display:"flex",justifyContent:"space-around",marginTop:12,paddingTop:10,borderTop:`1px solid ${t.border}`}}>
                {[["On Time",c.met,"lime"],["Missed",c.missed,"red"],["POCs",(c.pocs||[]).length,"blue"]].map(([l,v,c2])=>(
                  <div key={l} style={{textAlign:"center"}}>
                    <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:20,color:t[c2]}}>{v}</div>
                    <div style={{fontSize:9,color:t.textMuted,textTransform:"uppercase",fontWeight:600}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {sel&&(
        <Modal open title={sel.name} onClose={()=>setSel(null)} t={t} w={600} subtitle={sel.industry}>
          {/* Tabs */}
          <div style={{display:"flex",gap:4,marginBottom:18,borderBottom:`1px solid ${t.border}`,paddingBottom:0}}>
            {[["Details",false],["Contacts / POC",true]].map(([l,v])=>(
              <button key={l} onClick={()=>setPocTab(v)} style={{padding:"8px 16px",borderRadius:"10px 10px 0 0",border:"none",background:pocTab===v?t.limeBg:"transparent",color:pocTab===v?t.limeDeep:t.textMuted,fontWeight:600,fontSize:13,cursor:"pointer",borderBottom:pocTab===v?`2px solid ${t.lime}`:"2px solid transparent",transition:"all .14s"}}>{l}</button>
            ))}
          </div>

          {!pocTab?(
            <>
              <Field label={`Happiness Score — ${sel.score}%`} t={t}><PBar value={sel.score} max={100} color={sel.score>=80?"lime":sel.score>=65?"amber":"red"} t={t}/><p style={{fontSize:11,color:t.textMuted,marginTop:5}}>{sel.met} deadlines met · {sel.missed} missed</p></Field>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                <Field label="Preferred Communication" t={t}><div style={{fontSize:13,color:t.text,fontWeight:600,padding:"9px 13px",background:t.surfaceAlt,borderRadius:10}}>{sel.preferredComm||"—"}</div></Field>
                <Field label="Google Drive" t={t}><a href={sel.drive} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"9px 13px",background:t.blueBg,color:t.blue,borderRadius:10,fontSize:13,fontWeight:600,textDecoration:"none"}}><ExternalLink size={13}/> Open Drive</a></Field>
              </div>
              {(sel.assetLinks||[]).filter(l=>l).length>0&&<Field label="Asset / Reference Links" t={t}><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{(sel.assetLinks||[]).filter(l=>l).map((l,i)=><a key={i} href={l} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 12px",background:t.surfaceAlt,color:t.textMid,borderRadius:9,fontSize:12,fontWeight:600,textDecoration:"none",border:`1px solid ${t.border}`}}><Link2 size={11}/>Asset {i+1}</a>)}</div></Field>}
              <Field label="Deliverables" t={t}><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{(sel.deliverables||[]).map(d=><span key={d} style={{padding:"4px 10px",background:t.limeBg,borderRadius:99,fontSize:12,color:t.limeDeep,fontWeight:500}}>{d}</span>)}</div></Field>
            </>
          ):(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:600,color:t.textMuted}}>{(sel.pocs||[]).length} contact(s)</div>
                <Btn v="lime" t={t} size="sm" icon={<Plus size={12}/>} onClick={()=>setShowAddPoc(true)}>Add POC</Btn>
              </div>
              {(sel.pocs||[]).length===0?<p style={{color:t.textMuted,fontSize:13}}>No contacts yet.</p>
                :(sel.pocs||[]).map((poc,i)=>(
                  <div key={poc.id} style={{padding:"14px",background:t.surfaceAlt,borderRadius:12,marginBottom:10,animation:`fadeUp .3s ${i*40}ms both`}}>
                    <div style={{fontSize:14,fontWeight:700,color:t.text,marginBottom:3}}>{poc.name}</div>
                    <div style={{fontSize:12,color:t.textMuted,marginBottom:10}}>{poc.designation}</div>
                    <div style={{display:"flex",gap:16}}>
                      <a href={`tel:${poc.phone}`} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:t.blue,textDecoration:"none",fontWeight:500}}><Phone size={12}/>{poc.phone}</a>
                      <a href={`mailto:${poc.email}`} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:t.blue,textDecoration:"none",fontWeight:500}}><Mail size={12}/>{poc.email}</a>
                    </div>
                  </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      <Modal open={showAddPoc} onClose={()=>setShowAddPoc(false)} title="Add Point of Contact" t={t} w={440}>
        <Field label="Name *" t={t}><Inp value={pocForm.name} onChange={e=>setPocForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Ankit Joshi" t={t}/></Field>
        <Field label="Designation" t={t}><Inp value={pocForm.designation} onChange={e=>setPocForm(p=>({...p,designation:e.target.value}))} placeholder="e.g. Marketing Head" t={t}/></Field>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Phone" t={t}><Inp value={pocForm.phone} onChange={e=>setPocForm(p=>({...p,phone:e.target.value}))} placeholder="9800001111" t={t}/></Field>
          <Field label="Email" t={t}><Inp type="email" value={pocForm.email} onChange={e=>setPocForm(p=>({...p,email:e.target.value}))} placeholder="ankit@client.com" t={t}/></Field>
        </div>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:8}}>
          <Btn v="secondary" t={t} onClick={()=>setShowAddPoc(false)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={addPoc} icon={<Plus size={13}/>}>Add Contact</Btn>
        </div>
      </Modal>

      {/* Edit Client Modal */}
      <Modal open={showEdit} onClose={()=>setShowEdit(false)} title="Edit Client" t={t} w={460}>
        {editForm&&<>
          <Field label="Client Name *" t={t}><Inp value={editForm.name} onChange={e=>setEditForm(p=>({...p,name:e.target.value}))} t={t}/></Field>
          <Field label="Industry" t={t}><Inp value={editForm.industry||""} onChange={e=>setEditForm(p=>({...p,industry:e.target.value}))} t={t}/></Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Google Drive Link" t={t}><Inp value={editForm.drive||""} onChange={e=>setEditForm(p=>({...p,drive:e.target.value}))} t={t}/></Field>
            <Field label="Preferred Communication" t={t}><Sel value={editForm.preferredComm||"Email"} onChange={e=>setEditForm(p=>({...p,preferredComm:e.target.value}))} t={t}>{["Email","WhatsApp","Phone","Slack"].map(x=><option key={x}>{x}</option>)}</Sel></Field>
          </div>
          <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:8}}>
            <Btn v="secondary" t={t} onClick={()=>setShowEdit(false)}>Cancel</Btn>
            <Btn v="lime" t={t} onClick={saveEdit} icon={<Check size={13}/>}>Save Changes</Btn>
          </div>
        </>}
      </Modal>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="New Client" t={t} w={500}>
        <Field label="Client Name *" t={t}><Inp value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. L&T Ltd." t={t}/></Field>
        <Field label="Industry" t={t}><Inp value={form.industry} onChange={e=>setForm(p=>({...p,industry:e.target.value}))} placeholder="e.g. Industrial Manufacturing" t={t}/></Field>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Google Drive Link" t={t}><Inp value={form.drive} onChange={e=>setForm(p=>({...p,drive:e.target.value}))} placeholder="https://drive.google.com/..." t={t}/></Field>
          <Field label="Preferred Communication" t={t}><Sel value={form.preferredComm} onChange={e=>setForm(p=>({...p,preferredComm:e.target.value}))} t={t}>{["Email","WhatsApp","Phone","Slack"].map(x=><option key={x}>{x}</option>)}</Sel></Field>
        </div>
        {/* Asset / Reference Links */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,fontWeight:600,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Asset / Reference Links</label>
          {form.assetLinks.map((link,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
              <Inp value={link} onChange={e=>{const a=[...form.assetLinks];a[i]=e.target.value;setForm(p=>({...p,assetLinks:a}));}} placeholder={`Reference link ${i+1}`} t={t}/>
              {form.assetLinks.length>1&&<Btn v="ghost" t={t} size="sm" onClick={()=>setForm(p=>({...p,assetLinks:p.assetLinks.filter((_,j)=>j!==i)}))}><X size={12}/></Btn>}
            </div>
          ))}
          <Btn v="ghost" t={t} size="sm" icon={<Plus size={11}/>} onClick={()=>setForm(p=>({...p,assetLinks:[...p.assetLinks,""]}))}>Add link</Btn>
        </div>
        {/* Initial POC */}
        <div style={{padding:"13px 14px",background:t.surfaceAlt,borderRadius:12,marginBottom:14,border:`1px solid ${t.border}`}}>
          <div style={{fontWeight:700,fontSize:12,color:t.textMid,marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Users size={13}/> Point of Contact (optional — add now or later)</div>
          <Field label="POC Name" t={t}><Inp value={form.poc.name} onChange={e=>setForm(p=>({...p,poc:{...p.poc,name:e.target.value}}))} placeholder="e.g. Ankit Joshi" t={t}/></Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Designation" t={t}><Inp value={form.poc.designation} onChange={e=>setForm(p=>({...p,poc:{...p.poc,designation:e.target.value}}))} placeholder="e.g. Marketing Head" t={t}/></Field>
            <Field label="Phone" t={t}><Inp value={form.poc.phone} onChange={e=>setForm(p=>({...p,poc:{...p.poc,phone:e.target.value}}))} placeholder="98XXXXXXXX" t={t}/></Field>
            <Field label="Email" t={t}><Inp type="email" value={form.poc.email} onChange={e=>setForm(p=>({...p,poc:{...p.poc,email:e.target.value}}))} placeholder="ankit@client.com" t={t}/></Field>
          </div>
        </div>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:4}}>
          <Btn v="secondary" t={t} onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={addClient} icon={<Plus size={13}/>}>Add Client</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ── MEETINGS ─────────────────────────────────────────────────────────────────
function Meetings({t,data,setData,toast,currentUser}){
  const [showAdd,setShowAdd]=useState(false);
  const [sel,setSel]=useState(null);
  const [editingMom,setEditingMom]=useState(false);
  const [momText,setMomText]=useState("");
  const [newAction,setNewAction]=useState({item:"",brief:"",due:"",dueTime:"",owner:"",projectId:""});
  const [form,setForm]=useState({cId:"",projectId:"",date:"",time:"",loc:"",attendees:[],agenda:""});
  const cName=id=>data.clients.find(c=>c.id===id)?.name||"—";
  const uName=id=>data.users.find(u=>u.id===id)?.name||id;
  const today=new Date();

  const toggleAttendee=uid=>setForm(p=>({...p,attendees:p.attendees.includes(uid)?p.attendees.filter(i=>i!==uid):[...p.attendees,uid]}));

  const add=()=>{
    if(!form.cId||!form.date){toast("Client and date required","error");return;}
    const startTime=(form.time||"09:00").replace(/:/g,"")+"00";
    const endHr=String(parseInt((form.time||"09:00").split(":")[0])+1).padStart(2,"0");
    const endTime=endHr+((form.time||"09:00").split(":")[1]||"00")+"00";
    const dateStr=form.date.replace(/-/g,"");
    const calUrl=`https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(cName(form.cId)+" Meeting")}&dates=${dateStr}T${startTime}/${dateStr}T${endTime}&details=${encodeURIComponent(form.agenda||"")}&location=${encodeURIComponent(form.loc||"")}&sf=true&output=xml`;
    const meeting={...form,id:"m"+Date.now(),actions:[],calLink:calUrl,mom:"",createdBy:currentUser?.id};
    setData(d=>({...d,meetings:[...d.meetings,meeting]}));
    // Notify all attendees
    const notifs=form.attendees.filter(uid=>uid!==currentUser?.id).map(uid=>({id:"n"+Date.now()+uid,type:"meeting",title:"Meeting Scheduled",body:`You've been added to a meeting with ${cName(form.cId)} on ${fdt(form.date)}${form.time?" at "+form.time:""}.`,to:uid,from:currentUser?.id,read:false,at:new Date().toISOString()}));
    if(notifs.length>0){
      setData(d=>({...d,meetings:[...d.meetings.slice(0,-1),meeting],notifications:[...d.notifications,...notifs]}));
      form.attendees.filter(uid=>uid!==currentUser?.id).forEach(uid=>{
        const u=data.users.find(x=>x.id===uid);
        sendEmail(u?.email,u?.name,"Meeting: "+cName(form.cId),`Hi ${u?.name},\n\nYou've been scheduled for a meeting.\n\nClient: ${cName(form.cId)}\nDate: ${fdt(form.date)}${form.time?" at "+form.time:""}\nLocation: ${form.loc||"TBD"}\nAgenda: ${form.agenda}\n\nPlease add it to your calendar.\n\n— ProfitPenny Studio OS`);
      });
    }
    setShowAdd(false);setForm({cId:"",date:"",time:"",loc:"",attendees:[],agenda:""});
    toast("Meeting scheduled — attendees notified");
  };

  const saveMom=()=>{
    setData(d=>({...d,meetings:d.meetings.map(m=>m.id===sel?.id?{...m,mom:momText}:m)}));
    setSel(p=>({...p,mom:momText}));setEditingMom(false);toast("Notes saved");
  };

  const addAction=()=>{
    if(!newAction.item)return;
    const action={...newAction,id:"a"+Date.now(),brief:newAction.brief};
    setData(d=>{
      const notifs=[...d.notifications];
      // Notify owner
      if(newAction.owner&&newAction.owner!==currentUser?.id){
        const owner=d.users.find(u=>u.id===newAction.owner);
        notifs.push({id:"n"+Date.now(),type:"action_item",title:"Action Item Assigned",body:`"${newAction.item}" — due ${newAction.due?fd(newAction.due):"TBD"}`,to:newAction.owner,from:currentUser?.id,read:false,at:new Date().toISOString()});
        sendEmail(owner?.email,owner?.name,"Action Item: "+newAction.item,`Hi ${owner?.name},\n\nAn action item has been assigned to you.\n\nItem: ${newAction.item}\nDue: ${newAction.due?fd(newAction.due):"TBD"}\nMeeting: ${d.clients.find(c=>c.id===sel?.cId)?.name||""} on ${fdt(sel?.date)}\n\n— ProfitPenny Studio OS`);
      }
      // Also add as sub-task on the related project task if projectId is set
      let tasks=d.tasks;
      if(sel?.projectId&&newAction.item){
        const subTask={id:"st"+Date.now(),title:newAction.item,done:false,aId:newAction.owner,due:newAction.due,deptId:"",drive:"",refLink:""};
        tasks=d.tasks.map(tk=>tk.id===sel.projectId?{...tk,subtasks:[...(tk.subtasks||[]),subTask]}:tk);
      }
      return {...d,meetings:d.meetings.map(m=>m.id===sel?.id?{...m,actions:[...(m.actions||[]),action]}:m),tasks,notifications:notifs};
    });
    setSel(p=>({...p,actions:[...(p.actions||[]),action]}));
    setNewAction({item:"",brief:"",due:"",dueTime:"",owner:"",projectId:""});toast("Action item added — owner notified");
  };

  const toggleActionDone=actionId=>{
    setData(d=>({...d,meetings:d.meetings.map(m=>m.id===sel?.id?{...m,actions:(m.actions||[]).map(a=>a.id===actionId?{...a,done:!a.done}:a)}:m)}));
    setSel(p=>({...p,actions:(p.actions||[]).map(a=>a.id===actionId?{...a,done:!a.done}:a)}));
  };

  const sorted=[...data.meetings].sort((a,b)=>new Date(a.date)-new Date(b.date));

  return(
    <div>
      <SHead t={t} title="Meetings" sub="Every client interaction — notes, actions, calendar sync"
        action={<Btn v="lime" t={t} onClick={()=>setShowAdd(true)} icon={<Plus size={14}/>}>Schedule</Btn>}/>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {sorted.map((m,i)=>{
          const isPast=new Date(m.date)<today,d=new Date(m.date);
          const pendingActions=(m.actions||[]).filter(a=>!a.done).length;
          return(
            <div key={m.id} className="hover-lift" onClick={()=>{setSel(m);setMomText(m.mom||"");setEditingMom(false);}}
              style={{display:"flex",background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden",cursor:"pointer",animation:`fadeUp .32s ${i*38}ms both`,boxShadow:`0 1px 4px ${t.shadow}`}}>
              <div style={{width:72,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"14px 8px",background:isPast?t.surfaceAlt:t.limeBg,borderRight:`1px solid ${t.border}`}}>
                <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:26,color:isPast?t.textMuted:t.limeDeep,lineHeight:1}}>{d.getDate()}</div>
                <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",color:isPast?t.textMuted:t.limeDeep,letterSpacing:"0.06em"}}>{d.toLocaleDateString("en-IN",{month:"short"})}</div>
                <div style={{fontSize:10,color:isPast?t.textMuted:t.limeDeep,marginTop:3}}>{m.time}</div>
              </div>
              <div style={{flex:1,padding:"14px 18px",display:"flex",alignItems:"center",gap:16}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:t.text,fontFamily:"'Poppins',sans-serif"}}>{cName(m.cId)}</div>
                  <div style={{fontSize:12,color:t.textMuted,marginTop:3,display:"flex",alignItems:"center",gap:6}}><MapPin size={11}/>{m.loc||"TBD"}</div>
                  <div style={{fontSize:12,color:t.textMid,marginTop:4,lineHeight:1.4}}>{m.agenda}</div>
                  {(m.attendees||[]).length>0&&<div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap"}}>{(m.attendees||[]).slice(0,4).map(uid=>{const u=data.users.find(x=>x.id===uid);return u?<Av key={uid} init={u.av} size={20} t={t}/>:null;})}{(m.attendees||[]).length>4&&<span style={{fontSize:10,color:t.textMuted}}>+{(m.attendees||[]).length-4}</span>}</div>}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end",flexShrink:0}}>
                  {m.mom?<Badge label="Notes Done" color="green" t={t} small/>:isPast?<Badge label="Notes Pending" color="red" t={t} small/>:<Badge label="Upcoming" color="lime" t={t} small/>}
                  {pendingActions>0&&<Badge label={`${pendingActions} action${pendingActions>1?"s":""} open`} color="amber" t={t} small/>}
                  <a href={m.calLink} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:t.blue,textDecoration:"none",fontWeight:600,padding:"3px 8px",background:t.blueBg,borderRadius:99}}><CalendarPlus size={11}/>Calendar</a>
                </div>
              </div>
            </div>
          );
        })}
        {sorted.length===0&&<Card t={t}><p style={{color:t.textMuted,textAlign:"center",padding:"20px 0",fontSize:14}}>No meetings yet.</p></Card>}
      </div>

      {/* Meeting Detail Modal */}
      {sel&&(
        <Modal open title={`${cName(sel.cId)} — Meeting`} onClose={()=>{setSel(null);setEditingMom(false);}} t={t} w={640} subtitle={`${fdt(sel.date)}${sel.time?" · "+sel.time:""}${sel.loc?" · "+sel.loc:""}`}>
          <a href={sel.calLink} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 12px",background:t.blueBg,color:t.blue,borderRadius:9,fontSize:12,fontWeight:600,textDecoration:"none",marginBottom:16}}><CalendarPlus size={12}/> Add to Google Calendar</a>

          {/* Attendees */}
          {(sel.attendees||[]).length>0&&<div style={{marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:700,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:7}}>Attendees</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {(sel.attendees||[]).map(uid=>{
                const u=data.users.find(x=>x.id===uid);
                return u?<div key={uid} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",background:t.surfaceAlt,borderRadius:99,fontSize:12}}><Av init={u.av} size={18} t={t}/>{u.name.split(" ")[0]}</div>:null;
              })}
            </div>
          </div>}

          {/* Agenda */}
          {sel.agenda&&<div style={{padding:"10px 14px",background:t.surfaceAlt,borderRadius:10,marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Agenda</div>
            <p style={{margin:0,fontSize:13,color:t.textMid,lineHeight:1.7}}>{sel.agenda}</p>
          </div>}

          {/* MoM */}
          <div style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontSize:11,fontWeight:700,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Meeting Notes (MoM)</div>
              <Btn v="ghost" t={t} size="sm" icon={<Edit size={11}/>} onClick={()=>setEditingMom(!editingMom)}>{editingMom?"Cancel":"Edit"}</Btn>
            </div>
            {editingMom?(
              <div>
                <Tex value={momText} onChange={e=>setMomText(e.target.value)} placeholder="Write meeting notes, key decisions, discussion points..." t={t} rows={5}/>
                <Btn v="lime" t={t} size="sm" style={{marginTop:8}} onClick={saveMom} icon={<Check size={11}/>}>Save Notes</Btn>
              </div>
            ):(
              <p style={{margin:0,fontSize:13,color:sel.mom?t.textMid:t.textMuted,lineHeight:1.7,padding:"11px 13px",background:t.surfaceAlt,borderRadius:10,fontStyle:sel.mom?"normal":"italic",whiteSpace:"pre-wrap"}}>{sel.mom||"No notes yet. Click Edit to add."}</p>
            )}
          </div>

          {/* Action Items */}
          <div>
            <div style={{fontSize:11,fontWeight:700,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Action Items</div>
            {(sel.actions||[]).length===0&&<p style={{fontSize:13,color:t.textMuted,marginBottom:10,fontStyle:"italic"}}>No action items yet.</p>}
            {(sel.actions||[]).map((a,i)=>(
              <div key={a.id||i} onClick={()=>toggleActionDone(a.id)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:a.done?t.greenBg:t.surfaceAlt,border:`1px solid ${a.done?t.green+"40":t.border}`,borderRadius:10,marginBottom:6,cursor:"pointer",transition:"all .15s"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:16,height:16,borderRadius:4,background:a.done?t.green:"transparent",border:`2px solid ${a.done?t.green:t.borderMid}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{a.done&&<Check size={9} color="#fff" strokeWidth={3}/>}</div>
                  <div>
                    <span style={{fontSize:13,color:a.done?t.green:t.text,textDecoration:a.done?"line-through":"none"}}>{a.item}</span>
                    {a.brief&&<div style={{fontSize:11,color:t.textMuted,marginTop:2,lineHeight:1.5}}>{a.brief}</div>}
                  </div>
                </div>
                <div style={{textAlign:"right",marginLeft:12,flexShrink:0}}>
                  <div style={{fontSize:11,color:t.textMuted}}>{uName(a.owner)}</div>
                  {a.due&&<div style={{fontSize:11,color:a.done?t.green:t.lime,fontWeight:600}}>{fd(a.due)}{a.dueTime?" · "+a.dueTime:""}</div>}
                </div>
              </div>
            ))}
            <div style={{marginTop:10,marginBottom:6}}><Tex value={newAction.brief} onChange={e=>setNewAction(p=>({...p,brief:e.target.value}))} placeholder="Brief / notes for this action item (optional)..." t={t} rows={2}/></div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:7,alignItems:"flex-end"}}>
              <Inp value={newAction.item} onChange={e=>setNewAction(p=>({...p,item:e.target.value}))} placeholder="Action item..." t={t}/>
              <div style={{display:"flex",gap:6}}><Inp type="date" value={newAction.due} onChange={e=>setNewAction(p=>({...p,due:e.target.value}))} t={t}/><Inp type="time" value={newAction.dueTime} onChange={e=>setNewAction(p=>({...p,dueTime:e.target.value}))} t={t} style={{width:100}}/></div>
              <Sel value={newAction.owner} onChange={e=>setNewAction(p=>({...p,owner:e.target.value}))} t={t}><option value="">Owner</option>{data.users.filter(u=>u.role!=="Admin").map(u=><option key={u.id} value={u.id}>{u.name.split(" ")[0]}</option>)}</Sel>
              <Btn v="lime" t={t} size="sm" onClick={addAction} icon={<Plus size={12}/>}>Add</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* New Meeting Modal */}
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Schedule Meeting" t={t} w={520}>
        <Field label="Client *" t={t}><Sel value={form.cId} onChange={e=>setForm(p=>({...p,cId:e.target.value,projectId:""}))} t={t}><option value="">Select client</option>{data.clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Sel></Field>
        {form.cId&&<Field label="Related Project (optional)" t={t}><Sel value={form.projectId} onChange={e=>setForm(p=>({...p,projectId:e.target.value}))} t={t}><option value="">No specific project</option>{data.tasks.filter(tk=>tk.cId===form.cId).map(tk=><option key={tk.id} value={tk.id}>{tk.title}</option>)}</Sel></Field>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Date *" t={t}><Inp type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} t={t}/></Field>
          <Field label="Time" t={t}><Inp type="time" value={form.time} onChange={e=>setForm(p=>({...p,time:e.target.value}))} t={t}/></Field>
        </div>
        <Field label="Location / Platform" t={t}><Inp value={form.loc} onChange={e=>setForm(p=>({...p,loc:e.target.value}))} placeholder="Google Meet / Mumbai Office" t={t}/></Field>
        <Field label="Agenda" t={t}><Tex value={form.agenda} onChange={e=>setForm(p=>({...p,agenda:e.target.value}))} t={t} rows={2}/></Field>
        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,fontWeight:600,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:7}}>Attendees (select team members)</label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {data.users.filter(u=>u.role!=="Admin").map(u=>{
              const sel=form.attendees.includes(u.id);
              return <button key={u.id} onClick={()=>toggleAttendee(u.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:99,border:`1.5px solid ${sel?t.lime:t.border}`,background:sel?t.limeBg:"transparent",color:sel?t.limeDeep:t.textMid,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .14s"}}><Av init={u.av} size={16} t={t}/>{u.name.split(" ")[0]}</button>;
            })}
          </div>
        </div>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:8}}>
          <Btn v="secondary" t={t} onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={add} icon={<CalendarPlus size={13}/>}>Schedule Meeting</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ── LEAVES ───────────────────────────────────────────────────────────────────
function Leaves({t,data,setData,toast,currentUser}){
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({uId:"",type:"Casual",from:"",to:"",reason:""});
  const [showUnpaidConfirm,setShowUnpaidConfirm]=useState(false);
  const [unpaidDays,setUnpaidDays]=useState(0);
  const [historyUser,setHistoryUser]=useState(null);
  const isManager=currentUser?.role==="Founder"||currentUser?.role==="Admin"||currentUser?.role==="HoD"||currentUser?.role==="Head of Department"||currentUser?.role==="Manager";

  const days=(f,to)=>!f||!to?0:Math.max(1,Math.round((new Date(to)-new Date(f))/86400000)+1);
  const uName=id=>data.users.find(u=>u.id===id)?.name||"—";
  const getHod=uId=>data.departments.find(d=>d.id===data.users.find(u=>u.id===uId)?.dept)?.hodId;

  const doSubmit=(isUnpaid=false)=>{
    const u=data.users.find(u=>u.id===form.uId);
    if(!u||!form.from||!form.to){toast("Fill all fields","error");return;}
    const d=days(form.from,form.to);
    const hodId=getHod(form.uId)||"u2";
    const lv={...form,id:"l"+Date.now(),days:d,status:"Pending",unpaid:isUnpaid,on:new Date().toISOString().split("T")[0]};
    const notif={id:"n"+Date.now(),type:"leave_request",title:"Leave Request"+(isUnpaid?" (Unpaid)":""),body:u.name+" applied for "+d+"-day "+form.type+(isUnpaid?" unpaid":"")+" leave ("+fd(form.from)+"–"+fd(form.to)+")",to:hodId,from:form.uId,ref:lv.id,refType:"leave",read:false,at:new Date().toISOString()};
    setData(d2=>({...d2,leaves:[...d2.leaves,lv],notifications:[...d2.notifications,notif]}));
    if(isUnpaid){
      sendEmail(u.email,u.name,"Unpaid Leave Acknowledgement","Hi "+u.name+",

This confirms your acknowledgement that your paid leaves are exhausted.

You have applied for "+d+" day(s) of UNPAID leave:
Type: "+form.type+"
From: "+fd(form.from)+"
To: "+fd(form.to)+"
Reason: "+form.reason+"

These days will be deducted from your salary. Please contact HR if you have any questions.

— ProfitPenny Studio OS");
    }
    setShowAdd(false);setShowUnpaidConfirm(false);setForm({uId:"",type:"Casual",from:"",to:"",reason:""});
    toast(isUnpaid?"Unpaid leave applied — acknowledgement sent to your email":"Leave applied — HoD notified","info");
  };

  const submit=()=>{
    const u=data.users.find(u=>u.id===form.uId);
    if(!u||!form.from||!form.to){toast("Fill all fields","error");return;}
    const d=days(form.from,form.to);
    const bal=data.leaveBalances[form.uId]||{total:12,taken:0};
    const avail=bal.total-bal.taken;
    // Already exhausted — force unpaid confirm
    if(avail<=0){setUnpaidDays(d);setShowUnpaidConfirm(true);return;}
    // Will become exhausted/overdraft with this leave
    if(d>avail){setUnpaidDays(d-avail);setShowUnpaidConfirm(true);return;}
    doSubmit(false);
  };

  const respond=(id,status,modifiedDue)=>{
    const lv=data.leaves.find(l=>l.id===id);
    const u=data.users.find(u=>u.id===lv?.uId);
    const notif={id:"n"+Date.now(),type:"leave_"+status.toLowerCase(),title:`Leave ${status}`,body:`Your ${lv?.type} leave (${fd(lv?.from)}–${fd(lv?.to)}) has been ${status.toLowerCase()}`,to:lv?.uId,from:data.currentUser||"u1",ref:id,refType:"leave",read:false,at:new Date().toISOString()};
    setData(d=>({...d,
      leaves:d.leaves.map(l=>l.id===id?{...l,status,modifiedDue:modifiedDue||null}:l),
      leaveBalances:status==="Approved"?{...d.leaveBalances,[lv.uId]:{...(d.leaveBalances[lv.uId]||{total:12,taken:0}),taken:(d.leaveBalances[lv.uId]?.taken||0)+lv.days}}:d.leaveBalances,
      notifications:[...d.notifications,notif]
    }));
    toast(`Leave ${status.toLowerCase()} — ${u?.name} notified via app + email`,"success");
  };

  const approveExt=(tId,modDue)=>{
    const tk=data.tasks.find(t=>t.id===tId);
    const finalDue=modDue||tk?.extRequest?.newDue;
    setData(d=>({...d,
      tasks:d.tasks.map(t=>t.id===tId?{...t,due:finalDue,extRequest:{...t.extRequest,status:"Approved",finalDue}}:t),
      notifications:[...d.notifications,{id:"n"+Date.now(),type:"ext_approved",title:"Extension Approved",body:`Your extension for "${tk?.title}" approved. New deadline: ${fd(finalDue)}`,to:tk?.aId,from:data.currentUser||"u1",ref:tId,refType:"task",read:false,at:new Date().toISOString()}]
    }));
    toast("Extension approved — assignee notified","success");
  };

  const rejectExt=tId=>{
    setData(d=>({...d,tasks:d.tasks.map(t=>t.id===tId?{...t,extRequest:{...t.extRequest,status:"Rejected"}}:t)}));
    toast("Extension rejected","info");
  };

  // Modify state
  const [modLeave,setModLeave]=useState(null);
  const [modDate,setModDate]=useState("");
  const [modExt,setModExt]=useState(null);
  const [modExtDate,setModExtDate]=useState("");

  const pendingExt=data.tasks.filter(tk=>tk.extRequest?.status==="Pending");

  return(
    <div>
      <SHead t={t} title="Leave Tracker" sub="Manage leave approvals and deadline extensions"
        action={<Btn v="lime" t={t} onClick={()=>setShowAdd(true)} icon={<Plus size={14}/>}>Apply Leave</Btn>}/>

      {/* Pending extensions */}
      {pendingExt.length>0&&(
        <div style={{marginBottom:18,animation:"fadeUp .3s both"}}>
          <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:t.purple,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><AlarmClock size={13}/> Deadline Extension Requests ({pendingExt.length})</div>
          {pendingExt.map(tk=>{
            const u=data.users.find(u=>u.id===tk.aId);
            return(
              <Card key={tk.id} t={t} style={{border:`1.5px solid ${t.purple}40`,background:t.purpleBg,marginBottom:10}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                  <Av init={u?.av||"?"} size={36} t={t}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:t.text}}>{tk.title}</div>
                    <div style={{fontSize:12,color:t.textMuted,marginTop:2}}>Reason: {tk.extRequest.reason}</div>
                    <div style={{fontSize:11,color:t.purple,marginTop:3,fontWeight:600}}>Current: {fd(tk.due)} → Requested: {fd(tk.extRequest.newDue)}</div>
                    {modExt===tk.id&&(
                      <div style={{display:"flex",gap:8,alignItems:"center",marginTop:10}}>
                        <span style={{fontSize:12,color:t.textMid,flexShrink:0}}>Set deadline to:</span>
                        <Inp type="date" value={modExtDate} onChange={e=>setModExtDate(e.target.value)} t={t}/>
                        <Btn v="lime" t={t} size="sm" onClick={()=>{approveExt(tk.id,modExtDate);setModExt(null);setModExtDate("");}}>Confirm</Btn>
                        <Btn v="ghost" t={t} size="sm" onClick={()=>setModExt(null)}>Cancel</Btn>
                      </div>
                    )}
                  </div>
                  {modExt!==tk.id&&(
                    <div style={{display:"flex",gap:7,flexShrink:0}}>
                      <Btn v="success"   t={t} size="sm" icon={<ThumbsUp size={12}/>}  onClick={()=>approveExt(tk.id)}>Approve</Btn>
                      <Btn v="secondary" t={t} size="sm" icon={<Edit2 size={12}/>}     onClick={()=>{setModExt(tk.id);setModExtDate(tk.extRequest.newDue);}}>Modify</Btn>
                      <Btn v="danger"    t={t} size="sm" icon={<ThumbsDown size={12}/>}onClick={()=>rejectExt(tk.id)}>Reject</Btn>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Leave balances */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:12,marginBottom:20}}>
        {data.users.filter(u=>u.role!=="Admin").map((u,i)=>{
          const bal=data.leaveBalances[u.id]||{total:12,taken:0};
          const avail=bal.total-bal.taken;
          const pct=Math.round((bal.taken/Math.max(bal.total,1))*100);
          const warn20=pct>=80&&pct<100;
          const exhausted=avail<=0;
          return(
            <Card t={t} key={u.id} lift={isManager} onClick={isManager?()=>setHistoryUser(u):undefined}
              style={{borderTop:`3px solid ${exhausted?t.red:warn20?t.amber:t.lime}`,animation:`fadeUp .36s ${i*40}ms both`,position:"relative"}}>
              {isManager&&<div style={{position:"absolute",top:10,right:10,fontSize:9,color:t.textMuted,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase"}}>View history →</div>}
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <Av init={u.av} size={30} t={t}/>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:t.text}}>{u.name.split(" ")[0]}</div>
                  <div style={{fontSize:10,color:t.textMuted}}>{u.role}</div>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-around",textAlign:"center",marginBottom:10}}>
                {[["Taken",bal.taken,t.textMid],["Left",Math.max(0,avail),exhausted?t.red:warn20?t.amber:t.lime],["Total",bal.total,t.textMuted]].map(([l,v,c])=>(
                  <div key={l}><div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:18,color:c}}>{v}</div><div style={{fontSize:9,textTransform:"uppercase",color:t.textMuted,fontWeight:600}}>{l}</div></div>
                ))}
              </div>
              <PBar value={bal.taken} max={bal.total} color={exhausted?"red":warn20?"amber":"lime"} t={t} h={4} delay={0} showPct={false}/>
              {exhausted&&<div style={{marginTop:8,fontSize:10,fontWeight:700,color:t.red,display:"flex",alignItems:"center",gap:4}}><AlertTriangle size={10}/> Leaves exhausted — next leave will be unpaid</div>}
              {warn20&&!exhausted&&<div style={{marginTop:8,fontSize:10,fontWeight:700,color:t.amber,display:"flex",alignItems:"center",gap:4}}><AlertTriangle size={10}/> Only {avail} day(s) left ({100-pct}% remaining)</div>}
            </Card>
          );
        })}
      </div>

      {/* Leave list */}
      <Card t={t} style={{animation:"fadeUp .4s .18s both"}}>
        <h3 style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:14,color:t.text,marginBottom:14,textTransform:"uppercase",letterSpacing:"0.06em"}}>Leave Requests</h3>
        {data.leaves.map((lv,i)=>{
          const u=data.users.find(u=>u.id===lv.uId);
          return(
            <div key={lv.id} className="row-hover" style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",background:t.surfaceAlt,borderRadius:12,marginBottom:8,animation:`fadeUp .3s ${i*35}ms both`}}>
              <Av init={u?.av||"?"} size={32} t={t}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:t.text}}>{u?.name}</div>
                <div style={{fontSize:11,color:t.textMuted}}>{lv.type} · {lv.days} day(s) · {fd(lv.from)}–{fd(lv.to)}</div>
                <div style={{fontSize:11,color:t.textMuted,fontStyle:"italic",marginTop:2}}>{lv.reason}</div>
                {modLeave===lv.id&&(
                  <div style={{display:"flex",gap:8,alignItems:"center",marginTop:10}}>
                    <span style={{fontSize:12,color:t.textMid,flexShrink:0}}>Approve with modified end date:</span>
                    <Inp type="date" value={modDate} onChange={e=>setModDate(e.target.value)} t={t}/>
                    <Btn v="lime" t={t} size="sm" onClick={()=>{respond(lv.id,"Approved",modDate);setModLeave(null);setModDate("");}}>Confirm</Btn>
                    <Btn v="ghost" t={t} size="sm" onClick={()=>setModLeave(null)}>Cancel</Btn>
                  </div>
                )}
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:7}}>
                <Badge label={lv.status} color={SC(lv.status)} t={t}/>
                {lv.status==="Pending"&&modLeave!==lv.id&&(
                  <div style={{display:"flex",gap:6}}>
                    <Btn v="success"   t={t} size="sm" icon={<Check size={11}/>}  onClick={()=>respond(lv.id,"Approved")}>Approve</Btn>
                    <Btn v="secondary" t={t} size="sm" icon={<Edit2 size={11}/>}  onClick={()=>{setModLeave(lv.id);setModDate(lv.to);}}>Modify</Btn>
                    <Btn v="danger"    t={t} size="sm" icon={<X size={11}/>}      onClick={()=>respond(lv.id,"Rejected")}>Reject</Btn>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </Card>

      {/* Unpaid leave confirmation */}
      <Modal open={showUnpaidConfirm} onClose={()=>setShowUnpaidConfirm(false)} title="⚠️ Paid Leaves Exhausted" t={t} w={420}>
        <div style={{padding:"16px",background:t.redBg,borderRadius:12,marginBottom:16,border:`1px solid ${t.red}30`}}>
          <div style={{fontSize:14,fontWeight:700,color:t.red,marginBottom:8}}>Your paid leaves are fully used up.</div>
          <div style={{fontSize:13,color:t.textMid,lineHeight:1.7}}>
            {unpaidDays>0&&<>This leave request includes <strong>{unpaidDays} unpaid day(s)</strong> that will be deducted from your salary.<br/></>}
            By confirming, you acknowledge that this leave (or part of it) will be <strong>unpaid</strong> and a confirmation email will be sent to your registered address.
          </div>
        </div>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
          <Btn v="secondary" t={t} onClick={()=>setShowUnpaidConfirm(false)}>Cancel</Btn>
          <Btn v="danger" t={t} onClick={()=>doSubmit(true)} icon={<Send size={13}/>}>Yes, submit as unpaid</Btn>
        </div>
      </Modal>

      {/* Member leave history modal */}
      {historyUser&&(()=>{
        const userLeaves=data.leaves.filter(l=>l.uId===historyUser.id).sort((a,b)=>new Date(b.on)-new Date(a.on));
        const bal=data.leaveBalances[historyUser.id]||{total:12,taken:0};
        const avail=bal.total-bal.taken;
        return(
          <Modal open={true} onClose={()=>setHistoryUser(null)} title={"Leave History — "+historyUser.name} t={t} w={500}>
            <div style={{display:"flex",gap:12,marginBottom:16}}>
              {[["Taken",bal.taken,t.textMid],["Remaining",Math.max(0,avail),avail>0?t.lime:t.red],["Total",bal.total,t.textMuted]].map(([l,v,c])=>(
                <div key={l} style={{flex:1,textAlign:"center",padding:"12px 8px",background:t.surfaceAlt,borderRadius:12,border:`1px solid ${t.border}`}}>
                  <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:22,color:c}}>{v}</div>
                  <div style={{fontSize:10,textTransform:"uppercase",color:t.textMuted,fontWeight:600,marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
            <PBar value={bal.taken} max={bal.total} color={avail<=0?"red":avail<=2?"amber":"lime"} t={t} h={6} delay={0} showPct={true}/>
            <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:8}}>
              {userLeaves.length===0&&<div style={{textAlign:"center",padding:"24px 0",color:t.textMuted,fontSize:13}}>No leaves taken yet. 🎉</div>}
              {userLeaves.map(lv=>(
                <div key={lv.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:t.surfaceAlt,borderRadius:10,border:`1px solid ${lv.status==="Approved"?t.green+"30":lv.status==="Rejected"?t.red+"30":t.border}`}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:t.text}}>{lv.type} leave{lv.unpaid?" (Unpaid)":""}</div>
                    <div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{fd(lv.from)} → {fd(lv.to)} · {lv.days} day(s)</div>
                    {lv.reason&&<div style={{fontSize:11,color:t.textMuted,fontStyle:"italic",marginTop:2}}>{lv.reason}</div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                    <Badge label={lv.status} color={SC(lv.status)} t={t} small/>
                    {lv.unpaid&&<Badge label="Unpaid" color="red" t={t} small/>}
                    <div style={{fontSize:10,color:t.textMuted}}>{fd(lv.on)}</div>
                  </div>
                </div>
              ))}
            </div>
          </Modal>
        );
      })()}

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Apply for Leave" t={t} w={440}>
        <Field label="Team Member *" t={t}><Sel value={form.uId} onChange={e=>setForm(p=>({...p,uId:e.target.value}))} t={t}><option value="">Select</option>{data.users.filter(u=>u.role!=="Admin").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</Sel></Field>
        <Field label="Leave Type" t={t}><Sel value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} t={t}>{["Casual","Sick","Earned"].map(l=><option key={l}>{l}</option>)}</Sel></Field>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="From *" t={t}><Inp type="date" value={form.from} onChange={e=>setForm(p=>({...p,from:e.target.value}))} t={t}/></Field>
          <Field label="To *"   t={t}><Inp type="date" value={form.to}   onChange={e=>setForm(p=>({...p,to:e.target.value}))} t={t}/></Field>
        </div>
        {(()=>{
          const selBal=form.uId?(data.leaveBalances[form.uId]||{total:12,taken:0}):{total:12,taken:0};
          const selAvail=selBal.total-selBal.taken;
          const selPct=Math.round((selBal.taken/Math.max(selBal.total,1))*100);
          const d=days(form.from,form.to);
          return(<>
            {form.from&&form.to&&<div style={{fontSize:12,color:t.lime,fontWeight:600,marginBottom:8,marginTop:-6}}>{d} day(s) selected</div>}
            {form.uId&&selAvail<=0&&<div style={{padding:"10px 12px",background:t.redBg,border:`1px solid ${t.red}40`,borderRadius:10,marginBottom:10,fontSize:12,color:t.red,display:"flex",gap:8,alignItems:"flex-start"}}><AlertTriangle size={14} style={{flexShrink:0,marginTop:1}}/><div><strong>⚠️ No paid leaves left!</strong> {selBal.taken} of {selBal.total} days used. Submitting will trigger an unpaid leave — you{"'"}ll be asked to confirm.</div></div>}
            {form.uId&&selAvail>0&&selPct>=80&&<div style={{padding:"10px 12px",background:t.amberBg,border:`1px solid ${t.amber}40`,borderRadius:10,marginBottom:10,fontSize:12,color:t.amber,display:"flex",gap:8,alignItems:"flex-start"}}><AlertTriangle size={14} style={{flexShrink:0,marginTop:1}}/><div><strong>Only {selAvail} day(s) remaining</strong> ({selPct}% used). Use them wisely!</div></div>}
          </>);
        })()}
        <Field label="Reason" t={t}><Inp value={form.reason} onChange={e=>setForm(p=>({...p,reason:e.target.value}))} placeholder="Brief reason" t={t}/></Field>
        <div style={{padding:"10px 12px",background:t.limeBg,borderRadius:10,marginBottom:14,fontSize:12,color:t.limeDeep,display:"flex",alignItems:"center",gap:6}}><Zap size={12}/> HoD notified instantly via app + email</div>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
          <Btn v="secondary" t={t} onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={submit} icon={<Send size={13}/>}>{(()=>{const b=data.leaveBalances[form.uId]||{total:12,taken:0};return(b.total-b.taken)<=0?"Submit (Unpaid)":"Submit";})()}</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ── DEPARTMENTS ───────────────────────────────────────────────────────────────
function Departments({t,data,setData,toast}){
  const [showAdd,setShowAdd]=useState(false);
  const [editDept,setEditDept]=useState(null);
  const [form,setForm]=useState({name:"",managerId:"",hodId:"",color:t.lime});
  const add=()=>{
    if(!form.name){toast("Department name required","error");return;}
    setData(d=>({...d,departments:[...d.departments,{...form,id:"d"+Date.now()}]}));
    setShowAdd(false);setForm({name:"",managerId:"",hodId:"",color:t.lime});toast("Department created");
  };
  const save=()=>{
    if(!editDept.name){toast("Name required","error");return;}
    setData(d=>({...d,departments:d.departments.map(dp=>dp.id===editDept.id?editDept:dp)}));
    setEditDept(null);toast("Department updated");
  };
  const del=id=>{
    if(!window.confirm("Delete this department? Members will become unassigned."))return;
    setData(d=>({...d,departments:d.departments.filter(dp=>dp.id!==id)}));
    deleteDoc_(COLS.DEPARTMENTS,id).catch(()=>{});
    toast("Department deleted","info");
  };
  return(
    <div>
      <SHead t={t} title="Departments" sub="Company structure — departments, managers, and HoDs"
        action={<Btn v="lime" t={t} onClick={()=>setShowAdd(true)} icon={<Plus size={14}/>}>New Department</Btn>}/>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {data.departments.map((dept,i)=>{
          const members=data.users.filter(u=>u.dept===dept.id);
          const hod=data.users.find(u=>u.id===dept.hodId);
          const mgr=data.users.find(u=>u.id===dept.managerId);
          const dTasks=data.tasks.filter(tk=>members.some(m=>m.id===tk.aId));
          return(
            <Card t={t} key={dept.id} style={{animation:`fadeUp .38s ${i*50}ms both`,borderLeft:`4px solid ${dept.color}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,paddingBottom:16,borderBottom:`1px solid ${t.border}`}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:12,background:dept.color+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><Building2 size={20} color={dept.color}/></div>
                  <div><div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:17,color:t.text}}>{dept.name}</div><div style={{fontSize:12,color:t.textMuted,marginTop:2}}>{members.length} members · {dTasks.length} tasks</div></div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  {[["Tasks",dTasks.length,"text"],["Done",dTasks.filter(tk=>tk.status==="Completed").length,"lime"],["Active",dTasks.filter(tk=>tk.status==="In Progress").length,"blue"]].map(([l,v,c])=>(
                    <div key={l} style={{textAlign:"center",padding:"8px 14px",background:t.surfaceAlt,borderRadius:10}}>
                      <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:20,color:t[c]}}>{v}</div>
                      <div style={{fontSize:9,textTransform:"uppercase",color:t.textMuted,fontWeight:600}}>{l}</div>
                    </div>
                  ))}
                  <button onClick={()=>setEditDept({...dept})} title="Edit" style={{background:"none",border:"none",cursor:"pointer",color:t.textMuted,padding:6,borderRadius:8,display:"flex",transition:"color .15s"}} onMouseEnter={e=>e.currentTarget.style.color=t.text} onMouseLeave={e=>e.currentTarget.style.color=t.textMuted}><Edit2 size={14}/></button>
                  <button onClick={()=>del(dept.id)} title="Delete" style={{background:"none",border:"none",cursor:"pointer",color:t.textMuted,padding:6,borderRadius:8,display:"flex",transition:"color .15s"}} onMouseEnter={e=>e.currentTarget.style.color=t.red} onMouseLeave={e=>e.currentTarget.style.color=t.textMuted}><Trash2 size={14}/></button>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
                <div>
                  <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:t.textMuted,marginBottom:8,display:"flex",alignItems:"center",gap:5}}><Shield size={10}/> Company Manager</div>
                  {mgr?<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:t.surfaceAlt,borderRadius:10}}><Av init={mgr.av} size={30} t={t}/><div><div style={{fontSize:13,fontWeight:600,color:t.text}}>{mgr.name}</div><div style={{fontSize:10,color:t.textMuted}}>{mgr.role}</div></div></div>:<div style={{fontSize:12,color:t.textMuted}}>Not assigned</div>}
                </div>
                <div>
                  <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:t.textMuted,marginBottom:8,display:"flex",alignItems:"center",gap:5}}><Crown size={10}/> Head of Department</div>
                  {hod?<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:dept.color+"15",borderRadius:10,border:`1.5px solid ${dept.color}40`}}><Av init={hod.av} size={30} t={t}/><div><div style={{fontSize:13,fontWeight:600,color:t.text}}>{hod.name}</div><div style={{fontSize:10,color:t.textMuted}}>{hod.role}</div></div></div>:<div style={{fontSize:12,color:t.textMuted}}>Not assigned</div>}
                </div>
                <div>
                  <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:t.textMuted,marginBottom:8,display:"flex",alignItems:"center",gap:5}}><Users size={10}/> Team Members</div>
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    {members.filter(m=>m.id!==dept.hodId).map(m=>(
                      <div key={m.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:t.surfaceAlt,borderRadius:8}}>
                        <Av init={m.av} size={22} t={t} online={m.active}/>
                        <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</div><div style={{fontSize:10,color:t.textMuted}}>{m.role}</div></div>
                      </div>
                    ))}
                    {members.filter(m=>m.id!==dept.hodId).length===0&&<div style={{fontSize:12,color:t.textMuted}}>No members yet</div>}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="New Department" t={t} w={460}>
        <Field label="Department Name *" t={t}><Inp value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Motion Design" t={t}/></Field>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Company Manager" t={t}><Sel value={form.managerId} onChange={e=>setForm(p=>({...p,managerId:e.target.value}))} t={t}><option value="">Select</option>{data.users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</Sel></Field>
          <Field label="Head of Department (optional)" t={t}><Sel value={form.hodId} onChange={e=>setForm(p=>({...p,hodId:e.target.value}))} t={t}><option value="">Select</option>{data.users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</Sel></Field>
        </div>
        <Field label="Accent Color" t={t}><div style={{display:"flex",gap:10,alignItems:"center"}}><input type="color" value={form.color} onChange={e=>setForm(p=>({...p,color:e.target.value}))} style={{width:40,height:36,border:"none",borderRadius:8,cursor:"pointer",background:"none"}}/><span style={{fontSize:12,color:t.textMuted}}>{form.color}</span></div></Field>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:8}}>
          <Btn v="secondary" t={t} onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={add} icon={<Plus size={13}/>}>Create</Btn>
        </div>
      </Modal>
      {editDept&&<Modal open onClose={()=>setEditDept(null)} title="Edit Department" t={t} w={460}>
        <Field label="Department Name *" t={t}><Inp value={editDept.name} onChange={e=>setEditDept(p=>({...p,name:e.target.value}))} t={t}/></Field>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Company Manager" t={t}><Sel value={editDept.managerId||""} onChange={e=>setEditDept(p=>({...p,managerId:e.target.value}))} t={t}><option value="">Select</option>{data.users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</Sel></Field>
          <Field label="Head of Department" t={t}><Sel value={editDept.hodId||""} onChange={e=>setEditDept(p=>({...p,hodId:e.target.value}))} t={t}><option value="">Select</option>{data.users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</Sel></Field>
        </div>
        <Field label="Accent Color" t={t}><div style={{display:"flex",gap:10,alignItems:"center"}}><input type="color" value={editDept.color} onChange={e=>setEditDept(p=>({...p,color:e.target.value}))} style={{width:40,height:36,border:"none",borderRadius:8,cursor:"pointer",background:"none"}}/></div></Field>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:8}}>
          <Btn v="secondary" t={t} onClick={()=>setEditDept(null)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={save}>Save Changes</Btn>
        </div>
      </Modal>}
    </div>
  );
}

// ── TEAM ─────────────────────────────────────────────────────────────────────
function Team({t,data,setData,toast}){
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({name:"",email:"",phone:"",role:"",dept:"",dob:""});
  const [editMember,setEditMember]=useState(null);

  const del=id=>{
    if(!window.confirm("Remove this team member?"))return;
    setData(d=>({...d,users:d.users.filter(u=>u.id!==id)}));
    deleteDoc_(COLS.USERS,id).catch(()=>{});
    toast("Member removed","info");
  };
  const saveEdit=()=>{
    if(!editMember.name){toast("Name required","error");return;}
    setData(d=>({...d,users:d.users.map(u=>u.id===editMember.id?editMember:u)}));
    setEditMember(null);toast("Member updated");
  };
  const deptColor=id=>data.departments.find(d=>d.id===id)?.color||t.lime;
  const deptName=id=>data.departments.find(d=>d.id===id)?.name||"—";

  // Birthday reminder check
  useEffect(()=>{
    const today=new Date();
    const todayStr=`${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
    const weekStr=new Date(Date.now()+7*86400000);
    const weekMD=`${String(weekStr.getMonth()+1).padStart(2,"0")}-${String(weekStr.getDate()).padStart(2,"0")}`;
    data.users.forEach(u=>{
      if(!u.dob)return;
      const md=u.dob.slice(5);
      if(md===todayStr){const exists=data.notifications.some(n=>n.type==="birthday_today"&&n.ref===u.id&&n.at.startsWith(new Date().toISOString().split("T")[0]));if(!exists){setData(d=>({...d,notifications:[...d.notifications,{id:"n"+Date.now(),type:"birthday_today",title:"🎂 Birthday Today!",body:`Today is ${u.name}'s birthday! Wish them.`,to:"all",from:"system",ref:u.id,refType:"user",read:false,at:new Date().toISOString()}]}));}}
      if(md===weekMD){const exists=data.notifications.some(n=>n.type==="birthday_week"&&n.ref===u.id&&n.at.startsWith(new Date().toISOString().split("T")[0]));if(!exists){setData(d=>({...d,notifications:[...d.notifications,{id:"n"+Date.now(),type:"birthday_week",title:"🎂 Birthday in 1 Week",body:u.name+"'s birthday is in 1 week ("+fd(u.dob.slice(0,4)==="1970"?u.dob:"2026-"+u.dob.slice(5))+").",to:"managers",from:"system",ref:u.id,refType:"user",read:false,at:new Date().toISOString()}]}));}}
    });
  },[]);

  const add=async()=>{
    if(!form.name||!form.email){toast("Name and email required","error");return;}
    toast("Adding member & sending invite…","info");
    const initials=form.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
    const newUser={...form,id:"u"+Date.now(),av:initials,active:true,uid:""};
    setData(d=>({...d,users:[...d.users,newUser]}));
    setShowAdd(false);setForm({name:"",email:"",phone:"",role:"",dept:"",dob:""});
    // Try to send invite email via Firebase password reset
    const result = await inviteUser(form.email, form.name);
    if(result.sent){
      toast(`${form.name} added — invite email sent!`,"success");
    } else {
      // Email couldn't be sent (user doesn't exist in Firebase Auth yet)
      // Admin should create them in the Admin Console
      toast(`${form.name} added. ⚠ To give login access, create their account in the Admin Console.`,"info",7000);
      sendEmail(form.email,form.name,"You've been added to ProfitPenny Studio OS",`Hi ${form.name},\n\nYou have been added to the ProfitPenny Studio OS workspace.\n\nTo log in, please contact your admin to get your login credentials set up.\n\nWorkspace: ${window.location.origin}\n\n— ProfitPenny Studio OS`);
    }
  };

  return(
    <div>
      <SHead t={t} title="Team" sub="Members, roles, contact info and birthday reminders"
        action={<Btn v="lime" t={t} onClick={()=>setShowAdd(true)} icon={<Plus size={14}/>}>Add Member</Btn>}/>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {data.users.filter(u=>u.role!=="Admin").map((m,i)=>{
          const tasks=data.tasks.filter(tk=>tk.aId===m.id);
          const dept=data.departments.find(d=>d.id===m.dept);
          const today=new Date();
          const todayMD=`${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
          const isBday=m.dob&&m.dob.slice(5)===todayMD;
          return(
            <Card t={t} key={m.id} style={{animation:`fadeUp .36s ${i*45}ms both`,border:`1px solid ${isBday?t.amber+"60":t.border}`}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <div style={{position:"relative"}}><Av init={m.av} size={46} t={t} online={m.active}/>{isBday&&<div style={{position:"absolute",top:-4,right:-4,fontSize:14}}>🎂</div>}</div>
                  <div>
                    <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:15,color:t.text,display:"flex",alignItems:"center",gap:8}}>{m.name}{isBday&&<Badge label="Birthday Today!" color="amber" t={t} small/>}</div>
                    <div style={{fontSize:12,color:t.textMuted,marginTop:3,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                      <span style={{color:deptColor(m.dept),fontWeight:600}}>{deptName(m.dept)}</span>
                      <span>{m.role}</span>
                      {m.email&&<a href={`mailto:${m.email}`} style={{display:"flex",alignItems:"center",gap:4,color:t.blue,textDecoration:"none"}}><Mail size={11}/>{m.email}</a>}
                      {m.phone&&<a href={`tel:${m.phone}`} style={{display:"flex",alignItems:"center",gap:4,color:t.blue,textDecoration:"none"}}><Phone size={11}/>{m.phone}</a>}
                      {m.dob&&<span style={{display:"flex",alignItems:"center",gap:4}}><Cake size={11} color={t.textMuted}/>{new Date(m.dob).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</span>}
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  {[["Tasks",tasks.length,"text"],["Done",tasks.filter(tk=>tk.status==="Completed").length,"lime"],["Delayed",tasks.filter(tk=>tk.status==="Delayed").length,"red"]].map(([l,v,c])=>(
                    <div key={l} style={{textAlign:"center",padding:"7px 12px",background:t.surfaceAlt,borderRadius:10}}>
                      <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:18,color:t[c]}}>{v}</div>
                      <div style={{fontSize:9,textTransform:"uppercase",color:t.textMuted,fontWeight:600}}>{l}</div>
                    </div>
                  ))}
                  <button onClick={()=>setEditMember({...m})} title="Edit" style={{background:"none",border:"none",cursor:"pointer",color:t.textMuted,padding:6,borderRadius:8,display:"flex",transition:"color .15s"}} onMouseEnter={e=>e.currentTarget.style.color=t.text} onMouseLeave={e=>e.currentTarget.style.color=t.textMuted}><Edit2 size={14}/></button>
                  <button onClick={()=>del(m.id)} title="Remove" style={{background:"none",border:"none",cursor:"pointer",color:t.textMuted,padding:6,borderRadius:8,display:"flex",transition:"color .15s"}} onMouseEnter={e=>e.currentTarget.style.color=t.red} onMouseLeave={e=>e.currentTarget.style.color=t.textMuted}><Trash2 size={14}/></button>
                </div>
              </div>
              {tasks.length>0&&(
                <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:5}}>
                  {tasks.map((task,j)=>(
                    <div key={task.id} className="row-hover" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 12px",background:t.surfaceAlt,borderRadius:9}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        {task.status==="In Progress"&&task.startedAt&&<LiveTimer startedAt={task.startedAt} t={t} active/>}
                        <span style={{fontSize:12,fontWeight:600,color:t.text}}>{task.title}</span>
                      </div>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <span style={{fontSize:11,color:isOverdue(task.due)&&task.status!=="Completed"?t.red:t.textMuted}}>Due {fd(task.due)}</span>
                        <Badge label={task.status} color={SC(task.status)} t={t} small/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Team Member" t={t} w={480}>
        <Field label="Full Name *" t={t}><Inp value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Ananya Sharma" t={t}/></Field>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Work Email *" t={t}><Inp type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="ananya@profitpenny.in" t={t}/></Field>
          <Field label="Phone" t={t}><Inp value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="98XXXXXXXX" t={t}/></Field>
          <Field label="Role / Designation *" t={t}><Inp value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} placeholder="e.g. Senior Designer" t={t}/></Field>
          <Field label="Department (optional)" t={t}><DeptSel value={form.dept} onChange={v=>setForm(p=>({...p,dept:v}))} data={data} setData={setData} t={t} toast={toast}/></Field>
          <Field label="Date of Birth" t={t}><Inp type="date" value={form.dob} onChange={e=>setForm(p=>({...p,dob:e.target.value}))} t={t}/></Field>
        </div>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:8}}>
          <Btn v="secondary" t={t} onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={add} icon={<Plus size={13}/>}>Add Member</Btn>
        </div>
      </Modal>
      {editMember&&<Modal open onClose={()=>setEditMember(null)} title="Edit Member" t={t} w={480}>
        <Field label="Full Name *" t={t}><Inp value={editMember.name} onChange={e=>setEditMember(p=>({...p,name:e.target.value}))} t={t}/></Field>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Work Email" t={t}><Inp type="email" value={editMember.email||""} onChange={e=>setEditMember(p=>({...p,email:e.target.value}))} t={t}/></Field>
          <Field label="Phone" t={t}><Inp value={editMember.phone||""} onChange={e=>setEditMember(p=>({...p,phone:e.target.value}))} t={t}/></Field>
          <Field label="Role / Designation" t={t}><Inp value={editMember.role||""} onChange={e=>setEditMember(p=>({...p,role:e.target.value}))} t={t}/></Field>
          <Field label="Department" t={t}><DeptSel value={editMember.dept||""} onChange={v=>setEditMember(p=>({...p,dept:v}))} data={data} setData={setData} t={t} toast={toast}/></Field>
          <Field label="Date of Birth" t={t}><Inp type="date" value={editMember.dob||""} onChange={e=>setEditMember(p=>({...p,dob:e.target.value}))} t={t}/></Field>
        </div>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:8}}>
          <Btn v="secondary" t={t} onClick={()=>setEditMember(null)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={saveEdit}>Save Changes</Btn>
        </div>
      </Modal>}
    </div>
  );
}

// ── BOARD VIEW ────────────────────────────────────────────────────────────────
function BoardView({t,data,setData,toast,currentUser}){
  const COLS_BOARD=["Not Started","In Progress","Review","Rework","Completed"];
  const uName=id=>data.users.find(u=>u.id===id)?.name||"—";
  const cName=id=>data.clients.find(c=>c.id===id)?.name||"—";
  const colColor={"Not Started":t.textMuted,"In Progress":t.blue,"Review":t.amber,"Rework":t.purple,"Completed":t.green};
  const [dragId,setDragId]=useState(null);
  const [sel,setSel]=useState(null);          // selected task for detail modal
  const [comment,setComment]=useState("");    // new comment text
  const [reviewModal,setReviewModal]=useState(null); // {taskId} - pick reviewer
  const [reviewerId,setReviewerId]=useState("");

  const move=(taskId,newStatus)=>{
    const task=data.tasks.find(t=>t.id===taskId);
    if(!task)return;
    // When moving to "Review" — open reviewer picker first
    if(newStatus==="Review"&&task.status!=="Review"){
      setReviewModal({taskId,newStatus});
      setReviewerId("");
      return;
    }
    const was=task.status;
    setData(d=>{
      const tasks=d.tasks.map(tk=>tk.id===taskId?{...tk,status:newStatus,startedAt:newStatus==="In Progress"&&!tk.startedAt?new Date().toISOString():tk.startedAt}:tk);
      // Notify assignee if someone else changed status
      const notifs=[...d.notifications];
      if(currentUser&&currentUser.id!==task.aId){
        notifs.push({id:"n"+Date.now(),type:"task_update",title:"Task Status Updated",body:`"${task.title}" moved from ${was} → ${newStatus}`,to:task.aId,from:currentUser.id,ref:taskId,refType:"task",read:false,at:new Date().toISOString()});
        const assignee=d.users.find(u=>u.id===task.aId);
        sendEmail(assignee?.email,assignee?.name,"Task Updated: "+task.title,`Hi ${assignee?.name},\n\nYour task "${task.title}" has been moved from ${was} to ${newStatus}.\n\n— ProfitPenny Studio OS`);
      }
      return {...d,tasks,notifications:notifs};
    });
    if(sel?.id===taskId)setSel(p=>({...p,status:newStatus}));
  };

  const confirmReview=()=>{
    if(!reviewerId){toast("Select a reviewer","error");return;}
    const {taskId}=reviewModal;
    const task=data.tasks.find(t=>t.id===taskId);
    if(!task)return;
    setData(d=>{
      const tasks=d.tasks.map(tk=>tk.id===taskId?{...tk,status:"Review",reviewerId}:tk);
      const reviewer=d.users.find(u=>u.id===reviewerId);
      const notifs=[...d.notifications,{id:"n"+Date.now(),type:"review_request",title:"Review Requested",body:`${currentUser?.name||"Someone"} has sent "${task.title}" for your review.`,to:reviewerId,from:currentUser?.id,ref:taskId,refType:"task",read:false,at:new Date().toISOString()}];
      sendEmail(reviewer?.email,reviewer?.name,"Review Requested: "+task.title,`Hi ${reviewer?.name},\n\n${currentUser?.name||"A team member"} has requested your review on the task "${task.title}".\n\nPlease open the app to review it.\n\n— ProfitPenny Studio OS`);
      return {...d,tasks,notifications:notifs};
    });
    setReviewModal(null);setReviewerId("");
    toast("Sent for review — reviewer notified");
  };

  const addComment=()=>{
    if(!comment.trim()||!sel)return;
    const c={id:"c"+Date.now(),text:comment.trim(),by:currentUser?.id,byName:currentUser?.name||"You",at:new Date().toISOString()};
    setData(d=>({...d,tasks:d.tasks.map(tk=>tk.id===sel.id?{...tk,comments:[...(tk.comments||[]),c]}:tk)}));
    setSel(p=>({...p,comments:[...(p.comments||[]),c]}));
    setComment("");
    // Notify assignee if commenter is different
    if(currentUser&&currentUser.id!==sel.aId){
      const assignee=data.users.find(u=>u.id===sel.aId);
      setData(d=>({...d,notifications:[...d.notifications,{id:"n"+Date.now(),type:"comment",title:"New Comment on Your Task",body:`${currentUser.name}: "${comment.trim().slice(0,60)}${comment.trim().length>60?"...":""}"`,to:sel.aId,from:currentUser.id,ref:sel.id,refType:"task",read:false,at:new Date().toISOString()}]}));
    }
  };

  const taskForSel=sel?data.tasks.find(t=>t.id===sel.id)||sel:null;

  return(
    <div>
      <SHead t={t} title="My Board" sub="Kanban view — drag tasks across columns, click a card for details"/>
      <div style={{display:"flex",gap:14,overflowX:"auto",paddingBottom:12,alignItems:"flex-start"}}>
        {COLS_BOARD.map(col=>{
          const tasks=data.tasks.filter(tk=>tk.status===col);
          return(
            <div key={col} style={{minWidth:230,maxWidth:250,flexShrink:0,background:t.surfaceAlt,borderRadius:14,padding:12,borderTop:`3px solid ${colColor[col]}`}}
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>{e.preventDefault();if(dragId)move(dragId,col);setDragId(null);}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:colColor[col]}}>{col}</span>
                <span style={{fontSize:11,fontWeight:700,color:t.textMuted,background:t.surface,borderRadius:99,padding:"1px 8px"}}>{tasks.length}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {tasks.map(task=>(
                  <div key={task.id} draggable
                    onDragStart={()=>setDragId(task.id)}
                    onClick={()=>setSel(task)}
                    style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:10,padding:"11px 12px",cursor:"pointer",transition:"all .15s",userSelect:"none",position:"relative"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=colColor[col];e.currentTarget.style.boxShadow=`0 4px 16px ${t.shadowMd}`;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.boxShadow="none";}}>
                    {/* Priority strip */}
                    <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,borderRadius:"10px 0 0 10px",background:task.priority==="Urgent"?t.red:task.priority==="High"?t.amber:task.priority==="Medium"?t.blue:t.textMuted}}/>
                    <div style={{paddingLeft:6}}>
                      <div style={{fontSize:12,fontWeight:700,color:t.text,marginBottom:4,lineHeight:1.4}}>{task.title}</div>
                      <div style={{fontSize:11,color:t.textMuted,marginBottom:6}}>{cName(task.cId).split(" ")[0]}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          <Av init={data.users.find(u=>u.id===task.aId)?.av||"?"} size={20} t={t}/>
                          <span style={{fontSize:11,color:t.textMuted}}>{uName(task.aId).split(" ")[0]}</span>
                        </div>
                        <span style={{fontSize:10,color:isOverdue(task.due)&&col!=="Completed"?t.red:t.textMuted,fontWeight:600}}>{task.due?fd(task.due):"No date"}</span>
                      </div>
                      {task.status==="In Progress"&&task.startedAt&&<div style={{marginTop:5,display:"flex",alignItems:"center",gap:4}}><div style={{width:5,height:5,borderRadius:"50%",background:t.lime,animation:"ping 1.5s ease-out infinite"}}/><LiveTimer startedAt={task.startedAt} t={t} active/></div>}
                      {(task.comments||[]).length>0&&<div style={{marginTop:5,fontSize:10,color:t.textMuted,display:"flex",alignItems:"center",gap:3}}><Hash size={9}/>{task.comments.length} comment{task.comments.length!==1?"s":""}</div>}
                    </div>
                  </div>
                ))}
                {tasks.length===0&&<div style={{fontSize:12,color:t.textMuted,textAlign:"center",padding:"16px 0",opacity:0.4,borderRadius:8,border:`1.5px dashed ${t.border}`}}>Drop here</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      {sel&&taskForSel&&(
        <Modal open title={taskForSel.title} onClose={()=>setSel(null)} t={t} w={620} subtitle={`${cName(taskForSel.cId)} · ${uName(taskForSel.aId)}`}>
          {/* Status + priority badges */}
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
            <Badge label={taskForSel.status} color={SC(taskForSel.status)} t={t}/>
            <Badge label={taskForSel.priority||"Medium"} color={PC(taskForSel.priority)} t={t}/>
            {taskForSel.status==="In Progress"&&taskForSel.startedAt&&<div style={{display:"flex",alignItems:"center",gap:6,padding:"3px 10px",background:t.limeBg,borderRadius:99,border:`1px solid ${t.lime}40`}}><Timer size={11} color={t.limeDeep}/><LiveTimer startedAt={taskForSel.startedAt} t={t} active/></div>}
            {taskForSel.reviewerId&&<div style={{fontSize:11,color:t.amber,display:"flex",alignItems:"center",gap:4}}><UserCheck size={11}/>Review: {uName(taskForSel.reviewerId)}</div>}
          </div>
          {/* Time budget */}
          {taskForSel.est>0&&<div style={{padding:"11px 14px",background:t.surfaceAlt,borderRadius:10,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:11,fontWeight:700,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.05em"}}>Time Budget</span>
              <span style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:14,color:taskForSel.logged>taskForSel.est?t.red:t.green}}>{taskForSel.logged}h / {taskForSel.est}h</span>
            </div>
            <PBar value={taskForSel.logged} max={Math.max(taskForSel.est,taskForSel.logged,1)} color={taskForSel.logged>taskForSel.est?"red":"lime"} t={t}/>
          </div>}
          {/* Key facts */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
            {[["Deadline",taskForSel.due?fd(taskForSel.due):"TBD"],["Created",fd(taskForSel.created)],["Dept",data.departments.find(d=>d.id===taskForSel.deptId)?.name||"—"]].map(([k,v])=>(
              <div key={k} style={{padding:"9px 12px",background:t.surfaceAlt,borderRadius:9}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:t.textMuted,marginBottom:3}}>{k}</div>
                <div style={{fontSize:13,color:t.text,fontWeight:600}}>{v}</div>
              </div>
            ))}
          </div>
          {taskForSel.brief&&<div style={{marginBottom:14,padding:"10px 14px",background:t.surfaceAlt,borderRadius:10}}>
            <div style={{fontSize:10,fontWeight:700,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>Brief</div>
            <p style={{fontSize:13,color:t.textMid,lineHeight:1.7,margin:0}}>{taskForSel.brief}</p>
          </div>}
          {/* Links */}
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
            {taskForSel.drive&&<a href={taskForSel.drive} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 12px",background:t.blueBg,color:t.blue,borderRadius:9,fontSize:12,fontWeight:600,textDecoration:"none"}}><ExternalLink size={11}/> Drive</a>}
            {(taskForSel.assetLinks||[]).filter(l=>l).map((l,i)=><a key={i} href={l} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 12px",background:t.surfaceAlt,color:t.textMid,borderRadius:9,fontSize:12,fontWeight:600,textDecoration:"none"}}><Link2 size={11}/> Asset {i+1}</a>)}
          </div>
          {/* Move status */}
          <div style={{borderTop:`1px solid ${t.border}`,paddingTop:14,marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:700,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:9}}>Move to</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {COLS_BOARD.map(st=>{
                const bcfg={activeColor:"#60A5FA",activeBg:"#1D4ED825",activeBorder:"#3B82F6",inactiveColor:"#4A90D9",inactiveBorder:"#3B82F640"};
                const activeCols={"Not Started":{activeColor:t.textMid,activeBg:t.hover,activeBorder:t.borderMid},"In Progress":{activeColor:"#60A5FA",activeBg:"#1D4ED825",activeBorder:"#3B82F6"},"Review":{activeColor:"#FBB040",activeBg:"#92400E25",activeBorder:"#F59E0B"},"Rework":{activeColor:"#A78BFA",activeBg:"#4C1D9525",activeBorder:"#A78BFA"},"Completed":{activeColor:"#4ADE80",activeBg:"#14532D25",activeBorder:"#22C55E"}};
                const inactiveCols={"Not Started":{inactiveColor:t.textMuted,inactiveBorder:t.border},"In Progress":{inactiveColor:"#4A90D9",inactiveBorder:"#3B82F640"},"Review":{inactiveColor:"#C8913A",inactiveBorder:"#F59E0B40"},"Rework":{inactiveColor:"#8B6FD4",inactiveBorder:"#A78BFA40"},"Completed":{inactiveColor:"#3AAD60",inactiveBorder:"#22C55E40"}};
                const ac=activeCols[st]||{activeColor:t.lime,activeBg:t.limeBg,activeBorder:t.lime};
                const ic=inactiveCols[st]||{inactiveColor:t.textMuted,inactiveBorder:t.border};
                const active=taskForSel.status===st;
                return <button key={st} onClick={()=>{move(taskForSel.id,st);if(st!=="Review")setSel(p=>({...p,status:st}));}}
                  style={{padding:"6px 13px",borderRadius:8,border:`1.5px solid ${active?ac.activeBorder:ic.inactiveBorder}`,background:active?ac.activeBg:t.surfaceAlt,color:active?ac.activeColor:ic.inactiveColor,fontSize:12,fontWeight:active?700:500,cursor:"pointer",transition:"all .15s"}}>{active&&<Check size={10}/>} {st}</button>;
              })}
            </div>
          </div>
          {/* Comments */}
          <div style={{borderTop:`1px solid ${t.border}`,paddingTop:14}}>
            <div style={{fontSize:11,fontWeight:700,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Comments {(taskForSel.comments||[]).length>0&&`(${taskForSel.comments.length})`}</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12,maxHeight:220,overflowY:"auto"}}>
              {(taskForSel.comments||[]).length===0&&<div style={{fontSize:13,color:t.textMuted,fontStyle:"italic"}}>No comments yet — be the first.</div>}
              {(taskForSel.comments||[]).map((c,i)=>(
                <div key={c.id||i} style={{padding:"9px 12px",background:t.surfaceAlt,borderRadius:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,fontWeight:700,color:t.text}}>{c.byName||uName(c.by)}</span>
                    <span style={{fontSize:10,color:t.textMuted}}>{new Date(c.at).toLocaleDateString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</span>
                  </div>
                  <p style={{fontSize:13,color:t.textMid,margin:0,lineHeight:1.6}}>{c.text}</p>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <input value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),addComment())} placeholder="Add a comment… (Enter to post)" style={{...iStyle(t),flex:1,fontSize:13}}/>
              <Btn v="lime" t={t} size="sm" onClick={addComment} icon={<Send size={12}/>}>Post</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Reviewer picker modal */}
      <Modal open={!!reviewModal} onClose={()=>setReviewModal(null)} title="Send for Review" t={t} w={400}>
        <div style={{fontSize:13,color:t.textMid,marginBottom:16,lineHeight:1.6}}>Choose who should review this task. They'll get an in-app notification and email.</div>
        <Field label="Reviewer *" t={t}>
          <Sel value={reviewerId} onChange={e=>setReviewerId(e.target.value)} t={t}>
            <option value="">Select reviewer</option>
            {data.users.filter(u=>u.role!=="Admin"&&u.id!==currentUser?.id).map(u=><option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
          </Sel>
        </Field>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:8}}>
          <Btn v="secondary" t={t} onClick={()=>setReviewModal(null)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={confirmReview} icon={<Send size={12}/>}>Send for Review</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ── CALENDAR VIEW ─────────────────────────────────────────────────────────────
function CalendarView({t,data,go}){
  const [month,setMonth]=useState(()=>new Date());
  const [filters,setFilters]=useState({tasks:true,leaves:true,meetings:true,holidays:true});
  const [selDay,setSelDay]=useState(null); // date string for day detail popover

  // Official Gazetted National Holidays of India 2026
  // Source: Ministry of Personnel, Public Grievances & Pensions Circular
  const HOLIDAYS=[
    {name:"Makar Sankranti",       date:"2026-01-14"},
    {name:"Republic Day",          date:"2026-01-26"},
    {name:"Maha Shivaratri",       date:"2026-02-26"},
    {name:"Holi",                  date:"2026-03-20"},
    {name:"Id-ul-Fitr (Eid)",      date:"2026-03-31"},
    {name:"Ram Navami",            date:"2026-04-02"},
    {name:"Good Friday",           date:"2026-04-03"},
    {name:"Dr. Ambedkar Jayanti",  date:"2026-04-14"},
    {name:"Bakrid (Id-ul-Zuha)",   date:"2026-06-07"},
    {name:"Muharram",              date:"2026-07-06"},
    {name:"Independence Day",      date:"2026-08-15"},
    {name:"Janmashtami",           date:"2026-08-24"},
    {name:"Milad-un-Nabi",         date:"2026-09-05"},
    {name:"Gandhi Jayanti",        date:"2026-10-02"},
    {name:"Dussehra",              date:"2026-10-22"},
    {name:"Diwali",                date:"2026-11-11"},
    {name:"Guru Nanak Jayanti",    date:"2026-11-13"},
    {name:"Christmas Day",         date:"2026-12-25"},
  ];

  const y=month.getFullYear(), m=month.getMonth();
  const first=new Date(y,m,1).getDay();
  const days=new Date(y,m+1,0).getDate();
  const cells=[];
  for(let i=0;i<first;i++) cells.push(null);
  for(let d=1;d<=days;d++) cells.push(new Date(y,m,d));

  const ds=d=>d?`${y}-${String(m+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`:"";

  const eventsOn=d=>{
    if(!d)return[];
    const s=ds(d);
    const evs=[];
    if(filters.tasks){
      // Task deadlines
      data.tasks.filter(tk=>tk.due===s).forEach(tk=>evs.push({label:tk.title,color:t.red,type:"deadline",dot:"deadline"}));
      // Task in-progress (shows on start date)
      data.tasks.filter(tk=>tk.status==="In Progress"&&tk.startedAt&&tk.startedAt.startsWith(s)).forEach(tk=>evs.push({label:tk.title+" ⚡",color:t.amber,type:"in-progress",dot:"in-progress"}));
      // Task started
      data.tasks.filter(tk=>tk.startedAt&&tk.startedAt.startsWith(s)).forEach(tk=>evs.push({label:tk.title+" (started)",color:t.lime,type:"started",dot:"started"}));
      // Task completed
      data.tasks.filter(tk=>tk.status==="Completed"&&tk.completedAt===s).forEach(tk=>evs.push({label:tk.title+" ✓",color:t.green,type:"completed",dot:"completed"}));
    }
    if(filters.leaves) data.leaves.filter(l=>l.status==="Approved"&&s>=l.from&&s<=l.to).forEach(l=>evs.push({label:(data.users.find(u=>u.id===l.uId)?.name||"?")+": Leave",color:t.blue,type:"leave",dot:"leave"}));
    if(filters.meetings) data.meetings.filter(mt=>mt.date===s).forEach(mt=>evs.push({label:data.clients.find(c=>c.id===mt.cId)?.name||"Meeting",color:t.purple,type:"meeting",dot:"meeting"}));
    if(filters.holidays) HOLIDAYS.filter(h=>h.date===s).forEach(h=>evs.push({label:h.name,color:t.amber,type:"holiday",dot:"holiday"}));
    return evs;
  };

  const todayStr=new Date().toISOString().split("T")[0];
  const toggleFilter=k=>setFilters(p=>({...p,[k]:!p[k]}));

  const FILTER_LABELS=[
    {key:"tasks",   label:"Tasks",    color:t.lime},
    {key:"leaves",  label:"Leaves",   color:t.blue},
    {key:"meetings",label:"Meetings", color:t.purple},
    {key:"holidays",label:"Holidays", color:t.amber},
  ];

  return(
    <div>
      <SHead t={t} title="Calendar" sub="Tasks, leaves, meetings, and national holidays"/>
      {/* Filter row */}
      <div style={{display:"flex",gap:7,marginBottom:16,flexWrap:"wrap"}}>
        {FILTER_LABELS.map(({key,label,color})=>(
          <button key={key} onClick={()=>toggleFilter(key)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 13px",borderRadius:99,border:`1.5px solid ${filters[key]?color:t.border}`,background:filters[key]?color+"22":"transparent",color:filters[key]?color:t.textMuted,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:filters[key]?color:t.border,transition:"background .15s"}}/>
            {label}
          </button>
        ))}
      </div>
      {/* Month nav */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <button onClick={()=>setMonth(d=>{const n=new Date(d);n.setMonth(n.getMonth()-1);return n;})} style={{background:t.surfaceAlt,border:`1px solid ${t.border}`,borderRadius:9,padding:"7px 13px",cursor:"pointer",color:t.text,fontSize:13,fontWeight:600,display:"flex",alignItems:"center"}}><ChevronLeft size={14}/></button>
        <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:17,color:t.text}}>{month.toLocaleString("en-IN",{month:"long",year:"numeric"})}</div>
        <button onClick={()=>setMonth(d=>{const n=new Date(d);n.setMonth(n.getMonth()+1);return n;})} style={{background:t.surfaceAlt,border:`1px solid ${t.border}`,borderRadius:9,padding:"7px 13px",cursor:"pointer",color:t.text,fontSize:13,fontWeight:600,display:"flex",alignItems:"center"}}><ChevronRight size={14}/></button>
      </div>
      {/* Day headers */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:6}}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
          <div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.07em",padding:"5px 0"}}>{d}</div>
        ))}
      </div>
      {/* Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
        {cells.map((d,i)=>{
          const s=ds(d);
          const isToday=s===todayStr;
          const isSun=d&&d.getDay()===0;
          const evs=eventsOn(d);
          const shown=evs.slice(0,3);
          const more=evs.length-3;
          return(
            <div key={i} onClick={()=>d&&setSelDay(selDay===s?null:s)}
              style={{minHeight:70,background:isToday?t.limeBg:isSun?t.redBg:t.card,border:`1px solid ${isToday?t.lime:selDay===s?t.blue:t.border}`,borderRadius:10,padding:"5px 6px",opacity:d?1:0,cursor:d?"pointer":"default",transition:"border-color .12s"}}>
              {d&&<div style={{fontSize:11,fontWeight:700,color:isToday?t.limeDeep:isSun?t.red:t.textMuted,marginBottom:3}}>{d.getDate()}</div>}
              {shown.map((ev,j)=>(
                <div key={j} style={{fontSize:9,padding:"1px 4px",borderRadius:3,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",background:ev.color+"22",color:ev.color,fontWeight:700}}>{ev.label}</div>
              ))}
              {more>0&&<div style={{fontSize:9,color:t.textMuted,fontWeight:700}}>+{more} more</div>}
            </div>
          );
        })}
      </div>
      {/* Day detail panel */}
      {selDay&&(()=>{
        const dayEvs=eventsOn(new Date(selDay));
        const dObj=new Date(selDay+"T12:00:00");
        return(
          <div style={{marginTop:16,padding:"16px 18px",background:t.surfaceAlt,borderRadius:14,border:`1px solid ${t.border}`,animation:"fadeUp .25s both"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:14,color:t.text}}>{dObj.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</div>
              <button onClick={()=>setSelDay(null)} style={{background:"none",border:"none",cursor:"pointer",color:t.textMuted}}><X size={14}/></button>
            </div>
            {dayEvs.length===0&&<div style={{fontSize:13,color:t.textMuted}}>Nothing scheduled.</div>}
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {dayEvs.map((ev,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",background:t.card,borderRadius:9,border:`1px solid ${ev.color}30`}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:ev.color,flexShrink:0}}/>
                  <span style={{fontSize:13,color:t.text,fontWeight:500}}>{ev.label}</span>
                  <span style={{marginLeft:"auto",fontSize:10,color:ev.color,fontWeight:700,textTransform:"uppercase"}}>{ev.type}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
      {/* Legend */}
      <div style={{display:"flex",gap:14,marginTop:14,flexWrap:"wrap"}}>
        {[["Deadline",t.red],["Started",t.lime],["Completed",t.green],["Leave",t.blue],["Meeting",t.purple],["Holiday",t.amber]].map(([l,c])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:t.textMuted}}>
            <div style={{width:9,height:9,borderRadius:2,background:c}}/>{l}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
function Notifications({t,data,setData,go,currentUser}){
  const [tab,setTab]=useState("all");
  const markRead=id=>setData(d=>({...d,notifications:d.notifications.map(n=>n.id===id?{...n,read:true}:n)}));
  const markAll=()=>setData(d=>({...d,notifications:d.notifications.map(n=>({...n,read:true}))}));

  const TYPE_META={
    leave_request:  {icon:<Umbrella size={15}/>,  color:"amber",  cat:"leaves",  nav:"leaves"},
    leave_approved: {icon:<CheckCircle2 size={15}/>,color:"green",cat:"leaves",  nav:"leaves"},
    leave_rejected: {icon:<XCircle size={15}/>,   color:"red",    cat:"leaves",  nav:"leaves"},
    ext_request:    {icon:<AlarmClock size={15}/>, color:"purple", cat:"leaves",  nav:"leaves"},
    ext_approved:   {icon:<CheckCircle2 size={15}/>,color:"lime",  cat:"leaves",  nav:"projects"},
    task_assigned:  {icon:<Target size={15}/>,     color:"blue",   cat:"tasks",   nav:"projects"},
    deadline_missed:{icon:<AlertTriangle size={15}/>,color:"red",  cat:"deadlines",nav:"projects"},
    deadline_proposal:{icon:<AlarmClock size={15}/>,color:"amber", cat:"deadlines",nav:"projects"},
    deadline_request:{icon:<AlarmClock size={15}/>,color:"amber",  cat:"deadlines",nav:"projects"},
    deadline_counter:{icon:<AlarmClock size={15}/>,color:"blue",   cat:"deadlines",nav:"projects"},
    birthday_today: {icon:<Cake size={15}/>,       color:"amber",  cat:"birthdays",nav:"team"},
    birthday_week:  {icon:<Cake size={15}/>,       color:"amber",  cat:"birthdays",nav:"team"},
    meeting_invite: {icon:<CalendarDays size={15}/>,color:"blue",  cat:"meetings", nav:"meetings"},
  };
  const getMeta=type=>TYPE_META[type]||{icon:<Bell size={15}/>,color:"muted",cat:"other",nav:"notifications"};

  const isFounder=currentUser?.role==="Founder"||currentUser?.role==="Admin";
  const isHoDLocal=currentUser?.role==="HoD"||currentUser?.role==="Head of Department"||currentUser?.role==="Manager";
  const myNotifs=data.notifications.filter(n=>{
    if(n.to===currentUser?.id) return true;
    if(n.to==="all") return true;
    if(n.to==="managers"&&(isFounder||isHoDLocal)) return true;
    if(n.to==="founders"&&isFounder) return true;
    return false;
  });
  const sorted=[...myNotifs].sort((a,b)=>new Date(b.at)-new Date(a.at));
  const unread=sorted.filter(n=>!n.read).length;

  const TABS=[
    {id:"all",    label:"All",       emoji:"🔔"},
    {id:"tasks",  label:"Tasks",     emoji:"🎯"},
    {id:"deadlines",label:"Deadlines",emoji:"⏰"},
    {id:"leaves", label:"Leaves",    emoji:"🌴"},
    {id:"birthdays",label:"Birthdays",emoji:"🎂"},
    {id:"meetings",label:"Meetings", emoji:"📅"},
  ];

  const visible=tab==="all"?sorted:sorted.filter(n=>getMeta(n.type).cat===tab);
  const handleClick=n=>{markRead(n.id);const m=getMeta(n.type);go(m.nav,n.refType==="task"&&m.nav==="projects"?n.ref:null);};

  return(
    <div>
      <SHead t={t} title="Notifications" sub={unread>0?`✨ ${unread} new — you're on top of it!`:"All caught up! 🎉"}
        action={unread>0?<Btn v="lime" t={t} size="sm" onClick={markAll}>✓ Mark all read</Btn>:null}/>

      {/* Category tabs */}
      <div style={{display:"flex",gap:6,marginBottom:20,overflowX:"auto",paddingBottom:4,WebkitOverflowScrolling:"touch"}}>
        {TABS.map(tb=>{
          const cnt=tb.id==="all"?sorted.length:sorted.filter(n=>getMeta(n.type).cat===tb.id).length;
          const unreadCnt=tb.id==="all"?unread:sorted.filter(n=>getMeta(n.type).cat===tb.id&&!n.read).length;
          const active=tab===tb.id;
          return(
            <button key={tb.id} onClick={()=>setTab(tb.id)} style={{flexShrink:0,display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:99,border:active?`1.5px solid ${t.lime}`:`1.5px solid ${t.border}`,background:active?t.lime:"transparent",color:active?"#0A0A0A":t.textMid,fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .18s cubic-bezier(.34,1.56,.64,1)",fontFamily:"'DM Sans',sans-serif"}}>
              <span>{tb.emoji}</span>
              <span>{tb.label}</span>
              {cnt>0&&<span style={{background:active?"rgba(0,0,0,0.18)":unreadCnt>0?t.lime:t.surfaceAlt,color:active?"#0A0A0A":unreadCnt>0?"#0A0A0A":t.textMuted,borderRadius:99,fontSize:10,fontWeight:800,padding:"1px 6px",minWidth:18,textAlign:"center"}}>{cnt}</span>}
            </button>
          );
        })}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {visible.map((n,i)=>{
          const meta=getMeta(n.type);
          const clr=t[meta.color]||t.textMuted;
          const clrBg=t[meta.color+"Bg"]||t.surfaceAlt;
          return(
            <div key={n.id} className="row-hover" onClick={()=>handleClick(n)}
              style={{display:"flex",gap:13,alignItems:"flex-start",padding:"13px 16px",background:n.read?t.surface:t.limeBg,border:`1px solid ${n.read?t.border:t.lime+"50"}`,borderRadius:14,cursor:"pointer",animation:`fadeUp .28s ${i*22}ms both`,position:"relative",overflow:"hidden",transition:"all .15s"}}>
              {!n.read&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:`linear-gradient(to bottom,${t.lime},${t.limeDeep})`,borderRadius:"14px 0 0 14px"}}/>}
              <div style={{width:38,height:38,borderRadius:12,background:clrBg,color:clr,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${clr}22`,boxShadow:`0 2px 8px ${clrBg}`}}>{meta.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                  <div style={{fontSize:13,fontWeight:700,color:t.text,lineHeight:1.3}}>{n.title}</div>
                  <div style={{fontSize:10,color:t.textMuted,flexShrink:0,whiteSpace:"nowrap"}}>{new Date(n.at).toLocaleDateString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</div>
                </div>
                <div style={{fontSize:12,color:t.textMid,marginTop:3,lineHeight:1.5}}>{n.body}</div>
                <div style={{fontSize:11,color:clr,marginTop:5,fontWeight:700,display:"flex",alignItems:"center",gap:4,opacity:0.9}}>View details <ArrowRight size={10}/></div>
              </div>
              {!n.read&&<div style={{position:"absolute",right:14,top:14,width:8,height:8,borderRadius:"50%",background:t.lime,boxShadow:`0 0 0 0 ${t.lime}`}}><div style={{position:"absolute",inset:0,borderRadius:"50%",background:t.lime,animation:"ping 1.8s ease-out infinite",opacity:0.7}}/></div>}
            </div>
          );
        })}
        {visible.length===0&&(
          <div style={{textAlign:"center",padding:"48px 20px"}}>
            <div style={{fontSize:40,marginBottom:12}}>{tab==="birthdays"?"🎂":tab==="leaves"?"🌴":tab==="tasks"?"🎯":tab==="deadlines"?"⏰":tab==="meetings"?"📅":"🎉"}</div>
            <div style={{fontSize:16,fontWeight:700,color:t.text,marginBottom:6}}>All clear here!</div>
            <div style={{fontSize:13,color:t.textMuted}}>No {tab==="all"?"notifications":tab} yet.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ONBOARDING ────────────────────────────────────────────────────────────────
function Onboarding({t,data,setData,toast,currentUser}){
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({name:"",email:"",phone:"",designation:"",dob:"",dept:"",startDate:""});
  const isManager=currentUser?.role==="Founder"||currentUser?.role==="Admin"||currentUser?.role==="HoD"||currentUser?.role==="Manager";

  const create=()=>{
    if(!form.name){toast("Name required","error");return;}
    if(data.onboarding.find(ob=>ob.name===form.name)){toast("Already exists","error");return;}
    const id="ob"+Date.now();
    setData(d=>({...d,onboarding:[...d.onboarding,{
      id,name:form.name,email:form.email,phone:form.phone,
      designation:form.designation,dob:form.dob,dept:form.dept,
      startDate:form.startDate,completedAt:null,
      steps:OB_STEPS.map(s=>({...s,done:false}))
    }]}));
    // Send invite email if email provided
    if(form.email){
      sendEmail(form.email,form.name,"Welcome to ProfitPenny Studio!",
        `Hi ${form.name},\n\nWelcome to the team! Your onboarding has been started.\n\nYou'll receive a separate email with your login credentials once onboarding is complete.\n\nStart date: ${form.startDate?fdt(form.startDate):"TBD"}\n\n— ProfitPenny Studio OS`);
    }
    setShowAdd(false);
    setForm({name:"",email:"",phone:"",designation:"",dob:"",dept:"",startDate:""});
    toast("Onboarding started — welcome email sent");
  };

  const toggle=(obId,stepId)=>{
    setData(d=>{
      const onboarding=d.onboarding.map(ob=>{
        if(ob.id!==obId)return ob;
        const steps=ob.steps.map(s=>s.id===stepId?{...s,done:!s.done}:s);
        const allDone=steps.every(s=>s.done);
        const justCompleted=allDone&&!ob.completedAt;
        const updated={...ob,steps,completedAt:allDone?new Date().toISOString().split("T")[0]:null};
        // Auto-create team member when 100% complete
        if(justCompleted&&ob.email&&!d.users.find(u=>u.email?.toLowerCase()===ob.email?.toLowerCase())){
          const initials=(ob.name||"?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
          const newUser={id:"u"+Date.now(),name:ob.name,email:ob.email,phone:ob.phone||"",role:"Member",dept:ob.dept||"",designation:ob.designation||"",av:initials,active:true,leaveTotal:12,leaveTaken:0};
          d={...d,users:[...d.users,newUser]};
          sendEmail(ob.email,ob.name,"You've been added to ProfitPenny Studio OS",
            `Hi ${ob.name},\n\nCongratulations — your onboarding is complete! 🎉\n\nYou've been added as a team member. Your admin will send your login link shortly.\n\n— ProfitPenny Studio OS`);
          toast("🎉 Onboarding complete — team member created & invite sent!","success");
        }
        return updated;
      });
      return {...d,onboarding};
    });
  };

  return(
    <div>
      <SHead t={t} title="Onboarding" sub="New hire setup — completes automatically when all steps done"
        action={isManager?<Btn v="lime" t={t} onClick={()=>setShowAdd(true)} icon={<Plus size={14}/>}>New Onboarding</Btn>:null}/>
      {data.onboarding.length===0?<Card t={t}><p style={{color:t.textMuted,textAlign:"center",padding:"24px 0",fontSize:14}}>No active onboardings.</p></Card>
        :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:16}}>
            {data.onboarding.map((ob,oi)=>{
              const done=ob.steps.filter(s=>s.done).length,total=ob.steps.length,pct=Math.round((done/total)*100);
              return(
                <Card t={t} key={ob.id} style={{animation:`fadeUp .38s ${oi*55}ms both`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <Av init={(ob.name||"?")[0]} size={36} t={t}/>
                      <div>
                        <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:14,color:t.text}}>{ob.name}</div>
                        <div style={{fontSize:11,color:t.textMuted,marginTop:1}}>{ob.designation||""}{ob.designation&&ob.dept?" · ":""}{data.departments.find(d=>d.id===ob.dept)?.name||""}</div>
                        {ob.startDate&&<div style={{fontSize:11,color:t.textMuted,marginTop:1}}>Starts {fdt(ob.startDate)}</div>}
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:26,color:pct===100?t.lime:t.text,lineHeight:1}}>{pct}%</div>
                      <div style={{fontSize:9,color:t.textMuted,textTransform:"uppercase",fontWeight:600}}>{done}/{total}</div>
                    </div>
                  </div>
                  <PBar value={done} max={total} color={pct===100?"lime":"blue"} t={t} delay={oi*50}/>
                  {ob.completedAt&&<div style={{marginTop:10,padding:"6px 12px",background:t.limeBg,color:t.limeDeep,borderRadius:8,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><CheckCircle2 size={13}/> Completed {fdt(ob.completedAt)} · Team member created</div>}
                  <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:4}}>
                    {ob.steps.map((step)=>(
                      <button key={step.id} onClick={()=>toggle(ob.id,step.id)} className="btn-press" style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",background:step.done?t.limeBg:t.surfaceAlt,border:`1px solid ${step.done?t.lime+"50":t.border}`,borderRadius:8,cursor:"pointer",textAlign:"left",transition:"all .18s"}}>
                        <div style={{width:17,height:17,borderRadius:5,flexShrink:0,background:step.done?t.lime:"transparent",border:`2px solid ${step.done?t.lime:t.borderMid}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .18s"}}>{step.done&&<Check size={10} color="#0A0A0A" strokeWidth={3}/>}</div>
                        <span style={{fontSize:12,color:step.done?t.limeDeep:t.textMid,fontWeight:step.done?600:400,textDecoration:step.done?"line-through":"none"}}>{step.label}</span>
                      </button>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>}
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Start Onboarding" t={t} w={480}>
        <div style={{padding:"10px 14px",background:t.limeBg,borderRadius:10,marginBottom:16,fontSize:12,color:t.limeDeep,lineHeight:1.6}}>
          <strong>💡 When all onboarding steps are marked complete</strong>, this person will be automatically added as a team member and sent a welcome email.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Full Name *" t={t}><Inp value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Rahul Sharma" t={t}/></Field>
          <Field label="Designation" t={t}><Inp value={form.designation} onChange={e=>setForm(p=>({...p,designation:e.target.value}))} placeholder="Graphic Designer" t={t}/></Field>
          <Field label="Email" t={t}><Inp type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="rahul@studio.in" t={t}/></Field>
          <Field label="Phone" t={t}><Inp value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="+91 98765 43210" t={t}/></Field>
          <Field label="Date of Birth" t={t}><Inp type="date" value={form.dob} onChange={e=>setForm(p=>({...p,dob:e.target.value}))} t={t}/></Field>
          <Field label="Start Date" t={t}><Inp type="date" value={form.startDate} onChange={e=>setForm(p=>({...p,startDate:e.target.value}))} t={t}/></Field>
        </div>
        <Field label="Department" t={t}><DeptSel value={form.dept} onChange={v=>setForm(p=>({...p,dept:v}))} data={data} setData={setData} t={t} toast={toast}/></Field>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:8}}>
          <Btn v="secondary" t={t} onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={create} icon={<UserCheck size={13}/>}>Start Onboarding</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
// roles: "all" = everyone, "manager" = Founder+HoD, "founder" = Founder only
const NAV=[
  {id:"dashboard",    label:"Dashboard",      Icon:LayoutDashboard,  roles:"all"},
  {id:"projects",     label:"Projects",       Icon:FolderKanban,     roles:"all"},
  {id:"board",        label:"My Board",       Icon:KanbanSquare,     roles:"all"},
  {id:"calendar",     label:"Calendar",       Icon:Calendar,         roles:"all"},
  {id:"timelogs",     label:"Time Logs",      Icon:Clock3,           roles:"all"},
  {id:"efficiency",   label:"Efficiency",     Icon:TrendingUp,       roles:"manager"},
  {id:"clients",      label:"Clients",        Icon:Briefcase,        roles:"manager"},
  {id:"meetings",     label:"Meetings",       Icon:CalendarDays,     roles:"all"},
  {id:"leaves",       label:"Leaves",         Icon:Umbrella,         roles:"all"},
  {id:"departments",  label:"Departments",    Icon:Building2,        roles:"manager"},
  {id:"team",         label:"Team",           Icon:Users2,           roles:"manager"},
  {id:"onboarding",   label:"Onboarding",     Icon:UserCheck,        roles:"manager"},
  {id:"notifications",label:"Notifications",  Icon:Bell,             roles:"all"},
];

// ── LOGIN SCREEN ──────────────────────────────────────────────────────────────
function LoginScreen({onLogin}){
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [resetSent,setResetSent]=useState(false);
  const [showReset,setShowReset]=useState(false);
  const lime="#B5D334";

  const login=async()=>{
    if(!email||!pass){setErr("Enter your email and password");return;}
    setLoading(true);setErr("");
    try{ await loginUser(email,pass); onLogin(); }
    catch(e){ setErr(e.code==="auth/invalid-credential"||e.code==="auth/wrong-password"?"Incorrect email or password. Try again.":"Login failed — check your credentials."); }
    finally{ setLoading(false); }
  };

  const sendReset=async()=>{
    if(!email){setErr("Enter your email first");return;}
    try{
      const {sendPasswordResetEmail,getAuth}=await import("firebase/auth");
      await sendPasswordResetEmail(getAuth(),email,{url:window.location.origin});
      setResetSent(true);setShowReset(false);setErr("");
    }catch(e){setErr("Couldn't send reset email. Check the address.");}
  };

  const inp={width:"100%",padding:"12px 14px",background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(181,211,52,0.2)",borderRadius:10,color:"#FAFAFA",fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif",transition:"border-color .15s"};

  return(
    <>
      <style>{CSS}{`
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        .login-inp:focus{border-color:${lime} !important;}
      `}</style>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0C0D0A",position:"relative",overflow:"hidden"}}>
        {/* bg glow */}
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 50% at 50% -5%,rgba(181,211,52,0.13),transparent),radial-gradient(ellipse 40% 35% at 80% 90%,rgba(181,211,52,0.05),transparent)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(181,211,52,0.08) 1px,transparent 1px)",backgroundSize:"28px 28px",pointerEvents:"none"}}/>

        <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:420,padding:"0 20px",animation:"fadeUp .5s ease both"}}>
          {/* Logo — wordmark only, no floating PP box */}
          <div style={{textAlign:"center",marginBottom:36}}>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginBottom:10}}>
              <PPLogo collapsed={false}/>
            </div>
            <div style={{fontSize:11,color:"rgba(250,250,250,0.4)",letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>Studio OS · Sign In</div>
          </div>

          {/* Card */}
          <div style={{background:"rgba(20,20,16,0.92)",border:"1px solid rgba(181,211,52,0.18)",backdropFilter:"blur(20px)",borderRadius:20,padding:"32px",boxShadow:"0 40px 100px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.03)"}}>
            {err&&<div style={{background:"rgba(220,38,38,0.12)",border:"1px solid rgba(220,38,38,0.3)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#FCA5A5",marginBottom:16}}>{err}</div>}
            {resetSent&&<div style={{background:"rgba(22,163,74,0.12)",border:"1px solid rgba(22,163,74,0.3)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#86EFAC",marginBottom:16}}>✓ Reset email sent — check your inbox.</div>}

            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:600,color:"rgba(250,250,250,0.4)",textTransform:"uppercase",letterSpacing:"0.09em",display:"block",marginBottom:6}}>Work Email</label>
              <input className="login-inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@profitpenny.in" onKeyDown={e=>e.key==="Enter"&&!showReset&&login()} style={inp}/>
            </div>

            {!showReset&&<div style={{marginBottom:20}}>
              <label style={{fontSize:11,fontWeight:600,color:"rgba(250,250,250,0.4)",textTransform:"uppercase",letterSpacing:"0.09em",display:"block",marginBottom:6}}>Password</label>
              <input className="login-inp" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&login()} style={inp}/>
            </div>}

            {!showReset
              ?<button onClick={login} disabled={loading} style={{width:"100%",padding:"13px",background:lime,border:"none",borderRadius:10,fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:14,color:"#0A0A0A",cursor:"pointer",transition:"opacity .15s",opacity:loading?0.7:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {loading?<><div style={{width:16,height:16,border:"2px solid #0A0A0A33",borderTopColor:"#0A0A0A",borderRadius:"50%",animation:"spin .7s linear infinite"}}/> Signing in…</>:"Sign In →"}
              </button>
              :<button onClick={sendReset} style={{width:"100%",padding:"13px",background:"rgba(181,211,52,0.12)",border:`1.5px solid rgba(181,211,52,0.3)`,borderRadius:10,fontFamily:"'Poppins',sans-serif",fontWeight:600,fontSize:13,color:lime,cursor:"pointer"}}>
                Send Reset Link →
              </button>}

            <div style={{textAlign:"center",marginTop:14}}>
              <button onClick={()=>{setShowReset(s=>!s);setErr("");}} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(250,250,250,0.3)",fontSize:12,textDecoration:"underline",fontFamily:"'DM Sans',sans-serif"}}>
                {showReset?"← Back to sign in":"Forgot password?"}
              </button>
            </div>
          </div>

          <p style={{textAlign:"center",marginTop:18,fontSize:12,color:"rgba(250,250,250,0.2)",fontFamily:"'DM Sans',sans-serif"}}>
            New here? Ask your admin — you'll get an email invite.
          </p>
        </div>
      </div>
    </>
  );
}

// ── AUTH WRAPPER ──────────────────────────────────────────────────────────────
export default function Root(){
  const [authState,setAuthState]=useState("loading"); // loading | out | in
  const [firebaseUid,setFirebaseUid]=useState(null);
  useEffect(()=>{
    const unsub = onAuth(user => {
      setFirebaseUid(user?.uid||null);
      setAuthState(user ? "in" : "out");
    });
    return unsub;
  },[]);
  if(authState==="loading") return(
    <>
      <style>{CSS}</style>
      <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#0C0D0A",gap:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 40% at 50% 30%,rgba(181,211,52,0.1),transparent)",pointerEvents:"none"}}/>
        <PPLogo collapsed={false}/>
        <div style={{width:40,height:40,border:`4px solid ${D.light.lime}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </>
  );
  if(authState==="out") return <LoginScreen onLogin={()=>setAuthState("in")}/>;
  return <App firebaseUid={firebaseUid}/>;
}

// ── Firebase is schemaless — no parsing needed ────────────────────────────────
const parseDoc = d => d;

function App({firebaseUid}){
  const [dark,setDark]=useState(false);
  const [nav,setNav]=useState("dashboard");
  const [side,setSide]=useState(true);
  const [data,setData]=useState(INIT);
  const [loading,setLoading]=useState(true);
  const [toasts,toast]=useToast();
  const [pageKey,setPageKey]=useState(0);
  const [pendingTaskId,setPendingTaskId]=useState(null);
  const [showTutorial,setShowTutorial]=useState(false);
  const t=dark?D.dark:D.light;

  // The currently logged-in user — matched strictly by Firebase UID, then email.
  // NO fallback to data.users[0] — that would give everyone the first user's role.
  const fbUser = getCurrentUser();
  const currentUser = data.users.find(u=>u.uid===firebaseUid)
    || data.users.find(u=>u.email?.toLowerCase()===fbUser?.email?.toLowerCase());
  const isFounder = currentUser?.role==="Founder"||currentUser?.role==="Admin";
  const isHoD = currentUser?.role==="HoD"||currentUser?.role==="Head of Department"||currentUser?.role==="Manager";
  const isMember = !isFounder&&!isHoD;

  const go=useCallback((id,taskId=null)=>{setNav(id);setPageKey(p=>p+1);if(taskId)setPendingTaskId(taskId);},[]);
  const closeTutorial=()=>{setData(d=>({...d,firstLogin:false}));setShowTutorial(false);};

  // ── Load all data from Firebase on mount ─────────────────────────────────
  useEffect(()=>{
    async function loadAll(){
      try {
        const [users,departments,clients,tasks,leaves,meetings,timeLogs,notifications,onboarding] = await Promise.all([
          listDocs(COLS.USERS), listDocs(COLS.DEPARTMENTS), listDocs(COLS.CLIENTS),
          listDocs(COLS.TASKS), listDocs(COLS.LEAVES), listDocs(COLS.MEETINGS),
          listDocs(COLS.TIMELOGS), listDocs(COLS.NOTIFICATIONS), listDocs(COLS.ONBOARDING),
        ]);
        const leaveBalances = {};
        users.forEach(u => { leaveBalances[u.id] = { total: u.leaveTotal||12, taken: u.leaveTaken||0 }; });
        setData(d=>({
          ...d,
          firstLogin: users.length===0,
          users, departments, clients, tasks, leaves, meetings,
          timeLogs, notifications, onboarding, leaveBalances,
        }));
      } catch(e){
        console.error("Firebase load error:",e);
        toast("Could not connect to database","error",6000);
      } finally { setLoading(false); }
    }
    loadAll();
  },[]);

  // ── Sync helpers ──────────────────────────────────────────────────────────
  const syncCreate = useCallback(async (col, item) => {
    try { const {id,...rest}=item; await createDoc(col, id, rest); } catch(e){ console.error("sync create",e); }
  },[]);
  const syncUpdate = useCallback(async (col, id, patch) => {
    try { const {id:_,...rest}=patch; await updateDoc_(col, id, rest); } catch(e){ console.error("sync update",e); }
  },[]);

  // ── Intercept setData to auto-sync diffs to Firebase ─────────────────────
  const setDataAndSync = useCallback((updater) => {
    setData(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;

      if (next.tasks !== prev.tasks) next.tasks.forEach(t => {
        const old = prev.tasks.find(x=>x.id===t.id);
        if (!old) syncCreate(COLS.TASKS, t);
        else if (JSON.stringify(t)!==JSON.stringify(old)) syncUpdate(COLS.TASKS, t.id, t);
      });
      if (next.users !== prev.users) next.users.forEach(u => {
        const old = prev.users.find(x=>x.id===u.id);
        if (!old) syncCreate(COLS.USERS, {...u,leaveTotal:12,leaveTaken:0});
        else if (JSON.stringify(u)!==JSON.stringify(old)) syncUpdate(COLS.USERS, u.id, u);
      });
      if (next.clients !== prev.clients) next.clients.forEach(c => {
        const old = prev.clients.find(x=>x.id===c.id);
        if (!old) syncCreate(COLS.CLIENTS, c);
        else if (JSON.stringify(c)!==JSON.stringify(old)) syncUpdate(COLS.CLIENTS, c.id, c);
      });
      if (next.departments !== prev.departments) next.departments.forEach(d => {
        const old = prev.departments.find(x=>x.id===d.id);
        if (!old) syncCreate(COLS.DEPARTMENTS, d);
        else if (JSON.stringify(d)!==JSON.stringify(old)) syncUpdate(COLS.DEPARTMENTS, d.id, d);
      });
      if (next.leaves !== prev.leaves) {
        next.leaves.forEach(l => {
          const old = prev.leaves.find(x=>x.id===l.id);
          if (!old) syncCreate(COLS.LEAVES, l);
          else if (JSON.stringify(l)!==JSON.stringify(old)) syncUpdate(COLS.LEAVES, l.id, l);
        });
        if (next.leaveBalances !== prev.leaveBalances) {
          Object.entries(next.leaveBalances).forEach(([uid,bal]) => {
            const prevBal = prev.leaveBalances[uid];
            if (!prevBal || prevBal.taken !== bal.taken) syncUpdate(COLS.USERS, uid, {leaveTotal:bal.total,leaveTaken:bal.taken});
          });
        }
      }
      if (next.meetings !== prev.meetings) next.meetings.forEach(m => {
        const old = prev.meetings.find(x=>x.id===m.id);
        if (!old) syncCreate(COLS.MEETINGS, m);
        else if (JSON.stringify(m)!==JSON.stringify(old)) syncUpdate(COLS.MEETINGS, m.id, m);
      });
      if (next.timeLogs !== prev.timeLogs) next.timeLogs.forEach(l => {
        if (!prev.timeLogs.find(x=>x.id===l.id)) syncCreate(COLS.TIMELOGS, l);
      });
      if (next.notifications !== prev.notifications) next.notifications.forEach(n => {
        const old = prev.notifications.find(x=>x.id===n.id);
        if (!old) syncCreate(COLS.NOTIFICATIONS, n);
        else if (n.read !== old.read) syncUpdate(COLS.NOTIFICATIONS, n.id, {read:n.read});
      });
      if (next.onboarding !== prev.onboarding) next.onboarding.forEach(ob => {
        const old = prev.onboarding.find(x=>x.id===ob.id);
        if (!old) syncCreate(COLS.ONBOARDING, ob);
        else if (JSON.stringify(ob)!==JSON.stringify(old)) syncUpdate(COLS.ONBOARDING, ob.id, ob);
      });

      return next;
    });
  },[syncCreate,syncUpdate]);

  const myNotifs=data.notifications.filter(n=>{
    if(n.to===currentUser?.id) return true;
    if(n.to==="all") return true;
    if(n.to==="managers"&&(isFounder||isHoD)) return true;
    if(n.to==="founders"&&isFounder) return true;
    return false;
  });
  const unread=myNotifs.filter(n=>!n.read).length;
  const pendLeave=data.leaves.filter(l=>l.status==="Pending").length;
  const pendExt=data.tasks.filter(tk=>tk.extRequest?.status==="Pending").length;
  const badge=id=>id==="notifications"?unread:id==="leaves"?(pendLeave+pendExt):0;

  const pages={
    dashboard:    <Dashboard    t={t} data={data} go={go} currentUser={currentUser}/>,
    projects:     <Projects     t={t} data={data} setData={setDataAndSync} toast={toast} currentUser={currentUser} pendingTaskId={pendingTaskId} clearPendingTask={()=>setPendingTaskId(null)}/>,
    board:        <BoardView    t={t} data={data} setData={setDataAndSync} toast={toast} currentUser={currentUser}/>,
    calendar:     <CalendarView t={t} data={data} go={go}/>,
    timelogs:     <TimeLogs     t={t} data={data} setData={setDataAndSync} toast={toast} currentUser={currentUser}/>,
    efficiency:   <Efficiency   t={t} data={data} currentUser={currentUser}/>,
    clients:      <Clients      t={t} data={data} setData={setDataAndSync} toast={toast} currentUser={currentUser}/>,
    meetings:     <Meetings     t={t} data={data} setData={setDataAndSync} toast={toast} currentUser={currentUser}/>,
    leaves:       <Leaves       t={t} data={data} setData={setDataAndSync} toast={toast} currentUser={currentUser}/>,
    departments:  <Departments  t={t} data={data} setData={setDataAndSync} toast={toast}/>,
    team:         <Team         t={t} data={data} setData={setDataAndSync} toast={toast}/>,
    onboarding:   <Onboarding   t={t} data={data} setData={setDataAndSync} toast={toast} currentUser={currentUser}/>,
    notifications:<Notifications t={t} data={data} setData={setDataAndSync} go={go} currentUser={currentUser}/>,
  };

  if (loading) return (
    <>
      <style>{CSS}</style>
      <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#0C0D0A",gap:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 40% at 50% 30%,rgba(181,211,52,0.1),transparent)",pointerEvents:"none"}}/>
        <PPLogo collapsed={false}/>
        <div style={{width:48,height:48,border:`4px solid ${D.light.lime}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
        <p style={{fontFamily:"'Poppins',sans-serif",fontWeight:600,fontSize:14,color:"rgba(255,255,255,0.4)"}}>Loading your workspace…</p>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );

  // First run — no users created yet (Founder setup)
  if(!loading && data.users.length===0) return (
    <>
      <style>{CSS}</style>
      <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:D.light.bg,gap:16,padding:24}}>
        <PPLogo collapsed={false}/>
        <div style={{marginTop:16,textAlign:"center",maxWidth:420}}>
          <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:22,color:D.light.text,marginBottom:8}}>Welcome, Founder 👋</div>
          <div style={{fontSize:14,color:D.light.textMuted,lineHeight:1.7,marginBottom:24}}>You're logged in but no team profile exists yet. Go to the Admin panel to create your Founder profile, then refresh this page.</div>
          <a href="/admin.html" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 24px",background:D.light.lime,color:"#0A0A0A",borderRadius:10,fontWeight:700,fontSize:14,textDecoration:"none"}}>Open Admin Panel →</a>
          <div style={{marginTop:12}}><button onClick={()=>logoutUser()} style={{background:"none",border:"none",cursor:"pointer",color:D.light.textMuted,fontSize:12,textDecoration:"underline"}}>Sign out</button></div>
        </div>
      </div>
    </>
  );

  // Logged in but no matching profile in users collection
  if(!loading && !currentUser) return (
    <>
      <style>{CSS}</style>
      <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:D.light.bg,gap:16,padding:24}}>
        <div style={{width:64,height:64,borderRadius:16,background:D.light.amberBg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>
          <AlertTriangle size={28} color={D.light.amber}/>
        </div>
        <div style={{textAlign:"center",maxWidth:420}}>
          <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:20,color:D.light.text,marginBottom:8}}>Profile Not Found</div>
          <div style={{fontSize:14,color:D.light.textMuted,lineHeight:1.7,marginBottom:8}}>You're signed in as <strong>{fbUser?.email}</strong>, but this email isn't linked to a team member profile.</div>
          <div style={{fontSize:13,color:D.light.textMuted,lineHeight:1.7,marginBottom:24}}>Ask your admin to create a profile for this email address, or check that you're using the correct email to sign in.</div>
          <button onClick={()=>logoutUser()} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"11px 22px",background:D.light.text,color:D.light.bg,borderRadius:10,fontWeight:600,fontSize:14,border:"none",cursor:"pointer"}}>Sign Out & Try Again</button>
        </div>
      </div>
    </>
  );

  return(
    <>
      <style>{CSS}{`::-webkit-scrollbar-thumb{background:${t.scrollThumb};}`}</style>
      {(data.firstLogin||showTutorial)&&<Tutorial t={t} onClose={closeTutorial}/>}
      <div style={{display:"flex",height:"100vh",overflow:"hidden",background:t.bg}}>

        {/* SIDEBAR */}
        <aside className="sidebar-desktop" style={{width:side?224:62,flexShrink:0,background:t.sidebar,display:"flex",flexDirection:"column",transition:"width .3s cubic-bezier(.22,1,.36,1)",overflow:"hidden",boxShadow:"4px 0 24px rgba(0,0,0,0.15)"}}>
          <div style={{padding:side?"16px 14px 14px":"16px 0 14px",display:"flex",alignItems:"center",justifyContent:side?"space-between":"center",borderBottom:`1px solid ${t.sideHover}`,minHeight:64}}>
            <div style={{overflow:"hidden"}}><PPLogo collapsed={!side}/></div>
            <button onClick={()=>setSide(p=>!p)} style={{background:"none",border:"none",cursor:"pointer",padding:4,borderRadius:6,color:t.sideText,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"color .14s"}} onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color=t.sideText}>
              {side?<ChevronLeft size={16}/>:<ChevronRight size={16}/>}
            </button>
          </div>
          <nav style={{flex:1,padding:"8px 6px",overflowY:"auto",overflowX:"hidden"}}>
            {NAV.filter(n=>n.roles==="all"||(n.roles==="manager"&&(isFounder||isHoD))||(n.roles==="founder"&&isFounder)).map(({id,label,Icon},i)=>{
              const active=nav===id,b=badge(id);
              return(
                <button key={id} onClick={()=>go(id)} title={!side?label:""} style={{width:"100%",display:"flex",alignItems:"center",gap:side?11:0,justifyContent:side?"flex-start":"center",padding:side?"9px 12px":"11px 0",borderRadius:12,border:"none",background:active?t.sideActive+"22":"transparent",color:active?t.sideActive:t.sideText,fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:active?700:400,cursor:"pointer",marginBottom:2,position:"relative",transition:"all .2s cubic-bezier(.34,1.56,.64,1)",animation:`fadeUp .28s ${i*18}ms both`,whiteSpace:"nowrap",overflow:"hidden"}}
                  onMouseEnter={e=>{if(!active){e.currentTarget.style.background=t.sideHover;e.currentTarget.style.color="#FAFAFA";}}}
                  onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color=t.sideText;}}}>
                  {active&&<div style={{position:"absolute",left:0,top:"20%",bottom:"20%",width:3,borderRadius:"0 3px 3px 0",background:t.sideActive}}/>}
                  <div style={{position:"relative",flexShrink:0}}>
                    <Icon size={17} strokeWidth={active?2.2:1.7}/>
                    {b>0&&<span style={{position:"absolute",top:-6,right:-6,minWidth:15,height:15,borderRadius:99,background:t.sideActive,color:"#0A0A0A",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px",animation:"notifPop .5s cubic-bezier(.22,1,.36,1)"}}>{b}</span>}
                  </div>
                  {side&&<span style={{flex:1,textAlign:"left"}}>{label}</span>}
                </button>
              );
            })}
          </nav>
          <div style={{padding:side?"10px 8px":"10px 0",borderTop:`1px solid ${t.sideHover}`,display:"flex",flexDirection:"column",gap:6}}>
            {side&&<button onClick={()=>setShowTutorial(true)} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"none",border:`1px solid ${t.sideHover}`,borderRadius:8,cursor:"pointer",color:t.sideText,fontSize:11,fontWeight:600,transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.background=t.sideHover;e.currentTarget.style.color="#fff";}} onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=t.sideText;}}>
              <RefreshCw size={12}/> Replay Tutorial
            </button>}
            <div style={{display:"flex",alignItems:"center",gap:9,justifyContent:side?"flex-start":"center"}}>
              <Av init={currentUser?.av||"U"} size={30} t={t}/>
              {side&&<div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,color:"#FAFAFA",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser?.name||"User"}</div>
                <div style={{fontSize:10,color:t.sideText}}>{currentUser?.role||"Member"}</div>
              </div>}
              {side&&<button onClick={()=>{logoutUser();}} title="Sign out" style={{background:"none",border:"none",cursor:"pointer",color:t.sideText,display:"flex",alignItems:"center",padding:4,borderRadius:6,opacity:0.7}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0.7}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>}
            </div>
          </div>
        </aside>

        {/* MOBILE BOTTOM NAV */}
        <nav className="mobile-nav" style={{display:"none",position:"fixed",bottom:0,left:0,right:0,zIndex:1000,background:t.sidebar,borderTop:`1px solid ${t.sideHover}`,padding:"6px 0 calc(6px + env(safe-area-inset-bottom))",gap:0,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
          {NAV.filter(n=>n.roles==="all"||(n.roles==="manager"&&(isFounder||isHoD))||(n.roles==="founder"&&isFounder)).map(({id,label,Icon})=>{
            const active=nav===id,b=badge(id);
            return(
              <button key={id} onClick={()=>go(id)} style={{flex:"0 0 auto",minWidth:56,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 8px",background:"none",border:"none",cursor:"pointer",color:active?t.sideActive:t.sideText,position:"relative",transition:"all .18s"}}>
                <div style={{position:"relative"}}>
                  <Icon size={20} strokeWidth={active?2.2:1.6}/>
                  {b>0&&<span style={{position:"absolute",top:-5,right:-6,minWidth:14,height:14,borderRadius:99,background:t.sideActive,color:"#0A0A0A",fontSize:8,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px"}}>{b}</span>}
                </div>
                <span style={{fontSize:9,fontWeight:active?700:500,letterSpacing:"0.02em"}}>{label}</span>
                {active&&<div style={{position:"absolute",top:0,left:"25%",right:"25%",height:2,borderRadius:99,background:t.sideActive}}/>}
              </button>
            );
          })}
        </nav>
        {/* MAIN */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
          <header style={{height:56,background:t.topbar,borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 22px",flexShrink:0}}>
            <div className="topbar-title" style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:12,color:t.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}}>{NAV.find(n=>n.id===nav)?.label}</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>go("notifications")} style={{position:"relative",background:t.surfaceAlt,border:`1px solid ${t.border}`,borderRadius:12,width:38,height:38,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:t.textMuted,transition:"all .2s cubic-bezier(.34,1.56,.64,1)"}} className="btn-fun" onMouseEnter={e=>{e.currentTarget.style.background=t.hover;}} onMouseLeave={e=>{e.currentTarget.style.background=t.surfaceAlt;}}>
                <Bell size={15}/>
                {unread>0&&<span style={{position:"absolute",top:-4,right:-4,minWidth:17,height:17,borderRadius:99,background:t.lime,color:"#0A0A0A",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px",animation:"notifPop .5s cubic-bezier(.22,1,.36,1)"}}>{unread}</span>}
              </button>
              <button className="btn-press" onClick={()=>setDark(p=>!p)} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 11px",background:t.surfaceAlt,border:`1px solid ${t.border}`,borderRadius:99,cursor:"pointer"}}>
                <div style={{width:32,height:18,borderRadius:99,background:dark?t.lime:t.borderMid,position:"relative",transition:"background .28s",flexShrink:0}}><div style={{position:"absolute",top:2,left:dark?15:2,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"left .25s cubic-bezier(.34,1.56,.64,1)"}}/></div>
                {dark?<Moon size={12} color={t.textMuted}/>:<Sun size={12} color={t.textMuted}/>}
              </button>
            </div>
          </header>
          <main key={pageKey} className="main-pad" style={{flex:1,overflow:"auto",padding:"24px 26px",paddingBottom:"calc(24px + env(safe-area-inset-bottom))",animation:"fadeUp .3s cubic-bezier(.22,1,.36,1) both"}}>
            <PageTip nav={nav} t={t}/>
            {pages[nav]}
          </main>
        </div>
      </div>
      <Toasts list={toasts}/>
    </>
  );
}
