/**
 * Republica la web en Vercel cuando se edita el Google Sheet del stock.
 *
 * Instalación (una sola vez):
 * 1. En el Google Sheet: Extensiones → Apps Script. Pegar este archivo completo.
 * 2. Reemplazar DEPLOY_HOOK con la URL del Deploy Hook de Vercel
 *    (Vercel → proyecto → Settings → Git → Deploy Hooks).
 * 3. Elegir la función "instalar" arriba y tocar Ejecutar. Aceptar los permisos.
 *
 * Funcionamiento: cada edición marca la hoja como "con cambios". Cada minuto se revisa
 * esa marca y, si hay cambios, se publica la web una sola vez (así varias ediciones
 * seguidas no disparan muchas publicaciones). La web se actualiza en 1–2 minutos.
 * También agrega el menú "Web → Publicar ahora".
 */
const DEPLOY_HOOK = 'PEGAR_AQUI_LA_URL_DEL_DEPLOY_HOOK';

function instalar() {
  ScriptApp.getProjectTriggers().forEach((t) => ScriptApp.deleteTrigger(t));
  const ss = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('marcarCambio').forSpreadsheet(ss).onEdit().create();
  ScriptApp.newTrigger('marcarCambio').forSpreadsheet(ss).onChange().create();
  ScriptApp.newTrigger('publicarSiHayCambios').timeBased().everyMinutes(1).create();
  SpreadsheetApp.getUi().alert('Listo: la web se actualizará sola al editar la hoja.');
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Web').addItem('Publicar ahora', 'publicarAhora').addToUi();
}

function marcarCambio() {
  PropertiesService.getScriptProperties().setProperty('pendiente', '1');
}

function publicarSiHayCambios() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('pendiente') !== '1') return;
  props.deleteProperty('pendiente');
  publicar_();
}

function publicarAhora() {
  publicar_();
  SpreadsheetApp.getActive().toast('Publicando… la web se actualiza en 1–2 minutos.');
}

function publicar_() {
  const res = UrlFetchApp.fetch(DEPLOY_HOOK, { method: 'post', muteHttpExceptions: true });
  if (res.getResponseCode() >= 300) {
    PropertiesService.getScriptProperties().setProperty('pendiente', '1'); // reintenta al minuto
    throw new Error('Vercel respondió ' + res.getResponseCode() + ': ' + res.getContentText());
  }
}
