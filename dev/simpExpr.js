function simpAdd(expr0, expr1){
    expr0 = simplify(expr0);
    expr1 = simplify(expr1);
    if(expr0.type == "num" && expr1.type == "num"){
        return {type: "num", num: add(expr0.num, expr1.num)}
    }
    var hopeless = false;
    if(expr0.type == "binOp"){
        switch(expr0.op){
            case "/":
                return fracAdd(expr0, expr1);
            case "^":
                if(expr1.op == "^")
                    hopeless = true;
                break;
        }
    }
    else if(expr0.type == "unOp")
        hopeless = true;
    if(hopeless)
        return {type: "binOp", op: "+", expr0: expr0, expr1: expr1};
    return simpAdd(expr1, expr0);
}

function simpMul(expr0, expr1){
    if(expr1 == undefined)
        expr1 = newNum(1);
    expr0 = simplify(expr0);
    expr1 = simplify(expr1);

    if(expr0.type == "num" && expr1.type == "num"){
        return newNum(mul(expr0.num, expr1.num));
    }
    if(expr0.op == "/"){
        if(expr1.op != "/")
            expr1 = newFrac(expr1, newNum(1));
        return simpDiv(simpMul(expr0.expr0, expr1.expr0), simpMul(expr0.expr1, expr1.expr1));
    }
    if(expr1.op == "/")
        return simpMul(expr1, expr0);
    return newMul(expr0, expr1); //If the fraction can't be simplified


}

function simpDiv(expr0, expr1){
    expr0 = simplify(expr0);
    expr1 = simplify(expr1);

    if(expr0.type == "num" && expr1.type == "num"){
        var GCD = gcd(expr0.num, expr1.num);
        if(GCD == expr1.num)
            return newNum(div(expr0.num, GCD));
        return newFrac(newNum(div(expr0.num, GCD)), newNum(div(expr1.num, GCD)));
    }
    if(expr0.op == "/"){
        if(expr1.op != "/")
            expr1.op = newFrac(expr1, newNum(1));
        return simpDiv(simpMul(expr0.expr0, expr1.expr1), simpMul(expr0.expr1, expr1.expr0));
    }
    if(expr1.op == "/")
        return simpDiv(expr1, expr0);
    return newFrac(expr0, expr1); //If the fraction can't be simplified

}

function exprNeg(expr){
    return newMul(expr, newNum(-1));
}

function simplify(expr){
    switch(expr.type){
        case "binOp":
            switch(expr.op){
                case "+":
                    return simpAdd(expr.expr0, expr.expr1);
                case "-":
                    return simpAdd(expr.expr0, exprNeg(expr.expr1));
                case "*":
                    return simpMul(expr.expr0, expr.expr1);
                case "/":
                    return simpDiv(expr.expr0, expr.expr1);
                default:
                    return expr;
            }
        default:
            return expr;
    }
}