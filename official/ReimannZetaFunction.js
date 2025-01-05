import { BigNumber } from '../api/BigNumber';
import { ConstantCost, ExponentialCost, FirstFreeCost, StepwiseCost } from '../api/Costs';
import { Localization } from '../api/Localization';
import { QuaternaryEntry, theory } from '../api/Theory';
import { Color } from '../api/ui/properties/Color';
import { Keyboard } from '../api/ui/properties/Keyboard';
import { LayoutOptions } from '../api/ui/properties/LayoutOptions';
import { TextAlignment } from '../api/ui/properties/TextAlignment';
import { Thickness } from '../api/ui/properties/Thickness';
import { ui } from '../api/ui/UI';
import { Utils } from '../api/Utils';
import { Vector3 } from '../api/Vector3';

var id = 'riemann_zeta_f';
var getName = (language) =>
{
    const names =
    {
        en: 'Riemann Zeta Function',
        'zh-Hans': '黎曼 ζ 函数',
        'zh-Hant': '黎曼 ζ 函数',
        es: 'Función Zeta de Riemann',
        fr: 'Fonction Zêta de Riemann',
        ru: 'Дзета-функция Римана',
        uk: 'Дзета-функція Рімана',
        tl: 'Punsiyong Riemann Zeta',
        vi: 'Hàm zeta Riemann'
    };

    return names[language] || names.en;
}
var getDescription = (language) =>
{
    const descs =
    {
        en:
`The function now known as the Riemann zeta function was first defined by Euler for integers greater than 1 as an infinite series:
ζ(s) = 1 + 1/(2^s) + 1/(3^s) + ...
The definition was later extended to real numbers by Chebyshev, and to the complex plane by Riemann. However, as it diverged on all s with a real component less than or equal to 1, a special version of the function had to be defined in order to preserve the continuity of its derivatives. This is known as an analytic continuation, and the zeta function's analytic continuation relates to this infamous meme:
1 + 2 + 3 + 4 + ... = -1/12 = ζ(-1)

In this theory, we will be examining the zeta function on the line perpendicular to the x-axis at x = 0.5, known as the critical line. In 1859, it was hypothesised by Riemann himself that, other than the so-called 'trivial zeroes' lying at negative even integers -2, -4, -6, ..., every other root of the function lies on this critical line.`,
        'zh-Hans':
`黎曼 ζ 函数最早由欧拉提出，在大于 1 的整数上定义为以下无穷级数：
ζ(s) = 1 + 1/(2^s) + 1/(3^s) + ...
后来，这个定义被切比雪夫拓展到实数上，再被黎曼拓展到复数上。然而，由于它在所有实部不超过 1 的 s 上发散，函数必须被重新定义，以在拓展定义域的同时保持各阶导数连续。这被称之为解析延拓。黎曼函数的解析延拓还衍生出了一个著名的梗：
1 + 2 + 3 + 4 + ... = -1/12 = ζ(-1)

在这个理论中，我们将研究黎曼 ζ 函数在 x = 0.5 处垂直于 x 轴的直线上的行为，这条线又被称为临界线。1859 年，黎曼本人猜想，除了位于负偶数 -2、-4、-6、... 处的“平凡零点”之外，黎曼 ζ 函数的其它零点都位于这条临界线上。`,
        'zh-Hant':
`黎曼 ζ 函數由歐拉首次提出，其原始定義是於 s 為任何大於 1 的整數時的無窮級數：
ζ(s) = 1 + 1/(2^s) + 1/(3^s) + ...
這個原始定義在後來先由切比雪夫擴展到實數，再被黎曼擴展到複數。然而，由於它在實部小於等於 1 的所有複數 s 上皆發散，為了保證該函數處處連續，數學家定義了另一個行為相同且定義域更廣的ζ函數。這被稱為解析延拓。這也造成了一個著名的迷因:
1 + 2 + 3 + 4 + ... = -1/12 = ζ(-1)

在這個理論中，我們將探索在 x = 0.5 處垂直於 x 軸的直線（稱為臨界線）上 zeta 函數的行為。 1859 年，黎曼臆測：除了位於負偶數 -2、-4、-6、... 處的所謂“平凡零點”之外，ζ 函數的所有其他根都位於這條臨界線上。`,
        es:
`Esta función conocida como la función de Riemann Zeta fue definida por Euler para los números enteros mayores a 1 como una serie de infinitos:
ζ(s) = 1 + 1/(2^s) + 1/(3^s) + ...
Su definición fue extendida a los números reales gracias a Chebyshev, y luego al plano complejo gracias a Riemann. Sin embargo, a medida que diverge para todo s con un componente real menor o igual a 1, una versión especial de la función fue definida para preservar la continuidad de sus valores derivados. Esta se le conoce como la continuación analítica, y la misma función analítica de la función zeta está relacionada a su infame meme:
1 + 2 + 3 + 4 + ... = -1/12 = ζ(-1)

En esta teoría, examinaremos la función de zeta en la línea perpendicular al eje X cuando x = 0.5, conocido como la ruta crítica. En 1859, fue hipotetizado por el mismo Riemann que, excluyendo a los conocidos "ceros triviales" que permanecen con negativos pares integros -2, -4, -6, ... cada otra raíz de la función yace en esta ruta crítica.`,
        fr:
`Cette fonction, aujourd'hui connue sous le nom de fonction zêta de Riemann, a d'abord été définie par Euler pour les entiers supérieurs à 1 comme une série infinie :
ζ(s) = 1 + 1/(2^s) + 1/(3^s) + ...
Cette définition a été ensuite étendue aux nombres réels par Tchebychev, et au plan complexe par Riemann. Cependant, comme elle divergeait pour tout s avec une partie réelle inférieure ou égale à 1, une version spéciale de la fonction a dû être définie afin de préserver la continuité de ses dérivées. Ceci est appelé prolongement analytique, et le prolongement analytique de la fonction zêta est lié à cet infâme mème :
1 + 2 + 3 + 4 + ... = -1/12 = ζ(-1)

Dans cette théorie, nous examinerons la fonction zêta sur la droite perpendiculaire à l'axe des x à x=0,5, appelée droite critique. En 1859, Riemann lui-même a émis l'hypothèse que, à part les « zéros triviaux » situés aux entiers négatifs pairs -2, -4, -6, ..., toutes les autres racines de la fonction sont situées sur la droite critique.`,
        ru:
`Функция, известная сейчас как дзета-функция Римана, была впервые определена Эйлером для целых чисел больше 1, как бесконечный ряд: 
ζ(s) = 1 + 1/(2^s) + 1/(3^s) + ... 
Позднее определение было расширено Чебышевым на вещественные числа и Риманом на комплексную плоскость. Однако, поскольку ряд расходился при всех значениях s с вещественной частью меньше или равной 1, пришлось определить специальную версию функции, чтобы сохранить непрерывность её производных. Это называется аналитическим продолжением, и аналитическое продолжение дзета-функции связано с этим (печально) известным мемом: 
1 + 2 + 3 + 4 + ... = -1/12 = ζ(-1)

В данной теории мы будем рассматривать дзета-функцию на прямой, перпендикулярной оси x при x = 0.5, известной как критическая прямая. В 1859 году сам Риман предположил, что, за исключением так называемых ""тривиальных нулей"", расположенных в отрицательных чётных целых числах -2, -4, -6, ..., все остальные корни функции лежат на этой критической прямой.`,
        uk:
`Функція, наразі відома як дзета-функція Рімана, вперше була визначена Ейлером для цілих чисел, більших за 1, як нескінчений ряд: 
ζ(s) = 1 + 1/(2^s) + 1/(3^s) + ...
Згодом Чебишов розширив її визначення на дійсні числа, а Ріман — на всю комплексну площину. Однак, оскільки ряд розбіжний при всіх s з дійсною частиною меншою або рівною 1, потрібно було визначити особливе розширення функції, яке б зберегло неперервність її похідних. Це розширення відомо як аналітичне продовження, і аналітичне продовження дзети-функції пов'язане з цим відомим мемом:
1 + 2 + 3 + 4 + ... = -1/12 = ζ(-1)`,
        tl:
`Ang punsiyong ito ay kinikilala bilang Riemann zeta function na siyang unang tinukoy ni Euler para sa mga buong numero na higit sa 1 – bilang isang seryeng walang katiyakan:
ζ(s) = 1 + 1/(2^s) + 1/(3^s) + ...
Ang depinisyon nito ay 'di katagalang pinayabong sa mga tunay na numero ni Chebyshev, at sa mga komplikadong katam ni Riemann. Ngunit, habang ito ay humihiwalay sa lahat ng s na may totoong bahagi na mas mababa o kapantay ng 1, isang namumukod tanging punsiyon ang kinakailangang ilarawan upang mapreserba ang pagpapatuloy ng mga derivatives nito. Ito ay kilala bilang isang analitikal na pagpapatuloy, at ang analitikal na pagpapatuloy ng punsiyong zeta ay ini-ugnay sa kilalang meme na ito:
1 + 2 + 3 + 4 + ... = -1/12 = ζ(-1)

Sa teoryang ito, susuriin natin ang punsiyong zeta sa linyang perpendikular sa x-axis o x = 0.5, na siya ring kilala bilang kritikal na linya. Noong 1859, inihipotisa ni Riemann, maliban sa mga tinatawag na "walang kwentang zeros" na siyang nasa negatibong even na numero ng -2, -2, -6, ..., at bawat ibang root ng punsiyong nakalatag sa kritikal na linya.`,
        vi:
`Trước khi được mang tên Riemann, hàm zeta được định nghĩa bởi Euler dưới dạng chuỗi vô hạn trên miền các số tự nhiên lớn hơn 1:
ζ(s) = 1 + 1/(2^s) + 1/(3^s) + ...
Định nghĩa hàm zeta được mở rộng tới các số thực bởi Chebyshev, và sau đó đến số phức bởi Riemann. Tuy nhiên, do chuỗi này phân kì đối với các giá trị s với phần thực nhỏ hơn hoặc bằng 1, một "phiên bản" khác của hàm zeta được định nghĩa để các đạo hàm của zeta được liên thông trên toàn mặt phẳng số phức. Đây được gọi là thác triển giải tích, và thác triển giải tích của hàm zeta có mối liên hệ đến một meme nổi tiếng:
1 + 2 + 3 + 4 + ... = -1/12 = ζ(-1)

Trong lí thuyết này, chúng ta sẽ khám phá hàm zeta trên đường thẳng x = 0.5, gọi là đường tới hạn. Vào năm 1859, Riemann đã giả thuyết rằng, ngoài những "không điểm tầm thường" nằm trên các số âm chẵn -2, -4, -6, ..., tất cả các nghiệm của hàm đều nằm trên đường tới hạn này.`
    };

    return descs[language] || descs.en;
}
var authors = 'prop (Minh)\n\n' +
'Thanks to:\n' +
'Prof. Glen Pugh, for the implementation of the Riemann-Siegel formula\n' +
'Martin_mc & Eylanding, original developers of the concept\n' +
'Sneaky, Gen & Gaunter, for maths & other consultations during development\n' +
'XLII, hotab & Mathis S., for the development of testing tools\n' +
'Maimai, LLL333 & Mathis S., for reporting bugs\n' +
'game-icons.net\n\n' +
'Translations:\n' +
'Omega_3301 & WYXkk - 简体中文\n' +
'Omega_3301 & pacowoc - 繁體中文\n' +
'Jooo & Warzen User - Español\n' +
'Mathis S. - Français\n' +
'hotab - Русский\n' +
'BotAn & hotab - Українська\n' +
'66.69 - Filipino\n' +
'prop - Tiếng Việt';
var version = 3;
var releaseOrder = '7';

