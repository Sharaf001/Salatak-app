import { Compass, Download, Heart, Moon, ShieldCheck } from "lucide-react";

const features = [
  ["القرآن الكريم", "١١٤ سورة · ٦٢٣٦ آية", "text-emerald-700"],
  ["اتجاه القبلة", "بوصلة دقيقة حسب موقعك", "text-amber-700"],
  ["الأدعية والأذكار", "مصادر موثوقة ومراجعة", "text-rose-700"],
  ["الخلفيات", "صور حقيقية قابلة للحفظ", "text-sky-700"],
];

export default function SalatakOverview() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f6f3ec] p-8 text-[#173b3a]">
      <section className="mx-auto max-w-5xl rounded-[2rem] bg-[#fffcf6] p-8 shadow-sm ring-1 ring-[#d8ded7]">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm text-[#376762]">صلاتك · معاينة الويب</p>
            <h1 className="mt-2 text-4xl font-bold">رفيقك لكل صلاة وذكر</h1>
            <p className="mt-3 max-w-xl text-[#6b7a74]">
              معاينة محدثة للميزات الموجودة في تطبيق الهاتف، بما فيها القرآن الكامل، البوصلة، المحتوى الموثق، والخلفيات القابلة للحفظ.
            </p>
          </div>
          <div className="rounded-2xl bg-[#e4eee9] p-4 text-[#1f5a55]">
            <Moon size={28} />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([title, description, color]) => (
            <article key={title} className="rounded-2xl border border-[#d8ded7] bg-white p-5">
              <div className={`mb-5 ${color}`}>
                {title === "اتجاه القبلة" ? <Compass /> : title === "الخلفيات" ? <Download /> : title === "الأدعية والأذكار" ? <Heart /> : <ShieldCheck />}
              </div>
              <h2 className="font-bold">{title}</h2>
              <p className="mt-2 text-sm text-[#6b7a74]">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-[#173b3a] p-6 text-[#fff9ed]">
          <p className="text-sm text-[#b6d2cb]">مواقيت الصلاة</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-3xl font-bold">المغرب</p>
              <p className="mt-1 text-[#b6d2cb]">حسب موقعك الحالي</p>
            </div>
            <p className="text-5xl font-bold tracking-tight">٦:٥٩</p>
          </div>
        </div>
      </section>
    </main>
  );
}
