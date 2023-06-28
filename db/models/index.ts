import { connection } from "./init";
import User from "./User";
import Like from "./Like";
import Dislike from "./Dislike";

const db = {
    initialize,
    User,
    Like,
    Dislike
}

db.User.hasMany(db.Like, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "likes"
});

async function initialize() {
    await connection.sync({ alter: true });
    
    return true;
}

export default db;