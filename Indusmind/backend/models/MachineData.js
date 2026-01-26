const mongoose = require("mongoose");

const MachineDataSchema = new mongoose.Schema({
    machine_id: String,
    temperature: Number,
    vibration: Number,
    power_usage: Number,
    timestamp: String
});

module.exports =
    mongoose.models.MachineData ||
    mongoose.model("MachineData", MachineDataSchema);
