import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import * as $expressionBase from "./c-expression-base-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class ArrowFunctionExpression extends $expressionBase.Expression {
    constructor(args, body) {
        super();
        this.arguments = args;
        this.body = body;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.NormalParenthesisPair, $lex.ArrowFunction, $pattern.any], [0, 2]],
            [[$pattern.NormalBracketPair, $lex.ArrowFunction, $pattern.any], [0, 2]],
            [[$lex.NormalToken, $lex.ArrowFunction, $pattern.any], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        let argumentsLexPart =
            lex.at(match[0].startIndex) instanceof $lex.NormalLeftParenthesis ?
            lex.part(match[0]).shrink() :
            lex.part(match[0]);
        let argumentRanges = $pattern.Pattern
        .split($lex.Comma, argumentsLexPart)
        .filter(m => m.endIndex >= m.startIndex);
        return new this(
            new $node.Arr(argumentRanges.map(m => {
                if (lex.at(m.startIndex + 1) instanceof $lex.Ifvoid) {
                    return new $node.ArrowArgument({
                        variable: new $node.Piece(lex.part(m)),
                        voidDefault: this.build(lex.part(m.startIndex + 3, m.endIndex)),
                        nullDefault: null
                    });
                }
                else if (lex.at(m.startIndex + 1) instanceof $lex.Colon) {
                    return new $node.ArrowArgument({
                        variable: new $node.Piece(lex.part(m)),
                        voidDefault: this.build(lex.part(m.startIndex + 2, m.endIndex)),
                        nullDefault: null
                    });
                }
                else if (lex.at(m.startIndex + 1) instanceof $lex.Ifnull) {
                    return new $node.ArrowArgument({
                        variable: new $node.Piece(lex.part(m)),
                        voidDefault: null,
                        nullDefault: this.build(lex.part(m.startIndex + 3, m.endIndex))
                    });
                }
                else {
                    return new $node.ArrowArgument({
                        variable: new $node.Piece(lex.part(m)),
                        voidDefault: null,
                        nullDefault: null
                    });
                }
            })),
            $statement.Statement.buildScopeBlock(lex.part(match[1]))
        );
    }

    rawCompile() {
        let args = this.arguments.value;
        let variables = new J(args.map(m => m.variable.compile()), ",");
        let voidDefaults = new J(args.filter(m => m.voidDefault !== null).map(m =>
            new J([
                "if (",
                m.variable.compile(),
                "===undefined){",
                m.variable.compile(),
                "=",
                m.voidDefault.compile(),
                ";}"
            ])
        ));
        let nullDefaults = new J(args.filter(m => m.nullDefault !== null).map(m =>
            new J([
                "if (",
                m.variable.compile(),
                "===null){",
                m.variable.compile(),
                "=",
                m.nullDefault.compile(),
                ";}"
            ])
        ));
        let name = "fun_" + $block.antiConflictString;
        return [
            "function " + name + "(", variables, "){",
            voidDefaults, nullDefaults,
            "return ", this.body.compile(), ";}"
        ];
    }
}

export class DiamondFunctionExpression extends $expressionBase.Expression {
    constructor(body) {
        super();
        this.body = body;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.DiamondFunction, $pattern.any], [1]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(
            $statement.Statement.buildScopeBlock(lex.part(match[0]))
        );
    }

    rawCompile() {
        let name = "fun_" + $block.antiConflictString;
        let arg = "var arg_" + $block.antiConflictString + "=arguments;";
        return [
            "function " + name + "(){" +
            arg +
            "return ", this.body.compile(), ";}"
        ];
    }
}

export class DashFunctionExpression extends $expressionBase.Expression {
    constructor(body) {
        super();
        this.body = body;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.DashFunction, $pattern.any], [1]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(
            $statement.Statement.buildScopeBlock(lex.part(match[0]))
        );
    }

    rawCompile() {
        return ["function(){return ", this.body.compile(), ";}"];
    }
}

export class ParenthesisCallExpression extends $expressionBase.Expression {
    constructor(callee, args) {
        super();
        this.callee = callee;
        this.arguments = args;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $pattern.CallParenthesisPair], [0, 1]]
        ];
    }

    static applyMatch(match, lex) {
        let argumentRanges = $pattern.Pattern
        .split($lex.Comma, lex.part(match[1]).shrink())
        .filter(m => m.endIndex >= m.startIndex);
        return new this(
            this.build(lex.part(match[0])),
            new $node.Arr(argumentRanges.map(m =>
                this.build(lex.part(m))
            ))
        );
    }

    rawCompile() {
        if (this.callee instanceof $expressionBase.InlineNormalStringExpression) {
            return this.arguments.value[0].compile();
        }
        else {
            if (this.getRoot().hasCompilerDirective("radical") && this.arguments.value.length === 0) {
                return [this.callee.compile(), "(undefined)"];
            }
            else {
                let args = new J(this.arguments.value.map(m => m.compile()), ",");
                return [this.callee.compile(), "(", args, ")"];
            }
        }
    }
}

export class BracketCallExpression extends $expressionBase.Expression {
    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $pattern.CallBracketPair], [0, 1]]
        ];
    }

    static applyMatch(match, lex) {
        return new ParenthesisCallExpression(
            this.build(lex.part(match[0])),
            new $node.Arr([
                this.build(lex.part(match[1]))
            ])
        );
    }
}

export class BraceCallExpression extends $expressionBase.Expression {
    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $pattern.CallBracePair], [0, 1]]
        ];
    }

    static applyMatch(match, lex) {
        return new ParenthesisCallExpression(
            this.build(lex.part(match[0])),
            new $node.Arr([
                this.build(lex.part(match[1]))
            ])
        );
    }
}

export class SpaceCallExpression extends $expressionBase.Expression {
    static match(lexPart) {
        let pos = this.searchOne(
            (token, index, lexPart) => {
                let next = lexPart.lex.at(index + 1);
                return (token instanceof $lex.RightParenthesis || token.constructor.canBeCalleeEnd) &&
                    next !== undefined && index < lexPart.endIndex &&
                    (
                        next instanceof $lex.NormalLeftParenthesis ||
                        next instanceof $lex.NormalLeftBracket ||
                        next instanceof $lex.NormalLeftBrace ||
                        !(
                            next.constructor.expressionStartForbidden ||
                            next.constructor.isJoint ||
                            next instanceof $lex.Chevron ||
                            next instanceof $lex.Parenthesis ||
                            next instanceof $lex.Bracket ||
                            next instanceof $lex.Brace
                        )
                    );
            },
            lexPart
        );
        if (pos === null) {
            return null;
        }
        else {
            return [
                {startIndex: lexPart.startIndex, endIndex: pos},
                {startIndex: pos + 1, endIndex: lexPart.endIndex}
            ];
        }
    }

    static applyMatch(match, lex) {
        return new ParenthesisCallExpression(
            this.build(lex.part(match[0])),
            new $node.Arr([this.build(lex.part(match[1]))])
        );
    }
}