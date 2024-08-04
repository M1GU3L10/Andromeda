const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { connectDb } = require('./src/models');
const categoryRoutes = require('./src/routes/categoryRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const absenceRoutes = require('./src/routes/absenceRoutes');
const shoppingRoutes = require('./src/routes/shoppingRoutes');
const programmingEmployeeRoutes = require('./src/routes/programmingEmployeeRoutes');


dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/absences', absenceRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/programming', programmingEmployeeRoutes);




const PORT = process.env.PORT || 3000;

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
