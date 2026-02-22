// Collection Helpers - Manage user's saved book collection using localStorage
export const loadCollection = () => {
    try {
        // Get the JSON string from localStorage
        const jsonString = localStorage.getItem("collection");
        // Parse it back to an array (returns empty array if nothing saved yet)
        const bookTitlesArray = jsonString ? JSON.parse(jsonString) : [];
        // Convert array to Set (ensures uniqueness and fast lookups)
        return new Set(Array.isArray(bookTitlesArray) ? bookTitlesArray : []);
    }
    catch (error) {
        // If localStorage is blocked or JSON is corrupted, return empty Set
        console.warn("Could not load collection:", error);
        return new Set();
    }
};
export const saveCollection = (collectionSet) => {
    // Convert Set to Array (JSON.stringify doesn't work directly with Sets)
    // Spread operator [...set] creates array from Set
    const bookTitlesArray = [...collectionSet];
    // Save as JSON string
    localStorage.setItem("collection", JSON.stringify(bookTitlesArray));
};
export const toggleBookInCollection = (bookTitle) => {
    const collectionSet = loadCollection();
    // Check if book is already in collection
    if (collectionSet.has(bookTitle)) {
        // Remove it
        collectionSet.delete(bookTitle);
        saveCollection(collectionSet);
        return { inCollection: false, collectionSet };
    }
    // Add it
    collectionSet.add(bookTitle);
    saveCollection(collectionSet);
    return { inCollection: true, collectionSet };
};
// Load custom books from localStorage
export const loadCustomBooks = () => {
    try {
        const jsonString = localStorage.getItem("customBooks");
        const booksArray = jsonString ? JSON.parse(jsonString) : [];
        return Array.isArray(booksArray) ? booksArray : [];
    }
    catch (error) {
        console.warn("Could not load custom books:", error);
        return [];
    }
};
// Save custom books to localStorage
export const saveCustomBooks = (customBooks) => {
    localStorage.setItem("customBooks", JSON.stringify(customBooks));
};
