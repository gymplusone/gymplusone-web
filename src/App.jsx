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
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiLogOut,
  FiHeart,
  FiBell,
  FiSettings,
  FiPlus,
  FiSearch,
  FiShoppingBag,
  FiBookOpen,
  FiStar,
} from "react-icons/fi";
import { FaGooglePlay, FaApple, FaGoogle, FaFacebook } from "react-icons/fa";
import { motion, AnimatePresence, useInView } from "framer-motion";
import "./App.css";
import gymPlusOneLogo from "./assets/gymplusone-logo.svg";

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

  // State variables for routing and auth
  const [view, setView] = useState("landing"); // 'landing' | 'auth' | 'experience' | 'trainer-details' | 'dashboard'
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroLastWords.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view]);

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
          currentView={view}
          setView={setView}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />

        <main className="mt-4 flex-1 space-y-20 pb-10 sm:mt-8 sm:space-y-24 lg:mt-10 lg:space-y-28">
          {view === "landing" && (
            <>
              <Hero
                activeHeroIndex={activeHeroIndex}
                onWaitlistClick={handleScrollToWaitlist}
              />
              {/* <SlidingPartnerLogos /> */}
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
            </>
          )}

          {view === "auth" && (
            <AuthView
              setView={setView}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          )}

          {view === "experience" && (
            <ExperienceView
              setView={setView}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          )}

          {view === "trainer-details" && (
            <TrainerDetailsView
              setView={setView}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          )}

          {view === "dashboard" && (
            <DashboardView
              setView={setView}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          )}

          {view === "marketplace" && (
            <MarketplaceView
              setView={setView}
              currentUser={currentUser}
              pricingCurrency={pricingCurrency}
            />
          )}

          {view === "blog" && (
            <BlogView
              setView={setView}
              currentUser={currentUser}
            />
          )}

          {view === "terms" && (
            <TermsView setView={setView} />
          )}

          {view === "privacy" && (
            <PrivacyView setView={setView} />
          )}

          {view === "cookies" && (
            <CookiePolicyView setView={setView} />
          )}
        </main>

        <Footer setView={setView} />
      </div>
    </div>
  );
}

