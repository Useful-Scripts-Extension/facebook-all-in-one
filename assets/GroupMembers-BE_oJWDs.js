import{r as s,av as i,aw as x}from"./index-B5YEMzhB.js";import{u as f}from"./useForceStop-CgniJmJe.js";import{u as h,T as j,e as T}from"./MyApp-CooQqMaa.js";import v from"./MyTable-Dtbv6Y81.js";import{b as y}from"./groups-DKlxyp6W.js";import{R as b}from"./row-B3ZTfJBt.js";import{A as C}from"./index-BS2BGcop.js";import{I as A}from"./index-zm4LZ0v2.js";import{A as I}from"./index-DtESAjxx.js";import"./index-CylBeleN.js";import"./Table-CdLgPJwh.js";import"./index-exzROlgN.js";import"./addEventListener-DlfUuwjy.js";import"./index-D1gpnrtJ.js";import"./PurePanel-wqQd8Myk.js";import"./SearchOutlined-C9IiDL4U.js";import"./index-ibrdsRv_.js";import"./index-CIodLJLq.js";import"./Dropdown-JUOFUREu.js";import"./useBreakpoint-BukqLEF8.js";import"./responsiveObserver-C5CSgOYP.js";import"./Pagination-Tj68aaA4.js";import"./index-dXUGRtjW.js";import"./EyeOutlined-B_RZJsOq.js";import"./index-Q9y_ruXN.js";function Y({target:a}){const{ti:o}=h();f();const[n,k]=s.useState(!1),[r,d]=s.useState(null),[m,S]=s.useState([]),l=s.useMemo(()=>m.map((e,t)=>({...e,recent:t})),[m]);s.useEffect(()=>{!(a!=null&&a.id)||!(a!=null&&a.type)||y(a==null?void 0:a.id).then(e=>{d(e)})},[a]);const p=e=>i.jsxs(i.Fragment,{children:[i.jsx(j,{title:o({en:"Coming Soon",vi:"Sắp có"}),children:i.jsx(x,{type:"primary",icon:n?i.jsx("i",{className:"fa-solid fa-rotate-right fa-spin"}):i.jsx("i",{className:"fa-solid fa-rotate-right"}),disabled:!0,children:o("Fetch all")})}),i.jsx(I,{showIcon:!0,type:"info",message:`${r==null?void 0:r.adminCount} admins. ${T(r==null?void 0:r.memberCount)} members`})]}),c=[{title:"#",dataIndex:"recent",key:"recent",render:(e,t,u)=>(t.recent||0)+1},{title:o({en:"Name",vi:"Tên"}),key:"name",dataIndex:"name",sorter:(e,t)=>e.name.localeCompare(t.name),render:(e,t,u)=>i.jsxs(b,{align:"middle",children:[i.jsx(C,{shape:"square",src:i.jsx(A,{src:t.avatar}),size:50}),i.jsx("a",{href:t.url,target:"_blank",style:{marginLeft:"10px"},children:i.jsx("b",{children:t.name})})]}),width:"auto"},{title:"Uid",dataIndex:"id",key:"id",sorter:(e,t)=>e.id.localeCompare(t.id),width:150},{title:o({en:"Joined time",vi:"Tham gia lúc"}),dataIndex:"joinedTime",key:"joinedTime",sorter:(e,t)=>e.joinedTime.localeCompare(t.joinedTime)},{title:o({en:"Last Active",vi:"Hoạt động gần nhất"}),dataIndex:"lastActiveTime",key:"lastActiveTime",sorter:(e,t)=>e.lastActiveTime.localeCompare(t.lastActiveTime)}];return i.jsx(v,{columns:c,data:l,keyExtractor:e=>e.id,searchable:!0,renderTitle:p})}export{Y as default};