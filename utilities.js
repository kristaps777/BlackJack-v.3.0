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

    // add player card values to hand
    handCards.push(drawCard_1.value);
    // if 2 Aces are drawn intially, use alternate value for the 2nd Ace
    if (drawCard_1.rank === '<sup>A</sup>' && drawCard_2.rank === '<sup>A</sup>') {
      handCards.push(drawCard_2.alt_value);
    } else {
      handCards.push(drawCard_2.value);
    }

    // add dealer card values to hand
    dealerCards.push(drawCard_3.value);
    // if 2 Aces are drawn intially, use alternate value for the 2nd Ace
    if (drawCard_3.rank === '<sup>A</sup>' && drawCard_4.rank === '<sup>A</sup>') {
      dealerCards.push(drawCard_4.alt_value);
    } else {
      dealerCards.push(drawCard_4.value);
    }

    // check, if split should be allowed
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

    // if next drawn card is an Ace and hand value would exceed 21,
    // alternate value for the Ace is used
    if (drawCard_5.rank === '<sup>A</sup>' && handSum(handCards) + drawCard_5.value > 21) {
      handCards.push(drawCard_5.alt_value);
    } else {
      // else, if adding the value of next drawn card would exceed 21
      // and there are Aces in hand, their values of 11 are removed from the hand
      // and a value of 1 is pushed in, before adding the value of the next drawn card
      let aceIndex = handCards.indexOf(11);
      if (handSum(handCards) + drawCard_5.value > 21 && aceIndex > -1) {
        handCards.splice(aceIndex, 1);
        handCards.push(1);
        handCards.push(drawCard_5.value);
      } else {
        handCards.push(drawCard_5.value);
      }
    }

    target.appendChild(newCard);
    total.innerHTML = handSum(handCards);

    // auto-stand if score is 21
    if (handSum(handCards) == 21) {
      hit_button.disabled = true;
      standPlayer();
    }

    // player bust handler
    if (handSum(handCards) > 21) {
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


  // if next drawn card is an Ace and hand value would exceed 21,
  // alternate value for the Ace is used
  if (drawCard_6.rank === '<sup>A</sup>' && handSum(dealerCards) + drawCard_6.value > 21) {
    dealerCards.push(drawCard_6.alt_value);
  } else {
    // else, if adding the value of next drawn card would exceed 21
    // and there are Aces in hand, their values of 11 are removed from the hand
    // and a value of 1 is pushed in, before adding the value of the next drawn card
    let aceIndex = dealerCards.indexOf(11);
    if (handSum(dealerCards) + drawCard_6.value > 21 && aceIndex > -1) {
      dealerCards.splice(aceIndex, 1);
      dealerCards.push(1);
      dealerCards.push(drawCard_6.value);
    } else {
      dealerCards.push(drawCard_6.value);
    }
  }

  targetDealer.appendChild(newCard);
  totalDealer.innerHTML = handSum(dealerCards);

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


  // if next drawn card is an Ace and hand value would exceed 21,
  // alternate value for the Ace is used
  if (drawCard_7.rank === '<sup>A</sup>' && handSum(handCards) + drawCard_7.value > 21) {
    handCards.push(drawCard_7.alt_value);
  } else {
    // else, if adding the value of next drawn card would exceed 21
    // and there are Aces in hand, their values of 11 are removed from the hand
    // and a value of 1 is pushed in, before adding the value of the next drawn card
    let aceIndex = handCards.indexOf(11);
    if (handSum(handCards) + drawCard_7.value > 21 && aceIndex > -1) {
      handCards.splice(aceIndex, 1);
      handCards.push(1);
      handCards.push(drawCard_7.value);
    } else {
      handCards.push(drawCard_7.value);
    }
  }

  target.appendChild(newCard);
  total.innerHTML = handSum(handCards);

  betValue.value = parseInt(betValue.value) * 2;
  moneyValue.innerHTML = parseInt(moneyValue.innerHTML) - (parseInt(betValue.value) / 2);

  // player bust handler
  if (handSum(handCards) > 21) {
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

  if (handSum(handCards) == 21) {
    alert('BLACKJACK!');
    hit_button.disabled = true;
    stand_button.disabled = true;
    double_down_button.disabled = true;
    moneyValue.innerHTML = parseInt(moneyValue.innerHTML) + (parseInt(betValue.value) * 2.5);
  }
};

// at the start of each round, check if dealer has BlackJack, in which case the dealer wins and round ends
function checkDealerBlackJack() {
  if (handSum(dealerCards) == 21) {
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


  // push both card values to separate arrays
  // ensure, if the 2nd card was a converted Ace, 11 is pushed, not 1
  handCardsLeft.push(handCards[0]);
  if (handCards[1] == 1) {
    handCardsRight.push(11);
  } else {
    handCardsRight.push(handCards[1]);
  }

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

    // if next drawn card is an Ace and hand value would exceed 21,
    // alternate value for the Ace is used
    if (drawCard_8.rank === '<sup>A</sup>' && handSum(handCardsLeft) + drawCard_8.value > 21) {
      handCardsLeft.push(drawCard_8.alt_value);
    } else {
      // else, if adding the value of next drawn card would exceed 21
      // and there are Aces in hand, their values of 11 are removed from the hand
      // and a value of 1 is pushed in, before adding the value of the next drawn card
      let aceIndex = handCardsLeft.indexOf(11);
      if (handSum(handCardsLeft) + drawCard_8.value > 21 && aceIndex > -1) {
        handCardsLeft.splice(aceIndex, 1);
        handCardsLeft.push(1);
        handCardsLeft.push(drawCard_8.value);
      } else {
        handCardsLeft.push(drawCard_8.value);
      }
    }

    target.appendChild(newCard);
    total_split_left.innerHTML = handSum(handCardsLeft);

    if (handSum(handCardsLeft) == 21) {
      hit_button_split_left.disabled = true;
      standPlayerSplitLeft();
    }

    // left hand bust handler
    if (handSum(handCardsLeft) > 21) {
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

    // if next drawn card is an Ace and hand value would exceed 21,
    // alternate value for the Ace is used
    if (drawCard_9.rank === '<sup>A</sup>' && handSum(handCardsRight) + drawCard_9.value > 21) {
      handCardsRight.push(drawCard_9.alt_value);
    } else {
      // else, if adding the value of next drawn card would exceed 21
      // and there are Aces in hand, their values of 11 are removed from the hand
      // and a value of 1 is pushed in, before adding the value of the next drawn card
      let aceIndex = handCardsRight.indexOf(11);
      if (handSum(handCardsRight) + drawCard_9.value > 21 && aceIndex > -1) {
        handCardsRight.splice(aceIndex, 1);
        handCardsRight.push(1);
        handCardsRight.push(drawCard_9.value);
      } else {
        handCardsRight.push(drawCard_9.value);
      }
    }

    target.appendChild(newCard);
    total_split_right.innerHTML = handSum(handCardsRight);

    //  ace adjustment

    if (handSum(handCardsRight) == 21) {
      hit_button_split_right.disabled = true;
      standPlayerSplitRight();
    }

    // right hand bust handler
    if (handSum(handCardsRight) > 21) {
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
