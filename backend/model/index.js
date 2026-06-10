const app = require("./App");
const sequelize = require("./model/index"); 
require("dotenv").config();

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
    .then(() => {
        console.log("Database synced");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error("Failed to sync DB:", err));