function calc(expr){
    var number;
    switch(expr.type){
        case "binOp":
            switch(expr.op){
                case "+":
                    number = add(calc(expr.expr0), calc(expr.expr1));
                    break;
                case "-":
                    number = sub(calc(expr.expr0), calc(expr.expr1));
                    break;
                case "×":
                    number = mul(calc(expr.expr0), calc(expr.expr1));
                    break;
                case "/":
                    number = div(calc(expr.expr0), calc(expr.expr1));
                    break;
                case "^":
                    number = pow(calc(expr.expr0), calc(expr.expr1));
                    break;
                case "=":
                    number = eq(calc(expr.expr0), calc(expr.expr1));
                    break;
                case "≈":
                    number = aprEq(calc(expr.expr0), calc(expr.expr1));
                    break;
                case "⋏":
                    number = and(calc(expr.expr0), calc(expr.expr1));
                    break;
                case "⋎":
                    number = or(calc(expr.expr0), calc(expr.expr1));
                    break;
                case "⊻":
                    number = xor(calc(expr.expr0), calc(expr.expr1));
                    break;
                default:
                    number = Infinity;
                    break;
            }
            break;
        case "unOp":
            switch(expr.op){
                case "sin":
                    number = sin(calc(expr.expr));
                    break;
                case "√":
                    number = sqrt(calc(expr.expr));
                    break;
                case "¬":
                    number = not(calc(expr.expr));
                    break;
                default:
                    number = calc(expr.expr);
                    break;
            }
            break;
        default:
            number = expr.num;
            break;
    }
    return number;
}

function add(term0, term1){
    return term0 + term1;
}

function sub(term0, term1){
    return term0 - term1;
}

function mul(fac0, fac1){
    return fac0 * fac1;
}

function div(num, den){
    return num / den;
}

var pow = Math.pow;

var abs = Math.abs;

var sin = Math.sin;

var sqrt = Math.sqrt;



function and(a, b){
    if(a >= 1 && b >= 1)
        return 1;
    return 0;
}

function or(a, b){
    if(a >= 1 || b >= 1)
        return 1;
    return 0;
}

function xor(a, b){
    if(or(a, b) && !and(a, b))
        return 1;
    return 0;
}

function not(a){
    if(a >= 1)
        return 0;
    return 1;
}

function eq(a, b){
    if(a == b)
        return 1;
    return 0;
}

function aprEq(a, b){
    if(abs(sub(div(a, b), 1)) < 0.001)
        return 1;
    return 0;
}


function mod(a, b){
    return a % b;
}

function gcd(a, b){
    if(b == 0)
        return a;
    return gcd(b, mod(a, b));
}