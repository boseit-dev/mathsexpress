import type { YearLevel } from '@/domain/student';

/** Original MathsExpress books. NESA defines syllabus stages, not a compulsory
 * year-by-year chapter order; chapter sequences remain editorial until reviewed. */
export interface TextbookChapter {
  id: string;
  title: string;
  status: 'ready' | 'planned';
  strand?: string;
}

export interface TextbookBook {
  id: string;
  year: YearLevel;
  course: string;
  stage: string;
  syllabus: string;
  syllabusUrl: string;
  chapters: readonly TextbookChapter[];
}

const NSW_K10 =
  'https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-k-10-2022/overview';
const NSW_STANDARD =
  'https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-standard-11-12-2024/overview/course';

const guide: TextbookChapter = {
  id: 'getting-started',
  title: 'Getting started with your textbook',
  status: 'ready',
};

/** These are syllabus focus-area headings, not a claim that individual lessons are written.
 * NESA sets learning outcomes by STAGE; textbooks for adjacent years share these headings. */
const earlyFocus = [
  'Representing whole numbers',
  'Combining and separating quantities',
  'Forming groups',
  'Geometric measure',
  '2D spatial structure',
  '3D spatial structure',
  'Non-spatial measure',
  'Data',
  'Chance',
] as const;
const stage2Focus = [
  'Representing numbers using place value',
  'Additive relations',
  'Multiplicative relations',
  'Partitioned fractions',
  'Geometric measure',
  '2D spatial structure',
  '3D spatial structure',
  'Non-spatial measure',
  'Data',
  'Chance',
] as const;
const stage3Focus = [
  'Representing numbers',
  'Additive relations',
  'Multiplicative relations',
  'Representing quantity fractions',
  'Geometric measure',
  '2D spatial structure',
  '3D spatial structure',
  'Non-spatial measure',
  'Data',
  'Chance',
] as const;
/** Broad Core and Path focus groups from the NSW K–10 (2022) syllabus. */
const coreFocus = [
  'Number and finance',
  'Algebra and equations',
  'Ratios and rates',
  'Linear and non-linear relationships',
  'Pythagoras and trigonometry',
  'Length, area and volume',
  'Geometrical properties and figures',
  'Data classification, visualisation and analysis',
  'Probability',
] as const;
const pathFocus = [
  'Further algebra and equations',
  'Variation and rates of change',
  'Functions and graphs',
  'Further trigonometry',
  'Further area and volume',
  'Geometrical figures and proof',
  'Introduction to networks',
  'Data analysis and statistical enquiry',
  'Further probability',
] as const;
const lifeSkillsFocus = [
  'Number and finance',
  'Measurement and space',
  'Statistics and probability',
] as const;

function focusChapters(
  titles: readonly string[],
  strand: string,
  prefix: string,
): TextbookChapter[] {
  return titles.map((title, index) => ({
    id: `${prefix}-${index + 1}`,
    title,
    status: 'planned' as const,
    strand,
  }));
}

/** Stage names are factual; year-specific chapter order is not prescribed by NESA. */
export function stageForYear(year: YearLevel): string {
  if (year === 'K') return 'Early Stage 1';
  if (year <= 2) return 'Stage 1';
  if (year <= 4) return 'Stage 2';
  if (year <= 6) return 'Stage 3';
  if (year <= 8) return 'Stage 4';
  if (year <= 10) return 'Stage 5';
  return 'Stage 6';
}

function k10Book(year: YearLevel, lifeSkills = false): TextbookBook {
  const title = year === 'K' ? 'Kindergarten' : `Year ${year}`;
  const stage = stageForYear(year);
  const pilot: TextbookChapter[] =
    year === 9 && !lifeSkills
      ? [
          {
            id: 'solving-linear-equations',
            title: 'Solving linear equations',
            status: 'ready',
            strand: 'Number and algebra',
          },
        ]
      : [];
  const outlines = lifeSkills
    ? focusChapters(lifeSkillsFocus, 'Life Skills — teacher-selected outcomes', 'life-skills')
    : stage === 'Early Stage 1' || stage === 'Stage 1'
      ? focusChapters(earlyFocus, 'Stage focus areas', 'focus')
      : stage === 'Stage 2'
        ? focusChapters(stage2Focus, 'Stage focus areas · Parts A and B', 'focus')
        : stage === 'Stage 3'
          ? focusChapters(stage3Focus, 'Stage focus areas · Parts A and B', 'focus')
          : [
              ...focusChapters(coreFocus, 'Stage 4/5 Core', 'core'),
              ...(stage === 'Stage 5' ? focusChapters(pathFocus, 'Stage 5 Paths', 'path') : []),
            ];
  return {
    id: `${year === 'K' ? 'kindergarten' : `year-${year}`}${lifeSkills ? '-life-skills' : ''}`,
    year,
    course: lifeSkills ? `${title} Mathematics Life Skills` : `${title} Mathematics`,
    stage,
    syllabus: 'NSW Mathematics K–10 (2022)',
    syllabusUrl: NSW_K10,
    chapters: [guide, ...pilot, ...outlines],
  };
}

