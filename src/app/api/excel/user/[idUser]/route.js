import { NextResponse } from 'next/server';

const URL_GET_DATA_EXCEL = process.env.URL_GET_DATA_EXCEL;
const URL_GET_DOCUMENT_EXCEL = process.env.URL_GET_DOCUMENT_EXCEL;

export async function GET(request, { params }) {
  try {
    const { idUser } = await params;
    
    const url = new URL(request.url);
    
    if (url.pathname.includes('/data')) {
      const response = await fetch(`${URL_GET_DATA_EXCEL}${idUser}`);
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const response = await fetch(`${URL_GET_DOCUMENT_EXCEL}usuario/${idUser}`);
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching user data' },
      { status: 500 }
    );
  }
}