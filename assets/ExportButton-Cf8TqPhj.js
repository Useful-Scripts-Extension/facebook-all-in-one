import{an as u,aq as t,ar as x}from"./index-BlMbGBxO.js";import{u as E,t as g}from"./MyApp-BL8Q7-Io.js";import{f as k}from"./file-download-CyQ4y_UN.js";import{D as d}from"./index-D4ZiLJJ2.js";function w({data:n,children:p,options:i}){const{message:m}=u.useApp(),{ti:s}=E(),c=r=>{var e,a;if(!(n!=null&&n.length))return m.error(s({en:"No data to export",vi:"Không có dữ liệu"}));const o=(a=(e=i.find(f=>f.key==r))==null?void 0:e.prepareData)==null?void 0:a.call(e,n);o!=null&&o.data&&(g("onClickExport:"+r+":"+o.fileName),k(o.data,o.fileName))},l=i.map(({key:r,label:o})=>({key:r,label:o}));return t.jsx(d,{menu:{items:l,onClick:r=>c(r.key)},children:p||t.jsx(x,{type:"primary",icon:t.jsx("i",{className:"fa-solid fa-download"}),children:s({en:"Export",vi:"Xuất"})+" "+n.length})})}export{w as E};