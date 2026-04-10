use wasm_bindgen::prelude::*;

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

    pub fn update(&mut self, mouse_x: f64, mouse_y: f64, interaction_radius: f64) {
        let interaction_radius_sq = interaction_radius * interaction_radius;
        
        for i in 0..self.xs.len() {
            let dx = mouse_x - self.xs[i];
            let dy = mouse_y - self.ys[i];
            let dist_sq = dx * dx + dy * dy;
            
            if dist_sq < interaction_radius_sq {
                let dist = dist_sq.sqrt().max(0.1);
                let force = (interaction_radius - dist) / interaction_radius;
                self.vxs[i] -= dx / dist * force * 5.0;
                self.vys[i] -= dy / dist * force * 5.0;
            }

            let t_dx = self.target_xs[i] - self.xs[i];
            let t_dy = self.target_ys[i] - self.ys[i];
            self.vxs[i] += t_dx * 0.05;
            self.vys[i] += t_dy * 0.05;

            self.vxs[i] *= 0.9;
            self.vys[i] *= 0.9;
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
    pub fn get_radii_ptr(&self) -> *const f64 { self.radii.as_ptr() }
}
