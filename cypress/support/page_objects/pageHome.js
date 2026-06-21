// support/page_objects/pageHome.js

const BOOK_NAME = 'Harry Potter and the Chamber of Secrets'

const pageHome = {

  // Verifica que el libro esté visible en el catálogo
  isBookVisible() {
    cy.get('app-book-card').contains(BOOK_NAME).should('be.visible')
  },

  // Hace click en el botón "Add to Cart" del primer libro
  clickAddToCartButton() {
    cy.get('button').contains('Add to Cart').click()
  },

  // Verifica el mensaje de confirmación al agregar al carrito
  validateAddToCartToast() {
    cy.contains('One Item added to cart').should('be.visible')
  },

  // Hace click en el ícono de favorito del primer libro
  clickFavouriteButton() {
    cy.get('.favourite-unselected').eq(0).click()
  },

  // Verifica el mensaje de confirmación al agregar a wishlist
  validateAddToWishlistToast() {
    cy.contains('Added to Wishlist!!!').should('exist')
  },
 
  // Hace clic en una categoría del panel lateral
  filterByCategory(category) {
    cy.contains(category).click()
  },

  // Verifica que hay al menos un libro visible en el catálogo
  hasBooksVisible() {
    cy.get('app-book-card').should('have.length.greaterThan', 0)
  },

  // Verifica que la categoría seleccionada sigue marcada/visible
  isCategoryLabelVisible(category) {
    cy.contains(category).should('be.visible')
  }

}

module.exports = pageHome