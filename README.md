# Adem Miladi — Product Systems Designer & Engineer

> A high-performance, cinematic portfolio showcasing scalable frontend architecture and premium interaction design.

![Portfolio Preview](public/favicon_AD.svg)

## ⚡ Overview

This portfolio is not just a showcase of work—it's a demonstration of **engineering capability**. Built with performance, accessibility, and fluid motion at its core, it bridges the gap between design and development.

This project implements advanced **scroll-driven animations**, **physics-based interactions**, and a **robust design system** without compromising on speed or maintainability.

---

## 🎨 Design Engineering & Powerful Effects

This application features several custom-built interaction models that push the boundaries of standard web development:

### 1. Cinematic Scroll Stacking (Projects Section)
- **Effect**: As users scroll, project cards stack on top of each other with a precise scale, fade, and translation effect, mimicking a deck of cards.
- **Engineering**: Implemented using `requestAnimationFrame` for 60fps performance, bypassing heavy React renders for direct DOM manipulation where necessary.

### 2. 3D Parallax Hero
- **Effect**: The hero section responds to mouse movement, creating a subtle 3D depth effect that rotates the entire container based on cursor position.
- **Engineering**: Calculated using mouse coordinates relative to the viewport center, applying CSS `perspective` and `rotate3d` transforms.

### 3. Magnetic & Physics-Based Interactions
- **Effect**: Buttons and interactive elements have a "magnetic" pull, gravitating towards the cursor before snapping back.
- **Engineering**: Physics-based calculations on `mousemove` events, creating a tactile feel that enhances user engagement.

### 4. Atmospheric Grain & Noise
- **Effect**: A subtle, animated SVG noise overlay that gives the entire site a film-grain texture, enhancing the "premium" dark mode aesthetic.
- **Engineering**: Lightweight SVG filter applied via a fixed overlay, animated with CSS steps to avoid layout thrashing.

### 5. Custom Cursor System
- **Effect**: A dual-layer custom cursor (dot + trailing outline) that adapts to interactive elements.
- **Engineering**: Decoupled from the main React render cycle for lag-free movement using direct ref manipulation.

---

## 🛠 Technology Stack

Built with a focus on modern standards and performance:

- **Core**: [React 18](https://reactjs.org/) (functional components, hooks)
- **Build Tool**: [Vite](https://vitejs.dev/) (optimized for speed)
- **Styling**: Vanilla CSS Variables (Design Tokens) + CSS Modules approach
- **Motion**: [Framer Motion](https://www.framer.com/motion/) (complex orchestrations) + Native CSS/JS (performance-critical animations)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linting**: ESLint + Prettier

---

## 🚀 Getting Started

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:MDadem/Portfolio_V2.git
    cd Portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

---

## 💎 Project Structure

The project follows a **Feature-First** architecture designed for scalability:

```
src/
├── assets/          # Static assets (images, SVGs)
├── components/      # React components
│   ├── Layout/      # Global layout components (Navbar, Footer, Cursor)
│   ├── Sections/    # Page sections (Hero, Projects, Approach)
│   └── UI/          # Reusable UI primitives (MagneticButton)
├── index.css        # Global styles & Design Tokens
└── main.jsx         # Entry point
```

---

## 📄 License

© 2025 Adem Miladi. All Rights Reserved.
Designed & Engineered by Adem Miladi.
