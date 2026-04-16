export const ASSESSMENT_LANG_KEYS = ["Javascript", "Python", "Java", "C++", "C"] as const;
export type AssessmentLangKey = (typeof ASSESSMENT_LANG_KEYS)[number];

/**
 * Wide banner so students immediately see where to implement their solution.
 * (Intentionally does not mention LeetCode — those lines are stripped elsewhere when needed.)
 */
export const STUDENT_CODE_ZONE_BANNER: Record<AssessmentLangKey, string> = {
  Javascript: `// ========================== START CODING HERE ==========================
// Replace only the logic section below. Keep stdin/stdout wiring as-is.
// ========================================================================

`,
  Python: `# ========================== START CODING HERE ==========================
# Replace only the logic section below. Keep stdin/stdout wiring as-is.
# ========================================================================

`,
  Java: `/*
 * ========================= START CODING HERE =========================
 * Replace only the logic section below. Keep stdin/stdout wiring as-is.
 * ====================================================================
 */

`,
  "C++": `/*
 * ========================= START CODING HERE =========================
 * Replace only the logic section below. Keep stdin/stdout wiring as-is.
 * ====================================================================
 */

`,
  C: `/*
 * ========================= START CODING HERE =========================
 * Replace only the logic section below. Keep stdin/stdout wiring as-is.
 * ====================================================================
 */

`,
};

/** Short tips shown next to the editor for the chosen language. */
export const ASSESSMENT_CODE_HINTS: Record<AssessmentLangKey, string> = {
  Javascript:
    "Implement solve(...) and return the answer. Harness code handles stdin/stdout and final print.",
  Python:
    "Implement solve(...) and return the answer. Harness code handles stdin/stdout and final print.",
  Java: "Implement solve(...) and return the result; main() handles input/output wiring.",
  "C++": "Implement solve(...) and return the result; provided main() handles input/output wiring.",
  C: "Implement solve(...) and return the result; provided main() handles scanf/printf.",
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
    `function solve(a, b) {\n  // >>> START CODING HERE\n  // Return value only (do not print here)\n  return a + b;\n  // >>> END CODING HERE\n}\n\nconst readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on('line', (line) => lines.push(line));\nrl.on('close', () => {\n  const parts = (lines[0] || '').trim().split(/\\s+/).filter(Boolean);\n  const a = parts.length > 0 ? Number(parts[0]) : 0;\n  const b = parts.length > 1 ? Number(parts[1]) : 0;\n  const result = solve(a, b);\n  process.stdout.write(String(result) + '\\n');\n});\n`,
  Python:
    `import sys\n\n` +
    STUDENT_CODE_ZONE_BANNER.Python +
    `def solve(a: int, b: int):\n    # >>> START CODING HERE\n    # Return value only (do not print here)\n    return a + b\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    parts = sys.stdin.readline().strip().split()\n    a = int(parts[0]) if len(parts) > 0 else 0\n    b = int(parts[1]) if len(parts) > 1 else 0\n    result = solve(a, b)\n    sys.stdout.write(str(result) + \"\\n\")\n\n\nif __name__ == '__main__':\n    main()\n`,
  Java:
    `import java.util.Scanner;\n\n` +
    STUDENT_CODE_ZONE_BANNER.Java +
    `public class Main {\n    static long solve(long a, long b) {\n        // >>> START CODING HERE\n        // Return value only (do not print here)\n        return a + b;\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.hasNextLong() ? sc.nextLong() : 0;\n        long b = sc.hasNextLong() ? sc.nextLong() : 0;\n        long result = solve(a, b);\n        System.out.println(result);\n        sc.close();\n    }\n}\n`,
  "C++":
    `#include <iostream>\nusing namespace std;\n\n` +
    STUDENT_CODE_ZONE_BANNER["C++"] +
    `long long solve(long long a, long long b) {\n    // >>> START CODING HERE\n    // Return value only (do not print here)\n    return a + b;\n    // >>> END CODING HERE\n}\n\nint main() {\n    long long a = 0, b = 0;\n    if (!(cin >> a >> b)) return 0;\n    long long result = solve(a, b);\n    cout << result << "\\n";\n    return 0;\n}\n`,
  C:
    `#include <stdio.h>\n\n` +
    STUDENT_CODE_ZONE_BANNER.C +
    `long long solve(long long a, long long b) {\n    /* >>> START CODING HERE */\n    /* Return value only (do not print here) */\n    return a + b;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    long long a = 0, b = 0;\n    if (scanf("%lld %lld", &a, &b) != 2) return 0;\n    long long result = solve(a, b);\n    printf("%lld\\n", result);\n    return 0;\n}\n`,
};

export function getDefaultStarterCode(lang: string, problem?: { starterCode?: Record<string, string> }): string {
  const key = lang as AssessmentLangKey;
  const fromProblem = problem?.starterCode?.[lang] ?? problem?.starterCode?.[key];
  const raw =
    typeof fromProblem === "string" && fromProblem.trim() ? fromProblem : SNIPPETS[key] ?? SNIPPETS.Javascript;
  return stripLeetcodeMetaFromStarterCode(raw);
}
