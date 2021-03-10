const express = require('express');
const cors = require('cors');
const utils = require('./utils');
const validation = require('./utils/validation');
const jbpmRouter = require('./jbpm');
/**
 * Previous configurations
 */

const keycloak = require('keycloak-backend')({
  realm: 'neutrality-1',
  'auth-server-url': 'http://localhost:9861/',
  client_id: 'microservice-node-test-api'
});

/**
 * Server instantiation
 */
const app = express();
const port = 9860;
app.use(cors());

app.get('/', (req, res) => {
  res.send({
    success: true,
    message: 'Server works!'
  });
});

/**
 * Server routing
 */

app.use('/jbpm', jbpmRouter.router);

app.get(
  '/protected-resource',
  validation.keycloakLoggedInWithServer({ appRoles: ['can-use-app'] }),
  (req, res) => {
    res.send({
      success: true,
      message: 'The user has the "can-use-app" role'
    });
  }
);

app.get(
  '/admin-resource',
  validation.keycloakLoggedInWithServer({ appRoles: ['app-admin'] }),
  (req, res) => {
    res.send({
      success: true,
      message: 'The user is an admin, and can access this resource'
    });
  }
);

app.get('/validate-token', async (req, res) => {
  utils.log('  Validating token: ' + JSON.stringify(req.headers));

  const generatedResponse = {
    didSimpleTokenVerificationPass: 'unknown',
    serverVerificationWithLibrary: {
      isExpired: 'unknown',
      isUser: 'unknown',
      isRealmAdmin: 'unknown',
      isAppAdmin: 'unknown',
      canUseApplication: 'unknown'
    }
  };

  const isTokenValid = await validation.validateBearerTokenWithServer(req.headers.authorization);
  generatedResponse.didSimpleTokenVerificationPass = isTokenValid;

  try {
    const secondMethodValidation = await keycloak.jwt.verify(
      req.headers.authorization.split(' ')[1]
    );
    // verify
    generatedResponse.serverVerificationWithLibrary.isExpired = secondMethodValidation.isExpired();

    generatedResponse.serverVerificationWithLibrary.isUser = secondMethodValidation.hasRealmRole(
      'user'
    );
    generatedResponse.serverVerificationWithLibrary.isRealmAdmin = secondMethodValidation.hasRealmRole(
      'admin'
    );

    generatedResponse.serverVerificationWithLibrary.canUseApplication = secondMethodValidation.hasApplicationRole(
      'neutrality-app-local',
      'can-use-app'
    );
    generatedResponse.serverVerificationWithLibrary.isAppAdmin = secondMethodValidation.hasApplicationRole(
      'neutrality-app-local',
      'app-admin'
    );
  } catch (error) {
    console.log(error);
    generatedResponse.serverVerificationWithLibrary =
      error && error.response && error.response.data;
  }

  res.send(generatedResponse);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
