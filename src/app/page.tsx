"use client";

import Link from "next/link";
import {
  Video,
  Users,
  Shield,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui";
import { useOnlineCount } from "@/hooks/useOnlineCount";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  const { data: session } = useSession();
  const { onlineCount, isConnected } = useOnlineCount();

  // Format online count - show actual count or a friendly message
  const formattedCount =
    isConnected && onlineCount > 0 ? onlineCount.toLocaleString() : null;

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-accent-50/30" />
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent-100/40 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-success-50 border border-success-200 text-success-600 text-sm font-medium mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                <span>
                  {formattedCount
                    ? `${formattedCount} ${onlineCount === 1 ? "person" : "people"} online now`
                    : "People are online now"}
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-bold text-surface-900 mb-6 leading-tight tracking-tight"
              >
                Meet New People
                <br />
                <span className="text-primary-500">Face to Face</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg text-surface-500 mb-10 max-w-xl mx-auto leading-relaxed"
              >
                Connect instantly with random people from around the world.
                Safe, anonymous, and fun video conversations.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                {session ? (
                  // User is logged in - show Start Chatting button
                  <Link href="/chat">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto min-w-[200px] gap-2"
                    >
                      <Video size={18} />
                      Start Chatting
                    </Button>
                  </Link>
                ) : (
                  // User is not logged in - show register and login buttons
                  <>
                    <Link href="/register">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto min-w-[180px] gap-2"
                      >
                        Get Started Free
                        <ArrowRight size={18} />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="w-full sm:w-auto min-w-[180px]"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Trust badges */}
              <motion.div
                variants={fadeInUp}
                className="flex items-center justify-center gap-6 mt-12 pt-8 border-t border-surface-100"
              >
                <div className="flex items-center gap-2 text-sm text-surface-500">
                  <Shield size={16} className="text-success-500" />
                  <span>Safe & Secure</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-surface-500">
                  <Lock size={16} className="text-success-500" />
                  <span>No Data Stored</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-surface-500">
                  <Users size={16} className="text-success-500" />
                  <span>18+ Only</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-surface-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 mb-4">
                <Sparkles size={16} />
                Features
              </span>
              <h2 className="text-3xl font-bold text-surface-900 mb-4">
                Why people love Vibly
              </h2>
              <p className="text-surface-500 max-w-xl mx-auto">
                Simple, safe, and fun way to meet new people online
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: Zap,
                  title: "Instant Match",
                  description: "Get connected with someone new in seconds",
                  color: "bg-accent-100 text-accent-600",
                },
                {
                  icon: Shield,
                  title: "Safe & Secure",
                  description: "Report and block with one click",
                  color: "bg-success-100 text-success-600",
                },
                {
                  icon: Users,
                  title: "Gender Filter",
                  description: "Choose who you want to meet",
                  color: "bg-primary-100 text-primary-600",
                },
                {
                  icon: Globe,
                  title: "Global Community",
                  description: "Connect with people worldwide, 24/7",
                  color: "bg-blue-100 text-blue-600",
                },
                {
                  icon: Video,
                  title: "HD Quality",
                  description: "Crystal clear video and audio",
                  color: "bg-purple-100 text-purple-600",
                },
                {
                  icon: Lock,
                  title: "Privacy First",
                  description: "No chats recorded or stored",
                  color: "bg-rose-100 text-rose-600",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white rounded-xs border border-surface-200 hover:border-surface-300 hover:shadow-card transition-all duration-300 group"
                >
                  <div
                    className={`w-11 h-11 rounded-xs ${feature.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}
                  >
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-surface-900 mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-surface-500 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-surface-900 mb-4">
                Three simple steps
              </h2>
              <p className="text-surface-500">
                Start meeting new people in under a minute
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Sign Up",
                  description:
                    "Create your account in seconds with just your email",
                },
                {
                  step: "2",
                  title: "Allow Camera",
                  description: "Grant camera permissions to enable video chat",
                },
                {
                  step: "3",
                  title: "Start Chatting",
                  description: "Click Start and meet someone new instantly",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <div className="w-14 h-14 rounded-xs bg-primary-500 flex items-center justify-center mx-auto mb-5 shadow-button">
                    <span className="text-xl font-bold text-white">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-surface-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-surface-500 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600">
          <motion.div
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to meet someone new?
            </h2>
            <p className="text-primary-100 mb-8 text-lg">
              Join thousands of users already connecting on Vibly
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-surface-50 shadow-elevated"
              >
                Create Free Account
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
