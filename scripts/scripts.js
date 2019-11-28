//New Player Object
const newPlayer = {
	abilityRolls: [],
	currentLevel: 1,
	maxHP: 0,
	currentXP: 0,
	abilityScores: {
		strength: 0,
		dexterity: 0,
		constitution: 0,
		intelligence: 0,
		wisdom: 0,
		charisma: 0,
	},
	abilityModifiers: {
		strength: 0,
		dexterity: 0,
		constitution: 0,
		intelligence: 0,
		wisdom: 0,
		charisma: 0,
	},
	savingThrows: [],
	spells: {
		cantrips: [],
		firstLevelSpells: [],
		firstLevelSpellSlots: 0,
	},
	proficiencies: [],
	proficiencyBonus: 2,
	skillProficiencies: [],
	advantages: [],
	abilities: [],
	languages: ['Common'],
	weapons: [],
	armor: [],
	inventory: [],
	currency: [],
};

//Dice Rolls

const rollDice = (sides) => {
	return 1 + Math.floor(Math.random() * sides);
}

//Determining Ability Scores

const rollForAbilityScore = (player) => {
	let abilityRolls = [];
	for (let i = 0; i < 4; i++) {
		abilityRolls.push(rollDice(6));
	}
	abilityRolls.sort(function (a, b) { return b - a });
	abilityRolls.pop();
	let finalRoll = abilityRolls.reduce((total, currentValue) => {
		return total + currentValue;
	})
	player.abilityRolls.push(finalRoll);
}

const rollCharacter = (player) => {
	for (let i = 0; i < 6; i++) {
		rollForAbilityScore(player);
	}
	player.abilityRolls.sort(function (a, b) { return b - a });
}

// Function  to calculate Spellcasting stats for appropriate classes

const calculateSpellSaveDC = () => {
	let spellSaveDC = 8 + newPlayer.proficiencyBonus + newPlayer.abilityModifiers.intelligence;
	newPlayer.spells.spellSaveDC = spellSaveDC;
	$('#spellSaveDC').text(`${spellSaveDC}`);

	let spellAttackMod = newPlayer.proficiencyBonus + newPlayer.abilityModifiers.intelligence;
	newPlayer.spells.spellAttackMod = spellAttackMod;
	$('#spellAttackMod').text(`${spellAttackMod}`);
}

