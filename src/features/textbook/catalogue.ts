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
const NSW_SENIOR = 'https://curriculum.nsw.edu.au/learning-areas/mathematics';
const NSW_STANDARD =
  'https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-standard-11-12-2024/overview/course';

const guide: TextbookChapter = {
  id: 'getting-started',
  title: 'Getting started with your textbook',
  status: 'ready',
};

const k10Chapters: readonly TextbookChapter[] = [
  {
    id: 'number-and-algebra',
    title: 'Number and algebra',
    status: 'planned',
    strand: 'Number and algebra',
  },
  {
    id: 'measurement-and-space',
    title: 'Measurement and space',
    status: 'planned',
    strand: 'Measurement and space',
  },
  {
    id: 'statistics-and-probability',
    title: 'Statistics and probability',
    status: 'planned',
    strand: 'Statistics and probability',
  },
];

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
  return {
    id: `${year === 'K' ? 'kindergarten' : `year-${year}`}${lifeSkills ? '-life-skills' : ''}`,
    year,
    course: lifeSkills ? `${title} Mathematics Life Skills` : `${title} Mathematics`,
    stage: stageForYear(year),
    syllabus: 'NSW Mathematics K–10 (2022)',
    syllabusUrl: NSW_K10,
    chapters: [guide, ...pilot, ...k10Chapters],
  };
}

function seniorBook(
  year: 11 | 12,
  course: string,
  id: string,
  focusAreas: readonly string[] = [],
): TextbookBook {
  return {
    id: `year-${year}-${id}`,
    year,
    course: `Year ${year} ${course}`,
    stage: 'Stage 6',
    syllabus: 'NSW Mathematics 11–12 (2024)',
    syllabusUrl: course.startsWith('Standard') ? NSW_STANDARD : NSW_SENIOR,
    chapters: [
      guide,
      ...focusAreas.map((title, index) => ({
        id: `focus-${index + 1}`,
        title,
        status: 'planned' as const,
      })),
    ],
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

export const textbookBooks: readonly TextbookBook[] = [
  ...(['K', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const).map((year) => k10Book(year)),
  ...([7, 8, 9, 10] as const).map((year) => k10Book(year, true)),
  seniorBook(11, 'Standard', 'standard', standard11),
  seniorBook(11, 'Advanced', 'advanced'),
  seniorBook(11, 'Extension 1', 'extension-1'),
  seniorBook(11, 'Life Skills', 'life-skills'),
  seniorBook(12, 'Standard 1', 'standard-1', standard12_1),
  seniorBook(12, 'Standard 2', 'standard-2', standard12_2),
  seniorBook(12, 'Advanced', 'advanced'),
  seniorBook(12, 'Extension 1', 'extension-1'),
  seniorBook(12, 'Extension 2', 'extension-2'),
  seniorBook(12, 'Life Skills', 'life-skills'),
];

export function findTextbook(id: string | undefined): TextbookBook | undefined {
  return textbookBooks.find((book) => book.id === id);
}

export function findTextbookChapter(book: TextbookBook, id: string | undefined) {
  return book.chapters.find((chapter) => chapter.id === id);
}
