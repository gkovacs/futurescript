import {test, assert} from "./c-base-0.js";
import * as $lex from "../lib/c-lex-0.js";

let s = null;

test(() => {
s = new $lex.Lex(`lemo 0.1.0
bbb:
    345
bbb:
345
ccc: {
    a: 3
    b: 0
}
ddd: [
    0
    8
]
b: 3 +
    5
b: 3 +
5
b: 3
+ 5
b: 3
    + 5
b: 3
+5
`).toString();
assert(s === 'VersionDirective "lemo 0.1.0", NormalToken "bbb", Colon, Num "345", Semicolon, NormalToken "bbb", Colon, Num "345", Semicolon, NormalToken "ccc", Colon, NormalLeftBrace, NormalToken "a", Colon, Num "3", Semicolon, NormalToken "b", Colon, Num "0", NormalRightBrace, Semicolon, NormalToken "ddd", Colon, NormalLeftBracket, Num "0", Semicolon, Num "8", NormalRightBracket, Semicolon, NormalToken "b", Colon, Num "3", Plus, Num "5", Semicolon, NormalToken "b", Colon, Num "3", Plus, Num "5", Semicolon, NormalToken "b", Colon, Num "3", Plus, Num "5", Semicolon, NormalToken "b", Colon, Num "3", Plus, Num "5", Semicolon, NormalToken "b", Colon, Num "3", Semicolon, Positive, Num "5"');
}); // ============================================================

test(() => {
s = new $lex.Lex(`lemo 0.1.0
b.a: a
.b
a.b <>
    aaa(@a)
.c()
`).toString();
assert(s === 'VersionDirective "lemo 0.1.0", NormalToken "b", Dot, NormalToken "a", Colon, NormalToken "a", Dot, NormalToken "b", Semicolon, NormalToken "a", Dot, NormalToken "b", DiamondFunction, LeftChevron, NormalToken "aaa", CallLeftParenthesis, Arg, Dot, NormalToken "a", CallRightParenthesis, RightChevron, Dot, NormalToken "c", CallLeftParenthesis, CallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`lemo 0.1.0
a: 3
as c
a: [
    x ->
        aaa(x)
    as c
    <>
    above as d
    4
]
a
export as b
`).toString();
assert(s === 'VersionDirective "lemo 0.1.0", NormalToken "a", Colon, Num "3", As, NormalToken "c", Semicolon, NormalToken "a", Colon, NormalLeftBracket, NormalToken "x", ArrowFunction, LeftChevron, NormalToken "aaa", CallLeftParenthesis, NormalToken "x", CallRightParenthesis, RightChevron, As, NormalToken "c", Semicolon, DiamondFunction, As, NormalToken "d", Semicolon, Num "4", NormalRightBracket, Semicolon, NormalToken "a", ExportAs, NormalToken "b"');
}); // ============================================================

test(() => {
s = new $lex.Lex(`lemo 0.1.0
x: 2 as
a
x: 2
as
a
x
:
2
as
a
`).toString();
assert(s === 'VersionDirective "lemo 0.1.0", NormalToken "x", Colon, Num "2", As, NormalToken "a", Semicolon, NormalToken "x", Colon, Num "2", As, NormalToken "a", Semicolon, NormalToken "x", Colon, Num "2", As, NormalToken "a"');
}); // ============================================================

test(() => {
s = new $lex.Lex(`lemo 0.1.0
a: {
    aaa: 1,
    bbb: 2
}
`).toString();
assert(s === 'VersionDirective "lemo 0.1.0", NormalToken "a", Colon, NormalLeftBrace, NormalToken "aaa", Colon, Num "1", Comma, NormalToken "bbb", Colon, Num "2", NormalRightBrace');
}); // ============================================================

test(() => {
s = new $lex.Lex(`lemo 0.1.0
a: {
    aaa: 1
    ,
    bbb: 2
}
`).toString();
assert(s === 'VersionDirective "lemo 0.1.0", NormalToken "a", Colon, NormalLeftBrace, NormalToken "aaa", Colon, Num "1", Comma, NormalToken "bbb", Colon, Num "2", NormalRightBrace');
}); // ============================================================

test(() => {
s = new $lex.Lex(`lemo 0.1.0
a:
    {
        b: 1
        c: {
            d:
                2
            e: 3
        }
        f:
            [
                4
                5
            ]
    }
`).toString();
assert(s === 'VersionDirective "lemo 0.1.0", NormalToken "a", Colon, NormalLeftBrace, NormalToken "b", Colon, Num "1", Semicolon, NormalToken "c", Colon, NormalLeftBrace, NormalToken "d", Colon, Num "2", Semicolon, NormalToken "e", Colon, Num "3", NormalRightBrace, Semicolon, NormalToken "f", Colon, NormalLeftBracket, Num "4", Semicolon, Num "5", NormalRightBracket, NormalRightBrace');
}); // ============================================================
