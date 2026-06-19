const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The messed up div syntax:
// <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, var(--app-bg-accent-20), var(--app-bg-accent-10), transparent)' }} opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
code = code.replace(/<div className="absolute inset-0" style=\{\{ backgroundImage: 'linear-gradient\(to right, var\(--app-bg-accent-20\), var\(--app-bg-accent-10\), transparent\)' \}\}\s*opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" \/>/g, 
  `<div className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, var(--app-bg-accent-20), var(--app-bg-accent-10), transparent)' }}></div>`
);

// Remove the `{enableOrangeBackgrounds && (`  and `)}`
code = code.replace(/\{enableOrangeBackgrounds && \(\s*<>\s*(<div [^>]+><\/div>)\s*(<div [^>]+>)?\s*<\/>\s*\)\}/g, function(match, d1, d2) {
   return d1 + (d2 ? '\n                      ' + d2 : '');
});

// the remaining button
let buttonRegex = /<button\s+onClick=\{\(\) => setEnableOrangeBackgrounds\(!enableOrangeBackgrounds\)\}[\s\S]*?<\/button>/g;
code = code.replace(buttonRegex, '');

fs.writeFileSync('src/App.tsx', code);
