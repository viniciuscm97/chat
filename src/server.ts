import express from 'express';
// se faço assim ele importa por padrao o index
import "./database";

import { routes } from "./routes";

const app = express();

app.use(express.json())

app.use(routes)

app.listen(3000, () => console.log("Server is running :D"))