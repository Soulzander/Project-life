import { Bell, Search, LayoutDashboard, Calendar, Settings, Activity, Target, Zap, Clock, MoreHorizontal, CheckSquare, Box, User, ChevronLeft, ChevronRight, Download, Camera, Trash2, Plus, LayoutGrid, TrendingUp, Heart, Brain, Dumbbell, HeartPulse, Check } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

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
  "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=600", // neon face
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600", // retro tech
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600", // matrix code
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600", // code blocks
  "https://images.unsplash.com/photo-1531297172864-74127c504022?q=80&w=600", // cyber UI
  "https://images.unsplash.com/photo-1618367588411-dc30daed4742?q=80&w=600", // futuristic pattern
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600", // microchip
  "https://images.unsplash.com/photo-1515600103135-e115fd4fcb53?q=80&w=600", // tech network
];

const RadarGridRing = ({ value, colorClass, strokeWidth = 1 }: { value: number, colorClass: string, strokeWidth?: number }) => {
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

export default function App() {
  const [activeTab, setActiveTab] = useState("Tasks");

  // Custom Avatar State
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [events, setEvents] = useState<CalendarEvent[]>([]);
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

  // Weekly Must State & Lockdown Logic
  const [isWeekActive, setIsWeekActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weeklyMusts, setWeeklyMusts] = useState<{id: number, title: string, time: string, done: boolean}[]>([]);
  const [tempTasks, setTempTasks] = useState<{id: number, title: string, time: string, done: boolean}[]>([]);
  const [tempTaskTitle, setTempTaskTitle] = useState("");
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString());
  const [weekStartDate, setWeekStartDate] = useState<string | null>(null);

  // Analysis State
  const [analysisView, setAnalysisView] = useState<'graph' | 'block'>('graph');

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

  const getStatPieces = (base: number, done: boolean) => done ? base + 1 : base;

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

  const [historicalData] = useState([
    { day: 'Day 1', daily: 0, weekly: 0 },
    { day: 'Day 2', daily: 0, weekly: 0 },
    { day: 'Day 3', daily: 0, weekly: 0 },
    { day: 'Day 4', daily: 0, weekly: 0 },
    { day: 'Day 5', daily: 0, weekly: 0 },
    { day: 'Day 6', daily: 0, weekly: 0 },
  ]);

  const todayDailyPct = calculateTotalDailyPoints() === 0 ? 0 : Math.round((calculateDailyPoints() / calculateTotalDailyPoints()) * 100);
  const todayWeeklyPct = weeklyMusts.length === 0 ? 0 : Math.round((weeklyMusts.filter(m => m.done).length / weeklyMusts.length) * 100);

  const analysisData = [
    ...historicalData,
    { day: 'Today', daily: todayDailyPct, weekly: todayWeeklyPct }
  ];

  const avgDailyPct = Math.round(analysisData.reduce((acc, curr) => acc + curr.daily, 0) / analysisData.length) || 0;
  const avgWeeklyPct = Math.round(analysisData.reduce((acc, curr) => acc + curr.weekly, 0) / analysisData.length) || 0;

  return (
    <div className="min-h-screen text-foreground flex w-full relative overflow-hidden bg-black">

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen w-full relative z-10 pt-6">

        {/* Dashboard Content Container */}
        <div className="px-6 pb-6 max-w-[1400px] mx-auto w-full flex-1 flex flex-col gap-6">
          
          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Unified Profile & Focus Metrics */}
            <div className="group bg-[#050505] rounded-xl p-0 md:col-span-3 grid grid-cols-1 md:grid-cols-12 border border-white/10 shadow-sm relative overflow-hidden items-stretch">
              
              {/* Left Side: Avatar Image (Roughly 1/3) */}
              <div className="md:col-span-4 relative h-64 md:h-[400px]">
                {customAvatar ? (
                  <img src={customAvatar} alt="Custom Profile" className="w-full h-full object-cover object-center" />
                ) : (
                  <picture>
                    <source media="(min-width: 1024px)" srcSet={laptopAvatarImg} />
                    <source media="(min-width: 768px)" srcSet={tabletAvatarImg} />
                    <img 
                      src={mobileAvatarImg} 
                      alt="Aiden Vance" 
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
                       <h3 className="font-black text-4xl lg:text-5xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-primary/40 drop-shadow-md">Aiden Vance</h3>
                       <div className="bg-primary/10 border border-primary/20 p-2 rounded-xl mt-1 shadow-[0_0_15px_rgba(255,106,0,0.2)]">
                         <Zap size={20} className="text-primary fill-primary/20" />
                       </div>
                    </div>
                  </div>
                  {/* Mobile version */}
                  <div className="sm:hidden">
                    <div className="flex items-center gap-3 mb-2">
                       <h3 className="font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-primary/40 drop-shadow-md">Aiden Vance</h3>
                       <div className="bg-primary/10 border border-primary/20 p-1.5 rounded-lg mt-1 shadow-[0_0_10px_rgba(255,106,0,0.2)]">
                         <Zap size={16} className="text-primary fill-primary/20" />
                       </div>
                    </div>
                  </div>
                </div>

                {/* Daily Energy Section - Below the name */}
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-4 text-white flex-shrink-0">
                    <HeartPulse size={18} className="text-primary" />
                    <span className="font-bold text-lg">Life Stats</span>
                  </div>

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
              </>
            )}

            {/* CALENDAR VIEW */}
            {activeTab === "Calendar" && (
              <div className="md:col-span-3 grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Left Side: Calendar Control */}
                <div className="lg:col-span-3 card p-6 border border-border/50 shadow-sm bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl">
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

                  <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 max-w-[calc(100vw-3rem)] md:max-w-none">
                    <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-xl overflow-hidden min-w-[700px] md:min-w-0">
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
              <div className="md:col-span-3 flex flex-col gap-6">
                
                {/* View Toggles */}
                <div className="flex justify-start gap-2 bg-[#1A1A1A] border border-white/10 rounded-xl p-1 self-start">
                  <button onClick={() => setAnalysisView('graph')} className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${analysisView === 'graph' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>Graphs</button>
                  <button onClick={() => setAnalysisView('block')} className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${analysisView === 'block' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>Block Craft</button>
                </div>

                {analysisView === 'graph' ? (
                  <>
                    {/* Daily Task Performance Graph */}
                    <div className="card p-6 border border-border/50 shadow-sm bg-[#111111]/80 backdrop-blur-md rounded-2xl relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 relative z-10">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <Target size={20} className="text-primary" />
                          Daily Task Performance
                        </h2>
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded border border-primary/30 font-mono tracking-widest uppercase">{avgDailyPct}% Avg</span>
                      </div>
                      <div className="h-[300px] w-full min-w-0 relative z-10 overflow-x-auto overflow-y-hidden pb-4 md:pb-0 scrollbar-thin scrollbar-thumb-white/10 max-w-[calc(100vw-3rem)] md:max-w-none">
                        <div className="min-w-[600px] md:min-w-0 h-full">
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
                      <div className="h-[300px] w-full min-w-0 relative z-10 overflow-x-auto overflow-y-hidden pb-4 md:pb-0 scrollbar-thin scrollbar-thumb-white/10 max-w-[calc(100vw-3rem)] md:max-w-none">
                        <div className="min-w-[600px] md:min-w-0 h-full">
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
                  </>
                ) : (
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
                      <div className="flex md:flex-wrap gap-4 relative z-10 items-end justify-start md:justify-center h-[200px] overflow-x-auto pb-4 md:pb-0 scrollbar-thin scrollbar-thumb-white/10 max-w-[calc(100vw-3rem)] md:max-w-none">
                        {analysisData.map((data, idx) => (
                           <div key={`daily-${idx}`} className="flex flex-col items-center gap-2 flex-shrink-0">
                             <div className="w-8 sm:w-12 h-32 sm:h-40 bg-white/5 rounded-t-sm rounded-b-md border border-white/10 relative overflow-hidden flex flex-col justify-end shadow-inner">
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
                      <div className="flex md:flex-wrap gap-4 relative z-10 items-end justify-start md:justify-center h-[200px] overflow-x-auto pb-4 md:pb-0 scrollbar-thin scrollbar-thumb-white/10 max-w-[calc(100vw-3rem)] md:max-w-none">
                        {analysisData.map((data, idx) => (
                           <div key={`weekly-${idx}`} className="flex flex-col items-center gap-2 flex-shrink-0">
                             <div className="w-8 sm:w-12 h-32 sm:h-40 bg-white/5 rounded-t-sm rounded-b-md border border-white/10 relative overflow-hidden flex flex-col justify-end shadow-inner">
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
                <div className="flex justify-between items-center bg-[#0a0a0a] p-6 rounded-2xl border border-white/5 shadow-lg">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <Box className="text-primary" size={28} />
                      Mega Projects
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 tracking-wide">Manage overarching system directives and primary mission architectures.</p>
                  </div>
                  <button
                    onClick={() => setIsProjectModalOpen(true)}
                    className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary px-5 py-2.5 rounded-xl font-semibold tracking-wider text-sm transition-all"
                  >
                    <Plus size={18} />
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
              <div className="md:col-span-3 card p-8 sm:p-12 border border-border/50 shadow-sm flex flex-col items-center justify-center text-center">
                <User size={48} className="text-muted-foreground mb-4 opacity-50" />
                <h2 className="text-2xl font-bold mb-2">Subject Account</h2>
                <p className="text-muted-foreground mb-6">Identity logs locked. Awaiting biometric signature.</p>
                
                <div className="w-full max-w-4xl mt-4 bg-black/20 rounded-xl p-6 border border-white/5">
                  <h3 className="text-lg font-bold mb-6 text-left flex items-center gap-2">
                    <User size={18} className="text-primary" />
                    Avatar Profile
                  </h3>
                  
                  {/* Slider of all Avatar Images */}
                  <div className="flex overflow-x-auto gap-4 pb-4 snap-x scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {avatarImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Avatar ${idx}`}
                        className={`w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-xl cursor-pointer snap-center border-2 transition-all hover:scale-105 flex-shrink-0 ${customAvatar === img ? 'border-primary ring-2 ring-primary/30 opacity-100' : 'border-black/50 opacity-60 hover:opacity-100'}`}
                        onClick={() => setCustomAvatar(img)}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-4 w-full mt-6 mb-6">
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
                    className="flex justify-center items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium text-white transition-all cursor-pointer mx-auto"
                  >
                    <Camera size={16} />
                    <span>Upload Profile Photo</span>
                  </button>
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
    </div>
  );
}
