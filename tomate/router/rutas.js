const express = require("express")
const router = express.Router()

// Ruta de inicio
router.get("/", (req, res) => {
  res.redirect("/tomates")
})

// Ruta para el documentacion
router.get("/documentacion", (req, res) => {
  res.render("documentacion", {
    tituloWeb: "Documentación de la aplicación",
  })
})

module.exports = router

