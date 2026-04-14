export const ASSESSMENT_LANG_KEYS = ["Javascript", "Python", "Java", "C++", "C"] as const;
export type AssessmentLangKey = (typeof ASSESSMENT_LANG_KEYS)[number];

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

const SNIPPETS: Record<AssessmentLangKey, string> = {
  Javascript: `// Read stdin, write stdout (adapt to problem I/O)\nconst readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on('line', (line) => lines.push(line));\nrl.on('close', () => {\n  // TODO: solve using lines\n  console.log('');\n});\n`,
  Python: `import sys\n\ndef main():\n    data = sys.stdin.read().splitlines()\n    # TODO: solve using data\n    print('')\n\nif __name__ == '__main__':\n    main()\n`,
  Java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: read and solve\n        System.out.println("");\n        sc.close();\n    }\n}\n`,
  "C++": `#include <iostream>\nusing namespace std;\n\nint main() {\n    // TODO: read stdin, write answer\n    cout << "" << endl;\n    return 0;\n}\n`,
  C: `#include <stdio.h>\n\nint main(void) {\n    /* TODO: read stdin, write answer */\n    printf("\\n");\n    return 0;\n}\n`,
};

export function getDefaultStarterCode(lang: string, problem?: { starterCode?: Record<string, string> }): string {
  const key = lang as AssessmentLangKey;
  const fromProblem = problem?.starterCode?.[lang] ?? problem?.starterCode?.[key];
  if (typeof fromProblem === "string" && fromProblem.trim()) return fromProblem;
  return SNIPPETS[key] ?? SNIPPETS.Javascript;
}
