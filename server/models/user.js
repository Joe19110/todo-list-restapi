module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firebase_uid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      get() {
        return this.getDataValue('birthdate');
      },
      set(value) {
        this.setDataValue('birthdate', value || null);
      }
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    profile_picture: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Task, {
      foreignKey: 'userId',
      as: 'tasks',
      onDelete: 'CASCADE'
    });
  };

  return User;
};
  