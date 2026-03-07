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

requiresGameVersion("1.4.33");

var id = "basel_problem";
var getName = (language) => {
    const names = {
        en: "Basel Problem",
        fr: `Problème de Bâle`
    };
    return names[language] || names.en;  
};
const getDescription = (language) => {
    const descs = {
        en:
`The Basel problem is a legendary puzzle in mathematics, first proposed in the 17th century and famously solved by Leonhard Euler. It asks a deceptively simple question: what is the sum of the inverse squares of all positive integers? This infinite series, 1/1 + 1/4 + 1/9 + 1/16 + ..., converges to a finite value, but what?

In the Basel Problem theory, stand in Euler's shoes as you navigate the world of inverse squares. Everything in this theory revolves around them - variables based on partial sums, variable power scaling, and even the publication multiplier. Can you figure out the solution to this ancient problem?`,
        fr:
`Le problème de Bâle est une énigme légendaire en mathématiques, proposée pour la première fois au XVIIe siècle et résolue par Leonhard Euler. Il pose une question faussement simple : quelle est la somme des carrés inverses de tous les entiers positifs ? Cette série infinie, 1/1 + 1/4 + 1/9 + 1/16 + ..., converge vers une valeur finie, mais quoi?

Dans la théorie du problème de Bâle, placez-vous à la place d'Euler pendant que vous naviguez dans le monde des carrés inverses. Tout dans cette théorie tourne autour d'eux - des variables basées sur des sommes partielles, une mise à l'échelle de puissance variable et même le multiplicateur de publication. Pouvez-vous trouver la solution à cet ancien problème?`
    }
    return descs[language] || descs.en;
};
var authors = "Python's Koala\n\nThanks to Mathis S. for developing the simulation for theory balancing.";
var version = 2;
var releaseOrder = "9";

