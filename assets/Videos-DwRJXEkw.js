const __vite__fileDeps=["./ImageLazyPreview-C-11-MGA.js","./index-BMyuObdO.js","./index-DMsVN2Hl.css","./MyApp-CIOfTwJw.js","./index-B6Fsbq1o.js","./addEventListener-lxefO61D.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{r as p,ar as e,ax as u}from"./index-BMyuObdO.js";import{U as h,B as x,a5 as f,a6 as v}from"./MyApp-CIOfTwJw.js";import{C as y}from"./Collection-mJRNlwQT.js";import{g as w,a as I,b as d}from"./index-BxKdYS7A.js";import{L as b}from"./index-BIVbQZmB.js";import"./index-DBmigc9r.js";import"./file-download-B9IWrMaY.js";import"./index-NJSF5PH1.js";import"./Dropdown-tas4I0bP.js";import"./PurePanel-DQJC-DMk.js";import"./index-Ca2hj0h8.js";import"./index-toMHYDV0.js";import"./index-B8bbcs-q.js";import"./index-CTnwZgWp.js";import"./addEventListener-lxefO61D.js";import"./index-CCn1OFS3.js";import"./index-Dn2DQkyO.js";import"./index-BQT7z3C8.js";import"./responsiveObserver-CmpGC2F4.js";import"./useBreakpoint-DsaGC9Dp.js";import"./index-fAP62-KX.js";import"./index-BezmfSvf.js";import"./index-ByJuuTE0.js";import"./index-B6Fsbq1o.js";import"./index-CXWj1xGA.js";import"./Pagination-CBDsRBgw.js";import"./row-Cn0VLpf-.js";const j=p.lazy(()=>u(()=>import("./ImageLazyPreview-C-11-MGA.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url));function X({target:i}){const n=p.useCallback(async(o=[],s)=>{var m;return!(i!=null&&i.id)||!(i!=null&&i.type)?void 0:(s=s||((m=o==null?void 0:o[(o==null?void 0:o.length)-1])==null?void 0:m.cursor)||"",((i==null?void 0:i.type)===h.Group?await w({id:i==null?void 0:i.id,cursor:s}):await I({id:i==null?void 0:i.id,cursor:s})).videos)},[i]),l=p.useCallback(async o=>{if(!o.source){const s=await d(o.id);o.source=s.source}return{url:o.source,name:o.id+".mp4"}},[]),c=p.useCallback(o=>e.jsx(b.Item,{children:e.jsx(x.Ribbon,{text:o.length?f(o.length):null,children:e.jsx(j,{src:o.picture,width:200,height:200,style:{objectFit:"cover"},cacheId:"video."+o.id,getPreview:()=>o.source||d(o.id).then(s=>s.source),renderPreview:(s,r)=>({destroyOnClose:!0,imageRender:()=>e.jsx(v,{spinning:r,children:e.jsx("video",{autoPlay:!0,controls:!0,loop:!0,src:s,style:{maxWidth:"90vw",maxHeight:"90vh"}})}),toolbarRender:()=>null})})})}),[]);return e.jsx(y,{collectionName:(i==null?void 0:i.name)+" - Videos",fetchNext:n,renderItem:c,downloadItem:l,getItemCursor:o=>o.cursor,rowKey:o=>o.id})}export{X as default};