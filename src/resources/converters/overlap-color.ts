export class OverlapColorValueConverter {
  toView(overlap, property, coders) {
    let color = ""

    if (coders.some(e => e.name === property)) {
      if (overlap == 1) color = "rgba(0, 128, 0, 0.606)";
      else if (overlap == 0) color = "rgba(255, 99, 71, 0.401)";
      else color = "rgba(0, 128, 0, 0.406)"
      // else if (overlap == 4) return "rgba(0, 128, 0, 0.206)"
    }

    return color
  }
}
