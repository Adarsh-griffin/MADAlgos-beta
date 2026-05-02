/**
 * Coding problems + starters for `google-hiring-practice` (seed-public-demo-tests.mjs).
 * Starter keys: Javascript, Python, Java, C++, C (match assessment harness).
 */

export const googleHiringAssessmentDelivery = {
  mcqPerAttempt: 5,
  codingPerAttempt: 6,
  easyDurationMinutes: 95,
  mediumDurationMinutes: 110,
  hardDurationMinutes: 130,
};

export const starterGoogleDeliveryPair = {
  Python: `import sys

def solve(weights, target):
    # Write your logic here
    return [0, 1]

def main():
    data = sys.stdin.read().split()
    n, target = int(data[0]), int(data[1])
    weights = list(map(int, data[2:2+n]))
    result = solve(weights, target)
    print(result[0], result[1])

main()
`,
  Javascript: `function solve(weights, target) {
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
  const weights = data.slice(2, 2 + n);
  const r = solve(weights, target);
  process.stdout.write(String(r[0]) + " " + String(r[1]) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static int[] solve(int[] weights, int target) {
        return new int[] { 0, 1 };
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] weights = new int[n];
        for (int i = 0; i < n; i++) weights[i] = sc.nextInt();
        int[] r = solve(weights, target);
        System.out.println(r[0] + " " + r[1]);
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

pair<int,int> solve(vector<int>& weights, int target) {
    return {0, 1};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, target;
    cin >> n >> target;
    vector<int> weights(n);
    for (int i = 0; i < n; i++) cin >> weights[i];
    auto r = solve(weights, target);
    cout << r.first << " " << r.second << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <stdlib.h>

void solve(int *weights, int n, int target, int *out_i, int *out_j) {
    *out_i = 0;
    *out_j = 1;
}

int main(void) {
    int n, target;
    if (scanf("%d %d", &n, &target) != 2) return 0;
    int *w = (int *)calloc((size_t)n, sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &w[i]);
    int i, j;
    solve(w, n, target, &i, &j);
    printf("%d %d\\n", i, j);
    free(w);
    return 0;
}
`,
};

export const starterGoogleBlueprintBrackets = {
  Python: `import sys

def solve(s):
    # Write your logic here
    return "NO"

def main():
    s = sys.stdin.readline().strip()
    print(solve(s))

main()
`,
  Javascript: `function solve(s) {
  return "NO";
}

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });
rl.on("line", (line) => {
  process.stdout.write(solve(line.trim()) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static String solve(String s) {
        return "NO";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        System.out.println(solve(s));
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

string solve(string s) {
    return "NO";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    getline(cin, s);
    cout << solve(s) << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <string.h>

void solve(const char *s, char *out) {
    strcpy(out, "NO");
}

int main(void) {
    char buf[8192];
    if (!fgets(buf, sizeof buf, stdin)) return 0;
    size_t len = strlen(buf);
    while (len > 0 && (buf[len-1] == '\\n' || buf[len-1] == '\\r')) buf[--len] = '\\0';
    char out[8];
    solve(buf, out);
    printf("%s\\n", out);
    return 0;
}
`,
};

export const starterGoogleSignalWindow = {
  Python: `import sys

def solve(s):
    # Write your logic here
    return 0

def main():
    s = sys.stdin.readline().rstrip("\\n")
    print(solve(s))

main()
`,
  Javascript: `function solve(s) {
  return 0;
}

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });
rl.on("line", (line) => {
  process.stdout.write(String(solve(line)) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static int solve(String s) {
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        System.out.println(solve(s));
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

int solve(string s) {
    return 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    getline(cin, s);
    cout << solve(s) << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <string.h>

int solve(const char *s) {
    return 0;
}

int main(void) {
    char buf[200005];
    if (!fgets(buf, sizeof buf, stdin)) return 0;
    size_t len = strlen(buf);
    while (len > 0 && (buf[len-1] == '\\n' || buf[len-1] == '\\r')) buf[--len] = '\\0';
    printf("%d\\n", solve(buf));
    return 0;
}
`,
};

export const starterGoogleLeaderboardK = {
  Python: `import sys

def solve(scores, k):
    # Write your logic here
    return 0

def main():
    data = sys.stdin.read().split()
    n, k = int(data[0]), int(data[1])
    scores = list(map(int, data[2:2+n]))
    print(solve(scores, k))

main()
`,
  Javascript: `function solve(scores, k) {
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
  const scores = data.slice(2, 2 + n);
  process.stdout.write(String(solve(scores, k)) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static long solve(int[] scores, int k) {
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        int[] scores = new int[n];
        for (int i = 0; i < n; i++) scores[i] = sc.nextInt();
        System.out.println(solve(scores, k));
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

long long solve(vector<int>& scores, int k) {
    return 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<int> scores(n);
    for (int i = 0; i < n; i++) cin >> scores[i];
    cout << solve(scores, k) << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <stdlib.h>

long long solve(int *scores, int n, int k) {
    return 0;
}

int main(void) {
    int n, k;
    if (scanf("%d %d", &n, &k) != 2) return 0;
    int *scores = (int *)calloc((size_t)n, sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &scores[i]);
    printf("%lld\\n", solve(scores, n, k));
    free(scores);
    return 0;
}
`,
};

