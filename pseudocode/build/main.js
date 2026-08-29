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
This doesn't have one explicit form it needs to be in, so here are some ideas:

READING:
    INPUT variable
    variable = INPUT "Input a number:"
    READ INTO variable

WRITING:
    DISPLAY expression
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
`]],misc:[["A test of every feature",`
BEGIN
    IF condition THEN
        DISPLAY "Cool!"
    ELSEIF condition2 THEN
        DISPLAY "Less cool"
    ELSE
        DISPLAY "Not cool."
    ENDIF

    variable = subprocess()

    WHILE condition is true
        process
    ENDWHILE

    REPEAT
        INPUT test_score
    UNTIL test_score > 50

    DISPLAY "Here are the numbers 1-10:"
    FOR num = 1 TO 10 STEP 1
        proc2(num)
    NEXT num
END

BEGIN subprocess
    CASEWHERE expression evaluates to
        choice a: process a
        choice b:
            process b
            IF hi THEN
                test
            ENDIF
        OTHERWISE: default process
    END CASE
    RETURN expression
END subprocess

BEGIN proc2(var)
    DISPLAY var
END proc2(var)
`]]};for(const[e,t]of Object.entries(REF))t.forEach(t=>{const n=document.createElement("p");n.innerText=t[0],n.onclick=()=>{rtxt.value=t[1].trim();const e=document.querySelector(".selrefIt");e&&e.classList.remove("selrefIt"),n.classList.add("selrefIt")},n.classList.add("refIt"),n.classList.add(e+"_it"),rconts.appendChild(n)});function setRefFilter(e,t){rconts.classList=e,document.querySelector(".refbtnsel").classList.remove("refbtnsel"),t.classList.add("refbtnsel")}const log=document.getElementById("logs"),pynput=document.getElementById("pynput");function rmEval(){log.replaceChildren(),pynput.value=""}const LEVEL=Object.freeze({GREY:"grey",INFO:"info",DEBUG:"debug",WARN:"warn",ERROR:"error"});function addMsg(e,t){const n=document.createElement("p");n.innerText=e,n.classList.add("log"),n.classList.add(t),log.appendChild(n)}function addToPy(e,t){const n="    ".repeat(t)+e;pynput.value==""?pynput.value=n:pynput.value+=`
`+n}function runCode(){rmEval();var e={};for(const[t,n]of code.value.split(/\r?\n/).entries())for(const s of n.split(";"))e=evalLine(s,e,t+1);(!e?.inside||e.inside.length>0)&&addMsg(`Unclosed statements found: [${e.inside.join(", ")}]!`,LEVEL.ERROR),addMsg("Done evaluating!",LEVEL.GREY)}const STRUCTURE={deindent:new Set(["elseif","else","endif","end","endcase","endwhile","until","next"]),indent:new Set(["begin","if","elseif","else","casewhere","while","repeat","for"]),fudge:new Set(["choice","choice:","otherwise","otherwise:"]),namekeys:new Set(["if","elseif","else","endif","casewhere","choice","otherwise","begin","end","while","endwhile","repeat","until","for","next"])},MAIN_FUNC_NAME="main",ALT_MAIN_FUNC_NAME="Program",forRe=/^for (?<var>.+?)(?: = (?<start>.+?))?(?: to (?<to>.+?))?(?: step (?<step>.+?))?$/i,caseRe=/^case(?: ?where)? (.+?)( evaluates to| is)?$/i,funcRe=/^(?:begin|end)(?: (?<name>.+?)(?:\( *(?<sig>.*) *\))?)?$/i;function evalLine(e,t,n){const m=e.search(/\S|$/);if(e=e.trim().replace("	"," ").replace(/ {2,}/g," "),!e)return addToPy("",t?.inside?.length??0),t;const s=e.match(/^\S+/)?.[0].toLowerCase(),r=t?.inside??[],l=r&&r.length>0?r[r.length-1]:null,d=l?l[0]:null,a=r.length+r.reduce((e,t)=>t[0]=="case"?e+1:e,0);var o,i,c,u,h,f,v,g=!1;const p=t?.indent??0;if(!t?.fudgeindent&&!STRUCTURE.fudge.has(s)&&(h=t?.indentDir??0,STRUCTURE.deindent.has(s)&&(h-=1),h>0&&m<=p?addMsg(`Expected indent on line ${n}!`,LEVEL.ERROR):h==0&&m!=p?addMsg(`Unexpected indent on line ${n}!`,LEVEL.ERROR):h<0&&m>=p&&addMsg(`Expected deindent on line ${n}!`,LEVEL.ERROR)),i=!1,d==="if")if(s=="elseif"){const t=e.split(" ");t[t.length-1].toLowerCase()!="then"?(addMsg(`Expected 'THEN' at end of line ${n}!`,LEVEL.ERROR),o=t.slice(1).join(" ")):o=t.slice(1,-1).join(" "),o=o.trim(),o||addMsg(`Missing condition on line ${n}!`,LEVEL.ERROR),addToPy(`elif (${o}):`,a-1),i=!0}else s=="else"?(e.toLowerCase()!=s&&addMsg(`Too much on line ${n}! (Did you mean ELSEIF?)`,LEVEL.ERROR),addToPy(`else:`,a-1),i=!0):s=="endif"&&(e.toLowerCase()!=s&&addMsg(`Too much on line ${n}!`,LEVEL.ERROR),r.pop(),i=!0);else if(d==="while")s=="endwhile"&&(e.toLowerCase()!=s&&addMsg(`Too much on line ${n}!`,LEVEL.ERROR),r.pop(),i=!0);else if(d==="repeat")s=="until"&&(o=e.split(" ").slice(1).join(" ").trim(),o||addMsg(`Missing condition on line ${n}!`,LEVEL.ERROR),addToPy(`if (${o}): break # until`,a),r.pop(),i=!0);else if(d==="for")s=="next"&&(c=e.split(" ").slice(1).join(" ").trim(),c?c!=l[1]&&addMsg(`Variable name on line ${n} doesn't match with definition!`,LEVEL.ERROR):addMsg(`Missing variable name on line ${n}!`,LEVEL.ERROR),addToPy(`# next ${c||"???"}`,a-1),r.pop(),i=!0);else if(d==="case"){const t=s.endsWith(":")?s.slice(0,-1):s,c=e.toLowerCase().startsWith("end case");if(t=="choice"){const t=e.split(":");t.length<2?(addMsg(`Missing colon on line ${n}!`,LEVEL.ERROR),o=e):t.length>2?(addMsg(`Too many colons on line ${n}!`,LEVEL.ERROR),o=t[0],f=t.slice(1).join(":")):(o=t[0],f=t[1]),addToPy(`case ${o.replace(/^S+\s*/,"")}:`,a-1),f&&addToPy(`> ${f.trim()}`,a),g=!0,i=!0}else if(t=="otherwise"||t=="default"){t!="otherwise"&&addMsg(`Should be 'OTHERWISE' not 'DEFAULT' on line ${n}!`,LEVEL.ERROR);const s=e.split(":");s.length<2?addMsg(`Missing colon on line ${n}!`,LEVEL.ERROR):s.length>2&&addMsg(`Too many colons on line ${n}!`,LEVEL.ERROR),s[0].toLowerCase()!=t&&addMsg(`Too much before the colon on line ${n}!`,LEVEL.ERROR),addToPy(`case _:`,a-1);const o=s.slice(1).join(":").trim();o&&addToPy(`> ${o}`,a),g=!0,i=!0}else(s=="endcase"||s=="esac"||c)&&(c?e.toLowerCase()!="end case"&&addMsg(`Too much on line ${n}!`,LEVEL.ERROR):(addMsg(`Should be 'END CASE' not '${s.toUpperCase()}' on line ${n}!`,LEVEL.ERROR),e.toLowerCase()!=s&&addMsg(`Too much on line ${n}!`,LEVEL.ERROR)),r.pop(),i=!0)}else if(d==="func"&&s=="end"){const o=e.match(funcRe).groups,t=o.name??MAIN_FUNC_NAME,s=o.sig||"";t!=l[1]&&addMsg(`The function name on line ${n} is not the same as the one defined!`,LEVEL.ERROR),l[2]&&!s?addMsg(`You should include the function signature on line ${n}!`,LEVEL.INFO):l[2]!=s&&addMsg(`The function signature on line ${n} is not the same as the one defined!`,LEVEL.ERROR),addToPy(`# end ${t==MAIN_FUNC_NAME?ALT_MAIN_FUNC_NAME:t}(${s})`,a-1),r.pop(),i=!0}if(!i)if(s=="if"){const t=e.split(" ");t[t.length-1].toLowerCase()!="then"?(addMsg(`Expected 'THEN' at end of line ${n}!`,LEVEL.ERROR),o=t.slice(1).join(" ")):o=t.slice(1,-1).join(" "),o=o.trim(),o||addMsg(`Missing condition on line ${n}!`,LEVEL.ERROR),addToPy(`if (${o}):`,a),r.push(["if"]),i=!0}else if(s=="while"){const t=e.split(" ");t[t.length-1].toLowerCase()=="do"?(addMsg(`'DO' not required on line ${n}!`,LEVEL.WARN),o=t.slice(1,-1).join(" ")):o=t.slice(1).join(" "),o=o.trim(),o||addMsg(`Missing condition on line ${n}!`,LEVEL.ERROR),addToPy(`while (${o}):`,a),r.push(["while"]),i=!0}else if(s=="repeat")e.split(" ").length>1&&addMsg(`Too much on line ${n}!`,LEVEL.ERROR),addToPy(`while True: # repeat`,a),r.push(["repeat"]),i=!0;else if(s=="for"){const t=e.match(forRe);if(t===null)addMsg(`Missing arguments on line ${n}!`,LEVEL.ERROR),addToPy(`for ???:`,a);else{const e=t.groups;c=e.var,e.start||addMsg(`Missing start value on line ${n}!`,LEVEL.ERROR),e.to||addMsg(`Missing end value on line ${n}!`,LEVEL.ERROR),e.step||addMsg(`No step value on line ${n}, using 1 instead.`,LEVEL.INFO),addToPy(`for ${c} in range(${e.start??"??"}, ${e.to??"??"} + 1${e.step?", "+e.step:""}):`,a)}r.push(["for",c]),i=!0}else if(s=="case"||s=="casewhere"){s=="case"&&addMsg(`Should be 'CASEWHERE' not 'CASE' on line ${n}!`,LEVEL.ERROR);const t=e.match(caseRe);t===null?(addMsg(`Missing arguments on line ${n}!`,LEVEL.ERROR),addToPy(`match ???:`,a)):(t[2]||addMsg(`CASEWHERE should probably end with ' EVALUATES TO' or ' IS', but found nothing on line ${n}!`,LEVEL.WARN),addToPy(`match ${t[1]}:`,a)),r.push(["case"]),i=!0}else if(s=="begin"){a>0&&addMsg(`Function definition on line ${n} is not at the outer level!`,LEVEL.WARN);const s=e.match(funcRe).groups,t=s.name??MAIN_FUNC_NAME;u=s.sig,u===""&&addMsg(`You do not have to include plain () at the end of the function definition on line ${n}!`,LEVEL.INFO),u=u||"",addToPy(`def ${t==MAIN_FUNC_NAME?ALT_MAIN_FUNC_NAME:t}(${u}):`,a),r.push(["func",t,u]),i=!0}else s=="display"?(addToPy(`print(${e.slice(e.indexOf(" ")+1)})`,a),i=!0):s=="return"&&(addToPy(`return ${e.slice(e.indexOf(" ")+1)}`,a),i=!0);i||(STRUCTURE.namekeys.has(s)?addMsg(`Key '${s.toUpperCase()}' used in incorrect location on line ${n}`,LEVEL.ERROR):addToPy(`> ${e}`,a)),v=STRUCTURE.indent.has(s)?1:0;const b={indent:m,indentDir:v,inside:r,fudgeindent:g};return b}TLN.append_line_numbers("pcode")