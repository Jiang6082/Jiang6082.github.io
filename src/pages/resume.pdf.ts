// /resume.pdf: the résumé as a one-file PDF, built from the same data as
// the web page (src/data/resume.ts), so the two never drift apart.
// No phone number, like the web page.
import PDFDocument from "pdfkit";
import { resume as r, resumeProjects } from "../data/resume";
import { SITE, SOCIALS } from "../config";

// The PDF's built-in Helvetica can't draw a few characters the site uses.
const clean = (s: string) =>
  s
    .replace(/−/g, "-")
    .replace(/ⁿ/g, "^n")
    .replace(/→/g, "->")
    .replace(/≈/g, "~");
const short = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const social = (name: string) => SOCIALS.find((s) => s.name === name)!.url;

export async function GET() {
  const doc = new PDFDocument({
    size: "LETTER",
    margins: { top: 40, bottom: 40, left: 46, right: 46 },
    info: { Title: `${r.name} — Résumé`, Author: r.name },
  });
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));

  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;
  const ink = "#1f2420";
  const grey = "#5b5e55";
  const accent = "#b43d28";
  const bottom = () => doc.page.height - doc.page.margins.bottom;
  // Keep a heading with at least a couple of lines after it.
  const room = (pts: number) => {
    if (doc.y + pts > bottom()) doc.addPage();
  };

  /** Bold name on the left, dates on the right, on one line. */
  const titleLine = (name: string, dates: string, size = 10) => {
    room(40);
    const y = doc.y;
    doc.font("Helvetica").fontSize(8.5).fillColor(grey);
    const datesWidth = doc.widthOfString(dates);
    doc.text(clean(dates), left, y + (size - 8.5) * 0.6, { width, align: "right" });
    doc
      .font("Helvetica-Bold")
      .fontSize(size)
      .fillColor(ink)
      .text(clean(name), left, y, { width: width - datesWidth - 12 });
    doc.x = left;
  };
  const line = (text: string, opts: { font?: string; size?: number; color?: string; gap?: number } = {}) => {
    doc
      .font(opts.font ?? "Helvetica")
      .fontSize(opts.size ?? 9)
      .fillColor(opts.color ?? ink)
      .text(clean(text), left, doc.y, { width, lineGap: 1 });
    doc.moveDown(opts.gap ?? 0.1);
  };
  const bullets = (items: string[]) => {
    doc.font("Helvetica").fontSize(9).fillColor(ink);
    for (const item of items) {
      room(24);
      const y = doc.y;
      doc.text("•", left + 2, y);
      doc.text(clean(item), left + 11, y, { width: width - 11, lineGap: 1 });
      doc.moveDown(0.12);
    }
    doc.x = left;
  };
  const section = (title: string) => {
    room(60);
    doc.moveDown(0.45);
    doc.font("Helvetica-Bold").fontSize(10).fillColor(accent).text(title.toUpperCase(), left, doc.y, {
      characterSpacing: 0.8,
    });
    const y = doc.y + 2;
    doc.moveTo(left, y).lineTo(left + width, y).lineWidth(0.5).strokeColor("#c9c7bb").stroke();
    doc.y = y + 5;
  };

  // Header
  doc.font("Helvetica-Bold").fontSize(18).fillColor(ink).text(clean(r.name), left, doc.y);
  doc.moveDown(0.2);
  line(r.summary, { color: grey, size: 9.5 });
  const contact = [
    { text: SITE.email, link: `mailto:${SITE.email}` },
    { text: short(social("LinkedIn")), link: social("LinkedIn") },
    { text: short(social("GitHub")), link: social("GitHub") },
    { text: short(SITE.url), link: SITE.url },
  ];
  doc.font("Helvetica").fontSize(9).fillColor(ink);
  contact.forEach((c, i) => {
    doc.text(c.text, { link: c.link, continued: i < contact.length - 1, underline: false });
    if (i < contact.length - 1) doc.fillColor(grey).text("   ·   ", { continued: true }).fillColor(ink);
  });
  doc.x = left;

  section("Education");
  for (const ed of r.education) {
    titleLine(ed.school, ed.dates);
    line([ed.degree, ed.location, ed.gpa && `GPA ${ed.gpa}`].filter(Boolean).join(" · "), { color: grey });
    line(`${ed.courseworkLabel}: ${ed.coursework.join(", ")}`, { gap: 0.45 });
  }
  line(`Programs & certificates: ${r.programs.join(", ")}`);

  section("Experience");
  for (const e of r.experience) {
    titleLine(e.organization, e.dates);
    line(`${e.role} · ${e.location}`, { font: "Helvetica-Oblique", color: grey, gap: 0.15 });
    if (e.bullets.length) bullets(e.bullets);
    doc.moveDown(0.25);
  }

  section("Projects");
  for (const p of resumeProjects) {
    titleLine(p.name, p.dates);
    line(p.tools, { color: grey, gap: 0.15 });
    bullets(p.bullets);
    if (p.links.length) {
      doc.font("Helvetica").fontSize(8.5).fillColor(grey);
      p.links.forEach((l, i) => {
        const url = `${SITE.url}${l.href}`;
        doc.text(short(url), { link: url, continued: i < p.links.length - 1 });
        if (i < p.links.length - 1) doc.text("   ·   ", { continued: true });
      });
      doc.x = left;
    }
    doc.moveDown(0.25);
  }

  section("Skills");
  for (const s of r.skills) {
    room(20);
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(ink)
      .text(`${s.group}: `, left, doc.y, { continued: true, width })
      .font("Helvetica")
      .text(clean(s.items.join(", ")));
    doc.moveDown(0.15);
  }

  doc.end();
  const pdf = await done;
  return new Response(new Uint8Array(pdf), {
    headers: { "Content-Type": "application/pdf" },
  });
}
