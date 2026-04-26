/**
 * xgoetia Technical Profile v2.0
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
        location: "Dijital Boşluk / Remote",
        status: "Aktif"
    };

    public stack: SkillSet[] = [
        {
            category: "Çekirdek Sistemler",
            items: ["Rust", "Go", "C++", "WebAssembly"],
            expertise: 10
        },
        {
            category: "Frontend Motoru",
            items: ["TypeScript", "WebGPU", "React", "Next.js"],
            expertise: 9
        },
        {
            category: "Altyapı & Devops",
            items: ["Docker", "Kubernetes", "AWS", "CI/CD"],
            expertise: 8
        },
        {
            category: "Backend & Eşzamanlılık",
            items: ["Elixir", "Python", "SQL", "Redis"],
            expertise: 9
        }
    ];

    public bio: string = "Düşük seviyeli sistem dillerini web'in esnekliğiyle birleştirerek yüksek performanslı mimariler kurguluyorum.";

    public getSummary(): string {
        return `${this.identity.name} - ${this.identity.title}: Sistem programlama ve modern web teknolojileri arasında köprü kurar.`;
    }
}

export default new DeveloperProfile();
