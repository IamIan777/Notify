let nTitle;
let nText;
let nList;
let saveNoteBtn;
let newNoteBtn;
if (window.location.pathname === '/notes') {
    let nTitle; document.querySelector('.note-title');
    let nText; document.querySelector('.note-textarea');
    let nList; document.querySelectorAll('.list-container .list-group');
    let saveNoteBtn; document.querySelector('.save-note');
    let newNoteBtn; document.querySelector('.new-note');
}

    const show = (elem) => {
        elem.style.display = 'inline';
      };
      
      const hide = (elem) => {
        elem.style.display = 'none';
      };
      
      let aNote = {};
      
      const getNotes = () =>
        fetch('/api/notes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      
      const saveNote = (note) =>
        fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(note),
        });
      
      const deleteNote = (id) =>
        fetch(`/api/notes/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      
      const renderANote = () => {
        hide(saveNoteBtn);
      
        if (aNote.id) {
          nTitle.setAttribute('readonly', true);
          nText.setAttribute('readonly', true);
          nTitle.value = aNote.title;
          nText.value = aNote.text;
        } else {
          nTitle.removeAttribute('readonly');
          nText.removeAttribute('readonly');
          nTitle.value = '';
          nText.value = '';
        }
      };
      
      const handleNoteSave = () => {
        const newNote = {
          title: nTitle.value,
          text: nText.value,
        };
        saveNote(newNote).then(() => {
          getAndRenderNotes();
          renderANote();
        });
      };
      
      const handleNoteDelete = (e) => {
        e.stopPropagation();
      
        const note = e.target;
        const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;
      
        if (aNote.id === noteId) {
          aNote = {};
        }
      
        deleteNote(noteId).then(() => {
          getAndRenderNotes();
          renderANote();
        });
      };
      
      const handleNoteView = (e) => {
        e.preventDefault();
        aNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
        renderANote();
      };
      
      const handleNewNoteView = (e) => {
        aNote = {};
        renderANote();
      };
      
      const handleRenderSaveBtn = () => {
        if (!nTitle.value.trim() || !nText.value.trim()) {
          hide(saveNoteBtn);
        } else {
          show(saveNoteBtn);
        }
      };
      
      const renderNoteList = async (notes) => {
        let jsonNotes = await notes.json();
        if (window.location.pathname === '/notes') {
          nList.forEach((el) => (el.innerHTML = ''));
        }
      
        let nListItems = [];
      
        const createLi = (text, delBtn = true) => {
          const liEl = document.createElement('li');
          liEl.classList.add('list-group-item');
      
          const spanEl = document.createElement('span');
          spanEl.classList.add('list-item-title');
          spanEl.innerText = text;
          spanEl.addEventListener('click', handleNoteView);
      
          liEl.append(spanEl);
      
          if (delBtn) {
            const delBtnEl = document.createElement('i');
            delBtnEl.classList.add(
              'fas',
              'fa-trash-alt',
              'float-right',
              'text-danger',
              'delete-note'
            );
            delBtnEl.addEventListener('click', handleNoteDelete);
      
            liEl.append(delBtnEl);
          }
      
          return liEl;
        };
      
        if (jsonNotes.length === 0) {
          nListItems.push(createLi('No saved Notes', false));
        }
      
        jsonNotes.forEach((note) => {
          const li = createLi(note.title);
          li.dataset.note = JSON.stringify(note);
      
          nListItems.push(li);
        });
      
        if (window.location.pathname === '/notes') {
          nListItems.forEach((note) => nList[0].append(note));
        }
      };
      
      const getAndRenderNotes = () => getNotes().then(renderNoteList);
      
      if (window.location.pathname === '/notes') {
        saveNoteBtn.addEventListener('click', handleNoteSave);
        newNoteBtn.addEventListener('click', handleNewNoteView);
        nTitle.addEventListener('keyup', handleRenderSaveBtn);
        nText.addEventListener('keyup', handleRenderSaveBtn);
      }
      
      getAndRenderNotes();