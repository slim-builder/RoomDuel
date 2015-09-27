function MagicItem(type, category) {
    switch (type)
    {
        case 1:
            this.type = "Negate Attack";
            break;
        case 2:
            this.type = "Minor Heal";
            break;
        case 3:
            this.type = "Absorb Energy";
            break;
        default:
            this.type = "Invalid Item";
    }
    
    this.category = category;
    
    this.getType = function() {
        return this.type;
    }
    
    this.setType = function(type) {
        this.type = type;
    }
    
    this.getCategory = function() {
        return this.category;
    }
}

function Wizard(type) {
    this.type = type;
    this.hp = 20;
    this.pocket = new Array();
    this.selectedItem = new MagicItem(0, "Consumable");
    
    this.getHp = function() {
        return this.hp;
    };

    this.setHp = function(hp) {
        this.hp = hp;
    };
    
    this.pickUpItem = function() {
        this.pocket.push(new MagicItem(Math.floor(3*Math.random()+1), "Consumable"));
    };
    
    this.selectItem = function(index) {
        this.pocket.splice(index, 0, new MagicItem(0, "Consumable"));
        var tempArray = this.pocket.splice(index+1,1);
        this.selectedItem = tempArray[0];
    };
    
    this.getSelectedItem = function() {
        return this.selectedItem;
    }
    
    this.getInitialPocketItems = function() {
        var itemTypeArray = new Array();
        for (var i = 0; i < this.pocket.length; i++)
        {
            itemTypeArray.push(this.pocket[i].getType());
        }
        return itemTypeArray;
    };
    
    this.emptyPocket = function() {
        while (this.pocket.length > 0)
            this.pocket.pop();
    };
    
    this.reset = function() {
        this.hp = 20;
        this.emptyPocket();
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
            wizard.setHp(wizard.getHp() + 5);
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
    var newDamage;
    if (this.type === "Player")
        whichStatusInfo = "p_status_info";
    else if (this.type === "Opponent")
        whichStatusInfo = "o_status_info";
    if (this.selectedItem.getType() != "Invalid Item")
    {
        document.getElementById(whichStatusInfo).innerHTML += this.type + " uses an item!";
        newDamage = this.selectedItem.activate(this, damage);
        if (this.selectedItem.getType() === "Negate Attack")
            document.getElementById(whichStatusInfo).innerHTML += " The item is " + this.selectedItem.getType() + "! " + this.type + " takes no damage! ";
        else if (this.selectedItem.getType() === "Minor Heal")
            document.getElementById(whichStatusInfo).innerHTML += " The item is " + this.selectedItem.getType() + "! " + this.type + " gains 5 HP! ";
        else if (this.selectedItem.getType() === "Absorb Energy")
            document.getElementById(whichStatusInfo).innerHTML += " The item is " + this.selectedItem.getType() + "! ";
        this.selectedItem.setType("Invalid Item");
        return newDamage;
    }
    else
    {
        //document.getElementById(whichStatusInfo).innerHTML += this.type + " has no items to use! ";
        return damage;
    }
};

var player = new Wizard("Player");
var opponent = new Wizard("Opponent");

player.pickUpItem();
player.pickUpItem();
player.pickUpItem();
player.pickUpItem();

opponent.pickUpItem();
opponent.pickUpItem();
opponent.pickUpItem();
opponent.pickUpItem();

var itemTypesArray = player.getInitialPocketItems();
document.getElementById("item1").innerHTML = itemTypesArray[0];
document.getElementById("item2").innerHTML = itemTypesArray[1];
document.getElementById("item3").innerHTML = itemTypesArray[2];
document.getElementById("item4").innerHTML = itemTypesArray[3];
document.getElementById("item1").style.borderColor = "black";
document.getElementById("item2").style.borderColor = "black";
document.getElementById("item3").style.borderColor = "black";
document.getElementById("item4").style.borderColor = "black";

document.getElementById("player_hp").innerHTML = player.getHp();
document.getElementById("opponent_hp").innerHTML = opponent.getHp();

var gameOver = false;
var alreadyClicked = false;
var opponentItemSelection = 0;
var playerItemSelectionIndex = 4;

function isGameOver(damage, attacker, defender) {
    var gameOverFlag = false;
    if (defender.getHp() - damage <= 0 && attacker.getHp() <= 0)
    {
        document.getElementById("game_over_info").innerHTML += "It's a tie!";
        attacker.setHp(0);
        defender.setHp(0);
        gameOverFlag = true;
    }
    else if (defender.getHp() - damage <= 0)
    {
        document.getElementById("game_over_info").innerHTML += attacker.type + " Wins! " + defender.type + " Faints!";
        defender.setHp(0);
        gameOverFlag = true;
    }
    else if (attacker.getHp() <= 0)
    {
        document.getElementById("game_over_info").innerHTML += defender.type + " Wins! " + attacker.type + " Faints!";
        attacker.setHp(0);
        gameOverFlag = true;
    }
    else
    {
        defender.setHp(defender.getHp()-damage);
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
    document.getElementById("player_hp").innerHTML = player.getHp();
    document.getElementById("opponent_hp").innerHTML = opponent.getHp();
    gameOver = false;
    document.getElementById("game_over_info").innerHTML = "";
    document.getElementById("p_status_info").innerHTML = "";
    document.getElementById("o_status_info").innerHTML = "";
    alreadyClicked = false;
    document.getElementById("item1").style.background = "gray";
    document.getElementById("item2").style.background = "gray";
    document.getElementById("item3").style.background = "gray";
    document.getElementById("item4").style.background = "gray";
    document.getElementById("item1").style.borderColor = "black";
    document.getElementById("item2").style.borderColor = "black";
    document.getElementById("item3").style.borderColor = "black";
    document.getElementById("item4").style.borderColor = "black";
    var itemTypesArray = player.getInitialPocketItems();
    document.getElementById("item1").innerHTML = itemTypesArray[0];
    document.getElementById("item2").innerHTML = itemTypesArray[1];
    document.getElementById("item3").innerHTML = itemTypesArray[2];
    document.getElementById("item4").innerHTML = itemTypesArray[3];
    player.selectedItem.setType("Invalid Item");
    opponentItemSelection = 0;
};

document.getElementById("item1").onclick=function() {
    if (alreadyClicked === false && gameOver === false && this.innerHTML != "")
    {
        if (this.style.borderColor === "black")
        {
            this.style.borderColor = "red";
            document.getElementById("item2").style.borderColor = "black";
            document.getElementById("item3").style.borderColor = "black";
            document.getElementById("item4").style.borderColor = "black";
            playerItemSelectionIndex = 0;
        }
        else if (this.style.borderColor === "red")
        {
            this.style.borderColor = "black";
            playerItemSelectionIndex = 4;
        }
    }
};

document.getElementById("item2").onclick=function() {
    if (alreadyClicked === false && gameOver === false && this.innerHTML != "")
    {
        if (this.style.borderColor === "black")
        {
            this.style.borderColor = "red";
            document.getElementById("item1").style.borderColor = "black";
            document.getElementById("item3").style.borderColor = "black";
            document.getElementById("item4").style.borderColor = "black";
            playerItemSelectionIndex = 1;
        }
        else if (this.style.borderColor === "red")
        {
            this.style.borderColor = "black";
            playerItemSelectionIndex = 4;
        }
    }
};

document.getElementById("item3").onclick=function() {
    if (alreadyClicked === false && gameOver === false && this.innerHTML != "")
    {
        if (this.style.borderColor === "black")
        {
            this.style.borderColor = "red";
            document.getElementById("item1").style.borderColor = "black";
            document.getElementById("item2").style.borderColor = "black";
            document.getElementById("item4").style.borderColor = "black";
            playerItemSelectionIndex = 2;
        }
        else if (this.style.borderColor === "red")
        {
            this.style.borderColor = "black";
            playerItemSelectionIndex = 4;
        }
    }
};

document.getElementById("item4").onclick=function() {
    if (alreadyClicked === false && gameOver === false && this.innerHTML != "")
    {
        if (this.style.borderColor === "black")
        {
            this.style.borderColor = "red";
            document.getElementById("item1").style.borderColor = "black";
            document.getElementById("item2").style.borderColor = "black";
            document.getElementById("item3").style.borderColor = "black";
            playerItemSelectionIndex = 3;
        }
        else if (this.style.borderColor === "red")
        {
            this.style.borderColor = "black";
            playerItemSelectionIndex = 4;
        }
    }
};

document.getElementById("turn").onclick=function() {
    var damage;
    if (!alreadyClicked)
    {
        alreadyClicked = true;
        if (gameOver === false)
        {
            document.getElementById("game_over_info").innerHTML = "";
            document.getElementById("p_status_info").innerHTML = "";
            document.getElementById("o_status_info").innerHTML = "";
            if (playerItemSelectionIndex != 4)
            {
                player.selectItem(playerItemSelectionIndex);
                switch (playerItemSelectionIndex)
                {
                    case 0:
                        document.getElementById("item1").innerHTML = "";
                        document.getElementById("item1").style.background = "yellow";
                        document.getElementById("item1").style.borderColor = "black";
                        break;
                    case 1:
                        document.getElementById("item2").innerHTML = "";
                        document.getElementById("item2").style.background = "yellow";
                        document.getElementById("item2").style.borderColor = "black";
                        break;
                    case 2:
                        document.getElementById("item3").innerHTML = "";
                        document.getElementById("item3").style.background = "yellow";
                        document.getElementById("item3").style.borderColor = "black";
                        break;
                    case 3:
                        document.getElementById("item4").innerHTML = "";
                        document.getElementById("item4").style.background = "yellow";
                        document.getElementById("item4").style.borderColor = "black";
                        break;
                }
                playerItemSelectionIndex = 4;
            }
            damage = player.attack(opponent);
            gameOver = isGameOver(damage, player, opponent);
            document.getElementById("player_hp").innerHTML = player.getHp();
            document.getElementById("opponent_hp").innerHTML = opponent.getHp();
        }
        if (gameOver === false)
        {
            document.getElementById("p_status_info").innerHTML = "Opponent Responds With...   ";
            if (opponentItemSelection < 4)// && Math.floor(2*Math.random()+1))
            {
                opponent.selectItem(opponentItemSelection);
                opponentItemSelection++;
            }
            setTimeout(function() {            
                damage = opponent.attack(player);
                gameOver = isGameOver(damage, opponent, player);
                document.getElementById("player_hp").innerHTML = player.getHp();
                document.getElementById("opponent_hp").innerHTML = opponent.getHp();
                alreadyClicked = false;
            }, 3500);
        }
    }
};