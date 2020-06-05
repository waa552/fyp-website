//File contains constraints and run conditions for functions.js file
//

//window.onload = function() {
    //document.getElementById('runBtn').addEventListener('click', run)
//document.getElementById('printBtnNew').addEventListener('click', printDiv('results'))
//document.getElementById('printBtnFAQ').addEventListener('click', printDiv('FAQ'))
//}

var coll = document.getElementsByClassName("collapsible")
var i;
for (i=0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active")
        var content = this.nextElementSibling
        if (content.style.display === "none") {
            content.style.display = "block"
        } else {
            content.style.display = "none"
        }
    })
}

var coll2 = document.getElementsByClassName("collapsibleimg")
var i;
for (i=0; i < coll2.length; i++) {
    coll2[i].addEventListener("click", function() {
        this.classList.toggle("active")
        var content = this.nextElementSibling
        if (content.style.display === "block") {
            content.style.display = "none"
        } else {
            content.style.display = "block"
        }
    })
}

//document.getElementById("runBtn").onclick = runBtn
window.onload = function() {
    document.getElementById('runBtn').addEventListener('click', run)
}

function run(Fy) {
    var quality = fquality()
    console.log(quality)
    var material = materialGet()           
    console.log(material) 
    var profileShift = profileShiftGet()        // .pinion, .wheel
    var angle = angleGet()                      // .pressure(.deg, .rad), .helix(.deg, .rad)

    var a0 = centreDistGet()                     // .min, .max

    var ratio0 = ratioFind()                     // .min, .max
    var z = minTeethFind(angle, ratio0)   // .pinion, .wheel
    // // var module = checkIfMod(moduleMin, moduleMax)
    console.log(z)
    var Fy1 = FyInterp(z,Fy)
    console.log(Fy1)
    var gearGeom = gearDims(module, z, angle, a)   // .centreDist, .centreDistWork .addendum, .dedendum, .y, .pinion(.base, .pitch, .tip, .root), .wheel(.base, .pitch, .tip, .root)
    console.log(gearGeom)
    var {power, speed, torque} = powerSpeedTorqueGet()
    var power = powerGet(power, speed, torque)
    var speed = speedGet(power, speed, torque)
    console.log(speed)
    var torque = torqueGet(power, speed, torque)
    var torqueWheel = torqueWheelf(torque, z)
    var tanLoad = nomTanLoad(torque, torqueWheel, gearGeom, module)

    let b = 20
    var {a, z, module, epsil, ratio} = contactRatioTeeth(angle, a0, z, b)
    //var z = teethNumFind(ratio, minTeeth)       // .ratio, .wheel, .pinion
    console.log(epsil)

    //var module = modLims(a, z)        
    // var newModArray = moduleArray.filter(moduleGet)
    // document.getElementById('possibleMods').innerHTML = newModArray
    // var epsil = contactRatioFind(z, module, angle, gearGeom)    //.y, .a

    var sigma_hlim = permissibleContactStress(material)
    var sigma_flim = permissibleBendingStress(material)

    var {N, c_dash} = Kv1(ratio, material, z, angle, profileShift, quality, module, gearGeom, epsil, speed, torque, tanLoad, Ka, Ky, sigma_hlim)
    var Kv = Kv2(ratio, material, z, angle, profileShift, quality, module, gearGeom, epsil, speed, torque, tanLoad, Ka, Ky, sigma_hlim, sigma_flim, b, N, c_dash)

    var rootstressNom = toothRootStressCalc2(epsil, angle, z, Fy)
    var sigma_f = rootBendingStress(Ka, Ky, Kv, Kfb, Kfa, b, module, tanload, epsil)
    
    
    // var f_tnom = nomTanLoad(torque, torqueWheel, gearGeom)

}

//default values
document.getElementById("Ka_in").defaultValue = 1;
document.getElementById("Kv_in").defaultValue = 1;
document.getElementById("Kha_in").defaultValue = 1;
document.getElementById("Khb_in").defaultValue = 1;
document.getElementById("Kfa_in").defaultValue = 1;


// window.onload = function() {
//     var runBtnVar = document.getElementById('runBtn')

//     if (runBtnVar) {
//         runBtnVar.addEventListener('click', inputRatioGet())
//         runBtnVar.addEventListener('click', moduleGet())
//     }
// }

//Filter the module array between max and min centre distance
//let newModArray = moduleArray.filter(moduleGet)
