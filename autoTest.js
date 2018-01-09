function getSimpFail(maxIts = Infinity) {
    for (var i = 0; i < maxIts; i++) {
        var expr = arbExpr();
        var simp = simplify(expr);
        if (!aprEq(calc(expr), calc(simp))) {
            return expr;
        }
    }
    return newNum(-1);
}

function getErr(maxIts = Infinity) {
    for (var i = 0; i < maxIts; i++) {
        var expr = undefined;
        var str = "";
        try {
            expr = arbExpr();
            str = exprToString(expr);
            expr = simplify(expr);
            str += ' = ' + exprToString(expr);
            str += ' = ' + calc(expr);
        }
        catch (e) {
            //console.log(str);
            return expr;
        }
        //console.log(str);
    }
    return newNum(-1);
}

function getMinErr(maxIts = Infinity) {
    return minForErr(getErr(maxIts));
}

function minForErr(expr) {
    while (true) {
        switch (expr.type) {
            case "num":
                return expr;

            case "unOp":
                if (calcErr(expr.expr)) {
                    expr = expr.expr;
                    break;
                }
                else
                    return minForErrPar(expr, 'expr');

            case "binOp":
                //If first expression gives error, narrow down to it
                if (calcErr(expr.expr0)) {
                    expr = expr.expr0;
                    break;
                }
                else if (calcErr(expr.expr1)) {
                    expr = expr.expr1;
                    break;
                }
                //If neither gives error, just keep expr as it is
                else {
                    expr.expr0 = minForErrPar(expr, 'expr0');
                    expr.expr1 = minForErrPar(expr, 'expr1');
                    return expr;
                }
        }

        console.warn("Don't think this should happen");
        return expr;
    }
}
function minForErrPar(parent, key) {
    var fakePar = $.extend(true, {}, parent);
    while (eval('fakePar.' + key)) {
        var newFake = $.extend(true, {}, fakePar);

        //Try replacing the expression at key with a simple number
        for (var i = 2; i >= -2; i--) {
            eval('newFake.' + key + ' = newNum(' + i + ')');
            if (calcErr(newFake)) {
                return newFake;
            }
        }
        switch (eval('fakePar.' + key + '.type')) {
            case "num":
                return fakePar;

            case "unOp":
                var newFake = $.extend(true, {}, fakePar);
                eval('newFake.' + key + ' = fakePar.' + key + '.expr');
                if (calcErr(newFake)) {
                    fakePar = newFake;
                    break;
                }
                else {
                    key += '.expr'
                    break;
                }

            case "binOp":
                var newFake = $.extend(true, {}, fakePar);
                eval('newFake.' + key + ' = fakePar.' + key + '.expr0');
                if (calcErr(newFake)) {
                    fakePar = newFake;
                    break;
                }

                eval('newFake.' + key + ' = fakePar.' + key + '.expr1');
                if (calcErr(newFake)) {
                    fakePar = newFake;
                    break;
                }

                //If neither gives error, try to simplify expr0 and expr1
                else {
                    var newAtKey = eval('fakePar.'+key);
                    newAtKey.expr0 = minForErrPar(fakePar, key +'.expr0');
                    newAtKey.expr1 = minForErrPar(fakePar, key+'.expr1');

                    eval('fakePar.'+key+' = newAtKey');
                }
        }
    }
    
    return fakePar;
}

function calcErr(expr) {
    try {
        calc(expr);
        return false;
    }
    catch (e) {
        return true;
    }
}

function shallowClone(obj) {
    var clone = {};
    for (var i in obj) {
        clone[i] = obj[i];
    }
    return clone;
}