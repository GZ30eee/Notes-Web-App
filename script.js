// DOM Elements
const addNoteBtn = document.getElementById('add-note-btn');
const popupBox = document.querySelector('.popup-box');
const popupTitle = popupBox.querySelector('header p');
const closeIcon = popupBox.querySelector('header i');
const titleInput = document.getElementById('note-title');
const contentInput = document.getElementById('note-content');
const categorySelect = document.getElementById('category');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const themeToggle = document.getElementById('theme-toggle');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importFile = document.getElementById('import-file');
const archiveViewBtn = document.getElementById('archive-view-btn');
const previewContent = document.getElementById('preview-content');
const colorOptions = document.querySelectorAll('.color-option');
const formattingButtons = document.querySelectorAll('.formatting-toolbar button');

// App State
const months = ["January", "February", "March", "April", "May", "June", "July", 
              "August", "September", "October", "November", "December"];
let notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false;
let updateId;
let currentFilter = "All";
let currentColor = "#6A93F8";
let dragSrcElement = null;

// Initialize the app
function init() {
  // Set theme from localStorage or default to light
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.className = savedTheme;
  themeToggle.innerHTML = savedTheme === "dark" ? '<i class="uil uil-sun"></i>' : '<i class="uil uil-moon"></i>';
  
  // Initialize notes with default properties if they don't exist
  notes = notes.map(note => ({
    ...note,
    pinned: note.pinned || false,
    archived: note.archived || false,
    color: note.color || "#6A93F8"
  }));
  
  saveNotes();
  showNotes();
  
  // Set up event listeners
  setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
  addNoteBtn.addEventListener('click', openAddNotePopup);
  closeIcon.addEventListener('click', closePopup);
  cancelBtn.addEventListener('click', closePopup);
  saveBtn.addEventListener('click', saveNote);
  searchInput.addEventListener('input', () => searchNotes(searchInput.value));
  filterSelect.addEventListener('change', () => {
    currentFilter = filterSelect.value;
    showNotes();
  });
  themeToggle.addEventListener('click', toggleTheme);
  exportBtn.addEventListener('click', exportNotes);
  importBtn.addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', (e) => importNotes(e.target.files[0]));
  archiveViewBtn.addEventListener('click', toggleArchiveView);
  
  // Rich text formatting
  formattingButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      document.execCommand(e.target.closest('button').dataset.command, false, null);
      contentInput.focus();
    });
  });
  
  // Color selection
  colorOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      colorOptions.forEach(opt => opt.classList.remove('selected'));
      e.target.classList.add('selected');
      currentColor = e.target.dataset.color;
    });
  });
  
  // Preview content as you type
  contentInput.addEventListener('input', updatePreview);
  titleInput.addEventListener('input', updatePreview);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      openAddNotePopup();
    }
    if (e.key === 'Escape' && popupBox.classList.contains('show')) {
      closePopup();
    }
  });
  
  // Initialize color options
  colorOptions[0].classList.add('selected');
}

// Open the add/edit note popup
function openAddNotePopup() {
  popupBox.classList.add('show');
  titleInput.focus();
  document.body.style.overflow = 'hidden';
}

// Close the popup and reset form
function closePopup() {
  popupBox.classList.remove('show');
  document.body.style.overflow = 'auto';
  resetForm();
}

// Reset the note form
function resetForm() {
  titleInput.value = '';
  contentInput.value = '';
  categorySelect.value = 'General';
  isUpdate = false;
  updateId = null;
  colorOptions[0].click();
  previewContent.innerHTML = '';
}

