import{r as o,ap as i,aq as x}from"./index-ByGmV8wY.js";import{u as f}from"./useForceStop-DRXgaMIs.js";import{u as h,e as j}from"./MyApp-Cf4CvXy6.js";import y from"./MyTable-DrEK1sAu.js";import{b as T}from"./groups-CCh5kp43.js";import{R as b}from"./row-BEmum6s0.js";import{A as v}from"./index-TtFCHt-Z.js";import{I as A}from"./index-BPTgN8dl.js";import{A as C}from"./index-_Y4w2-Re.js";import"./Table-FdlQw__M.js";import"./TextArea-DScjjSy-.js";import"./addEventListener-Bhq-MnRc.js";import"./index-BvybQ130.js";import"./PurePanel-BK6FE9J4.js";import"./index-CTwdTgyj.js";import"./index-CAwe5p4m.js";import"./index-CA_CSnEN.js";import"./Dropdown-1utTObuE.js";import"./index-kWf-itGe.js";import"./useBreakpoint-DggrOhr0.js";import"./responsiveObserver-BKXjylYU.js";import"./Pagination-D0T4RzoK.js";import"./index-C6JBQopa.js";import"./index-DmSTfwAr.js";function V({target:a}){const{ti:s}=h();f();const[n,I]=o.useState(!1),[r,d]=o.useState(null),[m,k]=o.useState([]),l=o.useMemo(()=>m.map((e,t)=>({...e,recent:t})),[m]);o.useEffect(()=>{!(a!=null&&a.id)||!(a!=null&&a.type)||T(a==null?void 0:a.id).then(e=>{d(e)})},[a]);const p=e=>i.jsxs(i.Fragment,{children:[i.jsx(x,{type:"primary",icon:n?i.jsx("i",{className:"fa-solid fa-rotate-right fa-spin"}):i.jsx("i",{className:"fa-solid fa-rotate-right"}),disabled:!0,children:s("Fetch all")}),i.jsx(C,{showIcon:!0,type:"info",message:`${r==null?void 0:r.adminCount} admins. ${j(r==null?void 0:r.memberCount)} members`})]}),c=[{title:"#",dataIndex:"recent",key:"recent",render:(e,t,u)=>(t.recent||0)+1},{title:s({en:"Name",vi:"Tên"}),key:"name",dataIndex:"name",sorter:(e,t)=>e.name.localeCompare(t.name),render:(e,t,u)=>i.jsxs(b,{align:"middle",children:[i.jsx(v,{shape:"square",src:i.jsx(A,{src:t.avatar}),size:50}),i.jsx("a",{href:t.url,target:"_blank",style:{marginLeft:"10px"},children:i.jsx("b",{children:t.name})})]}),width:"auto"},{title:"Uid",dataIndex:"id",key:"id",sorter:(e,t)=>e.id.localeCompare(t.id),width:150},{title:s({en:"Joined time",vi:"Tham gia lúc"}),dataIndex:"joinedTime",key:"joinedTime",sorter:(e,t)=>e.joinedTime.localeCompare(t.joinedTime)},{title:s({en:"Last Active",vi:"Hoạt động gần nhất"}),dataIndex:"lastActiveTime",key:"lastActiveTime",sorter:(e,t)=>e.lastActiveTime.localeCompare(t.lastActiveTime)}];return i.jsx(y,{columns:c,data:l,keyExtractor:e=>e.id,searchable:!0,renderTitle:p})}export{V as default};