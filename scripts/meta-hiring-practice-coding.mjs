/**
 * Coding problems + starters for `meta-hiring-practice` (seed-public-demo-tests.mjs).
 * Ads / WhatsApp / Reels flavour; problem 1 uses `costs`; problem 6 uses `views` (trapping rain).
 */
import {
  starterGoogleBlueprintBrackets,
  starterGoogleHospitalMerge,
  starterGoogleLeaderboardK,
  starterGoogleSignalWindow,
} from "./google-hiring-practice-coding.mjs";

export const metaHiringAssessmentDelivery = {
  mcqPerAttempt: 5,
  codingPerAttempt: 6,
  easyDurationMinutes: 95,
  mediumDurationMinutes: 110,
  hardDurationMinutes: 130,
};

export const starterMetaAdCosts = {
  Python: `import sys

def solve(costs, target):
    # Write your logic here
    return [0, 1]

def main():
    data = sys.stdin.read().split()
    n, target = int(data[0]), int(data[1])
    costs = list(map(int, data[2:2+n]))
    result = solve(costs, target)
    print(result[0], result[1])

main()
`,
  Javascript: `function solve(costs, target) {
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
  const costs = data.slice(2, 2 + n);
  const r = solve(costs, target);
  process.stdout.write(String(r[0]) + " " + String(r[1]) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static int[] solve(int[] costs, int target) {
        return new int[] { 0, 1 };
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] costs = new int[n];
        for (int i = 0; i < n; i++) costs[i] = sc.nextInt();
        int[] r = solve(costs, target);
        System.out.println(r[0] + " " + r[1]);
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

pair<int,int> solve(vector<int>& costs, int target) {
    return {0, 1};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, target;
    cin >> n >> target;
    vector<int> costs(n);
    for (int i = 0; i < n; i++) cin >> costs[i];
    auto r = solve(costs, target);
    cout << r.first << " " << r.second << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <stdlib.h>

void solve(int *costs, int n, int target, int *out_i, int *out_j) {
    *out_i = 0;
    *out_j = 1;
}

int main(void) {
    int n, target;
    if (scanf("%d %d", &n, &target) != 2) return 0;
    int *costs = (int *)calloc((size_t)n, sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &costs[i]);
    int i, j;
    solve(costs, n, target, &i, &j);
    printf("%d %d\\n", i, j);
    free(costs);
    return 0;
}
`,
};

export const starterMetaStoriesViews = {
  Python: `import sys

def solve(views):
    # Write your logic here
    return 0

def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    views = list(map(int, data[1:1+n]))
    print(solve(views))

main()
`,
  Javascript: `function solve(views) {
  return 0;
}

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
  const data = lines.join("\\n").trim().split(/\\s+/).map(Number);
  const n = data[0];
  const views = data.slice(1, 1 + n);
  process.stdout.write(String(solve(views)) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static long solve(int[] views) {
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] views = new int[n];
        for (int i = 0; i < n; i++) views[i] = sc.nextInt();
        System.out.println(solve(views));
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

long long solve(vector<int>& views) {
    return 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) cin >> v[i];
    cout << solve(v) << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <stdlib.h>

long long solve(int *v, int n) {
    return 0;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *v = (int *)calloc((size_t)n, sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &v[i]);
    printf("%lld\\n", solve(v, n));
    free(v);
    return 0;
}
`,
};

const desc1 = `1. 👍 Ad Spend Pair Matcher
(Two Sum – Easy)

🧾 Problem
Meta's ads platform lets businesses set a daily campaign budget. Given a list of ad group costs, find two ad groups whose combined spend exactly matches the campaign's remaining daily budget — so the system can activate both without going over or under.

📥 Input

Line 1: n target
Line 2: n space-separated ad group costs

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

Two ad groups with identical costs
Negative costs (promotional credits/offsets)
Very large number of ad groups

💡 Hints

Hint 1 — Check every pair of ad groups. Works, but too slow for Meta's scale of millions of campaigns.
Hint 2 — Can you remember costs already seen to avoid re-scanning the list?
Hint 3 — For each cost x, check if target - x was already recorded.`;

const desc2 = `2. 💬 WhatsApp Message Template Validator
(Valid Parentheses – Easy)

🧾 Problem
WhatsApp Business lets companies send templated messages with nested dynamic fields — () for inline variables, [] for optional blocks, {} for conditional sections. Before a template goes live, Meta's approval system checks that all brackets are correctly matched and closed — a malformed template is rejected automatically. Build this check.

📥 Input

Single line string s containing only (, ), {, }, [, ]

📤 Output

YES if the template structure is valid, NO otherwise

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

Empty template
Only opening brackets with no closing pair
Correct bracket types but wrong nesting e.g. ([)]

💡 Hints

Hint 1 — Every opening bracket must be closed in exact reverse order.
Hint 2 — Think last-opened, first-closed. Which data structure models this naturally?
Hint 3 — Use a stack. Push on open, pop and match on close.`;

