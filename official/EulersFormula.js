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

var id = "eulers_formula";
var getName = (language) => {
    const names = {
        en: `Euler's Formula`,
        de: `Eulers Formel`,
        ja: `オイラーの公式`,
        ru: `Формула Эйлера`,
        uk: `Формула Ейлера`
    };
    return names[language] || names.en;
};
var getDescription = (language) => {
    const descs = {
        en:
`You're a student hired by a professor at a famous university. Since your work has received a bit of attention from your colleagues in the past, you decide to go into a subject not yet covered by your professor, which has interested you since day 1 of deciding to study mathematics - Complex Numbers.
You hope that with your research on this subject, you can finally get the breakthrough you always wanted in the scientific world.

This theory explores the world of complex numbers, their arrangement and their place in the Universe of Mathematics. The theory, named after famous mathematician Leonhard Euler, explores the relationship between exponential and trigonometric functions.
Your task is to use this formula, and with the help of the Pythagorean theorem, to calculate the distances of cos(t) and isin(t) from the origin and grow them as large as possible using many different methods and approaches!
A theory with interesting grow and decay rates, unusual properties, and (We hope) an interesting story!

Variable Explanation:

t - A simple variable based on time. Is reset on publish.
q - A variable helping you grow ρ, directly affected by t.
b and c - Variables modifying cos(t) and isin(t)

Huge thanks to:

- Gilles-Philippe, for implementing integral features we proposed, helping us a *ton* during development, answering our questions and giving us beta features to use in our theories!

- XLII, doing basically ALL of the balancing together with Snaeky, deciding various integral features of the theory such as, but not limited to: milestone placement, milestone costs, publication multipliers and a lot more!

- Snaeky, without whom this theory would not have been possible as he was the one with the original idea of structuring a theory around Euler's Formula, and always answered my (peanut's) questions and motivated us all to push this theory forward.

and of course:

- The entire Discord community, who've playtested this theory and reported many bugs, especially those active in #custom-theories-dev!

We hope you enjoy playing this theory as much as we had developing it and comping up with ideas for it!

- The Eulers-Formula-CT Team`,
        de:
`Du bist ein Student, angestellt von einen Professor an einer Berühmten Universität. Da deine Arbeit ein wenig Aufmerksamkeit von deinen Kollegen in der Vergangenheit bekommmen hat, hast du dich entschieden in eine Thematik zu gehen die nicht von deinen Professor Bearbeitet wird, was dich interessiert hat seit Tag 1 von der entscheidung Mathematik zu studieren - Komplexe Zahlen.
Du hoffst dass mit deiner Forschung auf diese Thematik, endlich ein Durchbruch du dir immer erwünscht hast in der Wissenschaftlichen Welt.

Diese Theorie erkundet die Welt von Komplexen Zahlen, deren Stellung und deren Platz im Universum der Mathematik. Diese Theorie, benannt nach den Berühmten Mathematiker Leonhard Euler, erkundet die Beziehungen zwischen Exponentiell und Trigonometriefuntkonen.
Deine Aufgabe ist es diese Formel mit Hilfe des Satz des Pythagoras, um auszurechnen die Entfernung von cos(t) und isin(t) von deren Ursprung und so hoch wie möglich zu Steigern mit sehr vielen diversen Methoden und Annäherungen!
Eine Theorie mit interessanten Wachstum und Abfall raten, seltene Eigenschaften, und (Wir Hoffen) eine interesante Geschichte!

Variabeln Erklärung:

t - Eine simple Variable bassiert auf Zeit. Setzt sich zurück auf Veröffentlichungen.
q - Eine Variable die dir Hilft ρ zu wachsen, direkt beeinflusst von t.
a - Mehrere arten von Variablen, helfen dir ρ zu wachsen.
b and c - Varablen verändern cos(t) und isin(t)

Großen Dank an:

- Gilles-Philippe, fürs implementieren von Integral Funktionen die wir vorgeschlagen haben, sehr viel geholfen während der entwicklung, Fragen beantwortet und Betazugriff in unseren Theorien zu nutzen!

- XLII, ALL das ausgleichen und balancieren mit Snaeky, das entscheiden von jeglichen Integralmerkmale von dieser Theorie wie, aber nicht limitiert zu : Meilensteinplatzierung, Meilensteinkosten, Veröffentlichungsmultiplikator und vieles mehr!

- Snaeky, ohne ihm währe diese Theorie nicht möglich da er die Originalidee die Theorie um Eulers Formel zu Struktieren, und auch immer auf meine (peanut's) Fragen eingegangen und beantwortet, dazu und Motiviert und immer weiter zu gehen.

und natürlich:

- Die ganze Discordcommunity, die diese Theorie testgespielt haben und viele Fehler gemeldet haben, besonders die Aktiven in #custom-theories-dev!

Wir hoffen du hast Spaß diese Theorie zu spielen wie wir sie zu Entwickeln und Ideen zu sammeln für dies.

- Das Eulers-Formel-CT-Team`,
        ja:
`あなたは有名大学の教授に雇われた学生です。あなたの取り組みは過去に同期の学生から少し注目を浴びたため、教授がまだ取り上げておらず、そして数学を学ぶことを決めた最初の日から興味を持っていたテーマ「複素数」について取り組むことに決めました。
このテーマに関するあなたの研究によって、科学の世界において期待され続けていた大躍進を達成できることを願っています。

この理論は、複素数の世界及び配置、さらには宇宙のような広い数学のフィールドにおける位置づけを探求します。有名な数学者レオンハルト・オイラーにちなんで名付けられたこの理論は、指数関数と三角関数の関係を探ります。
あなたの課題は、この公式を用いて、ピタゴラスの定理の助けを借りながら、原点からのcos(t)及びisin(t)の距離を計算するために、多種多様な方法とアプローチによって大きく成長させることです！

変数の説明：

t - 時間に基づいた単純な変数。出版時にリセットされます。
q - ρを成長させるのに役立つ変数で、tの影響を直接受けます。
a - 様々な種類の変数があり、ρを成長させます。
b, c - cos(t)及びisin(t)に変化を加える変数。
特に感謝したい人たち：

Gilles-Philippe - 私が提案した重要な機能を実装し、質問に答えるなど、開発中に大いに助けてくれて、さらには理論に必要なベータ機能を提供してくれた。

XLII - Snaekyと共に、マイルストーンの配置、マイルストーンのコスト、出版の乗数など、多くの重要な機能を決定し、理論全体のバランス調整をほぼ全て行った。

Snaeky - オイラーの公式を中心に理論を構築するというオリジナルのアイデアを持ち、私の質問にいつも答えてくれて、この理論を押し進める動機を与えてくれた。
そしてもちろん：
多くのバグを報告してくれた、特に#custom-theories-devで活動しているDiscordコミュニティ

この理論の開発やアイデアを考えるのと同じくらい、あなたがこの理論を楽しんでくれることを願っています！


Eulers-Formula-CT Team`,
        ru:
`Вы — студент, нанятый профессором знаменитого университета. Поскольку в прошлом ваша работа привлекла внимание коллег, вы решили заняться темой, которую еще не изучал ваш профессор и которая интересовала вас с первого дня изучения математики, — комплексными числами..
Вы надеетесь, что благодаря своим исследованиям в этой области вы наконец-то сможете добиться прорыва в научном мире, о котором всегда мечтали.

Эта теория исследует мир комплексных чисел, их расположение и место во вселенной математики. Теория, названная в честь знаменитого математика Леонарда Эйлера, исследует взаимосвязь между показательными и тригонометрическими функциями.
Ваша задача — используя эту формулу и теорему Пифагора, вычислить расстояния cos(t) и isin(t) от начала координат и вырастить их как можно больше, используя самые разные методы и подходы!
Это теория с интересным ростом и значениями ослабления, необычными свойствами и (мы надеемся) интересной историей!

Объяснение переменных:

t - простая переменная, основанная на времени. Обнуляется при публикации.
q - переменная, влиящая на рост ρ, напрямую подвержена влиянию t.
a - несколько переменных, помогающих с ростом ρ.
b и c - переменные, модифицирующие cos(t) и isin(t)

Большое спасибо:

- Gilles-Philippe, за реализацию предложенных нами важных функций, *большую* помощь во время разработки, ответы на наши вопросы и предоставление нам бета-версии функций для использования в наших теориях!

- XLII, за практически ВЕСЬ процесс балансировки вместе со Snaeky, решение различных неотъемлемых особенностей теории, таких как, но не ограничиваясь ими: размещение целей, стоимость целей, множители публикаций и многое другое!

- Snaeky, без которого эта теория была бы невозможна, поскольку именно ему принадлежала первоначальная идея построения теории на основе формулы Эйлера, и он всегда отвечал на мои (peanut) вопросы и мотивировал нас всех продвигать эту теорию.

и конечно же:

- всё сообщество Discord, которое тестировало эту теорию и сообщило о многих багах, особенно те, кто активен в #custom-theories-dev!

Мы надеемся, что Вам понравится играть в эту теорию так же, как и нам разрабатывать её и придумывать для неё идеи!

- Команда пользовательской теории "Формула Эйлера"`,
        uk:
`Ти — студент, найнятий професором відомого університету. Оскільки твоїми працями в минулому вже цікавилися колеги, ти вирішив перейти до розділу, котрий ще не розглядався професором, але зацікавив тебе з першого дня вивчення математики — комплексні числа.
Ти сподіваєшся, що завдяки дослідженню цієї теми ти зможеш досягти прориву в науковому світі, про який завжди мріяв.

Ця теорія досліджує світ комплексних чисел та їх розташування в математичному всесвіті. Теорія, названа на честь відомого математика Леонарда Ейлера, досліджує взаємозв'язок між експоненціальними та тригонометричними функціями.
Твоє завдання — використати цю формулу, та за допомогою теореми Піфагора обчислити відстані cos(t) та isin(t) від початку координат та зробити їх якомога більшими, використовуючи різні методи та підходи!
Теорія містить цікаві темпи зростання та спадання, незвичні властивості, і, сподіваємось, цікаву історію!

Опис змінних:

t — проста змінна, що залежить від часу. Скидається після публікації.
q — змінна, яка допомагає збільшувати ρ. Напряму пов'язана з t.
a - кілька змінних, що сприяють збільшенню ρ.
b і c — змінні, що модифікують cos(t) та isin(t)

Величезна подяка:

—Gilles-Phillipe за впровадження запропонованих нами механік, тонну допомоги під час розробки, відповіді на наші запитання та надання нам бета-функцій для використання в наших теоріях!

—XLII, який зробив фактично ВСЕ балансування разом з Snaeky та продумав такі аспекти, як ціна й розміщення досягнення цілей, множники публікації та багато іншого!

-Snaeky, без кого теорія взагалі не існувала б, оскільки це його ідея створення теорії навколо формули Ейлера. Він завжди відповідав на мої (peanut-а) питання та мотивував всіх нас на створення цієї теорії.

і звичайно:

—Всій спільноті Discord, яка тестувала цю теорію та повідомила про багато вад. Особливо тим, хто був активним у каналі #custom-theories-dev!

Ми сподіваємось, що тобі сподобалось грати у цю теорію так само, як нам її придумувати та створювати!

—Команда СТ формули Ейлера`
    };
    return descs[language] || descs.en;
};
var authors = "Snaeky (SnaekySnacks#1161) - Structuring\nXLII (XLII#0042) - Balancing\npeanut (peanut#6368) - Developer";
var version = 6;
var releaseOrder = "3";

