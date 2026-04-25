export async function searchWiki(query) {
  const url = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(query)}&limit=5`;
  const res = await fetch(url, {
    headers: {
      "Api-User-Agent": "MyWikiApp/1.0",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Wikipedia");
  }

  return res.json();
}

export async function getWikiDetail(title) {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  );
  return res.json();
}