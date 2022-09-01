import { CompositeCost, CustomCost, ExponentialCost, FirstFreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { parseBigNumber, BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "permutations_and_derangements";
var name = "Permutations & Derangements";
var description = "A theory about the possible arrangements and derangments of objects\n"+
                    "Permutations are the number of ways objects can be stored as a different sequence, in this case a 'very' long string of text\n"+
                    "Derangments are the number of ways all objects can be rearranged so that each object is not in its current position\n"+
                    "Note: in this theory every object is treated as individually different for derangment (only the number of object matters, the types and amount in each of them doesn't)\n"+
                    "";
var authors = "Gen (Gen#3006) - Idea\nXLII (XLII#0042) - Balancing";
var version = 1.0;
var releaseOrder = "1";

var rho_dot = BigNumber.ZERO;
var q1 = BigNumber.ZERO;
var q2 = BigNumber.ZERO;
var n = BigNumber.ZERO;
var t_cumulative = BigNumber.ZERO;
var updateObject_flag = false;

const costConst = 1.404;

var c1, A, B, C, D, t;
var c1Exp;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades
    
    //t
    {
        let getDesc = (level) => "\\dot{t}=" + getT(level).toString(1);
        let getInfo = (level) => "\\dot{t}=" + getT(level).toString(1);
        t = theory.createUpgrade(0, currency, new ExponentialCost(1e10, Math.log2(1e15)));
        t.getDescription = (amount) => Utils.getMath(getDesc(t.level));
        t.getInfo = (amount) => Utils.getMathTo(getInfo(t.level), getInfo(t.level + amount));
        t.maxLevel=4;
    }

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(0);
        let getInfo = (level) => "c_1=" + getC1(level).toString(0);
        c1 = theory.createUpgrade(1, currency, new FirstFreeCost(new ExponentialCost(20, 1.4)));
        c1.getDescription = (amount) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getInfo(c1.level), getInfo(c1.level + amount));
    }
    
    // A
    {
        let getDesc = (level) => "A=" + getA(level).toString(0);
        let getInfo = (level) => "A=" + getA(level).toString(0);
        A = theory.createUpgrade(2, currency, new ExponentialCost(1e3, Math.log2(2)));
        A.getDescription = (amount) => Utils.getMath(getDesc(A.level));
        A.getInfo = (amount) => Utils.getMathTo(getInfo(A.level), getInfo(A.level + amount));
        A.bought = (_) => updateObject_flag = true;
        
    }
    
    // B
    {
        let getDesc = (level) => "B=2^{" + level+"}-1";
        let getInfo = (level) => "B=" + getB(level).toString(0);
        B = theory.createUpgrade(3, currency, new ExponentialCost(2.5e4, costConst*Math.log2(2)));
        B.getDescription = (amount) => Utils.getMath(getDesc(B.level));
        B.getInfo = (amount) => Utils.getMathTo(getInfo(B.level), getInfo(B.level + amount));
        B.bought = (_) => updateObject_flag = true;
    }
    
    // C
    {
        let getDesc = (level) => "C=3^{" + level+"}-1";
        let getInfo = (level) => "C=" + getC(level).toString(0);
        C = theory.createUpgrade(4, currency, new ExponentialCost(2.5e5, costConst*Math.log2(2.995)));
        C.getDescription = (amount) => Utils.getMath(getDesc(C.level));
        C.getInfo = (amount) => Utils.getMathTo(getInfo(C.level), getInfo(C.level + amount));
        C.bought = (_) => updateObject_flag = true;
    }

    // D
    {
        let getDesc = (level) => "D=5^{" + level+"}-1";
        let getInfo = (level) => "D=" + getD(level).toString(0);
        D = theory.createUpgrade(5, currency, new ExponentialCost(2.5e7, costConst*Math.log2(4.97)));
        D.getDescription = (amount) => Utils.getMath(getDesc(D.level));
        D.getInfo = (amount) => Utils.getMathTo(getInfo(D.level), getInfo(D.level + amount));
        D.bought = (_) => updateObject_flag = true;
    }

    //c2
    {
        let getDesc = (level) => "c_2=2^{" + level+"}";
        let getInfo = (level) => "c_2=" + getC2(level).toString(0);
        c2 = theory.createUpgrade(6, currency, new ExponentialCost(1e100, 10*Math.log2(10)));
        c2.getDescription = (amount) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e8);
    theory.createBuyAllUpgrade(1, currency, 1e15);
    theory.createAutoBuyerUpgrade(2, currency, 1e25);

    /////////////////////
    // Checkpoint Upgrades
    theory.setMilestoneCost(new LinearCost(10,5));

    {
        c1Exp = theory.createMilestoneUpgrade(0, 4);
        c1Exp.description = Localization.getUpgradeIncCustomExpDesc("c_1", "0.015");
        c1Exp.info = Localization.getUpgradeIncCustomExpInfo("c_1", "0.015");
        c1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        CTerm = theory.createMilestoneUpgrade(1, 1);
        CTerm.description = Localization.getUpgradeAddTermDesc("C");
        CTerm.info = Localization.getUpgradeAddTermInfo("C");
        CTerm.canBeRefunded = (_) => (DTerm.level == 0);
        CTerm.boughtOrRefunded = (_) => {theory.invalidateSecondaryEquation(); updateAvailability(); };
    }

    {
        DTerm = theory.createMilestoneUpgrade(2, 1);
        DTerm.description = Localization.getUpgradeAddTermDesc("D");
        DTerm.info = Localization.getUpgradeAddTermInfo("D");
        DTerm.canBeRefunded = (_) => (c2Term.level == 0);
        DTerm.boughtOrRefunded = (_) => {theory.invalidateSecondaryEquation(); updateAvailability(); };
        DTerm.isAvailable = false;
    }

    {
        c2Term = theory.createMilestoneUpgrade(3, 1);
        c2Term.description = Localization.getUpgradeAddTermDesc("c_2");
        c2Term.info = Localization.getUpgradeAddTermInfo("c_2");
        c2Term.boughtOrRefunded = (_) => {theory.invalidatePrimaryEquation(); updateAvailability(); };
        c2Term.isAvailable = false;

    }

    updateAvailability();
}

