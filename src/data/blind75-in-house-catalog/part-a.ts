import { STUDENT_CODE_ZONE_BANNER } from "@/lib/assessment-code-starters";
import type { InHouseBlind75Entry } from "@/data/blind75-in-house-types";

const B = STUDENT_CODE_ZONE_BANNER;

/** Part A: BLIND_75 order, slugs two-sum … longest-common-subsequence */
export const BLIND75_IN_HOUSE_PART_A: Record<string, InHouseBlind75Entry> = {
  "two-sum": {
    description:
      "You are given an array of integers and a target value.\n\n" +
      "Return two different indices (0-based) whose values add up to the target. A valid answer always exists.",
    inputFormat:
      "Line 1: integers n and target.\nLine 2: n space-separated integers (the array).",
    outputFormat: "One line: two integers i and j separated by a space (both 0-based indices).",
    sampleTestCases: [{ input: "4 9\n2 7 11 15\n", output: "0 1\n" }],
    hiddenTestCases: [
      { input: "3 6\n3 2 4\n", output: "1 2\n" },
      { input: "2 100\n50 50\n", output: "0 1\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums, target) {\n  // >>> START CODING HERE\n  return [0, 1];\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const h = (lines[0] || "").trim().split(/\\s+/).map(Number);\n  const n = h[0] || 0;\n  const target = h[1] || 0;\n  const nums = (lines[1] || "").trim().split(/\\s+/).map(Number);\n  const [i, j] = solve(nums, target);\n  process.stdout.write(String(i) + " " + String(j) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(nums: list[int], target: int):\n    # >>> START CODING HERE\n    return [0, 1]\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    lines = sys.stdin.read().splitlines()\n    h = list(map(int, lines[0].split()))\n    n, target = h[0], h[1]\n    nums = list(map(int, lines[1].split()))\n    i, j = solve(nums, target)\n    sys.stdout.write(str(i) + " " + str(j) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static int[] solve(int[] nums, int target) {\n        // >>> START CODING HERE\n        return new int[] { 0, 1 };\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int target = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int[] ij = solve(nums, target);\n        System.out.println(ij[0] + " " + ij[1]);\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `vector<int> solve(vector<int>& nums, int target) {\n    // >>> START CODING HERE\n    return {0, 1};\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n, target;\n    if (!(cin >> n >> target)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    auto ij = solve(nums, target);\n    cout << ij[0] << " " << ij[1] << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n\n` +
        B.C +
        `void solve(int *nums, int n, int target, int *out_i, int *out_j) {\n    /* >>> START CODING HERE */\n    *out_i = 0; *out_j = 1;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    int n, target;\n    if (scanf("%d %d", &n, &target) != 2) return 0;\n    int *nums = (int *)malloc(sizeof(int) * (size_t)n);\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    int i, j;\n    solve(nums, n, target, &i, &j);\n    printf("%d %d\\n", i, j);\n    free(nums);\n    return 0;\n}\n`,
    },
  },

  "best-time-to-buy-and-sell-stock": {
    description:
      "You are given daily stock prices in order.\n\n" +
      "Choose one buy day and one later sell day to maximize profit. If no profit is possible, print 0.",
    inputFormat: "Line 1: integer n.\nLine 2: n space-separated non-negative integers (prices).",
    outputFormat: "One integer: the maximum profit.",
    sampleTestCases: [{ input: "6\n7 1 5 3 6 4\n", output: "5\n" }],
    hiddenTestCases: [
      { input: "5\n7 6 4 3 1\n", output: "0\n" },
      { input: "2\n1 2\n", output: "1\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(prices) {\n  // >>> START CODING HERE\n  return 0;\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const n = parseInt((lines[0] || "0").trim(), 10) || 0;\n  const prices = (lines[1] || "").trim().split(/\\s+/).map(Number);\n  process.stdout.write(String(solve(prices)) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(prices: list[int]) -> int:\n    # >>> START CODING HERE\n    return 0\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    lines = sys.stdin.read().splitlines()\n    nums = list(map(int, lines[1].split()))\n    sys.stdout.write(str(solve(nums)) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static long solve(int[] prices) {\n        // >>> START CODING HERE\n        return 0;\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] p = new int[n];\n        for (int i = 0; i < n; i++) p[i] = sc.nextInt();\n        System.out.println(solve(p));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `long long solve(vector<int>& prices) {\n    // >>> START CODING HERE\n    return 0;\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n;\n    cin >> n;\n    vector<int> p(n);\n    for (int i = 0; i < n; i++) cin >> p[i];\n    cout << solve(p) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n\n` +
        B.C +
        `long long solve(int *p, int n) {\n    /* >>> START CODING HERE */\n    return 0;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    int *p = (int *)malloc(sizeof(int) * (size_t)n);\n    for (int i = 0; i < n; i++) scanf("%d", &p[i]);\n    printf("%lld\\n", solve(p, n));\n    free(p);\n    return 0;\n}\n`,
    },
  },

  "contains-duplicate": {
    description:
      "You are given a list of integers.\n\n" +
      "Determine whether any value appears more than once.",
    inputFormat: "Line 1: integer n.\nLine 2: n space-separated integers.",
    outputFormat: 'Print YES if a duplicate exists, otherwise print NO.',
    sampleTestCases: [{ input: "4\n1 2 3 1\n", output: "YES\n" }],
    hiddenTestCases: [
      { input: "3\n1 2 3\n", output: "NO\n" },
      { input: "2\n5 5\n", output: "YES\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums) {\n  // >>> START CODING HERE\n  return "NO";\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const nums = (lines[1] || "").trim().split(/\\s+/).map(Number);\n  process.stdout.write(String(solve(nums)) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(nums: list[int]) -> str:\n    # >>> START CODING HERE\n    return "NO"\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    lines = sys.stdin.read().splitlines()\n    nums = list(map(int, lines[1].split()))\n    sys.stdout.write(solve(nums) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static String solve(int[] nums) {\n        // >>> START CODING HERE\n        return "NO";\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        System.out.println(solve(nums));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `string solve(vector<int>& nums) {\n    // >>> START CODING HERE\n    return "NO";\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cout << solve(nums) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n` +
        B.C +
        `void solve(int *nums, int n, char *out) {\n    /* >>> START CODING HERE */\n    strcpy(out, "NO");\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    int n;\n    scanf("%d", &n);\n    int *nums = (int *)malloc(sizeof(int) * (size_t)n);\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    char out[8];\n    solve(nums, n, out);\n    printf("%s\\n", out);\n    free(nums);\n    return 0;\n}\n`,
    },
  },

  "product-of-array-except-self": {
    description:
      "You are given an array of integers.\n\n" +
      "For each position, compute the product of all other elements. Do not use division in your solution.",
    inputFormat: "Line 1: integer n.\nLine 2: n space-separated integers.",
    outputFormat: "One line: n space-separated integers (the products).",
    sampleTestCases: [{ input: "4\n1 2 3 4\n", output: "24 12 8 6\n" }],
    hiddenTestCases: [
      { input: "2\n2 3\n", output: "3 2\n" },
      { input: "3\n0 1 2\n", output: "2 0 0\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums) {\n  // >>> START CODING HERE\n  return nums.map(() => 0);\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const nums = (lines[1] || "").trim().split(/\\s+/).map(Number);\n  const out = solve(nums);\n  process.stdout.write(out.join(" ") + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(nums: list[int]) -> list[int]:\n    # >>> START CODING HERE\n    return [0] * len(nums)\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    lines = sys.stdin.read().splitlines()\n    nums = list(map(int, lines[1].split()))\n    print(" ".join(str(x) for x in solve(nums)))\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static long[] solve(int[] nums) {\n        // >>> START CODING HERE\n        return new long[nums.length];\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        long[] out = solve(nums);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < out.length; i++) {\n            if (i > 0) sb.append(" ");\n            sb.append(out[i]);\n        }\n        System.out.println(sb.toString());\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `vector<long long> solve(vector<int>& nums) {\n    // >>> START CODING HERE\n    return vector<long long>(nums.size(), 0);\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    auto out = solve(nums);\n    for (size_t i = 0; i < out.size(); i++) {\n        if (i) cout << " ";\n        cout << out[i];\n    }\n    cout << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n\n` +
        B.C +
        `void solve(int *nums, int n, long long *out) {\n    /* >>> START CODING HERE */\n    for (int i = 0; i < n; i++) out[i] = 0;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    int n;\n    scanf("%d", &n);\n    int *nums = (int *)malloc(sizeof(int) * (size_t)n);\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    long long *out = (long long *)malloc(sizeof(long long) * (size_t)n);\n    solve(nums, n, out);\n    for (int i = 0; i < n; i++) {\n        if (i) printf(" ");\n        printf("%lld", out[i]);\n    }\n    printf("\\n");\n    free(nums);\n    free(out);\n    return 0;\n}\n`,
    },
  },

  "maximum-subarray": {
    description:
      "You are given a list of integers (which may include negatives).\n\n" +
      "Find the largest possible sum of a contiguous non-empty subarray.",
    inputFormat: "Line 1: integer n.\nLine 2: n space-separated integers.",
    outputFormat: "One integer: the maximum subarray sum.",
    sampleTestCases: [{ input: "9\n-2 1 -3 4 -1 2 1 -5 4\n", output: "6\n" }],
    hiddenTestCases: [
      { input: "1\n-1\n", output: "-1\n" },
      { input: "3\n5 4 -1\n", output: "9\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums) {\n  // >>> START CODING HERE\n  return 0;\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const nums = (lines[1] || "").trim().split(/\\s+/).map(Number);\n  process.stdout.write(String(solve(nums)) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(nums: list[int]) -> int:\n    # >>> START CODING HERE\n    return 0\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    lines = sys.stdin.read().splitlines()\n    nums = list(map(int, lines[1].split()))\n    sys.stdout.write(str(solve(nums)) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static long solve(int[] nums) {\n        // >>> START CODING HERE\n        return 0;\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        System.out.println(solve(nums));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `long long solve(vector<int>& nums) {\n    // >>> START CODING HERE\n    return 0;\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cout << solve(nums) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n\n` +
        B.C +
        `long long solve(int *nums, int n) {\n    /* >>> START CODING HERE */\n    return 0;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    int n;\n    scanf("%d", &n);\n    int *nums = (int *)malloc(sizeof(int) * (size_t)n);\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    printf("%lld\\n", solve(nums, n));\n    free(nums);\n    return 0;\n}\n`,
    },
  },

  "maximum-product-subarray": {
    description:
      "You are given an array of integers.\n\n" +
      "Find the maximum product of any contiguous non-empty subarray.",
    inputFormat: "Line 1: integer n.\nLine 2: n space-separated integers.",
    outputFormat: "One integer: the maximum product.",
    sampleTestCases: [{ input: "3\n2 3 -2\n", output: "6\n" }],
    hiddenTestCases: [
      { input: "1\n-2\n", output: "-2\n" },
      { input: "4\n2 3 -2 4\n", output: "48\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums) {\n  // >>> START CODING HERE\n  return 0;\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const nums = (lines[1] || "").trim().split(/\\s+/).map(Number);\n  process.stdout.write(String(solve(nums)) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(nums: list[int]) -> int:\n    # >>> START CODING HERE\n    return 0\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    lines = sys.stdin.read().splitlines()\n    nums = list(map(int, lines[1].split()))\n    sys.stdout.write(str(solve(nums)) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static long solve(int[] nums) {\n        // >>> START CODING HERE\n        return 0;\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        System.out.println(solve(nums));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `long long solve(vector<int>& nums) {\n    // >>> START CODING HERE\n    return 0;\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cout << solve(nums) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n\n` +
        B.C +
        `long long solve(int *nums, int n) {\n    /* >>> START CODING HERE */\n    return 0;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    int n;\n    scanf("%d", &n);\n    int *nums = (int *)malloc(sizeof(int) * (size_t)n);\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    printf("%lld\\n", solve(nums, n));\n    free(nums);\n    return 0;\n}\n`,
    },
  },

  "find-minimum-in-rotated-sorted-array": {
    description:
      "A sorted array was rotated at an unknown pivot. All values are distinct.\n\n" +
      "Return the minimum element.",
    inputFormat: "Line 1: integer n.\nLine 2: n space-separated distinct integers in rotated sorted order.",
    outputFormat: "One integer: the minimum value.",
    sampleTestCases: [{ input: "5\n3 4 5 1 2\n", output: "1\n" }],
    hiddenTestCases: [
      { input: "1\n1\n", output: "1\n" },
      { input: "7\n4 5 6 7 0 1 2\n", output: "0\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums) {\n  // >>> START CODING HERE\n  return nums[0];\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const nums = (lines[1] || "").trim().split(/\\s+/).map(Number);\n  process.stdout.write(String(solve(nums)) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(nums: list[int]) -> int:\n    # >>> START CODING HERE\n    return nums[0]\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    lines = sys.stdin.read().splitlines()\n    nums = list(map(int, lines[1].split()))\n    sys.stdout.write(str(solve(nums)) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static int solve(int[] nums) {\n        // >>> START CODING HERE\n        return nums[0];\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        System.out.println(solve(nums));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `int solve(vector<int>& nums) {\n    // >>> START CODING HERE\n    return nums[0];\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cout << solve(nums) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n\n` +
        B.C +
        `int solve(int *nums, int n) {\n    /* >>> START CODING HERE */\n    return nums[0];\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    int n;\n    scanf("%d", &n);\n    int *nums = (int *)malloc(sizeof(int) * (size_t)n);\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    printf("%d\\n", solve(nums, n));\n    free(nums);\n    return 0;\n}\n`,
    },
  },

  "search-in-rotated-sorted-array": {
    description:
      "A sorted array of distinct integers was rotated at an unknown pivot.\n\n" +
      "Return the index of target, or -1 if it does not exist.",
    inputFormat:
      "Line 1: integers n and target.\nLine 2: n space-separated integers (rotated sorted array).",
    outputFormat: "One integer: the 0-based index of target, or -1.",
    sampleTestCases: [{ input: "5 0\n4 5 6 7 0 1 2\n", output: "4\n" }],
    hiddenTestCases: [
      { input: "5 3\n4 5 6 7 0 1 2\n", output: "-1\n" },
      { input: "1 1\n1\n", output: "0\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums, target) {\n  // >>> START CODING HERE\n  return -1;\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const h = (lines[0] || "").trim().split(/\\s+/).map(Number);\n  const n = h[0] || 0;\n  const target = h[1] || 0;\n  const nums = (lines[1] || "").trim().split(/\\s+/).map(Number);\n  process.stdout.write(String(solve(nums, target)) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(nums: list[int], target: int) -> int:\n    # >>> START CODING HERE\n    return -1\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    lines = sys.stdin.read().splitlines()\n    h = list(map(int, lines[0].split()))\n    n, target = h[0], h[1]\n    nums = list(map(int, lines[1].split()))\n    sys.stdout.write(str(solve(nums, target)) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static int solve(int[] nums, int target) {\n        // >>> START CODING HERE\n        return -1;\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int target = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        System.out.println(solve(nums, target));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `int solve(vector<int>& nums, int target) {\n    // >>> START CODING HERE\n    return -1;\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n, target;\n    cin >> n >> target;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cout << solve(nums, target) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n\n` +
        B.C +
        `int solve(int *nums, int n, int target) {\n    /* >>> START CODING HERE */\n    return -1;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    int n, target;\n    if (scanf("%d %d", &n, &target) != 2) return 0;\n    int *nums = (int *)malloc(sizeof(int) * (size_t)n);\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    printf("%d\\n", solve(nums, n, target));\n    free(nums);\n    return 0;\n}\n`,
    },
  },

  "3sum": {
    description:
      "You are given an array of integers.\n\n" +
      "Count how many unordered triplets of distinct indices (i, j, k) satisfy nums[i] + nums[j] + nums[k] = 0.",
    inputFormat: "Line 1: integer n.\nLine 2: n space-separated integers.",
    outputFormat: "One integer: the number of valid triplets.",
    sampleTestCases: [{ input: "5\n-1 0 1 2 -1\n", output: "2\n" }],
    hiddenTestCases: [
      { input: "3\n0 0 0\n", output: "1\n" },
      { input: "4\n1 2 -3 0\n", output: "1\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums) {\n  // >>> START CODING HERE\n  return 0;\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const nums = (lines[1] || "").trim().split(/\\s+/).map(Number);\n  process.stdout.write(String(solve(nums)) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(nums: list[int]) -> int:\n    # >>> START CODING HERE\n    return 0\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    lines = sys.stdin.read().splitlines()\n    nums = list(map(int, lines[1].split()))\n    sys.stdout.write(str(solve(nums)) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static long solve(int[] nums) {\n        // >>> START CODING HERE\n        return 0;\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        System.out.println(solve(nums));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `long long solve(vector<int>& nums) {\n    // >>> START CODING HERE\n    return 0;\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cout << solve(nums) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n\n` +
        B.C +
        `long long solve(int *nums, int n) {\n    /* >>> START CODING HERE */\n    return 0;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    int n;\n    scanf("%d", &n);\n    int *nums = (int *)malloc(sizeof(int) * (size_t)n);\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    printf("%lld\\n", solve(nums, n));\n    free(nums);\n    return 0;\n}\n`,
    },
  },

  "container-with-most-water": {
    description:
      "You are given n non-negative integers representing the height of vertical lines.\n\n" +
      "Pick two lines together with the x-axis to form a container. Maximize the water volume.",
    inputFormat: "Line 1: integer n.\nLine 2: n space-separated non-negative integers (heights).",
    outputFormat: "One integer: the maximum area (water volume).",
    sampleTestCases: [{ input: "9\n1 8 6 2 5 4 8 3 7\n", output: "49\n" }],
    hiddenTestCases: [
      { input: "2\n1 1\n", output: "1\n" },
      { input: "6\n2 3 4 5 18 17\n", output: "17\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(heights) {\n  // >>> START CODING HERE\n  return 0;\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const heights = (lines[1] || "").trim().split(/\\s+/).map(Number);\n  process.stdout.write(String(solve(heights)) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(heights: list[int]) -> int:\n    # >>> START CODING HERE\n    return 0\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    lines = sys.stdin.read().splitlines()\n    heights = list(map(int, lines[1].split()))\n    sys.stdout.write(str(solve(heights)) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static long solve(int[] heights) {\n        // >>> START CODING HERE\n        return 0;\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] h = new int[n];\n        for (int i = 0; i < n; i++) h[i] = sc.nextInt();\n        System.out.println(solve(h));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `long long solve(vector<int>& heights) {\n    // >>> START CODING HERE\n    return 0;\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n;\n    cin >> n;\n    vector<int> h(n);\n    for (int i = 0; i < n; i++) cin >> h[i];\n    cout << solve(h) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n\n` +
        B.C +
        `long long solve(int *h, int n) {\n    /* >>> START CODING HERE */\n    return 0;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    int n;\n    scanf("%d", &n);\n    int *h = (int *)malloc(sizeof(int) * (size_t)n);\n    for (int i = 0; i < n; i++) scanf("%d", &h[i]);\n    printf("%lld\\n", solve(h, n));\n    free(h);\n    return 0;\n}\n`,
    },
  },

  "sum-of-two-integers": {
    description:
      "Read two signed integers and output their sum.\n\n" +
      "Implement the addition in your solve function; the harness prints the final result.",
    inputFormat: "Line 1: two integers a and b separated by a space.",
    outputFormat: "One integer: a + b.",
    sampleTestCases: [{ input: "3 5\n", output: "8\n" }],
    hiddenTestCases: [
      { input: "-4 9\n", output: "5\n" },
      { input: "0 0\n", output: "0\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(a, b) {\n  // >>> START CODING HERE\n  return a + b;\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const parts = (lines[0] || "").trim().split(/\\s+/).filter(Boolean);\n  const a = parts.length > 0 ? Number(parts[0]) : 0;\n  const b = parts.length > 1 ? Number(parts[1]) : 0;\n  process.stdout.write(String(solve(a, b)) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(a: int, b: int) -> int:\n    # >>> START CODING HERE\n    return a + b\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    a, b = map(int, sys.stdin.readline().split())\n    sys.stdout.write(str(solve(a, b)) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static long solve(long a, long b) {\n        // >>> START CODING HERE\n        return a + b;\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.nextLong();\n        long b = sc.nextLong();\n        System.out.println(solve(a, b));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `long long solve(long long a, long long b) {\n    // >>> START CODING HERE\n    return a + b;\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long a, b;\n    cin >> a >> b;\n    cout << solve(a, b) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n\n` +
        B.C +
        `long long solve(long long a, long long b) {\n    /* >>> START CODING HERE */\n    return a + b;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    long long a, b;\n    if (scanf("%lld %lld", &a, &b) != 2) return 0;\n    printf("%lld\\n", solve(a, b));\n    return 0;\n}\n`,
    },
  },

  "number-of-1-bits": {
    description:
      "You are given a non-negative integer n.\n\n" +
      "Count how many bits are equal to 1 in its binary representation.",
    inputFormat: "Line 1: one non-negative integer n.",
    outputFormat: "One integer: the popcount (Hamming weight).",
    sampleTestCases: [{ input: "11\n", output: "3\n" }],
    hiddenTestCases: [
      { input: "0\n", output: "0\n" },
      { input: "15\n", output: "4\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(n) {\n  // >>> START CODING HERE\n  return 0;\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const n = parseInt((lines[0] || "0").trim(), 10) || 0;\n  process.stdout.write(String(solve(n)) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(n: int) -> int:\n    # >>> START CODING HERE\n    return 0\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    n = int(sys.stdin.readline())\n    sys.stdout.write(str(solve(n)) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static int solve(long n) {\n        // >>> START CODING HERE\n        return 0;\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        System.out.println(solve(n));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `int solve(unsigned long long n) {\n    // >>> START CODING HERE\n    return 0;\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    unsigned long long n;\n    cin >> n;\n    cout << solve(n) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n\n` +
        B.C +
        `int solve(unsigned long long n) {\n    /* >>> START CODING HERE */\n    return 0;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    unsigned long long n;\n    if (scanf("%llu", &n) != 1) return 0;\n    printf("%d\\n", solve(n));\n    return 0;\n}\n`,
    },
  },

  "counting-bits": {
    description:
      "For every integer k from 0 to n inclusive, count how many 1-bits k has in binary.\n\n" +
      "Print all counts in order, space-separated.",
    inputFormat: "Line 1: a non-negative integer n.",
    outputFormat: "One line: (n+1) space-separated integers.",
    sampleTestCases: [{ input: "5\n", output: "0 1 1 2 1 2\n" }],
    hiddenTestCases: [
      { input: "0\n", output: "0\n" },
      { input: "3\n", output: "0 1 1 2\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(n) {\n  // >>> START CODING HERE\n  return Array.from({ length: n + 1 }, () => 0);\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const n = parseInt((lines[0] || "0").trim(), 10) || 0;\n  const out = solve(n);\n  process.stdout.write(out.join(" ") + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(n: int) -> list[int]:\n    # >>> START CODING HERE\n    return [0] * (n + 1)\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    n = int(sys.stdin.readline())\n    print(" ".join(str(x) for x in solve(n)))\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static int[] solve(int n) {\n        // >>> START CODING HERE\n        return new int[n + 1];\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] out = solve(n);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < out.length; i++) {\n            if (i > 0) sb.append(" ");\n            sb.append(out[i]);\n        }\n        System.out.println(sb.toString());\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `vector<int> solve(int n) {\n    // >>> START CODING HERE\n    return vector<int>(n + 1, 0);\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n;\n    cin >> n;\n    auto out = solve(n);\n    for (int i = 0; i <= n; i++) {\n        if (i) cout << " ";\n        cout << out[i];\n    }\n    cout << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n\n` +
        B.C +
        `void solve(int n, int *out) {\n    /* >>> START CODING HERE */\n    for (int i = 0; i <= n; i++) out[i] = 0;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    int *out = (int *)malloc(sizeof(int) * (size_t)(n + 1));\n    solve(n, out);\n    for (int i = 0; i <= n; i++) {\n        if (i) printf(" ");\n        printf("%d", out[i]);\n    }\n    printf("\\n");\n    free(out);\n    return 0;\n}\n`,
    },
  },

  "missing-number": {
    description:
      "You are given n distinct integers from the set {0, 1, …, n} with exactly one value missing.\n\n" +
      "Find the missing number.",
    inputFormat: "Line 1: integer n.\nLine 2: n space-separated integers (the present numbers).",
    outputFormat: "One integer: the missing value.",
    sampleTestCases: [{ input: "4\n3 0 1 4\n", output: "2\n" }],
    hiddenTestCases: [
      { input: "1\n0\n", output: "1\n" },
      { input: "3\n0 1 3\n", output: "2\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums) {\n  // >>> START CODING HERE\n  return 0;\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const nums = (lines[1] || "").trim().split(/\\s+/).map(Number);\n  process.stdout.write(String(solve(nums)) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(nums: list[int]) -> int:\n    # >>> START CODING HERE\n    return 0\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    lines = sys.stdin.read().splitlines()\n    nums = list(map(int, lines[1].split()))\n    sys.stdout.write(str(solve(nums)) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static int solve(int[] nums) {\n        // >>> START CODING HERE\n        return 0;\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        System.out.println(solve(nums));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `int solve(vector<int>& nums) {\n    // >>> START CODING HERE\n    return 0;\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cout << solve(nums) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n\n` +
        B.C +
        `int solve(int *nums, int n) {\n    /* >>> START CODING HERE */\n    return 0;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    int n;\n    scanf("%d", &n);\n    int *nums = (int *)malloc(sizeof(int) * (size_t)n);\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    printf("%d\\n", solve(nums, n));\n    free(nums);\n    return 0;\n}\n`,
    },
  },

  "reverse-bits": {
    description:
      "Treat the input as an unsigned 32-bit integer.\n\n" +
      "Reverse its bits (bit 0 becomes bit 31, etc.) and print the resulting unsigned 32-bit value.",
    inputFormat: "Line 1: one non-negative integer n (fits in 32 bits).",
    outputFormat: "One integer: the reversed-bit value (unsigned 32-bit).",
    sampleTestCases: [{ input: "43261596\n", output: "964176192\n" }],
    hiddenTestCases: [
      { input: "0\n", output: "0\n" },
      { input: "1\n", output: "2147483648\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(n) {\n  // >>> START CODING HERE\n  return 0;\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const n = parseInt((lines[0] || "0").trim(), 10) || 0;\n  process.stdout.write(String(solve(n)) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(n: int) -> int:\n    # >>> START CODING HERE\n    return 0\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    n = int(sys.stdin.readline())\n    sys.stdout.write(str(solve(n)) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static long solve(long n) {\n        // >>> START CODING HERE\n        return 0;\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        System.out.println(solve(n));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `unsigned int solve(unsigned int n) {\n    // >>> START CODING HERE\n    return 0;\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    unsigned int n;\n    cin >> n;\n    cout << solve(n) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <stdint.h>\n\n` +
        B.C +
        `uint32_t solve(uint32_t n) {\n    /* >>> START CODING HERE */\n    return 0;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    uint32_t n;\n    if (scanf("%u", &n) != 1) return 0;\n    printf("%u\\n", solve(n));\n    return 0;\n}\n`,
    },
  },

  "climbing-stairs": {
    description:
      "You can climb 1 or 2 steps at a time.\n\n" +
      "Count how many distinct ways exist to reach the top of a staircase with n steps (order matters).",
    inputFormat: "Line 1: integer n (number of steps).",
    outputFormat: "One integer: number of distinct ways.",
    sampleTestCases: [{ input: "5\n", output: "8\n" }],
    hiddenTestCases: [
      { input: "1\n", output: "1\n" },
      { input: "3\n", output: "3\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(n) {\n  // >>> START CODING HERE\n  return 0;\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const n = parseInt((lines[0] || "0").trim(), 10) || 0;\n  process.stdout.write(String(solve(n)) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(n: int) -> int:\n    # >>> START CODING HERE\n    return 0\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    n = int(sys.stdin.readline())\n    sys.stdout.write(str(solve(n)) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static long solve(int n) {\n        // >>> START CODING HERE\n        return 0;\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(solve(n));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `long long solve(int n) {\n    // >>> START CODING HERE\n    return 0;\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n;\n    cin >> n;\n    cout << solve(n) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n\n` +
        B.C +
        `long long solve(int n) {\n    /* >>> START CODING HERE */\n    return 0;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    printf("%lld\\n", solve(n));\n    return 0;\n}\n`,
    },
  },

  "coin-change": {
    description:
      "You are given coin denominations (positive integers) and a target amount.\n\n" +
      "Return the minimum number of coins needed to make the amount. If it is impossible, print -1.",
    inputFormat:
      "Line 1: integer amount.\nLine 2: integer k (number of coin types).\nLine 3: k space-separated coin values.",
    outputFormat: "One integer: minimum coins, or -1.",
    sampleTestCases: [{ input: "11\n3\n1 2 5\n", output: "3\n" }],
    hiddenTestCases: [
      { input: "3\n1\n2\n", output: "-1\n" },
      { input: "7\n1\n1\n", output: "7\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(amount, coins) {\n  // >>> START CODING HERE\n  return -1;\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const amount = parseInt((lines[0] || "0").trim(), 10) || 0;\n  const coins = (lines[2] || "").trim().split(/\\s+/).map(Number);\n  process.stdout.write(String(solve(amount, coins)) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(amount: int, coins: list[int]) -> int:\n    # >>> START CODING HERE\n    return -1\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    lines = sys.stdin.read().splitlines()\n    amount = int(lines[0])\n    coins = list(map(int, lines[2].split()))\n    sys.stdout.write(str(solve(amount, coins)) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static int solve(int amount, int[] coins) {\n        // >>> START CODING HERE\n        return -1;\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int amount = sc.nextInt();\n        int k = sc.nextInt();\n        int[] coins = new int[k];\n        for (int i = 0; i < k; i++) coins[i] = sc.nextInt();\n        System.out.println(solve(amount, coins));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `int solve(int amount, vector<int>& coins) {\n    // >>> START CODING HERE\n    return -1;\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int amount, k;\n    cin >> amount >> k;\n    vector<int> coins(k);\n    for (int i = 0; i < k; i++) cin >> coins[i];\n    cout << solve(amount, coins) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n\n` +
        B.C +
        `int solve(int amount, int *coins, int k) {\n    /* >>> START CODING HERE */\n    return -1;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    int amount, k;\n    if (scanf("%d %d", &amount, &k) != 2) return 0;\n    int *coins = (int *)malloc(sizeof(int) * (size_t)k);\n    for (int i = 0; i < k; i++) scanf("%d", &coins[i]);\n    printf("%d\\n", solve(amount, coins, k));\n    free(coins);\n    return 0;\n}\n`,
    },
  },

  "longest-increasing-subsequence": {
    description:
      "You are given a sequence of integers.\n\n" +
      "Find the length of the longest strictly increasing subsequence (not necessarily contiguous).",
    inputFormat: "Line 1: integer n.\nLine 2: n space-separated integers.",
    outputFormat: "One integer: the LIS length.",
    sampleTestCases: [{ input: "8\n10 9 2 5 3 7 101 18\n", output: "4\n" }],
    hiddenTestCases: [
      { input: "1\n1\n", output: "1\n" },
      { input: "4\n1 2 2 3\n", output: "3\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums) {\n  // >>> START CODING HERE\n  return 0;\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const nums = (lines[1] || "").trim().split(/\\s+/).map(Number);\n  process.stdout.write(String(solve(nums)) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(nums: list[int]) -> int:\n    # >>> START CODING HERE\n    return 0\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    lines = sys.stdin.read().splitlines()\n    nums = list(map(int, lines[1].split()))\n    sys.stdout.write(str(solve(nums)) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static int solve(int[] nums) {\n        // >>> START CODING HERE\n        return 0;\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        System.out.println(solve(nums));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `int solve(vector<int>& nums) {\n    // >>> START CODING HERE\n    return 0;\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cout << solve(nums) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n\n` +
        B.C +
        `int solve(int *nums, int n) {\n    /* >>> START CODING HERE */\n    return 0;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    int n;\n    scanf("%d", &n);\n    int *nums = (int *)malloc(sizeof(int) * (size_t)n);\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    printf("%d\\n", solve(nums, n));\n    free(nums);\n    return 0;\n}\n`,
    },
  },

  "longest-common-subsequence": {
    description:
      "You are given two strings s and t (uppercase/lowercase letters only).\n\n" +
      "Return the length of their longest common subsequence.",
    inputFormat: "Line 1: string s.\nLine 2: string t.",
    outputFormat: "One integer: the LCS length.",
    sampleTestCases: [{ input: "abcde\nace\n", output: "3\n" }],
    hiddenTestCases: [
      { input: "abc\nabc\n", output: "3\n" },
      { input: "a\nz\n", output: "0\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(s, t) {\n  // >>> START CODING HERE\n  return 0;\n  // >>> END CODING HERE\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const s = (lines[0] || "").trim();\n  const t = (lines[1] || "").trim();\n  process.stdout.write(String(solve(s, t)) + "\\n");\n});\n`,
      Python:
        `from __future__ import annotations\n\nimport sys\n\n` +
        B.Python +
        `def solve(s: str, t: str) -> int:\n    # >>> START CODING HERE\n    return 0\n    # >>> END CODING HERE\n\n\ndef main() -> None:\n    lines = sys.stdin.read().splitlines()\n    s, t = lines[0].strip(), lines[1].strip()\n    sys.stdout.write(str(solve(s, t)) + "\\n")\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.Scanner;\n\n` +
        B.Java +
        `public class Main {\n    static int solve(String s, String t) {\n        // >>> START CODING HERE\n        return 0;\n        // >>> END CODING HERE\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        String t = sc.nextLine();\n        System.out.println(solve(s, t));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `int solve(string s, string t) {\n    // >>> START CODING HERE\n    return 0;\n    // >>> END CODING HERE\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    string s, t;\n    getline(cin, s);\n    getline(cin, t);\n    cout << solve(s, t) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <string.h>\n\n` +
        B.C +
        `int solve(const char *s, const char *t) {\n    /* >>> START CODING HERE */\n    return 0;\n    /* >>> END CODING HERE */\n}\n\nint main(void) {\n    char s[2005], t[2005];\n    if (!fgets(s, sizeof(s), stdin)) return 0;\n    if (!fgets(t, sizeof(t), stdin)) return 0;\n    s[strcspn(s, "\\n")] = 0;\n    t[strcspn(t, "\\n")] = 0;\n    printf("%d\\n", solve(s, t));\n    return 0;\n}\n`,
    },
  },
};
