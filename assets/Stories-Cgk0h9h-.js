import{aq as i}from"./index-DonY9sLI.js";import{a as l,a0 as u,a1 as x,S as h,a2 as v}from"./MyApp-20_3TBLI.js";import{C as f}from"./Collection-DQhk1_mF.js";import{i as y}from"./icons-CfI5c4cx.js";import{L as j}from"./index-DPWgxwvH.js";import{I as b}from"./index-iO4YTtSq.js";import{T as a}from"./index-Zw7_s42f.js";import"./index-D5-n1u0A.js";import"./file-download-Coxq6J34.js";import"./useCacheState-C58Z6M0-.js";import"./index-ejN4DIvI.js";import"./Dropdown-BEd8vCn3.js";import"./PurePanel-v1OcXeK5.js";import"./index-COMfH0WH.js";import"./TextArea-Dl86WZt8.js";import"./addEventListener-CbNqS0d-.js";import"./Pagination-DED-NOEl.js";import"./useBreakpoint-BRU7DyNK.js";import"./row-BBEDV7Ov.js";import"./styleChecker-CXzB2mNK.js";function P({target:r}){const{ti:e}=l(),c=async(o=[],t)=>{if(!(r!=null&&r.id))return;const{bucketId:s,firstStoryId:m}=await u(r==null?void 0:r.id);if(!s||!m)return[];const n=await x(s);return console.log("bucket",n),n},d=(o,t)=>i.jsx(j.Item,{children:i.jsxs(h,{direction:"vertical",style:{position:"relative"},children:[i.jsx(b,{src:o.image,fallback:o.thumbnail,style:{width:160,height:270,borderRadius:10,objectFit:"cover"},preview:o.video?{destroyOnClose:!0,imageRender:()=>i.jsx("video",{loop:!0,autoPlay:!0,controls:!0,src:o.video,style:{maxWidth:"80vw",maxHeight:"80vh"}}),toolbarRender:()=>null}:void 0}),i.jsxs(a.Text,{children:[v(o.creation_time*1e3,e)," ",e({vi:"trước",en:"ago"}),i.jsx("br",{}),o.react_count," reactions ",o.reaction]}),o.caption&&i.jsx(a.Text,{children:o.caption}),o.video&&i.jsx("div",{style:{position:"absolute",top:10,right:10,pointerEvents:"none"},children:y.IGVideo})]})}),p=async(o,t)=>({name:o.id+(o.video?".mp4":".jpg"),url:o.video||o.image});return i.jsx(f,{collectionName:(r==null?void 0:r.name)+" - Stories",fetchNext:c,renderItem:d,downloadItem:p,rowKey:o=>o.id,once:!0})}export{P as default};