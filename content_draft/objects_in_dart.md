# Nesting objects (classes) in Dart

![Dart logo](./images/dart.svg)

## Javascript

In Javascript, the following is quite common:

```Javascript
const styles = {
	colors: {
		red: x,
	},
	typography: {}
}
```

So it basically nests objects or (as Miyoyo, the FlutterDev legend, pointed out to me) maps.

### Objects vs maps in Javascript

From MDN:
> Object is similar to Map in that both let you set keys to values, retrieve those values, delete keys, and detect whether something is stored at a key. Because of this (and because there were no built-in alternatives), Objects have been used as Maps historically

## Dart

I wanted to do the same thing in Dart.
There's a `styles.dart` file where I keep all my styling. 
Some examples from what's in there:

```Dart
class Colors {
  Colors._();

  static const Color primary = const Color.fromRGBO(220, 88, 88, 1);
  static const Color white = const Color.fromRGBO(255, 255, 255, 1);
}

class Spacings {
  Spacings._();

  static const double xs = 10.0;
  static const double s = 15.0;
  static const double m = 20.0;
}

const BorderRadius kAppBorderRadius = BorderRadius.all(Radius.circular(5.0));
```

### First interesting thing

I needed a class `Colors` because I don't want to have all the variables loose or write them as `colorBlack` and `colorBgGray`.
`Colors.black` is much nicer and provides a clear separation.

I don't want the class to be instantiable, so let's make it `abstract` with `static const` fields.

Then somewhere in the Flutter source code I came across a private constructor.
I wondered what the difference was.
From [stackoverflow](https://stackoverflow.com/questions/20593278/abstract-class-vs-private-constructor):

>You should go with private constructor. If your class is abstract, it can be extended and objects can be created.

### Second thing

class `Colors` already exists in Flutter and caused me some annoyances.
So you can either `import 'package:flutter/material.dart'; hide Colors` or rename your class to something else. I named it `AppColors`. For consistency reasons I prefixed `App` for every style constant/class (since everything in Dart is a class).

### Third

That quickly became tiring. Plus I did not want to have my classes (AppColors, AppTypography, kAppBorderRadius, etc) loose in that file. I wanted an encapsulation/separation/structure.
I wanted `styles.colors.black` or something.

So...

I put a class inside of a class.

```Dart
class Styles {
	Styles._();

	static const AppColors colors = AppColors();
}
```

=> AppColors needed to be instantiated so I cannot let AppColors have a private constructor.
=> I wanted `const` values, so the constructor needed to be `const` => therefor I cannot have `static` fields.

```Dart
class AppColors {
	const AppColors();

	final Color white = const Color.fromRGBO(...);
}
```

### Fourth

I was happy implementing it in my code
`Styles.colors.difficultyYellow`.

It works!

However, when the value needed to be a `const` (e.g. `const Color = Styles.colors.difficultyYellow`), I got an error.

`Error: Getter not found: 'colors'.`

That makes zero sense, so I searched around, and after a `flutter clean` the error message changed to: 

`Error: Not a constant expression`

How can it possibly not be a constant expression? `colors` is a `static const`. AppColors was instantiated via a `const` constructor. I applied `const` before creating the color (`const Color.fromRGBO`). What's going on?

My guess is that Dart can't 'see' that deep. It cannot determine if the value is actually a `const` because I nested a class inside a class.

So Dart really isn't built that way and you shouldn't nest classes.

Coming from Javascript this was super weird.

### Solution

I needed a namespace or something.
From [stackoverflow](https://stackoverflow.com/questions/13876879/how-do-you-namespace-a-dart-class):
> Dart doesn't have the concept of namespaces, but instead it has libraries.

Ok so I just do this:
```Dart
import 'package:app/styles/styles.dart' as styles;
```

And then you can finally access it via `styles.colors.black`;

This solution isn't perfect, as one can easily forget to import `as styles` (nothing forces you) and just use the expressions Colors, Typography, etc directly. Then we've lost consistency and we're back to where we started.

For me, it's the lesser evil.

Please tell me if you've found something better 😊.





