/* tslint:disable */
/* eslint-disable */

export class ImageProcessor {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Görüntü formatını dönüştür
     */
    static convert_format(image_data: Uint8Array, target_format: string): Uint8Array;
    /**
     * Görüntü boyutlarını al
     */
    static get_dimensions(image_data: Uint8Array): Array<any>;
    /**
     * Görüntüyü yeniden boyutlandır (WASM SaaS özelliği)
     */
    static resize_image(image_data: Uint8Array, width: number, height: number, format: string): Uint8Array;
}

export class TextParticleSystem {
    free(): void;
    [Symbol.dispose](): void;
    add_particle(x: number, y: number, target_x: number, target_y: number): void;
    explode(x: number, y: number, force: number): void;
    get_count(): number;
    get_radii_ptr(): number;
    get_target_xs_ptr(): number;
    get_target_ys_ptr(): number;
    get_xs_ptr(): number;
    get_ys_ptr(): number;
    move_targets(dx: number, dy: number, start: number, end: number, width: number): void;
    constructor();
    update(mouse_x: number, mouse_y: number, interaction_radius: number, rect_x: number, rect_y: number, rect_w: number, rect_h: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_imageprocessor_free: (a: number, b: number) => void;
    readonly __wbg_textparticlesystem_free: (a: number, b: number) => void;
    readonly imageprocessor_convert_format: (a: number, b: number, c: number, d: number) => [number, number, number, number];
    readonly imageprocessor_get_dimensions: (a: number, b: number) => [number, number, number];
    readonly imageprocessor_resize_image: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number, number];
    readonly textparticlesystem_add_particle: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly textparticlesystem_explode: (a: number, b: number, c: number, d: number) => void;
    readonly textparticlesystem_get_count: (a: number) => number;
    readonly textparticlesystem_get_radii_ptr: (a: number) => number;
    readonly textparticlesystem_get_target_xs_ptr: (a: number) => number;
    readonly textparticlesystem_get_target_ys_ptr: (a: number) => number;
    readonly textparticlesystem_get_xs_ptr: (a: number) => number;
    readonly textparticlesystem_get_ys_ptr: (a: number) => number;
    readonly textparticlesystem_move_targets: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly textparticlesystem_new: () => number;
    readonly textparticlesystem_update: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