$(document).ready(function () {

	// Functions to update ability scores and Modifiers

	const updateAbilityModifiers = (player) => {
		for (ability in player.abilityModifiers) {
			player.abilityModifiers[ability] = Math.floor((player.abilityScores[ability] - 10) / 2);

			$('#strMod').text(`${player.abilityModifiers.strength}`);
			$('#dexMod').text(`${player.abilityModifiers.dexterity}`);
			$('#conMod').text(`${player.abilityModifiers.constitution}`);
			$('#intMod').text(`${player.abilityModifiers.intelligence}`);
			$('#wisMod').text(`${player.abilityModifiers.wisdom}`);
			$('#chaMod').text(`${player.abilityModifiers.charisma}`);
		}

		let initiative = player.abilityModifiers.dexterity;
		$('#initiative').text(`${initiative}`);
		player.initiative = initiative;

		newPlayer.passivePerception = 10 + newPlayer.abilityModifiers.wisdom;
		$('#passivePerception').text(`${newPlayer.passivePerception}`);
	}

	const updateAbilityScores = (player) => {
		$('#strScore').text(`${player.abilityScores.strength}`);
		$('#dexScore').text(`${player.abilityScores.dexterity}`);
		$('#conScore').text(`${player.abilityScores.constitution}`);
		$('#intScore').text(`${player.abilityScores.intelligence}`);
		$('#wisScore').text(`${player.abilityScores.wisdom}`);
		$('#chaScore').text(`${player.abilityScores.charisma}`);
	}


	// Skill list interactivity (toggle proficiency)

	$('.skill').on('click', function (e) {
		e.preventDefault();
		$(this).toggleClass('proficient');
	})

	//BEGINNING OF USER FORM

	//Basics

	$('#submitBasics').on('click', function (e) {

		e.preventDefault();

		$(this).addClass("inactive");

		let name = $('[name=playerName]').val();
		newPlayer.playerName = name;
		$('#playerName').text(`${name}`);

		let characterName = $('[name=characterName').val();
		newPlayer.characterName = characterName;
		$('#characterName').text(`${characterName}`);

		let alignment = $("[name=alignment] option:selected").val();
		newPlayer.alignment = alignment;
		$('#alignment').text(`${alignment}`);


		$('#currentXP').text(0);
		$('#currentLevel').text(1);

		rollCharacter(newPlayer);
		let abilityRollsStr = newPlayer.abilityRolls.join(", ");
		$('.form').html(`
			<p>Your ability scores are ${abilityRollsStr}. Please assign them to the abilities below. You may also enter your own values if you prefer to roll your ability scores manually.<p>
			<form action="">
			
				<label for="strScore">Strength:</label>
				<input type="text" name="strScore">

				<label for="dexScore">Dexterity:</label>
				<input type="text" name="dexScore">

				<label for="conScore">Constitution:</label>
				<input type="text" name="conScore">

				<label for="intScore">Intelligence:</label>
				<input type="text" name="intScore">

				<label for="wisScore">Wisdom:</label>
				<input type="text" name="wisScore">

				<label for="chaScore">Charisma:</label>
				<input type="text" name="chaScore">
			</form>
			<div class="submit">
				<input type="submit" value="Next" id="submitAbilityScores">
			</div>`);

		addAbilityEventHandler();
	})


	//Determine Ability Scores

	const addAbilityEventHandler = () => {
		$('#submitAbilityScores').on('click', function (e) {
			e.preventDefault();
			$(this).addClass('inactive');

			let strScoreString = $('[name=strScore]').val();
			let strScore = Number(strScoreString);
			newPlayer.abilityScores.strength = strScore;
			$('#strScore').text(`${strScore}`);

			let dexScoreString = $('[name=dexScore]').val();
			let dexScore = Number(dexScoreString);
			newPlayer.abilityScores.dexterity = dexScore;
			$('#dexScore').text(`${dexScore}`);

			let conScoreString = $('[name=conScore]').val();
			let conScore = Number(conScoreString);
			newPlayer.abilityScores.constitution = conScore;
			$('#conScore').text(`${conScore}`);

			let intScoreString = $('[name=intScore]').val();
			let intScore = Number(intScoreString);
			newPlayer.abilityScores.intelligence = intScore;
			$('#intScore').text(`${intScore}`);

			let wisScoreString = $('[name=wisScore]').val();
			let wisScore = Number(wisScoreString);
			newPlayer.abilityScores.wisdom = wisScore;
			$('#wisScore').text(`${wisScore}`);

			let chaScoreString = $('[name=chaScore]').val();
			let chaScore = Number(chaScoreString);
			newPlayer.abilityScores.charisma = chaScore;
			$('#chaScore').text(`${chaScore}`);

			updateAbilityModifiers(newPlayer);

			$('#proficiencyBonus').text(2);

			$('.form').html(`<form action="">
				<label for="race">Race:</label>
				<select name="race">
					<option value="Dwarf">Dwarf</option>
					<option value="Elf">Elf</option>
					<option value="Halfling">Halfling</option>
					<option value="Human">Human</option>
					<option value="Dragonborn">Dragonborn</option>
					<option value="Gnome">Gnome</option>
					<option value="Half-Elf">Half-Elf</option>
					<option value="Half-Orc">Half-Orc</option>
					<option value="Tiefling">Tiefling</option>
				</select>
				<div class="submit">
					<input type="submit" value="Next" id="submitRaceSelection">
				</div>`);

			addRaceSelectionHandler();
		})
	};

	//Select Race & Set Race Basic Details

	const addRaceSelectionHandler = () => {
		$('#submitRaceSelection').on('click', function (e) {
			e.preventDefault();
			$(this).addClass('inactive');

			let race = $("[name=race] option:selected").val();
			newPlayer.race = race;
			$('#race').text(`${race}`);


			if (race == 'Dwarf') {
				dwarfBasics();
				addDwarfSubrace();
			} else if (race == 'Elf') {
				elfBasics();
				addElfSubrace();
			} else if (race == "Halfling") {
				halflingBasics();
				addHalflingSubrace();
			} else if (race == 'Human') {
				humanBasics();
				addSubmitHumanLanguageHandler();
			} else if (race == 'Dragonborn') {
				dragonbornBasics();
				addSubmitDraconicAncestryHandler();
			} else if (race === 'Gnome') {
				gnomeBasics();
				addSubmitGnomeSubraceHandler();
			} else if (race === 'Half-Elf') {
				halfElfBasics();
			} else if (race === 'Half-Orc') {
				halfOrcBasics();
			} else if (race === 'Tiefling') {
				tieflingBasics();
			} else {
				$('.form').append('<p>Something went wrong! Please try again.</p>');
			}
		});

	}


	// RACIAL TRAITS

	// DWARF FUNCTIONS

	//Dwarf Basics
	const dwarfBasics = () => {
		newPlayer.abilityScores.constitution = newPlayer.abilityScores.constitution + 2;
		updateAbilityScores(newPlayer);
		updateAbilityModifiers(newPlayer);
		$('conMod').text(`${newPlayer.abilityModifiers.constitution}`);

		newPlayer.speed = 25;
		$('#speed').text(25);

		newPlayer.proficiencies.push('battleaxe', 'handaxe', 'throwing hammer', 'warhammer');
		$('#proficiencies').append(`<li>Battleaxe</li>
			<li>Handaxe</li>
			<li>Throwing Hammer</li>
			<li>Warhammer</li>`);

		newPlayer.abilities.push('Darkvision', 'Stonecunning', 'Dwarven Resilience');
		$('#abilities').append(`<li>Darkvision</li>
			<li>Stonecunning</li>
			<li>Dwarven Resilience</li>`);

		newPlayer.languages.push('Dwarvish');
		$('#languages').append(`<li>Dwarvish</li>`);

		$('.form').html(`<form action="">
			<label for="dwarfSubrace">Subrace:</label>
			<select name="dwarfSubrace">
				<option value="Hill Dwarf">Hill Dwarf</option>
				<option value="Mountain Dwarf">Mountain Dwarf</option>
			</select>

			<label for="dwarfTools">Which artisan's tools would you like to be proficient in?</label>
			<select name="dwarfTools">
				<option value="Smith's Tools">Smith's Tools</option>
				<option value="Brewer's Tools">Brewer's Tools</option>
				<option value="Mason's Tools">Mason's Tools</option>
			</select>
			
			<div class="submit">
				<input type="submit" value="Next" id="submitDwarfSubrace">
			</div>`);
	}

	//Dwarf Subrace
	const addDwarfSubrace = () => {
		$('#submitDwarfSubrace').on('click', function (e) {
			e.preventDefault();
			$(this).addClass('inactive');

			let dwarfTools = $("[name=dwarfTools] option:selected").val();
			newPlayer.proficiencies.push(dwarfTools);
			$('#proficiencies').append(`<li>${dwarfTools}</li>`);

			let subrace = $('[name=dwarfSubrace] option:selected').val();
			newPlayer.subrace = subrace;
			$('#proficiencies').append(`<li>Dwarven Subrace: ${subrace}</li>`);


			if (subrace == 'Hill Dwarf') {
				newPlayer.abilityScores.wisdom = newPlayer.abilityScores.wisdom + 1;

				updateAbilityModifiers(newPlayer);
				newPlayer.maxHP = newPlayer.maxHP + 1;
				$('#currentHP').text(newPlayer.maxHP);
				$('#maxHP').text(newPlayer.maxHP);

				newPlayer.abilities.push('Dwarven Toughness');
				$('#abilities').append(`<li>Dwarven Toughness</li>`);

			} else if (subrace == 'Mountain Dwarf') {
				newPlayer.abilityScores.strength = newPlayer.abilityScores.strength + 2;
				updateAbilityScores(newPlayer);
				updateAbilityModifiers(newPlayer);

				newPlayer.proficiencies.push('light armor', 'medium armor');
				$('#proficiencies').append(`<li>Light Armor</li>
					<li>Medium Armor</li>`);
			}

			addClassSelection();
		})
	}


	// ELF FUNCTIONS

	// Elf Basics
	const elfBasics = () => {
		newPlayer.abilityScores.dexterity = newPlayer.abilityScores.dexterity + 2;
		updateAbilityScores(newPlayer);
		updateAbilityModifiers(newPlayer);

		newPlayer.speed = 30;
		$('#speed').text(30);

		newPlayer.abilities.push('Keen Senses', 'Fey Ancestry', 'Trance', 'Darkvision');
		$('#abilities').append(`<li>Darkvision</li>
			<li>Keen Senses</li>
			<li>Fey Ancestry</li>
			<li>Trance</li>`);

		newPlayer.skillProficiencies.push('Perception');
		$('#perception').addClass('proficient');

		newPlayer.languages.push('Elvish');
		$('#languages').append(`<li>Elvish</li>`);

		$('.form').html(`<form action="">
		<label for="elfSubrace">Subrace:</label>
		<select name="elfSubrace">
			<option value="High Elf">High Elf</option>
			<option value="Wood Elf">Wood Elf</option>
			<option value="Dark Elf">Dark Elf (Drow)</option>
		</select>

		<div class="submit">
			<input type="submit" value="Next" id="submitElfSubrace">
		</div>
		`)
	}

	//Elf Subrace
	const addElfSubrace = () => {
		$('#submitElfSubrace').on('click', function (e) {
			e.preventDefault();
			$(this).addClass('inactive');

			let subrace = $('[name=elfSubrace] option:selected').val();
			newPlayer.subrace = subrace;
			$('#proficiencies').append(`<li>Elven Subrace: ${subrace}</li>`);

			if (subrace == 'High Elf') {
				newPlayer.abilityScores.intelligence = newPlayer.abilityScores.intelligence + 1;
				updateAbilityScores(newPlayer);
				updateAbilityModifiers(newPlayer);

				newPlayer.proficiencies.push('longsword', 'shortsword', 'longbow', 'shortbow');
				$('#proficiencies').append(`<li>Longswords</li>
					<li>Shortswords</li>
					<li>Longbows</li>
					<li>Shortbows</li>`)

				$('.form').html(`<form action="">
					<h4>Proficiencies</h4>
					<label for="additionalLanguage">Language:</label>
					<select name="additionalLanguage">
						<option value="Common">Common (Standard)</option>
						<option value="Dwarvish">Dwarvish (Standard)</option>
						<option value="Elvish">Elvish (Standard)</option>
						<option value="Giant">Giant (Standard)</option>
						<option value="Gnomish">Gnomish (Standard)</option>
						<option value="Goblin">Goblin (Standard)</option>
						<option value="Halfling">Halfling (Standard)</option>
						<option value="Orc">Orc (Standard)</option>
						<option value="Abyssal">Abyssal (Exotic)</option>
						<option value="Celestial">Celestial (Exotic)</option>
						<option value="Draconic">Draconic (Exotic)</option>
						<option value="Deep Speech">Deep Speech (Exotic)</option>
						<option value="Infernal">Infernal (Exotic)</option>
						<option value="Primordial">Primordial (Exotic)</option>
						<option value="Sylvan">Sylvan (Exotic)</option>
						<option value="Undercommon">Undercommon (Exotic)</option>
					</select>

					<h4>Spellcasting</h4>
					<label for="highElfCantrip">Cantrip:</label>
					<select name="highElfCantrip">
						<option value="Acid Splash">Acid Splash</option>
						<option value="Blade Wardh">Blade Ward</option>
						<option value="Chill Touch">Chill Touch</option>
						<option value="Dancing Lights">Dancing Lights</option>
						<option value="Fire Bolt">Fire Bolt</option>
						<option value="Friends">Friends</option>
						<option value="Light">Light</option>
						<option value="Mage Hand">Mage Hand</option>
						<option value="Mending">Mending</option>
						<option value="Message">Message</option>
						<option value="Minor Illusion">Minor Illusion</option>
						<option value="Poison Spray">Poison Spray</option>
						<option value="Prestidigitation">Prestidigitation</option>
						<option value="Ray of Frost">Ray of Frost</option>
						<option value="Shocking Grasp">Shocking Grasp</option>
						<option value="True Strike">True Strike</option>
					</select>

					<div class="submit">
						<input type="submit" value="Next" id="submitHighElf">
					</div>`)

				addSubmitHighElfHandler();

			} else if (subrace == 'Wood Elf') {
				newPlayer.abilityScores.wisdom = newPlayer.abilityScores.wisdom + 1;
				newPlayer.speed = newPlayer.speed + 5;
				$('#speed').text(`${newPlayer.speed}`);
				updateAbilityScores(newPlayer);
				updateAbilityModifiers(newPlayer);

				newPlayer.proficiencies.push('longsword', 'shortsword', 'longbow', 'shortbow');
				$('#proficiencies').append(`<li>Longswords</li>
					<li>Shortswords<li>
					<li>Longbows</li>
					<li>Shortbows</li>`);

				newPlayer.abilities.push('Mask of the Wild');
				$('#abilities').append(`<li>Mask of the Wild</li>`);

				addClassSelection();

			} else if (subrace == 'Dark Elf') {
				newPlayer.abilityScores.charisma = newPlayer.abilityScores.charisma + 1;
				updateAbilityScores(newPlayer);
				updateAbilityModifiers(newPlayer);

				newPlayer.abilities.push('Superior Darkvision', 'Sunlight Sensitivity', 'Drow Magic');
				$('#abilities').append(`<li>Superior Darkvision</li>
					<li>Sunlight Sensitivity</li>
					<li>Drow Magic</li>`);

				newPlayer.spells.cantrips.push('Dancing Lights - Spellcasting Ability is Charisma');
				$('#cantrips').append(`<li>Dancing Lights - Spellcasting Ability is Charisma</li>`);

				newPlayer.proficiencies.push('rapiers', 'shortswords', 'hand crossbows');
				$('#proficiencies').append(`<li>Rapiers</li>
					<li>Shortswords</li>
					<li>Hand crossbows</li>`);

				addClassSelection();
			}
		});
	}

	//Options for High Elves
	const addSubmitHighElfHandler = () => {
		$('#submitHighElf').on('click', function (e) {
			e.preventDefault();
			$(this).addClass('inactive');

			let language = $('[name=additionalLanguage] option:selected').val();
			newPlayer.languages.push(language);
			$('#languages').append(`<li>${language}<li>`);

			let highElfCantrip = $('[name=highElfCantrip] option:selected').val();
			newPlayer.spells.cantrips.push(`${highElfCantrip} - Spellcasting Ability is Intelligence`);
			$('#cantrips').append(`<li>${highElfCantrip} - Spellcasting Ability is Intelligence</li>`);

			addClassSelection();
		})
	}


	// HALFLING FUNCTIONS

	//Halfling Basics
	const halflingBasics = () => {
		newPlayer.abilityScores.dexterity = newPlayer.abilityScores.dexterity + 2;
		updateAbilityScores(newPlayer);
		updateAbilityModifiers(newPlayer);

		newPlayer.speed = 25;
		$('#speed').text(25);

		newPlayer.abilities.push('Lucky', 'Brave', 'Halfling Nimbleness');
		$('#abilities').append(`<li>Lucky</li>
			<li>Brave</li>
			<li>Halfling Nimbleness</li>`);

		newPlayer.languages.push('Halfling');
		$('#languages').append(`<li>Halfling</li>`);

		$('.form').html(`<form action="">
		<label for="halflingSubrace">Subrace:</label>
		<select name="halflingSubrace">
			<option value="Stout Halfling">Stout Halfling</option>
			<option value="Lightfoot Halfling">Lightfoot Halfling</option>
		</select>

		<div class="submit">
			<input type="submit" value="Next" id="submitHalflingSubrace">
		</div>`);
	}

	//Halfling Subrace
	const addHalflingSubrace = () => {
		$('#submitHalflingSubrace').on('click', function (e) {
			e.preventDefault();
			$(this).addClass('inactive');

			let subrace = $('[name=halflingSubrace] option:selected').val();
			newPlayer.subrace = subrace;
			$('#proficiencies').append(`<li>Halfling Subrace: ${subrace}</li>`);


			if (subrace == 'Stout Halfling') {
				newPlayer.abilityScores.constitution = newPlayer.abilityScores.constitution + 1;
				updateAbilityScores(newPlayer);
				updateAbilityModifiers(newPlayer);

				newPlayer.abilities.push('Stout Resilience');
				$('#abilities').append(`<li>Stout Resilience</li>`);
			} else if (subrace == 'Lightfoot Halfling') {
				newPlayer.abilityScores.charisma = newPlayer.abilityScores.charisma + 1;
				updateAbilityScores(newPlayer);
				updateAbilityModifiers(newPlayer);

				newPlayer.abilities.push('Naturally Stealthy');
				$('#abilities').append(`<li>Naturally Stealthy</li>`);
			}

			addClassSelection();
		})
	}


	// HUMAN FUNCTIONS

	//Human Basics
	const humanBasics = () => {
		newPlayer.abilityScores.strength = newPlayer.abilityScores.strength + 1;
		newPlayer.abilityScores.dexterity = newPlayer.abilityScores.dexterity + 1;
		newPlayer.abilityScores.constitution = newPlayer.abilityScores.constitution + 1;
		newPlayer.abilityScores.intelligence = newPlayer.abilityScores.intelligence + 1;
		newPlayer.abilityScores.wisdom = newPlayer.abilityScores.wisdom + 1;
		newPlayer.abilityScores.charisma = newPlayer.abilityScores.charisma + 1;
		updateAbilityScores(newPlayer);
		updateAbilityModifiers(newPlayer);

		newPlayer.speed = 30;
		$('#speed').text(30);

		$('.form').html(`<form action="">
		<label for="humanLanguage">Additional Language:</label>
		<select name="humanLanguage">
			<option value="Common">Common (Standard)</option>
			<option value="Dwarvish">Dwarvish (Standard)</option>
			<option value="Elvish">Elvish (Standard)</option>
			<option value="Giant">Giant (Standard)</option>
			<option value="Gnomish">Gnomish (Standard)</option>
			<option value="Goblin">Goblin (Standard)</option>
			<option value="Halfling">Halfling (Standard)</option>
			<option value="Orc">Orc (Standard)</option>
			<option value="Abyssal">Abyssal (Exotic)</option>
			<option value="Celestial">Celestial (Exotic)</option>
			<option value="Draconic">Draconic (Exotic)</option>
			<option value="Deep Speech">Deep Speech (Exotic)</option>
			<option value="Infernal">Infernal (Exotic)</option>
			<option value="Primordial">Primordial (Exotic)</option>
			<option value="Sylvan">Sylvan (Exotic)</option>
			<option value="Undercommon">Undercommon (Exotic)</option>
		</select>

		<div class="submit">
			<input type="submit" value="Next" id="submitHumanLanguage">
		</div>`);
	}

	//Human Details
	const addSubmitHumanLanguageHandler = () => {
		$('#submitHumanLanguage').on('click', function (e) {
			e.preventDefault();
			$(this).addClass('inactive');

			let language = $('[name=humanLanguage] option:selected').val();
			newPlayer.languages.push(language);
			$('#languages').append(`<li>${language}</li>`);

			addClassSelection();
		})
	}

	// DRAGONBORN FUNCTIONS

	// Dragonborn Basics
	const dragonbornBasics = () => {
		newPlayer.abilityScores.strength = newPlayer.abilityScores.strength + 2;
		newPlayer.abilityScores.charisma = newPlayer.abilityScores.charisma + 1;
		updateAbilityModifiers(newPlayer);
		updateAbilityScores(newPlayer);

		newPlayer.speed = 30;
		$('#speed').text(30);

		newPlayer.abilities.push('Breath Weapon');
		$('#abilities').append(`<li>Breath Weapon</li>`)

		newPlayer.languages.push('Draconic');
		$('#languages').append(`<li>Draconic</li>`);

		$('.form').html(`<form action="">
			<label for="draconicAncestry">Draconic Ancestry:</label>
			<select name="draconicAncestry">
				<option value="Black">Black</option>
				<option value="Blue">Blue</option>
				<option value="Brass">Brass</option>
				<option value="Bronze">Bronze</option>
				<option value="Copper">Copper</option>
				<option value="Gold">Gold</option>
				<option value="Green">Green</option>
				<option value="Red">Red</option>
				<option value="Silver">Silver</option>
				<option value="White">White</option>
			</select>
			<div class="submit">
				<input type="submit" value="Next" id="submitDraconicAncestry">
			</div>
			`);
	}

	//Dragonborn Details
	const addSubmitDraconicAncestryHandler = () => {
		$('#submitDraconicAncestry').on('click', function (e) {
			e.preventDefault();
			$(this).addClass('inactive');

			let ancestry = $('[name=draconicAncestry] option:selected').val();
			newPlayer.draconicAncestry = ancestry;
			$('#abilities').append(`<li>Draconic Ancestry: ${ancestry}</li>`);

			if (ancestry == 'Black' || ancestry == 'Copper') {
				newPlayer.abilities.push('Resistance to acid');
				$('#abilities').append(`<li>Resistance to acid</li>`)
			} else if (ancestry == 'Blue' || ancestry == "Bronze") {
				newPlayer.abilities.push('Resistance to lightning');
				$('#abilities').append(`<li>Resistance to lightning</li>`)
			} else if (ancestry == 'Brass' || ancestry == 'Red' || ancestry == 'Gold') {
				newPlayer.abilities.push('Resistance to fire');
				$('#abilities').append(`<li>Resistance to fire</li>`);
			} else if (ancestry == 'Green') {
				newPlayer.abilities.push('Resistance to poison');
				$('#abilities').append(`<li>Resistance to poison</li>`);
			} else if (ancestry == 'Silver' || ancestry == 'White') {
				newPlayer.abilities.push('Resistance to cold');
				$('#abilities').append(`<li>Resistance to cold</li>`);
			}

			addClassSelection();
		})
	}


	// GNOME FUNCTIONS

	//Gnome Basics
	const gnomeBasics = () => {
		newPlayer.abilityScores.intelligence = newPlayer.abilityScores.intelligence + 2;
		updateAbilityModifiers(newPlayer);
		updateAbilityScores(newPlayer);

		newPlayer.speed = 25;
		$('#speed').text(25);

		newPlayer.abilities.push('Darkvision', 'Gnome Cunning');
		$('#abilities').append(`<li>Darkvision</li>
			<li>Gnome Cunning</li>`)

		newPlayer.languages.push('Gnomish');
		$('#languages').append(`<li>Gnomish</li>`);

		$('.form').html(`<form action="">
			<label for="gnomeSubrace">Subrace:</label>
			<select name="gnomeSubrace">
				<option value="Forest Gnome">Forest Gnome</option>
				<option value="Rock Gnome">Rock Gnome</option>
			</select>
			<div class="submit">
				<input type="submit" value="Next" id="submitGnomeSubrace">
			</div>
			`);
	}

	// Gnome Subrace
	const addSubmitGnomeSubraceHandler = () => {
		$('#submitGnomeSubrace').on('click', function (e) {
			e.preventDefault();
			$(this).addClass('inactive');

			let subrace = $('[name=gnomeSubrace] option:selected').val();
			newPlayer.subrace = subrace;
			$('#proficiencies').append(`<li>Gnome Subrace: ${subrace}</li>`);

			if (subrace === 'Forest Gnome') {
				newPlayer.abilityScores.dexterity = newPlayer.abilityScores.dexterity + 1;
				updateAbilityScores(newPlayer);
				updateAbilityModifiers(newPlayer);

				newPlayer.spells.cantrips.push('Minor Illusion - Spellcasting Ability is Intelligence');
				$('#cantrips').append('<li>Minor Illusion - Spellcasting Ability is Intelligence')
				newPlayer.abilities.push('Speak with Small Beasts');
				$('#abilities').append('<li>Speak with Small Beasts');

			} else if (subrace === 'Rock Gnome') {
				newPlayer.abilityScores.constitution = newPlayer.abilityScores.constitution + 1;
				updateAbilityScores(newPlayer);
				updateAbilityModifiers(newPlayer);

				newPlayer.abilities.push('Artificer\'s Lore', 'Tinker');
				$('#abilities').append(`<li>Artificer's Lore</li>
					<li>Tinker</li>`);

				newPlayer.proficiencies.push('Tinker\'s Tools');
				$('#proficiencies').append(`<li>Tinker's Tools</li>`);

			}

			addClassSelection();
		})
	}


	// HALF-ELF FUNCTIONS

	//Half-Elf Basics
	const halfElfBasics = () => {
		newPlayer.abilityScores.charisma = newPlayer.abilityScores.charisma + 2;
		updateAbilityScores(newPlayer);
		updateAbilityModifiers(newPlayer);

		newPlayer.speed = 30;
		$('#speed').text(30);

		newPlayer.abilities.push('Darkvision', 'Fey Ancestry');
		$('#abilities').append(`<li>Darkvision</li>
			<li>Fey Ancestry</li>`);

		newPlayer.languages.push('Elvish');
		$('#languages').append(`<li>Elvish</li>`);

		$('.form').html(`<form action="">
			<label for="halfElfLanguage">Additional Language:</label>
			<select name="halfElfLanguage">
				<option value="Common">Common (Standard)</option>
				<option value="Dwarvish">Dwarvish (Standard)</option>
				<option value="Elvish">Elvish (Standard)</option>
				<option value="Giant">Giant (Standard)</option>
				<option value="Gnomish">Gnomish (Standard)</option>
				<option value="Goblin">Goblin (Standard)</option>
				<option value="Halfling">Halfling (Standard)</option>
				<option value="Orc">Orc (Standard)</option>
				<option value="Abyssal">Abyssal (Exotic)</option>
				<option value="Celestial">Celestial (Exotic)</option>
				<option value="Draconic">Draconic (Exotic)</option>
				<option value="Deep Speech">Deep Speech (Exotic)</option>
				<option value="Infernal">Infernal (Exotic)</option>
				<option value="Primordial">Primordial (Exotic)</option>
				<option value="Sylvan">Sylvan (Exotic)</option>
				<option value="Undercommon">Undercommon (Exotic)</option>
			</select>

			<h4>Ability Score Increases</h4>
			<p>Half-Elves get +2 Charisma and two more ability scores increase by one. Which two abilities would you like to increase?</p>
			<ul class="abilityScoreOption">
				<li class=scoreOption id=strOption value=Strength>Strength</li>
				<li class=scoreOption id=dexOption>Dexterity</li>
				<li class=scoreOption id=conOption>Constitution</li>
				<li class=scoreOption id=intOption>Intelligence</li>
				<li class=scoreOption id=wisOption>Wisdom</li>
			</ul>

			<h4>Skills</h4>
			<p>You gain proficiency in two skills of your choice, please select them on the list below.</p>

			<div class="submit">
				<input type="submit" value="Next" id="submitHalfElfDetails">
			</div>
			`);

		$('.scoreOption').on('click', function (e) {
			e.preventDefault();
			$(this).toggleClass('increase');
		})

		submitHalfElfDetails();
	}

	const submitHalfElfDetails = () => {
		$('#submitHalfElfDetails').on('click', function (e) {
			e.preventDefault();

			let language = $('[name=halfElfLanguage] option:selected').val();
			newPlayer.languages.push(language);
			$('#languages').append(`<li>${language}</li>`);

			if ($("#strOption").hasClass('increase')) {
				newPlayer.abilityScores.strength = newPlayer.abilityScores.strength + 1;
			}
			if ($('#dexOption').hasClass('increase')) {
				newPlayer.abilityScores.dexterity = newPlayer.abilityScores.dexterity + 1;
			}
			if ($('#conOption').hasClass('increase')) {
				newPlayer.abilityScores.constitution = newPlayer.abilityScores.constitution + 1;
			}
			if ($('#intOption').hasClass('increase')) {
				newPlayer.abilityScores.intelligence = newPlayer.abilityScores.intelligence + 1;
			}
			if ($('#wisOption').hasClass('increase')) {
				newPlayer.abilityScores.wisdom = newPlayer.abilityScores.wisdom + 1;
			}

			updateAbilityScores(newPlayer);
			updateAbilityModifiers(newPlayer);
			addClassSelection();
		})
	}

	const halfOrcBasics = () => {
		newPlayer.abilityScores.strength = newPlayer.abilityScores.strength + 2;
		newPlayer.abilityScores.constitution = newPlayer.abilityScores.constitution + 1;

		newPlayer.speed = 30;
		$('#speed').text(30);

		newPlayer.abilities.push('Darkvision', 'Savage Attacks');
		$('#abilities').append(`<li>Darkvision</li>
			<li>Savage Attacks</li>`);

		newPlayer.skillProficiencies.push('Intimidation');
		$('#intimidation').addClass('proficient');

		newPlayer.languages.push('Orc');
		$('#languages').append(`<li>Orc</li>`);

		updateAbilityScores(newPlayer);
		updateAbilityModifiers(newPlayer);
		addClassSelection();
	}

	const tieflingBasics = () => {
		newPlayer.abilityScores.intelligence = newPlayer.abilityScores.intelligence + 1;
		newPlayer.abilityScores.charisma = newPlayer.abilityScores.charisma + 2;

		newPlayer.speed = 30;
		$('#speed').text(30);

		newPlayer.abilities.push('Darkvision', 'Hellish Resistance', 'Infernal Legacy');
		$('#abilities').append(`<li>Darkvision</li>
			<li>Hellish Resistance</li>
			<li>Infernal Legacy</li>`);

		newPlayer.spells.cantrips.push('Thaumaturgy - Charisma spellcasting ability');
		$('#cantrips').append(`<li>Thaumaturgy - Charisma spellcasting ability</li>`);

		newPlayer.languages.push('Infernal');
		$('#languages').append(`<li>Infernal</li>`);

		updateAbilityScores(newPlayer);
		updateAbilityModifiers(newPlayer);
		addClassSelection();
	}


	//SELECT CLASS AND SET CLASS DETAILS

	const addClassSelection = () => {
		$('.form').html(`<form action="">
			<label for="characterClass">Class:</label>
			<select name="characterClass">
				<option value="Barbarian">Barbarian</option>
				<option value="Bard">Bard</option>
				<option value="Cleric">Cleric</option>
				<option value="Druid">Druid</option>
				<option value="Fighter">Fighter</option>
				<option value="Monk">Monk</option>
				<option value="Paladin">Paladin</option>
				<option value="Ranger">Ranger</option>
				<option value="Rogue">Tiefling</option>
				<option value="Sorcerer">Sorcerer</option>
				<option value="Warlock">Warlock</option>
				<option value="Wizard">Wizard</option>
			</select>
			<div class="submit">
				<input type="submit" value="Next" id="submitClassSelection">
			</div>`)

		addClassSelectionSubmitHandler();
	}

	const addClassSelectionSubmitHandler = () => {
		$('#submitClassSelection').on('click', function (e) {
			e.preventDefault();
			$(this).addClass('inactive');

			let characterClass = $('[name=characterClass] option:selected').val();
			newPlayer.characterClass = characterClass;
			$('#characterClass').text(`${characterClass}`);

			if (characterClass == 'Barbarian') {
				barbarianBasics();
			} else if (characterClass == 'Bard') {
				bardBasics();
			} else if (characterClass == 'Cleric') {
				clericBasics();
			} else if (characterClass == 'Druid') {
				druidBasics();
			} else {
				$('.form').append('<p>Please choose another class (Barbarian, Bard, or Cleric), this one is still being worked on!</p>')
			}
		})

	}

	//Options for Barbarians
	const barbarianBasics = () => {
		newPlayer.hitDice = '1d12';
		$('#hitDice').text('1d12');

		newPlayer.maxHP = newPlayer.maxHP + 12 + newPlayer.abilityModifiers.constitution;
		$('#currentHP').text(`${newPlayer.maxHP}`);
		$('#maxHP').text(`${newPlayer.maxHP}`);

		newPlayer.proficiencies.push('light armor', 'medium armor', 'shields', 'simple weapons', 'martial weapons');
		$('#proficiencies').append(`<li>Light armor</li>
				<li>Medium armor</li>
				<li>Shields</li>
				<li>Simple weapons</li>
				<li>Martial weapons</li>`);

		newPlayer.savingThrows.push('strength, constitution');
		$('#strSavingThrow').addClass('savingThrow');
		$('#conSavingThrow').addClass('savingThrow');

		newPlayer.abilities.push('Rage', 'Unarmored Defense', 'Reckless Attack');
		$('#abilities').append(`<li>Rage</li>
				<li>Unarmored Defense</li>
				<li>Reckless Attack</li>`);

		newPlayer.inventory.push('explorer\'s pack');
		$('#inventory').append(`<li>Explorer's Pack</li>`);

		$('#weapons').append(`<li>4x Javelins</li>`);

		$('#spellcastingAbility').text('None');
		$('#spellcastingClass').text('None');

		$('.form').html(`<form action="">
				<h4>Proficiencies</h4>
				<p>You may select two skills from this list to gain proficiency in:</p>
				<ul>
					<li>Animal Handling</li>
					<li>Athletics</li>
					<li>Intimidation</li>
					<li>Nature</li>
					<li>Perception</li>
					<li>Survival</li>
				</ul>
				<p>Please make your selection on the character sheet below.
				<h4>Inventory</h4>
				<p>Suggested Barbarian weapons are a greataxe and two handaxes, but you may choose any two weapons from the lists below. More information and stats on each weapon can be found on page 149 of the player's handbook.</p>
				<label for="barbarianMartialWeapon">Weapon One:</label>
				<select name="barbarianMartialWeapon" id="">
				<option value="Greataxe (1d12 slashing)">Greataxe (1d12 slashing)</option>
				<option value="Battleaxe (1d8 slashing)">Battleaxe (1d8 slashing)</option>
				<option value="Flail (1d8 bludgeoning)">Flail (1d8 bludgeoning)</option>
				<option value="Glaive (1d10 slashing)">Glaive (1d10 slashing)</option>
				<option value="Greatsword (2d6 slashing)">Greatsword (2d6 slashing)</option>
				<option value="Halberd (1d10 slashing)">Halberd (1d10 slashing)</option>
				<option value="Lance (1d12 piercing)">Lance (1d12 piercing)</option>
				<option value="Longsword (1d8 slashing)">Longsword (1d8 slashing)</option>
				<option value="Maul (2d6 bludgeoning(">Maul (2d6 bludgeoning(</option>
				<option value="Morningstar (1d8 piercing)">Morningstar (1d8 piercing)</option>
				<option value="Pike (1d10)">Pike (1d10)</option>
				<option value="Rapier (1d8 piercing)">Rapier (1d8 piercing)</option>
				<option value="Scimitar (1d6 slashing)">Scimitar (1d6 slashing)</option>
				<option value="Shortsword (1d6 piercing)">Shortsword (1d6 piercing)</option>
				<option value="Trident (1d6 piercing)">Trident (1d6 piercing)</option>
				<option value="War pick (1d8 piercing)">War pick (1d8 piercing)</option>
				<option value="Warhammer (1d8 bludgeoning)">Warhammer (1d8 bludgeoning)</option>
				<option value="Whip (1d4 slashing)">Whip (1d4 slashing)</option>
				<option value="Blowgun (1 piercing)">Blowgun (1 piercing)</option>
				<option value="Hand crossbow (1d6 piercing)">Hand crossbow (1d6 piercing)</option>
				<option value="Heavy crossbow (1d10 piercing)">Heavy crossbow (1d10 piercing)</option>
				<option value="Longbow (1d8 piercing)">Longbow (1d8 piercing)</option>
				<option value="Net (damage n/a)">Net (damage n/a)</option>
			</select>
				<label for="barbarianSimpleWeapon">Weapon Two:</label>
				<select name="barbarianSimpleWeapon">
					<option value="2x Handaxe (1d6 slashing)">Two Handaxes (1d6 slashing)</option>
					<option value="Club (1d4 bludgeoning)">Club (1d4 bludgeoning)</option>
					<option value="Dagger (1d4 piercing)">Dagger (1d4 piercing)</option>
					<option value="Greatclub (1d8 bludgeoning)">Greatclub (1d8 bludgeoning)</option>
					<option value="Handaxe (1d6 slashing)">Handaxe (1d6 slashing)</option>
					<option value="Javelin (1d6 piercing)">Javelin (1d6 piercing)</option>
					<option value="Light hammer (1d4 bludgeoning)">Light hammer (1d4 bludgeoning)</option>
					<option value="Mace (1d6 bludgeoning)">Mace (1d6 bludgeoning)</option>
					<option value="Quarterstaff (1d6 bludgeoning)">Quarterstaff (1d6 bludgeoning)</option>
					<option value="Sickle (1d4 slashing)">Sickle (1d4 slashing)</option>
					<option value="Spear (1d6 piercing)">Spear (1d6 piercing)</option>
					<option value="Light crossbow (1d8 piercing)">Light crossbow (1d8 piercing)</option>
					<option value="Dart (1d4 piercing)">Dart (1d4 piercing)</option>
					<option value="Shortbow (1d6 piercing)">Shortbow (1d6 piercing)</option>
					<option value="Sling (1d4 bludgeoning)">Sling (1d4 bludgeoning)</option>
				</select>
				<div class="submit">
					<input type="submit" value="Finish" id="submitBarbarianDetails">
				</div>
				`)

		addBarbarianDetailsSubmitHandler();

	}

	const addBarbarianDetailsSubmitHandler = () => {
		$('#submitBarbarianDetails').on('click', function (e) {
			e.preventDefault();
			$(this).addClass('inactive');

			newPlayer.skillProficiencies = $(".proficient").toArray();

			let weaponOne = $('[name=barbarianMartialWeapon]').val();
			let weaponTwo = $('[name=barbarianSimpleWeapon]').val();
			$('#weapons').append(`<li>${weaponOne}</li>
				<li>${weaponTwo}</li>`);
			newPlayer.weapons.push(weaponOne, weaponTwo);
		});
	}

})
// Options for Bards

