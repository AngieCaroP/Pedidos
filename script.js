let relojes = {}; // Almacén de relojes cargados desde Excel

function cargarExcel() {
    const file = document.getElementById("fileInput").files[0];
    if (!file) return alert("Por favor, selecciona un archivo");

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        relojes = {
            "COL": XLSX.utils.sheet_to_json(workbook.Sheets["INVENTARIO COL"]),
            "ECU": XLSX.utils.sheet_to_json(workbook.Sheets["INVENTARIO ECUADOR DP"]),
            "VEN": XLSX.utils.sheet_to_json(workbook.Sheets["INVENTARIO VENEZUELA"]),
        };

        actualizarListaRelojes();
    };
    reader.readAsArrayBuffer(file);
}

function actualizarListaRelojes() {
    const pais = document.getElementById("pais").value;
    if (!relojes[pais]) return;

    const listaRelojes = document.getElementById("listaRelojes");
    listaRelojes.innerHTML = ""; // Limpiar lista anterior

    relojes[pais].forEach(reloj => {
        if (reloj.Nombre?.includes("RELOJ") || reloj["Nombre del producto"]?.includes("RELOJ")) {
            let option = document.createElement("option");
            option.value = reloj.Nombre || reloj["Nombre del producto"];
            listaRelojes.appendChild(option);
        }
    });
}

// 🔍 Filtro inteligente en el campo de búsqueda
function filtrarRelojes() {
    const pais = document.getElementById("pais").value;
    const busqueda = document.getElementById("busquedaReloj").value.toLowerCase();
    const listaRelojes = document.getElementById("listaRelojes");

    listaRelojes.innerHTML = ""; // Limpiar lista anterior

    if (!relojes[pais]) return;

    relojes[pais].forEach(reloj => {
        const nombre = (reloj.Nombre || reloj["Nombre del producto"] || "").toLowerCase();

        if (nombre.includes(busqueda)) {
            let option = document.createElement("option");
            option.value = reloj.Nombre || reloj["Nombre del producto"];
            listaRelojes.appendChild(option);
        }
    });
}

// 🎯 Cuando el usuario selecciona un reloj, llena los datos automáticamente
function actualizarDatosReloj() {
    const pais = document.getElementById("pais").value;
    const nombreSeleccionado = document.getElementById("busquedaReloj").value;
    const reloj = relojes[pais]?.find(r => r.Nombre === nombreSeleccionado || r["Nombre del producto"] === nombreSeleccionado);

    if (reloj) {
        document.getElementById("idReloj").value = reloj.ID || "Sin ID";
        document.getElementById("numImportacion").value = reloj["No de importacion"] || "Sin número de importación";
    } else {
        document.getElementById("idReloj").value = "";
        document.getElementById("numImportacion").value = "";
    }

    actualizarSeleccion();
}

function actualizarSeleccion() {
    const pais = document.getElementById("pais").value;
    const campana = document.getElementById("campana").value;
    const fecha = document.getElementById("fecha").value;
    const nombreSeleccionado = document.getElementById("busquedaReloj").value;
    const idReloj = document.getElementById("idReloj").value;
    const persona = document.getElementById("persona").value;
    const numImportacion = document.getElementById("numImportacion").value;

    const textoFinal = `${pais}-${campana}-${fecha}-${nombreSeleccionado}-${idReloj}-${persona}-${numImportacion}`;
    document.getElementById("seleccionActual").value = textoFinal;
}

function copiarTexto() {
    const texto = document.getElementById("seleccionActual");
    texto.select();
    document.execCommand("copy");
    alert("Texto copiado al portapapeles");
}
