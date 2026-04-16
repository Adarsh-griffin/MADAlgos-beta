import { STUDENT_CODE_ZONE_BANNER } from "@/lib/assessment-code-starters";
import type { InHouseBlind75Entry } from "@/data/blind75-in-house-types";

const B = STUDENT_CODE_ZONE_BANNER;

/** Word Break … Insert Interval (BLIND_75 slugs 20–39, 0-based index 19–38) */
export const BLIND75_IN_HOUSE_PART_B: Record<string, InHouseBlind75Entry> = {
  "word-break": {
    description:
      "You are given a string s and a dictionary of words.\n\n" +
      "Return YES if s can be segmented into a sequence of one or more dictionary words (no extra characters). Otherwise NO.",
    inputFormat:
      "Line 1: string s (lowercase letters).\nLine 2: integer k.\nLine 3: k space-separated distinct words.",
    outputFormat: "YES or NO on one line.",
    sampleTestCases: [{ input: "leetcode\n2\nleet code\n", output: "YES\n" }],
    hiddenTestCases: [
      { input: "catsandog\n5\ncats dog sand and cat\n", output: "NO\n" },
      { input: "a\n1\na\n", output: "YES\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(s, words) {\n  return "NO";\n}\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (l) => lines.push(l));\nrl.on("close", () => {\n  const s = (lines[0] || "").trim();\n  const words = (lines[2] || "").trim().split(/\\s+/).filter(Boolean);\n  process.stdout.write(solve(s, words) + "\\n");\n});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(s: str, words: list[str]) -> str:\n    return "NO"\n\ndef main():\n    lines = sys.stdin.read().splitlines()\n    s = lines[0].strip()\n    words = lines[2].split()\n    sys.stdout.write(solve(s, words) + "\\n")\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main {\n    static String solve(String s, String[] words) { return "NO"; }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        int k = sc.nextInt(); sc.nextLine();\n        String[] words = sc.nextLine().trim().split("\\\\s+");\n        System.out.println(solve(s, words));\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `string solve(string s, vector<string> words) { return "NO"; }\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    string s; getline(cin, s);\n    int k; cin >> k; cin.ignore();\n    string line; getline(cin, line);\n    stringstream ss(line); vector<string> words; string w;\n    while (ss >> w) words.push_back(w);\n    cout << solve(s, words) << "\\n";\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <string.h>\n` +
        B.C +
        `void solve(const char *s, const char *dict, char *out) { strcpy(out, "NO"); }\nchar buf[40000];\nint main(void) {\n    char s[2005], line[40000];\n    fgets(s, sizeof(s), stdin);\n    s[strcspn(s, "\\n")] = 0;\n    int k; scanf("%d", &k); getchar();\n    fgets(line, sizeof(line), stdin);\n    char out[8]; solve(s, line, out);\n    printf("%s\\n", out);\n    return 0;\n}\n`,
    },
  },

  "combination-sum": {
    description:
      "You are given distinct positive coin values and a target amount.\n\n" +
      "Each value may be used unlimited times. Count how many different combinations of values sum exactly to the target (order does not matter).",
    inputFormat: "Line 1: target.\nLine 2: k.\nLine 3: k distinct positive integers.",
    outputFormat: "One integer: number of combinations.",
    sampleTestCases: [{ input: "7\n4\n2 3 6 7\n", output: "2\n" }],
    hiddenTestCases: [
      { input: "3\n1\n2\n", output: "0\n" },
      { input: "4\n2\n1 2\n", output: "3\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(target, coins) { return 0; }\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst lines=[];rl.on("line",l=>lines.push(l));rl.on("close",()=>{\nconst t=+lines[0];const coins=lines[2].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(t,coins))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(t:int,c:list[int])->int: return 0\nlines=sys.stdin.read().splitlines()` +
        `\nprint(solve(int(lines[0]),list(map(int,lines[2].split()))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main {\n  static int solve(int t,int[]c){return 0;}\n  public static void main(String[]a){\n    Scanner sc=new Scanner(System.in);\n    int t=sc.nextInt();int k=sc.nextInt();int[]c=new int[k];\n    for(int i=0;i<k;i++)c[i]=sc.nextInt();\n    System.out.println(solve(t,c));sc.close();\n}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(int t,vector<int>&c){return 0;}\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint t,k;cin>>t>>k;vector<int>c(k);for(int i=0;i<k;i++)cin>>c[i];\ncout<<solve(t,c)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n` +
        B.C +
        `int solve(int t,int*c,int k){return 0;}\nint main(){int t,k;scanf("%d%d",&t,&k);int c[32];for(int i=0;i<k;i++)scanf("%d",&c[i]);printf("%d\\n",solve(t,c,k));return 0;}\n`,
    },
  },

  "house-robber": {
    description:
      "You are given money in n houses in a row.\n\n" +
      "You cannot rob two adjacent houses. Maximize the total money robbed.",
    inputFormat: "Line 1: n.\nLine 2: n non-negative integers.",
    outputFormat: "One integer: maximum money.",
    sampleTestCases: [{ input: "4\n1 2 3 1\n", output: "4\n" }],
    hiddenTestCases: [
      { input: "1\n5\n", output: "5\n" },
      { input: "3\n2 7 9\n", output: "11\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst nums=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(nums))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(nums:list[int])->int: return 0\nlines=sys.stdin.read().splitlines()\nprint(solve(list(map(int,lines[1].split()))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static long solve(int[]a){return 0;}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `long long solve(vector<int>&a){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `long long solve(int*a,int n){return 0;}int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("%lld\\n",solve(a,n));free(a);return 0;}\n`,
    },
  },

  "house-robber-ii": {
    description:
      "Houses are arranged in a circle (first and last are neighbors).\n\n" +
      "You cannot rob two adjacent houses. Maximize the total money robbed.",
    inputFormat: "Line 1: n.\nLine 2: n non-negative integers.",
    outputFormat: "One integer: maximum money.",
    sampleTestCases: [{ input: "4\n1 2 3 1\n", output: "4\n" }],
    hiddenTestCases: [
      { input: "3\n2 3 2\n", output: "3\n" },
      { input: "1\n1\n", output: "1\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst nums=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(nums))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(nums:list[int])->int: return 0\nlines=sys.stdin.read().splitlines()\nprint(solve(list(map(int,lines[1].split()))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static long solve(int[]a){return 0;}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `long long solve(vector<int>&a){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `long long solve(int*a,int n){return 0;}int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("%lld\\n",solve(a,n));free(a);return 0;}\n`,
    },
  },

  "decode-ways": {
    description:
      "A message contains only digits. Letters A–Z map to 1–26.\n\n" +
      "Count how many ways the entire string can be decoded.",
    inputFormat: "Line 1: a non-empty string of digits (may start with 0 only if length 1).",
    outputFormat: "One integer: number of decodings.",
    sampleTestCases: [{ input: "12\n", output: "2\n" }],
    hiddenTestCases: [
      { input: "226\n", output: "3\n" },
      { input: "06\n", output: "0\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(s){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nprocess.stdout.write(String(solve((L[0]||"").trim()))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(s:str)->int: return 0\nprint(solve(sys.stdin.readline().strip()))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static long solve(String s){return 0;}public static void main(String[]a){\nScanner sc=new Scanner(System.in);String s=sc.nextLine().trim();System.out.println(solve(s));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `long long solve(string s){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring s;cin>>s;cout<<solve(s)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <string.h>\n` +
        B.C +
        `long long solve(const char*s){return 0;}int main(){char s[200];scanf("%s",s);printf("%lld\\n",solve(s));return 0;}\n`,
    },
  },

  "unique-paths": {
    description:
      "You start at the top-left cell of an m by n grid.\n\n" +
      "You may only move right or down. Count distinct paths to the bottom-right cell.",
    inputFormat: "Line 1: two integers m and n.",
    outputFormat: "One integer: number of paths.",
    sampleTestCases: [{ input: "3 7\n", output: "28\n" }],
    hiddenTestCases: [
      { input: "1 1\n", output: "1\n" },
      { input: "3 2\n", output: "3\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(m,n){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nrl.on("line",l=>{const[m,n]=l.trim().split(/\\s+/).map(Number);process.stdout.write(String(solve(m,n))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(m:int,n:int)->int: return 0\nm,n=map(int,sys.stdin.readline().split())\nprint(solve(m,n))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static long solve(int m,int n){return 0;}public static void main(String[]a){\nScanner sc=new Scanner(System.in);int m=sc.nextInt(),n=sc.nextInt();System.out.println(solve(m,n));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `long long solve(int m,int n){return 0;}int main(){int m,n;cin>>m>>n;cout<<solve(m,n)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n` +
        B.C +
        `long long solve(int m,int n){return 0;}int main(){int m,n;scanf("%d%d",&m,&n);printf("%lld\\n",solve(m,n));return 0;}\n`,
    },
  },

  "jump-game": {
    description:
      "You are given maximum jump lengths from each position.\n\n" +
      "Return YES if you can reach the last index starting at index 0.",
    inputFormat: "Line 1: n.\nLine 2: n non-negative integers.",
    outputFormat: "YES or NO.",
    sampleTestCases: [{ input: "5\n2 3 1 1 4\n", output: "YES\n" }],
    hiddenTestCases: [
      { input: "5\n3 2 1 0 4\n", output: "NO\n" },
      { input: "1\n0\n", output: "YES\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums){return "NO";}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst nums=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(solve(nums)+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(nums:list[int])->str: return "NO"\nlines=sys.stdin.read().splitlines()\nprint(solve(list(map(int,lines[1].split()))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int[]a){return "NO";}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `string solve(vector<int>&a){return "NO";}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `void solve(int*a,int n,char*o){strcpy(o,"NO");}int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);char o[8];solve(a,n,o);printf("%s\\n",o);free(a);return 0;}\n`,
    },
  },

  "clone-graph": {
    description:
      "You are given an undirected graph with n nodes labeled 1..n and m edges.\n\n" +
      "Return the sum of the labels visited in a breadth-first traversal starting from node 1 (same label may not be counted twice).",
    inputFormat:
      "Line 1: n m.\nNext m lines: two integers u v (undirected edge between u and v).",
    outputFormat: "One integer: sum of labels visited from node 1 in BFS order (each node once).",
    sampleTestCases: [{ input: "3 2\n1 2\n2 3\n", output: "6\n" }],
    hiddenTestCases: [
      { input: "1 0\n", output: "1\n" },
      { input: "4 2\n1 2\n3 4\n", output: "3\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(n,edges){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [n,m]=L[0].trim().split(/\\s+/).map(Number);\nconst edges=[];for(let i=1;i<=m;i++){const [u,v]=L[i].trim().split(/\\s+/).map(Number);edges.push([u,v]);}\nprocess.stdout.write(String(solve(n,edges))+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(n:int,edges:list[tuple[int,int]])->int: return 0\nlines=sys.stdin.read().splitlines()\nn,m=map(int,lines[0].split())\nedges=[tuple(map(int,lines[i].split())) for i in range(1,m+1)]\nprint(solve(n,edges))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static long solve(int n,int[][]e){return 0;}public static void main(String[]a){\nScanner sc=new Scanner(System.in);int n=sc.nextInt(),m=sc.nextInt();int[][]e=new int[m][2];\nfor(int i=0;i<m;i++){e[i][0]=sc.nextInt();e[i][1]=sc.nextInt();}\nSystem.out.println(solve(n,e));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `long long solve(int n,vector<pair<int,int>>&e){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<pair<int,int>>e(m);for(int i=0;i<m;i++)cin>>e[i].first>>e[i].second;cout<<solve(n,e)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n` +
        B.C +
        `long long solve(int n,int m,int*U,int*V){return 0;}int main(){int n,m;scanf("%d%d",&n,&m);int U[400],V[400];for(int i=0;i<m;i++)scanf("%d%d",&U[i],&V[i]);printf("%lld\\n",solve(n,m,U,V));return 0;}\n`,
    },
  },

  "course-schedule": {
    description:
      "There are n courses labeled 0..n-1.\n\n" +
      "Some courses have prerequisites: a line `a b` means you must finish course a before course b.\nReturn YES if all courses can be finished, otherwise NO.",
    inputFormat: "Line 1: n m.\nNext m lines: a b (prerequisite).",
    outputFormat: "YES or NO.",
    sampleTestCases: [{ input: "2 1\n1 0\n", output: "YES\n" }],
    hiddenTestCases: [
      { input: "2 2\n1 0\n0 1\n", output: "NO\n" },
      { input: "1 0\n", output: "YES\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(n,edges){return "NO";}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [n,m]=L[0].trim().split(/\\s+/).map(Number);\nconst edges=[];for(let i=1;i<=m;i++){const [a,b]=L[i].trim().split(/\\s+/).map(Number);edges.push([a,b]);}\nprocess.stdout.write(solve(n,edges)+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(n:int,edges:list[tuple[int,int]])->str: return "NO"\nlines=sys.stdin.read().splitlines()\nn,m=map(int,lines[0].split())\nedges=[tuple(map(int,lines[i].split())) for i in range(1,m+1)]\nprint(solve(n,edges))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int n,int[][]e){return "NO";}public static void main(String[]a){\nScanner sc=new Scanner(System.in);int n=sc.nextInt(),m=sc.nextInt();int[][]e=new int[m][2];\nfor(int i=0;i<m;i++){e[i][0]=sc.nextInt();e[i][1]=sc.nextInt();}\nSystem.out.println(solve(n,e));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `string solve(int n,vector<pair<int,int>>&e){return "NO";}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<pair<int,int>>e(m);for(int i=0;i<m;i++)cin>>e[i].first>>e[i].second;cout<<solve(n,e)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n` +
        B.C +
        `void solve(int n,int m,int*A,int*B,char*o){strcpy(o,"NO");}int main(){int n,m;scanf("%d%d",&n,&m);int A[400],B[400];for(int i=0;i<m;i++)scanf("%d%d",&A[i],&B[i]);char o[8];solve(n,m,A,B,o);printf("%s\\n",o);return 0;}\n`,
    },
  },

  "number-of-islands": {
    description:
      "You are given an r by c grid of characters.\n\n" +
      "Land is 1 and water is 0. Count how many separate islands (4-directionally connected land cells).",
    inputFormat: "Line 1: r c.\nNext r lines: each has c characters with no spaces (only 0 and 1).",
    outputFormat: "One integer: island count.",
    sampleTestCases: [
      {
        input: "4 5\n11000\n11000\n00100\n00011\n",
        output: "3\n",
      },
    ],
    hiddenTestCases: [
      { input: "1 1\n0\n", output: "0\n" },
      { input: "1 1\n1\n", output: "1\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(grid){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [r,c]=L[0].trim().split(/\\s+/).map(Number);\nconst grid=L.slice(1,1+r).map(x=>x.trim());\nprocess.stdout.write(String(solve(grid))+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(grid:list[str])->int: return 0\nlines=sys.stdin.read().splitlines()\nr,c=map(int,lines[0].split())\ngrid=lines[1:1+r]\nprint(solve(grid))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(String[]g){return 0;}public static void main(String[]a){\nScanner sc=new Scanner(System.in);int r=sc.nextInt(),c=sc.nextInt();String[]g=new String[r];for(int i=0;i<r;i++)g[i]=sc.next();\nSystem.out.println(solve(g));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(vector<string>&g){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint r,c;cin>>r>>c;vector<string>g(r);for(int i=0;i<r;i++)cin>>g[i];cout<<solve(g)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n` +
        B.C +
        `int solve(int r,int c,char g[64][64]){return 0;}int main(){int r,c;scanf("%d%d",&r,&c);char g[64][64];for(int i=0;i<r;i++)scanf("%s",g[i]);printf("%d\\n",solve(r,c,g));return 0;}\n`,
    },
  },

  "word-search": {
    description:
      "You are given a letter grid and a word (letters only).\n\n" +
      "Return YES if the word can be formed by moving up/down/left/right without reusing a cell.",
    inputFormat:
      "Line 1: r c.\nNext r lines: each has c characters (no spaces).\nNext line: the word w.",
    outputFormat: "YES or NO.",
    sampleTestCases: [
      {
        input: "3 4\nABCE\nSFCS\nADEE\nABCCED\n",
        output: "YES\n",
      },
    ],
    hiddenTestCases: [
      { input: "1 1\nA\nB\n", output: "NO\n" },
      { input: "1 2\nAB\nAB\n", output: "YES\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(grid,w){return "NO";}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [r,c]=L[0].trim().split(/\\s+/).map(Number);\nconst grid=L.slice(1,1+r).map(x=>x.trim());\nconst w=(L[1+r]||"").trim();\nprocess.stdout.write(solve(grid,w)+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(grid:list[str],w:str)->str: return "NO"\nlines=sys.stdin.read().splitlines()\nr,c=map(int,lines[0].split())\ngrid=lines[1:1+r]\nw=lines[1+r].strip()\nprint(solve(grid,w))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(String[]g,String w){return "NO";}public static void main(String[]a){\nScanner sc=new Scanner(System.in);int r=sc.nextInt(),c=sc.nextInt();String[]g=new String[r];for(int i=0;i<r;i++)g[i]=sc.next();\nString w=sc.next();System.out.println(solve(g,w));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `string solve(vector<string>&g,string w){return "NO";}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint r,c;cin>>r>>c;vector<string>g(r);for(int i=0;i<r;i++)cin>>g[i];string w;cin>>w;cout<<solve(g,w)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <string.h>\n` +
        B.C +
        `void solve(const char g[32][32],int r,int c,const char*w,char*o){strcpy(o,"NO");}int main(){int r,c;scanf("%d%d",&r,&c);char g[32][32];for(int i=0;i<r;i++)scanf("%s",g[i]);char w[64];scanf("%s",w);char o[8];solve(g,r,c,w,o);printf("%s\\n",o);return 0;}\n`,
    },
  },

  "longest-consecutive-sequence": {
    description:
      "You are given an array of integers (possibly duplicates).\n\n" +
      "Find the length of the longest strictly increasing consecutive sequence when values are sorted uniquely by value (consecutive integers).",
    inputFormat: "Line 1: n.\nLine 2: n integers.",
    outputFormat: "One integer: longest run length of consecutive values.",
    sampleTestCases: [{ input: "6\n100 4 200 1 3 2\n", output: "4\n" }],
    hiddenTestCases: [
      { input: "1\n1\n", output: "1\n" },
      { input: "6\n1 2 2 3\n", output: "3\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst nums=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(nums))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(nums:list[int])->int: return 0\nlines=sys.stdin.read().splitlines()\nprint(solve(list(map(int,lines[1].split()))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(int[]a){return 0;}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(vector<int>&a){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int solve(int*a,int n){return 0;}int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("%d\\n",solve(a,n));free(a);return 0;}\n`,
    },
  },

  "valid-palindrome": {
    description:
      "You are given a string.\n\n" +
      "After removing all non-alphanumeric characters and ignoring case, return YES if it reads the same forwards and backwards.",
    inputFormat: "Line 1: string s (may include spaces and punctuation).",
    outputFormat: "YES or NO.",
    sampleTestCases: [{ input: "A man, a plan, a canal: Panama\n", output: "YES\n" }],
    hiddenTestCases: [
      { input: "race a car\n", output: "NO\n" },
      { input: " \n", output: "YES\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(s){return "NO";}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nprocess.stdout.write(solve((L[0]||""))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(s:str)->str: return "NO"\nprint(solve(sys.stdin.readline().rstrip("\\n")))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(String s){return "NO";}public static void main(String[]a){\nScanner sc=new Scanner(System.in);String s=sc.nextLine();System.out.println(solve(s));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `string solve(string s){return "NO";}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring s;getline(cin,s);cout<<solve(s)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <string.h>\n` +
        B.C +
        `void solve(const char*s,char*o){strcpy(o,"NO");}int main(){char s[4000];fgets(s,sizeof(s),stdin);char o[8];solve(s,o);printf("%s\\n",o);return 0;}\n`,
    },
  },

  "two-sum-ii-input-array-is-sorted": {
    description:
      "You are given a strictly increasing array of integers and a target.\n\n" +
      "Find two distinct 1-based positions whose values sum to the target. A unique answer exists.",
    inputFormat: "Line 1: n and target.\nLine 2: n space-separated integers (sorted ascending).",
    outputFormat: "One line: two integers i j (1-based indices).",
    sampleTestCases: [{ input: "4 6\n2 3 4 5\n", output: "1 3\n" }],
    hiddenTestCases: [
      { input: "2 6\n2 4\n", output: "1 2\n" },
      { input: "3 100\n5 25 75\n", output: "2 3\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums,target){return [1,2];}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [n,t]=L[0].trim().split(/\\s+/).map(Number);\nconst nums=L[1].trim().split(/\\s+/).map(Number);\nconst [i,j]=solve(nums,t);\nprocess.stdout.write(i+" "+j+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(nums:list[int],t:int)->list[int]: return [1,2]\nlines=sys.stdin.read().splitlines()\nn,t=map(int,lines[0].split())\nnums=list(map(int,lines[1].split()))\ni,j=solve(nums,t)\nprint(i,j)\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int[] solve(int[]a,int t){return new int[]{1,2};}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt(),t=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nint[] ij=solve(x,t);System.out.println(ij[0]+" "+ij[1]);sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `pair<int,int> solve(vector<int>&a,int t){return {1,2};}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,t;cin>>n>>t;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];auto p=solve(a,t);cout<<p.first<<" "<<p.second<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `void solve(int*a,int n,int t,int*o){o[0]=1;o[1]=2;}int main(){int n,t;scanf("%d%d",&n,&t);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);int o[2];solve(a,n,t,o);printf("%d %d\\n",o[0],o[1]);free(a);return 0;}\n`,
    },
  },

  "3sum-closest": {
    description:
      "You are given an array of integers and a target.\n\n" +
      "Find the sum of three distinct elements that is closest to the target (by absolute difference).",
    inputFormat: "Line 1: n and target.\nLine 2: n space-separated integers.",
    outputFormat: "One integer: the closest triplet sum.",
    sampleTestCases: [{ input: "4 1\n-1 2 1 -4\n", output: "2\n" }],
    hiddenTestCases: [
      { input: "3 0\n0 0 0\n", output: "0\n" },
      { input: "3 100\n1 2 3\n", output: "6\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums,target){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [n,t]=L[0].trim().split(/\\s+/).map(Number);\nconst nums=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(nums,t))+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(nums:list[int],t:int)->int: return 0\nlines=sys.stdin.read().splitlines()\nn,t=map(int,lines[0].split())\nnums=list(map(int,lines[1].split()))\nprint(solve(nums,t))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(int[]a,int t){return 0;}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt(),t=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x,t));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(vector<int>&a,int t){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,t;cin>>n>>t;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a,t)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int solve(int*a,int n,int t){return 0;}int main(){int n,t;scanf("%d%d",&n,&t);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("%d\\n",solve(a,n,t));free(a);return 0;}\n`,
    },
  },

  "trapping-rain-water": {
    description:
      "You are given n non-negative bar heights.\n\n" +
      "Compute how many units of water can be trapped after raining.",
    inputFormat: "Line 1: n.\nLine 2: n non-negative integers.",
    outputFormat: "One integer: trapped water units.",
    sampleTestCases: [{ input: "12\n0 1 0 2 1 0 1 3 2 1 2 1\n", output: "6\n" }],
    hiddenTestCases: [
      { input: "3\n1 0 1\n", output: "1\n" },
      { input: "1\n5\n", output: "0\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(h){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst h=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(h))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(h:list[int])->int: return 0\nlines=sys.stdin.read().splitlines()\nprint(solve(list(map(int,lines[1].split()))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static long solve(int[]a){return 0;}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `long long solve(vector<int>&a){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `long long solve(int*a,int n){return 0;}int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("%lld\\n",solve(a,n));free(a);return 0;}\n`,
    },
  },

  "best-time-to-buy-and-sell-stock-ii": {
    description:
      "You are given daily stock prices.\n\n" +
      "You may complete as many transactions as you like (buy then sell). Maximize total profit.",
    inputFormat: "Line 1: n.\nLine 2: n non-negative integers.",
    outputFormat: "One integer: maximum profit.",
    sampleTestCases: [{ input: "6\n7 1 5 3 6 4\n", output: "7\n" }],
    hiddenTestCases: [
      { input: "5\n1 2 3 4 5\n", output: "4\n" },
      { input: "2\n5 4\n", output: "0\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(p){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst p=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(p))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(p:list[int])->int: return 0\nlines=sys.stdin.read().splitlines()\nprint(solve(list(map(int,lines[1].split()))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static long solve(int[]a){return 0;}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `long long solve(vector<int>&a){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `long long solve(int*a,int n){return 0;}int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("%lld\\n",solve(a,n));free(a);return 0;}\n`,
    },
  },

  "jump-game-ii": {
    description:
      "You are given maximum jump lengths from each position.\n\n" +
      "Return the minimum number of jumps to reach the last index from the first. Assume the last index is reachable.",
    inputFormat: "Line 1: n.\nLine 2: n non-negative integers.",
    outputFormat: "One integer: minimum jumps.",
    sampleTestCases: [{ input: "5\n2 3 1 1 4\n", output: "2\n" }],
    hiddenTestCases: [
      { input: "2\n1 1\n", output: "1\n" },
      { input: "5\n1 1 1 1 1\n", output: "4\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst nums=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(nums))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(nums:list[int])->int: return 0\nlines=sys.stdin.read().splitlines()\nprint(solve(list(map(int,lines[1].split()))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(int[]a){return 0;}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(vector<int>&a){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int solve(int*a,int n){return 0;}int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("%d\\n",solve(a,n));free(a);return 0;}\n`,
    },
  },

  "merge-intervals": {
    description:
      "You are given n non-negative intervals [start, end] with start <= end.\n\n" +
      "Merge all overlapping intervals and return how many merged intervals remain.",
    inputFormat: "Line 1: n.\nNext n lines: two integers start end per line.",
    outputFormat: "One integer: number of merged intervals.",
    sampleTestCases: [
      {
        input: "4\n1 3\n2 6\n8 10\n15 18\n",
        output: "3\n",
      },
    ],
    hiddenTestCases: [
      { input: "1\n1 1\n", output: "1\n" },
      { input: "2\n1 4\n4 5\n", output: "1\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(iv){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst n=+L[0];const iv=[];for(let i=1;i<=n;i++){const [a,b]=L[i].trim().split(/\\s+/).map(Number);iv.push([a,b]);}\nprocess.stdout.write(String(solve(iv))+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(iv:list[tuple[int,int]])->int: return 0\nlines=sys.stdin.read().splitlines()\nn=int(lines[0])\niv=[tuple(map(int,lines[i].split())) for i in range(1,n+1)]\nprint(solve(iv))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(int[][]e){return 0;}public static void main(String[]a){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[][]e=new int[n][2];for(int i=0;i<n;i++){e[i][0]=sc.nextInt();e[i][1]=sc.nextInt();}\nSystem.out.println(solve(e));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(vector<pair<int,int>>&v){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<pair<int,int>>v(n);for(int i=0;i<n;i++)cin>>v[i].first>>v[i].second;cout<<solve(v)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n` +
        B.C +
        `int solve(int n,int*A,int*B){return 0;}int main(){int n;scanf("%d",&n);int A[64],B[64];for(int i=0;i<n;i++)scanf("%d%d",&A[i],&B[i]);printf("%d\\n",solve(n,A,B));return 0;}\n`,
    },
  },

  "insert-interval": {
    description:
      "You are given n non-overlapping sorted intervals and one extra interval.\n\n" +
      "Insert the extra interval and merge overlaps. Return the number of intervals after merging.",
    inputFormat:
      "Line 1: n.\nNext n lines: start end per line (sorted, non-overlapping).\nLast line: new_start new_end.",
    outputFormat: "One integer: count of merged intervals.",
    sampleTestCases: [
      {
        input: "3\n1 2\n3 5\n6 7\n4 8\n",
        output: "2\n",
      },
    ],
    hiddenTestCases: [
      { input: "0\n2 5\n", output: "1\n" },
      { input: "1\n1 5\n2 3\n", output: "1\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(iv,ni){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst n=+L[0];const iv=[];for(let i=1;i<=n;i++){const [a,b]=L[i].trim().split(/\\s+/).map(Number);iv.push([a,b]);}\nconst [ns,ne]=L[n+1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(iv,[ns,ne]))+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(iv:list[tuple[int,int]],ni:tuple[int,int])->int: return 0\nlines=sys.stdin.read().splitlines()\nn=int(lines[0])\niv=[tuple(map(int,lines[i].split())) for i in range(1,n+1)]\nni=tuple(map(int,lines[n+1].split()))\nprint(solve(iv,ni))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(int[][]e,int[]ni){return 0;}public static void main(String[]a){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[][]e=new int[n][2];for(int i=0;i<n;i++){e[i][0]=sc.nextInt();e[i][1]=sc.nextInt();}\nint ns=sc.nextInt(),ne=sc.nextInt();System.out.println(solve(e,new int[]{ns,ne}));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(vector<pair<int,int>>&v,pair<int,int>ni){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<pair<int,int>>v(n);for(int i=0;i<n;i++)cin>>v[i].first>>v[i].second;int ns,ne;cin>>ns>>ne;cout<<solve(v,{ns,ne})<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n` +
        B.C +
        `int solve(int n,int*A,int*B,int ns,int ne){return 0;}int main(){int n;scanf("%d",&n);int A[64],B[64];for(int i=0;i<n;i++)scanf("%d%d",&A[i],&B[i]);int ns,ne;scanf("%d%d",&ns,&ne);printf("%d\\n",solve(n,A,B,ns,ne));return 0;}\n`,
    },
  },
};
