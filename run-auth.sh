docker network create neutrality_network;
docker stop n_poc_auth;
docker rm n_poc_auth;
# docker build -t n_poc_auth_image -f auth/Dockerfile .;
docker run --network neutrality_network -d \
    -e KEYCLOAK_PASSWORD=neutrality1 -e KEYCLOAK_USER=neutrality \
    -e PROXY_ADDRESS_FORWARDING=true \
    -p 127.0.0.1:9861:8080 \
    --volume ${PWD}/auth/data/:/opt/jboss/keycloak/standalone/data/ \
    --name n_poc_auth jboss/keycloak

docker cp auth/keycloak-protocol-cas-12.0.2.jar n_poc_auth:/opt/jboss/keycloak/standalone/deployments/keycloak-protocol-cas-12.0.2.jar
