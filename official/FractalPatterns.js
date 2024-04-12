import { CompositeCost, ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory, QuaternaryEntry } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "fractal_patterns";
var name = "Fractal Patterns";
var description =
  "A theory that takes advantage of the growth of the 3 fractal patterns:\n Toothpick Sequence (Tₙ),\n Ulam-Warburton cellular automaton (Uₙ),\n Sierpiński triangle (Sₙ).\n\n Big thanks to Gen (gen1code) and NGZ (ngz001) for all the help and suggestions with the LaTeX.";
var authors = "xlii";
var version = 7;
var releaseOrder = "6";

requiresGameVersion("1.4.33");

var tauMultiplier = 4;

var currency = BigNumber.ZERO;
var quaternaryEntries;
var rhodot = BigNumber.ZERO;
let qdot = BigNumber.ZERO;
let rdot = BigNumber.ZERO;
var q = BigNumber.ONE;
var r = BigNumber.ONE;
var t_cumulative = BigNumber.ZERO;
var A = BigNumber.ONE;
var tvar, c1, c2, q1, q2, r1, n1, n2, n3, s;
var snexp, snboost, nboost, fractalTerm, sterm, expterm;

var n = 1;
var prevN = 1;
var T_n = BigNumber.ONE;
var S_n = BigNumber.ONE;
var U_n = BigNumber.ONE;

var updateN_flag = true;
var adBoost = BigNumber.ONE;

var stage = 1;

//precomputed U_n every 100 generations until 20000 generations
let un_precomputed = [
  0, 9749, 38997, 92821, 155989, 271765, 371285, 448661, 623957, 808853, 1087061, 1415829, 1485141, 1663893, 1794645, 2068245, 2495829, 2681877, 3235413, 3527445, 4348245, 5600149, 5663317, 5807893,
  5940565, 6200341, 6655573, 6841621, 7178581, 7607701, 8272981, 9793813, 9983317, 10246549, 10727509, 11309845, 12941653, 13288981, 14109781, 15594133, 17392981, 22369685, 22400597, 22488341,
  22653269, 22839317, 23231573, 23488661, 23762261, 24243221, 24801365, 25677461, 26622293, 26830229, 27366485, 27800213, 28714325, 29858837, 30430805, 32081045, 33091925, 35461013, 39175253,
  39364757, 39933269, 40196501, 40986197, 42341525, 42910037, 43952021, 45239381, 47328533, 51766613, 52321301, 53155925, 54567701, 56439125, 61199765, 62376533, 64838933, 69571925, 74595221,
  89478741, 89511189, 89602389, 89763861, 89953365, 90387093, 90613077, 90872853, 91357269, 91915413, 92926293, 93732885, 93954645, 94480533, 95049045, 95838741, 96972885, 97555221, 99205461,
  100247445, 102709845, 106289301, 106489173, 107042709, 107320917, 108110613, 109465941, 110024085, 111200853, 112394901, 114857301, 118877205, 119435349, 120311445, 121723221, 123594645, 128324181,
  129625365, 132367701, 136696341, 141844053, 156588693, 156701013, 156964245, 157459029, 158027541, 159733077, 159996309, 160786005, 162239253, 163944789, 167070741, 169366101, 170062485, 171640149,
  173304213, 175808085, 179086101, 180957525, 185783829, 189314133, 196701333, 207066453, 207624597, 209285205, 210161301, 212623701, 216565269, 218270805, 222174357, 225756501, 232770453, 244799061,
  246473493, 249506133, 253368213, 259355733, 273171093, 278287701, 285394965, 298380885, 314103957, 357914965, 357953557, 358044757, 358209685, 358409557, 358962709, 359055445, 359318677, 359813461,
  360371605, 361548373, 362178709, 362452309, 362933269, 363491413, 364367509, 365429077, 366052885, 367661653, 368962837, 371705173, 374740885, 374931541, 375481621, 375818581, 376608277, 377922133,
  378490645, 380196181, 380985877, 383354965, 387323029, 387891541, 388933525, 390220885, 392310037, 396821845,
];

