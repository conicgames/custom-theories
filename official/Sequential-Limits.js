﻿//uses code from davidcondrey on stack exchange, xelaroc (alexcord#6768) and Gilles-Philippe Paillé(#0778). 

import { ExponentialCost, FirstFreeCost, LinearCost, CustomCost } from "./api/Costs"; //make sure to use
import { Localization } from "./api/Localization";
import { parseBigNumber, BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "SequentialLimits"; //must be unique, make sure to change it 
var name = "Sequential Limits"; //display name
var description = "You're the first student of the now-retired professor, and now that they've retired, you're given the mantle of chief researcher. Eager to dive into fields where your old professor dove off, you start looking into the concept explored in the ninth lemma - sequential limits - to further your career.\n\nThis theory explores the concept of approximations using a rearrangement of Stirling's Formula to approximate Euler's number.\nThe formula, named after James Stirling and first stated by Abraham De Moivre, states that ln(n!) can be approximated by the infinite sum ln(1) + ln(2) .... + ln(n).\nBe careful - the closer your approximation of Euler's number is, the less your numerator grows!\nA close balancing game, fun for the whole family (or at least, the ones who play Exponential Idle). \n\nSpecial thanks to:\n- Gilles-Philippe, for development of the custom theory SDK, implementing features I requested, providing countless script examples, and help with my numerous questions and balancing.\n- Xelaroc/AlexCord, for answering my neverending questions, debugging and helping me understand how to balance a theory, and going above and beyond to teach me how custom theories work.\n- The Exponential Idle beta testing team\n- The Exponential Idle translation team, who's work I added to, and without which this game wouldn't have the reach it does \n\nEnjoy!"; //theory description. does not support LaTeX
var authors = "ellipsis"; //display author in the "author" field
var version = 3; //version id, make sure to change it on update

var currency = theory.createCurrency(), currency2 = theory.createCurrency(), currency3 = theory.createCurrency(); //create three currency variables and list them as currencies
var a1, a2, b1, b2; //set a1, a2, b1, b2 levels
var numPublishes=0; //number of publishes


var gamma0, gamma1, gamma2, gamma3; //create 4 variables that i'll use for milestones
var rho1dot = BigNumber.ZERO, rho2dot = BigNumber.ZERO, rho3dot = BigNumber.ZERO; //used as drho's
var inverseE_Gamma; //used for the approximation of e
var E_Gamma; //used for the display of 
//var t = BigNumber.ONE; //time in seconds

currency3.value = 1; //set rho3 to 1 to avoid a div by 0 error lol
theory.primaryEquationHeight = 70; //set height of primary equation
theory.secondaryEquationHeight = 35; //set height of second equation
theory.secondaryEquationScale = 1.25; //makes the secondary eq look 25% bigger

var tapCount = 0;
var t = 0;


var init = () => {

    // Regular Upgrades    
    // a1
    {
        let getDesc = (level) => "a_1=" + geta1(level).toString(0); //returns the value seen in the description as a1 = <level>
        let getInfo = (level) => "a_1=" + geta1(level).toString(0); //returns the value seen in the info box as a1 = <level>
        a1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(1, 0.369*Math.log2(10)))); //0'th upgrade in the list - first cost is 0, other costs are 10 * 2^(3*level), costs currency1
        a1.getDescription = (amount) => Utils.getMath(getDesc(a1.level)); //for the value of a1 in the description
        a1.getInfo = (amount) => Utils.getMathTo(getInfo(a1.level), getInfo(a1.level + amount)); //for the values of a1 when you hold I(nfo) and you have [current]->[next]
    }
    // a2
    {
        let getDesc = (level) => "a_2=2^{" + level + "}"; //returns the value seen in the description as a2 = 2^<level>.
        let getInfo = (level) => "a_2=" + geta2(level).toString(0); //returns the value seen in the info box as a2 = <level>
        a2 = theory.createUpgrade(1, currency, new ExponentialCost(175, Math.log2(10))); //1st upgrade in the list - costs are 5*10^level, costs currency1
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));  //for the value of a2 in the description
        a2.getInfo = (amount) => Utils.getMathTo(getInfo(a2.level), getInfo(a2.level + amount)); //for the values of a2 when you hold I(nfo) and you have [current]->[next]
    }

    // b1
    {
        let getDesc = (level) => "b_1=" + getb1(level).toString(0); //returns the value seen in the description as b1 = <level>
        let getInfo = (level) => "b_1=" + getb1(level).toString(0); //returns the value seen in the info box as b1 = <level>
        b1 = theory.createUpgrade(2, currency, new ExponentialCost(500, 0.649*Math.log2(10))); //2nd upgrade in the list - costs are 100 + 10^level, costs currency1
        b1.getDescription = (amount) => Utils.getMath(getDesc(b1.level)); //for the value of b1 in the description
        b1.getInfo = (amount) => Utils.getMathTo(getInfo(b1.level), getInfo(b1.level + amount)); //for the values of a1 when you hold I(nfo) and you have [current]->[next]
    }
    
    // b2
    {
        let getDesc = (level) => "b_2=2^{" + level + "}"; //returns the value seen in the description as b2 = 2^<level>
        let getInfo = (level) => "b_2=" + getb2(level).toString(0); //returns the value seen in the info box as b2 = <level>
        b2 = theory.createUpgrade(3, currency, new ExponentialCost(1000, 0.926*Math.log2(10))); //3rd upgrade in the list - costs are 3*10^(3*level), costs currency1
        b2.getDescription = (_) => Utils.getMath(getDesc(b2.level));  //for the value of a2 in the description
        b2.getInfo = (amount) => Utils.getMathTo(getInfo(b2.level), getInfo(b2.level + amount)); //for the values of a1 when you hold I(nfo) and you have [current]->[next]
    }

    
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10 ); //unlock publications at 1e10 currency
    theory.createBuyAllUpgrade(1, currency, 1e15); //unlock buy all at 1e30 currency
    theory.createAutoBuyerUpgrade(2, currency, 1e20); //unlock autobuyer at 1e50 currency


    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(2.5, 2.5)); //c = 25*x + 25, i.e rewards a milestone every 25 log10(tau)

    //milestone 1
    {
        gamma0 = theory.createMilestoneUpgrade(0, 3); //create an upgrade of ID 0 and max level 3 [this is gamma0]
        gamma0.description = Localization.getUpgradeIncCustomExpDesc("\\rho_2", "0.02"); //set desc as localisation of "increases rho_2 exponent by 0.01"
        gamma0.info = Localization.getUpgradeIncCustomExpInfo("\\rho_2", "0.02"); //basically the same but for info button
        gamma0.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation(); //if bought/refunded, force a refresh of the equation
    }

    //milestone 2
    //TODO change it to a localisation of decreases lol
    {
        gamma1 = theory.createMilestoneUpgrade(1, 5); //create an upgrade of ID 1 and max level 5 [this is gamma1]
        gamma1.description = Localization.getUpgradeDecCustomDesc("a_3","0.008"); //set desc as localisation of "decreases a3 by 0.008"
        gamma1.info = Localization.getUpgradeDecCustomInfo("a_3","0.008"); //basically the same but for info button
        gamma1.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation(); //if bought/refunded, force a refresh of the equation
    }
    
    //milestone 3
    {
        gamma2 = theory.createMilestoneUpgrade(2, 2); //create an upgrade of ID 2 and max level 4 [this is gamma2]
        gamma2.description = Localization.getUpgradeIncCustomExpDesc("b_1", "0.02"); //set desc as localisation of "increases b1 exponent by 0.01"
        gamma2.info = Localization.getUpgradeIncCustomExpInfo("b_1", "0.02"); //basically the same but for info button
        gamma2.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation(); //if bought/refunded, force a refresh of the equation
    }

    //milestone 4
    {
        gamma3 = theory.createMilestoneUpgrade(3, 2); //create an upgrade of ID 3 and max level 4 [this is gamma3]
        gamma3.description = Localization.getUpgradeIncCustomExpDesc("b_2", "0.02"); //set desc as localisation of "increases b2 exponent by 0.01""
        gamma3.info = Localization.getUpgradeIncCustomExpInfo("b_2", "0.02"); //basically the same but for info button
        gamma3.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation(); //if bought/refunded, force a refresh of the equation
    }        

    //utilities
    var bsf={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'\=",e:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=bsf._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},d:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=bsf._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
    
    // Achievements
    //TODO ADD ACHIEVEMENTS [10 mainline ~4 secret]
    var AchievementCat0 = theory.createAchievementCategory(0, "Miscellaneous");
    var AchievementCat1 = theory.createAchievementCategory(1, "Publications");
    var AchievementCat2 = theory.createAchievementCategory(2, "Approximation");
    var AchievementCat3  = theory.createAchievementCategory(3, "Secret Achievements");
    achievement6 = theory.createAchievement(5, AchievementCat0, "Purchase Optimisation", "Outsource the actual buying of variables to your students", () => theory.isAutoBuyerAvailable); //award an achievement for unlocking the autobuyer
    

    achievement1 = theory.createAchievement(0, AchievementCat1, "Amateur Author", "Publish once.", () => 1 == numPublishes); //award an achievement with name and description if there has been 1 publish
    achievement2 = theory.createAchievement(1, AchievementCat1, "Regular Reporter", "Publish 3 times.", () => 3 == numPublishes); //same for 5 publishes
    achievement3 = theory.createAchievement(2, AchievementCat1, "Studied Scribbler", "Publish 5 times.", () => 5 == numPublishes); //same for 10 publishes
    achievement4 = theory.createAchievement(3, AchievementCat1, "Exemplary Essayist", "Publish 10 times.", () => 10 == numPublishes); //same for 25 publishes
    achievement5 = theory.createAchievement(4, AchievementCat1, "Publication Professional", "Publish 20 times.", () => 20 == numPublishes); //same for 50 publishes
    
    
    achievement7 = theory.createAchievement(6, AchievementCat2, "Close Enough", "Get your approximation of e to 10^-1 off true", () => inverseE_Gamma >= BigNumber.From("1e0"));
    achievement8 = theory.createAchievement(7, AchievementCat2, "Nitpicking Exercise", "Get your approximation of e to 10^-5 off true", () => inverseE_Gamma >= BigNumber.From("1e5"));
    achievement9 = theory.createAchievement(8, AchievementCat2, "Splitting Hairs", "Get your approximation of e to 10^-10 off true", () => inverseE_Gamma >= BigNumber.From("1e10"));
    achievement10 = theory.createAchievement(9, AchievementCat2, "Microscopic", "Get your approximation of e to 10^-15 off true", () => inverseE_Gamma >= BigNumber.From("1e15"));
    achievement12 = theory.createAchievement(10, AchievementCat2, "Subatomic", "Get your approximation of e to 10^-25 off true", () => inverseE_Gamma >= BigNumber.From("1e25"));
    achievement13 = theory.createAchievement(11, AchievementCat2, "Planck Pettiness", "Get your approximation of e to 10^-35 off true", () => inverseE_Gamma >= BigNumber.From("1e35"));
    achievement11 = theory.createAchievement(12, AchievementCat2, "Are We There Yet?", "Get your approximation of e to 10^-50 off true", () => inverseE_Gamma >= BigNumber.From("1e50"));
    achievement14 = theory.createAchievement(13, AchievementCat2, "Precision Player", "Get your approximation of e to 10^-100 off true", () => inverseE_Gamma >= BigNumber.From("1e100"));
    achievement15 = theory.createAchievement(14, AchievementCat2, "Running Out Of Room", "Get your approximation of e to 10^-250 off true", () => inverseE_Gamma >= BigNumber.From("1e250"));
    achievement16 = theory.createAchievement(15, AchievementCat2, "You Can Stop Anytime", "Get your approximation of e to 10^-500 off true", () => inverseE_Gamma >= BigNumber.From("1e500"));
    
   // achievement21 = theory.createSecretAchievement(20, AchievementCat3,"What's 9 + 10?", "21", "October 9th, 2021", () => a1.level == 9 && a2.level == 10 );
    achievement22 = theory.createSecretAchievement(21, AchievementCat3, bsf.d("UGF0dGVybiBGYW5hdGlj"), bsf.d("SGF2ZSBldmVyeSB2YXJpYWJsZSBsZXZlbCB0aGUgc2FtZQ")+ ".", bsf.d("UGFsaW5kcm9taWM"), () => a1.level == a2.level && a1.level == b1.level && a1.level == b2.level && a1.level >= 3);
    achievement23 = theory.createSecretAchievement(22, AchievementCat3, bsf.d("bDMzdDVwMzRr"), bsf.d("MTMzNw")+ ".", bsf.d("RWxpdGU"), () => a1.level == 1 && a2.level == 3 && b1.level == 3 && b2.level == 7 );
    // achievement24 = theory.createSecretAchievement(23, AchievementCat3, "NoAB", "Don't autobuy anything for a whole publication",'Hint', () => abFlag == true && theory.isAutoBuyerAvailable);
    achievement25 = theory.createSecretAchievement(24, AchievementCat3, bsf.d("T24gVmFjYXRpb24"),bsf.d("RG9uJ3QgYnV5IGFueXRoaW5nIGZvciBhbiBob3VyIGFmdGVyIGEgcHVibGljYXRpb24") + ".",bsf.d("Rm9yZ290IHNvbWV0aGluZz8"), () => a1.level == 0 && t >= 3600 && numPublishes > 0);
    achievement26 = theory.createSecretAchievement(25,AchievementCat3, bsf.d("RnV0aWxpdHk"),bsf.d("VGFwIHRoZSBlcXVhdGlvbiAxMDAwIHRpbWVz")+ ".",bsf.d("RmF0aWd1ZWQ"),() => tapCount >= 1000);

    //// Story chapters
        chapter1 = theory.createStoryChapter(0, "A New Beginning", bsf.d("WW91IHJldHVybiBmcm9tIHlvdXIgb2xkIHByb2Zlc3NvcidzIHJldGlyZW1lbnQgcGFydHksIHRoZSBtYW50bGUgcGFzc2VkIG9udG8geW91LCB0aGUgZmlyc3Qgc3R1ZGVudCwgdG8gaGVhZCB0aGUgZGVwYXJ0bWVudCBvZiBzdHVkZW50cyBhY2NydWVkIG92ZXIgdGhlIHllYXJzLgpFeGNpdGVkIHRvIGZpbmFsbHkgYmUgbGlzdGVkIGFzIHNvbWV0aGluZyBvdGhlciB0aGFuICdldC4gYWwnIG9uIGEgcGFwZXIsIHlvdSBjb250aW51ZWQgd2l0aCB5b3VyIGV4aXN0aW5nIHJlc2VhcmNoLCBidXQgYXMgcHJvZ3Jlc3Mgc2xvd2VkLCB5b3UgZmVsdCBsZXNzIGFuZCBsZXNzIHNhdGlzZmllZC4KVGhlIGRheXMgdHVybiBpbnRvIHdlZWtzLCB3aGljaCBibHVyIHRvZ2V0aGVyIGFzIG1vcmUgYW5kIG1vcmUgcHVibGljYXRpb25zIGFyZSB3cml0dGVuLgpFdmVudHVhbGx5LCBhIHN0dWRlbnQgY29tZXMgdG8geW91IHdpdGggYSBkdXN0eSB0b21lLCBmZWF0dXJpbmcgYSBhcy1vZi15ZXQgdW5leHBsb3JlZCB0aGVvcmVtLgpGZWVsaW5nIGEgc3Ryb2tlIG9mIGluc3BpcmlhdGlvbiwgeW91IGFzc2VtYmxlIGEgdGVhbSBvZiBzdHVkZW50cyBhbmQgdGhyb3cgeW91cnNlbGYgaW50byB0aGUgcmVzZWFyY2g"), () => a1.level > 0); //unlock story chapter when a1 is purchased
        chapter2 = theory.createStoryChapter(1,"Taking Risks" ,bsf.d("WW91IG5vdGljZSBhIGZldyB1bmFzc3VtaW5nIHZhcmlhYmxlcyBhdCB0aGUgYm90dG9tIG9mIHRoZSBlcXVhdGlvbi4KQSBzdHVkZW50IHdhcm5zIHlvdSBhZ2FpbnN0IGNoYW5naW5nIHRoZW0sIGNpdGluZyB0aGUgcmlzayBvZiBkZWNyZWFzaW5nIHRoZSBpbmNvbWUgZXhpc3RpbmcgdmFsdWVzLCBidXQgeW91IGZvcmdlIGFoZWFkLg"), () => b1.level >0 || b2.level > 0); //unlock story chapter if b1 or b2 have been puchased
        chapter3 = theory.createStoryChapter(2, "International Recognition",bsf.d("WW91IHB1Ymxpc2ggeW91ciBmaXJzdCBwYXBlciwgd2l0aCB5b3VyIG5hbWUgZnJvbnQgYW5kIGNlbnRlci4KQ29sbGVhZ3VlcyBjb25ncmF0dWxhdGUgeW91LCBidXQgeW91IGZlZWwgdGhlcmUgaXMgc29tZXRoaW5nIG1pc3NpbmcsIGZ1cnRoZXIgZXhwbG9yYXRpb24gdG8gYmUgaGFkLgpZb3UgZGVjaWRlIHRvIGZvcmdlIGFoZWFkLg"), () => numPublishes > 0); //unlock story chapter if a publication has been done
        chapter4 = theory.createStoryChapter(3, "Light Modification", bsf.d("V2l0aCB5b3VyIHByb2dyZXNzIHN0YXJ0aW5nIHRvIHNsb3csIHlvdSBzY291ciB0aGUgb3JpZ2luYWwgZXF1YXRpb24gdGV4dHMgdG8gZmluZCBhIHJlbWVkeS4KSXQgdHVybnMgb3V0IGFsbCBhbG9uZyB0aGVyZSdzIGJlZW4gc29tZSBtb2RpZmllcnMgeW91IGNhbiBhZGQsIGJ1dCBhdCBldmVyIGluY3JlYXNpbmcgY29zdHMuCllvdSBkZWNpZGUgdG8gYnV5IG9uZSwgaG9waW5nIGl0IGFsbGV2aWF0ZXMgeW91ciBpc3N1ZXMuLi4"), () => gamma0.level == 1 || gamma1.level == 1 || gamma2.level == 1 || gamma3.level == 1);//unlock story chapter if a milestone is purchased
        chapter5 = theory.createStoryChapter(4, "Making Progress", bsf.d("WW91IHJlYWNoIDFlMTAwIA") + "ρ₁" + bsf.d("₁LCBhIG1ham9yIG1pbGVzdG9uZSBpbiB5b3VyIHJlc2VhcmNoLgpDb2xsZWFndWVzIGNvbWUgdG8gY29uZ3JhdHVsYXRlIHlvdSBvbiBwdXNoaW5nIHlvdXIgcmVzZWFyY2ggc28gZmFyLCBidXQgeW91IHNocnVnIHRoZW0gb2ZmIC0geW91IGZlZWwgYXMgaWYgdGhlcmUncyBtb3JlIHlvdSBjb3VsZCBkby4KWW91IGhlYWQgYmFjayB0byB5b3VyIG9mZmljZSBhbmQgZ2V0IHRvIHdvcmsgb25jZSBtb3Jl"), () => currency.value >= BigNumber.From("1e100"));//unlock story chapter upon reaching 1e100 rho1
        chapter6 = theory.createStoryChapter(5, "The End.... Or Is It?",bsf.d("WW91IGZpbmFsbHkgcHVyY2hhc2VkIGV2ZXJ5IG1vZGlmaWVyLCB0byBjbG9zZSBvdXQgeW91ciByZXNlYXJjaCBpbnRvIHRoaXMgZmllbGQuCllvdXIgc3R1ZGVudHMgYXNzaWduZWQgdG8gdGhpcyBwcm9qZWN0IGNlbGVicmF0ZSwgYW50aWNpcGF0aW5nIGNsb3Npbmcgb3V0IHRoaXMgbGluZSBvZiByZXNlYXJjaCwgYW5kIHlvdXIgbmFtZSBpcyBwb3N0ZWQgaW4gam91cm5hbHMgd29ybGR3aWRlLgoKWW91IGRlY2lkZSB0byBnbyBvdmVyIHlvdXIgbnVtYmVycyBvbmNlIG1vcmUsIGp1c3QgdG8gbWFrZSBzdXJlLi4u"), () => gamma0.level == 3 && gamma1.level == 5 && gamma2.level == 2 && gamma3.level == 2); //unlock a story when all milestone levels have been purchased    
        chapter6 = theory.createStoryChapter(6, "Mathaholic",bsf.d("MWU1MDAuCgpBIG1vbnVtZW50YWxseSBsYXJnZSBudW1iZXIsIGJ1dCBidXQgYmFyZWx5IGEgYmxpcCB0byB5b3Ugbm93LgpQZW9wbGUgYXJlIHN0YXJ0aW5nIHRvIHRha2Ugbm90aWNlIGFzIHlvdSBwdXNoIG1hdGhlbWF0aWNzIHRvIHBvaW50cyB0aG91Z2h0IHVuYWNoaWV2ZWFibGUgaW4gdGhpcyBmaWVsZC4KVGhlcmUncyBhIHdhaXRpbmcgbGlzdCB0byBzdHVkeSB1bmRlciB5b3Ugbm93LgpZb3VyIGZyaWVuZHMgYW5kIGZhbWlseSBhcmUgZXhwcmVzc2luZyBjb25jZXJuLCB3b3JyaWVkIHlvdSdyZSBpbiB0b28gZGVlcC4KSXQgZG9lc24ndCBtYXR0ZXIuCkFub3RoZXIgYnJlYWt0aHJvdWdoIGlzIGNsb3NlLgpZb3UgY2FuIGZlZWwgaXQuCgpSaWdodD8"), () => currency.value >= BigNumber.From("1e500"));
        chapter7 = theory.createStoryChapter(7, "The End.", bsf.d("MWUxMDAwLgoKQSBudW1iZXIgc28gYmlnIGl0J2QgYmUgaW1wb3NzaWJsZSB0byBjb21wcmVoZW5kLgpZb3UgZGlkIGl0LiBUaGV5IHNhaWQgeW91IGNvdWxkbid0LgpZZWFycyBhZnRlciB5b3UgZmlyc3Qgc3RhcnRlZCwgeW91IHJlYWNoIGFuIGluY3JlZGlibGUgZW5kIHRvIHlvdXIgcmVzZWFyY2guCllvdSdyZSBmZWF0dXJlZCBvbiBUSU1FLCBvbiBkYXl0aW1lIHRlbGV2aXNpb24sIGluIHdvcmxkd2lkZSBuZXdzcGFwZXJzLiBZb3VyIHBhcGVycyBhcmUgZnJhbWVkLCB5b3VyIHN0dWRlbnRzIGFsbCBwcm9mZXNzb3JzIGluIHRoZWlyIG93biByaWdodHMgbm93LgpZb3UgcGFzcyBvbiB0aGUgbWFudGxlIHRvIGEgeW91bmdlciBzdHVkZW50IG9mIHlvdXJzIHRvIHJldGlyZSBsaWtlIHlvdXIgb2xkIHByb2Zlc3NvciwgYmFjayBhbGwgdGhvc2UgeWVhcnMgYWdvLgoKVEhFIEVORC4KVGhhbmtzIGZvciBwbGF5aW5nISAtIGVsbGlwc2lz"), () => currency.value >= BigNumber.From("1e1000"));
}


