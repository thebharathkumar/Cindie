# Cindie - Creative Business Toolkit 🎨

A beautiful, modern business management application designed specifically for creative entrepreneurs, artists, and makers. Built with React, TypeScript, and Tailwind CSS with an Apple-inspired aesthetic.

## Features

### 🎨 Branding Helper
- **Brand Colors Library** - Save and manage your brand's hex codes
- **Brand Fonts Library** - Track approved fonts for consistent design
- **Moodboard** - Collect inspiration images organized by product line
- **Template Generator** - Create consistent product labels, thank-you cards, price tags, and packaging mockups

### 🖼️ Art Commission Tracker
- Complete commission management system
- Built-in calendar view with automatic deadline tracking
- Track client info, pricing, payment status, and usage rights
- Revision round management
- Portfolio auto-saver for completed work
- Smart notifications for upcoming deadlines

### 🎪 Craft Fair & Market Dashboard
- Event calendar with automatic reminders
- Booth fee tracking
- Customizable checklists for each event
- Timeline view with color-coded deadlines

### 📦 Product & Inventory Manager
- Track journals, candles, cards, prints, stickers, and more
- Automatic price suggestions based on materials + time + markup
- Inventory alerts for low stock items
- Best seller identification
- Sales trend graphs

### 💳 Sales Tracker + POS
- Quick sale recording with automatic calculations
- Tax calculation support
- Multiple payment methods (cash, card, digital)
- Link sales to craft fairs and customers
- Revenue dashboards and charts
- CSV export for bookkeeping

### 👥 Customer Directory
- Build and manage customer relationships
- Track preferences and purchase history
- Quick email collection at craft fairs
- Export to Mailchimp or Google Sheets compatible CSV

### 💰 Finance & Tax Basics
- Income and expense tracking
- Automatic profit calculations
- Monthly and yearly financial summaries
- Quarterly tax reminders
- Categorized expense tracking
- Year-end tax summary

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **State Management**: Zustand
- **Database**: Dexie.js (IndexedDB)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Cindie
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── layout/         # Layout components (Sidebar, etc.)
│   ├── branding/       # Branding module components
│   ├── commissions/    # Commission tracker components
│   ├── craftfairs/     # Craft fair components
│   ├── products/       # Product management components
│   ├── sales/          # Sales tracking components
│   ├── customers/      # Customer management components
│   └── finance/        # Finance tracking components
├── pages/              # Page components
├── lib/                # Libraries and utilities
│   └── db.ts          # Dexie database configuration
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
├── styles/             # Global styles
└── App.tsx            # Main app component
```

## Features in Detail

### Data Storage
All data is stored locally in your browser using IndexedDB, ensuring:
- Complete privacy - your data never leaves your device
- Works offline
- Fast performance
- No subscription fees

### Design Philosophy
The interface follows Apple's design principles:
- Clean, minimalist layouts
- Smooth animations and transitions
- Spacious whitespace
- Beautiful gradients and color schemes
- Glass morphism effects
- Intuitive navigation

### Customization
- Adjust markup factor for pricing calculations
- Set your tax rate for sales
- Customize currency display
- Light/dark theme support (coming soon)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

This project is currently in development. Contributions, issues, and feature requests are welcome!

## License

MIT

## Acknowledgments

Built with ❤️ for creative entrepreneurs who need powerful tools without the complexity.
