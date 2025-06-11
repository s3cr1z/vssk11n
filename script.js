const brands = [
    {
        id: 'vsskin',
        name: 'VSSKIN',
        colors: {
            primaryBg: '#121212', // Renamed to match CSS variable names more directly
            primaryText: '#EAEAEA',
            accentColor: '#FF1E56',
            secondaryUi: '#333333',
            subtleHighlight: '#222222',
                borderColor: '#444444',
                // VSCode specific examples
                vscodeComment: '#6A9955', // Standard green
                vscodeKeyword: '#C586C0', // Purplish
                vscodeString: '#CE9178',  // Orange
                vscodeFunction: '#DCDCAA' // Yellowish
        },
        vsCodeSnippet: `<pre><code class="language-html">&lt;!-- HTML snippet for VSSkin theme --&gt;
&lt;div class="vsskin-example"&gt;
    &lt;span class="comment"&gt;// VSSkin Theme Example&lt;/span&gt;
    &lt;span class="keyword"&gt;const&lt;/span&gt; &lt;span class="variable"&gt;hello&lt;/span&gt; = &lt;span class="string"&gt;"world"&lt;/span&gt;;
&lt;/div&gt;</code></pre>`,
        marketplaceLink: 'https://marketplace.visualstudio.com/items?itemName=vsskin.vsskin',
    },
    {
        id: 'spotify',
        name: 'SPOTIFY',
        colors: {
            primaryBg: '#121212',
            primaryText: '#FFFFFF',
            accentColor: '#1DB954',
            secondaryUi: '#282828', // Spotify's darker UI elements
            subtleHighlight: '#181818', // Spotify's subtle background elements
                borderColor: '#303030',
                // VSCode specific examples
                vscodeComment: '#7F7F7F', // Greyish comments often seen in Spotify-like themes
                vscodeKeyword: '#1DB954', // Accent green for keywords
                vscodeString: '#B3B3B3',  // Light grey for strings
                vscodeFunction: '#FFFFFF' // White for function names
        },
        vsCodeSnippet: `<pre><code class="language-html">&lt;!-- HTML snippet for Spotify theme --&gt;
&lt;div class="spotify-example"&gt;
    &lt;span class="comment"&gt;// Spotify Theme Example&lt;/span&gt;
    &lt;span class="keyword"&gt;function&lt;/span&gt; &lt;span class="function-name"&gt;playSong&lt;/span&gt;(&lt;span class="parameter"&gt;trackId&lt;/span&gt;) {
        &lt;span class="comment"&gt;// ... imagine beautiful music playing ...&lt;/span&gt;
    &lt;/span&gt;
&lt;/div&gt;</code></pre>`,
        marketplaceLink: 'https://marketplace.visualstudio.com/items?itemName=vsskin.spotify-theme', // Assuming a similar link structure
    },
    // Add a third example brand for testing navigation
    {
        id: 'dracula',
        name: 'DRACULA',
        colors: {
            primaryBg: '#282a36',
            primaryText: '#f8f8f2',
            accentColor: '#ff79c6',
            secondaryUi: '#44475a',
            subtleHighlight: '#1f2028', // A slightly darker shade for the grid
                borderColor: '#6272a4',
                // VSCode specific for Dracula
                vscodeComment: '#6272a4', // Dracula's comment color
                vscodeKeyword: '#ff79c6', // Dracula's pink for keywords
                vscodeString: '#f1fa8c',  // Dracula's yellow for strings
                vscodeFunction: '#50fa7b' // Dracula's green for function names
        },
        vsCodeSnippet: `<pre><code class="language-html">&lt;!-- HTML snippet for Dracula theme --&gt;
&lt;div class="dracula-example"&gt;
    &lt;span class="comment"&gt;// Dracula Theme Example&lt;/span&gt;
    &lt;span class="keyword"&gt;class&lt;/span&gt; &lt;span class="class-name"&gt;Vampire&lt;/span&gt; {
        &lt;span class="function-name"&gt;constructor&lt;/span&gt;(&lt;span class="parameter"&gt;name&lt;/span&gt;) {
            &lt;span class="keyword"&gt;this&lt;/span&gt;.&lt;span class="property"&gt;name&lt;/span&gt; = &lt;span class="parameter"&gt;name&lt;/span&gt;;
        }
    &lt;/span&gt;
&lt;/div&gt;</code></pre>`,
        marketplaceLink: 'https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula',
    }
];

