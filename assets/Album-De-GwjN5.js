const __vite__fileDeps=["./ImageLazyPreview-Bu7oD7wU.js","./index-C0Tuo7Vh.js","./index-BM_p-30O.css","./MyApp-Dl644HTJ.js","./index-D--cvhvb.js","./addEventListener-KPFk0H-o.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{r as t,ao as e,as as f}from"./index-C0Tuo7Vh.js";import{C as h}from"./Collection-GdYc8TOu.js";import{Q as x,U as b,W as v}from"./MyApp-Dl644HTJ.js";import{c as y,M as d}from"./albums-Si5As9S4.js";import{b as p}from"./videos-DdTfxpKD.js";import{L as w}from"./index-BpcsSGNe.js";import{I as _}from"./index-D--cvhvb.js";import"./index-C7l1_kqS.js";import"./file-download-DDM1kl3y.js";import"./index-Bc2TOSs9.js";import"./Dropdown-CfC0zFLy.js";import"./PurePanel-CXpZVn6W.js";import"./index-BiYVQeu3.js";import"./index-fna94_c_.js";import"./index-BJGgnfrs.js";import"./TextArea-VrntzyAe.js";import"./addEventListener-KPFk0H-o.js";import"./index-CLq-agga.js";import"./Pagination-CAvsMqnw.js";import"./useBreakpoint-qnzCDWO-.js";import"./responsiveObserver-BG2XAw38.js";import"./row-DU3SUC4b.js";const g=t.lazy(()=>f(()=>import("./ImageLazyPreview-Bu7oD7wU.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url));function U({target:i,albumId:c,album:a}){const s=c||a.id,l=t.useCallback(async(r=[],o)=>{var n;return s?await y({albumId:s,accessToken:await x(b.EAAB),fromId:o||((n=r[r.length-1])==null?void 0:n.id)||""}):void 0},[s]),u=t.useCallback(r=>e.jsx(w.Item,{children:r.type==d.IMAGE?e.jsx(_,{src:r.uri,width:150,height:150,style:{objectFit:"cover",borderRadius:"10px"}}):e.jsx(g,{src:r.uri,width:150,height:150,style:{objectFit:"cover",borderRadius:"10px"},cacheId:"album_video."+r.id,getPreview:()=>p(r.id).then(o=>o.source),renderPreview:(o,m)=>({destroyOnClose:!0,imageRender:()=>e.jsx(v,{spinning:m,children:e.jsx("video",{autoPlay:!0,controls:!0,loop:!0,src:o,style:{maxWidth:"90vw",maxHeight:"90vh"}})}),toolbarRender:()=>null})})}),[]),I=t.useCallback(async r=>r.type==d.IMAGE?{url:r.uri,name:r.id+".jpg"}:{url:(await p(r.id)).source,name:r.id+".mp4"},[]);return e.jsx(h,{collectionName:(i==null?void 0:i.name)+" - Album "+a.name,fetchNext:l,renderItem:u,downloadItem:I,getItemCursor:r=>r.id,rowKey:r=>r.id})}export{U as default};