function formatNumber(number) {
  if (number === BigNumber.ZERO) return "0";
  if (number < 0.001) {
    const l = number.log10().floor();
    return `${number / BigNumber.TEN.pow(l)}\\text{e-${Math.abs(l)}}`;
  }
  return number.toString(3);
}

var init = () => {
  currency = theory.createCurrency();
  quaternaryEntries = [];

  ///////////////////
  // Regular Upgrades
  // tvar
  {
    let getDesc = (level) => "\\dot{t}=" + getTdot(level).toString(1);
    tvar = theory.createUpgrade(0, currency, new ExponentialCost(1e4, Math.log2(1e4)));
    tvar.getDescription = (_) => Utils.getMath(getDesc(tvar.level));
    tvar.getInfo = (amount) => Utils.getMathTo(getDesc(tvar.level), getDesc(tvar.level + amount));
    tvar.maxLevel = 4;
  }
  // c1
  {
    let getDesc = (level) => "c_1=" + getC1(level).toString(0);
    c1 = theory.createUpgrade(1, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(1.4))));
    c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
    c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));
  }

  // c2
  {
    let getDesc = (level) => "c_2=2^{" + level + "}";
    let getInfo = (level) => "c_2=" + getC2(level).toString(0);
    c2 = theory.createUpgrade(2, currency, new CompositeCost(15, new ExponentialCost(1e15, Math.log2(40)), new ExponentialCost(1e37, Math.log2(16.42))));
    c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
    c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
  }
  // q1
  {
    let getDesc = (level) => "q_1=" + formatNumber(getQ1(level));
    let getInfo = (level) => "q_1=" + formatNumber(getQ1(level));
    q1 = theory.createUpgrade(3, currency, new FirstFreeCost(new ExponentialCost(1e35, Math.log2(12))));
    q1.getDescription = (_) => Utils.getMath(getDesc(q1.level));
    q1.getInfo = (amount) => Utils.getMathTo(getInfo(q1.level), getInfo(q1.level + amount));
  }
  // q2
  {
    let getDesc = (level) => "q_2=2^{" + level + "}";
    let getInfo = (level) => "q_2=" + getQ2(level).toString(0);
    q2 = theory.createUpgrade(4, currency, new ExponentialCost(1e76, Math.log2(1e3)));
    q2.getDescription = (_) => Utils.getMath(getDesc(q2.level));
    q2.getInfo = (amount) => Utils.getMathTo(getInfo(q2.level), getInfo(q2.level + amount));
  }
  // r1
  {
    let getDesc = (level) => "r_1=" + formatNumber(getR1(level));
    let getInfo = (level) => "r_1=" + formatNumber(getR1(level));
    r1 = theory.createUpgrade(
      5,
      currency,
      new CompositeCost(285, new FirstFreeCost(new ExponentialCost(1e80, Math.log2(25))), new FirstFreeCost(new ExponentialCost(BigNumber.from("1e480"), Math.log2(150))))
    );
    r1.getDescription = (_) => Utils.getMath(getDesc(r1.level));
    r1.getInfo = (amount) => Utils.getMathTo(getInfo(r1.level), getInfo(r1.level + amount));
  }
  // n
  {
    let getDesc = (level) => "n=" + getN1(level).toString(0);
    let getInfo = (level) => "n=" + getN1(level).toString(0);
    n1 = theory.createUpgrade(6, currency, new ExponentialCost(1e4, Math.log2(3e6)));
    n1.getDescription = (_) => Utils.getMath(getDesc(n1.level));
    n1.getInfo = (amount) => Utils.getMathTo(getInfo(n1.level), getInfo(n1.level + amount));
    n1.bought = (_) => (updateN_flag = true);
  }
  // s
  {
    let getDesc = (level) => "s=" + getS(level).toString(2);
    let getInfo = (level) => "s=" + getS(level).toString(2);
    s = theory.createUpgrade(9, currency, new ExponentialCost(BigNumber.from("1e730"), Math.log2(1e30)));
    s.getDescription = (_) => Utils.getMath(getDesc(s.level));
    s.getInfo = (amount) => Utils.getMathTo(getInfo(s.level), getInfo(s.level + amount));
    s.bought = (_) => (updateN_flag = true);
  }

  /////////////////////
  // Permanent Upgrades
  theory.createPublicationUpgrade(0, currency, 1e12);
  theory.createBuyAllUpgrade(1, currency, 1e14);
  theory.createAutoBuyerUpgrade(2, currency, 1e17);

  ///////////////////////
  //// Milestone Upgrades
  theory.setMilestoneCost(new CustomCost((total) => BigNumber.from(tauMultiplier*getMilCustomCost(total))));
  function getMilCustomCost(lvl) {
    const unlocks = [Math.log10(5e22), 95, 175, 300, 385, 420, 550, 600, 700, 1500];
    return unlocks[Math.min(lvl, unlocks.length - 1)] * 0.075;
  }
  {
    fractalTerm = theory.createMilestoneUpgrade(0, 2);
    fractalTerm.getDescription = (_) => {
      if (fractalTerm.level === 0) {
        return "Add the Ulam-Warburton fractal";
      }
      return "Add the Sierpinski Triangle fractal";
    };
    fractalTerm.getInfo = (_) => {
      if (fractalTerm.level === 0) {
        return "Add the Ulam-Warburton fractal";
      }
      return "Add the Sierpinski Triangle fractal";
    };
    fractalTerm.boughtOrRefunded = (_) => {
      theory.invalidatePrimaryEquation();
      theory.invalidateTertiaryEquation();
      updateAvailability();
      quaternaryEntries = [];
    };
    fractalTerm.canBeRefunded = () => nboost.level === 0;
  }
  {
    nboost = theory.createMilestoneUpgrade(2, 2);
    nboost.getDescription = (_) => "Improve n variable scaling";

    nboost.getInfo = (_) => "Improve n variable scaling";

    nboost.boughtOrRefunded = (_) => {
      theory.invalidatePrimaryEquation();
      theory.invalidateSecondaryEquation();
      theory.invalidateTertiaryEquation();
      updateAvailability();
      updateN_flag = true;
    };
    nboost.canBeRefunded = (_) => snexp.level === 0;
  }
  {
    snexp = theory.createMilestoneUpgrade(1, 3);
    snexp.description = Localization.getUpgradeIncCustomExpDesc("S_n", "0.6");
    snexp.info = Localization.getUpgradeIncCustomExpInfo("S_n", "0.6");
    snexp.boughtOrRefunded = (_) => {
      updateAvailability();
      theory.invalidatePrimaryEquation();
    };
    snexp.canBeRefunded = () => snboost.level === 0;
  }
  {
    snboost = theory.createMilestoneUpgrade(3, 1);
    snboost.getDescription = (_) => "$S_n$ returns total amount of triangles";
    snboost.getInfo = (_) => "Count all triangles in the sierpinsky triangle";
    snboost.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    snboost.boughtOrRefunded = (_) => {
      S_n = S(Math.floor(Math.sqrt(n)));
      theory.invalidatePrimaryEquation();
      updateAvailability();
    };
    snboost.canBeRefunded = (_) => sterm.level === 0;
  }
  {
    sterm = theory.createMilestoneUpgrade(4, 1);
    sterm.getDescription = () => "$\\text{Add the term }s\\;\\;\\&\\;\\downarrow T_n\\text{exponent by 2}$";
    sterm.getInfo = () => "$\\text{Add the term }s\\;\\;\\&\\;\\downarrow T_n\\text{exponent by 2}$";
    sterm.boughtOrRefunded = (_) => {
      updateAvailability();
      theory.invalidatePrimaryEquation();
    };
    sterm.canBeRefunded = (_) => expterm.level === 0;
  }
  {
    expterm = theory.createMilestoneUpgrade(5, 1);
    expterm.getDescription = () => "$\\text{Improve } \\dot{r} \\text{ equation}$";
    expterm.getInfo = () => `$\\dot{r} = r_1(T_nU_n)^{\\log(\\sqrt{2U_n})}S_{\\lfloor \\sqrt{n} \\rfloor}^{${snexp.level > 0 ? getsnexp(snexp.level).toString(1) : ""}}$`;
    expterm.boughtOrRefunded = (_) => {
      theory.invalidatePrimaryEquation();
    };
  }

  updateAvailability();
};

