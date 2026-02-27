import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiMoon,
  FiSun,
  FiUsers,
  FiMessageCircle,
  FiCalendar,
  FiActivity,
  FiTrendingUp,
  FiPlayCircle,
  FiChevronDown,
  FiMenu,
  FiX,
  FiGlobe,
} from "react-icons/fi";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import { motion, AnimatePresence, useInView } from "framer-motion";
import "./App.css";

const heroLastWords = [
  "training.",
  "growth.",
  "community.",
  "support.",
  "connection.",
];

const partnerLogoUrls = [
  "https://logo.clearbit.com/nike.com",
  "https://logo.clearbit.com/adidas.com",
  "https://logo.clearbit.com/underarmour.com",
  "https://logo.clearbit.com/reebok.com",
  "https://logo.clearbit.com/puma.com",
  "https://logo.clearbit.com/gymshark.com",
  "https://logo.clearbit.com/peloton.com",
  "https://logo.clearbit.com/strava.com",
];
const heroVideo = "hero.mp4";

// Region/currency for pricing. Base prices are in GBP; rates are approximate.
const PRICING_REGIONS = {
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "United Kingdom",
    rateFromGbp: 1,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro (EU)",
    rateFromGbp: 1.17,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "United States",
    rateFromGbp: 1.27,
  },
  CAD: {
    code: "CAD",
    symbol: "C$",
    name: "Canada",
    rateFromGbp: 1.72,
  },
  AUD: {
    code: "AUD",
    symbol: "A$",
    name: "Australia",
    rateFromGbp: 1.93,
  },
  CHF: {
    code: "CHF",
    symbol: "CHF",
    name: "Switzerland",
    rateFromGbp: 1.12,
  },
  NGN: {
    code: "NGN",
    symbol: "₦",
    name: "Nigeria",
    rateFromGbp: 1900,
  },
  ZAR: {
    code: "ZAR",
    symbol: "R",
    name: "South Africa",
    rateFromGbp: 23,
  },
  KES: {
    code: "KES",
    symbol: "KSh",
    name: "Kenya",
    rateFromGbp: 165,
  },
  GHS: {
    code: "GHS",
    symbol: "₵",
    name: "Ghana",
    rateFromGbp: 16,
  },
  EGP: {
    code: "EGP",
    symbol: "E£",
    name: "Egypt",
    rateFromGbp: 60,
  },
  INR: {
    code: "INR",
    symbol: "₹",
    name: "India",
    rateFromGbp: 106,
  },
  AED: {
    code: "AED",
    symbol: "AED",
    name: "UAE",
    rateFromGbp: 4.67,
  },
  SAR: {
    code: "SAR",
    symbol: "SAR",
    name: "Saudi Arabia",
    rateFromGbp: 4.77,
  },
  SGD: {
    code: "SGD",
    symbol: "S$",
    name: "Singapore",
    rateFromGbp: 1.7,
  },
  JPY: {
    code: "JPY",
    symbol: "¥",
    name: "Japan",
    rateFromGbp: 192,
  },
  BRL: {
    code: "BRL",
    symbol: "R$",
    name: "Brazil",
    rateFromGbp: 6.4,
  },
  MXN: {
    code: "MXN",
    symbol: "MX$",
    name: "Mexico",
    rateFromGbp: 21.5,
  },
};

// Currencies that use whole numbers (no decimals) in display.
const NO_DECIMAL_CURRENCIES = ["NGN", "JPY", "KES", "INR", "EGP", "ZAR"];

function detectPricingRegion() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.startsWith("Africa/Lagos")) return "NGN";
    if (tz.startsWith("Africa/Nairobi")) return "KES";
    if (tz.startsWith("Africa/Johannesburg")) return "ZAR";
    if (tz.startsWith("Africa/Accra")) return "GHS";
    if (tz.startsWith("Africa/Cairo")) return "EGP";
    if (tz.startsWith("Africa/")) return "NGN";
    if (tz.startsWith("America/Toronto") || tz.startsWith("America/Vancouver"))
      return "CAD";
    if (tz.startsWith("America/Sao_Paulo")) return "BRL";
    if (tz.startsWith("America/Mexico")) return "MXN";
    if (tz.startsWith("America/")) return "USD";
    if (tz.startsWith("Europe/London")) return "GBP";
    if (tz.startsWith("Europe/Zurich")) return "CHF";
    if (tz.startsWith("Europe/")) return "EUR";
    if (tz.startsWith("Asia/Dubai")) return "AED";
    if (tz.startsWith("Asia/Riyadh")) return "SAR";
    if (tz.startsWith("Asia/Singapore")) return "SGD";
    if (tz.startsWith("Asia/Tokyo")) return "JPY";
    if (tz.startsWith("Asia/Kolkata")) return "INR";
    if (tz.startsWith("Asia/")) return "SGD";
    if (tz.startsWith("Australia/")) return "AUD";
  } catch {
    // ignore
  }
  const lang = navigator.language || "";
  if (lang.startsWith("en-GB") || lang.startsWith("en-IE")) return "GBP";
  if (lang.startsWith("en-AU")) return "AUD";
  if (lang.startsWith("en-CA") || lang.startsWith("fr-CA")) return "CAD";
  if (lang.startsWith("en-IN") || lang.startsWith("hi-")) return "INR";
  if (lang.startsWith("en-NG") || lang.includes("NG")) return "NGN";
  if (lang.startsWith("en-ZA") || lang.startsWith("af-")) return "ZAR";
  if (lang.startsWith("en-US") || lang.includes("US")) return "USD";
  if (["de", "fr", "es", "it", "pt", "nl"].some((l) => lang.startsWith(l)))
    return "EUR";
  return "GBP";
}

