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
