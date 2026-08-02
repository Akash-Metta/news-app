const cleanQ = "who created chatgpt";
const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQ)}&utf8=&format=json&origin=*`;

fetch(wikiUrl)
  .then(res => res.text())
  .then(data => {
    console.log("WIKI TEXT FIRST 500 CHARS:", data.substring(0, 500));
  })
  .catch(err => {
    console.error("WIKI ERROR:", err);
  });
