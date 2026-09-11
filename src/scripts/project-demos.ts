import {
  filterHomes,
  samplePValues,
  selectedHypotheses,
  sampleVolatility,
  forecastAt,
  qlike,
} from "../lib/project-demos.js";
export function initializeDemos(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("[data-demo]").forEach((el) => {
    if (el.dataset.ready) return;
    el.dataset.ready = "true";
    el.querySelectorAll<HTMLElement>("[data-enhanced]").forEach(
      (c) => (c.hidden = false),
    );
    const input = (name: string) =>
      el.querySelector<HTMLInputElement | HTMLSelectElement>(
        `[data-input="${name}"]`,
      )!;
    const reading = el.querySelector<HTMLOutputElement>("[data-reading]");
    const action = (name: string) =>
      el.querySelector<HTMLButtonElement>(`[data-action="${name}"]`)!;
    if (el.dataset.demo === "homes") {
      let page = 1;
      const render = () => {
        const result = filterHomes({
          city: input("city").value,
          price: Number(input("price").value),
          beds: Number(input("beds").value),
          sort: input("sort").value,
          page,
        });
        page = result.page;
        const list = el.querySelector("[data-results]")!;
        list.replaceChildren();
        result.rows.forEach((h) => {
          const card = document.createElement("article");
          const icon = document.createElement("span");
          icon.className = "house-shape";
          icon.textContent = "⌂";
          icon.setAttribute("aria-hidden", "true");
          const title = document.createElement("p");
          title.textContent = `Sample ${h.id} · ${h.city}`;
          const price = document.createElement("strong");
          price.textContent = `$${h.price.toLocaleString("en-US")}`;
          const specs = document.createElement("p");
          specs.textContent = `${h.beds} bedrooms · ${h.sqft.toLocaleString("en-US")} sq ft`;
          card.append(icon, title, price, specs);
          list.append(card);
        });
        if (!result.total) {
          const p = document.createElement("p");
          p.textContent =
            "No matches. Try another city, a higher budget, or fewer bedrooms.";
          list.append(p);
        }
        el.querySelector("[data-status]")!.textContent =
          `${result.total} matches · page ${page} of ${result.pages}`;
        action("prev").disabled = page === 1;
        action("next").disabled = page === result.pages;
      };
      el.querySelectorAll("select").forEach((s) =>
        s.addEventListener("change", () => {
          page = 1;
          render();
        }),
      );
      action("prev").addEventListener("click", () => {
        page--;
        render();
      });
      action("next").addEventListener("click", () => {
        page++;
        render();
      });
      action("reset").addEventListener("click", () => {
        input("city").value = "";
        input("price").value = "1000000";
        input("beds").value = "0";
        input("sort").value = "asc";
        page = 1;
        render();
      });
      render();
    }
    if (el.dataset.demo === "costs") {
      const rows = JSON.parse(el.querySelector("[data-values]")!.textContent!);
      const render = () => {
        const row = rows[Number(input("cost").value)],
          capital = Number(input("capital").value);
        el.querySelectorAll("[data-cost-dot]").forEach((dot, i) =>
          dot.setAttribute("r", i === Number(input("cost").value) ? "8" : "4"),
        );
        if (!Number.isFinite(capital) || capital < 100 || capital > 10000000) {
          reading!.textContent =
            "Enter a starting balance between $100 and $10,000,000.";
          return;
        }
        const money = (n: number) =>
          n.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
          });
        reading!.textContent = `${row.cost}: ${row.return.toFixed(2)}% total return · Sharpe ${row.sharpe} · max drawdown ${row.drawdown}. ${money(capital)} → ${money(capital * (1 + row.return / 100))}.`;
      };
      input("cost").addEventListener("change", render);
      input("capital").addEventListener("input", render);
      render();
    }
    if (el.dataset.demo === "forecast") {
      const render = () => {
        const day = Number(input("day").value),
          window = Number(input("window").value);
        el.querySelector("[data-day]")!.textContent = String(day + 1);
        el.querySelector("[data-actual]")!.setAttribute(
          "points",
          sampleVolatility
            .slice(0, day + 1)
            .map((v, i) => `${35 + i * 13.5},${200 - v * 3.5}`)
            .join(" "),
        );
        el.querySelector("[data-forecast]")!.setAttribute(
          "points",
          Array.from(
            { length: day },
            (_, i) =>
              `${35 + (i + 1) * 13.5},${200 - forecastAt(sampleVolatility, i + 1, window) * 3.5}`,
          ).join(" "),
        );
        for (const attr of ["x1", "x2"])
          el.querySelector("[data-cursor]")!.setAttribute(
            attr,
            String(35 + day * 13.5),
          );
        const forecast = forecastAt(sampleVolatility, day, window);
        reading!.textContent = `Day ${day + 1}: observed ${sampleVolatility[day].toFixed(2)}% · forecast ${forecast.toFixed(2)}% · QLIKE ${qlike(sampleVolatility[day], forecast).toFixed(3)}. Forecast uses observations through day ${day}.`;
        const table = el.querySelector("[data-table]")!;
        table.replaceChildren();
        for (let d = day - 2; d <= day; d++) {
          const f = forecastAt(sampleVolatility, d, window);
          const tr = document.createElement("tr");
          for (const value of [
            d + 1,
            sampleVolatility[d].toFixed(2) + "%",
            f.toFixed(2) + "%",
            qlike(sampleVolatility[d], f).toFixed(3),
          ]) {
            const td = document.createElement("td");
            td.textContent = String(value);
            tr.append(td);
          }
          table.append(tr);
        }
      };
      input("day").addEventListener("input", render);
      input("window").addEventListener("change", render);
      render();
    }
    if (el.dataset.demo === "factors") {
      const render = () => {
        const alpha = Number(input("alpha").value),
          method = input("method").value,
          selected = selectedHypotheses(samplePValues, alpha / 100, method);
        el.querySelector("[data-alpha]")!.textContent = alpha + "%";
        el.querySelectorAll<HTMLElement>("[data-factor]").forEach((card, i) => {
          const pass = selected.includes(i);
          card.dataset.pass = String(pass);
          card.querySelector("[data-verdict]")!.textContent = pass
            ? "Pass"
            : "Hold";
        });
        reading!.textContent = `${selected.length} of 8 pass at ${alpha}% with ${method === "bh" ? "Benjamini–Hochberg correction" : "an unadjusted threshold"}.`;
      };
      input("alpha").addEventListener("input", render);
      input("method").addEventListener("change", render);
      render();
    }
  });
}
