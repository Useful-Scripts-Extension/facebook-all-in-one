import{r as i,ao as t}from"./index-uBP7sdqy.js";import{i as d}from"./icons-Db4Zkg9F.js";import{C as c}from"./Collection-CXAEK9k8.js";import{a as l}from"./highlights-CNr7TKmo.js";import{L as u}from"./index-MDMlPhkE.js";import{I as x}from"./index-j8CDf4yr.js";import"./index-dM5hRmBR.js";import"./file-download-DgEB6See.js";import"./MyApp-CbnH0uz1.js";import"./index-BhPJuoFu.js";import"./Dropdown-DFDL6dMx.js";import"./PurePanel-CsGERaed.js";import"./index-DeiFaycA.js";import"./index-M1IaNGVV.js";import"./index-B-kaI062.js";import"./TextArea-DLbDOpjU.js";import"./addEventListener-D-1dam60.js";import"./index-DGkOUS80.js";import"./index-Dg7v4V_p.js";import"./index-vuHwb1ab.js";import"./index-D-jLmXSu.js";import"./responsiveObserver-BPmnD0rd.js";import"./useBreakpoint-BVAkXvJW.js";import"./index-T-RtFF1H.js";import"./index-DuGENqTU.js";import"./index-DNOSErDo.js";import"./index-BwZgrQ6U.js";import"./Pagination-B2SinCKz.js";import"./row-B8YwZzF4.js";function S({target:e,highlight:r}){const s=i.useCallback(async o=>r!=null&&r.id?await l(r.id):void 0,[r]),p=i.useCallback(o=>t.jsxs(u.Item,{children:[t.jsx(x,{src:o.image,width:200,height:330,style:{objectFit:"cover"},preview:o.video?{destroyOnClose:!0,imageRender:()=>t.jsx("video",{autoPlay:!0,controls:!0,loop:!0,src:o.video,style:{maxWidth:"90vw",maxHeight:"90vh"}}),toolbarRender:()=>null}:!0}),o.video&&t.jsx("div",{style:{position:"absolute",top:10,right:10,pointerEvents:"none"},children:d.IGVideo})]}),[]),a=i.useCallback((o,n)=>{const m=!!o.video;return{url:m?o.video:o.image,name:o.id+(m?".mp4":".jpg")}},[]);return t.jsx(c,{collectionName:(e==null?void 0:e.igName)+" - IG Highlight - "+r.title,fetchNext:s,renderItem:p,downloadItem:a,rowKey:o=>o.id,once:!0})}export{S as default};