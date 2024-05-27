---
title: Advanced Code Samples
categories: test
---

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

### CSS

```css
/* This is a single-line comment */

body {
    font-family: Arial, sans-serif;
    color: #333;
}

h1 {
    color: blue;
    text-decoration: underline;
}
```

### SCSS

```scss
// This is a single-line comment

$font-family: Arial, sans-serif;
$font-weight: 400;
$font-size: 16px;
$line-height: 1.5;
$text-color: #121212;

body {
    font: $font-weight #{$font-size}/#{$line-height} $font-family;
    font-family: Arial, sans-serif;
    color: $text-color;

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

### JSON

```json
{
    "example": error syntax,
    "name": "John",
    "age": 30,
    "city": "New York",
    "hobbies": ["reading", "coding", "hiking"]
}
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
