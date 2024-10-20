import{d as x}from"./dayjs.min-DE2_6_Ma.js";import{C as g,D as y,i as D,L as q,S as E,P as U}from"./MyApp-CDv-rFzA.js";const O="YYYY-MM-DD",I=x("2004-01-01",O);async function Y({threadId:t="",progressCallback:o,checkStopFn:d}){var a;const e=[],i=await k({threadId:t});if(i.length)for(e.push(...i),o==null||o(e);;)try{const s=(a=e[0])==null?void 0:a.id,r=await M({threadId:t,msgId:s,direction:"up",limit:200});if(r.pop(),!(r!=null&&r.length)||d!=null&&d())break;e.unshift(...r),o==null||o(e),await q(500)}catch(s){console.error(s);break}return e}async function $(){return(await Promise.all([g("viewer(){message_threads{count,nodes{customization_info{emoji,outgoing_bubble_color,participant_customizations{participant_id,nickname}},all_participants{nodes{messaging_actor{name,id,profile_picture}}},thread_type,name,messages_count,image,id}}}").then(e=>y(e||"{}")),g({queries:{o0:{doc_id:"1475048592613093",query_params:{limit:500,before:Date.now(),tags:["ARCHIVED"],includeDeliveryReceipts:!0,includeSeqID:!1}}}},"https://www.facebook.com/api/graphqlbatch/").then(e=>{var i,a,s;return(s=(a=y(((i=e==null?void 0:e.split(`
`))==null?void 0:i[0])||"{}"))==null?void 0:a.o0)==null?void 0:s.data})])).map(e=>{var i,a;return(a=(i=e==null?void 0:e.viewer)==null?void 0:i.message_threads)==null?void 0:a.nodes}).filter(Boolean).flat().map((e,i)=>({...e,recent:i})).map(e=>{var s,r,c,l,n,u;let i=e.all_participants.nodes.map(m=>{var f,p,h;return{id:m.messaging_actor.id,name:m.messaging_actor.name,avatar:((f=m.messaging_actor.profile_picture)==null?void 0:f.uri)||((h=(p=m.messaging_actor.avatar)==null?void 0:p.big_image_src)==null?void 0:h.uri)||D(m.messaging_actor.id)}}),a={recent:e.recent,type:e.thread_type,id:((s=e.thread_key)==null?void 0:s.other_user_id)||((r=e.thread_key)==null?void 0:r.thread_fbid)||(e.id?(l=(c=atob(e.id))==null?void 0:c.split(":"))==null?void 0:l[1]:""),count:e.messages_count,name:e.name||((n=i[0])==null?void 0:n.name)||"-no data-",participants:i,image:(u=e.image)==null?void 0:u.uri};return{...a,url:`https://www.facebook.com/messages/t/${a.id}`,isGroup:a.type==="GROUP"||a.type==="COMMUNITY_GROUP"}})}async function v({threadId:t,startTime:o=I.valueOf(),endTime:d=x().valueOf(),progress:e}){var s;let i=1e3*Math.round((o+d)/2/1e3);e==null||e(i);let a=await k({threadId:t,time:i,limit:1});if(Math.abs(d-o)<=1e3){for(;;)try{const r=await M({threadId:t,msgId:(s=a==null?void 0:a[0])==null?void 0:s.id,direction:"up"});if((r==null?void 0:r.length)>1)a=r;else break}catch(r){console.error(r);break}return a}return a!=null&&a.length?await v({threadId:t,startTime:o,endTime:i-1,progress:e}):await v({threadId:t,startTime:i+1,endTime:d,progress:e})}async function M({threadId:t,msgId:o,direction:d="down",limit:e=50}){var i,a;try{const s=await g({other_user_fbid:t,message_id:o,direction:d,limit:e,__a:1},"https://www.facebook.com/ajax/mercury/search_context.php"),r=y(s.substr(9));if(r!=null&&r.errorSummary)throw new Error(r==null?void 0:r.errorSummary);return((a=(i=r==null?void 0:r.payload)==null?void 0:i.graphql_payload)==null?void 0:a.map(A))||[]}catch(s){return E.fire({icon:"error",title:"Error while fetching messages",text:s.message}),[]}}async function k({threadId:t,time:o=null,limit:d=50}){var e;try{const i=await g({queries:{o0:{doc_id:"1526314457427586",query_params:{id:t,message_limit:d,load_messages:1,load_read_receipts:!0,before:o}}}},"https://www.facebook.com/api/graphqlbatch/"),a=y(i.split(`
`)[0]);if(a.o0.data.message_thread)return((e=a.o0.data.message_thread.messages)==null?void 0:e.nodes.map(A))||[]}catch(i){console.error(i.message)}return[]}function A(t){var o,d,e,i,a,s,r,c,l;return{id:t==null?void 0:t.message_id,sender:(o=t==null?void 0:t.message_sender)==null?void 0:o.id,time:Number(t==null?void 0:t.timestamp_precise),text:((d=t==null?void 0:t.message)==null?void 0:d.text)||((i=(e=t==null?void 0:t.extensible_attachment)==null?void 0:e.story_attachment)==null?void 0:i.url)||((r=(s=(a=t==null?void 0:t.extensible_attachment)==null?void 0:a.story_attachment)==null?void 0:s.description)==null?void 0:r.text)||(t==null?void 0:t.snippet),sticker:(c=t==null?void 0:t.sticker)==null?void 0:c.url,replied_to_message:t==null?void 0:t.replied_to_message,attachments:(l=t==null?void 0:t.blob_attachments)==null?void 0:l.map(n=>{var u,m,f,p,h,w,_,b;return n.__typename==="MessageVideo"?{type:"video",uri:n.playable_url,thumbnail:((u=n.large_image)==null?void 0:u.uri)||((m=n.inbox_image)==null?void 0:m.uri)||((f=n.chat_image)==null?void 0:f.uri)}:n.__typename==="MessageImage"?{type:"image",uri:((p=n.large_preview)==null?void 0:p.uri)||((h=n.preview)==null?void 0:h.uri)||((w=n.thumbnail)==null?void 0:w.uri)}:n.__typename==="MessageFile"?{type:"file",uri:n.url,filename:n.filename}:n.__typename==="MessageAnimatedImage"?{type:"gif",uri:((_=n==null?void 0:n.animated_image)==null?void 0:_.uri)||((b=n==null?void 0:n.preview_image)==null?void 0:b.uri),filename:n.filename}:null}).filter(Boolean)}}async function G(t=""){var d,e,i,a,s,r;return!!((r=(s=(a=(i=(e=(d=(await U(t)).raw)==null?void 0:d.data)==null?void 0:e.node)==null?void 0:i.comet_hovercard_renderer)==null?void 0:a.user)==null?void 0:s.primaryActions)!=null&&r.find(c=>(c==null?void 0:c.profile_action_type)=="MESSAGE"))}function P({msgs:t,threadId:o="",threadName:d="",myUid:e=""}){return`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${d}</title>

    <style>
        * {
            margin: 0;
            box-sizing: border-box;
        }

        h1 {
            text-align: center;
        }

        .chat {
            --rad: 20px;
            --rad-sm: 3px;
            font: 16px/1.5 sans-serif;
            display: flex;
            flex-direction: column;
            padding: 20px;
            max-width: 700px;
            margin: auto;
        }

        .msg {
            position: relative;
            max-width: 75%;
            padding: 7px 15px;
            margin-bottom: 20px;
        }

        .msg.sent {
            border-radius: var(--rad) var(--rad-sm) var(--rad-sm) var(--rad);
            background: #42a5f5;
            color: #fff;
            margin-left: auto;
        }

        .msg.rcvd {
            border-radius: var(--rad-sm) var(--rad) var(--rad) var(--rad-sm);
            background: #f1f1f1;
            color: #555;
            margin-right: auto;
        }

        .msg.sent:first-child,
        .msg.rcvd+.msg.sent {
            border-top-right-radius: var(--rad);
        }

        .msg.rcvd:first-child,
        .msg.sent+.msg.rcvd {
            border-top-left-radius: var(--rad);
        }

        /* time */
        .msg::before {
            content: attr(data-time);
            font-size: 0.8rem;
            position: absolute;
            bottom: 100%;
            color: #888;
            white-space: nowrap;
        }

        .msg.sent::before {
            right: 5px;
        }

        .msg.rcvd::before {
            left: 5px;
        }

        .msg img,
        .msg video {
            max-width: 300px;
            max-height: 300px;
        }

        .msg .avatar img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
        }
    </style>
</head>

<body>
    <h1><a target="_blank" href="https://www.facebook.com/messages/t/${o}">${d}</a></h1>
    <div id="root" class="chat"></div>
    <script>
        const myUid = '${e}';
        const data = ${JSON.stringify(t)};

        let html = ''
        for (let d of data) {
            const isMy = d.sender === myUid;

            let msg = ''
            if (!isMy)
                msg += '<a class="avatar" href="https://fb.com/' + d.sender + '"><img src="' + avatar(d.sender) +
                '"/></a>';

            if (d.text) msg += '<p>' + d.text + '</p>'
            if (d.sticker) msg += '<img src="' + d.sticker + '"/>'
            msg += (d.attachments || []).map(a => {
                if (a.type === 'video')
                    return '<video loop controls src="' + a.uri + '"/>';
                if (a.type === 'image' || a.type === 'gif')
                    return '<img src="' + a.uri + '" />';
                if (a.type === 'file')
                    return '<a href="' + a.uri + '" target="_blank" rel="noreferrer">File: ' + a.filename +
                        '</a>';
                return null;
            }).filter(Boolean).join('');

            html += '<div data-time="' + new Date(d.time).toLocaleString() + '" class="msg ' +
                (isMy ? 'sent' : 'rcvd') +
                '">' + msg + '</div>'
        }
        const root = document.getElementById('root')
        root.innerHTML = html;

        function avatar(uid) {
            return 'https://graph.facebook.com/' + uid +
                '/picture?height=30&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662';
        }
    <\/script>
</body>

</html>
`}export{Y as a,k as b,M as c,G as d,v as f,$ as g,I as m,P as s};
