import { NextResponse } from 'next/server';

const URL_UPLOAD_EXCEL = process.env.URL_UPLOAD_EXCEL;

export async function POST(request) {
  try {
    // Obtener el FormData completo de la request
    const formData = await request.formData();
    
    console.log('FormData recibido:', {
      file: formData.get('file') ? 'PRESENTE' : 'AUSENTE',
      usuario_id: formData.get('usuario_id'),
      keys: Array.from(formData.keys())
    });

    // Verificar que el archivo esté presente
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json(
        { error: 'Archivo requerido' },
        { status: 400 }
      );
    }

    // Reconstruir el FormData para enviar a Spring
    const springFormData = new FormData();
    
    // Agregar el archivo
    springFormData.append('file', file);
    
    // Agregar otros campos si existen
    const usuario_id = formData.get('usuario_id');
    if (usuario_id) {
      springFormData.append('usuario_id', usuario_id);
    }

    const nombre_excel = formData.get('nombre_excel');
    if (nombre_excel) {
      springFormData.append('nombre_excel', nombre_excel);
    }

    const descripcion = formData.get('descripcion');
    if (descripcion) {
      springFormData.append('descripcion', descripcion);
    }

    // Enviar a Spring
    const response = await fetch(URL_UPLOAD_EXCEL, {
      method: 'POST',
      body: springFormData,
      // NO incluir headers Content-Type para FormData, el navegador lo establece automáticamente
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de Spring:', errorText);
      throw new Error(`Spring error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error en upload:', error);
    return NextResponse.json(
      { error: 'Error uploading file: ' + error.message },
      { status: 500 }
    );
  }
}