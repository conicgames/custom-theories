import { CompositeCost, CustomCost, ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { QuaternaryEntry, theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "derivative_equation_s04";
var name = "Derivative Equation (S04)";
var description = "Derivative Equation --\n\
\n\
x grows continuously over time,\n\
approaching a limit.\n\
\n\
Purchase upgrades to accelerate ρ production,\n\
at the cost of resetting x.\n\
\n\
Optimize actively or progress passively?\n\
Try to decide it on your own.\
";
var authors = "skyhigh173";
var version = 15;
var releaseOrder = "10";

// currency
var rho;
var dotrho = BigNumber.ZERO;

// upgrades
var n,a0,a1,a2,m;

var x = BigNumber.ZERO;
var t = BigNumber.ZERO;
var q = BigNumber.ONE;
var maxt = BigNumber.ZERO;
var maxX, maxXPermCap;

// runtime var
var terms = [];

// milestone
var extraCap, nExp, unlockA, a0Exp, qTerm;

// secret
var resetCount = 0;

// func
var getA0 = (level=a0.level) => Utils.getStepwisePowerSum(level, 2.2, 5, 0);
var getA1 = (level=a1.level) => Utils.getStepwisePowerSum(level, 3, 7, 0);
var getA2 = (level=a2.level) => unlockA.level <= 0 ? BigNumber.ZERO : Utils.getStepwisePowerSum(level, 1.5, 11, 0) / BigNumber.TEN;

var getN = (level=n.level) => BigNumber.TWO.pow(level * 0.3);
var getM = (level=m.level) => BigNumber.TWO.pow(level - 256);
var getNExp = () => BigNumber.from(1.2 - 0.6 * nExp.level);

var getCapX = (level=maxX.level) => BigNumber.from(1024) * getExtraCapX().pow(level);
var getExtraCapX = () => extraCap.level >= 10 ? BigNumber.from(19.5 + extraCap.level/2) : (extraCap.level >= 6 ? BigNumber.from(15 + extraCap.level): BigNumber.from(5 + extraCap.level * 3));

var isCappedX = () => x >= getCapX();
var isMaxRhoOver = (over) => theory.tau >= BigNumber.from(over).pow(0.4);

var get2DGraphValue = () => rho.value.sign * (BigNumber.ONE + rho.value.abs()).log10().toNumber();
var getPublicationMultiplier = (tau) => tau.pow(0.4) / BigNumber.FOUR;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.4}}{4}";
var getTau = () => rho.value.pow(BigNumber.from(0.4));
var getCurrencyFromTau = (tau) => [tau.pow(2.5), rho.symbol];

var variablePurchased = () => {
  x = BigNumber.ZERO;
  t = BigNumber.ZERO;
}

var postPublish = () => {
  variablePurchased();
  q = BigNumber.ONE;
}

var prePublish = () => {
  resetCount = 0;
}

var getInternalState = () => {
  return `${x.toBase64String()} ${t.toBase64String()} ${q.toBase64String()}`;
}

var setInternalState = (state) => {
  state = state.split(" ");
  x = BigNumber.fromBase64String(state[0]);
  t = BigNumber.fromBase64String(state[1]);
  q = BigNumber.fromBase64String(state[2]);
}

var updateAvailability = () => {
  unlockA.isAvailable = isMaxRhoOver(1e80);
  a0Exp.isAvailable = isMaxRhoOver(1e150);
  qTerm.isAvailable = isMaxRhoOver(1e200);
  a2.isAvailable = unlockA.level > 0;
  m.isAvailable = qTerm.level > 0;
  extraCap.maxLevel = 6 + maxXPermCap.level;
  maxXPermCap.isAvailable = pubUpg.level > 0;
}

