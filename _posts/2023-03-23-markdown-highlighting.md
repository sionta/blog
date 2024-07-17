---
layout: post
title: Syntax Highlighter
categories: test
tags: [rouge, highlight]
image: "/assets/img/rouge.png"
toc: true
---

[Rouge][rouge] is a pure Ruby syntax highlighter. It can highlight
[over 200 different languages][languages-doc], and output HTML
or ANSI 256-color text. Its HTML output is compatible with
stylesheets designed for [Pygments][pygments].

This is code block language unrecognized by [Rouge][rouge]:

```unknown
{
  "thisSyntax": error
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

This is code block without syntax highlighting or `plaintext` (default):

```plaintext
{
  "thisSyntax": error
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

This is code block with syntax highlighting use triple backticks:

```json
{
  "thisSyntax": error
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

By default "lineos" is enable, to disable it add `{:.no_lineno}` after end triple backticks.

<!-- markdownlint-disable -->
````markdown
```json
{
  "thisSyntax": error
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```
{:.no_lineno} <!-- like this -->
````
{:.no_lineno}

{% raw %}This is code block with syntax highlighting use liquid `{% highlight %}` tag in markdown:{% endraw %}

{% raw %}
```liquid
{% highlight ruby linenos mark_lines="1 2" %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}
```
{% endraw %}

Output like this:

{% highlight ruby linenos mark_lines="1 2" %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}
<!-- markdownlint-restore -->

## Mores

### Diff

```diff
function addTwoNumbers (num1, num2) {
-  return 1 + 2
+  return num1 + num2
}
```

### YAML

```yaml
kramdown:
  input: GFM

# Generate social links.
social_links:
  - { title: GitHub, url: "https://github.com/sionta" }
  - { title: Twitter, url: "https://twitter.com/r007mmxv" }
```
{: mark_lines='2'}

### TOML

```toml
[social_links]
  name = "Andre Attamimi"
  github = "https://github.com/sionta"

[menu]
[[menu.header]]
identifier = "about"
name = "About"
url = "/about/"
```

### HTML

```html
<!-- This is a single-line comment -->

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <div id="app"></div>

        <script>
            document.getElementById("app").innerHTML = "<h1>Hello, World!</h1>";
        </script>
    </body>
</html>
```

### SCSS

```scss
// This is a single-line comment

$font-family: "Lato", Arial, sans-serif;
$font-weight: 400;
$font-size: 16px;
$line-height: 1.5;
$text-color: #121212;
$background-color: #f1f1f1;

body {
    font: $font-weight #{$font-size}/#{$line-height} $font-family;
    color: $text-color;
    background-color: $background-color;

    h1 {
        font-size: calc($font-size * $line-height);
    }
}
```

### JavaScript

```javascript
// This is a single-line comment

class Person {
    constructor(name) {
        this.name = name;
    }

    greet() {
        console.log(`Hello, ${this.name}!`);
    }
}

const person = new Person("John");
person.greet();
```

### Bash

```bash
#!/bin/bash
# This is a single-line comment

echo "Hello, World!"

# Print current date and time
date
```

### PHP

```php
<?php
// This is a single-line comment

class Person {
    private $name;

    public function __construct($name) {
        $this->name = $name;
    }

    public function greet() {
        echo "Hello, {$this->name}!";
    }
}

$person = new Person('John');
$person->greet();
?>
```

### Ruby

```ruby
# This is a single-line comment

=begin
This is a multi-line comment
that spans multiple lines
=end

class Person
  attr_reader :name

  def initialize(name)
    @name = name
  end

  def greet
    puts "Hello, #{@name}!"
  end
end

person = Person.new('John')
person.greet
```

### Python

```python
# This is a single-line comment

"""
This is a multi-line comment
that spans multiple lines
"""

class Person:
    def __init__(self, name):
        self.name = name

    def greet(self):
        print(f"Hello, {self.name}!")

person = Person('John')
person.greet()
```

[rouge]: http://rouge.jneen.net/ "Rouge"
[languages-doc]: https://rouge-ruby.github.io/docs/file.Languages.html "Languages"
[pygments]: http://pygments.org "Pygments"
