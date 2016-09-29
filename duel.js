var itemTypes = ["Negate Attack", "Minor Heal", "Absorb Energy"];

function MagicItem(type, category) {
    this.type = type;
    this.category = category;
}

function Wizard(type, hp, pocket, selectedItem) {
    this.type = type;
    this.hp = hp;
    this.pocket = pocket;
    this.selectedItem = selectedItem;
    
    this.session = function() {
        if (this.type === "Player")
            sessionStorage.player = JSON.stringify(this);
        else if (this.type === "Opponent")
            sessionStorage.opponent = JSON.stringify(this);
    };

    this.setHp = function(hp) {
        this.hp = hp;
        this.session();
    };
    
    this.pickUpItem = function() {
        var magicItem = new MagicItem(itemTypes[Math.floor(3*Math.random())], "Consumable");
        this.pocket.push(magicItem);
        this.session();
    };
    
    this.emptyPocket = function() {
        while (this.pocket.length > 0)
            this.pocket.pop();
        this.session();
    };
    
    this.reset = function() {
        this.hp = 20;
        this.emptyPocket();
        this.session();
    };

    this.attack = function(wizard) {
        var damage = Math.floor(6*Math.random()) + 1;
        if (this.type === "Player")
        {
            document.getElementById("o_status_info").innerHTML += "Player attacks with fireball! ";
            damage = wizard.useItem(damage);
            if (damage > 0)
                document.getElementById("o_status_info").innerHTML += "The attack causes the opponent to lose " + damage + " HP! ";
            else
                document.getElementById("o_status_info").innerHTML += "The attack causes the opponent to gain " + -damage + " HP! ";
        }
        else if (this.type === "Opponent")
        {
            document.getElementById("p_status_info").innerHTML += "Lightning attack! ";
            damage = wizard.useItem(damage);
            if (damage > 0)
                document.getElementById("p_status_info").innerHTML += "The attack causes the player to lose " + damage + " HP! ";
            else
                document.getElementById("p_status_info").innerHTML += "The attack causes the player to gain " + -damage + " HP! ";
        }
        this.session();
        return damage;
    };
}

MagicItem.prototype.activate = function(wizard, damage) {
    var actualDamage = damage;
    switch(this.type)
    {
        case "Negate Attack":
            actualDamage = 0;
            break;
        case "Minor Heal":
            wizard.setHp(wizard.hp + 5);
            break;
        case "Absorb Energy":
            actualDamage = -damage;
            break;
        default:
            actualDamage = damage;
    }
    return actualDamage;
};

Wizard.prototype.useItem = function(damage) {
    var whichStatusInfo;
    var newDamage = damage;
    if (this.type === "Player")
        whichStatusInfo = "p_status_info";
    else if (this.type === "Opponent")
        whichStatusInfo = "o_status_info";
    if (this.selectedItem)
    {
        document.getElementById(whichStatusInfo).innerHTML += this.type + " uses an item!";    
        newDamage = this.selectedItem.activate(this, damage);
        if (this.selectedItem.type === "Negate Attack")
            document.getElementById(whichStatusInfo).innerHTML += " The item is " + this.selectedItem.type + "! " + this.type + " takes no damage! ";
        else if (this.selectedItem.type === "Minor Heal")
            document.getElementById(whichStatusInfo).innerHTML += " The item is " + this.selectedItem.type + "! " + this.type + " gains 5 HP! ";
        else if (this.selectedItem.type === "Absorb Energy")
            document.getElementById(whichStatusInfo).innerHTML += " The item is " + this.selectedItem.type + "! ";
        var selectedIndex = this.pocket.indexOf(this.selectedItem);
        if (selectedIndex > -1)
            this.pocket.splice(selectedIndex, 1);
    }
    this.selectedItem = null;
    return newDamage;
};

