const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove themeBackground state
code = code.replace(/const\s+\[themeBackgrounds,\s*setThemeBackgrounds\]\s*=\s*useState\(\(\)\s*=>\s*\{[\s\S]*?return localStorage\.getItem\('app_themeBackgrounds'\) === 'true';\s*\}\);\n/g, '');

// 2. Remove useEffect for themeBackgrounds
code = code.replace(/useEffect\(\(\) => \{\n\s*localStorage\.setItem\('app_themeBackgrounds', themeBackgrounds\.toString\(\)\);\n\s*\}, \[themeBackgrounds\]\);\n/g, '');

// 3. Remove from export data
code = code.replace(/\s*themeBackgrounds,\n/g, '\n');
code = code.replace(/\s*if \(data\.themeBackgrounds !== undefined\) setThemeBackgrounds\(data\.themeBackgrounds\);\n/g, '\n');

// 4. Remove inline themeBackgrounds conditionals for classNames
code = code.replace(/\$\{themeBackgrounds \? 'border-transparent' : '([^']+)'\}/g, '$1');
code = code.replace(/\$\{themeBackgrounds \? 'border-transparent' : "([^"]+)"\}/g, '$1');

// 5. Hardcode styles for the themeBackground replacements
code = code.replace(/style=\{themeBackgrounds \? \{[^}]*boxShadow:\s*`?[^`}]*`?[^}]*\}\s*:\s*(\{?\s*\}?|undefined)\}/g, "style={{ boxShadow: '0 0 15px var(--app-bg-accent-20)', borderColor: 'var(--app-bg-accent-30)' }}");

// Fix remaining themeBackgrounds
code = code.replace(/themeBackgrounds \?/g, "false ?"); // Fallback
code = code.replace(/,\s*themeBackgrounds\s*\}/g, '}'); 
code = code.replace(/themeBackgrounds,/g, ''); 

// 6. Fix glow shadows to use system accent
code = code.replace(/shadow-\[0_0_15px_rgba\(249,115,22,0\.2\)\]/g, 'shadow-[0_0_15px_var(--app-bg-accent-20)]');
code = code.replace(/shadow-\[0_0_20px_rgba\(255,106,0,0\.25\)\]/g, 'shadow-[0_0_20px_var(--app-bg-accent-30)]');
code = code.replace(/shadow-\[0_0_15px_rgba\(168,85,247,0\.1\)\]/g, 'shadow-[0_0_15px_var(--app-bg-accent-10)]');
code = code.replace(/shadow-\[0_0_8px_rgba\(239,68,68,0\.8\)\]/g, 'shadow-[0_0_8px_var(--app-bg-accent)]');
code = code.replace(/shadow-\[0_0_8px_rgba\(239,68,68,1\)\]/g, 'shadow-[0_0_8px_var(--app-bg-accent)]');
code = code.replace(/shadow-\[0_0_8px_rgba\(239,68,68,0\.5\)\]/g, 'shadow-[0_0_8px_var(--app-bg-accent-30)]');
code = code.replace(/shadow-\[0_0_8px_rgba\(34,197,94,0\.5\)\]/g, 'shadow-[0_0_8px_var(--app-bg-accent-30)]');
code = code.replace(/shadow-\[0_0_15px_rgba\(255,106,0,0\.3\)\]/g, 'shadow-[0_0_15px_var(--app-bg-accent-30)]');
code = code.replace(/shadow-\[0_0_8px_rgba\(249,115,22,0\.6\)\]/g, 'shadow-[0_0_8px_var(--app-bg-accent-30)]');
code = code.replace(/shadow-\[0_0_10px_rgba\(255,255,255,0\.05\)\]/g, 'shadow-[0_0_10px_var(--app-bg-accent-10)]');
code = code.replace(/shadow-\[0_0_10px_rgba\(255,255,255,0\.3\)\]/g, 'shadow-[0_0_10px_var(--app-bg-accent)]');
code = code.replace(/shadow-\[0_0_8px_rgba\(249,115,22,0\.15\)\]/g, 'shadow-[0_0_8px_var(--app-bg-accent-20)]');
code = code.replace(/shadow-\[0_0_15px_rgba\(255,106,0,0\.2\)\]/g, 'shadow-[0_0_15px_var(--app-bg-accent-20)]');
code = code.replace(/shadow-\[0_0_8px_rgba\(255,106,0,0\.5\)\]/g, 'shadow-[0_0_8px_var(--app-bg-accent-30)]');

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx transformed successfully.');
