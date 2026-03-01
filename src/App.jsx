// ╔══════════════════════════════════════════════════════════════════════╗
// ║  PROFITPENNY STUDIO OS v2.0                                          ║
// ║  Stack: React + Lucide Icons + CSS animations                        ║
// ║  DB: Appwrite (connect later) — currently fully mocked               ║
// ╚══════════════════════════════════════════════════════════════════════╝

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  LayoutDashboard, FolderKanban, Clock, TrendingUp, Users, Building2,
  Calendar, Umbrella, UserPlus, Bell, Sun, Moon, ChevronRight, ChevronDown,
  ChevronLeft, Plus, X, Check, AlertTriangle, Timer, ExternalLink, Search,
  MoreHorizontal, ArrowUpRight, Pause, Play, StopCircle, RefreshCw, Mail,
  Filter, Eye, Edit2, Trash2, Shield, Star, Zap, Target, Award, Activity,
  CheckCircle2, XCircle, Clock3, CalendarDays, MapPin, Users2, FileText,
  AlarmClock, TrendingDown, BarChart3, PieChart, Layers, Settings, LogOut,
  ArrowRight, Dot, GripVertical, Send, ThumbsUp, ThumbsDown, Info, Sparkles,
  Building, CircleUserRound, Crown, UserCheck, Briefcase, Hash
} from "lucide-react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; }
body { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { border-radius: 99px; }

/* ── Keyframes ── */
@keyframes fadeUp    { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
@keyframes fadeIn    { from { opacity:0 } to { opacity:1 } }
@keyframes slideLeft { from { opacity:0; transform:translateX(-16px) } to { opacity:1; transform:translateX(0) } }
@keyframes slideRight{ from { opacity:0; transform:translateX(16px) }  to { opacity:1; transform:translateX(0) } }
@keyframes scaleIn   { from { opacity:0; transform:scale(0.94) }        to { opacity:1; transform:scale(1) } }
@keyframes popIn     { 0%{opacity:0;transform:scale(0)} 60%{transform:scale(1.12)} 100%{opacity:1;transform:scale(1)} }
@keyframes ping      { 0%{transform:scale(1);opacity:1} 75%,100%{transform:scale(2);opacity:0} }
@keyframes shimmer   { from{opacity:0.6} to{opacity:1} }
@keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.4} }
@keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes countUp   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes toastSlide{ from{opacity:0;transform:translateX(120%)} to{opacity:1;transform:translateX(0)} }
@keyframes notifPop  { 0%{transform:scale(1)} 30%{transform:scale(1.4)} 60%{transform:scale(0.85)} 100%{transform:scale(1)} }
@keyframes timerPulse{ 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.97)} }
@keyframes barGrow   { from{transform:scaleX(0)} to{transform:scaleX(1)} }
@keyframes limeGlow  { 0%,100%{box-shadow:0 0 0 0 rgba(181,211,52,0)} 50%{box-shadow:0 0 24px 4px rgba(181,211,52,0.35)} }

/* ── Utility classes ── */
.fade-up      { animation: fadeUp .38s cubic-bezier(.22,1,.36,1) both; }
.scale-in     { animation: scaleIn .3s cubic-bezier(.22,1,.36,1) both; }
.slide-left   { animation: slideLeft .3s cubic-bezier(.22,1,.36,1) both; }
.hover-lift   { transition: transform .18s ease, box-shadow .18s ease; }
.hover-lift:hover { transform: translateY(-2px); }
.btn-press    { transition: transform .1s ease, opacity .1s ease; }
.btn-press:active { transform: scale(0.95); }
.row-hover    { transition: background .12s ease; }
.lime-glow    { animation: limeGlow 2s ease-in-out infinite; }
.timer-active { animation: timerPulse 1.5s ease-in-out infinite; }
`;

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const D = {
  light: {
    // Backgrounds
    bg:        "#F7F7F5",
    surface:   "#FFFFFF",
    surfaceAlt:"#F2F2F0",
    hover:     "#EBEBEA",
    border:    "#E4E4E1",
    borderMid: "#D0D0CC",
    // Text
    text:      "#0A0A0A",
    textMid:   "#4A4A48",
    textMuted: "#8A8A87",
    // Lime accent (from logo)
    lime:      "#B5D334",
    limeDeep:  "#8DAA1A",
    limeBg:    "#F2F9D0",
    limeMid:   "#D8EC7A",
    // Status
    green:     "#16A34A",  greenBg: "#DCFCE7",
    blue:      "#2563EB",  blueBg:  "#DBEAFE",
    amber:     "#D97706",  amberBg: "#FEF3C7",
    red:       "#DC2626",  redBg:   "#FEE2E2",
    purple:    "#7C3AED",  purpleBg:"#EDE9FE",
    // UI
    sidebar:   "#0A0A0A",
    sideText:  "#C8C8C4",
    sideActive:"#B5D334",
    sideHover: "#1A1A1A",
    topbar:    "#FFFFFF",
    shadow:    "rgba(0,0,0,0.06)",
    shadowMd:  "rgba(0,0,0,0.12)",
    card:      "#FFFFFF",
    scrollThumb:"#D0D0CC",
  },
  dark: {
    bg:        "#0C0C0A",
    surface:   "#141412",
    surfaceAlt:"#1C1C1A",
    hover:     "#222220",
    border:    "#2A2A27",
    borderMid: "#383835",
    text:      "#F0F0EC",
    textMid:   "#A8A8A4",
    textMuted: "#5A5A57",
    lime:      "#C8E84A",
    limeDeep:  "#9CB82A",
    limeBg:    "#1A200A",
    limeMid:   "#7A9020",
    green:     "#4ADE80",  greenBg: "#052E16",
    blue:      "#60A5FA",  blueBg:  "#0A1628",
    amber:     "#FCD34D",  amberBg: "#1A1200",
    red:       "#F87171",  redBg:   "#1C0A0A",
    purple:    "#A78BFA",  purpleBg:"#150B2A",
    sidebar:   "#080806",
    sideText:  "#7A7A76",
    sideActive:"#C8E84A",
    sideHover: "#141412",
    topbar:    "#141412",
    shadow:    "rgba(0,0,0,0.3)",
    shadowMd:  "rgba(0,0,0,0.5)",
    card:      "#141412",
    scrollThumb:"#2A2A27",
  }
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK = {
  company: { name: "ProfitPenny Design Studio", founded: "2021" },

  departments: [
    { id: "d1", name: "Design",   color: "#B5D334", managerId: "u1", hodId: "u2" },
    { id: "d2", name: "Content",  color: "#60A5FA", managerId: "u1", hodId: "u4" },
    { id: "d3", name: "Strategy", color: "#F87171", managerId: "u1", hodId: "u6" },
  ],

  users: [
    { id:"u1", name:"Rahul Sharma",   email:"rahul@profitpenny.in",   role:"Admin",        dept:"d1", av:"RS", active:true  },
    { id:"u2", name:"Sachin Verma",   email:"sachin@profitpenny.in",  role:"HoD",          dept:"d1", av:"SV", active:true  },
    { id:"u3", name:"Priya Mehta",    email:"priya@profitpenny.in",   role:"Designer",     dept:"d1", av:"PM", active:true  },
    { id:"u4", name:"Nisha Kapoor",   email:"nisha@profitpenny.in",   role:"HoD",          dept:"d2", av:"NK", active:true  },
    { id:"u5", name:"Arjun Das",      email:"arjun@profitpenny.in",   role:"Writer",       dept:"d2", av:"AD", active:true  },
    { id:"u6", name:"Kavya Rao",      email:"kavya@profitpenny.in",   role:"HoD",          dept:"d3", av:"KR", active:true  },
    { id:"u7", name:"Karan Singh",    email:"karan@profitpenny.in",   role:"Designer",     dept:"d1", av:"KS", active:true  },
    { id:"u8", name:"Meera Pillai",   email:"meera@profitpenny.in",   role:"Strategist",   dept:"d3", av:"MP", active:false },
  ],

  clients: [
    { id:"c1", name:"Bharat Forge Ltd.",     industry:"Industrial Mfg.",  drive:"https://drive.google.com", score:88, met:11, missed:1,  deliverables:["Annual Report","Brand Kit","Social Calendar"],     notes:"Key account. Prefers dark palettes."         },
    { id:"c2", name:"Mahindra CIE",          industry:"Auto Components",  drive:"https://drive.google.com", score:72, met:8,  missed:3,  deliverables:["Product Catalogue","Trade Show Brochure"],         notes:"Quarterly reviews. Contact: Ankit Joshi."    },
    { id:"c3", name:"Thermax Ltd.",           industry:"Energy Solutions", drive:"https://drive.google.com", score:96, met:15, missed:0,  deliverables:["PPT Templates","Leaflets"],                        notes:"Always on time. Very responsive."            },
    { id:"c4", name:"Tata Advanced Systems",  industry:"Defence & Aero",   drive:"https://drive.google.com", score:62, met:5,  missed:4,  deliverables:["Capability Brochure"],                            notes:"Long approval cycles — buffer time always."  },
  ],

  tasks: [
    { id:"t1", title:"Brand Identity Refresh",  cId:"c1", aId:"u3", status:"In Progress", priority:"High",   due:"2026-03-10", est:40, logged:22, startedAt:"2026-03-01T09:00:00Z", brief:"Full rebrand incl. logo, palette, typography.", drive:"https://drive.google.com", created:"2026-02-15", extRequest:null },
    { id:"t2", title:"Product Catalogue Q1",    cId:"c2", aId:"u7", status:"Review",      priority:"High",   due:"2026-03-05", est:32, logged:30, startedAt:"2026-02-10T10:00:00Z", brief:"48-page catalogue — new auto component line.",  drive:"https://drive.google.com", created:"2026-02-10", extRequest:null },
    { id:"t3", title:"PPT Template System",     cId:"c3", aId:"u7", status:"Completed",   priority:"Medium", due:"2026-02-28", est:24, logged:21, startedAt:"2026-02-01T09:00:00Z", brief:"Master slide deck with 40+ layouts.",           drive:"https://drive.google.com", created:"2026-02-01", extRequest:null },
    { id:"t4", title:"Social Media Feb Pack",   cId:"c1", aId:"u5", status:"Completed",   priority:"Medium", due:"2026-01-30", est:20, logged:18, startedAt:"2026-01-10T09:00:00Z", brief:"30 posts — 15 static + 15 reels scripts.",      drive:"https://drive.google.com", created:"2026-01-10", extRequest:null },
    { id:"t5", title:"Capability Brochure",     cId:"c4", aId:"u3", status:"Delayed",     priority:"High",   due:"2026-02-20", est:28, logged:12, startedAt:"2026-01-25T09:00:00Z", brief:"12-page brochure for defence exhibition.",      drive:"https://drive.google.com", created:"2026-01-25", extRequest:{ reason:"Client delayed spec delivery by 2 weeks", newDue:"2026-03-07", status:"Pending" } },
    { id:"t6", title:"Trade Show Banners",      cId:"c2", aId:"u7", status:"Not Started", priority:"Low",    due:"2026-03-20", est:10, logged:0,  startedAt:null,                   brief:"Set of 6 exhibition banners.",                 drive:"https://drive.google.com", created:"2026-03-01", extRequest:null },
    { id:"t7", title:"Q2 Strategy Deck",        cId:"c3", aId:"u6", status:"In Progress", priority:"Medium", due:"2026-03-15", est:18, logged:6,  startedAt:"2026-03-02T10:00:00Z", brief:"Quarterly strategy presentation for client.",   drive:"https://drive.google.com", created:"2026-03-01", extRequest:null },
  ],

  leaves: [
    { id:"l1", uId:"u3", type:"Casual", from:"2026-03-12", to:"2026-03-13", days:2, reason:"Personal work",   status:"Pending",  on:"2026-03-01" },
    { id:"l2", uId:"u7", type:"Sick",   from:"2026-02-24", to:"2026-02-24", days:1, reason:"Fever",           status:"Approved", on:"2026-02-24" },
    { id:"l3", uId:"u5", type:"Casual", from:"2026-03-18", to:"2026-03-20", days:3, reason:"Family function", status:"Pending",  on:"2026-03-01" },
    { id:"l4", uId:"u7", type:"Earned", from:"2026-01-15", to:"2026-01-17", days:3, reason:"Travel",          status:"Approved", on:"2026-01-10" },
  ],

  leaveBalances: {
    u2:{ total:12, taken:3 }, u3:{ total:12, taken:5 }, u4:{ total:12, taken:6 },
    u5:{ total:12, taken:2 }, u6:{ total:12, taken:1 }, u7:{ total:12, taken:4 }, u8:{ total:12, taken:1 }
  },

  meetings: [
    { id:"m1", cId:"c1", date:"2026-03-05", time:"11:00", loc:"Pune HQ",     attendees:["u1","u2","u3"], agenda:"Q2 scope and brand refresh review",   mom:"Client approved revised logo. Full brand kit by Mar 20.", actions:[{ item:"Send revised brand manual", due:"2026-03-10", owner:"u3" },{ item:"Sign-off on color palette", due:"2026-03-07", owner:"u1" }] },
    { id:"m2", cId:"c3", date:"2026-03-08", time:"14:30", loc:"Google Meet",  attendees:["u1","u7"],       agenda:"PPT template delivery walkthrough",  mom:"", actions:[] },
    { id:"m3", cId:"c2", date:"2026-02-18", time:"10:00", loc:"Mumbai Office",attendees:["u1","u7","u5"],   agenda:"Catalogue content finalization",     mom:"Approved structure. Specs by Feb 22.", actions:[{ item:"Receive product specs", due:"2026-02-22", owner:"u1" },{ item:"Begin layout", due:"2026-02-25", owner:"u7" }] },
  ],

  timeLogs: [
    { id:"tl1", tId:"t1", uId:"u3", date:"2026-03-01", hrs:4, note:"Logo concepts",          auto:false },
    { id:"tl2", tId:"t1", uId:"u3", date:"2026-03-02", hrs:6, note:"Color palette sessions", auto:true  },
    { id:"tl3", tId:"t2", uId:"u7", date:"2026-02-28", hrs:8, note:"Layout draft",           auto:false },
    { id:"tl4", tId:"t7", uId:"u6", date:"2026-03-02", hrs:6, note:"Auto-tracked",           auto:true  },
  ],

  notifications: [
    { id:"n1", type:"leave_request",   title:"Leave Request",           body:"Priya Mehta applied for 2-day casual leave (Mar 12–13)",  to:"u2", from:"u3", ref:"l1", read:false, at:"2026-03-01T10:00:00Z" },
    { id:"n2", type:"deadline_missed", title:"Deadline Missed",         body:"Capability Brochure was due Feb 20 — still incomplete",   to:"u2", from:"system", ref:"t5", read:false, at:"2026-02-21T09:00:00Z" },
    { id:"n3", type:"ext_request",     title:"Extension Request",       body:"Priya Mehta requested deadline extension on Brochure",    to:"u2", from:"u3", ref:"t5", read:true,  at:"2026-03-01T11:00:00Z" },
    { id:"n4", type:"leave_request",   title:"Leave Request",           body:"Arjun Das applied for 3-day casual leave (Mar 18–20)",    to:"u4", from:"u5", ref:"l3", read:false, at:"2026-03-01T14:00:00Z" },
    { id:"n5", type:"leave_approved",  title:"Leave Approved",          body:"Your sick leave (Feb 24) has been approved",              to:"u7", from:"u2", ref:"l2", read:true,  at:"2026-02-24T15:00:00Z" },
  ],

  onboarding: [
    { id:"ob1", uId:"u8", startDate:"2026-02-01", steps:[
      { id:"s1",  label:"Google Workspace email created",   done:true  },
      { id:"s2",  label:"Added to Slack workspace",          done:true  },
      { id:"s3",  label:"Google Drive folder access granted",done:true  },
      { id:"s4",  label:"PP App account created",            done:true  },
      { id:"s5",  label:"Introduced to team on Slack",       done:true  },
      { id:"s6",  label:"NDA and employment contract signed", done:true  },
      { id:"s7",  label:"Design tools licensed",             done:false },
      { id:"s8",  label:"Brand guidelines shared",           done:false },
      { id:"s9",  label:"Client overview briefing done",     done:false },
      { id:"s10", label:"First task allocated and briefed",  done:false },
    ]}
  ],

  currentUser: "u1", // simulate logged-in user
};

const DEFAULT_OB_STEPS = [
  { id:"s1",  label:"Google Workspace email created"   },
  { id:"s2",  label:"Added to Slack workspace"          },
  { id:"s3",  label:"Google Drive folder access granted"},
  { id:"s4",  label:"PP App account created"            },
  { id:"s5",  label:"Introduced to team on Slack"       },
  { id:"s6",  label:"NDA and employment contract signed" },
  { id:"s7",  label:"Design tools licensed"             },
  { id:"s8",  label:"Brand guidelines shared"           },
  { id:"s9",  label:"Client overview briefing done"     },
  { id:"s10", label:"First task allocated and briefed"  },
];

// ─── UTILS ────────────────────────────────────────────────────────────────────
const fd  = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : "—";
const fdt = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";
const isOverdue = d => d && new Date(d) < new Date();
const clamp = (n,lo,hi) => Math.min(hi,Math.max(lo,n));

const STATUS_COLOR = s => ({
  "Completed":"green","In Progress":"blue","Review":"amber",
  "Delayed":"red","Not Started":"muted","Pending":"amber","Approved":"green","Rejected":"red"
}[s]||"muted");

const PRIORITY_COLOR = p => ({ High:"red", Medium:"amber", Low:"green" }[p]||"muted");

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts,setToasts] = useState([]);
  const add = useCallback((msg, type="success", duration=3000) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, type, out:false }]);
    setTimeout(() => setToasts(p => p.map(t => t.id===id ? {...t,out:true} : t)), duration - 350);
    setTimeout(() => setToasts(p => p.filter(t => t.id!==id)), duration);
  },[]);
  return [toasts, add];
}

function useCountUp(target, duration=700) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start, frame;
    const tick = ts => {
      if (!start) start = ts;
      const p = Math.min(1,(ts-start)/duration);
      const e = 1-Math.pow(1-p,3);
      setVal(Math.round(e * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  },[target,duration]);
  return val;
}

// ─── ATOM: Avatar ─────────────────────────────────────────────────────────────
function Av({ init, size=36, t, online=false }) {
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      <div style={{
        width:size, height:size, borderRadius:"50%",
        background:`linear-gradient(135deg, ${t.lime}33, ${t.lime}66)`,
        border:`1.5px solid ${t.lime}55`,
        color: t.lime, fontFamily:"'Poppins',sans-serif", fontWeight:700,
        fontSize: size*.36, display:"flex", alignItems:"center", justifyContent:"center",
        letterSpacing:"-0.02em",
      }}>{init}</div>
      {online && <div style={{ position:"absolute", bottom:1, right:1, width:9, height:9, borderRadius:"50%", background:t.green, border:`2px solid ${t.surface}` }}/>}
    </div>
  );
}

// ─── ATOM: Badge ──────────────────────────────────────────────────────────────
function Badge({ label, color="muted", t, small=false }) {
  const C = {
    green:  { bg:t.greenBg,  fg:t.green  },
    blue:   { bg:t.blueBg,   fg:t.blue   },
    amber:  { bg:t.amberBg,  fg:t.amber  },
    red:    { bg:t.redBg,    fg:t.red    },
    purple: { bg:t.purpleBg, fg:t.purple },
    lime:   { bg:t.limeBg,   fg:t.limeDeep },
    muted:  { bg:t.surfaceAlt, fg:t.textMuted },
  }[color] || { bg:t.surfaceAlt, fg:t.textMuted };
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:4,
      padding: small ? "1px 7px" : "3px 10px",
      borderRadius:99, fontSize:small?10:11, fontWeight:600,
      letterSpacing:"0.04em", textTransform:"uppercase",
      background:C.bg, color:C.fg, whiteSpace:"nowrap", flexShrink:0,
    }}>{label}</span>
  );
}

// ─── ATOM: Button ─────────────────────────────────────────────────────────────
function Btn({ children, onClick, v="primary", t, style={}, disabled=false, size="md", icon }) {
  const base = {
    display:"inline-flex", alignItems:"center", gap:6, borderRadius:10,
    fontFamily:"'DM Sans',sans-serif", fontWeight:600, cursor:disabled?"not-allowed":"pointer",
    border:"none", transition:"all .15s ease", opacity:disabled?.5:1,
    padding: size==="sm" ? "6px 14px" : size==="lg" ? "12px 24px" : "9px 18px",
    fontSize: size==="sm" ? 12 : size==="lg" ? 15 : 13,
  };
  const variants = {
    primary:   { background:t.text, color:t.bg },
    lime:      { background:t.lime, color:"#0A0A0A" },
    secondary: { background:t.surfaceAlt, color:t.textMid, border:`1px solid ${t.border}` },
    ghost:     { background:"transparent", color:t.textMuted },
    danger:    { background:t.redBg, color:t.red, border:`1px solid ${t.red}30` },
    success:   { background:t.greenBg, color:t.green, border:`1px solid ${t.green}40` },
    outline:   { background:"transparent", color:t.lime, border:`1.5px solid ${t.lime}` },
  };
  return (
    <button className="btn-press" onClick={disabled?undefined:onClick} disabled={disabled}
      style={{ ...base, ...variants[v]||variants.secondary, ...style }}>
      {icon && <span style={{display:"flex"}}>{icon}</span>}
      {children}
    </button>
  );
}

// ─── ATOM: Card ───────────────────────────────────────────────────────────────
function Card({ children, t, style={}, lift=false, onClick, pad=20 }) {
  return (
    <div className={lift ? "hover-lift" : ""} onClick={onClick}
      style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:16,
               padding:pad, cursor:onClick?"pointer":"default",
               boxShadow:`0 1px 4px ${t.shadow}`,
               transition:"border-color .15s ease, box-shadow .18s ease", ...style }}>
      {children}
    </div>
  );
}

// ─── ATOM: Progress Bar ───────────────────────────────────────────────────────
function ProgressBar({ value, max=100, color="lime", t, h=5, delay=0, showPct=true }) {
  const pct = clamp(max>0 ? Math.round((value/max)*100) : 0, 0, 100);
  const clrMap = { lime:t.lime, green:t.green, blue:t.blue, amber:t.amber, red:t.red };
  const clr = clrMap[color]||t.lime;
  const [w, setW] = useState(0);
  useEffect(() => { const id = setTimeout(()=>setW(pct), delay+60); return()=>clearTimeout(id); },[pct,delay]);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ flex:1, height:h, background:t.surfaceAlt, borderRadius:h, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${w}%`, background:clr, borderRadius:h,
                      transition:`width .72s cubic-bezier(.22,1,.36,1) ${delay}ms`,
                      transformOrigin:"left" }}/>
      </div>
      {showPct && <span style={{ fontSize:11, fontWeight:700, color:clr, minWidth:30, textAlign:"right",
                                  fontFamily:"'Poppins',sans-serif" }}>{pct}%</span>}
    </div>
  );
}

