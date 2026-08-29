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
