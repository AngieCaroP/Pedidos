# Watch Campaign Console  

Este proyecto es una **consola de configuración de campañas** para una tienda de relojería. Permite gestionar las campañas publicitarias que se lanzarán en Facebook, asegurando que cada campaña tenga la información correcta.  

## 🚀 Funcionalidades  

- Selección de **país**: Ecuador, Colombia o Venezuela.  
- Elección del **tipo de campaña**: CBO, ABO o FLEXIBLE.  
- Selección de **fecha** mediante un calendario interactivo.  
- Carga de un archivo **Excel** como base de datos, permitiendo la selección de relojes desde una lista desplegable.  
- Autocompletado del **ID del reloj** y el **número de importación** basado en la base de datos cargada.  
- Opción para asignar la persona responsable de la campaña (DP, CP, KO).  

## 📁 Estructura del Proyecto  

📂 Campaña ├── 📄 index.html # Estructura principal de la consola ├── 📄 styles.css # Estilos de la interfaz ├── 📄 script.js # Lógica de interacción y carga de datos └── 📄 README.md # Documentación del proyecto


## 📌 Cómo Usarlo  

1. **Descarga** o **clona** el repositorio:  
   ```sh
   git clone https://github.com/AP/Campa-a.git
   cd Campaña

Abre index.html en tu navegador.

Carga un archivo Excel con los datos de los relojes (debe contener columnas como Nombre, ID, Importacion).

Selecciona un reloj de la lista desplegable y observa cómo se llenan automáticamente el ID y el número de importación.

📦 Tecnologías Usadas
HTML, CSS, JavaScript

XLSX.js para la lectura de archivos Excel

✨ Contribución
Si deseas mejorar este proyecto, siéntete libre de hacer un fork y enviar un pull request con tus mejoras.

📌 Autor: AP