//function that runs every tick, i.e tick math
var tick = (elapsedTime, multiplier) => {

    let dt = BigNumber.from(elapsedTime * multiplier); //find tick time
    
    rho3dot = (getb1(b1.level).pow(BigNumber.ONE + gamma2.level*BigNumber.From(0.02)) * getb2(b2.level).pow(BigNumber.ONE + gamma3.level*BigNumber.From(0.02))); //rho3dot is equal to b1.value * b2.value accounting for exponenents
    currency3.value += rho3dot*dt; //increase currency3.value by rho3dot*dt
    
    let two_pi_rho = BigNumber.TWO * BigNumber.PI * currency3.value; //precalculation of values for tick function
    if (currency3.value < 1000){
        inverseE_Gamma = BigNumber.ONE/( BigNumber.E - (BigNumber.E / (two_pi_rho.pow(BigNumber.PI / two_pi_rho ))) ); //approximate E using Stirling's method rearranged
    }
    else {
        let r = BigNumber.PI.log() + two_pi_rho.log().log() - two_pi_rho.log(); 
        inverseE_Gamma = ((r.exp() - r).exp() - BigNumber.from(0.5))/BigNumber.E;    }//xelaroc's approximation of the approximation - fixed to work at high values
   
    //rho2dot equation that supports higher values without crashing lol
    let a1v = geta1(a1.level), a2v = geta2(a2.level);
//    rho2dot =(geta1(a1.level) * geta2(a2.level) * (BigNumber.TWO-gamma1.level*0.004).pow( - currency3.value.log() )); //calculate rho2dot, accounting for milestones
    rho2dot = a1v > 0 && a2v > 0 ? BigNumber.E.pow(a1v.log() + a2v.log() - (BigNumber.TWO-gamma1.level*0.008).log() * (currency3.value).log() ) : BigNumber.ZERO;
    currency2.value += dt * rho2dot; //increase rho2 by rho2dot by dt
    rho1dot = (currency2.value.pow(BigNumber.ONE+gamma0.level*0.02).sqrt()*(inverseE_Gamma)); //rho1dot is equal to the root of rho2^milestone, over the difference between E and stirling's approximation
    currency.value += dt * theory.publicationMultiplier * rho1dot; //increase rho1 by rho1dot by dt, accounting for pub bonus
    
    t += elapsedTime;
    theory.invalidateTertiaryEquation();
    
}