let pubTime = 0;

let t = 0;
let t_dot = 0;
let zResult = [-1.4603545088095868, 0, 1.4603545088095868];
let zTerm = BigNumber.from(zResult[2]);
let dTerm = BigNumber.ZERO;

let lastZero = 0;
let blackhole = false;
let searchingRewind = false;
let foundZero = false;
let bhzTerm = null;
let bhdTerm = null;

let clipping_t = false;
let tClipThreshold = 0;

let quaternaryEntries =
[
    new QuaternaryEntry(null, ''),
    new QuaternaryEntry('\\dot{t}_{{}\\,_{{}\\,}}', null),
    new QuaternaryEntry('t_{{}\\,}', null),
    new QuaternaryEntry('\\zeta \'_{{}\\,}', null),
    new QuaternaryEntry(null, ''),
];

const scale = 4;

// All balance parameters are aggregated for ease of access

const derivRes = 100000;
const derivResInv = 1 / derivRes;
const t_resolution = 1/4;
const bhRewindLength = 5;

const c1ExpMaxLevel = 3;
// The first 3 zeta zeroes lol
const c1ExpTable =
[
    BigNumber.ONE,
    BigNumber.from(1.14),
    BigNumber.from(1.21),
    BigNumber.from(1.25)
];
const getc1Exp = (level) => c1ExpTable[level];
const c1Cost = new FirstFreeCost(new ExponentialCost(225, 0.699));
const getc1 = (level) => Utils.getStepwisePowerSum(level, 2, 8, 0);

const c2Cost = new ExponentialCost(1500, 0.699 * 4);
const getc2 = (level) => BigNumber.TWO.pow(level);

const bMaxLevel = 6;
const bCost = new CompositeCost(1, new ConstantCost(1e15),
new CompositeCost(1, new ConstantCost(BigNumber.from(1e45)),
new CompositeCost(1, new ConstantCost(BigNumber.from('1e360')),
new CompositeCost(1, new ConstantCost(BigNumber.from('1e810')),
new CompositeCost(1, new ConstantCost(BigNumber.from('1e1050')),
new ConstantCost(BigNumber.from('1e1200')))))));
const getb = (level) => level / 2;
const bMarginTerm = BigNumber.from(1/100);

const w1Cost = new StepwiseCost(new ExponentialCost(12000, Math.log2(100)/3),
6);
const getw1 = (level) => Utils.getStepwisePowerSum(level, 2, 8, 1);

const w2Cost = new ExponentialCost(1e5, Math.log2(10));
const getw2 = (level) => BigNumber.TWO.pow(level);

const w3Cost = new ExponentialCost(BigNumber.TEN.sqrt() *
BigNumber.from('1e600'), BigNumber.from('1e30').log2());
const getw3 = (level) => BigNumber.TWO.pow(level);

const permaCosts =
[
    BigNumber.from(1e9),
    BigNumber.from(1e14),
    BigNumber.from(1e21),
    BigNumber.from('1e1000')
];

const pubPower = 0.2102;
const tauRate = 0.4;
const pubExp = pubPower / tauRate;
const pubMult = BigNumber.TWO;
var getPublicationMultiplier = (tau) => tau.pow(pubExp) * pubMult;
var getPublicationMultiplierFormula = (symbol) =>
`${pubMult.toString(0)}\\times{${symbol}}^{{${pubPower * 100}}/
{${100 * tauRate}}}`;

const milestoneCost = new CustomCost((level) =>
{
    if(level == 0) return BigNumber.from(25 * tauRate);
    if(level == 1) return BigNumber.from(50 * tauRate);
    if(level == 2) return BigNumber.from(125 * tauRate);
    if(level == 3) return BigNumber.from(250 * tauRate);
    if(level == 4) return BigNumber.from(400 * tauRate);
    if(level == 5) return BigNumber.from(600 * tauRate);
    return BigNumber.from(-1);
});

