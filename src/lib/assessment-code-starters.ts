import { formatStudentStarterLayout } from "@/lib/assessment-starter-format";

export const ASSESSMENT_LANG_KEYS = ["Javascript", "Python", "Java", "C++", "C"] as const;
export type AssessmentLangKey = (typeof ASSESSMENT_LANG_KEYS)[number];

const LANGUAGE_ALIASES: Record<AssessmentLangKey, string[]> = {
  Javascript: ["javascript", "js", "node", "nodejs", "ecmascript"],
  Python: ["python", "python3", "py"],
  Java: ["java", "java8", "java11", "jdk"],
  "C++": ["c++", "cpp", "cxx", "g++"],
  C: ["c", "gcc"],
};

/**
 * Short banners so students see where to type code (LeetCode-looking lines are stripped elsewhere).
 */
export const STUDENT_CODE_ZONE_BANNER: Record<AssessmentLangKey, string> = {
  Javascript: `// --- Your code goes inside solve(...) ---
// The lines below read stdin and print the answer; leave them alone unless you change the input shape.

`,
  Python: `# --- Your code goes inside solve(...) ---
# The helper below reads stdin and prints the answer; adjust only if your input format differs.

`,
  Java: `/*
 * --- Your code goes inside solve(...) ---
 * main() below reads stdin and prints; change it only if your input format differs.
 */

`,
  "C++": `/*
 * --- Your code goes inside solve(...) ---
 * main() below reads stdin and prints; change it only if your input format differs.
 */

`,
  C: `/*
 * --- Your code goes inside solve(...) ---
 * main() below reads stdin and prints; change it only if your input format differs.
 */

`,
};

/** Short tips shown next to the editor for the chosen language. */
export const ASSESSMENT_CODE_HINTS: Record<AssessmentLangKey, string> = {
  Javascript:
    "Fill in solve(...). Return the value; the template reads input and writes output for you.",
  Python:
    "Fill in solve(...). Return the value; the template reads stdin and prints it.",
  Java: "Fill in solve(...). main() reads input with Scanner and prints the result.",
  "C++": "Fill in solve(...). main() uses cin/cout for input and output.",
  C: "Fill in solve(...). main() uses scanf/printf for input and output.",
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

function getProblemStarterByLanguage(
  lang: string,
  starterCode?: Record<string, string>
): string | undefined {
  if (!starterCode) return undefined;
  const requested = (lang || "").trim();
  const requestedLc = requested.toLowerCase();
  const keys = Object.keys(starterCode);
  if (!keys.length) return undefined;

  const exact = starterCode[requested];
  if (typeof exact === "string" && exact.trim()) return exact;

  const exactCaseInsensitive = keys.find((k) => k.toLowerCase() === requestedLc);
  if (exactCaseInsensitive) {
    const v = starterCode[exactCaseInsensitive];
    if (typeof v === "string" && v.trim()) return v;
  }

  const canonical = (ASSESSMENT_LANG_KEYS as readonly string[]).find(
    (k) => k.toLowerCase() === requestedLc
  ) as AssessmentLangKey | undefined;
  if (canonical) {
    const aliases = LANGUAGE_ALIASES[canonical];
    const aliasHit = keys.find((k) => aliases.includes(k.toLowerCase()));
    if (aliasHit) {
      const v = starterCode[aliasHit];
      if (typeof v === "string" && v.trim()) return v;
    }
  } else {
    // If requested label isn't one of our canonical labels, still try alias table.
    for (const canonicalKey of ASSESSMENT_LANG_KEYS) {
      if (!LANGUAGE_ALIASES[canonicalKey].includes(requestedLc)) continue;
      const aliasHit = keys.find((k) => LANGUAGE_ALIASES[canonicalKey].includes(k.toLowerCase()));
      if (aliasHit) {
        const v = starterCode[aliasHit];
        if (typeof v === "string" && v.trim()) return v;
      }
    }
  }

  return undefined;
}

const SNIPPETS: Record<AssessmentLangKey, string> = {
  Javascript:
    STUDENT_CODE_ZONE_BANNER.Javascript +
    `function solve(a, b) {\n  // Example: add two numbers from the first line of input.\n  return a + b;\n}\n\nconst readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on('line', (line) => lines.push(line));\nrl.on('close', () => {\n  const parts = (lines[0] || '').trim().split(/\\s+/).filter(Boolean);\n  const a = parts.length > 0 ? Number(parts[0]) : 0;\n  const b = parts.length > 1 ? Number(parts[1]) : 0;\n  const result = solve(a, b);\n  process.stdout.write(String(result) + '\\n');\n});\n`,
  Python:
    `from __future__ import annotations\n\nimport sys\n\n` +
    STUDENT_CODE_ZONE_BANNER.Python +
    `def solve(a: int, b: int) -> int:\n    # Return the answer; main() will print it.\n    return a + b\n\n\ndef main() -> None:\n    parts = sys.stdin.readline().strip().split()\n    a = int(parts[0]) if len(parts) > 0 else 0\n    b = int(parts[1]) if len(parts) > 1 else 0\n    result = solve(a, b)\n    sys.stdout.write(str(result) + \"\\n\")\n\n\nif __name__ == '__main__':\n    main()\n`,
  Java:
    `import java.util.Scanner;\n\n` +
    STUDENT_CODE_ZONE_BANNER.Java +
    `public class Main {\n    static long solve(long a, long b) {\n        // Example starter: add two numbers.\n        return a + b;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.hasNextLong() ? sc.nextLong() : 0;\n        long b = sc.hasNextLong() ? sc.nextLong() : 0;\n        long result = solve(a, b);\n        System.out.println(result);\n        sc.close();\n    }\n}\n`,
  "C++":
    `#include <iostream>\nusing namespace std;\n\n` +
    STUDENT_CODE_ZONE_BANNER["C++"] +
    `long long solve(long long a, long long b) {\n    // Example: add two numbers read in main().\n    return a + b;\n}\n\nint main() {\n    long long a = 0, b = 0;\n    if (!(cin >> a >> b)) return 0;\n    long long result = solve(a, b);\n    cout << result << "\\n";\n    return 0;\n}\n`,
  C:
    `#include <stdio.h>\n\n` +
    STUDENT_CODE_ZONE_BANNER.C +
    `long long solve(long long a, long long b) {\n    /* Example: add two numbers from scanf in main(). */\n    return a + b;\n}\n\nint main(void) {\n    long long a = 0, b = 0;\n    if (scanf("%lld %lld", &a, &b) != 2) return 0;\n    long long result = solve(a, b);\n    printf("%lld\\n", result);\n    return 0;\n}\n`,
};

export function getDefaultStarterCode(lang: string, problem?: { starterCode?: Record<string, string> }): string {
  const key = (ASSESSMENT_LANG_KEYS as readonly string[]).includes(lang)
    ? (lang as AssessmentLangKey)
    : "Javascript";
  const fromProblem = getProblemStarterByLanguage(lang, problem?.starterCode);
  const raw =
    typeof fromProblem === "string" && fromProblem.trim() ? fromProblem : SNIPPETS[key] ?? SNIPPETS.Javascript;
  const stripped = stripLeetcodeMetaFromStarterCode(raw);
  return formatStudentStarterLayout(stripped, key);
}