function T(n) {
  if (n === 0) return 0;
  let log2N = Math.log2(n);
  if (log2N % 1 === 0) return (2 ** (2 * log2N + 1) + 1) / 3;
  let i = n - 2 ** Math.floor(log2N);
  return T(2 ** Math.floor(log2N)) + 2 * T(i) + T(i + 1) - 1;
}
function u(n) {
  if (n < 2) return n;
  return 4 * 3 ** (wt(n - 1) - 1);
}
function wt(n) {
  let temp = 0;
  for (let k = 1; ; k++) {
    if (2 ** k > n) break;
    temp += Math.floor(n / 2 ** k);
  }
  return n - temp;
}
function U(n) {
  let p = n - (n % 100);
  let temp = un_precomputed[Math.floor(n / 100)];
  for (let i = p + 1; i <= n; i++) temp += u(i);
  return temp;
}
function S(n) {
  if (n === 0) return BigNumber.ZERO;
  if (snboost.level === 0) return BigNumber.THREE.pow(n - 1);
  return BigNumber.from(1 / 3) * (BigNumber.TWO * BigNumber.THREE.pow(n) - BigNumber.THREE);
}
function approx(n) {
  n++;
  return BigNumber.from(1 / 6) * (BigNumber.TWO.pow(2 * n) + BigNumber.TWO);
}

