/**
 * Coding problems + starters for `infosys-hiring-practice` (seed-public-demo-tests.mjs).
 * Campus / InfyTQ flavour; problem 1 uses `durations`; problem 6 uses `heights` (starterGoogleDrainage).
 */
import {
  starterGoogleBlueprintBrackets,
  starterGoogleDrainage,
  starterGoogleHospitalMerge,
  starterGoogleLeaderboardK,
  starterGoogleSignalWindow,
} from "./google-hiring-practice-coding.mjs";

export const infosysHiringAssessmentDelivery = {
  mcqPerAttempt: 5,
  codingPerAttempt: 6,
  easyDurationMinutes: 95,
  mediumDurationMinutes: 110,
  hardDurationMinutes: 130,
};

export const starterInfosysTrainingDurations = {
  Python: `import sys

def solve(durations, target):
    # Write your logic here
    return [0, 1]

def main():
    data = sys.stdin.read().split()
    n, target = int(data[0]), int(data[1])
    durations = list(map(int, data[2:2+n]))
    result = solve(durations, target)
    print(result[0], result[1])

main()
`,
  Javascript: `function solve(durations, target) {
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
  const durations = data.slice(2, 2 + n);
  const r = solve(durations, target);
  process.stdout.write(String(r[0]) + " " + String(r[1]) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static int[] solve(int[] durations, int target) {
        return new int[] { 0, 1 };
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] durations = new int[n];
        for (int i = 0; i < n; i++) durations[i] = sc.nextInt();
        int[] r = solve(durations, target);
        System.out.println(r[0] + " " + r[1]);
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

pair<int,int> solve(vector<int>& durations, int target) {
    return {0, 1};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, target;
    cin >> n >> target;
    vector<int> durations(n);
    for (int i = 0; i < n; i++) cin >> durations[i];
    auto r = solve(durations, target);
    cout << r.first << " " << r.second << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <stdlib.h>

void solve(int *durations, int n, int target, int *out_i, int *out_j) {
    *out_i = 0;
    *out_j = 1;
}

int main(void) {
    int n, target;
    if (scanf("%d %d", &n, &target) != 2) return 0;
    int *durations = (int *)calloc((size_t)n, sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &durations[i]);
    int i, j;
    solve(durations, n, target, &i, &j);
    printf("%d %d\\n", i, j);
    free(durations);
    return 0;
}
`,
};

const desc1 = `1. 🎓 Training Module Budget Pairer
(Two Sum – Easy)

🧾 Problem
Infosys's InfyTQ learning platform allocates training hours to new hires. Each module has a fixed duration. The L&D team needs to find two modules whose combined duration exactly fills a remaining slot in the training calendar — so no time is wasted and no module is cut short.

📥 Input

Line 1: n target
Line 2: n space-separated module durations (in hours)

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

Two modules with identical durations
Negative durations (buffer/break offsets)
Very large module catalogue

💡 Hints

Hint 1 — Check every pair of modules. Works, but too slow for a large training catalogue.
Hint 2 — Can you remember durations already seen to avoid re-scanning the catalogue?
Hint 3 — For each duration x, check if target - x was already recorded.`;

const desc2 = `2. 🏫 Campus Portal Form Validator
(Valid Parentheses – Easy)

🧾 Problem
Infosys's campus recruitment portal lets students submit dynamic form expressions that define eligibility rules using nested conditions — () for criteria groups, [] for department filters, {} for batch rules. A mismatched bracket means the rule is malformed and the portal rejects the submission. Build the validation engine.

📥 Input

Single line string s containing only (, ), {, }, [, ]

📤 Output

YES if the form expression is valid, NO otherwise

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

Empty expression submitted
Only opening brackets with no closing pair
Correct bracket types but wrong nesting e.g. ([)]

💡 Hints

Hint 1 — Every opening bracket must be closed in exact reverse order.
Hint 2 — Think last-opened, first-closed. Which data structure models this naturally?
Hint 3 — Use a stack. Push on open, pop and match on close.`;

const desc3 = `3. 📚 InfyTQ Skill Streak Tracker
(Longest Substring Without Repeating Characters – Medium)

🧾 Problem
Infosys's InfyTQ platform logs skill badges earned by a trainee in sequence as they complete assessments. The mentorship team wants to find the longest uninterrupted streak of distinct skills earned — no badge repeated within the window — to identify the broadest learning phase in a trainee's journey.

📥 Input

Single line string s — the skill badge sequence

📤 Output

Single integer — length of the longest all-unique badge streak

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

Trainee earned only one type of badge repeatedly
Single badge in the log
All badges completely distinct

💡 Hints

Hint 1 — Check every possible streak window. Too slow for thousands of badge logs.
Hint 2 — Maintain a moving window that shrinks the moment a badge type repeats.
Hint 3 — Track the last seen index of each badge. Jump the left pointer past the repeat instantly.`;

