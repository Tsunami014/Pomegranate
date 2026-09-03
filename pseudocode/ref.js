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

const rconts = document.getElementById("refconts");
const rtxt = document.getElementById("reftxt");
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
