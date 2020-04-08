function particles(){
    /* create particles animation
        based on the amazing tutorial by 'Franks Labratory'
        https://youtu.be/d620nV6bp0A
    */

    // check parameters and use defaults as necessary
    checkParams();

    // read css colour variables from root element, set defaults as necessary
    let particleColour;
    let strokeColour;
    let strokeHoverColour;
    checkColours();

    // get canvas element, set context and size
    const canvas = document.getElementById('particles');
    const canvasContext = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;
    speed = speed / 100;    // index speed to base 100 = 1

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
            this.x += this.directionX * speed;
            this.y += this.directionY * speed;

            // draw particle
            this.draw();
        }
    }

    // create particle array
    function init(){
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles * numParticles; i++){
            let size = (Math.random() * sizeMultiplier) + 1;
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
                if (distance < (canvas.width / 10) * (canvas.height / 10)){
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

    function checkParams(){
        if (typeof numParticles == 'undefined'){
            numParticles = 1;
        }
        else if (Number.isInteger(particles)){
            numParticles;
        }
        else{
            numParticles = 1;
            console.log("'particles' must be an integer value. Using default of '1'");
        };

        if (typeof sizeMultiplier == 'undefined'){
            sizeMultiplier = 3;
        }
        else if (Number.isFinite(sizeMultiplier)){
            sizeMultiplier;
        }
        else{
            sizeMultiplier = 3;
            console.log("'sizeMultiplier' must be a finite number. Using default of '3'");
        };

        if (typeof speed == 'undefined'){
            speed = 50;
        }
        if (Number.isInteger(speed) && (1 <= speed && speed <= 1000)){
            speed;
        }
        else{
            speed = 50;
            console.log("'speed' must be an integer between 1-1000. Using default of '50'");
        };

        if (typeof avoidMouse == 'undefined'){
            avoidMouse = true;
        }
        else if (typeof avoidMouse === 'boolean'){
            avoidMouse;
        }
        else{
            avoidMouse = true;
            console.log("'avoidMouse' must be either 'true' or 'false'. Using default of 'true'");
        }

        if (typeof hover == 'undefined'){
            hover = true;
        }
        else if (typeof hover === 'boolean'){
            hover;
        }
        else{
            hover = true;
            console.log("'hover' must be either 'true' or 'false'. Using default of 'true'");
        }
    }

    function checkColours(){
        if (getComputedStyle(document.documentElement).getPropertyValue('--col-particle').length === 0){
            particleColour = '#000000';
            console.log("CSS variable '--col-particle' is not set. Using 'black' (#000000).");
        }
        else{
            particleColour = getComputedStyle(document.documentElement).getPropertyValue('--col-particle');
        }

        if (getComputedStyle(document.documentElement).getPropertyValue('--col-particle-stroke').length === 0){
            strokeColour = '#000000';
            console.log("CSS variable '--col-particle-stroke' is not set. Using 'black' (#000000).");
        }
        else{
            strokeColour = getComputedStyle(document.documentElement).getPropertyValue('--col-particle-stroke');
        }

        if (hover === true && getComputedStyle(document.documentElement).getPropertyValue('--col-particle-stroke-hover').length === 0){
            strokeHoverColour = '#ff0000';
            console.log("CSS variable '--col-particle-stroke-hover' is not set. Using 'red' (#ff0000).");
        }
        else{
            strokeHoverColour = getComputedStyle(document.documentElement).getPropertyValue('--col-particle-stroke-hover');
        }
    }
}