function Navbar({ theme, onToggleTheme, onNavigate, currentView, setView, currentUser, setCurrentUser }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const handleNavClick = (target) => {
    if (currentView !== "landing") {
      setView("landing");
      setTimeout(() => {
        onNavigate(target);
      }, 50);
    } else {
      onNavigate(target);
    }
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
        onClick={() => { setView("marketplace"); closeMenu(); }}
        className={`rounded-full px-3 py-1 transition-colors ${
          currentView === "marketplace"
            ? "text-brand font-bold dark:text-white"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
        }`}
      >
        Marketplace
      </button>
      <button
        type="button"
        onClick={() => { setView("blog"); closeMenu(); }}
        className={`rounded-full px-3 py-1 transition-colors ${
          currentView === "blog"
            ? "text-brand font-bold dark:text-white"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
        }`}
      >
        Blog
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
      <a href="/games" className="rounded-full px-3 py-1 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50">Games</a>
    </>
  );

  return (
    <header className="sticky top-3 z-30 mb-4 rounded-lg border border-slate-200/70 bg-white/70 px-4 py-4 sm:py-2 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90 sm:px-8">
      <nav className="flex items-center justify-between gap-4">
        <div 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          onClick={() => setView("landing")}
        >
          <img
            src={gymPlusOneLogo}
            alt="Gym+1"
            className="h-10 w-auto dark:brightness-0 dark:invert"
          />
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

          {currentUser ? (
            <motion.button
              type="button"
              onClick={() => setView("dashboard")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="group relative hidden items-center gap-2 rounded-full bg-brand px-3 py-3 text-xs font-semibold text-slate-50 shadow-sm transition hover:bg-brand-hover dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 sm:inline-flex sm:px-4 sm:text-sm"
            >
              <span>Dashboard</span>
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={() => setView("auth")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="group relative hidden items-center gap-2 rounded-full bg-brand px-3 py-3 text-xs font-semibold text-slate-50 shadow-sm transition hover:bg-brand-hover dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 sm:inline-flex sm:px-4 sm:text-sm"
            >
              <span>Get Started</span>
            </motion.button>
          )}
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
              {currentUser ? (
                <motion.button
                  type="button"
                  onClick={() => { setView("dashboard"); closeMenu(); }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-slate-50 transition hover:bg-brand-hover dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  <span>Dashboard</span>
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  onClick={() => { setView("auth"); closeMenu(); }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-slate-50 transition hover:bg-brand-hover dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  <span>Get Started</span>
                </motion.button>
              )}
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
          175+ Users on our Waitlist
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
              - Average satisfaction from early testers
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
            <span className="text-xs hidden md:block font-medium text-slate-500 dark:text-slate-400">
              Your Pricing Reqion:
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

function WaitlistForm() {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: "617e7d13-a8dd-4116-8dbf-4af355287506", ...data }),
      });
      const json = await res.json();
      setStatus(json.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <span className="text-3xl">🎉</span>
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">You&apos;re on the list!</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">We&apos;ll be in touch when we launch.</p>
      </div>
    );
  }

  return (
    <form
      className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start lg:space-y-0"
      onSubmit={handleSubmit}
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="waitlist-name" className="text-xs font-medium text-slate-700 dark:text-slate-200">
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
          <label htmlFor="waitlist-email" className="text-xs font-medium text-slate-700 dark:text-slate-200">
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
          <label htmlFor="waitlist-phone" className="text-xs font-medium text-slate-700 dark:text-slate-200">
            Phone number <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="waitlist-phone"
            name="phone"
            type="tel"
            placeholder="+44 7567 8900"
            className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-brand/0 transition focus:border-brand/70 focus:ring-2 focus:ring-brand/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-50 dark:focus:border-brand/80 dark:focus:ring-brand/30"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="waitlist-goal" className="text-xs font-medium text-slate-700 dark:text-slate-200">
            Your primary goal
          </label>
          <select
            id="waitlist-goal"
            name="goal"
            className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none ring-brand/0 transition focus:border-brand/70 focus:ring-2 focus:ring-brand/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-100 dark:focus:border-brand/80 dark:focus:ring-brand/30"
            defaultValue="default"
          >
            <option value="default" disabled>Choose a goal</option>
            <option value="lose-weight">Lose weight</option>
            <option value="build-muscle">Build muscle</option>
            <option value="get-stronger">Get stronger</option>
            <option value="stay-consistent">Stay consistent</option>
            <option value="train-for-event">Train for an event</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="waitlist-role" className="text-xs font-medium text-slate-700 dark:text-slate-200">
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
          <label htmlFor="waitlist-message" className="text-xs font-medium text-slate-700 dark:text-slate-200">
            Anything else you&apos;d like us to know?{" "}
            <span className="text-slate-400">(optional)</span>
          </label>
          <textarea
            id="waitlist-message"
            name="message"
            rows={2}
            placeholder="Tell us about your training style, your gym, or the kind of partner you're looking for."
            className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-brand/0 transition focus:border-brand/70 focus:ring-2 focus:ring-brand/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-50 dark:focus:border-brand/80 dark:focus:ring-brand/30"
          />
        </div>
      </div>

      <div className="space-y-4 rounded border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-slate-300 lg:space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Choose your platform
        </p>
        <p>
          Download from the App Store or Play Store as soon as we launch. Join the waitlist to be first in line.
        </p>
        {status === "error" && (
          <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
        )}
        <motion.button
          type="submit"
          disabled={status === "loading"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex w-full items-center justify-center gap-2 rounded bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <span>{status === "loading" ? "Submitting…" : "Join waitlist"}</span>
          {status !== "loading" && <span>→</span>}
        </motion.button>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Free accounts can join up to 3 groups; paid plans unlock unlimited access and advanced tools for trainers.
        </p>
      </div>
    </form>
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
            175+ Users on our Waitlist
          </p>
        </motion.div>
      </div>

      <div className="rounded border border-slate-200 bg-slate-50/50 p-5 dark:border-neutral-700 dark:bg-neutral-800/30 sm:p-6">
        <WaitlistForm />
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

function Footer({ setView }) {
  return (
    <footer className="mt-12 sm:mt-16 text-left">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded border border-slate-200 bg-white px-6 py-8 dark:border-neutral-800 dark:bg-neutral-900/60 dark:shadow-none sm:px-8 sm:py-10">
          <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            {/* Brand */}
            <div className="flex flex-col items-center sm:items-start">
              <img
                src={gymPlusOneLogo}
                alt="Gym+1"
                className="h-10 w-auto dark:brightness-0 dark:invert"
              />
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
                onClick={() => setView ? setView("privacy") : null}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100 cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setView ? setView("terms") : null}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100 cursor-pointer"
              >
                Terms & Conditions
              </button>
              <button
                type="button"
                onClick={() => setView ? setView("cookies") : null}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100 cursor-pointer"
              >
                Cookie Policy
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

function PolicyLayout({ title, lastUpdated, children, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-4xl py-6 md:py-10 text-left px-4"
    >
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      <div className="border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-10 shadow-sm">
        <div className="border-b border-slate-100 dark:border-neutral-800 pb-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-6">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function TermsView({ setView }) {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      lastUpdated="4 June 2026"
      onBack={() => setView("landing")}
    >
      <p>
        GymPlusOne Ltd ("Gym+1", "we", "us", or "our") operates the website{" "}
        <a href="https://www.gymplusone.com" className="text-brand hover:underline font-semibold">
          www.gymplusone.com
        </a>{" "}
        and the Gym+1 mobile application (collectively, the "Platform"). These
        Terms & Conditions ("Terms") govern your access to and use of the
        Platform. By accessing or using Gym+1, you agree to be bound by these
        Terms. If you do not agree, you must not use the Platform.
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          1. ELIGIBILITY & ACCOUNT REGISTRATION
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>1.1.</strong> You must be at least 18 years old to create
            an account on Gym+1. By registering, you confirm that you are of
            legal age and have the capacity to enter into a binding agreement.
          </li>
          <li>
            <strong>1.2.</strong> You agree to provide accurate, current, and
            complete information during registration and to keep this
            information updated. We reserve the right to suspend or terminate
            accounts containing false or misleading information.
          </li>
          <li>
            <strong>1.3.</strong> You are responsible for maintaining the
            confidentiality of your account credentials and for all activities
            that occur under your account. You must notify us immediately of
            any unauthorised access or security breach.
          </li>
          <li>
            <strong>1.4.</strong> Each user may maintain only one active
            account. We reserve the right to merge or terminate duplicate
            accounts.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          2. PLATFORM DESCRIPTION & NATURE OF SERVICE
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>2.1.</strong> Gym+1 is a social networking and fitness
            accountability platform that facilitates connections between fitness
            enthusiasts ("+1s") and certified personal trainers ("PTs") through
            algorithmic matching, in-app messaging, community groups, and
            scheduling tools.
          </li>
          <li>
            <strong>2.2.</strong> We are a technology platform, not a fitness
            provider, gym operator, or employer. We do not provide fitness
            training, medical advice, or personal training services. Any
            training relationship formed between users is strictly between those
            parties.
          </li>
          <li>
            <strong>2.3.</strong> We do not guarantee that you will find a
            suitable workout partner or trainer, nor do we guarantee the
            availability, quality, or safety of any user-generated content or
            interactions.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          3. SUBSCRIPTION PLANS & PAYMENTS
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>3.1.</strong> Gym+1 offers three subscription tiers: Free
            Plan, Super +1, and SuperPT. Features and pricing are as displayed
            on the Platform at the time of purchase and are subject to change
            with notice.
          </li>
          <li>
            <strong>3.2.</strong> Free Plan users receive basic access including
            profile creation, up to 20 invites per day, participation in up to
            3 communities per month, and location changes at no cost.
          </li>
          <li>
            <strong>3.3.</strong> Super +1 and SuperPT subscriptions are billed
            in advance on a monthly basis unless otherwise stated. All fees are
            non-refundable except where required by law or as expressly
            provided in these Terms.
          </li>
          <li>
            <strong>3.4.</strong> You authorise us to charge your selected
            payment method for all applicable fees, including taxes. If payment
            fails, we may suspend your subscription features until payment is
            successfully processed.
          </li>
          <li>
            <strong>3.5.</strong> You may cancel your subscription at any time
            through your account settings. Cancellation takes effect at the end
            of the current billing period. You will retain access to paid
            features until that date.
          </li>
          <li>
            <strong>3.6.</strong> We reserve the right to modify subscription
            pricing or features. Material changes will be communicated at least
            30 days in advance. Continued use after changes constitutes
            acceptance.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          4. USER CONDUCT & PROHIBITED ACTIVITIES
        </h2>
        <div className="space-y-2">
          <p>
            <strong>4.1.</strong> You agree to use Gym+1 in a manner consistent
            with its purpose: fostering positive fitness accountability and
            community.
          </p>
          <p>
            <strong>4.2.</strong> The following activities are strictly
            prohibited:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>(a)</strong> Harassment, bullying, discrimination, or
              intimidation of any user;
            </li>
            <li>
              <strong>(b)</strong> Sharing sexually explicit, violent, or
              otherwise offensive content;
            </li>
            <li>
              <strong>(c)</strong> Impersonating any person or misrepresenting
              your identity, qualifications, or certifications;
            </li>
            <li>
              <strong>(d)</strong> Soliciting users for services outside the
              Platform's trainer marketplace or attempting to circumvent Platform
              fees;
            </li>
            <li>
              <strong>(e)</strong> Using the Platform for commercial purposes
              unrelated to fitness without our written consent;
            </li>
            <li>
              <strong>(f)</strong> Uploading malware, viruses, or engaging in
              activities that disrupt Platform functionality;
            </li>
            <li>
              <strong>(g)</strong> Collecting user data or scraping content
              without authorisation;
            </li>
            <li>
              <strong>(h)</strong> Promoting unsafe fitness practices, extreme
              dieting, or medical advice without appropriate qualifications.
            </li>
          </ul>
          <p>
            <strong>4.3.</strong> PTs claiming certification must provide accurate
            credentials. Misrepresentation of professional qualifications may
            result in immediate account termination and potential legal action.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          5. CONTENT & INTELLECTUAL PROPERTY
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>5.1.</strong> You retain ownership of content you upload to
            Gym+1, including profile information, photos, voice notes, videos,
            and posts ("User Content"). By uploading User Content, you grant us
            a worldwide, non-exclusive, royalty-free licence to use, display,
            and distribute such content solely for the purpose of operating and
            promoting the Platform.
          </li>
          <li>
            <strong>5.2.</strong> You represent that you have all necessary
            rights to your User Content and that it does not infringe
            third-party intellectual property, privacy, or other rights.
          </li>
          <li>
            <strong>5.3.</strong> We reserve the right to remove or restrict
            User Content that violates these Terms, applicable law, or our
            community standards, without prior notice.
          </li>
          <li>
            <strong>5.4.</strong> All Gym+1 branding, software, designs, logos,
            and Platform content not uploaded by users are our exclusive
            property or that of our licensors. You may not copy, modify, or
            distribute any Platform materials without our written permission.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          6. TRAINER MARKETPLACE & COMMERCIAL ACTIVITY
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>6.1.</strong> SuperPT subscribers may list products,
            services, and training packages for sale through the Platform's
            marketplace features.
          </li>
          <li>
            <strong>6.2.</strong> All commercial transactions between trainers
            and clients are facilitated through the Platform's payment systems
            where applicable. Attempting to divert transactions off-Platform to
            avoid fees violates these Terms.
          </li>
          <li>
            <strong>6.3.</strong> We charge marketplace fees as displayed at the
            point of sale. Trainers are responsible for complying with all
            applicable tax, consumer protection, and professional licensing
            obligations.
          </li>
          <li>
            <strong>6.4.</strong> We do not guarantee sales volume or client
            acquisition for trainers using the marketplace.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          7. SAFETY, HEALTH & MEDICAL DISCLAIMER
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>7.1. CONSULT A PROFESSIONAL:</strong> Gym+1 is not a
            medical or fitness advice service. You should consult a qualified
            healthcare provider before beginning any exercise programme,
            particularly if you have pre-existing health conditions.
          </li>
          <li>
            <strong>7.2. ASSUMPTION OF RISK:</strong> You acknowledge that
            physical exercise carries inherent risks of injury, illness, or
            death. You voluntarily assume all risks associated with meeting
            workout partners, attending training sessions, or following fitness
            advice obtained through the Platform.
          </li>
          <li>
            <strong>7.3. NO LIABILITY FOR PHYSICAL HARM:</strong> To the fullest
            extent permitted by law, Gym+1 is not liable for any injury, loss,
            or damage arising from your physical interactions with other users,
            attendance at fitness facilities, or participation in training
            activities arranged through the Platform.
          </li>
          <li>
            <strong>7.4. MEETING SAFETY:</strong> We strongly encourage users to
            meet in public, well-lit gym facilities for initial sessions. We are
            not responsible for the safety of in-person meetings.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          8. TERMINATION
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>8.1.</strong> You may terminate your account at any time by
            following the deletion process in your account settings or
            contacting us at{" "}
            <a href="mailto:info@gymplusone.com" className="text-brand hover:underline font-semibold">
              info@gymplusone.com
            </a>
            .
          </li>
          <li>
            <strong>8.2.</strong> We may suspend or terminate your account
            immediately, without notice, for conduct that we determine violates
            these Terms, harms other users, or exposes us to legal liability.
          </li>
          <li>
            <strong>8.3.</strong> Upon termination, your right to use the
            Platform ceases immediately. Provisions that by their nature should
            survive termination — including indemnity, limitation of liability,
            and intellectual property provisions — will remain in effect.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          9. LIMITATION OF LIABILITY
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>9.1.</strong> To the maximum extent permitted by applicable
            law, Gym+1 and its directors, employees, and agents shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages, including lost profits, data loss, or reputational
            harm, arising from your use of the Platform.
          </li>
          <li>
            <strong>9.2.</strong> Our total aggregate liability for any claims
            arising under these Terms shall not exceed the greater of: (a) the
            amount you paid to us in the 12 months preceding the claim, or (b)
            £100.
          </li>
          <li>
            <strong>9.3.</strong> Nothing in these Terms limits or excludes
            liability for death or personal injury caused by negligence, fraud,
            or any other liability that cannot be excluded under applicable law.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          10. INDEMNITY
        </h2>
        <p>
          You agree to indemnify and hold harmless Gym+1, its affiliates,
          officers, directors, employees, and agents from any claims, damages,
          losses, or expenses (including reasonable legal fees) arising from:
          (a) your use of the Platform; (b) your User Content; (c) your
          violation of these Terms; or (d) your interactions with other users.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          11. GOVERNING LAW & DISPUTE RESOLUTION
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>11.1.</strong> These Terms are governed by and construed in
            accordance with the laws of England and Wales.
          </li>
          <li>
            <strong>11.2.</strong> Any dispute arising from these Terms shall
            first be addressed through good faith negotiation. If unresolved,
            disputes shall be submitted to the exclusive jurisdiction of the
            courts of England and Wales.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          12. CHANGES TO THESE TERMS
        </h2>
        <p>
          We may update these Terms from time to time. Material changes will be
          notified via email or through the Platform at least 30 days before
          taking effect. Your continued use of Gym+1 after changes constitutes
          acceptance of the revised Terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          13. CONTACT INFORMATION
        </h2>
        <p>
          For questions about these Terms, please contact us at:
          <br />
          <strong>GymPlusOne Ltd</strong>
          <br />
          Email:{" "}
          <a href="mailto:info@gymplusone.com" className="text-brand hover:underline font-semibold">
            info@gymplusone.com
          </a>
          <br />
          Website:{" "}
          <a href="https://www.gymplusone.com" className="text-brand hover:underline font-semibold">
            www.gymplusone.com
          </a>
        </p>
      </section>

      <p className="mt-8 pt-6 border-t border-slate-100 dark:border-neutral-800 text-xs italic text-slate-400">
        By using Gym+1, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
      </p>
    </PolicyLayout>
  );
}

function PrivacyView({ setView }) {
  return (
    <PolicyLayout
      title="Privacy Policy"
      lastUpdated="4 June 2026"
      onBack={() => setView("landing")}
    >
      <p>
        GymPlusOne Ltd ("Gym+1", "we", "us", or "our") is committed to protecting
        your privacy. This Privacy Policy explains how we collect, use, store,
        and protect your personal information when you use our website at{" "}
        <a href="https://www.gymplusone.com" className="text-brand hover:underline font-semibold">
          www.gymplusone.com
        </a>{" "}
        and the Gym+1 mobile application (collectively, the "Platform").
      </p>
      <p>
        By using the Platform, you consent to the practices described in this
        Privacy Policy. If you do not agree, please do not use the Platform.
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          1. INFORMATION WE COLLECT
        </h2>
        
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
          1.1 Information You Provide Directly
        </h3>
        <p>When you register for an account, join our waitlist, or use Platform features, we may collect:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Identity Information:</strong> Name, email address, phone number, date of birth, and profile photos.</li>
          <li><strong>Fitness Profile:</strong> Fitness goals, experience level, preferred workout types, schedule availability, gym location, and voice or video introductions.</li>
          <li><strong>Payment Information:</strong> Billing details processed securely through our payment providers (we do not store full payment card numbers).</li>
          <li><strong>Communications:</strong> Messages sent through in-app DMs, community posts, comments, and customer support inquiries.</li>
          <li><strong>Trainer Credentials:</strong> For SuperPT subscribers, certification details, business information, and service listings.</li>
        </ul>

        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-4">
          1.2 Information Collected Automatically
        </h3>
        <p>When you access the Platform, we automatically collect:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Device Information:</strong> IP address, device type, operating system, browser type, and unique device identifiers.</li>
          <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the Platform, match interactions, and community participation.</li>
          <li><strong>Location Data:</strong> With your consent, we collect precise or approximate location data to facilitate local matching and trainer discovery. You can disable location services through your device settings.</li>
          <li><strong>Cookies and Similar Technologies:</strong> See our Cookie Policy for details.</li>
        </ul>

        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-4">
          1.3 Information from Third Parties
        </h3>
        <p>
          We may receive information from: social media platforms if you choose to link your accounts; payment
          processors regarding transaction confirmations; and identity verification services for trainer credential
          checks.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          2. HOW WE USE YOUR INFORMATION
        </h2>
        <p>We use your personal information for the following purposes:</p>
        
        <div className="overflow-x-auto my-4 rounded-xl border border-slate-150 dark:border-neutral-800">
          <table className="min-w-full divide-y divide-slate-150 dark:divide-neutral-800 text-xs text-left">
            <thead className="bg-slate-50 dark:bg-neutral-900/60">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">Purpose</th>
                <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">Legal Basis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-neutral-800 bg-white dark:bg-neutral-900/30">
              {[
                { p: "Account creation and management", l: "Performance of contract" },
                { p: "Matching algorithm operation", l: "Performance of contract" },
                { p: "In-app messaging and community features", l: "Performance of contract" },
                { p: "Payment processing and subscription management", l: "Performance of contract" },
                { p: "Trainer marketplace facilitation", l: "Performance of contract" },
                { p: "Platform security and fraud prevention", l: "Legitimate interests" },
                { p: "Customer support and dispute resolution", l: "Legitimate interests" },
                { p: "Platform improvement and analytics", l: "Legitimate interests" },
                { p: "Marketing communications (with consent)", l: "Consent" },
                { p: "Legal compliance and regulatory obligations", l: "Legal obligation" }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">{row.p}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{row.l}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          3. HOW WE SHARE YOUR INFORMATION
        </h2>
        <p>We do not sell your personal information. We may share your data in the following circumstances:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>3.1 With Other Users:</strong> Your profile information (name, photos, fitness goals, availability) is visible to matched users and community members as per your privacy settings. Messages sent through DMs are shared with the intended recipient. PT profiles and service listings are publicly visible within the Platform.</li>
          <li><strong>3.2 With Service Providers:</strong> We engage trusted third-party providers for: cloud hosting and data storage; payment processing; analytics and performance monitoring; customer support tools; and email and push notification delivery. All providers are contractually bound to process data only as instructed and maintain appropriate security measures.</li>
          <li><strong>3.3 For Legal Reasons:</strong> We may disclose information if required by law, court order, or governmental request, or to protect our rights, property, or safety, or that of our users.</li>
          <li><strong>3.4 Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, user information may be transferred subject to the same privacy commitments.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          4. DATA STORAGE AND SECURITY
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>4.1.</strong> Your data is stored on secure servers located within the United Kingdom and the European Economic Area. We implement industry-standard technical and organisational measures to protect against unauthorised access, alteration, disclosure, or destruction.</li>
          <li><strong>4.2.</strong> While we take reasonable precautions, no internet transmission is completely secure. You use the Platform at your own risk, and we cannot guarantee absolute security.</li>
          <li><strong>4.3.</strong> We retain your personal information for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          5. YOUR RIGHTS AND CHOICES
        </h2>
        <p>Under UK GDPR and applicable data protection laws, you have the following rights:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
          <li><strong>Erasure ("Right to be Forgotten"):</strong> Request deletion of your personal data, subject to legal retention requirements.</li>
          <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances.</li>
          <li><strong>Data Portability:</strong> Receive your data in a structured, machine-readable format.</li>
          <li><strong>Objection:</strong> Object to processing based on legitimate interests or direct marketing.</li>
          <li><strong>Withdraw Consent:</strong> Withdraw consent for processing where consent is the legal basis.</li>
        </ul>
        <p>
          To exercise these rights, contact us at{" "}
          <a href="mailto:info@gymplusone.com" className="text-brand hover:underline font-semibold">
            info@gymplusone.com
          </a>
          . We will respond within one month, or up to three months for complex requests.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          6. MARKETING COMMUNICATIONS
        </h2>
        <p>
          With your consent, we may send you promotional emails, push notifications, and SMS about new features, partner offers, and fitness content. You can opt out at any time by: clicking the unsubscribe link in emails; adjusting notification preferences in your account settings; or contacting us directly.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          7. CHILDREN'S PRIVACY
        </h2>
        <p>
          Gym+1 is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware that a minor has provided us with personal data, we will delete it immediately.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          8. INTERNATIONAL DATA TRANSFERS
        </h2>
        <p>
          If we transfer your data outside the UK or EEA, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the UK Information Commissioner's Office, or transfers to countries with adequacy decisions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          9. CHANGES TO THIS PRIVACY POLICY
        </h2>
        <p>
          We may update this Privacy Policy periodically. Material changes will be notified via email or through the Platform at least 30 days before taking effect. The "Last Updated" date at the top indicates when revisions were made.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          10. CONTACT US
        </h2>
        <p>
          For privacy-related inquiries, data subject requests, or complaints:
          <br />
          <strong>Data Protection Officer</strong>
          <br />
          GymPlusOne Ltd
          <br />
          Email:{" "}
          <a href="mailto:info@gymplusone.com" className="text-brand hover:underline font-semibold">
            info@gymplusone.com
          </a>
          <br />
          Website:{" "}
          <a href="https://www.gymplusone.com" className="text-brand hover:underline font-semibold">
            www.gymplusone.com
          </a>
        </p>
        <p className="text-xs text-slate-400">
          If you are unsatisfied with our response, you have the right to complain to the Information Commissioner's Office (ICO) at{" "}
          <a href="https://www.ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">
            www.ico.org.uk
          </a>
        </p>
      </section>
    </PolicyLayout>
  );
}

function CookiePolicyView({ setView }) {
  return (
    <PolicyLayout
      title="Cookie Policy"
      lastUpdated="4 June 2026"
      onBack={() => setView("landing")}
    >
      <p>
        This Cookie Policy explains how GymPlusOne Ltd ("Gym+1", "we", "us", or
        "our") uses cookies and similar tracking technologies on our website{" "}
        <a href="https://www.gymplusone.com" className="text-brand hover:underline font-semibold">
          www.gymplusone.com
        </a>{" "}
        and the Gym+1 mobile application (collectively, the "Platform").
      </p>
      <p>
        By continuing to use the Platform, you consent to our use of cookies as
        described in this policy, unless you have adjusted your browser or
        device settings to refuse them.
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          1. WHAT ARE COOKIES?
        </h2>
        <p>
          Cookies are small text files placed on your device when you visit a website or use an application. They store information about your preferences and activities to improve your experience, enable functionality, and help us understand how the Platform is used.
        </p>
        <p>
          Similar technologies include web beacons, pixel tags, and local storage, which perform comparable functions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          2. TYPES OF COOKIES WE USE
        </h2>

        <div className="space-y-4">
          <div className="border-l-2 border-slate-200 dark:border-neutral-800 pl-4 py-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">2.1 Strictly Necessary Cookies</h3>
            <p className="mt-1">These cookies are essential for the Platform to function. They enable core features such as account login, security authentication, and session management. Without these cookies, the Platform cannot operate properly.</p>
            <p className="text-xs text-slate-400 mt-1"><strong>Duration:</strong> Session-based or up to 30 days | <strong>Legal Basis:</strong> Legitimate interest (necessary for service provision)</p>
          </div>

          <div className="border-l-2 border-slate-200 dark:border-neutral-800 pl-4 py-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">2.2 Performance and Analytics Cookies</h3>
            <p className="mt-1">These cookies collect information about how users interact with the Platform, including pages visited, features used, error messages encountered, and load times. This helps us identify issues and improve performance.</p>
            <p className="text-xs text-slate-400 mt-1"><strong>Duration:</strong> Up to 2 years | <strong>Legal Basis:</strong> Consent (can be disabled via cookie preferences)</p>
          </div>

          <div className="border-l-2 border-slate-200 dark:border-neutral-800 pl-4 py-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">2.3 Functionality Cookies</h3>
            <p className="mt-1">These cookies remember your preferences and choices to provide a personalised experience, such as language settings, location preferences, and display customisations.</p>
            <p className="text-xs text-slate-400 mt-1"><strong>Duration:</strong> Up to 1 year | <strong>Legal Basis:</strong> Consent (can be disabled via cookie preferences)</p>
          </div>

          <div className="border-l-2 border-slate-200 dark:border-neutral-800 pl-4 py-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">2.4 Targeting and Advertising Cookies</h3>
            <p className="mt-1">These cookies track your browsing habits to deliver relevant advertisements and measure the effectiveness of marketing campaigns. They may be set by us or by third-party advertising partners.</p>
            <p className="text-xs text-slate-400 mt-1"><strong>Duration:</strong> Up to 2 years | <strong>Legal Basis:</strong> Consent (can be disabled via cookie preferences)</p>
          </div>

          <div className="border-l-2 border-slate-200 dark:border-neutral-800 pl-4 py-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">2.5 Social Media Cookies</h3>
            <p className="mt-1">These cookies are set by social media platforms when you interact with embedded content or share buttons, enabling those platforms to track your activity.</p>
            <p className="text-xs text-slate-400 mt-1"><strong>Duration:</strong> Varies by platform (typically up to 2 years) | <strong>Legal Basis:</strong> Consent (can be disabled via cookie preferences)</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          3. THIRD-PARTY COOKIES
        </h2>
        <p>We partner with the following third parties who may set cookies on your device:</p>
        
        <div className="overflow-x-auto my-4 rounded-xl border border-slate-150 dark:border-neutral-800">
          <table className="min-w-full divide-y divide-slate-150 dark:divide-neutral-800 text-xs text-left">
            <thead className="bg-slate-50 dark:bg-neutral-900/60">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">Third Party</th>
                <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">Purpose</th>
                <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">Privacy Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-neutral-800 bg-white dark:bg-neutral-900/30">
              {[
                { name: "Google Analytics", p: "Usage analytics and performance monitoring", u: "https://policies.google.com/privacy" },
                { name: "Google Ads", p: "Advertising and conversion tracking", u: "https://policies.google.com/privacy" },
                { name: "Meta (Facebook/Instagram)", p: "Social media integration and advertising", u: "https://www.facebook.com/privacy/policy" },
                { name: "Stripe", p: "Payment processing and fraud prevention", u: "https://stripe.com/privacy" },
                { name: "Mixpanel", p: "Product analytics and user behaviour", u: "https://mixpanel.com/legal/privacy" },
                { name: "Intercom", p: "Customer support and messaging", u: "https://www.intercom.com/legal/privacy" }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="px-4 py-3 text-slate-900 dark:text-white font-bold">{row.name}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{row.p}</td>
                  <td className="px-4 py-3">
                    <a href={row.u} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">
                      Policy Link
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          4. HOW TO MANAGE YOUR COOKIE PREFERENCES
        </h2>
        
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
          4.1 Cookie Consent Banner
        </h3>
        <p>
          When you first visit the Platform, a cookie consent banner allows you to: accept all cookies; reject non-essential cookies; or customise preferences by category. You can revisit and update your preferences at any time by clicking "Manage Consent" in the footer or through your account settings.
        </p>

        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-4">
          4.2 Browser Settings
        </h3>
        <p>You can configure your browser to block or delete cookies:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Cookies and other site data</li>
          <li><strong>Mozilla Firefox:</strong> Preferences &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
          <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Cookies and website data</li>
          <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions</li>
        </ul>
        <p className="text-xs text-slate-400">
          Please note that disabling cookies may affect Platform functionality, particularly login and personalisation features.
        </p>

        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-4">
          4.3 Mobile Device Settings
        </h3>
        <p>On mobile devices, you can manage tracking through:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>iOS:</strong> Settings &gt; Privacy &amp; Security &gt; Tracking</li>
          <li><strong>Android:</strong> Settings &gt; Privacy &gt; Ads &gt; Opt out of Ads Personalisation</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          5. DO NOT TRACK SIGNALS
        </h2>
        <p>
          Some browsers transmit "Do Not Track" (DNT) signals. Gym+1 does not currently respond to DNT signals as there is no consistent industry standard for interpretation. However, you can manage cookie preferences through the mechanisms described above.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          6. COOKIE DURATION
        </h2>
        <p>Cookies may be:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Session Cookies:</strong> Deleted when you close your browser or log out.</li>
          <li><strong>Persistent Cookies:</strong> Remain on your device for a defined period or until manually deleted.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          7. CHANGES TO THIS COOKIE POLICY
        </h2>
        <p>
          We may update this Cookie Policy to reflect changes in technology, regulation, or our practices. Material changes will be notified via the Platform or email. The "Last Updated" date at the top indicates when revisions were made.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          8. CONTACT US
        </h2>
        <p>
          For questions about our Cookie Policy or to exercise your data rights:
          <br />
          <strong>GymPlusOne Ltd</strong>
          <br />
          Email:{" "}
          <a href="mailto:info@gymplusone.com" className="text-brand hover:underline font-semibold">
            info@gymplusone.com
          </a>
          <br />
          Website:{" "}
          <a href="https://www.gymplusone.com" className="text-brand hover:underline font-semibold">
            www.gymplusone.com
          </a>
        </p>
      </section>
    </PolicyLayout>
  );
}

// ==========================================
// ONBOARDING & DASHBOARD VIEWS IMPLEMENTATION
// ==========================================

function AuthView({ setView, currentUser, setCurrentUser }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isSignUp) {
      if (!fullName || !retypePassword) {
        setError("Please fill in all fields.");
        return;
      }
      if (password !== retypePassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      
      const user = { name: fullName, email, role: null, age: null, gender: null };
      setCurrentUser(user);
      setView("experience");
    } else {
      if (email === "demo@gymplusone.com" || email === "demo") {
        handleUseDemo();
      } else {
        const user = { name: email.split("@")[0], email, role: null, age: null, gender: null };
        setCurrentUser(user);
        setView("experience");
      }
    }
  };

  const handleUseDemo = () => {
    const user = { name: "Alex Johnson (Demo)", email: "demo@gymplusone.com", role: null, age: null, gender: null };
    setCurrentUser(user);
    setView("experience");
  };

  return (
    <div className="mx-auto max-w-md w-full py-12 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isSignUp ? "Join Gym+1 to find your fitness match" : "Sign in to connect with your gym buddies"}
          </p>
        </div>

        <div className="flex border-b border-slate-200 dark:border-neutral-800 mb-6">
          <button
            type="button"
            className={`flex-1 pb-3 text-sm font-medium border-b-2 text-center transition-colors ${
              isSignUp 
                ? "border-brand text-brand dark:text-white dark:border-white" 
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
            onClick={() => { setIsSignUp(true); setError(""); }}
          >
            Sign Up
          </button>
          <button
            type="button"
            className={`flex-1 pb-3 text-sm font-medium border-b-2 text-center transition-colors ${
              !isSignUp 
                ? "border-brand text-brand dark:text-white dark:border-white" 
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
            onClick={() => { setIsSignUp(false); setError(""); }}
          >
            Sign In
          </button>
        </div>

        <div className="mb-6 p-4 bg-brand/5 border border-brand/20 rounded-xl flex flex-col gap-2 items-stretch text-center">
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Want to explore quickly? Use our sandbox account.
          </p>
          <button
            type="button"
            onClick={handleUseDemo}
            className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-brand text-xs font-semibold rounded-lg text-white bg-brand hover:bg-brand-hover transition shadow-sm"
          >
            Log In with Demo Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none ring-brand/0 transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-50 dark:focus:border-brand"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none ring-brand/0 transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-50 dark:focus:border-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 bg-white pl-3.5 pr-10 py-2.5 text-sm text-slate-900 outline-none ring-brand/0 transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-50 dark:focus:border-brand"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Retype Password
              </label>
              <div className="relative">
                <input
                  type={showRetypePassword ? "text" : "password"}
                  required
                  value={retypePassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-white pl-3.5 pr-10 py-2.5 text-sm text-slate-900 outline-none ring-brand/0 transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-50 dark:focus:border-brand"
                />
                <button
                  type="button"
                  onClick={() => setShowRetypePassword(!showRetypePassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showRetypePassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200 dark:border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-neutral-900 px-2 text-slate-400">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={handleUseDemo}
            className="flex justify-center items-center py-2.5 px-4 border border-slate-200 dark:border-neutral-800 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
            aria-label="Sign up with Google"
          >
            <FaGoogle className="h-4 w-4 text-red-500" />
          </button>
          <button
            type="button"
            onClick={handleUseDemo}
            className="flex justify-center items-center py-2.5 px-4 border border-slate-200 dark:border-neutral-800 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
            aria-label="Sign up with Apple"
          >
            <FaApple className="h-4 w-4 text-slate-900 dark:text-white" />
          </button>
          <button
            type="button"
            onClick={handleUseDemo}
            className="flex justify-center items-center py-2.5 px-4 border border-slate-200 dark:border-neutral-800 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
            aria-label="Sign up with Facebook"
          >
            <FaFacebook className="h-4 w-4 text-blue-600" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ExperienceView({ setView, currentUser, setCurrentUser }) {
  const handleSelectRole = (role) => {
    const updatedUser = { ...currentUser, role };
    setCurrentUser(updatedUser);
    setView("trainer-details");
  };

  return (
    <div className="mx-auto max-w-2xl w-full py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Select your experience
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          How do you plan to use Gym+1? Choose the profile type that fits you best.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelectRole("partner")}
          className="cursor-pointer border border-slate-200 dark:border-neutral-800 hover:border-brand dark:hover:border-white rounded-2xl p-6 bg-white dark:bg-neutral-900 shadow-sm transition flex flex-col justify-between h-64"
        >
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <FiUsers className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">+ 1</h3>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">Fitness Partner</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                Connect with active gym-goers, find workout partners, and keep each other accountable.
              </p>
            </div>
          </div>
          <span className="text-brand dark:text-white text-xs font-semibold self-end flex items-center gap-1">
            Choose Partner &rarr;
          </span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelectRole("trainer")}
          className="cursor-pointer border border-slate-200 dark:border-neutral-800 hover:border-brand dark:hover:border-white rounded-2xl p-6 bg-white dark:bg-neutral-900 shadow-sm transition flex flex-col justify-between h-64"
        >
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <FiActivity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personal Trainer</h3>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">Professional Coach</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                Offer expert training, list services, track clients, and grow your fitness business.
              </p>
            </div>
          </div>
          <span className="text-brand dark:text-white text-xs font-semibold self-end flex items-center gap-1">
            Choose Trainer &rarr;
          </span>
        </motion.div>
      </div>

      <div className="text-center mt-8">
        <button
          type="button"
          onClick={() => setView("auth")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition"
        >
          <FiArrowLeft className="h-3 w-3" />
          <span>Back to authentication</span>
        </button>
      </div>
    </div>
  );
}

function TrainerDetailsView({ setView, currentUser, setCurrentUser }) {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [experience, setExperience] = useState("");
  const [frequency, setFrequency] = useState("");
  const [workoutTime, setWorkoutTime] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [interests, setInterests] = useState([]);
  const [ethnicities, setEthnicities] = useState([]);
  const [biography, setBiography] = useState("");
  
  // Location step states
  const [locationText, setLocationText] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [locationStatus, setLocationStatus] = useState("off"); // 'off' | 'once' | 'always' | 'denied'
  const [locationLoading, setLocationLoading] = useState(false);

  // Media upload step states
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!age) {
        setError("Please select your age range.");
        return;
      }
      if (!gender) {
        setError("Please select your gender identity.");
        return;
      }
      
      setStep(2);
    } else if (step === 2) {
      if (!experience) {
        setError("Please select your experience level.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!frequency) {
        setError("Please select how many days you exercise.");
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (!workoutTime) {
        setError("Please select your preferred workout time.");
        return;
      }
      setStep(5);
    } else if (step === 5) {
      if (specializations.length === 0) {
        setError("Please select at least one specialization.");
        return;
      }
      setStep(6);
    } else if (step === 6) {
      if (interests.length === 0) {
        setError("Please select at least one interest.");
        return;
      }
      setStep(7);
    } else if (step === 7) {
      if (ethnicities.length === 0) {
        setError("Please select at least one ethnicity.");
        return;
      }
      setStep(8);
    } else if (step === 8) {
      if (!biography.trim()) {
        setError("Please share a short biography.");
        return;
      }
      setStep(9);
    } else if (step === 9) {
      if (!locationText) {
        setError("Please set your location using the search or allow button.");
        return;
      }
      setStep(10);
    } else if (step === 10) {
      if (mediaFiles.length === 0) {
        setError("Please upload at least one photo or video.");
        return;
      }

      const updatedUser = {
        ...currentUser,
        age,
        gender,
        experience,
        frequency,
        workoutTime,
        specializations,
        interests,
        ethnicities,
        biography,
        location: locationText,
        coordinates,
        media: mediaFiles,
      };
      setCurrentUser(updatedUser);
      setView("dashboard");
    }
  };

  const handleBack = () => {
    setError("");
    if (step === 1) {
      setView("experience");
    } else if (step === 9) {
      setStep(8);
    } else {
      setStep(step - 1);
    }
  };

  const ageOptions = [
    { label: "18 - 24", value: "18-24" },
    { label: "25 - 34", value: "25-34" },
    { label: "35 - 44", value: "35-44" },
    { label: "45 - 54", value: "45-54" },
    { label: "55+", value: "55+" }
  ];

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Non-binary", value: "non-binary" }
  ];

  const experienceOptions = [
    { label: "Beginner: 0-1 year", value: "beginner" },
    { label: "Intermediate: 1-3 years", value: "intermediate" },
    { label: "Advanced: 3-5 years", value: "advanced" },
    { label: "Expert: 5-10 years", value: "expert" },
    { label: "Master trainer: 10+ years", value: "master" }
  ];

  const frequencyOptions = [
    { label: "0-1 day", value: "0-1" },
    { label: "2-3 days", value: "2-3" },
    { label: "4-5 days", value: "4-5" },
    { label: "6-7 days", value: "6-7" }
  ];

  const workoutTimeOptions = [
    { label: "Morning", value: "morning" },
    { label: "Afternoon", value: "afternoon" },
    { label: "Evening", value: "evening" },
    { label: "Night", value: "night" }
  ];

  const specializationOptions = [
    { label: "Muscle Gain", value: "muscle gain" },
    { label: "Strength", value: "strength" },
    { label: "Endurance", value: "endurance" },
    { label: "General Wellness", value: "general wellness" },
    { label: "Mental Wellness", value: "mental wellness" },
    { label: "Flexibility", value: "flexibility" }
  ];

  const interestOptions = [
    "parkour", "animals", "boxing", "cycling", "swimming", "food", 
    "yoga and mindfulness", "weightlifting", "sports", "action", 
    "traveling", "movie", "running", "pilates"
  ];

  const ethnicityOptions = [
    "Native American", "Middle Eastern", "South Asian", "Southeast Asian", 
    "Latina/latino", "North American", "Asian", "African", "Arab"
  ];

  const toggleList = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const displayStepNum = step;
  const totalSteps = 10;
  const progressPercent = Math.round((displayStepNum / totalSteps) * 100);

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Age & Gender";
      case 2: return "Experience Level";
      case 3: return "Exercise Frequency";
      case 4: return "Workout Time Preference";
      case 5: return "Specialisations";
      case 6: return "Interests";
      case 7: return "Ethnicity Selection";
      case 8: return "Add Biography";
      case 9: return "Set Gym Location";
      case 10: return "Add Photo & Video";
      default: return "Complete Profile";
    }
  };

  const filteredEthnicities = ethnicityOptions.filter(e => 
    e.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePermissionChoice = (choice) => {
    setShowPermissionDialog(false);
    if (choice === "deny") {
      setLocationStatus("denied");
      setError("Location permission denied. You can still search manually below.");
      return;
    }

    setLocationStatus(choice);
    setLocationLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoordinates({ lat, lng });
          setLocationText(`London, UK (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° W)`);
          setLocationLoading(false);
        },
        (err) => {
          console.error(err);
          // Sandbox default coordinates
          setCoordinates({ lat: 51.5074, lng: -0.1278 });
          setLocationText("London, UK (51.5074° N, 0.1278° W) - Default Sandbox");
          setLocationLoading(false);
        }
      );
    } else {
      setCoordinates({ lat: 51.5074, lng: -0.1278 });
      setLocationText("London, UK (51.5074° N, 0.1278° W) - Default Sandbox");
      setLocationLoading(false);
    }
  };

  const handleLocationSearch = () => {
    if (!locationSearchQuery.trim()) return;
    setLocationLoading(true);
    setError("");

    setTimeout(() => {
      const mockLocations = {
        "london": { text: "London, UK", lat: 51.5074, lng: -0.1278 },
        "new york": { text: "New York, USA", lat: 40.7128, lng: -74.0060 },
        "paris": { text: "Paris, France", lat: 48.8566, lng: 2.3522 },
        "tokyo": { text: "Tokyo, Japan", lat: 35.6762, lng: 139.6503 },
        "lagos": { text: "Lagos, Nigeria", lat: 6.5244, lng: 3.3792 },
        "manchester": { text: "Manchester, UK", lat: 53.4808, lng: -2.2426 }
      };

      const query = locationSearchQuery.toLowerCase().trim();
      let matched = null;
      for (const key in mockLocations) {
        if (query.includes(key) || key.includes(query)) {
          matched = mockLocations[key];
          break;
        }
      }

      if (matched) {
        setCoordinates({ lat: matched.lat, lng: matched.lng });
        setLocationText(`${matched.text} (${matched.lat.toFixed(4)}° N, ${matched.lng.toFixed(4)}° W)`);
      } else {
        const lat = 20 + Math.random() * 30;
        const lng = -10 + Math.random() * 40;
        setCoordinates({ lat, lng });
        setLocationText(`${locationSearchQuery} (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° W)`);
      }
      setLocationLoading(false);
    }, 800);
  };

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    setError("");

    const newMedia = files.map((file) => {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size should not exceed 10MB.");
        return null;
      }
      const type = file.type.startsWith("video/") ? "video" : "image";
      const url = URL.createObjectURL(file);
      return { file, url, type, name: file.name };
    }).filter(Boolean);

    setMediaFiles([...mediaFiles, ...newMedia]);
  };

  const handleRemoveMedia = (index) => {
    const item = mediaFiles[index];
    if (item.url) URL.revokeObjectURL(item.url);
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError("");

    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      const newMedia = files.map((file) => {
        if (file.size > 10 * 1024 * 1024) {
          setError("File size should not exceed 10MB.");
          return null;
        }
        const type = file.type.startsWith("video/") ? "video" : "image";
        const url = URL.createObjectURL(file);
        return { file, url, type, name: file.name };
      }).filter(Boolean);

      setMediaFiles([...mediaFiles, ...newMedia]);
    }
  };

  const renderMap = () => {
    const latPercent = coordinates ? Math.min(Math.max(((coordinates.lat - 20) / 40) * 100, 10), 90) : 50;
    const lngPercent = coordinates ? Math.min(Math.max(((coordinates.lng + 10) / 150) * 100, 10), 90) : 50;

    return (
      <div className="relative w-full h-44 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 overflow-hidden shadow-inner flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:20px_20px] opacity-40" />
        
        <svg className="absolute inset-0 h-full w-full opacity-10 dark:opacity-20 text-brand" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M10,20 Q20,30 30,20 T50,30 T70,10 T90,20 L100,100 L0,100 Z" fill="currentColor" />
          <path d="M80,30 Q90,50 85,70 T60,80 T40,60 Z" fill="currentColor" />
        </svg>

        {coordinates ? (
          <div 
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${100 - latPercent}%`, left: `${lngPercent}%` }}
          >
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-brand border border-white"></span>
            </span>
          </div>
        ) : (
          <div className="text-center text-xs text-slate-400 dark:text-slate-500 z-10 max-w-xs px-4">
            <p>Location status is currently OFF.</p>
            <p className="mt-1">Click "Allow Location Access" or search for a location below.</p>
          </div>
        )}

        {locationLoading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-black/70 flex items-center justify-center z-20">
            <span className="animate-spin rounded-full h-6 w-6 border-2 border-brand border-t-transparent" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-md w-full py-12 px-4 sm:px-6">
      {/* Custom Mock Permissions Prompt Overlay */}
      {showPermissionDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl max-w-xs w-full p-5 shadow-2xl space-y-4 text-center"
          >
            <div className="mx-auto h-10 w-10 rounded-full bg-brand/10 text-brand flex items-center justify-center">
              <FiGlobe className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Allow "Gym+1" to use your location?
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Your location coordinates will be used to show you training buddies and gyms nearby.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => handlePermissionChoice("once")}
                className="w-full py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-lg transition"
              >
                Allow Once
              </button>
              <button
                type="button"
                onClick={() => handlePermissionChoice("always")}
                className="w-full py-2 border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition"
              >
                Allow While Using App
              </button>
              <button
                type="button"
                onClick={() => handlePermissionChoice("deny")}
                className="w-full py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold rounded-lg transition"
              >
                Don't Allow
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-xl p-8"
      >
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-2 font-semibold">
            <span>Step {displayStepNum} of {totalSteps}: {getStepTitle()}</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-brand h-full transition-all duration-300 ease-out" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleNext} className="space-y-6">
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Select Age Range
                </label>
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none ring-brand/0 transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-50 dark:focus:border-brand"
                >
                  <option value="" disabled>Choose your age range</option>
                  {ageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Select Gender Identity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {genderOptions.map((opt) => {
                    const isActive = gender === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setGender(opt.value)}
                        className={`py-3 px-2 text-center text-xs font-semibold border rounded-lg transition-all ${
                          isActive
                            ? "border-brand bg-brand/5 text-brand dark:border-white dark:bg-white/5 dark:text-white"
                            : "border-slate-200 hover:border-slate-300 text-slate-500 dark:border-neutral-800 dark:hover:border-neutral-700 dark:text-slate-400"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                What is your experience level?
              </label>
              <div className="space-y-2">
                {experienceOptions.map((opt) => {
                  const isActive = experience === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setExperience(opt.value)}
                      className={`w-full py-3.5 px-4 text-left text-sm font-semibold border rounded-lg transition-all flex items-center justify-between ${
                        isActive
                          ? "border-brand bg-brand/5 text-brand dark:border-white dark:bg-white/5 dark:text-white"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 dark:border-neutral-800 dark:hover:border-neutral-700 dark:text-slate-300"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isActive && <span className="text-brand dark:text-white font-bold">&bull;</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                How many days per week do you exercise?
              </label>
              <div className="space-y-2">
                {frequencyOptions.map((opt) => {
                  const isActive = frequency === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFrequency(opt.value)}
                      className={`w-full py-3.5 px-4 text-left text-sm font-semibold border rounded-lg transition-all flex items-center justify-between ${
                        isActive
                          ? "border-brand bg-brand/5 text-brand dark:border-white dark:bg-white/5 dark:text-white"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 dark:border-neutral-800 dark:hover:border-neutral-700 dark:text-slate-300"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isActive && <span className="text-brand dark:text-white font-bold">&bull;</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                What time of the day do you prefer to work out?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {workoutTimeOptions.map((opt) => {
                  const isActive = workoutTime === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setWorkoutTime(opt.value)}
                      className={`py-4 px-4 text-center text-sm font-semibold border rounded-lg transition-all ${
                        isActive
                          ? "border-brand bg-brand/5 text-brand dark:border-white dark:bg-white/5 dark:text-white"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 dark:border-neutral-800 dark:hover:border-neutral-700 dark:text-slate-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                What area do you specialise in?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {specializationOptions.map((opt) => {
                  const isActive = specializations.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleList(specializations, setSpecializations, opt.value)}
                      className={`py-3.5 px-3 text-center text-xs font-semibold border rounded-lg transition-all ${
                        isActive
                          ? "border-brand bg-brand/5 text-brand dark:border-white dark:bg-white/5 dark:text-white"
                          : "border-slate-200 hover:border-slate-300 text-slate-600 dark:border-neutral-800 dark:hover:border-neutral-700 dark:text-slate-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Select your interests
              </label>
              <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-1">
                {interestOptions.map((opt) => {
                  const isActive = interests.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleList(interests, setInterests, opt)}
                      className={`py-2 px-3 text-xs font-semibold border rounded-full transition-all capitalize ${
                        isActive
                          ? "border-brand bg-brand/10 text-brand dark:border-white dark:bg-white/10 dark:text-white"
                          : "border-slate-200 hover:border-slate-300 text-slate-500 dark:border-neutral-800 dark:hover:border-neutral-700 dark:text-slate-400"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Select your ethnicity
              </label>
              
              <input
                type="text"
                placeholder="Search ethnicity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none ring-brand/0 transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-50 dark:focus:border-brand mb-2"
              />

              <div className="flex flex-wrap gap-2 max-h-[180px] overflow-y-auto pr-1">
                {filteredEthnicities.map((opt) => {
                  const isActive = ethnicities.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleList(ethnicities, setEthnicities, opt)}
                      className={`py-2 px-3 text-xs font-semibold border rounded-full transition-all ${
                        isActive
                          ? "border-brand bg-brand/10 text-brand dark:border-white dark:bg-white/10 dark:text-white"
                          : "border-slate-200 hover:border-slate-300 text-slate-500 dark:border-neutral-800 dark:hover:border-neutral-700 dark:text-slate-400"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
                {filteredEthnicities.length === 0 && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 w-full py-4 text-center">No ethnicities found.</p>
                )}
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Add biography
              </label>
              <textarea
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Share your background, coaching style, certifications, and workout philosophy..."
                rows={5}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none ring-brand/0 transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-50 dark:focus:border-brand"
              />
            </div>
          )}

          {/* STEP 9: Location Selection */}
          {step === 9 && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Set your gym location
              </label>

              {renderMap()}

              <button
                type="button"
                onClick={() => setShowPermissionDialog(true)}
                className={`w-full py-2.5 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  locationStatus !== "off" && locationStatus !== "denied"
                    ? "border-brand bg-brand/5 text-brand dark:border-white dark:bg-white/5 dark:text-white"
                    : "border-slate-200 hover:border-slate-300 text-slate-700 dark:border-neutral-800 dark:hover:border-neutral-700 dark:text-slate-300"
                }`}
              >
                <FiGlobe className="h-4 w-4" />
                <span>
                  {locationStatus === "off" && "Allow Location Access"}
                  {locationStatus === "once" && "Location Access (Once) - ON"}
                  {locationStatus === "always" && "Location Access (While Using) - ON"}
                  {locationStatus === "denied" && "Location Access Denied"}
                </span>
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200 dark:border-neutral-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white dark:bg-neutral-900 px-2 text-slate-400">Or search manually</span>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter city or area name (e.g. Paris)..."
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleLocationSearch(); } }}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-50 dark:focus:border-brand"
                />
                <button
                  type="button"
                  onClick={handleLocationSearch}
                  className="px-4 py-2 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
                >
                  Search
                </button>
              </div>

              {locationText && (
                <div className="p-3 bg-brand/5 border border-brand/10 rounded-lg text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-brand dark:text-white">Active Location:</span> {locationText}
                </div>
              )}
            </div>
          )}

          {/* STEP 10: Photo/Video Upload */}
          {step === 10 && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Upload profile photo or video
              </label>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-brand bg-brand/5 dark:border-white dark:bg-white/5"
                    : "border-slate-200 hover:border-slate-300 dark:border-neutral-800 dark:hover:border-neutral-700"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleMediaUpload}
                />
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <FiUsers className="h-8 w-8 text-slate-300" />
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Drag and drop your photos/videos here, or <span className="text-brand dark:text-white font-semibold">browse</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Supports images & videos up to 10MB</p>
                </div>
              </div>

              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4 max-h-[160px] overflow-y-auto pr-1">
                  {mediaFiles.map((media, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-800 group">
                      {media.type === "image" ? (
                        <img src={media.url} alt="upload" className="w-full h-full object-cover" />
                      ) : (
                        <video src={media.url} className="w-full h-full object-cover" muted playsInline />
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveMedia(index); }}
                        className="absolute top-1 right-1 h-5 w-5 bg-black/60 rounded-full text-white flex items-center justify-center text-[10px] opacity-80 hover:opacity-100 transition"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3 px-4 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition"
            >
              {step === 10 ? "Complete" : "Next"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function DashboardView({ setView, currentUser, setCurrentUser, theme, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState("partners");
  const [chatUser, setChatUser] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "them", text: "Hey! Down to hit the gym this evening? I'm doing upper body.", time: "10:12 AM" }
  ]);

  const handleLogout = () => {
    setCurrentUser(null);
    setView("landing");
  };

  const mockPartners = [
    { name: "Michael Carter", goal: "Hypertrophy & Powerlifting", loc: "PureGym Central", match: "98% Match", dist: 1.4 },
    { name: "Emily Watson", goal: "HIIT & Cardio Conditioning", loc: "JD Gym South", match: "95% Match", dist: 2.8 },
    { name: "David Kim", goal: "Yoga & Bodyweight Skills", loc: "Flex Yoga Studio", match: "91% Match", dist: 4.1 },
    { name: "Jessica Taylor", goal: "Olympic Weightlifting", loc: "Olympic Center", match: "89% Match", dist: 5.7 }
  ];

  const mockClients = [
    { name: "Oliver Green", goal: "Wants 3x/week strength coaching", status: "New Inquiry" },
    { name: "Sophie Brown", goal: "Needs custom weight loss program", status: "New Inquiry" }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessages([
      ...messages,
      { id: messages.length + 1, sender: "me", text: chatMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setChatMessage("");
    
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: prev.length + 1, sender: "them", text: "Awesome! Let's meet at 6:30 PM.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1500);
  };

  // --- SETTINGS STATES ---
  const [subscription, setSubscription] = useState(currentUser?.role === "trainer" ? "super-pt" : "free");
  const [language, setLanguage] = useState("English");
  const [notifyPhotoCheck, setNotifyPhotoCheck] = useState(true);
  const [notifyInvite, setNotifyInvite] = useState(true);
  const [notifyProfileActivity, setNotifyProfileActivity] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // --- NOTIFICATIONS STATE ---
  const [notifications, setNotifications] = useState([
    { id: 1, type: "photo_check", text: "Jessica Taylor checked your profile photo", time: "2 minutes ago", read: false },
    { id: 2, type: "invitation", text: "Michael Carter sent you an invitation to train together at PureGym Central", time: "15 minutes ago", read: false },
    { id: 3, type: "like", text: "Emily Watson liked your workout update", time: "1 hour ago", read: true },
    { id: 4, type: "comment", text: "David Kim commented on your post: 'Great form!'", time: "3 hours ago", read: true },
    { id: 5, type: "profile_check", text: "Oliver Green checked your bio and credentials", time: "5 hours ago", read: true }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // --- INSTAGRAM-STYLE FEED STATES ---
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Emily Watson",
      avatarColor: "bg-rose-500",
      avatarLetter: "E",
      role: "Fitness Partner (+1)",
      time: "2 hours ago",
      text: "Leg day today! Hit a new PR on squats: 140kg! Consistent training pays off. #legday #fitnessjourney",
      image: "https://images.pexels.com/photos/3837781/pexels-photo-3837781.jpeg?auto=compress&cs=tinysrgb&w=800",
      likes: 12,
      liked: false,
      comments: [
        { id: 1, author: "Michael Carter", text: "Incredible squat! What program are you running?" },
        { id: 2, author: "David Kim", text: "Pure strength! Good job." }
      ]
    },
    {
      id: 2,
      author: "Michael Carter",
      avatarColor: "bg-indigo-500",
      avatarLetter: "M",
      role: "Personal Trainer",
      time: "4 hours ago",
      text: "Perfect morning for a run in Central Park. Dynamic warm-up done, let's crush these 10k! Who's joining next time? 🏃‍♂️",
      image: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800",
      likes: 8,
      liked: false,
      comments: [
        { id: 1, author: "Emily Watson", text: "Count me in for next Tuesday morning!" }
      ]
    },
    {
      id: 3,
      author: "David Kim",
      avatarColor: "bg-teal-500",
      avatarLetter: "D",
      role: "Fitness Partner (+1)",
      time: "1 day ago",
      text: "Post-workout meal: Grilled chicken breast, sweet potato mash, and steamed broccoli. Fueling the recovery! 🍗🥑",
      image: "https://images.pexels.com/photos/3764640/pexels-photo-3764640.jpeg?auto=compress&cs=tinysrgb&w=800",
      likes: 15,
      liked: false,
      comments: [
        { id: 1, author: "Sophie Brown", text: "Looks delicious, clean eating is key!" }
      ]
    }
  ]);

  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const filePostInputRef = useRef(null);
  const [commentInputs, setCommentInputs] = useState({});

  const handlePostImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size should not exceed 10MB.");
        return;
      }
      const url = URL.createObjectURL(file);
      setNewPostImage({ file, url });
    }
  };

  const handleRemovePostImage = () => {
    if (newPostImage?.url) {
      URL.revokeObjectURL(newPostImage.url);
    }
    setNewPostImage(null);
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim() && !newPostImage) return;

    const newPost = {
      id: posts.length + 1,
      author: currentUser?.name || "Demo User",
      avatarColor: "bg-brand",
      avatarLetter: currentUser?.name?.charAt(0) || "U",
      avatarUrl: currentUser?.media?.[0]?.url,
      role: currentUser?.role === "trainer" ? "Personal Trainer" : "Fitness Partner (+1)",
      time: "Just now",
      text: newPostText,
      image: newPostImage ? newPostImage.url : null,
      likes: 0,
      liked: false,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
    setNewPostImage(null);
  };

  const handleLikePost = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const nextLiked = !post.liked;
        if (nextLiked) {
          const author = post.author;
          setNotifications(prev => [
            { id: prev.length + 1, type: "like", text: `You liked ${author}'s post`, time: "Just now", read: true },
            ...prev
          ]);
        }
        return {
          ...post,
          liked: nextLiked,
          likes: nextLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: value
    });
  };

  const handleAddComment = (postId, e) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: post.comments.length + 1,
              author: currentUser?.name || "Demo User",
              text: commentText
            }
          ]
        };
      }
      return post;
    }));

    setCommentInputs({
      ...commentInputs,
      [postId]: ""
    });
  };

  // --- RENDER FUNCTIONS FOR SECTIONS ---
  
  const renderFeed = () => {
    return (
      <div className="space-y-6">
        {/* POST CREATOR */}
        <div className="border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Share a workout update</h3>
          <form onSubmit={handleCreatePost} className="space-y-3">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="What's on your mind? Share your fitness journey..."
              rows={3}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-brand focus:bg-white dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-50 dark:focus:border-brand dark:focus:bg-neutral-900 resize-none"
            />
            
            {newPostImage && (
              <div className="relative aspect-video max-h-48 rounded-lg overflow-hidden border border-slate-200 dark:border-neutral-800 group">
                <img src={newPostImage.url} alt="Attached" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemovePostImage}
                  className="absolute top-2 right-2 h-6 w-6 bg-black/60 rounded-full text-white flex items-center justify-center text-xs hover:bg-black transition"
                >
                  &times;
                </button>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div>
                <input
                  type="file"
                  ref={filePostInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePostImageUpload}
                />
                <button
                  type="button"
                  onClick={() => filePostInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 py-2 px-3 border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
                >
                  <FiPlus className="h-3 w-3" />
                  <span>Attach Image</span>
                </button>
              </div>
              <button
                type="submit"
                className="py-2 px-5 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-lg transition"
              >
                Share Post
              </button>
            </div>
          </form>
        </div>

        {/* FEED POSTS */}
        <div className="space-y-6">
          {posts.map((post) => {
            const hasLiked = post.liked;
            return (
              <div key={post.id} className="border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-sm">
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-neutral-800/60">
                  <div className="flex items-center gap-3">
                    {post.avatarUrl ? (
                      <img src={post.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <span className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${post.avatarColor}`}>
                        {post.avatarLetter}
                      </span>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{post.author}</h4>
                      <div className="flex gap-1.5 items-center mt-0.5">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-brand dark:text-white/80">{post.role}</span>
                        <span className="text-[10px] text-slate-400">&bull; {post.time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                    {post.text}
                  </p>
                  {post.image && (
                    <div className="rounded-lg overflow-hidden border border-slate-100 dark:border-neutral-800/80 bg-slate-50 dark:bg-neutral-950">
                      <img src={post.image} alt="post media" className="w-full h-auto object-cover max-h-[380px] mx-auto" />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-4 py-3 bg-slate-50/50 dark:bg-neutral-900/50 border-t border-slate-100 dark:border-neutral-800/60 flex items-center gap-5 text-slate-500 dark:text-slate-400">
                  <button
                    type="button"
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center gap-1.5 hover:text-rose-500 transition text-xs font-semibold"
                  >
                    <FiHeart className={`h-4 w-4 transition-colors ${hasLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{post.likes} {post.likes === 1 ? "Like" : "Likes"}</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <FiMessageCircle className="h-4 w-4" />
                    <span>{post.comments.length} {post.comments.length === 1 ? "Comment" : "Comments"}</span>
                  </div>
                </div>

                {/* Comments */}
                <div className="p-4 bg-slate-50/30 dark:bg-neutral-950/20 border-t border-slate-100 dark:border-neutral-800/60 space-y-4">
                  {post.comments.length > 0 && (
                    <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="text-xs flex items-start gap-2">
                          <span className="font-bold text-slate-900 dark:text-white shrink-0">{comment.author}:</span>
                          <span className="text-slate-600 dark:text-slate-300">{comment.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-100"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition"
                    >
                      Post
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderNotifications = () => {
    return (
      <div className="border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-200 dark:border-neutral-800 pb-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Activities and updates relating to your profile.</p>
          </div>
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="text-xs text-brand dark:text-white hover:underline font-semibold"
          >
            Mark all as read
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((notif) => {
            let icon = "🔔";
            let iconColor = "bg-brand/10 text-brand dark:bg-white/10 dark:text-white";
            if (notif.type === "like") {
              icon = "❤️";
              iconColor = "bg-rose-500/10 text-rose-500";
            } else if (notif.type === "comment") {
              icon = "💬";
              iconColor = "bg-indigo-500/10 text-indigo-500";
            } else if (notif.type === "invitation") {
              icon = "📩";
              iconColor = "bg-green-500/10 text-green-500";
            } else if (notif.type === "photo_check") {
              icon = "📷";
              iconColor = "bg-sky-500/10 text-sky-500";
            } else if (notif.type === "profile_check") {
              icon = "👤";
              iconColor = "bg-teal-500/10 text-teal-500";
            }

            return (
              <div 
                key={notif.id} 
                className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                  notif.read 
                    ? "bg-white border-slate-100 dark:bg-neutral-900 dark:border-neutral-800/60" 
                    : "bg-brand/5 border-brand/20 dark:bg-white/5 dark:border-white/20"
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-sm ${iconColor}`}>
                  {icon}
                </div>
                <div className="flex-1 space-y-1">
                  <p className={`text-xs ${notif.read ? "text-slate-600 dark:text-slate-300" : "text-slate-900 font-semibold dark:text-white"}`}>
                    {notif.text}
                  </p>
                  <span className="text-[10px] text-slate-400 block">{notif.time}</span>
                </div>
                {!notif.read && (
                  <span className="h-2 w-2 rounded-full bg-brand dark:bg-white mt-1.5 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-200 dark:border-neutral-800 pb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Settings</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure your personal profile and preferences.</p>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-xs rounded-lg font-semibold animate-pulse">
            ✓ Settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* GENERAL SETTINGS */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">General Settings</h4>
            
            {/* Subscription status */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Advanced Subscription
              </label>
              <select
                value={subscription}
                onChange={(e) => setSubscription(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-100 dark:focus:border-brand"
              >
                <option value="free">Free Plan</option>
                <option value="super-plus">Super +1 Subscription</option>
                <option value="super-pt">SuperPT Subscription</option>
              </select>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-100 dark:focus:border-brand"
              >
                <option value="English">English</option>
                <option value="Spanish">Español (Spanish)</option>
                <option value="French">Français (French)</option>
                <option value="German">Deutsch (German)</option>
                <option value="Japanese">日本語 (Japanese)</option>
              </select>
            </div>

            {/* Purchase Plan */}
            <div className="p-4 bg-brand/5 border border-brand/10 rounded-xl space-y-3">
              <h5 className="text-xs font-bold text-brand dark:text-white uppercase tracking-wider">Purchase & Upgrade Tiers</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Unlock professional client scheduling, unlimited matching invitations, advanced profile spotlights, and dedicated messaging threads.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => alert("Simulating checkout for Super +1...")}
                  className="flex-1 py-1.5 px-3 bg-brand hover:bg-brand-hover text-white text-[10px] font-bold rounded-lg transition"
                >
                  Upgrade to Super +1
                </button>
                <button
                  type="button"
                  onClick={() => alert("Simulating checkout for SuperPT...")}
                  className="flex-1 py-1.5 px-3 border border-brand text-brand hover:bg-brand hover:text-white text-[10px] font-bold rounded-lg transition dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
                >
                  Upgrade to SuperPT
                </button>
              </div>
            </div>
          </div>

          {/* APPLICATION SETTINGS */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-neutral-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Application Settings</h4>
            
            {/* Notification settings */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                In-App & Push Notifications (Dynamic Alerts)
              </label>
              
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyPhotoCheck}
                    onChange={(e) => setNotifyPhotoCheck(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300">Notify me when someone checks my photo</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyInvite}
                    onChange={(e) => setNotifyInvite(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300">Notify me when someone is inviting me to work out</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyProfileActivity}
                    onChange={(e) => setNotifyProfileActivity(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300">Notify me of general profile activities (likes, comments)</span>
                </label>
              </div>
            </div>

            {/* Theme selector */}
            <div className="flex justify-between items-center py-2">
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Dark Mode</span>
                <span className="text-[10px] text-slate-400">Switch application appearance</span>
              </div>
              <button
                type="button"
                onClick={onToggleTheme}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-slate-200 dark:bg-brand"
              >
                <span className="sr-only">Toggle dark theme</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    theme === "dark" ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* About Gym+1 */}
            <div className="p-3.5 border border-slate-100 dark:border-neutral-800 rounded-lg text-xs space-y-1.5 text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">About Gym+1</span>
              <p>Version 2.4.0 (Stable Release)</p>
              <p>Designed for workout consistency and fitness tracking.</p>
              <div className="flex gap-3 pt-1 text-brand dark:text-white font-semibold">
                <a href="#privacy" className="hover:underline">Privacy Policy</a>
                <span>&bull;</span>
                <a href="#terms" className="hover:underline">Terms of Service</a>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition"
            >
              Save Plan & Preferences
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm gap-4">
          <div className="flex items-center gap-4">
            {currentUser?.media && currentUser.media.length > 0 ? (
              <div className="h-16 w-16 rounded-full overflow-hidden border border-slate-200 dark:border-neutral-800 shrink-0 bg-slate-100 dark:bg-neutral-800">
                {currentUser.media[0].type === "image" ? (
                  <img src={currentUser.media[0].url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <video src={currentUser.media[0].url} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                )}
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-lg shrink-0">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Welcome back, {currentUser?.name || "Demo User"}!
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand/10 text-brand dark:bg-white/10 dark:text-white font-semibold">
                  {currentUser?.role === "trainer" ? "Personal Trainer" : "Fitness Partner (+1)"}
                </span>
                {currentUser?.age && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Age: {currentUser.age}
                  </span>
                )}
                {currentUser?.gender && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    • Gender: {currentUser.gender}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition self-start md:self-center"
          >
            <FiLogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap border-b border-slate-200 dark:border-neutral-800 gap-y-2">
              <button
                type="button"
                onClick={() => { setActiveTab("partners"); setChatUser(null); }}
                className={`pb-3 text-sm font-semibold border-b-2 mr-6 transition-colors ${
                  activeTab === "partners"
                    ? "border-brand text-brand dark:border-white dark:text-white"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                }`}
              >
                {currentUser?.role === "trainer" ? "Leads & Clients" : "Partner Matches"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("chats")}
                className={`pb-3 text-sm font-semibold border-b-2 mr-6 transition-colors ${
                  activeTab === "chats"
                    ? "border-brand text-brand dark:border-white dark:text-white"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                }`}
              >
                Conversations
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("feed")}
                className={`pb-3 text-sm font-semibold border-b-2 mr-6 transition-colors ${
                  activeTab === "feed"
                    ? "border-brand text-brand dark:border-white dark:text-white"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                }`}
              >
                Community Feed
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("notifications"); markAllNotificationsAsRead(); }}
                className={`pb-3 text-sm font-semibold border-b-2 mr-6 transition-colors flex items-center gap-1.5 ${
                  activeTab === "notifications"
                    ? "border-brand text-brand dark:border-white dark:text-white"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                }`}
              >
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-brand text-white dark:bg-white dark:text-black">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`pb-3 text-sm font-semibold border-b-2 mr-6 transition-colors ${
                  activeTab === "settings"
                    ? "border-brand text-brand dark:border-white dark:text-white"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                }`}
              >
                Settings
              </button>
            </div>

            {activeTab === "partners" && (
              <div className="space-y-4">
                {currentUser?.role === "trainer" && (
                  <div className="bg-brand/5 border border-brand/10 rounded-xl p-4 mb-4">
                    <h3 className="text-xs font-bold text-brand uppercase tracking-wider">Trainer Dashboard Active</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      You are in Trainer Mode. Clients can browse your profile, view credentials, and book sessions.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser?.role === "trainer" ? (
                    mockClients.map((client, i) => (
                      <div key={i} className="border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-sm space-y-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                            {client.status}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">{client.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{client.goal}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab("chats");
                              setChatUser(client.name);
                            }}
                            className="flex-1 py-2 px-3 bg-brand text-white text-xs font-semibold rounded-lg text-center hover:bg-brand-hover transition"
                          >
                            Accept & Message
                          </button>
                          <button
                            type="button"
                            className="py-2 px-3 border border-slate-200 dark:border-neutral-800 text-slate-500 hover:text-slate-950 dark:hover:text-white text-xs font-semibold rounded-lg transition"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    mockPartners.map((partner, i) => (
                      <div key={i} className="border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">{partner.name}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {partner.loc} • <span className="font-semibold text-brand dark:text-white">{partner.dist} km away</span>
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-brand bg-brand/10 dark:bg-white/10 dark:text-white px-2 py-1 rounded-full">
                            {partner.match}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Goal</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">{partner.goal}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab("chats");
                            setChatUser(partner.name);
                          }}
                          className="w-full py-2 bg-brand text-white text-xs font-semibold rounded-lg text-center hover:bg-brand-hover transition"
                        >
                          Send Invitation
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "chats" && (
              <div className="border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl overflow-hidden min-h-[400px] flex flex-col">
                <div className="bg-slate-50 dark:bg-neutral-800/50 border-b border-slate-200 dark:border-neutral-800 p-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {chatUser ? `Chat with ${chatUser}` : "Select a contact to begin"}
                  </span>
                  {chatUser && (
                    <button
                      type="button"
                      onClick={() => setChatUser(null)}
                      className="text-xs text-slate-500 hover:text-slate-950 dark:hover:text-white"
                    >
                      Clear chat
                    </button>
                  )}
                </div>

                {chatUser ? (
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[300px]">
                      {messages.map((msg) => {
                        const isMe = msg.sender === "me";
                        return (
                          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                              isMe 
                                ? 'bg-brand text-white rounded-tr-none'
                                : 'bg-slate-100 text-slate-900 dark:bg-neutral-800 dark:text-slate-50 rounded-tl-none'
                            }`}>
                              <p>{msg.text}</p>
                              <span className={`text-[9px] mt-1 block text-right ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                                {msg.time}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <form onSubmit={handleSendMessage} className="border-t border-slate-200 dark:border-neutral-800 p-3 flex gap-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-50"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-lg transition"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
                    <FiMessageCircle className="h-10 w-10 text-slate-300" />
                    <p className="text-sm">Click "Send Invitation" or "Accept & Message" to start a chat.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "feed" && renderFeed()}

            {activeTab === "notifications" && renderNotifications()}

            {activeTab === "settings" && renderSettings()}
          </div>

          <div className="space-y-6">
            {currentUser && (
              <div className="border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentUser.role === "trainer" ? "Trainer Profile Details" : "Member Profile Details"}
                </h3>
                <div className="space-y-3 text-xs">
                  {currentUser.media && currentUser.media.length > 0 && (
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-800 mb-4">
                      {currentUser.media[0].type === "image" ? (
                        <img src={currentUser.media[0].url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <video src={currentUser.media[0].url} className="w-full h-full object-cover" controls muted autoPlay loop playsInline />
                      )}
                    </div>
                  )}
                  {currentUser.experience && (
                    <div>
                      <span className="text-slate-400 uppercase font-semibold text-[10px]">Experience</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{currentUser.experience}</p>
                    </div>
                  )}
                  {(currentUser.frequency || currentUser.workoutTime) && (
                    <div>
                      <span className="text-slate-400 uppercase font-semibold text-[10px]">Frequency & Prefs</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {currentUser.frequency ? `${currentUser.frequency} days/week` : "Not set"} • {currentUser.workoutTime || "Not set"}
                      </p>
                    </div>
                  )}
                  {currentUser.location && (
                    <div>
                      <span className="text-slate-400 uppercase font-semibold text-[10px]">Location</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.location}</p>
                    </div>
                  )}
                  {currentUser.specializations && currentUser.specializations.length > 0 && (
                    <div>
                      <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">Specialisations</span>
                      <div className="flex flex-wrap gap-1">
                        {currentUser.specializations.map((spec) => (
                          <span key={spec} className="px-2 py-0.5 bg-brand/5 border border-brand/10 text-brand dark:border-white/20 dark:text-white rounded-full text-[10px] capitalize">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {currentUser.interests && currentUser.interests.length > 0 && (
                    <div>
                      <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">Interests</span>
                      <div className="flex flex-wrap gap-1">
                        {currentUser.interests.map((interest) => (
                          <span key={interest} className="px-2 py-0.5 bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-300 rounded-full text-[10px] capitalize">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {currentUser.ethnicities && currentUser.ethnicities.length > 0 && (
                    <div>
                      <span className="text-slate-400 uppercase font-semibold text-[10px]">Ethnicities</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.ethnicities.join(", ")}</p>
                    </div>
                  )}
                  {currentUser.biography && (
                    <div className="border-t border-slate-100 dark:border-neutral-800 pt-3">
                      <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">Biography</span>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">&ldquo;{currentUser.biography}&rdquo;</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Spotlight Visibility</span>
                  <span className="font-semibold text-brand dark:text-white">Active</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand h-full w-[70%]" />
                </div>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-500">Likes remaining today</span>
                  <span className="font-semibold">Unlimited (Demo)</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-indigo-900 to-brand p-5 text-white shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                  Super Premium
                </span>
                <h4 className="text-base font-bold mt-2">Unlock unlimited fitness matching</h4>
                <p className="text-xs text-white/80 mt-1 leading-relaxed">
                  Join community challenges, participate in expert AMA sessions, and double your connection rate.
                </p>
              </div>
              <button
                type="button"
                className="w-full py-2 bg-white text-brand text-xs font-semibold rounded-lg text-center hover:bg-slate-50 transition"
              >
                Go Pro Free for 30 Days
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- MOCK DATA FOR MARKETPLACE & BLOG ---

const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "12-Week Hypertrophy Blueprint",
    category: "workouts",
    basePriceGbp: 24.99,
    coachName: "Michael Carter",
    coachAvatar: "M",
    coachAvatarColor: "bg-indigo-500",
    image: "https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.9,
    description: "Build serious muscle volume with this scientifically designed hypertrophy program focusing on compound lifts, progressive overload, and high density sets."
  },
  {
    id: 2,
    title: "Lean & Clean Nutrition Guide",
    category: "nutrition",
    basePriceGbp: 14.99,
    coachName: "Emily Watson",
    coachAvatar: "E",
    coachAvatarColor: "bg-rose-500",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.8,
    description: "A complete macro-balanced meal prep guide with 50 easy-to-cook high-protein recipes, weekly shopping lists, and bodyweight adaptation cheat sheets."
  },
  {
    id: 3,
    title: "1-on-1 Virtual Coaching (4 Sessions)",
    category: "coaching",
    basePriceGbp: 75.00,
    coachName: "Alex Johnson (Demo)",
    coachAvatar: "A",
    coachAvatarColor: "bg-brand",
    image: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 5.0,
    description: "Private video check-ins, custom program design, direct messaging access, and weekly video form critiques to master your training execution."
  },
  {
    id: 4,
    title: "Premium Loop Resistance Bands",
    category: "gear",
    basePriceGbp: 19.99,
    coachName: "David Kim",
    coachAvatar: "D",
    coachAvatarColor: "bg-teal-500",
    image: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.7,
    description: "A set of five premium fabric resistance bands with anti-slip grip layers. Includes a travel pouch and a workout reference chart."
  }
];

const MOCK_ARTICLES = [
  {
    id: 1,
    title: "The Science of Muscle Recovery: Why Rest Days are Critical",
    category: "recovery",
    excerpt: "Discover why rest days are just as important as your training days. We dive deep into protein synthesis, glycogen restoration, and nervous system fatigue.",
    content: "When you lift weights, you aren't actually building muscle in the gym; you are creating microscopic tears in the muscle fibers. The actual muscle growth (hypertrophy) happens when you rest, refuel, and sleep.\n\n### 1. The Role of Protein Synthesis\nAfter a training session, muscle protein synthesis (MPS) is elevated. Without adequate rest and amino acid availability, the rate of muscle breakdown remains high, negating your hard work. Resting allows MPS to exceed breakdown rates.\n\n### 2. Glycogen Depletion and Refueling\nDuring high-intensity training, your body uses glycogen (stored carbohydrates) for energy. Rest days allow your body to fully replenish these stores, ensuring you have the explosive power required for your next session.\n\n### 3. Central Nervous System (CNS) Fatigue\nHeavy lifting puts a massive strain on your nervous system. Continual training without deloads or rest days can lead to chronic fatigue, decreased coordination, and higher injury rates. Aim for at least 1-2 rest days per week to perform at your absolute peak.",
    author: "Michael Carter",
    readTime: "5 min read",
    image: "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "June 2, 2026"
  },
  {
    id: 2,
    title: "Nutrition 101: Navigating Macros for Body Recomposition",
    category: "nutrition",
    excerpt: "Unpack the math behind proteins, fats, and carbs. Learn how to calculate your baseline energy expenditure and structure macros to burn fat while building lean mass.",
    content: "Body recomposition—losing fat and gaining muscle simultaneously—is the holy grail of fitness. Achieving it requires a precise combination of strength training and macro-nutrient management.\n\n### Understanding the Big Three Macros:\n- **Protein (4 kcal/g)**: The building block of muscle. For recomposition, aim for 1.8 to 2.2 grams of protein per kilogram of body weight.\n- **Carbohydrates (4 kcal/g)**: Your body's primary energy source. Focus on complex carbs (sweet potatoes, oats, brown rice) to fuel intense sessions.\n- **Fats (9 kcal/g)**: Essential for hormone production, joint health, and nutrient absorption. Keep fats at 20-30% of total daily calories.\n\nTo recompose, eat at a very slight calorie deficit (10-15% below maintenance) while keeping protein high and training hard.",
    author: "Emily Watson",
    readTime: "7 min read",
    image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "May 28, 2026"
  },
  {
    id: 3,
    title: "Mastering the Mindset: Overcoming Gym Anxiety",
    category: "motivation",
    excerpt: "Gym anxiety is real, but it shouldn't hold you back. Here are 5 practical strategies to help you walk into the weight room with confidence.",
    content: "Walking into a crowded gym can be intimidating, especially if you are new to working out. Remember this: everyone in that room was a beginner once, and 95% of them are too focused on their own reflections and workouts to notice anyone else.\n\n### Strategies to Build Confidence:\n1. **Wear Headphones**: Music or a podcast creates a personal barrier that helps shut out the surrounding noise.\n2. **Have a Clear Plan**: Know exactly which exercises, sets, and reps you are doing before you step inside.\n3. **Start in the Comfort Zone**: Spend 10 minutes on a cardio machine to acclimate to the environment and observe the floor layout.\n4. **Work Out with a Partner**: Utilizing a platform like Gym+1 to find a workout buddy makes you instantly feel safer and supported.\n5. **Focus on Consistency, Not Intensity**: Simply showing up is a victory. The comfort will follow.",
    author: "Alex Johnson",
    readTime: "4 min read",
    image: "https://images.pexels.com/photos/3775168/pexels-photo-3775168.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "May 25, 2026"
  }
];

// --- MARKETPLACE VIEW COMPONENT ---

function MarketplaceView({ setView, currentUser, pricingCurrency }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [activeCheckoutProduct, setActiveCheckoutProduct] = useState(null);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Listing creator states
  const [showCreateListingModal, setShowCreateListingModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("workouts");
  const [newDescription, setNewDescription] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);

  // Checkout inputs
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutCard, setCheckoutCard] = useState("");
  const [checkoutExpiry, setCheckoutExpiry] = useState("");
  const [checkoutCvc, setCheckoutCvc] = useState("");

  const region = PRICING_REGIONS[pricingCurrency || "GBP"] || PRICING_REGIONS.GBP;

  const convertPrice = (gbpPrice) => {
    if (gbpPrice === null || gbpPrice === undefined) return "Free";
    const converted = gbpPrice * region.rateFromGbp;
    if (region.code === "NGN" || region.code === "KES" || region.code === "ZAR") {
      return `${region.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${region.symbol}${converted.toFixed(2)}`;
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) return;

    const imageUrl = newImageFile 
      ? URL.createObjectURL(newImageFile)
      : "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800";

    const newProduct = {
      id: products.length + 1,
      title: newTitle,
      category: newCategory,
      basePriceGbp: parseFloat(newPrice),
      coachName: currentUser?.name || "Demo Coach",
      coachAvatar: currentUser?.name?.charAt(0) || "C",
      coachAvatarColor: "bg-brand",
      image: imageUrl,
      rating: 5.0,
      description: newDescription
    };

    setProducts([newProduct, ...products]);
    setNewTitle("");
    setNewPrice("");
    setNewDescription("");
    setNewImageFile(null);
    setShowCreateListingModal(false);
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!checkoutName || !checkoutCard || !checkoutExpiry || !checkoutCvc) return;

    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsCheckoutSuccess(true);
    }, 2000);
  };

  const closeCheckout = () => {
    setActiveCheckoutProduct(null);
    setIsCheckoutSuccess(false);
    setCheckoutName("");
    setCheckoutCard("");
    setCheckoutExpiry("");
    setCheckoutCvc("");
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.coachName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Checkout Modal Overlay */}
      {activeCheckoutProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isCheckoutSuccess ? "Payment Successful" : "Secure Checkout"}
              </h3>
              <button 
                type="button" 
                onClick={closeCheckout}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {isCheckoutSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Order Confirmed!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-4">
                  Your payment for <strong>{activeCheckoutProduct.title}</strong> has been processed successfully. You will receive an email shortly to access the contents.
                </p>
                <button
                  type="button"
                  onClick={closeCheckout}
                  className="mt-4 px-6 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-lg transition"
                >
                  Return to Marketplace
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="p-3 bg-slate-50 dark:bg-neutral-950 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Product</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{activeCheckoutProduct.title}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-100 dark:border-neutral-900">
                    <span>Total Amount</span>
                    <span className="font-bold text-brand dark:text-white">{convertPrice(activeCheckoutProduct.basePriceGbp)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Name on Card</label>
                    <input
                      type="text"
                      required
                      value={checkoutName}
                      onChange={(e) => setCheckoutName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      value={checkoutCard}
                      onChange={(e) => setCheckoutCard(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={checkoutExpiry}
                        onChange={(e) => setCheckoutExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">CVC</label>
                      <input
                        type="password"
                        required
                        value={checkoutCvc}
                        onChange={(e) => setCheckoutCvc(e.target.value)}
                        placeholder="•••"
                        maxLength={3}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPaying}
                  className="w-full py-2.5 bg-brand hover:bg-brand-hover disabled:bg-slate-400 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                  {isPaying ? (
                    <>
                      <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <span>Pay {convertPrice(activeCheckoutProduct.basePriceGbp)}</span>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* Create Listing Modal Overlay */}
      {showCreateListingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Product Listing</h3>
              <button 
                type="button" 
                onClick={() => setShowCreateListingModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 6-Week Functional Kettlebell Guide"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Price (Base £ GBP)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g. 19.99"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-100"
                  >
                    <option value="workouts">Workouts</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="coaching">Coaching</option>
                    <option value="gear">Fitness Gear</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide details on target audience, goals, and what the purchaser will receive..."
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-100 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImageFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 dark:file:bg-neutral-800 dark:file:text-slate-200 hover:file:bg-slate-200 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-lg transition"
              >
                Publish Listing
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Main Layout */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiShoppingBag className="text-brand dark:text-white" />
              <span>Gym+1 Marketplace</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Purchase premium programs, diet books, and 1-on-1 coaching plans designed by fitness professionals.
            </p>
          </div>
          <div className="flex gap-2">
            {currentUser?.role === "trainer" && (
              <button
                type="button"
                onClick={() => setShowCreateListingModal(true)}
                className="py-2.5 px-4 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <FiPlus className="h-4 w-4" />
                <span>Create Listing</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setView("landing")}
              className="py-2.5 px-4 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {["all", "workouts", "nutrition", "coaching", "gear"].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${
                  selectedCategory === category
                    ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-black dark:border-white"
                    : "border-slate-200 hover:border-slate-300 text-slate-500 dark:border-neutral-800 dark:text-slate-400 dark:hover:border-neutral-700"
                }`}
              >
                {category === "all" ? "All Products" : category === "gear" ? "Fitness Gear" : category}
              </button>
            ))}
          </div>

          <div className="relative max-w-sm w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products or coaches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl text-xs outline-none focus:border-brand dark:text-slate-100"
            />
          </div>
        </div>

        {/* Grid List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 dark:border-neutral-800 rounded-2xl text-slate-400 text-sm">
            No products found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-video bg-slate-100 dark:bg-neutral-800 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy" 
                    />
                    <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-bold flex items-center gap-1">
                      <FiStar className="fill-yellow-400 text-yellow-400 h-3 w-3" />
                      <span>{product.rating.toFixed(1)}</span>
                    </div>
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-brand text-white">
                      {product.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-brand dark:group-hover:text-white transition">
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-slate-50 dark:border-neutral-900/60 mt-auto">
                  <div className="flex items-center gap-2">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${product.coachAvatarColor || 'bg-brand'}`}>
                      {product.coachAvatar}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">{product.coachName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {convertPrice(product.basePriceGbp)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveCheckoutProduct(product)}
                      className="py-1.5 px-3.5 bg-brand hover:bg-brand-hover text-white text-[10px] font-bold rounded-lg transition"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// --- BLOG VIEW COMPONENT ---

function BlogView({ setView, currentUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [articles, setArticles] = useState(MOCK_ARTICLES);
  const [activeReadArticle, setActiveReadArticle] = useState(null);

  // Write Article states
  const [showWriteArticleModal, setShowWriteArticleModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newExcerpt, setNewExcerpt] = useState("");
  const [newCategory, setNewCategory] = useState("training");
  const [newContent, setNewContent] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);

  const handlePublishArticle = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const imageUrl = newImageFile 
      ? URL.createObjectURL(newImageFile)
      : "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800";

    const newArticle = {
      id: articles.length + 1,
      title: newTitle,
      category: newCategory,
      excerpt: newExcerpt || newContent.substring(0, 120) + "...",
      content: newContent,
      author: currentUser?.name || "Demo Author",
      readTime: `${Math.max(1, Math.round(newContent.split(/\s+/).length / 200))} min read`,
      image: imageUrl,
      date: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
    };

    setArticles([newArticle, ...articles]);
    setNewTitle("");
    setNewExcerpt("");
    setNewContent("");
    setNewImageFile(null);
    setShowWriteArticleModal(false);
  };

  const filteredArticles = articles.filter(a => {
    const matchesCategory = selectedCategory === "all" || a.category === selectedCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = articles[0];

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Detailed Article Reader Modal Overlay */}
      {activeReadArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-neutral-800 p-5 shrink-0 bg-slate-50/50 dark:bg-neutral-900/50">
              <span className="text-xs uppercase font-bold text-brand bg-brand/5 dark:bg-white/10 dark:text-white px-2.5 py-0.5 rounded-full">
                {activeReadArticle.category}
              </span>
              <button 
                type="button" 
                onClick={() => setActiveReadArticle(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  {activeReadArticle.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{activeReadArticle.author}</span>
                  <span>&bull;</span>
                  <span>{activeReadArticle.date}</span>
                  <span>&bull;</span>
                  <span>{activeReadArticle.readTime}</span>
                </div>
              </div>

              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800">
                <img src={activeReadArticle.image} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed whitespace-pre-line text-sm">
                {activeReadArticle.content}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-neutral-800 flex justify-end shrink-0 bg-slate-50/50 dark:bg-neutral-900/50">
              <button
                type="button"
                onClick={() => setActiveReadArticle(null)}
                className="py-1.5 px-5 border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
              >
                Close Article
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Write Article Modal Overlay */}
      {showWriteArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Publish Fitness Article</h3>
              <button 
                type="button" 
                onClick={() => setShowWriteArticleModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePublishArticle} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 5 Common Mistakes in Squat Mechanics"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-100"
                  >
                    <option value="training">Training</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="recovery">Recovery</option>
                    <option value="motivation">Motivation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewImageFile(e.target.files[0])}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 dark:file:bg-neutral-800 dark:file:text-slate-200 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Excerpt Summary</label>
                <input
                  type="text"
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  placeholder="e.g. A quick guide detailing biomechanical errors during compound squats..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Article Body Content</label>
                <textarea
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write your advice, instructions, or suggestions here..."
                  rows={6}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-100 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-lg transition"
              >
                Publish Article
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Main Layout */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiBookOpen className="text-brand dark:text-white" />
              <span>Gym+1 Blog & Articles</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Read expert tips, scientific recovery methods, body recomposition blueprints, and motivation resources.
            </p>
          </div>
          <div className="flex gap-2">
            {currentUser?.role === "trainer" && (
              <button
                type="button"
                onClick={() => setShowWriteArticleModal(true)}
                className="py-2.5 px-4 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <FiPlus className="h-4 w-4" />
                <span>Write Article</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setView("landing")}
              className="py-2.5 px-4 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Featured Article Section */}
        {featuredArticle && selectedCategory === "all" && !searchQuery && (
          <div className="border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 p-6 items-center">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-800">
              <img src={featuredArticle.image} alt="" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
            </div>
            <div className="space-y-4 text-left">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-brand text-white">
                Featured • {featuredArticle.category}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {featuredArticle.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {featuredArticle.excerpt}
              </p>
              <div className="flex justify-between items-center border-t border-slate-50 dark:border-neutral-950/60 pt-3">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{featuredArticle.author}</span>
                  <span>&bull;</span>
                  <span>{featuredArticle.readTime}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveReadArticle(featuredArticle)}
                  className="py-1.5 px-4 bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-100 text-[10px] font-bold rounded-lg transition"
                >
                  Read Article
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {["all", "training", "nutrition", "recovery", "motivation"].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${
                  selectedCategory === category
                    ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-black dark:border-white"
                    : "border-slate-200 hover:border-slate-300 text-slate-500 dark:border-neutral-800 dark:text-slate-400 dark:hover:border-neutral-700"
                }`}
              >
                {category === "all" ? "All Articles" : category}
              </button>
            ))}
          </div>

          <div className="relative max-w-sm w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search articles by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl text-xs outline-none focus:border-brand dark:text-slate-100"
            />
          </div>
        </div>

        {/* Recent Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 dark:border-neutral-800 rounded-2xl text-slate-400 text-sm">
            No articles found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div 
                key={article.id} 
                className="border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group text-left"
              >
                <div>
                  <div className="relative aspect-video bg-slate-100 dark:bg-neutral-800 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy" 
                    />
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-brand text-white">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] text-slate-400">{article.date}</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-brand dark:group-hover:text-white transition line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-slate-50 dark:border-neutral-900/60 mt-auto">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{article.author}</span>
                    <span>&bull;</span>
                    <span>{article.readTime}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveReadArticle(article)}
                    className="py-1.5 px-3 bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-100 text-[10px] font-bold rounded-lg transition"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default App;