//display rho1dot equation
var getPrimaryEquation = () => { //text for the primary equation

    let result = "\\dot{\\rho}_1 = \\frac{\\sqrt{\\rho_2";
    switch (gamma0.level){ //switch statement based on milestone 1 to add an exponent to rho2
        //should probably use something else but i tried using just a (gamma0.level*0.1).toString(1) and it threw a hissy fit
        case 1:
            result += "^{1.02}";
            break;
        case 2:
            result += "^{1.04}";
            break;
        case 3:
            result += "^{1.06}";
            break;    
    }
    result +="}}{e-\\gamma}";  //close off the square root and add the denominator

    //show the approximated value equation
    result += "\\qquad \\gamma = \\frac{\\rho_3}{\\sqrt[^{\\rho_3}]{\\rho_3 !}}";
    result += "\\qquad" + theory.latexSymbol + "= \\max{\\rho_1}^{0.1}"; 
    return result; //return the sum of text
}   


//display rho2dot, rho3dot and a_3 equation
var getSecondaryEquation = () => { 
    let result = "";
    profilers.exec("renderSecondary", () =>  {
    //render rho2dot equation
    result += "\\dot{\\rho}_2 = a_1 a_2 \\cdot a_3 ^{ - \\ln\\rho_3}\\qquad "; //static, doesn't need to change. plain latex


    result += "{\\dot{\\rho}}_3 = b_1"; // first part of eq, i.e rho3dot = b1
    switch (gamma2.level){ //switch statemement based on the third milestone (b1 exponent) to add exponents if the milestone level is 1 - 4
        case 1:
            result+= "^{\\!1.02}\\!";
            break;
        case 2:
            result+= "^{\\!1.04}\\!";
            break;
    }
    result += "b_2"; //add b2 
    switch (gamma3.level){ //switch statemement based on the fourth milestone (b2 exponent) to add exponents if the milestone level is 1 - 4
        case 1:
            result+= "^{\\!1.02}\\!";
            break;
        case 2:
            result+= "^{\\!1.04}\\!";
            break;
    }
    result += "\\qquad "; //add a space

    //render a_3 = 2.x
    result += "a_3 = "; //render a3=
    switch (gamma1.level){ //switch statement based on milestone 2 to change the displayed value of a3
        case 0:
            result += "2";
            break;
        case 1:
            result += "1.992";
            break;
        case 2:
            result += "1.984";
            break;
        case 3:
            result += "1.976";
            break;
        case 4:
            result += "1.968";
            break;
        case 5:
            result += "1.96";
            break;            
    }
    });
    return result; //return the sum of text
}


