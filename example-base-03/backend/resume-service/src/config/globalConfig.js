const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ms_playground_ex03_resume_db',
  port: process.env.PORT || 4000,
  bodyParserLimit: process.env.BODY_PARSER_LIMIT || '60mb',
};
