# Regular expressions

![regex icon](./images/regex.svg)

## Why

I had put off learning regular expressions for such a long time.
Just when I started learning it, I came across a reddit post about regex on /r/javascript.

>I was avoiding regex like hell. A few years ago I had to to create ~20 complex patterns to remove abstract elements from sentences (quantities, stop words etc) because I needed to normalize them. After ~1-2 weeks of full-time regex, I think that was one of the best experiences and decisions in my career. You need to learn it the hard way by doing practice with real world examples. Trust me, you'll find your self saving countless LOCs by one-liner patterns.

This sounds exactly like me. I was splitting strings and joining arrays in Javascript, just so I didn't have to write any regex.

## The learning process

I'll start by reading [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) on regex and then try to make some exercises.

### The basics

#### Special characters

`*`: Matches the preceding expression 0 or more times.  
`+`: Matches the preceding expression 1 or more times.  
`?`: Matches the preceding expression 0 or 1 time. **If used immediately after any of the quantifiers \*, +, ?, or {}, makes the quantifier non-greedy**.
`.`: Matches any single character except the newline character, by default.


```
str = 'test.i.ng'

regex1 = /[a-z.]/	 	// 9 matches, all chars 
regex2 = /[a-z.]+/		// 1 match, the exact string
regex3 = /[a-z.]*/		// 2 matches. the string from 0-9 plus an empty character??
```

Try it yourself at [regex101](https://regex101.com/r/hifWQx/1).  
I don't really get it completely yet. Matching 'places' that are non-characters. Hmmm

`(x)`: Matches and remembers.  
`(?:x)`: Matches and doesn't remember match. Non capturing parentheses.  
`x(?=y)`: Lookahead.  
`x(?!y)`: Negative lookahead.  
`(?<=y)x`: Lookbehind.  
`(?<!y)x`: Negative lookbehind.  
`x|y`: The order matters. You can apparently match empty strings/characters.  
`[]`: Character set. Special characters like `.` are not special and do not need to be escaped.  
`[^]`: Negated character set.  
`\b`: Word boundary. [Regex101](https://regex101.com/r/ldjRXa/1).  
`\B`: Non word boundary. [Regex101](https://regex101.com/r/7iac6R).  
`\d`: Digit.  
`'D`: Non-digit.  
`\n`: line feed.  
`\s`: white space.  
`\S`: other than white space.  
`\t`: Tab.  
`\w`: Any alphanumberic, including `_`. Why is underscore an alphanumeric and not `-`?  
`\W`: Any non-word character.  

`\n`: Where n is an integer.
>a back reference to the last substring matching the n parenthetical in the regular expression.  

What? [Regex101](https://regex101.com/r/vmg3jO/1/).


#### Using parentheses

[Regex101](https://regex101.com/r/fcvYms/1). You can see that `4` is remembered in a capturing group, the rest is only matched.

#### Searching with flags

e.g. g,i,m,s,...  
See [mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Advanced_searching_with_flags_2)

### A fitting exercise

I'm editing this blog post in markdown format. I made the mistake of formatting links as `()[]` instead of the other way around, `[]()`.
This will be my very first exercise!
I'm glad sublime text apparantly has a feature to find by regex.

#### Progress: 

**Step0**  
Ok it turned it it's a bit too hard for me to do this form the start. I can match one, but cannot seem to find how to match multiple values... So, I'm going to continue by making some easier exercises.  
EDIT: Okay, so my mistake was that I somehow deleted the `/g` global flag. Myeah... that's some time wasted 😊.

**Step1**  
I did it! Well only for the first parentheses.  
Now I'm matching `(regex101)`, `(x)` etc..., and correct ones like `(https://regex101.com/r/hifWQx/1)`.
See [regex101](https://regex101.com/r/fcvYms/10).  
I need to **filter and target the correct ones** that:

  * Have more than 5 chars
  * Do not preceed a `]`
  * Do not contain any whitespace

**Step2**  
Okay! I've done it. [regex101](https://regex101.com/r/fcvYms/11).  

**Step3**  
Now, the way I've done it, and there are probably other techniques, is to save the contents between the `()` as capture group 1 and the content between `[]` as capture group 2. Then construct a new string with `[capturegroup1](capturegroup2)`. See [regex101](https://regex101.com/r/fcvYms/9).

In sublime text:  
![Doing it in sublime text, find and replace method](./images/regex_sublime.png)

Worked like a charm. 
Wow, I'm pretty amazed at the powers of regex. **This will make my development process so much faster** when manipulating code or text.

That's it for this post, I will continue to make regex exercises to further cement and deepen my knowledge. This will be done on [codewars](https://www.codewars.com/kata/search/javascript?q=&r%5B%5D=-8&tags=Regular+Expressions&xids=played&beta=false&order_by=satisfaction_percent+desc%2Ctotal_completed+desc).

### Conclusion

Like anything else in programming, it requires some effort in order to grasp it. 
I've been following the course learning how to learn on coursera at the moment. 
So I realise it's important for me to cement my knowledge. Therefor I will make some 'katas' on regex's the following days so I can imprint it into my long term memory.