var init = () => {
  rho = theory.createCurrency();

  // n
  {
    let getInfo = (level) => "n = " + getN(level).toString(2);
    let getDesc = (level) => `n = 2^{${BigNumber.from(0.3 * level).toString(1)}}`
    n = theory.createUpgrade(0, rho, new ExponentialCost(200, Math.log2(2.2)));
    n.getDescription = (_) => Utils.getMath(getDesc(n.level));
    n.getInfo = (amount) => Utils.getMathTo(getInfo(n.level), getInfo(n.level + amount));
    n.boughtOrRefunded = (_) => variablePurchased();
  }
  // m
  {
    let getInfo = (level) => "m = " + (level < 256 ? "1/" + BigNumber.TWO.pow(256-level).toString(2): getM(level).toString(2));
    let getDesc = (level) => `m = 2^{${level-256}}`
    m = theory.createUpgrade(1, rho, new ExponentialCost(1e200, Math.log2(1000)));
    m.getDescription = (_) => Utils.getMath(getDesc(m.level));
    m.getInfo = (amount) => Utils.getMathTo(getInfo(m.level), getInfo(m.level + amount));
    m.boughtOrRefunded = (_) => { variablePurchased(); q = BigNumber.ONE; }
  }
  // a0
  {
    let getDesc = (level) => "a_0 = " + getA0(level).toString(0);
    a0 = theory.createUpgrade(10, rho, new CompositeCost(4378, new FirstFreeCost(new ExponentialCost(3, Math.log2(1.4))), new ExponentialCost(BigNumber.from('1e640'), Math.log2(5))));
    a0.getDescription = (_) => Utils.getMath(getDesc(a0.level));
    a0.getInfo = (amount) => Utils.getMathTo(getDesc(a0.level), getDesc(a0.level + amount));
    a0.boughtOrRefunded = (_) => variablePurchased();
  }
  // a1
  {
    let getDesc = (level) => "a_1 = " + getA1(level).toString(0);
    a1 = theory.createUpgrade(11, rho, new ExponentialCost(50, Math.log2(1.74)));
    a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
    a1.getInfo = (amount) => Utils.getMathTo(getDesc(a1.level), getDesc(a1.level + amount));
    a1.boughtOrRefunded = (_) => variablePurchased();
  }
  // a2
  {
    let getDesc = (level) => "a_2 = " + getA2(level).toString(2);
    a2 = theory.createUpgrade(12, rho, new ExponentialCost(1e85, Math.log2(20)));
    a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
    a2.getInfo = (amount) => Utils.getMathTo(getDesc(a2.level), getDesc(a2.level + amount));
    a2.boughtOrRefunded = (_) => variablePurchased();
    a2.isAvailable = false;
  }

  {
    let getDesc = (level) => "\\max x = " + getCapX(level).toString(0);
    maxX = theory.createUpgrade(20, rho, new CompositeCost(26,new ExponentialCost(1e7, 12),new ExponentialCost(1e101, 19.5)));
    maxX.getDescription = (_) => Utils.getMath(getDesc(maxX.level));
    maxX.getInfo = (amount) => Utils.getMathTo(getDesc(maxX.level), getDesc(maxX.level + amount));
    maxX.boughtOrRefunded = (_) => variablePurchased();
  }


  pubUpg = theory.createPublicationUpgrade(0, rho, 5e8);
  buyAllUpg = theory.createBuyAllUpgrade(1, rho, 1e20);
  autoUpg = theory.createAutoBuyerUpgrade(2, rho, 1e40);

  {
    const maxXPermCapCost = ['1e400', '1e500', '1e650', '1e900', '1e1050', '1e1250', '1e1500'];
    let getDesc = (level) => "\\max x \\text{ base multiplier level cap} = " + (level + 6);
    maxXPermCap = theory.createPermanentUpgrade(3, rho, new CustomCost(lv => BigNumber.from(maxXPermCapCost[lv] ?? '1e1000000')));
    maxXPermCap.getDescription = (_) => Utils.getMath(getDesc(maxXPermCap.level));
    maxXPermCap.getInfo = (amount) => Utils.getMathTo(getDesc(maxXPermCap.level), maxXPermCap.level + 7);
    maxXPermCap.maxLevel = maxXPermCapCost.length;
  }

  // last item is unused; or else there will be runtime errors
  let msCostFunc = new CustomCost(lv => BigNumber.from(0.4 * [20, 45, 70, 100, 125, 150, 175, 200, 225, 250, 375, 475, 700, 825, 900, 950, 1000, 1100, 1250, 1400, 1000000][lv]));
  theory.setMilestoneCost(msCostFunc);

    {
      extraCap = theory.createMilestoneUpgrade(0, 10);
      extraCap.getDescription = () => Localization.getUpgradeIncCustomDesc("\\max x \\text{ base multiplier} ", extraCap.level >= 9 ? "0.5" : (extraCap.level >= 5 ? "1" : "3"));
      extraCap.getInfo = () => `$\\max x = 1024 \\times ${getExtraCapX().toString(1)}^{\\text{level}}$`;
    }
    {
      nExp = theory.createMilestoneUpgrade(1, 2);
      nExp.getDescription = () => Localization.getUpgradeIncCustomExpDesc("n",0.6) + " in $\\dot{x}$ term";
      nExp.getInfo = () => nExp.level == 1 ? "Removes $n$ in $\\dot{x}$ term" : "Increases $n$ exponent by $0.6$ in $\\dot{x}$ term"
      nExp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }
    {
      unlockA = theory.createMilestoneUpgrade(2, 1);
      unlockA.getDescription = () => Localization.getUpgradeUnlockDesc(`a_2`);
      unlockA.getInfo = () => Localization.getUpgradeUnlockInfo(`a_2`);
      unlockA.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    {
      a0Exp = theory.createMilestoneUpgrade(3, 3);
      a0Exp.getDescription = () => Localization.getUpgradeIncCustomExpDesc("a_0",1);
      a0Exp.getInfo = () => Localization.getUpgradeIncCustomExpInfo("a_0",1);
      a0Exp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }
    {
      qTerm = theory.createMilestoneUpgrade(4, 1);
      qTerm.getDescription = () => Localization.getUpgradeUnlockDesc(`q`);
      qTerm.getInfo = () => Localization.getUpgradeUnlockInfo(`q`);
      qTerm.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); theory.invalidateSecondaryEquation(); q = BigNumber.ONE; }
    }
    
  updateAvailability();
}

