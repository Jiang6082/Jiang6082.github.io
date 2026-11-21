// Minimal CSV reader for hand-edited data files: comma-separated, a header
// row, double-quoted fields may contain commas, newlines, and "" escapes.
// Blank lines and lines starting with # are skipped.
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  const content = rows.filter(
    (r) => !(r.length === 1 && r[0].trim() === "") && !r[0].trim().startsWith("#"),
  );
  const [header, ...body] = content;
  if (!header) return [];
  const keys = header.map((h) => h.trim());
  return body.map((r) =>
    Object.fromEntries(keys.map((key, i) => [key, (r[i] ?? "").trim()])),
  );
}
