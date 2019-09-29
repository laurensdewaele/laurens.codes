## All is an  object

Everything you can place in a variable is an object, and every object is an instance of a class.

## Expressions and statements

>Dart has both expressions (which have runtime values) and statements (which don’t). For example, the conditional expression condition ? expr1 : expr2 has a value of expr1 or expr2. Compare that to an if-else statement, which has no value. A statement often contains one or more expressions, but an expression can’t directly contain a statement.

**Expression**
Everything that you can assign a value to. 
E.g. even functions fall under this category.

**Statement**
The opposite of above.
E.g. if, else, for, while, return, ...

## Assert

Production code ignores the `assert()` call

## Const

**class instance variables cannot be const**

this is because a const variable is a compile time variable.
If a class needs to be instantiated, it's not done on compile time.
however, it can be a static const

class {
	static const yadada...
}

The const keywords isn't just for declaring variables

```
var foo = const [];
final bar = const [];
const baz = []; // Equivalent to `const []`
```

**DON’T use const redundantly.**



