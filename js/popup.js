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

document.getElementById("addprofilebtn").addEventListener("click", openMapsSearch);
document.getElementById("profileid").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        openMapsSearch();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("accountinfo").innerHTML = "Free Forever";
});
