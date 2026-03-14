import { BigNumber, parseBigNumber } from '../api/BigNumber';
import { theory, QuaternaryEntry } from "../api/Theory";
import { Localization } from "../api/Localization";
import { Currency } from '../api/Currency';
import { ExponentialCost, FirstFreeCost, FreeCost, ConstantCost, CustomCost } from '../api/Costs';
import { Upgrade } from '../api/Upgrades';
import { Utils, log } from '../api/Utils';
import { ui } from '../api/ui/UI';
import { Aspect } from '../api/ui/properties/Aspect';
import { Color } from '../api/ui/properties/Color';
import { FontAttributes } from '../api/ui/properties/FontAttributes';
import { ImageSource } from '../api/ui/properties/ImageSource';
import { LayoutOptions } from '../api/ui/properties/LayoutOptions';
import { StackOrientation } from '../api/ui/properties/StackOrientation';
import { TextAlignment } from '../api/ui/properties/TextAlignment';
import { Thickness } from '../api/ui/properties/Thickness';
import { TouchType } from '../api/ui/properties/TouchType';
import { LatexLabel } from '../api/ui/LatexLabel';
import { game } from '../api/Game';

var id = "nli_s6_speedup";

var getName = (language) => {
    const names =
    {
        en: 'Nonlinear Integration (S6 Speedup)',
    };

    return names[language] || names.en;
}

var getDescription = (language) => {
    const descs =
    {
        en: "A custom theory about Riemann-Stieltjes integration\n" +
            "This version has a 6x tickspeed multiplier speedup for season 6"
    };

    return descs[language] || descs.en;
}

var authors = "Snaeky - Idea\nMathis S. - Coding";
var version = 2;

const s6_speed_multiplier = 6;

///////////////
// Localization

// From RZ's code
const locStrings =
{
    example:
    {
        pubTime: '{0}',
    },
    en:
    {
        pubTime: 'Publication time: {0}',
    }
};

// From RZ's code
const language = Localization.language;
/**
 * Returns a localised string.
 * @param {string} name the internal name of the string.
 * @returns {string} the string.
 */
let getLoc = (name, lang = language) =>
{
    if(lang in locStrings && name in locStrings[lang])
        return locStrings[lang][name];

    if(name in locStrings.en)
        return locStrings.en[name];

    return `String missing: ${lang}.${name}`;
}

/**
 * Applies BigNumber.from to all elements in the array
 * @param {(number | string)[]} arr 
 * @returns {BigNumber[]}
 */
var bigNumArray = (arr) => arr.map((val) => BigNumber.from(val));

///////////////
// Declarations

const PHI = BigNumber.from((1 + Math.sqrt(5))/2);
const ZERO = BigNumber.ZERO;
const ONE = BigNumber.ONE;

var alphaMode = true;
var parallelMode = false;

let q_rho = ONE;
let q_alpha = ONE;
let maxh = ZERO;
let maxrho = ONE;

let milestonesAvailable = 0;
let totalMilestonePoints = 0;

let autobuyCooldown = 1 / game.automation.rate;

// Currencies
/** @type {Currency} */
var currencyRho;
/** @type {Currency} */
var currencyAlpha;

// Upgrades
/** @type {Upgrade} */
var q1;
/** @type {Upgrade} */
var q1a;

/** @type {Upgrade} */
var a0;
/** @type {Upgrade} */
var a1;
/** @type {Upgrade} */
var a2;
/** @type {Upgrade} */
var a3;
/** @type {Upgrade} */
var b0;
/** @type {Upgrade} */
var b1;
/** @type {Upgrade} */
var b2;

/** @type {Upgrade} */
var a0a;
/** @type {Upgrade} */
var a1a;
/** @type {Upgrade} */
var a2a;
/** @type {Upgrade} */
var a3a;
/** @type {Upgrade} */
var b0a;
/** @type {Upgrade} */
var b1a;
/** @type {Upgrade} */
var b2a;

// Permanent upgrades

/** @type {Upgrade} */
var rhoUnlock;
/** @type {Upgrade} */
var kTermPerma;
/** @type {Upgrade} */
var hTermPerma;
/** @type {Upgrade} */
var msLevelIncreasePerma;
/** @type {Upgrade} */
var rhoParallelUpgrade;

/** @type {Upgrade} hidden */
var buyAllPerma;
/** @type {Upgrade} hidden */
var autobuyPerma;

// Regular Milestones
/** @type {Upgrade} */
var milestoneMenuUnlock;
/** @type {Upgrade} */
var buyAllMs;
/** @type {Upgrade} */
var autobuyMs;

// Milestones

/** @type {CustomMilestoneUpgrade[]} */
var milestoneArray = [];

/** @type {CustomMilestoneUpgrade} */
var b1baseMs;
/** @type {CustomMilestoneUpgrade} */
var a1baseMs;
/** @type {CustomMilestoneUpgrade} */
var b0baseMs;
/** @type {CustomMilestoneUpgrade} */
var a0baseMs;
/** @type {CustomMilestoneUpgrade} */
var b2baseMs;
/** @type {CustomMilestoneUpgrade} */
var a2baseMs;
/** @type {CustomMilestoneUpgrade} */
var a3baseMs;
/** @type {CustomMilestoneUpgrade} */
var alphaParallelUpgrade;

// UI
var rhodot = ZERO;
var alphadot = ZERO;
var cur_h = ZERO;

var pubTime = 0;
var swapTime = 0;

let lifetime_h = ZERO;
let lifetime_rho = ZERO;

var mainEquationPressed = false;
var milestoneInfoPressed = false;

/** @type {Upgrade} */
var pubTimeOverlay;
/** @type {Upgrade} */
var swapTimeOverlay;

// Debug
///** @type {Upgrade} */
//var debugResetMilestonesUpgrade;

//////////
// Balance

// pub mult equation constants
const pubMultExp = 0.2;

// tau equation constants
const rhoExponent = 0.4;
const maxhExponent = 0.4;

// Perma Upgrade Costs
const pubUnlockCost = 1e5;
const rhoUnlockCost = 1e16;
const kTermCosts = bigNumArray([
    '1e50',
    '1e140'
])
const hTermCosts = bigNumArray([
    '1e90'
])
const msLevelIncreaseCosts = bigNumArray([
    '1e60',
    '1e100',
    '1e160',
    '1e470',
    '1e620',
    '1e770'
])

const rhoParallelCost = BigNumber.from('1e970');

const trueMilestoneCosts = bigNumArray([
    8, // ms menu
    10, // buy all
    12 // autobuy
])

const milestoneCosts = bigNumArray([
    '1e60',
    '1e80',
    '1e90', // group 1

    '1e180',
    '1e200',
    '1e210',
    '1e220', // group 2

    '1e300',
    '1e320',
    '1e330',
    '1e340',
    '1e350', // group 3

    '1e800',
    '1e850',
    '1e900',
    '1e925',
    '1e950',
    '1e1000', // group 4

    '1e1400',
    '1e1500',
    '1e1600', // group 5

    '1e1800',
    '1e1900', // group 6

    '1e2300', // group 7

    '1e2325',
    '1e2350',
    '1e2375',
    '1e2400', // useless milestones
    
    '1e2425' // final
]);

