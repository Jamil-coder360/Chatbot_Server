"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const app_1 = __importDefault(require("./app"));
const config_1 = require("./app/config");
const prisma_1 = __importDefault(require("./app/config/prisma"));
let server;
async function main() {
    server = app_1.default.listen(Number(config_1.config.port), config_1.config.ip, () => {
        console.log(colors_1.default.italic.green.bold(`Server is running on http://${config_1.config.ip}:${config_1.config.port}`));
    });
    prisma_1.default
        .$connect()
        .then(() => {
        console.log("Connected to MongoDB successfully!");
    })
        .catch((err) => {
        console.error(" Database connection issue:", err.message);
    });
}
main().catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
});
process.on("unhandledRejection", (err) => {
    console.error("Unhandled rejection:", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
});
process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
});
//# sourceMappingURL=server.js.map