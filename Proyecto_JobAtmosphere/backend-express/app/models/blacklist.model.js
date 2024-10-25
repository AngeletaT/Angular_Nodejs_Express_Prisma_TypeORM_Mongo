const mongoose = require('mongoose');

// Definir el esquema de la blacklist
const blacklistSchema = new mongoose.Schema(
     {
          token: {
               type: String,
               required: true,
               unique: true, 
          },
          userId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User', 
               required: true,
          },
     },
     {
          collection: 'Blacklist'
     },
     {
          timestamps: true, 
     }
);

// Crear el modelo
const Blacklist = mongoose.model('Blacklist', blacklistSchema);

module.exports = Blacklist;