#!/bin/bash
for i in {1..1000}
do
# read the file data
file_data=$(cat $1)

# generate a new private key if it doesn't exist already
if [ ! -f private_key_A.pem ]; then
    openssl ecparam -genkey -name secp256k1 -out private_key_A.pem
    openssl ec -in private_key_A.pem -pubout -out ../server_files/public_key_A.pem
fi

# create a signature for the file data using the private key
signature=$(echo "$file_data" | openssl dgst -sha256 -sign private_key_A.pem | base64)

# encode the file data and signature in Base64 and attach the signature to the file data
file_data_base64=$(echo "$file_data" | base64)
file_data_with_signature=$(echo "$file_data_base64 $signature" | tr -d '\n')

#save file data with signature in file_B
echo $file_data_with_signature > file_B 

#test case 1: file_A contents were alterted after signing
#echo "alteration " $file_data_with_signature > file_B

#test case 2: signature contents were alterted after signing
#echo $file_data_with_signature "alteration" > file_B
#cat file_B

#test case 3: file contents were alterted on new line after signing

# send the file data with signature to the Restful API service for verification
curl -X POST -H "Content-Type: application/octet-stream" --data-binary "@file_B" http://localhost:3000/verify

# check return code
  if [ $? -eq 400 ]
  then
    echo "Verification failed!"
    exit 1
    break
  fi
done

