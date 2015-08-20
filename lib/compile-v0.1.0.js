/*
a: 123
if a > 100
    b: 456
console.log(a + b * b)

RootBlock [
    AssignStatement {
        assignee: "a"
        value: NumberExpression "123"
    }
    IfStatement {
        condition: GreaterThanExpression {
            x: VariableExpression "a"
            y: NumberExpression "100"
        }
        thenBranch: Block [
            AssignStatement {
                assignee: "b"
                value: NumberExpression "456"
            }
        ]
    }
    CallStatement {
        callee: DotExpression {
            x: VariableExpression "console"
            y: "log"
        }
        arguments: [
            PlusExpression {
                x: VariableExpression "a"
                y: MultiplyExpression {
                    x: VariableExpression "b"
                    y: VariableExpression "b"
                }
            }
        ]
    }
]
*/
export default function(input) {
    let statementPos = 0;
    let indent = 0;
    let lines = [];
    let inIndent = false;
    let pos = 0;
    for (let i = 0; i < input.code.length; i++) {
        let char = input.code[i];
        let endPos = null;
        if (char === "\n") {
            if (input.code[i - 1] === "\r") {
                endPos = i - 2;
            }
            else {
                endPos = i - 1;
            }
            lines.push({code: input.code.substr(pos, endPos - pos + 1), position: pos});
            pos = i + 1;
        }
    }
    lines.forEach(line => line.indent = calcIndent(line.code));
    let block = generateBlock(lines, 1, 0, lines.length - 1, lines[lines.length - 1].length - 1, true);
    console.log(lines);
    console.log(block);
    return {code: "haha", sourceMap: null};
    while (i < input.code.length) {
        let char = input.code[i];
        let endPos = null;
        if (input.code[i] === "\n") {
            if (input.code[i - 1] === "\r") {
                endPos = i - 2;
            }
            else {
                endPos = i - 1;
            }
            lines.push({code: input.code.substr(pos, endPos - pos), position: pos});
            inIndent = true;
            indent++;
        }
        if (char === ";" || char === "\n") {
            lines.push({});
            statement = input.code.substr(statementPos, i - statementPos);
        }
        if (!inIndent && (char === " " || char === "\t") && input.code[i - 1] === "\n") {
            inIndent = true;
            indent++;
        }
        if (inIndent && char !== " " && char !== "\t") {
            inIndent = false;
            lines[lines.length - 1].indent = indent;
            lines.push({indent: indent});
        }
        i++;
    }
    return {code: "haha", sourceMap: null};
};

let calcIndent = function(lineCode) {
    return lineCode.match(/^[ \t]*/)[0].length;
};

let generateBlock = function(lines, startLine, startColumn, endLine, endColumn, isRoot) {
    let block = new RootBlock();
    let blockIndent = lines[startLine].indent;
    let subBlockPos = null;
    for (let i = startLine; i <= endLine; i++) {
        if (lines[i].indent === blockIndent) {
            if (subBlockPos === null) {
                let assignMatch = lines[i].code.match(/(\S*)\s*:\s*(\S*)/);
                if (assignMatch !== null) {
                    let statement = new AssignStatement(assignMatch[1], Expression.build(assignMatch[2]));
                    block.add(statement);
                }
                else {
                    block.add({unknown: true});
                }
            }
            else {
                block.add(generateBlock(lines, subBlockPos, 0, i - 1, lines[i - 1].length - 1));
            }
        }
        else {
            subBlockPos = i;
        }
    }
    return block;
};

let Block = class Block {
    constructor() {
        this.value = [];
    }

    add(statement) {
        this.value.push(statement);
    }

    print() {
        let generateMessage = (block, level) => {
            block.value.map(statement => "    ".repeat(level + 1) + statement.constructor.name + " {\n" + Object.keys(statement).map(key => "    ".repeat(level + 2) + key + ": " + statement[key].constructor.name);
        };
    }
};

let RootBlock = class RootBlock extends Block {};

let Statement = class Statement {
    print(level = 0) {
        return this.constructor.name + "{\n" +
        Object.keys(this).map(key =>
            "    ".repeat(level + 1) + key + ": " +
            this[key].constructor.name + " " + this[key].print(level + 1)
        ) +
        "    ".repeat(level) + "}\n";
    }
};

let AssignStatement = class AssignStatement extends Statement {
    constructor(assignee, value) {
        super();
        this.assignee = assignee;
        this.value = value;
    }
};

let CallStatement = class CallStatement extends Statement {
    constructor(callee, arguments) {
        super();
        this.callee = callee;
        this.arguments = arguments;
    }

    print(level = 0) {
        return this.constructor.name + " {\n" +
        "    ".repeat(level + 1) + key + "callee: " + this.callee.print(level + 1) + "\n" +
        "    ".repeat(level + 1) + key + "arguments: [\n" +
        this.arguments.map(arg => arg.print(level + 1)) +
        "    ".repeat(level + 1) + "]\n" +
        "    ".repeat(level) + "}\n";
    }
};

let IfStatement = class IfStatement extends Statement {
    constructor(condition, thenBranch, elseBranch) {
        super();
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }
};