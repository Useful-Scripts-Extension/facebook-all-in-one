const __vite__fileDeps=["./ImageLazyPreview-DJcTXhf3.js","./index-CYpLH5g_.js","./index-Gp9RWSdI.css","./MyApp-C_JP8LI6.js","./index-BN8pdf5P.js","./addEventListener-B9GsE34w.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{r as p,ap as e,av as u}from"./index-CYpLH5g_.js";import{O as h,B as x,a2 as f,a3 as v}from"./MyApp-C_JP8LI6.js";import{C as y}from"./Collection-DzMUx48F.js";import{g as w,a as I,b as d}from"./index-WTN6nONE.js";import{L as b}from"./index-DjBtHGH9.js";import"./index-423Ncue-.js";import"./file-download-DoJL6rir.js";import"./index-CCeCpUmS.js";import"./Dropdown-C01ZSSkl.js";import"./PurePanel-oNlWaC93.js";import"./index-BUBnSZKO.js";import"./index-DXNQQjwE.js";import"./index-BuifVuaE.js";import"./TextArea-CxzCtomR.js";import"./addEventListener-B9GsE34w.js";import"./index-Bi_qGZtV.js";import"./index-DYJtd_HB.js";import"./index-DMAJh8Zr.js";import"./responsiveObserver-AVMs_nQf.js";import"./useBreakpoint-Dni_odvQ.js";import"./index-Bci4n2cu.js";import"./index-CBtNpsEp.js";import"./index-laBmw7XI.js";import"./index-BN8pdf5P.js";import"./index-DMhAqJWf.js";import"./index-BD7bUhBw.js";import"./Pagination-DY77cMXH.js";import"./row-adRy9scd.js";const j=p.lazy(()=>u(()=>import("./ImageLazyPreview-DJcTXhf3.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url));function Y({target:i}){const n=p.useCallback(async(o=[],s)=>{var m;return!(i!=null&&i.id)||!(i!=null&&i.type)?void 0:(s=s||((m=o==null?void 0:o[(o==null?void 0:o.length)-1])==null?void 0:m.cursor)||"",((i==null?void 0:i.type)===h.Group?await w({id:i==null?void 0:i.id,cursor:s}):await I({id:i==null?void 0:i.id,cursor:s})).videos)},[i]),l=p.useCallback(async o=>{if(!o.source){const s=await d(o.id);o.source=s.source}return{url:o.source,name:o.id+".mp4"}},[]),c=p.useCallback(o=>e.jsx(b.Item,{children:e.jsx(x.Ribbon,{text:o.length?f(o.length):null,children:e.jsx(j,{src:o.picture,width:200,height:200,style:{objectFit:"cover"},cacheId:"video."+o.id,getPreview:()=>o.source||d(o.id).then(s=>s.source),renderPreview:(s,r)=>({destroyOnClose:!0,imageRender:()=>e.jsx(v,{spinning:r,children:e.jsx("video",{autoPlay:!0,controls:!0,loop:!0,src:s,style:{maxWidth:"90vw",maxHeight:"90vh"}})}),toolbarRender:()=>null})})})}),[]);return e.jsx(y,{collectionName:(i==null?void 0:i.name)+" - Videos",fetchNext:n,renderItem:c,downloadItem:l,getItemCursor:o=>o.cursor,rowKey:o=>o.id})}export{Y as default};