const locStrings = {
    example: {
        aPermaDesc: `{0}`,
        aPermaInfo: `{0}`,
        qPermaDesc: `{0}`,
        qPermaInfo: `{0}`,
        rMilestoneDesc: ``,
        rMilestoneInfo: ``,
        tMilestoneDesc: ``,
        tMilestoneInfo: ``,
        aMilestoneDesc: `{0}`,
        story1Title: ``,
        story1:
``,
        story2Title: ``,
        story2:
``,
        story3Title: ``,
        story3:
``,
        story4Title: ``,
        story4:
``,
        story5Title: ``,
        story5:
``,
        story6Title: ``,
        story6:
``,
        story7Title: ``,
        story7:
``,
        story8Title: ``,
        story8:
``,
        story9Title: ``,
        story9:
``,
        story10Title: ``,
        story10:
``,
        gameEndPopupTitle: ``,
        gameEndPopupText:
``,
        gameEndPopupLabel: ``,
        gameEndPopupClose: ``
    },
    en: {
        aPermaDesc: `$\\text{Unlock }a\\text{ milestone lv }\${0}`,
        aPermaInfo: `$\\text{Milestone: }\\uparrow a\\text{ by }\\frac{{{0}}^2}{1000}$`,
        qPermaDesc: `$\\text{Unlock }q\\text{ milestone lv }\${0}`,
        qPermaInfo: `$\\text{Milestone: Unlock }q_{{0}}$`,
        rMilestoneDesc: `$\\text{Invert } \\dot{r} \\text{ equation}$`,
        rMilestoneInfo: `Inverts the $\\dot{r}$ equation`,
        tMilestoneDesc: `Improve variable $t$`,
        tMilestoneInfo: `Moves $t$ outside the $a$ exponent.`,
        aMilestoneDesc: `$\\uparrow a$ by $\\frac{{{0}}^2}{1000}$`,
        story1Title: `Infinite Series`,
        story1:
`You find an interesting unsolved problem in an old mathematics textbook.
The problem is an infinite series of inverse squares.
You approach your professor with this problem.
She looks at you and says, "Do you know if this series converges?"
You reply, "I'm not sure, but that is what I want to figure out."
She looks at your old textbook again.
"This has been an unsolved problem for centuries. Do you think you can crack it?"
You look at the sheet of paper, thinking some more.
"It has an infinite number of terms, and they are all positive, so it probably diverges, right?"
"And I think I know how to prove it."
You create a little term named 'r' and start work on the project.`,
        story2Title: `Uneasy Feeling`,
        story2:
`You start your research with excitement.
You manage to publish a lemma relating to the problem in a small journal.
Pleased with your progress, you continue to press ahead.
But somewhere in the back of your mind
you can't quite shake the feeling that you've missed something.
You go over and double check all of your equations again to be sure.`,
        story3Title: `Challenging Assumptions`,
        story3:
`You've spent weeks staring at your formula to no avail.
Progress is starting to slow substantially.
Desperation is setting in.
All of a sudden, you wake up in the middle of the night with an idea.
What if your hypothesis was wrong?
What if the series doesn't diverge
and converges after all?
You make a small modification to the computation of rdot.`,
        story4Title: `Temporal Manipulation`,
        story4:
`Your progress has improved dramatically since revisiting your hypothesis.
It is now pretty clear that the series converges.
But what does it converge to?
You're starting to get stuck again.
Maybe making time move faster will help.
You take the variable 't' and move it to a different part of your equation.`,
        story5Title: `Exponential Growth`,
        story5:
`You manage to create a lower bound for the number the series converges to.
But you aren't sure how to make an upper bound.
You ask your professor what you should do.
She looks at your equation and says:
"Have you tried modifying the variable 'a'?"
You realize that in all your research, you'd never thought to change that value.
You try increasing the value of 'a', and see what happens.`,
        story6Title: `Bounds`,
        story6:
`It worked!
Changing the variable 'a' has allowed you to create an upper bound for the convergence of the equation.
Right now though, your bounds aren't very precise.
You've bounded the series to converge to a value between 1 and 2.
But you want to improve the bounds.
You look over your equation again and realize you've never manipulated the variable 'q1'.
You try adding a variable 'q2' and see what happens.`,
        story7Title: `Getting Close`,
        story7:
`You've been making good progress.
You can feel you're getting close now.
You've bounded the series convergence value to between 1.6 and 1.65.
But you're not satisfied.
You want to know the exact value.
You continue onwards...`,
        story8Title: `Desperation`,
        story8:
`Months have passed.
You still haven't managed to improve your bounds on the convergence value.
But what else can you do?
You've tried manipulating every variable in the theory.
You're getting desperate.
Is this the end?
You're not quite ready to give up yet.
You continue to forge ahead with your research, as slow as it might be.`,
        story9Title: `EUREKA!!!`,
        story9:
`One night, you sleep restlessly.
What does it converge to?
You've gotten so close.
But you haven't been able to make much of any progress recently.
Even so, you can't get thoughts of your series out of your mind.
Suddenly, you see it.
The terms of the series twist in your mind and in the limit, there is one number.
pi^2/6.
The series converges to pi^2/6.
And you know how to prove it.
You leap out of bed.
Hands shaking with excitement, you add one final term to your equation.`,
        story10Title: `The End`,
        story10:
`You've finally done it.
You have proven that the series converges to pi^2/6.
You've published your work in a prestigious journal.
You've been asked to present your work at top mathematics conferences.
Your professor approaches you and says,
"I'm so proud of you.
I always knew you could do it.
This problem had been unsolved for centuries.
None of my other students would even touch it.
But you not only proved the series converged.
You even found what it converged to, with a very elegant proof.
There's a faculty opening in mathematics at our university. Are you interested?"
You accept the offer and get to work as a professor.


The End.`,
        gameEndPopupTitle: `The End`,
        gameEndPopupText:
`You have reached the end of Basel Problem. This theory ends at the CT limit of 1e600, it however can go higher (if you really want to push it.)
We hope you enjoyed playing through this, as much as we did making and designing this theory!`,
        gameEndPopupLabel: `Thanks for playing!`,
        gameEndPopupClose: `Close`
    },
    fr: {
        aPermaDesc: `$\\text{Débloquer }a\\text{ milestone lv }\${0}`,
        aPermaInfo: `$\\text{Milestone: }\\augmente a\\text{ par }\\frac{{{0}}^2}{1000}$`,
        qPermaDesc: `$\\text{Débloquer }q\\text{ milestone lv }\${0}`,
        qPermaInfo: `$\\text{Milestone: Débloquer }q_{{0}}$`,
        rMilestoneDesc: `$\\text{Inverser } \\dot{r} \\text{ équation}$`,
        rMilestoneInfo: `Inverse l' $\\dot{r}$ équation`,
        tMilestoneDesc: `Améliorer la variable $t$`,
        tMilestoneInfo: `Déplace $t$ en dehors de l'exposant $a$.`,
        aMilestoneDesc: `$\\Augmente a$ par $\\frac{{{0}}^2}{1000}$`,
        story1Title: `Série infinie`,
        story1:
`Vous trouvez un problème intéressant non résolu dans un vieux manuel de mathématiques.
Le problème est une série infinie de carrés inverses.
Vous approchez votre professeur avec ce problème.
Elle vous regarde et dit: "Savez-vous si cette série converge?"
Vous répondez: "Je ne suis pas sûr, mais c'est ce que je veux comprendre."
Elle regarde à nouveau votre ancien manuel.
"C'est un problème non résolu depuis des siècles. Pensez-vous que vous pouvez le casser?"
Vous regardez la feuille de papier, en réfléchissant un peu plus.
"Il a un nombre infini de termes, et ils sont tous positifs, donc il diverge probablement, n'est-ce pas?"
"Et je pense que je sais comment le prouver."
Vous créez un petit terme nommé 'r' et commencez à travailler sur le projet.`,
        story2Title: `Sentiment de malaise`,
        story2:
`Vous commencez vos recherches avec enthousiasme.
Vous parvenez à publier un dilemme relatif au problème dans une petite revue.
Satisfait de vos progrès, vous continuez à avancer.
Mais quelque part au fond de ton esprit
Vous ne pouvez pas tout à fait vous débarrasser du sentiment que vous avez manqué quelque chose.
Vous allez et revérifiez à nouveau toutes vos équations pour être sûr.`,
        story3Title: `Défier les hypothèses`,
        story3:
`Vous avez passé des semaines à regarder votre formule en vain.
Les progrès commencent à ralentir considérablement.
Le désespoir s'installe.
Tout d'un coup, vous vous réveillez au milieu de la nuit avec une idée.
Et si votre hypothèse était fausse?
Et si la série ne diverge pas?
Et converge après tout?
Vous faites une petite modification au calcul de rdot.`,
        story4Title: `Manipulation temporelle`,
        story4:
`Vos progrès se sont considérablement améliorés depuis que vous avez revisité votre hypothèse.
Il est maintenant assez clair que la série converge.
Mais vers quoi converge-t-il?
Vous commencez à être bloqué à nouveau.
Peut-être que faire passer le temps plus vite aidera.
Vous prenez la variable 't' et la déplacez vers une autre partie de votre équation.`,
        story5Title: `Croissance exponentielle`,
        story5:
`Vous parvenez à créer une limite inférieure pour le nombre vers laquelle la série converge.
Mais vous ne savez pas comment faire une limite supérieure.
Vous demandez à votre professeur ce que vous devriez faire.
Elle regarde votre équation et dit:
"Avez-vous essayé de modifier la variable 'a'?"
Vous vous rendez compte que dans toutes vos recherches, vous n'aviez jamais pensé à changer cette valeur.
Vous essayez d'augmenter la valeur de 'a' et voyez ce qui se passe.`,
        story6Title: `Limites`,
        story6:
`Ça a marché!
La modification de la variable 'a' vous a permis de créer une limite supérieure pour la convergence de l'équation.
En ce moment, cependant, vos limites ne sont pas très précises.
Vous avez limité la série pour qu'elle converge vers une valeur comprise entre 1 et 2.
Mais vous voulez améliorer les limites.
Vous regardez à nouveau votre équation et réalisez que vous n'avez jamais manipulé la variable 'q1'.
Vous essayez d'ajouter une variable 'q2' et voyez ce qui se passe.`,
        story7Title: `Rapprochement`,
        story7:
`Vous avez fait de bons progrès.
Vous pouvez sentir que vous vous rapprochez maintenant.
Vous avez limité la valeur de convergence de la série entre 1,6 et 1,65.
Mais vous n'êtes pas satisfait.
Vous voulez connaître la valeur exacte.
Vous continuez...`,
        story8Title: `Désespoir`,
        story8:
`Les mois ont passé.
Vous n'avez toujours pas réussi à améliorer vos limites sur la valeur de convergence.
Mais que pouvez-vous faire d'autre?
Vous avez essayé de manipuler chaque variable de la théorie.
Tu deviens désespéré.
Est-ce la fin?
Vous n'êtes pas encore tout à fait prêt à abandonner.
Vous continuez à aller de l'avant avec votre recherche, aussi lente qu'elle puisse être.`,
        story9Title: `EUREKA!!!`,
        story9:
`Une nuit, tu dors agité.
À quoi converge-t-il ?
Tu t'es tellement rapproché.
Mais vous n'avez pas été en mesure de faire beaucoup de progrès récemment.
Même ainsi, vous ne pouvez pas sortir les pensées de votre série de votre esprit.
Soudain, vous le voyez.
Les termes de la série se tordent dans votre esprit et dans la limite, il y a un chiffre.
pi^2/6.
La série converge vers pi^2/6.
Et vous savez comment le prouver.
Vous sautez du lit.
Les mains tremblantes d'excitation, vous ajoutez un dernier terme à votre équation.`,
        story10Title: `La fin`,
        story10:
`Vous l'avez enfin fait.
Vous avez prouvé que la série converge vers pi^2/6.
Vous avez publié votre travail dans une revue prestigieuse.
On vous a demandé de présenter votre travail lors des meilleures conférences de mathématiques.
Votre professeur s'approche de vous et vous dit:
"Je suis tellement fier de toi.
J'ai toujours su que tu pouvais le faire.
Ce problème n'était pas résolu depuis des siècles.
Aucun de mes autres étudiants ne le toucherait même.
Mais vous n'avez pas seulement prouvé que la série convergeait.
Vous avez même trouvé ce vers quoi il a convergé, avec une preuve très élégante.
Il y a une ouverture de faculté en mathématiques dans notre université. Êtes-vous intéressé?"
Vous acceptez l'offre et vous travaillez en tant que professeur.


Fin.`,
        gameEndPopupTitle: `Fin`,
        gameEndPopupText:
`Vous avez atteint la fin du problème de Bâle. Cette théorie se termine à la limite CT de 1e600, mais elle peut aller plus haut (si vous voulez vraiment la pousser).

Nous espérons que vous avez apprécié de jouer à travers cela, autant que nous avons fait de faire et de concevoir cette théorie!`,
        gameEndPopupLabel: `Merci d'avoir joué!`,
        gameEndPopupClose: `Fermeture`
    }
};
const menuLang = Localization.language;
let getLoc = (name, lang = menuLang) => {
    if (lang in locStrings && name in locStrings[lang])
        return locStrings[lang][name];
    if (name in locStrings.en)
        return locStrings.en[name];
    return `String missing: ${lang}.${name}`;
};

