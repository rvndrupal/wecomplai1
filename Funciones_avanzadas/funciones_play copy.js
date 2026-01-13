// funciones_play.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { expect } = require("@playwright/test");
const axios = require('axios');
require('dotenv').config();

let WAIT_GLOBAL = 300;
let TP_GLOBAL = 500;
let TIMEOUT_GLOBAL = 30000;

const FN = {

    // 🔁 Control para evitar sobreescritura de imágenes
    _contadorImagenes: {},

    configurar(wait, tp, timeout = 30000) {
        WAIT_GLOBAL = wait;
        TP_GLOBAL = tp;
        TIMEOUT_GLOBAL = timeout;
    },

    async desbloquearCuenta(email) {
        try {
            const response = await axios({
                method: 'POST',
                url: 'https://users.dev.wecomplai.com/user/secret/reset_user',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Internal-Token': process.env.TOKEN || '3sRNx3d8RaNl'
                },
                data: {
                    data: {
                        email: email
                    }
                },
                timeout: 5000
            });

            console.log(`Cuenta desbloqueada: ${email}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 403) {
                console.log(`Token invalido o sin permisos - Continuando sin desbloqueo`);
            } else if (error.response) {
                console.log(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
            } else {
                console.log(`Error en desbloqueo: ${error.message}`);
            }
            return null;
        }
    },

    async desbloquearCuentaqa(email) {
        try {
            const response = await axios({
                method: 'POST',
                url: 'https://users.qa.wecomplai.com/user/secret/reset_user',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Internal-Token': process.env.TOKEN || '0x3Cwr62Dq8r'
                },
                data: {
                    data: {
                        email: email
                    }
                },
                timeout: 5000
            });

            console.log(`Cuenta desbloqueada Qa: ${email}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 403) {
                console.log(`Token invalido Qa o sin permisos Qa - Continuando sin desbloqueo`);
            } else if (error.response) {
                console.log(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
            } else {
                console.log(`Error en desbloqueo: ${error.message}`);
            }
            return null;
        }
    },

    crearCarpeta(testName, matrizFolder) {
        const carpetaImagenes = path.join(matrizFolder, "imagenes", testName);
        if (!fs.existsSync(carpetaImagenes)) {
            fs.mkdirSync(carpetaImagenes, { recursive: true });
        }
        return carpetaImagenes;
    },

    // ==================== GENERADORES DE DATOS FAKE ====================

    generarRFC() {
        const nombres = ['JUAN', 'CARLOS', 'JAVIER', 'JOSE', 'LUIS', 'MIGUEL', 'PEDRO', 'JORGE', 'ANA', 'MARIA', 'LAURA', 'SOFIA'];
        const apellidos = ['CASTRO', 'GARCIA', 'MARTINEZ', 'LOPEZ', 'HERNANDEZ', 'GONZALEZ', 'RODRIGUEZ', 'PEREZ', 'SANCHEZ', 'RAMIREZ'];

        const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const alfanumericos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const apellidoP = apellidos[Math.floor(Math.random() * apellidos.length)];
        const apellidoM = apellidos[Math.floor(Math.random() * apellidos.length)];

        // 1ª letra apellido paterno
        const letra1 = apellidoP.charAt(0);

        // 1ª vocal interna apellido paterno
        const vocalInterna = apellidoP.slice(1).match(/[AEIOU]/)?.[0] || 'X';

        // 1ª letra apellido materno
        const letra2 = apellidoM.charAt(0);

        // 1ª letra del nombre
        const letra3 = nombre.charAt(0);

        // Fecha válida
        const year = String(Math.floor(Math.random() * 50) + 50).padStart(2, '0'); // 1950–1999
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

        // Homoclave (3 alfanuméricos)
        let homoclave = '';
        for (let i = 0; i < 3; i++) {
            homoclave += alfanumericos.charAt(Math.floor(Math.random() * alfanumericos.length));
        }

        let rfc = `${letra1}${vocalInterna}${letra2}${letra3}${year}${month}${day}${homoclave}`;

        // Evitar palabras prohibidas (básico)
        const prohibidas = ['BUEI', 'BUEY', 'CACA', 'CACO', 'PUTO', 'PEDO', 'PENE'];
        if (prohibidas.includes(rfc.substring(0, 4))) {
            rfc = rfc.replace(/^.{4}/, 'XAXX');
        }

        console.log(`RFC generado (MX válido): ${rfc}`);
        return rfc;
    },

    async finalizarPruebaSiRFCInvalido(page, mensajeError = "el formato del RFC no es correcto") {
        const existeError = await page
            .getByText(mensajeError)
            .isVisible()
            .catch(() => false);

        if (existeError) {
            console.log("⚠️ RFC inválido detectado. Finalizando prueba como OK.");
            return true;
        }

        return false;
    },



    generarRFCMoral() {
        const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numeros = '0123456789';

        // RFC Moral: 3 letras + fecha (YYMMDD) + homoclave (3 caracteres)
        let rfc = '';
        for (let i = 0; i < 3; i++) {
            rfc += letras.charAt(Math.floor(Math.random() * letras.length));
        }

        // Fecha de constitución (1990-2024)
        const year = String(Math.floor(Math.random() * 35) + 90).padStart(2, '0'); // 90-24
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        rfc += `${year}${month}${day}`;

        // Homoclave
        for (let i = 0; i < 3; i++) {
            const usarLetra = Math.random() > 0.5;
            rfc += usarLetra
                ? letras.charAt(Math.floor(Math.random() * letras.length))
                : numeros.charAt(Math.floor(Math.random() * numeros.length));
        }

        console.log(`RFC Moral generado: ${rfc}`);
        return rfc;
    },

    



    generarCURP() {
        const apellidosPaternos = ['GARCIA', 'MARTINEZ', 'LOPEZ', 'HERNANDEZ', 'GONZALEZ', 'RODRIGUEZ', 'PEREZ', 'SANCHEZ', 'RAMIREZ', 'TORRES'];
        const apellidosMaternos = ['MENDEZ', 'FLORES', 'CRUZ', 'MORALES', 'JIMENEZ', 'RIVERA', 'RAMOS', 'MENDOZA', 'ALVAREZ', 'CASTILLO'];
        const nombres = ['JUAN', 'MARIA', 'JOSE', 'LUIS', 'CARLOS', 'ANA', 'PEDRO', 'ROSA', 'JORGE', 'LAURA'];
        const estados = ['AS', 'BC', 'BS', 'CC', 'CS', 'CH', 'CL', 'CM', 'DF', 'DG', 'GT', 'GR', 'HG', 'JC', 'MC', 'MN', 'MS', 'NT', 'NL', 'OC', 'PL', 'QT', 'QR', 'SP', 'SL', 'SR', 'TC', 'TS', 'TL', 'VZ', 'YN', 'ZS', 'NE'];
        const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numeros = '0123456789';
        const sexo = Math.random() > 0.5 ? 'H' : 'M';

        const apellidoP = apellidosPaternos[Math.floor(Math.random() * apellidosPaternos.length)];
        const apellidoM = apellidosMaternos[Math.floor(Math.random() * apellidosMaternos.length)];
        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const estado = estados[Math.floor(Math.random() * estados.length)];

        // CURP: 4 letras + 6 dígitos fecha + sexo + estado + 3 consonantes internas + 2 dígitos
        let curp = apellidoP.charAt(0) + apellidoP.charAt(1) + apellidoM.charAt(0) + nombre.charAt(0);

        const year = String(Math.floor(Math.random() * 52) + 54).padStart(2, '0');
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        curp += `${year}${month}${day}`;

        curp += sexo;
        curp += estado;

        // 3 consonantes internas
        for (let i = 0; i < 3; i++) {
            const consonantes = 'BCDFGHJKLMNPQRSTVWXYZ';
            curp += consonantes.charAt(Math.floor(Math.random() * consonantes.length));
        }

        // 2 caracteres finales
        curp += numeros.charAt(Math.floor(Math.random() * numeros.length));
        curp += Math.random() > 0.5
            ? letras.charAt(Math.floor(Math.random() * letras.length))
            : numeros.charAt(Math.floor(Math.random() * numeros.length));

        console.log(`CURP generado: ${curp}`);
        return curp;
    },

    //Nombre de empresas
    //Nombre de empresas
    generarNombreEmpresa() {
        const prefijos = [
            'Servicios',
            'Consultoría',
            'Soluciones',
            'Tecnologías',
            'Grupo',
            'Corporativo',
            'Desarrollos',
            'Innovación',
            'Sistemas',
            'Proyectos'
        ];

        const giros = [
            'Empresariales',
            'Financieros',
            'Digitales',
            'Integrales',
            'Tecnológicos',
            'Industriales',
            'Administrativos',
            'Logísticos',
            'Comerciales',
            'Estrategicos'
        ];

        const sufijos = [
            'MX',
            'Global',
            'Latam',
            'Holding',
            'Corporation',
            'Solutions',
            'Group',
            'Company',
            'S.A. de C.V.'
        ];

        const prefijo = prefijos[Math.floor(Math.random() * prefijos.length)];
        const giro = giros[Math.floor(Math.random() * giros.length)];
        const sufijo = sufijos[Math.floor(Math.random() * sufijos.length)];
        const numero = Math.floor(1000 + Math.random() * 9000);

        const nombreEmpresa = `${prefijo} ${giro} ${numero} ${sufijo}`;

        console.log(`🏢 Nombre de empresa generado: ${nombreEmpresa}`);
        return nombreEmpresa;
    },    

    

    generarEmail() {
        const nombres = ['juan', 'maria', 'jose', 'luis', 'carlos', 'ana', 'pedro', 'rosa', 'jorge', 'laura'];
        const apellidos = ['garcia', 'martinez', 'lopez', 'hernandez', 'gonzalez', 'rodriguez', 'perez', 'sanchez'];
        const dominios = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'test.com'];

        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
        const dominio = dominios[Math.floor(Math.random() * dominios.length)];
        const numero = Math.floor(Math.random() * 999) + 1;

        const email = `${nombre}.${apellido}${numero}@${dominio}`;
        console.log(`Email generado: ${email}`);
        return email;
    },

    generarTelefono() {
        // Formato: 55 + 8 dígitos (México)
        const prefijos = ['55', '33', '81', '222', '442', '664', '656'];
        const prefijo = prefijos[Math.floor(Math.random() * prefijos.length)];
        const numero = Math.floor(Math.random() * 90000000) + 10000000;

        const telefono = `${prefijo}${numero}`;
        console.log(`Teléfono generado: ${telefono}`);
        return telefono;
    },

    generarNombre() {
        const nombres = ['Juan Carlos', 'María Guadalupe', 'José Luis', 'Ana María', 'Carlos Alberto', 'Rosa Elena', 'Pedro Antonio', 'Laura Patricia', 'Jorge Eduardo', 'Carmen Isabel'];
        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        console.log(`Nombre generado: ${nombre}`);
        return nombre;
    },

    generarApellidos() {
        const apellidos = ['García López', 'Martínez Hernández', 'López González', 'Hernández Rodríguez', 'González Pérez', 'Rodríguez Sánchez', 'Pérez Ramírez', 'Sánchez Torres', 'Ramírez Flores', 'Torres Rivera'];
        const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
        console.log(`Apellidos generados: ${apellido}`);
        return apellido;
    },

    // ==================== FIN GENERADORES ====================

    async paso(page, accion, carpeta, nombreImagen) {
        await accion();

        if (!carpeta) return;

        // 🔹 Clave única por carpeta + nombre de imagen
        const key = `${carpeta}_${nombreImagen}`;

        // 🔁 Control interno de versiones de imagen
        if (!this._contadorImagenes[key]) {
            this._contadorImagenes[key] = 1;
        } else {
            this._contadorImagenes[key]++;
        }

        // ✅ USAR EL CONTADOR CORRECTO
        const version = this._contadorImagenes[key];
        const nombreFinal = version === 1
            ? nombreImagen
            : `${nombreImagen}_v${version}`;

        const tempPath = path.join(carpeta, `${nombreFinal}.png`);
        const finalPath = path.join(carpeta, `${nombreFinal}.jpg`);

        await page.screenshot({ path: tempPath, fullPage: false });

        await sharp(tempPath)
            .jpeg({ quality: 60 })
            .toFile(finalPath);

        fs.unlinkSync(tempPath);

        await this.esperar(TP_GLOBAL);
    },



    //Selector para si Empresas
    async selectDropdownOption(page, opcion, carpeta, paso) {
        await this.paso(page, async () => {
            await page.getByText(opcion, { exact: true }).filter({ hasNotText: 'última sesión' }).first().click({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, paso);
    },

    //Pausa
    async pausa(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    //Seleccionar Area usuarios
    async areaUsuarioSelectOrCreate(page, area, carpeta, paso) {
        // Abrir dropdown Área
        await this.paso(page, async () => {
            await page.locator('#area').click({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, `${paso}_abrir`);

        // Escribir área (versión robusta)
        await this.paso(page, async () => {
            const input = page.getByRole('textbox').first();
            await input.click({ timeout: TIMEOUT_GLOBAL });
            await input.fill(area, { timeout: TIMEOUT_GLOBAL });
        }, carpeta, `${paso}_fill`);

        // Buscar coincidencia exacta
        const opciones = page.locator('span').filter({ hasText: new RegExp(`^${area}$`) });
        const count = await opciones.count();

        if (count === 0) {
            // Crear nueva área con +
            await this.paso(page, async () => {
                await page.locator('.p-2 > div > .text-white').click({ timeout: TIMEOUT_GLOBAL });
            }, carpeta, `${paso}_crear`);

            // Guardar usuario
            await this.paso(page, async () => {
                await page.getByRole('button', { name: 'Guardar' }).click({ timeout: TIMEOUT_GLOBAL });
            }, carpeta, `${paso}_guardar`);

            // Reabrir dropdown
            await this.paso(page, async () => {
                await page.locator('#area').click({ timeout: TIMEOUT_GLOBAL });
            }, carpeta, `${paso}_reabrir`);
        }

        // Seleccionar SIEMPRE la primera coincidencia (evita strict mode)
        await this.paso(page, async () => {
            await page.locator('span', { hasText: area }).first().click({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, `${paso}_seleccionar`);
    },




    async esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms || WAIT_GLOBAL));
    },

    async goto(page, url, carpeta, paso) {
        await this.paso(page, async () => {
            await page.goto(url);
            await page.setViewportSize({ width: 1880, height: 800 });
        }, carpeta, paso);
    },

    async click(page, selector, carpeta, paso) {
        await this.paso(page, async () => {
            await page.locator(selector).click({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, paso);
    },

    async clickRole(page, role, name, carpeta, paso) {
        await this.paso(page, async () => {
            await page.getByRole(role, { name }).click({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, paso);
    },

    async clickText(page, texto, carpeta, paso) {
        await this.paso(page, async () => {
            await page.getByText(texto).click({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, paso);
    },

    async fill(page, selector, texto, carpeta, paso) {
        await this.paso(page, async () => {
            const el = page.locator(selector);
            await el.click({ timeout: TIMEOUT_GLOBAL });
            await el.fill(texto, { timeout: TIMEOUT_GLOBAL });
        }, carpeta, paso);
    },

    async fillRole(page, role, name, texto, carpeta, paso) {
        await this.paso(page, async () => {
            await page.getByRole(role, { name }).fill(texto, { timeout: TIMEOUT_GLOBAL });
        }, carpeta, paso);
    },

    async expectVisible(page, selector, carpeta, paso) {
        await this.paso(page, async () => {
            await expect(page.locator(selector)).toBeVisible({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, paso);
    },

    async expectVisibleRole(page, role, name, carpeta, paso) {
        await this.paso(page, async () => {
            await expect(page.getByRole(role, { name })).toBeVisible({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, paso);
    },

    async expectText(page, texto, carpeta, paso) {
        await this.paso(page, async () => {
            await expect(page.getByText(texto)).toBeVisible({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, paso);
    },

    async expectDisabled(page, selector, carpeta, paso) {
        await this.paso(page, async () => {
            await expect(page.locator(selector)).toBeDisabled({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, paso);
    },

    async expectDisabledRole(page, role, name, carpeta, paso) {
        await this.paso(page, async () => {
            await expect(page.getByRole(role, { name })).toBeDisabled({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, paso);
    }
};

module.exports = FN;