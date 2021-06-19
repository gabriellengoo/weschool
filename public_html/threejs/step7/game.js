class Game{
	constructor(){
		if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
		
		this.container;
		this.player = { };
		this.stats;
		this.controls;
		this.camera;
		this.scene;
		this.renderer;
		
		this.container = document.createElement( 'div' );
		this.container.style.height = '100%';
		document.body.appendChild( this.container );
        
		const game = this;
		
		this.assetsPath = '../assets/';
		
		this.clock = new THREE.Clock();
        
        this.init();

		window.onError = function(error){
			console.error(JSON.stringify(error));
		}
	}
	
	init() {

		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 10, 20000 );
		this.camera.position.set(5000, 4000, -5000);
        
		this.scene = new THREE.Scene();

        let ambient = new THREE.AmbientLight(0xa0a0a0);
        
		let light = new THREE.HemisphereLight( 0xdddddd, 0x444444 );
		light.position.set( 0, 200, 0 );
		this.scene.add( light );

		// model
		const loader = new THREE.FBXLoader();
		const game = this;
		
		this.loadEnvironment(loader);
		
		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.shadowMap.enabled = true;
		this.container.appendChild( this.renderer.domElement );
        
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 150, 0);
        this.controls.update();
			
		window.addEventListener( 'resize', function(){ game.onWindowResize(); }, false );
	}
	
    loadEnvironment(loader){
		const game = this;
		loader.load(`${this.assetsPath}fbx/town.fbx`, function(object){
			game.environment = object;
			game.colliders = [];
			game.scene.add(object);
            
			object.traverse( function ( child ) {
				if ( child.isMesh ) {
					if (child.name.startsWith("proxy")){
						game.colliders.push(child);
						child.material.visible = false;
					}else{
						child.castShadow = true;
						child.receiveShadow = true;
					}
				}
			} );
			
			const tloader = new THREE.CubeTextureLoader();
			tloader.setPath( `${game.assetsPath}/images/` );

			var textureCube = tloader.load( [
				'px.jpg', 'nx.jpg',
				'py.jpg', 'ny.jpg',
				'pz.jpg', 'nz.jpg'
			] );

			game.scene.background = textureCube;
			
			game.animate();
		})
	}
    
	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize( window.innerWidth, window.innerHeight );

	}

	animate() {
		const game = this;
		const dt = this.clock.getDelta();
		
		requestAnimationFrame( function(){ game.animate(); } );
		
		this.renderer.render( this.scene, this.camera );

	}
}

/* import this script as well as "loader.css" 
    and paste the loader html at the beginning of the body element */

function setupJokes() {
    var jokesByWill = ['compiling glitter',
'downloading sparkles',
'calibrating pink',
'reticulating splines',
'decorating',
'getting ready',
'coloring objects',
'making lists',
'making plans',
'planning',
'plotting',
'consulting',
'applying gloss',
'cutting diamonds',
'polishing nails',
'tying bows',
'selecting emojis'];
    var jokes = document.getElementById('jokes');
    var len = jokesByWill.length;
    var i = Math.floor(Math.random() * len);
    jokes.innerHTML = jokesByWill[i];
    jokesInterval = setInterval(function () {
        i = Math.floor(Math.random() * len);
        jokes.innerHTML = jokesByWill[i];
    }, 700);

}

function terminateLoader() {
    var loader = document.getElementById('loader');
    var progressBar = document.getElementById('progress-green');
    var loader = document.getElementById('loader');
    var progressBarWidth = progressBar.offsetWidth;
    var loadStep = progressBarWidth / 20;
    var completionAnim;
    var loadingBarProgress;

    // Create the event
    // the setup of the credits triggers the keyframes another time so we setup credits after completion
    var loadCompleteEvent = new CustomEvent("loadComplete", {
        "detail": "loading completed"
    });
    document.addEventListener('loadComplete', function () {
        setupCredits();
    });

    // get the actual width of the progress bar resulting from the scale 
    loadingBarProgress = Math.ceil(progressBar.getBoundingClientRect().right - progressBar.getBoundingClientRect().left);
    progressBar.classList.remove('load');

    // animate width 
    function finishProgressBarLoop() {
        progressBar.style.width = loadingBarProgress + 'px';
        if (loadingBarProgress > progressBarWidth) {
            loader.classList.add('done');
            window.clearInterval(jokesInterval);
            setTimeout(function () {
                loader.style.display = 'none';
                document.dispatchEvent(loadCompleteEvent);
            }, 500);
            return;
        }
        loadingBarProgress += loadStep; // could adjust value for screen size 
        requestAnimationFrame(finishProgressBarLoop);
    }
    completionAnim = requestAnimationFrame(finishProgressBarLoop);
}
window.terminateLoader = terminateLoader;

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    setupJokes();
});

// so that we don't ruin other projects onload function
// addLoadEvent(terminateLoader);