const locStrings =
{
    example:
    {
        pubTime: '{0}',
        terms: '{0}',
        blackhole: '',
        blackholeUnlock: '',
        blackholeInfo: 'Pulls {0} to {1}',
        menuBlackhole: '',
        blackholeThreshold: '',
        blackholeCopyt: '',
        save: '',
        rotationLock:
        [
            '',
            ''
        ],
        rotationLockInfo: '',
        overlayInfo: '',
        rewind: '{0}',
    },
    en:
    {
        pubTime: 'Publication time: {0}',
        terms: 'Riemann-Siegel terms: {0}',
        blackhole: 'Unleash the black hole: ',
        blackholeUnlock: 'the black hole',
        blackholeInfo: 'Pulls {0} backwards to the nearest zero of {1}',
        menuBlackhole: 'Black Hole Settings',
        blackholeThreshold: 'Automatically unleash black hole at: ',
        blackholeCopyt: 'Take current t',
        save: 'Save',
        rotationLock:
        [
            'Unlock graph',
            'Lock graph'
        ],
        rotationLockInfo: 'Toggles the ability to rotate and zoom the 3D graph',
        overlayInfo: 'Toggles the display of Riemann-Siegel terms and publication time',
        rewind: 'Rewind t by {0}.\nThis can help with landing at previous zeroes when using the black hole.',
    },
    'zh-Hans':
    {
        pubTime: '出版时间：{0}',
        terms: '黎曼-西格尔项：{0}',
        blackhole: '释放黑洞：',
        blackholeUnlock: '黑洞',
        blackholeInfo: '将 {0} 拉回至 {1} 的最近的零点',
        menuBlackhole: '黑洞设置',
        blackholeThreshold: '自动释放黑洞的条件：',
        blackholeCopyt: '使用现在的 t 值',
        save: '保存',
        rotationLock:
        [
            '解锁图形',
            '锁定图形'
        ],
        rotationLockInfo: '切换能否旋转和缩放 3D 图像',
        overlayInfo: '切换显示黎曼-西格尔项或出版时间',
        rewind: '释放黑洞来将 t 减少 {0}。\n这有助于击中之前的零点。'
    },
    'zh-Hant':
    {
        pubTime: '出版時間：{0}',
        terms: '黎曼-西格爾項：{0}',
        blackhole: '釋放黑洞：',
        blackholeUnlock: '黑洞',
        blackholeInfo: '將 {0} 移到和 {1} 最接近的零點',
        menuBlackhole: '黑洞設定',
        blackholeThreshold: '自動釋放黑洞的條件：',
        blackholeCopyt: '利用現在的 t 值',
        save: '儲存',
        rotationLock:
        [
            '解鎖圖形',
            '鎖定圖形'
        ],
        rotationLockInfo: '開啟/關閉 3D 圖形的旋轉和縮放',
        overlayInfo: '顯示/隱藏 黎曼-西格爾項和出版時間',
        rewind: '將 t 回溯 {0}。\n在使用黑洞時有助於通過之前的零點。'
    },
    es:
    {
        pubTime: 'Tiempo: {0}',
        terms: 'Términos de Riemann-Siegel: {0}',
        blackhole: 'Desatar el agujero negro: ',
        blackholeUnlock: 'el agujero negro',
        blackholeInfo: 'Jala {0} hacia atrás hasta el cero más cercano de {1}',
        menuBlackhole: 'Configuraciones del Agujero Negro',
        blackholeThreshold: 'Automaticamente desata el agujero negro en: ',
        blackholeCopyt: 'Usar t actual',
        save: 'Guardar',
        rotationLock:
        [
            'Desbloquear gráfica',
            'Bloquear gráfica'
        ],
        rotationLockInfo: 'Alternar la abilidad de rotar y acercar la gráfica 3D',
        overlayInfo: 'Alternar la presentación de Riemann-Siegel en los términos y tiempo de publicación',
        rewind: 'Regresa t en {0}.\nEsto puede ayudar a llegar a ceros previos cuando se use el agujero negro.'
    },
    fr:
    {
        pubTime: 'Temps : {0}',
        terms: 'Termes de Riemann-Siegel : {0}',
        blackhole: 'Libérer le trou noir : ',
        blackholeUnlock: 'le trou noir',
        blackholeInfo: 'Renvoie {0} au dernier zéro de {1}',
        menuBlackhole: 'Paramètres du trou noir',
        blackholeThreshold: 'Libérer automatiquement le trou noir à : ',
        blackholeCopyt: 'Utiliser le t actuel',
        save: 'Sauvegarder',
        rotationLock:
        [
            'Débloquer le graphique',
            'Bloquer le graphique'
        ],
        rotationLockInfo: 'Alterne la possibilité de tourner et agrandir le graphique 3D',
        overlayInfo: 'Alterne entre l\'affichage des termes de Riemann-Siegel et le temps de publication',
        rewind: 'Diminue t de {0}.\nCeci peut aider à atteindre des zéros précédents en utilisant le trou noir.'
    },
    ru:
    {
        pubTime: 'Время: {0}',
        terms: 'Члены Римана-Зигеля: {0}',
        blackhole: 'Высвободить чёрную дыру: ',
        blackholeUnlock: 'чёрную дыру',
        blackholeInfo: 'Оттягивает {0} назад к ближайшему нулю {1}',
        menuBlackhole: 'Настройки Чёрной Дыры',
        blackholeThreshold: 'Автоматически высвободить чёрную дыру при: ',
        blackholeCopyt: 'Скопировать текущее значение t',
        save: 'Сохранить',
        rotationLock:
        [
            'Разблокировать график',
            'Заблокировать график'
        ],
        rotationLockInfo: 'Переключает возможность вращать и масштабировать 3D-график',
        overlayInfo: 'Переключает показ членов Римана-Зигеля и времени публикации',
        rewind: 'Отмотать t на {0}.\nЭто может помочь попасть на предыдущие нули когда используется чёрная дыра.',
    },
    uk:
    {
        pubTime: 'Час: {0}',
        terms: 'Членів Рімана-Зігеля: {0}',
        blackhole: 'Вивільнити чорну діру: ',
        blackholeUnlock: 'чорну діру',
        blackholeInfo: 'Відтягує {0} назад до найближчого нуля {1}',
        menuBlackhole: 'Налаштування Чорної Діри',
        blackholeThreshold: 'Автоматично вивільнити чорну діру при: ',
        blackholeCopyt: 'Скопіювати поточне значення t',
        save: 'Зберегти',
        rotationLock:
        [
            'Розблокувати графік',
            'Заблокувати графік'
        ],
        rotationLockInfo: 'Перемикає можливість обертати та масштабувати 3D-графік',
        overlayInfo: 'Перемикає відображення членів Рімана-Зігеля та часу публікації',
        rewind: 'Відмотати t на {0}.\nЦе допоможе потрапити на попередні нулі при використанні чорної діри.',
    },
    tl:
    {
        pubTime: 'Oras: {0}',
        terms: 'Mga terminolohiya ng Riemann-Siegel: {0}',
        blackhole: 'Pakawalan ang black hole: ',
        blackholeUnlock: 'ang black hole',
        blackholeInfo: 'Hilain ang {0} patalikod patungo sa pinakamalapit na {1}',
        menuBlackhole: 'Settings ng Black Hole',
        blackholeThreshold: 'Awtomatikong pakawalan ang black hole: ',
        blackholeCopyt: 'Kuhanin ang Kasalukuyang t',
        save: 'I-save',
        rotationLock:
        [
            'Buksan ang Graph',
            'Isara ang Graph'
        ],
        rotationLockInfo: 'Para sa abilidad na maikot o mai-zoom ang 3D graph.',
        overlayInfo: 'Ipakita ang mga terminolohiya ni Riemann-Siegel at ang oras ng publikasyon',
        rewind: 'Ibalik ang t ng {0}.\nNakatutulong ito sa paglapag sa mga naunang zero kapag gumagamit ng black hole.',
    },
    vi:
    {
        pubTime: 'Thời gian: {0}',
        terms: 'Riemann-Siegel: {0} số hạng',
        blackhole: 'Giải phóng hố đen: ',
        blackholeUnlock: 'hố đen',
        blackholeInfo: 'Kéo {0} ngược lại tới không điểm gần nhất của {1}',
        menuBlackhole: 'Cài đặt hố đen',
        blackholeThreshold: 'Tự động giải phóng hố đen tại: ',
        blackholeCopyt: 'Lấy t hiện tại',
        save: 'Lưu',
        rotationLock:
        [
            'Mở khoá đồ thị',
            'Khoá đồ thị'
        ],
        rotationLockInfo: 'Bật tắt khả năng quay và phóng to đồ thị 3D',
        overlayInfo: 'Bật tắt số hạng hàm Riemann-Siegel và thời gian xuất bản',
        rewind: 'Kéo ngược t lại {0} đơn vị.\nViệc này có thể giúp nhắm trúng vào các không điểm đã qua khi dùng hố đen.'
    }
};

