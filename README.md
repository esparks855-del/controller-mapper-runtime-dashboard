# Controller Mapper Runtime Dashboard

A visually stunning, high-performance web dashboard designed to manage, validate, and visualize controller mapping configurations for the Windows desktop runtime engine.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/esparks855-del/controller-mapper-runtime-dashboard)

## 🚀 Overview

The **Controller Mapper Runtime Dashboard** serves as the cloud-based control center for the local C# controller mapping runtime. It bridges the gap between raw JSON configuration files and the user, providing a sleek, "Dark Gaming" aesthetic interface where users can:

1.  **Visualize** their controller mappings on an interactive model.
2.  **Validate** configuration files against strict schemas to prevent runtime errors.
3.  **Manage** profiles and download the necessary runtime executables.

Built with performance and visual excellence in mind, this application leverages the power of React, Tailwind CSS, and Cloudflare Workers to deliver a seamless experience.

## ✨ Key Features

*   **Profile Management:** Upload, store, and organize multiple JSON configuration files for different games or playstyles.
*   **Interactive Visualizer:** A dynamic UI that renders controller inputs visually, allowing users to verify mappings (Tap, Hold, Double-Tap) before deployment.
*   **Schema Validation:** Integrated Zod-based validation ensures that all exported JSON files meet the strict requirements of the C# runtime engine.
*   **Documentation Hub:** Comprehensive guides and schema references for the runtime engine.
*   **Cyberpunk Aesthetic:** A modern, dark-mode-first UI with neon accents, glassmorphism effects, and smooth Framer Motion animations.
*   **Responsive Design:** Fully responsive layout ensuring accessibility across desktop and mobile devices.

## 🛠️ Technology Stack

This project is built using a modern, type-safe stack optimized for speed and maintainability:

*   **Core:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
*   **Animation:** [Framer Motion](https://www.framer.com/motion/), [Tailwind Animate](https://github.com/jamiebuilds/tailwindcss-animate)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand) (with strict selector patterns)
*   **Validation:** [Zod](https://zod.dev/)
*   **Backend/Edge:** [Cloudflare Workers](https://workers.cloudflare.com/), [Hono](https://hono.dev/)
*   **Package Manager:** [Bun](https://bun.sh/)

## ⚡ Getting Started

### Prerequisites

*   **Bun**: This project uses Bun as the package manager and runtime. Ensure you have it installed.
*   **Node.js**: Required for some build tools (though Bun handles most tasks).

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd controller-mapper-dashboard
    ```

2.  Install dependencies:
    ```bash
    bun install
    ```

### Development

Start the development server:

```bash
bun run dev
```

This will start the Vite server (usually at `http://localhost:3000`) and the Cloudflare Worker proxy for API routes.

### Building for Production

To create a production build of the frontend assets:

```bash
bun run build
```

## 📂 Project Structure

*   `src/`: Frontend source code.
    *   `components/`: Reusable UI components (ShadCN & custom).
    *   `pages/`: Application views (Home, Dashboard, Visualizer).
    *   `hooks/`: Custom React hooks.
    *   `lib/`: Utilities and helper functions.
*   `worker/`: Cloudflare Worker backend code.
    *   `index.ts`: Main entry point for the worker.
    *   `userRoutes.ts`: API route definitions.
*   `public/`: Static assets.

## 🚀 Deployment

This project is configured for deployment on Cloudflare Workers.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/esparks855-del/controller-mapper-runtime-dashboard)

To deploy manually via the command line:

1.  Ensure you are logged into Cloudflare:
    ```bash
    bun x wrangler login
    ```

2.  Deploy the application:
    ```bash
    bun run deploy
    ```

## 🤝 Contributing

Contributions are welcome! Please ensure you follow the project's coding standards:
*   Use ShadCN components where possible.
*   Follow the "Root Wrapper & Gutters" layout pattern.
*   Adhere to the strict Zustand selector rules (no object/array creation in selectors).

## 📄 License

This project is licensed under the MIT License.