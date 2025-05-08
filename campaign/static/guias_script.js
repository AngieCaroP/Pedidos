// Inicializar jsPDF
const { jsPDF } = window.jspdf;

// Obtener guías del localStorage
let guias = JSON.parse(localStorage.getItem('guiasGeneradas')) || [];

// Inicializar contadores (comienzan en 1)
let contadores = JSON.parse(localStorage.getItem('contadoresGuias')) || { 
  facebook: 1, 
  tiktok: 1 
};

const historialDiv = document.getElementById('historialGuias');
const inputBuscar = document.getElementById('buscarGuia');
const inputFecha = document.getElementById('filtrarFecha');
const contadorFb = document.getElementById('contador-fb');
const contadorTt = document.getElementById('contador-tt');

// Formatear número a 3 dígitos (001, 002, etc.)
function formatearContador(num) {
  return num.toString().padStart(3, '0');
}

// Actualizar contadores visuales
function actualizarContadores() {
  contadorFb.textContent = formatearContador(contadores.facebook);
  contadorTt.textContent = formatearContador(contadores.tiktok);
}

// Función para limpiar el historial
function limpiarHistorial() {
  if (confirm('¿Estás seguro de que deseas eliminar todo el historial de guías y reiniciar los contadores? Esta acción no se puede deshacer.')) {
    localStorage.removeItem('guiasGeneradas');
    guias = [];
    
    // Reiniciar contadores a 1
    contadores = { facebook: 1, tiktok: 1 };
    localStorage.setItem('contadoresGuias', JSON.stringify(contadores));
    
    renderHistorial();
    actualizarContadores();
  }
}

