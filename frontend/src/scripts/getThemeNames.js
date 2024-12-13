function getThemeNames() {
    return fetch('/themes.css')
        .then(response => response.text()) 
        .then(cssText => {
            const themeRegex = /\[data-theme="([^"]+?)"]/g;
            let matches;
            const themeNames = [];

            while ((matches = themeRegex.exec(cssText)) !== null) {
                themeNames.push(matches[1]); 
            }

            return themeNames;
        })
        .catch(error => {
            console.error("Error reading themes:", error);
            return [];
        });
};

export default getThemeNames;