const bardBasics = () => {
	newPlayer.hitDice = '1d8';
	$('#hitDice').text('1d8');

	newPlayer.maxHP = newPlayer.maxHP + 8 + newPlayer.abilityModifiers.constitution;
	$('#currentHP').text(`${newPlayer.maxHP}`);
	$('#maxHP').text(`${newPlayer.maxHP}`);

	newPlayer.proficiencies.push('light armor', 'simple weapons', 'hand crossbows', 'longswords', 'rapiers', 'shortswords');
	$('#proficiencies').append(`<li>Light armor</li>
			<li>Simple weapons</li>
			<li>Hand crossbows</li>
			<li>Longswords</li>
			<li>Shortswords</li>
			<li>Rapiers</li>`);

	newPlayer.savingThrows.push('dexterity', 'charisma');
	$('#dexSavingThrow').addClass('savingThrow');
	$('#chaSavingThrow').addClass('savingThrow');

	newPlayer.abilities.push('Bardic Inspiration');
	$('#abilities').append(`<li>Bardic Inspiration</li>`)

	newPlayer.armor.push('leather armor');
	$('#armor').append(`<li>Leather armor</li>`);

	newPlayer.weapons.push('dagger');
	$('#weapons').append(`<li>Dagger</li>`);

	newPlayer.spells.firstLevelSpellSlots = 2;
	$('#firstLevelSpellSlots').text(2);

	newPlayer.spellcastingAbility = 'Charisma';
	$('#spellcastingAbility').text('Charisma');
	$('#spellcastingClass').text('Bard');

	calculateSpellSaveDC();

	$('.form').html(`<form action="">
			<h4>Proficiencies</h4>
			<label for="instrumentProficiencyOne">Instrument Proficiency:</label>
			<select name="instrumentProficiencyOne">
				<option value="Bagpipes">Bagpipes</option>
				<option value="Drum">Drum</option>
				<option value="Dulcimer">Dulcimer</option>
				<option value="Flute">Flute</option>
				<option value="Lute">Lute</option>
				<option value="Lyre">Lyre</option>
				<option value="Horn">Horn</option>
				<option value="Pan Flute">Pan Flute</option>
				<option value="Shawm">Shawm</option>
				<option value="Viol">Viol</option>
			</select>
			<label for="instrumentProficiencyTwo">Instrument Proficiency:</label>
			<select name="instrumentProficiencyTwo">
				<option value="Bagpipes">Bagpipes</option>
				<option value="Drum">Drum</option>
				<option value="Dulcimer">Dulcimer</option>
				<option value="Flute">Flute</option>
				<option value="Lute">Lute</option>
				<option value="Lyre">Lyre</option>
				<option value="Horn">Horn</option>
				<option value="Pan Flute">Pan Flute</option>
				<option value="Shawm">Shawm</option>
				<option value="Viol">Viol</option>
			</select>
			<label for="instrumentProficiencyThree">Instrument Proficiency:</label>
			<select name="instrumentProficiencyThree">
				<option value="Bagpipes">Bagpipes</option>
				<option value="Drum">Drum</option>
				<option value="Dulcimer">Dulcimer</option>
				<option value="Flute">Flute</option>
				<option value="Lute">Lute</option>
				<option value="Lyre">Lyre</option>
				<option value="Horn">Horn</option>
				<option value="Pan Flute">Pan Flute</option>
				<option value="Shawm">Shawm</option>
				<option value="Viol">Viol</option>
			</select>
			<p>Select three (3) of the skills on the character sheet below to gain proficiency in.</p>
			<h4>Inventory</h4>
			<p>Suggested Bard weapons are a rapier or longsword, but you may choose any weapon from the list below. More information and stats on each weapon can be found on page 149 of the player's handbook.</p>
			<label for="bardWeapon">Weapon:</label>
			<select name="bardWeapon">
				<option value="Rapier (1d8 piercing)">Rapier (1d8 piercing)</option>
				<option value="Longsword (1d8 slashing)">Longsword (1d8 slashing)</option>
				<option value="Club (1d4 bludgeoning)">Club (1d4 bludgeoning)</option>
				<option value="Dagger (1d4 piercing)">Dagger (1d4 piercing)</option>
				<option value="Greatclub (1d8 bludgeoning)">Greatclub (1d8 bludgeoning)</option>
				<option value="Handaxe (1d6 slashing)">Handaxe (1d6 slashing)</option>
				<option value="Javelin (1d6 piercing)">Javelin (1d6 piercing)</option>
				<option value="Light hammer (1d4 bludgeoning)">Light hammer (1d4 bludgeoning)</option>
				<option value="Mace (1d6 bludgeoning)">Mace (1d6 bludgeoning)</option>
				<option value="Quarterstaff (1d6 bludgeoning)">Quarterstaff (1d6 bludgeoning)</option>
				<option value="Sickle (1d4 slashing)">Sickle (1d4 slashing)</option>
				<option value="Spear (1d6 piercing)">Spear (1d6 piercing)</option>
				<option value="Light crossbow (1d8 piercing)">Light crossbow (1d8 piercing)</option>
				<option value="Dart (1d4 piercing)">Dart (1d4 piercing)</option>
				<option value="Shortbow (1d6 piercing)">Shortbow (1d6 piercing)</option>
				<option value="Sling (1d4 bludgeoning)">Sling (1d4 bludgeoning)</option>
			</select>
			<label for="bardPack">Pack:</label>
			<select name="bardPack">
				<option value="Diplomat's pack">Diplomat's pack</option>
				<option value="Entertainer's pack">Entertainer's pack</option>
			</select>
			<label for="bardInstrument">Instrument:</label>
			<select name="bardInstrument">
				<option value="Bagpipes">Bagpipes</option>
				<option value="Drum">Drum</option>
				<option value="Dulcimer">Dulcimer</option>
				<option value="Flute">Flute</option>
				<option value="Lute">Lute</option>
				<option value="Lyre">Lyre</option>
				<option value="Horn">Horn</option>
				<option value="Pan Flute">Pan Flute</option>
				<option value="Shawm">Shawm</option>
				<option value="Viol">Viol</option>
			</select>
			<h4>Spellcasting</h4>
			<p>See page 207 of the Player's Handbook to reference descriptions of each spell.</p>
			<label for="cantripOne">Cantrip:</label>
			<select name="cantripOne">
				<option value="Blade Ward">Blade Ward</option>
				<option value="Dancing Lights">Dancing Lights</option>
				<option value="Friends">Friends</option>
				<option value="Light">Light</option>
				<option value="Mage Hand">Mage Hand</option>
				<option value="Mending">Mending</option>
				<option value="Message">Message</option>
				<option value="Minor Illusion">Minor Illusion</option>
				<option value="Prestidigitation">Prestidigitation</option>
				<option value="True Strike">True Strike</option>
				<option value="Vicious Mockery">Vicious Mockery</option>
			</select>
			<label for="cantripTwo">Cantrip:</label>
			<select name="cantripTwo">
				<option value="Blade Ward">Blade Ward</option>
				<option value="Dancing Lights">Dancing Lights</option>
				<option value="Friends">Friends</option>
				<option value="Light">Light</option>
				<option value="Mage Hand">Mage Hand</option>
				<option value="Mending">Mending</option>
				<option value="Message">Message</option>
				<option value="Minor Illusion">Minor Illusion</option>
				<option value="Prestidigitation">Prestidigitation</option>
				<option value="True Strike">True Strike</option>
				<option value="Vicious Mockery">Vicious Mockery</option>
			</select>
			<label for="firstLevelSpellOne">1st Level Spell:</label>
			<select name="firstLevelSpellOne">
				<option value="Animal Friendship">Animal Friendship</option>
				<option value="Bane">Bane</option>
				<option value="Charm Person">Charm Person</option>
				<option value="Comprehend Languages">Comprehend Languages</option>
				<option value="Cure Wounds">Cure Wounds</option>
				<option value="Detect Magic">Detect Magic</option>
				<option value="Disguise Self">Disguise Self</option>
				<option value="Dissonant Whispers">Dissonant Whispers</option>
				<option value="Faerie Fire">Faerie Fire</option>
				<option value="Feather Fall">Feather Fall</option>
				<option value="Healing Word">Healing Word</option>
				<option value="Heroism">Heroism</option>
				<option value="Identify">Identify</option>
				<option value="Illusory Script">Illusory Script</option>
				<option value="Longstrider">Longstrider</option>
				<option value="Silent Image">Silent Image</option>
				<option value="Sleep">Sleep</option>
				<option value="Speak with Animals">Speak with Animals</option>
				<option value="Tasha's Hideous Laughter">Tasha's Hideous Laughter</option>
				<option value="Thunderwave">Thunderwave</option>
				<option value="Unseen Servant">Unseen Servant</option>		
			</select>
			<label for="firstLevelSpellTwo">1st Level Spell:</label>
			<select name="firstLevelSpellTwo">
				<option value="Animal Friendship">Animal Friendship</option>
				<option value="Bane">Bane</option>
				<option value="Charm Person">Charm Person</option>
				<option value="Comprehend Languages">Comprehend Languages</option>
				<option value="Cure Wounds">Cure Wounds</option>
				<option value="Detect Magic">Detect Magic</option>
				<option value="Disguise Self">Disguise Self</option>
				<option value="Dissonant Whispers">Dissonant Whispers</option>
				<option value="Faerie Fire">Faerie Fire</option>
				<option value="Feather Fall">Feather Fall</option>
				<option value="Healing Word">Healing Word</option>
				<option value="Heroism">Heroism</option>
				<option value="Identify">Identify</option>
				<option value="Illusory Script">Illusory Script</option>
				<option value="Longstrider">Longstrider</option>
				<option value="Silent Image">Silent Image</option>
				<option value="Sleep">Sleep</option>
				<option value="Speak with Animals">Speak with Animals</option>
				<option value="Tasha's Hideous Laughter">Tasha's Hideous Laughter</option>
				<option value="Thunderwave">Thunderwave</option>
				<option value="Unseen Servant">Unseen Servant</option>		
			</select>
			<label for="firstLevelSpellThree">1st Level Spell:</label>
			<select name="firstLevelSpellThree">
				<option value="Animal Friendship">Animal Friendship</option>
				<option value="Bane">Bane</option>
				<option value="Charm Person">Charm Person</option>
				<option value="Comprehend Languages">Comprehend Languages</option>
				<option value="Cure Wounds">Cure Wounds</option>
				<option value="Detect Magic">Detect Magic</option>
				<option value="Disguise Self">Disguise Self</option>
				<option value="Dissonant Whispers">Dissonant Whispers</option>
				<option value="Faerie Fire">Faerie Fire</option>
				<option value="Feather Fall">Feather Fall</option>
				<option value="Healing Word">Healing Word</option>
				<option value="Heroism">Heroism</option>
				<option value="Identify">Identify</option>
				<option value="Illusory Script">Illusory Script</option>
				<option value="Longstrider">Longstrider</option>
				<option value="Silent Image">Silent Image</option>
				<option value="Sleep">Sleep</option>
				<option value="Speak with Animals">Speak with Animals</option>
				<option value="Tasha's Hideous Laughter">Tasha's Hideous Laughter</option>
				<option value="Thunderwave">Thunderwave</option>
				<option value="Unseen Servant">Unseen Servant</option>		
			</select>
			<label for="firstLevelSpellFour">1st Level Spell:</label>
			<select name="firstLevelSpellFour">
				<option value="Animal Friendship">Animal Friendship</option>
				<option value="Bane">Bane</option>
				<option value="Charm Person">Charm Person</option>
				<option value="Comprehend Languages">Comprehend Languages</option>
				<option value="Cure Wounds">Cure Wounds</option>
				<option value="Detect Magic">Detect Magic</option>
				<option value="Disguise Self">Disguise Self</option>
				<option value="Dissonant Whispers">Dissonant Whispers</option>
				<option value="Faerie Fire">Faerie Fire</option>
				<option value="Feather Fall">Feather Fall</option>
				<option value="Healing Word">Healing Word</option>
				<option value="Heroism">Heroism</option>
				<option value="Identify">Identify</option>
				<option value="Illusory Script">Illusory Script</option>
				<option value="Longstrider">Longstrider</option>
				<option value="Silent Image">Silent Image</option>
				<option value="Sleep">Sleep</option>
				<option value="Speak with Animals">Speak with Animals</option>
				<option value="Tasha's Hideous Laughter">Tasha's Hideous Laughter</option>
				<option value="Thunderwave">Thunderwave</option>
				<option value="Unseen Servant">Unseen Servant</option>		
			</select>
			<div class="submit">
				<input type="submit" value="Finish" id="submitBardDetails">
			</div>
		`)

	addBardDetailsSubmitHandler();
}