function updateN() {
  T_n = BigNumber.from(T(n));
  S_n = S(Math.floor(Math.sqrt(n)));
  U_n = BigNumber.from(U(n));
}

var updateAvailability = () => {
  q1.isAvailable = fractalTerm.level > 0;
  q2.isAvailable = fractalTerm.level > 0;
  r1.isAvailable = fractalTerm.level > 1;
  s.isAvailable = sterm.level > 0;
  snexp.isAvailable = nboost.level === 2;
  nboost.isAvailable = fractalTerm.level === 2;
  snboost.isAvailable = snexp.level === 3;
  sterm.isAvailable = snboost.level === 1;
  expterm.isAvailable = sterm.level === 1;
};

var tick = (elapsedTime, multiplier) => {
  let dt = BigNumber.from(elapsedTime * multiplier);
  let bonus = theory.publicationMultiplier;
  adBoost = BigNumber.from(multiplier);

  if (c1.level === 0) return;
  if (updateN_flag && n < 20000) {
    prevN = n;
    //n is clamped at 20000 because of computation reasons. takes ~40k days to reach
    n = Math.min(20000, getN1(n1.level));
    updateN();
    updateN_flag = false;
    theory.invalidateTertiaryEquation();
  }
  t_cumulative += getTdot(tvar.level) * dt;

  A = fractalTerm.level > 0 ? approx(q2.level) : 1;

  qdot = (getQ1(q1.level) * A * U_n.pow(7 + (sterm.level > 0 ? getS(s.level).toNumber() : 0))) / BigNumber.THOUSAND;
  q += fractalTerm.level > 0 ? qdot * dt : 0;

  if (expterm.level === 0) rdot = getR1(r1.level) * (T_n * U_n).pow(BigNumber.from(Math.log10(n))) * S_n ** getsnexp(snexp.level);
  else rdot = getR1(r1.level) * (T_n * U_n).pow(Math.log10(U_n * 2) / 2) * S_n ** getsnexp(snexp.level);
  r += fractalTerm.level > 1 ? rdot * dt : 0;

  rhodot = bonus * getC1(c1.level) * getC2(c2.level) * T_n.pow(7 + (sterm.level > 0 ? getS(s.level).toNumber() - 2 : 0)) * t_cumulative;
  rhodot *= fractalTerm.level > 0 ? q : 1;
  rhodot *= fractalTerm.level > 1 ? r : 1;

  currency.value += rhodot * dt;

  theory.invalidateTertiaryEquation();
  theory.invalidateQuaternaryValues();

  // if (!game.isCalculatingOfflineProgress)
  //   updateBackgroundImage(elapsedTime);
};

