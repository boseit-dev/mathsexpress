/**
 * Original MathsExpress starter lessons, aligned to NSW syllabus FOCUS AREAS.
 * One lesson in each book does NOT mean its focus area or syllabus is complete.
 * Life Skills examples are optional contexts, not prescribed yearly content.
 */
import { isEquationAnswerCorrect } from './pilotEquations';

export interface NotebookQuestion {
  prompt: string;
  answer: number;
  hint: string;
  explanation: string;
}
export interface NotebookLesson {
  bookId: string;
  chapterId: string;
  title: string;
  concept: string;
  visual: string;
  principle: string;
  example: string;
  steps: readonly string[];
  guided: NotebookQuestion;
  practice: readonly NotebookQuestion[];
  recap: readonly string[];
}
type QuestionSeed = readonly [string, number, string, string];
function question([prompt, answer, hint, explanation]: QuestionSeed): NotebookQuestion {
  return { prompt, answer, hint, explanation };
}
function lesson(
  bookId: string,
  chapterId: string,
  title: string,
  concept: string,
  visual: string,
  principle: string,
  example: string,
  steps: readonly string[],
  guided: QuestionSeed,
  practice: readonly QuestionSeed[],
  recap: readonly string[],
): NotebookLesson {
  return {
    bookId,
    chapterId,
    title,
    concept,
    visual,
    principle,
    example,
    steps,
    guided: question(guided),
    practice: practice.map(question),
    recap,
  };
}
export const notebookLessons: readonly NotebookLesson[] = [
  lesson(
    'kindergarten',
    'focus-1',
    'Count small groups',
    'Touch or point to each object once as you count. Do not count the same object twice.',
    '● ● ● ● ●',
    'The last number you say tells how many objects there are.',
    'Count four toy cars.',
    [
      'Point to the first car and say one.',
      'Point to the next cars and say two, three, four.',
      'The last word was four: there are 4 cars.',
    ],
    ['How many dots? ● ● ●', 3, 'Point once to each dot.', 'One, two, three: 3 dots.'],
    [
      ['How many stars? ★ ★', 2, 'Count each star once.', 'There are 2 stars.'],
      ['How many circles? ○ ○ ○ ○', 4, 'Count from left to right.', 'There are 4 circles.'],
    ],
    [
      'Count one object at a time.',
      'Use number words in order.',
      'The final counting word is the total.',
    ],
  ),
  lesson(
    'year-1',
    'focus-1',
    'Build numbers with tens and ones',
    'Ten loose counters can be bundled into one group called a ten. Two bundles and seven loose counters make 27.',
    '20 + 7 = 27',
    'The left digit in a two-digit number counts tens; the right digit counts ones.',
    'Make 34 from tens and ones.',
    ['Three tens make 30.', 'Four ones make 4.', '30 + 4 = 34.'],
    ['How many tens are in 46?', 4, 'Look at the left digit.', '46 has four tens and six ones.'],
    [
      ['How many ones are in 53?', 3, 'Look at the last digit.', '53 has three ones.'],
      ['What is 20 + 8?', 28, 'Combine two tens and eight ones.', '20 + 8 = 28.'],
    ],
    ['Ten ones make a ten.', 'The first digit is tens.', 'The last digit is ones.'],
  ),
  lesson(
    'year-2',
    'focus-1',
    'Understand hundreds, tens and ones',
    'Moving one place left makes each digit ten times as valuable. That is why the 2 in 246 means 200.',
    '246 = 200 + 40 + 6',
    'Read a three-digit number as hundreds, tens and ones.',
    'Break 137 into place values.',
    ['One hundred is 100.', 'Three tens are 30.', 'Seven ones are 7: 100 + 30 + 7 = 137.'],
    [
      'How many tens are in the tens place of 246?',
      4,
      'Find the middle digit.',
      'The middle digit is 4, so there are four tens.',
    ],
    [
      [
        'What is the hundreds digit in 582?',
        5,
        'Look at the first digit.',
        'Five hundreds means 500.',
      ],
      ['What is the ones digit in 407?', 7, 'The ones are on the right.', 'The last digit is 7.'],
    ],
    ['Hundreds are groups of 100.', 'Tens are groups of 10.', 'A digit’s place changes its value.'],
  ),
  lesson(
    'year-3',
    'focus-1',
    'Find the value of a digit',
    'The digit 6 in 462 is not worth 6 ones. It sits in the tens column and is worth six groups of ten.',
    '462 = 400 + 60 + 2',
    'The value of a digit depends on its place.',
    'What is the value of 6 in 462?',
    ['Locate 6 in the tens place.', 'Six tens mean 6 × 10.', 'The value of the digit is 60.'],
    ['What is the value of 4 in 549?', 40, 'The 4 is in the tens column.', 'Four tens make 40.'],
    [
      ['Value of 3 in 307?', 300, 'It sits in the hundreds column.', '3 × 100 = 300.'],
      ['Value of 8 in 682?', 80, 'It sits in the tens column.', '8 × 10 = 80.'],
    ],
    [
      'Find the digit’s column.',
      'Multiply by its place value.',
      'Check your answer using expanded form.',
    ],
  ),
  lesson(
    'year-4',
    'focus-1',
    'Read numbers in the thousands',
    'Place value keeps going beyond hundreds. Every step left is ten times the value of the step before it.',
    '5,248 = 5,000 + 200 + 40 + 8',
    'The thousands place is immediately left of hundreds.',
    'Find the value of 5 in 5,248.',
    [
      'The 5 is in the thousands place.',
      'Five thousands are 5 × 1,000.',
      'The digit is worth 5,000.',
    ],
    ['Value of 3 in 3,614?', 3000, 'Find the thousands digit.', '3 × 1,000 = 3,000.'],
    [
      ['Value of 7 in 7,052?', 7000, 'Check the leftmost place.', '7 thousands = 7,000.'],
      ['Value of 2 in 4,231?', 200, 'The 2 is in the hundreds place.', '2 hundreds = 200.'],
    ],
    [
      'Read numbers by place value.',
      'Thousands come before hundreds.',
      'Expanded form explains each digit.',
    ],
  ),
  lesson(
    'year-5',
    'focus-1',
    'Make sense of decimal tenths',
    'A whole can be cut into ten equal parts. Each part is one tenth, written 0.1.',
    '2.4 = 2 + 0.4',
    'The first digit after the decimal point tells the number of tenths.',
    'Explain the number 2.4.',
    ['The 2 means two whole units.', 'The 4 means four tenths: 0.4.', 'Together, 2 + 0.4 = 2.4.'],
    ['Value of 7 in 3.7?', 0.7, 'One place after the point means tenths.', '7 tenths = 0.7.'],
    [
      ['Value of 2 in 5.2?', 0.2, 'Think about tenths.', '2 tenths = 0.2.'],
      ['What is 1 + 0.9?', 1.9, 'Add one whole and nine tenths.', '1 + 0.9 = 1.9.'],
    ],
    [
      'Decimals describe parts of a whole.',
      'Tenths are the first decimal place.',
      'Ten tenths equal one whole.',
    ],
  ),
  lesson(
    'year-6',
    'focus-1',
    'Compare tenths and hundredths',
    'Imagine a grid divided into 100 equal pieces. Thirty shaded squares mean 0.30, while only three mean 0.03.',
    '0.36 = 0.30 + 0.06',
    'The second decimal place counts hundredths.',
    'Break down 0.36.',
    ['Three tenths are 0.30.', 'Six hundredths are 0.06.', 'Together: 0.30 + 0.06 = 0.36.'],
    ['Value of 5 in 2.05?', 0.05, 'The 5 is in the hundredths place.', '5 hundredths = 0.05.'],
    [
      ['Value of 4 in 1.04?', 0.04, 'Look at the second decimal place.', '4 hundredths = 0.04.'],
      ['Value of 6 in 3.62?', 0.6, 'The 6 is in the tenths place.', '6 tenths = 0.6.'],
    ],
    [
      'Tenths and hundredths have different sizes.',
      '0.30 is the same as 0.3.',
      'Use place value to compare.',
    ],
  ),
  lesson(
    'year-7',
    'core-1',
    'Find a percentage of an amount',
    'Percent means “out of a hundred”. Ten per cent is the same as one tenth.',
    '10% = 10/100 = 0.1',
    'To find 10%, divide by ten. To find 20%, double the 10% result.',
    'Find 10% of $70.',
    ['Ten per cent means one tenth.', 'Divide $70 by 10 to get $7.', 'The answer is $7.'],
    ['What is 10% of $90?', 9, 'Divide 90 by 10.', '90 ÷ 10 = 9.'],
    [
      ['What is 10% of $50?', 5, 'Find one tenth.', '50 ÷ 10 = 5.'],
      ['What is 20% of $30?', 6, 'Double 10% of 30.', '10% is 3, so 20% is 6.'],
    ],
    [
      'Percent means out of 100.',
      'Ten per cent is a tenth.',
      'Build larger percentages from simple ones.',
    ],
  ),
  lesson(
    'year-8',
    'core-1',
    'Calculate sale discounts',
    'A discount is taken away from the original price. Finding the discount alone does not tell you the sale price.',
    '$80 − $20 = $60',
    'Sale price = original price − discount amount.',
    'A $80 bag is reduced by 25%.',
    ['25% is one quarter.', 'One quarter of 80 is $20.', 'Subtract $20 from $80: pay $60.'],
    ['Sale price of $50 with 10% off?', 45, 'Ten per cent is $5. Subtract it.', '$50 − $5 = $45.'],
    [
      ['Sale price of $40 with 20% off?', 32, '20% of $40 is $8.', '$40 − $8 = $32.'],
      ['Sale price of $100 with 25% off?', 75, '25% is one quarter.', '$100 − $25 = $75.'],
    ],
    [
      'Work out the saving.',
      'Subtract it from the original cost.',
      'Check the sale price is smaller.',
    ],
  ),
  lesson(
    'year-9',
    'core-1',
    'Understand simple interest',
    'Simple interest is calculated using the original starting amount each year, rather than a changing balance.',
    'Interest = principal × rate × time',
    'Write the annual percentage as a decimal, then multiply by the original amount and years.',
    'Find interest on $100 at 5% for two years.',
    [
      'Five per cent becomes 0.05.',
      'One year earns 100 × 0.05 = $5.',
      'Two years earn $5 × 2 = $10.',
    ],
    ['Interest on $200 at 5% for one year?', 10, 'Calculate 200 × 0.05.', '$10 interest.'],
    [
      ['Interest on $100 at 10% for three years?', 30, 'Each year earns $10.', '3 × $10 = $30.'],
      [
        'Interest on $500 at 4% for two years?',
        40,
        'Calculate one year first.',
        '$20 per year × 2 = $40.',
      ],
    ],
    [
      'Use the starting principal each time.',
      'Convert the rate to a decimal.',
      'Multiply by the number of years.',
    ],
  ),
  lesson(
    'year-10',
    'core-1',
    'Explore compound growth',
    'Compound interest uses the new balance each year, so interest also earns interest.',
    '$100 → $110 → $121',
    'Multiply the current balance by 1 + the decimal rate each period.',
    'Let $100 grow by 10% for two years.',
    [
      'First year: $100 × 1.10 = $110.',
      'Second year starts with $110.',
      'Then $110 × 1.10 = $121.',
    ],
    [
      'Final amount: $200 growing at 10% for 2 years?',
      242,
      'Multiply 200 by 1.10 twice.',
      '$200 → $220 → $242.',
    ],
    [
      [
        'Final amount: $100 at 20% for 2 years?',
        144,
        'Multiply by 1.20 twice.',
        '$100 → $120 → $144.',
      ],
      [
        'Final amount: $200 at 5% for 2 years?',
        220.5,
        'Multiply by 1.05 twice.',
        '$200 × 1.05 × 1.05 = $220.50.',
      ],
    ],
    [
      'Each period uses a new balance.',
      'Multiply by 1 plus the decimal rate.',
      'Compound and simple interest are different.',
    ],
  ),
  lesson(
    'year-7-life-skills',
    'life-skills-1',
    'Count different coins',
    'Coins have different values. Add the numbers on the coins, not just the number of coins.',
    '$1 + $1 + $2 = $4',
    'Count money by adding the value of every coin or note.',
    'Find the value of two $1 coins and one $2 coin.',
    ['Two one-dollar coins make $2.', 'Add the two-dollar coin.', 'Altogether the value is $4.'],
    [
      'Three $1 coins and one $2 coin are worth how many dollars?',
      5,
      'Add 1 + 1 + 1 + 2.',
      '$3 + $2 = $5.',
    ],
    [
      ['Two $2 coins and one $1 coin are worth?', 5, 'Add 2 + 2 + 1.', '$5.'],
      ['A $5 note and a $2 coin are worth?', 7, 'Add 5 and 2.', '$7.'],
    ],
    ['Read the value on each coin.', 'Group matching coins.', 'Add the values carefully.'],
  ),
  lesson(
    'year-8-life-skills',
    'life-skills-1',
    'Work out shopping change',
    'When you hand over more money than an item costs, the money returned is called change.',
    '$10 paid − $6 cost = $4 change',
    'Subtract the cost from the amount paid.',
    'You pay $10 for a $6 lunch.',
    [
      'Start with the $10 you paid.',
      'Take away the lunch price of $6.',
      'You should receive $4 change.',
    ],
    ['Change from $20 for a $13 item?', 7, 'Count up from 13 to 20.', '$20 − $13 = $7.'],
    [
      ['Change from $10 for an $8 item?', 2, 'Subtract 8 from 10.', '$2.'],
      ['Change from $20 for a $17 item?', 3, 'Count from 17 to 20.', '$3.'],
    ],
    [
      'Change is money returned.',
      'Subtract the item cost.',
      'Price plus change should equal the amount paid.',
    ],
  ),
  lesson(
    'year-9-life-skills',
    'life-skills-1',
    'Plan with a simple budget',
    'A budget helps you see what you can spend and how much you will still have.',
    '$30 − $12 − $8 = $10 left',
    'Add all costs before taking them away from your total money.',
    'You have $30 and plan purchases of $12 and $8.',
    [
      'Add the costs: $12 + $8 = $20.',
      'Subtract $20 from the money available.',
      '$30 − $20 = $10 left.',
    ],
    [
      'Budget $40. Spend $15 and $10. How much remains?',
      15,
      'Total spending is $25.',
      '$40 − $25 = $15.',
    ],
    [
      [
        'Budget $50. Spend $20 and $10. What remains?',
        20,
        'Add expenses first.',
        '$50 − $30 = $20.',
      ],
      ['Budget $30. Spend $10 and $5. What remains?', 15, 'Add 10 and 5.', '$30 − $15 = $15.'],
    ],
    [
      'Begin with what is available.',
      'Add all planned expenses.',
      'Subtract to find what remains.',
    ],
  ),
  lesson(
    'year-10-life-skills',
    'life-skills-1',
    'Compare prices per item',
    'Pack prices can hide how much a single item costs. Divide the total cost by how many identical items are in the pack.',
    '$6 ÷ 3 items = $2 each',
    'Unit price = pack price ÷ number of items.',
    'Three identical items cost $6.',
    ['There are three items.', 'Divide $6 into three equal parts.', 'Each item costs $2.'],
    ['Four bottles cost $12. Price per bottle?', 3, 'Divide 12 by 4.', '$3 each.'],
    [
      ['Six pens cost $12. Price per pen?', 2, 'Divide 12 by 6.', '$2.'],
      ['Five apples cost $15. Price per apple?', 3, 'Divide 15 by 5.', '$3.'],
    ],
    [
      'Count the items in the pack.',
      'Divide total cost by that number.',
      'Compare unit prices to find value.',
    ],
  ),
  lesson(
    'year-11-standard',
    'focus-1',
    'Substitute values into formulas',
    'A formula gives a rule using letters for quantities. Replace each letter with its value to solve real problems.',
    'Area = length × width',
    'Write the formula, substitute known values, then evaluate.',
    'Find rectangle area with length 8 m and width 3 m.',
    ['Start with area = length × width.', 'Substitute 8 and 3.', '8 × 3 = 24 square metres.'],
    [
      'Distance = speed × time. At 60 km/h for 2 hours, how far?',
      120,
      'Multiply 60 by 2.',
      '120 km.',
    ],
    [
      ['Area of a 7-by-4 rectangle?', 28, 'Multiply side lengths.', '28 square units.'],
      ['Cost = 15 + 3n. Find cost when n = 4.', 27, 'Replace n with 4.', '15 + 3 × 4 = 27.'],
    ],
    ['Write the rule first.', 'Substitute the values.', 'Use the right units.'],
  ),
  lesson(
    'year-11-advanced',
    'focus-1',
    'Work with function notation',
    'A function takes an input and uses a rule to create an output. f(4) means use 4 as the input for f.',
    'f(x) = 2x + 3',
    'To find f(a), replace x with a and calculate.',
    'Given f(x) = 2x + 3, find f(4).',
    ['Replace x with 4.', 'Calculate 2 × 4 + 3.', 'f(4) = 8 + 3 = 11.'],
    ['If f(x) = x² + 1, what is f(3)?', 10, 'Square 3 then add 1.', '9 + 1 = 10.'],
    [
      ['If f(x) = 3x − 2, find f(5).', 13, 'Use x = 5.', '15 − 2 = 13.'],
      ['If g(x) = x² − 4, find g(6).', 32, 'Square 6 then subtract 4.', '36 − 4 = 32.'],
    ],
    [
      'A function connects input and output.',
      'Function notation gives the input.',
      'Follow the order of operations.',
    ],
  ),
  lesson(
    'year-11-extension-1',
    'focus-1',
    'Compose two functions',
    'One function can take another function’s output as its input. Read composite notation from the inside out.',
    'f(g(4)) → g first → f second',
    'In f(g(x)), apply g, then apply f to the result.',
    'Let f(x) = x + 2 and g(x) = 3x. Find f(g(4)).',
    ['First find g(4) = 12.', 'Use 12 as the input to f.', 'f(12) = 12 + 2 = 14.'],
    ['Find f(g(2)) using the same rules.', 8, 'Start with g(2) = 6.', 'f(6) = 8.'],
    [
      ['Find f(g(5)).', 17, 'g(5) = 15.', 'f(15) = 17.'],
      ['Find g(f(2)).', 12, 'Apply f first this time.', 'f(2) = 4; g(4) = 12.'],
    ],
    [
      'Work inside out.',
      'One output becomes the next input.',
      'The order usually changes the result.',
    ],
  ),
  lesson(
    'year-11-life-skills',
    'focus-1',
    'Compare everyday amounts',
    'We compare numbers when checking prices, counting supplies and organising everyday activities.',
    '21 > 18',
    'Compare the largest place-value digits first.',
    'Which is larger, 18 or 21?',
    [
      'Compare the tens digits: 1 and 2.',
      'Two tens is greater than one ten.',
      '21 is larger than 18.',
    ],
    [
      'Which is larger, 12 or 19? Enter the larger number.',
      19,
      'Tens match. Compare the ones.',
      '9 ones are more than 2 ones.',
    ],
    [
      ['Which is larger, 35 or 29?', 35, 'Look at the tens first.', '3 tens > 2 tens.'],
      ['Which is larger, 6 or 8?', 8, 'Think about counting forward.', '8 is larger.'],
    ],
    [
      'Start with the largest place.',
      'If tied, compare the next digit.',
      'Use real objects to check.',
    ],
  ),
  lesson(
    'year-12-standard-1',
    'focus-1',
    'Predict values with a linear rule',
    'A linear relationship rises by the same amount each time the input increases by one.',
    'y = 3x + 2',
    'Substitute the input into the rule to calculate an output.',
    'Given y = 3x + 2, find y when x = 4.',
    ['Multiply 3 × 4 = 12.', 'Add 2.', 'The output is 14.'],
    ['Find y when x = 5.', 17, 'Calculate 3 × 5 + 2.', '15 + 2 = 17.'],
    [
      ['Find y when x = 2.', 8, 'Multiply before adding.', '6 + 2 = 8.'],
      ['Find y when x = 7.', 23, '3 × 7 + 2.', '21 + 2 = 23.'],
    ],
    [
      'Linear rules have constant change.',
      'Use a table to spot the pattern.',
      'Check outputs using the rule.',
    ],
  ),
  lesson(
    'year-12-standard-2',
    'focus-1',
    'Explore a quadratic rule',
    'A squared variable changes a pattern. The graph of a quadratic relationship is curved rather than a straight line.',
    'y = x² + 2x',
    'Evaluate the square before combining the other terms.',
    'Find y = x² + 2x when x = 3.',
    ['Square 3 to get 9.', 'Multiply 2 × 3 to get 6.', 'Add 9 + 6 = 15.'],
    ['Find y when x = 4.', 24, 'Calculate 4² + 8.', '16 + 8 = 24.'],
    [
      ['Find y when x = 2.', 8, 'Square first.', '4 + 4 = 8.'],
      ['Find y when x = 5.', 35, '25 + 10.', '35.'],
    ],
    [
      'Quadratic rules include a squared variable.',
      'Squares come before addition.',
      'The differences between outputs change.',
    ],
  ),
  lesson(
    'year-12-advanced',
    'focus-1',
    'Move a parabola',
    'Numbers inside and outside a squared bracket shift the graph of y = x² without changing its shape.',
    'y = (x − 2)² + 3',
    'The turning point of y = (x − h)² + k is (h, k).',
    'Find the turning point of y = (x − 2)² + 3.',
    ['Compare with (x − h)² + k.', 'Read h = 2 and k = 3.', 'The turning point is (2, 3).'],
    [
      'x-coordinate of turning point for y = (x − 5)² + 1?',
      5,
      'Read h from x − h.',
      'The x-coordinate is 5.',
    ],
    [
      [
        'x-coordinate for y = (x − 1)² + 4?',
        1,
        'Look inside the bracket.',
        'The turning point is (1, 4).',
      ],
      [
        'y-coordinate for y = (x + 3)² + 2?',
        2,
        'Look outside the square.',
        'The turning point is (−3, 2).',
      ],
    ],
    [
      'Vertex form gives the turning point.',
      'x − h moves horizontally.',
      'Adding k moves vertically.',
    ],
  ),
  lesson(
    'year-12-extension-1',
    'focus-1',
    'Understand proof by induction',
    'Induction can prove a statement for every positive integer: prove the first case, then show each true case leads to the next.',
    '1 + 2 + … + n = n(n + 1)/2',
    'Prove the base case, assume n = k, then prove n = k + 1.',
    'Prove the formula for the sum 1 + 2 + … + n.',
    [
      'Base case n = 1 gives 1 = 1(2)/2.',
      'Assume 1 + … + k = k(k + 1)/2.',
      'Add k + 1: k(k + 1)/2 + (k + 1) = (k + 1)(k + 2)/2.',
      'This is the formula for k + 1, so the induction step holds.',
    ],
    ['Using the formula, what is 1 + 2 + 3?', 6, 'Use 3(4)/2.', 'The sum is 6.'],
    [
      ['What is 1 + 2 + 3 + 4?', 10, 'Use n = 4.', '4 × 5 ÷ 2 = 10.'],
      ['What is 1 + 2 + 3 + 4 + 5?', 15, 'Use n = 5.', '5 × 6 ÷ 2 = 15.'],
    ],
    ['Prove the first case.', 'Assume the kth case.', 'Prove the next case follows.'],
  ),
  lesson(
    'year-12-extension-2',
    'focus-1',
    'Disprove claims with counterexamples',
    'A statement that says “every” or “all” must be true in every case. Just one counterexample disproves it.',
    '“All primes are odd” → 2 is prime and even',
    'Find one valid case where a universal statement fails.',
    'Test the claim “Every prime number is odd”.',
    [
      'The claim includes all prime numbers.',
      'The number 2 is prime: its only positive factors are 1 and 2.',
      'But 2 is even. That one counterexample disproves the claim.',
    ],
    [
      'The claim “all positive integers x have x² > x” fails at x = 1. Enter x.',
      1,
      'What is 1²?',
      '1² = 1, which is not greater than 1.',
    ],
    [
      [
        'Disprove “all positive even integers are greater than 5” with the smallest positive even integer.',
        2,
        'Try the first even positive integer.',
        '2 is even and less than 5.',
      ],
      [
        'Disprove “every integer square is positive” using zero. Enter the integer.',
        0,
        'Consider 0 squared.',
        '0² = 0, which is not positive.',
      ],
    ],
    [
      'Look for universal words.',
      'Find one counterexample.',
      'A counterexample disproves the claim.',
    ],
  ),
  lesson(
    'year-12-life-skills',
    'focus-1',
    'Add prices before shopping',
    'Adding costs tells us whether we have enough money to buy the items we choose.',
    '$8 + $5 = $13',
    'Add all prices before comparing the total with your available money.',
    'An $8 item and a $5 item go in a basket.',
    ['Start with the first price of $8.', 'Add the second price: $5.', 'The total cost is $13.'],
    ['A $9 item and a $6 item cost how much together?', 15, 'Add 9 and 6.', '$9 + $6 = $15.'],
    [
      ['A $12 item and a $3 item cost how much?', 15, 'Add prices.', '$12 + $3 = $15.'],
      [
        'You have $20 and spend $13. How much remains?',
        7,
        'Subtract what you spend.',
        '$20 − $13 = $7.',
      ],
    ],
    ['Read prices carefully.', 'Add before paying.', 'Check how much money is left.'],
  ),
];

export function findNotebookLesson(bookId: string, chapterId: string): NotebookLesson | undefined {
  return notebookLessons.find((entry) => entry.bookId === bookId && entry.chapterId === chapterId);
}

export function checkNotebookAnswer(input: string, answer: number): boolean {
  return isEquationAnswerCorrect(input, answer);
}
