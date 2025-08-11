class UnitConverter {
    constructor() {
        this.units = {
            longitud: [
                { name: 'Milímetros', abbr: 'mm', factor: 0.001 },
                { name: 'Centímetros', abbr: 'cm', factor: 0.01 },
                { name: 'Metros', abbr: 'm', factor: 1 },
                { name: 'Kilómetros', abbr: 'km', factor: 1000 },
                { name: 'Pulgadas', abbr: 'in', factor: 0.0254 },
                { name: 'Pies', abbr: 'ft', factor: 0.3048 },
                { name: 'Millas', abbr: 'mi', factor: 1609.34 }
            ],
            peso: [
                { name: 'Gramos', abbr: 'g', factor: 0.001 },
                { name: 'Kilogramos', abbr: 'kg', factor: 1 },
                { name: 'Toneladas', abbr: 't', factor: 1000 },
                { name: 'Onzas', abbr: 'oz', factor: 0.0283495 },
                { name: 'Libras', abbr: 'lb', factor: 0.453592 }
            ],
            temperatura: [
                { name: 'Celsius', abbr: '°C' },
                { name: 'Fahrenheit', abbr: '°F' },
                { name: 'Kelvin', abbr: 'K' }
            ],
            volumen: [
                { name: 'Mililitros', abbr: 'ml', factor: 0.001 },
                { name: 'Litros', abbr: 'l', factor: 1 },
                { name: 'Metros cúbicos', abbr: 'm³', factor: 1000 },
                { name: 'Galones', abbr: 'gal', factor: 3.78541 },
                { name: 'Onzas líquidas', abbr: 'fl oz', factor: 0.0295735 }
            ]
        };
    }

    convert(value, fromUnit, toUnit, category) {
        if (category === 'temperatura') {
            return this.convertTemperature(value, fromUnit, toUnit);
        }
        
        const baseValue = value * this.getFactor(fromUnit, category);
        return baseValue / this.getFactor(toUnit, category);
    }

    convertTemperature(value, fromUnit, toUnit) {
        // Convertir a Celsius primero
        let celsius;
        switch (fromUnit) {
            case '°C':
                celsius = value;
                break;
            case '°F':
                celsius = (value - 32) * 5/9;
                break;
            case 'K':
                celsius = value - 273.15;
                break;
        }

        // Convertir de Celsius a la unidad destino
        switch (toUnit) {
            case '°C':
                return celsius;
            case '°F':
                return (celsius * 9/5) + 32;
            case 'K':
                return celsius + 273.15;
        }
    }

    getFactor(unitAbbr, category) {
        const unit = this.units[category].find(u => u.abbr === unitAbbr);
        return unit ? unit.factor : 1;
    }

    getUnits(category) {
        return this.units[category] || [];
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const converter = new UnitConverter();
    const inputValue = document.getElementById('inputValue');
    const resultValue = document.getElementById('resultValue');
    const inputUnit = document.getElementById('inputUnit');
    const outputUnit = document.getElementById('outputUnit');
    const swapBtn = document.getElementById('swapBtn');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    let currentCategory = 'longitud';
    
    // Cargar unidades iniciales
    loadUnits(currentCategory);
    
    // Convertir al cambiar valores
    [inputValue, inputUnit, outputUnit].forEach(el => {
        el.addEventListener('input', convertUnits);
    });
    
    // Botón de intercambio
    swapBtn.addEventListener('click', () => {
        const tempUnit = inputUnit.value;
        inputUnit.value = outputUnit.value;
        outputUnit.value = tempUnit;
        convertUnits();
    });
    
    // Cambiar categorías
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            loadUnits(currentCategory);
        });
    });
    
    // Cargar unidades en los selects
    function loadUnits(category) {
        const units = converter.getUnits(category);
        
        // Limpiar selects
        inputUnit.innerHTML = '';
        outputUnit.innerHTML = '';
        
        // Llenar con nuevas unidades
        units.forEach(unit => {
            const option1 = document.createElement('option');
            option1.value = unit.abbr;
            option1.textContent = `${unit.abbr} - ${unit.name}`;
            
            const option2 = document.createElement('option');
            option2.value = unit.abbr;
            option2.textContent = `${unit.abbr} - ${unit.name}`;
            
            // Seleccionar valores por defecto
            if (category === 'longitud') {
                if (unit.abbr === 'm') inputUnit.appendChild(option1);
                if (unit.abbr === 'cm') outputUnit.appendChild(option2);
            } else if (category === 'peso') {
                if (unit.abbr === 'kg') inputUnit.appendChild(option1);
                if (unit.abbr === 'g') outputUnit.appendChild(option2);
            } else if (category === 'temperatura') {
                if (unit.abbr === '°C') inputUnit.appendChild(option1);
                if (unit.abbr === '°F') outputUnit.appendChild(option2);
            } else if (category === 'volumen') {
                if (unit.abbr === 'l') inputUnit.appendChild(option1);
                if (unit.abbr === 'ml') outputUnit.appendChild(option2);
            }
            
            if (unit.abbr !== inputUnit.value) inputUnit.appendChild(option1);
            if (unit.abbr !== outputUnit.value) outputUnit.appendChild(option2);
        });
        
        convertUnits();
    }
    
    // Función de conversión
    function convertUnits() {
        const value = parseFloat(inputValue.value);
        
        if (isNaN(value)) {
            resultValue.value = '';
            return;
        }
        
        const from = inputUnit.value;
        const to = outputUnit.value;
        
        const result = converter.convert(
            value, 
            from, 
            to, 
            currentCategory
        );
        
        resultValue.value = result.toFixed(6).replace(/\.?0+$/, '');
    }
});