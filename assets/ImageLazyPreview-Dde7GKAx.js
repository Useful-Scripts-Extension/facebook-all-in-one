import{at as L,r as f,av as h}from"./index-DNe3TpmC.js";import{u as k,w as x,z as C}from"./MyApp-B8-XFWgd.js";import{I}from"./index-BqvIGLJl.js";import"./EyeOutlined-B6DEd6MW.js";import"./addEventListener-BDJVQsXr.js";function A(g){const{cacheId:p,getPreview:d,renderPreview:s,...a}=g,{message:n}=L.useApp(),{ti:c}=k(),r=a.src||"",o="ImageLazyPreview."+(p||r),[y,i]=f.useState(!1),[l,u]=f.useState(x(o,"")),w=async()=>{if(!l)try{i(!0),n.loading({duration:0,key:o,content:c({en:"Loading...",vi:"Đang tải..."})});let t=performance.now();const e=await d();let v=performance.now();console.log("getPreview",v-t),e&&e!==r&&(u(e),C(o,e)),n.destroy(o)}catch(t){console.error(t),n.error({key:o,content:c({en:"Load failed: ",vi:"Load lỗi: "})+t.message})}finally{i(!1)}},m=l||r;return h.jsx(I,{...a,preview:typeof s=="function"?s(m,y):{src:m},onClick:t=>{var e;(e=a.onClick)==null||e.call(a,t),w()}})}export{A as default};