var getPrimaryEquation = () => {
  theory.primaryEquationHeight = 100;
  theory.primaryEquationScale = 1;
  
  let r = "\\begin{matrix}";
  r += `\\frac{\\mathrm{d}\\rho}{\\mathrm{d}t} = n ${qTerm.level > 0 ? "\\sqrt[10]{q}" : ""} \\mathbf{F}'(x; a)\\\\\\\\`;
  r += "\\mathbf{F}(x;v)=\\sum_{k=0} v_k x^{k+1}";
  r += "\\end{matrix}";

  return r;
}

var getSecondaryEquation = () => {
  theory.secondaryEquationScale = 0.95;
  let nExp = getNExp();
  let nExpText = "a_0" + (a0Exp.level > 0 ? `^{${1+a0Exp.level}}` : "") + (nExp == BigNumber.ZERO ? "" : `n^{-${nExp.toString(1)}}`);
  let r = `\\dot{x} = n \\ln\\left(${nExpText}+e\\right)`;
  if (qTerm.level > 0) r += `\\qquad \\dot{q}=\\frac{mxa_1}{1+t}`;
  return r;
}

var getTertiaryEquation = () => {
  let qText = qTerm.level > 0 ? `\\quad q = ${q.toString(1)}` : "";
  return `${theory.latexSymbol} = \\max \\rho^{0.4} \\quad t = ${t.toString(1)} \\quad x = ${x.toString(1)} ${isCappedX() ? `\\text{ (capped)}` : ""} ${qText}`;
}

var tick = (elapsedTime, multiplier) => {
  let dt = BigNumber.from(elapsedTime * multiplier);
  let bonus = theory.publicationMultiplier;

  terms = [
    // ax^1 -> a
    getA0(),
    // bx^2 -> 2bx
    BigNumber.TWO * getA1() * x,
    // cx^3 -> 3cx^2
    unlockA.level == 0 ? BigNumber.ZERO : BigNumber.THREE * getA2() * x.square(),
  ];
  let sums = BigNumber.ZERO;
  terms.forEach(val => {sums += val});
  
  dotrho = sums * getN() * (qTerm.level > 0 ? q.pow(0.1) : BigNumber.ONE);
  rho.value += dotrho * dt * bonus;
  if (a0.level > 0) t += dt * bonus;
  if (t > maxt) maxt = t;

  if (a0.level > 0) {
    x += getN() * (BigNumber.E + getA0().pow(1+a0Exp.level)/(getN().pow(getNExp()))).log() * dt;
    if (isCappedX()) {
      x = getCapX();
    }
    if (qTerm.level > 0) q += (getA1() * x * getM()) / (BigNumber.ONE + t) * dt;
  }

  theory.invalidateTertiaryEquation();
  updateAvailability();
}

