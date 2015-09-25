function MagicItem(type) {
    this.type = type;
    
    this.getType = function() {
        return this.type;
    }
}

function Wizard(type) {
    this.type = type;
    this.hp = 20;
    this.pocket = new Array();
    
    this.getHp = function() {
        return this.hp;
    };

    this.setHp = function(hp) {
        this.hp = hp;
    };
    
    this.pickUpItem = function() {
        this.pocket.push(new MagicItem(Math.floor(2*Math.random()+1)));
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
        if (!Math.floor(5*Math.random()))
        {
            damage = -damage;
            if (this.type === "Player")
                document.getElementById("o_status_info").innerHTML += "Fireball attack! Opponent absorbs heat energy! Opponent gains " + -damage + " HP!";
            else if (this.type === "Opponent")
                document.getElementById("p_status_info").innerHTML += "Lightning attack! Player absorbs electrical power! Player gains " + -damage + " HP!";
        }
        else
        {
            damage = wizard.useItem(damage);
            if (this.type === "Player")
                document.getElementById("o_status_info").innerHTML += "Fireball attack! Opponent loses " + damage + " HP!";
            else if (this.type === "Opponent")
                document.getElementById("p_status_info").innerHTML += "Lightning attack! Player loses " + damage + " HP!";
        }
        return damage;
    };
}

MagicItem.prototype.activate = function(wizard, damage) {
    var actualDamage = damage;
    switch(this.type)
    {
        case 1:
            actualDamage = 0;
            break;
        case 2:
            if (wizard.getHp() > damage)
                wizard.setHp(wizard.getHp() + 5);
            break;
        default:
            actualDamage = damage;
    }
    return actualDamage;
};

Wizard.prototype.useItem = function(damage) {
    var itemObj = this.pocket.pop();
    if (typeof itemObj != "undefined")
    {
        document.getElementById("game_status_info").innerHTML += this.type + " uses an item!";
        if (itemObj.getType() === 1)
            document.getElementById("game_status_info").innerHTML += " The item is Negate Attack! " + this.type + " takes no damage! ";
        else
            document.getElementById("game_status_info").innerHTML += " The item is Minor Heal! " + this.type + " gains 5 HP! ";
        return itemObj.activate(this, damage);
    }
    else
    {
        document.getElementById("game_status_info").innerHTML += this.type + " has no items to use! ";
        return damage;
    }
};

var player = new Wizard("Player");
var opponent = new Wizard("Opponent");

player.pickUpItem();
opponent.pickUpItem();

document.getElementById("player_hp").innerHTML = player.getHp();
document.getElementById("opponent_hp").innerHTML = opponent.getHp();

var gameOver = false;
var alreadyClicked = false;

function isGameOver(damage, attacker, defender) {
    var gameOverFlag = false;
    if (defender.getHp() - damage <= 0 && attacker.getHp() <= 0)
    {
        document.getElementById("game_status_info").innerHTML += "It's a tie!";
        attacker.setHp(0);
        defender.setHp(0);
        gameOverFlag = true;
    }
    else if (defender.getHp() - damage <= 0)
    {
        document.getElementById("game_status_info").innerHTML += attacker.type + " Wins! " + defender.type + " Faints!";
        defender.setHp(0);
        gameOverFlag = true;
    }
    else if (attacker.getHp() <= 0)
    {
        document.getElementById("game_status_info").innerHTML += defender.type + " Wins! " + attacker.type + " Faints!";
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
    opponent.pickUpItem();
    document.getElementById("player_hp").innerHTML = player.getHp();
    document.getElementById("opponent_hp").innerHTML = opponent.getHp();
    gameOver = false;
    document.getElementById("game_status_info").innerHTML = "";
    document.getElementById("p_status_info").innerHTML = "";
    document.getElementById("o_status_info").innerHTML = "";
    alreadyClicked = false;
};

document.getElementById("turn").onclick=function() {
    var damage;
    if (!alreadyClicked)
    {
        alreadyClicked = true;
        if (gameOver === false)
        {
            document.getElementById("game_status_info").innerHTML = "";
            document.getElementById("p_status_info").innerHTML = "";
            document.getElementById("o_status_info").innerHTML = "";
            damage = player.attack(opponent);
            gameOver = isGameOver(damage, player, opponent);
            document.getElementById("player_hp").innerHTML = player.getHp();
            document.getElementById("opponent_hp").innerHTML = opponent.getHp();
        }
        if (gameOver === false)
        {
            document.getElementById("p_status_info").innerHTML = "Opponent Responds With...   ";
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