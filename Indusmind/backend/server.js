const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { spawn } = require("child_process");


require("./db"); // DB connection
const MachineData = require("./models/machinedata");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test API
app.get("/", (req, res) => {
    res.send("IndusMind Backend is Running");
});

// Receive simulated data
app.post("/api/machine-data", async (req, res) => {
    try {
        const data = new MachineData(req.body);
        await data.save();

        console.log("Data saved to DB:", data);

        res.status(200).json({
            message: "Data stored successfully",
            data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

// Route for prediction
app.post("/api/predict", (req, res) => {
    const inputData = req.body;

    // Use absolute path for predict_api.py
    const scriptPath = path.join(__dirname, "..", "ml-engine", "predict_api.py");

    // Use 'python' or 'py' based on Windows environment
    const pythonProcess = spawn("python", [scriptPath]);

    let resultData = "";
    let errorData = "";

    // Write input data to Python's stdin
    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();

    // Collect data from stdout
    pythonProcess.stdout.on("data", (data) => {
        resultData += data.toString();
    });

    // Collect data from stderr
    pythonProcess.stderr.on("data", (data) => {
        errorData += data.toString();
    });

    pythonProcess.on("close", (code) => {
        if (code !== 0) {
            console.error(`Python error (Exit Code ${code}):`, errorData);
            return res.status(500).json({ error: "ML execution failed", details: errorData });
        }

        try {
            const result = JSON.parse(resultData);
            res.json(result);
        } catch (parseError) {
            console.error("JSON Parse Error:", resultData);
            res.status(500).json({ error: "Failed to parse ML response" });
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