function applyTheme(brandId) {
    const brand = brands.find(b => b.id === brandId);
    if (!brand) {
        console.error(`Brand with id "${brandId}" not found.`);
        return;
    }

    const root = document.documentElement;
    for (const [key, value] of Object.entries(brand.colors)) {
        // Construct CSS variable name, e.g., primaryBg -> --primary-bg
        const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVarName, value);
    }
    // console.log(`Theme applied: ${brand.name}`);
    // Update appState with the new brand
    appState.selectedBrandId = brandId;
}

// Basic state management (will be expanded)
const appState = {
    currentView: 'dial', // 'dial' or 'preview'
    selectedBrandId: 'vsskin' // Default brand
};

// DOM Elements (can be fetched as needed)
const dialView = document.getElementById('dialView');
const previewView = document.getElementById('previewView');
const appHeader = document.getElementById('appHeader'); // If needed
const appFooter = document.getElementById('appFooter'); // If needed
const backgroundGrid = document.getElementById('backgroundGrid'); // If needed

// New Dial View Elements
const dial = document.getElementById('dial');
const dialIndicator = document.getElementById('dialIndicator');
const currentBrandNameElement = document.getElementById('currentBrandName');
const previewThemeButton = document.getElementById('previewThemeButton');

// Preview View Elements
const vsCodeEmulator = document.getElementById('vsCodeEmulator');
const vsCodeSnippetContainer = document.getElementById('vsCodeSnippetContainer');
const closePreviewButton = document.getElementById('closePreviewButton');
const prevThemeButton = document.getElementById('prevThemeButton');
const nextThemeButton = document.getElementById('nextThemeButton');
const installThemeLink = document.getElementById('installThemeLink');
// Optional: if you want to update title text dynamically
const vsCodeTitleText = document.querySelector('.vscode-title-text');
const glitchOverlay = document.getElementById('glitchOverlay');

const GLITCH_DURATION = 600; // Total duration of the glitch in ms
const PIXEL_COLS = 20; // Number of columns for pixels
const PIXEL_ROWS = 15; // Number of rows for pixels

