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
`]]};for(const[e,t]of Object.entries(REF))t.forEach(t=>{const n=document.createElement("p");n.innerText=t[0],n.onclick=()=>{rtxt.value=t[1].trim();const e=document.querySelector(".selrefIt");e&&e.classList.remove("selrefIt"),n.classList.add("selrefIt")},n.classList.add("refIt"),n.classList.add(e+"_it"),rconts.appendChild(n)});function setRefFilter(e,t){rconts.classList=e,document.querySelector(".refbtnsel").classList.remove("refbtnsel"),t.classList.add("refbtnsel")}const log=document.getElementById("logs");function rmEval(){log.replaceChildren()}const LEVEL=Object.freeze({GREY:"grey",INFO:"info",DEBUG:"debug",WARN:"warn",ERROR:"error"});function addMsg(e,t){const n=document.createElement("p");n.innerText=e,n.classList.add("log"),n.classList.add(t),log.appendChild(n)}function runCode(){rmEval();var e={};for(const[t,n]of code.value.split(/\r?\n/).entries())for(const s of n.split(";"))e=evalLine(s,e,t+1);(!e?.inside||e.inside.length>0)&&addMsg(`Unclosed statements found: [${e.inside.join(", ")}]!`,LEVEL.ERROR),addMsg("Done evaluating!",LEVEL.INFO)}const STRUCTURE={deindent:new Set(["elseif","else","endif","end","endcase","endwhile","until","next"]),indent:new Set(["begin","if","elseif","else","casewhere","while","repeat","for"]),namekeys:new Set(["if","elseif","else","endif","casewhere","choice","otherwise","begin","end","while","endwhile","repeat","until","for","next"])},MAIN_FUNC_NAME="main",forRe=/^for (?<var>.+?)(?: = (?<start>.+?))?(?: to (?<to>.+?))?(?: step (?<step>.+?))?$/i,caseRe=/^case(?: ?where)? (.+?)( evaluates to| is)?$/i,funcRe=/^(?:begin|end)(?: (?<name>.+?)(?:\( *(?<sig>.*) *\))?)?$/i;function evalLine(e,t,n){const h=e.search(/\S|$/);if(e=e.trim().replace("	"," ").replace(/ {2,}/g," "),!e)return t;const s=e.match(/^\S+/)?.[0].toLowerCase(),a=t?.inside??[],c=a&&a.length>0?a[a.length-1]:null,l=c?c[0]:null;var o,i,r,d,u,m,g,p=!1;const f=t?.indent??0;if(u=t?.indentDir??0,STRUCTURE.deindent.has(s)&&(u-=1),t?.fudgeindent||(u>0&&h<=f?addMsg(`Expected indent on line ${n}!`,LEVEL.ERROR):u==0&&h!=f?addMsg(`Unexpected indent on line ${n}!`,LEVEL.ERROR):u<0&&h>=f&&addMsg(`Expected deindent on line ${n}!`,LEVEL.ERROR)),i=!1,l==="if")if(s=="elseif"){const t=e.split(" ");t[t.length-1].toLowerCase()!="then"?(addMsg(`Expected 'THEN' at end of line ${n}!`,LEVEL.ERROR),o=t.slice(1).join(" ")):o=t.slice(1,-1).join(" "),o=o.trim(),o||addMsg(`Missing condition on line ${n}!`,LEVEL.ERROR),addMsg(`elif (${o}):`,LEVEL.DEBUG),i=!0}else s=="else"?(e.toLowerCase()!=s&&addMsg(`Too much on line ${n}! (Did you mean ELSEIF?)`,LEVEL.ERROR),addMsg(`else:`,LEVEL.DEBUG),i=!0):s=="endif"&&(e.toLowerCase()!=s&&addMsg(`Too much on line ${n}!`,LEVEL.ERROR),addMsg(`# endif`,LEVEL.DEBUG),a.pop(),i=!0);else if(l==="while")s=="endwhile"&&(e.toLowerCase()!=s&&addMsg(`Too much on line ${n}!`,LEVEL.ERROR),addMsg(`# endwhile`,LEVEL.DEBUG),a.pop(),i=!0);else if(l==="repeat")s=="until"&&(o=e.split(" ").slice(1).join(" ").trim(),o||addMsg(`Missing condition on line ${n}!`,LEVEL.ERROR),addMsg(`if (${o}): break # until`,LEVEL.DEBUG),a.pop(),i=!0);else if(l==="for")s=="next"&&(r=e.split(" ").slice(1).join(" ").trim(),r?r!=c[1]&&addMsg(`Variable name on line ${n} doesn't match with definition!`,LEVEL.ERROR):addMsg(`Missing variable name on line ${n}!`,LEVEL.ERROR),addMsg(`# next ${r||"???"}`,LEVEL.DEBUG),a.pop(),i=!0);else if(l==="case"){const t=s.endsWith(":")?s.slice(0,-1):s,r=e.toLowerCase().startsWith("end case");if(t=="choice"){const t=e.split(":");t.length<2?(addMsg(`Missing colon on line ${n}!`,LEVEL.ERROR),o=e):t.length>2?(addMsg(`Too many colons on line ${n}!`,LEVEL.ERROR),o=t[0],m=t.slice(1).join(":")):(o=t[0],m=t[1]),addMsg(`case ${o.replace(/^S+\s*/,"")}:`,LEVEL.DEBUG),m&&addMsg(`> ${m}`,LEVEL.GREY),p=!0,i=!0}else if(t=="otherwise"||t=="default"){t!="otherwise"&&addMsg(`Should be 'OTHERWISE' not 'DEFAULT' on line ${n}!`,LEVEL.ERROR);const s=e.split(":");s.length<2?addMsg(`Missing colon on line ${n}!`,LEVEL.ERROR):s.length>2&&addMsg(`Too many colons on line ${n}!`,LEVEL.ERROR),s[0].toLowerCase()!=t&&addMsg(`Too much before the colon on line ${n}!`,LEVEL.ERROR),addMsg(`case _:`,LEVEL.DEBUG);const o=s.slice(1).join(":").trim();o&&addMsg(`> ${o}`,LEVEL.GREY),p=!0,i=!0}else(s=="endcase"||s=="esac"||r)&&(r?e.toLowerCase()!="end case"&&addMsg(`Too much on line ${n}!`,LEVEL.ERROR):(addMsg(`Should be 'END CASE' not '${s.toUpperCase()}' on line ${n}!`,LEVEL.ERROR),e.toLowerCase()!=s&&addMsg(`Too much on line ${n}!`,LEVEL.ERROR)),addMsg(`# endcase`,LEVEL.DEBUG),a.pop(),i=!0)}else if(l==="func"&&s=="end"){const s=e.match(funcRe).groups,o=s.name??MAIN_FUNC_NAME,t=s.sig||"";o!=c[1]&&addMsg(`The function name on line ${n} is not the same as the one defined!`,LEVEL.ERROR),c[2]&&!t?addMsg(`You should include the function signature on line ${n}!`,LEVEL.INFO):c[2]!=t&&addMsg(`The function signature on line ${n} is not the same as the one defined!`,LEVEL.ERROR),addMsg(`# end ${o}(${t})`,LEVEL.DEBUG),a.pop(),i=!0}if(!i)if(s=="if"){const t=e.split(" ");t[t.length-1].toLowerCase()!="then"?(addMsg(`Expected 'THEN' at end of line ${n}!`,LEVEL.ERROR),o=t.slice(1).join(" ")):o=t.slice(1,-1).join(" "),o=o.trim(),o||addMsg(`Missing condition on line ${n}!`,LEVEL.ERROR),addMsg(`if (${o}):`,LEVEL.DEBUG),a.push(["if"]),i=!0}else if(s=="while"){const t=e.split(" ");t[t.length-1].toLowerCase()=="do"?(addMsg(`'DO' not required on line ${n}!`,LEVEL.WARN),o=t.slice(1,-1).join(" ")):o=t.slice(1).join(" "),o=o.trim(),o||addMsg(`Missing condition on line ${n}!`,LEVEL.ERROR),addMsg(`while (${o}):`,LEVEL.DEBUG),a.push(["while"]),i=!0}else if(s=="repeat")e.split(" ").length>1&&addMsg(`Too much on line ${n}!`,LEVEL.ERROR),addMsg(`while True: # repeat`,LEVEL.DEBUG),a.push(["repeat"]),i=!0;else if(s=="for"){const t=e.match(forRe);if(t===null)addMsg(`Missing arguments on line ${n}!`,LEVEL.ERROR),addMsg(`for ???:`,LEVEL.DEBUG);else{const e=t.groups;r=e.var,e.start||addMsg(`Missing start value on line ${n}!`,LEVEL.ERROR),e.to||addMsg(`Missing end value on line ${n}!`,LEVEL.ERROR),e.step||addMsg(`No step value on line ${n}, using 1 instead.`,LEVEL.INFO),addMsg(`for ${r} in range(${e.start??"??"}, ${e.to??"??"}${e.step?", "+e.step:""}):`,LEVEL.DEBUG)}a.push(["for",r]),i=!0}else if(s=="case"||s=="casewhere"){s=="case"&&addMsg(`Should be 'CASEWHERE' not 'CASE' on line ${n}!`,LEVEL.ERROR);const t=e.match(caseRe);t===null?(addMsg(`Missing arguments on line ${n}!`,LEVEL.ERROR),addMsg(`match ???:`,LEVEL.DEBUG)):(t[2]||addMsg(`CASEWHERE should probably end with ' EVALUATES TO' or ' IS', but found nothing on line ${n}!`,LEVEL.WARN),addMsg(`match ${t[1]}:`,LEVEL.DEBUG)),a.push(["case"]),i=!0}else if(s=="begin"){a.length>0&&addMsg(`Function definition on line ${n} is not at the outer level!`,LEVEL.WARN);const t=e.match(funcRe).groups,s=t.name??MAIN_FUNC_NAME;d=t.sig,d===""&&addMsg(`You do not have to include plain () at the end of the function definition on line ${n}!`,LEVEL.INFO),d=d||"",addMsg(`def ${s}(${d}):`,LEVEL.DEBUG),a.push(["func",s,d]),i=!0}i||(STRUCTURE.namekeys.has(s)?addMsg(`Key '${s.toUpperCase()}' used in incorrect location on line ${n}`,LEVEL.ERROR):addMsg(`> ${e}`,LEVEL.GREY)),g=STRUCTURE.indent.has(s)?1:0;const v={indent:h,indentDir:g,inside:a,fudgeindent:p};return v}TLN.append_line_numbers("pcode")