# How to use JavaScript in this project

This is a writeup for how the developers of this application plan to use javascript. Installing a linter to support these methods of syntax would be helpful. While most of this is written in Typescript we all know that JS conventions apply here as well. More may be added (TODO) such as the inclusion of rules about typing variables on declaration and avoiding the use of `any`.

### Guidelines

1. Use `let` instead of `var` in _almost_ all cases.

    The keyword `let` is used for block-scoped assignment. The keyword `var` allows for assignment within the scope of the containing function. I always (unless rare circumstance deems it reasonable) use let for the purposes of more coherent debugging. It can be very easy to get tangled in blocks (loops, conditionals, etc) and accidently reference the wrong `i` index variable or something like this, when you use `var` all over the place instead of `let`.

    ```
    function f() {
        var a = 1;
        if (true) {
            var a = 2;
        }
        console.log(a); // 2
    }

    function f() {
        let a = 1;
        if (true) {
            let a = 2;
        }
        console.log(a); // 1
    }
    ```

2. Use the `const` keyword to declare constants.

    It is good to use `const` and name your constant often (but not always) in `ALL_CAPS`. This restricts you from accidently reassigning a value to a reference you never meant to reassign to and can save you debugging in the long run. I find all caps helpful to stand out more when I am coding but that part is just a preference.

3. Use `===` when applicable.

    `===` is a literal comparison while `==` is checking for equality. This means that if you want to compare `a` to `b`...

    - if `a` and `b` should point to the same reference in memory use `===`
    - if `a` and `b` only need to be equivalent in value `==`

    ```
    1 == true // true
    1 === true // false
    0 == null // true
    null === null // true
    0 === null // false

    let a = { x: 'value' };
    let b = a;
    a === b // true

    let a = { x: 'value' };
    let b = { x: 'value' };
    a === b // false
    ```

4. Always terminate statements with a semicolon `;`

    Ok, yes, in JavaScript it is known that semicolons are optional. The compiler will insert semicolons according to this ruleset. https://www.ecma-international.org/ecma-262/5.1/#sec-7.9

    However, there are several ways that due to how these rules are structured, if you get into the habit of "not worrying about semicolons", there are chances you will run into errors. Many people use linters to automate line breaks and indentation based on maximum number of char per line, formatting preferences, etc. Even if this is not the case, line breaks and other formatting circumstances can affect the outcome of automatically placed semicolons. Examples below.

    ```
    function f() {
        return                  // <-- semicolon will be here, and return no object
            {
                x: 'value'
            }
    }

    let a = 1 // <-- first semicolon here, ok
    let b = 2
    (a+b).toString() // <-- second semicolon here, because '(' signals a function call

    // this results in syntax error
    ```

5. `class` definitions in their own file

    It is very useful to keep your classes in their own files. Having multiple class definitions with constructors, additional `.prototype` additional functions, can get messy and confusing. In frameworks like AngularJS people use `export` and `import` to easily include class files. Even in plain JS including a series of script files is always better than dealing with one 4+ digit length file.

    This related comment is more of a general programming rule, but having functions "be able to fit in your window" is a good rule to follow. If they run much longer and you are required to scroll to view the whole function you should probably break it down into other subroutines.

### General Suggestions

1. Ways to define a `function` in JavaScript

    There are multiple ways to define functions and none of them are really bad. It is nice to be consistent throughout your workspace so using the same format within the same scope / situation is good practice for readability.

    ```
    // This is my default format as used when defining functions with the current scope
    function f(param1, param2...) {
        // do something
        // optional return
    }

    // This is another way to give a function a name and definition
    let f = function(param1, param2...) {
        // do something
        // optional return
    }

    // This one is a little different, called arrow notation, which is useful for defining
    // anonymous functions (often within a timer, listener, describe/it block... etc)
    (param1, param2...) => {
        // do something
        // optional return
    }
    setInterval(() => {
        // do something
        // optional return
    }, 1000);
    ```

2. One-line `if` or ternary?

    These are both useful, but I personally often use the latter (ternary) instead because I think it gives a little more control to the developer as you can define the `else` result.

    ```
    if (condition) return true; // returns true only if condition is true

    return condition ? 'true' : 'not true'; // returns 'true' string if condition is true, else 'not true'
    ```

3. Comments on new line/s, above the content.

    Despite my use of comments in the code snippets in this file, I find it useful for linter, style, and consistency to put comments on separate lines, always. You also can easily use the `ALT + UP/DOWN ARROW` shortcut very easily to move comments around, since they are on separate lines. Use block comment notation for multiple line comments (bonus, this helps you collapse more lines when managing large files in your IDE). This is very much an opinion just based on experience dealing with constant refactoring of documentation, but by no means a rule.
