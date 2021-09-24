function calc(expr) {
    switch (expr.type) {
        case "binOp":
            switch (expr.op) {
                case "+":
                    return add(calc(expr.expr0), calc(expr.expr1));
                case "-":
                    return sub(calc(expr.expr0), calc(expr.expr1));
                case "×":
                    return mul(calc(expr.expr0), calc(expr.expr1));
                case "/":
                    return div(calc(expr.expr0), calc(expr.expr1));
                case "^":
                    return pow(calc(expr.expr0), calc(expr.expr1));
                case "=":
                    return eq(calc(expr.expr0), calc(expr.expr1));
                case "≈":
                    return aprEq(calc(expr.expr0), calc(expr.expr1));
                case "<":
                    return less(calc(expr.expr0), calc(expr.expr1));
                case ">":
                    return greater(calc(expr.expr0), calc(expr.expr1));
                case "≤":
                    return lessOrEq(calc(expr.expr0), calc(expr.expr1));
                case "≥":
                    return greaterOrEq(calc(expr.expr0), calc(expr.expr1));
                case "⋏":
                    return and(calc(expr.expr0), calc(expr.expr1));
                case "⋎":
                    return or(calc(expr.expr0), calc(expr.expr1));
                case "⊻":
                    return xor(calc(expr.expr0), calc(expr.expr1));
                case ",":
                    return arr(calc(expr.expr0), calc(expr.expr1));
                default:
                    failed = true;
                    err("Invalid operator")
                    return Infinity;
            }
        case "unOp":
            var val = Number(calc(expr.expr));
            switch (expr.op) {
                case "sin":
                    return sin(val);
                case "cos":
                    return cos(val);
                case "tan":
                    return tan(val);
                case "asin":
                    return asin(val);
                case "acos":
                    return acos(val);
                case "atan":
                    return atan(val);
                case "ln":
                    return ln(val);
                case "lg":
                    return lg(val);

                case "abs":
                    return abs(val);
                case "⌊":
                    return floor(val);
                case "⌈":
                    return ceil(val);
                case "round":
                    return round(val);
                case "√":
                    return sqrt(val);
                case "∛":
                    return pow(val, 1 / 3);
                case "∜":
                    return pow(val, 1 / 4);
                case "¬":
                    return not(val);
                case "sgn":
                    return sgn(val);
                case "!":
                    return factorial(val); //TODO: BigInt
                case "‼":
                    return semifactorial(val);
                case "years":
                    return years(val);
                case "weeks":
                    return weeks(val);
                case "days":
                    return days(val);
                case "hours":
                    return hours(val);
                case "minutes":
                    return minutes(val);
                case "seconds":
                    return seconds(val);
                default:
                    return calc(expr.expr);
            }
        case "func":
            switch (expr.func) {
                case "Σ":
                    return seq(expr.expr, add);
                case "Π":
                    return seq(expr.expr, mul);
                case "lgn":
                    return lgn(calc(expr.expr.expr0), calc(expr.expr.expr1));
                case "P":
                    return permutations(calc(expr.expr.expr0), calc(expr.expr.expr1));
                case "C":
                    return combinations(calc(expr.expr.expr0), calc(expr.expr.expr1));
            }
        case "var":
            return k; //TODO: x and y
        default:
            return expr.num;
    }
}

function add(term0, term1) {
    if (typeof term0 !== typeof term1)
        return Number(term0) + Number(term1);
    return term0 + term1;
}

function sub(term0, term1) {
    if (typeof term0 !== typeof term1)
        return Number(term0) - Number(term1);
    return term0 - term1;
}

function mul(fac0, fac1) {
    if (fac0 == 0 || fac1 == 0)
        return 0;
    if (typeof fac0 !== typeof fac1)
        return Number(fac0) * Number(fac1);
    return fac0 * fac1;
}

function div(num, den) {
    return Number(num) / Number(den);
}


function pow(base, exponent) {
    if (typeof base !== typeof exponent)
        return Number(base) ** Number(exponent);
    return base ** exponent;
}

var abs = Math.abs;

var sin = Math.sin;

var cos = Math.cos;

var tan = Math.tan;

var asin = Math.asin;

var acos = Math.acos;

var atan = Math.atan;

var sqrt = Math.sqrt;

var ln = Math.log;

var lg = Math.log10;

var floor = Math.floor;

var ceil = Math.ceil;

var round = Math.round;

function lgn(base, arg) {
    return Math.log(arg) / Math.log(base);
}


function factorial(a) {
    var ans = 1;
    for (; a > 1; a--) {
        ans *= a;
    }
    return ans;
}

function semifactorial(a) {
    var ans = 1;
    for (; a > 1; a -= 2) {
        ans *= a;
    }
    return ans;
}

function permutations(n, r) {
    return div(factorial(n), factorial(sub(n, r)));
}

function combinations(n, r) {
    return div(permutations(n, r), factorial(r));
}

function and(a, b) {
    if (a >= 1 && b >= 1)
        return 1;
    return 0;
}

function or(a, b) {
    if (a >= 1 || b >= 1)
        return 1;
    return 0;
}

function xor(a, b) {
    if (or(a, b) && !and(a, b))
        return 1;
    return 0;
}

function not(a) {
    if (a >= 1)
        return 0;
    return 1;
}

function eq(a, b) {
    if (a == b || (a.value == b.value && a.value !== undefined))
        return 1;
    return 0;
}

function less(a, b) {
    if (a < b)
        return 1;
    return 0;
}

function greater(a, b) {
    if (a > b)
        return 1;
    return 0;
}

function lessOrEq(a, b) {
    return 1 - greater(a, b);
}

function greaterOrEq(a, b) {
    return 1 - less(a, b);
}

function compare(a, b) {
    if (less(a, b))
        return -1;
    return greater(a, b);
}

function sgn(a) {
    return compare(a, 0);
}

function aprEq(a, b) {
    if (a == b || abs(sub(div(a, b), 1)) < 0.001) //Equality check for infinite numbers
        return 1;
    return 0;
}


function mod(a, b) {
    return a % b;
}

function gcd(a, b) {
    if (b == 0)
        return a;
    return gcd(b, mod(a, b));
}


function years(a) {
    return a / 31557600000;
}

function weeks(a) {
    return a / 604800000;
}

function days(a) {
    return a / 86400000;
}

function hours(a) {
    return a / 3600000;
}

function minutes(a) {
    return a / 60000;
}

function seconds(a) {
    return a / 1000;
}

function arr(a, b) {
    return [a, b];
}

function seq(expr, op) {
    var e0 = expr.expr0;
    var kMax = calc(e0.expr1);
    var ans = id(op);
    for (k = calc(e0.expr0); k <= kMax; k = add(k, 1)) {
        ans = op(ans, calc(expr.expr1));
    }
    k = "k";
    return ans;
}

function id(op) {
    switch (op) {
        case add:
            return 0;
        default:
            return 1;
    }
}