const menuLang = Localization.language;
/**
 * Returns a localised string.
 * @param {string} name the internal name of the string.
 * @returns {string} the string.
 */
let getLoc = (name, lang = menuLang) =>
{
    if(lang in locStrings && name in locStrings[lang])
        return locStrings[lang][name];

    if(name in locStrings.en)
        return locStrings.en[name];

    return `String missing: ${lang}.${name}`;
}

let interpolate = (t) =>
{
    let v1 = t*t;
    let v2 = 1 - (1-t)*(1-t);
    return v1*(1-t) + v2*t;
}

const zeta01Table =
[
    [
        -1.4603545088095868,
        0
    ],
    [
        -1.4553643660270397,
        -0.097816768303847834
    ],
    [
        -1.4405420816461549,
        -0.19415203999960912
    ],
    [
        -1.4163212212231056,
        -0.28759676077859003
    ],
    [
        -1.3833896356482762,
        -0.37687944704548237
    ],
    [
        -1.342642133546631,
        -0.46091792561979039
    ],
    [
        -1.2951228211781993,
        -0.53885377540755575
    ],
    [
        -1.241963631033884,
        -0.61006813708679553
    ],
    [
        -1.1843251208316332,
        -0.67417998953208147
    ],
    [
        -1.1233443487784422,
        -0.73102985025790079
    ],
    [
        -1.0600929156957051,
        -0.78065292187264657
    ],
    [
        -0.99554650742447182,
        -0.82324597632456875
    ],
    [
        -0.93056577332974644,
        -0.85913190352918178
    ],
    [
        -0.86588730259376534,
        -0.88872508711130638
    ],
    [
        -0.80212284363487529,
        -0.91249984322356881
    ],
    [
        -0.73976469567777448,
        -0.93096325430469185
    ],
    [
        -0.679195280748696,
        -0.94463296464946644
    ],
    [
        -0.62069916587171792,
        -0.954019930248939
    ],
    [
        -0.56447615104191817,
        -0.95961573448940385
    ],
    [
        -0.5106543967354793,
        -0.96188386780424429
    ],
    [
        -0.45930289034601818,
        -0.96125428450587913
    ],
    [
        -0.41044282155026063,
        -0.95812055392531381
    ],
    [
        -0.36405764581325084,
        -0.95283898111582577
    ],
    [
        -0.32010176657189976,
        -0.94572915808929037
    ],
    [
        -0.27850786866599236,
        -0.93707550120555738
    ],
    [
        -0.23919299859739693,
        -0.92712942212746241
    ],
    [
        -0.20206352115099815,
        -0.91611186212496687
    ],
    [
        -0.167019095423191,
        -0.90421598956695581
    ],
    [
        -0.13395581328989362,
        -0.89160991763812381
    ],
    [
        -0.10276863503870383,
        -0.87843934448552852
    ],
    [
        -0.073353244053944222,
        -0.86483005263542623
    ],
    [
        -0.045607427657960491,
        -0.850890230359152
    ],
    [
        -0.019432076150895955,
        -0.836712596410336
    ],
    [
        0.0052681222316752355,
        -0.82237632273994077
    ],
    [
        0.028584225755178324,
        -0.80794875873014349
    ],
    [
        0.050602769823360656,
        -0.7934869662472297
    ],
    [
        0.071405640533511838,
        -0.77903907825261309
    ],
    [
        0.091070056261173163,
        -0.76464549549431216
    ],
    [
        0.10966862939766708,
        -0.750339936434268
    ],
    [
        0.12726948615366909,
        -0.73615035542727014
    ],
    [
        0.14393642707718907,
        -0.722099743531673
    ]
];

// Linear interpolation lol
let zetaSmall = (t) =>
{
    let fullIndex = t * (zeta01Table.length - 1);
    let index = Math.floor(fullIndex);
    let offset = fullIndex - index;
    let re = zeta01Table[index][0]*(1-offset) + zeta01Table[index+1][0]*offset;
    let im = zeta01Table[index][1]*(1-offset) + zeta01Table[index+1][1]*offset;
    return [re, im, -Math.sqrt(re*re + im*im)];
    // Minus sign for the last element because of theta polarity
}

let even = (n) =>
{
    if(n % 2 == 0)
        return 1;
    else
        return -1;
}

let theta = (t) =>
{
    return t/2*Math.log(t/2/Math.PI) - t/2 - Math.PI/8 + 1/48/t + 7/5760/t/t/t;
}

