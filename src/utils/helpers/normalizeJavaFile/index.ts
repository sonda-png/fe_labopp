// Normalize java file
export function normalizeJavaFile(rawContent: string) {
    if (typeof rawContent !== "string") return "";

    let code = rawContent;

    // 1. If the string contains escape sequence like \\r\\n then decode it
    if (code.includes("\\r") || code.includes("\\n")) {
        try {
            code = JSON.parse(`"${code}"`);
        } catch (err) {
            console.warn("Can not parse escape sequence:", err);
        }
    }

    // 2. Normalize newline to \n
    code = code.replace(/\r\n/g, "\n");
    console.log(code)
    return code;
}
