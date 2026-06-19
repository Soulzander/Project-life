const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/shadow-\[0_0_8px_rgba\(255,106,0,0\.5\)\]/g, 'shadow-[0_0_8px_var(--app-bg-accent-30)]');
code = code.replace(/shadow-\[0_0_10px_rgba\(255,255,255,0\.3\)\]/g, 'shadow-[0_0_10px_var(--app-bg-accent-30)]');

// Handle the export object safely
code = code.replace(/\s*themeBackgrounds\n/g, '\n');

fs.writeFileSync('src/App.tsx', code);
