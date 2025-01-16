const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        let mongoDatabase = process.env.MONGO_URI;

        if (process.env.NODE_ENV === 'test') {
            mongoDatabase = process.env.MONGO_TEST;
        }

        await mongoose.connect(mongoDatabase, {
        });
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
module.exports = connectDB;