// ─── ATOM: Form elements ──────────────────────────────────────────────────────
const iStyle = t => ({
  width:"100%", padding:"10px 14px", background:t.surfaceAlt,
  border:`1.5px solid ${t.border}`, borderRadius:10, color:t.text,
  fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none",
  transition:"border-color .15s ease",
});
function Inp({ value, onChange, placeholder, type="text", t }) {
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={iStyle(t)} onFocus={e=>e.target.style.borderColor=t.lime}
    onBlur={e=>e.target.style.borderColor=t.border}/>;
}
function Sel({ value, onChange, children, t }) {
  return <select value={value} onChange={onChange} style={{...iStyle(t),cursor:"pointer"}}>{children}</select>;
}
function Tex({ value, onChange, placeholder, t, rows=3 }) {
  return <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
    style={{...iStyle(t),resize:"vertical"}} onFocus={e=>e.target.style.borderColor=t.lime}
    onBlur={e=>e.target.style.borderColor=t.border}/>;
}
function Field({ label, children, t }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.06em",
                      textTransform:"uppercase", color:t.textMuted, marginBottom:6 }}>{label}</label>
      {children}
    </div>
  );
}

// ─── ATOM: Modal ──────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, t, w=560, subtitle }) {
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return ()=>{document.body.style.overflow=""}; },[open]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,.6)", backdropFilter:"blur(4px)",
      zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center",
      padding:20, animation:"fadeIn .18s ease"
    }}>
      <div onClick={e=>e.stopPropagation()} className="scale-in" style={{
        background:t.surface, borderRadius:20, border:`1px solid ${t.border}`,
        width:"100%", maxWidth:w, maxHeight:"92vh", overflow:"auto",
        boxShadow:`0 24px 80px ${t.shadowMd}`, padding:28,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
                      marginBottom:22, paddingBottom:16, borderBottom:`1px solid ${t.border}` }}>
          <div>
            <h3 style={{ margin:0, fontFamily:"'Poppins',sans-serif", fontWeight:700,
                         fontSize:19, color:t.text }}>{title}</h3>
            {subtitle && <p style={{ margin:"4px 0 0", fontSize:13, color:t.textMuted }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{
            background:"none", border:`1px solid ${t.border}`, borderRadius:8,
            width:32, height:32, cursor:"pointer", color:t.textMuted, fontSize:16,
            display:"flex", alignItems:"center", justifyContent:"center",
            flexShrink:0, marginLeft:12, transition:"all .14s",
          }} onMouseEnter={e=>{e.currentTarget.style.background=t.surfaceAlt;e.currentTarget.style.color=t.text}}
             onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=t.textMuted}}>
            <X size={15}/>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── ATOM: Section Heading ────────────────────────────────────────────────────
function SHead({ title, sub, action, t }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between",
                  marginBottom:24, animation:"fadeUp .3s both" }}>
      <div>
        <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:26,
                     letterSpacing:"-0.02em", color:t.text, margin:0, lineHeight:1.1 }}>{title}</h2>
        {sub && <p style={{ fontSize:13, color:t.textMuted, margin:"5px 0 0" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── ATOM: Stat Card ──────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color="lime", icon:Icon, t, delay=0 }) {
  const clrMap = { lime:t.lime, green:t.green, blue:t.blue, amber:t.amber, red:t.red, text:t.text };
  const clr = clrMap[color]||t.lime;
  const displayed = useCountUp(typeof value==="number" ? value : 0);
  return (
    <Card t={t} style={{ animation:`fadeUp .42s cubic-bezier(.22,1,.36,1) ${delay}ms both`, overflow:"hidden", position:"relative" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:clr, borderRadius:"16px 16px 0 0" }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <span style={{ fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:t.textMuted }}>{label}</span>
        {Icon && <div style={{ width:30, height:30, borderRadius:8, background:t.surfaceAlt, display:"flex", alignItems:"center", justifyContent:"center", color:clr }}><Icon size={15}/></div>}
      </div>
      <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:42,
                    color:clr, lineHeight:1, letterSpacing:"-0.02em", animation:`countUp .5s ${delay+100}ms both` }}>
        {typeof value==="number" ? displayed : value}
      </div>
      {sub && <div style={{ fontSize:12, color:t.textMuted, marginTop:6 }}>{sub}</div>}
    </Card>
  );
}

