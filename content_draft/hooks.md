# Cementing knowledge of React Hooks

12 August 2019

![react logo](images/react.svg)

## Written down notes

  * useEffect runs after every render
  * Only call hooks from top level (not from within loops, etc.). 
  * **Watch out** once a hook gets triggered, the functional component re-renders (also it's children).
  * useEffect gets triggered after render and after the DOM render (after the paint phase).
  * componentDidMount and componentDidUpdate actually blocks the browser from updating the screen
  * useLayoutEffect => use this if you want synchronous effects (before the DOM paint phase).
  * effects run after every render and not just once. React also cleans up every effect!
  * Every time you use a custom hook, all state. and effect inside the hook are fully isolated
  * ** Mutations, subscriptions, timers, logging and all other side effects are NOT allowed inside the main body of a function component **
  * useRef: helpful for keeping any mutable value around.
  * useRef: mutating it does NOT cause a re-render.
  * do not reference functions inside a useEffect, that are declared outside a useEffect. This makes it easy to introduce bugs, because they could reference state or props that has not been defined in the depencies of that useEffect.
  * React.Memo is the equivalent to React.PureComponent. **write your code so that it works without useMemo, only after that add it**. Because React could change stuff in the future, also for decoupling (orthogonality).
  * Lazily intialize a ref. 
  * useState(() => {}), this way it is only called once during the first render, otherwise if you have a calculation, it can be run every render.
  * **Avoid passing callback deep down!**
  * Prevent setting state fro unmounted components! **as with async api calls eg**

## Coming back to React after a while

At work, I did an Angular project for about 4 months. To find out how that was, check my previous blog post.
I left the React world back in February, just when hooks were new. When returning to React, I thought i knew them.
Oh boy was I wrong.

I was toying around with a location service and had something like this:
```
const location = useLocation();
```

I put a console.log in my function component and the thing triggered multiple times.
I had no idea what was going on. I blamed it on the npm package with 'not that many stars' and picked another one.

After that i encountered some `exceeded call stack` errors. I figured it was time to study React hooks again.

Lessons learned in a nutshell:

  * Hooks trigger a re-render! When state changes, the whole body of the function component gets run and rendered again. Never thought about it, but makes sense. Since there is no `render()` method in a function component, the whole code gets run, and not only the `return <JSX>`
  * useEffect gets triggered after a render and **after a DOM update** (after paint phase). React also cleans up every useEffect after render!
  * `componentDidMount` or `componentDidUpdate` blocks the browser from updating the screen! Unlike useEffect. If you want synchronous effects, use `useLayoutEffect`
  * Every time you use a custom hook, all state and effects inside of it are fully isolated! **Two components using the same hook, do not share the same state**
  * Mutations, subscriptions, timers, logging **and all other side effects** are NOT allowed inside the main body of a function component.
  * `useRef` is useful for keeping any mutable value around. Similar to how you'd use instance fields in classes. Mutating useRef does NOT cause a re-render.
  * Do not reference functions declared outside a useEffect hook. This makes it easy to introduce bugs. I could reference state or props that has not been defined in the depencies of that useEffect.
  * `React.Memo` is the equivalent to `React.PureComponent`. **write your code so that it works without useMemo**, only after that add it. Because React could change stuff in the future, also for orthogonality.
  * `useState(() => {})`, this way the initial state is only called once during the first render. This is meant for `useState(someHeavyCalculationThatReturnsMyInitialState())`
  * use `useReducer` without Redux. For state calculations with e.g. API calls.
  * Avoid passing callbacks deep down!
  * Avoid setting state on unmounted components. This can happen with e.g. API calls inside a `useEffect`

## Sources

Everything in the offical docs ❤️. [https://reactjs.org/docs/hooks-intro.html](https://reactjs.org/docs/hooks-intro.html)
Api call useEffect snippet. [https://codesandbox.io/s/jvvkoo8pq3](https://codesandbox.io/s/jvvkoo8pq3)
Data fechting blog post on hooks by Robin Wieruch. [https://www.robinwieruch.de/react-hooks-fetch-data/](https://www.robinwieruch.de/react-hooks-fetch-data/)