// Función para exportar a TXT
function exportarTXT() {
  let contenido = 'Historial de Guías Generadas\n\n';
  
  guias.forEach(g => {
    contenido += `[${g.fecha}] ${g.texto}\n`;
  });
  
  const blob = new Blob([contenido], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `historial_guias_${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// Función para exportar a Excel
function exportarExcel() {
  const datos = guias.map(g => ({
    'Fecha': g.fecha,
    'Plataforma': g.plataforma === 'F' ? 'Facebook' : g.plataforma === 'T' ? 'TikTok' : 'Otra',
    'Guía': g.texto
  }));
  
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet(datos);
  XLSX.utils.book_append_sheet(libro, hoja, 'Historial Guías');
  XLSX.writeFile(libro, `historial_guias_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// Función para exportar a PDF
function exportarPDF() {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.text('Historial de Guías Generadas', 105, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
  
  let y = 35;
  let currentPage = 1;
  
  // Agrupar por fecha
  const guiasPorFecha = {};
  guias.forEach(g => {
    if (!guiasPorFecha[g.fecha]) guiasPorFecha[g.fecha] = [];
    guiasPorFecha[g.fecha].push(g);
  });
  
  // Ordenar fechas de más reciente a más antigua
  Object.keys(guiasPorFecha).sort((a, b) => new Date(b) - new Date(a)).forEach(fecha => {
    // Verificar si necesitamos nueva página
    if (y > 250) {
      doc.addPage();
      currentPage++;
      y = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text(`📅 ${fecha}`, 14, y);
    y += 10;
    
    // Agrupar por plataforma
    const plataformas = {
      'Facebook': { guias: [], color: [66, 103, 178] },
      'TikTok': { guias: [], color: [254, 44, 85] },
      'Otras': { guias: [], color: [0, 123, 255] }
    };
    
    guiasPorFecha[fecha].forEach(g => {
      let plataforma = g.plataforma === 'F' ? 'Facebook' : 
                      g.plataforma === 'T' ? 'TikTok' : 'Otras';
      
      if (plataforma === 'Otras') {
        const primeraLetra = g.texto.split('-')[1]?.charAt(0)?.toUpperCase();
        if (primeraLetra === 'F') plataforma = 'Facebook';
        else if (primeraLetra === 'T') plataforma = 'TikTok';
      }
      
      plataformas[plataforma].guias.push(g.texto);
    });
    
    // Añadir guías por plataforma
    for (const [nombrePlataforma, datos] of Object.entries(plataformas)) {
      if (datos.guias.length === 0) continue;
      
      // Verificar si necesitamos nueva página
      if (y > 250) {
        doc.addPage();
        currentPage++;
        y = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(...datos.color);
      doc.text(`${nombrePlataforma}:`, 14, y);
      y += 7;
      
      datos.guias.forEach(texto => {
        // Verificar si necesitamos nueva página
        if (y > 250) {
          doc.addPage();
          currentPage++;
          y = 20;
        }
        
        doc.setFontSize(10);
        doc.setTextColor(40, 40, 40);
        doc.text(`- ${texto}`, 20, y);
        y += 7;
      });
      
      y += 3;
    }
    
    y += 5;
  });
  
  doc.save(`historial_guias_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Función para copiar guía y actualizar contador
function copiarGuia(texto, btn) {
  navigator.clipboard.writeText(texto).then(() => {
    btn.textContent = '✅ Copiado!';
    setTimeout(() => btn.textContent = '📋 Copiar', 2000);
    
    // Determinar plataforma y actualizar contador correspondiente
    const partes = texto.split('-');
    if (partes.length > 1) {
      const prefijo = partes[1].charAt(0).toUpperCase();
      
      if (prefijo === 'F') {
        contadores.facebook++;
        localStorage.setItem('contadoresGuias', JSON.stringify(contadores));
        contadorFb.textContent = formatearContador(contadores.facebook);
      } else if (prefijo === 'T') {
        contadores.tiktok++;
        localStorage.setItem('contadoresGuias', JSON.stringify(contadores));
        contadorTt.textContent = formatearContador(contadores.tiktok);
      }
    }
  });
}

// Función para renderizar el historial con filtros
function renderHistorial(filtrarTexto = '', filtrarPorFecha = '') {
  historialDiv.innerHTML = '';

  // Aplicar filtros
  const guiasFiltradas = guias.filter(g => {
    const coincideTexto = g.texto.toLowerCase().includes(filtrarTexto.toLowerCase());
    const coincideFecha = filtrarPorFecha ? g.fecha === filtrarPorFecha : true;
    return coincideTexto && coincideFecha;
  });

  // Mostrar mensaje si no hay guías
  if (guiasFiltradas.length === 0) {
    const mensaje = document.createElement('div');
    mensaje.className = 'sin-guias';
    mensaje.innerHTML = `
      <p>No se encontraron guías ${filtrarTexto || filtrarPorFecha ? 'que coincidan con los filtros' : 'en el historial'}.</p>
      <p>Genera nuevas guías desde la página principal.</p>
    `;
    historialDiv.appendChild(mensaje);
    return;
  }

  // Agrupar por fecha
  const guiasPorFecha = {};
  guiasFiltradas.forEach(g => {
    if (!guiasPorFecha[g.fecha]) guiasPorFecha[g.fecha] = [];
    guiasPorFecha[g.fecha].push(g);
  });

  // Ordenar fechas de más reciente a más antigua
  Object.keys(guiasPorFecha).sort((a, b) => new Date(b) - new Date(a)).forEach(fecha => {
    const card = document.createElement('div');
    card.className = 'card-dia';
    card.innerHTML = `<h3>📅 ${fecha}</h3>`;

    // Agrupar por plataforma (Facebook, TikTok)
    const plataformas = {
      'Facebook': { guias: [], color: '#4267B2' },
      'TikTok': { guias: [], color: '#FE2C55' },
      'Otras': { guias: [], color: '#007bff' }
    };

    guiasPorFecha[fecha].forEach(g => {
      // Usamos la plataforma guardada o la detectamos del texto
      let plataforma = g.plataforma === 'F' ? 'Facebook' : 
                      g.plataforma === 'T' ? 'TikTok' : 'Otras';
      
      if (plataforma === 'Otras') {
        // Si no estaba guardada, intentamos detectar del texto
        const primeraLetra = g.texto.split('-')[1]?.charAt(0)?.toUpperCase();
        if (primeraLetra === 'F') plataforma = 'Facebook';
        else if (primeraLetra === 'T') plataforma = 'TikTok';
      }
      
      plataformas[plataforma].guias.push(g.texto);
    });

    // Crear secciones por plataforma
    for (const [nombrePlataforma, datos] of Object.entries(plataformas)) {
      if (datos.guias.length === 0) continue;

      const divP = document.createElement('div');
      divP.className = 'plataforma';
      divP.innerHTML = `<h4 style="color: ${datos.color}">${nombrePlataforma}</h4>`;

      // Añadir cada guía
      datos.guias.forEach(texto => {
        const gDiv = document.createElement('div');
        gDiv.className = 'guia';
        gDiv.style.borderLeftColor = datos.color;
        
        const span = document.createElement('span');
        span.textContent = texto;

        const btn = document.createElement('button');
        btn.className = 'copiar';
        btn.textContent = '📋 Copiar';
        btn.style.backgroundColor = datos.color;
        btn.onclick = () => copiarGuia(texto, btn);

        gDiv.appendChild(span);
        gDiv.appendChild(btn);
        divP.appendChild(gDiv);
      });

      card.appendChild(divP);
    }

    historialDiv.appendChild(card);
  });
}

// Eventos para los filtros
inputBuscar.addEventListener('input', () => {
  renderHistorial(inputBuscar.value, inputFecha.value);
});

inputFecha.addEventListener('change', () => {
  renderHistorial(inputBuscar.value, inputFecha.value);
});

// Eventos para los botones de acción
document.querySelector('.limpiar').addEventListener('click', limpiarHistorial);
document.querySelector('.exportar').addEventListener('click', exportarTXT);
document.querySelector('.exportarExcel').addEventListener('click', exportarExcel);
document.querySelector('.exportarPdf').addEventListener('click', exportarPDF);

// Renderizar inicialmente TODAS las guías y contadores
document.addEventListener('DOMContentLoaded', () => {
  renderHistorial();
  actualizarContadores();
});
