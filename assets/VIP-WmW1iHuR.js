import{S as n}from"./sweetalert2.all-BmLNahrN.js";import{a as g,b as m}from"./feeds-CWLixFh1.js";import{a8 as t,q as y,$ as f,G as v,a9 as h,aa as w}from"./MyApp-nuvdhu8g.js";import{ai as p,ah as u}from"./index-C6IDuEAZ.js";const c="https://www.facebook.com/groups/1154059318582088/posts/1473755286612488/";function C(){return p.sharedPostURL(u.getState())?!0:n.fire({title:t({en:"Unlock VIP",vi:"Mở khoá VIP"}),html:`
            <i class="fa-solid fa-crown" style="font-size: 30px; color: gold"></i>
            <br />
            <p>
                ${t({en:"Only 2 simple steps",vi:"Chỉ cần 2 bước đơn giản"})}
            </p>
            <ol style="text-align:left">
                <li>
                    ${t({en:`Share <a href="${c}" target="_blank">This post</a> to your Facebook profile (PUBLIC)`,vi:`Chia sẻ <a href="${c}" target="_blank">Bài viết này</a> lên trang cá nhân (CÔNG KHAI)`})}
                </li>
                <li>
                    ${t({en:"Enter your shared post URL here to unlock VIP",vi:"Nhập link bài chia sẻ của bạn để mở khoá VIP"})}
                </li>
            </ol>

            <span style="color:gray;font-size:0.9em;margin:5px;display:block">${t({en:"NOTE: Right click here on your shared post to get link",vi:"Gợi ý: Chuột phải ở đây trên bài chia sẻ để lấy link"})}</span>
            <img src="https://i.imgur.com/8ScfR7U.png" style="height:150px" referrerpolicy="no-referrer" />
            <br/>
            <input
                id="input-vip"
                type="text"
                class="swal2-input"
                placeholder="${t({en:"Enter your shared post url",vi:"Nhập link bài chia sẻ"})}">
        `,preConfirm:async()=>{const e=document.getElementById("input-vip");return await k(e==null?void 0:e.value)},confirmButtonText:t({en:"Unlock VIP",vi:"Mở khoá VIP"}),cancelButtonText:t({en:"Compare",vi:"So sánh"}),denyButtonText:t({en:"Need Help?",vi:"Trợ giúp?"}),showCancelButton:!0,showDenyButton:!0,reverseButtons:!0}).then(e=>{if(e.isDenied)return window.open("https://www.facebook.com/groups/1154059318582088/posts/1475090716478945/","_blank"),!1;if(e.dismiss===n.DismissReason.cancel)return window.location.hash="/vip",!1})}async function k(o=""){try{if(n.showLoading(),!o)return n.showValidationMessage(t({en:"Please enter post url",vi:"Vui lòng nhập link bài viết"}));const e=await g(o);if(!e)return n.showValidationMessage(t({en:"Cannot get postId from this URL",vi:"Không tìm thấy id bài viết từ link bạn đã nhập"}));const i=await y(o);if(!i)return n.showValidationMessage(t({en:"Cannot get uid from this URL",vi:"Không tìm thấy uid từ link này"}));const d=await f();if(i!==d){const l=await v(i);return n.showValidationMessage(t({en:"This post is not yours ("+l.name+")",vi:"Bài viết này không phải của bạn ("+l.name+")"}))}const r=await m(i,e);console.log(r);const s=h(r,"story.url");if(console.log(s),!(s!=null&&s.includes(c)))return n.showValidationMessage(t({en:"Your post is not shared from my post above",vi:"Bài viết này không được chia sẻ từ bài viết trên"}));const a=h(r,"source.scope.icon_image.name");return console.log(a),a.includes("everyone")?(p.setSharedPostURL(u.getState())(o),await n.fire({icon:"success",title:t({en:"VIP unlocked",vi:"Đã mở khoá VIP"}),text:t({en:"Yay, VIP unlocked. Enjoy!",vi:"Yay, Đã mở khoá VIP thành công. Hãy tận hưởng nhé!"}),confirmButtonText:t({en:"Great!",vi:"Tuyệt vời!"}),confirmButtonColor:"green"}),!0):n.showValidationMessage(t({en:"Please share your post as PUBLIC (current: "+a+")",vi:"Vui lòng chia sẻ CÔNG KHAI bài viết (hiện tại: "+a+")"}))}catch(e){return w.error({message:t({en:"Error. VIP will be unlocked temporarily",vi:"Lỗi. Bạn sẽ được sử dụng VIP tạm thời"}),description:e.message}),!0}finally{n.hideLoading()}}export{C as c};
