import type { CodingProblem } from "@/models/Test";
import type { Blind75Row } from "./blind75-slugs";

const PLACEHOLDER_IO = `**Platform template (replace before grading students):** Read two integers from the first line of stdin (space-separated) and print their sum on one line. This lets auto-grading run; it is **not** the real LeetCode I/O for this topic — adapt samples and hidden tests to match your course copy of the problem.

---

`;

/** Minimal stdin tests so seeded rows pass validation (admin should replace for real exams). */
const TRIVIAL_TESTS = {
  sampleTestCases: [{ input: "2 2\n", output: "4\n" }],
  hiddenTestCases: [
    { input: "5 7\n", output: "12\n" },
    { input: "0 0\n", output: "0\n" },
  ],
};

/**
 * Multi-language boilerplate: read two ints from first line, print sum.
 * Mirrors platform judge (stdin/stdout). Header points to official LeetCode statement.
 */
export function blind75StarterCode(title: string, leetcodeUrl: string): Record<string, string> {
  const bannerJs = `/**
 * Blind 75 / DSA: ${title}
 * Full problem: ${leetcodeUrl}
 * Starter reads two integers (stdin) — replace logic + I/O for your assessment version.
 */\n`;
  const bannerPy = `"""Blind 75: ${title}
Full statement: ${leetcodeUrl}
Replace solver + I/O for your assessment.
"""\n`;
  const bannerJava = `/**
 * Blind 75: ${title}
 * ${leetcodeUrl}
 */\n`;

  return {
    Javascript:
      bannerJs +
      `const readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const [a, b] = lines[0].trim().split(/\\s+/).map(Number);\n  console.log(String((a || 0) + (b || 0)));\n});\n`,
    Python:
      bannerPy +
      `import sys\n\ndef main() -> None:\n    line = sys.stdin.readline().strip()\n    parts = line.split()\n    a = int(parts[0]) if len(parts) > 0 else 0\n    b = int(parts[1]) if len(parts) > 1 else 0\n    print(a + b)\n\nif __name__ == "__main__":\n    main()\n`,
    Java:
      bannerJava +
      `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.hasNextLong() ? sc.nextLong() : 0;\n        long b = sc.hasNextLong() ? sc.nextLong() : 0;\n        System.out.println(a + b);\n        sc.close();\n    }\n}\n`,
    "C++": `#include <iostream>\nusing namespace std;\n// ${title}\n// ${leetcodeUrl}\nint main() {\n    long long a = 0, b = 0;\n    if (cin >> a >> b) { cout << (a + b) << "\\n"; }\n    return 0;\n}\n`,
    C: `#include <stdio.h>\n/* ${title} — ${leetcodeUrl} */\nint main(void) {\n    long long a = 0, b = 0;\n    if (scanf("%lld %lld", &a, &b) == 2) printf("%lld\\n", a + b);\n    return 0;\n}\n`,
  };
}

export function buildBlind75CodingProblem(row: Blind75Row): CodingProblem {
  const leetcodeUrl = `https://leetcode.com/problems/${row.slug}/`;
  const title = `[Blind 75] ${row.title}`;
  const description =
    PLACEHOLDER_IO +
    `### ${row.title} (${row.section})\n\n` +
    `**Official problem (statement, constraints, examples):** ${leetcodeUrl}\n\n` +
    `MADAlgos stores a short neutral summary only; open the link for the full spec. ` +
    `The **starter code** below matches this platform’s stdin/stdout judge — **edit samples and hidden tests** on the test so they match the I/O you teach for this problem.`;

  return {
    title,
    description,
    inputFormat: "One line: two integers A and B (template — replace when you wire a real problem).",
    outputFormat: "One line: single integer (template).",
    ...TRIVIAL_TESTS,
    marks: 10,
    starterCode: blind75StarterCode(row.title, leetcodeUrl),
  };
}