const locStrings = {
    example: {
        rMilestone: ``,
        iMilestone: ``,
        b2MilestoneDesc: ``,
        b2MilestoneInfo: ``,
        c2MilestoneDesc: ``,
        c2MilestoneInfo: ``,
        achCat1: ``,
        achCat2: ``,
        achCat3: ``,
        achCat4: ``,
        ach1: ``,
        ach2: ``,
        ach3: ``,
        ach4: ``,
        ach5: ``,
        ach6: ``,
        ach7: ``,
        ach8: ``,
        ach9: ``,
        ach10: ``,
        ach10Desc: ``,
        ach11: ``,
        ach11Desc: ``,
        ach12: ``,
        ach12Desc: ``,
        ach13: ``,
        ach13Desc: ``,
        ach14: ``,
        ach14Desc: ``,
        ach15: ``,
        ach15Desc: ``,
        ach16: ``,
        ach16Desc: ``,
        ach17: ``,
        ach17Desc: ``,
        ach18: ``,
        ach19: ``,
        ach20: ``,
        ach21: ``,
        achTauDesc: `{0}`,
        achPubDesc: `{0}`,
        sach1: ``,
        sach1Hint: ``,
        sach1Message: ``,
        sach2: ``,
        sach2Hint: ``,
        sach2Message2: ``,
        sach2Message3: ``,
        sach2Message4: ``,
        sach3: ``,
        sach3Hint: ``,
        sach4: ``,
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
``,
        story9Title: ``,
        story9:
``,
        story10Title: ``,
        story10:
``,
        story11Title: ``,
        story11:
``,
        gameEndPopupTitle: ``,
        gameEndPopupText:
``,
        gameEndPopupLabel: ``,
        gameEndPopupClose: ``
    },
    en: {
        rMilestone: `Unlock the real component R`,
        iMilestone: `Unlock the imaginary component I`,
        b2MilestoneDesc: `$\\uparrow b_2$ base by 0.01`,
        b2MilestoneInfo: `Increases $b_2$ base by 0.01`,
        c2MilestoneDesc: `$\\uparrow c_2$ base by 0.0125`,
        c2MilestoneInfo: `Increases $c_2$ base by 0.0125`,
        achCat1: `Currencies`,
        achCat2: `Milestones`,
        achCat3: `Publications`,
        achCat4: `Secret Achievements`,
        ach1: `Getting Started`,
        ach2: `Beginner's Luck`,
        ach3: `Imaginary Limits`,
        ach4: `Complex Progress`,
        ach5: `Nice`,
        ach6: `Euler's Student`,
        ach7: `There's more?`,
        ach8: `Are we done yet?`,
        ach9: `A New Professor`,
        ach10: `Automatic Analysis`,
        ach10Desc: `Let your machine leraning algorithm calculate the theory for you.`,
        ach11: `Realistic Methods`,
        ach11Desc: `Figure out how to use R (real dimension).`,
        ach12: `Imaginary Concepts`,
        ach12Desc: `Figure out how to use I (imaginary dimension).`,
        ach13: `Arithmetic Multiplication`,
        ach13Desc: `Use the idea of your colleagues and add a multiplier.`,
        ach14: `Exponential Growth`,
        ach14Desc: `Add an exponent to your main equation.`,
        ach15: `Acids and ...Bases?`,
        ach15Desc: `Change the base of b2.`,
        ach16: `First Time`,
        ach16Desc: `Publish your research once.`,
        ach17: `Not a fad?`,
        ach17Desc: `Publish your research twice.`,
        ach18: `I recognize this name!`,
        ach19: `Famous Publicist`,
        ach20: `Senior Writer`,
        ach21: `Lead Author`,
        achTauDesc: `Reach {0}τ.`,
        achPubDesc: `Publish your research {0} times.`,
        sach1: `It's Bright!`,
        sach1Hint: `19 is my favorite number.`,
        sach1Message: `-- do the flashbang dance! --`,
        sach2: `Competition`,
        sach2Hint: `Smoke what everyday?`,
        sach2Message2: `WHO NEEDS ROOTS`,
        sach2Message3: `WHEN YOU HAVE`,
        sach2Message4: `I M A G I N A T I O N`,
        sach3: `Imparnumerophobia`,
        sach3Hint: `I don't like odd numbers.`,
        sach4: `Perfectionist`,
        sach4Hint: `Flawlessness is my speciality.`,
        story1Title: `Circular Reasoning`,
        story1:
`You approach your professor with a problem you found.
You say: "Professor, all other experts in our field keep saying that this cannot be used to further our research.
However, I think I can get something out of it!"
You hand him the paper with the theory:
e^ix = cos(x) + i * sin(x).

He looks at you and says:
"This is Euler's Formula. Are you sure you can get results out of something that has imaginary numbers?"
"Yes! I believe I can!", you reply to him with anticipation.
He gives you the green light to work on the project.`,
        story2Title: `Anticipation`,
        story2:
`As you start your research, you realize that
it is much harder than you anticipated.
You start experimenting with this formula.
However, you cannot figure out how to integrate the graph into your equation yet.
Your motivation is higher than ever though,
and you can't wait to progress further with this.`,
        story3Title: `A Breakthrough`,
        story3:
`After several months of work on this as a side project,
you finally figure it out:
You know how to modify the equation.
You try to modify the cosine value
and give it a new name: 'R'.
You start experimenting with 'R'
and try to figure out what happens
when you modify it.`,
        story4Title: `Complex Progress`,
        story4:
`Interesting.
You see that the modification did something to the partical.
It's not affecting ρ but its doing something.
You decide that doing the same to the complex component is a good idea.
'i' is going to be interesting to deal with...
You name it 'I' and continue your calculations.`,
        story5Title: `A Different Approach`,
        story5:
`Several weeks have passed since you have added 'I' as a component to your research.
However, you observe the growth slow down considerably and worry that your research is all for nothing.
You ask your colleagues what you should do.
One of them says: "Add a variable to multiply the theory with.
Maybe that will help with your progress."
You create a small little variable called: 'a1'.`,
        story6Title: `Explosion`,
        story6:
`It worked!
Your multipliers are doing a great job pushing the theory.
But what if you could go even further?
After all, you have observed the theory for a long time now.
You decide to create a variable called 'a3'. It will have exponential growth.
Is this enough, for the theory to reach its limit?
It nevertheless helps you immensely in your progress.`,
        story7Title: `Exponential Ideas`,
        story7:
`"Of course!
It's a relationship between exponential functions and trigonometry!
Why shouldn't I add an exponent?
Surely, using this, this theory can be pushed to its limit!",
you think to yourself.
You decide to add an exponent to your multipliers.`,
        story8Title: `The End?`,
        story8:
`Summer break has finally arrived.
Maybe it's time for you to quit.
You have pushed this theory to its limit, you think to yourself
that there's nothing more you can do.
You have tried everything you can think of.
It's time to let go.



Or is it...?`,
        story9Title: `A New Beginning`,
        story9:
`Your summer break was beautiful.
You had a great time with your friends.
However, that constant thought of the theory can't get out of your head.
Since the start of summer break, it has plagued you.
"This cannot be the end.", you think.
"There has to be something more! No way its limit is so low!"

You look over the theory again and notice something.
After all this work, how come you never changed the bases of 'b' and 'c'?
You gain motivation and strat work on the theory again.`,
        story10Title: `Frustration`,
        story10:
`You wake up in a sudden panic.
You had a nightmare, of a huge 'i' falling on you.
Another night in your lab.
This has been the 3rd time this week.
Your theory is growing incredibly slow.
You cannot figure out why.
The past weeks have been filled of you
trying to grow this theory as large as you possible can.

More or less successful.

Suddenly, you realize that you forgot to change the base of 'c'.
You think, about how 'a3' is connected to 'c'.
Can this be the step to push the theory to its limit?`,
        story11Title: `The True Ending`,
        story11:
`You finally did it.
You have proven the theory is able to be pushed to its limit.
You are proud of yourself.
Your publications get a massive amount of attention.
One day, your professor reaches out to you:
"You have shown a lot of dedication,
far more than I have ever seen from any student I've ever lectured.
I am retiring this semester. The same as you graduate in.
I got a small job offering for you.
Are you willing to continue in my position?"
You excitingly accept his offer and cannot wait to pursue a career as a professor.


The End.`,
        gameEndPopupTitle: `The End`,
        gameEndPopupText:
`You have reached the end of Euler's Formula. This theory ends at the CT limit of 1e150, it however can go higher (if you really want to push it.)
We hope you enjoyed playing through this, as much as we did, making and designing this theory!

Check out the other Custom Theory that came packaged with the new update: "Convergents to sqrt(2)" after you have played this, if you haven't already!

PS: If you made it this far, DM peanut#6368 about how bad of a language JavaScript is.`,
        gameEndPopupLabel: `Thanks for playing!`,
        gameEndPopupClose: `Close`
    },
    de: {
        rMilestone: `Schalte den realen Komponenten R frei`,
        iMilestone: `Schalte den Imaginären Kompnenten I frei`,
        b2MilestoneDesc: `$\\uparrow b_2$ basis um 0.01`,
        b2MilestoneInfo: `Erhöhere $b_2$ basis um 0.01`,
        c2MilestoneDesc: `$\\uparrow c_2$ basis um 0.0125`,
        c2MilestoneInfo: `Erhöhere $c_2$ basis um 0.0125`,
        achCat1: `Währungen`,
        achCat2: `Meilensteine`,
        achCat3: `Veröfentlichungen`,
        achCat4: `Geheime Erfolge`,
        ach1: `Erste Schritte`,
        ach2: `Anfängers Glück`,
        ach3: `Imaginäre Limitationen`,
        ach4: `Komplexer Fortschritt`,
        ach5: `Hehe`,
        ach6: `Eulers Student`,
        ach7: `Es gibts mehr?`,
        ach8: `Sind wir jetzt fertig?`,
        ach9: `Ein neuer Professor`,
        ach10: `Automatische Analyse`,
        ach10Desc: `Lass dein Maschienenlernalgorithmus die Theorie für dich ausrechnen.`,
        ach11: `Realistische Methoden.`,
        ach11Desc: `Finde heraus wie man R nutzt (Reale Dimensionen)`,
        ach12: `Imaginäre Konzepte`,
        ach12Desc: `Finde heraus wie man I nutzt (Imaginäre Dimensionen)`,
        ach13: `Arithmetische Multiplikation`,
        ach13Desc: `Nutze die Idee deiner Kollegen und füge Multiplikatoren hinzu.`,
        ach14: `Exponentzielels Wachstum`,
        ach14Desc: `Füge einen Exponenten zur Hauptgleichung`,
        ach15: `Säuren und ...Basen?`,
        ach15Desc: `Verändere die Basis von b2.`,
        ach16: `Erstes Mal`,
        ach16Desc: `Veröfentliche deine Forschung ein mal.`,
        ach17: `Keine Modeerscheinung?`,
        ach17Desc: `Veröfentliche deine Forschung zwei mal.`,
        ach18: `Ich kenne diesen Name!`,
        ach19: `Berühmter Veröffentlicher`,
        ach20: `Leitender Schriftsteller`,
        ach21: `Haupautor`,
        achTauDesc: `Erreiche {0}τ.`,
        achPubDesc: `Veröffentliche deine Forschung {0} mal.`,
        sach1: `Es ist Hell!`,
        sach1Hint: `19 ist meine Lieblingszahl.`,
        sach1Message: `-- mach den "flashbang dance"! --`,
        sach2: `Konkurenz`,
        sach2Hint: `Rauche was jeden Tag?`,
        sach2Message2: `WER BRAUCHT WURZELN`,
        sach2Message3: `WENN DU`,
        sach2Message4: `V O R S T E L L U N G HAST`,
        sach3: `Imparnumerophobie`,
        sach3Hint: `Ich mag keine ungraden Zahlen.`,
        sach4: `Perfektionist.`,
        sach4Hint: `Makellosigkeit ist meine Spezialität.`,
        story1Title: `Zirkelschluss`,
        story1:
`Du näherst dich zu deinen Professor mit eine problem was du gefunden hast.
Du sagst: "Professor, all die anderen experten in unseren Field sagen das dies nicht weiter genutzt werden kann für unsere Forschung.
Wiederum, Ich denke Ich kriege etwas daraus!"
Du übergibts ihm die Papiere mit der Theorie:
e^ix = cos(x) + i * sin(x).

Er sieht dich an, und sagt:
"Dies ist die Eulars Formel. Bist du dir sicher das du Ergebnise kriegst auß etwas was Imaginäre Zahlen hat?"
"Ja! Ich glaube dass ich das kann!", Antwortest du ihm with vorfreude.
Er gibt dir das grüne Licht um auf das Projekt zu arbeiten.`,
        story2Title: `Vorfreude`,
        story2:
`Wo du deine Forschung gestartet hast, hast du realisiert.
es ist viel schwerer als du erwarted hast.
Du startest mit der Formel zu experimentieren.
Wiederum, kannst du es nicht Herausfinden den Graph in deine Gleichung zu integrieren.
Deine Motivation is höher als du es jemals gedacht hast.
und du kannst es nicht abwarten weiter zu arbeiten als Nebenprojekt.`,
        story3Title: `Ein Durchbruch`,
        story3:
`Nach mehreren Monaten voller Arbeit als Nebenprojekt,
hast du es endlich herausgefunden:
Du weißt wie man die Funtkion modifiziert
Du versucht der Kosinuswert zu verändern
und gibt es einen neuen Namen: 'R'.
Du startest mit 'R' zu experementieren.
und versuchst herauszufinden was passiert
wenn du es modifizierst.`,
        story4Title: `Komplexer Fortschritt`,
        story4:
`Interesant.
Du siehst das die Modifikationen etwas praktisches gemacht haben.
Es beinflusst ρ nicht, aber es tut etwas.
Du hast dich Entschieden, dasselbe an an den Komplexen Komponent zu machen, und findest es eine gute Idee.
es wird interessant mit 'i' zu handeln...
Du nennst es 'I' und machst deine Berechnungen weiter.`,
        story5Title: `Ein Anderer Weg`,
        story5:
`Mehrere Wochen sind vergangen, seitdem du 'I' als Komponent zu deiner Forschung hinzugefügt hast.
Wiederum, beobachtest du den Zerfall des Wachstums und beängstigt dass all deine Forschung für nichts war,
Du fragst deine Kollegen was du jetzt machen sollst.
Einer von denen sagt: "Füge eine Variable hinzu um die Theorie zu multiplizieren
Vielleicht hilft dies dein Fortschritt."
Du kreierst eine kleine Variable, genannt 'a1'.`,
        story6Title: `Explosion`,
        story6:
`Es funktioniert!
Deine Multiplikatoren machen einen großartige Arbeit deine Theorie zu maximieren.
Aber kann man noch weiter gehen?
Schließlich, hast du die Theorie für eine lange Zeit beobachtet.
Du hast dich Entschieden eine Variable zu kreieren, mit den namen 'a3'. Es wird exponentziales Wacshtum haben.
Ist es genug, deine Theorie die Limitationen zu erreichen?
Aber immerhin hilft es dir immens in deinen Fortschritt.`,
        story7Title: `Expnentzielle Ideen`,
        story7:
`"Natürlich!
Es ist eine Beziehung zwischen Exponentialfunktionen und Trigonometrie!
Wieso sollte ich keinen Exponent hinzufügen?
Sicherlich, die Theorie kann damit zu deren Limitationen kommen!"
Du denkst zu dir.
Du entscheidest dich einen Exponent an deine Multiplikatoren hinzuzufügen.`,
        story8Title: `Das Ende?`,
        story8:
`Sommerferien sind endlich angekommen.
Vielleicht solltest du aufhören.
Du hast die Theorie zu seinen Limitationen getrieben, denkst du zu dir.
Es gibts nichts mehr was du machen kannst.
Du hast alles versucht was möglich ist für deine Gedanken.
Es ist Zeit, loszulassen.



Oder ist es?`,
        story9Title: `Ein Neuer Anfang`,
        story9:
`Deine Sommerferien war wundervoll.
Du hattest eine schöne Zeit mit deinen Freunden.
Wiederum, der konstante Gedanke von der Theorie kommt dir nicht aus den Kopf.
Seit dem Start der Sommerferien, hat es dich Verflucht.
"Dies kann nicht das Ende sein", denkst du dir.
"Es gibt doch sicherlich noch mehr! Niemals ist die Limitation so niedrig."

Du schaust über die Theorie nochmal und es fällt dir was auf.
Nach all der Arbeit, ist dir nie aufgefallen die Basis von 'b' und 'c' zu verändern.
Du bekommst Motivation und fängst wieder an der Theorie zu Arbeiten.`,
        story10Title: `Frustration`,
        story10:
`Du wachst in völliger Panik auf.
Du hatest ein Albtraum, von einem riesigen 'i' was auf dich fällt.
Eine andere Nacht in deinem labor.
Es ist das Dritte mal dieser Woche.
Deine Theorie wächst sehr langsam.
Du weißt aber nicht warum.
Die letzten par Wochen waren voll
dem versuch die Theorie so groß wie möglich zu wachsen lassen.

Mehr oder weniger erfolgreich.

Auf einmal fällt dir auf, du hast die Basis von 'c' vergessen zu ändern.
Du denkst darüber nach wie 'a3' zu 'c' verbunden ist.
Kann dies der Schritt sein die Theorie zu ihrer Limitation zu bringen.`,
        story11Title: `Das Wahre Ende`,
        story11:
`Du hast es geschafft.
Du hast bewiesen dass diese Theorie zu ihrer Limitation gezwungen werden kann.
Du bist Stolz auf dich Selbst.
Deine Veröffentlichungen kriegen massiv viel Aufmerksamkeit.
Auf ein Tag, kommt der Professor zu dir.
"Du hast viel hingabe gegeben,
viel mehr als dass was ich jemals gesehen habe, von jeglichen Studenten den ich unterichtet habe.
Ich werde dieses Semester in Rente gehen, dass selbe wo du auch absolviert.
Ich habe ein kleinen Job für dich.
Willst du meine Position einnehmen und weitermachen?"
Du nehmst sein Angebot mit freude an und kannst es kaum abwarten eine Karriere als Professor zu machen.


Das Ende.`,
        gameEndPopupTitle: `Das Ende`,
        gameEndPopupText:
`Du hast das Ende der Eulars Formel erreicht. Diese Theorie endet mit dem CT Limitation von 1e600, wiederum kannst du noch Höher gehen (wenn du dies wirklich willst.)
Wir hoffen das du spaß am durchspielen hattest, wie wir das Desing und des kreierens dieser Theorie!

Sieh dich auch bei der Anderen CT, Konvergenz zur Wurzel von 2, die auch in diesem Update Paket mit dazu gekommen sind, nachdem du dies gespielt hast, wenn du sie noch nicht gespielt hast.

PS: Wenn du es so weit Geschaft hast, dann PN "peanut#6368" wie schlecht die sprache JavaScript ist.`,
        gameEndPopupLabel: `Danke für das Spielen!`,
        gameEndPopupClose: `Schließen`
    },
    ja: {
        rMilestone: `実数成分 R を解禁`,
        iMilestone: `虚数成分 I を解禁`,
        b2MilestoneDesc: `$\\uparrow b_2$ の指数を 0.01 増加`,
        b2MilestoneInfo: `$b_2$ の指数を 0.01 増加`,
        c2MilestoneDesc: `$\\uparrow c_2$ の指数を 0.0125 増加`,
        c2MilestoneInfo: `$c_2$ の指数を 0.0125 増加`,
        achCat1: `お金`,
        achCat2: `マイルストーン`,
        achCat3: `出版`,
        achCat4: `隠し実績`,
        ach1: `はじまり`,
        ach2: `ビギナーズラック`,
        ach3: `想像上の限界`,
        ach4: `複雑な進歩`,
        ach5: `ナイス`,
        ach6: `オイラーの弟子`,
        ach7: `まだあるの？`,
        ach8: `まだ終わらないの？`,
        ach9: `新たな教授`,
        ach10: `自動分析`,
        ach10Desc: `機械学習アルゴリズムに理論を計算させよう。`,
        ach11: `現実的な手法`,
        ach11Desc: `R (実数次元) の使い方を把握する。`,
        ach12: `想像上の概念`,
        ach12Desc: `I (虚数次元) の使い方を把握する。`,
        ach13: `算術乗算`,
        ach13Desc: `同期の学生によるアイデアを用いて乗数を加える。`,
        ach14: `指数成長`,
        ach14Desc: `メインの方程式に指数を加える。`,
        ach15: `酸と・・・塩基？`,
        ach15Desc: `b2の底に変更を加える。`,
        ach16: `初回`,
        ach16Desc: `あなたの研究を発表する。`,
        ach17: `流行ってない？`,
        ach17Desc: `あなたの研究を再び発表する。`,
        ach18: `この名前に見覚えがある！`,
        ach19: `有名な出版者`,
        ach20: `熟年ライター`,
        ach21: `主要著者`,
        achTauDesc: `{0}τ に達成する`,
        achPubDesc: `あなたの研究を {0} 回発表する。`,
        sach1: `まぶしい！`,
        sach1Hint: `19は私の好きな数字です。`,
        sach1Message: `-- フラッシュバン・ダンスを踊れ！ --`,
        sach2: `競争`,
        sach2Hint: `毎日何を吸う？`,
        sach2Message2: `誰が根号を必要とするんだ！`,
        sach2Message3: `お前が`,
        sach2Message4: `IMAGINATIONを持っているというのに！！！！`,
        sach3: `奇数恐怖症`,
        sach3Hint: `私は奇数が嫌いです。`,
        sach4: `完璧主義者`,
        sach4Hint: `完璧さは私の長所です。`,
        story1Title: `循環論法`,
        story1:
`あなたは自分が見つけた問題を教授に持ちかけた。
あなたは「教授、この分野の他の専門家達は、これは私たちの研究の発展に使えないと言い続けています。」
あなたは教授にこう言いました。
そしてあなたは理論が書かれた紙を彼に渡します。
"e^ix = cos(x) + i * sin(x)"

彼はあなたを見てこう言う。
「これはオイラーの公式です。虚数を含むようなもので結果を得られると本当に思いますか？」
「はい！出来ると信じています！」と、あなたは期待に胸を膨らませて返事をする。
教授はこのプロジェクトに取り組むことを許可しました。`,
        story2Title: `期待`,
        story2:
`研究を開始すると、あなたは気付きました。
「これは予想以上に難しいものだ」と。
あなたはこの公式を用いて実験を始めます。
しかし、グラフを方程式に統合する方法がわかりません。
それでもやる気はいつも以上に高まっており、
更なる進歩を待ち遠しく思います。`,
        story3Title: `大躍進`,
        story3:
`数か月にも渡るサイドプロジェクトとしての取り組みの後、
あなたはついに解明しました
どのように方程式を手入れするか。
コサイン値の変更を試みて、
新たに 'R' と名付けます。
あなたは 'R' を用いて実験を開始し、
何か変更を加えることでどのようなことが起こるか
あなたは解明しようと試みます。`,
        story4Title: `複雑な進捗`,
        story4:
`面白い。
あなたの変更がどこかに何かをしました。
ρには影響を与えていないが、何かをしています。
あなたは虚数成分に同様の操作を行うことに決めます。
i' を扱えばより面白くなるだろう・・・
あなたはこれを 'I' と名付けて、計算を続けます。`,
        story5Title: `異なるアプローチ`,
        story5:
`成分 'I' を研究に取り入れてから数週間が経ちました。
しかし、成長は著しく遅くなり、これまでの研究が無駄になるのではないかと心配します。
あなたは同期の学生に自分がどうすべきかを尋ねます。
その中の一人は「理論に乗数を追加してみてよ。
それがもしかしたら進展に役立つかもしれない。」
あなたは小さな変数 'a1' を作ります。`,
        story6Title: `爆発`,
        story6:
`上手くいった！
あなたの乗数は理論を推し進めるのに大いに役立っています。
でも、さらに進める方法があるのでは？
結局、この理論を長い間観察してきました。
変数 'a3' を作り、指数関数的成長を持たせることにします。
これは理論が限界にまで達するのに充分だろうか？
それでも進展には大いに役立ちます。`,
        story7Title: `指数的発想`,
        story7:
`「やっぱり！
これは指数関数と三角法が繋がってる！
なぜ指数を追加しないのか？
確かにこれを使えばこの理論を限界まで推し進めることができるぞ！」
とあなたは考えます。
乗数に指数を追加することにします。`,
        story8Title: `終わり？`,
        story8:
`ついに夏休みがやってきました。
そろそろ辞める頃合いかもしれません。
この理論を限界まで推し進めたので、
もうこれ以上できることは無いと思います。
あなたは思いつくこと全てを試しました。
もう手放す時です。



いや、そうでもないのか・・・？`,
        story9Title: `新たなはじまり`,
        story9:
`夏休みは輝いていた。
友達と素晴らしい時間を過ごした。
しかし、この理論についての考えが頭から離れません。
夏休みが始まって以来、ずっとあなたを悩ませてきました。
「これが終わりであるはずがない！」そう考える。
「まだ何かがあるはずだ！限界がこんなに低いわけがない！」
理論をもう一度見直して、とあることに気付きました。
これだけの作業の後に、なぜ 'b' と 'c' の底を一度たりとも変更しなかったのか？
やる気を取り戻して、理論に対して作業を再開します。`,
        story10Title: `欲求不満`,
        story10:
`あなたは突然パニックになり、目覚めます。
巨大な 'i' が自分に降り注ぐ悪夢を見ました。
実験室での一夜。
今週でこれが３回目です。
理論の成長が非常に遅いです。
なぜかはわかりません。
今までの過去数週間において、
あなたは理論をできる限り大きくしようとしました。

多かれ少なかれ成功した。

突然、cの底を変更し忘れていることに気付きました。
あなたはどのようにa3をcに繋げるか考える。
これは理論を限界まで押し上げる一歩となるのだろうか？`,
        story11Title: `真のエンディング`,
        story11:
`あなたはついに成し遂げた。
理論を限界まで押し進められることを証明した。
自分のことが誇らしい。
あなたの論文は大きな注目を集めている。
ある日、教授から連絡が来る。
「君は本当によく頑張ってくれた。
これまで教えてきた学生の中でも、ここまで打ちこんだ人はいなかったよ。
私は今学期で退職する。ちょうど君が卒業するのと同じタイミングだ。
君にちょっとした仕事の話がある。
私の後任として引き継いでくれないか？」
あなたは胸を躍らせてその申し出を受け、教授としてのキャリアを歩み出すのが待ちきれなくなっている。
終わり。`,
        gameEndPopupTitle: `終わり`,
        gameEndPopupText:
`あなたは「Euler's Formula」の限界に到達しました。この理論はCT上限の1e600で一区切りですが、（あなたが望むならば）さらに上を目指すこともできます。私たちがこの理論を作って設計したのと同じくらい、あなたにも楽しんでもらえていたら嬉しいです！

新しいアップデートには、他にもカスタム理論「Convergents to sqrt(2)」が同梱されています。もしまだ遊んでいないのであれば、これを遊び終わったあとにぜひそちらもチェックしてみてください！

追伸：ここまで到達した人はJavaScriptがどれだけダメな言語かについてpeanut#6368にDMしてね`,
        gameEndPopupLabel: `遊んでくれてありがとう！`,
        gameEndPopupClose: `閉じる`
    },
    ru: {
        rMilestone: `Разблокировать действительную часть R`,
        iMilestone: `Разблокировать мнимую часть I`,
        b2MilestoneDesc: `$\\uparrow$ основание $b_2$ на 0.01`,
        b2MilestoneInfo: `Увеличивает основание $b_2$ на 0.01`,
        c2MilestoneDesc: `$\\uparrow$ основание $c_2$ на 0.0125`,
        c2MilestoneInfo: `Увеличивает основание $c_2$ на 0.0125`,
        achCat1: `Валюты`,
        achCat2: `Цели`,
        achCat3: `Публикации`,
        achCat4: `Секретные достижения`,
        ach1: `Начало начал`,
        ach2: `Новичкам везёт`,
        ach3: `Мнимые пределы`,
        ach4: `Комплексный прогресс`,
        ach5: `Nice`,
        ach6: `Студент Эйлера`,
        ach7: `Есть ещё?`,
        ach8: `Мы уже закончили?`,
        ach9: `Новый профессор`,
        ach10: `Автоматический анализ`,
        ach10Desc: `Позвольте алгоритму машинного обучения рассчитывать теорию за Вас.`,
        ach11: `Действительные методы`,
        ach11Desc: `Поймите, как использовать R (действительное измерение).`,
        ach12: `Мнимые концепты`,
        ach12Desc: `Поймите, как использовать I (мнимое измерение).`,
        ach13: `Арифметическое умножение`,
        ach13Desc: `Воспользуйтесь идеей своих коллег и добавьте множитель.`,
        ach14: `Экспоненциалный рост`,
        ach14Desc: `Добавьте экспоненту в главное уравнение.`,
        ach15: `Кислоты и... основания?`,
        ach15Desc: `Измените основание b2.`,
        ach16: `Первый раз`,
        ach16Desc: `Опубликуйте своё исследование один раз.`,
        ach17: `Это не прихоть?`,
        ach17Desc: `Опубликуйте своё исследование два раза.`,
        ach18: `Я знаю это имя!`,
        ach19: `Известный публикатор`,
        ach20: `Старший автор`,
        ach21: `Главный автор`,
        achTauDesc: `Достигните {0}τ.`,
        achPubDesc: `Опубликуйте своё исследование {0} раз.`,
        sach1: `Так ярко!`,
        sach1Hint: `19 — моё любимое число.`,
        sach1Message: `-- танцуй flashbang dance! --`,
        sach2: `Соревнование`,
        sach2Hint: `Курить что каждый день?`,
        sach2Message2: `КОМУ НУЖНЫ КОРНИ,`,
        sach2Message3: `КОГДА У ТЕБЯ ЕСТЬ`,
        sach2Message4: `В О О Б Р А Ж Е Н И Е`,
        sach3: `Нумерофобия`,
        sach3Hint: `Я не люблю нечётные числа.`,
        sach4: `Перфекционист`,
        sach4Hint: `Безупречность - моя особенность.`,
        story1Title: `Круговое рассуждение`,
        story1:
`Вы подходите к своему профессору с задачей, которую нашли.
Вы говорите: "Профессор, все другие эксперты в нашей области говорят, что это не получится использовать для дальнейших исследований.
Однако я думаю, что у меня выйдет что-то из этого извлечь!"
Вы протягиваете ему бумажку с теорией:
e^ix = cos(x) + i * sin(x).

Он смотрит на Вас и говорит:
"Это формула Эйлера. Вы уверены, что сможете получить результат из чего-то, что содержит мнимые числа?"
"Да! Я уверен, что смогу!" — Вы отвечаете ему с нетерпением.
Он даёт Вам зелёный свет на работу над проектом.`,
        story2Title: `Предвкушение`,
        story2:
`С началом исследования Вы понимаете,
что всё намного труднее, чем Вы ожидали.
Вы начинаете экспериментировать с данной формулой.
Однако вы пока не можете понять, как интегрировать график в уравнение.
Ваша мотивация высока, как никогда,
и Вам не терпится продвинуться дальше.`,
        story3Title: `Прорыв`,
        story3:
`После нескольких месяцев работы над этим сторонним проектом
Вы наконец-то догадываетесь:
Вы знаете, как модифицировать уравнение.
Вы пытаетесь изменить значение косинуса
и даётe ему новое имя: 'R'.
Вы начинаете экспериментировать с 'R'
и пытаетесь понять, что происходит, 
когда Вы изменяете его.`,
        story4Title: `Комплексный прогресс`,
        story4:
`Интересно.
Вы замечаете, что модификация повлияла на частицу.
Это не влияет на ρ, но все равно что-то делает.
Вы решаете, что сделать то же самое с мнимой частью — хорошая идея.
С 'i' будет интересно разбираться...
Вы называете это 'I' и продолжаете свои расчёты.`,
        story5Title: `Другой подход`,
        story5:
`С того, как Вы добавили 'I' в своё исследование, прошло несколько недель.
Однако, Вы замечаете, что рост существенно замедлился, и волнуетесь, что Ваше исследование ничего не стоит.
Вы спрашиваете у коллег, как Вам поступить.
Один из них говорит: "Добавьте переменную, чтобы умножать теорию на неё.
Возможно, это поможет с прогрессом."
Вы создаёте маленькую переменную 'a1'.`,
        story6Title: `Взрыв`,
        story6:
`Это сработало!
Ваши множители прекрасно справляются с продвижением в теории.
Но что, если пойти ещё дальше?
В конце концов, Вы уже давно наблюдаете за этой теорией.
Вы решаете создать переменную 'a3', которая будет иметь экспоненциальный рост.
Хватит ли этого для достижения предела теории?
Тем не менее, это очень поможет Вам в Вашем прогрессе.`,
        story7Title: `Степенные идеи`,
        story7:
`"Конечно!
Это отношение между показательными функциями и тригонометрией!
Почему бы мне не добавить степень?
Безусловно, используя это, можно довести теорию до предела!",
Вы думаете про себя.
Вы решаете возвести множители в степень.`,
        story8Title: `Конец?`,
        story8:
`Наконец-то наступили летние каникулы.
Возможно, настало время уйти.
Вы думаете, что довели теорию до предела
и что с ней больше ничего нельзя сделать.
Вы испробовали всё, что могли.
Настало время отпустить.



Или же...?`,
        story9Title: `Новое начало`,
        story9:
`Летние каникулы были прекрасны.
Вы хорошо повеселились со своими друзьями.
Однако постоянные мысли о теории не уходят у Вас из головы.
Они мучили Вас с самого начала летних каникул.
"Это не может быть концом.", — думаете Вы.
"Должно быть что-то большее! Не может быть, что предел настолько мал!"

Вы снова просматриваете теорию и что-то замечаете.
После всего этого труда Вы никогда не изменяли основания 'b' и 'c'?
Вы обретаете мотивацию и снова начинаете работать над теорией.`,
        story10Title: `Разочарование`,
        story10:
`Вы просыпаетесь от внезапной паники.
Вам приснился кошмар о том, как на Вас падает огромная 'i'.
Ещё одна ночь в лабораторной
За эту неделю это случилось третий раз.
Теория растёт невероятно медленно.
Вы не понимаете, почему.
Последние недели были наполнены Вашими попытками
развить эту теорию настолько, насколько это возможно..

Более или менее успешно.

Внезапно Вы осознаёте, что Вы забыли изменить основание 'c'.
Вы думаете о том, как 'a3' связан с 'c'.
Может ли это стать тем шагом, который позволит довести теорию до предела?`,
        story11Title: `Настоящий конец`,
        story11:
`Вы наконец-то сделали это.
Вы доказали, что теорию возможно довести до её предела
Вы горды собой.
Ваши публикации привлекают большое количество внимания.
Однажды к Вам обращается профессор:
"Вы проявили большое стремление,
намного большее, чем любой студент, у которого я когда-либо преподавал.
В этом семестре я ухожу с поста. В том же, в котором Вы выпускаетесь.
У меня для Вас есть небольшое предложение по работе.
Вы хотите занять моё место?"
Вы с радостью соглашаетесь и не можете дождаться продолжения карьеры в качестве профессора.


Конец.`,
        gameEndPopupTitle: `Конец`,
        gameEndPopupText:
`Вы достигли конца Формулы Эйлера. Эта теория закачивается на границе пользовательских теорий в 1e150, однако в неё можно играть и дальше (если Вы реально хотите добиться больших значений).
Мы надеемся, что Вам понравилось играть в нашу теорию настолько же, насколько нам понравилось её делать!

Можете поиграть в другую пользовательскую теорию, которая вышла в этом же обновлении: "Приближение к корню из двух" ("Convergents to sqrt(2))" после того, как сыграете в эту, если ещё не играли!

PS: Если Вы это читаете, можете написать в ЛС peanut#6368 о том, насколько JavaScript — плохой язык.`,
        gameEndPopupLabel: `Спасибо за игру!`,
        gameEndPopupClose: `Закрыть`
    },
    uk: {
        rMilestone: `Відкрити дійсну частину R`,
        iMilestone: `Відкрити уявну частину I`,
        b2MilestoneDesc: `$\\uparrow основу b_2$ на 0.01`,
        b2MilestoneInfo: `Збільшує основу b_2$ на 0.01`,
        c2MilestoneDesc: `$\\uparrow основу c_2$ на 0.0125`,
        c2MilestoneInfo: `Збільшує основу c_2$ на 0.0125`,
        achCat1: `Валюти`,
        achCat2: `Цілі`,
        achCat3: `Публікації`,
        achCat4: `Секретні досягнення`,
        ach1: `Початок роботи`,
        ach2: `Вдача початківця`,
        ach3: `Границі уявного`,
        ach4: `Комплексний прогрес`,
        ach5: `Nice`,
        ach6: `Студент Ейлера`,
        ach7: `Тут ще?`,
        ach8: `Ми закінчили?`,
        ach9: `Новий Професор`,
        ach10: `Автоматичний аналіз`,
        ach10Desc: `Дозволь алгоритму машинного навчання рахувати теорію за тебе.`,
        ach11: `Дійсні методи`,
        ach11Desc: `Зрозумій, як використовувати R (дійсний вимір).`,
        ach12: `Уявні концепції`,
        ach12Desc: `Зрозумій, як використовувати R (дійсний вимір).`,
        ach13: `Арифметичне множення`,
        ach13Desc: `Скористайся їдеєю колег і введи множник.`,
        ach14: `Експоненційний ріст`,
        ach14Desc: `Додай до твого основного рівняння показник степеня.`,
        ach15: `Кислоти й... основи?`,
        ach15Desc: `Зміни основу b2.`,
        ach16: `Вперше`,
        ach16Desc: `Однократно опублікуй своє дослідження.`,
        ach17: `Чи не примха?`,
        ach17Desc: `Опублікуй дослідження двічі.`,
        ach18: `Я знаю це ім'я!`,
        ach19: `Відомий публіцист`,
        ach20: `Старший автор`,
        ach21: `Провідний автор`,
        achTauDesc: `Досягни {0}τ.`,
        achPubDesc: `Опублікуй своє дослідження {0} разів.`,
        sach1: `Так яскраво!`,
        sach1Hint: `19 — моє улюблене число.`,
        sach1Message: `-- роби танець з "Flashbang Dance"! --`,
        sach2: `Змагання`,
        sach2Hint: `Куриш щодня що?`,
        sach2Message2: `КОМУ ПОТРІБНІ КОРЕНІ`,
        sach2Message3: `КОЛИ У ТЕБЕ Є`,
        sach2Message4: `У Я В А`,
        sach3: `Імпарнумерофобія`,
        sach3Hint: `Я не люблю непарні числа.`,
        sach4: `Перфекціоніст`,
        sach4Hint: `Бездоганність — моя особливість.`,
        story1Title: `Кругові міркування`,
        story1:
`Ти звертаєшся до свого професора зі знайденою проблемою.
Кажеш: "Професоре, всі інші експерти в нашій галузі стверджують, що це не може бути використано для нашого подальшого дослідження.
Однак, я вважаю, що у мене щось вийде з цього!"
Ти простягаєш йому аркуш з теорією:
e^ix = cos(x) + i * sin(x).

Він дивиться на тебе і каже:
"Це формула Ейлера. Ви впевнені, що ви зможете отримати результати з чогось, що має уявні числа?"
"Так! Я вірю, що зможу!", ти відповідаєш йому з очікуванням.
Він дає тобі зелене світло для праці над проєктом.`,
        story2Title: `Передчуття`,
        story2:
`Після початку дослідження, тобі стало зрозуміло, що
це набагато складніше, ніж ти очікував.
Ти починаєш експериментувати з цією формулою.
Однак, ти поки не можеш осягнути, як зінтегрувати графік у твоє рівняння.
Проте твоя мотивація вища, ніж будь-коли,
і ти не можеш дочекатися подальшого прогресу.`,
        story3Title: `Прорив`,
        story3:
`Після кількох місяців роботи над цим як стороннім проєктом,
тобі нарешті стало зрозуміло:
Ти знаєш, як модифікувати рівняння.
Ти намагаєшся модифікувати значення косинуса
і даєш йому нове ім'я: 'R'.
Ти починаєш експериментувати з 'R'
і намагаєшся зрозуміти, що зміниться
після цього.`,
        story4Title: `Комплексний прогрес`,
        story4:
`Цікаво.
Ти бачиш, що модифікація вплинула на частинку.
Вона не впливає на ρ, але при цьому щось робить.
Ти вирішуєш, що зробити те ж саме з комплексною частиною — гарна ідея.
З 'і' це може бути цікаво...
Ти називаєш це 'I' і продовжуєш обчислення.`,
        story5Title: `Інший підхід`,
        story5:
`Минуло кілька тижнів, відколи ти додав 'I' до свого дослідження.
Однак, ти помічаєш значне уповільнення росту, і переживаєш, що твої дослідження марні.
Ти звертаєшся до своїх колег за порадою.
Один з них каже: "Додай змінну, щоб помножити на неї теорію.
Можливо, це допоможе з твоїм прогресом."
Ти створюєш невелику змінну під назвою 'a1'.`,
        story6Title: `Вибух`,
        story6:
`Це спрацювало!
Твої множники успішно просувають теорію вперед.
Але що, якщо можна піти ще далі?
Адже ти давно спостерігаєш за розвитком теорії.
Ти вирішуєш додати нову змінну 'a3', яка матиме експоненційний ріст.
Чи достатньо цього, щоб теорія досягнула своїх меж?
Однак вона надзвичайно сприятиме твоєму прогресу.`,
        story7Title: `Степеневі ідеї`,
        story7:
`"Звичайно!
Це зв’язок між показниковими функціями та тригонометрією!
Чому б мені не додати степінь?
Безсумнівно, з цим теорія досягне своїх меж!" —
ти думаєш собі.
Ти вирішуєш додати степінь до своїх множників.`,
        story8Title: `Кінець?`,
        story8:
`Нарешті настали літні канікули.
Можливо, настав час зупинитись.
Ти думаєш, що довів теорію до її меж,
що більше нічого не можна покращити.
Ти спробував усе можливе.
Настав час відпустити.



Чи ні...?`,
        story9Title: `Новий початок`,
        story9:
`Твої літні канікули були прекрасними.
Ти гарно провів час зі своїми друзями.
Однак, постійна думка про теорію не залишала твій розум.
З самого початку канікул вона мучила тебе.
"Це не може бути кінцем." — думаєш ти.
"Щось має бути ще! Неможливо, щоб межа теорії була такою малою!"

Ти переглядаєш теорію і раптом помічаєш:
Чому після всієї цієї роботи ти ніколи не змінював основи 'b' і 'c'?
Ти отримуєш нову хвилю мотивації і знову починаєш працювати над теорією.`,
        story10Title: `Розчарування`,
        story10:
`Ти прокидаєшся у раптовій паніці.
Тобі приснився кошмар, де на тебе падало величезне 'i'.
Чергова ніч у твоїй лабораторії.
Це вже втретє за цей тиждень.
Твоя теорія росте надзвичайно повільно.
Ти не можеш збагнути, чому.
Останні тижні ти намагався
збільшити теорію якнайбільше.

Більш-менш успішно.

Раптом ти розумієш, що забув змінити основу 'c'.
Ти розмірковуєш, як 'а3' може бути пов'язане з 'c'.
Чи може це стати кроком до доведення теорії до її завершення?`,
        story11Title: `Справнє закінчення`,
        story11:
`Нарешті тобі вдалося.
Ти довів, що теорію можна довести до її меж.
Ти пишаєшся собою.
Твої публікації привертають багато уваги.
Одного дня до тебе звертається професор:
"Ви продемонстрували велику відданість,
набагато більше, ніж я коли-небудь бачив від будь-якого студента, якому читав лекції.
Цього семестру я йду на пенсію. У тому самому, в якому ви закінчуєте навчання.
Я маю для вас невелику пропозицію роботи.
Чи бажаєте ви зайняти мою посаду?"
Ти з радістю погоджуєшся і нетерпляче чекаєш на продовження своєї кар’єри професором.


Кінець.`,
        gameEndPopupTitle: `Кінець`,
        gameEndPopupText:
`Ти дійшов до кінця теорії "Формули Ейлера". Вона завершується на межі СТ 1e600, хоча теоретично може бути ще вищою (якщо ти дійсно хочеш її штовхати).
Сподіваємося, тобі сподобалося досліджувати цю теорію так само, як і нам — створювати та проектувати її!

Глянь іншу спільностну теорію, що надійшла з новим оновленням: "Convergents to sqrt(2)" ("Збіжність до sqrt(2)"), якщо ти ще цього не зробив!
PS: Якщо ти дійшов так далеко, напишіть у приватні повідомлення mjzpeanut, щоб поскаржитися, наскільки поганою є мова JavaScript.`,
        gameEndPopupLabel: `Дякуємо за гру!`,
        gameEndPopupClose: `Закрити`
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
    theory.setMilestoneCost(new CustomCost(total => BigNumber.from(getCustomCost(total)*tauMultiplier)));

    {
        dimension = theory.createMilestoneUpgrade(0, 2);
        dimension.getDescription = () => dimension.level == 0 ? getLoc('rMilestone') : getLoc('iMilestone');
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
        b_base.getDescription = (_) => getLoc('b2MilestoneDesc');
        b_base.getInfo = (_) => getLoc('b2MilestoneInfo');
        b_base.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); }
        b_base.canBeRefunded = (_) => c_base.level == 0;
    }

    {
        c_base = theory.createMilestoneUpgrade(4, 2);
        c_base.getDescription = (_) => getLoc('c2MilestoneDesc');
        c_base.getInfo = (_) => getLoc('c2MilestoneInfo');
        c_base.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); }
    }

    // Achievements
    let achievement_category_1 = theory.createAchievementCategory(0, getLoc('achCat1'));
    let achievement_category_2 = theory.createAchievementCategory(1, getLoc('achCat2'));
    let achievement_category_3 = theory.createAchievementCategory(2, getLoc('achCat3'));
    let achievement_category_4 = theory.createAchievementCategory(3, getLoc('achCat4'));

    let e10 = BigNumber.from(1e10).pow(tauMultiplier);
    let e20 = BigNumber.from(1e20).pow(tauMultiplier);
    let e25 = BigNumber.from(1e25).pow(tauMultiplier);
    let e50 = BigNumber.from(1e50).pow(tauMultiplier);
    let e69 = BigNumber.from(1e69);
    let e75 = BigNumber.from(1e75).pow(tauMultiplier);
    let e100 = BigNumber.from(1e100).pow(tauMultiplier);
    let e125 = BigNumber.from(1e125).pow(tauMultiplier);
    let e150 = BigNumber.from(1e150).pow(tauMultiplier);
    theory.createAchievement(0, achievement_category_1, getLoc('ach1'), Localization.format(getLoc('achTauDesc'), '1e40'), () => theory.tau > e10);
    theory.createAchievement(1, achievement_category_1, getLoc('ach2'), Localization.format(getLoc('achTauDesc'), '1e80'), () => theory.tau > e20);
    theory.createAchievement(2, achievement_category_1, getLoc('ach3'), Localization.format(getLoc('achTauDesc'), '1e100'), () => theory.tau > e25);
    theory.createAchievement(3, achievement_category_1, getLoc('ach4'), Localization.format(getLoc('achTauDesc'), '1e200'), () => theory.tau > e50);
    theory.createAchievement(4, achievement_category_1, getLoc('ach5'), Localization.format(getLoc('achTauDesc'), '1e69'), () => theory.tau > e69);
    theory.createAchievement(5, achievement_category_1, getLoc('ach6'), Localization.format(getLoc('achTauDesc'), '1e300'), () => theory.tau > e75);
    theory.createAchievement(6, achievement_category_1, getLoc('ach7'), Localization.format(getLoc('achTauDesc'), '1e400'), () => theory.tau > e100);
    theory.createAchievement(7, achievement_category_1, getLoc('ach8'), Localization.format(getLoc('achTauDesc'), '1e500'), () => theory.tau > e125);
    theory.createAchievement(8, achievement_category_1, getLoc('ach9'), Localization.format(getLoc('achTauDesc'), '1e600'), () => theory.tau > e150);

    theory.createAchievement(9, achievement_category_2, getLoc('ach10'), getLoc('ach10Desc'), () => theory.isAutoBuyerAvailable);
    theory.createAchievement(10, achievement_category_2, getLoc('ach11'), getLoc('ach11Desc'), () => dimension.level > 0);
    theory.createAchievement(11, achievement_category_2, getLoc('ach12'), getLoc('ach12Desc'), () => dimension.level > 1);
    theory.createAchievement(12, achievement_category_2, getLoc('ach13'), getLoc('ach13Desc'), () => a_base.level > 0);
    theory.createAchievement(13, achievement_category_2, getLoc('ach14'), getLoc('ach14Desc'), () => a_exp.level > 0);
    theory.createAchievement(14, achievement_category_2, getLoc('ach15'), getLoc('ach15Desc'), () => b_base.level > 0);

    theory.createAchievement(15, achievement_category_3, getLoc('ach16'), getLoc('ach16Desc'), () => num_publications >= 1);
    theory.createAchievement(16, achievement_category_3, getLoc('ach17'), getLoc('ach17Desc'), () => num_publications >= 2);
    theory.createAchievement(17, achievement_category_3, getLoc('ach18'), Localization.format(getLoc('achPubDesc'), '5'), () => num_publications >= 5);
    theory.createAchievement(18, achievement_category_3, getLoc('ach19'), Localization.format(getLoc('achPubDesc'), '10'), () => num_publications >= 10);
    theory.createAchievement(19, achievement_category_3, getLoc('ach20'), Localization.format(getLoc('achPubDesc'), '25'), () => num_publications >= 25);
    theory.createAchievement(20, achievement_category_3, getLoc('ach21'), Localization.format(getLoc('achPubDesc'), '50'), () => num_publications >= 50);


    // stop spoiling yourselves and figure out yourselves, what the SA's are !
    s_achievement_1 = theory.createSecretAchievement(21, achievement_category_4, getLoc('sach1'), s_achievement_1_description, getLoc('sach1Hint'), () => s1Proof());
    s_achievement_2 = theory.createSecretAchievement(22, achievement_category_4, getLoc('sach2'), s_achievement_2_description, getLoc('sach2Hint'), () => s2Proof());
    s_achievement_3 = theory.createSecretAchievement(23, achievement_category_4, getLoc('sach3'), s_achievement_3_description, getLoc('sach3Hint'), () => s3Proof());
    s_achievement_4 = theory.createSecretAchievement(24, achievement_category_4, getLoc('sach4'), s_achievement_4_description, getLoc('sach4Hint'), () => s4Proof());


    // Story Chapters
    theory.createStoryChapter(0, getLoc('story1Title'), getLoc('story1'), () => q1.level == 0); // unlocked at beginning of the theory
    theory.createStoryChapter(1, getLoc('story2Title'), getLoc('story2'), () => currency.value > BigNumber.from(1e7)); // unlocked at rho = 1e7
    theory.createStoryChapter(2, getLoc('story3Title'), getLoc('story3'), () => dimension.level == 1); // unlocked at R dimension milestone
    theory.createStoryChapter(3, getLoc('story4Title'), getLoc('story4'), () => dimension.level == 2); // unlocked at I dimension milestone
    theory.createStoryChapter(4, getLoc('story5Title'), getLoc('story5'), () => a_base.level == 1); // unlocked at a_base first milestone
    theory.createStoryChapter(10, getLoc('story6Title'), getLoc('story6'), () => a_base.level == 3); // unlocked at a_base last milestone
    theory.createStoryChapter(5, getLoc('story7Title'), getLoc('story7'), () => a_exp.level == 1); // unlocked at a_exponent first milestone
    theory.createStoryChapter(6, getLoc('story8Title'), getLoc('story8'), () => (a_base.level == 3 && a_exp.level == 5)); // unlocked at a_exp and a_base max milestone
    theory.createStoryChapter(7, getLoc('story9Title'), getLoc('story9'), () => b_base.level > 0); // unlocked at tau = e100 (b2 first milestone)
    theory.createStoryChapter(8, getLoc('story10Title'), getLoc('story10'), () => c_base.level > 0); // unlocked at tau = e120 (c2 first milestone)
    theory.createStoryChapter(9, getLoc('story11Title'), getLoc('story11'), () => predicateAndCallbackPopup()); // unlocked at tau = e600 (finished)

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

