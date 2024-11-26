const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./src/config/database');
const initializePermissions = require('./src/config/initPermissions');
const initializeRoles = require('./src/config/initRoles');
const initializeAdminRole = require('./src/config/initializeAdminRole');
const seedPrivileges = require('./src/config/privilegesSeeder');
const seedPrivilegePermissionRoles = require('./src/config/privilegePermissionRoleseeder');
const initializeUserAdmin = require('./src/config/initializeUserAdmin');


// Importación de rutas
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
const appointment = require('./src/routes/appointment');
const privilegeRoutes = require('./src/routes/privilegiosRoutes');
const privilegePermissionRoleRoutes = require('./src/routes/privilegePermissionRoleRoutes');

dotenv.config();

const app = express();
app.use(cors());

// Configuración del body-parser
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

// Configuración de rutas estáticas
app.use('/uploads', express.static('uploads'));

// Configuración de rutas de la API

app.use('/api/privileges', privilegeRoutes);
app.use('/api/privilege-permission-roles', privilegePermissionRoleRoutes);
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
app.use('/api/appointment', appointment);


// Función para iniciar el servidor
const startServer = async () => {
    try {
        // Conectar a la base de datos
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // Sincronizar los modelos con la base de datos
        await sequelize.sync();
        console.log('Modelos sincronizados con la base de datos.');

        // Inicializar los permisos automáticamente
        await initializePermissions();
        console.log('Permisos inicializados correctamente.');

        await initializeRoles();
        console.log('Roles inicializados correctamente.');

        await initializeAdminRole();
        console.log('Rol Admin inicializado correctamente.');

        // Ejecutar el seeder de privilegios
        await seedPrivileges();
        console.log('Privilegios sembrados correctamente.');

        // Ejecutar el seeder de PrivilegePermissionRoles
        await seedPrivilegePermissionRoles();
        console.log('PrivilegePermissionRoles sembrados correctamente.');

         await initializeUserAdmin();
         console.log('Usuario Admin inicializado correctamente.');


        // Iniciar el servidor
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Iniciar el servidor
startServer();