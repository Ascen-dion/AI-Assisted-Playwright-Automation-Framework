// === FILE: src/tests/application/workday-job-search-automated.spec.js ===
const { test, expect } = require('../../fixtures');
const WorkdayFinancePage = require('../../pages/workday-finance.page');
const TD = require('../../data/workday-test-data');

test.describe('[UI] CAP-201: Capital One Careers Job Search', {
  tag: ['@smoke', '@regression', '@capital-one'],
}, () => {

  test('[C658] Test Case 1: Search for qa jobs returns 9 JOBS FOUND', async ({ page }) => {
    const careers = new WorkdayFinancePage(page);

    // Navigate to Capital One careers home page
    await careers.gotoJobSearch();

    // Enter 'qa' in the search text box and click Search
    const jobCount = await careers.searchJobsAndGetCount(TD.jobSearch.keyword);

    // Assert the jobs found count matches expected value
    expect(jobCount).toBe(TD.jobSearch.expectedJobCount);
  });

});
