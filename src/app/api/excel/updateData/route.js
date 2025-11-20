import { NextResponse } from "next/server";

const SPRING_API_URL = process.env.SPRING_API_URL;

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { error: "El ID del Excel es requerido" },
        { status: 400 }
      );
    }

    if (!body.nombre_excel && !body.descripcion) {
      return NextResponse.json(
        {
          error:
            "Se requiere al menos nombre_excel o descripcion para actualizar",
        },
        { status: 400 }
      );
    }
    const updateData = body;

    const response = await fetch(
      `${SPRING_API_URL}/api/excel/actualizarDatos`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from Spring API:", response.status, errorText);

      return NextResponse.json(
        {
          error: "Error al actualizar el Excel en el servidor",
          details: errorText,
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log(result);
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
