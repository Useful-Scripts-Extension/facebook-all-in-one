const __vite__fileDeps=["./VideoViewer-B4cizs5E.js","./index-B5YEMzhB.js","./index-DfqnkV-X.css","./VideoWithMuted-p9imgUip.js","./MyApp-CooQqMaa.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{r,av as e,aw as u,aA as h}from"./index-B5YEMzhB.js";import{P as a,B as f,ab as x,ac as b,g as v}from"./MyApp-CooQqMaa.js";import{C as w}from"./Collection-vrn7NkS_.js";import{a as t,b as y,g as p}from"./videos-DxLssTMh.js";import j from"./ImageLazyPreview-vpbgVEOK.js";import{L as I}from"./index-BH6SEpZH.js";import"./index-CylBeleN.js";import"./file-download-BaT8Hckd.js";import"./index-CIodLJLq.js";import"./Dropdown-JUOFUREu.js";import"./PurePanel-wqQd8Myk.js";import"./index-ibrdsRv_.js";import"./index-dXUGRtjW.js";import"./index-exzROlgN.js";import"./EyeOutlined-B_RZJsOq.js";import"./SearchOutlined-C9IiDL4U.js";import"./index-DPvtkcNf.js";import"./index-zm4LZ0v2.js";import"./addEventListener-DlfUuwjy.js";import"./Pagination-Tj68aaA4.js";import"./useBreakpoint-BukqLEF8.js";import"./responsiveObserver-C5CSgOYP.js";import"./index-D1gpnrtJ.js";import"./row-B3ZTfJBt.js";const V=r.lazy(()=>h(()=>import("./VideoViewer-B4cizs5E.js"),__vite__mapDeps([0,1,2,3,4]),import.meta.url));function X({target:i}){const l=r.useCallback(async(o=[],s)=>{var d;return!(i!=null&&i.id)||!(i!=null&&i.type)?void 0:(s=s||((d=o==null?void 0:o[(o==null?void 0:o.length)-1])==null?void 0:d.cursor)||"",((i==null?void 0:i.type)===a.Group?await t({id:i==null?void 0:i.id,cursor:s}):await y({id:i==null?void 0:i.id,cursor:s})).videos)},[i]),n=r.useCallback(async o=>{if(!o.source){const s=await p(o.id);o.source=s.source}return{url:o.source,name:o.id+".mp4"}},[]),c=r.useCallback(o=>e.jsx(I.Item,{className:"show-on-hover-trigger",children:e.jsxs(f.Ribbon,{text:o.length?x(o.length):null,children:[e.jsx(j,{src:o.picture,width:200,height:200,style:{objectFit:"cover",borderRadius:10},cacheId:"video."+o.id,getPreview:()=>o.source||p(o.id),renderPreview:(s,m)=>({destroyOnClose:!0,imageRender:()=>e.jsx(b,{spinning:m,children:e.jsx(V,{info:s,style:{maxWidth:"90vw",maxHeight:"90vh"}})}),toolbarRender:()=>null})}),e.jsx(u,{type:"default",icon:e.jsx("i",{className:"fa-solid fa-up-right-from-square"}),style:{position:"absolute",bottom:10,right:10},className:"show-on-hover-item",target:"_blank",href:v(o.id)})]})}),[]);return e.jsx(w,{collectionName:(i==null?void 0:i.name)+" - Videos",fetchNext:l,renderItem:c,downloadItem:n,getItemCursor:o=>o.cursor,rowKey:o=>o.id})}export{X as default};