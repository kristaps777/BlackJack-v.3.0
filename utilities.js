// shuffle all elements in an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

// sum all elements in an array
handSum = function (arr) {
  return arr.reduce(function (a, b) {
    return a + b
  }, 0);
};

function drawCards() {
  const target = document.getElementById('top_row');
  const targetDealer = document.getElementById('dealer_row');

  const newCard_1 = document.createElement('div');
  const newCard_2 = document.createElement('div');
  const dealerCard_1 = document.createElement('div');
  const dealerCard_2 = document.createElement('div');

  // reset 'stand' and 'win' states to default false status
  playerStandCondition = false;
  playerStandCondition_left = false;
  playerStandCondition_right = false;
  playerBustCondition = false;
  playerBustCondition_left = false;
  playerBustCondition_right = false;
  playerSplitCondition = false;
  dealerStandCondition = false;
  dealerBustCondition = false;

  // hide the dealer's score at the start of the round
  totalDealer.classList.add('hidden');

  // display player cards section if hidden by split
  // hide split section
  target.style.display = 'flex';
  split_section.style.display = 'none';
  total.style.display = 'flex';
  betValue.style.display = 'flex';

  // clear the table of all cards for player & dealer
  // also reset the cards-in-hand array for player & dealer
  // clear all split scores and cards, if any
  target.innerHTML = '';
  targetDealer.innerHTML = '';
  split_left.innerHTML = '';
  split_right.innerHTML = '';
  total_split_left.innerHTML = '';
  total_split_right.innerHTML = '';
  handCards.length = 0;
  dealerCards.length = 0;
  handCardsLeft.length = 0;
  handCardsRight.length = 0;

  if (!betStatus) {
    return alert('Place your bet before dealing cards!');
  } else {
    hit_button.disabled = false;
    stand_button.disabled = false;
    double_down_button.disabled = false;
    hit_button_split_left.disabled = false;
    hit_button_split_right.disabled = false;
    stand_button_split_left.disabled = false;
    stand_button_split_right.disabled = false;
    split_button.disabled = true;
  };

  // before a round can begin, a check is run to see, if there are still cards in the shoe
  // this is not a perfect solution, because you might have less cards to complete a round
  // needs to have some backup procedure to reset the shoe, in case it runs out of cards
  if (cardDeck.length <= 4) {
    alert('Out of cards, please reload!');
    hit_button.disabled = true;
    stand_button.disabled = true;
    double_down_button.disabled = true;
  } else {
    // loseMoney() is run here to remove the amount of the bet from total
    // if the player wins, winnings are added to the total via winMoney() or checkBlackJack()
    loseMoney();

    // player cards
    newCard_1.classList.add('player_card');
    newCard_2.classList.add('player_card');
    newCard_1.id = 'card_1';
    newCard_2.id = 'card_2';
    const drawCard_1 = cardDeck.shift();
    const drawCard_2 = cardDeck.shift();
    newCard_1.innerHTML = drawCard_1.rank;
    newCard_1.innerHTML += drawCard_1.suit;
    newCard_2.innerHTML = drawCard_2.rank;
    newCard_2.innerHTML += drawCard_2.suit;

    // dealer cards
    dealerCard_1.classList.add('dealer_card');
    dealerCard_2.classList.add('dealer_card');
    dealerCard_2.classList.add('hidden');
    dealerCard_1.id = 'dealer_card_1';
    dealerCard_2.id = 'dealer_card_2';
    const drawCard_3 = cardDeck.shift();
    const drawCard_4 = cardDeck.shift();
    dealerCard_1.innerHTML = drawCard_3.rank;
    dealerCard_1.innerHTML += drawCard_3.suit;
    dealerCard_2.innerHTML = drawCard_4.rank;
    dealerCard_2.innerHTML += drawCard_4.suit;

    // count player hand value
    // handCards.push(cardValues[newCard_1.innerHTML.slice(0, 1)]);
    // handCards.push(cardValues[newCard_2.innerHTML.slice(0, 1)]);

    handCards.push(drawCard_1.value);
    handCards.push(drawCard_2.value);

    // count dealer hand value
    // dealerCards.push(cardValues[dealerCard_1.innerHTML.slice(0, 1)]);
    // dealerCards.push(cardValues[dealerCard_2.innerHTML.slice(0, 1)]);

    dealerCards.push(drawCard_3.value);
    dealerCards.push(drawCard_4.value);

    // check for split
    // if (newCard_1.innerHTML.slice(0, 1) === newCard_2.innerHTML.slice(0, 1)) {
    //   split_button.disabled = false;
    // };

    if (drawCard_1.rank === drawCard_2.rank) {
      split_button.disabled = false;
    }

    // put player cards on the table
    target.appendChild(newCard_1);
    target.appendChild(newCard_2);

    // put dealer cards on the table
    targetDealer.appendChild(dealerCard_1);
    targetDealer.appendChild(dealerCard_2);

    // sum the cards in the hand and display the total value (player & dealer)
    total.innerHTML = handSum(handCards);
    totalDealer.innerHTML = handSum(dealerCards);

    // check, if player or dealer has been dealt a BlackJack hand of 21, if so, the round ends
    checkDealerBlackJack();
    checkBlackJack();
  };
};

