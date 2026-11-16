import prisma from "../config/db.js";

// Convert BigInt IDs into JSON strings
const formatUser = (user) => ({
    ...user,
    id: user.id.toString()
});

// CREATE USER
export const createUser = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || typeof email !== "string" || !email.trim()) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await prisma.user.create({
            data: {
                email: email.trim()
            }
        });

        res.status(201).json({
            message: "User created successfully",
            user: formatUser(user)
        });

    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// GET ALL USERS
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();

        res.status(200).json(
            users.map(formatUser)
        );

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
    try {
        const id = BigInt(req.params.id);

        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(formatUser(user));

    } catch (error) {
        res.status(400).json({
            message: "Invalid user ID"
        });
    }
};

// UPDATE USER
export const updateUser = async (req, res) => {
    try {
        const id = BigInt(req.params.id);
        const { email } = req.body;

        if (!email || typeof email !== "string" || !email.trim()) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await prisma.user.update({
            where: { id },
            data: {
                email: email.trim()
            }
        });

        res.status(200).json({
            message: "User updated successfully",
            user: formatUser(user)
        });

    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        if (error.code === "P2025") {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(400).json({
            message: "Invalid user ID"
        });
    }
};

// DELETE USER
export const deleteUser = async (req, res) => {
    try {
        const id = BigInt(req.params.id);

        await prisma.user.delete({
            where: { id }
        });

        res.status(204).send();

    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(400).json({
            message: "Invalid user ID"
        });
    }
};