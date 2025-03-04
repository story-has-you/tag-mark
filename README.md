# Tag Mark

<div align="center">

![Tag Mark Logo](https://story-has-you.github.io/tag-mark/images/icon.png?text=TagMark)

**Seamlessly organize bookmarks with nested tags and custom hotkeys.**

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-green)](https://chrome.google.com/webstore)
</div>

## 🌟 Overview

Tag Mark is a Chrome extension that redefines bookmark management by breaking free from traditional folder structures. Instead, it uses a powerful nested tag system, allowing you to organize your bookmarks in a more flexible and intuitive way.

## ✨ Key Features

- **Nested Tag System**: Create multi-level tag hierarchies like `#Research/AI/DeepLearning` to organize bookmarks across multiple categories
- **Smart Bookmark Management**: Modern interface for easy browsing, editing, and managing all your bookmarks
- **Keyboard Shortcuts**: Boost productivity with customizable keyboard shortcuts
- **Dark/Light Mode**: Automatically adapts to your system preferences for comfortable viewing
- **Advanced Search**: Quickly find what you need by searching both bookmarks and tags
- **Data Backup & Export**: Securely export and import your tag structures and bookmark associations

## 🖥️ Screenshots

<div align="center">
  <img src="https://story-has-you.github.io/tag-mark/images/screenshot.png?text=Tag+Mark+Screenshot" alt="Tag Mark Interface" width="800px" />
</div>

## 🚀 Getting Started

### Installation

1. Install the extension from the [Chrome Web Store](https://chrome.google.com/webstore)
2. Click on the Tag Mark icon in your browser toolbar to open the main interface

### Quick Usage Guide

1. **Create Tags**: Navigate to the "Tag Management" tab to create your first tag structure
2. **Link Bookmarks**: In the "Bookmark Management" tab, right-click on any bookmark to add tags
3. **Search**: Use the search function (`Ctrl+K` or `⌘+K`) to quickly find bookmarks or tags
4. **Keyboard Shortcuts**: Speed up your workflow with built-in shortcuts

## 💡 Use Cases

- **Academic Research**: Organize papers, tools, and references with multi-level tags
- **Project Management**: Create separate tag structures for different projects
- **Learning Resources**: Structure learning materials from beginner to advanced with graduated tag hierarchies

## 🔧 Development

Tag Mark is built with React and TypeScript using the [Plasmo framework](https://docs.plasmo.com/) for browser extension development.

### Local Development

```bash
# Clone the repository
git clone https://github.com/story-has-you/tag-mark.git
cd tag-mark

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The development build will be available in `build/chrome-mv3-dev`.

### Building for Production

```bash
pnpm build
```

The production bundle will be created in the `build` directory, ready for distribution.

## 🏗️ Project Structure

```
src/
├── components/      # UI components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── services/        # Core services for data handling
├── store/           # State management
├── styles/          # Global styles
└── types/           # TypeScript type definitions
```

## 🔒 Privacy

Tag Mark prioritizes your privacy. All bookmark data, tag structures, and associations are stored locally in your browser. We don't collect, store, or transmit any personal data to external servers.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License, Version 2.0 - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Plasmo](https://www.plasmo.com/) - The browser extension framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Lucide Icons](https://lucide.dev/) - Icon library
- All our contributors and users

---

<div align="center">
  <p>Made with ❤️ by Tag Mark Team</p>
  <p>© 2025 Tag Mark</p>
</div>
