# Blueprint AI UI v1.0 🚀

Transform Visual Studio Code into a powerful visual design environment with **Blueprint AI UI v1.0**. Built by **Team 21** 🎉, this extension leverages **React** ⚛️ and **AI** 🤖 to revolutionize how you create user interfaces. Enjoy an intuitive drag-and-drop workflow, AI-assisted layout generation, and seamless integration with VS Code—making front-end development faster, smarter, and more enjoyable!

## Table of Contents 📚

1. [Key Features](#key-features)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Usage Guide](#usage-guide)
   - Home Page
   - First Page Creator
   - Main Interface
   - Droppable CraftJS Canvas
   - Properties Sidebar
   - Component Sidebar
   - Layout Sidebar
   - Pages Sidebar
   - Main Left Toolbar
   - Export Menu
5. [Roadmap & TODO](#roadmap--todo)
6. [Team 21](#team-21)
7. [License](#license)

---

## Key Features ⭐

- **AI Layout Generation** 🤖  
  Generate entire layouts from text descriptions or screenshots using GPT-4 and DALL-E 3.

- **Visual Drag-and-Drop Editor** 🖱️  
  Powered by **React** and **CraftJS**, build UIs with a familiar, fun, and intuitive interface.

- **Rich Component Library** 🎨  
  A suite of **FluentUI** components to quickly assemble beautiful, production-ready pages.

- **Responsive Design** 📱  
  Built-in support for responsiveness with **React Grid Layout**.

- **Code Export** 💻  
  Generate clean and well-structured HTML, CSS, and JavaScript that you can plug directly into your projects.

- **State Management** 🔄  
  Save and load your designs as JSON node trees, making it easy to version-control and collaborate.

- **VS Code Integration** ⚡  
  Enjoy a seamless workflow right inside your favorite IDE—no need to switch between tools.

---

## Installation 🔧

1. **Clone the repository**  
   Open a terminal and run:

   ```
   git clone https://github.com/snaker938/vscode-blueprint-ai
   cd vscode-blueprint-ai
   ```

2. **Install dependencies**  
   Install all necessary dependencies:

   ```
   npm run install:all
   ```

3. **Build the extension**  
   Compile and prepare the webview:
   ```
   npm run compile
   npm run build:webview
   ```

## Quick Start 🚀

1. **Open in VS Code**  
   Open the cloned folder in Visual Studio Code.

2. **Launch the extension**  
   Press `F5` to start debugging. This will launch a new instance of VS Code with the **Blueprint AI UI** extension loaded.

3. **Start Designing**  
   Go to the **Blueprint AI** panel (usually in the Activity Bar on the left) and begin creating your pages with AI assistance or from scratch.

---

## Usage Guide 🎯

### Home Page 🏠

- **Welcome to Blueprint AI**  
  Upon opening the extension in the debug VS Code instance, you’ll be greeted by a cheerful Home Page.

- **Start Creating Button**  
  Click on **Start Creating** to begin your design journey. _(TODO: Enhance this to be more visually appealing and welcoming)_

### First Page Creator ✨

- **Convert a Design from Text**  
  Provide a text description (e.g., 'A landing page with a hero section, a signup button, and a feature grid').

- **Convert a Screenshot to Design**  
  Optionally upload an image for the AI to interpret and generate a similar layout.

- **Auto-completed Suggestions**  
  Similar to ChatGPT, the system offers real-time suggestions for layout ideas and component usage.

- **Multiple Design Options**  
  The AI can propose multiple layout variations—pick one that best suits your needs.

- **Design Themes**  
  Choose from different overarching design themes (e.g., minimalistic, corporate, playful, etc.).

- **Quality-of-Life Features**
  - Easy file uploads 📁
  - Intelligent prompts 🤓
  - Quick toggles for theme choices 🔀

### Main Interface 🎨

Once you’ve created (or selected) a page, you’ll be taken to the Main Interface:

#### Droppable CraftJS Canvas 🖼️

- **Page Name**  
  A clear label at the top indicates which page you’re editing.
- **Drag & Drop Components**  
  Easily place components onto the page with your mouse.
- **Selection Indicators**  
  Hover over a component to see a border with icons for moving, hiding, or deleting.

#### Properties Sidebar 📑

- **Expandable/Collapsible**  
  Show or hide the sidebar as needed.
- **Dynamic Properties**  
  When a component is selected, display relevant props for easy configuration (like text, styles, events).
- **AI Iterative Chat Menu**
  - Chat with AI for more in-depth edits 💬
  - Reference multiple elements by selecting them and instructing adjustments collectively.
  - Upvote or downvote AI suggestions and regenerate them if needed.
  - Apply changes instantly to the canvas.

#### Component Sidebar 🧩

- **Search Bar**  
  Quickly filter through FluentUI and custom components by name.
- **Draggable Components**  
  Drag essential web elements onto the canvas, such as text fields, buttons, images, or even entire sections.

#### Layout Sidebar 📏

- **Layout Controls**  
  Adjust rows, columns, alignment, visible grid, gap size, padding, margin, etc.
- **Layers Section**
  - View a hierarchical list of all components on the canvas.
  - Expand/collapse components with child elements.
  - Rename, show/hide, or delete components from this layer tree.
  - Hover or click to highlight components on the canvas.

#### Pages Sidebar 📜

- **Default Page 1**  
  Start with a single page and add as many pages as you need.
- **Page List & Previews**  
  Quickly view thumbnail previews of each page.
- **Page Management**
  - Rename or delete a page.
  - Create new pages.
  - Refresh page contents.
  - Bulk refresh/delete.

#### Main Left Toolbar 🛠️

- **Undo/Redo**  
  Quickly revert or reapply your changes.
- **Save Locally**  
  Save your current design state to your local machine.
- **Upload/Download**  
  Load previously saved designs or download the current design as a JSON file.
- **Export**  
  Generate production-ready HTML, CSS, and JS for your entire project or selected pages.

#### Export Menu 📤

_(Planned Features:)_

- **Choose Export Folder**  
  Specify where the generated code should go.
- **Select Pages**  
  Export all pages or just specific ones.
- **Export Summary**  
  View total size, number of files, lines of code, and estimated export time.
- **Standard HTML/CSS/JS**
  - Optionally include minimal animations and unit tests.
  - Fully commented code for better readability.
- **.NET or Cross-Platform**  
  Future export modes for .NET and other frameworks are on the horizon.

---

## Roadmap & TODO 🗺️

- **Collaboration Mode**: Real-time co-editing and sharing of projects via link.
- **Enhanced Home Page**: Make the introduction screen more welcoming and engaging.
- **AI-Enhanced Iterations**: Deepen integration with GPT-4 for more complex layout logic.
- **Export Menu Improvements**: Support advanced export options like .NET, React Native, or other cross-platform frameworks.
- **Automated Testing**: Automatically generate unit tests and snapshot tests for exported pages.

---

## Team 21 👥

- Joshua Mendel
- Simran Goel
- Joshua Soh
- Gideon Zeru

---

## License 📜

This project is released under the MIT License. You're free to use, modify, and distribute this software as you see fit, provided you include the original license.

Thank you for using **Blueprint AI UI v1.0**! We're excited to see what you'll build! 🎈
