import{al as E,az as A,r as d,ap as l,aq as p}from"./index-DPONv-AB.js";import{a as F,t as B,an as L,S as m,T as M,P as R,o as j}from"./MyApp-DEIUhxeN.js";import{u as g}from"./useForceStop-BfgY8bIa.js";import q from"./MyTable-XIw2FkM-.js";import{E as z}from"./ExportButton-CiFHU8Ur.js";import{u as $,g as I}from"./useCacheState-CJv9KMn_.js";import{I as H}from"./index-Dcy0fSW9.js";import{T as J}from"./index-DRtX_-IA.js";import{A as K}from"./index-D0n73TLw.js";import"./styleChecker-CyKTA426.js";import"./addEventListener-DR_NM1NW.js";import"./index-HNqxY7iK.js";import"./PurePanel-DNavI3ZW.js";import"./TextArea-1Q1I5EX3.js";import"./index-C-h6N-6y.js";import"./index-nAq8iqIJ.js";import"./Dropdown-BxPBQoTL.js";import"./Pagination-2Ahrgyjg.js";import"./row-CuIGguQJ.js";import"./file-download-Db6M2NsT.js";function pe({target:n}){const{ti:s}=F(),{message:w}=E.useApp(),C=A(),b=g(),[h,u]=d.useState(!1),[o,x]=$("CheckedIns.data."+(n==null?void 0:n.id),[]),t=d.useMemo(()=>{const a=new Map,e=new Map;return o.forEach(i=>{a.has(i.place)||a.set(i.place,i),e.has(i.pageId)||e.set(i.pageId,i)}),{allPlaces:Array.from(a.values()),allPages:Array.from(e.values())}},[o]);d.useEffect(()=>{var a;n!=null&&n.id&&f(!((a=I("CheckedIns.data."+(n==null?void 0:n.id)))!=null&&a.length))},[n==null?void 0:n.id]);const f=async(a=!1)=>{var y,v;if(!(n!=null&&n.id))return;const e=b.start();let r=[...a?[]:I("CheckedIns.data."+(n==null?void 0:n.id))||[]],k=((y=r[r.length-1])==null?void 0:y.cursor)||"";const P="CheckedIns:onReload:"+n.id;B(P),u(!0);try{for(;!e.value();){const c=await L({uid:n.id,cursor:k});if(!(c!=null&&c.length))break;k=(v=c[c.length-1])==null?void 0:v.cursor,r=[...r,...c].map((T,D)=>({...T,recent:D})),x(r)}}catch(c){w.error({content:s({en:"Error: ",vi:"Lỗi: "})+c.message})}finally{x(r),u(!1)}},N=a=>{C("/bulk-downloader",{state:{targetId:a,platform:R.Facebook}})},_=a=>l.jsxs(m,{children:[l.jsx(p,{disabled:h,type:"primary",icon:h?l.jsx("i",{className:"fa-solid fa-rotate-right fa-spin"}):l.jsx("i",{className:"fa-solid fa-rotate-right"}),onClick:()=>f(!0),children:s({en:"Reload",vi:"Tải lại"})}),l.jsx(z,{data:a.length?a:o,options:[{key:"id",label:".txt (page id)",prepareData:e=>({fileName:(n==null?void 0:n.name)+"_check_in_id.txt",data:e.map(i=>i.pageId).join(`
`)})},{key:"id_name",label:".csv (page id+name)",prepareData:e=>({fileName:(n==null?void 0:n.name)+"_check_in_id_name.csv",data:j(e.map(i=>({page:i.pageId,name:i.pageName,place:i.place})))})},{key:"json",label:".json",prepareData:e=>({fileName:(n==null?void 0:n.name)+"_check_in.json",data:JSON.stringify(e,null,4)})},{key:"csv",label:".csv",prepareData:e=>({fileName:(n==null?void 0:n.name)+"_check_in.csv",data:j(e)})}]}),l.jsx(p,{onClick:()=>{var e;(e=n==null?void 0:n.url)!=null&&e.includes("?id=")?window.open((n==null?void 0:n.url)+"&sk=map","_blank"):window.open((n==null?void 0:n.url)+"/map","_blank")},icon:l.jsx("i",{className:"fa fa-external-link-alt"}),children:s({vi:"Xem trên Facebook",en:"View on Facebook"})},"view-fb")]}),S=[{title:"#",dataIndex:"recent",key:"recent",render:(a,e,i)=>(e.recent||0)+1,sorter:(a,e)=>a.recent-e.recent,width:60},{title:s({en:"Cover",vi:"Ảnh"}),key:"cover",dataIndex:"image",render:(a,e,i)=>l.jsx(H,{src:e.image,style:{width:120,height:120,objectFit:"contain"}}),width:120},{title:t.allPages.length+" "+s({en:"Page",vi:"Trang"}),key:"name",dataIndex:"name",sorter:(a,e)=>a.pageName.localeCompare(e.pageName),render:(a,e,i)=>l.jsxs(m,{direction:"vertical",style:{maxWidth:250},children:[l.jsx(J.Link,{href:e.url,target:"_blank",children:l.jsx("b",{children:e.pageName})}),l.jsx("span",{style:{opacity:.6},children:e.pageId})]}),filters:t.allPages.map(a=>{let e=o.filter(i=>i.pageId===a.pageId).length;return{count:e,value:a.pageId,text:a.pageName+" ("+e+")"}}).sort((a,e)=>e.count-a.count),onFilter:(a,e)=>e.pageId==a,filterSearch:!0},{title:t.allPlaces.length+" "+s({en:"Place",vi:"Địa điểm"}),key:"place",dataIndex:"place",sorter:(a,e)=>a.place.localeCompare(e.place),filters:t.allPlaces.map(a=>{let e=o.filter(i=>i.place===a.place).length;return{count:e,value:a.place,text:a.place+" ("+e+")"}}).sort((a,e)=>e.count-a.count),onFilter:(a,e)=>e.place==a,filterSearch:!0,width:200},{title:s({en:"Time",vi:"Thời gian"}),key:"timeString",dataIndex:"timeString",sorter:(a,e)=>a.timeString.localeCompare(e.timeString),width:250},{title:s({en:"Actions",vi:"Hành động"}),key:"actions",render:(a,e,i)=>l.jsx(m.Compact,{children:l.jsx(M,{title:s({en:"Bulk Downloader",vi:"Tải hàng loạt"}),children:l.jsx(p,{type:"default",onClick:()=>N(e.pageId),icon:l.jsx("i",{className:"fa-solid fa-download"})})})}),width:100,align:"end"}];return l.jsxs("div",{style:{display:"flex",flexDirection:"column",width:"100%",height:"100%"},children:[l.jsx(K,{type:"success",showIcon:!0,message:s({en:`Checked in ${o.length} times`,vi:`Đã check in ${o.length} lần`}),style:{alignSelf:"center",marginBottom:10}}),l.jsx(q,{columns:S,data:o,keyExtractor:a=>a==null?void 0:a.id,searchable:!0,pageSize:3,renderTitle:_})]})}export{pe as default};