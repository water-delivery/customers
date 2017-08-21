module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      // validate: { min: 6 },
      // allowNull: false
    },
    avatar: DataTypes.STRING,
    contact: {
      type: DataTypes.INTEGER,
      unique: true,
      isNumeric: true,
      max: 10,
      allowNull: false,
    },
    // activeAddress: {
    //   type: DataTypes.INTEGER
    // },
    description: DataTypes.STRING,
    email: DataTypes.STRING,
    // verifiedAt: {
    //   type: DataTypes.DATE
    // },
    roles: {
      type: DataTypes.ENUM,
      values: ['user', 'admin'],
      defaultValue: 'user'
    },

  }, {
    hooks: {
      beforeCreate: () => {
      },
      beforeUpdate: () => {
      },
      afterCreate: () => {
        // Do stuff like logging, sending notifications or emails
      }
    },

    getterMethods: {
    }
  });

  User.associate = (models) => {
    User.hasMany(models.accessToken, {
      onDelete: 'cascade',
      hooks: true,
      as: 'tokens'
    });

    User.hasMany(models.address, {
      onDelete: 'cascade'
    });

    // User.hasOne(models.address, { as: 'activeAddress' });
  };

  return User;
};
