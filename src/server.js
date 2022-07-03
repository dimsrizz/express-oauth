const debug = require("debug");

const app = require("./app");
const { sequelize } = require("./models/index");

const PORT = process.env.PORT || 8000;

// Handling uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception!!! shutting down..");
  console.error(err.message, err.stack);
  process.exit(1);
});

// Checking DB Connection
sequelize
  .sync({ logging: false })
  .then(() => console.log("Success re-sync database table"));
sequelize
  .authenticate({ logging: false })
  .then(() => console.log("Connected to the database"));

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Handing unhandled rejection
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!!! shutting down...");
  console.log(err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    debug("HTTP server closed");
  });
});
