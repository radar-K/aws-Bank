## CHECKLISTA

Sidor på sajten
Banken har följande sidor på sin sajt:

Landningssida Ska innehålla navigering med länkar till Hem, logga in och skapa användare och en hero-section med knapp till skapa användare

Skapa användare Ett fält för användarnamn och ett för lösenord. Datat ska sparas i arrayen users i backend och ett bankkonto skapas i backend med 0 kr som saldo.

Logga in Ett fält för användarnamn och ett för lösenord och en logga in knapp. När man klickat på knappen ska man få tillbaka sitt engångslösenord i response och skickas till kontosidan med useRouter.

Kontosida Här kan man se sitt saldo och sätta in pengar på kontot. För att göra detta behöver man skicka med sitt engångslösenord till backend.

## CHECKLISTA BACKEND

Endpoints och arrayer
I backend skapa tre tomma arrayer: users, accounts och sessions.
Skapa endpoints för:
Skapa användare (POST): "/users"
Logga in (POST): "/sessions"
Visa salodo (POST): "/me/accounts"
Sätt in pengar (POST): "/me/accounts/transactions"
När man loggar in ska ett engångslösenord skapas och skickas tillbaka i response.
När man hämtar saldot ska samma engångslösenord skickas med i Post.
