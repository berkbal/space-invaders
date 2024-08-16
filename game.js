
kaboom({
    global:true,
    fullscreen:true,
    scale:1,
    debug: true,
    width: 1920,
    background: [ 0, 0, 0, ],
})


loadSprite("player", "assets/player.png");
loadSprite("mermi", "assets/mermi.png");
loadSprite("alien_1", "assets/alien_1.png");
loadSound("shoot", "sfx/shoot.mp3");
loadSound("hit", "sfx/hit.mp3");
loadSound("music", "sfx/music.mp3");



const music = play("music", {
    volume: 0.8,
    loop: true
});
function addText(textValue,position){
    const textLabel = add([
        text(textValue),
        pos(position)
    ]);
}
scene("menu", () =>{
    music.restart;
    const title = add([
        text("Space Invaders Clone"),
        pos(960,100),
        origin("center")
    ])



    addText("Use arrow keys for move", vec2(25,800));
    addText("Use space key for shoot", vec2(25, 875));

    function addButton(txt, p, f) {
        const btn = add([
            text(txt, 8),
            pos(p),
            area({ cursor: "pointer", }),
            scale(1),
            origin("center"),
        ]);
        btn.clicks(f);
        //btn.clicks(f);
        btn.hovers(() => {
            const t = time() * 10;
            btn.color = rgb(
                wave(0, 255, t),
                wave(0, 255, t + 2),
                wave(0, 255, t + 4),
            );
            btn.scale = vec2(1.2);
        }, () => {
            btn.scale = vec2(1);
            btn.color = rgb();
        });
    }
    
    addButton("Start Game", vec2(960, 300), () => go("game"));
    addButton("Quit", vec2(960, 400), () => debug.log("lets act like game is closed"));
 
    
    // reset cursor to default at frame start for easier cursor management
    action(() => cursor("default"));
    
        // toggle fullscreen
        keyPress("f", () => {
            fullscreen(!fullscreen());
            });
})

scene("game", () =>{
    let hareketHizi = 500;
    let mermiHizi = 800;
    let alienSpeed = 100;

    
    const score = add([
        text("Score: 0"),
        pos(24, 24),
        { value: 0 },
    ]);



function limits(){

    add([
    rect(1920, 2),  
    pos(0,0),
    area(),
    solid(),
    color(0,0,0),
    "top_wall"
    ]);

    add([
    rect(1920, 2),
    pos(0,930),
    area(),
    solid(),
    color(0,0,0),
    "bottom_wall"
    ]);

    add([
        rect(2,1080),
        pos(30,0),
        area(),
        solid(),
        color(0,0,0),
        "side_wall"
    ]);

    add([
        rect(2,1080),
        pos(1888,0),
        area(),
        solid(),
        color(0,0,0),
        "side_wall"
    ]);
}
    const player = add([
        sprite("player"),
        pos(950,850),
        area(),
        solid(),
        health(50),
        "player"
    ]);

    // Kontroller
    keyDown("left", () =>{
    player.move(-hareketHizi,0); // X-Y
    });

    keyDown("right", () =>{
        player.move(+hareketHizi,0);
    });

    keyPress("space", () =>{
        atesEt();
        play("shoot");
    });

    // toggle fullscreen
    keyPress("f", () => {
    fullscreen(!fullscreen());
    });

    function atesEt(){
        add([
        sprite("mermi"),
        scale(2),
        pos(player.pos.x+17.5, player.pos.y-70),
        area(),
        solid(),
        move(UP,mermiHizi),
        "mermi"
        ]);
    }

    function spawnAlien(){
        add([
        sprite("alien_1"),
        area(),
        pos(rand(0,1800),rand(100,300)),
        scale(2),
        solid(),
        move(DOWN,alienSpeed),
        "alien"
    ]);

        wait(rand(0.5, 1.5), ()=>{
            spawnAlien()
        });
    }

    spawnAlien();

    const healthText = add([
        text("Health: 50"),
        pos(24,98),
        { value: 50 },
    ]);

    // tagler uzerinden collision tespiti
    collides("alien", "mermi", (e,mermi) =>{ // Some shit happens here
        destroy(e);
        destroy(mermi);
        addKaboom(mermi.pos);
        play("hit");
        score.value += 1;
        score.text = "Score:" + score.value;
    })

    collides("mermi", "top_wall", (mermi,top_wall) =>{
        destroy(mermi);
    })

    collides("alien", "bottom_wall", (alien,bottom_wall) =>{
        destroy(alien);
        shake();
        player.hurt(1)
        healthText.value += -1;
        healthText.text = "Health:" + healthText.value;
    })

    collides("player", "alien", (p,a) =>{
        destroy(a);
        shake();
        player.hurt(1)
        healthText.value += -1;
        healthText.text = "Health:" + healthText.value;
    })

    limits();
    player.on("death", () => {
        music.stop();
        destroy(player);
        go("menu");
    });
});

go("menu")
