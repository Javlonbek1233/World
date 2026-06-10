import React, { useState, useEffect } from "react";
import { 
  Globe, 
  Search, 
  Folder, 
  FileCode, 
  CheckCircle2, 
  Play, 
  Copy, 
  Cpu, 
  Layers, 
  AlertTriangle, 
  Heart, 
  BookOpen, 
  Terminal,
  ExternalLink,
  Sliders,
  Sparkles,
  Info,
  Compass,
  TrendingUp,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types for Interactive App ---
interface FileNode {
  name: string;
  type: "folder" | "file";
  description: string;
  tips?: string[];
  suggestedImports?: string[];
  children?: FileNode[];
}

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab ] = useState<"architecture" | "api-explorer" | "guidelines" | "checklist">("architecture");
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  
  // REST Countries API Sandbox State
  const [apiEndpoint, setApiEndpoint] = useState<string>("https://restcountries.com/v3.1/name/uzbekistan");
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiResult, setApiResult] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Dynamic Syllabus Checklist State (Persisted in localStorage in development)
  const [checklist, setChecklist] = useState({
    folderStructure: true, // Default to true as guide
    typesDefinition: false,
    searchFilter: false,
    regionFiltering: false,
    sortingLogic: false,
    detailsPage: false,
    borderCountries: false,
    favoritesStorage: false,
    responsiveLayout: false,
    loadingErrorStates: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("explorer_checklist");
    if (saved) {
      try {
        setChecklist(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleChecklist = (key: keyof typeof checklist) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    localStorage.setItem("explorer_checklist", JSON.stringify(updated));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // --- API Fetch Handler ---
  const fetchAPI = async (endpoint: string) => {
    setApiLoading(true);
    setApiError(null);
    setApiResult(null);
    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`Xato yuz berdi: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setApiResult(data);
    } catch (err: any) {
      setApiError(err.message || "API so'rovida qandaydir xatolik yuz berdi");
    } finally {
      setApiLoading(false);
    }
  };

  // --- Extract Country Info for Dynamic Bento Widget ---
  const getDynamicCountryData = () => {
    if (Array.isArray(apiResult) && apiResult.length > 0) {
      const c = apiResult[0];
      return {
        name: c.name?.common || "Noma'lum",
        region: c.region || "Central Asia",
        flagUrl: c.flags?.svg || c.flags?.png || "",
        capital: Array.isArray(c.capital) ? c.capital[0] : c.capital || "Ma'lumot yo'q",
        population: typeof c.population === 'number' ? c.population.toLocaleString() : "Ma'lumot yo'q",
        subregion: c.subregion || "Noma'lum",
        borders: Array.isArray(c.borders) ? c.borders : [],
        currencies: c.currencies ? Object.keys(c.currencies).join(", ") : "Ma'lumot yo'q"
      };
    }
    // Default Fallback: Uzbekistan
    return {
      name: "Uzbekistan",
      region: "Central Asia",
      flagUrl: "https://flagcdn.com/uz.svg",
      capital: "Tashkent",
      population: "34,232,450",
      subregion: "Central Asia",
      borders: ["AFG", "KAZ", "KGZ", "TJK", "TKM"],
      currencies: "UZS (so'm)"
    };
  };

  const currentCountry = getDynamicCountryData();

  // --- Next.js 15 App Folder Architecture Tree ---
  const fileTree: FileNode[] = [
    {
      name: "app",
      type: "folder",
      description: "Next.js 15 App Router loyihasining barcha sahifalari (routes) va server layoutlarini saqlaydi.",
      tips: [
        "Har bir papka alohida router segmentini ifodalaydi.",
        "page.tsx fayli o'sha routerni foydalanuvchiga ko'rsatadigan asosiy komponentdir.",
        "Komponentlarni sukut bo'yicha Server Component sifatida yarating, faqat zarur hollarda 'use client' ishlating."
      ],
      children: [
        {
          name: "layout.tsx",
          type: "file",
          description: "Butun sayt uchun umumiy bo'lgan asosiy struktura (HTML, Body, sarlavha, navigation bar va footer).",
          tips: [
            "Next.js 15 da global layout har doim Server Component bo'lishi lozim.",
            "Saytning umumiy CSS importini (index.css) faqat shu yerda amalga oshiring.",
            "Metadata (title, description) shu yerda eksport qilinadi."
          ],
          suggestedImports: [
            "import type { Metadata } from 'next';",
            "import '../index.css';"
          ]
        },
        {
          name: "page.tsx",
          type: "file",
          description: "WorldExplorer ilovasining Bosh Sahifasi (/). Barcha davlatlar ro'yxati, qidiruv paneli va filtrlash shu yerda ko'rinadi.",
          tips: [
            "REST Countries'dan barcha davlatlarni server panelida fetch qilishingiz tavsiya qilinadi (Server Component).",
            "Next.js 15 da fetch ma'lumotlarini keshlash avtomatik boshqariladi."
          ],
          suggestedImports: [
            "import SearchBar from '@/components/SearchBar';",
            "import RegionFilter from '@/components/RegionFilter';",
            "import CountryCard from '@/components/CountryCard';"
          ]
        },
        {
          name: "favorites",
          type: "folder",
          description: "Tanlangan davlatlar sahifasi (/favorites). Foydalanuvchi yoqtirgan davlatlar ro'yxati.",
          tips: [
            "localStorage'dan ma'lumot olish browser muhitini talab qiladi (Client Component yoki Hydration guard ishlatiladi)."
          ],
          children: [
            {
              name: "page.tsx",
              type: "file",
              description: "/favorites sahifasining ko'rinishi. Foydalanuvchi localStorage'ga saqlagan davlatlarni chiroyli tahlil qilib ko'rsatadi.",
              tips: [
                "Ilovadagi 'favorites' sahifasi client component sifatida yaratiladi yoki local-storage'dan xavfsiz o'qiladigan maxsus hook bilan boshqariladi.",
                "Ekranda hech narsa yo'qligida 'Bo'sh ro'yxat' xabarini ko'rsatishni unutmang."
              ]
            }
          ]
        },
        {
          name: "country",
          type: "folder",
          description: "Dinamik router papkasi.",
          tips: [
            "Papkaning nomi kvadrat qavslar ichida [cca3] shaklida bo'ladi, bu esa uning dinamik parametr ekanini anglatadi."
          ],
          children: [
            {
              name: "[cca3]",
              type: "folder",
              description: "Davlat kodi orqali ko'riladigan sahifa segmenti.",
              children: [
                {
                  name: "page.tsx",
                  type: "file",
                  description: "/country/[cca3] sahifasinig kodi. Davlatning barcha batafsil ma'lumotlarini (Statistika, qatshunlar, valyuta va chegaradosh davlatlar ro'yxati) ko'rsatadi.",
                  tips: [
                    "cca3 parametrini olish uchun Next.js params promisini await qilish lozim.",
                    "Misol: const { cca3 } = await params;"
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "components",
      type: "folder",
      description: "Loyihadagi barcha UI va foydalanuvchi interfeysi komponentlarini saqlovchi hudud.",
      tips: [
        "Sodda komponentlarni alohidaroq yarating.",
        "Props turlarini TypeScript interfeyslari yordamida aniqlang."
      ],
      children: [
        {
          name: "CountryCard.tsx",
          type: "file",
          description: "Sodda davlat kartochkasi. U bayroq, davlat nomi, aholi soni, mintaqa nomi va poytaxtni ko'rsatadi.",
          tips: [
            "Aholi sonini chiroyli formatlash uchun .toLocaleString() metodidan foydalaning.",
            "Kartochkani biron-bir chiroyli hover effekti bilan boyiting."
          ]
        },
        {
          name: "SearchBar.tsx",
          type: "file",
          description: "Matn kiritish paneli. Foydalanuvchi davlat nomini qidirishi uchun xizmat qiladi.",
          tips: [
            "Foydalanuvchi tez yozganida API'ga haddan taxation ko'p so'rov ketishini oldini olish uchun Client-side debounce yoki Next.js dynamic routing-dan foydalanish mumkin."
          ]
        },
        {
          name: "RegionFilter.tsx",
          type: "file",
          description: "Mintaqalarni tanlash (filtrlash) tugmalari yoki kontent.",
          tips: [
            "Variantlar: Africa, Americas, Asia, Europe, Oceania"
          ]
        },
        {
          name: "FavoriteButton.tsx",
          type: "file",
          description: "Tanlanganlar ro'yxatiga qo'shish yoki olib tashlash tugmasi.",
          tips: [
            "Heart (Yurak) ikonkasini ishlatishingiz mumkin.",
            "Ushbu tugma bosilganda favoritlarni local storage orqali yangilaydi."
          ]
        },
        {
          name: "BorderCountry.tsx",
          type: "file",
          description: "Chegaradosh qo'shni davlatlarni ko'rsatadigan havolali kichik tugmacha.",
          tips: [
            "Border cca3 kodi Next.js Link komponenti orqali marshrutga yo'naltiriladi."
          ]
        }
      ]
    },
    {
      name: "types",
      type: "folder",
      description: "Loyiha bo'ylab barcha umumiy ma'lumot turlarini (TypeScript TypeScript Interfaces) saqlaydigan papka.",
      tips: [
        "Tashqi API javobining batafsil xususiyatlarini shu yerda tiplashtirish o'quv jarayonini osonlashtiradi.",
        "Qasqartirilgan yoki anig bo'lmagan tiplardan qoching."
      ],
      children: [
        {
          name: "index.ts",
          type: "file",
          description: "Asosiy TypeScript turlari joylagan hudud.",
          tips: [
            "REST Countries API'ning to'liq javob turi murakkab. Eng asosiy property'larni (name, cca3, flags, capital, population, region, subregion, borders) aniqlab olish kifoya."
          ]
        }
      ]
    }
  ];

  // Helper renderer to render folder/file details tree
  const renderTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => {
      const isFolder = node.type === "folder";
      const isSelected = selectedFile?.name === node.name;
      
      return (
        <div key={node.name} style={{ paddingLeft: `${depth * 12}px` }}>
          <button
            onClick={() => setSelectedFile(node)}
            className={`w-full text-left flex items-center gap-2 py-1.5 px-2 rounded-lg transition-all ${
              isSelected 
                ? "bg-indigo-600 text-white font-medium" 
                : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            {isFolder ? (
              <Folder className="w-4 h-4 text-amber-400 fill-amber-500/20" />
            ) : (
              <FileCode className="w-4 h-4 text-blue-400" />
            )}
            <span className="text-xs font-mono">{node.name}</span>
            {isFolder && <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded">dir</span>}
          </button>
          {isFolder && node.children && (
            <div className="border-l border-slate-800 ml-3 my-0.5">
              {renderTree(node.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 flex flex-col font-sans selection:bg-indigo-500 selection:text-white" id="worldexplorer-bento-dashboard">
      
      {/* Header Section */}
      <header className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            WORLD<span className="text-indigo-500">EXPLORER</span>
          </h1>
          <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">
            Next.js 15 App Router Architecture
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="px-3.5 py-1.5 bg-slate-900 border border-slate-850 rounded-xl text-xs font-medium flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Senior Mentor Active
          </div>
          <div className="px-3.5 py-1.5 bg-indigo-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/20">
            v3.1 REST API Sandbox
          </div>
        </div>
      </header>

      {/* Main Bento Grid Container */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-5 flex-grow">
        
        {/* BENTO CARD 1: Featured reactive country widget (7 Cols span) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-xl flex flex-col justify-between group">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10 pointer-events-none" />
          
          {/* Stylized simulated flag illustration / graphic */}
          <div className="h-44 w-full bg-slate-950/60 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(99,102,241,0.1)_0%,transparent_100%]" />
            <div className="w-56 h-32 bg-slate-800 relative overflow-hidden rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-105 border border-slate-700/60">
              {currentCountry.flagUrl ? (
                <img 
                  src={currentCountry.flagUrl} 
                  alt={currentCountry.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-indigo-900 flex items-center justify-center text-xs font-mono">
                  Flag Mockup
                </div>
              )}
            </div>
            
            <span className="absolute top-3 right-3 text-[10px] bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded-full font-mono text-slate-400">
              Interactive Preview
            </span>
          </div>

          {/* Featured info details */}
          <div className="p-6 md:p-8 relative z-20 space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-indigo-400 font-mono text-xs uppercase tracking-widest flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  {currentCountry.region} • {currentCountry.subregion}
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-1 tracking-tight">
                  {currentCountry.name}
                </h2>
                <p className="text-slate-400 text-xs mt-2 max-w-md italic">
                  Oliy darajadagi API ma'lumotlari. Ushbu davlat Next.js 15 App router dinamik /country/[cca3] sahifangizda qanday chiroyli tahlil qilinishini tasvirlaydi.
                </p>
              </div>
              
              <button 
                onClick={() => toggleChecklist("detailsPage")}
                className={`p-3 rounded-full border transition-all ${
                  checklist.detailsPage 
                    ? "bg-pink-500/10 border-pink-500/30 text-pink-500" 
                    : "bg-slate-800 border-slate-705 text-slate-400 hover:text-white"
                }`}
                title="Syllabus detail-page checklist toggler"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div className="flex flex-col">
                <span className="text-slate-550 text-[10px] uppercase font-bold tracking-wider font-mono">Capital</span>
                <span className="text-sm md:text-base font-semibold text-white mt-0.5">{currentCountry.capital}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-550 text-[10px] uppercase font-bold tracking-wider font-mono">Population</span>
                <span className="text-sm md:text-base font-semibold text-indigo-300 mt-0.5">{currentCountry.population}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-550 text-[10px] uppercase font-bold tracking-wider font-mono">Currency</span>
                <span className="text-sm md:text-base font-semibold text-emerald-400 mt-0.5 truncate" title={currentCountry.currencies}>
                  {currentCountry.currencies}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BENTO CARD 2: Mentor Controls & Tabs switching (5 Cols span) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-500 rounded-full inline-block" />
                LOYIHA BO'LIMLARI
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Mavzular bo'yicha yo'riqnoma</span>
            </div>

            {/* Dark Styled tab buttons */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-850">
              {(["architecture", "api-explorer", "guidelines", "checklist"] as const).map((tab) => {
                const label = 
                  tab === "architecture" ? "Tuzilma (Files)" :
                  tab === "api-explorer" ? "API Sandbox" :
                  tab === "guidelines" ? "Qoidalar" : "Checklist";
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-3 text-xs font-medium rounded-xl transition-all ${
                      active 
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10 font-semibold" 
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Tab Panel Contents */}
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4 min-h-[220px] max-h-[300px] overflow-y-auto">
              {/* Architecture Content */}
              {activeTab === "architecture" && (
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">Fayllarni bosib tahlil qiling:</span>
                  <div className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-900 max-h-[200px] overflow-y-auto">
                    {renderTree(fileTree)}
                  </div>
                </div>
              )}

              {/* API Sandbox Mini Form */}
              {activeTab === "api-explorer" && (
                <div className="space-y-3 text-xs">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="bg-slate-900 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                      value={apiEndpoint}
                      onChange={(e) => setApiEndpoint(e.target.value)}
                    />
                    <button 
                      onClick={() => fetchAPI(apiEndpoint)}
                      disabled={apiLoading}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3.5 py-1.5 rounded-xl flex items-center gap-1 shrink-0"
                    >
                      {apiLoading ? "..." : <Play className="w-3 h-3 fill-current" />}
                    </button>
                  </div>
                  <div className="flex gap-1 overflow-x-auto pb-1 text-[10px] font-mono">
                    <button 
                      onClick={() => setApiEndpoint("https://restcountries.com/v3.1/all?fields=name,cca3,flags,population,region,capital")}
                      className="bg-slate-900 text-slate-300 py-1 px-2 rounded-md hover:bg-slate-850 whitespace-nowrap"
                    >
                      GET /all
                    </button>
                    <button 
                      onClick={() => setApiEndpoint("https://restcountries.com/v3.1/name/uzbekistan")}
                      className="bg-slate-900 text-slate-300 py-1 px-2 rounded-md hover:bg-slate-850 whitespace-nowrap"
                    >
                      GET /uzbekistan
                    </button>
                    <button 
                      onClick={() => setApiEndpoint("https://restcountries.com/v3.1/alpha/uzb")}
                      className="bg-slate-900 text-slate-300 py-1 px-2 rounded-md hover:bg-slate-850 whitespace-nowrap"
                    >
                      GET /uzb
                    </button>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 font-mono text-[10px] text-emerald-400 overflow-y-auto max-h-[120px]">
                    {apiLoading && <span className="text-slate-400 animate-pulse">Yuklanmoqda...</span>}
                    {apiError && <span className="text-red-400">{apiError}</span>}
                    {!apiLoading && !apiError && !apiResult && <span className="text-slate-500">Natija olish uchun so'rov yuboring.</span>}
                    {apiResult && <span>Ok! {apiResult.length ? `${apiResult.length} ta hamjamiyat topildi.` : "Format muvaffaqiyatli."}</span>}
                  </div>
                </div>
              )}

              {/* Guidelines tab summary */}
              {activeTab === "guidelines" && (
                <div className="space-y-3.5">
                  <div className="border-l-2 border-indigo-500 pl-3.5 space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase font-mono">Next.js 15 Muhiti</h4>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                      Next.js 15 App router-da default komponentlar Server Component bo'ladi. client-side hooklar kerak bo'lganda <code>"use client"</code> ishlating.
                    </p>
                  </div>
                  <div className="border-l-2 border-amber-500 pl-3.5 space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase font-mono">localStorage Hydration</h4>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                      localStorage ishlatsangiz, Hydration xavfsizligiga amal qiling. Component faqat mount bo'lgach (`useEffect`) uni tekshiring.
                    </p>
                  </div>
                </div>
              )}

              {/* Checklist Progress Overview in Sidebar */}
              {activeTab === "checklist" && (
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-[10px] text-slate-500 uppercase block font-mono">Bajarish bosqichlari:</span>
                  <div className="grid grid-cols-1 gap-1.5 max-h-[170px] overflow-y-auto">
                    {Object.keys(checklist).map((key) => {
                      const isChecked = checklist[key as keyof typeof checklist];
                      return (
                        <div 
                          key={key} 
                          onClick={() => toggleChecklist(key as keyof typeof checklist)}
                          className="flex items-center gap-2 p-1.5 bg-slate-900/60 border border-slate-850 rounded-lg hover:border-slate-700 cursor-pointer text-[11px]"
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${isChecked ? "bg-emerald-400 shadow-sm" : "bg-slate-700"}`} />
                          <span className="text-slate-300 truncate font-mono">{key}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick interactive quote or mentor suggestion */}
          <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-dashed border-slate-800 text-[11px] text-slate-450 italic flex items-center gap-2">
            <span className="text-indigo-400 font-mono font-bold leading-none shrink-0">MENTOR:</span>
            <span>"Tizim tayyor bo'lgach, har doim har bir statni chiroyli va mustahkam TypeScript tiplari bilan tekshirib chiqing."</span>
          </div>
        </div>

      </div>

      {/* Bento Grid Row 2: Selected Files info, Neighbors, Quick actions */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-5 mt-5">
        
        {/* Selected file information display details (Beto style) */}
        <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              Tuzilma Tafsilotlari
            </h4>
            
            {selectedFile ? (
              <div className="space-y-3 mt-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700/80">
                    {selectedFile.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">{selectedFile.type}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{selectedFile.description}</p>
                
                {selectedFile.suggestedImports && selectedFile.suggestedImports.length > 0 && (
                  <div className="bg-slate-950 text-indigo-300 p-2 rounded border border-slate-850 text-[10px] font-mono overflow-x-auto relative">
                    <span className="text-[9px] text-slate-500 block mb-1 font-sans">Ideal import:</span>
                    {selectedFile.suggestedImports[0]}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 leading-relaxed mt-4 italic">
                Splayda hech qanday fayl tanlanmagan. Chap tarafdagi 'Loyiha Tuzilmasi' qismidan bironta fayl bosing.
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-850 mt-4 flex items-center justify-between text-[10px] text-slate-500">
            <span>Tanlangan ob'ekt</span>
            <span>TypeScript Ready</span>
          </div>
        </div>

        {/* Neighbors/Borders dynamic bento layout */}
        <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Chegaradosh qo'shni davlatlar (Borders)
              </h4>
              <span className="text-[10px] bg-slate-800 text-indigo-400 font-bold px-1.5 rounded">
                {currentCountry.borders.length} ta
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
              Dinamik yo'nalish uchun foydalaniladigan cca3 chegaradosh qo'shnilar ro'yxati:
            </p>

            <div className="flex flex-wrap gap-1.5 max-h-[90px] overflow-y-auto">
              {currentCountry.borders.map((border) => (
                <button 
                  key={border}
                  onClick={() => {
                    const nextEndpoint = `https://restcountries.com/v3.1/alpha/${border.toLowerCase()}`;
                    setApiEndpoint(nextEndpoint);
                    fetchAPI(nextEndpoint);
                  }}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-indigo-900/60 transition-colors text-slate-200 rounded-lg text-xs font-mono font-bold border border-slate-800"
                >
                  {border}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[9px] text-slate-500 mt-3 italic font-sans">
            Tugmani bosish orqali qo'shni davlat ma'lumotiga API orqali ssenariy yaratish.
          </p>
        </div>

        {/* Favorite progress bento action card */}
        <div className="md:col-span-4 bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-white">Loyiha Tayyorlik Reytingi</h4>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Checklist orqali belgilangan vazifalardan kelib chiqqan holda dasturni yakuniy baholash.
            </p>

            {/* Simulated progress slider bar */}
            <div className="mt-4 flex items-center gap-2">
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ 
                    width: `${(Object.values(checklist).filter(v => v).length / Object.values(checklist).length) * 100}%` 
                  }}
                />
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold shrink-0">
                {Math.floor((Object.values(checklist).filter(v => v).length / Object.values(checklist).length) * 100)}%
              </span>
            </div>
          </div>

          <div className="text-[10px] text-indigo-400 mt-4 font-mono font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
            Zustand / Redux tavsiya etilmaydi!
          </div>
        </div>

      </div>

      {/* Dynamic API sandbox detailed response (Full screen view if result fetched) */}
      <AnimatePresence>
        {apiResult && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="max-w-7xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 mt-5 shadow-xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-300">
                  PI Sandbox To'liq JSON response:
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleCopy(JSON.stringify(apiResult, null, 2), "main-res")}
                  className="bg-slate-950 hover:bg-slate-800 text-[10px] font-mono text-slate-300 px-3 py-1 rounded-xl transition-all border border-slate-800"
                >
                  {copiedText === "main-res" ? "Nusxalanadi!" : "Nusxa olish"}
                </button>
                <button 
                  onClick={() => setApiResult(null)}
                  className="text-slate-500 hover:text-slate-300 text-xs font-bold px-2"
                >
                  Yopish [x]
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 max-h-[300px] overflow-y-auto">
              <pre className="text-[11px] leading-relaxed font-mono text-indigo-300 whitespace-pre-wrap">
                {JSON.stringify(apiResult, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styled Footer */}
      <footer className="max-w-7xl mx-auto w-full border-t border-slate-900 mt-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-550">
        <div>
          Next.js 15 • Tailwind CSS • App Router Architecture • TypeScript Strict
        </div>
        <div className="font-semibold px-4 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-full font-mono text-[11px]">
          MENTOR: "Har doim Next.js built-in imkoniyatlaridan foydalan!"
        </div>
      </footer>

    </div>
  );
}