if (typeof(sessionStorage.player) === "undefined")
{
    var play = new Wizard("Player", 20, new Array(), null);
    for (var i = 0; i < 4; i++)
        play.pickUpItem();
    sessionStorage.player = JSON.stringify(play);
}
if (typeof(sessionStorage.opponent) === "undefined")
{
    var oppo = new Wizard("Opponent", 20, new Array(), null);
    for (var i = 0; i < 4; i++)
        oppo.pickUpItem();
    sessionStorage.opponent = JSON.stringify(oppo);
}

var jsonPlayer = JSON.parse(sessionStorage.player);
var jsonPlayerPocket = new Array();
for (var i = 0; i < jsonPlayer.pocket.length; i++)
{
    switch (jsonPlayer.pocket[i].type)
    {
      case "Negate Attack":
          jsonPlayerPocket.push(new MagicItem(itemTypes[0], "Consumable"));
          break;
      case "Minor Heal":
          jsonPlayerPocket.push(new MagicItem(itemTypes[1], "Consumable"));
          break;
      case "Absorb Energy":
          jsonPlayerPocket.push(new MagicItem(itemTypes[2], "Consumable"));
          break;
    }
}
if (jsonPlayer.selectedItem)
{
    switch (jsonPlayer.selectedItem.type)
    {
      case "Negate Attack":
          jsonPlayer.selectedItem = new MagicItem(itemTypes[0], "Consumable");
          break;
      case "Minor Heal":
          jsonPlayer.selectedItem = new MagicItem(itemTypes[1], "Consumable");
          break;
      case "Absorb Energy":
          jsonPlayer.selectedItem = new MagicItem(itemTypes[2], "Consumable");
          break;
    }
}
var jsonOpponent = JSON.parse(sessionStorage.opponent);
var jsonOpponentPocket = new Array();
for (var k = 0; k < jsonOpponent.pocket.length; k++)
{
    switch (jsonOpponent.pocket[k].type)
    {
      case "Negate Attack":
          jsonOpponentPocket.push(new MagicItem(itemTypes[0], "Consumable"));
          break;
      case "Minor Heal":
          jsonOpponentPocket.push(new MagicItem(itemTypes[1], "Consumable"));
          break;
      case "Absorb Energy":
          jsonOpponentPocket.push(new MagicItem(itemTypes[2], "Consumable"));
          break;
    }
}
if (jsonOpponent.selectedItem)
{
    switch (jsonOpponent.selectedItem.type)
    {
      case "Negate Attack":
          jsonOpponent.selectedItem = new MagicItem(itemTypes[0], "Consumable");
          break;
      case "Minor Heal":
          jsonOpponent.selectedItem = new MagicItem(itemTypes[1], "Consumable");
          break;
      case "Absorb Energy":
          jsonOpponent.selectedItem = new MagicItem(itemTypes[2], "Consumable");
          break;
    }
}
else
{
    jsonOpponent.selectedItem = jsonOpponentPocket[0];
}

var player = new Wizard(jsonPlayer.type, jsonPlayer.hp, jsonPlayerPocket,
                        jsonPlayer.selectedItem);
var opponent = new Wizard(jsonOpponent.type, jsonOpponent.hp,
                          jsonOpponentPocket, jsonOpponent.selectedItem);

function displayPocket() {
    var pocketDiv = document.getElementById("pocket");
    while (pocketDiv.firstChild)
        pocketDiv.removeChild(pocketDiv.firstChild);
    var pocketLabel = document.createElement("label");
    pocketLabel.textContent = "Available Items for Use:";
    pocketDiv.appendChild(pocketLabel);
    pocketDiv.appendChild(document.createElement("br"));
    for (var j = 0; j < player.pocket.length; j++)
    {
        var itemLabel = document.createElement("label");
        itemLabel.className = "item_label";
        itemLabel.id = "item" + (j + 1);
        itemLabel.textContent = "Use " + player.pocket[j].type;
        var itemRadioButton = document.createElement("input");
        itemRadioButton.type = "radio";
        itemRadioButton.name = "item";
        itemRadioButton.value = j;
        itemRadioButton.for = itemLabel.id;
        pocketDiv.appendChild(itemRadioButton);
        pocketDiv.appendChild(itemLabel);
        pocketDiv.appendChild(document.createElement("br"));
    }
    var noItemRadioButton = document.createElement("input");
    noItemRadioButton.type = "radio";
    noItemRadioButton.name = "item";
    noItemRadioButton.checked = true;
    noItemRadioButton.value = "No Item";
    pocketDiv.appendChild(noItemRadioButton);
    var noItemOptionLabel = document.createElement("label");
    noItemOptionLabel.className = "item_label";
    noItemOptionLabel.textContent = "Will not use an item";
    pocketDiv.appendChild(noItemOptionLabel);
    pocketDiv.appendChild(document.createElement("br"));
}

