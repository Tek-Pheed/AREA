require("dotenv").config();
import { Express } from "express";

const app: Express = require("express")();
const port: number = 3000;
const bodyParser = require("body-parser");
const pjson = require("../package.json");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type,Authorization,External-Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

app.listen(port, () => {
    console.log(
        `${pjson.name} listen on port ${port} - version ${pjson.version}`
    );
});
