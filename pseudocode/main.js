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
This doesn't have one explicit form it needs to be in, but this is a good idea;
INPUT variable
DISPLAY expression

As an example of how variable it is, you could probably get away with the following instead, depending on how you use it.
variable = INPUT "Input a number:"
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
}
for (const [key, opts] of Object.entries(REF)) {
    opts.forEach(o=>{
        const elm = document.createElement('p')
        elm.innerText = o[0]
        elm.onclick = ()=>{
            rtxt.value = o[1]
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
function rmEval() { log.replaceChildren(); }
const LEVEL = Object.freeze({
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
function runCode() {
    rmEval()
    var state = {}
    for (const [index, line] of code.value.split(/\r?\n/).entries()) {
        state = evalLine(line, state, index + 1);
    }
    addMsg("Done evaluating!", LEVEL.INFO)
}

const deindentwords = new Set([
    'elseif', 'else', 'endif', 'end', 'endcase', 'endwhile', 'until', 'next'
]);
const indentwords = new Set([
    'begin', 'if', 'elseif', 'else', 'casewhere', 'while', 'repeat', 'for'
]);
function evalLine(line, state, lnnum) {
    console.log(line)
    const indent = line.search(/\S|$/);
    line = line.trim()
    if (!line) return state;
    const cmd = line.match(/^\S+/)?.[0].toLowerCase()

    // Check indent
    const lastIndent = state?.indent ?? 0
    var dir = state?.indentDir ?? 0
    if (deindentwords.has(cmd)) dir -= 1
    if (dir > 0 && indent <= lastIndent) {
        addMsg(`Expected indent on line ${lnnum}!`, LEVEL.ERROR)
    } else if (dir == 0 && indent != lastIndent) {
        addMsg(`Unexpected indent on line ${lnnum}!`, LEVEL.ERROR)
    } else if (dir < 0 && indent >= lastIndent) {
        addMsg(`Expected deindent on line ${lnnum}!`, LEVEL.ERROR)
    }

    // Setup next state
    const nxtindent = indentwords.has(cmd) || line.endsWith(':') ? 1:0
    const nstate = {
        indent: indent,
        indentDir: nxtindent,
    }
    return nstate
}

TLN.append_line_numbers('pcode')
