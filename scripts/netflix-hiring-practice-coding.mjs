/**
 * Coding problems + starters for `netflix-hiring-practice` (seed-public-demo-tests.mjs).
 * Streaming/CDN flavour; problem 1 `runtimes`; problem 4 `loads`; problem 6 `rates` (trapping rain).
 */
import {
  starterGoogleBlueprintBrackets,
  starterGoogleHospitalMerge,
  starterGoogleSignalWindow,
} from "./google-hiring-practice-coding.mjs";

export const netflixHiringAssessmentDelivery = {
  mcqPerAttempt: 5,
  codingPerAttempt: 6,
  easyDurationMinutes: 95,
  mediumDurationMinutes: 110,
  hardDurationMinutes: 130,
};

export const starterNetflixStreamingRuntimes = {
  Python: `import sys

def solve(runtimes, target):
    # Write your logic here
    return [0, 1]

def main():
    data = sys.stdin.read().split()
    n, target = int(data[0]), int(data[1])
    runtimes = list(map(int, data[2:2+n]))
    result = solve(runtimes, target)
    print(result[0], result[1])

main()
`,
  Javascript: `function solve(runtimes, target) {
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
  const runtimes = data.slice(2, 2 + n);
  const r = solve(runtimes, target);
  process.stdout.write(String(r[0]) + " " + String(r[1]) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static int[] solve(int[] runtimes, int target) {
        return new int[] { 0, 1 };
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] runtimes = new int[n];
        for (int i = 0; i < n; i++) runtimes[i] = sc.nextInt();
        int[] r = solve(runtimes, target);
        System.out.println(r[0] + " " + r[1]);
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

pair<int,int> solve(vector<int>& runtimes, int target) {
    return {0, 1};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, target;
    cin >> n >> target;
    vector<int> runtimes(n);
    for (int i = 0; i < n; i++) cin >> runtimes[i];
    auto r = solve(runtimes, target);
    cout << r.first << " " << r.second << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <stdlib.h>

void solve(int *runtimes, int n, int target, int *out_i, int *out_j) {
    *out_i = 0;
    *out_j = 1;
}

int main(void) {
    int n, target;
    if (scanf("%d %d", &n, &target) != 2) return 0;
    int *runtimes = (int *)calloc((size_t)n, sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &runtimes[i]);
    int i, j;
    solve(runtimes, n, target, &i, &j);
    printf("%d %d\\n", i, j);
    free(runtimes);
    return 0;
}
`,
};

export const starterNetflixCdnLoads = {
  Python: `import sys

def solve(loads, k):
    # Write your logic here
    return 0

def main():
    data = sys.stdin.read().split()
    n, k = int(data[0]), int(data[1])
    loads = list(map(int, data[2:2+n]))
    print(solve(loads, k))

main()
`,
  Javascript: `function solve(loads, k) {
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
  const loads = data.slice(2, 2 + n);
  process.stdout.write(String(solve(loads, k)) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static long solve(int[] loads, int k) {
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        int[] loads = new int[n];
        for (int i = 0; i < n; i++) loads[i] = sc.nextInt();
        System.out.println(solve(loads, k));
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

long long solve(vector<int>& loads, int k) {
    return 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<int> loads(n);
    for (int i = 0; i < n; i++) cin >> loads[i];
    cout << solve(loads, k) << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <stdlib.h>

long long solve(int *loads, int n, int k) {
    return 0;
}

int main(void) {
    int n, k;
    if (scanf("%d %d", &n, &k) != 2) return 0;
    int *loads = (int *)calloc((size_t)n, sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &loads[i]);
    printf("%lld\\n", solve(loads, n, k));
    free(loads);
    return 0;
}
`,
};

export const starterNetflixEncodingRates = {
  Python: `import sys

def solve(rates):
    # Write your logic here
    return 0

def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    rates = list(map(int, data[1:1+n]))
    print(solve(rates))

main()
`,
  Javascript: `function solve(rates) {
  return 0;
}

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
  const data = lines.join("\\n").trim().split(/\\s+/).map(Number);
  const n = data[0];
  const rates = data.slice(1, 1 + n);
  process.stdout.write(String(solve(rates)) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static long solve(int[] rates) {
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] rates = new int[n];
        for (int i = 0; i < n; i++) rates[i] = sc.nextInt();
        System.out.println(solve(rates));
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

long long solve(vector<int>& rates) {
    return 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> r(n);
    for (int i = 0; i < n; i++) cin >> r[i];
    cout << solve(r) << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <stdlib.h>

long long solve(int *r, int n) {
    return 0;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *r = (int *)calloc((size_t)n, sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &r[i]);
    printf("%lld\\n", solve(r, n));
    free(r);
    return 0;
}
`,
};

const desc1 = `1. 🎬 Streaming Bundle Slot Filler
(Two Sum – Easy)

🧾 Problem
Netflix's content licensing team purchases shows in content minute blocks. Each title has a fixed runtime. The acquisitions manager needs to find two titles whose combined runtime exactly fills a licensed broadcast slot — so the slot is fully used without overscheduling or dead air.

📥 Input

Line 1: n target
Line 2: n space-separated title runtimes (in minutes)

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

Two titles with identical runtimes
Negative values (runtime offsets from edited cuts)
Very large content library

💡 Hints

Hint 1 — Check every pair of titles. Works, but too slow for a catalogue of hundreds of thousands.
Hint 2 — Can you remember runtimes already seen to avoid re-scanning the library?
Hint 3 — For each runtime x, check if target - x was already recorded.`;