var getInternalState = () => `${num_publications} ${q.toBase64String()} ${t.toBase64String()} ${scale}`

var setInternalState = (state) => {
    const bigNumberFromBase64OrParse = (value) => {
        let result;
        try { result = BigNumber.fromBase64String(value); } catch { result = parseBigNumber(value); };
        return result;
    }

    let values = state.split(" ");
    if (values.length > 0) num_publications = parseInt(values[0]);
    if (values.length > 1) q = bigNumberFromBase64OrParse(values[1]);
    if (values.length > 2) t = bigNumberFromBase64OrParse(values[2]);
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
    title: getLoc('gameEndPopupTitle'),
    content: ui.createStackLayout({
        children: [
            ui.createFrame({
                heightRequest: 309,
                cornerRadius: 0,
                content: ui.createLabel({text: "\n" + getLoc('gameEndPopupText'),
                    padding: Thickness(12, 2, 12, 2),
                    fontSize: 15
                })
            }),
            ui.createLabel({
                text: getLoc('gameEndPopupLabel'),
                horizontalTextAlignment: TextAlignment.CENTER,
                fontAttributes: FontAttributes.BOLD,
                fontSize: 18,
                padding: Thickness(0, 18, 0, 18),
            }),
            ui.createButton({text: getLoc('gameEndPopupClose'), onClicked: () => getEndPopup.hide()})
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
        result += "\\text{" + getLoc("sach2Message2") + "}\\\\"
        result += "\\text{" + getLoc("sach2Message3") + "}\\\\"
        result += "\\text{" + getLoc("sach2Message4") + "}"
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
    let result = s_condition ? "\\text{" + getLoc("sach1Message") + "}" : theory.latexSymbol + "=\\max\\rho^{1.6}";
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
var getPublicationMultiplier = (tau) => tau.pow(0.387/tauMultiplier);
var getPublicationMultiplierFormula = (symbol) => symbol + "^{0.09675}";
var isCurrencyVisible = (index) => index == 0 || (index == 1 && dimension.level > 0) || (index == 2 && dimension.level > 1);
var getTau = () => currency.value.pow(BigNumber.from(0.4*tauMultiplier));
var getCurrencyFromTau = (tau) => [tau.max(BigNumber.ONE).pow(2.5/tauMultiplier), currency.symbol];

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