// ─── ATOM: Toasts ─────────────────────────────────────────────────────────────
function Toasts({ list }) {
  const ico = { success:<CheckCircle2 size={15}/>, error:<XCircle size={15}/>, info:<Info size={15}/>, warning:<AlertTriangle size={15}/> };
  const clr = { success:"#16A34A", error:"#DC2626", info:"#2563EB", warning:"#D97706" };
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
      {list.map(t2 => (
        <div key={t2.id} style={{
          display:"flex", alignItems:"center", gap:10,
          padding:"12px 18px", borderRadius:12, maxWidth:320,
          background:"#0A0A0A", color:"#F0F0EC", fontSize:13, fontWeight:500,
          boxShadow:"0 8px 32px rgba(0,0,0,.4)",
          animation: t2.out ? "slideRight .3s forwards" : "toastSlide .32s cubic-bezier(.22,1,.36,1) both",
          borderLeft:`3px solid ${clr[t2.type]||clr.success}`,
        }}>
          <span style={{ color:clr[t2.type]||clr.success }}>{ico[t2.type]||ico.success}</span>
          {t2.msg}
        </div>
      ))}
    </div>
  );
}

// ─── ATOM: Dark Toggle ────────────────────────────────────────────────────────
function DarkToggle({ dark, onToggle, t }) {
  return (
    <button className="btn-press" onClick={onToggle} style={{
      display:"flex", alignItems:"center", gap:8, padding:"7px 12px",
      background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:99, cursor:"pointer"
    }}>
      <div style={{ width:34, height:19, borderRadius:99, background:dark?t.lime:t.borderMid,
                    position:"relative", transition:"background .28s ease", flexShrink:0 }}>
        <div style={{ position:"absolute", top:2.5, left:dark?16:2.5, width:14, height:14,
                      borderRadius:"50%", background:"#fff",
                      transition:"left .25s cubic-bezier(.34,1.56,.64,1)" }}/>
      </div>
      {dark ? <Moon size={13} color={t.textMuted}/> : <Sun size={13} color={t.textMuted}/>}
    </button>
  );
}

// ─── ATOM: Timer Display ──────────────────────────────────────────────────────
function LiveTimer({ startedAt, t, active }) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!startedAt || !active) return;
    const update = () => setSecs(Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startedAt, active]);
  const h = Math.floor(secs/3600), m = Math.floor((secs%3600)/60), s = secs%60;
  const fmt = n => String(n).padStart(2,"0");
  return (
    <span className={active?"timer-active":""} style={{
      fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:12,
      color: active ? t.lime : t.textMuted, letterSpacing:"0.06em",
    }}>{fmt(h)}:{fmt(m)}:{fmt(s)}</span>
  );
}

