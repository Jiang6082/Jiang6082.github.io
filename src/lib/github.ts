import { GITHUB } from "../config";

export interface Repo {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  updated: string; // ISO date
  topics: string[];
}

/** GitHub Linguist colors for common languages (extend as needed). */
export const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Astro: "#ff5a03",
  "Jupyter Notebook": "#DA5B0B",
  R: "#198CE7",
  Scala: "#c22d40",
  "Objective-C": "#438eff",
  MATLAB: "#e16737",
  Lua: "#000080",
  Haskell: "#5e5086",
  Elixir: "#6e4a7e",
};

export function langColor(lang: string | null | undefined): string {
  if (!lang) return "#9ca3af";
  return LANG_COLORS[lang] ?? "#9ca3af";
}

interface GitHubApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  topics?: string[];
}

/**
 * Fetch and curate the user's public repos at build time.
 * Never throws — on any failure (rate limit, offline) it returns [] so the
 * build still succeeds; the page shows a friendly fallback.
 */
export async function getRepos(): Promise<Repo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "astro-personal-site",
  };
  // Use a token if the build environment provides one (higher rate limit).
  const token =
    (typeof process !== "undefined" && process.env?.GITHUB_TOKEN) || undefined;
  if (token) headers.Authorization = `Bearer ${token}`;

  let raw: GitHubApiRepo[] = [];
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB.username}/repos?per_page=100&sort=updated`,
      { headers }
    );
    if (!res.ok) {
      console.warn(`[github] repos fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }
    raw = (await res.json()) as GitHubApiRepo[];
  } catch (err) {
    console.warn("[github] repos fetch error:", err);
    return [];
  }

  const exclude = new Set(GITHUB.exclude.map((n) => n.toLowerCase()));
  let repos: Repo[] = raw
    .filter((r) => !r.fork && !r.archived && !exclude.has(r.name.toLowerCase()))
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      homepage: r.homepage && r.homepage.trim() ? r.homepage : null,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      updated: r.pushed_at,
      topics: r.topics ?? [],
    }));

  if (GITHUB.featured.length > 0) {
    const order = new Map(GITHUB.featured.map((n, i) => [n.toLowerCase(), i]));
    repos = repos
      .filter((r) => order.has(r.name.toLowerCase()))
      .sort((a, b) => order.get(a.name.toLowerCase())! - order.get(b.name.toLowerCase())!);
  } else {
    repos.sort(
      (a, b) =>
        b.stars - a.stars ||
        new Date(b.updated).valueOf() - new Date(a.updated).valueOf()
    );
    repos = repos.slice(0, GITHUB.limit);
  }

  return repos;
}

/** Aggregate primary-language counts for the language distribution bar. */
export function languageBreakdown(repos: Repo[]): { lang: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const r of repos) {
    const l = r.language ?? "Other";
    counts.set(l, (counts.get(l) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([lang, count]) => ({ lang, count }))
    .sort((a, b) => b.count - a.count);
}