//display values considered useful that aren't in the currency bar
var getTertiaryEquation = () => {
    let result = "e - \\gamma = ";
    if(inverseE_Gamma <= 10000)
    result += (BigNumber.ONE/inverseE_Gamma).toString(4);
else { 
    let exp = 1+Math.floor(inverseE_Gamma.log10().toNumber()),
        mts = ((BigNumber.TEN.pow(exp)/inverseE_Gamma).toString());
    result += `${mts}e\\text{-}${exp}`
}
    result +=", \\;\\dot{\\rho}_2 = "; //display rho2dot to a degree of granularity depending on its size, then move to next segment 
    result += rho2dot.toString(3);

    result += ", \\;\\dot{\\rho}_3 = "; //display rho3dot to a degree of granularity depending on its size, then move to next segment 
    result += rho3dot.toString(3);

    return result ; //return the sum of text    

}

var getEquationOverlay = () => ui.createGrid({
    onTouched: (e) => {
        if (e.type != TouchType.PRESSED) return;
        tapCount++;
    }
})


var postPublish = ()  => {
    //force update all equations
    theory.invalidatePrimaryEquation(); 
    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();
    t = 0; //set time since publish to 0

    currency3.value = BigNumber.ONE;

    numPublishes++; //increase number of publishes

}

