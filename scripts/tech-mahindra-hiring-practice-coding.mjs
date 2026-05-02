/**
 * Coding problems + starters for `tech-mahindra-hiring-practice` (seed-public-demo-tests.mjs).
 * Telecom / NOC flavour. Problem 1 reuses meta `costs` harness; 2–5 from Google; 6 `heights` (trapping rain).
 */
import {
  starterGoogleBlueprintBrackets,
  starterGoogleDrainage,
  starterGoogleHospitalMerge,
  starterGoogleLeaderboardK,
  starterGoogleSignalWindow,
} from "./google-hiring-practice-coding.mjs";
import { starterMetaAdCosts } from "./meta-hiring-practice-coding.mjs";

export const techMahindraHiringAssessmentDelivery = {
  mcqPerAttempt: 5,
  codingPerAttempt: 6,
  easyDurationMinutes: 95,
  mediumDurationMinutes: 110,
  hardDurationMinutes: 130,
};

const desc1 = `1. 📱 Telecom Plan Cost Matcher
(Two Sum – Easy)

🧾 Problem
Tech Mahindra's telecom billing system offers enterprise clients a fixed recharge budget for their employee SIM pool. Given a list of plan costs, find two plans whose combined cost exactly matches the allocated recharge budget — so the finance team can activate both plans without going over or leaving money unused.

📥 Input

Line 1: n target
Line 2: n space-separated plan costs

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

Two plans with identical costs
Negative costs (promotional discounts/credits)
Very large plan catalogue

💡 Hints

Hint 1 — Check every pair of plans. Works, but too slow for a national telecom plan database.
Hint 2 — Can you remember plan costs already seen to avoid re-scanning?
Hint 3 — For each cost x, check if target - x was already recorded.`;

const desc2 = `2. 🛠️ Network Config Script Validator
(Valid Parentheses – Easy)

🧾 Problem
Tech Mahindra's network operations team deploys automated config scripts to 5G towers. These scripts use nested notation — () for command parameters, [] for conditional blocks, {} for module groups. Before deployment, the CI pipeline validates that all brackets are correctly matched — a malformed script sent to a live tower could cause an outage. Build the validator.

📥 Input

Single line string s containing only (, ), {, }, [, ]

📤 Output

YES if the config script structure is valid, NO otherwise

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

Empty config script
Only opening brackets with no closing pair
Correct bracket types but wrong nesting e.g. ([)]

💡 Hints

Hint 1 — Every opening bracket must be closed in exact reverse order.
Hint 2 — Think last-opened, first-closed. Which data structure models this naturally?
Hint 3 — Use a stack. Push on open, pop and match on close.`;

const desc3 = `3. 📶 5G Signal Type Unique Scan
(Longest Substring Without Repeating Characters – Medium)

🧾 Problem
Tech Mahindra's 5G network monitor logs signal band codes as a mobile device hops between towers. The RF optimisation team needs the longest uninterrupted sequence of distinct signal bands — no band repeated within the window — to identify the richest handoff path and tune antenna switching algorithms for maximum coverage.

📥 Input

Single line string s — the signal band sequence

📤 Output

Single integer — length of the longest all-unique band sequence

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

Device stayed on one signal band throughout
Single band reading in the log
Every reading was on a completely distinct band

💡 Hints

Hint 1 — Check every possible window. Too slow for continuous real-time signal logs.
Hint 2 — Maintain a moving window that shrinks the moment a band code repeats.
Hint 3 — Track the last seen index of each band. Jump the left pointer past the repeat instantly.`;

const desc4 = `4. 👷 Field Engineer Priority Dispatcher
(Kth Largest Element – Medium)

🧾 Problem
Tech Mahindra's field operations platform assigns urgency scores to network fault tickets raised by telecom clients. When a dispatcher batch-assigns engineers, only the top K most urgent tickets get immediate response. Find the Kth highest urgency score — the exact dispatch threshold — so the system can instantly classify tickets without re-sorting the entire fault queue every time a new ticket arrives.

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

Multiple tickets with the same urgency score
k = 1 (only the most critical fault gets immediate response)
k = n (all faults are dispatched)

💡 Hints

Hint 1 — Sort descending, return index k-1. Simple but O(n log n) per dispatch cycle.
Hint 2 — You don't need the full ranking — just the Kth urgency threshold.
Hint 3 — Use a min-heap of size k. The heap top is always your dispatch cutoff.`;

const desc5 = `5. 🌐 Multi-Circle Network Log Merger
(Merge K Sorted Lists – Hard)

🧾 Problem
Tech Mahindra manages telecom operations across K network circles (regions) in India. Each circle's NOC maintains a sorted log of network events by timestamp. The national operations centre must merge all circle logs into one single chronologically ordered event stream to detect cascading failures that cross circle boundaries and respond before SLA penalties kick in.

📥 Input

Line 1: k — number of network circles
Next k lines: m followed by m sorted event timestamps

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

One circle had zero events (planned maintenance window)
All events from a single circle
Same timestamp across multiple circles (simultaneous faults)

💡 Hints

Hint 1 — Dump all events into one list and sort. Wastes the pre-sorted property of each circle's log.
Hint 2 — Each circle's log is pre-sorted. Can you always pick the earliest next event efficiently?
Hint 3 — Use a min-heap seeded with the first event from each circle. Pop minimum, push next from same circle.`;

const desc6 = `6. 🗼 Tower Signal Shadow Calculator
(Trapping Rain Water – Hard)

🧾 Problem
Tech Mahindra's RF planning team models a city's cell tower height profile along a corridor. Signals get shadowed and trapped between taller towers that flank shorter ones — creating dead zones where devices can't connect. Calculate the total shadow volume trapped across the tower corridor so the planning team can decide where to add repeaters or raise existing towers to eliminate coverage gaps.

📥 Input

Line 1: n — number of towers in the corridor
Line 2: n space-separated tower heights

📤 Output

Single integer — total units of trapped signal shadow volume

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

Tower heights strictly increasing or decreasing (no shadowing)
All towers at equal height
Only 1 or 2 towers in the corridor

💡 Hints

Hint 1 — Shadow at each tower = min(max_left, max_right) - height[i]. Calculate per tower.
Hint 2 — Precompute left-max and right-max arrays. O(n) time, O(n) space.
Hint 3 — Use two pointers from both ends. O(n) time, O(1) space — no extra arrays needed.`;

export const techMahindraHiringCodingProblems = [
  {
    title: "📱 Telecom Plan Cost Matcher (Two Sum)",
    description: desc1,
    inputFormat: "Line 1: n and target. Line 2: n integer plan costs.",
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
    starterCode: starterMetaAdCosts,
  },
  {
    title: "🛠️ Network Config Script Validator (Valid Parentheses)",
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
    title: "📶 5G Signal Type Unique Scan (Longest substring without repeating)",
    description: desc3,
    inputFormat: "One line: signal band sequence string s.",
    outputFormat: "Single integer (longest all-unique band sequence length) with newline.",
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
    title: "👷 Field Engineer Priority Dispatcher (Kth largest)",
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
    title: "🌐 Multi-Circle Network Log Merger (Merge K sorted lists)",
    description: desc5,
    inputFormat: "Line 1: k. Next k lines: m then m sorted integers (m may be 0).",
    outputFormat: "One line: all timestamps merged in non-decreasing order, space-separated, with newline.",
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
    title: "🗼 Tower Signal Shadow Calculator (Trapping rain water)",
    description: desc6,
    inputFormat: "Line 1: n. Line 2: n non-negative tower heights.",
    outputFormat: "Single integer (total trapped signal shadow volume units) with newline.",
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
