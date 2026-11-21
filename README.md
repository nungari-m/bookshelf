# Bookshelf

Search books with the Open Library API, save them to a private reading list, set a status (Want to Read, Reading, Finished) and add notes.

**Live site:** https://bookshelf-eta-mauve.vercel.app/
**Figma wireframes:**https://www.figma.com/design/Xm6yWDjiaHHa3TQ1SpqUiw/Bookshelf-Wireframes?node-id=9-14&t=Ymq50VzCLIU4Or7F-0
**Clickable prototype:**https://www.figma.com/proto/Xm6yWDjiaHHa3TQ1SpqUiw/Bookshelf-Wireframes?node-id=17-177&t=uxbhSdPeZuTEKSNn-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=22%3A55&show-proto-sidebar=1

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