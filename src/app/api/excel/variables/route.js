import { NextResponse } from 'next/server';

const URL_EXTRAER_VARIABLES = process.env.URL_EXTRAER_VARIABLES;

export async function POST(request) {
  try {
    const { data, variablesTop = 3 } = await request.json();
    
    const response = await fetch(`${URL_EXTRAER_VARIABLES}${variablesTop}`, {
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
      { error: 'Error extracting variables' },
      { status: 500 }
    );
  }
}