---

## VSSkin Web Application: Implementation Plan

### 1. Project Setup & Core Architecture

*   **HTML Structure (`index.html`):**
    *   A single `div` will act as the root container for the application, ensuring `100vw` and `100vh`.
    *   Persistent elements (frame, header, footer) will be direct children or styled with `::before`/`::after` on the main app container.
    *   Placeholders for the two main views (`Dial View`, `Preview View`), toggled by JavaScript, possibly using `display: none` or `visibility: hidden` and `opacity` for smooth transitions.
    *   Import necessary fonts (IBM Plex Mono/Fira Code) from Google Fonts or local files.
*   **CSS Setup (`style.css` / SCSS):**
    *   **Global Reset:** Apply a basic CSS reset (e.g., `margin: 0; padding: 0; box-sizing: border-box;`).
    *   **Body Styling:** Crucially, `body { overflow: hidden; height: 100vh; width: 100vw; }` to prevent scrolling and ensure full viewport coverage.
    *   **Base Typography:** Set `font-family: 'IBM Plex Mono', monospace;` (or Fira Code) as the default.
    *   **CSS Variables for Theming:** Define a set of custom CSS properties (`--primary-bg`, `--primary-text`, `--accent-color`, `--secondary-ui`, etc.) at the `:root` level. These will be dynamically updated by JavaScript based on the selected brand.
*   **JavaScript Entry Point (`script.js`):**
    *   Initialize the application, set up event listeners.
    *   Manage the application's state (current view, selected brand index).
    *   Orchestrate view transitions and dynamic content updates.

### 2. Dynamic Theming System

*   **Data Structure for Brands:** Create a JavaScript array of objects, where each object represents a brand:
    ```javascript
    const brands = [
        {
            id: 'vsskin',
            name: 'VSSKIN',
            colors: {
                bg: '#121212',
                text: '#EAEAEA',
                accent: '#FF1E56',
                secondaryUI: '#333333',
                subtleHighlight: '#222222',
            },
            vsCodeSnippet: `<!-- HTML snippet for VSSkin theme -->`, // HTML string with code content & specific CSS classes
            marketplaceLink: 'https://marketplace.visualstudio.com/items?itemName=vsskin.vsskin',
            // ... other brand-specific data
        },
        {
            id: 'spotify',
            name: 'SPOTIFY',
            colors: {
                bg: '#121212',
                text: '#FFFFFF',
                accent: '#1DB954',
                secondaryUI: '#333333',
                subtleHighlight: '#222222',
            },
            vsCodeSnippet: `<!-- HTML snippet for Spotify theme -->`,
            marketplaceLink: 'https://marketplace.visualstudio.com/items?itemName=vsskin.spotify-theme',
        },
        // ... more brands
    ];
    ```
*   **Theme Application Logic:**
    *   A JavaScript function `applyTheme(brandId)` will take a brand ID.
    *   It will find the corresponding brand object in the `brands` array.
    *   It will iterate through the `colors` object and update the respective CSS variables on the `document.documentElement` (or a dedicated theme container) using `element.style.setProperty('--variable-name', value)`.
    *   This function will be called on initial load (for default VSSkin theme), when the dial is tuned, and when navigating between preview themes.

### 3. Layout & Persistent Elements

*   **Root Container:** A full-viewport `div` (`#app`) will hold everything.
*   **Persistent Frame:** Achieved using CSS borders on the `#app` element, or `::before`/`::after` pseudo-elements for more control over thickness and position.
*   **Persistent Header/Footer:** Absolute positioned `div`s in the corners of `#app` with appropriate `z-index` to stay above content.
*   **Background Grid Pattern:**
    *   A dedicated `div` with `position: absolute; top: 0; left: 0; width: 100%; height: 100%;`.
    *   Styled with `background-image: radial-gradient(circle, var(--subtle-highlight) 1px, transparent 1px); background-size: 20px 20px; opacity: 0.1;` (or similar) to create the dotted grid effect. Its color will be tied to `--subtle-highlight`.

### 4. Dial View Implementation

*   **HTML Structure:**
    *   A main container for the Dial View.
    *   The central dial element (e.g., `div` with `border-radius: 50%; border: 2px solid var(--secondary-ui);`).
    *   Individual `div`s/buttons for brand logos/names positioned around the dial using `position: absolute` and calculated `left`/`top` based on angular distribution.
    *   A small `div` for the dial indicator, which will be rotated.
    *   A `h2` or `p` for the `TUNE TO: [BRAND NAME]` text.
    *   The `[ PREVIEW THEME + ]` button.
*   **CSS Styling:**
    *   Apply `IBM Plex Mono` font to all text elements.
    *   Implement specific letter-spacing and `text-transform: uppercase` for headings.
    *   Styling for the dial (border, size).
    *   Styling for brand labels (initially `--secondary-ui`, changing to `--accent-color` for active).
    *   Styling for the primary CTA button (solid `var(--accent-color)` background, `var(--primary-text)` text).
*   **JavaScript Interaction (The Dial):**
    *   **Drag Logic:** Attach `mousedown`, `mousemove`, `mouseup` (and corresponding touch events) to the dial element or an overlay.
    *   Calculate the angle of the mouse/touch relative to the dial's center.
    *   Map the calculated angle to the closest brand in the `brands` array.
    *   Update the dial indicator's `transform: rotate()` CSS property based on the current angle.
    *   **Live Feedback:** As the dial moves, call `applyTheme()` with the currently pointed-to brand's ID and update the `TUNE TO:` text. Use `requestAnimationFrame` for smooth animation during drag.
    *   **Click Handler:** On click of `[ PREVIEW THEME + ]`, store the currently selected brand and trigger the glitch transition to the Preview View.

