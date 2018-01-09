function newNum(num){
    return {type: "num", num: num};
}

function newConst(constName){
    switch(constName){
        case "𝜋":
            return parseBigNum('3.14159265359');
        case "e":
            return parseBigNum('2.71828182846');
        case "i":
            return newPow(newNum(-1), newFrac(newNum(1), newNum(2)));
        case "∞":
            return newNum(Infinity);
        case "🎲":
            return parseBigNum('' + Math.random());
    }
}

function newAdd(term0, term1){
    return {type: "binOp", op: "+", expr0: term0, expr1: term1};
}

function newMul(fac0, fac1){
    return {type: "binOp", op: "*", expr0: fac0, expr1: fac1};
}

function newFrac(num, den){
    return {type: "binOp", op: "/", expr0: num, expr1: den};
}

function newPow(base, exp){
    return {type: "binOp", op: "^", expr0: base, expr1: exp};
}

function fracAdd(expr0, expr1){
    var addOp = simpAdd;
    var mulOp = simpMul;
    expr1 = newFrac(expr1, newNum(1));
    /*switch(expr1.type){
        case "binOp":
            switch(expr1.op){
                case "^":
                    expr1 = newFrac(expr1, 1);
                    addOp = powAdd;
                    break;
                default:
                    break:
            }
            break:
        default:
            expr1 = newFrac(expr1, 1);
            break;
    }*/
    
    return simpDiv(addOp(simpMul(expr0.expr0, expr1.expr1), mulOp(expr1.expr0, expr0.expr1)), simpMul(expr0.expr1, expr1.expr1));
}