function formatPrice(gbpAmount, currencyKey) {
  const region = PRICING_REGIONS[currencyKey] || PRICING_REGIONS.GBP;
  const amount = gbpAmount * region.rateFromGbp;
  const noDecimals = NO_DECIMAL_CURRENCIES.includes(currencyKey);
  const formatted = noDecimals
    ? Math.round(amount).toLocaleString(undefined, { maximumFractionDigits: 0 })
    : amount.toFixed(2);
  return `${region.symbol}${formatted}`;
}

const FLOAT_FEATURES = [
  {
    id: "1",
    label: "Find partners",
    styleType: "darkPill",
    top: "6%",
    left: "0%",
    duration: 3.5,
    yOffset: -10,
    scalePulse: true,
    icon: FiUsers,
  },
  // {
  //   id: "2",
  //   label: "Trainers",
  //   styleType: "lightCard",
  //   subLabel: "Expert network",
  //   top: "20%",
  //   left: "0%",
  //   duration: 4,
  //   yOffset: 8,
  //   xOffset: -4,
  // },
  {
    id: "3",
    label: "Messaging",
    styleType: "darkPill",
    top: "34%",
    left: "0%",
    duration: 3.8,
    yOffset: -8,
    icon: FiMessageCircle,
  },
  // {
  //   id: "4",
  //   label: "Calendar sync",
  //   styleType: "lightCard",
  //   subLabel: "Never miss",
  //   top: "48%",
  //   left: "0%",
  //   duration: 4.2,
  //   yOffset: 6,
  //   xOffset: 5,
  // },
  {
    id: "5",
    label: "Communities",
    styleType: "darkPill",
    top: "62%",
    left: "0%",
    duration: 3.6,
    yOffset: -7,
    icon: FiUsers,
    scalePulse: true,
  },
  // { id: "6", label: "Progress", styleType: "gradientCard", top: "76%", left: "0%", duration: 4.5, yOffset: -5, icon: FiTrendingUp },
  {
    id: "7",
    label: "Smart match",
    styleType: "darkPill",
    top: "10%",
    right: "0%",
    duration: 3.2,
    yOffset: 9,
    xOffset: 4,
    icon: FiActivity,
  },
  // {
  //   id: "8",
  //   label: "Goals",
  //   styleType: "lightCard",
  //   subLabel: "Set & track",
  //   top: "26%",
  //   right: "0%",
  //   duration: 4.4,
  //   yOffset: -6,
  //   scalePulse: true,
  // },
  {
    id: "9",
    label: "Streaks",
    styleType: "darkPill",
    top: "42%",
    right: "0%",
    duration: 3.9,
    yOffset: 7,
    icon: FiTrendingUp,
  },
  // { id: "10", label: "Sync", styleType: "gradientCard", top: "56%", right: "0%", duration: 4.1, yOffset: -8, icon: FiCalendar, xOffset: -5 },
  {
    id: "11",
    label: "DMs",
    styleType: "darkPill",
    top: "68%",
    right: "0%",
    duration: 3.4,
    yOffset: 5,
    icon: FiMessageCircle,
  },
  // {
  //   id: "12",
  //   label: "Gym+1",
  //   styleType: "darkPill",
  //   top: "82%",
  //   right: "0%",
  //   duration: 4.6,
  //   yOffset: -6,
  //   scalePulse: true,
  //   icon: FiActivity,
  // },
];

