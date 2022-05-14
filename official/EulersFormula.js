import {CustomCost, ExponentialCost} from "./api/Costs";
import { Localization } from "./api/Localization";
import {BigNumber, parseBigNumber} from "./api/BigNumber";
import {QuaternaryEntry, theory} from "./api/Theory";
import {Utils} from "./api/Utils";
import {ui} from "./api/ui/UI";
import {Thickness} from "./api/ui/properties/Thickness";
import {TextAlignment} from "./api/ui/properties/TextAlignment";
import {FontAttributes} from "./api/ui/properties/FontAttributes";
import {TouchType} from "./api/ui/properties/TouchType";
import { Vector3 } from "../../../Projects/theory-sdk/api/Vector3";
import {Color} from "./api/ui/properties/Color";
import {CornerRadius} from "./api/ui/properties/CornerRadius";
import {game} from "./api/Game";

requiresGameVersion("1.4.28");

var id = "eulers_formula";
var name = "Euler's Formula";
var description = "You're a student hired by a professor at a famous university. Since your work has received a bit of attention from your colleagues in the past, you decide to go into a subject not yet covered by your professor, which has interested you since day 1 of deciding to study mathematics - Complex Numbers.\nYou hope that with your research on this subject, you can finally get the breakthrough you always wanted in the scientific world.\n\nThis theory explores the world of complex numbers, their arrangement and their place in the Universe of Mathematics. The theory, named after famous mathematician Leonhard Euler, explores the relationship between exponential and trigonometric functions.\nYour task is to use this formula, and with the help of the Pythagorean theorem, to calculate the distances of cos(t) and isin(t) from the origin and grow them as large as possible using many different methods and approaches!\nA theory with interesting grow and decay rates, unusual properties, and (We hope) an interesting story!\n\nVariable Explanation:\n\nt - A simple variable based on time. Is reset on publish.\nq - A variable helping you grow ρ, directly affected by t.\na - Multiple kinds of variables, helping you grow ρ.\nb and c - Variables modifying cos(t) and isin(t)\n\nHuge thanks to:\n\n- Gilles-Philippe, for implementing integral features we proposed, helping us a *ton* during development, answering our questions and giving us beta features to use in our theories!\n\n- XLII, doing basically ALL of the balancing together with Snaeky, deciding various integral features of the theory such as, but not limited to: milestone placement, milestone costs, publication multipliers and a lot more!\n\n- Snaeky, without whom this theory would not have been possible as he was the one with the original idea of structuring a theory around Euler's Formula, and always answered my (peanut's) questions and motivated us all to push this theory forward.\n\nand of course:\n\n- The entire Discord community, who've playtested this theory and reported many bugs, especially those active in #custom-theories-dev!\n\nWe hope you enjoy playing this theory as much as we had developing it and coming up with ideas for it!\n\n- The Eulers-Formula-CT Team"
var authors = "Snaeky (SnaekySnacks#1161) - Structuring\nXLII (XLII#0042) - Balancing\npeanut (peanut#6368) - Developer";
var version = 3;
var releaseOrder = "3";

// internal variables
var currency, currency_R, currency_I;
var quaternaryEntries;
var app_was_closed = false;

// upgrade variables
var q1, q2;
var a1, a2, a3;
var b1, b2;
var c1, c2;
var q = BigNumber.ONE;

// sneaky sneaky
var s_achievement_1;
var s_achievement_2;
var s_achievement_3;
var s_achievement_4;
var s_boolean_1 = true;
var s_boolean_2 = true;
var s_boolean_3 = true;
var s_boolean_4 = true;
var s_count_3 = 0;
var s_count_4 = 0;

