const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const port = 3000;

const app = express();
app.use(bodyParser.raw({ type: 'application/octet-stream' }));

// read the pre-shared public key
const publicKey = fs.readFileSync(path.join(__dirname, 'server_files', 'public_key_A.pem'));

app.post('/verify', (req, res) => {
  // extract the file data and signature from the request body
  const data = req.body;
  const dataParts = data.toString().split(' ');
  const fileData = Buffer.from(dataParts[0], 'base64');
  const signature = Buffer.from(dataParts[1], 'base64');

  //error handling for test case 2 (specified in client.sh)
  if(dataParts[2]) res.status(400).send("400");

  //error handling of test case 3 (specified in client.sh)
  if(Buffer.from(dataParts[1]).toString().split('\n').length > 2) res.status(400).send("400");

  // create a verifier with the public key
  const verifier = crypto.createVerify('sha256');
  verifier.update(fileData);

  // verify the signature using the verifier and the signature buffer
  const isValid = verifier.verify(publicKey, signature);

  // send the appropriate response code
  if (isValid) {
    res.status(201).send("201");
  } else {
    res.status(400).send("400");
  }
});

app.listen(port, () => console.log(`API service listening on port ${port}`));
