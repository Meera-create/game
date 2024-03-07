
const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 16;
const PLAYER_HEALING = 7;

const mode_attack = 'ATTACK'
const mode_strong_attack = 'STRONG_ATTACK'
//constants created to reduce spelling errors

const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEALED = 'PLAYER_HEALED';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';



let battleLog = [];
let lastLogged;

function getMaxLifeValues() {
    const enteredUserValue = prompt('Enter maximum life for you and the monster. Value must be above 0.', '100');
    const parsedValue = parseInt(enteredUserValue);

    if (isNaN(parsedValue) || parsedValue <=0) {
        throw { message: " invalid user input" };
    }
    return parsedValue;
    
}

let chosenMaxLife; 

try {
    chosenMaxLife = getMaxLifeValues();
} catch (error) {
    console.log(error)
    alert('you entered an incorrect value, default 100 has been used')
    chosenMaxLife = 100;
}




let monsterHealth = chosenMaxLife;
let playerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event,value, monsterHealth, playerHealth) {
    let logEntry = {
        event: event,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
    };


    if (event === LOG_EVENT_PLAYER_ATTACK) {
        logEntry.target = 'MONSTER';

    } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
        logEntry.target='MONSTER'
        
        
    } else if (event === LOG_EVENT_MONSTER_ATTACK) {
        logEntry.target="PLAYER"
        
       
    } else if (event === LOG_EVENT_PLAYER_HEALED) {
        logEntry.target = "PLAYER"
        
        
    } else if (event===LOG_EVENT_GAME_OVER){
        logEntry.gameStatus= "GAME_OVER"
        
        }
        
    
    battleLog.push(logEntry);
}

function reset() {
    monsterHealth = chosenMaxLife;
    playerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    const initialHealth = playerHealth;
     const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    playerHealth -= playerDamage
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        monsterHealth,
        playerDamage
    )

    if (playerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        playerHealth = initialHealth;
       
        setPlayerHealth(initialHealth);
         alert('the bonus life just saved you!')
    }

    if (monsterHealth <= 0 && playerHealth >0) {
        alert('you won!');
          writeToLog(
        LOG_EVENT_GAME_OVER,
        'PLAYER WON',
        monsterHealth,
        playerHealth
    )
       
    } else if (playerHealth <= 0 && monsterHealth >0) {
        alert('you died!');
         writeToLog(
        LOG_EVENT_GAME_OVER,
        'MONSTER WON',
        monsterHealth,
        playerHealth
    )
        
    } else if (playerHealth <=0 && monsterHealth<=0) {
        alert("it's a draw");
         writeToLog(
        LOG_EVENT_GAME_OVER,
        "IT'S A DRAW",
        monsterHealth,
        playerHealth
    )
        
    }

    if (monsterHealth <= 0 || playerHealth <= 0) {
        reset();
    }
}

function attack(mode) {
    const maxDamage = mode === mode_attack ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === mode_attack ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;


    // if (mode === mode_attack) {
    //     maxDamage = ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_ATTACK
    // } else if (mode === mode_strong_attack) {
    //     maxDamage = STRONG_ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK
    // }

    const damage = dealMonsterDamage(maxDamage);
    monsterHealth -= damage;
     writeToLog(
        logEvent,
        damage,
        monsterHealth,
        playerHealth
    )
    endRound(); 
}


function attackHandler() {
 attack(mode_attack)
}

function strongAttackHandler() {
 attack(mode_strong_attack)
}



function healHandler() {
    let healValue;
    if (playerHealth >= chosenMaxLife - PLAYER_HEALING && monsterHealth !== chosenMaxLife) {
        alert("You can't heal to more than your max health")
        healValue = chosenMaxLife - playerHealth;
        //HEAL VALUE IS 0, CANNOT HEAL ANY MORE
    } else {
        healValue = PLAYER_HEALING;
    }
    
   
    increasePlayerHealth(healValue)
    playerHealth += healValue;
     writeToLog(
        LOG_EVENT_PLAYER_HEALED,
        healValue,
        monsterHealth,
        playerHealth
    )
    endRound();
}

function printLogHandler() {
    // for (let i = 0; i < battleLog.length; i++){
    //     console.log(battleLog[i])
    // }

    //arrays only  looping

    // let j = 0;
    // while (j < 6) {
    //     console.log(j,'hello')
    //     j++
    // }


//this logs event by event with every click
    let i = 0;
    for (const logEntry of battleLog) {
        if (!lastLogged && lastLogged!== 0 || lastLogged < i) {
            console.log(i)
            
            for (const key in logEntry) {
            //key
            console.log(key)
            
            //value
            console.log(logEntry[key])

            console.log(`${key} =>>>>  ${logEntry[key]}`)
            }
            lastLogged = i;
            break;
        }
        i++
        
    }
    
}

attackBtn.addEventListener('click', attackHandler)
strongAttackBtn.addEventListener('click', strongAttackHandler)
healBtn.addEventListener('click', healHandler)
logBtn.addEventListener('click', printLogHandler);