const desc3 = `3. 🎬 Reels Watch Diversity Window
(Longest Substring Without Repeating Characters – Medium)

🧾 Problem
Instagram's Reels recommendation engine logs content category codes as a user scrolls through their feed. The algorithm needs to find the longest uninterrupted watch streak of distinct content categories — no category repeated in the window — to measure how diverse a user's session was before they hit a repeat, and use it to tune future recommendations.

📥 Input

Single line string s — the content category sequence

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

User only watched one category of Reels the entire session
Single Reel watched
Every Reel was from a completely different category

💡 Hints

Hint 1 — Check every possible window. Way too slow for billions of user sessions.
Hint 2 — Maintain a moving window that shrinks the moment a category repeats.
Hint 3 — Track the last seen index of each category. Jump the left pointer past the repeat instantly.`;

const desc4 = `4. 📰 News Feed Ranking Cutoff
(Kth Largest Element – Medium)

🧾 Problem
Meta's News Feed algorithm assigns each post a relevance score based on engagement signals. Only the top K posts are shown to a user in their feed window. Find the Kth highest relevance score — the exact threshold — so the feed renderer can instantly filter which posts make the cut without re-ranking the entire candidate pool on every page load.

📥 Input

Line 1: n k
Line 2: n space-separated relevance scores

📤 Output

Single integer — the Kth largest relevance score

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

Multiple posts with identical relevance scores
k = 1 (only the top post shown)
k = n (all posts qualify)

💡 Hints

Hint 1 — Sort descending, return index k-1. Simple but O(n log n) on every feed refresh.
Hint 2 — You don't need the full ranking — just the Kth cutoff score.
Hint 3 — Use a min-heap of size k. The heap top is always your feed cutoff.`;

const desc5 = `5. 🌐 Multi-Region Comment Stream Merger
(Merge K Sorted Lists – Hard)

🧾 Problem
A viral Facebook post receives comments simultaneously from K geographic regions — each region's comment server maintains a locally sorted list of comment timestamps. Meta's global feed aggregator must merge all regional comment streams into one single chronologically sorted comment thread so every user worldwide sees the same consistent view.

📥 Input

Line 1: k — number of regional servers
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

One region had zero comments (outage/no activity)
All comments from a single region
Same timestamp from multiple regions

💡 Hints

Hint 1 — Dump all timestamps into one list and sort. Ignores that each region's stream is pre-sorted.
Hint 2 — Each regional stream is already sorted. Can you always pick the earliest next comment efficiently?
Hint 3 — Use a min-heap seeded with the first comment from each region. Pop minimum, push next from same region.`;

const desc6 = `6. 🖼️ Stories Viewer Engagement Trap
(Trapping Rain Water – Hard)

🧾 Problem
Meta's Stories analytics team models a creator's daily viewer drop-off across story frames as a bar chart of view counts. Viewers get "trapped" between highly engaging frames — they keep watching even through low-engagement frames sandwiched between viral ones. Calculate the total trapped engagement volume across the story arc to help creators identify which frame sequences hold audiences most effectively.

📥 Input

Line 1: n — number of story frames
Line 2: n space-separated view counts per frame

📤 Output

Single integer — total units of trapped viewer engagement

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

View counts strictly increase or decrease across frames (no trapping)
All frames have identical view counts
Only 1 or 2 frames in the story

💡 Hints

Hint 1 — Trapped engagement at each frame = min(max_left, max_right) - views[i]. Calculate per frame.
Hint 2 — Precompute left-max and right-max arrays. O(n) time, O(n) space.
Hint 3 — Use two pointers from both ends. O(n) time, O(1) space — no extra arrays needed.`;

export const metaHiringCodingProblems = [
  {
    title: "👍 Ad Spend Pair Matcher (Two Sum)",
    description: desc1,
    inputFormat: "Line 1: n and target. Line 2: n integer ad group costs.",
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
    title: "💬 WhatsApp Message Template Validator (Valid Parentheses)",
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
    title: "🎬 Reels Watch Diversity Window (Longest substring without repeating)",
    description: desc3,
    inputFormat: "One line: content category sequence string s.",
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
    title: "📰 News Feed Ranking Cutoff (Kth largest)",
    description: desc4,
    inputFormat: "Line 1: n k. Line 2: n integers (relevance scores).",
    outputFormat: "Single integer (Kth largest relevance score) with newline.",
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
    title: "🌐 Multi-Region Comment Stream Merger (Merge K sorted lists)",
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
    title: "🖼️ Stories Viewer Engagement Trap (Trapping rain water)",
    description: desc6,
    inputFormat: "Line 1: n. Line 2: n non-negative view counts per frame.",
    outputFormat: "Single integer (total trapped engagement units) with newline.",
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
    starterCode: starterMetaStoriesViews,
  },
];
