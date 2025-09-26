import express, { Request, Response } from "express";

const app = express();
const PORT = 3001;

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Test from express :)! " });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});