function triggerGlitchTransition(newViewName, oldViewName) {
    if (!glitchOverlay) return;

    // 1. Determine incoming theme's accent color
    //    The theme should already be set in appState.selectedBrandId by the calling logic
    const currentBrand = brands.find(b => b.id === appState.selectedBrandId);
    const accent = currentBrand ? currentBrand.colors.accentColor : '#FF1E56'; // Fallback accent

    // 2. Prepare and activate the glitch overlay
    glitchOverlay.innerHTML = ''; // Clear previous pixels
    glitchOverlay.style.setProperty('--accent-color', accent); // Set accent for pixels
    glitchOverlay.style.gridTemplateColumns = `repeat(${PIXEL_COLS}, 1fr)`;
    glitchOverlay.style.gridTemplateRows = `repeat(${PIXEL_ROWS}, 1fr)`;
    glitchOverlay.classList.add('active');

    // 3. Create and animate pixels
    for (let i = 0; i < PIXEL_COLS * PIXEL_ROWS; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('glitch-pixel');

        // Random values for CSS variables used in animation
        pixel.style.setProperty('--random-x', (Math.random() - 0.5).toFixed(2));
        pixel.style.setProperty('--random-y', (Math.random() - 0.5).toFixed(2));
        pixel.style.setProperty('--random-r', (Math.random() - 0.5).toFixed(2));

        // Stagger animation start
        const delay = Math.random() * (GLITCH_DURATION / 3);
        pixel.style.animation = `glitchPixelAnimation ${GLITCH_DURATION * 0.8}ms ease-in-out ${delay}ms forwards`;

        glitchOverlay.appendChild(pixel);
    }

    // 4. Halfway through the animation, swap the underlying views
    setTimeout(() => {
        // Hide old view (if provided and different)
        if (oldViewName && oldViewName !== newViewName) {
            const oldViewElement = document.getElementById(oldViewName + 'View'); // e.g. 'dialView'
            if (oldViewElement) oldViewElement.style.display = 'none';
        }

        // Show new view and update content (using existing setView logic but simplified here)
        // The main setView function already handles applying themes and loading content.
        // We need to call the core logic of setView without triggering another glitch.

        const newViewElement = document.getElementById(newViewName + 'View');
        if (newViewElement) {
             if (newViewName === 'dial') {
                newViewElement.style.display = 'flex';
                if (dial && dial.querySelectorAll('.brand-label').length === 0) {
                    populateBrandLabels();
                }
                updateDialSelection(appState.selectedBrandId, false);
            } else if (newViewName === 'preview') {
                applyTheme(appState.selectedBrandId); // Ensure theme is current
                newViewElement.style.display = 'flex';
                loadPreviewContent(appState.selectedBrandId);
            }
            appState.currentView = newViewName;
            console.log(`View switched to ${newViewName} mid-glitch. Current theme: ${appState.selectedBrandId}`);
        }

    }, GLITCH_DURATION / 2); // Swap views at midpoint

    // 5. After the full duration, hide the glitch overlay
    setTimeout(() => {
        glitchOverlay.classList.remove('active');
        glitchOverlay.innerHTML = ''; // Clean up pixels
    }, GLITCH_DURATION);
}

function populateBrandLabels() {
    if (!dial) return; // Ensure dial element exists

    const radius = dial.offsetWidth / 2 * 0.8; // 80% of the way out to the edge
    const centerX = dial.offsetWidth / 2;
    const centerY = dial.offsetHeight / 2;
    const totalBrands = brands.length;

    // Clear existing labels except for the indicator
    Array.from(dial.children).forEach(child => {
        if (child.id !== 'dialIndicator') {
            dial.removeChild(child);
        }
    });

    brands.forEach((brand, index) => {
        const angle = (index / totalBrands) * 2 * Math.PI - (Math.PI / 2); // Start at the top

        const x = centerX + radius * Math.cos(angle) - (brand.name.length * 4); // Approximate text width adjustment
        const y = centerY + radius * Math.sin(angle) - 8; // Approximate text height adjustment

        const label = document.createElement('div');
        label.classList.add('brand-label');
        label.textContent = brand.name;
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;
        label.dataset.brandId = brand.id; // Store brand id for interaction

        // Highlight the default selected brand
        if (brand.id === appState.selectedBrandId) {
            label.classList.add('active');
            if(currentBrandNameElement) currentBrandNameElement.textContent = brand.name;
        }

        dial.appendChild(label);
    });
}

function loadPreviewContent(brandId) {
    const brand = brands.find(b => b.id === brandId);
    if (!brand) {
        console.error(`Brand ${brandId} not found for preview.`);
        if (vsCodeSnippetContainer) {
            vsCodeSnippetContainer.innerHTML = '<pre><code>Error: Theme not found.</code></pre>';
        }
        if (installThemeLink) {
            installThemeLink.href = '#';
        }
        if (vsCodeTitleText) {
            vsCodeTitleText.textContent = 'VSSKIN PREVIEW - ERROR';
        }
        return;
    }

    if (vsCodeSnippetContainer) {
        vsCodeSnippetContainer.innerHTML = brand.vsCodeSnippet; // Assumes vsCodeSnippet is valid HTML
    }

    if (installThemeLink) {
        installThemeLink.href = brand.marketplaceLink;
        installThemeLink.setAttribute('title', `Install ${brand.name} from VS Code Marketplace`);
    }

    if (vsCodeTitleText) {
        // Example: update title, could be filename from snippet or generic
        vsCodeTitleText.textContent = `VSSKIN PREVIEW - ${brand.name.toLowerCase()}_example.js`;
    }

    // Theme is already applied by updateDialSelection or navigation logic before switching.
    // applyTheme(brand.id); // This should already be handled by the logic that leads to showing the preview.
}

