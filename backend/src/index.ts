import express, { Request, Response } from "express";

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import cityRoutes from './routes/cityRoutes';
import islandRoutes from './routes/islandRoutes';
import worldRoutes from './routes/worldRoutes';
import researchRoutes from './routes/researchRoutes';
import unitRoutes from './routes/unitRoutes';
import movementRoutes from './routes/movementRoutes';
import combatRoutes from './routes/combatRoutes';

import buildingRoutes from './routes/buildingRoutes';
import { errorHandler } from "./middleware/errorHandler";
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors({
    origin: "http://localhost:3000"
}));

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Test from express :)! " });
});

app.use(express.json());

//routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/city', cityRoutes);
app.use('/api/building', buildingRoutes);
app.use('/api/island', islandRoutes);
app.use('/api/world', worldRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/unit', unitRoutes);
app.use('/api/movement', movementRoutes);
app.use('/api/combat', combatRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});