var tauMultiplier = 0.4;

// internal variables
var currency;
var quaternaryEntries;
var app_was_closed = false;

// upgrade variables
var c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, n;
var q1 = BigNumber.ZERO;
var q2 = BigNumber.ZERO;
var q3 = BigNumber.ZERO;
var q4 = BigNumber.ZERO;
var q5 = BigNumber.ZERO;
var q6 = BigNumber.ZERO;
var q7 = BigNumber.ZERO;
var q8 = BigNumber.ZERO;
var q9 = BigNumber.ZERO;
var r = BigNumber.ZERO;

// milestone variables
var r_upgrade, t_upgrade;
var a_level, n_unlock;
var dimension;

// graph variables
var t_speed;                  // multiplies dt by given value (1 + t_multiplier * dt)
var t = BigNumber.ZERO;       // time elapsed ( -> cos(t), sin(t) etc.)
var num_publications = 0;


var init = () => {
    currency = theory.createCurrency();

    quaternaryEntries = [];

    // Regular Upgrades

    // t
    {
        let getDesc = (level) => "\\dot{t}=" + BigNumber.from(1 + (1 * level)).toString(level > 3 ? 0 : 1);
        let getInfo = (level) => "\\dot{t}=" + BigNumber.from(1 + (1 * level)).toString(level > 3 ? 0 : 1);
        t_speed = theory.createUpgrade(0, currency, new ExponentialCost(1e6, Math.log2(1e6)));
        t_speed.getDescription = (_) => Utils.getMath(getDesc(t_speed.level));
        t_speed.getInfo = (amount) => t_speed.level == t_speed.maxLevel ? Utils.getMath(getInfo(t_speed.level)) : Utils.getMathTo(getInfo(t_speed.level), getInfo(t_speed.level + amount));
        t_speed.maxLevel = 4;
    }

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(0);
        let getInfo = (level) => "c_1=" + getC1(level).toString(0);
        c1 = theory.createUpgrade(1, currency, new FirstFreeCost(new ExponentialCost(0.0625, 0.25)));
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));
    }

    // c2
    {
        let getDesc = (level) => "c_2=2^{" + level + "}";
        let getInfo = (level) => "c_2=" + getC2(level).toString(0);
        c2 = theory.createUpgrade(2, currency, new ExponentialCost(16, 4));
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
    }

    // c3
    {
        let getDesc = (level) => "c_3=3^{" + level + "}";
        let getInfo = (level) => "c_3=" + getC3(level).toString(0);
        c3 = theory.createUpgrade(3, currency, new ExponentialCost(19683, Math.log2(19683)));
        c3.getDescription = (_) => Utils.getMath(getDesc(c3.level));
        c3.getInfo = (amount) => Utils.getMathTo(getInfo(c3.level), getInfo(c3.level + amount));
    }

    // c4
    {
        let getDesc = (level) => "c_4=4^{" + level + "}";
        let getInfo = (level) => "c_4=" + getC4(level).toString(0);
        c4 = theory.createUpgrade(4, currency, new ExponentialCost(Math.pow(4,16), 32));
        c4.getDescription = (_) => Utils.getMath(getDesc(c4.level));
        c4.getInfo = (amount) => Utils.getMathTo(getInfo(c4.level), getInfo(c4.level + amount));
    }

    // c5
    {
        let getDesc = (level) => "c_5=5^{" + level + "}";
        let getInfo = (level) => "c_5=" + getC5(level).toString(0);
        c5 = theory.createUpgrade(5, currency, new ExponentialCost(Math.pow(5,25), 25*Math.log2(5)));
        c5.getDescription = (_) => Utils.getMath(getDesc(c5.level));
        c5.getInfo = (amount) => Utils.getMathTo(getInfo(c5.level), getInfo(c5.level + amount));
    }

    // c6
    {
        let getDesc = (level) => "c_6=6^{" + level + "}";
        let getInfo = (level) => "c_6=" + getC6(level).toString(0);
        c6 = theory.createUpgrade(6, currency, new ExponentialCost(Math.pow(6,36), 36*Math.log2(6)));
        c6.getDescription = (_) => Utils.getMath(getDesc(c6.level));
        c6.getInfo = (amount) => Utils.getMathTo(getInfo(c6.level), getInfo(c6.level + amount));
    }

    // c7
    {
        let getDesc = (level) => "c_7=7^{" + level + "}";
        let getInfo = (level) => "c_7=" + getC7(level).toString(0);
        c7 = theory.createUpgrade(7, currency, new ExponentialCost(Math.pow(7,49), 49*Math.log2(7)));
        c7.getDescription = (_) => Utils.getMath(getDesc(c7.level));
        c7.getInfo = (amount) => Utils.getMathTo(getInfo(c7.level), getInfo(c7.level + amount));
    }

    // c8
    {
        let getDesc = (level) => "c_8=8^{" + level + "}";
        let getInfo = (level) => "c_8=" + getC8(level).toString(0);
        c8 = theory.createUpgrade(8, currency, new ExponentialCost(Math.pow(8,64), 64*Math.log2(8)));
        c8.getDescription = (_) => Utils.getMath(getDesc(c8.level));
        c8.getInfo = (amount) => Utils.getMathTo(getInfo(c8.level), getInfo(c8.level + amount));
    }

    // c9
    {
        let getDesc = (level) => "c_9=9^{" + level + "}";
        let getInfo = (level) => "c_9=" + getC9(level).toString(0);
        c9 = theory.createUpgrade(9, currency, new ExponentialCost(Math.pow(9,81), 81*Math.log2(9)));
        c9.getDescription = (_) => Utils.getMath(getDesc(c9.level));
        c9.getInfo = (amount) => Utils.getMathTo(getInfo(c9.level), getInfo(c9.level + amount));
    }

    // c10
    {
        let getDesc = (level) => "c_{10}=10^{" + level + "}";
        let getInfo = (level) => "c_{10}=" + getC10(level).toString(0);
        c10 = theory.createUpgrade(10, currency, new ExponentialCost(Math.pow(10,100), 100*Math.log2(10)));
        c10.getDescription = (_) => Utils.getMath(getDesc(c10.level));
        c10.getInfo = (amount) => Utils.getMathTo(getInfo(c10.level), getInfo(c10.level + amount));
    }

    // n
    {
        let getDesc = (level) => "n=" + getN(level).toString(0);
        let getInfo = (level) => "n=" + getN(level).toString(0);
        n = theory.createUpgrade(11, currency, new ExponentialCost(Math.pow(10,40), 60*Math.log2(10)));
        n.getDescription = (_) => Utils.getMath(getDesc(n.level));
        n.getInfo = (amount) => Utils.getMathTo(getInfo(n.level), getInfo(n.level + amount));
    }


    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e7);
    theory.createBuyAllUpgrade(1, currency, 1e12);
    theory.createAutoBuyerUpgrade(2, currency, 1e16);

    {
        perm1 = theory.createPermanentUpgrade(
            3,
            currency,
            new CustomCost(level => BigNumber.TEN.pow(BigNumber.from(getAUpgradeCost(level))))
        );
        perm1.getDescription = (amount) => Localization.format(getLoc(`aPermaDesc`), perm1.level + 1);
        perm1.getInfo = (amount) => Localization.format(getLoc(`aPermaInfo`), 9 - perm1.level);
        perm1.boughtOrRefunded = (_) => {
            updateAvailability();
        };
        perm1.maxLevel = 9;
    }

    {
        perm2 = theory.createPermanentUpgrade(
            4,
            currency,
            new CustomCost(level => BigNumber.TEN.pow(BigNumber.from(getQUpgradeCost(level))))
        );
        perm2.getDescription = (amount) => Localization.format(getLoc(`qPermaDesc`), perm2.level + 1);
        perm2.getInfo = (amount) => Localization.format(getLoc(`qPermaInfo`), perm2.level + 2);
        perm2.boughtOrRefunded = (_) => updateAvailability();
        perm2.maxLevel = 8;
    }

    // Milestone Upgrades
    theory.setMilestoneCost(new CustomCost(total => BigNumber.from(tauMultiplier * getMilestoneCost(total))));

    {
        r_upgrade = theory.createMilestoneUpgrade(0, 1);
        r_upgrade.getDescription = () => getLoc(`rMilestoneDesc`);
        r_upgrade.getInfo = () => getLoc(`rMilestoneInfo`);
        r_upgrade.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); theory.invalidateSecondaryEquation(); theory.invalidateTertiaryEquation(); updateAvailability();}
        r_upgrade.canBeRefunded = (_) => t_upgrade.level == 0;
    }

    {
        t_upgrade = theory.createMilestoneUpgrade(1, 1);
        t_upgrade.getDescription = () => getLoc(`tMilestoneDesc`);
        t_upgrade.getInfo = () => getLoc(`tMilestoneInfo`);
        t_upgrade.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); theory.invalidateSecondaryEquation(); theory.invalidateTertiaryEquation(); updateAvailability();}
        t_upgrade.canBeRefunded = (_) => a_level.level == 0 && dimension.level == 0;
    }

    {
        a_level = theory.createMilestoneUpgrade(2, 9);
        a_level.getDescription = (_) => Localization.format(getLoc(`aMilestoneDesc`), 9 - a_level.level);
        a_level.getInfo = () => `$a \\to ${getA(a_level.level+1, false, 0).toFixed(3)}`;
        a_level.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); }
        a_level.canBeRefunded = (_) => n_unlock.level == 0;
    }

    {
        dimension = theory.createMilestoneUpgrade(3, 8);
        dimension.getDescription = () => Localization.getUpgradeUnlockDesc(`q_{${Math.min(9, dimension.level + 2)}}`);
        dimension.getInfo = () => Localization.getUpgradeAddDimensionDesc();
        dimension.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); theory.invalidateSecondaryEquation(); theory.invalidateTertiaryEquation(); updateAvailability(); }
        dimension.canBeRefunded = (_) => n_unlock.level == 0;
    }

    {
        n_unlock = theory.createMilestoneUpgrade(4, 1);
        n_unlock.getDescription = () => Localization.getUpgradeUnlockDesc("n");
        n_unlock.getInfo = () => Localization.getUpgradeUnlockInfo("n");
        n_unlock.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); }
        n_unlock.canBeRefunded = (_) => true;
    }

    // Story Chapters
    theory.createStoryChapter(0, getLoc("story1Title"), getLoc("story1"), () => c1.level == 0); // unlocked at beginning of the theory
    theory.createStoryChapter(1, getLoc("story2Title"), getLoc("story2"), () => num_publications > 0); // unlocked at rho = 1e7
    theory.createStoryChapter(2, getLoc("story3Title"), getLoc("story3"), () => r_upgrade.level > 0); // unlocked at R dimension milestone
    theory.createStoryChapter(3, getLoc("story4Title"), getLoc("story4"), () => t_upgrade.level > 0); // unlocked at I dimension milestone
    theory.createStoryChapter(4, getLoc("story5Title"), getLoc("story5"), () => perm1.level > 0); // unlocked at a_base first milestone
    theory.createStoryChapter(5, getLoc("story6Title"), getLoc("story6"), () => perm2.level > 0); // unlocked at a_base last milestone
    theory.createStoryChapter(6, getLoc("story7Title"), getLoc("story7"), () => perm1.level > 8); // unlocked at a_exponent first milestone
    theory.createStoryChapter(7, getLoc("story8Title"), getLoc("story8"), () => currency.value > BigNumber.TEN.pow(getMilestoneCost(19)-25)); // unlocked just before n unlock
    theory.createStoryChapter(8, getLoc("story9Title"), getLoc("story9"), () => n_unlock.level > 0); 
    theory.createStoryChapter(9, getLoc("story10Title"), getLoc("story10"), () => predicateAndCallbackPopup()); // unlocked at tau = e600 (finished)

    updateAvailability();
}