function FloatingPhoneWithFeatures() {
  const constraintsRef = useRef(null);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24, duration: 0.5 }}
      ref={constraintsRef}
      className="relative mx-auto mt-14 flex justify-center sm:mt-20 min-h-[480px] w-full max-w-[300px] sm:min-h-[560px] sm:max-w-[340px] lg:min-h-[640px] lg:max-w-[420px] xl:min-h-[720px] xl:max-w-[480px]"
    >
      {/* iPhone */}
      <div className="relative flex flex-col items-center shrink-0">
        <div className="relative rounded-[2.75rem] border-[8px] border-neutral-900 bg-neutral-900 shadow-2xl shadow-black/50 sm:rounded-[3rem] sm:border-[10px] lg:rounded-[3.25rem] lg:border-[12px] xl:rounded-[3.5rem] xl:border-[14px]">
          <div className="absolute left-1/2 top-3 z-10 h-6 w-20 -translate-x-1/2 rounded-full bg-black sm:h-7 sm:w-24 lg:h-8 lg:w-28 xl:h-9 xl:w-32" />
          <div className="overflow-hidden rounded-[2rem] bg-black sm:rounded-[2.25rem] lg:rounded-[2.5rem] xl:rounded-[2.75rem]">
            <div className="relative h-[380px] w-[184px] overflow-hidden sm:h-[520px] sm:w-[230px] lg:h-[600px] lg:w-[280px] xl:h-[680px] xl:w-[320px]">
              <video
                src={heroVideo}
                className="h-full w-full object-cover object-top"
                autoPlay
                muted
                loop
                playsInline
              />
              {/* <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-2 pt-6 text-[8px] text-white/90 sm:pt-8 sm:text-[9px]">
                <span className="rounded-full bg-black/80 px-1.5 py-0.5 font-medium sm:px-2 sm:py-1">
                  Live demo
                </span>
                <span className="rounded-full bg-black/80 px-1.5 py-0.5 font-medium sm:px-2 sm:py-1">
                  Gym+1
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Draggable floating pills – reference style: dark pill, light card, gradient card */}
      {FLOAT_FEATURES.map((f) => {
        const Icon = f.icon;
        const isDarkPill = f.styleType === "darkPill";
        const isLightCard = f.styleType === "lightCard";
        const isGradientCard = f.styleType === "gradientCard";
        const xOffset = f.xOffset ?? 0;
        const style = {
          top: f.top,
          ...(f.left !== undefined ? { left: f.left } : { right: f.right }),
        };
        const hasScalePulse = f.scalePulse === true;
        return (
          <motion.div
            key={f.id}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.12}
            whileDrag={{ scale: 1.08 }}
            animate={{
              y: [0, f.yOffset, 0],
              ...(xOffset !== 0 && { x: [0, xOffset, 0] }),
              ...(hasScalePulse && { scale: [1, 1.08, 1] }),
            }}
            transition={{
              duration: f.duration,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={style}
            aria-label={`${f.label} – drag to reposition`}
            className={`absolute z-10 hidden cursor-grab items-center active:cursor-grabbing select-none touch-manipulation sm:flex ${
              isDarkPill
                ? "rounded-full bg-[#1A1A1A] px-3 py-2 shadow-[0_4px_14px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)] gap-2 text-white text-[10px] font-medium sm:px-3.5 sm:py-2.5 sm:text-xs lg:px-4 lg:py-3 lg:text-sm lg:gap-2.5 xl:px-4.5 xl:py-3 xl:text-base"
                : ""
            } ${
              isLightCard
                ? "rounded-xl bg-slate-100 px-3 py-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:bg-slate-800/90 dark:shadow-[0_4px_16px_rgba(0,0,0,0.25)] flex-col items-start min-w-[4.5rem] sm:min-w-[5rem] lg:min-w-[5.5rem] lg:px-3.5 lg:py-3 xl:min-w-[6rem] xl:px-4 xl:py-3.5"
                : ""
            } ${
              isGradientCard
                ? "rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.2)] min-w-[4rem] min-h-[2.5rem] sm:min-w-[4.5rem] sm:min-h-[2.75rem] lg:min-w-[5rem] lg:min-h-[3rem] xl:min-w-[5.5rem] xl:min-h-[3.25rem] bg-gradient-to-br from-violet-500 to-blue-600 text-white items-center justify-center"
                : ""
            }`}
          >
            {isDarkPill && (
              <>
                {Icon && (
                  <Icon className="h-4 w-4 shrink-0 text-white sm:h-4 sm:w-4 lg:h-5 lg:w-5 xl:h-5 xl:w-5" />
                )}
                <span className="truncate max-w-[4.5rem] sm:max-w-[5.5rem] lg:max-w-[6rem] xl:max-w-[7rem]">
                  {f.label}
                </span>
              </>
            )}
            {isLightCard && (
              <>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 sm:text-sm lg:text-base xl:text-lg">
                  {f.label}
                </span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 lg:text-xs xl:text-sm">
                  {f.subLabel}
                </span>
              </>
            )}
            {isGradientCard && (
              <>
                {Icon && (
                  <Icon className="h-5 w-5 shrink-0 sm:h-5 sm:w-5 lg:h-6 lg:w-6 xl:h-6 xl:w-6" />
                )}
                <span className="ml-1.5 text-[10px] font-semibold sm:text-xs lg:text-sm xl:text-base">
                  {f.label}
                </span>
              </>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("gymplus-theme");
    if (stored === "light" || stored === "dark") return stored;
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem("gymplus-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [pricingCurrency, setPricingCurrency] = useState(() => {
    if (typeof window === "undefined") return "GBP";
    return detectPricingRegion();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroLastWords.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScrollToWaitlist = () => {
    scrollToSection("waitlist");
  };

  const pricingPlansByBilling = useMemo(
    () => ({
      weekly: [
        {
          name: "Free Plan",
          priceGbp: null,
          cadence: "",
          description: "Basic access to connect with fitness partners",
          highlight: false,
          features: [
            "Detailed profiling: voice notes, video & prompts to showcase personality",
            "Up to 20 invites per day to find the perfect partner or trainer",
            "Create and join up to 3 communities per month",
            "Change location to other cities at no extra cost",
            "Zero obligation complete access to the core app experience",
          ],
          cta: "Get Started",
        },
        {
          name: "Super +1",
          priceGbp: 7.99,
          cadence: "per week",
          description: "Enhanced features for serious fitness partners",
          highlight: false,
          features: [
            "Unlimited likes and matches",
            "1 hour daily spotlight visibility",
            "View invitations & see invitees' profiles",
            "View full thread of other users' posts",
            "Premium profile (increased visibility)",
          ],
          cta: "Upgrade Now",
        },
        {
          name: "SuperPT",
          priceGbp: 11.99,
          cadence: "per week",
          description: "Complete toolkit for personal trainers",
          highlight: false,
          features: [
            "All Super +1 features",
            "List products/services for sale",
            "Business analytics dashboard",
            "Track client onboarding & sessions",
            "Unlimited community groups",
            "Premium trainer profile",
          ],
          cta: "Upgrade Now",
        },
      ],
      monthly: [
        {
          name: "Free Plan",
          priceGbp: null,
          cadence: "",
          description: "Basic access to connect with fitness partners",
          highlight: false,
          features: [
            "Detailed profiling: voice notes, video & prompts to showcase personality",
            "Up to 20 invites per day to find the perfect partner or trainer",
            "Create and join up to 3 communities per month",
            "Change location to other cities at no extra cost",
            "Zero obligation complete access to the core app experience",
          ],
          cta: "Get Started",
        },
        {
          name: "Super +1",
          priceGbp: 25,
          cadence: "per month",
          description: "Enhanced features for serious fitness partners",
          highlight: true,
          features: [
            "Unlimited likes and matches",
            "45 minutes spotlight visibility",
            "View invitations & see invitees' profiles",
            "View full thread of other users' posts",
            "Premium profile (increased visibility)",
          ],
          cta: "Upgrade Now",
        },
        {
          name: "SuperPT",
          priceGbp: 45,
          cadence: "per month",
          description: "Complete toolkit for personal trainers",
          highlight: false,
          features: [
            "All Super +1 features",
            "List products/services for sale",
            "Business analytics dashboard",
            "Track client onboarding & sessions",
            "Unlimited community groups",
            "Premium trainer profile",
          ],
          cta: "Upgrade Now",
        },
      ],
      yearly: [
        {
          name: "Free Plan",
          priceGbp: null,
          cadence: "",
          description: "Basic access to connect with fitness partners",
          highlight: false,
          features: [
            "Detailed profiling: voice notes, video & prompts to showcase personality",
            "Up to 20 invites per day to find the perfect partner or trainer",
            "Create and join up to 3 communities per month",
            "Change location to other cities at no extra cost",
            "Zero obligation complete access to the core app experience",
          ],
          cta: "Get Started",
        },
        {
          name: "Super +1",
          priceGbp: 279,
          cadence: "per year",
          description: "Enhanced features for serious fitness partners",
          highlight: false,
          features: [
            "Unlimited likes and matches",
            "1 hour per month spotlight visibility",
            "View invitations & see invitees' profiles",
            "View full thread of other users' posts",
            "Premium profile (increased visibility)",
          ],
          cta: "Upgrade Now",
        },
        {
          name: "SuperPT",
          priceGbp: 499,
          cadence: "per year",
          description: "Complete toolkit for personal trainers",
          highlight: false,
          features: [
            "All Super +1 features",
            "List products/services for sale",
            "Business analytics dashboard",
            "Track client onboarding & sessions",
            "Unlimited community groups",
            "Premium trainer profile",
          ],
          cta: "Upgrade Now",
        },
      ],
    }),
    [],
  );

  const faqs = [
    {
      question: "What is Gym+1?",
      answer:
        "Gym+1 is a fitness matching app that connects you with gym buddies who share similar goals, schedules, and routines so you can stay consistent together.",
    },
    {
      question: "How does the matching system work?",
      answer:
        "Our smart matching looks at your preferred workout times, fitness goals, locations, and training style to suggest the most compatible partners near you.",
    },
    {
      question: "Can I join group workouts?",
      answer:
        "Yes. Join open fitness communities or create small accountability squads to plan group sessions, challenges, and meetups.",
    },
    {
      question: "Is there a free version available?",
      answer:
        "Yes. The Free plan is the default: full app access including detailed profiling (voice, video, prompts), up to 20 invites per day, up to 3 communities per month, and no location charges. You become a Super +1 or Super PT when you have an active subscription.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes. You can cancel paid plans at any time, and your account will remain on the Free plan so you keep your connections.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-black dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <Navbar
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={scrollToSection}
        />

        <main className="mt-4 flex-1 space-y-20 pb-10 sm:mt-8 sm:space-y-24 lg:mt-10 lg:space-y-28">
          <Hero
            activeHeroIndex={activeHeroIndex}
            onWaitlistClick={handleScrollToWaitlist}
          />
          <SlidingPartnerLogos />
          <Features />
          <MediaSection onWaitlistClick={handleScrollToWaitlist} />
          <PricingSection
            plansByBilling={pricingPlansByBilling}
            currency={pricingCurrency ?? "GBP"}
            onCurrencyChange={setPricingCurrency}
            onPrimaryCtaClick={handleScrollToWaitlist}
          />
          <WaitlistSection />
          <FAQSection faqs={faqs} />
        </main>

        <Footer />
      </div>
    </div>
  );
}

function Navbar({ theme, onToggleTheme, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const handleNavClick = (target) => {
    onNavigate(target);
    closeMenu();
  };

  const navLinks = (
    <>
      <button
        type="button"
        onClick={() => handleNavClick("home")}
        className="relative inline-flex items-center gap-2 rounded-full px-3 py-1 text-slate-700 transition-colors hover:text-slate-300 dark:text-slate-200 dark:hover:text-slate-50"
      >
        <span className="relative">Home</span>
      </button>
      <button
        type="button"
        onClick={() => handleNavClick("about")}
        className="rounded-full px-3 py-1 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
      >
        About
      </button>
      <button
        type="button"
        onClick={() => handleNavClick("pricing")}
        className="rounded-full px-3 py-1 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
      >
        Pricing
      </button>
      <button
        type="button"
        onClick={() => handleNavClick("waitlist")}
        className="rounded-full px-3 py-1 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
      >
        Waitlist
      </button>
      <button
        type="button"
        onClick={() => handleNavClick("faq")}
        className="rounded-full px-3 py-1 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
      >
        FAQ
      </button>
    </>
  );

  return (
    <header className="sticky top-3 z-30 mb-4 rounded-lg border border-slate-200/70 bg-white/70 px-4 py-4 sm:py-2 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90 sm:px-8">
      <nav className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col">
            <span className="text-xl font-semibold tracking-tight sm:text-xl">
              Gym<span className="text-brand">+1</span>
            </span>
          </div>
        </div>

        <div className="hidden items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-300 sm:flex sm:text-sm">
          {navLinks}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow transition hover:border-slate-300 hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-200 dark:hover:border-neutral-700 dark:hover:bg-black sm:h-9 sm:w-9"
            aria-label="Toggle theme"
          >
            <AnimatePresence initial={false} mode="wait">
              {theme === "dark" ? (
                <motion.span
                  key="sun"
                  initial={{ opacity: 0, rotate: -45, y: 4 }}
                  animate={{ opacity: 1, rotate: 0, y: 0 }}
                  exit={{ opacity: 0, rotate: 45, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiSun className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ opacity: 0, rotate: 45, y: -4 }}
                  animate={{ opacity: 1, rotate: 0, y: 0 }}
                  exit={{ opacity: 0, rotate: -45, y: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiMoon className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow transition hover:border-slate-300 hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-200 dark:hover:border-neutral-700 dark:hover:bg-black sm:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <FiX className="h-5 w-5" />
            ) : (
              <FiMenu className="h-5 w-5" />
            )}
          </button>

          <motion.button
            type="button"
            onClick={() => onNavigate("waitlist")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="group relative hidden items-center gap-2 rounded-full bg-brand px-3 py-3 text-xs font-semibold text-slate-50 shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 sm:inline-flex sm:px-4 sm:text-sm"
          >
            <span>Join Waitlist</span>
            {/* <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white transition group-hover:bg-brand-hover">
              +
            </span> */}
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden sm:hidden"
          >
            <div className="flex flex-col gap-1 border-t mt-4 border-slate-200/70 pt-3 pb-2 dark:border-neutral-700/70">
              <div className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-300 [&_button]:w-full [&_button]:justify-start [&_button]:py-2.5 [&_button]:text-left [&_button]:rounded-lg">
                {navLinks}
              </div>
              <motion.button
                type="button"
                onClick={() => handleNavClick("waitlist")}
                whileTap={{ scale: 0.98 }}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-slate-50 transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <span>Join Waitlist</span>
                {/* <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                  +
                </span> */}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ activeHeroIndex, onWaitlistClick }) {
  const avatars = ["A", "J", "M", "K", "S"];
  // const matches = [
  //   { title: "Strength Partner", tag: "Powerlifting", color: "bg-rose-500" },
  //   { title: "Cardio Buddy", tag: "Running", color: "bg-cyan-500" },
  //   { title: "Yoga +1", tag: "Flexibility", color: "bg-violet-500" },
  // ];
  return (
    <section id="home" className="relative pt-1 text-center sm:pt-2">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-200/50 blur-3xl dark:bg-indigo-950/50" />
        <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-950/40" />
        <div className="absolute left-0 top-2/3 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-950/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:mb-8"
      >
        <div className="flex -space-x-3">
          {avatars.map((letter, i) => (
            <span
              key={i}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-semibold text-slate-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-200"
            >
              {letter}
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          50+ Users on our Waitlist
        </p>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="mx-auto max-w-4xl text-2xl font-medium leading-tight tracking-tight text-slate-900 md:text-[3.5rem] dark:text-slate-100"
      >
        Find the perfect gym buddy on{"  "}
        <span className="font-semibold">Gym+1</span> for{"  "}
        <span className="relative inline-block min-w-[6ch]">
          <span className="inline-block min-h-[1.2em] overflow-hidden align-bottom bg-brand/10 rounded-md px-1 py-0.5">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeHeroIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-blocks text-brand"
              >
                {heroLastWords[activeHeroIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        className="mx-auto mt-4 max-w-xs sm:max-w-md text-xs text-slate-600 dark:text-slate-300 sm:text-lg"
      >
        Connect and discover trainers and gym buddies all in one app.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-4"
      >
        <motion.button
          type="button"
          onClick={onWaitlistClick}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-3 rounded bg-slate-900 px-5 py-4 text-sm font-medium text-white shadow-lg transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <FaApple className="h-4 w-4" />
          <span>Get on iOS</span>
        </motion.button>
        <motion.button
          type="button"
          onClick={onWaitlistClick}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-3 rounded bg-slate-900 px-5 py-4 text-sm font-medium text-white shadow-lg transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <FaGooglePlay className="h-4 w-4" />
          <span>Get on Android</span>
        </motion.button>
      </motion.div>

      <FloatingPhoneWithFeatures />
    </section>
  );
}

function PartnerLogoItem({ src }) {
  return (
    <div className="flex h-14 w-28 shrink-0 items-center justify-center rounded border border-slate-200 bg-white px-5 py-3 dark:border-neutral-700 dark:bg-neutral-800/80">
      <img
        src={src}
        alt=""
        className="max-h-8 w-24 object-contain grayscale opacity-70 transition hover:grayscale-0 hover:opacity-100 dark:opacity-80 dark:hover:opacity-100"
        loading="lazy"
        onError={(e) => {
          e.target.style.display = "none";
          const next = e.target.nextElementSibling;
          if (next) next.classList.remove("hidden");
        }}
      />
      <span className="hidden text-xs font-medium text-slate-400">Partner</span>
    </div>
  );
}

function SlidingPartnerLogos() {
  return (
    <section
      className="rounded border border-slate-200 bg-white py-8 dark:border-neutral-800 dark:bg-neutral-900/50 sm:py-10"
      aria-label="Trusted by partners"
    >
      <p className="mb-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400 sm:mb-8 sm:text-base">
        Trusted by 100+ partners worldwide
      </p>
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent dark:from-neutral-900/50" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent dark:from-neutral-900/50" />
        <div
          className="flex animate-slide-logos"
          style={{ width: "max-content" }}
        >
          <div className="flex shrink-0 items-center gap-12 pr-12" aria-hidden>
            {partnerLogoUrls.map((url, i) => (
              <PartnerLogoItem key={`a-${i}`} src={url} />
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-12 pr-12" aria-hidden>
            {partnerLogoUrls.map((url, i) => (
              <PartnerLogoItem key={`b-${i}`} src={url} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const featureItems = [
    {
      icon: <FiUsers className="h-5 w-5" />,
      title: "Find Workout Partners",
      description:
        "Connect with like-minded fitness enthusiasts nearby based on your goals, experience level, and schedule.",
      pill: "Smart matching",
    },
    {
      icon: <FiActivity className="h-5 w-5" />,
      title: "Connect with Trainers",
      description:
        "Get expert advice, quick form checks, and personalised plans from certified trainers in your network.",
      pill: "Trainer network",
    },
    {
      icon: <FiMessageCircle className="h-5 w-5" />,
      title: "In-App Messaging",
      description:
        "Chat with your new gym buddies, drop session updates, and share wins to keep everyone accountable.",
      pill: "DMs built-in",
    },
  ];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      id="about"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="rounded border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50 sm:p-8 lg:p-10"
    >
      <div className="mb-8 sm:mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Designed for your everyday life
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
          Whether you&apos;re matching with partners, syncing schedules, or
          joining communities — our app adapts to your fitness goals
          effortlessly.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featureItems.map((item) => (
          <motion.article
            key={item.title}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="group relative overflow-hidden rounded border border-slate-200 bg-slate-50/50 p-5 dark:border-neutral-700/50 dark:bg-neutral-800/30 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                {item.icon}
              </div>
              <span className="rounded border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-300">
                {item.pill}
              </span>
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {item.description}
            </p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

function MediaSection({ onWaitlistClick }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50 sm:p-8 lg:p-10">
      <div className="mb-8 sm:mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Never miss a workout
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
          Coordinate sessions, lock in times that work for everyone, and see at
          a glance when your gym buddies are training. No more ghosting on leg
          day.
        </p>
      </div>

      <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-12">
        <div className="relative order-2 md:order-1">
          <div className="relative overflow-hidden rounded border border-slate-200 bg-neutral-900 dark:border-neutral-700 dark:bg-neutral-900">
            <img
              src="https://images.pexels.com/photos/3837781/pexels-photo-3837781.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Gym partners working out together"
              className="h-56 w-full object-cover sm:h-72 md:h-80"
              loading="lazy"
            />
            <div className="flex flex-col gap-3 border-t border-slate-800/80 bg-neutral-800 p-4 dark:border-neutral-700 dark:bg-neutral-800 md:p-5">
              <p className="text-sm font-semibold text-slate-50 dark:text-slate-100">
                Ready to level up your fitness journey?
              </p>
              <p className="text-xs text-slate-300 dark:text-slate-400 sm:text-sm">
                Connect with fitness partners or trainers, stay motivated, and
                crush your goals — together.
              </p>
              <motion.button
                type="button"
                onClick={onWaitlistClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex w-fit items-center justify-center gap-2 rounded bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <span>Download Now</span>
                <span className="text-slate-500">→</span>
              </motion.button>
            </div>
          </div>
        </div>

        <div className="order-1 space-y-6 md:order-2">
          <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            {[
              "Shared availability with auto-suggestions for optimal times to train together.",
              "Integrated reminders so you never miss a gym day with your +1.",
              "Perfect for accountability squads, small group classes, and PT clients.",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-900 text-[10px] font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                  ✓
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <div className="rounded border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/50">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                4.9
              </span>{" "}
              — Average satisfaction from early testers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection({
  plansByBilling,
  currency,
  onCurrencyChange,
  onPrimaryCtaClick,
}) {
  const [billing, setBilling] = useState("monthly");
  const [regionOpen, setRegionOpen] = useState(false);
  const regionRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (regionRef.current && !regionRef.current.contains(e.target)) {
        setRegionOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentRegion = PRICING_REGIONS[currency] || PRICING_REGIONS.GBP;
  const plans =
    plansByBilling[billing] ||
    plansByBilling.monthly ||
    plansByBilling.weekly ||
    [];

  return (
    <section
      id="pricing"
      className="rounded border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50 sm:p-8 lg:p-10"
    >
      <div className="mb-8 sm:mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Subscription plans for +1s and PTs
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
          You become a Super +1 or Super PT when you have an active
          subscription; otherwise you're on the free plan by default. No hidden
          fees upgrade anytime.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100/70 p-1 text-xs font-medium dark:border-neutral-700 dark:bg-neutral-800/80">
            <button
              type="button"
              onClick={() => setBilling("weekly")}
              className={`rounded-full px-3 py-1 transition ${
                billing === "weekly"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-3 py-1 transition ${
                billing === "monthly"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={`rounded-full px-3 py-1 transition ${
                billing === "yearly"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              Yearly
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              View prices in:
            </span>
            <div className="relative" ref={regionRef}>
              <button
                type="button"
                onClick={() => setRegionOpen((o) => !o)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
              >
                <FiGlobe className="h-4 w-4" />
                {currentRegion.name} ({currentRegion.symbol})
                <FiChevronDown
                  className={`h-4 w-4 transition ${regionOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {regionOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full z-10 mt-1 max-h-[min(60vh,320px)] min-w-[200px] overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    {Object.entries(PRICING_REGIONS).map(([code, region]) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          onCurrencyChange(code);
                          setRegionOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition ${
                          currency === code
                            ? "bg-slate-100 font-medium text-slate-900 dark:bg-slate-700 dark:text-slate-100"
                            : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-neutral-700"
                        }`}
                      >
                        <span className="text-base">{region.symbol}</span>
                        {region.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <motion.article
            key={plan.name}
            whileHover={{ y: plan.highlight ? -4 : -2 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className={`relative flex flex-col rounded border p-5 sm:p-6 ${
              plan.highlight
                ? "border-slate-700 bg-slate-900 dark:border-neutral-600 dark:bg-slate-100"
                : "border-slate-200 bg-slate-50/50 dark:border-neutral-700 dark:bg-neutral-800/30"
            }`}
          >
            <div className="mb-4 mt-1">
              {billing === "monthly" && plan.name === "Super +1" && (
                <span className="mb-2 inline-block rounded bg-white/20 px-2 py-0.5 text-xs font-medium text-white dark:bg-slate-900/20 dark:text-slate-800">
                  Most popular
                </span>
              )}
              <h3
                className={`text-base font-semibold sm:text-lg ${plan.highlight ? "text-white dark:text-slate-900" : "text-slate-900 dark:text-slate-50"}`}
              >
                {plan.name}
              </h3>
              <p
                className={`mt-1 text-xs sm:text-sm ${plan.highlight ? "text-white/90 dark:text-slate-700" : "text-slate-500 dark:text-slate-400"}`}
              >
                {plan.description}
              </p>
            </div>

            <div
              className={`mb-4 flex items-baseline gap-1 ${plan.highlight ? "text-white dark:text-slate-900" : "text-slate-900 dark:text-slate-50"}`}
            >
              <span className="text-2xl font-bold sm:text-3xl">
                {plan.priceGbp == null
                  ? "Free"
                  : formatPrice(plan.priceGbp, currency)}
              </span>
              {plan.cadence && (
                <span
                  className={
                    plan.highlight
                      ? "text-sm text-white/80 dark:text-slate-600"
                      : "text-sm text-slate-500 dark:text-slate-400"
                  }
                >
                  {plan.cadence}
                </span>
              )}
            </div>

            <ul className="mb-5 space-y-2.5 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded text-[9px] font-semibold ${
                      plan.highlight
                        ? "bg-white/20 text-white dark:bg-slate-900/40 dark:text-slate-900"
                        : "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    }`}
                  >
                    ✓
                  </span>
                  <span
                    className={
                      plan.highlight
                        ? "text-white/95 dark:text-slate-800"
                        : "text-slate-600 dark:text-slate-300"
                    }
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-2">
              <motion.button
                type="button"
                onClick={onPrimaryCtaClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`inline-flex w-full items-center justify-center gap-2 rounded px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  plan.highlight
                    ? "bg-white text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-400 dark:ring-offset-slate-100"
                    : "border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-50 dark:hover:bg-neutral-700 dark:focus-visible:ring-neutral-600"
                }`}
              >
                <span>{plan.cta}</span>
                <span>→</span>
              </motion.button>
              {plan.name !== "Free Plan" && (
                <p
                  className={`text-center text-xs ${plan.highlight ? "text-white/80 dark:text-slate-600" : "text-slate-500 dark:text-slate-400"}`}
                >
                  Cancel anytime
                </p>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function WaitlistSection() {
  return (
    <section
      id="waitlist"
      className="scroll-mt-28 rounded border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50 sm:p-8 lg:p-10"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Join the Gym+1 waitlist
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Be the first to access our iOS and Android apps, early community
            drops, and exclusive launch offers for partners and trainers.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:shrink-0"
        >
          <div className="flex -space-x-3">
            {["A", "J", "M", "K", "S"].map((letter, i) => (
              <span
                key={i}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-semibold text-slate-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-200"
              >
                {letter}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            50+ Users on our Waitlist
          </p>
        </motion.div>
      </div>

      <div className="rounded border border-slate-200 bg-slate-50/50 p-5 dark:border-neutral-700 dark:bg-neutral-800/30 sm:p-6">
        <form
          className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start lg:space-y-0"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            form.reset();
          }}
        >
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label
                htmlFor="waitlist-name"
                className="text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                Name
              </label>
              <input
                id="waitlist-name"
                name="name"
                type="text"
                required
                placeholder="Alex Johnson"
                className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-brand/0 transition focus:border-brand/70 focus:ring-2 focus:ring-brand/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-50 dark:focus:border-brand/80 dark:focus:ring-brand/30"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="waitlist-email"
                className="text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                Email
              </label>
              <input
                id="waitlist-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-brand/0 transition focus:border-brand/70 focus:ring-2 focus:ring-brand/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-50 dark:focus:border-brand/80 dark:focus:ring-brand/30"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="waitlist-goal"
                className="text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                Your primary goal
              </label>
              <select
                id="waitlist-goal"
                name="goal"
                className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none ring-brand/0 transition focus:border-brand/70 focus:ring-2 focus:ring-brand/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-100 dark:focus:border-brand/80 dark:focus:ring-brand/30"
                defaultValue="default"
              >
                <option value="default" disabled>
                  Choose a goal
                </option>
                <option value="lose-weight">Lose weight</option>
                <option value="build-muscle">Build muscle</option>
                <option value="get-stronger">Get stronger</option>
                <option value="stay-consistent">Stay consistent</option>
                <option value="train-for-event">Train for an event</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="waitlist-role"
                className="text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                I&apos;m joining as
              </label>
              <select
                id="waitlist-role"
                name="role"
                className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none ring-brand/0 transition focus:border-brand/70 focus:ring-2 focus:ring-brand/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-100 dark:focus:border-brand/80 dark:focus:ring-brand/30"
                defaultValue="partner"
              >
                <option value="partner">Fitness partner</option>
                <option value="trainer">Personal trainer / coach</option>
                <option value="community-lead">Community lead</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="waitlist-message"
                className="text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                Anything else you&apos;d like us to know?{" "}
                <span className="text-slate-400">(optional)</span>
              </label>
              <textarea
                id="waitlist-message"
                name="message"
                rows={2}
                placeholder="Tell us about your training style, your gym, or the kind of partner you’re looking for."
                className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-brand/0 transition focus:border-brand/70 focus:ring-2 focus:ring-brand/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-50 dark:focus:border-brand/80 dark:focus:ring-brand/30"
              />
            </div>
          </div>

          <div className="space-y-4 rounded border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-slate-300 lg:space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Choose your platform
            </p>
            <p>
              Download from the App Store or Play Store as soon as we launch.
              Join the waitlist to be first in line.
            </p>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex w-full items-center justify-center gap-2 rounded bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <span>Join waitlist</span>
              <span>→</span>
            </motion.button>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Free accounts can join up to 3 groups; paid plans unlock unlimited
              access and advanced tools for trainers.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

function FAQSection({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      id="faq"
      className="rounded border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50 sm:p-8 lg:p-10"
    >
      <div className="mb-8 sm:mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Frequently asked questions
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
          Got questions about Gym+1? We’ve got answers. Here’s everything you
          need to get started with your fitness journey.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((item, index) => (
          <motion.div
            key={item.question}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05 * index + 0.15, duration: 0.35 }}
            className="overflow-hidden rounded border border-slate-200 bg-slate-50/50 dark:border-neutral-700 dark:bg-neutral-800/30"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-slate-100/80 dark:hover:bg-neutral-700/30 sm:p-5"
            >
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">
                {item.question}
              </span>
              <motion.span
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0 text-slate-500 dark:text-slate-400"
              >
                <FiChevronDown className="h-5 w-5" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="border-t border-slate-200 dark:border-neutral-700"
                >
                  <p className="p-4 pt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:p-5 sm:pt-2">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function Footer() {
  return (
    <footer className="mt-12 sm:mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded border border-slate-200 bg-white px-6 py-8 dark:border-neutral-800 dark:bg-neutral-900/60 dark:shadow-none sm:px-8 sm:py-10">
          <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            {/* Brand */}
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-xl">
                Gym<span className="text-brand">+1</span>
              </span>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Find your fitness partner. Train together, stay accountable.
              </p>
            </div>
            {/* Links */}
            <nav
              className="flex flex-wrap items-center justify-center gap-6 sm:gap-8"
              aria-label="Footer"
            >
              <button
                type="button"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
              >
                Privacy
              </button>
              <button
                type="button"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
              >
                Terms
              </button>
            </nav>
          </div>
          <div className="mt-8 flex flex-col items-center border-t border-slate-200 pt-6 dark:border-neutral-700 sm:mt-10 sm:flex-row sm:justify-between sm:pt-8">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Gym+1. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default App;
