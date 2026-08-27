const express = require('express');
const app = express();
const PORT = 8080;

const loginRoutes = require('./routes/loginRoute');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/login', loginRoutes);

app.listen(PORT, () => {
    console.log("Ta funcionando")
});