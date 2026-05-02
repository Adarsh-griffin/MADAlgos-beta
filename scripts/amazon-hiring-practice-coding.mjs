/**
 * Coding problems + starters for `amazon-hiring-practice` (seed-public-demo-tests.mjs).
 * Warehouse / Prime / AWS flavour. P1 `weights` (Google delivery pair); P4 `bids`; P6 `capacities`.
 */
import {
  starterCapgeminiBottleneck,
} from "./capgemini-hiring-practice-coding.mjs";
import {
  starterGoogleBlueprintBrackets,
  starterGoogleDeliveryPair,
  starterGoogleHospitalMerge,
  starterGoogleSignalWindow,
} from "./google-hiring-practice-coding.mjs";

export const amazonHiringAssessmentDelivery = {
  mcqPerAttempt: 5,
  codingPerAttempt: 6,
  easyDurationMinutes: 95,
  mediumDurationMinutes: 110,
  hardDurationMinutes: 130,
};

export const starterAmazonSpotBids = {
  Python: `import sys

def solve(bids, k):
    # Write your logic here
    return 0

def main():
    data = sys.stdin.read().split()
    n, k = int(data[0]), int(data[1])
    bids = list(map(int, data[2:2+n]))
    print(solve(bids, k))

main()
`,
  Javascript: `function solve(bids, k) {
  return 0;
}

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
  const data = lines.join("\\n").trim().split(/\\s+/).map(Number);
  const n = data[0];
  const k = data[1];
  const bids = data.slice(2, 2 + n);
  process.stdout.write(String(solve(bids, k)) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static long solve(int[] bids, int k) {
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        int[] bids = new int[n];
        for (int i = 0; i < n; i++) bids[i] = sc.nextInt();
        System.out.println(solve(bids, k));
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

long long solve(vector<int>& bids, int k) {
    return 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<int> bids(n);
    for (int i = 0; i < n; i++) cin >> bids[i];
    cout << solve(bids, k) << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <stdlib.h>

long long solve(int *bids, int n, int k) {
    return 0;
}

int main(void) {
    int n, k;
    if (scanf("%d %d", &n, &k) != 2) return 0;
    int *bids = (int *)calloc((size_t)n, sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &bids[i]);
    printf("%lld\\n", solve(bids, n, k));
    free(bids);
    return 0;
}
`,
};

const desc1 = `1. 🚚 Delivery Pair Match
(Two Sum – Easy)

🧾 Problem
Amazon's delivery hub needs to exactly fill a truck. Given a list of package weights, find two packages whose combined weight perfectly matches the truck's load capacity — so the truck leaves full without exceeding its limit.

📥 Input

Line 1: n target
Line 2: n space-separated package weights

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

Two packages with identical weights
Negative weights (weight offsets from packaging credits)
Very large number of packages

💡 Hints

Hint 1 — Check every pair of packages. Works, but too slow for a warehouse processing thousands of orders.
Hint 2 — Can you remember weights already seen to avoid re-scanning?
Hint 3 — For each weight x, check if target - x was already recorded.`;

const desc2 = `2. 📦 Alexa Skill Command Validator
(Valid Parentheses – Easy)

🧾 Problem
Amazon's Alexa skill builder lets developers define nested intent structures using bracket notation — () for slot values, [] for optional phrases, {} for intent groups. Before a skill goes live on the Alexa store, the validator checks that all brackets are correctly matched and closed — a malformed skill definition crashes the voice parser. Build the pre-publish check.

📥 Input

Single line string s containing only (, ), {, }, [, ]

📤 Output

YES if the skill definition is valid, NO otherwise

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

Empty skill definition
Only opening brackets with no closing pair
Correct bracket types but wrong nesting e.g. ([)]

💡 Hints

Hint 1 — Every opening bracket must be closed in exact reverse order.
Hint 2 — Think last-opened, first-closed. Which data structure models this naturally?
Hint 3 — Use a stack. Push on open, pop and match on close.`;

const desc3 = `3. 🛍️ Prime Session Category Streak
(Longest Substring Without Repeating Characters – Medium)

🧾 Problem
Amazon's Prime shopping analytics team logs product category codes as a user browses during a session. The personalisation engine needs the longest uninterrupted browsing streak of distinct categories — no category repeated within the window — to measure how broadly a shopper explored before circling back, and use it to serve more targeted cross-category recommendations.

📥 Input

Single line string s — the product category browse sequence

📤 Output

Single integer — length of the longest all-unique category streak

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

Shopper browsed only one category throughout the session
Single page view in the session log
Every page view was in a completely different category

💡 Hints

Hint 1 — Check every possible streak. Way too slow for millions of daily Prime sessions.
Hint 2 — Maintain a moving window that shrinks the moment a category repeats.
Hint 3 — Track the last seen index of each category. Jump the left pointer past the repeat instantly.`;

