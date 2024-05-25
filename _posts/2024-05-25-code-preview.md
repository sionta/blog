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
$secondary-color: #007bff;

nav {
  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: inline-block;
      &.current {
        font-weight: bold;
        a {
            color: red;
        }
      }
      a {
        text-decoration: none;
        padding: 0.5rem 1rem;
        color: $primary-color;
        transition: color 0.3s ease;

        &:hover {
          color: $secondary-color;
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
