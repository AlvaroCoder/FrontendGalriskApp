import { NextResponse } from 'next/server';

const URL_GET_DOCUMENT_EXCEL = process.env.URL_GET_DOCUMENT_EXCEL;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idExcel = searchParams.get('idExcel');
    
    if (!idExcel) {
      return NextResponse.json(
        { error: 'idExcel is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${URL_GET_DOCUMENT_EXCEL}${idExcel}/download`);
    
    if (!response.ok) {
      throw new Error('Download failed');
    }

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error downloading file' },
      { status: 500 }
    );
  }
}