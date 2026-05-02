/**
 * Coding problems + starters for `apple-hiring-practice` (seed-public-demo-tests.mjs).
 * Apple Music / Health / iCloud flavour; problem 1 uses `sizes`; problem 6 uses `heights` (starterGoogleDrainage).
 */
import {
  starterGoogleBlueprintBrackets,
  starterGoogleDrainage,
  starterGoogleHospitalMerge,
  starterGoogleLeaderboardK,
  starterGoogleSignalWindow,
} from "./google-hiring-practice-coding.mjs";

export const appleHiringAssessmentDelivery = {
  mcqPerAttempt: 5,
  codingPerAttempt: 6,
  easyDurationMinutes: 95,
  mediumDurationMinutes: 110,
  hardDurationMinutes: 130,
};

export const starterApplePlaylistSizes = {
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

const desc1 = `1. 🎵 Apple Music Playlist Budget Filler
(Two Sum – Easy)

🧾 Problem
Apple Music's offline download manager lets users save songs within a storage quota. Given a list of song file sizes (in MB), find two songs whose combined size exactly fills the remaining storage slot — so the device is neither over-downloaded nor left with wasted offline space.

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

Two songs with identical file sizes
Negative values (delta offsets from compression)
Very large song catalogue

💡 Hints

Hint 1 — Check every pair of songs. Works, but too slow for a catalogue of millions of tracks.
Hint 2 — Can you remember file sizes already seen to avoid re-scanning?
Hint 3 — For each size x, check if target - x was already recorded.`;

const desc2 = `2. 🍎 App Store Review Tag Validator
(Valid Parentheses – Easy)

🧾 Problem
Apple's App Store review system allows developers to submit structured metadata tags for app descriptions using nested markup — () for inline attributes, [] for localisation blocks, {} for feature groups. Before publishing, the submission pipeline validates that all brackets are correctly matched — malformed metadata is auto-rejected. Build the validator.

📥 Input

Single line string s containing only (, ), {, }, [, ]

📤 Output

YES if the metadata structure is valid, NO otherwise

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

Empty metadata string
Only opening brackets with no closing pair
Correct types but wrong nesting e.g. ([)]

💡 Hints

Hint 1 — Every opening bracket must be closed in exact reverse order.
Hint 2 — Think last-opened, first-closed. Which data structure models this naturally?
Hint 3 — Use a stack. Push on open, pop and match on close.`;

const desc3 = `3. 🎧 AirPods Noise Profile Unique Window
(Longest Substring Without Repeating Characters – Medium)

🧾 Problem
Apple's AirPods Pro active noise cancellation system samples the ambient sound environment and classifies each sample into a noise profile category. The DSP engine needs the longest uninterrupted sequence of distinct noise profiles — no category repeated within the window — to calibrate the most effective filter without reprocessing overlapping environments.

📥 Input

Single line string s — the noise profile sample sequence

📤 Output

Single integer — length of the longest all-unique profile sequence

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

Device sampled only one noise environment throughout
Single sample in the log
All samples from completely distinct environments

💡 Hints

Hint 1 — Check every possible window. Too slow for real-time DSP processing.
Hint 2 — Maintain a moving window that shrinks the moment a profile category repeats.
Hint 3 — Track the last seen index of each profile. Jump the left pointer past the repeat instantly.`;

const desc4 = `4. ❤️ Apple Health Sensor Priority Alert
(Kth Largest Element – Medium)

🧾 Problem
Apple Watch's health engine continuously collects anomaly scores from body sensors — heart rate spikes, blood oxygen dips, irregular rhythms. When the alert system fires, it needs to surface the Kth most critical anomaly — the exact severity cutoff separating alerts that trigger a notification from those that are silently logged — without re-sorting the entire sensor history on every heartbeat.

📥 Input

Line 1: n k
Line 2: n space-separated anomaly scores

📤 Output

Single integer — the Kth largest anomaly score

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

Multiple sensors reporting the same anomaly score
k = 1 (only the most critical alert fires)
k = n (every anomaly triggers a notification)

💡 Hints

Hint 1 — Sort descending, return index k-1. Simple but O(n log n) per heartbeat cycle.
Hint 2 — You don't need full ranking — just the Kth severity cutoff.
Hint 3 — Use a min-heap of size k. The heap top is always your alert threshold.`;

const desc5 = `5. ☁️ iCloud Multi-Device Sync Merger
(Merge K Sorted Lists – Hard)

🧾 Problem
iCloud syncs data across K of a user's devices — iPhone, iPad, MacBook, Apple Watch, and more. Each device maintains a locally sorted log of file change events by timestamp. When the iCloud server reconciles a sync, it must merge all device logs into one single chronologically ordered change history to apply updates in the correct sequence without conflicts.

📥 Input

Line 1: k — number of devices
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

One device was offline and sent no events
All events from a single device
Same timestamp across multiple devices (simultaneous edits)

💡 Hints

Hint 1 — Dump all events into one list and sort. Wastes the fact each device log is pre-sorted.
Hint 2 — Each device log is already sorted. Can you always pick the earliest next event efficiently?
Hint 3 — Use a min-heap seeded with the first event from each device. Pop minimum, push next from same device.`;

const desc6 = `6. 🌧️ iPhone Camera Lens Flare Trap
(Trapping Rain Water – Hard)

🧾 Problem
Apple's computational photography team models the lens aperture profile as a height map of light-blocking segments. Light scatters and gets trapped between taller lens elements, creating internal reflections — lens flare artefacts. Calculate the total volume of trapped light across the aperture cross-section so the optics team can redesign the coating layers to eliminate flare in the next iPhone camera module.

📥 Input

Line 1: n — number of aperture segments
Line 2: n space-separated segment heights

📤 Output

Single integer — total units of trapped light volume

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

Aperture segments strictly increasing or decreasing (no light trapped)
All segments at equal height
Only 1 or 2 segments in the profile

💡 Hints

Hint 1 — Trapped light at each segment = min(max_left, max_right) - height[i]. Calculate per segment.
Hint 2 — Precompute left-max and right-max arrays. O(n) time, O(n) space.
Hint 3 — Use two pointers from both ends. O(n) time, O(1) space — no extra arrays needed.`;

export const appleHiringCodingProblems = [
  {
    title: "🎵 Apple Music Playlist Budget Filler (Two Sum)",
    description: desc1,
    inputFormat: "Line 1: n and target. Line 2: n integer song file sizes (MB).",
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
    starterCode: starterApplePlaylistSizes,
  },
  {
    title: "🍎 App Store Review Tag Validator (Valid Parentheses)",
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
    title: "🎧 AirPods Noise Profile Unique Window (Longest substring without repeating)",
    description: desc3,
    inputFormat: "One line: noise profile sample sequence string s.",
    outputFormat: "Single integer (longest all-unique profile sequence length) with newline.",
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
    title: "❤️ Apple Health Sensor Priority Alert (Kth largest)",
    description: desc4,
    inputFormat: "Line 1: n k. Line 2: n integers (anomaly scores).",
    outputFormat: "Single integer (Kth largest anomaly score) with newline.",
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
    title: "☁️ iCloud Multi-Device Sync Merger (Merge K sorted lists)",
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
    title: "🌧️ iPhone Camera Lens Flare Trap (Trapping rain water)",
    description: desc6,
    inputFormat: "Line 1: n. Line 2: n non-negative segment heights.",
    outputFormat: "Single integer (total trapped light volume units) with newline.",
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