// s_achievement description
var s_achievement_1_description = "L"+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+(!![]+[])[(+[])]+` `+'q'+`1`+` `+(![]+[])[(+!+[])]+([]+[]+[][[]])[(+!+[])]+([]+[]+[][[]])[((+!+[])+(+!+[]))]+` `+'q'+`2`+` `+(typeof [])[(+!+[])]+(typeof ![])[(+!+[])]+(!![]+[])[(+[])]+'h'+` `+'h'+(![]+[])[(+!+[])]+([]+[]+([]).constructor)[(+[+!+[]+[+[]+[+[]]]])/((+!+[])+(+!+[]))/((+!+[])+(+!+[]))-(+!+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+` `+`1`+`9`+` `+(![]+[])[((+!+[])+(+!+[]))]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+([]+[]+([]).constructor)[(+[+!+[]+[+[]+[+[]]]])/((+!+[])+(+!+[]))/((+!+[])+(+!+[]))-(+!+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+(![]+[])[((+!+[])+(+!+[]))]+(![]+[])[(+!+[]+((+!+[])+(+!+[])))]+` `+'w'+'h'+([]+[]+[][[]])[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+(![]+[])[((+!+[])+(+!+[]))]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+` `+'h'+(![]+[])[(+!+[])]+([]+[]+([]).constructor)[(+[+!+[]+[+[]+[+[]]]])/((+!+[])+(+!+[]))/((+!+[])+(+!+[]))-(+!+[])]+([]+[]+[][[]])[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+([]+[]+[][[]])[(+!+[])]+(typeof ([]+[]))[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+` `+(![]+[])[(+!+[])]+(typeof [])[(+!+[])]+(typeof ![])[(+!+[])]+([]+[]+([]).constructor)[(+[+!+[]+[+[]+[+[]]]])/((+!+[])+(+!+[]))/((+!+[])+(+!+[]))-(+!+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+` `+`1`+`.`+`4`+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+`7`+`ρ`+`.`+"\n\n"+``+"D"+(typeof ![])[(+!+[])]+` `+(!![]+[])[(+[])]+'h'+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+` `+(![]+[])[(+[])]+(![]+[])[((+!+[])+(+!+[]))]+(![]+[])[(+!+[])]+(![]+[])[(+!+[]+((+!+[])+(+!+[])))]+'h'+(typeof [])[(+!+[])]+(![]+[])[(+!+[])]+([]+[]+[][[]])[(+!+[])]+(typeof ([]+[]))[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+` `+([]+[]+[][[]])[((+!+[])+(+!+[]))]+(![]+[])[(+!+[])]+([]+[]+[][[]])[(+!+[])]+(typeof [])[((+!+[])+(+!+[]))*((+!+[])+(+!+[]))]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+`!`+``+`\n\n`;
var s_achievement_2_description = "L"+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+(!![]+[])[(+[])]+` `+(!![]+[])[(+[])]+` `+'h'+(![]+[])[(+!+[])]+([]+[]+([]).constructor)[(+[+!+[]+[+[]+[+[]]]])/((+!+[])+(+!+[]))/((+!+[])+(+!+[]))-(+!+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+` `+`4`+`,`+` `+'q'+`1`+` `+'h'+(![]+[])[(+!+[])]+([]+[]+([]).constructor)[(+[+!+[]+[+[]+[+[]]]])/((+!+[])+(+!+[]))/((+!+[])+(+!+[]))-(+!+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+` `+`2`+` `+(![]+[])[(+!+[])]+([]+[]+[][[]])[(+!+[])]+([]+[]+[][[]])[((+!+[])+(+!+[]))]+` `+'q'+`2`+` `+'h'+(![]+[])[(+!+[])]+([]+[]+([]).constructor)[(+[+!+[]+[+[]+[+[]]]])/((+!+[])+(+!+[]))/((+!+[])+(+!+[]))-(+!+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+` `+`0`+` `+(![]+[])[((+!+[])+(+!+[]))]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+([]+[]+([]).constructor)[(+[+!+[]+[+[]+[+[]]]])/((+!+[])+(+!+[]))/((+!+[])+(+!+[]))-(+!+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+(![]+[])[((+!+[])+(+!+[]))]+(![]+[])[(+!+[]+((+!+[])+(+!+[])))]+`.`+`\n\n`+"D"+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+([]+[]+[][[]])[((+!+[])+(+!+[]))]+([]+[]+[][[]])[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+(typeof [])[((+!+[])+(+!+[]))*((+!+[])+(+!+[]))]+(![]+[])[(+!+[])]+(!![]+[])[(+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+([]+[]+[][[]])[((+!+[])+(+!+[]))]+` `+(!![]+[])[(+[])]+(typeof ![])[(+!+[])]+` `+(![]+[])[(+!+[]+((+!+[])+(+!+[])))]+([]+[]+[][[]])[(+!+[])]+(![]+[])[(+!+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+'k'+(([]).constructor.name)[(+!+[])+(+!+[]+((+!+[])+(+!+[])))]+`.\n\n`;
var s_achievement_3_description = "B"+(!![]+[])[((+!+[])+(+!+[]))]+(([]).constructor.name)[(+!+[])+(+!+[]+((+!+[])+(+!+[])))]+` `+`1`+`0`+` `+(![]+[])[((+!+[])+(+!+[]))]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+([]+[]+([]).constructor)[(+[+!+[]+[+[]+[+[]]]])/((+!+[])+(+!+[]))/((+!+[])+(+!+[]))-(+!+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+(![]+[])[((+!+[])+(+!+[]))]+(![]+[])[(+!+[]+((+!+[])+(+!+[])))]+` `+(typeof ![])[(+!+[])]+(![]+[])[(+[])]+` `+(![]+[])[(+!+[])]+([]+[]+[][[]])[(+!+[])]+(([]).constructor.name)[(+!+[])+(+!+[]+((+!+[])+(+!+[])))]+` `+(!![]+[])[((+!+[])+(+!+[]))]+(RegExp().constructor.name)[((+!+[])+(+!+[]))+(+!+[]+((+!+[])+(+!+[])))]+(typeof ([]+[]))[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+(!![]+[])[(+!+[])]+(![]+[])[(+!+[])]+([]+[]+[][[]])[((+!+[])+(+!+[]))]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+`,`+` `+(typeof ![])[(+!+[])]+([]+[]+[][[]])[(+!+[])]+(![]+[])[((+!+[])+(+!+[]))]+(([]).constructor.name)[(+!+[])+(+!+[]+((+!+[])+(+!+[])))]+` `+'w'+'h'+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+([]+[]+[][[]])[(+!+[])]+` `+(!![]+[])[(+[])]+` `+([]+[]+[][[]])[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+(![]+[])[(+!+[]+((+!+[])+(+!+[])))]+` `+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+([]+[]+([]).constructor)[(+[+!+[]+[+[]+[+[]]]])/((+!+[])+(+!+[]))/((+!+[])+(+!+[]))-(+!+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+([]+[]+[][[]])[(+!+[])]+`.`+"\n\nY"+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+(![]+[])[(+!+[]+((+!+[])+(+!+[])))]+` `+(!![]+[])[(+[])]+'h'+(![]+[])[(+!+[])]+(!![]+[])[(+[])]+` `+(!![]+[])[(+[])]+([]+[]+[][[]])[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+(!![]+[])[(+[])]+(![]+[])[((+!+[])+(+!+[]))]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+` `+([]+[]+[][[]])[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+(![]+[])[(+!+[]+((+!+[])+(+!+[])))]+` `+(![]+[])[(+!+[])]+` `+(!![]+[])[(+!+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+(![]+[])[(+!+[])]+(![]+[])[((+!+[])+(+!+[]))]+` `+(![]+[])[(+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+(![]+[])[(+!+[])]+(!![]+[])[(+!+[])]+` `+(typeof [])[(+!+[])]+(([]).constructor.name)[(+!+[])+(+!+[]+((+!+[])+(+!+[])))]+` `+(!![]+[])[(+[])]+'h'+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+` `+'w'+(![]+[])[(+!+[])]+(([]).constructor.name)[(+!+[])+(+!+[]+((+!+[])+(+!+[])))]+`.\n\n`;
var s_achievement_4_description = "B"+(!![]+[])[((+!+[])+(+!+[]))]+(([]).constructor.name)[(+!+[])+(+!+[]+((+!+[])+(+!+[])))]+` `+`1`+`0`+` `+(![]+[])[((+!+[])+(+!+[]))]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+([]+[]+([]).constructor)[(+[+!+[]+[+[]+[+[]]]])/((+!+[])+(+!+[]))/((+!+[])+(+!+[]))-(+!+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+(![]+[])[((+!+[])+(+!+[]))]+(![]+[])[(+!+[]+((+!+[])+(+!+[])))]+` `+(typeof ![])[(+!+[])]+(![]+[])[(+[])]+` `+(![]+[])[(+!+[])]+([]+[]+[][[]])[(+!+[])]+(([]).constructor.name)[(+!+[])+(+!+[]+((+!+[])+(+!+[])))]+` `+(!![]+[])[((+!+[])+(+!+[]))]+(RegExp().constructor.name)[((+!+[])+(+!+[]))+(+!+[]+((+!+[])+(+!+[])))]+(typeof ([]+[]))[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+(!![]+[])[(+!+[])]+(![]+[])[(+!+[])]+([]+[]+[][[]])[((+!+[])+(+!+[]))]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+`,`+` `+(typeof ![])[(+!+[])]+([]+[]+[][[]])[(+!+[])]+(![]+[])[((+!+[])+(+!+[]))]+(([]).constructor.name)[(+!+[])+(+!+[]+((+!+[])+(+!+[])))]+` `+'w'+'h'+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+([]+[]+[][[]])[(+!+[])]+` `+(typeof ([]+[]))[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+`_`+([]+[]+[][[]])[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+` `+([]+[]+[][[]])[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+(![]+[])[(+!+[]+((+!+[])+(+!+[])))]+` `+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+(RegExp().constructor.name)[(+!+[]+((+!+[])+(+!+[])))+(+!+[])]+(![]+[])[(+!+[])]+(typeof [])[((+!+[])+(+!+[]))*((+!+[])+(+!+[]))]+(!![]+[])[(+[])]+(![]+[])[((+!+[])+(+!+[]))]+(([]).constructor.name)[(+!+[])+(+!+[]+((+!+[])+(+!+[])))]+` `+`1`+`.\n\nH`+(typeof ![])[(+!+[])]+'w'+` `+([]+[]+[][[]])[((+!+[])+(+!+[]))]+([]+[]+[][[]])[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+([]+[]+[][[]])[((+!+[])+(+!+[]))]+` `+(([]).constructor.name)[(+!+[])+(+!+[]+((+!+[])+(+!+[])))]+(typeof ![])[(+!+[])]+(!![]+[])[((+!+[])+(+!+[]))]+` `+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+([]+[]+([]).constructor)[(+[+!+[]+[+[]+[+[]]]])/((+!+[])+(+!+[]))/((+!+[])+(+!+[]))-(+!+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+([]+[]+[][[]])[(+!+[])]+` `+([]+[]+[][[]])[((+!+[])+(+!+[]))]+([]+[]+[][[]])[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+(![]+[])[(+!+[]+((+!+[])+(+!+[])))]+(typeof [])[((+!+[])+(+!+[]))*((+!+[])+(+!+[]))]+(typeof ![])[(+!+[])]+([]+[]+([]).constructor)[(+[+!+[]+[+[]+[+[]]]])/((+!+[])+(+!+[]))/((+!+[])+(+!+[]))-(+!+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+(!![]+[])[(+!+[])]+` `+(!![]+[])[(+[])]+'h'+([]+[]+[][[]])[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+(![]+[])[(+!+[]+((+!+[])+(+!+[])))]+`?\n\n`

// milestone variables
var a_base, a_exp;
var b_base, c_base;
var dimension;

// graph variables
var scale = 0.2;
var r_graph = BigNumber.ZERO;
var i_graph = BigNumber.ZERO;
var t_speed;                  // multiplies dt by given value (1 + t_multiplier * dt)
var t = BigNumber.ZERO;       // time elapsed ( -> cos(t), sin(t) etc.)
var t_graph = BigNumber.ZERO; // distance from current x value to origin
var max_r_graph, max_i_graph;
var num_publications = 0;

// vector variables
// original 3d graph made by EdgeOfDreams#4525
var state = new Vector3(0, 0, 0);
var center = new Vector3(0, 0, 0);
var swizzle = (v) => new Vector3(v.y, v.z, v.x);

var init = () => {
    currency = theory.createCurrency();
    currency_R = theory.createCurrency("R", "R");
    currency_I = theory.createCurrency("I", "I");

    max_r_graph = BigNumber.ZERO;
    max_i_graph = BigNumber.ZERO;
    scale = 0.2;

    quaternaryEntries = [];

    // Regular Upgrades

    // t
    {
        let getDesc = (level) => "\\dot{t}=" + BigNumber.from(0.2 + (0.2 * level)).toString(level > 3 ? 0 : 1);
        let getInfo = (level) => "\\dot{t}=" + BigNumber.from(0.2 + (0.2 * level)).toString(level > 3 ? 0 : 1);
        t_speed = theory.createUpgrade(0, currency, new ExponentialCost(1e6, Math.log2(1e6)));
        t_speed.getDescription = (_) => Utils.getMath(getDesc(t_speed.level));
        t_speed.getInfo = (amount) => t_speed.level == t_speed.maxLevel ? Utils.getMath(getInfo(t_speed.level)) : Utils.getMathTo(getInfo(t_speed.level), getInfo(t_speed.level + amount));
        t_speed.maxLevel = 4;
    }

    // q1
    {
        let getDesc = (level) => "q_1=" + getQ1(level).toString(0);
        let getInfo = (level) => "q_1=" + getQ1(level).toString(0);
        q1 = theory.createUpgrade(1, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(1.61328))));
        q1.getDescription = (_) => Utils.getMath(getDesc(q1.level));
        q1.getInfo = (amount) => Utils.getMathTo(getDesc(q1.level), getDesc(q1.level + amount));
        q1.bought = (sVarBought);
    }

    // q2
    {
        let getDesc = (level) => "q_2=2^{" + level + "}";
        let getInfo = (level) => "q_2=" + getQ2(level).toString(0);
        q2 = theory.createUpgrade(2, currency, new ExponentialCost(5, Math.log2(60)));
        q2.getDescription = (_) => Utils.getMath(getDesc(q2.level));
        q2.getInfo = (amount) => Utils.getMathTo(getInfo(q2.level), getInfo(q2.level + amount));
        q2.bought = (sVarBought);
    }

    // b1
    {
        let getDesc = (level) => "b_1=" + getB1(level).toString(0);
        let getInfo = (level) => "b_1=" + getB1(level).toString(0);
        b1 = theory.createUpgrade(3, currency_R, new FirstFreeCost(ExponentialCost(20, Math.log2(200))));
        b1.getDescription = (_) => Utils.getMath(getDesc(b1.level));
        b1.getInfo = (amount) => Utils.getMathTo(getDesc(b1.level), getDesc(b1.level + amount));
        b1.bought = (sVarBought);
    }

    // b2
    {
        let getDesc = (level) => "b_2=" + (1.1 + (0.01 * b_base.level)) + "^{" + level + "}";
        let getInfo = (level) => "b_2=" + getB2(level).toString(2);
        b2 = theory.createUpgrade(4, currency_R, new ExponentialCost(100, Math.log2(2)));
        b2.getDescription = (_) => Utils.getMath(getDesc(b2.level));
        b2.getInfo = (amount) => Utils.getMathTo(getInfo(b2.level), getInfo(b2.level + amount));
        b2.bought = (sVarBought);
    }


    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(0);
        let getInfo = (level) => "c_1=" + getC1(level).toString(0);
        c1 = theory.createUpgrade(5, currency_I, new FirstFreeCost(new ExponentialCost(20, Math.log2(200))));
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));
        c1.bought = (sVarBought);
    }

    // c2
    {
        let getDesc = (level) => "c_2=" + (1.1 + (0.0125 * c_base.level)) + "^{" + level + "}";
        let getInfo = (level) => "c_2=" + getC2(level).toString(2);
        c2 = theory.createUpgrade(6, currency_I, new ExponentialCost(100, Math.log2(2)));
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
        c2.bought = (sVarBought);
    }

    // a1
    {
        let getDesc = (level) => "a_1=" + getA1(level).toString(0);
        let getInfo = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(7, currency, new FirstFreeCost(new ExponentialCost(2000, 2.2)));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getDesc(a1.level), getDesc(a1.level + amount));
        a1.bought = (sVarBought);
    }

    // a2
    {
        let getDesc = (level) => "a_2=" + getA2(level).toString(0);
        let getInfo = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(8, currency_R, new ExponentialCost(500, 2.2));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getInfo(a2.level), getInfo(a2.level + amount));
        a2.bought = (sVarBought);
    }

    // a3
    {
        let getDesc = (level) => "a_3=2^{" + level + "}";
        let getInfo = (level) => "a_3=" + getQ2(level).toString(0);
        a3 = theory.createUpgrade(9, currency_I, new ExponentialCost(500, 2.2));
        a3.getDescription = (_) => Utils.getMath(getDesc(a3.level));
        a3.getInfo = (amount) => Utils.getMathTo(getInfo(a3.level), getInfo(a3.level + amount));
        a3.bought = (sVarBought);
    }

    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e20);

    // Milestone Upgrades
    theory.setMilestoneCost(new CustomCost(total => BigNumber.from(getCustomCost(total))));

    {
        dimension = theory.createMilestoneUpgrade(0, 2);
        dimension.getDescription = () => dimension.level == 0 ? "Unlock the real component R" : "Unlock the imaginary component I";
        dimension.getInfo = () => Localization.getUpgradeAddDimensionDesc();
        dimension.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); theory.invalidateSecondaryEquation(); theory.invalidateTertiaryEquation(); updateAvailability(); }
        dimension.canBeRefunded = (_) => a_base.level == 0 && a_exp.level == 0 && b_base.level == 0 && c_base.level == 0;
    }

    {
        a_base = theory.createMilestoneUpgrade(1, 3);
        a_base.getDescription = (_) => Localization.getUpgradeAddTermDesc(a_base.level > 0 ? (a_base.level > 1 ? "a_3" : "a_2") : "a_1");
        a_base.getInfo = (_) => Localization.getUpgradeAddTermInfo(a_base.level > 0 ? (a_base.level > 1 ? "a_3" : "a_2") : "a_1");
        a_base.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); }
        a_base.canBeRefunded = (l) => (a_exp.level == 0 || a_base.level > 1) && b_base.level == 0 && c_base.level == 0;
    }

    {
        a_exp = theory.createMilestoneUpgrade(2, 5);
        a_exp.getDescription = (_) => Localization.getUpgradeIncCustomExpDesc(a_base.level > 0 ? (a_base.level > 1 ? (a_base.level > 2 ? "a_1a_2a_3" : "a_1a_2") : "a_1") : "a_1", "0.1");
        a_exp.getInfo = (_) => Localization.getUpgradeIncCustomExpInfo(a_base.level > 0 ? (a_base.level > 1 ? (a_base.level > 2 ? "a_1a_2a_3" : "a_1a_2") : "a_1") : "a_1", "0.1");
        a_exp.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); }
        a_exp.canBeRefunded = (_) => b_base.level == 0 && c_base.level == 0;
    }

    {
        b_base = theory.createMilestoneUpgrade(3, 2);
        b_base.getDescription = (_) => "$\\uparrow  b_2$ base by 0.01";
        b_base.getInfo = (_) => "Increases $b_2$ base by 0.01";
        b_base.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); }
        b_base.canBeRefunded = (_) => c_base.level == 0;
    }

    {
        c_base = theory.createMilestoneUpgrade(4, 2);
        c_base.getDescription = (_) => "$\\uparrow  c_2$ base by 0.0125";
        c_base.getInfo = (_) => "Increases $c_2$ base by 0.0125";
        c_base.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); }
    }

    // Achievements
    let achievement_category_1 = theory.createAchievementCategory(0, "Currencies");
    let achievement_category_2 = theory.createAchievementCategory(1, "Milestones");
    let achievement_category_3 = theory.createAchievementCategory(2, "Publications");
    let achievement_category_4 = theory.createAchievementCategory(3, "Secret Achievements");

    let e10 = BigNumber.from(1e10);
    let e20 = BigNumber.from(1e20);
    let e25 = BigNumber.from(1e25);
    let e50 = BigNumber.from(1e50);
    let e69 = BigNumber.from(1e69);
    let e75 = BigNumber.from(1e75);
    let e100 = BigNumber.from(1e100);
    let e125 = BigNumber.from(1e125);
    let e150 = BigNumber.from(1e150);
    theory.createAchievement(0, achievement_category_1, "Getting Started", "Reach 1e10τ.", () => theory.tau > e10);
    theory.createAchievement(1, achievement_category_1, "Beginner's Luck", "Reach 1e20τ.", () => theory.tau > e20);
    theory.createAchievement(2, achievement_category_1, "Imaginary Limits", "Reach 1e25τ.", () => theory.tau > e25);
    theory.createAchievement(3, achievement_category_1, "Complex Progress", "Reach 1e50τ.", () => theory.tau > e50);
    theory.createAchievement(4, achievement_category_1, "Nice", "Reach 1e69τ.", () => theory.tau > e69);
    theory.createAchievement(5, achievement_category_1, "Euler's Student", "Reach 1e75τ.", () => theory.tau > e75);
    theory.createAchievement(6, achievement_category_1, "There's more?", "Reach 1e100τ.", () => theory.tau > e100);
    theory.createAchievement(7, achievement_category_1, "Are we done yet?", "Reach 1e125τ.", () => theory.tau > e125);
    theory.createAchievement(8, achievement_category_1, "A New Professor", "Reach 1e150τ.", () => theory.tau > e150);

    theory.createAchievement(9, achievement_category_2, "Automatic Analysis", "Let your machine learning algorithm calculate the theory for you.", () => theory.isAutoBuyerAvailable);
    theory.createAchievement(10, achievement_category_2, "Realistic Methods", "Figure out how to use R (real dimension).", () => dimension.level > 0);
    theory.createAchievement(11, achievement_category_2, "Imaginary Concepts", "Figure out how to use I (imaginary dimension).", () => dimension.level > 1);
    theory.createAchievement(12, achievement_category_2, "Arithmetic Multiplication", "Use the idea of your colleagues and add a multiplier.", () => a_base.level > 0);
    theory.createAchievement(13, achievement_category_2, "Exponential Growth", "Add an exponent to your main equation.", () => a_exp.level > 0);
    theory.createAchievement(14, achievement_category_2, "Acids and ...Bases?", "Change the base of b2.", () => b_base.level > 0);

    theory.createAchievement(15, achievement_category_3, "First Time", "Publish your research once.", () => num_publications >= 1);
    theory.createAchievement(16, achievement_category_3, "Not a fad?", "Publish your research twice.", () => num_publications >= 2);
    theory.createAchievement(17, achievement_category_3, "I recognize this name!", "Publish your research 5 times.", () => num_publications >= 5);
    theory.createAchievement(18, achievement_category_3, "Famous Publicist", "Publish your research 10 times.", () => num_publications >= 10);
    theory.createAchievement(19, achievement_category_3, "Senior Writer", "Publish your research 25 times.", () => num_publications >= 25);
    theory.createAchievement(20, achievement_category_3, "Lead Author", "Publish your research 50 times.", () => num_publications >= 50);


    // stop spoiling yourselves and figure out yourselves, what the SA's are !
    s_achievement_1 = theory.createSecretAchievement(21, achievement_category_4, "It's Bright!", s_achievement_1_description, "19 is my favourite number.", () => s1Proof());
    s_achievement_2 = theory.createSecretAchievement(22, achievement_category_4, "Competition", s_achievement_2_description, "Smoke what everyday?", () => s2Proof());
    s_achievement_3 = theory.createSecretAchievement(23, achievement_category_4, "Imparnumerophobia", s_achievement_3_description, "I don't like odd numbers.", () => s3Proof());
    s_achievement_4 = theory.createSecretAchievement(24, achievement_category_4, "Perfectionist", s_achievement_4_description, "Flawlessness is my speciality.", () => s4Proof());


    // Story Chapters
    let story_chapter_1 = "";
    story_chapter_1 += "You approach your professor with a problem you found.\n"
    story_chapter_1 += "You say: \"Professor, all other experts in our field keep saying that this cannot be used to further our research.\n"
    story_chapter_1 += "However, I think I can get something out of it!\"\n"
    story_chapter_1 += "You hand him the paper with the theory:\n";
    story_chapter_1 += "e^ix = cos(x) + i * sin(x).\n\n"
    story_chapter_1 += "He looks at you and says:\n";
    story_chapter_1 += "\"This is Euler's Formula. Are you sure you can get results out of something that has imaginary numbers?\"\n";
    story_chapter_1 += "\"Yes! I believe I can!\", you reply to him with anticipation.\n";
    story_chapter_1 += "He gives you the green light to work on the project.";
    theory.createStoryChapter(0, "Circular Reasoning", story_chapter_1, () => q1.level == 0); // unlocked at beginning of the theory

    let story_chapter_2 = "";
    story_chapter_2 += "As you start your research, you realize that\n"
    story_chapter_2 += "it is much harder than you anticipated.\n"
    story_chapter_2 += "You start experimenting with this formula.\n";
    story_chapter_2 += "However, you cannot figure out how to integrate the graph into your equation yet.\n";
    story_chapter_2 += "Your motivation is higher than ever though,\n";
    story_chapter_2 += "and you can't wait to progress further with this.";
    theory.createStoryChapter(1, "Anticipation", story_chapter_2, () => currency.value > BigNumber.from(1e7)); // unlocked at rho = 1e7

    let story_chapter_3 = "";
    story_chapter_3 += "After several months of work on this as a side project,\n"
    story_chapter_3 += "you finally figure it out:\n"
    story_chapter_3 += "You know how to modify the equation.\n";
    story_chapter_3 += "You try to modify the cosine value\n";
    story_chapter_3 += "and give it a new name: 'R'.\n";
    story_chapter_3 += "You start experimenting with 'R'\n";
    story_chapter_3 += "and try to figure out what happens\n";
    story_chapter_3 += "when you modify it.";
    theory.createStoryChapter(2, "A Breakthrough", story_chapter_3, () => dimension.level == 1); // unlocked at R dimension milestone

    let story_chapter_4 = "";
    story_chapter_4 += "Interesting.\n";
    story_chapter_4 += "You see that the modification did something to the partical.\n";
    story_chapter_4 += "It's not affecting ρ but its doing something.\n";
    story_chapter_4 += "You decide that doing the same to the complex component is a good idea.\n";
    story_chapter_4 += "'i' is going to be interesting to deal with...\n";
    story_chapter_4 += "You name it 'I' and continue your calculations.";
    theory.createStoryChapter(3, "Complex Progress", story_chapter_4, () => dimension.level == 2); // unlocked at I dimension milestone

    let story_chapter_5 = "";
    story_chapter_5 += "Several weeks have passed since you have added 'I' as a component to your research.\n"
    story_chapter_5 += "However, you observe the growth slow down considerably and worry that your research is all for nothing.\n";
    story_chapter_5 += "You ask your colleagues what you should do.\n"
    story_chapter_5 += "One of them says: \"Add a variable to multiply the theory with.\n"
    story_chapter_5 += "Maybe that will help with your progress.\"\n"
    story_chapter_5 += "You create a small little variable called: 'a1'."
    theory.createStoryChapter(4, "A Different Approach", story_chapter_5, () => a_base.level == 1); // unlocked at a_base first milestone

    let story_chapter_6 = "";
    story_chapter_6 += "It worked!\n"
    story_chapter_6 += "Your multipliers are doing a great job pushing the theory.\n";
    story_chapter_6 += "But what if you could go even further?\n"
    story_chapter_6 += "After all, you have observed the theory for a long time now.\n"
    story_chapter_6 += "You decide to create a variable called 'a3'. It will have exponential growth.\n"
    story_chapter_6 += "Is this enough, for the theory to reach its limit?\n"
    story_chapter_6 += "It nevertheless helps you immensely in your progress."
    theory.createStoryChapter(10, "Explosion", story_chapter_6, () => a_base.level == 3); // unlocked at a_base last milestone

    let story_chapter_7 = "";
    story_chapter_7 += "\"Of course!\n";
    story_chapter_7 += "It's a relationship between exponential functions and trigonometry!\n";
    story_chapter_7 += "Why shouldn't I add an exponent?\n";
    story_chapter_7 += "Surely, using this, this theory can be pushed to its limit!\",\n";
    story_chapter_7 += "you think to yourself.\n";
    story_chapter_7 += "You decide to add an exponent to your multipliers.";
    theory.createStoryChapter(5, "Exponential Ideas", story_chapter_7, () => a_exp.level == 1); // unlocked at a_exponent first milestone

    let story_chapter_8 = "";
    story_chapter_8 += "Summer break has finally arrived.\n";
    story_chapter_8 += "Maybe it's time for you to quit.\n";
    story_chapter_8 += "You have pushed this theory to its limit, you think to yourself\n";
    story_chapter_8 += "that there's nothing more you can do.\n";
    story_chapter_8 += "You have tried everything you can think of.\n";
    story_chapter_8 += "It's time to let go.\n\n\n\n";
    story_chapter_8 += "Or is it...?"
    theory.createStoryChapter(6, "The End?", story_chapter_8, () => (a_base.level == 3 && a_exp.level == 5)); // unlocked at a_exp and a_base max milestone

    let story_chapter_9 = "";
    story_chapter_9 += "Your summer break was beautiful.\n"
    story_chapter_9 += "You had a great time with your friends.\n"
    story_chapter_9 += "However, that constant thought of the theory can't get out of your head.\n"
    story_chapter_9 += "Since the start of summer break, it has plagued you.\n";
    story_chapter_9 += "\"This cannot be the end.\", you think.\n";
    story_chapter_9 += "\"There has to be something more! No way its limit is so low!\"\n\n";
    story_chapter_9 += "You look over the theory again and notice something.\n"
    story_chapter_9 += "After all this work, how come you never changed the bases of 'b' and 'c'?\n";
    story_chapter_9 += "You gain motivation and start work on the theory again."
    theory.createStoryChapter(7, "A New Beginning", story_chapter_9, () => b_base.level > 0); // unlocked at tau = e100 (b2 first milestone)

    let story_chapter_10 = "";
    story_chapter_10 += "You wake up in a sudden panic.\n"
    story_chapter_10 += "You had a nightmare, of a huge 'i' falling on you.\n";
    story_chapter_10 += "Another night in your lab.\n";
    story_chapter_10 += "This has been the 3rd time this week.\n"
    story_chapter_10 += "Your theory is growing incredibly slow.\n";
    story_chapter_10 += "You cannot figure out why.\n";
    story_chapter_10 += "The past weeks have been filled of you\n"
    story_chapter_10 += "trying to grow this theory as large as you possibly can.\n\n"
    story_chapter_10 += "More or less successful.\n\n"
    story_chapter_10 += "Suddenly, you realize that you forgot to change the base of 'c'.\n"
    story_chapter_10 += "You think, about how 'a3' is connected to 'c'.\n"
    story_chapter_10 += "Can this be the step to push the theory to its limit?"
    theory.createStoryChapter(8, "Frustration", story_chapter_10, () => c_base.level > 0); // unlocked at tau = e120 (c2 first milestone)

    let story_chapter_11 = "";
    story_chapter_11 += "You finally did it.\n"
    story_chapter_11 += "You have proven that the theory is able to be pushed to its limit.\n"
    story_chapter_11 += "You are proud of yourself.\n"
    story_chapter_11 += "Your publications get a massive amount of attention.\n"
    story_chapter_11 += "One day, your professor reaches out to you:\n"
    story_chapter_11 += "\"You have shown a lot of dedication,\n"
    story_chapter_11 += "far more than I have ever seen from any student I've ever lectured.\n";
    story_chapter_11 += "I am retiring this semester. The same as you graduate in.\n";
    story_chapter_11 += "I got a small job offering for you.\n";
    story_chapter_11 += "Are you willing to continue in my position?\"\n";
    story_chapter_11 += "You excitingly accept his offer and cannot wait to pursue a career as a professor.\n\n\n"
    story_chapter_11 += "The End."
    theory.createStoryChapter(9, "The True Ending", story_chapter_11, () => predicateAndCallbackPopup()); // unlocked at tau = e150 (finished)

    updateAvailability();
}

// INTERNAL FUNCTIONS
// -------------------------------------------------------------------------------

// written by gilles
let e150 = BigNumber.from(1e150);
var predicateAndCallbackPopup = () => {
    if (theory.tau >= e150) {
        getEndPopup.show();
        return true;
    }
    return false;
}

// written by xlii
var getCustomCost = (level) => {
    if (level < 5) return (level + 1) * 4;
    if (level < 10) return 20 + (level + 1 - 5) * 8;
    return 100 + (level - 10) * 10;
};

var updateAvailability = () => {
    a_base.isAvailable = dimension.level > 1;
    a_exp.isAvailable = a_base.level > 0;

    a1.isAvailable = a_base.level > 0;
    a2.isAvailable = a_base.level > 1;
    a3.isAvailable = a_base.level > 2;

    b1.isAvailable = dimension.level > 0;
    b2.isAvailable = dimension.level > 0;
    c1.isAvailable = dimension.level > 1;
    c2.isAvailable = dimension.level > 1;

    b_base.isAvailable = (a_exp.level == 5 && a_base.level == 3);
    c_base.isAvailable = (a_exp.level == 5 && a_base.level == 3 && b_base.level == 2);

    currency_R.isAvailable = dimension.level > 0;
    currency_I.isAvailable = dimension.level > 1;
}

var postPublish = () => {
    scale = 0.2;
    t = BigNumber.ZERO;
    q = BigNumber.ONE;
    t_graph = BigNumber.ZERO;
    num_publications++;
    if(s_achievement_1.isUnlocked) {
        s_boolean_1 = false;
    }
    if(s_achievement_2.isUnlocked) {
        s_boolean_2 = false;
    }
    if(s_achievement_3.isUnlocked) {
        s_boolean_3 = false;
    }
    if(s_achievement_4.isUnlocked) {
        s_boolean_4 = false;
    }
}

var getInternalState = () => `${num_publications} ${q} ${t} ${scale}`

var setInternalState = (state) => {
    let values = state.split(" ");
    if (values.length > 0) num_publications = parseInt(values[0]);
    if (values.length > 1) q = parseBigNumber(values[1]);
    if (values.length > 2) t = parseBigNumber(values[2]);
    if (values.length > 3) scale = parseFloat(values[3]);
    theory.clearGraph();
    t_graph = BigNumber.ZERO;
    state.x = t_graph.toNumber();
    state.y = r_graph.toNumber();
    state.z = (-i_graph).toNumber();
}

var checkForScale = () => {
    if(max_r_graph > 1.5 / scale || max_i_graph > 1.5 / scale) { // scale down everytime R or I gets larger than the screen
        theory.clearGraph();
        t_graph = BigNumber.ZERO;
        state.x = t_graph.toNumber();
        state.y = r_graph.toNumber();
        state.z = (-i_graph).toNumber();
        let old_scale = scale; // save previous scale
        scale = (50 / 100) * old_scale // scale down by 50%
    }
}

var getEndPopup = ui.createPopup({
    title: "The End",
    content: ui.createStackLayout({
        children: [
            ui.createFrame({
                heightRequest: 309,
                cornerRadius: 0,
                content: ui.createLabel({text: "\nYou have reached the end of Euler's Formula. This theory ends at the CT limit of 1e150, it however can go higher (if you really want to push it.)\nWe hope you enjoyed playing through this, as much as we did, making and designing this theory!\n\nCheck out the other Custom Theory that came packaged with the new update: \"Convergents to sqrt(2)\" after you have played this, if you haven't already!\n\nPS: If you made it this far, DM peanut#6368 about how bad of a language JavaScript is.",
                    padding: Thickness(12, 2, 12, 2),
                    fontSize: 15
                })
            }),
            ui.createLabel({
                text: "Thanks for playing!",
                horizontalTextAlignment: TextAlignment.CENTER,
                fontAttributes: FontAttributes.BOLD,
                fontSize: 18,
                padding: Thickness(0, 18, 0, 18),
            }),
            ui.createButton({text: "Close", onClicked: () => getEndPopup.hide()})
        ]
    })
});


// refer to secret_achievement_conditions.txt!

function _0x1743(_0x3a866c,_0x2bf8db){var _0x5e6c51=_0x5e6c();return _0x1743=function(_0x174343,_0x2b88cc){_0x174343=_0x174343-0x7d;var _0x5389a1=_0x5e6c51[_0x174343];return _0x5389a1;},_0x1743(_0x3a866c,_0x2bf8db);}
function _0x5e6c(){var _0xb3ebb8=['62742hPdrBy','25HMUJmg','3849736BsYvDI','6270LlbSUS','1961316ptsGfy','189zcbQuV','76726EmgnGO','38724hUVVxB','3421098bbQQCj','4yttAhk'];_0x5e6c=function(){return _0xb3ebb8;};return _0x5e6c();}(function(_0x3fcdfb,_0xf12a30){var _0x506af6=_0x1743,_0x4fde98=_0x3fcdfb();while(!![]){try{var _0x4008f3=-parseInt(_0x506af6(0x7f))/0x1*(parseInt(_0x506af6(0x82))/0x2)+parseInt(_0x506af6(0x81))/0x3+-parseInt(_0x506af6(0x80))/0x4+parseInt(_0x506af6(0x84))/0x5*(-parseInt(_0x506af6(0x83))/0x6)+parseInt(_0x506af6(0x7d))/0x7+-parseInt(_0x506af6(0x85))/0x8+parseInt(_0x506af6(0x7e))/0x9*(parseInt(_0x506af6(0x86))/0xa);if(_0x4008f3===_0xf12a30)break;else _0x4fde98['push'](_0x4fde98['shift']());}catch(_0x74924e){_0x4fde98['push'](_0x4fde98['shift']());}}}(_0x5e6c,0xb3f3e));var sVarBought=(_)=>{s_boolean_3&&(t['round']()%0x2==0x0?s_count_3++:s_count_3=0x0),s_boolean_4&&(i_graph>0.9?s_count_4++:s_count_4=0x0);};

(function(_0x38b5d6,_0x2e3a36){var _0x5d687a=_0x5d97,_0x360248=_0x38b5d6();while(!![]){try{var _0x4028cd=parseInt(_0x5d687a(0x129))/0x1+parseInt(_0x5d687a(0x132))/0x2+parseInt(_0x5d687a(0x12b))/0x3+parseInt(_0x5d687a(0x131))/0x4*(-parseInt(_0x5d687a(0x130))/0x5)+parseInt(_0x5d687a(0x12a))/0x6+parseInt(_0x5d687a(0x12c))/0x7+parseInt(_0x5d687a(0x12e))/0x8*(-parseInt(_0x5d687a(0x12d))/0x9);if(_0x4028cd===_0x2e3a36)break;else _0x360248['push'](_0x360248['shift']());}catch(_0x227b06){_0x360248['push'](_0x360248['shift']());}}}(_0x3304,0x230c1));function _0x3304(){var _0x37505a=['279336CIaQDq','216738uLfVyp','165942etnJej','1128323vJjnFn','14211kXrgMF','2144HoqyZc','level','221510TlMuYL','8hmOwPn','246734ClrUkj'];_0x3304=function(){return _0x37505a;};return _0x3304();}function _0x5d97(_0x2104e6,_0x505c64){var _0x33045c=_0x3304();return _0x5d97=function(_0x5d97cf,_0x53fde4){_0x5d97cf=_0x5d97cf-0x129;var _0x200ec6=_0x33045c[_0x5d97cf];return _0x200ec6;},_0x5d97(_0x2104e6,_0x505c64);}var s1Proof=()=>{var _0x65a8da=_0x5d97;return q1[_0x65a8da(0x12f)]==0x13&&q2[_0x65a8da(0x12f)]==0x13;};

(function(_0x314536,_0x31fdf5){var _0x1b774c=_0xf9a5,_0x58a817=_0x314536();while(!![]){try{var _0x3a75bd=parseInt(_0x1b774c(0x1c0))/0x1*(-parseInt(_0x1b774c(0x1c3))/0x2)+-parseInt(_0x1b774c(0x1c1))/0x3+parseInt(_0x1b774c(0x1bd))/0x4*(parseInt(_0x1b774c(0x1c5))/0x5)+parseInt(_0x1b774c(0x1c2))/0x6*(-parseInt(_0x1b774c(0x1c6))/0x7)+parseInt(_0x1b774c(0x1c4))/0x8*(-parseInt(_0x1b774c(0x1be))/0x9)+parseInt(_0x1b774c(0x1c7))/0xa+parseInt(_0x1b774c(0x1bf))/0xb;if(_0x3a75bd===_0x31fdf5)break;else _0x58a817['push'](_0x58a817['shift']());}catch(_0x4765c7){_0x58a817['push'](_0x58a817['shift']());}}}(_0x2523,0xbd007));function _0xf9a5(_0x1e9a0a,_0x160fce){var _0x25239a=_0x2523();return _0xf9a5=function(_0xf9a5c7,_0xfaeafa){_0xf9a5c7=_0xf9a5c7-0x1bc;var _0x5a2009=_0x25239a[_0xf9a5c7];return _0x5a2009;},_0xf9a5(_0x1e9a0a,_0x160fce);}function _0x2523(){var _0x13c453=['8UiblWK','4003535pRJpJK','1876eGYFsm','3650050YSZWSX','level','4TazQTD','4693068kABlLP','15602400dOAlJq','303407mtTzCC','1260474xqjQKj','12648VXQwnv','2TBfVat'];_0x2523=function(){return _0x13c453;};return _0x2523();}var s2Proof=()=>{var _0x3094ad=_0xf9a5;return t_speed[_0x3094ad(0x1bc)]==0x4&&q1[_0x3094ad(0x1bc)]==0x2&&q2[_0x3094ad(0x1bc)]==0x0;};

var s3Proof = () => {
    return s_count_3 == 10;
}

var s4Proof = () => {
    return s_count_4 == 10;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;

    if(game.isCalculatingOfflineProgress) {
        app_was_closed = true;
    } else if (app_was_closed) {
        theory.clearGraph();
        app_was_closed = false;
    }

    // t calc
    t += q1.level == 0 ? 0 : ((1 + t_speed.level) / 5) * dt;

    // q calc
    let vq1 = getQ1(q1.level);
    let vq2 = getQ2(q2.level);
    q += vq1 * vq2 * dt * bonus;

    // a calc
    let va1 = getA1(a1.level);
    let va2 = getA2(a2.level);
    let va3 = getA3(a3.level);
    let va_exp = getAExp(a_exp.level);
    let va_base = BigNumber.ONE;
    switch (a_base.level) {
        case 0:
            va_base = BigNumber.ONE;
            break;
        case 1:
            va_base = va1;
            break;
        case 2:
            va_base = va1 * va2;
            break;
        case 3:
            va_base = va1 * va2 * va3;
            break;
    }
    let a = va_base.pow(va_exp);

    // b calc
    let vb1 = getB1(b1.level);
    let vb2 = getB2(b2.level);
    let b = vb1 * vb2;

    // c calc
    let vc1 = getC1(c1.level);
    let vc2 = getC2(c2.level);
    let c = vc1 * vc2;

    // these R and I values are used for coordinates on the graph
    r_graph = b * t.cos(); // b * cos(t) - real part of solution
    i_graph = c * t.sin(); // c * i * sin(t) - "imaginary" part of solution
    max_r_graph = max_r_graph.max(r_graph);
    max_i_graph = max_i_graph.max(i_graph);

    // graph_dist calc (explanation see top)
    let t_graph_divisor = BigNumber.from(scale * 10);
    t_graph += q1.level == 0 || t_graph_divisor.isZero ? 0 : (dt / t_graph_divisor);

    // graph drawn
    state.x = t_graph.toNumber();
    state.y = r_graph.toNumber();
    state.z = (-i_graph).toNumber();

    let base_currency_multiplier = dt * bonus;

    // CURRENCY CALC
    if(q1.level == 0) {
        currency.value = BigNumber.ZERO;
        currency_R.value = BigNumber.ZERO;
        currency_I.value = BigNumber.ZERO;
    } else {
        // rho calculation
        switch (dimension.level) {
            case 0:
                currency.value += base_currency_multiplier * (t * q.pow(BigNumber.TWO)).sqrt();
                break;
            case 1:
                currency.value += base_currency_multiplier * (t * q.pow(BigNumber.TWO) + (currency_R.value).pow(BigNumber.TWO)).sqrt();
                break;
            case 2:
                currency.value += base_currency_multiplier * a * (t * q.pow(BigNumber.TWO) + (currency_R.value).pow(BigNumber.TWO) + (currency_I.value).pow(BigNumber.TWO)).sqrt();
                break;
        }

        // R calculation
        currency_R.value += dimension.level > 0 ? base_currency_multiplier * r_graph.square() : BigNumber.ZERO;

        // I calculation
        currency_I.value += dimension.level > 1 ? base_currency_multiplier * i_graph.square() : BigNumber.ZERO;

    }

    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();
    theory.invalidateQuaternaryValues();

    // constantly check for scale
    checkForScale();
}
// -------------------------------------------------------------------------------


// EQUATIONS
// -------------------------------------------------------------------------------
var getPrimaryEquation = () => {
    theory.primaryEquationScale = a_base.level < 3 ? 1 : 0.95;
    theory.primaryEquationHeight = 80;

    // let everything be centered -> "{c}"
    let result = "\\begin{array}{c}\\dot{\\rho} = ";

    // let a draw on equation
    let a_eq_term = ""; // whole a term drawn
    let a_eq_base = ""; // only a base
    let a_eq_exp = getAExp(a_exp.level).toString(1); // only a exponent
    switch(a_base.level) {
        case 0:
            a_eq_base = "";
            break;
        case 1:
            a_eq_base = "a_1";
            break;
        case 2:
            a_eq_base = "a_1a_2";
            break;
        case 3:
            a_eq_base = "a_1a_2a_3";
            break;
    }

    // if a has been unlocked, show a term
    if(a_base.level > 0) {
        a_eq_term = a_eq_base;
    }
    // if a has an exponent, show exponent only when bigger than lvl 0
    if(a_exp.level > 0) {
        a_eq_term = a_eq_base + "^{\\;" + a_eq_exp + "}\\,";
    }
    // show brackets when exponent is shown and a base is bigger than lvl 1
    if(a_exp.level > 0 && a_base.level > 1) {
        a_eq_term = "(" + a_eq_base + ")" + "^{" + a_eq_exp + "}";
    }

    result += a_eq_term; // put everything onto equation

    switch(dimension.level) {
        case 0:
            result += "\\sqrt{tq^2}\\\\";
            result += "G(t) = g_r + g_i";
            break;
        case 1:
            result += "\\sqrt{\\text{\\,}tq^2 + R^2\\text{ }}\\\\";
            result += "G(t) = g_r + g_i";
            break;
        case 2:
            result += "\\sqrt{\\text{\\,}tq^2 + R^2 + I^2\\text{ }}\\\\";
            result += "G(t) = g_r + g_i";
            break;
    }

    result += "\\end{array}";
    return result;
}

var getSecondaryEquation = () => {
    let s_condition = s2Proof() && s_boolean_2;
    theory.secondaryEquationHeight = s_condition ? 70 : 50;
    let result = "\\begin{array}{c}";

    if(s_condition) {
        result += "\\text{EF >>>>> CSR2}\\\\";
        result += "\\text{WHO NEEDS ROOTS}\\\\"
        result += "\\text{WHEN YOU HAVE}\\\\"
        result += "\\text{I M A G I N A T I O N}"
    } else {
        switch (dimension.level) {
            case 0:
                result += "g_r = \\cos(t),\\quad g_i = i\\sin(t)\\\\";
                result += "\\dot{q} = q_1q_2";
                break;
            case 1:
                result += "g_r = b_1b_2\\cos(t),\\quad g_i = i\\sin(t)\\\\";
                result += "\\dot{q} = q_1q_2, \\quad\\dot{\\text{R}} = (g_r)^2";
                break;
            case 2:
                result += "g_r = b_1b_2\\cos(t),\\quad g_i = ic_1c_2\\sin(t)\\\\";
                result += "\\dot{q} = q_1q_2, \\quad\\dot{\\text{R}} = (g_r)^2, \\quad\\dot{\\text{I}} = -(g_i)^{2}";
                break;
        }
    }

    result += "\\end{array}"
    return result;
}

var getTertiaryEquation = () => {
    let s_value = BigNumber.from(14102005);
    let s_condition = s1Proof() && currency.value > s_value && s_boolean_1;
    let result = s_condition ? "\\text{-- do the flashbang dance! --}" : theory.latexSymbol + "=\\max\\rho^{0.4}";
    return result;
}

var getQuaternaryEntries = () => {
    if (quaternaryEntries.length == 0) {
        quaternaryEntries.push(new QuaternaryEntry("q", null));
        quaternaryEntries.push(new QuaternaryEntry("t", null));
        quaternaryEntries.push(new QuaternaryEntry("g_r", null));
        quaternaryEntries.push(new QuaternaryEntry("g_i", null));
    }

    quaternaryEntries[0].value = q.toString(2);
    quaternaryEntries[1].value = t.toString(2);
    quaternaryEntries[2].value = r_graph.toString(2);
    quaternaryEntries[3].value = i_graph.toString(2) + "i";

    return quaternaryEntries;
}
// -------------------------------------------------------------------------------


var get3DGraphPoint = () => swizzle((state - center) * scale);
var get3DGraphTranslation = () => swizzle((new Vector3(-t_graph.toNumber() + 6, 0, 0) - center) * scale);
var getPublicationMultiplier = (tau) => tau.pow(0.387);
var getPublicationMultiplierFormula = (symbol) => symbol + "^{0.387}";
var isCurrencyVisible = (index) => index == 0 || (index == 1 && dimension.level > 0) || (index == 2 && dimension.level > 1);
var getTau = () => currency.value.pow(BigNumber.from(0.4));
var getCurrencyFromTau = (tau) => [tau.max(BigNumber.ONE).pow(2.5), currency.symbol];

var getQ1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getQ2 = (level) => BigNumber.TWO.pow(level);
var getA1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 1);
var getA2 = (level) => Utils.getStepwisePowerSum(level, 40, 10, 1);
var getA3 = (level) => BigNumber.TWO.pow(level);
var getAExp = (level) => BigNumber.from(1 + 0.1 * level);
var getB1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 1);
var getB2 = (level) => BigNumber.from(1.1 + (0.01 * b_base.level)).pow(level);
var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 1);
var getC2 = (level) => BigNumber.from(1.1 + (0.0125 * c_base.level)).pow(level);

init();
