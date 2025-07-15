require("dotenv").config(); // Load environment variables if using .env file
const mongoose = require("mongoose");
const XLSX = require("xlsx");
const User = require("../models/User");
const Lead = require("../models/Leads");
const fs = require("fs");
const path = require("path");

// Connect to MongoDB
const MongoUri =
  process.env.MONGOURI || "mongodb://localhost:27017/your-db-name";
mongoose
  .connect(MongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Load and Parse Excel File
const excelPath = path.resolve(
  __dirname,
  "../server/asset/Lead Sheet - 2024_Universe.xlsx"
);
const workbook = XLSX.readFile(
  "D:/WPU/universe/server/asset/Lead Sheet - 2024_Universe.xlsx"
);

const sheet_name_list = workbook.SheetNames;
const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

async function uploadLeads() {
  for (const row of xlData) {
    try {
      // Check if leadGeneratorName exists in the Excel row
      if (!row.leadGeneratorName || !row.customLeadId) {
        console.log(
          `Skipping row due to missing leadGeneratorName or customLeadId: ${JSON.stringify(
            row
          )}`
        );
        continue;
      }

      // 1. Find lead generator by name in the User collection
      const user = await User.findOne({ name: row.leadGeneratorName });

      let leadGeneratorObjectId;
      if (user) {
        leadGeneratorObjectId = user._id; // Found existing user
      } else {
        // Optionally, create a new User if not found
        const newUser = new User({ name: row.leadGeneratorName });
        await newUser.save();
        leadGeneratorObjectId = newUser._id;
      }

      // 2. Create new lead with ObjectId for leadGeneratorName
      const newLead = new Lead({
        customLeadId: row.customLeadId,
        leadGeneratorName: leadGeneratorObjectId, // Store as ObjectId
        source: row.source || "Unknown", // Default to "Unknown" if source is missing
        prospectName: row.prospectName || "N/A", // Handle missing prospect name
        email: row.email || "N/A", // Handle missing email
        // Map other fields...
      });

      await newLead.save();
    } catch (error) {
      console.error(`Error uploading lead ${row.customLeadId}:`, error);
    }
  }
}

uploadLeads()
  .then(() => {
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error during upload:", error);
    mongoose.connection.close();
  });
