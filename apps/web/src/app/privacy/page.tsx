import Link from "next/link";

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                1. Information We Collect
              </h2>

              <div className="space-y-3">
                <h3 className="text-xl font-medium">
                  1.1 Information You Provide
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We collect information you provide directly to us, such as
                  when you:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Create an account</li>
                  <li>Update your profile</li>
                  <li>Contact us for support</li>
                  <li>Participate in surveys or feedback</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  This may include your name, email address, and other
                  information you choose to provide.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-medium">
                  1.2 Automatically Collected Information
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you use our Service, we may automatically collect certain
                  information, including:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Device information (browser type, operating system)</li>
                  <li>Usage information (pages visited, time spent)</li>
                  <li>Log data (IP address, access times, referring URLs)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                2. How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the collected information to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process transactions and send related information</li>
                <li>Send administrative information and updates</li>
                <li>
                  Respond to comments, questions, and customer service requests
                </li>
                <li>Monitor and analyze usage patterns and trends</li>
                <li>Detect, prevent, and address security issues</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                3. Information Sharing and Disclosure
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties, except in the following
                circumstances:
              </p>

              <div className="space-y-3">
                <h3 className="text-xl font-medium">3.1 Service Providers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may share your information with third-party service
                  providers who assist us in:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Data analysis and usage analytics</li>
                  <li>Email delivery services</li>
                  <li>Customer support</li>
                  <li>Technical infrastructure</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-medium">3.2 Legal Requirements</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may disclose your information if required by law or in
                  response to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Legal process or government requests</li>
                  <li>Enforce our Terms of Service</li>
                  <li>Protect our rights, property, or safety</li>
                  <li>Investigate potential violations</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
                However, no method of transmission over the Internet or
                electronic storage is 100% secure.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                5. Cookies and Tracking Technologies
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our Service</li>
                <li>Improve your user experience</li>
                <li>Provide personalized content</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                You can control cookies through your browser settings, but
                disabling cookies may affect functionality.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information only as long as necessary to
                provide our services and fulfill the purposes outlined in this
                policy. When we no longer need your information, we will
                securely delete or anonymize it.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                7. Your Rights and Choices
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>
                  <strong className="text-foreground">Access:</strong> Request
                  access to your personal information
                </li>
                <li>
                  <strong className="text-foreground">Correction:</strong>{" "}
                  Request correction of inaccurate information
                </li>
                <li>
                  <strong className="text-foreground">Deletion:</strong> Request
                  deletion of your personal information
                </li>
                <li>
                  <strong className="text-foreground">Portability:</strong>{" "}
                  Request a copy of your data in a structured format
                </li>
                <li>
                  <strong className="text-foreground">Objection:</strong> Object
                  to processing of your information
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">8. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service is not directed to children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If we discover that we have collected personal
                information from a child under 13, we will promptly delete such
                information.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                9. International Data Transfers
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in
                countries other than your own. We ensure that such transfers
                comply with applicable data protection laws and implement
                appropriate safeguards.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">10. Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service may contain links to third-party websites or
                services. We are not responsible for the privacy practices of
                these third parties. We encourage you to read their privacy
                policies.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                11. Changes to This Privacy Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new Privacy
                Policy on this page and updating the "Last updated" date. Your
                continued use of the Service after changes constitutes
                acceptance of the updated policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">12. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Email: privacy@example.com</li>
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
                <strong>Note:</strong> This is a sample Privacy Policy for
                demonstration purposes. Please consult with a legal professional
                to create a proper privacy policy for your actual application,
                especially if you handle personal data or operate in
                jurisdictions with specific privacy laws (GDPR, CCPA, etc.).
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
