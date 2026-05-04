import type { CodingProblem } from "@/models/Test";
import { STUDENT_CODE_ZONE_BANNER } from "@/lib/assessment-code-starters";
import type { Blind75Row } from "./blind75-slugs";
import { getInHouseBlind75Entry } from "./blind75-in-house-catalog";

/** Minimal stdin tests — only used if a slug is missing from the in-house catalog. */
const TRIVIAL_TESTS = {
  sampleTestCases: [{ input: "2 2\n", output: "4\n" }],
  hiddenTestCases: [
    { input: "5 7\n", output: "12\n" },
    { input: "0 0\n", output: "0\n" },
  ],
};

/**
 * Fallback multi-language boilerplate: read two ints from first line, print sum.
 */
export function blind75StarterCode(_title: string, _leetcodeUrl: string): Record<string, string> {
  void _title;
  void _leetcodeUrl;
  return {
    Javascript:
      STUDENT_CODE_ZONE_BANNER.Javascript +
      `function solve(a, b) {\n  // Template: add two numbers from the first line of input.\n  return a + b;\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const parts = (lines[0] || "").trim().split(/\\s+/).filter(Boolean);\n  const a = parts.length > 0 ? Number(parts[0]) : 0;\n  const b = parts.length > 1 ? Number(parts[1]) : 0;\n  const result = solve(a, b);\n  process.stdout.write(String(result) + "\\n");\n});\n`,
    Python:
      `from __future__ import annotations\n\nimport sys\n\n` +
      STUDENT_CODE_ZONE_BANNER.Python +
      `def solve(a: int, b: int) -> int:\n    # Template: sum two numbers from the first line of stdin.\n    return a + b\n\n\ndef main() -> None:\n    line = sys.stdin.readline().strip()\n    parts = line.split()\n    a = int(parts[0]) if len(parts) > 0 else 0\n    b = int(parts[1]) if len(parts) > 1 else 0\n    result = solve(a, b)\n    sys.stdout.write(str(result) + "\\n")\n\nif __name__ == "__main__":\n    main()\n`,
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
  const title = row.title;
  const fromCatalog = getInHouseBlind75Entry(row.slug);
  if (fromCatalog) {
    return {
      title,
      description: fromCatalog.description,
      inputFormat: fromCatalog.inputFormat,
      outputFormat: fromCatalog.outputFormat,
      sampleTestCases: fromCatalog.sampleTestCases,
      hiddenTestCases: fromCatalog.hiddenTestCases,
      marks: fromCatalog.marks,
      starterCode: fromCatalog.starterCode,
    };
  }

  const description = `${row.title}\n\nSolve this problem as specified in your assessment instructions.`;

  return {
    title,
    description,
    inputFormat: "",
    outputFormat: "",
    ...TRIVIAL_TESTS,
    marks: 10,
    starterCode: blind75StarterCode(row.title, ""),
  };
}
