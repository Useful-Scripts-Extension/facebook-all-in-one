import{y as h,z as b,M as I,N as C,A as w,E as A}from"./MyApp-SgVvcLTS.js";async function k(e="",a=""){const r=await h({fb_api_req_friendly_name:"CometSinglePostContentQuery",variables:{feedbackSource:2,feedLocation:"PERMALINK",focusCommentID:null,privacySelectorRenderLocation:"COMET_STREAM",renderLocation:"permalink",scale:2,storyID:btoa(`S:_I${e}:${a}:${a}`),useDefaultActor:!1,__relay_internal__pv__CometImmersivePhotoCanUserDisable3DMotionrelayprovider:!1,__relay_internal__pv__IsWorkUserrelayprovider:!1,__relay_internal__pv__IsMergQAPollsrelayprovider:!1,__relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider:!1,__relay_internal__pv__CometUFIShareActionMigrationrelayprovider:!0,__relay_internal__pv__IncludeCommentWithAttachmentrelayprovider:!0,__relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider:!0,__relay_internal__pv__EventCometCardImage_prefetchEventImagerelayprovider:!1},doc_id:"8457098094310209"});return JSON.parse(r.split(`
`)[0]||"{}")}async function E(e="",a=""){const r=await h({fb_api_req_friendly_name:"CometAlbumPhotoCollagePaginationQuery",variables:{cursor:a,count:14,renderLocation:"permalink",scale:2,id:btoa(`mediaset:${e}`)},doc_id:"7250936985006590"}),s=JSON.parse(r),{edges:_=[],page_info:o={}}=b(s)||{};return _.map(i=>{var t,d,m,p,f,l,n,u;return{id:(t=i.node)==null?void 0:t.id,image:(m=(d=i.node)==null?void 0:d.image)==null?void 0:m.uri,width:(f=(p=i.node)==null?void 0:p.image)==null?void 0:f.width,height:(n=(l=i.node)==null?void 0:l.image)==null?void 0:n.height,isVideo:((u=i.node)==null?void 0:u.__isMedia)==="Video",cursor:i.cursor}})}function P(e){var _,o,i;let a=(_=/\/posts\/(\d+)/.exec(e))==null?void 0:_[1];if(a)return a;let r=(o=/\/posts\/(pfbid\w+)/.exec(e))==null?void 0:o[1];if(r)return v(r);if(e.includes("permalink.php?")){const t=new URLSearchParams(e.split("?")[1]);if(t.has("story_fbid")&&t.has("id"))return v(t.get("story_fbid"))}if(e.includes("multi_permalinks=")){const t=new URLSearchParams(e.split("?")[1]);if(t.has("multi_permalinks"))return t.get("multi_permalinks")}if(e.includes("/photo/")){const t=new URLSearchParams(e.split("?")[1]);if(t.has("fbid"))return t.get("fbid")}const s=(i=/\/groups\/(.*?)\/posts\/(\d+)\//.exec(e))==null?void 0:i[2];return s||null}async function v(e){var s;const a=await h({q:`node(${e}){id}`}),r=JSON.parse(a);return(s=Object.keys(r))==null?void 0:s[0]}async function M(e=100,a,r){var t,d,m,p,f;let _="https://graph.facebook.com/v14.0/me/posts?fields=id,reactions.limit(1000){id},comments.limit(1000){from{id}},created_time&limit=100&access_token="+await I(C.EAAB);const o=[],i=new Set;for(;;)try{const l=await w(_),n=JSON.parse(l);if(console.log(n),!Array.isArray(n==null?void 0:n.data))break;let u=!1;for(let c of n.data)i.has(c.id)||(u=!0,o.push({postId:c.id,created_time:c.created_time,reactions_uid:(d=(t=c.reactions)==null?void 0:t.data)==null?void 0:d.map(y=>y.id),comments_uid:(p=(m=c.comments)==null?void 0:m.data)==null?void 0:p.map(y=>y.from.id)}),i.add(c.id));a==null||a(o);const g=(f=n==null?void 0:n.paging)==null?void 0:f.next;if(!u||o.length>=e||g===_||r!=null&&r())break;_=g,await A(1e3)}catch(l){console.log(l);break}return console.log(o),o}export{P as a,k as b,E as c,M as g};