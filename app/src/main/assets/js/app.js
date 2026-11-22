// ============================================
// نادي شعب حضرموت - App Core JavaScript (SPA + Pro Features)
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }

    // ============================================
    // 1. DATA STORE (Official Club Content)
    // ============================================

    let PLAYERS_DATA = [
        // Goalkeepers
        { id: 1, name: 'محمد أمان', num: 1, pos: 'gk', posName: 'حارس مرمى', age: 26, height: '188 سم', weight: '82 كجم', matches: 11, cleanSheets: 6, saves: 38, cheers: 1420, bio: 'حارس المرمى الأمين لنادي شعب حضرموت والمنتخب الوطني، يتميز بسرعة ردة الفعل والبراعة في الكرات العالية.', img: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=400&h=400&fit=crop&q=80' },
        { id: 2, name: 'سالم بازهير', num: 22, pos: 'gk', posName: 'حارس مرمى', age: 23, height: '185 سم', weight: '79 كجم', matches: 2, cleanSheets: 1, saves: 9, cheers: 530, bio: 'حارس شاب موهوب تدرج في الفئات السنية للنادي وقدم مستويات لافتة في المباريات الودية والمسابقات.', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=80' },

        // Defenders
        { id: 3, name: 'أحمد سعيد باحاج', num: 4, pos: 'def', posName: 'قلب دفاع (كابتن الفريق)', age: 28, height: '184 سم', weight: '78 كجم', matches: 12, goals: 1, tackles: 45, cheers: 2850, bio: 'قائد الفريق وصخرة الدفاع، صمام الأمان الذي قاد شعب حضرموت إلى منصات التتويج بفضل قيادته وحنكته الدفاعية.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80' },
        { id: 4, name: 'خالد باوزير', num: 3, pos: 'def', posName: 'مدافع أيمن', age: 25, height: '176 سم', weight: '71 كجم', matches: 10, goals: 0, tackles: 32, cheers: 890, bio: 'ظهير عصري يمتاز بالسرعة والقدرة الفائقة على المساندة الهجومية ورفع العرضيات المتقنة لمهاجمي الفريق.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80' },
        { id: 5, name: 'عمر باسرور', num: 5, pos: 'def', posName: 'قلب دفاع', age: 27, height: '186 سم', weight: '80 كجم', matches: 12, goals: 2, tackles: 41, cheers: 1210, bio: 'مدافع صلب بارع في الكرات الرأسية وقطع الهجمات المرتدة، وسجل أهدافاً حاسمة من الضربات الركنية.', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&q=80' },
        { id: 6, name: 'سعيد بامعبد', num: 12, pos: 'def', posName: 'ظهير أيسر', age: 24, height: '175 سم', weight: '70 كجم', matches: 9, goals: 0, tackles: 28, cheers: 740, bio: 'أحد المواهب الواعدة في الجهة اليسرى، يمتاز باللياقة البدنية العالية والانضباط التكتيكي طوال 90 دقيقة.', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80' },

        // Midfielders
        { id: 7, name: 'عبدالله العكبري', num: 8, pos: 'mid', posName: 'صانع ألعاب ومايسترو', age: 26, height: '177 سم', weight: '73 كجم', matches: 12, goals: 4, assists: 7, cheers: 3100, bio: 'دينامو الفريق ومهندس العمليات الهجومية، يملك رؤية استثنائية في الملعب ودقة عالية في التمريرات البينية الحاسمة.', img: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=400&h=400&fit=crop&q=80' },
        { id: 8, name: 'حسين باصليلة', num: 6, pos: 'mid', posName: 'لاعب ارتكاز دفاعي', age: 25, height: '181 سم', weight: '76 كجم', matches: 11, goals: 1, assists: 3, cheers: 1350, bio: 'محور الارتكاز القوي الذي يربط بين خطوط الفريق، يقطع كرات الخصوم بدقة ويبني الهجمات من الخلف بثقة.', img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop&q=80' },
        { id: 9, name: 'أنيس المعاري', num: 10, pos: 'mid', posName: 'جناح هجومي دولي', age: 24, height: '174 سم', weight: '68 كجم', matches: 12, goals: 6, assists: 5, cheers: 4200, bio: 'نجم المنتخب الوطني وجوهرة شعب حضرموت، يمتاز بالمراوغة الفردية الممتعة والسرعة الخاطفة والتسديدات الصاروخية.', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80' },
        { id: 10, name: 'فاروق بازهير', num: 14, pos: 'mid', posName: 'وسط ميدان هجومي', age: 22, height: '179 سم', weight: '72 كجم', matches: 8, goals: 0, assists: 2, cheers: 680, bio: 'لاعب تكتيكي يتميز بالضغط العالي واستخلاص الكرات في مناطق المنافس، يمثل مستقبل خط وسط النادي.', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&q=80' },

        // Forwards
        { id: 11, name: 'محمد الحلاق', num: 9, pos: 'att', posName: 'رأس حربة وهداف الدوري', age: 27, height: '183 سم', weight: '77 كجم', matches: 12, goals: 9, assists: 2, cheers: 4890, bio: 'هداف الفريق الأول وأخطر مهاجم في الدوري، يتمتع بحس تهديفي فريد وقدرة على التسجيل من أنصاف الفرص.', img: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&h=400&fit=crop&q=80' },
        { id: 12, name: 'علي باتيس', num: 11, pos: 'att', posName: 'مهاجم سريع وجناح', age: 23, height: '175 سم', weight: '69 كجم', matches: 10, goals: 5, assists: 4, cheers: 2150, bio: 'مهاجم مشاكس يرهق خطوط دفاع الخصوم بانطلاقاته السريعة وسرعة تحوله من الدفاع للهجوم في لحظات.', img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&q=80' }
    ];

    let STAFF_DATA = [
        { name: 'الكابتن أنور عاشور', role: 'المدير الفني للفريق الأول', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80' },
        { name: 'سالم بوعسكر', role: 'مساعد المدرب', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&q=80' },
        { name: 'عمر باحكيم', role: 'مدرب حراس المرمى', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80' },
        { name: 'د. خالد بلبحيث', role: 'طبيب الفريق وإخصائي العلاج الطبيعي', img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&q=80' }
    ];

    let MATCHES_UPCOMING = [
        {
            id: 101,
            round: 'الجولة 12 - دوري الدرجة الأولى',
            home: 'شعب حضرموت',
            away: 'التلال عدن',
            date: 'الجمعة 28 نوفمبر 2025',
            time: '3:30 مساءً',
            stadium: 'استاد الفقيد بارادم - المكلا',
            isHome: true
        },
        {
            id: 102,
            round: 'الجولة 13 - دوري الدرجة الأولى',
            home: 'أهلي صنعاء',
            away: 'شعب حضرموت',
            date: 'الخميس 4 ديسمبر 2025',
            time: '4:00 مساءً',
            stadium: 'استاد علي محسن المريسي - صنعاء',
            isHome: false
        },
        {
            id: 103,
            round: 'الجولة 14 - دوري الدرجة الأولى',
            home: 'شعب حضرموت',
            away: 'الصقر تعز',
            date: 'الجمعة 12 ديسمبر 2025',
            time: '3:30 مساءً',
            stadium: 'استاد الفقيد بارادم - المكلا',
            isHome: true
        }
    ];

    let MATCHES_RESULTS = [
        {
            round: 'الجولة 11 - دوري الدرجة الأولى',
            home: 'شعب حضرموت',
            away: 'وحدة عدن',
            score: '2 - 1',
            date: 'الجمعة 21 نوفمبر 2025',
            scorers: 'محمد الحلاق 34’، أنيس المعاري 78’',
            stadium: 'استاد بارادم - المكلا'
        },
        {
            round: 'الجولة 10 - دوري الدرجة الأولى',
            home: 'اليرموك صنعاء',
            away: 'شعب حضرموت',
            score: '0 - 2',
            date: 'السبت 15 نوفمبر 2025',
            scorers: 'عبدالله العكبري 19’، علي باتيس 65’',
            stadium: 'ملعب وحدة صنعاء'
        },
        {
            round: 'الجولة 9 - دوري الدرجة الأولى',
            home: 'شعب حضرموت',
            away: 'هلال الحديدة',
            score: '3 - 0',
            date: 'الجمعة 7 نوفمبر 2025',
            scorers: 'محمد الحلاق (هدفين) 12’، 54’، عمر باسرور 88’',
            stadium: 'استاد بارادم - المكلا'
        }
    ];

    let STANDINGS_DATA = [
        { rank: 1, team: 'شعب حضرموت', played: 11, won: 8, draw: 2, lost: 1, diff: '+15', points: 26, isShaab: true },
        { rank: 2, team: 'أهلي صنعاء', played: 11, won: 7, draw: 3, lost: 1, diff: '+12', points: 24, isShaab: false },
        { rank: 3, team: 'التلال عدن', played: 11, won: 6, draw: 3, lost: 2, diff: '+8', points: 21, isShaab: false },
        { rank: 4, team: 'وحدة عدن', played: 11, won: 5, draw: 4, lost: 2, diff: '+6', points: 19, isShaab: false },
        { rank: 5, team: 'الصقر تعز', played: 11, won: 5, draw: 2, lost: 4, diff: '+3', points: 17, isShaab: false },
        { rank: 6, team: 'اليرموك', played: 11, won: 3, draw: 4, lost: 4, diff: '-2', points: 13, isShaab: false },
        { rank: 7, team: 'شعب إب', played: 11, won: 3, draw: 2, lost: 6, diff: '-7', points: 11, isShaab: false },
        { rank: 8, team: 'هلال الحديدة', played: 11, won: 1, draw: 2, lost: 8, diff: '-16', points: 5, isShaab: false }
    ];

    let TRANSFERS_DATA = {
        in: [
            { name: 'محمد الحلاق', from: 'نادي ظفار', role: 'مهاجم هداف', date: 'موسم 2025-2026', type: 'شراء نهائي', val: 'عقد موسمين', img: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&h=400&fit=crop&q=80' },
            { name: 'عبدالله العكبري', from: 'العروبة', role: 'صانع ألعاب', date: 'موسم 2025-2026', type: 'انتقال حر', val: 'عقد 3 مواسم', img: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=400&h=400&fit=crop&q=80' }
        ],
        out: [
            { name: 'سالم بامحرز', from: 'شعب حضرموت', to: 'النهضة العماني', role: 'مدافع', date: 'أكتوبر 2025', type: 'إعارة موسم', val: 'موسم واحد', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=80' }
        ],
        renew: [
            { name: 'أحمد سعيد باحاج (كابتن الفريق)', role: 'قلب دفاع', date: 'نوفمبر 2025', type: 'تجديد عقد', val: 'حتى صيف 2028', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80' },
            { name: 'محمد أمان', role: 'حارس مرمى', date: 'أكتوبر 2025', type: 'تجديد عقد', val: 'حتى صيف 2027', img: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=400&h=400&fit=crop&q=80' }
        ]
    };

    let MEDIA_DATA = {
        photos: [
            { title: 'أجواء تدريبات الفريق المسائية بملعب بارادم', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop&q=80', count: '18 صورة' },
            { title: 'احتفال اللاعبين بالفوز الأخير على وحدة عدن', img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=600&fit=crop&q=80', count: '25 صورة' },
            { title: 'حضور وتيفو الجماهير الشعباوية بالمكلا', img: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=600&fit=crop&q=80', count: '32 صورة' },
            { title: 'مؤتمر تقديم الصفقات الجديدة للموسم', img: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=600&fit=crop&q=80', count: '14 صورة' }
        ],
        videos: [
            { title: 'ملخص وأهداف مباراة شعب حضرموت 2 - 1 وحدة عدن', img: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop&q=80', dur: '4:20 دقيقة' },
            { title: 'أجمل 5 أهداف لنادي شعب حضرموت هذا الموسم', img: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=600&fit=crop&q=80', dur: '3:45 دقيقة' },
            { title: 'تصريحات المدير الفني أنور عاشور بعد الفوز', img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=600&fit=crop&q=80', dur: '2:30 دقيقة' }
        ]
    };

    let ANTHEMS_DATA = [
        { id: 1, title: 'النشيد الرسمي: يا نوارس المكلا', artist: 'كورال جماهير نادي شعب حضرموت', duration: '3:25', progress: 35 },
        { id: 2, title: 'أحمر وأبيض عشق السنين', artist: 'أهازيج التراس شعب حضرموت', duration: '2:40', progress: 0 },
        { id: 3, title: 'شعباوي في الميدان ما ينغلب', artist: 'هتاف المدرج الحضرمي', duration: '1:55', progress: 0 },
        { id: 4, title: 'جينا نشجع يا شعب العز', artist: 'رابطة مشجعي الشعب', duration: '2:15', progress: 0 }
    ];

    let NEWS_ALL = [
        {
            id: 1,
            title: 'جماهير شعب حضرموت .. سند الفريق وداعمه الأول في مسيرة الصدارة',
            date: '28 نوفمبر 2025',
            cat: 'الجماهير',
            readTime: '3 دقائق قراءة',
            author: 'المركز الإعلامي لنادي شعب حضرموت',
            img: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=500&fit=crop&q=80',
            content: `تواصل جماهير نادي شعب حضرموت الوفية رسم أجمل اللوحات التشجيعية في مدرجات استاد الفقيد بارادم بالمكلا وفي جميع ملاعب الوطن، مؤكدة أنها الرقم الصعب والداعم الأول لمسيرة نوارس حضرموت نحو الحفاظ على صدارة دوري الدرجة الأولى.\n\nوأكد رئيس النادي في تصريح خاص أن الحضور الجماهيري المكثف يمنح اللاعبين حافزاً معنوياً لا يضاهى لتقديم أفضل المستويات والقتال حتى آخر ثانية من أجل إسعاد الجماهير وحصد لقب الدوري.`
        },
        {
            id: 2,
            title: 'الفريق الأول يختتم تحضيراته التكتيكية لمواجهة التلال المرتقبة',
            date: '26 نوفمبر 2025',
            cat: 'الفريق الأول',
            readTime: '2 دقيقة قراءة',
            author: 'إدارة الإعلام الرياضي',
            img: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=500&fit=crop&q=80',
            content: `أنهى الفريق الأول لكرة القدم بنادي شعب حضرموت مساء اليوم حصته التدريبية الأخيرة على ملعب الفقيد بارادم بالمكلا تحت قيادة المدير الفني الكابتن أنور عاشور، استعداداً لموقعة الجولة الثانية عشرة أمام نادي التلال عدن.\n\nوشهدت التدريبات روحاً معنوية عالية بين اللاعبين وجاهزية تامة لكافة العناصر الأساسية، حيث ركز الجهاز الفني على اللمسات التكتيكية وتطبيق خطة المباراة بالانتشار السريع والضغط العالي.`
        },
        {
            id: 3,
            title: 'النادي يتعاقد رسمياً مع المهاجم الدولي محمد الحلاق لموسمين',
            date: '24 نوفمبر 2025',
            cat: 'الانتقالات',
            readTime: '4 دقائق قراءة',
            author: 'لجنة التعاقدات الرياضية',
            img: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=500&fit=crop&q=80',
            content: `أعلنت إدارة نادي شعب حضرموت برئاسة مجلس الإدارة رسمياً عن إتمام التعاقد مع المهاجم الدولي محمد الحلاق بعقد يمتد لموسمين قادمين، وذلك لتعزيز القوة الهجومية للفريق الأول.\n\nويأتي هذا التوقيع ضمن خطة النادي الاستراتيجية لتدعيم الصفوف بعناصر الخبرة الدولية للمنافسة على الألقاب المحلية وتمثيل الوطن في الاستحقاقات الخارجية القادمة.`
        },
        {
            id: 4,
            title: 'فوز مستحق لشعب حضرموت على وحدة عدن بهدفي الحلاق والمعاري',
            date: '21 نوفمبر 2025',
            cat: 'المباريات',
            readTime: '3 دقائق قراءة',
            author: 'المحرر الرياضي',
            img: 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=800&h=500&fit=crop&q=80',
            content: `في قمة كروية مثيرة حبست الأنفاس، حسم نادي شعب حضرموت ديربي الإثارة بالفوز على ضيفه وحدة عدن بنتيجة 2-1 وسط حضور جماهيري غفير غصت به مدرجات بارادم.\n\nافتتح المهاجم محمد الحلاق التسجيل في الدقيقة 34 من رأسية متقنة، قبل أن يضيف نجم الوسط أنيس المعاري هدف الحسم في الدقيقة 78 بتسديدة صاروخية سكنت الشباك لتشتعل المدرجات فرحاً.`
        },
        {
            id: 5,
            title: 'إدارة النادي تطلق بطاقات العضوية الإلكترونية الموحدة للجماهير',
            date: '18 نوفمبر 2025',
            cat: 'الإدارة',
            readTime: '2 دقيقة قراءة',
            author: 'أمانة سر النادي',
            img: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&h=500&fit=crop&q=80',
            content: `دشنت إدارة نادي شعب حضرموت منظومة بطاقات المشجع الإلكترونية الجديدة التي تتيح لجماهير النادي حجز تذاكر المباريات بسهولة والاستفادة من خصومات متجر النادي والفعاليات الحصرية.\n\nوتعد هذه الخطوة نقلة نوعية في التحول الرقمي الرياضي على مستوى الأندية اليمنية لتعزيز الترابط بين النادي وجماهيره العريضة في داخل الوطن والمهجر.`
        }
    ];

    let STORIES_DATA = [
        {
            id: 1,
            title: 'تدريبات اليوم',
            badge: 'مباشر 🔴',
            time: 'منذ ساعة',
            thumb: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=300&fit=crop&q=80',
            fullImg: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop&q=80',
            caption: '💪 انطلاق الحصة التدريبية المسائية بملعب بارادم وسط تركيز تكتيكي عالٍ من اللاعبين لموقعة الجمعة!'
        },
        {
            id: 2,
            title: 'أهداف القمة',
            badge: 'فيديو ⚽',
            time: 'منذ ساعتين',
            thumb: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=300&h=300&fit=crop&q=80',
            fullImg: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=1200&fit=crop&q=80',
            caption: '⚽ لقطة الهدف الصاروخي الذي حسم الثلاث نقاط الغالية في الجولة الأخيرة.. احتفالية نارية!'
        },
        {
            id: 3,
            title: 'مدرج النوارس',
            badge: 'تيفو 🔥',
            time: 'منذ 4 ساعات',
            thumb: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&h=300&fit=crop&q=80',
            fullImg: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=1200&fit=crop&q=80',
            caption: '❤️ لوحة جماهيرية مبهرة في المكلا تهتف بحب النادي وتساند نوارس حضرموت حتى الصافرة الأخيرة!'
        },
        {
            id: 4,
            title: 'كواليس الغرفة',
            badge: 'حماس 👏',
            time: 'منذ 6 ساعات',
            thumb: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&h=300&fit=crop&q=80',
            fullImg: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=1200&fit=crop&q=80',
            caption: '🏆 الروح العالية والأهازيج الحماسية داخل غرفة تبديل الملابس بعد تحقيق الانتصار الثمين!'
        },
        {
            id: 5,
            title: 'لقاء الكابتن',
            badge: 'تصريح 🎙️',
            time: 'أمس',
            thumb: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&q=80',
            fullImg: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=1200&fit=crop&q=80',
            caption: '🎙️ المدرب أنور عاشور: "الفريق في قمة الجاهزية البدنية والذهنية وسنلعب للفوز فقط لإسعاد جماهيرنا العريضة".'
        },
        {
            id: 6,
            title: 'نجم الأسبوع',
            badge: '⭐ نجم',
            time: 'أمس',
            thumb: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&h=300&fit=crop&q=80',
            fullImg: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1200&fit=crop&q=80',
            caption: '⭐ المهاجم محمد الحلاق يتوج بجائزة رجل المباراة وأفضل لاعب في الجولة بعد تألقه اللافت!'
        }
    ];

    // ============================================
    // 2. WEB AUDIO API SYNTHESIZER (Real Sound Effects!)
    // ============================================

    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtx;
    }

    function playTone(freq, type = 'sine', duration = 0.15) {
        try {
            const ctx = getAudioContext();
            if (ctx.state === 'suspended') ctx.resume();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {}
    }

    // Sound: Stadium Horn & Fan Anthem Rhythm
    function playFanCheerSound() {
        playTone(523.25, 'triangle', 0.2); // C5
        setTimeout(() => playTone(659.25, 'triangle', 0.25), 180); // E5
        setTimeout(() => playTone(783.99, 'triangle', 0.4), 380); // G5
    }

    function playAnthemTune() {
        const notes = [440, 554, 659, 880, 659, 880];
        notes.forEach((n, i) => {
            setTimeout(() => playTone(n, 'sine', 0.3), i * 220);
        });
    }

    // ============================================
    // 3. CONFETTI CELEBRATION ENGINE
    // ============================================

    const canvas = document.getElementById('confettiCanvas');
    let confettiParticles = [];
    let confettiAnimationId = null;

    function fireConfetti() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#DB1E24', '#FFD700', '#FFFFFF', '#B5121B', '#FF3038'];
        confettiParticles = [];

        for (let i = 0; i < 90; i++) {
            confettiParticles.push({
                x: canvas.width / 2,
                y: canvas.height * 0.4,
                r: Math.random() * 6 + 4,
                d: Math.random() * 60,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.floor(Math.random() * 10) - 10,
                tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
                tiltAngle: 0,
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.7) * 16
            });
        }

        if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);

        let frames = 0;
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frames++;

            confettiParticles.forEach(p => {
                p.tiltAngle += p.tiltAngleIncremental;
                p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2 + p.vy;
                p.x += Math.sin(p.d) + p.vx;
                p.vy += 0.2; // Gravity
                p.tilt = Math.sin(p.tiltAngle) * 12;

                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
                ctx.stroke();
            });

            if (frames < 140) {
                confettiAnimationId = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        render();
    }

    // ============================================
    // 4. SPA ROUTING & NAVIGATION
    // ============================================

    const allPages = document.querySelectorAll('.app-page');
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');

    const MANAGED_SECTION_PAGES = {
        basketball: 'basketballPage', volleyball: 'volleyballPage', handball: 'handballPage',
        tennis: 'tennisPage', taekwondo: 'taekwondoPage', athletics: 'athleticsPage',
        otherSports: 'otherSportsPage', board: 'boardPage', presidents: 'presidentsPage',
        membership: 'membershipPage', foundation: 'foundationPage', contact: 'contactPage'
    };
    const MANAGED_SECTION_TITLES = {
        basketball:'كرة السلة',volleyball:'كرة الطائرة',handball:'كرة اليد',tennis:'التنس',
        taekwondo:'التايكواندو',athletics:'ألعاب القوى',otherSports:'ألعاب أخرى',
        board:'مجلس الإدارة',presidents:'رؤساء النادي',membership:'عضوية النادي',
        foundation:'المؤسسة المجتمعية',contact:'تواصل معنا'
    };
    const escapeManagedText = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    async function loadManagedSection(key) {
        const target = document.getElementById('managedContent-' + key);
        if (!target) return;
        target.innerHTML = '<div class="managed-loading">جارٍ تحميل محتوى القسم...</div>';
        try {
            const response = await fetch('https://shaab-hadramout.pages.dev/api/sections?section=' + encodeURIComponent(key) + '&refresh=' + Date.now(), {cache:'no-store'});
            const payload = await response.json();
            if (!response.ok || !payload.success || !Array.isArray(payload.items)) throw new Error(payload.message || 'تعذر تحميل المحتوى');
            if (!payload.items.length) {
                target.innerHTML = '<div class="managed-empty">لا توجد مواد منشورة في قسم ' + escapeManagedText(MANAGED_SECTION_TITLES[key]) + ' حتى الآن.</div>';
                return;
            }
            target.innerHTML = payload.items.map(item => {
                const title = escapeManagedText(item.title);
                const body = escapeManagedText(item.content);
                const image = item.image_url ? '<img src="' + escapeManagedText(item.image_url) + '" alt="' + title + '" loading="lazy">' : '';
                let media = '';
                if (item.media_url) {
                    if (/\.(mp4|webm|mov)(\?|$)/i.test(item.media_url)) media = '<video controls playsinline preload="metadata" src="' + escapeManagedText(item.media_url) + '"></video>';
                    else media = '<a class="managed-content-link" href="' + escapeManagedText(item.media_url) + '" target="_blank" rel="noopener">عرض الملف المرفق</a>';
                }
                const price = item.price ? '<span class="managed-content-price">' + escapeManagedText(item.price) + '</span>' : '';
                return '<article class="managed-content-card">' + image + media + '<div class="managed-content-body"><h3>' + title + '</h3>' + (body ? '<p>' + body + '</p>' : '') + price + '</div></article>';
            }).join('');
        } catch (error) {
            target.innerHTML = '<div class="managed-error">' + escapeManagedText(error.message || 'تعذر تحميل القسم حالياً') + '</div>';
        }
    }

    function navigateToPage(pageId) {
        allPages.forEach(p => p.classList.remove('active'));

        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.scrollTop = 0;
        }
        const managedKey = Object.keys(MANAGED_SECTION_PAGES).find(key => MANAGED_SECTION_PAGES[key] === pageId);
        if (managedKey) loadManagedSection(managedKey);

        bottomNavItems.forEach(item => {
            const dest = item.getAttribute('data-navigate');
            if (dest === pageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        closeNotifications();
        closeMenu();
        closeAllModals();
    }

    document.querySelectorAll('[data-navigate]').forEach(el => {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-navigate');
            if (target) {
                playTone(480, 'sine', 0.08);
                navigateToPage(target);
            }
        });
    });

    document.querySelectorAll('[data-back]').forEach(btn => {
        btn.addEventListener('click', function() {
            playTone(400, 'sine', 0.08);
            navigateToPage('homePage');
        });
    });

    // ============================================
    // 5. STORIES / REELS CONTROLLER
    // ============================================

    function bindStoryEvents() {
        document.querySelectorAll('.story-circle-item').forEach(el => {
            el.onclick = function() {
                const idx = parseInt(this.getAttribute('data-story-idx'), 10);
                this.classList.add('viewed');
                openStoryViewer(idx);
            };
        });
    }

    function renderStories() {
        const container = document.getElementById('storiesScrollContainer');
        if (!container) return;

        // Show exactly five Reels on the home screen; keep the full data for the viewer.
        if (!container.children || container.children.length === 0) {
            container.innerHTML = STORIES_DATA.slice(0, 5).map((s, idx) => `
                <div class="story-circle-item" data-story-idx="${idx}">
                    <div class="story-avatar-ring">
                        <div class="story-avatar-img-wrap">
                            <img src="${s.thumb}" alt="${s.title}" class="story-avatar-img" loading="lazy">
                        </div>
                        <span class="story-badge-pill">${s.badge}</span>
                    </div>
                    <span class="story-circle-label">${s.title}</span>
                </div>
            `).join('');
        }

        // Also trim any pre-rendered sixth item without deleting it from CMS or STORIES_DATA.
        Array.from(container.children).slice(5).forEach(item => item.remove());
        bindStoryEvents();
    }
    renderStories();

    // Load club-managed Reels from the club CMS; keep the built-in preview stories as fallback.
    async function loadClubReels() {
        try {
            const response = await fetch('https://shaab-hadramout.pages.dev/api/reels?refresh=' + Date.now(), { cache: 'no-store' });
            const payload = await response.json();
            if (!response.ok || !payload.success || !Array.isArray(payload.reels) || !payload.reels.length) return;
            STORIES_DATA = payload.reels.map((item, index) => ({
                id: item.id,
                title: item.title || ('يوميات النوارس ' + (index + 1)),
                badge: item.media_type === 'video' ? 'فيديو ▶' : 'صورة',
                time: item.created_at ? 'من يوميات النادي' : 'جديد',
                thumb: item.thumbnail_url || item.media_url,
                fullImg: item.media_url,
                mediaUrl: item.media_url,
                mediaType: item.media_type || 'image',
                caption: item.caption || item.title || ''
            }));
            const container = document.getElementById('storiesScrollContainer');
            if (container) {
                container.innerHTML = '';
                renderStories();
            }
        } catch (error) {
            console.warn('Club Reels API unavailable; using built-in stories.', error);
        }
    }
    loadClubReels();

    let currentStoryIdx = 0;
    let storyTimer = null;
    let storyProgressPct = 0;

    function openStoryViewer(idx) {
        currentStoryIdx = idx;
        const modal = document.getElementById('storyViewerModal');
        if (!modal) return;

        modal.classList.add('active');
        playTone(550, 'sine', 0.1);
        renderStoryProgressBars();
        loadStory(idx);
    }

    function renderStoryProgressBars() {
        const wrap = document.getElementById('storyProgressBars');
        if (!wrap) return;

        wrap.innerHTML = STORIES_DATA.map((_, i) => `
            <div class="story-progress-seg ${i < currentStoryIdx ? 'filled' : ''}" id="storySeg_${i}">
                <div class="story-progress-seg-fill" id="storySegFill_${i}" style="width: ${i < currentStoryIdx ? '100%' : '0%'}"></div>
            </div>
        `).join('');
    }

    function loadStory(idx) {
        currentStoryIdx = idx;
        const s = STORIES_DATA[idx];
        if (!s) {
            closeStoryViewer();
            return;
        }

        const storyImage = document.getElementById('storyMediaImage');
        const storyVideo = document.getElementById('storyMediaVideo');
        const mediaUrl = s.mediaUrl || s.fullImg;
        if (storyVideo) {
            storyVideo.pause();
            storyVideo.onended = null;
        }
        if (s.mediaType === 'video' && storyVideo) {
            document.getElementById('storyTapPrev').style.display = 'none';
            document.getElementById('storyTapNext').style.display = 'none';
            storyImage.style.display = 'none';
            storyVideo.style.display = 'block';
            storyVideo.src = mediaUrl;
            storyVideo.load();
            storyVideo.play().catch(() => {});
            storyVideo.onended = () => {
                if (currentStoryIdx + 1 < STORIES_DATA.length) loadStory(currentStoryIdx + 1);
                else closeStoryViewer();
            };
        } else {
            document.getElementById('storyTapPrev').style.display = '';
            document.getElementById('storyTapNext').style.display = '';
            if (storyVideo) {
                storyVideo.pause();
                storyVideo.removeAttribute('src');
                storyVideo.load();
                storyVideo.style.display = 'none';
            }
            storyImage.style.display = 'block';
            storyImage.src = mediaUrl;
        }
        document.getElementById('storyCaptionText').textContent = s.caption;
        document.getElementById('storyTimeLabel').textContent = s.time;

        for (let i = 0; i < STORIES_DATA.length; i++) {
            const seg = document.getElementById(`storySeg_${i}`);
            const fill = document.getElementById(`storySegFill_${i}`);
            if (i < idx) {
                if (seg) seg.className = 'story-progress-seg filled';
                if (fill) fill.style.width = '100%';
            } else if (i === idx) {
                if (seg) seg.className = 'story-progress-seg';
                if (fill) fill.style.width = '0%';
            } else {
                if (seg) seg.className = 'story-progress-seg';
                if (fill) fill.style.width = '0%';
            }
        }

        if (s.mediaType === 'video') {
            clearInterval(storyTimer);
            const fill = document.getElementById(`storySegFill_${idx}`);
            if (fill) fill.style.width = '0%';
        } else {
            startStoryProgress(idx);
        }
    }

    function startStoryProgress(idx) {
        clearInterval(storyTimer);
        storyProgressPct = 0;

        storyTimer = setInterval(() => {
            storyProgressPct += 2;
            const fill = document.getElementById(`storySegFill_${idx}`);
            if (fill) fill.style.width = `${storyProgressPct}%`;

            if (storyProgressPct >= 100) {
                clearInterval(storyTimer);
                if (currentStoryIdx + 1 < STORIES_DATA.length) {
                    loadStory(currentStoryIdx + 1);
                } else {
                    closeStoryViewer();
                }
            }
        }, 100);
    }

    function closeStoryViewer() {
        clearInterval(storyTimer);
        const video = document.getElementById('storyMediaVideo');
        if (video) { video.pause(); video.onended = null; }
        const modal = document.getElementById('storyViewerModal');
        if (modal) modal.classList.remove('active');
    }

    document.getElementById('closeStoryViewerBtn')?.addEventListener('click', closeStoryViewer);

    document.getElementById('storyTapNext')?.addEventListener('click', () => {
        clearInterval(storyTimer);
        if (currentStoryIdx + 1 < STORIES_DATA.length) {
            loadStory(currentStoryIdx + 1);
        } else {
            closeStoryViewer();
        }
    });

    document.getElementById('storyTapPrev')?.addEventListener('click', () => {
        clearInterval(storyTimer);
        if (currentStoryIdx > 0) {
            loadStory(currentStoryIdx - 1);
        } else {
            loadStory(0);
        }
    });

    document.getElementById('storyLikeBtn')?.addEventListener('click', function() {
        playFanCheerSound();
        const container = document.getElementById('floatingHeartsContainer');
        if (container) {
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    const heart = document.createElement('i');
                    heart.className = 'fas fa-heart floating-heart';
                    heart.style.left = `${50 + (Math.random() * 60 - 30)}px`;
                    container.appendChild(heart);
                    setTimeout(() => heart.remove(), 1500);
                }, i * 120);
            }
        }
        showToast('أرسلت إعجاباً بالنوارس ❤️');
    });

    document.getElementById('storyReplyInput')?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            playTone(600, 'sine', 0.15);
            showToast('تم إرسال رسالتك للنادي بنجاح! 📨');
            this.value = '';
        }
    });

    document.getElementById('storyShareBtn')?.addEventListener('click', function() {
        showToast('تم نسخ رابط القصة للمشاركة 📋');
    });

    // ============================================
    // 6. INTERACTIVE MODALS
    // ============================================

    function closeAllModals() {
        document.querySelectorAll('.app-modal-sheet').forEach(m => m.classList.remove('open'));
        document.querySelectorAll('.modal-overlay').forEach(o => o.classList.remove('active'));
        document.getElementById('photoLightbox')?.classList.remove('active');
        closeStoryViewer();
    }

    // --- 1. Player Detail Modal ---
    window.openPlayerModal = function(playerId) {
        const player = PLAYERS_DATA.find(p => p.id === playerId);
        if (!player) return;

        playTone(550, 'sine', 0.12);

        document.getElementById('modalPlayerTitle').textContent = `بطاقة اللاعب #${player.num}`;
        const body = document.getElementById('playerModalBody');
        body.innerHTML = `
            <div class="player-hero-box">
                <div class="player-hero-avatar">
                    <img src="${player.img}" alt="${player.name}">
                    <span class="player-hero-num-badge">${player.num}</span>
                </div>
                <div class="player-hero-info">
                    <h4>${player.name}</h4>
                    <p class="player-hero-pos">${player.posName}</p>
                    <div class="player-meta-tags">
                        <span class="player-meta-tag"><i class="fas fa-flag"></i> ${player.nationality || 'يمني'}</span>
                        <span class="player-meta-tag"><i class="fas fa-calendar"></i> ${player.age} سنة</span>
                        <span class="player-meta-tag"><i class="fas fa-ruler-vertical"></i> ${player.height}</span>
                    </div>
                </div>
            </div>

            <div class="player-stats-grid">
                <div class="player-stat-bubble">
                    <strong>${player.matches}</strong>
                    <span>المباريات</span>
                </div>
                <div class="player-stat-bubble">
                    <strong>${player.pos === 'gk' ? player.cleanSheets : (player.goals || 0)}</strong>
                    <span>${player.pos === 'gk' ? 'كلين شيت' : 'الأهداف'}</span>
                </div>
                <div class="player-stat-bubble">
                    <strong>${player.pos === 'gk' ? (player.saves || 0) : (player.assists || player.tackles || 0)}</strong>
                    <span>${player.pos === 'gk' ? 'تصديات' : (player.assists > 0 ? 'تمريرات حاسمة' : 'افتكاكات')}</span>
                </div>
                <div class="player-stat-bubble">
                    <strong>${player.readiness ?? 90}%</strong>
                    <span>الجاهزية</span>
                </div>
            </div>

            <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:14px; padding:12px 14px; margin-bottom:16px;">
                <h5 style="font-size:12px; font-weight:800; color:var(--primary-red); margin-bottom:6px;"><i class="fas fa-id-card"></i> نبذة عن اللاعب</h5>
                <p style="font-size:11.5px; line-height:1.6; color:var(--text-gray);">${player.bio}</p>
            </div>

            <div class="fan-cheer-section">
                <h4 style="font-size:13.5px; font-weight:800;">تشجيع جماهير النوارس 👏</h4>
                <p style="font-size:11px; opacity:0.9; margin-top:2px;">أرسل هتافك وتحيتك للاعب لدعمه في المباراة القادمة!</p>
                <button class="fan-cheer-btn" id="fanCheerActionBtn">
                    <i class="fas fa-hands-clapping"></i> <span id="cheerCountLabel">${player.cheers}</span> تشجيع
                </button>
            </div>
        `;

        document.getElementById('playerModalOverlay').classList.add('active');
        document.getElementById('playerModalSheet').classList.add('open');

        // Cheering button click
        document.getElementById('fanCheerActionBtn').addEventListener('click', function() {
            player.cheers++;
            document.getElementById('cheerCountLabel').textContent = player.cheers.toLocaleString();
            playFanCheerSound();
            fireConfetti();
            showToast(`أرسلت تحية وتشجيع للنجم ${player.name} 🔥`);
        });
    };

    document.getElementById('closePlayerModalBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('playerModalOverlay')?.addEventListener('click', closeAllModals);

    // --- 2. Match Center & E-Ticket Modal ---
    window.openMatchModal = function() {
        playTone(520, 'sine', 0.12);

        const body = document.getElementById('matchModalBody');
        body.innerHTML = `
            <div class="match-hero-score-banner">
                <div style="font-size:11.5px; color:#FFD700; font-weight:700; margin-bottom:8px;">
                    <i class="fas fa-fire"></i> قمة الجولة 12 - دوري الدرجة الأولى
                </div>
                <div style="display:flex; align-items:center; justify-content:space-around;">
                    <div style="text-align:center;">
                        <span style="font-size:13px; font-weight:800; display:block;">شعب حضرموت</span>
                        <small style="font-size:10px; color:#ddd;">متصدر الترتيب</small>
                    </div>
                    <div style="background:rgba(255,255,255,0.15); padding:6px 14px; border-radius:20px; font-size:15px; font-weight:900;">
                        VS
                    </div>
                    <div style="text-align:center;">
                        <span style="font-size:13px; font-weight:800; display:block;">التلال عدن</span>
                        <small style="font-size:10px; color:#ddd;">المركز الثالث</small>
                    </div>
                </div>
                <div style="margin-top:10px; font-size:11px; color:#eee;">
                    <i class="far fa-clock"></i> الجمعة 28 نوفمبر 2025 - 3:30 عصراً
                </div>
            </div>

            <!-- Football Pitch Formation -->
            <div class="match-pitch-container">
                <h4><i class="fas fa-clipboard-list text-red"></i> التشكيلة المتوقعة لنادي شعب حضرموت (4-3-3)</h4>
                <div class="football-pitch">
                    <div class="pitch-half-line"></div>
                    <div class="pitch-center-circle"></div>
                    <div class="pitch-penalty-top"></div>
                    <div class="pitch-penalty-bottom"></div>

                    <!-- Goalkeeper -->
                    <div class="pitch-player" style="bottom: 12px; left: 50%;" onclick="openPlayerModal(1)">
                        <div class="pitch-shirt-icon" style="background:#27ae60;">1</div>
                        <span class="pitch-player-name">محمد أمان</span>
                    </div>

                    <!-- Defenders (4) -->
                    <div class="pitch-player" style="bottom: 58px; left: 16%;" onclick="openPlayerModal(4)">
                        <div class="pitch-shirt-icon">3</div>
                        <span class="pitch-player-name">باوزير</span>
                    </div>
                    <div class="pitch-player" style="bottom: 52px; left: 38%;" onclick="openPlayerModal(3)">
                        <div class="pitch-shirt-icon">4</div>
                        <span class="pitch-player-name">باحاج (C)</span>
                    </div>
                    <div class="pitch-player" style="bottom: 52px; left: 62%;" onclick="openPlayerModal(5)">
                        <div class="pitch-shirt-icon">5</div>
                        <span class="pitch-player-name">باسرور</span>
                    </div>
                    <div class="pitch-player" style="bottom: 58px; left: 84%;" onclick="openPlayerModal(6)">
                        <div class="pitch-shirt-icon">12</div>
                        <span class="pitch-player-name">بامعبد</span>
                    </div>

                    <!-- Midfielders (3) -->
                    <div class="pitch-player" style="top: 50%; left: 30%;" onclick="openPlayerModal(8)">
                        <div class="pitch-shirt-icon">6</div>
                        <span class="pitch-player-name">باصليلة</span>
                    </div>
                    <div class="pitch-player" style="top: 45%; left: 50%;" onclick="openPlayerModal(7)">
                        <div class="pitch-shirt-icon">8</div>
                        <span class="pitch-player-name">العكبري</span>
                    </div>
                    <div class="pitch-player" style="top: 50%; left: 70%;" onclick="openPlayerModal(10)">
                        <div class="pitch-shirt-icon">14</div>
                        <span class="pitch-player-name">بازهير</span>
                    </div>

                    <!-- Attackers (3) -->
                    <div class="pitch-player" style="top: 24%; left: 20%;" onclick="openPlayerModal(12)">
                        <div class="pitch-shirt-icon">11</div>
                        <span class="pitch-player-name">باتيس</span>
                    </div>
                    <div class="pitch-player" style="top: 14%; left: 50%;" onclick="openPlayerModal(11)">
                        <div class="pitch-shirt-icon">9</div>
                        <span class="pitch-player-name">الحلاق ⚽</span>
                    </div>
                    <div class="pitch-player" style="top: 24%; left: 80%;" onclick="openPlayerModal(9)">
                        <div class="pitch-shirt-icon">10</div>
                        <span class="pitch-player-name">المعاري ⭐</span>
                    </div>
                </div>
            </div>

            <!-- E-Ticket Section -->
            <div class="ticket-generator-box">
                <button class="book-ticket-btn" id="bookTicketActionBtn">
                    <i class="fas fa-ticket"></i> إصدار التذكرة الرقمية للمباراة مجاناً 🎟️
                </button>

                <div class="digital-ticket-card" id="digitalTicketCard" style="display:none;">
                    <div class="ticket-notch-left"></div>
                    <div class="ticket-notch-right"></div>
                    <div class="ticket-header-strip">
                        <strong>نادي شعب حضرموت vs التلال</strong>
                        <span style="font-size:11px; color:#888;">#SHB-2025-998</span>
                    </div>
                    <div class="ticket-seats-row">
                        <div class="ticket-seat-col">
                            <span>البوابة</span>
                            <strong>Gate 03</strong>
                        </div>
                        <div class="ticket-seat-col">
                            <span>المدرج</span>
                            <strong>مدرج النوارس</strong>
                        </div>
                        <div class="ticket-seat-col">
                            <span>المقعد</span>
                            <strong>14-B</strong>
                        </div>
                    </div>
                    <div class="ticket-barcode-strip">
                        <div>
                            <span style="font-size:10px; color:#777; display:block;">تاريخ الفعالية:</span>
                            <strong style="font-size:11px;">28 نوفمبر 2025</strong>
                        </div>
                        <div class="fake-barcode">||| | |||| | ||||| |</div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('matchModalOverlay').classList.add('active');
        document.getElementById('matchModalSheet').classList.add('open');

        document.getElementById('bookTicketActionBtn').addEventListener('click', function() {
            document.getElementById('digitalTicketCard').style.display = 'block';
            this.innerHTML = '<i class="fas fa-check-circle"></i> تم تأكيد حجز تذكرتك بنجاح!';
            this.style.background = '#27ae60';
            playTone(660, 'triangle', 0.25);
            fireConfetti();
            showToast('تم إصدار تذكرتك الرقمية للمباراة! أهلاً بك في بارادم 🏟️');
        });
    };

    document.getElementById('closeMatchModalBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('matchModalOverlay')?.addEventListener('click', closeAllModals);

    // --- 3. News Article Modal ---
    window.openArticleModal = function(newsId) {
        const article = NEWS_ALL.find(n => n.id === newsId) || NEWS_ALL[0];
        playTone(450, 'sine', 0.1);

        const body = document.getElementById('articleModalBody');
        body.innerHTML = `
            <div style="border-radius:16px; overflow:hidden; margin-bottom:14px; max-height:220px;">
                <img src="${article.img}" alt="${article.title}" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                <span class="slide-category" style="font-size:10px; margin:0;">${article.cat}</span>
                <span style="font-size:11px; color:var(--text-light);"><i class="far fa-clock"></i> ${article.date}</span>
                <span style="font-size:11px; color:var(--text-light);"><i class="fas fa-book-open"></i> ${article.readTime}</span>
            </div>
            <h3 style="font-size:16px; font-weight:800; color:var(--text-dark); line-height:1.5; margin-bottom:12px;">
                ${article.title}
            </h3>
            <div style="font-size:12px; color:var(--primary-red); font-weight:700; margin-bottom:12px;">
                بقلم: ${article.author}
            </div>
            <div style="font-size:12.5px; line-height:1.8; color:var(--text-gray); white-space:pre-line;">
                ${article.content}
            </div>
            <div style="margin-top:20px; padding-top:14px; border-top:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                <button onclick="navigator.clipboard.writeText(window.location.href); showToast('تم نسخ رابط المقال للمشاركة');" style="background:var(--card-bg); border:1px solid var(--border-color); padding:8px 16px; border-radius:20px; font-size:12px; font-family:'Cairo'; font-weight:700; cursor:pointer;">
                    <i class="fas fa-share-nodes text-red"></i> مشاركة الخبر
                </button>
                <span style="font-size:11px; color:var(--text-light);">المركز الإعلامي الرسمي</span>
            </div>
        `;

        document.getElementById('articleModalOverlay').classList.add('active');
        document.getElementById('articleModalSheet').classList.add('open');
    };

    document.getElementById('closeArticleModalBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('articleModalOverlay')?.addEventListener('click', closeAllModals);

    // --- 4. Club Store & Jersey Customizer ---
    window.openStoreModal = function() {
        playTone(500, 'sine', 0.1);
        document.getElementById('storeModalOverlay').classList.add('active');
        document.getElementById('storeModalSheet').classList.add('open');
        loadClubStore();
    };

    document.getElementById('openStoreMenuItem')?.addEventListener('click', () => {
        closeMenu();
        openStoreModal();
    });

    document.getElementById('closeStoreModalBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('storeModalOverlay')?.addEventListener('click', closeAllModals);

    // Jersey Customizer inputs
    const jerseyNameInput = document.getElementById('customJerseyNameInput');
    const jerseyNumInput = document.getElementById('customJerseyNumberInput');
    const jerseyNameDisplay = document.getElementById('jerseyNameDisplay');
    const jerseyNumDisplay = document.getElementById('jerseyNumberDisplay');

    if (jerseyNameInput && jerseyNameDisplay) {
        jerseyNameInput.addEventListener('input', function() {
            jerseyNameDisplay.textContent = this.value || 'أيمن';
        });
    }

    if (jerseyNumInput && jerseyNumDisplay) {
        jerseyNumInput.addEventListener('input', function() {
            jerseyNumDisplay.textContent = this.value || '10';
        });
    }

    // Size Pills Selection
    document.querySelectorAll('.size-pill-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size-pill-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            playTone(450, 'sine', 0.05);
        });
    });

    // Order Jersey Action
    document.getElementById('orderJerseyBtn')?.addEventListener('click', function() {
        const name = jerseyNameDisplay.textContent;
        const num = jerseyNumDisplay.textContent;
        playTone(600, 'sine', 0.2);
        fireConfetti();
        showToast(`تم استلام طلب قميص النوارس باسم: ${name} (#${num}) بنجاح! 👕🎉`);
    });

    // --- 5. Photo Lightbox ---
    window.openLightbox = function(imgSrc, caption) {
        const lb = document.getElementById('photoLightbox');
        if (!lb) return;
        document.getElementById('lightboxImage').src = imgSrc;
        document.getElementById('lightboxCaption').textContent = caption;
        lb.classList.add('active');
    };

    document.getElementById('closeLightboxBtn')?.addEventListener('click', () => {
        document.getElementById('photoLightbox')?.classList.remove('active');
    });

    // ============================================
    // 6. RENDER VIEWS DYNAMICALLY
    // ============================================

    // Render Players
    function renderPlayers(category = 'all') {
        const container = document.getElementById('playersContainer');
        if (!container) return;

        if (category === 'staff') {
            container.innerHTML = STAFF_DATA.map(st => `
                <div class="staff-card">
                    <img src="${st.img}" alt="${st.name}" class="staff-img" loading="lazy">
                    <div class="staff-info">
                        <h4>${st.name}</h4>
                        <p>${st.role}</p>
                    </div>
                </div>
            `).join('');
            return;
        }

        const filtered = category === 'all' 
            ? PLAYERS_DATA 
            : PLAYERS_DATA.filter(p => p.pos === category);

        container.innerHTML = filtered.map(p => `
            <div class="player-card" onclick="openPlayerModal(${p.id})">
                <div class="player-card-img-wrap">
                    <img src="${p.img}" alt="${p.name}" loading="lazy">
                    <span class="player-number">${p.num}</span>
                    <span class="player-position-badge">${p.posName}</span>
                </div>
                <div class="player-info">
                    <h4>${p.name}</h4>
                    <p>العمر: ${p.age} سنة</p>
                    <div class="player-stats-row">
                        <div class="player-stat-col">
                            <span>المباريات</span>
                            <strong>${p.matches}</strong>
                        </div>
                        <div class="player-stat-col">
                            <span>${p.pos === 'gk' ? 'شباك نظيفة' : 'الأهداف'}</span>
                            <strong>${p.pos === 'gk' ? p.cleanSheets : (p.goals || 0)}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    renderPlayers('all');

    document.querySelectorAll('[data-player-cat]').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('[data-player-cat]').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderPlayers(this.getAttribute('data-player-cat'));
        });
    });

    // Render Matches
    function renderMatches(type = 'upcoming') {
        const container = document.getElementById('matchesContainer');
        const standingsPanel = document.getElementById('matchesStandingsPanel');
        if (!container) return;
        const showStandings = type === 'standings';
        container.style.display = showStandings ? 'none' : '';
        if (standingsPanel) standingsPanel.hidden = !showStandings;
        if (showStandings) { renderStandings(); return; }

        if (type === 'upcoming') {
            const safeMatchText = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
            const matchLogo = (url, name, isClub) => {
                const raw = String(url || (isClub ? 'images/logo.png' : '')).trim();
                const safe = (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('/api/media/') || raw.startsWith('images/')) ? raw : '';
                return safe
                    ? `<img src="${safeMatchText(safe)}" alt="${safeMatchText(name)}" class="match-team-logo-img" onerror="this.outerHTML='<i class=&quot;fas fa-shield-halved&quot;></i>'">`
                    : '<i class="fas fa-shield-halved"></i>';
            };
            container.innerHTML = MATCHES_UPCOMING.map(m => {
                const homeIsClub = !!m.isHome;
                const homeLogo = homeIsClub ? (m.homeLogo || 'images/logo.png') : m.opponentLogo;
                const awayLogo = homeIsClub ? m.opponentLogo : (m.homeLogo || 'images/logo.png');
                return `
                <div class="match-card-full" onclick="openMatchModal()">
                    <div class="match-competition-tag">
                        <span><i class="fas fa-trophy"></i> ${safeMatchText(m.round)}</span>
                        <span class="time-badge">${safeMatchText(m.time)}</span>
                    </div>
                    <div class="match-teams-row">
                        <div class="m-team">
                            <div class="m-team-logo">${matchLogo(homeLogo, m.home, homeIsClub)}</div>
                            <span>${safeMatchText(m.home)}</span>
                        </div>
                        <div class="m-center-score">
                            <span class="vs-text">VS</span>
                        </div>
                        <div class="m-team">
                            <div class="m-team-logo">${matchLogo(awayLogo, m.away, !homeIsClub)}</div>
                            <span>${safeMatchText(m.away)}</span>
                        </div>
                    </div>
                    <div class="match-venue">
                        <i class="far fa-calendar"></i> ${safeMatchText(m.date)} | <i class="fas fa-location-dot"></i> ${safeMatchText(m.stadium)}
                    </div>
                </div>`;
            }).join('');
        } else {
            container.innerHTML = MATCHES_RESULTS.map(m => `
                <div class="match-card-full">
                    <div class="match-competition-tag">
                        <span><i class="fas fa-trophy"></i> ${m.round}</span>
                        <span>${m.date}</span>
                    </div>
                    <div class="match-teams-row">
                        <div class="m-team">
                            <div class="m-team-logo"><i class="fas fa-shield-halved"></i></div>
                            <span>${m.home}</span>
                        </div>
                        <div class="m-center-score">
                            <span class="score-badge">${m.score}</span>
                        </div>
                        <div class="m-team">
                            <div class="m-team-logo"><i class="fas fa-shield-halved"></i></div>
                            <span>${m.away}</span>
                        </div>
                    </div>
                    <div class="match-venue" style="color:var(--primary-red); font-weight:700;">
                        ⚽ مسجلو الأهداف: ${m.scorers}
                    </div>
                </div>
            `).join('');
        }
    }
    renderMatches('upcoming');

    document.querySelectorAll('[data-match-tab]').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('[data-match-tab]').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderMatches(this.getAttribute('data-match-tab'));
        });
    });

    // Render Standings
    function renderStandings() {
        const tbody = document.getElementById('standingsBody');
        if (!tbody) return;

        const rowsHtml = STANDINGS_DATA.map(row => `
            <tr class="${row.isShaab ? 'highlight-shaab' : ''}">
                <td><strong>${row.rank}</strong></td>
                <td class="text-right">${row.logo && /^(https?:\\/\\/|\\/api\\/media\\/)/i.test(row.logo) ? `<img src="${row.logo.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}" alt="" style="width:30px;height:30px;object-fit:contain;vertical-align:middle;margin-left:8px" loading="lazy">` : ''}<strong>${row.team}</strong> ${row.isShaab ? '⭐' : ''}</td>
                <td>${row.played}</td>
                <td>${row.won}</td>
                <td>${row.draw}</td>
                <td>${row.lost}</td>
                <td>${row.diff}</td>
                <td><strong>${row.points}</strong></td>
            </tr>
        `).join('');
        document.querySelectorAll('#standingsBody, #matchesStandingsBody').forEach(body => { body.innerHTML = rowsHtml; });
    }
    renderStandings();

    // Render Transfers
    function renderTransfers(type = 'in') {
        const container = document.getElementById('transfersContainer');
        if (!container) return;

        const list = TRANSFERS_DATA[type] || [];
        container.innerHTML = list.map(t => `
            <div class="transfer-card">
                <img src="${t.img}" alt="${t.name}" class="transfer-avatar" loading="lazy">
                <div class="transfer-details">
                    <h4>${t.name}</h4>
                    <span class="transfer-type ${type === 'in' ? 'trans-in' : type === 'out' ? 'trans-out' : 'trans-renew'}">${t.type}</span>
                    <div class="transfer-club-flow">
                        <span>${t.from ? t.from + ' ➔ ' : ''}${t.to || 'شعب حضرموت'}</span>
                        <span>• ${t.val}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    renderTransfers('in');

    document.querySelectorAll('[data-trans-tab]').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('[data-trans-tab]').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderTransfers(this.getAttribute('data-trans-tab'));
        });
    });

    // Render Media
    function renderMedia(type = 'photos') {
        const container = document.getElementById('mediaGalleryContainer');
        if (!container) return;
        const list = MEDIA_DATA[type] || [];
        container.innerHTML = list.map(item => {
            const title = String(item.title || '');
            const url = String(item.media_url || item.img || '');
            const safeTitle = title.replace(/[&<>\"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[ch]));
            const safeUrl = url.replace(/[\"']/g, '');
            const media = type === 'videos'
                ? '<video controls playsinline preload="metadata" poster="' + (item.img || '') + '" src="' + safeUrl + '" style="width:100%;height:100%;object-fit:cover"></video>'
                : '<img src="' + safeUrl + '" alt="' + safeTitle + '" loading="lazy">';
            return '<div class="media-item-box"><div class="media-item-thumb">' + media + '</div><div class="media-item-title">' + safeTitle + '</div></div>';
        }).join('');
    }    renderMedia('photos');

    document.querySelectorAll('[data-media-tab]').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('[data-media-tab]').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderMedia(this.getAttribute('data-media-tab'));
        });
    });

    // Render Anthems
    function renderAnthems() {
        const list = document.getElementById('anthemsList');
        if (!list) return;

        list.innerHTML = ANTHEMS_DATA.map((a, i) => `
            <div class="chant-row ${i === 0 ? 'active' : ''}" data-anthem-index="${i}">
                <div class="chant-title"><i class="fas fa-music text-red" style="margin-left:6px;"></i> ${a.title}</div>
                <div class="chant-duration">${a.duration}</div>
            </div>
        `).join('');

        document.querySelectorAll('.chant-row').forEach(row => {
            row.addEventListener('click', function() {
                document.querySelectorAll('.chant-row').forEach(r => r.classList.remove('active'));
                this.classList.add('active');
                const idx = parseInt(this.getAttribute('data-anthem-index'), 10);
                loadAnthem(idx);
            });
        });
    }
    renderAnthems();

    // Audio Player State
    let currentAnthemIdx = 0;
    let isPlaying = false;
    let audioTimer = null;
    let audioSecs = 72; // 1:12

    let clubAudioPlayer = null;
    function loadAnthem(index) {
        if (!ANTHEMS_DATA.length) return;
        currentAnthemIdx = (index + ANTHEMS_DATA.length) % ANTHEMS_DATA.length;
        const song = ANTHEMS_DATA[currentAnthemIdx];
        document.getElementById('currentAnthemTitle').textContent = song.title || 'نشيد النادي';
        document.getElementById('currentAnthemArtist').textContent = song.artist || song.description || 'أناشيد نادي شعب حضرموت';
        document.getElementById('totalTimeDisplay').textContent = song.duration || '—:—';
        if (clubAudioPlayer) { clubAudioPlayer.pause(); clubAudioPlayer.onended = null; }
        clubAudioPlayer = song.audio_url ? new Audio(song.audio_url) : null;
        if (clubAudioPlayer) {
            clubAudioPlayer.preload = 'metadata';
            clubAudioPlayer.addEventListener('loadedmetadata', () => {
                const d = clubAudioPlayer.duration;
                if (Number.isFinite(d)) document.getElementById('totalTimeDisplay').textContent = Math.floor(d/60)+':' + String(Math.floor(d%60)).padStart(2,'0');
            });
            clubAudioPlayer.onended = () => loadAnthem((currentAnthemIdx + 1) % ANTHEMS_DATA.length);
        }
        audioSecs = 0;
        updateAudioTimeUI();
        playAnthem();
    }
    function playAnthem() {
        isPlaying = true;
        document.getElementById('playIcon').className = 'fas fa-pause';
        document.getElementById('discIcon').classList.add('rotating');
        if (clubAudioPlayer) clubAudioPlayer.play().catch(() => { showToast('تعذر تشغيل الملف الصوتي. تحقق من اتصال الإنترنت.'); });
        else playAnthemTune();
        clearInterval(audioTimer);
        audioTimer = setInterval(() => {
            audioSecs = clubAudioPlayer ? Math.floor(clubAudioPlayer.currentTime || 0) : audioSecs + 1;
            updateAudioTimeUI();
            if (!clubAudioPlayer && audioSecs % 8 === 0) playTone(440, 'triangle', 0.1);
        }, 1000);
    }

    function pauseAnthem() {
        isPlaying = false;
        document.getElementById('playIcon').className = 'fas fa-play';
        document.getElementById('discIcon').classList.remove('rotating');
        clearInterval(audioTimer);
        if (clubAudioPlayer) clubAudioPlayer.pause();
    }

    function updateAudioTimeUI() {
        const mins = Math.floor(audioSecs / 60);
        const secs = audioSecs % 60;
        const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        document.getElementById('currentTimeDisplay').textContent = formatted;

        const pct = Math.min((audioSecs / 195) * 100, 100);
        document.getElementById('audioProgressFill').style.width = pct + '%';
    }

    document.getElementById('playPauseBtn')?.addEventListener('click', () => {
        if (isPlaying) pauseAnthem();
        else playAnthem();
    });

    document.getElementById('nextTrackBtn')?.addEventListener('click', () => {
        let nxt = (currentAnthemIdx + 1) % ANTHEMS_DATA.length;
        loadAnthem(nxt);
    });

    document.getElementById('prevTrackBtn')?.addEventListener('click', () => {
        let prv = (currentAnthemIdx - 1 + ANTHEMS_DATA.length) % ANTHEMS_DATA.length;
        loadAnthem(prv);
    });

    // Render All News
    function renderAllNews(query = '') {
        const container = document.getElementById('newsAllContainer');
        if (!container) return;

        const filtered = query.trim() 
            ? NEWS_ALL.filter(n => n.title.includes(query) || n.cat.includes(query))
            : NEWS_ALL;

        container.innerHTML = filtered.map(n => `
            <div class="news-card" onclick="openArticleModal(${n.id})">
                <div class="news-card-image">
                    <img src="${n.img}" alt="${n.title}" loading="lazy">
                </div>
                <div class="news-card-content">
                    <span class="slide-category" style="margin-bottom:4px; font-size:9.5px; padding:2px 8px;">${n.cat}</span>
                    <h4>${n.title}</h4>
                    <div class="news-date"><i class="far fa-clock"></i><span>${n.date}</span></div>
                </div>
            </div>
        `).join('');
    }
    renderAllNews();

    document.getElementById('newsSearchInput')?.addEventListener('input', function() {
        renderAllNews(this.value);
    });

    // Homepage News Cards Click
    document.querySelectorAll('.news-cards-container .news-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-news-id'), 10) || 1;
            openArticleModal(id);
        });
    });

    // Match banner click leads to match center modal
    document.getElementById('matchBannerCard')?.addEventListener('click', openMatchModal);

    // ============================================
    // 7. SLIDER FUNCTIONALITY
    // ============================================
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startAutoSlide() {
        stopAutoSlide();
        slideInterval = setInterval(nextSlide, 4500);
    }

    function stopAutoSlide() {
        if (slideInterval) clearInterval(slideInterval);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoSlide(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoSlide(); });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => { goToSlide(index); startAutoSlide(); });
    });

    startAutoSlide();

    // ============================================
    // 8. SIDE MENU & NOTIFICATIONS DRAWER
    // ============================================
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const sideMenuOverlay = document.getElementById('sideMenuOverlay');

    function openMenu() {
        sideMenu.classList.add('open');
        sideMenuOverlay.classList.add('active');
    }

    function closeMenu() {
        sideMenu.classList.remove('open');
        sideMenuOverlay.classList.remove('active');
    }

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (sideMenuOverlay) sideMenuOverlay.addEventListener('click', closeMenu);

    // Notifications Panel
    const notifNavBtn = document.getElementById('notifNavBtn');
    const notifPanel = document.getElementById('notifPanel');
    const notifOverlay = document.getElementById('notifOverlay');
    const notifCloseBtn = document.getElementById('notifCloseBtn');
    const markAllReadBtn = document.getElementById('markAllRead');
    const notifBadge = document.getElementById('notifBadge');

    function openNotifications() {
        notifPanel.classList.add('open');
        notifOverlay.classList.add('active');
    }

    function closeNotifications() {
        notifPanel.classList.remove('open');
        notifOverlay.classList.remove('active');
    }

    if (notifNavBtn) {
        notifNavBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openNotifications();
        });
    }

    if (notifCloseBtn) notifCloseBtn.addEventListener('click', closeNotifications);
    if (notifOverlay) notifOverlay.addEventListener('click', closeNotifications);

    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            document.querySelectorAll('.notif-item.unread').forEach(item => {
                item.classList.remove('unread');
                const dot = item.querySelector('.unread-dot');
                if (dot) dot.remove();
            });
            if (notifBadge) notifBadge.style.display = 'none';
            playTone(600, 'sine', 0.15);
            showToast('تم تحديد جميع الإشعارات كمقروءة');
        });
    }

    // ============================================
    // 9. SETTINGS (Dark Mode, Clock, Share)
    // ============================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        if (localStorage.getItem('shaab_dark_mode') === 'true') {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }

        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('shaab_dark_mode', 'true');
                showToast('تم تفعيل الوضع الليلي 🌙');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('shaab_dark_mode', 'false');
                showToast('تم تفعيل الوضع النهاري ☀️');
            }
        });
    }

    document.getElementById('shareAppBtn')?.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'تطبيق نادي شعب حضرموت',
                text: 'حمّل تطبيق نادي شعب حضرموت الرسمي وتابع كل جديد النوارس!',
                url: window.location.href
            }).catch(() => {});
        } else {
            showToast('تم نسخ رابط التطبيق للمشاركة 📋');
        }
    });

    document.getElementById('rateAppBtn')?.addEventListener('click', () => {
        fireConfetti();
        showToast('شكراً لدعمك نادي شعب حضرموت ⭐⭐⭐⭐⭐');
    });

    function updateClock() {
        const clockEl = document.getElementById('liveClock');
        if (!clockEl) return;
        const now = new Date();
        let hours = now.getHours();
        let mins = now.getMinutes();
        hours = hours % 12 || 12;
        clockEl.textContent = `${hours}:${mins < 10 ? '0' : ''}${mins}`;
    }
    updateClock();
    setInterval(updateClock, 30000);

    // ============================================
    // 10. ADMIN CONTROL PANEL LOGIC
    // ============================================

    // Admin Tab Switching
    document.querySelectorAll('[data-admin-tab]').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('[data-admin-tab]').forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const target = this.getAttribute('data-admin-tab');
            document.getElementById('adminNewsForm').style.display = target === 'newsForm' ? 'block' : 'none';
            document.getElementById('adminPlayerForm').style.display = target === 'playerForm' ? 'block' : 'none';
            document.getElementById('adminMatchForm').style.display = target === 'matchForm' ? 'block' : 'none';
            document.getElementById('adminNotifForm').style.display = target === 'notifForm' ? 'block' : 'none';
            playTone(450, 'sine', 0.06);
        });
    });

    // Quick image buttons
    document.querySelectorAll('.quick-img-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            const input = document.getElementById('newsImgInput');
            if (input) input.value = url;
            playTone(500, 'sine', 0.05);
        });
    });

    // 1. Submit Add News
    document.getElementById('formAddNews')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('newsTitleInput').value.trim();
        const cat = document.getElementById('newsCategorySelect').value;
        const img = document.getElementById('newsImgInput').value.trim() || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=500&fit=crop&q=80';
        const content = document.getElementById('newsContentInput').value.trim();

        if (!title || !content) return;

        const newArticle = {
            id: Date.now(),
            title: title,
            date: 'اليوم',
            cat: cat,
            readTime: '3 دقائق قراءة',
            author: 'المركز الإعلامي لنادي شعب حضرموت',
            img: img,
            content: content
        };

        NEWS_ALL.unshift(newArticle);

        // Update localStorage
        try {
            const storedNews = JSON.parse(localStorage.getItem('shaab_custom_news') || '[]');
            storedNews.unshift(newArticle);
            localStorage.setItem('shaab_custom_news', JSON.stringify(storedNews));
        } catch(e) {}

        // Re-render news & clear form
        renderAllNews();
        this.reset();

        playTone(600, 'triangle', 0.25);
        fireConfetti();
        showToast('تم نشر الخبر بنجاح في التطبيق! 📢');

        // Navigate to news page to view it
        setTimeout(() => navigateToPage('newsPage'), 800);
    });

    // 2. Submit Add Player
    document.getElementById('formAddPlayer')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('playerNameInput').value.trim();
        const num = parseInt(document.getElementById('playerNumInput').value, 10);
        const age = parseInt(document.getElementById('playerAgeInput').value, 10);
        const pos = document.getElementById('playerPosSelect').value;
        const img = document.getElementById('playerImgInput').value.trim() || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80';
        const bio = document.getElementById('playerBioInput').value.trim() || 'لاعب مميز في صفوف الفريق الأول لنادي شعب حضرموت.';

        const posNames = {
            'att': 'مهاجم',
            'mid': 'وسط ميدان',
            'def': 'مدافع',
            'gk': 'حارس مرمى'
        };

        const newPlayer = {
            id: Date.now(),
            name: name,
            num: num,
            pos: pos,
            posName: posNames[pos] || 'لاعب',
            age: age,
            height: '180 سم',
            weight: '75 كجم',
            matches: 1,
            cleanSheets: 0,
            goals: 0,
            cheers: 100,
            bio: bio,
            img: img
        };

        PLAYERS_DATA.push(newPlayer);

        try {
            const storedPlayers = JSON.parse(localStorage.getItem('shaab_custom_players') || '[]');
            storedPlayers.push(newPlayer);
            localStorage.setItem('shaab_custom_players', JSON.stringify(storedPlayers));
        } catch(e) {}

        renderPlayers('all');
        this.reset();

        playTone(620, 'triangle', 0.25);
        fireConfetti();
        showToast(`تمت إضافة اللاعب ${name} لقائمة الفريق بنجاح! ⚽`);

        setTimeout(() => navigateToPage('playersPage'), 800);
    });

    // 3. Submit Add Match
    document.getElementById('formAddMatch')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const opponent = document.getElementById('matchOpponentInput').value.trim();
        const round = document.getElementById('matchRoundInput').value.trim();
        const date = document.getElementById('matchDateInput').value.trim();
        const time = document.getElementById('matchTimeInput').value.trim();
        const stadium = document.getElementById('matchStadiumInput').value.trim();

        const newMatch = {
            id: Date.now(),
            round: round,
            home: 'شعب حضرموت',
            away: opponent,
            date: date,
            time: time,
            stadium: stadium,
            isHome: true
        };

        MATCHES_UPCOMING.unshift(newMatch);

        try {
            const storedMatches = JSON.parse(localStorage.getItem('shaab_custom_matches') || '[]');
            storedMatches.unshift(newMatch);
            localStorage.setItem('shaab_custom_matches', JSON.stringify(storedMatches));
        } catch(e) {}

        renderMatches('upcoming');
        this.reset();

        playTone(640, 'triangle', 0.25);
        fireConfetti();
        showToast(`تمت جدولة مباراة شعب حضرموت ضد ${opponent}! 🏟️`);

        setTimeout(() => navigateToPage('matchesPage'), 800);
    });

    // 4. Submit Send Notification
    document.getElementById('formAddNotif')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const text = document.getElementById('notifTextInput').value.trim();
        const type = document.getElementById('notifTypeSelect').value;

        if (!text) return;

        const notifList = document.getElementById('notifList');
        if (notifList) {
            const icons = {
                'goal': { icon: 'fa-bolt', class: 'goal-notif', title: 'هدف! ⚽' },
                'match': { icon: 'fa-futbol', class: 'match-notif', title: 'تنبيه مباراة 🏟️' },
                'transfer': { icon: 'fa-user-plus', class: 'transfer-notif', title: 'انتقال رسمي ✍️' },
                'news': { icon: 'fa-bullhorn', class: 'news-notif', title: 'خبر عاجل 📢' }
            };
            const meta = icons[type] || icons['news'];

            const newNotifHtml = `
                <div class="notif-item unread">
                    <div class="notif-icon ${meta.class}"><i class="fas ${meta.icon}"></i></div>
                    <div class="notif-body">
                        <p class="notif-text"><strong>${meta.title}</strong> ${text}</p>
                        <span class="notif-time"><i class="far fa-clock"></i> الآن</span>
                    </div>
                    <span class="unread-dot"></span>
                </div>
            `;
            notifList.insertAdjacentHTML('afterbegin', newNotifHtml);

            // Update badge
            const badge = document.getElementById('notifBadge');
            if (badge) {
                badge.style.display = 'flex';
                let count = parseInt(badge.textContent, 10) || 0;
                badge.textContent = count + 1;
                badge.classList.add('pulse');
                setTimeout(() => badge.classList.remove('pulse'), 600);
            }
        }

        this.reset();
        playFanCheerSound();
        showToast('تم إرسال التنبيه الفوري لجميع المشجعين! 🔔');
    });

    // Load any persisted data from localStorage on start
    try {
        const savedNews = JSON.parse(localStorage.getItem('shaab_custom_news') || '[]');
        if (savedNews.length) {
            NEWS_ALL.unshift(...savedNews);
            renderAllNews();
        }

        const savedPlayers = JSON.parse(localStorage.getItem('shaab_custom_players') || '[]');
        if (savedPlayers.length) {
            PLAYERS_DATA.push(...savedPlayers);
            renderPlayers('all');
        }

        const savedMatches = JSON.parse(localStorage.getItem('shaab_custom_matches') || '[]');
        if (savedMatches.length) {
            MATCHES_UPCOMING.unshift(...savedMatches);
            renderMatches('upcoming');
        }
    } catch(e) {}

    // ============================================
    // 11. TOAST NOTIFICATION UTILITY
    // ============================================
    window.showToast = function(text) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-info-circle"></i> <span>${text}</span>`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2200);
    };


    // =========================================================
    // Live Club CMS integration: load every managed section once
    // and preserve the existing app layout and local fallbacks.
    // =========================================================
    const CLUB_API_BASE = 'https://shaab-hadramout.pages.dev';
    const clubEscape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    async function clubGet(path) {
        const response = await fetch(CLUB_API_BASE + path + (path.includes('?') ? '&' : '?') + 'refresh=' + Date.now(), { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok || data.success === false) throw new Error(data.message || 'تعذر تحميل بيانات النادي');
        return data;
    }
    function clubDate(value) {
        if (!value) return '';
        const raw = String(value);
        const date = new Date(raw.length === 10 ? raw + 'T12:00:00' : raw);
        return Number.isNaN(date.getTime()) ? raw : date.toLocaleDateString('ar', { year:'numeric', month:'long', day:'numeric' });
    }
    function refreshHomeNews() {
        const wrap = document.querySelector('.news-cards-container');
        if (!wrap) return;
        wrap.innerHTML = NEWS_ALL.slice(0, 4).map(n =>
            '<div class="news-card" data-news-id="' + n.id + '" onclick="openArticleModal(' + n.id + ')">' +
            '<div class="news-card-image"><img src="' + clubEscape(n.img) + '" alt="' + clubEscape(n.title) + '" loading="lazy"></div>' +
            '<div class="news-card-content"><h4>' + clubEscape(n.title) + '</h4><div class="news-date"><span>' + clubEscape(n.date) + '</span> <i class="far fa-clock"></i></div></div></div>'
        ).join('');
    }
    function applyClubNews(rows) {
        if (!Array.isArray(rows) || !rows.length) return;
        NEWS_ALL = rows.map(item => ({
            id: Number(item.id), title: item.title || '', date: clubDate(item.created_at),
            cat: 'أخبار النادي', readTime: 'خبر من المركز الإعلامي',
            author: 'المركز الإعلامي لنادي شعب حضرموت',
            img: item.image_url || (item.images && item.images[0] && item.images[0].url) || '',
            content: item.content || '', images: item.images || []
        }));
        renderAllNews();
        refreshHomeNews();
    }
    function applyClubPlayers(rows) {
        if (!Array.isArray(rows) || !rows.length) return;
        const posMap = {'حراس المرمى':'gk','الدفاع':'def','الوسط':'mid','الهجوم':'att','المدرب':'staff'};
        const posNames = {'حراس المرمى':'حارس مرمى','الدفاع':'مدافع','الوسط':'لاعب وسط','الهجوم':'مهاجم','المدرب':'الجهاز الفني'};
        const players = [], staff = [];
        rows.forEach(item => {
            const p = posMap[item.position] || 'mid';
            if (p === 'staff') staff.push({name:item.name, role:'الجهاز الفني', img:item.image_url || ''});
            else players.push({
                id:Number(item.id), name:item.name || '', num:item.number || '—', pos:p,
                posName:posNames[item.position] || item.position || 'لاعب',
                nationality:item.nationality || 'يمني',
                age:Number(item.age) || '—', height:item.height || '—', weight:'—',
                matches:Number(item.matches) || 0, cleanSheets:Number(item.clean_sheets) || 0,
                saves:Number(item.saves) || 0, goals:Number(item.goals) || 0,
                assists:Number(item.assists) || 0, tackles:Number(item.tackles) || 0,
                readiness:Number.isFinite(Number(item.readiness)) ? Number(item.readiness) : 90,
                cheers:0, bio:item.bio || 'لاعب في صفوف نادي شعب حضرموت.',
                img:item.image_url || ''
            });
        });
        PLAYERS_DATA = players;
        STAFF_DATA = staff;
        renderPlayers('all');
        const activeTab = document.querySelector('[data-player-cat].active');
        if (activeTab && activeTab.getAttribute('data-player-cat') === 'staff') renderPlayers('staff');
    }
    function applyClubMatches(rows) {
        if (!Array.isArray(rows)) return;
        const upcoming = [], results = [];
        rows.forEach(item => {
            const homeClub = Number(item.is_home) !== 0;
            const home = homeClub ? 'شعب حضرموت' : (item.opponent || 'المنافس');
            const away = homeClub ? (item.opponent || 'المنافس') : 'شعب حضرموت';
            const clubScore = item.home_score == null ? null : Number(item.home_score);
            const opponentScore = item.away_score == null ? null : Number(item.away_score);
            const score = clubScore == null || opponentScore == null ? '—' :
                (homeClub ? clubScore + ' - ' + opponentScore : opponentScore + ' - ' + clubScore);
            const common = {
                id:Number(item.id), round:item.competition || 'مباريات النادي',
                home, away, date:clubDate(item.match_date), time:item.match_time || '',
                stadium:item.venue || '', isHome:homeClub,
                notes:item.notes || '', opponent:item.opponent || 'المنافس', opponentLogo:item.opponent_logo_url || '',
                homeLogo:item.home_logo_url || '', status:item.status || 'upcoming'
            };
            if (item.status === 'finished') results.push({...common, score, scorers:item.notes || ''});
            else if (item.status !== 'cancelled') upcoming.push(common);
        });
        MATCHES_UPCOMING = upcoming;
        MATCHES_RESULTS = results;
        const banner = document.getElementById('matchBannerCard');
        if (banner) {
            const match = upcoming[0] || results[0];
            if (match) {
                const finished = !upcoming.length;
                const safeText = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
                const safeUrl = value => {
                    const url = String(value || '').trim();
                    return /^(https?:\/\/|\/api\/media\/)/i.test(url) ? url : '';
                };
                const teamBlock = (name, logo, side) => {
                    const src = safeUrl(logo);
                    return `<div class="team team-${side}">
                        <div class="team-logo-container"><div class="team-logo-img">${src ? `<img src="${safeText(src)}" alt="${safeText(name)}" class="official-logo-img">` : '<i class="fas fa-shield-halved"></i>'}</div></div>
                        <span class="team-name">${safeText(name)}</span>
                    </div>`;
                };
                const clubName = 'شعب حضرموت';
                const opponentName = match.opponent || 'المنافس';
                const clubLogo = match.isHome ? match.homeLogo : match.opponentLogo;
                const opponentLogo = match.isHome ? match.opponentLogo : match.homeLogo;
                banner.querySelector('.match-header span').textContent = finished ? 'انتهى اللقاء' : 'المباراة القادمة';
                banner.querySelector('.match-header i').className = finished ? 'fas fa-flag-checkered' : 'fas fa-calendar-alt';
                banner.querySelector('.match-content').innerHTML = `
                    <div class="league-name">${safeText(match.round)}</div>
                    <div class="match-teams">
                        ${teamBlock(clubName, clubLogo, 'club')}
                        <div class="match-info-center">
                            <span class="${finished ? 'score-badge' : 'vs-text'}">${finished ? safeText(match.score || '—') : 'VS'}</span>
                            <div class="match-date"><i class="far fa-calendar-alt"></i><span>${safeText(match.date)}</span></div>
                            ${!finished && match.time ? `<div class="match-time"><i class="far fa-clock"></i><span>${safeText(match.time)}</span></div>` : ''}
                        </div>
                        ${teamBlock(opponentName, opponentLogo, 'opponent')}
                    </div>`;
            }
        }
        renderMatches('upcoming');
        const tab = document.querySelector('[data-match-tab].active');
        renderMatches(tab ? tab.getAttribute('data-match-tab') : 'upcoming');
    }
    function applyClubStandings(rows) {
        if (!Array.isArray(rows)) rows = [];
        STANDINGS_DATA = rows.map((item,index) => ({
            rank:index+1, team:item.team_name || '', logo:(item.logo_url||''), played:Number(item.played||0),
            won:Number(item.wins||0), draw:Number(item.draws||0), lost:Number(item.losses||0),
            diff:(Number(item.goals_for||0)-Number(item.goals_against||0)) > 0 ? '+'+(Number(item.goals_for||0)-Number(item.goals_against||0)) : String(Number(item.goals_for||0)-Number(item.goals_against||0)),
            points:Number(item.points||0), isShaab:(item.team_name||'').includes('شعب حضرموت')
        }));
        renderStandings();
        const empty=document.getElementById('tournamentEmpty');
        if(empty) empty.hidden=rows.length>0;
    }
    let selectedPublicTournament='';
    async function loadPublicTournamentStandings(tournamentId) {
        const body=document.getElementById('standingsBody');
        if(body) body.innerHTML='<tr><td colspan="8">جارٍ تحميل جدول البطولة...</td></tr>';
        try { const data=await clubGet('/api/standings?tournament_id='+encodeURIComponent(tournamentId)); applyClubStandings(data.standings||[]); }
        catch(error) { console.warn('Tournament standings unavailable',error); applyClubStandings([]); }
    }
    async function loadPublicTournaments() {
        const select=document.getElementById('publicTournamentSelect');
        if(!select)return;
        try {
            const data=await clubGet('/api/tournaments'); const rows=data.tournaments||[];
            select.innerHTML=rows.map(t=>'<option value="'+clubEscape(t.id)+'">'+clubEscape(t.name)+'</option>').join('')||'<option value="">لا توجد بطولات</option>';
            const empty=document.getElementById('tournamentEmpty'); if(empty)empty.hidden=rows.length>0;
            if(!rows.length){applyClubStandings([]);return;}
            if(!rows.some(t=>String(t.id)===String(selectedPublicTournament)))selectedPublicTournament=String(rows[0].id);
            select.value=selectedPublicTournament; await loadPublicTournamentStandings(selectedPublicTournament);
        } catch(error) { console.warn('Tournaments unavailable',error); select.innerHTML='<option value="">تعذر تحميل البطولات</option>'; }
    }
    function applyClubTransfers(rows) {
        if (!Array.isArray(rows) || !rows.length) return;
        const mapped = {in:[],out:[],renew:[]};
        rows.forEach(item => {
            const direction = item.direction === 'outgoing' ? 'out' : 'in';
            mapped[direction].push({
                name:item.player_name || '', from:item.from_club || '',
                to:item.to_club || 'شعب حضرموت', role:item.details || '',
                date:clubDate(item.transfer_date), type:item.transfer_type === 'loan' ? 'إعارة' : 'انتقال نهائي',
                val:item.details || '', img:item.image_url || ''
            });
        });
        TRANSFERS_DATA = mapped;
        const tab = document.querySelector('[data-trans-tab].active');
        renderTransfers(tab ? tab.getAttribute('data-trans-tab') : 'in');
    }
    function applyClubGallery(rows) {
        if (!Array.isArray(rows) || !rows.length) return;
        const photos = [], videos = [];
        rows.forEach(item => {
            const record = {
                title:item.title || '', img:item.media_type === 'image' ? item.media_url : '',
                media_url:item.media_url || '', description:item.description || ''
            };
            (item.media_type === 'video' ? videos : photos).push(record);
        });
        MEDIA_DATA = {photos, videos};
        const tab = document.querySelector('[data-media-tab].active');
        renderMedia(tab ? tab.getAttribute('data-media-tab') : 'photos');
    }
    function applyClubAnthems(rows) {
        if (!Array.isArray(rows) || !rows.length) return;
        ANTHEMS_DATA = rows.map(item => ({
            id:Number(item.id), title:item.title || '', artist:item.description || 'أناشيد نادي شعب حضرموت',
            description:item.description || '', audio_url:item.audio_url || '', duration:'—:—', progress:0
        }));
        currentAnthemIdx = 0;
        renderAnthems();
        const first = ANTHEMS_DATA[0];
        if (first) {
            document.getElementById('currentAnthemTitle').textContent = first.title;
            document.getElementById('currentAnthemArtist').textContent = first.artist;
            document.getElementById('totalTimeDisplay').textContent = first.duration;
        }
    }
    function applyClubCarousel(rows) {
        if (!Array.isArray(rows) || !rows.length) return;
        const currentSlides = document.querySelectorAll('#sliderWrapper .slide');
        rows.slice(0, currentSlides.length).forEach((item,index) => {
            const slide = currentSlides[index];
            const img = slide.querySelector('.slide-image');
            const category = slide.querySelector('.slide-category');
            const heading = slide.querySelector('h3');
            if (img && item.image_url) img.src = item.image_url;
            if (category) category.textContent = 'أخبار النادي';
            if (heading) heading.textContent = item.title || '';
            slide.dataset.cmsSlide = String(item.id);
            slide.setAttribute('aria-label', item.title || 'خبر النادي');
        });
    }
    async function loadClubHistory() {
        try {
            const data = await clubGet('/api/history');
            if (!data.history) return;
            const page = document.getElementById('aboutPage');
            if (!page) return;
            const banner = page.querySelector('.foundation-badge');
            if (banner) banner.innerHTML = '<i class="fas fa-history"></i> تأسس عام ' + clubEscape(data.history.founded_year || '1964') + ' م (المكلا)';
            let target = document.getElementById('clubHistoryLiveContent');
            if (!target) {
                target = document.createElement('div');
                target.id = 'clubHistoryLiveContent';
                target.className = 'about-card';
                page.querySelector('.page-scroll-content')?.appendChild(target);
            }
            target.innerHTML = '<h4><i class="fas fa-book-open text-red"></i> ' + clubEscape(data.history.title || 'تاريخ النادي') + '</h4>' +
                (data.history.content ? '<p class="about-text">' + clubEscape(data.history.content).replace(/\n/g,'<br>') + '</p>' : '') +
                (data.history.achievements ? '<h4><i class="fas fa-trophy text-red"></i> الإنجازات</h4><p class="about-text">' + clubEscape(data.history.achievements).replace(/\n/g,'<br>') + '</p>' : '');
        } catch (error) { console.warn('Club history unavailable', error); }
    }
    async function loadClubStore() {
        const sheet = document.getElementById('storeModalSheet');
        if (!sheet) return;
        let target = document.getElementById('clubStoreLiveContent');
        if (!target) {
            target = document.createElement('div');
            target.id = 'clubStoreLiveContent';
            target.className = 'about-card';
            sheet.appendChild(target);
        }
        target.innerHTML = '<p class="about-text">جارٍ تحميل منتجات المتجر...</p>';
        try {
            const data = await clubGet('/api/sections?section=store');
            const rows = data.items || [];
            target.innerHTML = '<h4><i class="fas fa-store text-red"></i> منتجات المتجر الرسمي</h4>' +
                (rows.length ? rows.map(item => '<article class="managed-content-card">' +
                    (item.image_url ? '<img src="' + clubEscape(item.image_url) + '" alt="' + clubEscape(item.title) + '">' : '') +
                    (item.media_url ? (/\.(mp4|webm|mov)(\?|$)/i.test(item.media_url) ? '<video controls playsinline src="' + clubEscape(item.media_url) + '"></video>' : '') : '') +
                    '<div class="managed-content-body"><h3>' + clubEscape(item.title) + '</h3>' +
                    (item.content ? '<p>' + clubEscape(item.content) + '</p>' : '') +
                    (item.price ? '<span class="managed-content-price">' + clubEscape(item.price) + '</span>' : '') + '</div></article>').join('') :
                    '<p class="about-text">لا توجد منتجات منشورة حالياً.</p>');
        } catch (error) {
            target.innerHTML = '<p class="about-text">تعذر تحميل منتجات المتجر حالياً.</p>';
        }
    }
    async function loadClubNotifications() {
        try {
            const data = await clubGet('/api/notifications');
            const rows = data.notifications || [];
            const list = document.getElementById('notifList');
            const badge = document.getElementById('notifBadge');
            if (!list || !rows.length) return;
            list.innerHTML = rows.map(item => '<div class="notif-item unread"><div class="notif-icon news-notif"><i class="fas fa-bullhorn"></i></div>' +
                '<div class="notif-body"><p class="notif-text"><strong>' + clubEscape(item.title || 'تنبيه النادي') + '</strong> ' + clubEscape(item.body || '') + '</p>' +
                '<span class="notif-time"><i class="far fa-clock"></i> ' + clubEscape(clubDate(item.created_at)) + '</span></div><span class="unread-dot"></span></div>').join('');
            if (badge) { badge.textContent = String(rows.length); badge.style.display = rows.length ? 'flex' : 'none'; }
        } catch (error) { console.warn('Club notifications unavailable', error); }
    }
    document.addEventListener('change', event => { if(event.target?.id==='publicTournamentSelect'){selectedPublicTournament=event.target.value;loadPublicTournamentStandings(selectedPublicTournament);} });
    async function loadAllClubContent() {
        const jobs = [
            ['/api/news', d => applyClubNews(d.news)],
            ['/api/players', d => applyClubPlayers(d.players)],
            ['/api/matches', d => applyClubMatches(d.matches)],
            ['/api/transfers', d => applyClubTransfers(d.transfers)],
            ['/api/gallery', d => applyClubGallery(d.media)],
            ['/api/anthems', d => applyClubAnthems(d.anthems)],
            ['/api/carousel', d => applyClubCarousel(d.slides)],
            ['/api/history', () => loadClubHistory()],
            ['/api/notifications', () => loadClubNotifications()]
        ];
        await Promise.allSettled(jobs.map(async job => {
            try { const data = await clubGet(job[0]); job[1](data); }
            catch (error) { console.warn('CMS section load failed: ' + job[0], error); }
            await loadPublicTournaments();
    }));
    }
    // Native-style pull down refresh: reload current CMS data without leaving the screen.
    function setupPullToRefresh() {
        let startY = 0, currentDistance = 0, activePage = null, pulling = false, refreshing = false;
        const threshold = 88;
        const indicator = document.createElement('div');
        indicator.id = 'pullRefreshIndicator';
        indicator.innerHTML = '<i class="fas fa-arrow-down"></i><span>اسحب للأسفل للتحديث</span>';
        document.body.appendChild(indicator);

        const setState = (state, label, icon) => {
            indicator.className = state;
            indicator.innerHTML = '<i class="fas ' + icon + '"></i><span>' + label + '</span>';
        };
        const hideIndicator = () => {
            indicator.style.transform = 'translate(-50%, -130%)';
            setState('', 'اسحب للأسفل للتحديث', 'fa-arrow-down');
        };
        const getActivePage = () => document.querySelector('.app-page.active');

        document.addEventListener('touchstart', event => {
            if (refreshing || event.touches.length !== 1) return;
            const page = getActivePage();
            if (!page || page.scrollTop > 2) return;
            if (event.target.closest('input, textarea, select, button, a, .modal, .overlay, .drawer')) return;
            activePage = page;
            startY = event.touches[0].clientY;
            currentDistance = 0;
            pulling = true;
            hideIndicator();
        }, {passive:true});

        document.addEventListener('touchmove', event => {
            if (!pulling || refreshing || !event.touches.length) return;
            if (getActivePage() !== activePage) { pulling = false; hideIndicator(); return; }
            currentDistance = Math.max(0, event.touches[0].clientY - startY);
            if (currentDistance <= 0) { hideIndicator(); return; }
            const progress = Math.min(currentDistance, threshold);
            const offset = Math.max(-8, -58 + progress * 0.62);
            indicator.style.transform = 'translate(-50%, ' + offset + 'px)';
            if (currentDistance >= threshold) setState('ready', 'اترك لتحديث التطبيق', 'fa-arrow-down');
            else setState('pulling', 'اسحب للأسفل للتحديث', 'fa-arrow-down');
        }, {passive:true});

        const finishPull = async () => {
            if (!pulling || refreshing) return;
            const shouldRefresh = currentDistance >= threshold && activePage === getActivePage();
            pulling = false;
            if (!shouldRefresh) { hideIndicator(); activePage = null; return; }

            refreshing = true;
            indicator.style.transform = 'translate(-50%, 10px)';
            setState('refreshing', 'جارٍ تحديث بيانات النادي...', 'fa-spinner fa-spin');
            try {
                await Promise.allSettled([loadAllClubContent(), loadClubReels()]);
                setState('done', 'تم تحديث البيانات', 'fa-check');
            } finally {
                refreshing = false;
                activePage = null;
                setTimeout(hideIndicator, 900);
            }
        };

        document.addEventListener('touchend', finishPull, {passive:true});
        document.addEventListener('touchcancel', () => {
            pulling = false;
            currentDistance = 0;
            activePage = null;
            if (!refreshing) hideIndicator();
        }, {passive:true});
    }
    setupPullToRefresh();
    loadAllClubContent();

});
