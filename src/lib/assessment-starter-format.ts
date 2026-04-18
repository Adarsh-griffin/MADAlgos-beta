import type { AssessmentLangKey } from "@/lib/assessment-code-starters";

/** Index after matching `}` for block starting at `openIdx` (`{`). */
function skipBraceBlock(s: string, openIdx: number): number {
  if (openIdx < 0 || s[openIdx] !== "{") return -1;
  let depth = 0;
  for (let i = openIdx; i < s.length; i++) {
    const c = s[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

function looksLikeCompactJava(code: string): boolean {
  const i = code.indexOf("public class Main{");
  if (i === -1) return false;
  const head = code.slice(i, i + 40);
  return !head.includes("\n");
}

function formatJavaStaticSolve(block: string): string {
  const open = block.indexOf("{");
  if (open === -1) return block;
  const close = skipBraceBlock(block, open);
  if (close === -1) return block;
  const sig = block.slice(0, open).trim();
  const bodyRaw = block.slice(open + 1, close - 1).trim();
  let body = bodyRaw;
  if (!body.includes("START CODING HERE")) {
    body = `// >>> START CODING HERE\n        ${bodyRaw}\n        // >>> END CODING HERE`;
  }
  return `    ${sig} {\n        ${body}\n    }`;
}

/** Break lines after `;` before common statements — avoids splitting `for(;;)` clauses. */
function breakAfterStatementSemicolons(body: string): string {
  return body.replace(
    /;\s*(?=(?:Scanner|System|String|StringBuilder|ios|int|long|double|boolean|char|void|return|if|for|while|auto|vector|cout|cin|printf|scanf|malloc|free)\b)/g,
    ";\n        "
  );
}

function formatJavaMain(block: string): string {
  const open = block.indexOf("{");
  if (open === -1) return `    ${block}`;
  const close = skipBraceBlock(block, open);
  if (close === -1) return `    ${block}`;
  const sig = block.slice(0, open).trim();
  const body = block.slice(open + 1, close - 1);
  const pretty = breakAfterStatementSemicolons(body).trim();
  return `    ${sig} {\n        ${pretty}\n    }`;
}

/** Minified: `public class Main{static ... solve(...){...}public static void main(...){...}}` */
function formatCompactJava(code: string): string {
  const idx = code.indexOf("public class Main{");
  if (idx === -1) return code;
  const prefix = code.slice(0, idx);
  const inner = code.slice(idx + "public class Main{".length);
  const sep = inner.indexOf("}public static void main");
  if (sep === -1) return code;

  const solvePart = inner.slice(0, sep + 1).trim();
  const mainPart = inner.slice(sep + 1).trim();

  const mainOpen = mainPart.indexOf("{");
  const mainEnd = mainOpen === -1 ? -1 : skipBraceBlock(mainPart, mainOpen);
  if (mainEnd === -1) return code;
  const mainBlock = mainPart.slice(0, mainEnd);

  const solveFmt = formatJavaStaticSolve(solvePart);
  const mainFmt = formatJavaMain(mainBlock.trim());

  return `${prefix}public class Main {\n${solveFmt}\n\n${mainFmt}\n}\n`;
}

/** Minified: `...solve(...){...}int main(){...}` */
function formatCompactCpp(code: string): string {
  const sep = code.indexOf("}int main(");
  if (sep === -1) return code;
  const before = code.slice(0, sep + 1);
  const mainPart = code.slice(sep + 1);

  const solveOpen = before.lastIndexOf("{");
  if (solveOpen === -1) return code;
  const solveClose = skipBraceBlock(before, solveOpen);
  if (solveClose === -1) return code;

  const sig = before.slice(0, solveOpen).trim();
  const bodyRaw = before.slice(solveOpen + 1, solveClose - 1).trim();
  let body = bodyRaw;
  if (!body.includes("START CODING HERE")) {
    body = `// >>> START CODING HERE\n    ${bodyRaw}\n    // >>> END CODING HERE`;
  }
  const solveFmt = `${sig} {\n    ${body}\n}\n`;

  const mOpen = mainPart.indexOf("{");
  if (mOpen === -1) return `${solveFmt}\n${mainPart}`;
  const mClose = skipBraceBlock(mainPart, mOpen);
  if (mClose === -1) return `${solveFmt}\n${mainPart}`;
  const mSig = mainPart.slice(0, mOpen).trim();
  const mBody = breakAfterStatementSemicolons(mainPart.slice(mOpen + 1, mClose - 1)).trim();
  const mainFmt = `${mSig} {\n    ${mBody}\n}\n`;

  return `${solveFmt}\n${mainFmt}`;
}

/** Minified: `...solve(...){...}int main(...){...}` */
function formatCompactC(code: string): string {
  const sep = code.indexOf("}int main");
  if (sep === -1) return code;
  const before = code.slice(0, sep + 1);
  const mainPart = code.slice(sep + 1);

  const solveOpen = before.lastIndexOf("{");
  if (solveOpen === -1) return code;
  const solveClose = skipBraceBlock(before, solveOpen);
  if (solveClose === -1) return code;

  const sig = before.slice(0, solveOpen).trim();
  const bodyRaw = before.slice(solveOpen + 1, solveClose - 1).trim();
  let body = bodyRaw;
  if (!body.includes("START CODING HERE")) {
    body = `/* >>> START CODING HERE */\n    ${bodyRaw}\n    /* >>> END CODING HERE */`;
  }
  const solveFmt = `${sig} {\n    ${body}\n}\n`;

  const mOpen = mainPart.indexOf("{");
  if (mOpen === -1) return `${solveFmt}\n${mainPart}`;
  const mClose = skipBraceBlock(mainPart, mOpen);
  if (mClose === -1) return `${solveFmt}\n${mainPart}`;
  const mSig = mainPart.slice(0, mOpen).trim();
  const mBody = breakAfterStatementSemicolons(mainPart.slice(mOpen + 1, mClose - 1)).trim();
  const mainFmt = `${mSig} {\n    ${mBody}\n}\n`;

  return `${solveFmt}\n${mainFmt}`;
}

/** One-line `function solve(...){ stub }` after banner */
function formatCompactJs(code: string): string {
  const fnStart = code.indexOf("function solve");
  if (fnStart === -1) return code;
  const open = code.indexOf("{", fnStart);
  if (open === -1) return code;
  const close = skipBraceBlock(code, open);
  if (close === -1) return code;
  const body = code.slice(open + 1, close - 1).trim();
  if (body.includes("\n")) return code;
  const sig = code.slice(fnStart, open).trim();
  const rest = code.slice(close);
  const inner = body.includes("START CODING HERE")
    ? body
    : `// >>> START CODING HERE\n  ${body}\n  // >>> END CODING HERE`;
  return `${code.slice(0, fnStart)}${sig} {\n  ${inner}\n}${rest}`;
}

/** Single-line `def solve(...): return ...` */
function formatCompactPython(code: string): string {
  const lines = code.split("\n");
  const i = lines.findIndex((l) => /^def\s+solve/.test(l.trim()) && /:\s*\S/.test(l));
  if (i === -1) return code;
  const m = lines[i].match(/^(def\s+solve\s*\([^)]*\)(?:\s*->\s*[^:]+)?\s*:\s*)(.+)$/);
  if (!m || !m[2].trim()) return code;
  const indent = "    ";
  const body = m[2].trim();
  if (body.includes("\n")) return code;
  const inner = body.includes("START CODING HERE")
    ? body
    : `# >>> START CODING HERE\n${indent}${body}\n${indent}# >>> END CODING HERE`;
  lines[i] = m[1];
  lines.splice(i + 1, 0, inner);
  return lines.join("\n");
}

/**
 * Normalizes minified catalog starters so Monaco shows readable code and a clear
 * editable region inside `solve` (matches file-level START CODING HERE banner).
 */
export function formatStudentStarterLayout(code: string, lang: AssessmentLangKey): string {
  try {
    if (lang === "Java" && looksLikeCompactJava(code)) {
      return formatCompactJava(code);
    }
    if (lang === "C++" && code.includes("}int main(")) {
      return formatCompactCpp(code);
    }
    if (lang === "C" && code.includes("}int main")) {
      return formatCompactC(code);
    }
    if (lang === "Javascript") {
      const next = formatCompactJs(code);
      if (next !== code) return next;
    }
    if (lang === "Python") {
      const next = formatCompactPython(code);
      if (next !== code) return next;
    }
  } catch {
    return code;
  }
  return code;
}
