const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const s1 = `<div className="space-y-6">
                   {/* Operative Alias Box */}`;
const startIndex = code.indexOf(s1);

const endStr = '              </div>\n            )}\n\n          </div>\n        </div>\n      </main>\n\n\n      {/* View Events Modal */}';
const endIndex = code.indexOf(endStr);

if (startIndex === -1) {
  console.log("Could not find start index");
  process.exit(1);
}
if (endIndex === -1) {
  console.log("Could not find end index");
  process.exit(1);
}

const newAccountContent = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* LEFT COL: IDENTITY */}
                  <div className="flex flex-col gap-6 lg:col-span-1">
                    {/* Operative Alias Box */}
                    <div 
                      className="card p-6 border shadow-sm flex flex-col transition-all duration-500 rounded-2xl relative overflow-hidden bg-[#050505] border-border/50 block"
                      style={{ boxShadow: '0 0 15px var(--app-bg-accent-20)', borderColor: 'var(--app-bg-accent-30)' }}
                    >
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

                    {/* Avatar / Identity Selection */}
                    <div 
                      className="card p-6 border shadow-sm flex flex-col transition-all duration-500 rounded-2xl relative bg-[#050505] border-border/50 block"
                      style={{ boxShadow: '0 0 15px var(--app-bg-accent-20)', borderColor: 'var(--app-bg-accent-30)' }}
                    >
                       <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-white">
                         <Camera size={18} className="text-primary" />
                         Visual Identifier
                       </h3>
                       <p className="text-xs text-muted-foreground mb-4">
                         Select a profile picture and customize the focus area.
                       </p>

                       <div className="flex flex-col items-center justify-center gap-4 py-2">
                          <div 
                            className={\`relative w-32 h-32 rounded-xl border border-primary/40 bg-black/50 overflow-hidden shadow-[0_0_15px_var(--app-bg-accent-20)] flex items-center justify-center select-none touch-none \${customAvatar ? 'cursor-grab active:cursor-grabbing border-primary' : 'cursor-default'}\`}
                            onPointerDown={(e) => {
                              if (!customAvatar) return;
                              e.preventDefault();
                              e.currentTarget.setPointerCapture(e.pointerId);
                              const startX = e.clientX;
                              const startY = e.clientY;
                              const initialX = avatarX;
                              const initialY = avatarY;
                              
                              const onPointerMove = (moveEvt) => {
                                const dx = moveEvt.clientX - startX;
                                const dy = moveEvt.clientY - startY;
                                setAvatarX(Math.max(-150, Math.min(150, initialX + dx)));
                                setAvatarY(Math.max(-150, Math.min(150, initialY + dy)));
                              };
                              
                              const onPointerUp = () => {
                                window.removeEventListener('pointermove', onPointerMove);
                                window.removeEventListener('pointerup', onPointerUp);
                              };
                              
                              window.addEventListener('pointermove', onPointerMove);
                              window.addEventListener('pointerup', onPointerUp);
                            }}
                            onWheel={(e) => {
                              if (!customAvatar) return;
                              const delta = -e.deltaY * 0.003;
                              setAvatarScale((prev) => Math.max(1.0, Math.min(4.0, prev + delta)));
                            }}
                          >
                            {customAvatar ? (
                              <img 
                                src={customAvatar} 
                                alt="Profile Preview" 
                                className="w-full h-full object-cover transition-transform origin-center select-none pointer-events-none"
                                style={{ transform: \`scale(\${avatarScale}) translate(\${avatarX}px, \${avatarY}px)\` }}
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 p-4">
                                <User size={36} className="text-white/10 mb-2 animate-pulse" />
                                <span className="text-center text-[9px] tracking-wider uppercase font-semibold">No custom image</span>
                              </div>
                            )}
                            {customAvatar && (
                              <>
                                <div className="absolute inset-1.5 border border-dashed border-primary/40 pointer-events-none rounded-lg" />
                                <div className="absolute inset-x-0 inset-y-0 border-2 border-primary pointer-events-none rounded-xl">
                                  <div className="absolute top-1 left-2 text-[8px] bg-primary/20 text-primary px-1 rounded uppercase tracking-wider font-mono">Visible Crop</div>
                                </div>
                              </>
                            )}
                          </div>

                          {customAvatar && (
                            <span className="text-[9px] text-primary/70 font-mono tracking-widest uppercase animate-pulse mt-2 text-center">
                              ↔↕ DRAG IMAGE TO ADJUST • SCROLL TO ZOOM
                            </span>
                          )}
                        </div>

                        <div className="w-full mt-4">
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
                            <Upload size={14} className="text-primary" />
                            <span>{customAvatar ? "Choose Different Image" : "Select from device"}</span>
                          </button>
                        </div>

                       {customAvatar && (
                         <div className="bg-black/35 border border-white/5 rounded-xl p-4 space-y-4 mt-6">
                           <div className="flex justify-between items-center border-b border-white/5 pb-3">
                             <span className="text-[10px] font-mono text-primary/80 uppercase tracking-widest font-bold flex items-center gap-1.5">
                               <GripVertical size={12} className="text-primary animate-pulse" />
                               Crop / Adjust Position
                             </span>
                             <button
                               onClick={() => {
                                 setAvatarScale(1.0);
                                 setAvatarX(0);
                                 setAvatarY(0);
                               }}
                               className="text-[10px] text-muted-foreground/80 hover:text-white font-mono uppercase tracking-wider underline underline-offset-2 transition-colors cursor-pointer"
                             >
                               Reset View
                             </button>
                           </div>

                           <div className="space-y-1">
                             <div className="flex justify-between text-[10px] font-mono text-muted-foreground/80">
                               <span>ZOOM / SCALE</span>
                               <span className="text-primary font-bold">{Math.round(avatarScale * 100)}%</span>
                             </div>
                             <input 
                               type="range"
                               min="1"
                               max="3"
                               step="0.05"
                               value={avatarScale}
                               onChange={(e) => setAvatarScale(parseFloat(e.target.value))}
                               className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                             />
                           </div>

                           <div className="space-y-1 mt-2">
                             <div className="flex justify-between text-[10px] font-mono text-muted-foreground/80">
                               <span>HORIZONTAL OFFSET</span>
                               <span className="text-primary font-bold">{avatarX}px</span>
                             </div>
                             <input 
                               type="range"
                               min="-100"
                               max="100"
                               step="1"
                               value={avatarX}
                               onChange={(e) => setAvatarX(parseInt(e.target.value))}
                               className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                             />
                           </div>

                           <div className="space-y-1 mt-2">
                             <div className="flex justify-between text-[10px] font-mono text-muted-foreground/80">
                               <span>VERTICAL OFFSET</span>
                               <span className="text-primary font-bold">{avatarY}px</span>
                             </div>
                             <input 
                               type="range"
                               min="-100"
                               max="100"
                               step="1"
                               value={avatarY}
                               onChange={(e) => setAvatarY(parseInt(e.target.value))}
                               className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                             />
                           </div>
                         </div>
                       )}
                    </div>
                  </div>

                  {/* MIDDLE COL: SYSTEM BEHAVIORS */}
                  <div className="flex flex-col gap-6 lg:col-span-1">
                    <div 
                      className="card p-6 border shadow-sm flex flex-col gap-5 transition-all duration-500 rounded-2xl relative overflow-hidden bg-[#050505] border-border/50 h-full"
                      style={{ boxShadow: '0 0 15px var(--app-bg-accent-20)', borderColor: 'var(--app-bg-accent-30)' }}
                    >
                       <h3 className="text-lg font-bold flex items-center gap-2 text-white pb-2 border-b border-white/5">
                         <Settings size={18} className="text-primary" />
                         System Behaviors
                       </h3>
                       
                       <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.04]">
                          <div>
                             <p className="text-sm font-medium text-white">Telemetry Broadcasts</p>
                             <p className="text-xs text-muted-foreground mt-0.5">Receive system status updates</p>
                          </div>
                          <button 
                            onClick={() => setNotifications(!notifications)}
                            className={\`w-11 h-6 rounded-full transition-colors relative shrink-0 \${notifications ? 'bg-primary' : 'bg-white/10'}\`}
                          >
                            <div className={\`w-4 h-4 rounded-full bg-white absolute top-1 transition-all \${notifications ? 'right-1' : 'left-1'}\`}></div>
                          </button>
                       </div>

                       <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.04]">
                          <div>
                             <p className="text-sm font-medium text-white">Quote of the Day</p>
                             <p className="text-xs text-muted-foreground mt-0.5">Toggle daily motivation box</p>
                          </div>
                          <button 
                            onClick={() => setShowQuoteBox(!showQuoteBox)}
                            className={\`w-11 h-6 rounded-full transition-colors relative shrink-0 \${showQuoteBox ? 'bg-primary' : 'bg-white/10'}\`}
                          >
                            <div className={\`w-4 h-4 rounded-full bg-white absolute top-1 transition-all \${showQuoteBox ? 'right-1' : 'left-1'}\`}></div>
                          </button>
                       </div>

                       <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.04]">
                          <div>
                             <p className="text-sm font-medium text-white">Profile & Life Stats</p>
                             <p className="text-xs text-muted-foreground mt-0.5">Toggle dashboard header stats</p>
                          </div>
                          <button 
                            onClick={() => setShowProfileAndStats(!showProfileAndStats)}
                            className={\`w-11 h-6 rounded-full transition-colors relative shrink-0 \${showProfileAndStats ? 'bg-primary' : 'bg-white/10'}\`}
                          >
                            <div className={\`w-4 h-4 rounded-full bg-white absolute top-1 transition-all \${showProfileAndStats ? 'right-1' : 'left-1'}\`}></div>
                          </button>
                       </div>

                       <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.04]">
                          <div>
                             <p className="text-sm font-medium text-white">Navigation Labels</p>
                             <p className="text-xs text-muted-foreground mt-0.5">Show text labels next to tab icons</p>
                          </div>
                          <button 
                            onClick={() => setShowTabLabels(!showTabLabels)}
                            className={\`w-11 h-6 rounded-full transition-colors relative shrink-0 \${showTabLabels ? 'bg-primary' : 'bg-white/10'}\`}
                          >
                            <div className={\`w-4 h-4 rounded-full bg-white absolute top-1 transition-all \${showTabLabels ? 'right-1' : 'left-1'}\`}></div>
                          </button>
                       </div>

                       <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl transition-all hover:bg-white/[0.04]">
                         <div className="flex-1 min-w-0 pr-4">
                           <p className="text-sm font-medium text-white truncate sm:whitespace-normal">Snowfall Effect</p>
                           <p className="text-xs text-muted-foreground mt-0.5 truncate sm:whitespace-normal">Enable decorative snowfall overlay</p>
                         </div>
                         <button 
                           onClick={() => setEnableSnowfall(!enableSnowfall)}
                           className={\`w-11 h-6 rounded-full transition-colors relative shrink-0 \${enableSnowfall ? 'bg-primary' : 'bg-white/10'}\`}
                         >
                           <div className={\`w-4 h-4 rounded-full bg-white absolute top-1 transition-all \${enableSnowfall ? 'right-1' : 'left-1'}\`}></div>
                         </button>
                       </div>

                    </div>
                  </div>

                  {/* RIGHT COL: AESTHETICS & DATA */}
                  <div className="flex flex-col gap-6 lg:col-span-1">
                    <div 
                      className="card p-6 border shadow-sm flex flex-col gap-6 transition-all duration-500 rounded-2xl relative overflow-hidden bg-[#050505] border-border/50"
                      style={{ boxShadow: '0 0 15px var(--app-bg-accent-20)', borderColor: 'var(--app-bg-accent-30)' }}
                    >
                       <h3 className="text-lg font-bold flex items-center gap-2 text-white pb-2 border-b border-white/5">
                         <LayoutGrid size={18} className="text-primary" />
                         Aesthetics
                       </h3>
                       
                       <div className={\`flex flex-col gap-4 p-5 rounded-xl border transition-all duration-300 \${appBackgroundColor !== appThemeColor ? 'bg-white/[0.04] border-white/20' : 'bg-white/[0.02] border-white/5'}\`}>
                         <div className="flex items-center justify-between gap-4 w-full">
                            <div className="flex-1 min-w-0">
                               <p className="text-sm font-medium text-white truncate sm:whitespace-normal">System Glow</p>
                               <p className="text-[11px] text-muted-foreground mt-1 truncate sm:whitespace-normal">Ambient background tint</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <label className="w-10 h-10 rounded-lg cursor-pointer border border-white/10 p-0 overflow-hidden relative shadow-lg">
                                <input 
                                  type="color" 
                                  value={appBackgroundColor}
                                  onChange={(e) => setAppBackgroundColor(e.target.value)}
                                  className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer border-0 bg-transparent"
                                />
                              </label>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-2 pt-3 border-t border-white/5 flex-wrap">
                           {['#ff6a00', '#2EDC85', '#32C759', '#0AFFFF', '#6366f1', '#ec4899', '#14F195', '#00ff00'].map((color) => (
                             <button
                               key={color}
                               onClick={() => setAppBackgroundColor(color)}
                               className={\`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 shrink-0 \${appBackgroundColor === color ? 'border-white scale-110 shadow-[0_0_10px_var(--app-bg-accent)]' : 'border-transparent'}\`}
                               style={{ backgroundColor: color }}
                               title={color}
                             />
                           ))}
                           <button 
                             onClick={() => setAppBackgroundColor(appThemeColor)}
                             className="text-[10px] font-mono text-muted-foreground hover:text-white transition-all ml-auto underline whitespace-nowrap pt-1 uppercase tracking-wider"
                           >
                             Sync Root
                           </button>
                         </div>
                       </div>

                       <div className="flex flex-col gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/5">
                         <div className="flex items-center justify-between">
                            <div>
                               <p className="text-sm font-medium text-white">System Protocol</p>
                               <p className="text-[11px] text-muted-foreground mt-1">Core primary spectrum</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <label className="w-10 h-10 rounded-lg cursor-pointer border border-white/10 p-0 overflow-hidden relative shadow-lg">
                                <input 
                                  type="color" 
                                  value={appThemeColor}
                                  onChange={(e) => setAppThemeColor(e.target.value)}
                                  className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer border-0 bg-transparent"
                                />
                              </label>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-2 pt-3 border-t border-white/5 flex-wrap">
                           {['#ff6a00', '#2EDC85', '#32C759', '#0AFFFF', '#6366f1', '#ec4899', '#14F195', '#00ff00'].map((color) => (
                             <button
                               key={color}
                               onClick={() => setAppThemeColor(color)}
                               className={\`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 \${appThemeColor === color ? 'border-white scale-110 shadow-[0_0_10px_var(--app-bg-accent)]' : 'border-transparent'}\`}
                               style={{ backgroundColor: color }}
                               title={color}
                             />
                           ))}
                         </div>
                       </div>
                    </div>

                    <div 
                      className="card p-6 border shadow-sm flex flex-col gap-4 transition-all duration-500 rounded-2xl relative overflow-hidden bg-[#050505] border-border/50"
                      style={{ boxShadow: '0 0 15px var(--app-bg-accent-20)', borderColor: 'var(--app-bg-accent-30)' }}
                    >
                       <h3 className="text-lg font-bold flex items-center gap-2 text-white pb-2 border-b border-white/5">
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
                           className="flex items-center justify-center gap-2 w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:text-white transition-all text-sm font-bold tracking-wide text-white/90 shadow-sm"
                          >
                            <Upload size={16} className="text-primary" /> Ingest Data
                          </button>
                          <button 
                           onClick={exportData}
                           className="flex items-center justify-center gap-2 w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:text-white transition-all text-sm font-bold tracking-wide text-white/90 shadow-sm"
                          >
                            <Download size={16} className="text-primary" /> Extract Data
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>


      {/* View Events Modal */}`;

const finalCode = code.substring(0, startIndex) + newAccountContent + code.substring(endIndex + endStr.length);

fs.writeFileSync('src/App.tsx', finalCode);
console.log("Account tab redesigned!");
