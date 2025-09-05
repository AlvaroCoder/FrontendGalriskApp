const URL_UPLOAD_EXCEL="http://localhost:8080/api/excel/upload";
const URL_GET_DOCUMENT_EXCEL="http://localhost:8080/api/excel/";
const URL_GET_DATA_EXCEL="http://localhost:8080/api/excel/usuario/"
const URL_PROCESS_DATA ="http://localhost:8080/api/excel/processData";

export async function uploadDocumentExcel(fileExcel=null) {
    if (!fileExcel) return;
    return await fetch(URL_UPLOAD_EXCEL,{
        method : 'POST',
        body : fileExcel,
        mode : 'cors'
    });
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
}