const desc2 = `2. 🎞️ Subtitle Markup Validator
(Valid Parentheses – Easy)

🧾 Problem
Netflix's subtitle rendering engine processes styled subtitle scripts where formatting tags use nested bracket notation — () for timing cues, [] for language directives, {} for style overrides. A mismatched bracket means the subtitle file is corrupt and falls back to plain text — ruining the viewing experience. Build the pre-render validator.

📥 Input

Single line string s containing only (, ), {, }, [, ]

📤 Output

YES if the subtitle markup is valid, NO otherwise

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

Empty subtitle file
Only opening tags with no closing pair
Correct bracket types but wrong nesting e.g. ([)]

💡 Hints

Hint 1 — Every opening bracket must be closed in exact reverse order.
Hint 2 — Think last-opened, first-closed. Which data structure models this naturally?
Hint 3 — Use a stack. Push on open, pop and match on close.`;

const desc3 = `3. 📺 Recommendation Genre Diversity Window
(Longest Substring Without Repeating Characters – Medium)

🧾 Problem
Netflix's recommendation engine logs the genre codes of titles a user watches in sequence. The algorithm measures the longest uninterrupted watch streak of distinct genres — no genre repeated within the window — to score how broadly a user is exploring content. A higher score triggers more diverse recommendations in their next session.

📥 Input

Single line string s — the genre watch sequence

📤 Output

Single integer — length of the longest all-unique genre streak

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

User only watched one genre the entire session
Single title watched
Every title was from a completely different genre

💡 Hints

Hint 1 — Check every possible streak. Too slow for billions of user watch sessions daily.
Hint 2 — Maintain a moving window that shrinks the moment a genre repeats.
Hint 3 — Track the last seen index of each genre. Jump the left pointer past the repeat instantly.`;

const desc4 = `4. 📡 CDN Server Load Cutoff
(Kth Largest Element – Medium)

🧾 Problem
Netflix's CDN routes video streams across thousands of edge servers. Each server reports a current load score. When the traffic manager scales up capacity, it activates only the top K most loaded servers for rebalancing. Find the Kth highest load score — the exact activation threshold — so the system can make instant routing decisions without re-sorting the entire server fleet on every traffic spike.

📥 Input

Line 1: n k
Line 2: n space-separated server load scores

📤 Output

Single integer — the Kth largest load score

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

Multiple servers reporting identical load scores
k = 1 (only the most overloaded server)
k = n (all servers get rebalanced)

💡 Hints

Hint 1 — Sort descending, return index k-1. Simple but O(n log n) on every traffic spike.
Hint 2 — You don't need the full server ranking — just the Kth load threshold.
Hint 3 — Use a min-heap of size k. The heap top is always your activation cutoff.`;

const desc5 = `5. 🌍 Multi-Region Playback Event Merger
(Merge K Sorted Lists – Hard)

🧾 Problem
Netflix streams to K regions worldwide. Each region's playback analytics server maintains a sorted log of viewing events by timestamp. The central data pipeline must merge all regional logs into one globally sorted event stream — so the A/B testing team can replay user behaviour in exact chronological order across all geographies to measure feature rollout impact.

📥 Input

Line 1: k — number of regions
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

One region had a total outage (empty log)
All events from a single region
Same timestamp from multiple regions (simultaneous global viewers)

💡 Hints

Hint 1 — Dump all events into one list and sort. Wastes the pre-sorted property of each region's log.
Hint 2 — Each region's log is already sorted. Can you always pick the earliest next event efficiently?
Hint 3 — Use a min-heap seeded with the first event from each region. Pop minimum, push next from same region.`;

const desc6 = `6. 🎥 Video Encoding Buffer Trap
(Trapping Rain Water – Hard)

🧾 Problem
Netflix's video encoding pipeline processes each title through a series of compression stages with varying throughput rates (frames/sec). Frames pile up and get buffered between faster stages that flank slower ones — creating encoding delays. Calculate the total buffered frame volume trapped across the encoding pipeline so the infrastructure team can reprovision slow stages and hit 4K encoding SLAs on time.

📥 Input

Line 1: n — number of encoding stages
Line 2: n space-separated throughput rates

📤 Output

Single integer — total units of buffered frames trapped

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

Throughput strictly increasing or decreasing (no buffering)
All stages at identical throughput
Only 1 or 2 encoding stages

💡 Hints

Hint 1 — Buffered frames at each stage = min(max_left, max_right) - rate[i]. Calculate per stage.
Hint 2 — Precompute left-max and right-max arrays. O(n) time, O(n) space.
Hint 3 — Use two pointers from both ends. O(n) time, O(1) space — no extra arrays needed.`;

export const netflixHiringCodingProblems = [
  {
    title: "🎬 Streaming Bundle Slot Filler (Two Sum)",
    description: desc1,
    inputFormat: "Line 1: n and target. Line 2: n integer title runtimes (minutes).",
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
    starterCode: starterNetflixStreamingRuntimes,
  },
  {
    title: "🎞️ Subtitle Markup Validator (Valid Parentheses)",
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
    title: "📺 Recommendation Genre Diversity Window (Longest substring without repeating)",
    description: desc3,
    inputFormat: "One line: genre watch sequence string s.",
    outputFormat: "Single integer (longest all-unique genre streak length) with newline.",
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
    title: "📡 CDN Server Load Cutoff (Kth largest)",
    description: desc4,
    inputFormat: "Line 1: n k. Line 2: n integers (server load scores).",
    outputFormat: "Single integer (Kth largest load score) with newline.",
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
    starterCode: starterNetflixCdnLoads,
  },
  {
    title: "🌍 Multi-Region Playback Event Merger (Merge K sorted lists)",
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
    title: "🎥 Video Encoding Buffer Trap (Trapping rain water)",
    description: desc6,
    inputFormat: "Line 1: n. Line 2: n non-negative throughput rates.",
    outputFormat: "Single integer (total buffered frame units trapped) with newline.",
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
    starterCode: starterNetflixEncodingRates,
  },
];
