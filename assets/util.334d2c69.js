const d=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function r(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerpolicy&&(n.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?n.credentials="include":t.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(t){if(t.ep)return;t.ep=!0;const n=r(t);fetch(t.href,n)}};d();class p extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render()}render(){const e=this.getAttribute("avatar"),r=this.getAttribute("name"),o=this.getAttribute("username");this.getAttribute("content");const t=new Date(this.getAttribute("timestamp")).toLocaleString(),n=this.getAttribute("likes"),s=this.getAttribute("retweets"),u=this.getAttribute("url");this.shadowRoot.innerHTML=`
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
                    <a href="${u}" target="_blank">
                    <div class="tweet-header">
                        <img class="avatar" src="${e}" alt="${r}'s avatar">
                        <div class="user-info">
                            <span class="name">${r}</span>
                            <span class="username">@${o}</span>
                        </div>
                    </div>
                    </a>
                    <slot class="content"></slot>
                    <div class="timestamp">${t}</div>
                    <div class="actions">
                        <span>\u2665 ${n}</span>
                        <span>\u{1F501} ${s}</span>
                    </div>
                </div>

            

            
        `}}customElements.define("tweet-component",p);class f{constructor(){this.accountId=null,this.username=null,this.tweetsById={}}preprocessTweets(e){const r=[];for(let o=0;o<e.length;o++){const t=e[o].tweet;t.url=`https://x.com/${this.username}/status/${t.id}`,t.date=new Date(t.created_at),r.push(t),this.tweetsById[t.id]=t}return r}getThreads(e){const r=[];let o=0,t=0;for(let n=0;n<e.length;n++){const{in_reply_to_user_id_str:s,in_reply_to_status_id:u,full_text:l}=e[n];if(l.startsWith("RT")){o++;continue}if(s!=null&&s!=this.accountId){e[n].is_external_reply=!0,t++;continue}if(s==this.accountId){const a=u;if(!this.tweetsById[a]){console.error(`Error: failed to find tweet ${a}`);continue}if(this.tweetsById[a].is_external_reply){e[n].is_external_reply=!0,t++;continue}else this.tweetsById[a].nextTweet=e[n],e[n].parent=this.tweetsById[a]}r.push(e[n])}return{tweets:r,retweet_count:o,external_reply_count:t}}sortAscending(e){return e.sort(function(r,o){return r.date-o.date})}sortDescending(e){return e.sort(function(r,o){return o.date-r.date})}formatDate(e,r){return e.toLocaleDateString("en-US",r||{hour:"numeric",year:"numeric",month:"short",day:"2-digit"})}makeHTMLForTweet(e){return`<div class="tweet">
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
    `}makeHTMLForThread(e){let r='<div class="thread">';for(;e;)r+=this.makeHTMLForTweet(e),e=e.nextTweet;return r+="</div>",r}getPopularityOverTime(e){const r=e.reduce((o,t)=>{const n=c(t.date),s=Number(t.favorite_count)+Number(t.retweet_count);return o[n]=(o[n]||0)+s,o},{});return m(Object.entries(r).map(o=>({x:o[0],y:o[1]})))}countTweetsPerDay(e){const r=e.reduce((t,n)=>{const s=c(n.date);return t[s]=(t[s]||0)+1,t},{});return Object.entries(r).sort((t,n)=>n[1]-t[1]).map(t=>({date:t[0],count:t[1]}))}countTweetsPerHour(e){const r=e.reduce((t,n)=>{const s=h(n.date);return t[s]=(t[s]||0)+1,t},{});return Object.entries(r).sort((t,n)=>n[1]-t[1]).map(t=>({date:t[0],count:t[1]}))}isTweetInteractingWith(e,r){const o=r.entities.user_mentions;if(r.in_reply_to_user_id==e)return!0;for(let t of o)if(t.id==e)return!0;return!1}}const c=i=>{const e=i.getFullYear(),r=(i.getMonth()+1).toString().padStart(2,"0"),o=i.getDate().toString().padStart(2,"0");return`${e}-${r}-${o}`},h=i=>{const e=i.getFullYear(),r=(i.getMonth()+1).toString().padStart(2,"0"),o=(i.getDate()+1).toString().padStart(2,"0"),t=i.getHours().toString().padStart(2,"0");return`${e}-${r}-${o}/${t}`},m=i=>i.sort((e,r)=>{const o=new Date(e.x),t=new Date(r.x);return o-t});export{f as U};
