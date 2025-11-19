import { NextResponse } from 'next/server';

const URL_GET_DOCUMENT_EXCEL = process.env.URL_GET_DOCUMENT_EXCEL;

export async function GET(request, { params }) {
  try {
    const { idExcel } = await params;
    
    const response = await fetch(`${URL_GET_DOCUMENT_EXCEL}${idExcel}`);
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching document' },
      { status: 500 }
    );
  }
}