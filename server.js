const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { connectDb } = require('./src/models/index');
const categoryRoutes = require('./src/routes/categoryRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
<<<<<<< HEAD
const absenceRoutes = require('./src/routes/absenceRoutes');
const shoppingRoutes = require('./src/routes/shoppingRoutes');
const programmingEmployeeRoutes = require('./src/routes/programmingEmployeeRoutes');
=======
const authRoutes = require('./src/routes/authRoutes');
>>>>>>> 569f53ab7a76a8b15fd7cba7d322f5139f6c369e


dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
<<<<<<< HEAD
=======
<<<<<<< HEAD
app.use('/api/absences', absenceRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/programming', programmingEmployeeRoutes);



=======
app.get('/api/services', async (req, res) => {
    try {
        const services = await Service.findAll(); // Obtiene todos los servicios
        res.json(services); // Envía los servicios como respuesta en formato JSON
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Devuelve un error si ocurre
    }
});

>>>>>>> 71e5d58bd41e5c979a3ca5b3ba06f5cb7a81090e
app.use('/api/auth', authRoutes);
>>>>>>> 569f53ab7a76a8b15fd7cba7d322f5139f6c369e

const PORT = process.env.PORT || 3000;

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});