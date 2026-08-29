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

BEGIN subprocess(argument)
    process
END subprocess(argument)
`],["Returning",`
BEGIN
    variable = subprocess()
END

BEGIN subprocess
    process
    RETURN expression
END subprocess
`]]};for(const[e,t]of Object.entries(REF))t.forEach(t=>{const n=document.createElement("p");n.innerText=t[0],n.onclick=()=>{rtxt.value=t[1].trim();const e=document.querySelector(".selrefIt");e&&e.classList.remove("selrefIt"),n.classList.add("selrefIt")},n.classList.add("refIt"),n.classList.add(e+"_it"),rconts.appendChild(n)});function setRefFilter(e,t){rconts.classList=e,document.querySelector(".refbtnsel").classList.remove("refbtnsel"),t.classList.add("refbtnsel")}const log=document.getElementById("logs");function rmEval(){log.replaceChildren()}const LEVEL=Object.freeze({INFO:"info",DEBUG:"debug",WARN:"warn",ERROR:"error"});function addMsg(e,t){const n=document.createElement("p");n.innerText=e,n.classList.add("log"),n.classList.add(t),log.appendChild(n)}function runCode(){rmEval();var e={};for(const[t,n]of code.value.split(/\r?\n|;/).entries())e=evalLine(n,e,t+1);(!e?.inside||e.inside.length>0)&&addMsg(`Unclosed statements found: [${e.inside.join(", ")}]!`,LEVEL.ERROR),addMsg("Done evaluating!",LEVEL.INFO)}const STRUCTURE={deindent:new Set(["elseif","else","endif","end","endcase","endwhile","until","next"]),indent:new Set(["begin","if","elseif","else","casewhere","while","repeat","for"])},forRe=/^for\s+(?<var>.+?)(?:\s+=\s+(?<start>.+?))?(?:\s+to\s+(?<to>.+?))?(?:\s+step\s+(?<step>.+?))?$/i;function evalLine(e,t,n){const c=e.search(/\S|$/);e=e.trim();const h=e.endsWith(":");if(h&&(e=e.slice(0,-1)),!e)return t;const o=e.match(/^\S+/)?.[0].toLowerCase(),a=t?.inside??[],r=a[a.length-1],d=t?.indent??0;var s,i,u,l=t?.indentDir??0;if(STRUCTURE.deindent.has(o)&&(l-=1),l>0&&c<=d?addMsg(`Expected indent on line ${n}!`,LEVEL.ERROR):l==0&&c!=d&&r==="case"&&(o=="choice"||o=="otherwise")?addMsg(`Unexpected indent on line ${n}!`,LEVEL.ERROR):l<0&&c>=d&&addMsg(`Expected deindent on line ${n}!`,LEVEL.ERROR),i=!1,r==="if")if(o=="elseif"){const t=e.split(" ");t[t.length-1].toLowerCase()!="then"?(addMsg(`Expected 'THEN' at end of line ${n}!`,LEVEL.ERROR),s=t.slice(1).join(" ")):s=t.slice(1,-1).join(" "),s=s.trim(),s||addMsg(`Missing condition on line ${n}!`,LEVEL.ERROR),addMsg(`elif (${s}):`,LEVEL.DEBUG),i=!0}else o=="else"?(e.split(" ").length>1&&addMsg(`Too much on line ${n}! (Did you mean ELSEIF?)`,LEVEL.ERROR),addMsg(`else:`,LEVEL.DEBUG),i=!0):o=="endif"&&(e.split(" ").length>1&&addMsg(`Too much on line ${n}!`,LEVEL.ERROR),addMsg(`# endif`,LEVEL.DEBUG),a.pop(),i=!0);else r==="while"?o=="endwhile"&&(e.split(" ").length>1&&addMsg(`Too much on line ${n}!`,LEVEL.ERROR),addMsg(`# endwhile`,LEVEL.DEBUG),a.pop(),i=!0):r==="repeat"?o=="until"&&(s=e.split(" ").slice(1).join(" ").trim(),s||addMsg(`Missing condition on line ${n}!`,LEVEL.ERROR),addMsg(`if (${s}): break # until`,LEVEL.DEBUG),a.pop(),i=!0):r==="for"&&o=="next"&&(u=e.split(" ").slice(1).join(" ").trim(),u||addMsg(`Missing variable name on line ${n}!`,LEVEL.ERROR),addMsg(`# next ${u||"???"}`,LEVEL.DEBUG),a.pop(),i=!0);if(!i)if(o=="if"){const t=e.split(" ");t[t.length-1].toLowerCase()!="then"?(addMsg(`Expected 'THEN' at end of line ${n}!`,LEVEL.ERROR),s=t.slice(1).join(" ")):s=t.slice(1,-1).join(" "),s=s.trim(),s||addMsg(`Missing condition on line ${n}!`,LEVEL.ERROR),addMsg(`if (${s}):`,LEVEL.DEBUG),a.push("if"),i=!0}else if(o=="while"){const t=e.split(" ");t[t.length-1].toLowerCase()!="do"?(addMsg(`'DO' not required on line ${n}!`,LEVEL.WARN),s=t.slice(1,-1).join(" ")):s=t.slice(1).join(" "),s=s.trim(),s||addMsg(`Missing condition on line ${n}!`,LEVEL.ERROR),addMsg(`while (${s}):`,LEVEL.DEBUG),a.push("while"),i=!0}else if(o=="repeat")e.split(" ").length>1&&addMsg(`Too much on line ${n}!`,LEVEL.ERROR),addMsg(`while True: # repeat`,LEVEL.DEBUG),a.push("repeat"),i=!0;else if(o=="for"){const t=e.match(forRe);if(t===null)addMsg(`Missing arguments on line ${n}!`,LEVEL.ERROR),addMsg(`for ???:`,LEVEL.DEBUG);else{const e=t.groups;e.start||addMsg(`Missing start value on line ${n}!`,LEVEL.ERROR),e.to||addMsg(`Missing end value on line ${n}!`,LEVEL.ERROR),e.step||addMsg(`No step value on line ${n}, but it may be ok.`,LEVEL.INFO),addMsg(`for ${e.var} in range(${e.start??"??"}, ${e.end??"??"}${e.step?", "+e.step:""}):`,LEVEL.DEBUG)}a.push("for"),i=!0}const m=STRUCTURE.indent.has(o)||h?1:0,f={indent:c,indentDir:m,inside:a};return f}TLN.append_line_numbers("pcode")