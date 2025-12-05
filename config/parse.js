import Parse from 'parse/node.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Parse SDK
Parse.initialize(
    process.env.BACK4APP_APP_ID,
    process.env.BACK4APP_JAVASCRIPT_KEY,
    process.env.BACK4APP_MASTER_KEY
);

Parse.serverURL = process.env.BACK4APP_SERVER_URL;

export default Parse;
