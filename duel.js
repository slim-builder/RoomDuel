function MagicItem(type) {
    this.type = type;
    
    this.getType = function() {
        return this.type;
    }
    
    this.use = function(damage) {
        var actualDamage;
        switch(this.type)
        {
            case 1:
                actualDamage = 0;
                break;
            case 2:
                actualDamage = -5;
                break;
            default:
                actualDamage = damage;
        }
        return actualDamage;
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
    
    this.useItem = function(damage) {
        var itemObj = this.pocket.pop();
        if (typeof itemObj != "undefined")
        {
            document.getElementById("game_status_info").innerHTML += this.type + " uses an item!";
            if (itemObj.getType() === 1)
                document.getElementById("game_status_info").innerHTML += " The item is Negate Attack! " + this.type + " takes no damage! ";
            else
                document.getElementById("game_status_info").innerHTML += " The item is Minor Heal! " + this.type + " gains 5 HP! ";
            return itemObj.use(damage);
        }
        else
        {
            document.getElementById("game_status_info").innerHTML += this.type + " has no items to use! ";
            return damage;
        }
    };
    
    this.emptyPocket = function() {
        while (this.pocket.length > 0)
            this.pocket.pop();
    };
    
    this.reset = function() {
        this.hp = 20;
        this.emptyPocket();
    };
}

var player = new Wizard("Player");
var opponent = new Wizard("Opponent");

player.pickUpItem();
opponent.pickUpItem();

document.getElementById("player_hp").innerHTML = player.getHp();
document.getElementById("opponent_hp").innerHTML = opponent.getHp();

var damageToPlayer;
var damageToOpponent;
var gameOver = false;

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
};

document.getElementById("turn").onclick = function() {
    var afterItemDamage;
    if (gameOver === false)
    {
        document.getElementById("game_status_info").innerHTML = "";
        document.getElementById("p_status_info").innerHTML = "";
        document.getElementById("o_status_info").innerHTML = "";
        damageToPlayer = Math.floor(6*Math.random()) + 1;
        damageToOpponent = Math.floor(6*Math.random()) + 1;
        if (!Math.floor(5*Math.random()))
        {
            damageToPlayer = -damageToPlayer;
            document.getElementById("p_status_info").innerHTML = "Absorb electrical power! Player gains " + -damageToPlayer + " HP!";
        }
        else
        {
            afterItemDamage = player.useItem(damageToPlayer);
            if (afterItemDamage === damageToPlayer)
                document.getElementById("p_status_info").innerHTML = "Lightning strikes! Player loses " + damageToPlayer + " HP!";
            else
                damageToPlayer = afterItemDamage;
        }
        if (!Math.floor(5*Math.random()))
        {
            damageToOpponent = -damageToOpponent;
            document.getElementById("o_status_info").innerHTML = "Absorb heat energy! Opponent gains " + -damageToOpponent + " HP!";
        }
        else
        {
            afterItemDamage = opponent.useItem(damageToOpponent);
            if (afterItemDamage === damageToOpponent)
                document.getElementById("o_status_info").innerHTML = "Fireball explodes! Opponent loses " + damageToOpponent + " HP!";
            else
                damageToOpponent = afterItemDamage;
        }
        
        if (player.getHp() - damageToPlayer <= 0 && opponent.getHp() - damageToOpponent <= 0)
        {
            document.getElementById("game_status_info").innerHTML = "It's a tie!";
            player.setHp(0);
            opponent.setHp(0);
            gameOver = true;
        }
        else if (player.getHp() - damageToPlayer <= 0)
        {
            document.getElementById("game_status_info").innerHTML = "Opponent Wins! Player Faints!";
            player.setHp(0);
            opponent.setHp(opponent.getHp()-damageToOpponent);
            gameOver = true;
        }
        else if (opponent.getHp() - damageToOpponent <= 0)
        {
            document.getElementById("game_status_info").innerHTML = "Player Wins! Opponent Faints!";
            player.setHp(player.getHp()-damageToPlayer);
            opponent.setHp(0);
            gameOver = true;
        }
        else
        {
            player.setHp(player.getHp()-damageToPlayer);
            opponent.setHp(opponent.getHp()-damageToOpponent);
        }
        document.getElementById("player_hp").innerHTML = player.getHp();
        document.getElementById("opponent_hp").innerHTML = opponent.getHp();
    }
};