const milestoneCount = milestoneCosts.length;

const q1Cost = new FirstFreeCost(new ExponentialCost(1000, Math.log2(31.2)));
const q1aCost = new FirstFreeCost(new ExponentialCost(1000, Math.log2(31.2)));
var getQ1 = (level) => BigNumber.TWO.pow(level) - ONE;

const a0Cost = new ExponentialCost(50, Math.log2(1.891));
const a0aCost = new ExponentialCost(50, Math.log2(1e6)); // UNUSED
const a0bases = [1.39, 1.4, 1.41, 1.42, 1.43];
/** @param {number} level @returns {BigNumber} */
var getA0 = (level) => BigNumber.from(a0bases[a0baseMs.level]).pow(level);

const a1Cost = new ExponentialCost(1e4, Math.log2(2.362));
const a1aCost = new ExponentialCost(80, Math.log2(4.9));
const a1bases = [1.435, 1.455, 1.475, 1.495, 1.515];
/** @param {number} level @returns {BigNumber} */
var getA1 = (level) => BigNumber.from(a1bases[a1baseMs.level]).pow(level);

const a2Cost = new ExponentialCost(1e4, Math.log2(2.855));
const a2aCost = new ExponentialCost(1e5, Math.log2(10.15));
const a2bases = [1.43, 1.455, 1.48, 1.505, 1.53];
/** @param {number} level @returns {BigNumber} */
var getA2 = (level) => BigNumber.from(a2bases[a2baseMs.level]).pow(level);

const a3Cost = new ExponentialCost(1e8, Math.log2(3.31));
const a3aCost = new ExponentialCost(1e8, Math.log2(40));
const a3bases = [1.3, 1.35, 1.4, 1.44, 1.48];
/** @param {number} level @returns {BigNumber} */
var getA3 = (level) => BigNumber.from(a3bases[a3baseMs.level]).pow(level);

const b0Cost = new FirstFreeCost(new ExponentialCost(10, Math.log2(1e6))); // UNUSED
const b0aCost = new FirstFreeCost(new ExponentialCost(200, Math.log2(2.54)));
const b0bases = [1.55, 1.57, 1.59, 1.61, 1.63];
/** @param {number} level @returns {BigNumber} */
var getB0 = (level) => BigNumber.from(b0bases[b0baseMs.level]).pow(level) - ONE;

const b1Cost = new FirstFreeCost(new ExponentialCost(1e5, Math.log2(11.25)));
const b1aCost = new FirstFreeCost(new ExponentialCost(3000, Math.log2(3.65)));
const b1bases = [1.7, 1.72, 1.74, 1.76, 1.78];
/** @param {number} level @returns {BigNumber} */
var getB1 = (level) => BigNumber.from(b1bases[b1baseMs.level]).pow(level) - ONE;

const b2Cost = new FirstFreeCost(new ExponentialCost(1e10, Math.log2(25.55)));
const b2aCost = new FirstFreeCost(new ExponentialCost(1e7, Math.log2(4.1)));
const b2bases = [1.53, 1.57, 1.61, 1.65, 1.68];
/** @param {number} level @returns {BigNumber} */
var getB2 = (level) => BigNumber.from(b2bases[b2baseMs.level]).pow(level) - ONE;

var getPublicationMultiplier = (tau) => tau.pow(pubMultExp);

var getPublicationMultiplierFormula = (symbol) => `{${symbol}}^{${pubMultExp}}`;

var getTau = () => (rhoUnlock.level > 0 ? maxrho.pow(rhoExponent) : ONE) * maxh.pow(maxhExponent);
//var getTau = () => BigNumber.from('1e600');

var getMilestoneCostReduction = () => maxh.pow(4) + ONE;

//var getCurrencyFromTau = (tau) => [value, symbol];

////////
// Utils

/**
 * Rounds `num` to 5 decimal places
 * @param {Number} num 
 * @returns {Number}
 */
var r5 = (num) => Math.round(num * 10000) / 10000;

class CustomMilestoneUpgrade {
    /**
     * @param {Number} id 
     * @param {Number} maxLevel
     */
    constructor(id, maxLevel) {
        this.innerUpgrade = theory.createPermanentUpgrade(id + 100, currencyRho, new FreeCost)
        this.innerUpgrade.isAvailable = false;
        this.isAvailable = true;
        this.maxLevel = maxLevel;
        /** @type {function():void} */
        this.boughtOrRefunded = () => {};
        milestoneArray.push(this);
    }

    get getDescription() { return this.innerUpgrade.getDescription }
    set getDescription(value) { this.innerUpgrade.getDescription = value }

    get getInfo() { return this.innerUpgrade.getInfo }
    set getInfo(value) { this.innerUpgrade.getInfo = value }

    get canBeRefunded() { return (amount) => (this.innerUpgrade.canBeRefunded(amount) && this.innerUpgrade.level > 0) }
    set canBeRefunded(value) { this.innerUpgrade.canBeRefunded = value }

    get level() { return this.innerUpgrade.level }
    set level(value) { this.innerUpgrade.level = value }

    get maxLevel() { return this.innerUpgrade.maxLevel }
    set maxLevel(value) { this.innerUpgrade.maxLevel = value }

    buy() {
        if (this.level < this.maxLevel && this.isAvailable) {
            this.level += 1; 
            this.boughtOrRefunded();
        }
    }
    refund() {
        if (this.level > 0 && this.canBeRefunded(1)) {
            this.level -= 1; 
            this.boughtOrRefunded();
        }
    }
}

/**
 * Returns a formatted time string
 * @param {Number} time time in seconds
 * @returns {string}
 */
function getTimeString(time) {
  let mins = Math.floor(time / 60);
  let secs = time - 60 * mins;
  let hours = Math.floor(mins / 60);
  mins -= hours * 60;
  let days = Math.floor(hours / 24);
  hours -= days * 24;

  const hours_f = hours.toString().padStart(2, "0");
  const mins_f = mins.toString().padStart(2, "0");
  const secs_f = secs.toFixed(1).padStart(4, "0");

  if (days > 0) {
    return `${days}d ${hours_f}:${mins_f}:${secs_f}`;
  }
  else if (hours > 0) {
    return `${hours}:${mins_f}:${secs_f}`;
  }
  else {
    return `${mins}:${secs_f}`;
  }
}

/** 
 * Evaluates a polynomial at a given point. Inputs must be BigNumbers 
 * @param {BigNumber[]} poly Polynomial to be evaluated
 * @param {BigNumber} point
 */
var evalp = (poly, point) => {
    var res = ZERO;

    for (let i=0; i<poly.length; i++) {
        res += poly[i] * point.pow(i);
    }

    return res;
}

