import user from '../fixtures/user.json'
import url from '../fixtures/url.json'
const pageHome = require('../support/page_objects/pageHome')
const componentNav = require('../support/page_objects/componentNav')
const pageShoppingCart = require('../support/page_objects/pageShoppingCart')
const pageCheckout = require('../support/page_objects/pageCheckout')
const pageWishlist = require('../support/page_objects/pageWishlist')
const pageBookDetail = require('../support/page_objects/pageBookDetail')
describe('Casos de prueba de FRONT', () => {
  before(function () {
    cy.loginAPI(user.name, user.password)
  })

  it.skip('Comprar carrito exitosamente y visualizar orden de compra', () => {
    cy.buyAndVisualizeOrder();
  })

  it('Borrar item del carrito | Matias Crespo', () => {
    cy.eliminar_carrito();
  })

 it('Filtrar por categoría Fantasy y verificar detalle de libro | María Nuñez', () => {
    cy.visit(url.login)
    cy.login(user.name, user.password)
    cy.url().should('include', url.home)

    cy.filterByCategory('Fantasy')
    pageHome.hasBooksVisible()
    pageHome.isCategoryLabelVisible('Fantasy')

    cy.selectFirstBook()
    pageBookDetail.isDetailPageVisible()
    pageBookDetail.isBookTitleVisible()
    pageBookDetail.isCategoryFantasy()
    pageBookDetail.isAddToCartButtonVisible()
  })


  it('Comprar carrito exitosamente y visualizar orden de compra | Magali Gonzalez', function () {
    cy.deleteCartAPI(user.userID, user.token)

    cy.visit(url.login)
    cy.login(user.name, user.password)
    cy.url().should('include', url.home)

    pageHome.isBookVisible()
    componentNav.validationNumberCartBadge('0')
    pageHome.clickAddToCartButton()
    pageHome.validateAddToCartToast()
    componentNav.validationNumberCartBadge('1')

    componentNav.goToCart()
    cy.url().should('include', url.shoppingCart)
    pageShoppingCart.isBookVisible()
    pageShoppingCart.clickCheckOutButton()

    cy.url().should('include', url.checkout)
    pageCheckout.isCheckoutFormVisible()
    pageCheckout.fillShippingForm(user.formName, user.address1, user.address2, user.pincode, user.state)
    pageCheckout.clickPlaceOrder()

    cy.url().should('include', url.myOrders)
    cy.get('.mat-mdc-row').should('be.visible')
    cy.get('.mat-mdc-row').eq(0).click()
  })

  it('Agregar libro a favoritos exitosamente Front | Magali Gonzalez', function () {
    cy.deleteWishlistAPI(user.userID, this.token)

    cy.visit(url.login)
    cy.login(user.name, user.password)
    cy.url().should('include', url.home)

    pageHome.isBookVisible()
    componentNav.validationNumberWishlistBadge('0')
    pageHome.clickFavouriteButton()
    pageHome.validateAddToWishlistToast()
    componentNav.validationNumberWishlistBadge('1')

    componentNav.goToWishlist()
    cy.url().should('include', url.wishlist)
    pageWishlist.isBookVisible()

    pageWishlist.clickBook()
    cy.url().should('include', url.bookDetail)
    cy.contains('Harry Potter and the Chamber of Secrets').should('be.visible')
    pageWishlist.goBack()
    pageWishlist.isBookVisible()
  })

})
//it.only ejecutar solo ese caso de prueba
//it.skip no ejecuta ese caso de prueba
