/**
 * Curated snapshot of the business's Google reviews.
 *
 * ⚠️ THIS IS A MANUAL SNAPSHOT, NOT A LIVE FEED.
 * Captured 2026-08-01 from the Google Business Profile:
 * https://maps.app.goo.gl/mCoNHEfivXAJH9Mr8
 *
 * The listing showed 5.0 ★ from 42 reviews at that time. Re-check the profile
 * periodically and update `snapshot` below plus any new entries — nothing here
 * refreshes on its own.
 *
 * The map embed in the Location section renders Google's *live* rating badge,
 * so that number is always current even when this file drifts.
 *
 * Every `text` was captured from Google in Indonesian (Google auto-translates
 * reviews written in other languages). The `en` and `zh` strings are faithful
 * translations of that captured text and are labelled as translations in the
 * UI — they are not the reviewer's own wording in those languages.
 */

export const snapshot = {
  rating: 5.0,
  total: 42,
  capturedOn: '2026-08-01',
  sourceUrl: 'https://maps.app.goo.gl/mCoNHEfivXAJH9Mr8',
}

/**
 * `nativeLocale` marks the language the reviewer actually wrote in. It is set
 * only where we hold their own wording; every other entry reached us through a
 * translation (Google's, then ours) and is labelled as translated in all
 * locales rather than passed off as the reviewer's words.
 */

export const reviews = [
  {
    id: 'ahmed',
    author: 'Ahmed',
    rating: 5,
    // YYYY-MM — rendered as a localized month so it ages honestly instead of
    // freezing at a relative label like "a month ago".
    date: '2026-07',
    text: {
      id: 'Pengalaman yang luar biasa! Kami menikmati perjalanan ATV hingga ke puncak gunung untuk menyaksikan matahari terbenam, dan pemandangannya benar-benar menakjubkan. Terima kasih khusus kepada BAIM, yang ramah, profesional, dan sangat membantu sepanjang perjalanan. Keterampilan fotografinya luar biasa, dan dia berhasil mengabadikan foto dan video yang menakjubkan untuk kami.',
      en: 'An incredible experience! We enjoyed the ATV ride up to the mountain top to watch the sunset, and the views were absolutely stunning. Special thanks to BAIM, who was friendly, professional and very helpful throughout the trip. His photography skills are outstanding, and he captured amazing photos and videos for us.',
      zh: '非常棒的体验！我们乘坐 ATV 上到山顶观看日落，景色美得令人惊叹。特别感谢 BAIM，他全程友好、专业且乐于助人。他的摄影技术非常出色，为我们拍下了精彩的照片和视频。',
    },
  },
  {
    id: 'kristian-l',
    author: 'Kristian L',
    rating: 5,
    date: '2026-06',
    text: {
      id: 'Pengalaman yang sangat bagus. Pemandu kami mengetahui banyak pose dan trik foto untuk mendapatkan gambar terbaik. Sopir yang antusias dan ramah, dengan keterampilan mengemudi yang mumpuni. Mobilnya juga memiliki atap yang bisa sangat berguna jika hujan.',
      en: "A really great experience. Our guide knew plenty of poses and photo tricks to get the best shots. An enthusiastic and friendly driver with genuinely capable driving skills. The jeep also has a roof, which is very useful if it rains.",
      zh: '非常棒的体验。我们的向导懂得许多姿势和拍照技巧，能拍出最好的照片。司机热情友好，驾驶技术过硬。吉普车还配有车顶，下雨时非常实用。',
    },
  },
  {
    id: 'faris-awad',
    author: 'Faris Awad',
    rating: 5,
    date: '2026-07',
    text: {
      id: 'Perjalanan terbaik yang pernah ada ✌️ Sangat direkomendasikan dengan MJS. Stafnya ramah dan mereka punya anak anjing paling lucu bernama Mochi 🐶 Terima kasih khusus untuk JRO — dia sangat sabar dan juga fotografer yang hebat 😎',
      en: 'The best trip ever ✌️ Highly recommended with MJS. The staff are friendly and they have the cutest puppy named Mochi 🐶 Special thanks to JRO — he was very patient and a great photographer too 😎',
      zh: '有史以来最棒的旅程 ✌️ 强烈推荐 MJS。工作人员很友好，他们还养了一只最可爱的小狗叫 Mochi 🐶 特别感谢 JRO——他非常有耐心，也是位很棒的摄影师 😎',
    },
  },
  {
    id: 'cheryl-asher',
    author: 'Cheryl Asher',
    rating: 5,
    date: '2026-07',
    text: {
      id: 'Kami mengikuti tur Jeep Sunrise and Hotspring. Medannya sulit, tetapi pemandu kami, Edy, adalah pengemudi yang hebat! Dan dia juga mengambil foto untuk kami :)',
      en: 'We took the Jeep Sunrise and Hot Spring tour. The terrain is tough, but our guide Edy is a great driver! And he took photos for us too :)',
      zh: '我们参加了吉普车日出与温泉之旅。路况很崎岖，但我们的向导 Edy 车技高超！他还为我们拍了照片 :)',
    },
  },
  {
    id: 'nitin-gupta',
    author: 'Nitin Gupta',
    rating: 5,
    date: '2026-05',
    text: {
      id: 'Operator yang sangat baik dan dapat diandalkan. Kami bersenang-senang bersama keluarga. Kami pergi dekat Gunung Batur dan melihat bebatuan lava. Lebih baik pergi di pagi atau sore hari untuk menghindari panas siang hari. Merekomendasikan untuk memilih operator ini.',
      en: 'A very good and reliable operator. We had a great time as a family. We went near Mount Batur and saw the lava rocks. It is better to go in the morning or late afternoon to avoid the midday heat. I recommend choosing this operator.',
      zh: '非常优秀且可靠的运营商。我们全家玩得很开心。我们去了巴图尔火山附近，看到了熔岩石。建议在早上或傍晚前往，以避开正午的炎热。推荐选择这家运营商。',
    },
  },
  {
    id: 'i-gede-kanten',
    author: 'I Gede Kanten',
    rating: 5,
    date: '2026-06',
    // Written in Indonesian originally — not a translation for id viewers.
    nativeLocale: 'id',
    text: {
      id: 'Perjalanan Jeep sunrise yang menyenangkan, pelayanan breakfast dan driver yang sangat pandai membuat foto dan video. Saya menyarankan booking di sini!!',
      en: "A fun sunrise jeep trip, with breakfast service and a driver who's very good at taking photos and videos. I recommend booking here!!",
      zh: '愉快的吉普车日出之旅，有早餐服务，司机还很擅长拍照和录像。推荐在这里预订！！',
    },
  },
]
