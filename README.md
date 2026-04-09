![CI/CD workflow](https://github.com/TzolkinB/loop-playwright/actions/workflows/playwright.yml/badge.svg)

# Loop Playwright

A test-only repository for Playwright end-to-end testing with comprehensive tooling setup.
Optimized for scalability, it uses data-driven methods like POM, JSON, and TypeScript (enums).

## Tools Used

This project uses the following tools for development and testing:

- **[Playwright](https://playwright.dev/)** - End-to-end testing framework for web applications
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript with static type checking
- **[ESLint](https://eslint.org/)** - Code linting and static analysis for JavaScript/TypeScript
- **[Prettier](https://prettier.io/)** - Opinionated code formatter for consistent code style
- **[Husky](https://typicode.github.io/husky/)** - Git hooks to enforce quality checks before commits
- **[lint-staged](https://github.com/okonet/lint-staged)** - Run linters on staged files in git

## Available Scripts

### Testing Scripts

| Script                | Command                   | Description                                     |
| --------------------- | ------------------------- | ----------------------------------------------- |
| `npm test`            | `playwright test`         | Run all Playwright tests in headless mode       |
| `npm run test:ui`     | `playwright test --ui`    | Run tests with Playwright's interactive UI mode |
| `npm run test:debug`  | `playwright test --debug` | Run tests in debug mode with browser DevTools   |
| `npm run test:report` | `playwright show-report`  | Open the HTML test report from the last run     |

### Code Quality Scripts

| Script                 | Command              | Description                                                |
| ---------------------- | -------------------- | ---------------------------------------------------------- |
| `npm run lint`         | `eslint .`           | Check code for linting errors and style issues             |
| `npm run format`       | `prettier --write .` | Format all code files using Prettier                       |
| `npm run format:check` | `prettier --check .` | Check if code is properly formatted without changing files |
| `npm run type-check`   | `tsc --noEmit`       | Run TypeScript compiler to check for type errors           |

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Install Playwright browsers:**

   ```bash
   npx playwright install
   ```

3. **Run tests:**

   ```bash
   npm test
   ```

4. **View test results:**
   ```bash
   npm run test:report
   ```

## Pre-commit Hooks

This project uses Husky and lint-staged to automatically:

- Format code with Prettier
- Run ESLint checks
- Ensure code quality before commits

The hooks run automatically when you commit changes. If any checks fail, the commit will be blocked until issues are resolved.

## Project Structure

```
├── tests/                 # Playwright test files
│   ├── webApp.spec.ts     # Web task board tests
│   ├── mobileApp.spec.ts  # Mobile task board tests
│   ├── login.spec.ts      # Login tests
│   └── auth.setup.ts      # Authentication setup
├── pages/                 # Page Object Model
│   └── TaskBoardPage.ts   # Task board locators and methods
├── data/                  # Test data (JSON scenarios)
│   ├── webTaskBoard.json
│   ├── mobileTaskBoard.json
│   └── login.json
├── types/                 # TypeScript type definitions and enums
│   ├── testData.ts        # ColumnName, TagName enums
│   └── loginData.ts       # LoginConstants interface
├── .prettierrc            # Prettier configuration
├── .prettierignore        # Prettier ignore patterns
├── .gitignore             # Git ignore rules
├── playwright.config.ts   # Playwright configuration
├── eslint.config.mts      # ESLint configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Data-Driven Testing Architecture

This project uses a scalable, type-safe data-driven testing approach to minimize code duplication and improve maintainability.

### How It Works

1. **Test Data** (`data/` folder) — JSON files define test scenarios
   - `webTaskBoard.json` - Web app task board test cases
   - `mobileTaskBoard.json` - Mobile app task board test cases
   - `login.json` - Login UI constants

2. **Type Safety** (`types/` folder) — TypeScript enums enforce valid values
   - `ColumnName` enum — restricts columns to "To Do", "In Progress", "Done"
   - `TagName` enum — restricts tags to valid values
   - Enums define allowed values in TypeScript usage

3. **Page Objects** (`pages/` folder) — reusable locator methods
   - Methods accept column names and task titles from data
   - No hardcoded selectors in tests

### Adding New Test Scenarios

1. Edit a data file (`data/webTaskBoard.json` or `data/mobileTaskBoard.json`)
2. Add a new task object with column, title, tags, and taskCount
3. Run tests — the new scenario runs automatically via `forEach` loop

**Example:**

```json
{
  "testName": "should display 'New Task' in 'To Do' column with tags",
  "taskTitle": "New Task",
  "tags": ["Feature"],
  "column": "To Do",
  "taskCount": 3
}
```

No test code changes needed — data drives everything.