let C = (n, z) =>
{
    if(n == 0)
        return (+.38268343236508977173 * Math.pow(z, 0.0) 
                +.43724046807752044936 * Math.pow(z, 2.0)
                +.13237657548034352332 * Math.pow(z, 4.0)
                -.01360502604767418865 * Math.pow(z, 6.0)
                -.01356762197010358089 * Math.pow(z, 8.0)
                -.00162372532314446528 * Math.pow(z,10.0)
                +.00029705353733379691 * Math.pow(z,12.0)
                +.00007943300879521470 * Math.pow(z,14.0)
                +.00000046556124614505 * Math.pow(z,16.0)
                -.00000143272516309551 * Math.pow(z,18.0)
                -.00000010354847112313 * Math.pow(z,20.0)
                +.00000001235792708386 * Math.pow(z,22.0)
                +.00000000178810838580 * Math.pow(z,24.0)
                -.00000000003391414390 * Math.pow(z,26.0)
                -.00000000001632663390 * Math.pow(z,28.0)
                -.00000000000037851093 * Math.pow(z,30.0)
                +.00000000000009327423 * Math.pow(z,32.0)
                +.00000000000000522184 * Math.pow(z,34.0)
                -.00000000000000033507 * Math.pow(z,36.0)
                -.00000000000000003412 * Math.pow(z,38.0)
                +.00000000000000000058 * Math.pow(z,40.0)
                +.00000000000000000015 * Math.pow(z,42.0));
    else if(n == 1)
        return (-.02682510262837534703 * Math.pow(z, 1.0) 
                +.01378477342635185305 * Math.pow(z, 3.0)
                +.03849125048223508223 * Math.pow(z, 5.0)
                +.00987106629906207647 * Math.pow(z, 7.0)
                -.00331075976085840433 * Math.pow(z, 9.0)
                -.00146478085779541508 * Math.pow(z,11.0)
                -.00001320794062487696 * Math.pow(z,13.0)
                +.00005922748701847141 * Math.pow(z,15.0)
                +.00000598024258537345 * Math.pow(z,17.0)
                -.00000096413224561698 * Math.pow(z,19.0)
                -.00000018334733722714 * Math.pow(z,21.0)
                +.00000000446708756272 * Math.pow(z,23.0)
                +.00000000270963508218 * Math.pow(z,25.0)
                +.00000000007785288654 * Math.pow(z,27.0)
                -.00000000002343762601 * Math.pow(z,29.0)
                -.00000000000158301728 * Math.pow(z,31.0)
                +.00000000000012119942 * Math.pow(z,33.0)
                +.00000000000001458378 * Math.pow(z,35.0)
                -.00000000000000028786 * Math.pow(z,37.0)
                -.00000000000000008663 * Math.pow(z,39.0)
                -.00000000000000000084 * Math.pow(z,41.0)
                +.00000000000000000036 * Math.pow(z,43.0)
                +.00000000000000000001 * Math.pow(z,45.0));
    else if(n == 2)
        return (+.00518854283029316849 * Math.pow(z, 0.0)
                +.00030946583880634746 * Math.pow(z, 2.0)
                -.01133594107822937338 * Math.pow(z, 4.0)
                +.00223304574195814477 * Math.pow(z, 6.0)
                +.00519663740886233021 * Math.pow(z, 8.0)
                +.00034399144076208337 * Math.pow(z,10.0) 
                -.00059106484274705828 * Math.pow(z,12.0) 
                -.00010229972547935857 * Math.pow(z,14.0) 
                +.00002088839221699276 * Math.pow(z,16.0) 
                +.00000592766549309654 * Math.pow(z,18.0) 
                -.00000016423838362436 * Math.pow(z,20.0)
                -.00000015161199700941 * Math.pow(z,22.0)
                -.00000000590780369821 * Math.pow(z,24.0)
                +.00000000209115148595 * Math.pow(z,26.0)
                +.00000000017815649583 * Math.pow(z,28.0)
                -.00000000001616407246 * Math.pow(z,30.0)
                -.00000000000238069625 * Math.pow(z,32.0)
                +.00000000000005398265 * Math.pow(z,34.0)
                +.00000000000001975014 * Math.pow(z,36.0)
                +.00000000000000023333 * Math.pow(z,38.0)
                -.00000000000000011188 * Math.pow(z,40.0)
                -.00000000000000000416 * Math.pow(z,42.0)
                +.00000000000000000044 * Math.pow(z,44.0)
                +.00000000000000000003 * Math.pow(z,46.0));
    else if(n == 3) 
        return (-.00133971609071945690 * Math.pow(z, 1.0)
                +.00374421513637939370 * Math.pow(z, 3.0)
                -.00133031789193214681 * Math.pow(z, 5.0)
                -.00226546607654717871 * Math.pow(z, 7.0)
                +.00095484999985067304 * Math.pow(z, 9.0)
                +.00060100384589636039 * Math.pow(z,11.0)
                -.00010128858286776622 * Math.pow(z,13.0)
                -.00006865733449299826 * Math.pow(z,15.0)
                +.00000059853667915386 * Math.pow(z,17.0)
                +.00000333165985123995 * Math.pow(z,19.0)
                +.00000021919289102435 * Math.pow(z,21.0)
                -.00000007890884245681 * Math.pow(z,23.0)
                -.00000000941468508130 * Math.pow(z,25.0)
                +.00000000095701162109 * Math.pow(z,27.0)
                +.00000000018763137453 * Math.pow(z,29.0)
                -.00000000000443783768 * Math.pow(z,31.0)
                -.00000000000224267385 * Math.pow(z,33.0)
                -.00000000000003627687 * Math.pow(z,35.0)
                +.00000000000001763981 * Math.pow(z,37.0)
                +.00000000000000079608 * Math.pow(z,39.0)
                -.00000000000000009420 * Math.pow(z,41.0)
                -.00000000000000000713 * Math.pow(z,43.0)
                +.00000000000000000033 * Math.pow(z,45.0)
                +.00000000000000000004 * Math.pow(z,47.0));
    else
        return (+.00046483389361763382 * Math.pow(z, 0.0)
                -.00100566073653404708 * Math.pow(z, 2.0)
                +.00024044856573725793 * Math.pow(z, 4.0)
                +.00102830861497023219 * Math.pow(z, 6.0)
                -.00076578610717556442 * Math.pow(z, 8.0)
                -.00020365286803084818 * Math.pow(z,10.0)
                +.00023212290491068728 * Math.pow(z,12.0)
                +.00003260214424386520 * Math.pow(z,14.0)
                -.00002557906251794953 * Math.pow(z,16.0)
                -.00000410746443891574 * Math.pow(z,18.0)
                +.00000117811136403713 * Math.pow(z,20.0)
                +.00000024456561422485 * Math.pow(z,22.0)
                -.00000002391582476734 * Math.pow(z,24.0)
                -.00000000750521420704 * Math.pow(z,26.0)
                +.00000000013312279416 * Math.pow(z,28.0)
                +.00000000013440626754 * Math.pow(z,30.0)
                +.00000000000351377004 * Math.pow(z,32.0)
                -.00000000000151915445 * Math.pow(z,34.0)
                -.00000000000008915418 * Math.pow(z,36.0)
                +.00000000000001119589 * Math.pow(z,38.0)
                +.00000000000000105160 * Math.pow(z,40.0)
                -.00000000000000005179 * Math.pow(z,42.0)
                -.00000000000000000807 * Math.pow(z,44.0)
                +.00000000000000000011 * Math.pow(z,46.0)
                +.00000000000000000004 * Math.pow(z,48.0));
}

let logLookup = [];
let sqrtLookup = [];
let terms = 0;

/**
 * Returns the Riemann zeta function evaluated at 0.5+it, with n layers of
 * precision. For general purposes, n=1 is smooth enough without compromising
 * performance.
 * 
 * Adopted from Glendon Pugh's masters thesis, 1998:
 * https://web.viu.ca/pughg/thesis.d/masters.thesis.pdf
 */
let riemannSiegelZeta = (t, n) =>
{
    let Z = 0;
    let R = 0;
    let fullN = Math.sqrt(t / (2*Math.PI));
    let N = Math.floor(fullN);
    let p = fullN - N;
    let th = theta(t);

    for(let j = terms + 1; j <= N; ++j)
    {
        logLookup[j] = Math.log(j);
        sqrtLookup[j] = Math.sqrt(j);
    }
    terms = N;

    for(let j = 1; j <= N; ++j)
    {
        Z += Math.cos(th - t*logLookup[j]) / sqrtLookup[j];
    }
    Z *= 2;

    let tpot = 2*Math.PI/t;
    for(let k = 0; k <= n; ++k)
    {
        R += C(k, 2*p-1) * Math.pow(tpot, k*0.5);
    }
    R *= even(N-1) * Math.pow(tpot, 0.25);

    Z += R;
    return [Z*Math.cos(th), -Z*Math.sin(th), Z];
}
/**
 * Returns re, im and Z in an array.
 */
let zeta = (T) =>
{
    let t = Math.abs(T);
    let z;
    if(t >= 1)
        z = riemannSiegelZeta(t, 2);
    else if(t < 0.1)
        z = zetaSmall(t);
    else
    {
        let offset = interpolate((t-0.1) * 10/9);
        let a = zetaSmall(t);
        let b = riemannSiegelZeta(t, 1);
        z = [
            a[0]*(1-offset) + b[0]*offset,
            a[1]*(1-offset) + b[1]*offset,
            0
        ];
        z[2] = -Math.sqrt(z[0]*z[0] + z[1]*z[1]);
    }
    if(T < 0)
        z[1] = -z[1];
    return z;
}

let enableBlackhole = () =>
{
    if(blackhole)
        return;
    blackhole = true;

    searchingRewind = true;
    foundZero = false;
    bhzTerm = null;
    bhdTerm = null;
    if(lastZero >= 14 && lastZero > t - 10)
    {
        t = lastZero;
        searchingRewind = false;
    }
}

let disableBlackhole = () =>
{
    if(!blackhole)
        return;
    blackhole = false;

    if(foundZero)
        lastZero = t;
    searchingRewind = false;
    foundZero = false;
    bhzTerm = null;
    bhdTerm = null;
}

/**
 * Returns a string of a fixed decimal number, with a fairly uniform width.
 * @param {number} x the number.
 * @returns {string}
 */
let getCoordString = (x) => x.toFixed(x >= -0.01 ?
    (x <= 9.999 ? 3 : (x <= 99.99 ? 2 : 1)) :
    (x < -9.99 ? (x < -99.9 ? 0 : 1) : 2)
);