if (closePreviewButton) {
    closePreviewButton.addEventListener('click', () => {
        const oldView = appState.currentView; // e.g., 'preview'
        // updateDialSelection will ensure dial is set to appState.selectedBrandId
        triggerGlitchTransition('dial', oldView);
    });
}

function navigateThemes(direction) {
    const currentIndex = brands.findIndex(b => b.id === appState.selectedBrandId);
    if (currentIndex === -1) return; // Should not happen

    let nextIndex = currentIndex + direction;

    if (nextIndex >= brands.length) {
        nextIndex = 0; // Wrap to start
    } else if (nextIndex < 0) {
        nextIndex = brands.length - 1; // Wrap to end
    }

    const nextBrand = brands[nextIndex];
    appState.selectedBrandId = nextBrand.id;

    // Apply new theme, then load new content. View remains 'preview'.
    // Glitch transition will wrap these calls later.
    // applyTheme(nextBrand.id);
    // loadPreviewContent(nextBrand.id);

    // console.log(`Navigated preview to: ${nextBrand.name}`);
    console.log(`Navigating preview to: ${nextBrand.name} with glitch`);
    // For navigation within the same view (preview to preview), oldView and newView are the same.
    // The triggerGlitchTransition needs to correctly re-load content for the new theme.
    // The setView part within triggerGlitchTransition handles calling applyTheme and loadPreviewContent.
    triggerGlitchTransition('preview', 'preview');
}

if (prevThemeButton) {
    prevThemeButton.addEventListener('click', () => {
        navigateThemes(-1);
    });
}

if (nextThemeButton) {
    nextThemeButton.addEventListener('click', () => {
        navigateThemes(1);
    });
}

function updateDialSelection(brandId, animateIndicator = true) {
    const brand = brands.find(b => b.id === brandId);
    if (!brand) return;

    if (currentBrandNameElement) {
        currentBrandNameElement.textContent = brand.name;
    }

    // Update active class on labels
    document.querySelectorAll('.brand-label').forEach(label => {
        if (label.dataset.brandId === brandId) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    });

    // Calculate and apply indicator rotation
    const brandIndex = brands.findIndex(b => b.id === brandId);
    if (brandIndex !== -1 && dialIndicator) {
        const totalBrands = brands.length;
        const angleDegrees = (brandIndex / totalBrands) * 360; // Angle for the indicator

        // Optional: add transition only if animating
        // dialIndicator.style.transition = animateIndicator ? 'transform 0.3s ease, background-color 0.3s ease' : 'none';
        // The CSS already has a transition, so this might not be needed unless specifically disabling for non-animated updates.
        // For simplicity, we rely on CSS transition.

        dialIndicator.style.transform = `rotate(${angleDegrees}deg)`;
    }

    // Apply the theme for the newly selected brand
    applyTheme(brandId); // This was missing from the previous brief but is crucial

    console.log(`Dial selection updated to: ${brand.name}, Theme applied.`);
}


// Function to set views directly (was switchView)
function setView(viewName) {
    // Hide all views first
    dialView.style.display = 'none';
    previewView.style.display = 'none';

    const newViewElement = document.getElementById(viewName + 'View');

    if (viewName === 'dial') {
        if (newViewElement) newViewElement.style.display = 'flex';
        if (dial && dial.querySelectorAll('.brand-label').length === 0) {
            populateBrandLabels();
        }
        // Theme and dial selection should be up-to-date by the time this is called.
        updateDialSelection(appState.selectedBrandId, false);
        appState.currentView = 'dial';
    } else if (viewName === 'preview') {
        applyTheme(appState.selectedBrandId); // Ensure theme is current for preview
        if (newViewElement) newViewElement.style.display = 'flex';
        loadPreviewContent(appState.selectedBrandId);
        appState.currentView = 'preview';
    }
    console.log(`View set to ${viewName}. Current theme: ${appState.selectedBrandId}`);
}

