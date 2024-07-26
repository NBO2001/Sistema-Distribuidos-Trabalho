import express from "express";
import { getAll, insert } from "./services/songs.js";


const app = express();
const PORT = 4444;

app.use(express.json());

app.get("/", async (req, res) => {
    
    const database = req.query.bd ? Number(req.query.bd) : 1;
    
    const data = await getAll(database);

    res.status(200).json(data);
   
});


app.post("/", async (req, res) => {
    
    const database = req.query.bd ? Number(req.query.bd) : 1;

    const { title } = req.body;
    
    const data = await insert(title,database);

    res.status(200).json(data);
   
});

app.listen(PORT, () => {
    console.log(`Running ${PORT}`);
});
