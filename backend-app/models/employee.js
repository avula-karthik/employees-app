'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Employee extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Employee.belongsTo(models.Department, {
                foreignKey: 'deptID',
                onDelete: 'CASCADE',
            });
        }
    }
    Employee.init(
        {
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            imageurl: {
                type: DataTypes.STRING,
                defaultValue: '/uploads/default.png',
            },
            role: DataTypes.STRING,
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Employee',
        }
    );
    return Employee;
};
