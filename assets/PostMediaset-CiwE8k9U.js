const __vite__fileDeps=["./ImageLazyPreview-BzJhPJVT.js","./index-6iO9B4UX.js","./index-8IR6ngH_.css","./MyApp-D3TLAwLS.js","./index-Bnw5EiFE.js","./addEventListener-rSnLGtdd.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{r as u,ap as e,aq as w,au as y}from"./index-6iO9B4UX.js";import{C as b}from"./Collection-BElPDi3i.js";import{b as c}from"./index-B1LI4DFj.js";import{u as P,c as g,d as l,aj as _,E as k,g as L,b as V,ak as E,a3 as I}from"./MyApp-D3TLAwLS.js";import{i as C}from"./icons-DqsOZRnM.js";import{A as N}from"./index-DECAPoON.js";import{L as F}from"./index-CbV9OjKo.js";import"./index-DP9nC1gx.js";import"./file-download-BEOaJaND.js";import"./index-CPW8KYgE.js";import"./Dropdown-B0Lmraqm.js";import"./PurePanel-Bm5xQ9SX.js";import"./index-TW1bPezM.js";import"./index-CDdAmJxf.js";import"./index-DojS3tkt.js";import"./TextArea-BFLLvv2B.js";import"./addEventListener-rSnLGtdd.js";import"./index-gPFCTcCs.js";import"./index-B5ld3on9.js";import"./index-prqwDgJL.js";import"./responsiveObserver-DK0exuOw.js";import"./useBreakpoint-B1G-1cRs.js";import"./index-CxBQYRI3.js";import"./index-BG-34Qeb.js";import"./index-INKS48ZS.js";import"./index-Bnw5EiFE.js";import"./index-Ccer5ThT.js";import"./Pagination-CZHFfd5Z.js";import"./row-DYebFsNn.js";const M=u.lazy(()=>y(()=>import("./ImageLazyPreview-BzJhPJVT.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url));function lo({target:i,postId:n}){const{ti:r}=P(),{message:p}=g(),[t,h]=l("PostMediaset."+n+".mediaset_token",null),[f,d]=l("PostMediaset."+n+".loading",!1);u.useEffect(()=>{i!=null&&i.id&&n&&(d(!0),_(i==null?void 0:i.id,n).then(o=>{console.log(o);const s=k(o,"mediaset_token");if(!s)throw new Error("No mediaset token found");h(s)}).catch(o=>{p.error({content:r({en:"Fail to load post content ",vi:"Lỗi tải dữ liệu bài post "})+o.message})}).finally(()=>{d(!1)}))},[n]);const v=async(o=[],s)=>{var m;if(!(i!=null&&i.id)||!t)return;const a=s||((m=o[o.length-1])==null?void 0:m.cursor);return await E(t,a)},x=o=>e.jsxs(F.Item,{style:{position:"relative"},children:[e.jsx(M,{src:o.image,width:200/o.height*o.width,height:200,style:{objectFit:"cover",borderRadius:10},cacheId:"mediaset."+o.id,getPreview:async()=>o.isVideo?(await c(o.id)).source:o.image,renderPreview:o.isVideo?(s,a)=>({destroyOnClose:!0,imageRender:()=>e.jsx(I,{spinning:a,children:e.jsx("video",{autoPlay:!0,controls:!0,loop:!0,src:s,style:{maxWidth:"90vw",maxHeight:"90vh"}})}),toolbarRender:()=>null}):void 0}),o.isVideo&&e.jsx("div",{style:{position:"absolute",top:10,right:10},children:C.IGVideo})]}),j=async o=>{if(o.isVideo){const s=await c(o.id);return{name:o.id+".mp4",url:s.source}}return{name:o.id+".jpg",url:o.image}};return e.jsx(b,{collectionName:(i==null?void 0:i.name)+" - Post media - "+n,fetchNext:v,renderItem:x,downloadItem:j,getItemCursor:o=>o.cursor,rowKey:o=>o.id,stop:!(i!=null&&i.id)||!t,headerButtons:()=>e.jsx(w,{href:L(n),target:"_blank",icon:e.jsx("i",{className:"fa-solid fa-arrow-up-right-from-square"}),children:r({en:"View post",vi:"Xem bài viết"})}),header:()=>f?e.jsxs(V,{children:[e.jsx("i",{className:"fa-solid fa-spinner fa-spin"})," ",r({en:"Loading post content...",vi:"Đang tải nội dung bài viết..."})]}):t?null:e.jsx(N,{type:"error",showIcon:!0,message:r({en:"This post not contain multiple medias",vi:"Bài viết này không chứa nhiều ảnh/video"})})})}export{lo as default};