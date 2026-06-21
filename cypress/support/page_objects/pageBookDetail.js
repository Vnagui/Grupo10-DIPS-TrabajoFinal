// support/page_objects/pageBookDetail.js

const pageBookDetail = {

  clickFirstBook() {
    cy.get('app-book-card').first().click()
  },

  isDetailPageVisible() {
    cy.get('app-book-details').should('be.visible')
  },

  isBookTitleVisible() {
    cy.get('app-book-details').find('h3').should('be.visible')
  },

  isCategoryFantasy() {
    cy.get('app-book-details').should('contain.text', 'Fantasy')
  },

  isAddToCartButtonVisible() {
    cy.get('app-book-details')
      .find('button')
      .contains('Add to Cart')
      .should('be.visible')
  }

}

module.exports = pageBookDetail