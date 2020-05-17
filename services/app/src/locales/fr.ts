export default {
	audio: {
		errors: {
			cannot_decode_audio_data: "Le buffer audio ne peut pas être décodé",
			cannot_load_audio_buffer: "Le buffer audio ne peut pas être chargé"
		}
	},
	splash: {
		CGU: "CGU",
		powered_with: "Utilise",
		description: "Expérimentations collaboratives et musicales",
		direct_welcome: "Bienvenue",
		direct_lets_go: "C'est parti"
	},
	help: {
		help: "Aide",
		rules: "Règles :",
		rule1: "Créez un compte",
		rule1b: "ou connectez-vous",
		rule2: "Créez une salle",
		rule2b: "ou rejoignez en une",
		notes: "Notes :",
		note1: "Une salle est protégée par un secret.",
		note2:
			"Aucune action ne peut être réalisée dans une salle verrouillée.",
		note3: "Aucune donnée personnelle n'est manipulée ou stockée."
	},
	user: {
		errors: {
			invalid: "L'utilisateur est invalide"
		},
		user: "Utilisateur",
		confirm_disconnect: "Êtes-vous sûr(e) de vouloir vous déconnecter ?",
		connect: "Se connecter",
		connection: "Connexion",
		create: "Créer un utilisateur",
		disconnect: "Se déconnecter",
		id: "Identifiant",
		id_is_invalid: "L'identifiant est invalide",
		id_placeholder: "Identifiant...",
		name_is_invalid: "Le nom est invalide",
		name_placeholder: "Nom...",
		name: "Nom",
		secret_is_invalid: "Le secret est invalide",
		secret_placeholder: "Secret...",
		secret: "Secret",
		user_creation: "Création d'un utilisateur",
		not_connected: "Aucun utilisateur identifié"
	},
	rooms: {
		errors: {
			invalid: "La salle est invalide",
			locked: "La salle est verrouillée"
		},
		types: {
			blind: "Blind Test",
			dj: "DJ",
			seabattle: "Bataille Navale"
		},
		clear: "Supprimer toutes les pistes",
		confirm_clear:
			"Êtes-vous sûr(e) de vouloir supprimer toutes les pistes ?",
		confirm_exit: "Êtes-vous sûr(e) de vouloir quitter la salle ?",
		confirm_lock: "Êtes-vous sûr(e) de vouloir verrouiller la salle ?",
		copy_link: "Copier le lien de la salle dans le presse-papier",
		create: "Créer une salle",
		empty: "Cette salle est vide, vous devriez ajouter quelques pistes...",
		empty_for_now: "Cette salle est pour le moment vide...",
		exit: "Quitter la salle",
		id: "Identifiant de la salle",
		id_placeholder: "Identifiant de la salle...",
		server_id: "Identifiant du serveur",
		server_id_placeholder: "Identifiant du serveur...",
		key_placeholder: "Clef...",
		type_placeholder: "Type...",
		key: "Clef",
		type: "Type",
		join: "Rejoindre une salle",
		loading: "Chargement...",
		link_copied_to_clipboard:
			"Le lien de la salle a été copié dans le presse-papier",
		locked: "Verrouillée (cliquer pour déverrouiller)",
		name_is_invalid: "Le nom est invalide",
		name_placeholder: "Nom...",
		name: "Nom",
		room: "Salle",
		room_creation: "Création d'une salle",
		room_join: "Rejoindre une salle",
		room_unlocking: "Déverrouillage de la salle",
		secret_is_invalid: "Le secret is invalide",
		unlock: "Déverrouiller",
		unlocked: "Déverrouillée (cliquer pour verrouiller)",
		media_count: "{{count}} media",
		media_count_plural: "{{count}} medias",
		track_count: "{{count}} piste",
		track_count_plural: "{{count}} pistes"
	},
	medias: {
		errors: {
			no_preview: "Aucun preview n'a été trouvée..."
		},
		by: "par {{artist}}",
		add: "Ajouter",
		remove: "Supprimer",
		search: "Chercher des médias",
		search_placeholder: "Recherche...",
		medias_search: "Recherche de médias",
		deezer: {
			albums: "Deezer Albums",
			playlists: "Deezer Playlists",
			tracks: "Deezer Pistes"
		},
		spotify: {
			albums: "Spotify Albums",
			playlists: "Spotify Playlists",
			tracks: "Spotify Pistes"
		}
	},
	player: {
		backward: "Piste précédente",
		forward: "Piste suivante",
		play: "Lire",
		playing: "En cours de lecture",
		stop: "Arrêter"
	},
	cancel: "Annuler",
	clear: "Supprimer",
	copy_to_clipboard: "Copier dans le presse-papier",
	loading: "Chargement...",
	secret_copied_to_clipboard: "Le secret a été copié dans le presse-papier",

	// --------------------------------------------------------------

	games: {
		seabattle: {
			help: {
				you_can: "À chaque tour, vous pouvez :",
				move_boat: "Déplacer un de vos navires",
				attack_opponent: "Attaquer un de vos ennemis",
				//
				to_move: "Pour réaliser un déplacements :",
				select_boat: "Sélectionnez un de vos navires",
				move_with_keyboard: "Déplacez le avec le clavier",
				or_use_the_buttons: "Ou utilisez les boutons :",
				//
				to_attack: "Pour réaliser une attaque :",
				select_weapon: "Sélectionnez une de vos armes",
				click_opponent_cell: "Cliquez sur la grille ennemi",
				//
				to_react: "Pour réagir à une attaque :",
				hitted_hit: "Rond rouge = ennemi blessé",
				missed_hit: "Rond blanc = ennemi raté"
			},
			turn_left: "Tourner à gauche",
			turn_right: "Tourner à droite",
			move_forward: "Avancer",
			move_backward: "Reculer",
			move_down: "Aller vers le bas",
			move_left: "Aller vers la gauche",
			move_right: "Aller vers la droite",
			move_up: "Aller vers le haut",
			movement_not_possible: "Ce déplacement est impossible !",
			movement_not_possible_because_hitted:
				"Un navire touché ne peut plus se déplacer !",
			opponent_index: "Adversaire {{index}}",
			join_battle: "Participer à la bataille",
			ship_already_hitted: "Le navire est touché touché à cette position",
			ship_already_killed: "Le navire a déjà été tué",
			hitted_opponent: "Vous avez touché un navire ennemi",
			killed_opponent_boat: "Vous avez détruit un navire ennemi",
			missed_opponent: "Vous n'avez pas touché de navire ennemi",
			no_weapon_selected: "Sélectionnez une arme pour attaquer",
			weapon_not_available: "L'arme sélectionnée n'est plus disponible",
			not_your_turn: "Ce n'est pas à votre tour de jouer",
			opponent_turn: "C'est au tour de votre adversaire de jouer",
			player_turn: "C'est à votre tour de bouger ou d'attaquer",
			you_lost: "Tous vos navires ont été abattus",
			you_won: "Tous les navires ennemis ont été abattus"
		},
		gameover: "Game Over",
		you_lost: "Perdu !",
		you_won: "Gagné !",
		max_players_count: "Le nombre maximal de joueurs est déjà atteint",
		no_opponents: "Aucun ennemi",
		no_opponents_to_attack: "Il n'y aucun ennemi à attaquer ...",
		connect_to_join: "Vous devez vous connecter pour participer ...",
		watch_or_join: "Vous pouvez regarder ou ..."
	}
};