### 5. Preview View Implementation

*   **HTML Structure (VS Code Emulator):**
    *   A container `div` for the entire VS Code window.
    *   Inner `div`s for Activity Bar, Sidebar, Editor Group (with tabs), and the main Code Area.
    *   The Code Area will contain pre-formatted HTML with `<span>` elements for syntax highlighting, using classes like `comment`, `keyword`, `string`, `number`, etc., whose colors will be defined by CSS variables.
    *   Navigation buttons (`X`, `<`, `>`) and `[ INSTALL TO VS CODE ]` button.
*   **CSS Styling:**
    *   Apply `1px` borders and subtle `border-radius` to the VS Code frame.
    *   Use CSS variables for all internal VS Code elements (backgrounds, text, borders) to dynamically match the selected brand's theme.
    *   Define classes for syntax highlighting (e.g., `.keyword { color: var(--keyword-color); }`) that will be updated by `applyTheme()` or derive their colors from the main theme variables.
*   **JavaScript Interaction:**
    *   On entering Preview View, retrieve the selected brand's `vsCodeSnippet` and inject it into the Code Area.
    *   **Navigation:**
        *   `X` (Back Button): Trigger glitch transition back to Dial View.
        *   `<` `>` (Next/Prev Buttons): Update the selected brand index, then trigger glitch transition to the *new* brand's Preview View.
    *   **Install Button:** A simple `<a>` tag with `target="_blank"` linking to `marketplaceLink`.

### 6. Animation & Transitions

*   **Pixelated Glitch Transition (Most Complex):**
    *   **Mechanism:** A full-screen overlay `div` that appears on top of the current view.
    *   **CSS:** The overlay will contain a grid of many small `div`s or use a single element with `filter: url(#pixelate)` (SVG filter) or WebGL (more advanced).
    *   **JavaScript Orchestration:**
        1.  Start the transition: Get the *incoming* theme's accent color.
        2.  Create/activate the glitch overlay `div`.
        3.  Apply a CSS animation (`keyframes`) to the overlay or its children.
            *   Each "pixel" (or a pseudo-element) will animate its `transform` (e.g., `translate`, `scale`, `rotate`), `opacity`, and `background-color` (tinted with the accent color).
            *   Stagger the animations using `animation-delay` for a dissolving effect.
        4.  Halfway through the animation (e.g., 200-250ms), swap the underlying views (hide current, show next).
        5.  Complete the animation, then hide the glitch overlay.
    *   **Performance:** Optimize the number of elements and complexity of CSS animations to maintain smoothness (aim for 60fps).
*   **Hover Animations:**
    *   Use `transition: all 0.15s ease-in-out;` on relevant CSS properties (`color`, `background-color`, `border-color`, `transform`, `opacity`) for buttons, dial elements, and interactive areas.
*   **Text Scramble Effect:**
    *   **JavaScript:** On `mouseenter` for elements with this effect:
        *   Store the original text content.
        *   Use `setInterval` to rapidly update `textContent` with random characters from a predefined symbol set (`@#$*&%?`).
        *   After 200-300ms, clear the `setInterval` and revert to the original text.
        *   On `mouseleave`, immediately revert to original text.
*   **Loading State:**
    *   **HTML:** A `div` containing multiple small `span` or `div` elements arranged in a circle.
    *   **CSS:** Use `@keyframes` to animate the `opacity` or `background-color` of these dots in a sequence, creating a circular "loading" effect.

### 7. Responsiveness

*   While the `100vh` constraint implies a full-screen experience, basic `em` or `rem` units for font sizes and strategic use of `vw`/`vh` units for sizing elements will allow for some scaling.
*   Flexbox and CSS Grid will be used to ensure elements distribute and align well across different viewport dimensions within the `100vh`/`100vw` constraint.
*   The primary focus will be on desktop experience, but basic adjustments for larger tablets in landscape mode will be considered.

### 8. Data Management

*   All brand-specific data (colors, VS Code snippets, marketplace links) will be stored in a centralized JavaScript object/array (as described in "Dynamic Theming System"). This makes it easy to add or modify themes without changing the core HTML structure.

---

### Confirmation of Style Understanding

I confirm my understanding of the style guidelines:

*   **Monospaced Typography:** All text will strictly adhere to `IBM Plex Mono` (or `Fira Code` if preferred after testing) with specified weights and letter-spacing for headings.
*   **Dynamic Colors:** The core of the visual style will be driven by CSS variables, allowing seamless, instant theme changes across all UI elements based on the selected brand.
*   **"Terminal Chic":** This will be achieved through:
    *   Sharp lines, minimalist design, and generous spacing.
    *   Subtle background grid patterns.
    *   Consistent use of fine 1px borders.
    *   The specific choice of fonts and their styling.
    *   The interactive nature of the dial and glitch transitions.
*   **Animations:**
    *   **Glitch:** I understand this needs to be a prominent, full-screen, pixelated dissolve effect, ideally tinted with the incoming theme's accent color. This will require careful CSS animation and JavaScript orchestration.
    *   **Hover:** Fast, subtle feedback via CSS transitions.
    *   **Text Scramble:** Implement the character cycling effect on hover for interactive text elements.
*   **Cursor:** I will implement a custom cursor as specified (crosshair/hollow circle, changing on hover).