// a function to perform the 'hit' action for the player
// a new card is 'drawn' from the shoe and it's value is added to the hand array and the sum of the hand is also adjusted
// a win condition check is also performed in the end to determine, if the player has busted or not,
// in which case all of the buttons are hidden, because in a 1 player game, the dealer wouldn't need to play
function hitCard() {
  if (cardDeck.length <= 1) {
    alert('Out of cards, please reload!');
  } else {
    const target = document.getElementById('top_row');
    const sampleID = parseInt(target.lastElementChild.id.slice(-1));
    const newCard = document.createElement('div');

    double_down_button.disabled = true;
    split_button.disabled = true;

    newCard.classList.add('player_card');
    newCard.id = 'card_' + (sampleID + 1)
    const drawCard_5 = cardDeck.shift();
    newCard.innerHTML = drawCard_5.rank;
    newCard.innerHTML += drawCard_5.suit;

    handCards.push(drawCard_5.value);

    target.appendChild(newCard);
    total.innerHTML = handSum(handCards);

    aceAdjustmentPlayer();

    if (total.innerHTML.slice(-2) == 21) {
      hit_button.disabled = true;
      standPlayer();
    }

    // player bust handler
    if (total.innerHTML.slice(-2) > 21) {
      playerBustCondition = true;
      hit_button.disabled = true;
      stand_button.disabled = true;
    }
  }
};

// a function to perform the 'hit' action for the dealer
// some minor adjustments here to simulate the dealer's play
function hitCardDealer() {
  const targetDealer = document.getElementById('dealer_row');
  const sampleID = parseInt(targetDealer.lastElementChild.id.slice(-1));
  const newCard = document.createElement('div');

  newCard.classList.add('dealer_card');
  newCard.id = 'dealer_card_' + (sampleID + 1)
  const drawCard_6 = cardDeck.shift();
  newCard.innerHTML = drawCard_6.rank;
  newCard.innerHTML += drawCard_6.suit;


  dealerCards.push(drawCard_6.value);

  targetDealer.appendChild(newCard);
  totalDealer.innerHTML = handSum(dealerCards);

  aceAdjustmentDealer();

  // dealer bust handler
  if (totalDealer.innerHTML.slice(-2) > 21) {
    dealerBustCondition = true;
    winMoney();
  }
};