const desc4 = `4. 🏅 Bench Allocation Priority Ranker
(Kth Largest Element – Medium)

🧾 Problem
Infosys's resource management system assigns readiness scores to bench employees awaiting project allocation. When a client project opens up, only the top K employees get shortlisted. Find the Kth highest readiness score — the exact cutoff — so the system can instantly filter eligible candidates without re-sorting the entire bench pool every time a project comes in.

📥 Input

Line 1: n k
Line 2: n space-separated readiness scores

📤 Output

Single integer — the Kth largest readiness score

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

Multiple employees with identical scores
k = 1 (only the top candidate)
k = n (the last eligible candidate)

💡 Hints

Hint 1 — Sort descending, return index k-1. Simple but O(n log n) on every project opening.
Hint 2 — You don't need the full ranked list — just the Kth cutoff score.
Hint 3 — Use a min-heap of size k. The heap top is always your cutoff score.`;

const desc5 = `5. 🗂️ Multi-Campus Interview Schedule Merger
(Merge K Sorted Lists – Hard)

🧾 Problem
Infosys conducts campus drives across K colleges simultaneously. Each college's interview panel submits a sorted list of candidate slot times (in minutes from 9 AM). The central HR coordinator must merge all college schedules into one single chronologically sorted interview timeline to assign panellists without conflicts.

📥 Input

Line 1: k — number of campuses
Next k lines: m followed by m sorted slot times

📤 Output

One line with all slot times merged and sorted

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

One campus had no interview slots (cancelled drive)
All slots from a single campus
Same slot time from multiple campuses

💡 Hints

Hint 1 — Dump all slots into one list and sort. Ignores that each campus list is already sorted.
Hint 2 — Each campus schedule is pre-sorted. Can you always pick the earliest next slot efficiently?
Hint 3 — Use a min-heap seeded with the first slot from each campus. Pop minimum, push next from same campus.`;

const desc6 = `6. 🌧️ Infosys Campus Rainwater Harvesting
(Trapping Rain Water – Hard)

🧾 Problem
Infosys's sprawling campus green initiative models the landscape as a series of terrain blocks of varying heights. After monsoon rains, water collects in the valleys between elevated sections. The facilities team needs to calculate the total volume of rainwater harvested across the campus terrain — to plan storage tanks and drainage routes for their sustainability report.

📥 Input

Line 1: n — number of terrain blocks
Line 2: n space-separated terrain heights

📤 Output

Single integer — total units of water harvested

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

Terrain is strictly increasing or decreasing (no water collects)
All terrain blocks at equal height
Only 1 or 2 terrain blocks

💡 Hints

Hint 1 — Water at each block = min(max_left, max_right) - height[i]. Calculate per block.
Hint 2 — Precompute left-max and right-max arrays. O(n) time, O(n) space.
Hint 3 — Use two pointers from both ends. O(n) time, O(1) space — no extra arrays needed.`;

export const infosysHiringCodingProblems = [
  {
    title: "🎓 Training Module Budget Pairer (Two Sum)",
    description: desc1,
    inputFormat: "Line 1: n and target. Line 2: n integer module durations (hours).",
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
    starterCode: starterInfosysTrainingDurations,
  },
  {
    title: "🏫 Campus Portal Form Validator (Valid Parentheses)",
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
    title: "📚 InfyTQ Skill Streak Tracker (Longest substring without repeating)",
    description: desc3,
    inputFormat: "One line: skill badge sequence string s.",
    outputFormat: "Single integer (longest all-unique badge streak length) with newline.",
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
    title: "🏅 Bench Allocation Priority Ranker (Kth largest)",
    description: desc4,
    inputFormat: "Line 1: n k. Line 2: n integers (readiness scores).",
    outputFormat: "Single integer (Kth largest readiness score) with newline.",
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
    title: "🗂️ Multi-Campus Interview Schedule Merger (Merge K sorted lists)",
    description: desc5,
    inputFormat: "Line 1: k. Next k lines: m then m sorted integers (m may be 0).",
    outputFormat: "One line: all slot times merged in non-decreasing order, space-separated, with newline.",
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
    title: "🌧️ Infosys Campus Rainwater Harvesting (Trapping rain water)",
    description: desc6,
    inputFormat: "Line 1: n. Line 2: n non-negative terrain heights.",
    outputFormat: "Single integer (total harvested water units) with newline.",
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
