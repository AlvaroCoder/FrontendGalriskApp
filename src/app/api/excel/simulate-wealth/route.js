import { NextResponse } from 'next/server';

const URL_GET_DOCUMENT_EXCEL = process.env.URL_GET_DOCUMENT_EXCEL;

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const iteraciones = searchParams.get('iteraciones');
    const dataBody = await request.json();
    
    const response = await fetch(
      `${URL_GET_DOCUMENT_EXCEL}simularRiqueza?iteraciones=${iteraciones}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataBody),
      }
    );

    const data = await response.json();
    console.log(data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {    
    return NextResponse.json(
      { error: 'Error simulating wealth' },
      { status: 500 }
    );
  }
}