import { Bell, Search, LayoutDashboard, Calendar, Settings, Activity, Target, Zap, Clock, MoreHorizontal, CheckSquare, Box, User, ChevronLeft, ChevronRight, Download, Camera } from 'lucide-react';
import mobileAvatarImg from '@/cyborg/777b13acf9d125805ada2364e9216c0d.jpg'; // Mobile
import tabletAvatarImg from '@/cyborg/553556133e97d93a1dc53b6fff803981.jpg'; // Tablet
import laptopAvatarImg from '@/cyborg/02615b7d22fb3978501cf67feacdb695.jpg'; // Laptop
import project1 from '@/cyborg/82635b6cc2cadb93ec555350059233b7.jpg';
import project2 from '@/cyborg/1ebefef99520a455674f5419bf8f87da.jpg';
import project3 from '@/cyborg/27f97e8deb90a90b603090c740b1aaa1.jpg';
import project4 from '@/cyborg/3e9d00754a6c915e7873a01e13692932.jpg';
import project5 from '@/cyborg/47b1af417438567812ad38e1a78ce0ea.jpg';
import bgImg1 from '@/background/c8ec7b58d3dd1f897adc3d8dffc960ad.jpg';
import bgImg2 from '@/background/2b05a657649c4892239ac28514e405df.jpg';
import { motion } from 'motion/react';
import { useEffect, useState, useRef } from 'react';

// Load all cyborg images to use in the avatar slider
const cyborgImageModules = import.meta.glob<{default: string}>('/cyborg/*.{jpg,jpeg,png}', { eager: true });
const cyborgImages = Object.values(cyborgImageModules).map(mod => mod.default);

