
const vertexShaderTxt = 
`
    precision mediump float;

    attribute vec2 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    void main()
    {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`
const fragmentShaderTxt = 
`
    precision mediump float;

    varying vec3 fragColor;

    void main()
    {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`

const Hexagon = function ()
{
    console.error('HexagonBegin');
    
    const canvas = document.getElementById('main-canvas');
    const gl = canvas.getContext('webgl');

    let canvasColor = [0.9, 0.9, 0.5]
    checkGl(gl);

    gl.clearColor(...canvasColor, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    checkShaderCompile(gl, vertexShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);

    gl.validateProgram(program);

    checkLink(gl, program);

    let hexagonVerts =
    [
     // X, Y                R   G    B
        0.0, 0.0,           1.0, 1.0, 1.0, // Mid - Center
     
        -0.25, 0.433,       1.4, 0.0, 0.0, // Top - Left
        0.25, 0.433,        1.0, 1.0, 0.0, // Top - Right
        
        0.5, 0.0,           0.0, 1.4, 0.0, // Mid - Right 
        
        0.25, -0.433,       0.0, 1.0, 1.0,  // Bottom - Right
        -0.25, -0.433,      0.0, 0.0, 1.4,  // Bottom - Left
    
        -0.5, 0.0,          1.0, 0.0, 1.0,  // Mid - Left

        -0.25, 0.433,       1.4, 0.0, 0.0   // Closing (Top - Left)
    ];

    const hexagonVertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, hexagonVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hexagonVerts), gl.STATIC_DRAW);
    
    const posAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        posAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(posAttribLocation);

    const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT,
    );
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 8);
} 


function checkGl(gl)
{
    if (!gl)
    {
        console.log('WebGL not suppoerted, use another browser');
    }
}

function checkShaderCompile(gl, shader)
{
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.error('shader not compiled', gl.getShaderInfoLog(shader));
    }
}

function checkLink(gl, program)
{
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
        console.error('linking error', gl.getProgramInfoLog(program));
    }
}