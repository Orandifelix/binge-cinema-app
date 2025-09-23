# 🎬 BingeCinema App

BingeCinema is a modern movie discovery web app built with **React, Vite, TailwindCSS, and TypeScript**.  
It integrates with the **TMDB API** to fetch trending movies, genres, and trailers.  
Includes **unit testing with Vitest + React Testing Library** and automated pipelines via **GitHub Actions**.

---

## 🚀 Features

- 🔎 Search for movies and TV shows
- 🎭 Browse by genre & type
- 🎬 Watch trailers (YouTube embed)
- 📱 Responsive UI (desktop & mobile with hamburger menu)
- 🌙 Styled with **TailwindCSS** for modern design
- 🧪 Unit tests with **Vitest + RTL**
- ⚙️ GitHub Actions for CI/CD automation

---

## 🛠️ Tech Stack

- **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [TailwindCSS](https://tailwindcss.com/)
- **Routing:** [React Router](https://reactrouter.com/)
- **API:** [TMDB](https://www.themoviedb.org/)
- **Testing:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **CI/CD:** [GitHub Actions](https://docs.github.com/en/actions)

---

## ⚡ Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/Orandifelix/binge-cinema-app.git
cd binge-cinema-app

```

### 2. Install dependencies

```sh
  npm install

```

### 3. Setup environmental variables

Create .env files in the root project;

```sh
VITE_TMDB_API_KEY=your_tmdb_api_key_here


```

### 4. Get your API key from TMDB API

### 5. Run the development server

App runs on http://localhost:5173/

```sh
   npm run dev

```

🧪 Testing

We use Vitest and React Testing Library.

Run all tests

```sh
npm run test
```

Run tests on watch mode

```sh

npm run test:watch
```

⚙️ GitHub Actions (CI/CD)

This project uses GitHub Actions to automate:

✅ Install & cache dependencies

✅ Run linting & unit tests on every PR

✅ Build app for deployment

📦 Build for Production

```sh
npm run build

```

🛠️ Possible Improvements

🔐 User authentication (login, favorites, watchlist)

🌍 Multi-language support

🎨 Dark/Light mode toggle

⚡ Server-side rendering (SSR) with Next.js or Remix

🤝 Contributing

Fork the repo

Create a feature branch: git checkout -b feature/awesome-feature

Commit your changes: git commit -m "Add awesome feature"

Push branch: git push origin feature/awesome-feature

Open a Pull Request 🎉

📜 License

MIT © 2025 [Orandi Felix]
