# XGoetia App Paketleyici - Güncelleme Özeti

## ✅ Eklenen Yeni Özellikler:

### 1. Gerçek İndirme Yöneticisi
- **Tarayıcıda çoklu dosya indirme** (Fetch API + Streams API)
- **JavaScript tabanlı** - sunucu gerektirmez
- Her dosya ayrı ayrı indirilir

### 2. Çoklu Format Desteği (Script Oluşturucu)
- ✅ **Windows Batch (.bat)**
- ✅ **Linux/Mac Shell (.sh)**
- ✅ **Ansible Playbook (.yml)**
- ✅ **Dockerfile**
- ✅ **PowerShell (.ps1)**

### 3. Sessiz Kurulum Seçeneği
- Her uygulama için **checkbox** eklendi
- İşaretlendiğinde scripte `/SILENT` veya `-q` parametresi eklenir
- Desteklenen parametreler: `/SILENT`, `/VERYSILENT`, `/SUPPRESSMSGBOXES`, `/NORESTART`

### 4. Versiyon Seçimi
- Dropdown menü ile **Stable, LTS, Beta, Current** seçimi
- Uygulamaya göre uygun versiyonlar listelenir
- Örnek: Node.js (LTS v20, Current v21), Python (3.12 Stable, 3.10 LTS)

### 5. İndirme İlerlemesi (Progress Bar)
- **Gerçek zamanlı progress bar** (toplam ilerleme)
- Her dosya için ayrı ilerleme göstergesi
- Yüzde (%) olarak gösterim

## 🛠️ Teknik Değişiklikler:

### Dosyalar:
1. **index.html** güncellendi:
   - `apps` verisi `window.appsData` olarak global yapıldı
   - Versiyon seçimi dropdown'ları eklendi
   - Sessiz kurulum checkbox'ları eklendi
   - `bundler-enhanced.js` scripti eklendi

2. **bundler-enhanced.js** oluşturuldu:
   - `getSelectedApps()` - seçilen uygulamaları alır (versiyon + silent)
   - `generateScript()` - çoklu formatta script oluşturur
   - `downloadFileWithProgress()` - progress ile dosya indirir
   - `initBundlerUI()` - eksik HTML elementlerini ekler

3. **src/lib.rs** güncellendi:
   - `set_target()` metodu eklendi (güvenli hedef güncelleme)

4. **server.js** güncellendi:
   - PORT environment variable desteği

## 📋 Nasıl Kullanılır:

1. **Sayfayı açın:** http://localhost:3000 (veya `index.html`'yi tarayıcıda açın)
2. **APP BUNDLER** menüsüne tıklayın
3. **Script formatını seçin:** Dropdown'dan bat, sh, ansible vb.
4. **Uygulamaları seçin:** Checkbox'lardan istediklerinizi seçin
5. **Versiyon seçin:** Her uygulama yanındaki dropdown'dan (varsa)
6. **Sessiz kurulum:** İstediğiniz uygulamalar için "Silent" kutusunu işaretleyin
7. **İNDİR butonuna tıklayın:**
   - Script formatı seçildiyse → `.bat`, `.sh` vb. dosya indirilir
   - Direct Download seçildiyse → Tüm dosyalar teker teker indirilir

## ⚠️ Bilinen Sorunlar:

1. **WASM Modülü:** Rust/Cargo yüklü değilse WASM yeniden derlenemez
   - Çözüm: `wasm-pack build --target web` komutunu çalıştırın
   - Veya mevcut `pkg/` klasörünü kullanın (sınırlı işlev)

2. **İndirme Linkleri:** Bazı URL'ler değişmiş olabilir
   - `apps` array'ındaki URL'leri güncelleyin

3. **Tarayıcı Desteği:** Streams API için modern tarayıcı gerekir
   - Chrome 76+, Firefox 102+, Edge 79+

## 🚀 Sonraki Adımlar:

1. Rust'ı yükleyin: https://rustup.rs/
2. wasm-pack'i yükleyin: `cargo install wasm-pack`
3. WASM'i derleyin: `wasm-pack build --target web`
4. Sunucuyu çalıştırın: `node server.js`
5. Test edin: http://localhost:3000

---
Tarih: 2026-04-28
Durum: ✅ Özellikler eklendi, hatalar düzeltildi
