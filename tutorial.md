Client: `npx create-react-app client`
cd client npm start

to use mui material
npm install @mui/material @emotion/react @emotion/styled --legacy-peer-deps
npm install @mui/icons-material --legacy-peer-deps

"scripts": {
"start": "concurrently \"npm run backend\" \"npm run frontend\"",
"backend": "python ../backend/main.py",
"frontend": "react-scripts start",
}
npm outdated