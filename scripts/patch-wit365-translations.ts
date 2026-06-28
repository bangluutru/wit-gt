/**
 * Patch missing WiT365 translations into Firestore.
 * Translations generated using LLM with WiT Inner Dictionary terminology.
 *
 * Usage: npx tsx scripts/patch-wit365-translations.ts
 */

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || 'wit-gt';

// ── Translations ────────────────────────────────────────────
// Dictionary terms used (from Từ điển Nội tâm):
//   Nhân tốt = Good seeds | Duyên = Conditions | Quả = Outcomes/Fruits
//   Tâm thái = Inner state / Mentality | Trí tuệ = Wisdom
//   Nhận thức = Awareness | Nội tâm = Inner being
//   Trân trọng = Honoured | Biết ơn = Gratitude
//   Bố thí = Giving/Generosity | Phước Đức = Blessed virtues
//   Công Đức = Meritorious virtues | Đạo lý = Moral principles
//   Cảnh giới = Realm (of life) | Huân tập = Cultivation/Practice
//   Chân thật = Truth/Truthful | Quảng bá = Promote/Advocacy
//   Tụ chúng = Collective synergy | Tần số rung động = Vibration frequency
//   Hệ quy chiếu = Frame of reference | Khái niệm nguồn = Source concept
//   Nhân sinh = Human life/existence | Vũ trụ quan = Cosmic view
//   Giác ngộ = Enlightenment | Triệt ngộ = Complete realisation
//   Tàng thức = Store consciousness | Tổng nghiệp = Collective karma
//   Kiện toàn = Perfected/Complete | Ưu tú = Distinguished
//   Xuất chúng = Exceptional | Nhân cách = Character/Integrity
//   Phẩm chất = Quality/Virtue | Năng lực = Competency
//   Tánh = Nature (innate) | Tình = Sentiment/Emotion
//   Nghe-Thấy-Nói-Biết = Hearing-Seeing-Speaking-Knowing
//   Làm chủ = Self-mastery | Trưởng thành = Mature
//   Viên mãn = Complete contentment | Đồng thuận = Consensus
//   Cao nhân = Elevated person | Quý nhân = Noble helper
//   Nhân mạch = Key connector | Nhân tài = Talent
//   Minh Sư = Enlightened mentor | Thiện tri thức = Benevolent sage
//   Ước nguyện cuộc đời = Life's aspirations
//   Phò thịnh = Support prosperity | Phò suy = Support in decline
//   Tứ trọng ân = Fourfold gratitude

interface Translation {
  stt: number;
  enLiteral?: string;
  enNatural?: string;
}