export const starterGoogleHospitalMerge = {
  Python: `import sys

def solve(lists):
    # Write your logic here
    return []

def main():
    input_data = sys.stdin.read().split("\\n")
    k = int(input_data[0])
    lists = []
    for i in range(1, k + 1):
        row = list(map(int, input_data[i].split()))
        m = row[0]
        lists.append(row[1:m+1])
    result = solve(lists)
    print(*result)

main()
`,
  Javascript: `function solve(lists) {
  return [];
}

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
  const k = parseInt(lines[0] || "0", 10) || 0;
  const lists = [];
  for (let i = 1; i <= k; i++) {
    const row = (lines[i] || "").trim().split(/\\s+/).filter(Boolean).map(Number);
    const m = row[0] || 0;
    lists.push(row.slice(1, 1 + m));
  }
  const r = solve(lists);
  process.stdout.write(r.join(" ") + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static List<Integer> solve(List<List<Integer>> lists) {
        return new ArrayList<>();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int k = sc.nextInt();
        List<List<Integer>> lists = new ArrayList<>();
        for (int i = 0; i < k; i++) {
            int m = sc.nextInt();
            List<Integer> row = new ArrayList<>();
            for (int j = 0; j < m; j++) row.add(sc.nextInt());
            lists.add(row);
        }
        List<Integer> r = solve(lists);
        for (int i = 0; i < r.size(); i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(r.get(i));
        }
        System.out.println();
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

vector<int> solve(vector<vector<int>>& lists) {
    return {};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int k;
    cin >> k;
    vector<vector<int>> lists(k);
    for (int i = 0; i < k; i++) {
        int m;
        cin >> m;
        lists[i].resize(m);
        for (int j = 0; j < m; j++) cin >> lists[i][j];
    }
    vector<int> r = solve(lists);
    for (size_t i = 0; i < r.size(); i++) {
        if (i) cout << " ";
        cout << r[i];
    }
    cout << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <stdlib.h>

void solve(int **lists, int *sizes, int k, int *out, int *out_len) {
    *out_len = 0;
}

int main(void) {
    int k;
    if (scanf("%d", &k) != 1) return 0;
    int **lists = calloc((size_t)k, sizeof(int*));
    int *sizes = calloc((size_t)k, sizeof(int));
    int total = 0;
    for (int i = 0; i < k; i++) {
        int m;
        scanf("%d", &m);
        sizes[i] = m;
        lists[i] = m > 0 ? calloc((size_t)m, sizeof(int)) : NULL;
        for (int j = 0; j < m; j++) scanf("%d", &lists[i][j]);
        total += m;
    }
    int *out = calloc((size_t)(total > 0 ? total : 1), sizeof(int));
    int len = 0;
    solve(lists, sizes, k, out, &len);
    for (int i = 0; i < len; i++) {
        if (i) printf(" ");
        printf("%d", out[i]);
    }
    printf("\\n");
    for (int i = 0; i < k; i++) free(lists[i]);
    free(lists);
    free(sizes);
    free(out);
    return 0;
}
`,
};

export const starterGoogleDrainage = {
  Python: `import sys

def solve(heights):
    # Write your logic here
    return 0

def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    heights = list(map(int, data[1:1+n]))
    print(solve(heights))

main()
`,
  Javascript: `function solve(heights) {
  return 0;
}

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
  const data = lines.join("\\n").trim().split(/\\s+/).map(Number);
  const n = data[0];
  const heights = data.slice(1, 1 + n);
  process.stdout.write(String(solve(heights)) + "\\n");
});
`,
  Java: `import java.util.*;

public class Main {
    static long solve(int[] heights) {
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] heights = new int[n];
        for (int i = 0; i < n; i++) heights[i] = sc.nextInt();
        System.out.println(solve(heights));
        sc.close();
    }
}
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

long long solve(vector<int>& heights) {
    return 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> h(n);
    for (int i = 0; i < n; i++) cin >> h[i];
    cout << solve(h) << "\\n";
    return 0;
}
`,
  C: `#include <stdio.h>
#include <stdlib.h>

long long solve(int *h, int n) {
    return 0;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *h = (int *)calloc((size_t)n, sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &h[i]);
    printf("%lld\\n", solve(h, n));
    free(h);
    return 0;
}
`,
};

const desc1 = `1. 🚚 Delivery Pair Match
(Two Sum – Easy)

🧾 Problem
Amazon's delivery hub needs to exactly fill a truck. Given a list of package weights and a truck's capacity, find two packages whose combined weight perfectly matches the capacity.

📥 Input

Line 1: n target
Line 2: n space-separated weights

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

Same weight appears twice
Negative weights allowed
Large input size

💡 Hints

Hint 1 — Check every pair of packages. Works, but slow for large warehouses.
Hint 2 — Can you remember weights you've already seen to avoid re-scanning?
Hint 3 — For each weight x, check if target - x was already logged.`;

