import user from '../fixtures/user.json'
import url from '../fixtures/url.json'
const pageHome = require('../support/page_objects/pageHome')
const componentNav = require('../support/page_objects/componentNav')
const pageLogin = require('../support/page_objects/pageLogin')
const pageBookDetail = require('../support/page_objects/pageBookDetail')

Cypress.Commands.add('login', (name, password) => {
  pageLogin.typeUserName(name);
  pageLogin.typeUserPassword(password);
  pageLogin.clickLoginButton();
})

Cypress.Commands.add('deleteCartAPI', (userId) => {
  cy.request({
    method: 'DELETE',
    url: `https://app.bookdbqa.online/api/shoppingcart/${userId}`,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: ''
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
  })
})


Cypress.Commands.add('postCheckOutAPI', (userId, token, codeResponse) => {

  cy.request({
    method: 'POST',
    url: `https://app.bookdbqa.online/api/CheckOut/${userId}`,
    failOnStatusCode: false, // importante para que cypress no falle automaticamente ante un error 400 o 500
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: token,
    },
    body:
    {
      "orderDetails": [
        {
          "book": {
            "bookId": 3,
            "title": "Harry Potter and the Prisoner of Azkaban",
            "author": "JKR",
            "category": "Romance",
            "price": 213,
            "coverFileName": "c63ade52-3f90-41fa-980a-1136b6ad2128HP3.jpg"
          },
          "quantity": 1
        }
      ],
      "cartTotal": 213
    }
  }).then((response) => {
    expect(response.status).to.eq(codeResponse)
  })

})

Cypress.Commands.add('APIlogin', (user, password, codeResponse) => {
  cy.request({
    method: 'POST',
    url: 'https://app.bookdbqa.online/api/login',
    failOnStatusCode: false,
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      username: user,
      password: password
    }
  }).then((response) => {
    expect(response.status).to.eq(codeResponse);
  });
});

Cypress.Commands.add('eliminar_carrito', () => {
  cy.visit(url.login);
  cy.login(user.name, user.password);
  cy.url().should('include', url.home);
  pageHome.isBookVisible();
  pageHome.clickAddToCartButton();
  cy.contains('One Item added to cart').should('be.visible');

  cy.get('.mdc-icon-button.mat-mdc-icon-button.mat-mdc-button-base.mat-unthemed')
    .contains('shopping_cart')
    .click();

  cy.get('button[mattooltip="Delete item"]')
    .first()
    .click();

  cy.contains('Your shopping cart is empty')
    .should('be.visible');
});

Cypress.Commands.add('filtrar_fantasy', () => {
  cy.visit(url.login)
  cy.login(user.name, user.password);
  cy.get('app-book-card').should('have.length.greaterThan', 0)
  cy.contains('Fantasy').click()
  cy.get('app-book-card').should('have.length.greaterThan', 0)
  cy.contains('Fantasy').should('be.visible')
})

Cypress.Commands.add('loginByApi', (apiUrl, username, password) => {
  cy.request({
    method: 'POST',
    url: `${apiUrl}/Login`, //la url se consigue del parámetro
    body: { username, password } //lo mismo con el usuario y contraseña
  }).then((response) => {
    expect(response.status).to.eq(200);

    //guarda el token de manera local en el browser.
    //https://stackoverflow.com/questions/50820732/in-cypress-set-a-token-in-localstorage-before-test
    window.localStorage.setItem('authToken', response.body.token);
    Cypress.apiToken = response.body.token;
    Cypress.userID = response.body.userDetails.userID;
  });
});

// ─── Comando: Login via API (obtiene token fresco automáticamente) ────────────
Cypress.Commands.add('loginAPI', (username, password) => {
  cy.request({
    method: 'POST',
    url: 'https://app.bookdbqa.online/api/login',
    failOnStatusCode: false,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: { username, password }
  }).then((response) => {
    const token = `Bearer ${response.body.token}`
    cy.wrap(token).as('token')
  })
})

// ─── Comando: Login via UI ───────────────────────────────────────────────────
Cypress.Commands.add('login', (username, password) => {
  cy.get('input[formcontrolname="username"]').type(username)
  cy.get('input[formcontrolname="password"]').type(password)
  cy.get('app-login button').contains('Login').click()
})

// ─── Comando: Eliminar carrito via API ───────────────────────────────────────
Cypress.Commands.add('deleteCartAPI', (userId, token) => {
  cy.request({
    method: 'DELETE',
    url: `https://app.bookdbqa.online/api/shoppingcart/${userId}`,
    failOnStatusCode: false,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: token
    }
  })
})

// ─── Comando: Eliminar wishlist via API ──────────────────────────────────────
Cypress.Commands.add('deleteWishlistAPI', (userId, token) => {  // ✅ userId (minúscula)
  cy.request({
    method: 'DELETE',
    url: `https://app.bookdbqa.online/api/Wishlist/${userId}`,  // ✅ userId (minúscula)
    failOnStatusCode: false,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: token
    }
  })
})

Cypress.Commands.add('loginByApi', (apiUrl, username, password) => {
  cy.request({
    method: 'POST',
    url: `${apiUrl}/Login`, //la url se consigue del parámetro
    body: { username, password } //lo mismo con el usuario y contraseña
  }).then((response) => {
    expect(response.status).to.eq(200);

    //guarda el token de manera local en el browser.
    //https://stackoverflow.com/questions/50820732/in-cypress-set-a-token-in-localstorage-before-test
    window.localStorage.setItem('authToken', response.body.token);
    Cypress.apiToken = response.body.token;
    Cypress.userID = response.body.userDetails.userID;
  });
});

