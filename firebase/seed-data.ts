/**
 * WiT Platform - Seed Data Script
 *
 * Run this script to populate Firestore with sample data.
 * Usage: npx ts-node --esm firebase/seed-data.ts
 *
 * Requires: VITE_FIREBASE_* env vars set in .env.local
 * Or run directly in browser console via the Admin Import page.
 */

// ============================================================
// Chapters (9 total)
// ============================================================
export const SEED_CHAPTERS = [
  {
    id: 'ch-01',
    orderIndex: 1,
    titleVi: 'Khởi nguyên nhận thức',
    titleEn: 'Origins of Awareness',
    titleJp: '認知の起源',
    descriptionVi: 'Khám phá nguồn gốc và bản chất của nhận thức con người',
    descriptionEn: 'Explore the origins and nature of human awareness',
    descriptionJp: '人間の認知の起源と本質を探求する',
  },
  {
    id: 'ch-02',
    orderIndex: 2,
    titleVi: 'Nội tâm và nhận thức',
    titleEn: 'Inner Self and Awareness',
    titleJp: '内面と認知',
    descriptionVi: 'Hiểu về thế giới nội tâm và cách nhận thức định hình cuộc sống',
    descriptionEn: 'Understanding the inner world and how awareness shapes life',
    descriptionJp: '内面世界と認知が生活を形作る方法を理解する',
  },
  {
    id: 'ch-03',
    orderIndex: 3,
    titleVi: 'Trí tuệ – Tâm thái – Nhân cách',
    titleEn: 'Intelligence – Mindset – Character',
    titleJp: '知性 – マインドセット – 人格',
    descriptionVi: 'Phát triển trí tuệ, tâm thái và nhân cách toàn diện',
    descriptionEn: 'Developing intelligence, mindset and character holistically',
    descriptionJp: '知性、マインドセット、人格を総合的に発展させる',
  },
  {
    id: 'ch-04',
    orderIndex: 4,
    titleVi: 'Phẩm chất – Năng lực – Thể chất',
    titleEn: 'Qualities – Abilities – Physicality',
    titleJp: '品質 – 能力 – 身体',
    descriptionVi: 'Rèn luyện phẩm chất, năng lực và sức khoẻ',
    descriptionEn: 'Cultivating qualities, abilities and physical health',
    descriptionJp: '品質、能力、身体の健康を養う',
  },
  {
    id: 'ch-05',
    orderIndex: 5,
    titleVi: 'Tài chính – Kinh doanh – Đầu tư',
    titleEn: 'Finance – Business – Investment',
    titleJp: '財務 – ビジネス – 投資',
    descriptionVi: 'Hiểu về tài chính, kinh doanh và đầu tư thông minh',
    descriptionEn: 'Understanding finance, business and smart investing',
    descriptionJp: '財務、ビジネス、賢明な投資を理解する',
  },
  {
    id: 'ch-06',
    orderIndex: 6,
    titleVi: 'Mối quan hệ – Con người',
    titleEn: 'Relationships – Humanity',
    titleJp: '人間関係 – 人間性',
    descriptionVi: 'Xây dựng và nuôi dưỡng các mối quan hệ ý nghĩa',
    descriptionEn: 'Building and nurturing meaningful relationships',
    descriptionJp: '意味のある人間関係を築き育む',
  },
  {
    id: 'ch-07',
    orderIndex: 7,
    titleVi: 'Quy luật – Nguyên lý – Chìa khóa',
    titleEn: 'Laws – Principles – Keys',
    titleJp: '法則 – 原理 – 鍵',
    descriptionVi: 'Khám phá các quy luật và nguyên lý nền tảng của cuộc sống',
    descriptionEn: 'Discovering the fundamental laws and principles of life',
    descriptionJp: '人生の根本的な法則と原理を発見する',
  },
  {
    id: 'ch-08',
    orderIndex: 8,
    titleVi: 'Công thức – Phương pháp – Mật mã',
    titleEn: 'Formulas – Methods – Codes',
    titleJp: '公式 – 方法 – コード',
    descriptionVi: 'Ứng dụng công thức và phương pháp vào thực tiễn',
    descriptionEn: 'Applying formulas and methods to practice',
    descriptionJp: '公式と方法を実践に適用する',
  },
  {
    id: 'ch-09',
    orderIndex: 9,
    titleVi: 'Giáo dục tận gốc – Di sản',
    titleEn: 'Root Education – Legacy',
    titleJp: '根本教育 – 遺産',
    descriptionVi: 'Giáo dục tận gốc và để lại di sản bền vững',
    descriptionEn: 'Root education and leaving a lasting legacy',
    descriptionJp: '根本教育と持続的な遺産を残す',
  },
];

