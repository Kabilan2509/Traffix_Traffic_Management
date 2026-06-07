"use client";
import { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from "recharts";
import DarkModeToggle from "@/components/DarkModeToggle";

/* ══════════════════════════════════════════════════════════════
   GLOBAL STYLES — Traffix Portal v4.0 Government Command Platform
══════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

/* ════ LIGHT MODE ════ */
:root {
  --bg0:#F8FAFC; --bg1:#FFFFFF; --bg2:#F1F5F9; --bg3:#E8EEF6; --bg4:#DDE6F0;
  --primary:#0F4C75; --primary2:#1B6CA8; --accent:#3282B8; --accent2:#6BB6FF;
  --amber:#C97D10; --amber2:#E5A525; --amberBg:rgba(201,125,16,0.08);
  --cyan:#0077CC; --cyan2:#0099EE;
  --green:#1A7F4B; --green2:#22A060; --greenBg:rgba(26,127,75,0.08);
  --red:#B03030; --red2:#D44040; --redBg:rgba(176,48,48,0.08);
  --purple:#6B35B8; --purpleBg:rgba(107,53,184,0.08);
  --blue:#1A56A8; --blueBg:rgba(26,86,168,0.08);
  --border:#D8E2EE; --border2:#C8D8EA; --borderFaint:#EBF0F7;
  --text0:#0F172A; --text1:#1E293B; --text2:#475569; --text3:#94A3B8;
  --shadow:0 2px 8px rgba(15,23,42,0.08); --shadowMd:0 4px 20px rgba(15,23,42,0.12); --shadowLg:0 8px 40px rgba(15,23,42,0.15);
  --mono:'JetBrains Mono',monospace; --sans:'Inter',system-ui,sans-serif;
  --sidebar:228px; --topbar:52px; --radius:6px;
  --transition:all 0.2s cubic-bezier(0.4,0,0.2,1);
}

/* ════ DARK MODE ════ */
:root.dark-mode {
  --bg0:#060A10; --bg1:#0D1420; --bg2:#121B2B; --bg3:#192438; --bg4:#1E2D44;
  --primary:#5BAEE8; --primary2:#7AC4FF; --accent:#3E9ADB; --accent2:#87CEEB;
  --amber:#FFB830; --amber2:#FFCF60; --amberBg:rgba(255,184,48,0.1);
  --cyan:#00CFFF; --cyan2:#7DE8FF;
  --green:#00E87A; --green2:#30FF9A; --greenBg:rgba(0,232,122,0.1);
  --red:#FF4D4D; --red2:#FF7070; --redBg:rgba(255,77,77,0.1);
  --purple:#BB86FC; --purpleBg:rgba(187,134,252,0.1);
  --blue:#4D9FFF; --blueBg:rgba(77,159,255,0.1);
  --border:#1E3050; --border2:#2A4068; --borderFaint:#101820;
  --text0:#EEF2FA; --text1:#CDD8EE; --text2:#8099BA; --text3:#445870;
  --shadow:0 2px 8px rgba(0,0,0,0.4); --shadowMd:0 4px 20px rgba(0,0,0,0.6); --shadowLg:0 8px 40px rgba(0,0,0,0.7);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{
  font-family:var(--sans);font-size:14px;line-height:1.65;
  color:var(--text1);background:var(--bg0);overflow-x:hidden;min-height:100vh;
  transition:background-color 0.3s,color 0.3s;letter-spacing:0.2px;
}
button,input,select,textarea{font-family:inherit;}
a{color:var(--cyan);text-decoration:none;}
::-webkit-scrollbar{width:6px;height:6px;}
::-webkit-scrollbar-track{background:var(--bg2);}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:999px;}
::-webkit-scrollbar-thumb:hover{background:var(--accent);}

/* ════ LAYOUT ════ */
.app-shell{display:flex;min-height:100vh;}
.sidebar{
  width:var(--sidebar);flex-shrink:0;
  background:var(--bg1);border-right:1px solid var(--border);
  display:flex;flex-direction:column;
  position:fixed;top:0;left:0;bottom:0;z-index:200;
  transition:transform .25s ease;
}
.sidebar-header{
  padding:0 16px;height:var(--topbar);display:flex;align-items:center;gap:10px;
  border-bottom:1px solid var(--border);flex-shrink:0;
  background:linear-gradient(135deg,var(--primary),var(--primary2));
}
.logo-emblem{
  width:32px;height:32px;background:rgba(255,255,255,0.2);border-radius:6px;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--mono);font-size:13px;font-weight:700;color:#fff;
  border:1px solid rgba(255,255,255,0.3);flex-shrink:0;letter-spacing:-.5px;
}
.logo-text-wrap .logo-text{font-size:15px;font-weight:700;color:#fff;letter-spacing:-.01em;}
.logo-text-wrap .logo-sub{font-family:var(--mono);font-size:8px;color:rgba(255,255,255,0.65);letter-spacing:.15em;text-transform:uppercase;margin-top:1px;}
.sidebar-body{flex:1;overflow-y:auto;padding:10px 0;}
.sidebar-section{padding:0 10px;margin-bottom:4px;}
.sidebar-label{font-family:var(--mono);font-size:8px;font-weight:700;color:var(--text3);letter-spacing:.18em;text-transform:uppercase;padding:8px 8px 5px;}
.nav-btn{
  display:flex;align-items:center;gap:8px;width:100%;padding:8px 10px;border:none;
  background:none;font-size:12.5px;font-weight:500;color:var(--text2);cursor:pointer;
  text-align:left;transition:var(--transition);border-radius:5px;margin-bottom:1px;
  border-left:2px solid transparent;
}
.nav-btn:hover{color:var(--text0);background:var(--bg2);}
.nav-btn.active{color:var(--primary2);background:var(--amberBg);border-left-color:var(--amber);font-weight:600;}
:root.dark-mode .nav-btn.active{color:var(--amber2);background:var(--amberBg);}
.nav-btn.active .nav-ico{color:var(--amber);}
.nav-ico{font-size:14px;width:18px;text-align:center;flex-shrink:0;}
.nav-badge{
  margin-left:auto;background:var(--red);color:#fff;
  font-family:var(--mono);font-size:7.5px;font-weight:700;
  padding:1px 5px;border-radius:2px;animation:blink 1.8s infinite;
}
.sidebar-bottom{padding:12px;border-top:1px solid var(--border);flex-shrink:0;}
.user-card{display:flex;align-items:center;gap:9px;}
.user-ava{
  width:30px;height:30px;border-radius:6px;flex-shrink:0;
  background:linear-gradient(135deg,var(--cyan),var(--purple));
  display:flex;align-items:center;justify-content:center;
  font-family:var(--mono);font-size:10px;font-weight:700;color:#fff;
}
.user-name{font-size:12px;font-weight:600;color:var(--text0);line-height:1.2;}
.user-role{font-family:var(--mono);font-size:8px;color:var(--text3);text-transform:uppercase;letter-spacing:.1em;margin-top:1px;}
.sys-stat{display:flex;justify-content:space-between;align-items:center;padding:4px 8px;}
.sys-stat-key{font-family:var(--mono);font-size:8px;color:var(--text3);text-transform:uppercase;letter-spacing:.1em;}
.sys-stat-val{font-family:var(--mono);font-size:8.5px;font-weight:700;}

/* ════ MAIN AREA ════ */
.main-area{margin-left:var(--sidebar);flex:1;display:flex;flex-direction:column;min-height:100vh;}
.topbar{
  height:var(--topbar);background:var(--bg1);border-bottom:1px solid var(--border);
  display:flex;align-items:center;padding:0 20px;gap:12px;
  position:sticky;top:0;z-index:100;flex-shrink:0;
}
.topbar-breadcrumb{font-family:var(--mono);font-size:10px;color:var(--text3);display:flex;align-items:center;gap:4px;flex:1;}
.topbar-breadcrumb b{color:var(--amber);font-weight:700;}
.live-pill{
  display:flex;align-items:center;gap:5px;font-family:var(--mono);font-size:9px;font-weight:700;
  color:var(--green);background:var(--greenBg);padding:3px 10px;border-radius:3px;
  border:1px solid rgba(26,127,75,0.25);white-space:nowrap;
}
:root.dark-mode .live-pill{border-color:rgba(0,232,122,0.25);}
.live-dot{width:5px;height:5px;border-radius:50%;background:var(--green);animation:blink 1.4s infinite;}
.clock-box{font-family:var(--mono);font-size:10px;color:var(--text1);background:var(--bg2);padding:4px 10px;border-radius:3px;border:1px solid var(--border);white-space:nowrap;}
.mob-menu{display:none;width:34px;height:34px;border:1px solid var(--border);background:var(--bg2);border-radius:4px;cursor:pointer;align-items:center;justify-content:center;color:var(--text1);font-size:16px;}
.notif-btn{
  position:relative;width:34px;height:34px;border:1px solid var(--border);
  background:var(--bg2);border-radius:4px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;color:var(--text2);
  transition:var(--transition);
}
.notif-btn:hover{color:var(--primary);border-color:var(--accent);}
.notif-dot{position:absolute;top:6px;right:6px;width:7px;height:7px;background:var(--red);border-radius:50%;border:2px solid var(--bg1);animation:blink 2s infinite;}
.notif-panel{
  position:absolute;top:calc(var(--topbar) + 4px);right:8px;
  width:320px;background:var(--bg1);border:1px solid var(--border);
  border-radius:8px;box-shadow:var(--shadowLg);z-index:999;
  overflow:hidden;
}
.notif-head{padding:10px 14px;border-bottom:1px solid var(--border);background:var(--bg2);display:flex;justify-content:space-between;align-items:center;}
.notif-head h4{font-family:var(--mono);font-size:10px;font-weight:700;color:var(--text0);letter-spacing:.08em;text-transform:uppercase;}
.notif-item{padding:10px 14px;border-bottom:1px solid var(--borderFaint);cursor:pointer;transition:var(--transition);}
.notif-item:hover{background:var(--bg2);}
.notif-item:last-child{border-bottom:none;}
.notif-title{font-size:12px;font-weight:500;color:var(--text0);margin-bottom:2px;}
.notif-meta{font-family:var(--mono);font-size:9px;color:var(--text3);}

.content{padding:20px 24px;flex:1;}
.page-header{margin-bottom:18px;}
.page-header h1{
  font-size:22px;font-weight:700;color:var(--text0);
  letter-spacing:-.02em;display:flex;align-items:center;gap:10px;
}
.page-header p{font-size:11px;color:var(--text3);margin-top:3px;font-family:var(--mono);letter-spacing:.05em;}
.page-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.header-row{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:18px;}
.accent-rule{width:32px;height:2px;background:linear-gradient(90deg,var(--amber),transparent);border-radius:1px;margin:4px 0 8px;}

/* ════ KPI CARDS ════ */
.kpi-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;}
.kpi-card{
  background:var(--bg1);border:1px solid var(--border);border-radius:var(--radius);
  padding:14px 16px;position:relative;overflow:hidden;transition:border-color .2s,box-shadow .2s;cursor:default;
}
.kpi-card:hover{border-color:var(--border2);box-shadow:var(--shadow);}
.kpi-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--kpi-accent,var(--amber));}
.kpi-card::before{content:'';position:absolute;top:0;right:0;width:48px;height:48px;background:var(--kpi-accent,var(--amber));opacity:0.05;border-radius:0 0 0 48px;}
.kpi-label{font-family:var(--mono);font-size:8.5px;font-weight:700;color:var(--text3);letter-spacing:.14em;text-transform:uppercase;margin-bottom:8px;}
.kpi-value{font-family:var(--mono);font-size:26px;font-weight:700;color:var(--text0);line-height:1;margin-bottom:5px;}
.kpi-delta{font-size:10px;color:var(--text3);}
.kpi-delta.up{color:var(--green);}
.kpi-delta.dn{color:var(--red);}
.kpi-ico{position:absolute;top:12px;right:14px;font-size:18px;opacity:0.4;}

/* ════ PANELS ════ */
.panel{background:var(--bg1);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:border-color .2s;}
.panel:hover{border-color:var(--border2);}
.panel-head{
  display:flex;align-items:center;justify-content:space-between;gap:8px;
  padding:10px 14px;border-bottom:1px solid var(--border);background:var(--bg2);
}
.panel-title{
  font-family:var(--mono);font-size:10px;font-weight:700;color:var(--amber);
  letter-spacing:.1em;text-transform:uppercase;display:flex;align-items:center;gap:6px;
}
.panel-title::before{content:'';width:3px;height:3px;background:var(--amber);border-radius:50%;}
.panel-body{padding:14px;}

/* ════ GRID HELPERS ════ */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
.g13{display:grid;grid-template-columns:1fr 300px;gap:12px;}
.g31{display:grid;grid-template-columns:300px 1fr;gap:12px;}

/* ════ JUNCTION LIST ════ */
.jlist{display:flex;flex-direction:column;gap:2px;}
.jrow{
  display:flex;align-items:center;gap:8px;padding:7px 10px;
  border-radius:4px;cursor:pointer;border:1px solid transparent;transition:var(--transition);
}
.jrow:hover{background:var(--bg2);border-color:var(--border);}
.jrow.active-j{background:var(--amberBg);border-color:rgba(201,125,16,0.25);}
:root.dark-mode .jrow.active-j{background:rgba(255,184,48,0.08);border-color:rgba(255,184,48,0.2);}
.jrow-id{font-family:var(--mono);font-size:8.5px;color:var(--text3);width:46px;flex-shrink:0;}
.jrow-name{flex:1;font-size:12.5px;font-weight:500;color:var(--text0);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

/* ════ STATUS DOTS ════ */
.sdot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.sdot-g{background:var(--green);box-shadow:0 0 6px var(--green);}
.sdot-y{background:var(--amber);box-shadow:0 0 6px var(--amber);}
.sdot-r{background:var(--red);box-shadow:0 0 6px var(--red);}
.sdot-b{background:var(--blue);box-shadow:0 0 6px var(--blue);}

/* ════ BADGES ════ */
.badge{
  display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:3px;
  font-family:var(--mono);font-size:9px;font-weight:700;
  text-transform:uppercase;letter-spacing:.08em;border:1px solid;
  white-space:nowrap;
}
.badge-g{background:var(--greenBg);color:var(--green);border-color:rgba(26,127,75,0.25);}
:root.dark-mode .badge-g{border-color:rgba(0,232,122,0.25);}
.badge-y{background:var(--amberBg);color:var(--amber);border-color:rgba(201,125,16,0.3);}
:root.dark-mode .badge-y{border-color:rgba(255,184,48,0.3);}
.badge-r{background:var(--redBg);color:var(--red);border-color:rgba(176,48,48,0.25);}
:root.dark-mode .badge-r{border-color:rgba(255,77,77,0.25);}
.badge-b{background:var(--blueBg);color:var(--blue);border-color:rgba(26,86,168,0.25);}
:root.dark-mode .badge-b{color:var(--cyan);border-color:rgba(0,207,255,0.25);}
.badge-p{background:var(--purpleBg);color:var(--purple);border-color:rgba(107,53,184,0.25);}
:root.dark-mode .badge-p{border-color:rgba(187,134,252,0.25);}
.badge-k{background:var(--bg3);color:var(--text2);border-color:var(--border);}

/* ════ DENSITY BAR ════ */
.dbar{display:flex;align-items:center;gap:8px;}
.dbar-track{flex:1;background:var(--bg3);border-radius:2px;height:4px;overflow:hidden;}
.dbar-fill{height:100%;border-radius:2px;transition:width .4s ease;}
.dbar-pct{font-family:var(--mono);font-size:10px;font-weight:700;min-width:32px;text-align:right;}

/* ════ TRAFFIC LIGHT ════ */
.tlight{width:30px;height:75px;background:var(--bg0);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;padding:5px;border:1px solid var(--border2);}
.tb{width:15px;height:15px;border-radius:50%;transition:all .4s;}
.tb-r{background:rgba(176,48,48,0.15);}
.tb-r.on{background:var(--red);box-shadow:0 0 10px var(--red);}
.tb-y{background:rgba(201,125,16,0.15);}
.tb-y.on{background:var(--amber);box-shadow:0 0 10px var(--amber);}
.tb-g{background:rgba(26,127,75,0.15);}
.tb-g.on{background:var(--green);box-shadow:0 0 10px var(--green);}

/* ════ SIGNAL GRID ════ */
.signal-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;}
.sig-card{
  background:var(--bg1);border:1px solid var(--border);border-radius:var(--radius);
  padding:12px;text-align:center;cursor:pointer;border-top:2px solid;transition:all .2s;
}
.sig-card:hover{background:var(--bg2);transform:translateY(-1px);box-shadow:var(--shadow);}
.sig-card.sel{border-color:var(--amber)!important;background:var(--amberBg);}
.sig-label{font-size:11.5px;font-weight:500;color:var(--text0);margin-top:8px;}
.sig-id{font-family:var(--mono);font-size:8px;color:var(--text3);margin-bottom:6px;}

/* ════ BUTTONS ════ */
.btn{
  display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:4px;
  font-family:var(--mono);font-size:10px;font-weight:700;cursor:pointer;border:1px solid;
  transition:var(--transition);text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;
}
.btn-primary{background:var(--primary);color:#fff;border-color:var(--primary);}
.btn-primary:hover{background:var(--primary2);}
.btn-amber{background:var(--amberBg);color:var(--amber);border-color:rgba(201,125,16,0.4);}
:root.dark-mode .btn-amber{background:rgba(255,184,48,0.12);border-color:rgba(255,184,48,0.4);}
.btn-amber:hover{background:rgba(201,125,16,0.18);border-color:var(--amber);}
.btn-ghost{background:transparent;color:var(--text2);border-color:var(--border);}
.btn-ghost:hover{color:var(--text0);border-color:var(--border2);background:var(--bg3);}
.btn-red{background:var(--redBg);color:var(--red);border-color:rgba(176,48,48,0.3);}
:root.dark-mode .btn-red{background:rgba(255,77,77,0.1);border-color:rgba(255,77,77,0.3);}
.btn-red:hover{background:rgba(176,48,48,0.16);border-color:var(--red);}
.btn-green{background:var(--greenBg);color:var(--green);border-color:rgba(26,127,75,0.3);}
.btn-green:hover{background:rgba(26,127,75,0.16);}
.btn-cyan{background:var(--blueBg);color:var(--cyan);border-color:rgba(0,119,204,0.3);}
:root.dark-mode .btn-cyan{border-color:rgba(0,207,255,0.3);}
.btn-cyan:hover{background:rgba(0,119,204,0.12);}
.btn-sm{padding:4px 9px;font-size:9px;}
.btn:disabled{opacity:.35;cursor:not-allowed;}

/* ════ FORM ELEMENTS ════ */
.field{margin-bottom:13px;}
.field label{display:block;font-family:var(--mono);font-size:9px;font-weight:700;color:var(--text2);letter-spacing:.12em;text-transform:uppercase;margin-bottom:5px;}
.inp{width:100%;padding:8px 12px;background:var(--bg2);border:1px solid var(--border);border-radius:4px;font-family:var(--mono);font-size:12px;color:var(--text0);outline:none;transition:border-color .15s;}
.inp:focus{border-color:var(--amber);box-shadow:0 0 0 2px rgba(201,125,16,0.1);}
.inp::placeholder{color:var(--text3);}
.sel{width:100%;padding:7px 11px;background:var(--bg2);border:1px solid var(--border);border-radius:4px;font-family:var(--mono);font-size:11px;color:var(--text1);outline:none;cursor:pointer;}
.sel:focus{border-color:var(--amber);}

/* ════ TABLES ════ */
table{width:100%;border-collapse:collapse;font-size:12px;}
thead th{background:var(--bg2);padding:8px 12px;font-family:var(--mono);font-size:8.5px;font-weight:700;color:var(--text3);text-align:left;letter-spacing:.12em;text-transform:uppercase;border-bottom:1px solid var(--border);white-space:nowrap;}
tbody tr{border-bottom:1px solid var(--borderFaint);transition:background .12s;}
tbody tr:last-child{border-bottom:none;}
tbody tr:hover{background:var(--bg2);}
tbody td{padding:8px 12px;vertical-align:middle;color:var(--text1);}
.mono-cell{font-family:var(--mono);font-size:10px;color:var(--text3);}

/* ════ ALERTS ════ */
.alert{padding:9px 13px;border-radius:4px;border-left:3px solid;font-family:var(--mono);font-size:10px;margin-bottom:10px;display:flex;align-items:flex-start;gap:8px;line-height:1.5;}
.alert-w{background:var(--amberBg);border-color:var(--amber);color:var(--amber);}
.alert-e{background:var(--redBg);border-color:var(--red);color:var(--red);}
.alert-i{background:var(--blueBg);border-color:var(--cyan);color:var(--cyan);}
.alert-ok{background:var(--greenBg);border-color:var(--green);color:var(--green);}

/* ════ TOGGLES ════ */
.tog{width:36px;height:20px;background:var(--bg3);border-radius:10px;position:relative;cursor:pointer;transition:background .2s;border:1px solid var(--border);}
.tog.on{background:var(--amberBg);border-color:rgba(201,125,16,0.4);}
.tog::after{content:'';position:absolute;width:14px;height:14px;background:var(--text3);border-radius:50%;top:2px;left:2px;transition:transform .2s,background .2s;}
.tog.on::after{transform:translateX(16px);background:var(--amber);}

input[type=range]{-webkit-appearance:none;width:100%;height:3px;background:var(--bg3);outline:none;cursor:pointer;border-radius:1px;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--amber);cursor:pointer;border:2px solid var(--bg1);box-shadow:0 0 6px rgba(201,125,16,0.3);}

