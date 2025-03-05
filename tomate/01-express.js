// Cargar variables de entorno desde el archivo .env
require("dotenv").config()

// Importar módulos necesarios
const express = require("express") // Framework para manejar el servidor
const mongoose = require("mongoose") // ODM para MongoDB
const bodyParser = require("body-parser") // Middleware para procesar datos de formularios
const path = require("path") // Módulo para manejar rutas de archivos
const session = require("express-session") // Middleware para gestionar sesiones
const flash = require("connect-flash") // Middleware para mensajes flash (notificaciones temporales)

// Crear una instancia de la aplicación Express
const app = express()
const PORT = process.env.PORT || 4000 // Definir el puerto, usando el de las variables de entorno o el 4000 por defecto

// Conectar a la base de datos MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true, // Usa el nuevo parser de URL de MongoDB
    useUnifiedTopology: true, // Usa el nuevo motor de administración de conexiones
  })
  .then(() => console.log("Conectado a MongoDB")) // Mensaje en consola si la conexión es exitosa
  .catch((err) => console.error("Error de conexión:", err)) // Captura y muestra cualquier error de conexión

// Middleware para procesar datos enviados desde formularios
app.use(bodyParser.urlencoded({ extended: true }))

// Configurar carpeta de archivos estáticos (CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, "public")))

// Configuración del motor de plantillas EJS
app.set("view engine", "ejs") // Usar EJS como motor de vistas
app.set("views", [path.join(__dirname, "views"), path.join(__dirname, "template")]) // Directorios donde buscar las vistas

// Configurar sesiones
app.use(
  session({
    secret: "secret", // Clave para firmar la cookie de sesión (debería estar en una variable de entorno)
    resave: false, // No guardar sesión si no hay cambios
    saveUninitialized: true, // Guardar sesiones vacías (puede optimizarse poniéndolo en false)
  })
)

// Configurar mensajes flash (notificaciones temporales entre peticiones)
app.use(flash())

// Middleware para hacer disponibles los mensajes flash en todas las vistas
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg") // Mensajes de éxito
  res.locals.error_msg = req.flash("error_msg") // Mensajes de error
  next() // Continuar con la siguiente función en la cadena de middleware
})

// Importar y usar las rutas definidas en archivos separados
app.use("/", require("./router/rutas")) // Rutas principales
app.use("/tomates", require("./router/tomates")) // Rutas específicas para "/tomates"

// Middleware para manejar errores 404 (página no encontrada)
app.use((req, res) => {
  res.status(404).render("404", {
    tituloWeb: "Error 404",
    descripcion: "Página no encontrada",
  })
})

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`🚀 Servidor funcionando en http://localhost:${PORT}`)
})
