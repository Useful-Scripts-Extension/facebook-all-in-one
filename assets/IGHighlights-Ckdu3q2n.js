import{r as e,av as t}from"./index-BzHjJZ6J.js";import{a7 as n}from"./MyApp-P_ZAPtxc.js";import{C as c}from"./Collection-ByG1P6_c.js";import{g as u,a as f}from"./highlights-Tf3QvPQ8.js";import{L as h}from"./index-CDYyC9gD.js";import{I as x}from"./index-isaRSNRL.js";import"./index-CjOrqomX.js";import"./file-download-wydYP9pK.js";import"./index-CJ9N7clN.js";import"./Dropdown-Dgn2-KTF.js";import"./PurePanel-nLO0RZ46.js";import"./index-CzUkjAGb.js";import"./index-Cd_NWbNz.js";import"./index-DM0pvvLI.js";import"./index-CxjRYcOo.js";import"./addEventListener-CYR6kZcj.js";import"./index-C3yQlH26.js";import"./index-CKkwT6fB.js";import"./index-BTUpxhrV.js";import"./index-B3hIcIR4.js";import"./useBreakpoint-1TxoALFb.js";import"./index-Cfi9UxPj.js";import"./index-BNHfpCXa.js";import"./index-BSxkTIuz.js";import"./index-DDkJ4-4M.js";import"./Pagination-PNe0cuUg.js";import"./row-CrtjfzA9.js";function P({target:r,onOpenHighlight:s}){const a=e.useCallback(async(i=[])=>r!=null&&r.id?i.length?[]:await u(r.id):void 0,[r]),p=e.useCallback(i=>t.jsxs(h.Item,{children:[t.jsx(x,{src:i.cover,width:100,height:100,style:{objectFit:"cover",borderRadius:"50%",cursor:"pointer"},preview:!1,onClick:()=>{s==null||s(i)}}),t.jsx("a",{href:"https://www.instagram.com/stories/highlights/"+i.id.split(":")[1],target:"_blank",style:{display:"block",wordWrap:"break-word",maxWidth:100,padding:5,fontWeight:"bold",textAlign:"center",fontSize:"1em"},title:i.title,children:n(i.title,30)})]}),[]),l=e.useCallback(async(i,d)=>(await f(i.id)).map(o=>{const m=!!o.video;return{url:m?o.video:o.image,name:o.id+(m?".mp4":".jpg")}}),[]);return t.jsx(c,{collectionName:(r==null?void 0:r.igName)+" - IG Highlights",fetchNext:a,renderItem:p,downloadItem:l,rowKey:i=>i.id})}export{P as default};