import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName("./elements/scatter-plot"),
    PLATFORM.moduleName("./elements/graph-plot"),
    PLATFORM.moduleName("./elements/bar-chart"),
    PLATFORM.moduleName("./elements/small-bar"),
    PLATFORM.moduleName("./elements/small-bars"),
    PLATFORM.moduleName("./elements/small-bars-obs"),
    PLATFORM.moduleName("./elements/small-histogram"),
    PLATFORM.moduleName("./elements/small-histogram-obs"),
    PLATFORM.moduleName("./converters/number-format"),
    PLATFORM.moduleName("./converters/custom-sort"),
    PLATFORM.moduleName("./converters/custom-sort-length"),
    PLATFORM.moduleName("./converters/custom-filter-sort-length"),
    PLATFORM.moduleName("./converters/filter"),
    PLATFORM.moduleName("./converters/filter-property"),
  ]);
}