var setInternalState = (state) => { //set the internal state of values that need to be kept post switch that aren't levels
    let values = state.split(" "); //save values to a string
    if (values.length > 0) numPublishes = values[0]; //save the value of publish numbers to slot 0
    if (values.length > 1) inverseE_Gamma = parseBigNumber(values[1]); //save the value of inverseE_Gamma numbers to slot 1
    if (values.length > 2) tapCount = values[2];
    if (values.length > 3) t = values[3];

}

var getInternalState = () => `${numPublishes} ${inverseE_Gamma} ${tapCount} ${t}` //return the data saved


var getPublicationMultiplier = (tau) => tau.pow(1.5); //publication mult bonus is (tau^0.15)*100
var getPublicationMultiplierFormula = (symbol) => /*"10 · " +*/ symbol + "^{1.5}"; //text to render for publication mult ext
var maxTau = BigNumber.from(1e100); // Temporary limit until we ensure that there are no exploits
var getTau = () => maxTau.min(currency.value.pow(BigNumber.from(0.1)));
var get2DGraphValue = () => (BigNumber.ONE + currency.value.abs()).log10().toNumber(); //renders the graph based on currency 1

var geta1 = (level) => Utils.getStepwisePowerSum(level, 3.5, 3, 0); //get the value of the variable from a power sum with a level of <level>, a base of 2, a step length of 5 and an initial value of 0 
var geta2 = (level) => BigNumber.TWO.pow(level); //get the value of the variable from a power of 2^level
var getb1 = (level) => Utils.getStepwisePowerSum(level, 6.5, 4, 0); //get the value of the variable from a power sum with a level of <level>, a base of 3, a step length of 2 and an initial value of 0
var getb2 = (level) => BigNumber.TWO.pow(level); //get the value of the variable from a power of 2^level


init();