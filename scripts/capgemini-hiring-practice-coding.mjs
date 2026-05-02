/**
 * Coding problems + starters for `capgemini-hiring-practice` (seed-public-demo-tests.mjs).
 * Problem 1: `points`; problem 6: `capacities` (trapping-rain); 2–5 reuse Google I/O harnesses.
 */
import {
  starterGoogleBlueprintBrackets,
  starterGoogleHospitalMerge,
  starterGoogleLeaderboardK,
  starterGoogleSignalWindow,
} from "./google-hiring-practice-coding.mjs";

export const capgeminiHiringAssessmentDelivery = {
  mcqPerAttempt: 5,
  codingPerAttempt: 6,
  easyDurationMinutes: 95,
  mediumDurationMinutes: 110,
  hardDurationMinutes: 130,
};

export const starterCapgeminiSprintPoints = {
  Python: `import sys

def solve(points, target):
    # Write your logic here
    return [0, 1]

def main():
    data = sys.stdin.read().split()
    n, target = int(data[0]), int(data[1])
    points = list(map(int, data[2:2+n]))
    result = solve(points, target)
    print(result[0], result[1])

main()
`,
  Javascript: `function solve(points, target) {
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
  const points = data.slice(2, 2 + n);
  const r = solve(points, target);
  process.stdout.write(String(r[0]) + " " + String(r[1]) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static int[] solve(int[] points, int target) {
        return new int[] { 0, 1 };
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] points = new int[n];
        for (int i = 0; i < n; i++) points[i] = sc.nextInt();
        int[] r = solve(points, target);
        System.out.println(r[0] + " " + r[1]);
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

pair<int,int> solve(vector<int>& points, int target) {
    return {0, 1};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, target;
    cin >> n >> target;
    vector<int> points(n);
    for (int i = 0; i < n; i++) cin >> points[i];
    auto r = solve(points, target);
    cout << r.first << " " << r.second << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <stdlib.h>

void solve(int *points, int n, int target, int *out_i, int *out_j) {
    *out_i = 0;
    *out_j = 1;
}

int main(void) {
    int n, target;
    if (scanf("%d %d", &n, &target) != 2) return 0;
    int *points = (int *)calloc((size_t)n, sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &points[i]);
    int i, j;
    solve(points, n, target, &i, &j);
    printf("%d %d\\n", i, j);
    free(points);
    return 0;
}
`,
};

export const starterCapgeminiBottleneck = {
  Python: `import sys

def solve(capacities):
    # Write your logic here
    return 0

def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    capacities = list(map(int, data[1:1+n]))
    print(solve(capacities))

main()
`,
  Javascript: `function solve(capacities) {
  return 0;
}

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
  const data = lines.join("\\n").trim().split(/\\s+/).map(Number);
  const n = data[0];
  const capacities = data.slice(1, 1 + n);
  process.stdout.write(String(solve(capacities)) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static long solve(int[] capacities) {
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] capacities = new int[n];
        for (int i = 0; i < n; i++) capacities[i] = sc.nextInt();
        System.out.println(solve(capacities));
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

long long solve(vector<int>& capacities) {
    return 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> c(n);
    for (int i = 0; i < n; i++) cin >> c[i];
    cout << solve(c) << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <stdlib.h>

long long solve(int *c, int n) {
    return 0;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *c = (int *)calloc((size_t)n, sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &c[i]);
    printf("%lld\\n", solve(c, n));
    free(c);
    return 0;
}
`,
};

const desc1 = `1. 💼 Sprint Budget Balancer
(Two Sum – Easy)

🧾 Problem
Capgemini's project management tool tracks story point estimates for tasks in a client sprint. The Scrum Master needs to find two tasks whose combined story points exactly fill the remaining sprint capacity — so the sprint is neither overloaded nor underutilised.

📥 Input

Line 1: n target
Line 2: n space-separated story point values

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

Two tasks with identical story points
Negative values (carryover credits from previous sprint)
Very large backlog size

💡 Hints

Hint 1 — Check every pair of tasks. Works, but too slow for a massive product backlog.
Hint 2 — Can you remember story points already seen to avoid re-scanning the backlog?
Hint 3 — For each value x, check if target - x was already recorded.`;

const desc2 = `2. 🔌 REST API Request Validator
(Valid Parentheses – Easy)

🧾 Problem
Capgemini's API gateway parses nested JSON-like request bodies from client integrations. Before forwarding to the backend, it must verify that all brackets, braces, and parentheses in the request schema are correctly matched — a malformed request gets rejected with a 400 Bad Request. Build this pre-validation check.

📥 Input

Single line string s containing only (, ), {, }, [, ]

📤 Output

YES if the request structure is valid, NO otherwise

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

Empty request body
Only opening brackets with no closing pair
Correct bracket types but wrong nesting e.g. ([)]

💡 Hints

Hint 1 — Every opening bracket must be closed in exact reverse order.
Hint 2 — Think last-opened, first-closed. Which data structure models this naturally?
Hint 3 — Use a stack. Push on open, pop and match on close.`;

