const __vite__fileDeps=["./ImageLazyPreview-BgHX5ygG.js","./index-CCfKz_oT.js","./index-DjlRUb8J.css","./MyApp-B1qRT6WQ.js","./index-Hj-lKCnz.js","./addEventListener--TAsDliT.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{r as d,ao as e,as as u}from"./index-CCfKz_oT.js";import{G as h,B as x,V as f,W as v}from"./MyApp-B1qRT6WQ.js";import{C as y}from"./Collection-C_I_LpgA.js";import{g as w,a as I,b as r}from"./videos-Begg9Fx1.js";import{L as b}from"./index-BDdjzTAi.js";import"./index-Djms9Xly.js";import"./file-download-CgOSCqiU.js";import"./index-Bud0akQU.js";import"./Dropdown-Bo-JhRkI.js";import"./PurePanel-BI7rUu8x.js";import"./index-DOUV9GAF.js";import"./index-BFRJjYS9.js";import"./index-CC-F51kS.js";import"./TextArea-Cs1N929r.js";import"./addEventListener--TAsDliT.js";import"./index-CrWHF4PJ.js";import"./Pagination-BU6JYbRe.js";import"./useBreakpoint-DG55c3XM.js";import"./responsiveObserver-amYYf774.js";import"./row-DczJeMRu.js";const j=d.lazy(()=>u(()=>import("./ImageLazyPreview-BgHX5ygG.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url));function K({target:i}){const l=d.useCallback(async(o=[],s)=>{var p;return!(i!=null&&i.id)||!(i!=null&&i.type)?void 0:(s=s||((p=o==null?void 0:o[(o==null?void 0:o.length)-1])==null?void 0:p.cursor)||"",((i==null?void 0:i.type)===h.Group?await w({id:i==null?void 0:i.id,cursor:s}):await I({id:i==null?void 0:i.id,cursor:s})).videos)},[i]),m=d.useCallback(async o=>{if(!o.source){const s=await r(o.id);o.source=s.source}return{url:o.source,name:o.id+".mp4"}},[]),c=d.useCallback(o=>e.jsx(b.Item,{children:e.jsx(x.Ribbon,{text:o.length?f(o.length):null,children:e.jsx(j,{src:o.picture,width:200,height:200,style:{objectFit:"cover"},cacheId:"video."+o.id,getPreview:()=>o.source||r(o.id).then(s=>s.source),renderPreview:(s,n)=>({destroyOnClose:!0,imageRender:()=>e.jsx(v,{spinning:n,children:e.jsx("video",{autoPlay:!0,controls:!0,loop:!0,src:s,style:{maxWidth:"90vw",maxHeight:"90vh"}})}),toolbarRender:()=>null})})})}),[]);return e.jsx(y,{collectionName:(i==null?void 0:i.name)+" - Videos",fetchNext:l,renderItem:c,downloadItem:m,getItemCursor:o=>o.cursor,rowKey:o=>o.id})}export{K as default};