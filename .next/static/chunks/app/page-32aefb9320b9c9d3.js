(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{47943:function(){},55024:function(){},34327:function(e,t,r){Promise.resolve().then(r.bind(r,31969))},16463:function(e,t,r){"use strict";var n=r(71169);r.o(n,"usePathname")&&r.d(t,{usePathname:function(){return n.usePathname}}),r.o(n,"useRouter")&&r.d(t,{useRouter:function(){return n.useRouter}}),r.o(n,"useSearchParams")&&r.d(t,{useSearchParams:function(){return n.useSearchParams}})},31969:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return u}});var n=r(57437),a=r(2265),o=r(83039),s=r(68771),c=r(53142),l=r(16463);function u(){let[e,t]=(0,c.N)(),r=(0,l.useRouter)();return(0,a.useEffect)(()=>{let e=window.location.pathname;e.includes("/public/")?t("public"):e.includes("/testnet/")?t("testnet"):(t("public"),r.replace("/public"))}),(0,n.jsx)(s.Z,{children:(0,n.jsx)(o.Z,{setParNet:t})})}},83039:function(e,t,r){"use strict";r.d(t,{Z:function(){return f}});var n=r(57437),a=r(2265);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),s=function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return t.filter((e,t,r)=>!!e&&r.indexOf(e)===t).join(" ")};/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var c={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let l=(0,a.forwardRef)((e,t)=>{let{color:r="currentColor",size:n=24,strokeWidth:o=2,absoluteStrokeWidth:l,className:u="",children:i,iconNode:d,...h}=e;return(0,a.createElement)("svg",{ref:t,...c,width:n,height:n,stroke:r,strokeWidth:l?24*Number(o)/Number(n):o,className:s("lucide",u),...h},[...d.map(e=>{let[t,r]=e;return(0,a.createElement)(t,r)}),...Array.isArray(i)?i:[i]])}),u=((e,t)=>{let r=(0,a.forwardRef)((r,n)=>{let{className:c,...u}=r;return(0,a.createElement)(l,{ref:n,iconNode:t,className:s("lucide-".concat(o(e)),c),...u})});return r.displayName="".concat(e),r})("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);var i=r(83985),d=r.n(i),h=r(16463),m=r(53142);r(50169);var f=()=>{let[e,t]=(0,a.useState)([]),[r,o]=(0,a.useState)(""),[s,c]=(0,m.N)(),l=(0,h.useRouter)(),[i,f]=(0,a.useState)(null),[p,g]=(0,a.useState)(null);if(!0===p)return null;let w=async()=>{let e=new(d()).Server("testnet"===s?"https://horizon-testnet.stellar.org":"https://horizon.stellar.org");try{await e.loadAccount(r),g(!0),l.push("/".concat(s,"/").concat(r))}catch(e){e instanceof d().NotFoundError?(g(!1),f("Error: Account does not exist on the network. Make sure that you copied account address correctly and there was at least one payment to this address.")):console.error(e)}},S=()=>{""!==r&&(d().StrKey.isValidEd25519PublicKey(r)?(console.log("true"),w()):(setTimeout(()=>{g(!1)},2e3),f("Not found at ".concat(r))))};return(0,n.jsxs)(n.Fragment,{children:[i?(0,n.jsxs)("div",{className:"search ".concat(!1===p?"error":""," container narrow"),style:{padding:"20px"},children:[(0,n.jsxs)("h2",{className:"text-overflow",children:["Search results for ",r]}),null===p&&(0,n.jsx)("p",{children:"Loading..."}),!1===p&&(0,n.jsx)("span",{children:i})]}):"",(0,n.jsxs)("div",{className:"search-wrapper",children:[(0,n.jsx)("div",{style:{position:"absolute",right:"1em",color:"#0691b7",cursor:"pointer",opacity:".3",marginTop:"-8px"},onClick:S,children:(0,n.jsx)(u,{})}),(0,n.jsx)("input",{className:"search",value:r,onKeyDown:e=>{13===e.keyCode&&S()},onChange:e=>{f(null),o(e.currentTarget.value)},placeholder:"Paste an account address here"})]})]})}},68771:function(e,t,r){"use strict";var n=r(57437);r(2265),t.Z=e=>{let{children:t,props:r}=e;return(0,n.jsx)("div",{className:"page-container",children:t})}},53142:function(e,t,r){"use strict";r.d(t,{N:function(){return s}});var n=r(57437),a=r(2265);let o=(0,a.createContext)(),s=()=>{let e=(0,a.useContext)(o);if(!e)throw Error("usePublic must be used within a PublicProvider");return[e.net,e.setNet]};t.Z=e=>{let{children:t}=e,[r,s]=(0,a.useState)("public");return(0,a.useEffect)(()=>{let e=localStorage.getItem("net");if(e){let t=window.location.pathname.split("/");t.includes("public")?s("public"):t.includes("testnet")?s("testnet"):s(e)}else{let e=window.location.pathname.split("/");e.includes("public")?(s("public"),localStorage.setItem("net","public")):e.includes("testnet")?(s("testnet"),localStorage.setItem("net","testnet")):(s("public"),localStorage.setItem("net","public"))}},[]),(0,n.jsx)(o.Provider,{value:{net:r,setNet:e=>{s(e),localStorage.setItem("net",e)}},children:t})}},50169:function(e,t,r){"use strict";r.d(t,{bM:function(){return c},TJ:function(){return l},H4:function(){return s}});var n=r(83985),a=JSON.parse('{"x":60000,"s":600000}');let o=new n.Server("https://horizon.stellar.org"),s=async e=>{try{let t=localStorage.getItem("main-"+e);if(t)return JSON.parse(t);let r=await o.loadAccount(e);return localStorage.setItem("main-"+e,JSON.stringify(r)),setTimeout(()=>{localStorage.removeItem("main-"+e)},a.x),r}catch(e){return[]}},c=async e=>{try{let t=localStorage.getItem("issuer-"+e);if(t)return JSON.parse(t);let r=await o.assets().forIssuer(e).call();return localStorage.setItem("issuer-"+e,JSON.stringify(r)),setTimeout(()=>{localStorage.removeItem("issuer-"+e)},a.x),r}catch(e){return[]}},l=async e=>{try{let t=localStorage.getItem("domain-"+e);if(t)return t;let r=await fetch("https://".concat(e,"/.well-known/stellar.toml")),n=await r.text();return localStorage.setItem("domain-"+e,n),setTimeout(()=>{localStorage.removeItem("domain-"+e)},a.s),n}catch(e){return""}}}},function(e){e.O(0,[638,985,971,23,744],function(){return e(e.s=34327)}),_N_E=e.O()}]);