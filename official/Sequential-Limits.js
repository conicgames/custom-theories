//uses code from davidcondrey on stack exchange, xelaroc (alexcord#6768) and Gilles-Philippe Paillé(#0778). 

import { ExponentialCost, FirstFreeCost, LinearCost, CustomCost } from "./api/Costs"; //make sure to use
import { Localization } from "./api/Localization";
import { parseBigNumber, BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "SequentialLimits"; //must be unique, make sure to change it 
var getName = (language) => { //display name
    const names = {
        en: `Sequential Limits`,
        fr: `Limites Séquentielles`,
        ja: `数列の極限`
    };
    return names[language] || names.en;
};
var getDescription = (language) => { //theory description. does not support LaTeX
    const descs = {
        en:
`You're the first student of the now-retired professor, and now that they've retired, you're given the mantle of chief researcher. Eager to dive into fields where your old professor dove off, you start looking into the concept explored in the seventh lemma - sequential limits - to further your career.

This theory explores the concept of approximations using a rearrangement of Stirling's Formula to approximate Euler's number.
The formula, named after James Stirling and first stated by Abraham De Moivre, states that ln(n!) can be approximated by the infinite sum ln(1) + ln(2) .... + ln(n).
Be careful - the closer your approximation of Euler's number is, the less your numerator grows!
A close balancing game, fun for the whole family (or at least, the ones who play Exponential Idle).

Special thanks to:

Gilles-Philippe, for development of the custom theory SDK, implementing features I requested, providing countless script examples, and help with my numerous questions and balancing.

Xelaroc/AlexCord, for answering my neverending questions, debugging and helping me understand how to balance a theory, and going above and beyond to teach me how custom theories work.

The Exponential Idle beta testing team
- The Exponential Idle translation team, who's work I added to, and without which this game wouldn't have the reach it does.

Enjoy!`,
        fr:
`Vous êtes le premier étudiant du professeur désormais à la retraite, et maintenant qu'il a pris sa retraite, vous avez été donné le titre de chercheur en chef. Désireux de plonger dans des domaines où votre ancien professeur a plongé, vous commencez à examiner le concept exploré dans le septième lemme - limites séquentielles - pour faire progresser votre carrière.

Cette théorie explore le concept d'approximations en utilisant un réarrangement de la formule de Stirling pour approcher le nombre d'Euler.
La formule, nommée d'après James Stirling et d'abord déclarée par Abraham De Moivre, stipule que ln(n!) peut être approché par la somme infinie ln(1) + ln(2) .... + ln(n).
Soyez prudent - plus votre approximation du nombre d'Euler est proche, moins votre numérateur grandit !
Un jeu d'équilibre serré, amusant pour toute la famille (ou du moins, ceux qui jouent à Exponential Idle).

Remerciements spéciaux à:

Gilles-Philippe, pour le développement du kit de développement de théorie personnalisée, la mise en œuvre des fonctionnalités que j'ai demandées, la fourniture d'innombrables exemples de scripts et l'aide avec mes nombreuses questions et l'équilibrage.

Xelaroc/AlexCord, pour avoir répondu à mes questions sans fin, déboguer et m'avoir aidé à comprendre comment équilibrer une théorie, et aller au-delà pour m'apprendre comment fonctionnent les théories personnalisées.

L'équipe de bêta test Exponential Idle
- L'équipe de traduction Exponential Idle, dont j'ai ajouté le travail, et sans laquelle ce jeu n'aurait pas la portée qu'il a.

Amusez-vous !`,
        ja:
`あなたは、今はもう引退した教授の最初の教え子。
そしてその教授が退いた今、主任研究者の座を託されることになった。
かつて恩師が切り拓いた分野へ、自分も踏み込んでいきたい――そんな思いから、あなたはLemma7で扱われた概念、「数列の極限」の研究に乗り出し、さらなる飛躍を目指す。

この理論では、スターリングの公式を変形することで、ネイピア数eを近似するという考え方を扱う。
この公式はジェームズ・スターリングの名を冠し、最初にアブラハム・ド・モアブルによって述べられたもので、ln(n!)はln(1) + ln(2) .... + ln(n)によって近似できる。
ただし注意――eの近似が真値に近づくほど、分子の伸びは鈍くなるぞ！
絶妙なバランス感覚が試される理論。家族みんなで楽しめます（少なくとも、Exponential Idleを遊ぶ人たちなら）。

スペシャルサンクス：

Gilles-Philippeには、カスタム理論SDKの開発、私の要望した機能の実装、数えきれないほどのスクリプト例の提供、そして多くの質問やバランス調整の相談に応じてくれたことに感謝します。

XelarocとAlexCordには、終わりのない私の質問に答え、デバッグを手伝い、さらには理論のバランス調整の考え方を教えてくれただけでなく、カスタム理論の仕組みそのものまで丁寧に教えてくれたことに感謝します。

Exponential Idleベータテストチーム
私もExponential Idle翻訳チームに加わりましたが、この存在がなければこのゲームがこんなにも広く届くことはなかったでしょう。

お楽しみください！`
    };
    return descs[language] || descs.en;
}
var authors = "ellipsis"; //display author in the "author" field
var version = 8; //version id, make sure to change it on update
var releaseOrder = "2";

requiresGameVersion("1.4.33");

const locStrings = {
    example: {
        achCat1: ``,
        achCat2: ``,
        achCat3: ``,
        achCat4: ``,
        ach1: ``,
        ach1Desc: ``,
        ach2: ``,
        ach2Desc: ``,
        ach3: ``,
        ach4: ``,
        ach5: ``,
        ach6: ``,
        ach7: ``,
        ach8: ``,
        ach9: ``,
        ach10: ``,
        ach11: ``,
        ach12: ``,
        ach13: ``,
        ach14: ``,
        ach15: ``,
        ach16: ``,
        ach17: ``,
        achPubDesc: `{0}`,
        achApproxDesc: `{0}`,
        sach1: ``,
        sach1Desc: ``,
        sach1Hint: ``,
        sach2: ``,
        sach2Desc: ``,
        sach2Hint: ``,
        sach3: ``,
        sach3Desc: ``,
        sach3Hint: ``,
        sach4: ``,
        sach4Desc: ``,
        sach4Hint: ``,
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
``
    },
    en: {
        achCat1: `Miscellaneous`,
        achCat2: `Publications`,
        achCat3: `Approximation`,
        achCat4: `Secret Achievements`,
        ach1: `Purchase Optimisation`,
        ach1Desc: `Outsource the actual buying of variables to your students.`,
        ach2: `Amateur Author`,
        ach2Desc: `Publish once.`,
        ach3: `Regular Reporter`,
        ach4: `Regular Scribbler`,
        ach5: `Studied Scribbler`,
        ach6: `Exemplary Essayist`,
        ach7: `Publication Professional`,
        ach8: `Close Enough`,
        ach9: `Nitpicking Exercise`,
        ach10: `Splitting Hairs`,
        ach11: `Microscopic`,
        ach12: `Subatomic`,
        ach13: `Planck Pettiness`,
        ach14: `Are We There Yet?`,
        ach15: `Precision Player`,
        ach16: `Running Out Of Room`,
        ach17: `You Can Stop Anytime`,
        achPubDesc: `Publish {0} times.`,
        achApproxDesc: `Get your approximation of e 10^-{0} off true`,
        sach1: `Pattern Fanatic`,
        sach1Desc: `Have every variable level the same.`,
        sach1Hint: `Palindromic`,
        sach2: `l33t5p34k`,
        sach2Desc: `1337.`,
        sach2Hint: `Elite`,
        sach3: `On Vacation`,
        sach3Desc: `Don't buy anything for an hour after a publication.`,
        sach3Hint: `Forgot something?`,
        sach4: `Futility`,
        sach4Desc: `Tap the equation 1000 times.`,
        sach4Hint: `Fatigued`,
        story1Title: `A New Beginning`,
        story1:
`You return from your old professor's retirement party, the mantle passed onto you, the first student, to head the department of students accrued over the years.
Excited to finally be listed as something other than 'et. al' on a paper, you continued with your existing research, but as progress slowed, you felt less and less satisfied.
The days turn into weeks, which blur together as more and more publications are written.
Eventually, a student comes to you with a dusty tome, featuring a as-of-yet unexplored theorem.
Feeling a stroke of inspiriation, you assemble a team of students and throw yourself into the research`,
        story2Title: `Taking Risks`,
        story2:
`You notice a few unassuming variables at the bottom of the equation.
A student warns you against changing them, citing the risk of decreasing the income existing values, but you forge ahead.`,
        story3Title: `International`,
        story3:
`You publish your first paper, with your name front and center.
Colleagues congratulate you, but you feel there is something missing, further exploration to be had.
You decide to forge ahead.`,
        story4Title: `Light Modification`,
        story4:
`With your progress starting to slow, you scour the original equation texts to find a remedy.
It turns out all along there's been some modifiers you can add, but at ever increasing costs.
You decide to buy one, hoping it alleviates your issues...`,
        story5Title: `Making Progress`,
        story5:
`You reach 1e100 ρ₁, a major milestone in your research.
Colleagues come to congratulate you on pushing your research so far, but you shrug them off - you feel as if there's more you could do.
You head back to your office and get to work once more`,
        story6Title: `The End.... Or Is It?`,
        story6:
`You finally purchased every modifier, to close out your research into this field.
Your students assigned to this project celebrate, anticipating closing out this line of research, and your name is posted in journals worldwide.

You decide to go over your numbers once more, just to make sure...`,
        story7Title: `Mathaholic`,
        story7:
`1e500.

A monumentally large number, but barely a blip to you now.
People are starting to take notice as you push mathematics to points thought unachieveable in this field.
There's a waiting list to study under you now.
Your friends and family are expressing concern, worried you're in too deep.
It doesn't matter.
Another breakthrough is close.
You can feel it.

Right?`,
        story8Title: `The End.`,
        story8:
`1e1000.

A number so big it'd be impossible to comprehend.
You did it. They said you couldn't.
Years after you first started, you reach an incredible end to your research.
You're featured on TIME, on daytime television, in worldwide newspapers. Your papers are framed, your students all professors in their own rights now.
You pass on the mantle to a younger student of yours to retire like your old professor, back all those years ago.

THE END.
Thanks for playing! - ellipsis`
    },
    fr: {
        achCat1: `Divers`,
        achCat2: `Publications`,
        achCat3: `Approximation`,
        achCat4: `Secrets`,
        ach1: `Optimisation d'achats`,
        ach1Desc: `Externalisez l'achat de variables à vos étudiants.`,
        ach2: `Auteur Amateur`,
        ach2Desc: `Publiez une fois.`,
        ach3: `Reporter Régulier`,
        ach4: `Griffonneur Régulier`,
        ach5: `Griffonneur Érudit`,
        ach6: `Essayiste Exemplaire`,
        ach7: `Professionnel de la Publication`,
        ach8: `Assez Proche`,
        ach9: `Exercice Chirurgical`,
        ach10: `À un Cheveu Près`,
        ach11: `Microscopique`,
        ach12: `Subatomique`,
        ach13: `Insignifiance de Planck`,
        ach14: `Sommes-nous Déjà Là ?`,
        ach15: `Joueur de Précision`,
        ach16: `À Court de Place`,
        ach17: `Vous Pouvez Vous Arrêter à Tout Moment`,
        achPubDesc: `Publiez {0} fois.`,
        achApproxDesc: `Approximez e à 10^-{0} près`,
        sach1: `Fanatique des Motifs`,
        sach1Desc: `Ayez chaque niveau de variable identique.`,
        sach1Hint: `Palindromique`,
        sach2: `l33t5p34k`,
        sach2Desc: `1337.`,
        sach2Hint: `Élite`,
        sach3: `En Vacances`,
        sach3Desc: `N'achetez rien pendant une heure après une publication.`,
        sach3Hint: `Avez-vous oublié quelque chose ?`,
        sach4: `Futilité`,
        sach4Desc: `Appuyez sur l'équation 1000 fois.`,
        sach4Hint: `Fatigué`,
        story1Title: `Un Nouveau Départ`,
        story1:
`Vous revenez du pot de départ de votre ancien professeur, le flambeau vous a été transmis, le premier étudiant, pour diriger le département des étudiants accumulés au fil des ans.
Excité d'être enfin mentionné comme autre chose que « et. al » sur un article, vous avez continué vos recherches existantes, mais à mesure que les progrès ralentissaient, vous vous êtes senti de moins en moins satisfait.
Les jours se transforment en semaines, qui s'estompent au fur et à mesure des publications écrites.
Finalement, un étudiant vient à vous avec un tome poussiéreux, comportant un théorème encore inexploré.
Ressentant un coup d'inspiration, vous rassemblez une équipe d'étudiants et vous vous lancez dans la recherche.`,
        story2Title: `Prendre des Risques`,
        story2:
`Vous remarquez quelques variables modestes en bas de l'équation.
Un étudiant vous met en garde contre le fait de les changer, invoquant le risque de diminuer les valeurs existantes du revenu, mais vous allez de l'avant.`,
        story3Title: `International`,
        story3:
`Vous publiez votre premier article, avec votre nom au premier plan.
Les collègues vous félicitent, mais vous sentez qu'il manque quelque chose, plus d'exploration à faire.
Vous décidez d'aller de l'avant.`,
        story4Title: `Légère Modification`,
        story4:
`Vos progrès commençant à ralentir, vous parcourez les textes originaux de l'équation pour trouver un remède.
Il s'avère que depuis le début, il y avait des modificateurs que vous pouvez ajouter, mais à des coûts toujours croissants.
Vous décidez d'en acheter un, en espérant que cela atténuera vos problèmes...`,
        story5Title: `Faire des Progrès`,
        story5:
`Vous atteignez 1e100 ρ₁, une étape majeure de votre recherche.
Les collègues viennent vous féliciter d'avoir poussé vos recherches jusqu'à présent, mais vous les ignorez - vous avez l'impression qu'il y a plus que vous pourriez faire.
Vous retournez à votre bureau et vous vous reprenez au travail.`,
        story6Title: `La Fin.... Ou Pas ?`,
        story6:
`Vous avez finalement acheté tous les modificateurs, pour clôturer vos recherches dans ce domaine.
Vos étudiants affectés à ce projet célèbrent, anticipant la clôture de cette ligne de recherche, et votre nom est affiché dans des revues du monde entier.

Vous décidez de passer en revue vos chiffres une fois de plus, juste pour vous assurer...`,
        story7Title: `Féru de Mathématiques`,
        story7:
`1e500.

Un nombre monumentalement important, mais à peine un détail pour vous maintenant.
Les gens commencent à remarquer que vous poussez les mathématiques à des points considérés comme irréalisables dans ce domaine.
Il y a une liste d'attente pour étudier sous votre aile maintenant.
Vos amis et votre famille expriment leur inquiétude, craignant que vous ne soyez trop aspiré.
Ce n'est pas grave.
Une autre percée est proche.
Vous pouvez le sentir.

N'est-ce pas ?`,
        story8Title: `La Fin.`,
        story8:
`1e1000.

Un nombre si grand qu'il serait impossible à comprendre.
Vous l'avez fait. Ils ont dit que vous ne pourriez pas.
Des années après avoir commencé, vous atteignez une fin incroyable à vos recherches.
Vous êtes présenté sur TIME, à la télévision, dans des journaux du monde entier. Vos papiers sont encadrés, vos étudiants sont tous des professeurs pour leur propre compte maintenant.
Vous passez le flambeau à un de vos jeunes étudiants pour prendre votre retraite comme votre ancien professeur, il y a toutes ces années.

FIN.
Merci d'avoir joué ! - ellipsis`
    },
    ja: {
        achCat1: `その他`,
        achCat2: `出版`,
        achCat3: `近似`,
        achCat4: `隠し実績`,
        ach1: `購入最適化`,
        ach1Desc: `変数の購入そのものは、学生たちに任せよう。`,
        ach2: `かけだしの著者`,
        ach2Desc: `出版を1回行う。`,
        ach3: `いつものレポーター`,
        ach4: `いつもの書き手`,
        ach5: `研鑽を積んだ書き手`,
        ach6: `模範的なエッセイスト`,
        ach7: `出版のプロ`,
        ach8: `だいたいあってる`,
        ach9: `粗探しの練習`,
        ach10: `重箱の隅をつつく`,
        ach11: `顕微鏡レベル`,
        ach12: `亜原子レベル`,
        ach13: `プランク級の細かさ`,
        ach14: `まだ着かないの？`,
        ach15: `繊細な人`,
        ach16: `もう余裕がない`,
        ach17: `いつでもやめられるよ`,
        achPubDesc: `出版を{0}回行う。`,
        achApproxDesc: `eの近似値の真値との差を10^-{0}まで縮める。`,
        sach1: `パターン狂`,
        sach1Desc: `すべての変数レベルを同じにする。`,
        sach1Hint: `回文`,
        sach2: `l33t5p34k`,
        sach2Desc: `1337.`,
        sach2Hint: `エリート`,
        sach3: `休暇中`,
        sach3Desc: `論文発表後、1時間何も購入しない。`,
        sach3Hint: `何か忘れてない？`,
        sach4: `徒労`,
        sach4Desc: `数式を1000回タップする。`,
        sach4Hint: `疲労困憊`,
        story1Title: `新たな始まり`,
        story1:
`恩師の退職パーティーから戻ったあなたに託されたのは、長年にわたって集った学生たちの学科を率いる役目だった。最初の教え子であるあなたが、その後継者となったのだ。
ようやく論文の著者欄で""et al.""以外の立場になれることに胸を躍らせながら、あなたはこれまでの研究を続けた。だが、進展が鈍るにつれ、満足感は少しずつ薄れていく。
日々は週へと変わり、次々と論文が書き上げられていった。
やがてある日、一人の学生が、まだ誰にも研究されていない定理が記された埃まみれの古書を持ってくる。
閃きを覚えたあなたは学生たちを集め、その研究へと身を投じる。`,
        story2Title: `リスクを取る`,
        story2:
`数式の下のほうに、目立たない変数がいくつかあることに気づく。
ある学生は、それをいじると既存の値から得られる収入が下がる危険があると警告する。
それでもあなたは、構わず先へ進む。`,
        story3Title: `世界へ`,
        story3:
`初めての論文を発表し、自分の名前が堂々と先頭に載る。
同僚たちは祝福してくれるが、あなたはどこか物足りなさを覚えていた。まだ踏み込める余地がある。
あなたは歩みを止めないことにする。`,
        story4Title: `ささやかな改変`,
        story4:
`進捗が鈍り始めたあなたは、解決策を求めて元の数式資料を徹底的に調べる。
すると、どうやら最初から追加できる修飾子が存在していたことがわかる。ただし、その代償は買うごとにどんどん重くなっていく。
問題が少しでも和らぐことを願い、あなたはひとつ購入することにした...。`,
        story5Title: `前進`,
        story5:
`研究の大きな節目となる1e100 ρ1に到達した。
同僚たちはここまで研究を進めたあなたを祝福するが、あなたはそれを軽く受け流す。まだやれることがある――そんな感覚が拭えない。
あなたは再び研究室へ戻り、仕事に取りかかる。`,
        story6Title: `終わり.... なのか？`,
        story6:
`ついに、研究に必要な修飾子をすべて購入し終えた。
このプロジェクトを担当していた学生たちは、この研究分野に区切りがつくことを喜び、あなたの名は世界中の学術誌に載る。

だが、あなたは最後にもう一度だけ数字を見直すことにした。念のために...。`,
        story7Title: `数学厨`,
        story7:
`1e500。

とてつもなく大きな数字。だが、今のあなたにとっては、もはやほんの小さな通過点にすぎない。
この分野で到達不可能だと思われていた領域にまで数学を押し広げるあなたに、人々は注目し始めている。
今や、あなたのもとで学びたい者たちの順番待ちができている。
友人や家族は、あなたが研究にのめり込みすぎているのではと心配している。
でも、そんなことはどうでもいい。
次の大きな突破口は、もうすぐそこだ。
そう感じる。

……だろ？`,
        story8Title: `終幕。`,
        story8:
`1e1000。

あまりにも大きすぎて、もはや想像することすらできない数。
あなたは成し遂げた。できるはずがないと言われながらも。
最初に研究を始めてから幾年もの時を経て、ついに驚異的な終着点へとたどり着く。
あなたはTIME誌に取り上げられ、昼のテレビ番組に出演し、世界中の新聞で報じられる。
あなたの論文は額装され、教え子たちは皆それぞれ教授となった。
そしてあなたもまた、かつての恩師のように引退するため、自分の若き教え子へその役目を引き継ぐ。

これで終わり。
プレイしてくれてありがとう！ — ellipsis`
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

var currency = theory.createCurrency(), currency2 = theory.createCurrency(), currency3 = theory.createCurrency(); //create three currency variables and list them as currencies
var a1, a2, b1, b2; //set a1, a2, b1, b2 levels
var numPublications = 0; //number of publications

var gamma0, gamma1, gamma2, gamma3; //create 4 variables that i'll use for milestones
var rho1dot = BigNumber.ZERO, rho2dot = BigNumber.ZERO, rho3dot = BigNumber.ZERO; //used as drho's
var inverseE_Gamma; //used for the approximation of e
var tapCount = 0;
var t = 0;

var init = () => {
    currency3.value = 1; //set rho3 to 1 to avoid a div by 0 error lol
    theory.primaryEquationHeight = 70; //set height of primary equation
    theory.secondaryEquationHeight = 35; //set height of second equation
    theory.secondaryEquationScale = 1.25; //makes the secondary eq look 25% bigger
    updateInverseE_Gamma();

    // Regular Upgrades   
    // DONT EVEN FUCKING THINK ABOUT IT. NO MORE BALANCE CHANGES 
    // a1
    {
        let getDesc = (level) => "a_1=" + geta1(level).toString(1); //returns the value seen in the description as a1 = <level>
        let getInfo = (level) => "a_1=" + geta1(level).toString(1); //returns the value seen in the info box as a1 = <level>
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
        let getDesc = (level) => "b_1=" + getb1(level).toString(1); //returns the value seen in the description as b1 = <level>
        let getInfo = (level) => "b_1=" + getb1(level).toString(1); //returns the value seen in the info box as b1 = <level>
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
    theory.createBuyAllUpgrade(1, currency, 1e15); //unlock buy all at 1e15 currency
    theory.createAutoBuyerUpgrade(2, currency, 1e20); //unlock autobuyer at 1e20 currency


    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(tauMultiplier*2.5, tauMultiplier*2.5)); //c = 25*x + 25, i.e rewards a milestone every 25 log10(tau)

    //milestone 1
    {
        gamma0 = theory.createMilestoneUpgrade(0, 3); //create an upgrade of ID 0 and max level 3
        gamma0.description = Localization.getUpgradeIncCustomExpDesc("\\rho_2", "0.02"); //set desc as localisation of "increases rho_2 exponent by 0.02"
        gamma0.info = Localization.getUpgradeIncCustomExpInfo("\\rho_2", "0.02"); //basically the same but for info button
        gamma0.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation(); //if bought/refunded, force a refresh of the equation
    }

    //milestone 2
    //TODO change it to a localisation of decreases lol
    {
        gamma1 = theory.createMilestoneUpgrade(1, 5); //create an upgrade of ID 1 and max level 5
        gamma1.description = Localization.getUpgradeDecCustomDesc("a_3","0.008"); //set desc as localisation of "decreases a3 by 0.008"
        gamma1.info = Localization.getUpgradeDecCustomInfo("a_3","0.008"); //basically the same but for info button
        gamma1.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation(); //if bought/refunded, force a refresh of the equation
    }
    
    //milestone 3
    {
        gamma2 = theory.createMilestoneUpgrade(2, 2); //create an upgrade of ID 2 and max level 2
        gamma2.description = Localization.getUpgradeIncCustomExpDesc("b_1", "0.02"); //set desc as localisation of "increases b1 exponent by 0.02"
        gamma2.info = Localization.getUpgradeIncCustomExpInfo("b_1", "0.02"); //basically the same but for info button
        gamma2.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation(); //if bought/refunded, force a refresh of the equation
    }

    //milestone 4
    {
        gamma3 = theory.createMilestoneUpgrade(3, 2); //create an upgrade of ID 3 and max level 2
        gamma3.description = Localization.getUpgradeIncCustomExpDesc("b_2", "0.02"); //set desc as localisation of "increases b2 exponent by 0.02"
        gamma3.info = Localization.getUpgradeIncCustomExpInfo("b_2", "0.02"); //basically the same but for info button
        gamma3.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation(); //if bought/refunded, force a refresh of the equation
    }        

    // Achievements
    var AchievementCat0 = theory.createAchievementCategory(0, getLoc(`achCat1`));
    var AchievementCat1 = theory.createAchievementCategory(1, getLoc(`achCat2`));
    var AchievementCat2 = theory.createAchievementCategory(2, getLoc(`achCat3`));
    var AchievementCat3  = theory.createAchievementCategory(3, getLoc(`achCat4`));
    theory.createAchievement(5, AchievementCat0, getLoc(`ach1`), getLoc(`ach1Desc`), () => theory.isAutoBuyerAvailable); //award an achievement for unlocking the autobuyer
    
    theory.createAchievement(0, AchievementCat1, getLoc(`ach2`), getLoc(`ach2Desc`), () => numPublications >= 1); //award an achievement with name and description if there has been 1 publish
    theory.createAchievement(1, AchievementCat1, getLoc(`ach3`), Localization.format(getLoc(`achPubDesc`), '3'), () => numPublications >= 3); //same for 3 publications
    theory.createAchievement(2, AchievementCat1, getLoc(`ach4`), Localization.format(getLoc(`achPubDesc`), '5'), () => numPublications >= 5); //same for 5 publications
    theory.createAchievement(3, AchievementCat1, getLoc(`ach5`), Localization.format(getLoc(`achPubDesc`), '10'), () => numPublications >= 10); //same for 10 publications
    theory.createAchievement(4, AchievementCat1, getLoc(`ach6`), Localization.format(getLoc(`achPubDesc`), '20'), () => numPublications >= 20); //same for 20 publications
    
    theory.createAchievement(6, AchievementCat2, getLoc(`ach7`), Localization.format(getLoc(`achApproxDesc`), '1'), () => inverseE_Gamma >= BigNumber.From("1e0"));
    theory.createAchievement(7, AchievementCat2, getLoc(`ach8`), Localization.format(getLoc(`achApproxDesc`), '5'), () => inverseE_Gamma >= BigNumber.From("1e5"));
    theory.createAchievement(8, AchievementCat2, getLoc(`ach9`), Localization.format(getLoc(`achApproxDesc`), '10'), () => inverseE_Gamma >= BigNumber.From("1e10"));
    theory.createAchievement(9, AchievementCat2, getLoc(`ach10`), Localization.format(getLoc(`achApproxDesc`), '15'), () => inverseE_Gamma >= BigNumber.From("1e15"));
    theory.createAchievement(10, AchievementCat2, getLoc(`ach11`), Localization.format(getLoc(`achApproxDesc`), '25'), () => inverseE_Gamma >= BigNumber.From("1e25"));
    theory.createAchievement(11, AchievementCat2, getLoc(`ach12`), Localization.format(getLoc(`achApproxDesc`), '35'), () => inverseE_Gamma >= BigNumber.From("1e35"));
    theory.createAchievement(12, AchievementCat2, getLoc(`ach13`), Localization.format(getLoc(`achApproxDesc`), '50'), () => inverseE_Gamma >= BigNumber.From("1e50"));
    theory.createAchievement(13, AchievementCat2, getLoc(`ach14`), Localization.format(getLoc(`achApproxDesc`), '100'), () => inverseE_Gamma >= BigNumber.From("1e100"));
    theory.createAchievement(14, AchievementCat2, getLoc(`ach15`), Localization.format(getLoc(`achApproxDesc`), '250'), () => inverseE_Gamma >= BigNumber.From("1e250"));
    theory.createAchievement(15, AchievementCat2, getLoc(`ach16`), Localization.format(getLoc(`achApproxDesc`), '500'), () => inverseE_Gamma >= BigNumber.From("1e500"));

    //theory.createSecretAchievement(20, AchievementCat3,"What's 9 + 10?", "21", "October 9th, 2021", () => a1.level == 9 && a2.level == 10 );
    theory.createSecretAchievement(21, AchievementCat3, getLoc("sach1"), getLoc("sach1Desc"), getLoc("sach1Hint"), () => a1.level == b2.level && b1.level == a2.level && 0  < a1.level && a1.level < 10 && 0  < a2.level && a2.level < 10);
    theory.createSecretAchievement(22, AchievementCat3, getLoc("sach2"), getLoc("sach2Desc"), getLoc("sach2Hint"), () => a1.level == 1 && a2.level == 3 && b1.level == 3 && b2.level == 7 );
    //theory.createSecretAchievement(23, AchievementCat3, "NoAB", "Don't autobuy anything for a whole publication",'Hint', () => abFlag == true && theory.isAutoBuyerAvailable);
    theory.createSecretAchievement(24, AchievementCat3, getLoc("sach3"), getLoc("sach3Desc"), getLoc("sach3Hint"), () => a1.level == 0 && t >= 3600 && numPublications > 0);
    theory.createSecretAchievement(25,AchievementCat3, getLoc("sach4"), getLoc("sach4Desc"), getLoc("sach4Hint"),() => tapCount >= 1000);

    // Story chapters
    theory.createStoryChapter(0, getLoc("story1Title"), getLoc("story1"), () => a1.level > 0); //unlock story chapter when a1 is purchased
    theory.createStoryChapter(1, getLoc("story2Title"), getLoc("story2"), () => b1.level >0 || b2.level > 0); //unlock story chapter if b1 or b2 have been puchased
    theory.createStoryChapter(2, getLoc("story3Title"), getLoc("story3"), () => numPublications > 0); //unlock story chapter if a publication has been done
    theory.createStoryChapter(3, getLoc("story4Title"), getLoc("story4"), () => gamma0.level == 1 || gamma1.level == 1 || gamma2.level == 1 || gamma3.level == 1);//unlock story chapter if a milestone is purchased
    theory.createStoryChapter(4, getLoc("story5Title"), getLoc("story5"), () => currency.value >= BigNumber.From("1e100"));//unlock story chapter upon reaching 1e100 rho1
    theory.createStoryChapter(5, getLoc("story6Title"), getLoc("story6"), () => gamma0.level == 3 && gamma1.level == 5 && gamma2.level == 2 && gamma3.level == 2); //unlock a story when all milestone levels have been purchased    
    theory.createStoryChapter(6, getLoc("story7Title"), getLoc("story7"), () => currency.value >= BigNumber.From("1e500"));
    theory.createStoryChapter(7, getLoc("story8Title"), getLoc("story8"), () => currency.value >= BigNumber.From("1e1000"));
}

var updateInverseE_Gamma = () => {
    let two_pi_rho = BigNumber.TWO * BigNumber.PI * currency3.value; //precalculation of values for tick function
    if (currency3.value < 1000) {
        inverseE_Gamma = BigNumber.ONE / (BigNumber.E - (BigNumber.E / (two_pi_rho.pow(BigNumber.PI / two_pi_rho)))); //approximate E using Stirling's method rearranged
    }
    else {
        let r = BigNumber.PI.log() + two_pi_rho.log().log() - two_pi_rho.log(); 
        inverseE_Gamma = ((r.exp() - r).exp() - BigNumber.from(0.5)) / BigNumber.E; //xelaroc's approximation of the approximation - fixed to work at high values
    }
}

//function that runs every tick, i.e tick math
//DO NOT TOUCH ON PAIN OF DEATH. YES THIS MEANS YOU, FUTURE ME
var tick = (elapsedTime, multiplier) => {

    let dt = BigNumber.from(elapsedTime * multiplier); //find tick time
    
    rho3dot = (getb1(b1.level).pow(BigNumber.ONE + gamma2.level*BigNumber.From(0.02)) * getb2(b2.level).pow(BigNumber.ONE + gamma3.level*BigNumber.From(0.02))); //rho3dot is equal to b1.value * b2.value accounting for exponenents
    currency3.value += rho3dot*dt; //increase currency3.value by rho3dot*dt
    updateInverseE_Gamma();
   
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
    result += "\\qquad" + theory.latexSymbol + "= \\max{\\rho_1}^{0.4}"; 
    return result; //return the sum of text
}   

//display rho2dot, rho3dot and a_3 equation
var getSecondaryEquation = () => { 
    //render rho2dot equation
    result = "\\dot{\\rho}_2 = a_1 a_2 \\cdot a_3 ^{ - \\ln\\rho_3}\\qquad "; //static, doesn't need to change. plain latex


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
    updateInverseE_Gamma();

    numPublications++; //increase number of publications
}

var setInternalState = (state) => { //set the internal state of values that need to be kept post switch that aren't levels
    let values = state.split(" "); //save values to a string
    if (values.length > 0) numPublications = parseInt(values[0]); //save the value of publish numbers to slot 0
    // inverseE_gamma is updated every tick, shouldn't be needed
    //if (values.length > 1) inverseE_Gamma = parseBigNumber(values[1]); //save the value of inverseE_Gamma numbers to slot 1
    if (values.length > 2) tapCount = parseInt(values[2]);
    if (values.length > 3) t = Number.parseFloat(values[3]);
}

var getInternalState = () => `${numPublications} 0 ${tapCount} ${t}` //return the data saved

var getPublicationMultiplier = (tau) => tau.pow(1.5/tauMultiplier); //publication mult bonus is (tau^0.15)*100
var getPublicationMultiplierFormula = (symbol) => /*"10 · " +*/ symbol + "^{0.375}"; //text to render for publication mult ext
var getTau = () => currency.value.pow(BigNumber.from(0.1*tauMultiplier));
var getCurrencyFromTau = (tau) => [tau.max(BigNumber.ONE).pow(10/tauMultiplier), currency.symbol];
var get2DGraphValue = () => (BigNumber.ONE + currency.value.abs()).log10().toNumber(); //renders the graph based on currency 1

var geta1 = (level) => Utils.getStepwisePowerSum(level, 3.5, 3, 0); //get the value of the variable from a power sum with a level of <level>, a base of 2, a step length of 5 and an initial value of 0 
var geta2 = (level) => BigNumber.TWO.pow(level); //get the value of the variable from a power of 2^level
var getb1 = (level) => Utils.getStepwisePowerSum(level, 6.5, 4, 0); //get the value of the variable from a power sum with a level of <level>, a base of 3, a step length of 2 and an initial value of 0
var getb2 = (level) => BigNumber.TWO.pow(level); //get the value of the variable from a power of 2^level

init();
