/**
 * Coding problems + starters for `tcs-hiring-practice` (seed-public-demo-tests.mjs).
 * IT-services flavour; problem 1 uses `claims`; problems 2–5 reuse Google harnesses; problem 6 uses `heights` (rack cooling).
 */
import {
  starterGoogleBlueprintBrackets,
  starterGoogleDrainage,
  starterGoogleHospitalMerge,
  starterGoogleLeaderboardK,
  starterGoogleSignalWindow,
} from "./google-hiring-practice-coding.mjs";

export const tcsHiringAssessmentDelivery = {
  mcqPerAttempt: 5,
  codingPerAttempt: 6,
  easyDurationMinutes: 95,
  mediumDurationMinutes: 110,
  hardDurationMinutes: 130,
};

export const starterTcsPayrollClaims = {
  Python: `import sys

def solve(claims, target):
    # Write your logic here
    return [0, 1]

def main():
    data = sys.stdin.read().split()
    n, target = int(data[0]), int(data[1])
    claims = list(map(int, data[2:2+n]))
    result = solve(claims, target)
    print(result[0], result[1])

main()
`,
  Javascript: `function solve(claims, target) {
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
  const claims = data.slice(2, 2 + n);
  const r = solve(claims, target);
  process.stdout.write(String(r[0]) + " " + String(r[1]) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static int[] solve(int[] claims, int target) {
        return new int[] { 0, 1 };
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] claims = new int[n];
        for (int i = 0; i < n; i++) claims[i] = sc.nextInt();
        int[] r = solve(claims, target);
        System.out.println(r[0] + " " + r[1]);
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

pair<int,int> solve(vector<int>& claims, int target) {
    return {0, 1};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, target;
    cin >> n >> target;
    vector<int> claims(n);
    for (int i = 0; i < n; i++) cin >> claims[i];
    auto r = solve(claims, target);
    cout << r.first << " " << r.second << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <stdlib.h>

void solve(int *claims, int n, int target, int *out_i, int *out_j) {
    *out_i = 0;
    *out_j = 1;
}

int main(void) {
    int n, target;
    if (scanf("%d %d", &n, &target) != 2) return 0;
    int *claims = (int *)calloc((size_t)n, sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &claims[i]);
    int i, j;
    solve(claims, n, target, &i, &j);
    printf("%d %d\\n", i, j);
    free(claims);
    return 0;
}
`,
};

const desc1 = `1. 💰 Payroll Budget Matcher
(Two Sum – Easy)

🧾 Problem
TCS's payroll system is reconciling employee reimbursements. Given a list of claim amounts submitted by employees, find two claims that together exactly match the approved budget slot — so finance can close that batch without leftover funds.

📥 Input

Line 1: n target
Line 2: n space-separated claim amounts

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

Two employees submitted the same amount
Negative amounts (deductions/adjustments)
Very large employee list

💡 Hints

Hint 1 — Check every pair of claims. Works but far too slow for a large payroll run.
Hint 2 — Can you remember claim amounts already seen to avoid scanning again?
Hint 3 — For each amount x, check if target - x was already recorded.`;

const desc2 = `2. 🧾 Client Contract Validator
(Valid Parentheses – Easy)

🧾 Problem
TCS's legal document parser processes contract templates that use bracket notation to define nested clauses — () for sub-conditions, [] for annexures, {} for sections. A mismatched bracket means the contract template is malformed and cannot be processed. Build the validator.

📥 Input

Single line string s containing only (, ), {, }, [, ]

📤 Output

YES if the contract structure is valid, NO otherwise

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

Empty template string
Only opening brackets, none closed
Correct bracket types but wrong nesting e.g. ([)]

💡 Hints

Hint 1 — Every opening bracket must be closed in exact reverse order.
Hint 2 — Think last-opened, first-closed. Which data structure mirrors this behaviour?
Hint 3 — Use a stack. Push on open, pop and match on close.`;

