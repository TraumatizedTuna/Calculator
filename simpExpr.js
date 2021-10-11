function simpAdd(expr0, expr1, reversed) {
    expr0 = simplify(expr0);
    expr1 = simplify(expr1);
    if (expr0.type == "num" && expr1.type == "num") {
        return { type: "num", num: expr0.num + expr1.num };
    }
    if (expr1.type == "num") {
        if (expr1.num == 0)
            return expr0;
        if (expr1.num < 0)
            return newSub(expr0, newNum(0n - expr1.num));
    }
    var hopeless = false;
    if (expr0.type == "binOp") {
        switch (expr0.op) {
            case "+":
                var simp0 = simpAdd(expr0.expr0, expr1);
                if (!unsafeEq(newAdd(expr0.expr0, expr1), simp0)) { //If simplification actually made a difference
                    return simpAdd(expr0.expr1, simp0);
                }
                var simp1 = simpAdd(expr0.expr1, expr1);
                if (!unsafeEq(newAdd(expr0.expr1, expr1), simp1)) { //If simplification actually made a difference
                    return simpAdd(expr0.expr0, simp1);
                }
                break;
            case "/":
                return fracAdd(expr0, expr1);
            case "^":
                if (expr1.op == "^")
                    hopeless = true;
                break;
        }
    }
    else if (expr0.type == "unOp")
        hopeless = true;
    if (hopeless)
        return { type: "binOp", op: "+", expr0: expr0, expr1: expr1 };
    if (expr0.type == "var" || expr0.type == "func")
        return newAdd(expr0, expr1);
    if (reversed) {
        return newAdd(expr1, expr0); //Reverse it back because, why not?
    }
    return simpAdd(expr1, expr0, true);
}

function simpMul(expr0, expr1) {
    if (expr1 == undefined)
        expr1 = newNum(1);
    expr0 = simplify(expr0);
    expr1 = simplify(expr1);

    if (expr0.type == "num") {
        if (expr0.num == 0)
            return newNum(0);
        if (expr0.num == 1)
            return expr1;
        if (expr1.type == "num")
            return newNum(expr0.num * expr1.num);
    }
    else if (expr1.type == "num") {
        if (expr1.num == 0)
            return newNum(0);
        if (expr1.num == 1)
            return expr0;
    }
    if (expr0.op == "/") {
        if (expr1.op != "/")
            expr1 = newFrac(expr1, newNum(1));
        return simpDiv(simpMul(expr0.expr0, expr1.expr0), simpMul(expr0.expr1, expr1.expr1));
    }
    if (expr1.op == "/")
        return simpMul(expr1, expr0);


    return simpRepMul(expr0, expr1); //If the fraction can't be simplified
}

function simpRepMul(expr0, expr1, isRev) {
    if (expr0.op == "^") {
        //TODO: Keep digging through factors
        if (unsafeEq(expr0.expr0, expr1)) {
            return simpPow(expr1, simpAdd(expr0.expr1, newNum(1)));
        }
    }
    if (isRev)
        return newMul(expr0, expr1);
    if (unsafeEq(expr0, expr1)) {
        return simpPow(expr0, newNum(2));
    }
    if (expr0.op == "^" && expr1.op == "^") {
        if (unsafeEq(expr0.expr0, expr1.expr0)) {
            return simpPow(expr0.expr0, simpAdd(expr0.expr1, expr1.expr1)); //a^b×a^c=a^(b+c)
        }
    }
    return simpRepMul(expr1, expr0, true);
}

function simpDiv(expr0, expr1) {
    expr0 = simplify(expr0);
    expr1 = simplify(expr1);

    //a/1=a
    if (expr1.type == "num" && expr1.num == 1) {
        return expr0;
    }
    if (expr0.type == "num") {
        //0/a=0
        if (expr0.num == 0)
            return newNum(0);
        if (expr1.type == "num") {
            var GCD = bigMath.gcd(expr0.num, expr1.num);
            if (GCD==expr1.num)
                return newNum(expr0.num / GCD);
            return newFrac(newNum(expr0.num / GCD), newNum(expr1.num / GCD));
        }
    }
    if (expr0.op == "/") {//If numerator is a fraction
        if (expr1.op != "/")//If denominator isn't
            expr1 = newFrac(expr1, newNum(1));//Convert denominator to fraction
        return simpDiv(simpMul(expr0.expr0, expr1.expr1), simpMul(expr0.expr1, expr1.expr0));//(a/b)/(x/y)=(ay)/(bx)
    }
    if (expr1.op == "/") {
        if (expr0.op != "/")//If denominator isn't
            expr0 = newFrac(expr0, newNum(1));
        return simpDiv(simpMul(expr0.expr0, expr1.expr1), simpMul(expr0.expr1, expr1.expr0));
    }
    return newFrac(expr0, expr1); //If the fraction can't be simplified

}


