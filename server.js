const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDb } = require('./src/models/index');
const categoryRoutes = require('./src/routes/categoryRoutes');
const userRoutes = require('./src/routes/userRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const permissionRoutes = require('./src/routes/permissionRoutes');
const permissionRoleRoutes = require('./src/routes/permissionRoleRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const absenceRoutes = require('./src/routes/absenceRoutes');
const productRoutes = require('./src/routes/productsRoutes');
const suppliersRoutes = require('./src/routes/suppliersRoutes');
const orderRoutes = require('./src/routes/ordersRoutes');
const shoppingRoutes = require('./src/routes/shoppingRoutes');
const programmingEmployeeRoutes = require('./src/routes/programmingEmployeeRoutes');
const appointment = require('./src/routes/appointment')

dotenv.config();

const app = express();
app.use(cors());

// Configuración del body-parser antes de las rutas
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

app.use('/uploads', express.static('uploads'));
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/permissionsRole', permissionRoleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/absences', absenceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/programming', programmingEmployeeRoutes);
app.use('/api/appointment', appointment);

const PORT = process.env.PORT || 3000;

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
