import { CustomCost, ExponentialCost, FirstFreeCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { parseBigNumber, BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "weierstrass-product-sine";
var getName = (language) => {
    const names = {
        en: `Weierstraß Sine Product`,
        de: `Weierstraß Sinus Produkt`,
        fr: `Produit Sinus de Weierstrass`,
        ja: `ワイエルシュトラスの正弦積`,
        ru: `Вейерштрассовское произведение по синусу`,
        uk: `Добуток Веєрштрасса для синуса`
    };
    return names[language] || names.en;
};
var getDescription = (language) => {
    const descs = {
        en:
`Exploit the inaccuracy of sine's product representation, a result due to Euler which was rigorously proved later by Weierstraß using his famous Factorization Theorem.

Intuitively, the idea behind this formula is to factorize sine using its roots (sine has zeros at each multiple of π), just as one would do for a polynomial.

The product s_n represents only the n first factors of this infinite product (together with the root at x=0), which means there is some error between s_n(x) and the actual sin(x), depending on n and x. Note that this truncated product s_n approximates sin(x) better for bigger n and smaller x, in particular the approximation becomes bad for a fixed n when x gets large in the sense that the ratio s_n(x)/sin(x) diverges for x -> infinity.

Here, the derivative of q with respect to time is set to s_n(χ)/sin(χ) i.e. the ratio from before evaluated at χ (chi), which itself is a value depending on n. Note that increasing n both increases χ and the accuracy of the approximation s_n.`,
        de:
`Nutzen Sie die Ungenauigkeit der Produktdarstellung des Sinus aus, ein Ergebnis von Euler, das später von Weierstraß mithilfe seines berühmten Faktorisierungssatzes rigoros bewiesen wurde.

Intuitiv liegt der Gedanke hinter dieser Formel darin, den Sinus mithilfe seiner Wurzeln zu faktorisieren (der Sinus hat Nullstellen an jedem Vielfachen von π), genau wie man es bei einem Polynom tun würde.

Das Produkt s_n repräsentiert lediglich die ersten n Faktoren dieses unendlichen Produkts (zusammen mit der Nullstelle bei x=0), was bedeutet, dass zwischen s_n(x) und dem tatsächlichen sin(x) ein Fehler besteht, der von n und x abhängt. Beachten Sie, dass dieses verkürzte Produkt s_n sin(x) für größere n und kleinere x besser approximiert. Insbesondere verschlechtert sich die Approximation für ein festes n, wenn x groß wird, da das Verhältnis s_n(x)/sin(x) für x → ∞ divergiert.

Hier wird die Ableitung von q nach der Zeit auf s_n(χ)/sin(χ) gesetzt, d. h. das Verhältnis von zuvor, ausgewertet an der Stelle χ (chi), welches selbst ein Wert ist, der von n abhängt. Beachten Sie, dass eine Erhöhung von n sowohl χ als auch die Genauigkeit der Näherung s_n erhöht.`,
        fr:
`Exploitez l’inexactitude de la représentation du produit du sinus, un résultat dû à Euler qui a été rigoureusement prouvé plus tard par Weierstrass en utilisant son célèbre théorème de factorisation.

Intuitivement, l’idée derrière cette formule est de factoriser le sinus en utilisant ses racines (le sinus a des zéros à chaque multiple de π), tout comme on le ferait pour un polynôme.

Le produit s_n ne représente que les n premiers facteurs de ce produit infini (avec la racine à x=0), ce qui signifie qu’il y a une certaine erreur entre s_n(x) et le sin(x) réel, en fonction de n et x. Notez que ce produit tronqué s_n se rapproche mieux de sin(x) pour un n plus grand et un x plus petit, en particulier l’approximation devient mauvaise pour un n fixé lorsque x devient grand dans le sens où le rapport s_n(x)/sin(x) diverge pour x -> infini.

Ici, la dérivée de q par rapport au temps est fixée à s_n(χ)/sin(χ), c’est-à-dire le rapport d’avant évalué à χ (chi), qui est lui-même une valeur dépendante de n. Notez que l’augmentation de n augmente à la fois χ et la précision de l’approximation s_n.`,
        ja:
`オイラーによる正弦関数の積表示の不正確さを利用する。この結果は後に、ワイエルシュトラスの因数分解定理によって厳密に証明された
この公式の発想は、正弦関数をその根によって因数分解することにある。sin(x)はπの整数倍で0になるため、多項式を根で分解するのと似た考え方である。
s_nはこの無限積の最初のn個の因子だけを表すため、s_n(x)とsin(x)の間にはnとxに依存する誤差が生じる。nが大きいほど、またxが小さいほど近似は良くなるがnを固定したままxが大きくなるとs_n(x)/sin(x)は発散する。
この理論では、qの時間変化率をs_n(χ)/sin(χ)とする。χもnに依存する値であり、nを増やすことでχと近似精度の両方が上昇する。`,
        ru:
`Воспользуйтесь неточностью представления произведения по синусу: обусловленным Эйлером результатом, который был позже строго доказан Вейерштрассом при помощи его знаменитой теоремы факторизации.

Интуитивно понятно, что идея, стоящая за этой формулой - разложить синус на множители, используя его корни (корни синуса располагаются в каждом числе, кратном π), точно так же, как это можно сделать для многочлена.

Произведение s_n представляет собой только первые n множителей этого бесконечного произведения (включая корень x=0), и из-за этого между s_n(x) и самим sin(x) возникает некоторая погрешность, зависящая от n и x. Следует заметить, что это частичное произведение s_n приближается к sin(x) тем лучше, чем больше n и меньше x. В частности, аппроксимация становится хуже при определённом n, когда x становится большим, в том смысле, что отношение s_n(x)/sin(x) расходится при x, стремящемся к бесконечности.

Производная q по времени в этой теории равна s_n(χ)/sin(χ), то есть упомянутому ранее отношению, в которое подставили χ (хи), величина которого в свою очередь зависит от n. Стоит отметить, что увеличение n увеличивает как χ, так и точность аппроксимации s_n.`,
        uk:
`Скористайся похибкою розкладу синуса у добуток — результату, отриманого Ейлером та пізніше доведеного Веєрштрассом за допомогою його знаменитої теореми факторизації.

Інтуїтивно, ідея цієї формули полягає в розкладі синуса на множники за допомогою його коренів (синус має нулі в кожному числі, кратному π), подібно до того, як це було б зроблено для многочлена.

Добуток s_n представляє лише перших n множників цього нескінченного добутку (разом із коренем x=0), що означає, що існує певна похибка між s_n(x) та справжнім sin(x), залежно від n та x. Варто зауважити, що цей частковий добуток s_n прямує до sin(x) краще для більших n та менших x; зокрема, апроксимація стає поганою для фіксованого n й великих x, в сенсі того, що відношення s_n(x)/sin(x) стає розбіжним при x, що прямує до нескінченності.  

У цій теорії похідна q за часом дорівнює s_n(χ)/sin(χ), тобто згаданому вище відношенню при χ (хі), величина якого, своєю чергою, залежить від n. Варто зазначити, що зі зростанням n збільшується як χ, так і точність наближення s_n.`
    };
    return descs[language] || descs.en;
}
var authors = "xelaroc (AlexCord#6768)";
var version = 5;
var releaseOrder = "1";

requiresGameVersion("1.4.33");

var tauMultiplier = 4;

var q = BigNumber.ONE;
var chi = BigNumber.ONE;
var S = BigNumber.ZERO;

// χ and s_n(χ)/sin(χ) don't need to be evaluated at each tick; only when c1 or n is bought or chiDivN milestone
var updateSineRatio_flag = true;

var q1, q2, n, c1, c2;
var q1Exp, c2Term, chiDivN;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    
    // q1
    {
        let getDesc = (level) => "q_1=" + getQ1(level).toString(0);
        let getInfo = (level) => "q_1=" + getQ1(level).toString(0);
        q1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, 3.38/4)));
        q1.getDescription = (amount) => Utils.getMath(getDesc(q1.level));
        q1.getInfo = (amount) => Utils.getMathTo(getInfo(q1.level), getInfo(q1.level + amount));
    }
    
    // q2
    {
        let getDesc = (level) => "q_2=2^{" + level + "}";
        let getInfo = (level) => "q_2=" + getQ2(level).toString(0);
        q2 = theory.createUpgrade(1, currency, new ExponentialCost(1000, 3.38*3));
        q2.getDescription = (amount) => Utils.getMath(getDesc(q2.level));
        q2.getInfo = (amount) => Utils.getMathTo(getInfo(q2.level), getInfo(q2.level + amount));
    }
    
    // n
    {
        let getDesc = (level) => "n=" + level;
        let getInfo = (level) => "n=" + level;
        n = theory.createUpgrade(2, currency, new ExponentialCost(20, 3.38));
        n.getDescription = (amount) => Utils.getMath(getDesc(n.level));
        n.getInfo = (amount) => Utils.getMathTo(getInfo(n.level), getInfo(n.level + amount));
        n.bought = (_) => updateSineRatio_flag = true;
    }
    
    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(0);
        let getInfo = (level) => "c_1=" + getC1(level).toString(0);
        c1 = theory.createUpgrade(3, currency, new ExponentialCost(50, 3.38/1.5));
        c1.getDescription = (amount) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getInfo(c1.level), getInfo(c1.level + amount));
        c1.bought = (_) => updateSineRatio_flag = true;
    }

    // c2
    {
        let getDesc = (level) => "c_2=2^{" + level + "}";
        let getInfo = (level) => "c_2=" + getC2(level).toString(0);
        c2 = theory.createUpgrade(4, currency, new ExponentialCost(1e10, 3.38*10));
        c2.getDescription = (amount) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e8);
    theory.createBuyAllUpgrade(1, currency, 1e15);
    theory.createAutoBuyerUpgrade(2, currency, 1e25);

    /////////////////////
    // Checkpoint Upgrades
    theory.setMilestoneCost(new CustomCost(lvl => tauMultiplier*BigNumber.from(lvl < 5 ? 1 + 1.5*lvl : lvl < 6 ? 10 : lvl < 7 ? 14 : 20)));

    {
        q1Exp = theory.createMilestoneUpgrade(0, 4);
        q1Exp.description = Localization.getUpgradeIncCustomExpDesc("q_1", "0.01");
        q1Exp.info = Localization.getUpgradeIncCustomExpInfo("q_1", "0.01");
        q1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        c2Term = theory.createMilestoneUpgrade(1, 1);
        c2Term.description = Localization.getUpgradeAddTermDesc("c_2");
        c2Term.info = Localization.getUpgradeAddTermInfo("c_2");
        c2Term.boughtOrRefunded = (_) => {theory.invalidatePrimaryEquation(); updateAvailability(); };
    }

    {
        chiDivN = theory.createMilestoneUpgrade(2, 3);
        updateChiDescAndInfo = () => {
            chiDivN.description = Utils.getMathTo("c_1 + n" + (chiDivN.level > 0 ? ("/3^{" + chiDivN.level + "}") : ""), "c_1 + n/3^{" + (chiDivN.level + (chiDivN.level == 3 ? 0 : 1)) + "}");
            chiDivN.info = chiDivN.description;
        }
        chiDivN.boughtOrRefunded = (_) => {theory.invalidateSecondaryEquation(); updateChiDescAndInfo(); updateSineRatio_flag = true;}
        updateChiDescAndInfo();
    }

    updateAvailability();
}

