import { observable } from 'aurelia-framework';

export class covid {
  // https://www.sozialministerium.at/Informationen-zum-Coronavirus/Coronavirus---Haeufig-gestellte-Fragen/Coronavirus---H%C3%A4ufig-gestellte-Fragen---Ma%C3%9Fnahmen-in-Oesterreich.html
  available_beds = 696
  people = 1910497

  person_factor = 100
  hospital_factor = 100
  death_factor = 100

  show_empty = true
  show_comparison = true

  death_rate = 2.6

  tests_per_week = 23000
  tests_month = this.tests_per_week * 4

  rangeValue = 10;
  percent = 0;

  @observable mode = "equal"
  @observable reduction = "10"

  sim = new Map();
  reductions;
  selectedRed;
  activeSim;
  baseSim;

  constructor() {
    let t10 = new Map();
    // t10.set('März', {
    //   infected: 28435,
    //   critical: 484,
    //   hospital: 1939,
    //   recovered: 537,
    // });
    t10.set('April', {
      infected: 95934,
      critical: 2173,
      hospital: 7453,
      recovered: 3727,
    });
    t10.set('Mai', {
      infected: 232218,
      critical: 4608,
      hospital: 17194,
      recovered: 8844
    });
    t10.set('Juni', {
      infected: 498970,
      critical: 9145,
      hospital: 37340,
      recovered: 19844
    });

    let t30 = new Map();
    // t30.set('März', {
    //   infected: 24328,
    //   critical: 451,
    //   hospital: 1533,
    //   recovered: 539,
    // });
    t30.set('April', {
      infected: 37637,
      critical: 718,
      hospital: 2866,
      recovered: 2158,
    });
    t30.set('Mai', {
      infected: 27864,
      critical: 385,
      hospital: 1930,
      recovered: 1560
    });
    t30.set('Juni', {
      infected: 13652,
      critical: 268,
      hospital: 1182,
      recovered: 820
    });

    let t20 = new Map();
    // t20.set('März', {
    //   infected: 27259,
    //   critical: 467,
    //   hospital: 1744,
    //   recovered: 548
    // });
    t20.set('April', {
      infected: 66502,
      critical: 1184,
      hospital: 4932,
      recovered: 3154,
    });
    t20.set('Mai', {
      infected: 78400,
      critical: 1431,
      hospital: 6201,
      recovered: 3835
    });
    t20.set('Juni', {
      infected: 85319,
      critical: 1500,
      hospital: 6505,
      recovered: 4326
    });

    let t40 = new Map();
    // t40.set('März', {
    //   infected: 23320,
    //   critical: 393,
    //   hospital: 1571,
    //   recovered: 557
    // });
    t40.set('April', {
      infected: 24307,
      critical: 405,
      hospital: 1986,
      recovered: 1757,
    });
    t40.set('Mai', {
      infected: 5800,
      critical: 71,
      hospital: 428,
      recovered: 472
    });
    t40.set('Juni', {
      infected: 938,
      critical: 27,
      hospital: 83,
      recovered: 85
    });

    this.sim.set("10", t10)
    this.sim.set("20", t20)
    this.sim.set("30", t30)
    this.sim.set("40", t40)

    this.activeSim = this.sim.get("10")
    this.baseSim = this.sim.get("10")
  }

  reductionToText(reduction) {
    if (reduction == "10") {
      return "Keine"
    }
    if (reduction == "20") {
      return "Leicht"
    }
    if (reduction == "30") {
      return "Mittel"
    }
    if (reduction == "40") {
      return "Stark"
    }
  }

  computeDeathRate(month, activeSim) {
    return Math.round(activeSim.get(month).infected * (this.death_rate / 100) / this.death_factor)
  }

  computeDeathRateNumber(month, activeSim) {
    return Math.round(activeSim.get(month).infected * (this.death_rate / 100))
  }

  computeBaseDeathRate(month, baseSim, activeSim) {
    let deaths = baseSim.get(month).infected - activeSim.get(month).infected

    return Math.round(deaths * (this.death_rate / 100) / this.death_factor)
  }

  computeBaseDeathRateNumber(month, baseSim, activeSim) {
    let deaths = baseSim.get(month).infected

    return Math.round(deaths * (this.death_rate / 100))
  }

  computeMissingBeds(month, activeSim) {
    return Math.round(Math.max(0, this.activeSim.get(month).critical + this.activeSim.get(month).hospital - this.available_beds) / this.hospital_factor)
  }

  computeMissingBedsNumber(month, activeSim) {
    return Math.max(0, this.activeSim.get(month).critical + this.activeSim.get(month).hospital - this.available_beds)
  }

  computeBaseMissingBeds(month, baseSim, activeSim) {
    let missing = Math.max(0, baseSim.get(month).critical + baseSim.get(month).hospital - this.available_beds) - Math.max(0, activeSim.get(month).critical + activeSim.get(month).hospital - this.available_beds)
    return Math.round(missing / this.hospital_factor)
  }

  computeBaseMissingBedsNumber(month, baseSim, activeSim) {
    let missing = Math.max(0, baseSim.get(month).critical + baseSim.get(month).hospital - this.available_beds)
    return missing
  }

  computeUsedBeds(month, activeSim) {
    if (this.activeSim.get(month).critical + this.activeSim.get(month).hospital > this.available_beds) return Math.round(this.available_beds / this.hospital_factor)
    else return Math.round((this.activeSim.get(month).critical + this.activeSim.get(month).hospital) / this.hospital_factor)
  }

