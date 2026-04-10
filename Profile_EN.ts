/**
 * xgoetia Technical Profile (EN)
 */

interface SkillSet {
    category: string;
    languages: string[];
    expertiseLevel: number; // 1-10
}

class DeveloperProfile {
    public readonly name: string = "xgoetia";
    public readonly role: string = "WASM & Systems Architect";
    public skills: SkillSet[] = [
        {
            category: "Systems",
            languages: ["Rust", "Go", "C++"],
            expertiseLevel: 9
        },
        {
            category: "Web",
            languages: ["TypeScript", "WebAssembly", "React"],
            expertiseLevel: 10
        }
    ];

    public getVision(): string {
        return "Building the future of the web with Rust and WASM.";
    }
}

export default new DeveloperProfile();
