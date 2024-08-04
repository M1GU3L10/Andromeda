const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { connectDb } = require('./src/models/index');
const categoryRoutes = require('./src/routes/categoryRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const authRoutes = require('./src/routes/authRoutes');


dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.get('/api/services', async (req, res) => {
    try {
        const services = await Service.findAll(); // Obtiene todos los servicios
        res.json(services); // Envía los servicios como respuesta en formato JSON
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Devuelve un error si ocurre
    }
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});