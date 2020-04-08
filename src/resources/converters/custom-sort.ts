export class CustomSortValueConverter {
  toView(array, config) {
    let factor = (config.direction || "ascending") === "ascending" ? 1 : -1;
    return array.sort((a, b) => {
      if (isNaN(a[config.propertyName]) || isNaN(b[config.propertyName])) {
        return a[config.propertyName].localeCompare(b[config.propertyName]) * factor;
      }
      else {
        return (a[config.propertyName] - b[config.propertyName]) * factor;
      }
    });
  }
}
