function begins(needle, haystack){
    return needle == haystack.substr(0, needle.length);
}

function indOfBeg(haystack, needle){
    for(var i = 0; i < haystack.length; i++){
        if(begins(needle, haystack[i]))
            return i;
    }
    return -1;
}

function skipPars(str, startInd, forw){
    if(forw){
        var inc = 1;
        var par0 = '(';
        var par1 = ')';
        //var endInd = str.length;
    }
    else{
        var inc = -1;
        var par0 = ')';
        var par1 = '(';
        //var endInd = -1;
    }
    var parLvl = 0;
    if(str[startInd] == par0){
        parLvl++;
        startInd += inc;
        do{
            if(str[startInd] == par0)
                parLvl++;
            else if(str[startInd] == par1)
                parLvl--;
            startInd += inc;
        }while(parLvl > 0 && startInd < str.length && startInd >= 0);
    }
    if(parLvl != 0){
        err("Unbalanced parentheses")
    }
    return startInd;
}