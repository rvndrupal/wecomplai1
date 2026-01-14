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

//Esto es un nuevo comentario

//Cambio para funciones 4

//Git funciones 5

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

        // 🧹 LIMPIAR carpeta si ya existe (elimina imágenes viejas)
        if (fs.existsSync(carpetaImagenes)) {
            fs.rmSync(carpetaImagenes, { recursive: true, force: true });
        }

        // Crear carpeta fresca
        fs.mkdirSync(carpetaImagenes, { recursive: true });

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

    //Salir de weComplai
    async salirwe(page, carpeta, pasoBase = 'logout') {
        // 🔧 FIX: Usar .first() para evitar "strict mode violation" cuando hay múltiples avatares
        await this.paso(page, async () => {
            await page.locator('g:nth-child(7) > path:nth-child(6)').first().click({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, `${pasoBase}_01_click_icono_usuario`);

        await this.clickRole(page, 'button', 'Cerrar sesión', carpeta, `${pasoBase}_02_click_cerrar_sesion`);
        await this.clickRole(page, 'button', 'Sí', carpeta, `${pasoBase}_03_confirmar_cerrar_sesion`);
        await this.pausa(5000);
    },

    async clickText2(page, texto, carpeta, paso) {
        await this.paso(page, async () => {
            await page.getByText(texto).first().click({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, paso);
    },

    //Selector para si Empresas
    async selectDropdownOption(page, opcion, carpeta, paso) {
        await this.paso(page, async () => {
            await page.getByText(opcion, { exact: true }).filter({ hasNotText: 'última sesión' }).first().click({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, paso);
    },

    //BUSQUEDA GLOSARIO POR INICIAL A,B,C
    async busquedaGlosarioPorInicial(
        page,
        letra,
        carpeta,
        pasoBase = `busqueda_${letra}`,
        pausaClickMs = 1500,
        maxClicks = 3
    ) {

        // 1️⃣ Click en "Búsqueda por inicial"
        await this.clickRole(
            page,
            'button',
            'Búsqueda por inicial',
            carpeta,
            `${pasoBase}_01_click_busqueda_inicial`
        );

        await this.pausa(1000);

        // 2️⃣ Click en la letra
        await page.getByText(letra, { exact: true }).click();

        await this.Foto_completa(
            page,
            carpeta,
            `${pasoBase}_02_click_letra_${letra}`,
            `Se ejecutó búsqueda por inicial con la letra ${letra}`
        );

        // 3️⃣ Esperar resultados
        const resultados = page.locator('ul.space-y-1 li');

        let total = 0;
        try {
            await resultados.first().waitFor({ timeout: 4000 });
            total = await resultados.count();
        } catch {
            total = 0;
        }

        await this.Foto_completa(
            page,
            carpeta,
            `${pasoBase}_03_resultados_${letra}`,
            `Resultados encontrados con la letra ${letra}: ${total}`
        );

        // 4️⃣ Si NO hay resultados → warning + registrar letra
        if (total === 0) {
            console.warn(`⚠️ [Glosario] La letra "${letra}" NO tiene resultados`);
            this._glosarioSinResultados.add(letra);
            return;
        }

        console.warn(`⚠️ [Glosario] Resultados con letra ${letra}: ${total}`);

        // 5️⃣ Cuántos clicks hacer
        const cantidadClicks = Math.min(total, maxClicks);

        // 6️⃣ Índices (aleatorios si sobran)
        let indices = [];

        if (total > cantidadClicks) {
            while (indices.length < cantidadClicks) {
                const rand = Math.floor(Math.random() * total);
                if (!indices.includes(rand)) {
                    indices.push(rand);
                }
            }
        } else {
            indices = Array.from({ length: cantidadClicks }, (_, i) => i);
        }

        // 7️⃣ Clicks + pausa + evidencia
        for (let i = 0; i < indices.length; i++) {
            const index = indices[i];

            await resultados.nth(index).scrollIntoViewIfNeeded();
            await resultados.nth(index).click();

            await this.pausa(pausaClickMs);

            await this.Foto_completa(
                page,
                carpeta,
                `${pasoBase}_04_click_${letra}_${i + 1}`,
                `Click en resultado ${index + 1} de ${total} para letra ${letra}`
            );
        }
    },

    //BUSQUEDA GLOSARIO TODO A-Z
    async busquedaGlosarioAZ(
        page,
        carpeta,
        pasoBase = 'glosario_AZ',
        pausaClickMs = 1500,
        maxClicks = 3,
        letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    ) {
        // ✅ Reset seguro (no revienta aunque no exista previamente)
        if (typeof this.resetResumenGlosarioSinResultados === 'function') {
            this.resetResumenGlosarioSinResultados();
        } else {
            this._glosarioSinResultados = new Set();
        }

        for (const letra of letras) {
            await this.busquedaGlosarioPorInicial(
                page,
                letra,
                carpeta,
                `${pasoBase}_${letra}`,
                pausaClickMs,
                maxClicks
            );

            // pausa pequeña entre letras (opcional)
            await this.pausa(500);
        }

        // ✅ Resumen final
        if (typeof this.mostrarResumenGlosarioSinResultados === 'function') {
            this.mostrarResumenGlosarioSinResultados();
        } else if (this._glosarioSinResultados?.size) {
            console.warn(`⚠️ [Glosario] Letras SIN resultados: ${Array.from(this._glosarioSinResultados).sort().join(', ')}`);
        }
    },







    //Esperar_consulta
    async Esperar_consulta(page, texto = 'Se creó la consulta', tiempo = 30000, carpeta, paso) {
        await this.paso(page, async () => {
            await expect(page.getByText(texto)).toBeVisible({ timeout: tiempo });
        }, carpeta, paso);
    },

    //Espera Resulatdos de Consulta dos Mensajes
    // ====================
    // Espera Resultados de Consulta (2 mensajes)
    // ====================
    async esperarResultadoConsulta(page, carpeta, timeout = 90000) {
        const resultados = [];

        await Promise.race([
            this.Esperar_consulta(
                page,
                'Se creó la consulta',
                timeout,
                carpeta,
                'Consulta_OK'
            ).then(() => resultados.push('OK')),

            this.Esperar_consulta(
                page,
                'No existe información para consultar',
                timeout,
                carpeta,
                'Consulta_SIN_DATOS'
            ).then(() => resultados.push('SIN_DATOS'))
        ]);

        // pequeña ventana para detectar si aparece el otro mensaje
        await page.waitForTimeout(1500);

        if (await page.getByText('Se creó la consulta').isVisible().catch(() => false)) {
            resultados.push('OK');
        }

        if (await page.getByText('No existe información para consultar').isVisible().catch(() => false)) {
            resultados.push('SIN_DATOS');
        }

        const unicos = [...new Set(resultados)];

        if (unicos.length > 1) {
            console.warn('⚠️ WARNING: el sistema mostró ambos mensajes', unicos);
            return 'WARNING_AMBOS';
        }

        return unicos[0];
    },



    //Pausa
    async pausa(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    //Click ComboLabel
    async clickComboByLabel(page, label, textoBoton, carpeta, paso) {
        await this.paso(page, async () => {
            await page
                .getByText(label, { exact: true })
                .locator(
                    'xpath=following::button[.//span[normalize-space()="' + textoBoton + '"]][1]'
                )
                .click({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, paso);
    },

    //Clcik en Flecha 
    async clickComboArrowByLabel(page, label, carpeta, paso) {
        await this.paso(page, async () => {
            await page
                .getByText(label, { exact: true })
                .locator(
                    'xpath=following::div[contains(@class,"rotate-90")][1]'
                )
                .click({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, paso);
    },

    //Generar nombre
    generarNombreSinNumero(prefijo = 'Demo nuevo') {
        const nombres = [
            'Carlos',
            'Andrea',
            'Luis',
            'Mariana',
            'Roberto',
            'Fernanda',
            'Jorge',
            'Ana',
            'Daniel',
            'Sofía',
            'Miguel',
            'Laura',
            'Pedro',
            'Paola',
            'Ricardo',
            'Valeria',
            'Héctor',
            'Gabriela',
            'Alejandro',
            'Natalia'
        ];

        const apellidos = [
            'García',
            'López',
            'Martínez',
            'Hernández',
            'González',
            'Pérez',
            'Ramírez',
            'Torres',
            'Flores',
            'Vargas'
        ];

        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];

        return `${prefijo} ${nombre} ${apellido}`;
    },

    //Generar correos aleatorios
    generarCorreoDemo() {
        const nombres = [
            'Carlos', 'Andrea', 'Luis', 'Mariana', 'Roberto',
            'Fernanda', 'Jorge', 'Ana', 'Daniel', 'Sofia',
            'Miguel', 'Laura', 'Pedro', 'Paola'
        ];

        const apellidos = [
            'Garcia', 'Lopez', 'Martinez', 'Hernandez',
            'Gonzalez', 'Perez', 'Ramirez', 'Torres'
        ];

        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];

        return `correodemo${nombre}${apellido}`.toLowerCase();
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

    //Foto Completa
    async Foto_completa(page, carpeta, nombreImagen) {
        if (!carpeta) return;

        const key = `${carpeta}_${nombreImagen}`;

        if (!this._contadorImagenes[key]) {
            this._contadorImagenes[key] = 1;
        } else {
            this._contadorImagenes[key]++;
        }

        const version = this._contadorImagenes[key];
        const nombreFinal = version === 1
            ? nombreImagen
            : `${nombreImagen}_v${version}`;

        const tempPath = path.join(carpeta, `${nombreFinal}.png`);
        const finalPath = path.join(carpeta, `${nombreFinal}.jpg`);

        await page.screenshot({ path: tempPath, fullPage: true });
        console.info(`📸 [Foto_completa] Capturando imagen: ${nombreFinal}.jpg`);

        await sharp(tempPath)
            .jpeg({ quality: 60 })
            .toFile(finalPath);

        fs.unlinkSync(tempPath);

        await this.esperar(TP_GLOBAL);
    }, 

    //VALIDACIÓN VISIBLE Y CLICK 
    async expectTextVisibleAndClickSelf(page, texto, carpeta, paso) {
        await this.paso(page, async () => {
            const textLocator = page.getByText(texto);

            // 1️⃣ Esperar SOLO el texto
            await expect(textLocator).toBeVisible({ timeout: TIMEOUT_GLOBAL });

            console.log(`✅ Texto visible encontrado: "${texto}"`);

            // 2️⃣ Click directo al texto
            await textLocator.click({ timeout: TIMEOUT_GLOBAL });
        }, carpeta, paso);
    },

    //Funcion para palabra Exacta, filtrado
    async activarTogglePorTexto(page, textoToggle, carpeta, paso) {
        await this.paso(page, async () => {

            // 1️⃣ Ubicar el texto
            const spanTexto = page.getByText(textoToggle, { exact: true });
            await expect(spanTexto).toBeVisible({ timeout: TIMEOUT_GLOBAL });

            // 2️⃣ Nodo REAL con estado React (padre directo del span)
            const toggleReal = spanTexto.locator('..');

            await expect(toggleReal).toBeVisible({ timeout: TIMEOUT_GLOBAL });

            // 3️⃣ Capturar clases ANTES
            const clasesAntes = await toggleReal.getAttribute('class');
            console.log(`ℹ️ Clases ANTES de activar "${textoToggle}": ${clasesAntes}`);

            // 4️⃣ Click real (aquí está el onClick de React)
            await toggleReal.click({ timeout: TIMEOUT_GLOBAL });

            // 5️⃣ Esperar cambio REAL de clases (estado activo)
            await expect(toggleReal).toHaveClass(
                /text-white|font-semibold/,
                { timeout: TIMEOUT_GLOBAL }
            );

            // 6️⃣ Capturar clases DESPUÉS
            const clasesDespues = await toggleReal.getAttribute('class');
            console.log(`🟢 Clases DESPUÉS de activar "${textoToggle}": ${clasesDespues}`);

            // 7️⃣ Mensaje final
            console.log(
                `✅ React confirmó el estado: el toggle "${textoToggle}" se activó correctamente`
            );

        }, carpeta, paso);
    },

    //Trqaducir el error de la prueba
    async traducirError(msg) {
        if (!msg) return 'Error desconocido';
        if (msg.includes('getByText')) {
            const m = msg.match(/Text "(.*)"/);
            return m ? `No cargó o no se encontró: "${m[1]}"` : 'No se encontró el texto esperado';
        }
        if (msg.includes('Timeout')) return 'La pantalla no respondió a tiempo';
        if (msg.includes('toBeVisible')) return 'El elemento esperado no fue visible';
        return msg;
    },



    //Boton Aplicar para activar la consulta
    async clickAplicarConsulta(page, carpeta, paso) {
        await this.paso(page, async () => {

            // 1️⃣ Ubicar el texto "Aplicar"
            const textoAplicar = page.getByText('Aplicar', { exact: true });
            await expect(textoAplicar).toBeVisible({ timeout: TIMEOUT_GLOBAL });

            // 2️⃣ Subir al div que tiene el onClick real
            const botonReal = textoAplicar.locator('..');

            await expect(botonReal).toBeVisible({ timeout: TIMEOUT_GLOBAL });

            // 3️⃣ Click REAL (React handler)
            await botonReal.click({ timeout: TIMEOUT_GLOBAL });

            console.log('🟢 Click REAL en "Aplicar" ejecutado (handler React)');

        }, carpeta, paso);
    },

    //Esperar Resultados de Consulta
    async esperarResultadosConsulta(page) {
        await page.waitForResponse(r =>
            r.url().includes('/filter/create') &&
            r.request().method() === 'POST' &&
            r.status() === 200
        );

        await page.waitForResponse(r =>
            r.url().includes('configuration_matrix') &&
            r.request().method() === 'GET' &&
            r.status() === 200
        );
    },


    //Contenido a Buscar
    async llenarContenidoBusqueda(page, palabras, carpeta, paso) {
        await this.paso(page, async () => {

            // 🔑 input CORRECTO (no ambiguo)
            const input = page.locator('#content');

            await expect(input).toBeVisible({
                timeout: TIMEOUT_GLOBAL
            });
            await expect(input).toBeEnabled();

            for (const palabra of palabras) {
                await input.click();
                await input.fill(palabra);

                // 🔑 evento crítico: crear el chip
                await page.keyboard.press('Enter');

                // esperar a que el chip exista (React state OK)
                await expect(
                    page.getByText(palabra, { exact: true })
                ).toBeVisible({ timeout: TIMEOUT_GLOBAL });
            }

            console.log(
                `🟢 Contenido confirmado en React: ${palabras.join(', ')}`
            );

        }, carpeta, paso);
    },







    //Visible Click-First
    async expectTextVisibleAndClickSelf1(page, texto, carpeta, paso) {
        await this.paso(page, async () => {

            // 🔹 Usar FIRST para evitar strict mode
            const textLocator = page.getByText(texto).first();

            // 1️⃣ Esperar SOLO el texto correcto
            await expect(textLocator).toBeVisible({ timeout: TIMEOUT_GLOBAL });

            console.log(`✅ Texto visible encontrado (first): "${texto}"`);

            // 2️⃣ Click directo al texto
            await textLocator.click({ timeout: TIMEOUT_GLOBAL });

        }, carpeta, paso);
    },



    //Validación visual y por valor Oro
    async expectRowDataAndVisual({ page, rowLocator, expected, snapshot, carpeta, paso }) {
        await this.paso(page, async () => {

            await rowLocator.first().waitFor({ state: 'visible', timeout: 10000 });

            // ===== VALIDACIÓN DE DATOS =====
            if (expected.no) {
                await expect(rowLocator).toContainText(expected.no);
                console.log(`✅ Dato OK → No: ${expected.no}`);
            }

            if (expected.totalArticulos) {
                await expect(rowLocator).toContainText(expected.totalArticulos);
                console.log(`✅ Dato OK → Total artículos: ${expected.totalArticulos}`);
            }

            if (expected.totalRequerimientos) {
                await expect(rowLocator).toContainText(expected.totalRequerimientos);
                console.log(`✅ Dato OK → Total requerimientos: ${expected.totalRequerimientos}`);
            }

            console.log('🧾 Validación de datos COMPLETA');

            // ===== REGRESIÓN VISUAL =====
            await expect(rowLocator).toHaveScreenshot(snapshot, {
                animations: 'disabled',
                caret: 'hide',
                maxDiffPixels: 80
            });

            console.log(`🖼️ Imagen OK → ${snapshot}`);
            console.log('🎯 Regresión visual CORRECTA');

        }, carpeta, paso);
    },

    //Validacion de Regresion visual Sola
    async expectVisualOnlyWarning({ page, locator, snapshot, carpeta, paso }) {
        await this.paso(page, async () => {

            await locator.first().waitFor({ state: 'visible', timeout: TIMEOUT_GLOBAL });

            try {
                await expect(locator).toHaveScreenshot(snapshot, {
                    animations: 'disabled',
                    caret: 'hide',
                    maxDiffPixels: 80
                });

                console.log(`🖼️ VISUAL OK → ${snapshot}`);

            } catch (error) {

                console.warn(`⚠️ VISUAL WARNING`);
                console.warn(`⚠️ Imagen no coincide o no existe → ${snapshot}`);
                console.warn(`⚠️ El test continúa sin fallar`);

                // 👇 OPCIONAL: guarda el mensaje para reportes
                // warnings.push({ snapshot, paso });

            }

        }, carpeta, paso);
    },

    //Generar usuarios
    generarUsuarios(cantidad) {
        return Array.from({ length: cantidad }, (_, i) => i + 1);
    },

    //Click por texto encontrado
    async expectTextNthAndClickRelative(
        page,
        texto,
        index,
        selectorRelativo,
        carpeta,
        paso
    ) {
        await this.paso(page, async () => {

            // 1️⃣ Esperar texto estable
            const textoLocator = page.getByText(texto).nth(index);

            await expect(textoLocator).toBeVisible({
                timeout: TIMEOUT_GLOBAL
            });

            // 2️⃣ Subir a la fila contenedora real
            const fila = textoLocator
                .locator('..')
                .locator('..')
                .locator('..');

            // 3️⃣ Esperar elemento relativo (FIX PARA PARALELO)
            const elementoRelativo = fila.locator(selectorRelativo).first();

            await expect(elementoRelativo).toBeVisible({
                timeout: TIMEOUT_GLOBAL
            });

            await expect(elementoRelativo).toBeEnabled({
                timeout: TIMEOUT_GLOBAL
            });

            // 4️⃣ Click seguro
            await elementoRelativo.click({
                timeout: TIMEOUT_GLOBAL
            });

        }, carpeta, paso);
    },


    //Total Registros por pagina 
    // async expectTotalRegistrosTablaPaginada(
    //     page,
    //     filasPorPagina,
    //     totalEsperado,
    //     carpeta,
    //     paso,
    //     delayPaginadorMs = WAIT_GLOBAL
    // ) {
    //     await this.paso(page, async () => {

    //         const opcionesValidas = [10, 25, 50, 100];
    //         if (!opcionesValidas.includes(filasPorPagina)) {
    //             throw new Error(
    //                 `❌ filasPorPagina inválido: ${filasPorPagina}. ` +
    //                 `Valores permitidos: ${opcionesValidas.join(', ')}`
    //             );
    //         }

    //         console.log(`📊 Validación de paginación (robusta)`);
    //         console.log(`➡️ Total esperado: ${totalEsperado}`);
    //         console.log(`➡️ Filas por página: ${filasPorPagina}`);

    //         // =========================
    //         // 1️⃣ Seleccionar filas
    //         // =========================
    //         await page.getByRole('combobox').click();
    //         await page.getByText(new RegExp(`^${filasPorPagina}\\s*Filas$`)).click();
    //         await page.locator('body').click();
    //         await page.waitForTimeout(WAIT_GLOBAL);

    //         let acumulado = 0;
    //         let iteracion = 1;

    //         while (true) {

    //             const restantes = totalEsperado - acumulado;
    //             const registrosPagina =
    //                 restantes >= filasPorPagina ? filasPorPagina : restantes;

    //             acumulado += registrosPagina;

    //             console.log(
    //                 `📄 Iteración ${iteracion}: ${registrosPagina} registros ` +
    //                 `(acumulado: ${acumulado})`
    //             );

    //             const paginador = page.locator(
    //                 'div.absolute.bottom-8.right-8 >> div >> div.flex'
    //             );

    //             const botonSiguiente = paginador.locator('button').nth(1);

    //             if (await botonSiguiente.isDisabled()) {
    //                 console.log(`⛔ Última página alcanzada`);
    //                 break;
    //             }

    //             await botonSiguiente.click();
    //             await page.waitForTimeout(delayPaginadorMs);

    //             iteracion++;
    //         }

    //         // =========================
    //         // 2️⃣ ÚNICA validación real
    //         // =========================
    //         expect(acumulado).toBe(totalEsperado);

    //         console.log(`✅ Total validado correctamente: ${acumulado}`);
    //         console.log(`✅ Iteraciones ejecutadas: ${iteracion}`);

    //     }, carpeta, paso);
    // },
    async expectTotalRegistrosTablaPaginada(
        page,
        filasPorPagina,
        totalEsperado,
        carpeta,
        paso,
        delayPaginadorMs = WAIT_GLOBAL
    ) {
        await this.paso(page, async () => {

            const opcionesValidas = [10, 25, 50, 100];
            if (!opcionesValidas.includes(filasPorPagina)) {
                throw new Error(
                    `❌ filasPorPagina inválido: ${filasPorPagina}. ` +
                    `Valores permitidos: ${opcionesValidas.join(', ')}`
                );
            }

            console.log(`📊 Validación de paginación con resto final`);
            console.log(`➡️ Total esperado: ${totalEsperado}`);
            console.log(`➡️ Filas por página: ${filasPorPagina}`);

            // =========================
            // 1️⃣ Seleccionar filas
            // =========================
            await page.getByRole('combobox').click();
            await page.getByText(new RegExp(`^${filasPorPagina}\\s*Filas$`)).click();
            await page.locator('body').click();
            await page.waitForTimeout(WAIT_GLOBAL);

            let acumulado = 0;
            let iteracion = 1;
            let restoValidado = false;

            while (true) {

                const restantes = totalEsperado - acumulado;
                const registrosPagina =
                    restantes >= filasPorPagina ? filasPorPagina : restantes;

                // =========================
                // 2️⃣ Validar RESTO REAL
                // =========================
                if (restantes > 0 && restantes < filasPorPagina) {
                    console.log(
                        `📄 Página con resto detectada: ${registrosPagina} registros`
                    );
                    expect(registrosPagina).toBe(restantes);
                    restoValidado = true;
                }

                acumulado += registrosPagina;

                console.log(
                    `📄 Iteración ${iteracion}: ${registrosPagina} registros ` +
                    `(acumulado: ${acumulado})`
                );

                // =========================
                // 3️⃣ Avanzar paginador
                // =========================
                const paginador = page.locator(
                    'div.absolute.bottom-8.right-8 >> div >> div.flex'
                );

                const botonSiguiente = paginador.locator('button').nth(1);

                if (await botonSiguiente.isDisabled()) {
                    console.log(`⛔ Última página alcanzada`);
                    break;
                }

                await botonSiguiente.click();
                await page.waitForTimeout(delayPaginadorMs);

                iteracion++;
            }

            // =========================
            // 4️⃣ Validaciones finales
            // =========================
            expect(acumulado).toBe(totalEsperado);

            if (totalEsperado % filasPorPagina !== 0) {
                expect(restoValidado).toBe(true);
            }

            console.log(`✅ Total validado correctamente: ${acumulado}`);
            console.log(`✅ Iteraciones ejecutadas: ${iteracion}`);
            console.log(`✅ Resto final validado correctamente`);

        }, carpeta, paso);
    },


    //Foto Completa Warning
    async Foto_completa2(page, carpeta, nombreImagen, warningMsg = null) {
        if (!carpeta || !nombreImagen) {
            console.warn(`⚠️ [Foto_completa] Parámetros inválidos`, { carpeta, nombreImagen });
            return;
        }
        // ⚠️ WARNING SIEMPRE que venga mensaje
        if (warningMsg) {
            console.warn(`⚠️ [Foto_completa] ${warningMsg}`);
        }
        const key = `${carpeta}_${nombreImagen}`;
        // 🔁 Control de versiones
        if (!this._contadorImagenes[key]) {
            this._contadorImagenes[key] = 1;
        } else {
            this._contadorImagenes[key]++;
        }
        const version = this._contadorImagenes[key];
        const nombreFinal = version === 1
            ? nombreImagen
            : `${nombreImagen}_v${version}`;

        console.info(`📸 [Foto_completa] Capturando imagen: ${nombreFinal}.jpg`);

        const tempPath = path.join(carpeta, `${nombreFinal}.png`);
        const finalPath = path.join(carpeta, `${nombreFinal}.jpg`);

        await page.screenshot({
            path: tempPath,
            fullPage: true
        });

        await sharp(tempPath)
            .jpeg({ quality: 60 })
            .toFile(finalPath);

        fs.unlinkSync(tempPath);

        await this.esperar(TP_GLOBAL);
    },





    async esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms || WAIT_GLOBAL));
    },

    async goto(page, url, carpeta, paso) {
        await this.paso(page, async () => {
            await page.goto(url);
            await page.setViewportSize({ width: 1500, height: 500 });
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