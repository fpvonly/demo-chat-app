# Setup commands:
nvm install  9.5.0
npm install -g npm@latest
cd site
npm install
cd server
npm install
cd ..

# Test commands:
npm run test

# Deployment Commands:
ssh deploy@146.185.148.22 'cd demo-chat-app/site/; git checkout master; git pull; npm install; npm run prodbuild; cd server/; npm install; sudo npm run foreverrestart;'
