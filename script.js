// ==UserScript==
// @name         BR ANNID Display & Copy Functions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://animemusicquiz.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animemusicquiz.com
// @grant        none
// ==/UserScript==


// ANNID DISPLAY
BattleRoyalCollectionController.prototype.addEntry = function (entry) {
	let name = this.extractShowName(entry);
	let $entry = $("<li><div class='brEntryDrop clickAble'>×</div> <span class='brDisplayANNID' style='color: lightblue; font-size: 9px; text-decoration: underline; cursor:pointer;'>" + entry.id + "</span><span class='brLootedAnimeName'> " + name + '</span></li>');
	$entry.popover({
		content: "[#" + entry.id + "] " + name,
		delay: { show: 50, hide: 0 },
		placement: 'auto',
		trigger: 'hover',
		container: '#brMapContainer'
	});
	$entry.find('.brEntryDrop').click(() => {
		socket.sendCommand({
			type: "quiz",
			command: "drop entry",
			data: {
				id: entry.id
			}
		});
	});
    $entry.find('.brDisplayANNID').click(() => {
        let annURL = "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=" + entry.id;
        window.open(annURL);
    });
	this.entries.push({
		$entry: $entry,
		id: entry.id
	});
	this.$list.prepend($entry);
	this.updateCounter();
	this.$list.perfectScrollbar('update');
};

// LOOT COPY
const lootCopyButton = document.createElement("div");
lootCopyButton.innerHTML = "<p id='lootcopyButton' style='text-align:center; font-weight: bold; color: turquoise; cursor:pointer; border: 2px dashed white; padding: 5px 0; margin-top: 7px; background-color:rgba(255, 255, 255, 0.5);'>Copy All</p>";
document.querySelector("#brCollectedList").appendChild(lootCopyButton);
lootCopyButton.addEventListener ("click", function() {
	let lootedNoteList = document.querySelectorAll(".brLootedAnimeName");
	let brLootedAnimeStr = "Total looted: " + lootedNoteList.length + "\n";
	lootedNoteList.forEach(brLoot => {
    	brLootedAnimeStr += "\n" + brLoot.innerText.trim();
    });
    navigator.clipboard.writeText(brLootedAnimeStr);
});