var updateAvailability = () => {
    DTerm.isAvailable = CTerm.level > 0;
    c2Term.isAvailable = DTerm.level > 0;
    C.isAvailable = CTerm.level > 0
    D.isAvailable = DTerm.level > 0;
    c2.isAvailable = c2Term.level > 0;
    updateObject_flag = true;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime*multiplier); 
    let bonus = theory.publicationMultiplier; 
    let vc1 = getC1(c1.level).pow(getC1Exp(c1Exp.level));
    let vc2 = (c2Term.level > 0) ? getC2(c2.level) : BigNumber.ONE;
    let vt = getT(t.level);
    t_cumulative += vt * dt;
    
    if (updateObject_flag) {        
        let vA = getA(A.level);
        let vB = getB(B.level);
        let vC = (CTerm.level > 0) ? getC(C.level) : BigNumber.ZERO;
        let vD = (DTerm.level > 0) ? getD(D.level) : BigNumber.ZERO;
        n = vA+vB+vC+vD;

        q1 = getQ1(n);
        q2 = getQ2(n,vA,vB,vC,vD);
        
        updateObject_flag = false;
    }

    rho_dot = t_cumulative * vc1 * vc2 * (1 + (BigNumber.ONE + q1) / (BigNumber.ONE + q2)).log() * dt;

    currency.value += bonus * rho_dot;

    theory.invalidateTertiaryEquation();
}

var getInternalState = () => `${q1} ${q2} ${t_cumulative}`;

var setInternalState = (state) => {
    let values = state.split(" ");
    if (values.length > 0) q1 = parseBigNumber(values[0]);
    if (values.length > 1) q2 = parseBigNumber(values[1]);
    if (values.length > 2) t_cumulative = parseBigNumber(values[2]);
    updateObject_flag = true;
}

var postPublish = () => {
    q1 = BigNumber.ZERO;
    q2 = BigNumber.ZERO;
    updateObject_flag = true;
    t_cumulative = BigNumber.ZERO;
}

var getPrimaryEquation = () => {
    theory.primaryEquationHeight = 30;
    let result = "\\begin{matrix}";
    result += "\\dot{\\rho}=c_1";
    if (c1Exp.level > 0) result += `^{${1+c1Exp.level*0.015}}`;
    if (c2.isAvailable) result +="c_2"
    result += "t"
    result += "\\ln(1+\\frac{1+q_1}{1+q_2})";
    result += "\\end{matrix}";
    return result;
}

