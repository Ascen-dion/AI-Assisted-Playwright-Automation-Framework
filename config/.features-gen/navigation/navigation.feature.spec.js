// Generated from: ..\src\bdd\features\navigation\navigation.feature
import { test } from "../../../src/bdd/support/fixtures.js";

test.describe('StarHub Website Navigation', () => {

  test.beforeEach('Background', async ({ Given, And, starhubPage }, testInfo) => { if (testInfo.error) return;
    await Given('the user navigates to the StarHub home page', null, { starhubPage }); 
    await And('the cookie consent is dismissed', null, { starhubPage }); 
  });
  
  test('Clicking SME navigates to the SME page', { tag: ['@navigation', '@regression', '@C0'] }, async ({ When, Then, page, starhubPage }) => { 
    await When('the user clicks the "SME" top nav link', null, { starhubPage }); 
    await Then('the page URL should contain "sme"', null, { page }); 
  });

  test('Clicking Enterprise navigates to the Business page', { tag: ['@navigation', '@regression', '@C0'] }, async ({ When, Then, page, starhubPage }) => { 
    await When('the user clicks the "Enterprise" top nav link', null, { starhubPage }); 
    await Then('the page URL should contain "business"', null, { page }); 
  });

  test('Clicking About Us navigates to the About Us page', { tag: ['@navigation', '@regression', '@C0'] }, async ({ When, Then, page, starhubPage }) => { 
    await When('the user clicks the "About Us" top nav link', null, { starhubPage }); 
    await Then('the page URL should contain "about-us"', null, { page }); 
  });

  test('Support link is accessible from the main navigation', { tag: ['@navigation', '@regression', '@C0'] }, async ({ Then, starhubPage }) => { 
    await Then('the "Support" link should be visible in the navigation', null, { starhubPage }); 
  });

  test('StarHub logo links back to the personal home page', { tag: ['@navigation', '@regression', '@C0'] }, async ({ When, Then, page }) => { 
    await When('the user clicks the StarHub logo', null, { page }); 
    await Then('the page URL should contain "personal"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('..\\src\\bdd\\features\\navigation\\navigation.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":13,"tags":["@navigation","@regression","@C0"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given the user navigates to the StarHub home page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And the cookie consent is dismissed","isBg":true,"stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When the user clicks the \"SME\" top nav link","stepMatchArguments":[{"group":{"start":20,"value":"\"SME\"","children":[{"start":21,"value":"SME","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then the page URL should contain \"sme\"","stepMatchArguments":[{"group":{"start":28,"value":"\"sme\"","children":[{"start":29,"value":"sme","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":16,"pickleLine":18,"tags":["@navigation","@regression","@C0"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given the user navigates to the StarHub home page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And the cookie consent is dismissed","isBg":true,"stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When the user clicks the \"Enterprise\" top nav link","stepMatchArguments":[{"group":{"start":20,"value":"\"Enterprise\"","children":[{"start":21,"value":"Enterprise","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then the page URL should contain \"business\"","stepMatchArguments":[{"group":{"start":28,"value":"\"business\"","children":[{"start":29,"value":"business","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":21,"pickleLine":23,"tags":["@navigation","@regression","@C0"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given the user navigates to the StarHub home page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And the cookie consent is dismissed","isBg":true,"stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":24,"keywordType":"Action","textWithKeyword":"When the user clicks the \"About Us\" top nav link","stepMatchArguments":[{"group":{"start":20,"value":"\"About Us\"","children":[{"start":21,"value":"About Us","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":23,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"Then the page URL should contain \"about-us\"","stepMatchArguments":[{"group":{"start":28,"value":"\"about-us\"","children":[{"start":29,"value":"about-us","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":26,"pickleLine":28,"tags":["@navigation","@regression","@C0"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given the user navigates to the StarHub home page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And the cookie consent is dismissed","isBg":true,"stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"Then the \"Support\" link should be visible in the navigation","stepMatchArguments":[{"group":{"start":4,"value":"\"Support\"","children":[{"start":5,"value":"Support","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":30,"pickleLine":32,"tags":["@navigation","@regression","@C0"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given the user navigates to the StarHub home page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And the cookie consent is dismissed","isBg":true,"stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":33,"keywordType":"Action","textWithKeyword":"When the user clicks the StarHub logo","stepMatchArguments":[]},{"pwStepLine":32,"gherkinStepLine":34,"keywordType":"Outcome","textWithKeyword":"Then the page URL should contain \"personal\"","stepMatchArguments":[{"group":{"start":28,"value":"\"personal\"","children":[{"start":29,"value":"personal","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end