# Portfolio Website - Creative Developer & UI/UX Technologist

A modern, highly animated, and performance-optimized portfolio website built with pure HTML5, CSS3/SCSS, and vanilla JavaScript. Features GSAP-based animations, dark/light theme toggle, and modular architecture for scalability and reusability.

## 🚀 Features

### Core Functionality
- **Modular Architecture**: ES6 modules for maintainable and reusable code
- **Theme Toggle**: Smooth dark/light theme transitions with GSAP animations
- **Preloader**: Typewriter-style loading animation
- **Responsive Design**: Mobile-first approach with fluid layouts
- **Performance Optimized**: Lazy loading, critical resource preloading, and optimized animations

### Animations & Interactions
- **GSAP Animations**: Professional-grade animations with ScrollTrigger
- **Custom Cursor**: Interactive cursor with hover morphing effects
- **Parallax Effects**: 3D parallax layers in hero section
- **Scroll Animations**: Entrance animations triggered by scroll position
- **Project Modals**: Animated fullscreen project showcases
- **Smooth Scrolling**: Enhanced scroll experience with snap points

### Accessibility & Performance
- **ARIA Attributes**: Full accessibility compliance
- **Keyboard Navigation**: Complete keyboard support
- **Reduced Motion**: Respects user's motion preferences
- **Lazy Loading**: Progressive image and media loading
- **SEO Optimized**: Meta tags, Open Graph, and semantic HTML
- **Print Styles**: Optimized for printing

## 🛠️ Tech Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3/SCSS**: Modular stylesheets with CSS custom properties
- **JavaScript ES6**: Modern vanilla JavaScript with modules
- **GSAP**: Professional animation library with ScrollTrigger
- **Sass**: CSS preprocessor for maintainable styles

## 📁 Project Structure

```
portfolio-website/
├── index.html                 # Main HTML file
├── css/
│   └── main.css              # Compiled CSS
├── scss/
│   ├── main.scss             # Main SCSS entry point
│   ├── utilities/
│   │   ├── _variables.scss   # Color themes and variables
│   │   ├── _mixins.scss      # Reusable SCSS mixins
│   │   └── _reset.scss       # CSS reset and base styles
│   ├── themes/
│   │   ├── _light.scss       # Light theme variables
│   │   └── _dark.scss        # Dark theme variables
│   ├── layouts/
│   │   └── _base.scss        # Base layout styles
│   └── components/
│       ├── _preloader.scss   # Preloader component
│       ├── _theme-toggle.scss # Theme toggle button
│       ├── _hero.scss        # Hero section
│       ├── _about.scss       # About section
│       ├── _projects.scss    # Projects section
│       └── _contact.scss     # Contact section
├── js/
│   ├── main.js               # Main JavaScript entry point
│   ├── modules/
│   │   ├── preloader.js      # Preloader functionality
│   │   ├── theme.js          # Theme toggle logic
│   │   ├── hero.js           # Hero section animations
│   │   ├── about.js          # About section animations
│   │   ├── projects.js       # Projects section & modals
│   │   ├── contact.js        # Contact form handling
│   │   └── cursor.js         # Custom cursor effects
│   └── utils/
│       ├── smooth-scroll.js  # Smooth scrolling utility
│       └── lazy-loading.js   # Lazy loading utility
├── assets/
│   └── images/               # Project images and assets
├── package.json              # Node.js dependencies
└── README.md                 # This file
```

## 🎨 Design Themes

### Neo Brutalist Theme
- **Light**: Warm cream background (#fffbe6) with bold typography
- **Dark**: Deep black (#0e0e0e) with high contrast elements

### Futuristic Glass Theme
- **Light**: Cool cyan tones (#e0f7ff) with glass morphism
- **Dark**: Deep blue gradients (#0f2027) with neon accents

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run build` - Compile SCSS to CSS
- `npm run watch` - Watch SCSS files for changes
- `npm run dev` - Start development server
- `npm run lint` - Run code linting

## 🎯 Key Components

### Preloader Module
```javascript
import { Preloader } from './modules/preloader.js';
const preloader = new Preloader();
```
- Typewriter animation effect
- Progress tracking
- Callback system for initialization

### Theme Toggle Module
```javascript
import { ThemeToggle } from './modules/theme.js';
const themeToggle = new ThemeToggle();
```
- Smooth GSAP transitions
- Local storage persistence
- System preference detection

### Animation Modules
Each section has its own animation module with:
- ScrollTrigger integration
- Reduced motion support
- Performance optimization
- Reusable animation timelines

### Lazy Loading Utility
```javascript
import { LazyLoader } from './utils/lazy-loading.js';
const lazyLoader = new LazyLoader();
```
- Intersection Observer API
- Progressive image loading
- Fallback for older browsers
- Performance monitoring

## 🎨 Customization

### Changing Themes
Edit the theme files in `scss/themes/`:
- `_light.scss` - Light theme colors
- `_dark.scss` - Dark theme colors

### Adding New Sections
1. Create SCSS component in `scss/components/`
2. Create JavaScript module in `js/modules/`
3. Import and initialize in `main.js`
4. Add HTML markup to `index.html`

### Modifying Animations
Animations are centralized in their respective modules:
- Hero animations: `js/modules/hero.js`
- Scroll animations: Use ScrollTrigger in component modules
- Theme transitions: `js/modules/theme.js`

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### Mobile Optimizations
- Touch-friendly interactions
- Optimized font sizes
- Simplified animations
- Compressed images

## ♿ Accessibility Features

- **ARIA Labels**: Comprehensive labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Semantic HTML**: Proper heading hierarchy and landmarks

## 🔧 Performance Optimizations

### Loading Performance
- Critical resource preloading
- Lazy loading for images and media
- Optimized font loading
- Minified and compressed assets

### Runtime Performance
- GPU-accelerated animations
- Debounced resize handlers
- Efficient scroll listeners
- Memory leak prevention

### Core Web Vitals
- Optimized Largest Contentful Paint (LCP)
- Minimized Cumulative Layout Shift (CLS)
- Fast First Input Delay (FID)

## 🌐 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

### Fallbacks
- CSS Grid with Flexbox fallback
- Intersection Observer with scroll fallback
- GSAP with CSS animation fallback

## 📦 Deployment

### Static Hosting
The website can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Build Process
```bash
npm run build
```
This compiles SCSS to CSS and optimizes assets for production.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- GSAP for professional animations
- Modern CSS techniques and best practices
- Accessibility guidelines from WCAG
- Performance optimization techniques

## 📞 Contact

For questions or support, please contact:
- Email: hamzaanxari@gmail.com
- Phone: +923130890746
- Location: San Francisco, CA

---

