function calculate() {

    // INPUTS
    let fleet = parseFloat(document.getElementById("fleet").value);
    let distance = parseFloat(document.getElementById("distance").value);
    let mileage = parseFloat(document.getElementById("mileage").value);

    let fuelEnergy = parseFloat(document.getElementById("fuelEnergy").value);
    let scaling = parseFloat(document.getElementById("scaling").value);

    let qualityFactor = parseFloat(document.getElementById("quality").value);
    let congestion = parseFloat(document.getElementById("congestion").value);

    if (!fleet || !distance || !mileage) {
        alert("Enter valid inputs");
        return;
    }

    // EMISSION LIMITS (Excel mapping)
    let limits = {
        "NOx": 0.46,
        "PM": 0.01,
        "CO": 4,
        "HC": 0.16
    };

    // STEP 1: Adjust mileage
    let adjMileage = mileage / qualityFactor;

    // STEP 2: Energy consumption (kWh/km)
    let energy_per_km = fuelEnergy / adjMileage;

    // STEP 3: Fuel consumption
    let totalFuel = distance / adjMileage;

    // STEP 4: DEF consumption (~5%)
    let DEF = totalFuel * 0.05;

    // CLEAR TABLE
    let table = document.getElementById("resultTable");
    table.innerHTML = `
        <tr>
            <th>Pollutant</th>
            <th>g/km</th>
            <th>Total Emission (kg)</th>
        </tr>
    `;

    // CALCULATION LOOP
    for (let pollutant in limits) {

        let g_per_km = limits[pollutant] * energy_per_km * scaling;

        let total_g = g_per_km * distance * fleet;
        let total_kg = (total_g / 1000) * congestion;

        table.innerHTML += `
            <tr>
                <td>${pollutant}</td>
                <td>${g_per_km.toFixed(2)}</td>
                <td>${total_kg.toFixed(2)}</td>
            </tr>
        `;
    }

    // SUMMARY
    document.getElementById("summary").innerHTML = `
        <br>
        <b>Fuel Consumption:</b> ${totalFuel.toFixed(0)} L <br>
        <b>DEF Consumption:</b> ${DEF.toFixed(0)} L <br>
        <b>Energy Consumption:</b> ${energy_per_km.toFixed(2)} kWh/km
    `;
}