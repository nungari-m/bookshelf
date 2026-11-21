# Bookshelf

Search books with the Open Library API, save them to a private reading list, set a status (Want to Read, Reading, Finished) and add notes.

**Live site:** https://bookshelf-eta-mauve.vercel.app/

## Features
- Register, login and logout with email/password, plus Google sign-in
- Protected routes (Search and My Books need login)
- Search books by title or author
- Save, update status, add notes and delete books (Firebase Firestore)
- Loading, error and empty states

## Tech stack
React(vite), React Router, Context API, Tailwind CSS, Firebase Auth + Firestore, Open Library API, Vitest + React Testing Library, GitHub Actions, Vercel

## Run locally
1. `git clone https://github.com/nungari-m/bookshelf.git`
2. `npm install`
3. Copy `.env.example` to `.env` and add your Firebase values
4. `npm run dev`


## Tests
`npm run coverage`