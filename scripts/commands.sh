integration_tests(){
  # Our tests require a redis instance running
  docker kill monkey-redis
  docker rm monkey-redis
  docker run --name monkey-redis  -p 6379:6379 -d redis
  # Do the actual tests running part
  mocha --exit integrationTests
}
