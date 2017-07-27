const bcrypt = require('bcrypt');
const config = require('../config');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      validate: { min: 6 },
      allowNull: false
    },
    avatar: DataTypes.STRING,
    contact: {
      type: DataTypes.INTEGER,
      unique: true,
      isNumeric: true,
      max: 10,
      allowNull: false,
    },
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
      beforeCreate: (user, options) => {
        return User.hashPassword(user.password).then(hashedPw => {
          user.password = hashedPw;
        });
      },
      beforeUpdate: (user, options) => {
        if (!user.password) return;
        return User.hashPassword(user, (err, hash) => {
          user.password = hash;
        });
      },
      afterCreate: () => {
        // Do stuff like logging, sending notifications or emails
      }
    },
    // classMethods: {
    //   associate: function(models) {
    //     // associations can be defined here
    //     User.hasMany(models.accessToken, {
    //       onDelete: 'cascade',
    //       hooks: true,
    //       as: 'tokens'
    //     });
    //   },
    // },
    getterMethods: {
    }
  });

  User.associate = (models) => {
    User.hasMany(models.accessToken, {
      onDelete: 'cascade',
      hooks: true,
      as: 'tokens'
    });
  };

  User.validatePassword = (password, hash) => {
    return new Promise((resolve, reject) =>
      bcrypt.compare(
        password,
        hash,
        (err, isValid) => (err ? reject(err) : resolve(isValid))
      )
    );
  };

  User.hashPassword = (password) => {
    return new Promise((resolve, reject) =>
      bcrypt
        .hash(password, config.bcrypt.rounds)
        .then(hash => resolve(hash))
        .catch(err => reject())
    );
  };

  return User;
};
