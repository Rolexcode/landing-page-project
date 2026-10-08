# Nexora — Landing Page

A responsive landing page for **Nexora**, a fictional AI-powered productivity workspace for modern teams.

This project was built as part of a Frontend Development internship task, with a focus on creating a realistic product experience rather than a purely academic exercise.

## Overview

Nexora helps teams bring projects, people, and lightweight automation into one focused workspace.

The landing page is designed around three principles:

- **Clarity** — clear hierarchy, concise copy, and focused calls to action.
- **Confidence** — consistent spacing, typography, states, and product UI.
- **Responsiveness** — layouts adapt intentionally across desktop, tablet, and mobile.

## Features

- Semantic, accessible HTML structure
- Responsive navigation with mobile hamburger menu
- Responsive desktop/tablet/mobile layouts
- Product-focused hero section
- Services/features cards
- Customer testimonials
- Final conversion CTA
- Responsive footer with navigation and social links
- Smooth anchor scrolling
- Scroll-triggered reveal animations
- Active navigation state based on the visible section
- Reduced-motion support for accessibility
- No framework or build step required

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts (Inter)

## Project Structure

```text
landing-page-project/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Design Direction

The visual system uses a light neutral foundation with deep ink typography, a violet primary accent, and a teal secondary accent.

Typography and spacing are deliberately restrained so the interface feels like a contemporary SaaS product rather than a collection of unrelated components.

The product dashboard in the hero is built entirely with HTML and CSS, keeping the project lightweight and avoiding unnecessary image dependencies.

## Accessibility

The page includes:

- Semantic landmarks and headings
- Keyboard-visible focus states
- A skip-to-content link
- Accessible mobile navigation controls
- Reduced-motion handling via `prefers-reduced-motion`
- Descriptive link and button labels

## Local Development

No dependencies are required.

Clone the repository and open `index.html` in a browser, or serve the directory with any simple static server.

## Deployment

The project is suitable for GitHub Pages, Netlify, Vercel, or another static hosting provider.

---

**Note:** Nexora is a fictional product created for this portfolio/internship project.
