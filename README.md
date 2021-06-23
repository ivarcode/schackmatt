# schackmatt

This is a website for creating chess training tools. The dev site is live, the production site is yet to come.

Dev: https://schackmatt.net/

### Developers

#### Setup & Getting Started

-   Fork repo to your account or organization
-   Clone repository to your machine
-   Install node https://nodejs.org/en/download/
-   Install python https://www.python.org/downloads/ to use `.py` scripts in this project
    -   Be sure to add python to the path on Windows so you can run commands from the command line (check the box "Add python _version_ to PATH" in the installer)
-   Note: some scripts in this project are `.sh` executables, you will need to be in a terminal that supports this if you are developing on Windows (eg. git bash).
-   Navigate to the clone repo root in your preferred terminal; eg. `cd ~./git/schackmatt`
-   Run `npm i` to install necessary packages (this might take some time)
    -   Run `npm i -g @angular/cli` for Angular CLI (optional)
-   Run `npm audit` to ensure no critical vulnerabilities (this will make changes to `package.json` and `package-lock.json`)
    -   Run `npm audit fix` if there are any, this should usually resolve those vulnerabilities
    -   If not, please open an issue and request my (@ivarcode's) assistance - sometimes dependency upon a backdated package can conflict with requirements for newer releases of packages it might require

#### To start the local server

If you use Angular CLI

`ng serve`

If you don't...

`npm run start`

Should be on localhost:4200/

#### To build out to `dist/`

`npm run build`

-   Run `npm run build-watch` to build and then rebuild the project to the output folder when relevant files are modified
-   Run `npm run build-prod` to build on a production machine (_Windows batch script_ that moves relevant web configuration files after normal build process)

#### To set the upstream (might exist by default)

`git remote add upstream <URL HERE>`

#### To merge upstream code with your branch (for example develop)

`git checkout develop`
`git fetch upstream`
`git merge upstream/develop`

#### General standard for branch names (please follow this if you want to spare me a headache)

`issue-#-some-basic-descriptive-phrase`

#### [General standard for formatting](https://github.com/ivarcode/schackmatt/blob/develop/JAVASCRIPT_GUIDELINES.md)

### Python Scripts

The only current python script `parseLichessPGNFile.py` is used to convert `.pgn` files downloaded from [Lichess](https://lichess.org/) into `.json` files to be used by the web application.

On Windows with python in the PATH (see above python instructions), you can invoke that script with `parseLichessPGNFile.py <target_filepath> <output_filepath>` (with Mac or Unix you might need to include `python` first to indicate that you are running a python script).

eg. `parseLichessPGNFile.py data/example_games.pgn data/parsed_games.json`

### Versioning

#### [Changelog](https://github.com/ivarcode/schackmatt/blob/develop/CHANGELOG.md)

Contains information about each version of the code.

#### To bump package version

`git checkout develop`

Run `bump.sh` with the necessary argument `[ major | minor | patch ]` to bump a version.

`bash bump.sh major`
`bash bump.sh minor`
`bash bump.sh patch`

Write a description of the new version when prompted. The single line of text you enter will be written to `CHANGELOG.md` for a record of what the version changed in the code.

### Deployment

#### Setup

The existing deployment script/s expect the `cwagner0` ssh private key to live `../../sshkeys/` in relation to this repository. The scripts can be edited to change that expectation but for the time being (until we need multiple people to hold deployment ssh keys) this documentation is strictly for me.

Deployment configuration is expected to live in this file `conf/deploymentConfig.json`. The entire `conf/` directory is in `.gitignore` so it will not come down with your clone. If need be, create this file and fill it with the following:

```
{
    "devServerIP": "ec2-user@{{ IP ADDRESS HERE }}",
    "prodServerIP": "ec2-user@{{ IP ADDRESS HERE }}"
}
```

#### Dev Server

Build the project using `npm run build` to generate the latest version of the code into `dist/`.

Run `bash deploy-dev.sh` to move the old files from the development server to a separate backup directory on the host, and replace those files with the current `dist/` build.

#### Production Server

Build the project using `npm run build` to generate the latest version of the code into `dist/`. _Soon we will have a build-prod script that does meaningful things... (more about this soon)._

Run `bash deploy-prod.sh` to move the old files from the production server to a separate backup directory on the host, and replace those files with the current `dist/` build.

### [Developer Discord Server](https://discord.gg/uruXya4)

Please submit bugs or feature requests in detailed issues.

More will be added to the readme when instructions and details about the site are written up.

### - CIW
