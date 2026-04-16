import type { CodingProblem } from "@/models/Test";
import { STUDENT_CODE_ZONE_BANNER } from "@/lib/assessment-code-starters";
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
 * Mirrors platform judge (stdin/stdout). No LeetCode URL / Blind 75 labels in code — those stay in the problem description only.
 */
export function blind75StarterCode(_title: string, _leetcodeUrl: string): Record<string, string> {
  void _title;
  void _leetcodeUrl;
  return {
    Javascript:
      STUDENT_CODE_ZONE_BANNER.Javascript +
      `function solve(a, b) {\n  // >>> START CODING HERE (template: sum of two numbers)\n  return a + b;\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const parts = (lines[0] || "").trim().split(/\\s+/).filter(Boolean);\n  const a = parts.length > 0 ? Number(parts[0]) : 0;\n  const b = parts.length > 1 ? Number(parts[1]) : 0;\n  const result = solve(a, b);\n  process.stdout.write(String(result) + "\\n");\n});\n`,
    Python:
      `import sys\n\n` +
      STUDENT_CODE_ZONE_BANNER.Python +
      `def solve(a: int, b: int):\n    # >>> START CODING HERE (template: sum of two numbers)\n    return a + b\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    line = sys.stdin.readline().strip()\n    parts = line.split()\n    a = int(parts[0]) if len(parts) > 0 else 0\n    b = int(parts[1]) if len(parts) > 1 else 0\n    result = solve(a, b)\n    sys.stdout.write(str(result) + "\\n")\n\nif __name__ == "__main__":\n    main()\n`,
    Java:
      `import java.util.Scanner;\n\n` +
      STUDENT_CODE_ZONE_BANNER.Java +
      `public class Main {\n    static long solve(long a, long b) {\n        // >>> START CODING HERE (template: sum of two numbers)\n        return a + b;\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.hasNextLong() ? sc.nextLong() : 0;\n        long b = sc.hasNextLong() ? sc.nextLong() : 0;\n        long result = solve(a, b);\n        System.out.println(result);\n        sc.close();\n    }\n}\n`,
    "C++":
      `#include <iostream>\nusing namespace std;\n\n` +
      STUDENT_CODE_ZONE_BANNER["C++"] +
      `long long solve(long long a, long long b) {\n    // >>> START CODING HERE (template: sum of two numbers)\n    return a + b;\n    // >>> END CODING HERE\n}\n\nint main() {\n    long long a = 0, b = 0;\n    if (!(cin >> a >> b)) return 0;\n    long long result = solve(a, b);\n    cout << result << "\\n";\n    return 0;\n}\n`,
    C:
      `#include <stdio.h>\n\n` +
      STUDENT_CODE_ZONE_BANNER.C +
      `long long solve(long long a, long long b) {\n    /* >>> START CODING HERE (template: sum of two numbers) */\n    return a + b;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    long long a = 0, b = 0;\n    if (scanf("%lld %lld", &a, &b) != 2) return 0;\n    long long result = solve(a, b);\n    printf("%lld\\n", result);\n    return 0;\n}\n`,
  };
}

export function buildBlind75CodingProblem(row: Blind75Row): CodingProblem {
  const title = `[Blind 75] ${row.title}`;
  const description =
    PLACEHOLDER_IO +
    `### ${row.title} (${row.section})\n\n` +
    `Use the statement shown in this test as the source of truth. ` +
    `The **starter code** below matches this platform’s function-harness judge — ` +
    `edit samples and hidden tests on the test so they match the exact I/O you teach for this problem.`;

  return {
    title,
    description,
    inputFormat: "One line: two integers A and B (template — replace when you wire a real problem).",
    outputFormat: "One line: single integer (template).",
    ...TRIVIAL_TESTS,
    marks: 10,
    starterCode: blind75StarterCode(row.title, ""),
  };
}
