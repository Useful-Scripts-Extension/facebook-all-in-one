const __vite__fileDeps=["./ArchivedStoryViewer-CGGg5re7.js","./index-Dr7iwqFJ.js","./index-DjlRUb8J.css","./MyApp-SgVvcLTS.js","./StoryViewers-qLdzCPdd.js","./Collection-KPxlgEIG.js","./index-BShARpkz.js","./file-download-CU3pgXeX.js","./index-2RbUPnEv.js","./Dropdown-DVP9hn2B.js","./PurePanel-2i0e5CRq.js","./index-C73Ennn6.js","./index-D_9GvxQS.js","./index-zO62XQst.js","./index-9UmCmLZp.js","./addEventListener-CVzCf-F4.js","./index-B38jYVtf.js","./index-CxBY9qFN.js","./Pagination-BzDV8G9K.js","./useBreakpoint-CyKi7tq9.js","./responsiveObserver-Cxm5vVGf.js","./row-CNXrKCSL.js","./index-BRGcfHWb.js","./stories-Dca11XNc.js","./index-DcOpXGxK.js","./index-CT4y-2p9.js","./index-DlGfn2zt.js","./index-BGEs1Jgx.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{r as c,ao as o,as as h,ap as f}from"./index-Dr7iwqFJ.js";import{a as g,t as u,S as x,f as v,q as w,x as b,G as j}from"./MyApp-SgVvcLTS.js";import{C as y}from"./Collection-KPxlgEIG.js";import{d as _,e as S}from"./stories-Dca11XNc.js";import{L as k}from"./index-CxBY9qFN.js";import{I as A}from"./index-DlGfn2zt.js";import{T as C}from"./index-9UmCmLZp.js";import"./index-BShARpkz.js";import"./file-download-CU3pgXeX.js";import"./index-2RbUPnEv.js";import"./Dropdown-DVP9hn2B.js";import"./PurePanel-2i0e5CRq.js";import"./index-C73Ennn6.js";import"./index-D_9GvxQS.js";import"./index-zO62XQst.js";import"./addEventListener-CVzCf-F4.js";import"./index-B38jYVtf.js";import"./index-BRGcfHWb.js";import"./Pagination-BzDV8G9K.js";import"./useBreakpoint-CyKi7tq9.js";import"./responsiveObserver-Cxm5vVGf.js";import"./row-CNXrKCSL.js";const T=c.lazy(()=>h(()=>import("./ArchivedStoryViewer-CGGg5re7.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url));function W(){const{ti:s}=g();c.useEffect(()=>{u("ArchivedStories:onLoad")},[]);const m=async(e,r)=>{var t;return await _(r||((t=e==null?void 0:e[e.length-1])==null?void 0:t.cursor)||"")},d=(e,r)=>o.jsxs(k.Item,{children:[o.jsx(A,{src:e.thumbnail,style:{width:160,height:270,borderRadius:10,objectFit:"cover"},preview:{destroyOnClose:!0,toolbarRender:()=>null,imageRender:()=>o.jsx(T,{story:e})}}),o.jsx(x,{direction:"vertical",style:{background:"linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)",position:"absolute",bottom:0,left:0,width:"100%",padding:"5px 10px",paddingTop:"50px",pointerEvents:"none"},children:o.jsxs(C.Text,{style:{color:"#ccc"},children:[o.jsxs("span",{children:[o.jsx("i",{className:"fa fa-eye"})," ",e.seen_count]}),o.jsx("br",{}),v(new Date(e.creation_time),s({en:"en-US",vi:"vi-VN"}))]})})]}),p=async e=>{const r="ArchivedStoryViewer.stories."+e.creation_time,a=w(r)||await S({creationTime:e.creation_time});b(r,a);const t=a.find(i=>i.id===e.id),n=j(new Date(e.creation_time));return[{url:(t==null?void 0:t.video)||(t==null?void 0:t.image)||"",name:n+(t!=null&&t.video?".mp4":".jpg")},{url:(t==null?void 0:t.image_background)||"",name:n+"_bg.jpg"}].filter(i=>i==null?void 0:i.url)},l=e=>o.jsx(f,{onClick:()=>{window.open("https://www.facebook.com/me/allactivity?log_filter=archivedstories","_blank")},icon:o.jsx("i",{className:"fa fa-external-link-alt"}),children:s({vi:"Xem trên Facebook",en:"View on Facebook"})},"view-fb");return o.jsx(y,{collectionName:"Archived Stories",fetchNext:m,renderItem:d,downloadItem:p,headerButtons:l,getItemCursor:e=>e==null?void 0:e.cursor,rowKey:e=>e.id})}export{W as default};