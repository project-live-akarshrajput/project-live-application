import { Header, Footer } from "@/components/layout";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-950">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>

          <div className="prose prose-invert prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                Information We Collect
              </h2>
              <p className="text-dark-300">
                We collect the following information:
              </p>
              <ul className="list-disc list-inside text-dark-300 mt-2 space-y-1">
                <li>Email address (for account creation)</li>
                <li>Username and display name</li>
                <li>Date of birth (for age verification)</li>
                <li>Gender (for matching preferences)</li>
                <li>Profile picture (optional)</li>
                <li>Usage data (call statistics, last seen)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                How We Use Your Information
              </h2>
              <p className="text-dark-300">Your information is used to:</p>
              <ul className="list-disc list-inside text-dark-300 mt-2 space-y-1">
                <li>Create and manage your account</li>
                <li>Match you with other users based on preferences</li>
                <li>Improve our service and user experience</li>
                <li>Enforce our terms of service</li>
                <li>Handle reports and safety concerns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                Video Chat Privacy
              </h2>
              <p className="text-dark-300">
                <strong>
                  We do not record, store, or monitor video chats.
                </strong>{" "}
                Video streams are transmitted directly between users
                (peer-to-peer) and do not pass through our servers. However,
                please be aware that other users may capture or record your
                video without consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                Data Storage
              </h2>
              <p className="text-dark-300">
                Your account data is stored securely in MongoDB Atlas with
                encryption at rest. Profile images are stored in Supabase with
                secure access controls. We use industry-standard security
                measures to protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                Data Sharing
              </h2>
              <p className="text-dark-300">
                We do not sell or share your personal information with third
                parties for marketing purposes. We may share data with law
                enforcement if required by law or to protect the safety of our
                users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                Your Rights
              </h2>
              <p className="text-dark-300">You have the right to:</p>
              <ul className="list-disc list-inside text-dark-300 mt-2 space-y-1">
                <li>Access your personal data</li>
                <li>Update or correct your information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of non-essential communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Cookies</h2>
              <p className="text-dark-300">
                We use essential cookies for authentication and session
                management. These are necessary for the service to function
                properly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                Contact Us
              </h2>
              <p className="text-dark-300">
                If you have questions about this Privacy Policy, please contact
                us at privacy@livechat.com
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