// ============================================================
// Lessons (first 10)
// ============================================================
export const SEED_LESSONS = [
  {
    id: 'lesson-01',
    lessonNo: 1,
    chapterId: 'ch-01',
    titleVi: 'Nhận thức là gì?',
    titleEn: 'What is Awareness?',
    titleJp: '認知とは何か？',
    summaryVi: 'Tìm hiểu khái niệm cơ bản về nhận thức – nền tảng của mọi sự thay đổi và phát triển.',
    summaryEn: 'Understand the fundamental concept of awareness – the foundation of all change and growth.',
    summaryJp: '認知の基本概念を理解する — すべての変化と成長の基盤。',
    contentVi: `# Nhận thức là gì?

## Mở đầu

Nhận thức là khả năng của con người nhìn nhận, hiểu biết và đánh giá thế giới xung quanh cũng như chính bản thân mình. Đây là nền tảng của mọi sự thay đổi, vì **chỉ khi nhận thức được, con người mới có thể hành động đúng đắn**.

> "Nhận thức là ánh sáng đầu tiên soi rọi con đường phía trước." — WiT

## Các cấp độ nhận thức

1. **Nhận thức cảm tính**: Nhận biết qua giác quan — nhìn, nghe, chạm, nếm, ngửi.
2. **Nhận thức lý tính**: Phân tích, tổng hợp, trừu tượng hóa thông tin.
3. **Nhận thức siêu nhận thức** (metacognition): Nhận thức về chính quá trình nhận thức của mình.

## Tại sao nhận thức quan trọng?

- Nhận thức giúp con người **tự đánh giá** bản thân một cách khách quan.
- Nhận thức là bước đầu tiên để **thay đổi hành vi** và tư duy.
- Không có nhận thức, con người sống theo **quán tính** và **thói quen** vô thức.

## Bài tập suy ngẫm

Hãy dành 5 phút suy nghĩ:
- Bạn đang nhận thức được điều gì về bản thân mình?
- Có điều gì bạn chưa bao giờ dừng lại để suy ngẫm?

---

*"Đi chậm, đi chắc, đi đến tận gốc."*`,
    contentEn: `# What is Awareness?

## Introduction

Awareness is the human ability to perceive, understand, and evaluate the world around us as well as ourselves. It is the foundation of all change, because **only when we are aware can we act wisely**.

> "Awareness is the first light illuminating the path ahead." — WiT

## Levels of Awareness

1. **Sensory awareness**: Perceiving through senses — sight, hearing, touch, taste, smell.
2. **Rational awareness**: Analyzing, synthesizing, and abstracting information.
3. **Metacognition**: Being aware of one's own thinking processes.

## Why is Awareness Important?

- Awareness helps us **evaluate ourselves** objectively.
- Awareness is the first step to **changing behavior** and thinking.
- Without awareness, people live by **inertia** and unconscious **habits**.

## Reflection Exercise

Take 5 minutes to think:
- What are you currently aware of about yourself?
- Is there something you've never stopped to reflect on?

---

*"Go slow, go steady, go to the root."*`,
    contentJp: `# 認知とは何か？

## はじめに

認知とは、自分自身や周囲の世界を認識し、理解し、評価する人間の能力です。**認知があってこそ、正しく行動できる** — これがすべての変化の基盤です。

> 「認知は道を照らす最初の光である。」— WiT

## 認知のレベル

1. **感覚的認知**: 五感を通じた認識 — 視覚、聴覚、触覚、味覚、嗅覚。
2. **理性的認知**: 情報の分析、統合、抽象化。
3. **メタ認知**: 自分自身の思考プロセスへの認知。

## なぜ認知が重要か？

- 認知は自分自身を **客観的に評価** する助けとなる。
- 認知は **行動と思考を変える** 第一歩である。
- 認知がなければ、人は **慣性** と無意識の **習慣** で生きる。

## 振り返りの演習

5分間考えてみてください：
- 今、自分自身について何を認知していますか？
- 振り返ったことのないことはありますか？

---

*「ゆっくり、確実に、根本まで。」*`,
    status: 'published',
  },
  {
    id: 'lesson-02',
    lessonNo: 2,
    chapterId: 'ch-01',
    titleVi: 'Bản chất của tư duy',
    titleEn: 'The Nature of Thinking',
    titleJp: '思考の本質',
    summaryVi: 'Khám phá cách tư duy hoạt động và ảnh hưởng đến cuộc sống hàng ngày.',
    summaryEn: 'Discover how thinking works and impacts daily life.',
    summaryJp: '思考の仕組みと日常生活への影響を発見する。',
    contentVi: `# Bản chất của tư duy

## Tư duy là gì?

Tư duy là quá trình xử lý thông tin của não bộ, bao gồm **suy nghĩ**, **phân tích**, **đánh giá** và **ra quyết định**. Tư duy không chỉ là hoạt động trí tuệ mà còn chịu ảnh hưởng sâu sắc từ cảm xúc và trải nghiệm.

> "Chất lượng tư duy quyết định chất lượng cuộc sống." — WiT

## Các loại tư duy

- **Tư duy phản biện**: Đặt câu hỏi, kiểm chứng, không chấp nhận vô điều kiện.
- **Tư duy sáng tạo**: Tìm ra cách giải quyết mới, kết nối ý tưởng độc đáo.
- **Tư duy hệ thống**: Nhìn nhận vấn đề trong tổng thể, hiểu mối liên hệ.
- **Tư duy tích cực**: Tập trung vào giải pháp thay vì vấn đề.

## Những rào cản của tư duy

1. **Thiên kiến xác nhận**: Chỉ tìm kiếm thông tin ủng hộ quan điểm có sẵn.
2. **Tư duy đám đông**: Theo số đông mà không suy xét.
3. **Lười tư duy**: Chấp nhận câu trả lời dễ dàng nhất.`,
    contentEn: `# The Nature of Thinking

## What is Thinking?

Thinking is the brain's information processing, encompassing **reasoning**, **analysis**, **evaluation**, and **decision-making**. Thinking is not merely intellectual — it is deeply influenced by emotions and experiences.

> "The quality of your thinking determines the quality of your life." — WiT

## Types of Thinking

- **Critical thinking**: Questioning, verifying, not accepting unconditionally.
- **Creative thinking**: Finding new solutions, connecting unique ideas.
- **Systems thinking**: Viewing problems holistically, understanding connections.
- **Positive thinking**: Focusing on solutions rather than problems.

## Barriers to Thinking

1. **Confirmation bias**: Only seeking information that supports existing beliefs.
2. **Herd mentality**: Following the crowd without reflection.
3. **Intellectual laziness**: Accepting the easiest answers.`,
    contentJp: `# 思考の本質

## 思考とは何か？

思考は、**推論**、**分析**、**評価**、**意思決定** を含む脳の情報処理プロセスです。思考は知的活動だけでなく、感情や経験からも深く影響を受けます。

> 「思考の質が人生の質を決める。」— WiT

## 思考の種類

- **批判的思考**: 疑問を持ち、検証し、無条件に受け入れない。
- **創造的思考**: 新しい解決策を見つけ、独自のアイデアを結びつける。
- **システム思考**: 問題を全体的に見て、つながりを理解する。
- **ポジティブ思考**: 問題ではなく解決策に焦点を当てる。`,
    status: 'published',
  },
  {
    id: 'lesson-03',
    lessonNo: 3,
    chapterId: 'ch-01',
    titleVi: 'Ý thức và tiềm thức',
    titleEn: 'Consciousness and Subconscious',
    titleJp: '意識と潜在意識',
    summaryVi: 'Hiểu về hai tầng ý thức và cách chúng chi phối hành vi.',
    summaryEn: 'Understanding the two layers of consciousness and how they govern behavior.',
    summaryJp: '意識の二層と行動への影響を理解する。',
    contentVi: `# Ý thức và tiềm thức\n\nCon người có hai tầng ý thức: **ý thức** (phần nổi) và **tiềm thức** (phần chìm). Như một tảng băng trôi, phần tiềm thức chiếm phần lớn và chi phối hầu hết hành vi của chúng ta.\n\n## Ý thức\n\nÝ thức là phần tư duy mà chúng ta nhận biết được. Đó là khi bạn chủ động suy nghĩ, phân tích, lựa chọn.\n\n## Tiềm thức\n\nTiềm thức lưu trữ mọi trải nghiệm, niềm tin, thói quen. Nó hoạt động tự động và ảnh hưởng đến cách chúng ta phản ứng với thế giới.\n\n> "Hiểu tiềm thức là chìa khóa để thay đổi chính mình."`,
    contentEn: `# Consciousness and Subconscious\n\nHumans have two layers: **consciousness** (the surface) and **subconscious** (the depth). Like an iceberg, the subconscious occupies the majority and governs most of our behavior.\n\n## Consciousness\n\nConsciousness is the thinking we are aware of — when we actively reason, analyze, and choose.\n\n## Subconscious\n\nThe subconscious stores all experiences, beliefs, and habits. It operates automatically and influences how we react to the world.\n\n> "Understanding the subconscious is the key to changing yourself."`,
    contentJp: `# 意識と潜在意識\n\n人間には二つの層があります：**意識**（表面）と**潜在意識**（深層）。氷山のように、潜在意識が大部分を占め、私たちの行動のほとんどを支配しています。\n\n## 意識\n\n意識とは、私たちが認識できる思考です — 能動的に推論し、分析し、選択する時。\n\n## 潜在意識\n\n潜在意識はすべての経験、信念、習慣を保存します。自動的に動作し、世界への反応の仕方に影響を与えます。`,
    status: 'published',
  },
  {
    id: 'lesson-04',
    lessonNo: 4,
    chapterId: 'ch-01',
    titleVi: 'Nhận thức về bản thân',
    titleEn: 'Self-Awareness',
    titleJp: '自己認知',
    summaryVi: 'Học cách nhìn nhận bản thân một cách trung thực và toàn diện.',
    summaryEn: 'Learn to view yourself honestly and holistically.',
    summaryJp: '自分自身を正直かつ総合的に見る方法を学ぶ。',
    contentVi: `# Nhận thức về bản thân\n\nNhận thức về bản thân là khả năng nhìn nhận rõ ràng điểm mạnh, điểm yếu, giá trị, niềm tin và cảm xúc của chính mình.\n\n## Tại sao tự nhận thức quan trọng?\n\n- Giúp bạn hiểu **tại sao** bạn hành động theo cách mình làm\n- Cho phép bạn **điều chỉnh** hành vi hiệu quả hơn\n- Tăng cường **trí tuệ cảm xúc** và khả năng giao tiếp\n\n## Bài tập: Nhật ký tự nhận thức\n\nMỗi tối, viết ra 3 điều:\n1. Điều bạn làm tốt hôm nay\n2. Điều bạn muốn cải thiện\n3. Cảm xúc chủ đạo trong ngày`,
    contentEn: `# Self-Awareness\n\nSelf-awareness is the ability to clearly see your own strengths, weaknesses, values, beliefs, and emotions.\n\n## Why is Self-Awareness Important?\n\n- Helps you understand **why** you act the way you do\n- Allows you to **adjust** behavior more effectively\n- Enhances **emotional intelligence** and communication\n\n## Exercise: Self-Awareness Journal\n\nEach evening, write down 3 things:\n1. Something you did well today\n2. Something you want to improve\n3. Your dominant emotion of the day`,
    contentJp: `# 自己認知\n\n自己認知とは、自分の強み、弱み、価値観、信念、感情を明確に見る能力です。\n\n## なぜ自己認知が重要か？\n\n- **なぜ** そのように行動するのかを理解する助けとなる\n- より効果的に行動を **調整** できる\n- **感情知能** とコミュニケーション能力を高める`,
    status: 'published',
  },
  {
    id: 'lesson-05',
    lessonNo: 5,
    chapterId: 'ch-01',
    titleVi: 'Sức mạnh của niềm tin',
    titleEn: 'The Power of Beliefs',
    titleJp: '信念の力',
    summaryVi: 'Niềm tin định hình cuộc sống — hiểu để thay đổi.',
    summaryEn: 'Beliefs shape your life — understand to transform.',
    summaryJp: '信念は人生を形作る — 理解して変える。',
    contentVi: `# Sức mạnh của niềm tin\n\nNiềm tin là những "chương trình" chạy ngầm trong tâm trí, định hình cách chúng ta nhìn nhận thế giới và hành động.\n\n## Niềm tin tích cực và tiêu cực\n\n**Niềm tin tích cực** thúc đẩy: "Tôi có khả năng học hỏi", "Thất bại là bài học".\n\n**Niềm tin tiêu cực** cản trở: "Tôi không đủ giỏi", "Mọi thứ đã quá muộn".\n\n> "Thay đổi niềm tin là bước đầu tiên thay đổi vận mệnh."`,
    contentEn: `# The Power of Beliefs\n\nBeliefs are the "programs" running silently in our minds, shaping how we see the world and act.\n\n## Positive and Negative Beliefs\n\n**Positive beliefs** empower: "I am capable of learning", "Failure is a lesson".\n\n**Negative beliefs** hinder: "I'm not good enough", "It's too late".\n\n> "Changing your beliefs is the first step to changing your destiny."`,
    contentJp: `# 信念の力\n\n信念は心の中で静かに動く「プログラム」であり、世界の見方と行動を形作ります。\n\n## ポジティブな信念とネガティブな信念\n\n**ポジティブな信念**は力を与える：「私は学ぶ能力がある」「失敗は教訓だ」。\n\n**ネガティブな信念**は妨げる：「私は十分ではない」「もう遅すぎる」。`,
    status: 'published',
  },
  {
    id: 'lesson-06',
    lessonNo: 6,
    chapterId: 'ch-01',
    titleVi: 'Quan sát và lắng nghe',
    titleEn: 'Observation and Listening',
    titleJp: '観察と傾聴',
    summaryVi: 'Rèn luyện kỹ năng quan sát và lắng nghe sâu.',
    summaryEn: 'Cultivate deep observation and listening skills.',
    summaryJp: '深い観察と傾聴のスキルを養う。',
    contentVi: `# Quan sát và lắng nghe\n\nQuan sát và lắng nghe là hai kỹ năng nền tảng của nhận thức. Khi bạn thực sự quan sát, bạn nhìn thấy những điều mà người khác bỏ qua.\n\n## Lắng nghe sâu\n\nLắng nghe sâu không chỉ là nghe lời nói — mà còn là lắng nghe cảm xúc, ý định, và điều chưa được nói ra.\n\n## Bài tập thực hành\n\nDành 10 phút mỗi ngày ngồi yên và quan sát:\n- Âm thanh xung quanh\n- Cảm giác cơ thể\n- Dòng suy nghĩ đang trôi qua`,
    contentEn: `# Observation and Listening\n\nObservation and listening are foundational skills of awareness. When you truly observe, you see things others miss.\n\n## Deep Listening\n\nDeep listening goes beyond hearing words — it means hearing emotions, intentions, and what remains unsaid.\n\n## Practice Exercise\n\nSpend 10 minutes daily sitting still and observing:\n- Surrounding sounds\n- Body sensations\n- The stream of thoughts passing by`,
    contentJp: `# 観察と傾聴\n\n観察と傾聴は認知の基礎的なスキルです。真に観察すると、他の人が見逃すものが見えてきます。\n\n## 深い傾聴\n\n深い傾聴は言葉を聞くだけではなく、感情、意図、まだ語られていないことを聞くことです。`,
    status: 'published',
  },
  {
    id: 'lesson-07',
    lessonNo: 7,
    chapterId: 'ch-01',
    titleVi: 'Tư duy hệ thống',
    titleEn: 'Systems Thinking',
    titleJp: 'システム思考',
    summaryVi: 'Nhìn nhận vấn đề trong tổng thể, không tách rời.',
    summaryEn: 'View problems holistically, not in isolation.',
    summaryJp: '問題を全体的に見る — 孤立させない。',
    contentVi: `# Tư duy hệ thống\n\nTư duy hệ thống là cách nhìn nhận mọi thứ như một **hệ thống liên kết**, không phải những phần rời rạc. Mọi hành động đều có hệ quả lan tỏa.\n\n## Nguyên tắc cơ bản\n\n1. **Mọi thứ đều liên kết**: Thay đổi một phần ảnh hưởng toàn bộ.\n2. **Nhìn xa hơn triệu chứng**: Tìm nguyên nhân gốc rễ, không chỉ xử lý bề mặt.\n3. **Vòng phản hồi**: Hành động tạo ra kết quả, kết quả ảnh hưởng ngược lại hành động.`,
    contentEn: `# Systems Thinking\n\nSystems thinking views everything as an **interconnected system**, not isolated parts. Every action has ripple effects.\n\n## Core Principles\n\n1. **Everything is connected**: Changing one part affects the whole.\n2. **Look beyond symptoms**: Find root causes, not just surface treatments.\n3. **Feedback loops**: Actions create results, results influence future actions.`,
    contentJp: `# システム思考\n\nシステム思考は、すべてを孤立した部分ではなく、**相互接続されたシステム** として見ます。すべての行動には波及効果があります。\n\n## 基本原則\n\n1. **すべてはつながっている**: 一部を変えると全体に影響する。\n2. **症状の先を見る**: 表面的な対処ではなく、根本原因を見つける。\n3. **フィードバックループ**: 行動が結果を生み、結果が行動に影響する。`,
    status: 'published',
  },
  {
    id: 'lesson-08',
    lessonNo: 8,
    chapterId: 'ch-01',
    titleVi: 'Hành trình nhận thức cá nhân',
    titleEn: 'Personal Awareness Journey',
    titleJp: '個人の認知の旅',
    summaryVi: 'Tổng kết chương 1 và bắt đầu xây dựng lộ trình nhận thức cá nhân.',
    summaryEn: 'Summarize Chapter 1 and begin building your personal awareness roadmap.',
    summaryJp: '第1章のまとめと個人の認知ロードマップの構築。',
    contentVi: `# Hành trình nhận thức cá nhân\n\nChúc mừng bạn đã hoàn thành Chương 1! Bạn đã tìm hiểu về:\n\n- Nhận thức và các cấp độ\n- Bản chất của tư duy\n- Ý thức và tiềm thức\n- Nhận thức về bản thân\n- Sức mạnh của niềm tin\n- Quan sát và lắng nghe\n- Tư duy hệ thống\n\n## Bước tiếp theo\n\nHãy viết ra **3 cam kết** với bản thân về việc rèn luyện nhận thức mỗi ngày.\n\n> "Mỗi bước đi đều có ý nghĩa trên hành trình nhận thức."`,
    contentEn: `# Personal Awareness Journey\n\nCongratulations on completing Chapter 1! You've explored:\n\n- Awareness and its levels\n- The nature of thinking\n- Consciousness and subconscious\n- Self-awareness\n- The power of beliefs\n- Observation and listening\n- Systems thinking\n\n## Next Steps\n\nWrite down **3 commitments** to yourself about practicing awareness daily.\n\n> "Every step has meaning on the journey of awareness."`,
    contentJp: `# 個人の認知の旅\n\n第1章を完了しました！学んだこと：\n\n- 認知とそのレベル\n- 思考の本質\n- 意識と潜在意識\n- 自己認知\n- 信念の力\n- 観察と傾聴\n- システム思考\n\n## 次のステップ\n\n毎日認知を練習するための **3つの約束** を書き出してください。`,
    status: 'published',
  },
  {
    id: 'lesson-09',
    lessonNo: 9,
    chapterId: 'ch-02',
    titleVi: 'Thế giới nội tâm',
    titleEn: 'The Inner World',
    titleJp: '内面世界',
    summaryVi: 'Khám phá thế giới bên trong — nơi mọi thay đổi bắt đầu.',
    summaryEn: 'Explore the world within — where all change begins.',
    summaryJp: '内面世界を探求する — すべての変化が始まる場所。',
    contentVi: `# Thế giới nội tâm\n\nThế giới nội tâm là nơi chứa đựng mọi cảm xúc, suy nghĩ, giá trị và niềm tin sâu xa nhất của bạn. Đây là nền tảng để bạn xây dựng cuộc sống bên ngoài.\n\n> "Thay đổi bên trong trước, thế giới bên ngoài sẽ thay đổi theo."\n\n## Các thành phần của nội tâm\n\n- **Cảm xúc**: Vui, buồn, giận, sợ, yêu thương\n- **Suy nghĩ**: Dòng ý thức liên tục\n- **Giá trị**: Điều bạn coi trọng nhất\n- **Niềm tin**: Những "chân lý" bạn tin tưởng`,
    contentEn: `# The Inner World\n\nThe inner world contains your deepest emotions, thoughts, values, and beliefs. It is the foundation upon which you build your external life.\n\n> "Change within first, and the outer world will follow."\n\n## Components of the Inner World\n\n- **Emotions**: Joy, sadness, anger, fear, love\n- **Thoughts**: The continuous stream of consciousness\n- **Values**: What matters most to you\n- **Beliefs**: The "truths" you hold`,
    contentJp: `# 内面世界\n\n内面世界には、最も深い感情、思考、価値観、信念が含まれています。これは外部の生活を築く基盤です。\n\n> 「まず内側を変えれば、外の世界もそれに従う。」\n\n## 内面世界の構成要素\n\n- **感情**: 喜び、悲しみ、怒り、恐れ、愛\n- **思考**: 意識の絶え間ない流れ\n- **価値観**: 最も大切にしていること\n- **信念**: 信じている「真実」`,
    status: 'published',
  },
  {
    id: 'lesson-10',
    lessonNo: 10,
    chapterId: 'ch-02',
    titleVi: 'Quản lý cảm xúc',
    titleEn: 'Emotional Management',
    titleJp: '感情管理',
    summaryVi: 'Học cách nhận diện và quản lý cảm xúc một cách lành mạnh.',
    summaryEn: 'Learn to recognize and manage emotions in a healthy way.',
    summaryJp: '感情を健全に認識し管理する方法を学ぶ。',
    contentVi: `# Quản lý cảm xúc\n\nCảm xúc không phải kẻ thù — chúng là **tín hiệu** cho bạn biết điều gì đang xảy ra bên trong. Quản lý cảm xúc không có nghĩa là đè nén, mà là **hiểu** và **điều hướng** chúng.\n\n## 4 bước quản lý cảm xúc\n\n1. **Nhận diện**: Đặt tên cho cảm xúc. "Tôi đang cảm thấy tức giận."\n2. **Chấp nhận**: Cho phép cảm xúc tồn tại. Không phán xét.\n3. **Hiểu**: Tìm hiểu nguyên nhân. Cảm xúc này đến từ đâu?\n4. **Điều hướng**: Chọn cách phản ứng phù hợp.\n\n> "Người khôn ngoan không phải người không có cảm xúc, mà là người biết đồng hành cùng cảm xúc."`,
    contentEn: `# Emotional Management\n\nEmotions are not enemies — they are **signals** telling you what's happening inside. Managing emotions doesn't mean suppressing them, but **understanding** and **navigating** them.\n\n## 4 Steps to Emotional Management\n\n1. **Recognize**: Name the emotion. "I am feeling angry."\n2. **Accept**: Allow the emotion to exist. No judgment.\n3. **Understand**: Find the cause. Where does this emotion come from?\n4. **Navigate**: Choose an appropriate response.\n\n> "A wise person is not one without emotions, but one who walks alongside them."`,
    contentJp: `# 感情管理\n\n感情は敵ではなく、内部で何が起きているかを伝える **シグナル** です。感情管理は抑圧ではなく、**理解** し **導く** ことです。\n\n## 感情管理の4ステップ\n\n1. **認識する**: 感情に名前をつける。「私は怒りを感じている。」\n2. **受け入れる**: 感情の存在を許す。判断しない。\n3. **理解する**: 原因を見つける。この感情はどこから来たのか？\n4. **導く**: 適切な反応を選ぶ。`,
    status: 'published',
  },
];

