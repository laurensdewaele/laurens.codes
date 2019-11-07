## Invariants

A set of assertions that must always hold true during the life of an object for the program to ve valid.

## Minimize the visibility scope of constants

`As a general rule, when you have a lot of constants, wrap them in a class`

## Class with only static methods and fields 

=> Use a private constructor instead of an abstract class
With an abstract class, you can still extend the class and objects can be created.

## Var and dynamic

`Always avoid "var". Use "dynamic" if you are being explicit that the type is unknown, but prefer "Object" and casting, as using dynamic disables all static checking.`

## Begin global constants with prefix 'K'

## TypeDefs and function variables

```
FooCallback
onFoo
handleFoo
```
## Avoid doubler negatives in APIs

Use 'enabled' instead of 'disabled'.
That way you wont have code such as `input.disabled = false`, which is very confusing.

## Constructors come first in a class

## Canonical 

Conforming to well established rules

## Const constructor

This creates a canonicalized instance.
`The point is to create compile-time constant values: Objects where the all field values are known already at compile time, without executing any statements.
That puts some restrictions on the class and constructor. A const constructor can't have a body and its class must not have any non-final fields
`

```Dart
class Point { 
  static final Point ORIGIN = const Point(0, 0); 
  final int x; 
  final int y; 
  const Point(this.x, this.y);
  Point.clone(Point other): x = other.x, y = other.y; //[2] 
}

main() { 
  // Assign compile-time constant to p0. 
  Point p0 = Point.ORIGIN; 
  // Create new point using const constructor. 
  Point p1 = new Point(0, 0); 
  // Create new point using non-const constructor.
  Point p2 = new Point.clone(p0); 
  // Assign (the same) compile-time constant to p3. 
  Point p3 = const Point(0, 0); 
  print(identical(p0, p1)); // false 
  print(identical(p0, p2)); // false 
  print(identical(p0, p3)); // true! 
}
```

`no matter how many times you write "const Point(0,0)", you only create one object`

## Implicit interfaces



