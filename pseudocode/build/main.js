const INDENT=" ".repeat(4);document.querySelectorAll("textarea").forEach(e=>{e.spellcheck=!1,e.autocomplete="off",e.autocorrect="off",e.autocapitalize="off"});const code=document.getElementById("pcode");code.addEventListener("keydown",e=>{const n=code.value,t=code.selectionStart,s=code.selectionEnd;if(e.key==="Escape"){if(t!==s){e.preventDefault();const s=n.lastIndexOf(`
`,t-1)+1,o=s+n.slice(s).search(/\S|$/);code.setSelectionRange(o,o);return}return}if(e.key==="Tab"){if(e.preventDefault(),t===s){const i=n.lastIndexOf(`
`,t-1)+1,o=n.slice(i,t);if(e.shiftKey){if(/^ +$/.test(o)){const e=Math.min(INDENT.length,o.length);e>0&&code.setRangeText("",t-e,t,"end")}}else code.setRangeText(INDENT,t,s,"end");return}const c=n.slice(t,s);if(!c.includes(`
`)&&e.shiftKey)return;const i=n.lastIndexOf(`
`,t-1)+1,a=s>t&&n[s-1]===`
`?s-1:s,r=n.slice(i,a);let o;e.shiftKey?o=r.replace(/^ {1,4}/gm,""):o=r.replace(/^/gm,INDENT),code.setRangeText(o,i,a,"select");return}if(e.key==="Backspace"&&t===s){const o=n.lastIndexOf(`
`,t-1)+1,s=n.slice(o,t);if(/^ +$/.test(s)){const n=Math.min(INDENT.length,s.length);n>0&&(e.preventDefault(),code.setRangeText("",t-n,t,"end"));return}}if(e.key==="Enter"){e.preventDefault();const o=n.lastIndexOf(`
`,t-1)+1,i=n.slice(o,t),a=i.match(/^[ \t]*/)[0];code.setRangeText(`
`+a,t,s,"end");return}});const rconts=document.getElementById("refconts"),rtxt=document.getElementById("reftxt"),REF={basic:[["NOTE",`
Pseudocode is largely up to interpretation.
How you decide to implement processes and expressions is mostly up to you.
`],["Inputs/Outputs",`
This doesn't have one explicit form it needs to be in, but this is a good idea;
INPUT variable
DISPLAY expression

As an example of how variable it is, you could probably get away with the following instead, depending on how you use it.
variable = INPUT "Input a number:"
RETURN expression
`]],sel:[["If/else",`
IF condition THEN
    process
ENDIF

IF condition THEN
    process1
ELSE
    process2
ENDIF
`],["If/elseif/else",`
IF condition THEN
    process1
ELSEIF condition2 THEN
    process2
ELSE
    process3
ENDIF
`],["Cases",`
CASEWHERE expression evaluates to
    choice a: process a
    choice b: process b
    ...
    OTHERWISE: default process
END CASE
`]],rep:[["Pre-test loop (while)",`
WHILE condition is true
    process
ENDWHILE
`],["Post-test loop (repeat-until)",`
REPEAT
    process
UNTIL condition is true
`],["For loop",`
FOR variable = start TO finish STEP increment
    process
NEXT variable
`]],subr:[["Main process",`
BEGIN
    process
END
`],["Subprocess",`
BEGIN
    subprocess()
END

BEGIN subprocess
    process
END subprocess
`],["Subprocess with arguments",`
BEGIN
    subprocess(argument)
END

BEGIN subprocess(arguments)
    process
END subprocess(arguments)
`],["Returning",`
BEGIN
    variable = subprocess()
END

BEGIN subprocess
    process
    RETURN expression
END subprocess
`]]};for(const[e,t]of Object.entries(REF))t.forEach(t=>{const n=document.createElement("p");n.innerText=t[0],n.onclick=()=>{rtxt.value=t[1];const e=document.querySelector(".selrefIt");e&&e.classList.remove("selrefIt"),n.classList.add("selrefIt")},n.classList.add("refIt"),n.classList.add(e+"_it"),rconts.appendChild(n)});function setRefFilter(e,t){rconts.classList=e,document.querySelector(".refbtnsel").classList.remove("refbtnsel"),t.classList.add("refbtnsel")}