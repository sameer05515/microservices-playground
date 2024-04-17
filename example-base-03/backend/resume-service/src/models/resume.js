const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid"); // Import the v4 function from the uuid library

const processedDetailsSchema = new Schema({
  rawText: String,
  textType: String,
  metadata: Schema.Types.Mixed
});

const projectSchema = new Schema({
  uniqueId: { type: String, default: () => uuidv4() },
  name: String,
  details: String,
  processedDetails: processedDetailsSchema
});

const companySchema = new Schema({
  uniqueId: { type: String, default: () => uuidv4() },
  name: String,
  details: String,
  processedDetails: processedDetailsSchema,
  projects: [projectSchema]
});

const educationSchema = new Schema({
  uniqueId: { type: String, default: () => uuidv4() },
  name: String,
  details: String,
  processedDetails: processedDetailsSchema
});

const resumeSchema = new Schema({
  uniqueId: { type: String, unique: true, default: () => uuidv4() },
  introduction: String,
  summary: String,
  companies: [companySchema],
  educations: [educationSchema],
  processedDetails: processedDetailsSchema
});

// // Middleware to generate uniqueId before saving
// resumeSchema.pre('save', function (next) {
//     if (!this.uniqueId) {
//       this.uniqueId = uuidv4();
//     }
//     next();
//   });

module.exports = mongoose.model('Resume', resumeSchema);