/** 
 * Computes the Riemann-Stieltjes integral from two polynomials 
 * @param {BigNumber[]} poly1
 * @param {BigNumber[]} poly2
 * @param {BigNumber} lBound
 * @param {BigNumber} hBound
 * @returns {BigNumber} Integral of poly1(X) * d(poly2(X)) between lBound and hBound
 * */
var rspInt = (poly1, poly2, lBound, hBound) => {
    var res = ZERO;

    for (let i=0; i<poly1.length; i++){
        for (let j=1; j<poly2.length; j++){
            res += BigNumber.from(j/(i+j)) * poly1[i] * poly2[j] * (hBound.pow(i+j) - lBound.pow(i+j))
        }
    }

    return res;
}


////////////
// Functions

/**
 * Switches the mode between alpha mode and rho mode
 */
var switchMode = () => {
    alphaMode = !alphaMode;

    q_rho = ONE;
    q_alpha = ONE;
    currencyRho.value = ZERO;
    currencyAlpha.value = ZERO;

    q1.level = 0;
    a0.level = 0;
    a1.level = 0;
    a2.level = 0;
    a3.level = 0
    b0.level = 0;
    b1.level = 0;
    b2.level = 0

    q1a.level = 0;
    a0a.level = 0;
    a1a.level = 0;
    a2a.level = 0;
    a3a.level = 0
    b0a.level = 0;
    b1a.level = 0;
    b2a.level = 0

    rhodot = ZERO;
    alphadot = ZERO;
    swapTime = 0;

    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();
    theory.clearGraph();
    updateAvailability();
}

var quickSwitchMode = () => {
    alphaMode = !alphaMode;
    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();
    theory.clearGraph();
    updateAvailability();
}

