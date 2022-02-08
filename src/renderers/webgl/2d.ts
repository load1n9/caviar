import { initShaderProgram, programInfo2d, ProgramInfo2d } from "./shader.ts";
import { WebGL2RenderingContext, WebGLProgram } from "../../../deno_gl/mod.ts";
import { fragment2d, vertex2d } from "./shader.ts";
import { Entity, Rectangle } from "../../../mod.ts";
import { createBuffer, setBuffer } from "./util.ts";

export class WebGLRenderer2D {
    private program: WebGLProgram
    private gl: WebGL2RenderingContext
    private location: ProgramInfo2d

    constructor(gl: WebGL2RenderingContext,) {
        this.gl = gl
        this.program = initShaderProgram(gl, vertex2d, fragment2d)
        this.location = programInfo2d(gl, this.program)
    }

    public render(entities: Entity[]) {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.gl.useProgram(this.program);

        for (const entity of entities) {
            if (entity instanceof Rectangle) {
                this.renderRectangle(entity)
            }
        }

    }

    private renderRectangle(rect: Rectangle) {
        createBuffer(this.gl, [
            rect.left, rect.up,    // top left corner
            rect.right, rect.up,   // top right corner
            rect.left, rect.down,  // bottom left corner
            rect.right, rect.down, // bottom right corner
        ])
        setBuffer(this.gl, this.location.position, 2, this.gl.FLOAT)
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}