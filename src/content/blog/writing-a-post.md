---
title: "How I write posts here"
description: "A quick reference for the Markdown frontmatter this blog uses."
date: 2026-07-22
tags: ["meta", "notes"]
draft: false
---

Each post is a Markdown file in `src/content/blog/`. The bit at the top between
the `---` lines is called *frontmatter* and controls the post's metadata:

```yaml
---
title: "My post title"
description: "One-line summary shown in the list and for SEO."
date: 2026-07-22
tags: ["tag-one", "tag-two"]
draft: false   # set true to hide from the site while you work on it
---
```

Everything below the frontmatter is regular Markdown: **bold**, *italics*,
[links](https://example.com), lists, `code`, and images.

Set `draft: true` to keep a post out of the build until it's ready.
