const description = `
# Welcome to CGPTDataRenderer
## About
In this application, we fetch data from a JSON file and render it in a list, a card, and a search component.

## Current Status of the Application:
- The initial version of the application includes:
    - On initial load:
        - We fetch:
            - A list of available file versions (id and name)
            - The id of the latest file version
        - Once the above data is fetched in step #1, we load the id and names of conversations for the latest file version.
        - Upon successfully fetching the data in step #2, we render the list of conversations in the list component for the selected file.
            - We then fetch the complete conversation data for the selected file and store it in the dashboard.
    - A card component displays all messages of a selected conversation from the selected file.
    - A search component allows users to search for text across all conversations and messages in the selected file.
    - A combo box enables users to switch to an older file version. The operations described above are re-executed for the selected file id.
    - LocalStorage has been implemented to highlight the user's selected conversation upon their next visit.
`;

export default description;