const desc4 = `4. ☁️ AWS EC2 Spot Instance Cutoff
(Kth Largest Element – Medium)

🧾 Problem
AWS's EC2 Spot Instance market assigns a bid score to each instance request. When capacity is limited, only the top K highest bids get fulfilled. Find the Kth highest bid score — the exact market clearing threshold — so the scheduler can instantly accept or reject bids without re-sorting the entire request pool on every capacity check.

📥 Input

Line 1: n k
Line 2: n space-separated bid scores

📤 Output

Single integer — the Kth largest bid score

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

Multiple bids at identical scores
k = 1 (only the highest bid wins)
k = n (all bids are fulfilled)

💡 Hints

Hint 1 — Sort descending, return index k-1. Simple but O(n log n) per capacity check.
Hint 2 — You don't need the full bid ranking — just the Kth clearing price.
Hint 3 — Use a min-heap of size k. The heap top is always your market clearing threshold.`;

const desc5 = `5. 🏭 Multi-Warehouse Dispatch Merger
(Merge K Sorted Lists – Hard)

🧾 Problem
Amazon fulfils orders from K warehouses simultaneously. Each warehouse maintains a sorted dispatch queue of order IDs by priority score. The central logistics system must merge all warehouse queues into one single globally sorted dispatch order — so the last-mile delivery fleet picks up packages in the optimal sequence across all fulfilment centres.

📥 Input

Line 1: k — number of warehouses
Next k lines: m followed by m sorted priority scores

📤 Output

One line with all priority scores merged and sorted

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

One warehouse has no pending orders
All orders from a single warehouse
Same priority score from multiple warehouses

💡 Hints

Hint 1 — Dump all orders into one list and sort. Wastes the pre-sorted property of each warehouse queue.
Hint 2 — Each warehouse queue is already sorted. Can you always pick the highest-priority next order efficiently?
Hint 3 — Use a min-heap seeded with the first order from each warehouse. Pop minimum, push next from same warehouse.`;

const desc6 = `6. 🌧️ AWS S3 Storage Tier Overflow Calculator
(Trapping Rain Water – Hard)

🧾 Problem
Amazon S3's intelligent tiering system models storage bucket capacities across a pipeline of data processing stages. Data overflows and gets trapped between high-capacity stages that flank lower-capacity ones — creating hidden storage backlogs that inflate costs. Calculate the total overflow volume trapped across the pipeline so the cloud architect can right-size each stage's capacity and eliminate surprise billing spikes.

📥 Input

Line 1: n — number of storage stages
Line 2: n space-separated stage capacities

📤 Output

Single integer — total units of trapped overflow volume

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

Stage capacities strictly increasing or decreasing (no overflow)
All stages at equal capacity
Only 1 or 2 stages in the pipeline

💡 Hints

Hint 1 — Overflow at each stage = min(max_left, max_right) - capacity[i]. Calculate per stage.
Hint 2 — Precompute left-max and right-max arrays. O(n) time, O(n) space.
Hint 3 — Use two pointers from both ends. O(n) time, O(1) space — no extra arrays needed.`;

export const amazonHiringCodingProblems = [
  {
    title: "🚚 Delivery Pair Match (Two Sum)",
    description: desc1,
    inputFormat: "Line 1: n and target. Line 2: n integer package weights.",
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
    starterCode: starterGoogleDeliveryPair,
  },
  {
    title: "📦 Alexa Skill Command Validator (Valid Parentheses)",
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
    title: "🛍️ Prime Session Category Streak (Longest substring without repeating)",
    description: desc3,
    inputFormat: "One line: product category browse sequence string s.",
    outputFormat: "Single integer (longest all-unique category streak length) with newline.",
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
    title: "☁️ AWS EC2 Spot Instance Cutoff (Kth largest)",
    description: desc4,
    inputFormat: "Line 1: n k. Line 2: n integers (bid scores).",
    outputFormat: "Single integer (Kth largest bid score) with newline.",
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
    starterCode: starterAmazonSpotBids,
  },
  {
    title: "🏭 Multi-Warehouse Dispatch Merger (Merge K sorted lists)",
    description: desc5,
    inputFormat: "Line 1: k. Next k lines: m then m sorted integers (m may be 0).",
    outputFormat: "One line: all priority scores merged in non-decreasing order, space-separated, with newline.",
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
    title: "🌧️ AWS S3 Storage Tier Overflow Calculator (Trapping rain water)",
    description: desc6,
    inputFormat: "Line 1: n. Line 2: n non-negative stage capacities.",
    outputFormat: "Single integer (total trapped overflow volume units) with newline.",
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
