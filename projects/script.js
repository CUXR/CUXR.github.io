/**
 * Selection Anim — replicates the Figma component interaction:
 *
 *   Default     → all 7 thumbnails in 2 rows (4 top, 3 bottom)
 *   Variant 2–5 → top-row item expanded in-place, others stay as thumbs
 *   Variant 6–8 → bottom-row item expanded in-place (gap → 32px)
 *
 * Click a thumbnail  → expands that item in-place within its row
 * Click again         → collapses back to thumbnail
 * Click another item  → collapses current, expands new one
 */

const items = document.querySelectorAll(".proj-item");
let currentSelected = null;

items.forEach((item) => {
    item.addEventListener("click", () => {
        const row = item.closest(".proj-gallery-row");

        // If clicking the already-selected item, deselect it
        if (item === currentSelected) {
            item.classList.remove("proj-selected");
            row.classList.remove("proj-has-selection");
            currentSelected = null;
            return;
        }

        // Deselect previous item (if any)
        if (currentSelected) {
            currentSelected.classList.remove("proj-selected");
            currentSelected.closest(".proj-gallery-row").classList.remove("proj-has-selection");
        }

        // Select the clicked item
        item.classList.add("proj-selected");
        row.classList.add("proj-has-selection");
        currentSelected = item;
    });
});

// Escape key → deselect
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && currentSelected) {
        currentSelected.classList.remove("proj-selected");
        currentSelected.closest(".proj-gallery-row").classList.remove("proj-has-selection");
        currentSelected = null;
    }
});
