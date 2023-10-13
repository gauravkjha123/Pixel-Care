'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert('Contacts',[
        {
          name:"admin",
          email:"admin@gmail.com",
          phone_number:"1234567895",
          description:"Contact us on given email or phone number",
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
