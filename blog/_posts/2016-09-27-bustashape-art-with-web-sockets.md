---
title: Collaborative art powered by web sockets

tags:
- art
- bustashape
- javascript
- web sockets

summary: A tech overview of my side project for creating art on the web.
---

At its core, [bustashape](https://bustashape.com) is a combo of two libraries: hammer.js and socket.io. You interact with the shapes using hammer.js and socket.io broadcasts all the changes you make to others instantly. The result is a shared drawing space that stays in sync across all connected devices.

### hammer.js

[Hammer.js](https://hammerjs.github.io/) is a great, low-level multitouch gesture library, Hammer is really slick and can very easily track multiple touch gestures at once, providing drag, pinch, zoom, rotation, and even gestures like swiping. It provides excellent data about the touches it recognizes, and makes no assumptions about how you use it. The event listener system is flexible and allows you to respond to various gestures using one or many callbacks, whatever suits your needs.

### Socket.io

[Socket.io](http://socket.io/) enables real-time interactivity between both a server and other peer clients. The "Hello, World!" app on the socket.io website is a [real-time chat client](http://socket.io/get-started/chat/), just like IRC or Slack. Multiple users can connect and type messages which are seen by anyone in the chat room, and it's a small amount of work to send private messages as well.

Bustashape is also built on the concept of rooms. Instead of one shared drawing board, we have any number of boards active on the site depending on who is there. If you decide to create a room called [#bananas](https://bustashape.com/#bananas) it will exist until you and all other participants leave.

### Combining the two libraries

When hammer.js detects a touch event, it can respond in various ways depending on what type of touch it was. In most cases people are dragging a shape with one finger, or pinching to change its size and rotation.

When the hammer listener is triggered it does two things: in addition to drawing the new shape on the screen, bustashape will send a little message to each of your peers in the room with a small JSON object which describes the transform you just made to the shape:

```js
{
  id: 'shape-123456789',
  transform: {
    x: 356,
    y: 442,
    angle: 34.62937420437,
    scale: 1.111429930672
  }
}
```

**Think of it just like a chat message, but we send CSS code**, and we do it up to 60 times per second so the shape moves around about as fluidly as your finger on the screen.

We're currently using [two.js](https://jonobr1.github.io/two.js/examples/) to draw the shapes, but that part is pluggable and could be swapped out based on what display we want to power (computer screens, LED arrays, VR, etc).

### Syncing boards with private messages

Like any decent chat service, people expect to use private messages sometimes. Sometimes what you're saying is private, but sometimes it is public data which only one person needs at the present moment, so sending it directly reduces the noise level of the chat room.

When a new user joins, all they see is a blank canvas. There's no database powering bustashape; the state of the drawing board is held entirely in memory by the people who are connected.

I long considered adding a database so the app itself could know the state of the canvas, but ultimately decided it was going to cause more problems than it solved. Instead, bustashape announces to all clients when a new person arrives, and asks them to send all the data they have about the drawing board to the new user. The new user receives each dataset and adds it to the board, skipping redundant instructions by comparing HTML IDs associated with each shape. We get the benefits of persistence without the burden of holding the data ourselves.

Bustashape is all about person-to-person interactions, so this syncing model works really well. It preserves the drawing board until the last person leaves, and then it's gone forever. In the future I'd like to add Service Worker support so people can locally cache a drawing and load it later. Once it is loaded, the board could be synced with new users, allowing it to persist in between visits.

### Distributed drawing

The model is pretty barebones, but handles a variety of network conditions quite well. Since changing an existing shape is done locally, you can continue without any connection. Once you return to an empty room, you're the canonical data source. There is a small possibility you'd rejoin a room with active peers, and as the app stands right now, the initial state would be out of sync for the rejoining user, but correct itself the next time an old shape is touched again.

Currently it's not possible to create new shapes without the network. That could be changed in the future by running a Service Worker which fakes the network until it returns. Once the network is back, the normal syncing process would update all the new clients with any changes you made while you were away.

### Saving your work

Since the data isn't stored on the server, the app itself cannot save drawings. However, if one of your connected clients can save files to disk, there is a way to save your work. Bustashape uses the SVG drawing mode of two.js, meaning that at any point, the drawing board's DOM can be saved directly as SVG with no processing needed.

On a laptop, just use the `s` key to quickly save a drawing that you've created. Sometimes the drawbox will crop the image, but regardless of the crop, all the data is retained. A few quick steps to doctor the SVG manually reveals the entire drawing surface.

### 🔷 Try it out! 🔷

That's the basic overview of how bustashape works. But don't just read this post, [go try bustashape](https://bustashape.com)! I promise you've have fun.

If you want to hack on it, [the code is on GitHub](https://github.com/rupl/bustashape/). We have lots of fun ideas for the future and would love to hear from others too!