var postPublish = () => {
  q = BigNumber.ONE;
  r = BigNumber.ONE;
  rhodot = BigNumber.ZERO;
  qdot = BigNumber.ZERO;
  rdot = BigNumber.ZERO;
  t_cumulative = BigNumber.ZERO;
  prevN = 1;
  n = 1;
  U_n = BigNumber.ONE;
  T_n = BigNumber.ONE;
  S_n = BigNumber.ONE;
  maxUDN = BigNumber.ONE;
  updateN_flag = true;
  A = BigNumber.ONE;
  theory.invalidateTertiaryEquation();
  theory.invalidateQuaternaryValues();
};
var getInternalState = () => `${q} ${r} ${t_cumulative}`;

var setInternalState = (state) => {
  let values = state.split(" ");
  if (values.length > 0) q = parseBigNumber(values[0]);
  if (values.length > 1) r = parseBigNumber(values[1]);
  if (values.length > 2) t_cumulative = parseBigNumber(values[2]);

  updateN_flag = true;
};

var getPrimaryEquation = () => {
  if (stage === 0) {
    theory.primaryEquationHeight = 150;
    theory.primaryEquationScale = 0.65;
    let result = "T_{2^k+i}=\\begin{cases}\\frac{2^{2k+1}+1}{3},  & \\text{if } i = 0,  \\\\ T_{2^k}+2T_i + T_{i+1}-1, & \\text{if } 1 < i \\leq 2^k \\end{cases}\\\\";
    if (fractalTerm.level > 0) {
      result += "u_0 = 0,\\ u_1 = 1,\\ \\dots,\\ u_n=4(3^{w_{n-1}-1})\\\\";
      result += "w_n = n-\\sum_{k=1}^{\\infty}\\left\\lfloor\\frac{n}{2^k}\\right\\rfloor \\\\";
      result += "U_n = \\sum_{i=0}^n u_i";
    }
    if (fractalTerm.level > 1) result += snboost.level === 0 ? ", \\qquad S_n = 3^{n-1}" : ", \\qquad S_n = \\frac{1}{2}(3^n-1)";
    return result;
  } else {
    theory.primaryEquationHeight = fractalTerm.level === 0 ? 60 : 110;
    theory.primaryEquationScale = fractalTerm.level === 0 ? 1.2 : 0.97;
    let result = `\\dot{\\rho} = c_1c_2`;
    if (fractalTerm.level > 0) result += "q" + (fractalTerm.level > 1 ? "r" : "");
    result += "t";
    result += `T_n^{${7 - (sterm.level === 0 ? 0 : 2) + (sterm.level > 0 ? "+s" : "")}}`;
    if (fractalTerm.level > 0) result += `\\\\\\\\ \\dot{q} = q_1AU_n^{7${sterm.level > 0 ? "+s" : ""}}/1000`;
    if (fractalTerm.level > 1) {
      if (expterm.level === 0) result += `\\\\\\\\ \\dot{r} = r_1(T_nU_n)^{\\log(n)}S_{\\lfloor \\sqrt{n} \\rfloor}^{${snexp.level > 0 ? getsnexp(snexp.level).toString(1) : ""}}`;
      else result += `\\\\\\\\ \\dot{r} = r_1(T_nU_n)^{\\log(\\sqrt{2U_n})}S_{\\lfloor \\sqrt{n} \\rfloor}`;
    }
    return result;
  }
};

