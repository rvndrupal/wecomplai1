const { test } = require('@playwright/test');
const fs = require('fs');
const FN = require('../Funciones_avanzadas/funciones_play');

test('Generar 100 RFC y guardarlos', async () => {
    let contenido = "";

    for (let i = 1; i <= 200; i++) {
        const rfc = FN.generarRFC();
        contenido += `${i}. ${rfc}\n`;
    }

    fs.writeFileSync('rfcs_generados.txt', contenido, { encoding: 'utf-8' });
    console.log("Archivo rfcs_generados.txt creado correctamente");
});
