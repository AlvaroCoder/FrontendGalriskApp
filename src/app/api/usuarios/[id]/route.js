import { NextResponse } from 'next/server';

const SPRING_API_URL = process.env.SPRING_API_URL;

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }

    const response = await fetch(`${SPRING_API_URL}/api/usuarios/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from Spring API:', response.status, errorText);
      
      return NextResponse.json(
        { 
          error: 'Error al obtener datos del usuario',
          details: errorText
        },
        { status: response.status }
      );
    }

    const userData = await response.json();
    
    const transformedData = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      password: '••••••••', 
      fecha_creacion: userData.fecha_creacion || userData.fechaCreacion,
    };

    return NextResponse.json(transformedData);

  } catch (error) {
    console.error('Error in user API route:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error.message
      },
      { status: 500 }
    );
  }
}