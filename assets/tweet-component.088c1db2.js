const c=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const n of t.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}};c();class l extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render()}render(){const s=this.getAttribute("avatar"),o=this.getAttribute("name"),r=this.getAttribute("username");this.getAttribute("content");const e=new Date(this.getAttribute("timestamp")).toLocaleString(),t=this.getAttribute("likes"),n=this.getAttribute("retweets"),a=this.getAttribute("url");this.shadowRoot.innerHTML=`
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
                    <a href="${a}" target="_blank">
                    <div class="tweet-header">
                        <img class="avatar" src="${s}" alt="${o}'s avatar">
                        <div class="user-info">
                            <span class="name">${o}</span>
                            <span class="username">@${r}</span>
                        </div>
                    </div>
                    </a>
                    <slot class="content"></slot>
                    <div class="timestamp">${e}</div>
                    <div class="actions">
                        <span>\u2665 ${t}</span>
                        <span>\u{1F501} ${n}</span>
                    </div>
                </div>

            

            
        `}}customElements.define("tweet-component",l);
