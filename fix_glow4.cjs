const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/stopColor="#ff6a00"/g, 'stopColor={appThemeColor}');
code = code.replace(/stroke="#ff6a00"/g, 'stroke={appThemeColor}');
code = code.replace(/fill: '#ff6a00'/g, 'fill: appThemeColor');

fs.writeFileSync('src/App.tsx', code);
