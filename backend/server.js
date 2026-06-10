require('dotenv').config();
const app = require('./app');
const db = require('./model/index');

const PORT = process.env.PORT || 5000;

db.sequelize.authenticate()
    .then(() => {
        console.log('PostgreSQL connected');
        return db.sequelize.sync({ force: false });
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('Startup failed:', err.message);
        process.exit(1); // don't run server if DB is down
    });