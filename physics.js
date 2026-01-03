// ----- 1️⃣  Create engine / world ------------------------------------
const engine = Matter.Engine.create();
const world = engine.world;
world.gravity.y = 0.5;  // forcer la gravité vers le bas
// 🧪 Vérifiez la gravité
// console.log('Gravity:', world.gravity);  // devrait être {x: 0, y: 1, scale: 0.001}

// 🧪 Vérifiez que le moteur tourne
// setInterval(() => {
//     console.log('Bodies positions:', bodies[0]?.position.y);
// }, 1000);
// ----- 2️⃣  Render on our canvas ---------------------------------------
const render = Matter.Render.create({
    canvas: document.getElementById('bg-canvas'),
    engine,
    options: {
        wireframes: false,
        background: 'transparent',   // keep it transparent
        width: 0,                     // will be set later
        height: 0
    }
});

// ----- 3️⃣  Resize canvas + Update floor ------------------------
let floor; // déclarez-le en dehors

function resize() {
    const rect = document.getElementById('physics-bg').getBoundingClientRect();
    render.canvas.width = rect.width;
    render.canvas.height = rect.height;
    render.options.width = rect.width;
    render.options.height = rect.height;

    if (floor) Matter.World.remove(world, floor);

    floor = Matter.Bodies.rectangle(
        rect.width / 2,
        rect.height + 50,
        rect.width * 2,
        100,
        { isStatic: true }
    );
    Matter.World.add(world, floor);

    // 🧪 DEBUG
    // console.log('Canvas height:', rect.height);
    // console.log('Floor position Y:', floor.position.y);
    // console.log('Floor bounds:', floor.bounds);
}

window.addEventListener('resize', resize);
resize();   // crée le floor à la bonne taille dès le début
Matter.World.add(world, floor);

// ----- 5️⃣  Add some bodies --------------------------------------------
const imgTextures = ["./Assets/car.png", "./Assets/phone.png", "./Assets/pinceau.png"];
const imgBodies = [];

for (let i = 0; i < 50; i++) {

    // Pick a random texture from the list
    const texIdx = Math.floor(Math.random() * imgTextures.length);
    const texture = imgTextures[texIdx];

    const body = Matter.Bodies.rectangle(
        Math.random() * render.canvas.width,
        Math.random() * render.canvas.height,
        70, 70,
        {
            restitution: 0.5,
            friction: 0.1,
            render: {
                sprite: {
                    texture: texture,
                    xScale: 0.13,
                    yScale: 0.13
                }
            }
        });
    imgBodies.push(body);
}
Matter.World.add(world, imgBodies);
// ----- 6️⃣  Optional – let users drag the bodies ----------------------
const mouse = Matter.Mouse.create(render.canvas);
const mConstraint = Matter.MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2, render: { visible: false } }
});
Matter.World.add(world, mConstraint);

// ----- 7️⃣  Run everything --------------------------------------------
const runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);
Matter.Render.run(render);
