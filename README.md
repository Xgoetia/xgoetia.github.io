# Rust WASM Project

Bu proje Rust ve WebAssembly kullanılarak oluşturuldu.

## Nasıl Çalıştırılır?

1. Proje dizinine gidin:
   ```bash
   cd my_wasm_project
   ```

2. Projeyi derleyin:
   ```bash
   wasm-pack build --target web
   ```

3. Bir HTTP sunucusu ile `index.html` dosyasını açın:
   ```bash
   # Örnek:
   python -m http.server
   ```
   Ardından tarayıcıda `http://localhost:8000` adresine gidin.
