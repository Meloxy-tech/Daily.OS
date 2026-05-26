# Contributing to DailyOS

Thank you for your interest in contributing.

## Development setup

```bash
git clone <your-fork-url>
cd dailyos
npm install
cp .env.example .env.local
npm run dev
```

## Before opening a PR

1. Run `npm run lint`
2. Run `npm run build`
3. Keep changes focused — avoid drive-by refactors
4. Match existing code style and component patterns

## Pull request guidelines

- Use a clear title and description
- Link related issues when applicable
- Include screenshots for UI changes
- Note any new environment variables in the PR description

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
