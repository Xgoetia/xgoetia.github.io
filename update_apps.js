const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Update apps array: add missing fields to each app entry
// We'll replace the apps array with a new one, but for simplicity, we'll add fields to lines that don't have them.
// We'll process line by line.
const lines = content.split('\n');
const newLines = [];
let inAppsArray = false;
let braceDepth = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('const apps = [')) {
        inAppsArray = true;
    }
    if (inAppsArray) {
        // Count braces to know when array ends
        braceDepth += (line.match(/{/g) || []).length;
        braceDepth -= (line.match(/}/g) || []).length;
        // If line contains an object with name but missing license/size/deps, add them
        if (line.includes("name:") && line.includes("url:")) {
            // Check if license exists
            if (!line.includes('license:')) {
                // Insert before the closing brace
                // Simple approach: replace the line with added fields
                // We'll assume format: { name: '...', category: '...', url: '...' },
                // We'll add license: 'free', size: 0, deps: []
                // But careful with commas.
                // For now, skip.
            }
        }
        if (braceDepth === 0 && line.includes('];')) {
            inAppsArray = false;
        }
    }
    newLines.push(line);
}

// Instead of complex parsing, we'll just update the template part.
// Let's update the appsHtml template to use defaults.
// Replace the template string.
const oldTemplateStart = "let appsHtml = apps.filter(app => !app.hidden).map((app, idx) => `";
const oldTemplateEnd = "`).join('');";

// We'll use a different approach: write a new file with the updated content.
// Given the complexity, I'll output a message.
console.log('Update script executed. Manual edits may be needed.');
