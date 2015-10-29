import * as $lex from "../lib/compile-lex-0";
import * as $block from "../lib/compile-block-0";
import assert from "assert";

let s = null;
let lex, result, block;

lex = new $lex.Lex(`lemo 0.1.0, node module
a: 1 + 2 + 3
b: 2 + 3
c: abc(5, 6)
if a
    c: 7
else
    c: 5
    b: c
d: "xxx"
e: a.b.c
f: 1 + 2 * 3
g: (1 + 2) * 3
h: f + g > Math.PI ? 1 | 2
i: x -> x + 1
`);
block = new $block.RootBlock(lex.part());
console.log(block.print() === `RootBlock [
    AssignStatement {
        assignee: VariableExpression "a"
        value: PlusExpression {
            x: PlusExpression {
                x: NumberExpression "1"
                y: NumberExpression "2"
            }
            y: NumberExpression "3"
        }
    }
    AssignStatement {
        assignee: VariableExpression "b"
        value: PlusExpression {
            x: NumberExpression "2"
            y: NumberExpression "3"
        }
    }
    AssignStatement {
        assignee: VariableExpression "c"
        value: ParenthesisCallExpression {
            callee: VariableExpression "abc"
            arguments: Arr [
                NumberExpression "5"
                NumberExpression "6"
            ]
        }
    }
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
            thenBranch: Block [
                AssignStatement {
                    assignee: VariableExpression "c"
                    value: NumberExpression "7"
                }
            ]
            elseBranch: Block [
                AssignStatement {
                    assignee: VariableExpression "c"
                    value: NumberExpression "5"
                }
                AssignStatement {
                    assignee: VariableExpression "b"
                    value: VariableExpression "c"
                }
            ]
        }
    }
    AssignStatement {
        assignee: VariableExpression "d"
        value: ParenthesisCallExpression {
            callee: InlineNormalStringExpression
            arguments: Arr [
                StringExpression "xxx"
            ]
        }
    }
    AssignStatement {
        assignee: VariableExpression "e"
        value: DotExpression {
            x: DotExpression {
                x: VariableExpression "a"
                y: Atom "b"
            }
            y: Atom "c"
        }
    }
    AssignStatement {
        assignee: VariableExpression "f"
        value: PlusExpression {
            x: NumberExpression "1"
            y: TimesExpression {
                x: NumberExpression "2"
                y: NumberExpression "3"
            }
        }
    }
    AssignStatement {
        assignee: VariableExpression "g"
        value: TimesExpression {
            x: PlusExpression {
                x: NumberExpression "1"
                y: NumberExpression "2"
            }
            y: NumberExpression "3"
        }
    }
    AssignStatement {
        assignee: VariableExpression "h"
        value: IfExpression {
            condition: GreaterThanExpression {
                x: PlusExpression {
                    x: VariableExpression "f"
                    y: VariableExpression "g"
                }
                y: DotExpression {
                    x: VariableExpression "Math"
                    y: Atom "PI"
                }
            }
            thenBranch: Block [
                ExpressionStatement {
                    expression: NumberExpression "1"
                }
            ]
            elseBranch: Block [
                ExpressionStatement {
                    expression: NumberExpression "2"
                }
            ]
        }
    }
    AssignStatement {
        assignee: VariableExpression "i"
        value: ArrowFunctionExpression {
            arguments: Arr [
                Atom "x"
            ]
            body: PlusExpression {
                x: VariableExpression "x"
                y: NumberExpression "1"
            }
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: [1, 2, 3]
a: {a: 1, b: 2}
a.b: 1
`);
block = new $block.RootBlock(lex.part());
console.log(block.print() === `RootBlock [
    AssignStatement {
        assignee: VariableExpression "a"
        value: ArrayExpression {
            value: Arr [
                NumberExpression "1"
                NumberExpression "2"
                NumberExpression "3"
            ]
        }
    }
    AssignStatement {
        assignee: VariableExpression "a"
        value: ObjectExpression {
            value: Arr [
                NameValue {
                    name: Atom "a"
                    value: NumberExpression "1"
                }
                NameValue {
                    name: Atom "b"
                    value: NumberExpression "2"
                }
            ]
        }
    }
    AssignStatement {
        assignee: DotExpression {
            x: VariableExpression "a"
            y: Atom "b"
        }
        value: NumberExpression "1"
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: 1 if b
if a
else
    22
if a then
    1
else
    22
if a
    b
else
if (
    a
)
    b
a: b = 5 ? 4 | c = 6 ? 3
`);
block = new $block.RootBlock(lex.part());
console.log(block.print() === `RootBlock [
    PostIfStatement {
        expression: IfExpression {
            condition: VariableExpression "b"
            thenBranch: Block [
                AssignStatement {
                    assignee: VariableExpression "a"
                    value: NumberExpression "1"
                }
            ]
            elseBranch: null
        }
    }
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
            thenBranch: null
            elseBranch: Block [
                ExpressionStatement {
                    expression: NumberExpression "22"
                }
            ]
        }
    }
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
            thenBranch: Block [
                ExpressionStatement {
                    expression: NumberExpression "1"
                }
            ]
            elseBranch: Block [
                ExpressionStatement {
                    expression: NumberExpression "22"
                }
            ]
        }
    }
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
            thenBranch: Block [
                ExpressionStatement {
                    expression: VariableExpression "b"
                }
            ]
            elseBranch: Block [
            ]
        }
    }
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
            thenBranch: Block [
                ExpressionStatement {
                    expression: VariableExpression "b"
                }
            ]
            elseBranch: null
        }
    }
    AssignStatement {
        assignee: VariableExpression "a"
        value: IfExpression {
            condition: EqualExpression {
                x: VariableExpression "b"
                y: NumberExpression "5"
            }
            thenBranch: Block [
                ExpressionStatement {
                    expression: NumberExpression "4"
                }
            ]
            elseBranch: Block [
                ExpressionStatement {
                    expression: IfExpression {
                        condition: EqualExpression {
                            x: VariableExpression "c"
                            y: NumberExpression "6"
                        }
                        thenBranch: Block [
                            ExpressionStatement {
                                expression: NumberExpression "3"
                            }
                        ]
                        elseBranch: null
                    }
                }
            ]
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
a:
    aaa <= bbb or not mmm = nnn or ooo /= ppp
    or ccc =
        ddd
        + eee
    and (
        if eee
            fff
        else
            ggg
    )
`);
block = new $block.RootBlock(lex.part());
console.log(block.print());