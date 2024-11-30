const _=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerpolicy&&(r.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?r.credentials="include":t.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(t){if(t.ep)return;t.ep=!0;const r=n(t);fetch(t.href,r)}};_();class $ extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render()}render(){const e=this.getAttribute("avatar"),n=this.getAttribute("name"),o=this.getAttribute("username");this.getAttribute("content");const t=new Date(this.getAttribute("timestamp")).toLocaleString(),r=this.getAttribute("likes"),s=this.getAttribute("retweets"),p=this.getAttribute("url");this.shadowRoot.innerHTML=`
            <style>
                a {
                    color: black;
                    text-decoration: none; /* no underline */
                }
                .tweet {
                    margin: 5px;
                    background-color: #ffffff;
                    border-radius: 12px;
                    padding: 16px;
                    max-width: 400px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                .tweet-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                }
                .avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    margin-right: 12px;
                }
                .user-info {
                    display: flex;
                    flex-direction: column;
                }
                .name {
                    font-weight: bold;
                }
                .username {
                    color: #536471;
                }
                .content {
                    margin-bottom: 12px;
                    line-height: 1.4;
                }
                .timestamp {
                    color: #536471;
                    font-size: 0.9em;
                    margin-bottom: 12px;
                }
                .actions {
                    display: flex;
                    justify-content: space-between;
                    color: #536471;
                    font-size: 0.9em;
                }
            </style>
            
                <div class="tweet">
                    <a href="${p}">
                    <div class="tweet-header">
                        <img class="avatar" src="${e}" alt="${n}'s avatar">
                        <div class="user-info">
                            <span class="name">${n}</span>
                            <span class="username">@${o}</span>
                        </div>
                    </div>
                    </a>
                    <slot class="content"></slot>
                    <div class="timestamp">${t}</div>
                    <div class="actions">
                        <span>\u2665 ${r}</span>
                        <span>\u{1F501} ${s}</span>
                    </div>
                </div>

            

            
        `}}customElements.define("tweet-component",$);class k{constructor(){this.accountId=null,this.username=null,this.tweetsById={}}preprocessTweets(e){const n=[];for(let o=0;o<e.length;o++){const t=e[o].tweet;t.url=`https://x.com/${this.username}/status/${t.id}`,t.date=new Date(t.created_at),n.push(t),this.tweetsById[t.id]=t}return n}getThreads(e){const n=[];let o=0,t=0;for(let r=0;r<e.length;r++){const{in_reply_to_user_id_str:s,in_reply_to_status_id:p,full_text:f}=e[r];if(f.startsWith("RT")){o++;continue}if(s!=null&&s!=this.accountId){e[r].is_external_reply=!0,t++;continue}if(s==this.accountId){const l=p;if(!this.tweetsById[l]){console.error(`Error: failed to find tweet ${l}`);continue}if(this.tweetsById[l].is_external_reply){e[r].is_external_reply=!0,t++;continue}else this.tweetsById[l].nextTweet=e[r],e[r].parent=this.tweetsById[l]}n.push(e[r])}return{tweets:n,retweet_count:o,external_reply_count:t}}sortAscending(e){return e.sort(function(n,o){return n.date-o.date})}sortDescending(e){return e.sort(function(n,o){return o.date-n.date})}formatDate(e,n){return e.toLocaleDateString("en-US",n||{hour:"numeric",year:"numeric",month:"short",day:"2-digit"})}makeHTMLForTweet(e){return`<div class="tweet">
      <p>${e.full_text}</p>
      <div class="metadata">
        <p>${this.formatDate(e.date)}</p>
        <div class="toolbar">
          ${Number(e.retweet_count).toLocaleString()} \u{1F502} ${Number(e.favorite_count).toLocaleString()} \u{1F90D}
          <a href="${e.url}" target="_blank" style="text-decoration:none">
            <svg width="20px" height="20px" viewBox="0 0 24 24" transform="translate(0 3)" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V13" stroke="#292929" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M9 15L20 4" stroke="#292929" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M15 4H20V9" stroke="#292929" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </a>
        </div>
      </div>
    </div>
    `}makeHTMLForThread(e){let n='<div class="thread">';for(;e;)n+=this.makeHTMLForTweet(e),e=e.nextTweet;return n+="</div>",n}getPopularityOverTime(e){const n=e.reduce((o,t)=>{const r=b(t.date),s=Number(t.favorite_count)+Number(t.retweet_count);return o[r]=(o[r]||0)+s,o},{});return L(Object.entries(n).map(o=>({x:o[0],y:o[1]})))}countTweetsPerDay(e){const n=e.reduce((t,r)=>{const s=b(r.date);return t[s]=(t[s]||0)+1,t},{});return Object.entries(n).sort((t,r)=>r[1]-t[1]).map(t=>({date:t[0],count:t[1]}))}countTweetsPerHour(e){const n=e.reduce((t,r)=>{const s=S(r.date);return t[s]=(t[s]||0)+1,t},{});return Object.entries(n).sort((t,r)=>r[1]-t[1]).map(t=>({date:t[0],count:t[1]}))}isTweetInteractingWith(e,n){const o=n.entities.user_mentions;if(n.in_reply_to_user_id==e)return!0;for(let t of o)if(t.id==e)return!0;return!1}}const b=a=>{const e=a.getFullYear(),n=(a.getMonth()+1).toString().padStart(2,"0"),o=a.getDate().toString().padStart(2,"0");return`${e}-${n}-${o}`},S=a=>{const e=a.getFullYear(),n=(a.getMonth()+1).toString().padStart(2,"0"),o=(a.getDate()+1).toString().padStart(2,"0"),t=a.getHours().toString().padStart(2,"0");return`${e}-${n}-${o}/${t}`},L=a=>a.sort((e,n)=>{const o=new Date(e.x),t=new Date(n.x);return o-t});D();async function D(){const a="https://nosilverv-semantic-search.defenderofbasic.workers.dev/query",o=await(await fetch("https://pub-b47936fccfdb443db581ea766f51a5c0.r2.dev/nosilverv.json.gz")).arrayBuffer(),t=pako.ungzip(new Uint8Array(o),{to:"string"}),r=JSON.parse(t),s=new k;s.accountId=r.account[0].account.accountId,s.username=r.account[0].account.username,s.name=r.account[0].account.accountDisplayName,s.avatar=r.profile[0].profile.avatarMediaUrl,document.querySelector("#title").innerHTML=s.username;let p=s.preprocessTweets(r.tweets);p=s.sortAscending(p);const f=s.getThreads(p),l=[],g={};let w=0;for(let c=0;c<f.tweets.length;c++){const d=f.tweets[c];if(d.parent)continue;const u=[d];let i=d;for(;i.nextTweet;)w+=i.full_text.split(" ").length,u.push(i.nextTweet),i=i.nextTweet;l.push(u),g[d.id]=u}window.threadsById=g,document.querySelector("#subtitle").innerHTML=`${w.toLocaleString()} words - ${l.length.toLocaleString()} threads`,console.log({wordCount:w,threadsLength:l.length});const v=document.querySelector("#clusterThreads");document.querySelector(".search-box").addEventListener("keydown",async function(c){if(c.key==="Enter"&&!c.shiftKey){v.innerHTML="<h3>Loading...</h3>",c.preventDefault();const d=this.value,i=await(await fetch(a,{method:"POST",body:JSON.stringify({searchTerm:d})})).json();console.log(i);let h="";for(let m=0;m<i.matches.length;m++){const y=i.matches[m],x=g[y.id];console.log(x),console.log("id",y.id),h+=T(x,y.score)}v.innerHTML=h,console.log(i.matches.map(m=>({score:m.score,text:m.metadata.text,id:m.metadata.id})))}});function T(c,d){let u="";u+=`<h2>${c.length} tweets</h2>
                    <p>${d}</p>`;for(let i=0;i<c.length;i++){const h=c[i];u+=`<tweet-component
                            avatar="${s.avatar}"
                            name="${s.name}"
                            username="${s.username}"
                            timestamp="${h.date}"
                            likes="${h.favorite_count}"
                            retweets="${h.retweet_count}"
                            url="${h.url.trim()}"
                        >
                        ${M(h.full_text)}
                        </tweet-component>
                    `}return u+="</div>",u}}function M(a){let e=a.replace(/"/g,"&quot;");return e=e.replace(/'/g,"&#39;"),e=e.replace(/\n/g,"<br>"),e=e.replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank">$1</a>'),e}
