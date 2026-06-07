import { useLanguage } from "@/contexts/LanguageContext";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function Chapter({
  number,
  titleEn,
  titleAr,
  bodyEn,
  bodyAr,
  image,
  reverse = false,
}: {
  number: string;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  image: string;
  reverse?: boolean;
}) {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isRtl = language === "ar";
  const effectiveReverse = isRtl ? !reverse : reverse;

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative py-24 md:py-32 border-b border-border last:border-0"
    >
      <div className="container px-4 max-w-6xl mx-auto">
        <div
          className={`flex flex-col ${effectiveReverse ? "md:flex-row-reverse" : "md:flex-row"} gap-12 md:gap-20 items-center`}
        >
          <div className="flex-1 space-y-6">
            <div className="flex items-baseline gap-4">
              <span className="text-[5rem] md:text-[7rem] leading-none font-black text-primary/10 select-none tabular-nums">
                {number}
              </span>
              <div className="w-12 h-[3px] bg-primary rounded-full flex-shrink-0" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-foreground">
              {t(titleEn, titleAr)}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              {t(bodyEn, bodyAr)}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 w-full"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border">
              <img
                src={image}
                alt={t(titleEn, titleAr)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function Stat({
  value,
  labelEn,
  labelAr,
  delay,
}: {
  value: string;
  labelEn: string;
  labelAr: string;
  delay: number;
}) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="text-center space-y-2"
    >
      <div className="text-5xl md:text-6xl font-black text-primary">{value}</div>
      <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
        {t(labelEn, labelAr)}
      </div>
    </motion.div>
  );
}

const chapters = [
  {
    number: "01",
    titleEn: "Two Countries. One Standard.",
    titleAr: "بلدان. معيار واحد.",
    bodyEn:
      "Saudi Arabia and Egypt are two of the Arab world's most dynamic real estate markets — each vast, each distinct, each with enormous potential. Riyadh is rewriting skylines. Cairo is building a new capital. Jeddah is reinventing its waterfront. Alexandria is reclaiming the Mediterranean. We built Realty Pro to be the platform both markets deserve.",
    bodyAr:
      "المملكة العربية السعودية ومصر من أكثر أسواق العقارات ديناميكيةً في العالم العربي — كل منهما واسعة ومميزة وذات إمكانات هائلة. الرياض تُعيد رسم أفقها. القاهرة تبني عاصمة جديدة. جدة تُجدد واجهتها البحرية. الإسكندرية تستعيد مكانتها المتوسطية. بنينا Realty Pro لتكون المنصة التي يستحقها كلا السوقين.",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=900&q=80",
    reverse: false,
  },
  {
    number: "02",
    titleEn: "Saudi Arabia — Where Vision Meets Skyline",
    titleAr: "المملكة العربية السعودية — حيث تلتقي الرؤية بالأفق",
    bodyEn:
      "From the towers of King Abdullah Financial District in Riyadh to the shores of Jeddah's Corniche, from the holy cities of Mecca and Medina to the futuristic ambition of NEOM — Saudi Arabia is building the future faster than anywhere on earth. We are the platform for those who want to be part of it.",
    bodyAr:
      "من أبراج مركز الملك عبدالله المالي في الرياض إلى شواطئ كورنيش جدة، ومن مكة المكرمة والمدينة المنورة إلى الطموح المستقبلي لنيوم — المملكة العربية السعودية تبني المستقبل بوتيرة لا مثيل لها في أي مكان على الأرض. نحن المنصة لمن يريد أن يكون جزءًا من ذلك.",
    image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=900&q=80",
    reverse: true,
  },
  {
    number: "03",
    titleEn: "Egypt — Ancient Land, Modern Ambition",
    titleAr: "مصر — أرض الحضارة وطموح الحداثة",
    bodyEn:
      "Egypt is experiencing a real estate renaissance. The New Administrative Capital is one of the largest urban development projects in history. Sheikh Zayed and New Cairo are becoming the addresses of choice for Cairo's elite. Alexandria's waterfront is coveted across the Mediterranean. And Hurghada's Red Sea coast draws international buyers year-round. Realty Pro brings them all under one roof.",
    bodyAr:
      "تشهد مصر نهضةً عقاريةً حقيقية. العاصمة الإدارية الجديدة هي أحد أكبر مشاريع التطوير الحضري في التاريخ. يتحول الشيخ زايد والتجمع الخامس إلى عناوين النخبة القاهرية. وتُستحسَن واجهة الإسكندرية البحرية على مستوى المتوسط. وتستقطب شواطئ البحر الأحمر في الغردقة المشترين الدوليين طوال العام. Realty Pro تجمعهم جميعًا تحت سقف واحد.",
    image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=900&q=80",
    reverse: false,
  },
  {
    number: "04",
    titleEn: "Built on Trust, Not Traffic",
    titleAr: "مبني على الثقة لا على الزيارات",
    bodyEn:
      "Most platforms chase volume. We chase integrity. Every listing on Realty Pro passes through a multi-step verification — documentation checks, agent credentialing, and pricing audits. Whether the property is in Zamalek or Al Olaya, what you see here is the truth.",
    bodyAr:
      "معظم المنصات تتسابق على الحجم. أما نحن فنتسابق على النزاهة. يمر كل عقار في Realty Pro عبر تحقق متعدد المراحل — فحص الوثائق، واعتماد الوكلاء، ومراجعة الأسعار. سواء كان العقار في الزمالك أو العليا، ما تراه هنا هو الحقيقة.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80",
    reverse: true,
  },
  {
    number: "05",
    titleEn: "The Story Is Still Being Written",
    titleAr: "القصة لا تزال تُكتب",
    bodyEn:
      "We launched covering Saudi Arabia and Egypt with a curated portfolio and a clear mission. Tomorrow brings new cities, new markets, and new buyers. What comes next is written together — with the agents who list with us, the buyers who trust us, and the cities that grow with us.",
    bodyAr:
      "أطلقنا المنصة لتغطية المملكة العربية السعودية ومصر بمحفظة منتقاة ومهمة واضحة. الغد يحمل مدنًا جديدة وأسواقًا جديدة ومشترين جددًا. ما يأتي بعد ذلك يُكتب معًا — مع الوكلاء الذين يدرجون عقاراتهم معنا، والمشترين الذين يثقون بنا، والمدن التي تنمو معنا.",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=900&q=80",
    reverse: false,
  },
];

