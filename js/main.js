function Ball() {
    this.x = 50;
    this.y = 415;
    this.size = 20;
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
        ctx.restore();
    }
}

function Target() {
    this.x = Math.random() * 500 + 200;
    this.y = Math.random() * 300;
    this.size = 30;
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
    this.elements = [new Ball(), new Target()];

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
        this.angle -= 0.5;

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
        this.ctx.rotate(this.angle*Math.PI/180);
        this.ctx.drawImage(body, -20, -20, w, h);
        this.ctx.restore();
        
        r = 295 / 244;
        w = 40;
        h = w * r;
        this.ctx.drawImage(front, 40, 420, w, h);
    }

    this.draw = function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        var img1 = document.getElementById("foo");
        this.ctx.drawImage(img1, 0, 0, 900, 600);

        for (var i = 0; i < this.elements.length; ++i) {
            this.elements[i].draw(this.ctx);
        }

        this.drawCannon();
    }

    this.simulate = function() {
        this.draw();
        this.update();
    }

    this.update = function() {
        for (var i = 0; i < this.elements.length; ++i) {
            this.elements[i].update();
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

simulate();
