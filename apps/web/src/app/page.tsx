import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default function Home() {
  const techStack = [
    { name: "Next.js 15", desc: "React framework with App Router & Turbopack" },
    {
      name: "Tailwind CSS v4",
      desc: "Utility-first CSS with new CSS-first config",
    },
    {
      name: "TypeScript",
      desc: "Type-safe development with modern JavaScript",
    },
    {
      name: "Modern Tooling",
      desc: "ESLint, Prettier, Husky, and testing setup",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple. Modern. Ready.</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A clean, well-structured starter template for your next React
            project. Built with the latest technologies and best practices.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/showcase">
              <Button size="lg">Explore Showcase →</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8">
            Built With
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, i) => (
              <Card
                key={i}
                className="text-center hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{tech.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tech.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-6 text-sm">
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