const TRANSLATIONS: Translation[] = [
  // ── STT 71–100 ──────────────────────────────────────────
  {
    stt: 71,
    enLiteral: "Thinking without acting: Having seeds without fruits\nActing without thinking: Having fruits without seeds",
    enNatural: "Thought without action plants seeds that never bloom. Action without thought harvests fruits with no roots to sustain them.",
  },
  {
    stt: 72,
    enLiteral: "Inner state determines joy or suffering, way of thinking determines success or failure",
    enNatural: "Your inner state decides whether you experience joy or suffering; your way of thinking decides whether you achieve success or failure.",
  },
  {
    stt: 73,
    enLiteral: "7 Important Forms of Giving in Life:\nFace Giving\nEye Giving\nSpeech Giving\nHeart Giving\nRoom Giving\nBody Giving\nSeat Giving",
    enNatural: "Seven essential acts of generosity that shape a life:\nThe gift of a warm countenance\nThe gift of a kind gaze\nThe gift of uplifting words\nThe gift of a sincere heart\nThe gift of tolerance and space\nThe gift of compassionate action\nThe gift of humble presence",
  },
  {
    stt: 74,
    enLiteral: "A bright smile\nA word of praise\nA little care\nTravel the whole world",
    enNatural: "With a genuine smile, a sincere compliment, and a touch of care, you can traverse the entire world.",
  },
  {
    stt: 75,
    enLiteral: "A smile can change the destiny of a person, change the destiny of a profession, and change the destiny of a nation",
    enNatural: "A single smile carries the power to transform a life, reshape an industry, and redirect the course of a nation.",
  },
  {
    stt: 76,
    enLiteral: "In the future, men will not compare themselves by their careers, but by the happy smile of the woman beside them",
    enNatural: "In the future, a man's true measure will not be his career achievements, but the radiance of happiness on the face of the woman who walks beside him.",
  },
  {
    stt: 77,
    enLiteral: "Speech Giving:\nJoyfulness\nHope\nFaith\nWisdom\nPraise\nEncouragement\nAffirmation\nConstruction",
    enNatural: "The gift of speech encompasses eight treasures: joyfulness, hope, faith, wisdom, praise, encouragement, affirmation, and constructive guidance.",
  },
  {
    stt: 78,
    enLiteral: "All consensus originates from moral principles and righteous truth",
    enNatural: "True consensus is never forced—it arises naturally from moral principles and righteous truth.",
  },
  {
    stt: 79,
    enLiteral: "Heart Giving is the giving of honouring and gratitude",
    enNatural: "Heart Giving is the act of offering sincere honour and deep gratitude from within.",
  },
  {
    stt: 80,
    enLiteral: "Bestow kindness without seeking repayment",
    enNatural: "Give freely and wholeheartedly, never expecting anything in return.",
  },
  {
    stt: 81,
    enLiteral: "Room Giving is the giving of tolerance",
    enNatural: "Room Giving is the generous act of offering tolerance—creating space for others to be themselves.",
  },
  {
    stt: 82,
    enLiteral: "Body Giving is the giving of compassionate action",
    enNatural: "Body Giving is the expression of love through compassionate deeds and selfless service.",
  },
  {
    stt: 83,
    enLiteral: "4 recipients of Body Giving:\nThose who need us\nThose close to us\nThose who honour and are grateful\nThose who have been kind to us",
    enNatural: "Body Giving flows to four kinds of people: those who need our help, those closest to our hearts, those who embody honour and gratitude, and those whose kindness we are blessed to repay.",
  },
  {
    stt: 84,
    enLiteral: "Seat Giving is the simplest way to elevate the realm of life. Seat Giving is the pinnacle of giving",
    enNatural: "Seat Giving is the most humble yet most elevated form of generosity—a simple act that raises the realm of our entire life.",
  },
  {
    stt: 85,
    enLiteral: "Never deal with the problem, only deal with the belief",
    enNatural: "Don't try to fix the problem—transform the belief that created it.",
  },
  {
    stt: 86,
    enLiteral: "When blessed actions are accumulated sufficiently, the sprout of blessed destiny will emerge",
    enNatural: "When blessed virtues are cultivated patiently and abundantly, the seed of a blessed destiny sprouts forth on its own.",
  },
  {
    stt: 87,
    enLiteral: "Religion is purely about believing\nScience is purely about understanding\nMoral principles are purely about knowing",
    enNatural: "Religion rests on faith. Science rests on understanding. Moral principles rest on deep inner knowing.",
  },
  {
    stt: 88,
    enLiteral: "When there is self-belief and consensus among people, all dreams become reality",
    enNatural: "When inner faith meets the collective consensus of those around you, every dream has the power to manifest into reality.",
  },
  {
    stt: 89,
    enLiteral: "Receiving the truth within oneself is the first step of self-mastery in life",
    enNatural: "The journey of self-mastery begins the moment you embrace the truth that resides within yourself.",
  },
  {
    stt: 90,
    enLiteral: "Simple\nJoyful\nTrustful\nGentle",
    enNatural: "Four pillars of an enlightened life: simplicity, joyfulness, trust, and gentleness.",
  },
  {
    stt: 91,
    enLiteral: "The Frame of Reference of Moral Principles – Religion – Science:\n1. Triangle of Reality\n2. Structure of the Human Being\n3. Formula of Origin",
    enNatural: "The integrated frame of reference—Moral Principles, Religion, and Science—reveals three foundational truths: the Triangle of Reality, the Structure of the Human Being, and the Formula of Origin.",
  },
  {
    stt: 92,
    enLiteral: "All talent emerges from recognition",
    enNatural: "Every talent in this world first blossoms from the soil of recognition and acknowledgement.",
  },
  {
    stt: 93,
    enLiteral: "All complete contentment in success originates from a good environment",
    enNatural: "Lasting, fulfilling success always traces its roots back to a nurturing and wholesome environment.",
  },
  {
    stt: 94,
    enLiteral: "Recognition, gratitude, and advocacy are the keys that open every door of life",
    enNatural: "Recognition, gratitude, and advocacy—these three keys unlock every door that life can offer.",
  },
  {
    stt: 95,
    enLiteral: "Advocacy is repeatedly mentioning what others have done for us, things and events that bring benefit to us, with an attitude of honour and gratitude",
    enNatural: "True advocacy is the heartfelt practice of repeatedly acknowledging—with honour and gratitude—every person, every act, and every gift that has enriched our lives.",
  },
  {
    stt: 96,
    enLiteral: "8 Qualities of Talent:\nAdmitting mistakes\nChanging\nLearning capacity\nDedication\nShoulder responsibility\nHonouring – Gratitude\nPerseverance\nHumility",
    enNatural: "The eight hallmarks of true talent: the courage to admit mistakes, the will to change, the hunger to learn, the spirit to dedicate, the strength to shoulder responsibility, the heart of honour and gratitude, the resolve of perseverance, and the grace of humility.",
  },
  {
    stt: 97,
    enLiteral: "Truth is that which does not change through space and time",
    enNatural: "What is truly real remains unchanged—untouched by the passage of time and the shift of space.",
  },
  {
    stt: 98,
    enLiteral: "Sacrifice is doing something with hope for growth and development in the future",
    enNatural: "Sacrifice is not loss—it is an act of faith, planted with hope in the growth and flourishing of tomorrow.",
  },
  {
    stt: 99,
    enLiteral: "Rain is always there; the tree that has roots will naturally absorb it",
    enNatural: "Blessings rain down ceaselessly—only the tree with deep roots can drink them in.",
  },
  {
    stt: 100,
    enLiteral: "Blessed virtues are like a mountain of money; a single match can burn it all",
    enNatural: "Blessed virtues may tower like a mountain of wealth, yet a single careless spark can reduce them to ashes.",
  },
  {
    stt: 101,
    enLiteral: "Meritorious virtues are like a mountain of gold; hard to burn but easy to tarnish",
    enNatural: "Meritorious virtues stand like a mountain of gold—nearly impossible to destroy by fire, yet vulnerable to the slightest stain.",
  },
  {
    stt: 102,
    enLiteral: "When the vibration frequency of the observed object matches the vibration frequency of the observer, the observed object becomes material to the observer",
    enNatural: "When your inner vibration frequency aligns with that of what you observe, the invisible becomes visible and the intangible becomes real.",
  },
  {
    stt: 103,
    enLiteral: "The Eightfold Convergence of Conditions:\nMind – Nature – Sentiment – Earth – Water – Air – Fire – Electromagnetic",
    enNatural: "All existence arises from the convergence of eight fundamental conditions: Mind, Nature, Sentiment, Earth, Water, Air, Fire, and Electromagnetic force.",
  },
  {
    stt: 104,
    enLiteral: "3 Important things to start anything:\nHeart – Talent – Strength\nLong-lasting – Grand – Wholesome\nThe Triangle of Precepts",
    enNatural: "To begin any endeavour, three foundations must align: Heart, Talent, and Strength. The vision must be long-lasting, grand, and wholesome—forming the Triangle of Precepts.",
  },
  {
    stt: 105,
    enLiteral: "The bigger the heart, the bigger the stage",
    enNatural: "Your heart determines the size of your stage—expand your heart, and the world expands with you.",
  },
  {
    stt: 106,
    enLiteral: "Happiness is the inner state of contentment with what one currently has",
    enNatural: "Happiness is not found in having more—it is the inner state of being truly content with what you already possess.",
  },
  {
    stt: 107,
    enLiteral: "9 Golden Words in Marriage:\nLove\nIntimacy\nFinance\nShared concepts\nShared frequency\nShared vision\nShared language\nConsensus\nCompanionship",
    enNatural: "Nine golden threads that weave a lasting marriage: Love, Intimacy, Financial harmony, Shared concepts, Aligned frequency, Common vision, Unified language, Deep consensus, and Lifelong companionship.",
  },
  {
    stt: 108,
    enLiteral: "A successful person is someone whom others enjoy being near",
    enNatural: "True success is measured not by achievements alone, but by how many people find warmth and joy simply being in your presence.",
  },
  {
    stt: 109,
    enLiteral: "Maturity is the inner state of feeling that one's perspectives, social relationships, and expertise have surpassed what they were before.\nA mature person is one whose perspectives, social relationships, and expertise far exceed what is expected for their age.",
    enNatural: "Maturity is not about age—it is the inner knowing that your perspectives, relationships, and expertise have grown beyond what they once were. A truly mature person transcends the boundaries of their years.",
  },
  {
    stt: 110,
    enLiteral: "The value of things and phenomena grows when 'Nothing' is added",
    enNatural: "In the paradox of creation, it is the addition of 'emptiness' that allows the value of all things to multiply and expand.",
  },
  {
    stt: 111,
    enLiteral: "With the right perspective, correct inner state, and suitable competency, I simply achieve success",
    enNatural: "When your perspective is aligned, your inner state is balanced, and your competency matches the task—success flows simply and naturally.",
  },
  {
    stt: 112,
    enLiteral: "A good environment is one where people enjoy being near and immersing themselves in, an environment with 9 elements:\nJoyfulness\nHope\nFaith\nWisdom\nHonouring and Gratitude\nLove\nTolerance\nHumility\nTruthfulness",
    enNatural: "A truly good environment is one that draws people in and invites them to immerse fully. It radiates nine essential qualities: Joyfulness, Hope, Faith, Wisdom, Honour and Gratitude, Love, Tolerance, Humility, and Truthfulness.",
  },
  {
    stt: 113,
    enLiteral: "Successfully managing family\nSuccessfully managing career",
    enNatural: "The mark of a complete life: mastering both the art of family and the discipline of career.",
  },
  {
    stt: 114,
    enLiteral: "The business owner builds people\nPeople build the business",
    enNatural: "A visionary business owner invests in people, and in return, those people build a thriving business.",
  },
  {
    stt: 115,
    enLiteral: "Ten thousand people of the same language\nA thousand people of the same consensus\nA hundred people of the same journey",
    enNatural: "Let ten thousand speak the same language of purpose, a thousand reach consensus of heart, and a hundred walk the same path—together, they become unstoppable.",
  },
  {
    stt: 116,
    enLiteral: "Benefiting others and benefiting oneself — must absolutely do\nBenefiting others without harming oneself — reluctantly do\nBenefiting oneself while harming others — absolutely do not\nHarming oneself and harming others — never ever do",
    enNatural: "What benefits both others and yourself—pursue without hesitation.\nWhat benefits others without harming you—do willingly.\nWhat benefits you at others' expense—never pursue.\nWhat harms both you and others—refuse absolutely and forever.",
  },
  {
    stt: 117,
    enLiteral: "The person who places others' interests above their own, their words will carry influence, divine spirit, and divine power",
    enNatural: "When you place the interests of others above your own, your words become imbued with a power and influence that transcends the ordinary.",
  },
  {
    stt: 118,
    enLiteral: "A person with morality may not necessarily succeed, but a person with noble morality will certainly succeed",
    enNatural: "Morality alone does not guarantee success—but when morality rises to nobility, success becomes inevitable.",
  },
  {
    stt: 119,
    enLiteral: "Money earned is proportional to the quantity and quality of people we help.\nThe quantity and quality of people we deliver value to determines our quality of life, the value we create, and our realm of life.",
    enNatural: "Your wealth grows in direct proportion to the number and depth of lives you enrich. The more people you serve with genuine value, the higher your own quality of life, contribution, and realm of existence become.",
  },
  {
    stt: 120,
    enLiteral: "The greatest capital of humanity is people",
    enNatural: "People are the most valuable capital in existence—every great achievement begins with human connection.",
  },
  {
    stt: 121,
    enLiteral: "A person listens to another when they feel that their love for the other person is less than the love the other person has for them",
    enNatural: "We truly listen to someone only when we sense that their love for us exceeds our own love for them.",
  },
  {
    stt: 122,
    enLiteral: "Joyful peace activates consciousness karma\nTolerance activates conditional karma\nHonouring and gratitude activates fruit karma",
    enNatural: "Inner peace and joy awaken the karma of consciousness. Tolerance activates the karma of conditions. And honouring with gratitude ignites the karma of blessed outcomes.",
  },
  {
    stt: 123,
    enLiteral: "3 factors to unlock infinite personal value:\nInner state of joyful peace\nDistinguished qualities\nPerfected character",
    enNatural: "Three keys unlock the infinite potential within you: a joyful and peaceful inner state, distinguished qualities, and a perfected character.",
  },
  {
    stt: 124,
    enLiteral: "Human beings are machines of meritorious virtues and blessed virtues",
    enNatural: "Every human being is a living engine—designed to generate meritorious virtues and blessed virtues endlessly.",
  },
  {
    stt: 125,
    enLiteral: "People are our teachers",
    enNatural: "Every person who crosses our path carries a lesson worth learning—each one is a teacher in disguise.",
  },
  {
    stt: 126,
    enLiteral: "People are either a road or a bridge.\nIf a road, they walk alongside us; if a bridge, they carry us across to the other side.",
    enNatural: "Every person in our lives serves a purpose: some are roads who journey with us side by side, and others are bridges who carry us safely to where we need to be.",
  },
  {
    stt: 127,
    enLiteral: "When the form is clear, it is the fruit",
    enNatural: "When something becomes clearly visible and tangible, it has already manifested as the fruit of past seeds.",
  },
  {
    stt: 128,
    enLiteral: "Support in prosperity — Support in decline",
    enNatural: "True loyalty reveals itself not only in supporting others when they prosper, but especially in standing beside them when they fall.",
  },
  {
    stt: 129,
    enLiteral: "An elevated person is one who gives us a perspective, a lesson, or an understanding that raises our awareness above the problems that arise",
    enNatural: "An elevated person gifts us a single perspective, lesson, or insight so powerful that our awareness rises above every challenge that appears.",
  },
  {
    stt: 130,
    enLiteral: "A noble helper is a person who helps us in a certain aspect or period of life. There are:\nGreat Noble Helper: helps in all aspects of life\nModerate Noble Helper: helps in a large part of life\nSmall Noble Helper: helps in a small part of life",
    enNatural: "Noble helpers appear in three forms: the Great Noble Helper who uplifts every dimension of your life, the Moderate Noble Helper who supports a significant chapter, and the Small Noble Helper who blesses a single moment—each one equally precious.",
  },
  {
    stt: 131,
    enLiteral: "A key connector is a person who holds a pivotal role in their network of relationships; who possesses a prestigious, quality social network; whose voice carries weight",
    enNatural: "A key connector is someone whose voice resonates through a vast, respected network—a person whose presence alone opens doors and creates bridges between worlds.",
  },
  {
    stt: 132,
    enLiteral: "Gather enough resources to assemble people\nHave enough generosity to accommodate people\nHave enough humility to win people over\nBe ahead enough to lead people",
    enNatural: "To lead, master these four: gather the resources to attract people, cultivate the generosity to embrace them, embody the humility to earn their loyalty, and walk ahead to guide their path.",
  },
  {
    stt: 133,
    enLiteral: "Talent is a person who shoulders a certain aspect of our life (the volume of work shouldered, the duration of shouldering, the period of shouldering)",
    enNatural: "A true talent is someone who willingly shoulders a dimension of your life—be it the weight of work, the passage of time, or the demands of a crucial chapter.",
  },
  {
    stt: 134,
    enLiteral: "A wealth-bringer is a person whose presence multiplies what we desire",
    enNatural: "A wealth-bringer is someone whose very presence acts as a multiplier—amplifying everything you aspire to achieve.",
  },
  {
    stt: 135,
    enLiteral: "An enlightened mentor is one whose dream encompasses our dream.\nOne whose wisdom, inner state, character, qualities, competency, or realm of life is distinctly and vastly different from ours in the direction we aspire toward.\nAnd who agrees to nurture and journey alongside us.",
    enNatural: "An enlightened mentor holds a dream so vast it embraces your own. Their wisdom, character, and realm of life stand at a level you aspire to reach—and yet, with grace, they agree to walk beside you and nurture your growth.",
  },
  {
    stt: 136,
    enLiteral: "An expert refers to a person trained in depth, with practical work experience and specialised skills, deep theoretical and practical knowledge in a specific field, or whose understanding surpasses the general level of knowledge.\nSimply understood: An expert is a person who gives us the mindset to simplify every problem.",
    enNatural: "An expert is not merely someone with deep specialised knowledge—above all, an expert is one who gives you the power to simplify the complex and see clarity where others see confusion.",
  },
  {
    stt: 137,
    enLiteral: "A Teacher is one who produces well, manages business skilfully, and educates excellently in one or many fields.\nOne who can speak it, do it, and teach it.\nOne whose contact makes others listen, believe, follow, and spread the message.",
    enNatural: "A true Teacher embodies three mastery: excellence in creation, skill in leadership, and brilliance in education. They speak what they live, live what they teach, and inspire others to listen, believe, act, and pass on the flame.",
  },
  {
    stt: 138,
    enLiteral: "A benevolent sage is one who desires to bring knowledge to humanity without seeking repayment. One who opens wisdom, helps people achieve enlightenment, and leads to complete realisation.\nThere are:\nBenevolent sage of human life view\nBenevolent sage of world view\nBenevolent sage of cosmic view",
    enNatural: "A benevolent sage lives to illuminate humanity with knowledge, expecting nothing in return. They open the gates of wisdom, guide souls toward enlightenment, and lead them to complete realisation—whether through the lens of human life, the breadth of the world, or the vastness of the cosmos.",
  },
  {
    stt: 139,
    enLiteral: "By helping others achieve their life's aspirations, I elevate my realm of life",
    enNatural: "When you devote yourself to helping others fulfil their life's aspirations, your own realm of life naturally ascends to a higher plane.",
  },
  {
    stt: 140,
    enLiteral: "TIME\nTime is essentially the change in vibration frequency to experience different positions in space.\n\nTime is not fixed; it depends on our vibration frequency.\nThe perception of time depends on vibration frequency: high frequency makes time feel fast, low frequency makes time feel slow.\nA person with high vibration frequency creates greater time value.",
    enNatural: "Time is not a fixed river flowing at one speed. It is the shift of vibration frequencies through different positions in space. When your energy vibrates at a high frequency, time accelerates and you create extraordinary value within each moment.",
  },
  {
    stt: 141,
    enLiteral: "There is no perfect individual, only a perfect collective.\nThere is no outstanding individual, only an outstanding collective.\nThere is no exceptional individual, only an exceptional collective.",
    enNatural: "No single person can be perfect, outstanding, or exceptional alone. It is only through the collective—the synergy of many hearts united—that perfection, excellence, and greatness truly emerge.",
  },
  {
    stt: 142,
    enLiteral: "Distinguished wisdom is a group of people sharing the same thoughts and actions. At a deeper level, it is a group sharing the same perspectives and the same goals.",
    enNatural: "Distinguished wisdom is not a solo achievement—it is the collective brilliance of a group united in shared perspectives, aligned actions, and a common purpose.",
  },
  {
    stt: 143,
    enLiteral: "Self-belief\nConsensus among people\nAll dreams become reality",
    enNatural: "Three steps to manifest any vision: cultivate unwavering self-belief, build genuine consensus among people, and watch as every dream transforms into reality.",
  },
  {
    stt: 144,
    enLiteral: "The inner state of the very beginning",
    enNatural: "Return to the pure, untouched inner state of the very beginning—where all things are still possible.",
  },
  {
    stt: 145,
    enLiteral: "The Three Great Treasures:\nAdvocacy\nCollaboration\nLeadership",
    enNatural: "Three great treasures empower every endeavour: Advocacy to amplify, Collaboration to multiply, and Leadership to guide.",
  },
  {
    stt: 146,
    enLiteral: "To have form, cultivate through practice.\nTo make form clear, advocate.",
    enNatural: "Cultivation through practice gives shape to your vision. Advocacy makes that vision visible to the world.",
  },
  {
    stt: 147,
    enLiteral: "The philosophy of root-level education guides human growth to its ultimate fulfilment—the 7 Comprehensive Riches: Rich in Wisdom, Rich in Inner State, Rich in Character, Rich in Quality, Rich in Competency, Rich in Physical Health, Rich in Material Wealth.",
    enNatural: "Root-level education aspires to the fullest human flourishing: seven dimensions of comprehensive richness—Wisdom, Inner State, Character, Quality, Competency, Physical Health, and Material Wealth.",
  },
  {
    stt: 148,
    enLiteral: "Portrait of Root-Level Education Philosophy:\nScholarly Wisdom\nJoyful and Peaceful Inner State\nPerfected Character\nDistinguished Qualities\nExceptional Competency\nModel Physique\nIron Health\nExtraordinary Advocacy\nWise Communication\nIron Self-Discipline\nPenetrating Vision\nDeep Understanding of Human Life\nUniversal Love Leading the Collective\nVirtuous Conduct Across the World\nSixfold Great Fortune\nSuccessful Human Being",
    enNatural: "The portrait of Root-Level Education paints sixteen dimensions of human mastery: from scholarly wisdom and joyful inner peace, through perfected character and exceptional competency, to wise communication, penetrating vision, and ultimately—becoming a successful and complete human being.",
  },
  {
    stt: 149,
    enLiteral: "The All-Capable Leader",
    enNatural: "The All-Capable Leader—one who integrates wisdom, heart, and action to lead across every dimension of life.",
  },
  {
    stt: 150,
    enLiteral: "Give yourself the chance to understand others, and they will understand you.\nHelp others understand themselves, and you will understand yourself even more.",
    enNatural: "When you open yourself to truly understand others, understanding flows back to you. And in helping others see themselves clearly, you discover depths within yourself you never knew existed.",
  },
  {
    stt: 151,
    enLiteral: "All desires become clear when helping others see through Seeds – Conditions – Fruits",
    enNatural: "Your own deepest desires crystallise and become clear the moment you help another person see through the chain of Seeds, Conditions, and Fruits.",
  },
  {
    stt: 152,
    enLiteral: "Teaching courage makes courage appear.\nTeaching market makes market appear.\nTeaching wealth makes wealth appear.",
    enNatural: "Teach courage, and courage manifests. Teach about the market, and opportunities appear. Teach about wealth, and abundance follows.",
  },
  {
    stt: 153,
    enLiteral: "Doubts aligned with desires",
    enNatural: "When your questions flow in the same direction as your aspirations, every doubt becomes a stepping stone toward what you truly want.",
  },
  {
    stt: 154,
    enLiteral: "Acceleration is a source concept in the RECEIVE & TRANSFORM reality education method.\nIt refers to a person who is ISOLATED FROM CONTEXT to be able to WHOLEHEARTEDLY receive and transform a certain reality.\nIt is a concept referring to a person who devotes their MIND & TIME as much as possible to what they desire.",
    enNatural: "Acceleration is the art of total immersion: stepping away from distractions to devote your entire mind and time to receiving and transforming reality. When context is stripped away, transformation becomes exponential.",
  },
  {
    stt: 155,
    enLiteral: "The Extraordinary Leader",
    enNatural: "The Extraordinary Leader—one who transcends the ordinary to inspire and elevate all who follow.",
  },
  {
    stt: 156,
    enLiteral: "Collective synergy is a group of people sharing the same frame of reference, source concepts, and vibration frequency",
    enNatural: "Collective synergy emerges when a group of individuals unite around the same frame of reference, shared source concepts, and a harmonised vibration frequency.",
  },
  {
    stt: 157,
    enLiteral: "An enduring organisation takes the 4 survival drives as its foundation, takes the transformation and maturity of people as its guiding principle, and takes the realm of cultural life as its purpose",
    enNatural: "An enduring organisation is built on four survival drives, guided by the transformation and maturity of its people, and directed toward creating a realm of cultural life that outlasts generations.",
  },
  {
    stt: 158,
    enLiteral: "Formula for developing an expert community: 1-2-20-500-10000",
    enNatural: "The growth formula for an expert community follows a natural progression: from 1 to 2, to 20, to 500, to 10,000—each stage amplifying collective impact exponentially.",
  },
  {
    stt: 159,
    enLiteral: "8 Qualities of Talent:\nAdmitting mistakes\nChanging\nLearning capacity\nPerseverance\nDedication\nShoulder responsibility\nHonouring – Gratitude\nHumility",
    enNatural: "Eight qualities define true talent: the humility to admit mistakes, the courage to change, the hunger to learn, the resolve to persevere, the spirit to dedicate, the strength to shoulder responsibility, the heart of honour and gratitude, and the grace of humility.",
  },
  {
    stt: 160,
    enLiteral: "A comprehensively rich person possesses the competency to advocate for themselves, their family, their organisation, and society.\nA comprehensively rich person knows how to use money and give money to de-materialise themselves, their family, their organisation, and society.",
    enNatural: "Comprehensive richness is the ability to advocate powerfully for yourself, your family, your organisation, and society at large—and the wisdom to use wealth not merely for accumulation, but for the transcendence and elevation of all.",
  },
  {
    stt: 161,
    enLiteral: "Fulfilled within, abundant without",
    enNatural: "When the inner world is fulfilled and complete, the outer world naturally becomes abundant and overflowing.",
  },
  {
    stt: 162,
    enLiteral: "A standard frame of reference is one that helps us simply develop beneficial source concepts",
    enNatural: "A standard frame of reference is the lens through which we effortlessly develop source concepts that serve our growth and benefit.",
  },
  {
    stt: 163,
    enLiteral: "A comprehensively rich person knows how to use money and give money to optimise tools for creating value for themselves, their family, their organisation, and society",
    enNatural: "The comprehensively rich person masters the art of channelling wealth—both in use and in giving—to optimise every tool that creates value for self, family, organisation, and the world.",
  },
  {
    stt: 164,
    enLiteral: "Everything is created by the mind alone",
    enNatural: "All of reality originates from within—everything is created by the mind alone.",
  },
  {
    stt: 165,
    enLiteral: "Care from top to bottom",
    enNatural: "True care flows from the highest to the most humble, leaving no one behind.",
  },
  {
    stt: 166,
    enLiteral: "When you are someone, you cannot be anyone else.\nWhen you are no one, you can become anyone.",
    enNatural: "When you cling to being someone, your possibilities narrow. When you release the need to be anyone, you gain the freedom to become anything.",
  },
  {
    stt: 167,
    enLiteral: "3 Groups of People in Society:\nProduction\nBusiness\nEducation",
    enNatural: "Society is composed of three fundamental groups: those who produce, those who trade, and those who educate—each indispensable to the whole.",
  },
  {
    stt: 168,
    enLiteral: "Money in society exists to serve human life, so the flow of money will shift toward those who thoroughly understand human life and use money meaningfully for the survival and development of people",
    enNatural: "Society's wealth exists to serve humanity. The flow of money naturally gravitates toward those who deeply understand human life and deploy resources meaningfully for the survival and flourishing of people.",
  },
  {
    stt: 169,
    enLiteral: "Rich but not learning, the richness will not last. Poor but not learning, the poverty will be boundless!",
    enNatural: "Wealth without learning is wealth that fades. Poverty without learning is poverty without end.",
  },
  {
    stt: 170,
    enLiteral: "When inner belief and conscious desire oppose each other, inner belief always wins",
    enNatural: "Whenever your deep inner belief and your conscious desire are in conflict, the inner belief—operating beneath awareness—will always prevail.",
  },
  {
    stt: 171,
    enLiteral: "Money projects the inner being of a person",
    enNatural: "Your relationship with money is a mirror—it reflects the landscape of your inner being.",
  },
  {
    stt: 172,
    enLiteral: "Money is a tool and means to achieve what is desired",
    enNatural: "Money is never the destination—it is the vehicle and tool that carries you toward what you truly desire.",
  },
  {
    stt: 173,
    enLiteral: "Money helps multiply what is already present",
    enNatural: "Money amplifies what already exists within you—whether abundance or scarcity, it multiplies what you already carry.",
  },
  {
    stt: 174,
    enLiteral: "Money needs to generate interest and create value",
    enNatural: "Money must be set in motion—it exists to generate returns and create lasting value.",
  },
  {
    stt: 175,
    enLiteral: "Money earned is directly proportional to the quantity and quality of people one helps",
    enNatural: "The wealth you attract is a direct reflection of how many lives you touch and how deeply you serve them.",
  },
  {
    stt: 176,
    enLiteral: "Money gathers to those who have a plan to spend money meaningfully",
    enNatural: "Wealth flows naturally toward those who possess a clear and meaningful plan for how it will be used.",
  },
  {
    stt: 177,
    enLiteral: "Vision determines competency; a plan for meaningful spending determines the ability to attract money",
    enNatural: "Your vision defines the scope of your competency. Your plan for purposeful spending defines your magnetic power to attract wealth.",
  },
  {
    stt: 178,
    enLiteral: "The quantity and quality of people one helps is directly proportional to the quality and value of one's life",
    enNatural: "The richness of your life is measured precisely by how many people you uplift and the depth of the impact you make on them.",
  },
  {
    stt: 179,
    enLiteral: "Nothing is more persuasive than a message repeated again and again",
    enNatural: "The most powerful form of persuasion is a truth spoken not once, but echoed again and again until it takes root in the heart.",
  },
  {
    stt: 180,
    enLiteral: "People are precious capital",
    enNatural: "Of all the treasures in the world, none is more valuable than people.",
  },
  {
    stt: 181,
    enLiteral: "The wisest investment is investing in oneself",
    enNatural: "The highest-yielding investment you will ever make is the investment you make in yourself.",
  },
  {
    stt: 182,
    enLiteral: "Use the long-term to nurture the short-term",
    enNatural: "The wise use long-term vision and patience to sustain and nourish their short-term needs.",
  },
  {
    stt: 183,
    enLiteral: "Finance represents the wisdom of labour, the effort of labour, and the time of labour",
    enNatural: "Every unit of wealth represents three inseparable things: the wisdom invested, the effort exerted, and the time committed in labour.",
  },
  {
    stt: 184,
    enLiteral: "The root of finance originates from one's Hearing – Seeing – Speaking – Knowing about money",
    enNatural: "Your financial reality is rooted in how you hear, see, speak, and know about money—change these foundations, and your entire financial world transforms.",
  },
  {
    stt: 185,
    enLiteral: "Only by honouring can one possess. Only by gratitude can things last eternally.",
    enNatural: "What you honour, you come to possess. What you receive with gratitude endures for all eternity.",
  },
  {
    stt: 186,
    enLiteral: "People help us elevate our realm of life",
    enNatural: "Every meaningful connection with another human being becomes a doorway to elevating your realm of life.",
  },
  {
    stt: 187,
    enLiteral: "The capital of people is people. Where there are people, there is money.",
    enNatural: "The greatest capital you can ever accumulate is people. Where human connection thrives, abundance follows.",
  },
  {
    stt: 188,
    enLiteral: "Compound interest is the 8th wonder of the world",
    enNatural: "Compound interest—whether in finance, knowledge, or relationships—is the eighth wonder of the world.",
  },
  {
    stt: 189,
    enLiteral: "5 Financial Intelligence Indicators:\n1. Ability to attract money\n2. Ability to keep money\n3. Plan for meaningful spending\n4. Financial mindset\n5. Knowing how to leverage",
    enNatural: "Five pillars of financial intelligence: the magnetism to attract wealth, the discipline to preserve it, the wisdom to spend meaningfully, the mindset to think strategically, and the skill to leverage the strengths of others.",
  },
  {
    stt: 190,
    enLiteral: "A beautiful woman is like a precious gem; a wise woman is like a treasure",
    enNatural: "Beauty makes a woman shine like a precious gem; wisdom makes her invaluable like a treasure beyond measure.",
  },
  {
    stt: 191,
    enLiteral: "To receive the love of others, one must first know how to love oneself",
    enNatural: "Before the world can love you, you must first learn the art of loving yourself.",
  },
  {
    stt: 192,
    enLiteral: "Beauty needs maintenance",
    enNatural: "Beauty is not a gift to be taken for granted—it is a garden that requires constant and loving care.",
  },
  {
    stt: 193,
    enLiteral: "There is no ugly woman, only a woman who does not know how to beautify herself",
    enNatural: "No woman is without beauty—there are only those who have not yet discovered the art of revealing the beauty that lies within.",
  },
  {
    stt: 194,
    enLiteral: "Naturally beautiful, but not beautiful naturally",
    enNatural: "True beauty appears effortless, yet behind every radiance lies intentional cultivation and care.",
  },
  {
    stt: 195,
    enLiteral: "3 Forms of Independence that bring happiness to women:\n1. Independence in thought\n2. Independence in career\n3. Independence in finance",
    enNatural: "Three pillars of independence empower a woman's happiness: freedom of thought, mastery of her career, and command of her finances.",
  },
  {
    stt: 196,
    enLiteral: "Beauty is the key to greater happiness",
    enNatural: "Beauty—both inner and outer—is a key that opens the door to a fuller, more joyful life.",
  },
  {
    stt: 197,
    enLiteral: "Know how to beautify yourself — beautiful for a lifetime",
    enNatural: "When you master the art of beautifying yourself, beauty becomes not a fleeting moment but a lifelong companion.",
  },
  {
    stt: 198,
    enLiteral: "Beauty is 8 parts inner — 2 parts outer",
    enNatural: "True beauty is eight parts inner radiance and only two parts outward appearance.",
  },
  {
    stt: 199,
    enLiteral: "Mindset is the process of cultivating Hearing – Seeing – Speaking – Knowing through the layers of nature and sentiment of a person, stored as mental images and source concepts within the store consciousness, influenced by collective karma and meritorious virtues – blessed virtues",
    enNatural: "Your mindset is the cumulative product of everything you have heard, seen, spoken, and come to know—filtered through your innate nature and sentiments, stored as mental images and source concepts in your deepest consciousness, and shaped by your collective karma, meritorious virtues, and blessed virtues.",
  },

  // ── STT 281, 297, 298, 324, 339, 348 (missing enNatural only) ──
  {
    stt: 281,
    enNatural: "When you learn for the sake of one person, you master a single point. When you learn for the sake of thousands, you master a universe of knowledge.",
  },
  {
    stt: 297,
    enNatural: "The gift of one's gaze unfolds across three dimensions: at the first level, your eyes simply acknowledge another human being; at the second, they reflect the beauty and potential you see within them; and at the third, they mirror the ongoing transformation of their soul.",
  },
  {
    stt: 298,
    enNatural: "End each day by reflecting on three essentials: the lesson you learned, the insight that moved you deeply, and the realisation that awakened something new within you.",
  },
  {
    stt: 324,
    enNatural: "If your character has not yet matured into success, any achievement in work is merely temporary. But once your character embodies success, any setback in work is also only temporary.",
  },
  {
    stt: 339,
    enNatural: "Integrity is the alignment of three forces: thinking what you truly desire, speaking what you genuinely think, and doing what you have promised to do.",
  },
  {
    stt: 348,
    enNatural: "Four universal principles govern life, education, and business alike: Attraction draws the right elements together, Influence shapes direction, Value creates substance, and Transformation ensures evolution.",
  },

  // ── STT 351 (missing enLiteral only) ──
  {
    stt: 351,
    enLiteral: "Self-mastery is being proactive and taking responsibility",
  },

  // ── STT 355 (missing enNatural only) ──
  {
    stt: 355,
    enNatural: "To give generously and have someone gratefully receive—that itself is a form of blessed fortune.",
  },
];

