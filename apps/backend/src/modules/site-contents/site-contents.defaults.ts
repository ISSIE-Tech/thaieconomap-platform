import { SiteContentKey, SiteContentStrings } from './schemas/site-content.schema';

// Built-in copy for each CMS-managed page. GET merges what admins saved over these,
// so a key added here shows up on the site and in the admin editor without a migration.
// about: from the ThaiEconoMap site content.json. terms/privacy: body is the markdown subset
// rendered by the frontend legal page (## heading, - item, [text](url), [[cookie-settings]]).
export const SITE_CONTENT_DEFAULTS: Record<SiteContentKey, SiteContentStrings> = {
  'about': {
    'site.01': {
      'th': 'แผนที่เศรษฐกิจชุมชน',
      'en': 'Community Economy Map'
    },
    'site.02': {
      'th': 'ที่มา',
      'en': 'Background'
    },
    'site.03': {
      'th': 'ปัญหา',
      'en': 'Problem'
    },
    'site.04': {
      'th': 'แนวคิด',
      'en': 'Ideas'
    },
    'site.05': {
      'th': 'ฟังก์ชัน',
      'en': 'Features'
    },
    'site.06': {
      'th': 'ผลลัพธ์',
      'en': 'Outcomes'
    },
    'site.07': {
      'th': 'เรื่องเล่า',
      'en': 'Story'
    },
    'site.08': {
      'th': 'ติดต่อเรา',
      'en': 'Contact'
    },
    'site.09': {
      'th': 'ThaiEconoMap — แผนที่เศรษฐกิจชุมชน',
      'en': 'ThaiEconoMap — the Community Economy Map'
    },
    'site.10': {
      'th': 'โครงสร้างพื้นฐานดิจิทัลเพื่อเศรษฐกิจฐานรากและสุขภาวะชุมชน ดำเนินการโดยสถาบันเอเชียศึกษา จุฬาลงกรณ์มหาวิทยาลัย',
      'en': 'Digital infrastructure for the grassroots economy and community wellbeing. A project of the Institute of Asian Studies, Chulalongkorn University.'
    },
    'site.11': {
      'th': 'เนื้อหาในเว็บไซต์',
      'en': 'On this page'
    },
    'site.12': {
      'th': 'บริบทและที่มาของโครงการ',
      'en': 'Where this started'
    },
    'site.13': {
      'th': 'ปัญหาเชิงโครงสร้าง',
      'en': 'The structural issue'
    },
    'site.14': {
      'th': 'แนวคิดและหลักการ',
      'en': 'The thinking behind it'
    },
    'site.15': {
      'th': 'ฟังก์ชันหลัก',
      'en': 'What it does'
    },
    'site.16': {
      'th': 'ผลลัพธ์และความคาดหวัง',
      'en': 'What we expect to change'
    },
    'site.17': {
      'th': 'เรื่องเล่าจากพื้นที่',
      'en': 'From the field'
    },
    'site.18': {
      'th': 'ติดต่อเรา',
      'en': 'Contact us'
    },
    'site.19': {
      'th': 'ดำเนินการและสนับสนุนโดย',
      'en': 'Led and supported by'
    },
    'site.20': {
      'th': 'สถาบันเอเชียศึกษา จุฬาลงกรณ์มหาวิทยาลัย | สนับสนุนโดย สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ (สสส.)',
      'en': 'Institute of Asian Studies, Chulalongkorn University | Supported by the Thai Health Promotion Foundation (ThaiHealth)'
    },
    'site.ph01': {
      'th': 'เรื่องที่ต้องการติดต่อ',
      'en': 'What is this about?'
    },
    'site.ph02': {
      'th': 'เขียนข้อความของคุณที่นี่',
      'en': 'Write your message here'
    },
    'site.ph03': {
      'th': 'you@example.com',
      'en': 'you@example.com'
    },
    'hero.01': {
      'th': 'แผนที่เศรษฐกิจชุมชน',
      'en': 'The Community Economy Map'
    },
    'hero.02': {
      'th': 'โครงสร้างพื้นฐานดิจิทัลเพื่อเศรษฐกิจฐานราก และสุขภาวะชุมชน',
      'en': 'Digital infrastructure for the grassroots economy and community wellbeing'
    },
    'hero.03': {
      'th': 'แพลตฟอร์มแผนที่ที่ทำให้กิจกรรมทางเศรษฐกิจเล็ก ๆ ในชุมชนมองเห็นได้ เชื่อมร้านค้า แรงงาน และผู้บริโภคเข้าหากัน บนหลักการที่ว่าข้อมูลของชุมชนควรเป็นของชุมชน',
      'en': 'A map that makes the small economy visible — the corner shop, the rider, the person looking for work nearby — and puts the data behind it back in the hands of the people who generated it.'
    },
    'hero.04': {
      'th': 'แนวคิดของโครงการ',
      'en': 'The thinking behind it'
    },
    'hero.05': {
      'th': 'อ่านเรื่องเล่าจากพื้นที่',
      'en': 'Read the story'
    },
    'context.01': {
      'th': 'บริบทและที่มาของโครงการ',
      'en': 'Where this started'
    },
    'context.02': {
      'th': 'เศรษฐกิจและสุขภาวะ: <em>ความเชื่อมโยงที่ไม่อาจแยกจากกัน</em>',
      'en': 'Economic life and health are <em>the same question</em>'
    },
    'context.03': {
      'th': 'องค์การอนามัยโลก (WHO) ชี้ว่าสุขภาพของคนไม่ได้ถูกกำหนดโดยพันธุกรรมหรือการแพทย์เท่านั้น แต่ถูกกำหนดโดยเงื่อนไขแวดล้อมทางสังคมและเศรษฐกิจที่บุคคลดำรงชีวิต ซึ่งเรียกว่า <strong>“ปัจจัยทางสังคมที่กำหนดสุขภาพ” (Social Determinants of Health: SDH)</strong> ได้แก่ รายได้ การมีงานทำ ที่อยู่อาศัย การศึกษา และการเข้าถึงบริการพื้นฐาน',
      'en': 'The World Health Organization is clear that health is not settled by genes and medicine alone. It is shaped by the conditions people live in — what they earn, whether they have steady work, where they live, how far they got in school, which services they can actually reach. The shorthand for this is the <strong>social determinants of health</strong>.'
    },
    'context.04': {
      'th': 'ความเหลื่อมล้ำทางเศรษฐกิจจึงเป็นต้นตอของความเหลื่อมล้ำด้านสุขภาวะโดยตรง เมื่อแพลตฟอร์มเอกชนผูกขาดโอกาสทางเศรษฐกิจ รายได้ที่ลดลง ความมั่นคงที่หดหาย และความเครียดที่เพิ่มขึ้น ล้วนส่งผลเป็นลูกโซ่ต่อสุขภาพและคุณภาพชีวิตของคนในชุมชน',
      'en': 'Which means economic inequality does not merely sit alongside health inequality — it produces it. When a handful of private platforms capture the opportunities in a neighbourhood, the falling income, the thinning security and the accumulating stress all land, eventually, on people\'s bodies.'
    },
    'context.05': {
      'th': 'กระแส Platformization และผลกระทบต่อเศรษฐกิจชุมชน',
      'en': 'Platformization, and what it costs a neighbourhood'
    },
    'context.06': {
      'th': 'ในปัจจุบัน โลกกำลังเผชิญกับกระแส “Platformization” กล่าวคือ กิจกรรมทางเศรษฐกิจในชีวิตประจำวัน ทั้งการสั่งอาหาร การเรียกรถ การหางาน และการซื้อขายสินค้า กำลังเปลี่ยนผ่านสู่รูปแบบที่ดำเนินการผ่านแพลตฟอร์มดิจิทัล',
      'en': 'Ordering dinner. Catching a ride. Finding a job. Buying and selling. One by one, the ordinary transactions of a day have moved onto digital platforms.'
    },
    'context.07': {
      'th': 'อย่างไรก็ดี ผลกระทบที่เกิดขึ้นมิได้กระจายอย่างเป็นธรรม แพลตฟอร์มขนาดใหญ่ที่มีลักษณะผูกขาดโดยธรรมชาติ (Natural Monopoly) สร้างความได้เปรียบทางการแข่งขันเหนือทุกฝ่าย ทั้งผู้ประกอบการรายย่อย แรงงาน และผู้บริโภคในชุมชน',
      'en': 'The gains from that shift are real. They are also unevenly shared. Platforms of this kind tend toward natural monopoly, and the leverage that gives them sits opposite everyone else in the transaction — the shop owner, the rider, the customer.'
    },
    'context.08': {
      'th': 'ตัวอย่างผลกระทบที่เกิดขึ้นในชุมชนไทย',
      'en': 'What that looks like on the ground'
    },
    'context.09': {
      'th': 'แพลตฟอร์มส่งอาหารรายใหญ่เก็บค่าธรรมเนียมสูงจากร้านค้า ทำให้ราคาอาหารแพงขึ้น',
      'en': 'Delivery platforms take a large cut from restaurants, and the price of a meal goes up to cover it.'
    },
    'context.10': {
      'th': 'แรงงานไรเดอร์และผู้ให้บริการขนส่งถูกปรับลดค่าตอบแทน พร้อมเงื่อนไขการทำงานที่เข้มงวดขึ้น',
      'en': 'Riders and couriers see their rates cut while the rules they work under get tighter.'
    },
    'context.11': {
      'th': 'ร้านค้าและผู้ประกอบการรายย่อยในชุมชนไม่สามารถแข่งขันหรือถูกมองเห็นบนโลกดิจิทัลได้',
      'en': 'Small shops can\'t compete on these terms — and often never appear on the platforms at all.'
    },
    'context.12': {
      'th': 'ข้อมูลของชุมชนและผู้ใช้บริการถูกนำไปใช้ประโยชน์เชิงธุรกิจโดยบริษัทเอกชนที่อยู่นอกชุมชน',
      'en': 'The data a neighbourhood generates gets monetised by a company headquartered somewhere else entirely.'
    },
    'problem.01': {
      'th': 'ปัญหาเชิงโครงสร้าง',
      'en': 'The structural issue'
    },
    'problem.02': {
      'th': 'แพลตฟอร์มในฐานะ<em>โครงสร้างพื้นฐาน</em>',
      'en': 'Platforms have become <em>infrastructure</em>'
    },
    'problem.03': {
      'th': 'แพลตฟอร์มดิจิทัลกำลังก้าวขึ้นมามีบทบาทเสมือน “โครงสร้างพื้นฐาน” ในชีวิตประจำวัน ไม่ต่างจากไฟฟ้า ประปา หรือถนน แต่โครงสร้างพื้นฐานดิจิทัลเหล่านี้กลับอยู่ในมือของบริษัทเอกชนที่มุ่งแสวงหากำไร โดยไม่มีกลไกการมีส่วนร่วมของชุมชนในการกำกับดูแล',
      'en': 'We now depend on digital platforms the way we depend on the power grid, the water supply and the road outside. The difference is who holds them: this infrastructure is privately owned, run for profit, and governed without any voice from the people who rely on it.'
    },
    'problem.04': {
      'th': 'ปัญหาของแพลตฟอร์มเอกชน',
      'en': 'What\'s wrong with private platforms'
    },
    'problem.05': {
      'th': 'ผลประโยชน์ไหลออกนอกชุมชน',
      'en': 'The value leaves the neighbourhood'
    },
    'problem.06': {
      'th': 'ข้อมูลชุมชนถูกใช้โดยไม่ได้รับส่วนแบ่ง',
      'en': 'Local data earns money, and none of it comes back'
    },
    'problem.07': {
      'th': 'ชุมชนไม่มีอำนาจในการกำกับดูแล',
      'en': 'Communities have no say in how any of it is run'
    },
    'problem.08': {
      'th': 'การแข่งขันไม่เป็นธรรมกับรายย่อย',
      'en': 'The playing field tilts against small operators'
    },
    'problem.09': {
      'th': 'ขาดความโปร่งใสในการดำเนินงาน',
      'en': 'How decisions get made stays invisible'
    },
    'problem.10': {
      'th': 'สิ่งที่ชุมชนต้องการ',
      'en': 'What communities are asking for'
    },
    'problem.11': {
      'th': 'แพลตฟอร์มที่เป็นของและบริหารโดยชุมชน',
      'en': 'A platform they own and run themselves'
    },
    'problem.12': {
      'th': 'ข้อมูลที่โปร่งใสและเป็นประโยชน์ต่อชุมชน',
      'en': 'Data that\'s open, and useful where they live'
    },
    'problem.13': {
      'th': 'กลไกการมีส่วนร่วมของผู้มีส่วนได้ส่วนเสีย',
      'en': 'A real seat at the table for everyone involved'
    },
    'problem.14': {
      'th': 'โอกาสทางเศรษฐกิจที่เป็นธรรมสำหรับทุกคน',
      'en': 'A fair shot at the opportunity around them'
    },
    'problem.15': {
      'th': 'เครื่องมือที่เสริมสร้างสุขภาวะชุมชน',
      'en': 'Tools that leave the community healthier'
    },
    'problem.16': {
      'th': 'ความจำเป็นในการพัฒนา',
      'en': 'Why ThaiEconoMap'
    },
    'problem.17': {
      'th': 'ช่องว่างที่<em>ยังไม่มีใครเติมเต็ม</em>',
      'en': 'The gap <em>nobody has filled</em>'
    },
    'problem.18': {
      'th': 'แม้ประเทศไทยจะมีระบบนิเวศเศรษฐกิจชุมชนที่แข็งแกร่ง ไม่ว่าจะเป็น สหกรณ์ วิสาหกิจชุมชน กลุ่มออมทรัพย์ และวิสาหกิจเพื่อสังคม แต่กลุ่มเหล่านี้ยังขาดเครื่องมือดิจิทัลที่เชื่อมโยงพวกเขาเข้าด้วยกัน และทำให้กิจกรรมทางเศรษฐกิจชุมชนมีความโปร่งใสและมองเห็นได้',
      'en': 'Thailand\'s community economy is not weak. Cooperatives, community enterprises, savings groups, social enterprises — the institutions are there, and they work. What\'s missing is anything digital that connects them to each other, or makes what they do visible to anyone outside.'
    },
    'problem.19': {
      'th': 'ร้านค้าและผู้ประกอบการในชุมชนไม่ปรากฏบนแผนที่ดิจิทัล ทำให้สูญเสียโอกาสทางธุรกิจ',
      'en': 'Local shops and producers don\'t appear on any digital map, so the business goes elsewhere.'
    },
    'problem.20': {
      'th': 'ผู้หางานและนายจ้างในชุมชนขาดช่องทางการเชื่อมต่อกันที่มีประสิทธิภาพ',
      'en': 'People looking for work and employers a few streets away have no reliable way to find each other.'
    },
    'problem.21': {
      'th': 'ข้อมูลทางเศรษฐกิจของชุมชนกระจัดกระจาย ไม่สามารถนำมาวิเคราะห์หรือวางแผนได้',
      'en': 'What\'s known about a local economy sits scattered in a dozen places, so nobody can plan with it.'
    },
    'problem.22': {
      'th': 'ชุมชนขาดเครื่องมือแบ่งปันทรัพยากรและสร้างความช่วยเหลือซึ่งกันและกัน',
      'en': 'There\'s no tool for lending, passing on or pooling what a community already owns.'
    },
    'problem.23': {
      'th': 'การสื่อสารและประกาศข้อมูลภายในชุมชนยังขาดช่องทางที่เป็นระบบ',
      'en': 'News, alerts and announcements travel by word of mouth, or they don\'t travel at all.'
    },
    'concept.01': {
      'th': 'แนวคิดและหลักการ',
      'en': 'The thinking behind it'
    },
    'concept.02': {
      'th': 'สองแนวคิดที่<em>ยึดโยงทั้งโครงการ</em>',
      'en': 'Two ideas <em>hold the whole thing up</em>'
    },
    'concept.03': {
      'th': 'เศรษฐกิจสังคมสมานฉันท์',
      'en': 'The solidarity economy'
    },
    'concept.04': {
      'th': 'แนวทางเศรษฐกิจที่ให้ความสำคัญกับเป้าหมายทางสังคมและสิ่งแวดล้อมมากกว่าการแสวงหากำไร ยึดหลักการมีส่วนร่วม การตัดสินใจร่วม และการกระจายผลประโยชน์อย่างเป็นธรรม ได้รับการรับรองจากสหประชาชาติผ่าน SDGs',
      'en': 'An approach that treats social and environmental goals as the point of the exercise, and profit as a means to it. It runs on participation, decisions made together, and benefits that get distributed rather than extracted. The UN recognises it through the Sustainable Development Goals.'
    },
    'concept.05': {
      'th': 'SDGs เป้าหมายที่ 8, 10 และ 12',
      'en': 'SDG targets 8, 10 and 12'
    },
    'concept.06': {
      'th': 'แพลตฟอร์มดิจิทัลที่ทุกคนเป็นเจ้าของ',
      'en': 'A platform everyone owns'
    },
    'concept.07': {
      'th': 'ทรัพยากรดิจิทัลที่ถูกสร้าง บริหารจัดการ และแบ่งปันโดยชุมชนร่วมกัน บนหลักการที่ว่าทรัพยากรนั้นเป็น “สมบัติส่วนรวม” ไม่ใช่ทรัพย์สินของคนใดคนหนึ่ง ขยายมาจาก Commons แบบดั้งเดิม เช่น ป่าชุมชน แหล่งน้ำสาธารณะ หรือทุ่งเลี้ยงสัตว์ร่วม',
      'en': 'Digital resources built, governed and shared by the people who use them — held in common rather than owned outright by anyone. It\'s the old logic of the commons (the village forest, the shared well, the grazing field) applied to data, software and the platforms built on top of them.'
    },
    'concept.08': {
      'th': 'ข้อมูล · ซอฟต์แวร์ · แพลตฟอร์ม',
      'en': 'Data · software · platform'
    },
    'concept.09': {
      'th': 'ความเป็นเจ้าของร่วมและสุขภาวะชุมชน',
      'en': 'Owning it together is the point'
    },
    'concept.10': {
      'th': 'สุขภาวะชุมชนเกิดจากคุณภาพของความสัมพันธ์ระหว่างคนในชุมชน ความไว้เนื้อเชื่อใจกัน ความรู้สึกเป็นส่วนหนึ่งของกันและกัน และความสามัคคีที่พร้อมช่วยเหลือเกื้อกูล องค์ประกอบเหล่านี้ทำให้ชุมชนมีพลังรับมือกับวิกฤตและเติบโตได้อย่างยั่งยืน',
      'en': 'A healthy community is made of the relationships inside it — whether people trust each other, whether they feel they belong, whether they turn up when someone needs help. That is what carries a place through a bad year.'
    },
    'concept.11': {
      'th': 'ThaiEconoMap ถูกออกแบบมาให้เป็นพื้นที่ดิจิทัลที่ส่งเสริมให้เกิดปฏิสัมพันธ์ ความไว้วางใจ และความสามัคคีในชุมชน เมื่อคนในชุมชนร่วมกันสร้าง ใช้ และดูแลแพลตฟอร์มนี้ร่วมกัน กระบวนการนั้นเองคือกลไกการสร้างสุขภาวะชุมชนที่ยั่งยืน',
      'en': 'ThaiEconoMap is built to give those relationships somewhere to happen. People build the platform, use it and look after it together — and that process is itself the health outcome, as much as anything the platform delivers.'
    },
    'concept.12': {
      'th': '“มิเพียงแค่สร้างหรือให้เข้าถึง แต่ทุกคนจะได้เป็นเจ้าของแพลตฟอร์มร่วมกัน”',
      'en': '“Not just building it. Not just opening it up. Everyone ends up owning it.”'
    },
    'concept.13': {
      'th': 'เมื่อนำแนวคิด SDH มาเชื่อมกับ SSE และ Digital Commons — ความเหลื่อมล้ำทางเศรษฐกิจลดลง พร้อมกับโอกาสที่สุขภาวะของชุมชนดีขึ้นอย่างยั่งยืน',
      'en': 'Put the social determinants of health next to the solidarity economy and the digital commons, and the move that narrows the income gap is the same move that improves the odds of a healthier community.'
    },
    'features.01': {
      'th': 'ฟังก์ชันหลักของแพลตฟอร์ม',
      'en': 'What it does'
    },
    'features.02': {
      'th': 'สี่เครื่องมือ <em>ในแผนที่เดียว</em>',
      'en': 'Four tools, <em>one map</em>'
    },
    'features.03': {
      'th': 'ธุรกิจชุมชน',
      'en': 'Local business'
    },
    'features.04': {
      'th': 'ทำให้ร้านค้าและผู้ประกอบการรายย่อยในชุมชนปรากฏบนแผนที่ดิจิทัล พร้อมข้อมูลติดต่อ เวลาทำการ และช่องทางสั่งซื้อ',
      'en': 'Puts shops and small producers on the map with the details people actually need — how to reach them, when they\'re open, how to order.'
    },
    'features.05': {
      'th': 'งานและอาชีพ',
      'en': 'Work nearby'
    },
    'features.06': {
      'th': 'เชื่อมต่อผู้หางานกับนายจ้างในชุมชน สร้างโอกาสทางอาชีพใกล้บ้านโดยไม่ต้องพึ่งแพลตฟอร์มภายนอก',
      'en': 'Matches people looking for work with employers a few streets away, so a job doesn\'t have to mean a long commute or a middleman.'
    },
    'features.07': {
      'th': 'ประกาศชุมชน',
      'en': 'Notices'
    },
    'features.08': {
      'th': 'กระจายข้อมูลข่าวสาร กิจกรรม และเหตุฉุกเฉินในชุมชนอย่างโปร่งใสและทันท่วงที',
      'en': 'Gets news, events and emergency alerts around the neighbourhood while they still matter.'
    },
    'features.09': {
      'th': 'ช่วยเหลือแบ่งปัน',
      'en': 'Sharing'
    },
    'features.10': {
      'th': 'สร้างพื้นที่แบ่งปันสิ่งของและทรัพยากรภายในชุมชน เสริมสร้างความเอื้ออาทรและลดความสิ้นเปลือง',
      'en': 'A place to lend, pass on and pool what people already have — less waste, and more reason to know your neighbours.'
    },
    'outcomes.01': {
      'th': 'ผลลัพธ์และความคาดหวัง',
      'en': 'What we expect to change'
    },
    'outcomes.02': {
      'th': 'สามระดับของ<em>การเปลี่ยนแปลง</em>',
      'en': 'Three levels <em>of change</em>'
    },
    'outcomes.03': {
      'th': 'ระดับนโยบาย',
      'en': 'Policy'
    },
    'outcomes.04': {
      'th': 'สร้างต้นแบบของการพัฒนาแพลตฟอร์มดิจิทัลในฐานะโครงสร้างพื้นฐานที่เป็นประโยชน์สาธารณะ และขับเคลื่อนนโยบายเศรษฐกิจที่เป็นธรรม',
      'en': 'A working example of a digital platform run as public infrastructure — and an evidence-backed argument for economic policy that shares the gains.'
    },
    'outcomes.05': {
      'th': 'ระดับชุมชน',
      'en': 'Community'
    },
    'outcomes.06': {
      'th': 'ชุมชนมีฐานข้อมูลเศรษฐกิจของตนเอง สามารถวางแผนและบริหารจัดการทรัพยากรได้อย่างมีประสิทธิภาพ ลดการพึ่งพาแพลตฟอร์มภายนอก',
      'en': 'A community keeps its own economic record, plans and allocates resources with it, and leans less on platforms it has no say over.'
    },
    'outcomes.07': {
      'th': 'ระดับปัจเจก',
      'en': 'Individual'
    },
    'outcomes.08': {
      'th': 'ผู้ประกอบการรายย่อย แรงงาน และผู้บริโภคในชุมชนสามารถเข้าถึงโอกาสทางเศรษฐกิจได้ง่ายขึ้น มีรายได้ที่มั่นคงและยั่งยืน',
      'en': 'Small operators, workers and customers reach the opportunities around them more easily, and the income that follows is steadier.'
    },
    'story.01': {
      'th': 'เรื่องเล่าจากพื้นที่',
      'en': 'From the field'
    },
    'story.02': {
      'th': 'เปิดพิกัด ThaiEconoMap<br>เปลี่ยน Data ให้เป็นโอกาสของชุมชน',
      'en': 'Opening the map:<br>turning data into something a community can use'
    },
    'story.03': {
      'th': 'คุณอรรคณัฐ วันทนะสมบัติ — นักวิจัยจากสถาบันเอเชียศึกษา จุฬาลงกรณ์มหาวิทยาลัย',
      'en': 'Akkanut Wantanasombut — researcher, Institute of Asian Studies, Chulalongkorn University'
    },
    'story.04': {
      'th': '“เราอยากเห็นข้อมูลที่ไม่ได้อยู่ห่างไกลจากชีวิตคน แต่เป็นข้อมูลที่คนในพื้นที่สามารถใช้ได้จริง และช่วยสร้างโอกาสให้กับเศรษฐกิจฐานรากได้จริง”',
      'en': '“We wanted data that sits close to people\'s lives — something the people who live there can actually pick up and use, that actually opens a door for the economy on their street.”'
    },
    'story.05': {
      'th': 'คุณอรรคณัฐ วันทนะสมบัติ',
      'en': 'Akkanut Wantanasombut'
    },
    'story.06': {
      'th': 'เมื่อข้อมูลไม่ควรเป็นของใครคนใดคนหนึ่ง',
      'en': 'Who does the data belong to?'
    },
    'story.07': {
      'th': 'ในโลกยุคดิจิทัล ข้อมูลกลายเป็นทรัพยากรสำคัญที่มีมูลค่าไม่ต่างจากเงินทุน แรงงาน หรือโครงสร้างพื้นฐานทางเศรษฐกิจ แพลตฟอร์มดิจิทัลจำนวนมากเข้ามามีบทบาทในชีวิตประจำวันของผู้คน ตั้งแต่การสั่งอาหาร การเดินทาง การซื้อขายสินค้า ไปจนถึงการเข้าถึงบริการต่าง ๆ',
      'en': 'Data has become a resource on the order of capital or labour. And platforms now mediate more of an ordinary day every year — the meal, the journey, the purchase, the appointment.'
    },
    'story.08': {
      'th': 'แต่ในขณะที่แพลตฟอร์มเหล่านี้สร้างความสะดวกสบายให้กับผู้บริโภค อีกด้านหนึ่งก็เกิดคำถามสำคัญว่า ข้อมูลที่เกิดขึ้นจากผู้คน ร้านค้า แรงงาน และชุมชน ถูกนำไปสร้างประโยชน์ให้กับใคร และชุมชนเจ้าของข้อมูลได้รับประโยชน์จากข้อมูลเหล่านั้นมากน้อยเพียงใด',
      'en': 'The convenience is real. So is the question sitting underneath it. All that information — generated by people, shops, workers, whole neighbourhoods — is being turned into value for somebody. How much of it finds its way back to where it came from?'
    },
    'story.09': {
      'th': 'คำถามนี้คือจุดเริ่มต้นของ ThaiEconoMap แพลตฟอร์มดิจิทัลที่พัฒนาขึ้นจากแนวคิดว่า ข้อมูลไม่ควรถูกผูกขาดอยู่กับแพลตฟอร์มขนาดใหญ่เท่านั้น แต่ควรเป็นทรัพยากรที่ประชาชนและชุมชนสามารถเข้าถึง ร่วมกันดูแล และนำไปใช้สร้างโอกาสทางเศรษฐกิจของตนเองได้',
      'en': 'ThaiEconoMap started there. The premise is straightforward: data shouldn\'t be locked inside a handful of large platforms. It should be something people can reach, look after together, and turn into opportunity of their own.'
    },
    'story.10': {
      'th': 'จาก “ตามสั่ง-ตามส่ง” สู่ ThaiEconoMap',
      'en': 'It began with a delivery app'
    },
    'story.11': {
      'th': 'ก่อนจะมาเป็น ThaiEconoMap จุดเริ่มต้นของแนวคิดนี้เกิดจากโครงการ “ตามสั่ง-ตามส่ง” แพลตฟอร์มที่พัฒนาขึ้นเพื่อให้ร้านอาหารในชุมชนและมอเตอร์ไซค์รับจ้างมีช่องทางของตนเองในการให้บริการสั่งอาหารและขนส่ง',
      'en': 'Before ThaiEconoMap there was Tamsang-Tamsong — a delivery platform built so that neighbourhood restaurants and motorcycle taxi riders would have a channel of their own.'
    },
    'story.12': {
      'th': 'ในช่วงที่แพลตฟอร์มเดลิเวอรีเชิงพาณิชย์เติบโตอย่างรวดเร็ว ร้านอาหารจำนวนมากต้องปรับราคาขายเพื่อรองรับค่าธรรมเนียมของแพลตฟอร์ม ขณะที่ผู้บริโภคต้องจ่ายแพงขึ้น และไรเดอร์จำนวนไม่น้อยต้องทำงานหนักเพื่อให้มีรายได้เพียงพอ',
      'en': 'Commercial delivery was expanding fast at the time. Restaurants pushed prices up to cover the commissions, customers paid the difference, and plenty of riders were putting in longer hours to earn the same money.'
    },
    'story.13': {
      'th': 'จากจุดนั้น แนวคิดจึงขยายจากแพลตฟอร์มสั่งอาหาร ไปสู่การสร้างระบบข้อมูลเศรษฐกิจระดับพื้นที่ที่ชุมชนสามารถใช้ร่วมกันได้ และกลายเป็น ThaiEconoMap ในเวลาต่อมา',
      'en': 'From there the idea widened — from a way to order dinner into a shared record of an entire local economy. That became ThaiEconoMap.'
    },
    'story.14': {
      'th': 'เวทีนำเสนอโครงการ ThaiEconoMap',
      'en': 'Presenting the project'
    },
    'story.15': {
      'th': '“ตอนแรกเราเริ่มจากปัญหาที่เห็นชัดมาก คือร้านอาหาร ไรเดอร์ และผู้บริโภค ต่างก็ได้รับผลกระทบจากโครงสร้างของแพลตฟอร์มขนาดใหญ่ เราจึงอยากทดลองว่าถ้าชุมชนมีเครื่องมือของตัวเอง จะเกิดอะไรขึ้น”',
      'en': '“We started from a problem you could see plainly. The restaurants, the riders and the customers were all absorbing the cost of how the big platforms are built. So we wanted to find out what happens when a community has a tool of its own.”'
    },
    'story.16': {
      'th': 'รถพุ่มพวงกับข้อมูลที่เปลี่ยนคุณภาพชีวิต',
      'en': 'The grocery truck, and the data that changed a day'
    },
    'story.17': {
      'th': 'ในหลายชุมชน รถพุ่มพวงไม่ได้เป็นเพียงรถขายกับข้าว แต่เป็นส่วนหนึ่งของโครงสร้างพื้นฐานทางชีวิต โดยเฉพาะสำหรับผู้สูงอายุ ผู้ป่วยติดบ้าน ผู้ป่วยติดเตียง หรือผู้ดูแลผู้ป่วยที่ไม่สามารถเดินทางไปตลาดได้สะดวก',
      'en': 'In a lot of places the mobile grocery truck isn\'t a convenience — it\'s infrastructure. Especially for older residents, people who can\'t leave the house, people confined to bed, and the family members looking after them.'
    },
    'story.18': {
      'th': 'ปัญหาคือรถพุ่มพวงมักมีเวลาการเดินทางที่ไม่แน่นอน บางวันมาเร็ว บางวันมาช้า ทำให้ประชาชนไม่สามารถวางแผนได้ว่าควรออกมารอเมื่อใด ThaiEconoMap จึงพัฒนาระบบที่ให้รถพุ่มพวงส่งข้อมูลตำแหน่งเข้าสู่แพลตฟอร์ม เพื่อให้ประชาชนติดตามตำแหน่งของรถได้แบบเรียลไทม์',
      'en': 'The trouble is the timing. The truck comes early one day and late the next, so nobody knows when to go out and wait. ThaiEconoMap gave the trucks a way to broadcast their position, and now people can watch one coming in real time.'
    },
    'story.19': {
      'th': '“เรื่องนี้อาจดูเล็กสำหรับบางคน แต่สำหรับผู้สูงอายุหรือคนที่ดูแลผู้ป่วย การรู้ว่ารถพุ่มพวงอยู่ตรงไหนและจะมาถึงเมื่อไร ช่วยให้เขาจัดการชีวิตประจำวันได้ดีขึ้นมาก”',
      'en': '“To some people this sounds like a small thing. For an older person, or someone caring for a patient, knowing where the truck is and when it will arrive changes how the whole day works.”'
    },
    'story.20': {
      'th': 'แผนที่ที่ไม่ได้บอกแค่เส้นทาง แต่บอกชีวิตของชุมชน',
      'en': 'A map of routes, or a map of a life?'
    },
    'story.21': {
      'th': 'ThaiEconoMap ถูกออกแบบให้เป็น Web Application ที่ใช้แผนที่เป็นศูนย์กลางในการรวบรวมและแสดงข้อมูลทางเศรษฐกิจและสังคมของชุมชน ภายในแพลตฟอร์มมีข้อมูลหลากหลายประเภท เช่น ร้านอาหาร ธุรกิจชุมชน รถพุ่มพวง ตำแหน่งงาน ผู้ให้บริการในพื้นที่ รวมถึงข้อมูลการแบ่งปันสิ่งของหรือทรัพยากร',
      'en': 'ThaiEconoMap is a web application with the map at the centre — the place where a neighbourhood\'s economic and social information collects. Restaurants, community businesses, grocery trucks, job openings, local service providers, and whatever people are offering to share.'
    },
    'story.22': {
      'th': 'ร้านค้าเล็ก ๆ ที่อาจไม่เคยปรากฏบนแพลตฟอร์มใหญ่ ผู้ประกอบการรายย่อยที่ไม่มีงบโฆษณา หรือบริการในชุมชนที่คนภายนอกไม่รู้จัก สามารถถูกบันทึกและเชื่อมโยงเข้ากับผู้ใช้งานผ่านระบบแผนที่',
      'en': 'A shop that never made it onto a big platform. A producer with no advertising budget. A service nobody outside the area has heard of. All of them can be recorded — and, finally, found.'
    },
    'story.23': {
      'th': '“หลายครั้งเศรษฐกิจฐานรากไม่ได้ขาดศักยภาพ แต่ขาดการมองเห็น ถ้าเราทำให้ข้อมูลเหล่านี้ปรากฏขึ้นมา คนก็จะเข้าถึงร้านค้า บริการ และโอกาสในพื้นที่ได้มากขึ้น”',
      'en': '“Most of the time the grassroots economy isn\'t short on capability. It\'s short on visibility. Put the information where people can see it and they find the shops, the services and the openings that were there all along.”'
    },
    'story.24': {
      'th': 'ข้อมูลที่ดีต้องมาจากคนในพื้นที่',
      'en': 'Good data comes from people who live there'
    },
    'story.25': {
      'th': 'เพราะข้อมูลที่ไม่ถูกต้องอาจสร้างความเข้าใจผิด หรือทำให้ผู้ใช้งานไม่สามารถนำไปใช้ประโยชน์ได้จริง ทีมพัฒนาจึงออกแบบระบบหลังบ้านให้มีการตรวจสอบข้อมูลก่อนเผยแพร่สู่สาธารณะ',
      'en': 'Wrong information is worse than none: it misleads, and it costs the whole thing its credibility. So submissions get checked before they go public.'
    },
    'story.26': {
      'th': 'ระบบสามารถแต่งตั้งผู้ดูแลข้อมูลหรือแอดมินในระดับพื้นที่ เช่น ระดับอำเภอ เพื่อทำหน้าที่ตรวจสอบข้อมูลที่ประชาชนส่งเข้ามาก่อนอนุมัติให้ปรากฏบนแพลตฟอร์ม แนวคิดนี้ตั้งอยู่บนความเชื่อว่าคนในพื้นที่ย่อมเข้าใจบริบทของพื้นที่ตนเองดีที่สุด',
      'en': 'Data stewards can be appointed at area level — a district at a time — to review what residents send in. The reasoning is simple enough: nobody understands a place better than the people in it.'
    },
    'story.27': {
      'th': 'วงเสวนากับผู้มีส่วนได้ส่วนเสียในพื้นที่',
      'en': 'In conversation with people from the area'
    },
    'story.28': {
      'th': '“ถ้าเป็นข้อมูลของชุมชน คนในชุมชนควรมีบทบาทในการดูแลข้อมูลนั้น เพราะเขารู้ว่าร้านนี้มีอยู่จริงไหม ถนนเส้นนี้ใช้ได้ไหม หรือข้อมูลแบบไหนที่เป็นประโยชน์กับพื้นที่”',
      'en': '“If it\'s the community\'s data, the community should have a hand in looking after it. They\'re the ones who know whether that shop is still open, whether that road is passable, what\'s actually worth recording.”'
    },
    'story.29': {
      'th': 'งานวิจัยที่ลงไปเรียนรู้กับพื้นที่จริง',
      'en': 'Research that leaves the building'
    },
    'story.30': {
      'th': 'สิ่งที่ทำให้ ThaiEconoMap แตกต่างจากงานวิจัยด้านเทคโนโลยีจำนวนมาก คือการไม่ได้หยุดอยู่เพียงการพัฒนาแพลตฟอร์มในห้องทดลอง แต่ลงไปทำงานกับพื้นที่จริง แต่ละชุมชนมีบริบทไม่เหมือนกัน บางพื้นที่มีผู้ประกอบการที่คุ้นเคยกับเทคโนโลยีดิจิทัลอยู่แล้ว ขณะที่บางพื้นที่ยังมีข้อจำกัดด้าน Digital Literacy',
      'en': 'What sets this apart from a lot of technology research is that it didn\'t stop at a working prototype. Every community turned out different. In some, shop owners were already fluent with digital tools. In others, that fluency was the constraint.'
    },
    'story.31': {
      'th': 'ในบางพื้นที่ ทีมงานทำงานร่วมกับโรงเรียนมัธยม ให้นักเรียนลงสำรวจข้อมูลธุรกิจในชุมชนและช่วยบันทึกข้อมูลเข้าสู่ระบบ สำหรับผู้ประกอบการที่ยังไม่สามารถใช้งานระบบได้ด้วยตนเอง กระบวนการนี้ไม่ได้ช่วยให้แพลตฟอร์มมีข้อมูลมากขึ้นเท่านั้น แต่ยังทำให้นักเรียนได้เรียนรู้ชุมชนของตนเอง',
      'en': 'So in some districts the team worked with secondary schools. Students surveyed the businesses around them and entered the records for owners who couldn\'t yet do it themselves. The platform got its data — and the students got a much closer look at the place they live.'
    },
    'story.32': {
      'th': 'จากรถพุ่มพวงสู่ระบบขนส่งท้องถิ่น',
      'en': 'From grocery trucks to the local bus'
    },
    'story.33': {
      'th': 'หนึ่งในทิศทางการพัฒนาต่อไปของ ThaiEconoMap คือการนำหลักการจากระบบติดตามรถพุ่มพวงไปประยุกต์ใช้กับระบบขนส่งสาธารณะในท้องถิ่น เช่น รถสองแถวในต่างจังหวัด ซึ่งหลายเส้นทางมีเพียงไม่กี่เที่ยวต่อวัน และประชาชนมักไม่สามารถคาดการณ์เวลาที่รถจะมาถึงได้อย่างแม่นยำ',
      'en': 'One direction from here is to take the tracking that works for grocery trucks and point it at local public transport — the songthaew pickups upcountry, where a route might run a few times a day and nobody can say when.'
    },
    'story.34': {
      'th': 'หากสามารถใช้ระบบติดตามตำแหน่งแบบเรียลไทม์ได้ ประชาชนจะสามารถวางแผนการเดินทางได้ดีขึ้น ลดเวลาการรอคอย และเข้าถึงบริการต่าง ๆ ได้สะดวกมากขึ้น นี่คือตัวอย่างของการนำข้อมูลเชิงพื้นที่ไปต่อยอดเพื่อแก้ปัญหาชีวิตประจำวันของประชาชนในระดับท้องถิ่นอย่างเป็นรูปธรรม',
      'en': 'Live positions would let people plan a journey, wait less, and actually get where they\'re going. A small, concrete use of spatial data on a problem people meet every day.'
    },
    'story.35': {
      'th': 'แพลตฟอร์มที่ให้ชุมชนเป็นเจ้าของอนาคตของตนเอง',
      'en': 'A community that owns its own future'
    },
    'story.36': {
      'th': 'ท้ายที่สุด ThaiEconoMap ไม่ได้เป็นเพียงแผนที่ดิจิทัล ไม่ได้เป็นเพียงฐานข้อมูลธุรกิจชุมชน และไม่ได้เป็นเพียงงานวิจัยด้านเทคโนโลยี แต่เป็นการทดลองทางสังคมที่ตั้งคำถามว่า ถ้าประชาชนสามารถมีส่วนร่วมในการสร้างและใช้ข้อมูลของตนเองได้ ระบบเศรษฐกิจและคุณภาพชีวิตของชุมชนจะเปลี่ยนไปอย่างไร',
      'en': 'ThaiEconoMap isn\'t only a digital map, or a directory of local businesses, or a piece of technology research. It\'s a social experiment with one question at the centre: if people can help build and use the data about their own lives, what changes?'
    },
    'story.37': {
      'th': 'ในวันที่ข้อมูลกลายเป็นทรัพยากรสำคัญของโลก ThaiEconoMap จึงเป็นความพยายามในการทำให้ Data ไม่ได้เป็นเพียงเครื่องมือขององค์กรขนาดใหญ่ แต่กลายเป็นโอกาสของชุมชน เป็นโครงสร้างพื้นฐานดิจิทัลที่ช่วยลดความเหลื่อมล้ำ สร้างรายได้ และยกระดับคุณภาพชีวิตของผู้คนอย่างยั่งยืน',
      'en': 'At a moment when data is one of the world\'s most valuable resources, this is an attempt to make it something other than an asset for large organisations — to make it infrastructure that narrows a gap, generates income, and improves how people actually live.'
    },
    'story.38': {
      'th': '“สิ่งสำคัญไม่ใช่แค่การมีแพลตฟอร์ม แต่คือการทำให้แพลตฟอร์มนั้นเป็นของผู้คน เป็นสิ่งที่ชุมชนมีส่วนร่วมกำหนดทิศทาง และได้รับประโยชน์ร่วมกัน”',
      'en': '“Having a platform isn\'t the point. Making it belong to people is — something a community helps steer, and shares in.”'
    },
    'story.39': {
      'th': 'คุณอรรคณัฐ วันทนะสมบัติ',
      'en': 'Akkanut Wantanasombut'
    },
    'contact.01': {
      'th': 'ติดต่อเรา',
      'en': 'Contact us'
    },
    'contact.02': {
      'th': 'มีคำถาม หรืออยากร่วมงานกับเรา?',
      'en': 'Questions, or want to work with us?'
    },
    'contact.03': {
      'th': 'ไม่ว่าจะเป็นชุมชนที่สนใจนำแพลตฟอร์มไปใช้ นักวิจัย หน่วยงานท้องถิ่น หรือใครก็ตามที่มีคำถามเกี่ยวกับโครงการ เขียนมาหาเราได้เลย เราอ่านทุกฉบับ',
      'en': 'Whether you\'re a community thinking about using the platform, a researcher, a local authority, or simply someone with a question about the project — write to us. We read everything that comes in.'
    },
    'contact.04': {
      'th': 'เรื่อง',
      'en': 'Re:'
    },
    'contact.05': {
      'th': 'ข้อความ',
      'en': 'Message:'
    },
    'contact.06': {
      'th': 'อีเมลของคุณ',
      'en': 'Sender email'
    },
    'contact.07': {
      'th': 'กรุณากรอกอีเมลที่ถูกต้อง เพื่อให้เราติดต่อกลับได้',
      'en': 'Please enter a valid email address so we can reply.'
    },
    'contact.08': {
      'th': 'ส่งข้อความ',
      'en': 'Submit'
    },
    'contact.09': {
      'th': 'ข้อมูลที่คุณส่งจะถูกส่งไปยัง issie.ias@chula.ac.th เท่านั้น และใช้เพื่อการติดต่อกลับ',
      'en': 'What you send goes to issie.ias@chula.ac.th and is used only to reply to you.'
    },
    'contact.email': {
      'th': 'issie.ias@chula.ac.th',
      'en': 'issie.ias@chula.ac.th'
    }
  },
  'terms': {
    'title': {
      'th': 'ข้อกำหนดและเงื่อนไขการใช้งาน',
      'en': ''
    },
    'effectiveDate': {
      'th': '29 กันยายน 2569',
      'en': ''
    },
    'body': {
      'th': 'ข้อกำหนดและเงื่อนไขการใช้งานฉบับนี้ ("ข้อกำหนด") ใช้บังคับระหว่าง โครงการ ISSIE จุฬาลงกรณ์มหาวิทยาลัย ("ผู้ให้บริการ" หรือ "เรา") กับผู้ใช้งาน ("ผู้ใช้" หรือ "ท่าน") ในการใช้งานเว็บไซต์และแอปพลิเคชัน Thai Economap (ไทยอีโค่โนแมป) รวมถึงบริการที่เกี่ยวข้องทั้งหมด ("บริการ") โปรดอ่านข้อกำหนดนี้โดยละเอียด การเข้าใช้งานหรือใช้บริการถือว่าท่านได้อ่าน เข้าใจ และตกลงผูกพันตามข้อกำหนดนี้แล้ว หากท่านไม่ตกลง โปรดหยุดใช้บริการ\n\n## 1. ลักษณะของบริการ\n\nบริการเป็นแผนที่ข้อมูลเศรษฐกิจชุมชนที่ไม่แสวงหากำไร เพื่อช่วยให้ประชาชนค้นหาและเข้าถึงข้อมูลในพื้นที่ ได้แก่\n\n- ร้านอาหารและธุรกิจในชุมชน รวมถึงข้อมูลเวลาทำการ ช่องทางติดต่อ และเส้นทาง\n- ตำแหน่งแบบเรียลไทม์ของรถพุ่มพวง (รถเร่ขายสินค้า) ที่เข้าร่วมโครงการ\n- ประกาศงานและอาชีพ ซึ่งบางส่วนได้รับมาจากระบบของหน่วยงานพันธมิตร\n- การแบ่งปันสิ่งของระหว่างผู้ใช้ (ช่วยเหลือแบ่งปัน)\n- ประกาศข่าวสารจากหน่วยงานในพื้นที่\n\nผู้ให้บริการเป็นเพียงผู้จัดให้มีพื้นที่สำหรับเผยแพร่ข้อมูล มิใช่คู่สัญญาในการซื้อขาย การจ้างงาน หรือการแบ่งปันสิ่งของใด ๆ ระหว่างผู้ใช้กับร้านค้า ผู้ประกาศงาน หรือผู้ใช้รายอื่น\n\n## 2. บัญชีผู้ใช้\n\n- ท่านสามารถดูข้อมูลบนแผนที่ได้โดยไม่ต้องเข้าสู่ระบบ แต่การเพิ่มข้อมูล การบันทึกรายการโปรด และบริการบางส่วนต้องเข้าสู่ระบบด้วยบัญชี LINE\n- ท่านต้องรับผิดชอบดูแลบัญชีของท่าน และรับผิดชอบต่อการกระทำที่เกิดขึ้นผ่านบัญชีของท่าน หากพบการใช้งานโดยไม่ได้รับอนุญาต โปรดแจ้งเราโดยเร็ว\n- ผู้ใช้ที่มีอายุต่ำกว่า 20 ปีบริบูรณ์ควรได้รับความยินยอมจากผู้ใช้อำนาจปกครองก่อนเพิ่มข้อมูลหรือส่งข้อมูลส่วนบุคคลเข้าสู่บริการ\n\n## 3. ข้อมูลที่ผู้ใช้เพิ่มเข้าสู่บริการ\n\nเมื่อท่านเพิ่มหรือแก้ไขข้อมูล เช่น ข้อมูลร้านค้า รูปภาพ ช่องทางติดต่อ หรือรายการสิ่งของที่แบ่งปัน ("เนื้อหาของผู้ใช้")\n\n- ท่านรับรองว่าเนื้อหาเป็นความจริง ถูกต้อง เป็นปัจจุบัน และท่านมีสิทธิ์เผยแพร่ รวมถึงได้รับความยินยอมจากบุคคลที่ปรากฏในข้อมูลหรือรูปภาพแล้ว\n- ท่านยังคงเป็นเจ้าของเนื้อหาของผู้ใช้ และอนุญาตให้ผู้ให้บริการใช้ ทำซ้ำ ดัดแปลงเพื่อการแสดงผล และเผยแพร่เนื้อหาดังกล่าวบนบริการและช่องทางที่เกี่ยวข้องกับโครงการ โดยไม่มีค่าตอบแทน เพื่อวัตถุประสงค์ในการให้บริการ\n- ข้อมูลที่ส่งเข้ามาจะผ่านการตรวจสอบก่อนเผยแพร่ ผู้ให้บริการมีสิทธิ์ปฏิเสธ แก้ไข หรือลบเนื้อหาที่ไม่เป็นไปตามข้อกำหนดนี้ได้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า\n- ข้อมูลร้านค้าและข้อมูลติดต่อที่ได้รับอนุมัติจะเปิดเผยต่อสาธารณะบนแผนที่\n\n## 4. ข้อห้ามในการใช้งาน\n\nท่านตกลงที่จะไม่\n\n- เพิ่มข้อมูลอันเป็นเท็จ หลอกลวง หรือทำให้ผู้อื่นเข้าใจผิด\n- เผยแพร่เนื้อหาที่ผิดกฎหมาย ลามก หมิ่นประมาท ละเมิดสิทธิ์ในทรัพย์สินทางปัญญาหรือความเป็นส่วนตัวของผู้อื่น หรือขัดต่อความสงบเรียบร้อยหรือศีลธรรมอันดีของประชาชน\n- เสนอขายหรือแบ่งปันสินค้าหรือบริการที่ผิดกฎหมาย\n- เก็บรวบรวมข้อมูลส่วนบุคคลของผู้อื่นจากบริการโดยไม่ได้รับอนุญาต หรือใช้ข้อมูลติดต่อเพื่อส่งข้อความรบกวนหรือโฆษณา\n- ดึงข้อมูลจำนวนมากโดยอัตโนมัติ เข้าถึงระบบโดยไม่ได้รับอนุญาต หรือกระทำการใดที่รบกวนหรือทำให้บริการขัดข้อง\n- แอบอ้างเป็นบุคคลอื่น ร้านค้า หรือหน่วยงานอื่น\n\nการกระทำดังกล่าวอาจเป็นความผิดตามพระราชบัญญัติว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์ พ.ศ. 2550 และกฎหมายอื่นที่เกี่ยวข้อง ผู้ให้บริการสงวนสิทธิ์ระงับหรือยกเลิกบัญชี ลบเนื้อหา และดำเนินการตามกฎหมายต่อผู้ฝ่าฝืน\n\n## 5. ความถูกต้องของข้อมูล\n\nข้อมูลบนบริการมาจากผู้ใช้ ร้านค้า หน่วยงานพันธมิตร และแหล่งข้อมูลภายนอก ผู้ให้บริการพยายามอย่างสมเหตุสมผลให้ข้อมูลถูกต้อง แต่ไม่รับรองความถูกต้อง ความครบถ้วน หรือความเป็นปัจจุบันของข้อมูล เช่น สถานะเปิด-ปิด เวลาทำการ ตำแหน่งของรถพุ่มพวง รายละเอียดงาน หรือสภาพสิ่งของ ท่านควรตรวจสอบกับร้านค้าหรือผู้ประกาศโดยตรงก่อนตัดสินใจ\n\n## 6. ธุรกรรมกับบุคคลภายนอกและบริการภายนอก\n\n- การซื้อขาย การสั่งอาหาร การสมัครงาน หรือการรับ-ให้สิ่งของ เป็นการตกลงระหว่างท่านกับร้านค้า ผู้ประกาศ หรือผู้ใช้รายอื่นโดยตรง ผู้ให้บริการไม่ได้เป็นคู่สัญญาและไม่รับผิดชอบต่อคุณภาพ ความปลอดภัย ราคา หรือการปฏิบัติตามข้อตกลงนั้น\n- บริการอาจเชื่อมต่อไปยังบริการของบุคคลภายนอก เช่น LINE (รวมถึงบัญชี LINE Official Account ของร้านค้าสำหรับการสั่งอาหาร) และ Google Maps (สำหรับการนำทาง) การใช้บริการเหล่านั้นอยู่ภายใต้ข้อกำหนดและนโยบายของผู้ให้บริการภายนอกนั้น\n- โปรดใช้ความระมัดระวังในการนัดพบ รับ-ส่งสิ่งของ หรือโอนเงินกับบุคคลที่ท่านไม่รู้จัก\n\n## 7. ทรัพย์สินทางปัญญา\n\nชื่อ ตราสัญลักษณ์ การออกแบบ ซอฟต์แวร์ และเนื้อหาของบริการ (ยกเว้นเนื้อหาของผู้ใช้และข้อมูลของบุคคลภายนอก) เป็นทรัพย์สินทางปัญญาของผู้ให้บริการหรือผู้อนุญาตให้ใช้สิทธิ์ ข้อมูลแผนที่พื้นฐานเป็นของผู้ร่วมพัฒนา OpenStreetMap ท่านไม่อาจทำซ้ำ ดัดแปลง หรือนำไปใช้เพื่อการค้าโดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร\n\n## 8. การให้บริการและข้อจำกัดความรับผิด\n\n- บริการให้ไว้ “ตามสภาพ” และ “ตามที่มีให้บริการ” ผู้ให้บริการอาจปรับปรุง ระงับ หรือยุติบริการทั้งหมดหรือบางส่วนได้ โดยจะแจ้งให้ทราบล่วงหน้าตามสมควรเมื่อทำได้\n- ภายในขอบเขตที่กฎหมายอนุญาต ผู้ให้บริการไม่ต้องรับผิดต่อความเสียหายใด ๆ ที่เกิดจากการใช้หรือไม่สามารถใช้บริการ การอาศัยข้อมูลบนบริการ หรือธุรกรรมระหว่างท่านกับบุคคลภายนอก\n- ข้อจำกัดความรับผิดนี้ไม่ใช้บังคับกับความเสียหายที่เกิดจากการกระทำโดยจงใจหรือประมาทเลินเล่ออย่างร้ายแรงของผู้ให้บริการ หรือกรณีอื่นที่กฎหมายห้ามมิให้จำกัดความรับผิด\n\n## 9. ข้อมูลส่วนบุคคล\n\nผู้ให้บริการเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของท่านตาม [นโยบายความเป็นส่วนตัว](/privacy) ซึ่งเป็นส่วนหนึ่งของข้อกำหนดนี้ และสอดคล้องกับพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562\n\n## 10. การเปลี่ยนแปลงข้อกำหนด\n\nผู้ให้บริการอาจแก้ไขข้อกำหนดนี้เป็นครั้งคราว โดยจะประกาศฉบับปรับปรุงบนหน้านี้พร้อมวันที่มีผลบังคับใช้ หากเป็นการเปลี่ยนแปลงที่สำคัญ เราจะแจ้งให้ทราบผ่านบริการ การใช้บริการต่อไปหลังจากข้อกำหนดฉบับใหม่มีผลบังคับใช้ ถือว่าท่านยอมรับข้อกำหนดฉบับดังกล่าว\n\n## 11. กฎหมายที่ใช้บังคับ\n\nข้อกำหนดนี้อยู่ภายใต้และตีความตามกฎหมายแห่งราชอาณาจักรไทย ข้อพิพาทใดที่เกิดขึ้นให้อยู่ในเขตอำนาจของศาลไทย หากข้อกำหนดข้อใดไม่สมบูรณ์หรือใช้บังคับไม่ได้ ให้ข้อกำหนดส่วนที่เหลือยังคงมีผลใช้บังคับต่อไป\n\n## 12. ติดต่อเรา\n\nหากมีคำถามเกี่ยวกับข้อกำหนดนี้ หรือต้องการแจ้งเนื้อหาที่ไม่เหมาะสม โปรดติดต่อ\n\n- ผู้ให้บริการ: โครงการ ISSIE จุฬาลงกรณ์มหาวิทยาลัย\n- ที่อยู่: TODO: ที่อยู่สำหรับติดต่อ\n- อีเมล: TODO: อีเมลสำหรับติดต่อเรื่องข้อมูลส่วนบุคคล\n- โทรศัพท์: 061-172-3888\n- เว็บไซต์: https://www.issie-chula.org',
      'en': ''
    }
  },
  'privacy': {
    'title': {
      'th': 'นโยบายความเป็นส่วนตัว',
      'en': ''
    },
    'effectiveDate': {
      'th': '29 กันยายน 2569',
      'en': ''
    },
    'body': {
      'th': 'โครงการ ISSIE จุฬาลงกรณ์มหาวิทยาลัย ("ผู้ให้บริการ" หรือ "เรา") ในฐานะผู้ควบคุมข้อมูลส่วนบุคคลของบริการ Thai Economap (ไทยอีโค่โนแมป) ("บริการ") ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของท่าน นโยบายนี้อธิบายว่าเราเก็บรวบรวม ใช้ เปิดเผย และคุ้มครองข้อมูลส่วนบุคคลของท่านอย่างไร รวมถึงสิทธิของท่าน ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ("กฎหมายคุ้มครองข้อมูลส่วนบุคคล")\n\n## 1. ผู้ควบคุมข้อมูลส่วนบุคคลและช่องทางติดต่อ\n\n- ผู้ให้บริการ: โครงการ ISSIE จุฬาลงกรณ์มหาวิทยาลัย\n- ที่อยู่: TODO: ที่อยู่สำหรับติดต่อ\n- อีเมล: TODO: อีเมลสำหรับติดต่อเรื่องข้อมูลส่วนบุคคล\n- โทรศัพท์: 061-172-3888\n- เว็บไซต์: https://www.issie-chula.org\n\n## 2. ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม\n\nเราเก็บรวบรวมข้อมูลเท่าที่จำเป็นตามลักษณะการใช้งานของท่าน ดังนี้\n\n- ข้อมูลบัญชี เมื่อท่านเข้าสู่ระบบด้วย LINE: ชื่อที่แสดง รูปโปรไฟล์ อีเมล (หากท่านอนุญาตให้ LINE ส่งให้เรา) และรหัสผู้ใช้ที่ระบบสร้างขึ้น\n- ข้อมูลที่ท่านเพิ่มเข้าสู่บริการ: ข้อมูลร้านค้าหรือธุรกิจ ชื่อเจ้าของร้าน หมายเลขโทรศัพท์ ที่อยู่และพิกัดของร้าน รูปภาพ รายละเอียดสิ่งของที่แบ่งปัน และข้อมูลติดต่อ (ชื่อ หมายเลขโทรศัพท์ อีเมล)\n- ข้อมูลการใช้งานบัญชี: รายการโปรด ประวัติการส่งข้อมูล และสถานะการตรวจสอบ\n- ข้อมูลตำแหน่งของอุปกรณ์: เฉพาะเมื่อท่านอนุญาตผ่านเบราว์เซอร์ ใช้เพื่อแสดงตำแหน่งของท่านบนแผนที่ ค้นหาสิ่งที่อยู่ใกล้ และนำทาง โดยเราไม่บันทึกตำแหน่งของผู้ใช้ทั่วไปไว้ในบัญชี\n- สำหรับผู้ขับรถพุ่มพวงที่เข้าร่วมโครงการ: หมายเลขโทรศัพท์ที่ใช้ยืนยันตัวตนด้วยรหัส OTP ข้อมูลรถ ตำแหน่งและทิศทางของรถแบบเรียลไทม์ระหว่างให้บริการ ประวัติเส้นทาง และโทเคนสำหรับส่งการแจ้งเตือน\n- ข้อมูลทางเทคนิค: หมายเลข IP ประเภทอุปกรณ์และเบราว์เซอร์ หน้าที่เข้าชม และข้อมูลการใช้งานที่เก็บผ่านคุกกี้หรือเทคโนโลยีที่คล้ายกัน\n\nเราไม่มีวัตถุประสงค์เก็บรวบรวมข้อมูลส่วนบุคคลที่มีความอ่อนไหว เช่น ข้อมูลสุขภาพ ศาสนา หรือข้อมูลชีวภาพ โปรดอย่าระบุข้อมูลดังกล่าวในเนื้อหาที่ท่านเพิ่มเข้าสู่บริการ\n\n## 3. วัตถุประสงค์และฐานทางกฎหมายในการประมวลผล\n\n- เพื่อให้บริการตามที่ท่านร้องขอ เช่น การเข้าสู่ระบบ การบันทึกรายการโปรด การเพิ่มและแสดงข้อมูลร้านค้าหรือสิ่งของ และการติดตามรถพุ่มพวง (ฐานการปฏิบัติตามสัญญา)\n- เพื่อตรวจสอบความถูกต้องของข้อมูลก่อนเผยแพร่ ป้องกันการทุจริต สแปม และการใช้งานที่ผิดกฎหมาย และรักษาความปลอดภัยของระบบ (ฐานประโยชน์โดยชอบด้วยกฎหมาย)\n- เพื่อเผยแพร่ข้อมูลร้านค้า ช่องทางติดต่อ และรายการสิ่งของที่ท่านส่งเข้ามาให้สาธารณะเห็นบนแผนที่ (ฐานการปฏิบัติตามสัญญา และความยินยอมของท่านในส่วนที่เกี่ยวข้อง)\n- เพื่อใช้ตำแหน่งของอุปกรณ์ในการแสดงผลและค้นหาสิ่งที่อยู่ใกล้ (ฐานความยินยอม ซึ่งท่านสามารถปิดได้ในการตั้งค่าเบราว์เซอร์)\n- เพื่อวิเคราะห์สถิติการใช้งานแบบภาพรวม ปรับปรุงบริการ และจัดทำรายงานหรืองานวิจัยเพื่อประโยชน์สาธารณะในรูปแบบที่ไม่สามารถระบุตัวบุคคลได้ (ฐานประโยชน์โดยชอบด้วยกฎหมาย และฐานการจัดทำวิจัยหรือสถิติ ส่วนการใช้คุกกี้เพื่อการวิเคราะห์อาศัยฐานความยินยอม)\n- เพื่อปฏิบัติตามกฎหมาย คำสั่งของหน่วยงานรัฐ หรือเพื่อก่อตั้งสิทธิเรียกร้อง ใช้ หรือยกขึ้นต่อสู้ซึ่งสิทธิเรียกร้องตามกฎหมาย (ฐานการปฏิบัติตามกฎหมาย และฐานประโยชน์โดยชอบด้วยกฎหมาย)\n\nหากท่านไม่ให้ข้อมูลที่จำเป็น เราอาจไม่สามารถให้บริการบางส่วนแก่ท่านได้ เช่น การเข้าสู่ระบบ หรือการเพิ่มข้อมูลร้านค้า\n\n## 4. การเปิดเผยข้อมูลส่วนบุคคล\n\nเราไม่ขายข้อมูลส่วนบุคคลของท่าน เราอาจเปิดเผยข้อมูลเท่าที่จำเป็นแก่\n\n- สาธารณะ: ข้อมูลร้านค้า ชื่อเจ้าของร้าน ช่องทางติดต่อ รูปภาพ ข้อมูลสิ่งของที่แบ่งปัน และตำแหน่งของรถพุ่มพวงระหว่างให้บริการ จะแสดงต่อผู้ใช้ทุกคนหลังผ่านการตรวจสอบ\n- ผู้ให้บริการภายนอกที่ประมวลผลข้อมูลในนามของเรา เช่น ผู้ให้บริการโครงสร้างพื้นฐานและพื้นที่จัดเก็บข้อมูล บริการยืนยันตัวตนด้วย OTP บริการส่งการแจ้งเตือน (Firebase Cloud Messaging) และ Google Analytics (เฉพาะเมื่อท่านยินยอม) ภายใต้ข้อตกลงที่กำหนดให้รักษาความลับและความปลอดภัยของข้อมูล\n- LINE Corporation ในการเข้าสู่ระบบ และบัญชี LINE Official Account ของร้านค้าเมื่อท่านเลือกสั่งอาหารผ่าน LINE\n- หน่วยงานพันธมิตรของโครงการ ที่แลกเปลี่ยนข้อมูลร้านค้าหรือประกาศงานกับบริการ เช่น ระบบ ตามสั่ง-ตามส่ง และระบบประกาศงานของโครงการ\n- หน่วยงานของรัฐหรือบุคคลที่มีอำนาจตามกฎหมาย เมื่อมีกฎหมายกำหนดหรือมีคำสั่งโดยชอบด้วยกฎหมาย\n\nเมื่อท่านใช้ปุ่มนำทาง บริการจะส่งพิกัดต้นทางและปลายทางไปยัง Google Maps ส่วนภาพแผนที่พื้นฐานโหลดจาก OpenStreetMap การใช้งานบริการเหล่านั้นอยู่ภายใต้นโยบายความเป็นส่วนตัวของผู้ให้บริการภายนอกนั้น\n\n## 5. การส่งหรือโอนข้อมูลไปต่างประเทศ\n\nผู้ให้บริการภายนอกบางราย เช่น Google และ LINE อาจจัดเก็บหรือประมวลผลข้อมูลบนเซิร์ฟเวอร์นอกประเทศไทย เราจะดำเนินการให้การส่งหรือโอนข้อมูลดังกล่าวเป็นไปตามที่กฎหมายคุ้มครองข้อมูลส่วนบุคคลกำหนด โดยประเทศปลายทางต้องมีมาตรฐานการคุ้มครองที่เพียงพอ หรือมีมาตรการคุ้มครองที่เหมาะสมตามที่กฎหมายกำหนด\n\n## 6. ระยะเวลาการเก็บรักษาข้อมูล\n\n- ข้อมูลบัญชีและรายการโปรด: ตลอดระยะเวลาที่ท่านยังมีบัญชี และลบหรือทำให้ไม่สามารถระบุตัวตนได้ภายในระยะเวลาอันสมควรเมื่อท่านขอลบบัญชี\n- ข้อมูลร้านค้าและสิ่งของที่เผยแพร่: ตลอดระยะเวลาที่ข้อมูลยังเผยแพร่อยู่ และเมื่อถูกลบ เราอาจเก็บสำเนาไว้ในระบบชั่วคราวเพื่อการกู้คืนหรือตรวจสอบก่อนลบถาวร\n- บันทึกการยืนยันตัวตนด้วย OTP ของผู้ขับรถพุ่มพวง: ไม่เกิน 90 วัน\n- ประวัติเส้นทางของรถพุ่มพวง: ตลอดระยะเวลาที่รถยังเข้าร่วมโครงการ\n- ข้อมูลสถิติการใช้งาน: ตามระยะเวลาที่ตั้งค่าไว้ในบริการวิเคราะห์การใช้งาน\n\nเมื่อพ้นระยะเวลาดังกล่าว เราจะลบ ทำลาย หรือทำให้ข้อมูลไม่สามารถระบุตัวบุคคลได้ เว้นแต่กฎหมายกำหนดให้เก็บรักษาไว้นานกว่านั้น\n\n## 7. สิทธิของเจ้าของข้อมูลส่วนบุคคล\n\nภายใต้เงื่อนไขของกฎหมายคุ้มครองข้อมูลส่วนบุคคล ท่านมีสิทธิ\n\n- ขอเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคลของท่าน หรือขอให้เปิดเผยที่มาของข้อมูลที่ท่านไม่ได้ให้ความยินยอม\n- ขอรับหรือขอให้ส่งหรือโอนข้อมูลส่วนบุคคลของท่านไปยังผู้ควบคุมข้อมูลรายอื่น\n- คัดค้านการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของท่าน\n- ขอให้ลบ ทำลาย หรือทำให้ข้อมูลไม่สามารถระบุตัวบุคคลได้\n- ขอให้ระงับการใช้ข้อมูลส่วนบุคคล\n- ขอให้แก้ไขข้อมูลส่วนบุคคลให้ถูกต้อง เป็นปัจจุบัน สมบูรณ์ และไม่ก่อให้เกิดความเข้าใจผิด\n- ถอนความยินยอมเมื่อใดก็ได้ ทั้งนี้ การถอนความยินยอมไม่กระทบต่อการประมวลผลที่ได้ดำเนินการไปแล้วก่อนการถอน\n- ร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.) หากเห็นว่าการประมวลผลข้อมูลของเราไม่เป็นไปตามกฎหมาย\n\nท่านสามารถใช้สิทธิได้โดยติดต่อเราตามช่องทางในข้อ 1 เราอาจขอข้อมูลเพื่อยืนยันตัวตนของท่านก่อนดำเนินการ และจะดำเนินการภายใน 30 วันนับแต่วันที่ได้รับคำขอ หากเราปฏิเสธคำขอ เราจะแจ้งเหตุผลให้ท่านทราบ\n\n## 8. คุกกี้และเทคโนโลยีที่คล้ายกัน\n\nบริการใช้คุกกี้และพื้นที่จัดเก็บในเบราว์เซอร์ ดังนี้\n\n- คุกกี้ที่จำเป็น: รักษาสถานะการเข้าสู่ระบบ จดจำตำแหน่งแผนที่ ตัวกรอง และการตั้งค่าคุกกี้ของท่าน ซึ่งจำเป็นต่อการทำงานของบริการ จึงไม่ต้องขอความยินยอม\n- คุกกี้เพื่อการวิเคราะห์ (Google Analytics): ใช้วัดสถิติการใช้งานแบบภาพรวม โดยจะทำงานเฉพาะเมื่อท่านเลือก “ยอมรับทั้งหมด” เท่านั้น\n\nนอกจากนี้ เรานับสถิติการเข้าชมด้วย Umami ซึ่งติดตั้งบนเซิร์ฟเวอร์ของโครงการ ไม่ใช้คุกกี้ และไม่เก็บข้อมูลที่ระบุตัวบุคคลได้\n\nท่านสามารถเปลี่ยนแปลงหรือถอนความยินยอมได้ทุกเมื่อผ่านปุ่มด้านล่าง หรือลบคุกกี้ผ่านการตั้งค่าเบราว์เซอร์\n\n[[cookie-settings]]\n\n## 9. การรักษาความมั่นคงปลอดภัย\n\nเรามีมาตรการรักษาความมั่นคงปลอดภัยทั้งด้านเทคนิคและการบริหารจัดการที่เหมาะสม เช่น การเข้ารหัสการรับส่งข้อมูล (HTTPS) การจำกัดสิทธิ์การเข้าถึงข้อมูลเฉพาะผู้ที่จำเป็น และการตรวจสอบข้อมูลก่อนเผยแพร่ เพื่อป้องกันการสูญหาย การเข้าถึง ใช้ เปลี่ยนแปลง แก้ไข หรือเปิดเผยข้อมูลโดยไม่ได้รับอนุญาต หากเกิดเหตุการละเมิดข้อมูลส่วนบุคคล เราจะแจ้งสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคลและท่านตามที่กฎหมายกำหนด\n\n## 10. ข้อมูลส่วนบุคคลของผู้เยาว์\n\nบริการไม่ได้มุ่งให้บริการแก่ผู้เยาว์ที่มีอายุต่ำกว่า 20 ปีบริบูรณ์ในการเพิ่มข้อมูลหรือส่งข้อมูลส่วนบุคคล หากผู้ใช้อำนาจปกครองพบว่าผู้เยาว์ได้ให้ข้อมูลส่วนบุคคลแก่เราโดยไม่ได้รับความยินยอม โปรดติดต่อเราเพื่อดำเนินการลบข้อมูล\n\n## 11. การเปลี่ยนแปลงนโยบาย\n\nเราอาจปรับปรุงนโยบายนี้เป็นครั้งคราว โดยจะประกาศฉบับปรับปรุงบนหน้านี้พร้อมวันที่มีผลบังคับใช้ หากมีการเปลี่ยนแปลงที่สำคัญ เราจะแจ้งให้ท่านทราบผ่านบริการ และขอความยินยอมใหม่ในกรณีที่กฎหมายกำหนด\n\n## 12. ติดต่อเรา\n\nหากมีคำถามเกี่ยวกับนโยบายนี้ หรือต้องการใช้สิทธิของท่าน โปรดติดต่อ\n\n- ผู้ให้บริการ: โครงการ ISSIE จุฬาลงกรณ์มหาวิทยาลัย\n- ที่อยู่: TODO: ที่อยู่สำหรับติดต่อ\n- อีเมล: TODO: อีเมลสำหรับติดต่อเรื่องข้อมูลส่วนบุคคล\n- โทรศัพท์: PHONE\n- เว็บไซต์: https://www.issie-chula.org',
      'en': ''
    }
  }
};
