const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnection");

const User = sequelize.define("User", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("SPECIAL", "ADMIN", "NORMAL"),
    defaultValue: "NORMAL",
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Associations

// User.associate = (models) => {
//     User.belongsToMany(models.Course, { through: 'UserCourses', foreignKey: 'userId' });
//     User.belongsToMany(models.ClassRoom, { through: 'UserClasses', foreignKey: 'userId' });
// };

module.exports = { User };
