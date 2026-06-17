# Personal site

A static personal website built for GitHub Pages with Jekyll. Hosting is free and no database is required.

## Customize it

1. Replace `Your Name` in `_config.yml` and `index.html`.
2. Replace the GitHub and email links in `_includes/footer.html`.
3. Edit the introduction on `index.html`.
4. Delete or rewrite the example content.

## Add a project

Copy `_projects/example-project.md`, give it a new filename, and edit the fields at the top. Add an optional image to `assets/images/projects/` and set its path in `image`.

## Add a photograph

1. Put the optimized image in `assets/images/photos/` (JPEG or WebP recommended).
2. Copy `_photos/example-photo.md` and give it a new filename.
3. Change `image` to the uploaded image path and fill in whichever metadata fields you want. Delete fields you do not need.

For fast pages, export photos at roughly 2000 to 2500 pixels on the long edge and aim for less than 1 MB each. GitHub's web interface can upload both the image and metadata file if you do not want to use Git locally.

## Add a diary entry

Copy `_posts/2026-06-01-a-first-note.md`. The filename must start with the date in `YYYY-MM-DD-` format. Write the entry beneath the second `---` using Markdown.

## Preview locally

Local previews require a current Ruby installation and the standard command-line developer tools. GitHub itself handles these dependencies when it publishes the site.

```sh
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000`.

## Publish on GitHub Pages

1. Create a GitHub repository named `YOUR-USERNAME.github.io`.
2. Push the contents of this folder to its `main` branch.
3. In the repository, open **Settings > Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, then choose `main` and `/ (root)`.

The site will appear at `https://YOUR-USERNAME.github.io` after GitHub finishes its first build.