const desc3 = `3. 📈 Client Dashboard Unique KPI Streak
(Longest Substring Without Repeating Characters – Medium)

🧾 Problem
Capgemini's analytics dashboard logs KPI category codes as a consultant reviews them in a session. The engagement lead wants the longest uninterrupted run of distinct KPIs reviewed — no category repeated within the window — to assess how broadly a consultant explored the client's data before drilling down.

📥 Input

Single line string s — the KPI review sequence

📤 Output

Single integer — length of the longest all-unique KPI streak

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

Consultant reviewed only one KPI category throughout
Single KPI in the session log
All KPI categories completely distinct

💡 Hints

Hint 1 — Check every possible window. Too slow for long consulting session logs.
Hint 2 — Maintain a moving window that shrinks the moment a KPI category repeats.
Hint 3 — Track the last seen index of each KPI. Jump the left pointer past the repeat instantly.`;

const desc4 = `4. ☁️ Cloud Migration Priority Cutoff
(Kth Largest Element – Medium)

🧾 Problem
Capgemini is managing a cloud migration project for a large enterprise. Each legacy application is assigned a migration urgency score. The project director needs to identify the Kth most urgent application — the exact score that separates Wave 1 migration from later waves — without re-ranking the entire portfolio every planning cycle.

📥 Input

Line 1: n k
Line 2: n space-separated urgency scores

📤 Output

Single integer — the Kth largest urgency score

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

Multiple applications with the same urgency score
k = 1 (most critical application only)
k = n (last application in the migration queue)

💡 Hints

Hint 1 — Sort descending, return index k-1. Simple but O(n log n) every planning cycle.
Hint 2 — You don't need the full ranked order — just the Kth cutoff value.
Hint 3 — Use a min-heap of size k. The heap top is always the Wave 1 cutoff.`;

const desc5 = `5. 🗄️ Multi-Client SQL Query Merger
(Merge K Sorted Lists – Hard)

🧾 Problem
Capgemini's data warehouse aggregates query execution logs from K client databases. Each client's log is already sorted by query execution time (in ms). The central performance team needs to merge all logs into one globally sorted timeline to pinpoint the slowest queries across all clients for SLA reporting.

📥 Input

Line 1: k — number of client databases
Next k lines: m followed by m sorted execution times

📤 Output

One line with all execution times merged and sorted

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

One client had no queries that period (empty log)
All queries from a single client database
Same execution time across multiple clients

💡 Hints

Hint 1 — Dump all times into one list and sort. Wastes the pre-sorted property of each client log.
Hint 2 — Each client log is already sorted. Can you always pick the fastest next query efficiently?
Hint 3 — Use a min-heap seeded with the first entry from each client. Pop minimum, push next from same client.`;

const desc6 = `6. 🏗️ Digital Transformation Bottleneck Finder
(Trapping Rain Water – Hard)

🧾 Problem
Capgemini's process consulting team models a client's digital transformation pipeline as a series of process stages with varying throughput capacities. Work items pile up and get stuck between high-capacity stages that sandwich low-capacity ones — creating invisible backlogs. Calculate the total backlog volume trapped across the pipeline to help redesign the transformation roadmap.

📥 Input

Line 1: n — number of process stages
Line 2: n space-separated throughput capacities

📤 Output

Single integer — total units of trapped backlog

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

Stages with strictly increasing or decreasing capacity (no backlog)
All stages at equal capacity
Only 1 or 2 stages in the pipeline

💡 Hints

Hint 1 — Backlog at each stage = min(max_left, max_right) - capacity[i]. Calculate per stage.
Hint 2 — Precompute left-max and right-max arrays. O(n) time, O(n) space.
Hint 3 — Use two pointers from both ends. O(n) time, O(1) space — no extra arrays.`;

export const capgeminiHiringCodingProblems = [
  {
    title: "💼 Sprint Budget Balancer (Two Sum)",
    description: desc1,
    inputFormat: "Line 1: n and target. Line 2: n integer story point values.",
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
    starterCode: starterCapgeminiSprintPoints,
  },
  {
    title: "🔌 REST API Request Validator (Valid Parentheses)",
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
    title: "📈 Client Dashboard Unique KPI Streak (Longest substring without repeating)",
    description: desc3,
    inputFormat: "One line: KPI review sequence string s.",
    outputFormat: "Single integer (longest all-unique KPI streak length) with newline.",
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
    title: "☁️ Cloud Migration Priority Cutoff (Kth largest)",
    description: desc4,
    inputFormat: "Line 1: n k. Line 2: n integers (urgency scores).",
    outputFormat: "Single integer (Kth largest urgency score) with newline.",
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
    title: "🗄️ Multi-Client SQL Query Merger (Merge K sorted lists)",
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
    title: "🏗️ Digital Transformation Bottleneck Finder (Trapping rain water)",
    description: desc6,
    inputFormat: "Line 1: n. Line 2: n non-negative throughput capacities.",
    outputFormat: "Single integer (total trapped backlog units) with newline.",
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
    starterCode: starterCapgeminiBottleneck,
  },
];
