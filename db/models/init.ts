import { Sequelize } from "sequelize";

export let sequelize: Sequelize;

if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else if (process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD) {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: "localhost",
            dialect: "mysql",
            port: 3306
        }
    )
} else {
    throw new Error("Missing environmental variables.");
}