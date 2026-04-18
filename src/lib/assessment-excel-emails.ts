import * as XLSX from "xlsx";

/** Scan spreadsheet cells for email-like values (same rules as dispatch paste). */
export function extractEmailsFromWorkbook(wb: XLSX.WorkBook): string[] {
  const found: string[] = [];
  const headerRe = /^(e-?mail|email address|student e-?mail|student email)$/i;

  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) continue;
    const rows = XLSX.utils.sheet_to_json<(string | number | boolean | null | undefined)[]>(sheet, {
      header: 1,
      defval: "",
    });
    for (const row of rows) {
      if (!Array.isArray(row)) continue;
      for (const cell of row) {
        const s = String(cell ?? "").trim();
        if (!s) continue;
        if (headerRe.test(s)) continue;
        found.push(s);
      }
    }
  }
  return found;
}