var ach_0 = theory.createAchievementCategory(0,'x');
var ach_1 = theory.createAchievementCategory(1,'rho');
var ach_s = theory.createAchievementCategory(3,'Secret');

var ach_x_1 = theory.createAchievement(100, ach_0, "Overflow", "Reach the maximum value of x", isCappedX);
var ach_x_2 = theory.createAchievement(101, ach_0, "Limit? What limit?", "Increase x's cap", () => maxX.level > 0);
var ach_x_3 = theory.createAchievement(102, ach_0, "Even faster than light speed", "Reach x = 1e10", () => x >= BigNumber.from(1e10));
var ach_x_4 = theory.createAchievement(103, ach_0, "xponential idle", "Reach x = 1e25", () => x >= BigNumber.from(1e15));
var ach_x_5 = theory.createAchievement(104, ach_0, "xcelerating", "Reach x = 1e50", () => x >= BigNumber.from(1e50));
var ach_x_6 = theory.createAchievement(105, ach_0, "xtreme growth", "Reach x = 1e150", () => x >= BigNumber.from(1e150));
var ach_x_7 = theory.createAchievement(106, ach_0, "xceeds infinity?", "Reach x = 1.79e308", () => x >= BigNumber.TWO.pow(1024));

var ach_rho_1 = theory.createAchievement(200, ach_1, "Rocket fuel", "Reach 1e10ρ", () => rho.value >= BigNumber.from(1e10));
var ach_rho_2 = theory.createAchievement(201, ach_1, "Terminal velocity", "Reach 1e25ρ", () => rho.value >= BigNumber.from(1e25));
var ach_rho_3 = theory.createAchievement(203, ach_1, "Nice.", "Reach 6.9e69ρ", () => rho.value >= BigNumber.from(6.9e69));
var ach_rho_4 = theory.createAchievement(204, ach_1, "The aρocalypse", "Reach 1e100ρ", () => rho.value >= BigNumber.from(1e100));
var ach_rho_5 = theory.createAchievement(205, ach_1, "IT'S OVER CENTILLION!!!", "Reach 1e303ρ", () => rho.value >= BigNumber.from('1e303'));
var ach_rho_6 = theory.createAchievement(206, ach_1, "No way, you can reach eternity?", "Reach 3.23e616ρ", () => rho.value >= BigNumber.TWO.pow(2048));
var ach_rho_7 = theory.createAchievement(207, ach_1, "Half-ρ decay", "Reach 1e750ρ", () => rho.value >= BigNumber.from('1e750'));
var ach_rho_8 = theory.createAchievement(208, ach_1, "Googolρlex? Not yet.", "Reach 1e1000ρ", () => rho.value >= BigNumber.from('1e1000'));
var ach_rho_9 = theory.createAchievement(209, ach_1, "The end.", "Reach 1e1500ρ", () => rho.value >= BigNumber.from('1e1500'));

var ach_sec1 = theory.createSecretAchievement(1000, ach_s , 'I thought it would be useful', "Perform a reset 5 times in the same publication", "No progress", () => resetCount >= 5);
var ach_sec2 = theory.createSecretAchievement(1001, ach_s , 'Why are you still here?', "Reach 1e2000ρ", "Progress", () => rho.value >= BigNumber.from('1e2000')); // might be hard to get


init();

var canResetStage = () => qTerm.level > 0;
var getResetStageMessage = () => `You can perform a publication reset when your progress is stuck. Your progress in this publication will be lost.`

var resetStage = () => {
  variablePurchased();
  q = BigNumber.ONE;
  rho.value = BigNumber.ZERO;
  n.level = m.level = a0.level = a1.level = a2.level = maxX.level = 0;
  resetCount += 1;
}