const addBardDetailsSubmitHandler = () => {
	$('#submitBardDetails').on('click', function (e) {
		e.preventDefault();
		$(this).addClass('inactive');

		newPlayer.skillProficiencies = $(".proficient").toArray();

		let instrumentOne = $('[name=instrumentProficiencyOne] option:selected').val();
		let instrumentTwo = $('[name=instrumentProficiencyTwo] option:selected').val();
		let instrumentThree = $('[name=instrumentProficiencyThree] option:selected').val();
		newPlayer.proficiencies.push(instrumentOne, instrumentTwo, instrumentThree)
		$('#proficiencies').append(`<li>${instrumentOne}</li>
				<li>${instrumentTwo}</li>
				<li>${instrumentThree}</li>`);

		let weapon = $('[name=bardWeapon] option:selected').val();
		newPlayer.weapons.push(weapon);
		$('#weapons').append(`<li>${weapon}</li>`);

		let pack = $('[name=bardPack').val();
		newPlayer.inventory.push(pack);

		let bardInstrument = $('[name=bardInstrument] option:selected').val();
		newPlayer.inventory.push(bardInstrument);

		$('#inventory').append(`<li>${pack}</li>
				<li>${bardInstrument}</li>`);

		let cantripOne = $('[name=cantripOne] option:selected').val();
		let cantripTwo = $('[name=cantripTwo] option:selected').val();
		newPlayer.spells.cantrips.push(cantripOne, cantripTwo);
		$('#cantrips').append(`<li>${cantripOne}</li>
				<li>${cantripTwo}</li>`);

		let spellOne = $('[name=firstLevelSpellOne] option:selected').val();
		let spellTwo = $('[name=firstLevelSpellTwo] option:selected').val();
		let spellThree = $('[name=firstLevelSpellThree] option:selected').val();
		let spellFour = $('[name=firstLevelSpellFour] option:selected').val();
		newPlayer.spells.firstLevelSpells.push(spellOne, spellTwo, spellThree, spellFour);
		$('#firstLevelSpells').append(`<li>${spellOne}</li>
				<li>${spellTwo}</li>
				<li>${spellThree}</li>
				<li>${spellFour}</li>`);
	})
}

