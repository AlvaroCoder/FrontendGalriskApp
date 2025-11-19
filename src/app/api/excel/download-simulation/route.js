import { NextResponse } from 'next/server';

const BASE_URL_API = process.env.URL_GET_DOCUMENT_EXCEL;

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(`${BASE_URL_API}/downloadSimulationResults`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`Error en API Spring: ${response.status}`);
    }

    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=simulacion_escenarios.xlsx',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error en download-simulation API:', error);
    return NextResponse.json(
      { 
        message: 'Error al generar el archivo Excel',
        error: error.message 
      },
      { status: 500 }
    );
  }
}