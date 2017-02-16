# Terminal Hack.Chat
Lets you connect to hack.chat with the terminal.
You can connect to toastychat, but it does not have specific support for things from toastychat.

![screenshot](http://i.imgur.com/m3KbyM1.png)

## To use:
Do:  
`npm install`  
then open up the file config.json and set your username, password, channel, and server address.  
For the channel '?programming' would be 'programing'  
Hack.Chats Server Address: "wss://hack.chat/chat-ws"  
  
To run do:  
`node index.js`  
  
## Settings:
### Colors:
Colors come from: [chalk](https://www.npmjs.com/package/chalk)  
Please have all colors lowercase.  
Background Colors come the background colors, but without bg.  
Text Colors come from the text colors.  
On text colors you most likely can also use the other ones.
You can set colors for the text, and backgrounds of these:  
* admins
* mods
* normal users
* yourself
* the server
* warnings  
  
### Others:
* displayUsernamesEqualSized - This makes so all usernames will be the same size, since there is a max of 24 characters in a name.
* separateUserAndPass        - For if you are connecting to toastychat.
* displayNonTripsAs          - A string which is displayed when a user doesn't have a trip. Recommended to be 6 characters.
* haveColors                 - Whether colors should be enabled. If this is off there will be no colors.