// Options for Clerics

const clericBasics = () => {
	newPlayer.hitDice = '1d8';
	$('#hitDice').text('1d8');

	newPlayer.maxHP = newPlayer.maxHP + 8 + newPlayer.abilityModifiers.constitution;
	$('#currentHP').text(`${newPlayer.maxHP}`);
	$('#maxHP').text(`${newPlayer.maxHP}`);

	newPlayer.proficiencies.push('light armor', 'medium armor', 'shields', 'simple weapons');
	$('#proficiencies').append(`<li>Light armor</li>
			<li>Medium armor</li>
			<li>Shields</li>
			<li>Simple weapons</li>`);

	newPlayer.savingThrows.push('wisdom', 'charisma');
	$('#wisSavingThrow').addClass('savingThrow');
	$('#chaSavingThrow').addClass('savingThrow');

	newPlayer.abilities.push('Ritual Casting');
	$('#abilities').append(`<li>Ritual Casting</li>`);

	newPlayer.armor.push('Shield');
	$('#armor').append(`<li>Shield</li>`);

	newPlayer.inventory.push('Holy Symbol');
	$('#inventory').push(`<li>Holy Symbol</li>`);

	newPlayer.spells.firstLevelSpellSlots = 2;
	$('#firstLevelSpellSlots').text(2);

	newPlayer.spellcastingAbility = 'Wisdom';
	$('#spellcastingAbility').text('Wisdom');
	$('#spellcastingClass').text('Cleric')

	calculateSpellSaveDC();

	$('.form').html(`<form action="">
			<h4>Inventory</h4>
			<p>Suggested Cleric weapons are a mace and a light crossbow, however the mace may be upgraded to a Warhammer if you are already proficient in warhammers or all Martial Melee Weapons, and you may choose any simple weapon in place of the light crossbow. More information and stats on each weapon can be found on page 149 of the player's handbook.</p>
			<label for="clericWeapon">Weapon One:</label>
			<select name="clericWeaponOne">
				<option value="Mace (1d6 bludgeoning)">Mace (1d6 bludgeoning)</option>
				<option value="Warhammer (1d8 bludgeoning)">Warhammer (1d8 bludgeoning)</option>
			</select>

			<label for="clericWeaponTwo">Weapon Two:</label>
			<select name="clericWeaponTwo">
				<option value="Light crossbow (1d8 piercing)">Light Crossbow and 20 bolts (1d8 piercing)</option>
				<option value="Club (1d4 bludgeoning)">Club (1d4 bludgeoning)</option>
				<option value="Dagger (1d4 piercing)">Dagger (1d4 piercing)</option>
				<option value="Greatclub (1d8 bludgeoning)">Greatclub (1d8 bludgeoning)</option>
				<option value="Handaxe (1d6 slashing)">Handaxe (1d6 slashing)</option>
				<option value="Javelin (1d6 piercing)">Javelin (1d6 piercing)</option>
				<option value="Light hammer (d4 bludgeoning)">Light hammer (d4 bludgeoning)</option>
				<option value="Mace (1d6 bludgeoning)">Mace (1d6 bludgeoning)</option>
				<option value="Quarterstaff (1d6 bludgeoning)">Quarterstaff (1d6 bludgeoning)</option>
				<option value="Sickle (1d4 slashing)">Sickle (1d4 slashing)</option>
				<option value="Spear (1d6 piercing)">Spear (1d6 piercing)</option>
				<option value="Dart (1d4 piercing)">Dart (1d4 piercing)</option>
				<option value="Shortbow (1d6 piercing)">Shortbow (1d6 piercing)</option>
				<option value="Sling (1d4 bludgeoning)">Sling (1d4 bludgeoning)</option>
			</select>
					
			<label for="clericArmor">Armor:</label>
			<select name="clericArmor">
				<option value="Scale Mail">Scale Mail</option>
				<option value="Leather Armor">Leather Armor</option>
				<option value="Chain Mail">Chain Mail</option>
			</select>
			<p>More information on armor types can be found on page 145 of the player's Handbook.</p>

			<label for='clericPack'>Pack:</label>
			<select name="clericPack">
				<option value="Priest">Priest's Pack</option>
				<option value="Explorer">Explorer's Pack</option>
			</select>

		
			<h4>Spellcasting</h4>	
			<p>See page 207 of the Player's Handbook to reference descriptions of each spell.</p>

			<label for='cantripOne'>Cantrip One:</label>
			<select name="cantripOne">
				<option value="Guidance">Guidance</option>
				<option value="Light">Light</option>
				<option value="Mending">Mending</option>
				<option value="Resistance">Resistance</option>
				<option value="Sacred Flame">Sacred Flame</option>
				<option value="Spare the Dying">Spare the Dying</option>
				<option value="Thaumaturgy">Thaumaturgy</option>
			</select>

			<label for='cantripTwo'>Cantrip Two:</label>
			<select name="cantripTwo">
				<option value="Guidance">Guidance</option>
				<option value="Light">Light</option>
				<option value="Mending">Mending</option>
				<option value="Resistance">Resistance</option>
				<option value="Sacred Flame">Sacred Flame</option>
				<option value="Spare the Dying">Spare the Dying</option>
				<option value="Thaumaturgy">Thaumaturgy</option>
			</select>

			<label for='cantripThree'>Cantrip Three:</label>
			<select name="cantripThree">
				<option value="Guidance">Guidance</option>
				<option value="Light">Light</option>
				<option value="Mending">Mending</option>
				<option value="Resistance">Resistance</option>
				<option value="Sacred Flame">Sacred Flame</option>
				<option value="Spare the Dying">Spare the Dying</option>
				<option value="Thaumaturgy">Thaumaturgy</option>
			</select>

			<h4>Domain</h4>
			<p>Choose a domain related to your deity. Descriptions of each domain can be found at the end of class description, on page 59 of the Player's Handbook.</p>

			<label for='clericDomain'>Domain:</label>
			<select name='clericDomain'>
				<option value='Knowledge'>Knowledge</option>
				<option value='Life'>Life</option>
				<option value='Light'>Light</option>
				<option value='Nature'>Nature</option>
				<option value='Tempest'>Tempest</option>
				<option value='Trickery'>Trickery</option>
				<option value='War'>War</option>
			</select>

			<div class="submit">
				<input type="submit" value="Next" id="submitClericDetails">
			</div>
			`)

	submitClericDetails();
}

