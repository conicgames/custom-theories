import { ExponentialCost, FirstFreeCost, FreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";
import { TouchType } from "../api/UI/properties/TouchType";
var id = "temperature_control_s03";
var name = "Temperature Control";
var description =
  "Control Theory is a tool used in engineering to maintain a variable at a set value (known as the 'set point'). \n  \
  \n \
You must regulate a 2×2×2 cm metal block using a variable output heater with a maximum power rating of 20 kW. \n \
\n \
The output of your PID system will be an integer between 0-512 (denoted by u(t) in the equation). This number will determine the output of the heater with 512 providing the maximum value \n \
\n \
An output of 0 allows the system to be air cooled under ambient conditions (30°C), with no heater output. \n \
\n \
Eventually, you will be able to tune the controller for yourself. While doing so, you will face various constraints and challenges which you must overcome to progress within this custom theory."

var authors = "Gaunter#1337, peanut#6368 - developed the theory \n XLII#0042, SnaekySnacks#1161 - developed the sim and helped balancing";
var version = 3;
var publicationExponent = 0.6;
var achievements;
requiresGameVersion("1.4.29");

// Currency
var rho;

// UI Variables
var maxTdotText = Utils.getMath("\\text{Max } \\dot{T} \\text{ in current publication: } ");
var maxTdotLabel;
var cycleEstimateText = Utils.getMath("\\text{Average cycle } \\dot{T} \\text{: } ");
var cycleEstimateLabel;
var rEstimateText = Utils.getMath("\\text{Average cycle } \\dot{r} \\text{: } ");
var rEstimateLabel;
var rhoEstimateText = Utils.getMath("\\text{Average cycle } \\dot{\\rho} \\text{: } ");
var rhoEstimateLabel;
var autoTemperatureBar;

// UI image size
var getImageSize = (width) => {
  if(width >= 1080)
    return 48;
  if(width >= 720)
    return 36;
  if(width >= 360)
    return 24;
  return 20;
}

// System variables
var rhoEstimate, Tc, Th, P, r, T, output, kp, kd, ki, setPoint, output, error, integral, systemDt, valve, timer, amplitude, frequency, autoKickerEnabled, baseTolerance, achievementMultiplier, publicationCount, cycleEstimate;
kp = 5;
cycleEstimate = BigNumber.ZERO;
rEstimate = BigNumber.ZERO;
ki = 0;
kd = 0;
amplitude = 125;
autoKickerEnabled = false;
frequency = 1.2;
C1Base = 2.75;
r2ExponentScale = 0.03;
publicationCount = 0;
var maximumPublicationTdot;
var initialiseSystem = () => {
  timer = 0;
  T = BigNumber.from(30);
  r = BigNumber.from(1)
  P = BigNumber.ONE;
  cycleR = BigNumber.ZERO;
  valve = BigNumber.ZERO;
  integral = 0;
  error = [0, 0, 0];
  output = 0;
  d1 = 0;
  d0 = 0;
  fd1 = 0;
  fd0 = 0;
  // System Params
  Q = 20 // max heat duty in W
  h = 5 // thermal passive convection coefficient for Al (W/m^2 k)
  Cp = 0.89 // heat capacity for Al (J/g/K)
  area = 0.024 // area of element (m^2)
  mass = 10 // grams
  Tc = 30;
  Th = 200;
  rEstimate = BigNumber.ZERO;
  rhoEstimate = BigNumber.ZERO;
  baseTolerance = 5;
  achievementMultiplier = 30;
  maximumPublicationTdot = BigNumber.ZERO;
}
// Upgrades
var c1, r1, r2, c2, kickT, changePidValues, autoKick, exponentCap, achievementMultiplierUpgrade, tDotExponent;

// Milestones
var c1Exponent, rExponent, r1Exponent, r2Exponent, c1BaseUpgrade, unlockC2;

var init = () => {
  rho = theory.createCurrency();
  initialiseSystem();

  /////////////////////
  // Milestone Upgrades

  theory.setMilestoneCost(new CustomCost(total => BigNumber.from(getCustomCost(total))));
  // T Autokick
  {
    autoKick = theory.createMilestoneUpgrade(0, 1);
    autoKick.maxLevel = 1;
    autoKick.getDescription = (_) => "Automatically adjust T";
    autoKick.getInfo = (_) => "Automatically adjusts T";
    autoKick.boughtOrRefunded = (_) => { updateAvailability(); theory.invalidatePrimaryEquation(); }
    autoKick.canBeRefunded = () => false;
  }
  {
    c1Exponent = theory.createMilestoneUpgrade(1, 3);
    c1Exponent.getDescription = (_) => Localization.getUpgradeIncCustomExpDesc("c_1", 0.05)
    c1Exponent.getInfo = (_) => Localization.getUpgradeIncCustomExpInfo("c_1", "0.05")
    c1Exponent.boughtOrRefunded = (_) => { updateAvailability(); theory.invalidatePrimaryEquation(); }
  }

  {
    r1Exponent = theory.createMilestoneUpgrade(2, 3);
    r1Exponent.getDescription = (_) => Localization.getUpgradeIncCustomExpDesc("r_1", 0.05);
    r1Exponent.getInfo = (_) => Localization.getUpgradeIncCustomExpInfo("r_1", "0.05");
    r1Exponent.boughtOrRefunded = (_) => { updateAvailability(); theory.invalidatePrimaryEquation(); }
  }
  {
    r2Exponent = theory.createMilestoneUpgrade(3, 2);
    r2Exponent.getDescription = (_) => Localization.getUpgradeIncCustomExpDesc("r_2", r2ExponentScale);
    r2Exponent.getInfo = (_) => Localization.getUpgradeIncCustomExpInfo("r_2", r2ExponentScale);
    r2Exponent.boughtOrRefunded = (_) => { updateAvailability(); theory.invalidatePrimaryEquation(); }
    r2Exponent.canBeRefunded = () => unlockC2.level == 0 && rExponent.level == 0;
  }
  {
    c1BaseUpgrade = theory.createMilestoneUpgrade(4, 2);
    c1BaseUpgrade.getInfo = (_) => "Increases $c_1$ base by " + 0.125;
    c1BaseUpgrade.getDescription = (_) => "$\\uparrow \\ c_1$ base by " + 0.125;
    c1BaseUpgrade.boughtOrRefunded = (_) => updateAvailability();
    c1BaseUpgrade.canBeRefunded = () => unlockC2.level == 0 && rExponent.level == 0;
  }

  {
    rExponent = theory.createMilestoneUpgrade(5, 2);
    rExponent.getDescription = (_) => Localization.getUpgradeIncCustomExpDesc("r", 0.001);
  }
  rExponent.getInfo = (_) => Localization.getUpgradeIncCustomExpInfo("r", 0.001);
  rExponent.boughtOrRefunded = (_) => {
    updateAvailability(); theory.invalidatePrimaryEquation();
  }
  {
    unlockC2 = theory.createMilestoneUpgrade(6, 1);
    unlockC2.getDescription = (_) => Localization.getUpgradeAddTermDesc("c_2");
    unlockC2.getInfo = (_) => Localization.getUpgradeAddTermInfo("c_2");
    unlockC2.boughtOrRefunded = (_) => { updateAvailability(); theory.invalidatePrimaryEquation(); }
  }


  /////////////////////
  // Permanent Upgrades
  theory.createPublicationUpgrade(1, rho, 1e8);

  // PID Menu Unlock
  {
    changePidValues = theory.createPermanentUpgrade(2, rho, new LinearCost(1e8, 0));
    changePidValues.maxLevel = 1;
    changePidValues.getDescription = (_) => Localization.getUpgradeUnlockDesc("\\text{PID Menu}");
    changePidValues.getInfo = (_) => Localization.getUpgradeUnlockInfo("\\text{PID Menu}");
  }

  theory.createBuyAllUpgrade(3, rho, 1e10);
  theory.createAutoBuyerUpgrade(4, rho, 1e20);

  // Achievement Multiplier
  {
    achievementMultiplierUpgrade = theory.createPermanentUpgrade(5, rho, new CustomCost(_ => BigNumber.TEN.pow(600)));
    achievementMultiplierUpgrade.maxLevel = 1;
    achievementMultiplierUpgrade.getDescription = (_) => "Achievement multiplier"
    achievementMultiplierUpgrade.getInfo = (_) => "Multiplies income by " + calculateAchievementMultiplier().toPrecision(3);
  }

  /////////////////////
  // Upgrades

  // Kick T
  {
    kickT = theory.createUpgrade(0, rho, new FreeCost())
    kickT.getDescription = (_) => Utils.getMath("\\text{Set T to } 125");
    kickT.getInfo = (_) => Utils.getMath("T \\rightarrow 125");
    kickT.bought = (_) => T = amplitude;
  }

  // c1
  {
    let getDesc = (level) => "c_1= " + (C1Base + c1BaseUpgrade.level * 0.125).toString() + "^{" + level + "}";
    let getInfo = (level) => "c_1=" + getC1(level).toString();
    c1 = theory.createUpgrade(1, rho, new ExponentialCost(1e5, Math.log2(18)));
    c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
    c1.getInfo = (amount) => Utils.getMathTo(getInfo(c1.level), getInfo(c1.level + amount));
  }

  // r1
  {
    let getDesc = (level) => "r_1=" + Utils.getStepwisePowerSum(level, 2, 10, 0).toString(0);
    let getInfo = (level) => "r_1=" + Utils.getStepwisePowerSum(level, 2, 10, 0).toString(0);
    r1 = theory.createUpgrade(2, rho, new ExponentialCost(10, Math.log2(1.585)));
    r1.getDescription = (_) => Utils.getMath(getDesc(r1.level));
    r1.getInfo = (amount) => Utils.getMathTo(getInfo(r1.level), getInfo(r1.level + amount));
  }

  // r2
  {
    let getDesc = (level) => "r_2= 2^{" + level + "}";
    let getInfo = (level) => "r_2=" + getR2(level).toString(0);
    r2 = theory.createUpgrade(3, rho, new ExponentialCost(1000, Math.log2(8)));
    r2.getDescription = (_) => Utils.getMath(getDesc(r2.level));
    r2.getInfo = (amount) => Utils.getMathTo(getInfo(r2.level), getInfo(r2.level + amount));
  }
  // c2
  {
    let getDesc = (level) => "c_2= e^{" + level + "}";
    let getInfo = (level) => "c_2=" + getC2(level).toString(2);
    c2 = theory.createUpgrade(4, rho, new ExponentialCost(BigNumber.TEN.pow(400), Math.log2(10 ** 4.5)));
    c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
    c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
    c2.isAvailable = unlockC2.level > 0;
    c2.maxLevel = 75
  }
  //Tdot exponent
  {
    let getInfo = (level) => "\\dot{T}^{" + (level + 2) + "}";
    let getDesc = (_) => Localization.getUpgradeIncCustomExpDesc("\\dot{T}", 1);
    tDotExponent = theory.createUpgrade(5, rho, new ExponentialCost(1e15, Math.log2(1000)));
    tDotExponent.maxLevel = 100;
    tDotExponent.getDescription = (_) => getDesc(tDotExponent.level);
    tDotExponent.getInfo = (amount) => Utils.getMathTo(getInfo(tDotExponent.level), getInfo(tDotExponent.level + amount))
    tDotExponent.bought = (_) => theory.invalidatePrimaryEquation();
  }
  // p1
  {
    let getDesc = (level) => "p_1=" + Utils.getStepwisePowerSum(level, 2, 10, 1).toString(0);
    let getInfo = (level) => "p_1=" + Utils.getStepwisePowerSum(level, 2, 10, 1).toString(0);
    p1 = theory.createUpgrade(6, rho, new ExponentialCost(BigNumber.TEN.pow(750), Math.log2(16.60964)));
    p1.getDescription = (_) => Utils.getMath(getDesc(p1.level));
    p1.getInfo = (amount) => Utils.getMathTo(getInfo(p1.level), getInfo(p1.level + amount));
    p1.isAvailable = achievementMultiplier >= 30;
  }

  // p2
  {
    let getDesc = (level) => "p_2= 2^{" + level + "}";
    let getInfo = (level) => "p_2=" + getP2(level).toString(0);
    p2 = theory.createUpgrade(7, rho, new ExponentialCost(BigNumber.TEN.pow(900), Math.log2(1e15)));
    p2.getDescription = (_) => Utils.getMath(getDesc(p2.level));
    p2.getInfo = (amount) => Utils.getMathTo(getInfo(p2.level), getInfo(p2.level + amount));
    p2.isAvailable = achievementMultiplier >= 30;
  }
  
  systemDt = 0.1;
  setPoint = 30;

  /////////////////////
  // Achievements

  let achievement_category1 = theory.createAchievementCategory(0, "R");
  let achievement_category2 = theory.createAchievementCategory(1, "Milestones");
  let achievement_category3 = theory.createAchievementCategory(2, "Publications");
  let achievement_category4 = theory.createAchievementCategory(3, "Tier 1 Challenges");
  let achievement_category5 = theory.createAchievementCategory(4, "Tier 2 Challenges");
  achievements = [

    // Temperature
    theory.createAchievement(0, achievement_category1, "R is for research", "Have r exceed 1e20.", () => r > BigNumber.from(1e20)),
    theory.createAchievement(1, achievement_category1, "Bench-scale research", "Have r exceed 1e50", () => r > BigNumber.from(1e50)),
    theory.createAchievement(2, achievement_category1, "Pilot-scale research", "Have r exceed 1e110", () => r > BigNumber.from(1e110)),

    // Milestones
    theory.createAchievement(3, achievement_category2, "Junior Engineer", "Reach 1e10τ.", () => theory.tau > BigNumber.from(1e10)),
    theory.createAchievement(4, achievement_category2, "Senior Engineer", "Reach 1e25τ.", () => theory.tau > BigNumber.from(1e25)),
    theory.createAchievement(5, achievement_category2, "Prinicipal Engineer", "Reach 1e50τ.", () => theory.tau > BigNumber.from(1e50)),
    theory.createAchievement(6, achievement_category2, "Googol Engineer", "Reach 1e100τ.", () => theory.tau > BigNumber.from(1e100)),
    theory.createAchievement(13, achievement_category2, "Reverse Engineer", "Reach 1e180τ.", () => theory.tau > BigNumber.from(1e200)),
    theory.createAchievement(18, achievement_category2, "Spartan Engineer", "Reach 1e300τ.", () => theory.tau > BigNumber.from(1e300)),


    // Publications
    theory.createAchievement(7, achievement_category3, "Research Intern", "Publish 5 times.", () => publicationCount >= 5),
    theory.createAchievement(8, achievement_category3, "R&D Engineer", "Publish 10 times.", () => publicationCount >= 10),
    theory.createAchievement(9, achievement_category3, "\"That's Dr., not Mr.\"", "Publish 25 times.", () => publicationCount >= 25),

    // Challenges

    // 1e360τ 
    theory.createAchievement(10, achievement_category4, "Don't need it.", "Have ρ exceed 1e500 without purchasing a T dot exponent upgrade.", () => (rho.value > BigNumber.TEN.pow(500) && tDotExponent.level == 0)),
    theory.createAchievement(11, achievement_category4, "What does 'r' do again?", "Have ρ exceed 1e160 while r is still 1.", () => (rho.value > BigNumber.from(1e160) && r == BigNumber.ONE)),
    theory.createAchievement(14, achievement_category4, "Optimisation Challenge", "Have ρ exceed 1e130 within 25 upgrade purchases and no T dot exponent upgrades.", () => (rho.value > BigNumber.from(1e130) && (c1.level + r1.level + r2.level + c2.level) <= 25) && tDotExponent.level == 0),

    // 1e450τ
    theory.createAchievement(15, achievement_category5, "You can upgrade that?", "Have ρ exceed 1e535 without purchasing a T dot exponent upgrade.", () => (rho.value > BigNumber.TEN.pow(535) && tDotExponent.level == 0)),
    theory.createAchievement(16, achievement_category5, "Does 'r' actually do anything?", "Have ρ exceed 1e210 while r is still 1.", () => (rho.value > BigNumber.from(1e210) && r == BigNumber.ONE)),
    theory.createAchievement(19, achievement_category5, "Optimisation Challenge 2", "Have ρ exceed 1e160 with only 1 upgrade purchased.", () => (rho.value > BigNumber.from(1e155) && (c1.level + r1.level + r2.level + c2.level + tDotExponent.level) <= 1)),
  ];
  updateAvailability();
}

var calculateAchievementMultiplier = () => {
  let count = 0;
  for (const achievement of achievements) {
    if (achievement.isUnlocked) {
      count++
    }
  }
  return Math.pow(30, 1 / 18 * count);
}

////////////////////////////
// Story Chapters

// Unlocked at the beginning
let storychapter_1 =
  "You are currently working on a new system that will be used to control the temperature of your lab. \n \
The only problem is you are struggling with the maths. \n \
You decide to approach the mathematics department for help. \n \
Unfortunately, the professor is not very friendly. They scoff at you because you are 'only' an engineering student.\n \
Frustrated, you return to your lab and kick the system.";
theory.createStoryChapter(0, "Applied Mathematics", storychapter_1, () => true);

// Unlocked after buying the first 'free' upgrade
let storychapter_2 =
  "You kick the system and it starts working. \n \
You aren't sure what is happening but it seems to be generating something. \n \
You notice this happens each time the temperature changes. \n \n \
Perhaps this is some sort of chain reaction? You decide to investigate further.";
theory.createStoryChapter(1, "Chain Reaction", storychapter_2, () => kickT.level > 0);

// Unlocked after buying the first 'r1' upgrade
let storychapter_3 =
  "After a bit more investigation you still aren't quite sure what is happening. \n \
You decide to walk away and come back later. \n \
When you return, you notice another variable is growing. \n \
This seems to grow faster when the temperature is close to the set point. \n \
You decide to call this variable 'r' to represent research.";
theory.createStoryChapter(2, "Research", storychapter_3, () => r1.level > 0);

// Unlocked after collecting the first milestone
let storychapter_4 =
  "You are making progress in your research, however your foot is beginning to get sore from the constant kicking. \n \
You decide to visit the computer science department to help you out. \n \
They provide you with a software package that can adjust the temperature of the system automatically.  \
"
theory.createStoryChapter(3, "Automation", storychapter_4, () => autoKick.level > 0);

//c1Base milestone reaches level 2
let storychapter_5 =
  "After analysing the equation a bit more you come to a realisation. \n \
\"I'm an engineer. I can round numbers!\" \n \
Why didn't you notice this earlier? \n \
You finally decide to round c1 up to 3. \
";
theory.createStoryChapter(6, "Rounding", storychapter_5, () => c1BaseUpgrade.level >= 2);

// T dot exponent max level reached
let storychaper_6 =
  "You suddenly hear a strange noise coming from the machine. \n \
The system has been pushed to its limit. \n \
You notice that the motor is dangerously close to burning out. \n \
For now, it's best to avoid increasing the exponent of the temperature change. \
";
theory.createStoryChapter(5, "Physical Limitations", storychaper_6, () => tDotExponent.level >= 100);

// c2 unlocked
let storychapter_7 =
  "The mathematics department is taking notice of your work. \n \
They decide to help refine the maths of your system. \n \
while puzzled at first, the mathematics professor eventually adds a new variable to your existing work. \n \
\"That should make the numbers grow much faster!\" they exclaim! \n \
You aren't sure why mathematicians are obsessed with 'e' but you decide to go along with it.";
theory.createStoryChapter(4, "Refinement", storychapter_7, () => unlockC2.level >= 1);

// 1e270 tau
let storychapter_8 =
  "The Dean contacts you to let you know that the engineering world has taken note of your system. \n \
They say that you have been nominated for an award for your work. \n \
You decide to put some finishing touches on your work to impress the awards committee."
theory.createStoryChapter(8, "Nomination", storychapter_8, () => theory.tau > BigNumber.from(1e270));

// 1e360 tau
let storychaper_9 =
  "The awards committee was so impressed with your work that they decide to give you a prize. \n \
You are asked to give a speech about your work. \n \
You say that a lot of hard work has gone into this project. \n \
However, there is still a bit more to be done. \n \
The committee gasps. \n \
You explain that reflecting on your past 'achievements', you believe you have found a way to make the system even more efficient. \n \
They reply that they have high expectations for your future work. \n \
";
theory.createStoryChapter(9, "Award Winner", storychaper_9, () => theory.tau > BigNumber.from("1e360"));

// All achievements unlocked
let storychaper_10 =
  "You were able to make the system efficient beyond your wildest dreams. \n \
You have achieved a high level of greatness - there is nothing left to achieve. \n \
Now you just need to sit back and let the system run. \n \
You are truly the master of Temperature Control. \n \
The End \n \
? \n \
(You have unlocked a new upgrade.) \
"
theory.createStoryChapter(10, "Master of Control", storychaper_10, () => calculateAchievementMultiplier() >= 30);
{
  // Internal
  var updateAvailability = () => {
    kickT.isAvailable = autoKick.level == 0;
    c1Exponent.isAvailable = autoKick.level >= 1;
    r1Exponent.isAvailable = autoKick.level >= 1;
    r2Exponent.isAvailable = c1Exponent.level >= 3 && r1Exponent.level >= 3;
    unlockC2.isAvailable = r2Exponent.level >= 2;
    c2.isAvailable = unlockC2.level > 0;
    c1BaseUpgrade.isAvailable = c1Exponent.level >= 3 && r1Exponent.level >= 3;
    rExponent.isAvailable = unlockC2.level >= 1 && c1BaseUpgrade.level >= 2;
    p1.isAvailable = calculateAchievementMultiplier() >= 30;
    p2.isAvailable = calculateAchievementMultiplier() >= 30;
  }

  var getInternalState = () => `${T.toString()} ${error[0].toString()} ${integral.toString()} ${kp.toString()} ${ki.toString()} ${kd.toString()} ${valve.toString()} ${publicationCount.toString()} ${r} ${autoKickerEnabled} ${cycleEstimate} ${setPoint} ${rEstimate} ${amplitude} ${frequency} ${maximumPublicationTdot} ${P}`;

  var setInternalState = (state) => {
    debug = state;
    let values = state.split(" ");
    if (values.length > 0) T = parseFloat(values[0]);
    if (values.length > 1) error[0] = parseFloat(values[1]);
    if (values.length > 2) integral = parseFloat(values[2]);
    if (values.length > 3) kp = parseFloat(values[3]);
    if (values.length > 4) ki = parseFloat(values[4]);
    if (values.length > 5) kd = parseFloat(values[5]);
    if (values.length > 6) valve = parseFloat(values[6]);
    if (values.length > 7) publicationCount = parseFloat(values[7])
    if (values.length > 8) r = parseBigNumber(values[8]);
    if (values.length > 9) autoKickerEnabled = values[9] == "true";
    if (values.length > 10) cycleEstimate = parseBigNumber(values[10]);
    if (values.length > 11) setPoint = parseFloat(values[11]);
    if (values.length > 12) rEstimate = parseBigNumber(values[12]);
    if (values.length > 13) amplitude = parseFloat(values[13]);
    if (values.length > 14) frequency = parseFloat(values[14]);
    if (values.length > 15) maximumPublicationTdot = parseBigNumber(values[15]);
    if (values.length > 16) P = parseBigNumber(values[16])
  }

  var updatePidValues = () => {
    kp = newKp;
    kd = newKd;
    ki = newKi;
    setPoint = newSetPoint;
    theory.invalidateSecondaryEquation();
  }

  var newKp = kp;
  var newKi = ki;
  var newKd = kd;
  var newSetPoint = setPoint;

  // Allows the user to reset post e100 tau for challenge runs
  var canResetStage = () => theory.tau > BigNumber.from(1e100);

  var getEquationOverlay = () => {
    return ui.createGrid({
      columnDefinitions: ["1*", "3*", "1*"],
      columnSpacing: 0,
      children: [
        ui.createStackLayout({
          horizontalOptions: LayoutOptions.FILL_AND_EXPAND,
          verticalOptions: LayoutOptions.FILL_AND_EXPAND,
          row: 0,
          column: 0,
          children: [
            ui.createImage({
              source: ImageSource.fromUri("https://raw.githubusercontent.com/lrobt97/Control-Theory/main/auto_adjuster_icon.png"),
              useTint: true,
              widthRequest: getImageSize(ui.screenWidth),
              heightRequest: getImageSize(ui.screenWidth),
              aspect: Aspect.ASPECT_FILL,
              margin: new Thickness(13,10,0,0),
              onTouched: (e) => {
                if (e.type.isReleased()) {
                  let autoKickMenu = createAutoKickerMenu();
                  autoKickMenu.show();
                }
              },
              isVisible: () => autoKick.level > 0,
              horizontalOptions: LayoutOptions.START,
              verticalOptions: LayoutOptions.START,
            }),
            ui.createFrame({
              isVisible: () => autoKick.level > 0,
              horizontalOptions: LayoutOptions.START_AND_EXPAND,
              verticalOptions: LayoutOptions.CENTER_AND_EXPAND,
              rotation: -90,
              scaleX: 1.75,
              translationX: -22,
              children: [
                autoTemperatureBar = ui.createProgressBar({
                progress: timer / frequency,
                widthRequest: 120,
                }),
              ]
            }),
          ]
      }),
        ui.createImage({
          useTint: false,
          source: ImageSource.fromUri("https://raw.githubusercontent.com/lrobt97/Control-Theory/main/pid_menu_icon.png"),
          widthRequest: getImageSize(ui.screenWidth),
          heightRequest: getImageSize(ui.screenWidth),
          aspect: Aspect.ASPECT_FILL,
          margin: new Thickness(0,10,10,0),
          onTouched: (e) => {
            if (e.type.isReleased()) {
              let pidMenu = createPidMenu();
              pidMenu.show();
            }
          },
          isVisible: () => changePidValues.level > 0,
          row: 0,
          column: 2,
          horizontalOptions: LayoutOptions.END,
          verticalOptions: LayoutOptions.START,
        }),
      ]
    })
  }
  const createAutoKickerMenu = () => {
    let amplitudeText = "Amplitude of T: ";
    let frequencyText = "Frequency in seconds: ";
    let amplitudeLabel, frequencyLabel;
    let amplitudeSlider, frequencySlider;
    let menu = ui.createPopup({
      title: "Temperature Adjuster",
      content: ui.createStackLayout({
        margin: new Thickness(0,10,0,0),
        children: [
          amplitudeLabel = ui.createLatexLabel({ text: amplitudeText + amplitude.toPrecision(3) }),
          amplitudeSlider = ui.createSlider({
            onValueChanged: () => amplitudeLabel.text = amplitudeText + amplitudeSlider.value.toPrecision(3),
          }),
          frequencyLabel = ui.createLatexLabel({ text: frequencyText + frequency.toPrecision(3) }),
          frequencySlider = ui.createSlider({
            onValueChanged: () => frequencyLabel.text = frequencyText + frequencySlider.value.toPrecision(3),
          }),
          ui.createStackLayout({
            orientation: StackOrientation.HORIZONTAL,
            horizontalOptions: LayoutOptions.CENTER,
            children: [
              ui.createLatexLabel({
                text: "Off/On",
                verticalOptions: LayoutOptions.CENTER,
              }),
              autoKickerSwitch = ui.createSwitch({
                isToggled: () => autoKickerEnabled,
                onTouched: (e) => { if (e.type == TouchType.PRESSED) autoKickerEnabled = !autoKickerEnabled }
              }),
            ]
          }),
          maxTdotLabel = ui.createLatexLabel({ text: maxTdotText + maximumPublicationTdot.toString() }),
          cycleEstimateLabel = ui.createLatexLabel({ text: cycleEstimateText + cycleEstimate.toString() }),
          rEstimateLabel = ui.createLatexLabel({ text: rEstimateText + rEstimate.toString() }),
          rhoEstimateLabel = ui.createLatexLabel({ text: rhoEstimateText + rhoEstimate.toString() }),
          ui.createButton({
            text: "Update",
            margin: new Thickness(0,10,0,0),
            onClicked: () => {
              amplitude = amplitudeSlider.value;
              frequency = frequencySlider.value
            }
          }),
        ]
      })
    })
    amplitudeSlider.maximum = Th;
    amplitudeSlider.minimum = Tc;
    amplitudeSlider.value = amplitude;
    frequencySlider.maximum = 60;
    frequencySlider.minimum = 1;
    frequencySlider.value = frequency;
    return menu;
  }
  const viewPIDInfoMenu = () => {
    log("Hello")
    let menu = ui.createPopup({
      title: "PID Menu Guide",
      content:
        ui.createScrollView({
          content:
          ui.createStackLayout({
            children: [
              ui.createLabel({
                horizontalTextAlignment: TextAlignment.START,
                text: "\
              This menu is used to tweak the parameters of the PID controller - a mechanism that can automatically adjust the temperature to a given value (known as the setpoint).\n \
              \n \
              This guide serves as an explanation for how the tuning parameters affect the main system. Each cycle, the controller measures the error term, e(t), and uses it in the below equation. Because this measurement only happens in discrete time intervals, the measurements are stored in the sequence e_n. \n \
              The output of the equation is converted into an integer between 0 and 512. This means any negative values are capped at 0 and the upper limit is capped at 512. This output is used within the main equation of the system.\n \
              \n \
              K_p: This refers to the proportional gain. The output of this term scales in proportion to the measured error. Only using this term results in permament offset, which causes the controller to stop even though it hasn't hit the setpoint. If this is set too high, the controller becomes more aggresive which means it overreacts to any small deviation.\n  \
              \n \
              K_i: This refers to the integral gain. This term allows the controller to calculate the sum of the previous errors and adjust the output to attempt to minimise them. This operation prevents the offset mentioned above, however setting the value too high can cause oscillations due to windup.\n \
              \n \
              K_d: This refers to the differential gain. This term measures the rate of change in the error and attempts to adjust the output to minimise future errors. This can prevent overshoot, which allows T to settle at the setpoint without moving too far beyond. However, setting this term too high can lead to oscillations and instablity.\n \
              \n \
              T_s: This refers to the setpoint. The controller will try to manipulate the temperature towards this value. \
                "
              })
            ]
          })

        })
    }
    );

    return menu;
  }
  const createPidMenu = () => {
    let kpText = "{K}_{p} = ";
    let tiText = "{K}_{i} = ";
    let tdText = "{K}_{d} = ";
    let setPointText = "{T}_{s} = "
    let kpTextLabel, kiTextLabel, kdTextLabel, setPointTextLabel;
    let kpSlider, kiSlider, kdSlider, setPointSlider;
    let menu = ui.createPopup({
      title: "Configure PID",
      content: 
        ui.createStackLayout({
          children: [
            ui.createImage({
              source: ImageSource.INFO,
              scaleX: 0.6,
              scaleY: 0.6,
              horizontalOptions: LayoutOptions.START,
              onTouched: (e) => {
                if(e.type.isReleased()) {
                  infoMenu = viewPIDInfoMenu();
                  infoMenu.show();
                }
              },
            }),
            ui.createLatexLabel({
              horizontalTextAlignment: TextAlignment.CENTER,
              verticalTextAlignment: TextAlignment.CENTER,
              fontSize: 12,
              text: Utils.getMath("\\begin{matrix} \
                e_n = T - T_{s} \\\\ \
                u(t) = K_p e_n + K_i\\sum_{0}^{n} ( e_i ) + K_d(e_n - e_{n-1}) \
                \\end{matrix}")
            }),
            kpTextLabel = ui.createLatexLabel({ text: Utils.getMath(kpText + kp.toString()) }),
            kpSlider = ui.createSlider({
              value: Math.log10(kp),
              minimum: -2,
              maximum: 2,
              onValueChanged: () => {
                kpTextLabel.text = Utils.getMath(kpText + Math.pow(10, kpSlider.value).toPrecision(2).toString());
                newKp = Math.pow(10, kpSlider.value);
              },
            }),
            kiTextLabel = ui.createLatexLabel({ text: Utils.getMath(tiText + ki.toString()) }),
            kiSlider = ui.createSlider({
              value: ki,
              minimum: 0,
              maximum: 50,
              onValueChanged: () => {
                kiTextLabel.text = Utils.getMath(tiText + kiSlider.value.toPrecision(2).toString());
                newKi = kiSlider.value;
              },
            }),
            kdTextLabel = ui.createLatexLabel({ text: Utils.getMath(tdText + kd.toString()) }),
            kdSlider = ui.createSlider({
              value: kd,
              minimum: 0,
              maximum: 50,
              onValueChanged: () => {
                kdTextLabel.text = Utils.getMath(tdText + kdSlider.value.toPrecision(2).toString());
                newKd = kdSlider.value;
              },
            }),
            setPointTextLabel = ui.createLatexLabel({ text: Utils.getMath(setPointText + setPoint.toPrecision(3)) }),
            setPointSlider = ui.createSlider({
              onValueChanged: () => {
                setPointTextLabel.text = Utils.getMath(setPointText + setPointSlider.value.toPrecision(3));
                newSetPoint = setPointSlider.value;
              },
            }),
            ui.createButton({ text: "Update", onClicked: updatePidValues })
          ]
        })
    })

    setPointSlider.maximum = Tc + Q / h / area;
    log(setPointSlider.maximum)
    setPointSlider.minimum = Tc + 20;
    setPointSlider.value = setPoint;
    return menu;
  }

  var resetStage = () => {
    c1.level = 0;
    r1.level = 0;
    r2.level = 0;
    p1.level = 0;
    p2.level = 0;
    c2.level = 0;
    tDotExponent.level = 0;
    rho.value = BigNumber.ZERO;
    initialiseSystem();
  }

  var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    achievementMultiplier = calculateAchievementMultiplier();
    timer += systemDt;
    if (timer > frequency && autoKickerEnabled == true) {
      // Calculates the root mean square
      cycleEstimate = (cycleEstimate / (frequency / systemDt)).sqrt();
      if (cycleEstimateLabel) cycleEstimateLabel.text = cycleEstimateText + cycleEstimate.toString();
      cycleEstimate = BigNumber.ZERO;
      cycleR = BigNumber.ZERO;
      T = amplitude;
      timer = 0;
      integral = 0;
    }
    autoTemperatureBar.progress = (timer <= frequency) * timer / (frequency);
    error[1] = error[0];
    error[0] = setPoint - T;
    integral += error[0];
    let derivative = (error[0] - error[1]) / systemDt;
    // Anti-windup scheme
    if (integral > 100) integral = 100;
    if (integral < -100) integral = -100;
    output = Math.round(Math.max(0, Math.min(kp * error[0] + ki * integral + kd * derivative, 512))); // range 0-512

    // Heating simulation
    let dT = 0;
    let prevT = T;
    let suppliedHeat = Q * output / 512
    dT = BigNumber.from(Math.abs(1 / mass / Cp * (suppliedHeat - (T - 30) * h * area)));
    let exponentialTerm = (suppliedHeat - h * area * (prevT - 30)) * BigNumber.E.pow(-1 * systemDt / mass / Cp)
    T = 30 + (suppliedHeat - exponentialTerm) / (h * area)

    let dp = 0;
    if (achievementMultiplier >= 30) dp = getP1(p1.level) * getP2(p2.level) * T / 100
    P += dp * dt;
    let dr = getR1(r1.level).pow(getR1Exp(r1Exponent.level)) * getR2(r2.level).pow(getR2Exp(r2Exponent.level)) / (1 + Math.log10(1 + Math.abs(error[0])));
    rEstimate = rEstimate * 0.95 + dr * 0.05;
    if (dT > maximumPublicationTdot) maximumPublicationTdot = dT;
    // Required sum for root mean square calculation
    cycleEstimate += dT.pow(2);
    r += dr * dt;
    let value_c1 = getC1(c1.level).pow(getC1Exp(c1Exponent.level));
    let value_c2 = getC2((unlockC2.level > 0) * c2.level)
    let dRho = P * r.pow(getRExp(rExponent.level)) * BigNumber.from(value_c1 * value_c2 * dT.pow(getTdotExponent(tDotExponent.level))).sqrt() * bonus;
    rho.value += dt * dRho;
    rhoEstimate = rhoEstimate * 0.95 + dRho * 0.05;

    // UI Updates
    if (rEstimateLabel) rEstimateLabel.text = rEstimateText + rEstimate.toString();
    if (maxTdotLabel) maxTdotLabel.text = maxTdotText + maximumPublicationTdot.toString();
    if (rhoEstimateLabel) rhoEstimateLabel.text = rhoEstimateText + rhoEstimate.toString();
    updateAvailability();
    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();
  }
}


