import{U as $}from"./util.be872bdf.js";b();async function b(){const i="https://visakanv-semantic-search.defenderofbasic.workers.dev/query",y=await(await fetch("https://pub-b47936fccfdb443db581ea766f51a5c0.r2.dev/visakanv.json.gz")).arrayBuffer(),v=pako.ungzip(new Uint8Array(y),{to:"string"}),l=JSON.parse(v),t=new $;t.accountId=l.account[0].account.accountId,t.username=l.account[0].account.username,t.name=l.account[0].account.accountDisplayName,t.avatar=l.profile[0].profile.avatarMediaUrl,document.querySelector("#title").innerHTML=t.username;let u=t.preprocessTweets(l.tweets);u=t.sortAscending(u);const m=t.getThreads(u),d=[],h={};let p=0;for(let n=0;n<m.tweets.length;n++){const o=m.tweets[n];if(o.parent)continue;const r=[o];let e=o;for(;e.nextTweet;)p+=e.full_text.split(" ").length,r.push(e.nextTweet),e=e.nextTweet;d.push(r),h[o.id]=r}window.threadsById=h,document.querySelector("#subtitle").innerHTML=`${p.toLocaleString()} words - ${d.length.toLocaleString()} threads`,console.log({wordCount:p,threadsLength:d.length});const w=document.querySelector("#clusterThreads");document.querySelector(".search-box").addEventListener("keydown",async function(n){if(n.key==="Enter"&&!n.shiftKey){w.innerHTML="<h3>Loading...</h3>",n.preventDefault();const o=this.value,e=await(await fetch(i,{method:"POST",body:JSON.stringify({searchTerm:o})})).json();console.log(e);let s="";for(let c=0;c<e.matches.length;c++){const f=e.matches[c],g=h[f.id];console.log(g),console.log("id",f.id),s+=T(g,f.score)}w.innerHTML=s,console.log(e.matches.map(c=>({score:c.score,text:c.metadata.text,id:c.metadata.id})))}});function T(n,o){let r="";r+=`<h2>${n.length} tweets</h2>
                    <p>${o}</p>`;for(let e=0;e<n.length;e++){const s=n[e];r+=`<tweet-component
                            avatar="${t.avatar}"
                            name="${t.name}"
                            username="${t.username}"
                            timestamp="${s.date}"
                            likes="${s.favorite_count}"
                            retweets="${s.retweet_count}"
                            url="${s.url.trim()}"
                        >
                        ${L(s.full_text)}
                        </tweet-component>
                    `}return r+="</div>",r}}function L(i){let a=i.replace(/"/g,"&quot;");return a=a.replace(/'/g,"&#39;"),a=a.replace(/\n/g,"<br>"),a=a.replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank">$1</a>'),a}