let isDragging = false;
let currentDialAngle = 0; // Store the raw angle for smoother dragging if needed

function getAngle(event, element) {
    const rect = element.getBoundingClientRect();
    // Adjust clientX/Y based on event type (mouse vs touch)
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);

    if (clientX === undefined || clientY === undefined) return 0;


    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    angle += 90; // Offset to make 0 degrees at the top
    if (angle < 0) {
        angle += 360; // Normalize to 0-360
    }
    return angle;
}

function handleDialMove(event) {
    if (!isDragging || !dial) return;
    event.preventDefault(); // Prevent scrolling on touch devices

    currentDialAngle = getAngle(event, dial);
    if (dialIndicator) dialIndicator.style.transform = `rotate(${currentDialAngle}deg)`;

    // Determine the closest brand
    const totalBrands = brands.length;
    const anglePerBrand = 360 / totalBrands;
    let closestBrandIndex = Math.round(currentDialAngle / anglePerBrand);
    if (closestBrandIndex >= totalBrands) { // Handle full circle wrap around
        closestBrandIndex = 0;
    }

    const selectedBrand = brands[closestBrandIndex];

    if (selectedBrand && selectedBrand.id !== appState.selectedBrandId) {
        appState.selectedBrandId = selectedBrand.id; // Update state
        applyTheme(selectedBrand.id); // Apply theme immediately
        if (currentBrandNameElement) currentBrandNameElement.textContent = selectedBrand.name;

        // Update active class on labels
        document.querySelectorAll('.brand-label').forEach(label => {
            label.classList.toggle('active', label.dataset.brandId === selectedBrand.id);
        });
    }
}

function stopDragging(event) {
    if (!isDragging) return;
    isDragging = false;
    document.removeEventListener('mousemove', handleDialMove);
    document.removeEventListener('mouseup', stopDragging);
    document.removeEventListener('touchmove', handleDialMove);
    document.removeEventListener('touchend', stopDragging);

    // Snap to the selected brand's precise angle after dragging stops
    const finalBrandIndex = brands.findIndex(b => b.id === appState.selectedBrandId);
    if (finalBrandIndex !== -1 && dialIndicator) {
        const finalAngle = (finalBrandIndex / brands.length) * 360;
        dialIndicator.style.transform = `rotate(${finalAngle}deg)`;
        // No need to call updateDialSelection here as theme and text already updated during drag
    }
    console.log("Dragging stopped. Final selection:", appState.selectedBrandId);
}

if (dial) {
    dial.addEventListener('mousedown', (event) => {
        isDragging = true;
        // Potentially update selection on mousedown if clicking on a brand label area
        // For now, mousedown just initiates drag
        document.addEventListener('mousemove', handleDialMove);
        document.addEventListener('mouseup', stopDragging);
    });

    dial.addEventListener('touchstart', (event) => {
        isDragging = true;
        // Call handleDialMove once to register the initial touch position and select
        handleDialMove(event);
        document.addEventListener('touchmove', handleDialMove, { passive: false });
        document.addEventListener('touchend', stopDragging);
    }, { passive: false });
}

if (previewThemeButton) {
    previewThemeButton.addEventListener('click', () => {
        // console.log(`Previewing theme: ${appState.selectedBrandId}`);
        // The glitch transition will be added in a later step.
        // For now, just switch the view.
        // switchView('preview');
        console.log(`Previewing theme: ${appState.selectedBrandId} with glitch`);
        const oldView = appState.currentView; // e.g., 'dial'
        // appState.selectedBrandId is already set by dial
        // No need to change appState.currentView here, triggerGlitchTransition will call setView
        triggerGlitchTransition('preview', oldView);
    });
}

