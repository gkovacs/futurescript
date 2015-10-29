import * as $lex from "./compile-lex-0";
import * as $block from "./compile-block-0";
import * as $pattern from "../lib/compile-pattern-0";
import * as $print from "../lib/compile-print-0";
import * as $statement from "./compile-statement-0";
import * as $expressionBase from "./compile-expression-base-0";

export class DotExpression extends $expressionBase.Expression {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $lex.Dot, $pattern.tokens], [0, 2]]
        ];
    }

    static applyMatch(match, lex, parentBlock) {
        let left = this.build(lex.part(match[0]), parentBlock);
        let right = null;
        if (lex.at(match[1].startIndex) instanceof $lex.NormalLeftParenthesis) {
            right = this.build(
                lex.part(match[1]).shrink(),
                parentBlock
            );
        }
        else {
            right = new $statement.Atom(lex.at(match[1].startIndex).value);
        }
        return new this(left, right);
    }
};

export class ObjectExpression extends $expressionBase.Expression {
    constructor(value) {
        super();
        this.value = value;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.BracePair], [0]]
        ];
    }

    static applyMatch(match, lex, parentBlock) {
        let memberRanges = $pattern.Pattern.split(
            [$lex.Comma, $lex.Semicolon],
            lex.part(match[0]).shrink()
        );
        return new this(
            new $statement.Arr(memberRanges.map(m => {
                let nvRanges = $pattern.Pattern.split(
                    $lex.Colon,
                    lex.part(m)
                );
                return new $statement.NameValue(
                    new $statement.Atom(lex.at(nvRanges[0].startIndex).value),
                    this.build(lex.part(nvRanges[1]), parentBlock)
                );
            }))
        );
    }
};

export class ArrayExpression extends $expressionBase.Expression {
    constructor(value) {
        super();
        this.value = value;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.BracketPair], [0]]
        ];
    }

    static applyMatch(match, lex, parentBlock) {
        let memberRanges = $pattern.Pattern.split(
            [$lex.Comma, $lex.Semicolon],
            lex.part(match[0]).shrink()
        );
        return new this(
            new $statement.Arr(memberRanges.map(m =>
                this.build(lex.part(m), parentBlock)
            ))
        );
    }
};