// ── Main ─────────────────────────────────────────────────────
async function main() {
  console.log('🔧 Initializing Firebase Admin...');

  try {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID || PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      initializeApp({
        credential: applicationDefault(),
        projectId: PROJECT_ID,
      });
    }
  } catch (err) {
    console.error('❌ Failed to initialize Firebase:', err);
    process.exit(1);
  }

  const db = getFirestore();
  const COLLECTION = 'wit365_quotes';
  const BATCH_LIMIT = 400;

  console.log(`📝 Patching ${TRANSLATIONS.length} translations...`);

  let batch = db.batch();
  let batchCount = 0;
  let totalPatched = 0;

  for (const t of TRANSLATIONS) {
    const docId = `wit365-${String(t.stt).padStart(3, '0')}`;
    const ref = db.collection(COLLECTION).doc(docId);

    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (t.enLiteral !== undefined) updateData.enLiteral = t.enLiteral;
    if (t.enNatural !== undefined) updateData.enNatural = t.enNatural;

    batch.update(ref, updateData);
    batchCount++;
    totalPatched++;

    if (batchCount >= BATCH_LIMIT) {
      console.log(`  📤 Committing batch (${totalPatched - batchCount + 1}–${totalPatched})...`);
      await batch.commit();
      batchCount = 0;
      batch = db.batch();
    }
  }

  if (batchCount > 0) {
    console.log(`  📤 Committing final batch (${totalPatched - batchCount + 1}–${totalPatched})...`);
    await batch.commit();
  }

  console.log(`\n🎉 Patched ${totalPatched} translations in "${COLLECTION}".`);

  // Sample
  console.log('\n📋 Sample patches:');
  for (const t of TRANSLATIONS.slice(0, 3)) {
    console.log(`  • #${t.stt}: enLiteral=${(t.enLiteral || '(kept)').slice(0, 60)}...`);
  }
}

main().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
