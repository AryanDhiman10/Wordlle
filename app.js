const express = require('express');
const cors = require('cors');
const app = express();
const axios = require("axios").default;

app.use(cors());

app.get('/word', (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
        params: {count: '2', wordLength: '6'},
        headers: {
          'x-rapidapi-host': 'random-words5.p.rapidapi.com',
          'x-rapidapi-key': 'd63105299cmsh13fb69ce367e88fp10d8b8jsn454b15a1519c'
        }
      };
      
      axios.request(options).then(response => {
          res.json(response.data[0]);
      }).catch(error => {
          console.error(error);
      });
})

app.listen(3000, ()=> console.log('Server running on port 3000'));