var getSecondaryEquation = () => {
  if (stage === 0) return "";
  theory.secondaryEquationHeight = 60;
  theory.secondaryEquationScale = 1;
  let result = "\\begin{matrix}";
  if (fractalTerm.level > 0) result += `A = (2-U_{q_2}/T_{q_2})^{-1} \\qquad `;
  result += "\\\\ {}\\end{matrix}";
  return result;
};
var getTertiaryEquation = () => {
  let result = "\\begin{matrix}";
  if (stage === 0) {
    result += "T_n=" + T_n.toString(0);
    if (fractalTerm.level > 0) result += ",&U_n=" + U_n.toString(0);
    if (fractalTerm.level > 1) result += "\\\\\\\\ S_{\\lfloor \\sqrt{n} \\rfloor}=" + S_n.toString(0);
  } else {
    result += theory.latexSymbol + "=\\max\\rho^{0.3}";
  }
  result += "\\\\ {}\\end{matrix}";
  return result;
};
var getQuaternaryEntries = () => {
  // log(JSON.stringify(quaternaryEntries))
  if (quaternaryEntries.length == 0) {
    quaternaryEntries.push(new QuaternaryEntry(null, ''));
    quaternaryEntries.push(new QuaternaryEntry("n", null));
    if (stage === 0) {
      if (fractalTerm.level > 0) quaternaryEntries.push(new QuaternaryEntry("\\dot{q}_{{}\\,}", null));
      if (fractalTerm.level > 1) quaternaryEntries.push(new QuaternaryEntry("\\dot{r}_{{}\\,}", null));
      quaternaryEntries.push(new QuaternaryEntry("\\dot{\\rho}_{{}\\,}", null));
    } else {
      quaternaryEntries.push(new QuaternaryEntry("t_{{}\\,}", null));
      if (fractalTerm.level > 0) quaternaryEntries.push(new QuaternaryEntry("q", null));
      if (fractalTerm.level > 1) quaternaryEntries.push(new QuaternaryEntry("r", null));
      if (fractalTerm.level > 0) quaternaryEntries.push(new QuaternaryEntry("A_{{}\\,}", null));
    }
    quaternaryEntries.push(new QuaternaryEntry(null, ''));
  }

  quaternaryEntries[1].value = BigNumber.from(n).toString(0);
  if (stage === 0) {
    if (fractalTerm.level > 0) quaternaryEntries[2].value = (adBoost * qdot).toString(3);
    if (fractalTerm.level > 1) quaternaryEntries[3].value = (adBoost * rdot).toString(3);
    quaternaryEntries[fractalTerm.level + 2].value = (adBoost * rhodot).toString(3);
  } else {
    quaternaryEntries[2].value = t_cumulative.toString(2);
    if (fractalTerm.level > 0) quaternaryEntries[3].value = q.toString(2);
    if (fractalTerm.level > 1) quaternaryEntries[4].value = r.toString(2);
    if (fractalTerm.level > 0) quaternaryEntries[fractalTerm.level > 1 ? 5 : 4].value = A.toString(2);
  }

  return quaternaryEntries;
};
var canGoToPreviousStage = () => stage === 1;
var goToPreviousStage = () => {
  stage--;
  theory.invalidatePrimaryEquation();
  theory.invalidateSecondaryEquation();
  theory.invalidateTertiaryEquation();
  quaternaryEntries = [];
  theory.invalidateQuaternaryValues();
};
var canGoToNextStage = () => stage === 0;
var goToNextStage = () => {
  stage++;
  theory.invalidatePrimaryEquation();
  theory.invalidateSecondaryEquation();
  theory.invalidateTertiaryEquation();
  quaternaryEntries = [];
  theory.invalidateQuaternaryValues();
};

var getPublicationMultiplier = (tau) => tau.pow(1.324/tauMultiplier) * BigNumber.FIVE;
var getPublicationMultiplierFormula = (symbol) => "5" + symbol + "^{0.331}";
var getTau = () => currency.value.pow(0.075*tauMultiplier);
var getCurrencyFromTau = (tau) => [tau.max(BigNumber.ONE).pow(1 / (0.075*tauMultiplier)), currency.symbol];
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

let stepwiseSum = (level, base, length) => {
  if (level <= length) return level;
  level -= length;
  let cycles = Math.floor(level / length);
  let mod = level - cycles * length;
  return base * (cycles + 1) * ((length * cycles) / 2 + mod) + length + level;
};

