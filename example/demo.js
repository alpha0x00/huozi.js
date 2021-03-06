import huozi from '../index';
import { beiying, mixed, lorem } from './text';

const canvas = document.getElementById('app');
const context = canvas.getContext('2d');

const devicePixelRatio = window.devicePixelRatio;

canvas.width = canvas.width * devicePixelRatio;
canvas.height = canvas.height * devicePixelRatio;

function drawText(text, options) {
  const textSequence = text.replace(/\r\n/g, '\n').trim().split('').map(value => {
    return {
      fontSize: +options.charFontSize || 18,
      character: value
    }
  });

  const layoutSequence = huozi(textSequence, {
    gridSize: +options.fontSize || 18,
    column: +options.column || 35,
    inlineCompression: options.compress === undefined ? options.compress : true,
    fixLeftQuote: (navigator.language === 'zh-TW') ? false : undefined
  });

  console.log(layoutSequence);

  context.clearRect(0, 0, 800 * devicePixelRatio, 600 * devicePixelRatio);
  context.strokeStyle = '#999';

  for (const char of layoutSequence) {
    context.font = `${char.fontSize * devicePixelRatio}px sans-serif`;
    context.textBaseline = 'hanging';
    context.fillText(char.character, char.x * devicePixelRatio, char.y * devicePixelRatio);

    options.stroke && context.strokeRect(char.x * devicePixelRatio, char.y * devicePixelRatio, char.width * devicePixelRatio, char.height * devicePixelRatio);
  }
}


/* for demo */

const handler = function (e) {
  const obj = {};
  $('#form').serializeArray().map(value => {
    obj[value.name] = value.value;
  });
  drawText(obj['text'], obj);
};

let id = 0;
$('#form').on('change input', function (e) {
  if (id) {
    clearTimeout(id);
  }
  id = setTimeout(handler, 300, e);
});

function fillTextArea(num) {
  if (num === 1) {
    textBox.textContent = beiying;
  } else if (num === 2) {
    textBox.textContent = lorem;
  } else {
    textBox.textContent = mixed;
  }
  handler();
}

window.fillTextArea = fillTextArea;

fillTextArea(1);