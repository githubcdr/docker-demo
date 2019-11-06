var PROTO_PATH = __dirname + '/proto/hello.proto';
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://mongodb:27017";
var grpc = require('grpc');
var Redis = require('ioredis');
var redisport = 6379;
var redishost = 'redis';
var redis = new Redis(redisport, redishost);
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = { name: "Company Inc", address: "Highway 37" };
  dbo.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});

function sayHello(call, callback) {
  callback(null, {message: 'Hello from greatest and latest ' + call.request.name + ' from ' + process.env.HOSTNAME});
  redis.set(call.request.name, 'Hello');
  //collection.insertOne({ 'Hello': "kai" }, (err, result) => {})
  // redis.disconnect();
  console.log('Greeting:', call.request.name);
}

function main() {
  var server = new grpc.Server();
  server.addService(hello_proto.Greeter.service, {sayHello: sayHello});
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
}
main();

