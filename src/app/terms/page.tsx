import { Header, Footer } from "@/components/layout";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-950">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-invert prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-dark-300">
                By accessing and using LiveChat, you accept and agree to be
                bound by the terms and provision of this agreement. If you do
                not agree to abide by these terms, please do not use this
                service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                2. Age Requirement
              </h2>
              <p className="text-dark-300">
                You must be at least 18 years of age to use this service. By
                using LiveChat, you confirm that you are 18 years or older. We
                reserve the right to terminate accounts of users who are found
                to be underage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                3. User Conduct
              </h2>
              <p className="text-dark-300">You agree NOT to:</p>
              <ul className="list-disc list-inside text-dark-300 mt-2 space-y-1">
                <li>Display nudity or sexual content</li>
                <li>Harass, threaten, or abuse other users</li>
                <li>Share illegal content</li>
                <li>Spam or advertise products/services</li>
                <li>Impersonate another person</li>
                <li>Collect personal information from others</li>
                <li>Use automated systems or bots</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                4. Privacy
              </h2>
              <p className="text-dark-300">
                We do not record or store video chats. However, other users may
                capture screenshots or recordings without your knowledge. Please
                be cautious about sharing personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                5. Termination
              </h2>
              <p className="text-dark-300">
                We reserve the right to terminate or suspend your account at any
                time, without prior notice, for conduct that we believe violates
                these Terms or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                6. Disclaimer
              </h2>
              <p className="text-dark-300">
                LiveChat is provided "as is" without warranty of any kind. We
                are not responsible for the conduct of any user. Use this
                service at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                7. Changes to Terms
              </h2>
              <p className="text-dark-300">
                We reserve the right to modify these terms at any time.
                Continued use of the service after changes constitutes
                acceptance of the new terms.
              </p>
            </section>

            <p className="text-dark-500 mt-8">Last updated: February 2026</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
