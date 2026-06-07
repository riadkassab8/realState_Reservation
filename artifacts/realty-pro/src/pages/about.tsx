import { useLanguage } from "@/contexts/LanguageContext";
import { Building2, Globe, Shield, Trophy } from "lucide-react";

export default function About() {
  const { t, language } = useLanguage();

  const values = [
    {
      icon: Shield,
      title: t("Trust & Security", "الثقة والأمان"),
      desc: t("Every listing is verified to ensure a safe investment.", "يتم التحقق من كل قائمة لضمان استثمار آمن.")
    },
    {
      icon: Trophy,
      title: t("Premium Quality", "جودة فائقة"),
      desc: t("We focus exclusively on high-end, luxury real estate.", "نركز حصريًا على العقارات الفاخرة والراقية.")
    },
    {
      icon: Globe,
      title: t("Global Reach", "انتشار عالمي"),
      desc: t("Connecting local properties with international buyers.", "ربط العقارات المحلية بالمشترين الدوليين.")
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary text-primary-foreground py-24 md:py-32">
        <div className="container px-4 text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {t("Elevating Real Estate in the Arab World", "الارتقاء بقطاع العقارات في العالم العربي")}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed">
            {t(
              "Realty Pro was founded with a singular vision: to create a marketplace that matches the prestige of the properties it showcases.",
              "تأسست Realty Pro برؤية واحدة: إنشاء سوق يطابق هيبة العقارات التي يعرضها."
            )}
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {values.map((v, i) => (
              <div key={i} className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto text-primary">
                  <v.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30 border-t border-border">
        <div className="container px-4 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t("Our Story", "قصتنا")}
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                {t(
                  "We recognized a gap in the market. While the region boasts some of the world's most spectacular architecture, the platforms used to discover them were cluttered, outdated, and uninspiring.",
                  "أدركنا وجود فجوة في السوق. فبينما تفتخر المنطقة ببعض أروع المعالم المعمارية في العالم، كانت المنصات المستخدمة لاكتشافها مزدحمة وقديمة وغير ملهمة."
                )}
              </p>
              <p>
                {t(
                  "Realty Pro changes that. By combining world-class design, robust verification processes, and an intuitive user experience, we've built a destination where luxury properties find their perfect buyers.",
                  "ريالتي برو تغير ذلك. من خلال الجمع بين التصميم العالمي المستوى وعمليات التحقق القوية وتجربة المستخدم البديهية، قمنا ببناء وجهة تجد فيها العقارات الفاخرة مشتريها المثاليين."
                )}
              </p>
            </div>
          </div>
          <div className="flex-1 w-full aspect-square md:aspect-auto md:h-[500px] rounded-3xl overflow-hidden bg-card border border-border shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" 
              alt="Architecture" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
