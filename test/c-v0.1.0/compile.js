import {test, assert} from "../c-v0.1.0/base.js";
import * as $lockedApi from "../locked-api.js";
import * as $libLockedApi from "../../lib/locked-api.js";

let r;

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: 123
export: a
`);
assert(r === 123);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: 123 + 456 and 3
a: if 1 then 2 else 3
export: a
`);
assert(r === 2);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: x -> x + 1
export: a(2)
`);
assert(r === 3);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: 1
b: match a
    1 ? 10
    2 ? 100
    | 0
export: b
`);
assert(r === 10);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: "aaa"
export: a
`);
assert(r === "aaa");
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
message: ""

move: <>
    message: self + "\\(@0) --> \\(@1)\\n"

hanoi: <>
    if @0.count = 1
        move(@0.from, @0.to)
    else
        fun{
            count: @0.count - 1
            from: @0.from
            auxiliary: @0.to
            to: @0.auxiliary
        }
        move(@0.from, @0.to)
        fun{
            count: @0.count - 1
            from: @0.auxiliary
            auxiliary: @0.from
            to: @0.to
        }

hanoi{
    count: 3
    from: 0
    auxiliary: 1
    to: 2
}

export: message
`);
assert(r === `0 --> 2
0 --> 1
2 --> 1
0 --> 2
1 --> 0
1 --> 2
0 --> 2
`);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0, radical
message: ""

move: <>
    message: self + "\\(@0) --> \\(@1)\\n"

hanoi: <>
    if @count = 1
        move[@from, @to]
    else
        fun{
            count: @count - 1
            from: @from
            auxiliary: @to
            to: @auxiliary
        }
        move[@from, @to]
        fun{
            count: @count - 1
            from: @auxiliary
            auxiliary: @from
            to: @to
        }

hanoi{
    count: 3
    from: 0
    auxiliary: 1
    to: 2
}

export: message
`);
assert(r === `0 --> 2
0 --> 1
2 --> 1
0 --> 2
1 --> 0
1 --> 2
0 --> 2
`);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
if true then a: ("a")
export: a
`);
assert(r === "a");
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a:
    try
        true
    catch b
        false
    finally
        null
export: a
`);
assert(r === true);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a:
    try
        true
    catch
        false
export: a
`);
assert(r === true);
}); // ============================================================

test(() => {
assert.throws(() => {
r = $lockedApi.runCode(`fus 0.1.0
throw Error("haha")
`);
});
}); // ============================================================

test(() => {
assert.throws(() => {
r = $lockedApi.runCode(`fus 0.1.0
throw
`);
});
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
try
    a: 1
catch
    throw
export: a
`);
assert(r === 1);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: 1
b: match a
export: b = void
`);
assert(r === true);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0, radical
statusCode: 404
message: match <> statusCode >= @
    600 ? "unsupported"
    500 ? "server error"
    400 ? "client error"
    300 ? "redirect"
    200 ? "success"
    100 ? "informational"
    |     "unsupported"
export: message
`);
assert(r === "client error");
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
day: "Sun"
action: match day
    "Sat", "Sun" ? "have a rest"
    |              "work"
export: action
`);
assert(r === "have a rest");
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
export: 1 is Number
`);
assert(r === true);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
export: 7 mod 3
`);
assert(r === 1);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: {f: 5, g: 3}
delete a.f
export: a.f = void
`);
assert(r === true);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
export: do --
    a: "haha"
    a
`);
assert(r === "haha");
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: 2
a: self + 1
export: a
`);
assert(r === 3);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: (x, y) -> x + y
export: a'[5, 6]
`);
assert(r === 11);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: null
export: a'ok
`);
assert(r === false);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: null
export: a'ok.b'ok.c'ok.d = void
`);
assert(r === true);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: null
export: a'ok() = void
`);
assert(r === true);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: null
b: a ifnull 1
export: b
`);
assert(r === 1);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: 1 as b
export: b
`);
assert(r === 1);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
export: 2 ** 3
`);
assert(r === 8);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: 3
plus: (x, y) -> x + y
export: a |> plus(2)
`);
assert(r === 5);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
export: "aaa" + "
    bbb
" + v"ccc"
`);
assert(r === "aaabbbccc");
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: r"aaa"
b: r"aaa"gim
export: [
    a.source
    a.flags
    b.source
    b.flags
]
`);
assert(r[0] === "aaa" && r[1] === "" && r[2] === "aaa" && r[3] === "gim");
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
export: "aaa\\nbbb"
`);
assert(r === "aaa\nbbb");
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: r"
    aaa bbb # this is comment
"
export: "this is aaabbbccc".search(a)
`);
assert(r === 8);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: 1
b: 1
js"
    b = 2
"
export: a + b
`);
assert(r === 3);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
###
header comment
###
export: "haha"
`);
assert(r === "haha");
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
###
header comment*/
###
export: "haha"
`);
assert(r === "haha");
}); // ============================================================

test(() => {
r = $libLockedApi.generateOutput({code: `fus 0.1.0
a()
pause
b()
`}).targets[0].code;
assert(r === '"use strict";((a)());debugger;((b)());');
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
undefined: 5
export: undefined
`);
assert(r === 5);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: {
    "aaa": 1
}
export: a
`);
assert(r.aaa === 1);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: null
a ifnull: 1
b: 9
b ifnull: 1
export: [a, b]
`);
assert(r[0] === 1 && r[1] === 9);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
[a, b]: [1, 2]
export: [a, b]
`);
assert(r[0] === 1 && r[1] === 2);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: [x, y] -> x + y
export: a[2, 3]
`);
assert(r === 5);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: (x: 1, y: 2) -> x + y
export: a(4) * a()
`);
assert(r === 18);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
a: [x: 1, y: 2] -> x + y
export: a[4] * a[]
`);
assert(r === 18);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0, manual new
A: x -> x + 1
export: A(1)
`);
assert(r === 2);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`fus 0.1.0
Symbol()
`);
}); // ============================================================