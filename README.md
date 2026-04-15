![CI/CD workflow](https://github.com/TzolkinB/loop-playwright/actions/workflows/playwright.yml/badge.svg)

# Loop Playwright

A test-only repository for Playwright end-to-end testing with comprehensive tooling setup.
Optimized for scalability, it uses data-driven methods like POM, JSON, and TypeScript types (interfaces and enums).

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

## Project Structure

This test-suite has a `pages` folder for POM, which is popular in Playwright, a `data` folder for JSON, and `types` for Typescript typing

```
├── tests/                 # Playwright test files
│   ├── taskBoard.spec.ts  # Web and Mobile task board tests
│   ├── login.spec.ts      # Login tests
│   └── auth.setup.ts      # Authentication setup
├── pages/                 # Page Object Model
│   └── TaskBoardPage.ts   # Task board locators and methods
├── data/                  # Test data (JSON scenarios)
│   ├── taskBoardScenarios.json
│   ├── loginScenarios.json
├── types/                 # TypeScript type definitions
│   ├── taskBoard.ts       # TaskBoardTypes interface and enums
│   └── login.ts           # LoginTypes interface
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
   - `taskBoardScenarios.json` - Web and Mobile app task board test cases
   - `loginScenarios.json` - Login test cases

2. **Type Safety** (`types/` folder) — TypeScript interfaces and enums enforce valid data shapes and values
   - `LoginTypes` interface — validates login JSON structure
   - `AppType` enum — restricts app headings to valid values
   - `ColumnName` enum — restricts columns to To Do, In Progress, Done
   - `TagName` enum — restricts tags to valid values

3. **Page Objects** (`pages/` folder) — reusable locator methods
   - Methods accept column names and task titles from data
   - No hardcoded selectors in tests

### Adding New Test Scenarios

1. Edit a data file (`data/taskBoardScenarios.json` or `data/loginScenarios.json`).
2. For taskBoardScenarios, add a new object under scenarios with: appType, requiresNavigation, taskTitle, tags, column, and taskCount.
3. Run tests. New task board scenarios are picked up automatically by the `forEach` loop.

**Example task board scenario:**

```json
{
  "appType": "Web Application",
  "requiresNavigation": false,
  "taskTitle": "New Task",
  "tags": ["Feature"],
  "column": "To Do",
  "taskCount": 3
}
```

No test code changes needed — data drives everything.

## Configurations

This project loads environment variables from .env using dotenv in Playwright config.

### Global Test Settings

- **Browsers:** Chromium, Firefox, and Webkit
- **Retries:** 2 on CI, 0 locally
- **Reporter:** HTML report

### Projects

1. setup

- testMatch: any file ending with .setup.ts
- Purpose: prepares authenticated state before dependent browser projects

2. login-tests

- testMatch: login.spec.ts
- Browser/device: Desktop Chrome
- Runs independently without stored authentication state

3. chromium (Same for firefox & webkit)

- testIgnore: login.spec.ts
- Browser/device: Desktop (Chrome/Firefox/Safari)
- storageState: AUTH_FILE environment variable
  dependencies: setup

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

## Github Actions Workflow

- Triggered on master, PR to master, and manually
- Runs linting and formatting before the tests are run.
- Reporting: Playwright report artifact is uploaded on test failure, or on master branch runs
- Deploy job runs on master and publishes the report artifact to Github Pages
