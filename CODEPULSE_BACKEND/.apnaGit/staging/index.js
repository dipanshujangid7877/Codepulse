// index.js (ya server.js)
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

// Controllers
const mainRouter = require("./routes/main.router");
const userRouter = require("./routes/user.router");
const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push"); // Agar AWS SDK v2 use ho raha ho, to warning aayegi
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

dotenv.config();

function startServer() {
  const app = express();
  const port = process.env.PORT || 3002;

  // Middlewares
  app.use(cors({ origin: "*" }));
  app.use(express.json());

  // MongoDB connection
  const mongoURI = process.env.MONGODB_URI;
  mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected!"))
    .catch((err) => console.error("❌ MongoDB connection failed:", err));

  // Routes
  app.use("/api", mainRouter);
  app.use("/", userRouter);

  // Socket.io setup
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("📡 New client connected");
    socket.on("joinRoom", (userID) => {
      socket.join(userID);
    });
  });

  // Server start
  httpServer.listen(port, () => {
    console.log(`Server running on PORT ${port}`);
  });
}

// CLI commands using yargs
yargs(hideBin(process.argv))
  .command("start", "Starts the server", {}, () => {
    startServer();
  })
  .command("init", "Initialize a new repo", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to staging area",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "Push commits to S3", {}, pushRepo)
  .command("pull", "Pull commits from S3", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, "Please provide a valid command.")
  .help()
  .argv;