// INTERNAL FUNCTIONS
// -------------------------------------------------------------------------------

// written by gilles
let e600 = BigNumber.from("1e600");
var predicateAndCallbackPopup = () => {
    if (theory.tau >= e600) {
        getEndPopup.show();
        return true;
    }
    return false;
}


// milestone costs in rho
var getAUpgradeCost = (level) => {
    switch(level) {
        case 0:
            return 20;
        case 1:
            return 30;
        case 2:
            return 50;
        case 3:
            return 80;
        case 4:
            return 140;
        case 5:
            return 240;
        case 6:
            return 400;
        case 7:
            return 600;
        case 8:
            return 800;
    }
    return 5000;
};

var getQUpgradeCost = (level) => {
    switch(level) {
        case 0:
            return 25;
        case 1:
            return 40;
        case 2:
            return 60;
        case 3:
            return 100;
        case 4:
            return 180;
        case 5:
            return 300;
        case 6:
            return 500;
        case 7:
            return 700;
    }
    return 5000;
};


// milestone costs in rho
var getMilestoneCost = (level) => {
    switch(level) {
        case 0:
            return 10;
        case 1:
            return 15;
        case 2:
            return 20;
        case 3:
            return 25;
        case 4:
            return 30;
        case 5:
            return 40;
        case 6:
            return 50;
        case 7:
            return 70;
        case 8:
            return 90;
        case 9:
            return 120;
        case 10:
            return 150;
        case 11:
            return 200;
        case 12:
            return 250;
        case 13:
            return 300;
        case 14:
            return 400;
        case 15:
            return 500;
        case 16:
            return 600;
        case 17:
            return 700;
        case 18:
            return 800;
        case 19:
            return 1000;
    }
    return 5000;
};

