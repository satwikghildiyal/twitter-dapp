const {expect} = require("chai")
const {ethers} = require("hardhat")


describe("Twitter Contract", function() {

    let Twitter;

    let twitter;

    let owner;


    const MY_TWEETS = 3;

    const NOT_MY_TWEETS = 5;

    let totalTweets;

    let totalMyTweets;

    beforeEach(async function() {

        Twitter = await ethers.getContractFactory("TwitterContract");

        [owner, addr1, addr2] = await ethers.getSigners();


        twitter = await Twitter.deploy();


        totalTweets = [];

        totalMyTweets = [];

        for(let i = 0; i < NOT_MY_TWEETS; i++) {

            let tweet = {

                'tweetText': 'Random text with id: ' + i,

                'username': addr1,

                'isDeleted': false

            };

            await twitter.connect(addr1).addTweet(tweet.tweetText, tweet.isDeleted);

            totalTweets.push(tweet);
        }



        for(let i = 0; i < MY_TWEETS; i++) {

            let tweet = {

                'tweetText': 'Random text with id: ' + i,

                'username': owner,

                'isDeleted': false

            };

            await twitter.addTweet(tweet.tweetText, tweet.isDeleted);

            totalTweets.push(tweet);
            totalMyTweets.push(tweet);
        }


    });

    describe("Add Tweet", function() {

        it("should emit AddTweet event", async function() {

            let tweet = {

                'tweetText': 'New Tweet',
                'isDeleted': false,

            };

            await expect(await twitter.addTweet(tweet.tweetText, tweet.isDeleted)).to.emit(twitter, 'AddTweet').withArgs(owner.address, MY_TWEETS + NOT_MY_TWEETS);



        })
    });

    describe("Get Tweets", function() {

        it("should return the correct number of total tweets", async function() {

            const tweetsFromChain = await twitter.getAllTweets();

            expect(tweetsFromChain.length).to.equal(MY_TWEETS + NOT_MY_TWEETS);
        })

        it("should return the correct number of all my tweets", async function() {

            const myTweetsFromChain = await twitter.getMyTweets();

            expect(myTweetsFromChain.length).to.equal(MY_TWEETS);


        })
    })

    describe("Delete Tweet", function() {

        it("should emit Delete Tweet event", async function() {

            const TWEET_ID = 0;
            const TWEET_DELETED = true;

            await expect(twitter.connect(addr1).deleteTweet(TWEET_ID, TWEET_DELETED)).to.emit(twitter, "DeleteTweet").withArgs(TWEET_ID, TWEET_DELETED);


        })
    })
});