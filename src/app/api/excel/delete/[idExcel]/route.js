import { NextResponse } from 'next/server';

const BASE_URL_EXCEL = process.env.BASE_URL_EXCEL;

export async function DELETE(request, { params }) {
  try {
    const { idExcel } = params;
    
    const response = await fetch(`${BASE_URL_EXCEL}${idExcel}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting document' },
      { status: 500 }
    );
  }
}