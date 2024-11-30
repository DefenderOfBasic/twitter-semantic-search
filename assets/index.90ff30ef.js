const x=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerpolicy&&(r.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?r.credentials="include":e.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(e){if(e.ep)return;e.ep=!0;const r=n(e);fetch(e.href,r)}};x();class S{constructor(){this.accountId=null,this.username=null,this.tweetsById={}}preprocessTweets(t){const n=[];for(let o=0;o<t.length;o++){const e=t[o].tweet;e.url=`https://x.com/${this.username}/status/${e.id}`,e.date=new Date(e.created_at),n.push(e),this.tweetsById[e.id]=e}return n}getThreads(t){const n=[];let o=0,e=0;for(let r=0;r<t.length;r++){const{in_reply_to_user_id_str:s,in_reply_to_status_id:p,full_text:g}=t[r];if(g.startsWith("RT")){o++;continue}if(s!=null&&s!=this.accountId){t[r].is_external_reply=!0,e++;continue}if(s==this.accountId){const u=p;if(!this.tweetsById[u]){console.error(`Error: failed to find tweet ${u}`);continue}if(this.tweetsById[u].is_external_reply){t[r].is_external_reply=!0,e++;continue}else this.tweetsById[u].nextTweet=t[r],t[r].parent=this.tweetsById[u]}n.push(t[r])}return{tweets:n,retweet_count:o,external_reply_count:e}}sortAscending(t){return t.sort(function(n,o){return n.date-o.date})}sortDescending(t){return t.sort(function(n,o){return o.date-n.date})}formatDate(t,n){return t.toLocaleDateString("en-US",n||{hour:"numeric",year:"numeric",month:"short",day:"2-digit"})}makeHTMLForTweet(t){return`<div class="tweet">
      <p>${t.full_text}</p>
      <div class="metadata">
        <p>${this.formatDate(t.date)}</p>
        <div class="toolbar">
          ${Number(t.retweet_count).toLocaleString()} \u{1F502} ${Number(t.favorite_count).toLocaleString()} \u{1F90D}
          <a href="${t.url}" target="_blank" style="text-decoration:none">
            <svg width="20px" height="20px" viewBox="0 0 24 24" transform="translate(0 3)" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V13" stroke="#292929" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M9 15L20 4" stroke="#292929" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M15 4H20V9" stroke="#292929" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </a>
        </div>
      </div>
    </div>
    `}makeHTMLForThread(t){let n='<div class="thread">';for(;t;)n+=this.makeHTMLForTweet(t),t=t.nextTweet;return n+="</div>",n}getPopularityOverTime(t){const n=t.reduce((o,e)=>{const r=T(e.date),s=Number(e.favorite_count)+Number(e.retweet_count);return o[r]=(o[r]||0)+s,o},{});return b(Object.entries(n).map(o=>({x:o[0],y:o[1]})))}countTweetsPerDay(t){const n=t.reduce((e,r)=>{const s=T(r.date);return e[s]=(e[s]||0)+1,e},{});return Object.entries(n).sort((e,r)=>r[1]-e[1]).map(e=>({date:e[0],count:e[1]}))}countTweetsPerHour(t){const n=t.reduce((e,r)=>{const s=k(r.date);return e[s]=(e[s]||0)+1,e},{});return Object.entries(n).sort((e,r)=>r[1]-e[1]).map(e=>({date:e[0],count:e[1]}))}isTweetInteractingWith(t,n){const o=n.entities.user_mentions;if(n.in_reply_to_user_id==t)return!0;for(let e of o)if(e.id==t)return!0;return!1}}const T=a=>{const t=a.getFullYear(),n=(a.getMonth()+1).toString().padStart(2,"0"),o=a.getDate().toString().padStart(2,"0");return`${t}-${n}-${o}`},k=a=>{const t=a.getFullYear(),n=(a.getMonth()+1).toString().padStart(2,"0"),o=(a.getDate()+1).toString().padStart(2,"0"),e=a.getHours().toString().padStart(2,"0");return`${t}-${n}-${o}/${e}`},b=a=>a.sort((t,n)=>{const o=new Date(t.x),e=new Date(n.x);return o-e});L();async function L(){const a="https://nosilverv-semantic-search.defenderofbasic.workers.dev/query",o=await(await fetch("https://pub-b47936fccfdb443db581ea766f51a5c0.r2.dev/nosilverv.json.gz")).arrayBuffer(),e=pako.ungzip(new Uint8Array(o),{to:"string"}),r=JSON.parse(e),s=new S;s.accountId=r.account[0].account.accountId,s.username=r.account[0].account.username,s.name=r.account[0].account.accountDisplayName,s.avatar=r.profile[0].profile.avatarMediaUrl,document.querySelector("#title").innerHTML=s.username;let p=s.preprocessTweets(r.tweets);p=s.sortAscending(p);const g=s.getThreads(p),u=[],m={};let y=0;for(let c=0;c<g.tweets.length;c++){const d=g.tweets[c];if(d.parent)continue;const l=[d];let i=d;for(;i.nextTweet;)y+=i.full_text.split(" ").length,l.push(i.nextTweet),i=i.nextTweet;u.push(l),m[d.id]=l}window.threadsById=m,document.querySelector("#subtitle").innerHTML=`${y.toLocaleString()} words - ${u.length.toLocaleString()} threads`,console.log({wordCount:y,threadsLength:u.length});const _=document.querySelector("#clusterThreads");document.querySelector(".search-box").addEventListener("keydown",async function(c){if(c.key==="Enter"&&!c.shiftKey){_.innerHTML="<h3>Loading...</h3>",c.preventDefault();const d=this.value,i=await(await fetch(a,{method:"POST",body:JSON.stringify({searchTerm:d})})).json();console.log(i);let h="";for(let f=0;f<i.matches.length;f++){const w=i.matches[f],v=m[w.id];console.log(v),console.log("id",w.id),h+=$(v,w.score)}_.innerHTML=h,console.log(i.matches.map(f=>({score:f.score,text:f.metadata.text,id:f.metadata.id})))}});function $(c,d){let l="";l+=`<h2>${c.length} tweets</h2>
                    <p>${d}</p>`;for(let i=0;i<c.length;i++){const h=c[i];l+=`<tweet-component
                            avatar="${s.avatar}"
                            name="${s.name}"
                            username="${s.username}"
                            timestamp="${h.date}"
                            likes="${h.favorite_count}"
                            retweets="${h.retweet_count}"
                            url="${h.url.trim()}"
                        >
                        ${D(h.full_text)}
                        </tweet-component>
                    `}return l+="</div>",l}}function D(a){let t=a.replace(/"/g,"&quot;");return t=t.replace(/'/g,"&#39;"),t=t.replace(/\n/g,"<br>"),t=t.replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank">$1</a>'),t}
