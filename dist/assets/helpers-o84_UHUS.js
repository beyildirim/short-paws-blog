import{c as a}from"./index-CKJU1jIA.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],y=a("Calendar",f);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],m=a("ChevronRight",u);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]],g=a("Clock",l);function d(t){return(typeof t=="string"?new Date(t):t).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}function p(t){const o=typeof t=="string"?new Date(t):t,c=new Date().getTime()-o.getTime(),s=Math.floor(c/1e3),n=Math.floor(s/60),r=Math.floor(n/60),i=Math.floor(r/24);return s<60?"just now":n<60?`${n} minute${n>1?"s":""} ago`:r<24?`${r} hour${r>1?"s":""} ago`:i<7?`${i} day${i>1?"s":""} ago`:d(o)}function w(){return window.location.href}async function k(t){try{return await navigator.clipboard.writeText(t),!0}catch(o){return console.error("Failed to copy:",o),!1}}function C(t,o){let e=null;return(...c)=>{e&&clearTimeout(e),e=setTimeout(()=>t(...c),o)}}export{y as C,g as a,m as b,k as c,C as d,p as e,d as f,w as g};
