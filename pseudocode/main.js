const INDENT = " ".repeat(4);

document.querySelectorAll("textarea").forEach(el => {
    el.spellcheck = false;
    el.autocomplete = "off";
    el.autocorrect = "off";
    el.autocapitalize = "off";
});

const code = document.getElementById("pcode");
code.addEventListener("keydown", e => {
    const value = code.value;
    const start = code.selectionStart;
    const end = code.selectionEnd;

    if (e.key === "Escape") {
        if (start !== end) {
            e.preventDefault();
            const lineStart = value.lastIndexOf("\n", start - 1) + 1;
            const firstNonSpace = lineStart + value.slice(lineStart).search(/\S|$/);

            code.setSelectionRange(firstNonSpace, firstNonSpace);
            return;
        }
        return;
    }

    if (e.key === "Tab") {
        e.preventDefault();

        if (start === end) {
            const lineStart =
                value.lastIndexOf("\n", start - 1) + 1;

            const beforeCursor = value.slice(lineStart, start);

            if (e.shiftKey) {
                if (/^ +$/.test(beforeCursor)) {
                    const remove = Math.min(
                        INDENT.length,
                        beforeCursor.length
                    );

                    if (remove > 0) {
                        code.setRangeText(
                            "",
                            start - remove,
                            start,
                            "end"
                        );
                    }
                }
            } else {
                // Normal Tab always inserts four spaces.
                code.setRangeText(
                    INDENT,
                    start,
                    end,
                    "end"
                );
            }

            return;
        }

        const selectedText = value.slice(start, end);

        if (!selectedText.includes("\n")) {
            // Shift+Tab inside a single line should not eat
            // characters before the selection.
            if (e.shiftKey) {
                return;
            }

            // Tab on a single-line selection still inserts
            // indentation at the beginning of that line.
        }

        // Find the beginning of the first selected line.
        const lineStart =
            value.lastIndexOf("\n", start - 1) + 1;

        // Don't include a completely unselected final line.
        const selectionEnd =
            end > start && value[end - 1] === "\n"
                ? end - 1
                : end;

        const selected = value.slice(
            lineStart,
            selectionEnd
        );

        let replacement;

        if (e.shiftKey) {
            // Remove up to four leading spaces from every selected line.
            replacement = selected.replace(
                /^ {1,4}/gm,
                ""
            );
        } else {
            // Add four spaces to every selected line.
            replacement = selected.replace(
                /^/gm,
                INDENT
            );
        }

        code.setRangeText(
            replacement,
            lineStart,
            selectionEnd,
            "select"
        );

        return;
    }

    if (e.key === "Backspace" && start === end) {
        const lineStart =
            value.lastIndexOf("\n", start - 1) + 1;

        const beforeCursor = value.slice(
            lineStart,
            start
        );

        // Only activate while the cursor is inside indentation.
        if (/^ +$/.test(beforeCursor)) {
            const remove = Math.min(
                INDENT.length,
                beforeCursor.length
            );

            if (remove > 0) {
                e.preventDefault();

                code.setRangeText(
                    "",
                    start - remove,
                    start,
                    "end"
                );
            }

            return;
        }
    }

    if (e.key === "Enter") {
        e.preventDefault();

        const lineStart =
            value.lastIndexOf("\n", start - 1) + 1;

        const line = value.slice(
            lineStart,
            start
        );

        const indent = line.match(/^[ \t]*/)[0];
        code.setRangeText(
            "\n" + indent,
            start,
            end,
            "end"
        );
        return;
    }
});



