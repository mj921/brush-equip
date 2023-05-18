npm run build
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:mj921/brush-equip.git master:gh-pages
cd -
