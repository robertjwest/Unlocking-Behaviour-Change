// ============================================================
// Ethics Quiz — Google Apps Script Backend
// ============================================================
// SETUP:
//   1. Create a new Google Sheet and note its ID from the URL
//   2. In the sheet, go to Extensions > Apps Script
//   3. Paste this entire file, replacing the default content
//   4. Set SHEET_ID below to your sheet's ID
//   5. Deploy > Manage deployments > edit (pencil) > Deploy to update
// ============================================================

const SHEET_ID = '1HPKp35ZG9mSHy8n3zTYFhe136oBM9suDzFM4wWEbPU4';
const SHEET_NAME = 'Responses';

const HEADERS = [
  'Respondent ID',
  'Timestamp',
  'Scenario ID',
  'Scenario title',
  'Should do',
  'Would do',
  'Gap (1=yes, 0=no)'
];

function getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#1a1a2e')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// GET handler - receives payload as URL parameter, responds with JSONP
function doGet(e) {
  const callback = e.parameter.callback || 'callback';
  try {
    const raw = e.parameter.payload;
    if (!raw) throw new Error('No payload received');

    const data = JSON.parse(decodeURIComponent(raw));
    const rows = data.responses;
    if (!rows || !rows.length) throw new Error('No rows to write');

    const sheet = getOrCreateSheet();

    // Strictly append only - never overwrites existing data
    rows.forEach(function(row) {
      sheet.appendRow([
        row.respondent_id,
        row.timestamp,
        row.scenario_id,
        row.scenario_title,
        row.should_do,
        row.would_do,
        row.gap
      ]);
    });

    const result = JSON.stringify({ status: 'ok', rows_written: rows.length });
    return ContentService
      .createTextOutput(callback + '(' + result + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);

  } catch(err) {
    const result = JSON.stringify({ status: 'error', message: err.toString() });
    return ContentService
      .createTextOutput(callback + '(' + result + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

// POST handler kept as fallback
function doPost(e) {
  try {
    const raw = (e.parameter && e.parameter.payload)
      ? e.parameter.payload
      : e.postData.contents;
    const data = JSON.parse(raw);
    const rows = data.responses;
    const sheet = getOrCreateSheet();

    rows.forEach(function(row) {
      sheet.appendRow([
        row.respondent_id,
        row.timestamp,
        row.scenario_id,
        row.scenario_title,
        row.should_do,
        row.would_do,
        row.gap
      ]);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', rows_written: rows.length }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