// double down feature - player's current bet is doubled, the amount added to the bet is also substracted from player's total funds,
// and the player draws 1 card from the shoe and enters 'stand' phase
function doubleDown() {
  const target = document.getElementById('top_row');
  const sampleID = parseInt(target.lastElementChild.id.slice(-1));
  const newCard = document.createElement('div');
  const betValue = document.getElementById('betValue');

  newCard.classList.add('player_card');
  newCard.id = 'card_' + (sampleID + 1)
  const drawCard_7 = cardDeck.shift();
  newCard.innerHTML = drawCard_7.rank;
  newCard.innerHTML += drawCard_7.suit;


  handCards.push(drawCard_7.value);

  target.appendChild(newCard);
  total.innerHTML = handSum(handCards);

  betValue.value = parseInt(betValue.value) * 2;
  moneyValue.innerHTML = parseInt(moneyValue.innerHTML) - (parseInt(betValue.value) / 2);

  aceAdjustmentPlayer();

  // player bust handler
  if (total.innerHTML.slice(-2) > 21) {
    playerBustCondition = true;
    hit_button.disabled = true;
    stand_button.disabled = true;
    split_button.disabled = true;
    double_down_button.disabled = true;
  } else {
    standPlayer();
  }
};

// at the start of each round, check if player has BlackJack, in which case the player wins and round ends
function checkBlackJack() {
  const betValue = document.getElementById('betValue');
  const moneyValue = document.getElementById('moneyValue');

  if (total.innerHTML.slice(-2) == 21) {
    alert('BLACKJACK!');
    hit_button.disabled = true;
    stand_button.disabled = true;
    double_down_button.disabled = true;
    moneyValue.innerHTML = parseInt(moneyValue.innerHTML) + (parseInt(betValue.value) * 2.5);
  }
};

// at the start of each round, check if dealer has BlackJack, in which case the dealer wins and round ends
function checkDealerBlackJack() {
  if (totalDealer.innerHTML.slice(-2) == 21) {
    alert('DEALER BLACKJACK!');
    hit_button.disabled = true;
    stand_button.disabled = true;
    double_down_button.disabled = true;
    split_button.disabled = true;
    document.getElementById('dealer_card_2').classList.remove('hidden');
    totalDealer.classList.remove('hidden');
  }
};

// function to enable 'stand' status for the player
// in addition 'hit' and 'stand' buttons are hidden after enabling 'stand' status
// also dealer's 2nd card and score is revealed
function standPlayer() {
  playerStandCondition = true;
  hit_button.disabled = true;
  stand_button.disabled = true;
  double_down_button.disabled = true;
  split_button.disabled = true;

  autoDealer();
};

// function to enable 'stand' status for the dealer
function standDealer() {
  dealerStandCondition = true;
};


// a listener that handles scenarios that end with the dealer standing, as in when the dealer doesn't bust
// or when player doesn't have BlackJack
// in these 2 cases win is determined by score - if player's score is higher, player wins, if scores are equal, player pushes
document.getElementById('stand_button_dealer').addEventListener('click', () => {
  if (playerStandCondition && dealerStandCondition && !dealerBustCondition) {
    switch (true) {
      case parseInt(total.innerHTML) > parseInt(totalDealer.innerHTML):
        moneyValue.innerHTML = parseInt(moneyValue.innerHTML) + (parseInt(betValue.value) * 2);
        break;

      case parseInt(total.innerHTML) == parseInt(totalDealer.innerHTML):
        moneyValue.innerHTML = parseInt(moneyValue.innerHTML) + (parseInt(betValue.value));
        break;
    }
  }

  if (playerStandCondition_left && dealerStandCondition && !dealerBustCondition) {
    switch (true) {
      case parseInt(handSum(handCardsLeft)) > parseInt(totalDealer.innerHTML):
        moneyValue.innerHTML = parseInt(moneyValue.innerHTML) + (parseInt(betValueLeft.value) * 2);
        break;

      case parseInt(handSum(handCardsLeft)) == parseInt(totalDealer.innerHTML):
        moneyValue.innerHTML = parseInt(moneyValue.innerHTML) + (parseInt(betValueLeft.value));
        break;
    }
  }

  if (playerStandCondition_right && dealerStandCondition && !dealerBustCondition) {
    switch (true) {
      case parseInt(handSum(handCardsRight)) > parseInt(totalDealer.innerHTML):
        moneyValue.innerHTML = parseInt(moneyValue.innerHTML) + (parseInt(betValueRight.value) * 2);
        break;

      case parseInt(handSum(handCardsRight)) == parseInt(totalDealer.innerHTML):
        moneyValue.innerHTML = parseInt(moneyValue.innerHTML) + (parseInt(betValueRight.value));
        break;
    }
  }
});

