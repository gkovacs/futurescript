import * as $print from "./c-print-0.js";
import * as $lex from "./c-lex-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class Node {
    constructor(obj) {
        if (obj !== undefined && obj !== null) {
            Object.keys(obj).forEach(key => {
                this[key] = obj[key];
            });
        }
    }

    setParent(node) {
        this._parent = node;
    }

    getParent(type) {
        if (type === undefined) {
            return this._parent;
        }
        else {
            let next = this._parent;
            while (next !== null && !(next instanceof type)) {
                next = next._parent;
            }
            return next;
        }
    }

    getRoot() {
        let next = this;
        while (next._parent !== null) {
            next = next._parent;
        }
        return next;
    }

    toString(level = 0) {
        return $print.printObject(this, this.constructor, level);
    }
}

export class MappableNode extends Node {
    setLexPart(lexPart) {
        this._lexPart = lexPart;
        return this;
    }

    getLexPart() {
        return this._lexPart;
    }
}

// Piece is not an expression, statement or block. It's a simple node that
// the source and the compiled code look the same.
export class Piece extends MappableNode {
    constructor() {
        super();
        let arg = arguments[0];
        if (typeof arg === "string") {
            this.value = arg;
        }
        else if (arg instanceof $lex.LexPart) {
            this.value = arg.token().value;
            this.setLexPart(arg);
        }
    }

    compile() {
        return new J(this.value).shareLexPart(this);
    }

    toString() {
        return $print.printAtom(this);
    }
}

export class Arr extends Node {
    constructor(value) {
        super();
        this.value = value;
    }

    toString(level = 0) {
        return $print.printArray(this.value, this.constructor, level);
    }
}

export class Xy extends Node {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }
}

export class VariableAssignee extends Node {}

export class DotAssignee extends Node {}

export class BracketAssignee extends Node {}

export class ArrowArgument extends Node {}