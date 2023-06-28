import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import User from "./User";
import { connection } from "./init";

class Dislike extends Model<InferAttributes<Dislike>, InferCreationAttributes<Dislike>> {
    declare id: CreationOptional<number>;
    declare tmdbId: string;
    declare userId: ForeignKey<User["id"]>;

    declare owner?: NonAttribute<User>;
}

Dislike.init({
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
    modelName: 'dislike',
});

export default Dislike;