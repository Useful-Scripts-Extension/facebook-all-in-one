const __vite__fileDeps=["./ImageLazyPreview-xv8yG_kA.js","./index-CRvEVTea.js","./index-BM_p-30O.css","./MyApp-CMaP2Sb_.js","./index-CJIHXz_-.js","./addEventListener-BNkLVAlq.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{r as t,ao as e,as as f}from"./index-CRvEVTea.js";import{C as h}from"./Collection-DdkBumAB.js";import{Q as x,U as b,W as v}from"./MyApp-CMaP2Sb_.js";import{c as y,M as d}from"./albums-BD4RcxZQ.js";import{b as p}from"./videos-CJhsrVe3.js";import{L as w}from"./index-Ca-PWtTS.js";import{I as _}from"./index-CJIHXz_-.js";import"./index-BOjVh4nR.js";import"./file-download-DNZaHCKN.js";import"./index-C20GkxZm.js";import"./Dropdown-CwDNI70S.js";import"./PurePanel-D2b6DsEN.js";import"./index-BuegEcvQ.js";import"./index-DhqHC3Qt.js";import"./index-siwkbsPy.js";import"./TextArea-CIhCrYWI.js";import"./addEventListener-BNkLVAlq.js";import"./index-WuE-WRtK.js";import"./Pagination-CQHdhERb.js";import"./useBreakpoint-CXECHXlA.js";import"./responsiveObserver-zyRHL_Wn.js";import"./row-73W9qzy3.js";const g=t.lazy(()=>f(()=>import("./ImageLazyPreview-xv8yG_kA.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url));function U({target:i,albumId:c,album:a}){const s=c||a.id,l=t.useCallback(async(r=[],o)=>{var n;return s?await y({albumId:s,accessToken:await x(b.EAAB),fromId:o||((n=r[r.length-1])==null?void 0:n.id)||""}):void 0},[s]),u=t.useCallback(r=>e.jsx(w.Item,{children:r.type==d.IMAGE?e.jsx(_,{src:r.uri,width:150,height:150,style:{objectFit:"cover",borderRadius:"10px"}}):e.jsx(g,{src:r.uri,width:150,height:150,style:{objectFit:"cover",borderRadius:"10px"},cacheId:"album_video."+r.id,getPreview:()=>p(r.id).then(o=>o.source),renderPreview:(o,m)=>({destroyOnClose:!0,imageRender:()=>e.jsx(v,{spinning:m,children:e.jsx("video",{autoPlay:!0,controls:!0,loop:!0,src:o,style:{maxWidth:"90vw",maxHeight:"90vh"}})}),toolbarRender:()=>null})})}),[]),I=t.useCallback(async r=>r.type==d.IMAGE?{url:r.uri,name:r.id+".jpg"}:{url:(await p(r.id)).source,name:r.id+".mp4"},[]);return e.jsx(h,{collectionName:(i==null?void 0:i.name)+" - Album "+a.name,fetchNext:l,renderItem:u,downloadItem:I,getItemCursor:r=>r.id,rowKey:r=>r.id})}export{U as default};