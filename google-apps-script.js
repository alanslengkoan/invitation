/**
 * Google Apps Script — Wedding Invitation RSVP Handler
 * Paste seluruh kode ini ke Google Apps Script Editor, lalu deploy sebagai Web App.
 *
 * Langkah:
 * 1. Buka https://script.google.com → New Project
 * 2. Paste kode ini
 * 3. Isi SPREADSHEET_ID di bawah (ambil dari URL spreadsheet kamu)
 *    URL spreadsheet: https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
 * 4. Jalankan fungsi setupSheet() SEKALI untuk membuat sheet & header
 * 5. Deploy → New Deployment → Web App
 *    - Execute as : Me
 *    - Who has access : Anyone
 * 6. Copy URL deployment → paste ke main.js pada variabel APPS_SCRIPT_URL
 */

var SPREADSHEET_ID = '1iIb_KdGtrlC8mzQLEaJVColU6BbRvplYCp723hQVQV8';
var SHEET_NAME     = 'RSVP';

function getSheet() {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    setupHeaders(sheet);
  }
  return sheet;
}

function setupHeaders(sheet) {
  var headers = ['Timestamp', 'Nama', 'Kehadiran', 'Jumlah Tamu', 'Ucapan / Doa'];
  var r = sheet.getRange(1, 1, 1, headers.length);
  r.setValues([headers]);
  r.setFontWeight('bold');
  r.setBackground('#c9a84c');
  r.setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 160);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 350);
}

function doGet(e) {
  try {
    var sheet = getSheet();
    var rows  = sheet.getDataRange().getValues();

    var wishes = [];
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      if (row[1] && row[4]) {
        wishes.push({
          timestamp:  row[0],
          name:       row[1],
          attendance: row[2],
          guests:     row[3],
          message:    row[4]
        });
      }
    }

    wishes.reverse();

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', wishes: wishes }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var sheet  = getSheet();
    var params = e.parameter;

    sheet.appendRow([
      new Date(),
      params.name       || '',
      params.attendance || '',
      params.guests     || '',
      params.message    || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Jalankan fungsi ini SEKALI dari Apps Script Editor
 * untuk membuat sheet "RSVP" dan header kolom.
 */
function setupSheet() {
  var sheet = getSheet();
  setupHeaders(sheet);
  Logger.log('Sheet siap: ' + sheet.getName());
}