  computeUsedBedsNumber(month, activeSim) {
    if (this.activeSim.get(month).critical + this.activeSim.get(month).hospital > this.available_beds) return this.available_beds
    else return (this.activeSim.get(month).critical + this.activeSim.get(month).hospital)
  }

  computeBaseUsedBeds(month, baseSim, activeSim) {
    let beds = 0

    if (baseSim.get(month).critical + baseSim.get(month).hospital > this.available_beds) beds = this.available_beds
    else beds = baseSim.get(month).critical + baseSim.get(month).hospital

    return Math.round((beds - this.computeUsedBedsNumber(month, activeSim)) / this.hospital_factor)
  }

  computeBaseUsedBedsNumber(month, baseSim, activeSim) {
    let beds = 0

    if (baseSim.get(month).critical + baseSim.get(month).hospital > this.available_beds) beds = this.available_beds
    else beds = baseSim.get(month).critical + baseSim.get(month).hospital

    return (beds)
  }

  computeFreeBeds(month, activeSim) {
    return Math.round(Math.max(0, this.available_beds - this.activeSim.get(month).critical - this.activeSim.get(month).hospital) / this.hospital_factor)
  }

  computeFreeBedsNumber(month, activeSim) {
    return Math.max(0, this.available_beds - this.activeSim.get(month).critical - this.activeSim.get(month).hospital)
  }

  computeBaseFreeBeds(month, baseSim, activeSim) {
    let free = Math.max(0, this.available_beds - baseSim.get(month).critical - baseSim.get(month).hospital) - Math.max(0, this.available_beds - activeSim.get(month).critical - activeSim.get(month).hospital)

    return Math.round(free / this.hospital_factor)
  }

  computeBaseFreeBedsNumber(month, baseSim, activeSim) {
    let free = Math.max(0, this.available_beds - baseSim.get(month).critical - baseSim.get(month).hospital)

    return free
  }

  computeCritical(month, activeSim) {
    return Math.round(this.activeSim.get(month).critical / this.person_factor)
  }

  computeCriticalNumber(month, activeSim) {
    return Math.round(this.activeSim.get(month).critical)
  }

  computeBaseCritical(month, baseSim, activeSim) {
    let critical = baseSim.get(month).critical - activeSim.get(month).critical
    return Math.round(critical / this.person_factor)
  }

  computeBaseCriticalNumber(month, baseSim, activeSim) {
    let critical = baseSim.get(month).critical
    return Math.round(critical)
  }

  computeFree(month, activeSim) {
    return Math.round(Math.max(0, this.available_beds - this.activeSim.get(month).critical - this.activeSim.get(month).hospital) / (this.person_factor))
  }

  computeFreeNumber(month, activeSim) {
    return Math.max(0, this.available_beds - this.activeSim.get(month).critical - this.activeSim.get(month).hospital)
  }

  computeInfected(month, activeSim) {
    return Math.round((this.activeSim.get(month).infected - this.activeSim.get(month).critical) / this.person_factor)
  }

  computeInfectedNumber(month, activeSim) {
    return (this.activeSim.get(month).infected - this.activeSim.get(month).critical)
  }

  computeBaseInfected(month, baseSim, activeSim) {
    let infected = (baseSim.get(month).infected - baseSim.get(month).critical) - (activeSim.get(month).infected - activeSim.get(month).critical)
    return Math.round(infected / this.person_factor)
  }

  computeBaseInfectedNumber(month, baseSim, activeSim) {
    let infected = (baseSim.get(month).infected - baseSim.get(month).critical)
    return infected
  }

  computeRecovered(month, activeSim) {
    return Math.round(this.activeSim.get(month).recovered / this.person_factor)
  }

  computeRecoveredNumber(month, activeSim) {
    return this.activeSim.get(month).recovered
  }

  computeBaseRecovered(month, baseSim, activeSim) {
    let recovered = baseSim.get(month).recovered - activeSim.get(month).recovered
    return Math.round(recovered / this.person_factor)
  }

  computeBaseRecoveredNumber(month, baseSim, activeSim) {
    let recovered = baseSim.get(month).recovered
    return recovered
  }

  reductionChanged(new_v, old_v) {
    if (this.sim) this.activeSim = this.sim.get(new_v)
  }

  onChange() {
    this.activeSim = this.activeSim
  }
  onChangeBeds() {
    let temp = this.activeSim
    this.activeSim = null
    this.activeSim = temp
  }

  leichtTooltip = `
  Schulen sind geschlossen.
  <br>
  Keine Veranstaltungen.
  `;

  mittelTooltip = `
  Geschäfte sind geschlossen.
  <br>
  Keine Aufenthalte im öffentlichen Raum.
  `;

  starkTooltip = `
  Menschen bleiben so gut wie möglich zuhause.
  `;

  aboutTooltip = `
  Diese Visualisierung basiert auf einer Simulation für Wien erstellt von der dwh GmbH.
  <br>
  <br>
  Sie wurde erstellt von Christoph Kralj (<a href="https://christoph.github.io/" target="_blank">christoph.github.io</a>), und ist eine Zusammenarbeit
  der dwh GmbH (<a href="http://www.dwh.at/" target="_blank">dwh.at</a>) und der Data Science Plattform der Uni Wien
  (<a href="https://datascience.univie.ac.at/" target="_blank">datascience.univie.ac.at</a>).
  `;
}