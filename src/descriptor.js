export class UnicodeDescriptor {

  constructor(config = {}) {
    this.characters = config.characters || {hl: '─', vl: '│', ctl: '┘', ctr: '└', cross: '┼', tt: '┴', tb: '┬', tr: '├', tl: '┤'};
    this.indentLabels = typeof config.indentLabels === "undefined" ? true : config.indentLabels;
    this.sections = [];
    this.lines = [];
  }

  generate() {
    var sectionData = this.generateSectionLines();
    var sections = sectionData.sections;
    var sectionLines = sectionData.lines;

    // Draw the indicator lines.
    sections.forEach((section, index) => {
      var lineIndex = section.line;
      var line = sectionLines[lineIndex];
      var indicatorIndex = Math.max(0, line.slice(section.offset, section.offset + section.length).indexOf(this.characters.hl)) + section.offset;
      section.indicator = indicatorIndex;

      this.setIndicatorCharacter(line, indicatorIndex);

      // Draw the indicator connectors for all following lines.
      sectionLines.filter((line, index) => index > lineIndex).forEach((line) => {
      	this.setConnectorCharacter(line, indicatorIndex);
      });
    });

    var indicatorLines = this.generateIndicatorLines(sectionLines, sections);

    this.lines = [...sectionLines, ...indicatorLines];
  }

  generateSectionLines() {
    var lines = [];
    var sections = [];

    var currentSections = this.sections.slice();

    // Draw the sections.
    while (currentSections.length > 0) {
      var line = [];
      var nextSections = [];

      // Determine which sections fit on the current line.
      for (var sectionIndex = 0; sectionIndex < currentSections.length; sectionIndex++) {
        var section = currentSections[sectionIndex];
        section.line = lines.length;

        // Check whether the section fits in this line.
        if (line.length - 1 > section.offset) {
        	// It does not. Try it with the next line.
          nextSections.push(section);
          continue;
        }

        // Add missing spaces in front of the section.
        this.fillWithChars(line, section.offset, ' ');

        // Draw the line.
        this.setSectionStartChar(line, section.offset, section.length);
        this.fillWithChars(line, section.offset + section.length - 1, this.characters.hl);
        this.setSectionEndChar(line, section.offset + section.length - 1, section.length);

        // Connect with the top.
        if (lines.length > 0) {
        	lines.forEach((line, index) => {
          	this.setConnectorCharacter(line, section.offset);
          	this.setConnectorCharacter(line, section.offset + section.length - 1);
          });
        }

        sections.push(section);
      }

      lines.push(line);

      currentSections = nextSections;
    }

    return { lines, sections };
  }

  generateIndicatorLines(sectionLines, sections) {
    var lines = [];

    // Draw label lines.
    var indicatorSections = sections.sort((a, b) => a.indicator - b.indicator);

    // Determine where the labels should begin.
    var indicatorTargetIndex = Math.max(...indicatorSections.map((section) => section.indicator)) + 2;

    if (this.indentLabels) {
      for (var i = 0; i < sections.length; i++) {
        var line = [];

        indicatorSections.filter((section, index) => {
          return index <= (sections.length - 1 - i);
        }).forEach((section, index) => {
          this.fillWithChars(line, section.indicator, ' ');

          if (index === (sections.length - 1 - i)) { // It's my turn!
            line.push(this.characters.ctr);
            this.fillWithChars(line, indicatorTargetIndex, this.characters.hl);
            line.push(' ' + section.label);
          } else {
            line.push(this.characters.vl);
          }
        });

        lines.push(line);
      }
    } else {
      var sectionsLeft = indicatorSections;

      while (sectionsLeft.length > 0) {
        var nextSections = [];
        var line = [];

      	sectionsLeft.forEach((section, index) => {
          this.fillWithChars(line, section.indicator, ' ');

        	if (index < sectionsLeft.length - 1 && section.indicator + section.label.length >= sectionsLeft[index + 1].indicator) { // does not fit in this line
          	this.setConnectorCharacter(line, section.indicator);
            nextSections.push(section);
          	return;
          }

          line.push(...section.label);
        });

        lines.push(line);
        sectionsLeft = nextSections;
      }
    }

    return lines;
  }

  setSectionStartChar(data, index, length) {
  	if (data.length <= index) {
    	data.push(length > 1 ? this.characters.ctr : this.characters.vl);
    	return;
    }
    data[index] = this.characters.tt;
  }

  setSectionEndChar(data, index, length) {
  	if (length <= 1) return;
    data.push(this.characters.ctl);
  }

  setConnectorCharacter(data, index) {
  	// If the line is not long enough yet, add a vertical line at the right position.
  	if (data.length <= index) {
    	this.fillWithChars(data, index, ' ');
      data[index] = this.characters.vl;
      return;
    }

    var currentChar = data[index];
    switch (currentChar) {
    	case ' ':
    	case this.characters.hl: return (data[index] = this.characters.vl);
    	case this.characters.ctr: return (data[index] = this.characters.tr);
    	case this.characters.ctl: return (data[index] = this.characters.tl);
      default: return;
    }
  }

  setIndicatorCharacter(data, index) {
    var currentChar = data[index];
    switch (currentChar) {
    	case this.characters.hl: return (data[index] = this.characters.tb);
      case this.characters.ctr: return (data[index] = this.characters.tr);
      case this.characters.tt: return (data[index] = this.characters.cross);
      default: return;
    }
  }

  fillWithChars(data, length, char) {
  	for (var i = data.length; i < length; i++) {
    	if (data && typeof data === 'object' && data.constructor === Array) { // is array
    		data.push(char);
      } else { // is string
      	data += char;
      }
    }
  }

  addSection(offset, length, label) {
    this.sections.push({ offset, length, label });

    // Order sections by smallest offsets and biggest lengths.
    this.sections.sort((a, b) => {
    	var result = a.offset - b.offset;
      if (result === 0) {
      	result = b.length - a.length;
      }
      return result;
    });

    // Regenerate the descriptions.
    this.generate();
  }

  getLines() {
    return this.lines.map((line) => line.join(''));
  }

  toString() {
    return this.getLines().join('\n');
  }
}
