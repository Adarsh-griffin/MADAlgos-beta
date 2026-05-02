/**
 * Coding problems + starters for `microsoft-hiring-practice` (seed-public-demo-tests.mjs).
 * Reuses identical I/O starters from google pack for problems 2–5; 1 and 6 use `sizes` / `depths` naming.
 */
import {
  starterGoogleBlueprintBrackets,
  starterGoogleHospitalMerge,
  starterGoogleLeaderboardK,
  starterGoogleSignalWindow,
} from "./google-hiring-practice-coding.mjs";

export const microsoftHiringAssessmentDelivery = {
  mcqPerAttempt: 5,
  codingPerAttempt: 6,
  easyDurationMinutes: 95,
  mediumDurationMinutes: 110,
  hardDurationMinutes: 130,
};

export const starterMicrosoftFileDedup = {
  Python: `import sys

def solve(sizes, target):
    # Write your logic here
    return [0, 1]

def main():
    data = sys.stdin.read().split()
    n, target = int(data[0]), int(data[1])
    sizes = list(map(int, data[2:2+n]))
    result = solve(sizes, target)
    print(result[0], result[1])

main()
`,
  Javascript: `function solve(sizes, target) {
  return [0, 1];
}

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
  const data = (lines.join("\\n") || "").trim().split(/\\s+/).filter(Boolean).map(Number);
  const n = data[0] || 0;
  const target = data[1] || 0;
  const sizes = data.slice(2, 2 + n);
  const r = solve(sizes, target);
  process.stdout.write(String(r[0]) + " " + String(r[1]) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static int[] solve(int[] sizes, int target) {
        return new int[] { 0, 1 };
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] sizes = new int[n];
        for (int i = 0; i < n; i++) sizes[i] = sc.nextInt();
        int[] r = solve(sizes, target);
        System.out.println(r[0] + " " + r[1]);
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

pair<int,int> solve(vector<int>& sizes, int target) {
    return {0, 1};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, target;
    cin >> n >> target;
    vector<int> sizes(n);
    for (int i = 0; i < n; i++) cin >> sizes[i];
    auto r = solve(sizes, target);
    cout << r.first << " " << r.second << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <stdlib.h>

void solve(int *sizes, int n, int target, int *out_i, int *out_j) {
    *out_i = 0;
    *out_j = 1;
}

int main(void) {
    int n, target;
    if (scanf("%d %d", &n, &target) != 2) return 0;
    int *sizes = (int *)calloc((size_t)n, sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &sizes[i]);
    int i, j;
    solve(sizes, n, target, &i, &j);
    printf("%d %d\\n", i, j);
    free(sizes);
    return 0;
}
`,
};

export const starterMicrosoftBackpressure = {
  Python: `import sys

def solve(depths):
    # Write your logic here
    return 0

def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    depths = list(map(int, data[1:1+n]))
    print(solve(depths))

main()
`,
  Javascript: `function solve(depths) {
  return 0;
}

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
  const data = lines.join("\\n").trim().split(/\\s+/).map(Number);
  const n = data[0];
  const depths = data.slice(1, 1 + n);
  process.stdout.write(String(solve(depths)) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static long solve(int[] depths) {
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] depths = new int[n];
        for (int i = 0; i < n; i++) depths[i] = sc.nextInt();
        System.out.println(solve(depths));
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

long long solve(vector<int>& depths) {
    return 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> d(n);
    for (int i = 0; i < n; i++) cin >> d[i];
    cout << solve(d) << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <stdlib.h>

long long solve(int *d, int n) {
    return 0;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *d = (int *)calloc((size_t)n, sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &d[i]);
    printf("%lld\\n", solve(d, n));
    free(d);
    return 0;
}
`,
};

const desc1 = `1. 🗂️ File Deduplication Finder
(Two Sum – Easy)

🧾 Problem
Microsoft OneDrive's storage optimiser scans uploaded files. Each file has a size in KB. Find two files whose combined size exactly matches a given sync buffer limit — so they can be batched together in one upload slot.

📥 Input

Line 1: n target
Line 2: n space-separated file sizes

📤 Output

Two indices i j in increasing order

🧪 Sample Test Cases
Case 1
Input:
4 9
2 7 11 15

Output: 0 1
Case 2
Input:
3 6
3 2 4

Output: 1 2
Case 3
Input:
2 6
3 3

Output: 0 1

⚠️ Edge Cases

Same file size appearing twice
Negative sizes (credits/offsets)
Very large file lists

💡 Hints

Hint 1 — Check every pair. Works, but too slow for a large cloud storage system.
Hint 2 — Can you remember previously seen file sizes to avoid re-scanning?
Hint 3 — For each size x, check if target - x was already stored.`;

