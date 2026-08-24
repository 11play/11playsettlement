# 11Play Weekly Settlement System

A lightweight web-based weekly settlement management system built with HTML, CSS, and JavaScript.

---

## Overview

**11Play Weekly Settlement System** is a browser-based financial settlement management application designed to manage weekly withdrawal records, profit tracking, distribution calculation, settlement history, official memo generation, and backup management.

The system works completely on the client side using browser LocalStorage.

---

## Features

### Settlement Management

- Create new weekly settlement
- Custom settlement date range
- Unique settlement ID generation
- Active settlement tracking
- Finalize settlement permanently


### Site Entry Management

- Add site withdrawal entries
- Update site information
- Delete active settlement entries
- Automatic profit status calculation


### Financial Calculation

Automatic calculation of:

- Total withdrawal
- Total sites
- Profit sites

Distribution:

- Engineering Cost — 20%
- Promotion Cost — 20%
- Remaining Distribution — 60%

Personal distribution:

- মো সেলিম
- মোহাম্মদ ফরিদ
- রফিকুল ইসলাম


### Settlement History

- View previous settlements
- Search settlement records
- Filter by status
- Print finalized settlements


### Official Print Memo

Generate professional settlement documents containing:

- Settlement information
- Site summary
- Financial summary
- Distribution details
- Signature section
- Official watermark


### Backup & Restore

- Export complete backup as JSON
- Import previous backup
- Automatic safety backup
- Restore application data


---

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser LocalStorage
- GitHub Pages


---

## Project Structure

```
.
├── index.html
│
├── assets
│
│   ├── css
│   │   └── style.css
│   │
│   ├── js
│   │   ├── app.js
│   │   ├── backup.js
│   │   ├── calculation.js
│   │   ├── history.js
│   │   ├── print.js
│   │   ├── settlement.js
│   │   └── storage.js
│   │
│   └── images
│       ├── 11play-logo.png
│       └── 11play-logo-watermark.png
│
└── README.md
```

---

## Deployment

This project is deployed using **GitHub Pages**.

Deployment process:

1. Upload all project files to GitHub repository.
2. Keep `index.html` in the repository root.
3. Enable GitHub Pages.
4. Select:

```
Settings
→ Pages
→ Source
→ GitHub Actions
```

After every push to the main branch, the website will be automatically deployed.

---

## GitHub Actions

Deployment workflow location:

```
.github/workflows/deploy.yml
```

The workflow automatically:

- Checks out repository
- Builds GitHub Pages package
- Publishes the website


---

## Data Storage

This application does not require:

- Database
- Backend server
- API

All application data is stored locally in:

```
Browser LocalStorage
```

---

## Browser Support

Recommended browsers:

- Google Chrome
- Microsoft Edge
- Firefox
- Safari


---

## Version

```
11Play Weekly Settlement v1.0
```

---

## License

Private Project

© 11PlayPlay
