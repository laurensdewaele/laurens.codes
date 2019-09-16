# First time learning flutter and dart

Things i noticed:

Fuck this nesting, brackets everywhere, jsx is a bit easier to read and write imo.
Fuck you really have to type semicolons;

Omg the tooling platform is soo good, the debugging experience and devtools

final vs const?

`final`: Single assigment;
`const`:

> const means that the object's entire deep state can be determined entirely at compile time and that the object will be frozen and completely immutable.
> They must be created from data that can be calculated at compile time. A const object does not have access to anything you would need to calculate at runtime. 1 + 2 is a valid const expression, but new DateTime.now() is not.
> They are deeply, transitively immutable. If you have a final field containing a collection, that collection can still be mutable. If you have a const collection, everything in it must also be const, recursively.

constructor is naming the class itself
`class Test extends StatelessWidget { Test({ testId: int }); }`

You do not have to call the new keyword anymore.

It's a different way of writing code compared to React.
It's hard for me. In React you write components for all the small pieces and then compose them.
It looks like in Flutter you're just nesting evrything at once, which can be hard to type because you have to start out at the top of the tree, and it's hard to wrap something on top a widget. Thankfully, you can click on the lightbulb to add a parent. ![flutter add parent](images/flutter_add_parent.svg).
It's like your writing EVRYTHING in the render method of react, styling, defining components. Hmm

It's weird that, when they also want to target the web, they don't use the existing css syntax. Blurgh fuck learning new APIs all the time eh

Mixins
https://medium.com/flutter-community/https-medium-com-shubhamhackzz-dart-for-flutter-mixins-in-dart-f8bb10a3d341#targetText=Unless%20you%20want%20your%20mixin,from%20it%20in%20other%20way.

Animations omg complex, cleanup, controller, animation, tweeen, wtf

concurrency
single threaded, isolates

They have great comparison explanations on the website. Flutter for web developers, Flutter for React Native developers, etc...

Device-independent pixel


![Row and column axis alignemnt in flutter](./images/row_column_alignment)


Expanded widget: Auto fix size to fit in row or column, or any other layout widget;
Flex can also be used:
```dart
children: [
    Expanded(
      child: Image.asset('images/pic1.jpg'),
    ),
    Expanded(
      flex: 2,
      child: Image.asset('images/pic2.jpg'),
    ),
    Expanded(
      child: Image.asset('images/pic3.jpg'),
    ),
  ],
```

everything is an object in dart


flutter docs: 
State parent vs widget itself:
Parent: user data
Widget itself: aesthetics, e.g. animation

Aggressive composability:
E.g. Padding vs being a property


constructor initializer


C INTEROP HAHAHAHA OMG