export default function About() {
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero — Series Title Card */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1600&q=80"
            alt="hero"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/80 to-primary" />
        </div>

        <div ref={heroRef} className="relative z-10 container px-4 max-w-4xl mx-auto text-center space-y-8">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.4em" }}
            animate={heroInView ? { opacity: 1, letterSpacing: "0.25em" } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-primary-foreground/60 text-xs md:text-sm font-semibold uppercase tracking-[0.25em]"
          >
            {t("Our Story — Five Chapters", "قصتنا — خمسة فصول")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-primary-foreground leading-none tracking-tight"
          >
            {t("Realty Pro", "ريالتي برو")}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex items-center justify-center gap-3"
          >
            <span className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground/80 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest">
              🇸🇦 {t("Saudi Arabia", "المملكة العربية السعودية")}
            </span>
            <span className="text-primary-foreground/30 font-light text-xl">+</span>
            <span className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground/80 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest">
              🇪🇬 {t("Egypt", "مصر")}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-2xl text-primary-foreground/75 leading-relaxed max-w-2xl mx-auto"
          >
            {t(
              "The story of how two great real estate markets found the platform they always deserved.",
              "قصة كيف وجد سوقان عقاريان عظيمان المنصة التي طالما استحقاها."
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={heroInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
            className="mx-auto w-24 h-[2px] bg-primary-foreground/30 rounded-full origin-center"
          />

          {/* Chapter index */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            {chapters.map((c) => (
              <span
                key={c.number}
                className="text-xs font-bold text-primary-foreground/40 tracking-widest uppercase"
              >
                {c.number}
                {c.number !== "05" && (
                  <span className="mx-3 text-primary-foreground/20">·</span>
                )}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats interlude */}
      <section className="py-20 bg-muted/40 border-b border-border">
        <div className="container px-4 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <Stat value="15+" labelEn="Cities" labelAr="مدينة" delay={0} />
          <Stat value="500+" labelEn="Listings" labelAr="عقار" delay={0.1} />
          <Stat value="12K+" labelEn="Buyers" labelAr="مشتري" delay={0.2} />
          <Stat value="98%" labelEn="Verified" labelAr="معتمد" delay={0.3} />
        </div>
      </section>

      {/* Chapters */}
      <div className="bg-background">
        {chapters.map((ch) => (
          <Chapter key={ch.number} {...ch} />
        ))}
      </div>

      {/* Closing CTA */}
      <ClosingCTA />
    </div>
  );
}

function ClosingCTA() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1, ease: "easeOut" }}
      className="py-32 bg-primary text-primary-foreground text-center"
    >
      <div className="container px-4 max-w-3xl mx-auto space-y-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-primary-foreground/60 text-xs font-semibold uppercase tracking-[0.25em]"
        >
          {t("Chapter 06 — Yours", "الفصل 06 — فصلك أنت")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-black leading-tight"
        >
          {t("Find Your Next Chapter", "ابحث عن فصلك القادم")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-primary-foreground/70 text-lg leading-relaxed"
        >
          {t(
            "Every great property is the beginning of a new story. Yours is waiting.",
            "كل عقار رائع هو بداية قصة جديدة. قصتك في انتظارك."
          )}
        </motion.p>
        <motion.a
          href="/properties"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.45 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block px-10 py-4 bg-primary-foreground text-primary rounded-full font-bold text-base tracking-wide shadow-lg cursor-pointer"
        >
          {t("Browse Properties", "تصفح العقارات")}
        </motion.a>
      </div>
    </motion.section>
  );
}
