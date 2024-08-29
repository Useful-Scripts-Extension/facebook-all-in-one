import{S as n}from"./sweetalert2.all-CPfqglTu.js";import{a as m,b as f}from"./feeds-oFJ5YWBc.js";import{a8 as e,t as o,q as y,$ as k,G as P,a9 as p,aa as v}from"./MyApp-Bys9Gcx7.js";import{ai as u,ah as d}from"./index-Bauu_rQz.js";const l="https://www.facebook.com/groups/1154059318582088/posts/1473755286612488/";function S(){return u.sharedPostURL(d.getState())?!0:n.fire({title:e({en:"Unlock VIP",vi:"Mở khoá VIP"}),html:`
            <i class="fa-solid fa-crown" style="font-size: 30px; color: gold"></i>
            <br />
            <p>
                ${e({en:"Only 2 simple steps",vi:"Chỉ cần 2 bước đơn giản"})}
            </p>
            <ol style="text-align:left">
                <li>
                    ${e({en:`Share <a href="${l}" target="_blank">This post</a> to your Facebook profile (PUBLIC)`,vi:`Chia sẻ <a href="${l}" target="_blank">Bài viết này</a> lên trang cá nhân (CÔNG KHAI)`})}
                </li>
                <li>
                    ${e({en:"Enter your shared post URL here to unlock VIP",vi:"Nhập link bài chia sẻ của bạn để mở khoá VIP"})}
                </li>
            </ol>

            <span style="color:gray;font-size:0.9em;margin:5px;display:block">${e({en:"NOTE: Right click here on your shared post to get link",vi:"Gợi ý: Chuột phải ở đây trên bài chia sẻ để lấy link"})}</span>
            <img src="https://i.imgur.com/8ScfR7U.png" style="height:150px" referrerpolicy="no-referrer" />
            <br/>
            <input
                id="input-vip"
                type="text"
                class="swal2-input"
                placeholder="${e({en:"Enter your shared post url",vi:"Nhập link bài chia sẻ"})}">
        `,preConfirm:async()=>{const t=document.getElementById("input-vip");return await w(t==null?void 0:t.value)},confirmButtonText:e({en:"Unlock VIP",vi:"Mở khoá VIP"}),cancelButtonText:e({en:"Compare",vi:"So sánh"}),denyButtonText:e({en:"Need Help?",vi:"Trợ giúp?"}),showCancelButton:!0,showDenyButton:!0,reverseButtons:!0}).then(t=>{if(t.isDenied)return o("VIP:needHelp"),window.open("https://www.facebook.com/groups/1154059318582088/posts/1475090716478945/","_blank"),!1;if(t.dismiss===n.DismissReason.cancel)return o("VIP:compare"),window.location.hash="/vip",!1})}async function w(i=""){try{if(n.showLoading(),!i)return n.showValidationMessage(e({en:"Please enter post url",vi:"Vui lòng nhập link bài viết"}));const t=await m(i);if(!t)return o("VIP:checkPostId:fail"),n.showValidationMessage(e({en:"Cannot get postId from this URL",vi:"Không tìm thấy id bài viết từ link bạn đã nhập"}));const s=await y(i);if(!s)return o("VIP:checkUid:fail"),n.showValidationMessage(e({en:"Cannot get uid from this URL",vi:"Không tìm thấy uid từ link này"}));const g=await k();if(s!==g){o("VIP:checkOwnUid:fail");const h=await P(s);return n.showValidationMessage(e({en:"This post is not yours ("+h.name+")",vi:"Bài viết này không phải của bạn ("+h.name+")"}))}const c=await f(s,t);console.log(c);const a=p(c,"story.url");if(console.log(a),!(a!=null&&a.includes(l)))return o("VIP:checkSharedPostContent:fail"),n.showValidationMessage(e({en:"Your post is not shared from my post above",vi:"Bài viết này không được chia sẻ từ bài viết trên"}));const r=p(c,"source.scope.icon_image.name");return console.log(r),r.includes("everyone")?(u.setSharedPostURL(d.getState())(i),o("VIP:unlocked"),await n.fire({icon:"success",title:e({en:"VIP unlocked",vi:"Đã mở khoá VIP"}),text:e({en:"Yay, VIP unlocked. Enjoy!",vi:"Yay, Đã mở khoá VIP thành công. Hãy tận hưởng nhé!"}),confirmButtonText:e({en:"Great!",vi:"Tuyệt vời!"}),confirmButtonColor:"green"}),!0):(o("VIP:checkShareScope:fail"),n.showValidationMessage(e({en:"Please share your post as PUBLIC (current: "+r+")",vi:"Vui lòng chia sẻ CÔNG KHAI bài viết (hiện tại: "+r+")"})))}catch(t){return v.error({message:e({en:"Error. VIP will be unlocked temporarily",vi:"Lỗi. Bạn sẽ được sử dụng VIP tạm thời"}),description:t.message}),!0}finally{n.hideLoading()}}export{S as c};