/* ════ DETAIL ROW ════ */
.detail-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--borderFaint);}
.detail-row:last-child{border-bottom:none;}
.detail-key{font-family:var(--mono);font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.1em;}
.detail-val{font-family:var(--mono);font-size:11px;color:var(--text0);font-weight:700;}

/* ════ SENSOR CARDS ════ */
.sensor-card{background:var(--bg2);border:1px solid var(--border);border-radius:5px;padding:10px 12px;}
.sensor-name{font-family:var(--mono);font-size:8.5px;color:var(--text3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;}
.sensor-val{font-family:var(--mono);font-size:18px;font-weight:700;color:var(--text0);line-height:1;}
.sensor-unit{font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:2px;}
.sensor-status{display:flex;align-items:center;gap:5px;margin-top:6px;font-family:var(--mono);font-size:8px;}

/* ════ PREDICTION CARDS ════ */
.pred-card{background:var(--bg2);border:1px solid var(--border);border-radius:5px;padding:12px;position:relative;overflow:hidden;}
.pred-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;}
.pred-horizon{font-family:var(--mono);font-size:8.5px;color:var(--text3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;}
.pred-density{font-family:var(--mono);font-size:20px;font-weight:700;line-height:1;margin-bottom:3px;}
.pred-conf{font-family:var(--mono);font-size:9px;color:var(--text3);margin-bottom:8px;}
.pred-recommend{font-size:11px;color:var(--text2);line-height:1.4;}

/* ════ EMERGENCY ════ */
.emg-card{background:var(--bg1);border:1px solid var(--border);border-radius:5px;padding:14px;border-top:3px solid;transition:all .2s;margin-bottom:10px;}
.emg-card.active-c{border-top-color:var(--red);background:var(--redBg);}
.emg-card.standby-c{border-top-color:var(--amber);}
.emg-card.ready-c{border-top-color:var(--green);}
.emg-card.disabled-c{border-top-color:var(--border2);}
.corridor-route{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:8px 0;}
.route-node{
  font-family:var(--mono);font-size:9px;background:var(--bg2);border:1px solid var(--border);
  border-radius:3px;padding:2px 8px;color:var(--text1);position:relative;
}
.route-node::after{content:'→';position:absolute;right:-12px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:9px;}
.route-node:last-child::after{display:none;}
.route-node.active-node{background:var(--greenBg);border-color:rgba(26,127,75,0.3);color:var(--green);}
:root.dark-mode .route-node.active-node{border-color:rgba(0,232,122,0.3);color:var(--green2);}

/* ════ WEATHER ════ */
.weather-card{background:linear-gradient(135deg,var(--bg2),var(--bg3));border:1px solid var(--border);border-radius:var(--radius);padding:16px;position:relative;overflow:hidden;}
.weather-temp{font-family:var(--mono);font-size:32px;font-weight:700;color:var(--text0);line-height:1;}
.weather-cond{font-size:13px;color:var(--text2);margin-top:3px;}
.weather-impact{
  margin-top:10px;padding:8px 12px;background:var(--amberBg);
  border:1px solid rgba(201,125,16,0.2);border-radius:4px;
  font-family:var(--mono);font-size:9.5px;color:var(--amber);
}
:root.dark-mode .weather-impact{background:rgba(255,184,48,0.08);border-color:rgba(255,184,48,0.2);}

/* ════ SYSTEM HEALTH ════ */
.health-bar{height:6px;background:var(--bg3);border-radius:3px;overflow:hidden;margin-top:4px;}
.health-bar-fill{height:100%;border-radius:3px;transition:width .5s ease;}
.health-item{padding:10px 0;border-bottom:1px solid var(--borderFaint);}
.health-item:last-child{border-bottom:none;}
.health-item-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;}
.health-label{font-family:var(--mono);font-size:9.5px;color:var(--text2);font-weight:600;}
.health-value{font-family:var(--mono);font-size:10px;font-weight:700;}

/* ════ LOGIN ════ */
.login-shell{
  min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;
  position:relative;overflow:hidden;
  background:linear-gradient(135deg,#0F1928 0%,#0A1020 50%,#10182A 100%);
}
.login-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(26,86,168,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,168,0.06) 1px,transparent 1px);background-size:48px 48px;}
.login-glow{position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(26,86,168,0.15) 0%,transparent 70%);pointer-events:none;}
.login-glow-top{top:-200px;left:20%;animation:float 8s ease-in-out infinite;}
.login-glow-bot{bottom:-200px;right:20%;animation:float 8s ease-in-out 4s infinite;}
.login-box{position:relative;z-index:2;width:100%;max-width:440px;}
.login-head{text-align:center;margin-bottom:32px;}
.login-emblem{
  display:inline-flex;align-items:center;justify-content:center;gap:14px;margin-bottom:18px;
  background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);
  border-radius:12px;padding:14px 24px;max-width:100%;
}
.login-emblem-icon{
  width:52px;height:52px;border-radius:10px;flex-shrink:0;
  background:linear-gradient(135deg,#1A56A8,#0F4C75);
  display:flex;align-items:center;justify-content:center;
  font-family:var(--mono);font-size:20px;font-weight:700;color:#fff;
  border:1px solid rgba(255,255,255,0.2);
}
.login-emblem-text .login-title{font-size:22px;font-weight:800;color:#fff;letter-spacing:-.02em;text-align:left;}
.login-emblem-text .login-sub{font-family:var(--mono);font-size:9px;color:rgba(255,255,255,0.5);letter-spacing:.15em;text-transform:uppercase;margin-top:2px;text-align:left;}
.login-dept{font-family:var(--mono);font-size:9px;color:rgba(255,255,255,0.4);letter-spacing:.12em;text-transform:uppercase;}
.login-card{
  background:rgba(13,20,32,0.9);border:1px solid rgba(255,255,255,0.12);
  border-radius:12px;padding:32px;backdrop-filter:blur(20px);box-shadow:0 20px 60px rgba(0,0,0,0.3);
}
.login-card .inp{background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.1);color:#fff;}
.login-card .inp:focus{border-color:rgba(255,184,48,0.5);box-shadow:0 0 0 2px rgba(255,184,48,0.1);}
.login-card .inp::placeholder{color:rgba(255,255,255,0.25);}
.login-card .field label{color:rgba(255,255,255,0.5);}
.login-sep{display:flex;align-items:center;gap:10px;margin:14px 0;}
.login-sep span{font-family:var(--mono);font-size:8.5px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.12em;white-space:nowrap;}
.login-sep::before,.login-sep::after{content:'';flex:1;height:1px;background:rgba(255,255,255,0.1);}
.cred-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:8px;}
.cred-pill{
  background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);
  border-radius:6px;padding:10px 12px;cursor:pointer;transition:var(--transition);text-align:left;
  font-family:inherit;width:100%;
}
.cred-pill:hover{border-color:rgba(255,184,48,0.4);background:rgba(255,184,48,0.06);}
.cred-role{font-family:var(--mono);font-size:8px;font-weight:700;color:var(--amber2);text-transform:uppercase;letter-spacing:.1em;margin-bottom:2px;}
.cred-id{font-family:var(--mono);font-size:9.5px;color:rgba(255,255,255,0.4);}
.pw-wrap{position:relative;}
.pw-wrap .inp{padding-right:38px;}
.eye{position:absolute;right:11px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.3);font-size:13px;}
.eye:hover{color:rgba(255,184,48,0.8);}
.login-submit{
  width:100%;padding:11px;
  background:linear-gradient(135deg,rgba(201,125,16,0.9),rgba(229,165,37,0.8));
  border:1px solid rgba(201,125,16,0.6);border-radius:5px;
  font-family:var(--mono);font-size:11px;font-weight:700;color:#fff;
  letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:var(--transition);margin-top:4px;
}
.login-submit:hover{background:linear-gradient(135deg,rgba(229,165,37,0.95),rgba(201,125,16,0.95));}
.login-submit:disabled{opacity:.4;cursor:not-allowed;}
.login-footer-text{text-align:center;margin-top:14px;font-family:var(--mono);font-size:8.5px;color:rgba(255,255,255,0.25);letter-spacing:.06em;}

/* ════ ANALYTICS EXPORT ════ */
.export-btn-group{display:flex;gap:6px;}

/* ════ MOBILE OVERLAY ════ */
.mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:300;backdrop-filter:blur(4px);}
.mob-overlay.open{display:block;}

/* ════ MAINTENANCE ALERT ════ */
.maint-card{
  background:var(--redBg);border:1px solid rgba(176,48,48,0.2);border-radius:5px;
  padding:10px 12px;margin-bottom:8px;border-left:3px solid var(--red);
}
:root.dark-mode .maint-card{border-color:rgba(255,77,77,0.2);}
.maint-card-title{font-family:var(--mono);font-size:10px;font-weight:700;color:var(--red);margin-bottom:3px;}
.maint-card-detail{font-family:var(--mono);font-size:9px;color:var(--text2);}

/* ════ CHART TOOLTIP ════ */
.ct{background:var(--bg1);border:1px solid var(--border);border-radius:5px;padding:9px 12px;font-family:var(--mono);font-size:10px;color:var(--text0);box-shadow:var(--shadowMd);}
.ct-lbl{color:var(--text3);font-size:8.5px;margin-bottom:3px;letter-spacing:.1em;text-transform:uppercase;}

/* ════ ANIMATIONS ════ */
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse-ring{0%{transform:scale(.95)}70%{transform:scale(1);opacity:.8}100%{transform:scale(.95)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-30px)}}
@keyframes spin{to{transform:rotate(360deg)}}
.fade-up{animation:fadeUp .3s ease both;}
.spin{animation:spin 1s linear infinite;}

