# Cinema.js
### Create customized video/audio player interfaces.

#### Demo
[https://codepen.io/adammy/pen/yKebbp](https://codepen.io/adammy/pen/yKebbp)

#### CDN
Add a link to the css file in your `<head>`:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/cinema-js@1.0.0/dist/cinema.min.css">
```

Then, before your closing `<body>` tag add:
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/cinema-js@1.0.0/dist/cinema.min.js"></script>
```

#### Package Managers

##### NPM
```sh
npm install cinema-js --save
```

##### Bower
```sh
bower install cinema --save
```

#### Usage
Reference the CinemaInit() function, passing a selector argument like so:
```html
<video preload="metadata">
	<source src="bunny.mp4" type="video/mp4">
</video>
```
```javascript
CinemaInit('video');
```

##### Settings
When calling the CinemaInit() function, you can pass it an object to overwrite some settings. See below:
```javascript
CinemaInit('#myVideo', {
	autoplay: false,
	volume: 1,
	display: {
		fullScreenBtn: true,
		times: true,
		progressBar: true,
		volumeBar: true
	},
	animate: {
		toolbar: true,
		volumeBar: true
	}
});
```

Details of each setting are below:

**autoplay** (boolean)<br />
Default value: false<br />
If true, the media will autoplay.

**volume** (number)<br />
Default value: 1<br />
Sets the starting volume for the media. Must be a number between 0 and 1.

**display** (object)<br />
This object contains a variety of properties to determine if the media player will have certain elements. Setting their values to true, will display the element. Those elements include fullScreenBtn, times, progressBar, and volumeBar. By default, all of these properties are true.

**animate** (object)<br />
This object contains a variety of properties to determine certain elements on the media player will animate based on certain events. Setting their values to true, will allow the element to animate. Those elements include toolbar and volumeBar. By default, all of these properties are true.
