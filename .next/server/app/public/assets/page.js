(()=>{var e={};e.id=514,e.ids=[514],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},57147:e=>{"use strict";e.exports=require("fs")},71017:e=>{"use strict";e.exports=require("path")},12781:e=>{"use strict";e.exports=require("stream")},57310:e=>{"use strict";e.exports=require("url")},59796:e=>{"use strict";e.exports=require("zlib")},66293:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>i.a,__next_app__:()=>m,originalPathname:()=>u,pages:()=>d,routeModule:()=>h,tree:()=>c}),s(75262),s(68295),s(35866);var r=s(23191),a=s(88716),l=s(37922),i=s.n(l),n=s(95231),o={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>n[e]);s.d(t,o);let c=["",{children:["public",{children:["assets",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,75262)),"F:\\Working\\stellar-multisig\\src\\app\\public\\assets\\page.js"]}]},{}]},{metadata:{icon:[async e=>(await Promise.resolve().then(s.bind(s,73881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(s.bind(s,68295)),"F:\\Working\\stellar-multisig\\src\\app\\layout.js"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,35866,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(s.bind(s,73881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],d=["F:\\Working\\stellar-multisig\\src\\app\\public\\assets\\page.js"],u="/public/assets/page",m={require:s,loadChunk:()=>Promise.resolve()},h=new r.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/public/assets/page",pathname:"/public/assets",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},33458:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,12994,23)),Promise.resolve().then(s.t.bind(s,96114,23)),Promise.resolve().then(s.t.bind(s,9727,23)),Promise.resolve().then(s.t.bind(s,79671,23)),Promise.resolve().then(s.t.bind(s,41868,23)),Promise.resolve().then(s.t.bind(s,84759,23))},11589:(e,t,s)=>{Promise.resolve().then(s.bind(s,18511))},47773:(e,t,s)=>{Promise.resolve().then(s.bind(s,30285))},18511:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>m});var r=s(10326);s(23824);var a=s(17577);let l=()=>{let[e,t]=(0,a.useState)("night");return(0,a.useEffect)(()=>{let e=localStorage.getItem("theme");e?t(e):(localStorage.setItem("theme","night"),t("night"))},[]),{theme:e,setTheme:e=>{t(e)}}};s(7846);var i=s(46226),n=s(90434),o=s(35047),c=s(82728);let d=()=>{let e=(0,o.useRouter)(),[t,s]=(0,c.N)(),[l,d]=(0,a.useState)(!1),u=(0,a.useRef)(null);(0,a.useEffect)(()=>{function e(e){u.current&&!u.current.contains(e.target)&&d(!1)}return document.addEventListener("mousedown",e),()=>{document.removeEventListener("mousedown",e)}},[]);let m=t=>{s(t),localStorage.setItem("net",t),d(!1);let r=window.location.pathname;if(console.log(r),"/public"==r||"/testnet"==r){let s=`/${t}`;e.push(s)}else if(r.includes("/public/")||r.includes("/testnet/")){let s=`/${t}${r.substring(r.indexOf("/",1))}`;e.push(s)}};return r.jsx("div",{className:"top-block",children:(0,r.jsxs)("div",{className:"container nav relative",children:[(0,r.jsxs)(n.default,{href:"/",className:"logo",style:{paddingTop:"7px"},children:[r.jsx(i.default,{src:"/montelibero-small-logo.png",alt:"Montelibero Logo",className:"dark:invert",width:30,height:30,priority:!0})," ","\xa0 MTL Stellar Multisig"]}),(0,r.jsxs)("div",{className:"nav-menu-dropdown false",children:[r.jsx("div",{className:"main-menu top-menu-block",children:r.jsx(n.default,{href:"/"+t+"/assets",children:"Assets"})}),r.jsx("div",{className:"top-menu-block right",style:{float:"right"},children:(0,r.jsxs)("div",{className:"dropdown",ref:u,children:[(0,r.jsxs)("div",{className:"dropdown-header",onClick:()=>d(!l),children:["Network ",r.jsx("span",{className:"dropdown-selected",children:t}),r.jsx("span",{className:l?"dd-toggle visible":"dd-toggle"})]}),l&&(0,r.jsxs)("div",{className:"dropdown-menu",children:[r.jsx("div",{className:`dropdown-item ${"public"===t?"selected":""}`,onClick:()=>m("public"),children:"public"}),r.jsx("div",{className:`dropdown-item ${"testnet"===t?"selected":""}`,onClick:()=>m("testnet"),children:"testnet"})]})]})})]})]})})},u=({setTheme:e})=>{let[t,s]=(0,a.useState)(""),[l,i]=(0,c.N)(),o=(0,a.useCallback)(t=>{e(t)},[e]);return(0,a.useEffect)(()=>{let e=localStorage.getItem("theme");e&&(o(e),s(e))},[o]),(0,a.useEffect)(()=>{t&&(localStorage.setItem("theme",t),o(t))},[t,o]),r.jsx("div",{className:"footer",children:(0,r.jsxs)("div",{className:"container text-center",children:[(0,r.jsxs)("div",{children:["\xa9\xa0MTL Stellar Multisig ",r.jsx("span",{className:"dimmed"})]}),(0,r.jsxs)("div",{children:[(0,r.jsxs)("a",{href:"https://github.com/montelibero-org/stellar-multisig/issues",target:"_blank",rel:"noreferrer noopener",className:"nowrap",children:[r.jsx("i",{className:"icon icon-github"})," Request a new feature\xa0"]}),(0,r.jsxs)("a",{href:"https://github.com/montelibero-org/stellar-multisig/issues",target:"_blank",rel:"noreferrer noopener",className:"nowrap",children:[r.jsx("i",{className:"icon icon-github"})," Report a bug\xa0"]}),(0,r.jsxs)("a",{href:"#",onClick:e=>{e.preventDefault(),s("day"===t?"night":"day")},children:[r.jsx("i",{className:`icon icon-${"day"===t?"night":"day"}`})," ","day"===t?"Dark":"Light"," theme"]})]}),(0,r.jsxs)("div",{className:"dimmed condensed",style:{fontSize:"0.8em"},children:["Donations:"," ",r.jsx("span",{className:"",tabIndex:"-1",children:r.jsx(n.default,{href:`/${l}/GCSAXEHZBQY65URLO6YYDOCTRLIGTNMGCQHVW2RZPFNPTEJN6VN7TFIN`,children:"GCSAXEHZBQY65URLO6YYDOCTRLIGTNMGCQHVW2RZPFNPTEJN6VN7TFIN"})})]})]})})};function m({children:e}){let{theme:t,setTheme:s}=l();return(0,r.jsxs)("html",{lang:"en","data-theme":t,children:[r.jsx("head",{children:r.jsx("script",{dangerouslySetInnerHTML:{__html:`
                            (function() {
                                var theme = localStorage.getItem('theme');
                                if (!theme) {
                                    theme = 'night';
                                    localStorage.setItem('theme', 'night');
                                }
                                document.documentElement.setAttribute('data-theme', theme);
                            })();
                        `}})}),r.jsx("body",{children:(0,r.jsxs)(c.Z,{children:[" ",(0,r.jsxs)("main",{className:"flex min-h-screen flex-col",children:[r.jsx("div",{className:"blue-ribbon"}),r.jsx(d,{}),e,r.jsx(u,{setTheme:s})]})]})})]})}s(46109)},30285:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>u});var r=s(10326),a=s(88618),l=s(17577),i=s(90434),n=s(82728);let o=JSON.parse('[{"code":"USD","issuer":"GA223OFHVKVAH2NBXP4AURJRVJTSOVHGBMKJNL6GRJWNN4SARVGSITYG","tag":"exchange"},{"code":"EUR","issuer":"GB7T4A2M6PQFJTI2JIK6I5VYZ5OGDY5CGM52NDZJ6HOVD7APCUWY4XQ5","tag":""}]');var c=s(35047);s(28505);let d=()=>{let e=(0,c.usePathname)(),t=(0,c.useSearchParams)(),s=(0,c.useRouter)(),a=t.get("filter")||"",d=t.get("tags")?new Set(t.get("tags").split(",")):new Set,[u,m]=(0,l.useState)(a),[h,p]=(0,l.useState)(d),[g,x]=(0,l.useState)([]),[f,b]=(0,n.N)();(0,l.useEffect)(()=>{x(o)},[]),(0,l.useEffect)(()=>{let t=new URLSearchParams;u&&t.set("filter",u),h.size>0&&t.set("tags",Array.from(h).join(",")),s.replace(`${e}?${t.toString()}`)},[u,h,e,s]);let j=e=>{p(t=>{let s=new Set(t);return s.has(e)?s.delete(e):s.add(e),s})},v=g.filter(e=>{let t=(e.tag||"other").toLowerCase(),s=0===h.size||h.has(t),r=t.includes(u.toLowerCase())||e.code.toLowerCase().includes(u.toLowerCase())||e.issuer.toLowerCase().includes(u.toLowerCase());return s&&r});return(0,r.jsxs)("div",{className:"container wide",children:[r.jsx("h2",{children:"Trusted MTL Assets"}),r.jsx("div",{className:"text-right mobile-left",style:{marginTop:"-2.2em"},children:r.jsx("a",{href:"https://github.com/montelibero-org/stellar-multisig/tree/main/src/hook/trusted-mtl-assets.json",target:"_blank",rel:"noopener noreferrer",className:"icon icon-github",title:"View config file on Github",style:{fontSize:"1.4em"}})}),(0,r.jsxs)("div",{className:"segment blank directory",children:[(0,r.jsxs)("div",{className:"text-center double-space",children:[r.jsx("form",{onSubmit:function(e){e.preventDefault()},children:r.jsx("input",{type:"text",className:"primary",placeholder:"Search assets by code, name, domain, or public key",value:u,onKeyDown:e=>{13===e.keyCode&&e.preventDefault()},onChange:e=>{e.preventDefault(),m(e.currentTarget.value)},style:{maxWidth:"36em"}})}),(0,r.jsxs)("div",{children:[r.jsx("div",{className:"dimmed text-small",children:"Filter by tag:"}),r.jsx("div",{className:"row",children:[...new Set(g.map(e=>e.tag||"other"))].map(e=>r.jsx("div",{className:"column column-25",children:(0,r.jsxs)("a",{className:`tag-block ${h.has(e)?"selected":""}`,onClick:()=>j(e),children:["#",e]})},e))})]})]}),r.jsx("ul",{className:"striped space",children:v.map((e,t)=>(0,r.jsxs)("li",{style:{padding:"1em",lineHeight:1.6,overflow:"hidden"},children:[(0,r.jsxs)("div",{children:[r.jsx("b",{children:e.code})," ",r.jsx(i.default,{href:`https://stellar.expert/explorer/public/asset/${e.code}-${e.issuer}`,passHref:!0,legacyBehavior:!0,children:r.jsx("a",{className:"text-small",target:"_blank",rel:"noopener noreferrer",children:e.issuer})})," ",(0,r.jsxs)("span",{className:"inline-tag",children:["#",e.tag||"other"]})]}),r.jsx(i.default,{href:`/${f}/${e.issuer}`,passHref:!0,legacyBehavior:!0,children:r.jsx("a",{title:e.issuer,"aria-label":e.issuer,className:"account-address",style:{marginRight:"1em"},children:r.jsx("span",{className:"account-key",children:e.issuer})})})]},t))})]})]})},u=()=>r.jsx(l.Suspense,{fallback:r.jsx("div",{children:"Loading..."}),children:r.jsx(a.Z,{children:r.jsx(d,{})})})},88618:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});var r=s(10326);s(17577);let a=({children:e,props:t})=>r.jsx("div",{className:"page-container",children:e})},82728:(e,t,s)=>{"use strict";s.d(t,{N:()=>i,Z:()=>n});var r=s(10326),a=s(17577);let l=(0,a.createContext)(),i=()=>{let e=(0,a.useContext)(l);if(!e)throw Error("usePublic must be used within a PublicProvider");return[e.net,e.setNet]},n=({children:e})=>{let[t,s]=(0,a.useState)("public");return(0,a.useEffect)(()=>{let e=localStorage.getItem("net");if(e){let t=window.location.pathname.split("/");t.includes("public")?s("public"):t.includes("testnet")?s("testnet"):s(e)}else{let e=window.location.pathname.split("/");e.includes("public")?(s("public"),localStorage.setItem("net","public")):e.includes("testnet")?(s("testnet"),localStorage.setItem("net","testnet")):(s("public"),localStorage.setItem("net","public"))}},[]),r.jsx(l.Provider,{value:{net:t,setNet:e=>{s(e),localStorage.setItem("net",e)}},children:e})}},68295:(e,t,s)=>{"use strict";s.r(t),s.d(t,{$$typeof:()=>i,__esModule:()=>l,default:()=>n});var r=s(68570);let a=(0,r.createProxy)(String.raw`F:\Working\stellar-multisig\src\app\layout.js`),{__esModule:l,$$typeof:i}=a;a.default;let n=(0,r.createProxy)(String.raw`F:\Working\stellar-multisig\src\app\layout.js#default`)},75262:(e,t,s)=>{"use strict";s.r(t),s.d(t,{$$typeof:()=>i,__esModule:()=>l,default:()=>n});var r=s(68570);let a=(0,r.createProxy)(String.raw`F:\Working\stellar-multisig\src\app\public\assets\page.js`),{__esModule:l,$$typeof:i}=a;a.default;let n=(0,r.createProxy)(String.raw`F:\Working\stellar-multisig\src\app\public\assets\page.js#default`)},73881:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>a});var r=s(66621);let a=e=>[{type:"image/x-icon",sizes:"16x16",url:(0,r.fillMetadataSegment)(".",e.params,"favicon.ico")+""}]},23824:()=>{},28505:()=>{},7846:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[948,512,621],()=>s(66293));module.exports=r})();