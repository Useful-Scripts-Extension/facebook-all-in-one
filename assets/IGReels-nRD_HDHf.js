import{r as m,ao as r}from"./index-Dr7iwqFJ.js";import{z as _,ae as c}from"./MyApp-SgVvcLTS.js";import{C as h}from"./Collection-KPxlgEIG.js";import{f as b,c as f}from"./index-B4oJR9YY.js";import{L as v}from"./index-CxBY9qFN.js";import{I as x}from"./index-DlGfn2zt.js";import"./index-BShARpkz.js";import"./file-download-CU3pgXeX.js";import"./index-2RbUPnEv.js";import"./Dropdown-DVP9hn2B.js";import"./PurePanel-2i0e5CRq.js";import"./index-C73Ennn6.js";import"./index-D_9GvxQS.js";import"./index-zO62XQst.js";import"./index-9UmCmLZp.js";import"./addEventListener-CVzCf-F4.js";import"./index-B38jYVtf.js";import"./index-BRGcfHWb.js";import"./feeds-BpSKFNRV.js";import"./index-vuHwb1ab.js";import"./index-DcOpXGxK.js";import"./responsiveObserver-Cxm5vVGf.js";import"./useBreakpoint-CyKi7tq9.js";import"./index-CT4y-2p9.js";import"./index-o3PxMQxL.js";import"./index-BGEs1Jgx.js";import"./index-B2WEsI3G.js";import"./Pagination-BzDV8G9K.js";import"./row-CNXrKCSL.js";async function y(e="",a=""){const l=await b({fb_api_req_friendly_name:"PolarisProfileReelsTabContentQuery_connection",variables:{after:a,before:null,data:{include_feed_video:!0,page_size:12,target_user_id:e},first:4,last:null},doc_id:"7845543455542541"}),n=JSON.parse(l);console.log("res ne",n);const{edges:o=[],page_info:s={}}=_(n)||{};return o.map(t=>{var p,u,d;const i=((p=t==null?void 0:t.node)==null?void 0:p.media)||{};return{id:i.id,type:(u=t==null?void 0:t.node)==null?void 0:u.__typename,width:i.original_width,height:i.original_height,image:f((d=i.image_versions2)==null?void 0:d.candidates),video:f(i.video_versions),comment_count:i.comment_count,like_count:i.like_count,play_count:i.play_count,view_count:i.view_count,cursor:(t==null?void 0:t.cursor)||(s==null?void 0:s.end_cursor)}})}function X({target:e}){const a=m.useCallback(async(o=[],s)=>{var i;return e!=null&&e.id?await y(e.id,s||((i=o[o.length-1])==null?void 0:i.cursor)):void 0},[e]),l=m.useCallback(o=>r.jsxs(v.Item,{children:[r.jsx(x,{src:o.image,width:200,height:330,style:{objectFit:"cover"},preview:{destroyOnClose:!0,imageRender:()=>r.jsx("video",{autoPlay:!0,controls:!0,loop:!0,src:o.video,style:{maxWidth:"90vw",maxHeight:"90vh"}}),toolbarRender:()=>null}}),r.jsx("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 50%)",pointerEvents:"none"},children:r.jsxs("div",{style:{position:"absolute",bottom:15,left:15,fontWeight:"bold",fontSize:"1.1em"},children:[r.jsx("i",{className:"fa-solid fa-play"})," ",c(o.play_count),r.jsx("br",{}),r.jsx("i",{className:"fa-solid fa-heart"})," ",c(o.like_count),r.jsx("br",{}),r.jsx("i",{className:"fa-solid fa-message"})," ",c(o.comment_count)]})})]}),[]),n=m.useCallback((o,s)=>{const t=!!o.video;return{url:t?o.video:o.image,name:o.id+(t?".mp4":".jpg")}},[]);return r.jsx(h,{collectionName:(e==null?void 0:e.igName)+" - IG Reels",fetchNext:a,renderItem:l,downloadItem:n,getItemCursor:o=>o.cursor||"",rowKey:o=>o.id})}export{X as default};