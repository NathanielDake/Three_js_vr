(function() {
    'use strict';

    var camera, scene, renderer;
    var effect, controls;
    var element, container, videoTexture;
    var videoMesh;

    init();

    //initialization function:
    //This is setting up the scene. I add a scene, camera, and a renderer. The renderer renders the scene
    //with the camera
    function init() {
        console.log('init');

        //creating renderer. This is what actually helps output pixels to the view.
        renderer = new THREE.WebGLRenderer();
        element = renderer.domElement;
        container = document.getElementById('example');
        container.appendChild(element);

        //creating scene. The scene in this case is the space that everything created is placed into.
        scene = new THREE.Scene();

        //creating sphere that will be used to map video. The video in this case is an equirectangular
        //video. This type of projection is used in 360 degree video. By using Three Js it can be used
        //as a texture and mapped to the inside of a sphere. Here I generated the geometry, and then apply
        //a matrix, in this case inverting it so that the outside plane is on the inside
        var sphere = new THREE.SphereGeometry( 500, 64, 64 );
        sphere.applyMatrix(new THREE.Matrix4().makeScale( -1, 1, 1 ));


        //here I create a video texture. This allows the video to mapped to the sphere.
        var videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        var videoMaterial = new THREE.MeshBasicMaterial({
            map: videoTexture
        });

        //Now I create a mesh. A mesh is an object that takes a geometry, applies a material to it, which can then
        //be inserted into the scene and moved around
        videoMesh = new THREE.Mesh(sphere, videoMaterial);

        //effect = new THREE.StereoEffect(renderer);

        //creating camera. In order to see the scene there must be a camera placed in it.
        //Here I use a perspective camera in order to achieve a first person view.
        camera = new THREE.PerspectiveCamera(95, 1, 0.001, 700);

        //Setting camera position and adding to scene
        camera.position.set(100, 100, 100);
        scene.add(camera);

        //adds the created videoMesh (in this case a combination of sphere and video texture) to the scene
        scene.add(videoMesh);

        //Creating controls for mouse (utilizing OrbitControls). This enables a user to
        //click and drag in order to look around and explore the scene
        controls = new THREE.OrbitControls(camera, element);
        controls.rotateUp(Math.PI / 4);
        controls.target.set(
            camera.position.x + 0.1,
            camera.position.y,
            camera.position.z
        );
        controls.noZoom = true;
        controls.noPan = true;

        console.log('controls', controls);

        window.addEventListener('resize', resize, false);
        animate();
    }


    //resize function created in order to ensure that aspect ratio is maintained when changing window size
    function resize() {
        var width = container.offsetWidth;
        var height = container.offsetHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        renderer.setSize(width, height);
    }

    //this function calls resize and updates the controls
    function update() {
        resize();
        controls.update();
    }

    //Render outputs everything to the view.
    function render() {
        renderer.render(scene, camera);
    }

    //animate allows the panorama to stay responsive to movement. For every frame it calls the update
    //and render funtions, as well as its self as a requestAnimationFrame call back. This allows for
    //the camera to be perpetually updated
    function animate() {
        requestAnimationFrame(animate);
        update();
        render();
    }


}());
