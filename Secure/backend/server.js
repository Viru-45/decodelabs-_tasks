import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";

const server = app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});

let isShuttingDown = false;

async function disconnectPrisma() {
  try {
    await prisma.$disconnect();
  } catch {
    console.error("Failed to disconnect Prisma client cleanly.");
    process.exitCode = 1;
  }
}

function shutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`Received ${signal}; closing server.`);

  server.close(async (error) => {
    if (error) {
      console.error("Failed to close the HTTP server cleanly.");
      process.exitCode = 1;
    }

    await disconnectPrisma();
  });
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

server.on("error", async (error) => {
  console.error(`HTTP server error: ${error.code || "unknown"}`);
  process.exitCode = 1;
  await disconnectPrisma();
});
