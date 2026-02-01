import { Header, Footer } from "@/components/layout";
import {
  Shield,
  AlertTriangle,
  Flag,
  Eye,
  MessageSquare,
  Heart,
} from "lucide-react";

export default function SafetyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-950">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Safety Guidelines
            </h1>
            <p className="text-dark-400">
              Your safety is our priority. Please follow these guidelines for a
              positive experience.
            </p>
          </div>

          <div className="space-y-8">
            <section className="bg-dark-900 border border-dark-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">
                    Never Share Personal Information
                  </h2>
                  <p className="text-dark-300 text-sm">
                    Protect yourself by never sharing your real name, address,
                    phone number, school/workplace, or any other identifying
                    information with strangers.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-dark-900 border border-dark-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Flag className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">
                    Report Inappropriate Behavior
                  </h2>
                  <p className="text-dark-300 text-sm">
                    If you encounter someone displaying inappropriate behavior,
                    harassment, nudity, or illegal content, use the report
                    button immediately. Our team reviews all reports and takes
                    action against violators.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-dark-900 border border-dark-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">
                    Be Aware of Recording
                  </h2>
                  <p className="text-dark-300 text-sm">
                    Although we don't record chats, other users may screenshot
                    or record your video without consent. Never do anything on
                    camera that you wouldn't want to be seen publicly.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-dark-900 border border-dark-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">
                    Skip If Uncomfortable
                  </h2>
                  <p className="text-dark-300 text-sm">
                    You can skip to the next person at any time. If someone
                    makes you uncomfortable, don't hesitate to skip and find
                    someone else to chat with.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-dark-900 border border-dark-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">
                    Be Respectful
                  </h2>
                  <p className="text-dark-300 text-sm">
                    Treat others as you would like to be treated. Be kind,
                    respectful, and considerate. Remember that there's a real
                    person on the other side of the screen.
                  </p>
                </div>
              </div>
            </section>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                Emergency Situations
              </h3>
              <p className="text-dark-300 text-sm">
                If you witness or are involved in any situation involving
                immediate danger, illegal activity, or threats of violence,
                please contact your local emergency services immediately. Do not
                rely solely on our report system for urgent matters.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
