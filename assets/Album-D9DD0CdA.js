const __vite__fileDeps=["./ImageLazyPreview-Dde7GKAx.js","./index-DNe3TpmC.js","./index-DfqnkV-X.css","./MyApp-B8-XFWgd.js","./index-BqvIGLJl.js","./EyeOutlined-B6DEd6MW.js","./addEventListener-BDJVQsXr.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{r as t,av as r,aw as f,aA as g}from"./index-DNe3TpmC.js";import{C as I}from"./Collection-CH7UsUTL.js";import{a4 as b,a5 as x,ac as v,g as w}from"./MyApp-B8-XFWgd.js";import{c as y,M as d}from"./albums-DvPZ2DyS.js";import{g as p}from"./videos-DiW7D00z.js";import{V as j}from"./VideoWithMuted-DT-q-hpv.js";import{L as _}from"./index-DaDt8ROK.js";import{I as A}from"./index-BqvIGLJl.js";import"./index-CV_0RlSh.js";import"./file-download-DhkHLYQw.js";import"./index-BdR4yKC-.js";import"./Dropdown-lYyKpHLC.js";import"./PurePanel-C3pjtKot.js";import"./index-BCvA7jIF.js";import"./index-CxZ5ogJz.js";import"./index-DsmVa8PS.js";import"./EyeOutlined-B6DEd6MW.js";import"./SearchOutlined-DY3UxkQC.js";import"./index-kpVz-8it.js";import"./Pagination-Z2olITT6.js";import"./useBreakpoint-BdpfApVB.js";import"./responsiveObserver-2hddCHZH.js";import"./index-DvXIoaIu.js";import"./row-BnQOUX7B.js";import"./addEventListener-BDJVQsXr.js";const E=t.lazy(()=>g(()=>import("./ImageLazyPreview-Dde7GKAx.js"),__vite__mapDeps([0,1,2,3,4,5,6]),import.meta.url));function Z({target:i,albumId:l,album:a}){const s=l||a.id,c=t.useCallback(async(o=[],e)=>{var n;return s?await y({albumId:s,accessToken:await b(x.EAAB),fromId:e||((n=o[o.length-1])==null?void 0:n.id)||""}):void 0},[s]),u=t.useCallback(o=>r.jsxs(_.Item,{className:"show-on-hover-trigger",children:[o.type==d.IMAGE?r.jsx(A,{src:o.uri,width:150,height:150,style:{objectFit:"cover",borderRadius:"10px"}}):r.jsx(E,{src:o.uri,width:150,height:150,style:{objectFit:"cover",borderRadius:"10px"},cacheId:"album_video."+o.id,getPreview:()=>p(o.id).then(e=>e.source),renderPreview:(e,m)=>({destroyOnClose:!0,imageRender:()=>r.jsx(v,{spinning:m,children:r.jsx(j,{src:e,style:{maxWidth:"90vw",maxHeight:"90vh"}})}),toolbarRender:()=>null})}),r.jsx(f,{type:"default",icon:r.jsx("i",{className:"fa-solid fa-up-right-from-square"}),style:{position:"absolute",bottom:10,right:10},className:"show-on-hover-item",target:"_blank",href:w(o.id)})]}),[]),h=t.useCallback(async o=>o.type==d.IMAGE?{url:o.uri,name:o.id+".jpg"}:{url:(await p(o.id)).source,name:o.id+".mp4"},[]);return r.jsx(I,{collectionName:(i==null?void 0:i.name)+" - Album "+a.name,fetchNext:c,renderItem:u,downloadItem:h,getItemCursor:o=>o.id,rowKey:o=>o.id})}export{Z as default};