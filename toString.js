var decFracs = false;
function toggleDecFracs() {
    decFracs = !decFracs;
    $(".cbDecFracs").toggleClass("cbInactive");
    parseAndCalc();
}
function exprToString(expr, pref, suf) {
    // In case you don't want any separators
    if (suf == undefined) {
        suf = "";
        if (pref == undefined) {
            pref = "";
        }
    }
    switch (expr.type) {
        case "num":
            return pref + biToStr(expr.num) + suf;
        case "unOp":
            return pref + expr.op + exprToString(expr.expr, pref, suf) + suf;
        case "binOp":
            switch (expr.op) {
                case "/":
                    if (decFracs && expr.expr0.type == "num" && expr.expr1.type == "num")
                        return pref + shortenFrac(expr) + suf;
                case "^":
                    var strExp = exprToString(expr.expr1);
                    switch (strExp) {
                        case "(1/2)":
                            return pref + "√" + exprToString(expr.expr0) + suf;
                        case "(1/3)":
                            return pref + "∛" + exprToString(expr.expr0) + suf;
                        case "(1/4)":
                            return pref + "∜" + exprToString(expr.expr0) + suf;
                    }
                default:
                    return pref + "(" + exprToString(expr.expr0) + expr.op + exprToString(expr.expr1) + ")" + suf;
            }
        case "func":
            var argList = tupleToList(expr.expr);
            var argStr = exprToString(argList[0]);
            for (var i = 1; i < argList.length; i++) {
                argStr += ',' + exprToString(argList[i]);
            }
            return pref + expr.func + "(" + argStr + ")" + suf;
        case "var":
            return expr.var;
    }
}

function shortenFrac(expr) {
    var numStr = biToStr(expr.expr0.num);
    var denStr = biToStr(expr.expr1.num);
    if (numStr[numStr.length - 1] == "0") {
        [numStr, denStr] = zerosVsPointPos(numStr, denStr);
    }
    else {
        [denStr, numStr] = zerosVsPointPos(denStr, numStr);
    }
    return '(' + numStr + '/' + denStr + ')';
}

function zerosVsPointPos(zeroStr, pointStr) {
    var i;
    var lim = Math.min(zeroStr.length, pointStr.length);
    for (i = 1; zeroStr[zeroStr.length - i] == '0' && i < lim; i++);
    zeroStr = zeroStr.substr(0, zeroStr.length + 1 - i);
    var pointPos = pointStr.length + 1 - i;
    if (i > 1)
        pointStr = pointStr.substr(0, pointPos) + '.' + pointStr.substr(pointPos);
    return [zeroStr, pointStr];
}

function biToStr(num) {
    var arithStr = '' + num;
    var fromToStr = num.toString();
    if (arithStr !== 'Infinity') {
        var arithBI = BigInt(arithStr);
        //arithStr = arithStr.replace('e+', 'e');

        if (arithBI == num) {
            return arithStr;
        }
        else {
            var diff = arithBI.subtract(num);

            var arithMinDiffStr = '(' + arithStr + '-' + biToStr(diff) + ')';
            if (arithMinDiffStr.length < fromToStr.length)
                return arithMinDiffStr;
        }
    }
    return fromToStr;
}


function tupleToList(expr) {
    if (expr.op == ",") {
        var list = tupleToList(expr.expr0);
        list.push(expr.expr1);
        return list;
    }
    return [expr];
}