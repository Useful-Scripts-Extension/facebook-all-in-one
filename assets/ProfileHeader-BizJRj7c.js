import{aj as g,ak as u,ap as t}from"./index-yi0l23Jz.js";import{P as s}from"./index-rrH7CABE.js";import{u as f,a as j,b as y,T}from"./MyApp-DdNZ-d4h.js";import{T as b}from"./index-BawMyJLs.js";import{T as n}from"./index-WnClWXR7.js";import{A as v}from"./index-CnCl37R2.js";import"./TextArea-DMXwnTLM.js";import"./responsiveObserver-BQsoN-L_.js";import"./useBreakpoint-lOnFiZW6.js";import"./index-C-iMvds7.js";const{Title:P,Text:I}=n;function A({showName:r=!0,showAvatar:l=!0,avatarSize:c=50,titleColor:m="white",textColor:x="#eee",style:d={}}){var i,o;const{ti:h}=f(),e=g(u.profile),{isVIP:p}=j();return t.jsxs("div",{style:{...a.container,...d},children:[r&&t.jsxs(y,{children:[p?t.jsx(T,{title:h({en:"VIP User",vi:"VIP User"}),children:t.jsx(b,{icon:t.jsx("i",{className:"fa-solid fa-crown"}),color:"gold",children:t.jsxs(n.Text,{style:{fontWeight:"bold"},children:[" ","VIP"]})})}):null,t.jsxs("div",{style:a.info,children:[t.jsx("a",{href:"https:/fb.com/me",target:"_blank",children:t.jsx(P,{level:4,style:a.name(m),children:e==null?void 0:e.name})}),t.jsx(I,{style:a.id(x),children:e==null?void 0:e.uid})]})]}),l&&t.jsx("a",{href:(i=e==null?void 0:e.avatar)==null?void 0:i.link,target:"_blank",children:t.jsx(v,{src:(o=e==null?void 0:e.avatar)==null?void 0:o.uri,size:c})})]})}A.propTypes={showName:s.bool,showAvatar:s.bool,avatarSize:s.number,titleColor:s.string,textColor:s.string,style:s.object};const a={container:{display:"flex",alignItems:"center"},info:{display:"flex",flexDirection:"column",marginRight:"16px"},name:r=>({margin:0,textAlign:"right",color:r}),id:r=>({color:r,fontSize:"0.9em",textAlign:"right"})};export{A as default};