//File contains constraints and run conditions for functions.js file
//

//window.onload = function() {
    //document.getElementById('runBtn').addEventListener('click', run)
//document.getElementById('printBtnNew').addEventListener('click', printDiv('results'))
//document.getElementById('printBtnFAQ').addEventListener('click', printDiv('FAQ'))
//}

var coll = document.getElementsByClassName("collapsible")
for (let i=0; i < coll.length; i++) {
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
for (let i=0; i < coll2.length; i++) {
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

function run() {
    console.log(document.getElementById("FinishSelection").value)
    const Ka = KaGet()
    const Fy = new Array([10, 0.201],[11,0.226],[12,245],[13,0.264],[14,0.276],[15,0.289],[16,0.295],[17,0.302],[18,0.308],[19,0.314],[20,0.320],[22,0.330],[24,0.337],[26,0.344],[28,0.352],[30,0.358],[32,0.364],[34,0.370],[36,0.377],[38,0.383],[40,0.389],[45,0.399],[50,0.408],[55,0.415],[60,0.421],[65,0.425],[70,0.429],[75,0.433],[80,0.436],[90,0.442],[100,0.446],[150,0.458],[200,0.436],[300,0.471])
    const quality = fquality()
    const material = materialGet()      

    var profileShift = profileShiftGet()        // .pinion, .wheel
    const angle = angleGet()                      // .pressure(.deg, .rad), .helix(.deg, .rad)

    const a0 = centreDistGet()                     // .min, .max

    const ratio0 = ratioFind()                     // .min, .max
    var z = minTeethFind(angle, ratio0)   // .pinion, .wheel
    // // var module = checkIfMod(moduleMin, moduleMax)

    var {power, speed, torque} = powerSpeedTorqueGet()
    var power = powerGet(power, speed, torque)
    var speed = speedGet(power, speed, torque)
    var torque = torqueGet(power, speed, torque)
    var torqueWheel = torqueWheelf(torque, z)

    var {a, z, module, epsil, ratio, b} = contactRatioTeeth(angle, a0, z)
    var b_1 = b
    var gearGeom = gearDims(module, z, angle, a)   // .centreDist, .centreDistWork .addendum, .dedendum, .y, .pinion(.base, .pitch, .tip, .root), .wheel(.base, .pitch, .tip, .root)
    var tanLoad = nomTanLoad(torque, torqueWheel, gearGeom, module)
    //var module = modLims(a, z)        
    // var newModArray = moduleArray.filter(moduleGet)
    // document.getElementById('possibleMods').innerHTML = newModArray
    // var epsil = contactRatioFind(z, module, angle, gearGeom)    //.y, .a
    console.log(z)
    console.log(gearGeom)
    console.log(epsil)
    console.log(tanLoad)
    const sigma_hlim = limitContactStress(material)
    const sigma_flim = limitBendingStress(material)
    var {ffa_eff, fpb_eff} = tolerances(gearGeom, module, quality, sigma_hlim)
    var {N, c_dash} = Kv1(ratio, material, z, angle, profileShift, quality, module, gearGeom, epsil, speed)
    var Kv = Kv2(material, module, gearGeom, epsil, tanLoad, Ka, Ky, sigma_hlim, b, N, c_dash, ffa_eff, fpb_eff)

    var Yf = FyInterp(z, Fy)
    console.log(Yf)
    console.log(epsil)
    var sigma_f0 = toothRootStressCalc2(epsil, angle, z, Fy, tanLoad, b, module, Yf)
    var Kfa = funcKfa(epsil, c_dash, fpb_eff, tanLoad, Ka, Ky, Kv, b)
    var Kha = Kfa
    // Kfb is 4th input == 1, check if == 2.5 ish
    var sigma_fp = permissibleBendingStress(sigma_flim, module, speed)
    var sigma_hp = permissibleContactStress(sigma_hlim, speed, gearGeom)

    var sigma_f = rootBendingStress(Ka, Ky, Kv, 1, epsil, sigma_f0, c_dash, fpb_eff, tanLoad, b, Kfa)
    var sigma_h = contactStress(tanLoad, ratio, gearGeom, b, Ka, Ky, Kv, 1, Kha, angle, z, material, epsil)
    
    // var f_tnom = nomTanLoad(torque, torqueWheel, gearGeom)
    var b_0 = 0.5
        
    var sigma_f_b0 = bStress(Kfa, angle, a0, z, b_0, ratio, material, profileShift, quality, module, gearGeom, epsil, speed, tanLoad, Ka, Ky, sigma_hlim, N, c_dash, ffa_eff, fpb_eff, Fy, Kv, sigma_f0)
    var sigma_h_b0 = cStress(tanLoad, ratio, gearGeom, b_0, Ka, Ky, Kv, Kha, angle, z, material, epsil, a0, profileShift, quality, module, speed, sigma_hlim, N, c_dash, ffa_eff, fpb_eff)

    var j = b_0
    var k = b_1
    for (let index=1; index<20; index++) {
        var y = ((sigma_fp-sigma_f.pinion)/(sigma_f_b0.pinion-sigma_f.pinion))*(1/j-1/k)+1/k
        var j = k
        var k = y

        var b_f = 1/y
        var sigma_f_b0 = sigma_f
        var sigma_f = bStress(Kfa, angle, a0, z, b_f, ratio, material, profileShift, quality, module, gearGeom, epsil, speed, tanLoad, Ka, Ky, sigma_hlim, N, c_dash, ffa_eff, fpb_eff, Fy, Kv, sigma_f0)
        if (sigma_f.pinion-sigma_fp<=Math.abs(sigma_hp/1000) && sigma_f.pinion <= sigma_fp) {
            break
        }
    }
    console.log(b_f)
    console.log(sigma_fp)
    console.log(sigma_f) 

    var m = Math.sqrt(1/b_0)
    var n = Math.sqrt(1/b_1)
    for (let index=1; index<8; index++) {
        var x = ((sigma_hp-sigma_h.pinion)/(sigma_h_b0.pinion-sigma_h.pinion))*(m-n)+n
        var m = n
        var n = x
        
        b_h = 1/(x**2)
        var sigma_h_b0 = sigma_h
        var sigma_h = cStress(tanLoad, ratio, gearGeom, b_h, Ka, Ky, Kv, Kha, angle, z, material, epsil, a0, profileShift, quality, module, speed, sigma_hlim, N, c_dash, ffa_eff, fpb_eff)
        if (sigma_h.pinion-sigma_hp<=Math.abs(sigma_hp/1000) && sigma_h.pinion <= sigma_hp) {
            break
        }
    }
    console.log(b_h)
    console.log(sigma_hp)
    console.log(sigma_h)
    
    var bOut = Math.max(b_f, b_h)

    var pc = Math.PI*module
    var bRec = 2*pc
    console.log(bRec)

    if (angle.helix.rad == 0) {
        var bHel = 0
    } else {
        var bHel = 1.15*pc/(Math.tan(angle.helix.rad))
    }
   
    document.getElementById('pinionTeeth').innerHTML = z.pinion
    document.getElementById('wheelTeeth').innerHTML = z.wheel
    document.getElementById('ratio').innerHTML = Math.round(1000*ratio)/1000
    document.getElementById('moduleNum').innerHTML = module
    document.getElementById('centreDist').innerHTML = a

    document.getElementById('bNum').innerHTML = Math.ceil(bOut*1000)/1000
    if (bOut < bRec) {
        document.getElementById('bRec').innerHTML = Math.ceil(bRec*1000)/1000
    } else {
        document.getElementById('bRec').innerHTML = "--"
    }
    if (bOut < bHel) {
        document.getElementById('bHel').innerHTML = Math.ceil(bHel*1000)/1000
    } else {
        document.getElementById('bHel').innerHTML = "--"
    }
    
    document.getElementById('sigmaFNum').innerHTML = Math.round(sigma_f.pinion*1000)/1000
    document.getElementById('sigmaHNum').innerHTML = Math.round(sigma_h.pinion*1000)/1000


        //console.log(sigma_f_b0)
    var sigmaLewis = stressLewisEquation(b, tanLoad, Yf, module, Kv)
       // for (i=1; i<= 10; i++) {
    //     if (sigma_f > sigma_fp) {
    //         bArray[i+1][0] = 2*b
    //     } else if (bArray[i][1] < sigma_fp && bArray[i-1][1] > sigma_fp) {
    //         bArray[i+1][0] = (bArray[i][0]+bArray[i-1][0])/2
    //     } else if (bArray[i][1] > sigma_fp && bArray[i-1][0] > sigma_fp) {
    //         bArray[i+1][0] = (bArray[i][0]+bArray[0][0])/2
    //     } else if (bArray[i][1] < sigma_fp && bArray[i-1][1] < sigma_fp) {
    //         bArray[i+1][0] = (bArray[i][0]+bArray[i-1][0])/2
    //     }
    // }

    // if (Math.max(sigma_h) > sigma_hp || Math.max(sigma_f) > sigma_fp) {
    //     b = b+5

    // }


    // for (i=1; i<=10; i++) {
    //     if (sigma_f_left > sigma_fp && sigma_f_right < sigma_fp) {
    //         b = (left+right)/2
    //         sigma_f = bStress(angle, a0, z, b, ratio, material, profileShift, quality, module, gearGeom, epsil, speed, tanLoad, Ka, Ky, sigma_hlim, N, c_dash, ffa_eff, fpb_eff, Fy, Kv, sigma_f0)
    //         if (sigma_f > sigma_fp) {
    //             sigma_f_left = sigma_f
    //             left = b
    //         } else {
    //             sigma_f_right = sigma_f
    //             right = b
    //         }
    //     }   
    // }
    // console.log(sigma_f)
    // console.log(b)


}

//default values



// window.onload = function() {
//     var runBtnVar = document.getElementById('runBtn')

//     if (runBtnVar) {
//         runBtnVar.addEventListener('click', inputRatioGet())
//         runBtnVar.addEventListener('click', moduleGet())
//     }
// }

//Filter the module array between max and min centre distance
//let newModArray = moduleArray.filter(moduleGet)
