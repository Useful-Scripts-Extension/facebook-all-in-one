import{r as l,ap as r}from"./index-6iO9B4UX.js";import{u as b,O as u,a0 as x,a1 as a,b as w,B as y,e as C,G as T}from"./MyApp-D3TLAwLS.js";import{C as j}from"./Collection-BElPDi3i.js";import{g as k,a as E,b as S}from"./albums-Bp3CKNCI.js";import{L as A}from"./index-CbV9OjKo.js";import{I as t}from"./index-Bnw5EiFE.js";import{T as v}from"./index-Ccer5ThT.js";import"./index-DP9nC1gx.js";import"./file-download-BEOaJaND.js";import"./index-CPW8KYgE.js";import"./Dropdown-B0Lmraqm.js";import"./PurePanel-Bm5xQ9SX.js";import"./index-TW1bPezM.js";import"./index-CDdAmJxf.js";import"./index-DojS3tkt.js";import"./TextArea-BFLLvv2B.js";import"./addEventListener-rSnLGtdd.js";import"./index-gPFCTcCs.js";import"./index-B5ld3on9.js";import"./Pagination-CZHFfd5Z.js";import"./useBreakpoint-B1G-1cRs.js";import"./responsiveObserver-DK0exuOw.js";import"./row-DYebFsNn.js";function O({target:i,onOpenAlbum:m}){const{ti:d}=b(),h=l.useCallback(async(o=[])=>{var c;if(!(i!=null&&i.id)||!(i!=null&&i.type))return;const s=o==null?void 0:o[(o==null?void 0:o.length)-1];if(i.type!==u.Group)return(await k({id:i==null?void 0:i.id,accessToken:await x(a.EAAB),fromId:(s==null?void 0:s.id)||""})).albums;const e=i.type===u.Group?await E({groupId:i.id,cursor:s==null?void 0:s.cursor}):await S({uid:i.id,cursor:s==null?void 0:s.cursor});if((c=e.albums)!=null&&c.length){let n=new Set(o.map(p=>p.id));return e.albums.filter(p=>!n.has(p.id))}return[]},[i]),f=l.useCallback(o=>r.jsx(A.Item,{children:r.jsxs(w,{direction:"vertical",children:[r.jsx(y.Ribbon,{text:C(o.count),children:r.jsx(t,{src:o.picture,alt:o.name,width:150,height:150,style:{objectFit:"cover",borderRadius:"10px",cursor:"pointer"},preview:!1,onClick:()=>{m==null||m(o)}})}),r.jsx(v.Paragraph,{style:{maxWidth:"150px",wordWrap:"break-word"},onClick:()=>window.open(o.link),children:o.name})]})}),[]);return r.jsx(j,{collectionName:(i==null?void 0:i.name)+" - Albums",fetchNext:h,renderItem:f,rowKey:o=>o.id,searchPlaceholder:o=>d({en:`Search in ${o==null?void 0:o.length} albums...`,vi:`Tìm trong ${o.length} albums...`}),onSearch:(o,s)=>T(o,s.name)})}export{O as default};