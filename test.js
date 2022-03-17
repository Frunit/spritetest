const parsedUrl = new URL(window.location.href);
// Dirty hacks ahead ;)
const round_pixels = !!parsedUrl.searchParams.get('round_pixels');
const scale_mode = +!!+parsedUrl.searchParams.get('scale_mode');

PIXI.settings.ROUND_PIXELS = round_pixels;
PIXI.settings.SCALE_MODE = scale_mode;

const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

const app = new PIXI.Application({
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 0xff0000,
});
document.body.appendChild(app.view);

const bg_single = PIXI.Texture.from('background_single.png');
PIXI.Loader.shared.add('sprites.json').load(setup);

function setup() {
    const sheet = PIXI.Loader.shared.resources['sprites.json'].spritesheet;
    const camera = new pixi_viewport.Viewport({
        screenWidth: screenWidth,
        screenHeight: screenHeight,
        divWheel: app.view,

        interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    app.stage.addChild(camera);

    camera.drag().pinch().wheel();

    const group_single = new PIXI.Container();
    const group_sheet_border = new PIXI.Container();
    const group_sheet_no_border = new PIXI.Container();
    const group_text = new PIXI.Container();

    const SIZE = 128;
    const NUM = 5;

    group_single.x = 0;
    group_single.y = 0;

    group_sheet_border.x = SIZE * (NUM + 1);
    group_sheet_border.y = 0;

    group_sheet_no_border.x = 0;
    group_sheet_no_border.y = SIZE * (NUM + 1);

    group_text.x = SIZE * (NUM + 1);
    group_text.y = SIZE * (NUM + 1);

    for(let i = 0; i < NUM*NUM; i++) {
        const x = (i % NUM) * SIZE;
        const y = Math.floor(i / NUM) * SIZE;

        const bg = new PIXI.Sprite(bg_single);
        bg.x = x;
        bg.y = y;
        group_single.addChild(bg);

        const bg_border = new PIXI.Sprite(sheet.textures['background_border']);
        bg_border.x = x;
        bg_border.y = y;
        group_sheet_border.addChild(bg_border);

        const bg_no_border = new PIXI.Sprite(sheet.textures['background_no_border']);
        bg_no_border.x = x;
        bg_no_border.y = y;
        group_sheet_no_border.addChild(bg_no_border);
    }

    group_single.addChild(new PIXI.Text('Single image'));
    group_sheet_border.addChild(new PIXI.Text('Spritesheet with one pixel around sprite'));
    group_sheet_no_border.addChild(new PIXI.Text('Spritesheet with transparency around sprite'));

    const scale_mode_names = ['LINEAR', 'NEAREST'];
    group_text.addChild(new PIXI.Text(`PIXI.settings.ROUND_PIXELS = ${round_pixels}`));
    const scale_text = new PIXI.Text(`PIXI.settings.SCALE_MODE = ${scale_mode_names[scale_mode]}`);
    scale_text.y = 30;
    group_text.addChild(scale_text);

    camera.addChild(group_single);
    camera.addChild(group_sheet_border);
    camera.addChild(group_sheet_no_border);
    camera.addChild(group_text);
}
