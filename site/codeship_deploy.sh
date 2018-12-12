# Setup commands:
/* read from package.json nvm install 9.5.0
npm install -g npm@latest */
cd site
npm install
cd server
npm install
cd ..

# Test commands:
npm run test

# Deployment Commands:
ssh deploy@146.185.148.22 'git config --global user.email "fpvonly@gmail.com"; git config --global user.name "fpvonly@gmail.com"; cd demo-chat-app/site/; git checkout master; git pull; npm install; npm run prodbuild; git add ./build; git commit -m "Codeship CI build (production) --skip-ci"; git push; cd server/; npm install; sudo npm run foreverrestart;'
