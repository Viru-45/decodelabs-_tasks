import express from "express";
import dotenv from "dotenv";
import prisma from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Project 2 - User CRUD API"
    });
});

// User routes
app.use("/api/users", userRoutes);

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await prisma.$connect();

        console.log("PostgreSQL connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
}

startServer();