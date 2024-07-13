---
# only this file requires front matter and acts as a bridge to fetch liquid environment variables
---

"use strict";

const siteComments = {{ site.comments | jsonify }};
const providerName = siteComments.provider;
const providerData = siteComments[providerName];

const commentThemes = {
  giscus: {
    dark: "dark_dimmed",
    light: "light",
  },
  utterances: {
    dark: "github-dark",
    light: "github-light",
  },
};

let currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
let commentTheme = commentThemes[providerName][currentTheme];
let commentAttributes = {};

if (providerName === 'disqus') {
  let pageUrl = document.querySelector('.post-content').getAttribute('itemid');
  commentAttributes = {
    "src": "https://" + providerData?.shortname + ".disqus.com/embed.js",
    "data-timestamp": +new Date(),
    "page.url": pageUrl,
    "page.identifier": pageUrl,
  };
} else if (providerName === 'giscus') {
  commentAttributes = {
    "src": "https://giscus.app/client.js",
    "data-repo": providerData?.repo,
    "data-repo-id": providerData?.repo_id,
    "data-category": providerData?.category,
    "data-category-id": providerData?.category_id,
    "data-mapping": providerData?.mapping || "pathname",
    "data-strict": providerData?.strict || 0,
    "data-reactions-enabled": providerData?.reactions_enabled || 1,
    "data-emit-metadata": providerData?.metadata || 0,
    "data-theme": commentTheme,
    "data-lang": providerData?.lang || "en",
    "data-loading": "lazy",
    "crossorigin": "anonymous",
    "async": true,
  };
} else if (providerName === 'utterances') {
  commentAttributes = {
    "src": "https://utteranc.es/client.js",
    "repo": providerData?.repo,
    "issue-term": providerData?.issue_term || "pathname",
    "theme": commentTheme,
    "crossorigin": "anonymous",
    "async": true,
  };
} else {
  commentAttributes = undefined;
}

export { commentThemes, commentAttributes };
