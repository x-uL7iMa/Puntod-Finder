// Function to show the selected table
function showTable(tableId) {
    document.getElementById('deceased-table').style.display = tableId === 'deceased' ? 'table' : 'none';
    document.getElementById('burial-table').style.display = tableId === 'burial' ? 'table' : 'none';
    document.getElementById('messages-table').style.display = tableId === 'messages' ? 'table' : 'none';
}

// Function to sort a column in a table
function sortColumn(tableId, columnIndex) {
    const table = document.getElementById(tableId);
    const rows = Array.from(table.tBodies[0].rows);
    const arrow = table.tHead.rows[0].cells[columnIndex].querySelector('.sort-arrow');
    const isAscending = arrow.textContent === '⮟';

    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        return isAscending
            ? aText.localeCompare(bText, undefined, { numeric: true })
            : bText.localeCompare(aText, undefined, { numeric: true });
    });

    rows.forEach(row => table.tBodies[0].appendChild(row));
    arrow.textContent = isAscending ? '⮝' : '⮟';
}