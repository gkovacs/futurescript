import * as $lex from "../lib/compile-lex-0";
import assert from "assert";

let s = null;

s = new $lex.Lex(`lemo 0.1.0
x: "abc"
x: "
    abc
"
`).toString();
console.log(s === 'NormalToken "x", Colon, InlineNormalString, CallLeftParenthesis, Str "abc", RightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, CallLeftParenthesis, Str "abc", RightParenthesis');

// Each last line of the first 5 strings should be treated as empty. But the last line of the last string should be treated as not empty. These 6 strings only have differences (of the number of spaces) in their last lines.
s = new $lex.Lex(`lemo 0.1.0
--
    "
        abc
            def

    "

    "
        abc
            def
 
    "

    "
        abc
            def
    
    "

    "
        abc
            def
     
    "

    "
        abc
            def
        
    "

    "
        abc
            def
            
    "
`).toString();
console.log(s === 'DashFunction, LeftChevron, FormattedNormalString, CallLeftParenthesis, Str "abc\\\\n    def\\\\n", RightParenthesis, Semicolon, FormattedNormalString, CallLeftParenthesis, Str "abc\\\\n    def\\\\n", RightParenthesis, Semicolon, FormattedNormalString, CallLeftParenthesis, Str "abc\\\\n    def\\\\n", RightParenthesis, Semicolon, FormattedNormalString, CallLeftParenthesis, Str "abc\\\\n    def\\\\n", RightParenthesis, Semicolon, FormattedNormalString, CallLeftParenthesis, Str "abc\\\\n    def\\\\n", RightParenthesis, Semicolon, FormattedNormalString, CallLeftParenthesis, Str "abc\\\\n    def\\\\n    ", RightParenthesis, RightChevron');

s = new $lex.Lex(`lemo 0.1.0
x: v"C:\\Windows"
x: v"
    C:\\Windows
"
`).toString();
console.log(s === 'NormalToken "x", Colon, InlineVerbatimString, CallLeftParenthesis, Str "C:\\\\Windows", RightParenthesis, Semicolon, NormalToken "x", Colon, FormattedVerbatimString, CallLeftParenthesis, Str "C:\\\\Windows", RightParenthesis');
