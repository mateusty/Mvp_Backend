import express from 'express';
import authRoutes from './routes/authRoute.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log("Ta funcionando")
});