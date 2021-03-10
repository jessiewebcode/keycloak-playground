docker stop n_poc_zep;
docker rm n_poc_zep;
docker run --name n_poc_zep -p 7077:7077 -p 8080:8080 --privileged=true \
  -d apache/zeppelin:0.9.0

sleep 4


docker cp shiro.ini n_poc_zep:/opt/zeppelin/conf/shiro.ini
docker exec -u 0 -it n_poc_jbpm chown jboss:jboss /opt/zeppelin/conf/shiro.ini

docker restart n_poc_zep
echo "Open in: http://localhost:8080/"



# docker exec -u 0 -it n_poc_zep bash
# docker cp shiro-cas.ini n_poc_zep:/opt/zeppelin/conf/shiro.ini
# docker cp conf/shiro-cas-1.7.0.jar n_poc_zep:/opt/zeppelin/lib/shiro-cas-1.7.0.jar
# docker restart n_poc_zep


# docker run --name n_poc_zep -p 7077:7077 -p 8080:8080 --privileged=true -v $PWD/logs:/logs -v $PWD/notebook:/notebook \
#   -e ZEPPELIN_NOTEBOOK_DIR='/notebook' \
#   -e ZEPPELIN_LOG_DIR='/logs' \
#   -d apache/zeppelin:0.9.0

# Protocol to use: CAS
# maven dependencies: ?m2
