import{r as i,aq as t}from"./index-CQNonOfL.js";import{i as d}from"./icons-ExIeCBVG.js";import{C as c}from"./Collection-Cy61d0hF.js";import{a as l}from"./highlights-CSGQtUpr.js";import{L as u}from"./index-hF37LMaA.js";import{I as x}from"./index-BUCLZsYI.js";import"./index-Cz2Rbco-.js";import"./file-download-C-xk4TK6.js";import"./MyApp-Dhl7Igi8.js";import"./index-BfPe8_KM.js";import"./Dropdown--vJsHVwf.js";import"./PurePanel-DSDVhTMT.js";import"./index-BK4eSPje.js";import"./index-CooVTPeW.js";import"./index-BXLdrhSO.js";import"./TextArea-6YleKRkM.js";import"./addEventListener-BY-zPXC-.js";import"./index-iI7ajwdP.js";import"./index-2fC2Jtgc.js";import"./index-DQWUscUF.js";import"./index-C3PBad3M.js";import"./responsiveObserver-S5YaaU6-.js";import"./useBreakpoint-BzX5LTsV.js";import"./index-B4fBLN5P.js";import"./index-DtdluwIZ.js";import"./index-BUE7Vrfn.js";import"./index-BQ1gNIPH.js";import"./index-DKJYBxbh.js";import"./Pagination-CpkREM9d.js";import"./row-DI7Xa9mG.js";function T({target:e,highlight:r}){const s=i.useCallback(async o=>r!=null&&r.id?await l(r.id):void 0,[r]),p=i.useCallback(o=>t.jsxs(u.Item,{children:[t.jsx(x,{src:o.image,width:200,height:330,style:{objectFit:"cover"},preview:o.video?{destroyOnClose:!0,imageRender:()=>t.jsx("video",{autoPlay:!0,controls:!0,loop:!0,src:o.video,style:{maxWidth:"90vw",maxHeight:"90vh"}}),toolbarRender:()=>null}:!0}),o.video&&t.jsx("div",{style:{position:"absolute",top:10,right:10,pointerEvents:"none"},children:d.IGVideo})]}),[]),a=i.useCallback((o,n)=>{const m=!!o.video;return{url:m?o.video:o.image,name:o.id+(m?".mp4":".jpg")}},[]);return t.jsx(c,{collectionName:(e==null?void 0:e.igName)+" - IG Highlight - "+r.title,fetchNext:s,renderItem:p,downloadItem:a,rowKey:o=>o.id,once:!0})}export{T as default};