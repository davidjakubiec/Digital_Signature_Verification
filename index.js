const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const port = 3000;

// const publicPath = path.join(__dirname,  'public_key_A.pem');
// console.log(publicPath)

const app = express();
app.use(bodyParser.raw({ type: 'application/octet-stream' }));

// read the pre-shared public key
// const publicKey = fs.readFileSync('/Users/davidjakubiec/public_key_A.pem');
const publicKey = fs.readFileSync(path.join(__dirname, 'server_files', 'public_key_A.pem'));
// console.log(publicKey)

app.post('/verify', (req, res) => {
  // extract the file data and signature from the request body
  const data = req.body;
  const dataParts = data.toString().split(' ');
//   console.log("data parts: ",Buffer.from(dataParts[1]).toString().split('\n'))
  const fileData = Buffer.from(dataParts[0], 'base64');
  const signature = Buffer.from(dataParts[1], 'base64');
//   console.log("signature: ", signature)

  //error handling for test case 2
  if(dataParts[2]) res.status(402).send("402");

  //error handling of test case 3
  if(Buffer.from(dataParts[1]).toString().split('\n').length > 2) res.status(403).send("403");

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
