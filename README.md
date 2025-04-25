# Notes App

A modern, browser-based note-taking application built with HTML, CSS, and JavaScript. The Notes App allows users to create, edit, and organize notes with rich text formatting, color coding, categories, pinning, archiving, and drag-and-drop functionality. Notes are stored locally using localStorage, ensuring persistence across sessions without a backend.

![image](https://github.com/user-attachments/assets/ad3a9b1f-8755-4ee5-8a72-0655d0542d61)
*The Notes App interface showing note cards with pinning and archiving options.*

## Features

- **Rich Text Formatting**: Add bold, italic, bullet lists, and numbered lists to notes using a formatting toolbar
- **Color Coding**: Assign custom colors to notes for visual organization
- **Categories**: Organize notes into categories (General, Work, Personal, Ideas) with filtering options
- **Pinning and Archiving**: Pin important notes to the top or archive them for later reference
- **Search and Filter**: Quickly find notes by searching titles/content or filtering by category/archive status
- **Drag-and-Drop**: Reorder notes by dragging and dropping them within the grid
- **Export/Import**: Save notes as a JSON file and import them to restore or share
- **Theme Toggle**: Switch between light and dark themes for a comfortable viewing experience
- **Keyboard Shortcuts**: Use Ctrl+N to open the note creation popup and Esc to close it
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Live Preview**: See a real-time preview of formatted note content while editing

## Demo

[Live Demo](https://your-username.github.io/notes-app) (if hosted on GitHub Pages)

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/notes-app.git
   cd notes-app
   ```

2. **Open the App**:
   - Open `index.html` in a web browser (e.g., Chrome, Firefox)
   - No server is required, as the app runs entirely client-side

3. **Dependencies**:
   - The app uses external CDNs for:
     - Iconscout Unicons for icons
     - Google Fonts (Inter) for typography
   - Ensure an internet connection for initial loading, or host these resources locally

## Usage

### Create a Note
1. Click the "Add new note" card or press `Ctrl+N`
2. Enter a title, content, and select a category
3. Choose a color from the color picker
4. Use the formatting toolbar for bold, italic, or lists
5. Click "Save Note" to add it to the grid

### Edit a Note
1. Click a note card to open the edit popup with pre-filled details
2. Update the content and save

### Organize Notes
- **Pin**: Click the pin icon to prioritize a note (gold border and top placement)
- **Archive**: Click the archive icon to move a note to the archive
- **Drag-and-Drop**: Drag notes to reorder them
- **Filter**: Use the category dropdown to view specific categories or archived notes
- **Search**: Type in the search bar to filter notes by title or content

### Manage Notes
- **Export**: Click "Export Notes" to download a JSON file
- **Import**: Click "Import Notes" and select a JSON file to replace existing notes
- **Theme**: Toggle between light and dark modes using the theme button

## Project Structure

```
notes-app/
├── index.html      # Main HTML file with the app structure
├── script.js       # JavaScript for functionality (note management, events, etc.)
├── style.css       # CSS for styling and responsive design
└── README.md       # Project documentation
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request with a clear description of your changes

Please ensure your code follows the existing style (e.g., use Inter font, Iconscout icons) and includes tests if applicable.

## Issues

If you encounter bugs or have feature requests, please open an issue on GitHub. Include details like:
- Steps to reproduce the issue
- Browser and version
- Screenshots, if applicable

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgments

- [Iconscout Unicons](https://iconscout.com/unicons) for the icon set
- [Google Fonts](https://fonts.google.com) for the Inter font
- Inspired by modern note-taking apps like Notion and Google Keep

## Contact

For questions or feedback, reach out via [GitHub Issues](https://github.com/your-username/notes-app/issues) or [ghza3006@gmail.com](mailto:ghza3006@gmail.com).

---

Last updated: April 26, 2025
