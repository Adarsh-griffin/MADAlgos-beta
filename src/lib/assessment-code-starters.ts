export const ASSESSMENT_LANG_KEYS = ["Javascript", "Python", "Java", "C++", "C"] as const;
export type AssessmentLangKey = (typeof ASSESSMENT_LANG_KEYS)[number];

/**
 * Wide banner so students immediately see where to implement their solution.
 * (Intentionally does not mention LeetCode — those lines are stripped elsewhere when needed.)
 */
export const STUDENT_CODE_ZONE_BANNER: Record<AssessmentLangKey, string> = {
  Javascript: `// ==============================================================================
//   WRITE YOUR SOLUTION BELOW — replace the placeholder logic; match problem I/O.
// ==============================================================================

`,
  Python: `# ==============================================================================
#   WRITE YOUR SOLUTION BELOW — replace the placeholder logic in main(); match I/O.
# ==============================================================================

`,
  Java: `/*
 * ==============================================================================
 *   WRITE YOUR SOLUTION BELOW — replace the placeholder logic in main(); match I/O.
 * ==============================================================================
 */

`,
  "C++": `/*
 * ==============================================================================
 *   WRITE YOUR SOLUTION BELOW — replace the placeholder logic in main(); match I/O.
 * ==============================================================================
 */

`,
  C: `/*
 * ==============================================================================
 *   WRITE YOUR SOLUTION BELOW — replace the placeholder logic in main(); match I/O.
 * ==============================================================================
 */

`,
};

/** Short tips shown next to the editor for the chosen language. */
export const ASSESSMENT_CODE_HINTS: Record<AssessmentLangKey, string> = {
  Javascript:
    "Use standard I/O (readline / console). Match output exactly including newlines. Test with Run samples before submitting.",
  Python:
    "Read from stdin with input() or sys.stdin. Print with print(..., end='') if trailing newline matters. Run samples to verify.",
  Java: "Use Scanner on System.in and System.out for output. Class name can be Main for Judge0 unless specified otherwise.",
  "C++": "Include iostream, use cin/cout or scanf/printf. Match output format exactly.",
  C: "Use stdio.h (scanf/printf). Ensure main returns 0.",
};

/**
 * Strips leading comments that expose LeetCode URLs or "Blind 75" labels in the IDE (seeded bank + legacy rows).
 */
export function stripLeetcodeMetaFromStarterCode(code: string): string {
  let s = code.replace(/^\uFEFF/, "");
  let guard = 0;
  while (guard++ < 24) {
    const before = s;
    s = s.trimStart();
    if (s !== before) continue;

    const javadoc = s.match(/^\/\*\*[\s\S]*?\*\/\s*/);
    if (javadoc && /leetcode\.com|Blind\s*75/i.test(javadoc[0])) {
      s = s.slice(javadoc[0].length);
      continue;
    }

    const pyDq = s.match(/^"""[\s\S]*?"""\s*/);
    if (pyDq && /leetcode\.com|Blind\s*75/i.test(pyDq[0])) {
      s = s.slice(pyDq[0].length);
      continue;
    }

    const pySq = s.match(/^'''[\s\S]*?'''\s*/);
    if (pySq && /leetcode\.com|Blind\s*75/i.test(pySq[0])) {
      s = s.slice(pySq[0].length);
      continue;
    }

    const cBlock = s.match(/^\/\*[\s\S]*?\*\/\s*/);
    if (cBlock && /leetcode\.com|Blind\s*75/i.test(cBlock[0])) {
      s = s.slice(cBlock[0].length);
      continue;
    }

    const head = s.slice(0, 1600);
    if (/leetcode\.com|Blind\s*75/i.test(head)) {
      const lines = s.split("\n");
      let i = 0;
      while (i < lines.length && /^\s*\/\//.test(lines[i])) i++;
      if (i > 0) {
        s = lines.slice(i).join("\n");
        continue;
      }
    }

    break;
  }
  return s.trimStart();
}

const SNIPPETS: Record<AssessmentLangKey, string> = {
  Javascript:
    STUDENT_CODE_ZONE_BANNER.Javascript +
    `const readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on('line', (line) => lines.push(line));\nrl.on('close', () => {\n  // --- your logic here ---\n  console.log('');\n});\n`,
  Python:
    `import sys\n\n` +
    STUDENT_CODE_ZONE_BANNER.Python +
    `def main():\n    data = sys.stdin.read().splitlines()\n    # --- your logic here ---\n    print('')\n\nif __name__ == '__main__':\n    main()\n`,
  Java:
    `import java.util.Scanner;\n\n` +
    STUDENT_CODE_ZONE_BANNER.Java +
    `public class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // --- your logic here ---\n        System.out.println("");\n        sc.close();\n    }\n}\n`,
  "C++":
    `#include <iostream>\nusing namespace std;\n\n` +
    STUDENT_CODE_ZONE_BANNER["C++"] +
    `int main() {\n    // --- your logic here ---\n    cout << "" << endl;\n    return 0;\n}\n`,
  C:
    `#include <stdio.h>\n\n` +
    STUDENT_CODE_ZONE_BANNER.C +
    `int main(void) {\n    /* --- your logic here --- */\n    printf("\\n");\n    return 0;\n}\n`,
};

export function getDefaultStarterCode(lang: string, problem?: { starterCode?: Record<string, string> }): string {
  const key = lang as AssessmentLangKey;
  const fromProblem = problem?.starterCode?.[lang] ?? problem?.starterCode?.[key];
  const raw =
    typeof fromProblem === "string" && fromProblem.trim() ? fromProblem : SNIPPETS[key] ?? SNIPPETS.Javascript;
  return stripLeetcodeMetaFromStarterCode(raw);
}
