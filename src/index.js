import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './db.js';
import cors from 'cors';
import fileupload from 'express-fileupload';
import router from './routes/index.js';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/ErrorHandlingMiddleware.js';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);

const app = express();
app.use(cors()); // подключаем cors
app.use(express.json()); // подключаем конвертацию json
app.use(fileupload({})); // подключаем обработку изобрражений
app.use(express.static(path.resolve(__dirname, 'static')));
app.use('/api', router);

// Обработка ошибок, заключительнный  middleware
app.use(errorHandler);
dotenv.config();
const PORT = process.env.PORT || 5000;

console.log('PORT:', process.env.PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`Server PORT ${PORT} ok, Hello Kostya!!!`);
    });
  } catch (error) {
    console.error(error, 'Ошибка подключения к серверру');
  }
};

start();

// app.listen(PORT, () => {
//   try {
//     console.log(`Server PORT ${PORT} ok, Hello Kostya!!!`);
//   } catch (error) {
//     console.error(error, 'Ошибка подключения к серверру');
//   }
// });
