const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "ques_ans_db";

const JSON_FILE = path.join(__dirname, "questions.json");

async function main() {
    const client = new MongoClient(MONGO_URI);

    try {
        console.log("====================================");
        console.log("Questions -> MongoDB Importer");
        console.log("====================================");
        console.log(`JSON file : ${JSON_FILE}`);
        console.log(`MongoDB   : ${MONGO_URI}`);
        console.log(`Database  : ${DB_NAME}`);
        console.log("");

        // -------------------------------------------------
        // Read questions.json
        // -------------------------------------------------

        if (!fs.existsSync(JSON_FILE)) {
            throw new Error(`File not found: ${JSON_FILE}`);
        }

        const json = fs.readFileSync(JSON_FILE, "utf-8");
        const data = JSON.parse(json);

        if (!Array.isArray(data.tags)) {
            throw new Error(
                "Invalid questions.json: 'tags' must be an array."
            );
        }

        if (!Array.isArray(data.questions)) {
            throw new Error(
                "Invalid questions.json: 'questions' must be an array."
            );
        }

        console.log(`Tags found      : ${data.tags.length}`);
        console.log(`Questions found : ${data.questions.length}`);
        console.log("");

        // -------------------------------------------------
        // Connect MongoDB
        // -------------------------------------------------

        await client.connect();

        console.log("Connected to MongoDB");
        console.log("");

        const db = client.db(DB_NAME);

        const tagsCollection = db.collection("tags");
        const questionsCollection = db.collection("questions");

        // -------------------------------------------------
        // Indexes
        // -------------------------------------------------

        await tagsCollection.createIndex(
            { slug: 1 },
            { unique: true }
        );

        await questionsCollection.createIndex({
            tagIds: 1
        });

        // -------------------------------------------------
        // Import Tags
        // -------------------------------------------------

        console.log("Importing tags...");

        let importedTags = 0;

        for (const tag of data.tags) {
            if (!tag.id) {
                console.warn("Skipping tag without id:", tag);
                continue;
            }

            if (!tag.name || !tag.name.trim()) {
                console.warn("Skipping tag without name:", tag);
                continue;
            }

            const name = tag.name.trim();

            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

            await tagsCollection.updateOne(
                { _id: tag.id },
                {
                    $set: {
                        name,
                        slug,
                        updatedAt: new Date()
                    },
                    $setOnInsert: {
                        createdAt: new Date()
                    }
                },
                { upsert: true }
            );

            importedTags++;
        }

        console.log(`Tags imported : ${importedTags}`);
        console.log("");

        // -------------------------------------------------
        // Import Questions
        // -------------------------------------------------

        console.log("Importing questions...");

        let importedQuestions = 0;

        for (const item of data.questions) {
            if (!item.id) {
                console.warn(
                    "Skipping question without id:",
                    item.question
                );
                continue;
            }

            const answers = Array.isArray(item.answers)
                ? item.answers.map((answer) => {
                    if (typeof answer === "string") {
                        return {
                            id: null,
                            title: "Answer",
                            markdown: answer
                        };
                    }

                    return {
                        id: answer.id || null,
                        title: answer.title || "Answer",
                        markdown: answer.markdown || ""
                    };
                })
                : [];

            const tagIds = Array.isArray(item.tags)
                ? item.tags
                : [];

            await questionsCollection.updateOne(
                { _id: item.id },
                {
                    $set: {
                        question: item.question || "",
                        answers,
                        tagIds,
                        updatedAt: new Date()
                    },
                    $setOnInsert: {
                        createdAt: new Date()
                    }
                },
                { upsert: true }
            );

            importedQuestions++;

            console.log(
                `  [${importedQuestions}/${data.questions.length}] ${item.question || "(empty question)"}`
            );
        }

        console.log("");
        console.log("====================================");
        console.log("Import completed successfully");
        console.log("====================================");

        const tagCount = await tagsCollection.countDocuments();
        const questionCount =
            await questionsCollection.countDocuments();

        console.log(`MongoDB tags      : ${tagCount}`);
        console.log(`MongoDB questions : ${questionCount}`);
        console.log("");

    } catch (error) {
        console.error("");
        console.error("Import failed:");
        console.error(error);
        process.exitCode = 1;
    } finally {
        await client.close();
        console.log("MongoDB connection closed");
    }
}

main();
