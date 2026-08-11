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
    titleEn: "One Country. One Standard.",
    titleAr: "بلد واحد. معيار واحد.",
    bodyEn:
      "Egypt is one of the Arab world's most dynamic real estate markets — vast, distinct, and with enormous potential. Cairo is building a new capital. Alexandria is reclaiming the Mediterranean. Hurghada's Red Sea coast draws international buyers year-round. We built ديار to be the platform this market deserves.",
    bodyAr:
      "مصر من أكثر أسواق العقارات ديناميكيةً في العالم العربي — واسعة ومميزة وذات إمكانات هائلة. القاهرة تبني عاصمة جديدة. الإسكندرية تستعيد مكانتها المتوسطية. تستقطب شواطئ البحر الأحمر في الغردقة المشترين الدوليين طوال العام. بنينا ديار لتكون المنصة التي يستحقها هذا السوق.",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=900&q=80",
    reverse: false,
  },
  {
    number: "02",
    titleEn: "Cairo — Building the Future",
    titleAr: "القاهرة — تبني المستقبل",
    bodyEn:
      "The New Administrative Capital is one of the largest urban development projects in history. Sheikh Zayed and New Cairo are becoming the addresses of choice for Egypt's elite. From the towers of the New Capital to the historic streets of Zamalek, Cairo is transforming at an unprecedented pace.",
    bodyAr:
      "العاصمة الإدارية الجديدة هي أحد أكبر مشاريع التطوير الحضري في التاريخ. يتحول الشيخ زايد والتجمع الخامس إلى عناوين النخبة المصرية. من أبراج العاصمة الجديدة إلى الشوارع التاريخية في الزمالك، تتحول القاهرة بوتيرة غير مسبوقة.",
    image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=900&q=80",
    reverse: true,
  },
  {
    number: "03",
    titleEn: "Coastal Excellence",
    titleAr: "التميز الساحلي",
    bodyEn:
      "From Alexandria's Mediterranean coast to Hurghada's Red Sea beaches, from Sharm El Sheikh's luxury resorts to Marsa Matrouh's pristine shores — Egypt's coastline offers something for everyone. Whether you seek investment, vacation, or permanent residence, our coastal properties deliver.",
    bodyAr:
      "من الساحل المتوسطي للإسكندرية إلى شواطئ البحر الأحمر في الغردقة، ومن منتجعات شرم الشيخ الفاخرة إلى شواطئ مرسى مطروح النقية — يقدم ساحل مصر شيئًا للجميع. سواء كنت تبحث عن استثمار أو إجازة أو إقامة دائمة، عقاراتنا الساحلية تقدم لك الأفضل.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
    reverse: false,
  },
  {
    number: "04",
    titleEn: "Built on Trust, Not Traffic",
    titleAr: "مبني على الثقة لا على الزيارات",
    bodyEn:
      "Most platforms chase volume. We chase integrity. Every listing on ديار passes through a multi-step verification — documentation checks, agent credentialing, and pricing audits. Whether the property is in Zamalek or New Cairo, what you see here is the truth.",
    bodyAr:
      "معظم المنصات تتسابق على الحجم. أما نحن فنتسابق على النزاهة. يمر كل عقار في ديار عبر تحقق متعدد المراحل — فحص الوثائق، واعتماد الوكلاء، ومراجعة الأسعار. سواء كان العقار في الزمالك أو القاهرة الجديدة، ما تراه هنا هو الحقيقة.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80",
    reverse: true,
  },
  {
    number: "05",
    titleEn: "The Story Is Still Being Written",
    titleAr: "القصة لا تزال تُكتب",
    bodyEn:
      "We launched covering all 27 governorates of Egypt with a curated portfolio and a clear mission. Tomorrow brings new cities, new markets, and new buyers. What comes next is written together — with the agents who list with us, the buyers who trust us, and the cities that grow with us.",
    bodyAr:
      "أطلقنا المنصة لتغطية كل الـ 27 محافظة في مصر بمحفظة منتقاة ومهمة واضحة. الغد يحمل مدنًا جديدة وأسواقًا جديدة ومشترين جددًا. ما يأتي بعد ذلك يُكتب معًا — مع الوكلاء الذين يدرجون عقاراتهم معنا، والمشترين الذين يثقون بنا، والمدن التي تنمو معنا.",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80",
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
            className="text-white text-xs md:text-sm font-semibold uppercase tracking-[0.25em]"
          >
            {t("Our Story — Five Chapters", "قصتنا — خمسة فصول")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight"
          >
            {t("ديار", "ديار")}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex items-center justify-center gap-3"
          >
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest">
              🇬 {t("Egypt", "مصر")}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-2xl text-white leading-relaxed max-w-2xl mx-auto"
          >
            {t(
              "The story of Egypt's premier real estate platform.",
              "قصة المنصة العقارية الأولى في مصر."
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={heroInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
            className="mx-auto w-24 h-[2px] bg-white/30 rounded-full origin-center"
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
                className="text-xs font-bold text-white tracking-widest uppercase"
              >
                {c.number}
                {c.number !== "05" && (
                  <span className="mx-3 text-white/20">·</span>
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
          className="text-white text-xs font-semibold uppercase tracking-[0.25em]"
        >
          {t("Chapter 06 — Yours", "الفصل 06 — فصلك أنت")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-black leading-tight text-white"
        >
          {t("Find Your Next Chapter", "ابحث عن فصلك القادم")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-white text-lg leading-relaxed"
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
          className="inline-block px-10 py-4 bg-white/10 border border-white/30 text-white rounded-full font-bold text-base tracking-wide shadow-lg cursor-pointer hover:bg-white/20"
        >
          {t("Browse Properties", "تصفح العقارات")}
        </motion.a>
      </div>
    </motion.section>
  );
}
