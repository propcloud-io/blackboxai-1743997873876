export function generateCSV(data, columns) {
  const headers = columns.map(col => `"${col.header}"`).join(',');
  const rows = data.map(item => 
    columns.map(col => {
      const value = col.accessor(item);
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    }).join(',')
  );
  
  return [headers, ...rows].join('\n');
}

export function downloadFile(content, filename, format = 'csv') {
  let mimeType, ext;
  switch(format) {
    case 'json':
      mimeType = 'application/json';
      ext = 'json';
      break;
    case 'excel':
      mimeType = 'application/vnd.ms-excel';
      ext = 'xls';
      break;
    default: // csv
      mimeType = 'text/csv;charset=utf-8;';
      ext = 'csv';
  }

  if (!filename.endsWith(`.${ext}`)) {
    filename = `${filename}.${ext}`;
  }

  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}