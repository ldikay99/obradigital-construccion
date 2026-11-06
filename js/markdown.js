/** Minimal markdown → HTML for the business plan page */
window.renderMarkdown = function (md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let inUl = false, inOl = false, inTable = false, tableBuf = [];

  const closeLists = () => {
    if (inUl) { html += "</ul>"; inUl = false; }
    if (inOl) { html += "</ol>"; inOl = false; }
  };
  const flushTable = () => {
    if (!inTable) return;
    const rows = tableBuf.filter(r => !/^\s*\|?\s*[-:]+/.test(r));
    html += "<table>";
    rows.forEach((row, i) => {
      const cells = row.replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim());
      const tag = i === 0 ? "th" : "td";
      html += "<tr>" + cells.map(c => `<${tag}>${inline(c)}</${tag}>`).join("") + "</tr>";
    });
    html += "</table>";
    tableBuf = []; inTable = false;
  };
  const inline = (s) => s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");

  for (const raw of lines) {
    const line = raw;
    if (line.trim().startsWith("|")) {
      closeLists();
      inTable = true; tableBuf.push(line); continue;
    } else if (inTable) flushTable();

    if (/^\s*---\s*$/.test(line)) { closeLists(); html += "<hr/>"; continue; }
    if (/^### /.test(line)) { closeLists(); html += `<h3>${inline(line.slice(4))}</h3>`; continue; }
    if (/^## /.test(line)) { closeLists(); html += `<h2>${inline(line.slice(3))}</h2>`; continue; }
    if (/^# /.test(line)) { closeLists(); html += `<h1>${inline(line.slice(2))}</h1>`; continue; }
    if (/^[-*] /.test(line)) {
      if (inOl) { html += "</ol>"; inOl = false; }
      if (!inUl) { html += "<ul>"; inUl = true; }
      html += `<li>${inline(line.replace(/^[-*] /, ""))}</li>`; continue;
    }
    if (/^\d+\. /.test(line)) {
      if (inUl) { html += "</ul>"; inUl = false; }
      if (!inOl) { html += "<ol>"; inOl = true; }
      html += `<li>${inline(line.replace(/^\d+\. /, ""))}</li>`; continue;
    }
    if (!line.trim()) { closeLists(); continue; }
    closeLists();
    html += `<p>${inline(line)}</p>`;
  }
  flushTable(); closeLists();
  return html;
};