var getTdot = (level) => BigNumber.from(0.2 + level / 5);
var getC1 = (level) => Utils.getStepwisePowerSum(level, 150, 100, 0);
var getC2 = (level) => BigNumber.TWO.pow(level);
var getQ1 = (level) => (level === 0 ? BigNumber.ZERO : Utils.getStepwisePowerSum(level, 10, 10, 0) / BigNumber.from(1 + 1000 / level ** 1.5));
var getQ2 = (level) => BigNumber.TWO.pow(level);
var getR1 = (level) => (level === 0 ? BigNumber.ZERO : Utils.getStepwisePowerSum(level, 2, 5, 0) / BigNumber.from(1 + 1e9 / level ** 4));
var getN1 = (level) => {
  const term2 = nboost.level > 0 ? Math.floor(stepwiseSum(Math.max(0, level - 30), 1, 35) * 2) : 0;
  const term3 = nboost.level > 1 ? Math.floor(stepwiseSum(Math.max(0, level - 69), 1, 30) * 2.4) : 0;
  return BigNumber.from(1 + stepwiseSum(level, 1, 40) + term2 + term3);
};
var getS = (level) => {
  let cutoffs = [32, 39];
  if (level < cutoffs[0]) return BigNumber.from(1 + level * 0.15);
  if (level < cutoffs[1]) return BigNumber.from(getS(cutoffs[0] - 1) + 0.15 + (level - cutoffs[0]) * 0.2);
  return BigNumber.from(getS(cutoffs[1] - 1) + 0.2 + (level - cutoffs[1]) * 0.15);
};
var getsnexp = (level) => BigNumber.from(1 + level * 0.6);

// var lastTheme = null;
// var backgroundImages = [ui.createImage({scale: 0.75, opacity: 0}) , ui.createImage({scale: 0.75, opacity: 0}) , ui.createImage({scale: 0.75, opacity: 0})];
// var backgroundIndex = backgroundImages.length - 1;
// var backgroundTime = 0;
// var backgroundDisplayTime = 10;
// var backgroundTransitionTime = 2;
// var backgroundInitialized = false;

// var fadeBackground = (image, opacity) => {
//   if (image.opacity != opacity)
//     image.fadeTo(opacity, backgroundTransitionTime * 1000, Easing.LINEAR);
// }

// var updateBackgroundImage = (elapsedTime) => {
//   if (lastTheme != game.settings.theme) {
//     if (game.settings.theme == Theme.LIGHT)
//       backgroundImages[0].source = ImageSource.fromUri("https://github.com/conicgames/custom-theories/blob/main/assets/FractalPatternToothpickSequenceLight.png?raw=true");
//     else
//       backgroundImages[0].source = ImageSource.fromUri("https://github.com/conicgames/custom-theories/blob/main/assets/FractalPatternToothpickSequence.png?raw=true");
    
//     if (game.settings.theme == Theme.LIGHT)
//       backgroundImages[1].source = ImageSource.fromUri("https://github.com/conicgames/custom-theories/blob/main/assets/FractalPatternUlamWarburtonLight.png?raw=true");
//     else
//       backgroundImages[1].source = ImageSource.fromUri("https://github.com/conicgames/custom-theories/blob/main/assets/FractalPatternUlamWarburton.png?raw=true");
    
//     if (game.settings.theme == Theme.LIGHT)
//       backgroundImages[2].source = ImageSource.fromUri("https://github.com/conicgames/custom-theories/blob/main/assets/FractalPatternSierpinskiTriangleLight.png?raw=true");
//     else
//       backgroundImages[2].source = ImageSource.fromUri("https://github.com/conicgames/custom-theories/blob/main/assets/FractalPatternSierpinskiTriangle.png?raw=true");

//     lastTheme = game.settings.theme;
//   }

//   backgroundTime += elapsedTime;
//   var nextIndex = null;

//   if (backgroundIndex > fractalTerm.length || !backgroundInitialized && backgroundTime > 2)
//     nextIndex = 0;

//   if (backgroundTime > backgroundDisplayTime)
//     nextIndex = (backgroundIndex + 1) % Math.min(fractalTerm.level + 1, backgroundImages.length);

//   if (nextIndex != null) {
//     if (backgroundIndex != nextIndex)
//       fadeBackground(backgroundImages[backgroundIndex], 0);

//     backgroundIndex = nextIndex;
//     fadeBackground(backgroundImages[backgroundIndex], 1);
//     backgroundTime = 0;
//     backgroundInitialized = true;
//   }
// }

// var getEquationUnderlay = () => {
//   return ui.createGrid({
//     children: backgroundImages
//   });
// }

init();
