---
title: Getting Started with GitHub Pages
date: 2026-03-05 14:00:00 +0000
categories: [Technology, Web]
tags: [github-pages, jekyll, blogging]
---

# Getting Started with GitHub Pages

If you're reading this, you're looking at a blog powered by **GitHub Pages** — a free hosting service provided by GitHub that lets you publish websites directly from a Git repository.

## What Is GitHub Pages?

GitHub Pages is a static site hosting service that takes files straight from a repository on GitHub, optionally runs them through a build process, and publishes a website. It's:

- **Free** — No hosting fees
- **Easy to set up** — Just push to a repo and your site is live
- **Customizable** — Use any Jekyll theme or build your own HTML/CSS

## The Jekyll + Chirpy Stack

This blog uses [Jekyll](https://jekyllrb.com/) — a static site generator — with the beautiful [Chirpy theme](https://github.com/cotes2020/jekyll-theme-chirpy). Together, they provide:

- Clean, responsive design
- Dark/light mode
- Categories, tags, and archives
- Search functionality
- Table of contents for long posts

## How to Write a New Post

Creating a new blog post is as simple as adding a Markdown file to the `_posts` folder with the naming convention:

```
YYYY-MM-DD-your-post-title.md
```

Each post starts with **front matter** — a YAML block that defines metadata:

```yaml
---
title: My Post Title
date: 2026-03-05 12:00:00 +0000
categories: [Category]
tags: [tag1, tag2]
---
```

Then you just write your content in Markdown below that block.

## Wrapping Up

GitHub Pages with Jekyll is a fantastic way to build a personal blog or portfolio. It's free, open-source, and gives you full control over your content.

Happy blogging! ✍️
