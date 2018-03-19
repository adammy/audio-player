(function () {

	/*
	 * constructor
	 * @public
	 * @param {Element} container - parent dom element for audio player
	 * @param {Object} settings - object to overwrite default settings
	 */
	this.Cinema = function (media, settings) {

		// default settings
		var defaults = {
			autoplay: false,
			display: {
				fullScreenBtn: true,
				times: true,
				progressBar: true
			}
		};

		// props
		this.media = media;
		this.settings = extendDefaults(defaults, settings);
		this.state = {
			playing: !this.settings.autoplay,
			fullScreen: false
		};

		// render dom elements
		this.render();

	};

	/*
	 * renders dom elements and adds event listeners
	 * @public
	 */
	Cinema.prototype.render = function () {

		// media file
		this.media.className = 'cinema-media';
		this.media.addEventListener('timeupdate', this.renderTime.bind(this));
		this.media.addEventListener('ended', this.videoEndRender.bind(this));

		// container
		this.container = document.createElement('div');
		this.container.className = 'cinema-container';
		this.media.parentNode.insertBefore(this.container, this.media.nextSibling);
		this.container.appendChild(this.media);

		// toolbar
		this.toolbar = document.createElement('div');
		this.toolbar.className = 'cinema-toolbar';
		this.container.appendChild(this.toolbar);

		// play button
		this.playBtn = document.createElement('button');
		this.playBtn.className = 'cinema-btn cinema-btn-play';
		this.playBtn.addEventListener('click', this.playPause.bind(this));
		this.toolbar.appendChild(this.playBtn);

		// full screen button
		if (this.settings.display.fullScreenBtn) {
			this.fullScreenBtn = document.createElement('button');
			this.fullScreenBtn.className = 'cinema-btn cinema-btn-fullscreen';
			this.fullScreenBtn.textContent = 'Full Screen';
			this.toolbar.appendChild(this.fullScreenBtn);
			this.fullScreenBtn.addEventListener('click', this.fullScreen.bind(this));
		}

		// time elapsed / duration
		if (this.settings.display.times) {

			// container for all time-related elements
			this.timeContainer = document.createElement('span');
			this.timeContainer.className = 'cinema-times';

			// elasped time init
			this.elapsedTimeSpan = document.createElement('span');
			this.elapsedTimeSpan.className = 'cinema-times-elasped';
			this.elapsedTimeSpan.textContent = '0:00';
			this.timeContainer.appendChild(this.elapsedTimeSpan);

			// separator
			this.timeSeparatorSpan = document.createElement('span');
			this.timeSeparatorSpan.className = 'cinema-times-separator';
			this.timeSeparatorSpan.textContent = ' / ';
			this.timeContainer.appendChild(this.timeSeparatorSpan);

			// get duration when ready
			this.media.addEventListener('durationchange', this.renderDuration.bind(this));

			// place overall element in toolbar
			this.toolbar.appendChild(this.timeContainer);

		}

		// state initialization and autoplay if defined
		this.playPause();

	};

	/*
	 * play or pause media depending on state
	 * @public
	 */
	Cinema.prototype.playPause = function () {
		this.state.playing ? this.pause() : this.play();
	};

	/*
	 * play media
	 * @public
	 */
	Cinema.prototype.play = function () {
		this.media.play();
		this.playBtn.textContent = 'Pause';
		this.state.playing = true;
	};

	/*
	 * pause media
	 * @public
	 */
	Cinema.prototype.pause = function () {
		this.media.pause();
		this.playBtn.textContent = 'Play';
		this.state.playing = false;
	};

	/*
	 * make video full screenish
	 * @public
	 */
	Cinema.prototype.fullScreen = function () {
		this.state.fullScreen ? this.container.classList.remove('cinema-fullscreen') : this.container.classList.add('cinema-fullscreen');
		this.state.fullScreen = !this.state.fullScreen;
	};

	/*
	 * renders the elasped time dom element
	 * @public
	 */
	Cinema.prototype.renderTime = function () {
		this.elapsedTimeSpan.textContent = secondsToString(this.media.currentTime);
	};

	/*
	 * renders the duration time dom element
	 * @public
	 */
	Cinema.prototype.renderDuration = function () {
		this.durationSpan = document.createElement('span');
		this.durationSpan.className = 'cinema-times-duration';
		this.durationSpan.textContent = secondsToString(this.media.duration) || 'Not Applicable';
		this.timeContainer.appendChild(this.durationSpan);
	};

	/*
	 * renders the duration time dom element
	 * @public
	 */
	Cinema.prototype.videoEndRender = function () {
		this.state.playing = false;
		this.playBtn.textContent = 'Replay';
	};

	/*
	 * takes a number of seconds and converts it into a user-friendly string, e.g. 0:42 or 2:38
	 * @private
	 * @param {Number} seconds
	 * @returns {String}
	 */
	function secondsToString(seconds) {
		var secondsInt = parseInt(seconds);
		var minutes = Math.floor(secondsInt / 60);
		var leftoverSeconds = secondsInt % 60;
		if (leftoverSeconds < 10) {
			leftoverSeconds = '0' + leftoverSeconds;
		}
		return minutes + ':' + leftoverSeconds;
	};

	/*
	 * given two objects, will seek to overwrite first object with anything provided in the second object
	 * alternative to Object.assign() which doesn't work in IE apparently
	 * @private
	 * @param {Object} source - source object to be modified
	 * @param {Object} properties - object with updated values
	 * @returns {Object}
	 */
	function extendDefaults(source, properties) {
		for (property in properties) {
			if (properties.hasOwnProperty(property)) {
				source[property] = properties[property];
			}
		}
		return source;
	};

}());