const submitClericDetails = () => {
	$('#submitClericDetails').on('click', function (e) {
		e.preventDefault();
		$(this).addClass('inactive');

		// weapons
		let clericWeaponOne = $('[name=clericWeaponOne] option:selected').val();
		let clericWeaponTwo = $('[name=clericWeaponTwo] option:selected').val();

		newPlayer.weapons.push(clericWeaponOne, clericWeaponTwo);
		$('#weapons').append(`
		<li>${clericWeaponOne}</li>
		<li>${clericWeaponTwo}</li>`);

		// armor
		let clericArmor = $('[name=clericArmor] option:selected').val();
		newPlayer.armor.push(clericArmor);
		$('#armor').append(`<li>${clericArmor}</li>`);

		// pack
		let clericPack = $('[name=clericPack] option:selected').val();
		newPlayer.inventory.push(clericPack);
		$('#inventory').append(`<li>${clericPack}</li>`);

		//spellcasting
		//cantrips
		let cantripOne = $('[name=cantripOne] option:selected').val();
		let cantripTwo = $('[name=cantripTwo] option:selected').val();
		let cantripThree = $('[name=cantripThree] option:selected').val();
		newPlayer.spells.cantrips.push(cantripOne, cantripTwo, cantripThree);
		$('#cantrips').append(`<li>${cantripOne}</li>
				<li>${cantripTwo}</li>
				<li>${cantripThree}</li>`);

		//domain
		let domain = $('[name=clericDomain] option:selected').val();
		newPlayer.spells.domain = domain;
		$('.spellTop').append(`Domain: ${domain}`);

		if (domain == 'Knowledge') {
			$('#firstLevelSpells').append(`<li>Command</li><li>Identify</li>`);
			newPlayer.spells.firstLevelSpells.push('Command');
			newPlayer.spells.firstLevelSpells.push('Identify');

			$('.form').html(`
			<form action="">
			<p>The knowledge domain gives you and additional language as well as two spells at first level that are automatically prepared each day: <span class="italic">Command</span> and <span class="italic">Identify</span> These spells are automatically prepared at the beginning of every day. Refer to page 59 of the Player's Handbook for more details and spells earned at higher levels.</p>
			<form action="">
			<label for="domainLanguage">Additional Language:</label>
			<select name="domainLanguage">
			<option value="Common">Common (Standard)</option>
			<option value="Dwarvish">Dwarvish (Standard)</option>
			<option value="Elvish">Elvish (Standard)</option>
			<option value="Giant">Giant (Standard)</option>
			<option value="Gnomish">Gnomish (Standard)</option>
			<option value="Goblin">Goblin (Standard)</option>
			<option value="Halfling">Halfling (Standard)</option>
			<option value="Orc">Orc (Standard)</option>
			<option value="Abyssal">Abyssal (Exotic)</option>
			<option value="Celestial">Celestial (Exotic)</option>
			<option value="Draconic">Draconic (Exotic)</option>
			<option value="Deep Speech">Deep Speech (Exotic)</option>
			<option value="Infernal">Infernal (Exotic)</option>
			<option value="Primordial">Primordial (Exotic)</option>
			<option value="Sylvan">Sylvan (Exotic)</option>
			<option value="Undercommon">Undercommon (Exotic)</option>
		</select>
		
		<div class="submit">
			<input type="submit" value="Next" id="knowledgeDomain">
		</div>
		</form>`);

		knowledgeDomain();
		} else if (domain == 'Life') {
			$('#firstLevelSpells').append(`<li>Burning Hands</li><li>Faerie Fire</li>`);
			newPlayer.spells.firstLevelSpells.push('Burning Hands');
			newPlayer.spells.firstLevelSpells.push('Faerie Fire');

			let light = newPlayer.spells.cantrips.includes('Light');
			if (!light) {
				newPlayer.spells.cantrips.push('Light');
				$('#cantrips').append(`<li>Light</li>`);
			}

			$('#abilities').append(`<li>Warding Flare</li>`);
			newPlayer.abilities.push('Warding Flare');
		} else if (domain === 'Nature') {
			$('#firstLevelSpells').append(`<li>Animal Friendship</li><li>Speak with Animals</li>`);
			newPlayer.spells.firstLevelSpells.push('Animal Friendship');
			newPlayer.spells.firstLevelSpells.push('Speak with Animals');

			$('#proficiencies').append(`<li>Heavy Armour</li>`)
			newPlayer.proficiencies.push('Heavy Armour');

			$('.form').append(`<p>The Nature domain allows you to learn one Druid Cantrip of your choice. You also gain proficiency in either Animal Handling, Nature, or Survival. Please choose your cantrip from the list below and select your new proficiency from the list on the character sheet.</p>
			<form action="">
			<label for="druidCantrip">Druid Cantrip:</label>
			<select name="druidCantrip">
			<option value="Druidcraft">Druidcraft</option>
			<option value="Guidance">Guidance</option>
			<option value="Mending">Mending</option>
			<option value="Poison Spray">Poison Spray</option>
			<option value="Produce Flame">Produce Flame</option>
			<option value="Resistance">Resistance</option>
			<option value="Shillagh">Shillagh</option>
			<option value="Thorn Whip">Thorn Whip</option>
			</select>`);
		} else if (domain === 'Tempest') {
			$('#firstLevelSpells').append(`<li>Fog Cloud</li><li>Thunderwave</li>`);
			newPlayer.spells.firstLevelSpells.push('Fog Cloud');
			newPlayer.spells.firstLevelSpells.push('Thunderwave');

			$('#proficiencies').append(`<li>Heavy Armour</li><li>Martial Weapons</li>`)
			newPlayer.proficiencies.push('Heavy Armour');
			newPlayer.proficiencies.push('Marital Weapons');

			$('#abilities').append(`<li>Wrath of the Storm</li>`);
			newPlayer.abilities.push('Wrath of the Storm');
		} else if (domain == 'Trickery') {
			$('#firstLevelSpells').append(`<li>Charm Person</li><li>Disguise Self</li>`);
			newPlayer.spells.firstLevelSpells.push('Charm Person');
			newPlayer.spells.firstLevelSpells.push('Disguise Self');

			$('#abilities').append(`<li>Blessing of the Trickster</li>`);
			newPlayer.abilities.push('Blessing of the Trickster');
		} else if (domain == 'War') {
			$('#firstLevelSpells').append(`<li>Divine Favour</li><li>Shield of Faith</li>`);
			newPlayer.spells.firstLevelSpells.push('Divine Favour');
			newPlayer.spells.firstLevelSpells.push('Shield of Faith');

			$('#proficiencies').append(`<li>Heavy Armour</li><li>Martial Weapons</li>`)
			newPlayer.proficiencies.push('Heavy Armour');
			newPlayer.proficiencies.push('Marital Weapons');

			$('#abilities').append(`<li>War Priest</li>`);
			newPlayer.abilities.push('War Priest');
		}
	});
}

