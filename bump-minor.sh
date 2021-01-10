git log -1 > LAST_COMMIT.txt
npm version minor
sed -n 3p package.json > vertext.md
sed -i 's/    \"version\": \"//g' vertext.md
sed -i 's/\",//g' vertext.md
echo -n "### " >> CHANGELOG.md
cat vertext.md >> CHANGELOG.md
echo "" >> CHANGELOG.md
sed -n 1p LAST_COMMIT.txt >> CHANGELOG.md
echo "" >> CHANGELOG.md
sed -n 3p LAST_COMMIT.txt >> CHANGELOG.md
echo "" >> CHANGELOG.md
sed -n 5p LAST_COMMIT.txt >> CHANGELOG.md
echo "" >> CHANGELOG.md
rm LAST_COMMIT.txt
rm vertext.md