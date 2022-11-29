// Create a simple express app
const express = require("express");
const parser = require("body-parser");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
// load dotenv
require('dotenv').config();

const PORT = process.env.PORT || 1234;

app.use(parser.json());

// Use cors
app.use(cors());



mongoose.connect(`mongodb+srv://lamai:${process.env.LAMAI_DB_PASS}@lamai.ztk6v9o.mongodb.net/lamai`);
const MapSchema = new mongoose.Schema({
    name: String,
    data: Object
});

const MapModel = mongoose.model("maps", MapSchema);


app.get("/getSavedNames", async (req, res) => {
    let data = await MapModel.find(undefined, 'name').exec();
    res.send(JSON.stringify(data));
});

app.get("/getDimensions/:id", async (req, res) => {
    let data = await MapModel.findById(req.params.id, ).exec();
    let response = {
        gridWidth: data.data.dimensions?.gridWidth || 28,
        gridHeight: data.data.dimensions?.gridHeight || 36
    }
    res.send(JSON.stringify(response));
});

app.post("/saveMap", async (req, res) => {
    MapModel.create(req.body,  (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send({name: data.name, _id: data._id});
        }
    });

});

app.get("/getMap/:id", async (req, res) => {
    let data = await MapModel.findById(req.params.id).exec();
    res.send(JSON.stringify(data));
});

app.delete("/deleteMap/:id", async (req, res) => {
    let data = await MapModel.findByIdAndDelete(req.params.id).exec();
    res.send(JSON.stringify(data));
});

// UPDATE
app.put("/updateMap/:id", async (req, res) => {
    let data = await MapModel.findByIdAndUpdate(req.params.id, {data:req.body.data}).exec();
    res.send(JSON.stringify({name: data.name, _id: data._id}));
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

