import { STUDENT_CODE_ZONE_BANNER } from "@/lib/assessment-code-starters";
import type { InHouseBlind75Entry } from "@/data/blind75-in-house-types";

const B = STUDENT_CODE_ZONE_BANNER;

/** Invert Binary Tree … Course Schedule II (BLIND_75 index 59–74) */
export const BLIND75_IN_HOUSE_PART_D: Record<string, InHouseBlind75Entry> = {
  "invert-binary-tree": {
    description:
      "Binary trees are given in level order. Use -1 for a null child.\n\n" +
      "Print the level-order traversal of the inverted tree on one line (space-separated, use -1 for nulls).",
    inputFormat: "Line 1: number of values in level order.\nLine 2: level-order values (-1 means null).",
    outputFormat: "One line: inverted tree level order.",
    sampleTestCases: [{ input: "7\n4 2 7 1 3 6 9\n", output: "4 7 2 9 6 3 1\n" }],
    hiddenTestCases: [
      { input: "1\n1\n", output: "1\n" },
      { input: "3\n2 1 3\n", output: "2 3 1\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(level){return [];}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst vals=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(solve(vals).join(" ")+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(level:list[int]): return []\nlines=sys.stdin.read().splitlines()\nvals=list(map(int,lines[1].split()))\nprint(" ".join(map(str,solve(vals))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int[]a){return "";}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `string solve(vector<int>a){return "";}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("\\n");free(a);return 0;}\n`,
    },
  },

  "maximum-depth-of-binary-tree": {
    description:
      "Tree is given in level order with -1 for null.\n\n" +
      "Return the maximum depth (number of nodes along longest root-to-leaf path).",
    inputFormat: "Line 1: count of level-order values.\nLine 2: values.",
    outputFormat: "One integer: max depth.",
    sampleTestCases: [{ input: "7\n3 9 20 -1 -1 15 7\n", output: "3\n" }],
    hiddenTestCases: [
      { input: "1\n0\n", output: "1\n" },
      { input: "3\n1 -1 2\n", output: "2\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(level){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst vals=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(vals))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(level:list[int])->int: return 0\nlines=sys.stdin.read().splitlines()\nvals=list(map(int,lines[1].split()))\nprint(solve(vals))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(int[]a){return 0;}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(vector<int>a){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int solve(int*a,int n){return 0;}int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("%d\\n",solve(a,n));free(a);return 0;}\n`,
    },
  },

  "diameter-of-binary-tree": {
    description:
      "Tree in level order (-1 null).\n\n" +
      "Return the diameter: the number of edges in the longest path between any two nodes.",
    inputFormat: "Line 1: count.\nLine 2: level-order values.",
    outputFormat: "One integer: diameter (edges).",
    sampleTestCases: [{ input: "5\n1 2 3 4 5\n", output: "3\n" }],
    hiddenTestCases: [
      { input: "1\n1\n", output: "0\n" },
      { input: "2\n1 2\n", output: "1\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(level){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst vals=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(vals))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(level:list[int])->int: return 0\nlines=sys.stdin.read().splitlines()\nvals=list(map(int,lines[1].split()))\nprint(solve(vals))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(int[]a){return 0;}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(vector<int>a){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int solve(int*a,int n){return 0;}int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("%d\\n",solve(a,n));free(a);return 0;}\n`,
    },
  },

  "validate-binary-search-tree": {
    description:
      "Tree in level order (-1 null). Values may be negative.\n\n" +
      "Return YES if the tree is a valid binary search tree, else NO.",
    inputFormat: "Line 1: count.\nLine 2: level-order values.",
    outputFormat: "YES or NO.",
    sampleTestCases: [{ input: "7\n5 1 4 -1 -1 3 6\n", output: "NO\n" }],
    hiddenTestCases: [
      { input: "3\n2 1 3\n", output: "YES\n" },
      { input: "1\n1\n", output: "YES\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(level){return "NO";}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst vals=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(solve(vals)+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(level:list[int])->str: return "NO"\nlines=sys.stdin.read().splitlines()\nvals=list(map(int,lines[1].split()))\nprint(solve(vals))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int[]a){return "NO";}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `string solve(vector<int>a){return "NO";}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n` +
        B.C +
        `void solve(int*a,int n,char*o){strcpy(o,"NO");}int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);char o[8];solve(a,n,o);printf("%s\\n",o);free(a);return 0;}\n`,
    },
  },

  "kth-smallest-element-in-a-bst": {
    description:
      "You are given the inorder traversal of a BST (strictly increasing distinct integers).\n\n" +
      "Return the k-th smallest value (1-based k).",
    inputFormat: "Line 1: n and k.\nLine 2: n sorted distinct integers.",
    outputFormat: "One integer.",
    sampleTestCases: [{ input: "7 3\n1 2 3 4 5 6 7\n", output: "3\n" }],
    hiddenTestCases: [
      { input: "1 1\n42\n", output: "42\n" },
      { input: "5 5\n10 20 30 40 50\n", output: "50\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums,k){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [n,k]=L[0].trim().split(/\\s+/).map(Number);\nconst nums=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(nums,k))+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(nums:list[int],k:int)->int: return 0\nlines=sys.stdin.read().splitlines()\nn,k=map(int,lines[0].split())\nnums=list(map(int,lines[1].split()))\nprint(solve(nums,k))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(int[]a,int k){return 0;}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt(),k=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x,k));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(vector<int>a,int k){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,k;cin>>n>>k;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a,k)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int solve(int*a,int n,int k){return 0;}int main(){int n,k;scanf("%d%d",&n,&k);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("%d\\n",solve(a,n,k));free(a);return 0;}\n`,
    },
  },

  "lowest-common-ancestor-of-a-binary-search-tree": {
    description:
      "You are given a sorted list of distinct integers (the inorder traversal of some BST) and two values p and q that appear in the list.\n\n" +
      "Let i and j be the 0-based indices of p and q in that list. Return the element at index floor((i + j) / 2). (This matches the lowest common ancestor for the BST formed by inserting values in sorted order as a balanced structure — your task is to compute this index rule.)",
    inputFormat: "Line 1: p and q.\nLine 2: sorted distinct integers (inorder).",
    outputFormat: "One integer.",
    sampleTestCases: [{ input: "2 6\n1 2 3 4 5 6 7\n", output: "4\n" }],
    hiddenTestCases: [
      { input: "1 2\n1 2 3\n", output: "1\n" },
      { input: "5 6\n4 5 6 7\n", output: "5\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(sorted,p,q){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [p,q]=L[0].trim().split(/\\s+/).map(Number);\nconst sorted=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(sorted,p,q))+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(sorted_vals:list[int],p:int,q:int)->int: return 0\nlines=sys.stdin.read().splitlines()\np,q=map(int,lines[0].split())\nsorted_vals=list(map(int,lines[1].split()))\nprint(solve(sorted_vals,p,q))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(int[]a,int p,int q){return 0;}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int p=sc.nextInt(),q=sc.nextInt();String line=sc.nextLine();line=sc.nextLine();String[]ps=line.trim().split("\\\\s+");int[]a=new int[ps.length];for(int i=0;i<ps.length;i++)a[i]=Integer.parseInt(ps[i]);\nSystem.out.println(solve(a,p,q));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(vector<int>a,int p,int q){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint p,q;cin>>p>>q;vector<int>a;int x;while(cin>>x)a.push_back(x);cout<<solve(a,p,q)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int solve(int*a,int n,int p,int q){return 0;}int main(){int p,q;scanf("%d%d",&p,&q);int a[128],n=0,tmp;while(scanf("%d",&tmp)==1)a[n++]=tmp;printf("%d\\n",solve(a,n,p,q));return 0;}\n`,
    },
  },

  "binary-tree-level-order-traversal": {
    description:
      "Tree in level order (-1 null).\n\n" +
      "Print each level on its own line: space-separated node values (skip nulls).",
    inputFormat: "Line 1: count.\nLine 2: level-order values.",
    outputFormat: "Multiple lines: one level per line.",
    sampleTestCases: [
      {
        input: "7\n3 9 20 -1 -1 15 7\n",
        output: "3\n9 20\n15 7\n",
      },
    ],
    hiddenTestCases: [
      { input: "1\n1\n", output: "1\n" },
      { input: "3\n1 -1 2\n", output: "1\n2\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(level){return "";}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst vals=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(solve(vals));});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(level:list[int])->str: return ""\nlines=sys.stdin.read().splitlines()\nvals=list(map(int,lines[1].split()))\nsys.stdout.write(solve(vals))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int[]a){return "";}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.print(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `string solve(vector<int>a){return "";}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a);return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("\\n");free(a);return 0;}\n`,
    },
  },

  "serialize-and-deserialize-binary-tree": {
    description:
      "Read a level-order list (-1 for null).\n\n" +
      "Print the same level-order list back (identity check for your serialize/deserialize logic).",
    inputFormat: "Line 1: count.\nLine 2: level-order values.",
    outputFormat: "One line: same values space-separated.",
    sampleTestCases: [{ input: "5\n1 2 3 -1 -1 4 5\n", output: "1 2 3 -1 -1 4 5\n" }],
    hiddenTestCases: [
      { input: "1\n0\n", output: "0\n" },
      { input: "3\n1 -1 2\n", output: "1 -1 2\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(level){return [];}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst vals=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(solve(vals).join(" ")+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(level:list[int]): return []\nlines=sys.stdin.read().splitlines()\nvals=list(map(int,lines[1].split()))\nprint(" ".join(map(str,solve(vals))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int[]a){return "";}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `vector<int> solve(vector<int>a){return {};}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];auto o=solve(a);for(size_t i=0;i<o.size();i++){if(i)cout<<" ";cout<<o[i];}cout<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("\\n");free(a);return 0;}\n`,
    },
  },

  "subtree-of-another-tree": {
    description:
      "Two trees in level order (-1 null). First is main, second is candidate subtree.\n\n" +
      "Print YES if the second tree is a subtree of the first, else NO.",
    inputFormat:
      "Line 1: n1.\nLine 2: main tree level order.\nLine 3: n2.\nLine 4: subtree candidate level order.",
    outputFormat: "YES or NO.",
    sampleTestCases: [
      {
        input: "7\n3 4 5 1 2 -1 -1\n3\n4 1 2\n",
        output: "YES\n",
      },
    ],
    hiddenTestCases: [
      { input: "1\n1\n1\n2\n", output: "NO\n" },
      { input: "3\n1 1 1\n1\n1\n", output: "YES\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(a,b){return "NO";}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst a=L[1].trim().split(/\\s+/).map(Number);\nconst b=L[3].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(solve(a,b)+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(a:list[int],b:list[int])->str: return "NO"\nlines=sys.stdin.read().splitlines()\na=list(map(int,lines[1].split()))\nb=list(map(int,lines[3].split()))\nprint(solve(a,b))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int[]a,int[]b){return "NO";}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n1=sc.nextInt();int[]x=new int[n1];for(int i=0;i<n1;i++)x[i]=sc.nextInt();\nint n2=sc.nextInt();int[]y=new int[n2];for(int i=0;i<n2;i++)y[i]=sc.nextInt();\nSystem.out.println(solve(x,y));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `string solve(vector<int>a,vector<int>b){return "NO";}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n1;cin>>n1;vector<int>a(n1);for(int i=0;i<n1;i++)cin>>a[i];int n2;cin>>n2;vector<int>b(n2);for(int i=0;i<n2;i++)cin>>b[i];cout<<solve(a,b)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n` +
        B.C +
        `void solve(int*a,int na,int*b,int nb,char*o){strcpy(o,"NO");}int main(){int n1;scanf("%d",&n1);int*a=malloc(sizeof(int)*n1);for(int i=0;i<n1;i++)scanf("%d",&a[i]);int n2;scanf("%d",&n2);int*b=malloc(sizeof(int)*n2);for(int i=0;i<n2;i++)scanf("%d",&b[i]);char o[8];solve(a,n1,b,n2,o);printf("%s\\n",o);free(a);free(b);return 0;}\n`,
    },
  },

  "construct-binary-tree-from-preorder-and-inorder-traversal": {
    description:
      "Line 1: preorder traversal (n distinct integers).\n\n" +
      "Line 2: inorder traversal (same n values).\nPrint the postorder traversal on one line.",
    inputFormat: "Line 1: n.\nLine 2: preorder.\nLine 3: inorder.",
    outputFormat: "Space-separated postorder.",
    sampleTestCases: [
      {
        input: "5\n3 9 20 15 7\n9 3 15 20 7\n",
        output: "9 15 7 20 3\n",
      },
    ],
    hiddenTestCases: [
      { input: "1\n1\n1\n", output: "1\n" },
      { input: "2\n1 2\n2 1\n", output: "2 1\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(pre,inorder){return [];}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst pre=L[1].trim().split(/\\s+/).map(Number);\nconst io=L[2].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(solve(pre,io).join(" ")+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(pre:list[int],ino:list[int]): return []\nlines=sys.stdin.read().splitlines()\nn=int(lines[0])\npre=list(map(int,lines[1].split()))\nino=list(map(int,lines[2].split()))\nprint(" ".join(map(str,solve(pre,ino))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int[]pre,int[]in){return "";}public static void main(String[]a){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]pre=new int[n],in=new int[n];for(int i=0;i<n;i++)pre[i]=sc.nextInt();for(int i=0;i<n;i++)in[i]=sc.nextInt();\nSystem.out.println(solve(pre,in));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `string solve(vector<int>pre,vector<int>in){return "";}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>pre(n),in(n);for(int i=0;i<n;i++)cin>>pre[i];for(int i=0;i<n;i++)cin>>in[i];cout<<solve(pre,in)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int main(){int n;scanf("%d",&n);int*p=malloc(sizeof(int)*n),*i=malloc(sizeof(int)*n);for(int j=0;j<n;j++)scanf("%d",&p[j]);for(int j=0;j<n;j++)scanf("%d",&i[j]);printf("\\n");free(p);free(i);return 0;}\n`,
    },
  },

  "implement-trie-prefix-tree": {
    description:
      "Line 1: n operations.\nEach next line: INSERT word or COUNT prefix where word and prefix are nonempty strings without spaces.\n\n" +
      "For COUNT, print how many inserted words have that exact prefix.",
    inputFormat: "INSERT s or COUNT p per line.",
    outputFormat: "One line per COUNT: integer.",
    sampleTestCases: [
      {
        input: "5\nINSERT apple\nINSERT app\nCOUNT app\nINSERT apricot\nCOUNT ap\n",
        output: "2\n3\n",
      },
    ],
    hiddenTestCases: [
      { input: "2\nINSERT a\nCOUNT a\n", output: "1\n" },
      { input: "3\nINSERT ab\nCOUNT a\nCOUNT z\n", output: "1\n0\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(ops){return [];}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst n=+L[0];const ops=L.slice(1,1+n);\nconst out=solve(ops);\nprocess.stdout.write(out.join("\\n")+(out.length?"\\n":""));});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(ops:list[str]): return []\nlines=sys.stdin.read().splitlines()\nn=int(lines[0])\nops=lines[1:1+n]\nprint("\\n".join(map(str,solve(ops))))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(String[]ops){return "";}public static void main(String[]a){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();sc.nextLine();String[]ops=new String[n];for(int i=0;i<n;i++)ops[i]=sc.nextLine();\nSystem.out.print(solve(ops));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;cin.ignore();vector<string>ops(n);for(int i=0;i<n;i++)getline(cin,ops[i]);cout<<"";return 0;}\n`,
      C:
        `#include <stdio.h>\n` +
        B.C +
        `int main(){int n;scanf("%d",&n);char buf[256];for(int i=0;i<n;i++)scanf("%s",buf);printf("\\n");return 0;}\n`,
    },
  },

  "word-search-ii": {
    description:
      "Line 1: r c k.\nNext r lines: grid rows (letters).\nNext k lines: one word per line.\n\n" +
      "Print how many given words can be found in the grid (same rules as word search).",
    inputFormat: "Grid then words.",
    outputFormat: "One integer: count of words found.",
    sampleTestCases: [
      {
        input: "4 4 2\nabcd\nefgh\nijkl\nmnop\nabc\no\n",
        output: "1\n",
      },
    ],
    hiddenTestCases: [
      { input: "1 1 1\na\na\n", output: "1\n" },
      { input: "1 2 1\nab\nz\n", output: "0\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(grid,words){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst [r,c,k]=L[0].trim().split(/\\s+/).map(Number);\nconst grid=L.slice(1,1+r);\nconst words=L.slice(1+r,1+r+k);\nprocess.stdout.write(String(solve(grid,words))+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(grid:list[str],words:list[str])->int: return 0\nlines=sys.stdin.read().splitlines()\nr,c,k=map(int,lines[0].split())\ngrid=lines[1:1+r]\nwords=lines[1+r:1+r+k]\nprint(solve(grid,words))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(String[]g,String[]w){return 0;}public static void main(String[]a){\nScanner sc=new Scanner(System.in);int r=sc.nextInt(),c=sc.nextInt(),k=sc.nextInt();String[]g=new String[r];for(int i=0;i<r;i++)g[i]=sc.next();String[]w=new String[k];for(int i=0;i<k;i++)w[i]=sc.next();\nSystem.out.println(solve(g,w));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(vector<string>g,vector<string>w){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint r,c,k;cin>>r>>c>>k;vector<string>g(r);for(int i=0;i<r;i++)cin>>g[i];vector<string>w(k);for(int i=0;i<k;i++)cin>>w[i];cout<<solve(g,w)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n` +
        B.C +
        `int main(){int r,c,k;scanf("%d%d%d",&r,&c,&k);char g[32][32];for(int i=0;i<r;i++)scanf("%s",g[i]);char w[32][32];for(int i=0;i<k;i++)scanf("%s",w[i]);printf("0\\n");return 0;}\n`,
    },
  },

  "top-k-frequent-elements": {
    description:
      "Line 1: n and k.\nLine 2: n integers.\n\n" +
      "Print the k most frequent values sorted by frequency desc, then value asc. Break ties by smaller value first.",
    inputFormat: "n k then array.",
    outputFormat: "k integers space-separated.",
    sampleTestCases: [{ input: "6 2\n1 1 1 2 2 3\n", output: "1 2\n" }],
    hiddenTestCases: [
      { input: "1 1\n5\n", output: "5\n" },
      { input: "4 2\n2 2 3 3\n", output: "2 3\n" },
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
        `string solve(vector<int>a,int k){return "";}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,k;cin>>n>>k;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a,k)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int main(){int n,k;scanf("%d%d",&n,&k);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("\\n");free(a);return 0;}\n`,
    },
  },

  "find-median-from-data-stream": {
    description:
      "Line 1: n integers.\n\n" +
      "Print the median of the multiset (average of two middle values if n is even).",
    inputFormat: "Line 1: n.\nLine 2: n integers.",
    outputFormat: "One number: median (use .5 if needed, or print as fraction - here print one line with the median value; for even n print average as decimal if needed — for integer arrays use .5: e.g. 2.5).",
    sampleTestCases: [{ input: "5\n1 2 3 4 5\n", output: "3\n" }],
    hiddenTestCases: [
      { input: "2\n1 2\n", output: "1.5\n" },
      { input: "4\n1 2 3 4\n", output: "2.5\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst nums=L[1].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(nums))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(nums:list[int]): return 0\nlines=sys.stdin.read().splitlines()\nnums=list(map(int,lines[1].split()))\nprint(solve(nums))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static String solve(int[]a){return "";}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `string solve(vector<int>a){return "";}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("0\\n");free(a);return 0;}\n`,
    },
  },

  "subsets": {
    description:
      "You are given n distinct integers.\n\n" +
      "Print the number of different subsets of the set (including empty set).",
    inputFormat: "Line 1: n.\nLine 2: n distinct integers.",
    outputFormat: "One integer: 2^n.",
    sampleTestCases: [{ input: "3\n1 2 3\n", output: "8\n" }],
    hiddenTestCases: [
      { input: "0\n\n", output: "1\n" },
      { input: "1\n5\n", output: "2\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(nums){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst nums=L[1].trim()?L[1].trim().split(/\\s+/).map(Number):[];\nprocess.stdout.write(String(solve(nums))+"\\n");});\n`,
      Python:
        `import sys\n` + B.Python + `def solve(nums:list[int])->int: return 0\nlines=sys.stdin.read().splitlines()\nn=int(lines[0])\nnums=list(map(int,lines[1].split())) if len(lines)>1 and lines[1].strip() else []\nprint(solve(nums))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static long solve(int[]a){return 0;}public static void main(String[]a2){\nScanner sc=new Scanner(System.in);int n=sc.nextInt();int[]x=new int[n];for(int i=0;i<n;i++)x[i]=sc.nextInt();\nSystem.out.println(solve(x));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `long long solve(vector<int>a){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<int>a(n);for(int i=0;i<n;i++)cin>>a[i];cout<<solve(a)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `long long solve(int*a,int n){return 0;}int main(){int n;scanf("%d",&n);int*a=malloc(sizeof(int)*n);for(int i=0;i<n;i++)scanf("%d",&a[i]);printf("%lld\\n",solve(a,n));free(a);return 0;}\n`,
    },
  },

  "combination-sum-ii": {
    description:
      "Each coin value may be used at most once. Count combinations that sum to target (order ignored).",
    inputFormat: "Line 1: target.\nLine 2: k.\nLine 3: k positive integers (may contain duplicates).",
    outputFormat: "One integer: number of combinations.",
    sampleTestCases: [{ input: "8\n7\n10 1 2 7 6 1 5\n", output: "2\n" }],
    hiddenTestCases: [
      { input: "5\n2\n2 3\n", output: "1\n" },
      { input: "3\n1\n4\n", output: "0\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `function solve(target,coins){return 0;}\nconst readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nconst L=[];rl.on("line",l=>L.push(l));rl.on("close",()=>{\nconst t=+L[0];const coins=L[2].trim().split(/\\s+/).map(Number);\nprocess.stdout.write(String(solve(t,coins))+"\\n");});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `def solve(t:int,coins:list[int])->int: return 0\nlines=sys.stdin.read().splitlines()\nt=int(lines[0])\ncoins=list(map(int,lines[2].split()))\nprint(solve(t,coins))\n`,
      Java:
        `import java.util.*;\n` +
        B.Java +
        `public class Main{static int solve(int t,int[]c){return 0;}public static void main(String[]a){\nScanner sc=new Scanner(System.in);int t=sc.nextInt();int k=sc.nextInt();int[]c=new int[k];for(int i=0;i<k;i++)c[i]=sc.nextInt();\nSystem.out.println(solve(t,c));sc.close();}}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n` +
        B["C++"] +
        `int solve(int t,vector<int>c){return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint t,k;cin>>t>>k;vector<int>c(k);for(int i=0;i<k;i++)cin>>c[i];cout<<solve(t,c)<<endl;return 0;}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n` +
        B.C +
        `int solve(int t,int*c,int k){return 0;}int main(){int t,k;scanf("%d%d",&t,&k);int*c=malloc(sizeof(int)*k);for(int i=0;i<k;i++)scanf("%d",&c[i]);printf("%d\\n",solve(t,c,k));free(c);return 0;}\n`,
    },
  },

  "course-schedule-ii": {
    description:
      "There are **n** courses labeled **0** through **n − 1**. You are given prerequisite pairs as a directed graph.\n\n" +
      "**Directed edge (a, b):** This means **a → b** — you must complete course **a** before you may start course **b** (a is a prerequisite of b).\n\n" +
      "Find **one** order that includes **every** course exactly once and respects all edges. If the graph has a **directed cycle**, it is **impossible** to finish all courses, because prerequisites chase each other in a loop — in that case output **-1** only.\n\n" +
      "**Constraints**\n" +
      "- 1 ≤ n ≤ 10^5\n" +
      "- 0 ≤ m ≤ 2 * 10^5\n" +
      "- 0 ≤ a, b < n for every edge\n\n" +
      "**Edge cases to think about**\n" +
      "- **No edges (m = 0):** no prerequisites; any permutation of all labels that lists each course once is valid (the grader checks one canonical valid order).\n" +
      "- **Single course (n = 1):** the only possible line is **0**.\n" +
      "- **Cycle:** if you can follow edges and return to a course you already need to finish, output **-1**.",
    inputFormat:
      "**Line 1:** Two integers **n** and **m** — number of courses and number of prerequisite pairs.\n\n" +
      "**Next m lines:** Two integers **a** and **b** each, denoting a directed edge **a → b** (take **a** before **b**).",
    outputFormat:
      "- If a valid order of all **n** courses exists: print **one** line with **n** distinct integers, space-separated (no trailing space required).\n" +
      "- Otherwise: print a single line containing **-1**.",
    sampleTestCases: [{ input: "4 1\n1 0\n", output: "2 3 1 0\n" }],
    hiddenTestCases: [
      { input: "2 2\n1 0\n0 1\n", output: "-1\n" },
      { input: "1 0\n", output: "0\n" },
      { input: "3 0\n", output: "0 1 2\n" },
      { input: "2 1\n0 1\n", output: "0 1\n" },
    ],
    marks: 10,
    starterCode: {
      Javascript:
        B.Javascript +
        `/**\n * Return a valid topological order of all n courses, or [-1] if impossible.\n */\nfunction solve(n, edges) {\n  const graph = Array.from({ length: n }, () => []);\n  const indegree = new Array(n).fill(0);\n  for (const [a, b] of edges) {\n    graph[a].push(b); // a → b\n    indegree[b]++;\n  }\n\n  const order = [];\n  // TODO: build queue/stack of nodes with indegree 0, run Kahn (BFS) or DFS post-order\n  // while (queue not empty) { pop u; push u to order; relax neighbors }\n  // if (order.length !== n) return [-1];\n  // return order;\n\n  return [-1]; // replace once your algorithm is complete\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n  const [n, m] = lines[0].trim().split(/\\s+/).map(Number);\n  const edges = [];\n  for (let i = 1; i <= m; i++) {\n    const [a, b] = lines[i].trim().split(/\\s+/).map(Number);\n    edges.push([a, b]);\n  }\n  const o = solve(n, edges);\n  if (o.length === 1 && o[0] === -1) process.stdout.write("-1\\n");\n  else process.stdout.write(o.join(" ") + "\\n");\n});\n`,
      Python:
        `import sys\n` +
        B.Python +
        `from collections import deque\n\n\ndef solve(n: int, edges: list[tuple[int, int]]) -> list[int]:\n    graph = [[] for _ in range(n)]\n    indegree = [0] * n\n    for a, b in edges:\n        graph[a].append(b)  # directed edge a → b\n        indegree[b] += 1\n\n    order: list[int] = []\n    # TODO: queue = deque([i for i in range(n) if indegree[i] == 0])\n    # while queue: pop u, append to order, relax neighbors' indegree\n    # if len(order) != n: return [-1]\n    # return order\n\n    return [-1]  # replace once your topological order is complete\n\n\ndef main() -> None:\n    lines = sys.stdin.read().splitlines()\n    n, m = map(int, lines[0].split())\n    edges = [tuple(map(int, lines[i].split())) for i in range(1, m + 1)]\n    o = solve(n, edges)\n    print(-1 if o == [-1] else " ".join(map(str, o)))\n\n\nif __name__ == "__main__":\n    main()\n`,
      Java:
        `import java.util.*;\n\n` +
        B.Java +
        `public class Main {\n    /** Return topological order, or {-1} if impossible. */\n    static int[] solve(int n, int[][] edges) {\n        List<List<Integer>> graph = new ArrayList<>();\n        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());\n        int[] indeg = new int[n];\n        for (int[] e : edges) {\n            int a = e[0], b = e[1];\n            graph.get(a).add(b); // a → b\n            indeg[b]++;\n        }\n\n        // TODO: ArrayDeque<Integer> q — start with all indeg[i] == 0\n        // while (!q.isEmpty()) { poll u; add to order; relax neighbors }\n        // if (order.size() != n) return new int[] { -1 };\n        // return order as int[]\n\n        return new int[] { -1 }; // replace once complete\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int m = sc.nextInt();\n        int[][] edges = new int[m][2];\n        for (int i = 0; i < m; i++) {\n            edges[i][0] = sc.nextInt();\n            edges[i][1] = sc.nextInt();\n        }\n        int[] out = solve(n, edges);\n        if (out.length == 1 && out[0] == -1) {\n            System.out.println(-1);\n        } else {\n            StringBuilder sb = new StringBuilder();\n            for (int i = 0; i < out.length; i++) {\n                if (i > 0) sb.append(" ");\n                sb.append(out[i]);\n            }\n            System.out.println(sb.toString());\n        }\n        sc.close();\n    }\n}\n`,
      "C++":
        `#include <bits/stdc++.h>\nusing namespace std;\n\n` +
        B["C++"] +
        `vector<int> solve(int n, vector<pair<int, int>> const& edges) {\n    vector<vector<int>> g(n);\n    vector<int> indeg(n);\n    for (auto [a, b] : edges) {\n        g[a].push_back(b);\n        indeg[b]++;\n    }\n    vector<int> order;\n    // TODO: queue<int> q — push all i with indeg[i]==0, then Kahn\n    // if ((int)order.size() != n) return {-1};\n    // return order;\n    return {-1};\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n, m;\n    cin >> n >> m;\n    vector<pair<int, int>> e(m);\n    for (int i = 0; i < m; i++) cin >> e[i].first >> e[i].second;\n    vector<int> out = solve(n, e);\n    if (out.size() == 1 && out[0] == -1)\n        cout << -1 << "\\n";\n    else {\n        for (size_t i = 0; i < out.size(); i++) {\n            if (i) cout << " ";\n            cout << out[i];\n        }\n        cout << "\\n";\n    }\n    return 0;\n}\n`,
      C:
        `#include <stdio.h>\n#include <stdlib.h>\n\n` +
        B.C +
        `/**\n * edges: m directed edges U[i] → V[i]\n * On success: fill out[0..n-1], set *out_len = n\n * On failure: set *out_len = -1\n */\nvoid solve(int n, int m, int *U, int *V, int *out_len, int *out) {\n    (void)U;\n    (void)out;\n    int *indeg = (int *)calloc((size_t)n, sizeof(int));\n    for (int i = 0; i < m; i++) {\n        indeg[V[i]]++; /* edge U[i] → V[i] */\n    }\n    /* TODO: build adjacency from U,V; queue nodes with indegree 0; Kahn */\n    free(indeg);\n    *out_len = -1;\n}\n\nint main(void) {\n    int n, m;\n    if (scanf("%d%d", &n, &m) != 2) return 0;\n    int *U = (int *)malloc(sizeof(int) * (size_t)m);\n    int *V = (int *)malloc(sizeof(int) * (size_t)m);\n    for (int i = 0; i < m; i++) scanf("%d%d", &U[i], &V[i]);\n    int *out = (int *)malloc(sizeof(int) * (size_t)n);\n    int len;\n    solve(n, m, U, V, &len, out);\n    if (len < 0)\n        printf("-1\\n");\n    else {\n        for (int i = 0; i < len; i++) {\n            if (i) printf(" ");\n            printf("%d", out[i]);\n        }\n        printf("\\n");\n    }\n    free(U);\n    free(V);\n    free(out);\n    return 0;\n}\n`,
    },
  },
};
