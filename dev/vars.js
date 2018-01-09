var constants = ["𝜋", "e", "i", "∞", "🎲"];

var strRepl = [
    {from: [" ", "\n"], to: ""},
    {from: ["*", "times"], to: "×"},
    {from: ["sqrt", "squareroot", "rt", "root"], to: "√"},
    {from: ["curt", "crt", "cuberoot", "thrt", "thirdroot"], to: "∛"},
    {from: ["tert", "tesseractroot", "frt", "fourthroot"], to: "∜"},
    {from: ["pi"], to: "𝜋"},
    {from: ["infinity", "inf"], to: "∞"},
    {from: ["sine"], to: "sin"},
    {from: ["cosine"], to: "cos"},
    {from: ["tangent"], to: "tan"},
    {from: ["arc"], to: "a"},
    {from: ["and", "&&", "⋏&", "&"], to: "⋏"},
    {from: ["or", "||"], to: "⋎"},
    {from: ["xor"], to: "⊻"},
    {from: ["not"], to: "¬"},
    {from: ["sum", "sigma"], to: "∑"},
    {from: ["product", "prod"], to: "∏"},
    {from: ["~"], to: "≈"},
    {from: ["random", "rand"], to: "🎲"},
];