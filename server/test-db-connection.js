const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('todo_app', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
}

testConnection();
