const express = require("express");

const app = express();

app.use(express.json());

// GET API
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome my project"
    });
});

// GET users
app.get("/api/users", (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, name: "Tarun" },
            { id: 2, name: "Rahul" }
        ]
    });
});

// POST user
app.post("/api/users", (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and email are required"
        });
    }

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
            id: 3,
            name,
            email
        }
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});