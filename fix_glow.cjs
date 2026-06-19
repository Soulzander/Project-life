const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove state
code = code.replace(/const\s+\[enableOrangeBackgrounds,\s*setEnableOrangeBackgrounds\]\s*=\s*useState\(\(\)\s*=>\s*\{[\s\S]*?return localStorage\.getItem\('app_orangeBgs'\) !== 'false';\s*\}\);\n/, '');
code = code.replace(/useEffect\(\(\)\s*=>\s*\{\n\s*localStorage\.setItem\('app_orangeBgs',\s*enableOrangeBackgrounds\.toString\(\)\);\n\s*\},\s*\[enableOrangeBackgrounds\]\);\n/, '');

// Remove toggle UI
code = code.replace(/<div className="flex items-center justify-between gap-4 mt-2 p-3 bg-\[#0a0a0a\] border border-white\/5 rounded-lg">\s*<div className="flex-1 min-w-0">\s*<p className="text-sm font-medium text-white truncate sm:whitespace-normal">Glow Highlights<\/p>[\s\S]*?<\/div>\s*<\/div>/, '');

// Process all group cards
code = code.replace(/className=\{`([^`]+) \$\{enableOrangeBackgrounds \? 'bg-orange-500\/10 border border-orange-500\/20' : 'bg-\[#0a0a0a\] border border-white\/5'\}`\}/g, "className=\"$1\" style={{ backgroundColor: 'var(--app-bg-accent-10)', borderColor: 'var(--app-bg-accent-20)', borderWidth: '1px' }}");

// Replace the {enableOrangeBackgrounds && ( ... )} wrapper
code = code.replace(/\{enableOrangeBackgrounds && \(\s*<>\s*(<div className="absolute inset-0 bg-gradient-to-r from-orange-500\/20 via-orange-500\/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" \/>)\s*(<div className="absolute top-0 right-0 w-64 h-64 bg-orange-500\/10 blur-3xl rounded-full translate-x-1\/2 -translate-y-1\/2 pointer-events-none" \/>)?\s*<\/>\s*\)\}/g, function(match, div1, div2) {
  let res = `<div className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, var(--app-bg-accent-20), var(--app-bg-accent-10), transparent)' }} />`;
  if (div2) {
      res += `\n                      <div className="absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ backgroundColor: 'var(--app-bg-accent-10)' }} />`;
  }
  return res;
});

// Other fixed orange usage
code = code.replace(/className="bg-orange-500\/10 border border-orange-500\/20 ([^"]+)"/g, "className=\"$1\" style={{ backgroundColor: 'var(--app-bg-accent-10)', borderColor: 'var(--app-bg-accent-20)', borderWidth: '1px' }}");
code = code.replace(/<div className="absolute inset-0 bg-gradient-to-r from-orange-500\/20 via-orange-500\/5 to-transparent/g, "<div className=\"absolute inset-0\" style={{ backgroundImage: 'linear-gradient(to right, var(--app-bg-accent-20), var(--app-bg-accent-10), transparent)' }}");
code = code.replace(/className="bg-orange-500\/20 border border-orange-500\/30 ([^"]+)"/g, "className=\"$1\" style={{ backgroundColor: 'var(--app-bg-accent-20)', borderColor: 'var(--app-bg-accent-30)', borderWidth: '1px' }}");
code = code.replace(/text-orange-500 fill-orange-500\/20/g, "text-primary opacity-80"); 
code = code.replace(/bg-orange-500\/20 hover:bg-orange-500\/30 text-orange-500 hover:text-orange-400/g, "bg-primary/20 hover:bg-primary/30 text-primary hover:opacity-80"); 
code = code.replace(/text-orange-500/g, "text-primary"); 
code = code.replace(/text-orange-50/g, "text-white"); 
code = code.replace(/bg-orange-500\/30/g, "bg-primary/30");
code = code.replace(/bg-orange-500\/10 hover:bg-orange-500\/20/g, "bg-primary/10 hover:bg-primary/20");
code = code.replace(/className="h-full bg-orange-500 shadow-\[0_0_8px_var\(--app-bg-accent-30\)\]"/g, "className=\"h-full bg-primary shadow-[0_0_8px_var(--app-bg-accent-30)]\"");

fs.writeFileSync('src/App.tsx', code);
console.log('Done script');
