import { NextResponse } from 'next/server';

const URL_GET_DOCUMENT_EXCEL = process.env.URL_GET_DOCUMENT_EXCEL;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idExcel = searchParams.get('idExcel');
    const nombreHoja = searchParams.get('nombreHoja');
    const nombreCelda = searchParams.get('nombreCelda');
    
    const response = await fetch(
      `${URL_GET_DOCUMENT_EXCEL}valorCelda?idExcel=${idExcel}&nombreHoja=${nombreHoja}&nombreCelda=${nombreCelda}`
    );

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching cell value' },
      { status: 500 }
    );
  }
}