# docker stop n_poc_api;
# docker rm n_poc_api;
# docker build -t n_poc_api_image -f api/Dockerfile .;
# docker run -d \
#     -v ${pwd}/api:/app \
#     -p 127.0.0.1:9860:9860 \
#     --name n_poc_api n_poc_api_image

cd api
node index.js
