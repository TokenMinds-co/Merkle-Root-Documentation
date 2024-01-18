# Merkle Root Documentation

This repository serves as a comprehensive guide and practical demonstration on the process of generating Merkle proofs to facilitate the inclusion of whitelisted users, ultimately enabling them to access the mint function. The primary objective is to illustrate the step-by-step procedure for implementing Merkle proofs.

## Table of Content
- [Merkle Proofs and Whitelisted Users](#merkle-proofs-and-whitelisted-users)
- [Access to the Mint Function](#access-to-the-mint-function)
- [Install Hardhat](#install-hardhat)
- [Install Dev Dependencies](#install-dev-dependencies)
- [Add wallet address in the whitelist](#add-wallet-address-in-the-whitelist)
- [Generate Merkle-whitelist](#generate-merkle-whitelist)
- [Add merkle root to minting contract](#add-merkle-root-to-minting-contract)
- [Generate merkle proof](#generate-merkle-proof)
- [Add proof to mint function](#add-proof-to-mint-function)
- [Conclusion](#conclusion)

### Merkle Proofs and Whitelisted Users

A Merkle proof is a cryptographic technique used to efficiently verify the inclusion of a specific element within a large dataset, such as a Merkle tree. In the context of this repository, the focus is on utilizing Merkle proofs to manage a whitelist of users. A whitelist typically contains addresses that are granted special privileges or permissions within a blockchain-based system.

### Access to the Mint Function
The specific use case addressed in this repository involves providing access to the mint function based on a whitelist. In blockchain and smart contract development, minting often refers to the creation of new tokens. By incorporating Merkle proofs, the repository demonstrates a secure and efficient way to control access to the mint function, ensuring that only whitelisted users can initiate this critical operation.

### Install Hardhat

Install hardhat using the following command: 

```shell
npm install --save-dev hardhat
```

### Install Dev Dependencies
After installing Hardhat successfully, run the `npm install` command to install all the dependencies that is present in the package.json file. 

### Add wallet address in the whitelist
After successfully installing all the dev dependencies, go to `data/whitelist.json` and add your wallet addresses in the `list`. While writing the address, make sure to follow two things:
- Enter the new address below the last entered address. 
- Add comma `,` after the previous address.
- While writing the new address, wrap it inside inverted commas. `" "` 


The file will look this: 

```shell
{
    "list": [
      "0x0f22F0f1C70b0277dEE7F0FF1ac480CB594Ca450",
      "0x4EAe6dEf41CC02f2895C400eD7FEf679729b0797",
      "0xd7BfFa422717c0175622296208bBcA8D61B8c3bd",
      "0xa70e1A72F4D9CdBca8228EF21A8b709D4f954f56",
      "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
      "0x00893145aa6C40B30a6da1fF477c9AB5178af11A"
    #  --------- Add your Address here!------------  
    ]
}
```
Now we are ready to generate merkle roots. 

### Generate Merkle-whitelist

To generate the merkle root for all the wallet addresses that is added in the `whitelist.json` list, enter the following command: 
```shell
npx hardhat merkle-whitelist
``` 
This command will give two outputs
- A buffer value
- Merkle root

The output, given if no wallet addresses is changed from the above list, will look like the following: 
```shell
<Buffer 96 91 d1 a5 a6 a0 31 1d 69 5d 71 23 d0 57 12 f1 37 fc 1c b6 6c 1a 2b e8 f6 9e e5 f2 6d 52 b9 97>
0x9691d1a5a6a0311d695d7123d05712f137fc1cb66c1a2be8f69ee5f26d52b997
```
Here, please **IGNORE** the Buffer value, or the value which is wrapped between the angle brackets. 

Hence, we get the merkle root as: 

| **Merkle Root**                             |
|---------------------------------------------|
| 0x9691d1a5a6a0311d695d7123d05712f137fc1cb66c1a2be8f69ee5f26d52b997 |

### Add merkle root to minting contract

Finally, add your merkle root to the `setWhitelistMerkleRoot` function in the minting contract and write the transaction. 
Please note that the function has a modifier which allows only the wallet address with `ADMIN_ROLE` to call that function. So to successfully write this function, switch to the wallet address that has been provided with `ADMIN_ROLE`. 

### Generate merkle proof

If you notice, the mint function has an additional argument which is `proof[]`
To obtain the value for the above parameter, hit the following command using CLI: 

```shell
npx hardhat merkle-proof --account <ADD-YOUR-ADDRESS-HERE>
```
In this command, you need to pass the address against which you need to generate to proof. For example, if you want to mint the TCHFs using `0x00893145aa6C40B30a6da1fF477c9AB5178af11A` wallet address, the command will be like following: 
```shell
npx hardhat merkle-proof --account 0x00893145aa6C40B30a6da1fF477c9AB5178af11A
```
The output to this command will be similar to: 
```shell
whitelist [
  '0x0f22F0f1C70b0277dEE7F0FF1ac480CB594Ca450',
  '0x4EAe6dEf41CC02f2895C400eD7FEf679729b0797',
  '0xd7BfFa422717c0175622296208bBcA8D61B8c3bd',
  '0xa70e1A72F4D9CdBca8228EF21A8b709D4f954f56',
  '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
  '0x00893145aa6C40B30a6da1fF477c9AB5178af11A'
]
proof : [
  '0x5931b4ed56ace4c46b68524cb5bcbf4195f1bbaacbe5228fbd090546c88dd229',
  '0x3b439c70d911ecc841fee1e0d248484dddb00b6201ee4f3f5d8ffb68c175d66b'
]
```
### Add proof to mint function
Copy the value in the array proof in the following fashion: 
- Concatenate them in a single line
- Erase all the single inverted commas `''`.
- Make sure there is no gap between the proofs and commas. 
The format, in this case will look like following: 
```shell
0x5931b4ed56ace4c46b68524cb5bcbf4195f1bbaacbe5228fbd090546c88dd229,0x3b439c70d911ecc841fee1e0d248484dddb00b6201ee4f3f5d8ffb68c175d66b
``` 
__Please Note: For every different addresses, the proof will be different. For example, if the address `0xd7BfFa422717c0175622296208bBcA8D61B8c3bd` wants to mint, then it has to generate it's own proof by replacing the <ADD-YOUR-ACCOUNT-ADDRESS> to it's own wallet address and then with the generated merkle proof it will be able to mint the TCHF. In this way, it is made sure that absolutely no third wallet address is able to participate in the minting process.__ 

## Conclusion
By providing a detailed and hands-on guide, this repository by [TokenMinds](https://tokenminds.co/) aims to empower developers to implement Merkle proofs effectively, offering a secure mechanism for managing whitelists and controlling access to critical functions within decentralized applications or smart contracts.