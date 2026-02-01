import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { VideoRoom } from "@/components/video";
import { Header } from "@/components/layout";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="h-screen flex flex-col bg-dark-950">
      <Header />
      <main className="flex-1 overflow-hidden">
        <VideoRoom />
      </main>
    </div>
  );
}
