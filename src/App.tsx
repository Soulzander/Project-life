import { Bell, Search, LayoutDashboard, Calendar, Settings, Activity, Target, Zap, Clock, MoreHorizontal, CheckSquare, Box, User, ChevronLeft, ChevronRight, Download, Camera, Trash2, Plus, LayoutGrid, TrendingUp, Heart, Brain, Dumbbell, HeartPulse, Check, Upload, Quote, ChevronUp, ChevronDown } from 'lucide-react';
import JSZip from 'jszip';
import { motion, AnimatePresence } from 'motion/react';
import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import quotesData from './quotes.json';

// Use placeholder images for defaults in case local images are not found
const fallbackMobileImg = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800&q=80";
const fallbackTabletImg = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80";
const fallbackLaptopImg = "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80";

const projectImages = [
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
  "https://images.unsplash.com/photo-1531297122539-df3f530d961c?w=800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80"
];

// Use high-quality cyberpunk/tech Unsplash images to guarantee they load
const avatarImages = [
  "/Profile/Joker.jpg", // The Joker
  "/Profile/Lion.JPG", // The Lion
  "https://image.pollinations.ai/prompt/Cinematic_digital_illustration_High_contrast_cel_shading_mechanical_ronin_warrior_with_pointed_feline_hood_single_glowing_green_circular_sensor_white_cloak_luminescent_cyan_floral_patterns_dark_hakama_glowing_cyan_accents_heavy_mechanical_greaves_Oversized_mechanical_heavy_blade_amber_orange_energy_edge_Minimalist_white_to_blue_gradient_background_floating_clockwork_gears_cybernetic_futurism_traditional_Japanese_aesthetics?width=600&height=600&nologo=true", // Cyber Ronin 1
  "https://image.pollinations.ai/prompt/Close_up_action_shot_Cinematic_digital_illustration_High_contrast_cel_shading_mechanical_ronin_warrior_pointed_feline_hood_glowing_green_sensor_white_cloak_cyan_floral_patterns_swinging_Oversized_mechanical_heavy_blade_glowing_amber_orange_energy_edge_white_to_blue_gradient_background_gears_cybernetic_futurism?width=600&height=600&nologo=true", // Cyber Ronin Action 2
];

const RadarGridRing: React.FC<{ value: number, colorClass: string, strokeWidth?: number }> = ({ value, colorClass, strokeWidth = 1 }) => {
  const maxRadius = 85;
  const r = (value / 10) * maxRadius;
  const cx = 100;
  const cy = 100;
  
  // 4 points (top, right, bottom, left)
  const points = [
    `${cx},${cy - r}`, 
    `${cx + r},${cy}`, 
    `${cx},${cy + r}`, 
    `${cx - r},${cy}`,
  ].join(" ");
  
  return (
    <polygon
      points={points}
      fill="none"
      strokeWidth={strokeWidth}
      className={colorClass}
    />
  );
};

const LifeRadar = ({ lifeProtocol }: { lifeProtocol: { sleep: boolean, meditation: boolean, sunlight: boolean, walk: boolean } }) => {
  const cx = 100;
  const cy = 100;
  const maxRadius = 85;
  
  // Base 5, completing the task adds 1 piece (to 6 out of 10)
  const getValue = (active: boolean) => active ? 6 : 5;
  
  const dataPoints = [
    { value: getValue(lifeProtocol.sleep), angle: -Math.PI / 2, label: 'HP' },
    { value: getValue(lifeProtocol.meditation), angle: 0, label: 'Focus' },
    { value: getValue(lifeProtocol.sunlight), angle: Math.PI / 2, label: 'Mental' },
    { value: getValue(lifeProtocol.walk), angle: Math.PI, label: 'Physical' },
  ];
  
  const polygonPoints = dataPoints.map(p => {
    const r = (p.value / 10) * maxRadius;
    return `${cx + r * Math.cos(p.angle)},${cy + r * Math.sin(p.angle)}`;
  }).join(" ");

  return (
    <div className="relative w-full aspect-square flex items-center justify-center p-4 min-h-[220px]">
      <svg viewBox="0 0 200 200" className="w-full h-full max-w-[240px] overflow-visible">
        <defs>
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Grid Rings (1 through 10) */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
          <RadarGridRing 
            key={level} 
            value={level} 
            colorClass={level === 5 || level === 10 ? "stroke-white/30" : "stroke-white/10"} 
            strokeWidth={1} 
          />
        ))}

        {/* Radar Axes */}
        {[ -Math.PI/2, 0, Math.PI/2, Math.PI ].map((a, i) => (
          <line key={i} x1={cx} y1={cy} x2={cx + maxRadius*Math.cos(a)} y2={cy + maxRadius*Math.sin(a)} stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="2 2" />
        ))}

        {/* Dynamic Data Polygon */}
        <polygon 
          points={polygonPoints} 
          fill="rgba(255, 106, 0, 0.4)" 
          stroke="#ff6a00" 
          strokeWidth={2} 
          filter="url(#neon-glow)"
          style={{ transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />

        {/* Data Vertices */}
        {dataPoints.map((p, i) => {
          const r = (p.value / 10) * maxRadius;
          return (
            <circle 
              key={i} 
              cx={cx + r * Math.cos(p.angle)} 
              cy={cy + r * Math.sin(p.angle)} 
              r={3} 
              fill="#fff"
              stroke="#ff6a00"
              strokeWidth={1.5}
              style={{ transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
          );
        })}

        {/* Labels */}
        {dataPoints.map((p, i) => {
          const labelDist = maxRadius + 15;
          let lx = cx + labelDist * Math.cos(p.angle);
          let ly = cy + labelDist * Math.sin(p.angle);
          
          let textAnchor = "middle";
          if (Math.abs(Math.cos(p.angle)) > 0.1) {
            textAnchor = Math.cos(p.angle) > 0 ? "start" : "end";
          }
          
          let dy = 3;
          if (Math.sin(p.angle) > 0.5) dy = 8;
          else if (Math.sin(p.angle) < -0.5) dy = -2;

          return (
            <text 
              key={`label-${i}`} 
              x={lx} 
              y={ly + dy} 
              fill="rgba(255,255,255,0.8)" 
              fontSize="9" 
              textAnchor={textAnchor} 
              fontWeight="bold" 
              className="tracking-widest uppercase"
            >
              {p.label}
            </text>
          );
        })}

        {/* Center Node */}
        <circle cx={cx} cy={cy} r={2} fill="white" className="opacity-50" />
      </svg>
    </div>
  );
};

const QuoteOfTheDay = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const updateQuote = () => {
      const msPerDay = 1000 * 60 * 60 * 24;
      const now = new Date();
      // Use local date effectively starting at midnight
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      // Fixed epoch to calculate predictable day differences
      const epoch = new Date(2024, 0, 1);
      const diffTime = today.getTime() - epoch.getTime();
      const diffDays = Math.floor(diffTime / msPerDay);
      
      const index = Math.abs(diffDays) % quotesData.length;
      setQuote((quotesData[index] as any)?.Quote || "Keep pushing forward.");
    };

    updateQuote();
    
    // Setup interval to potentially refresh the quote if crossing midnight while tab is open
    // Check every minute if the date changed
    let lastDay = new Date().getDate();
    const interval = setInterval(() => {
      const currentDay = new Date().getDate();
      if (currentDay !== lastDay) {
        lastDay = currentDay;
        updateQuote();
      }
    }, 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!quote) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 md:p-6 relative overflow-hidden group shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-orange-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-orange-600" />
      
      <div className="relative flex items-start gap-4">
        <div className="bg-orange-500/20 border border-orange-500/30 p-2 rounded-xl mt-1 shadow-[0_0_15px_rgba(249,115,22,0.2)] flex-shrink-0">
          <Quote size={20} className="text-orange-500 fill-orange-500/20" />
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-bold text-orange-500/80 uppercase tracking-widest mb-1.5 flex items-center gap-2">
            Quote of the Day
            <span className="w-8 h-[1px] bg-orange-500/30 inline-block"></span>
          </h3>
          <p className="text-base md:text-lg text-orange-50 indent-0 leading-relaxed font-serif italic drop-shadow-sm">
            "{quote}"
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const HeptaRadar = ({ data, color = "#ff6a00", strokeColor = "#ff8833" }: { data: { day: string; value: number }[], color?: string, strokeColor?: string }) => {
  const size = 500;
  const center = size / 2;
  const maxRadius = (size / 2) * 0.82; // More space usage

  const getCoordinatesForAngle = (angle: number, radius: number) => {
    return {
      x: center + radius * Math.cos(angle - Math.PI / 2),
      y: center + radius * Math.sin(angle - Math.PI / 2)
    };
  };

  const getAngle = (index: number) => (index * 2 * Math.PI) / 7;
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative z-10 select-none font-sans">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="max-w-[100%] max-h-[100%] overflow-visible">
        {/* Background Grid */}
        {gridLevels.reverse().map((level) => {
          const points = Array.from({ length: 7 }).map((_, j) => {
            const { x, y } = getCoordinatesForAngle(getAngle(j), maxRadius * level);
            return `${x},${y}`;
          }).join(' ');
          
          return (
            <polygon 
              key={`grid-${level}`}
              points={points}
              fill={level % 0.4 === 0 ? "rgba(255,255,255,0.02)" : "none"}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1}
            />
          );
        })}

        {/* Axes */}
        {Array.from({ length: 7 }).map((_, j) => {
          const { x, y } = getCoordinatesForAngle(getAngle(j), maxRadius);
          return (
            <line 
              key={`axis-${j}`}
              x1={center} y1={center} x2={x} y2={y}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          );
        })}

        {/* Filled Data Sectors */}
        {data.map((d, i) => {
          const valuePct = Math.min(Math.max(d.value, 1), 100) / 100; // ensures sliver is visible
          const r = maxRadius * valuePct;
          const a1 = getAngle(i);
          const a2 = getAngle(i + 1);
          
          const p1 = getCoordinatesForAngle(a1, r);
          const p2 = getCoordinatesForAngle(a2, r);

          return (
             <g key={`sector-${i}`} className="group relative">
               <path 
                 d={`M ${center} ${center} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} Z`}
                 fill={color}
                 fillOpacity={0.4}
                 stroke={strokeColor}
                 strokeWidth={1.5}
                 strokeLinejoin="round"
                 className="transition-all duration-300 group-hover:fill-opacity-70 group-hover:stroke-[2px]"
               />
               <path 
                 d={`M ${center} ${center} L ${getCoordinatesForAngle(a1, maxRadius).x} ${getCoordinatesForAngle(a1, maxRadius).y} L ${getCoordinatesForAngle(a2, maxRadius).x} ${getCoordinatesForAngle(a2, maxRadius).y} Z`}
                 fill="transparent"
                 className="cursor-crosshair"
               >
                 <title>{`${d.day}: ${Math.round(d.value)}% completed`}</title>
               </path>
             </g>
          );
        })}

        {/* Labels for percentage block fill */}
        {data.map((d, i) => {
           const valuePct = Math.min(Math.max(d.value, 0), 100) / 100;
           if (valuePct === 0) return null;

           const rDecal = (maxRadius * valuePct) - 15; 
           const displayR = rDecal < 15 ? 15 : rDecal; 
           
           const midAngle = (getAngle(i) + getAngle(i + 1)) / 2;
           const { x, y } = getCoordinatesForAngle(midAngle, displayR);
           
           return (
             <text 
               key={`pct-${i}`}
               x={x} y={y} 
               fill="#ffffff" 
               fontSize={10} 
               fontWeight={700}
               textAnchor="middle" 
               alignmentBaseline="middle"
               className="pointer-events-none opacity-50"
             >
               {Math.round(d.value)}%
             </text>
           )
        })}

        {/* Outer label texts for Days */}
        {data.map((d, i) => {
          const midAngle = (getAngle(i) + getAngle(i + 1)) / 2;
          const { x, y } = getCoordinatesForAngle(midAngle, maxRadius + 30);
          return (
            <text 
              key={`label-${i}`}
              x={x} y={y} 
              fill={i === 6 ? "#ff6a00" : "rgba(255,255,255,0.6)"} 
              fontSize={15} 
              fontWeight={i === 6 ? 800 : 600} 
              letterSpacing={1}
              textAnchor="middle" 
              alignmentBaseline="middle"
              className="pointer-events-none drop-shadow-sm"
            >
              {d.day}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const playCyberSound = (type: 'hover' | 'click' | 'success' | 'transition' | 'boot') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gainNode.gain.setValueAtTime(0.02, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'click') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'transition') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.connect(gainNode);
      osc2.frequency.setValueAtTime(800, now + 0.1);
      
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.setValueAtTime(0.05, now + 0.09);
      gainNode.gain.setValueAtTime(0, now + 0.095);
      gainNode.gain.setValueAtTime(0.05, now + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
      
      osc.start(now);
      osc.stop(now + 0.095);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.3);
    } else if (type === 'boot') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(50, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 1.0);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.05, now + 0.5);
      gainNode.gain.linearRampToValueAtTime(0, now + 1.0);
      osc.start(now);
      osc.stop(now + 1.0);
    }
  } catch (e) {
    console.error("Audio block:", e);
  }
};

const PreviewSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      id: "tasks",
      title: "Task Management",
      icon: <CheckSquare size={14} className="text-primary" />,
      content: (
        <div className="flex flex-col gap-2">
          <div className="h-2 w-1/3 bg-white/20 rounded mb-2"></div>
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
            <div className="w-3 h-3 rounded-full border border-primary"></div>
            <div className="h-2 w-full bg-white/20 rounded"></div>
          </div>
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0"></div>
            <div className="h-2 w-3/4 bg-white/40 rounded"></div>
          </div>
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
            <div className="w-3 h-3 rounded-full border border-white/50"></div>
            <div className="h-2 w-5/6 bg-white/20 rounded"></div>
          </div>
        </div>
      )
    },
    {
      id: "analysis",
      title: "Deep Analysis",
      icon: <Activity size={14} className="text-blue-400" />,
      content: (
        <div className="flex flex-col gap-2 h-full justify-end pb-2">
          <div className="flex justify-between items-end h-16 gap-1 px-4">
             <div className="w-1/6 bg-blue-500/50 h-1/2 rounded-t-sm"></div>
             <div className="w-1/6 bg-blue-500/80 h-3/4 rounded-t-sm"></div>
             <div className="w-1/6 bg-blue-400 h-full rounded-t-sm"></div>
             <div className="w-1/6 bg-blue-500/60 h-2/3 rounded-t-sm"></div>
             <div className="w-1/6 bg-blue-500/40 h-1/3 rounded-t-sm"></div>
          </div>
        </div>
      )
    },
    {
      id: "accounts",
      title: "Operative Account",
      icon: <User size={14} className="text-green-400" />,
      content: (
        <div className="flex flex-col gap-3 items-center pt-2">
          <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-green-400"></div>
          <div className="h-2 w-1/2 bg-white/40 rounded"></div>
          <div className="h-1.5 w-1/3 bg-white/20 rounded"></div>
          <div className="w-full flex gap-2 mt-2">
            <div className="h-6 flex-1 bg-white/10 rounded-md"></div>
            <div className="h-6 flex-1 bg-white/10 rounded-md"></div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full h-40 bg-black/50 border border-white/5 rounded-xl flex flex-col relative overflow-hidden mb-6">
      <AnimatePresence mode="wait">
        <motion.div
           key={activeSlide}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           transition={{ duration: 0.3 }}
           className="w-full h-full p-4 flex flex-col absolute"
        >
           <div className="flex items-center gap-2 mb-4">
             {slides[activeSlide].icon}
             <span className="text-xs font-bold text-white">{slides[activeSlide].title}</span>
           </div>
           <div className="flex-1 overflow-hidden">
             {slides[activeSlide].content}
           </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-2 left-0 w-full flex justify-center gap-1.5 z-10">
        {slides.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeSlide ? 'w-4 bg-primary' : 'w-1.5 bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
};

const OnboardingScreen = ({ operativeName, setOperativeName, customAvatar, setCustomAvatar, avatarImages, handleImageUpload, notifications, setNotifications, onFinish }: any) => {
  const [step, setStep] = useState<'welcome' | 'alias' | 'avatar' | 'notifications' | 'protocolInfo' | 'preview' | 'entering'>('welcome');
  const [displayedText, setDisplayedText] = useState('');
  const fullText = "WELCOME";

  useEffect(() => {
    if (step === 'welcome') {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(fullText.substring(0, i + 1));
        i++;
        if (i >= fullText.length) {
          clearInterval(interval);
          setTimeout(() => {
            setStep('alias');
          }, 1000);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div className="min-h-screen text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden bg-black">
      <div className="max-w-xl w-full z-10 flex flex-col items-center justify-center min-h-[400px] relative">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="text-center absolute w-full"
            >
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight min-h-[60px] flex items-center justify-center">
                {displayedText}
                <span className="w-1 h-[40px] sm:h-[50px] bg-primary ml-1 animate-[pulse_1s_infinite]"></span>
              </h1>
              <p className="text-muted-foreground text-sm uppercase tracking-widest min-h-[20px] transition-opacity duration-1000" style={{ opacity: displayedText.length === fullText.length ? 1 : 0 }}>
                Initialization Sequence
              </p>
            </motion.div>
          )}

          {step === 'alias' && (
            <motion.div 
              key="alias"
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
              className="w-full card p-6 border border-border/50 shadow-sm flex flex-col bg-[#111111]/80 backdrop-blur-md rounded-2xl absolute"
            >
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                 <User size={18} className="text-primary" />
                 Enter Alias
               </h3>
               <input 
                 type="text" 
                 value={operativeName}
                 onChange={(e) => setOperativeName(e.target.value)}
                 placeholder="GHOST-01"
                 className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
               />
               <button 
                 onMouseEnter={() => playCyberSound('hover')}
                 onClick={() => {
                   playCyberSound('click');
                   setTimeout(() => setStep('avatar'), 100);
                 }}
                 className="mt-6 flex justify-center items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-lg font-bold text-white transition-all cursor-pointer w-full transform hover:-translate-y-1"
               >
                 INITIALIZE <ChevronRight size={20} />
               </button>
            </motion.div>
          )}

          {step === 'avatar' && (
            <motion.div 
              key="avatar"
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
              className="w-full card p-6 border border-border/50 shadow-sm flex flex-col bg-[#111111]/80 backdrop-blur-md rounded-2xl absolute"
            >
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                 <Camera size={18} className="text-primary" />
                 Select Visual Identifier
               </h3>
               <div className="flex overflow-x-auto gap-3 pb-4 snap-x scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                   {avatarImages.map((img: string, idx: number) => (
                     <img
                       key={idx}
                       src={img}
                       alt={`Avatar ${idx}`}
                       className={`w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl cursor-pointer snap-center border-2 transition-all hover:scale-105 flex-shrink-0 ${customAvatar === img ? 'border-primary ring-2 ring-primary/30 opacity-100' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                       onClick={() => setCustomAvatar(img)}
                       onError={(e) => { e.currentTarget.style.display = 'none'; }}
                     />
                   ))}
               </div>
               
               <div className="mt-4">
                 <div className="flex items-center gap-4 w-full my-4">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex-shrink-0">OR CUSTOM UPLOAD</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                 </div>
                 <input 
                   type="file" 
                   accept="image/*" 
                   className="hidden" 
                   id="onboard-upload"
                   onChange={handleImageUpload} 
                 />
                 <label 
                   htmlFor="onboard-upload"
                   className="flex justify-center items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-all cursor-pointer w-full"
                 >
                   <Camera size={16} />
                   Upload Identity Matrix
                 </label>
               </div>

               <button 
                  onMouseEnter={() => playCyberSound('hover')}
                  onClick={() => {
                    playCyberSound('transition');
                    setTimeout(() => setStep('notifications'), 100);
                  }}
                  className="mt-6 flex justify-center items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-lg font-bold text-white transition-all cursor-pointer w-full transform hover:-translate-y-1"
               >
                  NEXT <ChevronRight size={20} />
               </button>
            </motion.div>
          )}

          {step === 'notifications' && (
            <motion.div 
              key="notifications"
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
              className="w-full card p-6 border border-border/50 shadow-sm flex flex-col bg-[#111111]/80 backdrop-blur-md rounded-2xl absolute"
            >
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                 <Bell size={18} className="text-primary" />
                 System Notifications
               </h3>
               <p className="text-muted-foreground text-sm mb-6">
                 Allow the system to send you alerts for critical updates, schedule reminders, and performance analyses.
               </p>
               
               <div className="flex flex-col gap-3">
                 <button 
                    onMouseEnter={() => playCyberSound('hover')}
                    onClick={() => {
                      playCyberSound('success');
                      setNotifications(true);
                      setTimeout(() => setStep('protocolInfo'), 100);
                    }}
                    className="flex justify-center items-center gap-2 px-6 py-4 bg-primary hover:bg-primary/90 rounded-2xl text-md font-bold text-black transition-all cursor-pointer w-full transform hover:-translate-y-1 shadow-xl shadow-primary/20"
                 >
                    ALLOW NOTIFICATIONS <Check size={18} />
                 </button>
                 <button 
                    onMouseEnter={() => playCyberSound('hover')}
                    onClick={() => {
                      playCyberSound('transition');
                      setNotifications(false);
                      setTimeout(() => setStep('protocolInfo'), 100);
                    }}
                    className="flex justify-center items-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold text-white transition-all cursor-pointer w-full"
                 >
                    SKIP FOR NOW
                 </button>
               </div>
            </motion.div>
          )}

          {step === 'protocolInfo' && (
            <motion.div 
              key="protocolInfo"
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
              className="w-full card p-6 border border-border/50 shadow-sm flex flex-col bg-[#111111]/80 backdrop-blur-md rounded-2xl absolute"
            >
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                 <HeartPulse size={18} className="text-primary" />
                 Life Protocol & Stats
               </h3>
               
               <p className="text-sm text-white mb-4 leading-relaxed">
                 <strong className="text-primary">Why is Life Protocol important?</strong><br/>
                 It establishes the non-negotiable biological baseline required for optimal human function. By securing essential daily inputs—restorative sleep, cognitive stillness, physical movement, and natural light—you proactively fortify your immune system, regulate your circadian rhythm, and prevent chronic physiological degradation.
               </p>

               <p className="text-sm text-white mb-6 leading-relaxed">
                 <strong className="text-blue-400">Why are Life Stats good indicators?</strong><br/>
                 They directly translate your core daily habits (like sleep and sunlight) into visible performance metrics (HP, Focus, Stamina, Vibe), helping you track if you're truly optimizing your baseline capabilities for a better life.
               </p>

               <button 
                  onMouseEnter={() => playCyberSound('hover')}
                  onClick={() => {
                    playCyberSound('transition');
                    setTimeout(() => setStep('preview'), 100);
                  }}
                  className="mt-2 flex justify-center items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-lg font-bold text-white transition-all cursor-pointer w-full transform hover:-translate-y-1"
               >
                  NEXT <ChevronRight size={20} />
               </button>
            </motion.div>
          )}

         {step === 'preview' && (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
              className="w-full card p-6 border border-border/50 shadow-sm flex flex-col bg-[#111111]/80 backdrop-blur-md rounded-2xl absolute"
            >
                <div className="mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-white mb-2">
                    <LayoutGrid size={18} className="text-primary" />
                    System Overview
                  </h3>
                  <p className="text-xs text-muted-foreground">Previewing core modules before final initialization.</p>
                </div>
                
                <PreviewSlider />

               <button 
                  onMouseEnter={() => playCyberSound('hover')}
                  onClick={() => {
                    playCyberSound('boot');
                    setStep('entering');
                    setTimeout(() => {
                      onFinish();
                    }, 1000);
                  }}
                  className="mt-2 flex justify-center items-center gap-2 px-6 py-4 bg-primary hover:bg-primary/90 rounded-2xl text-lg font-bold text-black transition-all cursor-pointer w-full transform hover:-translate-y-1 shadow-xl shadow-primary/20"
               >
                  ENTER SYSTEM <ChevronRight size={20} />
               </button>
            </motion.div>
          )}

          {step === 'entering' && (
            <motion.div 
              key="entering"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center absolute w-full flex flex-col items-center justify-center gap-4"
            >
              <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              <h2 className="text-xl font-bold text-white tracking-widest uppercase animate-pulse">Initializing</h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState("Tasks");

  // Onboarding State
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem('app_has_onboarded') === 'true';
  });

  // Custom Avatar State
  const [customAvatar, setCustomAvatar] = useState<string | null>(() => {
    return localStorage.getItem('app_custom_avatar') || null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Operative State
  const [operativeName, setOperativeName] = useState(() => {
    return localStorage.getItem('app_operative_name') || "";
  });
  const [notifications, setNotifications] = useState(true);
  const [appThemeColor, setAppThemeColor] = useState("#ff6a00");
  const [showQuoteBox, setShowQuoteBox] = useState(true);
  const dataImportRef = useRef<HTMLInputElement>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('app_has_onboarded', hasOnboarded.toString());
  }, [hasOnboarded]);

  useEffect(() => {
    if (customAvatar) {
      localStorage.setItem('app_custom_avatar', customAvatar);
    } else {
      localStorage.removeItem('app_custom_avatar');
    }
  }, [customAvatar]);

  useEffect(() => {
    if (operativeName) {
      localStorage.setItem('app_operative_name', operativeName);
    }
  }, [operativeName]);

  // Apply Theme Color
  useEffect(() => {
    document.documentElement.style.setProperty('--app-primary', appThemeColor);
  }, [appThemeColor]);

  // Set the default profile fallbacks using either uploaded images from Cyber or unsplash if not present
  const mobileAvatarImg = avatarImages.length > 0 ? avatarImages[0] : fallbackMobileImg;
  const tabletAvatarImg = avatarImages.length > 1 ? avatarImages[1] : fallbackTabletImg;
  const laptopAvatarImg = avatarImages.length > 2 ? avatarImages[2] : fallbackLaptopImg;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomAvatar(imageUrl);
    }
  };

  // Calendar State
  interface CalendarEvent {
    id: number;
    title: string;
    date: string; // ISO string or just YYYY-MM-DD
    protocolCode?: string;
  }
  const [currentDate, setCurrentDate] = useState(new Date());
  const [taskLogDate, setTaskLogDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [showTaskLog, setShowTaskLog] = useState(true);

  useEffect(() => {
    setIsMobileDevice(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isViewEventsModalOpen, setIsViewEventsModalOpen] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState<CalendarEvent | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventCode, setNewEventCode] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const deleteEvent = (id: number) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Daily Tasks State
  type TaskDifficulty = 'easy' | 'medium' | 'hard';
  interface DailyTask {
    id: number;
    title: string;
    difficulty: TaskDifficulty;
    done: boolean;
    time: string;
  }
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([
    { id: 1, title: "Initial System Check", difficulty: "easy", done: false, time: "08:00 AM" },
    { id: 2, title: "Data Migration", difficulty: "medium", done: false, time: "10:30 AM" },
    { id: 3, title: "Core Architecture", difficulty: "hard", done: false, time: "01:00 PM" }
  ]);
  const [taskHistory, setTaskHistory] = useState<Record<string, { intensity: number, percentage?: number }>>({});
  const [newDailyTaskTitle, setNewDailyTaskTitle] = useState("");
  const [newDailyTaskDiff, setNewDailyTaskDiff] = useState<TaskDifficulty>("medium");
  const [taskFilter, setTaskFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredDailyTasks = dailyTasks
    .filter(task => {
      if (taskFilter === 'active') return !task.done;
      if (taskFilter === 'completed') return task.done;
      return true;
    })
    .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));

  const toggleDailyTask = (id: number) => {
    setDailyTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };
  
  const addDailyTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDailyTaskTitle.trim()) return;
    const newTask: DailyTask = {
      id: Date.now(),
      title: newDailyTaskTitle,
      difficulty: newDailyTaskDiff,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      done: false
    };
    setDailyTasks(prev => [...prev, newTask]);
    setNewDailyTaskTitle("");
  };

  const deleteDailyTask = (id: number) => {
    setDailyTasks(prev => prev.filter(t => t.id !== id));
  };

  const getDifficultyColor = (diff: TaskDifficulty) => {
    switch(diff) {
      case 'easy': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'medium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'hard': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-primary border-primary/30 bg-primary/10';
    }
  };

  const calculateDailyPoints = () => {
    return dailyTasks.reduce((acc, task) => {
      if (!task.done) return acc;
      if (task.difficulty === 'easy') return acc + 1;
      if (task.difficulty === 'medium') return acc + 2;
      if (task.difficulty === 'hard') return acc + 3;
      return acc;
    }, 0);
  };

  const calculateTotalDailyPoints = () => {
    return dailyTasks.reduce((acc, task) => {
      if (task.difficulty === 'easy') return acc + 1;
      if (task.difficulty === 'medium') return acc + 2;
      if (task.difficulty === 'hard') return acc + 3;
      return acc;
    }, 0);
  };

  useEffect(() => {
    const total = calculateTotalDailyPoints();
    const current = calculateDailyPoints();
    let intensity = 0;
    if (total > 0 && current > 0) {
      intensity = Math.ceil((current / total) * 4); // 1 to 4
    }
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    const today = new Date();
    const todayStr = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
    setTaskHistory(prev => {
      if (prev[todayStr]?.intensity === intensity && prev[todayStr]?.percentage === percentage) return prev;
      return {
        ...prev,
        [todayStr]: { intensity, percentage }
      };
    });
  }, [dailyTasks]);

  // Weekly Must State & Lockdown Logic
  const [isWeekActive, setIsWeekActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weeklyMusts, setWeeklyMusts] = useState<{id: number, title: string, time: string, done: boolean}[]>([]);
  const [tempTasks, setTempTasks] = useState<{id: number, title: string, time: string, done: boolean}[]>([]);
  const [tempTaskTitle, setTempTaskTitle] = useState("");
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString());
  const [weekStartDate, setWeekStartDate] = useState<string | null>(null);

  // Analysis State
  const [analysisView, setAnalysisView] = useState<'graph' | 'block' | 'radar'>('radar');

  // Life Protocol State
  const [lifeProtocol, setLifeProtocol] = useState({
    sleep: false,
    meditation: false,
    sunlight: false,
    walk: false,
  });

  // Mega Projects State
  interface MegaProject {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    lead: string; // Theme: Prime Architect
    nodes: string; // Theme: Assisting Nodes
  }
  const [projects, setProjects] = useState<MegaProject[]>([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProject, setNewProject] = useState<Partial<MegaProject>>({});

  const addProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;
    const project: MegaProject = {
      id: Date.now(),
      name: newProject.name || "",
      description: newProject.description || "",
      startDate: newProject.startDate || "",
      endDate: newProject.endDate || "",
      lead: newProject.lead || "",
      nodes: newProject.nodes || ""
    };
    setProjects(prev => [...prev, project]);
    setNewProject({});
    setIsProjectModalOpen(false);
  };

  const deleteProject = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const exportData = async () => {
    const data = {
      operativeName,
      notifications,
      appThemeColor,
      customAvatar,
      dailyTasks,
      taskHistory,
      events,
      projects
    };
    const jsonStr = JSON.stringify(data, null, 2);
    
    const zip = new JSZip();
    zip.file('operative_data.json', jsonStr);
    const content = await zip.generateAsync({ type: 'blob' });
    
    // Download Blob
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup_archive.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const zip = new JSZip();
    zip.loadAsync(file).then(async (archive) => {
      const jsonFile = archive.file('operative_data.json');
      if (jsonFile) {
        const text = await jsonFile.async('string');
        try {
          const data = JSON.parse(text);
          if (data.operativeName !== undefined) setOperativeName(data.operativeName);
          if (data.notifications !== undefined) setNotifications(data.notifications);
          if (data.appThemeColor !== undefined) setAppThemeColor(data.appThemeColor);
          if (data.customAvatar !== undefined) setCustomAvatar(data.customAvatar);
          if (data.dailyTasks !== undefined) setDailyTasks(data.dailyTasks);
          if (data.taskHistory !== undefined) setTaskHistory(data.taskHistory);
          if (data.events !== undefined) setEvents(data.events);
          if (data.projects !== undefined) setProjects(data.projects);
        } catch (err) {
          console.error("Failed to parse archive data", err);
        }
      }
    }).catch(err => {
      console.error("Failed to read archive", err);
    });
    if (dataImportRef.current) dataImportRef.current.value = "";
  };

  const getStatPieces = (base: number, done: boolean) => done ? 10 : 1;

  const getBarColorClass = (filled: number) => {
    if (filled <= 3) return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
    if (filled >= 7) return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]';
    return 'bg-primary shadow-[0_0_8px_rgba(255,106,0,0.5)]';
  };

  const toggleMust = (id: number) => {
    if (!isWeekActive) return;
    setWeeklyMusts(prev => prev.map(m => m.id === id ? { ...m, done: !m.done } : m));
  };

  const addTempTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempTaskTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: tempTaskTitle,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      done: false
    };
    setTempTasks(prev => [...prev, newTask]);
    setTempTaskTitle("");
  };

  const commitWeek = () => {
    if (tempTasks.length === 0) return;
    setWeeklyMusts(tempTasks);
    setIsWeekActive(true);
    setWeekStartDate(new Date().toDateString());
    setIsModalOpen(false);
  };

  // Auto-reset logic for midnight and weekly rotation
  useEffect(() => {
    const interval = setInterval(() => {
      const todayStr = new Date().toDateString();
      
      // 1. Midnight Reset (Resets task 'done' status)
      if (todayStr !== lastResetDate) {
        setWeeklyMusts(prev => prev.map(m => ({ ...m, done: false })));
        setDailyTasks(prev => prev.map(m => ({ ...m, done: false })));
        setLifeProtocol({
          sleep: false,
          meditation: false,
          sunlight: false,
          walk: false,
        });
        setLastResetDate(todayStr);
      }

      // 2. 7-Day Expiry (Resets week lock)
      if (weekStartDate) {
        const start = new Date(weekStartDate).getTime();
        const now = new Date().getTime();
        const daysPassed = (now - start) / (1000 * 3600 * 24);
        if (daysPassed >= 7) {
          setIsWeekActive(false);
          setWeeklyMusts([]);
          setTempTasks([]);
          setWeekStartDate(null);
        }
      }
    }, 10000); // Check frequently to keep UI responsive

    return () => clearInterval(interval);
  }, [lastResetDate, weekStartDate]);

  const todayDailyPct = calculateTotalDailyPoints() === 0 ? 0 : Math.round((calculateDailyPoints() / calculateTotalDailyPoints()) * 100);
  const todayWeeklyPct = weeklyMusts.length === 0 ? 0 : Math.round((weeklyMusts.filter(m => m.done).length / weeklyMusts.length) * 100);

  // Generate 7-day historical data
  const generate7DayData = () => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }); 
      
      let dailyPct = 0;
      let weeklyPct = 0;
      
      if (i === 0) {
        dailyPct = todayDailyPct;
        weeklyPct = todayWeeklyPct;
      } else {
        const historyObj = taskHistory[dateStr];
        if (historyObj) {
          dailyPct = historyObj.percentage !== undefined ? historyObj.percentage : (historyObj.intensity * 25);
        }
      }

      data.push({
        day: i === 0 ? 'Today' : dayName,
        subject: dayName,
        A: dailyPct || 1, // for radar
        daily: dailyPct, // for bar chart
        weekly: weeklyPct
      });
    }
    return data;
  };

  const analysisData = generate7DayData();
  const dailyVectorData = analysisData.map(d => ({ day: d.day, value: d.daily }));
  const weeklyVectorData = analysisData.map(d => ({ day: d.day, value: d.weekly }));

  const avgDailyPct = Math.round(analysisData.reduce((acc, curr) => acc + curr.daily, 0) / analysisData.length) || 0;
  const avgWeeklyPct = Math.round(analysisData.reduce((acc, curr) => acc + curr.weekly, 0) / analysisData.length) || 0;

  if (!hasOnboarded) {
    return (
      <OnboardingScreen 
        operativeName={operativeName}
        setOperativeName={setOperativeName}
        customAvatar={customAvatar}
        setCustomAvatar={setCustomAvatar}
        avatarImages={avatarImages}
        handleImageUpload={handleImageUpload}
        notifications={notifications}
        setNotifications={setNotifications}
        onFinish={() => {
          if (!operativeName.trim()) setOperativeName("ALPHA-GUEST");
          if (!customAvatar && avatarImages.length > 0) setCustomAvatar(avatarImages[0]);
          setHasOnboarded(true);
        }}
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="min-h-screen text-foreground flex w-full relative overflow-hidden bg-black"
    >

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen w-full relative z-10 pt-6">

        {/* Dashboard Content Container */}
        <div className="px-6 pb-6 max-w-[1400px] mx-auto w-full flex-1 flex flex-col gap-6">
          
          {showQuoteBox && <QuoteOfTheDay />}

          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Unified Profile & Focus Metrics */}
            <div className="group bg-[#050505] rounded-xl p-0 md:col-span-3 grid grid-cols-1 md:grid-cols-12 border border-white/10 shadow-sm relative overflow-hidden items-stretch">
              
              {/* Left Side: Avatar Image (Roughly 1/3) */}
              <div className="md:col-span-4 relative aspect-[3/4]">
                {customAvatar ? (
                  <img src={customAvatar} alt="Custom Profile" className="w-full h-full object-cover object-center" />
                ) : (
                  <picture>
                    <source media="(min-width: 1024px)" srcSet={laptopAvatarImg} />
                    <source media="(min-width: 768px)" srcSet={tabletAvatarImg} />
                    <img 
                      src={mobileAvatarImg} 
                      alt={operativeName} 
                      className="w-full h-full object-cover object-center" 
                      onError={(e) => {
                        e.currentTarget.src = fallbackMobileImg;
                      }}
                    />
                  </picture>
                )}
              </div>

              {/* Right Side: Content Area (Roughly 2/3) */}
              <div className="md:col-span-8 bg-[#0a0a0f] p-6 md:p-8 flex flex-col">
                {/* User Profile Content - Now on the right, next to image */}
                <div className="mb-8">
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-4 mb-2">
                       <h3 className="font-black text-4xl lg:text-5xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-primary/40 drop-shadow-md">{operativeName}</h3>
                       <div className="bg-primary/10 border border-primary/20 p-2 rounded-xl mt-1 shadow-[0_0_15px_rgba(255,106,0,0.2)]">
                         <Zap size={20} className="text-primary fill-primary/20" />
                       </div>
                    </div>
                  </div>
                  {/* Mobile version */}
                  <div className="sm:hidden">
                    <div className="flex items-center gap-3 mb-2">
                       <h3 className="font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-primary/40 drop-shadow-md">{operativeName}</h3>
                       <div className="bg-primary/10 border border-primary/20 p-1.5 rounded-lg mt-1 shadow-[0_0_10px_rgba(255,106,0,0.2)]">
                         <Zap size={16} className="text-primary fill-primary/20" />
                       </div>
                    </div>
                  </div>
                </div>

                {/* Daily Energy Section - Below the name */}
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-1 text-white flex-shrink-0">
                    <HeartPulse size={18} className="text-primary" />
                    <span className="font-bold text-lg">Life Stats</span>
                  </div>
                  <p className="text-muted-foreground text-xs mb-4">Connect to Life protocol</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* HP Stat */}
                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5 relative overflow-hidden group hover:bg-white/[0.02] hover:border-primary/30 transition-all duration-300">
                       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                          <Heart size={48} className="text-primary" />
                       </div>
                       <div className="flex items-center gap-2 mb-3 font-bold text-sm text-white relative z-10">
                         <Heart size={16} className="text-primary fill-primary/20" />
                         <span className="tracking-widest uppercase text-xs">HP</span>
                         <span className="ml-auto text-primary font-mono text-xs">{getStatPieces(5, lifeProtocol.sleep)}0%</span>
                       </div>
                       <div className="flex h-1.5 gap-1 w-full relative z-10">
                         {[...Array(10)].map((_, i) => (
                           <div key={i} className={`flex-1 rounded-full ${i < getStatPieces(5, lifeProtocol.sleep) ? getBarColorClass(getStatPieces(5, lifeProtocol.sleep)) : 'bg-white/10'}`} />
                         ))}
                       </div>
                    </div>

                    {/* Focus Stat */}
                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5 relative overflow-hidden group hover:bg-white/[0.02] hover:border-primary/30 transition-all duration-300">
                       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                          <Target size={48} className="text-primary" />
                       </div>
                       <div className="flex items-center gap-2 mb-3 font-bold text-sm text-white relative z-10">
                         <Target size={16} className="text-primary" />
                         <span className="tracking-widest uppercase text-xs">Focus</span>
                         <span className="ml-auto text-primary font-mono text-xs">{getStatPieces(5, lifeProtocol.meditation)}0%</span>
                       </div>
                       <div className="flex h-1.5 gap-1 w-full relative z-10">
                         {[...Array(10)].map((_, i) => (
                           <div key={i} className={`flex-1 rounded-full ${i < getStatPieces(5, lifeProtocol.meditation) ? getBarColorClass(getStatPieces(5, lifeProtocol.meditation)) : 'bg-white/10'}`} />
                         ))}
                       </div>
                    </div>

                    {/* Physical Stat */}
                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5 relative overflow-hidden group hover:bg-white/[0.02] hover:border-primary/30 transition-all duration-300">
                       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                          <Dumbbell size={48} className="text-primary" />
                       </div>
                       <div className="flex items-center gap-2 mb-3 font-bold text-sm text-white relative z-10">
                         <Dumbbell size={16} className="text-primary" />
                         <span className="tracking-widest uppercase text-xs">Physical</span>
                         <span className="ml-auto text-primary font-mono text-xs">{getStatPieces(5, lifeProtocol.walk)}0%</span>
                       </div>
                       <div className="flex h-1.5 gap-1 w-full relative z-10">
                         {[...Array(10)].map((_, i) => (
                           <div key={i} className={`flex-1 rounded-full ${i < getStatPieces(5, lifeProtocol.walk) ? getBarColorClass(getStatPieces(5, lifeProtocol.walk)) : 'bg-white/10'}`} />
                         ))}
                       </div>
                    </div>

                    {/* Mental Stat */}
                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5 relative overflow-hidden group hover:bg-white/[0.02] hover:border-primary/30 transition-all duration-300">
                       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                          <Brain size={48} className="text-primary" />
                       </div>
                       <div className="flex items-center gap-2 mb-3 font-bold text-sm text-white relative z-10">
                         <Brain size={16} className="text-primary" />
                         <span className="tracking-widest uppercase text-xs">Mental</span>
                         <span className="ml-auto text-primary font-mono text-xs">{getStatPieces(5, lifeProtocol.sunlight)}0%</span>
                       </div>
                       <div className="flex h-1.5 gap-1 w-full relative z-10">
                         {[...Array(10)].map((_, i) => (
                           <div key={i} className={`flex-1 rounded-full ${i < getStatPieces(5, lifeProtocol.sunlight) ? getBarColorClass(getStatPieces(5, lifeProtocol.sunlight)) : 'bg-white/10'}`} />
                         ))}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Pop-up Buttons (Memory Matrix Style) */}
            <div className="md:col-span-3 flex flex-wrap gap-3">
              {[
                { icon: CheckSquare, label: "Tasks" },
                { icon: Calendar, label: "Calendar" },
                { icon: Activity, label: "Analysis" },
                { icon: Box, label: "Mega Projects" },
                { icon: User, label: "Account" }
              ].map((Action, i) => {
                const isActive = activeTab === Action.label;
                return (
                  <motion.button 
                    key={i}
                    onClick={() => setActiveTab(Action.label)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full font-medium transition-colors duration-200 shadow-sm ${
                      isActive 
                        ? 'bg-primary text-white hover:bg-primary/90' 
                        : 'border border-white/10 bg-black/40 text-muted-foreground hover:text-white hover:border-white/30 hover:bg-black/60'
                    }`}
                  >
                    <Action.icon size={16} className={isActive ? 'text-white' : 'text-muted-foreground group-hover:text-white'} />
                    {Action.label}
                  </motion.button>
                );
              })}
            </div>

            {/* --- TAB VIEWS --- */}
            
            {/* TASKS VIEW (Default) */}
            {activeTab === "Tasks" && (
              <>
                {/* Daily Tasks */}
                <div className="md:col-span-2 card p-6 border border-border/50 shadow-sm flex flex-col gap-6 h-full bg-[#111111]/80 backdrop-blur-md rounded-2xl relative overflow-hidden">
                  
                  {/* Top Section */}
                  <div className="flex flex-col gap-4 relative z-10 w-full max-w-[800px] mx-auto">
                    {/* Input Area */}
                    <form onSubmit={addDailyTask} className="flex flex-col sm:flex-row gap-2 w-full">
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          value={newDailyTaskTitle}
                          onChange={(e) => setNewDailyTaskTitle(e.target.value)}
                          placeholder="What needs to be done?"
                          className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors placeholder:text-muted-foreground/50 text-white"
                        />
                        <button 
                          type="submit"
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex justify-center items-center rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      {/* Difficulty Selector */}
                      <div className="flex rounded-xl bg-[#1A1A1A] border border-white/10 p-1 w-full sm:w-auto self-start sm:self-auto">
                        {(['easy', 'medium', 'hard'] as TaskDifficulty[]).map((diff) => (
                          <button
                            key={diff}
                            type="button"
                            onClick={() => setNewDailyTaskDiff(diff)}
                            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${newDailyTaskDiff === diff ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white/80'}`}
                          >
                            {diff}
                          </button>
                        ))}
                      </div>
                    </form>

                    {/* Filter and Progress */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-1 gap-4 sm:gap-0">
                      <div className="flex bg-[#1A1A1A] border border-white/10 rounded-lg p-1 w-full sm:w-auto">
                         <button onClick={() => setTaskFilter('all')} className={`flex-1 sm:flex-none px-4 py-1 text-xs font-medium rounded-md transition-colors ${taskFilter === 'all' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'}`}>All</button>
                         <button onClick={() => setTaskFilter('active')} className={`flex-1 sm:flex-none px-4 py-1 text-xs font-medium rounded-md transition-colors ${taskFilter === 'active' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'}`}>Active</button>
                         <button onClick={() => setTaskFilter('completed')} className={`flex-1 sm:flex-none px-4 py-1 text-xs font-medium rounded-md transition-colors ${taskFilter === 'completed' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'}`}>Completed</button>
                      </div>

                      <div className="flex flex-col items-end gap-1 w-full sm:w-auto">
                         <span className="text-[10px] text-muted-foreground flex items-center gap-2">
                            Progress 
                         </span>
                         <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-white tracking-widest">{calculateDailyPoints()} / {calculateTotalDailyPoints()} points</span>
                            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${calculateTotalDailyPoints() === 0 ? 0 : (calculateDailyPoints() / calculateTotalDailyPoints()) * 100}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Glow separator */}
                  <div className="absolute top-[140px] left-1/2 -translate-x-1/2 w-[70%] sm:w-[50%] h-32 bg-blue-600/20 blur-[50px] sm:blur-[70px] pointer-events-none rounded-full" />

                  {/* Task List */}
                  <div className="flex-1 overflow-y-auto z-10 flex flex-col gap-2 rounded-xl bg-[#111111]/50 border border-white/5 p-4 scrollbar-thin scrollbar-thumb-white/10 min-h-[300px]">
                    {filteredDailyTasks.length === 0 ? (
                       <div className="flex flex-col items-center justify-center flex-1 h-full text-center py-12">
                          <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center mb-4">
                             <LayoutGrid size={20} className="text-muted-foreground/60" />
                          </div>
                          <h3 className="text-sm font-semibold text-white mb-1">No tasks found</h3>
                          <p className="text-xs text-muted-foreground/60">Start by adding a new dimension to your day.</p>
                       </div>
                    ) : (
                      filteredDailyTasks.map((t) => (
                        <div 
                          key={t.id} 
                          onClick={() => toggleDailyTask(t.id)}
                          className={`group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${t.done ? 'bg-primary/10 border-primary/30 opacity-40 shadow-none' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}
                        >
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${t.done ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-primary/50'}`}>
                            {t.done && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckSquare size={14} className="text-white" /></motion.div>}
                          </div>
                          <div className="flex flex-col flex-1">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm tracking-tight transition-all ${t.done ? 'text-primary/70 line-through decoration-primary/50' : 'text-white font-medium'}`}>{t.title}</span>
                                <span className={`text-[8px] uppercase tracking-wider px-2 py-0.5 rounded border ${getDifficultyColor(t.difficulty)}`}>
                                  {t.difficulty}
                                </span>
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); deleteDailyTask(t.id); }}
                                className="text-muted-foreground/60 hover:text-red-400 transition-all p-1.5"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Tasks List (Weekly Must) */}
                <div className="card p-6 border border-border/50 shadow-sm flex flex-col h-full bg-black/[0.55] backdrop-blur-sm relative">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        <Zap size={18} className="text-primary" />
                        Weekly Must
                      </h2>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Current Sync: Phase 01</p>
                    </div>
                    {isWeekActive && weekStartDate && (
                      <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded">
                        WEEK LOCKED
                      </span>
                    )}
                  </div>

                  {!isWeekActive ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <button 
                        onClick={() => { setTempTasks([]); setIsModalOpen(true); }}
                        className="px-8 py-3 bg-primary text-white rounded-full text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                      >
                        <Zap size={16} />
                        START WEEK
                      </button>
                      <p className="text-xs text-muted-foreground mt-4 max-w-[220px]">Program your 7-day directives. Once initiated, routine is locked until cycle expires.</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-3 flex-1 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                        {[...weeklyMusts]
                          .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))
                          .map((t) => (
                          <div 
                            key={t.id} 
                            onClick={() => toggleMust(t.id)}
                            className={`group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${t.done ? 'bg-primary/15 border-primary/50 shadow-none scale-100 opacity-40' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}
                          >
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${t.done ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-primary/50'}`}>
                              {t.done && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckSquare size={14} className="text-white" /></motion.div>}
                            </div>
                            <div className="flex flex-col flex-1">
                              <span className={`text-sm tracking-tight transition-all ${t.done ? 'text-primary font-bold drop-shadow-[0_0_5px_rgba(255,106,0,0.3)]' : 'text-foreground font-medium'}`}>{t.title}</span>
                              <div className="flex items-center gap-3">
                                <span className={`text-[10px] flex items-center gap-1 transition-all ${t.done ? 'text-primary/80' : 'text-muted-foreground'}`}><Clock size={10} /> {t.time}</span>
                                <span className="text-[10px] text-primary/60 font-mono tracking-tighter">PROTO-LOG: {t.id.toString().slice(-4)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/5 text-center">
                        <p className="text-[10px] text-muted-foreground tracking-widest uppercase font-mono">
                          Directives reset daily at 00:00
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Life Protocol Block (Tasks Bottom) */}
                <div className="md:col-span-3 card p-6 border border-border/50 shadow-sm bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl flex flex-col md:flex-row mt-2 min-h-[200px] gap-8">
                  {/* Left: Protocol List */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col">
                        <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                          <HeartPulse size={20} className="text-primary" />
                          Life Protocol
                        </h3>
                        <p className="text-muted-foreground text-[10px] tracking-widest uppercase mt-1">Bare Minimum to do.</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {[
                        { key: 'sleep', label: '7 Hour Sleep', icon: Heart, color: 'text-primary' },
                        { key: 'meditation', label: '15 Minutes Meditation', icon: Target, color: 'text-primary' },
                        { key: 'sunlight', label: '10-20 Minutes of Sunlight', icon: Brain, color: 'text-primary' },
                        { key: 'walk', label: '20 Minutes Walk / 1 Km run', icon: Dumbbell, color: 'text-primary' }
                      ].map((task) => (
                        <div 
                          key={task.key}
                          onClick={() => setLifeProtocol(prev => ({ ...prev, [task.key]: !prev[task.key as keyof typeof lifeProtocol] }))}
                          className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border ${lifeProtocol[task.key as keyof typeof lifeProtocol] ? 'bg-primary/10 border-primary/30' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                        >
                           <div className={`w-5 h-5 rounded border-[1.5px] flex items-center justify-center transition-colors ${lifeProtocol[task.key as keyof typeof lifeProtocol] ? 'bg-primary border-primary' : 'border-white/20 leading-none'}`}>
                             {lifeProtocol[task.key as keyof typeof lifeProtocol] && <Check size={14} className="text-black font-bold stroke-[3px]" />}
                           </div>
                           <task.icon size={16} className={task.color} />
                           <span className={`text-sm font-semibold tracking-wide ${lifeProtocol[task.key as keyof typeof lifeProtocol] ? 'text-white' : 'text-white/70'}`}>
                             {task.label}
                           </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Radar Chart */}
                  <div className="w-full md:w-72 lg:w-80 flex flex-col items-center justify-center relative border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 pl-0 md:pl-6">
                    <h4 className="absolute top-0 md:top-auto md:-top-4 text-[10px] text-muted-foreground uppercase tracking-widest font-mono text-center w-full">Stats Radar</h4>
                    <LifeRadar lifeProtocol={lifeProtocol} />
                  </div>
                </div>

                <div className="md:col-span-3 mt-4 p-5 rounded-2xl bg-[#0a0a0a]/50 border border-white/5 mx-auto text-left w-full max-w-5xl text-sm flex gap-4 items-start shadow-sm">
                  <HeartPulse className="text-primary flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-white font-bold mb-1">Why is Life Protocol important?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      It establishes the non-negotiable biological baseline required for optimal human function. By securing essential daily inputs—restorative sleep, cognitive stillness, physical movement, and natural light—you proactively fortify your immune system, regulate your circadian rhythm, and prevent chronic physiological degradation.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* CALENDAR VIEW */}
            {activeTab === "Calendar" && (
              <div className="md:col-span-3 grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Left Side: Calendar Control */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                
                {/* Task Logs (Heatmap / Continuous active days) */}
                <div className="card p-6 border border-border/50 shadow-sm bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl flex flex-col gap-4">
                   <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowTaskLog(!showTaskLog)}>
                      <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <Activity className="text-primary" size={20} />
                          Task Logs
                        </h2>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Continuous Execution Map</p>
                      </div>
                      <button className="text-white/50 hover:text-white">
                        {showTaskLog ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                   </div>
                   
                   {showTaskLog && (
                     <div className="w-full mt-4 flex flex-col gap-4">
                       <div className="flex items-center justify-between">
                         <span className="text-sm font-bold uppercase tracking-wider text-white bg-white/5 px-3 py-1 rounded">
                           {taskLogDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                         </span>
                         <div className="flex gap-2">
                           <button onClick={(e) => { e.stopPropagation(); setTaskLogDate(new Date(taskLogDate.getFullYear(), taskLogDate.getMonth() - 1, 1)); }} className="p-1 hover:bg-white/10 rounded-md transition-colors text-white/60 hover:text-white">
                             <ChevronLeft size={16} />
                           </button>
                           <button onClick={(e) => { e.stopPropagation(); setTaskLogDate(new Date(taskLogDate.getFullYear(), taskLogDate.getMonth() + 1, 1)); }} className="p-1 hover:bg-white/10 rounded-md transition-colors text-white/60 hover:text-white">
                             <ChevronRight size={16} />
                           </button>
                         </div>
                       </div>

                       <div className="grid grid-cols-10 gap-1 sm:gap-2 w-fit">
                         {Array.from({ length: new Date(taskLogDate.getFullYear(), taskLogDate.getMonth() + 1, 0).getDate() }).map((_, dayIdx) => {
                           const y = taskLogDate.getFullYear();
                           const m = String(taskLogDate.getMonth() + 1).padStart(2, '0');
                           const d = String(dayIdx + 1).padStart(2, '0');
                           const dateStr = `${y}-${m}-${d}`;
                           const history = taskHistory[dateStr];
                           const intensity = history ? history.intensity : 0;
                           const opacities = ['bg-white/5', 'bg-primary/20', 'bg-primary/40', 'bg-primary/60', 'bg-primary'];
                           return (
                             <div 
                               key={`day-${taskLogDate.getMonth()}-${dayIdx}`} 
                               className={`w-6 h-6 sm:w-8 sm:h-8 rounded-sm ${opacities[intensity] || opacities[0]} border border-white/5 flex items-center justify-center text-[10px] sm:text-xs font-mono text-white/40`}
                               title={`Activity level: ${intensity} on ${dayIdx + 1}`}
                             >
                               {dayIdx + 1}
                             </div>
                           );
                         })}
                       </div>
                       <div className="flex items-center justify-between mt-2 text-[10px] text-white/40 uppercase tracking-widest font-mono">
                         <span>{new Date(taskLogDate.getFullYear(), taskLogDate.getMonth() + 1, 0).getDate()} Days</span>
                         <div className="flex items-center gap-1">
                           <span>Less</span>
                           <div className="w-3 h-3 rounded-sm bg-white/5 border border-white/5" />
                           <div className="w-3 h-3 rounded-sm bg-primary/20 border border-white/5" />
                           <div className="w-3 h-3 rounded-sm bg-primary/40 border border-white/5" />
                           <div className="w-3 h-3 rounded-sm bg-primary/60 border border-white/5" />
                           <div className="w-3 h-3 rounded-sm bg-primary border border-white/5" />
                           <span>More</span>
                         </div>
                       </div>
                     </div>
                   )}
                </div>

                <div className="card p-6 border border-border/50 shadow-sm bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="text-primary" size={24} />
                        Temporal Logs
                      </h2>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Quantum Schedule Mapping</p>
                    </div>
                    <div className="flex items-center gap-4 bg-black/40 border border-white/5 rounded-full px-4 py-2">
                      <button onClick={prevMonth} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                        <ChevronLeft size={16} />
                      </button>
                      <span className="text-sm font-bold w-40 text-center uppercase tracking-widest text-primary">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </span>
                      <button onClick={nextMonth} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
                    <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-xl overflow-hidden min-w-[500px] md:min-w-0">
                      {/* Days Header */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="bg-white/[0.02] p-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-white/5">
                        {day}
                      </div>
                    ))}
                    
                    {/* Empty Days Before */}
                    {Array.from({ length: getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => (
                      <div key={`empty-${i}`} className="bg-transparent min-h-[90px] p-2 border-r border-b border-white/5"></div>
                    ))}

                    {/* Calendar Days */}
                    {Array.from({ length: getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => {
                      const day = i + 1;
                      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                      const dateStr = dateObj.toISOString().split('T')[0];
                      const isToday = new Date().toDateString() === dateObj.toDateString();
                      
                      const dayEvents = events.filter(e => e.date.startsWith(dateStr));

                      return (
                        <div 
                          key={day} 
                          onClick={() => {
                            setSelectedDate(dateStr);
                            setIsViewEventsModalOpen(true);
                          }}
                          className={`bg-white/[0.01] min-h-[90px] p-2 border-r border-b border-white/5 transition-all group relative cursor-pointer hover:bg-white/[0.05] ${isToday ? 'bg-primary/5' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                             <span className={`text-[10px] sm:text-xs font-black p-1 sm:p-1.5 rounded-md min-w-[24px] text-center transition-all ${isToday ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground group-hover:text-white'}`}>
                               {day}
                             </span>
                             {dayEvents.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                          </div>
                          
                          <div className="flex flex-col gap-1.5">
                            {dayEvents.map(event => (
                              <div key={event.id} className="text-[9px] bg-primary/10 text-primary px-2 py-1 rounded-md border border-primary/20 font-bold truncate tracking-tight">
                                {event.title}
                              </div>
                            ))}
                          </div>
                          
                          <div className="absolute inset-x-0 bottom-1 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Plus size={12} className="text-primary/50" />
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </div>
                </div>
                </div>

                {/* Right Side: Upcoming Events */}
                <div className="flex flex-col gap-6">
                   <div className="card p-6 border border-border/50 shadow-sm bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                         <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                            <TrendingUp size={20} className="text-primary" />
                            Upcoming Events
                         </h3>
                         <div className="flex items-center gap-2">
                           <span className="text-xs text-primary font-mono font-bold bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20 leading-none flex items-center justify-center">{events.length} LOGS</span>
                           <button 
                             onClick={() => setIsEventModalOpen(true)}
                             className="w-6 h-6 rounded-md bg-primary/20 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-primary/50 shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                           >
                             <Plus size={14} />
                           </button>
                         </div>
                      </div>
                      
                      <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                         {events
                           .filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)))
                           .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                           .map(event => {
                             const evDate = new Date(event.date);
                             const diffTime = evDate.getTime() - new Date().getTime();
                             const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
                             
                             return (
                               <div 
                                 key={event.id} 
                                 onClick={() => setSelectedEventDetails(event)}
                                 className="group p-3 sm:p-4 rounded-xl border border-white/5 bg-black/40 hover:bg-white/5 transition-all flex flex-col gap-2 relative overflow-hidden cursor-pointer"
                               >
                                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/30 group-hover:bg-primary transition-colors" />
                                  <div className="flex justify-between items-start pl-2">
                                      <div className="flex flex-col">
                                         <span className="text-sm font-bold text-white group-hover:text-primary transition-colors tracking-tight">{event.title}</span>
                                         <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-1">
                                            <Calendar size={12} className="text-primary/70" />
                                            {evDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                         </div>
                                      </div>
                                      <div className="flex flex-col items-end gap-2 relative z-10">
                                         <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] sm:text-[10px] font-bold rounded shadow-sm border border-primary/20 uppercase tracking-widest">{diffDays === 0 ? 'TODAY' : diffDays === 1 ? 'TOMORROW' : `IN ${diffDays} DAYS`}</span>
                                         <button 
                                           onClick={(e) => { e.stopPropagation(); deleteEvent(event.id); }}
                                           className="p-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-500 hover:text-orange-400 rounded-md transition-all shadow-[0_0_8px_rgba(249,115,22,0.15)]"
                                           title="Delete Log"
                                         >
                                           <Trash2 size={14} />
                                         </button>
                                      </div>
                                   </div>
                                </div>
                             );
                           })
                         }
                         {events.filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0))).length === 0 && (
                            <div className="text-center py-8 opacity-50">
                               <p className="text-xs">No upcoming protocols.</p>
                            </div>
                         )}
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === "Analysis" && (
              <div className="md:col-span-3 flex flex-col gap-6" style={(isMobileDevice && analysisView === 'graph') ? { zoom: 0.65 } : {}}>
                
                {/* View Toggles */}
                <div className="flex justify-start gap-2 bg-[#1A1A1A] border border-white/10 rounded-xl p-1 self-start">
                  <button onClick={() => setAnalysisView('graph')} className={`hidden sm:inline-block px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${analysisView === 'graph' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>Graphs</button>
                  <button onClick={() => setAnalysisView('radar')} className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${analysisView === 'radar' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>Radar</button>
                  <button onClick={() => setAnalysisView('block')} className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${analysisView === 'block' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>Block Craft</button>
                </div>

                {analysisView === 'radar' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    {/* Daily Radar Performance Graph */}
                    <div className="card p-6 border border-border/50 shadow-sm bg-[#111111]/80 backdrop-blur-md rounded-2xl relative overflow-hidden h-[500px] sm:h-[600px] flex flex-col">
                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 relative z-10 w-full shrink-0">
                         <h2 className="text-xl font-bold flex items-center gap-2">
                           <Activity size={20} className="text-primary" />
                           Daily Performance Vector
                         </h2>
                         <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded border border-primary/30 font-mono tracking-widest uppercase">Daily-Hepta</span>
                       </div>
                       <div className="flex-1 w-full min-w-0 relative z-10 overflow-hidden pb-4 md:pb-0">
                         <HeptaRadar data={dailyVectorData} />
                       </div>
                    </div>

                    {/* Weekly Must Radar Performance Graph */}
                    <div className="card p-6 border border-border/50 shadow-sm bg-[#111111]/80 backdrop-blur-md rounded-2xl relative overflow-hidden h-[500px] sm:h-[600px] flex flex-col">
                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 relative z-10 w-full shrink-0">
                         <h2 className="text-xl font-bold flex items-center gap-2">
                           <Target size={20} className="text-blue-400" />
                           Weekly Must Vector
                         </h2>
                         <span className="text-[10px] bg-blue-400/20 text-blue-400 px-2 py-1 rounded border border-blue-400/30 font-mono tracking-widest uppercase">Weekly-Hepta</span>
                       </div>
                       <div className="flex-1 w-full min-w-0 relative z-10 overflow-hidden pb-4 md:pb-0">
                         <HeptaRadar data={weeklyVectorData} color="#60a5fa" strokeColor="#93c5fd" />
                       </div>
                    </div>
                  </div>
                )}

                {analysisView === 'graph' && (
                  <div className="hidden sm:grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Daily Task Performance Graph */}
                    <div className="card p-6 border border-border/50 shadow-sm bg-[#111111]/80 backdrop-blur-md rounded-2xl relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 relative z-10">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <Target size={20} className="text-primary" />
                          Daily Task Performance
                        </h2>
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded border border-primary/30 font-mono tracking-widest uppercase">{avgDailyPct}% Avg</span>
                      </div>
                      <div className="h-[250px] sm:h-[300px] w-full min-w-0 relative z-10 overflow-hidden pb-4 md:pb-0">
                        <div className="w-full min-w-0 h-full">
                          <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analysisData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff6a00" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ff6a00" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="day" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#050505', borderColor: '#ffffff20', borderRadius: '8px', fontSize: '14px' }}
                              itemStyle={{ color: '#fff' }}
                            />
                              <Area type="monotone" dataKey="daily" name="Daily Completion %" stroke="#ff6a00" strokeWidth={3} fillOpacity={1} fill="url(#colorDaily)" activeDot={{ r: 6, fill: '#ff6a00', stroke: '#fff', strokeWidth: 2 }} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Weekly Must Performance Graph */}
                    <div className="card p-6 border border-border/50 shadow-sm bg-[#111111]/80 backdrop-blur-md rounded-2xl relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 relative z-10">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <Zap size={20} className="text-blue-500" />
                          Weekly Must Performance
                        </h2>
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 font-mono tracking-widest uppercase">{avgWeeklyPct}% Avg</span>
                      </div>
                      <div className="h-[250px] sm:h-[300px] w-full min-w-0 relative z-10 overflow-hidden pb-4 md:pb-0">
                        <div className="w-full min-w-0 h-full">
                          <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analysisData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="day" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#050505', borderColor: '#ffffff20', borderRadius: '8px', fontSize: '14px' }}
                              itemStyle={{ color: '#fff' }}
                            />
                              <Area type="monotone" dataKey="weekly" name="Weekly Must Intact %" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeekly)" activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {analysisView === 'block' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Daily Block Craft */}
                    <div className="card p-6 border border-border/50 shadow-sm bg-[#111111]/80 backdrop-blur-md rounded-2xl relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 relative z-10">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <Target size={20} className="text-primary" />
                          Daily Block Craft
                        </h2>
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded border border-primary/30 font-mono tracking-widest uppercase">{avgDailyPct}% Avg</span>
                      </div>
                      <div className="flex w-full min-w-0 md:flex-wrap gap-1 sm:gap-4 relative z-10 items-end justify-between sm:justify-center h-[200px] pb-4 md:pb-0">
                        {analysisData.map((data, idx) => (
                           <div key={`daily-${idx}`} className="flex flex-col items-center gap-2 flex-1 sm:flex-none">
                             <div className="w-full max-w-[32px] sm:max-w-none sm:w-12 h-32 sm:h-40 bg-white/5 rounded-t-sm rounded-b-md border border-white/10 relative overflow-hidden flex flex-col justify-end shadow-inner">
                               <motion.div 
                                 initial={{ height: 0 }}
                                 animate={{ height: `${data.daily}%` }}
                                 transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                                 className="w-full bg-gradient-to-t from-primary/80 to-primary/40 rounded-t-sm"
                               />
                             </div>
                             <span className="text-[10px] sm:text-xs font-mono text-muted-foreground uppercase">{data.day === 'Today' ? 'Tod' : data.day.replace('Day ', 'D')}</span>
                             <span className="text-[10px] font-bold text-white">{data.daily}%</span>
                           </div>
                        ))}
                      </div>
                    </div>

                    {/* Weekly Must Block Craft */}
                    <div className="card p-6 border border-border/50 shadow-sm bg-[#111111]/80 backdrop-blur-md rounded-2xl relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 relative z-10">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <Zap size={20} className="text-blue-500" />
                          Weekly Block Craft
                        </h2>
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 font-mono tracking-widest uppercase">{avgWeeklyPct}% Avg</span>
                      </div>
                      <div className="flex w-full min-w-0 md:flex-wrap gap-1 sm:gap-4 relative z-10 items-end justify-between sm:justify-center h-[200px] pb-4 md:pb-0">
                        {analysisData.map((data, idx) => (
                           <div key={`weekly-${idx}`} className="flex flex-col items-center gap-2 flex-1 sm:flex-none">
                             <div className="w-full max-w-[32px] sm:max-w-none sm:w-12 h-32 sm:h-40 bg-white/5 rounded-t-sm rounded-b-md border border-white/10 relative overflow-hidden flex flex-col justify-end shadow-inner">
                               <motion.div 
                                 initial={{ height: 0 }}
                                 animate={{ height: `${data.weekly}%` }}
                                 transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                                 className="w-full bg-gradient-to-t from-blue-500/80 to-blue-500/40 rounded-t-sm"
                               />
                             </div>
                             <span className="text-[10px] sm:text-xs font-mono text-muted-foreground uppercase">{data.day === 'Today' ? 'Tod' : data.day.replace('Day ', 'D')}</span>
                             <span className="text-[10px] font-bold text-white">{data.weekly}%</span>
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Mega Projects" && (
              <div className="md:col-span-3 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 bg-[#0a0a0a] p-5 md:p-6 rounded-2xl border border-white/5 shadow-lg">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3">
                      <Box className="text-primary w-6 h-6 md:w-7 md:h-7" />
                      Mega Projects
                    </h2>
                    <p className="text-xs md:text-sm text-muted-foreground mt-2 tracking-wide">Manage overarching system directives and primary mission architectures.</p>
                  </div>
                  <button
                    onClick={() => setIsProjectModalOpen(true)}
                    className="flex items-center gap-2 shrink-0 bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary px-4 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl font-semibold tracking-wider text-xs md:text-sm transition-all"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    INITIALIZE
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className="card p-12 border border-border/50 shadow-sm flex flex-col items-center justify-center text-center">
                    <Box size={48} className="text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No Active Architectures</h3>
                    <p className="text-muted-foreground max-w-md">Initialize a new Mega Project to allocate resources and assign assisting nodes to critical operations.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((proj) => (
                      <div key={proj.id} className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-colors shadow-lg flex flex-col h-full relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-hover:bg-primary transition-colors"></div>
                        <div className="flex justify-between items-start mb-4 pl-3">
                          <h3 className="text-xl font-bold text-white leading-tight">{proj.name}</h3>
                          <div className="px-2 py-1 bg-white/5 text-muted-foreground border border-white/10 rounded text-[10px] font-mono uppercase tracking-widest ml-2 flex-shrink-0">Active</div>
                        </div>
                        <p className="text-muted-foreground/80 text-sm mb-6 flex-1 pl-3 line-clamp-3 leading-relaxed">{proj.description}</p>
                        
                        <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/5 ml-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <span className="text-[10px] text-muted-foreground font-mono font-bold tracking-widest uppercase">Cycle Status</span>
                            <span className="text-xs text-white/90 font-medium">
                              {proj.startDate || '?'} <span className="text-muted-foreground/50 mx-1">→</span> {proj.endDate || '?'}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <span className="text-[10px] text-muted-foreground font-mono font-bold tracking-widest uppercase">Prime Architect</span>
                            <span className="text-xs text-primary font-bold tracking-wide">{proj.lead || 'SYSTEM_AUTO'}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <span className="text-[10px] text-muted-foreground font-mono font-bold tracking-widest uppercase">Assisting Nodes</span>
                            <span className="text-xs text-white/80 truncate max-w-[180px]">{proj.nodes || 'UNASSIGNED'}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button 
                            onClick={() => deleteProject(proj.id)}
                            className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors border border-green-500/20"
                          >
                            <Check size={14} />
                            Complete Archive
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "Account" && (
              <div className="md:col-span-3 space-y-6">
                
                {/* Header */}
                <div className="flex items-center gap-4 bg-[#0a0a0a] p-5 md:p-6 rounded-2xl border border-white/5 shadow-lg">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">Operative Profile</h2>
                    <p className="text-sm text-primary font-mono mt-1 uppercase tracking-widest">{operativeName}</p>
                  </div>
                </div>

                <div className="space-y-6">
                   {/* Operative Alias Box */}
                   <div className="card p-6 border border-border/50 shadow-sm flex flex-col bg-[#050505]">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                        <User size={18} className="text-primary" />
                        Operative Alias
                      </h3>
                      <input 
                        type="text" 
                        value={operativeName}
                        onChange={(e) => setOperativeName(e.target.value)}
                        placeholder="Enter Alias..."
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                      />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Avatar / Identity Selection */}
                       <div className="card p-6 border border-border/50 shadow-sm flex flex-col bg-[#050505] overflow-hidden">
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                            <Camera size={18} className="text-primary" />
                            Visual Identifier
                          </h3>
                          <div className="flex overflow-x-auto gap-3 pb-4 snap-x scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                              {avatarImages.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`Avatar ${idx}`}
                                  className={`w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl cursor-pointer snap-center border-2 transition-all hover:scale-105 flex-shrink-0 ${customAvatar === img ? 'border-primary ring-2 ring-primary/30 opacity-100' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                                  onClick={() => setCustomAvatar(img)}
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              ))}
                          </div>
                          
                          <div className="mt-auto">
                            <div className="flex items-center gap-4 w-full my-4">
                               <div className="h-px bg-white/10 flex-1"></div>
                               <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex-shrink-0">OR CUSTOM UPLOAD</span>
                               <div className="h-px bg-white/10 flex-1"></div>
                            </div>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              ref={fileInputRef} 
                              onChange={handleImageUpload} 
                            />
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="flex justify-center items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-all cursor-pointer w-full"
                            >
                              <Camera size={16} />
                              <span>Upload Custom Identity</span>
                            </button>
                          </div>
                       </div>

                       {/* System Preferences & Data Management */}
                       <div className="card p-6 border border-border/50 shadow-sm flex flex-col gap-6 bg-[#050505]">
                          <div>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                              <Settings size={18} className="text-primary" />
                              System Preferences
                            </h3>
                            
                             {/* Notifications */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                               <div>
                                  <p className="text-sm font-medium text-white">Telemetry Broadcasts</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">Receive system status updates</p>
                               </div>
                               <button 
                                 onClick={() => setNotifications(!notifications)}
                                 className={`w-11 h-6 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-white/10'}`}
                               >
                                 <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifications ? 'right-1' : 'left-1'}`}></div>
                               </button>
                            </div>

                             {/* Quote Box Toggle */}
                            <div className="mt-4 flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                               <div>
                                  <p className="text-sm font-medium text-white">Quote of the Day</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">Toggle daily motivation box</p>
                               </div>
                               <button 
                                 onClick={() => setShowQuoteBox(!showQuoteBox)}
                                 className={`w-11 h-6 rounded-full transition-colors relative ${showQuoteBox ? 'bg-primary' : 'bg-white/10'}`}
                               >
                                 <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${showQuoteBox ? 'right-1' : 'left-1'}`}></div>
                               </button>
                            </div>

                             {/* Theme Color Input */}
                            <div className="mt-4 flex flex-col gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                               <div className="flex items-center justify-between">
                                  <div>
                                     <p className="text-sm font-medium text-white">System Color Protocol</p>
                                     <p className="text-xs text-muted-foreground mt-0.5">Define core aesthetic spectrum</p>
                                  </div>
                                  <input 
                                    type="color" 
                                    value={appThemeColor}
                                    onChange={(e) => setAppThemeColor(e.target.value)}
                                    className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent"
                                  />
                               </div>
                               
                               <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                 {['#ff6a00', '#2EDC85', '#32C759', '#0AFFFF'].map((color) => (
                                   <button
                                     key={color}
                                     onClick={() => setAppThemeColor(color)}
                                     className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${appThemeColor === color ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-transparent'}`}
                                     style={{ backgroundColor: color }}
                                     title={color}
                                   />
                                 ))}
                               </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                              <Activity size={18} className="text-primary" />
                              Data Portability
                            </h3>
                            <div className="flex flex-col gap-3">
                               <input 
                                 type="file" 
                                 accept=".zip" 
                                 className="hidden" 
                                 ref={dataImportRef} 
                                 onChange={importData} 
                               />
                               <button 
                                onClick={() => dataImportRef.current?.click()}
                                className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all text-sm font-medium text-white/90"
                               >
                                 <Upload size={16} /> Ingest Data Archive
                               </button>
                               <button 
                                onClick={exportData}
                                className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all text-sm font-medium text-white/90"
                               >
                                 <Download size={16} /> Extract Data Archive
                               </button>
                            </div>
                          </div>
                       </div>
                   </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Modal for Weekly Must Setup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#050505] border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]"
          >
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-white">
              <Zap className="text-primary" /> Start Weekly Cycle
            </h2>
            <p className="text-sm text-muted-foreground mb-6">Program instructions for the next 7 days. Once committed, tasks cannot be added or reset until the week expires.</p>
            
            <div className="flex-1 overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-white/10 flex flex-col gap-2">
              {tempTasks.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-white/10 rounded-xl">
                  <p className="text-sm text-muted-foreground">No tasks queued.</p>
                </div>
              ) : (
                tempTasks.map((t, idx) => (
                  <div key={t.id} className="text-sm p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
                    <span>{idx + 1}. {t.title}</span>
                    <button 
                      onClick={() => setTempTasks(prev => prev.filter(task => task.id !== t.id))}
                      className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wide"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={addTempTask} className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={tempTaskTitle}
                onChange={(e) => setTempTaskTitle(e.target.value)}
                placeholder="Enter mandatory daily task..."
                className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm flex-1 focus:outline-none focus:border-primary/50 transition-colors text-white"
              />
              <button 
                type="submit"
                className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-6 py-3 text-sm font-bold transition-all"
              >
                Queue
              </button>
            </form>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white/5 transition-colors text-white"
              >
                Abort
              </button>
              <button 
                onClick={commitWeek}
                disabled={tempTasks.length === 0}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/20"
              >
                Commit Protocol
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {/* View Events Modal */}
      {isViewEventsModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4" onClick={() => setIsViewEventsModalOpen(false)}>
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]"
             onClick={e => e.stopPropagation()}
           >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Logs</h2>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Date: {selectedDate}</p>
                 </div>
                 <button onClick={() => setIsViewEventsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                    &times;
                 </button>
              </div>

              <div className="space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                 {events.filter(e => e.date.startsWith(selectedDate || "")).map(event => (
                   <div key={event.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col gap-1 relative overflow-hidden group hover:bg-white/[0.04] transition-all">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary/30 group-hover:bg-primary transition-colors" />
                      <div className="pl-2 flex flex-col gap-1">
                        <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{event.title}</span>
                        {event.protocolCode && (
                          <span className="text-xs text-muted-foreground whitespace-pre-wrap">{event.protocolCode}</span>
                        )}
                        <span className="text-[10px] uppercase font-mono text-primary/60 mt-1">Scheduled Protocol</span>
                      </div>
                      <button 
                         onClick={() => deleteEvent(event.id)}
                         className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-md transition-all sm:opacity-0 sm:group-hover:opacity-100"
                         title="Delete Log"
                       >
                         <Trash2 size={16} />
                       </button>
                   </div>
                 ))}
                 {events.filter(e => e.date.startsWith(selectedDate || "")).length === 0 && (
                   <div className="py-8 text-center opacity-50">
                     <p className="text-xs text-white">No protocols scheduled for this date.</p>
                   </div>
                 )}
              </div>
           </motion.div>
        </div>
      )}

      {/* View Event Details Modal */}
      {selectedEventDetails && (
        <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4" onClick={() => setSelectedEventDetails(null)}>
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden flex flex-col gap-4"
             onClick={e => e.stopPropagation()}
           >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              
              <div className="flex justify-between items-start">
                 <div>
                    <h2 className="text-xl font-black text-white mb-1 tracking-tight">{selectedEventDetails.title}</h2>
                    <div className="flex items-center gap-2 text-xs font-medium text-primary/80 uppercase tracking-widest font-mono">
                      <Calendar size={12} />
                      {new Date(selectedEventDetails.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                 </div>
                 <button onClick={() => setSelectedEventDetails(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                    &times;
                 </button>
              </div>

              {selectedEventDetails.protocolCode && (
                 <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed mt-2">
                    {selectedEventDetails.protocolCode}
                 </div>
              )}
           </motion.div>
        </div>
      )}

      {/* Event Setup Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
           >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              
              <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Setup Protocol</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-6">Schedule New Event</p>
              
              <div className="space-y-4 mb-8">
                <div>
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">Protocol Designation</label>
                   <input 
                     autoFocus
                     type="text"
                     value={newEventTitle}
                     onChange={(e) => setNewEventTitle(e.target.value)}
                     placeholder="e.g. CORE SYSTEM RESTORE"
                     className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">Date</label>
                   <input 
                     type="date"
                     value={newEventDate}
                     onChange={(e) => setNewEventDate(e.target.value)}
                     className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                     style={{ colorScheme: "dark" }}
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">Protocol Code / Summary</label>
                   <textarea 
                     value={newEventCode}
                     onChange={(e) => setNewEventCode(e.target.value)}
                     placeholder="Brief protocol or event description..."
                     className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium min-h-[80px] resize-none scrollbar-thin scrollbar-thumb-white/10"
                   />
                </div>
              </div>

              <div className="flex gap-3">
                 <button 
                  onClick={() => {
                    setIsEventModalOpen(false);
                    setNewEventTitle("");
                    setNewEventDate("");
                    setNewEventCode("");
                  }}
                  className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-white/5 transition-all border border-white/5"
                 >
                   Abort
                 </button>
                 <button 
                  disabled={!newEventTitle.trim() || !newEventDate}
                  onClick={() => {
                    if(newEventTitle.trim() && newEventDate) {
                      setEvents(prev => [...prev, { id: Date.now(), title: newEventTitle, date: newEventDate, protocolCode: newEventCode.trim() }]);
                      setNewEventTitle("");
                      setNewEventDate("");
                      setNewEventCode("");
                      setIsEventModalOpen(false);
                    }
                  }}
                  className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-30 shadow-lg shadow-primary/20"
                 >
                   Initialize
                 </button>
              </div>
           </motion.div>
        </div>
      )}
      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden"
           >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
              
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-primary/10 rounded-xl">
                   <Box className="text-primary" size={24} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-white tracking-wide uppercase">Initialize Project</h3>
                   <p className="text-sm text-primary/80 font-mono">NEW ARCHITECTURE PARAMETERS</p>
                 </div>
              </div>

              <form onSubmit={addProject} className="space-y-4 mb-6">
                <div>
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">Project Designation</label>
                   <input 
                     autoFocus
                     type="text" 
                     required
                     value={newProject.name || ""}
                     onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                     placeholder="Operation nomenclature..."
                     className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                   />
                </div>
                
                <div>
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">Description</label>
                   <textarea 
                     rows={2}
                     value={newProject.description || ""}
                     onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                     placeholder="Brief operational summary..."
                     className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium resize-none scrollbar-thin scrollbar-thumb-white/10"
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">Start Cycle</label>
                    <input 
                      type="date"
                      value={newProject.startDate || ""}
                      onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">End Cycle</label>
                    <input 
                      type="date"
                      value={newProject.endDate || ""}
                      onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">Prime Architect</label>
                     <input 
                       type="text" 
                       value={newProject.lead || ""}
                       onChange={(e) => setNewProject({...newProject, lead: e.target.value})}
                       placeholder="e.g. ALPHA-01"
                       className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                     />
                  </div>
                  <div>
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">Assisting Nodes</label>
                     <input 
                       type="text" 
                       value={newProject.nodes || ""}
                       onChange={(e) => setNewProject({...newProject, nodes: e.target.value})}
                       placeholder="e.g. BETA, GAMMA"
                       className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                     />
                  </div>
                </div>
                
                {/* Submit button inside form for Enter 'submit' accessibility */}
                <button type="submit" className="hidden"></button>
              </form>

              <div className="flex gap-3">
                 <button 
                  onClick={() => {
                    setIsProjectModalOpen(false);
                    setNewProject({});
                  }}
                  className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-white/5 transition-all border border-white/5"
                 >
                   Abort
                 </button>
                 <button 
                  onClick={addProject}
                  disabled={!newProject.name?.trim()}
                  className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-30 shadow-lg shadow-primary/20"
                 >
                   Initialize
                 </button>
              </div>
           </motion.div>
        </div>
      )}
    </motion.div>
  );
}
