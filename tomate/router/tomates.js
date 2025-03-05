// Requerimos las dependencias necesarias
const express = require("express")  // Framework web para Node.js
const router = express.Router()    // Router de Express para manejar las rutas
const multer = require("multer")   // Middleware para manejar la subida de archivos
const Tomate = require("../models/tomate") // El modelo de "Tomate", que interactúa con la base de datos

// Configuración de Multer para almacenar los archivos subidos
const storage = multer.diskStorage({
  // Especificamos la carpeta de destino donde se guardarán las imágenes subidas
  destination: (req, file, cb) => {
    cb(null, "public/uploads")  // Carpeta donde se guardan los archivos
  },
  // Especificamos cómo nombrar los archivos subidos
  filename: (req, file, cb) => {
    // Usamos la fecha actual para evitar nombres duplicados
    cb(null, Date.now() + "-" + file.originalname)  // Nombre único para cada archivo subido
  },
})
// Creamos la configuración de Multer con la variable 'storage'
const upload = multer({ storage: storage })

// Definimos una constante para el número de tomates a mostrar por página
const TOMATES_POR_PAGINA = 6

// Ruta GET principal para mostrar el catálogo de tomates
router.get("/", async (req, res) => {
  const paginaActual = Number.parseInt(req.query.page) || 1  // Obtenemos el número de la página actual desde los parámetros de la URL o por defecto 1
  try {
    // Contamos cuántos tomates hay en total en la base de datos
    const totalTomates = await Tomate.countDocuments()
    // Buscamos los tomates que se deben mostrar para la página actual, con paginación
    const tomates = await Tomate.find()
      .skip((paginaActual - 1) * TOMATES_POR_PAGINA)  // Skip: omite los elementos anteriores según la página actual
      .limit(TOMATES_POR_PAGINA)  // Limitamos la cantidad de resultados por página
    
    // Renderizamos la vista "index" y pasamos los tomates y la información de paginación
    res.render("index", {
      tituloWeb: "Catálogo de Tomates",
      tomates: tomates,
      paginaActual: paginaActual,
      totalPaginas: Math.ceil(totalTomates / TOMATES_POR_PAGINA),  // Calculamos el número total de páginas
    })
  } catch (error) {
    // Si ocurre un error, mostramos un mensaje de error y redirigimos al inicio
    req.flash("error_msg", "Error al obtener tomates.")
    res.redirect("/")
  }
})

// Ruta POST para agregar un nuevo tomate
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    // Creamos un nuevo objeto de tomate con los datos del formulario y la imagen subida
    const nuevoTomate = new Tomate({
      nombre: req.body.nombre,  // Nombre del tomate
      descripcion: req.body.descripcion,  // Descripción del tomate
      precio: req.body.precio,  // Precio del tomate
      imagen: req.file ? req.file.filename : null,  // Si se sube una imagen, se guarda su nombre de archivo
    })
    // Guardamos el nuevo tomate en la base de datos
    await nuevoTomate.save()
    // Mostramos un mensaje de éxito y redirigimos a la página de tomates
    req.flash("success_msg", "Tomate agregado exitosamente.")
    res.redirect("/tomates")
  } catch (error) {
    // Si ocurre un error, mostramos un mensaje de error y redirigimos a la página de tomates
    req.flash("error_msg", "Error al crear tomate.")
    res.redirect("/tomates")
  }
})

// Ruta POST para editar un tomate existente
router.post("/editar/:id", upload.single("imagen"), async (req, res) => {
  try {
    // Creamos un objeto con los datos del tomate a actualizar
    const updateData = {
      nombre: req.body.nombre,  // Nuevo nombre del tomate
      descripcion: req.body.descripcion,  // Nueva descripción del tomate
      precio: req.body.precio,  // Nuevo precio del tomate
    }

    // Si se sube una nueva imagen, la agregamos al objeto de actualización
    if (req.file) {
      updateData.imagen = req.file.filename  // Actualizamos la imagen con el nuevo archivo
    }

    // Buscamos el tomate por su ID y actualizamos con los nuevos datos
    await Tomate.findByIdAndUpdate(req.params.id, updateData)
    // Mostramos un mensaje de éxito y redirigimos a la página de tomates
    req.flash("success_msg", "Tomate actualizado exitosamente.")
    res.redirect("/tomates")
  } catch (error) {
    // Si ocurre un error, mostramos un mensaje de error y redirigimos a la página de tomates
    req.flash("error_msg", "Error al actualizar tomate.")
    res.redirect("/tomates")
  }
})

// Ruta POST para eliminar un tomate
router.post("/eliminar/:id", async (req, res) => {
  try {
    // Buscamos el tomate por su ID y lo eliminamos
    await Tomate.findByIdAndDelete(req.params.id)
    // Mostramos un mensaje de éxito y redirigimos a la página de tomates
    req.flash("success_msg", "Tomate eliminado exitosamente.")
    res.redirect("/tomates")
  } catch (error) {
    // Si ocurre un error, mostramos un mensaje de error y redirigimos a la página de tomates
    req.flash("error_msg", "Error al eliminar tomate.")
    res.redirect("/tomates")
  }
})

// Exportamos el router para usarlo en otros archivos
module.exports = router
