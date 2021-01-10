# schackmatt

This is a website for creating chess training tools. The dev site is live, the production site is yet to come.

Dev: https://schackmatt.net/

### Developers:

-   fork repo to your account or organization
-   clone repository to your machine
-   install node https://nodejs.org/en/download/
-   navigate to the clone repo root in your preferred terminal; eg. `cd ~./git/schackmatt`
-   run `npm i` to install necessary packages (this might take some time)
-   if you use Angular CLI
    -   run `ng build`
        -   run `ng build-watch` to build and then rebuild the project to the output folder when relevant files are modified
        -   run `ng build-prod` to build on a production machine (moves relevant web configuration files after normal build process)
    -   run `ng serve`
-   if you don't...
    -   run `npm run start`
-   should be on localhost:4200/

### To set the upstream (might exist by default):

`git remote add upstream <URL HERE>`

### To merge upstream code with your branch (for example develop):

`git checkout develop`
`git fetch upstream`
`git merge upstream/develop`

### Versioning

## [Changelog](https://github.com/ivarcode/schackmatt/blob/develop/CHANGELOG.md)

Contains information about each version of the code.

## To bump package version

`git checkout develop`

Run the respective shell script to bump a version `[ major | minor | patch ]`

`sh bump-major.sh`
`sh bump-minor.sh`
`sh bump-patch.sh`

Write a description of the new version when prompted. The single line of text you enter will be written to `CHANGELOG.md` for a record of what the version changed in the code.

Note: these scripts are shell executables, you will need to be in a terminal that supports this if you are developing on Windows (eg. git bash).

### General standard for branch names (please follow this if you want to spare me a headache)

`issue-#-some-basic-descriptive-phrase`

### [General standard for formatting](https://github.com/ivarcode/schackmatt/blob/develop/JAVASCRIPT_GUIDELINES.md)

### Developer Discord Server: https://discord.gg/uruXya4

Please submit bugs or feature requests in detailed issues.

More will be added to the readme when instructions and details about the site are written up.

### - CIW