{
  // Equations

  var getPrimaryEquation = () => {
    theory.primaryEquationHeight = 120;
    theory.primaryEquationScale = 1;
    let result = "\\begin{matrix}"

    let c1_exp = c1Exponent.level > 0 ? getC1Exp(c1Exponent.level).toNumber() : "";
    let r_exp = rExponent.level > 0 ? getRExp(rExponent.level).toNumber() : "";
    let r1_exp = r1Exponent.level > 0 ? getR1Exp(r1Exponent.level).toNumber() : "";
    let r2_exp = r2Exponent.level > 0 ? getR2Exp(r2Exponent.level).toNumber() : "";
    let c2_string = unlockC2.level > 0 ? "c_2" : "";
    let P_string = p1.isAvailable? "P":""
    result += "\\dot{\\rho} = " + P_string + " r^{" + r_exp + "}\\sqrt{c_1^{" + c1_exp + "} "+ c2_string + "\\dot{T}^{" + getTdotExponent(tDotExponent.level) + "}}";
    result += "\\\\ \\dot{r} = \\frac{r_1^{" + r1_exp + "} r_2^{" + r2_exp + "}}{1+\\log_{10}(1 + \|e(t)\|)}"
    if (p1.isAvailable) result += ",\\ \\dot{P} = p_1 p_2 \\frac{T}{100}";
    result += "\\\\ \\dot{T} = \\frac{1}{mc_p} (\\frac{u(t)}{512} \\dot{Q} - (T - 30)Ah)";
    result += "\\end{matrix}"
    return result;
  }

  var getSecondaryEquation = () => {
    theory.secondaryEquationHeight = 75;
    theory.secondaryEquationScale = 0.9;
    let result = "\\begin{array}{c}";

    result += "e(t) = T_{s} - T \\\\";
    result += "u(t) = " + output + " \\\\";
    result += theory.latexSymbol + "=\\max\\rho^{" + publicationExponent + "}";
    result += "\\end{array}"
    return result;
  }

  var getTertiaryEquation = () => {
    let result = "";
    result += "T =" + Math.fround(T).toPrecision(5);
    result += ",\\,T_{s} =" + setPoint.toPrecision(3) + ",\\ e(t) = " + Math.fround(error[0]).toPrecision(3);
    result += ",\\, r =" + r;
    if (p1.isAvailable) result += ",\\, P =" + P;
    return result;
  }
}
var getCustomCost = (level) => {
  let result = 1;
  switch (level) {
    case 0: result = 10; break; // autoKicker
    case 1: result = 35; break; // r1Exponent and c1Exponent
    case 2: result = 50; break;
    case 3: result = 65; break;
    case 4: result = 90; break;
    case 5: result = 110; break;
    case 6: result = 130; break;
    case 7: result = 150; break; // r2Exponent and c1Base
    case 8: result = 200; break;
    case 9: result = 325; break;
    case 10: result = 375; break;
    case 11: result = 400; break; // rExponent
    case 12: result = 420; break;
    case 13: result = 440; break; // c2
  }
  return result * 0.6;
}
var getC1Exp = (level) => BigNumber.from(1 + c1Exponent.level * 0.05);
var getRExp = (level) => BigNumber.from(1 + rExponent.level * 0.001);
var getR1Exp = (level) => BigNumber.from(1 + r1Exponent.level * 0.05);
var getR2Exp = (level) => BigNumber.from(1 + r2Exponent.level * r2ExponentScale);
var getC1 = (level) => BigNumber.from(C1Base + c1BaseUpgrade.level * 0.125).pow(level);
var getR1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getR2 = (level) => BigNumber.TWO.pow(level);
var getP1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 1);
var getP2 = (level) => BigNumber.TWO.pow(level);
var getC2 = (level) => BigNumber.E.pow(level);
var getTdotExponent = (level) => 2 + level;
let tauExponent = 0.2 / 0.6;
var getPublicationMultiplier = (tau) => achievementMultiplierUpgrade.level >= 1 ? achievementMultiplier * tau.pow(tauExponent) / 2 : tau.pow(tauExponent) / 2;
var getPublicationMultiplierFormula = (symbol) => (achievementMultiplierUpgrade.level >= 1 ? BigNumber.from(achievementMultiplier).toString(2) + "\\times \\frac{" + symbol + "^{"+ tauExponent.toPrecision(3) +"}}{2}" : "\\frac{" + symbol + "^{"+ tauExponent.toPrecision(3) +"}}{2}");
var get2DGraphValue = () => (BigNumber.ONE + T).toNumber();
var getTau = () => rho.value.pow(publicationExponent);
var getCurrencyFromTau = (tau) => [tau.max(BigNumber.ONE).pow(5 / 3), rho.symbol];
var postPublish = () => {
  initialiseSystem();
  theory.invalidatePrimaryEquation();
  theory.invalidateTertiaryEquation();
  publicationCount++;
}
init();
