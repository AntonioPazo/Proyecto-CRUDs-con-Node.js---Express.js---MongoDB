const mongoose = require("mongoose")

const tomateSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del tomate es obligatorio"],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    imagen: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
)

// Nombre exacto de la colección en MongoDB: tomates
module.exports = mongoose.model("Tomate", tomateSchema, "tomates")

