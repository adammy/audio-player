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
				file: 'audio/Xenojam_-_02_-_Inevitable.mp3'
			},
			{
				title: 'Gold',
				artist: 'Imagine Dragons',
				album: {
					name: 'Smoke + Mirrors',
					image: 'imagine-dragons-smoke-mirrors.jpg'
				},
				file: 'audio/Water_Features_-_07_-_Outisde_The_Citadel.mp3'
			},
			{
				title: 'The Phoenix',
				artist: 'Fall Out Boy',
				album: {
					name: 'Save Rock And Roll',
					image: 'fall-out-boy-save-rock-and-roll.jpg'
				},
				file: 'audio/Visciera_-_02_-_The_Tide.mp3'
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
		this.songList = document.createElement('ul');
		this.prevBtn = document.createElement('button');
		this.playBtn = document.createElement('button');
		this.nextBtn = document.createElement('button');

		// adding songs to this.songList
		for (var i = 0; i < this.songs.length; i++) {

			// create dom element and add text, classes, properties
			var songItem = document.createElement('li');

			var title = document.createElement('div');
			title.className = 'title';
			title.textContent = this.songs[i].title;

			var artist = document.createElement('div');
			artist.className = 'artist';
			artist.textContent = this.songs[i].artist;

			// add chilren dom elements for each song
			songItem.appendChild(title);
			songItem.appendChild(artist);

			// apply props for use in event handler
			songItem.index = i;
			songItem.self = this;

			// event listener
			songItem.addEventListener('click', handleSongClick, {
				once: true,
				capture: true
			});

			// add song item to list
			this.songList.appendChild(songItem);

		}

		// add necessary attributes
		this.audio.src = this.songs[0].file;
		this.prevBtn.textContent = 'Prev';
		this.playBtn.textContent = (this.settings.autoplay) ? 'Pause' : 'Play';
		this.nextBtn.textContent = 'Next';

		// insert into dom
		this.container.appendChild(this.audio);
		this.container.appendChild(this.songList);
		this.container.appendChild(this.prevBtn);
		this.container.appendChild(this.playBtn);
		this.container.appendChild(this.nextBtn);

		// conditions affecting behavior
		if (this.settings.autoplay) this.audio.play();

		// for use in private event handler functions (referenced as event.target.self)
		this.prevBtn.self = this;
		this.playBtn.self = this;
		this.nextBtn.self = this;

		// addEventHandlers
		this.prevBtn.addEventListener('click', handlePrevClick);
		this.playBtn.addEventListener('click', handlePlayClick);
		this.nextBtn.addEventListener('click', handleNextClick);

		// other methods
		this.setActive(0);

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
	 * go to the prev song in this.songs
	 * @public
	 */
	Player.prototype.prev = function () {
		var newIndex = ((this.state.index - 1) < 0) ? (this.songs.length - 1) : (this.state.index - 1);
		this.audio.src = this.songs[newIndex].file;
		this.state.index = newIndex;
		this.setActive(newIndex);
		this.state.playing = true;
		this.play();
	}

	/*
	 * go to the next song in this.songs
	 * @public
	 */
	Player.prototype.next = function () {
		var newIndex = ((this.state.index + 1) < this.songs.length) ? (this.state.index + 1) : 0;
		this.audio.src = this.songs[newIndex].file;
		this.state.index = newIndex;
		this.setActive(newIndex);
		this.state.playing = true;
		this.play();
	}

	/*
	 * set the active song/index
	 * @public
	 */
	Player.prototype.setActive = function (index) {
		var songItems = this.songList.children;
		for (var i = 0; i < songItems.length; i++) {
			if (i === index) songItems[i].className = 'active';
			else songItems[i].className = '';
		}
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

	/*
	 * event handler function for clicking a song list item
	 * @private
	 * @param {Event} e
	 */
	function handleSongClick(e) {
		var player = e.target.self;
		player.audio.src = player.songs[e.target.index].file;
		player.state.index = e.target.index;
		player.setActive(e.target.index);
		player.state.playing = true;
		player.play();
	}

	/*
	 * event handler function for clicking prev btn
	 * @private
	 * @param {Event} e
	 */
	function handlePrevClick(e) {
		var player = e.target.self;
		player.prev();
	}

	/*
	 * event handler function for clicking next btn
	 * @private
	 * @param {Event} e
	 */
	function handleNextClick(e) {
		var player = e.target.self;
		player.next();
	}

}());
