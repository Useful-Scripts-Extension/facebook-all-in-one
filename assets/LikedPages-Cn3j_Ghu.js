import{ap as o}from"./index-ByGmV8wY.js";import{u as d,G as h,o as p,b as u}from"./MyApp-Cf4CvXy6.js";import{E as x}from"./ExportButton-uC5YjOCt.js";import{C as f}from"./Collection-Bma6J-H2.js";import{c as j}from"./pages-tSfNbknF.js";import{A as k}from"./index-_Y4w2-Re.js";import{L as y}from"./index-Dy3wdtHH.js";import{I as _}from"./index-BPTgN8dl.js";import"./file-download-DWpNkdW1.js";import"./index-CA_CSnEN.js";import"./Dropdown-1utTObuE.js";import"./PurePanel-BK6FE9J4.js";import"./index-ByQEONc7.js";import"./index-CTwdTgyj.js";import"./index-CAwe5p4m.js";import"./index-C6JBQopa.js";import"./TextArea-DScjjSy-.js";import"./addEventListener-Bhq-MnRc.js";import"./index-BvybQ130.js";import"./index-FATJf7Rf.js";import"./Pagination-D0T4RzoK.js";import"./useBreakpoint-DggrOhr0.js";import"./responsiveObserver-BKXjylYU.js";import"./row-BEmum6s0.js";function W({target:i}){const{ti:a}=d(),t=async(e=[],s)=>{var r;return i!=null&&i.id?await j({uid:i.id,cursor:s||((r=e[e.length-1])==null?void 0:r.cursor)}):void 0},c=e=>o.jsx(y.Item,{children:o.jsxs(u,{direction:"vertical",style:{maxWidth:150},children:[o.jsx(_,{src:e.image,style:{width:150,height:150,objectFit:"contain",borderRadius:10}}),o.jsxs("span",{style:{margin:0},children:[o.jsx("span",{style:{opacity:.7},children:e.id}),o.jsx("br",{}),o.jsx("a",{href:e.url,target:"_blank",children:o.jsx("b",{children:e.name})})]})]})});return o.jsx(f,{collectionName:(i==null?void 0:i.name)+" - Liked Pages",fetchNext:t,renderItem:c,getItemCursor:e=>e.cursor,rowKey:e=>e.id,showPagination:!0,all:!0,searchPlaceholder:e=>a({en:`Search in ${e.length} liked pages`,vi:`Tìm trong ${e.length} trang được thích`}),onSearch:(e,s)=>h(e,s.name+s.id),header:e=>{var n,r,m,l;const s=((n=e[0])==null?void 0:n.total)&&((r=e[0])==null?void 0:r.total)!==e.length;return o.jsx(k,{type:"success",showIcon:!0,message:a({en:`Liked ${e.length} public pages`+(s?` (in total ${(m=e[0])==null?void 0:m.total} likes)`:""),vi:`Đã thích ${e.length} trang công khai`+(s?` (trong tổng ${(l=e[0])==null?void 0:l.total} lượt thích)`:"")})})},headerButtons:e=>o.jsx(x,{data:e,options:[{key:"uid",label:".txt (pages id)",prepareData:s=>({fileName:(i==null?void 0:i.name)+"_liked_pages_id.txt",data:s.map(n=>n.id).join(`
`)})},{key:"id_name",label:".csv (page id+name)",prepareData:s=>({fileName:(i==null?void 0:i.name)+"_liked_pages_id_name.csv",data:p(s.map(n=>({id:n.id,name:n.name})))})},{key:"json",label:".json",prepareData:s=>({fileName:(i==null?void 0:i.name)+"_liked_pages.json",data:JSON.stringify(s,null,4)})},{key:"csv",label:".csv",prepareData:s=>({fileName:(i==null?void 0:i.name)+"_liked_pages.csv",data:p(s)})}]})})}export{W as default};