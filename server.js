const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// NSIS path
const NSIS_PATH = 'C:\\Program Files (x86)\\NSIS\\makensis.exe';
const NSIS_ALT = 'C:\\Program Files\\NSIS\\makensis.exe';

function findNSIS() {
    if (fs.existsSync(NSIS_PATH)) return NSIS_PATH;
    if (fs.existsSync(NSIS_ALT)) return NSIS_ALT;
    try {
        execSync('makensis /?', { stdio: 'ignore' });
        return 'makensis';
    } catch (e) {
        return null;
    }
}

// Download helper
function downloadFile(fileUrl, outputPath) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(fileUrl);
        const protocol = parsedUrl.protocol === 'https:' ? https : http;
        
        protocol.get(fileUrl, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                return downloadFile(response.headers.location, outputPath)
                    .then(resolve).catch(reject);
            }
            
            if (response.statusCode !== 200) {
                return reject(new Error(`Download failed: ${response.statusCode}`));
            }
            
            const fileStream = fs.createWriteStream(outputPath);
            response.pipe(fileStream);
            
            fileStream.on('finish', () => {
                fileStream.close();
                resolve(outputPath);
            });
            
            fileStream.on('error', reject);
        }).on('error', reject);
    });
}

// Bundle API
app.post('/api/bundle', async (req, res) => {
    try {
        const { apps } = req.body;
        
        if (!apps || !Array.isArray(apps) || apps.length === 0) {
            return res.status(400).json({ error: 'No apps provided' });
        }

        console.log(`\n🚀 Creating bundle with ${apps.length} apps...`);

        const bundleId = Date.now().toString();
        const workDir = path.join(__dirname, 'temp', bundleId);
        fs.mkdirSync(workDir, { recursive: true });

        // Download installers
        console.log('📥 Downloading installers...');
        const downloadedFiles = [];
        
        for (const app of apps) {
            try {
                const fileName = app.url.split('/').pop() || `${app.name}.exe`;
                const outputPath = path.join(workDir, fileName);
                
                console.log(`  ⬇️  ${app.name}...`);
                await downloadFile(app.url, outputPath);
                downloadedFiles.push({ name: app.name, path: outputPath, fileName });
                console.log(`     ✅ ${fileName}`);
            } catch (err) {
                console.error(`     ❌ Failed: ${err.message}`);
            }
        }

        if (downloadedFiles.length === 0) {
            return res.status(500).json({ error: 'No files downloaded' });
        }

        // Create NSIS script
        let fileEntries = '';
        let execEntries = '';
        
        downloadedFiles.forEach(f => {
            const p = f.path.replace(/\\/g, '\\\\');
            fileEntries += `    File "${p}"\n`;
            
            const ext = path.extname(f.fileName).toLowerCase();
            if (ext === '.exe') {
                execEntries += `    ExecWait '"$INSTDIR\\\\${f.fileName}" /SILENT /VERYSILENT /SUPPRESSMSGBOXES /NORESTART'\n`;
            } else if (ext === '.msi') {
                execEntries += `    ExecWait 'msiexec.exe /i "$INSTDIR\\\\${f.fileName}" /qn /norestart'\n`;
            } else {
                execEntries += `    ; ${f.name} - manual install required\n`;
            }
        });
        
        const outFile = path.join(workDir, 'XGoetia-Bundle.exe').replace(/\\/g, '\\\\');
        const nsisScript = `
; XGoetia Bundle Installer
OutFile "${outFile}"
InstallDir "$PROGRAMFILES64\\XGoetiaBundle"
RequestExecutionLevel admin
SetCompressor lzma

Page directory
Page instfiles

Section "Install"
    SetOutPath "$INSTDIR"
${fileEntries}
${execEntries}
    
    WriteUninstaller "$INSTDIR\\uninstall.exe"
SectionEnd

Section "Uninstall"
    Delete "$INSTDIR\\uninstall.exe"
    RMDir "$INSTDIR"
SectionEnd
`;

        const nsisScriptPath = path.join(workDir, 'installer.nsi');
        fs.writeFileSync(nsisScriptPath, nsisScript);

        // Compile with NSIS
        const nsisExe = findNSIS();
        let exePath = null;

        if (nsisExe) {
            console.log('📦 Compiling NSIS installer...');
            try {
                const compile = spawn(nsisExe, [nsisScriptPath], { cwd: workDir, stdio: 'inherit' });
                
                await new Promise((resolve, reject) => {
                    compile.on('close', (code) => {
                        if (code === 0) {
                            exePath = path.join(workDir, 'XGoetia-Bundle.exe');
                            console.log('✅ NSIS installer created!');
                            resolve();
                        } else {
                            reject(new Error(`NSIS compile failed: ${code}`));
                        }
                    });
                });
            } catch (err) {
                console.error('NSIS error:', err.message);
            }
        }

        if (!exePath) {
            console.log('⚠️  NSIS not available, creating batch installer...');
            let batchContent = '@echo off\necho XGoetia Bundle Installer\necho ============================\n';
            downloadedFiles.forEach(f => {
                batchContent += `start /wait "" "${f.fileName}" /SILENT\n`;
            });
            batchContent += 'echo Installation complete!\npause';
            
            const batchPath = path.join(workDir, 'XGoetia-Bundle.bat');
            fs.writeFileSync(batchPath, batchContent);
            exePath = batchPath;
        }

        // Move to downloadable location
        const ext = path.extname(exePath);
        const finalName = `xgoetia-bundle-${bundleId}${ext}`;
        const finalPath = path.join(__dirname, 'temp', finalName);
        fs.copyFileSync(exePath, finalPath);

        console.log(`✅ Bundle ready: ${finalName}\n`);

        return res.json({
            success: true,
            downloadUrl: `/temp/${finalName}`,
            appCount: apps.length,
            type: ext === '.exe' ? 'NSIS Installer' : 'Batch Script'
        });

    } catch (error) {
        console.error('Bundle Error:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Serve temp files
app.use('/temp', express.static(path.join(__dirname, 'temp')));

// SEO Analysis API
app.get('/api/seo', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).json({ error: 'URL required' });
    try {
        const parsed = new URL(targetUrl);
        const start = Date.now();
        const resp = await fetch(targetUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
        const time = ((Date.now() - start) / 1000).toFixed(1) + 's';
        res.json({
            status: resp.status + ' ' + resp.statusText,
            server: resp.headers.get('server') || resp.headers.get('x-powered-by') || 'Bilinmiyor',
            ssl: parsed.protocol === 'https:',
            time,
            contentType: resp.headers.get('content-type') || '?',
            url: targetUrl
        });
    } catch (e) {
        res.json({ status: 'Hata', server: '-', ssl: false, time: '-', error: e.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    const nsisAvailable = findNSIS() !== null;
    res.json({ 
        status: 'ok', 
        version: '3.0.0', 
        nsis: nsisAvailable ? 'available' : 'not found',
        message: nsisAvailable ? 'Ready to create .exe bundles' : 'NSIS not installed - will use batch fallback'
    });
});

app.listen(PORT, () => {
    const nsisAvailable = findNSIS() !== null;
    console.log(`\n🚀 XGoetia Unified Server v3.0 started!`);
    console.log(`   URL: http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   NSIS: ${nsisAvailable ? '✅ Available' : '❌ Not found (will use fallback)'}`);
    console.log(`   Temp: ${path.join(__dirname, 'temp')}\n`);
});