function seniorBook(
  year: 11 | 12,
  course: string,
  id: string,
  focusAreas: readonly string[] = [],
): TextbookBook {
  const syllabusUrl = course.startsWith('Standard')
    ? NSW_STANDARD
    : course === 'Advanced'
      ? 'https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-advanced-11-12-2024/overview'
      : course === 'Extension 1'
        ? 'https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-extension-1-11-12-2024/overview'
        : course === 'Extension 2'
          ? 'https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-extension-2-11-12-2024/overview'
          : 'https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-life-skills-11-12-2024/overview';
  return {
    id: `year-${year}-${id}`,
    year,
    course: `Year ${year} ${course}`,
    stage: 'Stage 6',
    syllabus: 'NSW Mathematics 11–12 (2024)',
    syllabusUrl,
    chapters: [guide, ...focusChapters(focusAreas, 'Syllabus focus areas', 'focus')],
  };
}

// These headings for Mathematics Standard come from the 2024 NESA course overview.
// Other course books begin with a guide until their distinct focus areas are audited.
const standard11 = [
  'Formulas and equations',
  'Linear relationships',
  'Earning money',
  'Managing money',
  'Applications of measurement',
  'Time and location',
  'Networks, paths and trees',
  'Data analysis',
];
const standard12_1 = [
  'Algebraic relationships',
  'Investment',
  'Depreciation and loans',
  'Right-angled triangles',
  'Ratios and rates',
  'Bivariate data analysis',
  'Relative frequency and probability',
];
const standard12_2 = [
  'Algebraic relationships',
  'Investment and loans',
  'Annuities',
  'Trigonometry',
  'Ratios and rates',
  'Network flow',
  'Critical path analysis',
  'Bivariate data analysis',
  'Relative frequency and probability',
  'The normal distribution',
];

/** The new NSW 2024 senior focus areas are taught in Year 11 from 2026 and
 * Year 12 from Term 4 2026. Keep courses separate, not combined. */
const advanced11 = [
  'Working with functions',
  'Graph transformations',
  'Trigonometry and measure of angles',
  'Trigonometric identities and equations',
  'Introduction to differentiation',
  'Exponential and logarithmic functions',
  'Probability and data',
] as const;
const advanced12 = [
  'Further graph transformations and modelling',
  'Sequences and series',
  'Differential calculus',
  'Integral calculus',
  'Applications of calculus',
  'Random variables',
  'Financial mathematics',
] as const;
const extension11 = [
  'Further work with functions',
  'Polynomials',
  'Further trigonometry',
  'Permutations and combinations',
  'The binomial theorem',
] as const;
const extension12 = [
  'Proof by mathematical induction',
  'Introduction to vectors',
  'Inverse trigonometric functions',
  'Further calculus skills',
  'Further applications of calculus',
  'The binomial distribution and the sampling distribution of the mean',
] as const;
const extension2 = [
  'The nature of proof',
  'Further work with vectors',
  'Introduction to complex numbers',
  'Further integration',
  'Applications of calculus to mechanics',
] as const;
const seniorLifeSkills = [
  'Number',
  'Financial mathematics',
  'Measurement',
  'Plans, maps and networks',
  'Data, statistics and probability',
  'Mathematics project',
] as const;

export const textbookBooks: readonly TextbookBook[] = [
  ...(['K', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const).map((year) => k10Book(year)),
  ...([7, 8, 9, 10] as const).map((year) => k10Book(year, true)),
  seniorBook(11, 'Standard', 'standard', standard11),
  seniorBook(11, 'Advanced', 'advanced', advanced11),
  seniorBook(11, 'Extension 1', 'extension-1', extension11),
  seniorBook(11, 'Life Skills', 'life-skills', seniorLifeSkills),
  seniorBook(12, 'Standard 1', 'standard-1', standard12_1),
  seniorBook(12, 'Standard 2', 'standard-2', standard12_2),
  seniorBook(12, 'Advanced', 'advanced', advanced12),
  seniorBook(12, 'Extension 1', 'extension-1', extension12),
  seniorBook(12, 'Extension 2', 'extension-2', extension2),
  seniorBook(12, 'Life Skills', 'life-skills', seniorLifeSkills),
];

export function findTextbook(id: string | undefined): TextbookBook | undefined {
  return textbookBooks.find((book) => book.id === id);
}

export function findTextbookChapter(book: TextbookBook, id: string | undefined) {
  return book.chapters.find((chapter) => chapter.id === id);
}