// Initialize the application
// Inside init() or a separate function called by init()
function updateTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
}

function init() {
    // ... (updateTime, etc.)
    applyTheme(appState.selectedBrandId); // Apply default VSSkin theme

    // Directly set the initial view without glitch
    const initialViewName = appState.currentView;
    const initialViewElement = document.getElementById(initialViewName + 'View');
    if (initialViewElement) {
        if (initialViewName === 'dial') {
            initialViewElement.style.display = 'flex';
            // Ensure dial labels are populated if dial is the initial view and it's empty
            if (dial && dial.querySelectorAll('.brand-label').length === 0) {
                populateBrandLabels();
            }
            updateDialSelection(appState.selectedBrandId, false);
        } else if (initialViewName === 'preview') {
            initialViewElement.style.display = 'flex';
            loadPreviewContent(appState.selectedBrandId);
        }
    }
    console.log(`VSSkin App Initialized. View: ${initialViewName}, Theme: ${appState.selectedBrandId}`);
    updateTime();
    setInterval(updateTime, 60000);
}

// Text Scramble Effect
const SCRAMBLE_CHARS = '@#$*&%?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const SCRAMBLE_INTERVAL = 30; // ms between character changes
// const SCRAMBLE_DURATION = 200; // ms total scramble time before revealing original - will be randomized per element

function setupScrambleOnHover(element) {
    if (!element) return;
    const originalText = element.textContent;
    element.dataset.originalText = originalText; // Store it once

    element.addEventListener('mouseenter', () => {
        if (element.dataset.isScrambling === 'true') return;

        const currentOriginalText = element.dataset.originalText; // Use stored original text
        let iteration = 0;
        const scrambleDuration = 200 + Math.random() * 100; // 200-300ms
        const totalIterations = Math.floor(scrambleDuration / SCRAMBLE_INTERVAL);
        element.dataset.isScrambling = 'true';

        let intervalId = setInterval(() => {
            let newText = '';
            for (let i = 0; i < currentOriginalText.length; i++) {
                if (currentOriginalText[i] === ' ' || Math.random() < iteration / totalIterations) {
                    newText += currentOriginalText[i];
                } else {
                    newText += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                }
            }
            element.textContent = newText;

            if (iteration >= totalIterations) {
                clearInterval(intervalId);
                element.textContent = currentOriginalText; // Revert to original
                // Keep isScrambling true until mouseleave to prevent re-trigger
            }
            iteration++;
        }, SCRAMBLE_INTERVAL);
        element.dataset.scrambleIntervalId = intervalId.toString(); // Store to clear on mouseleave
    });

    element.addEventListener('mouseleave', () => {
        const intervalId = parseInt(element.dataset.scrambleIntervalId);
        if (!isNaN(intervalId)) {
            clearInterval(intervalId);
        }
        element.textContent = element.dataset.originalText; // Revert immediately
        element.dataset.isScrambling = 'false';
    });
}

// Apply to specific elements
const headerTitle = document.querySelector('#appHeader span');
const footerCopyright = document.querySelector('#appFooter span:first-child');
const footerTime = document.getElementById('currentTime');
const previewBtn = document.getElementById('previewThemeButton');
const installBtn = document.getElementById('installThemeLink'); // This is an <a>
// const closeBtn = document.getElementById('closePreviewButton'); // Not scrambling close X button

const tuneToLabelScrambleTarget = document.querySelector('.tune-to-text .scramble-target');


if (headerTitle) setupScrambleOnHover(headerTitle);
if (footerCopyright) setupScrambleOnHover(footerCopyright);
if (footerTime) setupScrambleOnHover(footerTime);
if (previewBtn) setupScrambleOnHover(previewBtn);
if (installBtn) setupScrambleOnHover(installBtn);
if (tuneToLabelScrambleTarget) setupScrambleOnHover(tuneToLabelScrambleTarget);


// Call init on DOMContentLoaded to ensure elements are available
document.addEventListener('DOMContentLoaded', init);
