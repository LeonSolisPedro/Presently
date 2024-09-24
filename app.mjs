import express from "express"
import cors from "cors"

const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  return res.status(200).send("Hello World!")
})


const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});