displayPocket();
document.getElementById("player_hp").innerHTML = player.hp;
document.getElementById("opponent_hp").innerHTML = opponent.hp;

var gameOver = false;
var alreadyClicked = false;

function isGameOver(damage, attacker, defender) {
    var gameOverFlag = false;
    if (defender.hp - damage <= 0 && attacker.hp <= 0)
    {
        document.getElementById("game_over_info").innerHTML += "It's a tie!";
        attacker.setHp(0);
        defender.setHp(0);
        gameOverFlag = true;
    }
    else if (defender.hp - damage <= 0)
    {
        document.getElementById("game_over_info").innerHTML += attacker.type + " Wins! " + defender.type + " Faints!";
        defender.setHp(0);
        gameOverFlag = true;
    }
    else if (attacker.hp <= 0)
    {
        document.getElementById("game_over_info").innerHTML += defender.type + " Wins! " + attacker.type + " Faints!";
        attacker.setHp(0);
        gameOverFlag = true;
    }
    else
    {
        defender.setHp(defender.hp-damage);
        gameOverFlag = false;
    }
    return gameOverFlag;
}

document.getElementById("reset").onclick=function() {
    player.reset();
    opponent.reset();
    player.pickUpItem();
    player.pickUpItem();
    player.pickUpItem();
    player.pickUpItem();
    opponent.pickUpItem();
    opponent.pickUpItem();
    opponent.pickUpItem();
    opponent.pickUpItem();
    document.getElementById("player_hp").innerHTML = player.hp;
    document.getElementById("opponent_hp").innerHTML = opponent.hp;
    gameOver = false;
    document.getElementById("game_over_info").innerHTML = "";
    document.getElementById("p_status_info").innerHTML = "";
    document.getElementById("o_status_info").innerHTML = "";
    alreadyClicked = false;
    displayPocket();
    player.selectedItem = null;
    opponent.selectedItem = opponent.pocket[0];
};

document.getElementById("turn").onclick=function() {
    var itemsInPocket = document.getElementsByName("item");
    for (var i = 0; i < itemsInPocket.length - 1; i++)
    {
        if (itemsInPocket[i].checked)
        {
            player.selectedItem = player.pocket[itemsInPocket[i].value];
            break;
        }
    }
    var damage;
    if (!alreadyClicked)
    {
        alreadyClicked = true;
        if (gameOver === false)
        {
            document.getElementById("game_over_info").innerHTML = "";
            document.getElementById("p_status_info").innerHTML = "";
            document.getElementById("o_status_info").innerHTML = "";
            damage = player.attack(opponent);
            gameOver = isGameOver(damage, player, opponent);
            document.getElementById("player_hp").innerHTML = player.hp;
            document.getElementById("opponent_hp").innerHTML = opponent.hp;
        }
        if (gameOver === false)
        {
            document.getElementById("p_status_info").innerHTML = "Opponent Responds With...   ";
            opponent.selectedItem = opponent.pocket[0];
            setTimeout(function() {            
                damage = opponent.attack(player);
                gameOver = isGameOver(damage, opponent, player);
                document.getElementById("player_hp").innerHTML = player.hp;
                document.getElementById("opponent_hp").innerHTML = opponent.hp;
                alreadyClicked = false;
                displayPocket();
            }, 3500);
        }
    }
};
