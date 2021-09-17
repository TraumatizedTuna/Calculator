const bigMath = {
    abs(a) {
        return a < 0n ? -a : a;
    },
    gcd(a,b){
        if (b) {
            return bigMath.gcd(b, a % b);
        } else {
            return bigMath.abs(a);
        }
    }
}