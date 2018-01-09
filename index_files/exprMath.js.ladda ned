function newNum(num){
    return {type: "num", num: bigInt(num)};
}

function newConst(constName){
    switch(constName){
        case "π":
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

function newVar(varName){
    return {type: "var", var: varName};
}

function newAdd(term0, term1){
    return {type: "binOp", op: "+", expr0: term0, expr1: term1};
}
function newSub(term0, term1){
    return {type: "binOp", op: "-", expr0: term0, expr1: term1};
}

function newMul(fac0, fac1){
    return {type: "binOp", op: "×", expr0: fac0, expr1: fac1};
}

function newFrac(num, den){
    return {type: "binOp", op: "/", expr0: num, expr1: den};
}

function newPow(base, exp){
    return {type: "binOp", op: "^", expr0: base, expr1: exp};
}

function newTuple(expr0, expr1){
    return {type: "binOp", op: ",", expr0: expr0, expr1: expr1};
}

function newEq(expr0, expr1){
    return {type: "binOp", op: "=", expr0: expr0, expr1: expr1};
}

function newSum(expr0, expr1, expr2){
    return {type: "func", func: "Σ", expr: newTuple(newTuple(expr0, expr1), expr2)};
}

function newProd(expr0, expr1, expr2){
    return {type: "func", func: "Π", expr: newTuple(newTuple(expr0, expr1), expr2)};
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

    var e00te11 = simpMul(expr0.expr0, expr1.expr1);
    var e10te01 = mulOp(expr1.expr0, expr0.expr1);
    var e01te11 = simpMul(expr0.expr1, expr1.expr1);
    var e0011pe1001 = addOp(e00te11, e10te01);
    var ans = simpDiv(e0011pe1001, e01te11);
    return ans;
    //return simpDiv(addOp(simpMul(expr0.expr0, expr1.expr1), mulOp(expr1.expr0, expr0.expr1)), simpMul(expr0.expr1, expr1.expr1));
}


function unsafeEq(obj0, obj1){
    if(typeof obj0 !== 'object' || typeof obj1 !== 'object')
        return obj0 == obj1;
    if(Object.keys(obj0).length != Object.keys(obj1).length)
        return false;
    for(var i in obj0){
        if(!unsafeEq(obj0[i], obj1[i]))
            return false;
    }
    //If unsafeEq doesn't find any difference between any of the properties of the objects, we know for sure that they look the same
    return true;
}

function containsVar(expr, varName){
    switch(expr.type){
        case "var":
            return expr.var === varName;
        case "unOp":
            return containsVar(expr.expr, varName);
        case "binOp":
            return containsVar(expr.expr0, varName) || containsVar(expr.expr1, varName);
        case "func":
            return containsVar(expr.expr, varName);
        case "num":
            return false;
        default:
            console.error("Unknown expression in containsVar");
    }

}