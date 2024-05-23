const Resume = require("../../common/models/resume");
const { v4: uuidv4 } = require("uuid");

const GraphQLJSON = require("graphql-type-json");

const resolvers = {
    JSON: GraphQLJSON,

    Query: {
        getResume: async (_, { uniqueId }) => {
            return await Resume.findOne({ uniqueId });
        },
        getAllResumes: async () => {
            return await Resume.find();
        },
    },
    Mutation: {
        upsertResume: async (_, { resume }) => {
            // Generate uniqueId if it's null or undefined
            console.log(
                "resumeResolvers : upsertResume Mutation : resume.uniqueId:",
                resume.uniqueId
            ); // corrected console log

            if (!resume.uniqueId) {
                resume.uniqueId = uuidv4();
            }

            // Generate unique IDs for companies if they are null or undefined
            if (resume.companies && resume.companies.length > 0) {
                resume.companies.forEach((company) => {
                    if (!company.uniqueId) {
                        company.uniqueId = uuidv4();
                    }
                    if (company.projects && company.projects.length > 0) {
                        company.projects.forEach((project) => {
                            if (!project.uniqueId) {
                                project.uniqueId = uuidv4();
                            }
                        });
                    }
                });
            }

            // Generate unique IDs for companies if they are null or undefined
            if (resume.educations && resume.educations.length > 0) {
                resume.educations.forEach((education) => {
                    if (!education.uniqueId) {
                        education.uniqueId = uuidv4();
                    }
                });
            }

            console.log(
                "resumeResolvers : upsertResume Mutation : resume :",
                JSON.stringify(resume)
            );

            // Logic to upsert the resume document in MongoDB
            // Here you can update the logic to handle both create and update operations
            // For simplicity, we'll use findOneAndUpdate with upsert option
            return await Resume.findOneAndUpdate(
                { uniqueId: resume.uniqueId },
                resume,
                { upsert: true, new: true }
            );
        },
    },
};

module.exports = resolvers;
