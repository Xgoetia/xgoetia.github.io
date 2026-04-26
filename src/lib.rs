use wasm_bindgen::prelude::*;
use image::{GenericImageView, ImageFormat};
use std::io::Cursor;

// Mevcut parçacık sistemi kodu aşağıda korunmuştur...

#[wasm_bindgen]
pub struct TextParticleSystem {
    xs: Vec<f64>,
    ys: Vec<f64>,
    target_xs: Vec<f64>,
    target_ys: Vec<f64>,
    vxs: Vec<f64>,
    vys: Vec<f64>,
    radii: Vec<f64>,
}

#[wasm_bindgen]
impl TextParticleSystem {
    #[wasm_bindgen(constructor)]
    pub fn new() -> TextParticleSystem {
        TextParticleSystem {
            xs: Vec::new(),
            ys: Vec::new(),
            target_xs: Vec::new(),
            target_ys: Vec::new(),
            vxs: Vec::new(),
            vys: Vec::new(),
            radii: Vec::new(),
        }
    }

    pub fn add_particle(&mut self, x: f64, y: f64, target_x: f64, target_y: f64) {
        self.xs.push(x);
        self.ys.push(y);
        self.target_xs.push(target_x);
        self.target_ys.push(target_y);
        self.vxs.push((js_sys::Math::random() - 0.5) * 2.0);
        self.vys.push((js_sys::Math::random() - 0.5) * 2.0);
        self.radii.push(js_sys::Math::random() * 1.5 + 0.5);
    }

    pub fn update(&mut self, mouse_x: f64, mouse_y: f64, interaction_radius: f64, rect_x: f64, rect_y: f64, rect_w: f64, rect_h: f64) {
        let interaction_radius_sq = interaction_radius * interaction_radius;
        
        for i in 0..self.xs.len() {
            // Fare etkileşimi
            let dx = mouse_x - self.xs[i];
            let dy = mouse_y - self.ys[i];
            let dist_sq = dx * dx + dy * dy;
            
            if dist_sq < interaction_radius_sq {
                let dist = dist_sq.sqrt().max(0.1);
                let force = (interaction_radius - dist) / interaction_radius;
                self.vxs[i] -= dx / dist * force * 5.0;
                self.vys[i] -= dy / dist * force * 5.0;
            }

            // Pencere etkileşimi (Eğer pencere açıksa)
            if rect_w > 0.0 {
                let margin = 20.0; // Pencerenin biraz dışından itmeye başla
                if self.xs[i] > rect_x - margin && self.xs[i] < rect_x + rect_w + margin &&
                   self.ys[i] > rect_y - margin && self.ys[i] < rect_y + rect_h + margin {
                    
                    // Parçacığı en yakın kenara doğru it
                    let mid_x = rect_x + rect_w / 2.0;
                    let mid_y = rect_y + rect_h / 2.0;
                    
                    if self.xs[i] < mid_x { self.vxs[i] -= 1.5; } else { self.vxs[i] += 1.5; }
                    if self.ys[i] < mid_y { self.vys[i] -= 1.5; } else { self.vys[i] += 1.5; }
                }
            }

            let t_dx = self.target_xs[i] - self.xs[i];
            let t_dy = self.target_ys[i] - self.ys[i];
            self.vxs[i] += t_dx * 0.15; // 0.05 -> 0.15 (Hızlandırıldı)
            self.vys[i] += t_dy * 0.15;

            self.vxs[i] *= 0.85; // 0.9 -> 0.85 (Daha az sürtünme, daha seri hareket)
            self.vys[i] *= 0.85;
            self.xs[i] += self.vxs[i];
            self.ys[i] += self.vys[i];
        }
    }

    pub fn move_targets(&mut self, dx: f64, dy: f64, start: usize, end: usize, width: f64) {
        let actual_end = if end > self.xs.len() { self.xs.len() } else { end };
        for i in start..actual_end {
            self.target_xs[i] += dx;
            self.target_ys[i] += dy;

            if self.target_xs[i] < -300.0 {
                self.target_xs[i] += width + 600.0;
            } else if self.target_xs[i] > width + 300.0 {
                self.target_xs[i] -= width + 600.0;
            }
        }
    }

    pub fn explode(&mut self, x: f64, y: f64, force: f64) {
        for i in 0..self.xs.len() {
            let dx = self.xs[i] - x;
            let dy = self.ys[i] - y;
            let dist_sq = dx * dx + dy * dy;
            if dist_sq < 40000.0 { // 200px yarıçap
                let dist = dist_sq.sqrt().max(1.0);
                let power = (1.0 - dist / 200.0) * force;
                self.vxs[i] += (dx / dist) * power;
                self.vys[i] += (dy / dist) * power;
            }
        }
    }

    pub fn get_count(&self) -> usize { self.xs.len() }
    pub fn get_xs_ptr(&self) -> *const f64 { self.xs.as_ptr() }
    pub fn get_ys_ptr(&self) -> *const f64 { self.ys.as_ptr() }
    pub fn get_target_xs_ptr(&mut self) -> *mut f64 { self.target_xs.as_mut_ptr() }
    pub fn get_target_ys_ptr(&mut self) -> *mut f64 { self.target_ys.as_mut_ptr() }
    pub fn get_radii_ptr(&self) -> *const f64 { self.radii.as_ptr() }
}

// ========== YENİ: Görüntü İşleme SaaS Fonksiyonları ==========

#[wasm_bindgen]
pub struct ImageProcessor;

#[wasm_bindgen]
impl ImageProcessor {
    /// Görüntüyü yeniden boyutlandır (WASM SaaS özelliği)
    #[wasm_bindgen]
    pub fn resize_image(
        image_data: &[u8],
        width: u32,
        height: u32,
        format: &str,
    ) -> Result<Vec<u8>, JsError> {
        let img = image::load_from_memory(image_data)?;
        let resized = img.resize_exact(width, height, image::imageops::FilterType::Lanczos3);
        
        let format = match format.to_lowercase().as_str() {
            "png" => ImageFormat::Png,
            "jpeg" | "jpg" => ImageFormat::Jpeg,
            "webp" => ImageFormat::WebP,
            "gif" => ImageFormat::Gif,
            _ => return Err(JsError::new("Desteklenmeyen format")),
        };
        
        let mut output = Vec::new();
        resized.write_to(&mut Cursor::new(&mut output), format)?;
        Ok(output)
    }

    /// Görüntü formatını dönüştür
    #[wasm_bindgen]
    pub fn convert_format(image_data: &[u8], target_format: &str) -> Result<Vec<u8>, JsError> {
        let img = image::load_from_memory(image_data)?;
        let format = match target_format.to_lowercase().as_str() {
            "png" => ImageFormat::Png,
            "jpeg" | "jpg" => ImageFormat::Jpeg,
            "webp" => ImageFormat::WebP,
            _ => return Err(JsError::new("Desteklenmeyen format")),
        };
        
        let mut output = Vec::new();
        img.write_to(&mut Cursor::new(&mut output), format)?;
        Ok(output)
    }

    /// Görüntü boyutlarını al
    #[wasm_bindgen]
    pub fn get_dimensions(image_data: &[u8]) -> Result<js_sys::Array, JsError> {
        let img = image::load_from_memory(image_data)?;
        let (w, h) = img.dimensions();
        let arr = js_sys::Array::new();
        arr.push(&w.into());
        arr.push(&h.into());
        Ok(arr)
    }
}
