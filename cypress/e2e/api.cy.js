import user from '../fixtures/user.json'
import envUrls from '../fixtures/url.json';

describe('Casos de prueba de APIs', () => {
    before(function () {
        cy.loginAPI(user.name, user.password)
    })

    it('API | Comprar carrito exitosamente', () => {
        cy.postCheckOutAPI(user.userId, user.token, 200)
    })

    it('API | Error al comprar carrito sin token', () => {
        cy.postCheckOutAPI(user.userId, '', 401)
    })

    it('Login API exitoso | Matias Crespo', () => {
        cy.APIlogin('username', 'Password1', 200);
    })

    it('Login API campo incorrecto | Matias Crespo', () => {
        cy.APIlogin('username', 'PasswordIncorrecta', 401);
    })

    it('API | Checkout exitoso con datos válidos | María Nuñez', function () {
    cy.loginAPIFresh(user.name, user.password)
    cy.get('@freshToken').then((token) => {
      cy.get('@freshUserId').then((userId) => {
        cy.checkoutAPI(userId, token, 200)
      })
    })
  })

  it('API | Error al comprar carrito sin token | María Nuñez', function () {
    cy.checkoutAPI(user.userID, '', 401)
  })

})

it('API | Obtener catálogo de libros | Facundo Sosa', () => {
    cy.getBookList(envUrls.api)
});

it('API | Obtener libro individual por ID válido | Facundo Sosa', () => {
    cy.getBookById(envUrls.api, 2, false).then((response) => {
        expect(response.status).to.eq(200);
    });
});

it('API | Obtener libro con ID inexistente | Facundo Sosa', () => {
    cy.getBookById(envUrls.api, 99999, false).then((response) => {
        expect(response.status).to.eq(404);
    });
});

it('API | Autenticación con credenciales válidas | Facundo Sosa', () => {
    cy.loginByApi("https://app.bookdbqa.online/api", user.name, user.password);
});

it('API | Autenticación con credenciales inválidas | Magali', () => {
    cy.invalidAPILogin(envUrls.api, user.name)
});

it('Agregar libro a favoritos sin credenciales API 4 | Magali Gonzalez', () => {
    cy.postToggleWishlistAPI(user.userId, user.wishlistBookId, '', 401)
})