var updateAvailability = () => {
    c2.isAvailable = c2Term.level > 0;
}

var srK_helper = (x) => { let x2 = x*x; return Math.log(x2 + 1/6 + 1/120/x2 + 1/810/x2/x2)/2 - 1; }

// computes πx * Prod{k=1, n, 1-(x/k)^2} / sin(πx) 
//          = 1 / Prod{k=n+1, infty, 1-(x/k)^2}
//          = Г(n+1+x) * Г(n+1-x) / Г(n+1)^2
//          = Г(n+1+K+x) * Г(n+1+K-x) / (Г(n+1+K)^2 * Prod{k=n+1, n+K, 1-(x/k)^2})
// quickly (O(K), averages for (n,x)=(1157,1157.3184): ~0.25ms for K=1, ~0.35ms for K=5, ~0.43ms for K=10) 
// and with fair accuracy (relative error: <1e-3 for K=0, <1e-6 for K=1, <1e8 for K=5, <1e-10 for K=10)
var sineRatioK = (n, x, K=5) => {
    if (n < 1 || x >= n + 1) return 0;
    let N = n + 1 + K, x2 = x*x,
        L1 = srK_helper(N + x), L2 = srK_helper(N - x), L3 = srK_helper(N),
        result = N * (L1 + L2 - 2*L3) + x * (L1 - L2) - Math.log(1 - x2/N/N)/2;
    for(let k = n + 1; k < N; ++k) result -= Math.log(1 - x2/k/k);
    return BigNumber.from(result).exp();    
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime*multiplier);
    let bonus = theory.publicationMultiplier;
    let vq1 = getQ1(q1.level).pow(getQ1Exp(q1Exp.level));
    let vq2 = getQ2(q2.level);
    let vc2 = c2Term.level > 0 ? getC2(c2.level) : BigNumber.ONE;
    
    if (updateSineRatio_flag) {
        let vn = getN(n.level);
        let vc1 = getC1(c1.level);
        chi = BigNumber.PI * vc1 * vn / (vc1 + vn / BigNumber.THREE.pow(BigNumber.from(chiDivN.level))) + BigNumber.ONE;
        S = sineRatioK(n.level, chi.toNumber()/Math.PI);
        updateSineRatio_flag = false;
    }
    let dq = dt * S * vc2;

    q = q + dq.max(BigNumber.ZERO);
    currency.value += bonus * vq1 * vq2 * q * dt;

    theory.invalidateTertiaryEquation();
}

