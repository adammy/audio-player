(function () {

	/*
	 * constructor
	 * @public
	 * @param {Element} container - parent dom element for audio player
	 * @param {Object} settings - object to overwrite default settings
	 */
	this.Player = function (container, settings, songs) {

		// default settings
		var defaults = {
			autoplay: false
		};

		// props
		this.container = container;
		this.songs = songs || [
			{
				title: 'Amazing',
				artist: 'Kanye West',
				album: {
					name: '808s & Heartbreak',
					image: 'kanye-west-808s-heartbreaks.jpg'
				},
				file: 'http://freesound.org/data/previews/421/421770_1391542-lq.mp3'
			},
			{
				title: 'Gold',
				artist: 'Imagine Dragons',
				album: {
					name: 'Smoke + Mirrors',
					image: 'imagine-dragons-smoke-mirrors.jpg'
				},
				file: 'imagine-dragons-gold.mp3'
			},
			{
				title: 'The Phoenix',
				artist: 'Fall Out Boy',
				album: {
					name: 'Save Rock And Roll',
					image: 'fall-out-boy-save-rock-and-roll.jpg'
				},
				file: 'fall-out-boy-the-phoenix.mp3'
			}
		];
		this.settings = extendDefaults(defaults, settings);
		this.state = {
			playing: this.settings.autoplay,
			index: 0
		};

		// init dom elements
		this.init();

	};

	/*
	 * create dom elements, append to dom, and add event listeners
	 * @public
	 */
	Player.prototype.init = function () {

		// create dom elements
		this.audio = document.createElement('audio');
		this.playBtn = document.createElement('button');
		this.songList = document.createElement('ul');

		// adding songs to this.songList
		for (var i = 0; i < this.songs.length; i++) {
			var songItem = document.createElement('li');
			songItem.textContent = this.songs[i].title;
			this.songList.appendChild(songItem);
		}

		// add necessary attributes
		this.audio.src = this.songs[0].file;
		this.playBtn.textContent = (this.settings.autoplay) ? 'Pause' : 'Play';

		// insert into dom
		this.container.appendChild(this.audio);
		this.container.appendChild(this.songList);
		this.container.appendChild(this.playBtn);

		// conditions affecting behavior
		if (this.settings.autoplay) this.audio.play();

		// for use in private event handler functions (referenced as event.target.self)
		this.playBtn.self = this;

		// addEventHandlers
		this.playBtn.addEventListener('click', handlePlayClick);

	}

	/*
	 * play audio clip
	 * @public
	 */
	Player.prototype.play = function () {
		this.playBtn.textContent = 'Pause';
		this.audio.play();
	}

	/*
	 * pause audio clip
	 * @public
	 */
	Player.prototype.pause = function () {
		this.playBtn.textContent = 'Play';
		this.audio.pause();
	}

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

	/*
	 * event handler function for clicking play/pause btn
	 * @private
	 * @param {Event} e
	 */
	function handlePlayClick(e) {
		var player = e.target.self;
		player.state.playing ? player.pause() : player.play();
		player.state.playing = !player.state.playing;
	}

}());
