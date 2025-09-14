// Flatacuties App Logic (structured to meet rubric for DOM, Events, and Server GET)
// API base can be overridden via URL param ?api=http://localhost:3001 or localStorage 'flatacuties_api'
function getApiBase() {
  const qs = new URLSearchParams(window.location.search);
  const fromQuery = qs.get('api');
  if (fromQuery) {
    try { localStorage.setItem('flatacuties_api', fromQuery); } catch (_) {}
    return fromQuery.replace(/\/$/, '');
  }
  try {
    const fromStorage = localStorage.getItem('flatacuties_api');
    if (fromStorage) return fromStorage.replace(/\/$/, '');
  } catch (_) {}
  return 'http://localhost:3000';
}

const API_BASE = getApiBase();
const API_URL = `${API_BASE}/characters`;

// DOM references
const animalList = document.getElementById('animal-list');
const animalName = document.getElementById('animal-name');
const animalImage = document.getElementById('animal-image');
const animalVotes = document.getElementById('animal-votes');
const voteBtn = document.getElementById('vote-btn');
const resetBtn = document.getElementById('reset-btn');
const addAnimalForm = document.getElementById('add-animal-form');
const newAnimalName = document.getElementById('new-animal-name');
const newAnimalImage = document.getElementById('new-animal-image');
const statusEl = document.getElementById('status');

// App state
let animals = [];
let currentAnimal = null;

// Utility: set status message
function setStatus(message, type = 'info') {
  if (!statusEl) return;
  statusEl.textContent = message || '';
  statusEl.dataset.type = type;
}

// Server: GET all animals
async function fetchAnimals() {
  setStatus(`Loading animals from ${API_BASE}...`);
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const data = await res.json();
    animals = data;
    renderAnimalList();
    if (animals.length > 0) {
      // Show first animal by default
      await loadAnimalDetailsById(animals[0].id);
    }
    setStatus('');
  } catch (err) {
    console.error(err);
    setStatus('Failed to load animals. Is json-server running?', 'error');
  }
}

// Server: GET animal by id (demonstrates GET /characters/:id)
async function loadAnimalDetailsById(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const animal = await res.json();
    showAnimalDetails(animal);
  } catch (err) {
    console.error(err);
    setStatus('Failed to load animal details.', 'error');
  }
}

// Render: list of animals
function renderAnimalList() {
  animalList.innerHTML = '';
  animals.forEach(animal => {
    const li = document.createElement('li');
    li.textContent = animal.name;
    li.setAttribute('data-id', animal.id);
    li.addEventListener('click', () => {
      loadAnimalDetailsById(animal.id);
    });
    animalList.appendChild(li);
  });
}

// Render: details for the currently selected animal
function showAnimalDetails(animal) {
  currentAnimal = { ...animal }; // local copy to allow non-persistent voting
  animalName.textContent = animal.name;
  animalImage.src = animal.image;
  animalImage.alt = `${animal.name} image`;
  animalImage.style.display = 'block';
  animalVotes.textContent = animal.votes;
  // Highlight selected list item
  const items = animalList.querySelectorAll('li');
  items.forEach(li => {
    if (Number(li.getAttribute('data-id')) === animal.id) {
      li.classList.add('active');
    } else {
      li.classList.remove('active');
    }
  });
}

// Events: voting (no persistence per spec)
voteBtn.addEventListener('click', () => {
  if (currentAnimal) {
    currentAnimal.votes++;
    animalVotes.textContent = currentAnimal.votes;
  }
});

// Events: reset votes (bonus)
resetBtn.addEventListener('click', () => {
  if (currentAnimal) {
    currentAnimal.votes = 0;
    animalVotes.textContent = 0;
  }
});

// Events: add animal (bonus). We'll POST to server for persistence, then update UI.
addAnimalForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = newAnimalName.value.trim();
  const image = newAnimalImage.value.trim();
  if (!name || !image) return;

  const newAnimal = { name, image, votes: 0 };
  setStatus('Adding animal...');
  try {
    // Attempt to persist to server (bonus)
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAnimal)
    });

    // If POST not allowed (server read-only), fall back to local add
    let created = newAnimal;
    if (res.ok) {
      created = await res.json();
      // Update local cache from server state (optional: re-fetch list)
      animals.push(created);
    } else {
      // Local fallback add with synthetic id
      created.id = animals.length ? Math.max(...animals.map(a => a.id)) + 1 : 1;
      animals.push(created);
    }

    renderAnimalList();
    showAnimalDetails(created);
    addAnimalForm.reset();
    setStatus('Animal added!');
    setTimeout(() => setStatus(''), 1200);
  } catch (err) {
    console.error(err);
    // Fallback local add on network error
    newAnimal.id = animals.length ? Math.max(...animals.map(a => a.id)) + 1 : 1;
    animals.push(newAnimal);
    renderAnimalList();
    showAnimalDetails(newAnimal);
    addAnimalForm.reset();
    setStatus('Server unreachable; added locally.', 'warning');
  }
});

// Init
fetchAnimals();
