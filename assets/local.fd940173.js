import"./tweet-component.088c1db2.js";import{U as d}from"./util.8203463a.js";h();async function h(){const n=await(await fetch("./defenderofbasic.json")).json();console.log(n);const t="http://localhost:3005",e=new d;e.username=n.account[0].account.username,e.name=n.account[0].account.accountDisplayName,e.accountId=n.account[0].account.accountId,e.avatar=n.profile[0].profile.avatarMediaUrl,console.log(e),document.querySelector("#title").innerHTML=e.username,document.querySelector(".subtitle").innerHTML="local semantic search";const s=document.querySelector("#clusterThreads");document.querySelector(".search-box").addEventListener("keydown",async function(o){if(o.key==="Enter"&&!o.shiftKey){document.querySelector("#instructions").style.display="none",s.innerHTML="<h3>Searching embedding space...</h3>",o.preventDefault();const c=this.value;let a=await(await fetch(`${t}/query`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({searchTerm:c})})).json();console.log(a);let r="";a.forEach(({tweetId:l,score:m,text:p})=>{r+=i({text:p,tweetId:l},m)}),s.innerHTML=r}});function i({text:o,tweetId:c},u){let a="";a+=`<p>similarity score: ${u}</p>`;const r=`https://x.com/${e.username}/status/${c}`;return a+=`<tweet-component
                            avatar="${e.avatar}"
                            name="${e.name}"
                            username="${e.username}"
                            url="${r}"
                        >
                        ${f(o)}
                        </tweet-component>
                    `,a}}function f(n){let t=n.replace(/"/g,"&quot;");return t=t.replace(/'/g,"&#39;"),t=t.replace(/\n/g,"<br>"),t=t.replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank">$1</a>'),t}