var updateAvailability = () => {
    t_speed.isAvailable = true;
    r_upgrade.isAvailable = true;
    t_upgrade.isAvailable = r_upgrade.level > 0;
    a_level.isAvailable = t_upgrade.level > 0 && perm1.level > 0;
    dimension.isAvailable = t_upgrade.level > 0 && perm2.level > 0;
    n_unlock.isAvailable = dimension.level > 7 && a_level.level > 8;

    a_level.maxLevel = 0 + perm1.level;
    dimension.maxLevel = 0 + perm2.level;

    c1.isAvailable = true;
    c2.isAvailable = true;
    c3.isAvailable = dimension.level > 0;
    c4.isAvailable = dimension.level > 1;
    c5.isAvailable = dimension.level > 2;
    c6.isAvailable = dimension.level > 3;
    c7.isAvailable = dimension.level > 4;
    c8.isAvailable = dimension.level > 5;
    c9.isAvailable = dimension.level > 6;
    c10.isAvailable = dimension.level > 7;

    q2.isAvailable = dimension.level > 0;
    q3.isAvailable = dimension.level > 1;
    q4.isAvailable = dimension.level > 2;
    q5.isAvailable = dimension.level > 3;
    q6.isAvailable = dimension.level > 4;
    q7.isAvailable = dimension.level > 5;
    q8.isAvailable = dimension.level > 6;
    q9.isAvailable = dimension.level > 7;
    n.isAvailable = n_unlock.level > 0;
}

