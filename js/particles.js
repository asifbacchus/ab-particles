function particles(avoidMouse = true, hover = true) {
    /* create particles animation
        based on the amazing tutorial by 'Franks Labratory'
        https://youtu.be/d620nV6bp0A
    */

    const canvas = document.getElementById('particles');
    const canvasContext = canvas.getContext('2d');

    // read css colour variables from root element
    const particleColour = getComputedStyle(document.documentElement).getPropertyValue('--col-particle');
    const strokeColour = getComputedStyle(document.documentElement).getPropertyValue('--col-particle-stroke');
    const strokeHoverColour = getComputedStyle(document.documentElement).getPropertyValue('--col-particle-stroke-hover');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    // get mouse position
    let mousePosition ={
        x: undefined,
        y: undefined,
        radius: (canvas.height / 80) * (canvas.width / 80)
    };

    // add mouse position event listener
    window.addEventListener('mousemove', function(event){
        mousePosition.x = event.x;
        mousePosition.y = event.y;
    });

    // create particle class
    class Particle{
        constructor(x, y, directionX, directionY, size, colour) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.colour = colour;
        }
        // method to draw individual particles
        draw(){
            canvasContext.beginPath();
            canvasContext.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            canvasContext.fillStyle = particleColour;
            canvasContext.fill();
        }
        // check particle position, mouse position, move particle and draw it
        update(){
            // check if particle is still within canvas
            if (this.x > canvas.width || this.x < 0){
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0){
                this.directionY = -this.directionY;
            }

            // avoid the mouse if avoidMouse = true (default)
            if (avoidMouse){
                let dx = mousePosition.x - this.x;
                let dy = mousePosition.y - this.y;
                let distance = Math.sqrt((dx * dx) + (dy * dy));
                if (distance < mousePosition.radius + this.size){
                    if (mousePosition.x < this.x && this.x < canvas.width - this.size * 10){
                        this.x += 10;
                    }
                    if (mousePosition.x > this.x && this.x > this.size * 10){
                        this.x -= 10;
                    }
                    if (mousePosition.y < this.y && this.y < canvas.height - this.size * 10){
                        this.y += 10;
                    }
                    if (mousePosition.y > this.y && this.y > this.size * 10){
                        this.y -= 10;
                    }
                }
            }

            // move particle
            this.x += this.directionX;
            this.y += this.directionY;

            // draw particle
            this.draw();
        }
    }

    // create particle array
    function init(){
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles * 2; i++){
            let size = (Math.random() * 5) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 5) - 2.5;
            let directionY = (Math.random() * 5) - 2.5;
            let colour = '#8c5523';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, colour));
        }
    }

    // check if particles are close enough to connect to eachother
    function connect(){
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++){
            for (let b = a; b < particlesArray.length; b++){
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)){
                    opacityValue = 1 - (distance / 20000);
                    // change colour on 'hover' if hover = true (default)
                    if(hover){
                        let dx = mousePosition.x - particlesArray[a].x;
                        let dy = mousePosition.y - particlesArray[a].y;
                        let mouseDistance = Math.sqrt((dx * dx) + (dy * dy));
                        if (mouseDistance < 200) {
                            // change colour if mouse is close
                            canvasContext.globalAlpha = opacityValue;
                            canvasContext.strokeStyle = strokeHoverColour;
                        }
                        else {
                            // use regular stroke colour
                            canvasContext.globalAlpha = opacityValue;
                            canvasContext.strokeStyle = strokeColour;
                        }
                    }
                    else {
                        canvasContext.globalAlpha = opacityValue;
                        canvasContext.strokeStyle = strokeColour;
                    }
                    canvasContext.lineWidth = 1;
                    canvasContext.beginPath();
                    canvasContext.moveTo(particlesArray[a].x, particlesArray[a].y);
                    canvasContext.lineTo(particlesArray[b].x, particlesArray[b].y);
                    canvasContext.stroke();
                }
            }
        }
    }

    // animation loop
    function animate(){
        requestAnimationFrame(animate);
        canvasContext.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++){
            particlesArray[i].update();
        }
        connect();
    }

    // resize event
    window.addEventListener('resize', function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mousePosition.radius = ((canvas.height / 80) * (canvas.width / 80));
        init();
    });

    // mouse-out event (mouse leaving the window)
    window.addEventListener('mouseout', function(){
        mousePosition.x = undefined;
        mousePosition.y = undefined;
    });

    init();
    animate();
}