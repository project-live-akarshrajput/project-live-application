import Link from "next/link";
import { Video, Users, Shield, Zap, Globe, Lock } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-dark-950" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-700/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Thousands of users online now</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Meet New People Through{" "}
                <span className="gradient-text">Live Video</span>
              </h1>

              <p className="text-lg text-dark-300 mb-8 max-w-2xl mx-auto">
                Connect instantly with random people from around the world.
                Safe, anonymous, and fun video conversations at the click of a
                button.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto min-w-[160px]">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto min-w-[160px]"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-dark-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Why Choose LiveChat?
              </h2>
              <p className="text-dark-400 max-w-2xl mx-auto">
                Experience the best random video chat platform with features
                designed for you
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: "Instant Connections",
                  description:
                    "No waiting. Get matched with someone new in seconds with our advanced matching system.",
                },
                {
                  icon: Shield,
                  title: "Safe & Secure",
                  description:
                    "Your privacy matters. Anonymous chats with robust reporting and moderation tools.",
                },
                {
                  icon: Users,
                  title: "Gender Filters",
                  description:
                    "Choose who you want to meet. Filter by gender preference for better matches.",
                },
                {
                  icon: Globe,
                  title: "Global Community",
                  description:
                    "Connect with people from every corner of the world, 24/7.",
                },
                {
                  icon: Video,
                  title: "HD Video Quality",
                  description:
                    "Crystal clear video and audio for the best conversation experience.",
                },
                {
                  icon: Lock,
                  title: "Privacy First",
                  description:
                    "No chats are recorded or stored. Your conversations stay private.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-dark-800/50 border border-dark-700 hover:border-primary-500/50 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-dark-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                How It Works
              </h2>
              <p className="text-dark-400">
                Three simple steps to start chatting
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Create Account",
                  description:
                    "Sign up in seconds with just your email. Verify your age and set your preferences.",
                },
                {
                  step: "02",
                  title: "Allow Camera",
                  description:
                    "Grant camera and microphone permissions to enable video chat functionality.",
                },
                {
                  step: "03",
                  title: "Start Chatting",
                  description:
                    "Click Start and get instantly matched with someone new. Skip anytime to find another person.",
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-dark-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-900/50 to-primary-800/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Meet Someone New?
            </h2>
            <p className="text-dark-300 mb-8">
              Join thousands of users already connecting on LiveChat
            </p>
            <Link href="/register">
              <Button size="lg">Create Free Account</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
