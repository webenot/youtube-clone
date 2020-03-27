import app from './app';
import './db';

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 4000;

const handleListening = () => console.log(`✔ Listening on: http://localhost:${process.env.PORT}`);

app.listen(PORT, handleListening);
