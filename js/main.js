var SET_CANNON = 0;
var WAIT_INPUT = 1;
var FIRE = 2;
var CREATE_SCENARIO = 3;
var CHECK_RESULTS = 4;


function Ball() {
    this.x = 50;
    this.y = 415;
    this.size = 20;
    this.radius = 10;
    this.vx = 1;
    this.vy = -5;
    this.ax = 0;
    this.ay = 0.002722 * 10;
    this.angle = 0;

    this.update = function() {
        this.vx = this.vx + this.ax;
        this.vy = this.vy + this.ay;
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
        this.angle += 2;
    }

    this.draw = function(ctx) {
        var v = this.size / 2.0;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180.0);
        //ctx.drawImage(ball, this.x - v, this.y - v, this.size, this.size);
        ctx.drawImage(ball, 0, 0, this.size, this.size);

        ctx.beginPath();
        ctx.arc(10, 10, 15, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.restore();
    }
}

function Target() {
    this.x = Math.random() * 500 + 200;
    this.y = Math.random() * 300;
    this.size = 30;
    this.radius = 17;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;

    this.update = function() {
        this.vx = this.vx + this.ax;
        this.vy = this.vy + this.ay;
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
        this.angle += 2;
    }

    this.draw = function(ctx) {
        var img = document.getElementById('balloon');
        var w = 128.0;
        var h = 399;
        var r = h / w;
        w = 35;
        ctx.drawImage(img, this.x, this.y, w, w * r);

        ctx.beginPath();
        ctx.arc(this.x + 18, this.y + 22, 17, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

function Simulator(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
    this.width = 800;//window.innerWidth;
    this.height = 600;//window.innerHeight;
    this.cannonX = 0;
    this.cannonY = 0;
    this.angle = 0;
    this.cannonBodyImage = document.getElementById('cannonBody');
    this.cannonBaseFrontImage = document.getElementById('cannonBaseFront');
    this.cannonBaseBackImage = document.getElementById('cannonBaseBack');
    this.ballImage = document.getElementById('ball');
    this.state = CREATE_SCENARIO;
    this.ball = new Ball();
    this.target = new Target();

    this.fitWindow = function() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.setAttribute("width", window.innerWidth);
        this.canvas.setAttribute("height", window.innerHeight);
    }

    this.drawCannon = function() {
        this.cannonBodyImage = document.getElementById('cannonBody');
        this.cannonBaseFrontImage = document.getElementById('cannonBaseFront');
        this.cannonBaseBackImage = document.getElementById('cannonBaseBack');
        var body = this.cannonBodyImage;
        var front = this.cannonBaseFrontImage;
        var back = this.cannonBaseBackImage;
        var ball = this.ballImage;

        var w = 70;
        
        var r = 298 / 243;
        var w = 40;
        var h = w * r;
        this.ctx.drawImage(back, 50, 410, w, h);

        r = 298 / 477;
        w = 70;
        h = w * r;
        this.ctx.save();
        this.ctx.translate(60, 420); //40 400
        this.ctx.rotate(-this.angle*Math.PI/180);
        this.ctx.drawImage(body, -20, -20, w, h);
        this.ctx.restore();
        
        r = 295 / 244;
        w = 40;
        h = w * r;
        this.ctx.drawImage(front, 40, 420, w, h);
    }

    this.draw = function() {
        this.clearScenario();
        this.drawBackground();
        this.drawTarget();
        this.drawBall();
        this.drawCannon();
    }

    this.drawScenario = function() {
        this.clearScenario();
        this.drawBackground();
        this.drawTarget();
        this.drawCannon();
    }

    this.drawBall = function() {
        this.ball.draw(this.ctx);
    }

    this.clearScenario = function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    this.drawBackground = function() {
        var img1 = document.getElementById("foo");
        this.ctx.drawImage(img1, 0, 0, 900, 600);
    }

    this.drawTarget = function() {
        this.target.draw(this.ctx);
    }

    this.simulate = function() {
        switch (this.state) {
        case CREATE_SCENARIO:
            this.createScenario();
            break;

        case WAIT_INPUT:
            this.drawScenario();
            this.readInputs();
            break;

        case SET_CANNON:
            this.drawScenario();
            this.setCannon();
            break;

        case FIRE:
            this.draw();
            this.update();
            this.checkCollision();

            if (this.ball.x > 900) {
                this.state = CHECK_RESULTS;
            }

            break;

        case CHECK_RESULTS:
            this.draw();
            break;
        }
    }

    this.createScenario = function() {
        this.target = new Target();
        this.ball = new Ball();
        this.elements = [this.target];
        this.state = WAIT_INPUT;
    }

    this.readInputs = function() {
        this.ball.vx = lerCampo('vx');
        this.ball.vy = -lerCampo('vy');
    }

    this.setCannon = function() {
        var targetAngle = Math.atan(this.ball.vy / this.ball.vx);
        targetAngle = -(targetAngle * 180) / Math.PI;
        this.angle += 0.5;

        if (this.angle > targetAngle) {
            this.state = FIRE;
        }
    }

    this.update = function() {
        this.ball.update();
        this.target.update();
    }

    this.startSimulation = function() {
        this.state = SET_CANNON;
    }

    this.resetSimulation = function() {
        this.state = CREATE_SCENARIO;
    }

    this.checkCollision = function() {
        x = (this.ball.x + 10) - (this.target.x + 18);
        y = (this.ball.y + 10) - (this.target.y + 22);

        dist = Math.sqrt(x * x + y * y);

        if (dist < this.ball.radius + this.target.radius) {
            console.log('atingiu');
        } 
    }
}

function lerCampo(id) {
    return parseFloat(document.getElementById(id).value);
}

var sim = new Simulator('myCanvas');

function simulate() {
    sim.simulate();
    window.requestAnimationFrame(simulate);
}

function startSimulation() {
    sim.startSimulation();
}

simulate();
