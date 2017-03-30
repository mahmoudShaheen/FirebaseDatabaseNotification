# FirebaseDatabaseNotification

This simple Cloud-function demonstrates how to send a Firebase Cloud Messaging (FCM)
notification or data message from a Realtime Database triggered Function.


which enables your application users to send messages to each other without any
need for a server.


it sends any received message/notification to given device/devices
This will be done by:
  receive an array of tokens 'JSON'
  payload message 'JSON'
  options 'JSON'
An example of how message class should be is included [here](messages.json), you can
simply import messages.JSON file to Firebase database after deploying
the function.


also an brief steps is included [here](Cloud-Function-Steps.txt).


and finally database rules can be found [here](database.rules.json).


If you need a sample project to test with, can be found [here](https://github.com/firebase/quickstart-android/tree/master/messaging).
