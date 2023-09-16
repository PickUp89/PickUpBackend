import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";

interface UserAttributes {
  id: typeof DataTypes.UUID,
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  location: string;
  profilePicture: string;
  permissions: string[];
  googleId: string;
  biography: string;
  sports: string;
  isGoogleAuthenticated: boolean;
  attendingEvents: string[]; // this store the list of posts id that the user is attending
  savedEvents: string[]; // this store the list of posts id that user saved for later
}

interface UserInstance extends Model<UserAttributes>, UserAttributes {}

const User = sequelize.define<UserInstance>("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePicture: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  permissions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [""],
    allowNull: false,
  },
  biography: {
    type: DataTypes.TEXT,
    defaultValue: "",
    allowNull: true,
  },
  sports : {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [""],
    allowNull: false,
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  isGoogleAuthenticated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  attendingEvents: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
    allowNull : true,
  },
  savedEvents: {
    type : DataTypes.ARRAY(DataTypes.UUID),
    defaultValue : [],
    allowNull : true,
  }
});

export default User;