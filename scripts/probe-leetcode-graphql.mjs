async function gql(query, variables = {}) {
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com/",
      "User-Agent": "Mozilla/5.0 (compatible; MADAlgos-seed/1)",
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

async function main() {
  const detail = await gql(
    `query q($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        title
        exampleTestcaseList
        sampleTestCase
        metaData
      }
    }`,
    { titleSlug: "two-sum" }
  );
  console.log(JSON.stringify(detail, null, 2));
}

main().catch(console.error);
