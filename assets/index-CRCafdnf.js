const __vite__fileDeps=["./RecentStories-BKDjs6Ly.js","./index-CYpLH5g_.js","./index-Gp9RWSdI.css","./MyApp-C_JP8LI6.js","./Collection-DzMUx48F.js","./index-423Ncue-.js","./file-download-DoJL6rir.js","./index-CCeCpUmS.js","./Dropdown-C01ZSSkl.js","./PurePanel-oNlWaC93.js","./index-BUBnSZKO.js","./index-DXNQQjwE.js","./index-BuifVuaE.js","./TextArea-CxzCtomR.js","./addEventListener-B9GsE34w.js","./index-Bi_qGZtV.js","./index-DjBtHGH9.js","./Pagination-DY77cMXH.js","./useBreakpoint-Dni_odvQ.js","./responsiveObserver-AVMs_nQf.js","./row-adRy9scd.js","./index-DYJtd_HB.js","./RecentStoryViewer-Cfyz3cU9.js","./stories-DMwUH1P-.js","./StoryViewers-BJJmWRo_.js","./index-DMhAqJWf.js","./index-DMAJh8Zr.js","./index-Bci4n2cu.js","./index-BN8pdf5P.js","./index-BD7bUhBw.js","./ArchivedStories-BTaP2Obt.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{ap as e,r as i,av as a}from"./index-CYpLH5g_.js";import{u as o,b as l}from"./MyApp-C_JP8LI6.js";import{T as c}from"./index-laBmw7XI.js";import"./Dropdown-C01ZSSkl.js";const n=i.lazy(()=>a(()=>import("./RecentStories-BKDjs6Ly.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]),import.meta.url)),d=i.lazy(()=>a(()=>import("./ArchivedStories-BTaP2Obt.js"),__vite__mapDeps([30,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,23,28,25]),import.meta.url)),r={Recent:"recent",Archived:"archived"};function v(){const{ti:t}=o(),s=[{key:r.Recent,label:t({en:"Today",vi:"Hôm nay"}),closable:!1,children:e.jsx(n,{})},{key:r.Archived,label:t({en:"Archived",vi:"Kho lưu trữ"}),closable:!1,children:e.jsx(d,{})}];return e.jsxs(l,{direction:"vertical",style:{width:"100%"},children:[e.jsx("h1",{style:{textAlign:"left"},children:t({en:"Story",vi:"Tin"})}),e.jsx(c,{hideAdd:!0,type:"editable-card",items:s})]})}export{v as default};