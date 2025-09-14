# Flatacuties

Vote for the cutest animal! This mini web app practices array iteration, DOM manipulation, event handling, and communication with a local JSON server.

## Features

- See a list of all animal names (GET /characters)
- Click an animal to view details (image and votes) (GET /characters/:id)
- Increment and reset votes with persistence (PATCH to server)
- Bonus: add a new animal via form (POST to server when available; gracefully falls back to local add)

### Accessibility

- Keyboard navigation for the animal list (Enter/Space activate selected animal)
- `aria-selected` on active list item and clear status messages for screen readers

## Tech Stack

- HTML, CSS, JavaScript (vanilla)
- json-server (for a local REST API)

## Getting Started

1. Install json-server globally (if not already):
   ```bash
   npm install -g json-server
   ```

2. Start the backend:
   ```bash
   json-server --watch db.json --port 3000
   ```
   - Verify at: http://localhost:3000/characters

3. Open the frontend:
   - Simply open `index.html` in your browser, or use a lightweight static server:
     ```bash
     # Option A: VS Code Live Server extension (default port is 5500)
     # If your Live Server runs on 5500, open:
     #   http://127.0.0.1:5500/index.html
     # If your Live Server runs on 5501, open and pass the API base via query param:
     #   http://127.0.0.1:5501/index.html?api=http://localhost:3000

     # Option B: Python http.server
     python3 -m http.server 8080
    # then open http://localhost:8080/index.html
    ```

If your frontend and backend run on different ports, you can point the app to your API using a query parameter:

```
http://127.0.0.1:8080/index.html?api=http://localhost:3000
```

## Project Structure

```
.
├── index.html      # UI layout and containers
├── style.css       # Styles, including status and active list highlighting
├── app.js          # App logic: fetch, render, events
└── db.json         # json-server data
```

## How It Works

- `app.js`
  - Fetches all characters from `GET http://localhost:3000/characters` and renders the list
  - On list item click, fetches details from `GET /characters/:id` and renders a single detail panel
  - Vote button increments the on-screen votes for the current animal and persists via `PATCH /characters/:id`
  - Reset button sets the on-screen votes back to 0 and persists via `PATCH /characters/:id`
  - Add-animal form attempts `POST /characters` to persist; if the server rejects or is offline, it falls back to a local-only add with a synthetic id
  - A status bar communicates loading/errors for a better UX

### Notes on Data Types

- Votes are always coerced to numbers in the UI to avoid string concatenation issues.

## API

- GET /characters
- GET /characters/:id
- POST /characters (used for bonus; app handles server errors gracefully)
- PATCH /characters/:id (persist votes)

### Configure the API Base

The app supports configuring the API base URL via a query string parameter or localStorage:

- Query string override (persisted to localStorage):
  - Example when Live Server is on 5501 and json-server on 3000:
    - http://127.0.0.1:5501/index.html?api=http://localhost:3000
  - Example when json-server also runs on 5501:
    - http://127.0.0.1:5501/index.html?api=http://localhost:5501
- LocalStorage key: `flatacuties_api` (set automatically when you use the `?api=` param)

To run json-server on 5501 instead of 3000:

```bash
json-server --watch db.json --port 5501
```

## Assets (FOSS Images)

We verified a set of freely licensed animal images from Wikimedia Commons. You can hotlink the direct URLs below or download them locally into `assets/` using the provided commands.

Direct image URLs (upload.wikimedia.org):

- Lion: https://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg
- Panda: https://upload.wikimedia.org/wikipedia/commons/b/b0/Panda.jpg
- Zebra: https://upload.wikimedia.org/wikipedia/commons/f/fa/Chapman-zebra.jpeg
- Cat: https://upload.wikimedia.org/wikipedia/commons/1/15/Cat_August_2010-4.jpg
- Monkey: https://upload.wikimedia.org/wikipedia/commons/2/2e/Standing_capuchin_monkey.jpg

Download locally with wget:

```bash
mkdir -p assets && \
wget -O assets/lion.jpg https://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg && \
wget -O assets/panda.jpg https://upload.wikimedia.org/wikipedia/commons/b/b0/Panda.jpg && \
wget -O assets/zebra.jpg https://upload.wikimedia.org/wikipedia/commons/f/fa/Chapman-zebra.jpeg && \
wget -O assets/cat.jpg https://upload.wikimedia.org/wikipedia/commons/1/15/Cat_August_2010-4.jpg && \
wget -O assets/monkey.jpg https://upload.wikimedia.org/wikipedia/commons/2/2e/Standing_capuchin_monkey.jpg
```

Or with curl:

```bash
mkdir -p assets && \
curl -L https://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg -o assets/lion.jpg && \
curl -L https://upload.wikimedia.org/wikipedia/commons/b/b0/Panda.jpg -o assets/panda.jpg && \
curl -L https://upload.wikimedia.org/wikipedia/commons/f/fa/Chapman-zebra.jpeg -o assets/zebra.jpg && \
curl -L https://upload.wikimedia.org/wikipedia/commons/1/15/Cat_August_2010-4.jpg -o assets/cat.jpg && \
curl -L https://upload.wikimedia.org/wikipedia/commons/2/2e/Standing_capuchin_monkey.jpg -o assets/monkey.jpg
```

After downloading, you can optionally update `db.json` image fields to use local paths like `"image": "assets/lion.jpg"`.

Licensing: These are Creative Commons-licensed or public domain images from Wikimedia Commons. When using CC BY/CC BY-SA images, include attribution with author and license in your project documentation as appropriate.

## Rubric Mapping

- DOM Manipulation
  - Dynamically renders the list and the detail view using clean, reusable functions (`renderAnimalList`, `showAnimalDetails`)
  - Highlights the selected list item and updates the status bar for UX clarity
- Event Handling
  - Click on list items loads details
  - Vote and Reset buttons update the displayed vote count
  - Submit event on the Add Animal form creates a new animal (server or local fallback)
- Communication with the Server
  - Uses `fetch` to GET all characters and to GET details by id
  - Bonus: attempts to POST new animals and handles non-OK responses and network errors robustly

## Troubleshooting

- If you see "Failed to load animals. Is json-server running?", ensure you started json-server on port 3000.
- Some corporate networks block `gfycat.com` images. If images fail to load, try different image URLs when adding animals.

## GitHub and Deployment

1. Initialize git, commit, and push:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Flatacuties with GET list, detail view, local votes, reset + add form"
   git branch -M main
   git remote add origin <your-private-github-repo-url>
   git push -u origin main
   ```

2. Ensure your repository is private and add your TM as a collaborator for grading.

3. Optionally deploy the static frontend (e.g., GitHub Pages or Netlify). Note that the backend is json-server and should be run locally for grading.

## Notes

- Votes are now persisted to the server. You can extend this project further by deleting animals, or adding search/filtering.