var postPublish = () => {
    t = BigNumber.ZERO;
    q1 = BigNumber.ZERO;
    q2 = BigNumber.ZERO;
    q3 = BigNumber.ZERO;
    q4 = BigNumber.ZERO;
    q5 = BigNumber.ZERO;
    q6 = BigNumber.ZERO;
    q7 = BigNumber.ZERO;
    q8 = BigNumber.ZERO;
    q9 = BigNumber.ZERO;
    r = BigNumber.ZERO;
    num_publications++;
}

var getInternalState = () => `${num_publications} ${t.toBase64String()} ${q1.toBase64String()} ${q2.toBase64String()} ${q3.toBase64String()} ${q4.toBase64String()} ${q5.toBase64String()} ${q6.toBase64String()} ${q7.toBase64String()} ${q8.toBase64String()} ${q9.toBase64String()} ${r.toBase64String()}`

var setInternalState = (state) => {
    const bigNumberFromBase64OrParse = (value) => {
        let result;
        try { result = BigNumber.fromBase64String(value); } catch { result = parseBigNumber(value); };
        return result;
    }

    let values = state.split(" ");
    if (values.length > 0) num_publications = parseInt(values[0]);
    if (values.length > 1) t = bigNumberFromBase64OrParse(values[1]);
    if (values.length > 2) q1 = bigNumberFromBase64OrParse(values[2]);
    if (values.length > 3) q2 = bigNumberFromBase64OrParse(values[3]);
    if (values.length > 4) q3 = bigNumberFromBase64OrParse(values[4]);
    if (values.length > 5) q4 = bigNumberFromBase64OrParse(values[5]);
    if (values.length > 6) q5 = bigNumberFromBase64OrParse(values[6]);
    if (values.length > 7) q6 = bigNumberFromBase64OrParse(values[7]);
    if (values.length > 8) q7 = bigNumberFromBase64OrParse(values[8]);
    if (values.length > 9) q8 = bigNumberFromBase64OrParse(values[9]);
    if (values.length > 10) q9 = bigNumberFromBase64OrParse(values[10]);
    if (values.length > 11) r = bigNumberFromBase64OrParse(values[11]);
}


