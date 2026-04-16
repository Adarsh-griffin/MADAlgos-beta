import { STUDENT_CODE_ZONE_BANNER } from "@/lib/assessment-code-starters";
import type { InHouseBlind75Entry } from "@/data/blind75-in-house-types";

const B = STUDENT_CODE_ZONE_BANNER;

/** Non-overlapping Intervals … Search a 2D Matrix (BLIND_75 index 39–58) */
export const BLIND75_IN_HOUSE_PART_C: Record<string, InHouseBlind75Entry> = {
  "non-overlapping-intervals": {
    description:
      "You are given n intervals [start, end].\n\n" +
      "Return the minimum number of intervals you must remove so that the rest do not overlap.",
    inputFormat: "Line 1: n.\nNext n lines: start end per line.",
    outputFormat: "One integer: minimum removals.",
    sampleTestCases: [{ input: "4\n1 2\n2 3\n3 4\n1 3\n", output: "1\n" }],
    hiddenTestCases: [
      { input: "1\n1 2\n", output: "0\n" },
      { input: "3\n1 2\n1 2\n1 2\n", output: "2\n" },
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

  "reverse-linked-list": {
    description:
      "You are given a singly linked list as an array of n integers in order from head to tail.\n\n" +
      "Return the same values in reverse order (space-separated).",
    inputFormat: "Line 1: n.\nLine 2: n integers (list values).",
    outputFormat: "One line: reversed values, space-separated.",
    sampleTestCases: [{ input: "5\n1 2 3 4 5\n", output: "5 4 3 2 1\n" }],
    hiddenTestCases: [
      { input: "1\n7\n", output: "7\n" },
      { input: "3\n0 0 1\n", output: "1 0 0\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums){return [];}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst nums=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(solve(nums).join(" ")+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(nums:list[int]): return []\nlines=sys.stdin.read().splitlines()\nprint(" ".join(map(str,solve(list(map(int,lines[1].split()))))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int[]a){return "";}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `string solve(vector<int>&a){return "";}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `void solve(int*a,int n){}int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("\\n");free(a);return 0;}\n`,
    },
  },

  "merge-two-sorted-lists": {
    description:
      "You are given two sorted ascending lists as arrays.\n\n" +
      "Merge them into one sorted ascending list and print all values space-separated.",
    inputFormat: "Line 1: n m.\nLine 2: n integers (first list).\nLine 3: m integers (second list).",
    outputFormat: "One line: merged sorted values.",
    sampleTestCases: [{ input: "3 3\n1 2 4\n1 3 4\n", output: "1 1 2 3 4 4\n" }],
    hiddenTestCases: [
      { input: "0 1\n\n5\n", output: "5\n" },
      { input: "2 2\n1 2\n3 4\n", output: "1 2 3 4\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(a,b){return [];}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [n,m]=L[0].trim().split(/\\s+/).map(Number);\nconst a=L[1].trim()?L[1].trim().split(/\\s+/).map(Number):[];\nconst b=L[2].trim()?L[2].trim().split(/\\s+/).map(Number):[];\nprocess.stdout.write(solve(a,b).join(" ")+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(a:list[int],b:list[int])->list[int]: return []\nlines=sys.stdin.read().splitlines()\nn,m=map(int,lines[0].split())\na=list(map(int,lines[1].split())) if lines[1].strip() else []\nb=list(map(int,lines[2].split())) if len(lines)>2 and lines[2].strip() else []\nprint(" ".join(map(str,solve(a,b))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int[]a,int[]b){return "";}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt(),m=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nint[]y=new int[m];for(int i=0;i<m;i++)y[i]=sc.nextInt();\nSystem.out.println(solve(x,y));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `vector<int> solve(vector<int>a,vector<int>b){return {};}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<int>a(n),b(m);for(int i=0;i<n;i++)cin>>a[i];for(int i=0;i<m;i++)cin>>b[i];\nauto o=solve(a,b);for(size_t i=0;i<o.size();i++){if(i)cout<<" ";cout<<o[i];}cout<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int main(){int n,m;scanf("%d%d",&n,&m);int *a=malloc(sizeof(int)*n),*b=malloc(sizeof(int)*m);\nfor(int i=0;i<n;i++)scanf("%d",&a[i]);for(int i=0;i<m;i++)scanf("%d",&b[i]);printf("\\n");free(a);free(b);return 0;}\n`,
    },
  },

  "reorder-list": {
    description:
      "Given a list as n values in order, reorder it to: first, last, second, second-last, …\n\n" +
      "Print the reordered values space-separated.",
    inputFormat: "Line 1: n.\nLine 2: n integers.",
    outputFormat: "One line: reordered values.",
    sampleTestCases: [{ input: "5\n1 2 3 4 5\n", output: "1 5 2 4 3\n" }],
    hiddenTestCases: [
      { input: "2\n1 2\n", output: "1 2\n" },
      { input: "4\n1 2 3 4\n", output: "1 4 2 3\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums){return nums;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst nums=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(solve(nums).join(" ")+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(nums:list[int]): return nums\nlines=sys.stdin.read().splitlines()\nprint(" ".join(map(str,solve(list(map(int,lines[1].split()))))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int[]a){return "";}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `vector<int> solve(vector<int>a){return a;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];auto o=solve(a);for(size_t i=0;i<o.size();i++){if(i)cout<<" ";cout<<o[i];}cout<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);for(int i=0;i<n;i++){if(i)printf(" ");printf("%d",a[i]);}printf("\\n");free(a);return 0;}\n`,
    },
  },

  "remove-nth-node-from-end-of-list": {
    description:
      "You are given a list of n nodes (values in order).\n\n" +
      "Remove the k-th node from the end (k is 1-based) and print the remaining values.",
    inputFormat: "Line 1: n and k.\nLine 2: n integers.",
    outputFormat: "Space-separated values after removal (n-1 values).",
    sampleTestCases: [{ input: "5 2\n1 2 3 4 5\n", output: "1 2 3 5\n" }],
    hiddenTestCases: [
      { input: "1 1\n1\n", output: "\n" },
      { input: "3 3\n1 2 3\n", output: "2 3\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums,k){return [];}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [n,k]=L[0].trim().split(/\\s+/).map(Number);\nconst nums=L[1].trim().split(/\\s+/).map(Number);\nconst out=solve(nums,k);\nprocess.stdout.write(out.join(" ")+(out.length?"":"\\n"));});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(nums:list[int],k:int)->list[int]: return []\nlines=sys.stdin.read().splitlines()\nn,k=map(int,lines[0].split())\nnums=list(map(int,lines[1].split()))\nprint(" ".join(map(str,solve(nums,k))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int[]a,int k){return "";}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt(),k=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x,k));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `vector<int> solve(vector<int>a,int k){return {};}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,k;cin>>n>>k;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];auto o=solve(a,k);for(size_t i=0;i<o.size();i++){if(i)cout<<" ";cout<<o[i];}cout<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int main(){int n,k;scanf("%d%d",&n,&k);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("\\n");free(a);return 0;}\n`,
    },
  },

  "linked-list-cycle-ii": {
    description:
      "You are given n list values in order. Index x (0-based) is the start of a cycle pointing back to index y (0-based).\n\n" +
      "Return y (the index where the cycle begins). If no cycle, print -1.",
    inputFormat: "Line 1: n x y (use x=-1 for no cycle).\nLine 2: n integers.",
    outputFormat: "One integer: cycle start index or -1.",
    sampleTestCases: [{ input: "5 4 1\n3 2 0 -4 1\n", output: "1\n" }],
    hiddenTestCases: [
      { input: "2 -1 -1\n1 2\n", output: "-1\n" },
      { input: "2 1 0\n1 2\n", output: "0\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums,x,y){return -1;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [n,x,y]=L[0].trim().split(/\\s+/).map(Number);\nconst nums=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(nums,x,y))+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(nums:list[int],x:int,y:int)->int: return -1\nlines=sys.stdin.read().splitlines()\nn,x,y=map(int,lines[0].split())\nnums=list(map(int,lines[1].split()))\nprint(solve(nums,x,y))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(int[]a,int x,int y){return -1;}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt(),x=sc.nextInt(),y=sc.nextInt();int[]v=new int[n];for(int i=0;i<n;i++)v[i]=sc.nextInt();\nSystem.out.println(solve(v,x,y));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(vector<int>&a,int x,int y){return -1;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,x,y;cin>>n>>x>>y;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a,x,y)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int solve(int*a,int n,int x,int y){return -1;}int main(){int n,x,y;scanf("%d%d%d",&n,&x,&y);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("%d\\n",solve(a,n,x,y));free(a);return 0;}\n`,
    },
  },

  "set-matrix-zeroes": {
    description:
      "You are given an r by c matrix of integers.\n\n" +
      "If any cell is 0, set its entire row and column to 0 in-place conceptually — print the final matrix: r lines of c space-separated integers.",
    inputFormat: "Line 1: r c.\nNext r lines: c integers per line.",
    outputFormat: "r lines, each with c integers.",
    sampleTestCases: [
      {
        input: "3 3\n1 1 1\n1 0 1\n1 1 1\n",
        output: "1 0 1\n0 0 0\n1 0 1\n",
      },
    ],
    hiddenTestCases: [
      { input: "1 1\n0\n", output: "0\n" },
      { input: "2 2\n1 2\n3 4\n", output: "1 2\n3 4\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(g){return g;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [r,c]=L[0].trim().split(/\\s+/).map(Number);\nconst g=[];for(let i=1;i<=r;i++)g.push(L[i].trim().split(/\\s+/).map(Number));\nconst o=solve(g);\nprocess.stdout.write(o.map(row=>row.join(" ")).join("\\n")+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(g:list[list[int]]): return g\nlines=sys.stdin.read().splitlines()\nr,c=map(int,lines[0].split())\ng=[list(map(int,lines[i].split())) for i in range(1,r+1)]\nfor row in solve(g): print(" ".join(map(str,row)))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int[][] solve(int[][]g){return g;}public static void main(String[]a){\nScanner sc=new Scanner(System.in);int r=sc.nextInt(),c=sc.nextInt();int[][]g=new int[r][c];for(int i=0;i<r;i++)for(int j=0;j<c;j++)g[i][j]=sc.nextInt();\nint[][]o=solve(g);for(int i=0;i<r;i++){StringBuilder sb=new StringBuilder();for(int j=0;j<c;j++){if(j>0)sb.append(" ");sb.append(o[i][j]);}System.out.println(sb.toString());}sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `vector<vector<int>> solve(vector<vector<int>> g){return g;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint r,c;cin>>r>>c;vector<vector<int>> g(r,vector<int>(c));for(int i=0;i<r;i++)for(int j=0;j<c;j++)cin>>g[i][j];\nauto o=solve(g);for(int i=0;i<r;i++){for(int j=0;j<c;j++){if(j)cout<<" ";cout<<o[i][j];}cout<<endl;}return 0;}\n`,
      C:
        `#include <stdio.h>\n` +
        B.C +
        `int main(){int r,c;scanf("%d%d",&r,&c);int g[32][32];for(int i=0;i<r;i++)for(int j=0;j<c;j++)scanf("%d",&g[i][j]);for(int i=0;i<r;i++){for(int j=0;j<c;j++){if(j)printf(" ");printf("%d",g[i][j]);}printf("\\n");}return 0;}\n`,
    },
  },

  "spiral-matrix": {
    description:
      "You are given an r by c matrix.\n\n" +
      "Print its elements in spiral order (clockwise from the outside), space-separated on one line.",
    inputFormat: "Line 1: r c.\nNext r lines: c integers per line.",
    outputFormat: "One line: spiral order values.",
    sampleTestCases: [
      {
        input: "3 3\n1 2 3\n4 5 6\n7 8 9\n",
        output: "1 2 3 6 9 8 7 4 5\n",
      },
    ],
    hiddenTestCases: [
      { input: "1 3\n1 2 3\n", output: "1 2 3\n" },
      { input: "2 2\n1 2\n3 4\n", output: "1 2 4 3\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(g){return [];}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [r,c]=L[0].trim().split(/\\s+/).map(Number);\nconst g=[];for(let i=1;i<=r;i++)g.push(L[i].trim().split(/\\s+/).map(Number));\nprocess.stdout.write(solve(g).join(" ")+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(g:list[list[int]]): return []\nlines=sys.stdin.read().splitlines()\nr,c=map(int,lines[0].split())\ng=[list(map(int,lines[i].split())) for i in range(1,r+1)]\nprint(" ".join(map(str,solve(g))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int[][]g){return "";}public static void main(String[]a){\nScanner sc=new Scanner(System.in);int r=sc.nextInt(),c=sc.nextInt();int[][]g=new int[r][c];for(int i=0;i<r;i++)for(int j=0;j<c;j++)g[i][j]=sc.nextInt();\nSystem.out.println(solve(g));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `vector<int> solve(vector<vector<int>> g){return {};}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint r,c;cin>>r>>c;vector<vector<int>> g(r,vector<int>(c));for(int i=0;i<r;i++)for(int j=0;j<c;j++)cin>>g[i][j];\nauto o=solve(g);for(size_t i=0;i<o.size();i++){if(i)cout<<" ";cout<<o[i];}cout<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n` +
        B.C +
        `int main(){int r,c;scanf("%d%d",&r,&c);int g[32][32];for(int i=0;i<r;i++)for(int j=0;j<c;j++)scanf("%d",&g[i][j]);printf("\\n");return 0;}\n`,
    },
  },

  "longest-substring-without-repeating-characters": {
    description:
      "You are given a string s.\n\n" +
      "Find the length of the longest substring without repeating characters.",
    inputFormat: "Line 1: string s (may be empty).",
    outputFormat: "One integer: length.",
    sampleTestCases: [{ input: "abcabcbb\n", output: "3\n" }],
    hiddenTestCases: [
      { input: "bbbbb\n", output: "1\n" },
      { input: "\n", output: "0\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(s){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nprocess.stdout.write(String(solve((L[0]||"")))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(s:str)->int: return 0\nprint(solve(sys.stdin.readline().rstrip("\\n")))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(String s){return 0;}public static void main(String[]a){\nScanner sc=new Scanner(System.in);String s=sc.hasNextLine()?sc.nextLine():"";System.out.println(solve(s));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(string s){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring s;getline(cin,s);cout<<solve(s)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <string.h>\n` +
        B.C +
        `int solve(const char*s){return 0;}int main(){char s[4000];fgets(s,sizeof(s),stdin);s[strcspn(s,"\\n")]=0;printf("%d\\n",solve(s));return 0;}\n`,
    },
  },

  "minimum-window-substring": {
    description:
      "Given strings s and t, find the minimum-length window in s that contains all characters of t (with multiplicity).\n\n" +
      "Print the window substring, or an empty line if impossible.",
    inputFormat: "Line 1: s.\nLine 2: t.",
    outputFormat: "One line: shortest valid window.",
    sampleTestCases: [{ input: "ADOBECODEBANC\nABC\n", output: "BANC\n" }],
    hiddenTestCases: [
      { input: "a\na\n", output: "a\n" },
      { input: "a\naa\n", output: "\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(s,t){return "";}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nprocess.stdout.write(solve((L[0]||""),(L[1]||""))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(s:str,t:str)->str: return ""\nlines=sys.stdin.read().splitlines()\nprint(solve(lines[0],lines[1] if len(lines)>1 else ""))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(String s,String t){return "";}public static void main(String[]a){\nScanner sc=new Scanner(System.in);String s=sc.nextLine();String t=sc.nextLine();System.out.println(solve(s,t));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `string solve(string s,string t){return "";}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring s,t;getline(cin,s);getline(cin,t);cout<<solve(s,t)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <string.h>\n` +
        B.C +
        `void solve(const char*s,const char*t,char*o){o[0]=0;}int main(){char s[4000],t[4000];fgets(s,sizeof(s),stdin);fgets(t,sizeof(t),stdin);s[strcspn(s,"\\n")]=0;t[strcspn(t,"\\n")]=0;char o[4000];solve(s,t,o);printf("%s\\n",o);return 0;}\n`,
    },
  },

  "sliding-window-maximum": {
    description:
      "You are given an array and a window size k.\n\n" +
      "Print the maximum value in each sliding window of length k from left to right, space-separated.",
    inputFormat: "Line 1: n and k.\nLine 2: n integers.",
    outputFormat: "Space-separated maxima (n-k+1 values).",
    sampleTestCases: [{ input: "8 3\n1 3 -1 -3 5 3 6 7\n", output: "3 3 5 5 6 7\n" }],
    hiddenTestCases: [
      { input: "1 1\n1\n", output: "1\n" },
      { input: "4 2\n1 2 3 4\n", output: "2 3 4\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums,k){return [];}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [n,k]=L[0].trim().split(/\\s+/).map(Number);\nconst nums=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(solve(nums,k).join(" ")+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(nums:list[int],k:int): return []\nlines=sys.stdin.read().splitlines()\nn,k=map(int,lines[0].split())\nnums=list(map(int,lines[1].split()))\nprint(" ".join(map(str,solve(nums,k))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int[]a,int k){return "";}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt(),k=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x,k));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `vector<int> solve(vector<int>a,int k){return {};}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,k;cin>>n>>k;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];auto o=solve(a,k);for(size_t i=0;i<o.size();i++){if(i)cout<<" ";cout<<o[i];}cout<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int main(){int n,k;scanf("%d%d",&n,&k);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("\\n");free(a);return 0;}\n`,
    },
  },

  "minimum-size-subarray-sum": {
    description:
      "You are given positive integers and a target sum.\n\n" +
      "Find the smallest length of a contiguous subarray whose sum is at least target. If none, print 0.",
    inputFormat: "Line 1: n and target.\nLine 2: n positive integers.",
    outputFormat: "One integer: minimum length.",
    sampleTestCases: [{ input: "6 7\n2 3 1 2 4 3\n", output: "2\n" }],
    hiddenTestCases: [
      { input: "3 100\n1 2 3\n", output: "0\n" },
      { input: "1 1\n1\n", output: "1\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums,target){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [n,target]=L[0].trim().split(/\\s+/).map(Number);\nconst nums=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(nums,target))+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(nums:list[int],target:int)->int: return 0\nlines=sys.stdin.read().splitlines()\nn,target=map(int,lines[0].split())\nnums=list(map(int,lines[1].split()))\nprint(solve(nums,target))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(int[]a,int t){return 0;}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt(),t=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x,t));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(vector<int>a,int t){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,t;cin>>n>>t;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a,t)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int solve(int*a,int n,int t){return 0;}int main(){int n,t;scanf("%d%d",&n,&t);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("%d\\n",solve(a,n,t));free(a);return 0;}\n`,
    },
  },

  "valid-parentheses": {
    description:
      "You are given a string containing only ( ) [ ] { }.\n\n" +
      "Return YES if the brackets are properly nested and closed, otherwise NO.",
    inputFormat: "Line 1: bracket string (possibly empty).",
    outputFormat: "YES or NO.",
    sampleTestCases: [{ input: "()[]{}\n", output: "YES\n" }],
    hiddenTestCases: [
      { input: "([)]\n", output: "NO\n" },
      { input: "\n", output: "YES\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(s){return "NO";}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nprocess.stdout.write(solve((L[0]||""))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(s:str)->str: return "NO"\nprint(solve(sys.stdin.readline().strip("\\n")))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(String s){return "NO";}public static void main(String[]a){\nScanner sc=new Scanner(System.in);String s=sc.hasNextLine()?sc.nextLine():"";System.out.println(solve(s));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `string solve(string s){return "NO";}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring s;getline(cin,s);cout<<solve(s)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <string.h>\n` +
        B.C +
        `void solve(const char*s,char*o){strcpy(o,"NO");}int main(){char s[4000];fgets(s,sizeof(s),stdin);s[strcspn(s,"\\n")]=0;char o[8];solve(s,o);printf("%s\\n",o);return 0;}\n`,
    },
  },

  "daily-temperatures": {
    description:
      "You are given daily temperatures.\n\n" +
      "For each day, print how many days you must wait until a warmer day (0 if none), space-separated.",
    inputFormat: "Line 1: n.\nLine 2: n non-negative integers (temperatures).",
    outputFormat: "n integers, space-separated.",
    sampleTestCases: [{ input: "8\n73 74 75 71 69 72 76 73\n", output: "1 1 4 2 1 1 0 0\n" }],
    hiddenTestCases: [
      { input: "1\n30\n", output: "0\n" },
      { input: "3\n30 30 30\n", output: "0 0 0\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(t){return t.map(()=>0);}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst t=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(solve(t).join(" ")+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(t:list[int]): return [0]*len(t)\nlines=sys.stdin.read().splitlines()\nprint(" ".join(map(str,solve(list(map(int,lines[1].split()))))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int[]a){return "";}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `vector<int> solve(vector<int>t){return vector<int>(t.size(),0);}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>t(n);for(int i=0;i<n;i++)cin>>t[i];auto o=solve(t);for(size_t i=0;i<o.size();i++){if(i)cout<<" ";cout<<o[i];}cout<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int main(){int n;scanf("%d",&n);int*t=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&t[i]);for(int i=0;i<n;i++){if(i)printf(" ");printf("0");}printf("\\n");free(t);return 0;}\n`,
    },
  },

  "car-fleet": {
    description:
      "Cars start at different positions on a one-way road to a target.\n\n" +
      "Each car has a max speed. A fleet moves at the slowest car. Count how many fleets arrive at the target.",
    inputFormat:
      "Line 1: target n.\nLine 2: n positions (sorted descending).\nLine 3: n speeds (same order as positions).",
    outputFormat: "One integer: number of fleets.",
    sampleTestCases: [{ input: "12 5\n10 8 0 5 3\n2 4 1 1 3\n", output: "3\n" }],
    hiddenTestCases: [
      { input: "10 1\n0\n2\n", output: "1\n" },
      { input: "10 2\n3 5\n4 2\n", output: "1\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(target,pos,speed){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [target,n]=L[0].trim().split(/\\s+/).map(Number);\nconst pos=L[1].trim().split(/\\s+/).map(Number);\nconst speed=L[2].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(target,pos,speed))+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(target:int,pos:list[int],sp:list[int])->int: return 0\nlines=sys.stdin.read().splitlines()\ntarget,n=map(int,lines[0].split())\npos=list(map(int,lines[1].split()))\nsp=list(map(int,lines[2].split()))\nprint(solve(target,pos,sp))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(int t,int[]p,int[]s){return 0;}public static void main(String[]a){\nScanner sc=new Scanner(System.in);int target=sc.nextInt(),n=sc.nextInt();int[]p=new int[n],s=new int[n];for(int i=0;i<n;i++)p[i]=sc.nextInt();for(int i=0;i<n;i++)s[i]=sc.nextInt();\nSystem.out.println(solve(target,p,s));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(int t,vector<int>p,vector<int>s){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint target,n;cin>>target>>n;vector<int>p(n),s(n);for(int i=0;i<n;i++)cin>>p[i];for(int i=0;i<n;i++)cin>>s[i];cout<<solve(target,p,s)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int solve(int t,int*p,int*s,int n){return 0;}int main(){int t,n;scanf("%d%d",&t,&n);int*p=malloc(sizeof(int)*n),*s=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&p[i]);for(int i=0;i<n;i++)scanf("%d",&s[i]);printf("%d\\n",solve(t,p,s,n));free(p);free(s);return 0;}\n`,
    },
  },

  "largest-rectangle-in-histogram": {
    description:
      "You are given n non-negative bar heights.\n\n" +
      "Find the largest rectangle area that fits under the histogram.",
    inputFormat: "Line 1: n.\nLine 2: n integers (heights).",
    outputFormat: "One integer: maximum area.",
    sampleTestCases: [{ input: "6\n2 1 5 6 2 3\n", output: "10\n" }],
    hiddenTestCases: [
      { input: "1\n5\n", output: "5\n" },
      { input: "3\n1 1 1\n", output: "3\n" },
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
        `long long solve(vector<int>&h){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>h(n);for(int i=0;i<n;i++)cin>>h[i];cout<<solve(h)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `long long solve(int*h,int n){return 0;}int main(){int n;scanf("%d",&n);int*h=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&h[i]);printf("%lld\\n",solve(h,n));free(h);return 0;}\n`,
    },
  },

  "binary-search": {
    description:
      "You are given a sorted ascending array of distinct integers and a target.\n\n" +
      "Return the index of target, or -1 if it does not exist (0-based).",
    inputFormat: "Line 1: n and target.\nLine 2: n integers sorted ascending.",
    outputFormat: "One integer: index or -1.",
    sampleTestCases: [{ input: "6 9\n-1 0 3 5 9 12\n", output: "4\n" }],
    hiddenTestCases: [
      { input: "1 1\n1\n", output: "0\n" },
      { input: "3 2\n1 3 5\n", output: "-1\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums,target){return -1;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [n,t]=L[0].trim().split(/\\s+/).map(Number);\nconst nums=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(nums,t))+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(nums:list[int],t:int)->int: return -1\nlines=sys.stdin.read().splitlines()\nn,t=map(int,lines[0].split())\nnums=list(map(int,lines[1].split()))\nprint(solve(nums,t))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(int[]a,int t){return -1;}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt(),t=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x,t));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(vector<int>&a,int t){return -1;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,t;cin>>n>>t;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a,t)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int solve(int*a,int n,int t){return -1;}int main(){int n,t;scanf("%d%d",&n,&t);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("%d\\n",solve(a,n,t));free(a);return 0;}\n`,
    },
  },

  "search-a-2d-matrix": {
    description:
      "You are given an m by n matrix with rows sorted ascending and each row first element greater than previous row last.\n\n" +
      "Return YES if target exists, else NO.",
    inputFormat: "Line 1: m n target.\nNext m lines: n integers per row.",
    outputFormat: "YES or NO.",
    sampleTestCases: [
      {
        input: "3 4 3\n1 3 5 7\n10 11 16 20\n23 30 34 60\n",
        output: "YES\n",
      },
    ],
    hiddenTestCases: [
      { input: "1 1 1\n1\n", output: "YES\n" },
      { input: "1 1 2\n1\n", output: "NO\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(g,target){return "NO";}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [m,n,target]=L[0].trim().split(/\\s+/).map(Number);\nconst g=[];for(let i=1;i<=m;i++)g.push(L[i].trim().split(/\\s+/).map(Number));\nprocess.stdout.write(solve(g,target)+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(g:list[list[int]],t:int)->str: return "NO"\nlines=sys.stdin.read().splitlines()\nm,n,target=map(int,lines[0].split())\ng=[list(map(int,lines[i].split())) for i in range(1,m+1)]\nprint(solve(g,target))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int[][]g,int t){return "NO";}public static void main(String[]a){\nScanner sc=new Scanner(System.in);int m=sc.nextInt(),n=sc.nextInt(),t=sc.nextInt();int[][]g=new int[m][n];for(int i=0;i<m;i++)for(int j=0;j<n;j++)g[i][j]=sc.nextInt();\nSystem.out.println(solve(g,t));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `string solve(vector<vector<int>> g,int t){return "NO";}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint m,n,t;cin>>m>>n>>t;vector<vector<int>> g(m,vector<int>(n));for(int i=0;i<m;i++)for(int j=0;j<n;j++)cin>>g[i][j];cout<<solve(g,t)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n` +
        B.C +
        `int main(){int m,n,t;scanf("%d%d%d",&m,&n,&t);int g[32][32];for(int i=0;i<m;i++)for(int j=0;j<n;j++)scanf("%d",&g[i][j]);printf("NO\\n");return 0;}\n`,
    },
  },
};
