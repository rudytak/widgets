let inputArr = ["5/2", "2/3", "2.4x10^-1", "1", "7"];

function cardsWidgetCreator(inputArr) {
  for (let i = 0; i < 5; i++) {
    inputCards[i] = new Card(
      (i * width) / 7 + width / 4.5,
      height * 0.3,
      inputArr[i]
    );
    placeholders[i] = new Card((i * width) / 7 + width / 4.5, height * 0.6);
    placeholders[i].changeColor(100);
  }
  submitButton = new Button(width * 0.6, height - 40, "submit");
  submitButton.clr = color(200, 90);
  resetButton = new Button(width * 0.85, height - 40, "reset");
}

function canvasCreator(
  back, //Background: grid, none (true or false)
  x_start, //x axis starting position
  x_end, //x axis ending position
  x_inc, //x axis increment value
  x_show, //x axis display (true or false)
  x_name, //x axis name label
  y_start, //y axis starting position
  y_end, //y axis ending position
  y_inc, //y axis increment value
  y_show, //y axis display (true or false)
  y_name, //y axis name label
  quad, //quadrant (full, partial, line)
  snap //snapping value (none, integer, 1dp)
) {
  let cnv = new Canvas();
  cnv.background = back;
  cnv.xaxis.start = x_start;
  cnv.xaxis.end = x_end;
  cnv.xaxis.increment = x_inc;
  cnv.xaxis.show = x_show;
  cnv.xaxis.name = x_name;
  cnv.yaxis.start = y_start;
  cnv.yaxis.end = y_end;
  cnv.yaxis.increment = y_inc;
  cnv.yaxis.show = y_show;
  cnv.yaxis.name = y_name;
  cnv.quadrant = quad;
  cnv.snap = snap;
  return cnv;
}
