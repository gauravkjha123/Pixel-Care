'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await  queryInterface.bulkInsert('Users',[
        {
          role:1,
          first_name:"admin",
          user_name:"admin@123",
          password:"$2a$10$P9KP7I0HsE5veOtDyHtejOc46eegOph5mBRq9svythcckBVAqX4ne",
          status:1,
          phone_number:"123456789",
          created_at:new Date(),
          updated_at:new Date()
        }
      ]);
    } catch (error) {
      console.log(error);
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
