# Smart Diagnosis API

Production-ready backend API using Node.js, Express, MongoDB (Mongoose), and Gemini.

## Features
- Clean architecture structure: `config/`, `models/`, `routes/`, `controllers/`, `services/`, `utils/`, `middleware/`
- `POST /diagnose` with **symptom normalization** + Gemini structured JSON output
- `GET /history` with pagination + optional search by symptoms
- Stores diagnosis history in MongoDB
- Rate limiting, logging (morgan), security headers (helmet), CORS
- Optional in-memory caching for repeated normalized symptom queries

## Setup

1) Install dependencies

```bash
npm install
```

2) Create `.env`

```bash
copy .env.example .env
```

3) Set values in `.env`
- `MONGODB_URI`
- `GEMINI_API_KEY`

4) Run

```bash
npm start
```

## API

### POST `/diagnose`
Body:
```json
{
  "symptoms": "fever, cough, chest pain"
}
```

### GET `/history`
Query params:
- `page` (default: 1)
- `limit` (default: 10, max: 100)
- `q` optional search string

Example:
`/history?page=1&limit=10&q=fever`

## Disclaimer
This API returns informational guidance only and is **not** a medical diagnosis.

