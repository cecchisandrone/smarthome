describe('reboot router', () => {
  it('passes', () => {
    cy.visit('http://' + Cypress.env('routerIp') + '/login.html');
    cy.get('#userId').clear({delay : 1000});
    cy.get('#password').clear({delay : 1000});
    cy.wait(500);
    cy.get('#userId').type(Cypress.env('routerUsername'));
    cy.wait(500);
    cy.get('#password').type(Cypress.env('routerPassword'));
    cy.get('#loginBt').click();
    cy.wait(5000);
    cy.get('#settingsSpan').click();
    cy.get('#otherSettings').click();
    cy.wait(5000);
    cy.get('#restartBt').click();
    cy.wait(5000);
    cy.get('#restartYesBt').click();
  })
})