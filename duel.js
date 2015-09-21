var playerHp = 20;
var opponentHp = 20;
document.getElementById("player_hp").innerHTML = playerHp;
document.getElementById("opponent_hp").innerHTML = opponentHp;

var damageToPlayer;
var damageToOpponent;
var gameOver = false;

document.getElementById("turn").onclick=function() {
    if (gameOver === false)
    {
        damageToPlayer = Math.floor(6*Math.random());
        damageToOpponent = Math.floor(6*Math.random());
        if (playerHp - damageToPlayer <= 0 && opponentHp - damageToOpponent <= 0)
        {
            document.getElementById("status_info").innerHTML = "It's a tie!";
            playerHp = 0;
            opponentHp = 0;
            gameOver = true;
        }
        else if (playerHp - damageToPlayer <= 0)
        {
            document.getElementById("status_info").innerHTML = "Opponent wins!";
            playerHp = 0;
            opponentHp -= damageToOpponent;
            gameOver = true;
        }
        else if (opponentHp - damageToOpponent <= 0)
        {
            document.getElementById("status_info").innerHTML = "Player wins!";
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