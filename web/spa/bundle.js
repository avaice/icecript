(()=>{"use strict";var e={168:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.functions=void 0;const i=t(253),n=t(397);r.functions={print:i.print,random:n.random}},571:(e,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.inputForBrowser=void 0,r.inputForBrowser=e=>{var r;return null!==(r=window.prompt(e))&&void 0!==r?r:""}},50:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.listenWebEvent=void 0;const i=t(594);r.listenWebEvent=(e,r,t)=>{const n=document.querySelector(e);return!!n&&n.addEventListener(r,(()=>{(0,i.exec)(void 0,t)}))}},253:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.print=void 0;const i=t(594);r.print=(e,...r)=>{(0,i.getInterceptForTest)()?(0,i.printInterceptor)(e,...r):console.log(e,...r)}},397:(e,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.random=void 0,r.random=e=>Math.floor(Math.random()*e)},952:(e,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.writeHtml=void 0,r.writeHtml=(e,r)=>{const t=document.querySelector(e);t&&(t.innerHTML=r)}},565:function(e,r,t){var i=this&&this.__awaiter||function(e,r,t,i){return new(t||(t=Promise))((function(n,o){function s(e){try{l(i.next(e))}catch(e){o(e)}}function c(e){try{l(i.throw(e))}catch(e){o(e)}}function l(e){var r;e.done?n(e.value):(r=e.value,r instanceof t?r:new t((function(e){e(r)}))).then(s,c)}l((i=i.apply(e,r||[])).next())}))};Object.defineProperty(r,"__esModule",{value:!0}),r.interpriter=r.getPointer=void 0;const n=t(168),o=t(594);let s={},c={},l=0;r.getPointer=()=>l;const d=["==","&&",">","<","!=","||"],a=["true","false","monkey","void","flag"],u=Symbol("break");r.interpriter=(e,r="initial")=>i(void 0,void 0,void 0,(function*(){s={},c={},l=0;const t=c=>i(void 0,void 0,void 0,(function*(){for(var i;l<e.length;){const _=e[l];if(n.functions.hasOwnProperty(_))return yield f(_,c.scopedVariables);if("function"===(null===(i=s[_])||void 0===i?void 0:i.type))return yield y();if("var"===_)return yield p(c.scopedVariables);if("("===_)return yield V(c.scopedVariables);if("if"===_)return yield m({scopedVariables:c.scopedVariables});if("fn"===_)return c.scopedVariables&&(0,o.err)("関数内で関数を宣言することはできません！"),yield v();if("while"===_)return yield w({scopedVariables:c.scopedVariables});if(a.includes(_))switch(_){case"true":return!0;case"false":return!1;case"monkey":return Math.random()>.5;case"flag":return r;default:return(0,o.err)("System Error! 存在しない予約語")}if(!(null==c?void 0:c.exprFlag)&&d.includes(e[l+1]))return yield g({scopedVariables:c.scopedVariables});if(!(null==c?void 0:c.exprFlag)&&["+","*","/"].includes(e[l+1]))return yield h({scopedVariables:c.scopedVariables});if("="===e[l+1])return yield b(c.scopedVariables);if(c.scopedVariables&&Object.keys(c.scopedVariables).includes(e[l]))return c.scopedVariables[e[l]];if(Object.keys(s).includes(e[l]))return s[e[l]];if(_.match(/".*"/)||_.match(/`([^`]+)`/))return _.slice(1,_.length-1);if(_.match(/^[0-9]?.?[0-9]/))return Number(_);if("}"===_)return;if("return"===_)return"void"===e[l+1]?{sym:u,value:void 0}:(l++,{sym:u,value:yield t({scopedVariables:c.scopedVariables})});if(![",","(",")",";","void"].includes(_)&&!_.startsWith("//"))return(0,o.err)(`${_}は定義されていない命令です！`);l++}})),f=(r,s)=>i(void 0,void 0,void 0,(function*(){l++,"("!==e[l]&&(0,o.err)('関数の始めに "(" がありません'),l++;const i=[];for(;l<e.length&&")"!==e[l];){const e=yield t({scopedVariables:s});void 0!==e&&i.push(e),l++}")"!==e[l]&&(0,o.err)('関数の終わりに ")" がありません');const c=yield n.functions[r](...i);return["+","*","/"].includes(e[l+1])?yield h({leftArg:c,scopedVariables:s}):d.includes(e[l+1])?yield g({leftArg:c,scopedVariables:s}):c})),p=r=>i(void 0,void 0,void 0,(function*(){l++,a.includes(e[l])&&(0,o.err)(`"${e[l]}" はシステムの予約語なので、変数には使えません`),r?(Object.keys(r).includes(e[l])&&(0,o.err)(`宣言済みの変数 "${e[l]}" を再宣言することはできません`),r[e[l]]=void 0):(Object.keys(s).includes(e[l])&&(0,o.err)(`宣言済みの変数 "${e[l]}" を再宣言することはできません`),s[e[l]]=void 0),"="!==e[l+1]&&l++})),v=()=>i(void 0,void 0,void 0,(function*(){l++,(Object.keys(s).includes(e[l])||n.functions.hasOwnProperty(e[l]))&&(0,o.err)(`宣言済みの変数 "${e[l]}" を再宣言することはできません`),a.includes(e[l])&&(0,o.err)(`"${e[l]}" はシステムの予約語なので、変数には使えません`);const r=e[l];for(s[r]={type:"function",args:[],pointer:null},l++,"("!==e[l]&&(0,o.err)("関数の引数宣言がありません"),l++;")"!==e[l];)","!==e[l]&&s[r].args.push(e[l]),l++;l++,s[r].pointer=l,_(!1,void 0)})),y=()=>i(void 0,void 0,void 0,(function*(){const r=e[l],i=Symbol(r);c[i]={};const n=c[i];l++,"("!==e[l]&&(0,o.err)("関数の引数宣言がありません");let d=0;for(l++;")"!==e[l];)","!==e[l]&&(n[s[r].args[d]]=yield t({scopedVariables:void 0}),d++),l++;const a=l;l=s[r].pointer;const u=yield _(!0,n);return l=a,delete c[i],null==u?void 0:u.value})),b=r=>i(void 0,void 0,void 0,(function*(){const i=l;l+=2;const n=yield t({scopedVariables:r});r&&Object.keys(r).includes(e[i])?r[e[i]]=n:s[e[i]]=n,l++})),h=({leftArg:r,scopedVariables:n})=>i(void 0,void 0,void 0,(function*(){const i=e[l+1],o=null!=r?r:yield t({exprFlag:!0,scopedVariables:n});l+=2;const s=yield t({scopedVariables:n});switch(i){case"+":return o+s;case"*":return o*s;case"/":return o/s}})),V=r=>i(void 0,void 0,void 0,(function*(){l++;const i=yield t({scopedVariables:r});return l++,["+","*","/"].includes(e[l+1])?yield h({leftArg:i,scopedVariables:r}):d.includes(e[l+1])?yield g({leftArg:i,scopedVariables:r}):i})),m=({current:r,scopedVariables:n})=>i(void 0,void 0,void 0,(function*(){l++;const i=yield t({scopedVariables:n}),o=!r&&i;l++;const s=yield _(o,n);return"else"===e[l]?(l++,yield _(!r&&!o,n)):"elif"===e[l]?yield m({current:!!r||o,scopedVariables:n}):s})),w=e=>i(void 0,void 0,void 0,(function*(){const r=l;l++;const i=!!(yield t({scopedVariables:e}));l++;const n=yield _(i,e);return i&&!n?(l=r,yield w({scopedVariables:e})):n})),g=({leftArg:r,scopedVariables:n})=>i(void 0,void 0,void 0,(function*(){const i=e[l+1],o=null!=r?r:yield t({exprFlag:!0,scopedVariables:n});l+=2;const s=yield t({scopedVariables:n});switch(i){case"==":return o==s;case"&&":return o&&s;case"||":return!(!o&&!s);case"<":return o<s;case">":return o>s;case"!=":return o!=s}})),_=(r,n)=>i(void 0,void 0,void 0,(function*(){let i,o=0;for(;l<e.length;){if("{"===e[l])o++;else if("}"===e[l]){if(o--,0===o)break}else if(r&&!i){const e=yield t({scopedVariables:n});(null==e?void 0:e.sym)===u&&(i=e),l--}l++}return l++,i}));for(;l<e.length;)yield t({scopedVariables:void 0})}))},291:(e,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.tokenize=void 0,r.tokenize=e=>{const r=e.split(new RegExp(`(${/`[^`]+`|""|".[^"]*"| |\n|;|\/\/.*|{|}/.source}|${/==|&&|\|\||!=|[<>+*/=()]/.source})`)).map((e=>null==e?void 0:e.trim())).filter((e=>e&&!e.startsWith("//")));for(let e=0;e<r.length;e++)if(["*","/","==","!=","<",">"].includes(r[e])){if(")"!==r[e-1])r.splice(e-1,0,"(");else{let t=e-2,i=0;for(;t>=-1;t--)if(")"===r[t]&&i++,"("===r[t]&&(i--,-1===i)){r[t-1].match(/^[a-zA-Z0-9]+$/)?["if","elif","for","while"].includes(r[t-1])||r.splice(t-1,0,"("):r.splice(t,0,"(");break}}if(e+=1,"("!==r[e+1])r.splice(e+2,0,")");else{let t=e+2,i=0;for(;t<r.length;t++)if("("===r[t]&&i++,")"===r[t]&&(i--,-1===i)){r.splice(t,0,")");break}}e+=1}return r}},594:function(e,r,t){var i=this&&this.__awaiter||function(e,r,t,i){return new(t||(t=Promise))((function(n,o){function s(e){try{l(i.next(e))}catch(e){o(e)}}function c(e){try{l(i.throw(e))}catch(e){o(e)}}function l(e){var r;e.done?n(e.value):(r=e.value,r instanceof t?r:new t((function(e){e(r)}))).then(s,c)}l((i=i.apply(e,r||[])).next())}))};Object.defineProperty(r,"__esModule",{value:!0}),r.exec=r.err=r.enviroment=r.printInterceptor=r.setInterceptForTest=r.getInterceptForTest=r.clearInterceptResult=r.getInterceptResult=void 0;const n=t(565),o=t(291);let s,c="",l=!1,d="";r.getInterceptResult=()=>d,r.clearInterceptResult=()=>d="",r.getInterceptForTest=()=>l,r.setInterceptForTest=e=>l=e,r.printInterceptor=(e,...r)=>{d=d+[e,...r].join(" ")+"\n"},r.enviroment="undefined"==typeof window?"node":"browser",r.err=e=>{const t=(0,n.getPointer)(),i=s.slice(Math.max(0,t-5),t+5).join(" ");throw"browser"===r.enviroment?(alert(`Error: ${t}\n      該当コード近辺: ${i}\n      ${e}`),new Error(e)):new Error(`[31m${e}\n${t}: ${i}[0m`)},r.exec=(e,r)=>i(void 0,void 0,void 0,(function*(){e?c=e:e=c,s=(0,o.tokenize)(e),yield(0,n.interpriter)(s,r)}))}},r={};function t(i){var n=r[i];if(void 0!==n)return n.exports;var o=r[i]={exports:{}};return e[i].call(o.exports,o,o.exports,t),o.exports}(()=>{const e=t(168),r=t(571),i=t(50),n=t(952),o=t(594);e.functions.input=r.inputForBrowser,e.functions.writeHtml=n.writeHtml,e.functions.listenWebEvent=i.listenWebEvent,window.icecript=o.exec})()})();