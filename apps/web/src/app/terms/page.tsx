import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            React Tailwind Starter
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8 text-foreground">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using React Tailwind Starter ("the Service"),
                you accept and agree to be bound by the terms and provision of
                this agreement. If you do not agree to abide by the above,
                please do not use this service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                2. Description of Service
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                React Tailwind Starter is a starter template and demo
                application built with Next.js, React, TypeScript, and Tailwind
                CSS. The Service provides example components, authentication
                flows, and development patterns for educational and development
                purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed">
                To access certain features of the Service, you may be required
                to create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>
                  Maintaining the confidentiality of your account credentials
                </li>
                <li>All activities that occur under your account</li>
                <li>
                  Providing accurate and complete information when creating your
                  account
                </li>
                <li>
                  Promptly updating your account information if it changes
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">4. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to use the Service only for lawful purposes and in
                accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>
                  Use the Service in any way that violates applicable laws or
                  regulations
                </li>
                <li>
                  Transmit or procure the sending of any advertising or
                  promotional material without our prior written consent
                </li>
                <li>
                  Impersonate or attempt to impersonate the company, employees,
                  or other users
                </li>
                <li>
                  Engage in any conduct that restricts or inhibits anyone's use
                  or enjoyment of the Service
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">5. Demo Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                This Service includes demo content and sample data for
                demonstration purposes only. All demo user accounts, sample
                data, and example content are fictional and for testing
                purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                6. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of
                React Tailwind Starter and its licensors. The Service is
                protected by copyright, trademark, and other laws.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">7. Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your privacy is important to us. Please review our{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                , which also governs your use of the Service, to understand our
                practices.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                8. Disclaimer of Warranties
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis.
                We make no representations or warranties of any kind, express or
                implied, as to the operation of the Service or the information,
                content, materials, or products included on the Service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                9. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall React Tailwind Starter, nor its directors,
                employees, partners, agents, suppliers, or affiliates, be liable
                for any indirect, incidental, special, consequential, or
                punitive damages, including without limitation, loss of profits,
                data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">10. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account and bar access to the
                Service immediately, without prior notice or liability, under
                our sole discretion, for any reason whatsoever and without
                limitation.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">11. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will provide at least 30 days notice prior to any new terms
                taking effect.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                12. Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Email: legal@example.com</li>
                <li>
                  Website:{" "}
                  <Link href="/" className="text-primary hover:underline">
                    React Tailwind Starter
                  </Link>
                </li>
              </ul>
            </section>

            <div className="mt-8 p-4 bg-muted rounded-lg border">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a sample Terms of Service for
                demonstration purposes. Please consult with a legal professional
                to create proper terms for your actual application.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
