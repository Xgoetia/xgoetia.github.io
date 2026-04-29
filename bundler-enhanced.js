// Enhanced Bundler - Fixed Batch Script
(function() {
    'use strict';
    
    // Get selected apps
    function getSelectedApps() {
        const checkboxes = document.querySelectorAll('#apps-list input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => {
            const idx = parseInt(cb.dataset.idx);
            const app = window.appsData ? window.appsData[idx] : null;
            if (!app) return null;
            
            const versionSelect = document.getElementById('version-' + idx);
            const version = versionSelect ? versionSelect.value : 'stable';
            const silentCheck = document.querySelector('#apps-list .silent-check[data-idx="' + idx + '"]');
            const silent = silentCheck ? silentCheck.checked : false;
            
            return {
                name: app.name,
                url: app.urls[version] || app.urls.stable,
                version: version,
                silent: silent
            };
        }).filter(x => x !== null);
    }
    
    // Get filename from URL or sanitize app name
    function getFileName(app) {
        try {
            const url = new URL(app.url);
            const pathname = url.pathname;
            const baseName = pathname.split('/').pop();
            if (baseName && baseName.includes('.')) {
                return baseName;
            }
        } catch(e) {}
        
        // Fallback: sanitize app name and add .exe
        return app.name.replace(/[^a-zA-Z0-9]/g, '_') + '.exe';
    }
    
    // Generate script for different formats
    function generateScript(format, apps) {
        let lines = [];
        const date = new Date().toISOString().split('T')[0];
        
        if (format === 'bat') {
            lines.push('@echo off');
            lines.push('echo XGoetia Bundle - ' + date);
            lines.push('echo This script downloads and installs applications.');
            lines.push('echo.');
            apps.forEach(app => {
                const fileName = getFileName(app);
                const flag = app.silent ? ' /SILENT /VERYSILENT /SUPPRESSMSGBOXES /NORESTART' : '';
                lines.push('echo.');
                lines.push('echo Downloading ' + app.name + '...');
                // Use PowerShell to download - proper quoting with single quotes
                const psCmd = "Invoke-WebRequest -Uri '" + app.url + "' -OutFile '" + fileName + "'";
                lines.push('PowerShell -Command "' + psCmd + '"');
                lines.push('if exist "' + fileName + '" (');
                lines.push('    echo Installing ' + app.name + '...');
                lines.push('    start /wait "" "' + fileName + '"' + flag);
                lines.push(') else (');
                lines.push('    echo ERROR: Failed to download ' + fileName);
                lines.push(')');
            });
            lines.push('echo.');
            lines.push('echo Done!');
            lines.push('pause');
            
        } else if (format === 'sh') {
            lines.push('#!/bin/bash');
            lines.push('echo "XGoetia Bundle - ' + date + '"');
            apps.forEach(app => {
                const fileName = getFileName(app);
                const flag = app.silent ? ' -q' : '';
                lines.push('curl -L -o "' + fileName + '" "' + app.url + '"');
                lines.push('chmod +x "' + fileName + '"');
                lines.push('./"' + fileName + '"' + flag);
            });
            
        } else if (format === 'powershell') {
            lines.push('# PowerShell - XGoetia Bundle');
            lines.push('Write-Host "XGoetia Bundle - ' + date + '"');
            apps.forEach(app => {
                const fileName = getFileName(app);
                const flag = app.silent ? ' -Silent' : '';
                lines.push('Write-Host "Downloading ' + app.name + '..."');
                lines.push('Invoke-WebRequest -Uri "' + app.url + '" -OutFile "' + fileName + '"');
                lines.push('Write-Host "Installing ' + app.name + '..."');
                lines.push('Start-Process -FilePath "' + fileName + '" -ArgumentList "' + flag + '" -Wait');
            });
            
        } else {
            // Direct download - return null
            return null;
        }
        return lines.join('\n');
    }
    
    // Trigger download
    function downloadBlob(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Main function
    window.generateBundleScript = async function() {
        const apps = getSelectedApps();
        if (apps.length === 0) {
            alert('Lutfen en az bir uygulama secin!');
            return;
        }
        
        const formatSelect = document.getElementById('script-format');
        const format = formatSelect ? formatSelect.value : 'bat';
        
        if (format !== 'direct') {
            const script = generateScript(format, apps);
            if (script) {
                const ext = { bat: 'bat', sh: 'sh', powershell: 'ps1' }[format] || 'txt';
                downloadBlob(script, 'xgoetia-bundle.' + ext);
                alert('Script indirildi! Dosyayi calistirmadan once internete bagli oldugunuzdan emin olun.');
                return;
            }
        }
        
        // Direct download - open URLs in new tabs
        if (confirm('Bu islem ' + apps.length + ' dosyayi ayri ayri indirecek. Devam etsin mi?')) {
            apps.forEach(app => {
                window.open(app.url, '_blank');
            });
            alert('Dosyalar tarayiciniz uzerinden indiriliyor. Lutfen popup engelleyiciyi kontrol edin.');
        }
    };
    
    console.log('✅ Enhanced Bundler loaded (fixed v2)');
})();
