let relojes = {};

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
    const selectReloj = document.getElementById("nombreReloj");
    selectReloj.innerHTML = "<option value=''>Seleccionar...</option>";

    if (!relojes[pais]) return;

    relojes[pais].forEach(reloj => {
        if (reloj.Nombre?.includes("RELOJ") || reloj["Nombre del producto"]?.includes("RELOJ")) {
            let option = document.createElement("option");
            option.value = reloj.Nombre || reloj["Nombre del producto"];
            option.textContent = option.value;
            selectReloj.appendChild(option);
        }
    });

    actualizarSeleccion(); // Actualiza los datos al cambiar la lista
}

function filtrarRelojes() {
    const busqueda = document.getElementById("busquedaReloj").value.toLowerCase();
    const selectReloj = document.getElementById("nombreReloj");
    const opciones = selectReloj.getElementsByTagName("option");

    for (let i = 1; i < opciones.length; i++) { // Empezamos desde 1 para no afectar "Seleccionar..."
        let texto = opciones[i].textContent.toLowerCase();
        opciones[i].style.display = texto.includes(busqueda) ? "" : "none";
    }
}

function actualizarDatosReloj() {
    const pais = document.getElementById("pais").value;
    const nombreSeleccionado = document.getElementById("nombreReloj").value;
    const reloj = relojes[pais]?.find(r => r.Nombre === nombreSeleccionado || r["Nombre del producto"] === nombreSeleccionado);

    if (reloj) {
        document.getElementById("idReloj").value = reloj.ID;
        document.getElementById("numImportacion").value = reloj["No de importacion"];
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
    const nombreSeleccionado = document.getElementById("nombreReloj").value;
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
