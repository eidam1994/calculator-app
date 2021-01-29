
var div_canvas;
var w;
var h;
var volume;

var renderer;

function initRender() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(w, h);
    //告诉渲染器需要阴影效果
    renderer.setClearColor(0xffffff);
    div_canvas.appendChild(renderer.domElement);
}

var camera;

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 40, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

var scene;

function initScene() {
    scene = new THREE.Scene();
}

var light;

function initLight() {
    scene.add(new THREE.AmbientLight(0x444444));

    light = new THREE.PointLight(0xffffff);
    light.position.set(0, 50, 50);

    //告诉平行光需要开启阴影投射
    light.castShadow = true;

    scene.add(light);
}

function initModel(url) {

    //辅助工具
    var helper = new THREE.AxesHelper(50);
    scene.add(helper);

    var loader = new THREE.STLLoader();
    loader.load(url, function (geometry) {
        if (geometry instanceof THREE.BufferGeometry) {
            geometry = new THREE.Geometry().fromBufferGeometry(geometry);
        }

        //尺寸
        geometry.computeBoundingBox();

        function vFun(p1, p2, p3) {
            //借助threejs的Vector3的叉乘、点乘方法进行计算
            return p1.clone().cross(p2).dot(p3) / 6; //p1叉乘p2点乘p3除以6
        }

        // 声明一个变量表示几何体的体积
        var V = 0.0;
// 几何体三角形索引
        for (var i = 0; i < geometry.faces.length; i++) {
            // 几何体三角形索引
            var index0 = geometry.faces[i].a;
            var index1 = geometry.faces[i].b;
            var index2 = geometry.faces[i].c;
            // 通过索引访问三角形顶点坐标值
            var p0 = geometry.vertices[index0];
            var p1 = geometry.vertices[index1];
            var p2 = geometry.vertices[index2];
            //使用下面的函数，并不会改变p0, p1, p2引用指向的geo顶点坐标值
            //三角形与坐标原点构成的四面体体积累计计算
            V += vFun(p0, p1, p2);

        }
        volume = (V / 1000.0).toFixed(2);
        $(div_canvas).attr("volume", volume)
        $('.volume').find("input").val(Math.abs(volume))
        $('.volume').find("input")[0].dispatchEvent(new Event('input'));

        //创建纹理
        var mat = new THREE.MeshLambertMaterial({color: 0x00ffff});
        var mesh = new THREE.Mesh(geometry, mat);
        //console.log(mesh);

        mesh.rotation.x = -0.5 * Math.PI; //将模型摆正
        mesh.scale.set(0.5, 0.5, 0.5); //缩放
        geometry.center(); //居中显示
        scene.add(mesh);

        var boundingBox = geometry.boundingBox;
    });
}

//用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
var controls;

function initControls() {

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // 如果使用animate方法时，将此函数删除
    //controls.addEventListener( 'change', render );
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    controls.enableDamping = true;
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    //controls.dampingFactor = 0.25;
    //是否可以缩放
    controls.enableZoom = true;
    //是否自动旋转
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    //设置相机距离原点的最远距离
    controls.minDistance = 1;
    //设置相机距离原点的最远距离
    controls.maxDistance = 200;
    //是否开启右键拖拽
    controls.enablePan = true;
}

function render() {

    renderer.render(scene, camera);
}

//窗口变动触发的函数
function onWindowResize() {

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    render();
    renderer.setSize(w, h);

}

function animate() {
    //更新控制器
    render();

    controls.update();

    requestAnimationFrame(animate);
}

function draw(url, div, width, height) {
    div_canvas = div
    w = width
    h = height
    initRender();
    initScene();
    initCamera();
    initLight();
    initModel(url);
    initControls();
    animate();
    window.onresize = onWindowResize;
    return volume;
}