let getImageSize = (width) =>
{
    if(width >= 1080)
        return 48;
    if(width >= 720)
        return 36;
    if(width >= 360)
        return 24;

    return 20;
}

let getSmallBtnSize = (width) =>
{
    if(width >= 1080)
        return 80;
    if(width >= 720)
        return 60;
    if(width >= 360)
        return 40;

    return 32;
}

let createImageBtn = (params, callback, isAvailable, image) =>
{
    let triggerable = true;
    let borderColor = () => isAvailable() ? Color.BORDER : Color.TRANSPARENT;
    let frame = ui.createFrame
    ({
        cornerRadius: 1,
        margin: new Thickness(2),
        padding: new Thickness(2),
        hasShadow: isAvailable,
        heightRequest: getImageSize(ui.screenWidth),
        widthRequest: getImageSize(ui.screenWidth),
        content: ui.createImage
        ({
            source: image,
            aspect: Aspect.ASPECT_FIT,
            useTint: false
        }),
        borderColor,
        ...params
    });
    frame.onTouched = (e) =>
    {
        if(e.type == TouchType.PRESSED)
        {
            frame.borderColor = Color.TRANSPARENT;
        }
        else if(e.type.isReleased())
        {
            frame.borderColor = borderColor;
            if(triggerable && isAvailable())
            {
                Sound.playClick();
                callback();
            }
            else
                triggerable = true;
        }
        else if(e.type == TouchType.MOVED && (e.x < 0 || e.y < 0 ||
        e.x > frame.width || e.y > frame.height))
        {
            frame.borderColor = borderColor;
            triggerable = false;
        }
    };
    return frame;
}

const bhImage = game.settings.theme == Theme.LIGHT ?
ImageSource.fromUri('https://raw.githubusercontent.com/conicgames/custom-theories/main/assets/RiemannZetaFunctionBlackHoleDark.png') :
ImageSource.fromUri('https://raw.githubusercontent.com/conicgames/custom-theories/main/assets/RiemannZetaFunctionBlackHoleLight.png');
const blackholeMenuFrame = createImageBtn
({
    row: 0, column: 0,
    horizontalOptions: LayoutOptions.START
},
() => createBlackholeMenu().show(), () => true, bhImage);

var c1, c2, b, w1, w2, w3;
var c1ExpMs, derivMs, w2Ms, blackholeMs;
var w3Perma, rotationLock, overlayToggle;

var normCurrency, derivCurrency;

var init = () =>
{
    normCurrency = theory.createCurrency();
    derivCurrency = theory.createCurrency('δ', '\\delta');

    /* c1
    A sea one.
    */
    {
        
        let getDesc = (level) => `c_1=${getc1(level).toString(0)}`;
        let getInfo = (level) =>
        {
            if(c1ExpMs.level > 0)
                return `c_1^{${getc1Exp(c1ExpMs.level)}}=
                ${getc1(level).pow(getc1Exp(c1ExpMs.level)).toString()}`;

            return getDesc(level);
        }
        c1 = theory.createUpgrade(1, normCurrency, c1Cost);
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getInfo(c1.level),
        getInfo(c1.level + amount));
    }
    /* c2
    A sea two.
    */
    {
        let getDesc = (level) => `c_2=2^{${level}}`;
        let getInfo = (level) => `c_2=${getc2(level).toString(0)}`;
        c2 = theory.createUpgrade(2, normCurrency, c2Cost);
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level),
        getInfo(c2.level + amount));
    }
    /* w1
    A doublew 1.
    */
    {
        let getDesc = (level) => getInfo(level);
        let getInfo = (level) => `w_1=${getw1(level).toString(0)}`;
        w1 = theory.createUpgrade(4, derivCurrency, w1Cost);
        w1.getDescription = (_) => Utils.getMath(getDesc(w1.level));
        w1.getInfo = (amount) => Utils.getMathTo(getInfo(w1.level),
        getInfo(w1.level + amount));
        w1.isAvailable = false;
    }
    /* w2
    A doublew 2.
    */
    {
        let getDesc = (level) => `w_2=2^{${level}}`;
        let getInfo = (level) => `w_2=${getw2(level).toString(0)}`;
        w2 = theory.createUpgrade(5, derivCurrency, w2Cost);
        w2.getDescription = (_) => Utils.getMath(getDesc(w2.level));
        w2.getInfo = (amount) => Utils.getMathTo(getInfo(w2.level),
        getInfo(w2.level + amount));
        w2.isAvailable = false;
    }
    /* w3
    A doublew 3.
    */
    {
        let getDesc = (level) => `w_3=2^{${level}}`;
        let getInfo = (level) => `w_3=${getw3(level).toString(0)}`;
        w3 = theory.createUpgrade(6, derivCurrency, w3Cost);
        w3.getDescription = (_) => Utils.getMath(getDesc(w3.level));
        w3.getInfo = (amount) => Utils.getMathTo(getInfo(w3.level),
        getInfo(w3.level + amount));
        w3.isAvailable = false;
    }
    /* b
    A bee.
    */
    {
        let getDesc = (level) => getInfo(level);
        let getInfo = (level) => `b=${getb(level).toString()}`;
        b = theory.createUpgrade(3, normCurrency, bCost);
        b.getDescription = (_) => Utils.getMath(getDesc(b.level));
        b.getInfo = (amount) => Utils.getMathTo(getInfo(b.level),
        getInfo(b.level + amount));
        b.maxLevel = bMaxLevel;
    }

    theory.createPublicationUpgrade(0, normCurrency, permaCosts[0]);
    theory.createAutoBuyerUpgrade(1, normCurrency, permaCosts[1]);
    theory.createBuyAllUpgrade(2, normCurrency, permaCosts[2]);
    /* w3
    Standard doubling.
    */
    {
        w3Perma = theory.createPermanentUpgrade(3, normCurrency,
        new ConstantCost(permaCosts[3]));
        w3Perma.description = Localization.getUpgradeAddTermDesc('w_3');
        w3Perma.info = Localization.getUpgradeAddTermInfo('w_3');
        w3Perma.boughtOrRefunded = (_) =>
        {
            theory.invalidatePrimaryEquation();
            updateAvailability();
        }
        w3Perma.maxLevel = 1;
    }
    /* Rotation lock
    Look sideway.
    */
    {
        rotationLock = theory.createPermanentUpgrade(10, normCurrency,
        new FreeCost);
        rotationLock.getDescription = () => getLoc('rotationLock')[
        rotationLock.level];
        rotationLock.info = getLoc('rotationLockInfo');
        rotationLock.boughtOrRefunded = (_) =>
        {
            rotationLock.level &= 1;
        }
    }
    /* Overlay toggle
    Look forward.
    */
    {
        let getTimeString = () =>
        {
            let minutes = Math.floor(pubTime / 60);
            let seconds = pubTime - minutes*60;
            let timeString;
            if(minutes >= 60)
            {
                let hours = Math.floor(minutes / 60);
                minutes -= hours*60;
                timeString = `${hours}:${
                minutes.toString().padStart(2, '0')}:${
                seconds.toFixed(1).padStart(4, '0')}`;
            }
            else
            {
                timeString = `${minutes.toString()}:${
                seconds.toFixed(1).padStart(4, '0')}`;
            }
            return Localization.format(getLoc('pubTime'),
            timeString);
        };
        let getTermsString = () => Localization.format(getLoc('terms'), terms);
        overlayToggle = theory.createPermanentUpgrade(11, normCurrency,
        new FreeCost);

        overlayToggle.getDescription = () => overlayToggle.level ?
        getTermsString() : getTimeString();
        overlayToggle.info = getLoc('overlayInfo');
        overlayToggle.boughtOrRefunded = (_) =>
        {
            overlayToggle.level &= 1;
        }
    }

    theory.setMilestoneCost(milestoneCost);
    /* c1 exponent
    Standard exponent upgrade.
    */
    {
        c1ExpMs = theory.createMilestoneUpgrade(0, c1ExpMaxLevel);
        c1ExpMs.getDescription = (amount) =>
        Localization.getUpgradeIncCustomExpDesc('c_1',
        c1ExpTable[c1ExpMs.level + amount] - c1ExpTable[c1ExpMs.level] || 0);
        c1ExpMs.getInfo = (amount) =>
        Localization.getUpgradeIncCustomExpInfo('c_1',
        c1ExpTable[c1ExpMs.level + amount] - c1ExpTable[c1ExpMs.level] || 0);
        c1ExpMs.boughtOrRefunded = (_) =>
        {
            theory.invalidatePrimaryEquation();
            updateAvailability();
        }
        c1ExpMs.canBeRefunded = () => blackholeMs.level == 0;
    }
    /* Unlock delta
    Based on the 'derivative' of zeta (roughly calculated).
    */
    {
        derivMs = theory.createMilestoneUpgrade(1, 1);
        derivMs.description = Localization.getUpgradeUnlockDesc(
        derivCurrency.symbol);
        derivMs.info = Localization.getUpgradeUnlockInfo(derivCurrency.symbol);
        derivMs.boughtOrRefunded = (_) =>
        {
            theory.invalidatePrimaryEquation();
            theory.invalidateQuaternaryValues();
            updateAvailability();
        }
        derivMs.canBeRefunded = () => w2Ms.level == 0;
    }
    /* w2
    Standard doubling.
    */
    {
        w2Ms = theory.createMilestoneUpgrade(3, 1);
        w2Ms.description = Localization.getUpgradeAddTermDesc('w_2');
        w2Ms.info = Localization.getUpgradeAddTermInfo('w_2');
        w2Ms.boughtOrRefunded = (_) =>
        {
            theory.invalidatePrimaryEquation();
            updateAvailability();
        }
        w2Ms.isAvailable = false;
        w2Ms.canBeRefunded = () => blackholeMs.level == 0;
    }
    /* Black hole
    Tradeoff. Use for coasting.
    */
    {
        blackholeMs = theory.createMilestoneUpgrade(4, 1);
        blackholeMs.description = Localization.getUpgradeUnlockDesc(
        Localization.format(`\\text{${getLoc('blackholeUnlock')}}`));
        blackholeMs.info = Localization.format(getLoc('blackholeInfo'),
        Utils.getMath('t'), Utils.getMath('\\zeta(s)'));
        blackholeMs.bought = (_) =>
        {
            updateAvailability();
        }
        blackholeMs.refunded = (_) =>
        {
            clipping_t = false;
            disableBlackhole();
            updateAvailability();
        }
        blackholeMs.isAvailable = false;
    }

    // theory.secondaryEquationScale = 0.96;
    theory.secondaryEquationHeight = 72;

    updateAvailability();
}