var getSecondaryEquation = () => {
    theory.secondaryEquationHeight = 100;
    let result = "q_1 = n! \\sum_{k=0}^{n}(-1)^k {\\frac{1}{k!}}";
    result += "\\\\q_2 = n!/(A!B!";
    if(C.isAvailable) result +="C!"
    if(D.isAvailable) result +="D!"
    result +=")";
    result+= "\\\\" + theory.latexSymbol + "=\\max\\rho^{0.1}"
    return result;
}

var getTertiaryEquation = () => {
    let result = "";
    result += "\\begin{matrix}q_1 =";
    result += q1.toString();
    result += ",&q_2 ="+ q2.toString();
    result += ",&n ="
    result += n.toString();
    result += ",&t ="
    result += t_cumulative.toString();
    result += ",&\\dot{\\rho} ="
    result += rho_dot.toString();
    result += "\\end{matrix}";

    return result;
}

//for small num normal factorial
//for big num use of Stirlings approximation
var factorial = (num) => {
    if (num.isZero) return BigNumber.ONE;
    if(num < BigNumber.HUNDRED){
        let temp = BigNumber.ONE;
        for(let i = BigNumber.ONE; i<=num; i+=BigNumber.ONE){
            temp *= i;
        }
        return temp;
    }
    return (BigNumber.TWO * BigNumber.PI * num).sqrt() * (num/BigNumber.E).pow(num);
}

//Maclaurin expansion of e^-x up to itr terems
var mac_e_x = (itr) => {
    let num = BigNumber.ZERO;
    for (let a = BigNumber.ZERO; a <= itr; a+=BigNumber.ONE) {
        let sign = -BigNumber.ONE;
        if(a%2==0) sign = BigNumber.ONE;
        num += sign/factorial(a);
    } 
    return num;
}

//Derangment = n!*M(e^(-n))
//for large n n!/e^n
//part 2 either *Maclaurin expansion or /e^x 
var getQ1 = (num_Obj) => {
    if (num_Obj.isZero || num_Obj == BigNumber.ONE) return BigNumber.ZERO;

    let part1 = factorial(num_Obj);
    if(num_Obj < BigNumber.FIVE*BigNumber.TEN) {
        let part2 = mac_e_x(num_Obj);
        return part1 * part2
    }
    let part2 = BigNumber.E.pow(num_Obj)
    return part1/part2; 
}

//Permutations https://www.desmos.com/calculator/k3qpjcmw5c
//n!/(A!*B!*C!*D!)
var getQ2 = (vn,vA,vB,vC,vD) => {
    let temp = bigObject(vn,vA,vB,vC,vD);
    if(temp != -1){
        let objs = [vA,vB,vC,vD];
        objs.splice(temp,1);
        return BigNumber.TEN.pow((objs[0]+objs[1]+objs[2])*vn.log10());
    }else{
        return factorial(vn)/(factorial(vA)*factorial(vB)*factorial(vC)*factorial(vD));
    }
}

var bigObject = (vn, vA,vB,vC,vD) => {
    if(vA>1 && vn/vA <= 1.00000001){
        return 0;
    }else if(vB>1 && vn/vB <= 1.00000001){
        return 1;
    }else if(vC>1 && vn/vC <= 1.00000001){
        return 2;
    }else if(vD>1 && vn/vD <= 1.00000001){
        return 3;
    }
    return -1;
}


var getPublicationMultiplier = (tau) => tau.isZero ? BigNumber.ONE : tau;
var getPublicationMultiplierFormula = (symbol) => "{" + symbol + "}";
var getTau = () => currency.value.pow(BigNumber.from(0.1));
var getCurrencyFromTau = (tau) => [tau.max(BigNumber.ONE).pow(10), currency.symbol];
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getT = (level) => BigNumber.from(0.2 + level * 0.2);
var getC1 = (level) => Utils.getStepwisePowerSum(level, 4, 10, 0);
var getA = (level) => BigNumber.from(level);
var getB = (level) => BigNumber.TWO.pow(level) - BigNumber.ONE;
var getC = (level) => BigNumber.THREE.pow(level) - BigNumber.ONE;
var getD = (level) => BigNumber.FIVE.pow(level) - BigNumber.ONE;
var getC2 = (level) => BigNumber.TWO.pow(level);
var getC1Exp = (level) => BigNumber.from(1 + level * 0.015);

init();