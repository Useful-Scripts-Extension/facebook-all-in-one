import{ao as e,ap as l}from"./index-C0Tuo7Vh.js";import{b as h,a as p,t as f,S as s,B as u,f as x}from"./MyApp-Dl644HTJ.js";import{P as j}from"./index-Ktf3kSUs.js";import{L as y}from"./index-BpcsSGNe.js";import{T as o}from"./index-BxR4uxUX.js";import"./Pagination-CAvsMqnw.js";import"./useBreakpoint-qnzCDWO-.js";import"./responsiveObserver-BG2XAw38.js";import"./index-CLq-agga.js";import"./PurePanel-CXpZVn6W.js";import"./TextArea-VrntzyAe.js";import"./row-DU3SUC4b.js";import"./styleChecker-D9_ZzGCE.js";function N(t){switch(t){case"success":return e.jsx("i",{className:"fa-solid fa-circle-check fa-lg",style:{color:"lightgreen"}});case"info":return e.jsx("i",{className:"fa-solid fa-circle-info fa-lg",style:{color:"lightblue"}});case"warning":return e.jsx("i",{className:"fa-solid fa-circle-exclamation fa-lg",style:{color:"orange"}});case"error":return e.jsx("i",{className:"fa-solid fa-circle-xmark fa-lg",style:{color:"red"}});default:return null}}function W(){const{notifications:t,clearNotifications:n}=h(),{ti:r}=p(),c=(a,m)=>{var i;return e.jsxs(s,{align:"start",style:{paddingTop:10},children:[N(a.type),x(a.time),e.jsxs(s,{direction:"vertical",size:0,style:{maxWidth:400},children:[e.jsx(o.Text,{children:a.message}),(i=a.description)==null?void 0:i.split(`
`).map((d,g)=>e.jsx(o.Text,{type:"secondary",children:d},m+"_"+g))]})]})};return e.jsx(j,{trigger:"click",placement:"bottomRight",title:t!=null&&t.length?null:r({en:"Notification History",vi:"Lich sử Thông báo"}),onOpenChange:a=>a&&f("Notifications:open"),content:e.jsx(y,{header:t!=null&&t.length?e.jsxs(s,{align:"end",style:{width:"100%",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("h3",{style:{margin:0},children:(t==null?void 0:t.length)+r({en:" Notifications",vi:" Thông báo"})}),e.jsx(l,{icon:e.jsx("i",{className:"fa-solid fa-eraser"}),onClick:n,children:r({en:"Clear",vi:"Xóa"})})]}):null,dataSource:(t||[]).toReversed(),renderItem:c,rowKey:a=>a.id,pagination:{defaultPageSize:5,showSizeChanger:!0,hideOnSinglePage:!0},style:{maxWidth:500,minWidth:250}}),children:e.jsx(u,{count:(t==null?void 0:t.length)||0,overflowCount:9,style:{color:"white"},children:e.jsx(l,{icon:e.jsx("i",{className:"fa-solid fa-bell"})})})})}export{W as default};