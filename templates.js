// global variables & templates used in other scripts


// arrays for the hand of dealer and player
// every card drawn from the shoe is pushed into the corresponding array
// to simplify counting of total values
const handCards = [];
const dealerCards = [];

// arrays for left/right hands in split scenario
const handCardsLeft = [];
const handCardsRight = [];

// 'stand' state conditions
let playerStandCondition = false;
let dealerStandCondition = false;
let playerStandCondition_left = false;
let playerStandCondition_right = false;

// 'split' state
let playerSplitCondition = false;

// 'bust' state
let playerBustCondition = false;
let dealerBustCondition = false;
let playerBustCondition_left = false;
let playerBustCondition_right = false;

// bet status to avoid playing without a bet
let betStatus = false;

// buttons
const hit_button = document.getElementById('hit_button');
const hit_button_dealer = document.getElementById('hit_button_dealer');
const stand_button = document.getElementById('stand_button');
const stand_button_dealer = document.getElementById('stand_button_dealer');
const double_down_button = document.getElementById('double_down_button');
const split_button = document.getElementById('split_button');
const hit_button_split_left = document.getElementById('hit_button_split_left');
const hit_button_split_right = document.getElementById('hit_button_split_right');
const stand_button_split_left = document.getElementById('stand_button_split_left');
const stand_button_split_right = document.getElementById('stand_button_split_right');

// button states
hit_button.disabled = true;
stand_button.disabled = true;
double_down_button.disabled = true;
split_button.disabled = true;

// scores
const total = document.getElementById('handValue');
const totalDealer = document.getElementById('dealerValue');

// bets
const betValue = document.getElementById('betValue');
const betValueLeft = document.getElementById('betValueLeft');
const betValueRight = document.getElementById('betValueRight');

//money
const moneyValue = document.getElementById('moneyValue');

// sections
const split_section = document.getElementById('splitSection');
split_section.style.display = 'none';

const total_split_left = document.getElementById('handValueLeft');
const total_split_right = document.getElementById('handValueRight');

const split_left = document.getElementById('split_row_left');
const split_right = document.getElementById('split_row_right');

// suits
const spades = '<img src="img/spades.png" alt="spades">';
const clubs = '<img src="img/clubs.png" alt="clubs">';
const diamonds = '<img src="img/diamonds.png" alt="diamonds">';
const hearts = '<img src="img/hearts.png" alt="hearts">';

// card deck template
const imgDeckTemplate = [
  {
    value: 2,
    rank: '<sup>2</sup>',
    suit: spades
  },
  {
    value: 2,
    rank: '<sup>2</sup>',
    suit: clubs
  },
  {
    value: 2,
    rank: '<sup>2</sup>',
    suit: diamonds
  },
  {
    value: 2,
    rank: '<sup>2</sup>',
    suit: hearts
  },
  {
    value: 3,
    rank: '<sup>3</sup>',
    suit: spades
  },
  {
    value: 3,
    rank: '<sup>3</sup>',
    suit: clubs
  },
  {
    value: 3,
    rank: '<sup>3</sup>',
    suit: diamonds
  },
  {
    value: 3,
    rank: '<sup>3</sup>',
    suit: hearts
  },
  {
    value: 4,
    rank: '<sup>4</sup>',
    suit: spades
  },
  {
    value: 4,
    rank: '<sup>4</sup>',
    suit: clubs
  },
  {
    value: 4,
    rank: '<sup>4</sup>',
    suit: diamonds
  },
  {
    value: 4,
    rank: '<sup>4</sup>',
    suit: hearts
  },
  {
    value: 5,
    rank: '<sup>5</sup>',
    suit: spades
  },
  {
    value: 5,
    rank: '<sup>5</sup>',
    suit: clubs
  },
  {
    value: 5,
    rank: '<sup>5</sup>',
    suit: diamonds
  },
  {
    value: 5,
    rank: '<sup>5</sup>',
    suit: hearts
  },
  {
    value: 6,
    rank: '<sup>6</sup>',
    suit: spades
  },
  {
    value: 6,
    rank: '<sup>6</sup>',
    suit: clubs
  },
  {
    value: 6,
    rank: '<sup>6</sup>',
    suit: diamonds
  },
  {
    value: 6,
    rank: '<sup>6</sup>',
    suit: hearts
  },
  {
    value: 7,
    rank: '<sup>7</sup>',
    suit: spades
  },
  {
    value: 7,
    rank: '<sup>7</sup>',
    suit: clubs
  },
  {
    value: 7,
    rank: '<sup>7</sup>',
    suit: diamonds
  },
  {
    value: 7,
    rank: '<sup>7</sup>',
    suit: hearts
  },
  {
    value: 8,
    rank: '<sup>8</sup>',
    suit: spades
  },
  {
    value: 8,
    rank: '<sup>8</sup>',
    suit: clubs
  },
  {
    value: 8,
    rank: '<sup>8</sup>',
    suit: diamonds
  },
  {
    value: 8,
    rank: '<sup>8</sup>',
    suit: hearts
  },
  {
    value: 9,
    rank: '<sup>9</sup>',
    suit: spades
  },
  {
    value: 9,
    rank: '<sup>9</sup>',
    suit: clubs
  },
  {
    value: 9,
    rank: '<sup>9</sup>',
    suit: diamonds
  },
  {
    value: 9,
    rank: '<sup>9</sup>',
    suit: hearts
  },
  {
    value: 10,
    rank: '<sup>10</sup>',
    suit: spades
  },
  {
    value: 10,
    rank: '<sup>10</sup>',
    suit: clubs
  },
  {
    value: 10,
    rank: '<sup>10</sup>',
    suit: diamonds
  },
  {
    value: 10,
    rank: '<sup>10</sup>',
    suit: hearts
  },
  {
    value: 10,
    rank: '<sup>J</sup>',
    suit: spades
  },
  {
    value: 10,
    rank: '<sup>J</sup>',
    suit: clubs
  },
  {
    value: 10,
    rank: '<sup>J</sup>',
    suit: diamonds
  },
  {
    value: 10,
    rank: '<sup>J</sup>',
    suit: hearts
  },
  {
    value: 10,
    rank: '<sup>Q</sup>',
    suit: spades
  },
  {
    value: 10,
    rank: '<sup>Q</sup>',
    suit: clubs
  },
  {
    value: 10,
    rank: '<sup>Q</sup>',
    suit: diamonds
  },
  {
    value: 10,
    rank: '<sup>Q</sup>',
    suit: hearts
  },
  {
    value: 10,
    rank: '<sup>K</sup>',
    suit: spades
  },
  {
    value: 10,
    rank: '<sup>K</sup>',
    suit: clubs
  },
  {
    value: 10,
    rank: '<sup>K</sup>',
    suit: diamonds
  },
  {
    value: 10,
    rank: '<sup>K</sup>',
    suit: hearts
  },
  {
    value: 11,
    alt_value: 1,
    rank: '<sup>A</sup>',
    suit: spades
  },
  {
    value: 11,
    alt_value: 1,
    rank: '<sup>A</sup>',
    suit: clubs
  },
  {
    value: 11,
    alt_value: 1,
    rank: '<sup>A</sup>',
    suit: diamonds
  },
  {
    value: 11,
    alt_value: 1,
    rank: '<sup>A</sup>',
    suit: hearts
  }
];

// the shoe
// consists of 6 deck templates that are cloned into a new array
const cardDeck = [
  ...imgDeckTemplate,
  ...imgDeckTemplate,
  ...imgDeckTemplate,
  ...imgDeckTemplate,
  ...imgDeckTemplate,
  ...imgDeckTemplate
];