const desc2 = `2. 🏗️ Blueprint Bracket Validator
(Valid Parentheses – Easy)

🧾 Problem
A CAD tool at a construction firm generates structural blueprints using nested bracket notation — () for rooms, [] for floors, {} for buildings. A mismatched bracket means a corrupt blueprint. Write a validator that checks if the notation is structurally sound.

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
Only opening brackets
Correct brackets but wrong order e.g. ([)])

💡 Hints

Hint 1 — Every opening bracket must be closed in the correct reverse order.
Hint 2 — Think last-opened, first-closed. Which data structure works that way?
Hint 3 — Use a stack. Push on open, pop and match on close.`;

const desc3 = `3. 📡 Unique Signal Window
(Longest Substring Without Repeating Characters – Medium)

🧾 Problem
A telecom company's signal analyser reads a stream of channel codes. Engineers need to find the longest clean signal window — a continuous stretch of codes with no repeated channel — to optimise bandwidth allocation.

📥 Input

Single line string s representing the signal stream

📤 Output

Single integer — length of the longest non-repeating window

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

All characters identical
Single character string
All unique characters

💡 Hints

Hint 1 — Check every possible substring. Very slow for long signals.
Hint 2 — Can you maintain a moving window that shrinks when a repeat is found?
Hint 3 — Track the last seen index of each character. Jump the left pointer past the duplicate instantly.`;

const desc4 = `4. 🏆 Leaderboard Rank Finder
(Kth Largest Element – Medium)

🧾 Problem
A gaming platform updates live leaderboards after every match. Given a list of player scores, quickly find the Kth highest score — used to determine prize tier cutoffs without sorting the entire board every time.

📥 Input

Line 1: n k
Line 2: n space-separated scores

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

Duplicate scores
k = 1 (highest score)
k = n (lowest score)

💡 Hints

Hint 1 — Sort all scores descending, pick index k-1. Simple but O(n log n).
Hint 2 — Do you actually need the full sorted order, or just the Kth position?
Hint 3 — Maintain a min-heap of size k. The top of the heap is always your answer.`;

const desc5 = `5. 🏥 Hospital Queue Merger
(Merge K Sorted Lists – Hard)

🧾 Problem
A hospital system has K departments, each maintaining a sorted waitlist of patient priority scores. Merge all department waitlists into a single unified sorted queue so the central triage team can process patients in the correct order.

📥 Input

Line 1: k — number of departments
Next k lines: m followed by m sorted priority scores

📤 Output

One line with all scores merged and sorted

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

One department has an empty waitlist
All patients in one department
Duplicate scores across departments

💡 Hints

Hint 1 — Dump all scores into one list and sort. Easy but wastes the pre-sorted property.
Hint 2 — Each list is already sorted. Can you always pick the smallest next patient efficiently?
Hint 3 — Use a min-heap seeded with the first patient from each department. Pop minimum, push next from same department.`;

const desc6 = `6. 🌧️ City Drainage Calculator
(Trapping Rain Water – Hard)

🧾 Problem
A city's urban planning department models building skylines as elevation maps. After heavy rain, water gets trapped between taller buildings. Calculate the total volume of rainwater the city block retains — critical for flood risk assessment and drainage system design.

📥 Input

Line 1: n — number of blocks
Line 2: n space-separated building heights

📤 Output

Single integer — total units of trapped rainwater

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

Monotonically increasing or decreasing skyline (no water trapped)
All buildings same height
Single or two buildings

💡 Hints

Hint 1 — Water above each block = min(max_left, max_right) - height[i]. Calculate per column.
Hint 2 — Precompute left-max and right-max arrays. O(n) time, O(n) space.
Hint 3 — Use two pointers from both ends to do it in O(1) space.`;

export const googleHiringCodingProblems = [
  {
    title: "🚚 Delivery Pair Match (Two Sum)",
    description: desc1,
    inputFormat: "Line 1: n and target. Line 2: n integer weights.",
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
    title: "🏗️ Blueprint Bracket Validator (Valid Parentheses)",
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
    title: "📡 Unique Signal Window (Longest substring without repeating)",
    description: desc3,
    inputFormat: "One line: signal string s.",
    outputFormat: "Single integer (length) with newline.",
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
    title: "🏆 Leaderboard Rank Finder (Kth largest)",
    description: desc4,
    inputFormat: "Line 1: n k. Line 2: n integers (scores).",
    outputFormat: "Single integer (Kth largest) with newline.",
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
    title: "🏥 Hospital Queue Merger (Merge K sorted lists)",
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
    title: "🌧️ City Drainage Calculator (Trapping rain water)",
    description: desc6,
    inputFormat: "Line 1: n. Line 2: n non-negative heights.",
    outputFormat: "Single integer (trapped water units) with newline.",
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