// Save or update a note
function saveNote(e) {
  e.preventDefault();
  
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const category = categorySelect.value;
  
  if (!title && !content) {
    alert('Please enter a title or content for your note');
    return;
  }
  
  const currentDate = new Date();
  const date = `${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
  
  const noteInfo = {
    title,
    content,
    category,
    date,
    color: currentColor,
    pinned: false,
    archived: false
  };
  
  if (!isUpdate) {
    notes.push(noteInfo);
  } else {
    noteInfo.pinned = notes[updateId].pinned;
    noteInfo.archived = notes[updateId].archived;
    notes[updateId] = noteInfo;
    isUpdate = false;
  }
  
  saveNotes();
  showNotes();
  closePopup();
}

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Display notes in the UI
function showNotes() {
  const notesContainer = document.querySelector('.notes-container');
  
  // Clear existing notes except the add note card
  const existingNotes = notesContainer.querySelectorAll('.note-card');
  existingNotes.forEach(note => note.remove());
  
  // Filter notes based on current filter
  let filteredNotes = notes.filter(note => {
    if (currentFilter === "All") return !note.archived;
    if (currentFilter === "Archived") return note.archived;
    return note.category === currentFilter && !note.archived;
  });
  
  // Sort notes (pinned first, then by date)
  filteredNotes.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });
  
  // Create note cards
  filteredNotes.forEach((note, id) => {
    const noteCard = document.createElement('div');
    noteCard.className = `note-card ${note.pinned ? 'pinned' : ''} ${note.archived ? 'archived' : ''}`;
    noteCard.style.borderLeftColor = note.color;
    noteCard.setAttribute('draggable', 'true');
    noteCard.dataset.id = id;
    
    noteCard.innerHTML = `
    <div class="note-actions">
        <button class="note-action-btn" onclick="togglePinNote(${id})" title="${note.pinned ? 'Unpin' : 'Pin'}">
            <i class="uil ${note.pinned ? 'uil-thumbtack' : 'uil-pushpin'}"></i>
        </button>
        <button class="note-action-btn" onclick="archiveNote(${id})" title="${note.archived ? 'Unarchive' : 'Archive'}">
            <i class="uil ${note.archived ? 'uil-upload' : 'uil-archive'}"></i>
        </button>
    </div>
    <h3 class="note-title">${note.title || 'Untitled Note'}</h3>
    <div class="note-content">${formatNoteContent(note.content)}</div>
    <div class="note-footer">
        <span class="note-category">${note.category}</span>
        <span class="note-date">${note.date}</span>
    </div>
    `;
    
    // Add click event to edit note
    noteCard.addEventListener('click', (e) => {
      // Don't open edit if clicking on action buttons
      if (e.target.closest('.note-actions')) return;
      updateNote(id);
    });
    
    // Drag and drop events
    noteCard.addEventListener('dragstart', handleDragStart);
    noteCard.addEventListener('dragover', handleDragOver);
    noteCard.addEventListener('dragleave', handleDragLeave);
    noteCard.addEventListener('drop', handleDrop);
    noteCard.addEventListener('dragend', handleDragEnd);
    
    notesContainer.appendChild(noteCard);
  });
}

// Format note content for display
function formatNoteContent(content) {
  if (!content) return '';
  
  // Convert line breaks to <br>
  let formatted = content.replace(/\n/g, '<br>');
  
  // Convert URLs to links
  formatted = formatted.replace(
    /(https?:\/\/[^\s]+)/g, 
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  
  return formatted;
}

// Search notes
function searchNotes(query) {
  query = query.toLowerCase();
  const noteCards = document.querySelectorAll('.note-card');
  
  noteCards.forEach(card => {
    const title = card.querySelector('.note-title').textContent.toLowerCase();
    const content = card.querySelector('.note-content').textContent.toLowerCase();
    const matches = title.includes(query) || content.includes(query);
    card.style.display = matches ? 'flex' : 'none';
  });
}

// Update a note
function updateNote(id) {
  const note = notes[id];
  isUpdate = true;
  updateId = id;
  
  titleInput.value = note.title || '';
  contentInput.value = note.content || '';
  categorySelect.value = note.category || 'General';
  
  // Set the color
  colorOptions.forEach(option => {
    option.classList.remove('selected');
    if (option.dataset.color === note.color) {
      option.classList.add('selected');
      currentColor = note.color;
    }
  });
  
  popupTitle.textContent = 'Update Note';
  saveBtn.textContent = 'Update Note';
  openAddNotePopup();
  updatePreview();
}

// Toggle pin status of a note
function togglePinNote(id) {
  notes[id].pinned = !notes[id].pinned;
  saveNotes();
  showNotes();
}

// Archive or unarchive a note
function archiveNote(id) {
  notes[id].archived = !notes[id].archived;
  saveNotes();
  showNotes();
}

// Toggle between archive and normal view
function toggleArchiveView() {
  if (currentFilter === "Archived") {
    currentFilter = "All";
    filterSelect.value = "All";
    archiveViewBtn.innerHTML = '<i class="uil uil-archive"></i> View Archive';
  } else {
    currentFilter = "Archived";
    filterSelect.value = "Archived";
    archiveViewBtn.innerHTML = '<i class="uil uil-notes"></i> View Notes';
  }
  showNotes();
}

// Toggle between light and dark theme
function toggleTheme() {
  const currentTheme = document.body.className || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.body.className = newTheme;
  themeToggle.innerHTML = newTheme === 'dark' ? '<i class="uil uil-sun"></i>' : '<i class="uil uil-moon"></i>';
  localStorage.setItem("theme", newTheme);
}

// Export notes to JSON file
function exportNotes() {
  if (notes.length === 0) {
    alert('No notes to export');
    return;
  }
  
  const dataStr = JSON.stringify(notes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `notes-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import notes from JSON file
function importNotes(file) {
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedNotes = JSON.parse(e.target.result);
      
      if (!Array.isArray(importedNotes)) {
        throw new Error('Invalid file format');
      }
      
      if (confirm(`Import ${importedNotes.length} notes? This will replace your current notes.`)) {
        notes = importedNotes.map(note => ({
          ...note,
          pinned: note.pinned || false,
          archived: note.archived || false,
          color: note.color || "#6A93F8"
        }));
        
        saveNotes();
        showNotes();
        alert('Notes imported successfully');
      }
    } catch (err) {
      alert('Error importing notes: ' + err.message);
    }
  };
  reader.readAsText(file);
  importFile.value = ''; // Reset file input
}

// Update the preview pane
function updatePreview() {
  const title = titleInput.value.trim() || 'Untitled Note';
  const content = formatNoteContent(contentInput.value);
  
  previewContent.innerHTML = `
    <h4>${title}</h4>
    <div>${content || '<em>No content</em>'}</div>
  `;
}

// Drag and drop functions
function handleDragStart(e) {
  dragSrcElement = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
  this.classList.add('dragging');
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragLeave() {
  this.classList.remove('over');
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  
  if (dragSrcElement !== this) {
    // Get the IDs of the dragged and dropped notes
    const fromId = parseInt(dragSrcElement.dataset.id);
    const toId = parseInt(this.dataset.id);
    
    // Swap the notes in the array
    [notes[fromId], notes[toId]] = [notes[toId], notes[fromId]];
    
    // Save and refresh
    saveNotes();
    showNotes();
  }
  
  return false;
}

function handleDragEnd() {
  this.classList.remove('dragging');
  document.querySelectorAll('.note-card').forEach(card => {
    card.classList.remove('over');
  });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