var updateAvailability = () =>
{
    w1.isAvailable = derivMs.level > 0;
    w2Ms.isAvailable = derivMs.level > 0;
    w2.isAvailable = w2Ms.level > 0;
    w3.isAvailable = w3Perma.level > 0;
    blackholeMs.isAvailable = c1ExpMs.level == c1ExpMaxLevel && w2Ms.level > 0;
    blackholeMenuFrame.isVisible = blackholeMs.level > 0;
}

var isCurrencyVisible = (index) => (index && derivMs.level > 0) || !index;

var tick = (elapsedTime, multiplier) =>
{
    if(!c1.level)
        return;

    pubTime += elapsedTime;
    if(!blackhole || t < 14)
    {
        t_dot = t_resolution;
        t += t_dot * elapsedTime;
    }

    let tTerm = BigNumber.from(t);
    let bonus = BigNumber.from(elapsedTime * multiplier) *
    theory.publicationMultiplier;
    let w1Term = derivMs.level ? getw1(w1.level) : BigNumber.ONE;
    let w2Term = w2Ms.level ? getw2(w2.level) : BigNumber.ONE;
    let w3Term = getw3(w3.level);
    let c1Term = getc1(c1.level).pow(getc1Exp(c1ExpMs.level));
    let c2Term = getc2(c2.level);
    let bTerm = getb(b.level);

    if(!blackhole || !foundZero)
    {
        let prevZ = zResult[2];
        zResult = zeta(t);
        if(zResult[2] * prevZ <= 0)
            lastZero = t;

        if(derivMs.level)
        {
            let tmpZ = zeta(t + derivResInv);
            let dr = tmpZ[0] - zResult[0];
            let di = tmpZ[1] - zResult[1];
            dTerm = BigNumber.from(Math.sqrt(dr*dr + di*di) * derivRes);
            derivCurrency.value += dTerm.pow(bTerm) * w1Term * w2Term * w3Term *
            bonus;

            if(blackhole && t >= 14)
            {
                let dNewt = (tmpZ[2] - zResult[2]) * derivRes;
                let bhdt = Math.min(Math.max(-0.5, -zResult[2] / dNewt), 0.375);

                if(searchingRewind && bhdt > 0)
                {
                    let srdt = -Math.min(0.125 / bhdt, 0.125);
                    t_dot = srdt / elapsedTime;
                    t += srdt;
                }
                else
                {
                    t_dot = bhdt / elapsedTime;
                    t += bhdt;
                    searchingRewind = false;
                    if(Math.abs(bhdt) < 1e-9)
                    {
                        foundZero = true;
                        // Calculate bhzTerm
                        let zResult = zeta(t);
                        let tmpZ = zeta(t + derivResInv);
                        let dr = tmpZ[0] - zResult[0];
                        let di = tmpZ[1] - zResult[1];
                        bhdTerm = BigNumber.from(Math.sqrt(dr*dr + di*di) *
                        derivRes);
                        bhzTerm = BigNumber.from(zResult[2]).abs();
                    }
                }
            }
        }
        zTerm = BigNumber.from(zResult[2]).abs();

        normCurrency.value += tTerm * c1Term * c2Term * w1Term * bonus /
        (zTerm / BigNumber.TWO.pow(bTerm) + bMarginTerm);

        if(blackholeMs.level && clipping_t &&
        t >= lastZero && t >= tClipThreshold)
            enableBlackhole();
    }
    else
    {
        derivCurrency.value += bhdTerm.pow(bTerm) * w1Term * w2Term * w3Term *
        bonus;
        normCurrency.value += tTerm * c1Term * c2Term * w1Term * bonus /
        (bhzTerm / BigNumber.TWO.pow(bTerm) + bMarginTerm);
    }

    theory.invalidateTertiaryEquation();
    theory.invalidateQuaternaryValues();
}

var getEquationOverlay = () =>
{
    let result = ui.createGrid
    ({
        inputTransparent: () => rotationLock.level ? true : false,
        cascadeInputTransparent: false,
        children:
        [
            ui.createGrid
            ({
                row: 0, column: 0,
                margin: new Thickness(4),
                horizontalOptions: LayoutOptions.END,
                verticalOptions: LayoutOptions.END,
                inputTransparent: true,
                cascadeInputTransparent: false,
                children:
                [
                    blackholeMenuFrame
                ]
            }),
        ]
    });
    return result;
}

