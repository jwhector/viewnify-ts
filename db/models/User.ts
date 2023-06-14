import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "./init";
import { hashSync } from "bcrypt";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare password: string;
    declare email: string;
    declare genres: CreationOptional<string>;
    declare services: CreationOptional<string>;
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
        unique: true,
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
    },    
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
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'user'
})

export default User;