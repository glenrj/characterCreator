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
weapons:[],
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
		abilityRolls.sort(function(a, b){return b - a});
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
	player.abilityRolls.sort(function(a, b){return b - a});
}

$( document ).ready(function() {

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

	// $('.additionalAbilityScore').on('click', function(e){
	// 	e.preventDefault();
	// 	$(this).toggleClass('proficient');
	// })

	// Function  to calculate Spellcasting stats for appropriate classes

	const spellSaveDC = () => {
		let spellSaveDC = 8 + newPlayer.proficiencyBonus + newPlayer.abilityModifiers.intelligence;
		newPlayer.spells.spellSaveDC = spellSaveDC;
		$('#spellSaveDC').text(`${spellSaveDC}`);

		let spellAttackMod = newPlayer.proficiencyBonus + newPlayer.abilityModifiers.intelligence;
		newPlayer.spells.spellAttackMod = spellAttackMod;
		$('#spellAttackMod').text(`${spellAttackMod}`);
	}

	// Skill list interactivity (toggle proficiency)

	$('.skill').on('click', function(e){
		e.preventDefault();
		$(this).toggleClass('proficient');
	})

	//BEGINNING OF USER FORM

	//Basics

	$('#submitBasics').on('click', function(e){

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
		$('.form').append(`<p>Your ability scores are ${abilityRollsStr}. Please assign them to the abilities below. You may also enter your own values if you prefer to roll your ability scores manually.<p>
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
		$('#submitAbilityScores').on('click', function(e){
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

			$('.form').append(`<form action="">
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
		$('#submitRaceSelection').on('click', function(e){
			e.preventDefault();
			$(this).addClass('inactive');

			let race = $("[name=race] option:selected").val();
			newPlayer.race = race;
			$('#race').text(`${race}`);


			if(race == 'Dwarf') {
				dwarfBasics();
				addDwarfSubrace();
				} else if (race == 'Elf'){					
					elfBasics();
					addElfSubrace();
				} else if (race == "Halfling") {					
					halflingBasics();
					addHalflingSubrace();
				} else if (race == 'Human') {
					humanBasics();
					addSubmitHumanLanguageHandler();
				} else if(race == 'Dragonborn') {
					dragonbornBasics();
					addSubmitDraconicAncestryHandler();
				} else if(race === 'Gnome') {
					gnomeBasics();
					addSubmitGnomeSubraceHandler();
				} else if(race === 'Half-Elf') {
					halfElfBasics();



				} else {

				$('.form').append('<p>Please choose another race (Dwarf, Elf, Halfling, Human, or Dragonborn, or Gnome), this one is still being worked on!</p>');
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

		$('.form').append(`<form action="">
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
		$('#submitDwarfSubrace').on('click', function(e){
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

		$('.form').append(`<form action="">
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
		$('#submitElfSubrace').on('click', function(e){
			e.preventDefault();
			$(this).addClass('inactive');

			let subrace = $('[name=elfSubrace] option:selected').val();
			newPlayer.subrace = subrace;
			$('#proficiencies').append(`<li>Elven Subrace: ${subrace}</li>`);

			if (subrace == 'High Elf'){
				newPlayer.abilityScores.intelligence = newPlayer.abilityScores.intelligence + 1;
				updateAbilityScores(newPlayer);
				updateAbilityModifiers(newPlayer);

				newPlayer.proficiencies.push('longsword', 'shortsword', 'longbow', 'shortbow');
				$('#proficiencies').append(`<li>Longswords</li>
					<li>Shortswords</li>
					<li>Longbows</li>
					<li>Shortbows</li>`)

				$('.form').append(`<form action="">
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

			} else if( subrace == 'Dark Elf') {
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
		$('#submitHighElf').on('click', function(e){
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

		$('.form').append(`<form action="">
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
		$('#submitHalflingSubrace').on('click', function(e) {
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

		$('.form').append(`<form action="">
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
		$('#submitHumanLanguage').on('click', function(e) {
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

		$('.form').append(`<form action="">
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
		$('#submitDraconicAncestry').on('click', function(e) {
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

		$('.form').append(`<form action="">
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
		$('#submitGnomeSubrace').on('click', function(e) {
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

		$('.form').append(`<form action="">
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
				<li class=scoreOption>Strength</li>
				<li class=scoreOption>Dexterity</li>
				<li class=scoreOption>Constitution</li>
				<li class=scoreOption>Intelligence</li>
				<li class=scoreOption>Wisdom</li>
			</ul>

			<div class="submit">
				<input type="submit" value="Next" id="submitHalfElfDetails">
			</div>
			`);

		$('.scoreOption').on('click', function(e) {
			e.preventDefault();
			$(this).toggleClass('increase');
		})

		// THIS IS INCOMPLETE, FIGURE OUT HOW TO IMPLEMENT THE SELECTION
	}
























	//Select Class & Set Class Basic Details

	const addClassSelection = () => {
		$('.form').append(`<form action="">
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
		$('#submitClassSelection').on('click', function(e){
			e.preventDefault();
			$(this).addClass('inactive');

			let characterClass = $('[name=characterClass] option:selected').val();
			newPlayer.characterClass = characterClass;
			$('#characterClass').text(`${characterClass}`);

			if (characterClass == 'Barbarian') {
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

	 			$('.form').append(`<form action="">
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

			} else if (characterClass == 'Bard') {
				newPlayer.hitDice = '1d8';
				$('#hitDice').text('1d8');

				newPlayer.maxHP = newPlayer.maxHP + 8 + newPlayer.abilityModifiers.constitution;
				$('#currentHP').text(`${newPlayer.maxHP}`);
				$('#maxHP').text(`${newPlayer.maxHP}`);

				newPlayer.proficiencies.push('light armor', 'simple weapons', 'hand crossbows', 'longswords', 'rapiers', 'shortswords');
				$('#proficiencies').append(`<li>light armor</li>
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

				spellSaveDC();

				$('.form').append(`<form action="">
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

			} else {
				$('.form').append('<p>Please choose another class (Barbarian or Bard), this one is still being worked on!</p>')
			}
		})

	}

	// Options for Bards

	const addBardDetailsSubmitHandler = () => {
		$('#submitBardDetails').on('click', function(e) {
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

	//Options for Barbarians

	const addBarbarianDetailsSubmitHandler = () => {
		$('#submitBarbarianDetails').on('click', function(e) {
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

	