var getInternalState = () => q.toBase64String();

var setInternalState = (state) => {
    const bigNumberFromBase64OrParse = (value) => {
        let result;
        try { result = BigNumber.fromBase64String(value); } catch { result = parseBigNumber(value); };
        return result;
    }
    let values = state.split(" ");
    if (values.length > 0) q = bigNumberFromBase64OrParse(values[0]);
    updateChiDescAndInfo();
    updateSineRatio_flag = true;
}

var postPublish = () => {
    q = BigNumber.ONE;
    updateSineRatio_flag = true;
}

var getPrimaryEquation = () => {
    theory.primaryEquationHeight = 90;
    let result = "\\begin{matrix}"
    result += "\\dot{\\rho}=q_1";
    if (q1Exp.level > 0) result += `^{${1+q1Exp.level*0.01}}`;
    result += "q_2q,\\quad\\dot{q} = "
	if (c2Term.level > 0) result += "c_2\\cdot ";
	result += "\s_n(\\chi)/\\sin(\\chi)\\\\\\\\";
	result += "s_n(x) := x\\cdot\\prod_{k=1}^n\\left(1-\\frac{x}{k\\pi}^{\\ 2}\\right) "
    result += "\\end{matrix}"
    return result;
}

var getSecondaryEquation = () => {
    let result = theory.latexSymbol + "=\\max\\rho^{0.4},\\quad\\chi =\\pi\\cdot\\frac{c_1n}{c_1+n";
    if (chiDivN.level > 0) result += "/3^{" + chiDivN.level + "}";
    result += "}+1";
    return result;
}

var getTertiaryEquation = () => {
    let result = "";

    result += "\\begin{matrix}q=";
    result += q.toString();
    result += ",&\\chi =";
    result += chi.toString(3);
    result += "\\end{matrix}";

    return result;
}

var getPublicationMultiplier = (tau) => tau.isZero ? BigNumber.ONE : tau.pow(BigNumber.from(1.5/tauMultiplier));
var getPublicationMultiplierFormula = (symbol) => "{" + symbol + "}^{0.375}";
var getTau = () => currency.value.pow(BigNumber.from(0.1*tauMultiplier));
var getCurrencyFromTau = (tau) => [tau.max(BigNumber.ONE).pow(10/tauMultiplier), currency.symbol];
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getN = (level) => BigNumber.from(level);
var getQ1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getQ2 = (level) => BigNumber.TWO.pow(BigNumber.from(level));
var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 50, 1);
var getC2 = (level) => BigNumber.TWO.pow(BigNumber.from(level));
var getQ1Exp = (level) => BigNumber.from(1 + level * 0.01);

init();
