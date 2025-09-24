# Flatacuties

This mini web app practices array iteration, DOM manipulation, event handling, and communication with a local JSON server.

## Deliverables

As a user, you can:

1. See a list of all animal names from `GET /characters`.
2. Click an animal’s name to see its details (image and number of votes) via `GET /characters/:id`.
3. Add votes for the selected animal and display the updated number of votes. In this implementation, votes are persisted via `PATCH /characters/:id`.

## Features

- See a list of all animal names (GET /characters)
- Click an animal to view details (image and votes) (GET /characters/:id)
- Increment and reset votes with persistence (PATCH to server)
