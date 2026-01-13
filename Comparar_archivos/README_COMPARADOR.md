# 📋 Comparador JSON vs Excel - Guía de Uso

## 🎯 Descripción
Script profesional para comparar archivos JSON contra Excel, tomando el Excel como archivo base maestro.

**Características especiales:**
- ✅ Extrae registros recursivamente de JSON anidado (estructura tipo árbol con "referencias")
- ✅ Busca campo `secuencia` como clave principal en cualquier nivel de profundidad
- ✅ Maneja estructuras JSON complejas automáticamente

**Autor:** RVN - Cursos QA Automatizados  
**Lenguaje:** Python 3 con pandas + openpyxl

---

## 🚀 Pasos para Usar el Script

### 1️⃣ Subir tu archivo JSON
- Sube tu archivo JSON grande a través de la interfaz de Claude
- El archivo debe estar en la misma carpeta que el Excel base
- Recuerda el nombre exacto del archivo (ej: `datos_completos.json`)

### 2️⃣ Configurar el Script

Abre el archivo `comparador_json_excel.py` y modifica estas líneas al inicio:

```python
# ============================================================================
# CONFIGURACIÓN
# ============================================================================

# 🎯 PARÁMETROS PRINCIPALES
NUMERO_FILAS_VALIDAR = 5  # Cambiar a None para procesar TODO el archivo
# NUMERO_FILAS_VALIDAR = None  # Descomentar para procesar completo

# 📁 RUTAS DE ARCHIVOS
EXCEL_BASE_PATH = '/mnt/user-data/uploads/BASE_EXCEL_PYTHON.xlsx'
JSON_PATH = '/mnt/user-data/uploads/TU_ARCHIVO.json'  # 🔥 CAMBIAR AQUÍ
CARPETA_REPORTES = '/mnt/user-data/outputs'
```

**Opciones de configuración:**

#### Para validar solo las primeras filas:
```python
NUMERO_FILAS_VALIDAR = 5   # Procesa solo 5 filas
```

#### Para procesar TODO el archivo:
```python
NUMERO_FILAS_VALIDAR = None   # Procesa todo
```

### 3️⃣ Ejecutar el Script

Ejecuta el siguiente comando:

```bash
python3 /home/claude/comparador_json_excel.py
```

---

## 📊 Reportes Generados

El script genera 2 reportes Excel profesionales:

### 1. **RESUMEN_Comparacion_YYYYMMDD_HHMMSS.xlsx**
Resumen por fila con:
- Secuencia y Orden
- Si se encontró en JSON
- Total de campos
- Campos que coinciden
- Campos que difieren
- Porcentaje de coincidencia

### 2. **DETALLADO_Comparacion_YYYYMMDD_HHMMSS.xlsx**
Comparación campo por campo con:
- Secuencia y Orden
- Nombre del campo
- Valor en Excel
- Valor en JSON
- ¿Coincide? (Sí/No)
- Descripción de diferencia

**Formato Visual:**
- 🟢 Verde = Campos que coinciden
- 🔴 Rojo = Campos con diferencias
- Encabezados azules con texto blanco
- Columnas auto-ajustadas
- Primera fila congelada

---

## 🔍 Características del Script

### ✅ Funcionalidades
- ✔️ **Extracción recursiva:** Busca `secuencia` en todos los niveles del JSON (maneja estructura anidada con "referencias")
- ✔️ Compara campo por campo JSON vs Excel
- ✔️ Excel es SIEMPRE el archivo maestro de referencia
- ✔️ Busca por `secuencia` + `orden` (clave única)
- ✔️ Normaliza JSON anidados a strings para comparación
- ✔️ Maneja arrays y objetos JSON correctamente
- ✔️ Normaliza espacios en blanco
- ✔️ Convierte NaN/null a vacío
- ✔️ Modo validación (primeras N filas) o completo
- ✔️ Reportes con formato condicional profesional
- ✔️ Estadísticas detalladas en consola

