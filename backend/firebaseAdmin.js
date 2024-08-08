// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./config/firebase-service-account.json'); // Ruta a tu archivo de clave de servicio

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;