/**
 * xgoetia Technical Profile
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
        return "Web'in geleceğini Rust ve WASM ile inşa etmek.";
    }
}

export default new DeveloperProfile();
