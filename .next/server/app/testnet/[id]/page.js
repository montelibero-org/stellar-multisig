(()=>{var e={};e.id=410,e.ids=[410],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},39491:e=>{"use strict";e.exports=require("assert")},14300:e=>{"use strict";e.exports=require("buffer")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},57147:e=>{"use strict";e.exports=require("fs")},13685:e=>{"use strict";e.exports=require("http")},95687:e=>{"use strict";e.exports=require("https")},22037:e=>{"use strict";e.exports=require("os")},71017:e=>{"use strict";e.exports=require("path")},12781:e=>{"use strict";e.exports=require("stream")},76224:e=>{"use strict";e.exports=require("tty")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},31533:(e,s,t)=>{"use strict";t.r(s),t.d(s,{GlobalError:()=>i.a,__next_app__:()=>m,originalPathname:()=>h,pages:()=>d,routeModule:()=>p,tree:()=>c}),t(95060),t(68295),t(35866);var a=t(23191),r=t(88716),l=t(37922),i=t.n(l),n=t(95231),o={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>n[e]);t.d(s,o);let c=["",{children:["testnet",{children:["[id]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,95060)),"F:\\Working\\stellar-multisig\\src\\app\\testnet\\[id]\\page.js"]}]},{}]},{metadata:{icon:[async e=>(await Promise.resolve().then(t.bind(t,73881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(t.bind(t,68295)),"F:\\Working\\stellar-multisig\\src\\app\\layout.js"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,35866,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(t.bind(t,73881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],d=["F:\\Working\\stellar-multisig\\src\\app\\testnet\\[id]\\page.js"],h="/testnet/[id]/page",m={require:t,loadChunk:()=>Promise.resolve()},p=new a.AppPageRouteModule({definition:{kind:r.x.APP_PAGE,page:"/testnet/[id]/page",pathname:"/testnet/[id]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},47803:(e,s,t)=>{Promise.resolve().then(t.bind(t,50306))},50306:(e,s,t)=>{"use strict";t.d(s,{default:()=>x});var a=t(10326),r=t(88618),l=t(46226),i=t(91027);t(82228);var n=t(40498),o=t.n(n),c=t(17577),d=t.n(c),h=t(90434),m=t(82728),p=t(33995);let x=({params:e})=>{let{id:s}=e,[t,n]=(0,c.useState)(s||""),[x,u]=(0,m.N)(),[j,g]=(0,c.useState)({}),[f,_]=(0,c.useState)(!0),[v,b]=(0,c.useState)(1),[N,y]=(0,c.useState)(""),[k,w]=(0,c.useState)(!1),[A,O]=(0,c.useState)(!1);(0,c.useEffect)(()=>{let e=async()=>{let e="testnet"===x?"https://horizon-testnet.stellar.org":"https://horizon.stellar.org",s=new(o()).Server(e);try{await s.loadAccount(t),_(!0),console.log("valid")}catch(e){e instanceof o().NotFoundError?(_(!1),y("Error: Account does not exist on the network. Make sure that you copied account address correctly and there was at least one payment to this address.")):console.error(e)}};o().StrKey.isValidEd25519PublicKey(t)?(console.log("true"),e()):(setTimeout(()=>{_(!1)},2e3),y(`"Cannot read properties of null (reading 'invalidAsset')" at ${t}`))},[x,t]),(0,c.useEffect)(()=>{(async()=>{if(O(!0),""!=t){let e=await (0,i.H4)(t),s=await (0,i.bM)(t),a="";void 0!=e.home_domain&&(a=await (0,i.TJ)(e.home_domain));let r=a.split("\n"),l=!1,n={};for(let e in r){if("[DOCUMENTATION]"==r[e]){l=!0;continue}if(!l)continue;if(""==r[e]&&l){l=!1;continue}let s=r[e].split("=");n[s[0].trim()]=s[1].replace(/"/g,"").trim()}g({home_domain:e.home_domain,created_at:e.last_modified_time,thresholds:e.thresholds,flags:e.flags,signers:e.signers,entries:e.data_attr,balances:e.balances,meta_data:n,issuers:s.records,tomlInfo:a})}O(!1)})()},[t]);let E=e=>""==e||null==e||void 0==e?a.jsx("br",{}):e.substring(0,4)+"..."+e.substr(-4);return a.jsx(r.Z,{children:a.jsx("div",{className:"container",children:a.jsx("div",{className:"account-view",children:A?"Loading...":f?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("h2",{className:"word-break relative condensed",children:[a.jsx("span",{className:"dimmed",children:"Account\xa0\xa0\xa0"}),(0,a.jsxs)("span",{className:"account-address plain",children:[a.jsx("span",{className:"account-key",children:t}),"\xa0\xa0\xa0",a.jsx("span",{className:"account-key",style:{width:"30px",height:"30px"},children:a.jsx("a",{href:`https://stellar.expert/explorer/${x}/account/${t}`,target:"_blank",rel:"noopener noreferrer",title:"View on Stellar.Expert",children:a.jsx(l.default,{src:"/stellar-expert-logo.png",alt:"Stellar Expert Logo",className:"dark:invert",width:30,style:{display:"inline-block"},height:30,priority:!0})})})]})]}),(0,a.jsxs)("div",{className:"row space",children:[a.jsx("div",{className:"column column-50",children:(0,a.jsxs)("div",{className:"segment blank",children:[a.jsx("h3",{children:"Summary"}),a.jsx("hr",{className:"flare"}),(0,a.jsxs)("dl",{children:[j?.home_domain==void 0?"":(0,a.jsxs)(a.Fragment,{children:[a.jsx("dt",{children:"Home domain:"}),(0,a.jsxs)("dd",{children:[a.jsx("a",{href:`${j?.home_domain==void 0?"#":j?.home_domain}`,rel:"noreferrer noopener",target:"_blank",children:j?.home_domain==void 0?"none":j?.home_domain}),a.jsx("i",{className:"trigger icon info-tooltip small icon-help",children:a.jsx("div",{className:"tooltip-wrapper",style:{maxWidth:"20em",left:"-193px",top:"-142px"},children:a.jsx("div",{className:"tooltip top",children:(0,a.jsxs)("div",{className:"tooltip-content",children:["A domain name that can optionally be added to the account. Clients can look up a stellar.toml from this domain. The federation procol can use the home domain to look up more details about a transaction’s memo or address details about an account.",a.jsx("a",{href:"https://developers.stellar.org/docs/learn/glossary#home-domain",className:"info-tooltip-link",target:"_blank",children:"Read more…"})]})})})})]})]}),a.jsx("dt",{children:"Account lock status:"}),(0,a.jsxs)("dd",{children:["unlocked",a.jsx("i",{className:"trigger icon info-tooltip small icon-help",children:a.jsx("div",{className:"tooltip-wrapper",style:{maxWidth:"20em",left:"-193px",top:"-105px"},children:a.jsx("div",{className:"tooltip top",children:(0,a.jsxs)("div",{className:"tooltip-content",children:["The account is unlocked, all operations are permitted, including payments, trades, settings changes, and assets issuing.",a.jsx("a",{href:"https://developers.stellar.org/docs/learn/encyclopedia/security/signatures-multisig#thresholds",className:"info-tooltip-link",target:"_blank",children:"Read more…"})]})})})})]}),a.jsx("dt",{children:"Operation thresholds:"}),(0,a.jsxs)("dd",{children:[a.jsx("span",{title:"Low threshold",children:j?.thresholds?.low_threshold})," ","/",(0,a.jsxs)("span",{title:"Medium threshold",children:[" ",j?.thresholds?.med_threshold]})," ","/",(0,a.jsxs)("span",{title:"High threshold",children:[" ",j?.thresholds?.high_threshold]}),a.jsx("i",{className:"trigger icon info-tooltip small icon-help",children:a.jsx("div",{className:"tooltip-wrapper",style:{maxWidth:"20em",left:"-193px",top:"-86px"},children:a.jsx("div",{className:"tooltip top",children:(0,a.jsxs)("div",{className:"tooltip-content",children:["This field specifies thresholds for low-, medium-, and high-access level operations.",a.jsx("a",{href:"https://developers.stellar.org/docs/learn/encyclopedia/security/signatures-multisig#thresholds",className:"info-tooltip-link",target:"_blank",children:"Read more…"})]})})})})]}),a.jsx("dt",{children:"Asset authorization flags:"}),(0,a.jsxs)("dd",{children:[j?.flags?.auth_required==!0?"required, ":"",j?.flags?.auth_revocable==!0?"revocable, ":"",j?.flags?.auth_clawback_enabled==!0?"clawback_enabled, ":"",j?.flags?.auth_immutable==!0?"immutable, ":"",j?.flags?.auth_required==!1&&j?.flags?.auth_revocable==!1&&j?.flags?.auth_clawback_enabled==!1&&j?.flags?.auth_immutable==!1?"none":"",a.jsx("i",{className:"trigger icon info-tooltip small icon-help",children:a.jsx("div",{className:"tooltip-wrapper",style:{maxWidth:"20em",left:"-193px",top:"-256px"},children:a.jsx("div",{className:"tooltip top",children:(0,a.jsxs)("div",{className:"tooltip-content",children:[(0,a.jsxs)("ul",{children:[(0,a.jsxs)("li",{children:[a.jsx("code",{children:"AUTH_REQUIRED"})," ","Requires the issuing account to give other accounts permission before they can hold the issuing account’s credit."]}),(0,a.jsxs)("li",{children:[a.jsx("code",{children:"AUTH_REVOCABLE"})," ","Allows the issuing account to revoke its credit held by other accounts."]}),(0,a.jsxs)("li",{children:[a.jsx("code",{children:"AUTH_CLAWBACK_ENABLED"})," ","Allows the issuing account to clawback tokens without the account consent in case of service terms violation."]}),(0,a.jsxs)("li",{children:[a.jsx("code",{children:"AUTH_IMMUTABLE"})," ","If set then none of the authorization flags can be set and the account can never be deleted."]})]}),a.jsx("a",{href:"https://developers.stellar.org/docs/learn/glossary#flags",className:"info-tooltip-link",target:"_blank",children:"Read more…"})]})})})})]})]}),j?.issuers?.length>0?(0,a.jsxs)("div",{className:"account-issued-assets",children:[(0,a.jsxs)("h4",{style:{marginBottom:"0px"},children:["Assets Issued by this Account",a.jsx("i",{className:"trigger icon info-tooltip small icon-help",children:a.jsx("div",{className:"tooltip-wrapper",style:{maxWidth:"20em",left:"-193px",top:"-86px"},children:a.jsx("div",{className:"tooltip top",children:(0,a.jsxs)("div",{className:"tooltip-content",children:["An account can issue custom Stellar assets. Any asset on the network can be traded and exchanged with any other.",a.jsx("a",{href:"https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/assets",className:"info-tooltip-link",target:"_blank",children:"Read more…"})]})})})})]}),a.jsx("div",{className:"text-small",children:a.jsx("ul",{children:j?.issuers?.map((e,s)=>a.jsxs("li",{children:[a.jsx(h.default,{href:"#",legacyBehavior:!0,children:a.jsx("a",{"aria-label":e.paging_token,className:"asset-link",children:e.asset_code})}),"\xa0",a.jsxs("span",{className:"",children:["(",e.accounts.authorized," ","trustlines)"]})]},s))})})]}):a.jsx(a.Fragment,{}),(0,a.jsxs)("h4",{style:{marginBottom:"0px"},children:["Account Signers",a.jsx("i",{className:"trigger icon info-tooltip small icon-help",children:a.jsx("div",{className:"tooltip-wrapper",style:{maxWidth:"20em",left:"0px",top:"0px"},children:a.jsx("div",{className:"tooltip top",children:(0,a.jsxs)("div",{className:"tooltip-content",children:["Used for multi-sig. This field lists other public keys and their weights, which can be used to authorize transactions for this account.",a.jsx("a",{href:"https://developers.stellar.org/docs/learn/encyclopedia/security/signatures-multisig",className:"info-tooltip-link",target:"_blank",children:"Read more…"})]})})})})]}),a.jsx("ul",{className:"text-small condensed",children:j?.signers?.map((e,s)=>a.jsxs("li",{children:[a.jsx(h.default,{href:`/${x}/${e.key}`,legacyBehavior:!0,children:a.jsx("a",{title:e.key,"aria-label":e.key,className:"account-address word-break",children:a.jsx("span",{className:"",children:E(e.key)})})}),"(w:",a.jsx("b",{children:e.weight}),")"]},s))}),j?.entries&&Object.keys(j?.entries).length?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("h4",{style:{marginBottom:"0px"},children:["Data Entries",a.jsx("i",{className:"trigger icon info-tooltip small icon-help",children:a.jsx("div",{className:"tooltip-wrapper",style:{maxWidth:"20em",left:"0px",top:"0px"},children:a.jsx("div",{className:"tooltip top",children:(0,a.jsxs)("div",{className:"tooltip-content",children:["Data entries are key value pairs attached to an account. They allow account controllers to attach arbitrary data to their account.",a.jsx("a",{href:"https://www.stellar.org/developers/guides/concepts/ledger.html#data-entry",className:"info-tooltip-link",target:"_blank",children:"Read more…"})]})})})})]}),a.jsx("ul",{className:"text-small condensed",children:j?.entries&&Object.keys(j?.entries).map((e,s)=>{let{processedKey:t,processedValue:r}=(0,p.Z)(e,j?.entries[e]);return(0,a.jsxs)("li",{className:"word-break",children:[t,": ",a.jsx("span",{dangerouslySetInnerHTML:{__html:r}})]},s)})})]}):a.jsx(a.Fragment,{})]})}),a.jsx("div",{className:"column column-50",children:(0,a.jsxs)("div",{className:"segment blank",children:[(0,a.jsxs)("h3",{children:["Account Balances",a.jsx("i",{className:"trigger icon info-tooltip small icon-help",children:a.jsx("div",{className:"tooltip-wrapper",style:{maxWidth:"20em",left:"0px",top:"0px"},children:a.jsx("div",{className:"tooltip top",children:(0,a.jsxs)("div",{className:"tooltip-content",children:["The number of lumens and other assets held by the account.",a.jsx("a",{href:"https://developers.stellar.org/docs/learn/glossary#balance",className:"info-tooltip-link",target:"_blank",children:"Read more…"})]})})})})]}),a.jsx("hr",{className:"flare"}),a.jsx("div",{className:"all-account-balances micro-space text-header",children:j?.balances?.map((e,s)=>{let t=e.balance.split("."),r=t[0],l=0==Number(t[1])?"":"."+t[1];return a.jsxs("a",{href:"#",className:"account-balance",children:[a.jsxs("div",{className:"condensed",children:[r,a.jsx("span",{className:"text-small",children:l})]}),a.jsx("div",{className:"text-tiny condensed",children:a.jsx("div",{children:E(e.asset_issuer)})}),a.jsx("span",{className:"text-small",children:a.jsx("span",{"aria-label":e.asset_issuer,className:"asset-link",children:void 0==e.asset_code?"XLM":e.asset_code})})]},s)})})]})})]}),j?.meta_data&&j?.meta_data.ORG_NAME==void 0?"":a.jsx("div",{className:"toml-props",children:(0,a.jsxs)("div",{className:"tabs space inline-right",children:[a.jsx("div",{className:"tabs-header",children:(0,a.jsxs)("div",{children:[a.jsx("a",{href:"#",className:`tabs-item condensed ${1===v?"selected":""}`,onClick:e=>{e.preventDefault(),b(1)},children:a.jsx("span",{className:"tabs-item-text",children:"Organization"})}),a.jsx("a",{href:"#",className:`tabs-item condensed ${2===v?"selected":""}`,onClick:e=>{e.preventDefault(),b(2)},children:a.jsx("span",{className:"tabs-item-text",children:"TOML code"})})]})}),a.jsx("hr",{className:"flare"}),a.jsx("div",{className:"tabs-body",children:1==v?a.jsx("div",{className:"segment blank",children:j?.meta_data&&j?.meta_data.ORG_NAME==void 0?a.jsx("div",{style:{fontSize:"13px",textAlign:"center"},children:"Empty Data"}):(0,a.jsxs)("dl",{className:"micro-space",children:[a.jsx("dt",{children:"Org name:"}),a.jsx("dd",{children:a.jsx("span",{className:"block-select",tabIndex:"-1",style:{whiteSpace:"normal",overflow:"visible",display:"inline"},children:j?.meta_data&&j?.meta_data.ORG_NAME})}),a.jsx("dt",{children:"Org url:"}),a.jsx("dd",{children:a.jsx("a",{href:j?.meta_data&&j?.meta_data.ORG_URL,target:"_blank",rel:"noreferrer noopener",children:j?.meta_data&&j?.meta_data.ORG_URL})}),a.jsx("dt",{children:"Org logo:"}),a.jsx("dd",{children:a.jsx("a",{href:j?.meta_data&&j?.meta_data.ORG_LOGO,target:"_blank",rel:"noreferrer noopener",children:j?.meta_data&&j?.meta_data.ORG_LOGO})}),a.jsx("dt",{children:"Org description:"}),a.jsx("dd",{children:a.jsx("span",{className:"block-select",tabIndex:"-1",style:{whiteSpace:"normal",overflow:"visible",display:"inline"},children:j?.meta_data&&j?.meta_data.ORG_DESCRIPTION})}),a.jsx("dt",{children:"Org physical address:"}),a.jsx("dd",{children:a.jsx("span",{className:"block-select",tabIndex:"-1",style:{whiteSpace:"normal",overflow:"visible",display:"inline"},children:j?.meta_data&&j?.meta_data.ORG_PHYSICAL_ADDRESS})}),a.jsx("dt",{children:"Org official email:"}),a.jsx("dd",{children:a.jsx("a",{href:`mailto:${j?.meta_data&&j?.meta_data.ORG_OFFICIAL_EMAIL}`,target:"_blank",rel:"noreferrer noopener",children:j?.meta_data&&j?.meta_data.ORG_OFFICIAL_EMAIL})})]})}):a.jsx("div",{children:a.jsx("pre",{className:"hljs",style:{maxHeight:"80vh"},children:j?.tomlInfo==""?a.jsx("div",{style:{width:"100%",textAlign:"center"},children:"Empty Data"}):j?.tomlInfo?.split("\n")?.map((e,s)=>{if(!(null==e||e.startsWith("#"))){if(e.indexOf("=")>0){let t=e.split("="),r=t[0],l=t[1];return a.jsxs(d().Fragment,{children:[a.jsx("span",{className:"hljs-attr",children:r})," ","="," ",a.jsx("span",{className:"hljs-string",children:l}),a.jsx("br",{})]},s)}return e.startsWith("[")?a.jsxs(d().Fragment,{children:[a.jsx("span",{className:"hljs-section",children:e}),a.jsx("br",{})]},s):a.jsxs(d().Fragment,{children:[a.jsx("span",{className:"hljs-string",children:e}),a.jsx("br",{})]},s)}})})})})]})})]}):a.jsx("div",{className:"cotainer",children:(0,a.jsxs)("div",{className:`search ${!1===f?"error":""} container narrow`,style:{padding:"20px"},children:[(0,a.jsxs)("h2",{className:"text-overflow",children:["Search results for ",t]}),!0===f&&(0,a.jsxs)("p",{children:["Account ",t," exists on ",x,"!"]}),!1===f&&a.jsx("span",{children:N})]})})})})})}},33995:(e,s,t)=>{"use strict";t.d(s,{Z:()=>l});let a=JSON.parse('{"accounts":["mtla_delegate","mtla_a_delegate","mtla_c_delegate","mtl_delegate","delegate","owner"],"links":["link","link \\\\d+","link_\\\\d+","website"],"names":["name","about","MTLA:PIIStandard"]}'),r=e=>{try{return atob(e)}catch(s){return console.error("Invalid base64 string:",e),e}},l=(e,s)=>{let t=s,l=Object.entries(a).reduce((e,[s,t])=>(e[s]=t.map(e=>RegExp(`^${e}$`,"i")),e),{}),i=r(s);for(let[s,a]of Object.entries(l))if(a.some(s=>s.test(e))){switch(s){case"accounts":t=`<a href="/public/${i}">${i}</a>`;break;case"links":t=`<a href="${i}">${i}</a>`;break;case"names":t=i}break}return{processedKey:e,processedValue:t}}},95060:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>p,generateStaticParams:()=>m});var a=t(19510),r=t(68570);let l=(0,r.createProxy)(String.raw`F:\Working\stellar-multisig\src\app\testnet\[id]\testnet.js`),{__esModule:i,$$typeof:n}=l;l.default;let o=(0,r.createProxy)(String.raw`F:\Working\stellar-multisig\src\app\testnet\[id]\testnet.js#default`);var c=t(32294),d=t.n(c);let h=async()=>{try{return(await d().get("https://api.stellar.expert/explorer/directory?limit=20")).data._embedded.records.map(e=>({id:e.address}))}catch(e){return console.error("Error fetching accounts from Stellar Expert:",e),[]}};async function m(){return(await h()).map(e=>({params:{id:e.id}}))}function p({params:e}){return a.jsx(o,{params:e})}}};var s=require("../../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),a=s.X(0,[948,512,621,498,294,275],()=>t(31533));module.exports=a})();