const rconts = document.getElementById("refconts");
const rtxt = document.getElementById("reftxt");
const REF = {
    basic: [
        ["NOTE", `
Pseudocode is largely up to interpretation.
How you decide to implement processes and expressions is mostly up to you.
`],
        ["Inputs/Outputs", `
This doesn't have one explicit form it needs to be in, so here are some ideas:

READING:
    INPUT variable
    variable = INPUT "Input a number:"
    READ INTO variable

WRITING:
    DISPLAY expression
    RETURN expression
`],
    ],
    sel: [
        ["If/else", `
IF condition THEN
    process
ENDIF

IF condition THEN
    process1
ELSE
    process2
ENDIF
`],
        ["If/elseif/else", `
IF condition THEN
    process1
ELSEIF condition2 THEN
    process2
ELSE
    process3
ENDIF
`],
        ["Cases", `
CASEWHERE expression evaluates to
    choice a: process a
    choice b: process b
    ...
    OTHERWISE: default process
END CASE
`],
    ],
    rep: [
        ["Pre-test loop (while)", `
WHILE condition is true
    process
ENDWHILE
`],
        ["Post-test loop (repeat-until)", `
REPEAT
    process
UNTIL condition is true
`],
        ["For loop", `
FOR variable = start TO finish STEP increment
    process
NEXT variable
`],
    ],
    subr: [
        ["Main process", `
BEGIN
    process
END
`],
        ["Subprocess", `
BEGIN
    subprocess()
END

BEGIN subprocess
    process
END subprocess
`],
        ["Subprocess with arguments", `
BEGIN
    subprocess(argument)
END

BEGIN subprocess(argument)
    process
END subprocess(argument)
`],
        ["Returning", `
BEGIN
    variable = subprocess()
END

BEGIN subprocess
    process
    RETURN expression
END subprocess
`],
    ],
    misc: [
        ["A test of every feature", `
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
`],
    ],
}
for (const [key, opts] of Object.entries(REF)) {
    opts.forEach(o=>{
        const elm = document.createElement('p')
        elm.innerText = o[0]
        elm.onclick = ()=>{
            rtxt.value = o[1].trim()
            const oldsel = document.querySelector('.selrefIt')
            if (oldsel) oldsel.classList.remove('selrefIt')
            elm.classList.add('selrefIt')
        }
        elm.classList.add('refIt')
        elm.classList.add(key+'_it')
        rconts.appendChild(elm)
    })
}

function setRefFilter(filt, nbtn) {
    rconts.classList = filt;
    document.querySelector('.refbtnsel').classList.remove('refbtnsel')
    nbtn.classList.add('refbtnsel')
}



const log = document.getElementById('logs')
const pynput = document.getElementById('pynput')
function rmEval() {
    log.replaceChildren();
    pynput.value = "";
}
const LEVEL = Object.freeze({
    GREY: 'grey',
    INFO: 'info',
    DEBUG: 'debug',
    WARN: 'warn',
    ERROR: 'error',
});
function addMsg(msg, level) {
    const nelm = document.createElement('p')
    nelm.innerText = msg
    nelm.classList.add('log')
    nelm.classList.add(level)
    log.appendChild(nelm)
}
function addToPy(msg, indent) {
    const out = "    ".repeat(indent) + msg
    if (pynput.value == "") {
        pynput.value = out;
    } else {
        pynput.value += "\n"+out;
    }
}
function runCode() {
    rmEval()
    var state = {}
    for (const [index, line] of code.value.split(/\r?\n/).entries()) {
        for (const part of line.split(';')) {
            state = evalLine(part, state, index + 1)
        }
    }
    if (!state?.inside || state.inside.length > 0) {
        addMsg(`Unclosed statements found: [${state.inside.join(', ')}]!`, LEVEL.ERROR)
    }
    if (log.children.length == 0) {
        addMsg("Nothing seems wrong!", LEVEL.GREY)
    } else {
        addMsg("That is all!", LEVEL.GREY)
    }
}

