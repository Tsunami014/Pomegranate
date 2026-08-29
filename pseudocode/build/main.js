const INDENT=" ".repeat(4);document.querySelectorAll("textarea").forEach(e=>{e.spellcheck=!1,e.autocomplete="off",e.autocorrect="off",e.autocapitalize="off"});const code=document.getElementById("pcode");code.addEventListener("keydown",e=>{const n=code.value,t=code.selectionStart,s=code.selectionEnd;if(e.key==="Escape"){if(t!==s){e.preventDefault();const s=n.lastIndexOf(`
`,t-1)+1,o=s+n.slice(s).search(/\S|$/);code.setSelectionRange(o,o);return}return}if(e.key==="Tab"){if(e.preventDefault(),t===s){const i=n.lastIndexOf(`
`,t-1)+1,o=n.slice(i,t);if(e.shiftKey){if(/^ +$/.test(o)){const e=Math.min(INDENT.length,o.length);e>0&&code.setRangeText("",t-e,t,"end")}}else code.setRangeText(INDENT,t,s,"end");return}const c=n.slice(t,s);if(!c.includes(`
`)&&e.shiftKey)return;const i=n.lastIndexOf(`
`,t-1)+1,a=s>t&&n[s-1]===`
`?s-1:s,r=n.slice(i,a);let o;e.shiftKey?o=r.replace(/^ {1,4}/gm,""):o=r.replace(/^/gm,INDENT),code.setRangeText(o,i,a,"select");return}if(e.key==="Backspace"&&t===s){const o=n.lastIndexOf(`
`,t-1)+1,s=n.slice(o,t);if(/^ +$/.test(s)){const n=Math.min(INDENT.length,s.length);n>0&&(e.preventDefault(),code.setRangeText("",t-n,t,"end"));return}}if(e.key==="Enter"){e.preventDefault();const o=n.lastIndexOf(`
`,t-1)+1,i=n.slice(o,t),a=i.match(/^[ \t]*/)[0];code.setRangeText(`
`+a,t,s,"end");return}})