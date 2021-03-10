const axios = require('axios').default;
const keycloak = require('keycloak-backend')({
  realm: 'neutrality-1',
  'auth-server-url': 'http://localhost:9861/',
  client_id: 'microservice-node-test-api'
});

// Online validation
/**
 * This works because when requesting the user, Keycloak server
 * performs a validation by itself, but is not needed, as we can use
 * offline validation by verifying ourselves the signature
 * @param {*} token
 */
async function validateBearerTokenWithServer(token) {
  const realmName = 'neutrality-1';
  const url = `http://localhost:9861/auth/realms/${realmName}/protocol/openid-connect/userinfo`;
  let axiosResponse;
  let invalidToken = false;

  try {
    axiosResponse = await axios.get(url, {
      headers: {
        Authorization: token
      }
    });
  } catch (error) {
    if (error.response.status === 401) {
      invalidToken = true;
    }
  }

  console.log(axiosResponse && axiosResponse.data);

  return !!(axiosResponse && axiosResponse.data);
}

function keycloakLoggedInWithServer(options = {}) {
  return async function (req, res, next) {
    try {
      const serverValidation = await keycloak.jwt.verify(req.headers.authorization.split(' ')[1]);
      const isAdmin = serverValidation.hasApplicationRole('neutrality-app-local', 'app-admin');

      if (options.appRoles && !isAdmin) {
        // Go through each app role needed, error if missing one
        for (const appRole of options.appRoles) {
          const hasRole = serverValidation.hasApplicationRole('neutrality-app-local', appRole);

          if (!hasRole) {
            res.send({
              error: true,
              missingAppRole: appRole
            });

            return;
          }
        }
      }

      next();
    } catch (error) {
      console.log(error);
      res.send({
        error: true,
        message: error.response.data
      });
    }
  };
}

module.exports = {
  validateBearerTokenWithServer,
  keycloakLoggedInWithServer
};