export default function App() {
  const [bgIndex, setBgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Tasks");
  const bgs = [bgImg1, bgImg2];

  // Custom Avatar State
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomAvatar(imageUrl);
    }
  };

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

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

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgs.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen text-foreground flex w-full relative overflow-hidden bg-black">
      
      {/* Animated Fixed Backgrounds */}
      {bgs.map((bg, idx) => (
        <motion.div
          key={bg}
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bg})` }}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ 
            opacity: bgIndex === idx ? 1 : 0,
            scale: bgIndex === idx ? 1.05 : 1
          }}
          transition={{ 
            opacity: { duration: 3, ease: 'easeInOut' },
            scale: { duration: 20, ease: 'linear' }
          }}
        />
      ))}

      {/* Dimmed Overlay */}
      <div className="fixed inset-0 z-0 bg-black/20" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen w-full relative z-10 pt-6">

        {/* Dashboard Content Container */}
        <div className="px-6 pb-6 max-w-[1400px] mx-auto w-full flex-1 flex flex-col gap-6">
          
          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Unified Profile & Focus Metrics */}
            <div className="group bg-[#050505] rounded-xl p-0 md:col-span-3 grid grid-cols-12 border border-white/10 shadow-sm relative overflow-hidden items-center aspect-video">
              
              {/* Background Avatar Image with Gradient Mask */}
              <div 
                className="absolute inset-y-0 left-0 w-[80%] md:w-[70%] lg:w-[65%] z-0 pointer-events-none"
                style={{
                  WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 100%)',
                  maskImage: 'linear-gradient(to right, black 30%, transparent 100%)',
                }}
              >
                {customAvatar ? (
                  <img src={customAvatar} alt="Custom Profile" className="w-full h-full object-cover object-left opacity-100" />
                ) : (
                  <picture>
                    {/* Laptop Version (lg and up) */}
                    <source media="(min-width: 1024px)" srcSet={laptopAvatarImg} />
                    {/* Tablet Version (md to lg) */}
                    <source media="(min-width: 768px)" srcSet={tabletAvatarImg} />
                    {/* Mobile Version (default fallback) */}
                    <img 
                      src={mobileAvatarImg} 
                      alt="Aiden Vance" 
                      className="w-full h-full object-cover object-left opacity-100" 
                    />
                  </picture>
                )}
                {/* Optional dark overlay to ensure text legibility on top of the image */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
              </div>

              {/* Expanded User Profile Content */}
              <div className="relative z-10 col-span-8 lg:col-span-9 p-4 sm:p-6 md:p-10 flex flex-col justify-end min-h-full">
                <div className="mt-auto hidden sm:block">
                  <h3 className="font-bold text-2xl sm:text-5xl lg:text-6xl tracking-tight text-white mb-1 sm:mb-2 drop-shadow-md">Aiden Vance</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-primary font-bold uppercase tracking-[0.15em] mb-2 sm:mb-4 drop-shadow-md">Subject // Optima Prime</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-md text-[8px] sm:text-[10px] md:text-xs text-white font-semibold tracking-wide shadow-xl">Level 42 Sync</span>
                    <span className="px-2 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary rounded-md text-[8px] sm:text-[10px] md:text-xs font-semibold tracking-wide uppercase shadow-xl">Active Protocol</span>
                  </div>
                </div>
                {/* Mobile version of profile text to prevent clipping */}
                <div className="mt-auto sm:hidden">
                  <h3 className="font-bold text-xl tracking-tight text-white mb-1 drop-shadow-md">Aiden Vance</h3>
                  <p className="text-[8px] text-primary font-bold uppercase tracking-wider mb-2 drop-shadow-md">Subject // Optima Prime</p>
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="px-1.5 py-0.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-md text-[8px] text-white font-semibold tracking-wide shadow-xl">Lvl 42</span>
                    <span className="px-1.5 py-0.5 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary rounded-md text-[8px] font-semibold tracking-wide uppercase shadow-xl">Active</span>
                  </div>
                </div>
              </div>

              {/* Quick Metrics - Vertical Column on All Devices */}
              <div className="relative z-10 col-span-4 lg:col-span-3 flex flex-col gap-2 sm:gap-4 md:gap-8 p-3 sm:p-6 md:p-10 w-full border-l border-white/10 bg-transparent items-end justify-center h-full">
                <div className="flex flex-col gap-0.5 sm:gap-1 items-end text-right">
                  <span className="text-[8px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider text-muted-foreground drop-shadow-md">Focus</span>
                  <span className="text-xl sm:text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-lg">24.5<span className="hidden sm:inline text-xs sm:text-sm md:text-base text-primary font-bold ml-1 sm:ml-2 align-middle drop-shadow-none">↑ 12%</span></span>
                </div>
                <div className="flex flex-col gap-0.5 sm:gap-1 items-end text-right">
                  <span className="text-[8px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider text-muted-foreground drop-shadow-md">Tasks</span>
                  <span className="text-xl sm:text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-lg">14<span className="hidden sm:inline text-xs sm:text-sm md:text-base text-primary font-bold ml-1 sm:ml-2 align-middle drop-shadow-none">↑ 3%</span></span>
                </div>
                <div className="flex flex-col gap-0.5 sm:gap-1 items-end text-right">
                  <span className="text-[8px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider text-muted-foreground drop-shadow-md">Health</span>
                  <span className="text-xl sm:text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-lg">98%<span className="hidden md:inline text-[10px] md:text-xs text-muted-foreground ml-2 align-middle font-bold uppercase tracking-wider border border-white/10 px-1 py-0.5 rounded drop-shadow-none bg-black/30">Optimal</span></span>
                </div>
              </div>
            </div>

            {/* Quick Action Pop-up Buttons (Memory Matrix Style) */}
            <div className="md:col-span-3 flex flex-wrap gap-3">
              {[
                { icon: CheckSquare, label: "Tasks" },
                { icon: Calendar, label: "Calendar" },
                { icon: Activity, label: "Analysis" },
                { icon: Box, label: "Mega Space" },
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
                {/* Active Projects Gallery */}
                <div className="md:col-span-2 card p-6 border border-border/50 flex flex-col gap-6 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Active Enhancements</h2>
                    <button className="text-sm text-primary hover:underline">View All</button>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { img: project1, name: "Neural Link", status: "Active" },
                      { img: project2, name: "Optical Sync", status: "Review" },
                      { img: project3, name: "Motor Control", status: "Planning" },
                    ].map((p, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="group relative rounded-xl overflow-hidden aspect-video cursor-pointer border border-border/50"
                      >
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                          <span className="text-sm font-medium">{p.name}</span>
                          <span className="text-xs text-primary">{p.status}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tasks List */}
                <div className="card p-6 border border-border/50 shadow-sm flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Daily Directives</h2>
                    <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal size={18} /></button>
                  </div>
                  <div className="flex flex-col gap-4 flex-1">
                    {[
                      { title: "Review telemetry logs", time: "10:00 AM", done: true },
                      { title: "Calibrate optical sensors", time: "11:30 AM", done: false },
                      { title: "Update firmware OS", time: "02:00 PM", done: false },
                      { title: "Deep sleep cycle", time: "10:00 PM", done: false },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${t.done ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                          {t.done && <span className="w-2 h-2 bg-white rounded-sm"></span>}
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm ${t.done ? 'line-through text-muted-foreground' : 'text-foreground font-medium'}`}>{t.title}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={12} /> {t.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Memory Bank (Gallery span) */}
                <div className="md:col-span-3 card p-6 border border-border/50 shadow-sm pt-8 pb-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                    <h2 className="text-lg font-semibold">Memory Matrix</h2>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-primary text-white text-xs rounded-full font-medium">Classified</button>
                      <button className="px-3 py-1 border border-border text-muted-foreground hover:text-foreground text-xs rounded-full font-medium transition-colors">Public</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {[project1, project2, project3, project4, project5].map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-border/50 cursor-pointer">
                        <img src={img} alt="Memory Log" className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* CALENDAR VIEW */}
            {activeTab === "Calendar" && (
              <div className="md:col-span-3 card p-6 border border-border/50 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Temporal Logs</h2>
                  <div className="flex items-center gap-4">
                    <button onClick={prevMonth} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-lg font-semibold w-40 text-center uppercase tracking-widest text-primary">
                      {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={nextMonth} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden">
                  {/* Days Header */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="bg-black/60 p-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-md">
                      {day}
                    </div>
                  ))}
                  
                  {/* Empty Days Before */}
                  {Array.from({ length: getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-black/40 min-h-[100px] p-2 backdrop-blur-md"></div>
                  ))}

                  {/* Calendar Days */}
                  {Array.from({ length: getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => {
                    const day = i + 1;
                    const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
                    // Just some dummy data to populate the calendar visually
                    const hasEvent = day % 7 === 0;
                    const hasTask = day % 4 === 0;

                    return (
                      <div key={day} className={`bg-black/60 min-h-[100px] p-3 backdrop-blur-md hover:bg-white/5 transition-colors group relative ${isToday ? 'ring-inset ring-2 ring-primary' : ''}`}>
                        <span className={`text-sm font-bold ${isToday ? 'text-primary' : 'text-muted-foreground group-hover:text-white'}`}>
                          {day}
                        </span>
                        
                        <div className="mt-2 flex flex-col gap-1">
                          {hasEvent && <div className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/30 truncate">System Audit</div>}
                          {hasTask && <div className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 truncate">Log Sync</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PLACEHOLDERS FOR OTHER VIEWS */}
            {activeTab === "Analysis" && (
              <div className="md:col-span-3 card p-12 border border-border/50 shadow-sm flex flex-col items-center justify-center text-center">
                <Activity size={48} className="text-muted-foreground mb-4 opacity-50" />
                <h2 className="text-2xl font-bold mb-2">Analysis Engine</h2>
                <p className="text-muted-foreground">Biometric and telemetry data parsing is currently offline.</p>
              </div>
            )}

            {activeTab === "Mega Space" && (
              <div className="md:col-span-3 card p-12 border border-border/50 shadow-sm flex flex-col items-center justify-center text-center">
                <Box size={48} className="text-muted-foreground mb-4 opacity-50" />
                <h2 className="text-2xl font-bold mb-2">Mega Space Environment</h2>
                <p className="text-muted-foreground">Virtual staging area is preparing geometry...</p>
              </div>
            )}

            {activeTab === "Account" && (
              <div className="md:col-span-3 card p-8 sm:p-12 border border-border/50 shadow-sm flex flex-col items-center justify-center text-center">
                <User size={48} className="text-muted-foreground mb-4 opacity-50" />
                <h2 className="text-2xl font-bold mb-2">Subject Account</h2>
                <p className="text-muted-foreground mb-6">Identity logs locked. Awaiting biometric signature.</p>
                
                <div className="w-full max-w-4xl mt-4 bg-black/20 rounded-xl p-6 border border-white/5">
                  <h3 className="text-lg font-semibold mb-6 text-left flex items-center gap-2">
                    <User size={18} className="text-primary" />
                    Avatar Profile
                  </h3>
                  
                  {/* Slider of all Cyborg Images */}
                  <div className="flex overflow-x-auto gap-4 pb-4 snap-x scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {cyborgImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Avatar ${idx}`}
                        className={`w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-xl cursor-pointer snap-center border-2 transition-all hover:scale-105 flex-shrink-0 ${customAvatar === img ? 'border-primary ring-2 ring-primary/30 opacity-100' : 'border-black/50 opacity-60 hover:opacity-100'}`}
                        onClick={() => setCustomAvatar(img)}
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
    </div>
  );
}
