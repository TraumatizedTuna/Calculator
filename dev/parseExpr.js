var parseParB = function(before, after, strOp){
    return parseExpr(after);
}

var parseUnOp = function(before, after, strOp){
    return {type: "unOp", op: strOp, expr: parseExpr(after)};
}

var parseBinOp = function(before, after, strOp){
    return {type: "binOp", op: strOp, expr0: parseExpr(before), expr1: parseExpr(after)};
}

var parseList = [
    [
        {from: ["⋎", "⊻"], to: parseBinOp}
    ],
    [
        {from: ["⋏"], to: parseBinOp}
    ],
    [
        {from: ["=", "≈"], to: parseBinOp}
    ],
    [
        {from: ["+", "-" ], to: parseBinOp}
    ],
    [
        {from: ["×", "/"], to: parseBinOp}
    ],
    [
        {from: ["^"], to: parseBinOp}
    ],
    [
        {from: ["sin", "cos", "tan", "abs", "√", "¬", "sum", "prod"], to: parseUnOp}
    ]
];

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
    for(var strInd = 0; strInd < str.length; strInd++){
        if($.isNumeric(str[0])){
            var i = 0;
            for(; $.isNumeric(str[strInd + i]) || str[strInd + i] == '.'; i++);
            strInd += i;
            return newNum(parseFloat(str.substr(strInd-i, i)));
        }
    }
    
    //str0 = str[0];
    //var constInd = constants.contains(str[0]);// indexOf($.trim(str0));
    var constInd = indOfBeg(constants, str);
    if(constInd != -1){
        return newConst(str.substr(0, constants[constInd].length));
    }
    
    return newNum(0);
}