// function for winning money
function winMoney() {
  // if dealer busts and there is no split this scenario executes
  if (!playerSplitCondition) {
    moneyValue.innerHTML = parseInt(moneyValue.innerHTML) + (parseInt(betValue.value) * 2);
  }

  // if dealer busts, split is active and player hasn't busted on both hands, this scenario executes
  if (playerSplitCondition && !playerBustCondition_left) {
    moneyValue.innerHTML = parseInt(moneyValue.innerHTML) + (parseInt(betValueLeft.value) * 2);
  }

  // if dealer busts, split is active and player hasn't busted on both hands, this scenario executes
  if (playerSplitCondition && !playerBustCondition_right) {
    moneyValue.innerHTML = parseInt(moneyValue.innerHTML) + (parseInt(betValueRight.value) * 2);
  }
};

// function for betting money, which essentially works for losing money as well, as in, you don't get your bet back, if you lose
function loseMoney() {
  if (!playerSplitCondition) {
    moneyValue.innerHTML = parseInt(moneyValue.innerHTML) - (parseInt(betValue.value));
  } else {
    moneyValue.innerHTML = parseInt(moneyValue.innerHTML) - (parseInt(betValueLeft.value));
  }
};

// function for pushing, as in, when the round ends with equal scores for player and dealer
// function pushMoney() {
//   if (!playerSplitCondition) {
//     moneyValue.innerHTML = parseInt(moneyValue.innerHTML) + (parseInt(betValue.value));
//   }
// };

// automated procedure for the dealer
// dealer hits as long as his score is below 17, then stands
function autoDealer() {
  document.getElementById('dealer_card_2').classList.remove('hidden');
  totalDealer.classList.remove('hidden');
  while (parseInt(totalDealer.innerHTML) < 17) {
    hit_button_dealer.click();
  }
  stand_button_dealer.click();
};

// function to adjust player score, in case player holds an Ace
// since the Ace has a single value of 11, drawn from the values array, this is a workaround to imitate
// the Ace also having the value of 1 - after the adjustment, player's score is reduced by 10 points for each Ace in hand, if player's score > 21
function aceAdjustmentPlayer() {
  let score = total.innerHTML;
  let aceCheck = handCards.find(function (element) { return element == 11 });

  if (parseInt(score) > 21 && aceCheck) {
    score -= 10;
  }

  total.innerHTML = score;
};

// same function to adjust the dealer's score, if there are Aces present on the dealer's side of the table
function aceAdjustmentDealer() {
  let score = totalDealer.innerHTML;
  let aceCheck = dealerCards.find(function (element) { return element == 11 });

  if (parseInt(score) > 21 && aceCheck) {
    score -= 10;
  }

  total.innerHTML = score;
};

function setBet() {
  const betValue = document.getElementById('betValue');
  const baseBet = document.getElementById('baseBet');

  if (baseBet.value >= 1) {
    betValue.value = baseBet.value;
    betStatus = true;
  } else {
    alert('Bet amount must be 1 or more!');
  }

};

// handle Enter press on bet input
function handle(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    setBet();
  }
};

/* ============================================================================================ */
// split feature
// if player's first draw results in 2 identical cards, player can choose to split them into
// two separate piles and bet/hit on each pile separately
function splitCards() {
  const playerCards = document.getElementById('top_row');
  const firstCard = playerCards.firstChild;
  const secondCard = playerCards.lastChild;
  const splitLeft = document.getElementById('split_row_left');
  const splitRight = document.getElementById('split_row_right');

  const firstCardClone = firstCard.cloneNode(true);
  const secondCardClone = secondCard.cloneNode(true);

  playerSplitCondition = true;

  playerCards.style.display = 'none';
  total.style.display = 'none';
  split_section.style.display = 'flex';
  betValue.style.display = 'none';

  hit_button.disabled = true;
  stand_button.disabled = true;
  double_down_button.disabled = true;
  split_button.disabled = true;

  splitLeft.appendChild(firstCardClone);
  splitRight.appendChild(secondCardClone);

  handCardsLeft.push((handSum(handCards)) / 2);
  handCardsRight.push((handSum(handCards)) / 2);

  total_split_left.innerHTML = handSum(handCardsLeft);
  total_split_right.innerHTML = handSum(handCardsRight);

  betValueLeft.value = betValue.value;
  betValueRight.value = betValue.value;

  hitCardLeft();
  hitCardRight();

  loseMoney();
}

