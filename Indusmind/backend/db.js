const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://karthikofficial0484_db_user:B9CLjW0Lt16OuriW@cluster0.syhweox.mongodb.net/indusmind";

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

module.exports = mongoose;
