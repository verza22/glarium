import express, { Request, Response } from "express";
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = 3001;

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Test from express :)! " });
});

app.use(express.json());

//routes
app.use('/user', userRoutes);
app.use('/auth', authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});