// ─── Comando: POST Checkout via API ─────────────────────────────────────────
Cypress.Commands.add('postCheckOutAPI', (userId, token, expectedStatus) => {
  cy.request({
    method: 'POST',
    url: `https://app.bookdbqa.online/api/CheckOut/${userId}`,
    failOnStatusCode: false,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: token
    },
    body: {
      orderDetails: [
        {
          book: {
            bookId: 3,
            title: 'Harry Potter y el prisionero de Azkaban',
            author: 'JKR',
            category: 'Romance',
            price: 213,
            coverFileName: 'c63ade52-3f90-41fa-980a-1136b6ad2128HP3.jpg'
          },
          quantity: 1
        }
      ],
      cartTotal: 213
    }
  }).then((response) => {
    expect(response.status).to.eq(expectedStatus)
  })
})

// ─── Comando: POST Toggle Wishlist via API ───────────────────────────────────
Cypress.Commands.add('postToggleWishlistAPI', (userId, bookId, token, expectedStatus) => {
  cy.request({
    method: 'POST',
    url: `https://app.bookdbqa.online/api/Wishlist/ToggleWishlist/${userId}/${bookId}`,
    failOnStatusCode: false,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: token
    },
    body: {}
  }).then((response) => {
    expect(response.status).to.eq(expectedStatus)
  })
})

//Credenciales inválidas por API
Cypress.Commands.add('invalidAPILogin', (apiUrl, user) => {
  cy.request({
    method: 'POST',
    url: `${apiUrl}/Login`,
    failOnStatusCode: false,
    body: {
      username: user,
      password: "WrongPassword123!"
    }
  }).then((response) => {
    expect(response.status).to.eq(401);
  });
})

//Conseguir un libro por ID
Cypress.Commands.add('getBookById', (apiUrl, bookId, failOnStatusCode = true) => {
  return cy.request({
    method: 'GET',
    url: `${apiUrl}/Book/${bookId}`,
    failOnStatusCode: failOnStatusCode
  });
});

//Conseguir todos los libros
Cypress.Commands.add('getBookList', (apiUrl) => {
  cy.request('GET', `${apiUrl}/Book`).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.be.an('array');

    //si hay al menos 1 libro, ya es correcto. Después verifica que ese libro tenga título e ID
    expect(response.body.length).to.be.greaterThan(0);
    expect(response.body[0]).to.have.property('bookId');
    expect(response.body[0]).to.have.property('title');
  });
})
//Comprar carrito exitosamente y visualizar orden de compra

Cypress.Commands.add('buyAndVisualizeCart', () => {
  cy.deleteCartAPI(user.userID);
  cy.visit(url.login)
  cy.login(user.name, user.password);
  cy.url().should('include', url.home)
  pageHome.isBookVisible();
  componentNav.validationNumberCartBadge('0')
  pageHome.clickAddToCartButton();
  cy.contains('One Item added to cart').should('be.visible')
  componentNav.validationNumberCartBadge('1')
  cy.get('.mdc-icon-button.mat-mdc-icon-button.mat-mdc-button-base.mat-unthemed').contains('shopping_cart').click()

})

//Comprar carrito exitosamente y visualizar orden de compra | Magali Gonzalez
Cypress.Commands.add('buyAndVisualizeOrder',() => {
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

    // ─── Comando: Filtrar Fantasy y verificar detalle | María Nuñez ──────────────
Cypress.Commands.add('filtrarFantasyYVerificarDetalle', () => {
  cy.visit(url.login)
  cy.login(user.name, user.password)
  cy.url().should('include', url.home)
  pageHome.isBookVisible()
  cy.contains('Fantasy').click()
  cy.get('app-book-card').should('have.length.greaterThan', 0)
  pageBookDetail.clickFirstBook()
  pageBookDetail.isDetailPageVisible()
  pageBookDetail.isBookTitleVisible()
  pageBookDetail.isCategoryFantasy()
  pageBookDetail.isAddToCartButtonVisible()
})

// ─── Comando: Checkout exitoso con login automático | María Nuñez ─────────────
Cypress.Commands.add('checkoutExitosoAPI', () => {
  cy.request({
    method: 'POST',
    url: `${url.api}login`,
    failOnStatusCode: false,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: { username: user.name, password: user.password }
  }).then((loginResponse) => {
    const token = `Bearer ${loginResponse.body.token}`
    const userId = loginResponse.body.userDetails.userId

    cy.request({
      method: 'POST',
      url: `${url.api}CheckOut/${userId}`,
      failOnStatusCode: false,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: token
      },
      body: {
        orderDetails: [{
          book: {
            bookId: 15,
            title: 'string',
            author: 'string',
            category: 'string',
            price: 0,
            coverFileName: 'string'
          },
          quantity: 1
        }],
        cartTotal: 0
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })
})

// ─── Comando: Checkout sin token → 401 | María Nuñez ─────────────────────────
Cypress.Commands.add('checkoutSinTokenAPI', () => {
  cy.postCheckOutAPI(user.userID, '', 401)
})




/*
//Credenciales inválidas por API

Cypress.Commands.add('commandName',() => {})
*/