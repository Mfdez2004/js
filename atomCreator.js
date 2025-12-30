        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function drawAtom(e, p, n, canv) {
            const canvas = document.getElementById(canv);
            const ctx = canvas.getContext('2d');
            canvas.width = 600;//window.innerWidth;
            canvas.height = 600;//window.innerHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let particles = [];
            for(let i=0; i<p; i++) particles.push('proton');
            for(let i=0; i<n; i++) particles.push('neutron');
            particles = shuffle(particles);
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            //const p = parseInt(document.getElementById('p').value) || 0;
            //const n = parseInt(document.getElementById('n').value) || 0;
            

            // 1. DIBUJAR NÚCLEO (Empaquetamiento denso)
            //let particles = [];
            //for(let i=0; i<p; i++) particles.push('proton');
            //for(let i=0; i<n; i++) particles.push('neutron');
            //particles = shuffle(particles);
            const pr = 12; // Radio de la partícula nuclear
            const spacing = 0.9; // Factor de empaquetamiento (ajusta la densidad)
            
            particles.forEach((type, i) => {
                // Algoritmo de Vogel (Distribución Fermat)
                const angle = i * 137.5 * (Math.PI / 180);
                const r = Math.sqrt(i) * pr * spacing;
                
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                
                draw3DSphere(x, y, pr, type, ctx);
            });

            // 2. DIBUJAR ÓRBITAS Y ELECTRONES
            let electronsRemaining = e;
            const layers = [2, 8, 18, 32];
            
            layers.forEach((maxE, layerIndex) => {
                if (electronsRemaining <= 0) return;
                
                const orbitR = 100 + (layerIndex * 60);
                const eInLayer = Math.min(electronsRemaining, maxE);

                // Dibujar línea de órbita
                ctx.beginPath();
                ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(0, 255, 250, 0.1)';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Dibujar electrones animados
                for (let i = 0; i < eInLayer; i++) {
                    const time = Date.now() * 0.0015;
                    const angle = (i * 2 * Math.PI / eInLayer) + (time / (layerIndex + 1));
                    const ex = cx + orbitR * Math.cos(angle);
                    const ey = cy + orbitR * Math.sin(angle);
                    
                    draw3DSphere(ex, ey, 6, 'electron', ctx);
                }
                electronsRemaining -= eInLayer;
            });
        }
        function draw3DSphere(x, y, radius, type, context) {
            // Definición de colores: [Luz, Base, Sombra]
            const colors = {
                proton: ['#ff8888', '#ff0000', '#660000'],
                neutron: ['#ffffff', '#999999', '#333333'],
                electron: ['#88ffff', '#00ccff', '#003366']
            };
            const c = colors[type];

            // Gradiente para crear volumen 3D
            const grad = context.createRadialGradient(
                x - radius * 0.3, y - radius * 0.3, radius * 0.1, 
                x, y, radius
            );
            
            grad.addColorStop(0, c[0]); // Brillo especular
            grad.addColorStop(0.5, c[1]); // Color base
            grad.addColorStop(1, c[2]); // Sombra en los bordes

            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fillStyle = grad;
            
            // Sutil borde para separar esferas empaquetadas
            context.strokeStyle = 'rgba(0,0,0,0.3)';
            context.lineWidth = 1;
            
            context.fill();
            context.stroke();
            context.closePath();
        }