const STRUCTURE = {
    // These mean the line with this on it should be deindented from the previous
    deindent: new Set([
        'elseif', 'else', 'endif', 'end', 'endcase', 'endwhile', 'until', 'next'
    ]),
    // These mean the next line should be indented
    indent: new Set([
        'begin', 'if', 'elseif', 'else', 'casewhere', 'while', 'repeat', 'for'
    ]),
    // These keys automatically allow fudging of indent
    fudge: new Set([
        'choice', 'choice:', 'otherwise', 'otherwise:'
    ]),
    // If one of these is the command and it wasn't handled, error instead of assuming it's a process
    namekeys: new Set([
        'if', 'elseif', 'else', 'endif', 'casewhere', 'choice', 'otherwise', 'begin', 'end',
        'while', 'endwhile', 'repeat', 'until', 'for', 'next'
    ])
}
const MAIN_FUNC_NAME = "\1main"
const ALT_MAIN_FUNC_NAME = "Program"
const forRe = /^for (?<var>.+?)(?: = (?<start>.+?))?(?: to (?<to>.+?))?(?: step (?<step>.+?))?$/i
const caseRe = /^case(?: ?where)? (.+?)( evaluates to| is)?$/i
const funcRe = /^(?:begin|end)(?: (?<name>.+?)(?:\( *(?<sig>.*) *\))?)?$/i
function evalLine(line, state, lnnum) {
    const indent = line.search(/\S|$/);
    line = line.trim().replace('\t', ' ').replace(/ {2,}/g, ' ')
    if (!line) {
        addToPy("", state?.inside?.length ?? 0)
        return state
    }
    const cmd = line.match(/^\S+/)?.[0].toLowerCase()

    const inside = state?.inside ?? []
    const innermost = (inside && inside.length > 0)? inside[inside.length-1] : null
    const innermostcmd = innermost? innermost[0] : null
    const pyindent = inside.length + inside.reduce((count, it) => it[0] == "case" ? count + 1 : count, 0)

    var fudgeindent = false

    // Check indent
    const lastIndent = state?.indent ?? 0
    if (!state?.fudgeindent && !STRUCTURE.fudge.has(cmd)) {
        var dir = state?.indentDir ?? 0
        if (STRUCTURE.deindent.has(cmd)) dir -= 1
        if (dir > 0 && indent <= lastIndent) {
            addMsg(`Expected indent on line ${lnnum}!`, LEVEL.ERROR)
        } else if (dir == 0 && indent != lastIndent) {
            addMsg(`Unexpected indent on line ${lnnum}!`, LEVEL.ERROR)
        } else if (dir < 0 && indent >= lastIndent) {
            addMsg(`Expected deindent on line ${lnnum}!`, LEVEL.ERROR)
        }
    }

    var done = false
    if (innermostcmd === 'if') {
        if (cmd == 'elseif') {
            const spl = line.split(' ')
            var cond;
            if (spl[spl.length-1].toLowerCase() != "then") {
                addMsg(`Expected 'THEN' at end of line ${lnnum}!`, LEVEL.ERROR)
                cond = spl.slice(1).join(' ')
            } else {
                cond = spl.slice(1,-1).join(' ')
            }
            cond = cond.trim()
            if (!cond) {
                addMsg(`Missing condition on line ${lnnum}!`, LEVEL.ERROR)
            }
            addToPy(`elif (${cond}):`, pyindent-1)
            done = true
        } else if (cmd == 'else') {
            if (line.toLowerCase() != cmd) {
                addMsg(`Too much on line ${lnnum}! (Did you mean ELSEIF?)`, LEVEL.ERROR)
            }
            addToPy(`else:`, pyindent-1)
            done = true
        } else if (cmd == 'endif') {
            if (line.toLowerCase() != cmd) {
                addMsg(`Too much on line ${lnnum}!`, LEVEL.ERROR)
            }
            inside.pop()
            done = true
        }
    } else if (innermostcmd === 'while') {
        if (cmd == 'endwhile') {
            if (line.toLowerCase() != cmd) {
                addMsg(`Too much on line ${lnnum}!`, LEVEL.ERROR)
            }
            inside.pop()
            done = true
        }
    } else if (innermostcmd === 'repeat') {
        if (cmd == 'until') {
            var cond = line.split(' ').slice(1).join(' ').trim()
            if (!cond) {
                addMsg(`Missing condition on line ${lnnum}!`, LEVEL.ERROR)
            }
            addToPy(`if (${cond}): break # until`, pyindent)
            inside.pop()
            done = true
        }
    } else if (innermostcmd === 'for') {
        if (cmd == 'next') {
            var v = line.split(' ').slice(1).join(' ').trim()
            if (!v) {
                addMsg(`Missing variable name on line ${lnnum}!`, LEVEL.ERROR)
            } else if (v != innermost[1]) {
                addMsg(`Variable name on line ${lnnum} doesn't match with definition!`, LEVEL.ERROR)
            }
            addToPy(`# next ${v || "???"}`, pyindent-1)
            inside.pop()
            done = true
        }
    } else if (innermostcmd === 'case') {
        const cmd2 = cmd.endsWith(':')? cmd.slice(0, -1) : cmd;
        const endcase = line.toLowerCase().startsWith('end case')
        if (cmd2 == 'choice') {
            const parts = line.split(':')
            var cond; var proc;
            if (parts.length < 2) {
                addMsg(`Missing colon on line ${lnnum}!`, LEVEL.ERROR)
                cond = line
            } else if (parts.length > 2) {
                addMsg(`Too many colons on line ${lnnum}!`, LEVEL.ERROR)
                cond = parts[0]
                proc = parts.slice(1).join(':')
            } else {
                cond = parts[0]
                proc = parts[1]
            }
            addToPy(`case ${cond.replace(/^S+\s*/, '')}:`, pyindent-1)
            if (proc) {
                addToPy(`${proc.trim()}#`, pyindent)
            }
            fudgeindent = true
            done = true
        } else if (cmd2 == 'otherwise' || cmd2 == 'default') {
            if (cmd2 != 'otherwise') {
                addMsg(`Should be 'OTHERWISE' not 'DEFAULT' on line ${lnnum}!`, LEVEL.ERROR)
            }
            const parts = line.split(':')
            if (parts.length < 2) {
                addMsg(`Missing colon on line ${lnnum}!`, LEVEL.ERROR)
            } else if (parts.length > 2) {
                addMsg(`Too many colons on line ${lnnum}!`, LEVEL.ERROR)
            }
            if (parts[0].toLowerCase() != cmd2) {
                addMsg(`Too much before the colon on line ${lnnum}!`, LEVEL.ERROR)
            }
            addToPy(`case _:`, pyindent-1)
            const proc = parts.slice(1).join(':').trim()
            if (proc) {
                addToPy(`${proc.trim()}#`, pyindent)
            }
            fudgeindent = true
            done = true
        } else if (cmd == 'endcase' || cmd == 'esac' || endcase) {
            if (!endcase) {
                addMsg(`Should be 'END CASE' not '${cmd.toUpperCase()}' on line ${lnnum}!`, LEVEL.ERROR)
                if (line.toLowerCase() != cmd) {
                    addMsg(`Too much on line ${lnnum}!`, LEVEL.ERROR)
                }
            } else if (line.toLowerCase() != 'end case') {
                addMsg(`Too much on line ${lnnum}!`, LEVEL.ERROR)
            }
            inside.pop()
            done = true
        }
    } else if (innermostcmd === 'func') {
        if (cmd == 'end') {
            const gs = line.match(funcRe).groups
            const nam = gs.name ?? MAIN_FUNC_NAME
            const sig = gs.sig || ""
            if (nam != innermost[1]) {
                addMsg(`The function name on line ${lnnum} is not the same as the one defined!`, LEVEL.ERROR)
            }
            if (innermost[2] && !sig) {
                addMsg(`You should include the function signature on line ${lnnum}!`, LEVEL.INFO)
            } else if (innermost[2] != sig) {
                addMsg(`The function signature on line ${lnnum} is not the same as the one defined!`, LEVEL.ERROR)
            }
            addToPy(`# end ${nam == MAIN_FUNC_NAME? ALT_MAIN_FUNC_NAME : nam}(${sig})`, pyindent-1)
            inside.pop()
            done = true
        }
    }

    if (!done) {
    if (cmd == 'if') {
        const spl = line.split(' ')
        var cond;
        if (spl[spl.length-1].toLowerCase() != "then") {
            addMsg(`Expected 'THEN' at end of line ${lnnum}!`, LEVEL.ERROR)
            cond = spl.slice(1).join(' ')
        } else {
            cond = spl.slice(1,-1).join(' ')
        }
        cond = cond.trim()
        if (!cond) {
            addMsg(`Missing condition on line ${lnnum}!`, LEVEL.ERROR)
        }
        addToPy(`if (${cond}):`, pyindent)
        inside.push(['if'])
        done = true
    } else if (cmd == 'while') {
        const spl = line.split(' ')
        var cond;
        if (spl[spl.length-1].toLowerCase() == "do") {
            addMsg(`'DO' not required on line ${lnnum}!`, LEVEL.WARN)
            cond = spl.slice(1,-1).join(' ')
        } else {
            cond = spl.slice(1).join(' ')
        }
        cond = cond.trim()
        if (!cond) {
            addMsg(`Missing condition on line ${lnnum}!`, LEVEL.ERROR)
        }
        addToPy(`while (${cond}):`, pyindent)
        inside.push(['while'])
        done = true
    } else if (cmd == 'repeat') {
        if (line.split(' ').length > 1) {
            addMsg(`Too much on line ${lnnum}!`, LEVEL.ERROR)
        }
        addToPy(`while True: # repeat`, pyindent)
        inside.push(['repeat'])
        done = true
    } else if (cmd == 'for') {
        const out = line.match(forRe)
        var v
        if (out === null) {
            addMsg(`Missing arguments on line ${lnnum}!`, LEVEL.ERROR)
            addToPy(`for ???:`, pyindent)
        } else {
            const gs = out.groups
            v = gs.var
            if (!gs.start) {
                addMsg(`Missing start value on line ${lnnum}!`, LEVEL.ERROR)
            }
            if (!gs.to) {
                addMsg(`Missing end value on line ${lnnum}!`, LEVEL.ERROR)
            }
            addToPy(`for ${v} in range(${gs.start ?? "??"}, ${gs.to ?? "??"} + 1${gs.step? (", "+gs.step) : ""}):`, pyindent)
        }
        inside.push(['for', v])
        done = true
    } else if (cmd == 'case' || cmd == 'casewhere') {
        if (cmd == 'case') {
            addMsg(`Should be 'CASEWHERE' not 'CASE' on line ${lnnum}!`, LEVEL.ERROR)
        }
        const out = line.match(caseRe)
        if (out === null) {
            addMsg(`Missing arguments on line ${lnnum}!`, LEVEL.ERROR)
            addToPy(`match ???:`, pyindent)
        } else {
            if (!out[2]) {
                addMsg(`CASEWHERE should probably end with ' EVALUATES TO' or ' IS', but found nothing on line ${lnnum}!`, LEVEL.WARN)
            }
            addToPy(`match ${out[1]}:`, pyindent)
        }
        inside.push(['case'])
        done = true
    } else if (cmd == 'begin') {
        if (pyindent > 0) {
            addMsg(`Function definition on line ${lnnum} is not at the outer level!`, LEVEL.WARN)
        }
        const gs = line.match(funcRe).groups
        const nam = gs.name ?? MAIN_FUNC_NAME
        var sig = gs.sig
        if (sig === "") {
            addMsg(`You do not have to include plain () at the end of the function definition on line ${lnnum}!`, LEVEL.INFO)
        }
        sig = sig || ""
        addToPy(`def ${nam == MAIN_FUNC_NAME? ALT_MAIN_FUNC_NAME : nam}(${sig}):`, pyindent)
        inside.push(['func', nam, sig])
        done = true
    } else if (cmd == 'display') {
        addToPy(`print(${line.slice(line.indexOf(' ') + 1)})`, pyindent)
        done = true
    } else if (cmd == 'return') {
        addToPy(`return ${line.slice(line.indexOf(' ') + 1)}`, pyindent)
        done = true
    }
    }

    if (!done) {
        if (STRUCTURE.namekeys.has(cmd)) {
            addMsg(`Key '${cmd.toUpperCase()}' used in incorrect location on line ${lnnum}`, LEVEL.ERROR)
        } else {
            addToPy(`${line}#`, pyindent)
        }
    }

    // Setup next state
    var nxtindent = STRUCTURE.indent.has(cmd) ? 1:0
    const nstate = {
        indent: indent,
        indentDir: nxtindent,
        inside: inside,
        fudgeindent: fudgeindent,
    }
    return nstate
}

TLN.append_line_numbers('pcode')