var getEndPopup = ui.createPopup({
    title: getLoc(`gameEndPopupTitle`),
    content: ui.createStackLayout({
        children: [
            ui.createFrame({
                heightRequest: 309,
                cornerRadius: 0,
                content: ui.createLabel({text: "\n" + getLoc(`gameEndPopupText`) + "\n\n",
                    padding: Thickness(12, 2, 12, 2),
                    fontSize: 15
                })
            }),
            ui.createLabel({
                text: getLoc(`gameEndPopupLabel`),
                horizontalTextAlignment: TextAlignment.CENTER,
                fontAttributes: FontAttributes.BOLD,
                fontSize: 18,
                padding: Thickness(0, 18, 0, 18),
            }),
            ui.createButton({text: getLoc(`gameEndPopupClose`), onClicked: () => getEndPopup.hide()})
        ]
    })
});



var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = BigNumber.from(theory.publicationMultiplier);

    if(game.isCalculatingOfflineProgress) {
        app_was_closed = true;
    } else if (app_was_closed) {
        theory.clearGraph();
        app_was_closed = false;
    }

    if (c1.level > 0) {
        // t calc
        t += ((BigNumber.ONE + BigNumber.from(t_speed.level))) * dt;

        // q calc
        if (dimension.level > 7) {
            let vc10 = getC10(c10.level);
            q9 += vc10 * dt;
        }
        if (dimension.level > 6) {
            let vc9 = getC9(c9.level);
            q8 += vc9 * (dimension.level > 7 ? q9 : BigNumber.ONE) * dt;
        }
        if (dimension.level > 5) {
            let vc8 = getC8(c8.level);
            q7 += vc8 * (dimension.level > 6 ? q8 : BigNumber.ONE) * dt;
        }
        if (dimension.level > 4) {
            let vc7 = getC7(c7.level);
            q6 += vc7 * (dimension.level > 5 ? q7 : BigNumber.ONE) * dt;
        }
        if (dimension.level > 3) {
            let vc6 = getC6(c6.level);
            q5 += vc6 * (dimension.level > 4 ? q6 : BigNumber.ONE) * dt;
        }
        if (dimension.level > 2) {
            let vc5 = getC5(c5.level);
            q4 += vc5 * (dimension.level > 3 ? q5 : BigNumber.ONE) * dt;
        }
        if (dimension.level > 1) {
            let vc4 = getC4(c4.level);
            q3 += vc4 * (dimension.level > 2 ? q4 : BigNumber.ONE) * dt;
        }
        if (dimension.level > 0) {
            let vc3 = getC3(c3.level);
            q2 += vc3 * (dimension.level > 1 ? q3 : BigNumber.ONE) * dt;
        }

        let vc2 = getC2(c2.level);
        q1 += vc2 * (dimension.level > 0 ? q2 : BigNumber.ONE) * dt;

        // r calc
        r += getRdot(getC1(c1.level), r_upgrade.level > 0) * dt;

        let vn = 0;
        if (n_unlock.level > 0) {
            vn = getN(n.level)
        }

        if (t_upgrade.level == 0) {
            currency.value += dt * bonus * (t * q1 * r).pow(getA(a_level.level, n_unlock.level > 0, vn));
        } else {
            currency.value += dt * bonus * t * (q1 * r).pow(getA(a_level.level, n_unlock.level > 0, vn));
        }
    }

    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();
    theory.invalidateQuaternaryValues();
}
// -------------------------------------------------------------------------------


// EQUATIONS
// -------------------------------------------------------------------------------
var getPrimaryEquation = () => {
    theory.primaryEquationScale = 1;
    theory.primaryEquationHeight = 50;

    // let everything be centered -> "{c}"
    let result = "\\begin{array}{c}\\dot{\\rho} = ";

    if (t_upgrade.level > 0) {
        result += "t";
    }

    let inside_parens_term;
    if (t_upgrade.level == 0) {
        inside_parens_term = "t q_1 r";
    } else {
        inside_parens_term = "q_1 r";
    }

    result += "(" + inside_parens_term + ")^a\\\\";

    result += "a = ";

    if (n_unlock.level == 0) {
        result += getA(a_level.level, n_unlock.level > 0, 0).toFixed(3)
    } else {
        result += getA(a_level.level, n_unlock.level > 0, getN(n.level)).toFixed(3)
    }

    result += "\\end{array}";
    return result;
}

