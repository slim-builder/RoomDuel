var playerHp = 20;
var opponentHp = 20;
document.getElementById("player_hp").innerHTML = playerHp;
document.getElementById("opponent_hp").innerHTML = opponentHp;

var damageToPlayer;
var damageToOpponent;
var gameOver = false;

document.getElementById("reset").onclick=function() {
    playerHp = 20;
    opponentHp = 20;
    document.getElementById("player_hp").innerHTML = playerHp;
    document.getElementById("opponent_hp").innerHTML = opponentHp;
    gameOver = false;
    document.getElementById("status_info").innerHTML = "";
    document.getElementById("p_status_info").innerHTML = "";
    document.getElementById("o_status_info").innerHTML = "";
};

document.getElementById("turn").onclick=function() {
    if (gameOver === false)
    {
        damageToPlayer = Math.floor(6*Math.random()) + 1;
        damageToOpponent = Math.floor(6*Math.random()) + 1;
        if (!Math.floor(5*Math.random()))
        {
            damageToPlayer = -damageToPlayer;
            document.getElementById("p_status_info").innerHTML = "Absorb electrical power! Player gains " + -damageToPlayer + " HP!";
        }
        else
            document.getElementById("p_status_info").innerHTML = "Lightning strikes! Player loses " + damageToPlayer + " HP!";
        if (!Math.floor(5*Math.random()))
        {
            damageToOpponent = - damageToOpponent;
            document.getElementById("o_status_info").innerHTML = "Absorb heat energy! Opponent gains " + -damageToOpponent + " HP!";
        }
        else
            document.getElementById("o_status_info").innerHTML = "Fireball explodes! Opponent loses " + damageToOpponent + " HP!";
        if (playerHp - damageToPlayer <= 0 && opponentHp - damageToOpponent <= 0)
        {
            document.getElementById("status_info").innerHTML = "It's a tie!";
            playerHp = 0;
            opponentHp = 0;
            gameOver = true;
        }
        else if (playerHp - damageToPlayer <= 0)
        {
            document.getElementById("status_info").innerHTML = "Opponent Wins! Player Faints!";
            playerHp = 0;
            opponentHp -= damageToOpponent;
            gameOver = true;
        }
        else if (opponentHp - damageToOpponent <= 0)
        {
            document.getElementById("status_info").innerHTML = "Player Wins! Opponent Faints!";
            playerHp -= damageToPlayer;
            opponentHp = 0;
            gameOver = true;
        }
        else
        {
            playerHp -= damageToPlayer;
            opponentHp -= damageToOpponent;
        }
        document.getElementById("player_hp").innerHTML = playerHp;
        document.getElementById("opponent_hp").innerHTML = opponentHp;
    }
};