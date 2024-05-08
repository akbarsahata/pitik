# Farm Management System

This repo contains the source code for Pitik's Farm Management System. :)

## Setup

1. Create a new `.env` file in the root of this project;
2. Put value just like in the [`.env.example`](./.env.example) file with the following notes:

   - No spaces between equal sign `=`
   - Not using double-quote sign (`"`)
   - URL variable start with HTTP/S and **DOESN'T** end with forward-slash sign (`/`)

   Example:

   ```bash
   BASE_URL_V2=https://api.example.com/v2
   ENCRYPTION_KEY=abcd1234
   ```

3. Install dependencies
   ```bash
   yarn
   ```
4. Run/build

   ```bash
   yarn dev # In development

   yarn build && yarn start # To build and start in your local machine
   ```

## Our Development Process

All changes happen through pull requests. Pull requests are the best way to propose changes. We actively welcome your pull requests and invite you to submit pull requests directly [here](https://github.com/Pitik-Digital-Indonesia/fms), and after review, these can be merged into the project.

## Branch Name Conventions

Create a new branch from the `development` branch (or `master` branch if you are doing some hotfixes on production), and please name your branch as `username/JIRA-ID` (e.g. `endrial/FE-123`).

## Using the Project's Standard Commit Messages

This project is using the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) standard. Please follow these steps to ensure your
commit messages are standardized:

1. Run `yarn` to install all the dependencies.
2. Stage the files you are committing with `git add [files]`.
3. Run `yarn commit` (_not_ `git commit`). This will start an interactive prompt that generates your commit message:
   1. Select the type of change.
   2. Type the scope. This is either `global` for project-wide changes or one of the packages, functions, pages, or anything else.
   3. Write a short, imperative tense description of the change.
   4. If the above was not sufficient, you may now write a longer description of your change (otherwise press enter to leave blank).
   5. `y` or `n` for whether there are any breaking changes (e.g. changing the props of a component, changing the JSON structure of an API response).
   6. `y` or `n` for whether this change affects or related to an open issue or JIRA card, if positive you will be prompted to enter the issue/JIRA card number.
4. Your commit message has now been created, you may push to your fork and open a pull request (read below for further instructions).

## Pull Requests

1. Make sure the branch name are following this [guide](#branch-name-conventions) properly.
2. If you've added code that should be tested, add some test examples.
3. Ensure to describe your pull request.

## Licenses

(c) 2022-present PT Pitik Digital Indonesia. All rights reserved.
