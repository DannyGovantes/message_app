const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './.env'});
const db = process.env.DATABASE.replace("<PASSWORD>",process.env.DATABASE_PASSWORD);
const port = process.env.PORT;

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(connection => {
    console.log("CONNECTED");
});

const server = app.listen(port, () => {
    console.log(`Conneted to port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
})
