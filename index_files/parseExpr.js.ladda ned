var parseParB = function(before, after, strOp){
    return parseExpr(after);
};

var parseUnOp = function(before, after, strOp){
    return {type: "unOp", op: strOp, expr: parseExpr(after)};
};

var parseBinOp = function(before, after, strOp){
    if(before == "")
        before = "0";
    return {type: "binOp", op: strOp, expr0: parseExpr(before), expr1: parseExpr(after)};
};

var parseFunc = function(before, after, strOp){
    return {type: "func", func: strOp, expr: parseExpr(after)};
};

function parseBigNum(strNum){
    var dotInd = strNum.indexOf(".");
    if(dotInd == -1){
        return newNum(bigInt(strNum));
    }
    strNum = strNum.split(".").join("");
    return newFrac(newNum(bigInt(strNum)), newNum(bigInt(pow(bigInt(10), bigInt(strNum.length - dotInd))))); //TODO: Fix pow to return a bigInt
}

function parseExpr(str){
    var lastPar = skipPars(str, 0, true);
    if(lastPar == str.length){
        return parseExpr(str.substring(1, str.length-1));
    }

    
    //for(var oooInd = parseList.length-1; oooInd >= 0; oooInd--){
    for(var oooInd = 0; oooInd < parseList.length; oooInd++){
        for(var strInd = str.length - 1; strInd >= 0; strInd--){
            strInd = skipPars(str, strInd, false);
            for(var opTypeInd = 0; opTypeInd < parseList[oooInd].length; opTypeInd++){
                var currOpType = parseList[oooInd][opTypeInd];
                for(var opInd = 0; opInd < currOpType.from.length; opInd++){
                    var currOp = currOpType.from[opInd];
                    if(begins(currOp, str.substr(strInd))){
                        var before = str.substr(0, strInd);
                        var after = str.substr(strInd + currOp.length);
                        return currOpType.to(before, after, currOp);
                    }
                }
            }
        }
    }

    //Parse numbers
    for(var strInd = 0; strInd < str.length; strInd++){ // This loop should be totally useless, right?
        if($.isNumeric(str[0]) || str[0] == '-'){ // Why isn't '-' parsed? :( Aaah, the operator parser finds it first :'(
            var i = 1;
            for(; $.isNumeric(str[strInd + i]) || str[strInd + i] == '.'; i++);
            strInd += i;
            return parseBigNum(str.substr(strInd-i, i));
        }
    }
    
    //str0 = str[0];
    //var constInd = constants.contains(str[0]);// indexOf($.trim(str0));
    var constInd = indOfBeg(constants, str);
    if(constInd != -1){
        return newConst(constants[constInd]);
    }
    
    var varInd = indOfBeg(variables, str);
    if(varInd != -1){
        return newVar(variables[varInd]);
    }
    
    return newNum(0);
}