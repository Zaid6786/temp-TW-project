const fs = require('fs');
const path = require('path');

const studentComponents = [
  'live-map', 'bus-list', 'bus-details', 'recommended-bus', 'notifications', 'profile', 'history'
];

const adminComponents = [
  'dashboard', 'login', 'live-map', 'manage-bus', 'manage-driver', 'manage-route', 
  'manage-stops', 'manage-students', 'reports', 'settings'
];

function createComponent(moduleName, compName) {
  const dir = path.join(__dirname, 'frontend', 'bus-tracker-app', 'src', 'app', 'modules', moduleName, compName);
  
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }

  const tsContent = `import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-${compName}',
  templateUrl: './${compName}.component.html',
  styleUrls: ['./${compName}.component.scss']
})
export class ${compName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Component implements OnInit {
  constructor() { }
  ngOnInit(): void { }
}
`;

  const htmlContent = `<h2>${compName.replace(/-/g, ' ')} works!</h2>`;
  const scssContent = ``;

  fs.writeFileSync(path.join(dir, `${compName}.component.ts`), tsContent);
  fs.writeFileSync(path.join(dir, `${compName}.component.html`), htmlContent);
  fs.writeFileSync(path.join(dir, `${compName}.component.scss`), scssContent);
}

studentComponents.forEach(c => createComponent('student', c));
adminComponents.forEach(c => createComponent('admin', c));
console.log('Done generating components.');
