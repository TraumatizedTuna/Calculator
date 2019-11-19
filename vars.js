var constants = ["π", "e", "i", "∞", "🎲"];

var variables = ["x", "y", "k"];

var strRepl = [
    {from: ["\n"], to: ""},
    {from: ["*", "times"], to: "×"},
    {from: ["sqrt", "squareroot", "rt", "root"], to: "√"},
    {from: ["curt", "crt", "cuberoot", "thrt", "thirdroot"], to: "∛"},
    {from: ["tert", "tesseractroot", "frt", "fourthroot"], to: "∜"},
    {from: ["pi"], to: "π"},
    {from: ["infinity", "inf"], to: "∞"},
    {from: ["sine"], to: "sin"},
    {from: ["cosine"], to: "cos"},
    {from: ["tangent"], to: "tan"},
    {from: ["arc"], to: "a"},
    {from: ["and", "&&", "⋏&", "&"], to: "⋏"},
    {from: ["or", "||"], to: "⋎"},
    {from: ["xor"], to: "⊻"},
    {from: ["not"], to: "¬"},
    {from: ["sign"], to: "sgn"},
    {from: ["floor(", "floor", "trunc(", "trunc"], to: "⌊"},
    {from: ["endfloor", "efl"], to: "⌋"},
    {from: ["ceiling(", "ceiling", "ceil(", "ceil"], to: "⌈"},
    {from: ["endceil", "ecl"], to: "⌉"},
    {from: ["!!"], to: "‼"},
    {from: ["sum", "sigma"], to: "Σ"},
    {from: ["product", "prod"], to: "Π"},
    {from: ["~"], to: "≈"},
    {from: ["<_", "=<", "<⋎=", "=⋎<"], to: "≤"},
    {from: [">_", ">=", ">⋎=", "=⋎>"], to: "≥"},
    { from: ["random", "rand"], to: "🎲" }
    //{ from: ["date"], to: "📅"},
    //{from: ["§§"], to: "½½½½½½"}
];


var parseList = [
    [
        {from: [","], to: parseBinOp}
    ],
    [
        {from: ["⋎", "⊻"], to: parseBinOp}
    ],
    [
        {from: ["⋏"], to: parseBinOp}
    ],
    [
        {from: ["=", "≈", "<", ">", "≤", "≥"], to: parseBinOp}
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
        {from: ["asin", "acos", "atan"], to: parseUnOp} //TODO: Arc functions shouldn't have their own list
    ],
    [
        {from: ["Σ", "Π", "lgn", "P", "C"], to: parseFunc}
    ],
    [
        {from: ["sin", "cos", "tan", "ln", "lg", "abs", "√", "∛", "∜", "¬", "sgn", "⌊", "⌈", "round", "!", "‼", "years", "months", "weeks", "days", "hours", "minutes", "seconds", "getSimpFail"], to: parseUnOp}
    ]
];


var x = "x";
var y = "y";
var k = "k";