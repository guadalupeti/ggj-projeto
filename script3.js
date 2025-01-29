const character = document.getElementById('character') //selecionando o elemento character
const enemyContainer = document.getElementById('enemies')
let maxLife = 10
let life = 10
let progress = document.querySelector("#barra-progresso div");
let lifeBar = document.getElementById('barra')
let progressValue = 0
let progressText = document.getElementById('progress-text')
let lifeText = document.getElementById('valor')
let progressMaxLvl1 = 40
let isPaused = false
const proxfase = document.querySelector('.proxfase')
let enemySpawnInterval


//aqui estão as constantes de sons do jogo:
const somBolha = [
    new Audio('sounds/bolha1.mp3'),
    new Audio('sounds/bolha2.mp3')];
const somDano= new Audio('sounds/tiro.mp3');
//aqui estão as funções de som do jogo:
function playBolha(){
    const random = Math.floor(Math.random()*somBolha.length).play();
    const som = somBolha[random];
    somBolha.volume=1.0;
    som.currentTime=0;
    som.play();}
function playDano(){
    somDano.currentTime=0;
    somDano.volume=0.2;
    somDano.play();}




function increaseProgress() {
    if (progress.value < progress.max) {
        progress.value += 10 
    }
}

document.addEventListener('mousemove', (event)=>{
    if (!isPaused) {
        const x = event.clientX - character.offsetWidth / 2 //set x
        const y = event.clientY - character.offsetHeight / 2 //set y
        character.style.transform = `translate(${x +3}px, ${y}px)` //transformando o estilo do personagem para corresponder à posição
    }
}) // código da movimentação

document.addEventListener('DOMContentLoaded', (event)=>{
    updateHUD()
    enemySpawn()
    changeBarra(progress, progressValue, progressMaxLvl1)

}) // toda vez que a página é carregada, ele atualiza a HUD para os valores iniciais

document.addEventListener('click', (event) => {
    let enemyRemoved = false;
    let tookDamage = false; // Flag para verificar se o dano foi aplicado

    if (!isPaused) {
        for (let i = 0; i < enemies.children.length; i++) {
            if (collision(character, enemies.children[i])) {
                enemies.children[i].remove();
                enemyRemoved = true;

                if (progressValue < progressMaxLvl1) {
                    progressValue += 1;
                }
                changeBarra(progress, progressValue, progressMaxLvl1);
            } else {
                tookDamage = true; // Marca que o dano pode ser aplicado
            }
        }

        // Só aplica o dano se não houve colisão com nenhum inimigo
        if (tookDamage && !enemyRemoved) {
            life -= 1;
            changeBarra(lifeBar, life, 10);
        }

        if (enemyRemoved) {
            playBolha();
            increaseProgress();
        }
    }
});

function updateHUD() {
    console.log('')
} // função de atualização de HUD

function endGame() {
    pass
} // função que será rodada quando o personagem chegar a vida 0

function enemySpawn() {
    if (!isPaused) {
        enemySpawnInterval = setInterval(() => {
            const enemy = document.createElement('div');


            const enemyType = Math.random() < 0.5 ? 'etype1' : 'etype2'
            enemy.classList.add(enemyType);


            const speed = enemyType === 'etype1' ? Math.random() * 2 : Math.random() * 5

            let enemy_x = Math.random() * window.innerWidth
            let enemy_y = Math.random() * window.innerHeight

            const angle = Math.random() * 360

            enemyContainer.appendChild(enemy)

            function moveEnemy() {
                if (isPaused) return;

                enemy_x += Math.cos(angle * (Math.PI / 180)) * speed
                enemy_y += Math.sin(angle * (Math.PI / 180)) * speed

                if (enemy_x < 0 || enemy_x > window.innerWidth || enemy_y < 0 || enemy_y > window.innerHeight) {
                    enemy.remove()
                    return;
                }

                enemy.style.left = `${enemy_x}px`
                enemy.style.top = `${enemy_y}px`
                requestAnimationFrame(moveEnemy)
            }

            moveEnemy();
        }, 200);
    } else {
        clearInterval(enemySpawnInterval);
    }
}

function collision(character, enemy) {
    const charRect = character.getBoundingClientRect()
    const enemyRect = enemy.getBoundingClientRect()

    return (
        charRect.left < enemyRect.right && charRect.right > enemyRect.left && charRect.top < enemyRect.bottom && charRect.bottom > enemyRect.top)
    
}

const innerCharacter = document.getElementById('inner-circle')

function checkCollsion(character, enemies) {
    if (!isPaused) {
        for (let i = 0; i < enemies.children.length; i++) {
            if (collision(character, enemies.children[i])) {
                life -= 1
                playDano();
                enemies.children[i].remove()
                changeBarra(lifeBar, life, 10)
                updateHUD()
            }
        }
    }
}

setInterval(() => {
    checkCollsion(innerCharacter, enemyContainer)
    changeBarra(lifeBar, life, 10)
    progressText.textContent = `${progressValue*100/progressMaxLvl1}%`
    lifeText.textContent = `🤍${life*100/maxLife}%`
    if (life < 0) {
        life = 0
        window.location.href = '/ggj-projeto/gameover.html'
    }

    if (progressValue >= progressMaxLvl1) {
        proxfase.style.visibility = 'visible'
        proxfase.style.opacity = 1
    } else {
        // Caso contrário, mantém o botão escondido
        proxfase.style.visibility = 'hidden';
        proxfase.style.opacity = 0;
    }

}, 100)

function changeBarra(barraModelo, valor, maximo) {
    if (valor * 100/maximo <= 100) {
        barraModelo.style.width = `${valor * 100/maximo}%`
    }

}

document.addEventListener('keydown', (event) => {
    if (event.key == 'Escape') {
        isPaused = !isPaused
    }

    if (!isPaused) {
        enemySpawn()
    } else {
        clearInterval(enemySpawnInterval)

    }

})

