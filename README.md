# Loop Playwright

A test-only repository for Playwright end-to-end testing with comprehensive tooling setup.

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
├── playwright.config.ts   # Playwright configuration
├── eslint.config.mts     # ESLint configuration
├── tsconfig.json         # TypeScript configuration
├── .prettierrc           # Prettier configuration
└── package.json          # Project dependencies and scripts
```
