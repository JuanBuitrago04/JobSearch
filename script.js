async function buscar() {
    const trabajo = document.getElementById('trabajo').value.trim();
    const lugar = document.getElementById('lugar').value.trim();
    const resultadosDiv = document.getElementById('resultados');
  
    // Validación
    if (!trabajo || !lugar) {
      mostrarMensaje('error', 'Por favor, completa ambos campos.');
      return;
    }
  
    // Mensaje de carga
    mostrarMensaje('loading', 'Buscando datos...');
  
    try {
      // Petición al backend (POST)
      const res = await fetch('https://jobsearchbackend-az5z.onrender.com/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trabajo, lugar })
      });
      const data = await res.json();
  
      // Si hay resultados, creamos la tabla
      if (data.resultados && data.resultados.length > 0) {
        resultadosDiv.innerHTML = '';
  
        // Encabezado de resultados
        const header = document.createElement('div');
        header.className = 'bg-gradient-to-r from-primary-600 to-primary-800 text-white p-4 rounded-t-lg flex justify-between items-center';
        
        const titleDiv = document.createElement('div');
        titleDiv.innerHTML = `
          <h2 class="text-xl font-bold">Resultados</h2>
          <p class="text-sm text-primary-100">Encontrados: ${data.resultados.length}</p>
        `;
        
        header.appendChild(titleDiv);
        resultadosDiv.appendChild(header);
        
        // Contenedor con scroll horizontal
        const tableContainer = document.createElement('div');
        tableContainer.className = 'overflow-x-auto rounded-b-lg shadow-lg border-2 border-t-0 border-primary-200';
  
        // Crear la tabla con estilo Tailwind
        const table = document.createElement('table');
        table.className = 'min-w-full text-base text-left bg-white';
  
        // Encabezado
        const thead = document.createElement('thead');
        thead.innerHTML = `
          <tr class="bg-primary-100 text-primary-800 uppercase text-sm">
            <th scope="col" class="px-6 py-4">Nombre</th>
            <th scope="col" class="px-6 py-4">Teléfono</th>
            <th scope="col" class="px-6 py-4">Email</th>
          </tr>
        `;
        table.appendChild(thead);
  
        // Cuerpo de la tabla
        const tbody = document.createElement('tbody');
  
        data.resultados.forEach((item, index) => {
          const tr = document.createElement('tr');
          // Alternar colores de fila para mejor legibilidad
          tr.className = index % 2 === 0 
            ? 'bg-white border-b transition hover:bg-primary-50' 
            : 'bg-primary-50/30 border-b transition hover:bg-primary-100/50';
  
          tr.innerHTML = `
            <td class="px-6 py-5 font-medium">${item.nombre}</td>
            <td class="px-6 py-5">
              <a href="tel:${item.telefono}" class="text-primary-600 hover:text-primary-800 hover:underline flex items-center group">
                <div class="bg-primary-100 p-2 rounded-full mr-3 group-hover:bg-primary-200 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                ${item.telefono}
              </a>
            </td>
            <td class="px-6 py-5">
              <a href="mailto:${item.email}" class="text-primary-600 hover:text-primary-800 hover:underline flex items-center group">
                <div class="bg-primary-100 p-2 rounded-full mr-3 group-hover:bg-primary-200 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                ${item.email}
              </a>
            </td>
          `;
          tbody.appendChild(tr);
        });
  
        table.appendChild(tbody);
  
        // Insertar la tabla en el contenedor
        tableContainer.appendChild(table);
        // Agregar el contenedor al div de resultados
        resultadosDiv.appendChild(tableContainer);
  
      } else {
        mostrarMensaje('empty', 'No se encontraron resultados para tu búsqueda.');
      }
    } catch (error) {
      mostrarMensaje('error', 'Error al buscar. Inténtalo nuevamente.');
      console.error(error);
    }
  }
  
  // Función para mostrar mensajes con estilos consistentes
  function mostrarMensaje(tipo, mensaje) {
    const resultadosDiv = document.getElementById('resultados');
    
    switch(tipo) {
      case 'loading':
        resultadosDiv.innerHTML = `
          <div class="flex flex-col items-center justify-center p-10 border-2 border-primary-100 rounded-lg bg-primary-50/30">
            <div class="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
            <p class="text-primary-800 font-medium text-lg">${mensaje}</p>
          </div>
        `;
        break;
      case 'error':
        resultadosDiv.innerHTML = `
          <div class="bg-red-50 text-red-800 p-6 rounded-lg border-2 border-red-200 flex items-start">
            <div class="bg-red-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-red-700 mb-1">Error</h3>
              <p class="text-red-700">${mensaje}</p>
            </div>
          </div>
        `;
        break;
      case 'empty':
        resultadosDiv.innerHTML = `
          <div class="bg-accent-100 text-accent-500 p-8 rounded-lg border-2 border-accent-200 text-center">
            <div class="bg-accent-200 p-4 rounded-full inline-block mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-accent-500 mb-2">Sin resultados</h3>
            <p class="text-lg">${mensaje}</p>
          </div>
        `;
        break;
      default:
        resultadosDiv.innerHTML = `<p>${mensaje}</p>`;
    }
  }