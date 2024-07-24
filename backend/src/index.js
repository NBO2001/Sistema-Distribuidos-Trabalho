import express from "express";


const app = express();
const PORT = 4444;

app.get("/", (req, res) => {
    res.status(200).send("Hello");
});


app.listen(PORT, () => {
    console.log(`Running ${PORT}`);
})

