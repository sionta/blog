---
# the default layout is `page`
title: About
order: 1
# icon: info-circle
---

`{{ page.path | split: '/' | first }}` is a ✨ _special_ ✨ directory because it appears in the header navigation. For example, Front Matter header pages can be seen below:

### Internal link

<!-- markdownlint-disable -->
{% raw %}
```yaml
---
# _pages/blog.html
title: Blog   # default name is '/:title/'
layout: home  # default layout is `page`.
disable: true # default is false.
order: 2      # sorted by number.
icon: book-2  # icon name by tabler `https://tabler.io/` and with style `outline`.
---
{{ content }}
```
{% endraw %}
<!-- markdownlint-restore -->

### External link

```yaml
---
# _pages/github.md
redirect_to: https://github.com/sionta/
order: 3
#icon: brand-github
---

```

---

## Hi there 👋

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...

## Projects

### Dracula for MiXplorer

[![Dracula MiXplorer](https://github-readme-stats.vercel.app/api/pin/?username=dracula&repo=mixplorer&theme=dracula&hide_border=false&show_owner=true)](https://github.com/dracula/mixplorer)

### My GitHub Stats

[![GitHub Stats](https://github-readme-stats.vercel.app/api?username=sionta&theme=solarized-dark&hide_title=true&locale=en&include_all_commits=true)](https://github.com/sionta)
{: width="400" }
