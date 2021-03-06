(function () {

	/*
	 * instantiator
	 * @public
	 * @param {String} - a selector of elements you want to use to create Cinema objects
	 * @returns {Cinema}
	 */
	this.CinemaInit = function (selector, settings) {
		var elements = document.querySelectorAll(selector);
		elements.forEach(function (element) {
			if (element.tagName.toLowerCase() == 'video' || element.tagName.toLowerCase() == 'audio') {
				return new Cinema(element, settings);
			} else {
				console.warn('You tried to create a Cinema object with something other than a <video> or <audio> element. The specific element is logged below:');
				console.warn(element);
			}
		});
	};

	/*
	 * constructor
	 * @public
	 * @param {Element} media - the media element that is being manipulated
	 * @param {Object} settings - object to overwrite default settings
	 */
	this.Cinema = function (media, settings) {

		// default settings
		var defaults = {
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
	 * renders the full video plugin
	 * basically an initializer
	 * @public
	 */
	Cinema.prototype.render = function () {

		// media file
		this.media.className = 'cinema-media';
		this.media.addEventListener('click', this.playPause.bind(this));
		this.media.addEventListener('timeupdate', this.mediaPlaying.bind(this));
		this.media.addEventListener('ended', this.mediaEndUpdate.bind(this));
		this.media.addEventListener('progress', this.bufferUpdate.bind(this));

		// container
		this.container = document.createElement('div');
		this.container.className = 'cinema-container';
		this.media.parentNode.insertBefore(this.container, this.media.nextSibling);
		this.container.appendChild(this.media);
		if (this.settings.animate.toolbar) {
			this.container.addEventListener('mouseover', this.mediaMouseover.bind(this));
			this.container.addEventListener('mouseout', this.mediaMouseout.bind(this));
		}

		// toolbar
		this.toolbar = document.createElement('div');
		this.toolbar.className = 'cinema-toolbar';
		if (!this.settings.animate.toolbar) {
			this.toolbar.classList.add('cinema-toolbar-active');
		}
		this.container.appendChild(this.toolbar);

		// left toolbar
		this.leftToolbar = document.createElement('div');
		this.leftToolbar.className = 'cinema-toolbar-left';
		this.toolbar.appendChild(this.leftToolbar);

		// right toolbar
		this.rightToolbar = document.createElement('div');
		this.rightToolbar.className = 'cinema-toolbar-right';
		this.toolbar.appendChild(this.rightToolbar);

		// play button
		this.playBtn = document.createElement('button');
		this.playBtn.className = 'cinema-btn cinema-btn-play';
		this.playBtn.addEventListener('click', this.playPause.bind(this));
		this.playBtnImg = document.createElement('img');
		this.playBtn.appendChild(this.playBtnImg);
		this.leftToolbar.appendChild(this.playBtn);

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
			this.media.addEventListener('durationchange', this.durationUpdate.bind(this));

			// place overall element in toolbar
			this.leftToolbar.appendChild(this.timeContainer);

		}

		// progress bar
		if (this.settings.display.progressBar) {

			this.progressBarContainer = document.createElement('div');
			this.progressBarContainer.className = 'cinema-progress-bar-container';
			this.progressBarContainer.addEventListener('click', this.progressBarUpdate.bind(this));
			this.container.appendChild(this.progressBarContainer);

			this.progressBarBuffer = document.createElement('span');
			this.progressBarBuffer.className = 'cinema-progress-bar-buffer';
			this.progressBarContainer.appendChild(this.progressBarBuffer);

			this.progressBarInner = document.createElement('span');
			this.progressBarInner.className = 'cinema-progress-bar-inner';
			this.progressBarContainer.appendChild(this.progressBarInner);

		}

		// volume bar
		if (this.settings.display.volumeBar) {

			this.volumeContainer = document.createElement('div');
			this.volumeContainer.className = 'cinema-volume-container';
			if (this.settings.animate.volumeBar) {
				this.volumeContainer.addEventListener('mouseover', this.volumeMouseover.bind(this));
				this.volumeContainer.addEventListener('mouseout', this.volumeMouseout.bind(this));
			}
			this.rightToolbar.appendChild(this.volumeContainer);

			this.volumeBtn = document.createElement('button');
			this.volumeBtn.className = 'cinema-btn cinema-btn-no-hover cinema-btn-volume';
			this.volumeBtnImg = document.createElement('img');
			this.volumeBtnImg.src = 'icons/volume-high.svg';
			this.volumeBtn.appendChild(this.volumeBtnImg);
			this.volumeContainer.appendChild(this.volumeBtn);

			this.volumeRangeContainer = document.createElement('span');
			this.volumeRangeContainer.className = 'cinema-volume-range';
			if (!this.settings.animate.volumeBar) {
				this.volumeRangeContainer.classList.add('cinema-volume-range-active');
			}
			this.volumeRange = document.createElement('input');
			this.volumeRange.type = 'range';
			this.volumeRange.max = 1;
			this.volumeRange.min = 0;
			this.volumeRange.step = 0.1;
			this.volumeRange.value = this.settings.volume;
			this.volumeRange.addEventListener('change', this.setVolumeFromInput.bind(this));
			this.volumeRangeContainer.appendChild(this.volumeRange);

			this.volumeContainer.appendChild(this.volumeRangeContainer);

		}

		// full screen button
		if (this.settings.display.fullScreenBtn) {
			this.fullScreenBtn = document.createElement('button');
			this.fullScreenBtn.className = 'cinema-btn cinema-btn-fullscreen';
			this.fullScreenBtn.addEventListener('click', this.fullScreen.bind(this));
			this.fullScreenBtnImg = document.createElement('img');
			this.fullScreenBtnImg.src = 'icons/fullscreen.svg';
			this.fullScreenBtn.appendChild(this.fullScreenBtnImg);
			this.rightToolbar.appendChild(this.fullScreenBtn);
		}

		// state initialization
		this.setVolume(this.settings.volume);
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
		this.playBtnImg.src = 'icons/pause.svg';
		this.state.playing = true;
	};

	/*
	 * pause media
	 * @public
	 */
	Cinema.prototype.pause = function () {
		this.media.pause();
		this.playBtnImg.src = 'icons/play.svg';
		this.state.playing = false;
	};

	/*
	 * actions on mouseover of media
	 * @public
	 */
	Cinema.prototype.mediaMouseover = function () {
		this.toolbar.classList.add('cinema-toolbar-active');
	};

	/*
	 * actions on mouseover of media
	 * @public
	 */
	Cinema.prototype.mediaMouseout = function () {
		this.toolbar.classList.remove('cinema-toolbar-active');
	};

	/*
	 * actions while media is playing
	 * @public
	 */
	Cinema.prototype.mediaPlaying = function () {

		/*
		 * @TODO
		 * A consideration more than a thing that needs to happen
		 * the 'timeupdate' event (referenced in the render() method) runs at a rate
		 * that can make this functionality look buggy because:
		 * - Doesn't run frequently enough
		 * - Doesn't run at a consistent rate, e.g. sometimes it's a 0.5 seconds and sometimes it's 1.5 seconds
		 * Alternative to consider is setInterval(); not as cool, but might look smoother
		 * Also saw mention of window.requestAnimationFrame(); just look into it when this happens
		 */

		// progress bar
		if (this.settings.display.progressBar) {
			var percentageElapsed = (this.media.currentTime / this.media.duration) * 100;
			this.progressBarInner.style.width = percentageElapsed + '%';
		}

		// time elapsed string
		if (this.settings.display.times) {
			this.elapsedTimeSpan.textContent = secondsToString(this.media.currentTime);
		}

	};

	/*
	 * rerenders the progress bar when part of timeline is clicked
	 * @public
	 * @Param {Event}
	 */
	Cinema.prototype.progressBarUpdate = function (e) {
		this.media.currentTime = (e.offsetX / this.progressBarContainer.clientWidth) * this.media.duration;
	};

	/*
	 * renders the buffered time progress bar
	 * @public
	 */
	Cinema.prototype.bufferUpdate = function () {
		if (this.settings.display.progressBar) {
			var m = this.media;
			for (var i = 0; i < m.buffered.length; i++) {
				if (m.buffered.start(m.buffered.length - 1 - i) < m.currentTime) {
					this.progressBarBuffer.style.width = (m.buffered.end(m.buffered.length - 1 - i) / m.duration) * 100 + '%';
					break;
				}
			}
		}
	};

	/*
	 * renders the duration time dom element
	 * @public
	 */
	Cinema.prototype.durationUpdate = function () {
		this.durationSpan = document.createElement('span');
		this.durationSpan.className = 'cinema-times-duration';
		this.durationSpan.textContent = secondsToString(this.media.duration) || 'Not Applicable';
		this.timeContainer.appendChild(this.durationSpan);
	};

	/*
	 * set the volume based on event provided
	 * @public
	 * @Param {Event}
	 */
	Cinema.prototype.setVolumeFromInput = function (e) {
		var volume = e.target.value;
		this.setVolume(volume);
	};

	/*
	 * set volume of the media
	 * @public
	 * @Param {Number} - a number between 0 and 1 to set the volume to
	 */
	Cinema.prototype.setVolume = function (volume) {
		this.media.volume = volume;
		if (volume == 0) {
			this.volumeBtnImg.style.width = '9px';
			this.volumeBtnImg.src = 'icons/volume-mute.svg';
		} else if (volume >= 0.6) {
			this.volumeBtnImg.style.width = '18px';
			this.volumeBtnImg.src = 'icons/volume-high.svg';
		} else {
			this.volumeBtnImg.style.width = '13px';
			this.volumeBtnImg.src = 'icons/volume-low.svg';
		}
	};

	/*
	 * volume container mouseover, edit dom
	 * @public
	 */
	Cinema.prototype.volumeMouseover = function () {
		this.volumeRangeContainer.classList.add('cinema-volume-range-active');
	};

	/*
	 * volume container mouseover, edit dom
	 * @public
	 */
	Cinema.prototype.volumeMouseout = function () {
		this.volumeRangeContainer.classList.remove('cinema-volume-range-active');
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
	 * renders when media is played until end
	 * @public
	 */
	Cinema.prototype.mediaEndUpdate = function () {
		this.state.playing = false;
		this.playBtnImg.src = 'icons/replay.svg';
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
				if (typeof properties[property] === 'object') {
					source[property] = extendDefaults(source[property], properties[property]);
				} else {
					source[property] = properties[property];
				}
			}
		}
		return source;
	};

}());
