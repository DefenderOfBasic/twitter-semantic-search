import"./tweet-component.088c1db2.js";import{U as d}from"./util.8203463a.js";h();async function h(){const n=await(await fetch("./archive-combined.json")).json();console.log(n);const e="http://localhost:3005",t=new d;t.username=n.account[0].account.username,t.name=n.account[0].account.accountDisplayName,t.accountId=n.account[0].account.accountId,t.avatar=n.profile[0].profile.avatarMediaUrl,document.querySelector("#title").innerHTML=t.username,document.querySelector(".subtitle").innerHTML="local semantic search";const s=document.querySelector("#clusterThreads");document.querySelector(".search-box").addEventListener("keydown",async function(o){if(o.key==="Enter"&&!o.shiftKey){document.querySelector("#instructions").style.display="none",s.innerHTML="<h3>Searching embedding space...</h3>",o.preventDefault();const c=this.value;let a=await(await fetch(`${e}/query`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({searchTerm:c})})).json();console.log(a);let r="";a.forEach(({tweetId:l,score:m,text:p})=>{r+=i({text:p,tweetId:l},m)}),s.innerHTML=r}});function i({text:o,tweetId:c},u){let a="";a+=`<p>similarity score: ${u}</p>`;const r=`https://x.com/${t.username}/status/${c}`;return a+=`<tweet-component
                            avatar="${t.avatar}"
                            name="${t.name}"
                            username="${t.username}"
                            url="${r}"
                        >
                        ${y(o)}
                        </tweet-component>
                    `,a}}function y(n){let e=n.replace(/"/g,"&quot;");return e=e.replace(/'/g,"&#39;"),e=e.replace(/\n/g,"<br>"),e=e.replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank">$1</a>'),e}
