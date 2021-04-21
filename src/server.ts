import express from 'express';

const app = express();

app.get("/", (req, res) => {
    return res.send("olá mundo")

})

app.post("/", (req,res) => {
    return res.json({
        message: "Ta funcionando"
    })
})
app.listen(3000, () => console.log("Server is running :D"))