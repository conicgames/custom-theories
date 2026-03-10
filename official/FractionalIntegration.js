import { CompositeCost, CustomCost, ExponentialCost, FirstFreeCost, FreeCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { parseBigNumber, BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "fractional_integration";
var getName = (language) => {
  const names = {
    en: `Fractional Integration`,
    de: `Fractionale Integration`,
    fr: `Intégration Fractionnelle`,
    ja: `分数階積分学`,
    ru: `Дробное интегрирование`
  };
  return names[language] || names.en;
};
var getDescription = (language) => {
  const descs = {
    en:
`The functions between a function and its derivative have many ways of being shown, this is one of them.
Fractional integration is a way to calculate what is between a function and its integral and is a smooth transition.
As such, as a fractional integral approaches 1, it should become the integral.`,
    de:
`Die Funktionen zwischen einer Funktion und ihren Derivat besitzt viele wege ihn zu Zeigen, dies ist einer von denen.
Fraktionale Integration ist ein weg um zu Rechnen, was ziwschen einer Funktion und ihren Integral und ihrem fließenden übergang.
Wenn sich ein Fractionalintegral dem Wert 1 nähert, sollte es zum Integral werden.`,
    fr:
`Les fonctions entre une fonction et sa dérivée peuvent être montrées de différentes manières, ceci en est une.
L'intégration fractionnelle est une manière de calculer ce qui est entre une fonction et son intégrale, avec une transition douce.
Ainsi, lorsqu'une intégrale fractionnelle approche 1, elle doit devenir l'intégrale.`,
    ja:
`関数とその導関数の間にあるものは、様々な形で表すことができます。これはそのうちのひとつです。 
分数階積分は、関数とその積分の間にあるものを計算する方法で、なめらかに移り変わっていきます。
したがって、分数階積分が1に近づくほど、それは通常の積分になっていくはずです。`,
    ru:
`Функции между функцией и ее производной можно показать разными способами, и это один из них. 
Дробное интегрирование — это способ вычисления того, что находится между функцией и ее интегралом и является плавным переходом. 
По существу, когда дробный интеграл приближается к 1, он должен стать интегралом.`
  };
  return descs[language] || descs.en;
};
var authors = "Snaeky (SnaekySnacks#1161) - Idea\nGen (Gen#3006) - Coding\nXLII (XLII#0042) - Balancing";
var version = 5;
var releaseOrder = "5";

requiresGameVersion("1.4.33");

const locStrings = {
  example: {
    gxPopupTitle: ``,
    gxPopupWarning1: ``,
    gxPopupWarning2: ``,
    gxPopupYes: ``,
    gxPopupNo: ``,
    gxPermaDesc: ``,
    gxPermaInfo: ``,
    lambdaPermaDesc: ``,
    lambdaPermaInfo: ``,
    integralMilestoneDesc: ``,
    integralMilestoneInfo: ``,
    gxMilestoneDesc1: ``,
    gxMilestoneDesc2: ``,
    gxMilestoneDesc3:
``,
    gxMilestoneInfo1: ``,
    gxMilestoneInfo2: ``,
    gxMilestoneInfo3: ``,
    lambdaMilestone1: ``,
    lambdaMilestone2: ``,
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
    story11Title: ``,
    story11:
``
  },
  en: {
    gxPopupTitle: `g(x) Milestone`,
    gxPopupWarning1: `Buying or refunding this milestone will reset $q$.`,
    gxPopupWarning2: `Do you want to continue?`,
    gxPopupYes: `Yes`,
    gxPopupNo: `No`,
    gxPermaDesc: `Unlock g(x) Milestone lv {0}`,
    gxPermaInfo: `Unlocks the g(x) Milestone lv {0}`,
    lambdaPermaDesc: `Unlock $\\lambda$ Milestone lv {0}`,
    lambdaPermaInfo: `Unlocks the $\\lambda$ Milestone lv {0}`,
    integralMilestoneDesc: `Change $q/\\pi$ to $\\int_0^{q/\\pi}{g(x)dx}$`,
    integralMilestoneInfo: `Unlock Fractional Integral`,
    gxMilestoneDesc1: `Approximate $\\sin(x)$ to 3 terms`,
    gxMilestoneDesc2: `Approximate $\\log_{10}(1+x)$ to 5 terms`,
    gxMilestoneDesc3:
`Approximate $e^{x}$ to 6 terms
Remove $/\\pi$ in the integral limit`,
    gxMilestoneInfo1: `Change $g(x)$ to $x-\\frac{x^3}{3!}+\\frac{x^5}{5!}$`,
    gxMilestoneInfo2: `Change $g(x)$ to $(x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\frac{x^4}{4}+\\frac{x^5}{5})/\\ln(10)$`,
    gxMilestoneInfo3: `Change $g(x)$ to $1+x+\\frac{x^2}{2!}+\\frac{x^3}{3!}+\\frac{x^4}{4!}+\\frac{x^5}{5!}$ & $q/\\pi \\to q$`,
    lambdaMilestone1: `Improve $\\lambda$ Fraction to $2/3^{i}$`,
    lambdaMilestone2: `Improve $\\lambda$ Fraction to $3/4^{i}$`,
    story1Title: `An Idea`,
    story1:
`While studying some techniques in integration, you think about what it would mean to have a partial derivative or integral...
You remember your friend, a Professor that did some work with Differential and Integral Calculus, and ask them what they thought.
They said, "oh, I think I saw something about a 'Riemann-Liouville Fractional Derivatives' in a textbook a long time ago."
You don't know if it really works, but you want to test it somehow.
You want to start somewhere small and test it from the bottom up. The equation you make is as follows.`,
    story2Title: `The Implementation`,
    story2:
`As your ρ growth begins to slow down, you sit down and think. This is just the base and you know that it works well, but you start to wonder about how good this thought experiment can be.
Maybe applying the same idea for ρ directly will work well.
You try to add the "fractional integral" into ρ equation to see what comes of it...`,
    story3Title: `The Inevitability`,
    story3:
`The change helped, but it is still not enough to get anywhere close to proving the theory.
You take a look at the equation. You knew from the beginning that you needed to adjust lambda in some way to be able to check if this 'Integral' is really related to actual Integrals.
It is finally time to make lambda approach 1.`,
    story4Title: `Pushing Forwards`,
    story4:
`Wow, you didn't expect it to work this well!
But, you think it can go faster!
You add a new variable to speed things up.`,
    story5Title: `Converging to the Truth`,
    story5:
`The m and n upgrades are doing well, but you are getting impatient.
It's taking too long to really show anything concrete.
Sure, ρ is increasing, but it's not enough to really show that this weird looking "partial" integral converges to the actual integral...
Maybe changing g(x) will speed things up!`,
    story6Title: `A Lambdmark Discovery`,
    story6:
`The Professor comes to you and asks how things are going.
You inform them that things are going well, but still very slow. You ask him about any way to speed things up.
"Why haven't you adjusted the lambda function yet? Isn't that sum very slow to converge to 1?"
Oh yeah!!! Other infinite sums that converge to 1!
You change the lambda function.`,
    story7Title: `Insight`,
    story7:
`Changing the equation again seems to have helped a lot.
You are satisfied with your work and think that you have done your due diligence with showing this conjecture to be true...
The Professor comes up to you and scoffs.
"Do you really think that you have proven anything yet?
You'll need bigger numbers than that to really show that it's true.
You remember what it took for me to prove my equation?"
You smile at them and nod... and continue to push.
Maybe you can add more stuff to make it go faster...`,
    story8Title: `More of the Same`,
    story8:
`You're losing faith in what you have so far...
You think back to when your colleague visited you the first time.
Will 3/4 work better than 2/3?`,
    story9Title: `Full Throttle`,
    story9:
`You feel as though g(x) needs something stronger than anything you have given it before.
Every other g(x) you have used has run out of steam and is slowing to a crawl.
What is a really good equation that gets very big, very fast?...
e^x!!!
Of course, it was staring you in the face the whole time.
The professor was right earlier on! Why not use his own equation!`,
    story10Title: `EZ Tau Gains Bois!!`,
    story10:
`Well, you feel as though there aren't any more changes to make.
The Professor comes by once more.
"Ah, that should do it.
I see you used my own equation to push things along.
What do you think it will be now?"
You respond with a smile on your face.
I think we will just have to wait and see.`,
    story11Title: `Closure`,
    story11:
`You and the Professor are at a conference where you are giving a speech on the equation.
Everyone is impressed by how far you got with brute force.
Some think you won't be able to get much farther.
Yet, you keep pushing.

Thank you all for playing this theory so far.
I had a blast making it and I'm so grateful to Gen and XLII for helping me!
There is still more τ to gain! Grind on!!
-Snaeky`
  },
  de: {
    gxPopupTitle: `g(x) Meilensteine`,
    gxPopupWarning1: `Kaufen oder Verkaufen dieses Meilensteines setz $q$ zurück.`,
    gxPopupWarning2: `Sind sie sich sicher dass dies wert ist?`,
    gxPopupYes: `Ja`,
    gxPopupNo: `Nein`,
    gxPermaDesc: `Schalte g(x) Meilensteinlevel {0} frei`,
    gxPermaInfo: `Schalte den g(x) Meilensteinlevel {0} frei`,
    lambdaPermaDesc: `Schalte $\\lambda$ Meilensteinlevel {0} frei`,
    lambdaPermaInfo: `Schalte den $\\lambda$ Meilensteinlevel {0} frei`,
    integralMilestoneDesc: `Verändere $q/\\pi$ zu $\\int_0^{q/\\pi}{g(x)dx}$`,
    integralMilestoneInfo: `Schalte den Fraktionalintegral frei`,
    gxMilestoneDesc1: `Nähere $\\sin(x)$ zu 3 Terme`,
    gxMilestoneDesc2: `Nähere $\\log_{10}(1+x)$ zu 5 Terme`,
    gxMilestoneDesc3:
`Nähere $e^{x}$ zu 6 Terme
Entferne $/\\pi$ im dem Integrallimit`,
    gxMilestoneInfo1: `Verändere $g(x)$ zu $x-\\frac{x^3}{3!}+\\frac{x^5}{5!}$`,
    gxMilestoneInfo2: `Verändere $g(x)$ zu $(x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\frac{x^4}{4}+\\frac{x^5}{5})/\\ln(10)$`,
    gxMilestoneInfo3: `Verändere $g(x)$ zu $1+x+\\frac{x^2}{2!}+\\frac{x^3}{3!}+\\frac{x^4}{4!}+\\frac{x^5}{5!}$ & $q/\\pi \\to q$`,
    lambdaMilestone1: `Verbessere die $\\lambda$ Fraktion zu $2/3^{i}$`,
    lambdaMilestone2: `Verbessere die $\\lambda$ Fraktion zu $3/4^{i}$`,
    story1Title: `Eine Idee`,
    story1:
`Beim Studium einiger Integrationstechniken denken Sie darüber nach, was es bedeuten würde, eine partielle Ableitung oder ein Integral zu haben...
Sie erinnern sich an Ihren Freund, einen Professor, der sich mit Differential- und Integralrechnung beschäftigt hat, und fragen ihn, was er davon hält.
Sie sagten: „Oh, ich glaube, ich habe vor langer Zeit etwas über ‚Riemann-Liouville-Fraktionalableitungen‘ in einem Lehrbuch gesehen.“
Sie wissen nicht, ob es wirklich funktioniert, möchten es aber irgendwie testen.
Sie möchten klein anfangen und es von Grund auf testen. Die Gleichung, die Sie aufstellen, lautet wie folgt.`,
    story2Title: `Die Implementation`,
    story2:
`Wenn sich Ihr ρ-Wachstum zu verlangsamen beginnt, setzen Sie sich hin und denken nach. Das ist nur die Basis und Sie wissen, dass es gut funktioniert, aber Sie beginnen sich zu fragen, wie gut dieses Gedankenexperiment sein kann.
Vielleicht funktioniert es gut, die gleiche Idee direkt auf ρ anzuwenden.
Sie versuchen, das „Fraktionalintegral“ in die ρ-Gleichung einzufügen, um zu sehen, was dabei herauskommt...`,
    story3Title: `Die Unvermeindlichkeit`,
    story3:
`Die Änderung hat geholfen, aber sie reicht immer noch nicht aus, um die Theorie auch nur annähernd zu beweisen.
Sie schauen sich die Gleichung an. Sie wussten von Anfang an, dass Sie Lambda auf irgendeine Weise anpassen müssen, um überprüfen zu können, ob dieses „Integral“ wirklich mit tatsächlichen Integralen zusammenhängt.
Es ist endlich an der Zeit, Lambda näher an 1 heranzuführen.`,
    story4Title: `Vorwärts Gehen`,
    story4:
`Wow, Sie haben nicht damit gerechnet, dass es so gut funktioniert!
Aber Sie denken, es geht schneller!
Sie fügen eine neue Variable hinzu, um die Arbeit zu beschleunigen.`,
    story5Title: `Konvergenz zur Wahrheit`,
    story5:
`Die m und n Verbesserungen laufen gut, aber Sie werden langsam ungeduldig.
Es dauert zu lange, um wirklich etwas Konkretes zu zeigen.
Sicher, ρ nimmt zu, aber das reicht nicht aus, um wirklich zu zeigen, dass dieses seltsam aussehende „partielle“ Integral zum tatsächlichen Integral konvergiert...
Vielleicht beschleunigt die Änderung von g(x) die Sache!`,
    story6Title: `Eine Lambmarkentdeckung`,
    story6:
`Der Professor kommt zu Ihnen und fragt, wie es läuft.
Sie teilen ihnen mit, dass die Dinge gut laufen, aber immer noch sehr langsam. Sie fragen ihn nach einer Möglichkeit, die Dinge zu beschleunigen.
„Warum haben Sie die Lambda-Funktion noch nicht angepasst? Konvergiert diese Summe nicht sehr langsam gegen 1?“
Oh ja!!! Andere unendliche Summen, die gegen 1 konvergieren!
Sie ändern die Lambda-Funktion.`,
    story7Title: `Einblick`,
    story7:
`Eine erneute Änderung der Gleichung scheint sehr geholfen zu haben.
Sie sind mit Ihrer Arbeit zufrieden und denken, dass Sie Ihre gebührende Sorgfalt walten lassen haben, um zu beweisen, dass diese Vermutung wahr ist...
Der Professor kommt auf Sie zu und spottet.
„Glaubst du wirklich, dass du schon etwas bewiesen hast?
Sie benötigen größere Zahlen, um wirklich zu zeigen, dass es wahr ist.
Erinnern Sie sich, was ich brauchte, um meine Gleichung zu beweisen?“
Du lächelst sie an und nickst... und gehst weiter.
Vielleicht können Sie noch mehr Dinge hinzufügen, damit es schneller geht...`,
    story8Title: `Mehr Davon`,
    story8:
`Du verlierst den Glauben an das, was du bisher hast...
Sie denken an den ersten Besuch Ihres Kollegen zurück.
Funktioniert 3/4 besser als 2/3?`,
    story9Title: `Vollgas`,
    story9:
`Sie haben das Gefühl, dass g(x) etwas Stärkeres braucht als alles, was Sie ihm zuvor gegeben haben.
Jedes zweite g(x), das Sie verwendet haben, hat keine Kraft mehr und wird langsamer.
Was ist eine wirklich gute Gleichung, die sehr schnell sehr groß wird?...
e^x!!!
Natürlich hat es dich die ganze Zeit direkt ins Gesicht gestarrt.
Der Professor hatte vorhin recht! Warum nicht seine eigene Gleichung verwenden!`,
    story10Title: `Einfache Tau einnahmen, Kollegen!!`,
    story10:
`Nun, Sie haben das Gefühl, dass es keine weiteren Änderungen mehr gibt.
Der Professor kommt noch einmal vorbei.
„Ah, das sollte reichen.
Wie ich sehe, haben Sie meine eigene Gleichung verwendet, um die Dinge voranzutreiben.
Was glaubst du, wird es jetzt sein?"
Sie antworten mit einem Lächeln im Gesicht.
Ich denke, wir müssen einfach abwarten und sehen.`,
    story11Title: `Schließung`,
    story11:
`Sie und der Professor sind auf einer Konferenz, auf der Sie eine Rede über die Gleichung halten.
Jeder ist beeindruckt, wie weit Sie mit roher Gewalt gekommen sind.
Manche glauben, dass man nicht mehr viel weiter kommen wird.
Dennoch machen Sie weiter Druck.

Vielen Dank an alle, die diese Theorie bisher gespielt haben.
Es hat mir viel Spaß gemacht, es zu machen, und ich bin Gen und XLII so dankbar, dass sie mir geholfen haben!
Es gibt noch mehr τ zu gewinnen! Mach weiter!!
-Snaeky`
  },
  fr: {
    gxPopupTitle: `Amélioration de g(x)`,
    gxPopupWarning1: `Acheter ou rembourser cette amélioration va réinitialiser $q$.`,
    gxPopupWarning2: `Voulez-vous continuer ?`,
    gxPopupYes: `Oui`,
    gxPopupNo: `Non`,
    gxPermaDesc: `Débloquer le niveau {0} de l'amélioration de g(x)`,
    gxPermaInfo: `Débloque le niveau {0} de l'amélioration de g(x)`,
    lambdaPermaDesc: `Débloquer le niveau {0} de l'amélioration de $\\lambda$`,
    lambdaPermaInfo: `Débloque le niveau {0} de l'amélioration de $\\lambda$`,
    integralMilestoneDesc: `Change $q/\\pi$ à $\\int_0^{q/\\pi}{g(x)dx}$`,
    integralMilestoneInfo: `Débloque l'intégrale fractionnelle`,
    gxMilestoneDesc1: `Approxime $\\sin(x)$ à 3 termes`,
    gxMilestoneDesc2: `Approxime $\\log_{10}(1+x)$ à 5 termes`,
    gxMilestoneDesc3:
`Approxime $e^{x}$ à 6 termes et
retire $/\\pi$ dans la limite de l'intégrale`,
    gxMilestoneInfo1: `Change g(x) à $x-\\frac{x^3}{3!}+\\frac{x^5}{5!}$`,
    gxMilestoneInfo2: `Change g(x) à $(x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\frac{x^4}{4}+\\frac{x^5}{5})/\\ln(10)$`,
    gxMilestoneInfo3: `Change g(x) à $1+x+\\frac{x^2}{2!}+\\frac{x^3}{3!}+\\frac{x^4}{4!}+\\frac{x^5}{5!}$ & $q/\\pi \\to q$`,
    lambdaMilestone1: `Améliore la fraction de $\\lambda$ à $2/3^{i}$`,
    lambdaMilestone2: `Améliore la fraction de $\\lambda$ à $3/4^{i}$`,
    story1Title: `Une Idée`,
    story1:
`En étudiant des techniques d'intégration, vous réfléchissez à ce que ça signifie d'avoir une dérivée ou intégrale partielle...
Vous vous souvenez d'un ami, un professeur qui a travaillé sur le calcul différentiel et intégral, et lui demandez ce qu'il en pense.
Il dit, "Oh, je crois que j'ai vu quelque chose sur les 'Dérivées Fractionnelles de Riemann-Liouville' dans un manuel il y a longtemps."
Vous voulez partir de quelque chose de basique et tester de bas en haut. L'équation que vous faites est la suivante.`,
    story2Title: `L'Implémentation`,
    story2:
`Alors que la croissance de ρ commence à ralentir, vous faites une pause et réfléchissez.
C'est juste la base et vous savez qu'elle fonctionne bien, mais vous commencez à songer à quel point cette expérience de pensée peut être intéressante.
Peut-être qu'appliquer la même idée pour ρ directement fonctionnera bien.
Vous essayez d'ajouter "l'intégrale fractionnelle" dans l'équation de ρ pour voir ce qu'il en ressort...`,
    story3Title: `L'Inévitable`,
    story3:
`Le changement a aidé, mais ce n'est pas assez pour se rapprocher de la preuve de la théorie.
Vous jetez un coup d'oeil à l'équation.
Vous saviez depuis le début que vous deviez ajuster lambda d'une façon ou d'une autre pour pouvoir vérifier si cette 'intégrale' était réellement liée aux véritables intégrales.
C'est enfin le moment de faire tendre lambda vers 1.`,
    story4Title: `Ça Avance`,
    story4:
`Waouh, vous n'aviez pas anticipé que ça fonctionne aussi bien !
Mais, vous pensez qu'elle peut aller plus vite !
Vous ajoutez une nouvelle variable pour accélérer les choses.`,
    story5Title: `Converger vers la Vérité`,
    story5:
`Les variables m et n font bien le travail, mais vous devenez impatient.
Cela prend trop de temps pour prouver quelque chose de concret.
Certes, ρ augmente, mais ce n'est pas assez pour réellement montrer que cette intégrale "partielle" bizarre converge vers la véritable intégrale...
Peut-être que changer g(x) va accélérer les choses !`,
    story6Title: `Une Découverte Lambda`,
    story6:
`Le professeur vous approche et demande comment les choses se passent.
Vous l'informez qu'elles se passent bien, mais toujours très lentement. Vous lui demandez comment accélérer les choses.
"Pourquoi n'avez vous pas encore ajusté la fonction lambda ? Cette somme n'est-elle pas très lente à converger vers 1 ?"
Ah oui !!! D'autres sommes infinies qui convergent vers 1 !
Vous changez la fonction lambda.`,
    story7Title: `Aperçu`,
    story7:
`Avoir encore changé l'équation semble avoir beaucoup aidé.
Vous êtes satisfait de votre travail et pensez avoir diligemment fait le nécessaire pour prouver la véracité de cette conjecture...
Le professeur vous approche et se rit de vous.
"Pensez-vous vraiment avoir déjà prouvé quoi que ce soit ?
Vous aurez besoin de nombres plus grand que ça pour vraiment prouver que c'est vrai.
Vous vous souvenez de ce que j'ai dû faire pour prouver mon équation ?"
Vous lui souriez et hochez la tête... et continuez de pousser.
Peut-être que vous pouvez ajouter d'autre choses pour la faire aller plus vite...`,
    story8Title: `Toujours les Mêmes`,
    story8:
`Vous perdez la foi en ce que vous avez jusque là...
Vous pensez à la fois où votre collègue vous a rendu visite pour la première fois.
Est-ce que 3/4 fonctionnerait mieux que 2/3 ?`,
    story9Title: `Plein Gaz`,
    story9:
`Vous avez l'impression que g(x) a besoin de quelque chose de plus fort que tout ce que vous lui aviez donné auparavant.
Toutes les autres g(x) que vous avez utilisées sont à court d'énergie et ralentissent considérablement.
Qu'est-ce qu'une très bonne équation qui devient très grande, très vite ?...
e^x !!!
Bien sûr, elle pendait devant votre nez tout ce temps.
Le professeur avait raison ! Pourquoi ne pas utiliser sa propre équation !`,
    story10Title: `Des Gains de Tau Faciles, les Gars !!!`,
    story10:
`Bien, vous avez l'impression qu'il n'y a plus de changements à faire.
Le professeur vous rend visite une nouvelle fois.
"Ah, ça devrait faire l'affaire.
Je vois que vous avez utilisé ma propre équation pour pousser les choses.
Qu'est-ce que vous pensez que ça va devenir maintenant ?"
Vous répondez par un sourire.
Je pense qu'on doit juste attendre et observer.`,
    story11Title: `Clôture`,
    story11:
`Vous et le professeur êtes à une conférence où vous donnez un discours sur l'équation.
Tout le monde est impressionné en voyant à quel point vous êtes allé loin.
Certains pensent que vous ne pouvez pas aller beaucoup plus loin.
Pourtant, vous continuez de pousser.

Merci d'avoir joué à cette théorie jusqu'à présent.
Je me suis éclaté à la faire et je suis si reconnaissant envers Gen et XLII pour m'avoir aidé !
Il y a encore plus de τ à gagner ! Continuez !!
- Snaeky`
  },
  ja: {
    gxPopupTitle: `g(x)マイルストーン`,
    gxPopupWarning1: `このマイルストーンを購入または払い戻しすると、$q$ がリセットされます。`,
    gxPopupWarning2: `続行しますか？`,
    gxPopupYes: `はい`,
    gxPopupNo: `いいえ`,
    gxPermaDesc: `レベル{0}のg(x)マイルストーン解放`,
    gxPermaInfo: `レベル{0}のg(x)マイルストーンを解放する`,
    lambdaPermaDesc: `レベル{0}の$\\lambda$マイルストーン解放`,
    lambdaPermaInfo: `レベル{0}の$\\lambda$マイルストーンを解放する`,
    integralMilestoneDesc: `$q/\\pi$を$\\int_0^{q/\\pi}{g(x)dx}$へ変更`,
    integralMilestoneInfo: `分数積分を解放`,
    gxMilestoneDesc1: `$\\sin(x)$を3項まで近似する`,
    gxMilestoneDesc2: `$\\log_{10}(1+x)$を5項まで近似`,
    gxMilestoneDesc3: `$e^{x}を6項まで近似し、積分範囲の上限} \\pi \\text{を\\\\削除する / } $`,
    gxMilestoneInfo1: `g(x)を$x-\\frac{x^3}{3!}+\\frac{x^5}{5!}$へ変更する`,
    gxMilestoneInfo2: `g(x)を$(x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\frac{x^4}{4}+\\frac{x^5}{5})/\\ln(10)$へ変更する`,
    gxMilestoneInfo3: `$\\text{g(x)の} 1+x+\\frac{x^2}{2!}+\\frac{x^3}{3!}+\\frac{x^4}{4!}+\\frac{x^5}{5!} \\text{と} q/\\pi \\to q$`,
    lambdaMilestone1: `$\\lambda$の分数式を$2/3^{i}$へ変更`,
    lambdaMilestone2: `$\\lambda$の分数式を$3/4^{i}$へ変更`,
    story1Title: `一つのアイデア`,
    story1:
`積分のいくつかの手法を勉強しているうちに、偏微分などの部分的な積分があるとしたら、それは一体どんなものなのだろうかと考えるようになった。
そこで、微分積分学の研究をしていた友人の教授を思い出し、どう思うか聞いてみた。
教授は「うーん、随分と昔に教科書で「リーマン・リウヴィルの分数階微分」みたいなものを見た気がするな。」と言った。
本当にうまくいくかは分からないが、何かしら試してみたくなった。
まずは小さなところから、基礎から積み上げる形で試したい。そこで作った式がこれだ。`,
    story2Title: `実装`,
    story2:
`ρの増加が鈍くなりはじめると、あなたは腰を下ろして考えこむ。これはあくまで土台であり、ちゃんと動くことは分かっている。けれど、この思考実験がどれだけ通用するのか、だんだん気になってきた。
もしかすると、同じアイデアをρそのものに直接適用すれば、うまくいくかもしれない。
「分数階積分」をρの式に組みこんでみて、何が起きるか見てみることにした。`,
    story3Title: `必然性`,
    story3:
`変更は効いたが、理論を証明できそうなところにはまだ全然届かない。
あなたは式を見直す。最初から分かっていたことだが、この「積分」が本当に通常の積分と関係しているのか確かめるには、λを何らかの形で調整する必要がある。
ついにλを1に近づける段階だ。`,
    story4Title: `もっと前へ`,
    story4:
`おお、ここまで上手くいくとは！
でも、もっと速くできる気がする！
そこで、もっと速くするために新しい変数を追加した。`,
    story5Title: `真実への収束`,
    story5:
`mとnのアップグレードは順調だが、あなたはだんだんじれったくなってきた。
具体的な何かを示すには、時間がかかりすぎる。
確かにρは増えている。でも、この妙な「部分的」積分が本物の積分に収束することを示すには、まだ足りない。
g(x)を変えれば、もっと速くなるかも！`,
    story6Title: `画期的な発見`,
    story6:
`教授が様子を見に来て、進捗を尋ねてきた。
あなたは「順調だけど、まだぜんぜん遅い」と伝え、どうすれば速くできるかを尋ねた。
「なぜλ関数をまだ調整していないんだ？
それの和、1 に収束するまですごく遅いだろ？」
確かに！！！ 1 に収束する無限和は他にもある！！！！
そうしてあなたはλ関数を変更した。`,
    story7Title: `洞察`,
    story7:
`また式を変えたことで、かなり効いたようだ。
あなたはここまでの仕事に満足し、この予想が正しいことを示すために、十分やるべきことはやっただろうと思った。
ところが教授は近づいてきて鼻で笑う。
「本当に、これで何かを証明したつもりか？
それが本当だと示すには、もっと桁がいる。
私が自分の式を証明するのに、どれだけ必要だったか覚えてるか？」
あなたは笑顔でうなずき、さらに押し進める。
もっと加速できる要素を足せるかもしれない。`,
    story8Title: `同じことのくり返し`,
    story8:
`ここまでの成果に、自信が揺らいできた。
同期が初めて訪ねてきたときのことを思い出す。
2/3より3/4のほうが、うまくいくだろうか？`,
    story9Title: `フルスロットル`,
    story9:
`g(x)にはこれまで与えてきたものより強い何かが必要だと感じる。
これまで使ったどのg(x)も、やがて失速して、のろのろになってしまった。
「とにかく巨大になって、とにかく速い」式って何だろう？
e^x！！！
もちろんだ。最初からずっと目の前にあったじゃないか。`,
    story10Title: `楽にτを稼げるぞ！！`,
    story10:
`もうこれ以上変えるところは無い気がする。
教授がもう一度やって来る。
「よし、これで十分だろう。
君が私の式を使って進めたのも分かる。
さて、次はどうなると思う？」
あなたは笑顔で答える。
「それは見てのお楽しみ、ですね。」`,
    story11Title: `閉鎖`,
    story11:
`あなたと教授は、学会でこの式について講演している。
力技でここまで押し上げたことに誰もが驚いている。
「これ以上はあまり伸びないだろう」と思う人もいる。
それでも、あなたは押し進める。

ここまでこの理論を遊んでくれて、みんな本当にありがとう。
作るのもすごく楽しかったし、手伝ってくれたGenとXLIIには感謝してもしきれない！
まだまだ τ は稼げるぞ！ どんどんいけ！！
-Snaeky`
  },
  ru: {
    gxPopupTitle: `Улучшение g(x)`,
    gxPopupWarning1: `Покупка или переназначение этого улучшения обнулит $q$.`,
    gxPopupWarning2: `Вы хотите продолжить?`,
    gxPopupYes: `Да`,
    gxPopupNo: `Нет`,
    gxPermaDesc: `Разблокировать {0} уровень улучшения g(x)`,
    gxPermaInfo: `Разблокирует {0} уровень улучшения g(x)`,
    lambdaPermaDesc: `Разблокировать {0} уровень улучшения $\\lambda$`,
    lambdaPermaInfo: `Разблокирует {0} уровень улучшения $\\lambda$`,
    integralMilestoneDesc: `Заменить $q/\\pi$ на $\\int_0^{q/\\pi}{g(x)dx}$`,
    integralMilestoneInfo: `Разблокировать дробный интеграл`,
    gxMilestoneDesc1: `Приблизить $\\sin(x)$ с помощью 3 членов`,
    gxMilestoneDesc2: `Приблизить $\\log_{10}(1+x)$ с помощью 5 членов`,
    gxMilestoneDesc3:
`Приблизить $e^{x}$ с помощью 6 членов и
убрать $/\\pi$ из предела интегрирования`,
    gxMilestoneInfo1: `Заменить g(x) на $x-\\frac{x^3}{3!}+\\frac{x^5}{5!}$`,
    gxMilestoneInfo2: `Заменить g(x) на $(x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\frac{x^4}{4}+\\frac{x^5}{5})/\\ln(10)$`,
    gxMilestoneInfo3: `Заменить g(x) на $1+x+\\frac{x^2}{2!}+\\frac{x^3}{3!}+\\frac{x^4}{4!}+\\frac{x^5}{5!}$ \\и $q/\\pi \\to q$`,
    lambdaMilestone1: `Улучшить уравнение $\\lambda$ до $2/3^{i}$`,
    lambdaMilestone2: `Улучшить уравнение $\\lambda$ до $3/4^{i}$`,
    story1Title: `Идея`,
    story1:
`При изучении техник интегрирования Вы задумываетесь о том, как можно было бы получить частичную произодную или интеграл...
Вы вспоминаете о своём друге — профессоре, работавшем над дифференциальным и интегральным исчислением, и спрашиваете, что он думает об этом.
Он говорит: "Мне кажется, я видел что-то о дробных производных Римана-Лиувилля давным-давно в каком-то учебнике."
Вы не знаете, действительно ли это работает, но хотите это как-то проверить.
Вы хотите начать с чего-то малого и проверить все с самых низов. Уравнение, которое Вы составили, выглядит так.`,
    story2Title: `Реализация`,
    story2:
`Когда рост ρ начинает замедляться, Вы садитесь и задумываетесь. Это просто основа и Вы знаете, что она работает хорошо, но Вы начинаете интересоваться, насколько хорош может быть этот мысленный эксперимент.
Возможно, применение этой же идеи для ρ напрямую сработает лучше.
Вы пытаетесь добавить "дробный интеграл" в уравнение ρ и посмотреть, что из этого выйдет...`,
    story3Title: `Неизбежность`,
    story3:
`Изменение помогло, но этого всё ещё недостаточно, чтобы даже приблизиться к доказательству теории.
Вы бросаете взгляд на уравнение. Вы с самого начала знали, что нужно было каким-то образом изменить лямбду так, чтобы можно было проверить, относится ли как-то этот "интеграл" к настоящим интегралам.
Настало время приблизить лямбду к 1.`,
    story4Title: `Продвижение вперёд`,
    story4:
`Вау, Вы не ожидали, что это сработает настолько хорошо!
Но Вы думаете, что можно ещё быстрее!
Вы добавляете новую переменную для ускорения прогресса.`,
    story5Title: `Сближение с истиной`,
    story5:
`Улучшения m и n справляются хорошо, но Вы нетерпеливы.
Времени, чтобы показать что-то конкретное, уходит слишком много.
Да, ρ увеличивается, но этого недостачно, чтобы показать, что этот странный на вид "частичный" интеграл сходится к настоящему интегралу...
Возможно, замена g(x) ускорит процесс!`,
    story6Title: `Знаменательное открытие`,
    story6:
`К Вам подходит профессор и спрашивает, как всё продвигается.
Вы сообщаете, что прогресс хороший, но всё ещё очень медленный. Вы спрашиваете его, есть ли способ ускорить теорию.
"Почему Вы до сих пор не заменили функцию лямбды?
Этот ряд очень медленно сходится к 1, не так ли?"
Ну конечно!!! Другие бесконечные ряды, которые тоже сходятся к 1!
Вы заменяете функцию лямбды.`,
    story7Title: `Прозрение`,
    story7:
`Замена уравнения снова помогла прогрессу.
Вы удовлетворены своей работой и думаете, что вы приложили все усилия, чтобы доказать, что эта гипотеза верна...
Профессор подходит к Вам и начинает смеяться.
"Вы реально полагаете, что доказали что-то?
Чтобы показать, что теория верна, Вам потребуются числа побольше.
Помните, чего мне стоило доказать моё уравнение?"
Вы улыбаетесь, киваете... и продолжаете работу.
Возможно, Вам удастся добавить больше вещей, чтобы рост стал быстрее...`,
    story8Title: `Опять то же самое`,
    story8:
`Вы теряете веру в то, что у Вас уже есть...
Вы вспоминаете тот раз, когда Ваш коллега впервые посетил Вас.
Будет ли 3/4 работать лучше, чем 2/3?`,
    story9Title: `Полный вперёд`,
    story9:
`Вам кажется, что g(x) требует чего-то более сильного, чем что-либо до этого.
Каждая g(x) до этого выдыхалась и замедляла свой ход.
Какое хорошее уравнение, которое очень быстро становится очень большим, можно подобрать?...
e^x!!!
Конечно же, оно всё это время было у Вас под носом.
Профессор был прав до этого! Почему бы не использовать его уравнение!`,
    story10Title: `Тау растёт, пацаны!!`,
    story10:
`Итак, Вам кажется,что никаких изменений больше не сделать.
Профессор заходит ещё раз.
"А, это должно помочь.
Я вижу, что Вы использовали моё уравнение, чтобы подтолкнуть события.
Как вы думаете, что будет дальше?"
Вы отвечаете с улыбкой на лице.
Полагаю, остаётся только ждать.`,
    story11Title: `Завершение`,
    story11:
`Вы и профессор произносите речь об уравнении на конференции.
Все впечатлены тем, как далеко Вы смогли продвинуться при помощи перебора.
Некоторые думают, что Вам уже не удастся продвинуться дальше.
Тем не менее, Вы продолжаете прогресс.

Спасибо всем за то, что играли в эту теорию до сих пор.
Я получил огромное удовольствие от её создания и очень благодарен Gen и XLII за помощь!
Вам ещё предстоит набрать много τ! Продолжайте!!
-Snaeky`
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
  title: getLoc("gxPopupTitle"),
  content: ui.createStackLayout({
    children: [
      ui.createLatexLabel({
        text: getLoc("gxPopupWarning1"),
        horizontalOptions: LayoutOptions.CENTER,
        horizontalTextAlignment: TextAlignment.CENTER,
        margin: new Thickness(0, 10, 0, 0),
      }),
      ui.createLatexLabel({
        text: getLoc("gxPopupWarning2"),
        horizontalOptions: LayoutOptions.CENTER,
        horizontalTextAlignment: TextAlignment.CENTER,
        margin: new Thickness(0, 15, 0, 15),
      }),
      ui.createStackLayout({
        orientation: StackOrientation.HORIZONTAL,
        children: [
          ui.createButton({
            horizontalOptions: LayoutOptions.FILL_AND_EXPAND,
            text: getLoc("gxPopupYes"),
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
            text: getLoc("gxPopupNo"),
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
    perm1.getDescription = (amount) => Localization.format(getLoc(`gxPermaDesc`), Math.min(perm1.level + 1, 3));
    perm1.getInfo = (amount) => Localization.format(getLoc(`gxPermaInfo`), Math.min(perm1.level + 1, 3));
    perm1.boughtOrRefunded = (_) => {
      updateAvailability();
    };
    perm1.maxLevel = 3;
  }

  {
    perm2 = theory.createPermanentUpgrade(4, currency, new ExponentialCost(BigNumber.TEN.pow(350), BigNumber.TEN.pow(400).log2()));
    perm2.getDescription = (amount) => Localization.format(getLoc(`lambdaPermaDesc`), Math.min(perm1.level + 1, 2));
    perm2.getInfo = (amount) => Localization.format(getLoc(`lambdaPermaInfo`), Math.min(perm1.level + 1, 2));
    perm2.boughtOrRefunded = (_) => updateAvailability();
    perm2.maxLevel = 2;
  }

  /////////////////////
  // Checkpoint Upgrades
  theory.setMilestoneCost(new CustomCost((total) => BigNumber.from(tauMultiplier*getMilCustomCost(total))));

  {
    intUnlock = theory.createMilestoneUpgrade(0, 1);
    intUnlock.getDescription = (_) => {
      return getLoc(`integralMilestoneDesc`);
    };
    intUnlock.getInfo = (_) => {
      return getLoc(`integralMilestoneInfo`);
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
        return getLoc(`gxMilestoneDesc1`);
      } else if (gxUpg.level == 1 || gxUpg.maxLevel < 3) {
        return getLoc(`gxMilestoneDesc2`);
      }
      return getLoc(`gxMilestoneDesc3`);
    };
    gxUpg.getInfo = (_) => {
      if (gxUpg.level == 0 || gxUpg.maxLevel < 2) {
        return getLoc(`gxMilestoneInfo1`);
      } else if (gxUpg.level == 1 || gxUpg.maxLevel < 3) {
        return getLoc(`gxMilestoneInfo2`);
      }
      return getLoc(`gxMilestoneInfo3`);
    };
    (gxUpg.bought = (boughtLevels) => gxMilestoneConfirm(boughtLevels)), (gxUpg.refunded = (refundedLevels) => gxMilestoneConfirm(-refundedLevels));
  }

  {
    baseUpg = theory.createMilestoneUpgrade(5, 2);
    baseUpg.getDescription = (_) => {
      if (baseUpg.level == 0 || baseUpg.maxLevel < 2) {
        return getLoc(`lambdaMilestone1`);
      }
      return getLoc(`lambdaMilestone2`);
    };
    baseUpg.getInfo = (_) => {
      if (baseUpg.level == 0 || baseUpg.maxLevel < 2) {
        return getLoc(`lambdaMilestone1`);
      }
      return getLoc(`lambdaMilestone2`);
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
  theory.createStoryChapter(0, getLoc(`story1Title`), getLoc(`story1`), () => currency.value >= 1);
  theory.createStoryChapter(1, getLoc(`story2Title`), getLoc(`story2`), () => intUnlock.level == 1);
  theory.createStoryChapter(2, getLoc(`story3Title`), getLoc(`story3`), () => kUnlock.level == 1);
  theory.createStoryChapter(3, getLoc(`story4Title`), getLoc(`story4`), () => UnlTerm.level > 0);
  theory.createStoryChapter(4, getLoc(`story5Title`), getLoc(`story5`), () => perm1.level == 1);
  theory.createStoryChapter(5, getLoc(`story6Title`), getLoc(`story6`), () => perm2.level == 1);
  theory.createStoryChapter(6, getLoc(`story7Title`), getLoc(`story7`), () => currency.value >= BigNumber.TEN.pow(500));
  theory.createStoryChapter(7, getLoc(`story8Title`), getLoc(`story8`), () => perm2.level == 2);
  theory.createStoryChapter(8, getLoc(`story9Title`), getLoc(`story9`), () => perm1.level == 3);
  theory.createStoryChapter(9, getLoc(`story10Title`), getLoc(`story10`), () => currency.value >= BigNumber.TEN.pow(1150));
  theory.createStoryChapter(10, getLoc(`story11Title`), getLoc(`story11`), () => currency.value >= BigNumber.TEN.pow(1250));

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

var getInternalState = () => `${t_cumulative.toBase64String()} 0 0 ${lambda_base.toBase64String()} ${q.toBase64String()} ${r.toBase64String()}`;

var setInternalState = (state) => {
  const bigNumberFromBase64OrParse = (value) => {
    let result;
    try { result = BigNumber.fromBase64String(value); } catch { result = parseBigNumber(value); };
    return result;
  }

  let values = state.split(" ");
  if (values.length > 0) t_cumulative = bigNumberFromBase64OrParse(values[0]);
  // update_divisor flag should handle computing those
  //if (values.length > 1) lambda_man = bigNumberFromBase64OrParse(values[1]);
  //if (values.length > 2) lambda_exp = bigNumberFromBase64OrParse(values[2]);
  if (values.length > 3) lambda_base = bigNumberFromBase64OrParse(values[3]);
  if (values.length > 4) q = bigNumberFromBase64OrParse(values[4]);
  if (values.length > 5) r = bigNumberFromBase64OrParse(values[5]);
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