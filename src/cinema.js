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
			autoplay: false
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

		// create dom elements
		this.container = document.createElement('div');
		this.toolbar = document.createElement('div');
		this.playBtn = document.createElement('button');
		this.fullScreenBtn = document.createElement('button');

		// add classes & props
		this.media.className = 'cinema-media';
		this.container.className = 'cinema-container';
		this.toolbar.className = 'cinema-toolbar';
		this.playBtn.className = 'cinema-btn cinema-btn-play';
		this.fullScreenBtn.className = 'cinema-btn cinema-btn-fullscreen';
		this.fullScreenBtn.textContent = 'Full Screen';

		// insert into dom
		this.media.parentNode.insertBefore(this.container, this.media.nextSibling);
		this.container.appendChild(this.media);
		this.container.appendChild(this.toolbar);
		this.toolbar.appendChild(this.playBtn);
		this.toolbar.appendChild(this.fullScreenBtn);

		// event handlers
		this.playBtn.addEventListener('click', this.play.bind(this));
		this.fullScreenBtn.addEventListener('click', this.fullScreen.bind(this));

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
