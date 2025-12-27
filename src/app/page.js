"use client";
import "./globals.css";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { TextPlugin } from "gsap/TextPlugin";
import "./index.css";

function Page() {
  useGSAP(() => {
    // التحقق من window لأمان SSR
    if (typeof window === "undefined") return;

    gsap.registerPlugin(SplitText, ScrollTrigger, TextPlugin);

    let mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 1023px)",
        isSmallMobile: "(max-width: 640px)",
      },
      (context) => {
        let { isDesktop, isMobile, isSmallMobile } = context.conditions;

        // Papyrus scraps animation
        gsap.set(".papyrus", {
          y: "random(0,150)",
          scale: isMobile ? "random(0.2,0.4)" : "random(0.3,0.7)",
          opacity: isSmallMobile ? 0.2 : 0.4,
        });

        gsap.fromTo(
          ".papyrus",
          {
            x: () => `random(0,${window.innerWidth})`,
          },
          {
            x: () => `random(0,-${window.innerWidth})`,
            duration: isMobile ? 15 : 10,
            ease: "none",
            stagger: {
              repeat: -1,
              yoyo: true,
            },
          }
        );

        // start Introduce Animation
        const introTL = gsap.timeline({
          defaults: {
            duration: 1.5,
            ease: "power3.out",
          },
        });

        introTL
          .from(".hero-section", {
            clipPath: isMobile
              ? "inset(20% 5% 20% 5%)"
              : "inset(50% 20% 50% 20%)",
          })
          .from(
            ".text-hero",
            {
              opacity: 0,
              y: 30,
              text: {
                value: "original",
                type: "chars",
                mask: true,
              },
            },
            "<20%"
          );

        // start Hero Section Animation (Parallax)
        const HeroTl = gsap
          .timeline({
            defaults: {
              duration: 2,
              ease: "power3.out",
            },
            scrollTrigger: {
              trigger: ".hero-section",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          })
          .to(
            ".hieroglyph-lg",
            {
              scale: isMobile ? 1.2 : 1.5,
              y: isMobile ? 50 : 0,
            },
            0
          )
          .to(
            ".column-1",
            {
              y: isMobile ? 100 : 200,
            },
            0
          )
          .to(
            ".column-2",
            {
              y: isMobile ? -100 : -200,
            },
            0
          );

        // Horizontal Scroll Animation
        const slides = gsap.utils.toArray(".slide");
        const horizontalSection = document.querySelector(".horizontal-section");

        if (slides.length > 0 && horizontalSection) {
          const totalWidth = slides.length * window.innerWidth;
          const scrollDistance = totalWidth - window.innerWidth;

          const HS = gsap.to(slides, {
            xPercent: -100 * (slides.length - 1),
            ease: "none",
            scrollTrigger: {
              trigger: horizontalSection,
              pin: true,
              start: "top top",
              end: () => `+=${scrollDistance}`,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              snap: {
                snapTo: 1 / (slides.length - 1),
                delay: 0,
                ease: "expo.out",
              },
            },
          });

          // Animation for each slide
          slides.forEach((slide, index) => {
            const slideElements = slide.querySelectorAll(
              "h3, h2, p, img, button"
            );

            if (slideElements.length > 0) {
              gsap.from(slideElements, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: slide,
                  containerAnimation: HS,
                  start: "left center",
                  end: "right center",
                  toggleActions: "play reverse play reverse",
                },
              });
            }
          });
        }

        // frames (clipUP-Animation)
        const frames = gsap.utils.toArray(".frame-slide");
        gsap.set(frames, { zIndex: (i) => -i + 3 });
        const framesTl = gsap.timeline({
          defaults: {
            ease: "none",
          },
          scrollTrigger: {
            trigger: ".frame",
            start: "top top",
            end: () => `+=${frames.length * window.innerHeight}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / frames.length,
              delay: 0,
              ease: "power2.out",
            },
          },
        });

        frames.forEach((el, ind) => {
          framesTl.to(
            el,
            {
              clipPath:
                ind != frames.length - 1
                  ? "inset(0 0 100% 0)"
                  : "inset(0 0 0 0)",
              autoAlpha: true,
            },
            ">"
          );
        });
      }
    );
  }, []);

  const [selectedStory, setSelectedStory] = useState(null);
  const modalRef = useRef(null);

  const openModal = (story) => {
    setSelectedStory(story);
    gsap.fromTo(
      ".modal-overlay",
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );
    gsap.fromTo(
      ".modal-content",
      { scale: 0.8, opacity: 0, y: 50 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "back.out(1.7)",
      }
    );
  };

  const closeModal = () => {
    gsap.to(".modal-content", {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.4,
      ease: "power2.in",
    });
    gsap.to(".modal-overlay", {
      opacity: 0,
      duration: 0.4,
      delay: 0.1,
      ease: "power2.in",
      onComplete: () => setSelectedStory(null),
    });
  };

  const Texts = [
    {
      chapter: "الرواية الأولى",
      title: "كنوز توت عنخ آمون",
      text: "اكتشاف المقبرة الملكية التي حُفظت لآلاف السنين، تروي قصة الفرعون الذهبي وحضارة تعرف أسرار الخلود.",
      img: "/Egyptian-Museum/tutankhamun-mask.jpg",
      details:
        "تعتبر مقبرة توت عنخ آمون (KV62) في وادي الملوك هي المقبرة الملكية الوحيدة التي عُثر عليها كاملة تقريبًا. اكتشفها هوارد كارتر في عام 1922، وضمت أكثر من 5000 قطعة أثرية، بما في ذلك القناع الذهبي الشهير والتابوت الذهبي الخالص. تروي هذه الكنوز قصة حياة وموت الملك الشاب الذي حكم مصر في الأسرة الثامنة عشرة.",
    },
    {
      chapter: "الرواية الثانية",
      title: "ملوك وفراعنة",
      text: "من نارمر موحد القطرين إلى كليوباترا آخر البطالمة، سيرة حكام صنعوا التاريخ وتركوا أثراً لا يمحى.",
      img: "/Egyptian-Museum/sarcophagus.jpg",
      details:
        "على مر العصور، حكم مصر ملوك عظام بنوا الأهرامات والمعابد ووسعوا حدود الإمبراطورية. من الملك مينا (نارمر) الذي وحد القطرين، إلى تحتمس الثالث 'نابليون الشرق'، ورمسيس الثاني العظيم، وصولاً إلى كليوباترا السابعة. كل ملك ترك بصمة فريدة في تاريخ البشرية من خلال العمارة والفنون والعلوم.",
    },
    {
      chapter: "الرواية الثالثة",
      title: "الحياة اليومية",
      text: "كيف عاش المصريون القدماء؟ من الزراعة إلى الصناعة، من التعليم إلى الترفيه، حضارة كاملة تنبض بالحياة.",
      img: "/Egyptian-Museum/daily-life.jpg",
      details:
        "لم تكن حياة المصري القديم مقتصرة على بناء القبور والمعابد، بل كانت حياة غنية بالتفاصيل. عملوا في الزراعة على ضفاف النيل، وبرعوا في الطب والرياضيات والفلك. كان لديهم نظام تعليمي متطور، واهتموا بالرياضة والموسيقى والألعاب مثل 'السنت'. تعكس الآثار اليومية تفاصيل ملابسهم وطعامهم وعلاقاتهم الأسرية.",
    },
    {
      chapter: "الرواية الرابعة",
      title: "الآلهة والمعتقدات",
      text: "عالم من الأساطير والطقوس، حيث الآلهة تتجسد في حجر، والإيمان يصنع فنوناً تعانق الخلود.",
      img: "/Egyptian-Museum/god-statues.jpg",
      details:
        "كان الدين محور حياة المصريين القدماء، حيث اعتقدوا في البعث والخلود والحياة الأخرى. عبدوا آلهة عديدة مثل رع (إله الشمس)، وأوزيريس (إله الموتى)، وإيزيس (رمز الوفاء). بنوا المعابد الضخمة كبيوت للآلهة، وطوروا فن التحنيط للحفاظ على الجسد لرحلة الأبدية. أساطيرهم تعكس فلسفتهم العميقة حول الكون والعدالة (ماعت).",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* First Hero Section */}
      <section
        className="hero-section relative flex-center overflow-hidden w-screen h-screen"
        style={{
          backgroundImage: "url('/Egyptian-Museum/museum-hall.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maxWidth: "100vw",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="text-hero absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center text-center max-w-2xl px-4">
          <h2 className="text-lg md:text-2xl font-light mb-4 tracking-widest text-amber-100 uppercase">
            المتحف المصري بالقاهرة
          </h2>
          <h1 className="text-5xl md:text-9xl font-bold mb-8 tracking-tighter bg-linear-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
            تراث الخلود
          </h1>
          <p className="text-base md:text-2xl font-light leading-relaxed text-amber-50/90 max-w-xl">
            بيت الكنوز الذي يحرس أسرار خمسة آلاف عام، حيث الحجر يتكلم والذهب
            يروي، والبرديات تحفظ حكمة الأجداد.
          </p>
        </div>
        <div className="imgs absolute w-full h-full">
          {/* Papyrus Scraps */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`papyrus-${i}`}
              className={`absolute papyrus ${
                i === 0
                  ? "top-10 left-10"
                  : i === 1
                  ? "top-20 right-20"
                  : i === 2
                  ? "bottom-20 left-20"
                  : i === 3
                  ? "bottom-10 right-10"
                  : i === 4
                  ? "top-1/3 left-1/4"
                  : "bottom-1/3 right-1/4"
              }`}
            >
              <Image
                src="/Egyptian-Museum/papyrus-scroll.jpg"
                width={200}
                height={200}
                alt="بردية مصرية"
                className="bg-transparent rounded-full opacity-40"
              />
            </div>
          ))}
          {/* Large Hieroglyphs */}
          {[...Array(2)].map((_, i) => (
            <div
              key={`hieroglyph-${i}`}
              className={`absolute bottom-0 ${
                i === 0 ? "left-0" : "right-0"
              } w-1/2`}
            >
              <Image
                style={
                  i === 1
                    ? {
                        transform: "rotateY(180deg)",
                        backgroundColor: "transparent",
                      }
                    : null
                }
                src="/Egyptian-Museum/stone-column.png"
                width={500}
                height={800}
                alt="نقش هيروغليفي كبير"
                className={`bg-transparent hieroglyph-lg absolute bottom-0 ${
                  i === 0 ? "left-0" : "right-0"
                } hieroglyph-lg-${i + 1} opacity-30`}
              />
            </div>
          ))}
          {/* Egyptian Columns */}
          <div className="absolute top-0 right-0">
            <Image
              src="/Egyptian-Museum/stone-column.png"
              width={500}
              height={800}
              alt="عمود مصري على اليمين"
              className="bg-transparent column-1 opacity-20"
              style={{ transform: "scaleX(-1)" }}
            />
          </div>
          <div className="absolute bottom-0 left-0">
            <Image
              src="/Egyptian-Museum/stone-column.png"
              width={500}
              height={800}
              alt="عمود مصري على اليسار"
              className="bg-transparent column-2 opacity-20"
            />
          </div>
          <div className="absolute bottom-0 right-0">
            <Image
              src="/Egyptian-Museum/stone-column.png"
              width={500}
              height={800}
              alt="عمود مصري على اليمين"
              className="bg-transparent column-2 opacity-20"
              style={{ transform: "scaleX(-1)" }}
            />
          </div>
        </div>
      </section>
      {/* Horizontal Scroll Section */}
      <section className="horizontal-section w-screen h-screen flex items-center overflow-hidden bg-linear-to-br from-amber-50 to-stone-100">
        <div className="horizontal-animation flex flex-nowrap h-full">
          {Texts.map((item, i) => {
            return (
              <div
                key={i}
                className="w-screen h-screen slide flex flex-col items-center justify-center shrink-0 p-8"
                style={{
                  background:
                    i % 2 === 0
                      ? "linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)"
                      : "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                }}
              >
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 max-w-7xl mx-auto w-full">
                  {/* Text Column */}
                  <div className="w-full md:w-1/2 text-center md:text-left space-y-4 md:space-y-6">
                    <h3 className="text-amber-700 font-medium tracking-widest uppercase text-xs md:text-base">
                      {item.chapter}
                    </h3>
                    <h2 className="text-3xl md:text-6xl font-bold text-stone-800 leading-tight">
                      {item.title}
                    </h2>
                    <p className="text-base md:text-xl font-light text-stone-600 leading-relaxed max-w-lg">
                      {item.text}
                    </p>
                    <div className="pt-2 md:pt-4">
                      <button
                        onClick={() => openModal(item)}
                        className="px-5 py-2.5 md:px-6 md:py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors duration-300 shadow-lg text-sm md:text-base"
                      >
                        اكتشف المزيد
                      </button>
                    </div>
                  </div>

                  {/* Image Column */}
                  <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                    <div className="relative w-full max-w-[280px] md:max-w-md aspect-3/4 shadow-2xl rounded-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500 border-4 border-white">
                      <Image
                        src={item.img}
                        fill
                        alt={`صورة ${i + 1}`}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-stone-900/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* clipUP-Animation Section */}
      <section className="clipUP-section h-screen relative flex items-center justify-center overflow-hidden">
        <div className="relative frame size-full">
          <div className="MgSlide frame-slide absolute inset-0 size-full flex-center">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative text-center space-y-4 md:space-y-8 z-10 px-4">
              <h1 className="text-3xl md:text-7xl font-bold text-amber-100 mb-2 md:mb-4">
                قاعة المومياوات الملكية
              </h1>
              <p className="text-base md:text-xl text-amber-200 max-w-2xl mx-auto">
                حيث ترقد ملوك مصر العظام في راحة أبدية
              </p>
            </div>
          </div>
          <div className="MgSlide frame-slide absolute inset-0 size-full flex-center">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative text-center space-y-4 md:space-y-8 z-10 px-4">
              <h1 className="text-3xl md:text-7xl font-bold text-white mb-2 md:mb-4">
                قاعة المجوهرات الملكية
              </h1>
              <p className="text-base md:text-xl text-yellow-200 max-w-2xl mx-auto">
                بريق الذهب والأحجار الكريمة التي تروي قصص العظمة
              </p>
            </div>
          </div>
          <div className="MgSlide frame-slide absolute inset-0 size-full flex-center">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative text-center space-y-4 md:space-y-8 z-10 px-4">
              <h1 className="text-3xl md:text-7xl font-bold text-white mb-2 md:mb-4">
                قاعة الآثار اليونانية الرومانية
              </h1>
              <p className="text-base md:text-xl text-cyan-200 max-w-2xl mx-auto">
                حيث تلتقي حضارات البحر المتوسط في أرض الكنانة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Overlay */}
      {selectedStory && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="modal-content relative bg-stone-100 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors text-stone-800 md:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Image */}
            <div className="w-full md:w-1/2 h-48 md:h-auto relative shrink-0">
              <Image
                src={selectedStory.img}
                fill
                alt={selectedStory.title}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 text-white">
                <h3 className="text-amber-400 font-medium tracking-widest uppercase text-xs md:text-sm mb-1 md:mb-2">
                  {selectedStory.chapter}
                </h3>
                <h2 className="text-2xl md:text-3xl font-bold">
                  {selectedStory.title}
                </h2>
              </div>
            </div>

            {/* Modal Text Content */}
            <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-stone-50 overflow-y-auto">
              <div className="space-y-4 md:space-y-6">
                <div className="w-12 h-1 bg-amber-600"></div>
                <p className="text-stone-700 text-base md:text-lg leading-relaxed font-light">
                  {selectedStory.details}
                </p>
                <div className="pt-4 md:pt-6">
                  <button
                    onClick={closeModal}
                    className="w-full md:w-auto px-8 py-3 bg-stone-800 text-white rounded-xl font-medium hover:bg-stone-900 transition-colors duration-300 shadow-lg"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
