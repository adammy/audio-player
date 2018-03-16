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
			playing: !this.settings.autoplay
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

		// add classes
		this.media.className = 'cinema-media';
		this.container.className = 'cinema-container';
		this.toolbar.className = 'cinema-toolbar';
		this.playBtn.className = 'cinema-btn cinema-btn-play';

		// insert into dom
		this.media.parentNode.insertBefore(this.container, this.media.nextSibling);
		this.container.appendChild(this.media);
		this.container.appendChild(this.toolbar);
		this.toolbar.appendChild(this.playBtn);

		// event handlers
		this.playBtn.addEventListener('click', this.play.bind(this));

		// state initialization and autoplay if defined
		this.play();

	}

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
	}

}());
