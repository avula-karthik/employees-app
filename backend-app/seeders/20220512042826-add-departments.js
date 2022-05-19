'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'Departments',
            [
                {
                    dept_name: 'Engineering',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    dept_name: 'People and Culture',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    dept_name: 'Operations',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    dept_name: 'Management',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        const Op = Sequelize.Op;
        await queryInterface.bulkDelete('Departments', {
            [Op.or]: [
                { dept_name: 'Engineering' },
                { dept_name: 'People and Culture' },
                { dept_name: 'Operations' },
                { dept_name: 'Management' },
            ],
        });
    },
};
