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
		this.render();

	};

	/*
	 * renders dom elements and adds event listeners
	 * @public
	 */
	Player.prototype.render = function () {

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
			if (i === 0) songItem.className = 'active';

			var title = document.createElement('div');
			title.className = 'title';
			title.textContent = this.songs[i].title;

			var artist = document.createElement('div');
			artist.className = 'artist';
			artist.textContent = this.songs[i].artist;

			// add children dom elements for each song
			songItem.appendChild(title);
			songItem.appendChild(artist);

			// apply props for use in event handler
			songItem.index = i;

			// event handler
			songItem.addEventListener('click', this.changeSong.bind(this));

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
		this.prevBtn.action = 'prev';
		this.nextBtn.action = 'next';

		// event handlers
		this.prevBtn.addEventListener('click', this.changeSong.bind(this));
		this.playBtn.addEventListener('click', this.play.bind(this));
		this.nextBtn.addEventListener('click', this.changeSong.bind(this));

	}

	/*
	 * play current song
	 * @public
	 */
	Player.prototype.play = function () {
		this.state.playing ? this.audio.pause() : this.audio.play();
		this.playBtn.textContent = this.state.playing ? 'Play' : 'Pause';
		this.state.playing = !this.state.playing;
	};

	/*
	 * changes current song
	 * @public
	 * @param {Event} e - event should come with action or index property to determine necessary steps
	 */
	Player.prototype.changeSong = function (e) {

		// set a new index for song chosen
		var newIndex;
		var action = e.currentTarget.action || e.currentTarget.index;
		if (action === 'prev') {
			newIndex = ((this.state.index - 1) < 0) ? (this.songs.length - 1) : (this.state.index - 1);
		} else if (action === 'next') {
			newIndex = ((this.state.index + 1) < this.songs.length) ? (this.state.index + 1) : 0;
		} else if (typeof action === 'number' && action <= this.songs.length) {
			newIndex = action;
		} else {
			return new Error('The changeSong() method was run without an appropriate action property on the event param.');
		}

		// set dom active
		var songItems = this.songList.children;
		for (var i = 0; i < songItems.length; i++) {
			if (i === newIndex) songItems[i].className = 'active';
			else songItems[i].className = '';
		}

		this.audio.src = this.songs[newIndex].file;
		this.state.index = newIndex;
		this.state.playing = false;
		this.play();
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
