let relojes = {};

function cargarExcel() {
    const file = document.getElementById("fileInput").files[0];
    if (!file) return alert("Por favor, selecciona un archivo");

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        
        // Cargar datos de cada país
        relojes = {
            "COL": XLSX.utils.sheet_to_json(workbook.Sheets["INVENTARIO COL"]),
            "ECU": XLSX.utils.sheet_to_json(workbook.Sheets["INVENTARIO ECUADOR DP"]),
            "VEN": XLSX.utils.sheet_to_json(workbook.Sheets["INVENTARIO SOCIEDAD"]),
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
}

function actualizarDatosReloj() {
    const pais = document.getElementById("pais").value;
    const campana = document.getElementById("campana").value;
    const fecha = document.getElementById("fecha").value;
    const nombreSeleccionado = document.getElementById("nombreReloj").value;
    const persona = document.getElementById("persona").value;
    const reloj = relojes[pais]?.find(r => r.Nombre === nombreSeleccionado || r["Nombre del producto"] === nombreSeleccionado);

    if (reloj) {
        document.getElementById("idReloj").value = reloj.ID;
        document.getElementById("numImportacion").value = reloj["No de importacion"];
        const textoFinal = `${pais}-${campana}-${fecha}-${nombreSeleccionado}-${reloj.ID}-${reloj["No de importacion"]}-${persona}`;
        document.getElementById("seleccionActual").value = textoFinal;
    } else {
        document.getElementById("idReloj").value = "";
        document.getElementById("numImportacion").value = "";
        document.getElementById("seleccionActual").value = "";
    }
}

function copiarTexto() {
    const texto = document.getElementById("seleccionActual");
    texto.select();
    document.execCommand("copy");
    alert("Texto copiado al portapapeles");
}