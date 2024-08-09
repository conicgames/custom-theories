import { CompositeCost, CustomCost, ExponentialCost, FirstFreeCost, FreeCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { parseBigNumber, BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "fractional_integration";
var name = "Fractional Integration";
var description =
  "The functions between a function and its derivative have many ways of being shown, this is one of them. " +
  "Fractional integration is a way to calculate what is between a function and its integral and is a smooth transition. " +
  "As such, as a fractional integral approaches 1, it should become the integral.";
var authors = "Snaeky (SnaekySnacks#1161) - Idea\nGen (Gen#3006) - Coding\nXLII (XLII#0042) - Balancing";
var version = 5;
var releaseOrder = "5";

requiresGameVersion("1.4.33");

var tauMultiplier = 4;

var rho_dot = BigNumber.ZERO;
var t_cumulative = BigNumber.ZERO;
var mainEquationPressed = false;
var adBoost = BigNumber.ONE;

// lambda = 1 - 1/2^k
// lambda = 1 - `lambda_man`e`lambda_exp`
// 1/2^k in xxxe-xxx form
//man =  10^((log(1)-k*log(2)) - exp)
//exp = floor(log(1) - k*log(2))
var lambda_man = BigNumber.ZERO;
var lambda_exp = BigNumber.ZERO;

//used for approx calculation
var lambda_base = BigNumber.TWO;

//ID - g(x)
//0 - cos(x)
//1 - sin(x)
//2 - log10(1+x)
//3 - e^x

var q = BigNumber.ZERO;
var r = BigNumber.ZERO;

var update_divisor = true;

var q1, q2, t, k, m, n;
var intUnlock, kUnlock, q1Exp, UnlTerm, gxUpg, baseUpg;
var gxMilestoneConfirming = false;
var gxMilestoneConfirmed = false;
var gxMilestoneLevelDifference = 0;

var popup = ui.createPopup({
  title: "g(x) Milestone",
  content: ui.createStackLayout({
    children: [
      ui.createLatexLabel({
        text: "Buying or refunding this milestone will reset $q$.",
        horizontalOptions: LayoutOptions.CENTER,
        horizontalTextAlignment: TextAlignment.CENTER,
        margin: new Thickness(0, 10, 0, 0),
      }),
      ui.createLatexLabel({
        text: "Do you want to continue?",
        horizontalOptions: LayoutOptions.CENTER,
        horizontalTextAlignment: TextAlignment.CENTER,
        margin: new Thickness(0, 15, 0, 15),
      }),
      ui.createStackLayout({
        orientation: StackOrientation.HORIZONTAL,
        children: [
          ui.createButton({
            horizontalOptions: LayoutOptions.FILL_AND_EXPAND,
            text: "Yes",
            onClicked: () => {
              gxMilestoneConfirmed = true;
              if(theory.milestonesUnused > 0 || gxMilestoneLevelDifference < 0) {
                gxUpg.level += gxMilestoneLevelDifference;
              }
              popup.hide();
            },
          }),
          ui.createButton({
            horizontalOptions: LayoutOptions.FILL_AND_EXPAND,
            text: "No",
            onClicked: () => popup.hide(),
          }),
        ],
      }),
    ],
  }),
});

var init = () => {
  currency = theory.createCurrency();

  ///////////////////
  // Regular Upgrades

  //t
  {
    let getDesc = (level) => "\\dot{t}=" + getT(level).toString(1);
    let getInfo = (level) => "\\dot{t}=" + getT(level).toString(1);
    t = theory.createUpgrade(0, currency, new ExponentialCost(1e25, Math.log2(1e50)));
    t.getDescription = (amount) => Utils.getMath(getDesc(t.level));
    t.getInfo = (amount) => Utils.getMathTo(getInfo(t.level), getInfo(t.level + amount));
    t.maxLevel = 4;
  }

  // q1
  {
    let getDesc = (level) => "q_1=" + getQ1(level).toString(0);
    let getInfo = (level) => "q_1=" + getQ1(level).toString(0);
    q1 = theory.createUpgrade(1, currency, new FirstFreeCost(new ExponentialCost(5, Math.log2(14.6))));
    q1.getDescription = (amount) => Utils.getMath(getDesc(q1.level));
    q1.getInfo = (amount) => Utils.getMathTo(getInfo(q1.level), getInfo(q1.level + amount));
  }

  //q2
  {
    let getDesc = (level) => "q_2=2^{" + level + "}";
    let getInfo = (level) => "q_2=" + getQ2(level).toString(0);
    q2 = theory.createUpgrade(
      2,
      currency,
      new CustomCost(
        (level) => q2Costs[Math.min(2, gxUpg.level)].getCost(level),
        (level, extra) => q2Costs[gxUpg.level].getSum(level, level + extra),
        (level, vrho) => q2Costs[gxUpg.level].getMax(level, vrho)
      )
    );
    q2.getDescription = (amount) => Utils.getMath(getDesc(q2.level));
    q2.getInfo = (amount) => Utils.getMathTo(getInfo(q2.level), getInfo(q2.level + amount));
  }

  //K
  {
    let getDesc = (level) => "K= " + getK(level).toString(0);
    let getInfo = (level) => "K=" + getK(level).toString(0);
    k = theory.createUpgrade(
      3,
      currency,
      new CustomCost(
        (level) => KCosts[baseUpg.level].getCost(level),
        (level, extra) => KCosts[baseUpg.level].getSum(level, level + extra),
        (level, vrho) => KCosts[baseUpg.level].getMax(level, vrho)
      )
    );
    k.getDescription = (amount) => Utils.getMath(getDesc(k.level));
    k.getInfo = (amount) => Utils.getMathTo(getInfo(k.level), getInfo(k.level + amount));
    k.bought = (_) => (update_divisor = true);
    k.level = 1;
  }

  //M
  {
    let getDesc = (level) => "m= 1.5^{" + level + "}";
    let getInfo = (level) => "m=" + getM(level).toString(0);
    m = theory.createUpgrade(4, currency, new ExponentialCost(1e4, Math.log2(4.44)));
    m.getDescription = (amount) => Utils.getMath(getDesc(m.level));
    m.getInfo = (amount) => Utils.getMathTo(getInfo(m.level), getInfo(m.level + amount));
  }

  //N
  {
    let getDesc = (level) => "n= " + getN(level).toString(0);
    let getInfo = (level) => "n=" + getN(level).toString(0);
    n = theory.createUpgrade(5, currency, new ExponentialCost(1e69, Math.log2(11)));
    n.getDescription = (amount) => Utils.getMath(getDesc(n.level));
    n.getInfo = (amount) => Utils.getMathTo(getInfo(n.level), getInfo(n.level + amount));
    n.level = 1;
  }

  /////////////////////
  // Permanent Upgrades
  theory.createPublicationUpgrade(0, currency, 1e8);
  theory.createBuyAllUpgrade(1, currency, 1e15);
  theory.createAutoBuyerUpgrade(2, currency, 1e25);

  {
    perm1 = theory.createPermanentUpgrade(
      3,
      currency,
      new CompositeCost(2, new ExponentialCost(1e100, BigNumber.TEN.pow(350).log2()), new ExponentialCost(BigNumber.TEN.pow(1050), 1))
    );
    perm1.getDescription = (amount) => "$\\text{Unlock g(x) Milestone lv }$" + Math.min(perm1.level + 1, 3);
    perm1.getInfo = (amount) => "$\\text{Unlocks the g(x) Milestone lv }$" + Math.min(perm1.level + 1, 3);
    perm1.boughtOrRefunded = (_) => {
      updateAvailability();
    };
    perm1.maxLevel = 3;
  }

  {
    perm2 = theory.createPermanentUpgrade(4, currency, new ExponentialCost(BigNumber.TEN.pow(350), BigNumber.TEN.pow(400).log2()));
    perm2.getDescription = (amount) => "$\\text{Unlock }\\lambda \\text{ Milestone lv }$" + Math.min(perm2.level + 1, 2);
    perm2.getInfo = (amount) => "$\\text{Unlocks the }\\lambda \\text{ Milestone lv }$" + Math.min(perm2.level + 1, 2);
    perm2.boughtOrRefunded = (_) => updateAvailability();
    perm2.maxLevel = 2;
  }

  /////////////////////
  // Checkpoint Upgrades
  theory.setMilestoneCost(new CustomCost((total) => BigNumber.from(tauMultiplier*getMilCustomCost(total))));

  {
    intUnlock = theory.createMilestoneUpgrade(0, 1);
    intUnlock.getDescription = (_) => {
      return "$\\text{Change }q/\\pi\\text{ to }\\int_0^{q/\\pi}{g(x)dx}$";
    };
    intUnlock.getInfo = (_) => {
      return "$\\text{Unlock Fractional Integral}$";
    };
    intUnlock.boughtOrRefunded = (_) => {
      updateAvailability();
      theory.invalidatePrimaryEquation();
    };
    intUnlock.canBeRefunded = (_) => kUnlock.level == 0;
  }

  {
    kUnlock = theory.createMilestoneUpgrade(1, 1);
    kUnlock.getDescription = (_) => {
      return Localization.getUpgradeAddTermDesc("k");
    };
    kUnlock.getInfo = (_) => {
      return Localization.getUpgradeAddTermInfo("k");
    };
    kUnlock.boughtOrRefunded = (_) => {
      updateAvailability();
      theory.invalidateSecondaryEquation();
    };
    kUnlock.canBeRefunded = (_) => q1Exp.level == 0 && UnlTerm.level == 0 && gxUpg.level == 0 && baseUpg.level == 0;
  }

  {
    q1Exp = theory.createMilestoneUpgrade(2, 3);
    q1Exp.description = Localization.getUpgradeIncCustomExpDesc("q_1", "0.01");
    q1Exp.info = Localization.getUpgradeIncCustomExpInfo("q_1", "0.01");
    q1Exp.boughtOrRefunded = (_) => {
      theory.invalidateSecondaryEquation();
      updateAvailability();
    };
  }

  {
    UnlTerm = theory.createMilestoneUpgrade(3, 2);
    UnlTerm.getDescription = (_) => {
      if (UnlTerm.level == 0) {
        return Localization.getUpgradeAddTermDesc("m");
      }
      return Localization.getUpgradeAddTermDesc("n");
    };
    UnlTerm.getInfo = (_) => {
      if (UnlTerm.level == 0) {
        return Localization.getUpgradeAddTermInfo("m");
      }
      return Localization.getUpgradeAddTermInfo("n");
    };
    UnlTerm.boughtOrRefunded = (_) => {
      theory.invalidatePrimaryEquation();
      updateAvailability();
    };
  }

  {
    gxUpg = theory.createMilestoneUpgrade(4, 3);
    gxUpg.getDescription = (_) => {
      if (gxUpg.level == 0 || gxUpg.maxLevel < 2) {
        return "$\\text{Approximate }\\sin(x) \\text{ to 3 terms}$";
      } else if (gxUpg.level == 1 || gxUpg.maxLevel < 3) {
        return "$\\text{Approximate }\\log_{10}(1+x) \\text{ to 5 terms}$";
      }
      return "$\\text{Approximate }e^{x} \\text{ to 6 terms and\\\\Remove / } \\pi \\text{ in the integral limit} $";
    };
    gxUpg.getInfo = (_) => {
      if (gxUpg.level == 0 || gxUpg.maxLevel < 2) {
        return "$\\text{Change g(x) to } x-\\frac{x^3}{3!}+\\frac{x^5}{5!}$";
      } else if (gxUpg.level == 1 || gxUpg.maxLevel < 3) {
        return "$\\text{Change g(x) to } (x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\frac{x^4}{4}+\\frac{x^5}{5})/\\ln(10)$";
      }
      return "$\\text{Change g(x) to } 1+x+\\frac{x^2}{2!}+\\frac{x^3}{3!}+\\frac{x^4}{4!}+\\frac{x^5}{5!} \\text{ \\& {} q/} \\pi \\to q$";
    };
    (gxUpg.bought = (boughtLevels) => gxMilestoneConfirm(boughtLevels)), (gxUpg.refunded = (refundedLevels) => gxMilestoneConfirm(-refundedLevels));
  }

  {
    baseUpg = theory.createMilestoneUpgrade(5, 2);
    baseUpg.getDescription = (_) => {
      if (baseUpg.level == 0 || baseUpg.maxLevel < 2) {
        return "$\\text{Improve } \\lambda \\text{ Fraction to } 2/3^{i}$";
      }
      return "$\\text{Improve } \\lambda \\text{ Fraction to } 3/4^{i}$";
    };
    baseUpg.getInfo = (_) => {
      if (baseUpg.level == 0 || baseUpg.maxLevel < 2) {
        return "$\\text{Improve } \\lambda \\text{ Fraction to } 2/3^{i}$";
      }
      return "$\\text{Improve } \\lambda \\text{ Fraction to } 3/4^{i}$";
    };
    baseUpg.boughtOrRefunded = (_) => {
      lambda_base = BigNumber.from(2 + baseUpg.level);
      k.level = 1;
      update_divisor = true;
      theory.invalidateSecondaryEquation();
      theory.invalidateTertiaryEquation();
      updateAvailability();
    };
  }

  //////////////////
  // Story Chapters

  // Story Chapters
  let story_chapter_1 =
    "While studying some techniques in integration, you think about what it would mean to have a partial derivative or integral...\n" +
    "You remember your friend, a Professor that did some work with Differential and Integral Calculus, and ask them what they thought.\n" +
    "They said, \"oh, I think I saw something about a 'Riemann-Liouville Fractional Derivatives' in a textbook a long time ago.\"\n" +
    "You don't know if it really works, but you want to test it somehow.\n" +
    "You want to start somewhere small and test it from the bottom up. The equation you make is as follows.";
  theory.createStoryChapter(0, "An Idea", story_chapter_1, () => currency.value >= 1);

  let story_chapter_2 =
    "As your ρ growth begins to slow down, you sit down and think. This is just the base and you know that it works well, but you start to wonder about how good this thought experiment can be.\n" +
    "Maybe applying the same idea for ρ directly will work well.\n" +
    'You try to add the "fractional integral" into ρ equation to see what comes of it...';
  theory.createStoryChapter(1, "The Implementation", story_chapter_2, () => intUnlock.level == 1);

  let story_chapter_3 =
    "The change helped, but it is still not enough to get anywhere close to proving the theory.\n" +
    "You take a look at the equation. You knew from the beginning that you needed to adjust lambda in some way to be able to check if this 'Integral' is really related to actual Integrals.\n" +
    "It is finally time to make lambda approach 1.";
  theory.createStoryChapter(2, "The Inevitability", story_chapter_3, () => kUnlock.level == 1);

  let story_chapter_4 =
    "Wow, you didn't expect it to work this well!\n" + "But, you think it can go faster!\n" + "You add a new variable to speed things up.";
  theory.createStoryChapter(3, "Pushing Forwards", story_chapter_4, () => UnlTerm.level > 0);

  let story_chapter_5 =
    "The m and n upgrades are doing well, but you are getting impatient.\n" +
    "It's taking too long to really show anything concrete.\n" +
    'Sure, ρ is increasing, but it\'s not enough to really show that this weird looking "partial" integral converges to the actual integral...\n' +
    "Maybe changing g(x) will speed things up!";
  theory.createStoryChapter(4, "Converging to the Truth", story_chapter_5, () => perm1.level == 1);

  let story_chapter_6 =
    "The Professor comes to you and asks how things are going.\n" +
    "You inform them that things are going well, but still very slow.\nYou ask him about any way to speed things up.\n" +
    "\"Why haven't you adjusted the lambda function yet?\n Isn't that sum very slow to converge to 1?\"\n" +
    "Oh yeah!!! Other infinite sums that converge to 1!\n" +
    "You change the lambda function.";
  theory.createStoryChapter(5, "A Lambdmark Discovery", story_chapter_6, () => perm2.level == 1);

  let story_chapter_7 =
    "Changing the equation again seems to have helped a lot.\n" +
    "You are satisfied with your work and think that you have done your due diligence with showing this conjecture to be true...\n" +
    "The Professor comes up to you and scoffs.\n" +
    "\"Do you really think that you have proven anything yet?\n You'll need bigger numbers than that to really show that it's true.\nYou remember what it took for me to prove my equation?\"\n" +
    "You smile at them and nod... and continue to push.\nMaybe you can add more stuff to make it go faster...";
  theory.createStoryChapter(6, "Insight", story_chapter_7, () => currency.value >= BigNumber.TEN.pow(500));

  let story_chapter_8 =
    "You're losing faith in what you have so far...\n" +
    "You think back to when your colleague visited you the first time.\n" +
    "Will 3/4 work better than 2/3?";
  theory.createStoryChapter(7, "More of the Same", story_chapter_8, () => perm2.level == 2);

  let story_chapter_9 =
    "You feel as though g(x) needs something stronger than anything you have given it before.\n" +
    "Every other g(x) you have used has run out of steam and is slowing to a crawl.\n" +
    "What is a really good equation that gets very big, very fast?...\n" +
    "e^x!!!\n" +
    "Of course, it was staring you in the face the whole time.\nThe professor was right earlier on! Why not use his own equation!";
  theory.createStoryChapter(8, "Full Throttle", story_chapter_9, () => perm1.level == 3);

  let story_chapter_10 =
    "Well, you feel as though there aren't any more changes to make.\n" +
    "The Professor comes by once more.\n" +
    '"Ah, that should do it.\nI see you used my own equation to push things along.\nWhat do you think it will be now?"\n' +
    "You respond with a smile on your face.\n" +
    "I think we will just have to wait and see.";
  theory.createStoryChapter(9, "EZ Tau Gains Bois!!", story_chapter_10, () => currency.value >= BigNumber.TEN.pow(1150));

  let story_chapter_11 =
    "You and the Professor are at a conference where you are giving a speech on the equation.\n" +
    "Everyone is impressed by how far you got with brute force.\n" +
    "Some think you won't be able to get much farther.\n" +
    "Yet, you keep pushing.\n\n" +
    "Thank you all for playing this theory so far.\n I had a blast making it and I'm so grateful to Gen and XLII for helping me!\n There is still more τ to gain! Grind on!!\n" +
    "-Snaeky";
  theory.createStoryChapter(10, "Closure", story_chapter_11, () => currency.value >= BigNumber.TEN.pow(1250));

  updateAvailability();
};

var updateAvailability = () => {
  kUnlock.isAvailable = intUnlock.level == 1;
  q1Exp.isAvailable = kUnlock.level == 1;
  UnlTerm.isAvailable = kUnlock.level == 1;
  gxUpg.isAvailable = perm1.level > 0;
  baseUpg.isAvailable = perm2.level > 0;
  perm2.isAvailable = kUnlock.level == 1;
  gxUpg.maxLevel = 0 + perm1.level;
  baseUpg.maxLevel = 0 + perm2.level;

  k.isAvailable = kUnlock.level == 1;
  m.isAvailable = UnlTerm.level > 0;
  n.isAvailable = UnlTerm.level > 1;
};

var tick = (elapsedTime, multiplier) => {
  let dt = BigNumber.from(elapsedTime * multiplier);
  let bonus = theory.publicationMultiplier;
  adBoost = BigNumber.from(multiplier);
  let vq1 = getQ1(q1.level).pow(getQ1Exp(q1Exp.level));
  let vq2 = getQ2(q2.level);
  let vt = getT(t.level);
  let vk = getK(k.level);
  let vm = UnlTerm.level > 0 ? getM(m.level) : 1;
  let vn = UnlTerm.level > 1 ? getN(n.level) : 1;

  let vapp = approx(vk, lambda_base);

  if (update_divisor) {
    var temp = -vk * lambda_base.log10();
    lambda_exp = Math.floor(temp);
    lambda_man = BigNumber.TEN.pow(temp - lambda_exp);
    update_divisor = false;
  }

  if (q1.level > 0) t_cumulative += vt * dt;
  q += vq1 * vq2 * dt;
  if (q1.level > 0) r += vapp * dt;

  if (intUnlock.level == 0) {
    rho_dot = vm * vn * t_cumulative * r * (q / BigNumber.PI).pow(BigNumber.ONE / BigNumber.PI);
  } else {
    rho_dot = vm * vn * t_cumulative * norm_int(q / (gxUpg.level < 3 ? BigNumber.PI : BigNumber.ONE)).pow(BigNumber.ONE / BigNumber.PI) * r;
  }

  currency.value += bonus * rho_dot * dt;

  if(mainEquationPressed) theory.invalidatePrimaryEquation();
  theory.invalidateTertiaryEquation();
};

var getInternalState = () => `${t_cumulative} ${lambda_man} ${lambda_exp} ${lambda_base} ${q} ${r}`;

var setInternalState = (state) => {
  let values = state.split(" ");
  if (values.length > 0) t_cumulative = parseBigNumber(values[0]);
  if (values.length > 1) lambda_man = parseBigNumber(values[1]);
  if (values.length > 2) lambda_exp = parseBigNumber(values[2]);
  if (values.length > 3) lambda_base = parseBigNumber(values[3]);
  if (values.length > 4) q = parseBigNumber(values[4]);
  if (values.length > 5) r = parseBigNumber(values[5]);
  update_divisor = true;
};

//Q2 Cost
var q2Cost1 = new ExponentialCost(1e7, Math.log2(5e3)); //fx == 0
var q2Cost2 = new ExponentialCost(1e7, Math.log2(3e3)); //fx == 1
var q2Cost3 = new ExponentialCost(1e-10, Math.log2(2.27e3)); //fx == 2
var q2Cost4 = new ExponentialCost(BigNumber.TEN.pow(95), Math.log2(1.08e3)); //fx == 3
var q2Costs = [q2Cost1, q2Cost2, q2Cost3, q2Cost4];

//K Cost
var KCost1 = new ExponentialCost(1e2, Math.log2(10)); //base == 2
var KCost2 = new ExponentialCost(1e-5, Math.log2(37)); //base == 3
var KCost3 = new ExponentialCost(1e-10, Math.log2(95)); //base == 4
var KCosts = [KCost1, KCost2, KCost3];

//Milestone Cost
var getMilCustomCost = (level) => {
  //10,20,30,70,210,300,425,530,700,800,950,1150
  switch (level) {
    case 0:
      return 1;
    case 1:
      return 2;
    case 2:
      return 3;
    case 3:
      return 7;
    case 4:
      return 21;
    case 5:
      return 30;
    case 6:
      return 42.5;
    case 7:
      return 53;
    case 8:
      return 70;
    case 9:
      return 80;
    case 10:
      return 95;
  }
  return 115;
};

var postPublish = () => {
  t_cumulative = BigNumber.ZERO;
  q = BigNumber.ZERO;
  r = BigNumber.ZERO;
  update_divisor = true;
  k.level = 1;
  n.level = 1;
  updateAvailability();
};

var getPrimaryEquation = () => {
  theory.primaryEquationHeight = 86;
  let result = "\\begin{matrix}";
  if (mainEquationPressed) {
    theory.primaryEquationScale = 1.0;
    result += "_{\\lambda}\\int_{0}^{\\pi}g(x)dx^{\\lambda} = \\frac{1}{\\Gamma(\\lambda)}\\int_0^\\pi{(\\pi-x)^{\\lambda-1}g(x)}dx";
    result += "\\\\\\\\";
    result += "h=" + getH(gxUpg.level).toString() + ", \\quad\\dot{ \\rho } =" + (rho_dot*theory.publicationMultiplier*adBoost).toString();
  } else {
    theory.primaryEquationScale = 1.27;
    result = "\\begin{matrix}";
    result += "\\dot{\\rho}=tr";
    if (UnlTerm.level > 0) result += "m";
    if (UnlTerm.level > 1) result += "n";
    result += "\\sqrt[\\pi]{";
    if (intUnlock.level == 1) result += "\\int_{0}^{";
    if (gxUpg.level < 3) {
      result += "q/\\pi";
    } else {
      result += "q";
    }
    if (intUnlock.level == 1) result += "}g(x)dx";
    result += "}\\\\\\\\";
    result += "\\dot{r}=h(\\int_{0}^{\\pi}g(x)dx - _{\\lambda}\\int_{0}^{\\pi}g(x)dx^{\\lambda})^{-1}";
  }
  result += "\\end{matrix}";
  return result;
};

var getSecondaryEquation = () => {
  theory.secondaryEquationHeight = 90;
  theory.secondaryEquationScale = 1.2;
  let result = "";
  result += "g(x) = ";
  result += fx_latex();
  result += ",\\quad\\lambda = ";
  if (kUnlock.level == 0) {
    result += "\\frac{1}{2}";
  } else {
    result += "\\sum_{i=1}^{K}\\frac{" + (lambda_base - 1).toString(0) + "}{" + lambda_base.toString(0) + "^{i}}";
  }
  result += "\\\\\\\\\\qquad";
  if (gxUpg.level == 2) result += "\\qquad";
  if (gxUpg.level == 3) result += "\\qquad\\qquad";
  result += "\\dot{q}=q_1";
  if (q1Exp.level > 0) result += `^{${1 + q1Exp.level * 0.01}}`;
  result += "q_2,\\quad" + theory.latexSymbol + "=\\max\\rho^{0.4}";
  result += "";
  return result;
};

var getTertiaryEquation = () => {
  theory.tertiaryEquationScale = 1.1;
  let result = "";
  result += "\\begin{matrix}";
  result += "& 1-\\lambda =";
  if (getK(k.level) < 8 && 1 / lambda_base.pow(getK(k.level)) > 0.001) {
    result += (1 / lambda_base.pow(getK(k.level))).toString(4);
  } else {
    result += lambda_man.toString(3) + "e" + lambda_exp.toString();
  }

  result += ",&q=";
  result += q.toString();
  result += "\\\\";

  result += "&r=";
  result += r.toString();

  result += ",&t=";
  result += t_cumulative.toString();

  result += "\\end{matrix}";

  return result;
};

//Approximates value for 1/(normal integral - fractional integral) https://www.desmos.com/calculator/ua2v7q9mza
var approx = (k_v, base) => {
  return BigNumber.TEN.pow(-norm_int(BigNumber.PI).log10() - BigNumber.ONE / (BigNumber.E + BigNumber.from(1.519)) + k_v * base.log10());
};

//integrates g(x) and returns value with 0 -> limit, as limits
//abs not really needed?
var norm_int = (limit) => {
  switch (gxUpg.level) {
    case 0:
      return (limit.pow(5) / 120 - limit.pow(3) / 6 + limit).abs();
    case 1:
      return (limit.pow(6) / 720 - limit.pow(4) / 24 + limit.pow(2) / 2).abs();
    case 2:
      return ((limit.pow(6) / 30 - limit.pow(5) / 20 + limit.pow(4) / 12 - limit.pow(3) / 6 + limit.pow(2) / 2) / BigNumber.TEN.log()).abs();
    case 3:
      return limit.pow(6) / 720 + limit.pow(5) / 120 + limit.pow(4) / 24 + limit.pow(3) / 6 + limit.pow(2) / 2 + limit;
  }
};

//Returns correct latex for each g(x)
var fx_latex = () => {
  switch (gxUpg.level) {
    case 0:
      return "1-\\frac{x^2}{2!}+\\frac{x^4}{4!}";
    case 1:
      return "x-\\frac{x^3}{3!}+\\frac{x^5}{5!}";
    case 2:
      return "\\frac{x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\frac{x^4}{4}+\\frac{x^5}{5}}{\\ln(10)}";
    case 3:
      return "1+x+\\frac{x^2}{2!}+\\frac{x^3}{3!}+\\frac{x^4}{4!}+\\frac{x^5}{5!}";
  }
};

var getPublicationMultiplier = (tau) => (tau.isZero ? BigNumber.ONE : tau.pow(0.65/tauMultiplier));
var getPublicationMultiplierFormula = (symbol) => symbol + "^{0.1625}";
var getTau = () => currency.value.pow(BigNumber.from(0.1*tauMultiplier));
var getCurrencyFromTau = (tau) => [tau.max(BigNumber.ONE).pow(10/tauMultiplier), currency.symbol];
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getT = (level) => BigNumber.from(0.2 + level * 0.2);
var getQ1 = (level) => Utils.getStepwisePowerSum(level, 50, 23, 0);
var getQ2 = (level) => BigNumber.TWO.pow(level);
var getK = (level) => BigNumber.from(level);
var getM = (level) => BigNumber.from(1.5).pow(level);
var getN = (level) => Utils.getStepwisePowerSum(level, 3, 11, 0);
var getH = (level) => [0.03870, 0.04357, -0.19151, -0.02968][level]

var getQ1Exp = (level) => BigNumber.from(1 + level * 0.01);

var getEquationOverlay = () => {
  return ui.createStackLayout({
    horizontalOptions: LayoutOptions.FILL,
    verticalOptions: LayoutOptions.FILL,
    onTouched: (event) => {
      if (event.type == TouchType.PRESSED || event.type.isReleased()) {
        mainEquationPressed = event.type == TouchType.PRESSED;
        theory.invalidatePrimaryEquation();
      }
    },
  });
};

var gxMilestoneConfirm = (levelDifference) => {
  if (gxMilestoneConfirmed) {
    q2.level = 0;
    q = BigNumber.ZERO;
    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    updateAvailability();
    gxMilestoneConfirmed = false;
  } else if (!gxMilestoneConfirming) {
    gxMilestoneConfirming = true;
    gxMilestoneLevelDifference = levelDifference;
    gxUpg.level -= levelDifference;
    popup.show();
    gxMilestoneConfirming = false;
  }
};

init();