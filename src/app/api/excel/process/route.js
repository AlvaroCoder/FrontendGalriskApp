import { NextResponse } from 'next/server';

const URL_PROCESS_DATA = process.env.URL_PROCESS_DATA;

export async function POST(request) {
  try {
    const data = await request.json();
    
    const response = await fetch(URL_PROCESS_DATA, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error processing data' },
      { status: 500 }
    );
  }
}