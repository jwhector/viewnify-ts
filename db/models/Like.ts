import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import User from "./User";
import { connection } from "./init";

class Like extends Model<InferAttributes<Like>, InferCreationAttributes<Like>> {
    declare id: CreationOptional<number>;
    declare tmdbId: string;
    declare userId: ForeignKey<User["id"]>;

    declare owner?: NonAttribute<User>;
}

Like.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    tmdbId:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    sequelize: connection,
    freezeTableName: true,
    underscored: true,
    tableName: 'likes',
});

export default Like;