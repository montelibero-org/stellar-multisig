# Contributing Guidelines

First off, thanks for taking the time to contribute!

Please read through our [Architecture Overview](ARCHITECTURE.md) and [Installation Instructions](INSTALL.md).

## Getting Started

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the core team before making a change.

- Make sure you have a [GitHub account](https://github.com/login).
- Submit a GitHub issue for your issue if one does not already exist.
  - A issue is not necessary for trivial changes.
- [Fork](https://help.github.com/en/articles/working-with-forks) the repository on GitHub.
    - [Configuring a remote for a fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork)
    - [Syncing a fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork)
      - `git fetch upstream`
      - `git checkout main`
      - `git merge upstream/main`
    - [Merging an upstream repository into your fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/merging-an-upstream-repository-into-your-fork)
      - `git checkout main`
      - `git pull upstream main`
      - Commit the merge
      - `git push origin main`
- When working on an issue, create a new branch from `main` named for issue number or custom name. Name the branch `issue/<issue-number>` or `issue/<custom-name>`. For example `issue/22` for fixing issue #22.
- Make your changes.
  - Follow the [Style Guides](#style-guides).
  - [Avoid platform-dependent code](https://flight-manual.atom.io/hacking-atom/sections/cross-platform-compatibility/).
  - Add tests if your changes contains new, testable behavior.
  - Make the tests pass.
- Create a [pull request](https://help.github.com/en/articles/creating-a-pull-request-from-a-fork) to the repository.

### Tips and tricks for using the Git

- [GitHub Cheat Sheet](https://github.com/tiimgreen/github-cheat-sheet)
- [git-tips](https://github.com/git-tips/tips)

### Key branches

- `main` is the latest, deployed version

## Cloud AI Code Helpers

- https://chatgpt.com
- https://gemini.google.com
- https://claude.ai
- https://chat.reka.ai
- https://www.perplexity.ai

## Style Guides

### Git Commit Messages

- Include an issue number to the beginning of the first line (if applicable). Example `#234 YOUR_COMMIT_NAME`.
- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
- In case changing only texts or documentations include `[ci skip]` to the end of the first line.
- Limit the first line to 72 characters or less.
- Reference issues and pull requests liberally after the first line.

### Documentation Style Guide

All `*.md` files must adhere to [Markdown Syntax](https://www.markdownguide.org/basic-syntax/).

### JavaScript Style Guide

JavaScript Code MUST adhere to [JavaScript Standard Style](https://standardjs.com).

Recommended IDE:
  - [VS Code](https://code.visualstudio.com)
    - [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
  - [Cursor](https://cursor.sh)
  - [Project IDX](https://idx.google.com)
  - [PhpStorm](https://www.jetbrains.com/phpstorm/)
  - [Eclipse](https://www.eclipse.org)
  - [Sublime Text](https://www.sublimetext.com)

- Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
- Inline `export`s with expressions whenever possible

```javascript
  // Use this:
  export default class ClassName {

  }

  // Instead of:
  class ClassName {

  }
  export default ClassName
```