const desc3 = `3. 🖨️ BPO Ticket Unique Sequence
(Longest Substring Without Repeating Characters – Medium)

🧾 Problem
TCS's BPO division tracks support ticket category codes as agents handle them in sequence. A quality audit team needs to find the longest uninterrupted sequence of unique ticket categories handled — no repeated category back-to-back in the window — to measure agent versatility.

📥 Input

Single line string s — the ticket category sequence

📤 Output

Single integer — length of the longest all-unique sequence

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

Agent handled only one type of ticket all day
Single ticket in log
All ticket categories completely unique

💡 Hints

Hint 1 — Check every possible window. Too slow for thousands of daily tickets.
Hint 2 — Maintain a moving window that shrinks the moment a category repeats.
Hint 3 — Track the last seen index of each category. Jump the left pointer past the duplicate instantly.`;

const desc4 = `4. 📋 ERP Resource Tier Selector
(Kth Largest Element – Medium)

🧾 Problem
TCS's ERP system allocates server resources to client projects based on workload scores. At billing time, the system needs to identify the Kth highest workload score — the exact threshold separating premium-tier clients from standard-tier — without re-ranking all projects from scratch every hour.

📥 Input

Line 1: n k
Line 2: n space-separated workload scores

📤 Output

Single integer — the Kth largest workload score

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

Duplicate workload scores across projects
k = 1 (highest workload only)
k = n (lowest active project)

💡 Hints

Hint 1 — Sort descending, return index k-1. Simple but O(n log n) per billing cycle.
Hint 2 — You don't need the full sorted ranking — just the Kth cutoff value.
Hint 3 — Use a min-heap of size k. The heap top is always the cutoff score.`;

const desc5 = `5. 🏢 Multi-Branch Attendance Merger
(Merge K Sorted Lists – Hard)

🧾 Problem
TCS has K office branches across India. Each branch submits a sorted list of employee check-in timestamps at end of day. The central HR system needs to merge all branch logs into one single chronologically sorted attendance record for compliance reporting.

📥 Input

Line 1: k — number of branches
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

One branch submitted no records (holiday/shutdown)
All records from a single branch
Same timestamp from multiple branches

💡 Hints

Hint 1 — Dump all timestamps into one list and sort. Ignores the fact each branch list is already sorted.
Hint 2 — Each branch log is pre-sorted. Can you always pick the earliest next check-in efficiently?
Hint 3 — Use a min-heap seeded with the first entry from each branch. Pop minimum, push next from same branch.`;

const desc6 = `6. 🌧️ Data Centre Cooling Load
(Trapping Rain Water – Hard)

🧾 Problem
TCS manages large data centre server racks modelled as a height map. Hot air gets trapped in the valleys between taller rack units and cannot escape — creating cooling dead zones. Calculate the total volume of trapped hot air across the rack layout so the facilities team can redesign the airflow vents.

📥 Input

Line 1: n — number of rack units
Line 2: n space-separated rack heights

📤 Output

Single integer — total units of trapped air volume

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

Racks are in increasing or decreasing order (no trapping)
All racks at equal height
Only 1 or 2 rack units

💡 Hints

Hint 1 — Trapped air at each unit = min(max_left, max_right) - height[i]. Calculate per unit.
Hint 2 — Precompute left-max and right-max arrays. O(n) time, O(n) space.
Hint 3 — Use two pointers from both ends. O(n) time, O(1) space — no extra arrays needed.`;

export const tcsHiringCodingProblems = [
  {
    title: "💰 Payroll Budget Matcher (Two Sum)",
    description: desc1,
    inputFormat: "Line 1: n and target. Line 2: n integer claim amounts.",
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
    starterCode: starterTcsPayrollClaims,
  },
  {
    title: "🧾 Client Contract Validator (Valid Parentheses)",
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
    title: "🖨️ BPO Ticket Unique Sequence (Longest substring without repeating)",
    description: desc3,
    inputFormat: "One line: ticket category sequence string s.",
    outputFormat: "Single integer (longest all-unique sequence length) with newline.",
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
    title: "📋 ERP Resource Tier Selector (Kth largest)",
    description: desc4,
    inputFormat: "Line 1: n k. Line 2: n integers (workload scores).",
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
    title: "🏢 Multi-Branch Attendance Merger (Merge K sorted lists)",
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
    title: "🌧️ Data Centre Cooling Load (Trapping rain water)",
    description: desc6,
    inputFormat: "Line 1: n. Line 2: n non-negative rack heights.",
    outputFormat: "Single integer (trapped air volume) with newline.",
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
    starterCode: starterGoogleDrainage,
  },
];
