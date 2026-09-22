'use strict';
var __modules = window.__modules || (window.__modules = Object.create(null));
// module: src/data/questions.js
__modules["src/data/questions.js"]=(()=>{
const LESSONS = [
  {
    id: 'simplify',
    topic: 'algebra',
    title: 'Simplifying expressions',
    description: 'Collect like terms and make expressions cleaner.',
    explanation: 'Like terms have the same variable part. Add or subtract only their coefficients.',
    example: '3x + 2x - 4 = 5x - 4',
  },
  {
    id: 'expand',
    topic: 'algebra',
    title: 'Expanding brackets',
    description: 'Multiply terms outside brackets through every term inside.',
    explanation: 'Use the distributive law: a(b + c) = ab + ac.',
    example: '4(x + 3) = 4x + 12',
  },
  {
    id: 'linear',
    topic: 'algebra',
    title: 'Solving linear equations',
    description: 'Undo operations to isolate the variable.',
    explanation: 'Keep equations balanced by doing the same operation to both sides.',
    example: '3x + 5 = 20 → 3x = 15 → x = 5',
  },
  {
    id: 'substitution',
    topic: 'algebra',
    title: 'Substitution and formulas',
    description: 'Replace variables with known values and calculate.',
    explanation: 'Substitute carefully, use brackets for negative values, then follow order of operations.',
    example: 'If a = 4, then 3a + 2 = 14',
  },
];
const QUESTIONS = [
  {
    id: 's1', lessonId: 'simplify', topic: 'algebra', difficulty: 1, type: 'expression',
    prompt: 'Simplify: 2x + 3x', acceptedAnswers: ['5x', 'x*5'],
    hints: ['Both terms are x terms.', 'Add the coefficients 2 and 3.'],
    workedSolution: '2x + 3x = (2 + 3)x = 5x.', xp: 18,
  },
  {
    id: 's2', lessonId: 'simplify', topic: 'algebra', difficulty: 1, type: 'expression',
    prompt: 'Simplify: 7y - 2y', acceptedAnswers: ['5y', 'y*5'],
    hints: ['These are like terms.', 'Subtract 2 from 7.'],
    workedSolution: '7y - 2y = 5y.', xp: 18,
  },
  {
    id: 's3', lessonId: 'simplify', topic: 'algebra', difficulty: 2, type: 'expression',
    prompt: 'Simplify: 4a + 3 + 2a - 1', acceptedAnswers: ['6a+2', '2+6a'],
    hints: ['Collect variable terms and constants separately.', '4a + 2a = 6a and 3 - 1 = 2.'],
    workedSolution: '4a + 2a + 3 - 1 = 6a + 2.', xp: 22,
  },
  {
    id: 's4', lessonId: 'simplify', topic: 'algebra', difficulty: 2, type: 'multiple-choice',
    prompt: 'Which is equivalent to 5m + 2 - 3m?', answer: 'b',
    options: [{id:'a',label:'8m + 2'},{id:'b',label:'2m + 2'},{id:'c',label:'2m - 2'}],
    hints: ['Only combine the m terms.', '5m - 3m = 2m.'],
    workedSolution: '5m - 3m + 2 = 2m + 2.', xp: 20,
  },
  {
    id: 's5', lessonId: 'simplify', topic: 'algebra', difficulty: 3, type: 'expression',
    prompt: 'Simplify: 3p + 4q - p + 2q', acceptedAnswers: ['2p+6q', '6q+2p'],
    hints: ['p terms and q terms are different groups.', '3p - p = 2p and 4q + 2q = 6q.'],
    workedSolution: '3p - p + 4q + 2q = 2p + 6q.', xp: 28,
  },
  {
    id: 'e1', lessonId: 'expand', topic: 'algebra', difficulty: 1, type: 'expression',
    prompt: 'Expand: 3(x + 4)', acceptedAnswers: ['3x+12', '12+3x'],
    hints: ['Multiply 3 by each term inside the bracket.', '3 × x and 3 × 4.'],
    workedSolution: '3(x + 4) = 3x + 12.', xp: 18,
  },
  {
    id: 'e2', lessonId: 'expand', topic: 'algebra', difficulty: 1, type: 'expression',
    prompt: 'Expand: 5(y - 2)', acceptedAnswers: ['5y-10'],
    hints: ['Multiply 5 by y and by -2.', '5 × -2 = -10.'],
    workedSolution: '5(y - 2) = 5y - 10.', xp: 18,
  },
  {
    id: 'e3', lessonId: 'expand', topic: 'algebra', difficulty: 2, type: 'expression',
    prompt: 'Expand: -2(a + 6)', acceptedAnswers: ['-2a-12', '-12-2a'],
    hints: ['The negative sign affects both terms.', '-2 × 6 = -12.'],
    workedSolution: '-2(a + 6) = -2a - 12.', xp: 24,
  },
  {
    id: 'e4', lessonId: 'expand', topic: 'algebra', difficulty: 2, type: 'multiple-choice',
    prompt: 'Which is the correct expansion of 4(2x + 3)?', answer: 'c',
    options: [{id:'a',label:'8x + 3'},{id:'b',label:'6x + 12'},{id:'c',label:'8x + 12'}],
    hints: ['Multiply 4 by both 2x and 3.', '4 × 2x = 8x.'],
    workedSolution: '4(2x + 3) = 8x + 12.', xp: 22,
  },
  {
    id: 'e5', lessonId: 'expand', topic: 'algebra', difficulty: 3, type: 'expression',
    prompt: 'Expand and simplify: 2(x + 5) + 3x', acceptedAnswers: ['5x+10', '10+5x'],
    hints: ['Expand the bracket first.', '2x + 10 + 3x has like x terms.'],
    workedSolution: '2x + 10 + 3x = 5x + 10.', xp: 30,
  },
  {
    id: 'l1', lessonId: 'linear', topic: 'algebra', difficulty: 1, type: 'linear-equation',
    prompt: 'Solve: x + 6 = 11', answer: 5,
    hints: ['Undo +6.', 'Subtract 6 from both sides.'],
    workedSolution: 'x + 6 = 11 → x = 5.', xp: 18,
  },
  {
    id: 'l2', lessonId: 'linear', topic: 'algebra', difficulty: 1, type: 'linear-equation',
    prompt: 'Solve: 4x = 28', answer: 7,
    hints: ['Undo multiplication by 4.', 'Divide both sides by 4.'],
    workedSolution: '4x = 28 → x = 7.', xp: 18,
  },
  {
    id: 'l3', lessonId: 'linear', topic: 'algebra', difficulty: 2, type: 'linear-equation',
    prompt: 'Solve: 3x + 2 = 17', answer: 5,
    hints: ['Undo +2 first.', '3x = 15, then divide by 3.'],
    workedSolution: '3x + 2 = 17 → 3x = 15 → x = 5.', xp: 24,
  },
  {
    id: 'l4', lessonId: 'linear', topic: 'algebra', difficulty: 2, type: 'step-entry', answerKind: 'linear-equation',
    prompt: 'Solve: 5x - 9 = 21', answer: 6,
    workingSteps: ['Add 9 to both sides', 'Divide both sides by 5'],
    hints: ['Remove -9 first.', '5x = 30.'],
    workedSolution: '5x - 9 = 21 → 5x = 30 → x = 6.', xp: 26,
  },
  {
    id: 'l5', lessonId: 'linear', topic: 'algebra', difficulty: 3, type: 'linear-equation',
    prompt: 'Solve: 2x + 7 = x + 16', answer: 9,
    hints: ['Move x terms to one side.', 'Subtract x, then subtract 7.'],
    workedSolution: '2x + 7 = x + 16 → x + 7 = 16 → x = 9.', xp: 32,
  },
  {
    id: 'u1', lessonId: 'substitution', topic: 'algebra', difficulty: 1, type: 'numeric',
    prompt: 'If x = 4, find 3x + 2.', answer: 14,
    hints: ['Replace x with 4.', '3 × 4 + 2.'],
    workedSolution: '3(4) + 2 = 12 + 2 = 14.', xp: 18,
  },
  {
    id: 'u2', lessonId: 'substitution', topic: 'algebra', difficulty: 1, type: 'numeric',
    prompt: 'If a = 6, find 2a - 5.', answer: 7,
    hints: ['Replace a with 6.', '12 - 5.'],
    workedSolution: '2(6) - 5 = 7.', xp: 18,
  },
  {
    id: 'u3', lessonId: 'substitution', topic: 'algebra', difficulty: 2, type: 'numeric',
    prompt: 'If p = 3 and q = 5, find 2p + q.', answer: 11,
    hints: ['Substitute both values.', '2 × 3 + 5.'],
    workedSolution: '2(3) + 5 = 11.', xp: 22,
  },
  {
    id: 'u4', lessonId: 'substitution', topic: 'algebra', difficulty: 2, type: 'multiple-choice',
    prompt: 'If r = -2, what is r² + 3?', answer: 'c',
    options: [{id:'a',label:'-1'},{id:'b',label:'1'},{id:'c',label:'7'}],
    hints: ['Put the negative value in brackets.', '(-2)² = 4.'],
    workedSolution: '(-2)² + 3 = 4 + 3 = 7.', xp: 22,
  },
  {
    id: 'u5', lessonId: 'substitution', topic: 'algebra', difficulty: 3, type: 'numeric',
    prompt: 'Use A = lw. If l = 7.5 and w = 4, find A.', answer: 30,
    hints: ['Replace l and w in the formula.', '7.5 × 4.'],
    workedSolution: 'A = 7.5 × 4 = 30.', xp: 28,
  },
];
function getLessonById(id) {
  return LESSONS.find((lesson) => lesson.id === id) ?? null;
}
function getQuestionById(id) {
  return QUESTIONS.find((question) => question.id === id) ?? null;
}
function getQuestionsForLesson(lessonId) {
  return QUESTIONS.filter((question) => question.lessonId === lessonId);
}

return {LESSONS,QUESTIONS,getLessonById,getQuestionById,getQuestionsForLesson};
})();
// module: src/data/curriculum.js
__modules["src/data/curriculum.js"]=(()=>{
const YEARS = Object.freeze([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

const skill = (yearLevel, id, title, strand, topic, generator, pathway = 'Core', learningGoal = '') => Object.freeze({
  yearLevel,
  id,
  title,
  strand,
  topic,
  generator,
  pathway,
  learningGoal: learningGoal || `Build confidence with ${title.toLowerCase()} through accurate working and reasoning.`,
});


const YK = [
  skill(0,'counting-20','Counting to 20','Number','Number','early-counting'),
  skill(0,'compare-numbers','Comparing small numbers','Number','Number','early-comparison'),
  skill(0,'addition-to-10','Addition stories to 10','Number','Number','early-addition'),
  skill(0,'subtraction-to-10','Subtraction stories to 10','Number','Number','early-addition'),
  skill(0,'equal-groups','Equal groups and sharing','Number','Number','early-groups'),
  skill(0,'patterns','Repeating patterns','Algebra','Patterns','early-patterns'),
  skill(0,'shapes-2d-3d','Recognising 2D and 3D shapes','Measurement & Geometry','Geometry','early-shapes'),
  skill(0,'position','Position and direction words','Measurement & Geometry','Geometry','early-shapes'),
  skill(0,'compare-length','Comparing length and capacity','Measurement & Geometry','Measurement','early-measure'),
  skill(0,'daily-time','Daily routines and time words','Measurement & Geometry','Measurement','early-time'),
  skill(0,'simple-data','Sorting and simple data displays','Statistics & Data','Statistics','early-data'),
  skill(0,'everyday-chance','Everyday chance language','Probability','Probability','early-chance'),
];

const Y1 = [
  skill(1,'numbers-100','Numbers to 100','Number','Number','early-counting'),
  skill(1,'place-value-tens','Tens and ones','Number','Number','early-counting'),
  skill(1,'addition-subtraction-20','Addition and subtraction to 20','Number','Number','early-addition'),
  skill(1,'groups-sharing','Equal groups and sharing','Number','Number','early-groups'),
  skill(1,'halves','Halves of shapes and collections','Number','Fractions','early-fractions'),
  skill(1,'patterns','Growing and repeating patterns','Algebra','Patterns','early-patterns'),
  skill(1,'length-mass-capacity','Length, mass and capacity','Measurement & Geometry','Measurement','early-measure'),
  skill(1,'time-half-hour','Telling time to the half-hour','Measurement & Geometry','Measurement','early-time'),
  skill(1,'money-coins','Australian coins and simple totals','Number','Financial Maths','early-money'),
  skill(1,'shapes','2D and 3D shapes','Measurement & Geometry','Geometry','early-shapes'),
  skill(1,'chance','Likely and unlikely events','Probability','Probability','early-chance'),
  skill(1,'data','Lists, tables and picture graphs','Statistics & Data','Statistics','early-data'),
];

const Y2 = [
  skill(2,'numbers-1000','Numbers to 1000','Number','Number','early-counting'),
  skill(2,'place-value-hundreds','Hundreds, tens and ones','Number','Number','early-counting'),
  skill(2,'addition-subtraction','Two-digit addition and subtraction','Number','Number','early-addition'),
  skill(2,'multiplication-division','Multiplication and division as equal groups','Number','Number','early-groups'),
  skill(2,'fractions','Halves, quarters and eighths','Number','Fractions','early-fractions'),
  skill(2,'money','Money totals and simple change','Number','Financial Maths','early-money'),
  skill(2,'patterns-rules','Number patterns and simple rules','Algebra','Patterns','early-patterns'),
  skill(2,'unknowns-intro','Missing numbers in number sentences','Algebra','Equations','early-addition'),
  skill(2,'length-perimeter','Length and perimeter basics','Measurement & Geometry','Measurement','early-measure'),
  skill(2,'time','Time to five minutes and duration','Measurement & Geometry','Measurement','early-time'),
  skill(2,'shapes-turns','Shapes, turns and symmetry','Measurement & Geometry','Geometry','early-shapes'),
  skill(2,'chance','Chance experiments','Probability','Probability','early-chance'),
  skill(2,'data-displays','Tables, picture graphs and column graphs','Statistics & Data','Statistics','early-data'),
];

const Y3 = [
  skill(3,'place-value','Place value to thousands','Number','Number','arithmetic'),
  skill(3,'addition-subtraction','Addition and subtraction strategies','Number','Number','arithmetic'),
  skill(3,'multiplication-division','Multiplication and division facts','Number','Number','arithmetic'),
  skill(3,'fractions-halves-quarters','Halves, quarters and eighths','Number','Fractions','fraction'),
  skill(3,'money','Money and simple totals','Number','Financial Maths','finance-simple'),
  skill(3,'patterns','Number patterns','Algebra','Patterns','sequence-linear'),
  skill(3,'length-area','Length, perimeter and area basics','Measurement & Geometry','Measurement','measurement-2d'),
  skill(3,'time','Time and duration','Measurement & Geometry','Measurement','arithmetic'),
  skill(3,'angles-shapes','Angles and 2D shapes','Measurement & Geometry','Geometry','angles'),
  skill(3,'chance','Chance language and simple probability','Probability','Probability','probability'),
  skill(3,'data-displays','Picture graphs and column graphs','Statistics & Data','Statistics','data-display'),
  skill(3,'coordinates-intro','Grid references and coordinates','Functions & Graphs','Graphs','coordinates'),
];

const Y4 = [
  skill(4,'place-value','Place value to tens of thousands','Number','Number','arithmetic'),
  skill(4,'four-operations','Four operations strategies','Number','Number','arithmetic'),
  skill(4,'factors-multiples-intro','Factors and multiples introduction','Number','Number','divisibility'),
  skill(4,'fractions','Equivalent fractions','Number','Fractions','fraction'),
  skill(4,'decimals-intro','Tenths and hundredths','Number','Decimals','decimal'),
  skill(4,'percentages-intro','Simple percentages','Number','Percentages','percentage'),
  skill(4,'patterns-rules','Patterns and rules','Algebra','Patterns','sequence-linear'),
  skill(4,'coordinates','Coordinates and grids','Functions & Graphs','Graphs','coordinates'),
  skill(4,'perimeter-area','Perimeter and area','Measurement & Geometry','Measurement','measurement-2d'),
  skill(4,'volume-capacity','Volume and capacity basics','Measurement & Geometry','Measurement','measurement-3d'),
  skill(4,'angles','Comparing and measuring angles','Measurement & Geometry','Geometry','angles'),
  skill(4,'probability','Simple probability experiments','Probability','Probability','probability'),
  skill(4,'statistics','Data displays, mean and range basics','Statistics & Data','Statistics','data-display'),
];

const CURRICULUM_SYSTEMS = Object.freeze([
  'NSW Mathematics K–10',
  'Australian Curriculum Mathematics F–10A',
  'Victorian Curriculum Mathematics F–10',
  'US Common Core Mathematics K–12',
  'Florida B.E.S.T. Mathematics',
  'Virginia Standards of Learning Mathematics',
  'IB Mathematics',
  'Cambridge IGCSE Mathematics',
  'Ontario Mathematics Curriculum',
  'Custom / Other',
]);

const Y5 = [
  skill(5,'whole-number-place-value','Whole numbers and place value','Number','Number','arithmetic'),
  skill(5,'four-operations','Four operations with whole numbers','Number','Number','arithmetic'),
  skill(5,'factors-multiples','Factors and multiples','Number','Number','divisibility'),
  skill(5,'fractions','Equivalent fractions and fraction operations','Number','Fractions','fraction'),
  skill(5,'decimals','Decimals and place value','Number','Decimals','decimal'),
  skill(5,'percentages-intro','Percentages introduction','Number','Percentages','percentage'),
  skill(5,'ratio-intro','Ratios introduction','Number','Ratio & Rates','ratio'),
  skill(5,'patterns','Number patterns','Algebra','Patterns','sequence-linear'),
  skill(5,'coordinates','Coordinates in the first quadrant','Functions & Graphs','Graphs','coordinates'),
  skill(5,'perimeter-area','Perimeter and area','Measurement & Geometry','Measurement','measurement-2d'),
  skill(5,'volume','Volume of rectangular prisms','Measurement & Geometry','Measurement','measurement-3d'),
  skill(5,'angles','Angles and turns','Measurement & Geometry','Geometry','angles'),
  skill(5,'probability','Chance and probability','Probability','Probability','probability'),
  skill(5,'data-displays','Tables, graphs and data displays','Statistics & Data','Statistics','data-display'),
  skill(5,'averages-intro','Mean and range introduction','Statistics & Data','Statistics','statistics-centre'),
];

const Y6 = [
  skill(6,'integers-intro','Integers introduction','Number','Number','integer'),
  skill(6,'fraction-operations','Fraction operations','Number','Fractions','fraction'),
  skill(6,'decimal-operations','Decimal operations','Number','Decimals','decimal'),
  skill(6,'percentages','Percentages of quantities','Number','Percentages','percentage'),
  skill(6,'ratio','Ratios and equivalent ratios','Number','Ratio & Rates','ratio'),
  skill(6,'rates-intro','Rates and unit rates introduction','Number','Ratio & Rates','rate'),
  skill(6,'algebra-language','Using letters for unknowns','Algebra','Algebra','algebra-basics'),
  skill(6,'one-step-equations','One-step equations','Algebra','Equations','linear-equation'),
  skill(6,'patterns-rules','Patterns and rules','Functions & Graphs','Patterns','sequence-linear'),
  skill(6,'coordinates','Cartesian coordinates','Functions & Graphs','Graphs','coordinates'),
  skill(6,'area-composite','Area of rectangles and composite shapes','Measurement & Geometry','Measurement','measurement-2d'),
  skill(6,'volume-prisms','Volume of prisms','Measurement & Geometry','Measurement','measurement-3d'),
  skill(6,'angle-relationships','Angle relationships','Measurement & Geometry','Geometry','angles'),
  skill(6,'probability','Probability and experiments','Probability','Probability','probability'),
  skill(6,'statistics','Mean, median, mode and range','Statistics & Data','Statistics','statistics-centre'),
  skill(6,'data-displays','Interpreting data displays','Statistics & Data','Statistics','data-display'),
];

const Y7 = [
  skill(7,'integers','Integers and number lines','Number','Number','integer'),
  skill(7,'order-operations','Order of operations','Number','Number','arithmetic'),
  skill(7,'factors-multiples','Factors, multiples and primes','Number','Number','divisibility'),
  skill(7,'fraction-operations','Fraction operations','Number','Fractions','fraction'),
  skill(7,'decimals','Decimals and place value','Number','Decimals','decimal'),
  skill(7,'percentages','Percentages','Number','Percentages','percentage'),
  skill(7,'ratio','Ratios','Number','Ratio & Rates','ratio'),
  skill(7,'rates','Rates and unit rates','Number','Ratio & Rates','rate'),
  skill(7,'money','Money and simple financial maths','Number','Financial Maths','finance-simple'),
  skill(7,'algebra-language','Algebraic notation and language','Algebra','Algebra','algebra-basics'),
  skill(7,'like-terms','Collecting like terms','Algebra','Algebra','simplify'),
  skill(7,'substitution','Substitution','Algebra','Algebra','substitution'),
  skill(7,'one-step-equations','One-step equations','Algebra','Equations','linear-equation'),
  skill(7,'patterns','Number patterns and rules','Functions & Graphs','Patterns','sequence-linear'),
  skill(7,'coordinates','Cartesian coordinates','Functions & Graphs','Graphs','coordinates'),
  skill(7,'perimeter-area','Perimeter and area','Measurement & Geometry','Measurement','measurement-2d'),
  skill(7,'volume-prisms','Volume of rectangular prisms','Measurement & Geometry','Measurement','measurement-3d'),
  skill(7,'angles','Angle relationships','Measurement & Geometry','Geometry','angles'),
  skill(7,'triangles-quadrilaterals','Triangles and quadrilaterals','Measurement & Geometry','Geometry','geometry-properties'),
  skill(7,'transformations','Transformations','Measurement & Geometry','Transformations','transformations'),
  skill(7,'probability-single','Single-event probability','Probability','Probability','probability'),
  skill(7,'data-displays','Data displays','Statistics & Data','Statistics','data-display'),
  skill(7,'averages','Mean, median, mode and range','Statistics & Data','Statistics','statistics-centre'),
  skill(7,'sampling','Populations and samples','Statistics & Data','Statistics','sampling'),
];

const Y8 = [
  skill(8,'rational-numbers','Rational numbers','Number','Number','integer'),
  skill(8,'fraction-decimal-percent','Fractions, decimals and percentages','Number','Number','fraction-percent'),
  skill(8,'percentage-change','Percentage increase and decrease','Number','Percentages','percentage-change'),
  skill(8,'ratio-rates','Ratios and rates','Number','Ratio & Rates','ratio-rate'),
  skill(8,'scientific-notation','Scientific notation','Number','Number','scientific-notation'),
  skill(8,'indices','Index notation and powers','Number','Indices','indices'),
  skill(8,'expand-single','Expanding single brackets','Algebra','Algebra','expand'),
  skill(8,'factor-common','Common-factor factorising','Algebra','Algebra','factor-common'),
  skill(8,'linear-equations','Two-step linear equations','Algebra','Equations','linear-equation'),
  skill(8,'inequalities','Linear inequalities','Algebra','Inequalities','inequality'),
  skill(8,'linear-rules','Linear rules and tables','Functions & Graphs','Linear Relations','linear-rule'),
  skill(8,'linear-graphs','Graphing linear relations','Functions & Graphs','Linear Relations','linear-graph'),
  skill(8,'gradient-intro','Gradient as a rate of change','Functions & Graphs','Linear Relations','gradient'),
  skill(8,'circles','Circumference and area of circles','Measurement & Geometry','Measurement','circle'),
  skill(8,'prisms','Surface area and volume of prisms','Measurement & Geometry','Measurement','measurement-3d'),
  skill(8,'pythagoras','Pythagoras theorem','Measurement & Geometry','Pythagoras','pythagoras'),
  skill(8,'congruence','Congruence','Measurement & Geometry','Geometry','congruence'),
  skill(8,'transformations','Transformations on the plane','Measurement & Geometry','Transformations','transformations'),
  skill(8,'compound-probability','Two-step probability','Probability','Probability','probability-compound'),
  skill(8,'venn-diagrams','Venn diagrams','Probability','Probability','venn'),
  skill(8,'distributions','Comparing data distributions','Statistics & Data','Statistics','statistics-distribution'),
  skill(8,'scatter-plots','Scatter plots','Statistics & Data','Bivariate Data','scatter'),
  skill(8,'sampling','Sampling and bias','Statistics & Data','Statistics','sampling'),
  skill(8,'networks-intro','Networks and routes','Statistics & Data','Networks','networks'),
];

const Y9 = [
  skill(9,'real-numbers','Real numbers and irrational numbers','Number','Number','real-number'),
  skill(9,'index-laws','Index laws','Number','Indices','indices'),
  skill(9,'surds-intro','Introduction to surds','Number','Surds','surds'),
  skill(9,'scientific-notation','Scientific notation calculations','Number','Number','scientific-notation'),
  skill(9,'financial-percentages','Percentage change and financial applications','Number','Financial Maths','finance-simple'),
  skill(9,'simplify-expressions','Simplifying algebraic expressions','Algebra','Algebra','simplify'),
  skill(9,'expand-brackets','Expanding brackets','Algebra','Algebra','expand'),
  skill(9,'factorising','Factorising algebraic expressions','Algebra','Algebra','factor-common'),
  skill(9,'linear-equations','Linear equations','Algebra','Equations','linear-equation'),
  skill(9,'linear-inequalities','Linear inequalities','Algebra','Inequalities','inequality'),
  skill(9,'simultaneous-intro','Introduction to simultaneous equations','Algebra','Equations','simultaneous'),
  skill(9,'linear-graphs','Linear graphs','Functions & Graphs','Linear Relations','linear-graph'),
  skill(9,'gradient-intercepts','Gradient and intercepts','Functions & Graphs','Linear Relations','gradient'),
  skill(9,'quadratics-expand','Expanding quadratic expressions','Functions & Graphs','Quadratics','quadratic-expand'),
  skill(9,'quadratics-factor','Factorising simple quadratics','Functions & Graphs','Quadratics','quadratic-factor'),
  skill(9,'surface-area-volume','Surface area and volume','Measurement & Geometry','Measurement','measurement-3d'),
  skill(9,'pythagoras','Pythagoras in context','Measurement & Geometry','Pythagoras','pythagoras'),
  skill(9,'trigonometry','Right-angled trigonometry','Measurement & Geometry','Trigonometry','trig-right'),
  skill(9,'similarity','Similarity and scale factors','Measurement & Geometry','Geometry','similarity'),
  skill(9,'compound-probability','Compound probability','Probability','Probability','probability-compound'),
  skill(9,'relative-frequency','Relative frequency','Probability','Probability','relative-frequency'),
  skill(9,'statistics-summary','Statistical summaries','Statistics & Data','Statistics','statistics-centre'),
  skill(9,'bivariate-data','Bivariate data','Statistics & Data','Bivariate Data','scatter'),
  skill(9,'networks','Networks and shortest paths','Statistics & Data','Networks','networks'),
];

const Y10 = [
  skill(10,'surds','Surds and exact values','Number','Surds','surds'),
  skill(10,'fractional-indices','Negative and fractional indices','Number','Indices','indices-advanced'),
  skill(10,'algebraic-fractions','Algebraic fractions','Algebra','Algebra','algebra-fraction'),
  skill(10,'quadratic-equations','Solving quadratic equations','Algebra','Quadratics','quadratic-solve'),
  skill(10,'simultaneous-equations','Simultaneous equations','Algebra','Equations','simultaneous'),
  skill(10,'inequalities','Inequalities and regions','Algebra','Inequalities','inequality'),
  skill(10,'functions','Functions and notation','Functions & Graphs','Functions','function-eval'),
  skill(10,'parabolas','Parabolas and quadratic graphs','Functions & Graphs','Quadratics','quadratic-graph'),
  skill(10,'exponentials','Exponential relationships','Functions & Graphs','Exponential Functions','exponential'),
  skill(10,'coordinate-geometry','Coordinate geometry','Functions & Graphs','Coordinate Geometry','coordinate-geometry'),
  skill(10,'financial-modelling','Financial growth and decay','Number','Financial Maths','finance-growth'),
  skill(10,'composite-measurement','Composite area and volume','Measurement & Geometry','Measurement','measurement-composite'),
  skill(10,'trigonometry','Trigonometric ratios','Measurement & Geometry','Trigonometry','trig-right'),
  skill(10,'bearings','Bearings and navigation','Measurement & Geometry','Trigonometry','bearings'),
  skill(10,'circle-geometry','Circle geometry','Measurement & Geometry','Geometry','circle-geometry'),
  skill(10,'similarity','Similarity and geometric reasoning','Measurement & Geometry','Geometry','similarity'),
  skill(10,'conditional-probability','Conditional probability','Probability','Probability','probability-conditional'),
  skill(10,'tree-diagrams','Tree diagrams','Probability','Probability','probability-tree'),
  skill(10,'boxplots','Box plots and quartiles','Statistics & Data','Statistics','boxplot'),
  skill(10,'standard-deviation','Standard deviation','Statistics & Data','Statistics','standard-deviation'),
  skill(10,'regression','Bivariate data and regression','Statistics & Data','Bivariate Data','regression'),
  skill(10,'networks','Networks and optimisation','Statistics & Data','Networks','networks'),
  skill(10,'modelling','Mathematical modelling','Functions & Graphs','Modelling','modelling'),
  skill(10,'proof','Algebraic and geometric proof','Algebra','Proof','proof'),
];

const senior = (year) => [
  skill(year,'std-finance', 'Financial mathematics and annuities','Number','Financial Maths','finance-annuity','Standard'),
  skill(year,'std-measurement','Measurement and scale applications','Measurement & Geometry','Measurement','measurement-composite','Standard'),
  skill(year,'std-networks','Networks and decision mathematics','Statistics & Data','Networks','networks','Standard'),
  skill(year,'std-data','Data analysis and displays','Statistics & Data','Statistics','statistics-distribution','Standard'),
  skill(year,'std-probability','Probability and simulation','Probability','Probability','probability-compound','Standard'),
  skill(year,'std-linear','Linear modelling','Functions & Graphs','Linear Models','linear-graph','Standard'),
  skill(year,'std-nonlinear','Non-linear modelling','Functions & Graphs','Non-linear Models','modelling','Standard'),
  skill(year,'std-rates','Rates, ratios and variation','Number','Ratio & Rates','ratio-rate','Standard'),
  skill(year,'std-trig','Practical trigonometry','Measurement & Geometry','Trigonometry','trig-right','Standard'),
  skill(year,'std-statistics','Statistical investigation','Statistics & Data','Statistics','sampling','Standard'),
  skill(year,'adv-functions','Functions and transformations','Functions & Graphs','Functions','function-eval','Advanced'),
  skill(year,'adv-polynomials','Polynomial functions','Functions & Graphs','Polynomials','polynomial','Advanced'),
  skill(year,'adv-trig','Trigonometric functions','Functions & Graphs','Trigonometry','trig-function','Advanced'),
  skill(year,'adv-exponential','Exponential functions','Functions & Graphs','Exponential Functions','exponential','Advanced'),
  skill(year,'adv-logarithms','Logarithmic functions','Functions & Graphs','Logarithms','logarithm','Advanced'),
  skill(year,'adv-sequences','Sequences and series','Algebra','Sequences & Series','sequence','Advanced'),
  skill(year,'adv-differentiation','Differentiation','Functions & Graphs','Calculus','calculus-diff','Advanced'),
  skill(year,'adv-integration','Integration','Functions & Graphs','Calculus','calculus-int','Advanced'),
  skill(year,'adv-probability','Advanced probability','Probability','Probability','probability-conditional','Advanced'),
  skill(year,'adv-distributions','Discrete and continuous distributions','Statistics & Data','Probability Distributions','distribution','Advanced'),
  skill(year,'adv-statistics','Statistical analysis and inference','Statistics & Data','Statistics','standard-deviation','Advanced'),
  skill(year,'adv-modelling','Functions and calculus modelling','Functions & Graphs','Modelling','modelling','Advanced'),
  skill(year,'ext-proof','Mathematical proof','Algebra','Proof','proof','Extension'),
  skill(year,'ext-combinatorics','Combinatorics','Probability','Combinatorics','combinatorics','Extension'),
  skill(year,'ext-vectors','Vectors','Measurement & Geometry','Vectors','vectors','Extension'),
  skill(year,'ext-complex','Complex numbers','Number','Complex Numbers','complex','Extension'),
  skill(year,'ext-polynomials','Advanced polynomials','Functions & Graphs','Polynomials','polynomial','Extension'),
  skill(year,'ext-trig','Advanced trigonometric identities','Functions & Graphs','Trigonometry','trig-function','Extension'),
  skill(year,'ext-calculus','Advanced calculus','Functions & Graphs','Calculus','calculus-diff','Extension'),
  skill(year,'ext-series','Advanced sequences and series','Algebra','Sequences & Series','sequence','Extension'),
  skill(year,'ext-probability','Combinatorial probability','Probability','Probability','combinatorics','Extension'),
  skill(year,'ext-mechanics','Vector and rate modelling','Functions & Graphs','Modelling','vectors','Extension'),
];
const FOUNDATION_EXPANSION_SKILLS = [
  // Kindergarten — extra short, concrete foundation skills.
  skill(0,'counting-30','Counting and ordering to 30','Number','Number','early-counting'),
  skill(0,'subitising','Recognising small quantities quickly','Number','Number','early-comparison'),
  skill(0,'make-ten','Making 10 in different ways','Number','Number','early-addition'),
  skill(0,'halves-intro','Sharing into two equal parts','Number','Fractions','early-fractions'),
  skill(0,'shape-sort','Sorting and describing shapes','Measurement & Geometry','Geometry','early-shapes'),
  skill(0,'compare-mass','Comparing mass, length and capacity','Measurement & Geometry','Measurement','early-measure'),

  // Year 1
  skill(1,'skip-counting','Skip counting by 2s, 5s and 10s','Number','Number','early-counting'),
  skill(1,'doubles','Doubles and near doubles','Number','Number','early-addition'),
  skill(1,'quarters-intro','Halves and quarters','Number','Fractions','early-fractions'),
  skill(1,'duration-intro','Comparing and describing duration','Measurement & Geometry','Measurement','early-time'),
  skill(1,'turns-position','Turns, position and movement','Measurement & Geometry','Geometry','early-shapes'),
  skill(1,'measurement-compare','Measuring and comparing everyday objects','Measurement & Geometry','Measurement','early-measure'),

  // Year 2
  skill(2,'number-lines','Number lines and counting patterns','Number','Number','early-counting'),
  skill(2,'facts-to-100','Addition and subtraction facts to 100','Number','Number','early-addition'),
  skill(2,'arrays-groups','Arrays, groups and sharing','Number','Number','early-groups'),
  skill(2,'fraction-models','Representing halves, quarters and eighths','Number','Fractions','early-fractions'),
  skill(2,'symmetry-shapes','Symmetry and shape features','Measurement & Geometry','Geometry','early-shapes'),
  skill(2,'calendar-duration','Calendars, time and duration','Measurement & Geometry','Measurement','early-time'),

  // Year 3
  skill(3,'division-remainders','Division, grouping and remainders','Number','Number','arithmetic'),
  skill(3,'fraction-comparison','Comparing simple fractions','Number','Fractions','fraction'),
  skill(3,'decimals-intro','Tenths and decimal notation','Number','Decimals','decimal'),
  skill(3,'percentages-intro','Connecting simple fractions and percentages','Number','Percentages','percentage'),
  skill(3,'scale-and-ratio-intro','Simple scale and comparison problems','Number','Ratio & Rates','ratio'),
  skill(3,'transformations-intro','Flips, slides and turns','Measurement & Geometry','Transformations','transformations'),

  // Year 4
  skill(4,'multiplication-division','Multiplication and division strategies','Number','Number','arithmetic'),
  skill(4,'fraction-operations','Adding and comparing common fractions','Number','Fractions','fraction'),
  skill(4,'decimal-operations','Working with tenths and hundredths','Number','Decimals','decimal'),
  skill(4,'ratio-intro','Comparing quantities with simple ratios','Number','Ratio & Rates','ratio'),
  skill(4,'transformations','Transformations and symmetry','Measurement & Geometry','Transformations','transformations'),
  skill(4,'sampling-intro','Collecting samples and interpreting data','Statistics & Data','Statistics','sampling'),

  // Year 5
  skill(5,'integers-intro','Positive and negative numbers in context','Number','Number','integer'),
  skill(5,'fraction-add-sub','Adding and subtracting related fractions','Number','Fractions','fraction'),
  skill(5,'decimal-operations','Decimal calculations','Number','Decimals','decimal'),
  skill(5,'percent-of-quantity','Percentages of quantities','Number','Percentages','percentage'),
  skill(5,'one-step-equations','One-step equations and unknowns','Algebra','Equations','linear-equation'),
  skill(5,'transformations','Translations, reflections and rotations','Measurement & Geometry','Transformations','transformations'),

  // Year 6
  skill(6,'order-operations','Order of operations','Number','Number','arithmetic'),
  skill(6,'factors-primes','Factors, multiples and prime numbers','Number','Number','divisibility'),
  skill(6,'fraction-decimal-percent','Fractions, decimals and percentages','Number','Number','fraction-percent'),
  skill(6,'financial-maths','Discounts and everyday financial maths','Number','Financial Maths','finance-simple'),
  skill(6,'linear-rules','Tables, rules and simple linear relationships','Functions & Graphs','Linear Relations','linear-rule'),
  skill(6,'sampling-bias','Samples, surveys and bias','Statistics & Data','Statistics','sampling'),
];

const EXTRA_SKILLS = [
  skill(7,'powers-squares-cubes','Squares, cubes and powers','Number','Indices','indices'),
  skill(7,'fraction-of-quantity','Fractions of quantities','Number','Fractions','fraction'),
  skill(7,'unit-conversions','Metric unit conversions','Measurement & Geometry','Measurement','measurement-2d'),
  skill(7,'scale-drawings','Scale drawings','Measurement & Geometry','Scale','ratio'),
  skill(7,'equation-models','Writing equations from words','Algebra','Equations','linear-equation'),
  skill(7,'chance-experiments','Experimental probability','Probability','Probability','relative-frequency'),
  skill(8,'index-laws-intro','Index laws introduction','Number','Indices','indices'),
  skill(8,'percentage-profit-loss','Profit, loss and discounts','Number','Financial Maths','finance-simple'),
  skill(8,'algebra-formulas','Using and rearranging simple formulas','Algebra','Algebra','substitution'),
  skill(8,'simultaneous-intro','Simultaneous equations introduction','Algebra','Equations','simultaneous'),
  skill(8,'distance-time-graphs','Distance–time graphs','Functions & Graphs','Graphs','linear-graph'),
  skill(8,'box-plots-intro','Box plots and quartiles','Statistics & Data','Statistics','statistics-distribution'),
  skill(9,'algebraic-fractions-intro','Algebraic fractions introduction','Algebra','Algebra','algebra-fraction'),
  skill(9,'equation-word-problems','Linear equation word problems','Algebra','Equations','linear-equation'),
  skill(9,'direct-proportion','Direct proportion','Functions & Graphs','Relations','linear-rule'),
  skill(9,'distance-midpoint','Distance and midpoint','Functions & Graphs','Coordinate Geometry','coordinate-geometry'),
  skill(9,'trig-problems','Trigonometry word problems','Measurement & Geometry','Trigonometry','trig-right'),
  skill(9,'box-plots','Box plots and interquartile range','Statistics & Data','Statistics','statistics-distribution'),
  skill(10,'polynomial-algebra','Polynomial algebra','Algebra','Polynomials','polynomial'),
  skill(10,'quadratic-word-problems','Quadratic modelling problems','Algebra','Quadratics','quadratic-solve'),
  skill(10,'inverse-proportion','Inverse proportion','Functions & Graphs','Relations','function-eval'),
  skill(10,'trig-exact-values','Exact trigonometric values','Measurement & Geometry','Trigonometry','trig-function'),
  skill(10,'tree-diagrams-compound','Probability tree diagrams','Probability','Probability','probability-compound'),
  skill(10,'standard-deviation-intro','Standard deviation introduction','Statistics & Data','Statistics','standard-deviation'),
  skill(11,'core-polynomials-extra','Polynomial equations and identities','Algebra','Polynomials','polynomial','Core'),
  skill(11,'core-sequences-extra','Sequences and recursive rules','Algebra','Sequences & Series','sequence','Core'),
  skill(11,'adv-calculus-extra','Derivative applications','Functions & Graphs','Calculus','calculus-diff','Advanced'),
  skill(11,'adv-probability-extra','Conditional probability','Probability','Probability','probability-compound','Advanced'),
  skill(11,'ext-proof-extra','Proof by contradiction','Algebra','Proof','proof','Extension'),
  skill(11,'ext-vectors-extra','Vector geometry','Measurement & Geometry','Vectors','vectors','Extension'),
  skill(12,'core-functions-extra','Function transformations','Functions & Graphs','Functions','function-eval','Core'),
  skill(12,'core-statistics-extra','Statistical modelling','Statistics & Data','Statistics','standard-deviation','Core'),
  skill(12,'adv-calculus-extra','Integration applications','Functions & Graphs','Calculus','calculus-int','Advanced'),
  skill(12,'adv-finance-extra','Financial modelling and annuities','Number','Financial Maths','finance-annuity','Advanced'),
  skill(12,'ext-complex-extra','Complex number geometry','Number','Complex Numbers','complex','Extension'),
  skill(12,'ext-series-extra','Advanced series and recurrence','Algebra','Sequences & Series','sequence','Extension'),
];
const COVERAGE_CHECKLIST_SKILLS = [
  skill(3,'coverage-number-place-value','Place value','Number','Number','arithmetic','Core'),
  skill(3,'coverage-number-reading-and-writing-numbers','Reading and writing numbers','Number','Number','arithmetic','Core'),
  skill(3,'coverage-number-comparing-numbers','Comparing numbers','Number','Number','arithmetic','Core'),
  skill(4,'coverage-number-ordering-numbers','Ordering numbers','Number','Number','arithmetic','Core'),
  skill(4,'coverage-number-rounding','Rounding','Number','Number','arithmetic','Core'),
  skill(4,'coverage-number-odd-and-even-numbers','Odd and even numbers','Number','Number','arithmetic','Core'),
  skill(5,'coverage-number-skip-counting','Skip counting','Number','Number','arithmetic','Core'),
  skill(5,'coverage-number-powers-of-10','Powers of 10','Number','Indices','indices','Core'),
  skill(6,'coverage-number-integers','Integers','Number','Number','integer','Core'),
  skill(6,'coverage-number-number-lines','Number lines','Number','Number','integer','Core'),
  skill(3,'coverage-addition-and-subtraction-mental-addition','Mental addition','Number','Number','arithmetic','Core'),
  skill(3,'coverage-addition-and-subtraction-mental-subtraction','Mental subtraction','Number','Number','arithmetic','Core'),
  skill(3,'coverage-addition-and-subtraction-written-addition','Written addition','Number','Number','arithmetic','Core'),
  skill(4,'coverage-addition-and-subtraction-written-subtraction','Written subtraction','Number','Number','arithmetic','Core'),
  skill(4,'coverage-addition-and-subtraction-regrouping','Regrouping','Number','Number','arithmetic','Core'),
  skill(5,'coverage-addition-and-subtraction-estimation','Estimation','Number','Number','arithmetic','Core'),
  skill(5,'coverage-addition-and-subtraction-missing-numbers','Missing numbers','Number','Number','arithmetic','Core'),
  skill(6,'coverage-addition-and-subtraction-multi-step-problems','Multi-step problems','Number','Number','arithmetic','Core'),
  skill(6,'coverage-addition-and-subtraction-word-problems','Word problems','Number','Number','arithmetic','Core'),
  skill(3,'coverage-multiplication-and-division-repeated-addition','Repeated addition','Number','Number','arithmetic','Core'),
  skill(3,'coverage-multiplication-and-division-equal-groups','Equal groups','Number','Number','arithmetic','Core'),
  skill(3,'coverage-multiplication-and-division-arrays','Arrays','Number','Number','arithmetic','Core'),
  skill(3,'coverage-multiplication-and-division-times-tables','Times tables','Number','Number','arithmetic','Core'),
  skill(4,'coverage-multiplication-and-division-division-facts','Division facts','Number','Number','arithmetic','Core'),
  skill(4,'coverage-multiplication-and-division-factors','Factors','Number','Number','arithmetic','Core'),
  skill(4,'coverage-multiplication-and-division-multiples','Multiples','Number','Number','arithmetic','Core'),
  skill(5,'coverage-multiplication-and-division-divisibility','Divisibility','Number','Number','arithmetic','Core'),
  skill(5,'coverage-multiplication-and-division-long-multiplication','Long multiplication','Number','Number','arithmetic','Core'),
  skill(5,'coverage-multiplication-and-division-long-division','Long division','Number','Number','arithmetic','Core'),
  skill(5,'coverage-multiplication-and-division-remainders','Remainders','Number','Number','arithmetic','Core'),
  skill(6,'coverage-multiplication-and-division-multiplication-algorithms','Multiplication algorithms','Number','Number','arithmetic','Core'),
  skill(6,'coverage-multiplication-and-division-division-algorithms','Division algorithms','Number','Number','arithmetic','Core'),
  skill(6,'coverage-multiplication-and-division-word-problems','Word problems','Number','Number','arithmetic','Core'),
  skill(3,'coverage-fractions-fractions-of-shapes','Fractions of shapes','Number','Fractions','fraction','Core'),
  skill(3,'coverage-fractions-fractions-of-quantities','Fractions of quantities','Number','Fractions','fraction','Core'),
  skill(3,'coverage-fractions-equivalent-fractions','Equivalent fractions','Number','Fractions','fraction','Core'),
  skill(4,'coverage-fractions-comparing-fractions','Comparing fractions','Number','Fractions','fraction','Core'),
  skill(4,'coverage-fractions-ordering-fractions','Ordering fractions','Number','Fractions','fraction','Core'),
  skill(4,'coverage-fractions-simplifying-fractions','Simplifying fractions','Number','Fractions','fraction','Core'),
  skill(5,'coverage-fractions-mixed-numbers','Mixed numbers','Number','Fractions','fraction','Core'),
  skill(5,'coverage-fractions-improper-fractions','Improper fractions','Number','Fractions','fraction','Core'),
  skill(5,'coverage-fractions-adding-fractions','Adding fractions','Number','Fractions','fraction','Core'),
  skill(6,'coverage-fractions-subtracting-fractions','Subtracting fractions','Number','Fractions','fraction','Core'),
  skill(6,'coverage-fractions-multiplying-fractions','Multiplying fractions','Number','Fractions','fraction','Core'),
  skill(6,'coverage-fractions-fraction-number-lines','Fraction number lines','Number','Fractions','integer','Core'),
  skill(3,'coverage-decimals-tenths','Tenths','Number','Decimals','decimal','Core'),
  skill(3,'coverage-decimals-hundredths','Hundredths','Number','Decimals','decimal','Core'),
  skill(3,'coverage-decimals-thousandths','Thousandths','Number','Decimals','decimal','Core'),
  skill(4,'coverage-decimals-decimal-place-value','Decimal place value','Number','Decimals','decimal','Core'),
  skill(4,'coverage-decimals-comparing-decimals','Comparing decimals','Number','Decimals','decimal','Core'),
  skill(5,'coverage-decimals-ordering-decimals','Ordering decimals','Number','Decimals','decimal','Core'),
  skill(5,'coverage-decimals-adding-decimals','Adding decimals','Number','Decimals','decimal','Core'),
  skill(5,'coverage-decimals-subtracting-decimals','Subtracting decimals','Number','Decimals','decimal','Core'),
  skill(6,'coverage-decimals-multiplying-decimals','Multiplying decimals','Number','Decimals','decimal','Core'),
  skill(6,'coverage-decimals-dividing-decimals','Dividing decimals','Number','Decimals','decimal','Core'),
  skill(3,'coverage-percentages-meaning-of-percentages','Meaning of percentages','Number','Percentages','percentage','Core'),
  skill(3,'coverage-percentages-fractions-to-percentages','Fractions to percentages','Number','Fractions','fraction','Core'),
  skill(4,'coverage-percentages-decimals-to-percentages','Decimals to percentages','Number','Decimals','decimal','Core'),
  skill(4,'coverage-percentages-percentages-to-fractions','Percentages to fractions','Number','Fractions','fraction','Core'),
  skill(5,'coverage-percentages-common-percentages','Common percentages','Number','Percentages','percentage','Core'),
  skill(5,'coverage-percentages-percentage-of-an-amount','Percentage of an amount','Number','Percentages','percentage','Core'),
  skill(6,'coverage-percentages-simple-financial-percentages','Simple financial percentages','Number','Percentages','percentage','Core'),
  skill(3,'coverage-money-coins-and-notes','Coins and notes','Number','Financial Maths','finance-simple','Core'),
  skill(3,'coverage-money-adding-money','Adding money','Number','Financial Maths','finance-simple','Core'),
  skill(4,'coverage-money-change','Change','Number','Financial Maths','finance-simple','Core'),
  skill(5,'coverage-money-budgets','Budgets','Number','Financial Maths','finance-simple','Core'),
  skill(5,'coverage-money-prices','Prices','Number','Financial Maths','finance-simple','Core'),
  skill(6,'coverage-money-simple-financial-problems','Simple financial problems','Number','Financial Maths','finance-simple','Core'),
  skill(3,'coverage-time-reading-clocks','Reading clocks','Measurement & Geometry','Measurement','arithmetic','Core'),
  skill(3,'coverage-time-am-and-pm','AM and PM','Measurement & Geometry','Measurement','arithmetic','Core'),
  skill(4,'coverage-time-12-hour-time','12-hour time','Measurement & Geometry','Measurement','arithmetic','Core'),
  skill(4,'coverage-time-24-hour-time','24-hour time','Measurement & Geometry','Measurement','arithmetic','Core'),
  skill(5,'coverage-time-elapsed-time','Elapsed time','Measurement & Geometry','Measurement','arithmetic','Core'),
  skill(5,'coverage-time-hours-minutes-seconds','Hours/minutes/seconds','Measurement & Geometry','Measurement','arithmetic','Core'),
  skill(6,'coverage-time-calendars','Calendars','Measurement & Geometry','Measurement','arithmetic','Core'),
  skill(6,'coverage-time-months-and-dates','Months and dates','Measurement & Geometry','Measurement','arithmetic','Core'),
  skill(3,'coverage-measurement-length','Length','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(3,'coverage-measurement-perimeter','Perimeter','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(3,'coverage-measurement-area','Area','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(4,'coverage-measurement-mass','Mass','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(4,'coverage-measurement-capacity','Capacity','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(4,'coverage-measurement-temperature','Temperature','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(5,'coverage-measurement-volume','Volume','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(5,'coverage-measurement-metric-units','Metric units','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(5,'coverage-measurement-unit-conversions','Unit conversions','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(6,'coverage-measurement-2d-measurement','2D measurement','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(6,'coverage-measurement-3d-measurement','3D measurement','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(3,'coverage-geometry-2d-shapes','2D shapes','Measurement & Geometry','Geometry','geometry-properties','Core'),
  skill(3,'coverage-geometry-3d-objects','3D objects','Measurement & Geometry','Geometry','geometry-properties','Core'),
  skill(3,'coverage-geometry-angles','Angles','Measurement & Geometry','Geometry','angles','Core'),
  skill(4,'coverage-geometry-lines','Lines','Measurement & Geometry','Geometry','geometry-properties','Core'),
  skill(4,'coverage-geometry-symmetry','Symmetry','Measurement & Geometry','Geometry','transformations','Core'),
  skill(5,'coverage-geometry-position','Position','Measurement & Geometry','Geometry','coordinates','Core'),
  skill(5,'coverage-geometry-coordinates','Coordinates','Functions & Graphs','Graphs','coordinates','Core'),
  skill(5,'coverage-geometry-grids','Grids','Measurement & Geometry','Geometry','coordinates','Core'),
  skill(6,'coverage-geometry-maps','Maps','Measurement & Geometry','Geometry','coordinates','Core'),
  skill(6,'coverage-geometry-transformations','Transformations','Measurement & Geometry','Geometry','transformations','Core'),
  skill(3,'coverage-data-collecting-data','Collecting data','Statistics & Data','Statistics','data-display','Core'),
  skill(3,'coverage-data-tables','Tables','Statistics & Data','Statistics','data-display','Core'),
  skill(4,'coverage-data-column-graphs','Column graphs','Statistics & Data','Statistics','data-display','Core'),
  skill(5,'coverage-data-picture-graphs','Picture graphs','Statistics & Data','Statistics','data-display','Core'),
  skill(5,'coverage-data-line-graphs','Line graphs','Statistics & Data','Statistics','data-display','Core'),
  skill(6,'coverage-data-data-interpretation','Data interpretation','Statistics & Data','Statistics','data-display','Core'),
  skill(3,'coverage-probability-chance-language','Chance language','Probability','Probability','probability','Core'),
  skill(3,'coverage-probability-likely-unlikely','Likely/unlikely','Probability','Probability','probability','Core'),
  skill(4,'coverage-probability-possible-impossible','Possible/impossible','Probability','Probability','probability','Core'),
  skill(5,'coverage-probability-simple-probability','Simple probability','Probability','Probability','probability','Core'),
  skill(6,'coverage-probability-experiments','Experiments','Probability','Probability','probability','Core'),
  skill(3,'coverage-algorithms-following-algorithms','Following algorithms','Algebra','Algorithms','arithmetic','Core'),
  skill(4,'coverage-algorithms-designing-algorithms','Designing algorithms','Algebra','Algorithms','arithmetic','Core'),
  skill(5,'coverage-algorithms-number-algorithms','Number algorithms','Algebra','Algorithms','arithmetic','Core'),
  skill(6,'coverage-algorithms-mathematical-procedures','Mathematical procedures','Algebra','Algorithms','arithmetic','Core'),
  skill(7,'coverage-number-whole-numbers','Whole numbers','Number','Number','arithmetic','Core'),
  skill(7,'coverage-number-factors','Factors','Number','Number','arithmetic','Core'),
  skill(7,'coverage-number-multiples','Multiples','Number','Number','arithmetic','Core'),
  skill(7,'coverage-number-prime-numbers','Prime numbers','Number','Number','arithmetic','Core'),
  skill(7,'coverage-number-hcf','HCF','Number','Number','arithmetic','Core'),
  skill(7,'coverage-number-lcm','LCM','Number','Number','arithmetic','Core'),
  skill(7,'coverage-number-square-numbers','Square numbers','Number','Number','arithmetic','Core'),
  skill(7,'coverage-number-square-roots','Square roots','Number','Number','arithmetic','Core'),
  skill(7,'coverage-number-powers','Powers','Number','Indices','indices','Core'),
  skill(7,'coverage-number-powers-of-ten','Powers of ten','Number','Indices','indices','Core'),
  skill(7,'coverage-integers-number-line','Number line','Number','Number','integer','Core'),
  skill(7,'coverage-integers-comparing-integers','Comparing integers','Number','Number','integer','Core'),
  skill(7,'coverage-integers-adding-integers','Adding integers','Number','Number','integer','Core'),
  skill(7,'coverage-integers-subtracting-integers','Subtracting integers','Number','Number','integer','Core'),
  skill(7,'coverage-integers-multiplying-integers','Multiplying integers','Number','Number','integer','Core'),
  skill(7,'coverage-integers-dividing-integers','Dividing integers','Number','Number','integer','Core'),
  skill(7,'coverage-fractions-equivalent-fractions','Equivalent fractions','Number','Fractions','fraction','Core'),
  skill(7,'coverage-fractions-simplifying-fractions','Simplifying fractions','Number','Fractions','fraction','Core'),
  skill(7,'coverage-fractions-comparing-fractions','Comparing fractions','Number','Fractions','fraction','Core'),
  skill(7,'coverage-fractions-adding-and-subtracting','Adding and subtracting','Number','Fractions','fraction','Core'),
  skill(7,'coverage-fractions-multiplying-fractions','Multiplying fractions','Number','Fractions','fraction','Core'),
  skill(7,'coverage-fractions-dividing-fractions','Dividing fractions','Number','Fractions','fraction','Core'),
  skill(7,'coverage-decimals-decimal-place-value','Decimal place value','Number','Decimals','decimal','Core'),
  skill(7,'coverage-decimals-operations-with-decimals','Operations with decimals','Number','Decimals','decimal','Core'),
  skill(7,'coverage-decimals-rounding-decimals','Rounding decimals','Number','Decimals','decimal','Core'),
  skill(7,'coverage-percentages-fraction-decimal-percentage-conversion','Fraction/decimal/percentage conversion','Number','Fractions','fraction','Core'),
  skill(7,'coverage-percentages-percentage-of-a-quantity','Percentage of a quantity','Number','Percentages','percentage','Core'),
  skill(7,'coverage-percentages-percentage-increase-decrease','Percentage increase/decrease','Number','Percentages','percentage','Core'),
  skill(7,'coverage-ratios-rates-and-money-equivalent-ratios','Equivalent ratios','Number','Ratio & Rates','ratio-rate','Core'),
  skill(7,'coverage-ratios-rates-and-money-rates','Rates','Number','Ratio & Rates','ratio-rate','Core'),
  skill(7,'coverage-ratios-rates-and-money-unit-rates','Unit rates','Number','Ratio & Rates','ratio-rate','Core'),
  skill(7,'coverage-ratios-rates-and-money-money-problems','Money problems','Number','Ratio & Rates','ratio-rate','Core'),
  skill(7,'coverage-ratios-rates-and-money-best-buys','Best buys','Number','Financial Maths','finance-simple','Core'),
  skill(7,'coverage-algebra-variables','Variables','Algebra','Algebra','simplify','Core'),
  skill(7,'coverage-algebra-algebraic-notation','Algebraic notation','Algebra','Algebra','simplify','Core'),
  skill(7,'coverage-algebra-like-terms','Like terms','Algebra','Algebra','simplify','Core'),
  skill(7,'coverage-algebra-simplifying-expressions','Simplifying expressions','Algebra','Algebra','simplify','Core'),
  skill(7,'coverage-algebra-distributive-law','Distributive law','Algebra','Algebra','expand','Core'),
  skill(7,'coverage-equations-two-step-equations','Two-step equations','Algebra','Equations','linear-equation','Core'),
  skill(7,'coverage-equations-introduction-to-inequalities','Introduction to inequalities','Algebra','Inequalities','inequality','Core'),
  skill(7,'coverage-linear-relationships-coordinate-plane','Coordinate plane','Functions & Graphs','Graphs','coordinates','Core'),
  skill(7,'coverage-linear-relationships-tables-of-values','Tables of values','Functions & Graphs','Linear Relations','linear-graph','Core'),
  skill(7,'coverage-linear-relationships-linear-rules','Linear rules','Functions & Graphs','Linear Relations','linear-graph','Core'),
  skill(7,'coverage-linear-relationships-graphs','Graphs','Functions & Graphs','Linear Relations','linear-graph','Core'),
  skill(7,'coverage-geometry-angles','Angles','Measurement & Geometry','Geometry','angles','Core'),
  skill(7,'coverage-geometry-parallel-lines','Parallel lines','Measurement & Geometry','Geometry','angles','Core'),
  skill(7,'coverage-geometry-transversals','Transversals','Measurement & Geometry','Geometry','angles','Core'),
  skill(7,'coverage-geometry-triangles','Triangles','Measurement & Geometry','Geometry','angles','Core'),
  skill(7,'coverage-geometry-quadrilaterals','Quadrilaterals','Measurement & Geometry','Geometry','geometry-properties','Core'),
  skill(7,'coverage-geometry-symmetry','Symmetry','Measurement & Geometry','Geometry','transformations','Core'),
  skill(7,'coverage-measurement-perimeter','Perimeter','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(7,'coverage-measurement-area','Area','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(7,'coverage-measurement-circles','Circles','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(7,'coverage-measurement-surface-area','Surface area','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(7,'coverage-measurement-volume','Volume','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(7,'coverage-measurement-prisms','Prisms','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(7,'coverage-probability-probability-language','Probability language','Probability','Probability','probability','Core'),
  skill(7,'coverage-probability-sample-spaces','Sample spaces','Probability','Probability','probability','Core'),
  skill(7,'coverage-probability-theoretical-probability','Theoretical probability','Probability','Probability','probability','Core'),
  skill(7,'coverage-statistics-collecting-data','Collecting data','Statistics & Data','Statistics','data-display','Core'),
  skill(7,'coverage-statistics-frequency-tables','Frequency tables','Statistics & Data','Statistics','data-display','Core'),
  skill(7,'coverage-statistics-mean','Mean','Statistics & Data','Statistics','statistics-centre','Core'),
  skill(7,'coverage-statistics-median','Median','Statistics & Data','Statistics','statistics-centre','Core'),
  skill(7,'coverage-statistics-mode','Mode','Statistics & Data','Statistics','statistics-centre','Core'),
  skill(7,'coverage-statistics-range','Range','Statistics & Data','Statistics','statistics-centre','Core'),
  skill(7,'coverage-statistics-outliers','Outliers','Statistics & Data','Statistics','data-display','Core'),
  skill(7,'coverage-statistics-dot-plots','Dot plots','Statistics & Data','Statistics','data-display','Core'),
  skill(7,'coverage-statistics-column-graphs','Column graphs','Statistics & Data','Statistics','data-display','Core'),
  skill(7,'coverage-statistics-pie-charts','Pie charts','Statistics & Data','Statistics','data-display','Core'),
  skill(7,'coverage-statistics-line-graphs','Line graphs','Statistics & Data','Statistics','data-display','Core'),
  skill(8,'coverage-real-numbers-integers','Integers','Number','Number','integer','Core'),
  skill(8,'coverage-real-numbers-negative-fractions','Negative fractions','Number','Fractions','fraction','Core'),
  skill(8,'coverage-real-numbers-negative-decimals','Negative decimals','Number','Decimals','decimal','Core'),
  skill(8,'coverage-real-numbers-irrational-numbers','Irrational numbers','Number','Ratio & Rates','ratio-rate','Core'),
  skill(8,'coverage-real-numbers-index-laws','Index laws','Number','Number','real-number','Core'),
  skill(8,'coverage-real-numbers-squares-and-square-roots','Squares and square roots','Number','Number','surds','Core'),
  skill(8,'coverage-percentages-and-finance-fraction-decimal-percentage-conversion','Fraction/decimal/percentage conversion','Number','Fractions','fraction','Core'),
  skill(8,'coverage-percentages-and-finance-finding-the-whole','Finding the whole','Number','Percentages','percentage','Core'),
  skill(8,'coverage-percentages-and-finance-percentage-increase','Percentage increase','Number','Percentages','percentage','Core'),
  skill(8,'coverage-percentages-and-finance-percentage-decrease','Percentage decrease','Number','Percentages','percentage','Core'),
  skill(8,'coverage-percentages-and-finance-profit-and-loss','Profit and loss','Number','Percentages','percentage','Core'),
  skill(8,'coverage-percentages-and-finance-consumer-percentages','Consumer percentages','Number','Percentages','percentage','Core'),
  skill(8,'coverage-ratio-and-rates-ratios','Ratios','Number','Ratio & Rates','ratio-rate','Core'),
  skill(8,'coverage-ratio-and-rates-maps-and-scale','Maps and scale','Number','Ratio & Rates','ratio-rate','Core'),
  skill(8,'coverage-ratio-and-rates-rates','Rates','Number','Ratio & Rates','ratio-rate','Core'),
  skill(8,'coverage-ratio-and-rates-time-zones','Time zones','Measurement & Geometry','Measurement','arithmetic','Core'),
  skill(8,'coverage-ratio-and-rates-travel-graphs','Travel graphs','Functions & Graphs','Graphs','linear-graph','Core'),
  skill(8,'coverage-ratio-and-rates-best-buys','Best buys','Number','Financial Maths','finance-simple','Core'),
  skill(8,'coverage-algebra-algebraic-terms','Algebraic terms','Algebra','Algebra','simplify','Core'),
  skill(8,'coverage-algebra-simplifying-expressions','Simplifying expressions','Algebra','Algebra','simplify','Core'),
  skill(8,'coverage-algebra-distributive-law','Distributive law','Algebra','Algebra','expand','Core'),
  skill(8,'coverage-algebra-factorising','Factorising','Algebra','Algebra','factor-common','Core'),
  skill(8,'coverage-algebra-substitution','Substitution','Algebra','Algebra','substitution','Core'),
  skill(8,'coverage-equations-linear-equations','Linear equations','Algebra','Equations','linear-equation','Core'),
  skill(8,'coverage-equations-multi-step-equations','Multi-step equations','Algebra','Equations','linear-equation','Core'),
  skill(8,'coverage-equations-equations-involving-brackets','Equations involving brackets','Algebra','Equations','linear-equation','Core'),
  skill(8,'coverage-equations-variables-on-both-sides','Variables on both sides','Algebra','Equations','linear-equation','Core'),
  skill(8,'coverage-equations-inequalities','Inequalities','Algebra','Inequalities','inequality','Core'),
  skill(8,'coverage-linear-relationships-linear-rules','Linear rules','Functions & Graphs','Linear Relations','linear-graph','Core'),
  skill(8,'coverage-linear-relationships-tables-of-values','Tables of values','Functions & Graphs','Linear Relations','linear-graph','Core'),
  skill(8,'coverage-linear-relationships-linear-graphs','Linear graphs','Functions & Graphs','Linear Relations','linear-graph','Core'),
  skill(8,'coverage-linear-relationships-horizontal-vertical-lines','Horizontal/vertical lines','Functions & Graphs','Linear Relations','linear-graph','Core'),
  skill(8,'coverage-linear-relationships-equation-from-a-graph','Equation from a graph','Functions & Graphs','Linear Relations','linear-graph','Core'),
  skill(8,'coverage-linear-relationships-intersections','Intersections','Functions & Graphs','Linear Relations','linear-graph','Core'),
  skill(8,'coverage-geometry-angles','Angles','Measurement & Geometry','Geometry','angles','Core'),
  skill(8,'coverage-geometry-triangles','Triangles','Measurement & Geometry','Geometry','angles','Core'),
  skill(8,'coverage-geometry-transformations','Transformations','Measurement & Geometry','Geometry','transformations','Core'),
  skill(8,'coverage-geometry-similarity','Similarity','Measurement & Geometry','Geometry','similarity','Core'),
  skill(8,'coverage-geometry-quadrilaterals','Quadrilaterals','Measurement & Geometry','Geometry','geometry-properties','Core'),
  skill(8,'coverage-pythagoras-squares-and-roots','Squares and roots','Measurement & Geometry','Trigonometry','trig-right','Core'),
  skill(8,'coverage-pythagoras-pythagoras-theorem','Pythagoras\' theorem','Measurement & Geometry','Pythagoras','pythagoras','Core'),
  skill(8,'coverage-pythagoras-finding-hypotenuse','Finding hypotenuse','Measurement & Geometry','Trigonometry','trig-right','Core'),
  skill(8,'coverage-pythagoras-finding-missing-sides','Finding missing sides','Measurement & Geometry','Trigonometry','trig-right','Core'),
  skill(8,'coverage-pythagoras-applications','Applications','Measurement & Geometry','Trigonometry','trig-right','Core'),
  skill(8,'coverage-measurement-perimeter','Perimeter','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(8,'coverage-measurement-composite-perimeter','Composite perimeter','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(8,'coverage-measurement-circle-circumference','Circle circumference','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(8,'coverage-measurement-area','Area','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(8,'coverage-measurement-circle-area','Circle area','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(8,'coverage-measurement-surface-area','Surface area','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(8,'coverage-measurement-volume-of-prisms','Volume of prisms','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(8,'coverage-probability-calculating-probability','Calculating probability','Probability','Probability','probability','Core'),
  skill(8,'coverage-probability-union-intersection','Union/intersection','Probability','Probability','probability-compound','Core'),
  skill(8,'coverage-probability-two-way-tables','Two-way tables','Probability','Probability','probability-compound','Core'),
  skill(8,'coverage-statistics-centre-and-spread','Centre and spread','Statistics & Data','Statistics','statistics-centre','Core'),
  skill(8,'coverage-statistics-sampling','Sampling','Statistics & Data','Statistics','data-display','Core'),
  skill(8,'coverage-statistics-bias','Bias','Statistics & Data','Statistics','sampling','Core'),
  skill(8,'coverage-statistics-comparing-samples-and-populations','Comparing samples and populations','Statistics & Data','Statistics','sampling','Core'),
  skill(9,'coverage-real-numbers-and-indices-rational-irrational-numbers','Rational/irrational numbers','Number','Ratio & Rates','ratio-rate','Core'),
  skill(9,'coverage-real-numbers-and-indices-powers','Powers','Number','Number','real-number','Core'),
  skill(9,'coverage-real-numbers-and-indices-zero-indices','Zero indices','Number','Number','real-number','Core'),
  skill(9,'coverage-real-numbers-and-indices-negative-indices','Negative indices','Number','Number','real-number','Core'),
  skill(9,'coverage-algebra-algebra-review','Algebra review','Algebra','Algebra','simplify','Core'),
  skill(9,'coverage-algebra-distributive-law','Distributive law','Algebra','Algebra','expand','Core'),
  skill(9,'coverage-algebra-binomial-expansion','Binomial expansion','Algebra','Algebra','expand','Core'),
  skill(9,'coverage-algebra-algebraic-factors','Algebraic factors','Algebra','Algebra','factor-common','Core'),
  skill(9,'coverage-algebra-factorising','Factorising','Algebra','Algebra','factor-common','Core'),
  skill(9,'coverage-algebra-factorising-by-grouping','Factorising by grouping','Algebra','Algebra','factor-common','Core'),
  skill(9,'coverage-coordinate-geometry-midpoint','Midpoint','Functions & Graphs','Coordinate Geometry','coordinate-geometry','Core'),
  skill(9,'coverage-coordinate-geometry-gradient','Gradient','Functions & Graphs','Coordinate Geometry','gradient','Core'),
  skill(9,'coverage-coordinate-geometry-distance-between-two-points','Distance between two points','Functions & Graphs','Coordinate Geometry','coordinate-geometry','Core'),
  skill(9,'coverage-coordinate-geometry-gradient-intercept-form','Gradient-intercept form','Functions & Graphs','Coordinate Geometry','gradient','Core'),
  skill(9,'coverage-coordinate-geometry-parallel-lines','Parallel lines','Functions & Graphs','Coordinate Geometry','coordinate-geometry','Core'),
  skill(9,'coverage-coordinate-geometry-perpendicular-lines','Perpendicular lines','Functions & Graphs','Coordinate Geometry','coordinate-geometry','Core'),
  skill(9,'coverage-coordinate-geometry-equation-of-a-straight-line','Equation of a straight line','Functions & Graphs','Coordinate Geometry','coordinate-geometry','Core'),
  skill(9,'coverage-quadratics-quadratic-relationships','Quadratic relationships','Functions & Graphs','Quadratics','quadratic-expand','Core'),
  skill(9,'coverage-quadratics-graphing-quadratics','Graphing quadratics','Functions & Graphs','Quadratics','quadratic-graph','Core'),
  skill(9,'coverage-quadratics-basic-quadratics','Basic quadratics','Functions & Graphs','Quadratics','quadratic-expand','Core'),
  skill(9,'coverage-quadratics-translations','Translations','Functions & Graphs','Quadratics','quadratic-graph','Core'),
  skill(9,'coverage-quadratics-turning-point-form','Turning-point form','Functions & Graphs','Quadratics','quadratic-graph','Core'),
  skill(9,'coverage-quadratics-factorised-form','Factorised form','Functions & Graphs','Quadratics','quadratic-graph','Core'),
  skill(9,'coverage-quadratics-standard-form','Standard form','Functions & Graphs','Quadratics','quadratic-graph','Core'),
  skill(9,'coverage-quadratics-roots-solutions','Roots/solutions','Functions & Graphs','Quadratics','quadratic-solve','Core'),
  skill(9,'coverage-quadratics-solving-quadratics','Solving quadratics','Functions & Graphs','Quadratics','quadratic-solve','Core'),
  skill(9,'coverage-quadratics-factorisation','Factorisation','Functions & Graphs','Quadratics','quadratic-factor','Core'),
  skill(9,'coverage-financial-mathematics-income','Income','Number','Financial Maths','finance-simple','Core'),
  skill(9,'coverage-financial-mathematics-wages','Wages','Number','Financial Maths','finance-simple','Core'),
  skill(9,'coverage-financial-mathematics-simple-interest','Simple interest','Number','Financial Maths','finance-simple','Core'),
  skill(9,'coverage-financial-mathematics-reinvesting-simple-interest','Reinvesting simple interest','Number','Financial Maths','finance-simple','Core'),
  skill(9,'coverage-financial-mathematics-financial-calculations','Financial calculations','Number','Financial Maths','finance-simple','Core'),
  skill(9,'coverage-similarity-and-scale-similar-figures','Similar figures','Measurement & Geometry','Geometry','similarity','Core'),
  skill(9,'coverage-similarity-and-scale-scale-factors','Scale factors','Number','Ratio & Rates','ratio-rate','Core'),
  skill(9,'coverage-similarity-and-scale-scale-and-area','Scale and area','Number','Ratio & Rates','ratio-rate','Core'),
  skill(9,'coverage-similarity-and-scale-scale-and-volume','Scale and volume','Number','Ratio & Rates','ratio-rate','Core'),
  skill(9,'coverage-pythagoras-and-trigonometry-pythagoras','Pythagoras','Measurement & Geometry','Pythagoras','pythagoras','Core'),
  skill(9,'coverage-pythagoras-and-trigonometry-trigonometric-ratios','Trigonometric ratios','Number','Ratio & Rates','ratio-rate','Core'),
  skill(9,'coverage-pythagoras-and-trigonometry-finding-angles','Finding angles','Measurement & Geometry','Trigonometry','trig-right','Core'),
  skill(9,'coverage-pythagoras-and-trigonometry-finding-sides','Finding sides','Measurement & Geometry','Trigonometry','trig-right','Core'),
  skill(9,'coverage-pythagoras-and-trigonometry-trigonometry-applications','Trigonometry applications','Measurement & Geometry','Trigonometry','trig-right','Core'),
  skill(9,'coverage-measurement-area','Area','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(9,'coverage-measurement-composite-area','Composite area','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(9,'coverage-measurement-surface-area','Surface area','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(9,'coverage-measurement-volume','Volume','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(9,'coverage-measurement-prisms','Prisms','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(9,'coverage-measurement-cylinders','Cylinders','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(9,'coverage-measurement-measurement-accuracy','Measurement accuracy','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(9,'coverage-probability-experimental-probability','Experimental probability','Probability','Probability','relative-frequency','Core'),
  skill(9,'coverage-probability-venn-diagrams','Venn diagrams','Probability','Probability','venn','Core'),
  skill(9,'coverage-probability-two-way-tables','Two-way tables','Probability','Probability','probability-compound','Core'),
  skill(9,'coverage-probability-arrays','Arrays','Probability','Probability','probability-compound','Core'),
  skill(9,'coverage-probability-tree-diagrams','Tree diagrams','Probability','Probability','probability-tree','Core'),
  skill(9,'coverage-probability-multi-stage-probability','Multi-stage probability','Probability','Probability','probability-tree','Core'),
  skill(9,'coverage-statistics-types-of-data','Types of data','Statistics & Data','Statistics','data-display','Core'),
  skill(9,'coverage-statistics-data-displays','Data displays','Statistics & Data','Statistics','data-display','Core'),
  skill(9,'coverage-statistics-stem-and-leaf-plots','Stem-and-leaf plots','Statistics & Data','Statistics','statistics-distribution','Core'),
  skill(9,'coverage-statistics-back-to-back-stem-and-leaf','Back-to-back stem-and-leaf','Statistics & Data','Statistics','statistics-distribution','Core'),
  skill(9,'coverage-statistics-histograms','Histograms','Statistics & Data','Statistics','statistics-distribution','Core'),
  skill(9,'coverage-statistics-grouped-histograms','Grouped histograms','Statistics & Data','Statistics','statistics-distribution','Core'),
  skill(9,'coverage-statistics-distribution-shape','Distribution shape','Statistics & Data','Statistics','statistics-distribution','Core'),
  skill(9,'coverage-statistics-comparing-data-sets','Comparing data sets','Statistics & Data','Statistics','data-display','Core'),
  skill(10,'coverage-indices-and-surds-index-laws','Index laws','Number','Indices','indices','Core'),
  skill(10,'coverage-indices-and-surds-negative-indices','Negative indices','Number','Indices','indices','Core'),
  skill(10,'coverage-indices-and-surds-fractional-indices','Fractional indices','Number','Fractions','fraction','Core'),
  skill(10,'coverage-indices-and-surds-surds','Surds','Number','Indices','indices','Core'),
  skill(10,'coverage-indices-and-surds-simplifying-surds','Simplifying surds','Number','Indices','indices','Core'),
  skill(10,'coverage-indices-and-surds-surd-operations','Surd operations','Number','Ratio & Rates','ratio-rate','Core'),
  skill(10,'coverage-advanced-algebra-factorisation','Factorisation','Algebra','Algebra','factor-common','Core'),
  skill(10,'coverage-advanced-algebra-polynomial-expressions','Polynomial expressions','Algebra','Algebra','polynomial','Core'),
  skill(10,'coverage-advanced-algebra-polynomial-operations','Polynomial operations','Number','Ratio & Rates','ratio-rate','Core'),
  skill(10,'coverage-advanced-algebra-identities','Identities','Algebra','Algebra','polynomial','Core'),
  skill(10,'coverage-linear-equations-linear-equations','Linear equations','Algebra','Equations','linear-equation','Core'),
  skill(10,'coverage-linear-equations-linear-inequalities','Linear inequalities','Algebra','Inequalities','inequality','Core'),
  skill(10,'coverage-linear-equations-graphical-inequalities','Graphical inequalities','Algebra','Inequalities','inequality','Core'),
  skill(10,'coverage-linear-equations-substitution-method','Substitution method','Algebra','Equations','simultaneous','Core'),
  skill(10,'coverage-linear-equations-elimination-method','Elimination method','Algebra','Equations','simultaneous','Core'),
  skill(10,'coverage-linear-equations-applications','Applications','Algebra','Equations','linear-equation','Core'),
  skill(10,'coverage-quadratics-quadratic-equations','Quadratic equations','Functions & Graphs','Quadratics','quadratic-expand','Core'),
  skill(10,'coverage-quadratics-factorising','Factorising','Functions & Graphs','Quadratics','quadratic-factor','Core'),
  skill(10,'coverage-quadratics-completing-the-square','Completing the square','Functions & Graphs','Quadratics','quadratic-expand','Core'),
  skill(10,'coverage-quadratics-quadratic-formula','Quadratic formula','Functions & Graphs','Quadratics','quadratic-graph','Core'),
  skill(10,'coverage-quadratics-quadratic-graphs','Quadratic graphs','Functions & Graphs','Quadratics','quadratic-graph','Core'),
  skill(10,'coverage-quadratics-roots','Roots','Functions & Graphs','Quadratics','quadratic-solve','Core'),
  skill(10,'coverage-quadratics-turning-points','Turning points','Functions & Graphs','Quadratics','quadratic-graph','Core'),
  skill(10,'coverage-functions-and-nonlinear-relationships-functions','Functions','Functions & Graphs','Linear Relations','linear-graph','Core'),
  skill(10,'coverage-functions-and-nonlinear-relationships-exponential-models','Exponential models','Functions & Graphs','Linear Relations','linear-graph','Core'),
  skill(10,'coverage-functions-and-nonlinear-relationships-hyperbolas','Hyperbolas','Functions & Graphs','Linear Relations','linear-graph','Core'),
  skill(10,'coverage-functions-and-nonlinear-relationships-circles','Circles','Functions & Graphs','Linear Relations','linear-graph','Core'),
  skill(10,'coverage-functions-and-nonlinear-relationships-intersections-of-curves','Intersections of curves','Functions & Graphs','Linear Relations','linear-graph','Core'),
  skill(10,'coverage-trigonometry-trig-ratios','Trig ratios','Number','Ratio & Rates','ratio-rate','Core'),
  skill(10,'coverage-trigonometry-bearings','Bearings','Measurement & Geometry','Trigonometry','bearings','Core'),
  skill(10,'coverage-trigonometry-pythagoras-in-3d','Pythagoras in 3D','Measurement & Geometry','Pythagoras','pythagoras','Core'),
  skill(10,'coverage-trigonometry-3d-trigonometry','3D trigonometry','Measurement & Geometry','Trigonometry','trig-right','Core'),
  skill(10,'coverage-trigonometry-exact-trig-values','Exact trig values','Measurement & Geometry','Trigonometry','trig-function','Core'),
  skill(10,'coverage-trigonometry-unit-circle','Unit circle','Measurement & Geometry','Trigonometry','trig-function','Core'),
  skill(10,'coverage-trigonometry-sine-graphs','Sine graphs','Measurement & Geometry','Trigonometry','trig-function','Core'),
  skill(10,'coverage-trigonometry-cosine-graphs','Cosine graphs','Measurement & Geometry','Trigonometry','trig-function','Core'),
  skill(10,'coverage-trigonometry-trigonometric-equations','Trigonometric equations','Measurement & Geometry','Trigonometry','trig-function','Core'),
  skill(10,'coverage-trigonometry-sine-rule','Sine rule','Measurement & Geometry','Trigonometry','trig-right','Core'),
  skill(10,'coverage-trigonometry-cosine-rule','Cosine rule','Measurement & Geometry','Trigonometry','trig-right','Core'),
  skill(10,'coverage-trigonometry-triangle-area-formula','Triangle area formula','Measurement & Geometry','Trigonometry','trig-right','Core'),
  skill(10,'coverage-geometry-and-proof-deductive-reasoning','Deductive reasoning','Measurement & Geometry','Geometry','proof','Core'),
  skill(10,'coverage-geometry-and-proof-parallel-line-proofs','Parallel-line proofs','Measurement & Geometry','Geometry','proof','Core'),
  skill(10,'coverage-geometry-and-proof-congruent-triangles','Congruent triangles','Measurement & Geometry','Geometry','similarity','Core'),
  skill(10,'coverage-geometry-and-proof-similar-triangles','Similar triangles','Measurement & Geometry','Geometry','similarity','Core'),
  skill(10,'coverage-geometry-and-proof-geometric-proofs','Geometric proofs','Measurement & Geometry','Geometry','proof','Core'),
  skill(10,'coverage-geometry-and-proof-tangents','Tangents','Measurement & Geometry','Geometry','circle-geometry','Core'),
  skill(10,'coverage-measurement-perimeter','Perimeter','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(10,'coverage-measurement-area','Area','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(10,'coverage-measurement-circles','Circles','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(10,'coverage-measurement-surface-area','Surface area','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(10,'coverage-measurement-prisms','Prisms','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(10,'coverage-measurement-cylinders','Cylinders','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(10,'coverage-measurement-spheres','Spheres','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(10,'coverage-measurement-volume','Volume','Measurement & Geometry','Measurement','measurement-3d','Core'),
  skill(10,'coverage-measurement-estimation','Estimation','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(10,'coverage-measurement-accuracy','Accuracy','Measurement & Geometry','Measurement','measurement-2d','Core'),
  skill(10,'coverage-probability-venn-diagrams','Venn diagrams','Probability','Probability','venn','Core'),
  skill(10,'coverage-probability-two-way-tables','Two-way tables','Probability','Probability','probability-compound','Core'),
  skill(10,'coverage-probability-mutually-exclusive-events','Mutually exclusive events','Probability','Probability','probability-compound','Core'),
  skill(10,'coverage-probability-multi-stage-events','Multi-stage events','Probability','Probability','probability-tree','Core'),
  skill(10,'coverage-probability-counting-principles','Counting principles','Probability','Probability','probability-compound','Core'),
  skill(10,'coverage-statistics-data-displays','Data displays','Statistics & Data','Statistics','data-display','Core'),
  skill(10,'coverage-statistics-cumulative-frequency','Cumulative frequency','Statistics & Data','Statistics','statistics-distribution','Core'),
  skill(10,'coverage-statistics-samples-and-populations','Samples and populations','Statistics & Data','Statistics','sampling','Core'),
  skill(10,'coverage-statistics-comparing-datasets','Comparing datasets','Statistics & Data','Statistics','data-display','Core'),
  skill(10,'coverage-statistics-bivariate-statistics','Bivariate statistics','Statistics & Data','Bivariate Data','regression','Core'),
  skill(10,'coverage-statistics-associations','Associations','Statistics & Data','Bivariate Data','regression','Core'),
  skill(10,'coverage-statistics-correlation','Correlation','Statistics & Data','Bivariate Data','regression','Core'),
  skill(10,'coverage-statistics-line-of-best-fit','Line of best fit','Statistics & Data','Bivariate Data','regression','Core'),
  skill(10,'coverage-networks-network-introduction','Network introduction','Statistics & Data','Networks','networks','Core'),
  skill(10,'coverage-networks-network-representations','Network representations','Statistics & Data','Networks','networks','Core'),
  skill(10,'coverage-networks-paths','Paths','Statistics & Data','Networks','networks','Core'),
  skill(10,'coverage-networks-planar-graphs','Planar graphs','Statistics & Data','Networks','networks','Core'),
  skill(10,'coverage-networks-connectivity','Connectivity','Statistics & Data','Networks','networks','Core'),
  skill(11,'coverage-essential-general-percentages','Percentages','Number','Percentages','percentage','Core'),
  skill(11,'coverage-essential-general-simple-interest','Simple interest','Number','Financial Maths','finance-simple','Core'),
  skill(11,'coverage-essential-general-compound-interest','Compound interest','Number','Financial Maths','finance-simple','Core'),
  skill(11,'coverage-essential-general-consumer-arithmetic','Consumer arithmetic','Number','Financial Maths','finance-simple','Core'),
  skill(11,'coverage-essential-general-loans','Loans','Number','Financial Maths','finance-simple','Core'),
  skill(11,'coverage-essential-general-investments','Investments','Number','Financial Maths','finance-simple','Core'),
  skill(11,'coverage-essential-general-financial-modelling','Financial modelling','Number','Financial Maths','finance-simple','Core'),
  skill(11,'coverage-essential-general-algebra','Algebra','Algebra','Algebra','simplify','Standard'),
  skill(11,'coverage-essential-general-linear-equations','Linear equations','Algebra','Equations','linear-equation','Standard'),
  skill(11,'coverage-essential-general-matrices','Matrices','Algebra','Algebra','simplify','Standard'),
  skill(11,'coverage-essential-general-measurement','Measurement','Measurement & Geometry','Measurement','measurement-composite','Standard'),
  skill(11,'coverage-essential-general-pythagoras','Pythagoras','Measurement & Geometry','Measurement','measurement-composite','Standard'),
  skill(11,'coverage-essential-general-similarity','Similarity','Measurement & Geometry','Measurement','measurement-composite','Standard'),
  skill(11,'coverage-essential-general-scale','Scale','Number','Ratio & Rates','ratio-rate','Core'),
  skill(11,'coverage-essential-general-trigonometry','Trigonometry','Functions & Graphs','Trigonometry','trig-function','Standard'),
  skill(11,'coverage-essential-general-statistics','Statistics','Statistics & Data','Statistics','statistics-distribution','Standard'),
  skill(11,'coverage-essential-general-probability','Probability','Probability','Probability','probability-conditional','Standard'),
  skill(11,'coverage-essential-general-sequences','Sequences','Algebra','Sequences & Series','sequence','Standard'),
  skill(11,'coverage-essential-general-networks','Networks','Statistics & Data','Networks','networks','Standard'),
  skill(11,'coverage-essential-general-graphs','Graphs','Functions & Graphs','Graphs','linear-graph','Standard'),
  skill(11,'coverage-essential-general-time-series','Time series','Statistics & Data','Statistics','statistics-distribution','Standard'),
  skill(11,'coverage-mathematical-methods-equations','Equations','Algebra','Equations','linear-equation','Advanced'),
  skill(11,'coverage-mathematical-methods-polynomials','Polynomials','Functions & Graphs','Polynomials','polynomial','Advanced'),
  skill(11,'coverage-mathematical-methods-relations','Relations','Functions & Graphs','Functions','function-eval','Advanced'),
  skill(11,'coverage-mathematical-methods-functions','Functions','Functions & Graphs','Functions','function-eval','Advanced'),
  skill(11,'coverage-mathematical-methods-function-transformations','Function transformations','Functions & Graphs','Functions','function-eval','Advanced'),
  skill(11,'coverage-mathematical-methods-trigonometric-ratios','Trigonometric ratios','Number','Ratio & Rates','ratio-rate','Core'),
  skill(11,'coverage-mathematical-methods-trigonometric-functions','Trigonometric functions','Functions & Graphs','Trigonometry','trig-function','Advanced'),
  skill(11,'coverage-mathematical-methods-indices','Indices','Number','Indices','indices','Core'),
  skill(11,'coverage-mathematical-methods-exponential-functions','Exponential functions','Functions & Graphs','Exponential Functions','exponential','Advanced'),
  skill(11,'coverage-mathematical-methods-logarithms','Logarithms','Functions & Graphs','Logarithms','logarithm','Advanced'),
  skill(11,'coverage-mathematical-methods-sequences','Sequences','Algebra','Sequences & Series','sequence','Advanced'),
  skill(11,'coverage-mathematical-methods-series','Series','Algebra','Sequences & Series','sequence','Advanced'),
  skill(11,'coverage-mathematical-methods-probability','Probability','Probability','Probability','probability-conditional','Advanced'),
  skill(11,'coverage-mathematical-methods-differential-calculus','Differential calculus','Functions & Graphs','Calculus','calculus-diff','Advanced'),
  skill(11,'coverage-mathematical-methods-limits','Limits','Functions & Graphs','Calculus','calculus-diff','Advanced'),
  skill(11,'coverage-mathematical-methods-derivatives','Derivatives','Functions & Graphs','Calculus','calculus-diff','Advanced'),
  skill(11,'coverage-mathematical-methods-rules-of-differentiation','Rules of differentiation','Functions & Graphs','Calculus','calculus-diff','Advanced'),
  skill(11,'coverage-mathematical-methods-applications-of-differentiation','Applications of differentiation','Functions & Graphs','Calculus','calculus-diff','Advanced'),
  skill(11,'coverage-mathematical-methods-integration','Integration','Number','Ratio & Rates','ratio-rate','Core'),
  skill(11,'coverage-mathematical-methods-applications-of-integration','Applications of integration','Number','Ratio & Rates','ratio-rate','Core'),
  skill(12,'coverage-essential-general-percentages','Percentages','Number','Percentages','percentage','Core'),
  skill(12,'coverage-essential-general-simple-interest','Simple interest','Number','Financial Maths','finance-simple','Core'),
  skill(12,'coverage-essential-general-compound-interest','Compound interest','Number','Financial Maths','finance-simple','Core'),
  skill(12,'coverage-essential-general-consumer-arithmetic','Consumer arithmetic','Number','Financial Maths','finance-simple','Core'),
  skill(12,'coverage-essential-general-loans','Loans','Number','Financial Maths','finance-simple','Core'),
  skill(12,'coverage-essential-general-investments','Investments','Number','Financial Maths','finance-simple','Core'),
  skill(12,'coverage-essential-general-financial-modelling','Financial modelling','Number','Financial Maths','finance-simple','Core'),
  skill(12,'coverage-essential-general-algebra','Algebra','Algebra','Algebra','simplify','Standard'),
  skill(12,'coverage-essential-general-linear-equations','Linear equations','Algebra','Equations','linear-equation','Standard'),
  skill(12,'coverage-essential-general-matrices','Matrices','Algebra','Algebra','simplify','Standard'),
  skill(12,'coverage-essential-general-measurement','Measurement','Measurement & Geometry','Measurement','measurement-composite','Standard'),
  skill(12,'coverage-essential-general-pythagoras','Pythagoras','Measurement & Geometry','Measurement','measurement-composite','Standard'),
  skill(12,'coverage-essential-general-similarity','Similarity','Measurement & Geometry','Measurement','measurement-composite','Standard'),
  skill(12,'coverage-essential-general-scale','Scale','Number','Ratio & Rates','ratio-rate','Core'),
  skill(12,'coverage-essential-general-trigonometry','Trigonometry','Functions & Graphs','Trigonometry','trig-function','Standard'),
  skill(12,'coverage-essential-general-statistics','Statistics','Statistics & Data','Statistics','statistics-distribution','Standard'),
  skill(12,'coverage-essential-general-probability','Probability','Probability','Probability','probability-conditional','Standard'),
  skill(12,'coverage-essential-general-sequences','Sequences','Algebra','Sequences & Series','sequence','Standard'),
  skill(12,'coverage-essential-general-networks','Networks','Statistics & Data','Networks','networks','Standard'),
  skill(12,'coverage-essential-general-graphs','Graphs','Functions & Graphs','Graphs','linear-graph','Standard'),
  skill(12,'coverage-essential-general-time-series','Time series','Statistics & Data','Statistics','statistics-distribution','Standard'),
  skill(12,'coverage-mathematical-methods-equations','Equations','Algebra','Equations','linear-equation','Advanced'),
  skill(12,'coverage-mathematical-methods-polynomials','Polynomials','Functions & Graphs','Polynomials','polynomial','Advanced'),
  skill(12,'coverage-mathematical-methods-relations','Relations','Functions & Graphs','Functions','function-eval','Advanced'),
  skill(12,'coverage-mathematical-methods-functions','Functions','Functions & Graphs','Functions','function-eval','Advanced'),
  skill(12,'coverage-mathematical-methods-trigonometric-ratios','Trigonometric ratios','Number','Ratio & Rates','ratio-rate','Core'),
  skill(12,'coverage-mathematical-methods-trigonometric-functions','Trigonometric functions','Functions & Graphs','Trigonometry','trig-function','Advanced'),
  skill(12,'coverage-mathematical-methods-indices','Indices','Number','Indices','indices','Core'),
  skill(12,'coverage-mathematical-methods-exponential-functions','Exponential functions','Functions & Graphs','Exponential Functions','exponential','Advanced'),
  skill(12,'coverage-mathematical-methods-logarithms','Logarithms','Functions & Graphs','Logarithms','logarithm','Advanced'),
  skill(12,'coverage-mathematical-methods-sequences','Sequences','Algebra','Sequences & Series','sequence','Advanced'),
  skill(12,'coverage-mathematical-methods-series','Series','Algebra','Sequences & Series','sequence','Advanced'),
  skill(12,'coverage-mathematical-methods-probability','Probability','Probability','Probability','probability-conditional','Advanced'),
  skill(12,'coverage-mathematical-methods-differential-calculus','Differential calculus','Functions & Graphs','Calculus','calculus-diff','Advanced'),
  skill(12,'coverage-mathematical-methods-limits','Limits','Functions & Graphs','Calculus','calculus-diff','Advanced'),
  skill(12,'coverage-mathematical-methods-derivatives','Derivatives','Functions & Graphs','Calculus','calculus-diff','Advanced'),
  skill(12,'coverage-mathematical-methods-rules-of-differentiation','Rules of differentiation','Functions & Graphs','Calculus','calculus-diff','Advanced'),
  skill(12,'coverage-mathematical-methods-applications-of-differentiation','Applications of differentiation','Functions & Graphs','Calculus','calculus-diff','Advanced'),
  skill(12,'coverage-mathematical-methods-integration','Integration','Number','Ratio & Rates','ratio-rate','Core'),
  skill(12,'coverage-mathematical-methods-applications-of-integration','Applications of integration','Number','Ratio & Rates','ratio-rate','Core'),
  skill(4,'coverage-number-number-patterns','Number patterns','Number','Number','arithmetic','Core'),
  skill(7,'coverage-number-order-of-operations','Order of operations','Number','Number','arithmetic','Core'),
  skill(7,'coverage-equations-one-step-equations','One-step equations','Algebra','Equations','linear-equation','Core'),
  skill(8,'coverage-real-numbers-rational-numbers','Rational numbers','Number','Number','real-number','Core'),
  skill(8,'coverage-geometry-congruence','Congruence','Measurement & Geometry','Geometry','similarity','Core'),
  skill(9,'coverage-coordinate-geometry-direct-proportion','Direct proportion','Functions & Graphs','Coordinate Geometry','linear-graph','Core'),
  skill(10,'coverage-advanced-algebra-algebraic-fractions','Algebraic fractions','Algebra','Algebra','algebra-fraction','Core'),
  skill(10,'coverage-linear-equations-simultaneous-equations','Simultaneous equations','Algebra','Equations','simultaneous','Core'),
  skill(10,'coverage-functions-nonlinear-exponential-relationships','Exponential relationships','Functions & Graphs','Exponential Functions','exponential','Core'),
  skill(10,'coverage-geometry-proof-circle-geometry','Circle geometry','Measurement & Geometry','Geometry','circle-geometry','Core'),
  skill(10,'coverage-probability-conditional-probability','Conditional probability','Probability','Probability','probability-conditional','Core'),
  skill(10,'coverage-statistics-standard-deviation','Standard deviation','Statistics & Data','Statistics','standard-deviation','Core'),
];

const CURRICULUM = Object.freeze([...YK, ...Y1, ...Y2, ...Y3, ...Y4, ...Y5, ...Y6, ...FOUNDATION_EXPANSION_SKILLS, ...Y7, ...Y8, ...Y9, ...Y10, ...senior(11), ...senior(12), ...EXTRA_SKILLS, ...COVERAGE_CHECKLIST_SKILLS]);
function getCurriculumSkills({ yearLevel = null, pathway = 'all', strand = 'all', topic = 'all', query = '' } = {}) {
  const y = yearLevel === null || yearLevel === 'all' || yearLevel === '' ? null : Number(yearLevel);
  const q = String(query).trim().toLowerCase();
  return CURRICULUM.filter((item) => {
    if (y !== null && item.yearLevel !== y) return false;
    if (pathway !== 'all' && item.pathway !== pathway) return false;
    if (strand !== 'all' && item.strand !== strand) return false;
    if (topic !== 'all' && item.topic !== topic) return false;
    if (!q) return true;
    return `${item.title} ${item.strand} ${item.topic} ${item.pathway}`.toLowerCase().includes(q);
  });
}
function getCurriculumSkill(yearLevel, id) {
  return CURRICULUM.find((item) => item.yearLevel === Number(yearLevel) && item.id === String(id)) ?? null;
}
const CURRICULUM_STRANDS = Object.freeze([...new Set(CURRICULUM.map((item) => item.strand))]);
const CURRICULUM_TOPICS = Object.freeze([...new Set(CURRICULUM.map((item) => item.topic))]);

return {YEARS,CURRICULUM,getCurriculumSkills,getCurriculumSkill,CURRICULUM_STRANDS,CURRICULUM_TOPICS,CURRICULUM_SYSTEMS};
})();
// module: src/data/task-library.js
__modules["src/data/task-library.js"]=(()=>{
const {CURRICULUM, getCurriculumSkill, getCurriculumSkills}=__modules["src/data/curriculum.js"];


const TASK_TYPES = Object.freeze([
  ['practice', 'Practice'],
  ['custom', 'Custom Task'],
  ['adaptive', 'Adaptive Task'],
  ['lesson', 'Lesson Task'],
  ['worksheet', 'Worksheet Task'],
  ['test', 'Test Mode'],
  ['readiness', 'Topic Readiness Check'],
  ['discovery-checkin', 'Discovery Check-In'],
  ['skills-checkin', 'Skills Check-In'],
  ['skill-check', '2-question Skill Check'],
  ['recommended', 'Recommended Practice'],
  ['revision', 'Revision Task'],
  ['template', 'Task Template'],
  ['tutorial', 'Tutorial Task'],
  ['bulk-custom', 'Bulk Custom Tasks'],
  ['bulk-adaptive', 'Bulk Adaptive Tasks'],
  ['template-sequence', 'Template Folder / Group Sequence'],
  ['topic-test', 'Topic Test'],
  ['self-directed-adaptive', 'Self-Directed Adaptive'],
]);
const TASK_DIFFICULTIES = Object.freeze(['easy', 'medium', 'hard', 'adaptive', 'mixed']);
const QUESTION_COUNTS = Object.freeze([2, 5, 6, 10, 15, 20, 25, 30, 40, 50]);
const VARIANTS = Object.freeze([
  'Core', 'Fluency', 'Mixed Skills', 'Checkpoint', 'Sprint',
  'Deep Dive', 'Mastery', 'Challenge', 'Starter', 'Consolidation',
  'Problem Solving', 'Reasoning', 'Exam Prep', 'Homework', 'Classwork',
  'Revision A', 'Revision B', 'Extension', 'Support', 'Investigation',
  'Quick Check', 'Mixed Review', 'Application', 'Skills Builder', 'Final Check'
]);
const TASKS_PER_SKILL = TASK_TYPES.length * TASK_DIFFICULTIES.length * QUESTION_COUNTS.length * VARIANTS.length;
const TASK_LIBRARY_SIZE = CURRICULUM.length * TASKS_PER_SKILL;

const clamp = (n, min, max) => Math.max(min, Math.min(max, Number(n) || 0));
const round = (n, places = 2) => Number(Number(n).toFixed(places));
const gcd = (a, b) => { let x = Math.abs(a), y = Math.abs(b); while (y) [x, y] = [y, x % y]; return x || 1; };

function hash32(text) {
  let h = 2166136261 >>> 0;
  for (const ch of String(text)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rngFor(seed) {
  let x = hash32(seed) || 123456789;
  return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return (x >>> 0) / 4294967296; };
}
const int = (r, min, max) => Math.floor(r() * (max - min + 1)) + min;
const pick = (r, values) => values[int(r, 0, values.length - 1)];

function estimateMinutes(questionCount, difficulty, type) {
  const per = difficulty === 'hard' ? 2.5 : difficulty === 'medium' ? 1.8 : difficulty === 'adaptive' ? 1.9 : difficulty === 'mixed' ? 2.0 : 1.2;
  const factor = type === 'test' ? 1.15 : type === 'lesson' ? 1.1 : 1;
  return Math.max(5, Math.round(questionCount * per * factor));
}
function masteryTarget(type, difficulty) {
  if (type === 'test') return difficulty === 'hard' ? 85 : difficulty === 'easy' ? 65 : 75;
  if (difficulty === 'hard') return 80;
  if (difficulty === 'easy') return 55;
  if (difficulty === 'mixed') return 75;
  return 70;
}
function taskId({ skill, type, difficulty, questionCount, variant }) {
  return `mr2:y${skill.yearLevel}:${skill.id}:${type}:${difficulty}:q${questionCount}:v${variant}`;
}
function parseTaskId(id) {
  const parts = String(id || '').split(':');
  if (parts.length !== 7 || parts[0] !== 'mr2' || !/^y\d+$/.test(parts[1]) || !/^q\d+$/.test(parts[5]) || !/^v\d+$/.test(parts[6])) return null;
  const yearLevel = Number(parts[1].slice(1));
  const skill = getCurriculumSkill(yearLevel, parts[2]);
  if (!skill) return null;
  const type = parts[3], difficulty = parts[4], questionCount = Number(parts[5].slice(1)), variant = Number(parts[6].slice(1));
  if (!TASK_TYPES.some(([value]) => value === type) || !TASK_DIFFICULTIES.includes(difficulty) || !QUESTION_COUNTS.includes(questionCount) || variant < 1 || variant > VARIANTS.length) return null;
  return { skill, type, difficulty, questionCount, variant };
}
function buildTask(skill, type, difficulty, questionCount, variant) {
  const typeLabel = TASK_TYPES.find(([v]) => v === type)?.[1] || type;
  const diffLabel = difficulty === 'adaptive' ? 'Adaptive' : difficulty === 'mixed' ? 'Mixed Difficulty' : difficulty[0].toUpperCase() + difficulty.slice(1);
  return Object.freeze({
    id: taskId({ skill, type, difficulty, questionCount, variant }),
    yearLevel: skill.yearLevel,
    pathway: skill.pathway,
    strand: skill.strand,
    topic: skill.topic,
    skill: skill.title,
    skillId: skill.id,
    lessonId: skill.id,
    generator: skill.generator,
    type,
    typeLabel,
    difficulty,
    questionCount,
    estimatedMinutes: estimateMinutes(questionCount, difficulty, type),
    masteryTarget: masteryTarget(type, difficulty),
    title: `${skill.yearLevel===0?'Kindergarten':`Year ${skill.yearLevel}`} ${skill.title} · ${diffLabel} ${typeLabel} · ${VARIANTS[variant - 1]}`,
    learningGoal: skill.learningGoal,
    variant,
    variantLabel: VARIANTS[variant - 1],
    curriculum: skill.yearLevel >= 11 ? `${skill.pathway} senior mathematics` : 'K–10 mathematics',
  });
}
function taskAtIndex(index) {
  const i = Number(index);
  if (!Number.isInteger(i) || i < 0 || i >= TASK_LIBRARY_SIZE) return undefined;
  const skillIndex = Math.floor(i / TASKS_PER_SKILL);
  let rem = i % TASKS_PER_SKILL;
  const typeIndex = Math.floor(rem / (TASK_DIFFICULTIES.length * QUESTION_COUNTS.length * VARIANTS.length));
  rem %= TASK_DIFFICULTIES.length * QUESTION_COUNTS.length * VARIANTS.length;
  const diffIndex = Math.floor(rem / (QUESTION_COUNTS.length * VARIANTS.length));
  rem %= QUESTION_COUNTS.length * VARIANTS.length;
  const countIndex = Math.floor(rem / VARIANTS.length);
  const variantIndex = rem % VARIANTS.length;
  return buildTask(CURRICULUM[skillIndex], TASK_TYPES[typeIndex][0], TASK_DIFFICULTIES[diffIndex], QUESTION_COUNTS[countIndex], variantIndex + 1);
}

const virtualCatalog = {
  length: TASK_LIBRARY_SIZE,
  map(callback, thisArg) { const out = new Array(TASK_LIBRARY_SIZE); for (let i = 0; i < TASK_LIBRARY_SIZE; i += 1) out[i] = callback.call(thisArg, taskAtIndex(i), i, TASK_LIBRARY); return out; },
  find(callback, thisArg) { for (let i = 0; i < TASK_LIBRARY_SIZE; i += 1) { const task = taskAtIndex(i); if (callback.call(thisArg, task, i, TASK_LIBRARY)) return task; } return undefined; },
  every(callback, thisArg) { for (let i = 0; i < TASK_LIBRARY_SIZE; i += 1) if (!callback.call(thisArg, taskAtIndex(i), i, TASK_LIBRARY)) return false; return true; },
  [Symbol.iterator]: function* () { for (let i = 0; i < TASK_LIBRARY_SIZE; i += 1) yield taskAtIndex(i); },
};
const TASK_LIBRARY = new Proxy(virtualCatalog, {
  get(target, prop, receiver) {
    if (typeof prop === 'string' && /^\d+$/.test(prop)) return taskAtIndex(Number(prop));
    return Reflect.get(target, prop, receiver);
  },
});
function getTaskById(id) {
  const parsed = parseTaskId(id);
  return parsed ? buildTask(parsed.skill, parsed.type, parsed.difficulty, parsed.questionCount, parsed.variant) : null;
}
function searchTaskLibrary({ query = '', difficulty = 'all', type = 'all', yearLevel = 'all', pathway = 'all', strand = 'all', topic = 'all', skillId = 'all', lessonId = 'all', questionCount = 'all', limit = 120 } = {}) {
  const q = String(query).trim().toLowerCase();
  const y = yearLevel === 'all' || yearLevel === '' ? null : Number(yearLevel);
  const count = questionCount === 'all' || questionCount === '' ? null : Number(questionCount);
  const requestedSkill = skillId !== 'all' ? skillId : lessonId;
  const skillMatches = getCurriculumSkills({ yearLevel: y, pathway, strand, topic }).filter((s) => requestedSkill === 'all' || !requestedSkill || s.id === requestedSkill || (requestedSkill === 'linear' && s.id === 'linear-equations'));
  const max = Math.max(1, Math.min(500, Number(limit) || 120));
  const out = [];
  for (const s of skillMatches) {
    for (const [taskType] of TASK_TYPES) {
      if (type !== 'all' && taskType !== type) continue;
      for (const diff of TASK_DIFFICULTIES) {
        if (difficulty !== 'all' && diff !== difficulty) continue;
        for (const qCount of QUESTION_COUNTS) {
          if (count && qCount !== count) continue;
          for (let variant = 1; variant <= VARIANTS.length; variant += 1) {
            const task = buildTask(s, taskType, diff, qCount, variant);
            if (q) {
              const haystack = `${task.title} ${task.skill} ${task.topic} ${task.strand} ${task.pathway} ${task.typeLabel} ${task.curriculum}`.toLowerCase();
              if (!q.split(/\s+/).every((word) => haystack.includes(word))) continue;
            }
            out.push(task);
            if (out.length >= max) return out;
          }
        }
      }
    }
  }
  return out;
}

function numericQuestion(task, index, prompt, answer, solution, complexity, hint = 'Work carefully one step at a time.') {
  return { id: `${task.id}:q${index + 1}`, lessonId: task.lessonId, topic: task.topic.toLowerCase(), difficulty: complexity, complexity, type: 'numeric', prompt, answer: round(answer, 4), exactAnswer: Number(answer), hints: [hint, solution], workedSolution: solution, xp: 12 + complexity * 8 };
}
function mcQuestion(task, index, prompt, answerText, distractors, solution, complexity, hint = 'Use the information in the question to rule out choices.') {
  // Dedupe against the answer AND against each other so two distractor formulas that
  // happen to collide for a given random draw never produce two identical-looking options.
  const seenLabels = new Set([String(answerText)]);
  const answers = [answerText];
  for (const d of distractors) {
    const label = String(d);
    if (seenLabels.has(label)) continue;
    seenLabels.add(label);
    answers.push(d);
    if (answers.length >= 4) break;
  }
  let filler = 1;
  while (answers.length < 4) {
    const candidate = String(Number(answerText) + answers.length + filler);
    filler += 1;
    if (seenLabels.has(candidate)) continue;
    seenLabels.add(candidate);
    answers.push(candidate);
  }
  const r = rngFor(`${task.id}:mc:${index}`);
  for (let i = answers.length - 1; i > 0; i -= 1) { const j = int(r, 0, i); [answers[i], answers[j]] = [answers[j], answers[i]]; }
  const options = answers.map((label, i) => ({ id: String.fromCharCode(97 + i), label: String(label) }));
  const answer = options.find((o) => o.label === String(answerText))?.id || 'a';
  return { id: `${task.id}:q${index + 1}`, lessonId: task.lessonId, topic: task.topic.toLowerCase(), difficulty: complexity, complexity, type: 'multiple-choice', prompt, answer, answerText:String(answerText), options, hints: [hint, solution], workedSolution: solution, xp: 12 + complexity * 8 };
}

function coordinateQuestion(task,index,prompt,x,y,solution,complexity,hint='Write your answer as an ordered pair (x, y).') {
  return {id:`${task.id}:q${index+1}`,lessonId:task.lessonId,topic:task.topic.toLowerCase(),difficulty:complexity,complexity,type:'coordinate',prompt,answer:[x,y],hints:[hint,solution],workedSolution:solution,xp:12+complexity*8};
}
function graphPointQuestion(task,index,prompt,x,y,solution,complexity,hint='Click the correct point on the coordinate grid.') {
  const bound=Math.max(10,Math.ceil(Math.max(Math.abs(Number(x)||0),Math.abs(Number(y)||0))+2));
  return {id:`${task.id}:q${index+1}`,lessonId:task.lessonId,topic:task.topic.toLowerCase(),difficulty:complexity,complexity,type:'graph-point',prompt,answer:[x,y],graphMin:-bound,graphMax:bound,hints:[hint,solution],workedSolution:solution,xp:14+complexity*8};
}
function numberLineQuestion(task,index,prompt,answer,min,max,solution,complexity,hint='Think about the position of the value on the number line.') {
  return {id:`${task.id}:q${index+1}`,lessonId:task.lessonId,topic:task.topic.toLowerCase(),difficulty:complexity,complexity,type:'number-line',prompt,answer,min,max,hints:[hint,solution],workedSolution:solution,xp:12+complexity*8};
}
function tableQuestion(task,index,prompt,rows,answer,solution,complexity,hint='Use the pattern in the table.') {
  return {id:`${task.id}:q${index+1}`,lessonId:task.lessonId,topic:task.topic.toLowerCase(),difficulty:complexity,complexity,type:'table-entry',prompt,rows,answer,hints:[hint,solution],workedSolution:solution,xp:12+complexity*8};
}
function writtenQuestion(task,index,prompt,solution,complexity,hint='Explain your reasoning using a complete mathematical sentence.') {
  return {id:`${task.id}:q${index+1}`,lessonId:task.lessonId,topic:task.topic.toLowerCase(),difficulty:complexity,complexity,type:'written-response',prompt,answer:'teacher-review',minLength:20,hints:[hint,solution],workedSolution:solution,xp:12+complexity*8};
}
function multiPartQuestion(task,index,prompt,parts,solution,complexity,hint='Complete each part before checking your answer.') {
  return {id:`${task.id}:q${index+1}`,lessonId:task.lessonId,topic:task.topic.toLowerCase(),difficulty:complexity,complexity,type:'multi-part',prompt,parts,answer:'multi',hints:[hint,solution],workedSolution:solution,xp:14+complexity*8};
}
function matchingQuestion(task,index,prompt,pairs,solution,complexity,hint='Match each item to the correct description.') {
  const answer=Object.fromEntries(pairs.map(p=>[p.left,p.right]));
  return {id:`${task.id}:q${index+1}`,lessonId:task.lessonId,topic:task.topic.toLowerCase(),difficulty:complexity,complexity,type:'matching',prompt,pairs,answer,hints:[hint,solution],workedSolution:solution,xp:14+complexity*8};
}
function dragDropQuestion(task,index,prompt,items,answer,solution,complexity,hint='Drag or tap the tiles into the correct order.') {
  return {id:`${task.id}:q${index+1}`,lessonId:task.lessonId,topic:task.topic.toLowerCase(),difficulty:complexity,complexity,type:'drag-drop',prompt,items,answer,hints:[hint,solution],workedSolution:solution,xp:14+complexity*8};
}

function generateByFamily(task, index) {
  const r = rngFor(`${task.id}:${index}`);
  // Variant and task type now change the mathematical form, not just the numbers.
  // This prevents different assignments on the same skill feeling like reskins.
  const form = index + ((Number(task.variant) || 1) * 17) + (hash32(task.type || 'practice') % 13);
  const tier = task.difficulty === 'hard' ? 3 : task.difficulty === 'medium' || task.difficulty === 'adaptive' ? 2 : task.difficulty === 'mixed' ? ((form % 3) + 1) : 1;
  const g = task.generator;
  const a = int(r, 2, tier === 1 ? 9 : 14), b = int(r, 2, tier === 3 ? 15 : 10), c = int(r, 1, tier === 3 ? 12 : 8);

  // K–2 question families use smaller numbers, short language and visualisable contexts.
  if (g === 'early-counting') {
    const max = task.yearLevel === 0 ? 20 : task.yearLevel === 1 ? 100 : 1000;
    const step = task.yearLevel === 0 ? 1 : pick(r,[1,2,5,10]);
    const start = int(r,0,Math.max(2,Math.min(max-step*4,task.yearLevel===2?200:40))), mode=form%5;
    if (tier === 1) {
      if(mode%2===0) return numericQuestion(task,index,`What number comes next? ${start}, ${start+step}, ${start+2*step}, __`,start+3*step,`The numbers increase by ${step}.`,1,'Count forward using the same step.');
      return numericQuestion(task,index,`What number comes just before ${start+step}?`,start+step-1,`Count back one from ${start+step}.`,1,'Count back one.');
    }
    if (tier === 2) {
      const n=int(r,Math.min(10,max),max), place=task.yearLevel===2?100:10;
      if(mode===0) return numericQuestion(task,index,`How many ${place===100?'hundreds':'tens'} are in ${n}?`,Math.floor(n/place),`Group ${n} into sets of ${place}.`,2);
      if(mode===1) return numericQuestion(task,index,`In ${n}, what digit is in the ${place===100?'hundreds':'tens'} place?`,Math.floor(n/place)%10,`Read the digit in the ${place}s place.`,2);
      if(mode===2) return numericQuestion(task,index,`Start at ${start}. Count forward by ${step} four times. What number do you reach?`,start+4*step,`Add ${step} four times.`,2);
      if(mode===3) return numericQuestion(task,index,`What is ${place} more than ${Math.max(0,n-place)}?`,Math.max(0,n-place)+place,`Add ${place}.`,2);
      return mcQuestion(task,index,`Which number is closest to ${n}?`,String(n),[String(Math.max(0,n-step)),String(Math.min(max,n+step)),String(Math.max(0,n-place))],`Compare the values on a number line.`,2);
    }
    const n=int(r,10,max); return numericQuestion(task,index,`Start at ${n}. Count back ${step*3}. What number do you reach?`,n-step*3,`Subtract ${step} three times.`,3);
  }
  if (g === 'early-comparison') {
    const max=task.yearLevel===0?20:task.yearLevel===1?100:1000, x=int(r,0,max), y=int(r,0,max);
    const sign=x===y?'=':x>y?'>':'<';
    if(form%4===3) { const z=int(r,0,max); const sorted=[...new Set([x,y,z])].sort((p,q)=>p-q); while(sorted.length<3) sorted.push(sorted[sorted.length-1]+1); return dragDropQuestion(task,index,`Drag these numbers into order from smallest to largest: ${[x,y,z].join(', ')}.`,[x,y,z].map(String),sorted.map(String),`Ordered from smallest to largest: ${sorted.join(', ')}.`,1,'Find the smallest number first, then the next smallest.'); }
    if(form%3===0) return mcQuestion(task,index,`Choose the symbol that makes this true: ${x} __ ${y}`,sign,['>','<','='].filter(v=>v!==sign),`${x} ${sign} ${y}.`,Math.min(2,tier),'Compare the size of the two numbers.');
    if(form%3===1) return mcQuestion(task,index,`Which number is greater?`,String(Math.max(x,y)),[String(Math.min(x,y)),String(Math.max(x,y)+1),String(Math.max(0,Math.min(x,y)-1))],`Compare ${x} and ${y}; the greater number is ${Math.max(x,y)}.`,1,'Look for the number further to the right on a number line.');
    return mcQuestion(task,index,`Which statement is true?`,`${x} ${sign} ${y}`,[`${x} ${sign==='>'?'<':'>'} ${y}`,`${y} ${sign} ${x}`,`${x} = ${y+1}`],`Compare the two values carefully.`,1,'Read each statement and compare the numbers.');
  }
  if (g === 'early-addition') {
    const max=task.yearLevel===0?10:task.yearLevel===1?20:100;
    const x=int(r,0,Math.max(2,Math.floor(max*.6))), y=int(r,0,Math.max(2,Math.floor(max*.35)));
    if (form%3===0) return numericQuestion(task,index,`There are ${x} blocks. ${y} more are added. How many blocks are there now?`,x+y,`${x} + ${y} = ${x+y}.`,Math.min(2,tier),'Start at the first number and count on.');
    const total=Math.min(max,x+y+int(r,0,5)), take=Math.min(total,int(r,0,Math.max(1,total)));
    return numericQuestion(task,index,`You have ${total} counters and take away ${take}. How many are left?`,total-take,`${total} - ${take} = ${total-take}.`,Math.min(2,tier),'Count back or use a number fact you know.');
  }
  if (g === 'early-groups') {
    const groups=int(r,2,task.yearLevel===0?4:6), each=int(r,2,task.yearLevel===0?4:6), total=groups*each;
    if (form%2===0) return numericQuestion(task,index,`${groups} equal groups have ${each} counters in each group. How many counters altogether?`,total,`${groups} groups of ${each} makes ${total}.`,Math.min(2,tier),'Add the same amount for each group.');
    return numericQuestion(task,index,`${total} counters are shared equally into ${groups} groups. How many counters are in each group?`,each,`${total} ÷ ${groups} = ${each}.`,Math.min(2,tier),'Share one at a time into each group.');
  }
  if (g === 'early-fractions') {
    const den=task.yearLevel<=1?2:pick(r,[2,3,4,8]); const whole=den*int(r,1,4); const mode=form%4;
    if(mode===0) return numericQuestion(task,index,`A collection has ${whole} objects. What is 1/${den} of the collection?`,whole/den,`Split ${whole} into ${den} equal groups. Each group has ${whole/den}.`,Math.min(2,tier),'Fractions make equal parts.');
    if(mode===1) return mcQuestion(task,index,`Which fraction means one part when a whole is split into ${den} equal parts?`,`1/${den}`,[`${den}/1`,`1/${den+1}`,`${den-1}/${den}`],`One of ${den} equal parts is 1/${den}.`,Math.min(2,tier),'The denominator tells how many equal parts make the whole.');
    if(mode===2) { const parts=int(r,1,Math.max(1,den-1)); return numericQuestion(task,index,`${parts} out of ${den} equal pieces are shaded. What is the numerator of the shaded fraction?`,parts,`The numerator counts the shaded pieces, so it is ${parts}.`,Math.min(2,tier),'Count the shaded parts.'); }
    const half=whole/2; return numericQuestion(task,index,`Half of a group is ${half}. How many objects are in the whole group?`,whole,`Two halves make one whole: ${half} + ${half} = ${whole}.`,Math.min(2,tier),'Double the amount in one half.');
  }
  if (g === 'early-patterns') {
    const step=pick(r,[1,2,5,10]), start=int(r,0,20);
    if(form%3===2) { const names=['circle','square','triangle','star']; const first=pick(r,names), second=pick(r,names.filter(x=>x!==first)); const scrambled=[second,first,second,first]; return dragDropQuestion(task,index,`Drag the tiles into the correct repeating pattern order, starting with ${first}: ${scrambled.join(', ')}.`,scrambled,[first,second,first,second],`The pattern repeats as ${first}, ${second}, ${first}, ${second}.`,1,'Look for the two shapes that keep swapping places.'); }
    if(form%2===0)return numericQuestion(task,index,`Continue the pattern: ${start}, ${start+step}, ${start+2*step}, __`,start+3*step,`Add ${step} each time.`,Math.min(2,tier),'Find what changes from one term to the next.');
    const names=['circle','square','triangle']; const first=pick(r,names), second=pick(r,names.filter(x=>x!==first));
    return mcQuestion(task,index,`The pattern is ${first}, ${second}, ${first}, ${second}, __. What comes next?`,first,names.filter(x=>x!==first),`The two-shape pattern repeats, so ${first} comes next.`,1,'Look for the repeating unit.');
  }
  if (g === 'early-shapes') {
    const shapes=[['triangle','3'],['square','4'],['pentagon','5'],['hexagon','6']], pair=pick(r,shapes);
    if(form%3===2) { const start=int(r,0,shapes.length-1); const chosen=[shapes[start],shapes[(start+1)%shapes.length],shapes[(start+2)%shapes.length]]; return matchingQuestion(task,index,`Match each shape to its number of sides.`,chosen.map(([name,sides])=>({left:name,right:`${sides} sides`})),`A triangle has 3 sides, a square has 4, a pentagon has 5 and a hexagon has 6.`,1,'Count the straight sides of each shape.'); }
    if(form%2===0)return numericQuestion(task,index,`How many sides does a ${pair[0]} have?`,Number(pair[1]),`A ${pair[0]} has ${pair[1]} sides.`,1,'Trace around the outside and count the straight sides.');
    return mcQuestion(task,index,`Which shape has ${pair[1]} sides?`,pair[0],shapes.filter(x=>x[0]!==pair[0]).map(x=>x[0]),`A ${pair[0]} has ${pair[1]} sides.`,1,'Count the sides of each shape.');
  }
  if (g === 'early-measure') {
    const x=int(r,2,20), y=int(r,2,20);
    if(form%3===2) return numberLineQuestion(task,index,`A ribbon is ${x} cm long. Mark ${x} on the ruler (0-20 cm).`,x,0,20,`Count along the ruler to ${x} cm.`,1,'Each mark on the ruler is one centimetre.');
    if(form%2===0)return mcQuestion(task,index,`Ribbon A is ${x} cm long and Ribbon B is ${y} cm long. Which ribbon is longer?`,x===y?'They are the same length':x>y?'Ribbon A':'Ribbon B',['Ribbon A','Ribbon B','They are the same length'].filter(v=>v!==(x===y?'They are the same length':x>y?'Ribbon A':'Ribbon B')),`Compare ${x} cm and ${y} cm.`,1,'The larger measurement is longer.');
    return numericQuestion(task,index,`A path is ${x} m long and another path is ${y} m long. What is their total length?`,x+y,`${x} + ${y} = ${x+y} m.`,Math.min(2,tier),'Add the lengths.');
  }
  if (g === 'early-time') {
    const hour=int(r,1,11), add=pick(r,[1,2,3]), mode=form%4;
    if(task.yearLevel===0){
      if(mode%2===0) return mcQuestion(task,index,`Which usually happens in the morning?`,'eat breakfast',['go to sleep for the night','eat dinner','look at the moon at midnight'],`Breakfast is usually eaten in the morning.`,1,'Think about a normal daily routine.');
      return mcQuestion(task,index,`Which part of the day usually comes after afternoon?`,'evening',['morning','midnight','breakfast'],`Evening follows the afternoon.`,1);
    }
    if(form%9===8 && task.yearLevel>0) { const events=[{value:'Breakfast',frequency:`${hour}:00`},{value:'School starts',frequency:`${hour+1}:00`},{value:'Lunch',frequency:`${hour+add+4}:00`}]; return tableQuestion(task,index,`Use the daily schedule table to find what hour lunch happens.`,events,hour+add+4,`Read the "Lunch" row of the schedule table.`,1,'Find the row labelled Lunch.'); }
    if(mode===0) return numericQuestion(task,index,`It is ${hour}:00 now. What time will it be ${add} hour${add===1?'':'s'} later?`,hour+add>12?hour+add-12:hour+add,`Count forward ${add} hour${add===1?'':'s'}.`,Math.min(2,tier),'Move forward one hour at a time.');
    if(mode===1) return numericQuestion(task,index,`A movie starts at ${hour}:00 and finishes ${add} hours later. What hour does it finish?`,hour+add>12?hour+add-12:hour+add,`Count forward ${add} hours.`,Math.min(2,tier));
    if(mode===2) return numericQuestion(task,index,`How many minutes are in ${add} hour${add===1?'':'s'}?`,add*60,`Each hour has 60 minutes.`,Math.min(2,tier));
    return numericQuestion(task,index,`A calendar event lasts ${add*30} minutes. How many half-hours is that?`,add,`One half-hour is 30 minutes.`,Math.min(2,tier));
  }
  if (g === 'early-money') {
    const coins=task.yearLevel<=1?[5,10,20,50]:[5,10,20,50,100,200], c1=pick(r,coins), c2=pick(r,coins);
    if(form%4===3) { const c3=pick(r,coins); return tableQuestion(task,index,`Use the price table to find the total cost of one of each item.`,[{value:'Pencil',frequency:`${c1}¢`},{value:'Rubber',frequency:`${c2}¢`},{value:'Ruler',frequency:`${c3}¢`}],c1+c2+c3,`Add every price: ${c1}+${c2}+${c3}=${c1+c2+c3} cents.`,Math.min(2,tier),'Add every price in the table.'); }
    if(form%3===0) return numericQuestion(task,index,`You have ${c1}¢ and ${c2}¢. How many cents is that altogether?`,c1+c2,`${c1} + ${c2} = ${c1+c2} cents.`,Math.min(2,tier),'Add the coin values.');
    if(form%3===1){const total=c1+c2;return numericQuestion(task,index,`An item costs ${c1}¢ and another costs ${c2}¢. What is the total cost?`,total,`Add the two prices.`,Math.min(2,tier),'Add the coin values.');}
    const total=Math.max(c1,c2)+50; const spend=Math.min(c1,c2); return numericQuestion(task,index,`You have ${total}¢ and spend ${spend}¢. How many cents remain?`,total-spend,`${total} − ${spend} = ${total-spend}.`,Math.min(2,tier),'Subtract the amount spent.');
  }
  if (g === 'early-data') {
    const red=int(r,1,8), blue=int(r,1,8);
    if(form%3===2) { const green=int(r,1,8); return tableQuestion(task,index,`Use the frequency table to find how many votes were counted altogether.`,[{value:'Red',frequency:red},{value:'Blue',frequency:blue},{value:'Green',frequency:green}],red+blue+green,`Add every frequency: ${red}+${blue}+${green}=${red+blue+green}.`,1,'Add all the frequencies in the table.'); }
    if(form%2===0)return numericQuestion(task,index,`A class graph shows ${red} red votes and ${blue} blue votes. How many votes are shown altogether?`,red+blue,`${red} + ${blue} = ${red+blue}.`,Math.min(2,tier),'Add the two categories.');
    return mcQuestion(task,index,`A tally has ${red} votes for red and ${blue} votes for blue. Which has more votes?`,red===blue?'They are equal':red>blue?'red':'blue',['red','blue','They are equal'].filter(v=>v!==(red===blue?'They are equal':red>blue?'red':'blue')),`Compare ${red} and ${blue}.`,1,'Look for the greater tally.');
  }
  if (g === 'early-chance') {
    const items=[['The sun will rise tomorrow','certain'],['A fair coin will land heads','possible'],['Rolling a 7 on a normal six-sided die','impossible']]; const item=pick(r,items);
    return mcQuestion(task,index,`How would you describe this event: ${item[0]}?`,item[1],['certain','possible','impossible'].filter(v=>v!==item[1]),`${item[0]} is ${item[1]}.`,1,'Think about whether it must happen, might happen, or cannot happen.');
  }

  // Core number/algebra families that previously fell through to the generic fallback.
  // These now generate questions that actually match the named skill, with several
  // mathematical forms per difficulty so assignments are not just number reskins.
  if (g === 'arithmetic') {
    const skill=String(task.skill||'').toLowerCase();
    if (form%13===12 && !/time|duration|order of operations|division|remainder|place value/.test(skill)) { const p=a*10+b, q=c*10+a; return numberLineQuestion(task,index,`Mark the value of ${p} − ${q<p?q:Math.floor(q/2)} on the number line.`,p-(q<p?q:Math.floor(q/2)),0,Math.max(20,p),`${p} − ${q<p?q:Math.floor(q/2)} = ${p-(q<p?q:Math.floor(q/2))}.`,Math.min(2,tier),'Count back along the number line.'); }
    if (/time|duration/.test(skill)) {
      const startH=int(r,7,15), startM=pick(r,[0,10,15,20,30,45]), addM=pick(r,[25,35,45,50,70,85,95]);
      const total=startH*60+startM+addM, outH=Math.floor(total/60)%24, outM=total%60;
      if(form%2===0) return mcQuestion(task,index,`A lesson starts at ${String(startH).padStart(2,'0')}:${String(startM).padStart(2,'0')} and lasts ${addM} minutes. When does it finish?`,`${String(outH).padStart(2,'0')}:${String(outM).padStart(2,'0')}`,[`${String((outH+1)%24).padStart(2,'0')}:${String(outM).padStart(2,'0')}`,`${String(outH).padStart(2,'0')}:${String((outM+10)%60).padStart(2,'0')}`,`${String(startH).padStart(2,'0')}:${String(addM%60).padStart(2,'0')}`],`Convert to minutes, add ${addM}, then convert back to clock time.`,Math.min(3,tier));
      return numericQuestion(task,index,`A bus trip lasts ${a*10+b} minutes and a second trip lasts ${c*10+a} minutes. How many minutes in total?`,a*10+b+c*10+a,`Add the two durations.`,Math.min(2,tier));
    }
    if (/order of operations/.test(skill)) {
      if(form%3===0) return numericQuestion(task,index,`Calculate ${a} + ${b} × ${c}.`,a+b*c,`Multiply first: ${b}×${c}=${b*c}, then add ${a}.`,Math.min(2,tier));
      if(form%3===1) return numericQuestion(task,index,`Calculate (${a} + ${b}) × ${c}.`,(a+b)*c,`Do the brackets first, then multiply.`,Math.min(2,tier));
      return numericQuestion(task,index,`Calculate ${a*b} ÷ ${b} + ${c}².`,a+c*c,`Do division and the power before addition.`,Math.min(3,tier));
    }
    if (/division|remainder/.test(skill)) {
      const divisor=pick(r,[3,4,5,6,8]), quotient=int(r,2,15), rem=int(r,0,divisor-1), dividend=divisor*quotient+rem;
      if(form%2===0) return numericQuestion(task,index,`Divide ${dividend} by ${divisor}. What is the remainder?`,rem,`${dividend} = ${divisor}×${quotient} + ${rem}, so the remainder is ${rem}.`,Math.min(2,tier));
      return numericQuestion(task,index,`${dividend-rem} objects are shared equally into ${divisor} groups. How many are in each group?`,quotient,`${dividend-rem} ÷ ${divisor} = ${quotient}.`,Math.min(2,tier));
    }
    if (/place value/.test(skill)) {
      const n=int(r,1200,98765), pow=pick(r,[10,100,1000]);
      if(form%2===0) return numericQuestion(task,index,`Round ${n} to the nearest ${pow}.`,Math.round(n/pow)*pow,`Look at the digit immediately to the right of the ${pow}s place, then round.`,Math.min(2,tier));
      const digit=Math.floor(n/pow)%10; return numericQuestion(task,index,`In ${n}, what digit is in the ${pow===10?'tens':pow===100?'hundreds':'thousands'} place?`,digit,`Read the digit in the ${pow}s place.`,1);
    }
    if(form%4===0) return numericQuestion(task,index,`Calculate ${a*10+b} + ${c*10+a}.`,a*10+b+c*10+a,`Add ones, then tens, regrouping if needed.`,Math.min(2,tier));
    if(form%4===1) { const hi=a*20+b+40,lo=b*3+c; return numericQuestion(task,index,`Calculate ${hi} − ${lo}.`,hi-lo,`Subtract carefully using place value.`,Math.min(2,tier)); }
    if(form%4===2) return numericQuestion(task,index,`Calculate ${a} × ${b}.`,a*b,`Use multiplication facts or partition one factor.`,Math.min(2,tier));
    const divisor=pick(r,[2,3,4,5,6,8]), q=int(r,3,18); return numericQuestion(task,index,`Calculate ${divisor*q} ÷ ${divisor}.`,q,`Division undoes multiplication: ${divisor*q} ÷ ${divisor} = ${q}.`,Math.min(2,tier));
  }
  if (g === 'decimal') {
    const d1=round(int(r,10,999)/100,2), d2=round(int(r,10,499)/100,2);
    if(form%9===8 && !/place value|tenths|hundredths/.test(String(task.skill||'').toLowerCase())) return numberLineQuestion(task,index,`Mark ${d1.toFixed(2)} on the number line (0 to 10).`,round(d1,2),0,10,`${d1.toFixed(2)} sits between the two nearest whole numbers on the line.`,Math.min(2,tier),'Look at the whole-number part first, then the decimal part.');
    if(/place value|tenths|hundredths/.test(String(task.skill||'').toLowerCase())) {
      const n=round(int(r,101,9999)/100,2); const hundredths=Math.round(n*100)%10;
      if(form%2===0) return numericQuestion(task,index,`What digit is in the hundredths place of ${n.toFixed(2)}?`,hundredths,`The hundredths digit is the second digit after the decimal point.`,1);
      return numericQuestion(task,index,`Round ${n.toFixed(2)} to the nearest tenth.`,round(n,1),`Check the hundredths digit to decide whether the tenths digit rounds up.`,Math.min(2,tier));
    }
    if(form%4===0) return numericQuestion(task,index,`Calculate ${d1} + ${d2}.`,d1+d2,`Line up the decimal points and add.`,Math.min(2,tier));
    if(form%4===1) { const hi=Math.max(d1,d2)+5,lo=Math.min(d1,d2); return numericQuestion(task,index,`Calculate ${hi.toFixed(2)} − ${lo.toFixed(2)}.`,hi-lo,`Line up decimal points and subtract.`,Math.min(2,tier)); }
    if(form%4===2) return numericQuestion(task,index,`Calculate ${d1} × 10.`,d1*10,`Multiplying by 10 moves each digit one place to the left in place value.`,Math.min(2,tier));
    return numericQuestion(task,index,`A bottle holds ${d1} L and another holds ${d2} L. How many litres altogether?`,d1+d2,`Add the two decimal quantities.`,Math.min(3,tier));
  }
  if (g === 'divisibility') {
    const base=int(r,2,15), mult=base*int(r,2,12);
    if(form%5===4) { const primePool=[2,3,5,7,11,13]; const compositePool=[4,6,8,9,10,12]; const p1=pick(r,primePool); const p2=pick(r,compositePool); const p2b=pick(r,compositePool.filter(v=>v!==p2)); return matchingQuestion(task,index,`Match each number to whether it is prime or composite.`,[{left:String(p1),right:'Prime'},{left:String(p2),right:'Composite'},{left:String(p2b),right:'Composite'}],`A prime number has exactly two factors; a composite number has more than two.`,Math.min(2,tier),'Count how many factors each number has.'); }
    if(form%4===0) return mcQuestion(task,index,`Which number is a factor of ${mult}?`,String(base),[String(base+1),String(base+2),String(base+3)],`${mult} ÷ ${base} is a whole number, so ${base} is a factor.`,Math.min(2,tier));
    if(form%4===1) return numericQuestion(task,index,`Find the greatest common factor of ${a*b} and ${a*c}.`,a,`Both numbers share ${a}; compare factors to confirm it is the greatest common factor.`,Math.min(2,tier));
    if(form%4===2) return numericQuestion(task,index,`Find the lowest common multiple of ${a} and ${a*b}.`,a*b,`${a*b} is already a multiple of both ${a} and ${a*b}.`,Math.min(2,tier));
    const candidate=pick(r,[2,3,5,7,11,13]); return mcQuestion(task,index,`Which statement about ${candidate} is true?`,'It is prime',['It is even and greater than 2','It has four positive factors','It is a multiple of 9'],`${candidate} has exactly two positive factors: 1 and ${candidate}.`,Math.min(2,tier));
  }
  if (g === 'integer') {
    const x=int(r,-15,15), y=int(r,-15,15);
    if(form%4===0) return numericQuestion(task,index,`Calculate ${x} + (${y}).`,x+y,`Move ${y>=0?'right':'left'} ${Math.abs(y)} on the number line from ${x}.`,Math.min(2,tier));
    if(form%4===1) return numericQuestion(task,index,`Calculate ${x} − (${y}).`,x-y,`Subtracting ${y} is the same as adding ${-y}.`,Math.min(2,tier));
    if(form%4===2) return mcQuestion(task,index,`Which number is greatest?`,String(Math.max(x,y,0)),[String(Math.min(x,y,0)),String(-Math.abs(x)-1),String(-Math.abs(y)-2)],`On a number line, the greatest number is furthest to the right.`,Math.min(2,tier));
    return numericQuestion(task,index,`The temperature is ${x}°C and changes by ${y}°. What is the new temperature?`,x+y,`New temperature = ${x} + (${y}) = ${x+y}°C.`,Math.min(3,tier));
  }
  if (g === 'inequality') {
    const x=int(r,1,10);
    if(form%9===8) return numberLineQuestion(task,index,`On the number line (0 to 20), enter the smallest whole number that satisfies x > ${x}.`,x+1,0,20,`The smallest whole number greater than ${x} is ${x+1}.`,Math.min(2,tier),'Find the next whole number after the boundary value.');
    if(tier===1) {
      if(form%2===0) return mcQuestion(task,index,`Solve: x + ${a} < ${x+a+1}. Which statement is true?`,`x < ${x+1}`,[`x > ${x+1}`,`x ≤ ${x-1}`,`x ≥ ${x+1}`],`Subtract ${a} from both sides.`,1);
      return mcQuestion(task,index,`Which value satisfies x > ${a}?`,String(a+c),[String(a-1),String(a),String(a-c)],`A solution must be greater than ${a}.`,1);
    }
    if(tier===2) {
      if(form%3===0) return mcQuestion(task,index,`Solve: ${a}x + ${b} ≤ ${a*x+b}.`,`x ≤ ${x}`,[`x ≥ ${x}`,`x < ${x-1}`,`x > ${x+1}`],`Subtract ${b}, then divide by the positive number ${a}; the inequality direction stays the same.`,2);
      if(form%3===1) return mcQuestion(task,index,`Which value is NOT a solution of x ≥ ${x}?`,String(x-1),[String(x),String(x+1),String(x+c)],`Values below ${x} do not satisfy x ≥ ${x}.`,2,'Test each value against the inequality.');
      return numericQuestion(task,index,`The inequality x + ${a} > ${x+a} has boundary value x = __. Enter the boundary value.`,x,`Set x + ${a} = ${x+a} to locate the boundary, giving x = ${x}.`,2,'Use the matching equation to find the boundary.');
    }
    const rhs=a*x-b; return mcQuestion(task,index,`Solve: -${a}x + ${b} > ${-rhs}.`,`x < ${x}`,[`x > ${x}`,`x ≤ ${x-1}`,`x ≥ ${x+1}`],`Rearrange, then remember that dividing by a negative reverses the inequality sign.`,3);
  }
  if (g === 'simultaneous') {
    const x=int(r,1,8), y=int(r,1,8), sum=x+y, diff=x-y;
    if(tier===1 || form%3===0) return numericQuestion(task,index,`Given x + y = ${sum} and x − y = ${diff}, find x.`,x,`Add the equations: 2x = ${sum+diff}, so x = ${x}.`,Math.max(1,Math.min(2,tier)),'Try adding the two equations to eliminate y.');
    if(form%3===1) return numericQuestion(task,index,`Given x + y = ${sum} and 2x + y = ${2*x+y}, find x.`,x,`Subtract the first equation from the second: x = ${x}.`,2,'Subtract one equation from the other.');
    return multiPartQuestion(task,index,`Solve the simultaneous equations x + y = ${sum} and x − y = ${diff}.`,[{id:'x',label:'x',type:'numeric',answer:x,marks:1},{id:'y',label:'y',type:'numeric',answer:y,marks:1}],`Add the equations to find x, then substitute back to find y.`,3,'Eliminate one variable first.');
  }

  if (g === 'linear-equation') {
    const x = int(r, 2, 12), mode=form%3;
    if (form%11===10) { const x2=int(r,2,12), x3=int(r,2,12); const solA=x, solB=x2===x?x2+1:x2, solC=(x3===x||x3===solB)?x3+2:x3; return matchingQuestion(task,index,`Match each equation to its solution.`,[{left:`x + ${a} = ${solA+a}`,right:`x = ${solA}`},{left:`x + ${a} = ${solB+a}`,right:`x = ${solB}`},{left:`x + ${a} = ${solC+a}`,right:`x = ${solC}`}],`Subtract ${a} from both sides of each equation to find x.`,1,'Undo the addition to isolate x.'); }
    if (tier === 1) {
      if(mode===0) return numericQuestion(task,index,`Solve: x + ${a} = ${x+a}`,x,`Subtract ${a} from both sides, so x = ${x}.`,1,'Undo the addition.');
      if(mode===1) return numericQuestion(task,index,`Solve: x − ${a} = ${x-a}`,x,`Add ${a} to both sides, so x = ${x}.`,1,'Undo the subtraction.');
      return numericQuestion(task,index,`Solve: ${a}x = ${a*x}`,x,`Divide both sides by ${a}, so x = ${x}.`,1,'Undo the multiplication.');
    }
    if (tier === 2) {
      if(mode===0) return numericQuestion(task,index,`Solve: ${a}x + ${b} = ${a*x+b}`,x,`Subtract ${b}, then divide by ${a}: x = ${x}.`,2,'Undo the constant before dividing.');
      if(mode===1) return numericQuestion(task,index,`Solve: ${a}x − ${b} = ${a*x-b}`,x,`Add ${b}, then divide by ${a}: x = ${x}.`,2,'Undo the subtraction before dividing.');
      return numericQuestion(task,index,`Solve: (x + ${b}) ÷ ${a} = ${round((x+b)/a,4)}`,x,`Multiply both sides by ${a}, then subtract ${b}.`,2,'Undo the division first.');
    }
    if(mode===0) return numericQuestion(task,index,`Solve: ${a}x + ${b} = ${c}x + ${a*x+b-c*x}`,x,`Move x-terms to one side and constants to the other.`,3,'Collect variable terms on one side first.');
    if(mode===1) return numericQuestion(task,index,`Solve: ${a}(x + ${b}) = ${a*(x+b)}`,x,`Divide by ${a}, then subtract ${b}.`,3,'Undo the outside multiplication before the bracket shift.');
    return numericQuestion(task,index,`Solve: x/${a} + ${b} = ${round(x/a+b,4)}`,x,`Subtract ${b}, then multiply by ${a}.`,3,'Undo the addition, then the division.');
  }
  if (g === 'fraction') {
    const mode=form%5;
    if (tier === 1) { const den = pick(r,[2,3,4,5,8]); const n1=int(r,1,den-1), n2=int(r,1,den-1);
      if(form%7===6) return numberLineQuestion(task,index,`Mark ${n1}/${den} on the number line (0 to 1). Enter its decimal position.`,round(n1/den,4),0,1,`${n1}/${den} is ${round(n1/den,4)} of the way from 0 to 1.`,1,'Divide the line from 0 to 1 into equal parts.');
      if(mode===0) return numericQuestion(task,index,`Calculate ${n1}/${den} + ${n2}/${den}. Give a decimal.`,(n1+n2)/den,`Same denominator: (${n1}+${n2})/${den} = ${n1+n2}/${den}.`,1);
      if(mode===1) return mcQuestion(task,index,`Which fraction is equivalent to ${n1}/${den}?`,`${n1*2}/${den*2}`,[`${n1+1}/${den+1}`,`${n1}/${den*2}`,`${n1*2}/${den}`],`Multiply numerator and denominator by the same number.`,1);
      if(mode===2) return numericQuestion(task,index,`What is ${n1}/${den} of ${den*a}?`,n1*a,`Divide ${den*a} by ${den}, then multiply by ${n1}.`,1);
      if(mode===3) return numericQuestion(task,index,`Write ${n1}/${den} as a decimal.`,n1/den,`Divide ${n1} by ${den}.`,1);
      return mcQuestion(task,index,`Which is larger?`,n1/den > n2/den ? `${n1}/${den}` : n1/den < n2/den ? `${n2}/${den}` : 'They are equal',[n1/den > n2/den ? `${n2}/${den}` : `${n1}/${den}`,'They are equal','Cannot tell'].filter((v,i,a)=>v!==(n1/den > n2/den ? `${n1}/${den}` : n1/den < n2/den ? `${n2}/${den}` : 'They are equal')&&a.indexOf(v)===i),`With the same denominator, compare numerators.`,1);
    }
    if (tier === 2) { const d1=pick(r,[3,4,5,6]), d2=pick(r,[4,5,6,8]); const n1=int(r,1,d1-1),n2=int(r,1,d2-1);
      if(mode===0) return numericQuestion(task,index,`Calculate ${n1}/${d1} + ${n2}/${d2}. Give a decimal.`,n1/d1+n2/d2,`Use a common denominator, then add.`,2);
      if(mode===1) return numericQuestion(task,index,`Calculate ${n1}/${d1} − ${n2}/${d2}. Give a decimal.`,n1/d1-n2/d2,`Use a common denominator, then subtract.`,2);
      if(mode===2) return numericQuestion(task,index,`Calculate ${n1}/${d1} × ${n2}/${d2}. Give a decimal.`,n1*n2/(d1*d2),`Multiply numerators and denominators.`,2);
      if(mode===3) return numericQuestion(task,index,`A jug is ${n1}/${d1} full. Another ${n2}/${d2} of the jug is added. How full is it as a decimal?`,n1/d1+n2/d2,`Add the two fractional amounts.`,2);
      return mcQuestion(task,index,`Which fraction is closest to 1?`,`${d1-1}/${d1}`,[`1/${d1}`,`${Math.max(1,d1-2)}/${d1}`,`1/${d2}`],`A fraction is close to 1 when its numerator is close to its denominator.`,2);
    }
    const d1=pick(r,[3,4,5,6]),d2=pick(r,[5,7,8,9]); const n1=int(r,1,d1-1),n2=int(r,1,d2-1);
    if(mode%2===0) return numericQuestion(task,index,`A recipe uses ${n1}/${d1} cup of oats per batch. You make ${a} batches and then use another ${n2}/${d2} cup. How many cups in total?`,a*n1/d1+n2/d2,`Compute ${a}×${n1}/${d1} + ${n2}/${d2}.`,3,'Translate the context into a fraction calculation.');
    return numericQuestion(task,index,`${a} metres of ribbon is shared equally among ${d1} people, then each person uses ${n1}/${d2} m. How much ribbon does each person have left?`,a/d1-n1/d2,`Start with ${a}/${d1} m each, then subtract ${n1}/${d2} m.`,3,'Work out each person’s share before subtracting what is used.');
  }
  if (['percentage','percentage-change','fraction-percent'].includes(g)) {
    const value=int(r,20,240), pct=pick(r,tier===1?[10,20,25,50]:[12,15,18,35,45]), mode=form%4;
    if (form%9===8) { const p2=pct>=50?pct-25:pct+15; return tableQuestion(task,index,`Use the table to find the value of ${p2}% of ${value}.`,[{value:`${pct}% of ${value}`,frequency:round(value*pct/100,2)},{value:'100% of '+value,frequency:value},{value:`${p2}% of ${value}`,frequency:'?'}],round(value*p2/100,2),`${p2}% of ${value} = ${p2}/100 × ${value}.`,Math.min(2,tier),'Use the 100% row to help scale down to the missing percentage.'); }
    if (tier === 1) {
      if(mode===0) return numericQuestion(task,index,`Find ${pct}% of ${value}.`,value*pct/100,`${pct}% of ${value} = ${pct/100} × ${value}.`,1);
      if(mode===1) return numericQuestion(task,index,`${pct}% of a number is ${round(value*pct/100,2)}. What is the number?`,value,`Divide by ${pct/100}.`,1);
      if(mode===2) return numericQuestion(task,index,`Write ${pct}% as a decimal.`,pct/100,`Divide the percentage by 100.`,1);
      return numericQuestion(task,index,`What percentage of ${value} is ${round(value*pct/100,2)}?`,pct,`part ÷ whole × 100 = ${pct}%.`,1);
    }
    if (tier === 2) {
      if(mode%2===0) return numericQuestion(task,index,`Increase ${value} by ${pct}%.`,value*(1+pct/100),`Multiply by ${1+pct/100}.`,2);
      return numericQuestion(task,index,`Decrease ${value} by ${pct}%.`,value*(1-pct/100),`Multiply by ${1-pct/100}.`,2);
    }
    if(mode===0){ const fee=pick(r,[5,10]); const after=round(value*(1-pct/100),2); const final=round(after*(1+fee/100),2); return numericQuestion(task,index,`A price of $${value} is reduced by ${pct}% and then a ${fee}% fee is added. Find the final price.`,final,`Discount first, then apply the fee to the discounted amount.`,3); }
    if(mode===1){ const rate=pick(r,[5,8,12]); return numericQuestion(task,index,`A population of ${value*10} grows by ${rate}% each year for 2 years. Find the new population.`,round(value*10*(1+rate/100)**2,2),`Use compound growth twice.`,3); }
    if(mode===2){ const sale=round(value*(1-pct/100),2); return numericQuestion(task,index,`After a ${pct}% discount, an item costs $${sale}. Find the original price.`,value,`The sale price is ${100-pct}% of the original, so divide by ${(100-pct)/100}.`,3); }
    const gain=round(value*(1+pct/100),2); return numericQuestion(task,index,`A value rises from ${value} to ${gain}. What is the percentage increase?`,pct,`Increase ÷ original × 100.`,3);
  }
  if (['ratio','ratio-rate','rate'].includes(g)) {
    const mode=form%4;
    if (form%9===8) { const missing=b*3; return tableQuestion(task,index,`The ratio of cups of flour to cups of sugar is always ${a}:${b}. Use the table to find the missing value of sugar when flour is ${a*3}.`,[{value:`Flour ${a}`,frequency:`Sugar ${b}`},{value:`Flour ${a*2}`,frequency:`Sugar ${b*2}`},{value:`Flour ${a*3}`,frequency:'Sugar ?'}],missing,`Scale the ratio ${a}:${b} by 3 to get ${a*3}:${missing}.`,Math.min(2,tier),'Multiply both parts of the ratio by the same scale factor.'); }
    if (tier === 1) {
      if(mode%2===0) return numericQuestion(task,index,`The ratio of red to blue counters is ${a}:${b}. If there are ${a*3} red counters, how many blue counters are there?`,b*3,`Scale both parts by 3.`,1);
      return numericQuestion(task,index,`A recipe uses ${a} cups of flour for ${b} batches. How many cups are needed for ${b*2} batches?`,a*2,`Doubling the batches doubles the flour.`,1);
    }
    if (tier === 2) {
      if(mode%2===0) return numericQuestion(task,index,`A car travels ${a*30} km in ${a} hours. What is its average speed in km/h?`,30,`Distance ÷ time = speed.`,2);
      return numericQuestion(task,index,`${a} notebooks cost $${a*b}. What is the cost per notebook?`,b,`Total cost ÷ number of notebooks.`,2);
    }
    if(mode===0) return numericQuestion(task,index,`A map scale is 1:${a*10000}. Two points are ${b}.${c} cm apart on the map. Find the real distance in km.`,(Number(`${b}.${c}`)*a*10000)/100000,`Apply the scale, then convert centimetres to kilometres.`,3);
    if(mode===1) return numericQuestion(task,index,`A drink is mixed in the ratio ${a}:${b} (juice:water). If there are ${a+b} total parts making ${c*(a+b)} mL, how many mL are juice?`,c*a,`One part is ${c} mL, so juice is ${a} parts.`,3);
    if(mode===2) return numericQuestion(task,index,`A machine produces ${a*b} items in ${a} hours. At the same rate, how many items in ${c} hours?`,b*c,`Find the hourly rate, then multiply by ${c}.`,3);
    return numericQuestion(task,index,`A scale drawing uses 1 cm for ${a} m. A wall measures ${b}.${c} cm on the drawing. Find the real length in metres.`,Number(`${b}.${c}`)*a,`Multiply the drawing length by ${a} m per cm.`,3);
  }
  if (['finance-simple','finance-growth','finance-annuity'].includes(g)) {
    const p=int(r,200,2000), rate=pick(r,[3,4,5,6,8]), mode=form%5, year=Number(task.yearLevel||0);
    // Primary-school money questions stay about prices, change, totals and unit costs.
    if(year<=6){
      const dollars=int(r,5,80), cents=pick(r,[0,25,50,75]), price=round(dollars+cents/100,2), qty=int(r,2,6);
      if(mode===0) return numericQuestion(task,index,`An item costs $${price.toFixed(2)}. You pay with $${Math.ceil(price/10)*10}. How much change do you get?`,round(Math.ceil(price/10)*10-price,2),`Change = amount paid − cost.`,Math.min(2,tier));
      if(mode===1) return numericQuestion(task,index,`${qty} identical items cost $${round(price*qty,2).toFixed(2)} altogether. What is the cost of one item?`,price,`Divide the total cost by ${qty}.`,Math.min(2,tier));
      if(mode===2) return numericQuestion(task,index,`You buy ${qty} items at $${price.toFixed(2)} each. What is the total cost?`,round(price*qty,2),`Multiply the price by ${qty}.`,Math.min(2,tier));
      if(mode===3) { const discount=pick(r,[10,20,25,50]); return numericQuestion(task,index,`A $${dollars} item is ${discount}% off. How many dollars is the discount?`,dollars*discount/100,`Find ${discount}% of $${dollars}.`,Math.min(3,tier)); }
      return mcQuestion(task,index,`Which is the better value?`,`$${(price*2).toFixed(2)} for 2`,[`$${(price*3+1).toFixed(2)} for 3`,`$${(price+2).toFixed(2)} for 1`,`They cost exactly the same per item`],`Compare the cost per item.`,Math.min(3,tier));
    }
    if (tier === 1) {
      if(mode%2===0) return numericQuestion(task,index,`Find ${rate}% simple interest on $${p} for 1 year.`,p*rate/100,`Interest = principal × rate × time.`,1);
      return numericQuestion(task,index,`A $${p} purchase has a ${rate}% discount. Find the discount amount.`,p*rate/100,`Discount = ${rate}% of $${p}.`,1);
    }
    if (tier === 2) {
      if(mode===0) return numericQuestion(task,index,`$${p} grows by ${rate}% per year for 2 years. Find the balance.`,round(p*(1+rate/100)**2,2),`Use compound growth for two years.`,2);
      if(mode===1) return numericQuestion(task,index,`Find the simple interest on $${p} at ${rate}% p.a. for ${c} years.`,p*rate/100*c,`I = Prt.`,2);
      if(mode===2) return numericQuestion(task,index,`A $${p} loan has a one-off fee of ${rate}% of the principal. Find principal plus fee.`,p*(1+rate/100),`Add ${rate}% of the principal to the principal.`,2);
      if(mode===3) return numericQuestion(task,index,`An account grows from $${p} to $${round(p*(1+rate/100),2)} in one year. What was the percentage growth?`,rate,`Increase ÷ original × 100.`,2);
      return numericQuestion(task,index,`A $${p} item is discounted by ${rate}% then a $${a*5} delivery fee is added. Find the final cost.`,round(p*(1-rate/100)+a*5,2),`Apply the discount first, then add delivery.`,2);
    }
    if(g==='finance-annuity' && mode%2===0) return numericQuestion(task,index,`A savings plan deposits $${a*50} at the end of each year for 3 years. Ignoring interest, how much is deposited in total?`,a*150,`Three equal deposits total 3 × $${a*50}.`,3);
    if(mode%2===0) return numericQuestion(task,index,`An investment of $${p} grows at ${rate}% p.a. for 3 years, then a $${a*10} fee is deducted. Find the final balance.`,round(p*(1+rate/100)**3-a*10,2),`Compound for 3 years, then subtract the fee.`,3);
    return numericQuestion(task,index,`An investment of $${p} loses ${rate}% in year 1, then gains ${rate+2}% in year 2. Find the final value.`,round(p*(1-rate/100)*(1+(rate+2)/100),2),`Apply each percentage multiplier in order.`,3);
  }
  if (['simplify','algebra-basics'].includes(g)) {
    const mode=form%4;
    if (tier === 1) {
      if(mode===0) return mcQuestion(task,index,`Simplify: ${a}x + ${b}x`,`${a+b}x`,[`${a*b}x`,`${a+b}x²`,`${a-b}x`],`Add the coefficients.`,1);
      if(mode===1) return numericQuestion(task,index,`In ${a}x + ${b}, what is the coefficient of x?`,a,`The coefficient is the number multiplying x.`,1);
      if(mode===2) return mcQuestion(task,index,`Which pair are like terms?`,`${a}x and ${b}x`,[`${a}x and ${b}`,`${a}x and ${b}y`,`x and x²`],`Like terms have the same variable part.`,1);
      return mcQuestion(task,index,`Simplify: ${a} + ${b} + x`,`${a+b} + x`,[`${a*b}x`,`${a+b}x`,`${a+b+1}`],`Combine only the constant terms.`,1);
    }
    if (tier === 2) {
      if(mode===0) return mcQuestion(task,index,`Simplify: ${a}x + ${b} - ${c}x + ${a}`,`${a-c}x + ${b+a}`,[`${a+c}x + ${b+a}`,`${a-c}x + ${b-a}`,`${a-c+b+a}x`],`Collect x-terms and constants separately.`,2);
      if(mode===1) return mcQuestion(task,index,`Simplify: ${a}x + ${b}y + ${c}x - ${a}y`,`${a+c}x + ${b-a}y`,[`${a+c+b-a}xy`,`${a-c}x + ${b+a}y`,`${a+c}x + ${b+a}y`],`Collect x-terms and y-terms separately.`,2);
      if(mode===2) return numericQuestion(task,index,`After simplifying ${a}x + ${b} + ${c}x - ${a}, what is the coefficient of x?`,a+c,`The x coefficients add: ${a}+${c}.`,2);
      return mcQuestion(task,index,`Which expression is equivalent to ${a}(x + ${b})?`,`${a}x + ${a*b}`,[`${a}x + ${b}`,`${a+b}x`,`${a*b}x`],`Distribute ${a} to both terms.`,2);
    }
    return mcQuestion(task,index,`Simplify fully: ${a}(x + ${b}) - ${c}(x - ${a})`,`${a-c}x + ${a*b+c*a}`,[`${a+c}x + ${a*b-c*a}`,`${a-c}x + ${a*b-c*a}`,`${a+c}x + ${a*b+c*a}`],`Expand both brackets carefully, then collect like terms.`,3);
  }
  if (g === 'expand') {
    const mode=form%4;
    if (tier === 1) {
      if(mode===0) return mcQuestion(task,index,`Expand: ${a}(x + ${b})`,`${a}x + ${a*b}`,[`${a}x + ${b}`,`${a+b}x`,`${a*b}x`],`Multiply ${a} by both terms.`,1);
      if(mode===1) return numericQuestion(task,index,`When ${a}(x + ${b}) is expanded, what is the constant term?`,a*b,`The constant comes from ${a} × ${b} = ${a*b}.`,1,'Multiply the number outside the bracket by the constant inside.');
      if(mode===2) return mcQuestion(task,index,`A rectangle has width ${a} and length (x + ${b}). Which expression gives its area?`,`${a}x + ${a*b}`,[`${a+b}x`,`${a}x + ${b}`,`${a*b}x`],`Area = width × length, so multiply ${a} by both terms.`,1);
      return mcQuestion(task,index,`Which expression is equivalent to ${a}(x - ${b})?`,`${a}x - ${a*b}`,[`${a}x - ${b}`,`${a-b}x`,`${a*b}x`],`Distribute ${a} to x and to -${b}.`,1);
    }
    if (mode === 0) return mcQuestion(task,index,`Expand and simplify: ${a}(x + ${b}) + ${c}x`,`${a+c}x + ${a*b}`,[`${a+c}x + ${b}`,`${a*c}x + ${a*b}`,`${a-c}x + ${a*b}`],`Expand first, then collect x-terms.`,2);
    if (mode === 1) return mcQuestion(task,index,`Expand and simplify: ${a}(${b}x - ${c}) - ${b}x`,`${a*b-b}x - ${a*c}`,[`${a*b+b}x - ${a*c}`,`${a*b-b}x - ${c}`,`${a*b}x - ${a*c-b}`],`Expand the bracket, then combine the x-terms.`,Math.min(3,tier));
    if (mode === 2) return mcQuestion(task,index,`A rectangle has width ${a} and length (x + ${b}). Which expression gives its area?`,`${a}x + ${a*b}`,[`${a+b}x`,`${a}x + ${b}`,`${a*b}x`],`Area = width × length, so multiply ${a} by both terms.`,Math.min(3,tier));
    return mcQuestion(task,index,`Which expression expands to ${a*b}x + ${a*c}?`,`${a}(${b}x + ${c})`,[`${b}(${a}x + ${c})`,`${a}(${b}x + ${a*c})`,`${a*b}(x + ${c})`],`Check each option by distributing the outside factor.`,Math.min(3,tier));
  }
  if (g === 'factor-common') {
    const mode=form%4;
    if (tier === 1) return mcQuestion(task,index,`Factorise: ${a}x + ${a*b}`,`${a}(x + ${b})`,[`${a}(x + ${a*b})`,`${b}(x + ${a})`,`x(${a+b})`],`Take out the common factor ${a}.`,1);
    if (mode === 0) return mcQuestion(task,index,`Factorise fully: ${a*b}x + ${a*c}`,`${a}(${b}x + ${c})`,[`${b}(${a}x + ${c})`,`${a*b}(x + ${c})`,`${a}(${b+c}x)`],`The greatest common factor is ${a}.`,2);
    if (mode === 1) return mcQuestion(task,index,`Which factorised form is equivalent to ${a*c}x - ${a*b}?`,`${a}(${c}x - ${b})`,[`${a}(${c}x + ${b})`,`${c}(${a}x - ${b})`,`${a*c}(x - ${b})`],`Factor out ${a} from both terms.`,Math.min(3,tier));
    if (mode === 2) return numericQuestion(task,index,`What is the greatest common numerical factor of ${a*b}x and ${a*c}?`,a,`Both terms share the factor ${a}.`,2,'Find the largest number that divides both coefficients.');
    return mcQuestion(task,index,`Which expression has ${a} as a common factor?`,`${a*b}x + ${a*c}`,[`${a*b+1}x + ${a*c}`,`${b}x + ${c}`,`${a*b}x + ${c+1}`],`Both coefficients must be divisible by ${a}.`,2);
  }
  if (g === 'quadratic-expand') {
    const p=int(r,1,8), q=int(r,1,8), lead=tier>=3?int(r,2,5):1, mode=form%5;
    if (tier === 1) {
      if(mode===0) return mcQuestion(task,index,`Expand: (x + ${p})(x + ${q})`,`x² + ${p+q}x + ${p*q}`,[`x² + ${p*q}x + ${p+q}`,`x² + ${p+q}x + ${p+q}`,`x² + ${p*q}`],`Multiply each term, then collect the two x-terms.`,1);
      if(mode===1) return numericQuestion(task,index,`In the expansion of (x + ${p})(x + ${q}), what is the coefficient of x?`,p+q,`The middle terms are ${q}x and ${p}x, so their coefficients add.`,1,'Focus only on the two middle terms.');
      if(mode===2) return mcQuestion(task,index,`Expand: (x + ${p})²`,`x² + ${2*p}x + ${p*p}`,[`x² + ${p}x + ${p*p}`,`x² + ${p*p}x + ${2*p}`,`x² + ${p*p}`],`Treat the square as (x + ${p})(x + ${p}) and expand.`,1);
      if(mode===3) return mcQuestion(task,index,`A rectangle has side lengths (x + ${p}) and (x + ${q}). Which quadratic represents its area?`,`x² + ${p+q}x + ${p*q}`,[`x² + ${p*q}x + ${p+q}`,`2x + ${p+q}`,`x² + ${p+q+p*q}`],`Area is the product of the side lengths.`,1);
      return mcQuestion(task,index,`Which product expands to x² + ${p+q}x + ${p*q}?`,`(x + ${p})(x + ${q})`,[`(x - ${p})(x - ${q})`,`(x + ${p+q})(x + 1)`,`(x + ${p*q})(x + 1)`],`Look for two numbers that add to ${p+q} and multiply to ${p*q}.`,1);
    }
    if (tier === 2) {
      if(mode===0) return mcQuestion(task,index,`Expand and simplify: (x + ${p})(x + ${q}) + ${c}x`,`x² + ${p+q+c}x + ${p*q}`,[`x² + ${p+q}x + ${p*q+c}`,`x² + ${p+q+c}x + ${p+q}`,`${p+q+c}x + ${p*q}`],`Expand the two brackets first, then add ${c}x to the middle term.`,2);
      if(mode===1) return mcQuestion(task,index,`Expand: (2x + ${p})(x + ${q})`,`2x² + ${2*q+p}x + ${p*q}`,[`2x² + ${p+q}x + ${p*q}`,`2x² + ${2*q+p}x + ${p+q}`,`3x² + ${2*q+p}x + ${p*q}`],`Use four products, then collect the x-terms.`,2);
      if(mode===2) return mcQuestion(task,index,`Expand: (x + ${p})(x - ${q})`,`x² + ${p-q}x - ${p*q}`,[`x² + ${p+q}x - ${p*q}`,`x² - ${p-q}x + ${p*q}`,`x² + ${p-q}x + ${p*q}`],`Pay attention to the negative terms when multiplying.`,2);
      if(mode===3) return numericQuestion(task,index,`The area of a rectangle is (x + ${p})(x + ${q}). What is the constant term after expansion?`,p*q,`The constant term is ${p} × ${q}.`,2,'Find the product of the two constants.');
      return mcQuestion(task,index,`Which quadratic is equivalent to (x + ${p})² - ${c}x?`,`x² + ${2*p-c}x + ${p*p}`,[`x² + ${2*p}x + ${p*p-c}`,`x² + ${2*p+c}x + ${p*p}`,`x² + ${p-c}x + ${p*p}`],`Expand the square, then combine the x-terms.`,2);
    }
    if(mode===0) return mcQuestion(task,index,`Expand: (${lead}x + ${p})(x + ${q})`,`${lead}x² + ${lead*q+p}x + ${p*q}`,[`${lead}x² + ${p+q}x + ${p*q}`,`${lead}x² + ${lead*q+p}x + ${p+q}`,`${lead+1}x² + ${lead*q+p}x + ${p*q}`],`Use four products, then collect the two x-terms.`,3);
    if(mode===1) return mcQuestion(task,index,`Expand and simplify: (${lead}x + ${p})(x - ${q}) + ${c}x`,`${lead}x² + ${p-lead*q+c}x - ${p*q}`,[`${lead}x² + ${p+lead*q+c}x - ${p*q}`,`${lead}x² + ${p-lead*q}x - ${p*q+c}`,`${lead+1}x² + ${p-lead*q+c}x - ${p*q}`],`Expand carefully, then combine all x-terms.`,3);
    if(mode===2) return mcQuestion(task,index,`Expand: (${lead}x - ${p})(x - ${q})`,`${lead}x² - ${lead*q+p}x + ${p*q}`,[`${lead}x² - ${p+q}x + ${p*q}`,`${lead}x² + ${lead*q+p}x + ${p*q}`,`${lead}x² - ${lead*q+p}x - ${p*q}`],`Both constant products are negative×negative, so the constant term is positive.`,3);
    if(mode===3) return writtenQuestion(task,index,`Explain how you would expand (${lead}x + ${p})(x + ${q}) and combine like terms.`,`${lead}x² + ${lead*q}x + ${p}x + ${p*q} = ${lead}x² + ${lead*q+p}x + ${p*q}.`,3,'Name the four products before combining the two x-terms.');
    return mcQuestion(task,index,`A rectangle has sides (${lead}x + ${p}) and (x + ${q}). Which expression gives its area?`,`${lead}x² + ${lead*q+p}x + ${p*q}`,[`${lead}x² + ${p+q}x + ${p*q}`,`${lead+1}x² + ${lead*q+p}x + ${p*q}`,`${lead}x² + ${lead*q+p+p*q}x`],`Multiply the side lengths using four products.`,3);
  }
  if (g === 'quadratic-factor') {
    const r1=int(r,1,8),r2=int(r,1,8),sum=r1+r2,prod=r1*r2;
    if (tier === 1 || form % 3 === 0) return mcQuestion(task,index,`Factorise: x² + ${sum}x + ${prod}`,`(x + ${r1})(x + ${r2})`,[`(x + ${sum})(x + ${prod})`,`(x - ${r1})(x - ${r2})`,`(x + ${r1+r2})(x + 1)`],`Find two numbers that multiply to ${prod} and add to ${sum}.`,Math.max(1,tier));
    if (form % 3 === 1) return mcQuestion(task,index,`Factorise: x² - ${sum}x + ${prod}`,`(x - ${r1})(x - ${r2})`,[`(x + ${r1})(x + ${r2})`,`(x - ${sum})(x - ${prod})`,`(x - ${r1+r2})(x - 1)`],`The two numbers multiply to ${prod} and add to -${sum}.`,2);
    return mcQuestion(task,index,`Which quadratic factorises to (x + ${r1})(x - ${r2})?`,`x² + ${r1-r2}x - ${prod}`,[`x² + ${sum}x - ${prod}`,`x² - ${r1-r2}x + ${prod}`,`x² + ${r1-r2}x + ${prod}`],`Expand the factors and collect the middle terms.`,3);
  }
  if (g === 'quadratic-solve') {
    const root1=int(r,1,9),root2=int(r,1,9),sum=root1+root2,prod=root1*root2;
    if (tier === 1) return numericQuestion(task,index,`Solve x² = ${root1*root1}. Enter the positive solution.`,root1,`Take the positive square root: x = ${root1}.`,1);
    if (form % 2 === 0) return mcQuestion(task,index,`Solve x² - ${sum}x + ${prod} = 0. Which pair gives the solutions?`,`x = ${root1} or x = ${root2}`,[`x = ${sum} or x = ${prod}`,`x = -${root1} or x = -${root2}`,`x = ${root1+1} or x = ${root2+1}`],`Factorise to (x-${root1})(x-${root2})=0.`,2);
    return mcQuestion(task,index,`Which equation has solutions x = ${root1} and x = ${root2}?`,`x² - ${sum}x + ${prod} = 0`,[`x² + ${sum}x + ${prod} = 0`,`x² - ${prod}x + ${sum} = 0`,`x² + ${prod}x - ${sum} = 0`],`Use (x-${root1})(x-${root2}) = 0 and expand.`,3);
  }
  if (g === 'polynomial') {
    if (tier === 1) return mcQuestion(task,index,`Simplify: ${a}x² + ${b}x²`,`${a+b}x²`,[`${a+b}x⁴`,`${a*b}x²`,`${a-b}x²`],`Add the coefficients of like x² terms.`,1);
    if (form % 2 === 0) return mcQuestion(task,index,`Simplify: (${a}x² + ${b}x + ${c}) + (${b}x² - ${c}x + ${a})`,`${a+b}x² + ${b-c}x + ${a+c}`,[`${a+b}x² + ${b+c}x + ${a+c}`,`${a*b}x² + ${b-c}x + ${a+c}`,`${a+b}x⁴ + ${b-c}x + ${a+c}`],`Collect x² terms, x terms and constants separately.`,2);
    return mcQuestion(task,index,`Expand: x(x² + ${a}x + ${b})`,`x³ + ${a}x² + ${b}x`,[`x³ + ${a}x + ${b}`,`x² + ${a}x² + ${b}x`,`x³ + ${a+b}x²`],`Multiply every term inside the bracket by x.`,Math.min(3,tier));
  }
  if (g === 'algebra-fraction') {
    const mode=form%4;
    if (tier === 1) return mcQuestion(task,index,`Simplify ${a*b}x / ${a}.`,`${b}x`,[`${a*b}x`,`${a}x`,`${b}`],`Divide the coefficient ${a*b} by ${a}.`,1);
    if (mode === 0) return mcQuestion(task,index,`Simplify (${a}x + ${a*b}) / ${a}.`,`x + ${b}`,[`${a}x + ${b}`,`x + ${a*b}`,`${b}x + 1`],`Divide every term in the numerator by ${a}.`,2);
    if (mode === 1) return mcQuestion(task,index,`For x = ${c}, evaluate ( ${a}x + ${b} ) / ${c}.`,String((a*c+b)/c),[String(a*c+b),String((a+b)/c),String(a+b*c)],`Substitute x=${c}, then simplify the numerator before dividing.`,Math.min(3,tier));
    if (mode === 2) return mcQuestion(task,index,`Which expression is equivalent to ${a}(x + ${b}) / ${a}?`,`x + ${b}`,[`${a}x + ${b}`,`x + ${a*b}`,`${b}x`],`Cancel the common factor ${a}.`,2);
    return numericQuestion(task,index,`If (${a}x + ${a*b})/${a} = x + k, find k.`,b,`Divide both terms by ${a}; the constant becomes ${a*b}÷${a}=${b}.`,2,'Simplify the fraction term-by-term.');
  }
  if (['indices','indices-advanced','scientific-notation','surds','real-number'].includes(g)) {
    if(g==='scientific-notation') {
      const mant=round(int(r,12,98)/10,1), exp=int(r,2,7), value=mant*(10**exp);
      if(form%3===0) return mcQuestion(task,index,`Write ${value} in scientific notation.`,`${mant} × 10^${exp}`,[`${mant*10} × 10^${exp-1}`,`${mant} × 10^${exp-1}`,`${round(mant/10,2)} × 10^${exp}`],`Move the decimal so the first number is between 1 and 10; count ${exp} places.`,Math.min(3,tier));
      if(form%3===1) return numericQuestion(task,index,`Write ${mant} × 10^${exp} as an ordinary number.`,value,`Move the decimal ${exp} places to the right.`,Math.min(2,tier));
      const e2=Math.max(1,exp-1); return mcQuestion(task,index,`Which is larger?`,`${mant} × 10^${exp}`,[`${mant} × 10^${e2}`,`${round(mant/10,1)} × 10^${exp}`,`${mant} × 10^0`],`Compare powers of 10 first.`,Math.min(2,tier));
    }
    if(g==='surds') {
      const inside=a*a*b, mode=form%4;
      if(tier===1) return numericQuestion(task,index,`Evaluate √${a*a}.`,a,`√${a*a} = ${a}.`,1);
      if(mode===0) return mcQuestion(task,index,`Simplify √${inside}.`,`${a}√${b}`,[`√${a*a+b}`,`${a*b}√${b}`,`${a}√${a*b}`],`Factor ${inside} as ${a*a}×${b}, then take √${a*a} outside.`,Math.min(3,tier));
      if(mode===1) return mcQuestion(task,index,`Simplify ${a}√${b} + ${c}√${b}.`,`${a+c}√${b}`,[`${a+c}√${b*2}`,`${a*c}√${b}`,`${a+c+b}`],`Like surds can be combined by adding their coefficients.`,Math.min(3,tier));
      if(mode===2) return numericQuestion(task,index,`What is the coefficient of √${b} when √${inside} is simplified?`,a,`√${inside} = ${a}√${b}, so the coefficient is ${a}.`,Math.min(3,tier),'Factor out the largest square number.');
      return numericQuestion(task,index,`Find the exact value of (${a}√${b})².`,a*a*b,`Square the coefficient and the surd: ${a}² × ${b} = ${a*a*b}.`,Math.min(3,tier),'Use (a√b)² = a²b.');
    }
    if(g==='real-number') {
      const mode=form%5;
      if(mode===0) return mcQuestion(task,index,`Which number is irrational?`,'√2',[String(a),`${b}/${c}`,String(round(a/b,2))],`√2 cannot be written exactly as a fraction of integers.`,Math.min(2,tier));
      if(mode===1) return mcQuestion(task,index,`Which set definitely contains ${-a}?`,'Integers',['Natural numbers only','Irrational numbers only','Positive numbers only'],`${-a} is a negative integer.`,Math.min(2,tier));
      if(mode===2) return mcQuestion(task,index,`Which number is rational?`,`${b}/${c}`,['√2','π','√3'],`A ratio of integers is rational.`,Math.min(2,tier));
      if(mode===3) return mcQuestion(task,index,`Which statement is true?`,'Every integer is rational',['Every rational number is an integer','Every irrational number is negative','π is rational'],`Any integer n can be written as n/1, so it is rational.`,Math.min(2,tier));
      return mcQuestion(task,index,`Classify √${a*a}.`,'Natural number',['Irrational number only','Negative integer','Not a real number'],`√${a*a}=${a}, which is a natural number.`,Math.min(2,tier));
    }
    if (tier === 1) return numericQuestion(task,index,`Evaluate ${a}².`,a*a,`${a}² = ${a*a}.`,1);
    if (tier === 2) {
      const mode=form%5;
      if(mode===0) return numericQuestion(task,index,`Simplify the power: 2^${a} × 2^${b}. Enter the resulting exponent.`,a+b,`Same base: add exponents.`,2);
      if(mode===1) return numericQuestion(task,index,`Simplify the power: 5^${a+b} ÷ 5^${b}. Enter the resulting exponent.`,a,`Same base: subtract exponents.`,2);
      if(mode===2) return numericQuestion(task,index,`For (3^${a})^${b}, enter the exponent in the simplified power of 3.`,a*b,`A power of a power multiplies exponents: ${a}×${b}=${a*b}.`,2);
      if(mode===3) return numericQuestion(task,index,`Write 7^${a} × 7^${b} as 7^n. What is n?`,a+b,`Same base: n=${a}+${b}.`,2);
      return mcQuestion(task,index,`Which expression equals 4^${a+b}?`,`4^${a} × 4^${b}`,[`4^${a} + 4^${b}`,`4^${a*b}`,`8^${a+b}`],`Multiplying powers with the same base adds exponents.`,2);
    }
    return mcQuestion(task,index,`Simplify (x^${a})^${b}.`,`x^${a*b}`,[`x^${a+b}`,`x^${a-b}`,`x^${a**2}`],`Power of a power: multiply the exponents.`,3);
  }
  if (['linear-graph','linear-rule','gradient','coordinates','coordinate-geometry','function-eval','quadratic-graph','exponential','logarithm','trig-function'].includes(g)) {
    if(g==='coordinates' || g==='coordinate-geometry') {
      if(form%4===0) return coordinateQuestion(task,index,`Give the midpoint of (${a}, ${b}) and (${a+2*c}, ${b+2*c}).`,a+c,b+c,`Average the x-coordinates and the y-coordinates.`,Math.min(3,tier),'Average each coordinate separately.');
      if(form%4===1) return numericQuestion(task,index,`Find the horizontal distance between (${a}, ${b}) and (${a+c}, ${b}).`,c,`Subtract the x-coordinates: ${a+c} − ${a} = ${c}.`,Math.min(2,tier));
      if(form%4===2) return graphPointQuestion(task,index,`Plot the point (${c}, ${a-c}).`,c,a-c,`Move ${c} along the x-axis and ${a-c} on the y-axis.`,Math.min(2,tier));
      return coordinateQuestion(task,index,`Start at (${a}, ${b}) and translate ${c} right and ${c+1} up. Give the new point.`,a+c,b+c+1,`Add ${c} to x and ${c+1} to y.`,Math.min(3,tier));
    }
    if(g==='linear-graph' || g==='linear-rule' || g==='gradient') {
      if(form%4===0) return graphPointQuestion(task,index,`Plot the point on y = ${a}x + ${b} when x = ${c}.`,c,a*c+b,`Substitute x=${c}, then plot the ordered pair.`,Math.min(3,tier));
      if(form%4===1) return coordinateQuestion(task,index,`For y = ${a}x + ${b}, give the point when x = ${c}.`,c,a*c+b,`Substitute x=${c}.`,Math.min(3,tier));
      if(form%4===2) return numericQuestion(task,index,`Find the gradient between (${a}, ${b}) and (${a+c}, ${b+2*c}).`,2,`Gradient = rise/run = ${2*c}/${c}=2.`,Math.min(3,tier));
      return mcQuestion(task,index,`Which equation has gradient ${a} and y-intercept ${b}?`,`y = ${a}x + ${b}`,[`y = ${b}x + ${a}`,`y = ${a+b}x`,`y = x + ${a*b}`],`In y=mx+b, m is gradient and b is the y-intercept.`,Math.min(3,tier));
    }
    if(g==='function-eval') {
      if(form%2===0) return numericQuestion(task,index,`If f(x) = ${a}x² − ${b}, find f(${c}).`,a*c*c-b,`Substitute x=${c}, square first, then multiply and subtract.`,Math.min(3,tier));
      return numericQuestion(task,index,`If g(x) = ${a}x + ${b}, find g(${c}) − g(0).`,a*c,`g(${c})=${a*c+b} and g(0)=${b}; subtract.`,Math.min(3,tier));
    }
    if(g==='quadratic-graph') {
      if(form%11===10) return graphPointQuestion(task,index,`For y = x² − ${a*a}, plot the y-intercept.`,0,-a*a,`At the y-intercept x=0, so y = −${a*a}.`,Math.min(2,tier),'Substitute x = 0 into the equation.');
      if(form%3===0) return coordinateQuestion(task,index,`For y = x² − ${a*a}, give the y-intercept.`,0,-a*a,`At the y-intercept x=0.`,Math.min(2,tier));
      if(form%3===1) return mcQuestion(task,index,`Which way does y = ${a}x² + ${b} open?`,'Up',['Down','Left','Right'],`A positive x² coefficient means the parabola opens upward.`,Math.min(2,tier));
      return numericQuestion(task,index,`For y = x² − ${a*a}, find the positive x-intercept.`,a,`Set y=0: x²=${a*a}, so the positive intercept is x=${a}.`,Math.min(3,tier));
    }
    if(g==='exponential') {
      if(form%2===0) return numericQuestion(task,index,`For y = ${a}×2^x, find y when x=${c}.`,a*(2**c),`Substitute x=${c} and evaluate the power first.`,Math.min(3,tier));
      return mcQuestion(task,index,`Which model shows exponential growth?`,`y = ${a}×${b}^x`,[`y = ${a}x + ${b}`,`y = ${a}x² + ${b}`,`y = ${a}/${b}`],`In an exponential model, the variable is in the exponent.`,Math.min(3,tier));
    }
    if(g==='logarithm') {
      const power=pick(r,[2,3,4,5]);
      if(form%2===0) return numericQuestion(task,index,`If 2^x = ${2**power}, find x.`,power,`Rewrite ${2**power} as 2^${power}.`,Math.min(3,tier));
      return mcQuestion(task,index,`log₁₀(${10**power}) equals…`,String(power),[String(power+1),String(10*power),String(10**power)],`A base-10 logarithm asks for the exponent on 10.`,Math.min(3,tier));
    }
    if(g==='trig-function') {
      const angle=pick(r,[0,30,45,60,90]);
      const known={0:0,30:.5,90:1};
      if(angle in known) return numericQuestion(task,index,`Find sin(${angle}°).`,known[angle],`Use the exact special-angle value for sin(${angle}°).`,Math.min(2,tier));
      return mcQuestion(task,index,`Which statement about y = sin(x) is true?`,'It is periodic',['It is a straight line','It never crosses 0','It is always increasing'],`The sine graph repeats in a regular cycle.`,Math.min(3,tier));
    }
    return numericQuestion(task,index,`For y = ${a}x + ${b}, find y when x = ${c}.`,a*c+b,`Substitute x=${c}.`,Math.min(2,tier));
  }
  if (['sequence-linear','sequence'].includes(g)) {
    const mode=form%4;
    if (form%9===8) { const terms=[a,a+b,a+2*b,a+3*b]; const scrambled=[terms[2],terms[0],terms[3],terms[1]]; return dragDropQuestion(task,index,`Drag these sequence terms into the correct increasing order: ${scrambled.join(', ')}.`,scrambled.map(String),terms.map(String),`The sequence increases by ${b} each time: ${terms.join(', ')}.`,Math.min(2,tier),'Find the smallest term first, then add the common difference.'); }
    if (tier === 1) {
      if(mode%2===0) return numericQuestion(task,index,`Find the next term: ${a}, ${a+b}, ${a+2*b}, ...`,a+3*b,`Add ${b} each time.`,1);
      return numericQuestion(task,index,`Find the missing term: ${a}, __, ${a+2*b}, ${a+3*b}.`,a+b,`The common difference is ${b}.`,1);
    }
    if (tier === 2) {
      if(mode===0) return numericQuestion(task,index,`An arithmetic sequence starts at ${a} with common difference ${b}. Find term 10.`,a+9*b,`a₁₀ = ${a} + 9×${b}.`,2);
      if(mode===1) return numericQuestion(task,index,`The sequence ${a}, ${a+b}, ${a+2*b}, ... has common difference __.`,b,`Subtract consecutive terms.`,2);
      if(mode===2) return numericQuestion(task,index,`The nth term is ${b}n + ${a}. Find the 12th term.`,12*b+a,`Substitute n=12.`,2);
      return mcQuestion(task,index,`Which nth-term rule matches ${a+b}, ${a+2*b}, ${a+3*b}, ...?`,`${b}n + ${a}`,[`${a}n + ${b}`,`${b}n - ${a}`,`${a+b}n`],`The coefficient of n is the common difference ${b}; check n=1.`,2);
    }
    if(mode%2===0) return numericQuestion(task,index,`An arithmetic series has first term ${a}, common difference ${b}, and 20 terms. Find its sum.`,20/2*(2*a+19*b),`Use Sₙ = n/2[2a+(n−1)d].`,3);
    return numericQuestion(task,index,`An arithmetic sequence has first term ${a} and common difference ${b}. Which term equals ${a+14*b}? Enter the term number.`,15,`aₙ = a + (n−1)d, so n−1=14.`,3);
  }
  if (['measurement-2d','circle','measurement-composite'].includes(g)) {
    if(g==='measurement-2d' && form%9===8) return tableQuestion(task,index,`Use the table to find the area of a rectangle ${a} cm by ${c} cm.`,[{value:`${a} cm × ${b} cm`,frequency:`${a*b} cm²`},{value:`${a} cm × ${b+1} cm`,frequency:`${a*(b+1)} cm²`},{value:`${a} cm × ${c} cm`,frequency:'?'}],a*c,`Area = length × width = ${a} × ${c} = ${a*c} cm².`,1,'Multiply length by width, following the pattern in the table.');
    if(g==='circle') {
      const radius=a;
      if(tier===1) return numericQuestion(task,index,`Find the circumference of a circle with radius ${radius} cm. Give your answer to 2 d.p.`,2*Math.PI*radius,`C = 2πr = 2π×${radius}.`,1);
      if(form%2===0) return numericQuestion(task,index,`Find the area of a circle with radius ${radius} cm. Give your answer to 2 d.p.`,Math.PI*radius*radius,`A = πr².`,Math.min(3,tier));
      return numericQuestion(task,index,`A circle has diameter ${radius*2} m. Find its circumference to 2 d.p.`,Math.PI*radius*2,`Circumference = πd.`,Math.min(3,tier));
    }
    if(g==='measurement-composite') {
      if(form%2===0) return numericQuestion(task,index,`An L-shape is made from a ${a+5} m by ${b+4} m rectangle with a ${a} m by ${b} m corner removed. Find its area.`,(a+5)*(b+4)-a*b,`Find the large rectangle area and subtract the cut-out.`,Math.max(2,tier));
      return numericQuestion(task,index,`A shape is made from two non-overlapping rectangles with areas ${a*b} cm² and ${c*(a+1)} cm². Find the total area.`,a*b+c*(a+1),`Add the areas of the two rectangles.`,Math.max(2,tier));
    }
    if (tier === 1) {
      if(form%3===0) return numericQuestion(task,index,`Find the area of a rectangle ${a} cm by ${b} cm.`,a*b,`Area = length × width.`,1);
      if(form%3===1) return numericQuestion(task,index,`Find the perimeter of a rectangle ${a} cm by ${b} cm.`,2*(a+b),`Perimeter = 2(length + width).`,1);
      return numericQuestion(task,index,`A rectangle has area ${a*b} cm² and width ${b} cm. Find its length.`,a,`Length = area ÷ width.`,1);
    }
    if (tier === 2) {
      if(form%3===0) return numericQuestion(task,index,`Find the area of a triangle with base ${a*2} cm and height ${b} cm.`,a*b,`Area = ½ × base × height.`,2);
      if(form%3===1) return numericQuestion(task,index,`A triangle has area ${a*b} cm² and base ${a*2} cm. Find its perpendicular height.`,b,`Rearrange A = ½bh to h = 2A/b.`,2);
      return numericQuestion(task,index,`A rectangular garden is ${a} m by ${b} m. A path adds ${c} m to the total perimeter. Find the new perimeter length.`,2*(a+b)+c,`Find the rectangle perimeter, then add the extra path length.`,2);
    }
    return numericQuestion(task,index,`A rectangle ${a+5} m by ${b+4} m has a ${a} m by ${b} m rectangle removed. Find the remaining area.`,(a+5)*(b+4)-a*b,`Subtract the cut-out area from the full rectangle.`,3);
  }
  if (['measurement-3d'].includes(g)) {
    const mode=form%4;
    if (form%9===8) return tableQuestion(task,index,`Use the table to find the volume of a prism ${a} cm × ${b} cm × ${c} cm.`,[{value:`${a}×${b}×1`,frequency:`${a*b} cm³`},{value:`${a}×${b}×2`,frequency:`${a*b*2} cm³`},{value:`${a}×${b}×${c}`,frequency:'?'}],a*b*c,`Volume = length × width × height = ${a}×${b}×${c} = ${a*b*c} cm³.`,1,'Multiply the three dimensions, following the table pattern.');
    if (tier === 1) {
      if(mode%2===0) return numericQuestion(task,index,`Find the volume of a prism ${a} cm × ${b} cm × ${c} cm.`,a*b*c,`V = length × width × height.`,1);
      return numericQuestion(task,index,`A rectangular prism has volume ${a*b*c} cm³, length ${a} cm and width ${b} cm. Find its height.`,c,`Height = volume ÷ (length × width).`,1);
    }
    if (tier === 2) {
      if(mode===0) return numericQuestion(task,index,`A prism has cross-sectional area ${a*b} cm² and length ${c+4} cm. Find its volume.`,a*b*(c+4),`Volume = cross-sectional area × length.`,2);
      if(mode===1) return numericQuestion(task,index,`A prism has volume ${a*b*(c+4)} cm³ and length ${c+4} cm. Find its cross-sectional area.`,a*b,`Cross-sectional area = volume ÷ length.`,2);
      if(mode===2) return numericQuestion(task,index,`A box is ${a} cm by ${b} cm by ${c} cm. How many 1 cm³ cubes fill it?`,a*b*c,`Each cubic centimetre is one 1 cm³ cube.`,2);
      return numericQuestion(task,index,`A tank holds ${a*b*c} L when full. It is half full. How many litres are inside?`,a*b*c/2,`Half-full means divide the capacity by 2.`,2);
    }
    return numericQuestion(task,index,`A tank ${a+4} m × ${b+3} m × ${c} m is filled to 75%. Find the volume of water.`,(a+4)*(b+3)*c*0.75,`Find full volume then multiply by 0.75.`,3);
  }
  if (['angles','geometry-properties','congruence','similarity','circle-geometry','transformations'].includes(g)) {
    if((g==='angles'||g==='geometry-properties') && form%7===6) return matchingQuestion(task,index,`Match each angle to its correct type.`,[{left:'35°',right:'Acute'},{left:'120°',right:'Obtuse'},{left:'200°',right:'Reflex'}],`Acute is under 90°, obtuse is between 90° and 180°, reflex is over 180°.`,Math.min(2,tier),'Compare each angle to 90° and 180°.');
    if(g==='transformations') {
      if(form%3===0) return coordinateQuestion(task,index,`Translate (${a}, ${b}) by vector (${c}, ${-c}).`,a+c,b-c,`Add the vector components to the coordinates.`,Math.min(3,tier));
      if(form%3===1) return coordinateQuestion(task,index,`Reflect (${a}, ${b}) in the y-axis.`, -a,b,`Reflection in the y-axis changes the sign of x.`,Math.min(3,tier));
      return coordinateQuestion(task,index,`Rotate (${a}, ${b}) 180° about the origin.`, -a,-b,`A 180° rotation changes both coordinate signs.`,Math.min(3,tier));
    }
    if(g==='congruence') return mcQuestion(task,index,`Which condition is enough to prove two triangles are congruent?`,'SSS',['AAA','Same area only','Same perimeter only'],`SSS fixes all three side lengths, so the triangles are congruent.`,Math.min(3,tier));
    if(g==='similarity') {
      const small=Math.min(a,b), large=Math.max(a,b)+1;
      if(tier===1) {
        if(form%2===0) return numericQuestion(task,index,`Two similar shapes have side scale factor ${small}. A side of length ${b} becomes what length?`,small*b,`Multiply corresponding lengths by the scale factor.`,1);
        return numericQuestion(task,index,`A side grows from ${b} cm to ${small*b} cm in a similar shape. What is the length scale factor?`,small,`Scale factor = new length ÷ original length.`,1);
      }
      if(form%3===0) return numericQuestion(task,index,`Two similar shapes have length scale factor ${small}:${large}. The smaller area is ${c*small*small}. Find the larger area.`,c*large*large,`Areas scale by the square of the length scale factor.`,Math.min(3,tier));
      if(form%3===1) return numericQuestion(task,index,`Two similar figures have length scale factor ${small}:${large}. A smaller perimeter is ${c*small}. Find the larger perimeter.`,c*large,`Perimeters scale by the length scale factor.`,Math.min(3,tier));
      return numericQuestion(task,index,`A model is made at scale 1:${large}. A model length is ${b} cm. Find the real length in cm.`,large*b,`Multiply the model length by the scale factor.`,Math.min(3,tier));
    }
    if(g==='circle-geometry') {
      if(form%2===0) return numericQuestion(task,index,`An angle at the centre of a circle is ${a*10}°. What is the angle at the circumference standing on the same arc?`,a*5,`The angle at the centre is twice the angle at the circumference on the same arc.`,Math.min(3,tier));
      return numericQuestion(task,index,`A cyclic quadrilateral has one angle ${a*10}°. Find the opposite angle.`,180-a*10,`Opposite angles in a cyclic quadrilateral sum to 180°.`,Math.min(3,tier));
    }
    if(g==='geometry-properties') {
      if(form%2===0) return numericQuestion(task,index,`A quadrilateral has three angles ${a*5}°, ${b*5}° and ${c*5}°. Find the fourth angle.`,360-a*5-b*5-c*5,`Interior angles of a quadrilateral sum to 360°.`,Math.min(3,tier));
      return mcQuestion(task,index,`Which statement is always true for a parallelogram?`,'Opposite sides are parallel',['All four sides are equal','All angles are 90°','Diagonals are always equal'],`A parallelogram has two pairs of opposite parallel sides.`,Math.min(2,tier));
    }
    if (tier === 1) {
      if(form%3===0) return numericQuestion(task,index,`Angles on a straight line are ${a*5}° and x°. Find x.`,180-a*5,`Angles on a straight line sum to 180°.`,1);
      if(form%3===1) return numericQuestion(task,index,`Angles around a point are ${a*5}°, ${b*5}° and x°. Find x.`,360-a*5-b*5,`Angles around a point sum to 360°.`,1);
      return numericQuestion(task,index,`A right angle is split into ${a*4}° and x°. Find x.`,90-a*4,`A right angle is 90°.`,1);
    }
    if (tier === 2) {
      if(form%3===0) return numericQuestion(task,index,`A triangle has angles ${a*4}° and ${b*5}°. Find the third angle.`,180-a*4-b*5,`Triangle angles sum to 180°.`,2);
      if(form%3===1) return numericQuestion(task,index,`An isosceles triangle has two equal angles of ${a*5}°. Find the third angle.`,180-2*a*5,`Two equal angles plus the third total 180°.`,2);
      return numericQuestion(task,index,`Two parallel lines are cut by a transversal. One corresponding angle is ${a*7}°. Find the matching corresponding angle.`,a*7,`Corresponding angles are equal for parallel lines.`,2);
    }
    return numericQuestion(task,index,`Two parallel lines are cut by a transversal. An alternate angle is ${a*7}°. Find the matching alternate angle.`,a*7,`Alternate angles are equal when lines are parallel.`,3);
  }
  if (g === 'pythagoras') {
    const triples=[[3,4,5],[5,12,13],[6,8,10],[8,15,17],[9,12,15]]; const [m,n,hyp]=pick(r,triples), mode=form%4;
    if (tier === 1) {
      if(mode%2===0) return numericQuestion(task,index,`A right triangle has legs ${m} cm and ${n} cm. Find the hypotenuse.`,hyp,`Use c²=a²+b².`,1);
      return mcQuestion(task,index,`Which set could be the side lengths of a right triangle?`,`${m}, ${n}, ${hyp}`,[`${m}, ${n}, ${hyp+2}`,`${m}, ${n+1}, ${hyp}`,`${m+1}, ${n+1}, ${hyp}`],`Check whether a²+b²=c².`,1);
    }
    if (tier === 2) {
      if(mode===0) return numericQuestion(task,index,`A right triangle has hypotenuse ${hyp} cm and one leg ${m} cm. Find the other leg.`,n,`Use b = √(c²−a²).`,2);
      if(mode===1) return numericQuestion(task,index,`A ladder reaches ${n} m up a wall and its base is ${m} m from the wall. How long is the ladder?`,hyp,`The wall, ground and ladder form a right triangle.`,2);
      if(mode===2) return numericQuestion(task,index,`A rectangle is ${m} cm by ${n} cm. Find its diagonal.`,hyp,`The diagonal is the hypotenuse of a right triangle.`,2);
      return mcQuestion(task,index,`For a right triangle with legs ${m} and ${n}, which expression finds the hypotenuse?`,`√(${m}² + ${n}²)`,[`√(${hyp}² - ${m}²)`,`${m}+${n}`,`${m}²+${n}²`],`Use c=√(a²+b²).`,2);
    }
    const diag=round(Math.sqrt((a*3)**2+(b*4)**2),2); return numericQuestion(task,index,`A rectangular field is ${a*3} m by ${b*4} m. Find the diagonal distance to 2 d.p.`,diag,`Use Pythagoras on the rectangle diagonal.`,3);
  }
  if (['trig-right','bearings'].includes(g)) {
    const angle=pick(r,[30,45,60]);
    if(g==='bearings') {
      if(tier===1) return mcQuestion(task,index,`Which is a correctly written three-figure bearing?`,'045°',['45°','450°','4.5°'],`Bearings are measured clockwise from north and written with three digits.`,1);
      if(form%2===0) return numericQuestion(task,index,`A direction is ${angle}° east of north. Write its bearing as a number of degrees.`,angle,`Bearings are measured clockwise from north.`,Math.min(2,tier));
      const reverse=(angle+180)%360; return numericQuestion(task,index,`The bearing from A to B is ${String(angle).padStart(3,'0')}°. Find the reverse bearing from B to A.`,reverse,`Reverse bearings differ by 180°.`,Math.min(3,tier));
    }
    if (tier === 1) {
      if(form%9===8) return matchingQuestion(task,index,`Match each trig ratio to its formula (SOH CAH TOA).`,[{left:'sin θ',right:'opposite ÷ hypotenuse'},{left:'cos θ',right:'adjacent ÷ hypotenuse'},{left:'tan θ',right:'opposite ÷ adjacent'}],`SOH CAH TOA: sin=opp/hyp, cos=adj/hyp, tan=opp/adj.`,1,'Remember the mnemonic SOH CAH TOA.');
      if(form%2===0) return numericQuestion(task,index,`In a right triangle, opposite = ${a} and adjacent = ${b}. Calculate tan θ to 2 d.p.`,a/b,`tan θ = opposite/adjacent.`,1);
      return mcQuestion(task,index,`Which ratio is sin θ in a right triangle?`,'opposite ÷ hypotenuse',['adjacent ÷ hypotenuse','opposite ÷ adjacent','hypotenuse ÷ opposite'],`SOH: sine = opposite ÷ hypotenuse.`,1);
    }
    if (tier === 2) {
      if(form%3===0){ const ans=round((a+8)*Math.sin(angle*Math.PI/180),2); return numericQuestion(task,index,`A right triangle has hypotenuse ${a+8} and angle ${angle}°. Find the opposite side to 2 d.p.`,ans,`opposite = hypotenuse × sin(angle).`,2); }
      if(form%3===1){ const ans=round((a+8)*Math.cos(angle*Math.PI/180),2); return numericQuestion(task,index,`A right triangle has hypotenuse ${a+8} and angle ${angle}°. Find the adjacent side to 2 d.p.`,ans,`adjacent = hypotenuse × cos(angle).`,2); }
      return mcQuestion(task,index,`You know the opposite and adjacent sides and need the angle. Which trig ratio should you use?`,'tan',['sin','cos','Pythagoras only'],`Tangent links opposite and adjacent.`,2);
    }
    const ans=round(a*10*Math.tan(angle*Math.PI/180),2); return numericQuestion(task,index,`From a point ${a*10} m from a tower, the angle of elevation is ${angle}°. Find the tower height to 2 d.p.`,ans,`height = adjacent × tan(angle).`,3);
  }
  if (['probability','probability-compound','probability-conditional','probability-tree','relative-frequency','venn','combinatorics'].includes(g)) {
    const total=a+b;
    if(g==='probability' && form%9===8) return tableQuestion(task,index,`Use the outcomes table to find how many blue counters are in the bag.`,[{value:'Red',frequency:a},{value:'Blue',frequency:b},{value:'Total',frequency:total}],b,`Read the frequency in the Blue row.`,1,'Find the row labelled Blue.');
    if(g==='venn' && form%11===10) return matchingQuestion(task,index,`Match each Venn diagram region to its description.`,[{left:'Only in A',right:'Elements in A but not B'},{left:'Only in B',right:'Elements in B but not A'},{left:'A ∩ B',right:'Elements in both A and B'}],`Each region of a two-circle Venn diagram describes a different combination of set membership.`,Math.min(2,tier),'Think about which circles overlap for each region.');
    if(g==='relative-frequency') {
      const trials=(a+b)*10, hits=a*10, mode=form%4, rf=hits/trials;
      if(mode===0) return numericQuestion(task,index,`An event occurs ${hits} times in ${trials} trials. Find the relative frequency as a decimal.`,rf,`Relative frequency = occurrences ÷ trials.`,Math.min(2,tier));
      if(mode===1) return numericQuestion(task,index,`An event has relative frequency ${round(a/total,2)} over ${total*10} trials. About how many occurrences is that?`,round(a/total,2)*total*10,`Multiply relative frequency by the number of trials.`,Math.min(3,tier));
      if(mode===2) return mcQuestion(task,index,`Experiment A has ${hits}/${trials} successes. Experiment B has ${b*10}/${trials} successes. Which has the higher relative frequency?`,a===b?'They are equal':a>b?'Experiment A':'Experiment B',['Experiment A','Experiment B','They are equal'].filter(x=>x!==(a===b?'They are equal':a>b?'Experiment A':'Experiment B')),`Both use the same number of trials, so compare the success counts.`,Math.min(2,tier));
      return numericQuestion(task,index,`A success relative frequency is ${round(rf,2)} after ${trials} trials. Estimate the number of failures.`,trials-hits,`Estimated successes are ${hits}, so failures are ${trials}-${hits}.`,Math.min(3,tier));
    }
    if(g==='venn') {
      const both=c, onlyA=a, onlyB=b, neither=int(r,1,6), universe=onlyA+onlyB+both+neither;
      if(form%3===0) return numericQuestion(task,index,`In a class, ${onlyA} students are only in A, ${onlyB} only in B, and ${both} are in both. How many are in A ∪ B?`,onlyA+onlyB+both,`Add the two only regions and the overlap once.`,Math.min(3,tier));
      if(form%3===1) return numericQuestion(task,index,`A Venn diagram has ${onlyA} only in A, ${both} in both, and ${onlyB} only in B. How many are in A?`,onlyA+both,`Set A includes its own region plus the overlap.`,Math.min(2,tier));
      return numericQuestion(task,index,`A universal set has ${universe} items. ${onlyA+onlyB+both} are in A ∪ B. How many are in neither set?`,neither,`Neither = total − union.`,Math.min(3,tier));
    }
    if(g==='combinatorics') {
      if(tier===1) return numericQuestion(task,index,`There are ${a} shirts and ${b} pairs of shorts. How many different outfits can be made?`,a*b,`Use the multiplication principle: ${a}×${b}.`,1);
      if(form%2===0) return numericQuestion(task,index,`A code has one of ${a} letters followed by one of ${b} digits. How many codes are possible?`,a*b,`Multiply the independent choices.`,Math.min(2,tier));
      return numericQuestion(task,index,`${c} students can be chosen as captain or vice-captain. How many ordered choices are possible?`,c*(c-1),`${c} choices for captain, then ${c-1} for vice-captain.`,Math.min(3,tier));
    }
    if(g==='probability-tree') {
      const p=round(a/total,4), q=round(b/total,4);
      if(form%2===0) return numericQuestion(task,index,`A two-stage tree has P(A)=${p} on each independent stage. Find P(A then A).`,p*p,`Multiply along the branch: ${p}×${p}.`,Math.min(3,tier));
      return numericQuestion(task,index,`Two independent stages have P(A)=${p} and P(B)=${q}. Find P(A then B).`,p*q,`Multiply the probabilities along the chosen path.`,Math.min(3,tier));
    }
    if(g==='probability-conditional') {
      if(form%3===0){const ans=round(a/total*b/(total-1),4); return numericQuestion(task,index,`A bag has ${a} red and ${b} blue counters. Two are drawn without replacement. Find P(red then blue) to 4 d.p.`,ans,`After the first draw there is one fewer counter in the bag.`,Math.min(3,tier));}
      if(form%3===1){const ans=round(a/total*(a-1)/(total-1),4); return numericQuestion(task,index,`A bag has ${a} red and ${b} blue counters. Two are drawn without replacement. Find P(red then red) to 4 d.p.`,ans,`After drawing one red, there are ${a-1} red counters left out of ${total-1}.`,Math.min(3,tier));}
      const givenBlue=b/total, redAfterBlue=a/(total-1); return numericQuestion(task,index,`A bag has ${a} red and ${b} blue counters. Given that the first counter drawn was blue and not replaced, find P(red on the second draw) to 4 d.p.`,redAfterBlue,`One blue has been removed, so ${a} red remain out of ${total-1} counters.`,Math.min(3,tier));
    }
    if (tier === 1) {
      if(form%2===0) return numericQuestion(task,index,`A bag has ${a} red and ${b} blue counters. Find P(red) as a decimal.`,a/total,`P(red) = favourable ÷ total.`,1);
      return numericQuestion(task,index,`A fair die is rolled. Find P(rolling a number greater than 4) as a decimal.`,2/6,`The successful outcomes are 5 and 6 out of 6 equally likely outcomes.`,1);
    }
    if (tier === 2) {
      if(form%4===0){ const ans=(a/total)**2; return numericQuestion(task,index,`A bag has ${a} red and ${b} blue counters. A counter is drawn, replaced, then another is drawn. Find P(red then red).`,ans,`With replacement the probability stays ${a}/${total}; multiply the stages.`,2); }
      if(form%4===1){ const ans=(a/total)*(b/total); return numericQuestion(task,index,`A bag has ${a} red and ${b} blue counters. With replacement, find P(red then blue).`,ans,`Multiply P(red) by P(blue).`,2); }
      if(form%4===2){ const p=a/total; return numericQuestion(task,index,`A bag has ${a} red and ${b} blue counters. Find P(at least one red in one draw) as a decimal.`,p,`With one draw, “at least one red” is simply P(red).`,2); }
      return mcQuestion(task,index,`A fair six-sided die is rolled twice. Which expression gives P(rolling two sixes)?`,'1/6 × 1/6',['1/6 + 1/6','2/6','1/12 + 1/12'],`Independent stages multiply.`,2);
    }
    const ans=round(a/total*b/(total-1),4); return numericQuestion(task,index,`A bag has ${a} red and ${b} blue counters. Two are drawn without replacement. Find P(red then blue) to 4 d.p.`,ans,`Multiply the conditional probabilities.`,3);
  }
  if (['statistics-centre','statistics-distribution','data-display','boxplot','standard-deviation','scatter','regression','sampling','distribution'].includes(g)) {
    const vals=[a,b,c,a+b,b+c]; const mean=vals.reduce((x,y)=>x+y,0)/vals.length;
    if(g==='sampling') {
      if(form%11===10) return matchingQuestion(task,index,`Match each sampling method to whether it is likely to give a fair, representative sample.`,[{left:'Randomly select 50 students from the whole school roll',right:'Representative'},{left:'Only survey students waiting outside the principal’s office',right:'Biased'},{left:'Only survey members of the chess club about favourite sports',right:'Biased'}],`A representative sample gives every member of the population a fair chance of being chosen.`,Math.min(2,tier),'Ask whether every student had an equal chance of being picked.');
      if(form%3===0) return mcQuestion(task,index,`Which sample is most likely to represent all students in a school?`,'A random sample from every year group',['Only the basketball team','Only Year 12 students','Students who volunteer from one class'],`A representative sample should include the wider population and reduce selection bias.`,Math.min(3,tier));
      if(form%3===1) return mcQuestion(task,index,`A survey about school lunches is sent only to students who buy lunch every day. What is the main problem?`,'Sampling bias',['The sample is too random','There is no variable','The data is numerical'],`The sample over-represents frequent lunch buyers.`,Math.min(3,tier));
      return numericQuestion(task,index,`A school randomly surveys ${a*10} students from ${b*10} students. What fraction of the school was sampled as a decimal?`,a/b,`Sample fraction = sample size ÷ population size.`,Math.min(2,tier));
    }
    if(g==='scatter' || g==='regression') {
      if(form%3===0) return mcQuestion(task,index,`As study time increases, test score usually increases in a data set. What type of association is this?`,'Positive',['Negative','No association','Categorical only'],`Both variables tend to increase together.`,Math.min(2,tier));
      if(form%3===1) return mcQuestion(task,index,`A scatter plot has points close to an upward-sloping line. How would you describe the relationship?`,'Strong positive association',['Weak negative association','No association','Strong negative association'],`Closeness to an upward trend line indicates strong positive association.`,Math.min(3,tier));
      return numericQuestion(task,index,`A trend line is y = ${a}x + ${b}. Predict y when x=${c}.`,a*c+b,`Substitute x=${c} into the trend-line equation.`,Math.min(3,tier));
    }
    if(g==='boxplot') {
      const q1=a, med=a+b, q3=a+b+c;
      if(form%2===0) return numericQuestion(task,index,`A box plot has Q1=${q1} and Q3=${q3}. Find the interquartile range.`,q3-q1,`IQR = Q3 − Q1.`,Math.min(2,tier));
      return mcQuestion(task,index,`A box plot has median ${med}. What does the median represent?`,'The middle value',['The maximum value','The range','The mean'],`The median divides ordered data into two halves.`,Math.min(2,tier));
    }
    if(g==='standard-deviation') {
      if(form%2===0) return mcQuestion(task,index,`Which data set has the smaller standard deviation?`,'Values clustered closely around the mean',['Values spread widely from the mean','A set with a larger maximum only','A set with more data values only'],`Standard deviation measures spread around the mean.`,Math.min(3,tier));
      return mcQuestion(task,index,`If every value in a data set is the same, its standard deviation is…`,'0',['1','The mean','Undefined'],`There is no spread when all values are identical.`,Math.min(2,tier));
    }
    if(g==='data-display') {
      if (form % 2 === 0) return tableQuestion(task,index,'Use the frequency table to find the total frequency.',[{value:a,frequency:2},{value:b,frequency:3},{value:c,frequency:1}],6,'Add all frequencies.',Math.min(2,tier));
      return mcQuestion(task,index,`Which graph is usually best for comparing separate categories?`,'Bar chart',['Line graph for continuous time only','Scatter plot for two numerical variables','Box plot for quartiles'],`Bar charts compare category frequencies clearly.`,Math.min(2,tier));
    }
    if (form % 5 === 1) return tableQuestion(task,index,'Use the frequency table to find the total frequency.',[{value:a,frequency:2},{value:b,frequency:3},{value:c,frequency:1}],6,'Add the frequencies.',Math.min(3,tier));
    if (tier === 1) return numericQuestion(task,index,`Find the mean of ${vals.join(', ')}.`,mean,`Add the values and divide by ${vals.length}.`,1);
    if (tier === 2) {
      if(form%2===0) return numericQuestion(task,index,`The mean of 5 values is ${round(mean,2)}. Find their total.`,mean*5,`Total = mean × number of values.`,2);
      const sorted=[...vals].sort((x,y)=>x-y); return numericQuestion(task,index,`Find the median of ${sorted.join(', ')}.`,sorted[2],`The median is the middle value after ordering the data.`,2);
    }
    return mcQuestion(task,index,`A data set gains one extreme high outlier. Which measure of centre is usually more resistant?`,`Median`,['Mean','Range','Maximum'],`The median is less affected by extreme outliers.`,3);
  }
  if (g === 'networks') {
    const mode=form%4;
    if (form%9===8) { const legs=[a,b,c]; const scrambled=[legs[1],legs[2],legs[0]]; return dragDropQuestion(task,index,`This route has three legs of ${legs.join(' km, ')} km, travelled in that order. Drag the leg lengths into the correct travel order.`,scrambled.map(String),legs.map(String),`The legs are travelled in the order given: ${legs.join(', ')} km.`,Math.min(2,tier),'Re-read the order the legs are described in.'); }
    if (tier === 1) {
      if(mode%2===0) return numericQuestion(task,index,`A route has edges of ${a}, ${b} and ${c} km. Find its total length.`,a+b+c,`Add all edge weights.`,1);
      return numericQuestion(task,index,`A path uses two edges of ${a} km and ${b} km. How much longer is it than a ${c} km direct edge?`,a+b-c,`Find the path total, then subtract the direct length.`,1);
    }
    if (tier === 2) {
      if(mode===0) return mcQuestion(task,index,`Routes A and B have lengths ${a+b+c} km and ${a+b+c+int(r,1,5)} km. Which is the shorter route?`,`Route A`,['Route B','They are equal','Cannot tell'],`Compare total edge weights.`,2);
      if(mode===1) return numericQuestion(task,index,`Route A has edges ${a} km and ${b} km. Route B has edges ${c} km and ${a} km. How many kilometres shorter is the shorter route?`,Math.abs((a+b)-(c+a)),`Find both route totals, then subtract.`,2);
      if(mode===2) return mcQuestion(task,index,`A network has a direct edge of ${a+b} km and a two-edge path of ${a} km + ${b} km. How do the routes compare?`,'They are equal',['The direct edge is shorter','The two-edge path is shorter','There is not enough information'],`Both totals are ${a+b} km.`,2);
      return numericQuestion(task,index,`A delivery route totals ${a+b+c} km. A new shortcut removes ${c} km. What is the new route length?`,a+b,`Subtract the removed edge length.`,2);
    }
    if(mode===0) return numericQuestion(task,index,`A network trip uses routes of ${a+b} km and ${c+b} km, but a detour adds ${a} km. Find the new total.`,a+b+c+b+a,`Add both route lengths and the detour.`,3);
    if(mode===1) return numericQuestion(task,index,`A shortest path is ${a+b+c} km. A road closure adds ${b} km. Find the new path length.`,a+b+c+b,`Add the detour to the original route.`,3);
    if(mode===2) return numericQuestion(task,index,`Three route totals are ${a+b} km, ${b+c} km and ${a+c+2} km. Find the shortest distance.`,Math.min(a+b,b+c,a+c+2),`Compare all three route totals.`,3);
    return numericQuestion(task,index,`A ${a+b+c} km route is improved by removing ${c} km and adding a ${Math.max(1,c-1)} km connector. Find the new length.`,a+b+c-c+Math.max(1,c-1),`Subtract the removed section, then add the connector.`,3);
  }
  if (['calculus-diff','calculus-int'].includes(g)) {
    const mode=form%4;
    if(g==='calculus-int'){
      if(tier===1){
        if(mode%2===0) return mcQuestion(task,index,`Which is an antiderivative of ${2*a}x?`,`${a}x² + C`,[`${2*a}x² + C`,`${a}x + C`,`${2*a}`],`Increase the power by 1 and divide by the new power.`,1);
        return mcQuestion(task,index,`What constant is normally added to an indefinite integral?`,'C',['0','x','π'],`Indefinite integrals include an arbitrary constant C.`,1);
      }
      if(tier===2){
        if(mode===0) return numericQuestion(task,index,`Evaluate ∫₀^${c} ${2*a}x dx.`,a*c*c,`An antiderivative is ${a}x²; evaluate at ${c} and 0.`,2);
        if(mode===1) return numericQuestion(task,index,`Evaluate ∫₀^${c} ${b} dx.`,b*c,`The area under the constant function y=${b} from 0 to ${c} is ${b}×${c}.`,2);
        if(mode===2) return mcQuestion(task,index,`Which is an antiderivative of ${3*a}x² + ${b}?`,`${a}x³ + ${b}x + C`,[`${3*a}x³ + ${b}x`,`6${a}x + ${b}`,`${a}x² + ${b} + C`],`Integrate each term and include C.`,2);
        return numericQuestion(task,index,`If F'(x)=${2*a}x and F(0)=${b}, find F(${c}).`,a*c*c+b,`F(x)=${a}x²+C and F(0)=${b} gives C=${b}.`,2);
      }
      return numericQuestion(task,index,`Evaluate ∫₀^${c} (${3*a}x² + ${b}) dx.`,a*c*c*c+b*c,`An antiderivative is ${a}x³ + ${b}x; evaluate the bounds.`,3);
    }
    if (tier === 1) {
      if(mode%2===0) return mcQuestion(task,index,`Differentiate y = ${a}x².`,`dy/dx = ${2*a}x`,[`dy/dx = ${a}x`,`dy/dx = ${a}x²`,`dy/dx = ${2*a}`],`Use d/dx(x²)=2x.`,1);
      return mcQuestion(task,index,`Differentiate y = ${a}x + ${b}.`,`dy/dx = ${a}`,[`dy/dx = ${a}x`,`dy/dx = ${b}`,`dy/dx = ${a+b}`],`The derivative of ax+b is a.`,1);
    }
    if (tier === 2) {
      if(mode%2===0) return numericQuestion(task,index,`For f(x) = ${a}x² + ${b}x, find f'(${c}).`,2*a*c+b,`f'(x)=${2*a}x+${b}; substitute x=${c}.`,2);
      return numericQuestion(task,index,`For f(x) = ${a}x³, find the gradient at x=${c}.`,3*a*c*c,`f'(x)=${3*a}x², then substitute x=${c}.`,2);
    }
    return mcQuestion(task,index,`For f(x) = ${a}x³ - ${b}x² + ${c}x, which derivative is correct?`,`f'(x) = ${3*a}x² - ${2*b}x + ${c}`,[`f'(x) = ${a}x² - ${b}x + ${c}`,`f'(x) = ${3*a}x² - ${b}x`, `f'(x) = ${3*a}x³ - ${2*b}x² + ${c}`],`Differentiate term-by-term using the power rule.`,3);
  }
  if (g === 'vectors') {
    const mode=form%4;
    if (tier === 1) {
      if(mode%2===0) return numericQuestion(task,index,`Find the magnitude of vector (${a}, 0).`,a,`Magnitude = √(${a}²+0²).`,1);
      return mcQuestion(task,index,`Which vector moves ${a} units right and ${b} units up?`,`(${a}, ${b})`,[`(${-a}, ${b})`,`(${b}, ${a})`,`(${a}, ${-b})`],`The first component is horizontal and the second is vertical.`,1);
    }
    if (tier === 2) {
      if(mode===0){ const ans=round(Math.sqrt(a*a+b*b),2); return numericQuestion(task,index,`Find the magnitude of vector (${a}, ${b}) to 2 d.p.`,ans,`Use √(x²+y²).`,2); }
      if(mode===1) return mcQuestion(task,index,`If u = (${a}, ${b}) and v = (${c}, ${a}), find u + v.`,`(${a+c}, ${b+a})`,[`(${a-c}, ${b-a})`,`(${a*c}, ${b*a})`,`(${a+c}, ${b-a})`],`Add corresponding components.`,2);
      if(mode===2) return mcQuestion(task,index,`If u = (${a}, ${b}), find 2u.`,`(${2*a}, ${2*b})`,[`(${a+2}, ${b+2})`,`(${a*a}, ${b*b})`,`(${2*a}, ${b})`],`Multiply both components by 2.`,2);
      return coordinateQuestion(task,index,`Point P is (${a}, ${b}). Translate P by vector (${c}, ${-c}).`,a+c,b-c,`Add the vector to the point coordinates.`,2);
    }
    return mcQuestion(task,index,`If a = (${a}, ${b}) and b = (${c}, ${a}), what is a + b?`,`(${a+c}, ${b+a})`,[`(${a-c}, ${b-a})`,`(${a*c}, ${b*a})`,`(${a+c}, ${b-a})`],`Add corresponding components.`,3);
  }
  if (g === 'complex') {
    const mode=form%4;
    if (tier === 1) {
      if(mode%2===0) return mcQuestion(task,index,`Simplify ${a}i².`,`-${a}`,[String(a),`${a}i`,`-${a}i`],`Because i² = -1.`,1);
      return mcQuestion(task,index,`Which statement is true?`,'i² = -1',['i² = 1','i = -1','i² = i'],`The imaginary unit is defined by i²=-1.`,1);
    }
    if (tier === 2) {
      if(mode===0) return mcQuestion(task,index,`Add (${a}+${b}i) + (${c}+${a}i).`,`(${a+c})+${b+a}i`,[`(${a+c})+${b-a}i`,`(${a-c})+${b+a}i`,`(${a*c})+${b*a}i`],`Add real and imaginary parts separately.`,2);
      if(mode===1) return mcQuestion(task,index,`Subtract (${c}+${a}i) from (${a}+${b}i).`,`(${a-c})+${b-a}i`,[`(${a+c})+${b+a}i`,`(${c-a})+${a-b}i`,`(${a-c})+${b+a}i`],`Subtract corresponding real and imaginary parts.`,2);
      if(mode===2) return mcQuestion(task,index,`What is the complex conjugate of ${a}+${b}i?`,`${a}-${b}i`,[`${-a}+${b}i`,`${a}+${b}i`,`${-a}-${b}i`],`Change the sign of the imaginary part.`,2);
      const ans=round(Math.sqrt(a*a+b*b),2); return numericQuestion(task,index,`For z = ${a} + ${b}i, find |z| to 2 d.p.`,ans,`|z| = √(${a}²+${b}²).`,2);
    }
    const ans=round(Math.sqrt(a*a+b*b),2); return numericQuestion(task,index,`For z = ${a} + ${b}i, find |z| to 2 d.p.`,ans,`|z| = √(${a}²+${b}²) ≈ ${ans}.`,3);
  }
  if (g === 'proof') {
    if (form % 3 === 2) return writtenQuestion(task,index,`Explain why the sum of two odd integers is always even. After the general proof, check your reasoning using m=${a} and n=${b}.`,`Write the odd integers as 2m+1 and 2n+1. Their sum is 2m+2n+2 = 2(m+n+1), which is divisible by 2. Then verify with m=${a} and n=${b}.`,Math.max(2,tier),'Start by writing each odd integer in the form 2k + 1.');
    if (tier === 1) return mcQuestion(task,index,`Which expression is always even for integer n?`,`${2*a}n`,[`${2*a}n+1`,`${a}n+1`,`${2*a+1}n`],`Any integer multiplied by an even coefficient is even.`,1);
    if (tier === 2) { const odd=2*c-1; return mcQuestion(task,index,`If n is odd, which expression is guaranteed even?`,`n + ${odd}`,[`n + ${odd+1}`,`n² + ${odd}`,`2n + ${odd}`],`An odd number plus another odd number (${odd}) is even.`,2); }
    return mcQuestion(task,index,`To prove the sum of two odd integers is even, let the integers be 2m+${2*c-1} and 2n+${2*b-1}. Which form shows their sum is even?`,`2(m+n+${b+c-1})`,[`2mn+${2*(b+c-1)}`,`2(m+n)+${2*(b+c-1)+1}`,`m+n+${b+c-1}`],`Their sum is 2m+2n+${2*(b+c-1)} = 2(m+n+${b+c-1}).`,3);
  }
  if (g === 'modelling') {
    if (form % 4 === 3) return multiPartQuestion(task,index,`A taxi charges $${a} plus $${b} per kilometre.`,[
      {id:'a',label:`a) Find the fare for ${c} km.`,type:'numeric',answer:a+b*c},
      {id:'b',label:`b) Find the fare for ${c+2} km.`,type:'numeric',answer:a+b*(c+2)}
    ],`Use fare = fixed fee + rate × distance.`,Math.max(2,tier));
    if (tier === 1) return numericQuestion(task,index,`A taxi fare is $${a} plus $${b} per km. Find the fare for ${c} km.`,a+b*c,`Fare = fixed fee + rate×distance.`,1);
    if (tier === 2) return numericQuestion(task,index,`A population starts at ${a*100} and grows by ${b}% in one year. Find the new population.`,a*100*(1+b/100),`Multiply by ${1+b/100}.`,2);
    return mcQuestion(task,index,`A model y = ${a}(${b}^x) describes growth. Which parameter controls the starting value at x=0?`,String(a),[String(b),String(a*b),'x'],`At x=0, ${b}^0=1, so y=${a}.`,3);
  }
  if (g === 'substitution') {
    const mode=form%4;
    if (form%9===8) return tableQuestion(task,index,`This function machine uses the rule "×${a} then +${b}". Use the table to find the missing output.`,[{value:`in: 1`,frequency:`out: ${a+b}`},{value:`in: 2`,frequency:`out: ${2*a+b}`},{value:`in: ${c}`,frequency:`out: ?`}],a*c+b,`Apply the rule: ${a}×${c}+${b}=${a*c+b}.`,Math.min(2,tier),'Apply the same two-step rule shown in the first two rows.');
    if (tier === 1) {
      if(mode%2===0) return numericQuestion(task,index,`If x = ${c}, find ${a}x + ${b}.`,a*c+b,`Substitute x=${c}.`,1);
      return numericQuestion(task,index,`If n = ${c}, find n² + ${a}.`,c*c+a,`Replace n with ${c}, then square it.`,1);
    }
    if (tier === 2) {
      if(mode===0) return numericQuestion(task,index,`If x=${c} and y=${b}, find ${a}x - 2y.`,a*c-2*b,`Substitute both values before calculating.`,2);
      if(mode===1) return numericQuestion(task,index,`Use P = 2l + 2w. If l=${a} and w=${b}, find P.`,2*a+2*b,`Substitute the two dimensions into the formula.`,2);
      if(mode===2) return numericQuestion(task,index,`If a=${a}, b=${b} and c=${c}, find ab + c.`,a*b+c,`Replace each variable with its value.`,2);
      return numericQuestion(task,index,`Use v = u + at. If u=${a}, a=${b} and t=${c}, find v.`,a+b*c,`Substitute into v=u+at.`,2);
    }
    return numericQuestion(task,index,`Use A = πr². If r=${c}, find A to 2 d.p.`,Math.PI*c*c,`A=π×${c}².`,3);
  }

  // Reliable general fallback for any niche curriculum skill.
  if (form % 7 === 5) return numberLineQuestion(task,index,`Select the value of ${a}-${b}.`,a-b,-15,15,`${a}-${b}=${a-b}.`,Math.min(3,tier));
  if (form % 11 === 7) { const terms=[{left:'sum',right:'addition'},{left:'difference',right:'subtraction'},{left:'product',right:'multiplication'},{left:'quotient',right:'division'},{left:'factor',right:'a number multiplied by another'},{left:'multiple',right:'a result in a times table'},{left:'coefficient',right:'the number multiplying a variable'},{left:'constant',right:'a term with no variable'}]; const start=(a+b+c+index)%terms.length; const pairs=[terms[start],terms[(start+2)%terms.length],terms[(start+5)%terms.length]]; return matchingQuestion(task,index,`Match these three maths terms to their meanings: ${pairs.map(p=>p.left).join(', ')}.`,pairs,'Match each term with its standard mathematical meaning.',Math.min(3,tier)); }
  if (form % 13 === 9) return dragDropQuestion(task,index,`For the expression ${a} + ${b} × (${c} + 1)², put the order-of-operations stages in the correct order.`,
    ['Add / subtract','Brackets','Multiply / divide','Powers'],
    ['Brackets','Powers','Multiply / divide','Add / subtract'],
    'Use brackets first, then powers, then multiplication/division, then addition/subtraction.',Math.min(3,tier));
  if (tier === 1) return numericQuestion(task,index,`Calculate ${a} + ${b} × ${c}.`,a+b*c,`Multiply first, then add: ${a}+${b*c}=${a+b*c}.`,1);
  if (tier === 2) return numericQuestion(task,index,`A value starts at ${a*b} and changes by ${c}. Then it is divided by ${b}. Find the result.`,(a*b+c)/b,`Apply the change, then divide: (${a*b}+${c})/${b}.`,2);
  return mcQuestion(task,index,`Which strategy best fits a multi-step ${task.skill.toLowerCase()} problem?`,`Model the quantities, choose a rule, calculate, then check the result`,['Guess from the answer choices','Use only the largest number','Round every number before starting'],`Hard problems require selecting a method and checking whether the result is reasonable.`,3);
}

function estimateWorkingDemand(question={}) {
  const type=String(question?.type||'numeric');
  if(['multiple-choice','matching','drag-drop','number-line'].includes(type)) return 0;
  if(type==='multi-part') return Math.max(1,Math.min(5,(question.parts||[]).reduce((n,p)=>n+Math.max(1,Number(p?.marks)||1),0)-1));
  if(['written-response','proof'].includes(type)) return Math.max(2,Math.min(4,Number(question?.complexity)||3));
  const solution=String(question?.workedSolution||question?.solution||'').trim();
  const prompt=String(question?.prompt||'').trim();
  const complexity=Math.max(1,Math.min(5,Number(question?.complexity||question?.difficulty)||2));
  if(!solution) return Math.max(0,Math.min(4,complexity-1));
  // Straight recall / single arithmetic calculations should be one-mark final-answer questions.
  const simpleNumeric=type==='numeric' && complexity<=1 && (
    /^(?:what number|how many|calculate|evaluate|find)\b/i.test(prompt) ||
    /\b(?:comes next|constant term|coefficient of)\b/i.test(prompt)
  ) && !/\b(?:expand and simplify|solve .*equation|show|explain|prove|justify)\b/i.test(prompt);
  const eqCount=(solution.match(/=/g)||[]).length;
  const methodWords=(solution.match(/\b(expand|factor|factorise|substitute|rearrange|collect|simplify|divide|multiply|subtract|add|square|root|differentiate|integrate|solve|convert|calculate|plot|compare)\b/gi)||[]).length;
  if(simpleNumeric && eqCount<=1 && methodWords<=1) return 0;
  const sentenceSteps=solution.split(/(?:[.;]\s+|\bthen\b|\bnext\b|\bfinally\b|\btherefore\b)/i).map(x=>x.trim()).filter(x=>x.length>4).length;
  const equationLinks=Math.max(0,eqCount-1);
  const connectorSteps=(solution.match(/\b(first|then|next|after|before|finally|therefore|hence)\b/gi)||[]).length;
  // Marks are driven by the actual method in the worked solution, not by the task's
  // difficulty label. Difficulty is only used as a tiny fallback when a hard question
  // has a long but unusually terse stored solution.
  let steps=Math.max(
    equationLinks,
    Math.min(4,Math.ceil(methodWords/2)),
    Math.min(4,Math.max(0,sentenceSteps-1)+Math.min(2,connectorSteps))
  );
  if(steps===0 && complexity>=3 && solution.length>90) steps=1;
  if(solution.length<55 && equationLinks===0 && methodWords<=1 && connectorSteps===0) steps=0;
  return Math.max(0,Math.min(4,steps));
}
function questionMarkProfile(question, task) {
  const type=String(question?.type||'numeric');
  let workingSteps=estimateWorkingDemand(question);
  let marks=workingSteps+1;
  if(type==='multi-part') marks=Math.max(2,Math.min(6,(question.parts||[]).reduce((n,p)=>n+Math.max(1,Number(p?.marks)||1),0)));
  else if(['written-response','proof'].includes(type)) marks=Math.max(3,Math.min(6,marks+1));
  else if(['multiple-choice','matching','drag-drop','number-line'].includes(type)) marks=1;
  else marks=Math.max(1,Math.min(5,marks));
  workingSteps=marks<=1?0:Math.min(4,Math.max(1,workingSteps));
  const markRationale=marks===1?'Final answer only':`${workingSteps} method ${workingSteps===1?'step':'steps'} + final accuracy`;
  return {marksPossible:marks,workingSteps,requiresWorking:workingSteps>0,markRationale};
}
function diversifyQuestionFormat(question, task, index) {
  let q={...question};
  const variant=Math.max(1,Number(task?.variant)||1);
  // Only convert an MCQ into a constructed numeric response when its expected answer
  // is genuinely numeric. Algebraic/text MCQs must stay choices or the numeric grader
  // receives NaN and the question can appear broken.
  const numericAnswer=Number(String(q.answerText??'').replace(/,/g,'').trim());
  if(q.type==='multiple-choice' && q.answerText && Number.isFinite(numericAnswer) && ((index + variant) % 4 === 1)){
    q={...q,type:'numeric',answer:numericAnswer,exactAnswer:numericAnswer,options:undefined};
  }
  return {...q,...questionMarkProfile(q,task)};
}

function questionSignature(question) {
  if (!question) return '';
  const norm = (value) => String(value ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
  const parts = Array.isArray(question.parts) ? question.parts.map((p) => ({ label:norm(p.label), prompt:norm(p.prompt), type:norm(p.type) })) : null;
  const rows = Array.isArray(question.rows) ? question.rows : null;
  const pairs = Array.isArray(question.pairs) ? question.pairs : null;
  const items = Array.isArray(question.items) ? question.items : null;
  return JSON.stringify({ type:norm(question.type), prompt:norm(question.prompt), rows, pairs, items, parts, variationKey:norm(question._variationKey) });
}
function questionFingerprint(question) { return hash32(questionSignature(question)).toString(36); }
function distinctifyQuestion(question, variantNumber) {
  // Rare fallback for generators with a very small finite question pool.
  // Keep internal uniqueness metadata out of the student-facing maths prompt.
  const n = Math.max(1, Math.abs(Number(variantNumber) || 1));
  return { ...question, _variationKey:`fallback-${n}` };
}
function generateTaskQuestions(taskOrId, count = null, options = {}) {
  const task = typeof taskOrId === 'string' ? getTaskById(taskOrId) : taskOrId;
  if (!task) return [];
  if (typeof options === 'number') options = { seedOffset:options };
  const total = Math.max(1, Math.min(60, Number(count ?? task.questionCount) || task.questionCount));
  const seedOffset = Math.max(0, Math.floor(Math.abs(Number(options?.seedOffset) || 0))) % 100000000;
  const used = new Set((options?.avoidFingerprints || []).map(String));
  const out = [];
  let cursor = 0;
  const maxCandidates = Math.max(3000, total * 250);
  while (out.length < total && cursor < maxCandidates) {
    const candidateIndex = seedOffset + cursor;
    const q = diversifyQuestionFormat(generateByFamily(task, candidateIndex), task, candidateIndex);
    const fingerprint = questionFingerprint(q);
    if (!used.has(fingerprint)) {
      const sequential = { ...q, id:`${task.id}:r${seedOffset}:q${out.length + 1}` };
      out.push(sequential);
      used.add(fingerprint);
    }
    cursor += 1;
  }
  // Absolute fallback: if a niche generator has fewer unique mathematical forms than
  // the requested task length, make the displayed prompt distinct rather than repeat it.
  while (out.length < total) {
    const candidateIndex = seedOffset + cursor++;
    let q = diversifyQuestionFormat(generateByFamily(task, candidateIndex), task, candidateIndex);
    let variation = candidateIndex + 1;
    let fingerprint = questionFingerprint(q);
    while (used.has(fingerprint)) {
      q = distinctifyQuestion(q, variation++);
      fingerprint = questionFingerprint(q);
    }
    out.push({ ...q, id:`${task.id}:r${seedOffset}:q${out.length + 1}` });
    used.add(fingerprint);
  }
  return out;
}
function previewTask(taskOrId) {
  const task = typeof taskOrId === 'string' ? getTaskById(taskOrId) : taskOrId;
  if (!task) return null;
  return { ...task, sampleQuestions: generateTaskQuestions(task, 3) };
}

return {TASK_TYPES,TASK_DIFFICULTIES,QUESTION_COUNTS,TASK_LIBRARY_SIZE,TASK_LIBRARY,getTaskById,searchTaskLibrary,generateTaskQuestions,previewTask,questionSignature,questionFingerprint};
})();
// module: src/core/question-engine.js
__modules["src/core/question-engine.js"]=(()=>{
function normaliseAnswer(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[×·]/g, '*')
    .replace(/\*/g, '');
}

function parseNumeric(value, expected = Number.NaN) {
  let raw = String(value ?? '').trim().toLowerCase();
  if (raw === '') return Number.NaN;
  raw = raw
    .replace(/^[a-z]\s*=\s*/i, '')
    .replace(/[−–—]/g, '-')
    .replace(/[,$£€¥]/g, '')
    .replace(/\s+/g, '')
    .replace(/[.;:!?]+$/g, '');
  const percent = raw.endsWith('%');
  if (percent) raw = raw.slice(0, -1);
  // Accept a simple exact fraction such as 1/2.
  if (/^[+-]?\d+(?:\.\d+)?\/[+-]?\d+(?:\.\d+)?$/.test(raw)) {
    const [a,b] = raw.split('/').map(Number);
    if (Number.isFinite(a) && Number.isFinite(b) && b !== 0) {
      const value = a / b;
      if (percent && Number.isFinite(expected) && Math.abs(expected) <= 1) return value / 100;
      return value;
    }
  }
  // Allow normal units after a numeric answer (km, cm², dollars, etc.) while
  // rejecting text before the number. This also accepts a sentence-ending full stop.
  const match = raw.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:[a-z°²³/^0-9-]*)?$/i);
  if (!match) return Number.NaN;
  let number = Number(match[1]);
  if (!Number.isFinite(number)) return Number.NaN;
  if (percent && Number.isFinite(expected) && Math.abs(expected) <= 1) number /= 100;
  return number;
}
function validateAnswer(question, rawAnswer) {
  if (!question) return { correct: false, reason: 'missing-question' };
  const type = question.type === 'step-entry' ? question.answerKind : question.type;

  if (type === 'numeric' || type === 'linear-equation') {
    const stored = Number(question.answer);
    const exact = Number(question.exactAnswer);
    const expected = Number.isFinite(exact) ? exact : stored;
    const actual = parseNumeric(rawAnswer, expected);
    const prompt = String(question.prompt || '').toLowerCase();
    // Numeric questions should accept mathematically equivalent fractions and sensible
    // decimal rounding unless the question explicitly demands an exact integer/value.
    let tolerance = 1e-9;
    if (/\$|price|balance|fare|fee|interest|investment|cost|money|amount/.test(prompt) || /2\s*d\.?p\.?|2\s*decimal/.test(prompt)) tolerance = 0.00501;
    else if (/1\s*d\.?p\.?|1\s*decimal/.test(prompt)) tolerance = 0.05001;
    else if (/3\s*d\.?p\.?|3\s*decimal/.test(prompt)) tolerance = 0.000501;
    else if (/4\s*d\.?p\.?|4\s*decimal/.test(prompt)) tolerance = 0.0000501;
    else if (/decimal/.test(prompt) && !/\d\s*d\.?p\.?|decimal place/.test(prompt)) tolerance = 0.00051;
    else if (Number.isFinite(expected) && !Number.isInteger(expected)) {
      const asksExact = /exact|fraction|sur[d]?|leave\s+in|do\s+not\s+round/.test(prompt);
      tolerance = asksExact ? 0.00051 : 0.00501;
    }
    else if (!Number.isFinite(exact) && Number.isFinite(stored) && !Number.isInteger(stored)) tolerance = Math.max(tolerance,0.000051);
    return { correct: Number.isFinite(actual) && Number.isFinite(expected) && Math.abs(actual - expected) <= tolerance };
  }

  if (type === 'multiple-choice') {
    return { correct: String(rawAnswer) === String(question.answer) };
  }

  if (type === 'expression' || type === 'short-answer') {
    const actual = normaliseAnswer(rawAnswer);
    const acceptedRaw = question.acceptedAnswers ?? [question.answer];
    const accepted = acceptedRaw.map(normaliseAnswer);
    if (accepted.includes(actual)) return { correct:true };
    // Algebra answers can be equivalent without having the same text/order.
    // Compare safe numeric samples with implicit multiplication, never eval().
    const prep=(value)=>String(value??'').trim().toLowerCase()
      .replace(/[−–—]/g,'-').replace(/×/g,'*').replace(/÷/g,'/').replace(/π/g,'pi')
      .replace(/²/g,'^2').replace(/³/g,'^3').replace(/\^/g,'**')
      .replace(/(\d|\))(?=[a-z(])/g,'$1*').replace(/([a-z]|\))(?=\d|\()/g,'$1*');
    const variableSource=`${rawAnswer} ${acceptedRaw.join(' ')}`.toLowerCase().replace(/sqrt|sin|cos|tan|log|ln|abs|pi/g,'');
    const variables=[...new Set(variableSource.match(/[a-z]/g)||[])].filter(v=>v!=='e').slice(0,4);
    if(variables.length && globalThis.MXSafeMath?.evaluate){
      const samples=[-3,-1,0.5,2,5];
      for(const expectedRaw of acceptedRaw){
        try{
          const aExpr=prep(rawAnswer), eExpr=prep(expectedRaw);
          let ok=true,checked=0;
          for(let i=0;i<samples.length;i++){
            const vars={}; variables.forEach((v,j)=>vars[v]=samples[(i+j)%samples.length]);
            const av=Number(globalThis.MXSafeMath.evaluate(aExpr,vars,{angleMode:'rad'}));
            const ev=Number(globalThis.MXSafeMath.evaluate(eExpr,vars,{angleMode:'rad'}));
            if(!Number.isFinite(av)||!Number.isFinite(ev)){ok=false;break;}
            checked++;
            if(Math.abs(av-ev)>1e-7*Math.max(1,Math.abs(ev))){ok=false;break;}
          }
          if(ok&&checked>=3)return {correct:true};
        }catch{}
      }
    }
    return { correct:false };
  }

  if (type === 'coordinate' || type === 'graph-point') {
    const raw=Array.isArray(rawAnswer)?rawAnswer:String(rawAnswer??'').replace(/[()]/g,'').split(',');
    const expected=Array.isArray(question.answer)?question.answer:String(question.answer??'').replace(/[()]/g,'').split(',');
    const e=expected.map(Number); const a=raw.map((v,i)=>parseNumeric(v,e[i]));
    return { correct:a.length>=2&&e.length>=2&&a.slice(0,2).every((v,i)=>Number.isFinite(v)&&Math.abs(v-e[i])<=1e-6) };
  }

  if (type === 'number-line' || type === 'table-entry') {
    const expected=Number(question.exactAnswer ?? question.answer); const actual=parseNumeric(rawAnswer,expected);
    return { correct:Number.isFinite(actual)&&Number.isFinite(expected)&&Math.abs(actual-expected)<=1e-6 };
  }

  if (type === 'drag-drop' || type === 'matching') {
    const parse=(v)=>{if(v&&typeof v==='object')return v;try{return JSON.parse(String(v));}catch{return String(v);}};
    const a=parse(rawAnswer),e=parse(question.answer);
    return { correct:JSON.stringify(a)===JSON.stringify(e) };
  }

  if (type === 'multi-part') {
    const answer=rawAnswer&&typeof rawAnswer==='object'?rawAnswer:{};
    const parts=Array.isArray(question.parts)?question.parts:[];
    const results=parts.map((p,i)=>validateAnswer({...p,type:p.type||'short-answer'},answer[p.id||p.label||i]));
    return { correct:results.length>0&&results.every(r=>r.correct===true), parts:results };
  }

  if (type === 'written-response' || type === 'proof') {
    const text=String(rawAnswer??'').trim();
    return { correct:null, needsReview:true, sufficient:text.length>=Math.max(10,Number(question.minLength)||10) };
  }

  return { correct: false, reason: 'unsupported-question-type' };
}
function chooseQuestion(questions, recentResults = []) {
  if (!questions?.length) return null;
  const sorted = [...questions].sort((a, b) => (a.difficulty ?? 1) - (b.difficulty ?? 1));
  if (!recentResults.length) return sorted[Math.min(1, sorted.length - 1)];
  const recent = recentResults.slice(-3);
  const accuracy = recent.filter(Boolean).length / recent.length;
  if (accuracy <= 0.5) return sorted[0];
  if (accuracy >= 0.8) return sorted[sorted.length - 1];
  return sorted[Math.floor((sorted.length - 1) / 2)];
}

return {normaliseAnswer,validateAnswer,chooseQuestion};
})();
// module: src/core/generated-task-runner.js
__modules["src/core/generated-task-runner.js"]=(()=>{
const {getTaskById, generateTaskQuestions, questionFingerprint}=__modules["src/data/task-library.js"];
const {validateAnswer}=__modules["src/core/question-engine.js"];
function expectedSelfCheckInput(q){
  if(q?.type==='multi-part'){
    const out={};
    (q.parts||[]).forEach((p,i)=>{out[p.id||p.label||i]=p.answer;});
    return out;
  }
  if(q?.type==='written-response'||q?.type==='proof'){
    const base=String(q.sampleAnswer||q.answer||'Show a complete mathematical method and conclusion.');
    return base.padEnd(Math.max(20,Number(q.minLength)||10),' details');
  }
  return q?.answer;
}
function generatedQuestionPassesSelfCheck(q){
  try {
    const result=validateAnswer(q,expectedSelfCheckInput(q));
    return result.correct===true || result.needsReview===true;
  } catch { return false; }
}
function createGeneratedTaskRun(taskOrId, options = {}) {
  const task = typeof taskOrId === 'string' ? getTaskById(taskOrId) : taskOrId;
  if (!task) throw new Error('Generated task not found.');
  const runSeed = Number(options?.runSeed) || (Date.now() + Math.floor(Math.random() * 1000000));
  const seedOffset = Number.isFinite(Number(options?.seedOffset)) ? Number(options.seedOffset) : Math.abs(Math.floor(runSeed % 100000000));
  const target=Math.max(1,Number(task.questionCount)||10);
  const avoid=new Set((options?.avoidFingerprints||[]).map(String));
  let questions=[];
  for(let pass=0; pass<12 && questions.length<target; pass+=1){
    const batch=generateTaskQuestions(task,target,{seedOffset:seedOffset+(pass*1009),avoidFingerprints:[...avoid]});
    for(const q of batch){
      const fp=questionFingerprint(q);
      if(!fp || avoid.has(fp) || !generatedQuestionPassesSelfCheck(q)) continue;
      avoid.add(fp); questions.push(q);
      if(questions.length>=target) break;
    }
  }
  if(questions.length<target) throw new Error('Could not build a fully validated unique question set. Please start the task again.');
  return {
    task,
    runSeed,
    questions,
    index: 0,
    current: questions[0] ?? null,
    answered: 0,
    correct: 0,
    attempts: 0,
    hintCount: 0,
    selectedChoice: '',
    feedback: null,
    attemptHistory: [],
    questionResults: [],
    complete: questions.length === 0,
    startedAt: Date.now(),
  };
}
function submitGeneratedAnswer(run, rawAnswer) {
  if (!run?.current || run.complete || run.feedback?.correct || run.feedback?.needsReview) return run;
  const result = validateAnswer(run.current, rawAnswer);
  const firstAttemptForQuestion = (Number(run.attempts)||0) === 0;
  return {
    ...run,
    attempts: run.attempts + 1,
    answered: run.answered + 1,
    correct: run.correct + (result.correct ? 1 : 0),
    feedback: { correct: result.correct, needsReview:Boolean(result.needsReview), sufficient:result.sufficient, rawAnswer: typeof rawAnswer==='string'?rawAnswer:JSON.stringify(rawAnswer ?? '') },
    attemptHistory: [...(run.attemptHistory || []), {
      rawAnswer: typeof rawAnswer==='string'?rawAnswer:JSON.stringify(rawAnswer ?? ''),
      correct:Boolean(result.correct),
      needsReview:Boolean(result.needsReview),
      at:Date.now(),
    }],
  };
}
function saveGeneratedQuestion(run) {
  const saved = {...(run.questionStates||{})};
  if(run.current) saved[run.index]={attempts:run.attempts,hintCount:run.hintCount,selectedChoice:run.selectedChoice,feedback:run.feedback,attemptHistory:run.attemptHistory,stepState:run.stepState,draftAnswer:run.draftAnswer,uiDraft:run.uiDraft};
  const results=[...(run.questionResults||[])];
  if(run.current && (run.feedback?.correct||run.feedback?.needsReview)) results[run.index]={questionId:run.current.id,correct:Boolean(run.feedback.correct),needsReview:Boolean(run.feedback.needsReview),attempts:run.attempts,rawAnswer:run.feedback.rawAnswer||''};
  return {...run,questionStates:saved,questionResults:results};
}
function jumpGeneratedTask(run,index) {
  if(!run || run.complete || !Number.isInteger(index) || index<0 || index>=run.questions.length) return run;
  const saved=saveGeneratedQuestion(run), item=saved.questionStates[index]||{};
  return {...saved,index,current:run.questions[index],attempts:item.attempts||0,hintCount:item.hintCount||0,selectedChoice:item.selectedChoice||'',feedback:item.feedback||null,attemptHistory:item.attemptHistory||[],stepState:item.stepState,draftAnswer:item.draftAnswer||'',uiDraft:item.uiDraft};
}
function advanceGeneratedTask(run) {
  if(!run || run.complete || !(run.feedback?.correct||run.feedback?.needsReview)) return run;
  const saved=saveGeneratedQuestion(run);
  const remaining=run.questions.map((_,i)=>i).filter(i=>!saved.questionResults[i]);
  if(!remaining.length) return {...saved,index:run.questions.length,current:null,complete:true,feedback:null};
  return jumpGeneratedTask(saved,remaining.find(i=>i>run.index)??remaining[0]);
}
function safeGeneratedHints(question={}) {
  const type=String(question.type||question.answerKind||'numeric');
  if(type==='multiple-choice') return [
    'Read every choice first. Identify the rule, definition or calculation the question is testing.',
    'Test each choice against the question and cross out choices that do not fit.',
    'Explain why your chosen option fits before you submit it.'
  ];
  if(type==='coordinate'||type==='graph-point') return [
    'Identify the x-value and y-value separately before placing the point.',
    'Move along the x-axis first, then move vertically to the y-value.',
    'Check that you wrote the coordinate in the order (x, y).'
  ];
  if(type==='number-line') return [
    'Estimate where the answer should sit between the labelled values.',
    'Check the size of each interval before choosing a point.',
    'Compare your selected value with the question one more time.'
  ];
  if(type==='table-entry') return [
    'Read the table headings and identify which row or column contains the information you need.',
    'Write down the values you need before doing the calculation.',
    'Check that your result matches the units and meaning of the table.'
  ];
  if(type==='multi-part') return [
    'Work on one part at a time and label each answer clearly.',
    'Use an earlier result only when the next part depends on it.',
    'Check every part before submitting the whole response.'
  ];
  if(type==='matching') return [
    'State the rule or relationship that links the two sides.',
    'Test one pair at a time and remove matches you have already used.',
    'Read all completed pairs once more to check that each relationship makes sense.'
  ];
  if(type==='drag-drop') return [
    'Identify the rule that decides the correct order before moving the tiles.',
    'Compare neighbouring tiles one pair at a time.',
    'Check the whole sequence from start to finish before submitting.'
  ];
  if(type==='written-response'||type==='proof') return [
    'Write down the facts, definitions or rules you know before making a conclusion.',
    'Link each step to a mathematical reason instead of jumping straight to the result.',
    'Finish with a sentence that answers exactly what the question asks.'
  ];
  return [
    'Identify what you know, what you need to find, and the rule or operation that connects them.',
    'Work one small step at a time. Keep equations balanced and keep units or labels with your values.',
    'Check your result by substituting it back, reversing the operation, or estimating whether it is reasonable.'
  ];
}
function useGeneratedHint(run) {
  if (!run?.current) return run;
  const safeHints=safeGeneratedHints(run.current);
  const current={...run.current,hints:safeHints};
  const questions=Array.isArray(run.questions)?[...run.questions]:[];
  if(questions.length&&Number.isInteger(run.index)&&run.index>=0&&run.index<questions.length)questions[run.index]=current;
  run={...run,current,questions:questions.length?questions:run.questions};
  const max = safeHints.length;
  return { ...run, hintCount: Math.min(max, run.hintCount + 1) };
}

function selectGeneratedChoice(run, choice) {
  if (!run?.current) return run;
  return { ...run, selectedChoice: String(choice ?? '') };
}
function generatedTaskProgress(run) {
  if (!run?.questions?.length) return 0;
  if (run.complete) return 100;
  return Math.round((run.index / run.questions.length) * 100);
}

return {createGeneratedTaskRun,submitGeneratedAnswer,jumpGeneratedTask,advanceGeneratedTask,useGeneratedHint,selectGeneratedChoice,generatedTaskProgress};
})();
// module: src/core/progression.js
__modules["src/core/progression.js"]=(()=>{
const QUEST_DEFINITIONS = {
  'answer-5': { id: 'answer-5', title: 'Warm Up', description: 'Answer 5 maths questions', target: 5, metric: 'answered' },
  'correct-3': { id: 'correct-3', title: 'On a Roll', description: 'Get 3 answers correct', target: 3, metric: 'correct' },
  'earn-40-xp': { id: 'earn-40-xp', title: 'XP Builder', description: 'Earn 40 XP', target: 40, metric: 'xp' },
};
const ACHIEVEMENTS = [
  { id: 'first-step', title: 'First Step', description: 'Answer your first question', earned: (s) => (s.stats?.answered ?? 0) >= 1 },
  { id: 'warm-up-10', title: 'Warm-Up Complete', description: 'Answer 10 maths questions', earned: (s) => (s.stats?.answered ?? 0) >= 10 },
  { id: 'practice-50', title: 'Practice Builder', description: 'Answer 50 maths questions', earned: (s) => (s.stats?.answered ?? 0) >= 50 },
  { id: 'practice-100', title: 'Century Club', description: 'Answer 100 maths questions', earned: (s) => (s.stats?.answered ?? 0) >= 100 },
  { id: 'practice-500', title: 'Maths Marathon', description: 'Answer 500 maths questions', earned: (s) => (s.stats?.answered ?? 0) >= 500 },
  { id: 'correct-25', title: 'Accuracy Starter', description: 'Get 25 answers correct', earned: (s) => (s.stats?.correct ?? 0) >= 25 },
  { id: 'correct-100', title: 'Problem Solver', description: 'Get 100 answers correct', earned: (s) => (s.stats?.correct ?? 0) >= 100 },
  { id: 'accuracy-80', title: 'Sharp Thinker', description: 'Reach at least 80% accuracy after 25 questions', earned: (s) => (s.stats?.answered ?? 0) >= 25 && ((s.stats?.correct ?? 0)/(s.stats?.answered || 1)) >= .8 },
  { id: 'accuracy-90', title: 'Precision Pro', description: 'Reach at least 90% accuracy after 50 questions', earned: (s) => (s.stats?.answered ?? 0) >= 50 && ((s.stats?.correct ?? 0)/(s.stats?.answered || 1)) >= .9 },
  { id: 'streak-3', title: 'Three-Day Streak', description: 'Keep a 3-day learning streak', earned: (s) => (s.streak ?? 0) >= 3 },
  { id: 'streak-7', title: 'Week Warrior', description: 'Keep a 7-day learning streak', earned: (s) => (s.streak ?? 0) >= 7 },
  { id: 'streak-30', title: 'Monthly Momentum', description: 'Keep a 30-day learning streak', earned: (s) => (s.streak ?? 0) >= 30 },
  { id: 'coin-500', title: 'Coin Collector', description: 'Hold 500 coins', earned: (s) => (s.coins ?? 0) >= 500 },
  { id: 'coin-2500', title: 'Reward Saver', description: 'Hold 2,500 coins', earned: (s) => (s.coins ?? 0) >= 2500 },
  { id: 'game-time-5', title: 'Game Time Bank', description: 'Fill your 5-minute Game Time bank', earned: (s) => (s.gameTimeSeconds ?? 0) >= 300 },
  { id: 'drive-1000', title: 'Maths Driver', description: 'Score 1,000 in Maths Drive', earned: (s) => (s.drivingHighScore ?? 0) >= 1000 },
  { id: 'drive-5000', title: 'Road Scholar', description: 'Score 5,000 in Maths Drive', earned: (s) => (s.drivingHighScore ?? 0) >= 5000 },
  { id: 'algebra-apprentice', title: 'Algebra Apprentice', description: 'Reach 25% Algebra mastery', earned: (s) => getTopicMastery(s, 'algebra') >= 25 },
  { id: 'algebra-skilled', title: 'Algebra Skilled', description: 'Reach 50% Algebra mastery', earned: (s) => getTopicMastery(s, 'algebra') >= 50 },
  { id: 'algebra-master', title: 'Algebra Master', description: 'Reach 80% Algebra mastery', earned: (s) => getTopicMastery(s, 'algebra') >= 80 },
  { id: 'algebra-perfect', title: 'Algebra 100', description: 'Reach 100% Algebra mastery', earned: (s) => getTopicMastery(s, 'algebra') >= 100 },
  { id: 'collector-5', title: 'Locker Starter', description: 'Own 5 shop cosmetics', earned: (s) => (s.ownedCosmetics?.length ?? 0) >= 5 },
  { id: 'collector-15', title: 'Style Collector', description: 'Own 15 shop cosmetics', earned: (s) => (s.ownedCosmetics?.length ?? 0) >= 15 },
  { id: 'goal-setter', title: 'Goal Setter', description: 'Create a learning goal', earned: (s) => (s.goals?.length ?? 0) >= 1 },
  { id: 'mistake-fixer', title: 'Mistake Fixer', description: 'Build a revision list from mistakes', earned: (s) => (s.mistakeBook?.length ?? 0) >= 5 },
  { id: 'practice-1000', title: 'Question Machine', description: 'Answer 1,000 maths questions', earned: (s) => (s.stats?.answered ?? 0) >= 1000 },
  { id: 'correct-500', title: '500 Correct', description: 'Get 500 answers correct', earned: (s) => (s.stats?.correct ?? 0) >= 500 },
  { id: 'streak-100', title: '100-Day Learner', description: 'Keep a 100-day learning streak', earned: (s) => (s.streak ?? 0) >= 100 },
  { id: 'coin-10000', title: 'Maths Millionaire', description: 'Hold 10,000 coins', earned: (s) => (s.coins ?? 0) >= 10000 },
  { id: 'collector-25', title: 'Locker Legend', description: 'Own 25 shop cosmetics', earned: (s) => (s.ownedCosmetics?.length ?? 0) >= 25 },
  { id: 'challenge-entry', title: 'Challenge Accepted', description: 'Complete a global challenge run', earned: (s) => (s.challengeHistory?.length ?? 0) >= 1 },
  { id: 'challenge-10', title: 'Challenge Regular', description: 'Complete 10 global challenge runs', earned: (s) => (s.challengeHistory?.length ?? 0) >= 10 },
  { id: 'goal-finisher', title: 'Goal Finisher', description: 'Complete a learning goal', earned: (s) => (s.goals ?? []).some((g)=>g?.completed || g?.status==='completed') },
  { id: 'textbook-explorer', title: 'Textbook Explorer', description: 'Make progress in 10 textbook sections', earned: (s) => Object.keys(s.textbookProgress ?? {}).length >= 10 },
  { id: 'flashcard-builder', title: 'Flashcard Builder', description: 'Create at least 20 flashcards', earned: (s) => (s.flashcards?.length ?? 0) >= 20 },
  ...Array.from({length:40},(_,i)=>{const target=(i+1)*100;return {id:`questions-${target}`,title:`${target.toLocaleString()} Questions`,description:`Answer ${target.toLocaleString()} maths questions`,earned:(s)=>(s.stats?.answered??0)>=target};}),
  ...Array.from({length:35},(_,i)=>{const target=(i+1)*100;return {id:`correct-extra-${target}`,title:`${target.toLocaleString()} Correct`,description:`Get ${target.toLocaleString()} answers correct`,earned:(s)=>(s.stats?.correct??0)>=target};}),
  ...[2,5,10,14,21,45,60,75,90,120,150,180,200,250,300,365,500,750,1000].map(target=>({id:`streak-extra-${target}`,title:`${target}-Day Streak`,description:`Keep a ${target}-day learning streak`,earned:(s)=>(s.streak??0)>=target})),
  ...[1000,2000,5000,7500,15000,25000,50000,75000,100000,150000].map(target=>({id:`coins-extra-${target}`,title:`${target.toLocaleString()} Coin Vault`,description:`Hold ${target.toLocaleString()} coins`,earned:(s)=>(s.coins??0)>=target})),
  ...[5,15,25,40,60,80,100,125,150,175,200,250].map(target=>({id:`textbook-extra-${target}`,title:`${target} Textbook Sections`,description:`Make progress in ${target} textbook sections`,earned:(s)=>Object.keys(s.textbookProgress??{}).length>=target})),
  ...[10,20,30,40,50,60,75,90,110,130].map(target=>({id:`locker-extra-${target}`,title:`Locker ${target}`,description:`Own ${target} cosmetic rewards`,earned:(s)=>(s.ownedCosmetics?.length??0)>=target})),
  ...[2,5,10,20,30,50,75,100].map(target=>({id:`goals-extra-${target}`,title:`Goal Hunter ${target}`,description:`Complete ${target} learning goals`,earned:(s)=>(s.goals??[]).filter(g=>g?.completed||g?.status==='completed').length>=target})),
  ...[5,10,20,30,50,75,100,150].map(target=>({id:`challenge-extra-${target}`,title:`Challenge Run ${target}`,description:`Complete ${target} challenge runs`,earned:(s)=>(s.challengeHistory?.length??0)>=target})),
  ...[5,10,20,30,40,50,60].map(target=>({id:`level-extra-${target}`,title:`Level ${target}`,description:`Reach MathsExpress Level ${target}`,earned:(s)=>levelFromXp(s.xp??0)>=target})),
  ...[10000,20000,35000,50000,75000,100000].map(target=>({id:`drive-extra-${target}`,title:`Road Score ${target.toLocaleString()}`,description:`Reach ${target.toLocaleString()} in Maths Drive`,earned:(s)=>(s.drivingHighScore??0)>=target})),
  { id:'secret-perfect-50', title:'???', secretTitle:'Perfect Fifty', description:'Secret badge: get at least 50 answers with 100% accuracy', earned:(s)=>(s.stats?.answered??0)>=50&&(s.stats?.correct??0)===(s.stats?.answered??0) },
  { id:'secret-night-owl', title:'???', secretTitle:'Night Owl', description:'Secret badge: complete a late study session', earned:(s)=>(s.secretFlags?.nightOwl??false) },
  { id:'secret-early-bird', title:'???', secretTitle:'Early Bird', description:'Secret badge: complete an early study session', earned:(s)=>(s.secretFlags?.earlyBird??false) },
  { id:'secret-comeback', title:'???', secretTitle:'Comeback Kid', description:'Secret badge: recover after a difficult run', earned:(s)=>(s.secretFlags?.comeback??false) },
];
function xpForLevel(level) {
  const safeLevel = Math.max(1, Math.floor(Number(level) || 1));
  return 100 * (safeLevel - 1) ** 2;
}
function levelFromXp(xp) {
  const safeXp = Math.max(0, Number(xp) || 0);
  return Math.floor(Math.sqrt(safeXp / 100)) + 1;
}
function getTopicMastery(state, topic) {
  const value = Number(state?.mastery?.[topic]);
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
}
function createQuestState() {
  return Object.fromEntries(
    Object.values(QUEST_DEFINITIONS).map((quest) => [quest.id, {
      progress: 0,
      target: quest.target,
      complete: false,
      claimed: false,
    }]),
  );
}
function completeQuestProgress(state, key, amount = 1) {
  const definition = QUEST_DEFINITIONS[key];
  if (!definition) return state;
  const existing = state.quests?.[key] ?? { progress: 0, target: definition.target, complete: false, claimed: false };
  const target = definition.target;
  const progress = Math.min(target, Math.max(0, Number(existing.progress) || 0) + Math.max(0, Number(amount) || 0));
  return {
    ...state,
    quests: {
      ...(state.quests ?? createQuestState()),
      [key]: { ...existing, target, progress, complete: progress >= target },
    },
  };
}

function applyQuestMetrics(state, { answered = 0, correct = 0, xp = 0 } = {}) {
  let next = state;
  if (answered) next = completeQuestProgress(next, 'answer-5', answered);
  if (correct) next = completeQuestProgress(next, 'correct-3', correct);
  if (xp) next = completeQuestProgress(next, 'earn-40-xp', xp);
  return next;
}
function evaluateAchievements(state) {
  const existing = new Set(state.achievements ?? []);
  for (const achievement of ACHIEVEMENTS) {
    if (achievement.earned(state)) existing.add(achievement.id);
  }
  return { ...state, achievements: [...existing] };
}
function applyQuestionResult(state, event) {
  const eventId = String(event?.eventId ?? '');
  if (!eventId) throw new Error('Question result requires eventId');
  const rewarded = new Set(state.rewardedEvents ?? []);
  if (rewarded.has(eventId)) return state;

  const correct = Boolean(event.correct);
  const difficulty = Math.max(1, Math.min(3, Number(event.difficulty) || 1));
  const xpGain = correct ? Math.max(0, Number(event.xp) || 0) : 0;
  const coinGain = correct ? 1 : 0;
  const masteryGain = correct ? difficulty * 3 : 0;
  const topic = event.topic ?? 'algebra';

  const lessonId = event.lessonId ? String(event.lessonId) : null;
  const lessonMastery = lessonId
    ? {
        ...(state.lessonMastery ?? {}),
        [lessonId]: Math.min(100, Math.max(0, Number(state.lessonMastery?.[lessonId]) || 0) + masteryGain),
      }
    : { ...(state.lessonMastery ?? {}) };

  let next = {
    ...state,
    xp: Math.max(0, Number(state.xp) || 0) + xpGain,
    coins: Math.max(0, Number(state.coins) || 0) + coinGain,
    mastery: {
      ...(state.mastery ?? {}),
      [topic]: Math.min(100, getTopicMastery(state, topic) + masteryGain),
    },
    lessonMastery,
    stats: {
      answered: (state.stats?.answered ?? 0) + 1,
      correct: (state.stats?.correct ?? 0) + (correct ? 1 : 0),
    },
    rewardedEvents: [...rewarded, eventId],
  };

  next = applyQuestMetrics(next, { answered: event.firstAttempt===false?0:1, correct: correct ? 1 : 0, xp: xpGain });
  return evaluateAchievements(next);
}
function touchDailyStreak(state, todayString) {
  const today = typeof todayString === 'string' ? todayString : new Date().toISOString().slice(0, 10);
  if (state.lastActiveDate === today) return state;

  let streak = 1;
  if (state.lastActiveDate) {
    const previous = new Date(`${state.lastActiveDate}T00:00:00Z`);
    const current = new Date(`${today}T00:00:00Z`);
    const diffDays = Math.round((current - previous) / 86400000);
    if (diffDays === 1) streak = Math.max(1, Number(state.streak) || 1) + 1;
  }

  return { ...state, streak, lastActiveDate: today };
}

return {QUEST_DEFINITIONS,ACHIEVEMENTS,xpForLevel,levelFromXp,getTopicMastery,createQuestState,completeQuestProgress,evaluateAchievements,applyQuestionResult,touchDailyStreak};
})();
// module: src/core/inventory.js
__modules["src/core/inventory.js"]=(()=>{
const COSMETICS = [
  { id: 'outfit-rift-runner', category: 'outfit', name: 'MathsExpress Student', price: 0, icon: '🧥', description: 'Starter MathsExpress outfit.', previewStyle:'background:linear-gradient(160deg,#4b63d3,#2e3b86)' },
  { id: 'outfit-royal-scholar', category: 'outfit', name: 'Royal Scholar', price: 120, icon: '👑', description: 'A sharp academy coat with gold trim.', previewStyle:'background:linear-gradient(160deg,#f1cc62,#5f4a9c)' },
  { id: 'outfit-shadow-mage', category: 'outfit', name: 'Shadow Mage', price: 220, icon: '🧙', description: 'Dark study robes with glowing algebra symbols.', previewStyle:'background:linear-gradient(160deg,#7c5cff,#33275f)' },
  { id: 'outfit-neon-coder', category: 'outfit', name: 'Neon Coder', price: 300, icon: '💻', description: 'A bright tech jacket for late-night problem solving.', previewStyle:'background:linear-gradient(160deg,#00d8c8,#203a8f)' },
  { id: 'outfit-space-mathematician', category: 'outfit', name: 'Space Mathematician', price: 420, icon: '🚀', description: 'A space suit made for calculations beyond Earth.', previewStyle:'background:linear-gradient(160deg,#d9e8ff,#4e62a5)' },
  { id: 'outfit-football-pro', category: 'outfit', name: 'Football Pro', price: 350, icon: '⚽', description: 'A sporty kit for fast practice sessions.', previewStyle:'background:linear-gradient(160deg,#34a853,#183d27)' },
  { id: 'outfit-fire', category: 'outfit', name: 'Fire Formula', price: 500, icon: '🔥', description: 'A fiery outfit for long streaks.', previewStyle:'background:linear-gradient(160deg,#ff9f43,#c0392b)' },
  { id: 'outfit-ice', category: 'outfit', name: 'Ice Solver', price: 500, icon: '❄️', description: 'A cool blue outfit for calm working.', previewStyle:'background:linear-gradient(160deg,#b9f2ff,#2f6fca)' },
  { id: 'outfit-galaxy', category: 'outfit', name: 'Galaxy Genius', price: 700, icon: '🌌', description: 'A rare cosmic outfit with deep-space colours.', previewStyle:'background:linear-gradient(160deg,#6d4aff,#1a103b)' },
  { id: 'outfit-gold', category: 'outfit', name: 'Golden Graduate', price: 900, icon: '🏅', description: 'A premium gold outfit for major milestones.', previewStyle:'background:linear-gradient(160deg,#ffd86b,#a56b00)' },
  { id: 'outfit-diamond', category: 'outfit', name: 'Diamond Mind', price: 1400, icon: '💎', description: 'A high-tier crystalline outfit.', previewStyle:'background:linear-gradient(160deg,#d8fbff,#4aa5c8)' },
  { id: 'outfit-owner-red', category: 'outfit', name: 'Crimson Scholar', price: 650, icon: '♦', description: 'A bold crimson academy uniform.', previewStyle:'background:linear-gradient(160deg,#f25f5c,#6d1822)' },
  { id: 'outfit-cyber-ninja', category: 'outfit', name: 'Cyber Ninja', price: 800, icon: '🥷', description: 'A futuristic stealth outfit with neon details.', previewStyle:'background:linear-gradient(160deg,#28e0c4,#17213f)' },
  { id: 'outfit-ocean-explorer', category: 'outfit', name: 'Ocean Explorer', price: 550, icon: '🌊', description: 'Deep-blue gear for exploring tricky problems.', previewStyle:'background:linear-gradient(160deg,#5bd6ff,#145a91)' },
  { id: 'outfit-desert-ranger', category: 'outfit', name: 'Desert Ranger', price: 550, icon: '🏜️', description: 'Warm desert colours for steady problem solving.', previewStyle:'background:linear-gradient(160deg,#e7bc73,#8b5e34)' },
  { id: 'outfit-forest-scholar', category: 'outfit', name: 'Forest Scholar', price: 450, icon: '🌲', description: 'A green study outfit inspired by the outdoors.', previewStyle:'background:linear-gradient(160deg,#67c587,#21543a)' },
  { id: 'outfit-retro-gamer', category: 'outfit', name: 'Retro Gamer', price: 600, icon: '🕹️', description: 'Pixel-era colours for game-time fans.', previewStyle:'background:linear-gradient(160deg,#f36fd4,#5c46b8)' },
  { id: 'outfit-formula-racer', category: 'outfit', name: 'Formula Racer', price: 650, icon: '🏎️', description: 'A racing suit for speedy maths practice.', previewStyle:'background:linear-gradient(160deg,#ff665a,#20293b)' },
  { id: 'outfit-chess-master', category: 'outfit', name: 'Chess Master', price: 700, icon: '♟️', description: 'Classic black-and-white strategy style.', previewStyle:'background:linear-gradient(160deg,#f3f3f3,#32343d)' },
  { id: 'outfit-pixel-hero', category: 'outfit', name: 'Pixel Hero', price: 500, icon: '👾', description: 'Blocky arcade colours for creative learners.', previewStyle:'background:linear-gradient(160deg,#8ee36b,#5240a8)' },
  { id: 'outfit-solar-champion', category: 'outfit', name: 'Solar Champion', price: 850, icon: '☀️', description: 'A bright solar outfit for high-achieving students.', previewStyle:'background:linear-gradient(160deg,#ffe477,#eb8f32)' },
  { id: 'outfit-lunar-scholar', category: 'outfit', name: 'Lunar Scholar', price: 850, icon: '🌙', description: 'A calm moonlit outfit for focused revision.', previewStyle:'background:linear-gradient(160deg,#b9c8ff,#3f497b)' },
  { id: 'outfit-storm-solver', category: 'outfit', name: 'Storm Solver', price: 950, icon: '⛈️', description: 'Electric storm colours for advanced challenges.', previewStyle:'background:linear-gradient(160deg,#8cc8ff,#49406f)' },
  { id: 'outfit-ultimate-legend', category: 'outfit', name: 'Ultimate Legend', price: 2000, icon: '🏆', description: 'The rarest MathsExpress outfit for dedicated learners.', previewStyle:'background:linear-gradient(160deg,#fff0a6,#8d58c7)' },
  { id: 'name-glow', category: 'nameEffect', name: 'Glow Name', price: 90, icon: '💫', description: 'Adds a soft glow to your player name.', cssClass:'name-glow' },
  { id: 'name-rainbow', category: 'nameEffect', name: 'Prism Name', price: 250, icon: '🌈', description: 'Animated prism name effect.', cssClass:'name-prism' },
  { id: 'name-fire', category: 'nameEffect', name: 'Flame Name', price: 320, icon: '🔥', description: 'Warm glowing name effect.', cssClass:'name-fire' },
  { id: 'name-ice', category: 'nameEffect', name: 'Frost Name', price: 320, icon: '❄️', description: 'Cool icy name effect.', cssClass:'name-ice' },
  { id: 'name-gold', category: 'nameEffect', name: 'Gold Name', price: 450, icon: '✨', description: 'Premium golden player name.', cssClass:'name-gold' },
  { id: 'name-shadow', category: 'nameEffect', name: 'Shadow Name', price: 380, icon: '🌑', description: 'Dark shadowed text effect.', cssClass:'name-shadow' },
  { id: 'name-electric', category: 'nameEffect', name: 'Electric Name', price: 500, icon: '⚡', description: 'A bright electric name effect.', cssClass:'name-electric' },
  { id: 'name-galaxy', category: 'nameEffect', name: 'Galaxy Name', price: 750, icon: '🪐', description: 'Animated cosmic gradient name.', cssClass:'name-galaxy' },
  { id: 'name-diamond', category: 'nameEffect', name: 'Diamond Name', price: 1000, icon: '💎', description: 'A rare bright crystal name style.', cssClass:'name-diamond' },
  ...['Fox','Panda','Axolotl','Robot','Dragon','Koala','Penguin','Owl','Tiger','Dolphin','Wolf','Bee','Frog','Cat','Dog','Phoenix','Turtle','Red Panda'].map((name,i)=>({id:`pet-${name.toLowerCase().replaceAll(' ','-')}`,category:'pet',name:`${name} Study Pet`,price:180+i*55,icon:['🦊','🐼','🦎','🤖','🐉','🐨','🐧','🦉','🐯','🐬','🐺','🐝','🐸','🐱','🐶','🔥','🐢','🐾'][i],description:`A ${name.toLowerCase()} companion for your MathsExpress profile.`})),
  ...['Bronze','Silver','Gold','Emerald','Sapphire','Ruby','Amethyst','Diamond','Galaxy','Solar','Lunar','Neon'].map((name,i)=>({id:`frame-${name.toLowerCase()}`,category:'frame',name:`${name} Profile Frame`,price:120+i*90,icon:'▣',description:`A ${name.toLowerCase()} frame around your profile avatar.`})),
  ...['Notebook','Grid Paper','Night Sky','Ocean','Forest','Desert','Arcade','Circuit','Galaxy','Stadium','Mountain','Aurora'].map((name,i)=>({id:`background-${name.toLowerCase().replaceAll(' ','-')}`,category:'background',name:`${name} Background`,price:160+i*80,icon:'▧',description:`A ${name.toLowerCase()} profile and locker background.`})),
  ...['Rookie Solver','Algebra Ace','Geometry Guru','Number Ninja','Data Detective','Probability Pro','Equation Expert','Revision Ranger','Streak Star','Mastery Mentor','Maths Champion','Ultimate Scholar'].map((name,i)=>({id:`title-${name.toLowerCase().replaceAll(' ','-')}`,category:'title',name,price:100+i*100,icon:'★',description:`Display the title “${name}” beside your name.`})),
  ...['Classic','Graphite','Mint','Sunset','Ocean','Lavender','Midnight','Solar','Arcade','Forest'].map((name,i)=>({id:`theme-${name.toLowerCase()}`,category:'theme',name:`${name} Theme`,price:i===0?0:220+i*95,icon:'◫',description:`A ${name.toLowerCase()} MathsExpress dashboard theme.`})),
  ...['City Racer','Desert Rally','Night Drift','Snow Sprint','Beach Cruiser','Cyber Racer','Formula Maths','Rocket Kart','Retro Pixel','Champion Gold'].map((name,i)=>({id:`game-skin-${name.toLowerCase().replaceAll(' ','-')}`,category:'gameSkin',name,price:200+i*140,icon:'🏎️',description:`A cosmetic vehicle skin for MathsExpress games.`})),
  ...['Student Blue','Scholar Green','Problem Purple','Graph Orange','Data Teal','Geometry Red','Night Navy','Gold Legend','Pixel Lime','Galaxy Violet'].map((name,i)=>({id:`avatar-${name.toLowerCase().replaceAll(' ','-')}`,category:'avatar',name:`${name} Avatar`,price:90+i*65,icon:'●',description:`A profile avatar style called ${name}.`})),
];
function getCosmeticById(itemId) {
  return COSMETICS.find((item) => item.id === itemId) ?? null;
}
function purchaseCosmetic(state, itemId) {
  const item = getCosmeticById(itemId);
  if (!item) return { ok: false, reason: 'not-found', state };
  const owned = new Set(state.ownedCosmetics ?? []);
  if (owned.has(itemId)) return { ok: false, reason: 'already-owned', state };
  const coins = Math.max(0, Number(state.coins) || 0);
  if (coins < item.price) return { ok: false, reason: 'insufficient-coins', state };
  owned.add(itemId);
  return {
    ok: true,
    state: {
      ...state,
      coins: coins - item.price,
      ownedCosmetics: [...owned],
    },
  };
}
function equipCosmetic(state, itemId) {
  const item = getCosmeticById(itemId);
  if (!item) return { ok: false, reason: 'not-found', state };
  if (!(state.ownedCosmetics ?? []).includes(itemId)) return { ok: false, reason: 'not-owned', state };
  return {
    ok: true,
    state: {
      ...state,
      equipped: {
        ...(state.equipped ?? {}),
        [item.category]: itemId,
      },
    },
  };
}
function getEquippedCosmetic(state, category) {
  const id = state?.equipped?.[category];
  return id ? getCosmeticById(id) : null;
}

return {COSMETICS,getCosmeticById,purchaseCosmetic,equipCosmetic,getEquippedCosmetic};
})();
// module: src/core/persistence.js
__modules["src/core/persistence.js"]=(()=>{
const {createQuestState}=__modules["src/core/progression.js"];
const {COSMETICS}=__modules["src/core/inventory.js"];
const STORAGE_KEY = 'mathrift.player.v1';

const STARTER_IDS = ['outfit-rift-runner'];
const EQUIP_CATEGORIES = ['outfit','nameEffect','pet','frame','background','title','theme','gameSkin','avatar'];
function createDefaultState() {
  return {
    version: 1,
    playerName: 'MathsExpress Student',
    xp: 0,
    coins: 100,
    streak: 1,
    lastActiveDate: null,
    mastery: { algebra: 0 },
    lessonMastery: { simplify: 0, expand: 0, linear: 0, substitution: 0 },
    stats: { answered: 0, correct: 0 },
    quests: createQuestState(),
    achievements: [],
    ownedCosmetics: [...STARTER_IDS],
    equipped: {
      outfit: 'outfit-rift-runner',
      nameEffect: null,
      pet: null, frame: null, background: null, title: null, theme: null, gameSkin: null, avatar: null,
    },
    rewardedEvents: [],
    gameTimeSeconds: 0,
    gameTimeRewardedQuestions: [],
    drivingHighScore: 0,
    luckyBoxRewards: [],
    challengeHistory: [],
    mistakeBook: [],
    goals: [],
    favoriteQuestionIds: [],
    customQuestions: [],
    customWorksheets: [],
    notifications: [],
    calendarItems: [],
    featureFlags: {},
    accessibilityPrefs: { darkMode:false, highContrast:false, largeText:false, reducedMotion:false, dyslexiaFriendly:false, readAloud:false },
    drivingSettings: { track:'city', mode:'classic' },
    drivingQuestionHistory: {},
    ownedDrivingTracks: ['city'],
    updateNotesSeen: [],
    suggestionVotes: {},
    textbookBookmarks: [],
    textbookProgress: {},
    textbookLastSection: '',
    textbookNotes: {},
    diagnosticHistory: [],
    skillCheckInHistory: [],
    skillCheckInSchedule: {},
    personalLearningPath: [],
    confidenceAttempts: [],
    notebookPages: [],
    flashcards: [],
    activeStudySession: null,
    recycleBin: [],
    localAuditLog: [],
    errorLogs: [],
    focusMode: false,
    dashboardLayout: [],
    preferredLanguage: 'en',
    gameSchedule: { allowedDays:['Friday'], start:'12:00', end:'15:30', dailyCapMinutes:20 },
    skillMasteryMap: {},
    spacedReviews: [],
    plannerTasks: [],
    weeklyGoalQuestions: 30,
    weeklyQuestionsCompleted: 0,
    prestige: 0,
    studentMessages: [],
    gameStats: {},
    reportHistory: [],
    parentSettings: { weeklySummary:true, assignmentAlerts:true, teacherMessages:true },
    secretFlags: {},
    learningPathYear: 9,
    ownerSettings: { maintenanceMode:false, maintenanceMessage:'MathsExpress is being updated. Please try again soon.', broadcastTitle:'', broadcastBody:'', updatedAt:'' },
    onboardingComplete: false,
    // Newer feature state. These defaults stop newer tools from resetting after every save.
    challengeWins: 0,
    teacherFeedback: [],
    schoolBranding: {},
    masteryYearScopeMigratedV86: false,
    workbookMultiplier: 1,
    workbookQuestionStreak: 0,
    v7BestWork: [],
    v7BugDrafts: [],
    v7Changelog: [],
    v7CustomQuestions: [],
    v7DiagnosticHistory: [],
    v7ImportedQuestions: [],
    v7LastPuzzleDate: '',
    v7PendingCopilotPlan: null,
    v7PuzzleStreak: 0,
    v7QuestionAttempts: [],
    v7ReportDrafts: [],
    v7SeasonProgress: {},
    v7Teams: [],
  };
}

function nonNegativeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? Math.max(0, num) : fallback;
}

function safeStringArray(value) {
  return Array.isArray(value) ? value.filter((entry) => typeof entry === 'string') : [];
}
function sanitizeState(candidate) {
  const defaults = createDefaultState();
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return defaults;
  const validCosmeticIds = new Set(COSMETICS.map((item) => item.id));
  const owned = new Set([
    ...STARTER_IDS,
    ...safeStringArray(candidate.ownedCosmetics).filter((id) => validCosmeticIds.has(id)),
  ]);

  const equipped = { ...defaults.equipped };
  for (const category of EQUIP_CATEGORIES) {
    const id = candidate.equipped?.[category];
    const item = COSMETICS.find((entry) => entry.id === id && entry.category === category);
    if (item && owned.has(item.id)) equipped[category] = item.id;
    if (id === null && category !== 'outfit') equipped[category] = null;
  }

  const quests = createQuestState();
  for (const [key, quest] of Object.entries(quests)) {
    const source = candidate.quests?.[key];
    if (!source || typeof source !== 'object') continue;
    const progress = Math.min(quest.target, nonNegativeNumber(source.progress, 0));
    quests[key] = {
      ...quest,
      progress,
      complete: progress >= quest.target,
      claimed: Boolean(source.claimed),
    };
  }

  return {
    // Keep newer JSON state fields instead of silently deleting them when an older
    // sanitizer does not yet know about the feature. Core fields below are still
    // validated and clamped before they are saved.
    ...defaults,
    ...candidate,
    version: 2,
    playerName: typeof candidate.playerName === 'string' && candidate.playerName.trim()
      ? candidate.playerName.trim().slice(0, 24)
      : defaults.playerName,
    xp: nonNegativeNumber(candidate.xp, 0),
    coins: nonNegativeNumber(candidate.coins, 0),
    streak: Math.max(1, Math.floor(nonNegativeNumber(candidate.streak, 1))),
    lastActiveDate: typeof candidate.lastActiveDate === 'string' ? candidate.lastActiveDate : null,
    mastery: {
      algebra: Math.min(100, nonNegativeNumber(candidate.mastery?.algebra, 0)),
    },
    lessonMastery: {
      simplify: Math.min(100, nonNegativeNumber(candidate.lessonMastery?.simplify, 0)),
      expand: Math.min(100, nonNegativeNumber(candidate.lessonMastery?.expand, 0)),
      linear: Math.min(100, nonNegativeNumber(candidate.lessonMastery?.linear, 0)),
      substitution: Math.min(100, nonNegativeNumber(candidate.lessonMastery?.substitution, 0)),
    },
    stats: {
      answered: Math.floor(nonNegativeNumber(candidate.stats?.answered, 0)),
      correct: Math.floor(nonNegativeNumber(candidate.stats?.correct, 0)),
    },
    quests,
    achievements: safeStringArray(candidate.achievements),
    ownedCosmetics: [...owned],
    equipped,
    rewardedEvents: safeStringArray(candidate.rewardedEvents).slice(-500),
    gameTimeSeconds: Math.min(300, Math.floor(nonNegativeNumber(candidate.gameTimeSeconds, 0))),
    gameTimeRewardedQuestions: safeStringArray(candidate.gameTimeRewardedQuestions).slice(-2000),
    drivingHighScore: Math.floor(nonNegativeNumber(candidate.drivingHighScore, 0)),
    luckyBoxRewards: Array.isArray(candidate.luckyBoxRewards) ? candidate.luckyBoxRewards.slice(-100) : [],
    challengeHistory: Array.isArray(candidate.challengeHistory) ? candidate.challengeHistory.slice(-50) : [],
    mistakeBook: Array.isArray(candidate.mistakeBook) ? candidate.mistakeBook.slice(-500) : [],
    goals: Array.isArray(candidate.goals) ? candidate.goals.slice(-50) : [],
    favoriteQuestionIds: safeStringArray(candidate.favoriteQuestionIds).slice(-1000),
    customQuestions: Array.isArray(candidate.customQuestions) ? candidate.customQuestions.slice(-500) : [],
    customWorksheets: Array.isArray(candidate.customWorksheets) ? candidate.customWorksheets.slice(-100).map(w=>({
      id:String(w?.id||'').slice(0,120), title:String(w?.title||'Custom Worksheet').slice(0,160), yearLevel:Math.max(0,Math.min(12,Number.isFinite(Number(w?.yearLevel))?Number(w.yearLevel):9)),
      createdAt:String(w?.createdAt||'').slice(0,60), questions:Array.isArray(w?.questions)?w.questions.slice(0,80):[]
    })) : [],
    notifications: Array.isArray(candidate.notifications) ? candidate.notifications.slice(-100) : [],
    calendarItems: Array.isArray(candidate.calendarItems) ? candidate.calendarItems.slice(-200) : [],
    featureFlags: candidate.featureFlags && typeof candidate.featureFlags === 'object' ? {...candidate.featureFlags} : {},
    accessibilityPrefs: {
      darkMode:Boolean(candidate.accessibilityPrefs?.darkMode), highContrast:Boolean(candidate.accessibilityPrefs?.highContrast),
      largeText:Boolean(candidate.accessibilityPrefs?.largeText), reducedMotion:Boolean(candidate.accessibilityPrefs?.reducedMotion),
      dyslexiaFriendly:Boolean(candidate.accessibilityPrefs?.dyslexiaFriendly), readAloud:Boolean(candidate.accessibilityPrefs?.readAloud),
    },
    drivingSettings: { track: typeof candidate.drivingSettings?.track === 'string' ? candidate.drivingSettings.track.slice(0,30) : 'city', mode: typeof candidate.drivingSettings?.mode === 'string' ? candidate.drivingSettings.mode.slice(0,30) : 'classic' },
    drivingQuestionHistory: candidate.drivingQuestionHistory && typeof candidate.drivingQuestionHistory==='object' && !Array.isArray(candidate.drivingQuestionHistory)
      ? Object.fromEntries(Object.entries(candidate.drivingQuestionHistory).slice(0,20).map(([k,v])=>[String(k).slice(0,8),safeStringArray(v).slice(-180).map(x=>String(x).slice(0,180))]))
      : {},
    ownedDrivingTracks: [...new Set(['city', ...safeStringArray(candidate.ownedDrivingTracks)])].slice(0,20),
    updateNotesSeen: safeStringArray(candidate.updateNotesSeen).slice(-100),
    suggestionVotes: candidate.suggestionVotes && typeof candidate.suggestionVotes === 'object' && !Array.isArray(candidate.suggestionVotes) ? {...candidate.suggestionVotes} : {},
    textbookBookmarks: safeStringArray(candidate.textbookBookmarks).slice(-500),
    textbookProgress: candidate.textbookProgress && typeof candidate.textbookProgress === 'object' && !Array.isArray(candidate.textbookProgress) ? Object.fromEntries(Object.entries(candidate.textbookProgress).slice(-1000).map(([k,v])=>[String(k).slice(0,180), Math.max(0,Math.min(100,Number(v)||0))])) : {},
    textbookLastSection: typeof candidate.textbookLastSection === 'string' ? candidate.textbookLastSection.slice(0,180) : '',
    textbookNotes: candidate.textbookNotes && typeof candidate.textbookNotes === 'object' && !Array.isArray(candidate.textbookNotes) ? Object.fromEntries(Object.entries(candidate.textbookNotes).slice(-500).map(([k,v])=>[String(k).slice(0,180), String(v??'').slice(0,3000)])) : {},
    diagnosticHistory: Array.isArray(candidate.diagnosticHistory) ? candidate.diagnosticHistory.slice(-20) : [],
    skillCheckInHistory: Array.isArray(candidate.skillCheckInHistory) ? candidate.skillCheckInHistory.slice(-100).map(x=>({skillId:String(x?.skillId||'').slice(0,120),yearLevel:Math.max(0,Math.min(12,Number(x?.yearLevel)||0)),accuracy:Math.max(0,Math.min(100,Number(x?.accuracy)||0)),completedAt:String(x?.completedAt||'').slice(0,60),nextDueAt:String(x?.nextDueAt||'').slice(0,60)})) : [],
    skillCheckInSchedule: candidate.skillCheckInSchedule && typeof candidate.skillCheckInSchedule==='object' && !Array.isArray(candidate.skillCheckInSchedule) ? Object.fromEntries(Object.entries(candidate.skillCheckInSchedule).slice(-500).map(([k,v])=>[String(k).slice(0,120),String(v||'').slice(0,60)])) : {},
    personalLearningPath: safeStringArray(candidate.personalLearningPath).slice(-500),
    confidenceAttempts: Array.isArray(candidate.confidenceAttempts) ? candidate.confidenceAttempts.slice(-500) : [],
    notebookPages: Array.isArray(candidate.notebookPages) ? candidate.notebookPages.slice(-100).map(x=>({id:String(x?.id||'').slice(0,120),title:String(x?.title||'Maths Notes').slice(0,120),body:String(x?.body||'').slice(0,12000),tags:safeStringArray(x?.tags).slice(0,20),updatedAt:String(x?.updatedAt||'').slice(0,60)})) : [],
    flashcards: Array.isArray(candidate.flashcards) ? candidate.flashcards.slice(-500).map(x=>({id:String(x?.id||'').slice(0,120),term:String(x?.term||'').slice(0,120),definition:String(x?.definition||'').slice(0,500),mastered:Boolean(x?.mastered)})) : [],
    activeStudySession: candidate.activeStudySession && typeof candidate.activeStudySession === 'object' ? {...candidate.activeStudySession} : null,
    recycleBin: Array.isArray(candidate.recycleBin) ? candidate.recycleBin.slice(-100) : [],
    localAuditLog: Array.isArray(candidate.localAuditLog) ? candidate.localAuditLog.slice(-200) : [],
    errorLogs: Array.isArray(candidate.errorLogs) ? candidate.errorLogs.slice(-200) : [],
    focusMode: Boolean(candidate.focusMode),
    dashboardLayout: Array.isArray(candidate.dashboardLayout) ? candidate.dashboardLayout.slice(0,50) : [],
    preferredLanguage: typeof candidate.preferredLanguage === 'string' ? candidate.preferredLanguage.slice(0,12) : 'en',
    gameSchedule: candidate.gameSchedule && typeof candidate.gameSchedule === 'object' ? { allowedDays:safeStringArray(candidate.gameSchedule.allowedDays).slice(0,7), start:String(candidate.gameSchedule.start||'12:00').slice(0,8), end:String(candidate.gameSchedule.end||'15:30').slice(0,8), dailyCapMinutes:Math.max(0,Math.min(180,Number(candidate.gameSchedule.dailyCapMinutes)||20)) } : { allowedDays:['Friday'], start:'12:00', end:'15:30', dailyCapMinutes:20 },
    skillMasteryMap: candidate.skillMasteryMap && typeof candidate.skillMasteryMap==='object' && !Array.isArray(candidate.skillMasteryMap) ? Object.fromEntries(Object.entries(candidate.skillMasteryMap).slice(-1000).map(([k,v])=>[String(k).slice(0,120),Math.max(0,Math.min(100,Number(v)||0))])) : {},
    spacedReviews: Array.isArray(candidate.spacedReviews) ? candidate.spacedReviews.slice(-500).map(x=>({id:String(x?.id||'').slice(0,120),skillId:String(x?.skillId||'').slice(0,120),title:String(x?.title||'Review').slice(0,160),dueAt:String(x?.dueAt||'').slice(0,60),done:Boolean(x?.done)})) : [],
    plannerTasks: Array.isArray(candidate.plannerTasks) ? candidate.plannerTasks.slice(-500).map(x=>({id:String(x?.id||'').slice(0,120),title:String(x?.title||'Task').slice(0,160),date:String(x?.date||'').slice(0,30),type:String(x?.type||'Study').slice(0,40),done:Boolean(x?.done)})) : [],
    weeklyGoalQuestions: Math.max(5,Math.min(500,Number(candidate.weeklyGoalQuestions)||30)),
    weeklyQuestionsCompleted: Math.max(0,Number(candidate.weeklyQuestionsCompleted)||0),
    prestige: Math.max(0,Math.min(1000,Math.floor(Number(candidate.prestige)||0))),
    studentMessages: Array.isArray(candidate.studentMessages) ? candidate.studentMessages.slice(-200) : [],
    gameStats: candidate.gameStats && typeof candidate.gameStats==='object' && !Array.isArray(candidate.gameStats) ? {...candidate.gameStats} : {},
    reportHistory: Array.isArray(candidate.reportHistory) ? candidate.reportHistory.slice(-100) : [],
    parentSettings: candidate.parentSettings && typeof candidate.parentSettings==='object' ? {weeklySummary:candidate.parentSettings.weeklySummary!==false,assignmentAlerts:candidate.parentSettings.assignmentAlerts!==false,teacherMessages:candidate.parentSettings.teacherMessages!==false} : {weeklySummary:true,assignmentAlerts:true,teacherMessages:true},
    secretFlags: candidate.secretFlags && typeof candidate.secretFlags==='object' && !Array.isArray(candidate.secretFlags) ? {...candidate.secretFlags} : {},
    learningPathYear: Math.max(0,Math.min(12,Number(candidate.learningPathYear)||9)),
    ownerSettings: { maintenanceMode:Boolean(candidate.ownerSettings?.maintenanceMode), maintenanceMessage: typeof candidate.ownerSettings?.maintenanceMessage === 'string' ? candidate.ownerSettings.maintenanceMessage.slice(0,240) : 'MathsExpress is being updated. Please try again soon.', broadcastTitle: typeof candidate.ownerSettings?.broadcastTitle === 'string' ? candidate.ownerSettings.broadcastTitle.slice(0,120) : '', broadcastBody: typeof candidate.ownerSettings?.broadcastBody === 'string' ? candidate.ownerSettings.broadcastBody.slice(0,1000) : '', updatedAt: typeof candidate.ownerSettings?.updatedAt === 'string' ? candidate.ownerSettings.updatedAt : '' },
    onboardingComplete: Boolean(candidate.onboardingComplete),
  };
}
function loadState(storage = globalThis.localStorage, storageKey = STORAGE_KEY) {
  try {
    const raw = storage?.getItem?.(storageKey);
    if (!raw) return createDefaultState();
    return sanitizeState(JSON.parse(raw));
  } catch {
    return createDefaultState();
  }
}
function saveState(storage = globalThis.localStorage, state, storageKey = STORAGE_KEY) {
  const safe = sanitizeState(state);
  try {
    storage?.setItem?.(storageKey, JSON.stringify(safe));
  } catch (error) {
    // A blocked/full localStorage must never stop MathsExpress from rendering.
    try { globalThis.console?.warn?.('MathsExpress could not write the local save.', error); } catch {}
  }
  return safe;
}
function resetState(storage = globalThis.localStorage, storageKey = STORAGE_KEY) {
  try { storage?.removeItem?.(storageKey); } catch {}
  return createDefaultState();
}

return {STORAGE_KEY,createDefaultState,sanitizeState,loadState,saveState,resetState};
})();
// module: src/core/auth.js
__modules["src/core/auth.js"]=(()=>{
const MX_RUNTIME_CONFIG = globalThis.MATHSEXPRESS_CONFIG || {};
const SUPABASE_URL = String(MX_RUNTIME_CONFIG.supabaseUrl || '');
const SUPABASE_PUBLISHABLE_KEY = String(MX_RUNTIME_CONFIG.supabasePublishableKey || '');
function normalizeAccountProfile(row = {}) {
  return {
    userId: String(row.user_id ?? row.userId ?? ''),
    email: String(row.email ?? '').trim().toLowerCase(),
    displayName: String(row.display_name ?? row.displayName ?? 'MathsExpress Student').trim().slice(0, 24) || 'MathsExpress Student',
    username: String(row.username ?? '').trim().toLowerCase().slice(0, 24),
    avatarUrl: String(row.avatar_url ?? row.avatarUrl ?? '').trim().slice(0, 500),
    yearLevel: Math.max(0, Math.min(12, Math.round(Number.isFinite(Number(row.year_level ?? row.yearLevel)) ? Number(row.year_level ?? row.yearLevel) : 9))),
    textbookFocus: String(row.textbook_focus ?? row.textbookFocus ?? 'Mathematics').trim().slice(0, 100) || 'Mathematics',
    accessibilityMode: Boolean(row.accessibility_mode ?? row.accessibilityMode),
    weeklyPoints: Math.max(0, Math.round(Number(row.weekly_points ?? row.weeklyPoints ?? 0) || 0)),
    semesterBest: Math.max(0, Math.round(Number(row.semester_best ?? row.semesterBest ?? 0) || 0)),
    coins: Math.max(0, Math.round(Number(row.coins ?? 0) || 0)),
    xp: Math.max(0, Math.round(Number(row.xp ?? 0) || 0)),
    gameTimeSeconds: Math.max(0, Math.min(300, Math.round(Number(row.game_time_seconds ?? row.gameTimeSeconds ?? 0) || 0))),
    inventory: row.inventory && typeof row.inventory === 'object' ? row.inventory : {},
    equipped: row.equipped_cosmetics && typeof row.equipped_cosmetics === 'object' ? row.equipped_cosmetics : {},
    role: ['player', 'parent', 'teacher', 'district_admin', 'bug_tester', 'content_editor', 'support', 'admin', 'owner'].includes(row.role) ? row.role : 'player',
    status: ['active', 'suspended', 'banned'].includes(row.status) ? row.status : 'active',
  };
}
function canUseOwnerConsole(account = {}) {
  return Boolean(account.authenticated && account.profile?.role === 'owner' && account.profile?.status === 'active');
}
function canUseTeacherHub(account = {}) {
  return Boolean(
    account.authenticated &&
    ['teacher', 'district_admin', 'admin', 'owner'].includes(account.profile?.role) &&
    account.profile?.status === 'active'
  );
}
function canUsePlatformAdmin(account = {}) {
  return Boolean(account.authenticated && ['district_admin','admin','owner'].includes(account.profile?.role) && account.profile?.status === 'active');
}
function canUseBugTools(account = {}) {
  return Boolean(account.authenticated && ['bug_tester','admin','owner'].includes(account.profile?.role) && account.profile?.status === 'active');
}
function looksLikeEducationEmail(email) {
  const value=String(email||'').trim().toLowerCase();
  const domain=value.split('@')[1]||'';
  return Boolean(domain && (domain.endsWith('.edu.au') || domain.endsWith('.edu') || domain.includes('.ac.') || domain.startsWith('education.') || domain.includes('.education.')));
}
function accountStorageKey(userId) {
  const safe = String(userId ?? '').trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80) || 'guest';
  return `mathrift.player.v1:${safe}`;
}
class MathRiftAccountClient {
  constructor(factory = null) {
    this.factory = factory;
    this.client = null;
    this.session = null;
    this.profile = null;
  }

  get authenticated() { return Boolean(this.session?.access_token && this.profile?.userId); }

  ensureClient() {
    if (this.client) return this.client;
    const factory = typeof this.factory === 'function' ? this.factory : globalThis.supabase?.createClient;
    if (typeof factory !== 'function') throw new Error('Account service could not load. Check your internet connection.');
    this.client = factory(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'mathrift-account-v1',
      },
    });
    return this.client;
  }

  async refreshProfile() {
    const client = this.ensureClient();
    const { data, error } = await client.rpc('account_get_profile');
    if (error) throw error;
    this.profile = normalizeAccountProfile(data || {});
    return this.profile;
  }

  async initialize() {
    const client = this.ensureClient();
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    this.session = data.session || null;
    if (this.session) await this.refreshProfile();
    return this.snapshot();
  }

  async signIn(login, password) {
    const client = this.ensureClient();
    const loginValue = String(login ?? '').trim().toLowerCase();
    const passwordValue = String(password ?? '');
    if (!loginValue || !passwordValue) throw new Error('Enter your email/username and password.');

    // Email logins use Supabase Auth directly. This removes the custom Edge Function
    // as a single point of failure for normal school-email sign-ins on Netlify.
    if (loginValue.includes('@')) {
      let result;
      try {
        result = await client.auth.signInWithPassword({ email: loginValue, password: passwordValue });
      } catch (networkError) {
        throw new Error('Could not reach the account service. Check your internet connection and try again.');
      }
      const { data, error } = result || {};
      if (error) {
        const message = String(error.message || '');
        if (/fetch|network|load failed|connection/i.test(message)) throw new Error('Could not reach the account service. Check your internet connection and try again.');
        throw new Error(/invalid login|invalid credentials|email not confirmed/i.test(message) ? message : 'Email or password is incorrect.');
      }
      this.session = data?.session || null;
      if (!this.session) throw new Error('Email or password is incorrect.');
      await this.refreshProfile();
      if (this.profile.status !== 'active') {
        await this.signOut();
        throw new Error(`This account is ${this.profile.status}.`);
      }
      return this.snapshot();
    }

    // Username login still uses the server-side resolver because Supabase Auth itself
    // signs in by email. Network failure here is reported clearly instead of leaking
    // the browser's generic "Failed to fetch" message.
    let loginResponse;
    try {
      loginResponse = await fetch(`${SUPABASE_URL}/functions/v1/mathsexpress-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_PUBLISHABLE_KEY },
        body: JSON.stringify({ login: loginValue, password: passwordValue }),
      });
    } catch (networkError) {
      throw new Error('Username login is temporarily unavailable. Try signing in with your email address.');
    }
    const loginPayload = await loginResponse.json().catch(() => ({}));
    if (!loginResponse.ok || !loginPayload?.access_token || !loginPayload?.refresh_token) {
      throw new Error(loginPayload?.error || 'Username/email or password is incorrect.');
    }
    const { data, error } = await client.auth.setSession({
      access_token: String(loginPayload.access_token),
      refresh_token: String(loginPayload.refresh_token),
    });
    if (error) throw error;
    this.session = data.session || null;
    await this.refreshProfile();
    if (this.profile.status !== 'active') {
      await this.signOut();
      throw new Error(`This account is ${this.profile.status}.`);
    }
    return this.snapshot();
  }


  authRedirectUrl() {
    try {
      const loc=globalThis.location;
      if (!loc?.origin || loc.origin === 'null') return undefined;
      return `${loc.origin}${loc.pathname || '/'}?auth=confirmed`;
    } catch { return undefined; }
  }

  async resendSignupVerification(email) {
    const normalizedEmail=String(email??'').trim().toLowerCase();
    if (!normalizedEmail) throw new Error('Enter your school email first.');
    const options={};
    const redirectTo=this.authRedirectUrl();
    if (redirectTo) options.emailRedirectTo=redirectTo;
    const { error }=await this.ensureClient().auth.resend({type:'signup',email:normalizedEmail,options});
    if (error) throw error;
    return true;
  }

  async signUp(email, password, displayName, accountType = 'student') {
    const client = this.ensureClient();
    const normalizedEmail = String(email ?? '').trim().toLowerCase();
    const passwordValue = String(password ?? '');
    const safeDisplayName = String(displayName ?? '').trim().slice(0, 40);
    const requestedAccountType = String(accountType || 'student') === 'teacher' ? 'teacher' : 'student';
    if (!normalizedEmail || !normalizedEmail.includes('@')) throw new Error('Enter a valid email address.');
    if (passwordValue.length < 10) throw new Error('Password must be at least 10 characters.');

    // Pre-check against the same allow-list the signup trigger enforces server-side.
    // Without this, a disallowed email fails deep inside a Postgres trigger and
    // Supabase Auth surfaces only a generic "Database error saving new user" —
    // this gives an instant, honest message instead, before any account is created.
    try {
      const { data: allowed, error: allowedError } = await client.rpc('mathsexpress_is_signup_email_allowed', { p_email: normalizedEmail });
      if (!allowedError && allowed === false) {
        throw new Error('Use an approved school/education email or an invited guardian email.');
      }
    } catch (precheckError) {
      if (precheckError instanceof Error && /approved school/i.test(precheckError.message)) throw precheckError;
      // Any other pre-check failure (offline, RPC unavailable) is non-fatal — fall through to the real signup call.
    }

    const successResult = async (data = {}) => {
      this.session = data?.session || null;
      if (this.session) {
        await this.refreshProfile();
        return { ...this.snapshot(), needsConfirmation:false };
      }
      this.profile = null;
      return {
        authenticated:false,
        profile:null,
        session:null,
        needsConfirmation:true,
        email:normalizedEmail,
        message:'Account created. Check your school email to verify it. You will not need to enter your details again.'
      };
    };

    // Primary route: Supabase Auth directly. This is the standard signup path and
    // does not depend on a Cloudflare Worker or a custom Edge Function being deployed.
    let directNetworkFailure = false;
    try {
      const result = await client.auth.signUp({
        email: normalizedEmail,
        password: passwordValue,
        options: {
          data: {
            display_name: safeDisplayName,
            requested_account_type: requestedAccountType,
          },
          ...(this.authRedirectUrl()?{emailRedirectTo:this.authRedirectUrl()}:{}),
        },
      });
      const { data, error } = result || {};
      if (!error) return await successResult(data || {});

      const message = String(error.message || '');
      if (/already registered|already exists|user already/i.test(message)) {
        throw new Error('An account already exists for this email. Use Log in or reset the password.');
      }
      if (/approved school|education email|guardian/i.test(message)) {
        throw new Error('Use an approved school or education email.');
      }
      if (/database error saving new user/i.test(message)) {
        throw new Error('This email is not on an approved school/education domain, or the account could not be created. Use an approved school email or ask your teacher to invite you.');
      }
      if (!/failed to fetch|fetch|network|load failed|connection|timeout/i.test(message)) {
        throw new Error(message || 'Could not create account.');
      }
      directNetworkFailure = true;
    } catch (error) {
      const message = String(error?.message || '');
      if (!/failed to fetch|fetch|network|load failed|connection|timeout|account service/i.test(message)) throw error;
      directNetworkFailure = true;
    }

    // Backup route: same-origin Cloudflare proxy. This helps on school networks that
    // block direct browser requests to Supabase. The proxy talks to Supabase Auth REST
    // directly, not to another custom Edge Function.
    if (directNetworkFailure) {
      let response;
      try {
        response = await fetch('/api/signup', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            email:normalizedEmail,
            password:passwordValue,
            displayName:safeDisplayName,
            accountType:requestedAccountType,
          }),
        });
      } catch {
        throw new Error('Could not reach the account service. Try again on another network or refresh the page.');
      }

      const raw = await response.text().catch(() => '');
      let payload = {};
      try { payload = raw ? JSON.parse(raw) : {}; } catch {}
      if (!response.ok) {
        const message = String(payload?.error || payload?.message || raw || '').trim();
        if (/already registered|already exists|user already/i.test(message)) throw new Error('An account already exists for this email. Use Log in or reset the password.');
        if (/approved school|education email|guardian/i.test(message)) throw new Error('Use an approved school or education email.');
        throw new Error(message || `Could not create account (server ${response.status}).`);
      }

      if (payload?.access_token && payload?.refresh_token) {
        const { data, error } = await client.auth.setSession({
          access_token:String(payload.access_token),
          refresh_token:String(payload.refresh_token),
        });
        if (error) throw error;
        return await successResult(data || {});
      }
      return await successResult({ session:null });
    }

    throw new Error('Could not create account.');
  }

  async signOut() {
    try { await this.ensureClient().auth.signOut({ scope: 'local' }); }
    finally { this.session = null; this.profile = null; }
  }

  async resetPassword(email) {
    const { error } = await this.ensureClient().auth.resetPasswordForEmail(String(email ?? '').trim().toLowerCase());
    if (error) throw error;
  }

  async changePassword(newPassword, currentPassword = '') {
    const payload = { password: String(newPassword ?? '') };
    if (currentPassword) payload.currentPassword = String(currentPassword);
    const { error } = await this.ensureClient().auth.updateUser(payload);
    if (error) throw error;
    return true;
  }

  async updateProfileSettings({ username = null, avatarUrl = null, yearLevel = null, textbookFocus = null, accessibilityMode = null } = {}) {
    const { data, error } = await this.ensureClient().rpc('mathrift_update_profile_settings', {
      p_username: username, p_avatar_url: avatarUrl, p_year_level: yearLevel, p_textbook_focus: textbookFocus, p_accessibility: accessibilityMode,
    });
    if (error) throw error;
    this.profile = normalizeAccountProfile(data || {});
    return this.profile;
  }

  snapshot() {
    return { authenticated: this.authenticated, session: this.session, profile: this.profile };
  }
}

return {normalizeAccountProfile,canUseOwnerConsole,canUseTeacherHub,canUsePlatformAdmin,canUseBugTools,looksLikeEducationEmail,accountStorageKey,MathRiftAccountClient};
})();
// module: src/core/school.js
__modules["src/core/school.js"]=(()=>{
const SCHOOL_STAFF_ROLES = Object.freeze(['principal', 'deputy_principal', 'head_teacher', 'year_coordinator', 'teacher']);
const SCHOOL_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const CLASS_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ASSIGNMENT_TYPES = new Set(['practice','custom','adaptive','lesson','worksheet','test','readiness','discovery-checkin','skills-checkin','skill-check','recommended','revision','template','tutorial','bulk-custom','bulk-adaptive','template-sequence','topic-test','self-directed-adaptive']);
const DIFFICULTIES = new Set(['easy', 'medium', 'hard', 'adaptive', 'mixed']);

const clamp = (value, min, max) => Math.max(min, Math.min(max, Number.isFinite(Number(value)) ? Number(value) : min));
const cleanText = (value, max = 80) => String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, max);
function normalizeSchoolCode(value) {
  return String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
}
function generateSchoolCode(random = Math.random) {
  let code = '';
  for (let i = 0; i < 8; i += 1) {
    const index = Math.max(0, Math.min(SCHOOL_CODE_ALPHABET.length - 1, Math.floor(Number(random()) * SCHOOL_CODE_ALPHABET.length)));
    code += SCHOOL_CODE_ALPHABET[index];
  }
  return code;
}
function normalizeSchool(input = {}) {
  const yearLevels = [...new Set((Array.isArray(input.yearLevels) ? input.yearLevels : [0,1,2,3,4,5,6,7,8,9,10,11,12])
    .map((value) => Math.floor(Number(value)))
    .filter((value) => value >= 3 && value <= 12))].sort((a,b) => a-b);
  return {
    id: input.id ? String(input.id) : '',
    name: cleanText(input.name || 'MathsExpress School', 100) || 'MathsExpress School',
    displayName: cleanText(input.displayName || input.name || 'MathsExpress School', 100) || 'MathsExpress School',
    code: normalizeSchoolCode(input.code),
    country: cleanText(input.country || '', 60),
    region: cleanText(input.region || '', 60),
    curriculum: cleanText(input.curriculum || 'NSW', 80) || 'NSW',
    yearLevels: yearLevels.length ? yearLevels : [0,1,2,3,4,5,6,7,8,9,10,11,12],
    archived: Boolean(input.archived),
  };
}
function schoolCapabilitiesForRole(role = '') {
  const normalized = String(role || '').toLowerCase();
  const owner = normalized === 'owner';
  const principal = normalized === 'principal' || owner;
  const deputy = normalized === 'deputy_principal' || principal;
  const head = normalized === 'head_teacher' || deputy;
  const coordinator = normalized === 'year_coordinator' || head;
  const teacher = normalized === 'teacher' || coordinator;
  return Object.freeze({
    viewSchool: teacher || owner,
    createClasses: teacher || owner,
    manageClasses: coordinator || owner,
    manageAssignments: teacher || owner,
    viewSchoolReports: head || owner,
    manageStudents: coordinator || owner,
    manageStaff: head || owner,
    manageLeadership: deputy || owner,
    editSchool: deputy || owner,
    deleteSchool: principal && !normalized.includes('deputy') || owner,
  });
}
function buildClassPayload(input = {}) {
  const schoolId = String(input.schoolId || '').trim();
  if (!schoolId) throw new Error('Choose or create a school before creating a class.');
  return {
    school_id: schoolId,
    name: cleanText(input.name || 'Maths Class', 80) || 'Maths Class',
    year_level: Math.floor(clamp(input.yearLevel ?? 9, 0, 12)),
    join_code: normalizeClassCode(input.joinCode) || generateClassCode(),
  };
}
function capabilitiesForRole(role = 'player') {
  const teacher = role === 'teacher' || role === 'owner';
  const owner = role === 'owner';
  return Object.freeze({
    joinClasses: true,
    viewOwnAssignments: true,
    createClasses: teacher,
    manageClasses: teacher,
    createAssignments: teacher,
    viewClassReports: teacher,
    launchClassroomModes: teacher,
    exportGradebook: teacher,
    manageTeacherRoles: owner,
    previewAnyRole: owner,
  });
}
function normalizeClassCode(value) {
  return String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
}
function generateClassCode(random = Math.random) {
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    const index = Math.max(0, Math.min(CLASS_CODE_ALPHABET.length - 1, Math.floor(Number(random()) * CLASS_CODE_ALPHABET.length)));
    code += CLASS_CODE_ALPHABET[index];
  }
  return code;
}
function normalizeAssignment(input = {}) {
  const type = ASSIGNMENT_TYPES.has(input.type) ? input.type : 'practice';
  const difficulty = DIFFICULTIES.has(input.difficulty) ? input.difficulty : 'adaptive';
  return {
    id: input.id ? String(input.id) : '',
    classId: input.classId ? String(input.classId) : '',
    title: cleanText(input.title || 'MathsExpress Assignment', 100) || 'MathsExpress Assignment',
    type,
    topic: cleanText(input.topic || 'algebra', 40).toLowerCase() || 'algebra',
    lessonId: cleanText(input.lessonId || '', 50),
    difficulty,
    questionCount: Math.floor(clamp(input.questionCount ?? 10, 1, 50)),
    attemptsAllowed: Math.floor(clamp(input.attemptsAllowed ?? 10, 1, 10)),
    hintsAllowed: input.hintsAllowed !== false,
    requiredMastery: Math.floor(clamp(input.requiredMastery ?? 0, 0, 100)),
    rewardXp: Math.floor(clamp(input.rewardXp ?? 75, 0, 1000)),
    rewardCoins: Math.floor(clamp(input.rewardCoins ?? 20, 0, 500)),
    startAt: input.startAt ? String(input.startAt) : null,
    dueAt: input.dueAt ? String(input.dueAt) : null,
    targetStudentIds: Array.isArray(input.targetStudentIds) ? [...new Set(input.targetStudentIds.map(String))] : [],
    taskLibraryId: cleanText(input.taskLibraryId || '', 100),
    testMode: Boolean(input.testMode || type === 'test' || type === 'topic-test'),
    videosAllowed: input.videosAllowed !== false,
    tutorAllowed: input.tutorAllowed !== false,
    calculatorEnabled: input.calculatorEnabled !== false,
    timeLimitMinutes: input.timeLimitMinutes == null || input.timeLimitMinutes === '' ? null : Math.floor(clamp(input.timeLimitMinutes, 1, 240)),
  };
}
function buildAssignmentPayload(input = {}) {
  const assignment = normalizeAssignment(input);
  if (!assignment.classId) throw new Error('Choose a class before assigning work.');
  if (assignment.startAt && assignment.dueAt && new Date(assignment.dueAt) <= new Date(assignment.startAt)) throw new Error('Due date must be after the start date.');
  return {
    class_id: assignment.classId,
    title: assignment.title,
    assignment_type: assignment.type,
    topic: assignment.topic,
    lesson_id: assignment.lessonId || null,
    difficulty: assignment.difficulty,
    question_count: assignment.questionCount,
    attempts_allowed: assignment.attemptsAllowed,
    hints_allowed: assignment.testMode ? false : assignment.hintsAllowed,
    videos_allowed: assignment.testMode ? false : assignment.videosAllowed,
    tutor_allowed: assignment.testMode ? false : assignment.tutorAllowed,
    test_mode: assignment.testMode,
    calculator_enabled: assignment.calculatorEnabled,
    required_mastery: assignment.requiredMastery,
    reward_xp: assignment.rewardXp,
    reward_coins: assignment.rewardCoins,
    start_at: assignment.startAt,
    due_at: assignment.dueAt,
    time_limit_minutes: assignment.timeLimitMinutes,
    results_released: assignment.testMode ? false : true,
    metadata: { task_library_id: assignment.taskLibraryId || null },
    targetStudentIds: assignment.targetStudentIds,
  };
}
function assignmentStatus(assignment = {}, attempt = {}, now = new Date()) {
  if (attempt.completedAt) return 'completed';
  const current = now instanceof Date ? now : new Date(now);
  if (assignment.startAt && current < new Date(assignment.startAt)) return 'scheduled';
  if (assignment.dueAt && current > new Date(assignment.dueAt)) return 'overdue';
  if (attempt.startedAt || Number(attempt.answered) > 0) return 'in-progress';
  return 'not-started';
}
function aggregateClassProgress(rows = []) {
  const totals = {
    students: rows.length,
    answered: 0,
    correct: 0,
    accuracy: 0,
    timeSeconds: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    overdue: 0,
  };
  for (const row of rows) {
    totals.answered += Math.max(0, Number(row.answered) || 0);
    totals.correct += Math.max(0, Number(row.correct) || 0);
    totals.timeSeconds += Math.max(0, Number(row.timeSeconds) || 0);
    if (row.assignmentStatus === 'completed') totals.completed += 1;
    else if (row.assignmentStatus === 'in-progress') totals.inProgress += 1;
    else if (row.assignmentStatus === 'overdue') totals.overdue += 1;
    else totals.notStarted += 1;
  }
  totals.accuracy = totals.answered ? Math.round((totals.correct / totals.answered) * 100) : 0;
  return totals;
}
function buildMasteryHeatmap(students = []) {
  const columns = [];
  const seen = new Set();
  for (const student of students) {
    for (const key of Object.keys(student.mastery || {})) {
      if (!seen.has(key)) { seen.add(key); columns.push(key); }
    }
  }
  return {
    columns,
    rows: students.map((student) => ({
      studentId: String(student.studentId ?? ''),
      displayName: cleanText(student.displayName || 'Student', 40),
      values: Object.fromEntries(columns.map((key) => [key, Math.round(clamp(student.mastery?.[key] ?? 0, 0, 100))])),
    })),
  };
}
const CLASSROOM_MODES = Object.freeze([
  { id: 'mastery-challenge', name: 'Mastery Challenge', description: 'Blue vs Red race to the mastery target. Every correct answer pushes your team ahead.' },
  { id: 'tug-of-war', name: 'Tug of War', description: 'Two teams answer maths to move the marker toward their side.' },
  { id: 'capture-zone', name: 'Capture the Zone', description: 'Blue and Red fight for control of the centre. Correct answers push the control line toward your team.' },
  { id: 'maths-race', name: 'Maths Race', description: 'Two team racers share the track. Correct answers move your team car toward the finish.' },
  { id: 'tower-climb', name: 'Tower Climb', description: 'Blue and Red climb separate towers. First team to the roof wins.' },
  { id: 'king-of-the-hill', name: 'King of the Hill', description: 'Correct answers take control of the hill. Hold it long enough to win.' },
  { id: 'team-relay', name: 'Team Relay', description: 'Every correct answer moves your team baton one stage. First relay team home wins.' },
  { id: 'last-team-standing', name: 'Last Team Standing', description: 'Wrong answers cost your team a life. Keep your team alive longer than the opposition.' },
  { id: 'team-quiz', name: 'Team Quiz', description: 'Blue vs Red score race with streak bonuses. First team to the target wins.' },
  { id: 'quiz-show', name: 'Quiz Show', description: 'A live Blue vs Red quiz scoreboard where every correct answer changes the match.' },
  { id: 'maths-football', name: 'Maths Football', description: 'Blue attacks right and Red attacks left. Correct answers move the same shared ball toward the other team’s goal.' },
  { id: 'basketball-shootout', name: 'Basketball Shootout', description: 'Correct answers score team baskets. Hot streaks turn shots into three-pointers.' },
  { id: 'checkpoint-race', name: 'Checkpoint Race', description: 'Blue and Red race through shared checkpoints. First team to clear them all wins.' },
  { id: 'boss-question', name: 'Boss Question', description: 'The whole class attacks one shared boss. Every correct answer deals damage.' },
  { id: 'tower-defence', name: 'Tower Defence', description: 'The class charges the same defence towers together and clears ten enemy waves.' },
  { id: 'dungeon-run', name: 'Dungeon Run', description: 'Blue and Red race room-by-room through the dungeon. Correct answers open the next door.' },
  { id: 'quiz-battle', name: 'Quiz Battle', description: 'A fast head-to-head Blue vs Red score battle with live shared progress.' },
  { id: 'boss-raid', name: 'Boss Raid', description: 'The class shares one boss health bar. Correct answers from everyone combine into damage.' },
]);

return {SCHOOL_STAFF_ROLES,normalizeSchoolCode,generateSchoolCode,normalizeSchool,schoolCapabilitiesForRole,buildClassPayload,capabilitiesForRole,normalizeClassCode,generateClassCode,normalizeAssignment,buildAssignmentPayload,assignmentStatus,aggregateClassProgress,buildMasteryHeatmap,CLASSROOM_MODES};
})();
// module: src/core/school-cloud.js
__modules["src/core/school-cloud.js"]=(()=>{
const {generateClassCode, buildAssignmentPayload, normalizeClassCode, buildClassPayload, normalizeSchool, generateSchoolCode, SCHOOL_STAFF_ROLES}=__modules["src/core/school.js"];


function unwrap(result) {
  if (result?.error) throw result.error;
  return result?.data;
}

function isMissingRoomSchema(error) {
  const code=String(error?.code||'');
  const message=String(error?.message||error||'').toLowerCase();
  return code==='42703' || (message.includes('room') && (message.includes('does not exist') || message.includes('schema cache') || message.includes('could not find')));
}

function isMissingManageClassRpc(error) {
  const code=String(error?.code||'');
  const message=String(error?.message||error||'').toLowerCase();
  return code==='PGRST202' || (message.includes('mathsexpress_manage_class') && (message.includes('could not find') || message.includes('does not exist') || message.includes('schema cache')));
}

function cleanName(value, fallback = 'MathsExpress Class') {
  const text = String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, 80);
  return text || fallback;
}
class MathRiftSchoolClient {
  constructor(client) {
    if (!client) throw new Error('School client requires Supabase client');
    this.client = client;
  }

  async joinClass(code) {
    return unwrap(await this.client.rpc('mathrift_join_class', { p_code: normalizeClassCode(code) }));
  }

  async createClass({ schoolId = '', name, yearLevel = 9, joinCode = '', room = '' } = {}) {
    const payload = buildClassPayload({ schoolId, name, yearLevel, joinCode });
    const created=unwrap(await this.client.rpc('mathrift_create_class', {
      p_school_id: payload.school_id, p_name: payload.name, p_year_level: payload.year_level, p_join_code: payload.join_code,
    }));
    const classId=created?.id||created?.class_id||null;
    let roomResult=null;
    if(classId && String(room||'').trim()) roomResult=await this.manageClass(classId,{action:'edit',name:payload.name,yearLevel:payload.year_level,room:String(room||'').trim()});
    return {...(created||{}),roomUnavailable:Boolean(roomResult?.roomUnavailable),legacySchema:Boolean(roomResult?.legacySchema)};
  }

  async manageClass(classId, { action = 'edit', name = null, yearLevel = null, room = null } = {}) {
    const id=String(classId); const requested=String(action||'edit');
    try {
      return unwrap(await this.client.rpc('mathsexpress_manage_class', {
        p_class_id:id, p_action:requested, p_name:name==null?null:String(name), p_year_level:yearLevel==null?null:Number(yearLevel), p_room:room==null?null:String(room),
      })) || {};
    } catch (error) {
      if (!isMissingRoomSchema(error) && !isMissingManageClassRpc(error)) throw error;
      // Backward-compatible fallback for databases that have not run the v8.7 migration yet.
      if (requested==='delete') {
        unwrap(await this.client.from('mathrift_classes').delete().eq('id',id));
        return {ok:true,class_id:id,deleted:true,legacySchema:true};
      }
      const updates={};
      if (requested==='archive') updates.archived=true;
      else if (requested==='unarchive') updates.archived=false;
      else {
        if (name!=null) updates.name=String(name).trim().slice(0,80);
        if (yearLevel!=null) updates.year_level=Number(yearLevel);
      }
      if (!Object.keys(updates).length) return {ok:true,class_id:id,legacySchema:true,roomUnavailable:true};
      const row=unwrap(await this.client.from('mathrift_classes').update(updates).eq('id',id).select('id,name,year_level,archived').single());
      return {...(row||{}),ok:true,class_id:id,legacySchema:true,roomUnavailable:room!=null};
    }
  }

  async updateSchoolDetails(schoolId, { name = null, region = null, country = null, curriculum = null } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_update_school_details', {
      p_school_id:String(schoolId), p_name:name==null?null:String(name), p_region:region==null?null:String(region), p_country:country==null?null:String(country), p_curriculum:curriculum==null?null:String(curriculum),
    })) || {};
  }

  async createSchool(input = {}) {
    const school = normalizeSchool(input);
    return unwrap(await this.client.rpc('mathrift_create_school', {
      p_name: school.name,
      p_code: school.code || generateSchoolCode(),
      p_display_name: school.displayName,
      p_country: school.country || null,
      p_region: school.region || null,
      p_curriculum: school.curriculum,
      p_year_levels: school.yearLevels,
    }));
  }

  async listSchools() {
    return unwrap(await this.client.rpc('mathrift_list_my_schools', {})) || [];
  }

  async getSchoolDashboard(schoolId) {
    return unwrap(await this.client.rpc('mathrift_school_dashboard', { p_school_id: String(schoolId) })) || {};
  }

  async listSchoolStaff(schoolId) {
    return unwrap(await this.client.rpc('mathrift_list_school_staff', { p_school_id: String(schoolId) })) || [];
  }

  async addSchoolStaff(schoolId, email, role = 'teacher') {
    const normalizedRole = SCHOOL_STAFF_ROLES.includes(role) ? role : 'teacher';
    return unwrap(await this.client.rpc('mathrift_add_school_staff', { p_school_id: String(schoolId), p_email: String(email || '').trim().toLowerCase(), p_staff_role: normalizedRole }));
  }

  async updateSchoolStaffRole(schoolId, userId, role = 'teacher') {
    const normalizedRole = SCHOOL_STAFF_ROLES.includes(role) ? role : 'teacher';
    return unwrap(await this.client.rpc('mathrift_update_school_staff_role', { p_school_id: String(schoolId), p_user_id: String(userId), p_staff_role: normalizedRole }));
  }

  async removeSchoolStaff(schoolId, userId) {
    return unwrap(await this.client.rpc('mathrift_remove_school_staff', { p_school_id: String(schoolId), p_user_id: String(userId) }));
  }

  async listSchoolStudents(schoolId) {
    return unwrap(await this.client.rpc('mathrift_list_school_students', { p_school_id: String(schoolId) })) || [];
  }

  async getSchoolConfig(schoolId) {
    return unwrap(await this.client.rpc('mathsexpress_get_school_config', { p_school_id:String(schoolId) })) || {};
  }

  async updateSchoolConfig(schoolId, { featureFlags = null, moderation = null, branding = null, maintenanceMode = null } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_update_school_config', {
      p_school_id:String(schoolId), p_feature_flags:featureFlags, p_moderation:moderation, p_branding:branding, p_maintenance:maintenanceMode,
    })) || {};
  }

  async addClassStaff(classId, email, { accessLevel = 'co-teacher', expiresAt = null } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_add_class_staff', {
      p_class_id:String(classId), p_email:String(email || '').trim().toLowerCase(), p_access_level:String(accessLevel), p_expires_at:expiresAt,
    }));
  }

  async bulkAddStudents(schoolId, classId, rows = []) {
    return unwrap(await this.client.rpc('mathsexpress_bulk_add_students', { p_school_id:String(schoolId), p_class_id:classId ? String(classId) : null, p_rows:rows }));
  }

  async createStudioContent({ schoolId, classId = null, type, title, body = '', payload = {}, startsAt = null, endsAt = null } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_create_content', {
      p_school_id:String(schoolId), p_class_id:classId ? String(classId) : null, p_type:String(type), p_title:String(title), p_body:String(body), p_payload:payload || {}, p_starts_at:startsAt, p_ends_at:endsAt,
    }));
  }

  async listStudioContent({ schoolId = null, classId = null, limit = 100 } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_list_content', { p_school_id:schoolId ? String(schoolId) : null, p_class_id:classId ? String(classId) : null, p_limit:Math.max(1, Math.min(300, Number(limit)||100)) })) || [];
  }

  async submitLiveResponse(contentId, response = {}, { correct = null, score = 0 } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_submit_live_response', { p_content_id:Number(contentId), p_response:response || {}, p_correct:correct, p_score:Number(score)||0 }));
  }

  async liveResults(contentId) {
    return unwrap(await this.client.rpc('mathsexpress_live_results', { p_content_id:Number(contentId) })) || [];
  }

  async saveCustomQuestion({ schoolId, classId = null, prompt, questionType = 'numeric', options = [], answer = '', topic = 'Mathematics', difficulty = 'medium', favourite = true } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_save_custom_question', {
      p_school_id:String(schoolId), p_class_id:classId ? String(classId) : null, p_prompt:String(prompt||''), p_question_type:String(questionType), p_options:Array.isArray(options)?options:[], p_answer:String(answer||''), p_topic:String(topic||'Mathematics'), p_difficulty:String(difficulty||'medium'), p_favourite:Boolean(favourite),
    }));
  }

  async listCustomQuestions(schoolId, favouritesOnly = false) {
    return unwrap(await this.client.rpc('mathsexpress_list_custom_questions', { p_school_id:String(schoolId), p_favourites_only:Boolean(favouritesOnly) })) || [];
  }

  async toggleCustomQuestionFavourite(id) {
    return unwrap(await this.client.rpc('mathsexpress_toggle_custom_question_favourite', { p_id:Number(id) }));
  }

  async saveGoal({ title, target = 100, due = null, schoolId = null } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_save_goal', { p_title:String(title||''), p_target:Number(target)||100, p_due:due || null, p_school_id:schoolId ? String(schoolId) : null }));
  }

  async updateGoal(id, progress, status = null) {
    return unwrap(await this.client.rpc('mathsexpress_update_goal', { p_id:Number(id), p_progress:Number(progress)||0, p_status:status }));
  }

  async listGoals(studentId = null) {
    return unwrap(await this.client.rpc('mathsexpress_list_goals', { p_student_id:studentId ? String(studentId) : null })) || [];
  }


  async getSchoolControls(schoolId) {
    return unwrap(await this.client.rpc('mathsexpress_get_school_controls', { p_school_id:String(schoolId) })) || {};
  }

  async setSchoolControls(schoolId, { featureFlags = {}, moderation = {}, branding = {} } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_set_school_controls', { p_school_id:String(schoolId), p_feature_flags:featureFlags || {}, p_moderation:moderation || {}, p_branding:branding || {} })) || {};
  }

  async addClassTeacher(classId, email, reliefHours = 0) {
    const hours=Math.max(0, Math.min(168, Math.round(Number(reliefHours) || 0)));
    const expiresAt=hours ? new Date(Date.now()+hours*3600000).toISOString() : null;
    const result=unwrap(await this.client.rpc('mathsexpress_add_class_staff', { p_class_id:String(classId), p_email:String(email || '').trim().toLowerCase(), p_access_level:hours?'relief':'co-teacher', p_expires_at:expiresAt }));
    return { ...(result||{}), mode:hours?'relief':'co-teacher', expiresAt };
  }

  async listTeacherClasses() {
    try {
      return unwrap(await this.client.from('mathrift_classes')
        .select('id,school_id,name,year_level,textbook_focus,join_code,archived,created_at,teacher_id,room')
        .order('created_at', { ascending: false })) || [];
    } catch (error) {
      if (!isMissingRoomSchema(error)) throw error;
      const rows=unwrap(await this.client.from('mathrift_classes')
        .select('id,school_id,name,year_level,textbook_focus,join_code,archived,created_at,teacher_id')
        .order('created_at', { ascending: false })) || [];
      return rows.map(row=>({...row,room:''}));
    }
  }

  async listStudentClasses() {
    try {
      return unwrap(await this.client.from('mathrift_class_members')
        .select('class_id,joined_at,class:mathrift_classes(id,school_id,name,year_level,textbook_focus,join_code,archived,teacher_id,room)')
        .order('joined_at', { ascending: false })) || [];
    } catch (error) {
      if (!isMissingRoomSchema(error)) throw error;
      const rows=unwrap(await this.client.from('mathrift_class_members')
        .select('class_id,joined_at,class:mathrift_classes(id,school_id,name,year_level,textbook_focus,join_code,archived,teacher_id)')
        .order('joined_at', { ascending: false })) || [];
      return rows.map(row=>({...row,class:row.class?{...row.class,room:''}:row.class}));
    }
  }

  async listClassMembers(classId) {
    return unwrap(await this.client.from('mathrift_class_members')
      .select('class_id,student_id,joined_at,student:account_profiles(user_id,display_name,email,last_seen)')
      .eq('class_id', String(classId))) || [];
  }

  async removeStudent(classId, studentId) {
    return unwrap(await this.client.from('mathrift_class_members').delete().eq('class_id', String(classId)).eq('student_id', String(studentId)));
  }

  async createAssignment(input = {}) {
    return this.createAndAssignTask(input);
  }

  async createAndAssignTask(input = {}) {
    const built = buildAssignmentPayload(input);
    const { targetStudentIds, metadata, ...payload } = built;
    payload.config = { ...(input.config || {}), ...(metadata || {}) };
    // Generated task assignments keep one deterministic seed so students, reports and
    // printable copies all refer to the same question set without storing answer keys.
    if (payload.config.task_library_id && !Number.isFinite(Number(payload.config.question_seed))) {
      payload.config.question_seed = Math.abs(Math.floor((Date.now() + Math.floor(Math.random()*1000000)) % 100000000));
    }
    const created = unwrap(await this.client.from('mathrift_assignments').insert(payload).select('*').single());
    if (targetStudentIds.length) {
      const rows = targetStudentIds.map((studentId) => ({ assignment_id: created.id, student_id: studentId }));
      unwrap(await this.client.from('mathrift_assignment_targets').insert(rows));
    }
    return created;
  }

  async listClassAssignments(classId) {
    return unwrap(await this.client.from('mathrift_assignments')
      .select('*')
      .eq('class_id', String(classId))
      .order('created_at', { ascending: false })) || [];
  }

  async getAssignment(assignmentId) {
    return unwrap(await this.client.from('mathrift_assignments').select('*').eq('id', String(assignmentId)).single()) || null;
  }

  async updateTaskGroups(assignmentId, groups = []) {
    return unwrap(await this.client.rpc('mathsexpress_teacher_set_task_groups', { p_assignment_id:String(assignmentId), p_groups:Array.isArray(groups)?groups:[] })) || {};
  }


  async setStudentYearOverride(studentId, classId, yearLevel, expiresAt) {
    return unwrap(await this.client.rpc('mathsexpress_teacher_set_year_override', {
      p_student_id:String(studentId), p_class_id:String(classId), p_year_level:Number(yearLevel), p_expires_at:String(expiresAt)
    })) || {};
  }

  async clearStudentYearOverride(studentId, classId) {
    return unwrap(await this.client.rpc('mathsexpress_teacher_clear_year_override', { p_student_id:String(studentId), p_class_id:String(classId) })) || {};
  }

  async setClassTextbookFocus(classId, textbookFocus) {
    return unwrap(await this.client.rpc('mathsexpress_teacher_set_class_textbook_focus', { p_class_id:String(classId), p_textbook_focus:String(textbookFocus||'Mathematics') })) || {};
  }

  async rescheduleAssignment(assignmentId, startAt, dueAt) {
    return unwrap(await this.client.rpc('mathsexpress_teacher_reschedule_assignment', {
      p_assignment_id:String(assignmentId), p_start_at:startAt?String(startAt):null, p_due_at:dueAt?String(dueAt):null
    })) || {};
  }

  async masteryEvidence(classId, studentId, skillId) {
    return unwrap(await this.client.rpc('mathsexpress_mastery_evidence', { p_class_id:String(classId), p_student_id:String(studentId), p_skill_id:String(skillId) })) || [];
  }

  async listMyDistricts() {
    return unwrap(await this.client.rpc('mathsexpress_list_my_districts', {})) || [];
  }

  async districtDashboard(districtId) {
    return unwrap(await this.client.rpc('mathsexpress_district_dashboard', { p_district_id:String(districtId) })) || {};
  }

  async createDistrict(name, schoolIds = []) {
    return unwrap(await this.client.rpc('mathsexpress_create_district', { p_name:String(name||'').slice(0,120), p_school_ids:(Array.isArray(schoolIds)?schoolIds:[]).map(String) })) || {};
  }

  async listStudentAssignments() {
    return unwrap(await this.client.rpc('mathrift_student_assignments', {})) || [];
  }

  async classDashboard(classId) {
    return unwrap(await this.client.rpc('mathrift_class_dashboard', { p_class_id: String(classId) })) || {};
  }

  async startAssignment(assignmentId) {
    try {
      return unwrap(await this.client.rpc('mathsexpress_start_assignment_v84', { p_assignment_id: String(assignmentId) }));
    } catch (error) {
      const message=String(error?.message||'');
      if (/no attempts remaining|attempt limit|attempts? remaining/i.test(message)) {
        // v8.7.5: never block a student from retrying assigned work. The SQL migration
        // makes this persistent server-side; this fallback keeps older schemas usable.
        return { unlimited_retry:true, local_retry:true };
      }
      if (/mathsexpress_start_assignment_v84|PGRST202|function.*not found|schema cache/i.test(message)) {
        try {
          return unwrap(await this.client.rpc('mathrift_start_assignment', { p_assignment_id: String(assignmentId) }));
        } catch (fallbackError) {
          const fallbackMessage=String(fallbackError?.message||'');
          if (/no attempts remaining|attempt limit|attempts? remaining/i.test(fallbackMessage)) return { unlimited_retry:true, local_retry:true };
          throw fallbackError;
        }
      }
      throw error;
    }
  }

  async recordQuestionAttempt({ assignmentId, questionId, correct, answer = '', hintUsed = false, timeSeconds = 0, working = [], scoreAwarded = null, scorePossible = null, partial = false, nextStepUsed = false, retries = 0, feedback = '', markingRationale = '' } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_record_question_attempt', {
      p_assignment_id: String(assignmentId),
      p_question_id: String(questionId),
      p_correct: Boolean(correct),
      p_answer_text: String(answer ?? '').slice(0, 1000),
      p_hint_used: Boolean(hintUsed),
      p_time_seconds: Math.max(0, Math.min(7200, Math.round(Number(timeSeconds) || 0))),
      p_working: Array.isArray(working) ? working.slice(-20) : [],
      p_score_awarded: scoreAwarded === null || scoreAwarded === undefined ? null : Math.max(0, Number(scoreAwarded) || 0),
      p_score_possible: scorePossible === null || scorePossible === undefined ? null : Math.max(0.1, Number(scorePossible) || 1),
      p_partial: Boolean(partial),
      p_next_step_used: Boolean(nextStepUsed),
      p_retries: Math.max(0, Math.min(50, Math.round(Number(retries) || 0))),
      p_feedback: String(feedback || '').slice(0, 1500) || null,
      p_marking_rationale: String(markingRationale || '').slice(0, 2500) || null,
    }));
  }

  async completeAssignment(assignmentId, { answered = 0, correct = 0, timeSeconds = 0, masteryAfter = 0 } = {}) {
    return unwrap(await this.client.rpc('mathrift_complete_assignment', {
      p_assignment_id: String(assignmentId),
      p_answered: Math.max(0, Math.round(Number(answered) || 0)),
      p_correct: Math.max(0, Math.round(Number(correct) || 0)),
      p_time_seconds: Math.max(0, Math.round(Number(timeSeconds) || 0)),
      p_mastery_after: Math.max(0, Math.min(100, Math.round(Number(masteryAfter) || 0))),
    }));
  }


  async claimAssignmentCompletionReward(assignmentId) {
    return unwrap(await this.client.rpc('mathsexpress_claim_assignment_completion_reward', { p_assignment_id:String(assignmentId) })) || { reward_coins:0 };
  }

  async saveTemplate({ name, payload } = {}) {
    return unwrap(await this.client.from('mathrift_assignment_templates').insert({ name: cleanName(name, 'Assignment Template'), payload: payload || {} }).select('*').single());
  }

  async listTemplates() {
    return unwrap(await this.client.from('mathrift_assignment_templates').select('*').order('created_at', { ascending: false })) || [];
  }


  async addGuardian(email, { weeklyProgress = true, taskNotifications = true } = {}) {
    const value = String(email ?? '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error('Enter a valid guardian email.');
    return unwrap(await this.client.from('mathrift_guardians').insert({ email: value, weekly_progress: Boolean(weeklyProgress), task_notifications: Boolean(taskNotifications) }));
  }

  async listGuardians() {
    return unwrap(await this.client.from('mathrift_guardians').select('*').order('created_at', { ascending: true })) || [];
  }

  async saveSkillMastery(skillId, mastery) {
    return unwrap(await this.client.from('mathrift_skill_mastery').upsert({ skill_id: String(skillId), mastery: Math.max(0, Math.min(100, Number(mastery) || 0)), last_worked_at: new Date().toISOString() }, { onConflict: 'student_id,skill_id' }));
  }

  async listSkillMastery() {
    return unwrap(await this.client.from('mathrift_skill_mastery').select('*').order('skill_id', { ascending: true })) || [];
  }

  async giveRecognition(classId, studentId, message = '', sticker = 'star') {
    return unwrap(await this.client.from('mathrift_recognition').insert({ class_id: String(classId), student_id: String(studentId), message: String(message).slice(0, 500), sticker: String(sticker).slice(0, 40) }));
  }

  async listRecognition() {
    return unwrap(await this.client.from('mathrift_recognition').select('*').order('created_at', { ascending: false })) || [];
  }

  async logActivity(payload = {}) {
    return unwrap(await this.client.from('mathrift_activity').insert({ activity_type: String(payload.type || 'practice'), topic: payload.topic ? String(payload.topic) : null, class_id: payload.classId || null, assignment_id: payload.assignmentId || null, questions: Math.max(0, Number(payload.questions) || 0), correct: Math.max(0, Number(payload.correct) || 0), active_seconds: Math.max(0, Number(payload.activeSeconds) || 0), points: Math.max(0, Number(payload.points) || 0), payload: payload.data || {} }));
  }

  async listActivity(limit = 100) {
    return unwrap(await this.client.from('mathrift_activity').select('*').order('occurred_at', { ascending: false }).limit(Math.max(1, Math.min(500, Number(limit) || 100)))) || [];
  }

  async listRevisionBank() {
    return unwrap(await this.client.from('mathrift_revision_bank').select('*').is('corrected_at', null).order('added_at', { ascending: false })) || [];
  }

  async saveTutorChat(payload = {}) {
    return unwrap(await this.client.from('mathrift_tutor_chats').insert({ class_id: payload.classId || null, assignment_id: payload.assignmentId || null, question_id: payload.questionId || null, messages: Array.isArray(payload.messages) ? payload.messages : [], moderation_state: String(payload.moderationState || 'ok'), serious_event: Boolean(payload.seriousEvent) }).select('*').single());
  }

  async recordIntegrityEvent(assignmentId, eventType, payload = {}) {
    return unwrap(await this.client.from('mathrift_integrity_events').insert({ assignment_id: String(assignmentId), event_type: String(eventType), payload }));
  }

  async createClassroomSession(classId, mode, config = {}) {
    return unwrap(await this.client.from('mathrift_classroom_sessions').insert({ class_id: String(classId), mode: String(mode), config, status:'playing' }).select('*').single());
  }

  async listActiveClassroomSessions() {
    return unwrap(await this.client.from('mathrift_classroom_sessions').select('id,class_id,mode,status,config,team_state,created_at').in('status', ['lobby','playing']).gte('created_at',new Date(Date.now()-600000).toISOString()).order('created_at', { ascending:false }).limit(20)) || [];
  }

  async joinClassroomGame(sessionId) {
    return unwrap(await this.client.rpc('mathsexpress_class_game_join_v114', { p_session_id:String(sessionId) }));
  }

  async submitClassroomGameAnswer(sessionId, correct, questionKey) {
    return unwrap(await this.client.rpc('mathsexpress_class_game_answer_v114', { p_session_id:String(sessionId), p_correct:Boolean(correct), p_question_key:String(questionKey || '') }));
  }

  async classroomGameLeaderboard(sessionId) {
    return unwrap(await this.client.rpc('mathsexpress_class_game_leaderboard_v114', { p_session_id:String(sessionId) })) || [];
  }

  async classroomGameState(sessionId) {
    return unwrap(await this.client.rpc('mathsexpress_class_game_state_v114', { p_session_id:String(sessionId) })) || {};
  }

  async classroomGameSnapshot(sessionId) {
    return unwrap(await this.client.rpc('mathsexpress_class_game_snapshot_v114', { p_session_id:String(sessionId) })) || { game_state:{}, players:[] };
  }


  async markAttendance(classId, date, rows = []) {
    return unwrap(await this.client.rpc('mathsexpress_mark_attendance', { p_class_id:String(classId), p_date:String(date), p_rows:rows }));
  }

  async saveSeatingPlan(classId, title, layout = []) {
    return unwrap(await this.client.rpc('mathsexpress_save_seating_plan', { p_class_id:String(classId), p_title:String(title || 'Seating plan'), p_layout:layout }));
  }

  async createSharedResource({ schoolId, title, type = 'task', visibility = 'school', tags = [], payload = {} } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_create_resource', { p_school_id:String(schoolId), p_title:String(title || 'Resource'), p_type:String(type), p_visibility:String(visibility), p_tags:Array.isArray(tags)?tags:[], p_payload:payload || {} }));
  }

  async listSharedResources(schoolId, query = '', limit = 100) {
    return unwrap(await this.client.rpc('mathsexpress_list_resources', { p_school_id:String(schoolId), p_query:String(query || ''), p_limit:Math.max(1,Math.min(300,Number(limit)||100)) })) || [];
  }

  async addParentLink(schoolId, studentId, guardianEmail, guardianName = '') {
    return unwrap(await this.client.rpc('mathsexpress_add_parent_link', { p_school_id:String(schoolId), p_student_id:String(studentId), p_guardian_email:String(guardianEmail || '').trim().toLowerCase(), p_guardian_name:String(guardianName || '') || null }));
  }

  async listSchoolParentLinks(schoolId) {
    return unwrap(await this.client.rpc('mathsexpress_school_parent_links', { p_school_id:String(schoolId) })) || [];
  }

  async createBackupManifest(schoolId, label = 'Manual backup', counts = {}) {
    return unwrap(await this.client.rpc('mathsexpress_create_backup_manifest', { p_school_id:String(schoolId), p_label:String(label), p_counts:counts || {} }));
  }

  async createFeatureRollout({ feature, schoolId = null, beta = false, percent = 100, enabled = true } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_owner_feature_rollout', { p_feature:String(feature || ''), p_school_id:schoolId ? String(schoolId) : null, p_beta:Boolean(beta), p_percent:Math.max(0,Math.min(100,Number(percent)||100)), p_enabled:Boolean(enabled) }));
  }

  async trackOwnerEvent({ eventType = 'activity', category = 'system', action = '', page = '', schoolId = null, classId = null, assignmentId = null, sessionId = '', details = {} } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_track_event', {
      p_event_type:String(eventType || 'activity'), p_category:String(category || 'system'), p_action:String(action || eventType || 'activity'),
      p_page:String(page || ''), p_school_id:schoolId ? String(schoolId) : null, p_class_id:classId ? String(classId) : null,
      p_assignment_id:assignmentId ? String(assignmentId) : null, p_session_id:String(sessionId || ''), p_details:details || {},
    }));
  }

  async ownerActivityFeed({ search = '', category = 'all', eventType = 'all', userId = null, page = 'all', limit = 200, offset = 0 } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_owner_activity_feed', {
      p_search:String(search || ''), p_category:String(category || 'all'), p_event_type:String(eventType || 'all'),
      p_user_id:userId ? String(userId) : null, p_page:String(page || 'all'), p_limit:Math.max(1,Math.min(1000,Number(limit)||200)), p_offset:Math.max(0,Number(offset)||0),
    })) || [];
  }

  async ownerUserDirectory(search = '', limit = 300) {
    return unwrap(await this.client.rpc('mathsexpress_owner_user_directory', { p_search:String(search || ''), p_limit:Math.max(1,Math.min(1000,Number(limit)||300)) })) || [];
  }

  async ownerUserDetail(userId, limit = 200) {
    return unwrap(await this.client.rpc('mathsexpress_owner_user_detail', { p_user_id:String(userId), p_limit:Math.max(1,Math.min(1000,Number(limit)||200)) })) || {};
  }

  async ownerUpdateUserRole(userId, role) {
    return unwrap(await this.client.rpc('mathsexpress_owner_set_user_role', { p_user_id:String(userId), p_role:String(role) }));
  }

  async ownerUpdateUserStatus(userId, status) {
    return unwrap(await this.client.rpc('mathsexpress_owner_set_user_status', { p_user_id:String(userId), p_status:String(status) }));
  }


  async ownerUpdateUserProfile(userId, { displayName = null, username = null, yearLevel = null } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_owner_update_user_profile', {
      p_user_id:String(userId),
      p_display_name:displayName == null ? null : String(displayName).trim().slice(0,40),
      p_username:username == null ? null : String(username).trim().slice(0,24),
      p_year_level:yearLevel == null || yearLevel === '' ? null : Math.max(0,Math.min(12,Number(yearLevel)||0)),
    }));
  }

  async ownerAdjustUserRewards(userId, { coinsDelta = 0, xpDelta = 0, gameTimeDelta = 0 } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_owner_adjust_user_rewards', {
      p_user_id:String(userId),
      p_coins_delta:Math.trunc(Number(coinsDelta)||0),
      p_xp_delta:Math.trunc(Number(xpDelta)||0),
      p_game_time_delta:Math.trunc(Number(gameTimeDelta)||0),
    }));
  }

  async listEducationDomains() {
    return unwrap(await this.client.rpc('mathsexpress_owner_list_education_domains', {})) || [];
  }

  async addEducationDomain(domain, label = '') {
    return unwrap(await this.client.rpc('mathsexpress_owner_add_education_domain', { p_domain:String(domain||'').trim().toLowerCase(), p_label:String(label||'') || null }));
  }

  async removeEducationDomain(domain) {
    return unwrap(await this.client.rpc('mathsexpress_owner_remove_education_domain', { p_domain:String(domain||'').trim().toLowerCase() }));
  }

  async updateFocusStatus({ state = 'active', classId = null, assignmentId = null } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_update_focus_status', { p_state:String(state), p_class_id:classId ? String(classId) : null, p_assignment_id:assignmentId ? String(assignmentId) : null }));
  }

  async classFocusStatus(classId) {
    return unwrap(await this.client.rpc('mathsexpress_class_focus_status', { p_class_id:String(classId) })) || [];
  }

  async updateAssignmentControls(assignmentId, controls = {}) {
    const v86=await this.client.rpc('mathsexpress_teacher_update_assignment_controls_v86', {
      p_assignment_id:String(assignmentId),
      p_paused:controls.paused == null ? null : Boolean(controls.paused),
      p_games_locked:controls.gamesLocked == null ? null : Boolean(controls.gamesLocked),
      p_focus_required:controls.focusRequired == null ? null : Boolean(controls.focusRequired),
      p_results_released:controls.resultsReleased == null ? null : Boolean(controls.resultsReleased),
      p_start_at:controls.startAt || null,
      p_exact_start:controls.exactStart == null ? null : Boolean(controls.exactStart),
      p_due_at:controls.dueAt || null,
      p_time_limit_minutes:controls.timeLimitMinutes == null ? null : Math.max(1,Math.min(240,Number(controls.timeLimitMinutes)||1)),
    });
    if(!v86.error) return unwrap(v86);
    return unwrap(await this.client.rpc('mathsexpress_teacher_update_assignment_controls', {
      p_assignment_id:String(assignmentId),
      p_paused:controls.paused == null ? null : Boolean(controls.paused),
      p_games_locked:controls.gamesLocked == null ? null : Boolean(controls.gamesLocked),
      p_focus_required:controls.focusRequired == null ? null : Boolean(controls.focusRequired),
      p_results_released:controls.resultsReleased == null ? null : Boolean(controls.resultsReleased),
      p_due_at:controls.dueAt || null,
      p_time_limit_minutes:controls.timeLimitMinutes == null ? null : Math.max(1,Math.min(240,Number(controls.timeLimitMinutes)||1)),
    }));
  }

  async setStudentYearOverride(studentId,classId,yearLevel,expiresAt=null){
    return unwrap(await this.client.rpc('mathsexpress_teacher_set_year_override',{p_student_id:String(studentId),p_class_id:classId?String(classId):null,p_year_level:yearLevel==null?null:Number(yearLevel),p_expires_at:expiresAt||null}));
  }

  async getClassLearningSettings(classId){
    return unwrap(await this.client.rpc('mathsexpress_get_class_learning_settings',{p_class_id:String(classId)})) || {};
  }

  async setClassLearningSettings(classId,{textbookFocus=null,autoAssignYear=true}={}){
    return unwrap(await this.client.rpc('mathsexpress_set_class_learning_settings',{p_class_id:String(classId),p_textbook_focus:textbookFocus||null,p_auto_assign_year:Boolean(autoAssignYear)})) || {};
  }

  async setStudentAccommodation(assignmentId, studentId, input = {}) {
    return unwrap(await this.client.rpc('mathsexpress_teacher_set_assignment_accommodation', {
      p_assignment_id:String(assignmentId), p_student_id:String(studentId),
      p_extra_minutes:Math.max(0,Math.min(240,Number(input.extraMinutes)||0)),
      p_attempts_override:input.attemptsOverride == null ? null : Math.max(1,Math.min(20,Number(input.attemptsOverride)||1)),
      p_due_at_override:input.dueAtOverride || null,
    }));
  }

  async listSchoolHouses(schoolId) {
    return unwrap(await this.client.rpc('mathsexpress_school_houses', { p_school_id:String(schoolId) })) || [];
  }

  async createHouse(schoolId, name) {
    return unwrap(await this.client.rpc('mathsexpress_create_house', { p_school_id:String(schoolId), p_name:String(name || '') }));
  }

  async assignHouse(houseId, studentId) {
    return unwrap(await this.client.rpc('mathsexpress_assign_house', { p_house_id:Number(houseId), p_student_id:String(studentId) }));
  }

  async awardMerit(schoolId, studentId, points = 1, reason = '') {
    return unwrap(await this.client.rpc('mathsexpress_award_merit', {
      p_school_id:String(schoolId), p_student_id:String(studentId),
      p_points:Math.max(1,Math.min(20,Number(points)||1)), p_reason:String(reason || '').slice(0,240),
    }));
  }

  async createTournament({ schoolId = null, classId = null, title = 'Maths Tournament', type = 'knockout', bracket = {} } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_create_tournament', {
      p_school_id:schoolId ? String(schoolId) : null, p_class_id:classId ? String(classId) : null,
      p_title:String(title || 'Maths Tournament'), p_type:String(type || 'knockout'), p_bracket:bracket || {},
    }));
  }

  async listTournaments({ schoolId = null, classId = null } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_list_tournaments', {
      p_school_id:schoolId ? String(schoolId) : null, p_class_id:classId ? String(classId) : null,
    })) || [];
  }

  async updateTournamentStatus(id, status, bracket = null) {
    return unwrap(await this.client.rpc('mathsexpress_update_tournament_status', {
      p_id:Number(id), p_status:String(status), p_bracket:bracket || null,
    }));
  }

  async sendParentMessage(schoolId, studentId, body) {
    return unwrap(await this.client.rpc('mathsexpress_teacher_send_parent_message', {
      p_school_id:String(schoolId), p_student_id:String(studentId), p_body:String(body || '').slice(0,2000),
    }));
  }

  async listMyParentMessages() {
    return unwrap(await this.client.rpc('mathsexpress_my_parent_messages', {})) || [];
  }

  async saveTeacherFeedback(studentId, assignmentId, comment, allowResubmission = false) {
    return unwrap(await this.client.rpc('mathsexpress_teacher_feedback_save', {
      p_student_id:String(studentId), p_assignment_id:String(assignmentId),
      p_comment:String(comment || '').slice(0,2000), p_allow_resubmission:Boolean(allowResubmission),
    }));
  }

  async listMyTeacherFeedback() {
    return unwrap(await this.client.rpc('mathsexpress_my_teacher_feedback', {})) || [];
  }

  async v7SaveObject({type,title,payload={},schoolId=null,classId=null,visibility='private'}={}) {
    return unwrap(await this.client.rpc('mathsexpress_v7_save_object', { p_type:String(type||''), p_title:String(title||''), p_payload:payload||{}, p_school_id:schoolId?String(schoolId):null, p_class_id:classId?String(classId):null, p_visibility:String(visibility||'private') }));
  }

  async v7ListObjects({type=null,schoolId=null,classId=null}={}) {
    return unwrap(await this.client.rpc('mathsexpress_v7_list_objects', { p_type:type?String(type):null, p_school_id:schoolId?String(schoolId):null, p_class_id:classId?String(classId):null })) || [];
  }

  async v7RaiseHand(classId,message='I need help') {
    return unwrap(await this.client.rpc('mathsexpress_v7_raise_hand', { p_class_id:String(classId), p_message:String(message||'I need help') }));
  }

  async v7HelpQueue(classId) { return unwrap(await this.client.rpc('mathsexpress_v7_help_queue', { p_class_id:String(classId) })) || []; }
  async v7ResolveHelp(id,status='resolved') { return unwrap(await this.client.rpc('mathsexpress_v7_resolve_help', { p_id:Number(id), p_status:String(status) })); }
  async v7VoteFeature(key,vote=1) { return unwrap(await this.client.rpc('mathsexpress_v7_vote_feature', { p_feature_key:String(key), p_vote:Number(vote)<0?-1:1 })); }
  async v7FeatureVotes() { return unwrap(await this.client.rpc('mathsexpress_v7_feature_vote_totals', {})) || []; }
  async v7RecordDailyPuzzle(key,correct) { return unwrap(await this.client.rpc('mathsexpress_v7_record_daily_puzzle', { p_puzzle_key:String(key), p_correct:Boolean(correct) })); }
  async v7RolePermissions() { return unwrap(await this.client.rpc('mathsexpress_v7_role_permissions', {})) || []; }
  async v7SetRolePermission(role,permission,allowed) { return unwrap(await this.client.rpc('mathsexpress_v7_set_role_permission', { p_role:String(role), p_permission:String(permission), p_allowed:Boolean(allowed) })); }
  async v7AddCoTeacher(classId,email) { return unwrap(await this.client.rpc('mathsexpress_v7_add_co_teacher', { p_class_id:String(classId), p_email:String(email||'') })); }
  async v7AddSubstitute(classId,email,expiresAt) { return unwrap(await this.client.rpc('mathsexpress_add_class_staff', { p_class_id:String(classId), p_email:String(email||'').trim().toLowerCase(), p_access_level:'relief', p_expires_at:String(expiresAt) })); }
  async v7RolloverClass(classId,name,yearLevel,copyStudents=true) { return unwrap(await this.client.rpc('mathsexpress_v7_rollover_class', { p_class_id:String(classId), p_name:String(name||''), p_year_level:Number.isFinite(Number(yearLevel))?Number(yearLevel):9, p_copy_students:Boolean(copyStudents) })); }
  async v7OwnerUndoList(limit=30) { return unwrap(await this.client.rpc('mathsexpress_v7_owner_undo_list', { p_limit:Math.max(1,Math.min(100,Number(limit)||30)) })) || []; }
  async v7OwnerUndoAction(id) { return unwrap(await this.client.rpc('mathsexpress_v7_owner_undo_action', { p_id:Number(id) })); }
  async v7UploadBugAttachment(file,userId) {
    if(!file || !file.size) return null;
    if(file.size > 15*1024*1024) throw new Error('Attachment must be 15 MB or smaller.');
    const safeName=String(file.name||'attachment').replace(/[^A-Za-z0-9._-]/g,'_').slice(-100);
    const path=`${String(userId)}/${Date.now()}-${Math.random().toString(36).slice(2,8)}-${safeName}`;
    const {data,error}=await this.client.storage.from('mathsexpress-bug-attachments').upload(path,file,{upsert:false,contentType:file.type||undefined});
    if(error) throw error;
    return data?.path||path;
  }
  async v7SubmitFeedback(category,title,description,page='v7',note='') {
    return unwrap(await this.client.rpc('mathsexpress_submit_feedback', { p_category:String(category||'bug'), p_title:String(title||'Feedback').slice(0,160), p_description:String(description||'').slice(0,5000), p_page:String(page||'v7').slice(0,120), p_note:String(note||'').slice(0,1000) }));
  }

  async eloStartSession(mode) { return unwrap(await this.client.rpc('mathsexpress_elo_start_session', { p_mode:String(mode||'quick-maths') })); }
  async eloFinishSession(sessionId,answered,correct) { return unwrap(await this.client.rpc('mathsexpress_elo_finish_session', { p_session_id:String(sessionId), p_answered:Math.max(0,Number(answered)||0), p_correct:Math.max(0,Number(correct)||0) })); }
  async eloLeaderboards() { return unwrap(await this.client.rpc('mathsexpress_elo_my_leaderboards', {})) || {}; }
  async eloAwardQuestion(eventKey,questionId,attemptNumber,correct=true) { return unwrap(await this.client.rpc('mathsexpress_elo_award_question', { p_event_key:String(eventKey||''), p_question_id:String(questionId||''), p_attempt_number:Math.max(1,Number(attemptNumber)||1), p_correct:Boolean(correct) })); }
  async recordIntegrityEvent(assignmentId,eventType,payload={}) { return unwrap(await this.client.rpc('mathsexpress_record_integrity_event',{p_assignment_id:String(assignmentId),p_event_type:String(eventType||''),p_payload:payload&&typeof payload==='object'?payload:{}})); }
  async recordDailyQuestionAttempt(eventKey,correct=false) { return unwrap(await this.client.rpc('mathsexpress_record_daily_question_attempt_v114',{p_event_key:String(eventKey||''),p_correct:Boolean(correct)})) || {}; }
  async playerState() { return unwrap(await this.client.rpc('mathsexpress_player_state', {})) || {}; }
  async getUserAppState() { return unwrap(await this.client.rpc('mathsexpress_get_user_app_state', {})) || {}; }
  async saveUserAppState(appState={}) { return unwrap(await this.client.rpc('mathsexpress_put_user_app_state', { p_state:appState&&typeof appState==='object'?appState:{} })) || {}; }
  async createPrivacyRequest(type,details='') { return unwrap(await this.client.rpc('mathsexpress_create_privacy_request', { p_type:String(type||''), p_details:String(details||'').slice(0,2000) })) || {}; }
  async myPrivacyRequests() { return unwrap(await this.client.rpc('mathsexpress_my_privacy_requests', {})) || []; }
  async myConsentStatus() { return unwrap(await this.client.rpc('mathsexpress_my_consent_status', {})) || []; }
  async awardQuestionReward(eventKey,{correct=true,xp=0,gameTimeSeconds=10,yearLevel=null}={}) {
    const payload={p_event_key:String(eventKey||''),p_correct:Boolean(correct),p_xp:Math.max(0,Math.min(60,Number(xp)||0)),p_game_time_seconds:Math.max(0,Math.min(10,Number(gameTimeSeconds)||0)),p_year_level:Number.isFinite(Number(yearLevel))?Math.max(0,Math.min(12,Math.round(Number(yearLevel)))):null};
    const primary=await this.client.rpc('mathsexpress_award_question_reward_v114',payload);
    if(!primary.error) return unwrap(primary)||{};
    if(!/function|schema cache|not found|PGRST202/i.test(String(primary.error?.message||primary.error?.code||''))) throw primary.error;
    return unwrap(await this.client.rpc('mathsexpress_award_question_reward',{p_event_key:payload.p_event_key,p_correct:payload.p_correct,p_xp:payload.p_xp,p_game_time_seconds:payload.p_game_time_seconds})) || {};
  }
  async claimDailyMission(missionId) { return unwrap(await this.client.rpc('mathsexpress_claim_daily_mission',{p_mission_id:String(missionId||'')})) || {}; }
  async spendGameTime(seconds) { return unwrap(await this.client.rpc('mathsexpress_spend_game_time',{p_seconds:Math.max(0,Math.min(300,Math.floor(Number(seconds)||0)))})) || {}; }
  async purchaseCosmeticServer(itemId) { return unwrap(await this.client.rpc('mathsexpress_purchase_cosmetic',{p_item_id:String(itemId||'')})) || {}; }
  async equipCosmeticServer(category,itemId) { return unwrap(await this.client.rpc('mathsexpress_equip_cosmetic',{p_category:String(category||''),p_item_id:String(itemId||'')})) || {}; }

  async grantStudentRewards(classId, studentId, { coins = 0, gameTimeSeconds = 0, reason = '' } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_teacher_grant_rewards', {
      p_class_id:String(classId), p_student_id:String(studentId),
      p_coins:Math.max(0,Math.min(500,Math.floor(Number(coins)||0))),
      p_game_time_seconds:Math.max(0,Math.min(300,Math.floor(Number(gameTimeSeconds)||0))),
      p_reason:String(reason||'Teacher reward').slice(0,240),
    }));
  }

  async updateStudentIdentity(studentId, { displayName = '', username = null } = {}) {
    return unwrap(await this.client.rpc('mathsexpress_staff_update_user_identity', {
      p_user_id:String(studentId),
      p_display_name:String(displayName||'').trim().slice(0,40),
      p_username:username == null ? null : String(username||'').trim().slice(0,24),
    }));
  }

  async claimTeacherRewards() {
    return unwrap(await this.client.rpc('mathsexpress_claim_teacher_rewards', {})) || { coins:0, game_time_seconds:0, grants:0 };
  }

  async ownerActivityStats() {
    return unwrap(await this.client.rpc('mathsexpress_owner_activity_stats', {})) || {};
  }

}

return {MathRiftSchoolClient};
})();
