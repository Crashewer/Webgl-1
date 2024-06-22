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
`;

const fragmentShaderTxt =
`
    precision mediump float;

    varying vec3 fragColor;

    void main()
    {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`;

let colorIndex = 0;
const colors = 
[
    [0.8, 0.5, 0.2], // Red
    [0.2, 0.8, 0.5], // Green
    [0.5, 0.2, 0.8]  // Blue
];

let triangleVerts = 
[
    0.0, 0.433, ...colors[colorIndex], // Top
    -0.5, -0.433, ...colors[colorIndex], // Left
    0.5, -0.433, ...colors[colorIndex]  // Right
];

const Triangle = function () 
{
    const canvas = document.getElementById('main-canvas');
    const gl = canvas.getContext('webgl');
    
    if (!gl)
    {
        console.error('WebGL not supported, use another browser');
        return;
    }

    let canvasColor = [0.9, 0.8, 0.9];
    gl.clearColor(...canvasColor, 1.0); // R, G, B, A
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    checkShaderCompile(gl, vertexShader);
    checkShaderCompile(gl, fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    gl.validateProgram(program);

    checkLink(gl, program);

    gl.useProgram(program);

    const triangleVertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerts), gl.STATIC_DRAW);

    const posAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer
    (
        posAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(posAttribLocation);

    const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer
    (
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    const myButton = document.getElementById("action-button");
    myButton.addEventListener("click", () => changeColor(gl, program));
};

function checkShaderCompile(gl, shader)
{
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
}

function checkLink(gl, program)
{
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}

function changeColor(gl, program)
{
    colorIndex = (colorIndex + 1) % colors.length;
    const newColor = colors[colorIndex];

    triangleVerts =
    [
        0.0, 0.433, ...newColor, // Top
        -0.5, -0.433, ...newColor, // Left
        0.5, -0.433, ...newColor  // Right
    ];

    const triangleVertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerts), gl.STATIC_DRAW);

    const posAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer
    (
        posAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(posAttribLocation);

    const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer
    (
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
