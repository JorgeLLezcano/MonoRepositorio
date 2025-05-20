const nave = document.getElementById('nave');
        const gameContainer = document.body;

        let naveX = 0;
        const velocidadNave = 5;
        const velocidadDisparoJugador = 10;
        const velocidadEnemigo = 2;
        const fluctuacionEnemigo = 20;
        const velocidadDisparoEnemigo = 7; // Velocidad del disparo enemigo

        const disparosActivos = []; // Disparos del jugador
        const enemigosActivos = [];
        const disparosEnemigosActivos = []; // NUEVO: Disparos de los enemigos

        const MAX_ENEMIGOS = 5;

        const keysPressed = {};
        let canShoot = true;
        const shootCooldown = 200;

        // --- Funciones de Creación ---

        function createShoter() {
            const shoter = document.createElement('div');
            shoter.classList.add('shoter');

            shoter.style.left = `${naveX + (nave.offsetWidth / 2) - (shoter.offsetWidth / 2)}px`;
            shoter.style.bottom = `${nave.offsetHeight}px`;

            gameContainer.appendChild(shoter);
            disparosActivos.push(shoter);
        }

        function createEnemy() {
            if (enemigosActivos.length >= MAX_ENEMIGOS) return;

            const enemy = document.createElement('div');
            enemy.classList.add('enemy');

            const startX = Math.random() * (window.innerWidth - enemy.offsetWidth);
            const startY = Math.random() * (window.innerHeight * 0.3);

            enemy.style.left = `${startX}px`;
            enemy.style.top = `${startY}px`;

            enemy.dataset.initialX = startX;
            enemy.dataset.initialY = startY;

            // NUEVO: Propiedad para controlar el tiempo del próximo disparo del enemigo
            enemy.dataset.nextShootTime = Date.now() + Math.random() * 3000 + 1000; // Disparo inicial entre 1 y 4 segundos

            gameContainer.appendChild(enemy);
            enemigosActivos.push(enemy);
        }

        // NUEVO: Función para que un enemigo dispare
        function createEnemyShot(enemyElement) {
            const enemyShot = document.createElement('div');
            enemyShot.classList.add('enemy-shot');

            // Posiciona el disparo enemigo saliendo de la parte inferior del enemigo
            const enemyRect = enemyElement.getBoundingClientRect();
            enemyShot.style.left = `${enemyRect.left + (enemyRect.width / 2) - (enemyShot.offsetWidth / 2)}px`;
            enemyShot.style.top = `${enemyRect.bottom}px`; // Sale de la parte inferior del enemigo

            gameContainer.appendChild(enemyShot);
            disparosEnemigosActivos.push(enemyShot);
        }

        function spawnEnemiesWave() {
            for (let i = 0; i < MAX_ENEMIGOS; i++) {
                createEnemy();
            }
        }

        // --- Bucle Principal del Juego ---
        function gameLoop() {
            // Movimiento de la nave y disparo del jugador
            if (keysPressed['ArrowLeft']) {
                naveX -= velocidadNave;
                if (naveX < 0) {
                    naveX = 0;
                }
            }
            if (keysPressed['ArrowRight']) {
                naveX += velocidadNave;
                const limiteDerecho = window.innerWidth - nave.offsetWidth;
                if (naveX > limiteDerecho) {
                    naveX = limiteDerecho;
                }
            }
            nave.style.left = `${naveX}px`;

            if (keysPressed[' '] && canShoot) {
                createShoter();
                canShoot = false;
                setTimeout(() => {
                    canShoot = true;
                }, shootCooldown);
            }

            // 1. Mover Disparos del Jugador y Detección de Colisiones (Disparo Jugador vs. Enemigo)
            for (let i = disparosActivos.length - 1; i >= 0; i--) {
                const shoter = disparosActivos[i];
                let currentBottom = parseInt(shoter.style.bottom);
                currentBottom += velocidadDisparoJugador;

                if (currentBottom > window.innerHeight) {
                    shoter.remove();
                    disparosActivos.splice(i, 1);
                } else {
                    shoter.style.bottom = `${currentBottom}px`;

                    for (let j = enemigosActivos.length - 1; j >= 0; j--) {
                        const enemy = enemigosActivos[j];

                        const shoterRect = shoter.getBoundingClientRect();
                        const enemyRect = enemy.getBoundingClientRect();

                        if (shoterRect.left < enemyRect.right &&
                            shoterRect.right > enemyRect.left &&
                            shoterRect.top < enemyRect.bottom &&
                            shoterRect.bottom > enemyRect.top) {

                            shoter.remove();
                            disparosActivos.splice(i, 1);
                            enemy.remove();
                            enemigosActivos.splice(j, 1);
                            break;
                        }
                    }
                }
            }

            // 2. Mover Enemigos y Lógica de Disparo Enemigo
            for (let i = enemigosActivos.length - 1; i >= 0; i--) {
                const enemy = enemigosActivos[i];
                const initialX = parseFloat(enemy.dataset.initialX);
                const initialY = parseFloat(enemy.dataset.initialY);

                const offsetX = Math.sin(Date.now() * 0.005 + i) * fluctuacionEnemigo;
                const offsetY = Math.cos(Date.now() * 0.005 + i + Math.PI/2) * (fluctuacionEnemigo / 2);

                enemy.style.left = `${initialX + offsetX}px`;
                enemy.style.top = `${initialY + offsetY}px`;

                // NUEVO: Lógica para que el enemigo dispare
                if (Date.now() > parseInt(enemy.dataset.nextShootTime)) {
                    createEnemyShot(enemy);
                    // Establece el próximo tiempo de disparo para este enemigo
                    enemy.dataset.nextShootTime = Date.now() + Math.random() * 3000 + 1000; // Entre 1 y 4 segundos
                }
            }

            // 3. Mover Disparos Enemigos y Detección de Colisiones (Disparo Enemigo vs. Nave)
            const naveRect = nave.getBoundingClientRect(); // Obtiene la posición de la nave una vez por frame
            for (let i = disparosEnemigosActivos.length - 1; i >= 0; i--) {
                const enemyShot = disparosEnemigosActivos[i];
                let currentTop = parseInt(enemyShot.style.top);
                currentTop += velocidadDisparoEnemigo; // Mueve hacia abajo

                if (currentTop > window.innerHeight) { // Sale de la pantalla por abajo
                    enemyShot.remove();
                    disparosEnemigosActivos.splice(i, 1);
                } else {
                    enemyShot.style.top = `${currentTop}px`;

                    // Detección de colisión con la nave
                    const enemyShotRect = enemyShot.getBoundingClientRect();

                    if (enemyShotRect.left < naveRect.right &&
                        enemyShotRect.right > naveRect.left &&
                        enemyShotRect.top < naveRect.bottom &&
                        enemyShotRect.bottom > naveRect.top) {

                        // Colisión detectada: eliminar disparo enemigo
                        enemyShot.remove();
                        disparosEnemigosActivos.splice(i, 1);

                        // TODO: Aquí puedes agregar lógica para "vida" de la nave,
                        // pantalla de Game Over, etc.
                        console.log("¡Nave impactada!");
                        // alert("¡Game Over!"); // O un mensaje en pantalla
                        // location.reload(); // Reiniciar el juego (simple)
                        break; // El disparo impactó, no necesita seguir verificando
                    }
                }
            }


            // 4. Verificar si se deben crear nuevos enemigos
            if (enemigosActivos.length === 0) {
                console.log("¡Todos los enemigos eliminados! Generando nueva oleada...");
                spawnEnemiesWave();
            }

            requestAnimationFrame(gameLoop);
        }

        // --- Event Listeners y Inicialización ---

        document.addEventListener('keydown', (e) => {
            keysPressed[e.key] = true;
        });

        document.addEventListener('keyup', (e) => {
            keysPressed[e.key] = false;
        });

        window.addEventListener('load', () => {
            naveX = (window.innerWidth / 2) - (nave.offsetWidth / 2);
            nave.style.left = `${naveX}px`;
            spawnEnemiesWave();
            gameLoop();
        });