// ============================================================
// Dictionary Terms (20 sample terms)
// ============================================================
export const SEED_DICTIONARY = [
  {
    id: 'term-01',
    category: 'Nhận thức',
    viTerm: 'Nhận thức',
    viDef: 'Khả năng nhìn nhận, hiểu biết và đánh giá thế giới xung quanh.',
    viPos: 'danh từ',
    viIpa: '/ɲən tɨ́k/',
    enTerm: 'Awareness',
    enDef: 'The ability to perceive, understand, and evaluate the world around us.',
    enPos: 'noun',
    enIpa: '/əˈwɛːnəs/',
    jpTerm: '認知',
    jpDef: '周囲の世界を認識し、理解し、評価する能力。',
    jpPos: '名詞',
    jpKana: 'にんち',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-02',
    category: 'Tư duy',
    viTerm: 'Tư duy',
    viDef: 'Quá trình xử lý thông tin bao gồm suy nghĩ, phân tích và đánh giá.',
    viPos: 'danh từ',
    viIpa: '/tɨ zuj/',
    enTerm: 'Thinking',
    enDef: 'The process of processing information including reasoning, analysis, and evaluation.',
    enPos: 'noun',
    enIpa: '/ˈθɪŋkɪŋ/',
    jpTerm: '思考',
    jpDef: '推論、分析、評価を含む情報処理のプロセス。',
    jpPos: '名詞',
    jpKana: 'しこう',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-03',
    category: 'Tâm lý',
    viTerm: 'Tiềm thức',
    viDef: 'Phần tâm trí hoạt động ngoài ý thức, lưu trữ niềm tin và thói quen.',
    viPos: 'danh từ',
    viIpa: '/tiə̀m tɨ́k/',
    enTerm: 'Subconscious',
    enDef: 'The part of the mind that operates outside of consciousness, storing beliefs and habits.',
    enPos: 'noun',
    enIpa: '/sʌbˈkɒnʃəs/',
    jpTerm: '潜在意識',
    jpDef: '意識の外で動作し、信念と習慣を保存する心の部分。',
    jpPos: '名詞',
    jpKana: 'せんざいいしき',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-04',
    category: 'Tư duy',
    viTerm: 'Tư duy phản biện',
    viDef: 'Kỹ năng đặt câu hỏi, kiểm chứng và không chấp nhận vô điều kiện.',
    viPos: 'danh từ',
    viIpa: '/tɨ zuj fǎn biə̀n/',
    enTerm: 'Critical thinking',
    enDef: 'The skill of questioning, verifying, and not accepting unconditionally.',
    enPos: 'noun phrase',
    enIpa: '/ˈkrɪtɪkəl ˈθɪŋkɪŋ/',
    jpTerm: '批判的思考',
    jpDef: '疑問を持ち、検証し、無条件に受け入れないスキル。',
    jpPos: '名詞',
    jpKana: 'ひはんてきしこう',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-05',
    category: 'Nhận thức',
    viTerm: 'Siêu nhận thức',
    viDef: 'Nhận thức về chính quá trình nhận thức của mình (metacognition).',
    viPos: 'danh từ',
    viIpa: '/siəw ɲən tɨ́k/',
    enTerm: 'Metacognition',
    enDef: 'Awareness of one\'s own thinking processes.',
    enPos: 'noun',
    enIpa: '/ˌmɛtəkɒɡˈnɪʃən/',
    jpTerm: 'メタ認知',
    jpDef: '自分自身の思考プロセスへの認知。',
    jpPos: '名詞',
    jpKana: 'めたにんち',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-06',
    category: 'Tâm lý',
    viTerm: 'Cảm xúc',
    viDef: 'Trạng thái tâm lý phản ánh mối quan hệ giữa con người với thế giới.',
    viPos: 'danh từ',
    viIpa: '/kǎm suk/',
    enTerm: 'Emotion',
    enDef: 'A psychological state reflecting the relationship between a person and the world.',
    enPos: 'noun',
    enIpa: '/ɪˈməʊʃən/',
    jpTerm: '感情',
    jpDef: '人と世界の関係を反映する心理状態。',
    jpPos: '名詞',
    jpKana: 'かんじょう',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-07',
    category: 'Nhân cách',
    viTerm: 'Niềm tin',
    viDef: 'Những quan điểm hoặc giả định mà con người coi là chân lý.',
    viPos: 'danh từ',
    viIpa: '/niə̀m tin/',
    enTerm: 'Belief',
    enDef: 'Views or assumptions that a person holds as truth.',
    enPos: 'noun',
    enIpa: '/bɪˈliːf/',
    jpTerm: '信念',
    jpDef: '人が真実と見なす見解や仮定。',
    jpPos: '名詞',
    jpKana: 'しんねん',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-08',
    category: 'Tư duy',
    viTerm: 'Tư duy hệ thống',
    viDef: 'Cách nhìn nhận vấn đề trong tổng thể, hiểu mối liên hệ giữa các phần.',
    viPos: 'danh từ',
    viIpa: '/tɨ zuj hê̩ tʰóŋ/',
    enTerm: 'Systems thinking',
    enDef: 'Viewing problems holistically, understanding connections between parts.',
    enPos: 'noun phrase',
    enIpa: '/ˈsɪstəmz ˈθɪŋkɪŋ/',
    jpTerm: 'システム思考',
    jpDef: '問題を全体的に見て、部分間のつながりを理解する。',
    jpPos: '名詞',
    jpKana: 'しすてむしこう',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-09',
    category: 'Nhận thức',
    viTerm: 'Ý thức',
    viDef: 'Phần tâm trí mà con người nhận biết được, bao gồm suy nghĩ và phân tích.',
    viPos: 'danh từ',
    viIpa: '/ǐ tɨ́k/',
    enTerm: 'Consciousness',
    enDef: 'The part of the mind that a person is aware of, including thinking and analysis.',
    enPos: 'noun',
    enIpa: '/ˈkɒnʃəsnəs/',
    jpTerm: '意識',
    jpDef: '人が認識できる心の部分、思考と分析を含む。',
    jpPos: '名詞',
    jpKana: 'いしき',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-10',
    category: 'Nhận thức',
    viTerm: 'Thiên kiến xác nhận',
    viDef: 'Xu hướng chỉ tìm kiếm thông tin ủng hộ quan điểm có sẵn.',
    viPos: 'danh từ',
    viIpa: '/tʰiən kiə̀n sǎk ɲə̀n/',
    enTerm: 'Confirmation bias',
    enDef: 'The tendency to only seek information that supports existing beliefs.',
    enPos: 'noun phrase',
    enIpa: '/ˌkɒnfəˈmeɪʃən ˈbaɪəs/',
    jpTerm: '確証バイアス',
    jpDef: '既存の信念を支持する情報のみを求める傾向。',
    jpPos: '名詞',
    jpKana: 'かくしょうばいあす',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-11',
    category: 'Nội tâm',
    viTerm: 'Nội tâm',
    viDef: 'Thế giới bên trong của con người, bao gồm cảm xúc, suy nghĩ, giá trị.',
    viPos: 'danh từ',
    viIpa: '/no̩j tɤm/',
    enTerm: 'Inner self',
    enDef: 'The internal world of a person, including emotions, thoughts, and values.',
    enPos: 'noun phrase',
    enIpa: '/ˈɪnə sɛlf/',
    jpTerm: '内面',
    jpDef: '感情、思考、価値観を含む人の内的世界。',
    jpPos: '名詞',
    jpKana: 'ないめん',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-12',
    category: 'Tâm lý',
    viTerm: 'Trí tuệ cảm xúc',
    viDef: 'Khả năng nhận diện, hiểu và quản lý cảm xúc của bản thân và người khác.',
    viPos: 'danh từ',
    viIpa: '/tɕǐ twê̩ kǎm suk/',
    enTerm: 'Emotional intelligence',
    enDef: 'The ability to recognize, understand, and manage emotions in oneself and others.',
    enPos: 'noun phrase',
    enIpa: '/ɪˈməʊʃənəl ɪnˈtɛlɪdʒəns/',
    jpTerm: '感情知能',
    jpDef: '自分と他者の感情を認識し、理解し、管理する能力。',
    jpPos: '名詞',
    jpKana: 'かんじょうちのう',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-13',
    category: 'Nhân cách',
    viTerm: 'Giá trị',
    viDef: 'Những điều con người coi trọng nhất, định hướng hành vi và quyết định.',
    viPos: 'danh từ',
    viIpa: '/zǎ tɕi̩/',
    enTerm: 'Values',
    enDef: 'What a person considers most important, guiding behavior and decisions.',
    enPos: 'noun',
    enIpa: '/ˈvæljuːz/',
    jpTerm: '価値観',
    jpDef: '人が最も重要と考えること、行動と決定を導く。',
    jpPos: '名詞',
    jpKana: 'かちかん',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-14',
    category: 'Tư duy',
    viTerm: 'Tư duy sáng tạo',
    viDef: 'Khả năng tìm ra giải pháp mới, kết nối ý tưởng theo cách độc đáo.',
    viPos: 'danh từ',
    viIpa: '/tɨ zuj ʂǎŋ ta̩w/',
    enTerm: 'Creative thinking',
    enDef: 'The ability to find new solutions and connect ideas in unique ways.',
    enPos: 'noun phrase',
    enIpa: '/kriˈeɪtɪv ˈθɪŋkɪŋ/',
    jpTerm: '創造的思考',
    jpDef: '新しい解決策を見つけ、独自の方法でアイデアを結びつける能力。',
    jpPos: '名詞',
    jpKana: 'そうぞうてきしこう',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-15',
    category: 'Kỹ năng',
    viTerm: 'Lắng nghe sâu',
    viDef: 'Kỹ năng lắng nghe vượt qua lời nói — nghe cảm xúc, ý định.',
    viPos: 'danh từ',
    viIpa: '/lǎŋ ŋe ʂɤw/',
    enTerm: 'Deep listening',
    enDef: 'The skill of listening beyond words — hearing emotions and intentions.',
    enPos: 'noun phrase',
    enIpa: '/diːp ˈlɪsənɪŋ/',
    jpTerm: '深い傾聴',
    jpDef: '言葉を超えて聞くスキル — 感情と意図を聞く。',
    jpPos: '名詞',
    jpKana: 'ふかいけいちょう',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-16',
    category: 'Tâm lý',
    viTerm: 'Quán tính',
    viDef: 'Xu hướng duy trì trạng thái hiện tại, không thay đổi.',
    viPos: 'danh từ',
    viIpa: '/kwǎn tʰǐɲ/',
    enTerm: 'Inertia',
    enDef: 'The tendency to maintain the current state without change.',
    enPos: 'noun',
    enIpa: '/ɪˈnɜːʃə/',
    jpTerm: '慣性',
    jpDef: '変化せず現在の状態を維持する傾向。',
    jpPos: '名詞',
    jpKana: 'かんせい',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-17',
    category: 'Nhân cách',
    viTerm: 'Nhân cách',
    viDef: 'Tổng thể các đặc điểm tâm lý ổn định tạo nên con người.',
    viPos: 'danh từ',
    viIpa: '/ɲɤn kǎk/',
    enTerm: 'Character',
    enDef: 'The totality of stable psychological traits that define a person.',
    enPos: 'noun',
    enIpa: '/ˈkærɪktə/',
    jpTerm: '人格',
    jpDef: '人を定義する安定した心理的特性の全体。',
    jpPos: '名詞',
    jpKana: 'じんかく',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-18',
    category: 'Kỹ năng',
    viTerm: 'Tự đánh giá',
    viDef: 'Quá trình nhìn nhận và đánh giá bản thân một cách khách quan.',
    viPos: 'danh từ',
    viIpa: '/tɨ̩ ɗǎɲ zǎ/',
    enTerm: 'Self-evaluation',
    enDef: 'The process of viewing and evaluating oneself objectively.',
    enPos: 'noun',
    enIpa: '/sɛlf ɪˌvæljuˈeɪʃən/',
    jpTerm: '自己評価',
    jpDef: '自分自身を客観的に見て評価するプロセス。',
    jpPos: '名詞',
    jpKana: 'じこひょうか',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-19',
    category: 'Tư duy',
    viTerm: 'Tư duy tích cực',
    viDef: 'Hướng tập trung vào giải pháp thay vì vấn đề.',
    viPos: 'danh từ',
    viIpa: '/tɨ zuj tǐk kɨ̩k/',
    enTerm: 'Positive thinking',
    enDef: 'Focusing on solutions rather than problems.',
    enPos: 'noun phrase',
    enIpa: '/ˈpɒzɪtɪv ˈθɪŋkɪŋ/',
    jpTerm: 'ポジティブ思考',
    jpDef: '問題ではなく解決策に焦点を当てる。',
    jpPos: '名詞',
    jpKana: 'ぽじてぃぶしこう',
    viImg: '', enImg: '', jpImg: '',
  },
  {
    id: 'term-20',
    category: 'Tâm lý',
    viTerm: 'Vòng phản hồi',
    viDef: 'Khi hành động tạo ra kết quả, kết quả ảnh hưởng ngược lại hành động.',
    viPos: 'danh từ',
    viIpa: '/voŋ fǎn ho̩j/',
    enTerm: 'Feedback loop',
    enDef: 'When actions create results, and results influence future actions.',
    enPos: 'noun phrase',
    enIpa: '/ˈfiːdbæk luːp/',
    jpTerm: 'フィードバックループ',
    jpDef: '行動が結果を生み、結果が将来の行動に影響する。',
    jpPos: '名詞',
    jpKana: 'ふぃーどばっくるーぷ',
    viImg: '', enImg: '', jpImg: '',
  },
];
