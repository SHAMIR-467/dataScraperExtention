const EMAIL_PATTERN = /\b[A-Z0-9._%+-]{1,64}@(?!-)(?:[A-Z0-9-]+\.)+[A-Z]{2,63}\b/gi;
const DEFAULT_PAGE_SIZE = 25;

let dashboardRows = [];
let tableReady = false;
let refreshTimer = null;

const table = newTabulator("#example-table", {
    layout: "fitDataStretch",
    placeholder: "No leads collected yet. Start extraction on Google Maps, then this table will update automatically.",
    selectable: 1,
    pagination: "local",
    paginationSize: DEFAULT_PAGE_SIZE,
    paginationSizeSelector: [10, 25, 50, 100],
    movableColumns: true,
    height: "100%"
});

function capitalizeFirstLetter(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function flattenObject(value, prefix = "") {
    const result = {};

    Object.entries(value || {}).forEach(function([key, entry]) {
        const field = prefix ? `${prefix}_${key}` : key;
        if (entry && typeof entry === "object" && !Array.isArray(entry)) {
            Object.assign(result, flattenObject(entry, field));
        } else {
            result[field] = Array.isArray(entry) ? entry.join(", ") : entry;
        }
    });

    return result;
}

function getEmailsFromValue(value) {
    if (value === undefined || value === null) {
        return [];
    }

    const text = Array.isArray(value) ? value.join(" ") : String(value);
    return Array.from(text.matchAll(EMAIL_PATTERN), function(match) {
        return match[0].toLowerCase();
    });
}

function getEmailList() {
    const emails = new Set();

    dashboardRows.forEach(function(row) {
        Object.keys(row).forEach(function(field) {
            if (field.toLowerCase().includes("email")) {
                getEmailsFromValue(row[field]).forEach(function(email) {
                    emails.add(email);
                });
            }
        });
    });

    return Array.from(emails).sort();
}

function makeColumn(field) {
    const lowerField = field.toLowerCase();
    const column = {
        title: capitalizeFirstLetter(field),
        field,
        minWidth: lowerField.includes("email") ? 240 : 150,
        maxWidth: lowerField.includes("address") ? 420 : undefined,
        resizable: true,
        headerFilter: "input",
        formatter: "plaintext"
    };

    if (lowerField.includes("website") || lowerField.includes("instagram") || lowerField.includes("facebook") || lowerField.includes("linkedin") || lowerField.includes("youtube") || lowerField.includes("twitter")) {
        column.formatter = "link";
        column.formatterParams = { target: "_blank" };
        column.minWidth = 220;
    }

    return column;
}

function generateColumns(fields) {
    const preferredFields = "name phone email website address category reviewCount averageRating latitude longitude instagram facebook twitter linkedin yelp youtube placeID cID".split(" ");
    const seen = new Set();
    const columns = [];

    preferredFields.forEach(function(field) {
        if (fields.has(field)) {
            columns.push(makeColumn(field));
            seen.add(field);
        }
    });

    Array.from(fields).sort().forEach(function(field) {
        if (!seen.has(field)) {
            columns.push(makeColumn(field));
        }
    });

    if (!columns.length) {
        columns.push({ title: "Status", field: "status", minWidth: 260 });
    }

    table.setColumns(columns);
}

function csvEscape(value) {
    const text = String(value);
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function downloadTextFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function updateStatus() {
    const emailCount = getEmailList().length;
    const rowCount = dashboardRows.length;

    setText("row-count", rowCount.toLocaleString());
    setText("email-count", emailCount.toLocaleString());
    setText("last-update", formatTime(new Date()));
    setText("datastatus", `${rowCount.toLocaleString()} lead rows loaded, ${emailCount.toLocaleString()} unique emails found`);
}

function normalizeLeads(leads) {
    const fields = new Set();
    const rows = (Array.isArray(leads) ? leads : []).map(function(lead) {
        const row = flattenObject(lead);
        Object.keys(row).forEach(function(field) {
            fields.add(field);
        });
        return row;
    });

    return { fields, rows };
}

function renderLeads(leads) {
    const normalized = normalizeLeads(leads);
    dashboardRows = normalized.rows;
    generateColumns(normalized.fields);
    table.replaceData(dashboardRows).then(function() {
        updateStatus();
        tableReady = true;
    });
}

function loadData() {
    setText("datastatus", "Loading leads...");
    chrome.storage.local.get(["leads"], function(storage) {
        renderLeads(storage.leads || []);
    });
}

function scheduleLoadData() {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(loadData, 150);
}

function downloadEmailCsv() {
    const emails = getEmailList();
    if (!emails.length) {
        alert("No email addresses found to export.");
        return;
    }

    const csv = ["email"].concat(emails.map(csvEscape)).join("\r\n") + "\r\n";
    downloadTextFile("emails.csv", csv, "text/csv;charset=utf-8");
}

function downloadEmailTxt() {
    const emails = getEmailList();
    if (!emails.length) {
        alert("No email addresses found to export.");
        return;
    }

    downloadTextFile("emails.txt", emails.join("\r\n") + "\r\n", "text/plain;charset=utf-8");
}

function bindEvents() {
    document.getElementById("download-email-csv").addEventListener("click", downloadEmailCsv);
    document.getElementById("download-email-txt").addEventListener("click", downloadEmailTxt);
    document.getElementById("download-csv").addEventListener("click", function() {
        table.download("csv", "results.csv");
    });
    document.getElementById("download-xlsx").addEventListener("click", function() {
        table.download("xlsx", "results.xlsx", { sheetName: "Leads" });
    });
    document.getElementById("refresh-data").addEventListener("click", loadData);
    document.getElementById("page-size").addEventListener("change", function(event) {
        table.setPageSize(Number(event.target.value));
    });

    chrome.storage.onChanged.addListener(function(changes, areaName) {
        if (areaName === "local" && changes.leads) {
            scheduleLoadData();
        }
    });

    window.addEventListener("resize", function() {
        if (tableReady) {
            table.redraw(true);
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("accountinfo").innerHTML = "Powered by Xyber";
    bindEvents();
    loadData();
});