const desc2 = `2. 🖥️ IDE Syntax Validator
(Valid Parentheses – Easy)

🧾 Problem
Visual Studio's real-time syntax checker validates code as developers type. One key check: are all brackets, braces, and parentheses correctly matched and closed? A single mismatch should flag the file as syntax error. Build this core validation engine.

📥 Input

Single line string s containing only (, ), {, }, [, ]

📤 Output

YES if valid, NO otherwise

🧪 Sample Test Cases
Case 1
Input:  ()[]{}
Output: YES
Case 2
Input:  (]
Output: NO
Case 3
Input:  ([{}])
Output: YES

⚠️ Edge Cases

Empty string
Only opening brackets, none closed
Correct types but wrong nesting e.g. ([)]

💡 Hints

Hint 1 — Every opening bracket must be closed in exact reverse order.
Hint 2 — Think last-opened, first-closed. Which data structure mirrors this?
Hint 3 — Use a stack. Push on open, pop and match on close.`;

const desc3 = `3. 📊 Teams Chat Unique Streak
(Longest Substring Without Repeating Characters – Medium)

🧾 Problem
Microsoft Teams logs reaction sequences on messages as a string of emoji codes. A product analyst wants to find the longest streak of unique reactions in a row — no repeated emoji — to measure engagement diversity per message thread.

📥 Input

Single line string s — the reaction sequence

📤 Output

Single integer — length of the longest all-unique streak

🧪 Sample Test Cases
Case 1
Input:  abcabcbb
Output: 3
Case 2
Input:  bbbbb
Output: 1
Case 3
Input:  pwwkew
Output: 3

⚠️ Edge Cases

All reactions identical
Single reaction
All reactions unique

💡 Hints

Hint 1 — Check every possible streak. Too slow for long message threads.
Hint 2 — Maintain a moving window that shrinks the moment a duplicate appears.
Hint 3 — Track the last seen index of each reaction. Jump the left pointer past the repeat instantly.`;

const desc4 = `4. 🔵 Azure VM Priority Selector
(Kth Largest Element – Medium)

🧾 Problem
Azure's autoscaler ranks virtual machines by performance score during peak load. When resources are tight, only the top K VMs stay active. Find the Kth highest performance score — the exact cutoff threshold — without fully re-sorting the entire fleet every cycle.

📥 Input

Line 1: n k
Line 2: n space-separated VM performance scores

📤 Output

Single integer — the Kth largest score

🧪 Sample Test Cases
Case 1
Input:
6 2
3 2 1 5 6 4

Output: 5
Case 2
Input:
9 4
3 2 3 1 2 4 5 5 6

Output: 4

⚠️ Edge Cases

Duplicate performance scores
k = 1 (top VM only)
k = n (the weakest active VM)

💡 Hints

Hint 1 — Sort descending, return index k-1. Simple but O(n log n) every cycle.
Hint 2 — You don't need the full sorted order — just the Kth position.
Hint 3 — Use a min-heap of size k. The heap top is always your cutoff score.`;

const desc5 = `5. 🗃️ Multi-Region Log Merger
(Merge K Sorted Lists – Hard)

🧾 Problem
Azure Monitor collects timestamped event logs from K data centres. Each region's log is already sorted by timestamp. Merge all regional logs into one globally sorted event stream so the incident response team can replay events in exact chronological order.

📥 Input

Line 1: k — number of regions
Next k lines: m followed by m sorted timestamps

📤 Output

One line with all timestamps merged and sorted

🧪 Sample Test Cases
Case 1
Input:
3
3 1 4 5
3 1 3 4
2 2 6

Output: 1 1 2 3 4 4 5 6
Case 2
Input:
2
0
3 2 2 2

Output: 2 2 2

⚠️ Edge Cases

One region sent no logs (empty list)
All logs from a single region
Duplicate timestamps across regions

💡 Hints

Hint 1 — Dump all timestamps into one list and sort. Wastes the pre-sorted property.
Hint 2 — Each region's log is already sorted. Can you always pick the earliest next event efficiently?
Hint 3 — Use a min-heap seeded with the first event from each region. Pop minimum, push next from same region.`;

const desc6 = `6. 🌊 Azure Data Pipeline Backpressure
(Trapping Rain Water – Hard)

🧾 Problem
An Azure data pipeline visualiser models queue depths across processing stages as a bar chart. When fast stages produce data faster than slow stages can consume it, backpressure accumulates between them — like water trapped between walls. Calculate the total backpressure volume across the pipeline to identify bottlenecks.

📥 Input

Line 1: n — number of pipeline stages
Line 2: n space-separated queue depth values

📤 Output

Single integer — total accumulated backpressure units

🧪 Sample Test Cases
Case 1
Input:
12
0 1 0 2 1 0 1 3 2 1 2 1

Output: 6
Case 2
Input:
6
4 2 0 3 2 5

Output: 9

⚠️ Edge Cases

Monotonically increasing or decreasing pipeline (no backpressure)
All stages at equal depth
Only 1 or 2 stages

💡 Hints

Hint 1 — Backpressure at each stage = min(max_left, max_right) - depth[i]. Calculate per stage.
Hint 2 — Precompute left-max and right-max arrays. O(n) time, O(n) space.
Hint 3 — Use two pointers from both ends. Eliminates extra arrays — O(1) space.`;

