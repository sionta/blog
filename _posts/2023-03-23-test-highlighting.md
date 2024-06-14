---
layout: post
title: Test Highlighting
categories: test
---
<!-- markdownlint-disable -->

This is use unknown language:

```unknown
{
  "thisSyntax": error
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

This is <code>```plain</code>

```
{
  "thisSyntax": error
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

This is use triple backticks <code>```css</code>:

```css
/* This is a single-line comment */

h1 {
    color: blue;
    text-decoration: underline;
}
```

{% raw %}This is use `{% highlight css linenos %}`:{% endraw %}

{% highlight css linenos %}
/* This is a single-line comment */

body {
    font-family: Arial, sans-serif;
    color: #333;
}

{% endhighlight %}
