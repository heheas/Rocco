//import physics engine
import * as Matter from './matter.js';

let engine = Matter.Engine.create();
let world = engine.world;

let render = Matter.Render.create({
        element: document.body, // Or a specific element like document.getElementById('matter-canvas')
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false // Set to true for wireframe view
        }
    });
Matter.Render.run(render);

let runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);

 let ground = Matter.Bodies.rectangle(400, 590, 800, 20, { isStatic: true });
    let box = Matter.Bodies.rectangle(400, 200, 50, 50);
    Matter.World.add(world, [ground, box]);