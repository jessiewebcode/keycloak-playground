
Important URLs:
  * http://127.0.0.1:4300/jessies-world --> Test UI
  * http://localhost:9860 --> Backend
  * http://localhost:9861/auth/admin/master/console/#/realms/neutrality-1 --> Auth server
  * http://localhost:8080, 8001 --> (jBPM) : Kie Client - root url configured ()<

How to start:

* In a new terminal, in the repos root directory, run:
  1. cd backend/api && npm i
  2. cd ..
  3. ./run-api.sh

* In a new terminal, in the repos root directory, run:
  1. cd backend && ./run-auth.sh

Now we have running the API and the auth server (Keycloak)

Now we can start the neutrality application, and access it through 127.0.0.1:4300
We will be presented with the normal login screen, but there will be an option to "Try out" another login method
After logging in with the keycloak user, we can access /jessies-world to test this new setup

Current users:
  Auth server admin (only works with the master realm in Keycloak, not our app):
    neutrality neutrality1
  Test user 1 (a basic user, with no permissions whatsoever, not even requesting from the API):
    testuser1 pass1
  App user (a basic user, this can access the app and request from the api):
    appuser pass1
  Admin user (an admin, can do pretty much everything, inside neutrality app scope, of course):
    admin pass1

For JBPM:
  jbpm admin: jbpm_admin
    password: jbpm_admin
  Or any user in our keycloak server

We can also use SOLID providers (currently Inrupt and SolidCommunity are configured)
