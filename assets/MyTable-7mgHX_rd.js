import{r as a,ar as p}from"./index-uQ-4bckE.js";import{u as F,I as H,b as L}from"./MyApp-Dea_f9Ec.js";import{F as $}from"./Table-BEmebim8.js";import{R as j}from"./row-CZZdOBqT.js";import{I as q}from"./index-C_iPmrIa.js";import"./index-BEYyIv2R.js";import"./addEventListener-BlMTG88c.js";import"./index-DyQaJHWy.js";import"./PurePanel-Ddg11r_4.js";import"./index-DM60k94P.js";import"./index-CrC_uMi3.js";import"./index-pKMdBif8.js";import"./Dropdown-Z0CG7-IL.js";import"./index-BQUxQCcR.js";import"./useBreakpoint-CSQ_VzM4.js";import"./responsiveObserver-sfPxq9Vd.js";import"./Pagination-DPPFQzmS.js";const B=a.forwardRef((C,I)=>{const{data:g=[],columns:c=[],size:D="middle",selectable:w=!1,searchable:E=!1,loading:z=!1,pageSize:b=0,keyExtractor:o=(n,t)=>t+"",onSearchRow:v,renderTitle:k,style:M}=C,{ti:l}=F(),[u,S]=a.useState(""),[e,i]=a.useState([]),[h,y]=a.useState(!1);a.useImperativeHandle(I,()=>({getDataSelected:()=>e,setDataSelected:n=>{i(n)},hasDataSelected:()=>!!(e!=null&&e.length),setShowSelectedOnly:y,setSearch:S,clearFilter:({search:n=!0,dataSelected:t=!0,showSelectedOnly:r=!0}={})=>{n&&S(""),t&&i([]),r&&y(!1)}}));const d=a.useMemo(()=>{const n=new Map(c.map((r,s)=>[r.key,s])),t=g.filter(r=>v?v(u,r):Object.entries(r).some(([s,m],P)=>{var T,R;let x=n.get(s)||-1;return x<0||(T=c[x])!=null&&T.disableSearch?!1:(R=c[x])!=null&&R.onSearch?c[x].onSearch(u,m,r):typeof m=="string"&&H(u,m)})).map((r,s)=>({...r,key:o(r,s)}));if(h&&(e!=null&&e.length)){const r=new Set(e.map(o));return t.filter((s,m)=>r.has(o(s,m)))}return t},[g,u,h,e]);a.useEffect(()=>{if(!(e!=null&&e.length))return;let n=new Set(g.map(o)),t=e.filter((r,s)=>n.has(o(r,s)));(t==null?void 0:t.length)!==(e==null?void 0:e.length)&&i(t)},[g,e]);const f=a.useRef(d);a.useEffect(()=>{f.current=d},[d]);const _=(n,t)=>{i(t)},K=a.useMemo(()=>{if(!w)return;const n={selectedRowKeys:e.map(o),onChange:_,selections:[{key:"select_all",text:l({en:"Select all",vi:"Chọn tất cả"}),onSelect:()=>i(f.current)},{key:"invert_selection",text:l({en:"Invert selection",vi:"Đảo ngược lựa chọn"}),onSelect:()=>i(f.current.filter(t=>!e.find(r=>o(r)===o(t))))},{key:"unselect_all",text:l({en:"Unselect all",vi:"Bỏ chọn tất cả"}),onSelect:()=>{y(!1),i(e.filter(t=>!f.current.find(r=>o(r)===o(t))))}}]};return(e==null?void 0:e.length)>0&&n.selections.push({key:"show_selected_only",text:l(h?{en:"Show all",vi:"Hiển thị tất cả"}:{en:"Show selected only",vi:"Chỉ hiển thị đã chọn"}),onSelect:()=>{S(""),y(!h)}}),n},[e,h,w]),O=()=>p.jsxs(j,{justify:"space-between",style:{margin:"5px"},children:[p.jsx(j,{align:"middle",children:p.jsx(L,{wrap:!0,children:typeof k=="function"&&k(e)})}),E&&p.jsx(q.Search,{placeholder:l({en:"Search",vi:"Tìm kiếm"}),value:u,onChange:n=>S(n.target.value),style:{marginRight:16,marginLeft:16,maxWidth:300}})]});return p.jsx($,{sticky:!0,fixedHeader:!0,size:D,loading:z,scroll:{x:"max-content"},tableLayout:"auto",dataSource:d,columns:c,showSorterTooltip:!1,onChange:(n,t,r,s)=>{f.current=s.currentDataSource??[]},rowSelection:K,title:O,pagination:b==-1?!1:{position:["bottomCenter"],showSizeChanger:!0,showTotal:(n,t)=>l({en:`Total ${n} items`,vi:`Tổng ${n} dòng`}),size:"default",defaultPageSize:b||10,style:{alignItems:"center"}},style:M})}),ae=B;export{ae as default};