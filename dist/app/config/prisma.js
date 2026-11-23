"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const loggingExtension = client_1.Prisma.defineExtension({
    name: "logging",
    query: {
        $allOperations: async ({ model, operation, args, query }) => {
            console.log(`[Prisma] Model: ${model}, Action: ${operation}`);
            try {
                const res = await query(args);
                return res;
            }
            catch (err) {
                console.error(`[Prisma] Error in ${model}, ${operation}`, err);
                throw err;
            }
        },
    },
});
const prisma = new client_1.PrismaClient({
    transactionOptions: {
        maxWait: 10000,
        timeout: 10000,
    },
}).$extends(loggingExtension);
exports.default = prisma;
//# sourceMappingURL=prisma.js.map