import{r,aq as s}from"./index-DonY9sLI.js";import{a as x,an as w,S as e,D as h,T as p}from"./MyApp-20_3TBLI.js";import{C as t}from"./Collection-DQhk1_mF.js";import{L as f}from"./index-DPWgxwvH.js";import{I as j}from"./index-iO4YTtSq.js";import{T as b}from"./index-Zw7_s42f.js";import"./index-D5-n1u0A.js";import"./file-download-Coxq6J34.js";import"./useCacheState-C58Z6M0-.js";import"./index-ejN4DIvI.js";import"./Dropdown-BEd8vCn3.js";import"./PurePanel-v1OcXeK5.js";import"./index-COMfH0WH.js";import"./TextArea-Dl86WZt8.js";import"./addEventListener-CbNqS0d-.js";import"./Pagination-DED-NOEl.js";import"./useBreakpoint-BRU7DyNK.js";import"./row-BBEDV7Ov.js";import"./styleChecker-CXzB2mNK.js";function X({target:i}){const{ti:n}=x(),d=r.useCallback(async(o=[],u)=>{if(!(i!=null&&i.id)||!(i!=null&&i.type))return;const l=o==null?void 0:o[(o==null?void 0:o.length)-1];return await w({groupId:i==null?void 0:i.id,cursor:u||(l==null?void 0:l.cursor)||""})},[i]),m=r.useCallback(o=>s.jsx(f.Item,{children:s.jsxs(e,{direction:"vertical",align:"center",style:{minWidth:150},children:[s.jsx(e,{style:{padding:"10px"},children:s.jsx(h.Ribbon,{text:s.jsx("i",{className:"fa fa-times"}),color:"red",style:{display:o.download_url?"none":"block"},children:s.jsx(p,{title:o.download_url?n({en:"Download",vi:"Tải xuống"}):n({en:"No download link",vi:"Không có link tải"}),children:s.jsx(j,{src:o.icon,alt:o.name,width:70,height:70,style:{objectFit:"cover",borderRadius:"10px",cursor:"pointer"},preview:!1,onClick:()=>o.download_url&&window.open(o.download_url)})})})}),s.jsx(p,{title:n({en:"View post",vi:"Xem bài viết"}),placement:"bottom",children:s.jsx(b.Paragraph,{style:{maxWidth:"150px",wordWrap:"break-word"},onClick:()=>window.open(o.post_url),children:o.name})})]})}),[]),c=r.useCallback(o=>({url:o.download_url,name:o.name}),[]),a=o=>o.cursor||"";return s.jsx(t,{collectionName:(i==null?void 0:i.name)+" - Files",fetchNext:d,renderItem:m,downloadItem:c,getItemCursor:a,rowKey:o=>o.name})}export{X as default};