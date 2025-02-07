import { ConstantCost, CustomCost, ExponentialCost, FreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { BigNumber } from "../api/BigNumber";
import { theory, QuaternaryEntry } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "magnetic_fields_season2";
var name = "Magnetic Fields (Season 2)";
var description = 
"A Custom Theory to explore the basic concepts of Magnetic Fields.\n"+
"Discover the equations that describe the movement of a charged particle inside a solenoid of infinite length.\n"+
"Watch how rho grows as the particle moves away from its starting position and the magnetic field becomes stronger.\n"+
"Reset the particle's position to update its velocity to increase your long-term benefits.\n"+
"Have fun!\n"+
"Version 0.31"
var authors = "Mathis S.\n" +
"Thanks to the amazing Exponential Idle community for their support and feedback on this theory!";
var version = 3;
var releaseOrder = '8';

const tauRate = 1;
const pubExponent = 0.17;

const mu0 = BigNumber.FOUR * BigNumber.PI * BigNumber.from(1e-7);
const q0 = BigNumber.from(1.602e-19);

const i0 = BigNumber.from(1e-15);
const defaultmass = BigNumber.from(1e-3)

var currency;
var quaternaryEntries;
var stage = 1;

var rhodot = BigNumber.ZERO;

var x = BigNumber.ZERO;
var vx = BigNumber.ZERO;
var vz = BigNumber.ZERO;
var vtot = BigNumber.ZERO;

var q = BigNumber.ZERO;
var m = BigNumber.ONE;
var I = BigNumber.ZERO;
var omega = BigNumber.ZERO;
var B = BigNumber.ZERO;

var t = BigNumber.ZERO;
//var t_dot = BigNumber.ZERO;
var ts = BigNumber.ZERO;
var C = BigNumber.ZERO;

//var resetUpgrade;
var c1, c2, v1, v2, v3, v4, a1, a2, delta;

var chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7;

let endtau = BigNumber.from("1e600")

var numberFormat = (value, decimals) => {
    if (value >= BigNumber.ZERO)
    {
        if (value > BigNumber.from(0.1) || value == BigNumber.ZERO) 
        {
            return value.toString(decimals);
        }
        else
        {
            let exp = Math.floor((value*BigNumber.from(1+1e-5)).log10().toNumber());
            let mts = (value * BigNumber.TEN.pow(-exp)).toString(decimals);
            return `${mts}e${exp}`;
        }
    }
    else
    {
        value = -value;
        if (value > BigNumber.from(0.1) || value == BigNumber.ZERO) 
        {
            return (-value).toString(decimals);
        }
        else
        {
            let exp = Math.floor((value*BigNumber.from(1+1e-5)).log10().toNumber());
            let mts = (value * BigNumber.TEN.pow(-exp)).toString(decimals);
            return `-${mts}e${exp}`;
        }
    }
}


var resetSimulation = () => {
    ts = BigNumber.ZERO;
    x = BigNumber.ZERO;
    vx = (getV1(v1.level) * getV2(v2.level)) * BigNumber.from("1e-20");
    vz = (getV3(v3.level) * getV4(v4.level)) * BigNumber.from("1e-18");
    vtot = (vx.pow(BigNumber.TWO) + BigNumber.TWO * vz.pow(BigNumber.TWO)).sqrt();
    theory.invalidateQuaternaryValues();
}


var init = () => {
    currency = theory.createCurrency();
    quaternaryEntries = [];

    ///////////////////
    // Regular Upgrades

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(0);
        c1 = theory.createUpgrade(2, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(2))));
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));
    }

    // c2
    {
        let getDesc = (level) => "c_2=2^{" + level + "}";
        let getInfo = (level) => "c_2=" + getC2(level).toString(0);
        c2 = theory.createUpgrade(3, currency, new ExponentialCost(1000, Math.log2(100)));
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
    }

    // a1
    {
        let getDesc = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(4, currency, new ExponentialCost(1000, Math.log2(25)));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getDesc(a1.level), getDesc(a1.level + amount));
    }

    // a2
    {
        let getDesc = (level) => "a_2={1.25}^{" + level + "}";
        let getInfo = (level) => "a_2=" + getA2(level).toString(3);
        a2 = theory.createUpgrade(5, currency, new ExponentialCost(1e4, Math.log2(55)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getInfo(a2.level), getInfo(a2.level + amount));
    }

    // delta
    {
        let getDesc = (level) => "{\\delta}={1.1}^{" + level + "}";
        let getInfo = (level) => "{\\delta}=" + getDelta(level).toString(3);
        delta = theory.createUpgrade(6, currency, new ExponentialCost(1e50, Math.log2(300)));
        delta.getDescription = (_) => Utils.getMath(getDesc(delta.level));
        delta.getInfo = (amount) => Utils.getMathTo(getInfo(delta.level), getInfo(delta.level + amount));
    }

    // v1
    {
        let getDesc = (level) => "v_1=" + getV1(level).toString(0);
        v1 = theory.createUpgrade(7, currency, new ExponentialCost(80, Math.log2(80)));
        v1.getDescription = (_) => Utils.getMath(getDesc(v1.level));
        v1.getInfo = (amount) => Utils.getMathTo(getDesc(v1.level), getDesc(v1.level + amount));
    }

    // v2
    {
        let getDesc = (level) => "v_2={1.3}^{" + level + "}";
        let getInfo = (level) => "v_2=" + getV2(level).toString(3);
        v2 = theory.createUpgrade(8, currency, new ExponentialCost(1e4, 4.5*Math.log2(10)));
        v2.getDescription = (_) => Utils.getMath(getDesc(v2.level));
        v2.getInfo = (amount) => Utils.getMathTo(getInfo(v2.level), getInfo(v2.level + amount));
    }

    // v3
    {
        let getDesc = (level) => "v_3=" + getV3(level).toString(0);
        v3 = theory.createUpgrade(9, currency, new ExponentialCost(1e50, Math.log2(70)));
        v3.getDescription = (_) => Utils.getMath(getDesc(v3.level));
        v3.getInfo = (amount) => Utils.getMathTo(getDesc(v3.level), getDesc(v3.level + amount));
    }

    // v4
    {
        let getDesc = (level) => "v_4={1.5}^{" + level + "}";
        let getInfo = (level) => "v_4=" + getV4(level).toString(3);
        v4 = theory.createUpgrade(10, currency, new ExponentialCost(1e55, 6*Math.log2(10)));
        v4.getDescription = (_) => Utils.getMath(getDesc(v4.level));
        v4.getInfo = (amount) => Utils.getMathTo(getInfo(v4.level), getInfo(v4.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e8);
    theory.createBuyAllUpgrade(1, currency, 1e10);
    theory.createAutoBuyerUpgrade(2, currency, 1e13);

    ///////////////////////
    //// Milestone Upgrades
    const milestoneArray = [20, 50, 175, 225, 275, 325, 425, 475, 525, -1]
    theory.setMilestoneCost(new CustomCost((lvl) => tauRate * BigNumber.from(milestoneArray[Math.min(lvl, 9)])));

    {
        velocityTerm = theory.createMilestoneUpgrade(0, 1);
        velocityTerm.description = Localization.getUpgradeAddTermDesc("v");
        velocityTerm.info = Localization.getUpgradeAddTermInfo("v");
        velocityTerm.canBeRefunded = (_) => (deltaVariable.level === 0);
        velocityTerm.boughtOrRefunded = (_) => {
            updateC();
            theory.invalidatePrimaryEquation();
            theory.invalidateSecondaryEquation();
            theory.invalidateQuaternaryValues();
            updateAvailability();
        }
    }

    {
        deltaVariable = theory.createMilestoneUpgrade(1, 1);
        deltaVariable.description = Localization.getUpgradeAddTermDesc("\\delta");
        deltaVariable.info = Localization.getUpgradeAddTermInfo("\\delta");
        deltaVariable.canBeRefunded = (_) => (xExp.level === 0 && omegaExp.level === 0);
        deltaVariable.boughtOrRefunded = (_) => {
            theory.invalidateTertiaryEquation();
            updateAvailability();
        }
    }

    {
        xExp = theory.createMilestoneUpgrade(2, 2);
        xExp.description = Localization.getUpgradeIncCustomExpDesc("x", "0.24");
        xExp.info = Localization.getUpgradeIncCustomExpInfo("x", "0.24");
        xExp.canBeRefunded = (_) => (vExp.level === 0 && a1Exp.level === 0);
        xExp.boughtOrRefunded = (_) => {
            updateC();
            theory.invalidatePrimaryEquation();
            theory.invalidateSecondaryEquation();
            updateAvailability();
        }
    }

    {
        omegaExp = theory.createMilestoneUpgrade(3, 2);
        omegaExp.description = Localization.getUpgradeIncCustomExpDesc("{\\omega}", "0.22");
        omegaExp.info = Localization.getUpgradeIncCustomExpInfo("{\\omega}", "0.22");
        omegaExp.canBeRefunded = (_) => (vExp.level === 0 && a1Exp.level === 0);
        omegaExp.boughtOrRefunded = (_) => {
            updateC();
            theory.invalidatePrimaryEquation();
            theory.invalidateSecondaryEquation();
            updateAvailability();
        }
    }

    {
        vExp = theory.createMilestoneUpgrade(4, 2);
        vExp.description = Localization.getUpgradeIncCustomExpDesc("v", "0.39");
        vExp.info = Localization.getUpgradeIncCustomExpInfo("v", "0.39");
        vExp.boughtOrRefunded = (_) => {
            updateC();
            theory.invalidatePrimaryEquation();
            theory.invalidateSecondaryEquation();
        }
    }

    {
        a1Exp = theory.createMilestoneUpgrade(5, 1);
        a1Exp.description = Localization.getUpgradeIncCustomExpDesc("a_1", "0.01");
        a1Exp.info = Localization.getUpgradeIncCustomExpInfo("a_1", "0.01");
        a1Exp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }
    
    ///////////////////
    //// Story chapters

    let story1 = "After years of exploring multiple fields of mathematics to find new concepts for growing τ, you decide to head to the physics department of your university.\n"
    story1 += "You meet a student in electromagnetism, huge fan of your work, who hands you a small sheet of equations.\n"
    story1 += "The title: 'Movement of a charged particle inside an infinite charged solenoid'\n"
    story1 += "You're unsure if it will help your project, but you choose to give it a try..."
    chapter1 = theory.createStoryChapter(0, "Exploring physics", story1, () => c1.level > 0);

    let story2 = "You're pretty satisfied with the results so far.\n"
    story2 += "Reseting the particle's position enough times helped with your progress.\n"
    story2 += "However, you feel like there is something missing.\n"
    story2 += "Maybe including the velocity of the particle in the equation will help..."
    chapter2 = theory.createStoryChapter(1, "Speeding up", story2, () => velocityTerm.level > 0);

    let story3 = "You keep engaging with students to learn more about magnetic fields.\n"
    story3 += "One of them tells you that the magnetic field generated by the solenoid gets stronger as the density of turns increases.\n"
    story3 += "You notice the term δ in the equations.\n"
    story3 += "You learn it is meant to represent the density of turns of the solenoid.\n"
    story3 += "Why not turning it into an upgrade?"
    chapter3 = theory.createStoryChapter(2, "The density of progress", story3, () => deltaVariable.level > 0);

    let story4 = "The theory keeps working its way forward, however it is slowing down quite a bit.\n"
    story4 += "You start wondering: Was the physics student's project to grow τ flawed?\n"
    story4 += "Can the theory really reach higher limits?\n"
    story4 += "You start looking closer at the exponents of x and ω.\n"
    story4 += "Right! Increasing them would be a nice idea to progress further.\n"
    story4 += "It's time for the old exponent trick.\n"
    chapter4 = theory.createStoryChapter(3, "An old trick", story4, () => xExp.level + omegaExp.level > 0);

    let story5 = "Since the beginning, you were confident about this project.\n"
    story5 += "Exploring new concepts with electromagnetism was really fun, it feels refreshing after so much pure maths.\n"
    story5 += "However, is it really worth it for your τ project?\n"
    story5 += "The theory became so slow the last few days!\n"
    story5 += "Big numbers aren't suited for physics, it seems.\n"
    story5 += "As you reconsider your choice, you realize that you aren't out of options.\n"
    story5 += "More variables have exponents to be tinkered with...\n"
    chapter5 = theory.createStoryChapter(4, "Reconsideration", story5, () => vExp.level + a1Exp.level > 0);

    let story6 = "The magnetic fields project paid off\n"
    story6 += "You finally did it, you reached 1e600τ!\n"
    story6 += "You decide to organise a small party with the physics students that help you throuhout your journey.\n"
    story6 += "That was a long investment, but you feel like it was worth it.\n"
    story6 += "You miss pure mathematics but, at the same time, you want to explore more physics domains.\n"
    story6 += "One thing you're certain, is that this project marked a big step in your life.\n"
    chapter6 = theory.createStoryChapter(5, "An accomplishment", story6, () => theory.tau > endtau);

    let story7 = "Weeks, if not months, have passed since you finished your magnetic fields main project.\n"
    story7 += "However, you couldn't help but pursuing your work on the theory as a side project.\n"
    story7 += "Physics students told you they have a little surprise for you once you reach v=3e8\n"
    story7 += "This value was familiar to you: the speed of light.\n"
    story7 += "One famous physician proved that nothing can be faster then this speed.\n"
    story7 += "But on this day, your particle finally reached it.\n"
    story7 += "Your charged particle is now faster than the speed of light. How is that possible?\n"
    story7 += "...........\n"
    story7 += "(Not finished)\n"
    //chapter7 = theory.createStoryChapter(6, "Albert Einstein", story7, () => vtot > 3e8);

    updateAvailability();
    updateC();
}

var updateAvailability = () => {
    deltaVariable.isAvailable = velocityTerm.level > 0;
    xExp.isAvailable = deltaVariable.level > 0;
    omegaExp.isAvailable = deltaVariable.level > 0;
    vExp.isAvailable = (xExp.level + omegaExp.level === 4);
    a1Exp.isAvailable = (xExp.level + omegaExp.level === 4);

    delta.isAvailable = deltaVariable.level > 0;
    v3.isAvailable = velocityTerm.level > 0;
    v4.isAvailable = velocityTerm.level > 0;
}


var tick = (elapsedTime, multiplier) => {
    if (vx == BigNumber.ZERO) resetSimulation();
    if (c1.level == 0) return;

    let dt = BigNumber.from(elapsedTime * multiplier);

    let bonus = theory.publicationMultiplier;
    let vc1 = getC1(c1.level);
    let vc2 = getC2(c2.level);
    let va1 = getA1(a1.level).pow(getA1exp());
    let va2 = getA2(a2.level);

    t += dt;
    ts += dt;
    x += dt * vx;

    let icap = va2*i0;
    I = icap - (icap - I)*(BigNumber.E.pow(-(dt*va1)/(BigNumber.THOUSAND*va2)))
    I = I.min(icap);
    
    B = mu0 * I * getDelta(delta.level);
    omega = (getQ() / getM()) * B;

    let xterm = x.pow(getXexp());
    let omegaterm = omega.pow(getOmegaexp());
    let vterm = velocityTerm.level > 0 ? vtot.pow(getVexp()) : BigNumber.ONE;

    rhodot = BigNumber.from(multiplier) * bonus * C * vc1 * vc2 * xterm * omegaterm * vterm;
    currency.value += rhodot * BigNumber.from(elapsedTime);

    theory.invalidateQuaternaryValues();
}

var getPrimaryEquation = () => {
    let result = ``;

    if (stage == 0)
    {
        theory.primaryEquationHeight = 85;
        theory.primaryEquationScale = velocityTerm.level > 0 ? 0.95 : 1.05;
        result += `x = {v_x}{t_s}\\\\`;
        result += `B = {{\\mu}_0}{I}{\\delta}\\\\`;
        result += `\\omega = \\frac{q}{m}{B}`;
    }
    else
    {
        theory.primaryEquationHeight = 80;
        theory.primaryEquationScale = 1.2;
        result += `\\dot{\\rho} = C{c_1}{c_2}x^{${numberFormat(getXexp(),2)}}\\omega^{${numberFormat(getOmegaexp(),2)}}`;
        if (velocityTerm.level > 0) result += `v^{${numberFormat(getVexp(),2)}}`;
    }

    return result;
}

var getSecondaryEquation = () => {
    let result = ``;

    if (stage == 0)
    {
        theory.secondaryEquationHeight = 70;
        theory.secondaryEquationScale = 1;
        result += `v_x = [{v_1}{v_2}\\times{10^{-20}}]({t_s}=0)\\\\`;
        if (velocityTerm.level > 0)
        {
            theory.secondaryEquationHeight = 100;
            theory.secondaryEquationScale = 0.9;
            result += `v_y = [{v_3}{v_4}\\times{10^{-18}}]({t_s}=0)\\times\\sin(\\omega{t})\\\\`;
            result += `v_z = [{v_3}{v_4}\\times{10^{-18}}]({t_s}=0)\\times\\cos(\\omega{t})\\\\`;
        }
        result += `\\dot{I} = \\frac{a_1}{100}\\left(10^{-15} - \\frac{I}{a_2}\\right)\\\\`;
    }
    else
    {
        theory.secondaryEquationHeight = 65;
        theory.secondaryEquationScale = 1.1;
        if (velocityTerm.level > 0)
        {
            result += `v = \\sqrt{{v_x}^2+{v_y}^2+{v_z}^2}\\\\`;
        }
        result += `C = ${numberFormat(C, 2)}`;
    }

    return result;
}

var getTertiaryEquation = () => {
    let result = ``;

    if (stage == 0)
    {
        result += `m=${numberFormat(getM(),2)}`;
        if (deltaVariable.level == 0)
        {
            result += ` ,\\,{\\delta}=1`;
        }
        result += `\\\\`;
        result += `q=1.602\\times{10}^{-19},\\,\\mu_0=4\\pi\\times{10}^{-7}`;
    }
    else
    {
        if (tauRate == 1) result = `${theory.latexSymbol}=\\max\\rho`;
        else result = `${theory.latexSymbol}=\\max\\rho^{${tauRate}}`;
    }
    
    return result;
}

var getQuaternaryEntries = () => {
    if (quaternaryEntries.length == 0)
    {
        
        if (stage == 0)
        {
            quaternaryEntries.push(new QuaternaryEntry("{t_s}_{{}\\,}", null));
            quaternaryEntries.push(new QuaternaryEntry("x_{{}\\,}", null));
            quaternaryEntries.push(new QuaternaryEntry("{v_x}_{{}\\,}", null));
            quaternaryEntries.push(new QuaternaryEntry("{v_y}_{{}\\,}", null));
            quaternaryEntries.push(new QuaternaryEntry("{v_z}_{{}\\,}", null));
            quaternaryEntries.push(new QuaternaryEntry("B_{{}\\,}", null));
            quaternaryEntries.push(new QuaternaryEntry("I_{{}\\,}", null));
        }
        else
        {
            quaternaryEntries.push(new QuaternaryEntry(null, ''));
            quaternaryEntries.push(new QuaternaryEntry("t_{{}\\,}", null));
            quaternaryEntries.push(new QuaternaryEntry("\\dot{\\rho}_{{}\\,}", null));
            quaternaryEntries.push(new QuaternaryEntry("x_{{}\\,}", null));
            quaternaryEntries.push(new QuaternaryEntry("\\omega_{{}\\,}", null));
            quaternaryEntries.push(new QuaternaryEntry("v_{{}\\,}", null));
            quaternaryEntries.push(new QuaternaryEntry(null, ''));
        }
    }

    if (stage == 0)
    {
        quaternaryEntries[0].value = ts.toString(2);
        quaternaryEntries[1].value = numberFormat(x, 2);
        quaternaryEntries[2].value = numberFormat(vx, 2);
        if (velocityTerm.level == 1) quaternaryEntries[3].value = numberFormat(vz*BigNumber.from(Math.sin((omega*ts).toNumber())), 2);
        if (velocityTerm.level == 1) quaternaryEntries[4].value = numberFormat(vz*BigNumber.from(Math.cos((omega*ts).toNumber())), 2);
        quaternaryEntries[5].value = numberFormat(B, 2);
        quaternaryEntries[6].value = numberFormat(I, 2);
    }
    else
    {
        quaternaryEntries[1].value = t.toString(2);
        quaternaryEntries[2].value = numberFormat(rhodot, 2);
        quaternaryEntries[3].value = numberFormat(x, 2);
        quaternaryEntries[4].value = numberFormat(omega, 2);
        if (velocityTerm.level == 1) {quaternaryEntries[5].value = numberFormat(vtot, 3);}
    }

    return quaternaryEntries;
}


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

var canResetStage = () => true;

const resetMessage1 = "Resets x but updates vx with the latest values of v1 and v2"
const resetMessage2 = "Resets x but updates vx, vy and vz with the latest values of v1, v2, v3 and v4"

var getResetStageMessage = () => velocityTerm.level > 0 ? resetMessage2 : resetMessage1

var resetStage = () => resetSimulation();

var getPublicationMultiplier = (tau) => tau.pow(pubExponent);
var getPublicationMultiplierFormula = (symbol) => `${symbol}^{${pubExponent}}`;
var getTau = () => currency.value.pow(tauRate);
var getCurrencyFromTau = (tau) => [tau.max(BigNumber.ONE).pow(BigNumber.ONE / tauRate), currency.symbol]

var postPublish = () => {
    t = BigNumber.ZERO;
    ts = BigNumber.ZERO;
    x = BigNumber.ZERO;
    vx = BigNumber.ZERO;
    vz = BigNumber.ZERO;
    vtot = BigNumber.ZERO;
    I = BigNumber.ZERO;
    omega = BigNumber.ZERO;
    B = BigNumber.ZERO;

    rhodot = BigNumber.ZERO;

    theory.invalidateQuaternaryValues();
    resetSimulation();
}

var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getInternalState = () => `${x.toNumber()} ${vx.toNumber()} ${vz.toNumber()} ${vtot.toNumber()} ${I.toNumber()} ${t} ${ts}`;

var setInternalState = (state) => {
    let values = state.split(" ");
    if (values.length > 0) x = BigNumber.from(values[0]);
    if (values.length > 1) vx = BigNumber.from(values[1]);
    if (values.length > 2) vz = BigNumber.from(values[2]);
    if (values.length > 3) vtot = BigNumber.from(values[3]);
    if (values.length > 4) I = BigNumber.from(values[4]);
    if (values.length > 5) t = parseBigNumber(values[5]);
    if (values.length > 6) ts = parseBigNumber(values[6]);
  
    updateC();
  };

var getDebugMult = (level) => Utils.getStepwisePowerSum(level, 10, 9, 1);

var getXexp = () => (BigNumber.from(3.2 + 0.24*xExp.level));
var getOmegaexp = () => (BigNumber.from(4.1 + 0.22*omegaExp.level));
var getVexp = () => (BigNumber.from(1.3 + 0.39*vExp.level));
var getA1exp = () => (BigNumber.ONE + a1Exp.level*0.01);

var updateC = () => {
    let k = BigNumber.from(4.49e19);
    let xinit = BigNumber.from(1e15).pow(getXexp());
    let omegainit = (defaultmass / (q0 * mu0 * i0 * 1000)).pow(getOmegaexp());
    let vinit = velocityTerm.level === 1 ? BigNumber.from(3e19).pow(BigNumber.from(1.3)) : BigNumber.ONE;
    let vscale = velocityTerm.level === 1 ? BigNumber.from(1e6).pow(getVexp() - BigNumber.from(1.3)) : BigNumber.ONE;

    C = k * xinit * omegainit * vinit * vscale;
}

var getQ = () => q0;
var getM = () => defaultmass;

var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 7, 0);
var getC2 = (level) => BigNumber.TWO.pow(level);
var getA1 = (level) => Utils.getStepwisePowerSum(level, 2, 5, 1);
var getA2 = (level) => BigNumber.from(1.25).pow(level);
var getDelta = (level) => deltaVariable.level > 0 ? BigNumber.from(1.1).pow(level) : BigNumber.ONE;
var getV1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 1);
var getV2 = (level) => BigNumber.from(1.3).pow(level);
var getV3 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getV4 = (level) => BigNumber.from(1.5).pow(level);


init();
