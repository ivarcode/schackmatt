# arg declaration in
args=("$@")
# must be one arg
if [ ${#args[@]} == 1 ]
then
    # must be major, minor, or patch
    bumpType=${args[$1]}
    if [ $bumpType == "major" -o $bumpType == "minor" -o $bumpType == "patch" ]
    then
        echo "Bumping a $bumpType version..."
    else
        echo "Error arg[0]: version bump type != [ major | minor | patch ]"
        echo "Aborting."
        # exit unhappily
        exit 1
    fi
else
    echo "One argument required: version bump type = [ major | minor | patch ]"
    echo "Aborting."
    # exit unhappily
    exit 1
fi
# getting log notes
echo -n "Enter version log/notes: "
read VerDesc
# soft version bump with no commit tag
npm --no-git-tag-version version $bumpType
# construct CHANGELOG entry
git log -1 > LAST_COMMIT.txt
sed -n 3p package.json > vertext.md
sed -i 's/    \"version\": \"//g' vertext.md
sed -i 's/\",//g' vertext.md
verval=`cat vertext.md`
cat CHANGELOG.md > old_changelog.md
echo -n "### " > CHANGELOG.md
cat vertext.md >> CHANGELOG.md
echo "" >> CHANGELOG.md
sed -n 1p LAST_COMMIT.txt >> CHANGELOG.md
echo "" >> CHANGELOG.md
sed -n 3p LAST_COMMIT.txt >> CHANGELOG.md
echo "" >> CHANGELOG.md
echo "    $VerDesc" >> CHANGELOG.md
echo "" >> CHANGELOG.md
cat old_changelog.md >> CHANGELOG.md
rm old_changelog.md
rm LAST_COMMIT.txt
rm vertext.md
# add all changed files (CHANGELOG.MD, package.json, package-lock.json)
git add .
git commit -m "v$verval"
# tag the version
echo "Tagging v$verval"
git tag -a $verval -m "$verval"
git push
git push --tags
# exit happily
exit 0
