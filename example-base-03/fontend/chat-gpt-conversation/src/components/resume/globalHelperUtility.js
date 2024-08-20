const globalHelperUtility = (() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const generateRandomString = (
        { length, prefix } = { length: 10, prefix: "" }
    ) => {
        let result = prefix ? `${prefix.toUpperCase()}_` : "";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    const converHtmlElementToJson = (element) => {
        const json = {
            tagName: element?.tagName || "",
            attributes: {},
            innerText: element?.innerText || "",
            styles: {},
        };
        if (!element) {
            return json;
        }

        for (let attr of element.attributes) {
            json.attributes[attr.name] = attr.value;
        }

        for (let style of element.style) {
            json.styles[style] = element.style[style];
        }

        return json;
    };

    return {
        generateRandomString,
        converHtmlElementToJson,
    };
})();

export default globalHelperUtility;

/**
 * Utility for generating IDs.
 * @module idUtility
 */
export const idUtility = (() => {
    const { generateRandomString: generateString } = globalHelperUtility;

    /**
     * Generates a random ID string with a specified length and prefix.
     * @param {Object} options - Options for generating the string.
     * @param {number} options.length - Length of the random string.
     * @param {string} options.prefix - Prefix for the random string.
     * @returns {string} The generated random string.
     */
    const generateId = (options) => generateString(options);

    return {
        generateId
    };
})();

/**
 * Utility for applying styles to elements.
 * @module styleUtility
 */
export const styleUtility = (() => {
    /**
     * Applies styles to a given element.
     * @param {HTMLElement} element - The element to style.
     * @param {Object} styles - An object containing the styles to apply.
     */
    const applyStyles = (element, styles) => {
        if (!element || !styles) {
            return;
        }
        for (const property in styles) {
            if (styles.hasOwnProperty(property)) {
                element.style[property] = styles[property];
            }
        }
    };

    /**
     * Returns default styles for a given element type.
     * @param {string} elementType - The type of the element.
     * @returns {Object} The default styles for the element type.
     */
    const getDefaultStyle = (elementType) => {
        const defaultStyles = {
            div: {
                border: '1px solid #000',
                padding: '10px',
                margin: '5px'
            },
            input: {
                padding: '5px',
                margin: '5px'
            },
            button: {
                padding: '10px 20px',
                margin: '5px',
                cursor: 'pointer'
            },
            span: {
                margin: '5px'
            },
            select: {
                padding: '5px',
                margin: '5px'
            },
            h1: {
                fontSize: '24px',
                margin: '10px 0'
            },
            h2: {
                fontSize: '20px',
                margin: '10px 0'
            },
            h3: {
                fontSize: '16px',
                margin: '10px 0'
            },
            p: {
                margin: '10px 0'
            },
            ul: {
                margin: '10px 0',
                padding: '0',
                listStyleType: 'none'
            },
            li: {
                margin: '5px 0'
            },
            img: {
                maxWidth: '100%',
                height: 'auto'
            },
            a: {
                color: '#007BFF',
                textDecoration: 'none',
                cursor: 'pointer'
            },
            header: {
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e5e5e5'
            },
            footer: {
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid #e5e5e5'
            },
            section: {
                padding: '10px',
                margin: '10px 0'
            },
            article: {
                padding: '10px',
                margin: '10px 0'
            }
        };
        return defaultStyles[elementType.toLowerCase()] || {};
    };

    return {
        applyStyles,
        getDefaultStyle
    };
})();