// hit left for split scenario
function hitCardLeft() {
  if (cardDeck.length <= 1) {
    alert('Out of cards, please reload!');
  } else {
    const target = document.getElementById('split_row_left');
    const sampleID = parseInt(target.lastElementChild.id.slice(-1));
    const newCard = document.createElement('div');

    newCard.classList.add('player_card');
    newCard.id = 'card_' + (sampleID + 2)
    const drawCard_8 = cardDeck.shift();
    newCard.innerHTML = drawCard_8.rank;
    newCard.innerHTML += drawCard_8.suit;

    handCardsLeft.push(drawCard_8.value);

    target.appendChild(newCard);
    total_split_left.innerHTML = handSum(handCardsLeft);

    //  ace adjustment

    if (total_split_left.innerHTML.slice(-2) == 21) {
      hit_button_split_left.disabled = true;
      standPlayerSplitLeft();
    }

    // left hand bust handler
    if (total_split_left.innerHTML.slice(-2) > 21) {
      hit_button_split_left.disabled = true;
      stand_button_split_left.disabled = true;
      playerBustCondition_left = true;
    }

    if (playerBustCondition_right) {
      playerBustCondition = true;
    }

    if (playerBustCondition_left && playerStandCondition_right) {
      autoDealer();
    }
  }
};

// hit right for split scenario
function hitCardRight() {
  if (cardDeck.length <= 1) {
    alert('Out of cards, please reload!');
  } else {
    const target = document.getElementById('split_row_right');
    const sampleID = parseInt(target.lastElementChild.id.slice(-1));
    const newCard = document.createElement('div');

    newCard.classList.add('player_card');
    newCard.id = 'card_' + (sampleID + 2)
    const drawCard_9 = cardDeck.shift();
    newCard.innerHTML = drawCard_9.rank;
    newCard.innerHTML += drawCard_9.suit;

    handCardsRight.push(drawCard_9.value);

    target.appendChild(newCard);
    total_split_right.innerHTML = handSum(handCardsRight);

    //  ace adjustment

    if (total_split_right.innerHTML.slice(-2) == 21) {
      hit_button_split_right.disabled = true;
      standPlayerSplitRight();
    }

    // right hand bust handler
    if (total_split_right.innerHTML.slice(-2) > 21) {
      hit_button_split_right.disabled = true;
      stand_button_split_right.disabled = true;
      playerBustCondition_right = true;
    }

    if (playerBustCondition_left) {
      playerBustCondition = true;
    }

    if (playerBustCondition_right && playerStandCondition_left) {
      autoDealer();
    }
  }
};

function standPlayerSplitLeft() {
  playerStandCondition_left = true;
  hit_button_split_left.disabled = true;
  stand_button_split_left.disabled = true;

  if ((playerStandCondition_left && playerStandCondition_right) || (playerStandCondition_left && playerBustCondition_right)) {
    document.getElementById('dealer_card_2').classList.remove('hidden');
    totalDealer.classList.remove('hidden');

    autoDealer();
  }
};

function standPlayerSplitRight() {
  playerStandCondition_right = true;
  hit_button_split_right.disabled = true;
  stand_button_split_right.disabled = true;

  if ((playerStandCondition_left && playerStandCondition_right) || (playerBustCondition_left && playerStandCondition_right)) {
    document.getElementById('dealer_card_2').classList.remove('hidden');
    totalDealer.classList.remove('hidden');

    autoDealer();
  }
};
