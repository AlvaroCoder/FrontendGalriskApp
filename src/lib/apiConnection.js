const URL_UPLOAD_EXCEL=process.env.NEXT_PUBLIC_URL_UPLOAD_EXCEL;
const URL_GET_DOCUMENT_EXCEL=process.env.NEXT_PUBLIC_URL_GET_DOCUMENT_EXCEL;
const URL_GET_DATA_EXCEL=process.env.NEXT_PUBLIC_URL_GET_DATA_EXCEL
const URL_PROCESS_DATA =process.env.NEXT_PUBLIC_URL_PROCESS_DATA;
const URL_EXTRAER_VARIABLES=process.env.NEXT_PUBLIC_URL_EXTRAER_VARIABLES
const BASE_URL_EXCEL = process.env.NEXT_PUBLIC_BASE_URL_EXCEL;

export async function uploadDocumentExcel(fileExcel=null) {
    if (!fileExcel) return;
    return await fetch(URL_UPLOAD_EXCEL,{
        method : 'POST',
        body : fileExcel,
        mode : 'cors'
    });
}

export async function extraerVariablesTop(data,variablesTop=3) {
    return await fetch(URL_EXTRAER_VARIABLES+variablesTop,{
        method : 'POST',
        mode : 'cors',
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify(data)
    })
}

export async function processData(data) {
    return await fetch(URL_PROCESS_DATA,{
        method : 'POST',
        mode : 'cors',
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify(data)
    })
}

export async function getDataExcelByIdUser(idUser) {
    return await fetch(URL_GET_DATA_EXCEL+idUser,{
        method : 'GET',
        mode : 'cors'
    });
}

export async function getDataExcelByIdExcel(idExcel) {
    return await fetch(URL_GET_DOCUMENT_EXCEL+idExcel,{
        method : 'GET',
        mode : 'cors'
    });
}

export async function getDocumentExcel(idExcel="") {
    return await fetch(URL_GET_DOCUMENT_EXCEL+idExcel+"/download",{
        method : 'GET',
        mode : 'cors'
    });
};

export async function getExcelsByIdUser(idUser="") {
    return await fetch(URL_GET_DOCUMENT_EXCEL+"usuario/"+idUser,{
        method : 'GET',
        mode : 'cors'
    });
}

export async function getDataCellValue(idExcel, nombreHoja,nombreCelda ) {
    return await fetch(URL_GET_DOCUMENT_EXCEL+`valorCelda?idExcel=${idExcel}&nombreHoja=${nombreHoja}&nombreCelda=${nombreCelda}`,{
        method : 'GET',
        mode : 'cors'
    });
}

export async function getDataSimuladaRiqueza(dataBody, iteraciones) {
    return await fetch(URL_GET_DOCUMENT_EXCEL+`simularRiqueza?iteraciones=${iteraciones}`,{
        method : 'POST',
        mode : 'cors',
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify(dataBody)
    })
}

export async function deleteExcel(idExcel) {
    return await fetch(BASE_URL_EXCEL+ idExcel,{
        method : 'DELETE',
        mode : 'cors'
    })
}