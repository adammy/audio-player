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
			fullScreenBtn: true
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
		this.playBtn.addEventListener('click', this.play.bind(this));
		this.toolbar.appendChild(this.playBtn);

		// full screen button
		if (this.settings.fullScreenBtn) {
			this.fullScreenBtn = document.createElement('button');
			this.fullScreenBtn.className = 'cinema-btn cinema-btn-fullscreen';
			this.fullScreenBtn.textContent = 'Full Screen';
			this.toolbar.appendChild(this.fullScreenBtn);
			this.fullScreenBtn.addEventListener('click', this.fullScreen.bind(this));
		}

		// state initialization and autoplay if defined
		this.play();

	};

	/*
	 * play current song
	 * @public
	 */
	Cinema.prototype.play = function () {
		this.state.playing ? this.media.pause() : this.media.play();
		this.playBtn.textContent = this.state.playing ? 'Play' : 'Pause';
		this.state.playing = !this.state.playing;
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
	 * given two objects, will seek to overwrite first object with anything provided in the second object
	 * alternative to Object.assign() which doesn't work in IE apparently
	 * @private
	 * @param {Object} source - source object to be modified
	 * @param {Object} updates - object with updated values
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
