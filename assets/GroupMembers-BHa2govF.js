import{r as o,ar as i,au as x}from"./index-uQ-4bckE.js";import{u as f}from"./useForceStop-CipQLr2E.js";import{u as h,e as j}from"./MyApp-Dea_f9Ec.js";import y from"./MyTable-7mgHX_rd.js";import{b as T}from"./groups-D-N7w6pN.js";import{R as b}from"./row-CZZdOBqT.js";import{A as v}from"./index-MwNWAYZV.js";import{I as A}from"./index-C8G9byCU.js";import{A as C}from"./index-BJp_QOfU.js";import"./Table-BEmebim8.js";import"./index-BEYyIv2R.js";import"./addEventListener-BlMTG88c.js";import"./index-DyQaJHWy.js";import"./PurePanel-Ddg11r_4.js";import"./index-DM60k94P.js";import"./index-CrC_uMi3.js";import"./index-pKMdBif8.js";import"./Dropdown-Z0CG7-IL.js";import"./index-BQUxQCcR.js";import"./useBreakpoint-CSQ_VzM4.js";import"./responsiveObserver-sfPxq9Vd.js";import"./Pagination-DPPFQzmS.js";import"./index-C_iPmrIa.js";import"./index-DAiOW5Ie.js";function V({target:a}){const{ti:s}=h();f();const[n,I]=o.useState(!1),[r,d]=o.useState(null),[m,k]=o.useState([]),l=o.useMemo(()=>m.map((e,t)=>({...e,recent:t})),[m]);o.useEffect(()=>{!(a!=null&&a.id)||!(a!=null&&a.type)||T(a==null?void 0:a.id).then(e=>{d(e)})},[a]);const p=e=>i.jsxs(i.Fragment,{children:[i.jsx(x,{type:"primary",icon:n?i.jsx("i",{className:"fa-solid fa-rotate-right fa-spin"}):i.jsx("i",{className:"fa-solid fa-rotate-right"}),disabled:!0,children:s("Fetch all")}),i.jsx(C,{showIcon:!0,type:"info",message:`${r==null?void 0:r.adminCount} admins. ${j(r==null?void 0:r.memberCount)} members`})]}),c=[{title:"#",dataIndex:"recent",key:"recent",render:(e,t,u)=>(t.recent||0)+1},{title:s({en:"Name",vi:"Tên"}),key:"name",dataIndex:"name",sorter:(e,t)=>e.name.localeCompare(t.name),render:(e,t,u)=>i.jsxs(b,{align:"middle",children:[i.jsx(v,{shape:"square",src:i.jsx(A,{src:t.avatar}),size:50}),i.jsx("a",{href:t.url,target:"_blank",style:{marginLeft:"10px"},children:i.jsx("b",{children:t.name})})]}),width:"auto"},{title:"Uid",dataIndex:"id",key:"id",sorter:(e,t)=>e.id.localeCompare(t.id),width:150},{title:s({en:"Joined time",vi:"Tham gia lúc"}),dataIndex:"joinedTime",key:"joinedTime",sorter:(e,t)=>e.joinedTime.localeCompare(t.joinedTime)},{title:s({en:"Last Active",vi:"Hoạt động gần nhất"}),dataIndex:"lastActiveTime",key:"lastActiveTime",sorter:(e,t)=>e.lastActiveTime.localeCompare(t.lastActiveTime)}];return i.jsx(y,{columns:c,data:l,keyExtractor:e=>e.id,searchable:!0,renderTitle:p})}export{V as default};