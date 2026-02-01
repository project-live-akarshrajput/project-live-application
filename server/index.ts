import { createServer } from "http";
import { SignalingServer } from "./signaling";

// Azure App Service uses PORT, fallback to SOCKET_PORT for local dev
const PORT = process.env.PORT || process.env.SOCKET_PORT || 3001;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

async function main() {
  console.log("Starting signaling server...");
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Port: ${PORT}`);
  console.log(`Redis URL: ${REDIS_URL ? "configured" : "not configured"}`);

  const httpServer = createServer((req, res) => {
    // Health check endpoint
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }),
      );
      return;
    }

    // CORS preflight
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL || "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      });
      res.end();
      return;
    }

    res.writeHead(404);
    res.end();
  });

  const signalingServer = new SignalingServer(httpServer, REDIS_URL);

  httpServer.listen(PORT, () => {
    console.log(`Signaling server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log("Shutting down signaling server...");
    httpServer.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
