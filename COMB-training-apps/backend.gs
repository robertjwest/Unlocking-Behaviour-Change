// ============================================================
// Ethics Quiz — Google Apps Script Backend
// ============================================================
// SETUP:
//   1. Create a new Google Sheet and note its ID from the URL
//   2. In the sheet, go to Extensions > Apps Script
//   3. Paste this entire file, replacing the default content
//   4. Set SHEET_ID below to your sheet's ID
//   5. Deploy as a Web App:
//        Deploy > New deployment > Web app
//        Execute as: Me
//        Who has access: Anyone
//   6. Copy the Web App URL into index.html (SHEET_URL variable)
// ============================================================

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'Responses';

// Column headers written on first run
const HEADERS = [
  'Respondent ID',
  'Timestamp',
  'Scenario ID',
  'Scenario title',
  'Should do',
  'Would do',
  'Gap (1=yes, 0=no)'
];

function doPost(e) {
  try {
    // Accepts both form submissions (payload param) and direct JSON post
    const raw = (e.parameter && e.parameter.payload)
      ? e.parameter.payload
      : e.postData.contents;
    const data = JSON.parse(raw);
    const rows = data.responses;

    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create sheet and headers if needed
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
        .setFontWeight('bold')
        .setBackground('#1a1a2e')
        .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    // Append each scenario row
    rows.forEach(row => {
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

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET handler for health-check (visit the URL in a browser to test)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Ethics quiz backend is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