var getSecondaryEquation = () => {
    let result = "\\begin{array}{c}";
    theory.secondaryEquationScale = 1.0;
    theory.secondaryEquationHeight = 140;

    if (a_level.level > 0) {
        if (n_unlock.level == 0) {
            result += "a = 0.2 + \\sum_{i=0}^{" + (a_level.level) + "} \\frac{(10-i)^2}{1000}";
        } else {
            result += "a = 2 \\cdot \\frac{6}{\\pi^2} - \\left(\\sum_{i=1}^{n} \\frac{1}{i^2}\\right)^{-1}"
        }
        result += "\\\\"
    }


    if (dimension.level == 0) {
        result += "\\dot{q_1} = c_2";
    } else {
        result += "\\dot{q_i} = c_{i+1} q_{i+1}, \\quad 1 \\leq i \\leq " + (dimension.level) + "\\\\";
        result += "\\dot{q_" + (dimension.level + 1) + "} = c_{" + (dimension.level + 2) + "}";
    }

    result += "\\\\";

    if (r_upgrade.level > 0) {
        result += "\\dot{r} = \\left(\\sum\\limits_{i=c_1}^{\\infty} \\frac{1}{i^2}\\right)^{-1}";
    } else {
        result += "\\dot{r} = \\sum\\limits_{i=1}^{c_1} \\frac{1}{i^2}";
    }

    result += "\\end{array}";
    return result;
}

var getTertiaryEquation = () => {
    let result = theory.latexSymbol + "=\\max\\rho^{" + tauMultiplier + "}";
    return result;
}

var getQuaternaryEntries = () => {
    quaternaryEntries = [];
    quaternaryEntries.push(new QuaternaryEntry("t", null));
    for (let i = 0; i <= dimension.level; i++) {
        quaternaryEntries.push(new QuaternaryEntry("q_{" + (i+1) +"}", null));
    }
    quaternaryEntries.push(new QuaternaryEntry("r", null));

    quaternaryEntries[0].value = t.toString(2);
    idx = 1
    q_values = [q1, q2, q3, q4, q5, q6, q7, q8, q9]
    for (let i = 0; i <= dimension.level; i++) {
        quaternaryEntries[idx].value = q_values[i].toString(2);
        idx += 1
    }
    quaternaryEntries[idx].value = r.toString(2);

    return quaternaryEntries;
}
// -------------------------------------------------------------------------------

var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();
var getPublicationMultiplier = (tau) => 5 *tau.pow(0.132075);
var getPublicationMultiplierFormula = (symbol) => "5" + symbol + "^{0.132075}";
var isCurrencyVisible = (index) => index == 0 || (index == 1 && dimension.level > 0) || (index == 2 && dimension.level > 1);
var getTau = () => currency.value.pow(BigNumber.from(tauMultiplier));
var getCurrencyFromTau = (tau) => [tau.max(BigNumber.ONE).pow(1/tauMultiplier), currency.symbol];

var getC1 = (level) => Utils.getStepwisePowerSum(level, 65536, 64, 0);
var getC2 = (level) => BigNumber.TWO.pow(level);
var getC3 = (level) => BigNumber.THREE.pow(level);
var getC4 = (level) => BigNumber.FOUR.pow(level);
var getC5 = (level) => BigNumber.FIVE.pow(level);
var getC6 = (level) => BigNumber.SIX.pow(level);
var getC7 = (level) => BigNumber.SEVEN.pow(level);
var getC8 = (level) => BigNumber.EIGHT.pow(level);
var getC9 = (level) => BigNumber.NINE.pow(level);
var getC10 = (level) => BigNumber.TEN.pow(level);
var getN = (level) => Utils.getStepwisePowerSum(level, 6, 16, 0)+1;
var getA = (level, n_unlocked, n_value) => {
    if (n_unlocked) {
        let partial_sum = 0;

        if (n_value <= 100) { //exact computation
            for (let i = 1; i <= n_value; i++) {
                partial_sum += 1 / (i * i);
            }
        } else {
            partial_sum = ((Math.PI * Math.PI) / 6 - (1 / (n_value + 1) + 1 / (2 * ((n_value + 1) * (n_value + 1))))).toNumber();
        }

        return 12 / (Math.PI * Math.PI) - 1.0 / partial_sum;
    }
    else {
        a = 0.3
        for (let i = 9; i > 9 - level; i--) {
            a += i*i / 1000;
        }
        return a;
    }
}

var getRdot = (c1, r_ms) => {
    if (c1 == 0) {
        return BigNumber.ZERO;
    }

    if (c1 <= 100) { // exact computation
        let sum = BigNumber.ZERO;
        for (let i = 1; i < c1; i++) {
            sum += BigNumber.ONE / BigNumber.from(i * i);
        }
        if (r_ms) {
            return BigNumber.ONE / (BigNumber(Math.PI * Math.PI) / BigNumber.SIX - sum);
        }
        return sum + (BigNumber.ONE / BigNumber.from(c1 * c1));
    }

    let approx_sum = BigNumber.ONE / c1 + BigNumber.ONE / (BigNumber.TWO * (c1.pow(BigNumber.TWO)));
    
    if (r_ms) {
        if (c1 <= 1e10) { // higher accuracy estimate
            return approx_sum.pow(-BigNumber.ONE);
        } else { // discard higher order terms to avoid div by 0
            return c1;
        }
    }
    
    return BigNumber.from(Math.PI * Math.PI) / BigNumber.SIX - approx_sum + BigNumber.ONE / c1.pow(BigNumber.TWO);
}

init();