/* ════ RESPONSIVE ════ */
@media(max-width:900px){
  .sidebar{transform:translateX(-100%);}
  .sidebar.open{transform:translateX(0);}
  .main-area{margin-left:0;}
  .mob-menu{display:flex!important;}
  .kpi-strip,.g4{grid-template-columns:repeat(2,1fr);}
  .signal-grid{grid-template-columns:repeat(2,1fr);}
  .g2,.g3,.g13,.g31{grid-template-columns:1fr;}
  .hide-mob{display:none!important;}
}
@media(max-width:500px){
  .kpi-strip,.g4{grid-template-columns:1fr;}
  .cred-grid{grid-template-columns:1fr;}
  .signal-grid{grid-template-columns:1fr;}
  .content{padding:14px 16px;}
  .login-box{max-width:95%;}
  .login-card{padding:24px;}
  .login-emblem{flex-direction:column;gap:10px;}
  .login-emblem-text{text-align:center;}
}
`;

/* ══════════════════════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════════════════════ */
const JUNCTIONS = [
  {id:"J-001",name:"Anna Salai Command Junction",lat:13.0604,lng:80.2496,zone:"Central Business District",region:"Chennai Central",policeStation:"PS-001",congestion:"Red",phase:"Red",density:84,vehicles:347,delay:9.2,priority:"Critical",sensorStatus:{camera:"Healthy",radar:"Healthy",temp:"Healthy",humidity:"Healthy",gpsRf:"Healthy"},emergencyReady:true},
  {id:"J-002",name:"Koyambedu Interchange",lat:13.0713,lng:80.1946,zone:"Intercity Gateway",region:"Chennai West",policeStation:"PS-002",congestion:"Yellow",phase:"Green",density:68,vehicles:218,delay:5.1,priority:"High",sensorStatus:{camera:"Healthy",radar:"Degraded",temp:"Healthy",humidity:"Healthy",gpsRf:"Healthy"},emergencyReady:true},
  {id:"J-003",name:"T. Nagar Smart Cross",lat:13.0418,lng:80.2341,zone:"Retail District",region:"Chennai South",policeStation:"PS-003",congestion:"Red",phase:"Red",density:91,vehicles:412,delay:11.8,priority:"Critical",sensorStatus:{camera:"Degraded",radar:"Healthy",temp:"Healthy",humidity:"Healthy",gpsRf:"Failed"},emergencyReady:false},
  {id:"J-004",name:"Vadapalani Junction",lat:13.0528,lng:80.2121,zone:"Residential Connector",region:"Chennai West",policeStation:"PS-002",congestion:"Green",phase:"Green",density:44,vehicles:138,delay:2.2,priority:"Medium",sensorStatus:{camera:"Healthy",radar:"Healthy",temp:"Healthy",humidity:"Healthy",gpsRf:"Healthy"},emergencyReady:true},
  {id:"J-005",name:"Guindy Industrial Corridor",lat:13.0069,lng:80.2206,zone:"Industrial Zone",region:"Chennai South",policeStation:"PS-003",congestion:"Yellow",phase:"Yellow",density:62,vehicles:187,delay:4.4,priority:"High",sensorStatus:{camera:"Healthy",radar:"Healthy",temp:"Healthy",humidity:"Healthy",gpsRf:"Healthy"},emergencyReady:true},
  {id:"J-006",name:"Adyar Signal Point",lat:13.0012,lng:80.2565,zone:"Coastal Residential",region:"Chennai South",policeStation:"PS-003",congestion:"Green",phase:"Green",density:36,vehicles:108,delay:1.6,priority:"Low",sensorStatus:{camera:"Healthy",radar:"Healthy",temp:"Healthy",humidity:"Healthy",gpsRf:"Healthy"},emergencyReady:false},
  {id:"J-007",name:"Egmore – NSC Bose Road",lat:13.0732,lng:80.2609,zone:"Administrative Hub",region:"Chennai Central",policeStation:"PS-001",congestion:"Yellow",phase:"Yellow",density:72,vehicles:271,delay:6.3,priority:"High",sensorStatus:{camera:"Healthy",radar:"Healthy",temp:"Healthy",humidity:"Healthy",gpsRf:"Healthy"},emergencyReady:true},
  {id:"J-008",name:"Tambaram Bypass",lat:12.9249,lng:80.1000,zone:"Suburban Transit",region:"Chennai South",policeStation:"PS-004",congestion:"Green",phase:"Green",density:28,vehicles:86,delay:1.2,priority:"Low",sensorStatus:{camera:"Healthy",radar:"Healthy",temp:"Healthy",humidity:"Healthy",gpsRf:"Healthy"},emergencyReady:false},
  {id:"J-009",name:"Perambur Junction",lat:13.1143,lng:80.2322,zone:"North Industrial",region:"Chennai North",policeStation:"PS-005",congestion:"Yellow",phase:"Green",density:55,vehicles:164,delay:3.9,priority:"Medium",sensorStatus:{camera:"Healthy",radar:"Healthy",temp:"Healthy",humidity:"Degraded",gpsRf:"Healthy"},emergencyReady:true},
  {id:"J-010",name:"Velachery IT Corridor",lat:12.9816,lng:80.2209,zone:"IT Hub",region:"Chennai South",policeStation:"PS-004",congestion:"Red",phase:"Red",density:88,vehicles:395,delay:10.5,priority:"High",sensorStatus:{camera:"Healthy",radar:"Healthy",temp:"Healthy",humidity:"Healthy",gpsRf:"Healthy"},emergencyReady:true},
  {id:"J-011",name:"Porur Signal",lat:13.0374,lng:80.1574,zone:"Western Connector",region:"Chennai West",policeStation:"PS-002",congestion:"Green",phase:"Green",density:40,vehicles:121,delay:2.0,priority:"Medium",sensorStatus:{camera:"Healthy",radar:"Healthy",temp:"Healthy",humidity:"Healthy",gpsRf:"Healthy"},emergencyReady:false},
  {id:"J-012",name:"Sholinganallur Junction",lat:12.9010,lng:80.2279,zone:"IT Corridor South",region:"Chennai South",policeStation:"PS-004",congestion:"Yellow",phase:"Yellow",density:58,vehicles:176,delay:4.0,priority:"Medium",sensorStatus:{camera:"Healthy",radar:"Healthy",temp:"Healthy",humidity:"Healthy",gpsRf:"Healthy"},emergencyReady:true},
];

const REGIONS = [
  {id:"RG-01",name:"Chennai Central",junctions:["J-001","J-007"],authority:"IAS Suresh Menon"},
  {id:"RG-02",name:"Chennai North",junctions:["J-009"],authority:"IAS Pramila Devi"},
  {id:"RG-03",name:"Chennai South",junctions:["J-003","J-005","J-006","J-008","J-010","J-012"],authority:"IAS Karthik Babu"},
  {id:"RG-04",name:"Chennai West",junctions:["J-002","J-004","J-011"],authority:"IAS Anitha Rajan"},
];

const POLICE_STATIONS = [
  {id:"PS-001",name:"Egmore PS",region:"Chennai Central",junctions:["J-001","J-007"]},
  {id:"PS-002",name:"Koyambedu PS",region:"Chennai West",junctions:["J-002","J-004","J-011"]},
  {id:"PS-003",name:"Guindy PS",region:"Chennai South",junctions:["J-003","J-005","J-006"]},
  {id:"PS-004",name:"Tambaram PS",region:"Chennai South",junctions:["J-008","J-010","J-012"]},
  {id:"PS-005",name:"Perambur PS",region:"Chennai North",junctions:["J-009"]},
];

const HOURLY = [
  {h:"00",d:20,v:60,p:22},{h:"02",d:12,v:35,p:14},{h:"04",d:15,v:42,p:18},
  {h:"06",d:52,v:165,p:55},{h:"08",d:89,v:390,p:86},{h:"10",d:74,v:268,p:76},
  {h:"12",d:68,v:232,p:70},{h:"14",d:62,v:200,p:65},{h:"16",d:86,v:355,p:90},
  {h:"18",d:93,v:425,p:91},{h:"20",d:72,v:248,p:74},{h:"22",d:48,v:138,p:46},
];
const WEEKLY = [
  {day:"Mon",avg:72,peak:92,vehicles:8420},{day:"Tue",avg:68,peak:88,vehicles:7980},
  {day:"Wed",avg:76,peak:94,vehicles:8890},{day:"Thu",avg:79,peak:96,vehicles:9200},
  {day:"Fri",avg:83,peak:98,vehicles:9750},{day:"Sat",avg:54,peak:72,vehicles:6200},
  {day:"Sun",avg:38,peak:56,vehicles:4300},
];
const MONTHLY_TREND = [
  {month:"Jan",avg:65,incidents:24},{month:"Feb",avg:68,incidents:21},
  {month:"Mar",avg:72,incidents:28},{month:"Apr",avg:78,incidents:32},
  {month:"May",avg:74,incidents:25},{month:"Jun",avg:81,incidents:35},
];
const PIE_DATA = [
  {name:"Normal",value:6,color:"#1A7F4B"},
  {name:"Moderate",value:3,color:"#C97D10"},
  {name:"Congested",value:3,color:"#B03030"},
];
const LOGS = [
  {id:"EVT-9901",time:"17:22:10",type:"AI Optimisation",junction:"Anna Salai (J-001)",details:"N-S green extended +18s. Queue reduced 22%.",status:"Success"},
  {id:"EVT-9900",time:"17:18:45",type:"Sensor Alert",junction:"T. Nagar (J-003)",details:"GPS-RF receiver offline. Maintenance dispatched.",status:"Error"},
  {id:"EVT-9899",time:"17:05:30",type:"Emergency Override",junction:"Guindy (J-005)",details:"Ambulance TN-01-AB-1234 green corridor activated.",status:"Success"},
  {id:"EVT-9898",time:"16:55:12",type:"AI Optimisation",junction:"Velachery (J-010)",details:"Peak protection mode engaged. Throughput +14%.",status:"Success"},
  {id:"EVT-9897",time:"16:40:00",type:"Weather Alert",junction:"Network Wide",details:"Light rain detected. Signal buffers extended by 5s.",status:"Warning"},
  {id:"EVT-9896",time:"16:30:10",type:"Manual Override",junction:"Egmore (J-007)",details:"VIP convoy. All-red 90s protocol executed.",status:"Warning"},
  {id:"EVT-9895",time:"16:15:44",type:"System Event",junction:"Network Wide",details:"LSTM model v2.4 weights updated. Accuracy +3.2%.",status:"Success"},
  {id:"EVT-9894",time:"15:58:20",type:"Sensor Alert",junction:"Koyambedu (J-002)",details:"mmWave radar latency drift detected. Self-healed.",status:"Warning"},
];

const USERS = [
  {id:"USR-001",name:"Kabil R",role:"Super Administrator",zone:"Central Command",status:"Active",last:"Today 17:22",mfa:true},
  {id:"USR-002",name:"Anitha Sharma",role:"Regional Traffic Authority",zone:"Chennai North",status:"Active",last:"Today 16:58",mfa:true},
  {id:"USR-003",name:"Rahul Menon",role:"Police Station Controller",zone:"Guindy PS",status:"Active",last:"Today 15:30",mfa:false},
  {id:"USR-004",name:"Priya Nair",role:"Emergency Operations Controller",zone:"Rapid Response",status:"Active",last:"Today 17:10",mfa:true},
  {id:"USR-005",name:"Suresh Kumar",role:"Regional Traffic Authority",zone:"Chennai West",status:"Active",last:"Today 14:45",mfa:true},
  {id:"USR-006",name:"Deepa Krishnan",role:"Junction Operator",zone:"J-003 T.Nagar",status:"Active",last:"Today 12:00",mfa:false},
  {id:"USR-007",name:"Manoj Pillai",role:"Junction Operator",zone:"J-010 Velachery",status:"Suspended",last:"2026-06-01",mfa:false},
];

const CREDS = {
  admin:{username:"admin",id:"USR-001",name:"Kabil R",role:"Super Administrator",zone:"Central Command"},
  regional:{username:"regional",id:"USR-002",name:"Anitha Sharma",role:"Regional Traffic Authority",zone:"Chennai North"},
  police:{username:"police",id:"USR-003",name:"Rahul Menon",role:"Police Station Controller",zone:"Guindy PS"},
  operator:{username:"operator",id:"USR-006",name:"Deepa Krishnan",role:"Junction Operator",zone:"J-003 T.Nagar"},
  emergency:{username:"emergency",id:"USR-004",name:"Priya Nair",role:"Emergency Operations Controller",zone:"Rapid Response"},
};

const ALL_TABS = [
  {id:"dashboard",label:"Command Centre",ico:"⬡",roles:["Super Administrator","Regional Traffic Authority","Police Station Controller","Junction Operator","Emergency Operations Controller"]},
  {id:"map",label:"Live City Map",ico:"◈",roles:["Super Administrator","Regional Traffic Authority","Police Station Controller","Junction Operator","Emergency Operations Controller"]},
  {id:"junction",label:"Junction Control",ico:"◉",roles:["Super Administrator","Regional Traffic Authority","Police Station Controller","Junction Operator"]},
  {id:"lstm",label:"AI Predictions",ico:"⬠",roles:["Super Administrator","Regional Traffic Authority"]},
  {id:"weather",label:"Weather Intel",ico:"☁",roles:["Super Administrator","Regional Traffic Authority","Emergency Operations Controller"]},
  {id:"emergency",label:"Emergency Ops",ico:"⚠",roles:["Super Administrator","Emergency Operations Controller"],badge:true},
  {id:"sensors",label:"Sensor Health",ico:"◎",roles:["Super Administrator","Regional Traffic Authority","Police Station Controller"]},
  {id:"analytics",label:"Analytics",ico:"▦",roles:["Super Administrator","Regional Traffic Authority"]},
  {id:"history",label:"Audit Log",ico:"≡",roles:["Super Administrator","Regional Traffic Authority"]},
  {id:"users",label:"User Management",ico:"◌",roles:["Super Administrator"]},
  {id:"settings",label:"System Settings",ico:"⚙",roles:["Super Administrator"]},
];

/* ══════════════════════════════════════════════════════════════
   HELPER UTILITIES
══════════════════════════════════════════════════════════════ */
function congestColor(c){
  return c==="Red"?"#B03030":c==="Yellow"?"#C97D10":c==="Blue"?"#1A56A8":"#1A7F4B";
}
function badgeClass(s){
  const m={
    Red:"badge-r",Yellow:"badge-y",Green:"badge-g",Blue:"badge-b",
    Success:"badge-g",Warning:"badge-y",Error:"badge-r",
    Active:"badge-g",Suspended:"badge-r",
    "Super Administrator":"badge-r","Regional Traffic Authority":"badge-b",
    "Police Station Controller":"badge-p","Junction Operator":"badge-g",
    "Emergency Operations Controller":"badge-y",
    Critical:"badge-r",High:"badge-y",Medium:"badge-b",Low:"badge-g",
    Healthy:"badge-g",Degraded:"badge-y",Failed:"badge-r",
  };
  return `badge ${m[s]||"badge-k"}`;
}

function DBar({value}){
  const c=value>75?"#B03030":value>50?"#C97D10":"#1A7F4B";
  return(
    <div className="dbar">
      <div className="dbar-track"><div className="dbar-fill" style={{width:`${value}%`,background:c}}/></div>
      <span className="dbar-pct" style={{color:c}}>{value}%</span>
    </div>
  );
}
function SdotFor({c}){
  return <div className={`sdot ${c==="Red"?"sdot-r":c==="Yellow"?"sdot-y":c==="Blue"?"sdot-b":"sdot-g"}`}/>;
}
function CT({active,payload,label}){
  if(!active||!payload?.length) return null;
  return(
    <div className="ct">
      <div className="ct-lbl">{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color||"var(--text0)",fontSize:10}}>{p.name}: <b>{p.value}</b></div>
      ))}
    </div>
  );
}
function Clock(){
  const [t,setT]=useState(null);
  useEffect(()=>{setT(new Date());const i=setInterval(()=>setT(new Date()),1000);return()=>clearInterval(i);},[]);
  if(!t) return null;
  return <span>{t.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>;
}
function LiveDate(){
  const [d,setD]=useState(null);
  useEffect(()=>{setD(new Date());},[]);
  if(!d) return null;
  return <span>{d.toLocaleDateString("en-IN",{weekday:"short",day:"2-digit",month:"short",year:"numeric"})}</span>;
}
function buildJunctionWeather(junction){
  const coastalBoost=junction.zone.includes("Coastal")?16:0;
  const rainfall=Math.max(0,Math.round((junction.density-30)/4)+coastalBoost/2);
  const impact=Math.min(92,Math.max(18,Math.round(junction.density*0.58+junction.delay*2.6+coastalBoost)));
  const condition=rainfall>26?"Heavy Rain":rainfall>14?"Light Rain":junction.zone.includes("Coastal")?"Humid Clouds":"Partly Cloudy";
  const temp=Math.max(27,Math.min(36,33-Math.round(rainfall/12)+(junction.region.includes("South")?-1:0)));
  const visibility=Math.max(2.5,+(10-rainfall/10-(coastalBoost?0.8:0)).toFixed(1));
  const windSpeed=Math.max(9,14+Math.round(junction.delay)+(coastalBoost?5:0));
  const suggestion=[
    rainfall>18?`Pre-empt drainage and low-visibility response around ${junction.id}`:`Maintain adaptive clearance cycle for ${junction.id}`,
    junction.density>75?`Hold longer outbound green for ${junction.name}`:`Keep AI-managed phase balancing active at ${junction.id}`,
    junction.emergencyReady?`Keep ${junction.policeStation} on priority standby`:`Escalate emergency support coverage for ${junction.id}`,
  ];
  const forecast=["+1h","+2h","+3h","+4h","+5h"].map((slot,idx)=>{
    const rain=Math.max(0,Math.min(95,rainfall+(idx*7)-6));
    const impactAtTime=Math.max(10,Math.min(98,impact+(idx*4)-8));
    return {time:slot,rain,impact:impactAtTime,temp:Math.max(25,temp-((idx>1)?1:0)),condition:rain>60?"Rain":rain>25?"Cloudy":"Clear"};
  });
  const alerts=[];
  if(rainfall>18){
    alerts.push({id:`WX-${junction.id}-RAIN`,type:"RAIN_WARNING",severity:impact>70?"HIGH":"MEDIUM",message:`Rain build-up near ${junction.name}. AI has widened safety buffers and queue release windows.`,affected:[junction.id]});
  }
  if(visibility<5.5){
    alerts.push({id:`WX-${junction.id}-VIS`,type:"VISIBILITY",severity:"MEDIUM",message:`Reduced visibility expected near ${junction.zone}. Camera confidence may dip during peak flow.`,affected:[junction.id]});
  }
  return {
    junctionId:junction.id,
    junctionName:junction.name,
    temp,
    humidity:Math.min(92,58+Math.round(junction.delay*3)+(coastalBoost?10:0)),
    condition,
    visibility,
    windSpeed,
    rainfall,
    impact,
    forecast,
    alerts,
    suggestions:suggestion,
  };
}
function buildAnalyticsSeries(range,junctions){
  const avgDensity=junctions.reduce((sum,j)=>sum+j.density,0)/junctions.length;
  const totalVehicles=junctions.reduce((sum,j)=>sum+j.vehicles,0);
  if(range==="1h"){
    const data=["-50m","-40m","-30m","-20m","-10m","Now"].map((h,idx)=>({
      h,
      d:Math.max(15,Math.min(98,Math.round(avgDensity-9+idx*3))),
      v:Math.max(40,Math.round(totalVehicles/14)+idx*18),
      p:Math.max(18,Math.min(99,Math.round(avgDensity-6+idx*4))),
    }));
    return {
      densityData:data,
      densityKey:"h",
      densityTitle:"Last 1 Hour Density vs AI Prediction",
      vehicleTitle:"Vehicle Count by 10-Min Window",
      comparisonData:data.map((item,idx)=>({label:item.h,avg:item.d,peak:Math.min(99,item.p+4+idx)})),
      comparisonKey:"label",
      comparisonTitle:"10-Minute Peak vs Average Density",
      pieData:[
        {name:"Normal",value:junctions.filter(j=>j.density<50).length,color:"#1A7F4B"},
        {name:"Moderate",value:junctions.filter(j=>j.density>=50&&j.density<75).length,color:"#C97D10"},
        {name:"Congested",value:junctions.filter(j=>j.density>=75).length,color:"#B03030"},
      ],
      kpis:{
        efficiency:"96.1%",
        actions:"142",
        avgDelay:`${(junctions.reduce((a,j)=>a+j.delay,0)/junctions.length).toFixed(1)}m`,
        fuel:"18 L",
        delta:"live hour",
      },
    };
  }
  if(range==="7d"){
    const data=WEEKLY.map((item,idx)=>({
      h:item.day,
      d:item.avg,
      v:Math.round(item.vehicles/10),
      p:item.peak,
    }));
    return {
      densityData:data,
      densityKey:"h",
      densityTitle:"7-Day Density vs AI Prediction",
      vehicleTitle:"Average Daily Vehicle Volume",
      comparisonData:WEEKLY.map(item=>({label:item.day,avg:item.avg,peak:item.peak})),
      comparisonKey:"label",
      comparisonTitle:"Weekly Peak vs Average Density",
      pieData:[
        {name:"Normal",value:2,color:"#1A7F4B"},
        {name:"Moderate",value:2,color:"#C97D10"},
        {name:"Congested",value:3,color:"#B03030"},
      ],
      kpis:{
        efficiency:"91.4%",
        actions:"1,847",
        avgDelay:`${(junctions.reduce((a,j)=>a+j.delay,0)/junctions.length+0.6).toFixed(1)}m`,
        fuel:"284 L",
        delta:"this week",
      },
    };
  }
  if(range==="30d"){
    const data=MONTHLY_TREND.map((item,idx)=>({
      h:item.month,
      d:item.avg,
      v:item.incidents*42,
      p:Math.min(98,item.avg+6+(idx%2)),
    }));
    const normal=MONTHLY_TREND.filter(item=>item.avg<60).length;
    const moderate=MONTHLY_TREND.filter(item=>item.avg>=60&&item.avg<78).length;
    const congested=MONTHLY_TREND.length-normal-moderate;
    return {
      densityData:data,
      densityKey:"h",
      densityTitle:"30-Day Density vs AI Prediction",
      vehicleTitle:"Monthly Incident-Weighted Volume",
      comparisonData:MONTHLY_TREND.map(item=>({label:item.month,avg:item.avg,peak:Math.min(98,item.avg+10)})),
      comparisonKey:"label",
      comparisonTitle:"Monthly Peak vs Average Density",
      pieData:[
        {name:"Normal",value:normal,color:"#1A7F4B"},
        {name:"Moderate",value:moderate,color:"#C97D10"},
        {name:"Congested",value:congested,color:"#B03030"},
      ],
      kpis:{
        efficiency:"88.7%",
        actions:"7,962",
        avgDelay:`${(junctions.reduce((a,j)=>a+j.delay,0)/junctions.length+1.4).toFixed(1)}m`,
        fuel:"1,126 L",
        delta:"this month",
      },
    };
  }
  return {
    densityData:HOURLY,
    densityKey:"h",
    densityTitle:"24-Hour Density vs AI Prediction",
    vehicleTitle:"Vehicle Count by Hour",
    comparisonData:WEEKLY.map(item=>({label:item.day,avg:item.avg,peak:item.peak})),
    comparisonKey:"label",
    comparisonTitle:"Weekly Peak vs Average Density",
    pieData:PIE_DATA,
    kpis:{
      efficiency:"93.2%",
      actions:"1,847",
      avgDelay:`${(junctions.reduce((a,j)=>a+j.delay,0)/junctions.length).toFixed(1)}m`,
      fuel:"284 L",
      delta:"today",
    },
  };
}
function downloadBlob(filename, blob){
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function escapePdfText(value){
  return String(value)
    .replace(/[^\x20-\x7E]/g,"-")
    .replace(/\\/g,"\\\\")
    .replace(/\(/g,"\\(")
    .replace(/\)/g,"\\)");
}
function buildSimplePdf(lines){
  const safeLines=lines.slice(0,28);
  const stream=safeLines.map((line,idx)=>`BT /F1 11 Tf 40 ${780-(idx*24)} Td (${escapePdfText(line)}) Tj ET`).join("\n");
  const objects=[
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`,
  ];
  let pdf="%PDF-1.4\n";
  const offsets=[0];
  objects.forEach(obj=>{
    offsets.push(pdf.length);
    pdf+=`${obj}\n`;
  });
  const xrefStart=pdf.length;
  pdf+=`xref\n0 ${objects.length+1}\n`;
  pdf+="0000000000 65535 f \n";
  offsets.slice(1).forEach(offset=>{
    pdf+=`${String(offset).padStart(10,"0")} 00000 n \n`;
  });
  pdf+=`trailer << /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return new Blob([pdf],{type:"application/pdf"});
}
function escapeXml(value){
  return String(value)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/\"/g,"&quot;")
    .replace(/'/g,"&apos;");
}
function buildExcelSpreadsheet(rows,sheetName){
  const header='<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
  const workbook=`<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="Header"><Font ss:Bold="1"/><Interior ss:Color="#DCEAF7" ss:Pattern="Solid"/></Style></Styles><Worksheet ss:Name="${escapeXml(sheetName)}"><Table>${rows.map((row,rowIdx)=>`<Row>${row.map(cell=>`<Cell${rowIdx===0?' ss:StyleID="Header"':""}><Data ss:Type="${typeof cell==="number"?"Number":"String"}">${escapeXml(cell)}</Data></Cell>`).join("")}</Row>`).join("")}</Table></Worksheet></Workbook>`;
  return new Blob([header,workbook],{type:"application/vnd.ms-excel"});
}

/* ══════════════════════════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════════════════════════ */
function Login({onLogin}){
  const [u,setU]=useState("");const [p,setP]=useState("");
  const [show,setShow]=useState(false);const [err,setErr]=useState("");const [ld,setLd]=useState(false);
  const submit=(e)=>{
    e.preventDefault();setErr("");setLd(true);
    setTimeout(()=>{
      const c=CREDS[u.trim().toLowerCase()];
      if(c&&p===u.trim().toLowerCase()){onLogin(c);}
      else{setErr("AUTHENTICATION FAILED — INVALID AUTHORITY ID OR PASSKEY");setLd(false);}
    },800);
  };
  return(
    <div className="login-shell">
      <div className="login-grid"/>
      <div className="login-glow login-glow-top"/>
      <div className="login-glow login-glow-bot"/>
      <div className="login-box fade-up">
        <div className="login-head">
          <div className="login-emblem">
            <div className="login-emblem-icon">TX</div>
            <div className="login-emblem-text">
              <div className="login-title">TRAFFIX PORTAL</div>
              <div className="login-sub">Smart Traffic Management System v4.0</div>
            </div>
          </div>
          <div className="login-dept">Government of Tamil Nadu · Dept. of Highways & Traffic Engineering</div>
        </div>
        <div className="login-card">
          <div className="alert alert-i" style={{marginBottom:16,fontSize:9.5}}>
            🛡️ RESTRICTED GOVERNMENT SYSTEM — AUTHORISED PERSONNEL ONLY · ALL ACCESS IS AUDITED UNDER IT ACT 2000
          </div>
          {err&&<div className="alert alert-e" style={{marginBottom:14,fontSize:9.5}}>{err}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label>Authority ID</label>
              <input className="inp" type="text" placeholder="Enter your authority ID" value={u} onChange={e=>setU(e.target.value)} required autoComplete="username"/>
            </div>
            <div className="field">
              <label>Secure Passkey</label>
              <div className="pw-wrap">
                <input className="inp" type={show?"text":"password"} placeholder="Enter passkey" value={p} onChange={e=>setP(e.target.value)} required/>
                <button type="button" className="eye" onClick={()=>setShow(s=>!s)}>{show?"●":"○"}</button>
              </div>
            </div>
            <button className="login-submit" type="submit" disabled={ld}>{ld?"VERIFYING CREDENTIALS…":"ACCESS TRAFFIX PORTAL →"}</button>
          </form>
          <div className="login-sep"><span>Demo Credentials</span></div>
          <div className="cred-grid">
            {Object.keys(CREDS).map(id=>(
              <button key={id} className="cred-pill" onClick={()=>{setU(id);setP(id);}}>
                <div className="cred-role">{CREDS[id].role}</div>
                <div className="cred-id">{id} / {id}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="login-footer-text">SECURED · JWT HS256 · IT ACT 2000 SECTION 66 · UNAUTHORIZED ACCESS IS A COGNIZABLE OFFENCE</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════════════ */
function Sidebar({tab,setTab,user,open,onClose,onLogout}){
  const tabs=ALL_TABS.filter(t=>t.roles.includes(user.role));
  const initials=user.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  return(
    <>
      {open&&<div className="mob-overlay open" onClick={onClose}/>}
      <aside className={`sidebar${open?" open":""}`}>
        <div className="sidebar-header">
          <div className="logo-emblem">TX</div>
          <div className="logo-text-wrap">
            <div className="logo-text">TRAFFIX</div>
            <div className="logo-sub">TN · Traffic Command</div>
          </div>
        </div>
        <div className="sidebar-body">
          <div className="sidebar-section">
            <div className="sidebar-label">Navigation</div>
            {tabs.map(t=>(
              <button key={t.id} className={`nav-btn${tab===t.id?" active":""}`} onClick={()=>{setTab(t.id);onClose();}}>
                <span className="nav-ico">{t.ico}</span>
                {t.label}
                {t.badge&&<span className="nav-badge">!</span>}
              </button>
            ))}
          </div>
          <div className="sidebar-section" style={{marginTop:8}}>
            <div className="sidebar-label">Network Status</div>
            <div style={{padding:"4px 8px",display:"flex",flexDirection:"column",gap:3}}>
              {[["Network","LIVE","var(--green)"],["Active Nodes",`${JUNCTIONS.length}`,"var(--amber)"],["AI Engine","ONLINE","var(--cyan)"],["Build","v4.0.1","var(--text3)"]].map(([k,v,c])=>(
                <div key={k} className="sys-stat">
                  <span className="sys-stat-key">{k}</span>
                  <span className="sys-stat-val" style={{color:c}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="user-ava">{initials}</div>
            <div style={{flex:1,minWidth:0}}>
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role}</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onLogout}>EXIT</button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   TOPBAR
══════════════════════════════════════════════════════════════ */
function Topbar({tab,onMenuToggle,alerts,user}){
  const meta=ALL_TABS.find(t=>t.id===tab);
  const [notifOpen,setNotifOpen]=useState(false);
  const activeAlerts=alerts.filter(a=>a.severity==="CRITICAL"||a.severity==="HIGH");
  return(
    <div className="topbar" style={{position:"relative"}}>
      <button className="mob-menu" onClick={onMenuToggle} style={{display:"none"}}>☰</button>
      <div className="topbar-breadcrumb">
        <b>TRAFFIX</b> / {meta?.label||tab}
      </div>
      <div className="live-pill"><div className="live-dot"/>SYS LIVE</div>
      <div className="clock-box"><Clock/></div>
      <div style={{position:"relative"}}>
        <button className="notif-btn" onClick={()=>setNotifOpen(o=>!o)}>
          <span style={{fontSize:16}}>🔔</span>
          {activeAlerts.length>0&&<span className="notif-dot"/>}
        </button>
        {notifOpen&&(
          <div className="notif-panel">
            <div className="notif-head">
              <h4>Active Alerts ({activeAlerts.length})</h4>
              <button className="btn btn-ghost btn-sm" onClick={()=>setNotifOpen(false)}>✕</button>
            </div>
            {activeAlerts.slice(0,5).map(a=>(
              <div key={a.id} className="notif-item">
                <div className="notif-title">{a.message}</div>
                <div className="notif-meta">{a.junction} · {a.severity}</div>
              </div>
            ))}
            {activeAlerts.length===0&&(
              <div style={{padding:16,textAlign:"center",fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)"}}>No critical alerts</div>
            )}
          </div>
        )}
      </div>
      <DarkModeToggle/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   JUNCTION SEARCH COMPONENT - Reusable Across All Pages
══════════════════════════════════════════════════════════════ */
function matchesJunctionSearch(junction,searchTerm){
  const q=searchTerm.trim().toLowerCase();
  if(!q) return true;
  return [
    junction.id,
    junction.name,
    junction.zone,
    junction.region,
    junction.policeStation,
  ].some(value=>String(value||"").toLowerCase().includes(q));
}

function JunctionSearchBar({junctions=[],searchTerm,setSearchTerm,onSelect,placeholder="Search Junction ID, Name, Zone or Region..."}){
  const filtered=searchTerm.trim()?junctions.filter(j=>matchesJunctionSearch(j,searchTerm)):[];
  const showDropdown=searchTerm.trim().length>0&&filtered.length>0;
  return(
    <div style={{position:"relative",flex:1,maxWidth:"320px"}}>
      <input
        type="text"
        placeholder="🔍 Search Junction ID, Name or Zone..."
        value={searchTerm}
        onChange={(e)=>setSearchTerm(e.target.value)}
        style={{
          width:"100%",padding:"8px 12px",
          border:"1px solid var(--border)",borderRadius:"5px",
          background:"var(--bg1)",color:"var(--text0)",
          fontFamily:"var(--mono)",fontSize:"11px",
          outline:"none",transition:"all 0.2s",
        }}
        onFocus={(e)=>{e.target.style.borderColor="var(--accent)";}}
        onBlur={(e)=>e.target.style.borderColor="var(--border)"}
      />
      {showDropdown&&(
        <div style={{
          position:"absolute",top:"100%",left:0,right:0,
          background:"var(--bg1)",border:"1px solid var(--border)",
          borderTop:"none",borderRadius:"0 0 5px 5px",
          maxHeight:"200px",overflowY:"auto",
          zIndex:100,marginTop:"-1px"
        }}>
          {filtered.map(j=>(
            <div
              key={j.id}
              onClick={()=>{onSelect(j);setSearchTerm("");}}
              style={{
                padding:"8px 12px",
                borderBottom:"1px solid var(--borderFaint)",
                cursor:"pointer",
                transition:"all 0.15s",
                fontSize:"11px"
              }}
              onMouseEnter={(e)=>e.target.style.background="var(--bg2)"}
              onMouseLeave={(e)=>e.target.style.background="transparent"}
            >
              <div style={{fontWeight:700,color:"var(--text0)"}}>{j.id} · {j.name.split("–")[0]}</div>
              <div style={{fontSize:"9px",color:"var(--text3)",marginTop:"2px"}}>{j.zone} · {j.region}</div>
            </div>
          ))}
        </div>
      )}
      {searchTerm.trim().length>0&&filtered.length===0&&(
        <div style={{
          position:"absolute",top:"100%",left:0,right:0,
          background:"var(--bg1)",border:"1px solid var(--border)",
          borderTop:"none",borderRadius:"0 0 5px 5px",
          padding:"8px 12px",marginTop:"-1px",
          fontSize:"10px",color:"var(--text3)",textAlign:"center",
          zIndex:100
        }}
      >
        No junctions found
      </div>
      )}
    </div>
  );
}

function getDensityCongestion(density){
  if(density>=75) return "Red";
  if(density>=50) return "Yellow";
  return "Green";
}

/* ══════════════════════════════════════════════════════════════
   COMMAND CENTRE DASHBOARD
══════════════════════════════════════════════════════════════ */
function Dashboard({onNav,junctions=JUNCTIONS,events=LOGS,alerts=[]}){  
  const [dashboardSearch,setDashboardSearch]=useState("");
  const [selJ,setSelJ]=useState(null);
  const [tick,setTick]=useState(0);
  useEffect(()=>{const i=setInterval(()=>setTick(t=>t+1),5000);return()=>clearInterval(i);},[]);

  const filteredJunctions=useMemo(()=>{
    return junctions.filter(j=>matchesJunctionSearch(j,dashboardSearch));
  },[junctions,dashboardSearch]);

  useEffect(()=>{
    if(selJ&&!junctions.some(j=>j.id===selJ.id)){
      setSelJ(null);
    }
  },[junctions,selJ]);

  const congested=junctions.filter(j=>j.congestion==="Red").length;
  const moderate=junctions.filter(j=>j.congestion==="Yellow").length;
  const avgDensity=Math.round(junctions.reduce((a,j)=>a+j.density,0)/junctions.length);
  const totalVeh=junctions.reduce((a,j)=>a+j.vehicles,0);
  const avgDelay=(junctions.reduce((a,j)=>a+j.delay,0)/junctions.length).toFixed(1);
  const sensorFails=junctions.filter(j=>Object.values(j.sensorStatus).some(s=>s==="Failed")).length;
  const critAlerts=alerts.filter(a=>a.severity==="CRITICAL").length;
  const systemHealth=100-Math.round((congested/junctions.length)*30+sensorFails*5);
  const dotColor={Red:"#B03030",Yellow:"#C97D10",Green:"#1A7F4B",Blue:"#1A56A8"};
  const statusLabel={Green:"NORMAL",Yellow:"MODERATE",Red:"CONGESTED",Blue:"EMERGENCY"};
  const junctionById=useMemo(()=>Object.fromEntries(junctions.map(j=>[j.id,j])),[junctions]);
  const schematicNodes=useMemo(()=>[
    {id:"J-004",x:150,y:205,label:"Vadapalani Junction"},
    {id:"J-001",x:325,y:120,label:"Anna Salai"},
    {id:"J-002",x:490,y:120,label:"Koyambedu Interchange"},
    {id:"J-007",x:325,y:205,label:"Egmore"},
    {id:"J-003",x:490,y:205,label:"T. Nagar"},
    {id:"J-005",x:645,y:205,label:"Guindy Industrial"},
    {id:"J-006",x:325,y:305,label:"Adyar Signal"},
    {id:"J-008",x:645,y:305,label:"Tambaram Bypass"},
  ].map(node=>({...node,j:junctionById[node.id]})).filter(node=>node.j),[junctionById]);
  const schematicLinks=[
    ["J-004","J-001"],
    ["J-001","J-002"],
    ["J-001","J-007"],
    ["J-002","J-003"],
    ["J-007","J-003"],
    ["J-003","J-005"],
    ["J-005","J-008"],
    ["J-004","J-006"],
  ];
  const selectedSchematicNode=selJ?schematicNodes.find(node=>node.id===selJ.id):null;

  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header">
          <h1>⬡ Command Centre
            <span style={{width:10,height:10,borderRadius:"50%",background:"var(--green)",display:"inline-block",boxShadow:"0 0 8px var(--green)",animation:"blink 2s infinite"}}/>
          </h1>
          <div className="accent-rule"/>
          <p>// REAL-TIME OVERVIEW · GREATER CHENNAI METROPOLITAN NETWORK · <LiveDate/></p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={()=>onNav("map")}>OPEN MAP →</button>
          <button className="btn btn-red btn-sm" onClick={()=>onNav("emergency")}>⚠ EMERGENCY</button>
        </div>
      </div>

      {/* 6 KPI Cards - Optimized Layout */}
      <div className="kpi-strip" style={{marginBottom:14}}>
        {[
          {label:"Active Junctions",val:junctions.length,delta:"All operational",accent:"#1A7F4B",ico:"⬡"},
          {label:"Congested",val:congested,delta:"High density",accent:"#B03030",ico:"🔴"},
          {label:"Critical Alerts",val:critAlerts,delta:"Require action",accent:"#B03030",ico:"⚠"},
          {label:"Avg Density",val:`${avgDensity}%`,delta:"Network avg",accent:"#0077CC",ico:"▦"},
          {label:"System Health",val:`${systemHealth}%`,delta:"AI ready",accent:"#1A7F4B",ico:"♡"},
          {label:"Avg Wait Time",val:`${avgDelay}m`,delta:"vs baseline",accent:"#C97D10",ico:"⏱"},
        ].map(k=>(
          <div key={k.label} className="kpi-card" style={{"--kpi-accent":k.accent}}>
            <div className="kpi-ico" style={{fontSize:16}}>{k.ico}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{color:k.accent,fontSize:22}}>{k.val}</div>
            <div className="kpi-delta">{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Active Alerts Banner */}
      {critAlerts>0&&(
        <div className="alert alert-e" style={{marginBottom:12}}>
          ⚠ {critAlerts} CRITICAL ALERT{critAlerts>1?"S":""} ACTIVE — Immediate authority review required
        </div>
      )}

      <div className="g13" style={{marginBottom:12}}>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Network Schematic - Greater Chennai</div>
            <div style={{display:"flex",gap:10,fontSize:8,fontFamily:"var(--mono)",flexWrap:"wrap"}}>
              {[["#1A7F4B","NORMAL"],["#C97D10","MODERATE"],["#B03030","CONGESTED"]].map(([c,l])=>(
                <span key={l} style={{color:c,fontWeight:"700"}}>{l}</span>
              ))}
            </div>
          </div>
          <div style={{padding:12,background:"linear-gradient(180deg,var(--bg1),var(--bg2))"}}>
            <div style={{border:"1px solid var(--border)",borderRadius:8,background:"linear-gradient(180deg,rgba(255,255,255,0.04),rgba(15,23,42,0.02))",padding:"16px 18px 12px",position:"relative",minHeight:430}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:8}}>
                <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--amber)",letterSpacing:".18em",textTransform:"uppercase",fontWeight:700}}>. Chennai Traffic Spine</div>
                <div style={{display:"flex",gap:12,fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)"}}>
                  <span style={{color:"#1A7F4B"}}>● Low</span>
                  <span style={{color:"#C97D10"}}>● Med</span>
                  <span style={{color:"#B03030"}}>● High</span>
                </div>
              </div>
              <svg viewBox="0 0 760 360" style={{width:"100%",height:"auto",display:"block"}}>
                {[140,290,440,590].map(x=>(
                  <line key={`vx-${x}`} x1={x} y1="28" x2={x} y2="328" stroke="var(--border)" strokeWidth="1"/>
                ))}
                {[80,170,260,338].map(y=>(
                  <line key={`hy-${y}`} x1="40" y1={y} x2="700" y2={y} stroke="var(--borderFaint)" strokeWidth="1"/>
                ))}
                <text x="2" y="138" fill="var(--text3)" fontSize="11" fontFamily="var(--mono)">ECR</text>
                <text x="2" y="218" fill="var(--text3)" fontSize="11" fontFamily="var(--mono)">NH-32</text>
                <text x="2" y="286" fill="var(--text3)" fontSize="11" fontFamily="var(--mono)">OMR</text>
                {schematicLinks.map(([fromId,toId])=>{
                  const from=schematicNodes.find(node=>node.id===fromId);
                  const to=schematicNodes.find(node=>node.id===toId);
                  if(!from||!to) return null;
                  return <line key={`${fromId}-${toId}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#CDD5E1" strokeWidth="6" strokeLinecap="round"/>;
                })}
                {schematicNodes.map(node=>{
                  const levelColor=dotColor[node.j.congestion]||"#1A7F4B";
                  const isSelected=selectedSchematicNode?.id===node.id;
                  return(
                    <g key={node.id} onClick={()=>setSelJ(node.j)} style={{cursor:"pointer"}}>
                      {(node.j.congestion==="Red"||isSelected)&&<circle cx={node.x} cy={node.y} r="22" fill={levelColor} opacity="0.16"/>}
                      <circle cx={node.x} cy={node.y} r="8.5" fill={levelColor}/>
                      <circle cx={node.x} cy={node.y} r="13" fill="none" stroke={isSelected?"var(--amber)":"transparent"} strokeWidth="2.5"/>
                      <text x={node.x} y={node.y+22} textAnchor="middle" fill="var(--text2)" fontSize="11" fontFamily="var(--mono)">{node.label}</text>
                    </g>
                  );
                })}
              </svg>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:10,marginTop:10}}>
                {[
                  {label:"Reading Rule",value:"Follow the connected lines as the main traffic movement path."},
                  {label:"Node Meaning",value:"Each colored node is one live junction in the control network."},
                  {label:"Authority Use",value:"Click a node to inspect signals, density, delay, and police coverage."},
                ].map(item=>(
                  <div key={item.label} style={{borderTop:"1px solid var(--border)",paddingTop:8}}>
                    <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--amber)",letterSpacing:".12em",textTransform:"uppercase",fontWeight:700}}>{item.label}</div>
                    <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.5,marginTop:4}}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Junction Detail Panel */}
        <div className="panel">
          <div className="panel-head" style={{flexDirection:"column",gap:8,alignItems:"stretch"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div className="panel-title">{selJ?`Junction Detail — ${selJ.id}`:"All Junctions"}</div>
              {selJ&&<button className="btn btn-ghost btn-sm" onClick={()=>{setSelJ(null);setDashboardSearch("");}}>✕ CLOSE</button>}
            </div>
            {!selJ&&(
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",fontSize:11,color:"var(--text3)",pointerEvents:"none"}}>⌕</span>
                <input
                  type="text"
                  placeholder="Search by ID, Name, Zone, Region…"
                  value={dashboardSearch}
                  onChange={e=>setDashboardSearch(e.target.value)}
                  style={{width:"100%",padding:"7px 10px 7px 28px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:4,fontFamily:"var(--mono)",fontSize:10,color:"var(--text0)",outline:"none"}}
                  onFocus={e=>e.target.style.borderColor="var(--amber)"}
                  onBlur={e=>e.target.style.borderColor="var(--border)"}
                />
              </div>
            )}
          </div>
          <div style={{padding:10,maxHeight:420,overflowY:"auto"}}>
            {!selJ?(
              <>
                {filteredJunctions.length===0&&(
                  <div style={{padding:"16px 8px",textAlign:"center",fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)"}}>
                    No junctions match "{dashboardSearch}"
                  </div>
                )}
                <div className="jlist">
                {filteredJunctions.map(j=>(
                  <div key={j.id} className={`jrow${selJ?.id===j.id?" active-j":""}`} onClick={()=>setSelJ(j)}>
                    <SdotFor c={j.congestion}/>
                    <span className="jrow-id">{j.id}</span>
                    <span className="jrow-name">{j.name}</span>
                    <DBar value={j.density}/>
                  </div>
                ))}
                </div>
              </>
            ):(
              <div>

                <div style={{fontFamily:"var(--mono)",fontSize:11,fontWeight:700,color:"var(--text0)",marginBottom:10}}>{selJ.name}</div>
                <div style={{marginBottom:12}}>
                  {[
                    ["Junction ID",selJ.id],
                    ["Zone",selJ.zone],
                    ["Region",selJ.region],
                    ["Police Station",selJ.policeStation],
                    ["Status",<span className={badgeClass(selJ.congestion)}>{selJ.congestion}</span>],
                    ["Signal Phase",<span className={badgeClass(selJ.phase)}>{selJ.phase}</span>],
                    ["Priority",<span className={badgeClass(selJ.priority)}>{selJ.priority}</span>],
                    ["Vehicles",`${selJ.vehicles} now`],
                    ["Avg Delay",`${selJ.delay} min`],
                    ["Emergency Ready",selJ.emergencyReady?"YES":"NO"],
                  ].map(([k,v],i)=>(
                    <div key={i} className="detail-row">
                      <span className="detail-key">{k}</span>
                      <span className="detail-val">{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{marginBottom:10}}>
                  <div className="detail-key" style={{marginBottom:6}}>Density</div>
                  <DBar value={selJ.density}/>
                </div>
                <div style={{marginBottom:10}}>
                  <div className="detail-key" style={{marginBottom:6}}>Sensor Status</div>
                  {Object.entries(selJ.sensorStatus).map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",textTransform:"uppercase"}}>{k}</span>
                      <span className={badgeClass(v)}>{v}</span>
                    </div>
                  ))}
                </div>
                <button className="btn btn-amber" style={{width:"100%",justifyContent:"center",fontSize:9}} onClick={()=>onNav("junction")}>OPEN CONTROL PANEL →</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">Recent System Events</div>
          <button className="btn btn-ghost btn-sm" onClick={()=>onNav("history")}>VIEW ALL →</button>
        </div>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th>Time</th><th>Type</th><th>Junction</th><th className="hide-mob">Details</th><th>Status</th></tr></thead>
            <tbody>
              {events.slice(0,5).map(l=>(
                <tr key={l.id}>
                  <td className="mono-cell">{l.time}</td>
                  <td><span className="badge badge-b">{l.type}</span></td>
                  <td style={{fontSize:12,color:"var(--text0)"}}>{l.junction}</td>
                  <td className="mono-cell hide-mob">{l.details}</td>
                  <td><span className={badgeClass(l.status)}>{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LIVE MAP PAGE (Leaflet)
══════════════════════════════════════════════════════════════ */
let leafletLoader;
function MapPage({junctions=JUNCTIONS}){
  const mapRef=useRef(null);const leafletMap=useRef(null);
  const [loaded,setLoaded]=useState(false);const [err,setErr]=useState(false);
  const [selJ,setSelJ]=useState(null);
  const [filter,setFilter]=useState("All");
  const [mapSearch,setMapSearch]=useState("");
  const getMapCongestion=useCallback((junction)=>getDensityCongestion(junction?.density??0),[]);

  const initMap=useCallback((L)=>{
    if(leafletMap.current||!mapRef.current||!L) return;
    const map=L.map(mapRef.current,{center:[13.02,80.21],zoom:11});
    leafletMap.current=map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'© OSM Contributors',maxZoom:18}).addTo(map);
    const color={Red:"#B03030",Yellow:"#C97D10",Green:"#1A7F4B",Blue:"#1A56A8"};
    junctions.forEach(j=>{
      const congestion=getMapCongestion(j);
      const c=color[congestion]||color.Green;
      const icon=L.divIcon({className:"",html:`<div style="width:14px;height:14px;border-radius:50%;background:${c};border:2px solid #fff;box-shadow:0 0 10px ${c};position:relative;"><div style="position:absolute;inset:-4px;border-radius:50%;background:${c};opacity:0.2;animation:pulse-ring 2s infinite;"></div></div>`,iconSize:[14,14],iconAnchor:[7,7]});
      L.marker([j.lat,j.lng],{icon}).addTo(map)
        .bindPopup(`<div style="font-family:'JetBrains Mono',monospace;font-size:11px;"><b style="font-size:13px;color:#0F172A;">${j.name}</b><br/><span style="color:#64748B;">${j.id} · ${j.zone}</span><br/><span style="color:${c};font-weight:700;">${j.congestion} · ${j.density}%</span><br/><span>Vehicles: ${j.vehicles} · Delay: ${j.delay}m</span></div>`)
        .on("click",()=>setSelJ(j));
    });
    setLoaded(true);
  },[junctions,getMapCongestion]);

  useEffect(()=>{
    let c=false;
    const go=async()=>{try{if(!leafletLoader)leafletLoader=import("leaflet");const mod=await leafletLoader;if(!c)initMap(mod.default??mod);}catch{if(!c)setErr(true);}};
    go();
    return()=>{c=true;if(leafletMap.current){leafletMap.current.remove();leafletMap.current=null;}};
  },[initMap]);

  const filtered=filter==="All"?junctions:junctions.filter(j=>getMapCongestion(j)===filter);

  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header"><h1>◈ Live City Map</h1><div className="accent-rule"/><p>// INTERACTIVE GIS MAP · REAL-TIME JUNCTION STATUS · CLICK MARKERS FOR DETAILS</p></div>
        <div className="page-actions" style={{display:"flex",gap:8,alignItems:"center"}}>
          {["All","Green","Yellow","Red"].map(f=>(
            <button key={f} className={`btn ${filter===f?"btn-amber":"btn-ghost"}`} onClick={()=>setFilter(f)}>{f}</button>
          ))}
          <JunctionSearchBar junctions={junctions} searchTerm={mapSearch} setSearchTerm={setMapSearch} onSelect={(j)=>setSelJ(j)} />
        </div>
      </div>
      <div className="g13" style={{minHeight:"calc(100vh - 150px)"}}>
        <div className="panel" style={{display:"flex",flexDirection:"column"}}>
          <div className="panel-head">
            <div className="panel-title">Chennai Network — Live GIS View</div>
            <div style={{display:"flex",gap:12,fontSize:9,fontFamily:"var(--mono)"}}>
              {[["#1A7F4B","🟢 Normal"],["#C97D10","🟡 Moderate"],["#B03030","🔴 Congested"]].map(([c,l])=>(
                <span key={l} style={{color:c,display:"flex",alignItems:"center",gap:4,fontWeight:"700"}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block",boxShadow:`0 0 4px ${c}`}}/>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div style={{padding:10,position:"relative",flex:1,minHeight:450}}>
            <div ref={mapRef} id="traffix-map" style={{height:"100%",minHeight:430,borderRadius:4}}/>
            {!loaded&&!err&&<div style={{position:"absolute",inset:10,display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg2)",borderRadius:4,fontFamily:"var(--mono)",fontSize:11,color:"var(--text2)"}}>LOADING MAP…</div>}
            {err&&<div style={{position:"absolute",inset:10,display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg2)",borderRadius:4,fontFamily:"var(--mono)",fontSize:11,color:"var(--red)"}}>⚠ MAP SERVICE UNAVAILABLE — Using static schematic</div>}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div className="panel" style={{flex:1}}>
            <div className="panel-head"><div className="panel-title">Junction Status ({filter})</div></div>
            <div style={{padding:8,maxHeight:320,overflowY:"auto"}}>
              {filtered.map(j=>(
                <div key={j.id} style={{marginBottom:8,cursor:"pointer"}} onClick={()=>setSelJ(j)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <div>
                      <span className="mono-cell" style={{fontSize:8}}>{j.id}</span>
                      <div style={{fontSize:11.5,fontWeight:500,color:"var(--text0)",marginTop:1,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.name}</div>
                    </div>
                    <SdotFor c={getMapCongestion(j)}/>
                  </div>
                  <DBar value={j.density}/>
                </div>
              ))}
            </div>
          </div>
          {selJ&&(
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">{selJ.id} Details</div>
                <button className="btn btn-ghost btn-sm" onClick={()=>setSelJ(null)}>✕</button>
              </div>
              <div style={{padding:12}}>
                <div style={{fontFamily:"var(--mono)",fontSize:11,fontWeight:700,color:"var(--text0)",marginBottom:8}}>{selJ.name}</div>
                {[["Zone",selJ.zone],["Region",selJ.region],["Vehicles",selJ.vehicles],["Density",`${selJ.density}%`],["Delay",`${selJ.delay}m`]].map(([k,v])=>(
                  <div key={k} className="detail-row"><span className="detail-key">{k}</span><span className="detail-val">{v}</span></div>
                ))}
                <div style={{marginTop:8,display:"flex",gap:6}}>
                  <span className={badgeClass(getMapCongestion(selJ))}>{getMapCongestion(selJ)}</span>
                  <span className={badgeClass(selJ.priority)}>{selJ.priority}</span>
                  {selJ.emergencyReady&&<span className="badge badge-g">EMG READY</span>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   JUNCTION CONTROL PANEL
══════════════════════════════════════════════════════════════ */
function JunctionControl({junctions=JUNCTIONS,phases,setPhases,emergencyState,alerts,role,userId,controlGrant}){
  const [sel,setSel]=useState(0);
  const [timings,setTimings]=useState(junctions.map(()=>({green:45,yellow:5,red:40})));
  const [saved,setSaved]=useState(false);
  const [jcSearch,setJcSearch]=useState("");
  const j=junctions[sel];
  const emergencyActive=Boolean(emergencyState.activeCorridor||emergencyState.disasterMode);

  // Filter junctions in the signal grid by search
  const filteredJc=useMemo(()=>{
    const q=jcSearch.trim().toLowerCase();
    if(!q) return junctions;
    return junctions.filter(jj=>
      jj.id.toLowerCase().includes(q)||
      jj.name.toLowerCase().includes(q)||
      jj.zone.toLowerCase().includes(q)
    );
  },[junctions,jcSearch]);
  const selectedCritical=Boolean(j&&(j.priority==="Critical"||j.density>=85||j.congestion==="Red"));
  const canEditTiming=role==="Super Administrator"&&(emergencyActive||selectedCritical);
  const canCycleSignal=canEditTiming||(Boolean(controlGrant)&&emergencyActive);

  useEffect(()=>{
    const id=setInterval(()=>{
      setPhases(prev=>prev.map((phase,i)=>{
        if(emergencyState.disasterMode==="all-red") return "Red";
        if(emergencyState.disasterMode==="arterial-flush") return "Green";
        if(emergencyState.affectedNodes.includes(junctions[i]?.id)) return "Green";
        return Math.random()>.85?(phase==="Green"?"Yellow":phase==="Yellow"?"Red":"Green"):phase;
      }));
    },4500);
    return()=>clearInterval(id);
  },[junctions,emergencyState,setPhases]);

  const cycle=(i,e)=>{
    e.stopPropagation();
    if(!canCycleSignal||emergencyState.disasterMode||emergencyState.affectedNodes.includes(junctions[i]?.id)) return;
    setPhases(p=>{const n=[...p];n[i]=n[i]==="Green"?"Yellow":n[i]==="Yellow"?"Red":"Green";return n;});
  };

  const ph=emergencyState.disasterMode==="all-red"?"Red":emergencyState.disasterMode==="arterial-flush"||emergencyState.affectedNodes.includes(j?.id)?"Green":phases[sel];

  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header"><h1>◉ Junction Control</h1><div className="accent-rule"/><p>// AI ADAPTIVE SIGNAL MANAGEMENT · MANUAL OVERRIDES PERMANENTLY LOGGED</p></div>
        <div className="page-actions" style={{alignItems:"center",gap:8}}>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",fontSize:12,color:"var(--text3)",pointerEvents:"none"}}>⌕</span>
            <input
              type="text"
              placeholder="Search junction ID, name…"
              value={jcSearch}
              onChange={e=>setJcSearch(e.target.value)}
              style={{padding:"7px 10px 7px 28px",background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:4,fontFamily:"var(--mono)",fontSize:10,color:"var(--text0)",outline:"none",width:220}}
              onFocus={e=>e.target.style.borderColor="var(--amber)"}
              onBlur={e=>e.target.style.borderColor="var(--border)"}
            />
          </div>
          {jcSearch&&<span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)"}}>{filteredJc.length}/{junctions.length} junctions</span>}
          {jcSearch&&<button className="btn btn-ghost btn-sm" onClick={()=>setJcSearch("")}>✕ CLEAR</button>}
        </div>
      </div>
      <div className="alert alert-i">ℹ Signals run in automatic mode by default. Manual timing changes are reserved for Super Administrator during critical or emergency situations. Delegated lower-role users can only cycle a signal while an active emergency is in progress.</div>
      {emergencyState.activeCorridor&&<div className="alert alert-e">⚠ EMERGENCY OVERRIDE ACTIVE: Corridor {emergencyState.activeCorridor}</div>}
      {emergencyState.disasterMode==="all-red"&&<div className="alert alert-e">⚠ DISASTER: ALL JUNCTIONS FORCED RED</div>}
      {emergencyState.disasterMode==="arterial-flush"&&<div className="alert alert-w">⚠ ARTERIAL FLUSH: ALL JUNCTIONS FORCED GREEN</div>}
      {!canCycleSignal&&<div className="alert alert-w">Manual control locked for {userId||"current user"}. The AI controller remains active until a Super Administrator authorizes emergency intervention.</div>}
      {alerts.slice(0,2).map(a=>(
        <div key={a.id} className={`alert ${a.severity==="CRITICAL"?"alert-e":"alert-w"}`}>{a.message}</div>
      ))}
      {filteredJc.length===0&&(
        <div style={{padding:"20px",textAlign:"center",fontFamily:"var(--mono)",fontSize:11,color:"var(--text3)",background:"var(--bg2)",borderRadius:6,marginBottom:12}}>
          No junctions match "{jcSearch}" — <button className="btn btn-ghost btn-sm" onClick={()=>setJcSearch("")}>Clear search</button>
        </div>
      )}
      <div className="signal-grid">
        {filteredJc.map((jj,_filtIdx)=>{
          const i=junctions.indexOf(jj);
          const p=emergencyState.disasterMode==="all-red"?"Red":emergencyState.disasterMode==="arterial-flush"||emergencyState.affectedNodes.includes(jj.id)?"Green":phases[i];
          const bc=congestColor(p);
          const hasAlert=Object.values(jj.sensorStatus).some(s=>s!=="Healthy");
          return(
            <div key={jj.id} className={`sig-card${sel===i?" sel":""}`} style={{borderTopColor:bc}} onClick={()=>setSel(i)}>
              {hasAlert&&<div style={{position:"absolute",top:6,right:6,width:8,height:8,background:"var(--amber)",borderRadius:"50%",boxShadow:"0 0 6px var(--amber)"}}/>}
              <div className="tlight" style={{margin:"0 auto 8px"}}>
                <div className={`tb tb-r${p==="Red"?" on":""}`}/><div className={`tb tb-y${p==="Yellow"?" on":""}`}/><div className={`tb tb-g${p==="Green"?" on":""}`}/>
              </div>
              <div className="sig-id">{jj.id}</div>
              <div className="sig-label">{jj.name.split("–")[0].trim()}</div>
              <div style={{marginTop:6,display:"flex",flexDirection:"column",gap:4,alignItems:"center"}}>
                <span className={badgeClass(p)}>{p}</span>
                <span style={{fontFamily:"var(--mono)",fontSize:8,color:"var(--text3)"}}>{jj.density}% · {jj.vehicles}v</span>
                {(emergencyState.affectedNodes.includes(jj.id)||emergencyState.disasterMode)&&<span style={{fontSize:8,color:"var(--red)",fontFamily:"var(--mono)",fontWeight:700}}>FORCED</span>}
                <button className="btn btn-ghost btn-sm" style={{fontSize:8}} onClick={e=>cycle(i,e)} disabled={!canCycleSignal||Boolean(emergencyState.disasterMode)||emergencyState.affectedNodes.includes(jj.id)}>↻ CYCLE</button>
              </div>
            </div>
          );
        })}
      </div>
      {j&&(
        <div className="g2">
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">Timing Editor — {j.name}</div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                {saved&&<span className="badge badge-g">✓ SAVED</span>}
                <button className="btn btn-amber" onClick={()=>{if(!canEditTiming) return;setSaved(true);setTimeout(()=>setSaved(false),2500);}} disabled={!canEditTiming}>SAVE</button>
                <button className="btn btn-ghost" onClick={()=>setTimings(prev=>prev.map((item,idx)=>idx===sel?{green:45,yellow:5,red:40}:item))} disabled={!canEditTiming}>↺ AI DEFAULT</button>
              </div>
            </div>
            <div className="panel-body">
              <div className="g3">
                {[["green","#1A7F4B"],["yellow","#C97D10"],["red","#B03030"]].map(([k,c])=>(
                  <div key={k}>
                    <div className="field" style={{marginBottom:6}}>
                      <label style={{color:c}}>{k.toUpperCase()} PHASE</label>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <input type="range" min={5} max={90} value={(timings[sel])?.[k]??30} disabled={!canEditTiming||Boolean(emergencyState.disasterMode)||emergencyState.affectedNodes.includes(j?.id)} onChange={e=>{const n=[...timings];(n[sel])[k]=+e.target.value;setTimings(n);}}/>
                        <span style={{fontFamily:"var(--mono)",fontSize:14,fontWeight:700,color:c,minWidth:36,textAlign:"right"}}>{(timings[sel])?.[k]??30}s</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="alert alert-ok" style={{marginTop:8,marginBottom:0}}>
                {canEditTiming
                  ? `✓ Emergency timing editor unlocked. TOTAL CYCLE: ${((timings[sel])?.green??0)+((timings[sel])?.yellow??0)+((timings[sel])?.red??0)}s · GREEN RATIO: ${Math.round((((timings[sel])?.green??0)/Math.max(1,((timings[sel])?.green??0)+((timings[sel])?.yellow??0)+((timings[sel])?.red??0)))*100)}%`
                  : "✓ Adaptive cycle guardrails active. AI resumes and maintains default signal timing outside critical or emergency conditions."}
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><div className="panel-title">{j.id} — Lane Status</div></div>
            <div className="panel-body">
              {["North","East","South","West"].map((dir,i)=>{
                const lDensity=j.density+Math.round((Math.random()-0.5)*15);
                const lPhase=i%2===0?(ph==="Green"?"Green":"Red"):ph;
                return(
                  <div key={dir} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid var(--borderFaint)"}}>
                    <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--text2)",minWidth:60}}>{dir}</span>
                    <DBar value={Math.max(10,Math.min(99,lDensity))}/>
                    <span className={badgeClass(lPhase)} style={{marginLeft:8}}>{lPhase}</span>
                  </div>
                );
              })}
              <div style={{marginTop:10,padding:"8px 10px",background:"var(--amberBg)",borderRadius:4,border:"1px solid rgba(201,125,16,0.2)"}}>
                <div style={{fontFamily:"var(--mono)",fontSize:8.5,color:"var(--amber)",fontWeight:700,marginBottom:3}}>AI RECOMMENDATION</div>
                <div style={{fontSize:11,color:"var(--text2)"}}>
                  {j.density>75?"Extend N-S green phase +12s. Suppress right-turn overlap.":j.density>50?"Hold current cycle. Monitor inflow from east corridor.":"Maintain adaptive cycle. Off-peak compression active."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LSTM AI PREDICTION ENGINE
══════════════════════════════════════════════════════════════ */
function LSTMPredictions({junctions=JUNCTIONS}){
  const [selJ,setSelJ]=useState(junctions[0]);
  const [loading,setLoading]=useState(false);
  const [pred,setPred]=useState(null);
  const [chartData,setChartData]=useState([]);
  const [lstmSearch,setLstmSearch]=useState("");

  // Filter junctions by search term
  const filteredLstm=useMemo(()=>{
    const q=lstmSearch.trim().toLowerCase();
    if(!q) return junctions;
    return junctions.filter(j=>
      j.id.toLowerCase().includes(q)||
      j.name.toLowerCase().includes(q)||
      j.zone.toLowerCase().includes(q)
    );
  },[junctions,lstmSearch]);

  const horizons=[
    {label:"5 MIN",key:"5m",color:"#1A7F4B"},
    {label:"15 MIN",key:"15m",color:"#0077CC"},
    {label:"30 MIN",key:"30m",color:"#C97D10"},
    {label:"1 HOUR",key:"1h",color:"#B03030"},
  ];

  const generatePrediction=useCallback((j)=>{
    setLoading(true);
    const fetchPredictions=async()=>{
      try{
        const response=await fetch('/api/lstm/predict',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({junction_id:j.id,current_density:j.density,vehicle_count:j.vehicles,hour:new Date().getHours()})
        });
        if(!response.ok) throw new Error('API error');
        const data=await response.json();
        const newPred={
          "5m":{density:Math.min(99,data.predictions[0]||j.density+Math.random()*5),prob:Math.round(Math.random()*100),queue:Math.round(j.density*0.4),signal:data.signals?.[0]||"Maintain current",waitTime:Math.round(j.density*0.8),confidence:0.92},
          "15m":{density:Math.min(99,data.predictions[1]||j.density+Math.random()*8),prob:Math.round(Math.random()*100),queue:Math.round(j.density*0.42),signal:data.signals?.[1]||"Extend green",waitTime:Math.round(j.density*0.85),confidence:0.87},
          "30m":{density:Math.min(99,data.predictions[2]||j.density+Math.random()*12),prob:Math.round(Math.random()*100),queue:Math.round(j.density*0.45),signal:data.signals?.[2]||"Peak mode",waitTime:Math.round(j.density*0.9),confidence:0.81},
          "1h":{density:Math.min(99,data.predictions[3]||j.density+Math.random()*15),prob:Math.round(Math.random()*100),queue:Math.round(j.density*0.5),signal:data.signals?.[3]||"Flow optimize",waitTime:Math.round(j.density*0.95),confidence:0.73},
        };
        setPred(newPred);
        const cd=[];
        for(let i=0;i<=60;i+=5){
          const t=i<=5?newPred["5m"]:i<=15?newPred["15m"]:i<=30?newPred["30m"]:newPred["1h"];
          cd.push({min:i,density:t.density,prob:t.prob,waitTime:t.waitTime});
        }
        setChartData(cd);
      }catch(e){
        console.log('Using fallback predictions');
        const base=j.density;
        const newPred={
          "5m":{density:Math.min(99,base+Math.round(Math.random()*6-2)),prob:Math.round(base/100*85+Math.random()*10),queue:Math.round(base*0.4),signal:"Maintain current",waitTime:Math.round(base*0.8),confidence:0.94},
          "15m":{density:Math.min(99,base+Math.round(Math.random()*10-3)),prob:Math.round(base/100*75+Math.random()*15),queue:Math.round(base*0.42),signal:"Extend green +8s",waitTime:Math.round(base*0.85),confidence:0.88},
          "30m":{density:Math.min(99,base+Math.round(Math.random()*16-5)),prob:Math.round(base/100*65+Math.random()*20),queue:Math.round(base*0.45),signal:"Switch to peak",waitTime:Math.round(base*0.9),confidence:0.82},
          "1h":{density:Math.min(99,base+Math.round(Math.random()*20-7)),prob:Math.round(base/100*55+Math.random()*25),queue:Math.round(base*0.5),signal:"Flow optimize",waitTime:Math.round(base*0.95),confidence:0.74},
        };
        setPred(newPred);
        const cd=[];
        for(let i=0;i<=60;i+=5){
          const t=i<=5?newPred["5m"]:i<=15?newPred["15m"]:i<=30?newPred["30m"]:newPred["1h"];
          cd.push({min:i,density:t.density,prob:t.prob,waitTime:t.waitTime});
        }
        setChartData(cd);
      }finally{
        setLoading(false);
      }
    };
    fetchPredictions();
  },[]);

  useEffect(()=>{generatePrediction(selJ);},[selJ,generatePrediction]);

  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header"><h1>⬠ LSTM AI Prediction Engine</h1><div className="accent-rule"/><p>// LONG SHORT-TERM MEMORY NETWORK · MULTI-HORIZON TRAFFIC FORECASTING · CONFIDENCE SCORES</p></div>
        <div className="page-actions">
          <button className="btn btn-amber" onClick={()=>generatePrediction(selJ)} disabled={loading}>{loading?"COMPUTING…":"↻ REFRESH PREDICTION"}</button>
        </div>
      </div>

      <div className="g2" style={{marginBottom:12}}>
        <div className="panel">
          <div className="panel-head" style={{flexDirection:"column",gap:8,alignItems:"stretch"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div className="panel-title">Select Junction</div>
              <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)"}}>
                {lstmSearch?`${filteredLstm.length}/${junctions.length} shown`:selJ?.id}
              </span>
            </div>
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",fontSize:11,color:"var(--text3)",pointerEvents:"none"}}>⌕</span>
              <input
                type="text"
                placeholder="Search by ID, Name or Zone…"
                value={lstmSearch}
                onChange={e=>setLstmSearch(e.target.value)}
                style={{width:"100%",padding:"6px 10px 6px 26px",border:"1px solid var(--border)",borderRadius:4,background:"var(--bg1)",color:"var(--text0)",fontSize:10,fontFamily:"var(--mono)",outline:"none"}}
                onFocus={e=>e.target.style.borderColor="var(--amber)"}
                onBlur={e=>e.target.style.borderColor="var(--border)"}
              />
            </div>
          </div>
          <div style={{padding:8,maxHeight:220,overflowY:"auto"}}>
            {filteredLstm.length===0&&(
              <div style={{padding:"12px",textAlign:"center",fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)"}}>
                No junctions match "{lstmSearch}"
              </div>
            )}
            {filteredLstm.map(j=>(
              <div key={j.id} className={`jrow${selJ?.id===j.id?" active-j":""}`} onClick={()=>setSelJ(j)}>
                <SdotFor c={j.congestion}/>
                <span className="jrow-id">{j.id}</span>
                <span className="jrow-name">{j.name}</span>
                <DBar value={j.density}/>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Model Inputs — {selJ?.id}</div></div>
          <div className="panel-body">
            <div className="g2">
              {[
                ["Vehicle Count",`${selJ?.vehicles} now`,"#0077CC"],
                ["Current Density",`${selJ?.density}%`,"#C97D10"],
                ["Avg Speed","28 km/h","#1A7F4B"],
                ["Lane Occupancy","62%","#6B35B8"],
                ["Temperature","33°C","#B03030"],
                ["Humidity","74%","#0077CC"],
                ["Time of Day","17:22 IST","#C97D10"],
                ["Day","Saturday","#1A7F4B"],
              ].map(([k,v,c])=>(
                <div key={k} className="sensor-card">
                  <div className="sensor-name">{k}</div>
                  <div className="sensor-val" style={{color:c,fontSize:16}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Horizons */}
      {pred&&(
        <>
          <div className="g4" style={{marginBottom:12}}>
            {horizons.map(h=>(
              <div key={h.key} className="pred-card" style={{"--pred-color":h.color}}>
                <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:h.color}}/>
                <div className="pred-horizon">{h.label} FORECAST</div>
                <div className="pred-density" style={{color:h.color}}>{pred[h.key].density}%</div>
                <div className="pred-conf">Density · Conf: {(pred[h.key].confidence*100).toFixed(0)}%</div>
                <div style={{margin:"6px 0"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span className="sensor-name">Congestion Prob</span>
                    <span style={{fontFamily:"var(--mono)",fontSize:11,fontWeight:700,color:h.color}}>{pred[h.key].prob}%</span>
                  </div>
                  <DBar value={pred[h.key].prob}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span className="sensor-name">Est. Queue</span>
                  <span style={{fontFamily:"var(--mono)",fontSize:11,color:h.color}}>{pred[h.key].queue} veh</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span className="sensor-name">Wait Time</span>
                  <span style={{fontFamily:"var(--mono)",fontSize:11,color:h.color}}>{pred[h.key].waitTime}s</span>
                </div>
                <div className="pred-recommend">{pred[h.key].signal}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="g2">
            <div className="panel">
              <div className="panel-head"><div className="panel-title">Predicted Density (0–60 min)</div></div>
              <div className="panel-body">
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={chartData} margin={{top:5,right:5,bottom:0,left:-20}}>
                    <defs>
                      <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0077CC" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0077CC" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--borderFaint)"/>
                    <XAxis dataKey="min" tick={{fontSize:8,fill:"var(--text3)",fontFamily:"JetBrains Mono"}} label={{value:"min",position:"insideRight",dx:10,fontSize:8,fill:"var(--text3)"}}/>
                    <YAxis tick={{fontSize:8,fill:"var(--text3)",fontFamily:"JetBrains Mono"}} domain={[0,100]}/>
                    <Tooltip content={<CT/>}/>
                    <Area type="monotone" dataKey="density" name="Density%" stroke="#0077CC" strokeWidth={2} fill="url(#predGrad)"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="panel">
              <div className="panel-head"><div className="panel-title">Congestion Probability (0–60 min)</div></div>
              <div className="panel-body">
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={chartData} margin={{top:5,right:5,bottom:0,left:-20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--borderFaint)"/>
                    <XAxis dataKey="min" tick={{fontSize:8,fill:"var(--text3)",fontFamily:"JetBrains Mono"}}/>
                    <YAxis tick={{fontSize:8,fill:"var(--text3)",fontFamily:"JetBrains Mono"}} domain={[0,100]}/>
                    <Tooltip content={<CT/>}/>
                    <Line type="monotone" dataKey="prob" name="Cong. Prob%" stroke="#B03030" strokeWidth={2} dot={false}/>
                    <Line type="monotone" dataKey="waitTime" name="Wait(s)" stroke="#C97D10" strokeWidth={1.5} strokeDasharray="4 2" dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
      {loading&&(
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:200,fontFamily:"var(--mono)",fontSize:12,color:"var(--text3)"}}>
          <span className="spin" style={{marginRight:10}}>◌</span>RUNNING LSTM INFERENCE…
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   WEATHER INTELLIGENCE
══════════════════════════════════════════════════════════════ */
function WeatherIntel({junctions=JUNCTIONS}){
  const weatherByJunction=useMemo(()=>junctions.map(buildJunctionWeather).sort((a,b)=>b.impact-a.impact),[junctions]);
  const [selectedJunctionId,setSelectedJunctionId]=useState(weatherByJunction[0]?.junctionId||junctions[0]?.id);
  useEffect(()=>{
    if(!weatherByJunction.some(item=>item.junctionId===selectedJunctionId)){
      setSelectedJunctionId(weatherByJunction[0]?.junctionId||junctions[0]?.id);
    }
  },[junctions,weatherByJunction,selectedJunctionId]);
  const weather=weatherByJunction.find(item=>item.junctionId===selectedJunctionId)||weatherByJunction[0];
  const impactColor=weather.impact>70?"#B03030":weather.impact>40?"#C97D10":"#1A7F4B";
  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header"><h1>☁ Weather Intelligence</h1><div className="accent-rule"/><p>// JUNCTION-SPECIFIC WEATHER · MICRO-IMPACT ANALYSIS · AI-POWERED REROUTING</p></div>
      </div>
      <div className="g31" style={{marginBottom:12}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div className="weather-card">
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div>
                <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>Current Conditions · {weather.junctionId}</div>
                <div className="weather-temp">{weather.temp}°C</div>
                <div className="weather-cond">{weather.condition}</div>
                <div style={{fontSize:11,color:"var(--text2)",marginTop:4}}>{weather.junctionName}</div>
              </div>
              <div style={{fontSize:48}}>🌤</div>
            </div>
            <div className="g2">
              {[["Humidity",`${weather.humidity}%`],["Visibility",`${weather.visibility} km`],["Wind Speed",`${weather.windSpeed} km/h`],["Rainfall",`${weather.rainfall} mm/hr`]].map(([k,v])=>(
                <div key={k} className="sensor-card">
                  <div className="sensor-name">{k}</div>
                  <div className="sensor-val" style={{fontSize:15}}>{v}</div>
                </div>
              ))}
            </div>
            <div className="weather-impact">
              ⚠ TRAFFIC IMPACT SCORE: <strong>{weather.impact}%</strong> — {weather.impact>70?"HIGH — Significant delays expected":weather.impact>40?"MODERATE — Minor signal adjustments needed":"LOW — Normal operations"}
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><div className="panel-title">AI Recommendations for {weather.junctionId}</div></div>
            <div className="panel-body">
              {weather.suggestions.map((s,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:"1px solid var(--borderFaint)"}}>
                  <span style={{color:"var(--green)",fontFamily:"var(--mono)",fontSize:10}}>✓</span>
                  <span style={{fontSize:12,color:"var(--text1)"}}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div className="panel">
            <div className="panel-head"><div className="panel-title">5-Hour Junction Forecast</div></div>
            <div className="panel-body">
              <ResponsiveContainer width="100%" height={170}>
                <AreaChart data={weather.forecast} margin={{top:5,right:5,bottom:0,left:-20}}>
                  <defs>
                    <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A56A8" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#1A56A8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="impactGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B03030" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#B03030" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--borderFaint)"/>
                  <XAxis dataKey="time" tick={{fontSize:8,fill:"var(--text3)",fontFamily:"JetBrains Mono"}}/>
                  <YAxis tick={{fontSize:8,fill:"var(--text3)",fontFamily:"JetBrains Mono"}} domain={[0,100]}/>
                  <Tooltip content={<CT/>}/>
                  <Area type="monotone" dataKey="rain" name="Rain%" stroke="#1A56A8" strokeWidth={2} fill="url(#rainGrad)"/>
                  <Area type="monotone" dataKey="impact" name="Impact%" stroke="#B03030" strokeWidth={1.5} fill="url(#impactGrad)"/>
                </AreaChart>
              </ResponsiveContainer>
              <div style={{display:"flex",gap:14,marginTop:6,fontFamily:"var(--mono)",fontSize:9}}>
                <span style={{color:"#1A56A8"}}>── Rain Probability</span>
                <span style={{color:"#B03030"}}>── Traffic Impact</span>
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><div className="panel-title">Weather Alerts</div></div>
            <div className="panel-body">
              {weather.alerts.length===0&&<div className="alert alert-ok">✓ No active weather hazards for this junction. AI remains in normal adaptive mode.</div>}
              {weather.alerts.map(a=>(
                <div key={a.id} className={`alert ${a.severity==="HIGH"?"alert-e":"alert-w"}`} style={{marginBottom:8}}>
                  <div>
                    <div style={{fontWeight:700,marginBottom:3}}>[{a.type}] {a.severity}</div>
                    <div style={{fontSize:10,lineHeight:1.5}}>{a.message}</div>
                    <div style={{marginTop:4,fontSize:9,opacity:0.8}}>Affected: {a.affected.join(", ")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><div className="panel-title">Junction Weather Queue</div></div>
            <div className="panel-body">
              <div className="jlist">
                {weatherByJunction.map(item=>(
                  <button key={item.junctionId} className={`jrow ${selectedJunctionId===item.junctionId?"active-j":""}`} onClick={()=>setSelectedJunctionId(item.junctionId)} style={{width:"100%",background:"none"}}>
                    <SdotFor c={item.impact>70?"Red":item.impact>40?"Yellow":"Green"}/>
                    <div className="jrow-id">{item.junctionId}</div>
                    <div className="jrow-name">{item.junctionName}</div>
                    <span className={badgeClass(item.impact>70?"Critical":item.impact>40?"High":"Low")}>{item.impact}%</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EMERGENCY OPERATIONS
══════════════════════════════════════════════════════════════ */
function EmergencyOps({role,junctions=JUNCTIONS,emergencyState,setEmergencyState,alerts,controlGrant}){
  const can=role==="Emergency Operations Controller"||role==="Super Administrator";
  const [activeVehicles]=useState([
    {id:"AMB-TN-5012",type:"Ambulance",reg:"TN-01-AB-5012",currentJunction:"J-005",destJunction:"J-001",eta:8,status:"ACTIVE",corridor:"Guindy → Anna Salai",signal:"GREEN_WAVE"},
    {id:"FIRE-TN-207",type:"Fire Engine",reg:"TN-22-F-0207",currentJunction:"J-002",destJunction:"J-007",eta:12,status:"STANDBY",corridor:"Koyambedu → Egmore",signal:"PENDING"},
  ]);
  const corridors=[
    {id:"CORR-01",name:"Hospital Priority Alpha",route:["J-005","J-004","J-001"],status:"Active",type:"Medical",etaBefore:14,etaAfter:9,timeSaved:5,confidence:0.94},
    {id:"CORR-02",name:"Fire Dept Response Beta",route:["J-002","J-007"],status:"Standby",type:"Fire",etaBefore:16,etaAfter:11,timeSaved:5,confidence:0.89},
    {id:"CORR-03",name:"Police Convoy Route",route:["J-009","J-007","J-001"],status:"Ready",type:"Police",etaBefore:20,etaAfter:13,timeSaved:7,confidence:0.91},
    {id:"CORR-04",name:"Evacuation Sigma Protocol",route:["All Network"],status:"Disabled",type:"Civil",etaBefore:"-",etaAfter:"-",timeSaved:"-",confidence:0},
  ];
  const autoCorridor=useMemo(()=>{
    const activeVehicle=activeVehicles.find(vehicle=>vehicle.status==="ACTIVE");
    if(!activeVehicle) return null;
    return corridors.find(c=>c.route.includes(activeVehicle.currentJunction)&&c.route.includes(activeVehicle.destJunction))||corridors[0];
  },[activeVehicles]);
  useEffect(()=>{
    if(emergencyState.disasterMode) return;
    const nextId=autoCorridor?.id||null;
    const nextNodes=autoCorridor?(autoCorridor.route.includes("All Network")?junctions.map(j=>j.id):autoCorridor.route):[];
    setEmergencyState(prev=>{
      if(prev.disasterMode) return prev;
      if(prev.activeCorridor===nextId&&prev.affectedNodes.join("|")===nextNodes.join("|")) return prev;
      return {activeCorridor:nextId,affectedNodes:nextNodes,disasterMode:null};
    });
  },[autoCorridor,emergencyState.disasterMode,junctions,setEmergencyState]);
  const disaster=(mode)=>setEmergencyState({activeCorridor:null,affectedNodes:junctions.map(j=>j.id),disasterMode:mode});

  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header">
          <h1 style={{color:"var(--red)"}}>⚠ Emergency Operations</h1>
          <div className="accent-rule" style={{background:"linear-gradient(90deg,var(--red),transparent)"}}/>
          <p>// AUTO-RUN EMERGENCY ORCHESTRATION · VEHICLE DETECTION · GREEN CORRIDOR COORDINATION</p>
        </div>
      </div>
      {!can&&<div className="alert alert-e">🔒 RESTRICTED — EMERGENCY OPERATIONS CONTROLLER OR SUPER ADMINISTRATOR CLEARANCE REQUIRED</div>}
      <div className="alert alert-i">ℹ Green corridors now run automatically from live vehicle status. Super Administrator keeps the only disaster override and may grant temporary signal-cycle access to lower roles only during active emergencies.</div>
      {controlGrant&&role!=="Super Administrator"&&<div className="alert alert-ok">✓ Your emergency signal delegation is active for the current incident window.</div>}
      {emergencyState.activeCorridor&&<div className="alert alert-e">● ACTIVE: Emergency Corridor {emergencyState.activeCorridor} — Signal sync active on {emergencyState.affectedNodes.join(", ")}</div>}

      {/* Active Emergency Vehicles */}
      <div className="panel" style={{marginBottom:12}}>
        <div className="panel-head">
          <div className="panel-title" style={{color:"var(--red)"}}>Active Emergency Vehicles</div>
          <span className="badge badge-r">● {activeVehicles.filter(v=>v.status==="ACTIVE").length} ACTIVE</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th>Vehicle ID</th><th>Type</th><th>Registration</th><th>Current Junction</th><th>Destination</th><th>ETA</th><th>Corridor</th><th>Signal Status</th><th>Status</th></tr></thead>
            <tbody>
              {activeVehicles.map(v=>(
                <tr key={v.id}>
                  <td className="mono-cell">{v.id}</td>
                  <td><span className="badge badge-r">{v.type}</span></td>
                  <td className="mono-cell">{v.reg}</td>
                  <td style={{color:"var(--text0)",fontWeight:500}}>{v.currentJunction}</td>
                  <td style={{color:"var(--text0)",fontWeight:500}}>{v.destJunction}</td>
                  <td className="mono-cell">{v.eta} min</td>
                  <td style={{fontSize:11}}>{v.corridor}</td>
                  <td><span className={`badge ${v.signal==="GREEN_WAVE"?"badge-g":"badge-y"}`}>{v.signal}</span></td>
                  <td><span className={`badge ${v.status==="ACTIVE"?"badge-r":"badge-y"}`}>{v.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="g2">
        {/* Corridors */}
        <div className="panel" style={{borderTop:"2px solid var(--red)"}}>
          <div className="panel-head">
            <div className="panel-title" style={{color:"var(--red)"}}>Green Corridor Preemption</div>
            {emergencyState.activeCorridor&&<span className="badge badge-r">● LIVE</span>}
          </div>
          <div className="panel-body" style={{display:"flex",flexDirection:"column",gap:8}}>
            {corridors.map(c=>{
              const isActive=emergencyState.activeCorridor===c.id;
              const statusClass=isActive?"active-c":c.status==="Standby"?"standby-c":c.status==="Ready"?"ready-c":"disabled-c";
              return(
                <div key={c.id} className={`emg-card ${statusClass}`}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,gap:8}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:12.5,color:"var(--text0)",marginBottom:2}}>{c.name}</div>
                      <span className="badge badge-k" style={{marginRight:4}}>{c.type}</span>
                      <span className={badgeClass(isActive?"Red":c.status==="Active"?"Red":c.status==="Standby"?"Yellow":c.status==="Ready"?"Green":"bk")}>{c.status.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="corridor-route">
                    {c.route.map((n,i)=>(
                      <span key={i} className={`route-node${isActive?" active-node":""}`}>{n}</span>
                    ))}
                  </div>
                  {c.confidence>0&&(
                    <div style={{display:"flex",gap:16,marginBottom:8,fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)"}}>
                      <span>ETA Before: <strong style={{color:"var(--red)"}}>{c.etaBefore}m</strong></span>
                      <span>After: <strong style={{color:"var(--green)"}}>{c.etaAfter}m</strong></span>
                      <span>Saved: <strong style={{color:"var(--amber)"}}>{c.timeSaved}m</strong></span>
                      <span>Conf: <strong>{(c.confidence*100).toFixed(0)}%</strong></span>
                    </div>
                  )}
                  <button className={`btn ${isActive?"btn-red":"btn-ghost"}`} disabled style={{fontSize:9,width:"100%",justifyContent:"center"}}>
                    {isActive?"AUTO ACTIVE":"AUTO MANAGED"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disaster Protocols */}
        <div>
          <div className="panel" style={{borderTop:"2px solid var(--amber)",marginBottom:10}}>
            <div className="panel-head"><div className="panel-title" style={{color:"var(--amber)"}}>Disaster Override Protocols</div></div>
            <div className="panel-body">
              <p style={{fontFamily:"var(--mono)",fontSize:9.5,color:"var(--text2)",marginBottom:12,lineHeight:1.7}}>Disaster protocols suspend AI network-wide and require Super Administrator dual-authorisation. All activations are logged under IT Act 2000.</p>
              {[
                {t:"TOTAL SYSTEM FLASH",d:"Force all junctions to blink RED. Use only during catastrophic multi-junction failures.",c:"var(--red)",mode:"all-red",ico:"🔴"},
                {t:"ARTERIAL FLUSH",d:"Force all junctions to GREEN for mass evacuation or major emergency access.",c:"var(--amber)",mode:"arterial-flush",ico:"🟡"},
              ].map(it=>(
                <div key={it.t} style={{border:"1px solid var(--border)",borderRadius:5,padding:12,marginBottom:8,background:"var(--bg2)",borderLeft:`3px solid ${it.c}`}}>
                  <div style={{fontFamily:"var(--mono)",fontWeight:700,marginBottom:3,fontSize:11,color:it.c}}>{it.ico} {it.t}</div>
                  <p style={{fontFamily:"var(--mono)",fontSize:9.5,marginBottom:10,color:"var(--text2)",lineHeight:1.6}}>{it.d}</p>
                  <button className="btn btn-ghost" style={{width:"100%",justifyContent:"center",color:it.c,borderColor:it.c,fontSize:9}} onClick={()=>disaster(it.mode)} disabled={role!=="Super Administrator"}>
                    {role==="Super Administrator"?`ACTIVATE ${it.t}`:"SUPER ADMIN ONLY — DUAL AUTH REQUIRED"}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><div className="panel-title">Cross-Junction Coordination</div></div>
            <div className="panel-body">
              <div className="alert alert-ok">✓ 3 downstream junctions synchronized. Next vehicle arrival predictions active.</div>
              {[
                {from:"J-001",to:"J-007",eta:4,density:"Moderate",synced:true},
                {from:"J-005",to:"J-004",eta:6,density:"Low",synced:true},
                {from:"J-003",to:"J-002",eta:9,density:"High",synced:false},
              ].map((c,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid var(--borderFaint)"}}>
                  <div>
                    <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--text0)",fontWeight:700}}>{c.from} → {c.to}</span>
                    <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",marginTop:2}}>ETA {c.eta}min · {c.density}</div>
                  </div>
                  <span className={`badge ${c.synced?"badge-g":"badge-y"}`}>{c.synced?"SYNCED":"PENDING"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SENSOR HEALTH
══════════════════════════════════════════════════════════════ */
function SensorHealth({junctions=JUNCTIONS}){
  const [tick,setTick]=useState(0);
  useEffect(()=>{const i=setInterval(()=>setTick(t=>t+1),8000);return()=>clearInterval(i);},[]);

  const totalSensors=junctions.length*5;
  const failedSensors=junctions.flatMap(j=>Object.values(j.sensorStatus).filter(s=>s==="Failed")).length;
  const degraded=junctions.flatMap(j=>Object.values(j.sensorStatus).filter(s=>s==="Degraded")).length;
  const healthy=totalSensors-failedSensors-degraded;

  const maintenanceAlerts=junctions.filter(j=>Object.values(j.sensorStatus).some(s=>s!=="Healthy")).map(j=>({
    junction:j.id,
    name:j.name,
    sensors:Object.entries(j.sensorStatus).filter(([,v])=>v!=="Healthy").map(([k,v])=>`${k}: ${v}`),
    priority:Object.values(j.sensorStatus).some(s=>s==="Failed")?"CRITICAL":"HIGH",
  }));

  const sensorTypes=[
    {name:"mmWave Radar",icon:"📡",desc:"Vehicle count, speed, lane occupancy"},
    {name:"Camera (CV)",icon:"📷",desc:"YOLOv8 detection, classification"},
    {name:"Temperature",icon:"🌡",desc:"Ambient temperature monitoring"},
    {name:"Humidity",icon:"💧",desc:"Relative humidity monitoring"},
    {name:"GPS/RF Receiver",icon:"📻",desc:"Emergency vehicle detection"},
  ];

  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header"><h1>◎ Sensor Health</h1><div className="accent-rule"/><p>// mmWAVE RADAR · CAMERA CV · TEMPERATURE · HUMIDITY · GPS/RF RECEIVER</p></div>
        <div className="page-actions">
          <button className="btn btn-amber">↗ EXPORT HEALTH REPORT</button>
        </div>
      </div>
      <div className="g4" style={{marginBottom:14}}>
        {[
          {label:"Total Sensors",val:totalSensors,accent:"#0077CC",ico:"◎"},
          {label:"Healthy",val:healthy,accent:"#1A7F4B",ico:"✓"},
          {label:"Degraded",val:degraded,accent:"#C97D10",ico:"⚠"},
          {label:"Failed",val:failedSensors,accent:"#B03030",ico:"✕"},
        ].map(k=>(
          <div key={k.label} className="kpi-card" style={{"--kpi-accent":k.accent}}>
            <div className="kpi-ico">{k.ico}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{color:k.accent}}>{k.val}</div>
          </div>
        ))}
      </div>

      {maintenanceAlerts.length>0&&(
        <div style={{marginBottom:12}}>
          <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:8}}>Maintenance Alerts</div>
          {maintenanceAlerts.map((a,i)=>(
            <div key={i} className="maint-card">
              <div className="maint-card-title">[{a.priority}] {a.junction} — {a.name}</div>
              <div className="maint-card-detail">{a.sensors.join(" · ")}</div>
            </div>
          ))}
        </div>
      )}

      <div className="panel">
        <div className="panel-head"><div className="panel-title">Sensor Status Matrix — All Junctions</div></div>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead>
              <tr>
                <th>Junction</th>
                <th>Zone</th>
                <th>mmWave Radar</th>
                <th>Camera (CV)</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>GPS/RF</th>
                <th>Overall</th>
              </tr>
            </thead>
            <tbody>
              {junctions.map(j=>{
                const vals=Object.values(j.sensorStatus);
                const overall=vals.every(v=>v==="Healthy")?"Healthy":vals.some(v=>v==="Failed")?"Failed":"Degraded";
                return(
                  <tr key={j.id}>
                    <td>
                      <div style={{fontWeight:600,color:"var(--text0)",fontSize:12}}>{j.id}</div>
                      <div style={{fontSize:10,color:"var(--text3)"}}>{j.name.split("–")[0].trim()}</div>
                    </td>
                    <td style={{fontSize:11}}>{j.zone}</td>
                    {Object.entries(j.sensorStatus).map(([k,v])=>(
                      <td key={k}><span className={badgeClass(v)}>{v}</span></td>
                    ))}
                    <td><span className={badgeClass(overall)}>{overall}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="g2" style={{marginTop:12}}>
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Sensor Type Reference</div></div>
          <div className="panel-body">
            {sensorTypes.map(s=>(
              <div key={s.name} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid var(--borderFaint)"}}>
                <span style={{fontSize:18}}>{s.icon}</span>
                <div>
                  <div style={{fontWeight:600,color:"var(--text0)",fontSize:12}}>{s.name}</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",marginTop:2}}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Live Sensor Readings — J-001</div></div>
          <div className="panel-body">
            <div className="g2">
              {[
                {name:"Vehicle Count",val:"342",unit:"vehicles/hr",color:"#0077CC"},
                {name:"Avg Speed",val:"22",unit:"km/h",color:"#C97D10"},
                {name:"Lane Occ.",val:"78%",unit:"N lane",color:"#B03030"},
                {name:"Temperature",val:"33",unit:"°C",color:"#B03030"},
                {name:"Humidity",val:"72",unit:"%",color:"#1A7F4B"},
                {name:"EMG Vehicle",val:"None",unit:"detected",color:"#1A7F4B"},
              ].map(s=>(
                <div key={s.name} className="sensor-card">
                  <div className="sensor-name">{s.name}</div>
                  <div className="sensor-val" style={{color:s.color}}>{s.val}</div>
                  <div className="sensor-unit">{s.unit}</div>
                  <div className="sensor-status"><span className="sdot sdot-g"/>Operational</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ANALYTICS & REPORTING
══════════════════════════════════════════════════════════════ */
function Analytics({junctions=JUNCTIONS}){
  const [range,setRange]=useState("24h");
  const [report,setReport]=useState("daily");
  const total=junctions.reduce((a,j)=>a+j.vehicles,0);
  const analytics=useMemo(()=>buildAnalyticsSeries(range,junctions),[range,junctions]);
  
  const exportCSV=()=>{
    const rows=[["Junction ID","Name","Density %","Vehicles","Congestion","Delay (min)","Region","Priority"]];
    junctions.forEach(j=>rows.push([j.id,j.name,j.density.toFixed(1),j.vehicles,j.congestion,j.delay.toFixed(1),j.region,j.priority]));
    const csv="\uFEFF"+rows.map(r=>r.map(c=>`"${c}"`).join(",")).join("\n");
    downloadBlob(`traffix_report_${new Date().toISOString().split('T')[0]}.csv`,new Blob([csv],{type:"text/csv;charset=utf-8;"}));
  };
  
  const exportPDF=()=>{
    try{
      const lines=[
        "TRAFFIX TRAFFIC ANALYTICS REPORT",
        `Generated: ${new Date().toLocaleString("en-IN")}`,
        `Selected Window: ${range.toUpperCase()}`,
        `Junctions Analyzed: ${junctions.length}`,
        `Network Efficiency: ${analytics.kpis.efficiency}`,
        `Average Delay: ${analytics.kpis.avgDelay}`,
        `Fuel Saved: ${analytics.kpis.fuel}`,
        "",
        "JUNCTION SUMMARY",
        ...junctions.slice(0,12).map(j=>`${j.id} | ${j.name} | Density ${j.density}% | Vehicles ${j.vehicles} | Delay ${j.delay} min | ${j.region}`),
      ];
      downloadBlob(`traffix_report_${new Date().toISOString().split('T')[0]}.pdf`,buildSimplePdf(lines));
    }catch(e){
      console.error('PDF export error:',e);
      alert('PDF export failed. CSV export will be used instead.');
      exportCSV();
    }
  };
  
  const exportExcel=()=>{
    try{
      const rows=[
        ["Traffix Traffic Analytics Report","","","","","","",""],
        ["Generated",new Date().toLocaleString("en-IN"),"Window",range.toUpperCase(),"Efficiency",analytics.kpis.efficiency,"Avg Delay",analytics.kpis.avgDelay],
        ["Junction ID","Name","Density %","Vehicles","Congestion","Delay (min)","Region","Priority"],
        ...junctions.map(j=>[j.id,j.name,Number(j.density.toFixed(1)),j.vehicles,j.congestion,Number(j.delay.toFixed(1)),j.region,j.priority]),
      ];
      downloadBlob(`traffix_report_${new Date().toISOString().split('T')[0]}.xls`,buildExcelSpreadsheet(rows,"Analytics Report"));
    }catch(e){
      console.error('Excel export error:',e);
      exportCSV();
    }
  };
  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header"><h1>▦ Analytics & Reporting</h1><div className="accent-rule"/><p>// TRAFFIC INTELLIGENCE · PEAK ANALYSIS · FUEL SAVINGS · EMISSION REDUCTION</p></div>
        <div className="page-actions">
          {["1h","24h","7d","30d"].map(r=>(
            <button key={r} className={`btn ${range===r?"btn-amber":"btn-ghost"}`} onClick={()=>{setRange(r);setReport(r);}}>{r.toUpperCase()}</button>
          ))}
          <div className="export-btn-group">
            <button className="btn btn-ghost" onClick={exportCSV} title="Export as CSV">↗ CSV</button>
            <button className="btn btn-ghost" onClick={exportPDF} title="Export as PDF">↗ PDF</button>
            <button className="btn btn-ghost" onClick={exportExcel} title="Export as Excel">↗ EXCEL</button>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        {[
          {label:"Network Efficiency",val:analytics.kpis.efficiency,delta:`Window: ${analytics.kpis.delta}`,accent:"#1A7F4B",ico:"♡"},
          {label:"AI Actions",val:analytics.kpis.actions,delta:"Automated interventions",accent:"#0077CC",ico:"⬠"},
          {label:"Avg Delay",val:analytics.kpis.avgDelay,delta:"Range-adjusted network delay",accent:"#C97D10",ico:"⏱"},
          {label:"Fuel Saved",val:analytics.kpis.fuel,delta:"CO₂ reduction estimate",accent:"#1A7F4B",ico:"🌿"},
        ].map(k=>(
          <div key={k.label} className="kpi-card" style={{"--kpi-accent":k.accent}}>
            <div className="kpi-ico">{k.ico}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{color:k.accent}}>{k.val}</div>
            <div className="kpi-delta">{k.delta}</div>
          </div>
        ))}
      </div>
      <div className="g2" style={{marginBottom:12}}>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">{analytics.densityTitle}</div>
            <div style={{display:"flex",gap:10,fontSize:9,fontFamily:"var(--mono)"}}>
              <span style={{color:"#0077CC"}}>── ACTUAL</span>
              <span style={{color:"#C97D10"}}>-- PREDICTED</span>
            </div>
          </div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={analytics.densityData} margin={{top:5,right:5,bottom:0,left:-25}}>
                <defs>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0077CC" stopOpacity={0.15}/><stop offset="95%" stopColor="#0077CC" stopOpacity={0}/></linearGradient>
                  <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C97D10" stopOpacity={0.1}/><stop offset="95%" stopColor="#C97D10" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--borderFaint)"/>
                <XAxis dataKey={analytics.densityKey} tick={{fontSize:8,fill:"var(--text3)",fontFamily:"JetBrains Mono"}}/>
                <YAxis tick={{fontSize:8,fill:"var(--text3)",fontFamily:"JetBrains Mono"}}/>
                <Tooltip content={<CT/>}/>
                <Area type="monotone" dataKey="d" name="Density%" stroke="#0077CC" strokeWidth={2} fill="url(#gA)"/>
                <Area type="monotone" dataKey="p" name="Prediction%" stroke="#C97D10" strokeWidth={1.5} strokeDasharray="5 3" fill="url(#gP)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Congestion Distribution</div></div>
          <div className="panel-body" style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart><Pie data={analytics.pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={3} dataKey="value">{analytics.pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip formatter={(v,n)=>[`${v} nodes`,n]}/></PieChart>
            </ResponsiveContainer>
            <div style={{display:"flex",flexDirection:"column",gap:6,width:"100%",marginTop:4}}>
              {analytics.pieData.map(d=>(
                <div key={d.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{display:"flex",alignItems:"center",gap:6,fontFamily:"var(--mono)",fontSize:9,color:"var(--text2)"}}>
                    <span style={{width:7,height:7,background:d.color,display:"inline-block",borderRadius:1,boxShadow:`0 0 5px ${d.color}`}}/>
                    {d.name.toUpperCase()}
                  </span>
                  <span style={{fontFamily:"var(--mono)",fontWeight:700,fontSize:11,color:d.color}}>{d.value} junctions</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="g2" style={{marginBottom:12}}>
        <div className="panel">
          <div className="panel-head"><div className="panel-title">{analytics.vehicleTitle}</div></div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={175}>
              <BarChart data={analytics.densityData} margin={{top:5,right:5,bottom:0,left:-25}}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--borderFaint)"/>
                <XAxis dataKey={analytics.densityKey} tick={{fontSize:8,fill:"var(--text3)",fontFamily:"JetBrains Mono"}}/>
                <YAxis tick={{fontSize:8,fill:"var(--text3)",fontFamily:"JetBrains Mono"}}/>
                <Tooltip content={<CT/>}/>
                <Bar dataKey="v" name="Vehicles" fill="#6B35B8" radius={[2,2,0,0]} opacity={0.85}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title">{analytics.comparisonTitle}</div></div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={175}>
              <LineChart data={analytics.comparisonData} margin={{top:5,right:5,bottom:0,left:-25}}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--borderFaint)"/>
                <XAxis dataKey={analytics.comparisonKey} tick={{fontSize:8,fill:"var(--text3)",fontFamily:"JetBrains Mono"}}/>
                <YAxis tick={{fontSize:8,fill:"var(--text3)",fontFamily:"JetBrains Mono"}}/>
                <Tooltip content={<CT/>}/>
                <Legend wrapperStyle={{fontSize:9,fontFamily:"JetBrains Mono"}}/>
                <Line type="monotone" dataKey="avg" name="Avg%" stroke="#0077CC" strokeWidth={2} dot={{r:2,fill:"#0077CC"}}/>
                <Line type="monotone" dataKey="peak" name="Peak%" stroke="#B03030" strokeWidth={2} strokeDasharray="4 2" dot={{r:2,fill:"#B03030"}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><div className="panel-title">Junction Performance Matrix</div></div>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th>ID</th><th>Junction</th><th>Region</th><th style={{minWidth:120}}>Density</th><th>Congestion</th><th className="hide-mob">Vehicles</th><th className="hide-mob">Delay</th><th>Priority</th><th>Sensor</th></tr></thead>
            <tbody>
              {junctions.map(j=>{
                const sensorOk=Object.values(j.sensorStatus).every(v=>v==="Healthy");
                return(
                  <tr key={j.id}>
                    <td className="mono-cell">{j.id}</td>
                    <td style={{color:"var(--text0)",fontWeight:500,fontSize:12}}>{j.name}</td>
                    <td style={{fontSize:11,color:"var(--text2)"}}>{j.region}</td>
                    <td><DBar value={j.density}/></td>
                    <td><span className={badgeClass(j.congestion)}>{j.congestion}</span></td>
                    <td className="mono-cell hide-mob">{j.vehicles}</td>
                    <td className="mono-cell hide-mob">{j.delay}m</td>
                    <td><span className={badgeClass(j.priority)}>{j.priority}</span></td>
                    <td><span className={`badge ${sensorOk?"badge-g":"badge-y"}`}>{sensorOk?"ALL OK":"CHECK"}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   AUDIT LOG / HISTORY
══════════════════════════════════════════════════════════════ */
function History({events=LOGS}){
  const [q,setQ]=useState("");const [tf,setTf]=useState("All");const [page,setPage]=useState(1);
  const types=["All","AI Optimisation","Manual Override","System Event","Sensor Alert","Emergency Override","Peak Transition","Weather Alert"];
  const PER_PAGE=8;
  const rows=events.filter(l=>(tf==="All"||l.type===tf)&&((l.junction+l.type+l.details+(l.id||"")).toLowerCase().includes(q.toLowerCase())));
  const totalPages=Math.max(1,Math.ceil(rows.length/PER_PAGE));
  const paged=rows.slice((page-1)*PER_PAGE,page*PER_PAGE);
  const exportCSV=()=>{
    const csv=["Event ID,Time,Type,Junction,Details,Status",...rows.map(r=>`${r.id},${r.time},${r.type},${r.junction},"${r.details}",${r.status}`)].join("\n");
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    a.download="traffix_audit_log.csv";a.click();
  };
  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header"><h1>≡ Audit Log</h1><div className="accent-rule"/><p>// IMMUTABLE CHRONOLOGICAL RECORD · ALL AI DECISIONS & OPERATOR ACTIONS · IT ACT 2000 COMPLIANT</p></div>
        <div className="page-actions">
          <button className="btn btn-ghost hide-mob" onClick={exportCSV}>↗ EXPORT CSV</button>
          <button className="btn btn-amber">PRINT</button>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:"1 1 200px",minWidth:160}}>
          <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"var(--text3)",fontSize:12,pointerEvents:"none"}}>⌕</span>
          <input className="inp" style={{paddingLeft:30}} type="text" placeholder="Search events, junctions, IDs…" value={q} onChange={e=>{setQ(e.target.value);setPage(1);}}/>
        </div>
        <select className="sel" style={{flex:"0 0 auto",minWidth:180}} value={tf} onChange={e=>{setTf(e.target.value);setPage(1);}}>
          {types.map(t=><option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="panel">
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th className="hide-mob">Event ID</th><th>Time</th><th>Type</th><th>Junction</th><th className="hide-mob">Details</th><th>Status</th></tr></thead>
            <tbody>
              {paged.length===0?(
                <tr><td colSpan={6} style={{textAlign:"center",padding:24,fontFamily:"var(--mono)",color:"var(--text3)",fontSize:10}}>NO EVENTS FOUND</td></tr>
              ):paged.map(l=>(
                <tr key={l.id}>
                  <td className="mono-cell hide-mob">{l.id}</td>
                  <td className="mono-cell">{l.time}</td>
                  <td><span className="badge badge-b">{l.type}</span></td>
                  <td style={{color:"var(--text0)",fontSize:12}}>{l.junction}</td>
                  <td className="mono-cell hide-mob" style={{maxWidth:200}}>{l.details}</td>
                  <td><span className={badgeClass(l.status)}>{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 14px",borderTop:"1px solid var(--border)",fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)"}}>
          <span>SHOWING {Math.min((page-1)*PER_PAGE+1,rows.length)}–{Math.min(page*PER_PAGE,rows.length)} / {rows.length} EVENTS</span>
          <div style={{display:"flex",gap:5}}>
            <button className="btn btn-ghost btn-sm" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>← PREV</button>
            <span style={{padding:"4px 8px",background:"var(--bg2)",borderRadius:3}}>{page}/{totalPages}</span>
            <button className="btn btn-ghost btn-sm" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>NEXT →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   USER MANAGEMENT
══════════════════════════════════════════════════════════════ */
function UserManagement({currentUser,controlGrants,onToggleGrant}){
  const [users,setUsers]=useState(USERS);
  const [q,setQ]=useState("");const [rf,setRf]=useState("All");const [showModal,setShowModal]=useState(false);
  const roles=["All","Super Administrator","Regional Traffic Authority","Police Station Controller","Junction Operator","Emergency Operations Controller"];
  const [newUser,setNewUser]=useState({id:"",name:"",role:"Junction Operator",zone:"",status:"Active",last:"Never",mfa:false});
  const canManageGrants=currentUser?.role==="Super Administrator";

  const rows=users.filter(u=>(rf==="All"||u.role===rf)&&(u.name+u.id).toLowerCase().includes(q.toLowerCase()));
  function handleAdd(){
    if(!newUser.id||!newUser.name||!newUser.zone) return;
    setUsers(prev=>[...prev,{...newUser}]);setShowModal(false);
    setNewUser({id:"",name:"",role:"Junction Operator",zone:"",status:"Active",last:"Never",mfa:false});
  }
  function toggleStatus(id){setUsers(prev=>prev.map(u=>u.id===id?{...u,status:u.status==="Active"?"Suspended":"Active"}:u));}

  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header"><h1>◌ User Management</h1><div className="accent-rule"/><p>// ROLE-BASED ACCESS CONTROL · AUTHORITY ACCOUNTS · ZONE ASSIGNMENTS · MFA STATUS</p></div>
        <div className="page-actions"><button className="btn btn-amber" onClick={()=>setShowModal(true)}>+ ADD USER</button></div>
      </div>
      <div className="alert alert-i">ℹ Traffic-light control is owned by Super Administrator. Lower roles can receive only temporary emergency signal delegation, and only from Super Administrator.</div>
      <div className="g4" style={{marginBottom:14}}>
        {[
          {label:"Total Accounts",val:users.length,accent:"#0077CC"},
          {label:"Active",val:users.filter(u=>u.status==="Active").length,accent:"#1A7F4B"},
          {label:"Suspended",val:users.filter(u=>u.status==="Suspended").length,accent:"#B03030"},
          {label:"Emergency Grants",val:Object.values(controlGrants||{}).filter(Boolean).length,accent:"#6B35B8"},
        ].map(k=>(
          <div key={k.label} className="kpi-card" style={{"--kpi-accent":k.accent}}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{color:k.accent}}>{k.val}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:"1 1 200px",minWidth:160}}>
          <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"var(--text3)",fontSize:12,pointerEvents:"none"}}>⌕</span>
          <input className="inp" style={{paddingLeft:30}} type="text" placeholder="Search users…" value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        <select className="sel" style={{flex:"0 0 auto",minWidth:220}} value={rf} onChange={e=>setRf(e.target.value)}>
          {roles.map(r=><option key={r}>{r}</option>)}
        </select>
      </div>
      <div className="panel">
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th className="hide-mob">User ID</th><th>Name</th><th>Role</th><th className="hide-mob">Zone</th><th>MFA</th><th>Emergency Signal Access</th><th>Status</th><th className="hide-mob">Last Login</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map(u=>(
                <tr key={u.id}>
                  <td className="mono-cell hide-mob">{u.id}</td>
                  <td style={{color:"var(--text0)",fontWeight:600,fontSize:12}}>{u.name}</td>
                  <td><span className={badgeClass(u.role)}>{u.role}</span></td>
                  <td className="mono-cell hide-mob">{u.zone}</td>
                  <td><span className={`badge ${u.mfa?"badge-g":"badge-k"}`}>{u.mfa?"ON":"OFF"}</span></td>
                  <td><span className={`badge ${(u.role==="Super Administrator"||controlGrants?.[u.id])?"badge-r":"badge-k"}`}>{u.role==="Super Administrator"?"MASTER":controlGrants?.[u.id]?"GRANTED":"AUTO ONLY"}</span></td>
                  <td><span className={badgeClass(u.status)}>{u.status}</span></td>
                  <td className="mono-cell hide-mob">{u.last}</td>
                  <td>
                    <div style={{display:"flex",gap:4}}>
                      <button className="btn btn-ghost btn-sm">EDIT</button>
                      {u.role!=="Super Administrator"&&(
                        <button className="btn btn-ghost btn-sm" onClick={()=>canManageGrants&&onToggleGrant?.(u.id)} disabled={!canManageGrants} style={{color:controlGrants?.[u.id]?"var(--amber)":"var(--cyan)"}}>
                          {controlGrants?.[u.id]?"REVOKE ACCESS":"GRANT EMG"}
                        </button>
                      )}
                      <button className="btn btn-ghost btn-sm" style={{color:u.status==="Active"?"var(--red)":"var(--green)",borderColor:u.status==="Active"?"rgba(176,48,48,0.3)":"rgba(26,127,75,0.3)"}} onClick={()=>toggleStatus(u.id)}>{u.status==="Active"?"SUSPEND":"ACTIVATE"}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
          <div style={{background:"var(--bg1)",padding:28,borderRadius:8,minWidth:340,boxShadow:"var(--shadowLg)",border:"1px solid var(--border)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <h2 style={{fontSize:15,fontWeight:700,color:"var(--text0)"}}>Add New User</h2>
              <button className="btn btn-ghost btn-sm" onClick={()=>setShowModal(false)}>✕</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div className="field"><label>User ID</label><input className="inp" placeholder="USR-008" value={newUser.id} onChange={e=>setNewUser({...newUser,id:e.target.value})}/></div>
              <div className="field"><label>Full Name</label><input className="inp" placeholder="Full name" value={newUser.name} onChange={e=>setNewUser({...newUser,name:e.target.value})}/></div>
              <div className="field"><label>Zone / Station</label><input className="inp" placeholder="e.g. Chennai North" value={newUser.zone} onChange={e=>setNewUser({...newUser,zone:e.target.value})}/></div>
              <div className="field">
                <label>Role</label>
                <select className="sel" value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})}>
                  {roles.filter(r=>r!=="All").map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Status</label>
                <select className="sel" value={newUser.status} onChange={e=>setNewUser({...newUser,status:e.target.value})}>
                  {["Active","Suspended"].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
              <button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-amber" onClick={handleAdd}>ADD USER</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SYSTEM SETTINGS
══════════════════════════════════════════════════════════════ */
function SystemSettings({settings,onSave}){
  const [ai,setAi]=useState(settings.autoOptimise);
  const [emg,setEmg]=useState(settings.emergencyBroadcast);
  const [log,setLog]=useState(settings.auditLogging);
  const [mqtt,setMqtt]=useState(true);
  const [ws,setWs]=useState(true);
  const [thr,setThr]=useState(settings.congestionThreshold);
  const [sync,setSync]=useState(settings.syncInterval);
  const [saved,setSaved]=useState(false);const [saving,setSaving]=useState(false);

  const TogRow=({label,sub,v,onChg})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"10px 0",borderBottom:"1px solid var(--borderFaint)"}}>
      <div style={{flex:1,paddingRight:12}}>
        <div style={{fontSize:12,color:"var(--text0)",fontWeight:600,marginBottom:2}}>{label}</div>
        <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)"}}>{sub}</div>
      </div>
      <button className={`tog${v?" on":""}`} onClick={()=>onChg(!v)}/>
    </div>
  );

  const handleSave=async()=>{
    setSaving(true);
    await new Promise(r=>setTimeout(r,800));
    onSave({autoOptimise:ai,emergencyBroadcast:emg,auditLogging:log,congestionThreshold:thr,syncInterval:sync});
    setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2500);
  };

  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header"><h1>⚙ System Settings</h1><div className="accent-rule"/><p>// AI ENGINE · SECURITY · OPERATIONAL CONFIGURATION · SYSTEM ADMINISTRATION</p></div>
        <div className="page-actions">
          {saved&&<span className="badge badge-g">✓ SAVED</span>}
          <button className="btn btn-amber" onClick={handleSave} disabled={saving}>{saving?"SAVING…":"SAVE CHANGES"}</button>
        </div>
      </div>
      <div className="g2">
        <div className="panel">
          <div className="panel-head"><div className="panel-title">AI Optimisation Engine</div></div>
          <div className="panel-body">
            <TogRow label="Auto-Optimise Signal Phases" sub="LSTM+RL rebalances cycles without manual review" v={ai} onChg={setAi}/>
            <TogRow label="MQTT IoT Integration" sub="Real-time sensor data via MQTT broker" v={mqtt} onChg={setMqtt}/>
            <TogRow label="WebSocket Streaming" sub="Live data broadcast to connected clients" v={ws} onChg={setWs}/>
            {[["Congestion Alert Threshold",thr,setThr,40,95,"%"],["Telemetry Sync Interval",sync,setSync,2,30,"s"]].map(([l,v,s,mn,mx,u])=>(
              <div key={l} style={{padding:"10px 0",borderBottom:"1px solid var(--borderFaint)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:12,color:"var(--text0)",fontWeight:600}}>{l}</span>
                  <span style={{fontFamily:"var(--mono)",fontSize:13,color:"var(--amber)",fontWeight:700}}>{v}{u}</span>
                </div>
                <input type="range" min={mn} max={mx} value={v} onChange={e=>s(+e.target.value)}/>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div className="panel">
            <div className="panel-head"><div className="panel-title">Security & Override</div></div>
            <div className="panel-body">
              <TogRow label="Emergency Broadcast Channel" sub="Hard-priority preemption broadcasting enabled" v={emg} onChg={setEmg}/>
              <TogRow label="Immutable Audit Logging" sub="Full signal-control trace for IT Act 2000 compliance" v={log} onChg={setLog}/>
              <div style={{paddingTop:10}}>
                <div style={{fontSize:12,color:"var(--text0)",fontWeight:600,marginBottom:3}}>JWT Authentication</div>
                <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",marginBottom:8}}>Algorithm: HS256 · Token TTL: 60 min · Refresh: 7 days</div>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn btn-red btn-sm">ROTATE SECRET KEY</button>
                  <button className="btn btn-ghost btn-sm">VIEW SESSIONS</button>
                </div>
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><div className="panel-title">System Status</div></div>
            <div className="panel-body">
              {[
                {l:"MongoDB Database",v:"Connected ✓",s:"cluster0.traffix.net",c:"var(--green)"},
                {l:"FastAPI Backend",v:"Healthy ✓",s:"traffix-api.onrender.com:8000",c:"var(--green)"},
                {l:"MQTT Broker",v:"Active ✓",s:"mqtt.traffix.internal:1883",c:"var(--green)"},
                {l:"AI/LSTM Engine",v:"Online ✓",s:"v2.4 · Accuracy 94.2%",c:"var(--green)"},
                {l:"WebSocket",v:"Active ✓",s:"12 active connections",c:"var(--cyan)"},
                {l:"Build",v:"v4.0.1",s:"2026.06 · Stable Release",c:"var(--text3)"},
              ].map(it=>(
                <div key={it.l} className="health-item">
                  <div className="health-item-head">
                    <span className="health-label">{it.l}</span>
                    <span className="health-value" style={{color:it.c}}>{it.v}</span>
                  </div>
                  <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)"}}>{it.s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="panel" style={{marginTop:12}}>
        <div className="panel-head"><div className="panel-title">Database Collections</div></div>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th>Collection</th><th>Description</th><th>Records</th><th>Status</th></tr></thead>
            <tbody>
              {[
                {c:"Users",d:"Authority accounts and authentication",r:"7",s:"Active"},
                {c:"Roles",d:"RBAC role definitions",r:"5",s:"Active"},
                {c:"Junctions",d:"Junction metadata and configuration",r:"12",s:"Active"},
                {c:"TrafficData",d:"Real-time traffic measurements",r:"14,820",s:"Active"},
                {c:"Predictions",d:"LSTM AI prediction outputs",r:"2,340",s:"Active"},
                {c:"SensorData",d:"mmWave, temperature, humidity readings",r:"87,600",s:"Active"},
                {c:"WeatherData",d:"Weather API + sensor data",r:"1,440",s:"Active"},
                {c:"EmergencyEvents",d:"Emergency corridor activations",r:"234",s:"Active"},
                {c:"Notifications",d:"Alert and notification logs",r:"5,670",s:"Active"},
                {c:"AuditLogs",d:"Immutable action audit trail",r:"45,120",s:"Active"},
                {c:"MaintenanceLogs",d:"Sensor failure and maintenance records",r:"820",s:"Active"},
                {c:"PoliceStations",d:"PS zone and junction mapping",r:"5",s:"Active"},
                {c:"Regions",d:"Regional authority mapping",r:"4",s:"Active"},
              ].map(row=>(
                <tr key={row.c}>
                  <td style={{fontFamily:"var(--mono)",fontWeight:600,color:"var(--text0)"}}>{row.c}</td>
                  <td style={{fontSize:12,color:"var(--text2)"}}>{row.d}</td>
                  <td className="mono-cell">{row.r}</td>
                  <td><span className="badge badge-g">{row.s}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT APPLICATION
══════════════════════════════════════════════════════════════ */
export default function App(){
  const [user,setUser]=useState(null);
  const [tab,setTab]=useState("dashboard");
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [junctions,setJunctions]=useState(JUNCTIONS);
  const [events,setEvents]=useState(LOGS);
  const [settings,setSettings]=useState({autoOptimise:true,emergencyBroadcast:true,auditLogging:true,congestionThreshold:75,syncInterval:10});
  const [signalPhases,setSignalPhases]=useState(JUNCTIONS.map(j=>j.phase));
  const [emergencyState,setEmergencyState]=useState({activeCorridor:null,affectedNodes:[],disasterMode:null});
  const [controlGrants,setControlGrants]=useState({"USR-004":true});
  const [tick,setTick]=useState(0);

  // Simulate live data updates every 8 seconds
  useEffect(()=>{
    const i=setInterval(()=>{
      setTick(t=>t+1);
      setJunctions(prev=>prev.map(j=>({
        ...j,
        density:Math.max(15,Math.min(98,j.density+(Math.round((Math.random()-0.48)*5)))),
        vehicles:Math.max(50,j.vehicles+(Math.round((Math.random()-0.48)*12))),
        delay:Math.max(0.5,+(j.delay+(Math.random()-0.48)*0.4).toFixed(1)),
      })));
    },8000);
    return()=>clearInterval(i);
  },[]);

  useEffect(()=>{setSignalPhases(junctions.map(j=>j.phase));},[junctions]);

  const alerts=useMemo(()=>{
    const a=[];
    const severe=junctions.filter(j=>j.density>=settings.congestionThreshold);
    if(severe.length>=2) a.push({id:"net-cong",severity:"HIGH",scope:"signals",message:`HIGH CONGESTION: ${severe.length} junctions over ${settings.congestionThreshold}% threshold`,junction:"Network"});
    if(emergencyState.activeCorridor) a.push({id:"corr-ov",severity:"CRITICAL",scope:"emergency",message:`EMERGENCY OVERRIDE ACTIVE: Corridor ${emergencyState.activeCorridor}`,junction:"Multiple"});
    if(emergencyState.disasterMode==="all-red") a.push({id:"dis-red",severity:"CRITICAL",scope:"emergency",message:"ALL-RED DISASTER PROTOCOL ACTIVE",junction:"All"});
    if(emergencyState.disasterMode==="arterial-flush") a.push({id:"dis-flush",severity:"HIGH",scope:"emergency",message:"ARTERIAL FLUSH PROTOCOL ACTIVE",junction:"All"});
    const failJunctions=junctions.filter(j=>Object.values(j.sensorStatus).some(s=>s==="Failed"));
    failJunctions.slice(0,2).forEach(j=>a.push({id:`sf-${j.id}`,severity:"HIGH",scope:"sensors",message:`Sensor failure at ${j.id} — ${j.name}`,junction:j.id}));
    return a;
  },[junctions,settings.congestionThreshold,emergencyState]);

  const login=(u)=>{setUser(u);setTab("dashboard");};
  const logout=()=>{setUser(null);setTab("dashboard");};
  const saveSettings=(next)=>{setSettings(prev=>({...prev,...next}));};
  const toggleControlGrant=(userId)=>setControlGrants(prev=>({...prev,[userId]:!prev[userId]}));

  const renderPage=()=>{
    switch(tab){
      case "dashboard":  return <Dashboard onNav={setTab} junctions={junctions} events={events} alerts={alerts}/>;
      case "map":        return <MapPage junctions={junctions}/>;
      case "junction":   return <JunctionControl junctions={junctions} phases={signalPhases} setPhases={setSignalPhases} emergencyState={emergencyState} alerts={alerts} role={user?.role} userId={user?.id} controlGrant={user?.role!=="Super Administrator"&&controlGrants[user?.id]}/>;
      case "lstm":       return <LSTMPredictions junctions={junctions}/>;
      case "weather":    return <WeatherIntel junctions={junctions}/>;
      case "emergency":  return <EmergencyOps role={user?.role} junctions={junctions} emergencyState={emergencyState} setEmergencyState={setEmergencyState} alerts={alerts} controlGrant={user?.role!=="Super Administrator"&&controlGrants[user?.id]}/>;
      case "sensors":    return <SensorHealth junctions={junctions}/>;
      case "analytics":  return <Analytics junctions={junctions}/>;
      case "history":    return <History events={events}/>;
      case "users":      return <UserManagement currentUser={user} controlGrants={controlGrants} onToggleGrant={toggleControlGrant}/>;
      case "settings":   return <SystemSettings settings={settings} onSave={saveSettings}/>;
      default:           return <Dashboard onNav={setTab} junctions={junctions} events={events} alerts={alerts}/>;
    }
  };

  return(
    <>
      <style dangerouslySetInnerHTML={{__html:STYLES}}/>
      {!user?(
        <Login onLogin={login}/>
      ):(
        <div className="app-shell">
          <Sidebar tab={tab} setTab={setTab} user={user} open={drawerOpen} onClose={()=>setDrawerOpen(false)} onLogout={logout}/>
          <div className="main-area">
            <Topbar tab={tab} onMenuToggle={()=>setDrawerOpen(o=>!o)} alerts={alerts} user={user}/>
            <main style={{flex:1}}>{renderPage()}</main>
            <footer style={{padding:"8px 24px",borderTop:"1px solid var(--border)",background:"var(--bg1)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:5}}>
              <span style={{fontFamily:"var(--mono)",fontSize:8,color:"var(--text3)"}}>© 2026 GOVT OF TAMIL NADU · DEPT. OF HIGHWAYS & TRAFFIC ENGINEERING · TRAFFIX PORTAL v4.0.1</span>
              <span style={{fontFamily:"var(--mono)",fontSize:8,color:"var(--text3)"}}>SECURED · IT ACT 2000 · <a href="#" style={{color:"var(--amber)"}}>DISCLAIMER</a> · <a href="#" style={{color:"var(--amber)"}}>PRIVACY POLICY</a></span>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
