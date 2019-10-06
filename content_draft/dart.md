Dart is a full-on object oriented language, with classes and mixin-based inheritance. Every objects is an instance of a class, and all classes descend from `Object`.

Dart is single threaded. Everything runs on what's called in isolate. An isolate has it's own memory.
Multiple isolates can be spawned. State / memory from one isolate is inaccessible by the other.
Communication between isolates is done by messages.

## Expressions and statements

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
however, it can be a static const.

class {
static const yadada...
}

The const keywords isn't just for declaring variables

```Dart
var foo = const [];
final bar = const [];
const baz = []; // Equivalent to `const []`
```

**DON’T use const redundantly.**

## Runes

For expressing unicode chars in a string.

## String

String expression

`Some string with a ${value}`

## Lists

In Dart, arrays are List objects, so most people just call them lists.

```Dart
var list = [1, 2, 3];
```

In this example, Dart infers the type, that it has type List<int>

## Sets

A set in Dart is an unordered collection of unique items.

```Dart
var halogens = {'fluorine', 'chlorine', 'bromine', 'iodine', 'astatine'};
```

In this case, Dart infers the type as well. Set<String>.

Set or map? The syntax for map literals is similar to that for set literals. Because map literals came first, {} defaults to the Map type. If you forget the type annotation on {} or the variable it’s assigned to, then Dart creates an object of type Map<dynamic, dynamic>.

## Maps

Maps are collections that have key and value pairs. The key as well as the value can be of any type.
Map<String, String>

## Symbols

Refers to an operator or identifier already declared. This can be useful when applying minification.

## Functions

Dart is a true object oriented language. This means that functions are objects. of class and type Function

Named,optional and positional arguments

Note: Some APIs — notably Flutter widget constructors — use only named parameters, even for parameters that are mandatory. See the next section for details.

```Dart
void enableFlags({bool bold, @required bool hidden = true}) {...}
```

## Main function

The main() function
Every app must have a top-level main() function, which serves as the entry point of the app. The main() function returns void and has an optional List<String> parameter for arguments.

## Args package

Parses raw command line arguments into a set of options and values

## Closures

A closure is a function that has access to the variables in it's lexical scope. Even when the function is called outside of it's original scope.

## Return values

If no return value is specified for a function, null gets silently added and returned

## operators

if null `??`
cascade `..`

### Type test operators

`as` typecast
`is` true if the object has the specified type
`is!` false if the object has the specified type

### Assignment operators

`b ??= value;` assign only when b is null

### Conditional expressions

`expr1 ?? expr2`
Return expr1 if not null, otherwise expr2

### Cascades

```Dart
querySelector('#confirm') // Get an object.
  ..text = 'Confirm' // Use its members.
  ..classes.add('important')
  ..onClick.listen((e) => window.alert('Confirmed!'));
```

### Other

`?.` conditional member access
Use `?.` instead of `.` to avoid an exception when the leftmost operand is null:

## Breaks and continue

Use break to jump out of a loop
Use continue to go to the next loop iteration.

## Asserts

Only useful during development, are ignored in production code.
Flutter => only in debug mode.

## Exceptions

Throw class `Error` or `Exception`

```Dart
try {
  breedMoreLlamas();
} on OutOfLlamasException {
  // A specific exception
  buyMoreLlamas();
} on Exception catch (e) {
  // Anything else that is an exception
  print('Unknown exception: $e');
} catch (e, s) {
  // No specified type, handles all
  print('Something really unknown: $e');
}
```

You can specify what to do on specific exceptions.
Second argument to `catch(e, s)` is the stack trace.
You can also partially handle an exception, using `rethrow`.
You can use `finally` to always run a piece of code, whether or not an exception was thrown.

```Dart
try {
  breedMoreLlamas();
} finally {
  // Always clean up, even if an exception is thrown.
  cleanLlamaStalls();
}
```

## Constructors

Naming: `ClassName`

### Constant constructors

You can put const before the constructor name to create a compile time constant.
`var p = const ImmutablePoint(2, 2);`

```Dart
var a = const ImmutablePoint(1, 1); // Creates a constant
var b = ImmutablePoint(1, 1); // Does NOT create a constant

assert(!identical(a, b)); // NOT the same instance!
```

## Runtime type

You can get an object's type at runtime by calling `.runTimeType`

## Instance variables

All instance variables generate an implicit getter method. Non-final instance variables also generate an implicit setter method.

