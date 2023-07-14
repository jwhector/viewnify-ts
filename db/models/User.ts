import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, Association } from "sequelize";
import { connection } from "./init";
import { hashSync } from "bcrypt";
import Like from "./Like";

class User extends Model<InferAttributes<User, { omit: "likes" }>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare password: string;
    declare email: string;
    declare genres: CreationOptional<string>;
    declare services: CreationOptional<string>;

    declare likes?: NonAttribute<Like[]>;

    declare static associations: { likes: Association<User, Like> };
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    // username: {
    //     type: DataTypes.STRING,
    //     trim: true,
    //     unique: true,
    //     allowNull: false,
    //     validate: {
    //         len: [6,30]
    //     }
    // },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len:[8, 28]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    genres: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
    },
    services: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
    }
},{
    hooks:{
        beforeCreate(newUser) {
            // newUser.username = newUser.username.toLowerCase();
            newUser.password = hashSync(newUser.password, 5);
        },
        beforeUpdate(updatedUser) {
            // updatedUser.username = updatedUser.username.toLowerCase();
            updatedUser.password = hashSync(updatedUser.password, 5);
        }
    },
    indexes: [
        { fields: ["email"], name: "UQ_Email", unique: true }
    ],
    sequelize: connection,
    freezeTableName: true,
    underscored: true,
    tableName: 'users'
});

export default User;