docker network create neutrality_network;
docker stop n_poc_jbpm;
docker rm n_poc_jbpm;
docker build -t n_poc_jbpm_image -f jbpm/Dockerfile .;
# docker run --network=host -v ${PWD}/jbpm/data:/opt/jboss/wildfly/bin/.niogit:Z -p 8080:8080 -p 8001:8001 -d --name n_poc_jbpm n_poc_jbpm_image
# docker run --network="host" -p 8080:8080 -p 8001:8001 -d --name n_poc_jbpm jboss/jbpm-workbench-showcase:7.17.0.Final
docker run --network="host" -p 8080:8080 -p 8001:8001 -d --name n_poc_jbpm n_poc_jbpm_image

echo "Waiting for the container to start..."
sleep 5

## Insert assets
echo "copying assets: kc_adapter"
docker cp jbpm/config/kc_adapter/. n_poc_jbpm:/opt/jboss/wildfly
echo "copying assets: standalone configuration"
docker cp jbpm/config/standalone.xml n_poc_jbpm:/opt/jboss/wildfly/standalone/configuration/standalone.xml
echo "copying assets: keycloak json"
docker cp jbpm/config/keycloak.json n_poc_jbpm:/opt/jboss/wildfly/standalone/deployments/business-central.war/WEB-INF/keycloak.json
echo "permission: changing resources ownership"
docker exec -u 0 -it n_poc_jbpm chown jboss:jboss /opt/jboss/wildfly/standalone/configuration/standalone.xml
docker exec -u 0 -it n_poc_jbpm chown jboss:jboss /opt/jboss/wildfly/standalone/deployments/business-central.war/WEB-INF/keycloak.json
echo "restarting container..."
docker restart n_poc_jbpm

# Open in: http://localhost:8080/business-central
echo "Open in: http://localhost:8080/business-central"