// knowledge domain handler
const knowledgeDomain = () => {
	//adding submit handlers for each daomin individually
	$('#knowledgeDomain').on('click', function (e) {
		e.preventDefault();
		$(this).addClass('inactive');

		let language = $('[name=domainLanguage] option:selected').val();
		newPlayer.languages.push(language);
		$('#languages').append(`<li>${language}</li>`);
	})
}

// nature domain handler
const natureDomain = () => {
	$('#druidCantrip').on('click', function (e) {
		e.preventDefault();
		$(this).addClass('inactive');

		let cantrip = $('[name=druidCantrip] option:selected').val();
		newPlayer.spells.cantrips.push(cantrip);
		$('#cantrips').append(`${cantrip}`);
	})
}



//Options for Druids 

const druidBasics = () => {
	newPlayer.hitDice = '1d8';
	$('#hitDice').text('1d8');

	newPlayer.maxHP = newPlayer.maxHP + 8 + newPlayer.abilityModifiers.constitution;
	$('#currentHP').text(`${newPlayer.maxHP}`);
	$('#maxHP').text(`${newPlayer.maxHP}`);

	newPlayer.proficiencies.push('light armor', 'medium armor', 'shields', 'simple weapons');
	$('#proficiencies').append(`<li>Light armor</li>
			<li>Medium armor</li>
			<li>Shields</li>
			<li>Simple weapons</li>`);
}





//add code to get skill proficiencies to player object at the end