If you initialize an instance variable where it is declared (instead of in a constructor or method), the value is set when the instance is created, which is before the constructor and its initializer list execute.

## Setting Constructors

```Dart
class Point {
  num x, y;

  // Syntactic sugar for setting x and y
  // before the constructor body runs.
  Point(this.x, this.y);
}
```

If you don’t declare a constructor, a default constructor is provided for you. The default constructor has no arguments and invokes the no-argument constructor in the superclass.

**Constructors aren’t inherited**

## Named constructors

You can implement multiple constructors

```Dart
class Point {
  num x, y;

  Point(this.x, this.y);

  // Named constructor
  Point.origin() {
    x = 0;
    y = 0;
  }
}
```

### Initialization

1. initializer list
2. superclass’s no-arg constructor
3. main class’s no-arg constructor

### Calling a parent's / superclass constructor

```
class Rectangle extends Point {
	Rectangle(): super.origin()
}
```

**Warning: Arguments to the superclass constructor do not have access to this. For example, arguments can call static methods but not instance methods.**

### Initializer list

```Dart
// Initializer list sets instance variables before
// the constructor body runs.
Point.fromJson(Map<String, num> json)
    : x = json['x'],
      y = json['y'] {
  print('In Point.fromJson(): ($x, $y)');
}
```

**The right-hand side of an initializer does not have access to this.**

**Initializer lists are handy when setting up final fields**

```Dart
class Point {
  final num x;
  final num y;
  final num distanceFromOrigin;

  Point(x, y)
      : x = x,
        y = y,
        distanceFromOrigin = sqrt(x * x + y * y);
}
```

### Redirecting constructors

```Dart
class Point {
  num x, y;

  // The main constructor for this class.
  Point(this.x, this.y);

  // Delegates to the main constructor.
  Point.alongXAxis(num x) : this(x, 0);
}
```

### Constant constructors

If you class produces objects that never change, consider making these objects compile time constants.
To do this, define a const constructor and make sure that all instance variables are final.

```Dart
class ImmutablePoint{
	static final ImmatablePoint origin = const ImmutablePoint(0,0);
	final num x;
	final num y;
	const ImmutablePoint(this.x, this.y);
}
```

### Factory constructors

Use the `factory` keywords in front of a constructor in order to, e.g., return an instance from cache, or to return an instance of a subtype.

## Methods

### Getters / setters

With getters and setters, you can start with instance variables, later wrapping them with methods, all without changing client code / API.

Operators such as increment (++) work in the expected way, whether or not a getter is explicitly defined. To avoid any unexpected side effects, the operator calls the getter exactly once, saving its value in a temporary variable.

### Abstract methods

Abstract methods can only live in abstract classes.

To make a method abstract, use a semicolon instead of providing a body.

```Dart
abstract class Doer {
  // Define instance variables and methods...

  void doSomething(); // Define an abstract method.
}

class EffectiveDoer extends Doer {
  void doSomething() {
    // Provide an implementation, so the method is not abstract here...
  }
}
```

## Abstract classes

It's a class that can't be instantiated. Abstract classes are useful for defining interfaces, ofter with some implementation. If you want you abstract class to appear instantiable, define a factory constructor.

## Implicit interfaces

Every class implicitly defines an interface containing all the instance members.
If you want to create a class B that has the same API as class A, but without it's implementation, `implement` it's interface.

```Dart
// A person. The implicit interface contains greet().
class Person {
  // In the interface, but visible only in this library.
  final _name;

  // Not in the interface, since this is a constructor.
  Person(this._name);

  // In the interface.
  String greet(String who) => 'Hello, $who. I am $_name.';
}

// An implementation of the Person interface.
class Impostor implements Person {
  get _name => '';

  String greet(String who) => 'Hi $who. Do you know who I am?';
}

String greetBob(Person person) => person.greet('Bob');

void main() {
  print(greetBob(Person('Kathy')));
  print(greetBob(Impostor()));
}
```

## Extending a class

Use `extends` to create a subclass, and `super` to refer to the subclass.

### Overriding members

You can use `@override` to explicitly denote that you want to override a parent's member.

```Dart
class SmartTelevision extends Television {
  @override
  void turnOn() {...}
  // ···
}
```

## Overriding operators

You can override operators. This is useful, e.g., when defining a Vector class.

