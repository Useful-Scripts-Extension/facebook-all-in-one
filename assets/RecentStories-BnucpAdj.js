const __vite__fileDeps=["./RecentStoryViewer-DQSOmOvB.js","./index-DonY9sLI.js","./index-BM_p-30O.css","./MyApp-20_3TBLI.js","./StoryViewers-B3YnIjnB.js","./Collection-DQhk1_mF.js","./index-D5-n1u0A.js","./file-download-Coxq6J34.js","./useCacheState-C58Z6M0-.js","./index-ejN4DIvI.js","./Dropdown-BEd8vCn3.js","./PurePanel-v1OcXeK5.js","./index-COMfH0WH.js","./TextArea-Dl86WZt8.js","./addEventListener-CbNqS0d-.js","./index-DPWgxwvH.js","./Pagination-DED-NOEl.js","./useBreakpoint-BRU7DyNK.js","./row-BBEDV7Ov.js","./index-Zw7_s42f.js","./styleChecker-CXzB2mNK.js","./index-DTKNm1im.js","./index-iO4YTtSq.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{r as i,aq as o,au as m}from"./index-DonY9sLI.js";import{t as d,aE as c,aF as l,D as u,a1 as g,aG as x}from"./MyApp-20_3TBLI.js";import{C as b}from"./Collection-DQhk1_mF.js";import{L as h}from"./index-DPWgxwvH.js";import{I as f}from"./index-iO4YTtSq.js";import{A as y}from"./index-DTKNm1im.js";import{T as w}from"./index-Zw7_s42f.js";import"./index-D5-n1u0A.js";import"./file-download-Coxq6J34.js";import"./useCacheState-C58Z6M0-.js";import"./index-ejN4DIvI.js";import"./Dropdown-BEd8vCn3.js";import"./PurePanel-v1OcXeK5.js";import"./index-COMfH0WH.js";import"./TextArea-Dl86WZt8.js";import"./addEventListener-CbNqS0d-.js";import"./Pagination-DED-NOEl.js";import"./useBreakpoint-BRU7DyNK.js";import"./row-BBEDV7Ov.js";import"./styleChecker-CXzB2mNK.js";const v=i.lazy(()=>m(()=>import("./RecentStoryViewer-DQSOmOvB.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]),import.meta.url));function q(){i.useEffect(()=>{d("RecentStories:onLoad")},[]);const n=async(e,r)=>{var s;return await l(r||((s=e==null?void 0:e[e.length-1])==null?void 0:s.cursor)||"")},a=(e,r)=>o.jsx(h.Item,{children:o.jsxs(u.Ribbon,{text:e.stories.length,style:{opacity:e.stories.length>1?1:0},children:[o.jsx(f,{src:e.thumbnail,style:{width:160,height:270,borderRadius:10,objectFit:"cover"},preview:{destroyOnClose:!0,toolbarRender:()=>null,imageRender:()=>o.jsx(v,{story:e})}}),o.jsx(y,{src:e.owner.avatar,size:40,style:{position:"absolute",top:10,left:10,borderWidth:4,borderColor:"#0866FF"},onClick:()=>{window.open("https://fb.com/"+e.owner.id)}}),o.jsx("div",{style:{background:"linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)",position:"absolute",bottom:0,left:0,padding:"5px 10px",width:"100%",paddingTop:"50px",pointerEvents:"none"},children:o.jsx(w.Text,{style:{color:"#eee"},children:e.owner.name})})]})}),p=async e=>(await g(e.bucked_id)).map((t,s)=>({name:x(e.owner.name)+(t.video?".mp4":".jpg"),url:t.video||t.image||t.thumbnail}));return o.jsx(b,{collectionName:"Recent Stories "+c(),fetchNext:n,renderItem:a,downloadItem:p,getItemCursor:e=>e==null?void 0:e.cursor,rowKey:e=>e.bucked_id})}export{q as default};