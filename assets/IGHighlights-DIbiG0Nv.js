import{r as e,ao as t}from"./index-Dr7iwqFJ.js";import{$ as n}from"./MyApp-SgVvcLTS.js";import{C as c}from"./Collection-KPxlgEIG.js";import{g as u,a as f}from"./highlights-CcS6JMUI.js";import{L as h}from"./index-CxBY9qFN.js";import{I as x}from"./index-DlGfn2zt.js";import"./index-BShARpkz.js";import"./file-download-CU3pgXeX.js";import"./index-2RbUPnEv.js";import"./Dropdown-DVP9hn2B.js";import"./PurePanel-2i0e5CRq.js";import"./index-C73Ennn6.js";import"./index-D_9GvxQS.js";import"./index-zO62XQst.js";import"./index-9UmCmLZp.js";import"./addEventListener-CVzCf-F4.js";import"./index-B38jYVtf.js";import"./index-BRGcfHWb.js";import"./index-B4oJR9YY.js";import"./feeds-BpSKFNRV.js";import"./index-vuHwb1ab.js";import"./index-DcOpXGxK.js";import"./responsiveObserver-Cxm5vVGf.js";import"./useBreakpoint-CyKi7tq9.js";import"./index-CT4y-2p9.js";import"./index-o3PxMQxL.js";import"./index-BGEs1Jgx.js";import"./index-B2WEsI3G.js";import"./Pagination-BzDV8G9K.js";import"./row-CNXrKCSL.js";function T({target:r,onOpenHighlight:s}){const p=e.useCallback(async(i=[])=>r!=null&&r.id?i.length?[]:await u(r.id):void 0,[r]),a=e.useCallback(i=>t.jsxs(h.Item,{children:[t.jsx(x,{src:i.cover,width:100,height:100,style:{objectFit:"cover",borderRadius:"50%",cursor:"pointer"},preview:!1,onClick:()=>{s==null||s(i)}}),t.jsx("a",{href:"https://www.instagram.com/stories/highlights/"+i.id.split(":")[1],target:"_blank",style:{display:"block",wordWrap:"break-word",maxWidth:100,padding:5,fontWeight:"bold",textAlign:"center",fontSize:"1em"},title:i.title,children:n(i.title,30)})]}),[]),l=e.useCallback(async(i,d)=>(await f(i.id)).map(o=>{const m=!!o.video;return{url:m?o.video:o.image,name:o.id+(m?".mp4":".jpg")}}),[]);return t.jsx(c,{collectionName:(r==null?void 0:r.igName)+" - IG Highlights",fetchNext:p,renderItem:a,downloadItem:l,rowKey:i=>i.id})}export{T as default};