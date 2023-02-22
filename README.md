# David Jakubiec Assessment - Digital Signature Verification
    
This project creates an ECDSA digital signature using openSSL for a file_A in a client shell script. It appends the signature to file_A creating a new file_B. File_B gets sent to a Node.js API service to verify that the contents of the message have not been tampered with. If the signature is verified, then the API responds with a 201 status. If the signature does not pass verification, the API responds with a 400 status.

## Installation

1. Install the most current version of Node.js

2. Install dependencies with the following command in your terminal:
    npm install

## Usage

1. Create a file called 'private_key_A.pem' in the client directory and add the private key that I will securely share with you to the contents of that file

2. Run shell script 'client.sh file_A.txt' (Note: You can change file_A.txt to any file)

The expected successful outcome will be a 201 status response printed in the terminal (client-side) for each loop.

If the signature did not pass verification, a 400 status response will be printed in the termincal (client-side).