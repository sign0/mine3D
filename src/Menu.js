var Menu = {

	mode : null,
	level : null,

	animations : true,
	recenter : true,

	resize : false,

	pageNames : [
		'about',
		'settings',
		'stats',
		'instructions',
		'controls'
	],

	levelNames : [
		'classic' + 'easy',
		'sweep' + 'easy',

		'classic' + 'medium',
		'sweep' + 'medium',

		'classic' + 'hard',
		'sweep' + 'hard'
	],

	overlayCounter : 1,

	init : function() {

		$('#newButton').click(function () {

			Game.start();
			Menu.hide();

		});

		$('#menuButton').click(function () {

			Menu.toggle();

		});

		$('#restartButton').click(function() {

			Game.restart();
			Menu.hide();

		});

		function toggleButton( name ) {

			$('#' + name + 'Button').toggleClass('active');
			$('#' + name).toggle();

			Menu.updateOverlay( $('#' + name + 'Button').hasClass('active') );

		};

		$('#shareButton').click(function() {

			toggleButton( 'share' );

		});

		$('#feedbackButton').click(function() {

			toggleButton( 'feedback' );

			// if ( !window.UserVoice ) {
			// 
			// 	var uservoiceOptions = {
			// 		key: 'mine3d',
			// 		host: 'mine3d.uservoice.com', 
			// 		forum: '1',
			// 		lang: 'en',
			// 		showTab: false
			// 	};
			// 
			// 	var s = document.createElement('script');
			// 	s.src = ("https:" == document.location.protocol ? "https://" : "http://") + "cdn.uservoice.com/javascripts/widgets/tab.js";
			// 	document.getElementsByTagName('head')[0].appendChild(s);
			// 
			// 	s.onload = function() {
			// 
			// 		UserVoice.Popin.show( uservoiceOptions );
			// 
			// 	};
			// 
			// } else {
			// 
			// 	UserVoice.Popin.show( uservoiceOptions );
			// 
			// }

		});

		$('#updateButton').click(function() {

			toggleButton( 'update' );

		});



		this.initMenu();

		this.initSettings();

		this.initStats();

	},

	initMenu : function() {

		var names = this.pageNames,
			i;

		function clickHandler( name ) {

			return function() {

				Menu.hidePages();

				$('#' + name + 'Button').addClass( 'active' );
				$('#' + name).show();

			}

		}

		for ( i = 0; i < names.length; i++ ) {

			$('#' + names[i] + 'Button').click( clickHandler( names[i] ) );

		}

	},

	initSettings : function() {

		function setMode( modeName ) {

			if ( !($('#' + modeName).hasClass( 'active' )) ) {

				$('#classic').removeClass( 'active' );
				$('#sweep').removeClass( 'active' );

				$('#' + modeName).addClass( 'active' );
				Menu.mode = modeName;

				Menu.changedSettings( false );

			}

		};

		$('#classic').click(function() {

			setMode( 'classic' );

		});

		$('#sweep').click(function() {

			setMode( 'sweep' );

		});


		$('#playClassicButton').click(function() {

			setMode( 'classic' );

			Settings.setFromMenu();

			Game.start( Menu.resize );

			Menu.showHUD();

			$('#apply').removeClass( 'active' );
			$('#apply').hide();

		});

		$('#playSweepButton').click(function() {

			Menu.showHUD();

		});


		function setLevel( levelName ) {

			if ( !( $('#' + levelName).hasClass( 'active') ) ) {

				$('#easy').removeClass( 'active' );
				$('#medium').removeClass( 'active' );
				$('#hard').removeClass( 'active' );

				$('#' + levelName).addClass( 'active');
				Menu.level = Settings.levels[levelName];

				Menu.changedSettings( true );

			}

		};

		$('#easy').click(function() {

			setLevel( 'easy' );

		});

		$('#medium').click(function() {

			setLevel( 'medium' );

		});

		$('#hard').click(function() {

			setLevel( 'hard' );

		});


		function toggleFunction( name, on ) {

			if ( on !== Menu[name] ) {

				$('#' + name + 'On').toggleClass( 'active' );
				$('#' + name + 'Off').toggleClass( 'active' );

				Menu[name] = on;
				Menu.changedSettings( false );

			}

		};

		$('#animationsOn').click( function() {

			toggleFunction( 'animations', true );

		});

		$('#animationsOff').click( function() {

			toggleFunction( 'animations', false );

		});

		$('#recenterOn').click( function() {

			toggleFunction( 'recenter', true );

		});

		$('#recenterOff').click( function() {

			toggleFunction( 'recenter', false );

		});

		setMode( 'sweep' );
		setLevel( 'easy' );

		$('#animationsOn').addClass('active');
		$('#recenterOn').addClass('active');


		$('#apply').click(function() {

			if ( $(this).hasClass( 'active' ) ) {

				Settings.setFromMenu();

				Game.start( Menu.resize );
				Menu.hide();

				$(this).removeClass( 'active' );
				$(this).hide();

				Menu.resize = false;

			}

		});

		$('#apply').hide();

	},

	initStats : function() {

		function togglePrompt() {

			$('#clearButton').toggleClass( 'active' );
			$('#clearPrompt').toggle();

		}

		$('#clearButton').click( togglePrompt );

		$('#clearNowButton').click( function() {

			togglePrompt();
			Stats.clear();

			Menu.loadStats();

		});

		Menu.loadStats();

	},

	loadStats : function() {

		var names = this.levelNames,
			i;

		for ( i = 0; i < names.length; i++ ) {

			this.setBestTime( names[i] );

		}

		this.updateStats();

	},

	setTime : function( time ) {

		$('#time').text( Math.floor( time * 0.001 ) );

	},

	setMines : function( mines ) {

		mines = mines < 0 ? 0 : mines;

		$('#mines').text( mines );

	},

	reset : function( time, mines ) {

		this.setTime( time );
		this.setMines( mines );

		$('#winner').hide();
		$('#loser').hide();

		$('#restartButton').hide();

	},

	show : function() {

		$('#menu').toggle( true );
		$('#menuButton').addClass( 'active' );

		this.updateOverlay( true );

	},

	hide : function() {

		$('#menu').toggle( false );
		$('#menuButton').removeClass( 'active' );

		this.updateOverlay( false );

		this.hidePages();

	},

	toggle : function( hideAll ) {

		if ( $('#menu').is(":visible") ) {

			this.hide();

			if ( hideAll ) {

				$('#shareButton').removeClass('active');
				$('#feedbackButton').removeClass('active');
				$('#updateButton').removeClass('active');

				$('#share').hide();
				$('#feedback').hide();
				$('#update').hide();

				this.overlayCounter = 1;
				this.updateOverlay( false );

			}

		} else {

			this.show();

		}

	},

	hidePages : function() {

		var names = this.levelNames,
			i;

		for ( i = 0; i < names.length; i++ ) {

			$('#' + names[i]).removeClass('active');

		}

		names = this.pageNames;

		for ( i = 0; i < names.length; i++ ) {

			$('#' + names[i]).hide();
			$('#' + names[i] + 'Button').removeClass('active');

		}

		$('#newButton').removeClass( 'active' );

	},

	showWelcome : function() {

		$('#feedback').hide();

		$('#overlay').show();
		$('#welcomeWrapper').show();

	},

	showHUD : function() {

		$('#newButton').show();
		$('#menuButton').show();

		$('#shareButton').show();
		$('#feedbackButton').show();
		$('#updateButton').show();

		$('#timeDisplay').show();
		$('#mineDisplay').show();

		$('#overlay').click(function() {

			Menu.hide();

		});

		$('#welcomeWrapper').hide();

		this.updateOverlay( false );

		EventHandler.init();

	},

	error : function() {

		$('#error').show();

	},

	lose : function() {

		$('#loser').show();
		// $('#restartButton').show();
		$('#newButton').addClass( 'active' );

	},

	win : function() {

		$('#winner').show();
		$('#newButton').addClass( 'active' );

	},

	changedSettings : function( resize ) {

		if ( resize ) {

			this.resize = true;

		}

		$('#apply').addClass( 'active' );
		$('#apply').show();

	},

	setBestTime : function( name ) {

		var time = Stats.read( name );

		$('#' + name).text( Math.floor( time * 0.001 ) || '-' );

	},

	updateTime : function( name, time ) {

		this.setBestTime( name );

		Menu.show();

		$('#' + name).addClass( 'active' );

		$('#statsButton').addClass( 'active' );
		$('#stats').show();

	},

	updateStats : function() {

		$('#gamesWon').text( Stats.read( 'gamesWon' ) || 0 );
		$('#gamesPlayed').text( Stats.read( 'gamesPlayed' ) || 0 );
		$('#timePlayed').text( Math.floor( Stats.read( 'timePlayed' ) * 0.001 ) || 0 );

	},

	updateOverlay : function( increase ) {

		if ( increase ) {

			this.overlayCounter++;

			if ( this.overlayCounter === 1 ) {

				$('#overlay').css('z-index', 0);
				$("#overlay").fadeTo(500, 0.7);

			}

		} else if ( this.overlayCounter ) {

			this.overlayCounter--;

			if ( !this.overlayCounter ) {

				$("#overlay").fadeTo(100, 0.0, function() {

					$('#overlay').css('z-index', -1);

				});

			}

		}

	}

};