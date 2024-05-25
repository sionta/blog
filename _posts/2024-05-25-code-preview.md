---
title: Code Preview
tags: [jekyll]
author: Andre Attamimi
---

## CSS

```css
/* Example CSS */
.container {
  width: 80%;
  margin: 0 auto;
}

```

## SCSS

```scss
// Example SCSS
$primary-color: #6c757d;

%clear-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
nav {
  ul {
    @extend %clear-list;
    li {
      display: inline-block;
      &.current {
        font-weight: bold;
        a {
          color: $primary-color;
        }
      }
    }
  }
}

```

## HTML

```html
<!-- Example HTML -->
<div class="container">
  <h1>Hello, world!</h1>
  <p>This is a sample HTML document.</p>
</div>

```

## JAVASCRIPT

```javascript
// Example JavaScript
function greet(name) {
  console.log('Hello, ' + name + '!');
}

greet('John');

```

## RUBY

```ruby
# Example Ruby
def greet(name)
  puts 'Hello, ' + name + '!'
end

greet('John')
#=> prints 'Hello, John!' to STDOUT.

```
