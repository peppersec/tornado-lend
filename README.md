# Tornado lend

Make your locked funds work for you!

## Inspiration

When we talked with people about our previous Mixer project, the first thing many people said was "Hey, you should put those locked funds to work with DeFi!", and that's what we decided to do at this hackathon.

## What it does

There are many smart-contracts like DAOs, Bridges, Mixers that keep funds locked in for prolonged periods of time. Tornado lend allows contract creators to make those funds work by lending them to DeFi services like Compound. Since often the interest cannot be distributed directly to contract users, we use staking pool to distribute those funds. The interest pool can be also used to refund gas for users transactions. 

## How we built it

Each time a user puts funds into the Wallet smart contract it lends those assets to Compound instead of just holding them on smart contract. When users withdraw it takes the appropriate amount of money back and gives back to the user. All the accumulated interest can be withdrawn into a special pool contract that distributes them.

Pool contract is independent of the main wallet and distributes funds depending on how many shares each user owns. Any user can join by putting some ether into this contract and getting a share proportional to ether spent. Then after some time user withdraws by burning his share and receiving the proportional amount of accumulated funds.

## Challenges we ran into



## Accomplishments that we're proud of

We made a universal library universal so that can easily be included into any project, we also made both Eth and ERC20 versions

## What we learned

Using DeFi tools like Compound and making pools that fairly split interest between members

## What's next for Tornado lend

We want to include our new mechanism into Tornado.cash mixer and make other projects such as bridges, mixers, DAOs aware of this project so that they can include this functionality too.

There is also an idea to refund transaction gas costs for users from the pooled funds.
