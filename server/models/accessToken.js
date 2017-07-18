const { generateUUID } = require('../utils');

module.exports = function(sequelize, DataTypes) {
  var AccessToken = sequelize.define('accessToken', {
    token: {
      type: DataTypes.STRING,
      unique: true,
      defaultValue: () => generateUUID()
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    device: DataTypes.STRING,
    location: DataTypes.STRING,
    latitude: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { min: -90, max: 90 }
    },
    longitude: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { min: -180, max: 180 }
    },
    ip: {
      type: DataTypes.STRING,
      validate: {
        isIP: true,
      },
      allowNull: true
    }
  }, {
    hooks: {
    },
    // classMethods: {
    //   associate: function(models) {
    //     console.log(models.user);
    //     // associations can be defined here
    //     AccessToken.belongsTo(models.user);
    //   }
    // }
  });
  AccessToken.associate = (models) => {
    console.log(models.user);
    AccessToken.belongsTo(models.user, {
      // as: 'user'
      // foreignKey: 'user'
    });
  };
  return AccessToken;
};