```Dart
class Vector {
  final int x, y;

  Vector(this.x, this.y);

  Vector operator +(Vector v) => Vector(x + v.x, y + v.y);
  Vector operator -(Vector v) => Vector(x - v.x, y - v.y);

  // Operator == and hashCode not shown. For details, see note below.
  // ···
}
```

**If you override ==, you should also override Object’s hashCode getter**

## Enums

```Dart
enum Color { red, green, blue }

assert(Color.red.index == 0);
assert(Color.green.index == 1);
assert(Color.blue.index == 2);

List<Color> colors = Color.values;
assert(colors[2] == Color.blue);

var aColor = Color.blue;

switch (aColor) {
  case Color.red:
    print('Red as roses!');
    break;
  case Color.green:
    print('Green as grass!');
    break;
  default: // Without this, you see a WARNING.
    print(aColor); // 'Color.blue'
}
```

## Mixins

Mixins are a way of reusing a class's code in multiple class hierarchies.
To use a mixin, use the `with` keyword.

```Dart
mixin Musical {
  bool canPlayPiano = false;
  bool canCompose = false;
  bool canConduct = false;

  void entertainMe() {
    if (canPlayPiano) {
      print('Playing piano');
    } else if (canConduct) {
      print('Waving hands');
    } else {
      print('Humming to self');
    }
  }
}

class Maestro extends Person
    with Musical, Aggressive, Demented {
  Maestro(String maestroName) {
    name = maestroName;
    canConduct = true;
  }
}
```

To specify that only certain types can use the mixin, use the `on` keyword. `mixin MusicalPerformer on Musician`

## Static class variables

Static variables are useful for class wide state and constants.
Static variables aren't initialized until they're used.

## Static methods

Static methods do not operate on an instance, thus do not have access to `this`.

**Consider using top-level functions, instead of static methods, for common or widely used utilities and functionality.**

## Generics

E, T, S, K, and V.

Why?

- Type safety
- Better generated code
- Reduce code duplication

```Dart
var names = List<String>();
names.addAll(['Seth', 'Kathy', 'Lars']);
names.add(42); // Error
```

### Code duplication

Create an interface for caching an object

```Dart
abstract class ObjectCache {
	Object getByKey(String key);
	void setByKey(String key, Object value);
}
```

If you want a string specific version:

```Dart
abstract class StringCache {
	String getByKey(String key);
	void setByKey(String key, String value);
}
```

**Generic types can save you the trouble.**

```Dart
abstract class Cache<T> {
	T getByKey(String key);
	void setByKey(String key, T value);
}
```

## Collection literals

## Types

Dart types are reified, which means that objects keep their types available at runtime.

```Dart
var names = List<String>();
names.addAll(['Seth', 'Kathy', 'Lars']);
print(names is List<String>); // true
```

## Libraries and visibility

Every Dart app is a library, even if it doesn’t use a library directive.

## Asynchronous

`Future` or `Stream` objects.

```Dart
await lookUpVersion();
Future checkVersion() async {
  var version = await lookUpVersion();
  // Do something with version
}
```

Although an async function might perform time-consuming operations, it doesn’t wait for those operations. Instead, the async function executes only until it encounters its first await expression (details). Then it returns a Future object, resuming execution only after the await expression completes.

Use try, catch and finally together with async/await

### Streams

```Dart
await for (varOrType identifier in expression) {
  // Executes each time the stream emits a value.
}
```

Seems weird. Wouldn't use this too much. Rather use RxDart.

## Generators

When you need to lazily produce a sequence of values.

## Isolates

Instead of threads, which use shared memory, Dart code runs in isolates. Each isolate has it's own memory heap. Insuring that no isolate's state is accessible by the other isolate.

The map canvas thing could be it's own isolate?

Dart runs on a single thread, in an isolate.
It's also event based. It handles all these events, user input, file io, etc... Without it blocking, how does it work?

It works with event queues, it grabs the oldest one and processes it, then the next one, etc...

## Typedefs

```Dart
typedef Compare = int Function(Object a, Object b);

class SortedCollection {
  Compare compare;

  SortedCollection(this.compare);
}

// Initial, broken implementation.
int sort(Object a, Object b) => 0;

void main() {
  SortedCollection coll = SortedCollection(sort);
  assert(coll.compare is Function);
  assert(coll.compare is Compare);
}
```

Currently, typedefs are restricted to function types. We expect this to change.

## Documentation comments

`///` or `/**`
