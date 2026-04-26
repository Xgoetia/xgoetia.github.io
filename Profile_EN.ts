/**
 * xgoetia Technical Profile v2.0 (English Version)
 */

interface SkillSet {
    category: string;
    items: string[];
    expertise: number; // 1-10
}

class DeveloperProfile {
    public readonly identity = {
        name: "xgoetia",
        title: "Full-Stack Systems Architect",
        location: "Digital Void / Remote",
        status: "Active"
    };

    public stack: SkillSet[] = [
        {
            category: "Core Systems",
            items: ["Rust", "Go", "C++", "WebAssembly"],
            expertise: 10
        },
        {
            category: "Frontend Engine",
            items: ["TypeScript", "WebGPU", "React", "Next.js"],
            expertise: 9
        },
        {
            category: "Infrastructure & DevOps",
            items: ["Docker", "Kubernetes", "AWS", "CI/CD"],
            expertise: 8
        },
        {
            category: "Backend & Concurrency",
            items: ["Elixir", "Python", "SQL", "Redis"],
            expertise: 9
        }
    ];

    public bio: string = "Building high-performance architectures by combining low-level systems languages with the flexibility of the web.";

    public getSummary(): string {
        return `${this.identity.name} - ${this.identity.title}: Bridging the gap between systems programming and modern web technologies.`;
    }
}

export default new DeveloperProfile();
