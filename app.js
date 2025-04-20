import express from "express";
import session from "express-session";
import path from "path";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import roundRoutes from "./routes/roundRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import setRoutes from "./routes/setRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use("/", authRoutes);
app.use("/tournaments", tournamentRoutes);
app.use("/teams", teamRoutes);
app.use("/tournaments/:tournamentId/rounds", roundRoutes);
app.use("/rounds/:roundId/games", gameRoutes);
app.use("/games/:gameId/sets", setRoutes);
app.use("/teams/:teamId/players", playerRoutes);

app.get("/dashboard", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    res.render("dashboard", { user: req.session.user });
});

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.use((req, res) => {
    res.status(404).render("404");
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
