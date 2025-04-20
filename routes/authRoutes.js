import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
        return res.status(401).render("login", { error: "Invalid email or password" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).render("login", { error: "Invalid email or password" });
    }
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    res.redirect("/dashboard");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.post("/signup", async (req, res) => {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
        return res.status(400).render("signup", { error: "Email already registered" });
    }
    const newUser = await User.addUser(name, email, password, role);
    req.session.user = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    res.redirect("/dashboard");
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

export { router as default };
