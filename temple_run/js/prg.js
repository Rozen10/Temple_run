import SpriteAnime from "./SpriteAnime.js"
import Character from "./Character.js"


let cnv = document.getElementById("myCanvas");
let ctx = cnv.getContext("2d");
let map_cnv = document.createElement('canvas');
map_cnv.width = cnv.width;
map_cnv.height = cnv.height;
let map_ctx = map_cnv.getContext("2d");
let tilemap;
let tilemap_loaded = 0;
let tileset;
let tileset_loaded = 0;
let tileset_elts = [];
let map_ori_x = 0;
let map_ori_y = 0;
let layer;
let misa_character = new Character(1);
/// https://codepo8.github.io/canvas-images-and-pixels/

function onload_tilemap () {
  if(this.status == 200) {
    tilemap = JSON.parse(this.responseText);
    tileset = new Image();
    tileset.src = window.location.pathname+"../tilemaps"+tilemap["tilesets"][0]["image"];
    tileset.onload = function() {
      let tileset_i = 1;
      let tileset_j = 1;
      let tileset_imageheight = tilemap["tilesets"][0]["imageheight"];
      let tileset_imagewidth = tilemap["tilesets"][0]["imagewidth"];
      let tileset_margin = tilemap["tilesets"][0]["margin"];
      let tileset_spacing = tilemap["tilesets"][0]["spacing"];
      let tileset_tileheight = tilemap["tilesets"][0]["tileheight"];
      let tileset_tilecount = tilemap["tilesets"][0]["tilecount"];
      let tilemap_height = tilemap["height"];
      let tilemap_width = tilemap["width"];
      let canvas = document.createElement('canvas');
      canvas.height = tileset_imageheight;
      canvas.width = tileset_imageheight;
      let context = canvas.getContext('2d');
	    context.drawImage(tileset, 0, 0, tileset.width, tileset.height);
      for(let ih = 1; ih < tileset_imageheight; ih += (tileset_tileheight)) {
        for(let iw = 1; iw < tileset_imagewidth; iw += (tileset_tileheight)) {
          let canvas2 = document.createElement('canvas');
          canvas2.height = tileset_tileheight;
          canvas2.width = tileset_tileheight;
          let context2 = canvas2.getContext('2d');
          let canvasImageData = context.getImageData(iw, ih, tileset_tileheight, tileset_tileheight);
          context2.putImageData(canvasImageData, 0,0);
          tileset_elts.push(canvas2);
        }
      }
      let canvasImageData = context.getImageData(0, 1+32*7+6*2, 64+2, 64+2);

      let layer0_data = tilemap["layers"][0]["data"];
      let layer0_height = tilemap["layers"][0]["height"];
      let layer0_width = tilemap["layers"][0]["width"];
      let layer0_data_i = 0;
      let layer0_ix = map_ori_x;
      let layer0_iy = map_ori_y;
      for(let ih = 0; ih < layer0_height; ih += 1) {
        for(let iw = 0; iw < layer0_width; iw += 1) {
          if(layer0_data[layer0_data_i] > 0) {
            map_ctx.drawImage(tileset_elts[layer0_data[layer0_data_i]-1], layer0_ix +iw*tileset_tileheight , layer0_iy+ih*tileset_tileheight);
          }
          layer0_data_i += 1;
        }
      }

      // modification layer
      let layer1_data = tilemap["layers"][1]["data"];
      let layer1_height = tilemap["layers"][1]["height"];
      let layer1_width = tilemap["layers"][1]["width"];
      let layer1_data_i = 0;
      let layer1_ix = map_ori_x;
      let layer1_iy = map_ori_y;
      for(let ih = 0; ih < layer1_height; ih += 1) {
        for(let iw = 0; iw < layer1_width; iw += 1) {
          if(layer1_data[layer1_data_i] > 0) {
            map_ctx.drawImage(tileset_elts[layer1_data[layer1_data_i]-1], layer1_ix +iw*tileset_tileheight, layer1_iy+ih*tileset_tileheight);
          }
          layer1_data_i += 1;
        }
      }

      let layer2_data = tilemap["layers"][2]["data"];
      let layer2_height = tilemap["layers"][2]["height"];
      let layer2_width = tilemap["layers"][2]["width"];
      let layer2_data_i = 0;
      let layer2_ix = map_ori_x;
      let layer2_iy = map_ori_y;
      for(let ih = 0; ih < layer2_height; ih += 1) {
        for(let iw = 0; iw < layer2_width; iw += 1) {
          if(layer2_data[layer2_data_i] > 0) {
            map_ctx.drawImage(tileset_elts[layer2_data[layer2_data_i]-1], layer2_ix +iw*tileset_tileheight, layer2_iy+ih*tileset_tileheight);
          }
          layer2_data_i += 1;
        }
      }

    }
  }
}

function onload_atlas () {
  if(this.status == 200) {
    let json_infos = JSON.parse(this.responseText);
    let spritesheet = new Image();
    spritesheet.src = "./assets/atlas/"+json_infos["meta"]["image"];
    spritesheet.onload = function() {
      let canvas1 = document.createElement('canvas');
      canvas1.width = json_infos["meta"]["size"]["w"];
      canvas1.height = json_infos["meta"]["size"]["h"];
      let context1 = canvas1.getContext('2d');
      context1.drawImage(spritesheet, 0,0,canvas1.width,canvas1.height);
      misa_character.animes.push(new SpriteAnime(context1, json_infos, "misa-right-walk",0,3,3,"ArrowRight",5,0));
      misa_character.animes.push(new SpriteAnime(context1, json_infos, "misa-left-walk",0,3,3,"ArrowLeft",-5,0));
      misa_character.animes.push(new SpriteAnime(context1, json_infos, "misa-back-walk",0,3,3,"ArrowUp",0,-5));
      misa_character.animes.push(new SpriteAnime(context1, json_infos, "misa-front-walk",0,3,3,"ArrowDown",0,5));
    }
  }
}

window.addEventListener('keydown', keydown_fun, false);
function keydown_fun(e) {
  switch(e.code) {
    case "ArrowDown":
    case "ArrowUp":
    case "ArrowLeft":
    case "ArrowRight":
      misa_character.next_step(0, 0, 291, 280, e.code);
      break;
  }
}

let xobj_map = new XMLHttpRequest();
xobj_map.onload = onload_tilemap;
xobj_map.overrideMimeType("application/json");
xobj_map.open("GET","./tilemaps/templeRun.json", true);
xobj_map.send();

//let xobj_misa = new XMLHttpRequest();
//xobj_misa.onload = onload_atlas;
//xobj_misa.overrideMimeType("application/json");
//xobj_misa.open("GET", "./assets/atlas/misa.json", true);
//xobj_misa.send();

// lire https://doc.mapeditor.org/en/stable/reference/tmx-map-format/

function draw() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  let canvasImageData = map_ctx.getImageData(0, 0, cnv.width, cnv.height);
  ctx.putImageData(canvasImageData, 0,0);
  ctx.drawImage(misa_character.getImage(), map_ori_x+misa_character.posx, map_ori_y+misa_character.posy);
}

function update(timestamp) {
  draw();
  requestAnimationFrame(update);
}
requestAnimationFrame(update);
