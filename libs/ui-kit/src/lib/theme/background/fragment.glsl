uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

vec3 palette(float t) {
    vec3 a = vec3(.5, .5, .5);
    vec3 b = vec3(0.5, .5, .5);
    vec3 c = vec3(1., 1., 1.);
    vec3 d = vec3(.263, .416, .557);
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2. - uResolution.xy) / min(uResolution.y, uResolution.x);
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);

    for (float i = 0.; i < 3.; i++) {
        uv = fract(uv * 1.5) - .5;
        float d = length(uv);

        vec3 col = palette(length(uv0) + uTime * .4);

        d = sin(d * 8. + uTime) / 8.;
        d = abs(d);
        d = .02 / d;

        finalColor += col * d;
    }

    gl_FragColor = vec4(finalColor, 1.);
}