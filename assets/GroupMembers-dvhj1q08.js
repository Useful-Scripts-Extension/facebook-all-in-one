import{r as o,ao as i,ap as x}from"./index-CRvEVTea.js";import{u as f}from"./useForceStop-DTndcDik.js";import{a as h,d as j}from"./MyApp-CMaP2Sb_.js";import y from"./MyTable-BGMHYHQO.js";import{b as T}from"./groups-CN7-xURm.js";import{R as b}from"./row-73W9qzy3.js";import{A as v}from"./index-DT5p5SMb.js";import{I as A}from"./index-CJIHXz_-.js";import{A as C}from"./index-BY0fAFGt.js";import"./styleChecker-CUhFKhR_.js";import"./addEventListener-BNkLVAlq.js";import"./index-WuE-WRtK.js";import"./PurePanel-D2b6DsEN.js";import"./TextArea-CIhCrYWI.js";import"./index-BuegEcvQ.js";import"./index-DhqHC3Qt.js";import"./index-C20GkxZm.js";import"./Dropdown-CwDNI70S.js";import"./index-DMyWxpb4.js";import"./useBreakpoint-CXECHXlA.js";import"./responsiveObserver-zyRHL_Wn.js";import"./Pagination-CQHdhERb.js";import"./index-siwkbsPy.js";import"./index-DBtBoJrM.js";function V({target:a}){const{ti:s}=h();f();const[n,I]=o.useState(!1),[r,d]=o.useState(null),[m,k]=o.useState([]),l=o.useMemo(()=>m.map((e,t)=>({...e,recent:t})),[m]);o.useEffect(()=>{!(a!=null&&a.id)||!(a!=null&&a.type)||T(a==null?void 0:a.id).then(e=>{d(e)})},[a]);const p=e=>i.jsxs(i.Fragment,{children:[i.jsx(x,{type:"primary",icon:n?i.jsx("i",{className:"fa-solid fa-rotate-right fa-spin"}):i.jsx("i",{className:"fa-solid fa-rotate-right"}),disabled:!0,children:s("Fetch all")}),i.jsx(C,{showIcon:!0,type:"info",message:`${r==null?void 0:r.adminCount} admins. ${j(r==null?void 0:r.memberCount)} members`})]}),c=[{title:"#",dataIndex:"recent",key:"recent",render:(e,t,u)=>(t.recent||0)+1},{title:s({en:"Name",vi:"Tên"}),key:"name",dataIndex:"name",sorter:(e,t)=>e.name.localeCompare(t.name),render:(e,t,u)=>i.jsxs(b,{align:"middle",children:[i.jsx(v,{shape:"square",src:i.jsx(A,{src:t.avatar}),size:50}),i.jsx("a",{href:t.url,target:"_blank",style:{marginLeft:"10px"},children:i.jsx("b",{children:t.name})})]}),width:"auto"},{title:"Uid",dataIndex:"id",key:"id",sorter:(e,t)=>e.id.localeCompare(t.id),width:150},{title:s({en:"Joined time",vi:"Tham gia lúc"}),dataIndex:"joinedTime",key:"joinedTime",sorter:(e,t)=>e.joinedTime.localeCompare(t.joinedTime)},{title:s({en:"Last Active",vi:"Hoạt động gần nhất"}),dataIndex:"lastActiveTime",key:"lastActiveTime",sorter:(e,t)=>e.lastActiveTime.localeCompare(t.lastActiveTime)}];return i.jsx(y,{columns:c,data:l,keyExtractor:e=>e.id,searchable:!0,renderTitle:p})}export{V as default};