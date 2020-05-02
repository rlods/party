export default {
	audio: {
		errors: {
			cannot_decode_audio_data: "Audio buffer cannot be decoded",
			cannot_load_audio_buffer: "Audio buffer loading failed"
		}
	},
	splash: {
		CGU: "CGU",
		powered_with: "Powered with",
		description: "Collaborative & Musical Experimentations"
	},
	help: {
		help: "Help",
		rules: "Rules:",
		rule1: "Create an account",
		rule1b: "or connect",
		rule2: "Create a room",
		rule2b: "or join one",
		notes: "Notes:",
		note1:
			"A room is protected with a secret: it can be accessed without its secret but then no action can be done in it.",
		note2: "No personal data is accessed or stored."
	},
	user: {
		errors: {
			invalid: "User is invalid"
		},
		user: "User",
		confirm_disconnect: "Are you sure you want to disconnect?",
		connect: "Connect",
		connection: "Connection",
		create: "Create a user",
		disconnect: "Disconnect",
		id: "User ID",
		id_is_invalid: "ID is invalid",
		id_placeholder: "User ID...",
		name_is_invalid: "Name is invalid",
		name_placeholder: "User Name...",
		name: "User Name",
		secret_is_invalid: "Secret is invalid",
		secret_placeholder: "User Secret...",
		secret: "User Secret",
		user_creation: "User Registration",
		not_connected: "No user is identified"
	},
	rooms: {
		errors: {
			invalid: "Room is invalid",
			locked: "Room is locked"
		},
		types: {
			blind: "Blind Test",
			dj: "DJ",
			seabattle: "Sea Battle"
		},
		clear: "Clear all tracks",
		confirm_clear: "Are you sure you want to remove all tracks?",
		confirm_exit: "Are you sure you want to leave the room?",
		confirm_lock: "Are you sure you want to lock the room?",
		copy_link: "Copy Room Link to Clipboard",
		create: "Create a room",
		empty: "It's empty here, you should add some tracks...",
		empty_for_now: "It's empty here, the owner has to fill it..",
		exit: "Exit Room",
		id: "Room ID",
		id_placeholder: "Room ID...",
		server_id: "Server ID",
		server_id_placeholder: "Server ID...",
		key_placeholder: "Room Key...",
		type_placeholder: "Room Type...",
		key: "Room Key",
		type: "Room Type",
		join: "Join a Room",
		link_copied_to_clipboard: "Room link has been copied to clipboard",
		loading: "Loading...",
		locked: "Locked (click to unlock)",
		name_is_invalid: "Name is invalid",
		name_placeholder: "Room Name...",
		name: "Room Name",
		room_creation: "Room Creation",
		room_join: "Room Access",
		room_unlocking: "Room Unlocking",
		room: "Room",
		secret_is_invalid: "Secret is invalid",
		unlock: "Unlock",
		unlocked: "Unlocked (click to lock)",
		media_count: "{{count}} media",
		media_count_plural: "{{count}} medias",
		track_count: "{{count}} track",
		track_count_plural: "{{count}} tracks"
	},
	medias: {
		by: "by {{artist}}",
		add: "Add",
		remove: "Remove",
		search: "Search Media",
		search_placeholder: "Search...",
		medias_search: "Media Search",
		deezer: {
			albums: "Deezer Albums",
			playlists: "Deezer Playlists",
			tracks: "Deezer Tracks"
		},
		spotify: {
			albums: "Spotify Albums",
			playlists: "Spotify Playlists",
			tracks: "Spotify Tracks"
		}
	},
	player: {
		backward: "Backward",
		forward: "Forward",
		play: "Play",
		playing: "Playing",
		stop: "Stop"
	},
	cancel: "Cancel",
	clear: "Clear",
	copy_to_clipboard: "Copy to Clipboard",
	loading: "Loading...",
	secret_copied_to_clipboard: "Secret has been copied to clipboard",

	// --------------------------------------------------------------

	games: {
		seabattle: {
			help: {
				you_can: "At each turn, you can:",
				move_boat: "Move one of your ship",
				attack_opponent: "Attack an opponent",
				//
				to_move: "To move:",
				select_boat: "Select one of your ship",
				move_with_keyboard: "Move it with the keyboard",
				or_use_the_buttons: "Or move it using buttons",
				//
				to_attack: "To attack:",
				select_weapon: "Select one your weapon",
				click_opponent_cell: "Click on opponent grid",
				//
				to_react: "To react following an attack:",
				hitted_hit: "Red dot = opponent hitted",
				missed_hit: "White dot = opponent missed"
			},
			turn_left: "Turn Left",
			turn_right: "Turn Right",
			move_forward: "Move Forward",
			move_backward: "Move Backward",
			move_down: "Move Down",
			move_left: "Move Left",
			move_right: "Move Right",
			move_up: "Move Up",
			movement_not_possible: "This movement is not possible!",
			movement_not_possible_because_hitted: "A hitted ship cannot move!",
			opponent_index: "Opponent {{index}}",
			join_battle: "Join the battle",
			ship_already_hitted: "Ship is already hitten at this position",
			ship_already_killed: "Ship has already been killed",
			hitted_opponent: "You've hitted opponent ship",
			killed_opponent_boat: "You've destroyed opponent ship",
			missed_opponent: "You've missed opponent ship",
			no_weapon_selected: "Select a weapon to attack",
			weapon_not_available: "Selected weapon is not available",
			not_your_turn: "This is not your turn",
			opponent_turn: "It's your opponent turn to play",
			player_turn: "It's your turn to move or attack",
			you_lost1: "You lost!",
			you_lost2: "All your ships have been destroyed",
			you_won1: "You won!",
			you_won2: "All opponent ships have been destroyed"
		},
		gameover: "Game Over",
		max_players_count: "Maximum players number has been already reached",
		no_opponents: "No opponents",
		no_opponents_to_attack: "There is no opponent to attack...",
		connect_to_join: "You have to connect to join...",
		watch_or_join: "You can watch or..."
	}
};
