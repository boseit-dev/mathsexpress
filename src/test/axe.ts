import axe from 'axe-core';

/**
 * Runs the axe-core accessibility checks and returns readable descriptions of any problems.
 * Colour contrast is skipped because jsdom cannot compute colours; it is checked in the browser.
 */
export async function findAccessibilityProblems(context: Element = document.body) {
  const results = await axe.run(context, { rules: { 'color-contrast': { enabled: false } } });
  return results.violations.map(
    (violation) =>
      `${violation.id}: ${violation.help} (${violation.nodes.map((node) => node.target.join(' ')).join(', ')})`,
  );
}
