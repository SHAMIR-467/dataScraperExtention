function normalizeProfileId(value) {
    return value.trim().toLowerCase();
}

function openMapsSearch() {
    const query = normalizeProfileId(document.getElementById("profileid").value);
    if (!query) {
        return;
    }
    window.open("https://www.google.com/maps/search/" + encodeURIComponent(query));
}

function setPermissionStatus(message, isError) {
    const status = document.getElementById("permission-status");
    if (!status) {
        return;
    }
    status.textContent = message;
    status.classList.toggle("permission-error", Boolean(isError));
}

function requestWebsitePermission() {
    setPermissionStatus("Requesting website access permission...");
    chrome.runtime.sendMessage({ action: "requestWebsitePermission" }, function(response) {
        if (chrome.runtime.lastError) {
            setPermissionStatus("Could not request permission. Reload the extension and try again.", true);
            return;
        }

        if (response && response.granted) {
            setPermissionStatus("Website access enabled for public email discovery.");
            return;
        }

        setPermissionStatus("Website access was not granted. Email discovery from business sites will be limited.", true);
    });
}

function refreshPermissionStatus() {
    if (!chrome.permissions) {
        return;
    }

    chrome.permissions.contains({ origins: ["http://*/*", "https://*/*"] }, function(granted) {
        if (granted) {
            setPermissionStatus("Website access enabled for public email discovery.");
        } else {
            setPermissionStatus("Enable website access to discover emails on public business websites.");
        }
    });
}

document.getElementById("addprofilebtn").addEventListener("click", openMapsSearch);
document.getElementById("profileid").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        openMapsSearch();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("accountinfo").innerHTML = "Powered by Xyber";

    const permissionButton = document.getElementById("enable-website-access");
    if (permissionButton) {
        permissionButton.addEventListener("click", requestWebsitePermission);
    }

    refreshPermissionStatus();
});