let createBlackholeMenu = () =>
{
    let tmpThreshold = tClipThreshold;

    let getBHStr = () => `${blackhole ? '═' : '─'}${!searchingRewind ?
    '═' : '─'}${foundZero ? '═' : '─'}`;

    let blackholeBtn = ui.createButton
    ({
        row: 0, column: 1,
        horizontalOptions: LayoutOptions.END,
        heightRequest: getSmallBtnSize(ui.screenWidth),
        text: () => blackhole ? getBHStr() :
        Localization.get('EnumSoundOff'),
        onClicked: () =>
        {
            Sound.playClick();
            if(!blackhole)
                enableBlackhole();
            else
                disableBlackhole();
        }
    });

    let clippingSwitch = ui.createSwitch
    ({
        row: 0, column: 2,
        horizontalOptions: LayoutOptions.END,
        isToggled: clipping_t,
        onToggled: () =>
        {
            Sound.playClick();
            clipping_t = clippingSwitch.isToggled;
        }
    });

    let thresholdEntry = ui.createEntry
    ({
        row: 0, column: 1,
        text: tmpThreshold.toString(),
        placeholder: '0',
        placeholderColor: Color.TEXT_MEDIUM,
        keyboard: Keyboard.NUMERIC,
        horizontalTextAlignment: TextAlignment.END,
        onTextChanged: (ot, nt) =>
        {
            let tmpML = parseFloat(nt) ?? tmpThreshold;
            if(isNaN(tmpML))
                tmpML = 0;
            tmpThreshold = tmpML;
        }
    });
    let copytBtn = ui.createButton
    ({
        row: 0, column: 0,
        text: getLoc('blackholeCopyt'),
        onClicked: () =>
        {
            Sound.playClick();
            tmpThreshold = t;
            thresholdEntry.text = tmpThreshold.toString();
        }
    })
    let saveBtn = ui.createButton
    ({
        row: 0, column: 1,
        text: getLoc('save'),
        onClicked: () =>
        {
            Sound.playClick();
            tClipThreshold = tmpThreshold;
        }
    })

    let menu = ui.createPopup
    ({
        isPeekable: true,
        title: getLoc('menuBlackhole'),
        content: ui.createStackLayout
        ({
            children:
            [
                ui.createGrid
                ({
                    margin: new Thickness(0, 0, 0, 4),
                    columnDefinitions: ['auto', '1*'],
                    children:
                    [
                        ui.createLatexLabel
                        ({
                            row: 0, column: 0,
                            text: getLoc('blackhole'),
                            verticalTextAlignment: TextAlignment.CENTER
                        }),
                        blackholeBtn
                    ]
                }),
                ui.createLatexLabel
                ({
                    opacity: () => clipping_t ? 1 : 0.4,
                    margin: new Thickness(0, 0, 0, 6),
                    text: getLoc('blackholeThreshold'),
                    horizontalTextAlignment: TextAlignment.CENTER,
                    verticalTextAlignment: TextAlignment.CENTER
                }),
                ui.createGrid
                ({
                    opacity: () => clipping_t ? 1 : 0.4,
                    columnDefinitions: ['auto', '1*', 'auto'],
                    children:
                    [
                        ui.createLatexLabel
                        ({
                            row: 0, column: 0,
                            margin: new Thickness(0, 0, 6, 0),
                            text: '\$t\\ge\$',
                            horizontalTextAlignment: TextAlignment.START,
                            verticalTextAlignment: TextAlignment.CENTER
                        }),
                        thresholdEntry,
                        clippingSwitch
                    ]
                }),
                ui.createBox
                ({
                    heightRequest: 1,
                    margin: new Thickness(0, 6)
                }),
                ui.createGrid
                ({
                    children:
                    [
                        copytBtn,
                        saveBtn
                    ]
                })
            ]
        })
    });
    return menu;
}

var getPrimaryEquation = () =>
{
    let rhoPart = `\\dot{\\rho}=\\frac{t{\\mkern 1mu}c_1
    ${c1ExpMs.level ? `^{${getc1Exp(c1ExpMs.level)}}`: ''}c_2
    ${derivMs.level ? ` w_1`: ''}}{|\\zeta(\\frac{1}{2}+it)|/2^{b}+10^{-2}}`;
    if(!derivMs.level)
    {
        theory.primaryEquationScale = 0.96;
        theory.primaryEquationHeight = 60;
        return rhoPart;
    }
    let omegaPart = `\\,\\dot{\\delta}=w_1
    ${w2Ms.level ? 'w_2' : ''}${w3Perma.level ? 'w_3' : ''}\\times
    |\\zeta '(\\textstyle\\frac{1}{2}+it)|^b`;
    theory.primaryEquationScale = 0.92;
    theory.primaryEquationHeight = 72;
    return `\\begin{array}{c}${rhoPart}\\\\${omegaPart}\\end{array}`;
}

var getSecondaryEquation = () =>
{
    return `\\begin{array}{c}\\zeta(s)=
    \\displaystyle\\sum_{n=1}^{\\infty}n^{-s},&
    ${theory.latexSymbol}=\\max\\rho ^{${tauRate}}\\end{array}`;
}

var getTertiaryEquation = () =>
{
    return `|\\zeta(\\textstyle\\frac{1}{2}+it)|=
    ${foundZero ? 0 : (bhzTerm ?? zTerm).toString(3)}`;
}

/**
 * Returns a comma-formatted string.
 * https://stackoverflow.com/questions/2254185/regular-expression-for-formatting-numbers-in-javascript
 */
let getCommaNumString = (str) =>
{
    return str.split(/(?=(?:\d{3})+(?:\.|$))/g).join( "," );
}

var getQuaternaryEntries = () =>
{
    quaternaryEntries[1].value = foundZero ? 0 : t_dot.toFixed(2);
    quaternaryEntries[2].value = t >= 1000 ? getCommaNumString(t.toFixed(2)) :
    t.toFixed(2);
    if(derivMs.level)
        quaternaryEntries[3].value = (bhdTerm ?? dTerm).toString(3);
    else
        quaternaryEntries[3].value = null;
    return quaternaryEntries;
}

var getTau = () => normCurrency.value.abs().pow(tauRate);

var getCurrencyFromTau = (tau) =>
[
    tau.max(BigNumber.ONE).pow(BigNumber.ONE / tauRate),
    normCurrency.symbol
];

var postPublish = () =>
{
    pubTime = 0;
    t = 0;
    t_dot = 0;
    zResult = [-1.4603545088095868, 0, 1.4603545088095868];
    zTerm = BigNumber.from(zResult[2]);
    dTerm = BigNumber.ZERO;
    lastZero = 0;
    foundZero = false;

    disableBlackhole();

    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();
    theory.invalidateQuaternaryValues();
    updateAvailability();
}

var canResetStage = () => theory.milestonesTotal > 5;

var getResetStageMessage = () => Localization.format(getLoc('rewind'),
bhRewindLength);

var resetStage = () =>
{
    t = Math.max(0, t - bhRewindLength);
    // This points lastZero to a non-zero, necessary sacrifice.
    lastZero = 0;
    foundZero = false;

    disableBlackhole();
    // Prevent lastZero from opening
    zResult[2] = NaN;
}

var getInternalState = () => JSON.stringify
({
    version,
    t,
    pubTime,
    lastZero,
    blackhole,
    searchingRewind,
    foundZero,
    clipping_t,
    tClipThreshold
})

var setInternalState = (stateStr) =>
{
    if(!stateStr)
        return;

    let state = JSON.parse(stateStr);
    t = state.t ?? t;
    pubTime = state.pubTime ?? pubTime;
    lastZero = state.lastZero ?? lastZero;
    blackhole = state.blackhole ?? blackhole;
    searchingRewind = state.searchingRewind ?? searchingRewind;
    foundZero = state.foundZero ?? foundZero;
    clipping_t = state.clipping_t ?? clipping_t;
    tClipThreshold = state.tClipThreshold ?? tClipThreshold;

    if(foundZero)
    {
        let zResult = zeta(t);
        let tmpZ = zeta(t + derivResInv);
        let dr = tmpZ[0] - zResult[0];
        let di = tmpZ[1] - zResult[1];
        bhdTerm = BigNumber.from(Math.sqrt(dr*dr + di*di) *
        derivRes);
        bhzTerm = BigNumber.from(zResult[2]).abs();
    }

    theory.invalidatePrimaryEquation();
    theory.invalidateTertiaryEquation();
}

var get3DGraphPoint = () => new Vector3(zResult[0] / scale, -zResult[1] / scale,
t / scale);

var get3DGraphTranslation = () => new Vector3(0, 0, -t / scale);

init();
