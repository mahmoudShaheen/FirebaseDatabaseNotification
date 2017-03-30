//initializeApp
'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

//main lambda function
exports.sendDatabaseNotification = functions.database.ref('/messages/{messageID}').onWrite(event => {
  const messageID = event.params.messageID;
  // If message deleted function return
  if (!event.data.val()) {
    return console.log('Deleted messageID:  ', messageID);
  }
  console.log('messageID:  ', messageID);

  // Set the message as high priority and have it expire after 24 hours.
  const defaultOptions = {
    priority: "high",
    timeToLive: 60 * 60 * 24 //one day
  };

  //get message content
  const tokensPromise = admin.database().ref(`/messages/${messageID}/tokens`).once('value');
  const payloadPromise = admin.database().ref(`/messages/${messageID}/payload`).once('value');
  const optionsPromise = admin.database().ref(`/messages/${messageID}/options`).once('value');

  return Promise.all([tokensPromise, payloadPromise, optionsPromise]).then(results => {

    const tokens  = results[0].val();
    console.log('Tokens:  ', tokens);
    const payload = results[1].val();
    console.log('Payload:  ', payload);
    const options = results[2].val();
    console.log('Options:  ', options);

    if(tokens == null || payload == null){
      return console.error("Tokens/Payload can't be Null");
    }
    if (options == null){
      options = defaultOptions;
    }

    // Send notification to device.
    admin.messaging().sendToDevice(tokens, payload, options).then(response => {
      //delete message from database
      admin.database().ref(`/messages/${messageID}`).set({});

      //check if there was error in each responce
      response.results.forEach((result, index) => {
        const error = result.error;
        if (error) {
          console.error('Failure sending message to:  ', tokens[index], error);
        } else {
          console.log('Message sent to:  ', tokens[index]);
        }
      });
    })
  });
 });
