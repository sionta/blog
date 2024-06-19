---
layout: post
title: Test Highlighting
categories: test
---
<!-- markdownlint-disable -->

This is code block without syntax highlighting or language unrecognized by [Rouge][rouge_languages]:

```no_highlight
{
  "thisSyntax": error
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

This is code block without syntax highlighting or use language `plaintext` (default):

```
{
  "thisSyntax": error
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

This is code block with syntax highlighting use triple backticks:

```css
body {
    font-size: 12pt;
    background: #fff url(temp.png) top left no-repeat;
}
```

{% raw %}This is code block with syntax highlighting use `{% highlight %}` tag:{% endraw %}

{% highlight ruby linenos %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.

{% endhighlight %}

[rouge_languages]: https://rouge-ruby.github.io/docs/file.Languages.html