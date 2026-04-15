/**
 * Judge0 HTTP client (self-hosted or cloud).
 *
 * RapidAPI: `JUDGE0_API_URL` must be the **exact** base URL of the product you subscribed to
 * (e.g. Judge0 Extra CE → `https://judge0-extra-ce1.p.rapidapi.com`). A different host → 403.
 * `JUDGE0_API_KEY` is your RapidAPI key; `X-RapidAPI-Host` is derived from the URL hostname.
 */

export function normalizeJudge0BaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getJudge0BaseUrl(): string {
  return normalizeJudge0BaseUrl(process.env.JUDGE0_API_URL || "https://api.judge0.com");
}

export function buildJudge0Headers(): Record<string, string> {
  const base = getJudge0BaseUrl();
  const key = process.env.JUDGE0_API_KEY || "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (base.includes("rapidapi")) {
    headers["X-RapidAPI-Key"] = key;
    headers["X-RapidAPI-Host"] = new URL(base).hostname;
  } else if (key) {
    headers["X-Judge0-Key"] = key;
  }
  return headers;
}

export type Judge0RunResult = {
  passed: boolean;
  status: string;
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  time?: string | null;
  memory?: number | null;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runJudge0Submission(
  sourceCode: string,
  languageId: number,
  stdin: string,
  expectedOutput: string
): Promise<Judge0RunResult> {
  const base = getJudge0BaseUrl();
  const url = `${base}/submissions?base64_encoded=false&wait=true`;
  const transientStatuses = new Set([429, 500, 502, 503, 504]);
  const maxAttempts = 3;

  try {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const submissionResponse = await fetch(url, {
        method: "POST",
        headers: buildJudge0Headers(),
        body: JSON.stringify({
          source_code: sourceCode,
          language_id: languageId,
          stdin,
          expected_output: expectedOutput,
        }),
      });

      if (!submissionResponse.ok) {
        const text = await submissionResponse.text();
        console.error("Judge0 HTTP error:", submissionResponse.status, text);

        if (transientStatuses.has(submissionResponse.status) && attempt < maxAttempts) {
          await sleep(450 * attempt);
          continue;
        }

        let hint = `Judge0 HTTP ${submissionResponse.status}`;
        if (submissionResponse.status === 429) {
          hint = "Judge0 is rate-limited right now. Please retry in a few seconds.";
        } else if (submissionResponse.status === 403 && base.includes("rapidapi")) {
          hint =
            "RapidAPI 403: subscribe to this Judge0 product, or set JUDGE0_API_URL to the same host shown in RapidAPI (e.g. judge0-extra-ce1.p.rapidapi.com).";
        } else if (submissionResponse.status === 401 || submissionResponse.status === 403) {
          hint = "Judge0 rejected the request — check JUDGE0_API_KEY and API URL.";
        }
        return { passed: false, status: hint };
      }

      const data = (await submissionResponse.json()) as {
        status?: { id?: number; description?: string };
        stdout?: string;
        stderr?: string;
        compile_output?: string;
        time?: string | null;
        memory?: number | null;
      };

      const status = data.status;
      const statusId = status?.id;
      return {
        passed: statusId === 3,
        status: status?.description ?? "Unknown",
        stdout: data.stdout,
        stderr: data.stderr,
        compile_output: data.compile_output,
        time: data.time,
        memory: data.memory,
      };
    }

    return { passed: false, status: "Judge0 unavailable. Please retry." };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Judge0 Error:", msg);
    return { passed: false, status: "Internal Error" };
  }
}
