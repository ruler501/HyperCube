// Load Environment Variables
require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');

const Deck = require('../models/deck');
const Draft = require('../models/draft');
const carddb = require('../serverjs/cards.js');
const deckutils = require('../dist/utils/deckutils');

const path = (batch) => `jobs/export/drafts/${batch}.json`;

const batchSize = 100;

let cardToInt;

const processDeck = async (deck) => {
  const picks = [];
  if (
    !deck.seats ||
    !deck.seats[0] ||
    !deck.seats[0].deck ||
    !deck.seats[0].pickorder ||
    !deck.draft ||
    !deck.seats[0].sideboard ||
    !deck.seats[0].pickorder.length ||
    deck.cards
  ) {
    return null;
  }

  const draft = await Draft.findOne({ _id: deck.draft }).lean();
  if (!draft || !draft.initial_state || !draft.initial_state[0].length || !draft.initial_state[0][0].length) {
    return null;
  }

  const seen = [];
  index = 0;
  const pickorder = deck.seats[0].pickorder;
  for (const card of pickorder) {
    // named import doesn't work for some reason
    // eslint-disable-next-line import/no-named-as-default-member
    let cardsInPack;
    let pick;
    let pack;
    try {
      [cardsInPack, pick, pack] = deckutils.default.getPackAsSeen(draft.initial_state, index, deck, 0); // eslint-disable-line prefer-const
    } catch(e) {
      console.warn(e);
      return null;
    }
    cardsInPack = cardsInPack.filter((c) => c && c.cardID);
    if (cardsInPack.length == 0) {
      return null;
    }
    cardsInPack = cardsInPack.map((c) => cardToInt[carddb.cardFromId(c.cardID).name_lower]);
    seen.push(...cardsInPack);
    const picked = deck.seats[0].pickorder
      .slice(0, index)
      .map((c) => cardToInt[carddb.cardFromId(c.cardID).name_lower]);
    const chosenCard = cardToInt[carddb.cardFromId(card.cardID).name_lower];
    picks.push({ pack, pick, picked, cardsInPack, chosenCard, seen: [...seen] });
    index += 1;
  }
  const main = deck.seats[0].deck.flat(2).map((c) => cardToInt[carddb.cardFromId(c.cardID).name_lower]);
  const sideboard = deck.seats[0].sideboard.flat(2).map((c) => cardToInt[carddb.cardFromId(c.cardID).name_lower]);
  const cards = draft.initial_state.flat(3).map((c) => cardToInt[carddb.cardFromId(c.cardID).name_lower]);
  return { picks, main, sideboard, cards };
};

(async () => {
  await carddb.initializeCardDb();
  const cardNames = new Set(carddb.allCards().map((c) => c.name_lower));
  cardToInt = Object.fromEntries([...cardNames].map((name, index) => [name, index]));
  fs.writeFileSync('jobs/export/cardToInt.json', JSON.stringify(cardToInt), 'utf8');

  mongoose.connect(process.env.MONGODB_URL).then(async () => {
    // process all deck objects
    console.log('Started');
    const count = await Deck.countDocuments();
    console.log(`Counted ${count} documents`);
    const cursor = Deck.find().lean().cursor();

    for (let i = 0; i < count; i += batchSize) {
      const deckQs = [];
      for (let j = 0; j < batchSize; j++) {
        if (i + j < count) {
          // eslint-disable-next-line no-await-in-loop
          const deck = await cursor.next();
          if (deck) {
            deckQs.push(processDeck(deck));
          }
        }
      }
      // eslint-disable-next-line no-await-in-loop
      const decks =  (await Promise.all(deckQs)).filter((d) => d);
      if (decks.length > 0) {
        fs.writeFileSync(path(i / batchSize), JSON.stringify(decks), 'utf8');
      }
      console.log(`Finished: ${Math.min(count, i + batchSize)} of ${count} decks`);
    }
    mongoose.disconnect();
    console.log('done');
    process.exit();
  });
})();
