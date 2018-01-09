function arbExpr(types = ["num", "unOp", "binOp"]){
    var type = randEl(types);
    switch(type){
        case "num":
            return arbNum();
        case "unOp":
            return arbUnOp(types);
        case "binOp":
            return arbBinOp(types);
    }
}

function arbNum(){
    var numStr = '';
    do{
        numStr += Math.floor(Math.random() * 10);
    }while(Math.random() > 0.4);
    
    if(Math.random() > 0.5){
        numStr = '-' + numStr;
    }
    
    return newNum(numStr);
}

function arbUnOp(types = ["num", "unOp", "binOp"]){
    var op = randEl(["asin", "acos", "atan", "sin", "cos", "tan", "ln", "lg", "abs", "√", "∛", "∜", "¬", "sgn", "⌊", "⌈", "round", "!", "‼"]);
    return {type: "unOp", op: op, expr: arbExpr(types)};
}

function arbBinOp(types = ["num", "unOp", "binOp"]){
    var op = randEl(["⋎", "⊻", "⋏", "=", "≈", "<", ">", "≤", "≥", "+", "-", "×", "/", "^"]);
    return {type: "binOp", op: op, expr0: arbExpr(types), expr1: arbExpr(types)};
}


function randEl(list){
    return list[Math.floor(Math.random() * list.length)];
}