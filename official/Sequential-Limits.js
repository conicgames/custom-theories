//uses code from ductdat (ducdat0507#4357), xelaroc (alexcord#6768),  and Gilles-Philippe Paillé(#0778). 
//COMMENTS ARE LIKELY OUTDATED
//If you'd like help with your own custom theory, or want to ask about this mess, you can contact me by pinging @ellipsis in #custom-theories-dev in the exponential idle discord server.
//or add me on discord (@ellipsis#5369) but ill probably change the #

//the imports do nothing but they allow you to see api documentation on hover
import { ExponentialCost, FirstFreeCost, LinearCost, CustomCost } from "./api/Costs"; 
import { Localization } from "./api/Localization";
import { parseBigNumber, BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";
import { language } from "./api/Localization"

//godawful localisation table bc this is how i'm doing it. cope about it
//probably need to account for empties with an "if", reminder to me in the future
localisationTable = { //stupidly large nested dicts of translation table
    'en':{ //ENGLISH
        'name':'Sequential Limits',
        'description':"You're the first student of the now-retired professor, and now that they've retired, you're given the mantle of chief researcher. Eager to dive into fields where your old professor left off, you start looking into the concept explored in the seventh lemma - sequential limits - to further your career.\n\nThis theory explores the concept of approximations using a rearrangement of Stirling's Formula to approximate Euler's number.\nThe formula, named after James Stirling and first stated by Abraham De Moivre, states that ln(n!) can be approximated by the infinite sum ln(1) + ln(2) .... + ln(n).\nBe careful - the closer your approximation of Euler's number is, the less your numerator grows!\nA close balancing game, fun for the whole family (or at least, the ones who play Exponential Idle). \n\nSpecial thanks to:\n\nGilles-Philippe, for development of the custom theory SDK, implementing features I requested, providing countless script examples, and help with my numerous questions and balancing.\n\nXelaroc/AlexCord, for answering my neverending questions, debugging and helping me understand how to balance a theory, and going above and beyond to teach me how custom theories work.\n\nThe Exponential Idle beta testing team\n- The Exponential Idle translation team, whose work I added to, and without which this game wouldn't have the reach it does.\n\nEnjoy!",
        'authors':'ellipsis',
        'achievements':{   
            'categories':{
                'misc':'Miscellaneous',
                'pubs':'Publications',
                'precision':'Approximation',
                'sa':'Secret Achievements'
            },
            'public':{
                //publication count achievements
                'a1':{
                    //'category':aPubs,
                    'name':'Amateur Author',
                    'description':'Publish once.'
                },
                'a2':{
                    //'category':aPubs,
                    'name':'Regular Reporter',
                    'description':'Publish 3 times.'
                },
                'a3':{
                    //'category':aPubs,
                    'name':'Studied Scribbler',
                    'description':'Publish 5 times.'
                },
                'a4':{
                    //'category':aPubs,
                    'name':'Exemplary Essayist',
                    'description':'Publish 10 times.'
                },
                'a5':{
                    //'category':aPubs,
                    'name':'Publication Professional',
                    'description':'Publish 20 times.'
                },
                //misc achievements
                'a6':{
                    //'category':aMisc,
                    'name':'Purchase Optimisation',
                    'description':'Outsource the purchasing of variables to your students.'
                },
                //precision achievements
                'a7':{
                    //'category':aPrecision,
                    'name':"Close Enough",
                    'description': "Get your approximation of e to 10^-1 off true."
                },
                'a8':{
                    //'category':aPrecision,
                    'name':"Nitpicking Excercise",
                    'description': "Get your approximation of e to 10^-5 off true."
                },
                'a9':{
                    //'category':aPrecision,
                    'name':"Splitting Hairs",
                    'description': "Get your approximation of e to 10^-10 off true."
                },
                'a10':{
                    //'category':aPrecision,
                    'name':"Microscopic",
                    'description': "Get your approximation of e to 10^-15 off true."
                },
                'a11':{
                    //'category':aPrecision,
                    'name':"Are we there yet?",
                    'description': "Get your approximation of e to 10^-50 off true."
                },  
                'a12':{
                    //'category':aPrecision,
                    'name':"Subatomic",
                    'description': "Get your approximation of e to 10^-25 off true."
                },
                'a13':{
                    //'category':aPrecision,
                    'name':"Planck Pettiness",
                    'description': "Get your approximation of e to 10^-35 off true."
                },
                'a14':{
                    //'category':aPrecision,
                    'name':"Precision Player",
                    'description': "Get your approximation of e to 10^-100 off true."
                },
                'a15':{
                    //'category':aPrecision,
                    'name':"Running Out Of Room",
                    'description': "Get your approximation of e to 10^-250 off true."
                },
                'a16':{
                    //'category':aPrecision,
                    'name':"You Can Stop Anytime",
                    'description': "Get your approximation of e to 10^-500 off true."
                },

            },
            'secret':{
                'sa1':{
                    //'category':aSecrets,
                    'name':'Pattern Fanatic',
                    'description':'Have your variable levels form a palindrome.',
                    'hint':'Palindromic'
                },
                'sa2':{
                    //'category':aSecrets,
                    'name':'l33t5p34k',
                    'description':'1337.',
                    'hint':'Elite.'
                },
                'sa3':{
                    //'category':aSecrets,
                    'name':'On Vacation',
                    'description':'Don\'t buy anything for an hour after publication.',
                    'hint':'Forgot Something?'
                },
                'sa4':{
                    //'category':aSecrets,
                    'name':'Futility',
                    'description':'Tap the equation 1000 times.',
                    'hint':'Fatigued'
                },
            }
        },
        'story':{
            'chapter1':{
                'title':'A New Beginning',
                'body':"You return from your old professor's retirement party, the mantle passed onto you, the first student, to head the department of students accrued over the years.\nExcited to finally be listed as something other than 'et. al' on a paper, you continued with your existing research, but as progress slowed, you felt less and less satisfied.\nThe days turn into weeks, which blur together as more and more publications are written.\nEventually, a student comes to you with a dusty tome, featuring a as-of-yet unexplored theorem.\nFeeling a stroke of inspiriation, you assemble a team of students and throw yourself into the research."
                },
            
            'chapter2':{
                'title':'Taking Risks',
                'body':"You notice a few unassuming variables at the bottom of the equation.\nA student warns you against changing them, citing the risk of decreasing the income from existing values, but you forge ahead.",
            },
            'chapter3':{
                'title':'International Recognition',
                'body':"You publish your first paper, with your name front and center.\nColleagues congratulate you, but you feel there is something missing, further exploration to be had.\nYou decide to keep going full steam ahead.",
            },
            'chapter4':{
                'title':'Light Modification',
                'body':"With your progress starting to slow, you scour the original equation texts to find a remedy.\nIt turns out all along there's been some modifiers you can add, but at ever increasing costs.\nYou decide to buy one, hoping it alleviates your issues...",
            },
            'chapter5':{
                'title':'Making Progress',
                'body':"You reach 1e100 ρ₁, a major milestone in your research.\nColleagues come to congratulate you on pushing your research so far, but you shrug them off - you feel as if there's more you could do.\nYou head back to your office and get to work once more.",
            },
            'chapter6':{
                'title':'The End... Or Is It?',
                'body':"You finally purchased every modifier, to close out your research into this field.\nYour students assigned to this project celebrate, anticipating closing out this line of research, and your name is posted in journals worldwide.\n\nYou decide to go over your numbers once more, just to make sure...",
            },
            'chapter7':{
                'title':'Mathaholic',
                'body':"1e500.\n\nA monumentally large number, but barely a blip to you now.\nPeople are starting to take notice as you push mathematics to points thought unachieveable in this field.\nThere's a waiting list to study under you now.\nYour friends and family are expressing concern, worried you're in too deep.\nIt doesn't matter.\nAnother breakthrough is close.\nYou can feel it.\n\nRight?",
            },
            'chapter8':{
                'title':'The End',
                'body':"1e1000.\n\nA number so big it'd be impossible to comprehend.\nYou did it. They said you couldn't.\nYears after you first started, you reach an incredible end to your research.\nYou're featured on TIME, on daytime television, in worldwide newspapers.\nYour papers are framed, your students all professors in their own rights now.\nYou pass on the mantle to a younger student of yours to retire like your old professor, back all those years ago.\n\nTHE END.\nThanks for playing! - ellipsis",
            },
            'chapter9':{//todo
                'title':'',
                'body':''
            },
            'chapter10':{//todo
                'title':'',
                'body':''
            }
        }
    },
    'ru':{ //RUSSIAN, OUTDATED
        //thank you to Gyl9Sh for the translation!
        'name':'Последовательные пределы',
        'description':"\nВы первый ученик ныне ушедшего профессора, и теперь, когда он вышл на пенсию, вам дали звание главного научного сотрудника. Стремясь погрузиться в области, в которых\nизучал ваш старый профессор, вы начинаете изучать концепцию, изложенную в седьмой лемме — последовательные пределы — для продвижения своей карьеры.\nЭта теория исследует концепцию аппроксимаций, используя преобразование формулы Стирлинга для аппроксимации числа Эйлера.\nФормула, названная в честь Джеймса Стерлинга и впервые сформулированная Абрахамом Де Муавром, утверждает, что ln(n!) можно аппроксимировать бесконечной суммой ln(1) + ln(2) .... + ln(n).\nБудьте осторожны - чем ближе ваше приближение к числу Эйлера, тем меньше растет ваш числитель!\nИгра с близким балансом, развлечение для всей семьи (или, по крайней мере, для тех, кто играет в Exponential Idle).\nОтдельное спасибо:\nGilles-Philippe за разработку SDK пользовательской теории, реализацию запрошенных мною функций, предоставление бесчисленных примеров скриптов и помощь в моих многочисленных вопросах и балансировке.\nXelaroc/AlexCord, за ответы на мои бесконечные вопросы, отладку и помощь в понимании того, как сбалансировать теорию, а также за то, что сделали все возможное, чтобы\nнаучить меня, как работают пользовательские теории.\nКоманда бета-тестирования Exponential Idle\n- Команда переводчиков Exponential Idle, к работе которой я присоединился, и без которых эта игра не имела бы того охвата, который она имеет.\n\nНаслаждаться!",
        'authors':'ellipsis',
        'achievements':{   
            'categories':{
                'misc':'Разнообразный',
                'pubs':'Публикации',
                'precision':'Точность аппроксимации',
                'sa':'Секретные достижения'
            },
            'public':{
                //publication count achievements
                'a1':{
                    //'category':aPubs,
                    'name':'Автор-любитель',
                    'description':'Опубликовать один раз.'
                },
                'a2':{
                    //'category':aPubs,
                    'name':'Обычный репортер',
                    'description':'Опубликовать 3 раза.'
                },
                'a3':{
                    //'category':aPubs,
                    'name':'Писака ученик',
                    'description':'Опубликовать 5 раз.'
                },
                'a4':{
                    //'category':aPubs,
                    'name':'Образцовый эссеист',
                    'description':'Опубликовать 10 раз.'
                },
                'a5':{
                    //'category':aPubs,
                    'name':'Профессиональный публикатор',
                    'description':'Опубликовать 20 раз.'
                },
                //misc achievements
                'a6':{
                    //'category':aMisc,
                    'name':'Оптимизация покупки',
                    'description':'Поручите закупку переменных своим ученикам.'
                },
                //precision achievements
                'a7':{
                    //'category':aPrecision,
                    'name':"Достаточно близко",
                    'description': "Получите ваше приближение e к 10^-1."
                },
                'a8':{
                    //'category':aPrecision,
                    'name':"Упражнение на придирки",
                    'description': "Получите приближение e к 10^-5."
                },
                'a9':{
                    //'category':aPrecision,
                    'name':"Разделение волос",
                    'description': "Получите приближение e к 10^-10."
                },
                'a10':{
                    //'category':aPrecision,
                    'name':"Микроскопический",
                    'description': "Получите приближение e к 10^-15."
                },
                'a11':{
                    //'category':aPrecision,
                    'name':"Мы уже на месте?",
                    'description': "Получите приближение e к 10^-50."
                },  
                'a12':{
                    //'category':aPrecision,
                    'name':"Субатомный",
                    'description': "Получите приближение e к 10^-25."
                },
                'a13':{
                    //'category':aPrecision,
                    'name':"Мелкая планка",
                    'description': "Получите приближение e к 10^-35."
                },
                'a14':{
                    //'category':aPrecision,
                    'name':"Точный игрок",
                    'description': "Получите приближение e к 10^-100."
                },
                'a15':{
                    //'category':aPrecision,
                    'name':"Недостаточно места",
                    'description': "Получите приближение e к 10^-250."
                },
                'a16':{
                    //'category':aPrecision,
                    'name':"Вы можете остановиться в любое время",
                    'description': "Получите приближение e к 10^-500"
                },

            },
            'secret':{
                'sa1':{
                    //'category':aSecrets,
                    'name':'Фанатик узоров',
                    'description':'Получите одинаковый уровень всех переменных.',
                    'hint':'Палиндромный.'
                },
                'sa2':{
                    //'category':aSecrets,
                    'name':'l33t5p34k',
                    'description':'1337.',
                    'hint':'Элита'
                },
                'sa3':{
                    //'category':aSecrets,
                    'name':'В отпуске',
                    'description':'Не покупайте ничего в течение часа после публикации.',
                    'hint':'Забыл что-то?'
                },
                'sa4':{
                    //'category':aSecrets,
                    'name':'Бесполезность',
                    'description':'Нажмите на уравнение 1000 раз.',
                    'hint':'Усталый.'
                },
            }
        },
        'story':{
            'chapter1':{
                'title':'Новое начало',
                'body':"\nВы возвращаетесь с вечеринки по случаю выхода на пенсию вашего старого профессора, мантия перешла к вам, первому студенту, чтобы возглавить кафедру студентов, накопленную за эти годы.\nРад, что наконец-то был указан как нечто иное, чем \"и другие\", вы продолжали свои текущие исследования, но по мере того, как прогресс замедлялся, вы чувствовали себя все менее и менее удовлетворенными.\nДни превращаются в недели, которые сливаются воедино по мере того, как пишется все больше и больше публикаций.\nВ конце концов к вам приходит студент с пыльным фолиантом, в котором содержится еще не изученная теорема.\nЧувствуя прилив вдохновения, вы собираете команду студентов и с головой уходите в исследование."
                },
            
            'chapter2':{
                'title':'Рисковать',
                'body':"Вы замечаете несколько несущественных переменных в нижней части уравнения.\nСтудент предостерегает вас от их изменения, ссылаясь на риск уменьшения дохода существующих значений, но вы идете вперед.",
            },
            'chapter3':{
                'title':'Международное признание',
                'body':"Вы публикуете свою первую статью с вашим именем спереди и по центру.\nКоллеги поздравляют вас, но вы чувствуете, что чего-то не хватает, нужно доработать.\nВы решаете идти полным ходом вперед."
            },
            'chapter4':{
                'title':'Легкая модификация',
                'body':"Когда ваш прогресс начинает замедляться, вы просматриваете исходные тексты уравнений, чтобы найти средство.\nОказывается, все это время вы могли добавлять некоторые модификаторы, но с постоянно растущими затратами.\nВы решаете купить его, надеясь, что это облегчит ваши проблемы..."
            },
            'chapter5':{
                'title':'Продвижение',
                'body':"Вы достигаете 1e100 ρ₁, что является важной вехой в ваших исследованиях.\nКоллеги приходят, чтобы поздравить вас с продвижением вашего исследования, но вы отмахиваетесь от них — вам кажется, что вы могли бы сделать больше.\nВы возвращаетесь в свой офис и снова принимаетесь за работу."
            },
            'chapter6':{
                'title':'Конец ... или нет?',
                'body':"Вы, наконец, купили все модификаторы, чтобы завершить свои исследования в этой области.\nВаши студенты, назначенные для этого проекта, празднуют завершение этого направления исследований, и ваше имя публикуется в журналах по всему миру.\nВы решаете еще раз проверить свои цифры, просто чтобы убедиться...",
            },
            'chapter7':{
                'title':'Матеголик',
                'body':"1e500.\nМонументально большое число, но сейчас для вас оно едва заметно.\nЛюди начинают замечать, как вы подталкиваете математику к моментам, которые считались недостижимыми в этой области.\nСейчас у вас очередь на обучение.\nВаши друзья и семья беспокоятся, что вы слишком глубоко увязли.\nЭто не имеет значения.\nЕще один прорыв близок.\nВы чувствуете это.\nВерно?"
            },
            'chapter8':{
                'title':'Конец',
                'body':"1e1000.\n\nЧисло такое большое, что его невозможно понять.\nТы сделал это. Они сказали, что у Вас не получится.\nСпустя годы после того, как вы впервые начали, вы достигаете невероятного конца своего исследования.\nО вас пишут в TIME, на дневном телевидении, в мировых газетах.\nВаши документы оформлены, твои студенты теперь все профессора со своими правами.\nВы передаете мантию своему младшему студенту, чтобы уйти на пенсию, как и ваш старый профессор много лет назад.\nКОНЕЦ.\nСпасибо за игру! ..."},
            'chapter9':{//todo
                'title':'',
                'body':''
            },
            'chapter10':{//todo
                'title':'',
                'body':''
            }
        }
    },
    'de':{ //GERMAN
        //thank you AfuroZamurai for the translation!
        'name':'Sequenzielle Grenzwerte',
        'description':'Du bist der erste Student des inzwischen in den Ruhestand getretenen Professors, und nun, da er emeritiert ist, wird dir der Mantel des leitenden Forschers übergeben. Begierig darauf, in die Bereiche einzutauchen, wo dein alter Professor aufgehört hat, beginnst du dich mit dem im siebten Lemma untersuchten Konzept - den sequentiellen Grenzwerten - zu befassen, um deine Karriere voranzutreiben.\n\nDiese Theorie erforscht das Konzept der Approximation mit einer Umstellung der Stirlingformel zur Annäherung der Eulerschen Zahl.\n\nDie nach James Stirling benannte und erstmals von Abraham de Moivre aufgestellte Formel besagt, dass ln(n!) durch die unendliche Summe ln(1) + ln(2) ... + ln(n) angenähert werden kann.\n\nSei vorsichtig - umso genauer deine Approximation der Eulerschen Zahl ist, desto weniger wächst dein Zähler!\n\nEin enges Balancing-Spiel, das der ganzen Familie Spaß macht (oder zumindest denjenigen, die Exponential Idle spielen).\n\nBesonderer Dank an:\nGilles-Philippe, für die Entwicklung des SDKs für eigene Theorien, die Implementierung von Funktionen, die ich mir gewünscht habe, das Bereitstellen von unzähligen Skriptbeispielen, die Hilfe bei meinen zahlreichen Fragen und dem Ausbalancieren.\nXelaroc / Alexcord, um meine unaufhörlichen Fragen zu beantworten, zu debuggen und mir zu helfen, zu verstehen, wie man eine Theorie ausbalanciert und darüber hinaus mich zu lehren, wie eigene Theorien funktionieren.\nDas Exponential Idle Beta Testteam\nDas Exponential Idle Übersetzungteam, zu dessen Arbeit ich beigetragen habe, und ohne die dieses Spiel nicht seine jetzige Reichweite hätte.\n\nViel Spaß!',
        'authors':'ellipsis',
        'achievements':{   
            'categories':{
                'misc':'Sonstiges',
                'pubs':'Veröffentlichungen',
                'precision':'Annäherungspräzision',
                'sa':'Geheime Erfolge'
                },
                'public':{
                    //publication count achievements
                    'a1':{
                        'name':'Amateurischer Autor',
                        'description':'Veröffentliche einmal.'
                    },
                    'a2':{
                        'name':'Regulärer Reporter',
                        'description':'Veröffentliche dreimal.'
                    },
                    'a3':{
                        'name':'Studierter Schreiberling',
                        'description':'Veröffentliche fünfmal.'
                    },
                    'a4':{
                        'name':'Exemplarischer Essayist',
                        'description':'Veröffentliche zehnmal.'
                    },
                    'a5':{
                        'name':'Professioneller Publizierer',
                        'description':'Veröffentliche zwanzigmal.'
                    },
                    //misc achievements
                    'a6':{
                        'name':'Kaufoptimierung',
                        'description':'Lagere den Kauf von Variablen an deine Studenten aus.'
                    },
                    //precision achievements
                    'a7':{
                        'name':'Nah genug',
                        'description':'Approximiere e auf 10^-1 genau.'
                    },
                    'a8':{
                        'name':'Übung in Pingeligkeit',
                        'description':'Approximiere e auf 10^-5 genau.'
                    },
                    'a9':{
                        'name':'Haarspalterei',
                        'description':'Approximiere e auf 10^-10 genau.'
                    },
                    'a10':{
                        'name':'Mikroskopisch',
                        'description':'Approximiere e auf 10^-15 genau.'
                    },
                    'a11':{
                        'name':'Sind wir schon da?',
                        'description':'Approximiere e auf 10^-50 genau.'
                    },  
                    'a12':{
                        'name':'Subatomar',
                        'description':'Approximiere e auf 10^-25 genau.'
                    },
                    'a13':{
                        'name':'Planckkleinlichkeit',
                        'description':'Approximiere e auf 10^-35 genau.'
                    },
                    'a14':{
                        'name':'Präzisionsspieler',
                        'description':'Approximiere e auf 10^-100 genau.'
                    },
                    'a15':{
                        'name':'Der Platz wird knapp',
                        'description':'Approximiere e auf 10^-250 genau.'
                    },
                    'a16':{
                        'name':'Du kannst jederzeit aufhören',
                        'description':'Approximiere e auf 10^-500 genau.'
                    },
    
                },
                'secret':{
                    'sa1':{
                        'name':'Musterfanatiker',
                        'description':'Forme ein Palindrom mit den Leveln der Variablen.',
                        'hint':'Palindromisch.'
                    },
                    'sa2':{
                        'name':'l33t5p34k.',
                        'description':'1337',
                        'hint':'Elite'
                    },
                    'sa3':{
                        'name':'Im Urlaub',
                        'description':'Kaufe nichts für eine Stunde nach einer Veröffentlichung.',
                        'hint':'Etwas vergessen?'
                    },
                    'sa4':{
                        'name':'Sinnlosigkeit',
                        'description':'Tippe 1000 Mal auf die Gleichung.',
                        'hint':'Ermüdet'
                    },
                }
        },
        'story':{
                'chapter1':{
                    'title':'Ein neuer Anfang',
                    'body':'Du kehrst von der Ruhestandsfeier deines alten Professors zurück, der dir, als erstem Studenten, die Leitung des Fachbereichs übergab, die im Laufe der Jahre viele Studenten angezogen hat.\nAufgeregt, endlich als etwas anderes als "et. al" in einem Paper aufgelistet zu werden, fuhrst du mit deiner bestehenden Forschung fort. Als sich jedoch der Fortschritt verlangsamte, fühltest du dich weniger und weniger zufrieden.\nDie Tage werden zu Wochen, die verschwimmen, je mehr Publikationen geschrieben werden.\nSchließlich kommt ein Student mit einem staubigen Foliant, welcher ein bisher unerforschtes Theorem enthält, zu dir.\nBeseelt von Inspiration stellst ein Team aus Studenten zusammen, mit dem du dich in die Forschung stürzt.'
                    },
                
                'chapter2':{
                    'title':'Risiken eingehen',
                    'body':'Du bemerkst ein paar bescheidene Variablen unten in der Gleichung.\nEin Student warnt dich davor sie zu ändern, da das Risiko besteht, das Wachstum der existierenden Werte zu verringern, doch du machst weiter.'
                },
                'chapter3':{
                    'title':'Internationale Anerkennung',
                    'body':'Du veröffentlichst dein erstes Paper mit deinem Namen an vorderster Stelle.\nKollegen gratulieren dir, aber du fühlst, dass etwas fehlt, dass weitere Erkundungen erforderlich sind.\nDu beschließt mit Volldampf weiterzumachen.'
                },
                'chapter4':{
                    'title':'Leichte Änderung',
                    'body':'Da sich dein Fortschritt verlangsamt, durchkämmst du die ursprünglichen Gleichungen nach einem Heilmittel.\nEs stellt sich heraus, dass es die ganze Zeit einige Modifikatoren gab, die du hinzufügen könntest, allerdings zu ständig steigenden Kosten.\nDu beschließt, einen zu kaufen, in der Hoffnung, dass es deine Probleme lindert ...'
                },
                'chapter5':{
                    'title':'Fortschritte machen',
                    'body':'Du erreichst 1e100 ρ₁, einen großen Meilenstein in deiner Forschung.\nKollegen kommen, um dir zu gratulieren, weil du deine Forschung so weit voran getrieben hast, aber du zuckst nur die Schultern - du fühlst dich, als könntest du mehr tun.\nDu gehst zurück in dein Büro und einmal mehr beginnst du mit der Arbeit.'
                },
                'chapter6':{
                    'title':'Das Ende ... oder ist es?',
                    'body':'Du hast endlich jeden Modifikator gekauft, um deine Forschung in diesem Feld abzuschließen.\nDeine Studenten, die an diesem Projekt arbeiten, feiern den Abschluss dieses Forschungsfelds, und dein Name wird weltweit in Zeitschriften veröffentlicht.\nDu entscheidest dich, deine Zahlen noch einmal zu überprüfen, nur um sicherzugehen...'
                },
                'chapter7':{
                    'title':'Mathaholic',
                    'body':'1e500.\n\nEine monumental große Zahl, aber jetzt kaum ein Blick wert für dich.\nDie Leute fangen an davon Notiz zu nehmen, wie du die \nMathematik in Bereiche vorantreibst, die als unerreichbar galten.\nEs gibt jetzt eine Warteliste, um unter dir zu studieren.\nDeine Freunde und Familie sind besorgt, weil sie befürchten, dass du zu tief drinsteckst.\nEs spielt keine Rolle.\nEin weiterer Durchbruch ist nahe\n\nDu kannst es fühlen.\n\nRichtig?'
                },
                'chapter8':{
                    'title':'Das Ende',
                    'body':'1e1000.\nEine so große Zahl, dass es unmöglich ist, sie zu begreifen.\nDu hast es geschafft. Sie sagten, du könntest nicht.\nJahre nach dem du begonnen hast, erreichst du ein unglaubliches Ende deiner Forschung.\ndu wirst in der TIME, im Tagesfernsehen, in Zeitungen in der ganzen Welt vorgestellt.\nDeine Paper sind eingerahmt, deine Studenten sind jetzt alle selbst Professoren.\nDu reichst den Mantel an einen deiner jüngeren Studenten weiter, um in den Ruhestand zu gehen, wie dein alter Professor vor all diesen Jahren.\n\nDAS ENDE.\n\nDanke fürs Spielen! - ellipsis'
                },
                'chapter9':{
                    'title':'',
                    'body':''
                },
                'chapter10':{
                    'title':'',
                    'body':''
                }
        }
    },
    'template':{ //TEMPLATE
        'name':'',
        'description':'',
        'authors':'',
        'achievements':{   
            'categories':{
                'misc':'',
                'pubs':'',
                'precision':'',
                'sa':''
                },
                'public':{
                    //publication count achievements
                    'a1':{
                        'name':'',
                        'description':''
                    },
                    'a2':{
                        'name':'',
                        'description':''
                    },
                    'a3':{
                        'name':'',
                        'description':''
                    },
                    'a4':{
                        'name':'',
                        'description':''
                    },
                    'a5':{
                        'name':'',
                        'description':''
                    },
                    //misc achievements
                    'a6':{
                        'name':'',
                        'description':''
                    },
                    //precision achievements
                    'a7':{
                        'name':'',
                        'description':''
                    },
                    'a8':{
                        'name':'',
                        'description':''
                    },
                    'a9':{
                        'name':'',
                        'description':''
                    },
                    'a10':{
                        'name':'',
                        'description':''
                    },
                    'a11':{
                        'name':'',
                        'description':''
                    },  
                    'a12':{
                        'name':'',
                        'description':''
                    },
                    'a13':{
                        'name':'',
                        'description':''
                    },
                    'a14':{
                        'name':'',
                        'description':''
                    },
                    'a15':{
                        'name':'',
                        'description':''
                    },
                    'a16':{
                        'name':'',
                        'description':''
                    },
    
                },
                'secret':{
                    'sa1':{
                        'name':'',
                        'description':'',
                        'hint':''
                    },
                    'sa2':{
                        'name':'',
                        'description':'',
                        'hint':''
                    },
                    'sa3':{
                        'name':'',
                        'description':'',
                        'hint':''
                    },
                    'sa4':{
                        'name':'',
                        'description':'',
                        'hint':''
                    },
                }
        },
        'story':{
                'chapter1':{
                    'title':'',
                    'body':''
                    },
                
                'chapter2':{
                    'title':'',
                    'body':''
                },
                'chapter3':{
                    'title':'',
                    'body':''
                },
                'chapter4':{
                    'title':'',
                    'body':''
                },
                'chapter5':{
                    'title':'',
                    'body':''
                },
                'chapter6':{
                    'title':'',
                    'body':''
                },
                'chapter7':{
                    'title':'',
                    'body':''
                },
                'chapter8':{
                    'title':'',
                    'body':''
                },
                'chapter9':{
                    'title':'',
                    'body':''
                },
                'chapter10':{
                    'title':'',
                    'body':''
                }
        }
    },
}
//set locale
// locale = localisationTable.en;
if (localisationTable[Localization.language]){ //if it's in the localisation table
    locale = localisationTable[Localization.language];
}
else locale = localisationTable.en;

var id = "SequentialLimits"; //must be unique, make sure to change it 
var name = 'Sequential Limits' //dummy, as the game won't allow anything other than a literal for first load
var description = "You're the first student of the now-retired professor, and now that they've retired, you're given the mantle of chief researcher. Eager to dive into fields where your old professor dove off, you start looking into the concept explored in the seventh lemma - sequential limits - to further your career.\n\nThis theory explores the concept of approximations using a rearrangement of Stirling's Formula to approximate Euler's number.\nThe formula, named after James Stirling and first stated by Abraham De Moivre, states that ln(n!) can be approximated by the infinite sum ln(1) + ln(2) .... + ln(n).\nBe careful - the closer your approximation of Euler's number is, the less your numerator grows!\nA close balancing game, fun for the whole family (or at least, the ones who play Exponential Idle). \n\nSpecial thanks to:\n\nGilles-Philippe, for development of the custom theory SDK, implementing features I requested, providing countless script examples, and help with my numerous questions and balancing.\n\nXelaroc/AlexCord, for answering my neverending questions, debugging and helping me understand how to balance a theory, and going above and beyond to teach me how custom theories work.\n\nThe Exponential Idle beta testing team\n- The Exponential Idle translation team, who's work I added to, and without which this game wouldn't have the reach it does.\n\nEnjoy!" //ditto
var authors = 'ellipsis' //ditto again
var version = 9; //version id, make sure to change it on update

var currency = theory.createCurrency(), currency2 = theory.createCurrency(), currency3 = theory.createCurrency(); //create three currency variables and list them as currencies
var a1, a2, b1, b2; //set a1, a2, b1, b2 levels
var numPublications = 0; //number of publications

var aMisc, aPubs, aPrecision, aSecrets; //achievement category variables, not needed but i get warns otherwise and warns make me sad

var gamma0, gamma1, gamma2, gamma3; //create 4 variables that i'll use for milestones - future note, make the names actually mean something next time. fuck thats annoying
var rho1dot = BigNumber.ZERO, rho2dot = BigNumber.ZERO, rho3dot = BigNumber.ZERO; //used as drho's
var inverseE_Gamma; //used for the approximation of e
var tapCount = 0;
var t = 0;

function isPalindrome(x) { //it probably sucks but also i just copied it from a past project
    // console.log('recieved string ' + x)
    // x = x.toString();
    lenx = x.length;
    // console.log(lenx);
    for (i = 0; i < Math.floor(lenx/2); i++){
        pos1 = x.charAt(i);
        pos2 = x.charAt(lenx-i-1);
        // console.log(pos1 + ' , ' + pos2);
        if(pos1 != pos2){
            // console.log("false at position " + (i+1) + " , " + pos1 + "≠" + pos2);
            return false;
        }
    }
    return true;
}

function areLevelsPalindromic() { //seperate function bc why not
    return isPalindrome(str(a1.level) + str(a2.level) + str(b1.level) + str(b2.level))
}

var init = () => {
    //workaround so the game doesn't spit the dummy about localisation
    //sometimes my genius is almost frightening
    //note to anyone else reading this - just use getName and getDescription, it's less stupid
    authors = locale.authors; //display author in the "author" field
    name = locale.name; //display name
    description = locale.description //guess what this one is. itll shock you to know

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
    theory.setMilestoneCost(new LinearCost(2.5, 2.5)); //c = 25*x + 25, i.e rewards a milestone every 25 log10(tau)

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

    //utilities
    // var bsf={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'\=",e:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=bsf._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},d:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=bsf._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
    
    // Achievements
    var aMisc = theory.createAchievementCategory(0, locale.achievements.categories.misc);
    var aPubs = theory.createAchievementCategory(1, locale.achievements.categories.pubs);
    var aPrecision = theory.createAchievementCategory(2, locale.achievements.categories.precision);
    var aSecrets  = theory.createAchievementCategory(3, locale.achievements.categories.sa);
    
    achievement1 = theory.createAchievement(0, aPubs, locale.achievements.public.a1.name, locale.achievements.public.a1.description, () => 1 >= numPublications); //award an achievement with name and description if there has been 1 publish
    achievement2 = theory.createAchievement(1, aPubs, locale.achievements.public.a2.name, locale.achievements.public.a2.description, () => 3 >= numPublications); //same for 3 publications
    achievement3 = theory.createAchievement(2, aPubs, locale.achievements.public.a3.name, locale.achievements.public.a3.description, () => 5 >= numPublications); //same for 5 publications
    achievement4 = theory.createAchievement(3, aPubs, locale.achievements.public.a4.name, locale.achievements.public.a3.description, () => 10 >= numPublications); //same for 10 publications
    achievement5 = theory.createAchievement(4, aPubs, locale.achievements.public.a5.name, locale.achievements.public.a5.description, () => 20 >= numPublications); //same for 20 publications
    
    achievement6 = theory.createAchievement(5, aMisc, locale.achievements.public.a6.name, locale.achievements.public.a6.description, () => theory.isAutoBuyerAvailable); //award an achievement for unlocking the autobuyer

    achievement7 = theory.createAchievement(6, aPrecision, locale.achievements.public.a7.name, locale.achievements.public.a7.description, () => inverseE_Gamma >= BigNumber.From("1e1")); //oops
    achievement8 = theory.createAchievement(7, aPrecision, locale.achievements.public.a8.name, locale.achievements.public.a8.description, () => inverseE_Gamma >= BigNumber.From("1e5"));
    achievement9 = theory.createAchievement(8, aPrecision, locale.achievements.public.a9.name, locale.achievements.public.a9.description, () => inverseE_Gamma >= BigNumber.From("1e10"));
    achievement10 = theory.createAchievement(9, aPrecision, locale.achievements.public.a10.name, locale.achievements.public.a10.description, () => inverseE_Gamma >= BigNumber.From("1e15"));
    achievement12 = theory.createAchievement(10, aPrecision, locale.achievements.public.a12.name, locale.achievements.public.a12.description, () => inverseE_Gamma >= BigNumber.From("1e25"));
    achievement13 = theory.createAchievement(11, aPrecision, locale.achievements.public.a13.name, locale.achievements.public.a13.description, () => inverseE_Gamma >= BigNumber.From("1e35"));
    achievement11 = theory.createAchievement(12, aPrecision, locale.achievements.public.a11.name, locale.achievements.public.a11.description, () => inverseE_Gamma >= BigNumber.From("1e50"));
    achievement14 = theory.createAchievement(13, aPrecision, locale.achievements.public.a14.name, locale.achievements.public.a14.description, () => inverseE_Gamma >= BigNumber.From("1e100"));
    achievement15 = theory.createAchievement(14, aPrecision, locale.achievements.public.a15.name, locale.achievements.public.a15.description, () => inverseE_Gamma >= BigNumber.From("1e250"));
    achievement16 = theory.createAchievement(15, aPrecision, locale.achievements.public.a16.name, locale.achievements.public.a16.description, () => inverseE_Gamma >= BigNumber.From("1e500"));

   // achievement21 = theory.createSecretAchievement(20, aSecrets,"What's 9 + 10?", "21", "October 9th, 2021", () => a1.level == 9 && a2.level == 10 );
    achievement22 = theory.createSecretAchievement(21, aSecrets, locale.achievements.secret.sa1.name, locale.achievements.secret.sa1.description, locale.achievements.secret.sa1.hint, () => areLevelsPalindromic());
    achievement23 = theory.createSecretAchievement(22, aSecrets, locale.achievements.secret.sa2.name, locale.achievements.secret.sa2.description, locale.achievements.secret.sa2.hint, () => a1.level == 1 && a2.level == 3 && b1.level == 3 && b2.level == 7 );
    // achievement24 = theory.createSecretAchievement(23, aSecrets, "NoAB", "Don't autobuy anything for a whole publication",'Hint', () => abFlag == true && theory.isAutoBuyerAvailable);
    achievement25 = theory.createSecretAchievement(24, aSecrets, locale.achievements.secret.sa3.name,locale.achievements.secret.sa3.description,locale.achievements.secret.sa3.hint, () => a1.level == 0 && t >= 3600 && numPublications > 0);
    achievement26 = theory.createSecretAchievement(25,aSecrets, locale.achievements.secret.sa4.name,locale.achievements.secret.sa4.description,locale.achievements.secret.sa4.hint,() => tapCount >= 1000);

    // Story chapters
    chapter1 = theory.createStoryChapter(0, locale.story.chapter1.title, locale.story.chapter1.body, () => a1.level > 0); //unlock story chapter when a1 is purchased
    chapter2 = theory.createStoryChapter(1,locale.story.chapter2.title ,locale.story.chapter2.body, () => b1.level >0 || b2.level > 0); //unlock story chapter if b1 or b2 have been puchased
    chapter3 = theory.createStoryChapter(2, locale.story.chapter3.title,locale.story.chapter3.body, () => numPublications > 0); //unlock story chapter if a publication has been done
    chapter4 = theory.createStoryChapter(3, locale.story.chapter4.title, locale.story.chapter4.body, () => gamma0.level == 1 || gamma1.level == 1 || gamma2.level == 1 || gamma3.level == 1);//unlock story chapter if a milestone is purchased
    chapter5 = theory.createStoryChapter(4, locale.story.chapter5.title, locale.story.chapter5.body, () => currency.value >= BigNumber.From("1e100"));//unlock story chapter upon reaching 1e100 rho1
    chapter6 = theory.createStoryChapter(5, locale.story.chapter6.title,locale.story.chapter6.body, () => gamma0.level == 3 && gamma1.level == 5 && gamma2.level == 2 && gamma3.level == 2); //unlock a story when all milestone levels have been purchased    
    chapter6 = theory.createStoryChapter(6, locale.story.chapter7.title,locale.story.chapter7.body, () => currency.value >= BigNumber.From("1e500"));
    chapter7 = theory.createStoryChapter(7, locale.story.chapter8.title, locale.story.chapter8.body, () => currency.value >= BigNumber.From("1e1000"));
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
    
    rho3dot = (getb1(b1.level).pow(1 + gamma2.level*0.02) * getb2(b2.level).pow(1 + gamma3.level*0.02)); //rho3dot is equal to b1.value * b2.value accounting for exponenents
    currency3.value += rho3dot*dt; //increase currency3.value by rho3dot*dt
    updateInverseE_Gamma();
   
    //rho2dot equation that supports higher values without crashing lol
    let a1v = geta1(a1.level), a2v = geta2(a2.level);
//    rho2dot =(geta1(a1.level) * geta2(a2.level) * (BigNumber.TWO-gamma1.level*0.004).pow( - currency3.value.log() )); //calculate rho2dot, accounting for milestones
    rho2dot = a1v > 0 && a2v > 0 ? BigNumber.E.pow(a1v.log() + a2v.log() - (2-gamma1.level*0.008).log() * (currency3.value).log() ) : BigNumber.ZERO;
    currency2.value += dt * rho2dot; //increase rho2 by rho2dot by dt
    rho1dot = (currency2.value.pow(1+gamma0.level*0.02).sqrt()*(inverseE_Gamma)); //rho1dot is equal to the root of rho2^milestone, over the difference between E and stirling's approximation
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
    if(inverseE_Gamma <= 10000) //arbitrary number that xelaroc said was ok
    result += (BigNumber.ONE/inverseE_Gamma).toString(4);
else { //wizard fuckery. note to future self: do not touch
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

var getEquationOverlay = () => ui.createGrid({ //taken from Probability Theory
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
    if (values.length > 1) inverseE_Gamma = parseBigNumber(values[1]); //save the value of inverseE_Gamma numbers to slot 1
    if (values.length > 2) tapCount = parseInt(values[2]);
    if (values.length > 3) t = Number.parseFloat(values[3]);
}

var getInternalState = () => `${numPublications} ${inverseE_Gamma} ${tapCount} ${t}` //return the data saved

var getPublicationMultiplier = (tau) => tau.pow(1.5); //publication mult bonus is (tau^0.15)*100
var getPublicationMultiplierFormula = (symbol) => /*"10 · " +*/ symbol + "^{1.5}"; //text to render for publication mult ext
var getTau = () => currency.value.pow(BigNumber.from(0.1));
var getCurrencyFromTau = (tau) => [tau.max(BigNumber.ONE).pow(10), currency.symbol]; //optional, allows showing currency_max not tau_max in publication / perma upgrade dialogs
var get2DGraphValue = () => (BigNumber.ONE + currency.value.abs()).log10(). toNumber(); //used by the game to check what the 2d graph value is. why is it .abs? i dont know. 

var geta1 = (level) => Utils.getStepwisePowerSum(level, 3.5, 3, 0); //get the value of the variable from a power sum with a level of <level>, a base of 2, a step length of 5 and an initial value of 0 
var geta2 = (level) => BigNumber.TWO.pow(level); //get the value of the variable from a power of 2^level
var getb1 = (level) => Utils.getStepwisePowerSum(level, 6.5, 4, 0); //get the value of the variable from a power sum with a level of <level>, a base of 3, a step length of 2 and an initial value of 0
var getb2 = (level) => BigNumber.TWO.pow(level); //get the value of the variable from a power of 2^level

init();
