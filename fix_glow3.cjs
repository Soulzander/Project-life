const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// fix line 189
code = code.replace(/<div className="absolute inset-0" style=\{\{ backgroundImage: 'linear-gradient\(to right, var\(--app-bg-accent-20\), var\(--app-bg-accent-10\), transparent\)' \}\}\s*opacity-50 group-hover:opacity-100 transition-opacity duration-700" \/>/g, '<div className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-700" style={{ backgroundImage: \'linear-gradient(to right, var(--app-bg-accent-20), var(--app-bg-accent-10), transparent)\' }} />');

// fix orange-400 to orange-600 gradients
code = code.replace(/bg-gradient-to-b from-orange-400 to-orange-600/g, 'bg-primary opacity-80');

fs.writeFileSync('src/App.tsx', code);