//TODO: (a^b)^(c/b)=a^c
function simpPow(expr0, expr1) {
    expr0 = simplify(expr0);
    expr1 = simplify(expr1);

    if (expr1.type == "num") {
        //a^0 where a!=0
        if (expr1.num == 0n && expr0.num != 0n) {
            return newNum(1);
        }
        if (expr1.num == "1") {
            return expr0;
        }

        //If base and exponent are integers, just calculate the power and return it
        if (expr0.type == "num" && expr1.num >= 0n) {
            return newNum(expr0.num ** expr1.num);
        }
        //If only exponent is an integer
        if (expr0.op == "/") {
            return simpDiv(simpPow(expr0.expr0, expr1), simpPow(expr0.expr1, expr1)); //(a/b)^c=a^c/b^c
        }
        if (expr0.op == "×") {
            return simpMul(simpPow(expr0.expr0, expr1), simpPow(expr0.expr1, expr1)); //(a/b)^c=a^c/b^c
        }
    }

    if (expr0.type == "num") {
        //If base is 0 or 1, return base (except 0^0)
        if (expr0.num == 1n || (expr0.num == 0n && expr1.num != 0n))
            return expr0;
    }

    if (expr0.op == "^") {
        return simpPow(expr0.expr0, simpMul(expr0.expr1, expr1)); //(a^b)^c=a^(bc)
    }

    if (expr1.op == "/" && !(expr1.expr0.type == "num" && expr1.expr0.num.eq(1))) {
        return newPow(simpPow(expr0, expr1.expr0), simpDiv(newNum(1), expr1.expr1)); //a^(b/c)=(a^b)^(1/c) Are we missing something by using newPow here?
    }

    return newPow(expr0, expr1);
}

function simpEq(expr0, expr1) {
    expr0 = simplify(expr0);
    expr1 = simplify(expr1);
    if (unsafeEq(expr0, expr1))
        return newNum(1);

    return newEq(expr0, expr1);
}


function simpSum(expr) {
    var [expr0, expr1, expr2] = [expr.expr0.expr0, expr.expr0.expr1, expr.expr1];
    expr2 = simplify(expr2);

    //If there's no k in the expression the sum will be number of iterations times expression
    if (!containsVar(expr2, "k")) {
        var diff = BigInt(calc(simpAdd(expr1, exprNeg(expr0))))+1n;
        if (diff < 0)
            diff = 0n;
        return simpMul(expr2, newNum(diff));
    }
    if (expr2.type === "binOp") {
        var sum0 = simpSum(newSum(expr0, expr1, expr2.expr0).expr);
        var sum1 = simpSum(newSum(expr0, expr1, expr2.expr1).expr);
        switch (expr2.op) {
            case "+":
                return simpAdd(sum0, sum1); //Σ(a,b,f(k)+g(k)) = Σ(a,b,f(k))+Σ(a,b,g(k))
            case "-":
                return simpAdd(sum0, exprNeg(sum1)); //Same for minus
            case "×":
                if (!containsVar(expr2.expr0, "k")) { //Σ(a,b,x+f(k)) = Σ(a,b,x)×Σ(a,b,f(k))
                    return simpMul(expr2.expr0, sum1);
                }
                if (!containsVar(expr2.expr1, "k")) {
                    return simpMul(expr2.expr1, sum0);
                }
                break;

            case "/":
                if (!containsVar(expr2.expr1, "k")) {
                    return simpDiv(sum0, expr2.expr1);
                }
        }
    }
    return newSum(expr0, expr1, expr2);
}

function simpProd(expr) {
    var [expr0, expr1, expr2] = [expr.expr0.expr0, expr.expr0.expr1, expr.expr1];
    expr2 = simplify(expr2);

    //If there's no k in the expression the product will be the expression to the power of the number of iterations
    if (!containsVar(expr2, "k")) {
        var diff = floor(Number(calc(simpAdd(expr1, exprNeg(expr0)))) + 1); //TODO: Do I really need all this conversion and flooring?
        if (diff < 0)
            diff = 0n;
        return simpPow(expr2, newNum(diff));
    }
    if (expr2.type === "binOp") {
        var prod0 = simpProd(newProd(expr0, expr1, expr2.expr0).expr);
        var prod1 = simpProd(newProd(expr0, expr1, expr2.expr1).expr);
        switch (expr2.op) {
            case "×":
                return simpMul(prod0, prod1); //Σ(a,b,f(k)+g(k)) = Σ(a,b,f(k))+Σ(a,b,g(k))
            case "/":
                return simpDiv(prod0, prod1); //Same for minus
        }
    }
    return newProd(expr0, expr1, expr2);
}


function exprNeg(expr) {
    return newMul(expr, newNum(-1));
}

function simplify(expr) {
    //try{
    switch (expr.type) {
        case "binOp":
            switch (expr.op) {
                case "+":
                    return simpAdd(expr.expr0, expr.expr1);
                case "-":
                    return simpAdd(expr.expr0, exprNeg(expr.expr1));
                case "×":
                    return simpMul(expr.expr0, expr.expr1);
                case "/":
                    return simpDiv(expr.expr0, expr.expr1);
                case "^":
                    return simpPow(expr.expr0, expr.expr1);
                case "=":
                    return simpEq(expr.expr0, expr.expr1);
                default:
                    expr.expr0 = simplify(expr.expr0);
                    expr.expr1 = simplify(expr.expr1);
                    return expr;
            }
        case "unOp":
            switch (expr.op) {
                case "√":
                    return simpPow(expr.expr, newFrac(newNum(1), newNum(2))); //√a=a^(1/2)
                case "∛":
                    return simpPow(expr.expr, newFrac(newNum(1), newNum(3))); //∛a=a^(1/3)
                case "∜":
                    return simpPow(expr.expr, newFrac(newNum(1), newNum(4))); //∜a=a^(1/4)
                default:
                    expr.expr = simplify(expr.expr);
                    return expr;
            }
        case "func":
            switch (expr.func) {
                case "Σ":
                    return simpSum(expr.expr);
                case "Π":
                    return simpProd(expr.expr);
            }
        /*case "num":
        if(expr.num <= 0)
            return newNum(0-expr.num.abs()); //Is this necessary?*/
        default:
            return expr;
    }
    /*}
    //Ugly way to deal with bad simplification but better than nothing
    catch(e){
        console.warn("The following error occured while trying to simplify " + exprToString(expr) + ":\n" + e.message + "\nThis doesn't mean the answer is wrong");
        return expr;
    }*/
}