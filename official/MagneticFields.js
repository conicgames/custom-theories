import { ConstantCost, CustomCost, ExponentialCost, FreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { BigNumber } from "../api/BigNumber";
import { theory, QuaternaryEntry } from "../api/Theory";
import { Utils } from "../api/Utils";
import { ui } from "../api/ui/UI";
import { Color } from "../api/ui/properties/Color";
import { FontAttributes } from "../api/ui/properties/FontAttributes";
import { Thickness } from "../api/ui/properties/Thickness";
import { LayoutOptions } from "../api/ui/properties/LayoutOptions";

var id = "magnetic_fields";
var getName = (language) => {
    const names = {
        en: `Magnetic Fields`,
        de: `Magnetische Felder`,
        fr: `Champs Magnétiques`,
        ja: `磁場理論`,
        ru: `Магнитные поля`
    };
    return names[language] || names.en;
};
var getDescription = (language) => {
    const descs = {
        en:
`A Custom Theory to explore the basic concepts of Magnetic Fields.
Discover the equations that describe the movement of a charged particle inside a solenoid of infinite length.
Watch how rho grows as the particle moves away from its starting position and the magnetic field becomes stronger.
Reset the particle's position to update its velocity to increase your long-term benefits.
Have fun!`,
        de:
`Eine Custom Theorie zur Erforschung der Grundkonzepte magnetischer Felder.
Entdecken Sie die Gleichungen, die die Bewegung eines geladenen Teilchens in einem Elektromagneten unendlicher Länge beschreiben.
Beobachten Sie, wie Rho wächst, wenn sich das Teilchen von seiner Ausgangsposition entfernt und das Magnetfeld stärker wird.
Setzen Sie die Position des Partikels zurück, um seine Geschwindigkeit zu aktualisieren und so Ihre langfristigen Vorteile zu erhöhen.
Viel Spaß!`,
        fr:
`Une théorie personnalisée pour explorer les concepts de base des champs magnétiques.
Découvrez les équations décrivant le mouvement d'une particule chargée dans un solénoïde de longueur infinie.
Observer comment ρ augmente alors que la particle se déplace depuis sa position de départ et que le champ magnétique se renforce.
Réinitialisez la position de la particule pour mettre à jour sa vitesse et augmenter vos bénéfices à long terme.
Amusez-vous bien !`,
        ja:
`磁場の基本概念を探求するカスタム理論。
無限長ソレノイド内部を運動する荷電粒子を記述する方程式を解き明かそう。
粒子が初期位置から離れ、磁場が強くなるにつれて rho がどのように成長するかを見届けよう。
粒子の位置をリセットして速度を更新し、長期的な利益を伸ばそう。
お楽しみください！`,
        ru:
`Пользовательская теория, исследующая базовые концепты магнитных полей.
Откройте уравнения, описывающие движение заряженной частицы в соленоиде бесконечной длины.
Наблюдайте рост ρ, следующий за удалением частицы от стартовой позиции и усилением магнитных полей.
Сбрасывайте позицию частицы, чтобы обновить её скорость и повысить долгосрочную выгоду.
Веселитесь!`
    };
    return descs[language] || descs.en;
};
var authors = "Mathis S.\n" +
"Thanks to the amazing Exponential Idle community for their support and feedback on this theory!\n"+
"Special thanks to prop for helping me with parts of the code.";
var version = 1;
var releaseOrder = "8";

requiresGameVersion("1.4.38");

const locStrings = {
    example: {
        pResetMenu: ``,
        pResetLabel: ``,
        pReset: ``,
        publicationTimeDesc: `{0}`,
        publicationTimeInfo: ``,
        resetTimeDesc: `{0}`,
        resetTimeInfo: ``,
        timeMMSS: `{0} {1}`,
        timeHHMMSS: `{0} {1} {2}`,
        timeDHHMMSS: `{0} {1} {2} {3}`,
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
``
    },
    en: {
        pResetMenu: `Reset Particle Menu`,
        pResetLabel: `After resetting the particle, you will have:`,
        pReset: `Reset Now`,
        publicationTimeDesc: `Publication time: {0}`,
        publicationTimeInfo: `Elapsed time since the last publication`,
        resetTimeDesc: `Reset time: {0}`,
        resetTimeInfo: `Elapsed time since the last particle reset`,
        timeMMSS: `{0}:{1}`,
        timeHHMMSS: `{0}:{1}:{2}`,
        timeDHHMMSS: `{0}d {1}:{2}:{3}`,
        story1Title: `Exploring physics`,
        story1:
`After years of exploring multiple fields of mathematics to find new concepts for growing τ, you decide to head to the physics department of your university.
You meet a student in electromagnetism, huge fan of your work, who hands you a small sheet of equations.
The title: 'Movement of a charged particle inside an infinite charged solenoid'
You're unsure if it will help your project, but you choose to give it a try...`,
        story2Title: `Speeding up`,
        story2:
`You're pretty satisfied with the results so far.
Reseting the particle's position enough times helped with your progress.
However, you feel like there is something missing.
Maybe including the velocity of the particle in the equation will help...`,
        story3Title: `The density of progress`,
        story3:
`You keep engaging with students to learn more about magnetic fields.
One of them tells you that the magnetic field generated by the solenoid gets stronger as the density of turns increases.
You notice the term δ in the equations.
You learn it is meant to represent the density of turns of the solenoid.
Why not turning it into an upgrade?`,
        story4Title: `An old trick`,
        story4:
`The theory keeps working its way forward, however it is slowing down quite a bit.
You start wondering: Was the physics student's project to grow τ flawed?
Can the theory really reach higher limits?
You start looking closer at the exponents of ω and x.
Right! Increasing them would be a nice idea to progress further.
It's time for the old exponent trick.`,
        story5Title: `Reconsideration`,
        story5:
`Since the beginning, you were confident about this project.
Exploring new concepts with electromagnetism was really fun, it feels refreshing after so much pure maths.
However, is it really worth it for your τ project?
The theory became so slow the last few days!
Big numbers aren't suited for physics, it seems.
As you reconsider your choice, you realize that you aren't out of options.
More variables have exponents to be tinkered with...`,
        story6Title: `An accomplishment`,
        story6:
`The magnetic fields project paid off.
You finally did it, you reached 1e600τ!
You decide to organize a small party with the physics students that helped you throughout your journey.
That was a long investment, but you feel like it was worth it.
You miss pure mathematics but, at the same time, you want to explore more physics domains.
One thing you're certain, is that this project marked a big step in your life.`
    },
    de: {
        pResetMenu: `Partikelmenü fürs zurücksetzen`,
        pResetLabel: `Nach dem Zurücksetzen des Partikels haben Sie Folgendes:`,
        pReset: `Jetzt zurücksetzen`,
        publicationTimeDesc: `Veröffentlichungszeit: {0}`,
        publicationTimeInfo: `Verstrichene Zeit seit der letzten Veröffentlichung`,
        resetTimeDesc: `Rückstellzeit: {0}`,
        resetTimeInfo: `Verstrichene Zeit seit dem letzten Partikel-Reset`,
        timeMMSS: `{0}:{1}`,
        timeHHMMSS: `{0}:{1}:{2}`,
        timeDHHMMSS: `{0}d {1}:{2}:{3}`,
        story1Title: `Physik erforschen`,
        story1:
`Nachdem Sie jahrelang verschiedene Bereiche der Mathematik erforscht haben, um neue Konzepte für die Vergrößerung von τ zu finden, entscheiden Sie sich, an die Physikabteilung Ihrer Universität zu gehen.
Sie treffen einen Studenten der Elektromagnetik, der ein großer Fan Ihrer Arbeit ist und Ihnen ein kleines Blatt mit Gleichungen überreicht.
Der Titel: „Bewegung eines geladenen Teilchens innerhalb eines unendlich geladenen Elektromagneten“
Sie sind sich nicht sicher, ob es Ihrem Projekt helfen wird, aber Sie entscheiden sich, es auszuprobieren ...`,
        story2Title: `Beschleunigung`,
        story2:
`Mit den bisherigen Ergebnissen sind Sie recht zufrieden.
Das häufige Zurücksetzen der Partikelposition hat Ihnen beim Fortschritt geholfen.
Sie haben jedoch das Gefühl, dass etwas fehlt.
Vielleicht hilft es, die Geschwindigkeit des Teilchens in die Gleichung einzubeziehen ...`,
        story3Title: `Die Dichte des Fortschritts`,
        story3:
`Sie engagieren sich weiterhin mit Schülern, um mehr über Magnetfelder zu erfahren.
Eine davon sagt Ihnen, dass das vom Magneten erzeugte Magnetfeld mit zunehmender Windungsdichte stärker wird.
Sie bemerken den Term δ in den Gleichungen.
Sie erfahren, dass es die Windungsdichte des Magneten darstellen soll.
Warum nicht ein Upgrade daraus machen?`,
        story4Title: `Ein alter Trick`,
        story4:
`Die Theorie schreitet immer weiter voran, verlangsamt sich jedoch erheblich.
Sie beginnen sich zu fragen: War das Projekt des Physikstudenten, τ zu vergrößern, fehlerhaft?
Kann die Theorie wirklich an höhere Grenzen stoßen?
Sie beginnen, sich die Exponenten von ω und x genauer anzusehen.
Korrekt! Sie zu erhöhen wäre eine gute Idee, um weiter voranzukommen.
Es ist Zeit für den alten Exponententrick.`,
        story5Title: `Neubetrachtung`,
        story5:
`Von Anfang an waren Sie von diesem Projekt überzeugt.
Die Erforschung neuer Konzepte mit Elektromagnetismus hat wirklich Spaß gemacht, es fühlt sich nach so viel reiner Mathematik erfrischend an.
Doch lohnt es sich für Ihr τ-Projekt wirklich?
Die Theorie ist in den letzten Tagen so langsam geworden!
Große Zahlen sind für die Physik offenbar nicht geeignet.
Wenn Sie Ihre Wahl noch einmal überdenken, wird Ihnen klar, dass Ihnen die Optionen nicht ausgehen.
Für weitere Variablen gibt es Exponenten, mit denen man herumbasteln kann...`,
        story6Title: `Eine Leistung`,
        story6:
`Das Magnetfeldprojekt hat sich ausgezahlt.
Du hast es endlich geschafft, du hast 1e600τ erreicht!
Sie beschließen, eine kleine Party mit den Physikstudenten zu organisieren, die Ihnen auf Ihrer Reise geholfen haben.
Das war eine lange Investition, aber Sie haben das Gefühl, dass sie sich gelohnt hat.
Sie vermissen die reine Mathematik, möchten aber gleichzeitig weitere Bereiche der Physik erforschen.
Sie sind sicher, dass dieses Projekt einen großen Schritt in Ihrem Leben markiert hat.`
    },
    fr: {
        pResetMenu: `Réinitialisation de la Particule`,
        pResetLabel: `Après réinitialisation de la particule, vous aurez :`,
        pReset: `Réinitialiser Maintenant`,
        publicationTimeDesc: `Temps depuis publication : {0}`,
        publicationTimeInfo: `Temps écoulé depuis la dernière publication`,
        resetTimeDesc: `Temps depuis réinitialisation : {0}`,
        resetTimeInfo: `Temps écoulé depuis la dernière réinitialisation de la particule`,
        timeMMSS: `{0}:{1}`,
        timeHHMMSS: `{0}:{1}:{2}`,
        timeDHHMMSS: `{0}j {1}:{2}:{3}`,
        story1Title: `Explorer la Physique`,
        story1:
`Après des années à explorer différents domaines de mathématiques pour trouver de nouveaux concepts pour faire grandir τ, vous décidez de vous rendre dans le département de physique de votre université.
Vous rencontrez un étudiant en électromagnétisme, grand admirateur de votre travail, qui vous tend une feuille d'équations.
Le titre : 'Mouvement d'une particule chargée dans un solénoïde infini chargé'
Vous n'êtes pas sûr que ça vous aidera dans votre projet, mais vous choisissez d'essayer...`,
        story2Title: `Passer à la Vitesse Supérieure`,
        story2:
`Vous êtes plutôt satisfait des résultats jusque-là.
Réinitialiser la position de la particule suffisamment a aidé votre progression.
Cependant, vous avez l'impression qu'il manque quelque chose.
Peut-être qu'inclure la vitesse de la particule dans l'équation aidera...`,
        story3Title: `La Densité du Progrès`,
        story3:
`Vous continuez de communiquer avec des étudiants pour en apprendre plus sur les champs magnétiques.
L'un d'eux vous apprend que le champ magnétique généré par le solénoïde devient plus fort lorsque la densité des spires augmente.
Vous remarquez le terme δ dans l'équation.
Vous apprenez qu'il représente la densité des spires du solénoïde.
Pourquoi ne pas le transformer en amélioration ?`,
        story4Title: `Une Vieille Combine`,
        story4:
`La théorie continue d'avancer, mais elle ralentit pas mal.
Vous commencez à songer : le projet de l'étudiant en physique pour faire grandir τ était-il défectueux ?
La théorie peut-elle vraiment atteindre les limites plus hautes ?
Vous regardez les exposants de ω et x.
Bien sûr ! Les augmenter serait une bonne idée pour progresser plus loin.
C'est l'heure de la vieille combine des exposants.`,
        story5Title: `Reconsidération`,
        story5:
`Depuis le début, vous étiez confiant sur ce projet.
Explorer de nouveaux concepts avec l'électromagnétisme était très amusant, comme un rafraichissement après autant de mathématiques abstraites.
Cependant, vaut-il vraiment la peine pour votre projet de τ ?
La théorie est devenue si lente ces derniers jours !
Les grands nombres ne conviennent pas à la physique, on dirait.
Alors que vous reconsidérez vos choix, vous réalisez que vous n'êtes pas à court d'options.
D'autres variables ont des exposants à manipuler...`,
        story6Title: `Un Accomplissement`,
        story6:
`Le projet sur les champs magnétiques a payé.
Vous l'avez enfin fait, vous avez atteint 1e600τ !
Vous décidez d'organiser une petite fête avec les étudiants en physique qui vous ont aidé au long de votre périple.
C'était un investissement de taille, mais vous ressentez que ça en valait la peine.
Les mathématiques abstraites vous mentent, mais, en même temps, vous voulez explorer plus de domaines en physique.
Une chose est certaine, ce projet a marqué une étape importante dans votre vie.`
    },
    ja: {
        pResetMenu: `粒子リセットメニュー`,
        pResetLabel: `粒子をリセットすると次の状態になります。`,
        pReset: `今すぐリセット`,
        publicationTimeDesc: `出版時間: {0}`,
        publicationTimeInfo: `前回の出版からの経過時間`,
        resetTimeDesc: `リセット時間: {0}`,
        resetTimeInfo: `前回の粒子リセットからの経過時間`,
        timeMMSS: `{0}:{1}`,
        timeHHMMSS: `{0}:{1}:{2}`,
        timeDHHMMSS: `{0}日 {1}:{2}:{3}`,
        story1Title: `物理への探求`,
        story1:
`τを成長させる新たな概念を求めて、長年さまざまな数学分野を探求してきたあなたは、大学の物理学科を訪れることにした。
そこで、あなたの研究の大ファンだという電磁気学専攻の学生と出会い、1枚の小さな数式メモを手渡される。
その題名は「無限長ソレノイド内における荷電粒子の運動」。
自分の計画に役立つかは分からなかったが、あなたは試してみることにした...`,
        story2Title: `スピードアップ`,
        story2:
`ここまでの結果にはかなり満足している。
粒子の位置を何度もリセットしたことが、着実な進展につながった。
しかし、どこか足りない気がする。
もしかすると、粒子の速度を方程式に組み込めば役に立つかもしれない...`,
        story3Title: `進歩の密度`,
        story3:
`磁場についてさらに学ぶため、あなたは学生たちとの交流を続ける。
そのうちの一人が、ソレノイドの巻き数密度が高くなるほど、生成される磁場も強くなると教えてくれた。
あなたは方程式の中にあるδの項に気づく。
それがソレノイドの巻き数密度を表していると知ったあなたは、こう考える。
これをアップグレードにしてみてはどうだろう？`,
        story4Title: `古きトリック`,
        story4:
`理論は着実に前進しているが、その速度はかなり落ちてきている。
あなたは考え始める――物理学科の学生が持ち込んだτ成長計画には、何か根本的な欠陥があったのではないか？
この理論は本当に、さらに高みへ到達できるのだろうか？
ωとxの指数を改めて見直してみる。
そうだ！ そこを強化すれば、さらに先へ進めるはずだ。
今こそ、昔ながらの指数強化の出番だ。`,
        story5Title: `再考`,
        story5:
`最初から、あなたはこの計画に強い自信を持っていた。
電磁気学を通して新しい概念を探るのは本当に楽しく、ずっと数学漬けだった日々のあとでは新鮮に感じられた。
だが、これは本当にτ成長計画に見合うものなのだろうか？
ここ数日、この理論はあまりにも遅くなってしまった！
どうやら、巨大な数は物理とは相性が良くないらしい。
選択を見直しながらも、あなたはまだ打つ手が残っていることに気づく。
まだ指数をいじれる変数があるのだ...`,
        story6Title: `ひとつの到達点`,
        story6:
`磁場計画は、確かな成果をもたらした。
ついにやった――1e600τに到達したのだ！
あなたは、この旅を通して助けてくれた物理学科の学生たちと、小さな祝賀会を開くことにした。
長い投資だったが、それだけの価値はあったと感じている。
純粋数学が恋しくもあるが、それと同時に、もっと多くの物理分野を探求してみたいとも思う。
ひとつ確かなのは、この計画があなたの人生において大きな一歩になったということだ。`
    },
    ru: {
        pResetMenu: `Меню сброса частицы`,
        pResetLabel: `После сброса частицы, Вы получите:`,
        pReset: `Сбросить сейчас`,
        publicationTimeDesc: `Время публикации: {0}`,
        publicationTimeInfo: `Время, прошедшее с последней публикации`,
        resetTimeDesc: `Время сброса: {0}`,
        resetTimeInfo: `Время, прошедшее с последнего сброса частицы`,
        timeMMSS: `{0}:{1}`,
        timeHHMMSS: `{0}:{1}:{2}`,
        timeDHHMMSS: `{0}д {1}:{2}:{3}`,
        story1Title: `Открывая физику`,
        story1:
`После долгих лет исследований нескольких отраслей математики, позволивших найти новые концепты, помогающие растить τ, Вы решаете отправиться в отдел физики Вашего университета.
Вы встречаете студента кафедры электромагнетизма, большого фаната Ваших работ, и получаете от него небольшой листок с уравнениями.
Он озаглавлен так: 'Движение заряженной частицы в бесконечном заряженном соленоиде'
Вы не уверены, поможет ли это Вашему проекту, но решаете попробовать...`,
        story2Title: `Ускорение`,
        story2:
`Вы довольны текущими результатами.
Несколько сбросов позиции частицы помогли Вашему прогрессу.
Тем не менее, Вы чувствуете, как будто чего-то не хватает.
Возможно, добавление скорости частицы в уравнение поможет...`,
        story3Title: `Плотность прогресса`,
        story3:
`Вы продолжаете общаться со студентами, чтобы узнать больше о магнитных полях.
Один из них рассказывает Вам, что магнитное поле, сгенерированное соленоидом, усиливается с ростом плотности витков.
Вы замечаете в уравнении член δ.
Вы узнаёте, что он обозначает плотность витков соленоида.
Почему бы не превратить его в улучшение?`,
        story4Title: `Старый трюк`,
        story4:
`Теория продолжает идти вперед, однако она значительно замедляется.
Вы начинаете интересоваться: был ли проект того студента-физика по росту τ ошибкой?
Может ли теория действительно достигнуть высоких пределов?
Вы начинаете присматриваться к показателям степеней ω и x.
Точно! Их повышение было бы хорошей идеей для продолжения прогресса.
Настало время старого трюка со степенями.`,
        story5Title: `Переоценка`,
        story5:
`С самого начала Вы были уверены в этом проекте.
Исследовать новые концепты в электромагнетизме было очень весело, после такого количества чистой математики это действительно был глоток свежего воздуха.
Тем не менее, стоит ли это того ради Вашего проекта по росту τ?
Теория так замедлилась за последние несколько дней!
Похоже, большие числа не подходят для физики.
Пока Вы пересматриваете свой выбор, Вы понимаете, что у Вас ещё остались варианты.
Ещё остались переменные, с чьими степенями можно повозиться...`,
        story6Title: `Достижение`,
        story6:
`Проект магнитных полей окупился.
Вы наконец-то сделали это, Вы достигли 1e600τ!
Вы решаете организовать маленькую вечеринку со студентами-физиками, которые помогали Вам на пути.
Это была долгосрочная инвестиция, но Вы чувствуете, что оно того стоило.
Вы скучаете по чистой математике, но в то же время Вам хочется исследовать больше областей физики.
Вы уверены в одном – этот проект был большим шагом в Вашей жизни.`
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
var ts = BigNumber.ZERO;
var C = BigNumber.ZERO;

var c1, c2, a1, a2, delta, v1, v2, v3, v4;

var pubTime = 0;
var resetTime = 0;

let endtau = BigNumber.from("1e600")


var numberFormat = (value, decimals, negExpFlag=false) => {
    if (value >= BigNumber.ZERO)
    {
        if (value >= BigNumber.from(0.1) || value == BigNumber.ZERO) 
        {
            if (value > BigNumber.ZERO && value < BigNumber.ONE && decimals < 3)
            {
                return value.toString(3);
            }
            return value.toString(decimals);
        }
        else
        {
            let exp = Math.floor((value*BigNumber.from(1+1e-5)).log10().toNumber());
            let mts = (value * BigNumber.TEN.pow(-exp)).toString(decimals);
            if (mts.startsWith('10')) { // Edge case when mantissa rounds up to 10
                mts = (value * BigNumber.TEN.pow(-exp) / 10).toString(decimals)
                exp++;
            }
            if (exp > 0 || !negExpFlag)
            {
                return `${mts}e${exp}`;
            }
            else
            {
                return `${mts}e$\\,-$${-exp}`;
            }
        }
    }
    else
    {
        value = -value;
        if (value >= BigNumber.from(0.1) || value == BigNumber.ZERO) 
        {
            return (-value).toString(decimals);
        }
        else
        {
            let exp = Math.floor((value*BigNumber.from(1+1e-5)).log10().toNumber());
            let mts = (value * BigNumber.TEN.pow(-exp)).toString(decimals);
            if (mts.startsWith('10')) {
                mts = (value * BigNumber.TEN.pow(-exp) / 10).toString(decimals)
                exp++;
            }
            return `-${mts}e${exp}`;
        }
    }
}


let getTimeString = (time) =>
{
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes*60;
    let timeString;
    if(minutes >= 60)
    {
        let hours = Math.floor(minutes / 60);
        if (hours >= 24)
        {
            let days = Math.floor(hours / 24);
            hours -= days*24;
            minutes -= hours*60 + days*60*24;
            timeString = Localization.format(getLoc("timeDHHMMSS"), days, hours, minutes.toString().padStart(2, '0'), seconds.toFixed(1).padStart(4, '0'));
        }
        else {
            minutes -= hours*60;
            timeString = Localization.format(getLoc("timeHHMMSS"), hours, minutes.toString().padStart(2, '0'), seconds.toFixed(1).padStart(4, '0'));
        }
    }
    else
    {
        timeString = Localization.format(getLoc("timeMMSS"), minutes, seconds.toFixed(1).padStart(4, '0'));
    }
    return timeString;
};


var resetSimulation = () => {
    ts = BigNumber.ZERO;
    resetTime = 0;
    x = BigNumber.ZERO;
    vx = (getV1(v1.level) * getV2(v2.level)) * BigNumber.from("1e-20");
    vz = (getV3(v3.level) * getV4(v4.level)) * BigNumber.from("1e-18");
    vtot = (vx.pow(BigNumber.TWO) + vz.pow(BigNumber.TWO)).sqrt();
    theory.invalidateQuaternaryValues();
}

var getvxmultiplier = () => {
    return (getV1(v1.level) * getV2(v2.level)) * BigNumber.from("1e-20") / vx;
}
var getvmultiplier = () => {
    let vxn = (getV1(v1.level) * getV2(v2.level)) * BigNumber.from("1e-20");
    let vzn = (getV3(v3.level) * getV4(v4.level)) * BigNumber.from("1e-18");
    return (vxn.pow(BigNumber.TWO) + vzn.pow(BigNumber.TWO)).sqrt() / vtot;
}

var createResetFrame = () => {
    let triggerable = true;
    let textSize = ui.screenWidth / 11;
    let fontSize = textSize * 0.9;
    let frame = ui.createFrame({
        margin: new Thickness(0),
        padding: new Thickness(0),
        hasShadow: true,
        widthRequest: textSize,
        heightRequest: textSize,
        borderColor: Color.TRANSPARENT,
        content: ui.createLabel({
            margin: new Thickness(0, 0, 0, 0),
            padding: new Thickness(0, 0, 0, 0),
            text: "↺",
            textColor: Color.TEXT_MEDIUM,
            fontAttributes: FontAttributes.BOLD,
            horizontalTextAlignment: TextAlignment.CENTER,
            verticalTextAlignment: TextAlignment.END,
            fontSize: fontSize,
            widthRequest: textSize,
            heightRequest: textSize,
        })
    })

    frame.onTouched = (e) =>
    {
        if(e.type == TouchType.PRESSED)
        {
            frame.backgroundColor = Color.SWITCH_BACKGROUND;
        }
        else if(e.type.isReleased())
        {
            frame.backgroundColor = Color.TRANSPARENT;
            if(triggerable)
            {
                Sound.playClick();
                createResetMenu().show();
            }
            else
                triggerable = true;
        }
        else if(e.type == TouchType.MOVED && (e.x < 0 || e.y < 0 ||
        e.x > frame.width || e.y > frame.height))
        {
            frame.backgroundColor = Color.SWITCH_BACKGROUND;
            triggerable = false;
        }
    };

    return frame;
}

const resetFrame = createResetFrame();

var getEquationOverlay = () =>
{
    let result = ui.createGrid
    ({
        inputTransparent: true,
        cascadeInputTransparent: false,
        children:
        [
            ui.createGrid
            ({
                row: 0, column: 0,
                margin: new Thickness(4),
                horizontalOptions: LayoutOptions.START,
                verticalOptions: LayoutOptions.START,
                inputTransparent: true,
                cascadeInputTransparent: false,
                children:
                [
                    resetFrame
                ]
            }),
        ]
    });
    return result;
}

var createResetMenu = () => {
    let menu = ui.createPopup({
        isPeekable: true,
        title: getLoc("pResetMenu"),
        content: ui.createStackLayout({
            children:
            [
                ui.createLatexLabel
                ({
                    margin: new Thickness(0, 0, 0, 6),
                    text: getLoc("pResetLabel"),
                    horizontalTextAlignment: TextAlignment.CENTER,
                    verticalTextAlignment: TextAlignment.CENTER
                }),
                ui.createLatexLabel
                ({
                    margin: new Thickness(0, 0, 0, 6),
                    text: () => `$t_s: ${numberFormat(ts, 2)}\\rightarrow 0$ \\\\`+
                    `$v_x: ${numberFormat(vx, 2, true)}\\rightarrow${numberFormat(vx*getvxmultiplier(), 2, true)}\\,(\\times${numberFormat(getvxmultiplier(), 2, true)})$ \\\\`+
                    (velocityTerm.level > 0 ? `$v: ${numberFormat(vtot, 2, true)}\\rightarrow${numberFormat(vtot*getvmultiplier(), 2, true)}\\,(\\times${numberFormat(getvmultiplier(), 2, true)})$` : ""),
                    horizontalTextAlignment: TextAlignment.CENTER,
                    verticalTextAlignment: TextAlignment.CENTER
                }),
                ui.createButton
                ({
                    margin: new Thickness(0, 0, 0, 6),
                    text: () => getLoc("pReset"),
                    onReleased: () => resetSimulation()
                })
            ]
        })
    })

    return menu;
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
        c2 = theory.createUpgrade(3, currency, new ExponentialCost(1000, Math.log2(50)));
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
        a2 = theory.createUpgrade(5, currency, new ExponentialCost(1e4, Math.log2(100)));
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
        v4 = theory.createUpgrade(10, currency, new ExponentialCost(1e52, 6*Math.log2(10)));
        v4.getDescription = (_) => Utils.getMath(getDesc(v4.level));
        v4.getInfo = (amount) => Utils.getMathTo(getInfo(v4.level), getInfo(v4.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e8);
    theory.createBuyAllUpgrade(1, currency, 1e10);
    theory.createAutoBuyerUpgrade(2, currency, 1e13);

    {
        pubTimeOverlay = theory.createPermanentUpgrade(11, currency, new FreeCost);
        pubTimeOverlay.getDescription = () => Localization.format(getLoc("publicationTimeDesc"), getTimeString(pubTime));
        pubTimeOverlay.info = getLoc("publicationTimeInfo");
        pubTimeOverlay.boughtOrRefunded = (_) =>
        {
            pubTimeOverlay.level = 0;
        }

        resetTimeOverlay = theory.createPermanentUpgrade(12, currency, new FreeCost);
        resetTimeOverlay.getDescription = () => Localization.format(getLoc("resetTimeDesc"), getTimeString(resetTime));
        resetTimeOverlay.info = getLoc("resetTimeInfo");
        resetTimeOverlay.boughtOrRefunded = (_) =>
        {
            resetTimeOverlay.level = 0;
        }
    }

    ///////////////////////
    //// Milestone Upgrades
    const milestoneArray = [20, 50, 175, 225, 275, 325, 425, 475, 525, -1]
    theory.setMilestoneCost(new CustomCost((lvl) => tauRate * BigNumber.from(milestoneArray[Math.min(lvl, 9)])));

    {
        velocityTerm = theory.createMilestoneUpgrade(0, 1);
        velocityTerm.description = `${Localization.getUpgradeAddTermDesc("v")}; $\\uparrow C$`;
        //velocityTerm.description = `${Localization.getUpgradeAddTermDesc("v")} ; ${Localization.getUpgradeMultCustomDesc("C", "2.09e25")}`;
        velocityTerm.info = `${Localization.getUpgradeAddTermInfo("v")} \\\\ ${Localization.getUpgradeMultCustomInfo("C", "2.09e25")}`;
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
        deltaVariable.description = Localization.getUpgradeAddTermDesc("\\delta ");
        deltaVariable.info = Localization.getUpgradeAddTermInfo("\\delta ");
        deltaVariable.canBeRefunded = (_) => (omegaExp.level === 0);
        deltaVariable.boughtOrRefunded = (_) => {
            theory.invalidateTertiaryEquation();
            updateAvailability();
        }
    }

    {
        omegaExp = theory.createMilestoneUpgrade(2, 2);
        omegaExp.description = `${Localization.getUpgradeIncCustomExpDesc("{\\omega}", "0.15")}; $\\uparrow C$`;
        omegaExp.info = `${Localization.getUpgradeIncCustomExpInfo("{\\omega}", "0.15")} \\\\ ${Localization.getUpgradeMultCustomInfo("C", "1.15e5")}`;
        omegaExp.canBeRefunded = (_) => (xExp.level === 0);
        omegaExp.boughtOrRefunded = (_) => {
            updateC();
            theory.invalidatePrimaryEquation();
            theory.invalidateSecondaryEquation();
            updateAvailability();
        }
    }

    {
        xExp = theory.createMilestoneUpgrade(3, 2);
        xExp.description = `${Localization.getUpgradeIncCustomExpDesc("x", "0.1")}; $\\uparrow C$`;
        xExp.info = `${Localization.getUpgradeIncCustomExpInfo("x", "0.1")} \\\\ ${Localization.getUpgradeMultCustomInfo("C", "22.9")}`
        xExp.canBeRefunded = (_) => (vExp.level === 0);
        xExp.boughtOrRefunded = (_) => {
            updateC();
            theory.invalidatePrimaryEquation();
            theory.invalidateSecondaryEquation();
            updateAvailability();
        }
    }
    
    {
        vExp = theory.createMilestoneUpgrade(4, 2);
        vExp.description = `${Localization.getUpgradeIncCustomExpDesc("v", "0.31")}; $\\uparrow C$`;
        vExp.info = `${Localization.getUpgradeIncCustomExpInfo("v", "0.31")} \\\\ ${Localization.getUpgradeMultCustomInfo("C", "35.5")}`;
        vExp.canBeRefunded = (_) => (a1Exp.level === 0)
        vExp.boughtOrRefunded = (_) => {
            updateC();
            theory.invalidatePrimaryEquation();
            theory.invalidateSecondaryEquation();
            updateAvailability();
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
    theory.createStoryChapter(0, getLoc("story1Title"), getLoc("story1"), () => c1.level > 0);
    theory.createStoryChapter(1, getLoc("story2Title"), getLoc("story2"), () => velocityTerm.level > 0);
    theory.createStoryChapter(2, getLoc("story3Title"), getLoc("story3"), () => deltaVariable.level > 0);
    theory.createStoryChapter(3, getLoc("story4Title"), getLoc("story4"), () => omegaExp.level > 0);
    theory.createStoryChapter(4, getLoc("story5Title"), getLoc("story5"), () => vExp.level > 0);
    theory.createStoryChapter(5, getLoc("story6Title"), getLoc("story6"), () => theory.tau > endtau);

    updateAvailability();
    updateC();
}

var updateAvailability = () => {
    deltaVariable.isAvailable = velocityTerm.level > 0;
    omegaExp.isAvailable = deltaVariable.level > 0;
    xExp.isAvailable = omegaExp.level === 2;
    vExp.isAvailable = xExp.level === 2;
    a1Exp.isAvailable = vExp.level === 2;

    delta.isAvailable = deltaVariable.level > 0;
    v3.isAvailable = velocityTerm.level > 0;
    v4.isAvailable = velocityTerm.level > 0;
}


var tick = (elapsedTime, multiplier) => {
    if (vx == BigNumber.ZERO) resetSimulation();
    if (c1.level == 0) return;

    let dt = BigNumber.from(elapsedTime * multiplier);
    pubTime += elapsedTime;
    resetTime += elapsedTime;

    let bonus = theory.publicationMultiplier;
    let vc1 = getC1(c1.level);
    let vc2 = getC2(c2.level);
    let va1 = getA1(a1.level).pow(getA1exp());
    let va2 = getA2(a2.level);

    t += dt;
    ts += dt;
    x += dt * vx;
    
    let icap = va2*i0;
    let scale = BigNumber.ONE - BigNumber.E.pow(-dt*va1/(BigNumber.FOUR * BigNumber.HUNDRED * va2))
    if (scale < BigNumber.from(1e-13))
    {
        scale = dt*va1/(BigNumber.FOUR * BigNumber.HUNDRED * va2);
    }
    I += scale * (icap - I)
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
        result += `\\mkern 4mu x = {v_x}{t_s}\\\\`;
        result += `B = {{\\mu}_0}{I}{\\delta}\\\\`;
        result += `\\mkern 3mu \\omega = \\frac{q}{m}{B}`;
    }
    else
    {
        theory.primaryEquationHeight = 70;
        theory.primaryEquationScale = 1.2;
        result += `\\dot{\\rho} = C{c_1}{c_2}\\omega^{${getOmegaexpstr()}}x^{${getXexpstr()}}`;
        if (velocityTerm.level > 0) result += `v^{${getVexpstr()}}`;
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
            theory.secondaryEquationScale = 0.95;
            result += `v_y \\mkern 1mu = [{v_3}{v_4}\\times{10^{-18}}]({t_s}=0)\\times\\sin(\\omega{t_s})\\\\`;
            result += `v_z \\mkern 1mu = [{v_3}{v_4}\\times{10^{-18}}]({t_s}=0)\\times\\cos(\\omega{t_s})\\\\`;
        }
        if (a1Exp.level == 0)
        {
            result += `\\dot{I\\text{ }} = \\frac{a_1}{400}\\left(10^{-15} - \\frac{I}{a_2}\\right)\\\\`;
        }
        else
        {
            result += `\\dot{I\\text{ }} = \\frac{{a_1}^{1.01}}{400}\\left(10^{-15} - \\frac{I}{a_2}\\right)\\\\`;
        }
    }
    else
    {
        theory.secondaryEquationHeight = 80;
        theory.secondaryEquationScale = 1.1;
        result += `\\begin{matrix}`
        if (velocityTerm.level > 0)
        {
            result += `v = \\sqrt{{v_x}^2+{v_y}^2+{v_z}^2}\\\\`;
        }
        
        result += `C = ${numberFormat(C, 2)}\\\\`;
        result += `\\end{matrix}\\\\`
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
        result = `${theory.latexSymbol}=\\max\\rho`;
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
            quaternaryEntries.push(new QuaternaryEntry("\\omega_{{}\\,}", null));
            quaternaryEntries.push(new QuaternaryEntry("x_{{}\\,}", null));
            quaternaryEntries.push(new QuaternaryEntry("v_{{}\\,}", null));
            quaternaryEntries.push(new QuaternaryEntry(null, ''));
        }
    }

    if (stage == 0)
    {
        quaternaryEntries[0].value = ts.toString(2);
        quaternaryEntries[1].value = numberFormat(x, 2);
        quaternaryEntries[2].value = numberFormat(vx, 2);
        if (omega*ts < BigNumber.from(1e100))
        {
            if (velocityTerm.level == 1) quaternaryEntries[3].value = numberFormat(vz*BigNumber.from(Math.sin((omega*ts).toNumber())), 2);
            if (velocityTerm.level == 1) quaternaryEntries[4].value = numberFormat(vz*BigNumber.from(Math.cos((omega*ts).toNumber())), 2);
        }
        else {
            quaternaryEntries[3].value = "...";
            quaternaryEntries[4].value = "...";
        }
        quaternaryEntries[5].value = numberFormat(B, 2);
        quaternaryEntries[6].value = numberFormat(I, 2);
    }
    else
    {
        quaternaryEntries[1].value = t.toString(2);
        quaternaryEntries[2].value = numberFormat(rhodot, 2);
        quaternaryEntries[3].value = numberFormat(omega, 2);
        quaternaryEntries[4].value = numberFormat(x, 2);
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

    pubTime = 0;

    theory.invalidateSecondaryEquation();
    theory.invalidateQuaternaryValues();
    resetSimulation();
}

var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getInternalState = () => `${x.toBase64String()} ${vx.toBase64String()} ${vz.toBase64String()} ${vtot.toBase64String()} ${I.toBase64String()} ${t.toBase64String()} ${ts.toBase64String()} ${pubTime} ${resetTime}`;

var setInternalState = (state) => {
    const bigNumberFromBase64OrFrom = (value) => {
        let result;
        try { result = BigNumber.fromBase64String(value); } catch { result = BigNumber.from(value); };
        return result;
    }
    const bigNumberFromBase64OrParse = (value) => {
        let result;
        try { result = BigNumber.fromBase64String(value); } catch { result = parseBigNumber(value); };
        return result;
    }
    let values = state.split(" ");
    if (values.length > 0) x = bigNumberFromBase64OrFrom(values[0]);
    if (values.length > 1) vx = bigNumberFromBase64OrFrom(values[1]);
    if (values.length > 2) vz = bigNumberFromBase64OrFrom(values[2]);
    if (values.length > 3) vtot = bigNumberFromBase64OrFrom(values[3]);
    if (values.length > 4) I = bigNumberFromBase64OrFrom(values[4]);
    if (values.length > 5) t = bigNumberFromBase64OrParse(values[5]);
    if (values.length > 6) ts = bigNumberFromBase64OrParse(values[6]);
    if (values.length > 7) pubTime = Number(values[7]);
    if (values.length > 8) resetTime = Number(values[8]);
  
    updateC();
  };

var getXexp = () => (BigNumber.from(3.2 + 0.1*xExp.level));
var getXexpstr = () => (xExp.level == 0 ? "3.2" : xExp.level == 1 ? "3.3" : "3.4")
var getOmegaexp = () => (BigNumber.from(4.1 + 0.15*omegaExp.level));
var getOmegaexpstr = () => (omegaExp.level == 0 ? "4.1" : omegaExp.level == 1 ? "4.25" : "4.4")
var getVexp = () => (BigNumber.from(1.3 + 0.31*vExp.level));
var getVexpstr = () => (vExp.level == 0 ? "1.3" : vExp.level == 1 ? "1.61" : "1.92")
var getA1exp = () => (BigNumber.ONE + a1Exp.level*0.01);

var updateC = () => {
    let k = BigNumber.from(8.67e23);
    let xinit = BigNumber.from(4e13).pow(getXexp());
    let omegainit = (defaultmass / (q0 * mu0 * i0 * 900)).pow(getOmegaexp());
    let vinit = velocityTerm.level === 1 ? BigNumber.from(3e19).pow(BigNumber.from(1.3)) : BigNumber.ONE;
    let vscale = velocityTerm.level === 1 ? BigNumber.from(1e5).pow(getVexp() - BigNumber.from(1.3)) : BigNumber.ONE;

    C = k * xinit * omegainit * vinit * vscale;
}

var getQ = () => q0;
var getM = () => defaultmass;

var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 7, 0);
var getC2 = (level) => BigNumber.TWO.pow(level);
var getA1 = (level) => Utils.getStepwisePowerSum(level, 2, 5, 3);
var getA2 = (level) => BigNumber.from(1.25).pow(level);
var getDelta = (level) => deltaVariable.level > 0 ? BigNumber.from(1.1).pow(level) : BigNumber.ONE;
var getV1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 1);
var getV2 = (level) => BigNumber.from(1.3).pow(level);
var getV3 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getV4 = (level) => BigNumber.from(1.5).pow(level);


init();
