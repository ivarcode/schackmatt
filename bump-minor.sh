echo -n "Enter version description: "
read VerDesc
npm version minor
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
echo -n "    $VerDesc" >> CHANGELOG.md
echo "" >> CHANGELOG.md
cat old_changelog.md >> CHANGELOG.md
rm old_changelog.md
rm LAST_COMMIT.txt
rm vertext.md
git add CHANGELOG.md
git commit -m "v$verval - changelog updates"
git tag -d v$verval
echo "Tagging v$verval"
git tag -a $verval -m "$verval"
git push --tags
