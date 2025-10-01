const URL_UPLOAD_EXCEL="http://localhost:9090/api/excel/upload";
const URL_GET_DOCUMENT_EXCEL="http://localhost:9090/api/excel/";
const URL_GET_DATA_EXCEL="http://localhost:9090/api/excel/usuario/"
const URL_PROCESS_DATA ="http://localhost:9090/api/excel/processData";
const URL_EXTRAER_VARIABLES="http://localhost:9090/api/excel/extraerResultadosTop/"
const BASE_URL_EXCEL = "http://localhost:9090/api/excel/";

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