var init = () => {
    currencyRho = theory.createCurrency();
    currencyAlpha = theory.createCurrency("α", "\\alpha");

    ///////////////////
    // Regular Upgrades

    {
        let getDesc = (level) => `q_1=2^{${level}}-1`;
        let getInfo = (level) => `q_1=${getQ1(level).toString(0)}`;

        q1 = theory.createUpgrade(0, currencyRho, q1Cost);
        q1.getDescription = (_) => Utils.getMath(getDesc(q1.level));
        q1.getInfo = (amount) => Utils.getMathTo(getInfo(q1.level), getInfo(q1.level + amount));

        q1a = theory.createUpgrade(20, currencyAlpha, q1aCost);
        q1a.getDescription = (_) => Utils.getMath(getDesc(q1a.level));
        q1a.getInfo = (amount) => Utils.getMathTo(getInfo(q1a.level), getInfo(q1a.level + amount));
    }

    {
        let getDesc = (level) => `a_0=${a0bases[a0baseMs.level]}^{${level}}`;
        let getInfo = (level) => `a_0=${getA0(level).toString(2)}`;

        a0 = theory.createUpgrade(1, currencyRho, a0Cost);
        a0.getDescription = (_) => Utils.getMath(getDesc(a0.level));
        a0.getInfo = (amount) => Utils.getMathTo(getInfo(a0.level), getInfo(a0.level + amount));

        a0a = theory.createUpgrade(21, currencyAlpha, a0aCost);
        a0a.getDescription = (_) => Utils.getMath(getDesc(a0a.level));
        a0a.getInfo = (amount) => Utils.getMathTo(getInfo(a0a.level), getInfo(a0a.level + amount));
    }

    {
        let getDesc = (level) => `a_1=${a1bases[a1baseMs.level]}^{${level}}`;
        let getInfo = (level) => `a_1=${getA1(level).toString(2)}`;

        a1 = theory.createUpgrade(2, currencyRho, a1Cost);
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getInfo(a1.level), getInfo(a1.level + amount));

        
        a1a = theory.createUpgrade(22, currencyAlpha, a1aCost);
        a1a.getDescription = (_) => Utils.getMath(getDesc(a1a.level));
        a1a.getInfo = (amount) => Utils.getMathTo(getInfo(a1a.level), getInfo(a1a.level + amount));
    }

    {
        let getDesc = (level) => `a_2=${a2bases[a2baseMs.level]}^{${level}}`;
        let getInfo = (level) => `a_2=${getA2(level).toString(2)}`;

        a2 = theory.createUpgrade(3, currencyRho, a2Cost);
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getInfo(a2.level), getInfo(a2.level + amount));

        
        a2a = theory.createUpgrade(23, currencyAlpha, a2aCost);
        a2a.getDescription = (_) => Utils.getMath(getDesc(a2a.level));
        a2a.getInfo = (amount) => Utils.getMathTo(getInfo(a2a.level), getInfo(a2a.level + amount));
    }

    {
        let getDesc = (level) => `a_3=${a3bases[a3baseMs.level]}^{${level}}`;
        let getInfo = (level) => `a_3=${getA3(level).toString(2)}`;

        a3 = theory.createUpgrade(4, currencyRho, a3Cost);
        a3.getDescription = (_) => Utils.getMath(getDesc(a3.level));
        a3.getInfo = (amount) => Utils.getMathTo(getInfo(a3.level), getInfo(a3.level + amount));

        
        a3a = theory.createUpgrade(24, currencyAlpha, a3aCost);
        a3a.getDescription = (_) => Utils.getMath(getDesc(a3a.level));
        a3a.getInfo = (amount) => Utils.getMathTo(getInfo(a3a.level), getInfo(a3a.level + amount));
    }

    {
        let getDesc = (level) => `b_0=${b0bases[b0baseMs.level]}^{${level}}-1`;
        let getInfo = (level) => `b_0=${getB0(level).toString(2)}`;

        b0 = theory.createUpgrade(11, currencyRho, b0Cost);
        b0.getDescription = (_) => Utils.getMath(getDesc(b0.level));
        b0.getInfo = (amount) => Utils.getMathTo(getInfo(b0.level), getInfo(b0.level + amount));
        
        b0a = theory.createUpgrade(31, currencyAlpha, b0aCost);
        b0a.getDescription = (_) => Utils.getMath(getDesc(b0a.level));
        b0a.getInfo = (amount) => Utils.getMathTo(getInfo(b0a.level), getInfo(b0a.level + amount));
    }

    {
        let getDesc = (level) => `b_1=${b1bases[b1baseMs.level]}^{${level}}-1`;
        let getInfo = (level) => `b_1=${getB1(level).toString(2)}`;

        b1 = theory.createUpgrade(12, currencyRho, b1Cost);
        b1.getDescription = (_) => Utils.getMath(getDesc(b1.level));
        b1.getInfo = (amount) => Utils.getMathTo(getInfo(b1.level), getInfo(b1.level + amount));

        b1a = theory.createUpgrade(32, currencyAlpha, b1aCost);
        b1a.getDescription = (_) => Utils.getMath(getDesc(b1a.level));
        b1a.getInfo = (amount) => Utils.getMathTo(getInfo(b1a.level), getInfo(b1a.level + amount));
    }

    {
        let getDesc = (level) => `b_2=${b2bases[b2baseMs.level]}^{${level}}-1`;
        let getInfo = (level) => `b_2=${getB2(level).toString(2)}`;

        b2 = theory.createUpgrade(13, currencyRho, b2Cost);
        b2.getDescription = (_) => Utils.getMath(getDesc(b2.level));
        b2.getInfo = (amount) => Utils.getMathTo(getInfo(b2.level), getInfo(b2.level + amount));

        b2a = theory.createUpgrade(33, currencyAlpha, b2aCost);
        b2a.getDescription = (_) => Utils.getMath(getDesc(b2a.level));
        b2a.getInfo = (amount) => Utils.getMathTo(getInfo(b2a.level), getInfo(b2a.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currencyAlpha, pubUnlockCost);
    {
        rhoUnlock = theory.createPermanentUpgrade(1, currencyAlpha, new ConstantCost(rhoUnlockCost));
        rhoUnlock.getDescription = (_) => Localization.getUpgradeUnlockDesc("\\rho");
        rhoUnlock.getInfo = (_) => "Unlock $\\rho$ and unlock the ability to swap the $k$ and $h$ in the integral";
        rhoUnlock.boughtOrRefunded = (_) => updateAvailability();
        rhoUnlock.maxLevel = 1;
    }
    buyAllPerma = theory.createBuyAllUpgrade(2, currencyAlpha, 0);
    buyAllPerma.isAvailable = false;
    autobuyPerma = theory.createAutoBuyerUpgrade(3, currencyAlpha, 0);
    autobuyPerma.isAvailable = false;
    {
        kTermPerma = theory.createPermanentUpgrade(4, currencyAlpha, new CustomCost((level) => kTermCosts[level] || BigNumber.from("ee5")));
        kTermPerma.getDescription = () => Localization.getUpgradeAddTermDesc(kTermPerma.level > 0 ? "a_3" : "a_2");
        kTermPerma.getInfo = () => Localization.getUpgradeAddTermInfo(kTermPerma.level > 0 ? "a_3" : "a_2");
        kTermPerma.boughtOrRefunded = (_) => {
            theory.invalidateSecondaryEquation();
            updateAvailability();
        }
        kTermPerma.maxLevel = 2;
    }
    {
        hTermPerma = theory.createPermanentUpgrade(5, currencyAlpha, new CustomCost((level) => hTermCosts[level] || BigNumber.from("ee5")));
        hTermPerma.getDescription = () => Localization.getUpgradeAddTermDesc("b_2");
        hTermPerma.getInfo = () => Localization.getUpgradeAddTermInfo("b_2");
        hTermPerma.boughtOrRefunded = (_) => {
            theory.invalidateSecondaryEquation();
            updateAvailability();
        }
        hTermPerma.maxLevel = 1;
    }
    {
        const upgraded = [
            "variables $a_0$, $b_0$, $a_1$, $b_1$, $a_2$", // lv 1
            "variables $a_0$, $b_0$, $a_1$, $b_1$, $a_2$, $b_2$", // lv 2
            "variables $a_0$, $b_0$, $a_1$, $b_1$, $a_2$, $b_2$, $a_3$", // lv 3
            "variables $a_2$, $b_2$, $a_3$", // lv 4
            "variables $b_2$, $a_3$", // lv 5
            "$a_3$", // level 6
            "$a_3$" // maxed
        ]
        msLevelIncreasePerma = theory.createPermanentUpgrade(6, currencyAlpha, new CustomCost((level) => msLevelIncreaseCosts[level] || BigNumber.from("ee5")));
        msLevelIncreasePerma.getDescription = () => "Increase the max level of base increase milestones";
        msLevelIncreasePerma.getInfo = () => `Increase the max level of the base increase milestone for ${upgraded[msLevelIncreasePerma.level]} by 1`;
        msLevelIncreasePerma.boughtOrRefunded = (_) => updateAvailability();
        msLevelIncreasePerma.maxLevel = 6;
    }
    {
        rhoParallelUpgrade = theory.createPermanentUpgrade(7, currencyRho, new ConstantCost(rhoParallelCost));
        rhoParallelUpgrade.getDescription = () => `Allow $\\rho$ to be run in parallel with $\\alpha$ (${rhoParallelUpgrade.level + alphaParallelUpgrade.level}/2)`;
        rhoParallelUpgrade.getInfo = () => rhoParallelUpgrade.getDescription() + ". You need both upgrades to enable the feature.";
        rhoParallelUpgrade.boughtOrRefunded = (_) => updateAvailability();
        rhoParallelUpgrade.maxLevel = 1;
    }

    {
        pubTimeOverlay = theory.createPermanentUpgrade(50, currencyAlpha, new FreeCost);
        pubTimeOverlay.getDescription = () => `Publication time: ${getTimeString(pubTime)}`;
        pubTimeOverlay.info = "Elapsed time since the last publication";
        pubTimeOverlay.boughtOrRefunded = (_) =>
        {
            pubTimeOverlay.level = 0;
        }
    }

    {
        swapTimeOverlay  = theory.createPermanentUpgrade(51, currencyAlpha, new FreeCost);
        swapTimeOverlay.getDescription = () => `Swap time: ${getTimeString(swapTime)}`;
        swapTimeOverlay.info = "Elapsed time since swapping between $\\alpha$ and $\\rho$";
        swapTimeOverlay.boughtOrRefunded = (_) =>
        {
            swapTimeOverlay.level = 0;
        }
    }

    ///////////////////////
    //// True Milestone Upgrades

    theory.setMilestoneCost(new CustomCost((level) => trueMilestoneCosts[level] || BigNumber.from(-1)));
    {
        milestoneMenuUnlock = theory.createMilestoneUpgrade(0, 1);
        milestoneMenuUnlock.getDescription = () => "Unlock the milestone menu";
        milestoneMenuUnlock.getInfo = () => "Unlock the milestone menu";
        milestoneMenuUnlock.boughtOrRefunded = (_) => updateAvailability();
        milestoneMenuUnlock.canBeRefunded = () => false;
    }
    {
        buyAllMs = theory.createMilestoneUpgrade(1, 1);
        buyAllMs.getDescription = () => Localization.getUpgradeBuyAllDesc();
        buyAllMs.getInfo = () => Localization.getUpgradeBuyAllInfo();
        buyAllMs.boughtOrRefunded = (_) => {
            buyAllPerma.level = buyAllMs.level;
            updateAvailability();
        }
        buyAllMs.canBeRefunded = () => false;
    }
    {
        autobuyMs = theory.createMilestoneUpgrade(2, 1);
        autobuyMs.getDescription = () => Localization.getUpgradeAutoBuyerDesc();
        autobuyMs.getInfo = () => Localization.getUpgradeAutoBuyerInfo();
        autobuyMs.boughtOrRefunded = (_) => {
            autobuyPerma.level = autobuyMs.level;
            updateAvailability();
        }
        autobuyMs.canBeRefunded = () => false;
    }

    ///////////////////////
    //// Custom Milestone Upgrades

    /**
     * 
     * @param {Upgrade} upgrade 
     * @param {string} upgradeName 
     * @param {number[]} bases 
     */
    var makeBaseUpgrade = (upgrade, upgradeName, bases) => {
        upgrade.getDescription = (_) => Localization.getUpgradeIncCustomDesc(`${upgradeName} \\text{ base}`, `${
            upgrade.level < upgrade.maxLevel ? r5(bases[upgrade.level + 1] - bases[upgrade.level]) : 0
        }`)
        upgrade.getInfo = (_) => `$${upgradeName}$ base: ` + (upgrade.level < upgrade.maxLevel
            ? Utils.getMathTo(`${bases[upgrade.level]}`, `${bases[upgrade.level + 1]}`)
            : Utils.getMath(`${bases[upgrade.level]}`));
        upgrade.boughtOrRefunded = () => updateAvailability();
    }

    
    {
        a1baseMs = new CustomMilestoneUpgrade(0, 4);
        makeBaseUpgrade(a1baseMs, "a_1", a1bases);
        a1baseMs.canBeRefunded = () => alphaParallelUpgrade.level == 0;
    }
    {
        b1baseMs = new CustomMilestoneUpgrade(1, 4);
        makeBaseUpgrade(b1baseMs, "b_1", b1bases);
        b1baseMs.canBeRefunded = () => alphaParallelUpgrade.level == 0;
    }
    {
        a0baseMs = new CustomMilestoneUpgrade(2, 4);
        makeBaseUpgrade(a0baseMs, "a_0", a0bases);
        a0baseMs.canBeRefunded = () => alphaParallelUpgrade.level == 0;
    }
    {
        b0baseMs = new CustomMilestoneUpgrade(3, 4);
        makeBaseUpgrade(b0baseMs, "b_0", b0bases);
        b0baseMs.canBeRefunded = () => alphaParallelUpgrade.level == 0;
    }
    {
        a2baseMs = new CustomMilestoneUpgrade(4, 4);
        makeBaseUpgrade(a2baseMs, "a_2", a2bases);
        a2baseMs.canBeRefunded = () => alphaParallelUpgrade.level == 0;
    }
    {
        b2baseMs = new CustomMilestoneUpgrade(5, 4);
        makeBaseUpgrade(b2baseMs, "b_2", b2bases);
        b2baseMs.canBeRefunded = () => alphaParallelUpgrade.level == 0;
    }
    {
        a3baseMs = new CustomMilestoneUpgrade(6, 4);
        makeBaseUpgrade(a3baseMs, "a_3", a3bases);
        a3baseMs.canBeRefunded = () => alphaParallelUpgrade.level == 0;
    }
    {
        alphaParallelUpgrade = new CustomMilestoneUpgrade(7, 1);
        alphaParallelUpgrade.getDescription = () => `Allow $\\alpha$ to be run in parallel with $\\rho$ (${rhoParallelUpgrade.level + alphaParallelUpgrade.level}/2)`;
        alphaParallelUpgrade.getInfo = () => alphaParallelUpgrade.getDescription() + ". You need both upgrades to enable the feature.";
        alphaParallelUpgrade.boughtOrRefunded = () => updateAvailability();
        alphaParallelUpgrade.canBeRefunded = () => false;
    }
    

    ///////////////////
    //// Debug Upgrades

    //{
    //    debugResetMilestonesUpgrade = theory.createPermanentUpgrade(500, currencyRho, new FreeCost);
    //    debugResetMilestonesUpgrade.description = "[Debug] reset milestones";
    //    debugResetMilestonesUpgrade.boughtOrRefunded = (_) => {
    //        debugResetMilestonesUpgrade.level = 0;
    //        for (let msUpgrade of milestoneArray) {
    //            msUpgrade.level = 0;
    //            msUpgrade.boughtOrRefunded();
    //            milestonesAvailable = 0;
    //            totalMilestonePoints = 0;
    //        }
    //        milestoneMenuUnlock.level = 0;
    //        buyAllMs.level = 0;
    //        autobuyMs.level = 0;
    //
    //        kTermPerma.refund(-1);
    //        hTermPerma.refund(-1);
    //        msLevelIncreasePerma.refund(-1);
    //    }
    //}
    
    updateAvailability();
}

var updateAvailability = () => {
    parallelMode = rhoParallelUpgrade.level + alphaParallelUpgrade.level == 2;

    // Regular milestones
    buyAllMs.isAvailable = milestoneMenuUnlock.level > 0;
    autobuyMs.isAvailable = buyAllMs.level > 0;

    // Perma upgrades
    swapTimeOverlay.isAvailable = rhoUnlock.level > 0 && !parallelMode;
    rhoParallelUpgrade.isAvailable = msLevelIncreasePerma.level == 6;

    // Upgrades
    for (var v of [q1,a0,a1,a2,a3,b1,b2]) {
        v.isAvailable = !alphaMode;
    }
    for (var v of [q1a,a1a,a2a,a3a,b0a,b1a,b2a]) {
        v.isAvailable = alphaMode;
    }

    b0.isAvailable = false;
    a0a.isAvailable = false;

    a2.isAvailable &&= kTermPerma.level > 0;
    a2a.isAvailable &&= kTermPerma.level > 0;

    a3.isAvailable &&= kTermPerma.level > 1;
    a3a.isAvailable &&= kTermPerma.level > 1;

    b2.isAvailable &&= hTermPerma.level > 0;
    b2a.isAvailable &&= hTermPerma.level > 0;

    // Custom milestones
    a0baseMs.maxLevel = Math.min(4, 1 + msLevelIncreasePerma.level);
    b0baseMs.maxLevel = Math.min(4, 1 + msLevelIncreasePerma.level);
    a1baseMs.maxLevel = Math.min(4, 1 + msLevelIncreasePerma.level);
    b1baseMs.maxLevel = Math.min(4, 1 + msLevelIncreasePerma.level);

    a2baseMs.isAvailable = kTermPerma.level > 0;
    a2baseMs.maxLevel = Math.min(4, msLevelIncreasePerma.level);

    b2baseMs.isAvailable = hTermPerma.level > 0;
    b2baseMs.maxLevel = Math.max(Math.min(4, msLevelIncreasePerma.level - 1), 0);

    a3baseMs.isAvailable = kTermPerma.level > 1;
    a3baseMs.maxLevel = Math.max(Math.min(4, msLevelIncreasePerma.level - 2), 0);

    alphaParallelUpgrade.isAvailable = a0baseMs.level + a1baseMs.level + a2baseMs.level + a3baseMs.level
        + b0baseMs.level + b1baseMs.level + b2baseMs.level == 28;

}

var tickSystem = (elapsedTime, multiplier, alphaMode) => {
    const dt = elapsedTime * multiplier;
    const bonus = theory.publicationMultiplier;

    const vq1 = getQ1((alphaMode ? q1a : q1).level);

    const va0 = getA0((alphaMode ? a0a : a0).level);
    const va1 = getA1((alphaMode ? a1a : a1).level);
    const va2 = getA2((alphaMode ? a2a : a2).level);
    const va3 = getA3((alphaMode ? a3a : a3).level);

    const vb0 = getB0((alphaMode ? b0a : b0).level);
    const vb1 = getB1((alphaMode ? b1a : b1).level);
    const vb2 = getB2((alphaMode ? b2a : b2).level);

    const PHI_PLUS_ONE = ONE + PHI;
    if (alphaMode) {
        q_alpha = (q_alpha.pow(PHI_PLUS_ONE) + dt * vq1).pow(ONE/PHI_PLUS_ONE);
    }
    else {
        q_rho = (q_rho.pow(PHI_PLUS_ONE) + dt * vq1).pow(ONE/PHI_PLUS_ONE);
    }

    let k = [va0, va1];
    if (kTermPerma.level > 0) k.push(va2);
    if (kTermPerma.level > 1) k.push(va3);

    let h = [vb0, vb1];
    if (hTermPerma.level > 0) h.push(vb2);

    cur_h = evalp(h, PHI);
    maxh = maxh.max(cur_h);
    lifetime_h = lifetime_h.max(maxh);

    if (alphaMode) {
        const integral = rspInt(h, k, ZERO, q_alpha);
        alphadot = integral * bonus * multiplier;
        currencyAlpha.value += alphadot * elapsedTime;
    }
    else {
        const integral = rspInt(k, h, ZERO, q_rho);
        rhodot = integral * bonus * multiplier;
        currencyRho.value += rhodot * elapsedTime;
    }

    return cur_h;
}

var tick = (elapsedTime, multiplier) => {
    if (q1.level + q1a.level == 0) {
        return;
    }

    multiplier *= s6_speed_multiplier;

    pubTime += elapsedTime;
    swapTime += elapsedTime;

    if (!parallelMode) {
        tickSystem(elapsedTime, multiplier, alphaMode);
    }
    else {
        let alpha_h = tickSystem(elapsedTime, multiplier, true);
        let rho_h = tickSystem(elapsedTime, multiplier, false);
        cur_h = alphaMode ? alpha_h : rho_h;
    }

    maxrho = maxrho.max(currencyRho.value);
    lifetime_rho = lifetime_rho.max(maxrho);

    if (totalMilestonePoints < milestoneCount 
        && theory.tau >= milestoneCosts[totalMilestonePoints] / getMilestoneCostReduction()
    ) {
        totalMilestonePoints++;
        milestonesAvailable++;
    }

    if (parallelMode && theory.isAutoBuyerActive) {
        autobuyCooldown -= elapsedTime;
        if (autobuyCooldown <= 0) {
            const extra_upgrades = alphaMode ? [q1,a0,a1,a2,a3,b1,b2] : [q1a,a1a,a2a,a3a,b0a,b1a,b2a];
            for (var upgrade of extra_upgrades) {
                let prev_available = upgrade.isAvailable;
                upgrade.isAvailable = true;
                if (upgrade.isAutoBuyable) {
                    upgrade.buy(-1);
                }
                upgrade.isAvailable = prev_available;
            }
            autobuyCooldown = 1 / game.automation.rate;
        }
    }
    
    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();
}

var postPublish = () => {
    currencyRho.value = ZERO;
    currencyAlpha.value = ZERO;
    q_rho = ONE;
    q_alpha = ONE;
    maxh = ZERO;
    maxrho = ONE;
    pubTime = 0;
    swapTime = 0;

    rhodot = ZERO;
    alphadot = ZERO;

    alphaMode = true;

    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();
    updateAvailability();
}

var getInternalState = () => JSON.stringify({
    version,
    alphaMode,
    milestonesAvailable,
    totalMilestonePoints,
    maxh: maxh.toBase64String(),
    q_rho: q_rho.toBase64String(),
    q_alpha: q_alpha.toBase64String(),
    pubTime,
    swapTime,
    maxrho: maxrho.toBase64String(),
    lifetime_h: lifetime_h.toString(),
    lifetime_rho: lifetime_rho.toString()
})

var setInternalState = (stateStr) => {
    if (!stateStr) return;

    /**
     * @param {String} str 
     * @param {BigNumber} defaultValue
     */
    const parseBigNumBSF = (str, defaultValue) => {
        if (str) {
            try {
                return BigNumber.fromBase64String(str);
            }
            catch {
                return defaultValue;
            }
        }
        else {
            return defaultValue;
        }
    };

    const parseBigNum = (str, defaultValue) => {
        if (str) return BigNumber.from(str);
        else return defaultValue;
    }

    const state = JSON.parse(stateStr);

    alphaMode = state.alphaMode ?? false;
    milestonesAvailable = state.milestonesAvailable ?? 0;
    totalMilestonePoints = state.totalMilestonePoints ?? 0;
    maxh = parseBigNumBSF(state.maxh, ZERO);
    q_rho = parseBigNumBSF(state.q_rho, parseBigNumBSF(state.q, ONE));
    q_alpha = parseBigNumBSF(state.q_alpha, parseBigNumBSF(state.q, ONE));
    pubTime = state.pubTime ?? 0;
    swapTime = state.swapTime ?? 0;
    maxrho = parseBigNumBSF(state.maxrho, ZERO);
    lifetime_h = parseBigNum(state.lifetime_h, ZERO);
    lifetime_rho = parseBigNum(state.lifetime_rho, ZERO);
}

/////
// UI

/** 
 * UI image size
 * @param {Number} width 
 */
var getImageSize = (width) => {
  if(width >= 1080)
    return 48;
  if(width >= 720)
    return 36;
  if(width >= 360)
    return 24;
  return 20;
}

var createSwitcherFrame = () => {
    let triggerable = true;
    let fontSize = 32;

    let label = ui.createLabel({
        margin: new Thickness(0, 0, 0, 0),
        padding: new Thickness(2, 0, 10, 10),
        text: "⇌",
        textColor: Color.TEXT_MEDIUM,
        fontAttributes: FontAttributes.BOLD,
        horizontalTextAlignment: TextAlignment.START,
        verticalTextAlignment: TextAlignment.END,
        fontSize: fontSize,
        opacity: 1,
    })

    label.onTouched = (e) =>
    {
        if(e.type == TouchType.PRESSED)
        {
            label.opacity = 0.4;
        }
        else if(e.type.isReleased())
        {
            label.opacity = 1;
            if(triggerable)
            {
                Sound.playClick();
                if (parallelMode) {
                    quickSwitchMode();
                }
                else {
                createSwitcherMenu().show();
                }
            }
            else
                triggerable = true;
        }
        else if(e.type == TouchType.MOVED && (e.x < 0 || e.y < 0 ||
        e.x > label.width || e.y > label.height))
        {
            label.opacity = 0.4;
            triggerable = false;
        }
    };

    return label;
}

const switcherFrame = createSwitcherFrame();

var getEquationOverlay = () =>
{
    let switcherButtonContainer = ui.createGrid
    ({
        row: 0, column: 0,
        isVisible: () => rhoUnlock.level > 0,
        margin: new Thickness(0,0,2,0),
        horizontalOptions: LayoutOptions.START,
        verticalOptions: LayoutOptions.START,
        inputTransparent: true,
        cascadeInputTransparent: false,
        //backgroundColor: Color.fromRgb(1,0,0),
        children: [switcherFrame]
    });

    let milestoneMenuButton = ui.createImage({
        row: 0, column: 2,
        inputTransparent: false,
        source: ImageSource.ARROW_90,
        widthRequest: getImageSize(ui.screenWidth),
        heightRequest: getImageSize(ui.screenWidth),
        margin: new Thickness(0,18,10,0),
        isVisible: () => milestoneMenuUnlock.level > 0,
        opacity: () => milestonesAvailable > 0 ? 1 : 0.5,
        useTint: true,
        aspect: Aspect.ASPECT_FILL,
        horizontalOptions: LayoutOptions.END,
        verticalOptions: LayoutOptions.START,
        onTouched: (e) => {
            if (e.type == TouchType.PRESSED) {
                milestoneMenuButton.opacity = 0.25;
            }
            if (e.type.isReleased()) {
                milestoneMenuButton.opacity = () => milestonesAvailable > 0 ? 1 : 0.5;
                milestoneInfoPressed = false;
                createMilestoneMenu().show();
            }
        },
    });

    let result = ui.createGrid
    ({
        columnDefinitions: ["1*", "3*", "1*"],
        columnSpacing: 0,
        inputTransparent: true,
        cascadeInputTransparent: false,
        children:
        [
            switcherButtonContainer,
            milestoneMenuButton,
        ],
        onTouched: (event) => {
            if (event.type == TouchType.PRESSED || event.type.isReleased()) {
            mainEquationPressed = event.type == TouchType.PRESSED;
            theory.invalidatePrimaryEquation();
            }
        },
    });
    return result;
}

var createSwitcherMenu = () => {
    let menu = ui.createPopup({
        title: "Switch Mode",
        isPeekable: true,
        content: ui.createStackLayout({
            children: [
                ui.createLatexLabel({
                    margin: new Thickness(0, 0, 0, 6),
                    text: () => {
                        const newcurrency = Utils.getMath(alphaMode ? "\\rho" : "\\alpha")
                        return `Swap $h$ and $k$ in the integral and switch the currency to ${newcurrency}.`;
                    },
                    horizontalTextAlignment: TextAlignment.CENTER,
                    verticalTextAlignment: TextAlignment.CENTER
                }),
                ui.createLatexLabel({
                    margin: new Thickness(0, 0, 0, 6),
                    text: "Your currencies, levels and $q$ are reset"+
                    " but $\\max{h(\\phi)}$ is kept.",
                    horizontalTextAlignment: TextAlignment.CENTER,
                    verticalTextAlignment: TextAlignment.CENTER
                }),
                ui.createButton
                ({
                    margin: new Thickness(0, 0, 0, 6),
                    text: "Switch Now",
                    onReleased: () => { 
                        switchMode(),
                        menu.hide()
                    }
                })
            ]
        })
    })

    return menu;
}

/**
 * Creates the UI for a milestone upgrade
 * @param {CustomMilestoneUpgrade} milestone 
 * @returns 
 */
var createMilestoneUpgradeUI = (milestone) => {
    let refund_button_pressed = false;
    let refund_button_triggerable = true;
    let frame_triggerable = true;

    let isMilestoneBuyable = () => milestone.level < milestone.maxLevel && milestonesAvailable > 0;

    let refundButton = ui.createImage({
        useTint: true,
        opacity: () => (milestone.canBeRefunded(1) && !refund_button_pressed) ? 0.5 : 0.25,
        source: ImageSource.REFUND,
        widthRequest: getImageSize(ui.screenWidth),
        heightRequest: getImageSize(ui.screenWidth),
        aspect: Aspect.ASPECT_FILL,
        margin: new Thickness(0,0,0,0),
        isVisible: true,
        horizontalOptions: LayoutOptions.END,
        verticalOptions: LayoutOptions.CENTER,
    });

    refundButton.onTouched = (e) =>
    {
        if(!milestone.canBeRefunded(1)) {
            return;
        }
        if(e.type == TouchType.PRESSED)
        {
            refund_button_pressed = true;
        }
        else if(e.type.isReleased())
        {
            refund_button_pressed = false;
            if(refund_button_triggerable)
            {
                Sound.playClick();
                milestone.refund();
                milestonesAvailable++;
            }
            else
                refund_button_triggerable = true;
        }
        else if(e.type == TouchType.MOVED && (e.x < 0 || e.y < 0 ||
        e.x > refundButton.width || e.y > refundButton.height))
        {
            refund_button_pressed = true;
            refund_button_triggerable = false;
        }
    };

    let frame = ui.createFrame({
        horizontalOptions: LayoutOptions.FILL_AND_EXPAND,
        verticalOptions: LayoutOptions.FILL_AND_EXPAND,
        widthRequest: ui.screenWidth,
        heightRequest: Math.round(ui.screenHeight / 13),
        content: ui.createGrid({
            columnDefinitions: ["*", "auto"],
            inputTransparent: true,
            cascadeInputTransparent: true,
            children: [
                ui.createLatexLabel({
                    opacity: () => isMilestoneBuyable() ? 1 : 0.5,
                    margin: new Thickness(10,3,0,0),
                    text: () => milestoneInfoPressed ? milestone.getInfo(1) : milestone.getDescription(1),
                    verticalOptions: LayoutOptions.CENTER,
                    row: 0,
                    column: 0,
                }),
                ui.createLatexLabel({
                    opacity: () => isMilestoneBuyable() ? 1 : 0.5,
                    fontSize: 11,
                    margin: new Thickness(0,0,8,8),
                    text: () => Utils.getMath(`${milestone.level}/${milestone.maxLevel}`),
                    verticalOptions: LayoutOptions.END,
                    row: 0,
                    column: 1,
                }),
            ]
        })
    })

    frame.onTouched = (e) =>
    {
        if (!isMilestoneBuyable()) {
            return;
        }
        if(e.type == TouchType.PRESSED)
        {
            frame.opacity = 0.4;
        }
        else if(e.type.isReleased())
        {
            frame.opacity = 1;
            if(frame_triggerable)
            {
                Sound.playClick();
                milestone.buy();
                milestonesAvailable--;
            }
            else
                frame_triggerable = true;
        }
        else if(e.type == TouchType.MOVED && (e.x < 0 || e.y < 0 ||
        e.x > frame.width || e.y > frame.height))
        {
            frame.opacity = 0.4;
            frame_triggerable = false;
        }
    };

    return ui.createStackLayout({
        orientation: StackOrientation.HORIZONTAL,
        horizontalOptions: LayoutOptions.START_AND_EXPAND,
        margin: new Thickness(0,2,0,0),
        isVisible: () => milestone.isAvailable,
        children: [
            refundButton,
            frame
        ]
    })
}

var createMilestoneMenu = () => {
    let info_button_pressed = false;

    let infoButton = ui.createImage({
        useTint: true,
        opacity: () => info_button_pressed ? 1 : 0.5,
        source: ImageSource.INFO,
        widthRequest: getImageSize(ui.screenWidth),
        heightRequest: getImageSize(ui.screenWidth),
        aspect: Aspect.ASPECT_FILL,
        margin: new Thickness(0,0,0,0),
        isVisible: true,
        horizontalOptions: LayoutOptions.END,
        verticalOptions: LayoutOptions.CENTER,
        column: 1
    });

    infoButton.onTouched = (e) =>
    {
        if(e.type == TouchType.PRESSED)
        {
            info_button_pressed = true;
            milestoneInfoPressed = true;
        }
        else if(e.type.isReleased())
        {
            info_button_pressed = false;
            milestoneInfoPressed = false;
        }
        else if(e.type == TouchType.MOVED && (e.x < 0 || e.y < 0 ||
        e.x > infoButton.width || e.y > infoButton.height))
        {
            info_button_pressed = true;
            milestoneInfoPressed = true;
        }
    };

    let menu = ui.createPopup({
        title: Localization.get("PublicationPopupMilestones"),
        isPeekable: true,
        content: ui.createStackLayout({
            children: [
                // Cost reduction formula
                ui.createLatexLabel({
                    margin: new Thickness(0, 0, 0, 6),
                    text: "Milestone cost reduction: " + Utils.getMath("R = 1 + \\max{h(\\phi)}^{4}"),
                    horizontalTextAlignment: TextAlignment.CENTER,
                    verticalTextAlignment: TextAlignment.START
                }),
                // Current milestone reduction
                ui.createLatexLabel({
                    margin: new Thickness(0, 0, 0, 6),
                    text: () => Utils.getMath(`R = ${getMilestoneCostReduction()}`),
                    horizontalTextAlignment: TextAlignment.CENTER,
                    verticalTextAlignment: TextAlignment.START
                }),
                // Next milestone cost
                ui.createLatexLabel({
                    margin: new Thickness(0, 0, 0, 6),
                    text: () => totalMilestonePoints < milestoneCount 
                        ? Localization.format(
                            Localization.get("PublicationPopupMileDesc"), 
                            Utils.getMath(`${milestoneCosts[totalMilestonePoints] / getMilestoneCostReduction()}${theory.latexSymbol}`)
                        )
                        : Localization.get("PublicationPopupMileDone"),
                    horizontalTextAlignment: TextAlignment.CENTER,
                    verticalTextAlignment: TextAlignment.START
                }),
                // Upgrades left
                ui.createLatexLabel({
                    margin: new Thickness(0, 0, 0, 6),
                    fontSize: 12,
                    text: () => Localization.format(Localization.get("PublicationPopupMileLeft"), milestonesAvailable),
                    horizontalTextAlignment: TextAlignment.CENTER,
                    verticalTextAlignment: TextAlignment.START
                }),
                // Info button
                ui.createGrid({
                    columnDefinitions: ["*", "auto", "*"],
                    horizontalOptions: LayoutOptions.FILL_AND_EXPAND,
                    widthRequest: ui.screenWidth,
                    children: [infoButton]
                }),
                // Milestone list
                ui.createScrollView({
                    content: ui.createStackLayout({
                        children: [...milestoneArray.map((upg) => createMilestoneUpgradeUI(upg))]
                    })
                })
            ]
        })
    })

    return menu;
}

/**
 * 0 is for rho, 1 is for alpha
 * @param {Number} index 
 * @returns 
 */
var isCurrencyVisible = (index) => parallelMode || !(index ^ alphaMode);

var getTauEquation = () => {
    if (rhoUnlock.level === 0) return `\\max{(h(\\phi))^{${maxhExponent}}}`;
    else return `\\max{\\rho^{${rhoExponent}}} \\times \\max{(h(\\phi))^{${maxhExponent}}}`;
}

var getQRepr = () => {
    if (!parallelMode) {
        return 'q';
    }
    else {
        return 'q_' + (alphaMode ? '{\\alpha}' : '{\\rho}');
    }
}

var getPrimaryEquation = () => {
    let result = ``;

    theory.primaryEquationHeight = 90
    theory.primaryEquationScale = 1.25

    const q = getQRepr();

    if (mainEquationPressed) {
        result += "\\int_{A}^{B}{P(x)dQ(x)} = \\int_{A}^{B}{P(x)Q'(x)dx}"
    }
    else {
        if (alphaMode) {
            result += `\\dot{\\alpha}=\\int_{0}^{${q}}{h(x)dk(x)}`;
        }
        else {
            result += `\\dot{\\rho}=\\int_{0}^{${q}}{k(x)dh(x)}`;
        }
    }
    
    return result;
}

var getSecondaryEquation = () => {
    let result = ``;

    if (mainEquationPressed) {
        result += "\\phi = \\frac{1+\\sqrt{5}}{2} \\\\";
        result += `\\text{Lifetime } h(\\phi) = ${lifetime_h} \\\\`;
        if (rhoUnlock.level > 0) result += `\\text{Lifetime } \\rho = ${lifetime_rho}`;
        return result;
    }

    theory.secondaryEquationHeight = 100;
    theory.secondaryEquationScale = 1.25;

    let k = "{a_1}x + a_0";
    if (kTermPerma.level > 0) {
        k = "{a_2}x^2 + " + k;
    }
    if (kTermPerma.level > 1) {
        k = "{a_3}x^3 + " + k;
    }

    let h = "{b_1}x + b_0";
    if (hTermPerma.level > 0) {
        h = "{b_2}x^2 + " + h;
    }
    
    const q = getQRepr();
    result += `k(x) = ${k}\\\\h(x) = ${h}\\\\`;
    result += `\\dot{${q}} = q_1 {${q}}^{-\\phi},\\quad`;
    if (alphaMode) {
        result += `\\dot{\\alpha} = ${alphadot.toString()}`;
    }
    else {
        result += `\\dot{\\rho} = ${rhodot.toString()}`;
    }

    result += `\\\\${theory.latexSymbol} = ${getTauEquation()}`;

    return result;
}

var getTertiaryEquation = () => {
    let result = ``;

    result += `${getQRepr()}=${alphaMode ? q_alpha : q_rho} \\\\`;
    result += `h(\\phi)=${cur_h}, \\max{h(\\phi)} = ${maxh}`;
    result += `\\\\ ${getTauEquation()} = ${getTau()}`;

    return result;
}

var get2DGraphValue = () => alphaMode ?
    currencyAlpha.value.sign * (ONE + currencyAlpha.value.abs()).log10().toNumber()
    : currencyRho.value.sign * (ONE + currencyRho.value.abs()).log10().toNumber()

init();