### 🌳 Manejo de JSON Anidado
El script maneja automáticamente estructuras JSON complejas como:
```json
{
  "map": [
    {
      "secuencia": 1,
      "orden": 1,
      "referencias": [
        {
          "secuencia": 2,
          "orden": 2,
          "referencias": [
            {
              "secuencia": 3,
              "orden": 3
            }
          ]
        }
      ]
    }
  ]
}
```

**El script extrae TODOS los registros con `secuencia` sin importar cuán profundo estén anidados.**

### 📈 Ejemplo de Salida en Consola

```
================================================================================
🚀 COMPARADOR JSON vs EXCEL - RVN Cursos QA Automatizados
================================================================================
📅 Fecha de ejecución: 2024-12-08 15:30:45
⚙️  Modo: VALIDACIÓN - Procesando primeras 5 filas
================================================================================
📂 Cargando Excel: /mnt/user-data/uploads/BASE_EXCEL_PYTHON.xlsx
   ✅ Cargadas 5 filas (limitado a 5)
   📊 Total de columnas: 49
📂 Cargando JSON: /mnt/user-data/uploads/datos.json
   ✅ Cargados 1000 registros JSON

🔄 Procesando comparación...
   Procesando fila 1/5 - Secuencia: 1, Orden: 1
   Procesando fila 2/5 - Secuencia: 2, Orden: 2
   ...
   ✅ Comparación completada: 245 comparaciones realizadas

📊 Generando reportes...
   📝 Guardando reporte resumen...
      🎨 Aplicando formato a hoja: Resumen
      ✅ Formato aplicado exitosamente
   📝 Guardando reporte detallado...
      🎨 Aplicando formato a hoja: Detallado
      ✅ Formato aplicado exitosamente

✅ Reportes generados exitosamente:
   📄 Resumen: RESUMEN_Comparacion_20241208_153045.xlsx
   📄 Detallado: DETALLADO_Comparacion_20241208_153045.xlsx

================================================================================
📊 ESTADÍSTICAS GENERALES
================================================================================

📋 Resumen de Filas:
   • Total de filas procesadas: 5
   • Filas encontradas en JSON: 5
   • Filas NO encontradas en JSON: 0

📊 Resumen de Campos:
   • Total de comparaciones: 245
   • Campos que coinciden: 230 (93.88%)
   • Campos diferentes: 15 (6.12%)

================================================================================

✅ Proceso completado exitosamente!
📁 Los reportes están disponibles en: /mnt/user-data/outputs
================================================================================
```

---

## 🔧 Troubleshooting

### ❌ Error: "No se encontró el archivo JSON"
**Solución:** Verifica que:
1. El archivo JSON está subido correctamente
2. La ruta `JSON_PATH` en el script coincide con el nombre del archivo
3. El archivo está en `/mnt/user-data/uploads/`

### ⚠️ Advertencia: "No se encontró en JSON"
**Causa:** Algunos registros del Excel no tienen correspondencia en el JSON
**Solución:** Esto es normal si tu JSON no tiene todos los registros. El reporte mostrará cuáles faltan.

### 🐌 Proceso muy lento
**Causa:** Archivo muy grande en modo completo
**Solución:** Usa modo validación primero con `NUMERO_FILAS_VALIDAR = 10` para probar

---

## 📝 Notas Importantes

1. **Clave de búsqueda:** El script busca registros por `secuencia` + `orden`
2. **Excel es el maestro:** Siempre se toma el Excel como referencia base
3. **Comparación de JSON:** Los objetos JSON anidados se comparan como strings JSON completos
4. **Arrays:** Los arrays se normalizan a JSON string sin espacios
5. **Espacios:** Se normalizan múltiples espacios a uno solo
6. **Case sensitive:** La comparación distingue mayúsculas/minúsculas

---

## 🎓 Creado por RVN - Cursos QA Automatizados
**Rodrigo RVN** - QA Coordinator @ Wecomplai  
17+ años de experiencia en Testing & Automation