// ─── ATOM: PPLogo ─────────────────────────────────────────────────────────────
function PPLogo({ collapsed, dark }) {
  const fg = "#FAFAFA";
  const lime = "#C8E84A";
  if (collapsed) return (
    <svg viewBox="0 0 40 40" style={{ width:32, height:32 }} xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill={lime}/>
      <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle"
        fill="#0A0A0A" fontFamily="Poppins,sans-serif" fontWeight="800" fontSize="16">PP</text>
    </svg>
  );
  return (
    <svg viewBox="0 0 627.1 244.1" style={{ height:26, width:"auto", maxWidth:150 }} xmlns="http://www.w3.org/2000/svg">
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

// ══════════════════════════════════════════════════════════════════════════════
// PAGES
// ══════════════════════════════════════════════════════════════════════════════

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ t, data }) {
  const tasks = data.tasks;
  const total = tasks.length, comp = tasks.filter(x=>x.status==="Completed").length;
  const delayed = tasks.filter(x=>x.status==="Delayed").length;
  const inProg = tasks.filter(x=>x.status==="In Progress").length;
  const pendLeaves = data.leaves.filter(x=>x.status==="Pending").length;
  const pendExt = tasks.filter(x=>x.extRequest?.status==="Pending").length;
  const today = new Date();
  const upcoming = [...data.meetings].filter(m=>new Date(m.date)>=today).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const unread = data.notifications.filter(n=>!n.read).length;

  const uName = id => data.users.find(u=>u.id===id)?.name||"—";
  const cName = id => data.clients.find(c=>c.id===id)?.name||"—";

  return (
    <div>
      <SHead t={t} title="Studio Dashboard"
        sub={today.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}/>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:24 }}>
        <StatCard label="Total Tasks"    value={total}      icon={FolderKanban} color="text" t={t} delay={0}/>
        <StatCard label="Completed"      value={comp}       icon={CheckCircle2} color="green" t={t} delay={55}/>
        <StatCard label="In Progress"    value={inProg}     icon={Activity}     color="blue" t={t} delay={110}/>
        <StatCard label="Delayed"        value={delayed}    icon={AlertTriangle} color="red" t={t} delay={165}/>
        <StatCard label="Pending Leaves" value={pendLeaves} icon={Umbrella}     color="amber" t={t} delay={220}/>
        {pendExt>0 && <StatCard label="Ext. Requests" value={pendExt} icon={AlarmClock} color="purple" t={t} delay={275}/>}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:16, marginBottom:16 }}>
        {/* Active Tasks */}
        <Card t={t} style={{ animation:"fadeUp .4s .1s both" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, color:t.text, margin:0 }}>Active Tasks</h3>
            <Badge label={`${inProg+delayed} running`} color="blue" t={t}/>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {tasks.filter(x=>x.status!=="Completed").slice(0,5).map((task,i) => (
              <div key={task.id} className="row-hover" style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"10px 12px", background:t.surfaceAlt, borderRadius:10,
                animation:`fadeUp .3s ${i*40}ms both`,
              }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{task.title}</div>
                  <div style={{ fontSize:11, color:t.textMuted, marginTop:2 }}>{cName(task.cId)} · Due {fd(task.due)}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:12 }}>
                  {task.status==="In Progress" && task.startedAt &&
                    <LiveTimer startedAt={task.startedAt} t={t} active={true}/>}
                  <Badge label={task.status} color={STATUS_COLOR(task.status)} t={t}/>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Client Happiness */}
        <Card t={t} style={{ animation:"fadeUp .4s .18s both" }}>
          <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, color:t.text, marginBottom:16 }}>Client Happiness</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {data.clients.map((c,i) => (
              <div key={c.id} style={{ animation:`fadeUp .3s ${i*55}ms both` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:13, fontWeight:500, color:t.text }}>{c.name.split(" ").slice(0,2).join(" ")}</span>
                  <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:16,
                                  color:c.score>=80?t.green:c.score>=65?t.amber:t.red }}>{c.score}%</span>
                </div>
                <ProgressBar value={c.score} max={100} color={c.score>=80?"green":c.score>=65?"amber":"red"}
                  t={t} delay={i*70}/>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upcoming Meetings + Approval Needed */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card t={t} style={{ animation:"fadeUp .4s .26s both" }}>
          <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, color:t.text, marginBottom:14 }}>Upcoming Meetings</h3>
          {upcoming.length===0 ? <p style={{ color:t.textMuted, fontSize:13 }}>No upcoming meetings.</p>
            : upcoming.map((m,i) => (
              <div key={m.id} style={{ display:"flex", gap:12, alignItems:"flex-start",
                padding:"10px 0", borderBottom:i<upcoming.length-1?`1px solid ${t.border}`:"none",
                animation:`fadeUp .3s ${i*50}ms both` }}>
                <div style={{ flexShrink:0, textAlign:"center", width:40 }}>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:22, color:t.lime, lineHeight:1 }}>{new Date(m.date).getDate()}</div>
                  <div style={{ fontSize:10, fontWeight:600, color:t.textMuted, textTransform:"uppercase" }}>{new Date(m.date).toLocaleDateString("en-IN",{month:"short"})}</div>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:t.text }}>{cName(m.cId)}</div>
                  <div style={{ fontSize:11, color:t.textMuted }}>{m.time} · {m.loc}</div>
                </div>
              </div>
            ))}
        </Card>

        <Card t={t} style={{ animation:"fadeUp .4s .32s both" }}>
          <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, color:t.text, marginBottom:14 }}>Needs Approval</h3>
          {[...data.leaves.filter(l=>l.status==="Pending"), ...data.tasks.filter(tk=>tk.extRequest?.status==="Pending")].length===0
            ? <p style={{ color:t.textMuted, fontSize:13 }}>All clear — nothing pending.</p>
            : <>
                {data.leaves.filter(l=>l.status==="Pending").map((lv,i) => {
                  const u = data.users.find(u=>u.id===lv.uId);
                  return (
                    <div key={lv.id} style={{ display:"flex", alignItems:"center", gap:12,
                      padding:"9px 0", borderBottom:`1px solid ${t.border}` }}>
                      <Av init={u?.av||"?"} size={30} t={t}/>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:t.text }}>{u?.name}</div>
                        <div style={{ fontSize:11, color:t.textMuted }}>{lv.type} leave · {fd(lv.from)}–{fd(lv.to)}</div>
                      </div>
                      <Badge label="Leave" color="amber" t={t} small/>
                    </div>
                  );
                })}
                {data.tasks.filter(tk=>tk.extRequest?.status==="Pending").map((tk,i) => {
                  const u = data.users.find(u=>u.id===tk.aId);
                  return (
                    <div key={tk.id} style={{ display:"flex", alignItems:"center", gap:12,
                      padding:"9px 0", borderBottom:`1px solid ${t.border}` }}>
                      <Av init={u?.av||"?"} size={30} t={t}/>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:t.text }}>{tk.title}</div>
                        <div style={{ fontSize:11, color:t.textMuted }}>Extension → {fd(tk.extRequest.newDue)}</div>
                      </div>
                      <Badge label="Extension" color="purple" t={t} small/>
                    </div>
                  );
                })}
              </>}
        </Card>
      </div>
    </div>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects({ t, data, setData, toast }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [sel, setSel] = useState(null);
  const [showExt, setShowExt] = useState(false);
  const [extForm, setExtForm] = useState({ reason:"", newDue:"" });
  const [form, setForm] = useState({ title:"",cId:"",aId:"",priority:"Medium",due:"",brief:"",drive:"",est:"" });

  const uName = id => data.users.find(u=>u.id===id)?.name||"—";
  const cName = id => data.clients.find(c=>c.id===id)?.name||"—";
  const uAv   = id => data.users.find(u=>u.id===id)?.av||"??";

  const statuses = ["All","Not Started","In Progress","Review","Completed","Delayed"];
  const filtered = data.tasks.filter(tk => {
    const sMatch = filter==="All" || tk.status===filter;
    const qMatch = !search || tk.title.toLowerCase().includes(search.toLowerCase()) || cName(tk.cId).toLowerCase().includes(search.toLowerCase());
    return sMatch && qMatch;
  });

  const startTask = (id) => {
    setData(d => ({...d, tasks: d.tasks.map(tk =>
      tk.id===id ? {...tk, status:"In Progress", startedAt:tk.startedAt||new Date().toISOString()} : tk
    )}));
    toast("Task started — time logging is now active", "success");
  };

  const updStatus = (id, s) => {
    setData(d => ({...d, tasks: d.tasks.map(tk => {
      if (tk.id!==id) return tk;
      const updated = {...tk, status:s};
      if (s==="In Progress" && !tk.startedAt) updated.startedAt = new Date().toISOString();
      return updated;
    })}));
    if (sel?.id===id) setSel(p=>({...p, status:s}));
    toast(`Status updated → ${s}`);
  };

  const submitExt = () => {
    if (!extForm.reason||!extForm.newDue) { toast("Fill all fields","error"); return; }
    setData(d => ({...d,
      tasks: d.tasks.map(tk => tk.id===sel?.id ? {...tk, extRequest:{...extForm, status:"Pending"}} : tk),
      notifications: [...d.notifications, {
        id:"n"+Date.now(), type:"ext_request",
        title:"Extension Request", body:`${uName(sel?.aId)} requested extension on "${sel?.title}" → ${fd(extForm.newDue)}`,
        to: data.departments.find(dep=>dep.id===data.users.find(u=>u.id===sel?.aId)?.dept)?.hodId||"u2",
        from: sel?.aId, ref: sel?.id, read:false, at:new Date().toISOString()
      }]
    }));
    setShowExt(false); setExtForm({reason:"",newDue:""});
    toast("Extension request sent to HoD + email notification sent", "info");
  };

  const addTask = () => {
    if (!form.title||!form.cId||!form.aId) { toast("Fill required fields","error"); return; }
    const newTask = { ...form, id:"t"+Date.now(), status:"Not Started", logged:0, startedAt:null,
                      created:new Date().toISOString().split("T")[0], extRequest:null, est:parseInt(form.est)||0 };
    setData(d=>({...d, tasks:[...d.tasks, newTask]}));
    setShowAdd(false); setForm({title:"",cId:"",aId:"",priority:"Medium",due:"",brief:"",drive:"",est:""});
    toast("Task created");
  };

  return (
    <div>
      <SHead t={t} title="Projects" sub="All active work across clients and the team"
        action={<Btn t={t} v="lime" onClick={()=>setShowAdd(true)} icon={<Plus size={14}/>}>New Task</Btn>}/>

      {/* Filters */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex", gap:6 }}>
          {statuses.map(s => (
            <button key={s} onClick={()=>setFilter(s)} style={{
              padding:"5px 14px", borderRadius:99, border:`1.5px solid ${filter===s?t.lime:t.border}`,
              background:filter===s?t.limeBg:"transparent", color:filter===s?t.limeDeep:t.textMuted,
              fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .15s",
            }}>{s}</button>
          ))}
        </div>
        <div style={{ flex:1, minWidth:160, maxWidth:280, position:"relative" }}>
          <Search size={13} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:t.textMuted }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks..."
            style={{ ...iStyle(t), paddingLeft:32, height:34, fontSize:12 }}/>
        </div>
      </div>

      {/* Column headers */}
      <div style={{ display:"grid", gridTemplateColumns:"2.5fr 1.4fr 1fr .9fr .9fr .8fr",
        gap:10, padding:"6px 14px", fontSize:10, fontWeight:700, letterSpacing:"0.08em",
        textTransform:"uppercase", color:t.textMuted, marginBottom:6 }}>
        <span>Task</span><span>Client</span><span>Assignee</span><span>Priority</span><span>Status</span><span>Timer / Due</span>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {filtered.map((task,i) => {
          const over = task.logged > task.est;
          const lp = task.est>0 ? clamp(Math.round((task.logged/task.est)*100),0,100) : 0;
          const overdue = isOverdue(task.due) && task.status!=="Completed";
          return (
            <div key={task.id} className="hover-lift" onClick={()=>setSel(task)}
              style={{ background:t.surface, border:`1.5px solid ${task.extRequest?.status==="Pending"?t.purple+"60":t.border}`,
                borderRadius:12, padding:"12px 14px", cursor:"pointer",
                animation:`fadeUp .3s ${i*32}ms both`,
                boxShadow:`0 1px 3px ${t.shadow}` }}>
              <div style={{ display:"grid", gridTemplateColumns:"2.5fr 1.4fr 1fr .9fr .9fr .8fr", gap:10, alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:t.text, marginBottom:5 }}>{task.title}</div>
                  <ProgressBar value={task.logged} max={Math.max(task.est,task.logged,1)}
                    color={over?"red":lp>=80?"amber":"lime"} t={t} h={3} showPct={false}/>
                  <div style={{ fontSize:10, color:t.textMuted, marginTop:3 }}>{task.logged}h / {task.est}h est.</div>
                </div>
                <div style={{ fontSize:12, color:t.textMid }}>{cName(task.cId).split(" ").slice(0,2).join(" ")}</div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <Av init={uAv(task.aId)} size={24} t={t}/>
                  <span style={{ fontSize:12, color:t.textMid }}>{uName(task.aId).split(" ")[0]}</span>
                </div>
                <Badge label={task.priority} color={PRIORITY_COLOR(task.priority)} t={t} small/>
                <Badge label={task.status}   color={STATUS_COLOR(task.status)}   t={t} small/>
                <div style={{ textAlign:"right" }}>
                  {task.status==="In Progress" && task.startedAt
                    ? <LiveTimer startedAt={task.startedAt} t={t} active={true}/>
                    : <span style={{ fontSize:11, color:overdue?t.red:t.textMuted, fontWeight:overdue?700:400 }}>
                        {overdue && <AlertTriangle size={10} style={{ marginRight:3 }}/>}{fd(task.due)}
                      </span>}
                </div>
              </div>
              {task.extRequest?.status==="Pending" && (
                <div style={{ marginTop:8, padding:"6px 10px", background:t.purpleBg, borderRadius:8,
                  fontSize:11, color:t.purple, display:"flex", alignItems:"center", gap:6 }}>
                  <AlarmClock size={12}/> Extension requested → {fd(task.extRequest.newDue)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      {sel && (
        <Modal open title={sel.title} onClose={()=>{setSel(null);setShowExt(false)}} t={t} w={620}
          subtitle={`${cName(sel.cId)} · Assigned to ${uName(sel.aId)}`}>
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            <Badge label={sel.status}   color={STATUS_COLOR(sel.status)}   t={t}/>
            <Badge label={sel.priority} color={PRIORITY_COLOR(sel.priority)} t={t}/>
            {sel.status==="In Progress" && sel.startedAt &&
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"3px 10px",
                background:t.limeBg, borderRadius:99, border:`1px solid ${t.lime}40` }}>
                <Timer size={11} color={t.limeDeep}/>
                <LiveTimer startedAt={sel.startedAt} t={t} active={true}/>
              </div>}
          </div>

          {/* Time budget */}
          <div style={{ padding:"14px 16px", background:t.surfaceAlt, borderRadius:12, marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:12, fontWeight:600, color:t.textMuted, textTransform:"uppercase", letterSpacing:"0.06em" }}>Time Budget</span>
              <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15,
                color:sel.logged>sel.est?t.red:t.green }}>{sel.logged}h / {sel.est}h</span>
            </div>
            <ProgressBar value={sel.logged} max={Math.max(sel.est,sel.logged,1)}
              color={sel.logged>sel.est?"red":"lime"} t={t}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:16 }}>
            {[["Deadline",fd(sel.due)],["Created",fd(sel.created)],["Hours Left",`${Math.max(0,sel.est-sel.logged)}h`]].map(([k,v])=>(
              <div key={k}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:t.textMuted, marginBottom:3 }}>{k}</div>
                <div style={{ fontSize:14, color:t.text, fontWeight:600 }}>{v}</div>
              </div>
            ))}
          </div>

          <Field label="Brief" t={t}><p style={{ fontSize:13, color:t.textMid, lineHeight:1.7, margin:0 }}>{sel.brief}</p></Field>
          {sel.drive && (
            <a href={sel.drive} target="_blank" rel="noreferrer" style={{
              display:"inline-flex", alignItems:"center", gap:6, padding:"8px 14px",
              background:t.blueBg, color:t.blue, borderRadius:10, fontSize:13,
              fontWeight:600, textDecoration:"none", marginBottom:16 }}>
              <ExternalLink size={13}/> Google Drive
            </a>
          )}

          {/* Extension request info */}
          {sel.extRequest && (
            <div style={{ padding:"12px 14px", borderRadius:12, marginBottom:16,
              background:sel.extRequest.status==="Pending"?t.purpleBg:sel.extRequest.status==="Approved"?t.greenBg:t.redBg,
              border:`1px solid ${sel.extRequest.status==="Pending"?t.purple+"40":sel.extRequest.status==="Approved"?t.green+"40":t.red+"40"}` }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <div style={{ fontWeight:600, fontSize:13, color:t.text }}>Deadline Extension Request</div>
                <Badge label={sel.extRequest.status} color={STATUS_COLOR(sel.extRequest.status)} t={t} small/>
              </div>
              <div style={{ fontSize:12, color:t.textMid, marginTop:4 }}>{sel.extRequest.reason}</div>
              <div style={{ fontSize:12, color:t.textMuted, marginTop:4 }}>New deadline: {fd(sel.extRequest.newDue)}</div>
            </div>
          )}

          {/* Status buttons */}
          <div style={{ borderTop:`1px solid ${t.border}`, paddingTop:14 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase",
              color:t.textMuted, marginBottom:10 }}>Update Status</div>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              {sel.status==="Not Started" && (
                <Btn v="lime" t={t} size="sm" icon={<Play size={12}/>}
                  onClick={()=>{startTask(sel.id);setSel(p=>({...p,status:"In Progress",startedAt:new Date().toISOString()}))}}>
                  Start Task
                </Btn>
              )}
              {["In Progress","Review","Completed","Delayed"].map(s=>(
                <Btn key={s} v={sel.status===s?"lime":"secondary"} t={t} size="sm"
                  onClick={()=>updStatus(sel.id,s)}>
                  {sel.status===s && <Check size={11}/>} {s}
                </Btn>
              ))}
              {sel.status==="Delayed" && !sel.extRequest && (
                <Btn v="outline" t={t} size="sm" icon={<AlarmClock size={12}/>}
                  onClick={()=>setShowExt(true)}>
                  Request Extension
                </Btn>
              )}
            </div>
          </div>

          {/* Extension request form */}
          {showExt && (
            <div style={{ marginTop:16, padding:"14px 16px", background:t.surfaceAlt, borderRadius:12, border:`1px solid ${t.border}` }}>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, color:t.text, marginBottom:12 }}>Request Deadline Extension</div>
              <Field label="Reason *" t={t}><Tex value={extForm.reason} onChange={e=>setExtForm(p=>({...p,reason:e.target.value}))} placeholder="Why is an extension needed?" t={t} rows={2}/></Field>
              <Field label="Proposed New Deadline *" t={t}><Inp type="date" value={extForm.newDue} onChange={e=>setExtForm(p=>({...p,newDue:e.target.value}))} t={t}/></Field>
              <div style={{ display:"flex", gap:8 }}>
                <Btn v="lime" t={t} size="sm" onClick={submitExt} icon={<Send size={11}/>}>Send to HoD</Btn>
                <Btn v="ghost" t={t} size="sm" onClick={()=>setShowExt(false)}>Cancel</Btn>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Add Task Modal */}
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="New Task" t={t}>
        <Field label="Task Title *" t={t}><Inp value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Annual Report Design" t={t}/></Field>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="Client *" t={t}><Sel value={form.cId} onChange={e=>setForm(p=>({...p,cId:e.target.value}))} t={t}><option value="">Select client</option>{data.clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Sel></Field>
          <Field label="Assign To *" t={t}><Sel value={form.aId} onChange={e=>setForm(p=>({...p,aId:e.target.value}))} t={t}><option value="">Select member</option>{data.users.filter(u=>u.role!=="Admin").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</Sel></Field>
          <Field label="Priority" t={t}><Sel value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))} t={t}>{["High","Medium","Low"].map(x=><option key={x}>{x}</option>)}</Sel></Field>
          <Field label="Deadline" t={t}><Inp type="date" value={form.due} onChange={e=>setForm(p=>({...p,due:e.target.value}))} t={t}/></Field>
          <Field label="Est. Hours" t={t}><Inp type="number" value={form.est} onChange={e=>setForm(p=>({...p,est:e.target.value}))} placeholder="40" t={t}/></Field>
        </div>
        <Field label="Brief" t={t}><Tex value={form.brief} onChange={e=>setForm(p=>({...p,brief:e.target.value}))} placeholder="Scope of work..." t={t}/></Field>
        <Field label="Google Drive Link" t={t}><Inp value={form.drive} onChange={e=>setForm(p=>({...p,drive:e.target.value}))} placeholder="https://drive.google.com/..." t={t}/></Field>
        <div style={{ display:"flex", gap:9, justifyContent:"flex-end", marginTop:8 }}>
          <Btn v="secondary" t={t} onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={addTask} icon={<Plus size={13}/>}>Create Task</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── TIME LOGS ────────────────────────────────────────────────────────────────
function TimeLogs({ t, data, setData, toast }) {
  const [fm, setFm] = useState("all");
  const [showLog, setShowLog] = useState(false);
  const [lf, setLf] = useState({ tId:"", uId:"", date:"", hrs:"", note:"" });

  const uName = id => data.users.find(u=>u.id===id)?.name||"—";
  const tName = id => data.tasks.find(tk=>tk.id===id)?.title||"—";

  const logs = fm==="all" ? data.timeLogs : data.timeLogs.filter(l=>l.uId===fm);
  const totalHrs = logs.reduce((s,l)=>s+l.hrs,0);
  const autoHrs  = logs.filter(l=>l.auto).reduce((s,l)=>s+l.hrs,0);
  const perM = data.users.filter(u=>u.role!=="Admin").map(u=>({
    ...u, hrs: data.timeLogs.filter(l=>l.uId===u.id).reduce((s,l)=>s+l.hrs,0)
  })).sort((a,b)=>b.hrs-a.hrs);

  const logTime = () => {
    if (!lf.tId||!lf.uId||!lf.hrs) { toast("Fill all fields","error"); return; }
    const h = parseFloat(lf.hrs);
    const newLog = {...lf, id:"tl"+Date.now(), hrs:h, auto:false, uId:lf.uId};
    setData(d=>({...d,
      timeLogs:[...d.timeLogs, newLog],
      tasks: d.tasks.map(tk=>tk.id===lf.tId ? {...tk,logged:(tk.logged||0)+h} : tk)
    }));
    setShowLog(false); setLf({tId:"",uId:"",date:"",hrs:"",note:""});
    toast("Time logged successfully");
  };

  return (
    <div>
      <SHead t={t} title="Time Logs" sub="Track and review hours across tasks and the team"
        action={<Btn v="lime" t={t} onClick={()=>setShowLog(true)} icon={<Plus size={14}/>}>Log Time</Btn>}/>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:24 }}>
        <StatCard label="Total Hours"  value={totalHrs} icon={Clock}    color="lime" t={t} delay={0}/>
        <StatCard label="Auto-tracked" value={autoHrs}  icon={Zap}      color="green" t={t} delay={55}/>
        <StatCard label="Manual Logs"  value={logs.filter(l=>!l.auto).length} icon={FileText} color="blue" t={t} delay={110}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:16 }}>
        {/* Per member */}
        <Card t={t} style={{ animation:"fadeUp .4s .1s both" }}>
          <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, color:t.text, marginBottom:14, textTransform:"uppercase", letterSpacing:"0.06em" }}>By Member</h3>
          {perM.map((m,i) => (
            <div key={m.id} style={{ marginBottom:14, animation:`fadeUp .3s ${i*45}ms both` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <Av init={m.av} size={26} t={t}/>
                  <span style={{ fontSize:12, fontWeight:600, color:t.text }}>{m.name.split(" ")[0]}</span>
                </div>
                <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:18, color:t.lime }}>{m.hrs}h</span>
              </div>
              <ProgressBar value={m.hrs} max={Math.max(...perM.map(x=>x.hrs),1)} color="lime" t={t} h={3} delay={i*50} showPct={false}/>
            </div>
          ))}
        </Card>

        {/* Log entries */}
        <Card t={t} style={{ animation:"fadeUp .4s .18s both" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, color:t.text, textTransform:"uppercase", letterSpacing:"0.06em" }}>All Entries</h3>
            <select value={fm} onChange={e=>setFm(e.target.value)} style={{...iStyle(t),width:160,padding:"6px 10px",fontSize:12}}>
              <option value="all">All members</option>
              {data.users.filter(u=>u.role!=="Admin").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          {logs.length===0 ? <p style={{ color:t.textMuted, fontSize:13 }}>No time entries yet.</p>
            : <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {logs.map((log,i)=>(
                  <div key={log.id} className="row-hover" style={{
                    display:"grid", gridTemplateColumns:"2fr 1fr .6fr 1.4fr auto",
                    gap:10, alignItems:"center", padding:"10px 12px",
                    background:t.surfaceAlt, borderRadius:10,
                    animation:`fadeUp .28s ${i*32}ms both`,
                  }}>
                    <div style={{ fontSize:13, fontWeight:600, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{tName(log.tId)}</div>
                    <div style={{ fontSize:12, color:t.textMid }}>{uName(log.uId).split(" ")[0]}</div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:18, color:t.lime }}>{log.hrs}h</div>
                    <div style={{ fontSize:12, color:t.textMuted }}>{log.note||"—"}</div>
                    {log.auto
                      ? <div style={{ display:"flex", alignItems:"center", gap:4, padding:"2px 8px", background:t.limeBg, borderRadius:99 }}>
                          <Zap size={10} color={t.limeDeep}/><span style={{ fontSize:10, color:t.limeDeep, fontWeight:600 }}>Auto</span>
                        </div>
                      : <div style={{ width:8, height:8, borderRadius:"50%", background:t.blue }}/>}
                  </div>
                ))}
              </div>}
        </Card>
      </div>

      <Modal open={showLog} onClose={()=>setShowLog(false)} title="Log Time" t={t} w={440}>
        <Field label="Task" t={t}><Sel value={lf.tId} onChange={e=>setLf(p=>({...p,tId:e.target.value}))} t={t}><option value="">Select task</option>{data.tasks.map(tk=><option key={tk.id} value={tk.id}>{tk.title}</option>)}</Sel></Field>
        <Field label="Team Member" t={t}><Sel value={lf.uId} onChange={e=>setLf(p=>({...p,uId:e.target.value}))} t={t}><option value="">Select</option>{data.users.filter(u=>u.role!=="Admin").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</Sel></Field>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="Date" t={t}><Inp type="date" value={lf.date} onChange={e=>setLf(p=>({...p,date:e.target.value}))} t={t}/></Field>
          <Field label="Hours" t={t}><Inp type="number" value={lf.hrs} onChange={e=>setLf(p=>({...p,hrs:e.target.value}))} placeholder="e.g. 4" t={t}/></Field>
        </div>
        <Field label="Note" t={t}><Inp value={lf.note} onChange={e=>setLf(p=>({...p,note:e.target.value}))} placeholder="What was done?" t={t}/></Field>
        <div style={{ display:"flex", gap:9, justifyContent:"flex-end", marginTop:6 }}>
          <Btn v="secondary" t={t} onClick={()=>setShowLog(false)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={logTime}>Log Time</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── EFFICIENCY ───────────────────────────────────────────────────────────────
function Efficiency({ t, data }) {
  const tasks = data.tasks;
  const total = tasks.length, comp = tasks.filter(x=>x.status==="Completed").length;
  const delayed = tasks.filter(x=>x.status==="Delayed").length;
  const perf = total>0 ? Math.round(((total-delayed)/total)*100) : 100;
  const pp = data.users.filter(u=>u.role!=="Admin").map(u => {
    const a = tasks.filter(tk=>tk.aId===u.id);
    const done = a.filter(tk=>tk.status==="Completed").length;
    const late = a.filter(tk=>tk.status==="Delayed").length;
    const p = a.length>0 ? Math.round(((a.length-late)/a.length)*100) : 100;
    return {...u, assigned:a.length, done, late, perf:p};
  });

  return (
    <div>
      <SHead t={t} title="Deadline Efficiency" sub="Performance metrics across all tasks and team members"/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:26 }}>
        <StatCard label="Tasks Allotted"    value={total}   icon={Target}      color="text" t={t} delay={0}/>
        <StatCard label="On Time"           value={comp}    icon={CheckCircle2} color="green" t={t} delay={55}/>
        <StatCard label="Deadlines Missed"  value={delayed} icon={TrendingDown} color="red" t={t} delay={110}/>
        <StatCard label="Studio Score"      value={`${perf}%`} icon={Award}    color={perf>=80?"lime":perf>=65?"amber":"red"} t={t} delay={165}/>
      </div>

      <Card t={t} style={{ animation:"fadeUp .4s .14s both" }}>
        <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:16, color:t.text, marginBottom:22 }}>Individual Performance</h3>
        {pp.map((p,i) => (
          <div key={p.id} style={{ animation:`fadeUp .32s ${i*55}ms both`, marginBottom:i<pp.length-1?24:0 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <Av init={p.av} size={40} t={t}/>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:t.text }}>{p.name}</div>
                  <div style={{ fontSize:11, color:t.textMuted, marginTop:2 }}>{p.assigned} tasks · {p.done} done · {p.late} delayed</div>
                </div>
              </div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:34,
                color:p.perf>=80?t.lime:p.perf>=60?t.amber:t.red, lineHeight:1 }}>
                {p.perf}%
              </div>
            </div>
            <ProgressBar value={p.perf} max={100} color={p.perf>=80?"lime":p.perf>=60?"amber":"red"} t={t} delay={i*75}/>
            {i<pp.length-1 && <div style={{ height:1, background:t.border, marginTop:22 }}/>}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── CLIENTS ──────────────────────────────────────────────────────────────────
function Clients({ t, data, setData, toast }) {
  const [sel, setSel] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", industry:"", drive:"", notes:"" });

  const add = () => {
    if (!form.name) { toast("Name required","error"); return; }
    setData(d=>({...d, clients:[...d.clients,{...form,id:"c"+Date.now(),score:80,met:0,missed:0,deliverables:[]}]}));
    setShowAdd(false); setForm({name:"",industry:"",drive:"",notes:""});
    toast("Client added");
  };

  return (
    <div>
      <SHead t={t} title="Clients" sub="Manage relationships, assets, and happiness scores"
        action={<Btn v="lime" t={t} onClick={()=>setShowAdd(true)} icon={<Plus size={14}/>}>New Client</Btn>}/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
        {data.clients.map((c,i) => (
          <Card t={t} key={c.id} lift onClick={()=>setSel(c)}
            style={{ cursor:"pointer", animation:`fadeUp .38s ${i*60}ms both`,
              borderTop:`3px solid ${c.score>=80?t.lime:c.score>=65?t.amber:t.red}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:t.text, fontFamily:"'Poppins',sans-serif" }}>{c.name}</div>
                <div style={{ fontSize:11, color:t.textMuted, marginTop:3 }}>{c.industry}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:28, lineHeight:1,
                  color:c.score>=80?t.lime:c.score>=65?t.amber:t.red }}>{c.score}%</div>
                <div style={{ fontSize:9, color:t.textMuted, fontWeight:600, textTransform:"uppercase" }}>happiness</div>
              </div>
            </div>
            <ProgressBar value={c.score} max={100} color={c.score>=80?"lime":c.score>=65?"amber":"red"} t={t} delay={i*75}/>
            <div style={{ display:"flex", justifyContent:"space-around", marginTop:14, paddingTop:12, borderTop:`1px solid ${t.border}` }}>
              {[["On Time",c.met,"lime"],["Missed",c.missed,"red"],["Deliverables",c.deliverables.length,"blue"]].map(([l,v,c2])=>(
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:22, color:t[c2] }}>{v}</div>
                  <div style={{ fontSize:9, color:t.textMuted, textTransform:"uppercase", fontWeight:600 }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {sel && (
        <Modal open title={sel.name} onClose={()=>setSel(null)} t={t} subtitle={sel.industry}>
          <Field label="Deliverables" t={t}>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {sel.deliverables.map(d=><span key={d} style={{ padding:"4px 10px", background:t.limeBg, borderRadius:99, fontSize:12, color:t.limeDeep, fontWeight:500 }}>{d}</span>)}
              {sel.deliverables.length===0 && <span style={{ fontSize:13, color:t.textMuted }}>None listed yet.</span>}
            </div>
          </Field>
          {sel.notes && <Field label="Notes" t={t}><p style={{ fontSize:13, color:t.textMid, lineHeight:1.7, padding:"10px 12px", background:t.surfaceAlt, borderRadius:10, margin:0 }}>{sel.notes}</p></Field>}
          <Field label="Google Drive" t={t}>
            <a href={sel.drive} target="_blank" rel="noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 14px", background:t.blueBg, color:t.blue, borderRadius:10, fontSize:13, fontWeight:600, textDecoration:"none" }}>
              <ExternalLink size={13}/> Open Drive Folder
            </a>
          </Field>
          <Field label={`Happiness Score — ${sel.score}%`} t={t}><ProgressBar value={sel.score} max={100} color={sel.score>=80?"lime":sel.score>=65?"amber":"red"} t={t}/><p style={{ fontSize:11, color:t.textMuted, marginTop:6 }}>{sel.met} deadlines met · {sel.missed} missed</p></Field>
        </Modal>
      )}

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="New Client" t={t} w={460}>
        <Field label="Client Name *" t={t}><Inp value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. L&T Ltd." t={t}/></Field>
        <Field label="Industry" t={t}><Inp value={form.industry} onChange={e=>setForm(p=>({...p,industry:e.target.value}))} placeholder="e.g. Industrial Manufacturing" t={t}/></Field>
        <Field label="Drive Link" t={t}><Inp value={form.drive} onChange={e=>setForm(p=>({...p,drive:e.target.value}))} placeholder="https://drive.google.com/..." t={t}/></Field>
        <Field label="Notes" t={t}><Tex value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Contacts, preferences..." t={t} rows={2}/></Field>
        <div style={{ display:"flex", gap:9, justifyContent:"flex-end", marginTop:8 }}>
          <Btn v="secondary" t={t} onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={add} icon={<Plus size={13}/>}>Add Client</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── MEETINGS ─────────────────────────────────────────────────────────────────
function Meetings({ t, data, setData, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState({ cId:"", date:"", time:"", loc:"", attendees:"", agenda:"", mom:"" });
  const cName = id => data.clients.find(c=>c.id===id)?.name||"—";
  const uName = id => data.users.find(u=>u.id===id)?.name||id;
  const today = new Date();

  const add = () => {
    if (!form.cId||!form.date) { toast("Client and date required","error"); return; }
    setData(d=>({...d, meetings:[...d.meetings,{...form,id:"m"+Date.now(),attendees:form.attendees.split(",").map(s=>s.trim()).filter(Boolean),actions:[]}]}));
    setShowAdd(false); setForm({cId:"",date:"",time:"",loc:"",attendees:"",agenda:"",mom:""});
    toast("Meeting scheduled");
  };

  const sorted = [...data.meetings].sort((a,b)=>new Date(a.date)-new Date(b.date));

  return (
    <div>
      <SHead t={t} title="Meetings" sub="Every client interaction, tracked"
        action={<Btn v="lime" t={t} onClick={()=>setShowAdd(true)} icon={<Plus size={14}/>}>Schedule Meeting</Btn>}/>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {sorted.map((m,i) => {
          const isPast = new Date(m.date) < today;
          const d = new Date(m.date);
          return (
            <div key={m.id} className="hover-lift" onClick={()=>setSel(m)}
              style={{ display:"flex", background:t.surface, border:`1px solid ${t.border}`,
                borderRadius:14, overflow:"hidden", cursor:"pointer",
                animation:`fadeUp .32s ${i*40}ms both`, boxShadow:`0 1px 4px ${t.shadow}` }}>
              {/* Date block */}
              <div style={{ width:72, flexShrink:0, display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center", padding:"14px 8px",
                background: isPast ? t.surfaceAlt : t.limeBg,
                borderRight:`1px solid ${t.border}` }}>
                <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:26,
                  color:isPast?t.textMuted:t.limeDeep, lineHeight:1 }}>{d.getDate()}</div>
                <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase",
                  color:isPast?t.textMuted:t.limeDeep, letterSpacing:"0.06em" }}>
                  {d.toLocaleDateString("en-IN",{month:"short"})}
                </div>
                <div style={{ fontSize:10, color:isPast?t.textMuted:t.limeDeep, marginTop:3 }}>{m.time}</div>
              </div>
              {/* Content */}
              <div style={{ flex:1, padding:"14px 18px", display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:t.text, fontFamily:"'Poppins',sans-serif" }}>{cName(m.cId)}</div>
                  <div style={{ fontSize:12, color:t.textMuted, marginTop:3, display:"flex", alignItems:"center", gap:6 }}>
                    <MapPin size={11}/>{m.loc}
                  </div>
                  <div style={{ fontSize:12, color:t.textMid, marginTop:5 }}>{m.agenda}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end" }}>
                  {m.mom ? <Badge label="MoM Done" color="green" t={t} small/> : isPast ? <Badge label="MoM Pending" color="red" t={t} small/> : <Badge label="Upcoming" color="lime" t={t} small/>}
                  <div style={{ display:"flex", gap:3 }}>
                    {(m.attendees||[]).slice(0,3).map((a,j)=>{
                      const u = data.users.find(u=>u.id===a);
                      return <Av key={j} init={u?.av||a.slice(0,2).toUpperCase()} size={22} t={t}/>;
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sel && (
        <Modal open title={`${cName(sel.cId)} — Meeting`} onClose={()=>setSel(null)} t={t}
          subtitle={`${fdt(sel.date)} · ${sel.time} · ${sel.loc}`}>
          <Field label="Attendees" t={t}>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {(sel.attendees||[]).map((a,i)=>{const u=data.users.find(u=>u.id===a);return<span key={i} style={{fontSize:12,color:t.textMid,background:t.surfaceAlt,padding:"4px 10px",borderRadius:99}}>{u?.name||a}</span>;})}
            </div>
          </Field>
          <Field label="Agenda" t={t}><p style={{ margin:0, fontSize:13, color:t.textMid, lineHeight:1.7 }}>{sel.agenda}</p></Field>
          {sel.mom && <Field label="Minutes of Meeting" t={t}><p style={{ margin:0, fontSize:13, color:t.textMid, lineHeight:1.7, padding:"10px 12px", background:t.surfaceAlt, borderRadius:10 }}>{sel.mom}</p></Field>}
          {sel.actions?.length>0 && (
            <Field label="Action Items" t={t}>
              {sel.actions.map((a,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"9px 12px", background:t.surfaceAlt, borderRadius:10, marginBottom:7 }}>
                  <span style={{ fontSize:13, color:t.text }}>{a.item}</span>
                  <div style={{ textAlign:"right", marginLeft:12, flexShrink:0 }}>
                    <div style={{ fontSize:11, color:t.textMuted }}>{uName(a.owner)}</div>
                    <div style={{ fontSize:11, color:t.lime, fontWeight:600 }}>By {fd(a.due)}</div>
                  </div>
                </div>
              ))}
            </Field>
          )}
        </Modal>
      )}

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Schedule Meeting" t={t}>
        <Field label="Client *" t={t}><Sel value={form.cId} onChange={e=>setForm(p=>({...p,cId:e.target.value}))} t={t}><option value="">Select client</option>{data.clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Sel></Field>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="Date *" t={t}><Inp type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} t={t}/></Field>
          <Field label="Time" t={t}><Inp type="time" value={form.time} onChange={e=>setForm(p=>({...p,time:e.target.value}))} t={t}/></Field>
        </div>
        <Field label="Location / Platform" t={t}><Inp value={form.loc} onChange={e=>setForm(p=>({...p,loc:e.target.value}))} placeholder="Google Meet / Mumbai Office" t={t}/></Field>
        <Field label="Attendees (comma-separated User IDs or Names)" t={t}><Inp value={form.attendees} onChange={e=>setForm(p=>({...p,attendees:e.target.value}))} placeholder="u1, u2, u3" t={t}/></Field>
        <Field label="Agenda" t={t}><Tex value={form.agenda} onChange={e=>setForm(p=>({...p,agenda:e.target.value}))} t={t} rows={2}/></Field>
        <Field label="MoM (if already available)" t={t}><Tex value={form.mom} onChange={e=>setForm(p=>({...p,mom:e.target.value}))} t={t} rows={2}/></Field>
        <div style={{ display:"flex", gap:9, justifyContent:"flex-end", marginTop:8 }}>
          <Btn v="secondary" t={t} onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={add}>Schedule</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── LEAVES ───────────────────────────────────────────────────────────────────
function Leaves({ t, data, setData, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ uId:"", type:"Casual", from:"", to:"", reason:"" });
  const days = (f,to) => !f||!to?0:Math.max(1,Math.round((new Date(to)-new Date(f))/86400000)+1);
  const uName = id => data.users.find(u=>u.id===id)?.name||"—";
  const uAv   = id => data.users.find(u=>u.id===id)?.av||"?";

  const getDept = uId => data.departments.find(d=>d.id===data.users.find(u=>u.id===uId)?.dept);
  const getHod  = uId => getDept(uId)?.hodId;

  const submit = () => {
    const u = data.users.find(u=>u.id===form.uId);
    if (!u||!form.from||!form.to) { toast("Fill all fields","error"); return; }
    const d = days(form.from,form.to);
    const hodId = getHod(form.uId);
    const newLeave = {...form, id:"l"+Date.now(), days:d, status:"Pending", on:new Date().toISOString().split("T")[0]};
    const notif = { id:"n"+Date.now(), type:"leave_request", title:"Leave Request",
      body:`${u.name} applied for ${d}-day ${form.type} leave (${fd(form.from)}–${fd(form.to)})`,
      to:hodId, from:form.uId, ref:newLeave.id, read:false, at:new Date().toISOString() };
    setData(d2=>({...d2, leaves:[...d2.leaves,newLeave], notifications:[...d2.notifications,notif]}));
    setShowAdd(false); setForm({uId:"",type:"Casual",from:"",to:"",reason:""});
    toast(`Leave applied — HoD notified by app + email`, "info");
  };

  const respond = (id, status) => {
    const lv = data.leaves.find(l=>l.id===id);
    const u = data.users.find(u=>u.id===lv?.uId);
    const notif = { id:"n"+Date.now(), type:"leave_"+status.toLowerCase(),
      title:`Leave ${status}`, body:`Your ${lv?.type} leave (${fd(lv?.from)}–${fd(lv?.to)}) has been ${status.toLowerCase()}`,
      to:lv?.uId, from:data.currentUser, ref:id, read:false, at:new Date().toISOString() };
    setData(d=>({...d,
      leaves: d.leaves.map(l=>l.id===id?{...l,status}:l),
      leaveBalances: status==="Approved" ? {...d.leaveBalances, [lv.uId]:{...d.leaveBalances[lv.uId], taken:(d.leaveBalances[lv.uId]?.taken||0)+lv.days}} : d.leaveBalances,
      notifications:[...d.notifications,notif]
    }));
    toast(`Leave ${status.toLowerCase()} — ${u?.name} notified by app + email`, "success");
  };

  const approveExt = (tId) => {
    const tk = data.tasks.find(t=>t.id===tId);
    const u = data.users.find(u=>u.id===tk?.aId);
    setData(d=>({...d,
      tasks: d.tasks.map(t=>t.id===tId?{...t,due:t.extRequest.newDue,extRequest:{...t.extRequest,status:"Approved"}}:t),
      notifications:[...d.notifications,{
        id:"n"+Date.now(), type:"ext_approved", title:"Extension Approved",
        body:`Your extension request for "${tk?.title}" has been approved. New deadline: ${fd(tk?.extRequest?.newDue)}`,
        to:tk?.aId, from:data.currentUser, ref:tId, read:false, at:new Date().toISOString()
      }]
    }));
    toast(`Extension approved — ${u?.name} notified`, "success");
  };

  const rejectExt = (tId) => {
    const tk = data.tasks.find(t=>t.id===tId);
    setData(d=>({...d,
      tasks:d.tasks.map(t=>t.id===tId?{...t,extRequest:{...t.extRequest,status:"Rejected"}}:t)
    }));
    toast("Extension rejected", "info");
  };

  const pendingExt = data.tasks.filter(tk=>tk.extRequest?.status==="Pending");

  return (
    <div>
      <SHead t={t} title="Leave Tracker" sub="Manage team availability, balances, and approval flows"
        action={<Btn v="lime" t={t} onClick={()=>setShowAdd(true)} icon={<Plus size={14}/>}>Apply Leave</Btn>}/>

      {/* Extension requests - prominent */}
      {pendingExt.length>0 && (
        <div style={{ marginBottom:20, animation:"fadeUp .3s both" }}>
          <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:t.purple, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
            <AlarmClock size={13}/> Deadline Extension Requests ({pendingExt.length})
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {pendingExt.map(tk=>{
              const u = data.users.find(u=>u.id===tk.aId);
              return (
                <Card key={tk.id} t={t} style={{ border:`1.5px solid ${t.purple}40`, background:t.purpleBg }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <Av init={u?.av||"?"} size={36} t={t}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:t.text }}>{tk.title}</div>
                      <div style={{ fontSize:12, color:t.textMuted, marginTop:2 }}>
                        {u?.name} · Reason: {tk.extRequest.reason}
                      </div>
                      <div style={{ fontSize:11, color:t.purple, marginTop:2, fontWeight:600 }}>
                        Current: {fd(tk.due)} → Requested: {fd(tk.extRequest.newDue)}
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <Btn v="success" t={t} size="sm" icon={<ThumbsUp size={12}/>} onClick={()=>approveExt(tk.id)}>Approve</Btn>
                      <Btn v="danger"  t={t} size="sm" icon={<ThumbsDown size={12}/>} onClick={()=>rejectExt(tk.id)}>Reject</Btn>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Leave balances */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12, marginBottom:22 }}>
        {data.users.filter(u=>u.role!=="Admin").map((u,i) => {
          const bal = data.leaveBalances[u.id]||{total:12,taken:0};
          const avail = bal.total - bal.taken;
          const warn = avail<0;
          return (
            <Card t={t} key={u.id} style={{
              borderTop:`3px solid ${warn?t.red:avail<=2?t.amber:t.lime}`,
              animation:`fadeUp .36s ${i*45}ms both`
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <Av init={u.av} size={32} t={t}/>
                <div><div style={{ fontSize:13, fontWeight:700, color:t.text }}>{u.name.split(" ")[0]}</div><div style={{ fontSize:10, color:t.textMuted }}>{u.role}</div></div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-around", textAlign:"center" }}>
                {[["Taken",bal.taken,t.textMid],["Left",Math.max(0,avail),avail>0?t.lime:t.red],["Total",bal.total,t.textMuted]].map(([l,v,c])=>(
                  <div key={l}><div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:20, color:c }}>{v}</div><div style={{ fontSize:9, textTransform:"uppercase", color:t.textMuted, fontWeight:600 }}>{l}</div></div>
                ))}
              </div>
              {warn && <div style={{ marginTop:10, padding:"5px 10px", background:t.redBg, color:t.red, borderRadius:8, fontSize:11, fontWeight:600, animation:"pulse 2s infinite", textAlign:"center" }}>⚠ Unpaid leave applies</div>}
            </Card>
          );
        })}
      </div>

      {/* Leave requests */}
      <Card t={t} style={{ animation:"fadeUp .4s .2s both" }}>
        <h3 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, color:t.text, marginBottom:14, textTransform:"uppercase", letterSpacing:"0.06em" }}>Leave Requests</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {data.leaves.map((lv,i)=>{
            const u = data.users.find(u=>u.id===lv.uId);
            return (
              <div key={lv.id} className="row-hover" style={{
                display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
                background:t.surfaceAlt, borderRadius:12,
                animation:`fadeUp .3s ${i*38}ms both`,
              }}>
                <Av init={u?.av||"?"} size={32} t={t}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:t.text }}>{u?.name}</div>
                  <div style={{ fontSize:11, color:t.textMuted }}>{lv.type} · {lv.days} day{lv.days>1?"s":""} · {fd(lv.from)}–{fd(lv.to)}</div>
                  <div style={{ fontSize:11, color:t.textMuted, marginTop:2, fontStyle:"italic" }}>{lv.reason}</div>
                </div>
                <Badge label={lv.status} color={STATUS_COLOR(lv.status)} t={t}/>
                {lv.status==="Pending" && (
                  <div style={{ display:"flex", gap:7 }}>
                    <Btn v="success" t={t} size="sm" icon={<Check size={12}/>} onClick={()=>respond(lv.id,"Approved")}>Approve</Btn>
                    <Btn v="danger"  t={t} size="sm" icon={<X size={12}/>}     onClick={()=>respond(lv.id,"Rejected")}>Reject</Btn>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Apply for Leave" t={t} w={440}>
        <Field label="Team Member *" t={t}><Sel value={form.uId} onChange={e=>setForm(p=>({...p,uId:e.target.value}))} t={t}><option value="">Select</option>{data.users.filter(u=>u.role!=="Admin").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</Sel></Field>
        <Field label="Leave Type" t={t}><Sel value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} t={t}>{["Casual","Sick","Earned"].map(l=><option key={l}>{l}</option>)}</Sel></Field>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="From *" t={t}><Inp type="date" value={form.from} onChange={e=>setForm(p=>({...p,from:e.target.value}))} t={t}/></Field>
          <Field label="To *"   t={t}><Inp type="date" value={form.to}   onChange={e=>setForm(p=>({...p,to:e.target.value}))} t={t}/></Field>
        </div>
        {form.from&&form.to&&<div style={{ fontSize:12, color:t.lime, fontWeight:600, marginBottom:10, marginTop:-6 }}>{days(form.from,form.to)} day(s) selected</div>}
        <Field label="Reason" t={t}><Inp value={form.reason} onChange={e=>setForm(p=>({...p,reason:e.target.value}))} placeholder="Brief reason" t={t}/></Field>
        <div style={{ padding:"10px 12px", background:t.limeBg, borderRadius:10, marginBottom:14, fontSize:12, color:t.limeDeep }}>
          <Zap size={12} style={{ marginRight:6 }}/> HoD will be notified instantly in-app and via email
        </div>
        <div style={{ display:"flex", gap:9, justifyContent:"flex-end" }}>
          <Btn v="secondary" t={t} onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={submit} icon={<Send size={13}/>}>Submit Application</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────
function Departments({ t, data, setData, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", managerId:"", hodId:"", color:t.lime });
  const uName = id => data.users.find(u=>u.id===id)?.name||"—";
  const uAv   = id => data.users.find(u=>u.id===id)?.av||"??";

  const add = () => {
    if (!form.name||!form.hodId) { toast("Name and HoD required","error"); return; }
    setData(d=>({...d, departments:[...d.departments,{...form,id:"d"+Date.now()}]}));
    setShowAdd(false); setForm({name:"",managerId:"",hodId:"",color:t.lime});
    toast("Department created");
  };

  return (
    <div>
      <SHead t={t} title="Departments" sub="Company structure — departments, managers, and team hierarchies"
        action={<Btn v="lime" t={t} onClick={()=>setShowAdd(true)} icon={<Plus size={14}/>}>New Department</Btn>}/>

      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {data.departments.map((dept,i) => {
          const members = data.users.filter(u=>u.dept===dept.id);
          const hod  = data.users.find(u=>u.id===dept.hodId);
          const mgr  = data.users.find(u=>u.id===dept.managerId);
          const tasksDept = data.tasks.filter(tk=>members.some(m=>m.id===tk.aId));
          const done = tasksDept.filter(tk=>tk.status==="Completed").length;
          return (
            <Card t={t} key={dept.id} style={{ animation:`fadeUp .38s ${i*55}ms both`, borderLeft:`4px solid ${dept.color}` }}>
              {/* Header */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${t.border}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:dept.color+"22", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Building2 size={20} color={dept.color}/>
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:18, color:t.text }}>{dept.name}</div>
                    <div style={{ fontSize:12, color:t.textMuted, marginTop:2 }}>{members.length} members · {tasksDept.length} tasks · {done} completed</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  {[["Tasks",tasksDept.length,"text"],["Done",done,"lime"],["Active",tasksDept.filter(tk=>tk.status==="In Progress").length,"blue"]].map(([l,v,c])=>(
                    <div key={l} style={{ textAlign:"center", padding:"8px 16px", background:t.surfaceAlt, borderRadius:10 }}>
                      <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:22, color:t[c] }}>{v}</div>
                      <div style={{ fontSize:9, textTransform:"uppercase", color:t.textMuted, fontWeight:600 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hierarchy */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
                {/* Manager */}
                <div>
                  <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:t.textMuted, marginBottom:8, display:"flex", alignItems:"center", gap:5 }}>
                    <Shield size={10}/> Company Manager
                  </div>
                  {mgr ? (
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:t.surfaceAlt, borderRadius:10 }}>
                      <Av init={mgr.av} size={32} t={t}/>
                      <div><div style={{ fontSize:13, fontWeight:600, color:t.text }}>{mgr.name}</div><div style={{ fontSize:10, color:t.textMuted }}>{mgr.role}</div></div>
                    </div>
                  ) : <div style={{ fontSize:12, color:t.textMuted }}>Not assigned</div>}
                </div>
                {/* HoD */}
                <div>
                  <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:t.textMuted, marginBottom:8, display:"flex", alignItems:"center", gap:5 }}>
                    <Crown size={10}/> Head of Department
                  </div>
                  {hod ? (
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:dept.color+"15", borderRadius:10, border:`1.5px solid ${dept.color}40` }}>
                      <Av init={hod.av} size={32} t={t}/>
                      <div><div style={{ fontSize:13, fontWeight:600, color:t.text }}>{hod.name}</div><div style={{ fontSize:10, color:t.textMuted }}>{hod.role}</div></div>
                    </div>
                  ) : <div style={{ fontSize:12, color:t.textMuted }}>Not assigned</div>}
                </div>
                {/* Members */}
                <div>
                  <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:t.textMuted, marginBottom:8, display:"flex", alignItems:"center", gap:5 }}>
                    <Users size={10}/> Team Members
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                    {members.filter(m=>m.id!==dept.hodId).map(m=>(
                      <div key={m.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px", background:t.surfaceAlt, borderRadius:8 }}>
                        <Av init={m.av} size={24} t={t} online={m.active}/>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12, fontWeight:600, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.name}</div>
                          <div style={{ fontSize:10, color:t.textMuted }}>{m.role}</div>
                        </div>
                      </div>
                    ))}
                    {members.filter(m=>m.id!==dept.hodId).length===0 && <div style={{ fontSize:12, color:t.textMuted }}>No members yet</div>}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="New Department" t={t} w={480}>
        <Field label="Department Name *" t={t}><Inp value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Motion Design" t={t}/></Field>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="Company Manager" t={t}><Sel value={form.managerId} onChange={e=>setForm(p=>({...p,managerId:e.target.value}))} t={t}><option value="">Select</option>{data.users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</Sel></Field>
          <Field label="Head of Department *" t={t}><Sel value={form.hodId} onChange={e=>setForm(p=>({...p,hodId:e.target.value}))} t={t}><option value="">Select HoD</option>{data.users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</Sel></Field>
        </div>
        <Field label="Accent Color" t={t}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <input type="color" value={form.color} onChange={e=>setForm(p=>({...p,color:e.target.value}))} style={{ width:40, height:36, border:"none", borderRadius:8, cursor:"pointer", background:"none" }}/>
            <span style={{ fontSize:12, color:t.textMuted }}>{form.color}</span>
          </div>
        </Field>
        <div style={{ display:"flex", gap:9, justifyContent:"flex-end", marginTop:8 }}>
          <Btn v="secondary" t={t} onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={add} icon={<Plus size={13}/>}>Create Department</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── TEAM ─────────────────────────────────────────────────────────────────────
function Team({ t, data, setData, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", role:"", dept:"", av:"" });

  const deptName = id => data.departments.find(d=>d.id===id)?.name||"—";
  const add = () => {
    if (!form.name||!form.email||!form.dept) { toast("Fill required fields","error"); return; }
    const initials = form.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
    const newUser = { ...form, id:"u"+Date.now(), av:form.av||initials, active:true };
    setData(d=>({...d, users:[...d.users,newUser]}));
    setShowAdd(false); setForm({name:"",email:"",role:"",dept:"",av:""});
    toast(`${form.name} added to team`);
  };

  return (
    <div>
      <SHead t={t} title="Team" sub="All members, roles, and department assignments"
        action={<Btn v="lime" t={t} onClick={()=>setShowAdd(true)} icon={<Plus size={14}/>}>Add Member</Btn>}/>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {data.users.filter(u=>u.role!=="Admin").map((member,i) => {
          const tasks = data.tasks.filter(tk=>tk.aId===member.id);
          const dept = data.departments.find(d=>d.id===member.dept);
          return (
            <Card t={t} key={member.id} style={{ animation:`fadeUp .36s ${i*50}ms both` }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <Av init={member.av} size={46} t={t} online={member.active}/>
                  <div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:16, color:t.text }}>{member.name}</div>
                    <div style={{ fontSize:12, color:t.textMuted, marginTop:2, display:"flex", alignItems:"center", gap:8 }}>
                      <span>{member.role}</span>
                      {dept && <><span>·</span><span style={{ color:dept.color, fontWeight:600 }}>{dept.name}</span></>}
                      <span>·</span><span style={{ display:"flex", alignItems:"center", gap:4 }}><Mail size={10}/>{member.email}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  {[["Tasks",tasks.length,"text"],["Done",tasks.filter(tk=>tk.status==="Completed").length,"lime"],["Delayed",tasks.filter(tk=>tk.status==="Delayed").length,"red"]].map(([l,v,c])=>(
                    <div key={l} style={{ textAlign:"center", padding:"8px 14px", background:t.surfaceAlt, borderRadius:10 }}>
                      <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:20, color:t[c] }}>{v}</div>
                      <div style={{ fontSize:9, textTransform:"uppercase", color:t.textMuted, fontWeight:600 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              {tasks.length>0 && (
                <div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:6 }}>
                  {tasks.map((task,j)=>(
                    <div key={task.id} className="row-hover" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", background:t.surfaceAlt, borderRadius:9 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        {task.status==="In Progress" && task.startedAt && <LiveTimer startedAt={task.startedAt} t={t} active={true}/>}
                        <span style={{ fontSize:12, fontWeight:600, color:t.text }}>{task.title}</span>
                      </div>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span style={{ fontSize:11, color:isOverdue(task.due)&&task.status!=="Completed"?t.red:t.textMuted }}>Due {fd(task.due)}</span>
                        <Badge label={task.status} color={STATUS_COLOR(task.status)} t={t} small/>
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
        <Field label="Work Email *" t={t}><Inp type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="ananya@profitpenny.in" t={t}/></Field>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="Role / Designation *" t={t}><Inp value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} placeholder="e.g. Senior Designer" t={t}/></Field>
          <Field label="Department *" t={t}><Sel value={form.dept} onChange={e=>setForm(p=>({...p,dept:e.target.value}))} t={t}><option value="">Select dept.</option>{data.departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</Sel></Field>
        </div>
        <div style={{ display:"flex", gap:9, justifyContent:"flex-end", marginTop:8 }}>
          <Btn v="secondary" t={t} onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={add} icon={<UserPlus size={13}/>}>Add Member</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
function Notifications({ t, data, setData }) {
  const markRead = id => setData(d=>({...d, notifications:d.notifications.map(n=>n.id===id?{...n,read:true}:n)}));
  const markAll  = ()  => setData(d=>({...d, notifications:d.notifications.map(n=>({...n,read:true}))}));
  const uName = id => data.users.find(u=>u.id===id)?.name||"System";
  const typeIcon = type => ({
    leave_request: <Umbrella size={15}/>, deadline_missed: <AlertTriangle size={15}/>,
    ext_request: <AlarmClock size={15}/>, leave_approved: <CheckCircle2 size={15}/>,
    leave_rejected: <XCircle size={15}/>, ext_approved: <CheckCircle2 size={15}/>,
  })[type] || <Bell size={15}/>;
  const typeColor = type => ({
    leave_request:"amber", deadline_missed:"red", ext_request:"purple",
    leave_approved:"green", leave_rejected:"red", ext_approved:"lime"
  })[type]||"muted";

  const sorted = [...data.notifications].sort((a,b)=>new Date(b.at)-new Date(a.at));
  const unread = sorted.filter(n=>!n.read).length;

  return (
    <div>
      <SHead t={t} title="Notifications"
        sub={`${unread} unread · All approval events and system alerts`}
        action={unread>0 ? <Btn v="secondary" t={t} size="sm" onClick={markAll}>Mark all read</Btn> : null}/>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {sorted.map((n,i)=>(
          <div key={n.id} className="row-hover" onClick={()=>markRead(n.id)}
            style={{ display:"flex", gap:14, alignItems:"flex-start",
              padding:"14px 16px", background:n.read?t.surface:t.limeBg,
              border:`1px solid ${n.read?t.border:t.lime+"40"}`,
              borderRadius:12, cursor:"pointer",
              animation:`fadeUp .3s ${i*30}ms both`,
              position:"relative", overflow:"hidden",
            }}>
            {!n.read && <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:t.lime, borderRadius:"12px 0 0 12px" }}/>}
            <div style={{ width:36, height:36, borderRadius:10, background:t[typeColor(n.type)+"Bg"]||t.surfaceAlt,
              color:t[typeColor(n.type)]||t.textMuted, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {typeIcon(n.type)}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ fontSize:13, fontWeight:700, color:t.text }}>{n.title}</div>
                <div style={{ fontSize:11, color:t.textMuted, flexShrink:0, marginLeft:12 }}>
                  {new Date(n.at).toLocaleDateString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}
                </div>
              </div>
              <div style={{ fontSize:12, color:t.textMid, marginTop:3 }}>{n.body}</div>
              <div style={{ fontSize:11, color:t.textMuted, marginTop:4 }}>From: {uName(n.from)}</div>
            </div>
            {!n.read && <div style={{ position:"absolute", right:16, top:16, width:8, height:8, borderRadius:"50%", background:t.lime }}>
              <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:t.lime, animation:"ping 1.5s ease-out infinite" }}/>
            </div>}
          </div>
        ))}
        {sorted.length===0 && <Card t={t}><p style={{ color:t.textMuted, textAlign:"center", padding:"20px 0", fontSize:14 }}>No notifications yet.</p></Card>}
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({ t, data, setData, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ uId:"", startDate:"" });

  const uName = id => data.users.find(u=>u.id===id)?.name||"—";
  const create = () => {
    if (!form.uId) { toast("Select a team member","error"); return; }
    if (data.onboarding.find(ob=>ob.uId===form.uId)) { toast("Onboarding already exists for this member","error"); return; }
    setData(d=>({...d, onboarding:[...d.onboarding,{
      id:"ob"+Date.now(), uId:form.uId, startDate:form.startDate,
      completedAt:null, steps:DEFAULT_OB_STEPS.map(s=>({...s,done:false}))
    }]}));
    setShowAdd(false); setForm({uId:"",startDate:""});
    toast(`Onboarding started for ${uName(form.uId)}`);
  };

  const toggle = (obId, stepId) => {
    setData(d=>({...d, onboarding:d.onboarding.map(ob=>{
      if (ob.id!==obId) return ob;
      const steps = ob.steps.map(s=>s.id===stepId?{...s,done:!s.done}:s);
      return {...ob, steps, completedAt:steps.every(s=>s.done)?new Date().toISOString().split("T")[0]:null};
    })}));
  };

  return (
    <div>
      <SHead t={t} title="Onboarding" sub="New hire setup progress — step by step"
        action={<Btn v="lime" t={t} onClick={()=>setShowAdd(true)} icon={<Plus size={14}/>}>New Onboarding</Btn>}/>
      {data.onboarding.length===0
        ? <Card t={t}><p style={{ color:t.textMuted, textAlign:"center", padding:"24px 0", fontSize:14 }}>No active onboardings. Add a new hire to begin.</p></Card>
        : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:16 }}>
            {data.onboarding.map((ob,oi) => {
              const done=ob.steps.filter(s=>s.done).length, total=ob.steps.length;
              const pct=Math.round((done/total)*100);
              const u=data.users.find(u=>u.id===ob.uId);
              return (
                <Card t={t} key={ob.id} style={{ animation:`fadeUp .38s ${oi*60}ms both` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Av init={u?.av||"?"} size={38} t={t}/>
                      <div>
                        <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, color:t.text }}>{uName(ob.uId)}</div>
                        {ob.startDate && <div style={{ fontSize:11, color:t.textMuted, marginTop:2 }}>Started {fdt(ob.startDate)}</div>}
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:28,
                        color:pct===100?t.lime:t.text, lineHeight:1 }}>{pct}%</div>
                      <div style={{ fontSize:9, color:t.textMuted, textTransform:"uppercase", fontWeight:600 }}>{done}/{total}</div>
                    </div>
                  </div>
                  <ProgressBar value={done} max={total} color={pct===100?"lime":"blue"} t={t} delay={oi*55}/>
                  {ob.completedAt && (
                    <div style={{ marginTop:10, padding:"6px 12px", background:t.limeBg, color:t.limeDeep,
                      borderRadius:8, fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                      <CheckCircle2 size={13}/> Completed {fdt(ob.completedAt)}
                    </div>
                  )}
                  <div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:5 }}>
                    {ob.steps.map((step,si)=>(
                      <button key={step.id} onClick={()=>toggle(ob.id,step.id)} className="btn-press"
                        style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
                          background:step.done?t.limeBg:t.surfaceAlt,
                          border:`1px solid ${step.done?t.lime+"50":t.border}`,
                          borderRadius:8, cursor:"pointer", textAlign:"left",
                          transition:"all .18s ease" }}>
                        <div style={{ width:18, height:18, borderRadius:5, flexShrink:0,
                          background:step.done?t.lime:"transparent",
                          border:`2px solid ${step.done?t.lime:t.borderMid}`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          transition:"all .18s ease" }}>
                          {step.done && <Check size={10} color="#0A0A0A" strokeWidth={3}/>}
                        </div>
                        <span style={{ fontSize:12, color:step.done?t.limeDeep:t.textMid,
                          fontWeight:step.done?600:400, textDecoration:step.done?"line-through":"none",
                          transition:"all .18s" }}>{step.label}</span>
                      </button>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>}

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Start Onboarding" t={t} w={420}>
        <Field label="New Hire *" t={t}><Sel value={form.uId} onChange={e=>setForm(p=>({...p,uId:e.target.value}))} t={t}><option value="">Select team member</option>{data.users.filter(u=>u.role!=="Admin").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</Sel></Field>
        <Field label="Start Date" t={t}><Inp type="date" value={form.startDate} onChange={e=>setForm(p=>({...p,startDate:e.target.value}))} t={t}/></Field>
        <div style={{ padding:"10px 12px", background:t.surfaceAlt, borderRadius:10, marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:600, color:t.textMuted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>10 standard steps included</div>
          {DEFAULT_OB_STEPS.slice(0,3).map(s=><div key={s.id} style={{ fontSize:12, color:t.textMid, padding:"2px 0" }}>· {s.label}</div>)}
          <div style={{ fontSize:12, color:t.textMuted, marginTop:4 }}>…and {DEFAULT_OB_STEPS.length-3} more</div>
        </div>
        <div style={{ display:"flex", gap:9, justifyContent:"flex-end" }}>
          <Btn v="secondary" t={t} onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn v="lime" t={t} onClick={create} icon={<UserCheck size={13}/>}>Start</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
const NAV = [
  { id:"dashboard",    label:"Dashboard",    Icon:LayoutDashboard },
  { id:"projects",     label:"Projects",     Icon:FolderKanban    },
  { id:"timelogs",     label:"Time Logs",    Icon:Clock3          },
  { id:"efficiency",   label:"Efficiency",   Icon:TrendingUp      },
  { id:"clients",      label:"Clients",      Icon:Briefcase       },
  { id:"meetings",     label:"Meetings",     Icon:CalendarDays    },
  { id:"leaves",       label:"Leaves",       Icon:Umbrella        },
  { id:"departments",  label:"Departments",  Icon:Building2       },
  { id:"team",         label:"Team",         Icon:Users2          },
  { id:"onboarding",   label:"Onboarding",   Icon:UserCheck       },
  { id:"notifications",label:"Notifications",Icon:Bell            },
];

export default function App() {
  const [dark, setDark]   = useState(false);
  const [nav, setNav]     = useState("dashboard");
  const [side, setSide]   = useState(true);
  const [data, setData]   = useState(MOCK);
  const [toasts, toast]   = useToast();
  const [pageKey, setPageKey] = useState(0);
  const t = dark ? D.dark : D.light;

  const go = id => { if (id===nav) return; setNav(id); setPageKey(p=>p+1); };

  const unread    = data.notifications.filter(n=>!n.read).length;
  const pendLeave = data.leaves.filter(l=>l.status==="Pending").length;
  const pendExt   = data.tasks.filter(tk=>tk.extRequest?.status==="Pending").length;
  const hasAlert  = n => n==="leaves" && pendLeave>0 || n==="notifications" && unread>0;

  const pages = {
    dashboard:    <Dashboard    t={t} data={data}/>,
    projects:     <Projects     t={t} data={data} setData={setData} toast={toast}/>,
    timelogs:     <TimeLogs     t={t} data={data} setData={setData} toast={toast}/>,
    efficiency:   <Efficiency   t={t} data={data}/>,
    clients:      <Clients      t={t} data={data} setData={setData} toast={toast}/>,
    meetings:     <Meetings     t={t} data={data} setData={setData} toast={toast}/>,
    leaves:       <Leaves       t={t} data={data} setData={setData} toast={toast}/>,
    departments:  <Departments  t={t} data={data} setData={setData} toast={toast}/>,
    team:         <Team         t={t} data={data} setData={setData} toast={toast}/>,
    onboarding:   <Onboarding  t={t} data={data} setData={setData} toast={toast}/>,
    notifications:<Notifications t={t} data={data} setData={setData}/>,
  };

  return (
    <>
      <style>{GLOBAL_CSS}{`::-webkit-scrollbar-thumb{background:${t.scrollThumb};}`}</style>
      <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:t.bg }}>

        {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
        <aside style={{
          width: side ? 228 : 64, flexShrink:0,
          background: t.sidebar,
          display:"flex", flexDirection:"column",
          transition:"width .3s cubic-bezier(.22,1,.36,1)",
          overflow:"hidden",
          boxShadow:`4px 0 24px rgba(0,0,0,0.15)`,
        }}>

          {/* Logo */}
          <div style={{
            padding: side ? "18px 16px 16px" : "18px 0 16px",
            display:"flex", alignItems:"center", justifyContent:side?"space-between":"center",
            borderBottom:`1px solid ${t.sideHover}`, minHeight:66,
          }}>
            <div style={{ overflow:"hidden", opacity:1, transition:"all .25s" }}>
              <PPLogo collapsed={!side} dark={dark}/>
            </div>
            <button onClick={()=>setSide(p=>!p)} style={{
              background:"none", border:"none", cursor:"pointer", padding:4, borderRadius:6,
              color:t.sideText, display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0, transition:"color .14s, background .14s",
            }} onMouseEnter={e=>{e.currentTarget.style.background=t.sideHover;e.currentTarget.style.color="#fff"}}
               onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=t.sideText}}>
              {side ? <ChevronLeft size={16}/> : <ChevronRight size={16}/>}
            </button>
          </div>

          {/* Nav items */}
          <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto", overflowX:"hidden" }}>
            {NAV.map(({ id, label, Icon }, i) => {
              const active = nav === id;
              const badge  = hasAlert(id) ? (id==="notifications"?unread:pendLeave+pendExt) : 0;
              return (
                <button key={id} onClick={()=>go(id)} title={!side?label:""} style={{
                  width:"100%", display:"flex", alignItems:"center",
                  gap:side?12:0, justifyContent:side?"flex-start":"center",
                  padding: side ? "9px 12px" : "11px 0",
                  borderRadius:10, border:"none",
                  background: active ? t.sideActive + "1A" : "transparent",
                  color: active ? t.sideActive : t.sideText,
                  fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:active?600:400,
                  cursor:"pointer", marginBottom:2, position:"relative",
                  transition:"all .15s ease",
                  animation:`slideLeft .28s ${i*22}ms both`,
                  whiteSpace:"nowrap", overflow:"hidden",
                }}
                onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background=t.sideHover; e.currentTarget.style.color="#FAFAFA"; }}}
                onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=t.sideText; }}}>
                  {active && <div style={{ position:"absolute", left:0, top:"20%", bottom:"20%", width:3, borderRadius:"0 3px 3px 0", background:t.sideActive }}/>}
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <Icon size={18} strokeWidth={active?2.2:1.7}/>
                    {badge>0 && (
                      <span style={{ position:"absolute", top:-6, right:-6, minWidth:16, height:16,
                        borderRadius:99, background:t.sideActive, color:"#0A0A0A",
                        fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center",
                        padding:"0 3px", animation:"notifPop .5s cubic-bezier(.22,1,.36,1)" }}>
                        {badge}
                      </span>
                    )}
                  </div>
                  {side && <span style={{ flex:1, textAlign:"left" }}>{label}</span>}
                </button>
              );
            })}
          </nav>

          {/* User */}
          <div style={{ padding:side?"12px 10px":"12px 0", borderTop:`1px solid ${t.sideHover}`,
            display:"flex", alignItems:"center", gap:10, justifyContent:side?"flex-start":"center" }}>
            <Av init="RS" size={32} t={t}/>
            {side && <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"#FAFAFA", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Rahul Sharma</div>
              <div style={{ fontSize:10, color:t.sideText }}>Admin</div>
            </div>}
          </div>
        </aside>

        {/* ── MAIN ──────────────────────────────────────────────────── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

          {/* Topbar */}
          <header style={{
            height:58, background:t.topbar, borderBottom:`1px solid ${t.border}`,
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"0 24px", flexShrink:0, boxShadow:`0 1px 0 ${t.border}`,
          }}>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13,
              color:t.textMuted, letterSpacing:"0.08em", textTransform:"uppercase" }}>
              {NAV.find(n=>n.id===nav)?.label}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              {/* Notification bell */}
              <button onClick={()=>go("notifications")} style={{
                position:"relative", background:t.surfaceAlt, border:`1px solid ${t.border}`,
                borderRadius:10, width:38, height:38, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", color:t.textMuted,
                transition:"all .15s",
              }} onMouseEnter={e=>{e.currentTarget.style.background=t.hover;e.currentTarget.style.color=t.text}}
                 onMouseLeave={e=>{e.currentTarget.style.background=t.surfaceAlt;e.currentTarget.style.color=t.textMuted}}>
                <Bell size={16}/>
                {unread>0 && (
                  <span style={{ position:"absolute", top:-4, right:-4, minWidth:18, height:18,
                    borderRadius:99, background:t.lime, color:"#0A0A0A",
                    fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center",
                    padding:"0 4px", animation:"notifPop .5s cubic-bezier(.22,1,.36,1)" }}>
                    {unread}
                  </span>
                )}
              </button>
              <DarkToggle dark={dark} onToggle={()=>setDark(p=>!p)} t={t}/>
            </div>
          </header>

          {/* Page content */}
          <main key={pageKey} style={{ flex:1, overflow:"auto", padding:"26px 28px",
            animation:"fadeUp .32s cubic-bezier(.22,1,.36,1) both" }}>
            {pages[nav]}
          </main>
        </div>
      </div>
      <Toasts list={toasts}/>
    </>
  );
}
