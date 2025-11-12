const BASE_API_URL = '/api/excel';

export async function uploadDocumentExcel(formData) {
  return await fetch(`${BASE_API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
}

export async function extraerVariablesTop(data, variablesTop = 3) {
  return await fetch(`${BASE_API_URL}/variables`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data, variablesTop }),
  });
}

export async function processData(data) {
  return await fetch(`${BASE_API_URL}/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function getDataExcelByIdUser(idUser) {
  return await fetch(`${BASE_API_URL}/user/${idUser}/data`, {
    method: 'GET',
  });
}

export async function getExcelsByIdUser(idUser) {
  return await fetch(`${BASE_API_URL}/user/${idUser}`, {
    method: 'GET',
  });
}

export async function getDataExcelByIdExcel(idExcel) {
  return await fetch(`${BASE_API_URL}/document/${idExcel}`, {
    method: 'GET',
  });
}

export async function getDocumentExcel(idExcel = '') {
  return await fetch(`${BASE_API_URL}/document/download?idExcel=${idExcel}`, {
    method: 'GET',
  });
}

export async function getDataCellValue(idExcel, nombreHoja, nombreCelda) {
  return await fetch(
    `${BASE_API_URL}/cell-value?idExcel=${idExcel}&nombreHoja=${nombreHoja}&nombreCelda=${nombreCelda}`,
    {
      method: 'GET',
    }
  );
}

export async function getDataSimuladaRiqueza(dataBody, iteraciones) {
  return await fetch(
    `${BASE_API_URL}/simulate-wealth?iteraciones=${iteraciones}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataBody),
    }
  );
}

export async function deleteExcel(idExcel) {
  return await fetch(`${BASE_API_URL}/delete/${idExcel}`, {
    method: 'DELETE',
  });
}