export const microsoftHiringCodingProblems = [
  {
    title: "🗂️ File Deduplication Finder (Two Sum)",
    description: desc1,
    inputFormat: "Line 1: n and target. Line 2: n integer file sizes (KB).",
    outputFormat: "Two indices i j (0-based, increasing) separated by a space, with newline.",
    sampleTestCases: [
      { input: "4 9\n2 7 11 15\n", output: "0 1\n" },
      { input: "3 6\n3 2 4\n", output: "1 2\n" },
      { input: "2 6\n3 3\n", output: "0 1\n" },
    ],
    hiddenTestCases: [
      { input: "2 100\n50 50\n", output: "0 1\n" },
      { input: "4 0\n-1 1 2 3\n", output: "0 1\n" },
    ],
    marks: 12,
    leetcodeSlug: "two-sum",
    starterCode: starterMicrosoftFileDedup,
  },
  {
    title: "🖥️ IDE Syntax Validator (Valid Parentheses)",
    description: desc2,
    inputFormat: "One line: string of (, ), [, ], {, } only.",
    outputFormat: "YES or NO (uppercase) with newline.",
    sampleTestCases: [
      { input: "()[]{}\n", output: "YES\n" },
      { input: "(]\n", output: "NO\n" },
      { input: "([{}])\n", output: "YES\n" },
    ],
    hiddenTestCases: [
      { input: "\n", output: "YES\n" },
      { input: "([)]\n", output: "NO\n" },
      { input: "((\n", output: "NO\n" },
    ],
    marks: 12,
    leetcodeSlug: "valid-parentheses",
    starterCode: starterGoogleBlueprintBrackets,
  },
  {
    title: "📊 Teams Chat Unique Streak (Longest substring without repeating)",
    description: desc3,
    inputFormat: "One line: reaction sequence string s.",
    outputFormat: "Single integer (longest unique streak length) with newline.",
    sampleTestCases: [
      { input: "abcabcbb\n", output: "3\n" },
      { input: "bbbbb\n", output: "1\n" },
      { input: "pwwkew\n", output: "3\n" },
    ],
    hiddenTestCases: [
      { input: "a\n", output: "1\n" },
      { input: "abcdefghijklmnopqrstuvwxyz\n", output: "26\n" },
    ],
    marks: 14,
    leetcodeSlug: "longest-substring-without-repeating-characters",
    starterCode: starterGoogleSignalWindow,
  },
  {
    title: "🔵 Azure VM Priority Selector (Kth largest)",
    description: desc4,
    inputFormat: "Line 1: n k. Line 2: n integers (VM scores).",
    outputFormat: "Single integer (Kth largest score) with newline.",
    sampleTestCases: [
      { input: "6 2\n3 2 1 5 6 4\n", output: "5\n" },
      { input: "9 4\n3 2 3 1 2 4 5 5 6\n", output: "4\n" },
    ],
    hiddenTestCases: [
      { input: "1 1\n42\n", output: "42\n" },
      { input: "5 5\n9 8 7 6 5\n", output: "5\n" },
    ],
    marks: 14,
    leetcodeSlug: "kth-largest-element-in-an-array",
    starterCode: starterGoogleLeaderboardK,
  },
  {
    title: "🗃️ Multi-Region Log Merger (Merge K sorted lists)",
    description: desc5,
    inputFormat: "Line 1: k. Next k lines: m then m sorted integers (m may be 0).",
    outputFormat: "One line: all values merged in non-decreasing order, space-separated, with newline.",
    sampleTestCases: [
      {
        input: "3\n3 1 4 5\n3 1 3 4\n2 2 6\n",
        output: "1 1 2 3 4 4 5 6\n",
      },
      { input: "2\n0\n3 2 2 2\n", output: "2 2 2\n" },
    ],
    hiddenTestCases: [
      { input: "1\n4\n1 2 3 4\n", output: "1 2 3 4\n" },
      { input: "2\n2 1 3\n2 2 4\n", output: "1 2 3 4\n" },
    ],
    marks: 16,
    leetcodeSlug: "merge-k-sorted-lists",
    starterCode: starterGoogleHospitalMerge,
  },
  {
    title: "🌊 Azure Data Pipeline Backpressure (Trapping rain water)",
    description: desc6,
    inputFormat: "Line 1: n. Line 2: n non-negative queue depths.",
    outputFormat: "Single integer (total backpressure units) with newline.",
    sampleTestCases: [
      {
        input: "12\n0 1 0 2 1 0 1 3 2 1 2 1\n",
        output: "6\n",
      },
      { input: "6\n4 2 0 3 2 5\n", output: "9\n" },
    ],
    hiddenTestCases: [
      { input: "3\n3 0 2\n", output: "2\n" },
      { input: "1\n5\n", output: "0\n" },
    ],
    marks: 16,
    leetcodeSlug: "trapping-rain-water",
    starterCode: starterMicrosoftBackpressure,
  },
];
